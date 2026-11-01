// ============================================================
// AI DESIGN SPACE — FLAGSHIP INDUSTRY DESIGNS (A)
// Each industry = functional domains, each domain = a blueprint
// applied with an industry context + tech stack + notes.
// ============================================================

export const FLAGSHIP_INDUSTRIES_A = [
  // ------------------------------ BANKING ------------------------------
  {
    slug: 'core-banking-transformation',
    name: 'Core Banking Transformation',
    icon: '🏦',
    sector: 'banking',
    tagline: 'Agentic, event-driven modernisation of the banking core',
    gradient: 'linear-gradient(135deg,#1e3a8a 0%,#4f46e5 55%,#7c3aed 100%)',
    summary: 'A layered modernisation that keeps the legacy core stable while wrapping it in streaming payments, agentic lending and a governed AI platform for retail and corporate banking.',
    domains: [
      { name: 'Payments & Transactions', icon: '💳', blueprint: 'eventStreamAI', ctx: 'real-time payments, ISO 20022 messages and clearing across retail and corporate channels', desc: 'Sub-second payment routing with streaming fraud scoring and idempotent ledger writes.', tech: ['FastAPI', 'Kafka', 'Event Streaming', 'MLOps'], notes: ['Streaming anomaly scoring on every payment before settlement', 'Idempotent writes + replayable topics for audit'] },
      { name: 'Agentic Lending & Credit', icon: '📋', blueprint: 'agenticRag', ctx: 'loan applications, credit policy manuals and customer documents', desc: 'A lending copilot that gathers documents, verifies income data and drafts credit decisions against policy.', tech: ['RAG', 'VectorDB', 'LangGraph', 'GuardRails'], notes: ['Document extraction + verification agent', 'Explainable decisions logged for regulators'] },
      { name: 'Digital Banking Assistant', icon: '🤖', blueprint: 'customerAssistant', ctx: 'account queries, card management and product onboarding', desc: 'A 24/7 assistant that resolves balance, card and product questions and escalates to human bankers with full context.', tech: ['ReAct Patterns', 'MCP', 'Memory Management', 'Evaluations'], notes: ['Secure actions behind MCP permission scopes', 'Evals track deflection rate and CSAT'] },
    ],
  },
  {
    slug: 'wealth-management-advisor',
    name: 'Wealth & Advisory Platform',
    icon: '📈',
    sector: 'banking',
    tagline: 'Personalised portfolio intelligence for advisors and clients',
    gradient: 'linear-gradient(135deg,#312e81 0%,#6d28d9 55%,#a855f7 100%)',
    summary: 'A wealth platform that merges market data streaming, portfolio analytics and advisor copilots into one intelligence layer.',
    domains: [
      { name: 'Market & Portfolio Analytics', icon: '📊', blueprint: 'eventStreamAI', ctx: 'live market data, positions and portfolio risk', desc: 'Real-time market data pipelines power risk metrics, alerts and rebalancing signals.', tech: ['Event Streaming', 'Python', 'MLOps', 'VectorDB'], notes: ['Low-latency risk computation on streaming ticks', 'Scenario stress tests on demand'] },
      { name: 'Advisor Copilot', icon: '🧑‍💼', blueprint: 'agenticRag', ctx: 'client profiles, product shelf and regulatory suitability rules', desc: 'Advisors get grounded research, suitability checks and draft proposals generated from the product shelf.', tech: ['RAG', 'LlamaIndex', 'LangGraph', 'Governance'], notes: ['Suitability rules enforced at generation time', 'Full audit trail of every recommendation'] },
      { name: 'Client Reporting Agent', icon: '📄', blueprint: 'multiAgentCrew', ctx: 'quarterly performance reports and client communications', desc: 'A researcher–writer–reviewer crew assembles personalised statements that are human-approved before sending.', tech: ['CrewAI', 'Multi-Agents', 'Evaluations', 'Observability'], notes: ['Reviewer agent checks numbers against positions', 'Human approval gate before client delivery'] },
    ],
  },
  {
    slug: 'banking-fraud-prevention',
    name: 'Banking Fraud & AML Prevention',
    icon: '🕵️',
    sector: 'banking',
    tagline: 'Real-time fraud and money-laundering detection with investigation agents',
    gradient: 'linear-gradient(135deg,#7f1d1d 0%,#dc2626 55%,#f87171 100%)',
    summary: 'An integrated fraud and AML platform that scores every transaction, investigates alerts with agents and files compliant reports.',
    domains: [
      { name: 'Real-Time Transaction Scoring', icon: '⚡', blueprint: 'fraudRiskReAct', ctx: 'card and account transactions across all channels', desc: 'Rules fast-path + ensemble ML scoring every transaction in milliseconds with feature attribution.', tech: ['ML', 'MLOps', 'Event Streaming', 'FastAPI'], notes: ['Ensemble models with explainability output', 'Continuous retraining on labelled alerts'] },
      { name: 'AML Investigation Agent', icon: '🔎', blueprint: 'multiAgentCrew', ctx: 'suspicious activity, counterparty networks and sanction lists', desc: 'Agents gather transaction history, traverse the entity graph and draft SAR narratives for analysts.', tech: ['AI Graphs', 'RAG', 'Multi-Agents', 'Governance'], notes: ['Entity graph traversal finds hidden networks', 'Drafted SAR narratives cut analyst time'] },
      { name: 'Compliance & Audit Platform', icon: '🏛️', blueprint: 'governedPlatform', ctx: 'regulatory reporting, audit trails and model governance', desc: 'Every decision is traced, models are governed, and regulator-ready reports are generated.', tech: ['Governance', 'Observability', 'Evaluations', 'MLOps'], notes: ['Immutable audit trails for examiners', 'Model cards + bias evals in the registry'] },
    ],
  },

  // ------------------------------ INSURANCE ------------------------------
  {
    slug: 'claims-automation',
    name: 'AI Claims Automation',
    icon: '📄',
    sector: 'insurance',
    tagline: 'Straight-through claims processing with document AI and fraud checks',
    gradient: 'linear-gradient(135deg,#0f766e 0%,#0891b2 55%,#2563eb 100%)',
    summary: 'Claims move from intake to settlement with document understanding, coverage checks, fraud scoring and approval workflows.',
    domains: [
      { name: 'Claim Intake & Document AI', icon: '🗂️', blueprint: 'agenticRag', ctx: 'claim forms, photos, medical records and policy documents', desc: 'Multimodal extraction classifies claim documents, pulls key facts and matches them to the policy.', tech: ['RAG', 'Embeddings', 'LlamaIndex', 'Python'], notes: ['Multimodal extraction for photos and PDFs', 'Confidence-scored fields with human review queue'] },
      { name: 'Fraud Detection & Triage', icon: '🛡️', blueprint: 'fraudRiskReAct', ctx: 'claim histories, provider networks and behavioural signals', desc: 'A risk engine scores each claim and an agent investigates suspicious patterns with external checks.', tech: ['ML', 'ReAct Patterns', 'AI Graphs', 'MLOps'], notes: ['Provider-claimant link graphs flag rings', 'Explainable triage reasons for adjusters'] },
      { name: 'Claims Settlement Workflow', icon: '✅', blueprint: 'autonomousOps', ctx: 'settlement decisions, payment approvals and reopen loops', desc: 'Straight-through settlement for low-risk claims with approval gates and exception handling for the rest.', tech: ['AI Workflows', 'MCP', 'Human-in-the-loop', 'Observability'], notes: ['Automated settlement for low-risk bands', 'Adjuster approval gates on high-value payouts'] },
    ],
  },
  {
    slug: 'underwriting-intelligence',
    name: 'Smart Underwriting Intelligence',
    icon: '🩺',
    sector: 'insurance',
    tagline: 'Data-grounded risk selection and pricing for underwriters',
    gradient: 'linear-gradient(135deg,#115e59 0%,#14b8a6 55%,#22d3ee 100%)',
    summary: 'Underwriters gain a research copilot, predictive pricing and portfolio monitoring across commercial and life lines.',
    domains: [
      { name: 'Underwriting Research Copilot', icon: '🔬', blueprint: 'agenticRag', ctx: 'applications, inspection reports, industry data and guidelines', desc: 'The copilot summarises submissions, checks guidelines and flags risk factors with cited evidence.', tech: ['RAG', 'VectorDB', 'LangChain', 'Governance'], notes: ['Cited evidence for every risk factor', 'Guideline compliance checked automatically'] },
      { name: 'Predictive Pricing & Risk Models', icon: '📉', blueprint: 'predictiveMLOps', ctx: 'loss ratios, exposure data and market benchmarks', desc: 'Gradient-boosted and fine-tuned models price risk with drift monitoring and retraining loops.', tech: ['ML', 'LoRA/QLoRA', 'MLOps', 'Feature Store'], notes: ['Model registry with bias evaluations', 'Automatic retraining on portfolio drift'] },
      { name: 'Portfolio Risk Monitoring', icon: '📡', blueprint: 'eventStreamAI', ctx: 'live exposure, catastrophe events and concentration alerts', desc: 'Streaming pipelines keep portfolio exposure live and alert actuaries to concentration shifts.', tech: ['Event Streaming', 'FastAPI', 'AI Graphs', 'Observability'], notes: ['Catastrophe exposure alerts in real time', 'Concentration dashboards for actuaries'] },
    ],
  },
  {
    slug: 'life-policy-servicing',
    name: 'Life & Health Policy Servicing',
    icon: '🧾',
    sector: 'insurance',
    tagline: 'Self-service policy care with agentic backend workflows',
    gradient: 'linear-gradient(135deg,#164e63 0%,#0e7490 55%,#06b6d4 100%)',
    summary: 'Policyholders self-serve on anything from address changes to claims status, backed by agents that act in core systems.',
    domains: [
      { name: 'Policyholder Self-Service', icon: '💬', blueprint: 'customerAssistant', ctx: 'policy changes, premium queries and document requests', desc: 'A conversational assistant resolves service requests and executes safe changes through core connectors.', tech: ['ReAct Patterns', 'MCP', 'Memory Management', 'Evaluations'], notes: ['In-scope actions executed via MCP', 'Guardrails on sensitive policy changes'] },
      { name: 'Document & Correspondence Engine', icon: '✉️', blueprint: 'genContentStudio', ctx: 'policy documents, notices and regulatory letters', desc: 'Generative templates assemble personalised, compliant correspondence that reviewers approve.', tech: ['LLMs', 'Prompting', 'Graphics Engineering', 'Governance'], notes: ['Template + generative hybrid for accuracy', 'Regulatory text locked in guardrails'] },
      { name: 'Back-Office Automation', icon: '⚙️', blueprint: 'autonomousOps', ctx: 'policy admin tasks, endorsements and renewals', desc: 'Agents execute back-office tasks with approvals, retries and full audit trails.', tech: ['AI Workflows', 'LangGraph', 'Observability', 'GuardRails'], notes: ['Human approval on high-impact endorsements', 'Task completion monitored end-to-end'] },
    ],
  },

  // ------------------------------ HEALTHCARE ------------------------------
  {
    slug: 'clinical-documentation',
    name: 'Clinical Documentation & Coding',
    icon: '🩺',
    sector: 'healthcare',
    tagline: 'Ambient documentation and compliant coding from the consult room',
    gradient: 'linear-gradient(135deg,#be123c 0%,#e11d48 55%,#fb7185 100%)',
    summary: 'Clinicians focus on patients while ambient AI turns the visit into accurate notes, orders and coded claims.',
    domains: [
      { name: 'Ambient Consult Transcription', icon: '🎙️', blueprint: 'agenticRag', ctx: 'consult audio, patient history and clinical notes', desc: 'Speech-to-text plus clinical RAG drafts the note, extracting diagnoses, medications and follow-ups.', tech: ['LLMs', 'RAG', 'Fine-Tuning', 'GuardRails'], notes: ['Drafted notes reviewed and signed by clinician', 'PII redaction and PHI-safe pipelines'] },
      { name: 'Coding & Claims Assistant', icon: '🏷️', blueprint: 'predictiveMLOps', ctx: 'ICD-10/CPT coding rules and payer policies', desc: 'Models propose codes from the note with confidence and compliance checks before submission.', tech: ['ML', 'RAG', 'MLOps', 'Evaluations'], notes: ['Code suggestions with clinical evidence links', 'Denial prediction before claim submission'] },
      { name: 'Clinical Knowledge Copilot', icon: '📚', blueprint: 'graphKnowledge', ctx: 'clinical guidelines, protocols and formularies', desc: 'Guideline retrieval grounded in an institutional knowledge graph with citations to sources.', tech: ['Graph RAG', 'VectorDB', 'LlamaIndex', 'Governance'], notes: ['Guidelines linked to institutional protocols', 'Citations traceable to source documents'] },
    ],
  },
  {
    slug: 'patient-engagement',
    name: 'Patient Engagement & Care Navigation',
    icon: '🩹',
    sector: 'healthcare',
    tagline: 'A guided, 24/7 patient journey from scheduling to follow-up',
    gradient: 'linear-gradient(135deg,#9f1239 0%,#f43f5e 55%,#fda4af 100%)',
    summary: 'Patients navigate care with a helpful assistant while care teams get intelligent scheduling and outreach.',
    domains: [
      { name: 'Patient Care Assistant', icon: '💬', blueprint: 'customerAssistant', ctx: 'appointments, prescriptions, test results and pre-visit instructions', desc: 'A HIPAA-aware assistant answers questions, schedules visits and sends personalised pre-care guidance.', tech: ['ReAct Patterns', 'MCP', 'GuardRails', 'Memory Management'], notes: ['Action scope limited to safe, in-scope tasks', 'Escalation to human care coordinators'] },
      { name: 'Smart Scheduling & No-Show Prediction', icon: '📅', blueprint: 'predictiveMLOps', ctx: 'appointment demand, provider capacity and no-show risk', desc: 'Forecasting models optimise the schedule and target reminders at high no-show risk patients.', tech: ['ML', 'MLOps', 'Feature Store', 'FastAPI'], notes: ['No-show risk re-scores daily', 'Reminders personalised by channel preference'] },
      { name: 'Chronic Care Outreach', icon: '📣', blueprint: 'eventStreamAI', ctx: 'chronic care plans, remote monitoring and outreach triggers', desc: 'Streaming vitals and adherence events trigger timely, personalised outreach and escalations.', tech: ['Event Streaming', 'IoT', 'AI Workflows', 'Observability'], notes: ['Remote vitals streams drive alerting', 'Care manager alerts on adherence gaps'] },
    ],
  },
  {
    slug: 'drug-discovery-accelerator',
    name: 'Drug Discovery & Clinical Trials',
    icon: '💊',
    sector: 'healthcare',
    tagline: 'Literature intelligence and trial automation for R&D teams',
    gradient: 'linear-gradient(135deg,#831843 0%,#9d174d 55%,#db2777 100%)',
    summary: 'Research teams mine the literature, design trials and monitor safety with AI across the discovery pipeline.',
    domains: [
      { name: 'Biomedical Literature Intelligence', icon: '📖', blueprint: 'graphKnowledge', ctx: 'papers, patents, clinical trials and chemical entities', desc: 'A biomedical knowledge graph links compounds, targets and evidence for hypothesis discovery.', tech: ['Graph RAG', 'Embeddings', 'VectorDB', 'Python'], notes: ['Entity links across papers and patents', 'Evidence-graded retrieval for claims'] },
      { name: 'Trial Design & Site Selection', icon: '🧪', blueprint: 'multiAgentCrew', ctx: 'protocol drafts, eligibility criteria and site performance', desc: 'Agents draft protocol sections, simulate eligibility and recommend sites from historical performance.', tech: ['Multi-Agents', 'RAG', 'CrewAI', 'Evaluations'], notes: ['Simulated patient cohorts for feasibility', 'Site ranking from historical accrual'] },
      { name: 'Safety & Pharmacovigilance', icon: '🛡️', blueprint: 'eventStreamAI', ctx: 'adverse events, safety signals and regulatory timelines', desc: 'Streaming AE pipelines detect signals early and keep regulatory submissions on track.', tech: ['Event Streaming', 'ML', 'Governance', 'MLOps'], notes: ['Signal detection on streaming AE feeds', 'Submission timelines tracked automatically'] },
    ],
  },

  // ------------------------------ RETAIL ------------------------------
  {
    slug: 'commerce-personalisation',
    name: 'Commerce Personalisation Engine',
    icon: '🛍️',
    sector: 'retail',
    tagline: 'Real-time personalisation across search, browse and recommend',
    gradient: 'linear-gradient(135deg,#b45309 0%,#ea580c 55%,#f97316 100%)',
    summary: 'Every shopper sees a store tuned to them: live session signals feed ranking, recommendations and merchandising.',
    domains: [
      { name: 'Real-Time Session Intelligence', icon: '⚡', blueprint: 'eventStreamAI', ctx: 'clicks, carts, search and browsing behaviour', desc: 'Session events stream into a feature store powering instant personalisation of every response.', tech: ['Event Streaming', 'Feature Store', 'FastAPI', 'MLOps'], notes: ['Sub-second personalisation on session events', 'Cold-start handled with cohort defaults'] },
      { name: 'Search & Recommendations', icon: '🔍', blueprint: 'agenticRag', ctx: 'catalog, reviews and shopper intent', desc: 'Hybrid vector + keyword retrieval with reranking and recommendation models blends relevance and commerce goals.', tech: ['VectorDB', 'Embeddings', 'RAG', 'LLMs'], notes: ['Semantic + behavioural ranking blend', 'Explainable “why recommended” surfaces'] },
      { name: 'Merchandising Copilot', icon: '🎯', blueprint: 'multiAgentCrew', ctx: 'assortment, pricing and promotional calendars', desc: 'Agents analyse performance and draft pricing, bundling and campaign proposals for merchants.', tech: ['Multi-Agents', 'ML', 'LangGraph', 'Evaluations'], notes: ['Price elasticity models inform drafts', 'Human merchant approves final moves'] },
    ],
  },
  {
    slug: 'retail-demand-forecasting',
    name: 'Demand Forecasting & Inventory',
    icon: '📦',
    sector: 'retail',
    tagline: 'From forecast to shelf — inventory that follows demand',
    gradient: 'linear-gradient(135deg,#78350f 0%,#b45309 55%,#f59e0b 100%)',
    summary: 'Unified demand sensing across stores, warehouses and channels keeps inventory aligned to what shoppers want.',
    domains: [
      { name: 'Multi-Horizon Demand Sensing', icon: '🔮', blueprint: 'predictiveMLOps', ctx: 'POS, promotions, seasonality and external factors', desc: 'Forecast models blend internal signals with weather and events, refreshed daily per SKU-location.', tech: ['ML', 'MLOps', 'Feature Store', 'Python'], notes: ['Per-SKU-location daily refresh', 'Event uplift modelled explicitly'] },
      { name: 'Replenishment & Allocation', icon: '🚚', blueprint: 'autonomousOps', ctx: 'replenishment orders and allocation to stores', desc: 'Agents optimise replenishment and allocation, flagging exceptions and executing within approvals.', tech: ['AI Workflows', 'LangGraph', 'MCP', 'Observability'], notes: ['Exception-based human review', 'Allocation goals weighted to sell-through'] },
      { name: 'Supply Visibility Agent', icon: '🔎', blueprint: 'agenticRag', ctx: 'POs, shipments, lead times and supplier updates', desc: 'A supply agent answers “where is my stock” and predicts delay impacts on availability.', tech: ['RAG', 'VectorDB', 'LangChain', 'AI Graphs'], notes: ['Delay impact projected to availability dates', 'Natural-language supply queries for buyers'] },
    ],
  },
  {
    slug: 'generative-commerce-studio',
    name: 'Generative Commerce Studio',
    icon: '🖼️',
    sector: 'retail',
    tagline: 'AI-generated campaigns, listings and visuals at catalogue scale',
    gradient: 'linear-gradient(135deg,#9a3412 0%,#ea580c 55%,#fb923c 100%)',
    summary: 'A creative studio that produces product copy, imagery and campaign assets for every SKU in the catalog.',
    domains: [
      { name: 'Product Listing Generator', icon: '📝', blueprint: 'genContentStudio', ctx: 'product specs, features and brand voice', desc: 'SEO-aware titles, descriptions and bullets generated for every SKU, verified against specs.', tech: ['LLMs', 'Prompting', 'Graphics Engineering', 'Evaluations'], notes: ['Spec-grounded copy prevents hallucination', 'SEO scores guide generation'] },
      { name: 'Campaign Creative Pipeline', icon: '🎨', blueprint: 'multiAgentCrew', ctx: 'campaign briefs, brand guidelines and audience segments', desc: 'A creative crew drafts concepts, generates visuals and assembles multi-channel campaigns.', tech: ['Multi-Agents', 'Graphics Engineering', 'CrewAI', 'GuardRails'], notes: ['Brand guidelines enforced by guardrails', 'Human sign-off before spend'] },
      { name: 'Customer Review Intelligence', icon: '⭐', blueprint: 'eventStreamAI', ctx: 'reviews, ratings and sentiment across channels', desc: 'Streaming sentiment and topic extraction surface defects and opportunities to merchandisers.', tech: ['Event Streaming', 'Embeddings', 'ML', 'Dashboards'], notes: ['Topic clustering of defect mentions', 'Real-time sentiment by product family'] },
    ],
  },

  // ------------------------------ MANUFACTURING ------------------------------
  {
    slug: 'smart-factory-iiot',
    name: 'Smart Factory & IIoT Platform',
    icon: '🏭',
    sector: 'manufacturing',
    tagline: 'Connected lines with edge intelligence and live OEE',
    gradient: 'linear-gradient(135deg,#1f2937 0%,#374151 55%,#6b7280 100%)',
    summary: 'Machines, sensors and PLCs connect through edge gateways into a live factory twin with AI on the floor.',
    domains: [
      { name: 'Machine Telemetry & Edge AI', icon: '📡', blueprint: 'edgeIotAI', ctx: 'vibration, temperature, current and cycle data from machines', desc: 'Edge models detect anomalies in real time, minimising data egress and enabling instant line alerts.', tech: ['IoT', 'TinyML', 'Edge Gateway', 'Semiconductor'], notes: ['On-edge anomaly detection in milliseconds', 'Low-bandwidth selective uplink'] },
      { name: 'Predictive Maintenance', icon: '🔧', blueprint: 'predictiveMLOps', ctx: 'equipment health, maintenance history and RUL', desc: 'Remaining-useful-life models schedule maintenance before failure, cutting downtime and cost.', tech: ['ML', 'MLOps', 'Feature Store', 'Event Streaming'], notes: ['RUL predictions drive maintenance windows', 'False-alarm tuning with technician feedback'] },
      { name: 'Digital Twin & OEE', icon: '🔄', blueprint: 'eventStreamAI', ctx: 'line throughput, quality and downtime events', desc: 'A live digital twin computes OEE and simulates what-if changes before they touch the line.', tech: ['Event Streaming', 'AI Graphs', 'Python', 'Dashboards'], notes: ['What-if simulation on the twin', 'Live OEE by line, shift and SKU'] },
    ],
  },
  {
    slug: 'quality-vision-inspection',
    name: 'AI Vision Quality Inspection',
    icon: '🔍',
    sector: 'manufacturing',
    tagline: 'Computer-vision defect detection on every part, in line',
    gradient: 'linear-gradient(135deg,#111827 0%,#1f2937 55%,#4b5563 100%)',
    summary: 'High-speed cameras and vision models catch defects at line speed, feeding root-cause analysis back to process.',
    domains: [
      { name: 'Inline Vision Detection', icon: '👁️', blueprint: 'edgeIotAI', ctx: 'camera feeds, part images and defect classes', desc: 'Edge vision models classify defects per part in real time, routing rejects and flagging borderline cases.', tech: ['Edge AI', 'TinyML', 'Graphics Engineering', 'FastAPI'], notes: ['Human review queue for borderline parts', 'Model updates pushed OTA to edge units'] },
      { name: 'Defect Root-Cause Analysis', icon: '🧬', blueprint: 'graphKnowledge', ctx: 'defect records, machine parameters and process steps', desc: 'A knowledge graph links defect types to process conditions, revealing root causes across shifts.', tech: ['Graph RAG', 'AI Graphs', 'VectorDB', 'Python'], notes: ['Defect-process correlations discovered', 'Shift-level pattern reports generated'] },
      { name: 'Quality Control Workflow', icon: '✅', blueprint: 'autonomousOps', ctx: 'inspection results, containment and rework loops', desc: 'Containment, rework and release workflows run automatically with approval gates on quality holds.', tech: ['AI Workflows', 'LangGraph', 'MCP', 'Observability'], notes: ['Automatic containment on defect clusters', 'Rework loops tracked to closure'] },
    ],
  },
  {
    slug: 'autonomous-supply-ops',
    name: 'Autonomous Plant Operations',
    icon: '🛠️',
    sector: 'manufacturing',
    tagline: 'Self-healing production systems with human oversight',
    gradient: 'linear-gradient(135deg,#0c0a09 0%,#1c1917 55%,#44403c 100%)',
    summary: 'Production systems detect, diagnose and recover from issues with agents, runbooks and approval gates.',
    domains: [
      { name: 'Anomaly Detection & Alerts', icon: '🚨', blueprint: 'eventStreamAI', ctx: 'line sensors, energy usage and process parameters', desc: 'Streaming models flag process anomalies and correlate alerts into incidents before impact.', tech: ['Event Streaming', 'ML', 'Observability', 'Dashboards'], notes: ['Early-warning on process drift', 'Alerts correlated into incidents'] },
      { name: 'Root-Cause & Runbook Agent', icon: '🩺', blueprint: 'autonomousOps', ctx: 'incident context, runbooks and maintenance records', desc: 'A ReAct agent diagnoses incidents and recommends runbook actions with confidence.', tech: ['ReAct Patterns', 'RAG', 'Agent Loops', 'MCP'], notes: ['Runbook retrieval with evidence', 'Confidence-scored recommendations'] },
      { name: 'Human-Supervised Automation', icon: '👥', blueprint: 'governedPlatform', ctx: 'automated actions, permissions and audit trails', desc: 'Automations execute behind approval gates with role-based permissions and full traceability.', tech: ['Governance', 'GuardRails', 'Human-in-the-loop', 'Observability'], notes: ['Operator approval on high-impact actions', 'Every automation traced to policy'] },
    ],
  },

  // ------------------------------ TELECOM ------------------------------
  {
    slug: 'network-ops-automation',
    name: 'Network Operations Automation',
    icon: '📡',
    sector: 'telecom',
    tagline: 'Self-healing network operations across the entire footprint',
    gradient: 'linear-gradient(135deg,#0e7490 0%,#06b6d4 55%,#22d3ee 100%)',
    summary: 'Network telemetry drives autonomous detection, diagnosis and remediation with engineering oversight.',
    domains: [
      { name: 'Network Telemetry & Detection', icon: '📊', blueprint: 'eventStreamAI', ctx: 'device metrics, alarms and traffic flows', desc: 'Streaming pipelines correlate alarms into incidents with impact scoring across the network.', tech: ['Event Streaming', 'ML', 'Observability', 'AI Graphs'], notes: ['Impact-scored incident correlation', 'Sub-minute alarm to incident time'] },
      { name: 'Network RCA Agent', icon: '🔎', blueprint: 'autonomousOps', ctx: 'fault tickets, config changes and topology data', desc: 'A ReAct agent diagnoses faults, reads config diffs and runbooks, and proposes fixes.', tech: ['ReAct Patterns', 'RAG', 'Agent Loops', 'MCP'], notes: ['Config-diff analysis for change-induced faults', 'Proposed fixes with confidence scores'] },
      { name: 'Change & Config Governance', icon: '🏛️', blueprint: 'governedPlatform', ctx: 'change approvals, config baselines and compliance', desc: 'Changes run through approvals and config validation with audit trails for auditors.', tech: ['Governance', 'GuardRails', 'Human-in-the-loop', 'Observability'], notes: ['Golden-config drift detection', 'Regulator-ready change audit logs'] },
    ],
  },
  {
    slug: 'subscriber-experience-ai',
    name: 'Subscriber Experience & Churn AI',
    icon: '📱',
    sector: 'telecom',
    tagline: 'Predict churn, personalise plans, keep customers happy',
    gradient: 'linear-gradient(135deg,#155e75 0%,#0891b2 55%,#67e8f9 100%)',
    summary: 'Usage intelligence and conversational care keep subscribers engaged and reduce churn with proactive offers.',
    domains: [
      { name: 'Churn Prediction & Prevention', icon: '📉', blueprint: 'predictiveMLOps', ctx: 'usage, billing, support and network experience signals', desc: 'Churn models score every subscriber and trigger retention journeys before they leave.', tech: ['ML', 'MLOps', 'Feature Store', 'Event Streaming'], notes: ['Weekly churn re-score of full base', 'Retention offers targeted by driver'] },
      { name: 'Subscriber Care Assistant', icon: '💬', blueprint: 'customerAssistant', ctx: 'billing, plans, device and network queries', desc: 'A conversational assistant resolves care issues and executes plan changes within permissions.', tech: ['ReAct Patterns', 'MCP', 'Memory Management', 'Evaluations'], notes: ['Plan changes executed via MCP tools', 'Hand-off to agents with full context'] },
      { name: 'Usage & Plan Intelligence', icon: '📶', blueprint: 'agenticRag', ctx: 'usage patterns and plan catalog', desc: 'Agents recommend the right plan for each subscriber’s usage, explaining the saving.', tech: ['RAG', 'VectorDB', 'LangChain', 'LLMs'], notes: ['Explainable plan recommendations', 'Usage forecasting by cohort'] },
    ],
  },
  {
    slug: 'content-delivery-media-ai',
    name: 'Content Delivery & Media AI',
    icon: '🎬',
    sector: 'telecom',
    tagline: 'Intelligent content delivery with generative media production',
    gradient: 'linear-gradient(135deg,#0c4a6e 0%,#0284c7 55%,#38bdf8 100%)',
    summary: 'CDN intelligence optimises delivery while generative tools accelerate media production for creators.',
    domains: [
      { name: 'Adaptive Delivery Intelligence', icon: '📦', blueprint: 'eventStreamAI', ctx: 'streaming sessions, edge capacity and network paths', desc: 'Real-time session analytics drive adaptive bitrate and edge caching decisions.', tech: ['Event Streaming', 'ML', 'Edge Gateway', 'Observability'], notes: ['Session-quality scoring in real time', 'Edge cache placement from demand curves'] },
      { name: 'Generative Media Studio', icon: '🎨', blueprint: 'genContentStudio', ctx: 'trailers, thumbnails, subtitles and promotional clips', desc: 'Generative pipelines produce promotional assets and auto-captions at catalogue scale.', tech: ['Graphics Engineering', 'LLMs', 'Multi-Agents', 'GuardRails'], notes: ['Auto-captions in 40+ languages', 'Thumbnails A/B optimised by CTR'] },
      { name: 'Recommendation & Discovery', icon: '🔍', blueprint: 'agenticRag', ctx: 'watch history, content metadata and viewer intent', desc: 'Hybrid recommender with semantic search surfaces content across catalog and partners.', tech: ['VectorDB', 'Embeddings', 'RAG', 'ML'], notes: ['Semantic “more like this” discovery', 'Trending signals blended into ranking'] },
    ],
  },

  // ------------------------------ ENERGY ------------------------------
  {
    slug: 'smart-grid-optimization',
    name: 'Smart Grid Optimisation',
    icon: '🔌',
    sector: 'energy',
    tagline: 'Real-time grid balancing with renewables and DERs',
    gradient: 'linear-gradient(135deg,#15803d 0%,#16a34a 55%,#84cc16 100%)',
    summary: 'Grid operators balance supply and demand in real time with streaming telemetry, forecasting and automated control.',
    domains: [
      { name: 'Grid Telemetry & State Estimation', icon: '📡', blueprint: 'edgeIotAI', ctx: 'substation sensors, smart meters and DER inverters', desc: 'Edge and cloud telemetry builds a live grid state model for operators and automation.', tech: ['IoT', 'Edge Gateway', 'Event Streaming', 'AI Graphs'], notes: ['Sub-second state updates per feeder', 'DER visibility down to inverter level'] },
      { name: 'Load & Generation Forecasting', icon: '🔮', blueprint: 'predictiveMLOps', ctx: 'weather, consumption and renewable generation', desc: 'Forecast models predict load and renewables across horizons, driving dispatch decisions.', tech: ['ML', 'MLOps', 'Feature Store', 'Python'], notes: ['Solar/wind forecasting with weather feeds', 'Probabilistic forecasts for dispatch'] },
      { name: 'Automated Demand Response', icon: '⚡', blueprint: 'autonomousOps', ctx: 'curtailment events, DER dispatch and market signals', desc: 'Agents execute demand-response events with operator approval and settlement-grade logging.', tech: ['AI Workflows', 'MCP', 'Human-in-the-loop', 'Governance'], notes: ['DER dispatch orchestrated automatically', 'Settlement-grade event logs'] },
    ],
  },
  {
    slug: 'energy-trading-desk',
    name: 'Energy Trading & Risk Desk',
    icon: '📈',
    sector: 'energy',
    tagline: 'Market intelligence and risk analytics for the trading floor',
    gradient: 'linear-gradient(135deg,#14532d 0%,#22c55e 55%,#a3e635 100%)',
    summary: 'Traders get streaming market signals, risk analytics and research agents on a governed desk platform.',
    domains: [
      { name: 'Market Data & Signal Engine', icon: '📊', blueprint: 'eventStreamAI', ctx: 'spot and futures prices, fundamentals and news', desc: 'Streaming market data powers signal computation and real-time risk on the desk.', tech: ['Event Streaming', 'ML', 'FastAPI', 'VectorDB'], notes: ['Low-latency price and signal feeds', 'News sentiment scored on arrival'] },
      { name: 'Trading Research Copilot', icon: '🧠', blueprint: 'agenticRag', ctx: 'fundamentals, reports and market commentary', desc: 'A research copilot summarises positions and drafts market notes grounded in data.', tech: ['RAG', 'LangGraph', 'LlamaIndex', 'Governance'], notes: ['Grounded notes with data citations', 'Desk policies applied at generation'] },
      { name: 'Risk & Compliance Analytics', icon: '🛡️', blueprint: 'governedPlatform', ctx: 'VaR, limits and regulatory reporting', desc: 'Risk analytics, limit monitoring and regulatory reporting run on a governed platform.', tech: ['Governance', 'ML', 'Observability', 'Evaluations'], notes: ['Limit breaches alerted in real time', 'Regulator-ready reporting automations'] },
    ],
  },
  {
    slug: 'utilities-field-automation',
    name: 'Utilities Field & Asset Automation',
    icon: '🔧',
    sector: 'energy',
    tagline: 'Predictive asset care and autonomous field workflows',
    gradient: 'linear-gradient(135deg,#14532d 0%,#4d7c0f 55%,#65a30d 100%)',
    summary: 'Asset health and field work are managed with predictive models, vision inspection and guided workflows.',
    domains: [
      { name: 'Asset Health Monitoring', icon: '🩺', blueprint: 'edgeIotAI', ctx: 'transformers, lines, pumps and corrosion sensors', desc: 'Edge sensing plus cloud models predict asset failure and prioritise maintenance.', tech: ['IoT', 'TinyML', 'MLOps', 'Feature Store'], notes: ['Failure-risk scores per asset', 'Maintenance prioritised by criticality'] },
      { name: 'Inspection Vision AI', icon: '🔍', blueprint: 'graphKnowledge', ctx: 'drone imagery, pole photos and inspection records', desc: 'Vision models detect defects in imagery and link findings to asset history in a knowledge graph.', tech: ['Graphics Engineering', 'AI Graphs', 'Edge AI', 'Python'], notes: ['Defect findings linked to asset history', 'Drone imagery processed at the edge'] },
      { name: 'Field Work Order Automation', icon: '🗂️', blueprint: 'autonomousOps', ctx: 'work orders, crew schedules and safety permits', desc: 'Work orders are planned, dispatched and closed with agents and approval gates.', tech: ['AI Workflows', 'LangGraph', 'MCP', 'Observability'], notes: ['Crew dispatch optimised by skill and location', 'Permit-to-work checks automated'] },
    ],
  },

  // ------------------------------ LOGISTICS ------------------------------
  {
    slug: 'supply-chain-control-tower',
    name: 'Supply Chain Control Tower',
    icon: '🗼',
    sector: 'logistics',
    tagline: 'End-to-end visibility with proactive disruption response',
    gradient: 'linear-gradient(135deg,#a16207 0%,#ca8a04 55%,#eab308 100%)',
    summary: 'A control tower fuses shipment, inventory and external signals into one view with autonomous response agents.',
    domains: [
      { name: 'Shipment & Inventory Visibility', icon: '📦', blueprint: 'eventStreamAI', ctx: 'shipments, warehouses, carriers and inventory levels', desc: 'Streaming track-and-trace fuses EDI, IoT and carrier APIs into live order-level visibility.', tech: ['Event Streaming', 'IoT', 'AI Graphs', 'FastAPI'], notes: ['Order-level ETAs recalculated live', 'Inventory visible across every node'] },
      { name: 'Disruption Detection & Response', icon: '⚠️', blueprint: 'autonomousOps', ctx: 'weather, port congestion, strikes and supplier delays', desc: 'Agents detect disruptions, quantify impact and propose rerouting or replenishment actions.', tech: ['ReAct Patterns', 'RAG', 'Agent Loops', 'MCP'], notes: ['Impact quantified in days and cost', 'Reroute proposals with approval gates'] },
      { name: 'Supplier & Demand Intelligence', icon: '🔮', blueprint: 'predictiveMLOps', ctx: 'supplier performance, lead times and demand signals', desc: 'Forecast and supplier-risk models feed planning and procurement decisions.', tech: ['ML', 'MLOps', 'Feature Store', 'RAG'], notes: ['Supplier risk re-scored weekly', 'Lead-time predictions by lane'] },
    ],
  },
  {
    slug: 'route-optimization-fleet',
    name: 'Route Optimisation & Fleet Intelligence',
    icon: '🚛',
    sector: 'logistics',
    tagline: 'Smarter routes, greener fleets, on-time deliveries',
    gradient: 'linear-gradient(135deg,#713f12 0%,#ca8a04 55%,#facc15 100%)',
    summary: 'Routing, telematics and driver assistance combine to cut cost and emissions while lifting on-time performance.',
    domains: [
      { name: 'Dynamic Route Optimisation', icon: '🗺️', blueprint: 'predictiveMLOps', ctx: 'orders, traffic, vehicle capacity and time windows', desc: 'Optimisation models replan routes throughout the day as orders and traffic shift.', tech: ['ML', 'Python', 'Event Streaming', 'MLOps'], notes: ['Re-optimisation on order insert', 'Multi-objective cost and emissions'] },
      { name: 'Fleet Telematics & Safety', icon: '📡', blueprint: 'edgeIotAI', ctx: 'vehicle telemetry, driver behaviour and fuel use', desc: 'Edge telematics score driving behaviour and detect safety events in real time.', tech: ['IoT', 'Edge Gateway', 'Event Streaming', 'Dashboards'], notes: ['Safety events flagged in real time', 'Fuel and idling analytics by vehicle'] },
      { name: 'Delivery Experience Agent', icon: '📱', blueprint: 'customerAssistant', ctx: 'delivery windows, ETAs and recipient preferences', desc: 'Recipients get proactive updates and a concierge that handles redelivery and preferences.', tech: ['ReAct Patterns', 'MCP', 'Memory Management', 'Evaluations'], notes: ['Proactive ETA updates via preferred channel', 'Redelivery booked without agents'] },
    ],
  },
  {
    slug: 'warehouse-automation',
    name: 'Warehouse Automation & Robotics',
    icon: '🤖',
    sector: 'logistics',
    tagline: 'Robots, vision and agents running the fulfilment floor',
    gradient: 'linear-gradient(135deg,#422006 0%,#a16207 55%,#f59e0b 100%)',
    summary: 'Fulfilment centres coordinate robots, put-wall vision and labour with an agentic orchestration layer.',
    domains: [
      { name: 'Robotic Orchestration', icon: '🦾', blueprint: 'autonomousOps', ctx: 'AMR fleets, pick stations and order waves', desc: 'Agents orchestrate robot tasks, charging and congestion, adapting to order flow in real time.', tech: ['AI Workflows', 'IoT', 'Event Streaming', 'Agent Loops'], notes: ['Live congestion-aware task dispatch', 'Wave planning balanced to capacity'] },
      { name: 'Vision Put-Wall & Quality', icon: '👁️', blueprint: 'edgeIotAI', ctx: 'pick cameras, bin identification and error checks', desc: 'Vision models verify picks and automate put-wall flows with high accuracy.', tech: ['Edge AI', 'Graphics Engineering', 'TinyML', 'FastAPI'], notes: ['Pick verification in milliseconds', 'Error rates tracked per station'] },
      { name: 'Labour & Throughput Analytics', icon: '📊', blueprint: 'predictiveMLOps', ctx: 'order volumes, headcount and station throughput', desc: 'Forecast models plan labour and surface bottlenecks before they slow the floor.', tech: ['ML', 'MLOps', 'Feature Store', 'Dashboards'], notes: ['Labour plans from volume forecasts', 'Bottleneck detection per zone'] },
    ],
  },
]
