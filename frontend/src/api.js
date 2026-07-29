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

export async function getImages() {
  // Try the backend /api/files endpoint first so newly added files are picked up
  // even without restarting Vite. Fall back to the embedded manifest if the
  // backend is offline (self-contained mode).
  try {
    const res = await fetch('/api/files', { cache: 'no-store' })
    if (res.ok) {
      const data = await res.json()
      return {
        images: data.images || [],
        pdfs: data.pdfs || [],
        documents: data.documents || [],
        dataFiles: data.dataFiles || [],
        allFiles: data.allFiles || [],
        scanPaths: data.scanPaths || [],
        perSource: data.perSource || {},
        generatedAt: data.generatedAt,
        totals: data.totals,
        source: 'backend',
        total: (data.images || []).length,
        pdf_count: (data.pdfs || []).length,
        doc_count: (data.documents || []).length
      }
    }
  } catch (_e) {
    // backend offline, fall through to embedded manifest
  }
  await delay(50)
  // `fileManifest.scanPaths` can be either an array of strings (older shape)
  // or an array of {slug, dir, kind, label} objects (newer shape). Keep it raw.
  return {
    images: fileManifest.images || [],
    pdfs: fileManifest.pdfs || [],
    documents: fileManifest.documents || [],
    dataFiles: fileManifest.dataFiles || [],
    allFiles: fileManifest.allFiles || [],
    scanPaths: fileManifest.scanPaths || [],
    perSource: fileManifest.perSource || {},
    generatedAt: fileManifest.generatedAt,
    totals: {
      images: (fileManifest.images || []).length,
      pdfs: (fileManifest.pdfs || []).length,
      documents: (fileManifest.documents || []).length,
      dataFiles: (fileManifest.dataFiles || []).length,
      total: (fileManifest.allFiles || []).length
    },
    source: 'manifest',
    total: (fileManifest.images || []).length,
    pdf_count: (fileManifest.pdfs || []).length,
    doc_count: (fileManifest.documents || []).length
  }
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
        data: {
          images: data.images || [],
          pdfs: data.pdfs || [],
          documents: data.documents || [],
          dataFiles: data.dataFiles || [],
          allFiles: data.allFiles || [],
          scanPaths: data.scanPaths || [],
          perSource: data.perSource || {},
          generatedAt: data.generatedAt,
          totals: data.totals
        }
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
    data: {
      images: fileManifest.images || [],
      pdfs: fileManifest.pdfs || [],
      documents: fileManifest.documents || [],
      dataFiles: fileManifest.dataFiles || [],
      allFiles: fileManifest.allFiles || [],
      scanPaths: fileManifest.scanPaths || [],
      perSource: fileManifest.perSource || {},
      generatedAt: fileManifest.generatedAt
    }
  }
}

export async function searchGitHubRepos({ topics = [], query = '', sort = 'stars', perPage = 30 } = {}) {
  try {
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    if (topics.length) params.set('topics', topics.join(','))
    params.set('sort', sort)
    params.set('per_page', String(perPage))
    const res = await fetch(`/api/github/search?${params.toString()}`, { cache: 'no-store' })
    if (res.ok) return await res.json()
    return { items: [], total: 0, error: `HTTP ${res.status}` }
  } catch {
    return { items: [], total: 0, error: 'Backend offline' }
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
