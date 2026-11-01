# Domain 3 — Claude Code Configuration & Workflows (20%)
_Compiled from claudecertificationguide.com — independent community resource, not affiliated with Anthropic._

## Overview

Configure Claude Code for development workflows, manage settings, hooks, permissions, and integrate with CI/CD pipelines.

Task statements: 3.1 CLAUDE.md Hierarchy, Scoping, and Modular Organisation; 3.2 Custom Slash Commands and Skills; 3.3 Path-Specific Rules for Conditional Convention Loading; 3.4 Plan Mode vs Direct Execution; 3.5 Iterative Refinement Techniques; 3.6 CI/CD Integration.

## 3.1 — CLAUDE.md Hierarchy, Scoping, and Modular Organisation

**Source:** https://claudecertificationguide.com/learn/3-claude-code-config/3-1-claude-md-hierarchy

### What You Need to Know
- **Three levels:** user, project, directory.
- **User-level** `~/.claude/CLAUDE.md`: only you; in home dir, outside repo; not version-controlled, never shared via git. For personal preferences (verbosity, output style, shortcuts).
- **Project-level** `.claude/CLAUDE.md` OR root `CLAUDE.md`: everyone; version-controlled, shared via git. Both paths valid — exam may present either. For team standards (naming, error handling, testing, architecture, review checklists).
- **Directory-level** subdir `CLAUDE.md`: applies when working in that dir; package-specific (e.g. `/packages/api/CLAUDE.md`).
- **Loading/conflicts:** files are **concatenated**, not precedence ("All discovered files are concatenated into context rather than overriding each other"). Order broadest→most specific; project appears after user; tree ordered "from the filesystem root down to your working directory" (closest to launch read last); `CLAUDE.local.md` appended after `CLAUDE.md` in a dir.
- "If two rules contradict each other, Claude may pick one arbitrarily." User message, not system prompt; "no guarantee of strict compliance."
- Rules that MUST hold every run → `settings.json` or a hook ("Settings rules are enforced by the client regardless of what Claude decides to do").
- **settings.json** precedence: managed policy > local > project > user (managed always wins); CLAUDE.md has none — on conflict: "neither is guaranteed to — move the rule to settings.json or a hook." Distractors: "more specific scope wins", "user-level overrides project-level".
- **`@` path imports** (no `@import` keyword); each line inlined at load; **eager** (six 100-line imports = same context size). Shrink context via `.claude/rules/` path frontmatter (Task 3.3).
```
@./standards/naming-conventions.md
@./standards/error-handling.md
@./standards/testing-requirements.md
```
- **`CLAUDE.local.md`:** beside `CLAUDE.md` at any level; appended after it (load order, not precedence); gitignored by convention; for personal quirks. Team rules → `CLAUDE.md`.
- **`.claude/rules/`:** topic files (`testing.md`, `api-conventions.md`, `deployment.md`); optional `paths` frontmatter (Task 3.3), else all sessions.
- **`/memory`:** shows loaded files — **does not load config** (loads automatically by level/location). Diagnose, not activate. Current split: `/memory` lists files; `/context` reports what actually loaded (under "Memory files"). Neither triggers loading.
- **Compaction:** after `/compact`, project-root `CLAUDE.md` returns intact (re-read from disk, re-injected; never in history). Nested subdir CLAUDE.md and `.claude/rules/` with `paths:` frontmatter return only on demand.
- **Critical scenario:** new team member gets inconsistent results → conventions in user-level `~/.claude/CLAUDE.md` instead of project-level. Fix: move to project-level.

### Exam Traps
- New team member not receiving Claude Code instructions despite working on the same repo and branch: the instructions are in user-level config (~/.claude/CLAUDE.md) instead of project-level. User-level is not version-controlled or shared via git. Move to .claude/CLAUDE.md for team-wide application.
- Thinking /memory triggers configuration loading: /memory is a diagnostic command that shows which files are loaded. Configuration files load automatically based on their location. /memory helps you debug — it does not activate anything.
- Assuming directory-level CLAUDE.md is the best solution for cross-directory conventions: directory-level applies to one directory only. For conventions spanning many directories (like test files spread throughout a codebase), use path-specific rules in .claude/rules/ with glob patterns instead.

### Practice Scenario
Developer A's Claude Code follows the team's API naming conventions perfectly. Developer B, who joined last week, gets inconsistent naming from Claude Code. Both work on the same repo and branch. What is the most likely root cause?

- A) Developer B has not installed the MCP server that provides the team naming convention rules to the session
- B) The conventions are stored in a .claude/rules/ file that Developer B's local setup does not support, so the rules never load on their machine
- C) The API naming conventions are stored in Developer A's user-level CLAUDE.md (~/.claude/CLAUDE.md) rather than the project-level configuration
- D) Developer B has not run /memory to load the configuration files into the session, so the project-level instructions have never entered the model context

### Build Exercise
Build a Multi-Level CLAUDE.md Configuration (30 min). Learn: three-level hierarchy, `@` imports, `.claude/rules/`, `/memory` diagnosis, new-team-member root cause.
- Project-level `.claude/CLAUDE.md` (naming, error handling, review checklist); verify via `/context`.
- Directory-level `CLAUDE.md` in `/packages/api/` (REST conventions); both load when working there.
- `.claude/rules/testing.md` (test naming, assertions, fixtures).
- `@` import referencing `./standards/naming.md`; confirm inline loading.
- Run `/context` in different directories to verify per-context loading.
- Move a convention to `~/.claude/CLAUDE.md`; confirm a second user session does NOT pick it up.

### Sources
- https://code.claude.com/docs/en/memory (Anthropic)
- https://anthropic-partners.skilljar.com/page/partner-certifications — Exam Guide Task Statement 3.1

## 3.2 — Custom Slash Commands and Skills

**Source:** https://claudecertificationguide.com/learn/3-claude-code-config/3-2-slash-commands-skills

### What You Need to Know
- Unified **Skills system**: `.claude/skills/` and `.claude/commands/` both create `/commands`; file structures differ. **Skill** = dir containing `SKILL.md` (`.claude/skills/deploy/SKILL.md`); **command** = flat `.md` file (`.claude/commands/deploy.md`). Flat file directly in `.claude/skills/` does NOT create a command. `.claude/skills/` canonical; `.claude/commands/` backward-compatible.
- Skills path adds: supporting-files dir, auto-discovery (skill matches intent), precedence over same-named command. Both support YAML frontmatter: `context: fork`, `allowed-tools`, `argument-hint`.
- **Project-scoped (shared via git):** `.claude/skills/` or `.claude/commands/` in repo. **User-scoped (personal):** `~/.claude/skills/` or `~/.claude/commands/`, not shared. Pattern holds across CLAUDE.md, commands/skills, rules. Skills are **on-demand** — not auto-loaded like CLAUDE.md.
```
<!-- .claude/commands/review.md — creates /review -->
Review the staged changes against our team checklist:
1. Check error handling patterns
2. Verify test coverage for new functions
3. Confirm API naming conventions
4. Flag any hardcoded credentials or secrets
```
- **`context: fork`** — isolated sub-agent; verbose output stays contained, main conversation clean. Essential for codebase analysis, brainstorming, noisy output.
- **`allowed-tools`** — pre-approves listed tools (no permission prompt while active); does NOT restrict availability. To remove tools: `disallowed-tools` or deny rules.
- **`argument-hint`** — prompts for required parameters when invoked without arguments.
```
---
description: "Analyse a feature area of the codebase and report structure, patterns and risks"
context: fork
allowed-tools:
  - Read
  - Grep
  - Glob
argument-hint: "Provide a feature description or area of the codebase to analyse"
---
```
- Current state: exam guide names the three; live list also has `description` (**Recommended** — what Claude reads to match intent; fallback = first body paragraph), `disallowed-tools`, `disable-model-invocation`, `model`, `effort`, `when_to_use`.
- **Skills vs CLAUDE.md (tested):** skills = on-demand workflows; description always in context, body loads only on invocation (explicit `/name`, intent match, or `paths` frontmatter match); `disable-model-invocation: true` forces explicit. CLAUDE.md = always-loaded universal standards, no invocation. Procedures → skills; always-on reference → CLAUDE.md; file-type conventions → path-scoped rules.
- **Personal variants:** `~/.claude/skills/` with different name (e.g. `/deep-analyse`); no conflict with team version.

| Need | Canonical | Also works | Scoping |
|---|---|---|---|
| Team-wide command | `.claude/skills/<name>/SKILL.md` | `.claude/commands/<name>.md` | Project (git) |
| Personal command | `~/.claude/skills/<name>/SKILL.md` | `~/.claude/commands/<name>.md` | User (not shared) |
| Universal standards | `.claude/CLAUDE.md` / root `CLAUDE.md` | — | Project (always loaded) |
| Personal preferences | `~/.claude/CLAUDE.md` | — | User (not shared) |

### Exam Traps
- Creating a flat Markdown file directly inside .claude/skills/ (e.g., .claude/skills/review.md) and expecting a /review command: a skill is a directory containing a SKILL.md entrypoint (.claude/skills/review/SKILL.md); a flat .md file only creates a command under .claude/commands/. A loose file in .claude/skills/ is not picked up.
- Placing a team-shared command in a user-scoped path (~/.claude/commands/ or ~/.claude/skills/) instead of a project-scoped path: user-scoped paths are personal and not version-controlled. Team commands must go in a project-scoped path inside the repository.
- Thinking skills behave like CLAUDE.md for always-on guidance: skills load on-demand as task-style workflows, not always-in-context guidance. For always-on conventions applying to every edit, the answer is CLAUDE.md or .claude/rules/, not a skill.
- Not knowing when to use context: fork: context: fork isolates verbose skill output from the main conversation. Without it, brainstorming or codebase analysis output pollutes the context window.
- Putting task-specific workflows in CLAUDE.md: CLAUDE.md is for always-loaded universal standards. Task-specific procedures belong in skills invoked on demand.

### Practice Scenario
A team wants a /review command available to everyone who clones the repository. A developer also wants a personal /brainstorm skill that produces verbose codebase analysis output without cluttering the main conversation. Where should each be created and what configuration does the skill need?

- A) Both in ~/.claude/commands/ with a note in the README instructing each developer to copy them into their local setup
- B) Create both in .claude/commands/ so they ship with the repository, giving the brainstorm skill context: fork frontmatter for isolation
- C) /review in .claude/commands/ for team sharing; /brainstorm as ~/.claude/skills/brainstorm/SKILL.md with context: fork frontmatter
- D) /review in CLAUDE.md as a documented procedure; /brainstorm in .claude/skills/ with only allowed-tools restrictions

### Build Exercise
Create Custom Commands and Skills (30 min). Learn: project vs user scoping, SKILL.md frontmatter, skills vs CLAUDE.md, `context: fork` isolation.
- Project `/review` in `.claude/commands/review.md`.
- Personal `/brainstorm` in `~/.claude/skills/brainstorm/SKILL.md` with `context: fork`.
- `allowed-tools`: Read, Grep, Glob. `argument-hint`: "Provide a feature description or codebase area to explore".
- Verify `/review` in any clone; `/brainstorm` only in your session; verbose output isolated to summary.

### Sources
- https://code.claude.com/docs/en/skills (Anthropic)
- https://anthropic-partners.skilljar.com/page/partner-certifications — Exam Guide Task Statement 3.2

## 3.3 — Path-Specific Rules for Conditional Convention Loading

**Source:** https://claudecertificationguide.com/learn/3-claude-code-config/3-3-path-specific-rules

### What You Need to Know
- Rule files in `.claude/rules/`; YAML `paths` frontmatter holds glob patterns; rules load only when editing matching files. Solves: one file type scattered across many directories.
```
---
paths: ["terraform/**/*"]
---
# Terraform Conventions
- Use snake_case for all resource names
- Tag every resource with environment and team labels
- Never hardcode AMI IDs — use data sources
- All modules must have a variables.tf, outputs.tf, and README.md
```
- **Globs match across the entire codebase:** `**/*.test.tsx` catches every test file wherever it sits; `paths: ["**/*.test.tsx", "**/*.test.ts"]` covers co-located tests everywhere.
- **Why not directory-level CLAUDE.md:** one dir only; 50+ dirs → 50+ copies, new copy per new dir, update all on every change, drift.
- **Why not root CLAUDE.md:** loads every session regardless of edited files; Terraform conventions burn tokens while editing React components.
- **Key concept:** path-scoped rules are more token-efficient than root CLAUDE.md — load ONLY when editing matching files; substantial gain in large projects.
- Example glob sets: tests `["**/*.test.ts","**/*.test.tsx","**/*.spec.ts","**/*.spec.tsx"]`; API `["src/api/**/*","**/routes/**/*","**/*.controller.ts"]`; infra `["terraform/**/*","**/*.tf","infrastructure/**/*"]`.
- **When to use each:** universal standards → root CLAUDE.md; one package dir → directory-level CLAUDE.md; file type across many dirs → path-specific rules with globs; on-demand workflows → skills.
- Exam favourite: co-located test files across many dirs → always path-specific rules with glob patterns.

### Exam Traps
- Choosing directory-level CLAUDE.md over path-specific rules for cross-directory conventions: for files spread across 50+ directories (like co-located test files), path-specific rules with glob patterns are correct. Directory-level CLAUDE.md would require a file in every directory — a massive maintenance burden.
- Placing file-type-specific conventions in root CLAUDE.md: root loads for every session regardless of edited files. Terraform conventions consume tokens when editing React components. Path-specific rules load only when editing matching files, preserving token budget.
- Confusing skills with path-specific rules for automatic convention application: both can auto-activate via paths frontmatter, but rules stay in context as background guidance shaping every edit, while skills load on-demand as task-style workflows (intent match or explicit invocation). For automatic, always-on convention loading for a file type, path-specific rules are the answer.

### Practice Scenario
A codebase has test files co-located with source files throughout 50+ directories (e.g., Button.test.tsx next to Button.tsx). The team wants all tests to follow the same conventions regardless of location. What is the most maintainable approach?

- A) Add all the test conventions to the root CLAUDE.md file so they are loaded into context for every session
- B) Create a rule file in .claude/rules/ with YAML frontmatter paths: ["**/*.test.tsx", "**/*.test.ts"] containing the test conventions
- C) Place a CLAUDE.md file in every directory that contains test files, each carrying a copy of the team test conventions
- D) Create a skill in .claude/skills/ that includes the test conventions and instruct developers to invoke it before writing or editing any tests

### Build Exercise
Configure Path-Specific Rules with Glob Patterns (30 min). Learn: glob frontmatter, cross-directory application, token efficiency, `/memory` verification.
- `.claude/rules/testing.md` (`paths: ["**/*.test.ts","**/*.test.tsx","**/*.spec.ts"]`); `api-conventions.md` (`["src/api/**/*","**/routes/**/*"]`); `terraform.md` (`["terraform/**/*","**/*.tf"]`).
- Edit a test file → `/memory` shows testing rules, not API/Terraform; edit an API handler → converse.
- Compare token footprint root-CLAUDE.md vs path-specific (measurably smaller).

### Sources
- https://code.claude.com/docs/en/memory (Anthropic)
- https://anthropic-partners.skilljar.com/page/partner-certifications — Exam Guide Task Statement 3.3
- https://anthropic-partners.skilljar.com/page/partner-certifications — Exam Guide Sample Question 6

## 3.4 — Plan Mode vs Direct Execution

**Source:** https://claudecertificationguide.com/learn/3-claude-code-config/3-4-plan-mode-execution

### What You Need to Know
- **Plan mode** when: large-scale changes (monolith → microservices, module reorganisation, core abstraction refactor); multiple valid approaches (e.g. different integration architectures); architectural decisions (service boundaries, module dependencies, API contracts); multi-file modifications (library migration affecting 45+ files needs consistent strategy); codebase exploration needed. Claude reads code, analyses dependencies, proposes approach — **without modifying any files**.
- **Direct execution** when: well-scoped change (single-file fix with clear stack trace, date-validation conditional, config update); correct approach already known; limited scope (one function, one file, one modification). Skips planning.
- **Key concept:** decision is about **ambiguity, not difficulty**. Difficult but well-defined fix → direct; simple-sounding feature with 3 implementations across modules → plan.
- **Explore subagent:** runs exploration in isolation, produces summaries, returns them to main conversation, keeps context clean for implementation. Use in multi-phase tasks.
- **Hybrid — plan THEN execute (tested):** plan to explore/evaluate/design, then direct execution file by file. Not plan OR direct. E.g. logging migration across 30 files: Plan — find importing files, map API differences, design pattern, check edge cases; Execute — apply per file.
- **Decision framework:** architectural restructuring → plan; library migration (many files) → plan then direct; multiple approaches → plan; exploration needed → plan (with Explore); single-file fix, clear stack trace → direct; validation check on one function → direct; config update → direct; known fix/location/approach → direct.
- **Complexity upfront:** complexity stated in requirements (e.g. "restructure the monolith into microservices") → plan mode straight away; don't wait for surprises.

### Exam Traps
- Defaulting to direct execution for multi-file architectural changes: multi-file modifications with multiple valid approaches require plan mode. Direct execution risks costly rework when dependencies are discovered late.
- Using plan mode for a single-file bug fix with a clear stack trace: a single-function fix with a known cause and clear stack trace is the textbook case for direct execution. Plan mode adds unnecessary overhead.
- Not recognising the plan-then-execute hybrid pattern: combine plan mode for investigation with direct execution for implementation. Correct for tasks like library migrations: plan the strategy, then execute it.
- Starting direct execution and switching to plan mode only when complexity emerges: when complexity is already stated in the requirements (e.g., monolith restructuring), plan mode should be chosen upfront. The complexity is known, not speculative.

### Practice Scenario
Your team faces three tasks: (1) restructure a monolith into microservices, (2) fix a null pointer exception in a single function with a clear stack trace, (3) migrate from one logging library to another across 30 files. Which mode should be used for each?

- A) Plan mode for (1) and (3), direct execution for (2)
- B) Plan mode for all three, since they all involve code changes
- C) Direct execution for all three with comprehensive upfront instructions
- D) Plan mode only for (1), direct execution otherwise

### Build Exercise
Practice Plan Mode vs Direct Execution Decision-Making (45 min). Learn: ambiguity-based framework, plan-then-execute hybrid, Explore subagent, upfront complexity recognition.
- Complex multi-file task → plan mode (no files modified during planning).
- Simple single-file bug → direct execution; observe efficiency gain.
- Hybrid: plan a library migration, then direct execution file by file.
- Use Explore subagent; only a concise summary reaches the main conversation.
- Write a framework: ≥4 plan criteria + ≥3 direct criteria with examples, addressing ambiguity vs difficulty.

### Sources
- https://code.claude.com/docs/en/commands#plan (Anthropic)
- https://anthropic-partners.skilljar.com/page/partner-certifications — Exam Guide Task Statement 3.4
- https://anthropic-partners.skilljar.com/page/partner-certifications — Exam Guide Sample Question 5

## 3.5 — Iterative Refinement Techniques

**Source:** https://claudecertificationguide.com/learn/3-claude-code-config/3-5-iterative-refinement

### What You Need to Know
- **1. Concrete input/output examples (most effective for inconsistent interpretation):** when prose is interpreted differently each time, the fix is examples, not more prose. Give 2-3 exact pairs:
```
Input:  getUserData(userId: string): Promise<UserData>
Expected output: getUserData(userId: string): Promise<Result<UserData, ApiError>>

Input:  fetchOrders(customerId: string): Promise<Order[]>
Expected output: fetchOrders(customerId: string): Promise<Result<Order[], ApiError>>
```
- Model generalises from examples more reliably than prose. **First technique** when interpretation is inconsistent.
- **2. Test-driven iteration (most effective for complex transformations):** write tests first — happy path, edge cases (null, empty inputs, boundaries), performance (if applicable). Share failures; unambiguous:
```
FAIL: testMigrationHandlesNullValues
  Expected: null preserved in output JSON
  Actual: null replaced with empty string ""
```
- **3. Interview pattern (most effective for unfamiliar domains):** have Claude ask questions before implementing. "I need a caching layer for the API. Before implementing, ask me questions about the requirements, edge cases, and constraints I should consider." Claude may ask about cache invalidation, TTL policies, consistency, failure modes.
- **Key concept:** interview = unfamiliar domains (you may miss considerations); examples = you know the transformation but model misinterprets. Don't confuse.
- **Batch vs sequential:** batch in ONE message when fixes interact (e.g. error code field + structured logging of it + client SDK type definitions reflecting it). Sequential when independent (e.g. "Fix the function naming — use camelCase throughout" then "update the indentation to use 2 spaces"); batching independent issues confuses the model.
- **Practice:** (1) observe inconsistency, (2) switch to 2-3 before/after pairs, (3) verify generalisation on a new case, (4) add edge-case examples only if needed. Two or three well-chosen examples covering standard + key edge case are enough.
- **When each applies:** prose inconsistent → examples; complex transformation, many edge cases → test-driven iteration; unfamiliar domain → interview pattern; interacting issues → batch; independent issues → sequential.

### Exam Traps
- Choosing to refine prose descriptions when the model interprets them inconsistently: more precise prose still relies on interpretation. Concrete input/output examples eliminate interpretation ambiguity. The answer to inconsistent interpretation is always examples first, not better prose.
- Not recognising when to batch vs sequence feedback: if issues interact (fixing A affects B), provide all in one message so the model sees all constraints. If independent, fix sequentially.
- Confusing the interview pattern with the examples technique: the interview pattern is for unfamiliar domains where you might miss considerations. Examples are for when you know the exact transformation but the model misinterprets it. Different problems, different solutions.

### Practice Scenario
A developer describes a code transformation in prose. Claude Code interprets it differently each time, producing inconsistent results. What technique should the developer try first?

- A) Provide 2-3 concrete input/output examples showing the exact before and after transformation
- B) Write a comprehensive test suite and iterate by sharing test failures
- C) Use the interview pattern to have Claude ask clarifying questions before implementing
- D) Rewrite the prose description with more precise language and technical terminology

### Build Exercise
Practice Iterative Refinement Techniques (30 min). Learn: examples over prose, test-driven iteration, interview pattern, batch vs sequential.
- Describe a transformation in prose; run 3×; note inconsistent interpretation.
- Provide 2-3 concrete examples; run 3×; variation eliminated or reduced.
- Write a test suite (happy path, edge cases, errors); iterate via failures.
- Interview pattern on an unfamiliar task; note 5-10 questions surfacing missed requirements.
- Batch three interdependent issues in one message; observe coherent fix vs sequential conflicts.

### Sources
- https://code.claude.com/docs/en/best-practices (Anthropic)
- https://anthropic-partners.skilljar.com/page/partner-certifications — Exam Guide Task Statement 3.5

## 3.6 — CI/CD Integration

**Source:** https://claudecertificationguide.com/learn/3-claude-code-config/3-6-cicd-integration

### What You Need to Know
- **`-p` (also `--print`)** = print mode: processes prompt, outputs to stdout, exits. Claude Code defaults to interactive (expects keyboard input); without `-p` a CI job hangs forever. Not `CLAUDE_HEADLESS=true` (doesn't exist), not `--batch` (doesn't exist), not stdin redirection. **Single most directly tested fact in Domain 3 (Sample Question 10).**
```
# WRONG — hangs in CI
claude "Analyse this pull request for security issues"
# CORRECT — runs non-interactively
claude -p "Analyse this pull request for security issues"
```
- **Structured output:** `--output-format json` wraps the run in a JSON envelope (result text, session ID, cost/usage metadata). `--json-schema` validates final output against a JSON Schema (print mode only). Schema data lands in envelope's `structured_output` field — extract with `jq '.structured_output'`.
```
claude -p --output-format json \
  --json-schema '{"type":"object","properties":{"findings":{"type":"array","items":{"type":"object","properties":{"file":{"type":"string"},"line":{"type":"integer"},"severity":{"type":"string"},"message":{"type":"string"}}}}}}' \
  "Review this PR for security issues"
```
- **Session context isolation:** the generating session is weaker at reviewing its own code (retains reasoning — choices, tradeoffs, rejected alternatives; won't question decisions it justified). Fix: separate invocation, no shared context:
```
claude -p "Implement the authentication middleware"           # session A: generate
claude -p "Review the authentication middleware for security issues, error handling gaps, and edge cases"   # session B: independent review
```
- **Incremental review context:** without prior context, every run re-analyses the whole PR and re-derives the same findings; fixed issues drop out but deliberately-unchanged ones recur every push. Fix: include prior findings; report ONLY new or still-unaddressed issues. Duplicate comments erode trust and signal-to-noise.
- **CLAUDE.md for CI context:** read in CI exactly as interactively — testing standards, available fixtures, review criteria (critical vs minor), existing coverage. Without it, CI test generation produces low-value boilerplate.
```
# .claude/CLAUDE.md — CI-relevant section
## Testing Standards
- Tests must use the factory pattern from test/factories/ for data creation
- Integration tests connect to the test database via test/setup/db.ts
- Do not test private implementation details — test public API contracts
- Coverage target: 80% branch coverage for new code
- Available fixtures: test/fixtures/users.json, test/fixtures/orders.json
```
- **System prompt flags (append-vs-replace tested):** `--system-prompt "<text>"` replaces entire default; `--system-prompt-file <path>` replaces with file contents; `--append-system-prompt "<text>"` appends text; `--append-system-prompt-file <path>` appends file contents. Append = stay a coding assistant plus extra rules (keeps default tool guidance, safety, conventions). Replace = identity/permission model differs (e.g. non-coding agent in unattended pipeline); you own everything.
- **Headless output/limits:** `--output-format text|json|stream-json` (json and stream-json machine-parseable); `--input-format text|stream-json`; `--json-schema '<schema>'` (→ `structured_output` with json); `--max-turns <n>` caps agentic turns then exits; `--verbose` full turn-by-turn.
- **Permissions/tools/context:** `--permission-mode <mode>` = `default`, `acceptEdits`, `plan`, `auto`, `dontAsk`, `bypassPermissions`; `--allowedTools "<rules>"` (e.g. `"Bash(git diff *)" "Read"`) run without permission prompts; `--disallowedTools "<rules>"` deny rules (bare name removes tool entirely); `--tools "Bash,Edit,Read"` restricts built-ins; `--add-dir <path>` adds a readable/editable directory (file access, not config discovery); `--model <alias|name>` (`sonnet`, `opus`, or full name).
- **Session/start-up:** `-c`/`--continue` resumes most recent conversation in current dir; `-r`/`--resume <id|name>` resumes a specific session. `--bare` = minimal mode: skips auto-discovery of hooks, skills, plugins, MCP servers, auto memory, and CLAUDE.md; leaves Bash + file read/edit tools only.
- **Existing tests:** include them in CI test-generation context so Claude finds coverage gaps, not duplicates.
- **Batch API vs real-time:** Message Batches API = 50% cost savings, up to 24-hour processing, no latency SLA. Pre-merge checks (blocking, developers wait) → real-time synchronous. Overnight debt reports / weekly audits / nightly test generation → Batch API. Batch unsuitable for pre-merge — no latency guarantee (Sample Question 11).

### Exam Traps
- CI pipeline hanging because Claude Code is waiting for interactive input: the fix is the -p (--print) flag. Not CLAUDE_HEADLESS=true (does not exist), not --batch (does not exist), not stdin redirection. The -p flag is the documented method for non-interactive execution.
- Assuming self-review in the same session is as effective as independent review: the same session retains reasoning context from code generation, making it less likely to question its own decisions. An independent review instance without that context is more effective at finding issues.
- Using the Batch API for pre-merge CI checks: the Message Batches API has up to 24-hour processing time with no latency SLA. Pre-merge checks are blocking workflows where developers wait for results. Use real-time API for blocking checks; batch API for overnight or weekly non-blocking analysis.
- Not including prior review findings in subsequent review runs: without prior context, each review run analyses from scratch and produces duplicate comments. Include previous findings and instruct Claude to report only new or unaddressed issues to maintain developer trust.

### Practice Scenario
A CI pipeline script runs claude with a prompt but the job hangs indefinitely. Logs show Claude Code is waiting for interactive input. What is the correct fix?

- A) Set the environment variable CLAUDE_HEADLESS=true before running the command
- B) Add the --batch flag to enable batch processing mode
- C) Add the -p flag to run Claude Code in non-interactive print mode
- D) Redirect stdin from /dev/null to prevent interactive prompts

### Build Exercise
Set Up a CI/CD Pipeline with Claude Code (45 min). Learn: `-p` execution, structured JSON output, session isolation, incremental review, CLAUDE.md CI context.
- CI script running `claude -p` for non-interactive PR analysis (GitHub Actions YAML, GitLab CI, or similar).
- Add `--output-format json` + `--json-schema` (file, line, severity, message); extract via `jq .structured_output`.
- Post findings as inline PR comments at exact file and line.
- Add CLAUDE.md section: testing standards, available fixtures, review criteria.
- Two separate `claude -p` invocations: generation + independent review (no shared context).
- Incremental review: store previous findings, include next run, report only new or unaddressed issues.

### Sources
- https://code.claude.com/docs/en/cli-reference (Anthropic)
- https://anthropic-partners.skilljar.com/page/partner-certifications — Exam Guide Task Statement 3.6
- https://anthropic-partners.skilljar.com/page/partner-certifications — Exam Guide Sample Questions 10 and 11
- https://platform.claude.com/docs/en/build-with-claude/batch-processing (Anthropic)
