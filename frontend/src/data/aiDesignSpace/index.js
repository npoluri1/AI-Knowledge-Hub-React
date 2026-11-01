// ============================================================
// AI DESIGN SPACE — AGGREGATOR & HELPERS
// ============================================================

import { TECH_STACK, DESIGN_PATTERNS, getPattern } from './blueprints'
import { SECTORS, getSector } from './sectors'
import { FLAGSHIP_INDUSTRIES_A } from './industriesA'
import { FLAGSHIP_INDUSTRIES_B } from './industriesB'
import { ALL_INDUSTRIES, ALL_INDUSTRIES_BY_SECTOR, ALL_INDUSTRIES_COUNT } from './allIndustries'
import { PATTERN_THEORY } from './theory'
import { featureCodeFor, featureNoteFor, featureCodeCoverage } from './featureCode'
import { COUNTRIES, COUNTRIES_COUNT, REGIONS } from './countries'

export { TECH_STACK, DESIGN_PATTERNS, getPattern, SECTORS, getSector, ALL_INDUSTRIES, ALL_INDUSTRIES_BY_SECTOR, ALL_INDUSTRIES_COUNT, PATTERN_THEORY, COUNTRIES, COUNTRIES_COUNT, REGIONS }

export const FLAGSHIP_INDUSTRIES = [...FLAGSHIP_INDUSTRIES_A, ...FLAGSHIP_INDUSTRIES_B]

export const TOTAL_DESIGNS = ALL_INDUSTRIES_COUNT + FLAGSHIP_INDUSTRIES.length

export const slugify = str =>
  String(str)
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

// slug → canonical name for every known industry name (industry index,
// country listings, flagship names) so slug URLs recover display names.
const KNOWN_NAMES = new Map()
ALL_INDUSTRIES.forEach(i => { if (!KNOWN_NAMES.has(slugify(i.name))) KNOWN_NAMES.set(slugify(i.name), i.name) })
COUNTRIES.forEach(c => c.industries.split(',').forEach(raw => {
  const name = raw.trim()
  if (name && !KNOWN_NAMES.has(slugify(name))) KNOWN_NAMES.set(slugify(name), name)
}))
FLAGSHIP_INDUSTRIES_A.concat(FLAGSHIP_INDUSTRIES_B).forEach(f => {
  if (!KNOWN_NAMES.has(f.slug)) KNOWN_NAMES.set(f.slug, f.name)
})

// Sector auto-detection from an industry name (used for country pages
// and as a final fallback so every named industry resolves).
const SECTOR_KEYWORDS = {
  banking: ['bank', 'financ', 'fintech', 'payment', 'insurance', 'wealth', 'trad', 'fund', 'remittance', 'lend', 'credit', 'fx', 'custod', 'treasury', 'broker', 'stock', 'market', 'currency', 'money', 'wallet'],
  insurance: ['insurance', 'underwrit', 'claim', 'actuar', 'reinsur', 'policy', 'broker', 'risk model'],
  healthcare: ['health', 'hospital', 'pharma', 'biotech', 'biomed', 'medical', 'clinic', 'lab', 'drug', 'vaccine', 'genomic', 'therap', 'care', 'dental', 'vision', 'pharmac'],
  retail: ['retail', 'e-commerce', 'ecommerce', 'commerce', 'fashion', 'apparel', 'consumer', 'food', 'restaurant', 'cafe', 'marketplace', 'store', 'shop', 'grocery', 'supermarket', 'boutique', 'luxury', 'beauty', 'cosmetic', 'toy', 'jewelry', 'book'],
  manufacturing: ['manufactur', 'factory', 'industrial', 'textile', 'electronics', 'steel', 'metal', 'machinery', 'equipment', 'automotive', 'semiconductor', 'pcb', 'chemical', 'plastic', 'rubber', 'cement', 'glass', 'packaging', 'tool', 'parts', 'pharma manufacturing', 'beverage', 'dairy', 'food processing'],
  telecom: ['telecom', 'network', 'broadband', 'isp', 'mobile', 'satellite', 'communication', 'broadcast', 'streaming', 'media', 'voip', 'cloud', 'data center', 'cdn', 'technolog', 'it services', 'software', 'data platform', 'digital'],
  energy: ['energy', 'oil', 'gas', 'mining', 'electric', 'grid', 'utility', 'power', 'renewable', 'solar', 'wind', 'hydro', 'nuclear', 'coal', 'lng', 'petro', 'fuel', 'battery', 'storage', 'water'],
  logistics: ['logistics', 'shipping', 'port', 'freight', 'transport', 'warehouse', 'fulfill', 'courier', 'delivery', 'postal', 'rail', 'truck', 'aviation', 'airline', 'airport', 'cargo', 'supply chain', 'terminal'],
  education: ['education', 'school', 'university', 'college', 'training', 'learn', 'edtech', 'academ', 'bootcamp', 'tutor', 'certific'],
  government: ['government', 'defense', 'military', 'public', 'agency', 'tax', 'customs', 'postal', 'judici', 'court', 'police', 'regulator', 'intelligence', 'election', 'municipal', 'federal', 'state'],
  travel: ['tourism', 'travel', 'hotel', 'hospitality', 'cruise', 'resort', 'tour', 'ferry', 'car rental', 'lodging'],
  realestate: ['real estate', 'construction', 'property', 'building', 'infrastructure', 'housing', 'facility', 'architecture', 'contractor'],
  agriculture: ['agricultur', 'agri', 'farm', 'crop', 'livestock', 'forest', 'fisher', 'aquacultur', 'horticultur', 'dairy farm', 'poultry', 'plantation', 'soil', 'grain'],
  automotive: ['automotive', 'vehicle', 'car', 'ev', 'mobility', 'auto', 'tire', 'dealership'],
  legal: ['legal', 'law', 'compliance', 'attorney', 'patent', 'trademark', 'litigation', 'contract', 'audit', 'regulatory'],
  entertainment: ['entertainment', 'gaming', 'game', 'film', 'movie', 'music', 'sports', 'casino', 'gambl', 'lottery', 'theater', 'media', 'art', 'museum', 'podcast', 'esport'],
  aerospace: ['aerospace', 'space', 'satellite', 'drone', 'aircraft', 'aviation', 'avionics', 'rocket', 'defense', 'flight', 'mission'],
  cybersecurity: ['cyber', 'security', 'threat', 'identity', 'encryption', 'soc', 'firewall', 'phish'],
  crypto: ['crypto', 'blockchain', 'web3', 'token', 'defi', 'nft', 'wallet', 'stablecoin', 'bitcoin', 'ethereum', 'exchange', 'dao'],
}

export const sectorForName = name => {
  const lower = name.toLowerCase()
  for (const [sectorId, keywords] of Object.entries(SECTOR_KEYWORDS)) {
    if (keywords.some(k => lower.includes(k))) return getSector(sectorId)
  }
  return null
}

function buildGenerated(name, sector, reason = 'industry index') {
  return {
    slug: slugify(name),
    name,
    icon: sector.icon,
    sector: sector.id,
    sectorName: sector.name,
    tagline: `${sector.name} design applied to ${name}`,
    gradient: sector.gradient,
    summary: `${name} — an AI architecture blueprint adapted from the ${sector.name} sector playbook, covering every functional domain with high-level and low-level designs (mapped from ${reason}).`,
    generated: true,
    domains: sector.patterns.slice(0, 4).map(patternId => {
      const pattern = getPattern(patternId)
      return {
        name: pattern.name,
        icon: pattern.icon,
        blueprint: patternId,
        ctx: name,
        desc: `Core functional domain for ${name}, implemented with the ${pattern.name.replace(' Architecture', '')} pattern.`,
        tech: techForPattern(patternId),
        notes: [`Sector-standard design for ${sector.name}`, 'Configurable for organisation-specific constraints'],
      }
    }),
  }
}

// Resolve any industry id (slug) to a full design record.
// Flagship industries return their custom design; every other name
// in the 1000+ index renders the sector-template design; anything
// else is auto-mapped to the closest sector by name.
export function resolveIndustry(id) {
  const slug = slugify(decodeURIComponent(id || ''))
  const flagship = FLAGSHIP_INDUSTRIES.find(f => f.slug === slug)
  if (flagship) return buildFlagship(flagship)

  const match = ALL_INDUSTRIES.find(i => slugify(i.name) === slug)
  if (match) {
    const sector = getSector(match.sector)
    if (sector) return buildGenerated(match.name, sector)
  }

  const raw = decodeURIComponent(id || '').trim()
  const knownName = KNOWN_NAMES.get(slug) || (raw && KNOWN_NAMES.get(slugify(raw)))
  if (knownName || raw) {
    const sector = sectorForName(knownName || raw)
    if (sector) return buildGenerated(knownName || raw, sector, 'sector auto-match')
  }

  return null
}

const PATTERN_TECH = {
  agenticRag: ['RAG', 'VectorDB', 'LangGraph', 'Embeddings', 'LLMs'],
  multiAgentCrew: ['CrewAI', 'Multi-Agents', 'LangGraph', 'AI Graphs', 'Evaluations'],
  eventStreamAI: ['FastAPI', 'Kafka', 'Event Streaming', 'MLOps', 'Observability'],
  mcpToolGateway: ['MCP', 'Tool Calling', 'FastAPI', 'Spring AI', 'Governance'],
  predictiveMLOps: ['ML', 'MLOps', 'LoRA/QLoRA', 'Feature Store', 'Python'],
  fraudRiskReAct: ['ReAct Patterns', 'ML', 'AI Graphs', 'GuardRails', 'MLOps'],
  customerAssistant: ['ReAct Patterns', 'RAG', 'MCP', 'Memory Management', 'Evaluations'],
  edgeIotAI: ['IoT', 'TinyML', 'Semiconductor', 'Edge Gateway', 'MLOps'],
  genContentStudio: ['LLMs', 'Graphics Engineering', 'Multi-Agents', 'Prompting', 'GuardRails'],
  autonomousOps: ['AI Workflows', 'ReAct Patterns', 'Agent Loops', 'MCP', 'Observability'],
  graphKnowledge: ['Graph RAG', 'AI Graphs', 'VectorDB', 'LlamaIndex', 'Embeddings'],
  governedPlatform: ['Governance', 'GuardRails', 'Evaluations', 'Observability', 'MLOps'],
}
const techForPattern = id => PATTERN_TECH[id] || ['AI', 'ML', 'Python']

// Apply {ctx} placeholders inside a blueprint for a specific domain.
export function applyCtx(text, ctx) {
  return String(text).replace(/\{ctx\}/g, ctx)
}

function buildFlagship(f) {
  const sector = getSector(f.sector)
  const domains = f.domains.map(d => {
    const pattern = getPattern(d.blueprint)
    return {
      ...d,
      patternName: pattern ? pattern.name : 'Custom Architecture',
      patternTag: pattern ? pattern.tag : 'Custom',
      patternIcon: pattern ? pattern.icon : '🏗️',
      patternColor: pattern ? pattern.color : '#89b4fa',
      patternId: d.blueprint,
    }
  })
  return {
    ...f,
    sectorName: sector ? sector.name : f.sector,
    domains,
    flagship: true,
  }
}

export const sectorDesignCount = sectorId =>
  ALL_INDUSTRIES_BY_SECTOR[sectorId]?.length + FLAGSHIP_INDUSTRIES.filter(f => f.sector === sectorId).length || 0

// Industries that are typically public-sector heavy (used by country pages).
export const PUBLIC_INDUSTRY_KEYWORDS = [
  'government', 'public', 'defense', 'military', 'intelligence', 'tax', 'customs', 'border',
  'immigration', 'social security', 'pension', 'health', 'hospital', 'education', 'school', 'university',
  'transport', 'transit', 'traffic', 'infrastructure', 'water', 'sanitation', 'energy', 'electric',
  'utility', 'grid', 'nuclear', 'postal', 'registry', 'regulatory', 'compliance', 'justice', 'court',
  'police', 'emergency', 'disaster', 'aviation', 'port', 'airport', 'rail', 'space', 'meteorolog',
  'environment', 'agriculture', 'irrigation', 'forest', 'mining', 'oil', 'gas', 'electricity', 'hydro',
]

export const isPublicIndustry = name => PUBLIC_INDUSTRY_KEYWORDS.some(k => name.toLowerCase().includes(k))

export const REGION_GRADIENTS = {
  'North America': 'linear-gradient(135deg,#1e40af 0%,#3b82f6 55%,#93c5fd 100%)',
  'Central America & Caribbean': 'linear-gradient(135deg,#0e7490 0%,#06b6d4 55%,#67e8f9 100%)',
  'South America': 'linear-gradient(135deg,#15803d 0%,#22c55e 55%,#bef264 100%)',
  'Europe': 'linear-gradient(135deg,#7e22ce 0%,#a855f7 55%,#d8b4fe 100%)',
  'Middle East & North Africa': 'linear-gradient(135deg,#b45309 0%,#f59e0b 55%,#fde68a 100%)',
  'Sub-Saharan Africa': 'linear-gradient(135deg,#be123c 0%,#f43f5e 55%,#fda4af 100%)',
  'Central Asia': 'linear-gradient(135deg,#a16207 0%,#eab308 55%,#fef08a 100%)',
  'South Asia': 'linear-gradient(135deg,#0f766e 0%,#14b8a6 55%,#99f6e4 100%)',
  'East Asia': 'linear-gradient(135deg,#be185d 0%,#ec4899 55%,#f9a8d4 100%)',
  'Southeast Asia': 'linear-gradient(135deg,#0369a1 0%,#0ea5e9 55%,#7dd3fc 100%)',
  'Oceania': 'linear-gradient(135deg,#166534 0%,#16a34a 55%,#86efac 100%)',
}

export const getRegionGradient = region => REGION_GRADIENTS[region] || 'linear-gradient(135deg,#44403c 0%,#78716c 100%)'

export const getCountry = slug => COUNTRIES.find(c => slugify(c.name) === slug) || null

export { getProjectIdeas, countProjectIdeas, generateProjectIdeas, projectIdeaCode, sampleIdeas } from './projectIdeas'

export { TECH_FLOWS, getTech, techForLabel } from './techFlows'
export { countFunctionalDomains, generateFunctionalDomains, getFunctionalDomains, DOMAIN_VARIANTS, DOMAIN_AREAS } from './functionalDomains'
export { generateFSD, fsdToMarkdown, buildRunDeploy } from './fsd'
export { buildFunctionalFlow, buildDomainFeatures, flowSteps } from './functionalFlows'
export { blockCodeFor, blockImplNote } from './blockCode'
export { featureCodeFor, featureNoteFor, featureCodeCoverage } from './featureCode'
