# Domain 2 — Tool Design & MCP Integration (18%)
_Compiled from claudecertificationguide.com — independent community resource, not affiliated with Anthropic._

## Overview

Design effective tool schemas, implement MCP servers and clients, and integrate external services into Claude-powered applications.

## 2.1 — Tool Interface Design

**Source:** https://claudecertificationguide.com/learn/2-tool-design-mcp/2-1-tool-schema-design

### What You Need to Know

- **Tool descriptions are the PRIMARY mechanism LLMs use for tool selection.** Not supplementary metadata — the mechanism. When a model receives a set of tools it reads the descriptions to decide which to call; minimal descriptions ("Retrieves customer information") give it no way to tell apart overlapping tools.
- **Five elements of a production-grade tool description:**
  1. **What the tool does** — primary purpose, stated unambiguously
  2. **What inputs it expects** — data types, formats, constraints, required vs optional
  3. **Example queries it handles well** — concrete use cases that anchor understanding
  4. **Edge cases and limitations** — what the tool does NOT do, what happens out of range
  5. **Explicit boundaries** — when to use THIS tool vs similar tools in the same toolkit
- **The Misrouting Problem (exam Q2):** `get_customer` and `lookup_order` with minimal descriptions cause the agent to route "check my order #12345" to the wrong tool. Four candidate fixes, three wrong:
  - **Expand descriptions** — correct. Low effort, high leverage, addresses root cause.
  - **Few-shot examples** — wrong. Adds token overhead without fixing why the model is confused (symptom, not disease).
  - **Routing classifier** — wrong. Over-engineered as a first step; bypasses the LLM's natural language understanding.
  - **Tool consolidation** — wrong as a first step. Valid long-term, but costs far more effort than descriptions.
- The exam favours **low-effort, high-leverage fixes**: better descriptions before routing classifiers; scoped access before full access; community servers before custom builds.
- **Tool splitting:** generic broad tools create ambiguity. Split `analyze_document` into `extract_data_points`, `summarize_content`, `verify_claim_against_source` — each one narrow, clearly described, with defined input/output contracts.
- **Tool renaming for clarity:** rename `analyze_content` → `extract_web_results` with a web-specific description to fix name overlap at the interface level, without touching implementation.
- **System prompt interactions:** keyword-sensitive instructions ("always check customer details before proceeding") can create unintended tool associations that OVERRIDE well-written descriptions. After updating descriptions, re-read the system prompt for conflicts.
- **Key concept (both halves):** descriptions are the fix when the agent has a workable number of tools and simply can't tell two apart. They are NOT the fix when the toolkit itself is the problem — past roughly **4-5 tools per agent**, selection degrades on decision complexity alone. Diagnose which situation before reaching for a remedy (Task Statement 2.3 covers the overload threshold).

### Exam Traps

- Choosing few-shot examples to fix tool misrouting caused by minimal descriptions — adds token overhead without addressing the root cause; fix descriptions first.
- Implementing a routing classifier as the first step — over-engineered, bypasses the LLM's natural language understanding.
- Consolidating similar tools into one as the first step — valid long-term but more effort than expanding descriptions; exam favours low-effort, high-leverage first steps.
- Ignoring system prompt wording after updating tool descriptions — keyword-sensitive instructions silently override well-written descriptions.

### Practice Scenario

Production logs show an agent frequently calls get_customer when users ask about orders (e.g. 'check my order #12345') instead of calling lookup_order. Both tools have minimal descriptions and accept similar identifier formats. What is the most effective first step to improve tool selection reliability?

- A) Add 5-8 few-shot examples to the system prompt demonstrating correct tool selection for order-related queries.
- B) Expand each tool description to include input formats, example queries, edge cases, and boundaries explaining when to use it versus similar tools.
- C) Consolidate both tools into a single lookup_entity tool that accepts any identifier and internally determines which backend to query.
- D) Implement a routing layer that parses user input before each turn and pre-selects the appropriate tool based on detected keywords.

### Build Exercise

Design Tool Descriptions That Eliminate Misrouting (30 min). What you'll learn: tool descriptions are the primary selection mechanism; write production-grade descriptions with purpose, inputs, examples, edge cases, boundaries; diagnose misrouting from ambiguous descriptions; identify system prompt conflicts.

1. Create two MCP tools with intentionally ambiguous descriptions (get_customer / lookup_order) and register them with the MCP server.
2. Test with 10 queries covering different user intents; log which tool the model selects (expect 2-3 misroutes).
3. Rewrite both descriptions to include purpose, expected inputs with formats, example queries, edge cases, and explicit boundaries against the other tool (3-5 sentences each).
4. Re-run the same 10 queries and compare selection accuracy (expect 9/10 or 10/10 correct).
5. Review the system prompt for keyword-sensitive instructions that could override the improved descriptions; rewrite conflicts.

### Sources

- Claude Certified Architect Foundations Exam Guide — Domain 2, Task Statement 2.1 (anthropic-partners.skilljar.com)
- Tool use — Anthropic API Documentation (platform.claude.com/docs/en/build-with-claude/tool-use)
- Model Context Protocol Specification — Tools (modelcontextprotocol.io/docs/concepts/tools)

## 2.2 — Structured Error Responses

**Source:** https://claudecertificationguide.com/learn/2-tool-design-mcp/2-2-structured-error-responses

### What You Need to Know

- Generic messages like "Operation failed" are useless to an LLM — no signal about what went wrong, whether to retry, or what to try instead. The MCP protocol provides the **`isError` flag** to communicate tool failures: set it and the model knows execution failed and can reason about recovery instead of treating error text as a normal successful result.
- **Four error categories**, each demanding a different recovery:
  - **1. Transient Errors** — timeouts, service unavailability, rate limits. Request is valid, system temporarily unreachable. **Recovery: retry after a brief delay.** (`errorCategory: "transient"`, `isRetryable: true`)
  - **2. Validation Errors** — invalid input format, missing required fields, out-of-range values. **Recovery: fix the input and retry.** (`errorCategory: "validation"`, `isRetryable: true`)
  - **3. Business Errors** — policy violations, limit exceedances, rule conflicts. Request is technically valid but violates a constraint. **Recovery: do NOT retry — same request always fails; take an alternative workflow (escalation).** (`errorCategory: "business"`, `isRetryable: false`) Example: "Refund amount of £750 exceeds the £500 automatic refund limit. This requires manager approval."
  - **4. Permission Errors** — access denied, insufficient credentials, authorisation failures. **Recovery: escalate or use different credentials.** (`errorCategory: "permission"`, `isRetryable: false`)
- **What isRetryable really signals:** answers one question — "can a retry ever work?" Two categories share `isRetryable: true` yet need different recoveries: transient retries as-is; validation retries only after the agent fixes the input (reformat `order-abc` → `#12345`). Business and permission are `isRetryable: false` for the mirror reason: no retry helps. Read the flag as "can a retry ever work", then read `errorCategory` to know HOW: resend, self-correct, escalate, or take an alternative route.
- **Access failure vs valid empty result (tested directly — nail this distinction):**
  - **Access failure:** tool could NOT reach the data source (timeout, auth failure, service down). Data might exist but couldn't be checked. Agent should decide whether to retry.
  - **Valid empty result:** tool successfully queried and found no matches. Agent should NOT retry — the answer is "no results found."
  - Canonical anti-pattern: tool returns empty array after a customer lookup → agent retries 3 times → escalates → account simply does not exist.
  - Fix: structure responses so a successful empty query looks nothing like a failure:
    - Valid empty result: `{ "isError": false, "content": [{ "type": "text", "text": "No customer found matching email 'john@example.com'. The query executed successfully but returned no matches." }], "resultCount": 0 }`
    - Access failure: `{ "isError": true, "content": [{ "type": "text", "text": "Could not reach customer database" }], "errorCategory": "transient", "isRetryable": true, "description": "Connection to the customer database timed out after 5 seconds. The query did not execute." }`
- **Error propagation in multi-agent systems — local recovery with selective propagation:**
  1. Subagents implement local recovery for transient failures (retry before bothering the coordinator).
  2. Only propagate errors that cannot be resolved locally.
  3. Include partial results and what was attempted: "I searched 3 of 5 sources successfully. Sources 4 and 5 timed out. Here are partial results from the 3 successful sources."
- Anti-patterns to avoid: silently suppressing errors (returning empty results as success) and terminating entire workflows on a single failure — both leave the coordinator making decisions blind.

### Exam Traps

- Retrying when a tool returns an empty result from a successful query — empty result means "no data matches"; retrying produces the same empty result.
- Using generic error messages like 'Operation failed' without structured metadata — without errorCategory, isRetryable, and description the agent cannot distinguish transient failures from business rule violations.
- Treating business errors as retryable — same policy violation applies every time; the agent must escalate or take an alternative path.
- Silently suppressing subagent errors by returning empty results as success — hides failure info from the coordinator, preventing intelligent recovery.

### Practice Scenario

A tool returns an empty array after a customer lookup. The agent retries 3 times, then escalates to a human agent. Analysis shows the customer's account simply does not exist. What is the root cause of this wasted effort?

- A) The retry limit is too low. Raising it to 5 attempts would give the lookup enough chances before escalation triggers.
- B) The system prompt should instruct the agent never to retry customer lookups, so failed searches escalate to a human immediately.
- C) The escalation threshold is too aggressive. The agent should exhaust more retries before involving a human.
- D) The tool does not distinguish between access failures and valid empty results, so the agent treats no matches as a retriable failure.

### Build Exercise

Build Structured Error Responses for All Four Categories (45 min). What you'll learn: structured errors with errorCategory/isRetryable/description; distinguish access failures (isError: true) from valid empty results (isError: false); categorise failures; build recovery logic branching on error metadata.

1. Create an MCP tool that queries a mock customer database with a failure_mode parameter to trigger simulated failure conditions.
2. Implement four error types: transient (simulated timeout), validation (invalid input format), business (refund exceeds policy limit), permission (access denied) — each with isError: true, correct errorCategory, correct isRetryable boolean, and a descriptive message.
3. Ensure each error parses to exactly three fields: errorCategory (transient/validation/business/permission), isRetryable (boolean), description (what went wrong + suggested recovery).
4. Implement a valid empty result (isError: false, resultCount: 0) clearly distinguished from an access failure (isError: true, errorCategory: transient, isRetryable: true).
5. Write an agent loop that branches on errorCategory: retry transient up to 3 times with backoff, reformat input for validation, escalate business to a human, request elevated credentials for permission.

### Sources

- Claude Certified Architect Foundations Exam Guide — Domain 2, Task Statement 2.2 (anthropic-partners.skilljar.com)
- MCP Specification — Tool Results (modelcontextprotocol.io/docs/concepts/tools)
- Building Effective Agents — Anthropic (anthropic.com/research/building-effective-agents)

## 2.3 — Tool Distribution & Tool Choice

**Source:** https://claudecertificationguide.com/learn/2-tool-design-mcp/2-3-tool-distribution-choice

### What You Need to Know

- **The Tool Overload Problem:** giving a single agent 18 tools degrades selection reliability. Every additional tool adds decision complexity. The optimal range is **4-5 tools per agent**, scoped to that agent's specific role.
- Relevance matters as much as quantity: a synthesis agent should NOT have web search tools. A synthesis agent with `web_search` might run its own searches instead of using provided results — duplicating work and wasting context. **Principle: each agent gets only the tools it needs for its defined role.**
- **Consolidating near-duplicate tools:** splitting by role is wrong when tools all do the same kind of work. A data platform server with 22 tools (3 query + 19 transformations like pivot_table, calculate_percentile, normalise_currency) collapses 19 transformations into ONE parameterised tool:
  ```
  {
    "name": "transform_data",
    "description": "Apply a transformation to a dataset. Use transform_type to select the operation.",
    "input_schema": {
      "type": "object",
      "properties": {
        "dataset": { "type": "string" },
        "transform_type": { "type": "string", "enum": ["pivot", "percentile", "normalise_currency", "..."] },
        "options": { "type": "object" }
      },
      "required": ["dataset", "transform_type"]
    }
  }
  ```
  Twenty-two tools become four; every transformation is still reachable as an enum value. Selection accuracy improves because the hard choice got smaller.
- **Which fix applies (the decision table):**
  - Few enough tools but two read alike → **sharpen the descriptions** (Task 2.1)
  - Different jobs (query, transform, export) → **split by role**, 4-5 tools each
  - Variations on one job, sharing a shape → **consolidate into one parameterised tool**
  - Doing more than the agent should → **constrain them** (least privilege)
- The first row is where candidates trip: descriptions are the right fix for a small toolkit (5 tools), NOT for 22. **Count the tools before you pick the remedy.**
- Note the tension: consolidation reduces how many tools an agent chooses between; constraining reduces what any one tool can reach. Both can be right in the same system.
- **One fix that isn't a fix:** moving tools onto a second MCP server — server boundaries are invisible to the model (client hands every tool from every server as one flat list), so a 22-tool problem split across two servers is still a 22-tool problem.
- **`tool_choice` configuration — three settings:**
  - **`"auto"` (default)** — model decides whether to call a tool or return text. For general operation needing conversational flexibility.
  - **`"any"`** — model MUST call a tool but chooses which. Guarantees structured output from one of multiple schemas (e.g. extraction pipelines with unknown document type: invoice/receipt/contract schemas) — never plain text.
  - **Forced selection `{ "type": "tool", "name": "extract_metadata" }`** — model MUST call a specific named tool. Enforces mandatory first steps / workflow ordering; after the forced call, subsequent turns can use `"auto"`.
- **Scoped cross-role tools (exam Q9):** routing every cross-role request through the coordinator adds 2-3 round trips per request and up to 40%+ latency. Give the agent a scoped `verify_fact` tool that handles simple lookups directly (the 85% simple case); complex verifications (multiple sources, cross-referencing, judgement) still route through the coordinator (the 15% case).
- **Constrained alternatives (least privilege applied to tool design):** replace a subagent's generic `fetch_url` (can fetch anything from anywhere) with `load_document` that validates document URLs only — prevents misuse, makes purpose clearer, reduces unintended side effects.
- **Role-specific tool scoping in practice (multi-agent research system):**
  - Web Search: `search_web`, `fetch_page`, `extract_links`, `save_snippet`
  - Document Analysis: `extract_metadata`, `extract_data_points`, `summarize_content`, `verify_claim`
  - Synthesis: `compile_report`, `verify_fact` (scoped), `format_citation`, `assess_coverage`
  - Coordinator: `Agent` (formerly `Task`, spawns subagents), `review_output`, `request_revision` — runs the workflow without holding domain-specific tools.

### Exam Traps

- Routing all simple verification requests through the coordinator when 85% are simple lookups — a scoped verify_fact tool on the synthesis agent handles the common case directly, cutting latency up to 40%.
- Using tool_choice 'auto' when structured output is required — the model may return conversational text; use 'any' to guarantee a tool call, or forced selection for a specific tool.
- Giving an agent 18 tools and expecting reliable selection — optimal range is 4-5 tools per agent.
- Giving a subagent a generic fetch_url tool when a constrained load_document would suffice — generic tools enable misuse; constrained alternatives enforce least privilege.

### Practice Scenario

A synthesis agent frequently returns control to the coordinator for simple fact verification, adding 2-3 round trips per task and 40% latency. Analysis shows 85% of verifications are simple lookups. What is the most effective solution?

- A) Give the synthesis agent a scoped verify_fact tool for simple lookups, routing only complex verifications through the coordinator.
- B) Remove the fact verification step from the synthesis workflow entirely so no task ever pays the round-trip latency.
- C) Cache all verification results at the coordinator level so repeated lookups return instantly without a second round trip to any subagent.
- D) Increase the coordinator parallelism so verification requests are processed concurrently and the queueing delay disappears.

### Build Exercise

Configure Tool Distribution Across a Multi-Agent System (45 min). What you'll learn: scope tools to roles using the 4-5 guideline; scoped cross-role tools; tool_choice modes; least-privilege tool design; verifying no cross-role misuse.

1. Design three agent roles (web search, document analysis, synthesis) with 4-5 tools each, scoped to role; no tool appears in more than one role (except scoped cross-role tools).
2. Add a scoped verify_fact tool to the synthesis agent with a description limiting it to simple single-source lookups, escalating complex multi-source verifications to the coordinator.
3. Configure forced selection on the document analysis agent so the first call uses tool_choice { type: "tool", name: "extract_metadata" }, switching to auto for later steps.
4. Replace generic fetch_url with constrained load_document that validates document URLs (extensions/trusted domains) and rejects others with a clear error.
5. Test with a query requiring all three agents; verify no cross-role misuse (synthesis agent must not run its own web searches).

### Sources

- Claude Certified Architect Foundations Exam Guide — Domain 2, Task Statement 2.3 (anthropic-partners.skilljar.com)
- Tool use — Anthropic API Documentation (platform.claude.com/docs/en/build-with-claude/tool-use)
- Claude Agent SDK — Tool Configuration (platform.claude.com/docs/en/agent-sdk/overview)

## 2.4 — MCP Server Integration

**Source:** https://claudecertificationguide.com/learn/2-tool-design-mcp/2-4-mcp-server-integration

### What You Need to Know

- **The Scoping Hierarchy — two levels:**
  - **Project-level: `.mcp.json`** — lives in the project repository root. Version-controlled, shared with every team member who clones/pulls. Use for team-wide servers (Jira, GitHub, internal API connectors).
  - **User-level: `~/.claude.json`** — lives in the user's home directory. Personal, NOT version-controlled, NOT shared. Use for experimental/personal integrations being tested before proposing to the team.
  - Example .mcp.json:
    ```
    {
      "mcpServers": {
        "github": {
          "command": "npx",
          "args": ["-y", "@modelcontextprotocol/server-github"],
          "env": { "GITHUB_TOKEN": "${GITHUB_TOKEN}" }
        },
        "jira": {
          "command": "npx",
          "args": ["-y", "@community/mcp-server-jira"],
          "env": { "JIRA_URL": "${JIRA_URL}", "JIRA_TOKEN": "${JIRA_TOKEN}" }
        }
      }
    }
    ```
- **Key principle:** all tools from ALL configured servers (project + user level) are discovered at connection time and available simultaneously. No manual activation step — if a server is configured and reachable, its tools appear in the agent's toolkit.
- **Environment variable expansion:** `.mcp.json` supports `${VARIABLE_NAME}` syntax to keep credentials out of version control. Each developer sets their own tokens locally (shell profile, `.env`, secrets manager). Benefits: config safe to commit; each developer authenticates with own credentials; token rotation needs no config changes; no secrets leak through repo history.
- **MCP Resources:** expose content catalogues to agents WITHOUT requiring exploratory tool calls — the agent gets information upfront instead of discovering it. Examples: issue summaries (list of current Jira issues with titles/statuses), documentation hierarchies (TOC for internal docs), database schemas (table names, column types, relationships). Payoff: fewer wasted calls (no list_tables → describe_table chain). **Resources show agents what data is available; tools let them act on it.**
- **Build-vs-Use decision:**
  - **Use community servers** for standard integrations: Jira, GitHub, Slack, Linear, Notion — maintained, tested, receive updates; saves dev time and maintenance.
  - **Build custom servers only when:** team-specific workflows community servers can't handle; custom business logic embedded in the tool layer; proprietary internal systems with no community server.
  - The exam consistently favours the pragmatic choice: "Evaluate community servers first" is always correct for standard integrations.
- **Enhancing MCP tool descriptions:** when an MCP tool has a sparse description, the agent may prefer built-in tools (like Grep) even when the MCP tool is more capable — the model has better context about built-in tools. Fix: enhance MCP descriptions to explain capabilities and outputs in detail. Example:
  - Sparse: `search_codebase: "Searches code"`
  - Enhanced: "Performs semantic code search across the entire repository using AST-aware indexing. Returns matching functions, classes, and methods with full context including file path, line numbers, and surrounding code. More accurate than text-based grep for finding code by intent rather than exact string match. Use this instead of Grep when searching for code by what it does rather than what it contains."

### Exam Traps

- Building a custom MCP server for a standard integration like Jira — community servers exist and should be evaluated first; custom builds only for team-specific workflows.
- Putting team-wide MCP server configuration in ~/.claude.json — that file is user-level, personal, not version-controlled; team-wide servers belong in .mcp.json at project root.
- Committing credentials directly in .mcp.json instead of environment variable expansion — secrets in version control are a security risk; use ${VAR} syntax.
- Leaving MCP tool descriptions sparse, causing the agent to prefer built-in tools — the model defaults to tools it understands best; enhance descriptions to explain capabilities and outputs.

### Practice Scenario

A team needs to integrate with Jira for issue tracking in their Claude Code workflow. A developer proposes building a custom MCP server. What is the correct first step?

- A) Evaluate existing community MCP servers for Jira and only build custom if they cannot handle team-specific workflows.
- B) Add the Jira integration to ~/.claude.json so each developer can configure their own connection independently.
- C) Use the Jira REST API directly from Bash commands instead of MCP, avoiding the server setup entirely.
- D) Build a custom MCP server exposing exactly the Jira API endpoints the team needs, so the integration matches their workflow precisely.

### Build Exercise

Configure MCP Servers with Scoping and Environment Variables (30 min). What you'll learn: project-level .mcp.json for team-wide sharing; env var expansion to keep credentials out of VCS; project vs user scoping; exposing MCP resources; enhanced tool descriptions.

1. Create a .mcp.json in the project root configuring a community MCP server (e.g. GitHub) with command and args.
2. Use ${GITHUB_TOKEN} environment variable expansion for authentication; confirm `git diff` shows no secrets staged.
3. Add a personal/experimental MCP server to ~/.claude.json (NOT in the project repo or version control).
4. Expose a content catalogue (e.g. documentation hierarchy or database schema) as an MCP resource — name, description, mimeType, at a URI like db://schema/main.
5. Enhance MCP tool descriptions to 3-5 sentences explaining what it does, what it returns, when to use it, and how it compares to built-in alternatives.

### Sources

- Claude Certified Architect Foundations Exam Guide — Domain 2, Task Statement 2.4 (anthropic-partners.skilljar.com)
- MCP Server Configuration — Claude Code Documentation (code.claude.com/docs/en/mcp)
- Model Context Protocol — Resources (modelcontextprotocol.io/docs/concepts/resources)

## 2.5 — Built-in Tools

**Source:** https://claudecertificationguide.com/learn/2-tool-design-mcp/2-5-built-in-tools

### What You Need to Know

- Claude Code provides **six built-in tools**: Read, Write, Edit, Bash, Grep, Glob. Each has a specific purpose; using the wrong tool wastes time, context tokens, or both.
- **Grep vs Glob: the core distinction (most important in this task):**
  - **Grep searches file CONTENTS for patterns.** Use for function callers, error messages, import statements, variable assignments — anything you're searching for inside files. E.g. `Grep: "processLegacyOrder"`, `Grep: "timeout"`, `Grep: "import.*from 'utils/auth'"`.
  - **Glob matches file PATHS by naming patterns.** Use for test files, config files, files by extension/directory structure. E.g. `Glob: "**/*.test.tsx"`, `Glob: "**/config.*"`, `Glob: "content/domains/**/*.mdx"`.
  - **One sentence: Grep finds what is INSIDE files. Glob finds files by their NAMES.** Use Glob to find function callers and it fails (paths, not contents). Use Grep to find test files by naming pattern and it works technically but is the wrong tool.
- **Read, Write, Edit:**
  - **Edit** performs targeted modifications using unique text matching; fast and precise, touches only the specified text.
  - **When Edit fails:** requires unique text matching — if the text appears in multiple places Edit can't tell which occurrence you mean and fails. That's a safety mechanism, not a bug.
  - **The fix for a non-unique match (per Edit docs):** **widen `old_string` with more surrounding context until it pins down one location**, or set **`replace_all: true`** if you actually want every occurrence updated. Both keep you on Edit and cost almost no extra context. **Read + Write (load whole file, write whole file back) is the last resort** — it burns a file's worth of tokens on what was usually a one-line change.
  - **Ordering:** 1) Try Edit with the shortest plausibly-unique anchor. 2) On non-unique match, widen old_string or use replace_all. 3) Only fall back to Read + Write when neither can disambiguate.
- **Incremental codebase understanding (the right way):**
  - **Wrong:** read all files upfront — a 200-file codebase read in full swallows the entire context window on files irrelevant to the task.
  - **Right (incremental discovery):** 1) **Grep** to find entry points (function/class/error name anchoring the investigation). 2) **Read** to follow imports and trace flows in relevant files. 3) **Grep again** to trace usage (wrapper functions, re-exports). 4) **Read only what you need** — each read justified by the previous step.
- **Tracing function usage across wrapper modules:** a function defined in one module, re-exported through a wrapper, and consumed via the wrapper's name — a simple Grep for the original name misses every consumer who imports through the wrapper. Correct approach: 1) Grep for the function definition. 2) Read the defining file to identify exported names. 3) Grep for each exported name across the codebase. 4) If re-exported through a barrel file (index.ts), Grep for the barrel file's module name.
- **The Deprecation Scenario (constantly in exam prep):** find every file that calls a deprecated function AND the test files that exercise it. Correct sequence — **Grep, then Glob, then Grep again**:
  1. **Grep for the function name** — every file whose contents reference it, including tests that import directly (content search).
  2. **Glob for sibling test files** — by naming convention (`OrderProcessor.ts` → `OrderProcessor.test.tsx`), catching tests that exercise the function indirectly through the source module (path matching).
  3. **Grep again for wrapper names** — if a caller exposes the function through a wrapper (e.g. `applyLegacyOrder` calls `processLegacyOrder` internally), Grep for the wrapper to find tests covering it transitively.

### Exam Traps

- Using Glob to find function callers — Glob matches paths, not contents; use Grep for function names, imports, error messages.
- Using Grep to find files by extension or naming pattern — Glob is purpose-built for path matching (`**/*.test.tsx`, `**/config.*`).
- Reading all source files upfront — context-budget killer; use incremental discovery (Grep to find entry points, then Read to trace flows).
- Defaulting to Read + Write for every file modification instead of trying Edit first — Edit uses less context; it only touches the specified text.
- Jumping straight to Read + Write the moment Edit reports a non-unique match — widen old_string with surrounding context or use replace_all; escalate to Read + Write only when neither can disambiguate.

### Practice Scenario

A developer needs to find all files that call a deprecated function processLegacyOrder() and also find all test files for those callers. Which tool sequence is correct?

- A) Bash with find and xargs grep for both steps, since a single shell pipeline can locate the callers and their test files in one pass without switching between built-in tools.
- B) Glob for **/*processLegacyOrder* to find caller files, then Grep inside that result set for test files. Glob resolves the file list first, so the content search runs over fewer files and stays inside the context budget.
- C) Grep for processLegacyOrder to find callers (this also surfaces tests that import the function directly), then Glob for the sibling test file of each caller (e.g. **/OrderProcessor.test.*) to catch tests that exercise the function through the source module without naming it.
- D) Read all the source files to search for the function manually, then Read all the test files to pair them with their callers. Reading every file gives complete visibility of each call site and test, so no caller can be missed by a naming mismatch.

### Build Exercise

Trace and Refactor a Deprecated Function Using Built-in Tools (30 min). What you'll learn: Grep for content vs Glob for paths in the correct sequence; incremental discovery; Edit as primary modification tool with anchor widening / replace_all; tracing across wrappers and barrel files.

1. Use Grep to find all callers of a target function (e.g. processLegacyOrder) — expect file paths with line numbers and matching lines.
2. Use Glob to find test files matching caller filenames (e.g. **/*.test.tsx) — e.g. src/OrderProcessor.test.tsx pairs with src/OrderProcessor.ts.
3. Use Read to examine each caller file incrementally (only after Grep identifies relevance) — note parameters, return usage, direct vs wrapper import.
4. Use Edit to replace the deprecated call with the new API (e.g. processOrder(orderId, { validate: true })).
5. When Edit fails with "old_string matches N locations", widen old_string with surrounding lines until it pins one occurrence, or set replace_all: true for a global change; only fall back to Read + Write if neither works.

### Sources

- Claude Certified Architect Foundations Exam Guide — Domain 2, Task Statement 2.5 (anthropic-partners.skilljar.com)
- Claude Code Documentation — Built-in Tools (code.claude.com/docs/en/tools)
- Building with Claude API — Anthropic (platform.claude.com/docs/en/build-with-claude)
