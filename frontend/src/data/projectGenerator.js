/**
 * projectGenerator.js — Client-side project structure generator.
 *
 * Takes a job's tech stack, description, and use cases, and generates:
 *   - ASCII box-type architecture diagrams
 *   - Project file tree with descriptions
 *   - Design patterns with explanations
 *   - Code samples
 *   - Project ideas & use cases
 *
 * All generated purely client-side — no backend calls needed.
 */

// ====== Tech Stack Analyzer ======

export function analyzeTechStack(techs = []) {
  const categories = {
    frontend: [],
    backend: [],
    ai_ml: [],
    agent: [],
    data: [],
    infra: [],
  }

  const mapping = {
    frontend: ['react', 'reactjs', 'nextjs', 'typescript', 'javascript', 'tailwind', 'html', 'css', 'vue', 'angular', 'svelte'],
    backend: ['fastapi', 'flask', 'django', 'nodejs', 'express', 'go', 'golang', 'java', 'spring', 'rust', 'graphql', 'grpc'],
    ai_ml: ['pytorch', 'tensorflow', 'transformers', 'hugging face', 'llms', 'openai', 'anthropic', 'langchain', 'llamaindex', 'embedding', 'fine-tun', 'lora', 'qlora', 'mlflow', 'sklearn', 'keras'],
    agent: ['langgraph', 'creawai', 'autogen', 'crewai', 'mcp', 'agent', 'tool', 'function call', 'multi-agent', 'react pattern', 'agent gateway', 'agent loop'],
    data: ['vector db', 'pinecone', 'chromadb', 'faiss', 'qdrant', 'weaviate', 'postgresql', 'sql', 'redis', 'kafka', 'airflow', 'spark', 'snowflake', 'mongodb', 'milvus'],
    infra: ['docker', 'kubernetes', 'k8s', 'aws', 'azure', 'gcp', 'ci/cd', 'mlops', 'observability', 'monitoring', 'prometheus', 'grafana', 'terraform'],
  }

  for (const tech of techs) {
    const tl = tech.toLowerCase()
    let placed = false
    for (const [category, keywords] of Object.entries(mapping)) {
      for (const kw of keywords) {
        if (tl.includes(kw)) {
          categories[category].push(tech)
          placed = true
          break
        }
      }
      if (placed) break
    }
    if (!placed) categories.backend.push(tech)
  }

  return categories
}

// ====== Domain Extraction ======

export function extractDomain(desc = '', useCases = '') {
  const combined = (desc + ' ' + useCases).toLowerCase()
  const domainMap = {
    Automotive: ['automotive', 'hyundai', 'auto', 'car', 'vehicle', 'mobility'],
    Healthcare: ['healthcare', 'health', 'medical', 'patient', 'hipaa', 'pharma'],
    Finance: ['finance', 'banking', 'investment', 'insurance', 'fintech', 'trading'],
    Manufacturing: ['manufacturing', 'factory', 'supply chain', 'logistics', 'industrial'],
    SaaS: ['saas', 'platform', 'cloud', 'software as a service'],
    Retail: ['retail', 'ecommerce', 'customer', 'shopping'],
    Security: ['security', 'cyber', 'defense', 'government'],
    Energy: ['energy', 'power', 'oil', 'gas', 'renewable'],
  }

  let best = 'Technology'
  let bestScore = 0
  for (const [domain, keywords] of Object.entries(domainMap)) {
    const score = keywords.filter(kw => combined.includes(kw)).length
    if (score > bestScore) {
      bestScore = score
      best = domain
    }
  }
  return best
}

// ====== ASCII Box Drawing Helpers ======

function makeBox(title, lines = [], width = 50) {
  const innerWidth = width - 4
  const top = '┌' + '─'.repeat(innerWidth) + '┐'
  const bottom = '└' + '─'.repeat(innerWidth) + '┘'
  const sep = '├' + '─'.repeat(innerWidth) + '┤'

  const result = []
  result.push(top)

  // Title line
  if (title) {
    const padded = ' ' + title + ' '
    const remaining = innerWidth - padded.length
    const leftPad = Math.floor(remaining / 2)
    const rightPad = remaining - leftPad
    result.push('│' + ' '.repeat(leftPad) + padded + ' '.repeat(rightPad) + '│')
    result.push(sep)
  }

  // Content lines
  for (const line of lines) {
    const wrapped = wrapText(line, innerWidth)
    for (const w of wrapped) {
      const rightPad = innerWidth - w.length
      result.push('│ ' + w + ' '.repeat(rightPad) + ' │')
    }
  }

  result.push(bottom)
  return result
}

function wrapText(text, width) {
  if (!text) return ['']
  const words = text.split(' ')
  const lines = []
  let current = ''
  for (const word of words) {
    if ((current + ' ' + word).trim().length > width) {
      lines.push(current.trim())
      current = word
    } else {
      current += (current ? ' ' : '') + word
    }
  }
  if (current.trim()) lines.push(current.trim())
  return lines.length ? lines : ['']
}

function horizontalArrow(length = 5) {
  return ' ' + '─'.repeat(length) + '▶ '
}

function verticalLine(height = 2) {
  return Array(height).fill('  │')
}

// ====== Architecture Diagram Builder ======

export function buildArchitectureDiagram(categorized = {}) {
  const lines = []
  const boxWidth = 48

  lines.push('')
  lines.push('  🏗️  SYSTEM ARCHITECTURE DIAGRAM')
  lines.push('  ' + '═'.repeat(55))
  lines.push('')

  // Infrastructure Layer (bottom)
  if (categorized.infra?.length) {
    lines.push(...makeBox('☁️ Infrastructure Layer', [
      '→ ' + categorized.infra.join(', '),
      'Container orchestration, scaling, monitoring',
    ], boxWidth))
    const arrowLine = horizontalArrow(3)
    lines.push('  │' + arrowLine + ' Supports all layers above')
    lines.push(...verticalLine(1))
  }

  // Data Layer
  if (categorized.data?.length) {
    lines.push(...makeBox('💾 Data Layer', [
      '→ ' + categorized.data.join(', '),
      'Vector storage, databases, message queues',
    ], boxWidth))
    const arrowLine = horizontalArrow(3)
    lines.push('  │' + arrowLine + ' Accessed by AI & backend layers')
    if (!categorized.agent?.length) lines.push(...verticalLine(1))
  }

  // Agent Layer
  if (categorized.agent?.length) {
    lines.push(...makeBox('🤖 Agent Layer', [
      '→ ' + categorized.agent.join(', '),
      'Multi-agent orchestration, MCP, tool calling',
    ], boxWidth))
    const arrowLine = horizontalArrow(3)
    lines.push('  │' + arrowLine + ' Uses AI layer models + tools')
    lines.push(...verticalLine(1))
  }

  // AI/ML Layer
  if (categorized.ai_ml?.length) {
    lines.push(...makeBox('🧠 AI/ML Layer', [
      '→ ' + categorized.ai_ml.join(', '),
      'LLMs, RAG pipelines, embeddings, fine-tuning',
    ], boxWidth))
    const arrowLine = horizontalArrow(3)
    lines.push('  │' + arrowLine + ' Powers agent + backend services')
    lines.push(...verticalLine(1))
  }

  // Backend Layer
  const be = categorized.backend?.[0] || 'FastAPI'
  lines.push(...makeBox('⚙️ Backend Layer (' + be + ')', [
    '→ API Gateway, microservices, auth',
    '→ Routes requests to AI/Agent/Data layers',
  ], boxWidth))
  const arrowLine = horizontalArrow(3)
  lines.push('  │' + arrowLine + ' Serves frontend + external APIs')
  lines.push(...verticalLine(1))

  // Frontend Layer (top)
  const fe = categorized.frontend?.[0] || 'React'
  lines.push(...makeBox('🎨 Frontend Layer (' + fe + ')', [
    '→ UI components, dashboards, agent chat',
    '→ Real-time streaming, monitoring, analytics',
  ], boxWidth))

  lines.push('')
  lines.push('  ' + '═'.repeat(55))
  lines.push('')

  return lines.join('\n')
}

// ====== Project Structure Builder ======

export function buildProjectStructure(categorized = {}, domain = 'Technology') {
  const lines = []
  const boxWidth = 52

  lines.push('')
  lines.push('  📁 PROJECT STRUCTURE')
  lines.push('  ' + '═'.repeat(55))
  lines.push('')

  // Backend structure
  const beDir = [
    'backend/',
    '  ├── app/',
    '  │   ├── main.py          # API entry point',
    '  │   ├── config.py        # Settings & env vars',
    '  │   ├── models/',
    '  │   │   └── schemas.py   # Pydantic models',
    '  │   ├── services/',
    '  │   │   ├── rag_service.py        # RAG pipeline',
    '  │   │   ├── agent_orchestrator.py # Multi-agent',
    '  │   │   ├── llm_factory.py        # LLM abstraction',
    '  │   │   ├── guardrails.py         # Safety checks',
    '  │   │   └── evaluation.py         # Metrics',
    '  │   └── mcp/',
    '  │       ├── server.py    # MCP protocol server',
    '  │       └── tools.py     # Enterprise tools',
    '  ├── requirements.txt',
    '  └── Dockerfile',
  ]
  lines.push(...makeBox('🐍 Backend (' + (categorized.backend?.[0] || 'FastAPI') + ')', beDir, boxWidth))
  lines.push('')
  lines.push('  │')
  lines.push('  │  ' + horizontalArrow(3) + ' REST/WebSocket API')
  lines.push('  │')

  // Frontend structure
  const feDir = [
    'frontend/',
    '  ├── package.json',
    '  ├── src/',
    '  │   ├── app/page.tsx     # Main page',
    '  │   ├── components/',
    '  │   │   ├── AgentChat.tsx  # Chat interface',
    '  │   │   └── Dashboard.tsx  # Metrics UI',
    '  │   └── lib/api.ts       # API client',
    '  ├── tailwind.config.js',
    '  └── Dockerfile',
  ]
  lines.push(...makeBox('⚛️ Frontend (' + (categorized.frontend?.[0] || 'React') + ')', feDir, boxWidth))
  lines.push('')
  lines.push('  │')
  lines.push('  │  ' + horizontalArrow(3) + ' Docker Compose')
  lines.push('  │')

  // DevOps structure
  const opsDir = [
    'infra/',
    '  ├── docker-compose.yml',
    '  ├── kubernetes/',
    '  │   └── deployment.yaml',
    '  ├── .env.example',
    '  ├── .github/workflows/ci.yml',
    '  ├── monitoring/',
    '  │   ├── prometheus.yml',
    '  │   └── grafana.json',
    '  └── terraform/',
    '      └── main.tf',
  ]
  lines.push(...makeBox('☸️ Infrastructure & DevOps', opsDir, boxWidth))

  // Documentation
  lines.push('')
  const docDir = [
    'docs/',
    '  ├── architecture.md     # System design',
    '  ├── api.md              # API reference',
    '  ├── deployment.md       # Deployment guide',
    '  └── README.md           # Getting started',
  ]
  lines.push(...makeBox('📝 Documentation', docDir, boxWidth))

  lines.push('')
  lines.push('  ' + '═'.repeat(55))
  lines.push('  📊 Total: ~25+ source files across 4 layers')

  return lines.join('\n')
}

// ====== Design Patterns Builder ======

export function buildDesignPatterns(categorized = {}) {
  const lines = []
  const boxWidth = 50

  lines.push('')
  lines.push('  🧩 AI DESIGN PATTERNS')
  lines.push('  ' + '═'.repeat(55))
  lines.push('')

  const patterns = [
    {
      name: 'ReAct Pattern',
      pattern: 'Reasoning + Acting',
      desc: 'Interleaved reasoning traces with tool-calling actions for transparent agent decisions',
      when: 'All agent systems requiring explainable step-by-step reasoning',
    },
    {
      name: 'Multi-Agent Orchestration',
      pattern: 'Orchestrator-Worker',
      desc: 'Central orchestrator decomposes tasks and delegates to specialized worker agents',
      when: 'Complex multi-step workflows requiring specialized agent capabilities',
    },
    {
      name: 'RAG with Hybrid Search',
      pattern: 'Retrieval-Augmented Generation',
      desc: 'Combine vector similarity, BM25 keyword search with RRF fusion',
      when: 'High-accuracy information retrieval from large knowledge bases',
    },
    {
      name: 'MCP (Model Context Protocol)',
      pattern: 'Standardized Agent-Tool Protocol',
      desc: 'Agents discover and invoke tools through a standardized protocol',
      when: 'Multi-agent systems requiring standardized tool access and context sharing',
    },
    {
      name: 'Human-in-the-Loop',
      pattern: 'Approval Gateway',
      desc: 'High-risk agent actions pause and request human approval before execution',
      when: 'Enterprise deployments requiring governance and compliance',
    },
    {
      name: 'Circuit Breaker',
      pattern: 'Resilience Pattern',
      desc: 'Prevent cascading failures when external LLM APIs or services are down',
      when: 'Systems depending on external LLM APIs with rate limits and variable latency',
    },
    {
      name: 'Semantic Caching',
      pattern: 'Cache-Aside with Embedding Similarity',
      desc: 'Cache LLM responses based on semantic similarity of queries',
      when: 'Production systems with repeated queries to reduce LLM costs',
    },
    {
      name: 'CQRS + Event Sourcing',
      pattern: 'Command Query Responsibility Segregation',
      desc: 'Separate read/write models for agent state and audit trails',
      when: 'Systems requiring audit logging, event replay, and scalable read/write paths',
    },
  ]

  for (const p of patterns) {
    lines.push(...makeBox(p.name, [
      '📐 Pattern: ' + p.pattern,
      '─'.repeat(boxWidth - 4),
      '📖 ' + p.desc,
      '─'.repeat(boxWidth - 4),
      '💡 ' + p.when,
    ], boxWidth))
    lines.push('')
  }

  lines.push('  ' + '═'.repeat(55))
  lines.push('  🎯 Total: ' + patterns.length + ' design patterns identified')

  return lines.join('\n')
}

// ====== Code Samples Builder ======

export function buildCodeSamples(categorized = {}) {
  const lines = []
  const boxWidth = 54

  lines.push('')
  lines.push('  💻 CODE SAMPLES & CONCEPTS')
  lines.push('  ' + '═'.repeat(55))
  lines.push('')

  // Sample 1: RAG Service
  lines.push(...makeBox('📡 RAG Pipeline (Retrieval-Augmented Generation)', [
    'Core concept: Hybrid search with semantic reranking',
    '─'.repeat(boxWidth - 4),
    'class RAGService:',
    '    async def query(self, query: str):',
    '        # 1. Query rewriting',
    '        rewritten = await llm.rewrite_query(query)',
    '        # 2. Hybrid search (vector + BM25)',
    '        docs = await hybrid_search(rewritten)',
    '        # 3. Cross-encoder reranking',
    '        top = await rerank(query, docs)',
    '        # 4. Context assembly + generation',
    '        return await llm.generate(context, query)',
    '─'.repeat(boxWidth - 4),
    '💡 Concept: Combines semantic & keyword search',
    '   with Reciprocal Rank Fusion (RRF) for',
    '   better retrieval accuracy.',
  ], boxWidth))
  lines.push('')

  // Sample 2: Agent Orchestrator
  lines.push(...makeBox('🤖 Multi-Agent Orchestrator', [
    'Core concept: Task decomposition + agent routing',
    '─'.repeat(boxWidth - 4),
    'class AgentOrchestrator:',
    '    async def execute(self, task):',
    '        # 1. LLM decomposes task into steps',
    '        plan = await decompose(task)',
    '        # 2. Route to specialized agents',
    '        for step in plan.steps:',
    '            agent = select_agent(step)',
    '            result = await agent.run(step)',
    '        # 3. Synthesize results',
    '        return await synthesize(results)',
    '─'.repeat(boxWidth - 4),
    '💡 Concept: Orchestrator agent plans and',
    '   delegates to Research, Analysis, Code agents.',
  ], boxWidth))
  lines.push('')

  // Sample 3: LLM Factory
  lines.push(...makeBox('🔌 Multi-Provider LLM Factory', [
    'Core concept: Provider abstraction + fallback',
    '─'.repeat(boxWidth - 4),
    'class LLMFactory:',
    '    def __init__(self):',
    '        self.providers = [OpenAI, Anthropic]',
    '',
    '    async def generate(self, prompt):',
    '        for provider in self.providers:',
    '            try:',
    '                return await provider.call(prompt)',
    '            except:',
    '                continue  # fallback',
    '        raise Exception("All providers failed")',
    '─'.repeat(boxWidth - 4),
    '💡 Concept: Circuit breaker + fallback chain',
    '   ensures high availability across providers.',
  ], boxWidth))
  lines.push('')

  // Sample 4: Guardrails
  lines.push(...makeBox('🛡️ Guardrails Engine', [
    'Core concept: Input/output safety validation',
    '─'.repeat(boxWidth - 4),
    'class GuardrailsEngine:',
    '    def check_input(self, text):',
    '        # PII detection',
    '        text = redact_pii(text)',
    '        # Injection detection',
    '        if is_injection_attempt(text):',
    '            return False, "Blocked"',
    '        return True, sanitized_text',
    '',
    '    def check_output(self, text):',
    '        # Grounding check',
    '        if not is_grounded(text):',
    '            return "Cannot verify accuracy"',
    '        return text',
    '─'.repeat(boxWidth - 4),
    '💡 Concept: Multi-layer safety ensures',
    '   compliance with enterprise security policies.',
  ], boxWidth))
  lines.push('')

  // Sample 5: MCP Server
  lines.push(...makeBox('🔗 MCP (Model Context Protocol) Server', [
    'Core concept: Standardized agent-tool communication',
    '─'.repeat(boxWidth - 4),
    'class MCPServer:',
    '    def register_tool(self, tool):',
    '        self.tools[tool.name] = tool',
    '',
    '    async def call_tool(self, name, args):',
    '        tool = self.tools.get(name)',
    '        if not tool:',
    '            return {"error": "Tool not found"}',
    '        # Share context between agents',
    '        context = get_shared_context()',
    '        return await tool.handler(args, context)',
    '─'.repeat(boxWidth - 4),
    '💡 Concept: Enables standardized inter-agent',
    '   tool discovery and context sharing (MCP).',
  ], boxWidth))

  lines.push('')
  lines.push('  ' + '═'.repeat(55))
  lines.push('  📚 5 core code concepts with implementations')

  return lines.join('\n')
}

// ====== Project Ideas & Use Cases Builder ======

export function buildProjectIdeas(categorized = {}, domain = 'Technology', useCases = '') {
  const lines = []
  const boxWidth = 52

  lines.push('')
  lines.push('  💡 PROJECT IDEAS & USE CASES')
  lines.push('  ' + '═'.repeat(55))
  lines.push('')

  // Domain-specific use cases
  const domainProjects = {
    Automotive: [
      ['AI Service Advisor', 'LLM-powered diagnostic assistant that analyzes vehicle error codes, service history, and provides repair recommendations with RAG from technical manuals'],
      ['Connected Vehicle Analytics', 'Real-time telemetry processing with agent-based anomaly detection for predictive maintenance and fleet optimization'],
      ['Smart Inventory Agent', 'Multi-agent system that monitors parts inventory, predicts shortages using ML, and autonomously places orders with suppliers'],
      ['Customer Experience Chatbot', 'Omnichannel AI assistant handling test drives, service booking, and vehicle features explanation with personalized recommendations'],
    ],
    Healthcare: [
      ['Clinical Decision Support', 'RAG-powered system that retrieves relevant medical literature and patient history to assist diagnosis'],
      ['Medical Imaging Analysis', 'Computer vision pipeline with fine-tuned models for X-ray/MRI analysis and anomaly detection'],
      ['Patient Intake Agent', 'Conversational agent that collects symptoms, schedules appointments, and pre-fills EHR records'],
    ],
    Finance: [
      ['Fraud Detection Pipeline', 'Real-time transaction monitoring with ML models and agent-based alert triage'],
      ['Automated Research Agent', 'Multi-agent system that gathers financial data, analyzes trends, and generates investment reports'],
      ['Compliance Monitoring', 'LLM-powered system that scans communications for regulatory compliance violations'],
    ],
    SaaS: [
      ['AI Customer Support', 'Ticket triage agent with RAG from knowledge base, automatic resolution suggestions, and escalation routing'],
      ['Usage Analytics Agent', 'Agent that monitors product usage patterns, identifies churn risk, and sends personalized retention campaigns'],
      ['Smart Onboarding', 'Conversational onboarding agent that adapts to user role and guides through feature discovery'],
    ],
    Technology: [
      ['Internal Knowledge Base Agent', 'RAG-powered Q&A system over company documentation with multi-source retrieval'],
      ['Code Review Agent', 'Automated code review assistant that analyzes PRs for bugs, style, and security issues'],
      ['DevOps Incident Response', 'Multi-agent system that detects incidents, diagnoses root cause, and executes remediation playbooks'],
      ['Data Pipeline Orchestrator', 'Agent that monitors data pipelines, retries failures, and alerts on data quality issues'],
    ],
  }

  const projects = domainProjects[domain] || domainProjects.Technology
  for (const [name, idea] of projects) {
    lines.push(...makeBox('🚀 ' + name, [
      '📋 ' + idea.substring(0, boxWidth - 6),
      ...wrapText(idea.substring(boxWidth - 6), boxWidth - 4),
      '─'.repeat(boxWidth - 4),
      '🔧 Uses: ' + [
        ...categorized.ai_ml?.slice(0, 2) || [],
        ...categorized.agent?.slice(0, 2) || [],
        ...categorized.backend?.slice(0, 1) || [],
      ].join(', '),
    ], boxWidth))
    lines.push('')
  }

  // Additional use cases from job
  if (useCases) {
    lines.push(...makeBox('📌 Job Use Cases', [
      ...wrapText(useCases, boxWidth - 4),
    ], boxWidth))
    lines.push('')
  }

  lines.push('  ' + '═'.repeat(55))
  lines.push('  🎯 ' + projects.length + ' project ideas generated for ' + domain + ' domain')

  return lines.join('\n')
}

// ====== Main Generator ======

export function generateProjectView(job = {}) {
  const techs = job.techs || []
  const desc = job.desc || ''
  const useCases = Array.isArray(job.use_cases) ? job.use_cases.join(', ') : (job.use_cases || '')

  const categorized = analyzeTechStack(techs)
  const domain = extractDomain(desc, useCases)

  const archDiagram = buildArchitectureDiagram(categorized)
  const projectStructure = buildProjectStructure(categorized, domain)
  const designPatterns = buildDesignPatterns(categorized)
  const codeSamples = buildCodeSamples(categorized)
  const projectIdeas = buildProjectIdeas(categorized, domain, useCases)

  const header = `
  ╔═══════════════════════════════════════════════════════╗
  ║             AI PROJECT GENERATOR                      ║
  ║        ${(job.title || 'Untitled').slice(0, 42).padEnd(42)}║
  ║        ${(job.company || 'Unknown').slice(0, 42).padEnd(42)}║
  ╚═══════════════════════════════════════════════════════╝

  🏢 Domain: ${domain}
  🔧 Tech Stack: ${techs.join(', ') || 'N/A'}
  📊 Layers: ${Object.values(categorized).filter(v => v.length).length}/6
  `

  return {
    header,
    domain,
    categorized,
    archDiagram,
    projectStructure,
    designPatterns,
    codeSamples,
    projectIdeas,
    full: [header, archDiagram, projectStructure, designPatterns, codeSamples, projectIdeas].join('\n'),
  }
}
