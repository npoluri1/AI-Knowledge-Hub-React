import http from 'http'
import https from 'https'
import { spawn } from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import busboy from 'busboy'
import { PDFParse } from 'pdf-parse'
import WordExtractor from 'word-extractor'
import mammoth from 'mammoth'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Load local environment files because `scan-server.js` runs as a separate
// concurrent process and cannot inherit mutations made by the manifest script.
function loadDotEnv() {
  const candidates = [path.resolve(__dirname, '.env'), path.resolve(__dirname, '..', '.env')]
  for (const filePath of candidates) {
    if (!fs.existsSync(filePath)) continue
    try {
      const text = fs.readFileSync(filePath, 'utf8')
      for (const rawLine of text.split(/\r?\n/)) {
        const line = rawLine.trim()
        if (!line || line.startsWith('#')) continue
        const separator = line.indexOf('=')
        if (separator < 0) continue
        const key = line.slice(0, separator).trim()
        let value = line.slice(separator + 1).trim()
        if (value.length >= 2 && ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'")))) {
          value = value.slice(1, -1)
        }
        if (key && process.env[key] === undefined) process.env[key] = value
      }
    } catch (_error) {
      // Environment loading is best effort; the local fallback still works.
    }
    break
  }
}
loadDotEnv()

// Scan server owns the chat / file-scan / github endpoints. The Python
// FastAPI backend (backend/main.py) serves the rest of /api on port 9000,
// so this node server uses a separate port to avoid an EADDRINUSE conflict.
const PORT = 9001

// Source site for the "Study by Doing" course reader. It sends
// `frame-ancestors 'self'` so lesson pages can never be iframed cross-origin;
// the /api/sbd-proxy endpoint below fetches a page server-side and serves the
// HTML same-origin instead, with relative links preserved via an injected
// <base> tag.
const SBD_ORIGIN = 'https://ai.studybydoing.in'
const SBD_PROXY_TIMEOUT = 20000

const MANIFEST_PATH = path.resolve(__dirname, 'src', 'fileManifest.json')
const GENERATOR_SCRIPT = path.resolve(__dirname, 'scripts', 'generateManifest.js')
const GITHUB_PERSISTED_PATH = path.resolve(__dirname, 'public', 'github-persisted.json')
const GITHUB_REFRESH_CONFIG_PATH = path.resolve(__dirname, 'public', 'github-refresh-config.json')

function readJsonFile(filePath, fallback) {
  try { return JSON.parse(fs.readFileSync(filePath, 'utf8')) } catch { return fallback }
}

function writeJsonFile(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  const temporaryPath = `${filePath}.${process.pid}.${Date.now()}.tmp`
  fs.writeFileSync(temporaryPath, JSON.stringify(value, null, 2) + '\n', 'utf8')
  try {
    fs.rmSync(filePath, { force: true })
    fs.renameSync(temporaryPath, filePath)
  } catch (error) {
    fs.rmSync(temporaryPath, { force: true })
    throw error
  }
}

function normalizePersistedRepo(repo) {
  if (!repo || typeof repo !== 'object') return null
  const url = String(repo.url || repo.html_url || '').trim()
  const name = String(repo.name || '').trim()
  if (!name || !/^https:\/\/github\.com\/[^/]+\/[^/]+(?:\/)?$/.test(url)) return null
  const description = String(repo.description || `${name} open-source project`).replace(/<[^>]*>/g, '').trim()
  const topics = Array.isArray(repo.topics) ? repo.topics.filter(Boolean).slice(0, 20) : []
  const category = String(repo.category || repo.sourceIndustry || 'Fetched GitHub Repositories').trim()
  return {
    name, url, stars: Number(repo.stars ?? repo.stargazers_count) || 0, description, category,
    features: Array.isArray(repo.features) && repo.features.length ? repo.features.filter(Boolean).slice(0, 6) : [repo.language, ...topics].filter(Boolean).slice(0, 6),
    install: String(repo.install || `git clone ${url}`), useCase: String(repo.useCase || description),
    language: String(repo.language || ''), topics, updated_at: String(repo.updated_at || ''),
    license: String(repo.license?.spdx_id || repo.license || ''), forks: Number(repo.forks) || 0,
    open_issues: Number(repo.open_issues) || 0, source: 'github-fetch', fetchedAt: String(repo.fetchedAt || new Date().toISOString()),
  }
}

function readPersistedGitHub() {
  const data = readJsonFile(GITHUB_PERSISTED_PATH, { version: 1, updatedAt: null, items: [] })
  const byUrl = new Map()
  for (const item of Array.isArray(data.items) ? data.items : []) {
    const normalized = normalizePersistedRepo(item)
    if (normalized) byUrl.set(normalized.url, normalized)
  }
  return { ...data, items: [...byUrl.values()] }
}

function readRequestBody(req, maxBytes = 8 * 1024 * 1024) {
  return new Promise((resolve, reject) => {
    let body = ''; let bytes = 0
    req.on('data', chunk => { bytes += chunk.length; if (bytes > maxBytes) { reject(new Error('Request body is too large')); req.destroy(); return }; body += chunk })
    req.on('end', () => resolve(body)); req.on('error', reject)
  })
}

function sendJson(res, status, payload) {
  if (res.writableEnded) return
  res.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' })
  res.end(JSON.stringify(payload))
}

function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]))
}

// Fetch a URL server-side following redirects, so proxied pages are not subject
// to the upstream site's framing / CSP response headers.
function fetchWithRedirect(url, redirectsLeft = 5) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https:') ? https : http
    const req = client.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36 AI-Knowledge-Hub/1.0',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    }, upstreamRes => {
      if (upstreamRes.statusCode >= 300 && upstreamRes.statusCode < 400 && upstreamRes.headers.location) {
        upstreamRes.resume()
        if (redirectsLeft <= 0) { reject(new Error('Too many redirects')); return }
        fetchWithRedirect(new URL(upstreamRes.headers.location, url).toString(), redirectsLeft - 1).then(resolve, reject)
        return
      }
      if (upstreamRes.statusCode !== 200) {
        upstreamRes.resume()
        reject(new Error(`Upstream returned HTTP ${upstreamRes.statusCode}`))
        return
      }
      resolve({ upstreamRes, finalUrl: url })
    })
    req.setTimeout(SBD_PROXY_TIMEOUT, () => req.destroy(new Error('Upstream request timed out')))
    req.on('error', reject)
  })
}

// Drop any on-page CSP (e.g. frame-ancestors) that could block framing, and make
// the relative hrefs/srcs on the course site resolve against the source host.
function sanitizeProxiedHtml(html) {
  const withoutCsp = html
    .replace(/<meta[^>]*http-equiv=["'][^"']*content-security-policy[^"']*["'][^>]*>/gi, '')
  if (/<base\s/i.test(withoutCsp)) return withoutCsp
  return withoutCsp.replace(/<head([^>]*)>/i, `<head$1>\n<base href="${SBD_ORIGIN}/">`)
}

function handleSbdProxy(remotePath, res) {
  const pathParts = remotePath.split('/').filter(Boolean)
  if (pathParts.includes('..') || pathParts.length === 0) {
    res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' })
    res.end('Bad path')
    return
  }
  const target = `${SBD_ORIGIN}/${pathParts.join('/')}`
  fetchWithRedirect(target).then(({ upstreamRes }) => {
    const chunks = []
    upstreamRes.on('data', chunk => chunks.push(chunk))
    upstreamRes.on('error', error => {
      res.writeHead(502, { 'Content-Type': 'text/html; charset=utf-8' })
      res.end(`<meta charset="utf-8"><title>Proxy error</title><body style="font-family:sans-serif;color:#333;padding:1.5rem;background:#fafafa;text-align:center"><h2>Could not load the Study by Doing page</h2><p>${escapeHtml(error.message)}</p></body>`)
    })
    upstreamRes.on('end', () => {
      const raw = Buffer.concat(chunks)
      const contentType = upstreamRes.headers['content-type'] || 'application/octet-stream'
      const headers = { 'Content-Type': contentType, 'Cache-Control': 'no-store' }
      if (contentType.includes('text/html')) {
        const html = sanitizeProxiedHtml(raw.toString('utf8'))
        headers['Content-Length'] = Buffer.byteLength(html)
        res.writeHead(200, headers)
        res.end(html)
        return
      }
      headers['Content-Length'] = raw.length
      res.writeHead(200, headers)
      res.end(raw)
    })
  }).catch(error => {
    res.writeHead(502, { 'Content-Type': 'text/html; charset=utf-8' })
    res.end(`<meta charset="utf-8"><title>Proxy error</title><body style="font-family:sans-serif;color:#333;padding:1.5rem;background:#fafafa;text-align:center"><h2>Could not load the Study by Doing page</h2><p>${escapeHtml(error.message)}</p></body>`)
  })
}

const MIME_TYPES = {
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png',
  '.gif': 'image/gif', '.svg': 'image/svg+xml', '.webp': 'image/webp',
  '.bmp': 'image/bmp', '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.doc': 'application/msword',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.xls': 'application/vnd.ms-excel',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  '.ppt': 'application/vnd.ms-powerpoint',
  '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  '.txt': 'text/plain', '.csv': 'text/csv', '.json': 'application/json',
  '.mp4': 'video/mp4', '.mp3': 'audio/mpeg',
  '.zip': 'application/zip',
}

function runManifestGenerator() {
  return new Promise((resolve, reject) => {
    const proc = spawn('node', [GENERATOR_SCRIPT], {
      cwd: __dirname,
      stdio: ['ignore', 'pipe', 'pipe'],
      env: { ...process.env }
    })
    let stdout = '', stderr = ''
    proc.stdout.on('data', d => stdout += d)
    proc.stderr.on('data', d => stderr += d)
    proc.on('close', code => {
      if (code === 0) resolve({ stdout, stderr })
      else reject(new Error(`Generator exited with code ${code}: ${stderr.slice(0, 500)}`))
    })
    proc.on('error', reject)
  })
}

function readManifest() {
  try {
    return JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'))
  } catch {
    return null
  }
}

async function serve(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`)
  const pathname = url.pathname

  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.writeHead(204)
    res.end()
    return
  }

  if (pathname === '/api/files' && req.method === 'GET') {
    const manifest = readManifest()
    if (!manifest) {
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({
        images: [], pdfs: [], documents: [], dataFiles: [], allFiles: [],
        scanPaths: [], perSource: {}, generatedAt: new Date().toISOString(),
        totals: { images: 0, pdfs: 0, documents: 0, dataFiles: 0, total: 0 }
      }))
      return
    }
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(manifest))
    return
  }

  if (pathname === '/api/scan-files' && req.method === 'POST') {
    (async () => {
      try {
        await runManifestGenerator()
        const manifest = readManifest()
        const now = new Date().toISOString()
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({
          ok: true,
          persisted: { attempted: true, ok: true },
          fetchedAt: now,
          data: manifest || {
            images: [], pdfs: [], documents: [], dataFiles: [], allFiles: [],
            scanPaths: [], perSource: {}, generatedAt: now
          }
        }))
      } catch (err) {
        console.error('Scan error:', err.message)
        // Fallback: return current manifest even if regenerate failed
        const manifest = readManifest()
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({
          ok: true,
          persisted: { attempted: true, ok: false, error: err.message },
          fetchedAt: new Date().toISOString(),
          data: manifest || { images: [], pdfs: [], documents: [], dataFiles: [], allFiles: [], scanPaths: [], perSource: {}, generatedAt: new Date().toISOString() }
        }))
      }
    })()
    return
  }

  // Serve raw files from extra source directories: /api/raw/<slug>/<filename>
  const rawMatch = pathname.match(/^\/api\/raw\/([a-z0-9_]{1,64})\/(.+)$/)
  if (rawMatch && req.method === 'GET') {
    const slug = rawMatch[1]
    const filename = decodeURIComponent(rawMatch[2])
    const manifest = readManifest()
    let sourceDir = null
    if (manifest && manifest.scanPaths) {
      const src = manifest.scanPaths.find(s => s.slug === slug)
      if (src) sourceDir = src.dir
    }
    if (!sourceDir) {
      res.writeHead(404)
      res.end('Source not found')
      return
    }
    const requestedFile = path.resolve(sourceDir, filename)
    if (!requestedFile.startsWith(path.resolve(sourceDir))) {
      res.writeHead(403)
      res.end('Forbidden')
      return
    }
    if (!fs.existsSync(requestedFile)) {
      res.writeHead(404)
      res.end('File not found')
      return
    }
    const ext = path.extname(requestedFile).toLowerCase()
    const mime = MIME_TYPES[ext] || 'application/octet-stream'
    const stat = fs.statSync(requestedFile)
    res.writeHead(200, {
      'Content-Type': mime,
      'Content-Length': stat.size,
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'public, max-age=86400'
    })
    const stream = fs.createReadStream(requestedFile)
    stream.pipe(res)
    stream.on('error', () => {
      res.writeHead(500)
      res.end('Stream error')
    })
    return
  }

  // Study By Doing embed proxy — serves lesson pages same-origin so the
  // source site's `frame-ancestors 'self'` CSP can't block the framed reader.
  if (pathname.startsWith('/api/sbd-proxy/') && req.method === 'GET') {
    handleSbdProxy(pathname.slice('/api/sbd-proxy/'.length), res)
    return
  }

  // Chat endpoint — streams LLM responses from OpenRouter (free tier)
  if (pathname === '/api/chat' && req.method === 'POST') {
    let body = ''
    req.on('data', chunk => body += chunk)
    req.on('end', () => {
      try {
        const { messages } = JSON.parse(body)
        streamChat(messages, res)
      } catch {
        res.writeHead(400, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: 'Invalid request body' }))
      }
    })
    return
  }

  // Health check
  if (pathname === '/api/health' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ status: 'ok', service: 'scan-server' }))
    return
  }

  // GitHub repo search — proxies to api.github.com/search/repositories
  if (pathname === '/api/github/search' && req.method === 'GET') {
    const q = url.searchParams.get('q') || ''
    const topics = url.searchParams.get('topics') || ''
    const sort = url.searchParams.get('sort') || 'stars'
    const order = url.searchParams.get('order') || 'desc'
    const perPage = Math.min(parseInt(url.searchParams.get('per_page') || '30', 10) || 30, 100)
    let query = q.trim()
    if (!query && topics.trim()) query = topics.split(',').flatMap(group => group.trim().split(/[+\s]+/)).filter(Boolean).map(topic => `topic:${topic}`).join(' ')
    if (!query) { sendJson(res, 400, { error: 'Missing query parameter q or topics', items: [], total: 0 }); return }
    const apiUrl = `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=${sort}&order=${order}&per_page=${perPage}`
    let responded = false
    const sendSearchResponse = (status, payload) => { if (responded || res.writableEnded) return; responded = true; sendJson(res, status, payload) }
    const ghReq = https.get(apiUrl, { headers: { 'User-Agent': 'AI-Knowledge-Hub/1.0', 'Accept': 'application/vnd.github.v3+json', ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}) } }, ghRes => {
      let body = ''
      ghRes.on('data', chunk => body += chunk)
      ghRes.on('error', err => sendSearchResponse(502, { error: `GitHub response failed: ${err.message}`, items: [], total: 0 }))
      ghRes.on('end', () => {
        try {
          const data = JSON.parse(body)
          if (ghRes.statusCode !== 200) { const resetAt = ghRes.headers['x-ratelimit-reset']; sendSearchResponse(ghRes.statusCode, { error: data.message || `GitHub search failed (HTTP ${ghRes.statusCode})`, items: [], total: 0, rateLimitReset: resetAt ? Number(resetAt) * 1000 : null }); return }
          const items = (data.items || []).map(repo => ({ name: repo.full_name || '', url: repo.html_url || '', stars: repo.stargazers_count || 0, description: (repo.description || '').slice(0, 200), language: repo.language || '', topics: repo.topics || [], updated_at: repo.updated_at || '', license: repo.license?.spdx_id || '', forks: repo.forks_count || 0, open_issues: repo.open_issues_count || 0 }))
          sendSearchResponse(200, { items, total: data.total_count || items.length, query: q || query })
        } catch { sendSearchResponse(502, { error: 'Failed to parse GitHub response', items: [], total: 0 }) }
      })
    })
    ghReq.setTimeout(20000, () => ghReq.destroy(new Error('GitHub search request timed out')))
    ghReq.on('error', err => sendSearchResponse(502, { error: `GitHub search request failed: ${err.message}`, items: [], total: 0 }))
    return
  }

  if (pathname === '/api/github/persisted' && req.method === 'GET') {
    const data = readPersistedGitHub()
    sendJson(res, 200, { ...data, total: data.items.length })
    return
  }

  if (pathname === '/api/github/persist' && req.method === 'POST') {
    try {
      const payload = JSON.parse(await readRequestBody(req))
      const current = readPersistedGitHub(); const byUrl = new Map(current.items.map(item => [item.url, item])); const fetchedAt = new Date().toISOString()
      for (const item of Array.isArray(payload.items) ? payload.items : []) { const normalized = normalizePersistedRepo({ ...item, fetchedAt }); if (normalized) byUrl.set(normalized.url, normalized) }
      const saved = { version: 1, updatedAt: fetchedAt, items: [...byUrl.values()] }
      writeJsonFile(GITHUB_PERSISTED_PATH, saved)
      writeJsonFile(GITHUB_REFRESH_CONFIG_PATH, { version: 1, updatedAt: fetchedAt, topics: Array.isArray(payload.topics) ? payload.topics.map(topic => String(topic).trim()).filter(Boolean) : String(payload.topics || '').split(',').map(topic => topic.trim()).filter(Boolean), query: String(payload.query || '').trim(), category: String(payload.category || '').trim() })
      sendJson(res, 200, { ok: true, updatedAt: saved.updatedAt, total: saved.items.length })
    } catch (error) { sendJson(res, 400, { ok: false, error: error.message || 'Could not persist GitHub repositories' }) }
    return
  }

  // Chat with file attachments — accepts multipart/form-data with a `message`
  // field and one or more `files` (Word / PDF / text / images).
  if (pathname === '/api/chat/upload' && req.method === 'POST') {
    handleChatUpload(req, res)
    return
  }

  res.writeHead(404)
  res.end('Not found')
}

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || ''

// `openrouter/free` is OpenRouter's official free-model router. The explicit
// free IDs are a fallback in case the router has no eligible endpoint or is
// temporarily rate-limited. Override the list with OPENROUTER_FREE_MODELS when
// OpenRouter changes availability.
const OPENROUTER_FREE_MODELS = (process.env.OPENROUTER_FREE_MODELS || [
  // Verified free on OpenRouter 2026-11 (the previous qwen3-4b / gemma-3 /
  // llama-3.3 :free slugs were withdrawn, so every fallback failed).
  'openrouter/free',
  'google/gemma-4-31b-it:free',
  'nvidia/nemotron-3.5-lightning:free',
  'google/gemma-4-26b-a4b-it:free'
].join(',')).split(',').map(model => model.trim()).filter(Boolean)
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || OPENROUTER_FREE_MODELS[0] || 'openrouter/free'
const OPENROUTER_VISION_MODEL = process.env.OPENROUTER_VISION_MODEL || 'openrouter/free'

// File-attachment chat limits
const MAX_UPLOAD_FILES = 6
const MAX_UPLOAD_BYTES = 12 * 1024 * 1024          // 12 MB per file
const MAX_TOTAL_UPLOAD_BYTES = 32 * 1024 * 1024    // 32 MB per request
const MAX_EXTRACTED_CHARS = 40000                  // per-file text fed to the LLM

const TEXT_FILE_EXTENSIONS = new Set([
  '.txt', '.md', '.markdown', '.csv', '.tsv', '.json', '.log', '.xml', '.yml', '.yaml',
  '.py', '.js', '.jsx', '.ts', '.tsx', '.sql', '.html', '.htm', '.css', '.sh', '.bat',
  '.ini', '.cfg', '.conf', '.env', '.toml', '.rst', '.tex', '.rtf',
])

const IMAGE_EXTENSIONS = new Set([
  '.png', '.jpg', '.jpeg', '.gif', '.webp', '.bmp', '.svg', '.avif',
])

const IMAGE_MIME = {
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif',
  '.webp': 'image/webp', '.bmp': 'image/bmp', '.svg': 'image/svg+xml', '.avif': 'image/avif',
}

const SYSTEM_PROMPT = `You are an expert AI knowledge assistant for the AI Knowledge Hub. Answer questions about:
- RAG pipelines, vector databases (Qdrant, Pinecone, Weaviate, ChromaDB, Milvus, pgvector)
- AI agents (LangGraph, CrewAI, MCP, ReAct pattern)
- LLMs (GPT, Claude, Gemini, Llama, Mistral, DeepSeek, local models)
- Prompt engineering, guardrails, security (injection detection, PII masking)
- Fine-tuning (LoRA, QLoRA, DPO, RLHF, LLaMA-Factory, Unsloth)
- GRC compliance (EU AI Act, GDPR, PDPA, NIST, ISO 42001, SOC 2)
- Python/FastAPI for AI services, LangChain, LlamaIndex
- AI careers, jobs, salaries
- System design, observability, evals
- Enterprise integration (Solace, MQ series, event-driven architecture)

Keep answers concise and technical. Provide specific tool names, versions, and practical details.`

function sendSSEHeaders(res) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'X-Accel-Buffering': 'no'
  })
}

// Stream a chat completion from OpenRouter to the client as SSE tokens.
// `chatMessages` is the full payload (system + history + current turn), `model`
// is the OpenRouter model id, `fallbackMessages` are the raw user turns used to
// produce a local keyword answer if the network call fails.
function streamOpenRouter(chatMessages, models, res, fallbackMessages) {
  const modelList = [...new Set((Array.isArray(models) ? models : [models]).filter(Boolean))]
  sendSSEHeaders(res)

  let modelIndex = 0
  let lastError = ''

  const sendFallback = () => {
    fallbackResponse(fallbackMessages, res, lastError || 'All configured free models were unavailable.')
  }

  const tryNextModel = () => {
    if (modelIndex >= modelList.length) {
      sendFallback()
      return
    }

    const model = modelList[modelIndex++]
    const requestBody = JSON.stringify({
      model,
      messages: chatMessages,
      stream: true,
      max_tokens: 2048,
      temperature: 0.7
    })
    const options = {
      hostname: 'openrouter.ai',
      path: '/api/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'http://localhost:5273',
        'X-OpenRouter-Title': 'AI Knowledge Hub'
      }
    }

    let emittedContent = false
    let responseBuffer = ''
    const apiReq = https.request(options, apiRes => {
      if (apiRes.statusCode < 200 || apiRes.statusCode >= 300) {
        let errorBody = ''
        apiRes.on('data', chunk => { errorBody += chunk.toString() })
        apiRes.on('end', () => {
          let detail = `OpenRouter model ${model} returned HTTP ${apiRes.statusCode}`
          try {
            const payload = JSON.parse(errorBody)
            detail = payload.error?.message || payload.message || detail
          } catch { /* keep HTTP detail */ }
          lastError = detail
          console.warn(`[chat] ${detail}; trying the next free model`)
          tryNextModel()
        })
        apiRes.on('error', error => {
          lastError = error.message
          tryNextModel()
        })
        return
      }

      apiRes.on('data', chunk => {
        responseBuffer += chunk.toString()
        const lines = responseBuffer.split('\n')
        responseBuffer = lines.pop() || ''
        for (const line of lines) {
          const trimmed = line.trim()
          if (!trimmed || trimmed.startsWith(':') || trimmed === 'data: [DONE]') continue
          if (!trimmed.startsWith('data: ')) continue
          try {
            const parsed = JSON.parse(trimmed.slice(6))
            const content = parsed.choices?.[0]?.delta?.content || ''
            if (typeof content === 'string' && content) {
              emittedContent = true
              res.write(`data: ${JSON.stringify({ type: 'token', content })}\n\n`)
            }
          } catch { /* skip malformed upstream event */ }
        }
      })
      apiRes.on('end', () => {
        if (!emittedContent) {
          lastError = `OpenRouter model ${model} returned no content`
          tryNextModel()
          return
        }
        res.write(`data: ${JSON.stringify({ type: 'done', model })}\n\n`)
        res.end()
      })
      apiRes.on('error', error => {
        console.error('OpenRouter stream error:', error.message)
        if (emittedContent) {
          res.write(`data: ${JSON.stringify({ type: 'done', model })}\n\n`)
          res.end()
        } else {
          lastError = error.message
          tryNextModel()
        }
      })
    })

    apiReq.setTimeout(45000, () => apiReq.destroy(new Error('OpenRouter request timed out')))
    apiReq.on('error', error => {
      console.error('OpenRouter connection error:', error.message)
      if (emittedContent) {
        res.write(`data: ${JSON.stringify({ type: 'done', model })}\n\n`)
        res.end()
      } else {
        lastError = error.message
        tryNextModel()
      }
    })
    apiReq.write(requestBody)
    apiReq.end()
  }

  tryNextModel()
}

function streamChat(messages, res) {
  const safeMessages = Array.isArray(messages) ? messages : []
  const hasKey = OPENROUTER_API_KEY && OPENROUTER_API_KEY.length > 20

  if (!hasKey) {
    // No API key: return a useful local answer instead of leaving the widget in
    // a loading state. Real free-model inference still requires an OpenRouter key.
    const lastMsg = safeMessages.filter(m => m.role === 'user').pop()
    const q = (lastMsg?.content || '').toLowerCase()
    const answer = localAnswer(q)
    sendSSEHeaders(res)
    res.write(`data: ${JSON.stringify({ type: 'token', content: answer })}\n\n`)
    res.write(`data: ${JSON.stringify({ type: 'done', mode: 'local-fallback' })}\n\n`)
    res.end()
    return
  }

  const chatMessages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...safeMessages.slice(-20)
  ]
  streamOpenRouter(chatMessages, [OPENROUTER_MODEL, ...OPENROUTER_FREE_MODELS], res, safeMessages)
}

function fallbackResponse(messages, res, reason = '') {
  const safeMessages = Array.isArray(messages) ? messages : []
  const lastMsg = safeMessages.filter(m => m.role === 'user').pop()
  const q = (lastMsg?.content || '').toLowerCase()
  const answer = localAnswer(q)
  const notice = reason ? `\n\n[OpenRouter free models unavailable: ${reason}. Showing the local knowledge fallback.]` : ''
  res.write(`data: ${JSON.stringify({ type: 'token', content: `${answer}${notice}` })}\n\n`)
  res.write(`data: ${JSON.stringify({ type: 'done', mode: 'local-fallback' })}\n\n`)
  res.end()
}

function localAnswer(q) {
  if (q.includes('react') && (q.includes('agent') || q.includes('pattern') || q.includes('reason')))
    return 'ReAct (Reason + Act) is the foundational agent loop. Each iteration has 3 steps:\n1) **Thought** — the LLM reasons about the current state and decides the next action ("I need to search the docs for vector DB benchmarks").\n2) **Act** — the model calls a tool (search, calculator, API, code) via function calling.\n3) **Observe** — the tool result is fed back into the prompt, and the loop repeats until the goal is reached.\n\nPractical details: implement it with a `while` loop that appends `Thought/Action/Observation` turns to the message history, cap iterations (e.g. max 8 steps) to bound token cost, and catch tool errors so the model can recover. LangGraph gives this loop structured control flow (nodes + edges + checkpoints), while frameworks like LangChain\'s `create_react_agent` and LlamaIndex\'s `ReActAgent` wrap it with a built-in tool router and stopping criteria.'
  if (q.includes('rag') || q.includes('retrieval'))
    return 'RAG (Retrieval Augmented Generation) is a pattern where relevant documents are retrieved from a knowledge base and injected into the LLM prompt to generate grounded, factual answers. The production pipeline has 9 steps: Query Capture → Query Processing → Embedding → Hybrid Search → Vector DB → Reranker → Context Assembly → Generation → Grounding Check.'
  if (q.includes('agent') || q.includes('multi-agent'))
    return 'AI Agents are autonomous systems that use LLMs to plan, reason, and execute tasks. Key frameworks include LangGraph (state machines), CrewAI (role-based teams), and MCP (Model Context Protocol) for tool connectivity. The ReAct pattern (Reason + Act) is the foundational agent loop.'
  if (q.includes('vector') || q.includes('database') || q.includes('qdrant') || q.includes('pinecone'))
    return 'Vector databases store embeddings for semantic search. Top options: Qdrant (Rust, hybrid search), Pinecone (managed, serverless), Weaviate (graph+vector), pgvector (PostgreSQL extension), ChromaDB (Python embedded), and Milvus (distributed, billion-scale).'
  if (q.includes('llm') || q.includes('model') || q.includes('gpt') || q.includes('claude'))
    return 'Major LLM providers: OpenAI (GPT-4o, o1), Anthropic (Claude 4 Opus/Sonnet), Google (Gemini 2.5 Pro, 2M context), Meta (Llama 4 open-weight), Mistral (Large, Nemo), DeepSeek (V3, R1 reasoning). Open-weight models: Llama, Mistral, Gemma, Qwen, Phi-3. Local runners: Ollama, LM Studio, vLLM.'
  if (q.includes('guardrail') || q.includes('security') || q.includes('injection'))
    return 'AI security requires multi-layer defense: Input guardrails (injection detection, PII masking), System guardrails (prompt enforcement), Output guardrails (content filtering, bias scanning). NVIDIA NeMo Guardrails provides a DSL (Colang) for defining conversational rules.'
  if (q.includes('compliance') || q.includes('grc') || q.includes('gdpr') || q.includes('eu ai act') || q.includes('ai act'))
    return 'GRC (Governance, Risk, Compliance) for AI covers 500+ frameworks including GDPR, PDPA, EU AI Act, NIST, ISO 42001. The EU AI Act classifies AI systems by risk level (unacceptable, high, limited, minimal) with mandatory requirements for high-risk systems including transparency, human oversight, and robustness.'
  if (q.includes('fine') || q.includes('lora') || q.includes('training'))
    return 'Fine-tuning approaches: LoRA/QLoRA (parameter-efficient, r=16, alpha=32), DPO (Direct Preference Optimization), RLHF. Tools: LLaMA-Factory, Axolotl, Unsloth. Deployment: GGUF for Ollama, vLLM for production serving.'
  if (q.includes('python') || q.includes('fastapi'))
    return 'Python for AI engineering: async LLM clients with asyncio+httpx, Pydantic for output validation, pytest with mock LLM, tenacity for retries, Loguru for structured logging. FastAPI for AI services: SSE streaming, WebSocket, REST, background tasks, Docker deployment.'
  if (q.includes('hello') || q.includes('hi') || q.includes('hey'))
    return '👋 Welcome to AI Knowledge Hub! I can help you with: RAG pipelines, AI agents, LLM models, vector databases, prompt engineering, fine-tuning, system design, security, compliance, and more. What would you like to know?'
  return `I found information related to your query about "${q.slice(0, 100)}" in the AI Knowledge Hub. You can explore specific topics like: RAG, Agents, LLMs, Vector DBs, Security, Compliance, Fine-tuning, Python, or FastAPI. What would you like to dive deeper into?`
}

// ===== File attachments for chat =====
// Extracts readable text from Word / PDF / text files, and keeps images as data
// URLs so a vision-capable model can inspect them.
async function extractFileContent(file) {
  const ext = path.extname(file.name).toLowerCase()

  if (IMAGE_EXTENSIONS.has(ext)) {
    const mime = IMAGE_MIME[ext] || 'image/png'
    const dataUrl = `data:${mime};base64,${file.buffer.toString('base64')}`
    return { kind: 'image', name: file.name, mime, dataUrl, chars: 0 }
  }

  let text = ''
  try {
    if (ext === '.docx') {
      const result = await mammoth.extractRawText({ buffer: file.buffer })
      text = result.value || ''
    } else if (ext === '.doc') {
      const extractor = new WordExtractor()
      const doc = await extractor.extract(file.buffer)
      text = doc.getBody() || ''
    } else if (ext === '.pdf') {
      const pdf = new PDFParse({ data: file.buffer })
      try {
        const result = await pdf.getText()
        text = result.text || ''
      } finally {
        pdf.destroy()
      }
    } else if (TEXT_FILE_EXTENSIONS.has(ext)) {
      text = file.buffer.toString('utf8')
    } else {
      return { kind: 'skip', name: file.name, reason: `Unsupported file type ${ext}` }
    }
  } catch (err) {
    return { kind: 'skip', name: file.name, reason: `Could not read file: ${err.message}` }
  }

  if (text.length > MAX_EXTRACTED_CHARS) {
    text = `${text.slice(0, MAX_EXTRACTED_CHARS)}\n\n[truncated: file was longer than ${MAX_EXTRACTED_CHARS} characters]`
  }
  return { kind: 'text', name: file.name, text, chars: text.length }
}

function buildFileContextText(files) {
  const parts = files.map(file => `### File: ${file.name}\n\n${file.text}`)
  return parts.join('\n\n---\n\n')
}

// Endpoint handler for /api/chat/upload — receives message + files (multipart),
// extracts content, then streams an LLM answer that has access to the files.
async function handleChatUpload(req, res) {
  const bb = busboy({ headers: req.headers, limits: { files: MAX_UPLOAD_FILES, fileSize: MAX_UPLOAD_BYTES } })
  const fields = {}
  const files = []
  let totalBytes = 0
  let parseError = null

  await new Promise((resolve) => {
    bb.on('field', (name, val) => { fields[name] = val })
    bb.on('file', (name, fileStream, info) => {
      const chunks = []
      let bytes = 0
      fileStream.on('data', chunk => {
        bytes += chunk.length
        if (bytes > MAX_UPLOAD_BYTES) {
          fileStream.resume()
          return
        }
        chunks.push(chunk)
      })
      fileStream.on('limit', () => { parseError = parseError || new Error(`File exceeds the ${Math.round(MAX_UPLOAD_BYTES / 1024 / 1024)} MB limit`) })
      fileStream.on('end', () => {
        totalBytes += bytes
        files.push({ name: info.filename || 'file', mime: info.mimeType || '', buffer: Buffer.concat(chunks) })
      })
    })
    bb.on('error', err => { parseError = parseError || err; resolve() })
    bb.on('close', resolve)
    req.pipe(bb)
  })

  if (parseError || totalBytes > MAX_TOTAL_UPLOAD_BYTES) {
    sendJson(res, 413, { error: parseError?.message || 'Total upload size exceeded the limit' })
    return
  }

  const message = String(fields.message || '').trim()
  const validFiles = files.filter(f => f.buffer.length > 0)
  const tooMany = validFiles.length > MAX_UPLOAD_FILES
  if (tooMany) {
    sendJson(res, 413, { error: `You can attach up to ${MAX_UPLOAD_FILES} files at once.` })
    return
  }
  if (!message && validFiles.length === 0) {
    sendJson(res, 400, { error: 'Please include a message and/or a file.' })
    return
  }

  // Extract readable content from every attachment.
  const extracted = []
  for (const file of validFiles) {
    const result = await extractFileContent(file)
    extracted.push(result)
  }
  const textFiles = extracted.filter(e => e.kind === 'text')
  const imageFiles = extracted.filter(e => e.kind === 'image')
  const skipped = extracted.filter(e => e.kind === 'skip')

  const hasKey = OPENROUTER_API_KEY && OPENROUTER_API_KEY.length > 20

  if (!hasKey) {
    // Local fallback: no LLM key — answer from the extracted text by keyword.
    const answers = []
    for (const tf of textFiles) {
      const sample = (tf.text || '').slice(0, 500)
      answers.push(`📄 ${tf.name} (${tf.chars} chars):\n${sample}${sample.length >= 500 ? '…' : ''}`)
    }
    for (const img of imageFiles) {
      answers.push(`🖼️ ${img.name} — image received. To analyse it visually the server needs the OPENROUTER_API_KEY (vision model).`)
    }
    for (const sk of skipped) {
      answers.push(`⚠️ ${sk.name}: ${sk.reason}`)
    }
    const body = [`📎 I received ${validFiles.length} file(s).`, ...answers, ''].join('\n')
    const answer = body + (message ? `\nYour question: "${message}"\n\nI couldn't run the LLM (no API key). Here is the file content above — check it directly, or configure OPENROUTER_API_KEY for full answers.` : '\nConfigure OPENROUTER_API_KEY to have me read the files intelligently.')
    sendSSEHeaders(res)
    res.write(`data: ${JSON.stringify({ type: 'token', content: answer })}\n\n`)
    res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`)
    res.end()
    return
  }

  // Build the model message: plain string for text-only, content array when images exist.
  const context = buildFileContextText(textFiles)
  const attachmentsNote = []
  if (textFiles.length) attachmentsNote.push(`Attached text files:\n${context}`)
  if (imageFiles.length) attachmentsNote.push(`Attached images (${imageFiles.map(i => i.name).join(', ')}) — please inspect them and answer based on their content.`)
  if (skipped.length) attachmentsNote.push(`Some files were not readable: ${skipped.map(s => `${s.name} (${s.reason})`).join('; ')}`)

  const userText = [attachmentsNote.join('\n\n'), message].filter(Boolean).join('\n\n')

  let contentPart
  if (imageFiles.length > 0) {
    contentPart = [
      { type: 'text', text: userText },
      ...imageFiles.map(img => ({ type: 'image_url', image_url: { url: img.dataUrl } })),
    ]
  } else {
    contentPart = userText
  }

  const chatMessages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...(JSON.parse(fields.history || '[]').slice(-20)),
    { role: 'user', content: contentPart },
  ]
  const models = imageFiles.length > 0
    ? [OPENROUTER_VISION_MODEL, ...OPENROUTER_FREE_MODELS]
    : [OPENROUTER_MODEL, ...OPENROUTER_FREE_MODELS]
  streamOpenRouter(chatMessages, models, res, [{ role: 'user', content: message || `Analyse the attached file(s).` }])
}

const server = http.createServer(serve)
server.listen(PORT, '127.0.0.1', () => {
  console.log(`Scan server running at http://127.0.0.1:${PORT}`)
  if (OPENROUTER_API_KEY) {
    console.log(`Chat: OpenRouter free routing enabled (models: ${[OPENROUTER_MODEL, ...OPENROUTER_FREE_MODELS].join(', ')})`)
  } else {
    console.log('Chat: OpenRouter key not set — using local fallback responses')
    console.log('  Set OPENROUTER_API_KEY in frontend/.env for real free-model responses')
    console.log('  Get a free key at https://openrouter.ai/keys')
  }
})
