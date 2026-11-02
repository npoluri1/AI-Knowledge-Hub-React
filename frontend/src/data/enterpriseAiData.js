// Enterprise AI Builder's Handbook — Claude (Claude Code, Cowork, apps, API)
// and OpenAI (ChatGPT, Codex, API) for real-world, governed implementation.
// Plan-specific or fast-moving details point to the official trust/docs pages.
const R = String.raw

export const HANDBOOK_TABS = [
  { id: 'certs', icon: '🎓', label: 'Certifications' },
  { id: 'claude-code', icon: '💻', label: 'Claude Code — every bit' },
  { id: 'claude-apps', icon: '🅰️', label: 'Cowork, apps & design' },
  { id: 'claude-gov', icon: '🛡️', label: 'Claude governance' },
  { id: 'openai', icon: '🟢', label: 'ChatGPT & Codex' },
  { id: 'openai-gov', icon: '🔐', label: 'OpenAI governance' },
  { id: 'compare', icon: '⚖️', label: 'Claude vs ChatGPT vs Codex' },
  { id: 'realtime', icon: '🏗️', label: 'Real-time implementation' },
  { id: 'enterprise', icon: '🏢', label: 'Enterprise standards' },
]

// ---------------------------------------------------------------- certifications
export const CERT_PATHS = {
  claude: [
    { code: 'CCAO-F', name: 'Claude Certified Associate — Foundations', who: 'Anyone using Claude at work: analysts, PMs, consultants, support leads.', focus: ['Prompting fundamentals', 'Claude apps: Projects, Artifacts, Research, connectors', 'Responsible & safe use', 'Picking the right model for a task'], apply: 'Write a team prompt playbook and a Project with shared knowledge for your department.' },
    { code: 'CCDV-F', name: 'Claude Certified Developer — Foundations', who: 'Engineers building on the Claude API and Claude Code.', focus: ['Messages API, streaming, tool use, structured output', 'Prompt caching, batches, token budgeting', 'Claude Code: CLAUDE.md, permissions, hooks, MCP', 'Testing & evaluating LLM features'], apply: 'Ship a small API service with tool use, prompt caching and an eval suite in CI.' },
    { code: 'CCAR-F', name: 'Claude Certified Architect — Foundations', who: 'Solution architects designing Claude-based systems.', focus: ['RAG vs fine-tune vs prompt decisions', 'Agent & multi-agent architecture', 'Security, data governance & deployment options (API, Bedrock, Vertex)', 'Cost, latency and reliability trade-offs'], apply: 'Produce a reference architecture + risk register for one production use case.' },
    { code: 'CCAR-P', name: 'Claude Certified Architect — Professional', who: 'Senior architects leading enterprise AI platforms.', focus: ['Enterprise-scale agent platforms & MCP ecosystems', 'Governance, compliance and auditability', 'Evaluation strategy and LLMOps at scale', 'Org rollout, FinOps and change management'], apply: 'Design a multi-team AI platform with guardrails, eval gates, cost controls and an adoption plan.' },
  ],
  claudeNote: 'Codes, pricing, scheduling and retake rules are listed in the sections below (Pearson VUE). Exam blueprints change — always confirm domains on the Anthropic Partner Academy page for your exam.',
  openai: [
    { name: 'OpenAI Academy & OpenAI Certifications', who: 'Workers and developers building AI fluency with ChatGPT and the OpenAI platform.', focus: ['AI foundations & everyday ChatGPT use', 'Prompting, GPTs, Projects and data analysis', 'Building with the API, Responses & Agents SDK', 'Responsible use in the workplace'], apply: 'Pair the certification with a deployed workflow (custom GPT or API app) to prove skills.', note: 'OpenAI announced certifications through OpenAI Academy in 2025 — check academy.openai.com for the current catalogue and availability in your country.' },
  ],
  path: ['Associate (use it well)', 'Developer (build with it)', 'Architect Foundations (design systems)', 'Architect Professional (lead platforms)'],
}

// ---------------------------------------------------------------- Claude Code
export const CLAUDE_CODE = [
  { group: 'Setup & memory', items: [
    { t: 'Install & start', d: 'Terminal agent that reads, edits, runs and tests your repo. Also available in IDEs, the desktop app and on the web.', code: R`npm install -g @anthropic-ai/claude-code
cd your-repo && claude` },
    { t: 'CLAUDE.md memory', d: 'Loaded every session: project rules, commands, architecture. Levels: enterprise/managed policy → user (~/.claude/CLAUDE.md) → project (./CLAUDE.md) → local. Keep it short and current; /init drafts one, /memory edits it.', code: R`# CLAUDE.md
- Stack: FastAPI + React; run tests with "pytest -q" and "npm test"
- Never commit secrets; config via env vars
- Every API change needs a test and an OpenAPI update` },
    { t: 'Settings hierarchy', d: 'settings.json at user (~/.claude), project (.claude/settings.json, committed) and local (.claude/settings.local.json, not committed). Enterprise managed settings override everything.' },
  ] },
  { group: 'Permissions & safety', items: [
    { t: 'Allow / ask / deny rules', d: 'Least privilege: allow safe commands, deny secrets and risky network calls. Deny always wins.', code: R`{
  "permissions": {
    "allow": ["Bash(npm run test:*)", "Bash(pytest:*)", "Read(./src/**)"],
    "ask":   ["Bash(git push:*)"],
    "deny":  ["Read(./.env)", "Read(./secrets/**)", "Bash(curl:*)", "Bash(rm -rf:*)"]
  }
}` },
    { t: 'Permission modes', d: 'default (asks), acceptEdits (auto-accept file edits), plan (read-only planning), bypassPermissions (only in isolated sandboxes/CI containers). Cycle with Shift+Tab.' },
    { t: 'Sandboxing', d: 'Run bash in a sandbox that restricts filesystem and network; use containers/devcontainers for untrusted repos.' },
    { t: 'Managed settings (enterprise)', d: 'IT deploys a managed-settings.json users cannot override — enforce deny rules, disable bypass mode, pin approved MCP servers.', code: R`# Windows:  C:\Program Files\ClaudeCode\managed-settings.json
# macOS:    /Library/Application Support/ClaudeCode/managed-settings.json
# Linux:    /etc/claude-code/managed-settings.json` },
    { t: 'Checkpoints & rewind', d: 'Every edit is checkpointed; /rewind (or Esc Esc) restores code and/or conversation. Still commit often — checkpoints are not Git.' },
  ] },
  { group: 'Extend & automate', items: [
    { t: 'Hooks', d: 'Deterministic commands on events: PreToolUse (block/allow), PostToolUse (lint/test), UserPromptSubmit, SessionStart, Stop, SubagentStop, PreCompact, Notification.', code: R`{
  "hooks": {
    "PostToolUse": [{
      "matcher": "Edit|Write",
      "hooks": [{ "type": "command", "command": "npm run lint --silent" }]
    }]
  }
}` },
    { t: 'Subagents', d: 'Specialists with their own context, tools and model — reviewer, researcher, test-writer. Defined in .claude/agents/*.md; manage with /agents.', code: R`---
name: security-reviewer
description: Reviews diffs for injection, secrets, authz and unsafe deps
tools: Read, Grep, Glob
---
Review only. Report findings with file:line, severity and fix.` },
    { t: 'Skills', d: 'Reusable instruction packs (.claude/skills/<name>/SKILL.md) loaded automatically when relevant — release notes, migrations, design-system rules.' },
    { t: 'Slash commands', d: 'Built-ins: /init /memory /permissions /hooks /agents /mcp /model /context /compact /cost /review /security-review /rewind. Custom ones in .claude/commands/*.md.' },
    { t: 'Plugins & marketplaces', d: 'Bundle commands, agents, skills, hooks and MCP servers; install with /plugin. Approve marketplaces centrally in enterprises.' },
    { t: 'MCP servers', d: 'Connect databases, browsers, ticketing, internal APIs. Scopes: local, project (.mcp.json, shared), user.', code: R`claude mcp add --transport http jira https://mcp.example.com/jira
claude mcp add db -- npx -y @modelcontextprotocol/server-postgres "postgresql://readonly@db/app"` },
  ] },
  { group: 'Work patterns', items: [
    { t: 'Explore → plan → code → verify', d: 'Ask it to read first, use plan mode for the approach, implement in small steps, then run tests. Review every diff.' },
    { t: 'Context management', d: '/context shows usage; /compact summarises; /clear starts fresh per task. Point to files with @path instead of pasting.' },
    { t: 'Parallel work', d: 'Background tasks and git worktrees let several sessions work on separate branches without collisions.' },
    { t: 'Headless & CI', d: 'claude -p runs non-interactively for CI, scripts and GitHub Actions (PR review, triage).', code: R`claude -p "Review this diff for bugs and missing tests" \
  --output-format json --allowedTools "Read,Grep,Glob"` },
    { t: 'Models & cost', d: 'Pick per task: Haiku 5.5 (fast/cheap), Sonnet 5.5 (default), Opus 5.5 (hardest). /cost and /model; OpenTelemetry for org-wide usage monitoring.' },
    { t: 'Cloud providers', d: 'Run through the Anthropic API, Amazon Bedrock or Google Vertex AI to keep data inside your existing cloud agreements.' },
  ] },
  { group: 'Build your own agents', items: [
    { t: 'Claude Agent SDK', d: 'The Claude Code harness as a library (Python/TypeScript): tools, permissions, hooks, subagents, MCP — for your own production agents.', code: R`pip install claude-agent-sdk
# from claude_agent_sdk import query
# async for msg in query(prompt="Triage open incidents", options=...): print(msg)` },
  ] },
]

// ---------------------------------------------------------------- Claude apps
export const CLAUDE_APPS = [
  { name: 'Claude Cowork', icon: '🤝', what: 'Agentic Claude in the desktop app for knowledge work — give it access to a folder and connectors and it plans and completes multi-step tasks (organising files, drafting documents, research, spreadsheets).', notes: ['Grant the narrowest folder access possible; never your whole drive', 'Keep backups — it can create, move and edit files', 'Documents and web pages can contain prompt injections; review actions', 'Check availability for your plan and region; treat as governed like any agent'], use: 'Back-office automation, report packs, research briefs, file clean-up.' },
  { name: 'Claude apps (web, desktop, mobile)', icon: '💬', what: 'Chat with Projects (shared knowledge + instructions), Artifacts (live documents, code, apps), Research, file analysis, memory, and connectors to tools like Drive, Slack and Jira via MCP.', notes: ['Use Projects for team-wide context and consistent instructions', 'Only connect approved connectors; review scopes', 'Turn on SSO, admin controls and audit logs for Team/Enterprise'], use: 'Team copilots, document analysis, internal Q&A.' },
  { name: 'Claude for design (Artifacts & design work)', icon: '🎨', what: 'Generate and iterate UI mock-ups, interactive prototypes, diagrams and design-system-consistent pages as Artifacts — then hand off to Claude Code for implementation.', notes: ['Feed your design tokens/system so outputs stay on-brand', 'Treat generated prototypes as drafts — accessibility and UX review still required', 'Do not paste confidential customer data into shared artifacts'], use: 'Rapid prototyping, design reviews, front-end hand-off.' },
  { name: 'Claude in your tools', icon: '🧩', what: 'Claude inside the browser, office tools, Slack and IDEs (VS Code, JetBrains) — and via MCP connectors for internal systems.', notes: ['Inventory where Claude is used across the company', 'Apply the same data-classification rules everywhere'], use: 'Assistance where work already happens.' },
  { name: 'Claude API & platform', icon: '🔌', what: 'Messages API with tools, streaming, vision/PDF, prompt caching, batches, files and server-side tools; available on Anthropic, Amazon Bedrock and Google Vertex AI.', notes: ['Use workspaces + API keys per app/environment', 'Set spend limits and rate limits per workspace', 'Log request IDs for traceability'], use: 'Production AI features in your own products.' },
]

// ---------------------------------------------------------------- governance (shared shape)
export const CLAUDE_GOV = [
  { area: 'Data use & retention', points: ['Commercial products (API, Team, Enterprise) are not used to train models by default', 'Zero-data-retention arrangements available for eligible API customers', 'Define what data classes may be sent (public / internal / confidential / restricted)'] },
  { area: 'Identity & access', points: ['SSO (SAML/OIDC) and SCIM provisioning on Team/Enterprise', 'Role-based admin; separate workspaces & API keys per app and environment', 'Rotate keys; store them in a secrets manager, never in code'] },
  { area: 'Claude Code controls', points: ['Managed settings to enforce deny rules and disable bypass mode', 'Approved MCP servers / plugin marketplaces only', 'Hooks for mandatory lint, test and secret scanning', 'OpenTelemetry usage & cost monitoring'] },
  { area: 'Security posture', points: ['Review Anthropic attestations (e.g. SOC 2, ISO 27001, ISO/IEC 42001) on trust.anthropic.com', 'HIPAA-eligible configurations via BAA where applicable', 'Threat-model prompt injection for every tool and connector'] },
  { area: 'Policy & safety', points: ['Anthropic Usage Policy applies to all use', 'Human approval for irreversible or high-impact actions', 'Audit logs + request IDs retained per your record-keeping rules'] },
]

export const OPENAI_GOV = [
  { area: 'Data use & retention', points: ['API and business products (ChatGPT Business/Enterprise/Edu) are not used for training by default', 'Configurable retention and Zero Data Retention for eligible API use', 'Data residency options for eligible enterprise customers'] },
  { area: 'Identity & access', points: ['SSO, SCIM, domain verification, role-based admin console', 'Projects / API keys scoped per team; service accounts for automation', 'Restrict custom GPT sharing and connector use to approved scopes'] },
  { area: 'Codex controls', points: ['Sandbox mode (read-only / workspace-write / full access) and approval policy per repo', 'AGENTS.md for mandatory conventions and test commands', 'Network access off by default in sandboxes; enable only when required', 'Review every Codex PR like a human PR'] },
  { area: 'Security posture', points: ['Review OpenAI attestations (e.g. SOC 2 Type 2) on trust.openai.com', 'Compliance API / audit logs for eDiscovery on Enterprise', 'Threat-model prompt injection for connectors, browsing and agent mode'] },
  { area: 'Policy & safety', points: ['OpenAI usage policies apply', 'Human-in-the-loop for agent actions with real-world impact', 'Moderation and guardrails on user-facing apps'] },
]

// ---------------------------------------------------------------- OpenAI
export const OPENAI_STACK = [
  { name: 'ChatGPT (Business / Enterprise)', icon: '💬', what: 'Workplace assistant: chat, Projects, custom GPTs, file & data analysis, Deep Research, connectors to company apps, and agent mode that can browse and act.', notes: ['Admin console: SSO, SCIM, workspace controls, GPT and connector policies', 'Decide which connectors (Drive, SharePoint, Slack…) are allowed', 'Agent mode can take actions — require confirmation for purchases/sends'], use: 'Knowledge work, research, analysis, team GPTs.' },
  { name: 'Codex (cloud agent)', icon: '☁️', what: 'Software-engineering agent in ChatGPT: runs tasks in isolated cloud sandboxes against your GitHub repo, then proposes changes as pull requests; can also review PRs.', notes: ['Connect only approved repositories', 'Set up the environment (dependencies, test commands) so it can verify its work', 'Every PR goes through normal review and CI'], use: 'Parallel bug fixes, refactors, tests, PR review.' },
  { name: 'Codex CLI & IDE extension', icon: '⌨️', what: 'Open-source local coding agent (terminal) plus IDE extension: reads, edits and runs code in your workspace with sandbox and approval controls; supports MCP.', notes: ['Use AGENTS.md for repo instructions', 'Default to workspace-write sandbox + on-request approvals', 'codex exec for scripted/CI use'], use: 'Local pair-programming agent, scripted automation.' },
  { name: 'OpenAI API platform', icon: '🔌', what: 'Responses API (tools, structured outputs, built-in tools), Agents SDK (handoffs, guardrails, tracing), Realtime API (voice), and AgentKit / Apps SDK for agent and ChatGPT app building.', notes: ['Separate projects and keys per environment', 'Use structured outputs for reliable JSON', 'Trace agent runs; add guardrails for inputs/outputs'], use: 'Production AI features and agents in your own products.' },
]

export const CODEX_SNIPPETS = [
  { t: 'AGENTS.md (repo instructions — like CLAUDE.md)', code: R`# AGENTS.md
- Python 3.12 / FastAPI. Run "pytest -q" before finishing any task.
- Never edit files under infra/prod/.
- Follow the error-handling pattern in app/errors.py.` },
  { t: '~/.codex/config.toml (sandbox + approvals)', code: R`# choose the current Codex model in your workspace
approval_policy = "on-request"      # untrusted | on-request | on-failure | never
sandbox_mode    = "workspace-write" # read-only | workspace-write | danger-full-access

[sandbox_workspace_write]
network_access = false

[mcp_servers.docs]
command = "npx"
args = ["-y", "@modelcontextprotocol/server-filesystem", "./docs"]` },
  { t: 'Non-interactive (CI / scripts)', code: R`codex exec "Add unit tests for app/billing.py and make them pass"
codex --sandbox read-only --ask-for-approval on-request` },
  { t: 'OpenAI Agents SDK (Python)', code: R`from agents import Agent, Runner

triage = Agent(name="Triage", instructions="Classify the ticket and route it.")
result = Runner.run_sync(triage, "My invoice is wrong")
print(result.final_output)` },
]

// ---------------------------------------------------------------- comparison
export const COMPARE = {
  cols: ['Claude Code', 'Claude Cowork', 'ChatGPT', 'Codex'],
  rows: [
    ['Primary job', 'Agentic software engineering in your repo', 'Agentic knowledge work on your files & apps', 'General assistant: chat, research, analysis, GPTs, agent mode', 'Agentic software engineering (cloud sandboxes + local CLI/IDE)'],
    ['Where it runs', 'Terminal, IDEs, desktop, web; local machine or CI', 'Claude desktop app with granted folders/connectors', 'Web, desktop, mobile', 'ChatGPT (cloud tasks), CLI, IDE extension'],
    ['Instructions file', 'CLAUDE.md (+ skills, subagents)', 'Project/folder instructions & skills', 'Custom instructions, Projects, GPTs', 'AGENTS.md'],
    ['Safety controls', 'Permission rules, modes, sandbox, hooks, managed settings', 'Scoped folder access, confirmations', 'Admin console, connector & GPT policies, confirmations', 'Sandbox modes, approval policies, network off by default'],
    ['Extensibility', 'MCP, hooks, plugins, Agent SDK', 'Connectors, skills', 'Connectors, GPT actions, Apps', 'MCP, Agents SDK / AgentKit'],
    ['Best at', 'Deep multi-file changes with local tooling & strict team rules', 'Office/back-office multi-step tasks', 'Broad research & everyday work', 'Parallel, isolated tasks delivered as PRs'],
    ['You stay responsible for', 'Reviewing diffs, tests, security, merges', 'Checking outputs & actions on files', 'Verifying facts, protecting data', 'Reviewing PRs, environment setup, CI'],
  ],
  responsibilities: [
    ['Developer', 'Writes specs and tests, reviews every diff/PR, owns what merges.'],
    ['Tech lead', 'Maintains CLAUDE.md / AGENTS.md, skills, hooks; defines which tasks agents may do.'],
    ['Platform / IT', 'Managed settings, SSO/SCIM, approved MCP servers & connectors, key management, cost monitoring.'],
    ['Security', 'Threat models (prompt injection, data exfiltration), sandbox policy, secret scanning, red-teaming.'],
    ['Risk / compliance', 'Data classification, retention, regulatory mapping, audit evidence.'],
  ],
}

// ---------------------------------------------------------------- real-time implementation
export const REALTIME = [
  { title: 'AI tech stack', icon: '🧱', claude: 'Claude API (or Bedrock/Vertex) as the model layer; prompt caching for long context; batches for offline jobs; Claude Code builds and maintains the services.', openai: 'Responses API with structured outputs and built-in tools; Batch API for offline jobs; Codex builds and maintains the services.', both: ['LLM gateway in front of providers (routing, keys, rate limits, logging)', 'Vector store + reranker for RAG', 'Evals in CI, tracing in prod, cost dashboards'] },
  { title: 'Single AI agent', icon: '🤖', claude: 'Claude tool use or the Claude Agent SDK (permissions, hooks, MCP) for a production agent; MCP servers expose internal systems.', openai: 'Agents SDK (tools, guardrails, tracing) or AgentKit; MCP or function tools for internal systems.', both: ['Typed tools with least privilege', 'Step & cost budgets', 'Human approval for irreversible actions', 'Trace every step'] },
  { title: 'Multi-agent systems', icon: '👥', claude: 'Orchestrator + subagents (Agent SDK) or LangGraph/CrewAI with Claude models; separate contexts per specialist.', openai: 'Agents SDK handoffs between specialist agents, or LangGraph/CrewAI with OpenAI models.', both: ['Supervisor pattern with clear exit criteria', 'Critic/reviewer agent for quality', 'A2A or MCP for cross-system interoperability', 'Measure whether each extra agent improves quality'] },
  { title: 'Engineering workflow', icon: '🛠️', claude: 'Claude Code locally and in CI (claude -p) with hooks for tests/lint; subagents for review; worktrees for parallel tasks.', openai: 'Codex cloud for parallel PRs, Codex CLI locally, Codex PR review in GitHub.', both: ['Agents open PRs, humans approve', 'Branch protection + required checks', 'Secret scanning and SAST on agent changes'] },
  { title: 'Knowledge work', icon: '📂', claude: 'Claude Projects + Cowork for multi-step document and file tasks with scoped folder access.', openai: 'ChatGPT Projects, custom GPTs, Deep Research and agent mode with approved connectors.', both: ['Data classification before upload', 'Approved connectors only', 'Outputs reviewed before external use'] },
]

// ---------------------------------------------------------------- enterprise standards
export const REGULATIONS = [
  { name: 'EU AI Act', scope: 'EU — risk-based obligations for AI systems and general-purpose AI models; phased application from 2025.' },
  { name: 'GDPR / UK GDPR', scope: 'Personal data: lawful basis, minimisation, DPIAs, data-subject rights, cross-border transfers.' },
  { name: 'Singapore PDPA + IM8 / MAS TRM', scope: 'Personal data protection; government ICT security (IM8) for public sector; MAS Technology Risk Management for financial institutions.' },
  { name: 'NIST AI RMF', scope: 'Govern, Map, Measure, Manage — voluntary US framework for AI risk.' },
  { name: 'ISO/IEC 42001', scope: 'AI management system standard — certifiable governance for organisations using AI.' },
  { name: 'ISO/IEC 27001 & SOC 2', scope: 'Information-security management and controls assurance — expected of vendors and of you.' },
  { name: 'HIPAA / sector rules', scope: 'Health data (US) and other sector regulators — use BAA-covered configurations and stricter controls.' },
]

export const ENTERPRISE_CHECKLIST = [
  { phase: 'Before you start', items: ['Approved-tools list (which Claude/OpenAI products, which plans)', 'Data classification: what may be sent to which tool', 'Vendor due diligence: DPA, attestations, data residency, retention', 'Named owner and risk tier for each use case'] },
  { phase: 'Build', items: ['Instructions files in every repo (CLAUDE.md / AGENTS.md)', 'Least-privilege permissions, sandboxes, network off by default', 'Secrets in a vault; deny rules for .env and key files', 'Evals and tests gate every merge', 'Prompt-injection threat model for tools and connectors'] },
  { phase: 'Deploy', items: ['SSO/SCIM, workspaces and keys per environment', 'Gateway with rate limits, logging and PII redaction', 'Human approval for high-impact actions', 'Change management and rollback plan'] },
  { phase: 'Operate', items: ['Monitor quality, latency, cost and incidents', 'Audit logs retained per policy', 'Periodic red-teaming and access reviews', 'Training & certification for users (Associate → Architect)'] },
]
