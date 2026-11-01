# Quick Reference & Glossary (CCAR-F)

_Compiled from claudecertificationguide.com — independent community resource, not affiliated with Anthropic._

## Quick Reference

### Domain 1 — Agentic Architecture & Orchestration (27%)

**The Agentic Loop** — `Send request → Inspect stop_reason → Execute tools or terminate`.
- `stop_reason: "tool_use"` → call tools, continue. `stop_reason: "end_turn"` → finished, terminate.
- Tool results must be appended to conversation history before the next iteration.
- `stop_reason` is the **only** reliable termination signal — deterministic, unambiguous.
- Anti-patterns: parsing natural language ("I'm done" — ambiguous); iteration caps as primary control; checking `content[0].type == "text"` (text can appear alongside `tool_use` blocks). Iteration caps OK **only as a safety net** against runaway agents.

**Orchestration Patterns** — Sequential: steps depend on previous output (A→B→C). Parallel: independent subtasks, latency matters (fan-out/fan-in, no shared state). Pipeline: stages with different specialisations (output feeds next). Dynamic Adaptive: complexity unknown upfront (model decides decomposition at runtime). Hub-and-Spoke: coordinator + specialist. **Decision rule:** parallel when independent; sequential when each step needs the previous result; dynamic adaptive when decomposition is unpredictable at design time.

**Guardrails Hierarchy** — **Prompts are probabilistic. Hooks are deterministic.** Most tested concept.
- System prompt rules: probabilistic, may not comply → style guidance, soft preferences.
- `PreToolUse` hooks: deterministic, pre-execution → block dangerous calls, validate parameters.
- `PostToolUse` hooks: deterministic, post-execution → validate outputs, sanitise, audit logging.
- Both programmatic — cannot be bypassed by prompt injection. "Must always"/"guaranteed" → hooks, not prompts.

**Claude Agent SDK** — **AgentDefinition**: description, system prompt, `tools` field scoping subagent access; max **4–5 tools per agent**. **Task tool**: coordinator delegates to a subagent; `allowedTools` must include `"Task"` (or `"Agent"`, its current Claude Code name) or it cannot spawn subagents; subagent runs in its own context. **Handoffs**: transfer control; receiver does not inherit sender's history. **Subagents do not share memory** — all context passed explicitly via task definitions or handoff payloads.

**Multi-Agent Systems (Coordinator + Specialist)** — Coordinator: decomposition, sequencing, aggregation. Specialists: single domain, 4–5 tools each. Why specialists over one large agent: focused tool sets reduce selection errors; smaller context windows improve accuracy; independent scaling/testing. Fixed decomposition for predictable tasks; dynamic for open-ended exploration.

**Human-in-the-Loop** — Structured handoff: (1) **Customer ID**; (2) **Summary** (factual, not interpretive); (3) **Root cause**; (4) **Recommended action**. Escalate on: confidence below threshold, policy exceptions, destructive operations, unresolvable ambiguous intent. **Never silently fail** — produce structured handoff, not a generic error.

**Error Recovery** — `fork_session`: divergent exploration without polluting main context. Fresh start + summary injection: stale/polluted context. Retry with error feedback: transient failure — original + failed output + specific error. Graceful degradation: partial results with metadata. Stale-context signals: repeats itself, contradicts earlier statements, ignores recent tool results; fix is a fresh start with curated summary.

**Decision Rules** — "guaranteed/must always/enforce" → hooks. "flexibility/adapt" → model-driven. "independent subtasks" → parallel. "each step needs previous output" → sequential. "premature termination" → check `stop_reason`. "runaway agent" → iteration cap as safety net. "share context between agents" → explicit passing. "complex, unknown structure" → dynamic adaptive. "compliance/audit" → hooks, not model judgment.

**Traps** — iteration cap doesn't fix premature termination (fix `stop_reason`); subagents can't read coordinator context; prompts don't guarantee compliance (hooks do); one agent with many tools (4–5 max); caps aren't primary loop control (`stop_reason` is); text doesn't mean done (can accompany `tool_use`).

### Domain 2 — Tool Design & MCP Integration (18%)

**Tool Description Design** — Descriptions are the **primary mechanism** Claude uses to select tools — matter more than names. Include: what it does (one sentence); expected input formats/constraints; what it returns; boundary conditions (what it does NOT do); example queries that trigger it. **Optimisation sequence:** descriptions first → few-shot examples → consolidate tools; don't start by reducing count.

**Schema Design Rules** — 4–5 tools per agent max. Descriptive parameter names (`customer_email` not `email`). `required` only when truly mandatory; optional + defaults reduce friction. `enum` for constrained choices. Expand descriptions before consolidating tools — first fix for misselection is a better description.

**`tool_choice` Modes** — `auto`: model decides — default for agentic loops. `any`: must call at least one (chooses which) — guarantees structured output when input could match one of several schemas. `tool` (forced): must call a specific named tool — guaranteed schema compliance for one known structure. `tool_choice: { type: "tool", name: "extract_data" }` for one structure every time; `tool_choice: "any"` when document type is unknown but several schemas apply.

**MCP Architecture** — Host ⊃ Client ↔ Server. Client: connects to servers, routes tool calls (Claude Desktop, IDE extension). Host: app managing client lifecycle. Server: exposes tools, resources, prompts (DB connector, filesystem server). Protocol: JSON-RPC 2.0 over stdio or streamable HTTP. Config: `.mcp.json` in project root = project-level (shared); `~/.claude.json` = personal/global (not committed). Use community servers first.

**Tool Error Handling** — Structured error metadata:
```json
{
  "errorCategory": "transient" | "validation" | "business" | "permission",
  "isRetryable": true | false,
  "description": "Rate limit hit; retry after 5 seconds"
}
```
- **transient** (timeouts, unavailability) → retry as-is. **validation** (invalid input) → fix, then retry. **business** (policy violations) → do not retry. **permission** (missing access) → escalate.
- "Not found" deliberately absent — an empty query result is valid, not an error.
- **Access failure** (auth, timeout) → retry or escalate. **Valid empty result** (0 results) → accept; absence of data IS the answer. Never swallow an access failure; never treat a valid empty result as an error.

**Tool Selection in Claude Code** — Grep: content search by pattern. Glob: find files by name/path. Read: read a known file. Edit: modify file contents. Bash: shell commands (build, test, git, everything else). **Use the most specific tool** — avoid Bash where specialised tools fit.

**Decision Rules** — "keeps picking the wrong tool" → improve descriptions first. "guaranteed structured output" → forced `tool_choice` (one schema) / `any` (multiple schemas). "model decides which tool" → `auto`. "must call a tool, can choose" → `any`. "search returned no results" → valid empty, accept. "401/timeout" → access failure, retry/escalate. "too many tools" → 4–5 per agent + better descriptions. "need custom MCP server" → check community first. "project-wide MCP" → `.mcp.json`. "personal MCP" → `~/.claude.json`.

**Traps** — "reduce tools to fix misselection" → improve descriptions first. "`any` guarantees a specific tool" → forces *a* tool, not a *specific* one. "MCP servers connect directly" → all traffic via client/host. "empty results = tool failed" → valid result. "generic error strings" → structured metadata. "build custom server for common integrations" → check community first. "tool name is primary signal" → description is primary.

### Domain 3 — Claude Code Configuration & Workflows (20%)

**Configuration Hierarchy** — CLAUDE.md files are **concatenated into context, not overridden**. Load order (broadest → most specific): (1) `~/.claude/CLAUDE.md` — user-global, not committed; (2) `.claude/CLAUDE.md` (project root) — project-wide, committed; (3) `CLAUDE.md` (any directory) — directory and below, committed; (4) `.claude/rules/*.md` — conditional, path-matched, committed. **Load order, not precedence chain** — no file replaces another; contradictions may be resolved arbitrarily, fix at the source. "More specific scope wins"/"user-level overrides project-level" are wrong.

**`.claude/rules/` — Conditional Rules** — YAML frontmatter with `paths` field:
```yaml
---
paths:
  - "src/api/**"
  - "src/middleware/**"
---
Always validate authentication tokens before processing API requests.
Use structured error responses with proper HTTP status codes.
```
Loaded **only when Claude Code operates on files matching the globs** — irrelevant rules don't consume context window space.

**Skills System** — Project: `.claude/skills/`, committed/shared. Personal: `~/.claude/skills/`, not shared. Entry point: `SKILL.md`. `allowed-tools`: exam expects "restricting tool access"; in current Claude Code (July 2026) it pre-approves listed tools without a permission prompt; `disallowed-tools` and permission deny rules do the restricting. `context: fork` — runs in forked context, doesn't pollute main conversation. Skills = reusable capability modules (e.g., "run tests", "deploy to staging").

**Commands** — Project: `.claude/commands/`, shared. Personal: `~/.claude/commands/`, personal. Invoked with `/` prefix; templates with `$ARGUMENTS` placeholders. Commands and skills merged — both create `/commands`: command = single flat `.md` file (prompt template, `$ARGUMENTS`); skill = directory with `SKILL.md` entrypoint + supporting files, frontmatter, automatic invocation.

**Hooks — Deterministic Enforcement** — PreToolUse: before a tool executes — block dangerous calls, validate parameters, require confirmation. PostToolUse: after a tool returns — validate output, sanitise, audit logging, side effects. **Deterministic** — run as code, not model instructions; cannot be bypassed by prompt injection. Prompt "Never delete production files" → probabilistic; PreToolUse hook blocking `rm` on `/prod/` → deterministic.

**Working Modes** — Plan mode: complex tasks, multiple approaches, high stakes of a wrong approach — forces outline before execution. Direct execution: clear scope, well-defined task. `-p` (non-interactive): CI/CD, no human, no confirmation prompts, self-contained command.

**CLI Flags (Headless)** — `-p` most tested.
- `-p` / `--print` — non-interactive mode for CI/CD and piping
- `-c` / `--continue` — resume most recent conversation in this directory
- `-r` / `--resume <id|name>` — resume a specific session
- `--bare` — minimal mode: skips hooks, skills, plugins, MCP, memory, CLAUDE.md (faster scripted runs)
- `--output-format text|json|stream-json` — output shape for `-p` (json/stream-json parseable)
- `--json-schema '<schema>'` — schema-validated output for `-p` (lands in JSON envelope's `structured_output` field)
- `--max-turns <n>` — cap agentic turns in print mode
- `--permission-mode <mode>` — `default`, `acceptEdits`, `plan`, `auto`, `dontAsk`, `bypassPermissions`
- `--allowedTools` / `--disallowedTools` — allow/deny tool calls without prompting
- `--add-dir <path>` — add a readable/editable working directory
- `--model <alias|name>` — set session model

System prompt: `--append-system-prompt "<text>"` adds to default, keeps tool guidance and safety instructions; `--system-prompt "<text>"` replaces the whole default. `*-file` variants (`--append-system-prompt-file`, `--system-prompt-file`) load text from a file.

**Feedback Techniques** — Concrete examples beat prose. Batch interacting fixes in one message so all constraints are seen at once; fix independent issues sequentially. **Independent review sessions:** never review code in the session that wrote it — reasoning bias. Severity calibration: examples show critical vs minor; without them all issues treated equally.

**Permissions & Security** — Permissions controlled at the **tool level**. Subagent tools scoped via `tools` field on AgentDefinition; skills use `allowed-tools` frontmatter. **Least privilege.** Project settings (`.claude/`) committed/shared; personal (`~/.claude/`) not.

**Decision Rules** — "guaranteed/cannot be bypassed" → hooks. "style guidance" → CLAUDE.md prompt instructions. "applies only to specific paths" → `.claude/rules/` + `paths`. "reusable workflow, restricted tools" → skills. "prompt template with arguments" → commands. "CI/CD/non-interactive" → `-p`. "extra rules but keep default behaviour" → `--append-system-prompt`. "fast scripted run" → `--bare`. "machine-parseable CI output" → `--output-format json` + `--json-schema`. "review generated code" → independent session. "complex task" → plan mode. "personal, not shared" → `~/.claude/`.

**Traps** — all rules in project CLAUDE.md → use `.claude/rules/` for path-specific. "Hooks are prompt-based" → deterministic code. "Review in writing session" → reasoning bias. "Flat .md in .claude/skills/ creates a command" → skills are directories with SKILL.md; flat files go in `.claude/commands/`. "User CLAUDE.md overrides project" → concatenated; none overrides. "`-p` enables plan mode" → non-interactive mode. "`--append-system-prompt` replaces" → it appends; `--system-prompt` replaces.

### Domain 4 — Prompt Engineering & Structured Output (20%)

**System Prompts** — Concrete code examples beat prose. Severity calibration: 2–3 examples showing critical vs minor. Structure: (1) Role and context; (2) Rules and constraints; (3) Output format specification; (4) Calibration examples. **Key rule:** system prompts are the most cost-effective way to control behaviour — cached/reused via prompt caching.

**Structured Output — tool_use vs Text** — Forced `tool_choice` (`{ type: "tool", name: ... }`): call guaranteed, JSON schema constrains shape — one specific structure every time. `tool_choice: any`: call guaranteed, model picks tool — multiple schemas, unknown document type. `tool_choice: auto`: may or may not use tool — agentic loops where text is valid. Prompt-based JSON: no schema enforcement — prototyping only. **Preferred pattern:** define a tool whose only purpose is structuring output (e.g., `extract_entities`), force with `tool_choice: { type: "tool", name: "extract_entities" }`. Why tool_use over prompt JSON: schema validated by API not post-processing; no malformed/missing/extra fields; works with streaming.

**Schema Design** — Make fields **optional or nullable** when data may be missing — a required field with absent data makes the model **fabricate** a value. Use `enum` for constrained choices. Keep schemas **flat** — deep nesting increases extraction errors. Include `description` on each property. Fabrication prevention: `nullable: true` / `required: false` lets the model return `null`.

**Few-Shot Examples** — Use when instructions alone give inconsistent output. **2–4 examples** is the sweet spot. Include **reasoning**, not just input → output. Cover **edge cases**. Place in system prompt (caching) or user message (per-request variation). Diminishing returns: 0→2 largest impact; 4→8 rarely improves quality, costs more.

**Prompt Chaining** — Multi-step pipelines, each step a focused prompt with single responsibility. Pattern: extract → validate → format → synthesise. Advantages: higher per-step accuracy; intermediate validation; per-step retry without rerunning the chain; different models per step (cost optimisation). Chain when distinct phases; single prompt when cohesive with straightforward output.

**Retry Pattern — retry-with-error-feedback** — Send **original prompt + failed output + specific validation error**:
```
Original: "Extract all dates from this contract"
Failed output: { dates: ["2024-01-15", "next Tuesday"] }
Error: "dates[1] is relative ('next Tuesday'), not absolute. All dates must be ISO 8601 format."
```
Never just say "try again" — include the specific error. Retry on: validation error, format mismatch, missing field. Escalate on: repeated failures (>2 retries), confidence below threshold, fundamentally wrong interpretation. **Pydantic (Python):** parsing enforces schema; custom validators enforce semantic rules JSON Schema can't express (sums that must match, ordered dates); `ValidationError` yields per-field messages fed into the retry prompt.

**Batch API** — Cost: **50% cheaper** than synchronous. Latency: up to 24 hours (not guaranteed faster). For: latency-tolerant bulk workloads. Not for: real-time, interactive, user-facing. **Batch API is for throughput and cost, not speed.**

**Self-Review Limitation** — A model **cannot effectively review its own output in the same session** — biased toward confirming its own reasoning. Fix: **separate model instance** (new conversation, no shared history). Large inputs: per-file passes + cross-file integration pass (attention-dilution mitigation).

**Decision Rules** — "guaranteed schema compliance" → forced `tool_choice`; `any` when type unknown. "wrong format sometimes" → few-shot (2–4). "model fabricates missing data" → optional/nullable fields. "validation failed" → retry-with-error-feedback. "50% cost reduction/bulk" → Batch API. "real-time/user-facing" → NOT Batch. "inconsistent quality" → few-shot or chaining. "review its own output" → separate instance. "large document, missed details" → per-file + cross-file passes. "instructions alone not working" → few-shot.

**Traps** — "prompt-based JSON for production" → forced tool_choice. "Just 'try again'" → include original + failed + error. "Batch API for speed" → trades latency for cost. "review in same conversation" → biased. "10+ few-shot examples" → 2–4 sweet spot. "required fields prevent fabrication" → they CAUSE it. "one big prompt for everything" → chain when distinct phases.

### Domain 5 — Context Management & Reliability (15%)

**Progressive Summarisation Trap** — Relying on the model to progressively summarise earlier context **loses specific details** — names, numbers, exact quotes, precise timestamps. Fix: extract concrete facts into **persistent structured blocks** carried forward verbatim:
```markdown
## Persistent Facts
- Customer: Jane Smith (ID: 12847)
- Order: #ORD-2024-8821, placed 2024-01-15
- Issue: Delivery address incorrect (postcode SW1A 1AA, should be SW1A 2AA)
- Status: Refund approved, reshipment pending
```

**Scratchpad Files** — Persist findings across context boundaries during multi-step exploration. When: long-running tasks that may exceed the context window, or findings that must survive a context reset. Pattern: (1) write findings as discovered; (2) at context boundaries read the scratchpad to restore state; (3) it's a file on disk — survives any reset. **Scratchpads = external persistence (files); conversation history = internal (context window), lost when it fills.**

**Error Propagation** — Structured error context must include: failure type (`"network_timeout"`, `"validation_error"`); partial results (`{ "orders": [...], "payments": null }`); alternatives tried (`"Retried 2x, tried fallback endpoint"`); suggested action (`"Escalate to support with order IDs"`). **Never propagate generic error messages.**

**Valid Empty Results vs Access Failures**
- Search returns 0 results → **valid empty** → accept. API 401 → **access failure** → retry with correct credentials or escalate.
- DB query returns empty set → **valid empty** → record doesn't exist. Network timeout → **access failure** → retry or fallback.
- Filter matches nothing → **valid empty** → refine or report no matches. Rate limit (429) → **access failure** → wait and retry (respect `Retry-After`).
- Executed successfully + nothing returned = valid result; failed to execute = error needing recovery.

**Confidence Calibration & Stratified Validation** — Aggregate metrics mask per-type issues: 95% overall can hide one category at 60%. Pattern: (1) group extractions by type/category; (2) per-type accuracy; (3) find underperformers; (4) targeted fixes (better examples, tighter schema). Stratified random sampling: sample each category proportionally — catches novel error patterns. "High overall accuracy but users report errors" → stratified validation.

**Source Attribution** — Structured claim-source mappings survive synthesis; inline links do not. `{ claim, source, url, date }` → survives — production, multi-step pipelines. Inline links → lost in summarisation — prototyping only. Conflicts: annotate both with provenance and dates; never average or silently pick one.
```
Claim: "Context window is 200K tokens"
  Source A: Anthropic docs (2024-03-15) — 200K tokens
  Source B: Blog post (2023-11-20) — 100K tokens
  Annotation: temporal change, not a conflict — the window grew
  between the two publication dates. Both kept, dated, for the
  consumer to interpret.
```

**Escalation & Ambiguity** — Three valid triggers: (1) customer explicitly asks for a human — honour immediately, no investigation first; (2) policy gap or exception (policy silent — e.g., competitor price matching when policy covers only own-site); (3) agent cannot make meaningful progress. **Unreliable (distractors):** sentiment-based escalation, self-reported confidence scores. Frustrated customer with resolvable issue → acknowledge + offer to resolve; escalate only if they reiterate. Multiple matches → ask for additional identifiers, never heuristic. Gap (policy silent) → escalate; violation (forbids) → refuse with policy explanation.

**Context Window Strategies** — Persistent fact blocks: critical details surviving summarisation. Scratchpad files: multi-step exploration across boundaries. Per-file passes + integration: large codebases (attention dilution). Fresh start + summary injection: stale/contradictory context. Prompt caching: repeated system prompts (cost + latency savings). Pressure signals: model repeats itself, contradicts earlier statements, ignores recent info.

**Decision Rules** — "details lost over long conversation" → persistent fact blocks. "findings survive context reset" → scratchpad files. "tool returned nothing" → valid empty vs access failure. "high overall accuracy, users report errors" → stratified validation. "sources disagree" → annotate both with provenance/dates. "generic error message" → structured error context. "model contradicts itself" → fresh start + summary injection. "inline citations lost" → structured claim-source mappings. "stable metrics but quality complaints" → per-type error rates. "task exceeds context window" → scratchpads + context boundary management.

**Traps** — "summarise conversation to save context" → loses details; use fact blocks. "95% overall = reliable" → check per-type. "pick the more recent source" → annotate both; consumer decides. "'No results found — try again'" → accept if legitimately empty. "inline citations sufficient" → lost in synthesis. "monitor overall error rate" → per-type. "keep all context in conversation history" → scratchpads for external persistence.

## Glossary

### Domain 1 — Agentic Architecture & Orchestration
- **Agentic Loop** — Claude repeatedly receives input, decides on an action (often a tool call), observes the result, and continues until done; runs until `stop_reason` is `end_turn` rather than `tool_use`. `stop_reason` values determine continue/exit.
- **Orchestration Pattern** — Coordinating one or more Claude calls: prompt chaining (sequential), routing (specialised handler), parallelisation (concurrent), orchestrator-workers (central agent delegating to sub-agents). Match patterns to use cases.
- **Guardrail** — Constrains Claude via input validation (before sending to Claude), output validation (before returning to users), or tool-level restrictions (limiting tools/parameters). Tested as deterministic enforcement (workflow prerequisites, handoff gates) and SDK hooks (PreToolUse interception).
- **Claude Agent SDK** — Anthropic's official framework (Python and TypeScript) for agentic apps: agent definitions with tool management, hooks, subagent spawning; handles the agentic loop internally. AgentDefinition = description + system prompt + `tools` field; Task tool gates subagent spawning (guide's name; Claude Code calls it Agent).
- **Multi-Agent System** — Multiple specialised agents, each with own prompt/tools/responsibilities. Tested topology hub-and-spoke: coordinator delegates and all inter-agent communication flows through it; subagents never communicate directly (peer-to-peer options are distractors — break observability, consistent error handling, controlled information flow).
- **Human-in-the-Loop** — High-impact actions (emails, DB modifications, purchases) pause the loop and require explicit human approval, resuming only on approval. Approval gates = workflow enforcement; escalation tested in Domain 5.2.
- **Error Recovery** — Handling failures without crashing the workflow: retry with exponential backoff, fallback to simpler strategy, graceful degradation (partial results), escalation to a human; avoid infinite retry loops.
- **stop_reason** — API field indicating why the model stopped. Key values: `end_turn` (finished naturally) and `tool_use` (wants to call a tool); loop continues on `tool_use`, exits on `end_turn`. Production loops also handle `pause_turn`, `max_tokens`, `stop_sequence`, `refusal`, `model_context_window_exceeded`.
- **tool_use** — `stop_reason` meaning Claude wants to invoke a tool; the response carries a `tool_use` content block (tool name, input parameters); the orchestrator executes and returns a `tool_result` message before the next API call.
- **end_turn** — `stop_reason` meaning Claude finished and needs no more tools; signal to exit the loop and return the final response. Always the termination signal.
- **Fan-Out/Fan-In** — Parallelisation: split a task into independent sub-tasks (fan-out), process concurrently, aggregate results (fan-in); for independently gathered/processed information.
- **Routing Pattern** — Initial classification step determines the specialised handler; the router examines, categorises, and directs the request downstream, avoiding an overloaded single prompt. LLM-based (Claude classifies) vs rule-based (deterministic logic).

### Domain 2 — Tool Design & MCP Integration
- **Tool Schema** — JSON Schema of a tool's name, purpose, expected input parameters; Claude uses it to understand and call correctly. Best practice: descriptive names, detailed parameter descriptions, required vs optional, enums — better descriptions → better tool selection.
- **MCP Server** — Process exposing tools, resources, prompts to MCP clients via the Model Context Protocol; registers capabilities and handles incoming calls; local (same machine) or remote (network). Distinct from tools passed directly via the API.
- **MCP Client** — Connects to one or more servers, discovers capabilities, forwards tool calls to the right server; built into Claude Code; custom apps implement it via the MCP SDK. Handles multiple servers with overlapping tool names.
- **MCP Transport** — Communication layer between client and server: `stdio` (standard input/output, local processes) and `streamable HTTP` (HTTP with server-sent events, remote servers); configured when connecting.
- **JSON Schema** — Spec defining tool input parameters in the Claude API; each tool's `input_schema` specifies property types, required fields, enums, descriptions. Traps: `required` is an array at the object level (not a property attribute); `additionalProperties: false` prevents unexpected fields.
- **Tool Selection** — How Claude picks a tool from the request and available schemas by name and description; many tools → clear, distinct descriptions are critical. Improve via descriptive naming, non-overlapping descriptions, fewer presented tools, tool filtering/routing.
- **Tool Routing** — Directing tool calls to the correct handler across multiple tools/servers; application level (filtering which tools Claude sees) or model level (Claude chooses). Application-level routing reduces ambiguity; favoured for large tool sets.
- **Resources (MCP)** — Read-only data sources exposed by an MCP server (file contents, DB records, documentation), providing context loaded into Claude; identified by URIs, listed and read by clients. Resources read; tools act.
- **Prompts (MCP)** — Reusable prompt templates exposed by an MCP server; pre-defined message sequences for standardised interaction; can take runtime arguments. Three capability types: tools, resources, prompts.
- **Tool Error Handling** — Return `is_error: true` in the `tool_result` with a descriptive, actionable error message so Claude can recover or take an alternative approach; never silently swallow errors.

### Domain 3 — Claude Code Configuration & Workflows
- **CLAUDE.md** — Markdown file with persistent instructions to Claude Code; project-level system prompt loaded automatically at startup. Exists at user home, project root, subdirectories; every applicable file concatenates — none overrides another; contradictions may be resolved arbitrarily. Root `CLAUDE.md` and `.claude/CLAUDE.md` are both valid committed project-level locations.
- **Hooks** — Custom scripts at lifecycle points: before/after tool calls, notification events, session start; defined in `settings.json`, run as shell commands locally. Types: `PreToolUse`, `PostToolUse`, `Notification`, etc.; `PreToolUse` can block a tool call pre-execution. Deterministic — cannot be bypassed by model reasoning.
- **Permissions** — Controls which tools/operations Claude Code can execute via allowlist/denylist of tools, file paths, commands; default requires confirmation for destructive operations. Modes: `default`, `acceptEdits`, `plan`, `bypassPermissions`, `auto`, `dontAsk`.
- **Slash Commands** — Custom reusable commands as markdown files in `.claude/commands/` (project) or `~/.claude/commands/` (user); typing `/` lists them; prompt templates with `$ARGUMENTS` placeholders. Merged with skills: command = flat `.md`; skill = directory with `SKILL.md`; both create `/commands`.
- **CI/CD Integration** — Running Claude Code non-interactively with `claude -p` (single-prompt or piped input); requires `ANTHROPIC_API_KEY`; typically `--allowedTools` to restrict operations. Flags: `-p`, `--output-format json`.
- **Configuration Scope** — Settings hierarchy: project (`.claude/settings.json`), user (`~/.claude/settings.json`), enterprise; more specific scopes override broader ones; enterprise settings have the highest priority.
- **Allowlist/Denylist** — Allowlist permits exactly the listed tools (everything else denied); denylist blocks listed tools (everything else permitted); configured under `permissions` in `settings.json`. Allowlists more secure (deny by default); favoured for production and CI/CD.
- **settings.json** — JSON config for permissions, hooks, MCP servers, model preferences; project level (`.claude/settings.json`, typically committed) or user level (`~/.claude/settings.json`).
- **.claude Directory** — Project-root config directory: `settings.json` (committed, shared), `settings.local.json` (git-ignored, personal), `commands/` subdirectory.
- **Subagents** — Separate Claude Code instances spawned by the main agent via the Task tool for specific scoped work; each runs in its own context with its own tool access, preventing context pollution; the main agent coordinates and aggregates. No shared memory with the parent.

### Domain 4 — Prompt Engineering & Structured Output
- **System Prompt** — Initial instruction message sent via the `system` parameter; sets behaviour, persona, constraints, output format; not part of message history — sits above it and persists across turns.
- **Structured Output** — Machine-parseable output (JSON, XML, YAML) via explicit format instructions, JSON Schema definitions, or `prefilling` (starting the response with an opening delimiter). Tool-use schemas guarantee valid JSON — more reliable than prompts alone.
- **Prompt Chaining** — One call's output feeds the next; each step has a focused, specific task; allows validation/transformation between steps. Chain when distinct phases; each link does one thing well.
- **Few-Shot Examples** — Input-output pairs demonstrating desired behaviour, format, or reasoning; placed in the system prompt or user message before the request; cover edge cases. 2–4 examples typical — more than 4 wastes tokens.
- **Prompt Optimisation** — Iterative refining: simplify instructions, remove ambiguity, add constraints, adjust temperature, test against evaluation cases. Evaluation-driven: define test cases, baseline, targeted changes, re-measure.
- **Output Validation** — Programmatic checks on responses: format (valid JSON, schema), content (required fields, ranges), safety (no prohibited content); failure triggers retry or fallback. Validate with JSON Schema/Zod/Pydantic; review via an independent instance (same-session self-review retains reasoning bias — keyed trap).
- **Prefilling** — Starting Claude's response by including the beginning of the assistant message (e.g., `{` for JSON, `<result>` for XML) via a partial `assistant` message; ensures structured format; requires direct API access.
- **XML Tags** — Delimiters structuring prompts into labelled sections (`<instructions>`, `<context>`, `<examples>`); Anthropic-recommended for long prompts; reduce misinterpretation of boundaries.
- **Chain of Thought** — Instructing Claude to show reasoning step by step before the final answer; improves accuracy on complex tasks; elicited by "think step by step" or extended thinking.
- **Temperature** — Parameter (0.0–1.0, default 1.0) controlling randomness; low (0.0) → deterministic/focused (structured output, code, factual); high (0.8) → varied/creative. Temperature 0 does not guarantee identical outputs.

### Domain 5 — Context Management & Reliability
- **Context Window** — Max tokens (input + output) Claude processes in a single API call; current models offer a 200K-token window; everything (system prompt, message history, tool definitions, response) must fit. Strategies: progressive summarisation, message pruning, content prioritisation; repeated compression can drop specific facts later steps need.
- **Token Counting** — Measuring prompt/response tokens; the API response includes `input_tokens` and `output_tokens` in the `usage` field; counts include all content. Tokenisation algorithms/ratios explicitly out of scope.
- **Prompt Caching** — Caches frequently reused prompt content, reducing latency/cost; `cache_control` breakpoint (`type: "ephemeral"`, ~five-minute TTL) placed at the end of the static block (system prompt, tool definitions, large documents), dynamic content ordered after; cache hits charged at a reduced rate. Depth beyond "it exists" out of scope.
- **Escalation Triggers** — Conditions for handing a case to a human: customer explicitly asks for a human (honour immediately, without investigation first); policy gap or exception the agent cannot resolve; agent cannot make meaningful progress. Sentiment-based escalation and self-reported confidence scores are unreliable proxies (distractors).
- **Policy Gap vs Policy Violation** — Gap: policy silent on the request (e.g., competitor price matching vs own-site only) → escalate; the agent lacks authority to decide. Violation: policy forbids → clear refusal with policy explanation. Multiple matches → ask for additional identifiers, never heuristic selection.
- **Structured Error Context** — Error pattern letting a coordinator recover: failure type, attempted query, partial results, alternative approaches; generic statuses hide needed context. Silently suppressing errors and terminating the whole workflow on one failure are both anti-patterns; subagents recover locally and propagate only what they cannot resolve, with partial results.
- **Access Failure vs Valid Empty Result** — Query that could not run (timeout, auth failure — retry decision) vs query that ran and found nothing (absence of data is the answer); error reporting must distinguish them. Synthesis output carries coverage annotations marking well-supported findings vs gaps.
- **Context Degradation** — Failure mode of extended exploration: inconsistent answers, referencing "typical patterns" instead of specific discovered classes/files; signals the window is full of verbose discovery output. Remedies: scratchpad files, subagent delegation, summarising each exploration phase before the next, `/compact`.
- **Scratchpad Files** — Files persisting key findings across context boundaries during large codebase exploration; the agent records discoveries as it goes and re-reads later. Crash-recovery variant: agents export structured state; the coordinator loads a manifest on resume and injects it into prompts.
- **Stratified Sampling** — Sampling high-confidence extractions for human review, stratified by document type and field, to measure true error rates and catch novel patterns; guards against aggregate-metric traps (97% overall can mask poor performance on one type/field). Validate by segment before automating.
- **Confidence Calibration** — Checking model-reported confidence against actual accuracy on a labelled validation set, then setting review thresholds from calibrated scores; field-level confidence routes reviewer capacity to low-confidence extractions and ambiguous/contradictory sources. Raw self-confidence is not trustworthy alone.
- **Claim-Source Mapping** — Structured record tying each claim to its source (URL, document name, excerpt), preserved through every synthesis step; attribution is lost when findings are compressed without the mappings. Conflicts → annotate both attributions; reports separate well-established from contested findings.
- **Temporal Annotation** — Requiring publication/data-collection dates in structured outputs so figures from different periods aren't misread as contradictions; a 2023 vs 2026 difference is a temporal change, not a conflict.
- **Rate Limits & Quotas (out of scope)** — API throughput controls (requests/tokens per minute, 429 when exceeded) and billing-period usage caps; the guide states "rate limiting, quotas, or API pricing calculations" will not appear. A 429 appears only as an access-failure example (retry with `Retry-After`).
- **Batches API** — Endpoint for large asynchronous request volumes at a 50% cost reduction, completing within a 24-hour window with no guaranteed turnaround; for offline bulk work; wrong for real-time or user-facing flows. Tested in Domain 4, not Domain 5.
