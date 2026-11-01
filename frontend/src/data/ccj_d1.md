## Domain Overview

# Domain 1 — Agentic Architecture & Orchestration (27%, the biggest domain)

How a single agent runs its work loop, how a coordinator manages a team of subagents, and
how you enforce workflows that must happen in order.

| Task | Demo | One-line idea |
|---|---|---|
| 1.1 Design and implement agentic loops for autonomous task execution | `task1_1_agentic_loop.py` | Loop on `stop_reason`; append tool results to history |
| 1.2 Orchestrate multi-agent systems with coordinator-subagent patterns | `task1_2_coordinator_subagents.py` | Hub-and-spoke; the coordinator's decomposition is the risk |
| 1.3 Configure subagent invocation, context passing, and spawning | `task1_3_subagent_invocation.py` | `Task` tool, explicit context, parallel spawning, structured handoffs |
| 1.4 Implement multi-step workflows with enforcement and handoff patterns | `task1_4_workflow_enforcement.py` | Prerequisite **gates** (deterministic) beat prompt guidance |
| 1.5 Apply Agent SDK hooks for tool call interception and data normalization | `task1_5_hooks.py` | PostToolUse normalizes after; interception blocks before |
| 1.6 Design task decomposition strategies for complex workflows | `task1_6_task_decomposition.py` | Prompt chaining (known steps) vs dynamic adaptive |
| 1.7 Manage session state, resumption, and forking | `task1_7_session_state.py` | `--resume` vs `fork_session` vs fresh-start |

```bash
python3 run_all.py domain1     # run all seven, non-stop
```

**Exam priority:** Domains 1 + 2 are 45% of the exam and share one philosophy — *agents
are only as reliable as the structure around them.* Master 1.1, 1.2, and 1.4 first.

---

## Task 1.1 — Design and implement agentic loops for autonomous task execution

**Source:** https://github.com/jacinthpaul/Claude-Certified-Architect/blob/claude/architect-exam-codebase-7ytdjz/domains/domain1_orchestration/task1_1_agentic_loop.py

### Objective
Design and implement agentic loops for autonomous task execution — run a complete loop for: "Where is my order #12345?" (run live with `ANTHROPIC_API_KEY` or offline with a deterministic simulator).

### Concept
An "agent" is not one API call. It is a LOOP between your code and Claude:

- your code sends a request -> Claude replies with a `stop_reason`
  - if `stop_reason == "tool_use"`: run the tool, append the result, loop again
  - if `stop_reason == "end_turn"`: Claude is finished, exit and show the answer
- Claude DECIDES which tool to call; YOUR CODE executes it. Claude never touches your systems directly.
- Tool results MUST be appended to the conversation history or Claude literally never learns what happened (it has no memory outside the conversation).

### Instructions
1. Loop on `stop_reason`; append tool results to history.
2. When `stop_reason == "tool_use"`: record what Claude asked for, YOUR CODE executes each tool and appends the result, then loop continues so Claude can reason over the new facts.
3. When `stop_reason == "end_turn"`: exit and present the answer — the ONLY normal exit.
4. Use an iteration cap (`max_safety_iterations`) ONLY as a safety net, never as the primary stop mechanism.

### Acceptance Criteria
- Normal termination must be `stop_reason == 'end_turn'`.
- Every tool result is appended to the messages list before the next turn.
- Do not parse Claude's natural-language text for "I'm done" to decide when to stop.
- Do not treat "response contains text" as a completion signal (a turn can contain BOTH text and a tool_use block).

### Full code
```python
"""
Domain 1 · Task 1.1 — Design and implement agentic loops for autonomous task execution.

THE BIG IDEA
============
An "agent" is not one API call. It is a LOOP between your code and Claude:

    your code sends a request
      -> Claude replies with a `stop_reason`
         -> if stop_reason == "tool_use":  run the tool, append the result, loop again
         -> if stop_reason == "end_turn":  Claude is finished, exit and show the answer

Claude DECIDES which tool to call; YOUR CODE executes it. Claude never touches your
systems directly. Tool results MUST be appended to the conversation history or Claude
literally never learns what happened (it has no memory outside the conversation).

This file runs a complete loop for: "Where is my order #12345?"
Run it live (with ANTHROPIC_API_KEY) or offline (a deterministic simulator stands in
for the model so the control-flow is identical).
"""

import sys, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[2]))

from ccarch import ClaudeClient, LLMResponse, ToolCall
from ccarch import banner, concept, h1, h2, wrong, right, tip, note, kv, code, rule, pause, analogy, pitfall


# --- The tools the agent can call (your code owns these) ----------------------
ORDERS = {"12345": {"status": "shipped", "eta": "June 15", "customer_id": "CUST-9"}}


def lookup_order(order_id: str) -> dict:
    """Your code actually hits the backend here."""
    return ORDERS.get(order_id, {"error": "not_found"})


TOOLS = [
    {
        "name": "lookup_order",
        "description": "Look up the status and ETA of an order by its order_id.",
        "input_schema": {
            "type": "object",
            "properties": {"order_id": {"type": "string"}},
            "required": ["order_id"],
        },
    }
]


# --- Offline simulator: mimics how Claude would drive THIS conversation -------
def simulator(system, messages, tools) -> LLMResponse:
    """Turn 1: ask for the tool. Turn 2 (after a tool result is present): answer."""
    has_tool_result = any(
        isinstance(m.get("content"), list)
        and any(b.get("type") == "tool_result" for b in m["content"])
        for m in messages
    )
    if not has_tool_result:
        return LLMResponse(
            text="I'll look that up.",
            stop_reason="tool_use",
            tool_calls=[ToolCall(name="lookup_order", input={"order_id": "12345"})],
        )
    return LLMResponse(
        text="Good news — your order #12345 shipped and arrives June 15.",
        stop_reason="end_turn",
    )


def run_agent(client: ClaudeClient, user_message: str, max_safety_iterations: int = 10):
    system = (
        "You are a support agent. Use tools to find facts before answering. "
        "Never invent order status."
    )
    messages = [{"role": "user", "content": user_message}]

    for i in range(max_safety_iterations):  # safety net ONLY, not the real stop signal
        resp = client.complete(system, messages, tools=TOOLS, simulator=simulator)
        tag = "  (simulated)" if resp.simulated else "  (live)"
        h2(f"Iteration {i + 1}{tag} — stop_reason = {resp.stop_reason!r}")

        # >>> The decision that the whole exam hinges on <<<
        if resp.stop_reason == "end_turn":
            note(f"Claude is done. Final answer: {resp.text}")
            return resp.text

        if resp.stop_reason == "tool_use":
            # 1. record what Claude asked for
            messages.append(
                {"role": "assistant", "content": [
                    {"type": "tool_use", "id": tc.id, "name": tc.name, "input": tc.input}
                    for tc in resp.tool_calls
                ]}
            )
            # 2. YOUR CODE executes each tool and appends the result
            results = []
            for tc in resp.tool_calls:
                out = lookup_order(**tc.input)
                note(f"    your code ran {tc.name}({tc.input}) -> {out}")
                results.append({"type": "tool_result", "tool_use_id": tc.id,
                                "content": str(out)})
            messages.append({"role": "user", "content": results})
            # 3. loop continues so Claude can reason over the new facts

    return "[safety cap hit — investigate, this should rarely happen]"


def main():
    banner("Domain 1 · Task 1.1", "The Agentic Loop — stop_reason drives everything")
    concept("Domain 1: Agentic Architecture & Orchestration (27%)",
            "Task 1.1 — Design and implement agentic loops for autonomous task execution",
            "Loop on stop_reason; append tool results to history")

    h1("Watch one complete loop: 'Where is my order #12345?'")
    client = ClaudeClient()
    kv("client mode", client.mode)
    pause("the loop")
    run_agent(client, "Where is my order #12345?")

    rule()
    h1("The agentic loop, distilled to its essential shape")
    code(
        '''messages = [{"role": "user", "content": user_message}]
while True:                                   # safety cap omitted for clarity
    resp = client.messages.create(model=..., tools=TOOLS, messages=messages)
    if resp.stop_reason == "end_turn":
        return resp.text                      # <- the ONLY normal exit
    if resp.stop_reason == "tool_use":
        messages.append({"role": "assistant", "content": resp.content})
        results = [run_tool(tc) for tc in resp.tool_calls]   # YOUR code runs them
        messages.append({"role": "user", "content": results})  # feed facts back
        # loop: Claude now reasons over the new tool results''',
        "the loop, in code")

    rule()
    h1("Why tool results MUST go back into the conversation")
    note("Claude has no memory outside the messages list. If you execute lookup_order "
         "but forget to append the result, the next turn Claude is blind to it and will "
         "either re-call the tool forever or hallucinate an answer.")

    rule()
    h1("Anti-patterns the exam will tempt you with")
    wrong("Parsing Claude's natural-language text for 'I'm done' to decide when to stop. "
          "Fragile — Claude can add commentary next to a tool call.")
    wrong("Using an iteration cap ('stop after 10') as the PRIMARY stop mechanism. "
          "A cap is a safety net only; normal termination must be stop_reason == 'end_turn'.")
    wrong("Treating 'response contains text' as a completion signal. A turn can contain "
          "BOTH text and a tool_use block.")
    right("Inspect stop_reason. 'tool_use' -> run tool, append result, continue. "
          "'end_turn' -> exit and present the answer.")

    rule()
    h1("Plain-language analogy & the common confusion")
    analogy("Think of a chef (Claude) and a kitchen runner (your code). The chef calls out 'dice an onion' — a tool_use — but cannot reach the pantry; the runner fetches, dices, and hands the bowl back. The chef looks, calls the next step, and only when they say 'plate it, done' (end_turn) does the runner stop. The chef is the brain; the runner is the hands.")
    pitfall("The number-one beginner confusion: 'Claude runs the tool.' It does not. Claude only REQUESTS a tool; your code executes it and appends the result. Miss that and the whole loop stops making sense.")

    tip("If an answer option decides loop termination by anything other than stop_reason, "
        "it is almost certainly a distractor.")

    note("\nAlso know: model-driven > pre-scripted. The agent's value is that Claude picks "
         "the next tool from what it has learned — not a fixed flowchart your team hard-coded. "
         "Decision trees are brittle; model-driven loops adapt.")


if __name__ == "__main__":
    main()
```

---

## Task 1.2 — Orchestrate multi-agent systems with coordinator-subagent patterns

**Source:** https://github.com/jacinthpaul/Claude-Certified-Architect/blob/claude/architect-exam-codebase-7ytdjz/domains/domain1_orchestration/task1_2_coordinator_subagents.py

### Objective
Orchestrate multi-agent systems with coordinator-subagent patterns: for big tasks, one COORDINATOR delegates to specialist SUBAGENTS in a HUB-AND-SPOKE shape.

### Concept
- Hub-and-spoke: every message flows through the coordinator; subagents NEVER talk to each other directly. Central routing buys observability, consistent error handling, and controlled information flow.
- The coordinator has four jobs: (1) DECOMPOSE the task into subtasks, (2) DELEGATE to the right subagents (dynamically — not always the full pipeline), (3) AGGREGATE results, (4) EVALUATE for gaps and re-delegate (iterative refinement).
- THE #1 TESTED FAILURE: narrow decomposition. Every subagent can succeed perfectly while the REPORT is incomplete — because the coordinator carved the topic too thin (reproduces official sample question Q7).

### Instructions
1. Decompose the task into distinct, non-overlapping subtopics spanning the whole topic (broad, partitioned decomposition).
2. Assign DISTINCT subtasks so two subagents don't research the same thing.
3. Add an EVALUATE step: after synthesis, check coverage vs. the topic's known sectors and re-delegate to fill any gap (iterative refinement loop).
4. Route all messages through the coordinator — no direct subagent-to-subagent links.
5. When a multi-agent system produces an incomplete report but every subagent "completed successfully", look UPSTREAM: the root cause is the coordinator's decomposition, not the subagents.

### Acceptance Criteria
- Every subagent reports success yet the report is complete — no missing sectors.
- Subagents have ISOLATED context; anything they need is written into their prompt.
- Dynamic delegation: pick which subagents to run based on the query; don't always run the full pipeline.

### Full code
```python
"""
Domain 1 · Task 1.2 — Orchestrate multi-agent systems (coordinator + subagents).

THE BIG IDEA
============
For big tasks, one COORDINATOR delegates to specialist SUBAGENTS. The standard shape is
HUB-AND-SPOKE: every message flows through the coordinator; subagents NEVER talk to each
other directly. That central routing buys you observability, consistent error handling,
and controlled information flow.

The coordinator has four jobs:
  1. DECOMPOSE the task into subtasks
  2. DELEGATE to the right subagents (dynamically — not always the full pipeline)
  3. AGGREGATE results
  4. EVALUATE for gaps and re-delegate (iterative refinement)

THE #1 TESTED FAILURE: narrow decomposition. Every subagent can succeed perfectly while
the REPORT is incomplete — because the coordinator carved the topic too thin. This demo
reproduces the official sample question (Q7): researching "impact of AI on creative
industries" but only covering visual arts.
"""

import sys, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[2]))
from ccarch import banner, concept, h1, h2, wrong, right, tip, note, kv, code, rule, pause, analogy, pitfall


def research(subtopics):
    """Each 'subagent' succeeds at its assigned slice. Success != coverage."""
    findings = {}
    for st in subtopics:
        findings[st] = f"[3 sources found and summarized for '{st}']  ✓ subagent OK"
    return findings


ALL_SECTORS = {"digital art", "graphic design", "photography",
               "music", "writing", "film production"}


def main():
    banner("Domain 1 · Task 1.2", "Coordinator + Subagents — hub-and-spoke")
    concept("Domain 1: Agentic Architecture & Orchestration (27%)",
            "Task 1.2 — Orchestrate multi-agent systems with coordinator-subagent patterns",
            "Hub-and-spoke; the coordinator's decomposition is the risk")

    h1("Hub-and-spoke architecture")
    code(
        "            ┌───────────────┐\n"
        "   web ───► │               │ ◄─── docs\n"
        "            │  COORDINATOR  │\n"
        "  synth ──► │   (the hub)   │ ◄─── report\n"
        "            └───────────────┘\n"
        "   web  ✗──────────────────✗  synth   <-- this direct link must NOT exist",
        "topology")
    note("Analogy: a general contractor. The plumber and electrician don't coordinate "
         "with each other — the contractor sequences work, routes info, handles problems.")

    rule()
    h1("Reproducing the classic failure (sample Q7)")
    h2("Topic: 'impact of AI on creative industries'")

    narrow = ["AI in digital art creation", "AI in graphic design", "AI in photography"]
    note("Coordinator decomposed into 3 narrow subtasks:")
    for s in narrow:
        kv("  subtask", s)
    findings = research(narrow)
    for st, f in findings.items():
        note(f"    {st}: {f}")

    covered = {"digital art", "graphic design", "photography"}
    missing = ALL_SECTORS - covered
    print()
    wrong(f"Every subagent reported success, yet the report MISSES: {sorted(missing)}. "
          f"Blaming the subagents is the trap — the logs show the decomposition was narrow.")
    right("Root cause = the coordinator's task decomposition. Fix it upstream.")

    pause("the fix")
    rule()
    h1("The fix: broad, partitioned decomposition")
    broad = [f"AI in {s}" for s in sorted(ALL_SECTORS)]
    note("Coordinator now assigns DISTINCT subtopics spanning the whole topic:")
    for s in broad:
        kv("  subtask", s)
    note("Plus an EVALUATE step: after synthesis, check coverage vs. the topic's known "
         "sectors and re-delegate to fill any gap (iterative refinement loop).")

    rule()
    h1("Critical facts to remember")
    note("- Subagents have ISOLATED context — they do not inherit the coordinator's history. "
         "Anything they need must be written into their prompt (see Task 1.3).")
    note("- DYNAMIC delegation: pick which subagents to run based on the query; don't always "
         "run the full pipeline.")
    note("- PARTITION scope so two subagents don't research the same thing.")

    rule()
    h1("Plain-language analogy & the common confusion")
    analogy('A general contractor and trade crews: the plumber and electrician never coordinate directly — the contractor sequences the work, passes information between them, and inspects the result. That central desk is the coordinator.')
    pitfall("Learners blame the subagent when a report comes back thin. But each subagent only did the slice it was handed — the gap was created upstream when the coordinator carved the topic. Always read the coordinator's decomposition first.")

    tip("When a multi-agent system produces an incomplete report but every subagent "
        "'completed successfully', look UPSTREAM: the root cause is the coordinator's "
        "decomposition, not the subagents.")


if __name__ == "__main__":
    main()
```

---

## Task 1.3 — Configure subagent invocation, context passing, and spawning

**Source:** https://github.com/jacinthpaul/Claude-Certified-Architect/blob/claude/architect-exam-codebase-7ytdjz/domains/domain1_orchestration/task1_3_subagent_invocation.py

### Objective
Configure subagent invocation, context passing, and spawning — the MECHANICS of launching subagents in the Claude Agent SDK.

### Concept
- The `Task` tool spawns subagents. The coordinator's `allowedTools` MUST include "Task" or it physically cannot delegate (classic exam gotcha).
- Subagents have NO shared memory. Context must be PASTED INTO their prompt.
- `AgentDefinition` = a subagent's job description (purpose, system prompt, tool limits).
- PARALLEL spawning = emit MULTIPLE Task calls in ONE response (not one per turn).
- STRUCTURED handoffs separate content from metadata so citations survive.
- Prompts should state GOALS + quality criteria, not rigid step-by-step scripts.
- `fork_session` branches from a shared baseline to explore divergent approaches.

### Instructions
1. Include `"Task"` in the coordinator's `allowedTools` or it CANNOT spawn subagents.
2. Pass context EXPLICITLY — the synthesis subagent cannot see what the web-search subagent found unless the coordinator pastes those findings into the synthesis prompt.
3. Pass findings as STRUCTURED data separating content from metadata (URL, doc name, page) so citations and attribution survive the journey between agents.
4. For parallel spawning, emit MULTIPLE Task calls in ONE response (fast), not one per turn (serial, slow).
5. State goals + quality criteria in prompts rather than rigid step-by-step scripts.
6. Use `fork_session` to branch from a shared baseline and explore divergent approaches.

### Acceptance Criteria
- `Task` is in `allowedTools`.
- Subagents inherit NOTHING from the parent conversation; context is pasted into their prompt.
- Parallelism = multiple Task calls in a single response.
- Structured handoffs preserve citations.

### Full code
```python
"""
Domain 1 · Task 1.3 — Configure subagent invocation, context passing, and spawning.

THE BIG IDEA
============
The MECHANICS of launching subagents in the Claude Agent SDK:

  * The `Task` tool spawns subagents. The coordinator's `allowedTools` MUST include
    "Task" or it physically cannot delegate (classic exam gotcha).
  * Subagents have NO shared memory. Context must be PASTED INTO their prompt.
  * `AgentDefinition` = a subagent's job description (purpose, system prompt, tool limits).
  * PARALLEL spawning = emit MULTIPLE Task calls in ONE response (not one per turn).
  * STRUCTURED handoffs separate content from metadata so citations survive.
  * Prompts should state GOALS + quality criteria, not rigid step-by-step scripts.
  * `fork_session` branches from a shared baseline to explore divergent approaches.
"""

import sys, pathlib, json
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[2]))
from ccarch import banner, concept, h1, h2, wrong, right, tip, note, kv, code, rule, pause, analogy, pitfall


def main():
    banner("Domain 1 · Task 1.3", "Subagent invocation, context passing, spawning")
    concept("Domain 1: Agentic Architecture & Orchestration (27%)",
            "Task 1.3 — Configure subagent invocation, context passing, and spawning",
            "Task tool + explicit context + parallel spawning")

    h1("1) The coordinator needs 'Task' in allowedTools")
    code('coordinator = AgentDefinition(\n'
         '    description="Research coordinator",\n'
         '    allowedTools=["Task"],   # <-- without this it CANNOT spawn subagents\n'
         ')', "agent sdk")
    wrong("Forgetting 'Task' in allowedTools, then debugging why delegation 'silently' "
          "does nothing.")

    rule()
    h1("2) Subagents have isolated context — pass it EXPLICITLY")
    note("The synthesis subagent cannot see what the web-search subagent found unless the "
         "coordinator pastes those findings into the synthesis prompt.")
    handoff = {
        "claim": "Global AI market reached $184B in 2024",
        "source_url": "https://example.org/ai-report-2024",
        "source_name": "AI Industry Report 2024",
        "page": 12,
        "relevance": 0.92,
    }
    code(json.dumps(handoff, indent=2), "structured handoff (content + metadata)")
    right("Pass findings as STRUCTURED data separating content from metadata (URL, doc "
          "name, page). Citations and attribution survive the journey between agents.")
    wrong("Handing the next agent a blob of prose. The source URLs and page numbers blur "
          "out and citations die in summarization.")

    pause("parallel spawning")
    rule()
    h1("3) Parallel spawning = multiple Task calls in ONE response")
    code("# SLOW: one Task per turn (serial)\n"
         "turn 1 -> Task(web_search)\n"
         "turn 2 -> Task(doc_analysis)\n\n"
         "# FAST: multiple Task calls emitted together (parallel)\n"
         "turn 1 -> [ Task(web_search), Task(doc_analysis) ]", "latency")
    note("Emitting them together lets the runtime run the subagents simultaneously, "
         "cutting wall-clock latency.")

    rule()
    h1("4) Goals over procedures")
    wrong('Coordinator prompt: "Step 1: search Google. Step 2: open the first 3 links. '
          'Step 3: ..." — rigid scripts stop subagents from adapting.')
    right('Coordinator prompt: "Find peer-reviewed sources covering ALL major creative '
          'sectors; flag any sector you could not cover." — goals + quality criteria.')

    rule()
    h1("5) fork_session — branch from a shared baseline")
    note("fork_session creates independent branches from one analysis baseline — e.g., "
         "explore two refactoring strategies from the same codebase understanding WITHOUT "
         "redoing the analysis. (More in Task 1.7.)")

    rule()
    h1("Plain-language analogy & the common confusion")
    analogy("A coordinator briefing analysts who work in separate rooms with the doors shut. Nothing on the coordinator's whiteboard is visible to them — whatever they need (prior findings, source URLs) must be photocopied into the briefing packet.")
    pitfall("Beginners assume subagents can 'see' the parent conversation. They cannot — context is isolated. If you do not paste it into the subagent's prompt, it simply does not exist for that agent.")

    tip("Gotchas bundled here: 'Task' must be in allowedTools; subagents inherit NOTHING; "
        "parallelism = multiple Task calls in a single response; structured handoffs "
        "preserve citations.")


if __name__ == "__main__":
    main()
```

---

## Task 1.4 — Implement multi-step workflows with enforcement and handoff patterns

**Source:** https://github.com/jacinthpaul/Claude-Certified-Architect/blob/claude/architect-exam-codebase-7ytdjz/domains/domain1_orchestration/task1_4_workflow_enforcement.py

### Objective
Implement multi-step workflows with enforcement and handoff patterns — plus decomposing multi-concern requests, and structured escalation handoffs.

### Concept
THE SINGLE MOST IMPORTANT IDEA IN THIS DOMAIN: Prompt instructions are PROBABILISTIC; programmatic enforcement is DETERMINISTIC. Telling Claude "always verify the customer before refunding" works MOST of the time — a disaster for money, security, or compliance. When compliance must be GUARANTEED, build a programmatic PREREQUISITE GATE: code that blocks `process_refund` until `get_customer` has returned a verified customer ID. This is the logic behind official sample question Q1 (agent skips identity check 12% of the time). The fix is a gate, not better prompt wording.

### Instructions
1. Use programmatic enforcement (hooks, prerequisite gates) for identity, financial limits, compliance, security — DETERMINISTIC and guaranteed.
2. Reserve prompt-based guidance for style/soft ordering — PROBABILISTIC with a non-zero failure rate.
3. For multi-concern requests: decompose into distinct items, investigate each (in parallel, shared context), then synthesize a single unified resolution — don't answer only the first issue.
4. When escalating to a human: compile a structured handoff packet with customer ID, root cause, amount, and recommended action. NEVER hand a human a cold start.

### Acceptance Criteria
- `process_refund` is physically impossible until identity is verified — regardless of what the prompt says or what the model "decides".
- The guarantee lives in code (a raised exception), not in the prompt — no prompt wording can talk its way past a raised exception.

### Full code
```python
"""
Domain 1 · Task 1.4 — Multi-step workflows: enforcement and handoff patterns.

THE SINGLE MOST IMPORTANT IDEA IN THIS DOMAIN
=============================================
Prompt instructions are PROBABILISTIC; programmatic enforcement is DETERMINISTIC.

Telling Claude "always verify the customer before refunding" works MOST of the time.
"Most of the time" is a disaster for money, security, or compliance. When compliance
must be GUARANTEED, build a programmatic PREREQUISITE GATE: code that blocks
process_refund until get_customer has returned a verified customer ID.

This is the logic behind official sample question Q1 (agent skips identity check 12% of
the time). The fix is a gate, not better prompt wording.

Also here: decomposing multi-concern requests, and structured escalation handoffs.
"""

import sys, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[2]))
from ccarch import banner, concept, h1, h2, wrong, right, tip, note, kv, code, rule, pause, analogy, pitfall


class RefundGate:
    """A deterministic prerequisite gate. process_refund is impossible until identity
    is verified — regardless of what the prompt says or what the model 'decides'."""

    def __init__(self):
        self.verified_customer_id = None

    def get_customer(self, name=None, customer_id=None):
        # In reality this hits your CRM and returns a verified id.
        self.verified_customer_id = "CUST-9"
        return {"verified_customer_id": self.verified_customer_id, "name": "Dana Lee"}

    def process_refund(self, order_id, amount):
        if not self.verified_customer_id:           # <-- THE GATE
            raise PermissionError(
                "BLOCKED: process_refund requires a verified customer ID first "
                "(call get_customer)."
            )
        return {"refunded": amount, "order_id": order_id,
                "to": self.verified_customer_id}


def main():
    banner("Domain 1 · Task 1.4", "Enforcement & handoff — guarantees beat instructions")
    concept("Domain 1: Agentic Architecture & Orchestration (27%)",
            "Task 1.4 — Implement multi-step workflows with enforcement and handoff patterns",
            "Prerequisite gates (deterministic) vs prompt guidance (probabilistic)")

    h1("The distinction the exam tests more than any other")
    note("Prompt-based guidance ('you must do X first'): PROBABILISTIC — non-zero failure "
         "rate. Fine for style/soft ordering.")
    note("Programmatic enforcement (hooks, prerequisite gates): DETERMINISTIC — guaranteed. "
         "Use for identity, financial limits, compliance, security.")

    pause("the gate in action")
    rule()
    h1("Demo: a refund gate that physically cannot be skipped")
    gate = RefundGate()

    h2("Attempt 1 — agent tries to refund WITHOUT verifying identity")
    try:
        gate.process_refund(order_id="12345", amount=80.0)
    except PermissionError as e:
        wrong("Agent skipped get_customer (this happens ~12% of the time with prompt-only "
              "rules). With a gate, the call is rejected:")
        note(f"    {e}")

    h2("Attempt 2 — verify first, then refund")
    cust = gate.get_customer(name="Dana Lee")
    note(f"    get_customer -> {cust}")
    result = gate.process_refund(order_id="12345", amount=80.0)
    right(f"Refund allowed only after verification: {result}")

    h2("The gate itself — the guarantee lives in code, not in the prompt")
    code(
        '''def process_refund(self, order_id, amount):
    if not self.verified_customer_id:        # <-- THE GATE (deterministic)
        raise PermissionError(
            "BLOCKED: verify identity (call get_customer) first")
    return charge_refund(order_id, amount)
# No prompt wording can talk its way past a raised exception.''',
        "the prerequisite gate, in code")

    rule()
    h1("Plain-language analogy & the common confusion")
    analogy("A bank teller cannot release cash until the system confirms your ID — the block lives in the software, not in the teller's good intentions. A prerequisite gate is exactly that software block.")
    pitfall("The trap is thinking a strongly-worded prompt ('ALWAYS verify first!') is enough. Prompts work most of the time; gates work every time. For money, security, and compliance, 'most of the time' is a failure.")

    tip("Sample Q1: agent skips identity check 12% of the time. Correct answer = a "
        "programmatic prerequisite gate. Distractors (stronger prompt wording, few-shot "
        "examples) are probabilistic; a routing classifier fixes availability, not ORDERING.")

    pause("multi-concern requests")
    rule()
    h1("Multi-concern requests: decompose, investigate, synthesize ONE answer")
    note('Customer: "My order is late, I was double-charged, and I want to update my email."')
    concerns = ["late delivery", "double charge", "email update"]
    for c in concerns:
        kv("  concern", f"{c}  -> investigated (in parallel, shared context)")
    right("Decompose into distinct items, investigate each, then synthesize a single "
          "unified resolution. Don't answer only the first issue and drop the rest.")

    rule()
    h1("Structured handoff summary when escalating to a human")
    summary = {
        "customer_id": "CUST-9",
        "root_cause": "Carrier lost the package; second damaged delivery",
        "refund_amount": 847.50,
        "recommended_action": "Approve full refund + expedited replacement",
    }
    code("\n".join(f"{k}: {v}" for k, v in summary.items()), "handoff packet")
    right("The human can't see the chat transcript. Compile customer ID, root cause, "
          "amount, and recommended action. NEVER hand a human a cold start.")


if __name__ == "__main__":
    main()
```

---

## Task 1.5 — Apply Agent SDK hooks for tool call interception and data normalization

**Source:** https://github.com/jacinthpaul/Claude-Certified-Architect/blob/claude/architect-exam-codebase-7ytdjz/domains/domain1_orchestration/task1_5_hooks.py

### Objective
Apply Agent SDK hooks for tool call interception and data normalization — two patterns: PostToolUse (normalize AFTER a tool returns) and tool-call interception (BLOCK BEFORE a tool runs).

### Concept
Hooks are checkpoints around tool calls. Two patterns matter:
- PostToolUse (AFTER a tool returns): transform/normalize results before Claude sees them. E.g., three backends return dates as Unix timestamps, ISO 8601 strings, and numeric status codes — a PostToolUse hook normalizes them to ONE format so the agent never juggles inconsistencies.
- Tool-call interception (BEFORE a tool runs): inspect outgoing calls and BLOCK policy violations. E.g., any `process_refund` above $500 is blocked and redirected to human escalation — guaranteed, every time, regardless of the prompt.
- Same dichotomy as Task 1.4: "guaranteed compliance required" -> hook (deterministic). The distractors offer prompt wording / few-shot / confidence thresholds instead.

### Instructions
1. Use PostToolUse hooks to normalize heterogeneous tool outputs BEFORE the agent reasons over them (one place fixes every backend).
2. Use interception (PreToolUse) hooks to block policy violations BEFORE they run — return a deny decision instead of allowing the call.
3. Distinguish the two hook directions: PostToolUse runs AFTER a tool to clean up its RESULT; interception runs BEFORE a tool to allow or block the CALL. After = tidy the data; before = guard the action.
4. When "guaranteed compliance required" -> hook. Distractors (prompt wording, few-shot examples, confidence thresholds) are all probabilistic and wrong when the rule must hold 100% of the time.

### Acceptance Criteria
- Refunds over the policy threshold are blocked, every time, regardless of the prompt.
- The agent never sees heterogeneous date formats — all normalized to one ISO 8601 string.

### Full code
```python
"""
Domain 1 · Task 1.5 — Agent SDK hooks: interception and normalization.

THE BIG IDEA
============
Hooks are checkpoints around tool calls. Two patterns matter:

  * PostToolUse (AFTER a tool returns): transform/normalize results before Claude sees
    them. E.g., three backends return dates as Unix timestamps, ISO 8601 strings, and
    numeric status codes — a PostToolUse hook normalizes them to ONE format so the agent
    never juggles inconsistencies.

  * Tool-call interception (BEFORE a tool runs): inspect outgoing calls and BLOCK policy
    violations. E.g., any process_refund above $500 is blocked and redirected to human
    escalation — guaranteed, every time, regardless of the prompt.

Same dichotomy as Task 1.4: "guaranteed compliance required" -> hook (deterministic).
The distractors offer prompt wording / few-shot / confidence thresholds instead.
"""

import sys, pathlib
from datetime import datetime, timezone
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[2]))
from ccarch import banner, concept, h1, h2, wrong, right, tip, note, kv, code, rule, pause, analogy, pitfall


# --- PostToolUse: normalize heterogeneous date formats to one ISO 8601 string -
def normalize_dates(tool_name, raw_result: dict) -> dict:
    out = dict(raw_result)
    val = out.get("date")
    if isinstance(val, (int, float)):                      # Unix timestamp
        out["date"] = datetime.fromtimestamp(val, tz=timezone.utc).date().isoformat()
    elif isinstance(val, str) and val.isdigit():           # numeric status code as string
        out["date"] = datetime.fromtimestamp(int(val), tz=timezone.utc).date().isoformat()
    # already-ISO strings pass through unchanged
    out["_normalized_by"] = "PostToolUse hook"
    return out


# --- Interception: block refunds over the policy threshold --------------------
REFUND_LIMIT = 500.0

def refund_interceptor(tool_name, tool_input: dict):
    """Return (allowed, redirected_action)."""
    if tool_name == "process_refund" and tool_input.get("amount", 0) > REFUND_LIMIT:
        return False, {
            "action": "escalate_to_human",
            "reason": f"Refund ${tool_input['amount']:.2f} exceeds ${REFUND_LIMIT:.0f} limit",
        }
    return True, None


def main():
    banner("Domain 1 · Task 1.5", "Hooks — normalize after, intercept before")
    concept("Domain 1: Agentic Architecture & Orchestration (27%)",
            "Task 1.5 — Apply Agent SDK hooks for tool call interception and data normalization",
            "PostToolUse normalization + interception gating")

    h1("PostToolUse hook: normalize heterogeneous tool outputs")
    note("Three backends return the same 'date' field three different ways. The hook makes "
         "them uniform BEFORE the agent reasons over them.")
    samples = [
        ("billing_system", {"date": 1717200000}),            # Unix timestamp
        ("orders_system", {"date": "2024-06-01"}),           # already ISO
        ("legacy_system", {"date": "1717200000"}),           # numeric string
    ]
    for name, raw in samples:
        fixed = normalize_dates(name, raw)
        kv(f"  {name}", f"{raw}  ->  {fixed['date']}")
    right("One PostToolUse hook = the agent never has to know three date formats exist.")
    code(
        '''async def normalize_dates(input_data, tool_use_id, context):
    out = input_data["tool_response"]
    out["date"] = to_iso(out["date"])        # one place fixes every backend
    return {"tool_response": out}            # rewrites the result the agent sees

options = ClaudeAgentOptions(hooks={"PostToolUse": [normalize_dates]})''',
        "PostToolUse hook — normalize after")

    pause("interception")
    rule()
    h1("Interception hook: block policy violations BEFORE they run")
    for amount in (80.0, 620.0):
        allowed, redirect = refund_interceptor("process_refund", {"amount": amount})
        if allowed:
            right(f"process_refund(${amount:.2f}) -> allowed (under ${REFUND_LIMIT:.0f}).")
        else:
            wrong(f"process_refund(${amount:.2f}) -> BLOCKED.")
            note(f"    redirected: {redirect}")
    code(
        '''async def refund_gate(input_data, tool_use_id, context):
    if input_data["tool_name"] == "process_refund":
        if input_data["tool_input"]["amount"] > REFUND_LIMIT:
            return {"decision": "deny",       # <-- blocks the call BEFORE it runs
                    "reason": "exceeds limit; escalate to a human"}
    return {}                                  # {} = allow

options = ClaudeAgentOptions(hooks={"PreToolUse": [refund_gate]})''',
        "interception hook — block before")

    rule()
    h1("Hooks vs prompts — the same dichotomy as Task 1.4")
    note("Analogy: a mailroom that opens every package and standardizes the paperwork "
         "(PostToolUse), plus a finance gate that physically cannot release payments above "
         "a threshold without a manager's signature (interception).")

    rule()
    h1("Plain-language analogy & the common confusion")
    analogy("A mailroom that opens every inbound package and standardizes the paperwork (PostToolUse), plus a finance gate that physically cannot release a payment over the limit without a manager's signature (interception).")
    pitfall('Learners mix up the two hook directions. PostToolUse runs AFTER a tool to clean up its RESULT; interception runs BEFORE a tool to allow or block the CALL. After = tidy the data; before = guard the action.')

    tip("'Guaranteed compliance required' -> hook. Distractors will offer prompt wording, "
        "few-shot examples, or confidence thresholds — all probabilistic, all wrong when "
        "the rule must hold 100% of the time.")


if __name__ == "__main__":
    main()
```

---

## Task 1.6 — Design task decomposition strategies for complex workflows

**Source:** https://github.com/jacinthpaul/Claude-Certified-Architect/blob/claude/architect-exam-codebase-7ytdjz/domains/domain1_orchestration/task1_6_task_decomposition.py

### Objective
Design task decomposition strategies for complex workflows — two decomposition styles matched to two kinds of work.

### Concept
Two decomposition styles:
- PROMPT CHAINING (fixed sequential pipeline): a pre-defined sequence of focused passes. Best for PREDICTABLE multi-aspect work where the steps are known up front. Example: code review = analyze each file individually, then run ONE cross-file integration pass.
- DYNAMIC ADAPTIVE DECOMPOSITION: generate the next subtasks based on what each step discovers. Best for OPEN-ENDED investigation where you can't know the steps up front. Example: "add comprehensive tests to a legacy codebase" — map structure, find high-impact areas, build a plan that adapts as dependencies surface.
- Why split big reviews into passes? ATTENTION DILUTION. Asking the model to review 14 files at once yields uneven depth and contradictory findings (sample Q12).

### Instructions
1. Match the pattern to the work: predictable/multi-aspect -> prompt chaining (fixed pipeline); open-ended/unknown-steps -> dynamic adaptive.
2. For prompt chaining, run per-file local passes for consistent local depth plus ONE integration pass for cross-file issues.
3. For dynamic adaptive decomposition, let the plan grow as facts surface — the next step is computed from what the last one found.
4. Bigger context windows do NOT fix attention dilution — splitting passes does. Don't force a fixed pipeline onto open-ended work.

### Acceptance Criteria
- No contradictory findings across files (a pattern flagged in one file is not approved in another).
- Consistent local depth across all files reviewed — no superficial coverage.

### Full code
```python
"""
Domain 1 · Task 1.6 — Task decomposition strategies.

THE BIG IDEA
============
Two decomposition styles, matched to two kinds of work:

  PROMPT CHAINING (fixed sequential pipeline)
    A pre-defined sequence of focused passes. Best for PREDICTABLE multi-aspect work where
    the steps are known up front. Example: code review = analyze each file individually,
    then run ONE cross-file integration pass.

  DYNAMIC ADAPTIVE DECOMPOSITION
    Generate the next subtasks based on what each step discovers. Best for OPEN-ENDED
    investigation where you can't know the steps up front. Example: "add comprehensive
    tests to a legacy codebase" — map structure, find high-impact areas, build a plan that
    adapts as dependencies surface.

Why split big reviews into passes? ATTENTION DILUTION. Asking the model to review 14 files
at once yields uneven depth and contradictory findings (this is sample Q12).
"""

import sys, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[2]))
from ccarch import banner, concept, h1, h2, wrong, right, tip, note, kv, code, rule, pause, analogy, pitfall


def prompt_chaining_review(files):
    """Fixed pipeline: per-file local pass, then one integration pass."""
    steps = [f"Pass {i+1}: local analysis of {f}" for i, f in enumerate(files)]
    steps.append(f"Pass {len(files)+1}: cross-file integration analysis (all {len(files)} files)")
    return steps


def adaptive_plan(seed_discovery):
    """Dynamic: each discovery spawns the next subtask."""
    plan = ["Map repository structure"]
    if "no tests in payments/" in seed_discovery:
        plan.append("payments/ is high-impact + untested -> prioritize it")
        plan.append("Discovered payments/ imports billing/ -> add billing/ to plan")
        plan.append("Generate tests for payments/ then billing/, adapting as deps surface")
    return plan


def main():
    banner("Domain 1 · Task 1.6", "Task decomposition — chaining vs adaptive")
    concept("Domain 1: Agentic Architecture & Orchestration (27%)",
            "Task 1.6 — Design task decomposition strategies for complex workflows",
            "Fixed pipeline (known steps) vs dynamic plan (steps emerge)")

    h1("Prompt chaining — when the steps are known in advance")
    files = ["auth.py", "orders.py", "refunds.py"]
    for s in prompt_chaining_review(files):
        kv("  step", s)
    note("Predictable, multi-aspect work. Each pass gets the model's FULL attention on a "
         "small scope; the final pass catches cross-file issues.")

    pause("adaptive decomposition")
    rule()
    h1("Dynamic adaptive decomposition — when steps emerge from findings")
    for s in adaptive_plan("no tests in payments/"):
        kv("  step", s)
    note("Open-ended investigation: you literally cannot write the step list up front "
         "because each discovery changes the next move.")
    code(
        '''# CHAINING — steps fixed up front, run in order:
for step in ["review auth.py", "review orders.py", "integration pass"]:
    result = run(step)

# ADAPTIVE — the next step is computed from what the last one found:
plan = ["explore the repo"]
while plan:
    finding = run(plan.pop(0))
    plan += next_steps_from(finding)   # the plan grows as facts surface''',
        "chaining vs adaptive, in code")

    rule()
    h1("Why split big reviews into passes? Attention dilution.")
    wrong("Reviewing 14 files in ONE pass: detailed feedback for some files, superficial "
          "for others, obvious bugs missed, and CONTRADICTORY findings (flag a pattern in "
          "one file, approve identical code in another).")
    right("Per-file passes for consistent local depth + ONE integration pass for cross-file "
          "issues. (This is sample Q12.)")

    rule()
    h1("Plain-language analogy & the common confusion")
    analogy('Two ways to plan a road trip. Prompt chaining is a printed itinerary with fixed stops — great when you know the route. Dynamic decomposition is following the signs and re-routing as traffic appears — the only option when you do not yet know the road.')
    pitfall('The confusion is treating one as better than the other. They fit different jobs: known repeatable steps → fixed pipeline; unknown discovery-driven work → adaptive. Forcing a fixed pipeline onto open-ended work is the classic mistake.')

    tip("Match the pattern to the work: predictable/multi-aspect -> prompt chaining; "
        "open-ended/unknown-steps -> dynamic adaptive. Bigger context windows do NOT fix "
        "attention dilution — splitting passes does.")


if __name__ == "__main__":
    main()
```

---

## Task 1.7 — Manage session state, resumption, and forking

**Source:** https://github.com/jacinthpaul/Claude-Certified-Architect/blob/claude/architect-exam-codebase-7ytdjz/domains/domain1_orchestration/task1_7_session_state.py

### Objective
Manage session state, resumption, and forking — `--resume` vs `fork_session` vs fresh-start, driven by staleness.

### Concept
- `--resume <session-name>` continues a SPECIFIC named prior conversation — great for multi-day investigations.
- `fork_session` branches a session into independent explorations from a shared baseline — e.g., compare two testing strategies without repeating the shared analysis.
- STALE CONTEXT is dangerous. If files changed since last session, tell the resumed agent EXACTLY which files changed so it re-analyzes only those. If prior tool results are largely stale, start FRESH with a structured summary instead — more reliable than resuming a session full of outdated facts.

### Instructions
1. If prior context is valid and only a few files changed: `--resume` the session and list the changed files for targeted re-analysis.
2. If prior tool results are largely outdated: start a NEW session seeded with a structured summary of validated findings — resuming a session full of outdated facts is less reliable than a clean start.
3. If you want to compare two divergent approaches from one shared analysis: `fork_session` into parallel branches from the shared baseline.
4. If nothing material changed: `--resume` the session as-is.

### Acceptance Criteria
- The agent never reasons over a stale snapshot — either changed files are explicitly named for re-analysis, or a fresh session with a structured summary is used.

### Full code
```python
"""
Domain 1 · Task 1.7 — Session state, resumption, and forking.

THE BIG IDEA
============
  * `--resume <session-name>` continues a SPECIFIC named prior conversation — great for
    multi-day investigations.
  * `fork_session` branches a session into independent explorations from a shared baseline
    — e.g., compare two testing strategies without repeating the shared analysis.
  * STALE CONTEXT is dangerous. If files changed since last session, tell the resumed agent
    EXACTLY which files changed so it re-analyzes only those. If prior tool results are
    largely stale, start FRESH with a structured summary instead — more reliable than
    resuming a session full of outdated facts.
"""

import sys, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[2]))
from ccarch import banner, concept, h1, h2, wrong, right, tip, note, kv, code, rule, pause, analogy, pitfall


def decide(prior_context_valid: bool, files_changed, results_stale: bool, compare: bool):
    if compare:
        return ("fork_session into parallel branches",
                "Explore divergent approaches from one shared baseline.")
    if results_stale:
        return ("Start a NEW session seeded with a structured summary",
                "Resuming a session full of outdated facts is less reliable than a clean "
                "start with validated findings injected.")
    if prior_context_valid and files_changed:
        return (f"--resume the session; list changed files for targeted re-analysis: {files_changed}",
                "Prior context is mostly valid; only the changed files need re-reading.")
    return ("--resume the session as-is", "Nothing material changed.")


def main():
    banner("Domain 1 · Task 1.7", "Session state — resume, fork, or restart")
    concept("Domain 1: Agentic Architecture & Orchestration (27%)",
            "Task 1.7 — Manage session state, resumption, and forking",
            "Resume vs fork vs fresh-start (driven by staleness)")

    h1("The three commands / moves")
    code("claude --resume nightly-investigation     # continue a named session\n"
         "fork_session(baseline)                     # branch from a shared analysis\n"
         "# fresh start + injected summary           # when prior results are stale", "cli")

    pause("the decision table")
    rule()
    h1("Decision table (memorize this shape)")
    scenarios = [
        dict(desc="Prior context valid; a few files changed",
             prior_context_valid=True, files_changed=["auth.py", "orders.py"],
             results_stale=False, compare=False),
        dict(desc="Prior tool results largely outdated",
             prior_context_valid=False, files_changed=[],
             results_stale=True, compare=False),
        dict(desc="Want to compare two divergent approaches from one analysis",
             prior_context_valid=True, files_changed=[],
             results_stale=False, compare=True),
    ]
    for sc in scenarios:
        desc = sc.pop("desc")
        move, why = decide(**sc)
        h2(desc)
        right(move)
        note(f"    why: {why}")

    rule()
    h1("Why stale context is dangerous")
    wrong("Resuming a multi-day session whose tool results no longer match the code on disk. "
          "The agent reasons over phantom facts.")
    right("Either (a) resume and explicitly name the changed files for targeted re-analysis, "
          "or (b) start fresh with a structured summary of validated findings.")

    rule()
    h1("Plain-language analogy & the common confusion")
    analogy('Reopening a document you edited yesterday. If little changed, resume and note the few edited pages. If half the file is now stale, do not trust memory — start a fresh read with a clean summary of what is still true.')
    pitfall('People resume an old session and assume its facts still hold. If the files changed underneath it, the agent is reasoning over a stale snapshot. When in doubt, name what changed or start fresh with a summary.')

    tip("fork_session = same baseline, divergent branches. --resume = continue one thread. "
        "When results are stale, a fresh session + structured summary beats resuming.")


if __name__ == "__main__":
    main()
```
