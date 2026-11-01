## Domain Overview

# Domain 2 — Tool Design & MCP Integration (18%)

Agents choose tools by reading their descriptions. This domain is about unambiguous
descriptions, structured errors agents can recover from, scoping tools per agent, and
configuring MCP correctly.

| Task | Demo | One-line idea |
|---|---|---|
| 2.1 Design effective tool interfaces with clear descriptions and boundaries | `task2_1_tool_interfaces.py` | Descriptions are the **primary** tool-selection mechanism |
| 2.2 Implement structured error responses for MCP tools | `task2_2_structured_errors.py` | `errorCategory` + `isRetryable`; empty ≠ failure |
| 2.3 Distribute tools appropriately across agents and configure tool choice | `task2_3_tool_distribution_choice.py` | Least privilege; `auto`/`any`/forced |
| 2.4 Integrate MCP servers into Claude Code and agent workflows | `task2_4_mcp_integration.py` | `.mcp.json` (shared) vs `~/.claude.json` (personal); resources vs tools |
| 2.5 Select and apply built-in tools (Read, Write, Edit, Bash, Grep, Glob) effectively | `task2_5_builtin_tools.py` | **Grep = contents, Glob = names** |

```bash
python3 run_all.py domain2
```

**Most-tested reflexes:** misrouting between thin tools → *expand the descriptions first*;
Grep vs Glob; `auto`/`any`/forced `tool_choice`.

---

## Task 2.1 — Design effective tool interfaces with clear descriptions and boundaries

**Source:** https://github.com/jacinthpaul/Claude-Certified-Architect/blob/claude/architect-exam-codebase-7ytdjz/domains/domain2_tools_mcp/task2_1_tool_interfaces.py

### Objective
Design effective tool interfaces with clear descriptions and boundaries.

### Concept
Agents choose tools by reading their DESCRIPTIONS — nothing more. If two tools have minimal, near-identical descriptions, the model misroutes between them, and no amount of clever prompting fixes the root cause. A good description includes: purpose, accepted input formats, example queries, edge cases, and EXPLICIT BOUNDARIES ("use this for X; for Y, use tool Z instead"). This is official sample question Q2: the FIRST step for misrouting between two thinly-described tools is to EXPAND the descriptions — not few-shot, not a router.

### Instructions
1. EXPAND descriptions first — low-effort, high-leverage, the correct "first step".
2. RENAME to kill overlap — analyze_content -> extract_web_results.
3. SPLIT a generic tool into purpose-specific ones — analyze_document -> extract_data_points / summarize_content / verify_claim_against_source.
4. AUDIT the system prompt for keyword traps — "always analyze documents thoroughly" can bias the model toward any tool with "document" in its name.

### Acceptance Criteria
- Router-readiness of 5/5: description states purpose, includes input format, provides an example query, covers edge cases, and declares a boundary to sibling tools.

### Full code
```python
"""
Domain 2 · Task 2.1 — Design effective tool interfaces.

THE BIG IDEA
============
Agents choose tools by reading their DESCRIPTIONS — nothing more. If two tools have
minimal, near-identical descriptions, the model misroutes between them, and no amount of
clever prompting fixes the root cause.

A good description includes: purpose, accepted input formats, example queries, edge cases,
and EXPLICIT BOUNDARIES ("use this for X; for Y, use tool Z instead").

This is official sample question Q2: the FIRST step for misrouting between two
thinly-described tools is to EXPAND the descriptions — not few-shot, not a router.
"""

import sys, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[2]))
from ccarch import banner, concept, h1, h2, wrong, right, tip, note, kv, code, rule, pause, analogy, pitfall


def score_description(desc: str) -> dict:
    """A toy 'router readiness' score: does the text contain the signals a model needs?"""
    checks = {
        "states purpose": any(w in desc.lower() for w in ["look", "retriev", "return", "extract"]),
        "input format": any(w in desc for w in ["format", "CUST-", "email", "ID", "#"]),
        "example query": "example" in desc.lower() or "e.g." in desc.lower() or "'" in desc,
        "edge cases": any(w in desc.lower() for w in ["if", "when", "no ", "missing"]),
        "boundary to sibling": "instead" in desc.lower() or "use " in desc.lower(),
    }
    return checks


def show(name, desc):
    h2(name)
    code(desc, "description")
    checks = score_description(desc)
    passed = sum(checks.values())
    for k, v in checks.items():
        kv(f"  {'✓' if v else '✗'} {k}", "present" if v else "MISSING")
    kv("  router-readiness", f"{passed}/5")
    return passed


def main():
    banner("Domain 2 · Task 2.1", "Tool interfaces — descriptions drive selection")
    concept("Domain 2: Tool Design & MCP Integration (18%)",
            "Task 2.1 — Design effective tool interfaces with clear descriptions and boundaries",
            "Descriptions are the PRIMARY tool-selection mechanism")

    h1("Weak descriptions cause misrouting (sample Q2)")
    weak = score_description and show(
        "get_customer (weak)", "Retrieves customer information.")
    show("lookup_order (weak)", "Retrieves order details.")
    wrong("Two near-identical one-liners. Both accept similar IDs. The model literally "
          "cannot tell them apart and routes order questions to get_customer.")

    pause("the strong version")
    rule()
    h1("Strong description: purpose + inputs + example + boundary")
    strong = (
        "Looks up a customer profile by email address or customer ID (format: CUST-12345). "
        "Returns name, account status, loyalty tier, and contact details. "
        "Example query: 'find the account for jane@example.com'. "
        "If the question is about a specific purchase or delivery, use lookup_order "
        "instead — this tool has no order data."
    )
    n = show("get_customer (strong)", strong)
    right(f"Purpose, input formats, a worked example, and — critically — an explicit "
          f"boundary pointing to the neighbor. Router-readiness {n}/5.")

    rule()
    h1("Remedies the exam tests (in order of preference)")
    note("1. EXPAND descriptions first — low-effort, high-leverage, the correct 'first step'.")
    note("2. RENAME to kill overlap — analyze_content -> extract_web_results.")
    note("3. SPLIT a generic tool into purpose-specific ones — analyze_document -> "
         "extract_data_points / summarize_content / verify_claim_against_source.")
    note("4. AUDIT the system prompt for keyword traps — 'always analyze documents "
         "thoroughly' can bias the model toward any tool with 'document' in its name.")

    rule()
    h1("Plain-language analogy & the common confusion")
    analogy("Two unlabeled doors marked Service and Support — people pick at random. Relabel them 'Returns and refunds (have your order number)' and 'Account and billing' and the misrouting disappears; tool descriptions are those labels.")
    pitfall('Beginners reach for few-shot examples or a routing layer when tools are misrouted. But the model chooses tools by reading their DESCRIPTIONS — fix the text first. Vague descriptions are the root cause; the rest treats symptoms.')

    tip("When misrouting appears with MINIMAL descriptions, the answer is 'improve the "
        "descriptions'. Distractors: few-shot (token overhead, doesn't fix the cause), a "
        "keyword routing layer (over-engineered), or merging tools (bigger than a 'first step').")


if __name__ == "__main__":
    main()
```

---

## Task 2.2 — Implement structured error responses for MCP tools

**Source:** https://github.com/jacinthpaul/Claude-Certified-Architect/blob/claude/architect-exam-codebase-7ytdjz/domains/domain2_tools_mcp/task2_2_structured_errors.py

### Objective
Implement structured error responses for MCP tools so the agent can recover.

### Concept
When a tool fails, HOW it reports failure determines whether the agent can recover. MCP has an `isError` flag, but a bare "Operation failed" is useless — the agent can't tell whether to retry, fix the input, apologize, or escalate.

Four error categories you MUST distinguish:
- transient (timeout / service down) -> retryable: YES -> retry (locally first)
- validation (bad/missing input) -> retryable: NO -> fix input, try again
- business (refund exceeds policy) -> retryable: NO -> explain politely / escalate
- permission (agent lacks access) -> retryable: NO -> escalate / authorized path

Return: errorCategory + isRetryable + a human-readable message. Crucial: "the search FAILED" (access failure) != "the search SUCCEEDED and found nothing" (a valid empty result). Conflating them wastes retries or hides data gaps.

### Instructions
1. Return `errorCategory` + `isRetryable` + a human-readable message for every tool failure.
2. Categorize failures: transient (retry), validation (fix input), business_rule (explain/escalate), permission (escalate, do not retry).
3. Distinguish "the search FAILED" from "the search SUCCEEDED and found nothing" — empty result is a valid success, not a failure.
4. Subagents handle transient failures THEMSELVES and propagate upward only what they cannot resolve — together with partial results and a record of what was attempted.

### Acceptance Criteria
- Every error response lets the agent decide the correct recovery action from the fields alone.

### Full code
```python
"""
Domain 2 · Task 2.2 — Structured error responses for MCP tools.

THE BIG IDEA
============
When a tool fails, HOW it reports failure determines whether the agent can recover. MCP
has an `isError` flag, but a bare "Operation failed" is useless — the agent can't tell
whether to retry, fix the input, apologize, or escalate.

Four error categories you MUST distinguish:
  transient  (timeout / service down)        -> retryable: YES  -> retry (locally first)
  validation (bad/missing input)             -> retryable: NO   -> fix input, try again
  business   (refund exceeds policy)         -> retryable: NO   -> explain politely / escalate
  permission (agent lacks access)            -> retryable: NO   -> escalate / authorized path

Return: errorCategory + isRetryable + a human-readable message.
Crucial: "the search FAILED" (access failure) != "the search SUCCEEDED and found nothing"
(a valid empty result). Conflating them wastes retries or hides data gaps.
"""

import sys, pathlib, json
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[2]))
from ccarch import banner, concept, h1, h2, wrong, right, tip, note, kv, code, rule, pause, analogy, pitfall


def err(category, retryable, message):
    return {"isError": True, "errorCategory": category,
            "isRetryable": retryable, "message": message}


def agent_decide(error: dict) -> str:
    """How a well-built agent reacts to each category."""
    cat = error["errorCategory"]
    return {
        "transient": "Retry (subagent attempts local recovery before bothering coordinator).",
        "validation": "Fix the malformed input, then retry once corrected.",
        "business_rule": "Explain the policy to the customer; offer alternatives or escalate.",
        "permission": "Escalate or route to an authorized path. Do not retry.",
    }[cat]


def main():
    banner("Domain 2 · Task 2.2", "Structured errors — so the agent can recover")
    concept("Domain 2: Tool Design & MCP Integration (18%)",
            "Task 2.2 — Implement structured error responses for MCP tools",
            "errorCategory + isRetryable + human-readable message")

    h1("A bare error teaches the agent nothing")
    wrong('{"isError": true, "message": "Operation failed"}  '
          '-- retry? rephrase? apologize? escalate? The agent is blind.')

    pause("the four categories")
    rule()
    h1("The four categories and the right agent behavior")
    cases = [
        err("transient", True, "Upstream service timed out."),
        err("validation", False, "order_id 'ABC' is malformed; expected #NNNNN."),
        err("business_rule", False,
            "Refund of $620.00 exceeds the $500 automatic limit. Offer escalation to a supervisor."),
        err("permission", False, "Agent lacks access to the billing system."),
    ]
    for e in cases:
        h2(f"{e['errorCategory']}  (isRetryable={e['isRetryable']})")
        note(f"    message: {e['message']}")
        right(f"agent: {agent_decide(e)}")

    rule()
    h1("Well-structured business-rule error (the model can act on every field)")
    code(json.dumps(cases[2], indent=2), "MCP error")
    note("Reading this, the agent knows: don't retry (fails forever), it's policy not a "
         "glitch, and here's the friendly path forward to offer.")

    pause("the subtle distinction")
    rule()
    h1("Failure vs. valid-empty — the subtle, tested distinction")
    wrong('Returning the SAME shape for "the search failed" and "the search found nothing". '
          'The agent either wastes retries on an empty result, or treats a real failure as '
          '"no data" and ships a report with silent holes.')
    code('# access failure (needs a retry decision)\n'
         '{"isError": true, "errorCategory": "transient", "isRetryable": true}\n\n'
         '# valid empty result (success!)\n'
         '{"isError": false, "results": [], "message": "0 matches"}', "two different things")

    rule()
    h1("Local recovery first")
    right("Subagents handle transient failures THEMSELVES and propagate upward only what "
          "they cannot resolve — together with partial results and a record of what was "
          "attempted. (Ties to Task 5.3 error propagation.)")

    rule()
    h1("Plain-language analogy & the common confusion")
    analogy("A good error is a doctor's note, not a dead phone line. 'Operation failed' tells the agent nothing; 'Refund exceeds the $500 limit — do not retry, offer a supervisor' tells it exactly what to do next.")
    pitfall("The subtle one: 'the search failed' and 'the search found nothing' are NOT the same. One needs a retry decision; the other is a valid empty result. Returning the same shape for both causes wasted retries or silent data gaps.")

    tip("Memorize the categories: transient / validation / business / permission. Return "
        "errorCategory + isRetryable. Empty result != failure.")


if __name__ == "__main__":
    main()
```

---

## Task 2.3 — Distribute tools appropriately across agents and configure tool choice

**Source:** https://github.com/jacinthpaul/Claude-Certified-Architect/blob/claude/architect-exam-codebase-7ytdjz/domains/domain2_tools_mcp/task2_3_tool_distribution_choice.py

### Objective
Distribute tools across agents and configure tool_choice.

### Concept
FEWER TOOLS = BETTER DECISIONS. Giving an agent 18 tools instead of 4-5 measurably degrades selection reliability — every extra tool adds decision complexity. Agents with tools outside their specialty tend to MISUSE them (a synthesis agent with web search starts searching instead of synthesizing).

SCOPED ACCESS: each subagent gets only its role's tools, plus narrowly scoped cross-role tools for high-frequency needs. Flagship example (sample Q9): the synthesis agent needs constant small fact-checks (85% simple, 15% deep). Right answer: a scoped `verify_fact` tool for the simple 85%, and keep routing the complex 15% through the coordinator.

tool_choice settings (Claude API):
- "auto" -> may call a tool OR just reply with text
- "any" -> MUST call some tool (its choice which)
- {"type":"tool","name":"..."} -> MUST call THAT specific tool

### Instructions
1. Scope each agent to its role — ~4-5 well-described, role-relevant tools per agent (least privilege).
2. For the sample Q9 profile (85% simple fact-checks, 15% deep): give the synthesis agent a SCOPED verify_fact tool for the simple 85%; keep routing the complex 15% through the coordinator to the web-search agent.
3. Replace a generic fetch_url with a load_document tool that VALIDATES document URLs — the tool itself enforces the boundary, so the agent can't wander off.
4. Configure tool_choice: "auto" = optional; "any" = must call some tool; forced ({"type":"tool","name":...}) = must call that specific tool (e.g., force extract_metadata to run before any enrichment step).

### Acceptance Criteria
- No over-provisioning: the synthesis agent does not get all search tools.
- No blocking dependencies: verifications are not batched (synthesis would stall).
- No speculative caching of "what it might need".

### Full code
```python
"""
Domain 2 · Task 2.3 — Distribute tools across agents and configure tool_choice.

THE BIG IDEA
============
FEWER TOOLS = BETTER DECISIONS. Giving an agent 18 tools instead of 4-5 measurably
degrades selection reliability — every extra tool adds decision complexity. Agents with
tools outside their specialty tend to MISUSE them (a synthesis agent with web search starts
searching instead of synthesizing).

SCOPED ACCESS: each subagent gets only its role's tools, plus narrowly scoped cross-role
tools for high-frequency needs. Flagship example (sample Q9): the synthesis agent needs
constant small fact-checks (85% simple, 15% deep). Right answer: a scoped `verify_fact`
tool for the simple 85%, and keep routing the complex 15% through the coordinator.

tool_choice settings (Claude API):
  "auto"                       -> may call a tool OR just reply with text
  "any"                        -> MUST call some tool (its choice which)
  {"type":"tool","name":"..."} -> MUST call THAT specific tool
"""

import sys, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[2]))
from ccarch import banner, concept, h1, h2, wrong, right, tip, note, kv, code, rule, pause, analogy, pitfall


def main():
    banner("Domain 2 · Task 2.3", "Tool distribution & tool_choice")
    concept("Domain 2: Tool Design & MCP Integration (18%)",
            "Task 2.3 — Distribute tools appropriately across agents and configure tool choice",
            "Least privilege for tools + the tool_choice modes")

    h1("Fewer tools = better decisions")
    wrong("Handing one agent all 18 tools 'just in case'. Selection reliability drops; "
          "the agent burns turns deciding and picks wrong more often.")
    right("~4-5 well-described, role-relevant tools per agent. Scope to the role.")

    pause("the flagship example")
    rule()
    h1("Flagship example (sample Q9): synthesis agent needs frequent fact checks")
    note("Profile: 85% are simple fact-checks (dates, names, stats); 15% need deep research.")
    h2("Right answer")
    right("Give the synthesis agent a SCOPED verify_fact tool for the simple 85%; keep "
          "routing the complex 15% through the coordinator to the web-search agent.")
    h2("Why the distractors fail")
    wrong("Give it ALL search tools -> over-provisioning; it starts doing research, not synthesis.")
    wrong("Batch the verifications -> creates blocking dependencies; synthesis stalls.")
    wrong("Speculatively cache 'what it might need' -> you can't predict needs.")

    rule()
    h1("Constrain rather than trust")
    right("Replace a generic fetch_url with a load_document tool that VALIDATES document "
          "URLs — the tool itself enforces the boundary, so the agent can't wander off.")

    pause("tool_choice")
    rule()
    h1("tool_choice — three modes")
    modes = [
        ('"auto"', "Model may call a tool OR reply with text",
         "Normal conversation; tool use is optional"),
        ('"any"', "Model MUST call SOME tool (its choice which)",
         "You need structured output but the right schema depends on input (unknown doc type)"),
        ('{"type":"tool","name":"extract_metadata"}', "Model MUST call THAT specific tool",
         "A specific step must run first; handle later steps in follow-up turns"),
    ]
    for setting, behavior, use in modes:
        h2(setting)
        kv("  behavior", behavior)
        kv("  use when", use)

    code('# Force extract_metadata to run before any enrichment step\n'
         'tool_choice = {"type": "tool", "name": "extract_metadata"}', "forced first step")

    rule()
    h1("Plain-language analogy & the common confusion")
    analogy('Give a specialist a focused toolkit, not the whole hardware store. A surgeon with five right instruments works better than one staring at five hundred — every extra tool is one more wrong choice waiting to happen.')
    pitfall("More tools feel safer ('just in case'). They are not — selection reliability drops as the toolset grows, and an agent with off-role tools starts misusing them. Scope each agent to its job.")

    tip("'auto' = optional, 'any' = must call something, forced = must call that one. "
        "Pair with Task 4.3: 'any' guarantees structured output when the document type "
        "(hence the right schema) is unknown.")


if __name__ == "__main__":
    main()
```

---

## Task 2.4 — Integrate MCP servers into Claude Code and agent workflows

**Source:** https://github.com/jacinthpaul/Claude-Certified-Architect/blob/claude/architect-exam-codebase-7ytdjz/domains/domain2_tools_mcp/task2_4_mcp_integration.py

### Objective
Integrate MCP servers into Claude Code and agent workflows.

### Concept
- CONFIG SCOPING:
  - `.mcp.json` (in the repo) -> PROJECT-level, shared with the team via version control. Use for tooling everyone needs (issue tracker, shared DBs).
  - `~/.claude.json` (home dir) -> USER-level, personal, NOT shared. Use for personal/experimental servers.
- CREDENTIALS via env-var expansion: write `${GITHUB_TOKEN}` in `.mcp.json`, not the secret — the config can be committed safely; each machine supplies its own token.
- ALL servers, all at once: tools from every configured MCP server are discovered at connection time and available simultaneously (project + personal coexist).
- RESOURCES vs TOOLS: tools = ACTIONS; resources = readable CONTENT CATALOGS (issue summaries, doc hierarchies, DB schemas) so the agent sees what data exists without burning turns on exploratory calls.
- RICH descriptions matter doubly: a thin MCP tool description makes the agent prefer a familiar built-in (like Grep) over your more capable specialized tool.
- BUY BEFORE BUILD: use community servers for standard integrations (Jira); write custom only for team-specific workflows.

### Instructions
1. Team tooling -> `.mcp.json` (travels via version control). Personal/experimental -> `~/.claude.json` (stays on your machine).
2. Write `${JIRA_TOKEN}` (env-var expansion) in `.mcp.json`, never the real token — the config is safe to commit; each machine supplies its own token.
3. Expose data catalogs as RESOURCES so the agent can SEE what data exists without burning turns on exploratory tool calls. Tools = actions (create_issue, run_query).
4. Prefer community servers for standard integrations; write custom servers only for team-specific workflows.

### Acceptance Criteria
- No secrets in committed config — credentials come from `${ENV_VAR}` expansion.
- All configured servers (project + personal) are discovered and usable together.

### Full code
```python
"""
Domain 2 · Task 2.4 — Integrate MCP servers into Claude Code and agent workflows.

THE BIG IDEA
============
  CONFIG SCOPING:
    .mcp.json (in the repo)   -> PROJECT-level, shared with the team via version control.
                                 Use for tooling everyone needs (issue tracker, shared DBs).
    ~/.claude.json (home dir) -> USER-level, personal, NOT shared.
                                 Use for personal/experimental servers.

  CREDENTIALS via env-var expansion: write ${GITHUB_TOKEN} in .mcp.json, not the secret —
  the config can be committed safely; each machine supplies its own token.

  ALL servers, all at once: tools from every configured MCP server are discovered at
  connection time and available simultaneously (project + personal coexist).

  RESOURCES vs TOOLS: tools = ACTIONS; resources = readable CONTENT CATALOGS (issue
  summaries, doc hierarchies, DB schemas) so the agent sees what data exists without
  burning turns on exploratory calls.

  RICH descriptions matter doubly: a thin MCP tool description makes the agent prefer a
  familiar built-in (like Grep) over your more capable specialized tool.

  BUY BEFORE BUILD: use community servers for standard integrations (Jira); write custom
  only for team-specific workflows.
"""

import sys, pathlib, json
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[2]))
from ccarch import banner, concept, h1, h2, wrong, right, tip, note, kv, code, rule, pause, analogy, pitfall


PROJECT_MCP = {
    "mcpServers": {
        "jira": {
            "command": "npx",
            "args": ["-y", "@community/mcp-jira"],
            "env": {"JIRA_TOKEN": "${JIRA_TOKEN}"}   # <-- env expansion, not the secret
        }
    }
}

USER_MCP = {
    "mcpServers": {
        "my-scratch-db": {"command": "python", "args": ["-m", "my_experimental_server"]}
    }
}


def main():
    banner("Domain 2 · Task 2.4", "MCP server integration & scoping")
    concept("Domain 2: Tool Design & MCP Integration (18%)",
            "Task 2.4 — Integrate MCP servers into Claude Code and agent workflows",
            ".mcp.json (shared) vs ~/.claude.json (personal); resources vs tools")

    h1("Where the config lives decides who gets the server")
    h2(".mcp.json  (in the repo → shared with the whole team)")
    code(json.dumps(PROJECT_MCP, indent=2), ".mcp.json")
    h2("~/.claude.json  (home dir → personal only)")
    code(json.dumps(USER_MCP, indent=2), "~/.claude.json")
    right("Team tooling -> .mcp.json (travels via version control). Personal/experimental "
          "-> ~/.claude.json (stays on your machine).")

    pause("secrets")
    rule()
    h1("Credentials via environment-variable expansion")
    wrong('Pasting the real token into .mcp.json and committing it. Now the secret is in '
          'git history forever.')
    right('Write ${JIRA_TOKEN}. The config is safe to commit; each machine supplies its '
          'own token from the environment.')

    rule()
    h1("All servers available simultaneously")
    note("At connection time, tools from EVERY configured server (project + personal) are "
         "discovered and usable together. You don't pick one server per session.")

    rule()
    h1("Resources vs tools")
    kv("tools", "ACTIONS the agent performs (create_issue, run_query)")
    kv("resources", "readable CONTENT CATALOGS (issue summaries, doc hierarchies, DB schemas)")
    right("Expose catalogs as RESOURCES so the agent can SEE what data exists without "
          "burning turns on exploratory tool calls.")

    rule()
    h1("Two more tested points")
    note("- RICH MCP descriptions matter doubly: a thin description makes the agent fall "
         "back to a familiar built-in (Grep) instead of your better specialized tool.")
    note("- BUY before BUILD: community server for Jira; custom servers only for "
         "team-specific workflows.")

    rule()
    h1("Plain-language analogy & the common confusion")
    analogy('Like a team toolbox bolted to the workshop wall (.mcp.json in the repo — everyone shares it) versus your personal toolbox in your locker (~/.claude.json — only you). The same tools can hang in both at once.')
    pitfall('Two mix-ups: putting team servers in your personal config (teammates never get them), and pasting real secrets into the committed .mcp.json. Shared config goes in the repo; secrets go in ${ENV_VARS}, never in the file.')

    tip(".mcp.json = project/shared; ~/.claude.json = personal; secrets via ${ENV_VAR}; "
        "resources = catalogs, tools = actions; all servers coexist.")


if __name__ == "__main__":
    main()
```

---

## Task 2.5 — Select and apply built-in tools (Read, Write, Edit, Bash, Grep, Glob) effectively

**Source:** https://github.com/jacinthpaul/Claude-Certified-Architect/blob/claude/architect-exam-codebase-7ytdjz/domains/domain2_tools_mcp/task2_5_builtin_tools.py

### Objective
Select and apply built-in tools (Read, Write, Edit, Bash, Grep, Glob) effectively.

### Concept
Claude Code ships with built-in tools. The exam tests whether you pick the right one:
- Grep -> searches file CONTENTS for patterns (callers of a function, an error string)
- Glob -> matches file PATHS/names by pattern (**/*.test.tsx for every test file)
- Read -> loads a full file's contents (follow imports after Grep finds entry)
- Write -> writes a complete file (new files; rewrite when Edit can't anchor)
- Edit -> targeted change via UNIQUE text match (fails if anchor isn't unique)
- Bash -> runs shell commands (build, test, git)

MEMORIZE: Grep = CONTENTS, Glob = file NAMES. Near-guaranteed question pattern. Incremental exploration beats bulk reading: Grep to find entry points, THEN Read to follow the threads. Never read every file upfront.

### Instructions
1. Grep to find file CONTENTS matching a pattern; Glob to match file PATHS/names by pattern.
2. Read a full known file after Grep finds an entry point; Write a complete new file.
3. Edit for a targeted change via a UNIQUE text anchor — if the anchor appears more than once it fails, so fall back to Read + Write.
4. Bash for shell commands (build, test, git, scripting).
5. Explore incrementally: Glob which files exist -> Grep where things are defined/called -> Read the file Grep pointed at -> Edit one precise change -> Bash to verify.

### Acceptance Criteria
- Correct tool chosen per task; no bulk-reading every file upfront.

### Full code
```python
"""
Domain 2 · Task 2.5 — Built-in tools: Read, Write, Edit, Bash, Grep, Glob.

THE BIG IDEA
============
Claude Code ships with built-in tools. The exam tests whether you pick the right one:

  Grep  -> searches file CONTENTS for patterns   (callers of a function, an error string)
  Glob  -> matches file PATHS/names by pattern    (**/*.test.tsx for every test file)
  Read  -> loads a full file's contents           (follow imports after Grep finds entry)
  Write -> writes a complete file                 (new files; rewrite when Edit can't anchor)
  Edit  -> targeted change via UNIQUE text match  (fails if anchor isn't unique)
  Bash  -> runs shell commands                    (build, test, git)

MEMORIZE: Grep = CONTENTS, Glob = file NAMES. Near-guaranteed question pattern.
Incremental exploration beats bulk reading: Grep to find entry points, THEN Read to follow
the threads. Never read every file upfront.
"""

import sys, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[2]))
from ccarch import banner, concept, h1, h2, wrong, right, tip, note, kv, code, rule, pause, analogy, pitfall


TASKS = [
    ("Find every file that calls process_refund()", "Grep",
     "You're searching file CONTENTS for a pattern."),
    ("Find every test file in the project", "Glob",
     "You're matching file NAMES/paths: **/*.test.tsx."),
    ("Open orders.py to follow its imports", "Read",
     "You need the full contents of a known file."),
    ("Create a brand-new module config.py", "Write",
     "Writing a complete new file."),
    ("Change one unique line in auth.py", "Edit",
     "Targeted change via a unique text anchor."),
    ("Run the test suite", "Bash",
     "Shell command: pytest / build / git."),
    ("Rewrite a file where the anchor text appears 5 times", "Read + Write",
     "Edit needs a UNIQUE anchor; when it can't find one, fall back to Read + Write."),
]


def quiz_answer(task):
    return next((ans, why) for t, ans, why in TASKS if t == task)


def main():
    banner("Domain 2 · Task 2.5", "Built-in tools — pick the right one")
    concept("Domain 2: Tool Design & MCP Integration (18%)",
            "Task 2.5 — Select and apply built-in tools (Read, Write, Edit, Bash, Grep, Glob) effectively",
            "Grep=contents, Glob=names; incremental exploration")

    h1("The decision table")
    rows = [
        ("Grep", "searches file CONTENTS", "callers of a function, an error message, imports"),
        ("Glob", "matches file PATHS/names", "files by name/extension, **/*.test.tsx"),
        ("Read", "loads a full file", "follow imports, trace logic after Grep finds entry"),
        ("Write", "writes a complete file", "new files; rewrite when Edit can't anchor"),
        ("Edit", "targeted change via UNIQUE match", "small precise edits (fails if not unique)"),
        ("Bash", "runs shell commands", "build, test, git, scripting"),
    ]
    for name, what, when in rows:
        kv(f"  {name:5}", f"{what:32} -> {when}")

    pause("the quiz")
    rule()
    h1("Pick-the-tool quiz")
    for task, ans, why in TASKS:
        h2(task)
        right(f"{ans}")
        note(f"    {why}")

    rule()
    h1("A real exploration, in the order the tools fire")
    code(
        '''Glob "**/*.py"                 # which files exist?
Grep "def process_refund"      # where is it defined / who calls it?
Read payments/refund.py        # load the file Grep pointed at
Edit payments/refund.py        # one precise change (unique anchor required)
Bash "python -m pytest -q"     # verify the change''',
        "the built-in tools in use")

    rule()
    h1("The contrast you WILL be tested on")
    code("Grep = file CONTENTS  (what's INSIDE files)\n"
         "Glob = file NAMES     (which files EXIST)", "memorize")

    rule()
    h1("Incremental exploration beats bulk reading")
    wrong("Reading every file upfront to 'understand the codebase'. Wasteful; blows context.")
    right("Grep to find entry points -> Read to follow the threads. For wrapper modules: "
          "first identify all exported names, then Grep each across the codebase.")

    rule()
    h1("Plain-language analogy & the common confusion")
    analogy("Glob reads the library's index cards (file NAMES); Grep walks the shelves and reads inside the books (file CONTENTS).")
    pitfall("Both feel like 'search', so learners grab the wrong one. Mnemonic: gloB to Browse file names; greP to find Patterns in text. And Edit needs a UNIQUE anchor — if the text appears twice it fails, so fall back to Read + Write.")

    tip("Grep = CONTENTS, Glob = NAMES. Edit needs a unique anchor; fallback is Read + Write. "
        "Explore incrementally, never bulk-read.")


if __name__ == "__main__":
    main()
```
