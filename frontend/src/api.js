// Self-Contained API — uses local embedded data, no backend needed
import {
  CHAPTERS as localChapters,
  DEEP_DIVES as localDeepDives,
  unifiedSearch,
  getCategoryById,
  FILE_CATEGORIES,
  searchJobs,
  ALL_JOBS,
  searchKnowledge,
  getChapterSections
} from './data/appData'
import { DEEP_DIVE_SECTIONS } from './data/deepDiveSections'
import fileManifest from './fileManifest.json'

// Simulate async data loading
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export async function getChapters() {
  await delay(50)
  return localChapters
}

export async function getChapter(id) {
  await delay(50)
  const ch = localChapters.find(c => c.id === id)
  if (ch) {
    // Include the full sections data from the embedded chapterSections
    const sections = getChapterSections(id)
    return { ...ch, sections: sections || [] }
  }
  // Also check file categories
  const cat = getCategoryById(id)
  if (cat) return { id: cat.id, title: cat.title, icon: cat.icon, preview: cat.summary, tags: [], sections: [] }
  return { error: `Chapter '${id}' not found` }
}

export async function getDeepDives() {
  await delay(50)
  return localDeepDives
}

// Map deep dive IDs to their section keys in DEEP_DIVE_SECTIONS and CHAPTER_SECTIONS
const DEEP_DIVE_KEY_MAP = {
  'rag': 'rag',
  'agents': 'ai-agents',
  'compliance': 'grc-compliance',
  'security': 'security-guardrails'
}

export async function getDeepDive(id) {
  await delay(50)
  const dd = localDeepDives.find(d => d.id === id)
  if (dd) {
    const sectionKey = DEEP_DIVE_KEY_MAP[id] || id
    // Use dedicated deep dive sections if available, fallback to chapter sections
    const richSections = DEEP_DIVE_SECTIONS[sectionKey]?.sections
    const chapterSections = getChapterSections(sectionKey)
    const sections = richSections || chapterSections || []
    return { ...dd, sections }
  }
  return { error: `Deep dive '${id}' not found` }
}

export async function searchAll(query) {
  await delay(100)
  const results = unifiedSearch(query)
  return {
    total: results.files.length + results.knowledge.length + results.jobs.length,
    results: [
      ...results.files.map(r => ({
        type: 'file-category',
        chapter_id: r.category,
        chapter_title: r.categoryTitle,
        section_heading: r.file.name,
        snippet: r.file.summary || r.file.name,
        score: r.score / 5
      })),
      ...results.knowledge.map(r => ({
        type: 'knowledge',
        chapter_id: r.section,
        chapter_title: r.sectionHeading,
        section_heading: r.row.topic,
        snippet: r.row.details || '',
        score: r.score / 5
      })),
      ...results.jobs.map(j => ({
        type: 'job',
        chapter_id: 'jobs',
        chapter_title: j.title,
        section_heading: j.company,
        snippet: `${j.location} | ${j.salary}`,
        score: 0.95
      }))
    ]
  }
}

function mergeFileRecords(primary = [], fallback = []) {
  const merged = new Map()
  for (const file of fallback) {
    if (!file || typeof file !== 'object') continue
    const key = `${file.folder || file.source_label || ''}::${file.name || file.display_name || file.url || ''}`
    merged.set(key, file)
  }
  for (const file of primary) {
    if (!file || typeof file !== 'object') continue
    const key = `${file.folder || file.source_label || ''}::${file.name || file.display_name || file.url || ''}`
    merged.set(key, file)
  }
  return [...merged.values()]
}

function manifestFileData() {
  const images = fileManifest.images || []
  const pdfs = fileManifest.pdfs || []
  const documents = fileManifest.documents || []
  const dataFiles = fileManifest.dataFiles || []
  return {
    images,
    pdfs,
    documents,
    dataFiles,
    allFiles: fileManifest.allFiles || mergeFileRecords([...images, ...pdfs, ...documents, ...dataFiles]),
    scanPaths: fileManifest.scanPaths || [],
    perSource: fileManifest.perSource || {},
    generatedAt: fileManifest.generatedAt,
  }
}

function buildPerSource(records) {
  const result = {}
  for (const file of records) {
    const slug = file.folder || file.source_label || 'unknown'
    if (!result[slug]) {
      result[slug] = {
        images: 0, pdfs: 0, documents: 0, dataFiles: 0,
        label: file.source_label || slug,
        kind: file.source_kind || 'public',
      }
    }
    const bucket = file.bucket || 'dataFiles'
    result[slug][bucket] = (result[slug][bucket] || 0) + 1
  }
  return result
}

function normalizeFileData(data, source) {
  const fallback = manifestFileData()
  const images = mergeFileRecords(data.images || [], fallback.images)
  const pdfs = mergeFileRecords(data.pdfs || [], fallback.pdfs)
  const documents = mergeFileRecords(data.documents || [], fallback.documents)
  const dataFiles = mergeFileRecords(data.dataFiles || [], fallback.dataFiles)
  const allFiles = mergeFileRecords(
    [...(data.allFiles || []), ...images, ...pdfs, ...documents, ...dataFiles],
    fallback.allFiles
  )
  return {
    images,
    pdfs,
    documents,
    dataFiles,
    allFiles,
    scanPaths: data.scanPaths?.length ? data.scanPaths : fallback.scanPaths,
    perSource: buildPerSource(allFiles),
    generatedAt: data.generatedAt || fallback.generatedAt,
    totals: {
      images: images.length,
      pdfs: pdfs.length,
      documents: documents.length,
      dataFiles: dataFiles.length,
      total: allFiles.length,
    },
    source,
    total: images.length,
    pdf_count: pdfs.length,
    doc_count: documents.length,
  }
}

export async function getImages() {
  // Merge the live scan with the bundled manifest. This keeps the gallery
  // complete when a dev server has a stale manifest or only scans public files.
  try {
    const res = await fetch('/api/files', { cache: 'no-store' })
    if (res.ok) return normalizeFileData(await res.json(), 'backend')
  } catch (_e) {
    // backend offline, fall through to embedded manifest
  }
  await delay(50)
  return normalizeFileData(manifestFileData(), 'manifest')
}

export async function getAllFiles() {
  return getImages()
}

/**
 * Re-scan the configured folders via the backend and (best-effort) rewrite
 * the static manifest file on disk so a future page reload picks up changes
 * even without running `npm run manifest` manually.
 *
 * Falls back to re-fetching the embedded manifest if the backend is offline.
 *
 * @returns {{ ok: boolean, source: 'backend'|'manifest', data: object}}
 */
export async function refreshFiles() {
  try {
    const res = await fetch('/api/scan-files', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ persist: true }),
      cache: 'no-store'
    })
    if (res.ok) {
      const payload = await res.json()
      const data = payload?.data || {}
      return {
        ok: true,
        source: 'backend',
        persisted: payload?.persisted,
        fetchedAt: payload?.fetchedAt,
        data: normalizeFileData(data, 'backend')
      }
    }
  } catch (_e) {
    // fall through to manifest
  }
  // Self-contained fallback - re-emit what we statically know.
  await delay(50)
  return {
    ok: true,
    source: 'manifest',
    persisted: { attempted: false, ok: false, error: 'Backend offline - manifest is static' },
    data: normalizeFileData(manifestFileData(), 'manifest')
  }
}

export async function searchGitHubRepos({ topics = [], query = '', sort = 'stars', perPage = 30 } = {}) {
  try {
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    if (topics && (Array.isArray(topics) ? topics.length : topics)) params.set('topics', (Array.isArray(topics) ? topics : [topics]).join(','))
    params.set('sort', sort)
    params.set('per_page', String(perPage))
    const res = await fetch(`/api/github/search?${params.toString()}`, { cache: 'no-store' })
    let data = null
    try {
      data = await res.json()
    } catch {
      data = null
    }
    if (res.ok) return data || { items: [], total: 0, error: 'GitHub returned an empty response' }
    return {
      items: [],
      total: 0,
      error: data?.error || data?.message || `GitHub search failed (HTTP ${res.status})`,
      rateLimitReset: data?.rateLimitReset || null,
    }
  } catch (error) {
    return { items: [], total: 0, error: error.message || 'Backend offline' }
  }
}

export async function loadPersistedGitHubRepos() {
  try {
    const res = await fetch('/api/github/persisted', { cache: 'no-store' })
    const data = await res.json()
    if (!res.ok) throw new Error(data?.error || `Could not load saved GitHub repositories (HTTP ${res.status})`)
    return data
  } catch (error) {
    return { items: [], error: error.message || 'Could not load saved GitHub repositories' }
  }
}

export async function persistGitHubRepos({ items = [], topics = [], query = '', category = '' } = {}) {
  try {
    const res = await fetch('/api/github/persist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items, topics, query, category }),
      cache: 'no-store'
    })
    const data = await res.json()
    if (!res.ok) return { ok: false, error: data?.error || `Could not save GitHub repositories (HTTP ${res.status})` }
    return data
  } catch (error) {
    return { ok: false, error: error.message || 'Could not save GitHub repositories' }
  }
}

export async function chatWithHub(message) {
  await delay(200)
  // Simple local chat response based on keywords
  const q = message.toLowerCase()
  let answer = ''
  let sources = []

  if (q.includes('rag') || q.includes('retrieval')) {
    answer = 'RAG (Retrieval Augmented Generation) is a pattern where relevant documents are retrieved from a knowledge base and injected into the LLM prompt to generate grounded, factual answers. The production pipeline has 9 steps: Query Capture → Query Processing → Embedding → Hybrid Search → Vector DB → Reranker → Context Assembly → Generation → Grounding Check.'
    sources = [{ title: 'RAG Production Pipeline', id: 'rag-pipeline', type: 'chapter' }]
  } else if (q.includes('agent') || q.includes('multi-agent')) {
    answer = 'AI Agents are autonomous systems that use LLMs to plan, reason, and execute tasks. Key frameworks include LangGraph (state machines), CrewAI (role-based teams), and MCP (Model Context Protocol) for tool connectivity. The ReAct pattern (Reason + Act) is the foundational agent loop.'
    sources = [{ title: 'AI Agents & Multi-Agent Systems', id: 'ai-agents', type: 'chapter' }]
  } else if (q.includes('vector') || q.includes('database') || q.includes('qdrant') || q.includes('pinecone')) {
    answer = 'Vector databases store embeddings for semantic search. Top options: Qdrant (Rust, hybrid search), Pinecone (managed, serverless), Weaviate (graph+vector), pgvector (PostgreSQL extension), ChromaDB (Python embedded), and Milvus (distributed, billion-scale).'
    sources = [{ title: 'Vector Databases & Semantic Search', id: 'vector-databases', type: 'chapter' }]
  } else if (q.includes('llm') || q.includes('model') || q.includes('gpt') || q.includes('claude')) {
    answer = 'Major LLM providers: OpenAI (GPT-4o, o1), Anthropic (Claude 4 Opus/Sonnet), Google (Gemini 2.5 Pro, 2M context), Meta (Llama 4 open-weight), Mistral (Large, Nemo), DeepSeek (V3, R1 reasoning). Open-weight models: Llama, Mistral, Gemma, Qwen, Phi-3. Local runners: Ollama, LM Studio, vLLM.'
    sources = [{ title: 'LLM Models & Providers', id: 'llm-models', type: 'chapter' }]
  } else if (q.includes('guardrail') || q.includes('security') || q.includes('injection')) {
    answer = 'AI security requires multi-layer defense: Input guardrails (injection detection, PII masking), System guardrails (prompt enforcement), Output guardrails (content filtering, bias scanning). NVIDIA NeMo Guardrails provides a DSL (Colang) for defining conversational rules.'
    sources = [{ title: 'AI Security & Guardrails', id: 'security-guardrails', type: 'chapter' }]
  } else if (q.includes('compliance') || q.includes('grc') || q.includes('gdpr') || q.includes('eu ai act') || q.includes('regulation') || q.includes('ai act')) {
    answer = 'GRC (Governance, Risk, Compliance) for AI covers 500+ frameworks including GDPR, PDPA, EU AI Act, NIST, ISO 42001. The EU AI Act classifies AI systems by risk level (unacceptable, high, limited, minimal) with mandatory requirements for high-risk systems including transparency, human oversight, and robustness. Key components: data governance, audit trails, AI-specific compliance monitoring, and automated reporting.'
    sources = [{ title: 'GRC Compliance', id: 'grc-compliance', type: 'chapter' }]
  } else if (q.includes('fine') || q.includes('lora') || q.includes('training')) {
    answer = 'Fine-tuning approaches: LoRA/QLoRA (parameter-efficient, r=16, alpha=32), DPO (Direct Preference Optimization), RLHF. Tools: LLaMA-Factory, Axolotl, Unsloth. Deployment: GGUF for Ollama, vLLM for production serving.'
    sources = [{ title: 'Fine-Tuning & Local Deployment', id: 'fine-tuning-local', type: 'chapter' }]
  } else if (q.includes('python') || q.includes('fastapi')) {
    answer = 'Python for AI engineering: async LLM clients with asyncio+httpx, Pydantic for output validation, pytest with mock LLM, tenacity for retries, Loguru for structured logging. FastAPI for AI services: SSE streaming, WebSocket, REST, background tasks, Docker deployment.'
    sources = [
      { title: 'Python for AI Engineering', id: 'python-for-ai', type: 'chapter' },
      { title: 'FastAPI AI Microservices', id: 'fastapi-ai-services', type: 'chapter' }
    ]
  } else if (q.includes('job') || q.includes('career') || q.includes('salary')) {
    answer = `The AI Knowledge Hub has ${ALL_JOBS.length} AI engineering jobs from SuperAIDevs (996) and TopGenAIJobs (1403). Average salaries range from INR 8-19 LPA (Junior) to INR 44-75 LPA (Senior). Key roles: AI Engineer, MLE, RAG Engineer, Agent Developer, Prompt Engineer, AI Security Engineer.`
    sources = [{ title: 'Career Resources', id: 'career-resources', type: 'chapter' }]
  } else if (q.includes('prompt')) {
    answer = 'Key prompt patterns: Chain-of-Thought (step-by-step reasoning), Few-Shot (2-5 examples), Structured Output (JSON mode), System Prompts (role/constraints). Guard against injection with multi-layer defense: input detection, PII masking, output filtering.'
    sources = [{ title: 'Prompt Engineering & Guardrails', id: 'prompt-engineering', type: 'chapter' }]
  } else if (q.includes('langchain') || q.includes('llamaindex')) {
    answer = 'LangChain: LCEL for chains, LangGraph for stateful agents, tool calling. LlamaIndex: data connectors, query engines, router patterns. Use together: LlamaIndex loaders in LangChain pipelines for best results.'
    sources = [{ title: 'LangChain & LlamaIndex', id: 'langchain-llamaindex', type: 'chapter' }]
  } else if (q.includes('hello') || q.includes('hi') || q.includes('hey')) {
    answer = '👋 Welcome to AI Knowledge Hub! I can help you with: RAG pipelines, AI agents, LLM models, vector databases, prompt engineering, fine-tuning, system design, security, compliance, career advice, and more. What would you like to know?'
  } else {
    answer = `I found information related to "${message}" across the knowledge base. You can explore the chapters, file categories, knowledge tables, or job listings for more details. Try searching more specific topics like: RAG, Agents, LLM, Vector DB, Security, Compliance, Fine-tuning, Python, FastAPI, LangChain, Jobs, or Career.`
    sources = [
      { title: 'Browse All Chapters', id: '', type: 'route' },
      { title: 'File Categories', id: 'files', type: 'route' },
      { title: 'AI Jobs', id: 'jobs', type: 'route' }
    ]
  }

  return { answer, sources }
}

// ---------------------------------------------------------------------------
// Live refresh helpers for the "Fetch Latest" buttons
// ---------------------------------------------------------------------------

// Message shown by FetchButtons in staticMode (catalogs baked in at build time).
export function staticMessage(label = 'This catalog') {
  return `Static catalog — built into the app`
}

// Re-pull chapters from the FastAPI backend, falling back to the embedded data.
export async function fetchLiveChapters() {
  try {
    const res = await fetch('/api/chapters', { cache: 'no-store' })
    if (res.ok) {
      const data = await res.json()
      if (Array.isArray(data) && data.length) return data
    }
  } catch (_e) { /* fall through to local copy */ }
  return localChapters
}

export async function fetchLiveDeepDives() {
  try {
    const res = await fetch('/api/deep-dive', { cache: 'no-store' })
    if (res.ok) {
      const data = await res.json()
      if (Array.isArray(data) && data.length) return data
    }
  } catch (_e) { /* fall through to local copy */ }
  return localDeepDives
}

export async function fetchLiveChapter(id) {
  try {
    const res = await fetch(`/api/chapters/${encodeURIComponent(id)}`, { cache: 'no-store' })
    if (res.ok) {
      const d = await res.json()
      if (d && !d.error) return d
    }
  } catch (_e) { /* fall through to local copy */ }
  return getChapter(id)
}

export async function fetchLiveDeepDive(id) {
  try {
    const res = await fetch(`/api/deep-dive/${encodeURIComponent(id)}`, { cache: 'no-store' })
    if (res.ok) {
      const d = await res.json()
      if (d && !d.error) return d
    }
  } catch (_e) { /* fall through to local copy */ }
  return getDeepDive(id)
}

// Pull the latest merged jobs from the backend (/api/jobs). Throws on failure.
export async function refreshLiveJobs() {
  const res = await fetch('/api/jobs?limit=6000', { cache: 'no-store' })
  if (!res.ok) {
    let message = `Jobs API failed (HTTP ${res.status})`
    try {
      const payload = await res.json()
      if (payload && payload.error) message = payload.error
    } catch (_e) { /* keep default message */ }
    throw new Error(message)
  }
  const data = await res.json()
  const jobs = Array.isArray(data) ? data : (data.jobs || [])
  if (!Array.isArray(jobs) || jobs.length === 0) throw new Error('No jobs returned from backend')
  return { jobs, total: data.total ?? jobs.length, generatedAt: data.generatedAt || null }
}

// Re-run the backend file scan for a file/knowledge catalog label.
export async function refreshFileCatalog(label = 'File catalog') {
  const r = await refreshFiles()
  const total = r?.data?.allFiles?.length || r?.data?.total || 0
  const source = r?.source === 'backend' ? 'backend scan' : 'bundled manifest'
  return `Synced ${label}: ${total} files (${source})`
}

// ─────────────────────────────────────────────────────────────────────────────
// Daily LinkedIn-style AI posts (deterministic curated topic catalog)
// ─────────────────────────────────────────────────────────────────────────────

export const LINKEDIN_DAILY_TOPICS = [
  'ai', 'ml', 'agents', 'multi_agents', 'python', 'fastapi',
  'reactjs', 'nextjs', 'rag', 'mcp', 'langchain', 'langgraph',
  'vectordb', 'workflows', 'crewai', 'tool_calling', 'memory',
  'agent_gateway', 'agent_loops', 'ai_graphs', 'spring_ai',
  'evaluations', 'observability', 'awareness', 'guardrails',
  'react', 'design_patterns', 'autogen', 'lora', 'mlops',
  'embeddings', 'llamaindex', 'llms', 'prompting', 'fine_tuning',
  'governance', 'looping', 'graphics', 'quantum', 'semiconductor',
  'iot', 'agi', 'asi', 'super_ai',
]

export async function fetchDailyLinkedInPosts(date, topic = 'all', { profile = 'all', perDay = 4 } = {}) {
  const params = new URLSearchParams({ date })
  if (topic && topic !== 'all') params.set('topic', topic)
  if (profile && profile !== 'all') params.set('profile', profile)
  if (perDay && perDay !== 4) params.set('per_day', String(perDay))
  const res = await fetch(`/api/linkedin-posts/daily?${params.toString()}`, { cache: 'no-store' })
  const data = await res.json()
  if (!res.ok) throw new Error(data?.error || `Daily posts failed (HTTP ${res.status})`)
  if (!Array.isArray(data.posts)) throw new Error('No posts returned from the daily generator')
  return data
}

export async function fetchLiveLinkedInPosts(topic = 'mixed', maxResults = 6, refresh = false, all = false, timeRange = 'month', date = '') {
  const params = new URLSearchParams()
  if (topic && topic !== 'mixed') params.set('topic', topic)
  if (maxResults && maxResults !== 6) params.set('max_results', String(maxResults))
  if (refresh) params.set('refresh', 'true')
  if (all) params.set('all', 'true')
  if (timeRange && timeRange !== 'month') params.set('time_range', timeRange)
  if (date) params.set('date', date)
  const qs = params.toString()
  const res = await fetch(`/api/linkedin-posts/live${qs ? `?${qs}` : ''}`, { cache: 'no-store' })
  const data = await res.json()
  if (!res.ok) throw new Error(data?.error || `Live fetch failed (HTTP ${res.status})`)
  if (!Array.isArray(data.posts)) throw new Error('No live posts returned')
  return data
}

// LinkedIn CDN blocks cross-site image hotlinking (403) — load via backend proxy.
// Prefers the Go accelerator's cached proxy (fast + 7-day browser cache);
// falls back to the Python proxy when the Go service is down.
let _goServiceOk = null // null = unchecked, true/false after first probe
async function _probeGoService() {
  if (_goServiceOk !== null) return _goServiceOk
  try {
    const r = await fetch('/api/li/health', { cache: 'no-store' })
    _goServiceOk = r.ok
  } catch {
    _goServiceOk = false
  }
  return _goServiceOk
}
export async function linkedinImgProxyAsync(url) {
  const useGo = await _probeGoService()
  return useGo
    ? `/api/li/img?url=${encodeURIComponent(url)}`
    : `/api/linkedin-posts/img?url=${encodeURIComponent(url)}`
}
export const linkedinImgProxy = (url) =>
  url ? (_goServiceOk === false
    ? `/api/linkedin-posts/img?url=${encodeURIComponent(url)}`
    : `/api/li/img?url=${encodeURIComponent(url)}`) : ''

export async function fetchLinkedInProfiles() {
  try {
    const res = await fetch('/api/linkedin-posts/profiles', { cache: 'no-store' })
    if (!res.ok) return []
    const data = await res.json()
    return Array.isArray(data.profiles) ? data.profiles : []
  } catch {
    return []
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Daily LinkedIn posts — Go accelerator (5-year ranges, ~33ms) with Python
// fallback. Response shape is identical either way.
// ─────────────────────────────────────────────────────────────────────────────

export async function fetchDailyLinkedInRangeGo(start, end, topic = 'all', { profile = 'all', perDay = 4 } = {}) {
  const params = new URLSearchParams({ start, end, topic, profile, per_day: String(perDay) })
  const res = await fetch(`/api/li/daily-range?${params.toString()}`, { cache: 'no-store' })
  if (!res.ok) throw new Error(`Go accelerator HTTP ${res.status}`)
  const data = await res.json()
  if (!Array.isArray(data.days)) throw new Error('Go accelerator returned no days')
  return data
}

export async function fetchDailyLinkedInRange(start, end, topic = 'all', { profile = 'all', perDay = 4 } = {}) {
  try {
    return await fetchDailyLinkedInRangeGo(start, end, topic, { profile, perDay })
  } catch (goErr) {
    // Fallback: original Python backend path (capped at 5 years as well now).
    const params = new URLSearchParams({ start, end })
    if (topic && topic !== 'all') params.set('topic', topic)
    if (profile && profile !== 'all') params.set('profile', profile)
    if (perDay && perDay !== 4) params.set('per_day', String(perDay))
    const res = await fetch(`/api/linkedin-posts/range?${params.toString()}`, { cache: 'no-store' })
    const data = await res.json()
    if (!res.ok) throw new Error(data?.error || goErr.message || `Daily range failed (HTTP ${res.status})`)
    if (!Array.isArray(data.days)) throw new Error('No days returned from the daily generator')
    return data
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Video Hub — multi-platform discovery, metadata, embeds, downloads
// ─────────────────────────────────────────────────────────────────────────────

export async function fetchVideoTopics() {
  try {
    const res = await fetch('/api/videos/topics', { cache: 'no-store' })
    if (!res.ok) return []
    const data = await res.json()
    return Array.isArray(data.topics) ? data.topics : []
  } catch {
    return []
  }
}

export async function fetchVideoDiscover(topic = '', start = '', end = '', maxResults = 24, pageToken = '', kind = 'all', country = 'global', lang = 'auto') {
  const params = new URLSearchParams()
  if (topic) params.set('topic', topic)
  if (start) params.set('start', start)
  if (end) params.set('end', end)
  params.set('max_results', String(maxResults))
  if (pageToken) params.set('page_token', pageToken)
  if (kind && kind !== 'all') params.set('kind', kind)
  if (country && country !== 'global') params.set('country', country)
  if (lang && lang !== 'auto') params.set('lang', lang)
  const res = await fetch(`/api/videos/discover?${params.toString()}`, { cache: 'no-store' })
  const data = await res.json()
  if (!res.ok) throw new Error(data?.error || `Video discovery failed (HTTP ${res.status})`)
  return data
}

export async function fetchVideoCountries() {
  const res = await fetch('/api/videos/countries', { cache: 'no-store' })
  const data = await res.json()
  if (!res.ok) throw new Error(data?.error || `Countries failed (HTTP ${res.status})`)
  return data
}

export async function fetchVideoLanguages() {
  try {
    const res = await fetch('/api/videos/languages', { cache: 'no-store' })
    const data = await res.json()
    if (!res.ok) return []
    return Array.isArray(data.languages) ? data.languages : []
  } catch {
    return []
  }
}

export async function fetchVideoDiscoverAll(start = '', end = '', kind = 'all', maxResults = 240, country = 'global', lang = 'auto') {
  const params = new URLSearchParams()
  if (start) params.set('start', start)
  if (end) params.set('end', end)
  params.set('kind', kind)
  params.set('max_results', String(maxResults))
  if (country && country !== 'global') params.set('country', country)
  if (lang && lang !== 'auto') params.set('lang', lang)
  const res = await fetch(`/api/videos/discover-all?${params.toString()}`, { cache: 'no-store' })
  const data = await res.json()
  if (!res.ok) throw new Error(data?.error || `Discover-all failed (HTTP ${res.status})`)
  return data
}

export async function fetchVideoDiscoverTiktok(tag = 'ai', maxResults = 24, start = '', end = '', country = 'global', lang = 'auto') {
  const params = new URLSearchParams({ tag, max_results: String(maxResults) })
  if (start) params.set('start', start)
  if (end) params.set('end', end)
  if (country && country !== 'global') params.set('country', country)
  if (lang && lang !== 'auto') params.set('lang', lang)
  const res = await fetch(`/api/videos/discover-tiktok?${params.toString()}`, { cache: 'no-store' })
  const data = await res.json()
  if (!res.ok) throw new Error(data?.error || `TikTok discovery failed (HTTP ${res.status})`)
  return data
}

export async function fetchVideoDiscoverFacebook(tag = 'ai', maxResults = 24, start = '', end = '', country = 'global', lang = 'auto') {
  const params = new URLSearchParams({ tag, max_results: String(maxResults) })
  if (start) params.set('start', start)
  if (end) params.set('end', end)
  if (country && country !== 'global') params.set('country', country)
  if (lang && lang !== 'auto') params.set('lang', lang)
  const res = await fetch(`/api/videos/discover-facebook?${params.toString()}`, { cache: 'no-store' })
  const data = await res.json()
  if (!res.ok) throw new Error(data?.error || `Facebook discovery failed (HTTP ${res.status})`)
  return data
}

export async function fetchVideoDiscoverAllTiktok(maxResults = 120, perTopic = 6, start = '', end = '', country = 'global', lang = 'auto') {
  const params = new URLSearchParams({ max_results: String(maxResults), per_topic: String(perTopic) })
  if (start) params.set('start', start)
  if (end) params.set('end', end)
  if (country && country !== 'global') params.set('country', country)
  if (lang && lang !== 'auto') params.set('lang', lang)
  const res = await fetch(`/api/videos/discover-all-tiktok?${params.toString()}`, { cache: 'no-store' })
  const data = await res.json()
  if (!res.ok) throw new Error(data?.error || `TikTok load-all failed (HTTP ${res.status})`)
  return data
}

export async function fetchVideoDiscoverAllFacebook(maxResults = 120, perTopic = 6, start = '', end = '', country = 'global', lang = 'auto') {
  const params = new URLSearchParams({ max_results: String(maxResults), per_topic: String(perTopic) })
  if (start) params.set('start', start)
  if (end) params.set('end', end)
  if (country && country !== 'global') params.set('country', country)
  if (lang && lang !== 'auto') params.set('lang', lang)
  const res = await fetch(`/api/videos/discover-all-facebook?${params.toString()}`, { cache: 'no-store' })
  const data = await res.json()
  if (!res.ok) throw new Error(data?.error || `Facebook load-all failed (HTTP ${res.status})`)
  return data
}

export async function fetchVideoDiscoverX(tag = 'ai', maxResults = 24, start = '', end = '', country = 'global', lang = 'auto') {
  const params = new URLSearchParams({ tag, max_results: String(maxResults) })
  if (start) params.set('start', start)
  if (end) params.set('end', end)
  if (country && country !== 'global') params.set('country', country)
  if (lang && lang !== 'auto') params.set('lang', lang)
  const res = await fetch(`/api/videos/discover-x?${params.toString()}`, { cache: 'no-store' })
  const data = await res.json()
  if (!res.ok) throw new Error(data?.error || `X discovery failed (HTTP ${res.status})`)
  return data
}

export async function fetchVideoDiscoverAllX(maxResults = 120, perTopic = 6, start = '', end = '', country = 'global', lang = 'auto') {
  const params = new URLSearchParams({ max_results: String(maxResults), per_topic: String(perTopic) })
  if (start) params.set('start', start)
  if (end) params.set('end', end)
  if (country && country !== 'global') params.set('country', country)
  if (lang && lang !== 'auto') params.set('lang', lang)
  const res = await fetch(`/api/videos/discover-all-x?${params.toString()}`, { cache: 'no-store' })
  const data = await res.json()
  if (!res.ok) throw new Error(data?.error || `X load-all failed (HTTP ${res.status})`)
  return data
}

export async function fetchVideoDiscoverInstagram(tag = 'ai', maxResults = 24, start = '', end = '', country = 'global', lang = 'auto') {
  const params = new URLSearchParams({ tag, max_results: String(maxResults) })
  if (start) params.set('start', start)
  if (end) params.set('end', end)
  if (country && country !== 'global') params.set('country', country)
  if (lang && lang !== 'auto') params.set('lang', lang)
  const res = await fetch(`/api/videos/discover-instagram?${params.toString()}`, { cache: 'no-store' })
  const data = await res.json()
  if (!res.ok) throw new Error(data?.error || `Instagram discovery failed (HTTP ${res.status})`)
  return data
}

export async function fetchVideoDiscoverAllInstagram(maxResults = 120, perTopic = 6, start = '', end = '', country = 'global', lang = 'auto') {
  const params = new URLSearchParams({ max_results: String(maxResults), per_topic: String(perTopic) })
  if (start) params.set('start', start)
  if (end) params.set('end', end)
  if (country && country !== 'global') params.set('country', country)
  if (lang && lang !== 'auto') params.set('lang', lang)
  const res = await fetch(`/api/videos/discover-all-instagram?${params.toString()}`, { cache: 'no-store' })
  const data = await res.json()
  if (!res.ok) throw new Error(data?.error || `Instagram load-all failed (HTTP ${res.status})`)
  return data
}

export async function fetchVideoDiscoverAllNetworks(maxPerNetwork = 120, perTopic = 6, start = '', end = '', country = 'global') {
  const params = new URLSearchParams({ max_per_network: String(maxPerNetwork), per_topic: String(perTopic) })
  if (start) params.set('start', start)
  if (end) params.set('end', end)
  if (country && country !== 'global') params.set('country', country)
  const res = await fetch(`/api/videos/discover-all-networks?${params.toString()}`, { cache: 'no-store' })
  const data = await res.json()
  if (!res.ok) throw new Error(data?.error || `All-networks load failed (HTTP ${res.status})`)
  return data
}

export async function fetchVideoMetadata(url) {
  const res = await fetch(`/api/videos/metadata?url=${encodeURIComponent(url)}`, { cache: 'no-store' })
  const data = await res.json()
  if (!res.ok && !data.embedUrl) throw new Error(data?.error || `Metadata failed (HTTP ${res.status})`)
  return data
}

export async function startVideoDownload(url, quality = '720p') {
  const res = await fetch(`/api/videos/download?url=${encodeURIComponent(url)}&quality=${encodeURIComponent(quality)}`, { method: 'POST' })
  const data = await res.json()
  if (!res.ok) throw new Error(data?.error || `Download failed (HTTP ${res.status})`)
  return data
}

export async function fetchVideoDownloadStatus(jobId) {
  const res = await fetch(`/api/videos/download-status?job_id=${encodeURIComponent(jobId)}`, { cache: 'no-store' })
  if (!res.ok) throw new Error(`Status failed (HTTP ${res.status})`)
  return res.json()
}

export async function fetchVideoDownloads() {
  const res = await fetch('/api/videos/downloads', { cache: 'no-store' })
  if (!res.ok) throw new Error(`Library failed (HTTP ${res.status})`)
  return res.json()
}
