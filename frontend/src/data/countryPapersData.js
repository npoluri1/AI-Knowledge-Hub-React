// Country-wise AI papers, regulations & strategy documents.
// Each entry: id, country (key), title, publisher, date (ISO), type, tags, url

export const PAPER_COUNTRIES = [
  { key: 'global', label: 'Global', flag: '🌍', color: '#89b4fa' },
  { key: 'us', label: 'United States', flag: '🇺🇸', color: '#667eea' },
  { key: 'eu', label: 'European Union', flag: '🇪🇺', color: '#43e97b' },
  { key: 'uk', label: 'United Kingdom', flag: '🇬🇧', color: '#fa709a' },
  { key: 'singapore', label: 'Singapore', flag: '🇸🇬', color: '#f9e2af' },
  { key: 'india', label: 'India', flag: '🇮🇳', color: '#fb923c' },
  { key: 'china', label: 'China', flag: '🇨🇳', color: '#f38ba8' },
  { key: 'japan', label: 'Japan', flag: '🇯🇵', color: '#e0c3fc' },
  { key: 'korea', label: 'South Korea', flag: '🇰🇷', color: '#94e2d5' },
  { key: 'uae', label: 'UAE', flag: '🇦🇪', color: '#cba6f7' },
  { key: 'canada', label: 'Canada', flag: '🇨🇦', color: '#a6e3a1' },
  { key: 'australia', label: 'Australia', flag: '🇦🇺', color: '#89dceb' },
]

export const COUNTRY_PAPERS = [
  // ── Global ──────────────────────────────────────────────────────
  {
    id: 'g1', country: 'global', type: 'Report',
    title: 'AI Index Report 2026',
    publisher: 'Stanford HAI', date: '2026-04-15',
    tags: ['Benchmarking', 'Industry Trends', 'Research'],
    url: 'https://aiindex.stanford.edu/report/',
    summary: 'The definitive annual dataset on AI progress: model capability, funding, policy milestones and adoption across 60+ countries.',
  },
  {
    id: 'g2', country: 'global', type: 'Framework',
    title: 'Model AI Governance Framework for Generative AI',
    publisher: 'AI Verify Foundation ( Intl. scope)', date: '2025-11-02',
    tags: ['Governance', 'GenAI', 'Safety'],
    url: 'https://aiverifyfoundation.sg/what-we-do/international-tech-committee/',
    summary: 'Nine dimensions for trusted GenAI — accountability, data quality, incident management — adopted as a reference by multiple regulators.',
  },
  {
    id: 'g3', country: 'global', type: 'Paper',
    title: 'Halo Effect: The State of Frontier Model Evals',
    publisher: 'UK AISI × Intl. Network of AI Safety Institutes', date: '2026-01-20',
    tags: ['Evals', 'Frontier Models', 'Safety'],
    url: 'https://aisi.gov.uk/',
    summary: 'First cross-institute comparison of frontier-model evaluation practices, shared risk taxonomy and red-team baselines.',
  },

  // ── United States ───────────────────────────────────────────────
  {
    id: 'us1', country: 'us', type: 'Framework',
    title: 'AI Risk Management Framework (AI RMF 1.0) + GenAI Profile',
    publisher: 'NIST', date: '2025-07-26',
    tags: ['Risk', 'Governance', 'GenAI'],
    url: 'https://www.nist.gov/itl/ai-risk-management-framework',
    summary: 'Govern–Map–Measure–Manage functions plus the Generative AI Profile: 12 risks LLMs bring (hallucination, CBRN info, data leakage…).',
  },
  {
    id: 'us2', country: 'us', type: 'Executive Order',
    title: 'Executive Order 14179: Removing Barriers to American Leadership in AI',
    publisher: 'The White House', date: '2025-01-23',
    tags: ['Policy', 'Innovation', 'AI Action Plan'],
    url: 'https://www.federalregister.gov/documents/2025/01/31/2025-02172/removing-barriers-to-american-leadership-in-artificial-intelligence',
    summary: 'Directs a US AI Action Plan, revokes prior EO 14110, and orders open-model policy review across federal agencies.',
  },
  {
    id: 'us3', country: 'us', type: 'Paper',
    title: 'The Economic Potential of Generative AI in the US Workforce',
    publisher: 'NBER Working Papers', date: '2025-12-10',
    tags: ['Economics', 'Labor', 'Productivity'],
    url: 'https://www.nber.org/papers',
    summary: 'Empirical study of GenAI exposure by occupation: 30% of US work-hours face task transformation, with wage-vs-productivity divergence.',
  },
  {
    id: 'us4', country: 'us', type: 'Policy',
    title: 'Colorado AI Act — First Comprehensive US State AI Law',
    publisher: 'Colorado General Assembly', date: '2026-02-01',
    tags: ['High-Risk AI', 'State Law', 'Compliance'],
    url: 'https://leg.colorado.gov/bills/sb24-205',
    summary: 'Duty-of-care regime for developers and deployers of high-risk AI in consequential decisions (housing, hiring, lending, healthcare).',
  },

  // ── European Union ──────────────────────────────────────────────
  {
    id: 'eu1', country: 'eu', type: 'Regulation',
    title: 'EU AI Act — Consolidated Text & Implementation Timeline',
    publisher: 'European Commission', date: '2026-08-02',
    tags: ['AI Act', 'Risk Tiers', 'Compliance'],
    url: 'https://artificialintelligenceact.eu/the-act/',
    summary: 'Risk-based obligations: prohibited practices, high-risk conformity assessments, GPAI transparency. Enforcement phases roll through 2026–2027.',
  },
  {
    id: 'eu2', country: 'eu', type: 'Guidelines',
    title: 'Code of Practice for General-Purpose AI Models',
    publisher: 'EU AI Office', date: '2025-09-08',
    tags: ['GPAI', 'Transparency', 'Copyright'],
    url: 'https://digital-strategy.ec.europa.eu/en/policies/contents-code-gpai-models',
    summary: 'Voluntary-but-decisive code covering transparency reports, copyright policy and systemic-risk mitigation for GPAI providers.',
  },
  {
    id: 'eu3', country: 'eu', type: 'Paper',
    title: 'GDPR × AI: EDPB Opinion 28/2024 on Personal Data Processing',
    publisher: 'EDPB', date: '2025-06-11',
    tags: ['GDPR', 'Data Governance', 'Training Data'],
    url: 'https://www.edpb.europa.eu/our-work-tools/our-documents/opinion-board-art-64/opinion-282024-certain-data-protection-aspects_en',
    summary: 'How GDPR legality, purpose-limitation and legitimate-interest tests apply to LLM training and deployment — the reference for EU data teams.',
  },

  // ── United Kingdom ──────────────────────────────────────────────
  {
    id: 'uk1', country: 'uk', type: 'White Paper',
    title: 'A Pro-innovation Approach to AI Regulation — Implementation Update',
    publisher: 'DSIT', date: '2025-11-18',
    tags: ['Regulation', 'Principles', 'Sectoral'],
    url: 'https://www.gov.uk/government/publications/ai-regulation-a-pro-innovation-approach-white-paper',
    summary: 'Five cross-sector principles (safety, transparency, fairness, accountability, contestability) implemented by existing regulators, not a new law.',
  },
  {
    id: 'uk2', country: 'uk', type: 'Paper',
    title: 'Frontier AI Taskforce / AI Safety Institute Annual Report',
    publisher: 'UK AISI', date: '2026-02-05',
    tags: ['Frontier Safety', 'Red Teaming', 'Research'],
    url: 'https://aisi.gov.uk/',
    summary: 'Pre-deployment testing results for major frontier models, agentic-system risk methodology and incident reporting recommendations.',
  },

  // ── Singapore ───────────────────────────────────────────────────
  {
    id: 'sg1', country: 'singapore', type: 'Framework',
    title: 'Model AI Governance Framework for GenAI (2024 Edition)',
    publisher: 'IMDA × AI Verify', date: '2025-05-30',
    tags: ['GenAI', 'Governance', 'PDPA'],
    url: 'https://aiverifyfoundation.sg/what-we-do/model-ai-governance-framework-for-generative-ai/',
    summary: 'Nine dimensions from accountability to incident management, with practical implementation guidance for Singapore-deployed GenAI.',
  },
  {
    id: 'sg2', country: 'singapore', type: 'Advisory Guidelines',
    title: 'PDPC Advisory Guidelines on Use of Personal Data in AI Systems',
    publisher: 'PDPC', date: '2025-03-01',
    tags: ['PDPA', 'Personal Data', 'Training'],
    url: 'https://www.pdpc.gov.sg/help-and-resources/2024/07/advisory-guidelines-on-the-use-of-personal-data-in-ai-recommendation-and-decision-making-systems',
    summary: 'How PDPA applies when personal data trains or powers AI recommendation/decision systems — including deemed-consent and business-improvement paths.',
  },
  {
    id: 'sg3', country: 'singapore', type: 'Strategy',
    title: 'National AI Strategy 2.0 (NAIS 2.0)',
    publisher: 'Smart Nation Singapore', date: '2025-12-03',
    tags: ['Strategy', 'Talent', 'Compute'],
    url: 'https://www.smartnation.gov.sg/nais/',
    summary: 'Sovereign compute, AI centres of excellence, and the goal to triple the local AI practitioner pool — with sector playbooks attached.',
  },

  // ── India ───────────────────────────────────────────────────────
  {
    id: 'in1', country: 'india', type: 'Advisory',
    title: 'MeitY Advisories on AI Labelling & Deepfake Governance',
    publisher: 'MeitY', date: '2026-03-15',
    tags: ['Deepfakes', 'IT Rules', 'Labelling'],
    url: 'https://www.meity.gov.in/',
    summary: 'Requirement to label synthetic media and undersea-cable-grade accountability for platforms hosting AI-generated content in India.',
  },
  {
    id: 'in2', country: 'india', type: 'Strategy',
    title: 'IndiaAI Mission — Pillars & Compute Strategy',
    publisher: 'IndiaAI (MeitY)', date: '2025-10-09',
    tags: ['Sovereign Compute', 'GPU Grid', 'Skills'],
    url: 'https://indiaai.gov.in/',
    summary: '38,000+ GPU national grid, datasets platform, application funds and skilling — India\'s full-stack sovereign AI buildout.',
  },
  {
    id: 'in3', country: 'india', type: 'Paper',
    title: 'DPDP Act 2023 — Rules Draft for AI Data Processing',
    publisher: 'MeitY Data Protection', date: '2026-01-14',
    tags: ['Privacy', 'DPDP', 'Consent'],
    url: 'https://www.meity.gov.in/data-protection-framework',
    summary: 'Operational rules under the Digital Personal Data Protection Act: consent managers, breach timelines and cross-border transfer windows.',
  },

  // ── China ───────────────────────────────────────────────────────
  {
    id: 'cn1', country: 'china', type: 'Regulation',
    title: 'Interim Measures for the Management of Generative AI Services',
    publisher: 'CAC', date: '2025-08-15',
    tags: ['GenAI', 'Content Control', 'Filing'],
    url: 'https://www.cac.gov.cn/',
    summary: 'Algorithm filing, content moderation and data-source legitimacy duties for public-facing GenAI services operating in China.',
  },
  {
    id: 'cn2', country: 'china', type: 'Standard',
    title: 'AI Safety Governance Framework (National Standard)',
    publisher: 'TC260 / SAC', date: '2025-09-24',
    tags: ['Standards', 'Risk Classification', 'Safety'],
    url: 'https://www.tc260.org.cn/',
    summary: 'National risk catalogue for AI systems with graded controls — the backbone standard aligned with the Global AI Governance Initiative.',
  },

  // ── Japan ───────────────────────────────────────────────────────
  {
    id: 'jp1', country: 'japan', type: 'Guidelines',
    title: 'AI Guidelines for Business v1.1',
    publisher: 'METI / Ministry of Internal Affairs', date: '2025-11-29',
    tags: ['Business', 'Governance', 'Soft Law'],
    url: 'https://www.meti.go.jp/english/press/2024/ai_guidelines_business.html',
    summary: 'Unified practical guidance consolidating Japan\'s social-principles-based approach into action checklists for AI business operators.',
  },
  {
    id: 'jp2', country: 'japan', type: 'Law',
    title: 'Promotion of R&D and Utilization of AI-Related Technologies Act',
    publisher: 'Cabinet Office Japan', date: '2026-05-06',
    tags: ['Innovation', 'Basic Law', 'Strategy'],
    url: 'https://www8.cao.go.jp/cstp/ai/',
    summary: 'Japan\'s umbrella AI promotion act: innovation-first posture with a national strategy headquarters and research-acceleration duties.',
  },

  // ── South Korea ─────────────────────────────────────────────────
  {
    id: 'kr1', country: 'korea', type: 'Law',
    title: 'Framework Act on Artificial Intelligence Development (AI Basic Act)',
    publisher: 'MSIT', date: '2026-01-22',
    tags: ['High-Impact AI', 'Compliance', 'First in Asia'],
    url: 'https://www.msit.go.kr/',
    summary: 'World\'s second comprehensive AI law: duties for high-impact AI operators, generative-AI labelling and safety-programme requirements.',
  },

  // ── UAE ─────────────────────────────────────────────────────────
  {
    id: 'ae1', country: 'uae', type: 'Strategy',
    title: 'UAE National Strategy for Artificial Intelligence 2031 — Progress Update',
    publisher: 'UAE Government', date: '2025-12-19',
    tags: ['Sovereign AI', 'Stargate UAE', 'Talent'],
    url: 'https://ai.gov.ae/',
    summary: 'Minister of State for AI, G42-backed sovereign models, and 5GW datacentre ambitions — the Gulf\'s most aggressive AI buildout.',
  },

  // ── Canada ──────────────────────────────────────────────────────
  {
    id: 'ca1', country: 'canada', type: 'Bill',
    title: 'Artificial Intelligence and Data Act (AIDA) — Status & Guidance',
    publisher: 'Innovation, Science and Economic Development Canada', date: '2026-02-27',
    tags: ['AIDA', 'High-Impact', 'Data'],
    url: 'https://ised-isde.canada.ca/site/innovation-better-canada/en/artificial-intelligence-and-data-act',
    summary: 'Canada\'s proposed high-impact AI regime: adaptive requirements, serious-harm definition and a new AI Commissioner role.',
  },

  // ── Australia ───────────────────────────────────────────────────
  {
    id: 'au1', country: 'australia', type: 'Discussion Paper',
    title: 'Safe and Responsible AI in Australia — Mandatory Guardrails Proposal',
    publisher: 'Department of Industry, Science and Resources', date: '2025-09-01',
    tags: ['Guardrails', 'High-Risk', 'Consultation'],
    url: 'https://www.industry.gov.au/publications/safe-and-responsible-ai-in-australia',
    summary: 'Proposes mandatory guardrails for high-risk settings with voluntary AI Safety Standard in the interim — responses shaped the 2026 bill draft.',
  },
]

export const COUNTRY_PAPERS_STATS = {
  total: COUNTRY_PAPERS.length,
  countries: [...new Set(COUNTRY_PAPERS.map(p => p.country))].length,
}

export function papersByCountry() {
  const map = {}
  for (const p of COUNTRY_PAPERS) {
    if (!map[p.country]) map[p.country] = []
    map[p.country].push(p)
  }
  for (const list of Object.values(map)) list.sort((a, b) => (b.date || '').localeCompare(a.date || ''))
  return map
}
