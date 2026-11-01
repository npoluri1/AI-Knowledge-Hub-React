// ============================================================
// AI DESIGN SPACE — FUNCTIONAL DOMAINS GENERATOR
// Every industry expands its core domains × 12 operational
// variants × 30 functional areas → 1000+ functional domains,
// each mapped to a design pattern (HLD + LDD) to implement.
// ============================================================

import { DESIGN_PATTERNS, getPattern } from './blueprints'

export const DOMAIN_VARIANTS = [
  'Real-Time', 'Predictive', 'Self-Service', 'Automated', 'Omnichannel',
  'Intelligent', 'Conversational', 'Proactive', 'Embedded', 'Analytical',
  'Agentic', 'Governed',
]

export const DOMAIN_AREAS = [
  { name: 'Onboarding & Intake', icon: '🚪', detail: 'capturing and validating new entries from request to acceptance' },
  { name: 'Customer Experience', icon: '😊', detail: 'delivering a smooth, personalised experience across every touchpoint' },
  { name: 'Monitoring & Alerting', icon: '📊', detail: 'watching live signals and alerting the right people at the right time' },
  { name: 'Reporting & Dashboards', icon: '📈', detail: 'turning raw activity into decision-ready reports and dashboards' },
  { name: 'Compliance & Audit', icon: '🏛️', detail: 'keeping every action traceable and regulator-ready' },
  { name: 'Analytics & Insights', icon: '🔎', detail: 'discovering patterns and root causes inside the data' },
  { name: 'Automation & Orchestration', icon: '⚙️', detail: 'executing multi-step work automatically with approvals where needed' },
  { name: 'Integration & Connectivity', icon: '🔌', detail: 'connecting this capability to the surrounding enterprise systems' },
  { name: 'Personalization', icon: '🎯', detail: 'adapting behaviour to each user, segment or context' },
  { name: 'Optimization', icon: '📐', detail: 'finding the best choice under real-world constraints' },
  { name: 'Security & Protection', icon: '🔐', detail: 'defending the capability against abuse, leakage and attack' },
  { name: 'Quality Assurance', icon: '✅', detail: 'verifying correctness before anything is released or delivered' },
  { name: 'Risk Management', icon: '🛡️', detail: 'identifying, scoring and mitigating risk in every decision' },
  { name: 'Forecasting & Planning', icon: '🔮', detail: 'projecting future demand, volume and failure before it happens' },
  { name: 'Decision Support', icon: '🧠', detail: 'giving operators grounded recommendations with evidence' },
  { name: 'Collaboration & Teamwork', icon: '🤝', detail: 'coordinating people and systems around a shared outcome' },
  { name: 'Document Processing', icon: '📄', detail: 'extracting, classifying and summarising documents at scale' },
  { name: 'Notifications & Outreach', icon: '📣', detail: 'reaching the right audience with the right message on time' },
  { name: 'Workflow & Approvals', icon: '📋', detail: 'routing work through steps and human approval gates' },
  { name: 'Governance & Policy', icon: '🏛️', detail: 'enforcing organisation rules and entitlements consistently' },
  { name: 'Data Management', icon: '🗃️', detail: 'keeping source data clean, fresh, lineage-tracked and accessible' },
  { name: 'Communication & Messaging', icon: '💬', detail: 'exchanging information with users and systems in both directions' },
  { name: 'Billing & Payments', icon: '💳', detail: 'handling charges, reconciliation and financial records correctly' },
  { name: 'Inventory & Assets', icon: '📦', detail: 'tracking availability, utilisation and lifecycle of assets' },
  { name: 'Scheduling & Booking', icon: '📅', detail: 'matching demand to capacity and managing time commitments' },
  { name: 'Tracking & Traceability', icon: '🔍', detail: 'following every item or case from origin to outcome' },
  { name: 'Incident Response', icon: '🚨', detail: 'detecting, containing and recovering from incidents fast' },
  { name: 'Self-Service & Portal', icon: '🖥️', detail: 'letting users help themselves without human intervention' },
  { name: 'Insights & Recommendations', icon: '✨', detail: 'suggesting the next best action to users and operators' },
  { name: 'Growth & Acquisition', icon: '📈', detail: 'finding and converting opportunities while managing cost' },
]

const patternTech = id => {
  const p = getPattern(id)
  if (!p) return ['AI', 'Python']
  const seen = []
  p.ldd.forEach(n => {
    if (n.tech) n.tech.split('·').map(t => t.trim()).forEach(t => { if (t && !seen.includes(t)) seen.push(t) })
  })
  return seen.slice(0, 5)
}

const lc = s => s.charAt(0).toLowerCase() + s.slice(1)

export function countFunctionalDomains(industry) {
  if (!industry) return 0
  return industry.domains.length * DOMAIN_VARIANTS.length * DOMAIN_AREAS.length
}

// Deterministic generation of ALL functional domains for an industry (lightweight).
export function generateFunctionalDomains(industry) {
  if (!industry) return []
  const out = []
  industry.domains.forEach((domain, di) => {
    DOMAIN_VARIANTS.forEach((variant, vi) => {
      DOMAIN_AREAS.forEach((area, ai) => {
        const pattern = DESIGN_PATTERNS[(di * 7 + vi * 5 + ai) % DESIGN_PATTERNS.length]
        out.push({
          id: `${domain.name.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}-${vi}-${ai}`,
          name: `${variant} ${area.name}`,
          icon: area.icon,
          domain: domain.name,
          domainIcon: domain.icon,
          variant,
          area: area.name,
          patternId: pattern.id,
          patternName: pattern.name,
          patternTag: pattern.tag,
          patternIcon: pattern.icon,
          patternColor: pattern.color,
          desc: `The ${lc(variant)} ${lc(area.name)} capability for ${lc(domain.name)} in ${industry.name} — ${area.detail}. Designed with the ${pattern.name.replace(' Architecture', '')} pattern and implemented with the available tech stack.`,
          tech: patternTech(pattern.id),
          requirements: [
            `Accept ${lc(domain.name)} inputs with typed, validated payloads.`,
            `Apply the ${pattern.tag} pattern for ${lc(area.name)}.`,
            `Ground outputs in ${industry.name} knowledge and enterprise systems.`,
            `Emit traces and evals for every ${lc(area.name)} interaction.`,
          ],
        })
      })
    })
  })
  return out
}

// Search + pagination over an industry's functional domains.
export function getFunctionalDomains(industry, { q = '', page = 1, pageSize = 20 } = {}) {
  const all = generateFunctionalDomains(industry)
  const query = q.trim().toLowerCase()
  const filtered = query
    ? all.filter(d => `${d.name} ${d.desc} ${d.patternTag} ${d.domain} ${d.area}`.toLowerCase().includes(query))
    : all
  const total = filtered.length
  const pages = Math.max(1, Math.ceil(total / pageSize))
  const safePage = Math.min(Math.max(1, page), pages)
  return {
    domains: filtered.slice((safePage - 1) * pageSize, safePage * pageSize),
    total,
    pages,
    page: safePage,
  }
}
