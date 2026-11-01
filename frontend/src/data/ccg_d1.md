# Domain 1 — Agentic Architecture & Orchestration (27%)
_Compiled from claudecertificationguide.com — independent community resource, not affiliated with Anthropic._

## Overview

Design and implement agentic systems using Claude's API, including loop management, orchestration patterns, guardrails, and the Claude Agent SDK.

## 1.1 — Agentic Loops

**Source:** https://claudecertificationguide.com/learn/1-agentic-architecture/1-1-agentic-loops

### What You Need to Know

- Agentic loop = core execution cycle of every Claude agent; deterministic control flow defined in code (not a prompt trick, retry loop, or chatbot turn).
- Lifecycle: (1) send request via Messages API with conversation history (system prompt, prior messages, previous tool results); (2) inspect `stop_reason` — authoritative: `"tool_use"` → continue, `"end_turn"` → terminate; (3) on `tool_use`, execute tool(s), append tool results to conversation history as a new message, resend; (4) on `end_turn`, present final response.
- Tool results MUST be appended to history — otherwise Claude never sees tool output and has nothing new to act on.
- `stop_reason` is the ONLY reliable loop-control signal (deterministic, unambiguous). Never use natural-language parsing, text-content checks, or iteration caps as primary termination.
- Other live API values: `pause_turn` (continue long-running server-tool turn), `max_tokens`, `stop_sequence`, `refusal` (models can decline on a normal 200), `model_context_window_exceeded` (handle like `max_tokens` truncation). Anything except `end_turn` = "not finished, check why."
- **Model-driven decision-making:** Claude picks the tool from context, vs pre-configured decision trees / fixed tool sequences (hard-coded). Exam favours model-driven; exception: deterministic compliance (financial, security, regulatory) → programmatic enforcement (Task 1.4).
- Anti-patterns: (1) parsing natural language ("I'm done"/"task complete") — ambiguous; (2) arbitrary iteration caps as primary stop — OK only as safety net; (3) `response.content[0].type == "text"` for completion — text appears alongside `tool_use` blocks.
- Premature-termination bug: text + `lookup_order` `tool_use` in one response; code sees text at [0] and stops. Fix: check `stop_reason`. Caps fix runaway loops, NOT premature exits.

### Exam Traps

- Using `response.content[0].type == 'text'` to determine loop completion — text can appear alongside `tool_use` blocks; `stop_reason` is authoritative.
- Setting arbitrary iteration caps (e.g., 'stop after 10 loops') as the primary stopping mechanism — safety net only.
- Parsing natural language phrases like 'I'm done' or 'task complete' to decide loop termination.
- Forcing `tool_choice` to 'any' to prevent text output — forces tool use when genuinely finished → infinite loop.

### Practice Scenario

A developer's agent sometimes terminates prematurely when Claude returns text alongside a tool call. Their loop checks `response.content[0].type == 'text'` to determine if the agent is finished. Users report incomplete responses on complex queries. What should the developer change?

- A) Add an iteration cap of 15 loops to ensure the agent runs long enough for complex queries
- B) Check the `stop_reason` field instead of content type — continue when `stop_reason` is `tool_use`, terminate when `end_turn`
- C) Set `tool_choice` to `any` so Claude always calls a tool instead of returning text
- D) Parse the assistant text for completion phrases like "I have finished" before terminating the loop

### Build Exercise

**Learn:** loop lifecycle; `stop_reason` authority; `tool_use`/`end_turn` handling; appending tool results; iteration caps. **Steps (45 min):** calculator (`expression`) + web-search stub (`query`) tools with JSON Schema `input_schema`; loop via `client.messages.create()` checking `response.stop_reason`; on `tool_use` run the function and append assistant response + user message with `tool_result`; on `end_turn` exit; test sequential calls → ≥2 iterations before `end_turn`; safety cap of 20 (`MAX_ITERATIONS`) as maximum bound only.

### Sources

- [Claude Agent SDK Overview](https://platform.claude.com/docs/en/agent-sdk/overview) — Anthropic
- [Messages API Reference](https://docs.anthropic.com/en/api/messages) — Anthropic
- [Building with Claude API (Skilljar)](https://anthropic.skilljar.com/claude-with-the-anthropic-api) — Anthropic

## 1.2 — Multi-Agent Orchestration

**Source:** https://claudecertificationguide.com/learn/1-agentic-architecture/1-2-orchestration-patterns

### What You Need to Know

- Exam tests one pattern: **hub-and-spoke**, coordinator at the centre. **Coordinator:** receives task, decomposes it, selects subagents, passes context, aggregates results, handles errors, routes info. **Subagents (spokes):** specialised roles (web search, document analysis, synthesis, report generation).
- **Cardinal rule:** ALL communication flows through the coordinator; subagents never talk directly (current Claude Code allows nested parent-child delegation — an exam simplification; treat direct subagent communication as wrong).
- Centralisation gives: (1) observability; (2) consistent error handling; (3) controlled information flow.
- **Isolation principle:** subagents do NOT inherit the coordinator's conversation history — only what the coordinator explicitly includes (no system prompt unless included, no prior messages, no other subagents' results, no shared memory/global state). No shared memory between invocations. There is no shared store; everything must be in the prompt.
- **Coordinator responsibilities:** (1) dynamic subagent selection — not every query routes through the full pipeline; (2) research scope partitioning — distinct subtopics/sources per agent (academic papers vs news); (3) iterative refinement loops — evaluate synthesis for gaps, re-delegate with targeted queries until coverage sufficient; (4) centralised communication routing.
- **Narrow decomposition failure (Q7):** coordinator decomposes "impact of AI on creative industries" into only visual-arts subtopics → music/writing/film never researched. Root cause = coordinator's decomposition, not downstream agents. Incomplete in **scope** (not depth) → coordinator decomposition is almost always the cause. Trace failures to origin.

### Exam Traps

- Blaming downstream subagents for coverage gaps when the coordinator's task decomposition was too narrow.
- Assuming subagents share memory or inherit the coordinator's conversation history — isolated context; everything must be explicitly passed.
- Proposing direct inter-subagent communication as an efficiency improvement — breaks observability, error handling, and information flow control.
- Adding more subagents to fix a decomposition problem — they receive equally narrow assignments; fix the coordinator's decomposition logic.

### Practice Scenario

A multi-agent research system produces a report on 'renewable energy technologies' that only covers solar and wind power. Each subagent produced thorough, well-sourced coverage of its assigned topic. The web search subagent returned relevant results for every query it received. The synthesis subagent accurately combined all research it was given. What is the most likely root cause of the coverage gap?

- A) The document analysis subagent had no access to sources covering the other renewable energy types, so those sections were never written
- B) The synthesis subagent failed to identify gaps in the research it received and request additional coverage of the missing technology categories from the coordinator
- C) The web search subagent used queries that were too narrow, so geothermal, tidal, and biomass sources never appeared in its results
- D) The coordinator decomposed the topic into only solar and wind subtopics, never assigning geothermal, tidal, biomass, or fusion to any subagent

### Build Exercise

**Learn:** hub-and-spoke centralisation; explicit context passing under isolation; broad decomposition; iterative refinement; failure tracing to coordinator. **Steps (60 min):** coordinator with orchestrating-role system prompt; decomposition producing ≥5 subtopics covering full breadth (renewable energy: solar, wind, geothermal, tidal, biomass, fusion minimum); spawn web-search + document-analysis subagents with all context explicit in their prompts; aggregate + coverage assessment (well/partial/missing); iterative refinement — detect gaps, targeted follow-up queries, re-evaluate until threshold/max iterations; test 'renewable energy technologies' → all six types covered.

### Sources

- [Claude Agent SDK Overview](https://platform.claude.com/docs/en/agent-sdk/overview) — Anthropic
- [Multi-Agent Research System Scenario (Skilljar)](https://anthropic.skilljar.com/claude-with-the-anthropic-api) — Anthropic
- [Building with Claude API (Skilljar)](https://anthropic.skilljar.com/claude-with-the-anthropic-api) — Anthropic

## 1.3 — Subagent Invocation and Context Passing

**Source:** https://claudecertificationguide.com/learn/1-agentic-architecture/1-3-subagent-invocation-context

### What You Need to Know

- **Task tool** spawns subagents (exam guide v0.2 name). Current Claude Code (v2.1.63, June 2026) renamed it `Agent`; `Task` still works as alias; Agent SDK emits `Agent` in tool-use blocks. Answer "Task tool" on the exam.
- **Hard requirement:** coordinator's `allowedTools` must include `"Task"` (or `"Agent"`) — a binary gate; without it the coordinator cannot spawn any subagent.
- Subagent = **AgentDefinition**: (1) Description (what it does); (2) System prompt (instructions); (3) Tool restrictions (role-scoped).
- **Context-passing rules:** (1) include COMPLETE findings from prior agents in full in the synthesis prompt — it can't "look up" prior results; (2) use structured formats separating content from metadata — content (claim/fact/analysis) + metadata (source URL, document name, page number); content without metadata → downstream agent can't attribute claims. Root cause of unsourced claims = coordinator passed content without structured metadata; (3) design coordinator prompts specifying goals, not procedures — what to achieve + quality criteria, not step-by-step; goal-oriented prompts enable adaptability.
- Structured metadata example:
  ```json
  {
    "findings": [{
      "claim": "Solar panel efficiency has increased 25% in the last decade",
      "source_url": "https://example.com/solar-report",
      "document_name": "Annual Solar Industry Report 2024",
      "page_number": 14,
      "confidence": "high",
      "retrieved_by": "web_search_agent"
    }]
  }
  ```
- **Parallel spawning:** for independent tasks emit multiple Task tool calls in a single coordinator response (not one per turn) — sequential adds latency. Correct answers mention "in a single response"/"simultaneously".
- **`fork_session`:** independent branches from a shared analysis baseline; branches don't see each other's results, changes don't cross over. Use for divergent exploration (comparing testing strategies). ≠ `--resume` (resume continues a named session; fork creates a new branch).

### Exam Traps

- Assuming subagents automatically access the coordinator's conversation history or other subagents' outputs — isolated context, no automatic inheritance.
- Blaming the synthesis agent for missing citations when the issue is context passing without metadata.
- Proposing sequential subagent invocation for independent tasks — spawn in parallel instead.
- Confusing `fork_session` with `--resume` — fork for divergent exploration, resume for continuing a named session.

### Practice Scenario

A synthesis agent produces a report where several claims have no source attribution. The web search subagent correctly returns results with URLs, titles, and snippets. The document analysis subagent correctly returns analysis with page references. Both subagents are verified to be working properly. What is the most likely root cause?

- A) The synthesis agent should be given direct access to the web search tool so it can re-run the queries and verify sources itself
- B) The coordinator passes content to the synthesis agent without structured metadata — source URLs, document names, and page numbers are not included
- C) The synthesis agent system prompt lacks explicit instructions to cite sources, so it summarises the research without carrying any attribution into the report
- D) The web search subagent returns results in a format the synthesis agent cannot parse, so URLs and titles are dropped during synthesis

### Build Exercise

**Learn:** why `allowedTools` needs `Task`/`Agent`; structured metadata separating content from attribution; context-passing failure → attribution errors; parallel spawning; `fork_session` vs parallel Task. **Steps (50 min):** coordinator with `Task`/`Agent` in `allowedTools`, subagents under `options.agents`; web-search (search tools only) + document-analysis (file-reading tools only) subagents (description/system prompt/tool restrictions); `Finding` type: content (`claim`, `analysis`) + metadata (`source_url`, `document_name`, `page_number`, `confidence`, `retrieved_by`); pass complete findings array with all metadata to synthesis — never strip; verify every claim cites URL + page number; refactor to parallel spawning.

### Sources

- [Claude Agent SDK Overview](https://platform.claude.com/docs/en/agent-sdk/overview) — Anthropic
- [MCP Specification](https://github.com/modelcontextprotocol) — Anthropic / MCP
- [Building with Claude API (Skilljar)](https://anthropic.skilljar.com/claude-with-the-anthropic-api) — Anthropic

## 1.4 — Workflow Enforcement and Handoff

**Source:** https://claudecertificationguide.com/learn/1-agentic-architecture/1-4-workflow-enforcement-handoff

### What You Need to Know

- **Prompt-based guidance** = system-prompt instructions (e.g., "Always verify the customer's identity before processing a refund"); works ~90-95% but non-zero failure rate (probabilistic). OK for low-stakes.
- **Programmatic enforcement** = hooks, prerequisite gates, or code-level checks physically blocking downstream tools until prerequisites complete (e.g., `process_refund` blocked until `get_customer` returns a verified customer ID); deterministic.
- **Decision rule:** a single failure causing financial loss, security breach, or compliance violation → programmatic. Financial (refunds/transfers/payments), security (identity verification/access control), compliance (AML/regulatory) → programmatic. Low-stakes (formatting/style/output ordering) → prompts acceptable. Enhanced prompts/few-shots improve accuracy but give NO deterministic guarantee.
- **Prerequisite gate:** session check — has `get_customer` returned a verified customer ID? If no, `process_refund` returns "Cannot process refund — customer identity not verified. Please call get_customer first." Gate is code; model can't bypass by skipping.
- **Subagent lifecycle hooks:** `SubagentStart` fires when a subagent is spawned via Task/Agent tool — observational (receives type + id; can log/inject context, cannot block/modify). To enforce on spawning (rate limits, required context), attach PreToolUse to the Agent tool (can deny/rewrite before start).
- `SubagentStop` fires when a subagent finishes — receives id + final message; can validate + log. On failed validation returns `decision: "block"` + reason → subagent keeps working. Does NOT transform output; to reshape/redact for the coordinator, use PostToolUse on the Agent tool call, whose `updatedToolOutput` field replaces the tool result before the model reads it.
- **Subagent-scoped hooks:** subagents can define own PreToolUse/PostToolUse hooks in AgentDefinition frontmatter, scoped to that subagent only (e.g., billing subagent blocks refunds above a threshold). **Stop hooks** in subagent frontmatter auto-convert to SubagentStop events at runtime.
- **Multi-concern requests** (return + address update + loyalty points): decompose into distinct items, investigate each in parallel using shared context, synthesise a unified resolution in one response. Wrong: sequential separate conversations or addressing only the first item.
- **Structured handoff:** human agents do NOT get the transcript. Summary must include: Customer ID, conversation summary, root cause analysis, refund amount (specific figure), recommended action.
- **8% failure example:** prompt works 92%, fails 8% (refunds on wrong accounts). Fix = programmatic prerequisite gate — eliminates failure by physically preventing wrong execution order.

### Exam Traps

- Enhanced system prompt instructions as the fix for high-stakes compliance failures — a stronger prompt may reduce failures to 3-4% but never to 0%.
- Few-shot examples as sufficient for guaranteed compliance — still probabilistic.
- Routing classifiers to fix per-agent compliance issues — failure occurs within the agent execution sequence, not at routing level.
- Handoff summaries omitting critical fields (customer ID, recommended action) — summary must be self-contained with all five fields.

### Practice Scenario

Production data reveals that in 8% of cases, a customer support agent processes refunds without verifying account ownership, occasionally leading to refunds on wrong accounts. The system prompt clearly states 'always verify customer identity before processing refunds.' What is the most appropriate fix?

- A) Add few-shot examples demonstrating the correct verification-then-refund workflow sequence
- B) Implement a programmatic prerequisite gate that blocks `process_refund` until `get_customer` has returned a verified customer ID
- C) Add stronger instructions to the system prompt emphasising the critical importance of verification before any refund processing
- D) Implement a routing classifier that sends all refund requests to a specialised verification-first pipeline

### Build Exercise

**Learn:** programmatic over prompt-based enforcement for financial ops; prerequisite gates; 8% prompt vs 0% gate failure; structured handoffs; multi-concern handling. **Steps (60 min):** tools `get_customer`, `lookup_order`, `process_refund`; gate blocking `process_refund` unless `get_customer` returned a verified ID (test a bypass attempt); handoff function producing all five fields populated; test multi-concern request (return + billing dispute + account update) → decompose, investigate each, complete self-contained handoff covering all three.

### Sources

- [Claude Agent SDK Overview](https://platform.claude.com/docs/en/agent-sdk/overview) — Anthropic
- [Customer Support Resolution Agent Scenario (Skilljar)](https://anthropic.skilljar.com/claude-with-the-anthropic-api) — Anthropic
- [Building with Claude API (Skilljar)](https://anthropic.skilljar.com/claude-with-the-anthropic-api) — Anthropic

## 1.5 — Agent SDK Hooks

**Source:** https://claudecertificationguide.com/learn/1-agentic-architecture/1-5-agent-sdk-hooks

### What You Need to Know

- Hooks inject deterministic behaviour into a probabilistic system; they intercept tool calls/results at the model↔world boundary. Hooks implement 1.4's programmatic side.
- **PostToolUse hooks:** run AFTER a tool executes, BEFORE the model processes the result — transform results (data normalisation).
- **PreToolUse hooks** (tool-call interception): run BEFORE a tool executes — can block, modify, or redirect; tool never runs if blocked (policy enforcement).
- **PostToolUse = data normalisation:** Unix timestamps (`1710489600`) → ISO 8601 (`"2024-03-15T12:00:00Z"`); numeric status codes (`200/404/500`) → human-readable strings; currency → consistent decimal + currency code; regional date strings → one standard format.
- **PreToolUse = policy enforcement:** refund threshold — block `process_refund` > $500, redirect to human escalation; compliance gate — block `transfer_funds` until AML check done for session; manager approval — intercept `approve_discount` above 20%, route to approval queue, execute only after approval.
- **Decision framework:** must be followed 100% → Hooks (deterministic); occasional deviation acceptable → Prompts (probabilistic). Money or legal risk from a single failure → hook. Formatting/style preference → prompt.
- Side-by-side: AML on international transfers — prompt 95% (5% skip = regulatory violation); PreToolUse hook blocking `transfer_funds` until `aml_check` passes = 100%. Markdown formatting — prompt fine, hook unnecessary overhead. Refunds > $500 — hook blocks/routes to escalation, 100%.
- **Data-format chaos:** `get_customer` (Unix timestamps, numeric codes), `lookup_order` (ISO 8601, English strings), `check_shipping` ("DD/MM/YYYY", single-char codes "S"/"P" — "P" may be misread as "processed" vs "pending"). PostToolUse normalises all dates → ISO 8601, all statuses → readable strings.

### Exam Traps

- Using PostToolUse hooks to block policy-violating actions — they run after execution; the action already happened. Use PreToolUse.
- Enhanced prompt instructions as the solution for 100% compliance requirements — only hooks are deterministic.
- Suggesting model-side data transformation instead of PostToolUse hooks for normalisation — model-side introduces inconsistency.
- Confusing hook direction — PostToolUse after execution, PreToolUse before; wrong direction means missing the prevention opportunity or blocking completed work.

### Practice Scenario

An agent occasionally processes international transfers without required compliance checks. The compliance team requires 100% enforcement of anti-money laundering (AML) checks before any international transfer is executed. The current system uses prompt instructions that work approximately 95% of the time. What is the correct approach?

- A) Implement a PreToolUse hook that blocks the `transfer_funds` tool from executing until `aml_check` returns a verified pass result
- B) Add detailed AML check instructions to the system prompt with examples of correct behaviour and explicit warnings about penalties for non-compliance
- C) Add a PostToolUse hook that flags completed transfers that skipped AML checks for manual review
- D) Train the agent with few-shot examples demonstrating the correct AML verification workflow before every transfer

### Build Exercise

**Learn:** PostToolUse (after, normalise) vs PreToolUse (before, policy); hooks vs prompts determinism; normalising heterogeneous MCP data; threshold/prerequisite enforcement; hooks for 100%, prompts for preferences. **Steps (60 min):** three tools with distinct formats (epoch seconds/numeric codes, ISO/English statuses, DD/MM/YYYY/single chars); PostToolUse hook normalising dates to ISO 8601 + statuses to English; PreToolUse hook blocking `process_refund` > $500 with escalation redirect; second PreToolUse hook blocking `transfer_funds` until `aml_check` passed in session; test blocked operations never execute; after prerequisites they succeed.

### Sources

- [Claude Agent SDK Overview](https://platform.claude.com/docs/en/agent-sdk/overview) — Anthropic
- [Claude Agent SDK Hooks Documentation](https://platform.claude.com/docs/en/agent-sdk/hooks) — Anthropic
- [Building with Claude API (Skilljar)](https://anthropic.skilljar.com/claude-with-the-anthropic-api) — Anthropic

## 1.6 — Task Decomposition Strategies

**Source:** https://claudecertificationguide.com/learn/1-agentic-architecture/1-6-task-decomposition

### What You Need to Know

- Exam tests two decomposition patterns + one failure mode (attention dilution from decomposition too shallow).
- **Pattern 1: Fixed Sequential Pipelines (Prompt Chaining).** Predetermined steps in order; each step takes the previous output as input; sequence never changes based on intermediate results. Code-review example: (1) per-file local pass (style, bugs, complexity); (2) cross-file integration pass (data flow, API consistency, import chains); (3) unified review report.
- Best for: predictable structured tasks with known steps (code reviews, document processing, data extraction pipelines, compliance checks). Advantages: consistent, reliable, easy to debug/monitor. Limitation: cannot adapt to unexpected findings.
- **Pattern 2: Dynamic Adaptive Decomposition.** Subtasks generated from what's discovered at each step; plan evolves. Legacy-tests example: map structure → identify high-impact areas (most-used, most bugs, untested critical paths) → prioritised plan → discover Module A depends on untested Module B → reprioritise (test B first) → keep adapting.
- Best for: open-ended investigation, unknown scope (legacy exploration, security audits, research, debugging unfamiliar codebases). Advantages: adapts, responds to unexpected complexity, more thorough. Limitations: less predictable, harder to estimate time/resources/debug.
- **Selection matrix:**
  | Task | Pattern | Reasoning |
  |---|---|---|
  | Steps known in advance, structured input | Fixed pipeline | Consistency/reliability outweigh adaptability |
  | Open-ended, unknown scope | Dynamic | Adaptability essential |
  | Multi-file code review | Fixed pipeline | Per-file + cross-file is predictable |
  | Legacy codebase exploration | Dynamic | Dependencies/issues emerge during investigation |
  | Document extraction | Fixed pipeline | Fields/format predetermined |
  | Debugging an unfamiliar system | Dynamic | Root cause unknown; investigation must adapt |
- **Attention dilution:** too many items in one pass → inconsistent depth (thorough on some, misses obvious issues). Symptoms: detailed feedback for early files, shallow later; a pattern flagged in one file while identical code approved elsewhere; obvious bugs missed while minor style issues caught. Why: attention per item decreases with too many items.
- Fix: **multi-pass architecture** — (1) per-item local analysis passes (each file gets full attention budget); (2) cross-item integration pass (data-flow issues, inconsistent pattern usage, cross-file dependencies).
- **14-file review example:** files 1-5 detailed; 6-9 moderate; 10-14 superficial (misses null pointer bugs, SQL injection); `forEach` flagged in File 3, identical code in File 11 uncommented. Fix is structural (14 per-file passes + 1 integration pass), NOT a better model, larger context window, or stronger prompt.

### Exam Traps

- Suggesting a more powerful model or larger context window as the fix for attention dilution — it's architectural, not a capability problem.
- Proposing a single-pass review with better prompts as equivalent to multi-pass — prompts don't solve attention allocation.
- Applying fixed pipelines to open-ended investigation tasks — they can't respond to unexpected findings.
- Batching files into groups without a cross-file integration pass — misses cross-batch issues.

### Practice Scenario

A code review agent processes 14 files and produces detailed feedback for the first 5 files but misses obvious bugs in files 10-14. It also flags a `forEach` loop as inefficient in one file while approving identical code in another. What is the root cause and the most appropriate solution?

- A) Reduce the number of files per review to 5 and process in sequential batches of 5 files each
- B) The model context window is too small to hold all 14 files — upgrade to a model with a larger context window
- C) Add a stronger system prompt emphasising the importance of reviewing all files with equal thoroughness
- D) Split the review into per-file local analysis passes plus a separate cross-file integration pass to avoid attention dilution

### Build Exercise

**Learn:** attention dilution and inconsistent depth; multi-pass (per-item + cross-item) architecture; fixed vs dynamic decomposition; why batching without integration pass misses cross-cutting issues; dilution artefacts. **Steps (60 min):** review agent reading ≥10 source files; single-pass baseline — expect shallow later files, contradictory pattern evaluation; per-file passes with structured feedback (bug count, severity, line references) — consistent depth; cross-file integration pass (data flow, API consistency, pattern usage); compare — multi-pass finds more issues, cross-file issues only integration pass catches; document cases where single-pass judged identical code differently.

### Sources

- [Claude Agent SDK Overview](https://platform.claude.com/docs/en/agent-sdk/overview) — Anthropic
- [Claude Code in Action (Skilljar)](https://anthropic.skilljar.com/claude-code-in-action) — Anthropic
- [Anthropic Prompt Engineering Guide](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview) — Anthropic

## 1.7 — Session State and Resumption

**Source:** https://claudecertificationguide.com/learn/1-agentic-architecture/1-7-session-state-resumption

### What You Need to Know

- Session management = how an agent maintains continuity across sessions. Long-running context accumulates tool results, file analyses, reasoning chains.
- **Three options:**
  1. **`--resume <session-name>`** — continues a named session; entire history (tool results, analyses, reasoning) restored. Use when prior context mostly valid, files unchanged. NOT when files modified → stale context.
  2. **`fork_session`** — independent branch from a shared analysis baseline; branches don't see each other's results, changes don't cross over. Use for divergent exploration (comparing refactoring strategies). NOT for continuing the same line.
  3. **Fresh start with summary injection** — new session + structured summary of prior findings in initial context; no stale tool results, only curated summary. Use when tool results are stale (files changed, APIs updated, dependencies shifted), context degraded (too many irrelevant tool results), or a clean baseline with preserved knowledge is needed. NOT when prior context is valid (resume more efficient).
- **How sessions get names (current CLI):** `--resume` never creates a session — accepts a session ID/name or opens an interactive picker. Name at start with `--name`/`-n` (or mid-session `/rename`); continue with `claude --resume <name>`. `-c`/`--continue` resumes the most recent conversation in the current directory without naming.
- **Stale context problem (central):** resuming after code modifications → agent reasons from cached tool results that no longer reflect file state. Resume restores the entire history including every old tool result; if a file was read then modified, old contents remain in context → contradictions.
- **Naive fix (insufficient):** resume and ask the agent to re-read modified files — stale results remain in history and can still be referenced, especially for tangential decisions.
- **Correct fix:** fresh session + structured summary; specify which files changed for targeted re-analysis. No stale results; summary preserves knowledge without outdated data.
- **Targeted re-analysis vs full re-exploration:** don't re-read 50 files because 3 changed. Process: (1) fresh session; (2) inject summary ("Prior analysis found X, Y, Z. These 3 files have been modified since: auth.ts, database.ts, api-routes.ts."); (3) re-read/re-analyse only the 3 files; (4) combine fresh analysis of changed files with preserved summary of unchanged files.
- **Decision matrix:** continue work, no changes → `--resume`; compare two refactorings → `fork_session`; resume after modifying 3 of 50 files → fresh + summary; long cluttered session → fresh + summary; testing vs documentation strategy → `fork_session`; resume after dependency updates → fresh + summary (files may have changed indirectly).
- **Contradictory-advice bug example:** Day 1 finds 3 auth issues (`auth.ts`, `session.ts`, `middleware.ts`); fixed overnight; Day 2 resume → recommends already-fixed fixes, contradicts itself on auth.ts. Fix: fresh session + summary ("Prior analysis identified three authentication issues in auth.ts, session.ts, middleware.ts. All three have been fixed. Please re-analyse these three files to verify the fixes and check for any new issues.").

### Exam Traps

- Suggesting full re-exploration of a 50-file codebase when only 3 files changed — wasteful; specify the 3 files for targeted re-analysis.
- Recommending `--resume` after files have been modified — stale tool results cause contradictions; fresh start + summary preferred.
- Confusing `fork_session` with `--resume` — fork for divergence, resume for continuation.
- Using `fork_session` to handle stale context after file changes — the fork inherits the stale context; fresh start + summary is correct.

### Practice Scenario

A developer resumes a Claude Code session after modifying 3 files in a 50-file codebase. The agent gives contradictory advice about the modified files — recommending changes that were already made and referencing code that no longer exists. What is the most appropriate approach?

- A) Resume the existing session and ask the agent to re-read the 3 modified files, keeping the rest of the conversation history available for continuity
- B) Start a completely new session with no carried-over context and re-analyse the entire 50-file codebase from scratch before continuing the work
- C) Start a fresh session with an injected summary of prior findings and inform the agent about the specific 3 file changes for targeted re-analysis
- D) Use `fork_session` to branch the existing session so the file changes can be incorporated in a separate line of work

### Build Exercise

**Learn:** the three session options; stale context from resuming after changes; structured summary injection; targeted vs full re-analysis; fork vs resume. **Steps (45 min):** named session analysing a 10-file codebase with `--name`; record findings as a structured summary (conclusions, not raw tool output); modify 3 files; resume with `--resume` and observe stale context (contradictory advice); start a fresh session with injected summary + 3 changed files for targeted re-analysis; compare — resume gives contradictory/outdated advice, fresh start gives accurate consistent analysis.

### Sources

- [Claude Code Documentation](https://code.claude.com/docs/en) — Anthropic
- [Claude Code in Action (Skilljar)](https://anthropic.skilljar.com/claude-code-in-action) — Anthropic
- [Claude Agent SDK Overview](https://platform.claude.com/docs/en/agent-sdk/overview) — Anthropic
