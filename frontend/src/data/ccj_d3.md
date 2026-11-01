# CCAR-F Exam Scripts — Domain 3: Claude Code Configuration & Workflows

## Domain Overview

Source: https://github.com/jacinthpaul/Claude-Certified-Architect/blob/claude/architect-exam-codebase-7ytdjz/domains/domain3_claude_code/README.md

# Domain 3 — Claude Code Configuration & Workflows (20%)

The most directly practical domain: where instructions live and who they apply to,
reusable commands and skills, plan mode vs direct execution, refinement, and CI/CD.

| Task | Demo | One-line idea |
|---|---|---|
| 3.1 Configure CLAUDE.md files with appropriate hierarchy, scoping, and modular organization | `task3_1_claudemd_hierarchy.py` | Level decides WHO the instructions reach |
| 3.2 Create and configure custom slash commands and skills | `task3_2_commands_skills.py` | Project (shared) vs personal; skill frontmatter |
| 3.3 Apply path-specific rules for conditional convention loading | `task3_3_path_rules.py` | Glob-scoped rules follow scattered files |
| 3.4 Determine when to use plan mode vs direct execution | `task3_4_plan_mode.py` | Architectural/multi-file → plan; small fix → direct |
| 3.5 Apply iterative refinement techniques for progressive improvement | `task3_5_iterative_refinement.py` | Show don't tell; tests-as-feedback; interview |
| 3.6 Integrate Claude Code into CI/CD pipelines | `task3_6_cicd.py` | `-p` for non-interactive; structured output |

```bash
python3 run_all.py domain3
```

## Real config artifacts — `examples/`

Open these alongside the demos; they are working examples of the things the exam asks about:

```
examples/
├── CLAUDE.md                      # project-level standing instructions (+ @import)
├── .mcp.json                      # shared MCP servers with ${ENV_VAR} secrets
├── standards/                     # files pulled in via @import
└── .claude/
    ├── commands/review.md         # team /review command (sample Q4)
    ├── rules/testing.md           # path-scoped: paths: ["**/*.test.tsx"]  (sample Q6)
    ├── rules/api-conventions.md   # path-scoped: paths: ["src/api/**/*"]
    └── skills/analyze-codebase/SKILL.md   # context: fork, allowed-tools, argument-hint
```

---

## Task 3.1 — CLAUDE.md hierarchy, scoping, and modular organization

**Source:** https://github.com/jacinthpaul/Claude-Certified-Architect/blob/claude/architect-exam-codebase-7ytdjz/domains/domain3_claude_code/task3_1_claudemd_hierarchy.py

### Objective

Configure CLAUDE.md files with appropriate hierarchy, scoping, and modular organization. Level decides WHO the instructions apply to.

### Concept

CLAUDE.md files are standing instructions Claude Code loads automatically at the start of every session — the project's operating manual. They live at THREE levels, and the level decides WHO they apply to:

- **User** `~/.claude/CLAUDE.md` — everything YOU do, every project. NOT shared.
- **Project** `.claude/CLAUDE.md` or root — everyone in this repo. Shared (VCS).
- **Directory** CLAUDE.md in a subfolder — work within that subdirectory. Shared, scoped.

THE CLASSIC DIAGNOSTIC: a new teammate clones the repo and Claude ignores the team's conventions. Why? They were written in someone's USER-level file (`~/.claude/CLAUDE.md`), which never travels through version control. Fix: move them to PROJECT level.

Also: `@import` keeps CLAUDE.md modular; `.claude/rules/` splits a monolith into topic files; `/memory` shows which memory files are currently loaded (first move when behavior is flaky).

### Instructions

- Anything inside the repo travels via version control; `~/` stays local. If a new teammate clones the repo and Claude ignores conventions written in `~/.claude/CLAUDE.md`, move them to PROJECT level (`.claude/CLAUDE.md` or root `CLAUDE.md`).
- Keep it modular: use `@import ./standards/testing.md` and `@import ./standards/api.md` so each package imports only the standards relevant to it. `.claude/rules/` is the alternative to one monolith (testing.md, api-conventions.md, deployment.md — see Task 3.3).
- `/memory` shows exactly which memory files are loaded — the first move when behavior is inconsistent across sessions.

### Acceptance Criteria

Not present as a separate section in the module docstring. The demo runs the three-level comparison, the classic diagnostic, and the modularity rules; see the full code below.

### Full code

```python
"""
Domain 3 · Task 3.1 — CLAUDE.md hierarchy, scoping, and modular organization.

THE BIG IDEA
============
CLAUDE.md files are standing instructions Claude Code loads automatically at the start of
every session — the project's operating manual. They live at THREE levels, and the level
decides WHO they apply to:

  User      ~/.claude/CLAUDE.md        everything YOU do, every project     NOT shared
  Project   .claude/CLAUDE.md or root  everyone in this repo                shared (VCS)
  Directory CLAUDE.md in a subfolder   work within that subdirectory        shared, scoped

THE CLASSIC DIAGNOSTIC: a new teammate clones the repo and Claude ignores the team's
conventions. Why? They were written in someone's USER-level file (~/.claude/CLAUDE.md),
which never travels through version control. Fix: move them to PROJECT level.

Also: @import keeps CLAUDE.md modular; .claude/rules/ splits a monolith into topic files;
/memory shows which memory files are currently loaded (first move when behavior is flaky).
"""

import sys, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[2]))
from ccarch import banner, concept, h1, h2, wrong, right, tip, note, kv, code, rule, pause, analogy, pitfall


def reaches_teammates(location: str) -> bool:
    """Anything inside the repo travels via version control; ~/ stays local."""
    return not location.strip().startswith("~/")


def main():
    banner("Domain 3 · Task 3.1", "CLAUDE.md hierarchy & scoping")
    concept("Domain 3: Claude Code Configuration & Workflows (20%)",
            "Task 3.1 — Configure CLAUDE.md files with appropriate hierarchy, scoping, and modular organization",
            "Level decides WHO the instructions apply to")

    h1("A real project CLAUDE.md is just plain text")
    code("# Project conventions\n"
         "- All currency amounts are stored in cents, never dollars\n"
         "- Every new function needs a matching test\n"
         "- Use British English in customer-facing text\n"
         "- Never modify files in /legacy without asking", "CLAUDE.md")

    rule()
    h1("The three levels")
    rows = [
        ("User", "~/.claude/CLAUDE.md", "everything YOU do, every project", "NO — personal"),
        ("Project", ".claude/CLAUDE.md or root CLAUDE.md", "everyone in this repo", "YES — via VCS"),
        ("Directory", "CLAUDE.md in a subfolder", "work in that subdirectory", "YES — but scoped"),
    ]
    for lvl, loc, applies, shared in rows:
        h2(f"{lvl}: {loc}")
        kv("  applies to", applies)
        kv("  shared with team?", shared)

    pause("the classic diagnostic")
    rule()
    h1("The classic diagnostic question")
    note("A new teammate clones the repo and Claude ignores the team's conventions. Why?")
    for loc in ["~/.claude/CLAUDE.md", ".claude/CLAUDE.md"]:
        ok = reaches_teammates(loc)
        kv(f"  conventions in {loc}", "REACH teammates ✓" if ok else "stay LOCAL ✗ (the bug)")
    wrong("Conventions written in ~/.claude/CLAUDE.md never travel through version control.")
    right("Move them to PROJECT level (.claude/CLAUDE.md or root CLAUDE.md).")

    rule()
    h1("Keeping it modular")
    code("# CLAUDE.md\n@import ./standards/testing.md\n@import ./standards/api.md",
         "@import syntax")
    note("- @import lets each package import only the standards relevant to it.")
    note("- .claude/rules/ is the alternative to one monolith: testing.md, "
         "api-conventions.md, deployment.md (see Task 3.3).")
    note("- /memory shows exactly which memory files are loaded — the first move when "
         "behavior is inconsistent across sessions.")

    rule()
    h1("Plain-language analogy & the common confusion")
    analogy("CLAUDE.md is a new hire's onboarding binder. Put it in the shared team drive (project level) and everyone reads it; leave it on your own desk (user level) and only you do.")
    pitfall('The classic bug: a teammate clones the repo and Claude ignores the conventions. They were written in the personal ~/.claude file, which never travels through git. Team rules belong at the project level.')

    tip("User (~/.claude, personal) · Project (repo, shared) · Directory (scoped). "
        "'Teammate doesn't get conventions' => they're at USER level; move to PROJECT.")
    note("\nSee runnable artifacts under domains/domain3_claude_code/examples/.")


if __name__ == "__main__":
    main()
```

---

## Task 3.2 — Custom slash commands and skills

**Source:** https://github.com/jacinthpaul/Claude-Certified-Architect/blob/claude/architect-exam-codebase-7ytdjz/domains/domain3_claude_code/task3_2_commands_skills.py

### Objective

Create and configure custom slash commands and skills. Project vs personal scope; skill frontmatter.

### Concept

SLASH COMMANDS are saved prompts.

- `.claude/commands/` -> project (version-controlled, everyone who clones gets it). This is the correct answer for "the whole team should get /review".
- `~/.claude/commands/` -> personal.

SKILLS live in `.claude/skills/` as folders with a SKILL.md playbook, configured via frontmatter:

- `context: fork` -> run the skill in an ISOLATED sub-agent context so verbose output doesn't pollute the main conversation
- `allowed-tools` -> restrict which tools the skill may use (e.g., file writes only)
- `argument-hint` -> prompt the developer for required parameters when invoked bare

SKILLS vs CLAUDE.md decision rule:

- CLAUDE.md = ALWAYS-loaded universal standards.
- Skills = ON-DEMAND, task-specific workflows.

Want a personal variant of a team skill? Create it in `~/.claude/skills/` under a DIFFERENT name so teammates are unaffected.

### Instructions

- Team command (e.g., `/review` for every developer after cloning/pulling the repo): put it in `.claude/commands/review.md` inside the repo (PROJECT scope -> shared via version control). `~/.claude/commands/` is PERSONAL scope -> only you.
- CLAUDE.md is NOT for command definitions; `.claude/config.json` "commands array" doesn't exist.
- Skill frontmatter: `context: fork` (isolated sub-agent context; keeps pages of findings out of main chat), `allowed-tools` (restrict tools while the skill runs, e.g., file writes only), `argument-hint` (prompt for required params when invoked bare, e.g., `/deploy <env>`).
- Decision rule: always-on universal standards -> CLAUDE.md; on-demand task-specific workflow -> skill.
- Personal variant of a team skill: create it in `~/.claude/skills/` under a DIFFERENT name so teammates are unaffected.

### Acceptance Criteria

Not present as a separate section in the module docstring. The demo runs the sample Q4 project-scope comparison, the SKILL.md frontmatter, and the skills-vs-CLAUDE.md decision rule; see the full code below.

### Full code

```python
"""
Domain 3 · Task 3.2 — Custom slash commands and skills.

THE BIG IDEA
============
SLASH COMMANDS are saved prompts.
  .claude/commands/   -> project (version-controlled, everyone who clones gets it)
                         This is the correct answer for "the whole team should get /review".
  ~/.claude/commands/ -> personal.

SKILLS live in .claude/skills/ as folders with a SKILL.md playbook, configured via
frontmatter:
  context: fork    -> run the skill in an ISOLATED sub-agent context so verbose output
                      doesn't pollute the main conversation
  allowed-tools    -> restrict which tools the skill may use (e.g., file writes only)
  argument-hint    -> prompt the developer for required parameters when invoked bare

SKILLS vs CLAUDE.md decision rule:
  CLAUDE.md = ALWAYS-loaded universal standards.
  Skills    = ON-DEMAND, task-specific workflows.
Want a personal variant of a team skill? Create it in ~/.claude/skills/ under a DIFFERENT
name so teammates are unaffected.
"""

import sys, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[2]))
from ccarch import banner, concept, h1, h2, wrong, right, tip, note, kv, code, rule, pause, analogy, pitfall


def main():
    banner("Domain 3 · Task 3.2", "Slash commands & skills")
    concept("Domain 3: Claude Code Configuration & Workflows (20%)",
            "Task 3.2 — Create and configure custom slash commands and skills",
            "Project vs personal scope; skill frontmatter")

    h1("Slash commands = saved prompts (sample Q4)")
    note('Goal: every developer gets /review when they clone or pull the repo.')
    kv("  .claude/commands/review.md", "PROJECT scope -> shared via version control ✓ correct")
    kv("  ~/.claude/commands/review.md", "PERSONAL scope -> only you")
    wrong("CLAUDE.md isn't for command definitions; .claude/config.json 'commands array' "
          "doesn't exist.")
    right("Put /review in .claude/commands/ inside the repo.")

    pause("skills")
    rule()
    h1("Skills live in .claude/skills/ with a SKILL.md + frontmatter")
    code("---\n"
         "name: analyze-codebase\n"
         "context: fork            # isolate verbose output from the main chat\n"
         "allowed-tools: [Read, Grep, Glob]   # read-only; no destructive actions\n"
         "argument-hint: <module-name>        # prompt when invoked without args\n"
         "---\n"
         "# Codebase analysis playbook\n"
         "1. Map the module's exports...\n", "SKILL.md")

    h2("The three frontmatter options")
    kv("  context: fork", "isolated sub-agent context; keeps pages of findings out of main chat")
    kv("  allowed-tools", "restrict tools while the skill runs (e.g., file writes only)")
    kv("  argument-hint", "prompt for required params when invoked bare (e.g., /deploy <env>)")

    pause("the decision rule")
    rule()
    h1("Skills vs CLAUDE.md — the decision rule")
    kv("CLAUDE.md", "ALWAYS-loaded universal standards (conventions, context)")
    kv("Skills", "ON-DEMAND, task-specific workflows you invoke when needed")
    right("Want a personal variant of a team skill? Create it in ~/.claude/skills/ under a "
          "DIFFERENT name so teammates are unaffected.")

    rule()
    h1("Plain-language analogy & the common confusion")
    analogy("A slash command is a saved macro; a skill is a checklist you pull out for a specific job. Keep the team's macros in the repo so everyone gets them; keep personal experiments in your home folder.")
    pitfall('Learners try to ship a team command from ~/.claude/commands (personal — nobody else gets it) or stuff command definitions into CLAUDE.md (which is for context, not commands). Team command goes in .claude/commands/ in the repo.')

    tip(".claude/commands/ = shared; ~/.claude/commands/ = personal. Skill frontmatter: "
        "context: fork, allowed-tools, argument-hint. Always-on standards -> CLAUDE.md; "
        "on-demand workflow -> skill.")
    note("\nSee runnable artifacts under domains/domain3_claude_code/examples/.")


if __name__ == "__main__":
    main()
```

---

## Task 3.3 — Path-specific rules (conditional convention loading)

**Source:** https://github.com/jacinthpaul/Claude-Certified-Architect/blob/claude/architect-exam-codebase-7ytdjz/domains/domain3_claude_code/task3_3_path_rules.py

### Objective

Apply path-specific rules for conditional convention loading. YAML frontmatter `paths` globs load rules only where they apply.

### Concept

Rule files in `.claude/rules/` carry YAML frontmatter with a `paths` field of glob patterns. The rule loads ONLY when Claude edits a file that matches — saving tokens and avoiding irrelevant context.

WHY THIS BEATS directory CLAUDE.md for SCATTERED conventions (sample Q6): test files sit next to the code they test, ALL OVER the codebase (`Button.test.tsx` beside `Button.tsx`). A directory-bound CLAUDE.md can't cover them all; a single rule with `paths: ["**/*.test.tsx"]` applies the testing conventions to EVERY test file regardless of location — automatically and deterministically.

Analogy: path rules are motion-sensor lights (on exactly where you work). A monolithic CLAUDE.md is leaving every light in the building on.

### Instructions

- Per-directory CLAUDE.md can't cover scattered conventions: test files are EVERYWHERE next to their code, so no single directory file covers them all.
- A monolithic CLAUDE.md relies on the model INFERRING which section applies.
- Skills need manual/optional invocation, not automatic application.
- One `.claude/rules/testing.md` with `paths: ['**/*.test.tsx']` applies to EVERY test file regardless of location — automatic and deterministic.

### Acceptance Criteria

Not present as a separate section in the module docstring. The demo includes a tiny simulated rule engine (`rules_for` / `_match`) that loads rules by file path; see the full code below.

### Full code

```python
"""
Domain 3 · Task 3.3 — Path-specific rules (conditional convention loading).

THE BIG IDEA
============
Rule files in .claude/rules/ carry YAML frontmatter with a `paths` field of glob patterns.
The rule loads ONLY when Claude edits a file that matches — saving tokens and avoiding
irrelevant context.

WHY THIS BEATS directory CLAUDE.md for SCATTERED conventions (sample Q6): test files sit
next to the code they test, ALL OVER the codebase (Button.test.tsx beside Button.tsx). A
directory-bound CLAUDE.md can't cover them all; a single rule with
paths: ["**/*.test.tsx"] applies the testing conventions to EVERY test file regardless of
location — automatically and deterministically.

Analogy: path rules are motion-sensor lights (on exactly where you work). A monolithic
CLAUDE.md is leaving every light in the building on.
"""

import sys, pathlib, fnmatch
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[2]))
from ccarch import banner, concept, h1, h2, wrong, right, tip, note, kv, code, rule, pause, analogy, pitfall


# A tiny rule engine: each rule = (name, glob patterns, instruction)
RULES = [
    ("testing.md", ["**/*.test.tsx", "**/*.test.ts"],
     "Test names describe behavior; mock external services; cover empty/error cases first."),
    ("api-conventions.md", ["src/api/**/*"],
     "API handlers use async/await with structured error handling."),
    ("terraform.md", ["terraform/**/*"],
     "Pin provider versions; never hardcode secrets."),
]


def _match(pattern: str, path: str) -> bool:
    # '**' should cross directory boundaries; fnmatch treats '*' greedily enough for the
    # teaching cases when we normalize '**/' to match any prefix.
    if pattern.startswith("**/"):
        tail = pattern[3:]
        return fnmatch.fnmatch(path, tail) or fnmatch.fnmatch(path, "*/" + tail) \
            or fnmatch.fnmatch(path, pattern)
    return fnmatch.fnmatch(path, pattern)


def rules_for(path: str):
    loaded = []
    for name, patterns, instr in RULES:
        if any(_match(p, path) for p in patterns):
            loaded.append((name, instr))
    return loaded


def main():
    banner("Domain 3 · Task 3.3", "Path-specific rules — conventions that follow files")
    concept("Domain 3: Claude Code Configuration & Workflows (20%)",
            "Task 3.3 — Apply path-specific rules for conditional convention loading",
            "YAML frontmatter `paths` globs load rules only where they apply")

    h1("A complete, working rule file")
    code("---\n"
         'paths: ["**/*.test.tsx"]\n'
         "---\n"
         "When writing or editing tests:\n"
         "- Test names describe the behavior being verified\n"
         "- Mock external services; never call real APIs\n"
         "- Cover the empty-input and error cases first", ".claude/rules/testing.md")

    pause("the rule engine")
    rule()
    h1("Watch rules load by file path (simulated engine)")
    edits = [
        "src/components/Button.test.tsx",
        "src/api/orders/handler.ts",
        "terraform/prod/main.tf",
        "README.md",
    ]
    for path in edits:
        loaded = rules_for(path)
        h2(f"editing  {path}")
        if loaded:
            for name, instr in loaded:
                kv(f"  loaded {name}", instr)
        else:
            note("  (no path rules match — no extra context loaded)")

    rule()
    h1("Why this beats a directory CLAUDE.md for scattered conventions (sample Q6)")
    wrong("Per-directory CLAUDE.md: test files are EVERYWHERE next to their code, so no "
          "single directory file can cover them all.")
    wrong("One monolithic CLAUDE.md: relies on the model INFERRING which section applies.")
    wrong("Skills: need manual/optional invocation, not automatic application.")
    right("One .claude/rules/testing.md with paths: ['**/*.test.tsx'] applies to EVERY "
          "test file regardless of location — automatic and deterministic.")

    rule()
    h1("Plain-language analogy & the common confusion")
    analogy('Path rules are motion-sensor lights: they switch on exactly where you are working. A monolithic CLAUDE.md is leaving every light in the building on.')
    pitfall('People reach for one big CLAUDE.md and hope the model infers which section applies. For conventions that span scattered files (tests live everywhere), a path-scoped rule with a glob applies them automatically — no inference, no guessing.')

    tip("'Conventions for files spread across many directories, applied automatically' "
        "=> path-scoped rules with glob patterns. It's the motion-sensor light.")


if __name__ == "__main__":
    main()
```

---

## Task 3.4 — Plan mode vs direct execution

**Source:** https://github.com/jacinthpaul/Claude-Certified-Architect/blob/claude/architect-exam-codebase-7ytdjz/domains/domain3_claude_code/task3_4_plan_mode.py

### Objective

Determine when to use plan mode vs direct execution. Architectural/multi-file -> plan; small known fix -> direct.

### Concept

- PLAN MODE: complex tasks — large-scale changes, multiple valid approaches, architectural decisions, multi-file modifications. Explore and DESIGN before changing anything. Examples: monolith -> microservices; a library migration touching 45+ files; choosing between integration approaches with different infrastructure needs.
- DIRECT EXECUTION: simple, well-scoped changes you already understand. Examples: a single-file bug fix with a clear stack trace; adding one date-validation conditional.

Plan mode prevents costly rework by surfacing dependencies BEFORE you commit. If the requirements already STATE the complexity, "start direct and switch to plan mode if it gets hard" is a TRAP (sample Q5) — the complexity isn't hypothetical.

The Explore subagent isolates verbose discovery output and returns summaries, preserving the main conversation's context during multi-phase tasks.

### Instructions

- How you enter plan mode (interactive): press Shift+Tab to cycle into "plan mode" -> Claude explores & proposes a plan, makes NO edits until you approve.
- Non-interactive / scripted: `claude --permission-mode plan "Refactor the auth layer across services"`. Then implement the approved plan with normal (direct) execution.
- Trap answer: "Start with direct execution and switch to plan mode if it gets hard." The complexity is ALREADY stated in the requirements — it's not hypothetical.
- "Use direct execution with comprehensive upfront instructions" assumes you already know the right structure without exploring the code.
- Combine the modes: plan mode for investigation, then direct execution to implement the agreed plan.

### Acceptance Criteria

Not present as a separate section in the module docstring. The demo includes a `recommend()` function: architectural or multiple approaches or `files_touched >= 5` -> PLAN MODE; clear scope and single file -> DIRECT EXECUTION; otherwise PLAN MODE (when unsure) — cheaper to plan than to rework.

### Full code

```python
"""
Domain 3 · Task 3.4 — Plan mode vs direct execution.

THE BIG IDEA
============
  PLAN MODE: complex tasks — large-scale changes, multiple valid approaches, architectural
  decisions, multi-file modifications. Explore and DESIGN before changing anything.
  Examples: monolith -> microservices; a library migration touching 45+ files; choosing
  between integration approaches with different infrastructure needs.

  DIRECT EXECUTION: simple, well-scoped changes you already understand.
  Examples: a single-file bug fix with a clear stack trace; adding one date-validation
  conditional.

Plan mode prevents costly rework by surfacing dependencies BEFORE you commit. If the
requirements already STATE the complexity, "start direct and switch to plan mode if it
gets hard" is a TRAP (sample Q5) — the complexity isn't hypothetical.

The Explore subagent isolates verbose discovery output and returns summaries, preserving
the main conversation's context during multi-phase tasks.
"""

import sys, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[2]))
from ccarch import banner, concept, h1, h2, wrong, right, tip, note, kv, code, rule, pause, analogy, pitfall


def recommend(files_touched, multiple_approaches, architectural, clear_scope):
    if architectural or multiple_approaches or files_touched >= 5:
        return "PLAN MODE", "Complexity is stated up front; explore & design before changing."
    if clear_scope and files_touched <= 1:
        return "DIRECT EXECUTION", "Simple, well-understood, single-file change."
    return "PLAN MODE (when unsure)", "Cheaper to plan than to rework."


TASKS = [
    ("Restructure monolith into microservices", dict(files_touched=40, multiple_approaches=True,
        architectural=True, clear_scope=False)),
    ("Library migration touching 45+ files", dict(files_touched=45, multiple_approaches=True,
        architectural=False, clear_scope=False)),
    ("Fix a single-file bug with a clear stack trace", dict(files_touched=1,
        multiple_approaches=False, architectural=False, clear_scope=True)),
    ("Add one date-validation conditional", dict(files_touched=1, multiple_approaches=False,
        architectural=False, clear_scope=True)),
]


def main():
    banner("Domain 3 · Task 3.4", "Plan mode vs direct execution")
    concept("Domain 3: Claude Code Configuration & Workflows (20%)",
            "Task 3.4 — Determine when to use plan mode vs direct execution",
            "Architectural/multi-file -> plan; small known fix -> direct")

    h1("A recommender you can reason through")
    for name, feats in TASKS:
        mode, why = recommend(**feats)
        h2(name)
        kv("  signals", ", ".join(f"{k}={v}" for k, v in feats.items()))
        right(f"{mode} — {why}")

    h2("How you actually enter plan mode")
    code(
        '''# Interactive: press Shift+Tab to cycle into "plan mode"
#   -> Claude explores & proposes a plan, makes NO edits until you approve.

# Non-interactive / scripted:
claude --permission-mode plan "Refactor the auth layer across services"

# Then implement the approved plan with normal (direct) execution.''',
        "entering plan mode")

    pause("the trap")
    rule()
    h1("The trap answer (sample Q5)")
    wrong("'Start with direct execution and switch to plan mode if it gets hard.' "
          "The complexity is ALREADY stated in the requirements — it's not hypothetical.")
    wrong("'Use direct execution with comprehensive upfront instructions.' Assumes you "
          "already know the right structure without exploring the code.")
    right("Enter plan mode: explore the codebase, understand dependencies, design the "
          "approach BEFORE making changes.")

    rule()
    h1("Two more facts")
    note("- The EXPLORE subagent isolates verbose discovery output and returns summaries, "
         "preserving the main conversation's context during multi-phase tasks.")
    note("- COMBINE the modes: plan mode for investigation, then direct execution to "
         "implement the agreed plan.")

    rule()
    h1("Plain-language analogy & the common confusion")
    analogy('Plan mode is measuring twice before you cut. For a quick trim (a one-line fix) you just cut; for rebuilding the staircase (touches 40 files) you measure, sketch, and check the load-bearing walls first.')
    pitfall("The trap answer is 'start coding and switch to plan mode if it gets hard.' If the prompt already states the complexity (dozens of files, service boundaries), the difficulty is not hypothetical — plan now.")

    tip("If the prompt states the complexity (dozens of files, service boundaries), it's "
        "plan mode NOW — not 'maybe later'.")


if __name__ == "__main__":
    main()
```

---

## Task 3.5 — Iterative refinement techniques

**Source:** https://github.com/jacinthpaul/Claude-Certified-Architect/blob/claude/architect-exam-codebase-7ytdjz/domains/domain3_claude_code/task3_5_iterative_refinement.py

### Objective

Apply iterative refinement techniques for progressive improvement. Examples > prose; tests as feedback; interview; batch-vs-sequence.

### Concept

Four techniques for progressively improving Claude's output:

1. CONCRETE input/output examples (2-3): the most effective way to communicate a transformation when prose is interpreted inconsistently. Show the exact before -> after.
2. TEST-DRIVEN iteration: write the test suite first (expected behavior, edge cases, performance), then iterate by sharing test FAILURES — precise, objective feedback.
3. THE INTERVIEW PATTERN: have Claude interview YOU before implementing in an unfamiliar domain — surfaces considerations you hadn't anticipated (cache invalidation? failure modes?).
4. BATCH interacting fixes; SEQUENCE independent ones: if issues interact, describe them ALL in one detailed message; independent issues can be fixed one at a time.

### Instructions

1. Concrete input/output examples beat prose: vague instructions like "Make the dates consistent" are interpreted differently each run. Show 2-3 exact transformations, e.g. `"3/4/25" -> "2025-03-04"`, `"March 4th, 2025" -> "2025-03-04"`, `"04.03.2025" (EU) -> "2025-03-04"`.
2. Test-driven iteration: write the suite FIRST (expected behavior, edge cases, performance). Then iterate by pasting the FAILURES — they become precise, objective feedback (e.g. `FAILED test_handles_null_amount: expected null, got 0.0` -> "Fix null handling so missing amounts return null, not 0.0").
3. The interview pattern: before building in an unfamiliar domain, ask Claude to interview YOU: "What's the cache invalidation strategy? What are the failure modes? What happens on partial writes?" — it surfaces considerations you'd have missed.
4. Batch interacting fixes; sequence independent ones: interacting bugs fixed separately can ping-pong; describing them together lets one fix account for the interaction. Independent issues can be fixed one at a time.

### Acceptance Criteria

Not present as a separate section in the module docstring. The demo includes a `message_strategy(issues)` helper that plans one detailed message for interacting issues and separate messages for independent ones; see the full code below.

### Full code

```python
"""
Domain 3 · Task 3.5 — Iterative refinement techniques.

THE BIG IDEA
============
Four techniques for progressively improving Claude's output:

  1. CONCRETE input/output examples (2-3): the most effective way to communicate a
     transformation when prose is interpreted inconsistently. Show the exact before -> after.
  2. TEST-DRIVEN iteration: write the test suite first (expected behavior, edge cases,
     performance), then iterate by sharing test FAILURES — precise, objective feedback.
  3. THE INTERVIEW PATTERN: have Claude interview YOU before implementing in an unfamiliar
     domain — surfaces considerations you hadn't anticipated (cache invalidation? failure modes?).
  4. BATCH interacting fixes; SEQUENCE independent ones: if issues interact, describe them
     ALL in one detailed message; independent issues can be fixed one at a time.
"""

import sys, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[2]))
from ccarch import banner, concept, h1, h2, wrong, right, tip, note, kv, code, rule, pause, analogy, pitfall


def message_strategy(issues):
    """issues: list of (name, interacts_with_others?)"""
    interacting = [n for n, inter in issues if inter]
    independent = [n for n, inter in issues if not inter]
    plan = []
    if interacting:
        plan.append(f"ONE detailed message describing together: {interacting} "
                    "(so the fix accounts for interactions)")
    for n in independent:
        plan.append(f"Separate message: {n} (independent, fix one at a time)")
    return plan


def main():
    banner("Domain 3 · Task 3.5", "Iterative refinement techniques")
    concept("Domain 3: Claude Code Configuration & Workflows (20%)",
            "Task 3.5 — Apply iterative refinement techniques for progressive improvement",
            "Examples > prose; tests as feedback; interview; batch-vs-sequence")

    h1("1) Concrete input/output examples beat prose")
    wrong('"Make the dates consistent." (vague — interpreted differently each run)')
    right("Show 2-3 exact transformations:")
    code('"3/4/25"            -> "2025-03-04"\n'
         '"March 4th, 2025"   -> "2025-03-04"\n'
         '"04.03.2025" (EU)   -> "2025-03-04"', "before -> after")

    pause("test-driven")
    rule()
    h1("2) Test-driven iteration")
    note("Write the suite FIRST (expected behavior, edge cases, performance). Then iterate "
         "by pasting the FAILURES — they become precise, objective feedback.")
    code("FAILED test_handles_null_amount: expected null, got 0.0\n"
         "-> 'Fix null handling so missing amounts return null, not 0.0'", "failure as feedback")

    rule()
    h1("3) The interview pattern")
    right("Before building in an unfamiliar domain, ask Claude to interview YOU: "
          "'What's the cache invalidation strategy? What are the failure modes? "
          "What happens on partial writes?' — it surfaces considerations you'd have missed.")

    pause("batch vs sequence")
    rule()
    h1("4) Batch interacting fixes; sequence independent ones")
    issues = [
        ("pagination off-by-one", True),
        ("the sort order depends on pagination", True),
        ("rename a log label", False),
    ]
    for step in message_strategy(issues):
        kv("  plan", step)
    note("Interacting bugs fixed separately can ping-pong; describing them together lets "
         "one fix account for the interaction.")

    rule()
    h1("Plain-language analogy & the common confusion")
    analogy("Teaching by showing, not telling. 'Make the dates consistent' is vague; three before-to-after pairs are a worked example the model can copy exactly — like demonstrating a knot instead of describing it.")
    pitfall('When results are inconsistent, learners add MORE prose instructions. Prose is interpreted differently each run; 2-3 concrete input-to-output examples pin the behavior down far better.')

    tip("Show, don't describe (2-3 examples). Tests-as-feedback. Interview before building "
        "in unfamiliar areas. Interacting issues -> one message; independent -> sequence.")


if __name__ == "__main__":
    main()
```

---

## Task 3.6 — Claude Code in CI/CD pipelines

**Source:** https://github.com/jacinthpaul/Claude-Certified-Architect/blob/claude/architect-exam-codebase-7ytdjz/domains/domain3_claude_code/task3_6_cicd.py

### Objective

Integrate Claude Code into CI/CD pipelines. `-p` for non-interactive; structured output; independent review.

### Concept

Running Claude Code with NO human at the keyboard needs specific flags and context discipline:

- `-p / --print` — Non-interactive: process prompt, print, exit. WITHOUT it, the CI job HANGS forever (sample Q10). (`CLAUDE_HEADLESS` and `--batch` DO NOT EXIST.)
- `--output-format json --json-schema` — Force machine-parseable findings so the pipeline can auto-post them as inline PR comments.
- CLAUDE.md in CI — Supplies project context (testing standards, fixture conventions, review criteria) -> better output.
- Independent review instance — The session that GENERATED code is biased reviewing it; a fresh instance catches more issues.
- Prior findings on re-review — Include earlier findings; report only NEW/unaddressed issues -> prevents duplicate comments.
- Existing tests in context — So test generation doesn't duplicate covered scenarios.

### Instructions

- The hang (sample Q10) and its fix: `claude "Analyze this PR for security issues"` -> CI job HANGS waiting for input. Use `claude -p "Analyze this PR for security issues"` (`-p`/`--print`: run, print, exit).
- `CLAUDE_HEADLESS=true` and `--batch` DON'T EXIST. Redirecting stdin from `/dev/null` doesn't address Claude Code's command syntax.
- Structured output for automated PR comments: `claude -p "Review the diff" --output-format json --json-schema review_schema.json`. The pipeline parses the JSON and posts each finding as an inline PR comment.
- Context discipline in CI: CLAUDE.md in CI supplies testing standards, fixtures, review criteria -> better output; an INDEPENDENT review instance (fresh session, no generation bias) catches more issues; include prior findings and report only NEW/unaddressed -> no dupes; existing tests in context so generated tests don't duplicate covered scenarios.
- Why a FRESH instance reviews better: reviewing code in the SAME session that generated it carries its own reasoning and won't question its own decisions. Spin up an INDEPENDENT instance with no generation context (see Task 4.6).

### Acceptance Criteria

Not present as a separate section in the module docstring. The demo covers the `-p` hang fix, structured output for PR comments, and CI context discipline; see the full code below.

### Full code

```python
"""
Domain 3 · Task 3.6 — Claude Code in CI/CD pipelines.

THE BIG IDEA
============
Running Claude Code with NO human at the keyboard needs specific flags and context discipline:

  -p / --print                       Non-interactive: process prompt, print, exit.
                                     WITHOUT it, the CI job HANGS forever (sample Q10).
                                     (CLAUDE_HEADLESS and --batch DO NOT EXIST.)
  --output-format json --json-schema Force machine-parseable findings so the pipeline can
                                     auto-post them as inline PR comments.
  CLAUDE.md in CI                    Supplies project context (testing standards, fixture
                                     conventions, review criteria) -> better output.
  Independent review instance        The session that GENERATED code is biased reviewing it;
                                     a fresh instance catches more issues.
  Prior findings on re-review        Include earlier findings; report only NEW/unaddressed
                                     issues -> prevents duplicate comments.
  Existing tests in context          So test generation doesn't duplicate covered scenarios.
"""

import sys, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[2]))
from ccarch import banner, concept, h1, h2, wrong, right, tip, note, kv, code, rule, pause, analogy, pitfall


def main():
    banner("Domain 3 · Task 3.6", "Claude Code in CI/CD")
    concept("Domain 3: Claude Code Configuration & Workflows (20%)",
            "Task 3.6 — Integrate Claude Code into CI/CD pipelines",
            "-p for non-interactive; structured output; independent review")

    h1("The hang (sample Q10) and its fix")
    wrong('claude "Analyze this PR for security issues"   # CI job HANGS waiting for input')
    code('claude -p "Analyze this PR for security issues"  # -p/--print: run, print, exit',
         "the fix")
    wrong("CLAUDE_HEADLESS=true and --batch DON'T EXIST. Redirecting stdin from /dev/null "
          "doesn't address Claude Code's command syntax.")
    right("Use the -p (or --print) flag. It's the documented non-interactive mode.")

    pause("structured output")
    rule()
    h1("Structured output for automated PR comments")
    code('claude -p "Review the diff" \\\n'
         '  --output-format json \\\n'
         '  --json-schema review_schema.json', "machine-parseable findings")
    note("The pipeline parses the JSON and posts each finding as an inline PR comment.")

    rule()
    h1("Context discipline in CI")
    kv("CLAUDE.md in CI", "supplies testing standards, fixtures, review criteria -> better output")
    kv("Independent review instance", "fresh session (no generation bias) catches more issues")
    kv("Prior findings on re-review", "include them; report only NEW/unaddressed -> no dupes")
    kv("Existing tests in context", "so generated tests don't duplicate covered scenarios")

    rule()
    h1("Why a FRESH instance reviews better")
    wrong("Reviewing code in the SAME session that generated it — it carries its own "
          "reasoning and won't question its own decisions.")
    right("Spin up an INDEPENDENT instance with no generation context. (See Task 4.6.)")

    rule()
    h1("Plain-language analogy & the common confusion")
    analogy('Running Claude in CI is putting a robot on the assembly line — it must never wait for a human to press a key, and it must hand back a labeled form (JSON), not a chatty paragraph.')
    pitfall('The hang is the giveaway: without -p, Claude Code waits for interactive input forever. And invented flags (CLAUDE_HEADLESS, --batch) are always distractors — eliminate them on sight.')

    tip("-p / --print = non-interactive (the #1 CI gotcha). --output-format json + "
        "--json-schema = structured findings. Invented flags (CLAUDE_HEADLESS, --batch) "
        "are always distractors — eliminate on sight.")


if __name__ == "__main__":
    main()
```
