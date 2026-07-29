// AI Knowledge Hub — Self-Contained Data Module
// All data embedded directly — no backend API needed

import { FILE_CATEGORIES, SUPERAIDEVS_CATEGORY, CATEGORY_ICONS } from './categories'
import { AI_JOBS, JOB_TECHS, JOB_LOCATIONS } from './jobs'
import { TOPGENAI_JOBS, TOPGENAI_TECHS, TOPGENAI_LOCATIONS } from './topgenai_jobs'
import { KNOWLEDGE_SECTIONS } from './knowledgeTable'
import { CHAPTER_SECTIONS } from './chapterSections'

// Normalize TopGenAI jobs to match AI_JOBS format and merge all job sources
const NORMALIZED_TOPGENAI = TOPGENAI_JOBS.map(j => ({
  title: j.title,
  company: j.company,
  location: j.location || 'Remote',
  salary: j.salary || '',
  techs: j.skills || [],
  desc: j.desc || '',
  use_cases: '',
  url: j.url || '',
  source: 'topgenaijobs.com',
  experience: j.experience || '',
  job_type: j.job_type || '',
  mode: j.mode || '',
  posted: j.posted || ''
}))

// Mark existing jobs with source
const NORMALIZED_SUPERAIDEVS = AI_JOBS.map(j => ({
  ...j,
  source: 'superaidevs.com',
  techs: j.techs || []
}))

// Combined jobs - SuperAIDevs first, then TopGenAI
export const ALL_JOBS = [...NORMALIZED_SUPERAIDEVS, ...NORMALIZED_TOPGENAI]

// Combined unique techs
export const ALL_JOB_TECHS = [...new Set([...JOB_TECHS, ...TOPGENAI_TECHS])].sort()

// Combined locations
export const ALL_JOB_LOCATIONS = [...new Set([...JOB_LOCATIONS, ...TOPGENAI_LOCATIONS])].sort()

// ===== ALL CATEGORIES =====
export const ALL_CATEGORIES = FILE_CATEGORIES

// ===== CATEGORY HELPERS =====
export function getCategoryById(id) {
  return FILE_CATEGORIES.find(c => c.id === id) || null
}

export function getCategoryIcon(id) {
  return CATEGORY_ICONS[id] || '📁'
}

// ===== FILE SEARCH =====
export function searchFiles(query) {
  if (!query || query.length < 2) return []
  const q = query.toLowerCase()
  const results = []
  for (const cat of FILE_CATEGORIES) {
    for (const file of cat.files) {
      const matchName = file.name.toLowerCase().includes(q)
      const matchSummary = file.summary?.toLowerCase().includes(q)
      const matchTitle = cat.title.toLowerCase().includes(q)
      if (matchName || matchSummary || matchTitle) {
        results.push({
          category: cat.id,
          categoryTitle: cat.title,
          categoryIcon: CATEGORY_ICONS[cat.id] || '📁',
          file,
          score: (matchName ? 3 : 0) + (matchSummary ? 2 : 0) + (matchTitle ? 1 : 0)
        })
      }
    }
  }
  results.sort((a, b) => b.score - a.score)
  return results.slice(0, 20)
}

// ===== KNOWLEDGE SEARCH =====
export function searchKnowledge(query) {
  if (!query || query.length < 2) return []
  const q = query.toLowerCase()
  const results = []
  for (const section of KNOWLEDGE_SECTIONS) {
    for (const row of section.rows) {
      const matchTopic = row.topic?.toLowerCase().includes(q)
      const matchDetails = row.details?.toLowerCase().includes(q)
      const matchConcept = row.concept?.toLowerCase().includes(q)
      const matchUseCases = row.useCases?.some?.(uc => uc.toLowerCase().includes(q))
      const matchProject = row.projectIdea?.toLowerCase().includes(q)
      const matchExamples = row.examples?.some?.(ex => ex.toLowerCase().includes(q))
      if (matchTopic || matchDetails || matchConcept || matchUseCases || matchProject || matchExamples) {
        let score = (matchTopic ? 4 : 0) + (matchDetails ? 2 : 0) + (matchConcept ? 3 : 0) + (matchProject ? 1 : 0)
        if (matchUseCases) score += 2
        if (matchExamples) score += 1
        results.push({
          section: section.id,
          sectionHeading: section.heading,
          sectionIcon: section.icon,
          row,
          score
        })
      }
    }
  }
  results.sort((a, b) => b.score - a.score)
  return results.slice(0, 20)
}

// ===== JOB SEARCH =====
export function searchJobs(query, filters = {}) {
  let results = ALL_JOBS
  if (query && query.length > 1) {
    const q = query.toLowerCase()
    results = results.filter(j =>
      j.title.toLowerCase().includes(q) ||
      j.company.toLowerCase().includes(q) ||
      j.desc.toLowerCase().includes(q) ||
      j.techs.some(t => t.toLowerCase().includes(q))
    )
  }
  if (filters.tech && filters.tech.length > 0) {
    results = results.filter(j =>
      filters.tech.some(t => j.techs.includes(t))
    )
  }
  if (filters.location) {
    results = results.filter(j => j.location === filters.location)
  }
  if (filters.source) {
    results = results.filter(j => j.source === filters.source)
  }
  return results
}

// ===== UNIFIED SEARCH =====
export function unifiedSearch(query) {
  if (!query || query.length < 2) return { files: [], knowledge: [], jobs: [] }
  return {
    files: searchFiles(query),
    knowledge: searchKnowledge(query),
    jobs: searchJobs(query).slice(0, 8)
  }
}

// ===== CHAPTERS (from existing chapters_data.py content) =====
export const CHAPTERS = [
  {
    id: "llm-models",
    num: "01",
    title: "LLM Models & Providers",
    icon: "🧠",
    preview: "Complete reference of cloud LLM providers, open-weight models, local runners, and pricing comparison across all major AI model providers.",
    tags: ["LLM", "OpenAI", "Claude", "Gemini", "Llama", "Mistral", "DeepSeek", "Ollama", "Local Models"]
  },
  {
    id: "rag-pipeline",
    num: "02",
    title: "RAG Production Pipeline — Complete 9-Step Reference",
    icon: "🔧",
    preview: "Complete production RAG pipeline: query capture, processing, embedding, hybrid search, vector DB, reranking, context assembly, generation, grounding check, plus Corrective RAG, GraphRAG, Self-RAG, and Multi-Modal RAG.",
    tags: ["RAG", "Pipeline", "Hybrid Search", "Reranking", "Grounding", "Vector DB", "Production"]
  },
  {
    id: "vector-databases",
    num: "03",
    title: "Vector Databases & Semantic Search",
    icon: "🗄️",
    preview: "Complete comparison of Qdrant, Pinecone, Weaviate, pgvector, ChromaDB, Milvus. Index types (HNSW, IVF, Flat), multi-tenancy, and production deployment patterns.",
    tags: ["Vector DB", "Qdrant", "Pinecone", "Weaviate", "pgvector", "ChromaDB", "HNSW", "Milvus"]
  },
  {
    id: "ai-agents",
    num: "04",
    title: "AI Agents & Multi-Agent Systems",
    icon: "🤖",
    preview: "Complete reference on AI agent architectures: ReAct pattern, LangGraph state machines, CrewAI multi-agent teams, MCP/A2A/ACP protocols, swarm intelligence, hierarchical agent trees, multi-agent debate, agent memory systems, and agent evaluation.",
    tags: ["Agents", "LangGraph", "CrewAI", "MCP", "A2A", "ReAct", "Multi-Agent", "Orchestration"]
  },
  {
    id: "prompt-engineering",
    num: "05",
    title: "Prompt Engineering & Guardrails",
    icon: "⚡",
    preview: "System prompt templates, prompt injection defense, PII masking, prompt pattern library (CoT, Few-shot, Structured Output), and NeMo guardrails implementation.",
    tags: ["Prompt Engineering", "Guardrails", "Injection Defense", "PII", "NeMo", "System Prompts"]
  },
  {
    id: "fine-tuning-local",
    num: "06",
    title: "Fine-Tuning & Local Deployment",
    icon: "⚙️",
    preview: "LoRA/QLoRA fine-tuning, DPO alignment, RLHF, model merging, quantization (GGUF, GPTQ), Ollama deployment, and vLLM serving.",
    tags: ["Fine-tuning", "LoRA", "QLoRA", "DPO", "RLHF", "Quantization", "Ollama", "vLLM"]
  },
  {
    id: "system-design",
    num: "07",
    title: "System Design & Architecture",
    icon: "🏗️",
    preview: "Enterprise AI architecture patterns, API gateway design, multi-tenant RAG, observability stack, security architecture, and deployment blueprints.",
    tags: ["System Design", "Architecture", "Enterprise", "Scalability", "Security", "Deployment"]
  },
  {
    id: "observability-evals",
    num: "08",
    title: "Observability, Evals & MLOps",
    icon: "📊",
    preview: "LLM tracing (LangFuse, LangSmith), evaluation frameworks (RAGAS, DeepEval), metrics monitoring, drift detection, and CI/CD for ML pipelines.",
    tags: ["Observability", "Evals", "MLOps", "Tracing", "Monitoring", "CI/CD", "RAGAS"]
  },
  {
    id: "security-guardrails",
    num: "09",
    title: "AI Security & Guardrails",
    icon: "🔒",
    preview: "Prompt injection defense, PII masking, adversarial testing, NeMo Guardrails, content filtering, and enterprise AI security architecture.",
    tags: ["Security", "Guardrails", "Injection Defense", "PII", "Adversarial", "NeMo"]
  },
  {
    id: "grc-compliance",
    num: "10",
    title: "GRC Compliance",
    icon: "🛡️",
    preview: "500+ GRC frameworks, GDPR, PDPA, EU AI Act, NIST, ISO 42001, audit automation, compliance monitoring, and AI governance.",
    tags: ["GRC", "Compliance", "GDPR", "PDPA", "EU AI Act", "NIST", "ISO", "Governance"]
  },
  {
    id: "enterprise-integration",
    num: "11",
    title: "Enterprise Integration",
    icon: "🔗",
    preview: "Enterprise AI integration patterns, legacy system connectivity, API management, MCP protocol, and enterprise workflow automation.",
    tags: ["Enterprise", "Integration", "MCP", "API", "Workflow", "Legacy Systems"]
  },
  {
    id: "tools-catalog",
    num: "12",
    title: "761+ AI Tools Catalog",
    icon: "🛠️",
    preview: "Comprehensive catalog of 761+ AI tools organized by category: development, design, data, deployment, monitoring, and productivity.",
    tags: ["Tools", "Catalog", "Development", "Design", "Deployment", "Productivity"]
  },
  {
    id: "project-ideas",
    num: "13",
    title: "500+ AI Project Ideas",
    icon: "💡",
    preview: "500+ AI project ideas organized by difficulty level, domain, and technology stack with implementation guides and architecture diagrams.",
    tags: ["Projects", "Ideas", "Beginner", "Advanced", "Domain", "Implementation"]
  },
  {
    id: "career-resources",
    num: "14",
    title: "Career Resources",
    icon: "💼",
    preview: "AI career roadmap, job search strategies, salary benchmarks, interview preparation, certification paths, and career progression planning.",
    tags: ["Career", "Jobs", "Salary", "Interview", "Certification", "Roadmap"]
  },
  {
    id: "ai-news-market",
    num: "15",
    title: "AI News & Market Intel",
    icon: "📡",
    preview: "AI industry news, market analysis, company funding, model releases, regulatory changes, and technology trends.",
    tags: ["News", "Market", "Industry", "Funding", "Trends", "Analysis"]
  },
  {
    id: "python-for-ai",
    num: "16",
    title: "Python for AI Engineering",
    icon: "🐍",
    preview: "Python development for AI: async patterns, Pydantic validation, pytest for AI, NumPy/Pandas for embeddings, tenacity retry, and Loguru logging.",
    tags: ["Python", "Async", "Pydantic", "pytest", "NumPy", "Pandas", "Logging"]
  },
  {
    id: "fastapi-ai-services",
    num: "17",
    title: "FastAPI AI Microservices",
    icon: "⚡",
    preview: "FastAPI for AI services: SSE streaming, WebSocket, REST APIs, background tasks, rate limiting, Docker deployment, and GPU serving.",
    tags: ["FastAPI", "Microservices", "SSE", "WebSocket", "Docker", "GPU", "Streaming"]
  },
  {
    id: "langchain-llamaindex",
    num: "18",
    title: "LangChain & LlamaIndex",
    icon: "⛓️",
    preview: "LangChain LCEL, LangGraph, LlamaIndex query engines, data connectors, router patterns, and using both frameworks together.",
    tags: ["LangChain", "LlamaIndex", "LCEL", "LangGraph", "Query Engine", "Router"]
  },
  {
    id: "react-ai-frontend",
    num: "19",
    title: "React AI Frontends",
    icon: "⚛️",
    preview: "React patterns for AI applications: SSE hooks, Zustand state management, chat UI components, streaming responses, and AI-powered interfaces.",
    tags: ["React", "Frontend", "SSE", "Zustand", "Chat UI", "Streaming"]
  },
  {
    id: "quantum-computing",
    num: "20",
    title: "Quantum Computing & AI",
    icon: "⚛️",
    preview: "Quantum computing fundamentals, Qiskit, quantum ML algorithms, quantum-classical hybrid systems, quantum error correction, QKD for AI security, VQE for chemistry, and 2026-2032 timeline for quantum advantage.",
    tags: ["Quantum", "Qiskit", "Quantum ML", "Hybrid", "Timeline", "Research"]
  },
  {
    id: "robotics-ai",
    num: "21",
    title: "Robotics & AI",
    icon: "🤖",
    preview: "AI-powered robotics: ROS2 integration, YOLO object detection, LLM task planning, SLAM navigation, imitation learning, manipulation, diffusion policy, VLA models, and sim-to-real transfer.",
    tags: ["Robotics", "ROS2", "YOLO", "SLAM", "Imitation Learning", "Manipulation"]
  },
  {
    id: "comprehensive-guide",
    num: "22",
    title: "Reference Guide — All Tables",
    icon: "📚",
    preview: "Complete consolidated reference of all tables, comparisons, and data across all chapters in one comprehensive view.",
    tags: ["Reference", "All Tables", "Consolidated", "Complete Guide"]
  },
  {
    id: "ai-semiconductor",
    num: "23",
    title: "AI Semiconductor & Chip Design",
    icon: "🔬",
    preview: "GPU architectures (H100/B200), TPU v5e/v6, custom ASICs, edge AI chips, hardware-aware quantization, neuromorphic computing, and chiplet design.",
    tags: ["Semiconductor", "GPU", "TPU", "ASIC", "NVIDIA", "Edge AI", "Neuromorphic", "Chiplet"]
  },
  {
    id: "e2e-project",
    num: "24",
    title: "Complete End-to-End AI Project",
    icon: "🚀",
    preview: "Full-stack RAG + Agent system: FastAPI backend, LangChain/LlamaIndex, Qdrant vector DB, LangGraph multi-agent, MCP tools, A2A protocol, React frontend, Docker deployment.",
    tags: ["E2E Project", "Full Stack", "RAG", "LangChain", "LangGraph", "MCP", "A2A", "React", "Docker"]
  },
  {
    id: "ai-agent-architecture",
    num: "25",
    title: "AI Agent Architecture — 13 Steps from Prompt to Production",
    icon: "🧠",
    preview: "Reference architecture every production AI agent follows: Input → Safety → Understanding → Memory → Reasoning → Decision → Planning → Task Queue → Action/Tools → MCP → Result Check → Output → Monitoring. Python code for each step, a complete orchestrator class, project ideas, real-world use cases, and common pitfalls.",
    tags: ["Agents", "Architecture", "ReAct", "MCP", "Planning", "Memory", "Production", "Monitoring", "Tools"]
  }
]

export const DEEP_DIVES = [
  {
    id: "rag",
    title: "RAG Pipeline Deep Dive",
    icon: "🔍",
    description: "Chunking, retrieval, evaluation, and production optimization for RAG systems.",
    color: "#a6e3a1",
    sections: [
      { heading: "Overview — Why RAG Matters", text: "RAG (Retrieval Augmented Generation) is the most deployed pattern for grounding LLMs in enterprise data. It combines information retrieval with text generation to produce factual, sourced answers. The production pipeline has 9 stages from query capture to grounding verification." },
      { heading: "Chunking Strategies", text: "The highest-impact preprocessing decision. Semantic chunking preserves context boundaries vs fixed-size splitting. Strategies: Fixed-size (512 tokens), Semantic boundary (+15-20% recall), Contextual retrieval (+20-30%), Hierarchical (parent/child), Agentic (adaptive, +25-40%)." },
      { heading: "Hybrid Search & Reranking", text: "Pure vector search misses exact terms. Hybrid combines dense embeddings + sparse BM25 via RRF. The reranker (cross-encoder) is the single highest-ROI step — without it top-3 recall drops 15-30%." },
      { heading: "Evaluation & Monitoring", text: "RAG evaluation: Faithfulness (does answer match context?), Relevance (does answer address query?), Completeness (all aspects covered?). Tools: RAGAS, DeepEval, LangFuse for tracing. Metrics: recall@K, MRR, grounding pass rate." }
    ]
  },
  {
    id: "agents",
    title: "Agents & Multi-Agent Deep Dive",
    icon: "🤖",
    description: "LangGraph, CrewAI, MCP/A2A protocols, and agent orchestration patterns.",
    color: "#89b4fa",
    sections: [
      { heading: "Agent Fundamentals", text: "AI Agents are autonomous systems using LLMs to plan, reason, and execute tasks. Core pattern: ReAct (Reason + Act) — Think → Choose action → Observe → Repeat. Built on tool calling, structured outputs, and memory." },
      { heading: "LangGraph State Machines", text: "Models agent workflows as a state machine: nodes (functions), edges (transitions), conditional edges (decisions). Built-in HITL via interrupt/checkpoint. Persistence saves graph state per thread ID." },
      { heading: "MCP Protocol", text: "Model Context Protocol (Anthropic): Connects LLMs to tools/data. 3 core concepts — Tools (functions), Resources (data), Prompts (templates). JSON-RPC over stdio or SSE. Server registers tools via decorators." },
      { heading: "Multi-Agent Patterns", text: "Common patterns: Supervisor (orchestrator delegates), Team/Crew (roles), Reflection (generate → critique → refine), Plan-Execute (planner → steps). A2A for agent-to-agent, ACP for compliance." }
    ]
  },
  {
    id: "compliance",
    title: "GRC Compliance Deep Dive",
    icon: "📋",
    description: "500+ frameworks, EU AI Act, audit automation, and compliance monitoring.",
    color: "#f9e2af",
    sections: [
      { heading: "Regulatory Landscape", text: "500+ GRC frameworks across 50+ countries. Key regulations: GDPR (EU data protection), PDPA (Singapore), EU AI Act (AI risk classification), NIST AI RMF, ISO 42001 (AI management)." },
      { heading: "AI-Specific Compliance", text: "EU AI Act classifies AI systems by risk: Unacceptable (banned), High (conformity assessment), Limited (transparency), Minimal (code of conduct). Requires DPIA for high-risk systems." },
      { heading: "Audit Trail Requirements", text: "Regulated environments require full chain-of-custody: query → process → search → rerank → generate → ground. Every claim must be traceable to source. PII masking mandatory." },
      { heading: "Compliance Automation", text: "Automated compliance monitoring: drift detection, violation alerts, compliance reports. Tools: automated DPIA generators, policy enforcement engines, audit log aggregators." }
    ]
  },
  {
    id: "security",
    title: "AI Security & Guardrails Deep Dive",
    icon: "🔐",
    description: "Guardrail architecture, PII masking, adversarial testing, and security patterns.",
    color: "#f38ba8",
    sections: [
      { heading: "Multi-Layer Defense Architecture", text: "AI security requires 4 layers: Input guardrails (injection detection, PII masking), System guardrails (prompt enforcement), Output guardrails (content filtering, bias scanning), Retrieval guardrails (access control, tenant isolation)." },
      { heading: "Prompt Injection Defense", text: "#1 security threat for LLM apps. Defense: input pattern detection (ignore previous instructions, DAN attacks), PII masking (NRIC, email, phone, credit card), output filtering (re-check PII, harmful content)." },
      { heading: "NeMo Guardrails", text: "NVIDIA NeMo Guardrails provides Colang DSL for conversational guardrails. Controls input, output, and retrieval flows with programmable rules. Supports jailbreak detection, topic enforcement, safety checks." },
      { heading: "Adversarial Testing", text: "Systematic adversarial evaluation: prompt injection attempts, jailbreak variants (role-play, encoding, multi-language), bias probing, edge cases. Continuous red-teaming with LLM-as-a-Judge." }
    ]
  }
]

// ===== STATISTICS =====
export const APP_STATS = {
  chapters: CHAPTERS.length,
  deepDives: DEEP_DIVES.length,
  categories: FILE_CATEGORIES.length,
  totalFiles: FILE_CATEGORIES.reduce((sum, c) => sum + c.files.length, 0),
  jobs: ALL_JOBS.length,
  knowledgeSections: KNOWLEDGE_SECTIONS.length,
  knowledgeRows: KNOWLEDGE_SECTIONS.reduce((sum, s) => sum + s.rows.length, 0),
  totalJobs: ALL_JOBS.length,
  superaidevsJobs: NORMALIZED_SUPERAIDEVS.length,
  topgenaiJobs: NORMALIZED_TOPGENAI.length
}

// ===== CHAPTER SECTIONS ACCESSOR =====
export function getChapterSections(chapterId) {
  return CHAPTER_SECTIONS[chapterId]?.sections || null
}

// ===== JOB SOURCE LINK =====
// Build a "View source" URL for a single job entry.
// Prefers the bundled `url` field (original posting on superaidevs.com).
// Falls back to a Google search of "<title> <company> job" so we still
// always have *something* useful to open.
export function buildSourceUrl(job) {
  if (job && typeof job.url === 'string' && job.url.trim()) {
    return job.url
  }
  const clean = (s) => (s || '').replace(/<!--\s*-->/g, '').trim()
  const q = `${clean(job && job.title)} ${clean(job && job.company)} job`.trim()
  return `https://www.google.com/search?q=${encodeURIComponent(q)}`
}

// ===== EXPORTS =====
export { FILE_CATEGORIES, SUPERAIDEVS_CATEGORY, CATEGORY_ICONS, AI_JOBS, JOB_TECHS, JOB_LOCATIONS, KNOWLEDGE_SECTIONS, CHAPTER_SECTIONS }
export { TOPGENAI_JOBS, TOPGENAI_TECHS, TOPGENAI_LOCATIONS } from './topgenai_jobs'
