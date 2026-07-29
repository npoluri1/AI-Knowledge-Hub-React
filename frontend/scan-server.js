import http from 'http'
import https from 'https'
import { spawn } from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PORT = 9000
const MANIFEST_PATH = path.resolve(__dirname, 'src', 'fileManifest.json')
const GENERATOR_SCRIPT = path.resolve(__dirname, 'scripts', 'generateManifest.js')

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

function serve(req, res) {
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

  res.writeHead(404)
  res.end('Not found')
}

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || ''
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || 'qwen/qwen-2.5-72b-instruct'

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

function streamChat(messages, res) {
  const hasKey = OPENROUTER_API_KEY && OPENROUTER_API_KEY.length > 20

  if (!hasKey) {
    // No API key — use local keyword-based response (non-streaming)
    const lastMsg = messages.filter(m => m.role === 'user').pop()
    const q = (lastMsg?.content || '').toLowerCase()
    const answer = localAnswer(q)
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no'
    })
    res.write(`data: ${JSON.stringify({ type: 'token', content: answer })}\n\n`)
    res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`)
    res.end()
    return
  }

  // Streaming via OpenRouter
  const chatMessages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...messages.slice(-20)
  ]

  const requestBody = JSON.stringify({
    model: OPENROUTER_MODEL,
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
      'X-Title': 'AI Knowledge Hub'
    }
  }

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'X-Accel-Buffering': 'no'
  })

  const apiReq = https.request(options, apiRes => {
    let buffer = ''
    apiRes.on('data', chunk => {
      buffer += chunk.toString()
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''
      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed || trimmed === 'data: [DONE]') continue
        if (trimmed.startsWith('data: ')) {
          try {
            const parsed = JSON.parse(trimmed.slice(6))
            const content = parsed.choices?.[0]?.delta?.content || ''
            if (content) {
              res.write(`data: ${JSON.stringify({ type: 'token', content })}\n\n`)
            }
          } catch { /* skip malformed */ }
        }
      }
    })
    apiRes.on('end', () => {
      res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`)
      res.end()
    })
    apiRes.on('error', err => {
      console.error('OpenRouter stream error:', err.message)
      fallbackResponse(messages, res)
    })
  })

  apiReq.on('error', err => {
    console.error('OpenRouter connection error:', err.message)
    fallbackResponse(messages, res)
  })

  apiReq.write(requestBody)
  apiReq.end()
}

function fallbackResponse(messages, res) {
  const lastMsg = messages.filter(m => m.role === 'user').pop()
  const q = (lastMsg?.content || '').toLowerCase()
  const answer = localAnswer(q)
  res.write(`data: ${JSON.stringify({ type: 'token', content: answer })}\n\n`)
  res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`)
  res.end()
}

function localAnswer(q) {
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

const server = http.createServer(serve)
server.listen(PORT, '127.0.0.1', () => {
  console.log(`Scan server running at http://127.0.0.1:${PORT}`)
  if (OPENROUTER_API_KEY) {
    console.log(`Chat: OpenRouter enabled (model: ${OPENROUTER_MODEL})`)
  } else {
    console.log('Chat: OpenRouter key not set — using local fallback responses')
    console.log('  Set OPENROUTER_API_KEY env var for real LLM responses')
    console.log('  Get a free key at https://openrouter.ai/keys')
  }
})
