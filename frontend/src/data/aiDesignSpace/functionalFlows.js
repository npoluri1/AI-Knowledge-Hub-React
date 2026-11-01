// ============================================================
// AI DESIGN SPACE — FUNCTIONAL FLOW & FEATURE GENERATORS
// buildFunctionalFlow(ctx, pattern) → draw.io-style flow diagram
// buildDomainFeatures(ctx, pattern, industry) → feature grid
// Every flow is contextualized: the same pattern renders with
// the industry/domain's own nouns and verbs.
// ============================================================

import { applyCtx } from './index'

// Positional edge verbs for a linear 7-node LDD flow (+2 added nodes).
const EDGE_VERBS = ['enters', 'validated', 'routed', 'gathered', 'reasoned', 'executed', 'recorded', 'completed']

// Generic feature set — contextualized per domain. 8 universal + 4 pattern-specific.
const UNIVERSAL_FEATURES = [
  { icon: '🚪', name: 'Smart Intake & Validation', desc: 'Validate every {ctx} input with typed schemas, dedupe and enrichment before anything is processed.' },
  { icon: '🔎', name: 'Explainable Decisions', desc: 'Every {ctx} decision carries a reason, evidence trail and confidence score — auditable end to end.' },
  { icon: '⚙️', name: 'Automated Workflows', desc: 'Multi-step {ctx} processes run automatically, with approval gates on sensitive actions.' },
  { icon: '📊', name: 'Live Monitoring & Alerts', desc: 'Real-time dashboards and alerting watch {ctx} activity and flag anomalies the moment they appear.' },
  { icon: '🧠', name: 'AI-Assisted Actions', desc: 'The agent suggests next-best actions for {ctx}, grounded in retrieved knowledge and memory.' },
  { icon: '🔐', name: 'Security & Guardrails', desc: 'Prompt-injection defense, least-privilege tools and data protection across every {ctx} interaction.' },
  { icon: '📈', name: 'Continuous Improvement', desc: 'Evaluations and feedback loops tune the {ctx} experience over time without full retrains.' },
  { icon: '🔗', name: 'Enterprise Integration', desc: 'Native connectors to the systems involved in {ctx} — CRM, ERP, databases and internal APIs.' },
]

const PATTERN_FEATURES = {
  agenticRag: [
    { icon: '📚', name: 'Grounded Knowledge', desc: 'Every answer about {ctx} cites retrieved sources with page-level provenance.' },
    { icon: '🤔', name: 'Multi-Step Reasoning', desc: 'The planner decomposes {ctx} questions and revisits retrieval when evidence is thin.' },
    { icon: '💬', name: 'Conversational Follow-Ups', desc: 'Follow-up questions stay grounded in the prior {ctx} context and conversation memory.' },
    { icon: '🧭', name: 'Human Approval Points', desc: 'High-stakes {ctx} answers pause for operator review before release.' },
  ],
  multiAgentCrew: [
    { icon: '👥', name: 'Role-Based Specialists', desc: 'Researcher, writer, reviewer and executor agents divide {ctx} work by role.' },
    { icon: '🔄', name: 'Critique & Revise Loops', desc: 'The reviewer agent iterates on {ctx} drafts until quality gates pass.' },
    { icon: '📋', name: 'Task Orchestration', desc: 'Dependencies between {ctx} subtasks are planned and executed in order.' },
    { icon: '🧾', name: 'Deliverable Assembly', desc: 'Contributions from every {ctx} agent are merged into a single audited output.' },
  ],
  eventStreamAI: [
    { icon: '⚡', name: 'Millisecond Decisions', desc: 'Streaming models score each {ctx} event as it arrives with no batch delay.' },
    { icon: '🔄', name: 'Event Replay & Recovery', desc: 'Kafka retention lets the pipeline replay {ctx} events after a failure.' },
    { icon: '📦', name: 'Back-Pressure Handling', desc: 'Ingestion gracefully throttles when downstream {ctx} processors slow down.' },
    { icon: '🗄️', name: 'Hot/Warm/Cold Storage', desc: '{ctx} events tier to cheap storage as they age, preserving replay ability.' },
  ],
  mcpToolGateway: [
    { icon: '🧩', name: 'Capability Discovery', desc: 'Agents discover available {ctx} tools dynamically instead of hardcoded lists.' },
    { icon: '🔑', name: 'Scoped Permissions', desc: 'Every {ctx} tool call checks least-privilege scopes before executing.' },
    { icon: '🧾', name: 'Contract Validation', desc: 'Tool arguments validate against JSON Schema before any {ctx} side effect occurs.' },
    { icon: '📜', name: 'Full Audit Trail', desc: 'Every {ctx} tool invocation is logged with actor, payload and result.' },
  ],
  predictiveMLOps: [
    { icon: '📈', name: 'Forecast & Score', desc: 'Models predict future {ctx} outcomes with calibrated probabilities.' },
    { icon: '🏷️', name: 'Versioned Features', desc: 'Feature store versions the exact inputs that trained each {ctx} model.' },
    { icon: '🧪', name: 'Experiment Tracking', desc: 'Every {ctx} training run logs params, metrics and artifacts for comparison.' },
    { icon: '🔄', name: 'Drift-Triggered Retraining', desc: 'Monitoring detects {ctx} data drift and queues automatic retraining.' },
  ],
  fraudRiskReAct: [
    { icon: '🛡️', name: 'Millisecond Triage', desc: 'Rules fast-path approve or flag each {ctx} event before ML scoring runs.' },
    { icon: '🔍', name: 'Deep Investigation', desc: 'The ReAct agent gathers evidence across history, graphs and external checks for {ctx} risk.' },
    { icon: '🧾', name: 'Explainable Verdicts', desc: 'Approve / review / block decisions come with human-readable reasons for {ctx}.' },
    { icon: '⚖️', name: 'Model + Rules Ensemble', desc: 'Deterministic rules and ML scores combine for robust {ctx} risk coverage.' },
  ],
  customerAssistant: [
    { icon: '💬', name: 'Omnichannel Replies', desc: 'Consistent {ctx} answers across web chat, mobile, voice and messaging.' },
    { icon: '🎯', name: 'Intent-Aware Routing', desc: 'The assistant detects intent and routes {ctx} requests to the right resolver.' },
    { icon: '🤝', name: 'Seamless Human Handoff', desc: 'Complex {ctx} issues escalate with full conversation context.' },
    { icon: '⭐', name: 'Sentiment Awareness', desc: 'The assistant detects frustration in {ctx} conversations and adapts tone.' },
  ],
  edgeIotAI: [
    { icon: '📡', name: 'On-Device Inference', desc: 'TinyML models make {ctx} decisions at the edge with near-zero latency.' },
    { icon: '🔋', name: 'Power-Aware Operation', desc: 'Devices wake the radio only when a {ctx} event matters, saving battery.' },
    { icon: '📦', name: 'Fleet OTA Updates', desc: 'Model updates push to the whole {ctx} device fleet over secure channels.' },
    { icon: '🔌', name: 'Offline Resilience', desc: 'Edge gateways buffer {ctx} telemetry and sync when connectivity returns.' },
  ],
  genContentStudio: [
    { icon: '🎨', name: 'Multimodal Generation', desc: 'Text, image, video and audio assets for {ctx} are produced in one pipeline.' },
    { icon: '🎭', name: 'Brand Consistency', desc: 'Style guides and guardrails enforce brand voice across every {ctx} asset.' },
    { icon: '👁️', name: 'Human Review Gates', desc: 'Reviewers approve {ctx} content before it reaches any audience.' },
    { icon: '📏', name: 'Rights & Safety Checks', desc: 'Licensing, watermarking and content safety screen every {ctx} output.' },
  ],
  autonomousOps: [
    { icon: '🚨', name: 'Automatic Detection', desc: 'Anomalies in {ctx} systems are flagged before users notice anything.' },
    { icon: '🩺', name: 'Root-Cause Reasoning', desc: 'The RCA agent reads logs and runbooks to explain {ctx} incidents.' },
    { icon: '🔧', name: 'Guided Remediation', desc: 'Runbook fixes execute automatically behind approval gates for {ctx}.' },
    { icon: '📚', name: 'Learning Postmortems', desc: 'Every {ctx} incident feeds the knowledge base and improves future responses.' },
  ],
  graphKnowledge: [
    { icon: '🕸️', name: 'Entity Relationships', desc: 'The knowledge graph models how {ctx} entities and facts connect.' },
    { icon: '🧭', name: 'Multi-Hop Answers', desc: 'Reasoning traverses graph paths to answer questions vectors alone cannot.' },
    { icon: '🧾', name: 'Provenance on Every Fact', desc: 'Each {ctx} answer traces back to source documents and graph edges.' },
    { icon: '🔄', name: 'Hybrid Retrieval', desc: 'Graph traversal plus vector search pick the best evidence for {ctx} queries.' },
  ],
  governedPlatform: [
    { icon: '🏛️', name: 'Central Policy Engine', desc: 'One policy layer governs every {ctx} AI request across the organisation.' },
    { icon: '🧪', name: 'Output Scoring', desc: 'Safety, quality and faithfulness scores gate every {ctx} response.' },
    { icon: '📜', name: 'Immutable Audit Logs', desc: 'Full traces of {ctx} requests satisfy compliance and regulator needs.' },
    { icon: '🚦', name: 'Model Routing Rules', desc: 'The gateway routes {ctx} workloads to the best model by task and cost.' },
  ],
}

// Short contextual phrase from the ctx string (first 2-3 words, lowercase).
const ctxShort = ctx => String(ctx).split(/[,，.]/)[0].trim().split(' ').slice(0, 3).join(' ').toLowerCase()

// Build a complete functional-flow diagram for a context + pattern.
export function buildFunctionalFlow(ctx, pattern) {
  if (!pattern) return { nodes: [], edges: [] }
  const short = ctxShort(ctx)

  // Ensure every flow has a gateway stage (validation / approval gate).
  const ldd = (pattern.ldd || []).slice()
  if (!ldd.some(n => n.kind === 'gateway')) {
    const lastAi = ldd.map(n => n.kind).lastIndexOf('ai')
    ldd.splice(lastAi + 1, 0, {
      title: 'Quality & Approval Gate',
      kind: 'gateway',
      tech: 'GuardRails · Human-in-the-loop',
    })
  }

  const nodes = []
  const edges = []

  ldd.forEach((n, i) => {
    const titled = applyCtx(n.title, ctx)
    const label = titled !== n.title
      ? titled
      : short && !n.title.toLowerCase().includes(short)
        ? `${n.title} · ${short}`
        : n.title
    nodes.push({
      id: `n${i + 1}`,
      label,
      kind: n.kind || 'ai',
      sub: (n.tech ? n.tech.split('·')[0].trim() : pattern.tag) + (short ? ` · ${short}` : ''),
    })
  })

  // Linear edges 1→2…7 with contextual verbs.
  for (let i = 0; i < ldd.length - 1; i++) {
    edges.push({ from: `n${i + 1}`, to: `n${i + 2}`, label: EDGE_VERBS[Math.min(i, EDGE_VERBS.length - 1)] })
  }

  // Agent loop edge: last AI node back to the retrieval/data node ("revise · retry").
  const aiIdx = ldd.map(n => n.kind).lastIndexOf('ai')
  const dataIdx = ldd.findIndex(n => n.kind === 'data' || n.kind === 'store')
  if (aiIdx > 0 && dataIdx >= 0 && dataIdx !== aiIdx) {
    edges.push({ from: `n${aiIdx + 1}`, to: `n${dataIdx + 1}`, label: 'revise · retry' })
  }

  // Outcome node to complete the flow.
  const last = ldd.length
  nodes.push({ id: 'out', label: `Outcome · ${short || 'measure'}`, kind: 'action', sub: 'kpi · feedback' })
  edges.push({ from: `n${last}`, to: 'out', label: 'complete' })
  // Feedback loop back into the flow.
  const mid = dataIdx >= 0 ? dataIdx + 1 : 2
  edges.push({ from: 'out', to: `n${mid}`, label: 'feedback' })

  return { nodes, edges }
}

// Build the feature grid for a context + pattern (12 features).
export function buildDomainFeatures(ctx, pattern, industry) {
  const universal = UNIVERSAL_FEATURES.map(f => ({ ...f, name: applyCtx(f.name, ctx), desc: applyCtx(f.desc, ctx) }))
  const specific = (PATTERN_FEATURES[pattern?.id] || PATTERN_FEATURES.governedPlatform).map(f => ({ ...f, name: applyCtx(f.name, ctx), desc: applyCtx(f.desc, ctx) }))
  return { universal, specific }
}

// Short human-readable flow steps for list rendering.
export function flowSteps(ctx, pattern) {
  const flow = buildFunctionalFlow(ctx, pattern)
  return flow.nodes.map(n => n.label)
}
