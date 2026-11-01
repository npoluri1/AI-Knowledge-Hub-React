# Exam Bank — Claude Certified Architect (Foundations)

_Compiled from jacinthpaul/Claude-Certified-Architect (github.com/jacinthpaul/Claude-Certified-Architect) — independent community study aid, not affiliated with Anthropic._

_All question banks are embedded verbatim as Python source so no data is lost. Use the interactive practice exam in this app for scored attempts._

## Question Banks

| Bank | File | # Questions |
|---|---|---|
| Sample Questions | exam/sample_questions.py | 12 |
| Practice Questions | exam/practice_questions.py | 18 |
| Mock Exam | exam/mock_bank.py | 60 |
| Cheatsheet | exam/cheatsheet.py | 29 facts |
| Prep Exercises | exam/prep_exercises.py | 3 |

## Sample Questions

**Source:** https://raw.githubusercontent.com/jacinthpaul/Claude-Certified-Architect/claude/architect-exam-codebase-7ytdjz/exam/sample_questions.py

```python
"""
THE 12 OFFICIAL SAMPLE QUESTIONS — interactive walkthroughs
===========================================================
These are the twelve sample questions published in the official Exam Guide, with their
correct answers and the reasoning for why each distractor fails. Each question is tagged
with the scenario, the domain/task it exercises, and the demo file that shows the concept
running.

Run interactively (it prompts A/B/C/D and grades you), or set CCARCH_NONSTOP=1 to print
all questions with answers and explanations (used by run_all.py and CI).

The transferable pattern across ALL twelve:
    root cause + the SIMPLEST reliable mechanism wins.
Distractors are: (1) more prompting where ENFORCEMENT is needed, (2) more infrastructure
where prompting suffices, and (3) features that DON'T EXIST. Spot an invented flag/config
and eliminate it instantly.
"""

import sys, os, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1]))
from ccarch import banner, h1, h2, wrong, right, tip, note, kv, rule, pause
from ccarch.display import _c


QUESTIONS = [
    dict(
        n=1, scenario="Customer Support", maps="D1 T1.4 · demo: domain1/task1_4 · scenario 1",
        q="In 12% of cases the agent skips get_customer and calls lookup_order using only "
          "the customer's stated name, causing misidentified accounts and wrong refunds. "
          "What change most effectively fixes this reliability issue?",
        options={
            "A": "Add a programmatic prerequisite that blocks lookup_order and "
                 "process_refund until get_customer returns a verified customer ID.",
            "B": "Enhance the system prompt to state that verification is mandatory.",
            "C": "Add few-shot examples showing the agent always calling get_customer first.",
            "D": "Implement a routing classifier that enables a subset of tools per request.",
        },
        answer="A",
        why="A required tool SEQUENCE for critical business logic needs DETERMINISTIC "
            "enforcement — a gate. Strengthening the prompt or adding few-shot examples "
            "relies on probabilistic LLM compliance, insufficient when errors move money. "
            "A routing classifier addresses tool AVAILABILITY, not the ORDERING that is the "
            "actual problem.",
    ),
    dict(
        n=2, scenario="Customer Support", maps="D2 T2.1 · demo: domain2/task2_1 · scenario 1",
        q="The agent calls get_customer when users ask about orders. Both tools have minimal "
          "descriptions and accept similar IDs. Most effective FIRST step to improve tool "
          "selection?",
        options={
            "A": "Add 5-8 few-shot examples of correct tool selection to the system prompt.",
            "B": "Expand each tool's description: input formats, example queries, edge "
                 "cases, and boundaries (when to use it vs the similar tool).",
            "C": "Implement a routing layer that parses input and pre-selects the tool.",
            "D": "Consolidate both tools into one lookup_entity tool.",
        },
        answer="B",
        why="Descriptions are the PRIMARY tool-selection mechanism; minimal ones starve the "
            "model of context, so richer descriptions are the low-effort root-cause fix. "
            "Few-shot examples add tokens without fixing the cause; a routing layer is "
            "over-engineered; consolidating the tools is a bigger change than a 'first "
            "step' warrants.",
    ),
    dict(
        n=3, scenario="Customer Support", maps="D5 T5.2 · demo: domain5/task5_2 · scenario 1",
        q="The agent hits 55% first-contact resolution (target 80%): it escalates "
          "straightforward cases and attempts complex policy-exception ones. Best fix for "
          "escalation calibration?",
        options={
            "A": "Add explicit escalation criteria + few-shot examples to the system prompt.",
            "B": "Have the agent self-report a confidence score and route below a threshold.",
            "C": "Deploy a separate classifier trained on historical tickets.",
            "D": "Add sentiment analysis and escalate on high negative sentiment.",
        },
        answer="A",
        why="Root cause = unclear decision boundaries; explicit criteria + few-shot is the "
            "proportionate fix. Self-reported confidence is miscalibrated (overconfident on "
            "hard cases); a separate trained classifier is over-engineered; sentiment "
            "analysis solves a different problem — sentiment ≠ complexity.",
    ),
    dict(
        n=4, scenario="Code Generation", maps="D3 T3.2 · demo: domain3/task3_2 · scenario 2",
        q="You want a /review command available to every developer when they clone or pull "
          "the repo. Where do you create it?",
        options={
            "A": "In .claude/commands/ in the project repository.",
            "B": "In ~/.claude/commands/ in each developer's home directory.",
            "C": "In the CLAUDE.md file at the project root.",
            "D": "In a .claude/config.json file with a commands array.",
        },
        answer="A",
        why="Project-scoped commands in .claude/commands/ are version-controlled and reach "
            "everyone. A personal ~/.claude/ command is not shared; the root CLAUDE.md is for "
            "context, not command definitions; a .claude/config.json commands array describes "
            "a mechanism that doesn't exist.",
    ),
    dict(
        n=5, scenario="Code Generation", maps="D3 T3.4 · demo: domain3/task3_4 · scenario 2",
        q="You must restructure a monolith into microservices: changes across dozens of "
          "files, decisions about service boundaries and dependencies. Which approach?",
        options={
            "A": "Enter plan mode to explore, understand dependencies, and design first.",
            "B": "Start with direct execution; let implementation reveal boundaries.",
            "C": "Direct execution with comprehensive upfront instructions.",
            "D": "Begin direct; switch to plan mode only if complexity emerges.",
        },
        answer="A",
        why="Plan mode is built for large-scale, multi-approach, architectural work. "
            "Starting with direct execution risks costly rework; comprehensive upfront "
            "instructions assume you already know the structure; deferring to plan mode "
            "'only if complexity emerges' ignores that the complexity is ALREADY stated, "
            "not hypothetical.",
    ),
    dict(
        n=6, scenario="Code Generation", maps="D3 T3.3 · demo: domain3/task3_3 · scenario 2",
        q="Distinct areas have different conventions; test files are spread throughout next "
          "to the code they test. You want the right conventions applied AUTOMATICALLY by "
          "file path. Most maintainable approach?",
        options={
            "A": "Rule files in .claude/rules/ with YAML frontmatter glob patterns.",
            "B": "Consolidate everything in the root CLAUDE.md under headers.",
            "C": "Create skills in .claude/skills/ for each code type.",
            "D": "A separate CLAUDE.md in each subdirectory.",
        },
        answer="A",
        why="Glob-pattern rule files (e.g., **/*.test.tsx) apply by path regardless of "
            "directory — essential for scattered files. A single root CLAUDE.md relies on "
            "inference; skills need manual invocation; a per-directory CLAUDE.md can't follow "
            "files spread across many directories.",
    ),
    dict(
        n=7, scenario="Multi-Agent Research", maps="D1 T1.2 · demo: domain1/task1_2 · scenario 3",
        q="Each subagent succeeds, but reports cover only visual arts (missing music, "
          "writing, film). The coordinator's log shows it decomposed into 'digital art', "
          "'graphic design', 'photography'. Most likely root cause?",
        options={
            "A": "The synthesis agent lacks gap-identification instructions.",
            "B": "The coordinator's task decomposition is too narrow.",
            "C": "The web search agent's queries aren't comprehensive enough.",
            "D": "The document analysis agent filters out non-visual sources.",
        },
        answer="B",
        why="The logs show the coordinator only created visual-arts subtasks. Subagents "
            "executed their assignments correctly — the problem is WHAT they were assigned. "
            "The other options blame downstream agents (synthesis, web search, document "
            "analysis) that worked correctly.",
    ),
    dict(
        n=8, scenario="Multi-Agent Research", maps="D5 T5.3 · demo: domain5/task5_3 · scenario 3",
        q="The web search subagent times out. How should that failure flow back to the "
          "coordinator to enable intelligent recovery?",
        options={
            "A": "Structured error context: failure type, attempted query, partial results, "
                 "alternative approaches.",
            "B": "Retry internally with backoff; return a generic 'search unavailable'.",
            "C": "Catch the timeout and return an empty result set marked successful.",
            "D": "Propagate the exception to a top-level handler that terminates the workflow.",
        },
        answer="A",
        why="Structured error context lets the coordinator retry with modifications, try an "
            "alternative, or proceed with partial results. A generic 'search unavailable' "
            "status hides that context; marking a timeout as successful suppresses the error "
            "into silent holes; propagating an exception that terminates the workflow "
            "overreacts by killing the whole run.",
    ),
    dict(
        n=9, scenario="Multi-Agent Research", maps="D2 T2.3 · demo: domain2/task2_3 · scenario 3",
        q="The synthesis agent frequently round-trips through the coordinator to verify "
          "facts (+40% latency). 85% are simple fact-checks, 15% need deeper investigation. "
          "Most effective fix?",
        options={
            "A": "Give synthesis a scoped verify_fact tool for simple lookups; complex ones "
                 "still go through the coordinator.",
            "B": "Have synthesis batch all verifications and return them at the end.",
            "C": "Give synthesis access to all web search tools.",
            "D": "Have the web search agent pre-cache extra context around each source.",
        },
        answer="A",
        why="Least privilege: give synthesis exactly the scoped tool for the common 85% and "
            "keep the complex 15% routed through the coordinator. Batching all verifications "
            "creates blocking dependencies; giving it every web-search tool over-provisions "
            "(it starts searching instead of synthesizing); pre-caching extra context can't "
            "predict what will be needed.",
    ),
    dict(
        n=10, scenario="CI/CD", maps="D3 T3.6 · demo: domain3/task3_6 · scenario 5",
        q="Your pipeline runs `claude \"Analyze this PR\"` but the job hangs waiting for "
          "interactive input. Correct approach to run in an automated pipeline?",
        options={
            "A": 'Add the -p flag: claude -p "Analyze this PR".',
            "B": "Set CLAUDE_HEADLESS=true before running.",
            "C": "Redirect stdin from /dev/null.",
            "D": "Add the --batch flag.",
        },
        answer="A",
        why="-p / --print is the documented non-interactive mode: process, print, exit. "
            "CLAUDE_HEADLESS and --batch reference non-existent features; redirecting stdin "
            "from /dev/null is a Unix workaround that doesn't address Claude Code's command "
            "syntax.",
    ),
    dict(
        n=11, scenario="CI/CD / Cost", maps="D4 T4.5 · demo: domain4/task4_5 · scenario 5/6",
        q="Two workflows use real-time calls: (1) a BLOCKING pre-merge check, (2) an "
          "overnight technical-debt report. A manager proposes switching BOTH to the Batch "
          "API for 50% savings. How do you evaluate it?",
        options={
            "A": "Batch the overnight reports only; keep real-time for pre-merge checks.",
            "B": "Switch both to batch with status polling.",
            "C": "Keep real-time for both to avoid batch result ordering issues.",
            "D": "Switch both to batch with a timeout fallback to real-time.",
        },
        answer="A",
        why="Batch is 50% cheaper but takes up to 24h with NO latency SLA — unfit for a "
            "blocking pre-merge check, ideal for overnight jobs. Switching both to batch "
            "isn't acceptable for blocking work; keeping both real-time forgoes easy savings "
            "and misreads batch ordering (custom_id correlates results); a timeout fallback "
            "adds needless complexity.",
    ),
    dict(
        n=12, scenario="CI/CD / Review", maps="D4 T4.6 · demo: domain4/task4_6 · scenario 5",
        q="A 14-file PR reviewed in one pass gives inconsistent, contradictory results "
          "(detailed for some files, superficial for others; flags a pattern in one file, "
          "approves identical code in another). How to restructure?",
        options={
            "A": "Per-file passes for local issues + a separate cross-file integration pass.",
            "B": "Require developers to split PRs into 3-4 files before review.",
            "C": "Switch to a higher-tier model with a larger context window.",
            "D": "Run three passes; flag only issues appearing in ≥2 of 3.",
        },
        answer="A",
        why="Root cause = attention dilution. Per-file passes give consistent depth and a "
            "separate integration pass catches cross-file issues. Forcing developers to split "
            "PRs shifts the burden to them; a bigger context window misunderstands that more "
            "context ≠ better attention; keeping only issues found in ≥2 of 3 passes "
            "suppresses real, intermittently-caught bugs.",
    ),
]


def ask(qd) -> bool:
    h1(f"Q{qd['n']} — Scenario: {qd['scenario']}")
    note(f"[{qd['maps']}]")
    note(qd["q"])
    print()
    for k in ("A", "B", "C", "D"):
        kv(f"  {k}", qd["options"][k])
    interactive = sys.stdin.isatty() and not os.environ.get("CCARCH_NONSTOP")
    chosen = None
    if interactive:
        try:
            chosen = input(_c("    Your answer (A/B/C/D): ", "dim")).strip().upper()
        except (EOFError, KeyboardInterrupt):
            print()
    correct = qd["answer"]
    if chosen in ("A", "B", "C", "D"):
        if chosen == correct:
            right(f"Correct — {correct}.")
        else:
            wrong(f"You chose {chosen}. Correct answer: {correct}.")
    else:
        right(f"Correct answer: {correct}.")
    note("Why: " + qd["why"])
    return chosen == correct if chosen else None


def main():
    banner("Exam Practice", "The 12 official sample questions, with reasoning")
    note("Pattern to internalize: root cause + simplest reliable mechanism wins. "
         "Distractors = more-prompting-where-enforcement-is-needed, "
         "more-infrastructure-where-prompting-suffices, or invented features.")
    score, answered = 0, 0
    for qd in QUESTIONS:
        pause(f"Q{qd['n']}")
        result = ask(qd)
        if result is not None:
            answered += 1
            score += 1 if result else 0
    rule()
    if answered:
        h1(f"Score: {score}/{answered}")
        note("Exam passing score is 720/1000. Re-study any domain where you missed a "
             "question — each maps to a demo file above.")
    else:
        tip("All 12 follow the same logic. Run interactively (without CCARCH_NONSTOP) to "
            "grade yourself.")


if __name__ == "__main__":
    main()
```

## Practice Questions

**Source:** https://raw.githubusercontent.com/jacinthpaul/Claude-Certified-Architect/claude/architect-exam-codebase-7ytdjz/exam/practice_questions.py

```python
"""
exam/practice_questions.py — authored, exam-style PRACTICE questions
====================================================================
ORIGINAL practice questions written in the style and difficulty of the Foundations exam,
one for each task statement the 12 official sample questions (exam/sample_questions.py) do
NOT already cover. These are study aids, NOT official exam items.

Each is scenario-framed with one root-cause answer and three plausible distractors that
mirror the exam's recurring traps: more prompting where ENFORCEMENT is needed, more
infrastructure where prompting suffices, or a feature that does not exist / solves the
wrong problem.

The console (ui/console) links each question to its task via build_data.py, so every task
now shows at least one question. They are tagged P1..P18 (vs the official Q1..Q12).
"""
import sys
import os
import pathlib

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1]))
from ccarch import banner, h1, kv, note, right, tip, rule

# Each: task, domain, q (prompt), options A-D, answer letter, why.
PRACTICE = [
    dict(task="1.1", domain="d1",
         q="Your agent loop ends each turn by scanning Claude's text for the phrase "
           "'task complete' to decide whether to stop. It sometimes stops early (Claude "
           "mentions the phrase mid-reasoning) and sometimes loops forever. What is the "
           "correct fix?",
         options={
             "A": "Inspect stop_reason: keep looping while it is 'tool_use' and exit when "
                  "it is 'end_turn'.",
             "B": "Add a stricter regex and a longer list of completion phrases to detect "
                  "the end of the task.",
             "C": "Cap the loop at 10 iterations and return whatever the last turn produced.",
             "D": "Ask Claude to always end its final message with a unique sentinel token "
                  "you can match on.",
         },
         answer="A",
         why="Termination must be driven by stop_reason, the structured signal the API "
             "returns. Parsing natural-language text is probabilistic and brittle; "
             "an iteration cap is only a safety net, not the normal stop condition."),

    dict(task="1.3", domain="d1",
         q="A coordinator delegates to a synthesis subagent, but the subagent keeps "
           "producing summaries that ignore the web-search findings the coordinator already "
           "gathered. The coordinator's allowedTools already includes 'Task'. What is the "
           "most likely cause?",
         options={
             "A": "The web-search findings were never written into the synthesis subagent's "
                  "prompt — subagents do not inherit the coordinator's conversation.",
             "B": "The coordinator is missing 'Task' in allowedTools, so the subagent never "
                  "really ran.",
             "C": "The synthesis subagent needs its own web-search tool so it can re-gather "
                  "the findings.",
             "D": "The subagents must be spawned in parallel in one response for context to "
                  "transfer between them.",
         },
         answer="A",
         why="Subagents have isolated context; anything they need must be explicitly placed "
             "in their prompt. The missing-'Task'-tool explanation is contradicted by the "
             "stem; giving synthesis its own web-search tool over-provisions and duplicates "
             "work; parallel spawning affects latency, not whether context transfers."),

    dict(task="1.5", domain="d1",
         q="Three backend tools return timestamps in three formats (Unix epoch, ISO 8601, "
           "and a numeric status code), and the agent frequently misreads dates. You want a "
           "guaranteed, one-place fix the model never has to think about. What do you build?",
         options={
             "A": "A PostToolUse hook that normalizes every tool's date field to one format "
                  "before the model sees it.",
             "B": "A system-prompt instruction telling Claude to carefully convert each "
                  "format whenever it reads one.",
             "C": "Few-shot examples showing the three formats and their conversions.",
             "D": "A separate date-parsing tool the agent calls after every lookup.",
         },
         answer="A",
         why="PostToolUse hooks transform results deterministically before the model "
             "processes them. Prompt instructions and few-shot are probabilistic; "
             "an extra tool the agent must remember to call reintroduces the failure."),

    dict(task="1.6", domain="d1",
         q="You must add comprehensive tests to a large legacy codebase whose structure and "
           "dependencies you do not yet know. Which decomposition strategy fits?",
         options={
             "A": "Dynamic, adaptive decomposition: map the structure, find high-impact "
                  "areas, and generate the next subtasks from what each step discovers.",
             "B": "A fixed prompt-chaining pipeline with the full list of files to test "
                  "defined up front.",
             "C": "One large prompt asking the model to test the entire codebase at once.",
             "D": "Parallel subagents, one per directory, each writing tests independently "
                  "with no shared plan.",
         },
         answer="A",
         why="Open-ended, discovery-driven work needs adaptive decomposition; you cannot "
             "know the steps up front, which rules out a fixed pipeline. One mega-prompt "
             "(C) dilutes attention; uncoordinated parallel agents duplicate and miss "
             "cross-cutting areas."),

    dict(task="1.7", domain="d1",
         q="You resume a 3-day-old investigation session, but several of the files it "
           "analyzed have since been heavily refactored. What is the most reliable approach?",
         options={
             "A": "Start a fresh session seeded with a structured summary of the still-valid "
                  "findings, rather than resuming a session full of stale tool results.",
             "B": "Resume the session as-is; the model will notice the files changed.",
             "C": "Resume with a larger context window so both the old and new state fit.",
             "D": "Fork the session so you can compare the old and new code side by side.",
         },
         answer="A",
         why="When prior tool results are largely stale, a fresh session with an injected "
             "summary beats reasoning over outdated facts. The model will not auto-detect "
             "changed files; context size does not fix staleness; forking is for "
             "exploring divergent approaches from a still-valid baseline."),

    dict(task="2.2", domain="d2",
         q="An MCP refund tool returns a generic 'Operation failed' message for every "
           "failure — bad input, policy limits, and timeouts alike — all with isError set. "
           "The agent retries everything and apologizes generically. Which change most "
           "improves recovery?",
         options={
             "A": "Return structured error metadata: an errorCategory "
                  "(transient/validation/business/permission), an isRetryable boolean, and a "
                  "human-readable message.",
             "B": "Increase the retry count and add exponential backoff for all failures.",
             "C": "Add a system-prompt rule telling the agent which errors to retry.",
             "D": "Have the tool raise the underlying exception so the agent sees the full "
                  "stack trace.",
         },
         answer="A",
         why="The agent cannot choose the right recovery without categorized, structured "
             "errors. Blanket retries waste calls on non-retryable failures; a prompt "
             "rule is probabilistic and blind to the tool's internal cause; a raw stack "
             "trace is noise the agent can't reliably act on."),

    dict(task="2.4", domain="d2",
         q="Your team needs everyone to share a Jira MCP server, authenticated with a token "
           "that must not be committed to the repo. Where and how do you configure it?",
         options={
             "A": "In the project's .mcp.json, with the token referenced as ${JIRA_TOKEN} "
                  "via environment-variable expansion.",
             "B": "In each developer's ~/.claude.json, with the real token pasted in.",
             "C": "In the project's .mcp.json with the real token, then add .mcp.json to "
                  ".gitignore.",
             "D": "As a built-in tool, since Jira is a standard integration.",
         },
         answer="A",
         why="Project-scoped .mcp.json shares the server with the team via version control, "
             "and ${ENV_VAR} expansion keeps the secret out of the committed file. Personal "
             "config isn't shared and hardcodes the secret; gitignoring the config "
             "means teammates don't get the server; Jira is not a built-in tool."),

    dict(task="2.5", domain="d2",
         q="You need to find every file whose name ends in .test.tsx, then within one of "
           "them change a single import line that appears exactly once. Which tools fit, in "
           "order?",
         options={
             "A": "Glob for the file names, then Edit for the unique import line.",
             "B": "Grep for the file names, then Write to rewrite the whole file.",
             "C": "Glob to search the file contents, then Bash sed to change the line.",
             "D": "Read every file to find the matches, then Edit the import.",
         },
         answer="A",
         why="Glob matches file NAMES/paths; Edit makes a targeted change anchored on unique "
             "text. Grep searches CONTENTS, not names; Glob does not search contents "
             "(C); reading every file upfront is wasteful."),

    dict(task="3.1", domain="d3",
         q="A new teammate clones the repo, but Claude ignores the team's coding conventions "
           "for them — even though it follows them for you. Where were the conventions most "
           "likely defined, and what is the fix?",
         options={
             "A": "In your user-level ~/.claude/CLAUDE.md (which never travels via git); move "
                  "them to the project-level CLAUDE.md in the repo.",
             "B": "In the project CLAUDE.md; tell the teammate to run /memory to load it.",
             "C": "In a directory-level CLAUDE.md; move it into your ~/.claude/ so it always "
                  "applies.",
             "D": "Nowhere — Claude just needs a few sessions to learn the conventions.",
         },
         answer="A",
         why="User-level config is personal and not shared through version control, so a "
             "teammate never receives it; the project CLAUDE.md is. Telling them to run "
             "/memory misdiagnoses it (project-level would already reach them); moving it "
             "into ~/.claude/ goes the wrong direction; 'wait a few sessions' is not how "
             "CLAUDE.md works."),

    dict(task="3.5", domain="d3",
         q="Claude's data-transformation output is inconsistent run-to-run despite a "
           "detailed paragraph of instructions. What is the most effective next step?",
         options={
             "A": "Replace the prose with 2-3 concrete input-to-output examples showing the "
                  "exact transformation.",
             "B": "Make the instruction paragraph longer and more emphatic.",
             "C": "Tell Claude to lower its temperature and be more deterministic.",
             "D": "Add a rule telling Claude to double-check its work before responding.",
         },
         answer="A",
         why="Concrete input-to-output examples communicate a transformation far more "
             "reliably than prose, which is interpreted inconsistently. More/longer prose "
             "(B) and exhortations don't pin the behavior down; temperature isn't a "
             "prompt instruction and doesn't fix ambiguous intent."),

    dict(task="4.1", domain="d4",
         q="Your automated comment-accuracy reviewer produces too many false positives, so "
           "developers ignore it. It currently is told to 'only report high-confidence "
           "issues.' What most improves precision?",
         options={
             "A": "Replace the vague modifier with specific, testable criteria — e.g., flag "
                  "a comment only when the claimed behavior contradicts the actual code.",
             "B": "Add 'be conservative and avoid false positives' to the instructions.",
             "C": "Have the model output a confidence score and drop anything below 0.9.",
             "D": "Switch to a larger model so its judgment is more accurate.",
         },
         answer="A",
         why="Specific categorical criteria give a decidable boundary; vague modifiers like "
             "'high-confidence' / 'be conservative' do not move precision. Self-reported "
             "confidence is poorly calibrated; a bigger model doesn't fix an "
             "underspecified task."),

    dict(task="4.2", domain="d4",
         q="An extraction prompt with detailed instructions still sometimes invents a value "
           "when a field is missing from the document. What is the most effective fix?",
         options={
             "A": "Add 2-3 few-shot examples, including one where a missing field is "
                  "correctly extracted as null.",
             "B": "Add a stern instruction: never make up values, use null if missing.",
             "C": "Make the field required in the schema so the model always fills it.",
             "D": "Lower the temperature so the model is less creative.",
         },
         answer="A",
         why="A demonstrated example of the null/edge case teaches the boundary more "
             "reliably than any prose rule. Making the field required actively forces "
             "fabrication; temperature doesn't address missing-data behavior."),

    dict(task="4.3", domain="d4",
         q="You must extract data from documents of an unknown type and need guaranteed "
           "schema-compliant JSON with no syntax errors. Which setup is correct?",
         options={
             "A": "Define a tool whose input_schema is your output schema, set tool_choice "
                  "to 'any', and make fields nullable where a document may lack them.",
             "B": "Ask for JSON in the prompt and parse the text, retrying on syntax errors.",
             "C": "Use a tool with all fields required and tool_choice 'auto'.",
             "D": "Force one specific extraction tool with a fixed tool_choice regardless of "
                  "document type.",
         },
         answer="A",
         why="Tool-use with a JSON schema eliminates syntax errors; 'any' guarantees a tool "
             "is called when the right schema depends on the unknown input; nullable fields "
             "prevent fabrication. Free-text JSON reintroduces syntax errors; required "
             "fields force made-up values; forcing one tool fails when the type "
             "varies."),

    dict(task="4.4", domain="d4",
         q="Your validator fails because a required PO number is missing — and that PO "
           "number is not in the source document at all (it lives in a separate system). "
           "What should the pipeline do?",
         options={
             "A": "Recognize the retry is futile, emit null for the field, and route the "
                  "document to a human / fetch the external source.",
             "B": "Retry with the validation error appended; the model will find the PO "
                  "number.",
             "C": "Retry up to 5 times with backoff before giving up.",
             "D": "Lower the schema's requirements so the field is no longer validated.",
         },
         answer="A",
         why="Retries fix format/structure errors but can never conjure information absent "
             "from the source, so retrying is futile. Silently dropping the validation "
             "(D) hides a real data gap."),

    dict(task="5.1", domain="d5",
         q="In a long support conversation the agent loses track of the exact refund amount "
           "and deadline it promised earlier, and repeated summaries keep getting vaguer. "
           "What is the most reliable fix?",
         options={
             "A": "Maintain a persistent 'case facts' block (amount, dates, order ID, status) "
                  "included in every prompt, outside the summarized history.",
             "B": "Summarize the conversation more often so it stays short.",
             "C": "Increase the model's context window so nothing is dropped.",
             "D": "Ask the model to remember the important details carefully.",
         },
         answer="A",
         why="Numbers and dates are the first casualties of progressive summarization; a "
             "structured facts block kept outside the summary preserves them. More "
             "summarization worsens it; a bigger window doesn't stop "
             "lost-in-the-middle/erosion; 'remember carefully' is no guarantee."),

    dict(task="5.4", domain="d5",
         q="Deep into a long codebase-exploration session, the agent starts answering with "
           "'a typical implementation would...' instead of the specific classes it found "
           "earlier. What does this indicate, and what is the right response?",
         options={
             "A": "Context degradation — externalize findings to a scratchpad file (and/or "
                  "/compact) and delegate verbose investigations to subagents that return "
                  "summaries.",
             "B": "The model has finished exploring and is now generalizing correctly.",
             "C": "The model needs the entire codebase pasted into one prompt.",
             "D": "Restart from scratch and re-read every file in a new session.",
         },
         answer="A",
         why="Answering from 'typical patterns' instead of discovered specifics signals "
             "working-memory pressure; the fix is external memory + delegation/compaction. "
             "It is not correct generalization; pasting everything worsens the "
             "pressure; a full restart wastes the progress a summary could preserve."),

    dict(task="5.5", domain="d5",
         q="An extraction system reports 97% overall accuracy, so a manager wants to fully "
           "automate it. What is the responsible next step before automating?",
         options={
             "A": "Validate accuracy by document type AND by field (a high average can hide "
                  "a 60% pocket), and keep auditing high-confidence outputs via stratified "
                  "sampling.",
             "B": "Automate everything; 97% is well above any reasonable bar.",
             "C": "Route only the lowest-confidence 3% to humans and automate the rest.",
             "D": "Raise the confidence threshold until overall accuracy reads 99%.",
         },
         answer="A",
         why="Aggregate metrics hide segment-level failure; validate per type/field and keep "
             "auditing the trusted lane. Blanket automation ships the hidden pockets; "
             "routing by a global percentage ignores per-segment risk; tuning the "
             "threshold to inflate the headline number games the metric."),

    dict(task="5.6", domain="d5",
         q="A multi-source research report cites a 2021 figure of $136B and a 2024 figure of "
           "$184B for the same market and labels them 'a contradiction in the sources.' What "
           "went wrong, and what is the fix?",
         options={
             "A": "These are different-year data points — a trend, not a contradiction; "
                  "require publication/collection dates in the structured outputs so time "
                  "differences are not misread.",
             "B": "The synthesis agent should pick the more recent value and drop the other.",
             "C": "One source is wrong; flag the report for manual correction.",
             "D": "Average the two figures to resolve the discrepancy.",
         },
         answer="A",
         why="Figures from different years represent change over time, not disagreement; "
             "attaching dates prevents the misreading. Dropping or averaging destroys "
             "real information; assuming an error misdiagnoses a temporal trend."),
]


def main():
    banner("Practice Questions", "Authored, exam-style — one per task the official 12 don't cover")
    note("These are ORIGINAL study questions in the exam's style (P1..P18), not official "
         "items. Each targets a task statement with no official sample question.")
    for i, q in enumerate(PRACTICE, 1):
        h1(f"P{i} — Task {q['task']} ({q['domain'].upper()})")
        note(q["q"])
        print()
        for k in ("A", "B", "C", "D"):
            kv(f"  {k}", q["options"][k])
        right(f"Answer: {q['answer']}")
        note("Why: " + q["why"])
    rule()
    tip("Practice questions follow the same logic as the real exam: the answer is the "
        "simplest mechanism that fixes the actual root cause; distractors over-prompt where "
        "enforcement is needed, over-build where prompting suffices, or invent a feature.")


if __name__ == "__main__":
    main()
```

## Mock Exam

**Source:** https://raw.githubusercontent.com/jacinthpaul/Claude-Certified-Architect/claude/architect-exam-codebase-7ytdjz/exam/mock_bank.py

```python
"""
exam/mock_bank.py — 60-question blueprint-aligned MOCK EXAM bank
============================================================================
Verified, exam-style scenario questions cross-checked against the official Claude
Certified Architect – Foundations Exam Guide. Each item carries the correct answer, a
letter-free explanation (so option order can be shuffled in the console), and the
official Domain / Task Statement reference the question tests.

These power the console's Mock Exam (ui/console). Tagged M1..M60.
Not official exam items; a study aid.
"""
import sys
import os
import pathlib

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1]))
from ccarch import banner, h1, kv, note, right, tip, rule

# Each: task, domain, q (prompt), options A-D, answer letter, why (letter-free), ref.
MOCK_BANK = [
    dict(task='1.1', domain='d1',
         q="You're building an agent that resolves each user request by calling tools in a loop — looking something up, checking a rule, then acting — until the request is fully handled. After every model turn, your control-flow code has to decide whether to run another tool or stop and return the final answer. Which condition should your control-flow code use to make that decision?",
         options={
             'A': 'Parse the assistant\'s text for a keyword such as "done" or "complete"',
             'B': 'Continue while stop_reason is "tool_use"; terminate when stop_reason is "end_turn"',
             'C': 'Stop after a fixed cap of 10 iterations regardless of state',
             'D': 'Stop as soon as any tool returns an error',
         },
         answer='B',
         why='The stop_reason field is the model\'s explicit control signal: "tool_use" means Claude wants a tool executed and the loop should continue; "end_turn" means it has finished. Parsing text and stopping on any error are anti-patterns the exam guide names explicitly, because they misread the model\'s intent, and a hard iteration cap is a safety backstop, not the primary termination mechanism.',
         ref='Domain 1, Task Statement 1.1 — Design and implement agentic loops for autonomous task execution.'),

    dict(task='1.2', domain='d1',
         q="You're designing a multi-agent system where a coordinator delegates sub-tasks to subagents through the Task tool, and you're deciding how much information to pass into each one. When a coordinator agent spawns a subagent via the Task tool, what does the subagent know about the coordinator's prior conversation?",
         options={
             'A': 'It automatically inherits the full conversation history of the coordinator',
             'B': 'It shares a live memory space with the coordinator and all sibling subagents',
             'C': 'Nothing — it starts with an isolated context and knows only what is passed explicitly in its prompt',
             'D': "It inherits only the coordinator's system prompt but not tool results",
         },
         answer='C',
         why="Subagents operate with isolated context; they do not inherit the coordinator's conversation history or share memory between invocations. The coordinator must inject any needed findings directly into the subagent's prompt, which is why explicit context passing is a core design responsibility rather than an automatic behavior.",
         ref='Domain 1, Task Statement 1.2 — Orchestrate multi-agent systems with coordinator-subagent patterns (also relates to Task Statement 1.3).'),

    dict(task='1.3', domain='d1',
         q="You're wiring up a coordinator that should delegate sub-topics to specialist subagents, but at runtime its spawn attempts silently do nothing and no subagents ever run, so you start checking its configuration. For a coordinator agent to invoke subagents through the Task tool, what configuration is required?",
         options={
             'A': 'The coordinator\'s allowedTools must include "Task"',
             'B': 'Each subagent must be granted tool_choice: "any"',
             'C': 'The .mcp.json file must list every subagent as a server',
             'D': 'The coordinator must run in plan mode',
         },
         answer='A',
         why='The Task tool is the mechanism for spawning subagents, and the exam guide states that allowedTools must include "Task" for a coordinator to invoke them. Without it, the coordinator cannot delegate. The other options confuse tool-choice configuration, MCP server scoping, and Claude Code modes with subagent enablement.',
         ref='Domain 1, Task Statement 1.3 — Configure subagent invocation, context passing, and spawning.'),

    dict(task='1.2', domain='d1',
         q='A multi-agent research system on the topic "impact of AI on creative industries" produces reports covering only visual arts, omitting music, writing, and film. Coordinator logs show it split the topic into "AI in digital art," "AI in graphic design," and "AI in photography." Each subagent completed its assigned task correctly. What is the most likely root cause?',
         options={
             'A': 'The synthesis subagent is filtering out non-visual findings',
             'B': "The coordinator's task decomposition was too narrow, so subagent assignments never covered the full topic",
             'C': "The web search subagent's queries were not comprehensive enough",
             'D': 'The document-analysis subagent used overly restrictive relevance criteria',
         },
         answer='B',
         why='The logs show the coordinator decomposed a broad topic into three narrow visual-arts subtasks, so the missing domains were never assigned to any subagent. The downstream agents worked correctly within their scope — the failure is upstream, in decomposition. Blaming synthesis, search, or analysis misattributes a coordinator planning error; the guide calls out the risk of overly narrow decomposition leading to incomplete coverage.',
         ref='Domain 1, Task Statement 1.2 — Orchestrate multi-agent systems with coordinator-subagent patterns. Closely parallels Official Exam Guide Sample Question 7.'),

    dict(task='1.4', domain='d1',
         q='Your customer-support agent must verify a customer\'s identity via get_customer before it is ever allowed to call process_refund. Prompt instructions telling it to "always verify first" still fail in about 12% of cases, causing incorrect refunds. What is the most reliable fix?',
         options={
             'A': 'Add few-shot examples showing the agent always calling get_customer first',
             'B': 'Strengthen the system prompt to state that verification is mandatory',
             'C': 'Add a programmatic prerequisite (a hook/gate) that blocks process_refund until get_customer has returned a verified customer ID',
             'D': 'Lower the model temperature so the agent follows instructions more literally',
         },
         answer='C',
         why='When deterministic compliance is required — especially for financial operations — programmatic enforcement via hooks or prerequisite gates provides guarantees that prompt-based approaches cannot, because prompt instructions have a non-zero failure rate. Few-shot examples and stronger prompts remain probabilistic, and temperature does not enforce tool ordering.',
         ref='Domain 1, Task Statement 1.4 — Implement multi-step workflows with enforcement and handoff patterns. Closely parallels Official Exam Guide Sample Question 1.'),

    dict(task='1.5', domain='d1',
         q='An Agent SDK application receives tool results from several MCP tools that report timestamps inconsistently — some as Unix epochs, some as ISO 8601, some as numeric status codes. You want to normalize these before the model reasons over them. Which mechanism is designed for this?',
         options={
             'A': 'A PostToolUse hook that intercepts and transforms tool results',
             'B': 'A tool_choice: "any" setting on every tool',
             'C': 'A .claude/rules/ file with a glob pattern',
             'D': 'The --resume flag with a session name',
         },
         answer='A',
         why='PostToolUse hooks intercept tool results after execution and before the model processes them — exactly where heterogeneous data formats are normalized deterministically. This scenario (Unix timestamps, ISO 8601, numeric status codes) appears verbatim in Task Statement 1.5. Tool choice governs which tool is called, path rules apply to Claude Code file conventions, and --resume is for session continuity.',
         ref='Domain 1, Task Statement 1.5 — Apply Agent SDK hooks for tool call interception and data normalization.'),

    dict(task='1.3', domain='d1',
         q='Your research pipeline currently runs its subagents one after another, and end-to-end latency is too high because each one waits for the previous to finish. You want them to run in parallel instead. How does the coordinator achieve parallel execution?',
         options={
             'A': 'It emits multiple Task tool calls within a single coordinator response',
             'B': 'It sets max_tokens to a higher value',
             'C': 'It issues one Task call per turn across several sequential turns',
             'D': 'It enables fork_session on each subagent',
         },
         answer='A',
         why="Spawning parallel subagents is done by emitting multiple Task tool calls in a single coordinator response rather than across separate turns, so total time approaches that of the slowest subagent. Anthropic's multi-agent research system writeup reports large latency reductions from this fan-out pattern. One call per turn is sequential by definition; max_tokens affects output length, and fork_session branches a session for divergent exploration, not parallel fan-out.",
         ref='Domain 1, Task Statement 1.3 — Configure subagent invocation, context passing, and spawning.'),

    dict(task='1.3', domain='d1',
         q="A coordinator prompt for research subagents currently gives rigid step-by-step procedural instructions and produces brittle, low-coverage results. Following Anthropic's guidance, how should the coordinator prompt be written to improve subagent adaptability?",
         options={
             'A': 'Specify research goals and quality criteria rather than exact procedural steps',
             'B': 'Provide the exact sequence of tool calls each subagent must make',
             'C': "Remove all instructions and rely on the model's defaults",
             'D': 'Instruct each subagent to route every decision back to the coordinator',
         },
         answer='A',
         why='Task Statement 1.3 calls for coordinator prompts that specify research goals and quality criteria rather than step-by-step procedural instructions, letting subagents adapt to what they discover. Each subagent still needs an objective, an output format, tool guidance, and clear task boundaries. Rigid tool sequences reduce adaptability, no instructions removes needed direction, and routing every decision back creates unnecessary round-trips and latency.',
         ref='Domain 1, Task Statement 1.3 — Configure subagent invocation, context passing, and spawning.'),

    dict(task='2.3', domain='d2',
         q='Your synthesis subagent frequently needs to verify simple facts (dates, names, statistics) while combining findings. Currently each verification routes back through the coordinator to the web-search subagent, adding 2–3 round trips and increasing latency by 40%. Evaluation shows 85% of verifications are simple fact-checks and 15% require deeper investigation. What is the most effective change?',
         options={
             'A': 'Give the synthesis subagent access to all web-search tools so it can handle everything itself',
             'B': 'Give the synthesis subagent a scoped verify_fact tool for simple lookups, while complex verifications still route through the coordinator',
             'C': 'Batch all verification needs and send them to the coordinator at the end of the synthesis pass',
             'D': 'Have the search subagent pre-cache extra context around every source in case synthesis needs it',
         },
         answer='B',
         why="A scoped cross-role tool applies least privilege: it gives synthesis exactly what it needs for the common 85% case while preserving coordinator routing for the complex 15% — the guide's own example of a scoped verify_fact tool for high-frequency needs. Full tool access violates separation of concerns, batching breaks dependencies between verified facts, and speculative caching cannot reliably predict what will be needed.",
         ref='Domain 2, Task Statement 2.3 — Distribute tools appropriately across agents and configure tool choice. Closely parallels Official Exam Guide Sample Question 9.'),

    dict(task='1.6', domain='d1',
         q="You're structuring a multi-step workflow and weighing a fixed pipeline of predefined steps against a plan that adapts as it discovers more about the task. When should you choose a fixed sequential pipeline (prompt chaining) over dynamic adaptive decomposition for a workflow?",
         options={
             'A': 'When the task is open-ended investigation whose subtasks depend on intermediate discoveries',
             'B': 'When the workflow is a predictable, multi-aspect review with known steps (e.g., analyze each file, then a cross-file pass)',
             'C': 'Whenever more than two subagents are involved',
             'D': 'Only when the model does not support tool use',
         },
         answer='B',
         why="Prompt chaining fits predictable, well-understood multi-step workflows where the steps are known in advance — the guide's example is analyzing each file individually and then running a cross-file integration pass. Open-ended investigation whose next steps depend on what is found calls for dynamic, adaptive decomposition. Subagent count and tool-use support are not the deciding factors.",
         ref='Domain 1, Task Statement 1.6 — Design task decomposition strategies for complex workflows.'),

    dict(task='1.4', domain='d1',
         q='A customer sends a single message containing three distinct issues (a billing error, a shipping delay, and an account lockout). What is the recommended way to handle this multi-concern request?',
         options={
             'A': 'Escalate immediately to a human because multiple issues are too complex',
             'B': 'Handle only the first issue mentioned and ask the customer to resubmit the others',
             'C': 'Decompose the request into distinct items, investigate each (in parallel where possible) using shared context, then synthesize a unified resolution',
             'D': 'Pick the highest-priority issue by sentiment and ignore the rest',
         },
         answer='C',
         why='Task Statement 1.4 describes decomposing multi-concern customer requests into distinct items, investigating each in parallel using shared context, then synthesizing a unified resolution. Immediate escalation and handling one issue fail the customer, and sentiment-based prioritization is an unreliable proxy that drops legitimate concerns.',
         ref='Domain 1, Task Statement 1.4 — Implement multi-step workflows with enforcement and handoff patterns.'),

    dict(task='1.5', domain='d1',
         q='Your support agent can issue refunds, and policy requires that any refund over $500 be blocked and redirected to a human — with no way for the model to talk its way past it. You decide to enforce this with an Agent SDK hook. Which hook pattern enforces this deterministically?',
         options={
             'A': 'A PostToolUse hook that logs the refund after it executes',
             'B': 'A tool-call interception hook (a PreToolUse-style gate) that blocks the process_refund call when the amount exceeds the threshold and redirects to escalation',
             'C': 'A system-prompt instruction telling the agent never to exceed $500',
             'D': 'Setting tool_choice to "none" for the refund tool',
         },
         answer='B',
         why="A hook that intercepts outgoing tool calls can block policy-violating actions before they execute and redirect them to an alternative workflow — the guide's exact example is blocking refunds exceeding $500 and redirecting to human escalation. A PostToolUse log runs after the refund already happened, a prompt instruction is probabilistic, and disabling the tool entirely prevents legitimate refunds rather than conditionally gating them.",
         ref='Domain 1, Task Statement 1.5 — Apply Agent SDK hooks for tool call interception and data normalization.'),

    dict(task='1.7', domain='d1',
         q='You are resuming a Claude Code investigation session after several analyzed files have been substantially modified. The prior tool results are now stale. What is the most reliable approach?',
         options={
             'A': 'Resume with --resume and rely on the old tool results as-is',
             'B': 'Start a fresh session and inject a structured summary of the current state, informing the agent about the specific file changes',
             'C': 'Fork the stale session with fork_session and continue both branches',
             'D': 'Increase max_tokens so the old context fits alongside the new',
         },
         answer='B',
         why='Task Statement 1.7 states that starting a new session with a structured summary is more reliable than resuming with stale tool results, and that a resumed agent should be informed about changes to previously analyzed files. Blind --resume carries stale results forward, forking duplicates the stale context into two branches, and max_tokens does not address context correctness.',
         ref='Domain 1, Task Statement 1.7 — Manage session state, resumption, and forking.'),

    dict(task='1.7', domain='d1',
         q='You want to explore two different refactoring approaches from the same analyzed starting point without one contaminating the other, and while planning you come across fork_session. What is the primary purpose of fork_session in the Agent SDK / Claude Code?',
         options={
             'A': 'To run two independent branches from a shared analysis baseline to explore divergent approaches',
             'B': 'To permanently merge two separate sessions into one',
             'C': 'To compress the context window of the current session',
             'D': 'To convert a subagent into a coordinator',
         },
         answer='A',
         why='fork_session creates independent branches from a shared analysis baseline so you can explore divergent approaches — for example, comparing two testing strategies or refactoring approaches — without cross-contaminating them. It does not merge sessions, compress context (that is what /compact does), or change agent roles.',
         ref='Domain 1, Task Statement 1.7 — Manage session state, resumption, and forking.'),

    dict(task='1.4', domain='d1',
         q='A support agent handling a mid-process escalation must hand off to a human who cannot see the conversation transcript. What should the structured handoff summary include?',
         options={
             'A': "Only the customer's raw message text",
             'B': 'The customer ID, root cause analysis, refund amount, and recommended action',
             'C': 'A confidence score from the model and nothing else',
             'D': 'The full untrimmed tool output from every call in the session',
         },
         answer='B',
         why='Because the human agent lacks the transcript, the handoff must be a compiled structured summary — customer ID, root cause, relevant amounts, and a recommended action — so the human can act immediately. This exact field list appears in Task Statement 1.4. Raw message text lacks analysis, a lone confidence score is not actionable, and dumping every tool output buries the signal.',
         ref='Domain 1, Task Statement 1.4 — Implement multi-step workflows with enforcement and handoff patterns.'),

    dict(task='1.1', domain='d1',
         q="You're deciding whether a new automation should be built as a model-driven agent or as a hard-coded, pre-configured decision tree. Which of the following is the clearest example of when an agentic architecture (model-driven decision-making) is preferable to a pre-configured decision tree?",
         options={
             'A': 'A workflow where the exact sequence of steps is fixed and known in advance',
             'B': 'An open-ended task where the next action genuinely depends on information discovered at each step',
             'C': 'A single-call classification with three fixed output categories',
             'D': 'A deterministic identity-verification gate before a financial transaction',
         },
         answer='B',
         why='Agentic, model-driven control shines when the path cannot be fully specified upfront and Claude must reason about the next tool based on newly discovered context — the core distinction Task Statement 1.1 draws against pre-configured decision trees. Fixed sequences, simple classification, and deterministic compliance gates are better served by pre-configured logic or programmatic enforcement.',
         ref='Domain 1, Task Statement 1.1 — Design and implement agentic loops for autonomous task execution.'),

    dict(task='2.1', domain='d2',
         q='Production logs show your agent often calls get_customer when users ask about orders (e.g., "check my order #12345") instead of lookup_order. Both tools have minimal one-line descriptions and accept similar identifiers. What is the most effective first step?',
         options={
             'A': 'Add 5–8 few-shot examples to the system prompt showing order queries routing to lookup_order',
             'B': "Expand each tool's description to include input formats, example queries, edge cases, and when to use it versus similar tools",
             'C': 'Add a keyword-based routing layer that pre-selects the tool before each turn',
             'D': 'Consolidate both tools into one lookup_entity tool that guesses the backend',
         },
         answer='B',
         why="Tool descriptions are the primary mechanism LLMs use for tool selection; minimal descriptions are the root cause of misrouting among similar tools, and enriching them is the low-effort, high-leverage first fix. Few-shot examples add token overhead without addressing the cause, a routing layer is over-engineered and bypasses the model's language understanding, and consolidation is a larger architectural change than a first step warrants.",
         ref='Domain 2, Task Statement 2.1 — Design effective tool interfaces with clear descriptions and boundaries. Closely parallels Official Exam Guide Sample Question 2.'),

    dict(task='2.2', domain='d2',
         q='An MCP tool fails because the backend database is temporarily overloaded. Which structured error response best enables the agent to recover appropriately?',
         options={
             'A': '{ "isError": true, "errorCategory": "transient", "isRetryable": true, "description": "..." }',
             'B': 'A generic "Operation failed" string with no metadata',
             'C': 'An empty result set marked as success (isError: false)',
             'D': 'A thrown exception that terminates the whole session',
         },
         answer='A',
         why='A structured error with isError: true, an errorCategory of transient, and isRetryable: true tells the agent the request is valid and should succeed on retry — the structured-metadata pattern Task Statement 2.2 prescribes. A generic message hides recovery information, marking failure as success suppresses the error and risks bad decisions, and terminating the session prevents any recovery.',
         ref='Domain 2, Task Statement 2.2 — Implement structured error responses for MCP tools.'),

    dict(task='2.2', domain='d2',
         q="You're designing the structured error responses your MCP tools return so the agent retries only what is safe to retry and stops wasting calls on failures that will never succeed. Which pairing of MCP error category and retry behavior is correct?",
         options={
             'A': 'A business-rule violation (e.g., refund exceeds policy limit) → retryable',
             'B': 'A validation error (malformed input) → retryable without changes',
             'C': 'A transient timeout → retryable; a permission error → not retryable',
             'D': 'All errors → retryable with exponential backoff',
         },
         answer='C',
         why='Transient errors (timeouts, service unavailability) are retryable; permission and business-rule errors are not, because retrying the identical request will keep failing. Business violations are non-retryable policy outcomes that need customer-friendly explanations, validation errors require changed input rather than a blind retry, and treating all errors as retryable wastes attempts on permanent failures.',
         ref='Domain 2, Task Statement 2.2 — Implement structured error responses for MCP tools.'),

    dict(task='2.3', domain='d2',
         q='An agent has access to 18 tools and frequently selects the wrong one, even when instructed to search first. According to CCA-F guidance, what is the most effective architectural change?',
         options={
             'A': 'Rewrite all 18 tool descriptions to be longer',
             'B': 'Combine all 18 into one monolithic tool',
             'C': "Reduce each agent's tool set to those relevant to its role (roughly 4–5), distributing tools across specialized agents",
             'D': 'Add better error handling so the agent can recover after picking the wrong tool',
         },
         answer='C',
         why='Task Statement 2.3 states that giving an agent too many tools (e.g., 18 instead of 4–5) degrades selection reliability by increasing decision complexity; scoping each agent to the tools its role needs, distributed across specialized agents, is the recommended fix. Longer descriptions do not solve decision overload, a monolithic tool hides distinct capabilities, and recovery handling treats the symptom rather than the cause.',
         ref='Domain 2, Task Statement 2.3 — Distribute tools appropriately across agents and configure tool choice.'),

    dict(task='4.3', domain='d4',
         q='You have three extraction schemas (invoice, receipt, contract) and the incoming document type is unknown. You need the model to always produce structured output rather than conversational text, but it may choose which schema fits. Which tool_choice setting fits?',
         options={
             'A': '"auto"',
             'B': '"any"',
             'C': '{"type": "tool", "name": "extract_invoice"}',
             'D': '"none"',
         },
         answer='B',
         why='tool_choice: "any" forces the model to call one of the provided tools but lets it choose which — the guide\'s prescribed setting for guaranteeing structured output when multiple extraction schemas exist and the document type is unknown. "auto" permits a plain-text response, forced selection locks to one schema regardless of document type, and "none" blocks tool calls entirely.',
         ref='Domain 4, Task Statement 4.3 — Enforce structured output using tool use and JSON schemas (also relates to Task Statement 2.3).'),

    dict(task='2.3', domain='d2',
         q="You're assembling a document-processing pipeline where several enrichment tools depend on metadata that another tool produces, so extract_metadata must always run before any enrichment tools. You want to guarantee that ordering rather than hope the model picks it. Which configuration guarantees this ordering on the first call?",
         options={
             'A': 'tool_choice: "auto"',
             'B': 'tool_choice: "any"',
             'C': 'tool_choice: {"type": "tool", "name": "extract_metadata"} on the first call, then "auto" for later steps',
             'D': 'Listing extract_metadata first in the tools array',
         },
         answer='C',
         why='Forced tool selection guarantees a specific named tool runs first — the guide\'s own example is forcing extract_metadata before enrichment tools — and switching to "auto" in follow-up turns lets the model proceed with the remaining steps. "auto" and "any" do not guarantee which tool is called, and mere ordering in the tools array does not enforce selection.',
         ref='Domain 2, Task Statement 2.3 — Distribute tools appropriately across agents and configure tool choice (also relates to Task Statement 4.3).'),

    dict(task='2.4', domain='d2',
         q='Where should a shared MCP server used by the whole team (e.g., a GitHub server needing a token) be configured, and how should the credential be handled?',
         options={
             'A': 'In user-level ~/.claude.json, with the token hard-coded',
             'B': 'In project-level .mcp.json, using environment-variable expansion such as ${GITHUB_TOKEN}',
             'C': 'In the root CLAUDE.md file as plain text',
             'D': "In each developer's shell profile only",
         },
         answer='B',
         why='Project-scoped.mcp.json is committed to version control so all teammates get the server, and environment-variable expansion (${GITHUB_TOKEN}) manages credentials without committing secrets — both named explicitly in Task Statement 2.4. User-level config is not shared and hard-coding leaks secrets, CLAUDE.md is for instructions rather than server config, and shell-profile-only setup is not shared or reproducible.',
         ref='Domain 2, Task Statement 2.4 — Integrate MCP servers into Claude Code and agent workflows.'),

    dict(task='2.4', domain='d2',
         q='Your agent keeps preferring the built-in Grep tool over a more capable custom MCP tool that could answer the query better. What is the recommended fix?',
         options={
             'A': 'Delete the built-in Grep tool from the environment',
             'B': "Enhance the MCP tool's description to clearly explain its capabilities and outputs so the model prefers it when appropriate",
             'C': 'Force tool_choice: "any" on every request',
             'D': 'Move the MCP server to user scope',
         },
         answer='B',
         why='The model routes on tool descriptions; Task Statement 2.4 specifically calls for enhancing MCP tool descriptions to explain capabilities and outputs in detail, preventing the agent from preferring built-in tools like Grep over more capable MCP tools. Removing built-ins is heavy-handed and may break other flows, forcing a tool call does not fix which tool is chosen, and changing scope is irrelevant to selection quality.',
         ref='Domain 2, Task Statement 2.4 — Integrate MCP servers into Claude Code and agent workflows.'),

    dict(task='2.4', domain='d2',
         q="While integrating an MCP server into your workflow, you're deciding whether to expose certain capabilities as tools the model calls or as resources it reads. When should MCP resources (rather than tools) be used?",
         options={
             'A': 'To perform state-changing actions such as processing a refund',
             'B': 'To expose content catalogs (e.g., issue summaries, documentation hierarchies, database schemas) so the agent has visibility without exploratory tool calls',
             'C': 'To enforce workflow ordering between two tools',
             'D': 'To normalize timestamps from different services',
         },
         answer='B',
         why="MCP resources expose readable content catalogs — the guide's examples are issue summaries, documentation hierarchies, and database schemas — giving agents visibility into available data and reducing exploratory tool calls. Actions like refunds are tools, ordering enforcement is a tool_choice/hooks concern, and timestamp normalization is a PostToolUse hook task.",
         ref='Domain 2, Task Statement 2.4 — Integrate MCP servers into Claude Code and agent workflows.'),

    dict(task='2.5', domain='d2',
         q='While setting up a test-coverage sweep, a developer needs to find every file matching **/*.test.tsx across a large codebase before editing any of them. Which built-in tool is appropriate for locating them, and why?',
         options={
             'A': 'Grep, because it searches file contents for patterns',
             'B': 'Glob, because it matches file paths by name/extension patterns',
             'C': 'Read, because it loads file contents',
             'D': 'Bash, because only shell commands can list files',
         },
         answer='B',
         why="Glob matches files by path/name patterns — the guide's own example for Glob selection is **/*.test.tsx. Grep searches inside file contents for text such as function names or error messages, Read loads a known file's contents, and while Bash could work, the purpose-built tool is Glob.",
         ref='Domain 2, Task Statement 2.5 — Select and apply built-in tools (Read, Write, Edit, Bash, Grep, Glob) effectively.'),

    dict(task='2.5', domain='d2',
         q="You ask the agent to change one line in a file, but the Edit operation fails because the anchor text it is trying to match appears in more than one place in the file, so the change isn't unique. What is the recommended fallback?",
         options={
             'A': 'Retry Edit several times until it succeeds',
             'B': 'Use Read to load the full file, then Write the modified contents',
             'C': 'Delete the file and recreate it from scratch',
             'D': 'Switch to Grep to make the change',
         },
         answer='B',
         why="When Edit cannot find a unique text match, the guide's recommended fallback is Read + Write: load the full contents, then write back the modification reliably. Blind retries will keep failing on non-unique text, deleting and recreating risks data loss, and Grep only searches — it cannot modify files.",
         ref='Domain 2, Task Statement 2.5 — Select and apply built-in tools (Read, Write, Edit, Bash, Grep, Glob) effectively.'),

    dict(task='2.1', domain='d2',
         q="Your team exposed a single generic analyze_document tool, and the agent keeps misusing it because it does too many unrelated things and its description can't clearly say when to call it. Following tool-design best practices, what is the better structure?",
         options={
             'A': 'Keep it generic but add a longer description',
             'B': 'Split it into purpose-specific tools with defined I/O contracts (e.g., extract_data_points, summarize_content, verify_claim_against_source)',
             'C': 'Rename it to analyze_content without changing behavior',
             'D': 'Give it tool_choice: "any" so it is always called',
         },
         answer='B',
         why='Splitting an overloaded generic tool into purpose-specific tools with clear input/output contracts improves selection reliability and predictability — the guide uses exactly this analyze_document split as its example. A longer description does not fix functional overlap, a rename leaves the ambiguity intact, and forcing the tool does not address that it conflates multiple purposes.',
         ref='Domain 2, Task Statement 2.1 — Design effective tool interfaces with clear descriptions and boundaries.'),

    dict(task='2.3', domain='d2',
         q='In your multi-agent pipeline, a synthesis subagent is attempting web searches even though search is outside its role, and the extra freedom is producing poor, unfocused results. What is the best corrective design?',
         options={
             'A': 'Give every subagent access to all tools for flexibility',
             'B': "Restrict each subagent's tool set to those relevant to its role, preventing cross-specialization misuse",
             'C': "Increase the coordinator's max_tokens",
             'D': 'Move the search tool into CLAUDE.md',
         },
         answer='B',
         why="Task Statement 2.3 notes that agents with tools outside their specialization tend to misuse them — its example is precisely a synthesis agent attempting web searches — and prescribes restricting each subagent's tool set to its role. Universal tool access makes the problem worse, max_tokens is unrelated, and CLAUDE.md is Claude Code project configuration, not a tool-distribution mechanism.",
         ref='Domain 2, Task Statement 2.3 — Distribute tools appropriately across agents and configure tool choice.'),

    dict(task='2.2', domain='d2',
         q="One of your MCP tools runs a query that legitimately returns no matching records — an empty result, not a malfunction — and you want the agent to treat that differently from an actual error. How should a 'no results' outcome be distinguished from a failure?",
         options={
             'A': 'Return isError: true so the agent retries',
             'B': 'Return a valid empty result (isError: false, e.g., resultCount: 0), distinct from an access failure',
             'C': 'Throw an exception to signal "no data"',
             'D': 'Return the string "search unavailable"',
         },
         answer='B',
         why='A successful query with zero matches is not an error; it should be reported as a valid empty result (isError: false) so the agent does not waste retries. The guide explicitly requires distinguishing access failures (which need retry decisions) from valid empty results. Marking it as an error triggers pointless recovery, and a generic "unavailable" string conflates a valid empty result with an access failure.',
         ref='Domain 2, Task Statement 2.2 — Implement structured error responses for MCP tools (also relates to Task Statement 5.3).'),

    dict(task='3.2', domain='d3',
         q='You want a custom /review slash command available to every developer automatically when they clone or pull the repository. Where should the command file live?',
         options={
             'A': 'In .claude/commands/ in the project repository',
             'B': "In ~/.claude/commands/ in each developer's home directory",
             'C': 'In the root CLAUDE.md file',
             'D': 'In a .claude/config.json with a commands array',
         },
         answer='A',
         why='Project-scoped commands in.claude/commands/ are version-controlled and automatically available to everyone who clones or pulls the repo. ~/.claude/commands/ is personal and not shared, CLAUDE.md holds instructions and context rather than command definitions, and a config.json commands array is not a real Claude Code mechanism.',
         ref='Domain 3, Task Statement 3.2 — Create and configure custom slash commands and skills. Closely parallels Official Exam Guide Sample Question 4.'),

    dict(task='3.1', domain='d3',
         q='A new team member reports that Claude Code is not applying instructions that the rest of the team relies on. Those instructions were placed in ~/.claude/CLAUDE.md. What is the most likely cause?',
         options={
             'A': 'The instructions were written in the wrong Markdown syntax',
             'B': 'User-level ~/.claude/CLAUDE.md is personal and is not shared via version control, so teammates never receive it',
             'C': 'The project has too many CLAUDE.md files',
             'D': 'The /memory command is disabled',
         },
         answer='B',
         why='Instructions in user-level ~/.claude/CLAUDE.md apply only to that user and are not shared through version control, so a teammate never receives them — this exact diagnosis scenario appears in Task Statement 3.1, and the fix is moving them to project-level configuration. Markdown syntax is not the issue, file count is unrelated, and /memory is a diagnostic command for inspecting loaded memory, not a cause.',
         ref='Domain 3, Task Statement 3.1 — Configure CLAUDE.md files with appropriate hierarchy, scoping, and modular organization.'),

    dict(task='3.3', domain='d3',
         q='Your codebase has test files (e.g., Button.test.tsx) spread throughout many directories, and you want the same testing conventions applied whenever any test file is edited, regardless of location. What is the most maintainable approach?',
         options={
             'A': 'Put a separate CLAUDE.md in every subdirectory that contains tests',
             'B': 'Create a .claude/rules/ file with YAML frontmatter using a glob such as **/*.test.tsx',
             'C': 'Put all conventions in root CLAUDE.md under headers and rely on Claude to infer which apply',
             'D': 'Create a skill and hope Claude invokes it for each test file',
         },
         answer='B',
         why='Path-specific rules in.claude/rules/ with glob frontmatter (paths: ["**/*.test.tsx"]) load only when matching files are edited, applying conventions by file type regardless of directory — the guide\'s stated advantage over directory-bound CLAUDE.md files for conventions spanning the codebase. Per-directory files cannot easily cover scattered files, root-file inference is unreliable, and skills require invocation rather than automatic path-based loading.',
         ref='Domain 3, Task Statement 3.3 — Apply path-specific rules for conditional convention loading. Closely parallels Official Exam Guide Sample Question 6.'),

    dict(task='3.2', domain='d3',
         q="You're authoring a skill whose discovery step produces a lot of verbose output, and you don't want that output cluttering the main conversation's context. Which SKILL.md frontmatter option runs a skill in an isolated sub-agent context so its verbose output does not pollute the main conversation?",
         options={
             'A': 'disable-model-invocation: true',
             'B': 'context: fork',
             'C': 'argument-hint: "[module]"',
             'D': 'user-invocable: false',
         },
         answer='B',
         why='context: fork runs the skill in an isolated sub-agent context, preventing verbose or exploratory skill output (e.g., codebase analysis, brainstorming) from polluting the main conversation. disable-model-invocation prevents Claude from invoking the skill automatically, argument-hint prompts developers for required parameters, and user-invocable: false hides a skill from user invocation — none provide context isolation.',
         ref='Domain 3, Task Statement 3.2 — Create and configure custom slash commands and skills.'),

    dict(task='3.4', domain='d3',
         q='You are restructuring a monolithic application into microservices — dozens of files, service-boundary decisions, and multiple valid approaches. Which Claude Code mode should you use?',
         options={
             'A': 'Direct execution, making changes incrementally and letting boundaries emerge',
             'B': 'Plan mode, to explore the codebase and design an approach before making changes',
             'C': 'Direct execution with a single comprehensive upfront instruction',
             'D': 'Start in direct execution and switch to plan mode only if complexity appears',
         },
         answer='B',
         why='Plan mode is designed for complex tasks involving large-scale changes, multiple valid approaches, and architectural decisions — exactly what monolith-to-microservices restructuring requires — and enables safe exploration and design before committing changes. Incremental direct execution risks costly rework when dependencies surface late, one-shot instructions assume the right structure is already known, and ignores that the complexity is already stated upfront.',
         ref='Domain 3, Task Statement 3.4 — Determine when to use plan mode vs direct execution. Closely parallels Official Exam Guide Sample Question 5.'),

    dict(task='3.4', domain='d3',
         q="You're deciding, task by task, whether to jump straight into changes or to explore and plan first. For which task is direct execution (not plan mode) the appropriate choice?",
         options={
             'A': 'Migrating a library across 45+ files',
             'B': 'Choosing between two integration approaches with different infrastructure',
             'C': 'Adding a single date-validation conditional to one function with a clear stack trace',
             'D': 'Restructuring a monolith into microservices',
         },
         answer='C',
         why="Direct execution suits simple, well-scoped changes — the guide's own examples include adding a date-validation conditional and single-file bug fixes with a clear stack trace. The other options involve large-scale changes, architectural decisions, or dozens of files, all cases where plan mode's explore-then-execute workflow prevents rework.",
         ref='Domain 3, Task Statement 3.4 — Determine when to use plan mode vs direct execution.'),

    dict(task='3.6', domain='d3',
         q='Your CI job runs claude "Analyze this pull request for security issues" and hangs indefinitely, waiting for interactive input. What is the correct fix?',
         options={
             'A': 'Add the -p (--print) flag to run non-interactively',
             'B': 'Set an environment variable CLAUDE_HEADLESS=true',
             'C': 'Redirect stdin from /dev/null',
             'D': 'Add a --batch flag',
         },
         answer='A',
         why="The -p (or --print) flag is the documented way to run Claude Code in non-interactive mode: it processes the prompt, prints the result to stdout, and exits — exactly what CI/CD pipelines require. CLAUDE_HEADLESS and --batch are non-existent features, and redirecting stdin is a Unix workaround that does not properly address the CLI's design.",
         ref='Domain 3, Task Statement 3.6 — Integrate Claude Code into CI/CD pipelines. Closely parallels Official Exam Guide Sample Question 10.'),

    dict(task='3.6', domain='d3',
         q="In a CI pipeline you need Claude Code's review findings as machine-parseable output that can be posted as inline PR comments. Which flags should you use?",
         options={
             'A': '--output-format json together with --json-schema',
             'B': '--verbose and --color',
             'C': '--resume with a session name',
             'D': '--compact',
         },
         answer='A',
         why='Task Statement 3.6 names --output-format json with --json-schema as the CLI flags for enforcing structured, machine-parseable output in CI contexts, which downstream scripts can post as inline PR comments. Verbose/color flags affect display, --resume is for session continuity, and /compact reduces context usage rather than shaping output.',
         ref='Domain 3, Task Statement 3.6 — Integrate Claude Code into CI/CD pipelines.'),

    dict(task='3.6', domain='d3',
         q="Your CI runs a Claude Code review on every push to a pull request, and reviewers are complaining that each re-run reposts the same comments they've already seen. When re-running an automated code review after new commits, how do you avoid duplicate PR comments?",
         options={
             'A': 'Delete all prior comments before every run',
             'B': 'Include prior review findings in context and instruct Claude to report only new or still-unaddressed issues',
             'C': 'Lower the model temperature',
             'D': 'Run the review only once and never re-run it',
         },
         answer='B',
         why="Supplying the prior review findings in context and instructing Claude to report only new or still-unaddressed issues is the guide's prescribed way to avoid duplicate comments across review runs. Deleting comments loses history and review continuity, temperature does not address duplication, and skipping re-runs defeats iterative review.",
         ref='Domain 3, Task Statement 3.6 — Integrate Claude Code into CI/CD pipelines.'),

    dict(task='3.6', domain='d3',
         q="You're setting up a CI stage where Claude Code first generates code and, later in the pipeline, reviews it, and a colleague asks why the review shouldn't reuse the generating session. Why is it recommended that a code-review pass in CI run in a session independent from the one that generated the code?",
         options={
             'A': 'Independent sessions are cheaper to run',
             'B': 'The generating session retains its reasoning context and is less likely to question its own decisions; an independent instance catches more issues',
             'C': 'The same session cannot output JSON',
             'D': 'Independent sessions have larger context windows',
         },
         answer='B',
         why='A session that generated code carries the reasoning and assumptions behind it, making it less likely to challenge its own choices; an independent review instance without that context evaluates the result on its own terms and surfaces more issues. The guide calls this session context isolation. Cost, JSON output, and window size are not the reason.',
         ref='Domain 3, Task Statement 3.6 — Integrate Claude Code into CI/CD pipelines (also relates to Task Statement 4.6).'),

    dict(task='3.5', domain='d3',
         q='You keep getting inconsistent results from Claude when a prose description of a data transformation is interpreted differently each run. Which iterative-refinement technique most directly addresses this?',
         options={
             'A': 'Provide 2–3 concrete input/output examples of the transformation',
             'B': 'Increase max_tokens',
             'C': 'Ask Claude to be "more careful"',
             'D': 'Switch to plan mode',
         },
         answer='A',
         why='Task Statement 3.5 identifies concrete input/output examples as the most effective way to communicate expected transformations when prose descriptions are interpreted inconsistently — 2–3 targeted examples clarify the requirement. Raising max_tokens does not clarify intent, vague instructions like "be careful" are not actionable, and plan mode governs execution flow, not transformation clarity.',
         ref='Domain 3, Task Statement 3.5 — Apply iterative refinement techniques for progressive improvement.'),

    dict(task='3.5', domain='d3',
         q='You are about to build a caching layer in an unfamiliar domain and want to surface design considerations (invalidation strategy, failure modes) you may not have thought of before implementing. Which technique fits best?',
         options={
             'A': 'The interview pattern — have Claude ask you questions to surface considerations before implementing',
             'B': 'Immediately write the code and fix issues afterward',
             'C': 'Run a batch job over the codebase',
             'D': 'Set tool_choice: "any"',
         },
         answer='A',
         why="The interview pattern has Claude ask clarifying questions to surface design considerations the developer may not have anticipated — the guide's examples are precisely cache invalidation strategies and failure modes — before any code is written, reducing rework in unfamiliar domains. Coding first invites avoidable mistakes, batch processing is for latency-tolerant bulk work, and tool choice is unrelated.",
         ref='Domain 3, Task Statement 3.5 — Apply iterative refinement techniques for progressive improvement.'),

    dict(task='4.1', domain='d4',
         q='A CI code-review prompt says "be conservative and only report high-confidence findings," but false positives remain high and developers are losing trust. What change most reliably improves precision?',
         options={
             'A': 'Repeat "be conservative" more emphatically',
             'B': 'Replace vague guidance with explicit categorical criteria defining exactly what to flag (e.g., "flag a comment only when its claimed behavior contradicts the actual code behavior")',
             'C': 'Ask the model to self-rate confidence 1–10 and drop anything below 8',
             'D': 'Lower max_tokens to force shorter answers',
         },
         answer='B',
         why='Task Statement 4.1 states that general instructions like "be conservative" or "only report high-confidence findings" fail to improve precision compared to specific categorical criteria that define what qualifies as an issue. Emphasis does not add signal, self-reported confidence is poorly calibrated, and shorter output does not improve precision. High false-positive rates erode developer trust in accurate categories too.',
         ref='Domain 4, Task Statement 4.1 — Design prompts with explicit criteria to improve precision and reduce false positives.'),

    dict(task='4.2', domain='d4',
         q="You've written a detailed, carefully worded prose spec for the output you want, but the model's formatting still varies from run to run. Which technique is most effective for getting consistently formatted, actionable output when detailed written instructions alone still produce inconsistent results?",
         options={
             'A': 'Few-shot examples demonstrating the exact desired output (location, issue, severity, suggested fix)',
             'B': 'Increasing the temperature to encourage variety',
             'C': 'A longer system prompt restating the rules three times',
             'D': 'Forcing tool_choice: "none"',
         },
         answer='A',
         why='Task Statement 4.2 identifies few-shot examples as the most effective technique for achieving consistently formatted, actionable output when detailed instructions alone produce inconsistent results — the guide\'s example format is exactly location, issue, severity, and suggested fix. Higher temperature increases variability, restating rules rarely fixes format drift, and tool_choice: "none" blocks tool use and is irrelevant.',
         ref='Domain 4, Task Statement 4.2 — Apply few-shot prompting to improve output consistency and quality.'),

    dict(task='4.3', domain='d4',
         q='You use tool_use with a strict JSON schema for invoice extraction. A response is perfectly valid JSON, yet the line items do not sum to the stated total. What does this illustrate?',
         options={
             'A': 'The schema was not strict enough to be valid JSON',
             'B': 'Strict schemas via tool use eliminate syntax errors but not semantic errors',
             'C': 'Tool use is the wrong approach for extraction',
             'D': 'The model ran out of tokens',
         },
         answer='B',
         why="Tool use with a JSON schema guarantees structurally valid, schema-compliant output but does not prevent semantic errors — the guide's own examples are line items that don't sum to the total and values placed in wrong fields. It is not a validity failure, tool use remains the most reliable structured-output approach, and there is no evidence of truncation.",
         ref='Domain 4, Task Statement 4.3 — Enforce structured output using tool use and JSON schemas.'),

    dict(task='4.4', domain='d4',
         q='An extraction pipeline outputs JSON where line items sometimes do not match the stated total. What is the best architectural way to catch this semantic error?',
         options={
             'A': 'Automatically rewrite the line items so they sum to the stated total',
             'B': 'Extract a calculated_total alongside the stated_total, compare them, and flag mismatches for human review',
             'C': 'Add more few-shot examples of correct arithmetic',
             'D': 'Add a second LLM step to silently reconcile the math',
         },
         answer='B',
         why='Extracting both a stated and a calculated value and flagging discrepancies is the self-correction validation flow named in Task Statement 4.4 (extracting "calculated_total" alongside "stated_total" and adding conflict flags); it detects inconsistencies deterministically without altering source data. Rewriting values can corrupt the record, few-shot arithmetic cannot guarantee consistency, and silent reconciliation hides genuine source conflicts.',
         ref='Domain 4, Task Statement 4.4 — Implement validation, retry, and feedback loops for extraction quality.'),

    dict(task='4.3', domain='d4',
         q='A document sometimes lacks a "shipping address" field, yet the schema currently marks it as a required string. The model fabricates addresses when the field is absent. What is the best schema fix?',
         options={
             'A': 'Keep it required and add a few-shot example',
             'B': 'Make the field nullable (e.g., type: ["string", "null"]) and not required, so the model can return null when the data is absent',
             'C': 'Remove the field from the schema entirely',
             'D': 'Set tool_choice: "any"',
         },
         answer='B',
         why='A required string with no source value pushes the model to invent data to satisfy the schema; Task Statement 4.3 prescribes designing fields as optional/nullable when source documents may not contain the information, giving the model a legitimate way to signal absence. A few-shot example does not remove the structural pressure to fabricate, removing the field loses the data when present, and tool choice is unrelated.',
         ref='Domain 4, Task Statement 4.3 — Enforce structured output using tool use and JSON schemas.'),

    dict(task='4.4', domain='d4',
         q='Your extraction pipeline automatically retries whenever validation fails, appending the validation error to the prompt so the model can correct itself. When you retry an extraction with error feedback, in which situation will retrying be ineffective?',
         options={
             'A': 'When the output had a format mismatch you can describe in the error',
             'B': 'When a structural/schema error occurred that the model can correct',
             'C': 'When the required information is simply absent from the source document',
             'D': 'When the JSON had a trailing comma',
         },
         answer='C',
         why='Retry-with-error-feedback helps with format and structural errors the model can fix, but the guide states retries are ineffective when the required information is simply absent from the source — no feedback can conjure missing data. Format mismatches, correctable structural errors, and syntax issues are all cases where a feedback-guided retry can succeed.',
         ref='Domain 4, Task Statement 4.4 — Implement validation, retry, and feedback loops for extraction quality.'),

    dict(task='4.5', domain='d4',
         q='Your team wants to cut API costs by moving two workflows to the Message Batches API: (1) a blocking pre-merge check developers wait on, and (2) an overnight technical-debt report. How should you proceed?',
         options={
             'A': 'Move both to batch for maximum savings',
             'B': 'Use batch only for the overnight report; keep the synchronous API for the blocking pre-merge check',
             'C': 'Keep both synchronous to avoid result-ordering issues',
             'D': 'Move both to batch with a real-time fallback if batches run long',
         },
         answer='B',
         why='The Message Batches API offers 50% cost savings but has a processing window of up to 24 hours with no guaranteed latency SLA, making it unsuitable for blocking pre-merge checks yet ideal for overnight, latency-tolerant jobs. Batching the blocking check breaks the developer wait experience — "often faster" completion is not a guarantee — and results are correlated via custom_id, so ordering is not a blocker.',
         ref='Domain 4, Task Statement 4.5 — Design efficient batch processing strategies. Closely parallels Official Exam Guide Sample Question 11.'),

    dict(task='4.5', domain='d4',
         q="Documents arrive continuously and results must be guaranteed in under 30 hours of each document's arrival. You use the Message Batches API, whose processing window is up to 24 hours. Which submission schedule guarantees the SLA while minimizing submission overhead?",
         options={
             'A': 'Submit batches every 4 hours',
             'B': 'Submit batches every 6 hours',
             'C': 'Submit one large batch at the end of each day',
             'D': 'Use the synchronous API for all documents instead',
         },
         answer='A',
         why='Worst-case latency equals the submission interval plus the 24-hour processing window. A 4-hour interval yields a 28-hour worst case, guaranteeing the sub-30-hour SLA with margin — the exact calculation the exam guide cites for this skill (4-hour windows to guarantee a 30-hour SLA with 24-hour batch processing). A 6-hour interval gives a 30-hour worst case with zero margin, so it cannot guarantee completion in under 30 hours once retrieval and polling are included. A daily batch can reach 48 hours, and going fully synchronous forfeits the 50% batch savings unnecessarily.',
         ref='Domain 4, Task Statement 4.5 — Design efficient batch processing strategies.'),

    dict(task='4.5', domain='d4',
         q='Your team is evaluating the Message Batches API to cut costs and wants to confirm how it actually behaves before committing to it. Which statement about the Message Batches API is accurate?',
         options={
             'A': 'It supports multi-turn tool calling within a single request, executing tools mid-request',
             'B': 'It provides a guaranteed sub-hour latency SLA',
             'C': 'It offers 50% cost savings, up to a 24-hour processing window, and uses custom_id to correlate requests and responses',
             'D': 'It is the recommended choice for blocking, real-time workflows',
         },
         answer='C',
         why="The exam guide's appendix summarizes the Message Batches API as 50% cost savings, an up-to-24-hour processing window, custom_id for request/response correlation, polling for completion, and no multi-turn tool calling support. It cannot execute tools mid-request and return results, has no guaranteed latency SLA, and is inappropriate for blocking real-time workflows.",
         ref='Domain 4, Task Statement 4.5 — Design efficient batch processing strategies.'),

    dict(task='4.6', domain='d4',
         q='A pull request modifies 14 files, and a single-pass review produces inconsistent depth, misses obvious bugs, and even flags a pattern in one file while approving identical code in another. What restructuring best addresses this?',
         options={
             'A': 'Split into focused passes: analyze each file individually for local issues, then run a separate cross-file integration pass',
             'B': 'Require developers to split the PR into 3–4 file submissions',
             'C': 'Switch to a model with a larger context window so all 14 files fit in one pass',
             'D': 'Run three full-PR passes and only report issues appearing in at least two',
         },
         answer='A',
         why="The inconsistency stems from attention dilution when many files are analyzed at once; per-file passes for local issues plus a separate cross-file integration pass restore consistent depth — the guide's prescribed multi-pass review structure. Forcing smaller PRs shifts burden to developers, a bigger context window does not fix attention quality, and consensus voting suppresses real bugs caught only intermittently.",
         ref='Domain 4, Task Statement 4.6 — Design multi-instance and multi-pass review architectures. Closely parallels Official Exam Guide Sample Question 12.'),

    dict(task='4.6', domain='d4',
         q="You're deciding how to review AI-generated code and wondering whether the same session that wrote it can simply review its own work. Why is an independent Claude instance generally better than self-review or extended thinking for catching subtle issues in generated code?",
         options={
             'A': 'Independent instances are always faster',
             'B': 'The generating instance retains its reasoning context and is biased toward its own decisions; a context-free reviewer evaluates the result on its own terms',
             'C': 'Extended thinking is disabled during review',
             'D': 'Independent instances have larger context windows',
         },
         answer='B',
         why='Task Statement 4.6 states that a model retains reasoning context from generation, making it less likely to question its own decisions in the same session, and that independent review instances are more effective at catching subtle issues than self-review instructions or extended thinking. Speed, a false claim about extended thinking, and window size are not the underlying reason.',
         ref='Domain 4, Task Statement 4.6 — Design multi-instance and multi-pass review architectures.'),

    dict(task='4.3', domain='d4',
         q="You're designing the output schema for a classifier whose categories aren't fixed — new categories may appear over time, and you don't want the model forced to jam a novel case into an existing bucket. For this extensible categorization field, which schema design best avoids forced misclassification?",
         options={
             'A': 'A free-text string with no constraints',
             'B': 'An enum with a fixed closed set of values only',
             'C': 'An enum that includes an "other" value plus a companion detail string field',
             'D': 'A boolean field',
         },
         answer='C',
         why='An enum with an "other" escape hatch plus a detail field — a pattern the guide names explicitly, alongside "unclear" values for ambiguous cases — lets the model handle unexpected categories without being forced into the closest-but-wrong option, while still constraining known values. Free text loses structure, a closed enum forces misclassification of novel cases, and a boolean cannot represent categories.',
         ref='Domain 4, Task Statement 4.3 — Enforce structured output using tool use and JSON schemas.'),

    dict(task='5.1', domain='d5',
         q='In a long customer-support conversation, progressive summarization is compressing exact figures (refund amounts, order numbers, dates) into vague phrases, causing errors. What is the recommended mitigation?',
         options={
             'A': 'Summarize even more aggressively to save tokens',
             'B': 'Maintain a persistent "case facts" block of transactional details (amounts, dates, order numbers, statuses) included in each prompt, outside the summarized history',
             'C': 'Disable summarization and always send the full raw transcript',
             'D': 'Route the conversation to a human at the first summarization',
         },
         answer='B',
         why='Task Statement 5.1 prescribes extracting transactional facts (amounts, dates, order numbers, statuses) into a persistent case-facts block included in each prompt outside the summarized history, preserving precision without keeping the entire transcript. More aggressive summarization worsens the loss, sending the full transcript is token-inefficient and will eventually overflow, and immediate escalation is unwarranted.',
         ref='Domain 5, Task Statement 5.1 — Manage conversation context to preserve critical information across long interactions.'),

    dict(task='5.1', domain='d5',
         q='Findings in the middle of a long aggregated input are being omitted, while those at the start and end are reliably used. This is the "lost in the middle" effect. Which mitigation is recommended?',
         options={
             'A': 'Place key-findings summaries at the beginning and organize details with explicit section headers',
             'B': 'Randomly shuffle the content on each request',
             'C': 'Increase temperature so the model attends more broadly',
             'D': 'Rely solely on a larger context window to fix it',
         },
         answer='A',
         why='Models process information at the beginning and end of long inputs most reliably and may omit middle-section findings — the lost-in-the-middle effect documented in long-context research and named in Task Statement 5.1. The prescribed mitigation is placing key-findings summaries at the beginning and organizing detailed results with explicit section headers. Shuffling is not a reliable fix, temperature does not change positional attention, and a larger window alone does not solve attention quality.',
         ref='Domain 5, Task Statement 5.1 — Manage conversation context to preserve critical information across long interactions.'),

    dict(task='5.2', domain='d5',
         q='Mid-conversation, a customer explicitly demands to speak with a human agent about an issue that is actually straightforward and that the agent could resolve on its own. What is the correct behavior?',
         options={
             'A': 'Refuse and insist on resolving it autonomously first',
             'B': 'Honor the explicit request for a human immediately, without first attempting investigation',
             'C': 'Run sentiment analysis to decide whether the request is genuine',
             'D': 'Ask the customer to justify why they want a human',
         },
         answer='B',
         why="An explicit customer request for a human is a valid escalation trigger that Task Statement 5.2 says should be honored immediately, without first attempting investigation — even when the issue seems simple. Refusing ignores a clear signal, sentiment analysis is an unreliable proxy, and demanding justification creates friction and disregards the customer's stated preference.",
         ref='Domain 5, Task Statement 5.2 — Design effective escalation and ambiguity resolution patterns.'),

    dict(task='5.2', domain='d5',
         q="You're writing the escalation rules for a support agent and want to avoid triggers that look useful but actually mislead. Which of the following is an unreliable proxy for deciding when an agent should escalate a case?",
         options={
             'A': 'The customer explicitly asks for a human',
             'B': "The policy is silent or ambiguous on the customer's specific request",
             'C': "The agent's self-reported confidence score or the customer's detected sentiment",
             'D': 'The agent cannot make meaningful progress',
         },
         answer='C',
         why='Task Statement 5.2 states that sentiment-based escalation and self-reported confidence scores are unreliable proxies for actual case complexity — an agent is often confidently wrong precisely on hard cases. Explicit human requests, policy gaps or ambiguity, and inability to make meaningful progress are the appropriate, reliable escalation triggers.',
         ref='Domain 5, Task Statement 5.2 — Design effective escalation and ambiguity resolution patterns.'),

    dict(task='5.3', domain='d5',
         q='In a multi-agent research run, a web-search subagent times out partway through, and the coordinator needs enough information to decide whether to retry, try a different approach, or proceed with what it has. Which error-propagation approach best enables the coordinator to recover intelligently?',
         options={
             'A': 'Return structured error context: failure type, the attempted query, any partial results, and possible alternatives',
             'B': 'Retry silently with backoff and return a generic "search unavailable" only after all retries fail',
             'C': 'Catch the timeout and return an empty result marked as success',
             'D': 'Propagate the exception to a top-level handler that terminates the whole workflow',
         },
         answer='A',
         why='Structured error context — failure type, attempted query, partial results, and alternative approaches — gives the coordinator the information to decide whether to retry with a modified query, try an alternative, or proceed with partial results. A generic status hides valuable context, marking failure as success suppresses the error and risks silently incomplete research, and terminating the workflow is unnecessary when recovery strategies could succeed.',
         ref='Domain 5, Task Statement 5.3 — Implement error propagation strategies across multi-agent systems. Closely parallels Official Exam Guide Sample Question 8.'),

    dict(task='5.6', domain='d5',
         q='While synthesizing a report from several sources, the system finds two credible sources reporting different statistics for the same metric, and it must decide how to present the discrepancy. How should the system handle this?',
         options={
             'A': 'Arbitrarily pick one value and drop the other',
             'B': 'Average the two values silently',
             'C': 'Preserve both values with source attribution (and publication/collection dates), annotating the conflict rather than collapsing it',
             'D': 'Discard both and report that no data was found',
         },
         answer='C',
         why='Task Statement 5.6 prescribes annotating conflicting statistics with source attribution rather than arbitrarily selecting one value, and requiring publication or collection dates so temporal differences are not misinterpreted as contradictions. Arbitrarily choosing, silently averaging, or discarding both destroy provenance and mislead the reader.',
         ref='Domain 5, Task Statement 5.6 — Preserve information provenance and handle uncertainty in multi-source synthesis.'),

]


def main():
    banner("Mock Exam Bank", "60 blueprint-aligned questions — verified, exam-style")
    note("These power the console's 60-question Mock Exam (M1..M60). Study aid, not official items.")
    for i, q in enumerate(MOCK_BANK, 1):
        h1(f"M{i} — Task {q['task']} ({q['domain'].upper()})")
        note(q["q"])
        print()
        for k in ("A", "B", "C", "D"):
            kv(f"  {k}", q["options"][k])
        right(f"Answer: {q['answer']}")
        note("Why: " + q["why"])
        note("Reference: " + q["ref"])
    rule()
    tip("Answer is the simplest mechanism that fixes the root cause; distractors over-prompt, "
        "over-build, or invent features. Use the Reference line to target your weakest task.")


if __name__ == "__main__":
    main()
```

## Cheatsheet

**Source:** https://raw.githubusercontent.com/jacinthpaul/Claude-Certified-Architect/claude/architect-exam-codebase-7ytdjz/exam/cheatsheet.py

```python
"""
ONE-PAGE CHEAT SHEET — facts to memorize
=========================================
Prints the exam's high-yield facts, grouped by topic, each tagged with the demo that
shows it running. This mirrors Chapter 12 of the study guide.
"""

import sys, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1]))
from ccarch import banner, h1, kv, note, rule, tip


FACTS = [
    ("stop_reason", "'tool_use' = run tool & continue; 'end_turn' = done. Never parse text "
     "or rely on iteration caps to terminate.", "domain1/task1_1"),
    ("Subagent memory", "Isolated — pass context explicitly in the prompt; coordinator needs "
     "'Task' in allowedTools.", "domain1/task1_3"),
    ("Parallel subagents", "Multiple Task calls in ONE coordinator response.", "domain1/task1_3"),
    ("Enforcement", "Guaranteed rules → hooks/gates (deterministic); preferences → prompts "
     "(probabilistic).", "domain1/task1_4"),
    ("Hooks", "PostToolUse = normalize results after; interception = block policy violations "
     "before (refunds > $500).", "domain1/task1_5"),
    ("Decomposition", "Known steps → prompt chaining; unknown/open-ended → dynamic adaptive.",
     "domain1/task1_6"),
    ("Sessions", "--resume = continue named thread; fork_session = branches from one baseline; "
     "stale results → fresh start + summary.", "domain1/task1_7"),
    ("Tool selection", "Driven by DESCRIPTIONS; ~4-5 well-described beat 18; first fix = "
     "better descriptions.", "domain2/task2_1"),
    ("Errors", "Categories transient/validation/business/permission; return errorCategory + "
     "isRetryable; empty result ≠ failure.", "domain2/task2_2"),
    ("tool_choice", '"auto" = optional; "any" = must call some tool; '
     '{"type":"tool","name":…} = must call that tool.', "domain2/task2_3"),
    ("MCP scoping", ".mcp.json = project/shared; ~/.claude.json = personal; secrets via "
     "${ENV_VAR}; resources = catalogs, tools = actions.", "domain2/task2_4"),
    ("Built-ins", "Grep = file CONTENTS; Glob = file NAMES; Edit needs a unique anchor "
     "(fallback Read + Write).", "domain2/task2_5"),
    ("CLAUDE.md levels", "User (~/.claude, personal) · Project (repo, shared) · Directory "
     "(scoped); @import for modularity; /memory to debug.", "domain3/task3_1"),
    ("Commands & skills", ".claude/commands/ = shared; ~/.claude/commands/ = personal; skill "
     "frontmatter: context: fork, allowed-tools, argument-hint.", "domain3/task3_2"),
    ("Path rules", ".claude/rules/ + YAML paths: ['glob'] → loads only when editing matching "
     "files.", "domain3/task3_3"),
    ("Plan mode", "Architectural / multi-file / multiple approaches → plan; single "
     "well-scoped fix → direct.", "domain3/task3_4"),
    ("CI/CD", "-p / --print = non-interactive; --output-format json + --json-schema = "
     "structured CI output. (CLAUDE_HEADLESS / --batch don't exist.)", "domain3/task3_6"),
    ("Schemas", "Tool use kills JSON SYNTAX errors, NOT semantic; nullable fields prevent "
     "fabrication; enums need 'unclear'/'other'+detail.", "domain4/task4_3"),
    ("Retry", "Works for format/structure errors; FUTILE when info is absent from the "
     "source.", "domain4/task4_4"),
    ("Batches API", "50% cheaper, ≤24h window, NO latency SLA, no multi-turn tool calling; "
     "custom_id correlates & enables partial resubmission.", "domain4/task4_5"),
    ("Review", "Independent fresh instance > self-review; large PRs → per-file passes + "
     "integration pass.", "domain4/task4_6"),
    ("Context", "'Case facts' block survives summarization; lost-in-the-middle → summary "
     "first + section headers; trim tool outputs early.", "domain5/task5_1"),
    ("Escalation", "Triggers: explicit human request (honor now), policy gap, no progress. "
     "NOT sentiment, NOT self-confidence.", "domain5/task5_2"),
    ("Provenance", "Preserve claim-source mappings through synthesis; annotate conflicts "
     "with both sources; include dates to avoid temporal 'contradictions'.", "domain5/task5_6"),
]

WEIGHTS = [
    ("Domain 1 — Agentic Architecture & Orchestration", "27%"),
    ("Domain 2 — Tool Design & MCP Integration", "18%"),
    ("Domain 3 — Claude Code Configuration & Workflows", "20%"),
    ("Domain 4 — Prompt Engineering & Structured Output", "20%"),
    ("Domain 5 — Context Management & Reliability", "15%"),
]


def main():
    banner("Cheat Sheet", "High-yield facts · each tagged with its demo")
    h1("Exam at a glance")
    kv("  Format", "Multiple choice, 1 correct + 3 distractors; no penalty for guessing")
    kv("  Scenarios", "4 of 6 published scenarios, drawn at random")
    kv("  Score", "Scaled 100-1000; passing = 720; Pass/Fail")
    kv("  Candidate", "Solution architect, ~6+ months hands-on with Claude")

    h1("Domain weights (study Domains 1 + 2 first — 45% together)")
    for name, w in WEIGHTS:
        kv(f"  {w}", name)

    h1("Facts to memorize")
    for topic, fact, demo in FACTS:
        kv(f"  {topic}", fact)
        note(f"      ↳ run: domains/{demo}.py")
    rule()

    h1("The three recurring themes")
    note("1. GUARANTEES BEAT INSTRUCTIONS — must-follow rules → code (hooks/gates), not prompts.")
    note("2. FIX THE ROOT CAUSE, PROPORTIONATELY — vague tool descriptions → better "
         "descriptions, not a classifier. The exam loves over-engineered distractors.")
    note("3. CONTEXT IS A SCARCE, LEAKY RESOURCE — extract key facts, trim noise, pass "
         "information explicitly between agents.")

    tip("The exam's underlying question is always: what is the SIMPLEST mechanism that "
        "RELIABLY fixes the actual ROOT CAUSE?")


if __name__ == "__main__":
    main()
```

## Prep Exercises

**Source:** https://raw.githubusercontent.com/jacinthpaul/Claude-Certified-Architect/claude/architect-exam-codebase-7ytdjz/exam/prep_exercises.py

```python
"""
PREPARATION EXERCISES — the 3 official hands-on exercises, mapped to this codebase
==================================================================================
The Exam Guide ends with three build-it-yourself exercises. This module restates each and
points to the files in THIS codebase that already implement a worked version, so learners
can read the reference, then rebuild from scratch.
"""

import sys, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1]))
from ccarch import banner, h1, h2, kv, note, rule, tip


EXERCISES = [
    dict(
        title="Exercise 1 — Build a Multi-Tool Agent with Escalation Logic",
        domains="D1, D2, D5",
        steps=[
            "Define 3-4 MCP tools with detailed, differentiated descriptions (include two "
            "similar tools that need careful descriptions to avoid confusion).",
            "Implement an agentic loop that checks stop_reason ('tool_use' vs 'end_turn').",
            "Add structured error responses (errorCategory, isRetryable, human message); "
            "handle each type appropriately.",
            "Add a hook that intercepts tool calls to enforce a business rule (block over a "
            "threshold), redirecting to escalation.",
            "Test multi-concern messages: decompose, handle each, synthesize one response.",
        ],
        reference=["scenarios/scenario1_customer_support/support_agent.py",
                   "domains/domain1_orchestration/task1_1_agentic_loop.py",
                   "domains/domain2_tools_mcp/task2_2_structured_errors.py",
                   "domains/domain1_orchestration/task1_5_hooks.py"],
    ),
    dict(
        title="Exercise 2 — Configure Claude Code for a Team Development Workflow",
        domains="D3, D2",
        steps=[
            "Create a project-level CLAUDE.md with universal standards; verify it applies "
            "to all team members.",
            "Create .claude/rules/ files with YAML glob frontmatter (api, testing); verify "
            "they load only on matching files.",
            "Create a project skill with context: fork and allowed-tools; verify isolation.",
            "Configure an MCP server in .mcp.json with ${ENV_VAR}; add a personal one in "
            "~/.claude.json; verify both are available.",
            "Compare plan mode vs direct execution across a 1-file fix, a 45-file migration, "
            "and a multi-approach feature.",
        ],
        reference=["domains/domain3_claude_code/examples/  (CLAUDE.md, .claude/, .mcp.json)",
                   "domains/domain3_claude_code/task3_1_claudemd_hierarchy.py",
                   "domains/domain3_claude_code/task3_3_path_rules.py",
                   "domains/domain3_claude_code/task3_4_plan_mode.py",
                   "scenarios/scenario2_code_generation/code_generation_workflow.py"],
    ),
    dict(
        title="Exercise 3 — Build a Structured Data Extraction Pipeline",
        domains="D4, D5",
        steps=[
            "Define an extraction tool whose JSON schema has required + optional fields, an "
            "enum with 'other'+detail, and nullable fields; verify null (not fabrication) "
            "when data is absent.",
            "Implement a validation-retry loop: on failure, resend document + failed "
            "extraction + specific errors. Track resolvable (format) vs futile (absent info).",
            "Add self-correcting fields (stated_total vs calculated_total).",
            "Design batch vs synchronous routing; use custom_id for correlation + partial "
            "resubmission.",
            "Add field-level confidence + route low-confidence to humans; audit high-conf "
            "samples (stratified).",
        ],
        reference=["scenarios/scenario6_structured_extraction/extraction_pipeline.py",
                   "domains/domain4_prompt_output/task4_3_structured_output_schema.py",
                   "domains/domain4_prompt_output/task4_4_validation_retry.py",
                   "domains/domain4_prompt_output/task4_5_batch_processing.py",
                   "domains/domain5_context_reliability/task5_5_human_review.py"],
    ),
]


def main():
    banner("Preparation Exercises", "The 3 official hands-on builds, with references")
    for ex in EXERCISES:
        h1(ex["title"])
        kv("  domains reinforced", ex["domains"])
        h2("Steps")
        for i, s in enumerate(ex["steps"], 1):
            note(f"  {i}. {s}")
        h2("Worked reference in THIS codebase")
        for r in ex["reference"]:
            kv("  →", r)
        rule()
    tip("Read the reference implementation, then rebuild the exercise from a blank file. "
        "The exam rewards judgment you can only get from hands-on practice.")


if __name__ == "__main__":
    main()
```

