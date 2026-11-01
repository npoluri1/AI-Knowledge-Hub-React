export const AGENT_TYPES = [
  { id: 'single', name: 'Task AI Agents', icon: '🤖', color: '#89b4fa', description: 'Specialized agents that complete one well-defined business task.' },
  { id: 'multi', name: 'Multi-Agent Systems', icon: '🤝', color: '#cba6f7', description: 'Cooperating agents that plan, delegate, verify, and deliver a shared outcome.' },
  { id: 'platform', name: 'Agentic AI Platforms', icon: '🧠', color: '#94e2d5', description: 'Reusable runtimes for tools, memory, workflows, governance, and observability.' },
]

export const AGENT_INDUSTRIES = [
  ['banking', 'Banking & Finance', '🏦', 'fraud monitoring, KYC, lending, and customer service'],
  ['healthcare', 'Healthcare', '🩺', 'triage, appointments, clinical documentation, and patient support'],
  ['retail', 'Retail & E-commerce', '🛍️', 'catalog search, recommendations, orders, returns, and inventory'],
  ['telecom', 'Telecommunications', '📡', 'network diagnostics, plan support, billing, and churn prevention'],
  ['government', 'Government', '🏛️', 'citizen services, forms, policy search, and case routing'],
  ['education', 'Education', '🎓', 'tutoring, assessment, admissions, and learning analytics'],
  ['insurance', 'Insurance', '🛡️', 'claims intake, underwriting, policy search, and fraud review'],
  ['automotive', 'Automotive', '🚗', 'vehicle diagnostics, service scheduling, recalls, and parts'],
  ['realestate', 'Real Estate', '🏢', 'listing search, valuation, tenant support, and maintenance'],
  ['travel', 'Travel & Hospitality', '🌍', 'trip planning, booking, itinerary changes, and guest support'],
  ['energy', 'Energy & Utilities', '⚡', 'outage response, billing, demand forecasting, and field service'],
  ['agriculture', 'Agriculture', '🌱', 'crop advice, weather alerts, pest detection, and supply planning'],
  ['manufacturing', 'Manufacturing', '🔧', 'quality inspection, maintenance, safety, and supply chain'],
  ['media', 'Media & Entertainment', '🎬', 'content discovery, moderation, production, and audience analytics'],
  ['legal', 'Legal', '⚖️', 'case research, contract review, discovery, and compliance'],
].map(([id, name, icon, focus]) => ({ id, name, icon, focus }))

export const AGENT_COUNTRIES = [
  ['us', 'United States', '🇺🇸'], ['gb', 'United Kingdom', '🇬🇧'], ['de', 'Germany', '🇩🇪'], ['fr', 'France', '🇫🇷'], ['jp', 'Japan', '🇯🇵'],
  ['cn', 'China', '🇨🇳'], ['in', 'India', '🇮🇳'], ['sg', 'Singapore', '🇸🇬'], ['au', 'Australia', '🇦🇺'], ['ca', 'Canada', '🇨🇦'],
  ['br', 'Brazil', '🇧🇷'], ['ae', 'United Arab Emirates', '🇦🇪'], ['kr', 'South Korea', '🇰🇷'], ['nl', 'Netherlands', '🇳🇱'], ['se', 'Sweden', '🇸🇪'],
  ['ch', 'Switzerland', '🇨🇭'], ['il', 'Israel', '🇮🇱'], ['ng', 'Nigeria', '🇳🇬'], ['za', 'South Africa', '🇿🇦'], ['mx', 'Mexico', '🇲🇽'],
  ['id', 'Indonesia', '🇮🇩'], ['th', 'Thailand', '🇹🇭'], ['ph', 'Philippines', '🇵🇭'], ['vn', 'Vietnam', '🇻🇳'], ['ru', 'Russia', '🇷🇺'],
].map(([id, name, flag]) => ({ id, name, flag }))

const TASKS = [
  'Customer Support', 'Research', 'Document Processing', 'Fraud Detection', 'Operations',
  'Data Analysis', 'Compliance', 'Sales', 'Scheduling', 'Knowledge Management',
  'Quality Inspection', 'Incident Response', 'Forecasting', 'Workflow Automation', 'Personalization',
  'Translation', 'Monitoring', 'Reporting', 'Onboarding', 'Risk Review',
  'Field Service', 'Recommendation', 'Case Routing', 'Audit', 'Planning',
  'Procurement', 'Training', 'Content Moderation', 'Search', 'Optimization',
  'Reconciliation', 'Notification', 'Classification', 'Summarization', 'Verification',
  'Anomaly Detection', 'Eligibility', 'Escalation', 'Inventory', 'Maintenance',
  'Document Drafting', 'Data Enrichment', 'Feedback Analysis', 'Capacity Planning', 'Knowledge Retrieval',
  'Quality Assurance', 'Security Review', 'Cost Optimization', 'Change Management', 'Human Review',
]

const VARIANT_STYLES = ['assistant', 'analyst', 'coordinator', 'reviewer', 'operator', 'advisor', 'specialist', 'automation', 'monitor', 'copilot']
const VARIANT_ACTIONS = ['intake', 'triage', 'validation', 'routing', 'forecasting', 'reconciliation', 'notification', 'quality', 'optimization', 'planning']

// Curated aliases keep the original five directory cards compatible with the
// generated blueprint detail route. The aliases are intentionally small and
// use the same shape as generated agents.
const CURATED_AGENT_DEFINITIONS = {
  research: {
    id: 'research', name: 'Research Assistant', type: 'single', country: 'us', industry: 'education',
    description: 'Search the web, read papers, synthesize findings.',
    useCases: ['web research', 'paper review', 'brief generation'],
    tasks: ['Research intake', 'Source retrieval', 'Evidence validation', 'Human review', 'Brief delivery'],
    status: 'learning blueprint', variant: 1,
  },
  coding: {
    id: 'coding', name: 'Coding Assistant', type: 'single', country: 'us', industry: 'manufacturing',
    description: 'Write, review, and debug code across repositories.',
    useCases: ['code generation', 'code review', 'debugging'],
    tasks: ['Code intake', 'Repository context', 'Patch validation', 'Human review', 'Change delivery'],
    status: 'learning blueprint', variant: 2,
  },
  'customer-support': {
    id: 'customer-support', name: 'Customer Support', type: 'single', country: 'au', industry: 'retail',
    description: 'Handle customer queries with knowledge base retrieval.',
    useCases: ['question answering', 'order support', 'escalation'],
    tasks: ['Customer intake', 'Knowledge retrieval', 'Answer validation', 'Human escalation', 'Resolution tracking'],
    status: 'learning blueprint', variant: 3,
  },
  'data-analyst': {
    id: 'data-analyst', name: 'Data Analyst', type: 'single', country: 'gb', industry: 'banking',
    description: 'Analyze datasets and generate visualizations.',
    useCases: ['data quality', 'trend analysis', 'reporting'],
    tasks: ['Analysis intake', 'Dataset retrieval', 'Metric validation', 'Human review', 'Report delivery'],
    status: 'learning blueprint', variant: 4,
  },
  creative: {
    id: 'creative', name: 'Creative Writer', type: 'single', country: 'ca', industry: 'media',
    description: 'Generate articles, stories, and marketing copy.',
    useCases: ['article drafting', 'story ideation', 'marketing copy'],
    tasks: ['Brief intake', 'Reference retrieval', 'Content validation', 'Editorial review', 'Draft delivery'],
    status: 'learning blueprint', variant: 6,
  },
}

const INDUSTRY_USE_CASES = {
  banking: ['KYC onboarding', 'payment anomaly review', 'loan document analysis', 'customer account support', 'AML screening', 'credit scoring', 'portfolio rebalancing', 'regulatory reporting'],
  healthcare: ['appointment coordination', 'clinical document summarization', 'patient intake', 'care-team routing', 'medication adherence', 'insurance pre-auth', 'symptom triage', 'lab result interpretation'],
  retail: ['order resolution', 'inventory planning', 'product personalization', 'returns automation', 'dynamic pricing', 'supply chain visibility', 'customer segmentation', 'cart abandonment recovery'],
  telecom: ['network incident triage', 'billing support', 'plan recommendations', 'field dispatch', 'churn prediction', 'SIM activation', 'data usage analysis', 'roaming support'],
  government: ['citizen case routing', 'permit review', 'benefit eligibility', 'policy search', 'fraud detection', 'tax assistance', 'public records search', 'emergency coordination'],
  education: ['student tutoring', 'admissions review', 'course planning', 'assessment feedback', 'plagiarism detection', 'enrollment support', 'parent communication', 'graduation tracking'],
  insurance: ['claims intake', 'underwriting review', 'policy support', 'fraud investigation', 'premium calculation', 'renewal management', 'damage assessment', 'legal claim routing'],
  automotive: ['vehicle diagnostics', 'service scheduling', 'parts planning', 'recall communication', 'warranty claims', 'fuel efficiency analysis', 'accident reporting', 'fleet management'],
  realestate: ['listing qualification', 'tenant support', 'maintenance dispatch', 'valuation research', 'lease management', 'virtual tour coordination', 'market analysis', 'tenant screening'],
  travel: ['booking support', 'itinerary recovery', 'guest personalization', 'operations coordination', 'loyalty management', 'expense processing', 'visa guidance', 'weather-based planning'],
  energy: ['outage coordination', 'demand forecasting', 'field service dispatch', 'billing support', 'grid optimization', 'renewable integration', 'safety inspection', 'customer usage insights'],
  agriculture: ['crop advisory', 'pest monitoring', 'harvest planning', 'supply coordination', 'weather forecasting', 'soil analysis', 'irrigation management', 'market price tracking'],
  manufacturing: ['quality inspection', 'maintenance planning', 'safety reporting', 'procurement coordination', 'defect analysis', 'production scheduling', 'supply chain optimization', 'worker safety compliance'],
  media: ['content moderation', 'rights review', 'audience analysis', 'production coordination', 'ad placement', 'copyright detection', 'trend prediction', 'subscriber management'],
  legal: ['contract review', 'case research', 'discovery triage', 'compliance monitoring', 'billable hour tracking', 'precedent search', 'risk assessment', 'document comparison'],
}

const AGENTS_PER_COMBO = 1000
const AGENT_TOTAL = AGENT_COUNTRIES.length * AGENT_INDUSTRIES.length * AGENTS_PER_COMBO
export const TOTAL_AGENT_COUNT = AGENT_TOTAL // 25 × 15 × 1,000 = 375,000

function seededRandom(seed) {
  let s = seed
  return () => {
    s = (s * 16807 + 0) % 2147483647
    return (s - 1) / 2147483646
  }
}

function generateAgent(countryIdx, industryIdx, variant) {
  const country = AGENT_COUNTRIES[countryIdx % AGENT_COUNTRIES.length]
  const industry = AGENT_INDUSTRIES[industryIdx % AGENT_INDUSTRIES.length]
  const task = TASKS[variant % TASKS.length]
  const style = VARIANT_STYLES[(variant * 3) % VARIANT_STYLES.length]
  const action = VARIANT_ACTIONS[(variant * 7) % VARIANT_ACTIONS.length]
  const isMulti = variant % 5 === 0 || variant % 8 === 0
  const rand = seededRandom(countryIdx * 100000 + industryIdx * 1000 + variant + 42)
  const useCasePool = INDUSTRY_USE_CASES[industry.id] || [task]
  const selectedUseCases = useCasePool.filter(() => rand() > 0.3).slice(0, 4)
  if (selectedUseCases.length === 0) selectedUseCases.push(useCasePool[0])

  const globalIndex = countryIdx * (AGENT_INDUSTRIES.length * AGENTS_PER_COMBO) + industryIdx * AGENTS_PER_COMBO + variant

  return {
    id: `agent-blueprint-${globalIndex + 1}`,
    name: `${country.name} ${industry.name} ${task} ${style} ${action} Agent ${variant + 1}`,
    type: isMulti ? 'multi' : 'single',
    country: country.id,
    industry: industry.id,
    description: `A ${isMulti ? 'multi-agent' : 'task-agent'} blueprint for ${task.toLowerCase()} in ${industry.name.toLowerCase()} across ${country.name}; focused on ${industry.focus}.`,
    useCases: selectedUseCases,
    tasks: [`${task} intake`, 'Context retrieval', 'Policy validation', 'Human escalation', 'Outcome tracking'],
    status: variant % 5 === 0 ? 'production blueprint' : 'design blueprint',
    variant,
  }
}

// Generate all 1,000 agents for a specific country + industry.
export function generateAgentsForCombo(countryId, industryId) {
  const countryIdx = AGENT_COUNTRIES.findIndex(c => c.id === countryId)
  const industryIdx = AGENT_INDUSTRIES.findIndex(i => i.id === industryId)
  if (countryIdx === -1 || industryIdx === -1) return []
  return Array.from({ length: AGENTS_PER_COMBO }, (_, v) => generateAgent(countryIdx, industryIdx, v))
}

// Generate the first N agents (cumulative), applying optional filters.
// limit = how many matching agents to return (starts from index 0, scans forward until we have `limit` matches).
export function generateAgentsUpTo(limit, filters = {}) {
  const { country: filterCountry, industry: filterIndustry, type: filterType, search: filterSearch } = filters
  const results = []
  // Scan more agents than needed to account for filter rejection
  const maxScan = Math.min(AGENT_TOTAL, limit * 4 + 500)

  for (let globalIdx = 0; globalIdx < maxScan && results.length < limit; globalIdx++) {
    const countryIdx = Math.floor(globalIdx / (AGENT_INDUSTRIES.length * AGENTS_PER_COMBO))
    const industryIdx = Math.floor(globalIdx / AGENTS_PER_COMBO) % AGENT_INDUSTRIES.length
    const variant = globalIdx % AGENTS_PER_COMBO
    const agent = generateAgent(countryIdx, industryIdx, variant)

    if (filterCountry && agent.country !== filterCountry) continue
    if (filterIndustry && agent.industry !== filterIndustry) continue
    if (filterType && agent.type !== filterType) continue
    if (filterSearch) {
      const q = filterSearch.toLowerCase()
      const haystack = `${agent.name} ${agent.description} ${(agent.tasks || []).join(' ')} ${(agent.useCases || []).join(' ')}`.toLowerCase()
      if (!haystack.includes(q)) continue
    }
    results.push(agent)
  }
  return results
}

function agentMatchesFilters(agent, filters = {}) {
  const { country: filterCountry, industry: filterIndustry, type: filterType, search: filterSearch } = filters
  if (filterCountry && agent.country !== filterCountry) return false
  if (filterIndustry && agent.industry !== filterIndustry) return false
  if (filterType && agent.type !== filterType) return false
  if (filterSearch) {
    const query = filterSearch.toLowerCase()
    const haystack = `${agent.name} ${agent.description} ${(agent.tasks || []).join(' ')} ${(agent.useCases || []).join(' ')}`.toLowerCase()
    if (!haystack.includes(query)) return false
  }
  return true
}

function getAgentIndexRange(filters = {}) {
  const countryIndex = filters.country ? AGENT_COUNTRIES.findIndex(item => item.id === filters.country) : -1
  const industryIndex = filters.industry ? AGENT_INDUSTRIES.findIndex(item => item.id === filters.industry) : -1
  if (filters.country && countryIndex === -1) return [0, 0]
  if (filters.industry && industryIndex === -1) return [0, 0]

  const start = countryIndex >= 0
    ? countryIndex * AGENT_INDUSTRIES.length * AGENTS_PER_COMBO
    : 0
  const end = countryIndex >= 0
    ? start + AGENT_INDUSTRIES.length * AGENTS_PER_COMBO
    : AGENT_TOTAL

  if (industryIndex < 0) return [start, end]
  const industryStart = start + industryIndex * AGENTS_PER_COMBO
  return [industryStart, industryStart + AGENTS_PER_COMBO]
}

export function getAgentAtIndex(globalIdx) {
  if (!Number.isInteger(globalIdx) || globalIdx < 0 || globalIdx >= AGENT_TOTAL) return null
  const countryIdx = Math.floor(globalIdx / (AGENT_INDUSTRIES.length * AGENTS_PER_COMBO))
  const industryIdx = Math.floor(globalIdx / AGENTS_PER_COMBO) % AGENT_INDUSTRIES.length
  const variant = globalIdx % AGENTS_PER_COMBO
  return generateAgent(countryIdx, industryIdx, variant)
}

export function getFilteredAgentCount(filters = {}) {
  if (filters.type === 'platform') return 0
  const [start, end] = getAgentIndexRange(filters)
  let count = 0
  for (let globalIdx = start; globalIdx < end; globalIdx++) {
    const agent = getAgentAtIndex(globalIdx)
    if (agentMatchesFilters(agent, filters)) count += 1
  }
  return count
}

export function generateAgentPage(page = 1, pageSize = 24, filters = {}) {
  const safePage = Math.max(1, Number(page) || 1)
  const safePageSize = Math.min(100, Math.max(1, Number(pageSize) || 24))
  const [start, end] = getAgentIndexRange(filters)
  const offset = (safePage - 1) * safePageSize
  const agents = []
  let matched = 0

  for (let globalIdx = start; globalIdx < end; globalIdx++) {
    const agent = getAgentAtIndex(globalIdx)
    if (!agentMatchesFilters(agent, filters)) continue
    if (matched >= offset && agents.length < safePageSize) agents.push(agent)
    matched += 1
    if (agents.length === safePageSize && !filters.search) break
  }

  const total = filters.search || filters.type === 'platform'
    ? (filters.type === 'platform' ? 0 : getFilteredAgentCount(filters))
    : (filters.country || filters.industry || filters.type ? getFilteredAgentCount(filters) : AGENT_TOTAL)
  return { agents, total }
}

export function getAgentById(id) {
  if (id && CURATED_AGENT_DEFINITIONS[id]) return CURATED_AGENT_DEFINITIONS[id]
  if (!id || !id.startsWith('agent-blueprint-')) return null
  const globalIdx = parseInt(id.replace('agent-blueprint-', ''), 10) - 1
  if (isNaN(globalIdx) || globalIdx < 0 || globalIdx >= AGENT_TOTAL) return null
  const countryIdx = Math.floor(globalIdx / (AGENT_INDUSTRIES.length * AGENTS_PER_COMBO))
  const industryIdx = Math.floor(globalIdx / AGENTS_PER_COMBO) % AGENT_INDUSTRIES.length
  const variant = globalIdx % AGENTS_PER_COMBO
  return generateAgent(countryIdx, industryIdx, variant)
}

export function getAdjacentAgent(id, direction) {
  if (!id || !id.startsWith('agent-blueprint-')) return null
  const globalIdx = parseInt(id.replace('agent-blueprint-', ''), 10) - 1
  const nextIdx = globalIdx + direction
  if (nextIdx < 0 || nextIdx >= AGENT_TOTAL) return null
  return getAgentById(`agent-blueprint-${nextIdx + 1}`)
}

export const AGENTIC_PLATFORMS = [
  { id: 'langgraph', name: 'LangGraph', category: 'Orchestration', focus: 'Stateful graphs, checkpoints, human-in-the-loop workflows', color: '#f9e2af' },
  { id: 'crewai', name: 'CrewAI', category: 'Multi-Agent', focus: 'Role-based agents, tasks, crews, and delegation', color: '#cba6f7' },
  { id: 'autogen', name: 'AutoGen', category: 'Multi-Agent', focus: 'Conversational agent collaboration and tool use', color: '#89b4fa' },
  { id: 'llamaindex', name: 'LlamaIndex', category: 'Knowledge', focus: 'Data connectors, retrieval, agents, and document workflows', color: '#94e2d5' },
  { id: 'mcp', name: 'MCP Ecosystem', category: 'Interoperability', focus: 'Standardized tool and context connections', color: '#f38ba8' },
  { id: 'semantic-kernel', name: 'Semantic Kernel', category: 'Enterprise', focus: 'Plugins, planners, memory, and enterprise integrations', color: '#74c7ec' },
]

export function getAgentIndustry(id) { return AGENT_INDUSTRIES.find(item => item.id === id) }
export function getAgentCountry(id) { return AGENT_COUNTRIES.find(item => item.id === id) }
