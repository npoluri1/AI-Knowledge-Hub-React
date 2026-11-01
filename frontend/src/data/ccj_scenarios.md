# CCAR-F Exam Scenarios — Compiled Study Content
_Compiled from jacinthpaul/Claude-Certified-Architect (github.com/jacinthpaul/Claude-Certified-Architect) — independent community study aid, not affiliated with Anthropic._

## Scenarios Overview

# The Six Exam Scenarios — runnable end-to-end systems

Every exam question lives inside one of six production scenarios; you see 4 of the 6 on
your exam. Each folder here has **two** runnable pieces:

- a **teaching walkthrough** (the `*_*.py` file in the table below) — a scripted tour of
  the concepts; and
- a **functional app** (`app.py`) — a working mini-app you drive with real input and watch
  the real logic run (gates, hooks, schema validation, a coordinator, real Grep/Read…).

## Functional apps — see the code in action

```bash
python3 scenarios/run.py            # list the apps
python3 scenarios/run.py 1 -i       # chat with the support agent (interactive)
python3 scenarios/run.py 4 -i       # explore this repo with real Glob/Grep/Read
python3 scenarios/run.py 6 "Pd $1,200.50 to Acme Corp on 3/4/25"   # one-shot
```

| # | App | What you can actually do |
|---|---|---|
| 1 | `scenario1_customer_support/app.py` | Chat with an agent; the prerequisite gate blocks refunds until you give an email, the $500 hook escalates, case-facts persist across turns. |
| 2 | `scenario2_code_generation/app.py` | Describe a change → get a plan-vs-direct recommendation, config scope, the right mechanism, and a generated stub+test. |
| 3 | `scenario3_multi_agent_research/app.py` | Give a topic → coordinator decomposes it, runs subagents, propagates a structured error on `--fail N`, and synthesizes a cited report with coverage gaps. |
| 4 | `scenario4_developer_productivity/app.py` | A real shell: `glob`, `grep`, `read`, `trace` over any directory (defaults to this repo). |
| 5 | `scenario5_cicd/app.py` | Review real Python files → structured findings with severities; `--json` for CI mode, `--all` to include style. |
| 6 | `scenario6_structured_extraction/app.py` | Paste invoice-like text → schema-validated JSON, `null` for absent fields (never fabricated), total validation, confidence routing. |

Each `app.py` runs a scripted demo with no arguments, takes free-text as a one-shot
argument, and offers an interactive mode with `-i` (in a real terminal). They work offline
with deterministic logic — no API key required.

## Teaching walkthroughs

Each folder also keeps its original scripted tour, which ties the scenario to the domains
it tests.

| # | Scenario | Primary domains | Run |
|---|---|---|---|
| 1 | Customer Support Resolution Agent | D1 · D2 · D5 | `python3 scenarios/scenario1_customer_support/support_agent.py` |
| 2 | Code Generation with Claude Code | D3 · D5 | `python3 scenarios/scenario2_code_generation/code_generation_workflow.py` |
| 3 | Multi-Agent Research System | D1 · D2 · D5 | `python3 scenarios/scenario3_multi_agent_research/research_system.py` |
| 4 | Developer Productivity | D2 · D3 · D1 | `python3 scenarios/scenario4_developer_productivity/codebase_explorer.py` |
| 5 | Claude Code for CI/CD | D3 · D4 | `python3 scenarios/scenario5_cicd/ci_review_pipeline.py` |
| 6 | Structured Data Extraction | D4 · D5 | `python3 scenarios/scenario6_structured_extraction/extraction_pipeline.py` |

```bash
python3 run_all.py scenarios     # run all six, non-stop
```

## What each one demonstrates

- **Scenario 1** — a real agent loop with a **prerequisite gate** (no refund before
  identity), an **interception hook** ($500 cap → escalation), **structured tool errors**,
  a persistent **case-facts** block, and a **structured handoff** to a human. Shows three
  cases: happy path, gate-blocks-early-refund, and over-limit → escalation.
- **Scenario 2** — the team-enablement judgment calls: what's shared vs personal, the
  "new teammate doesn't get conventions" diagnostic, path rules, and plan-vs-direct.
- **Scenario 3** — a coordinator + subagents that reproduces the **narrow-decomposition
  failure** (and its fix), **parallel spawning**, **structured error propagation** on a
  timeout, **coverage annotations**, and **provenance** preservation.
- **Scenario 4** — *actually* explores a tiny sample repo it creates: Glob (names) vs Grep
  (contents), then **incremental** Grep→Read following imports, plus delegation + scratchpad.
- **Scenario 5** — non-interactive `-p`, structured JSON findings, **false-positive
  control**, **independent** review instance, and **multi-pass** review of a large PR.
- **Scenario 6** — tool-use **schema**, **nullable** fields, **validation + retry** (and
  recognizing a futile retry), self-correcting totals, **batch vs sync** routing, and
  **confidence routing** to human review.

## Scenario Launcher — scenarios/run.py
**Source:** https://github.com/jacinthpaul/Claude-Certified-Architect/tree/claude/architect-exam-codebase-7ytdjz/scenarios/run.py
### run.py
```python
#!/usr/bin/env python3
"""
scenarios/run.py — launcher for the six functional scenario apps.

  python3 scenarios/run.py                 # list the scenarios
  python3 scenarios/run.py 1               # run scenario 1's app (scripted demo)
  python3 scenarios/run.py 1 -i            # run it interactively
  python3 scenarios/run.py 6 "Pd $20 to Acme on 3/4/25"   # pass args through

Each scenario's working app lives at scenarios/scenarioN_*/app.py. The original teaching
walkthroughs (the *_*.py files) are still there and unchanged.
"""
import sys, glob, os, runpy, pathlib

ROOT = pathlib.Path(__file__).resolve().parent
APPS = {}
for d in sorted(glob.glob(str(ROOT / "scenario*"))):
    name = os.path.basename(d)
    n = name[len("scenario")]
    app = os.path.join(d, "app.py")
    if os.path.isfile(app):
        APPS[n] = (name, app)

TITLES = {
    "1": "Customer Support Resolution Agent — chat with a gated, hook-guarded agent",
    "2": "Code Generation — plan-vs-direct + config-scope advisor",
    "3": "Multi-Agent Research — decompose a topic, synthesize a cited report",
    "4": "Developer Productivity — real Glob/Grep/Read codebase explorer",
    "5": "Claude Code for CI/CD — static reviewer with structured JSON findings",
    "6": "Structured Data Extraction — parse documents into validated JSON",
}


def usage():
    print("Functional scenario apps:\n")
    for n in sorted(APPS):
        print(f"  {n}  {TITLES.get(n, APPS[n][0])}")
    print("\nUsage: python3 scenarios/run.py <1-6> [-i] [args...]")
    print("Example: python3 scenarios/run.py 1 -i")


def main():
    args = sys.argv[1:]
    if not args or args[0] in ("-h", "--help", "list"):
        usage(); return
    n = args[0]
    if n not in APPS:
        print(f"unknown scenario {n!r}\n"); usage(); sys.exit(1)
    _, app = APPS[n]
    sys.argv = [app] + args[1:]
    runpy.run_path(app, run_name="__main__")


if __name__ == "__main__":
    main()
```
## Scenario 1 — Customer Support
**Source:** https://github.com/jacinthpaul/Claude-Certified-Architect/tree/claude/architect-exam-codebase-7ytdjz/scenarios/scenario1_customer_support
### app.py
```python
"""
SCENARIO 1 app — Customer Support Resolution Agent (FUNCTIONAL)
==============================================================
A working agent you can actually talk to. It parses a free-text customer message, then runs
a real loop over four tools with a PREREQUISITE GATE (no refund before identity is
verified), an INTERCEPTION HOOK ($500 cap → escalation), STRUCTURED errors, a persistent
CASE-FACTS block, and rule-based escalation — Domains 1, 2, 5 in action.

Run:
  python3 scenarios/scenario1_customer_support/app.py            # scripted demo (3 messages)
  python3 scenarios/scenario1_customer_support/app.py -i         # chat with the agent
  python3 scenarios/scenario1_customer_support/app.py "I'm dana@example.com, refund order 88231"

Try (interactive): give an email + order, ask for a refund; or ask for a refund first
(blocked); or ask to cancel order 90011 ($620) (escalates).
"""
import sys, re, json, pathlib

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[2]))
from ccarch import banner, h1, h2, kv, note, rule, wrong, right, tip

REFUND_LIMIT = 500.0
CUSTOMERS = {"dana@example.com": {"id": "CUST-9", "name": "Dana Lee"},
             "sam@example.com": {"id": "CUST-4", "name": "Sam Ortiz"}}
ORDERS = {"88231": {"customer": "CUST-9", "status": "delivered_damaged", "total": 84.75},
          "90011": {"customer": "CUST-9", "status": "shipped", "total": 620.00},
          "55012": {"customer": "CUST-4", "status": "shipped", "total": 45.00}}


def err(cat, retryable, msg):
    return {"error": True, "errorCategory": cat, "isRetryable": retryable, "message": msg}


class Agent:
    def __init__(self):
        self.verified = None          # the gate's state
        self.facts = {}               # persistent case-facts block

    # --- tools (real logic) ---
    def get_customer(self, email):
        c = CUSTOMERS.get(email)
        if not c:
            return err("validation", False, f"no customer for {email}")
        self.verified = c["id"]
        self.facts.update(customer_id=c["id"], name=c["name"])
        return {"verified_customer_id": c["id"], "name": c["name"]}

    def lookup_order(self, oid):
        if not self.verified:
            return err("permission", False, "verify identity first (prerequisite gate)")
        o = ORDERS.get(oid)
        if not o:
            return err("validation", False, f"order {oid} not found")
        if o["customer"] != self.verified:
            return err("permission", False, "order belongs to a different customer")
        self.facts.update(order=oid, order_total=o["total"], order_status=o["status"])
        return o

    def process_refund(self, oid, amount):
        if not self.verified:                                   # gate
            return err("permission", False, "verify identity before any refund")
        if amount > REFUND_LIMIT:                               # interception hook
            return err("business_rule", False,
                       f"refund ${amount:.2f} exceeds ${REFUND_LIMIT:.0f} limit; escalate")
        return {"refunded": amount, "order": oid, "to": self.verified}

    def escalate(self, reason):
        return {"escalated": True, "handoff": {**self.facts, "reason": reason}}


def parse(msg):
    return {
        "email": (re.search(r"[\w.+-]+@[\w-]+\.[\w.-]+", msg) or [None])[0]
                 if re.search(r"[\w.+-]+@[\w-]+\.[\w.-]+", msg) else None,
        "order": (re.search(r"\b(\d{5})\b", msg).group(1) if re.search(r"\b(\d{5})\b", msg) else None),
        "amount": (float(re.search(r"\$\s?([\d,]+(?:\.\d+)?)", msg).group(1).replace(",", ""))
                   if re.search(r"\$\s?([\d,]+(?:\.\d+)?)", msg) else None),
        "wants_refund": bool(re.search(r"refund|return|money back|damaged|cancel", msg, re.I)),
        "wants_human": bool(re.search(r"\b(human|person|agent|supervisor|manager)\b", msg, re.I)),
    }


def handle(agent, msg, trace):
    """One real agent turn: plan tool calls from the message + current state."""
    p = parse(msg)
    log = trace.append

    if p["wants_human"]:
        r = agent.escalate("customer explicitly requested a human")
        log(("escalate_to_human", {}, r))
        return "I'm connecting you with a human now — I've passed along your details."

    if p["email"] and not agent.verified:
        r = agent.get_customer(p["email"])
        log(("get_customer", {"email": p["email"]}, r))

    if p["order"]:
        r = agent.lookup_order(p["order"])
        log(("lookup_order", {"order_id": p["order"]}, r))
        if isinstance(r, dict) and r.get("error") and r["errorCategory"] == "permission":
            return "Before I can look up that order, I need to verify your identity — what's the email on the account?"

    if p["wants_refund"]:
        if not agent.verified:
            return "Happy to help with a refund — first, what's the email on your account so I can verify you?"
        oid = p["order"] or agent.facts.get("order")
        if not oid:
            return "Which order number should I refund?"
        amount = p["amount"] or agent.facts.get("order_total")
        r = agent.process_refund(oid, amount)
        log(("process_refund", {"order_id": oid, "amount": amount}, r))
        if isinstance(r, dict) and r.get("error"):
            esc = agent.escalate(r["message"])
            log(("escalate_to_human", {}, esc))
            return (f"That refund (${amount:.2f}) is above what I can approve, so I've "
                    f"escalated to a supervisor with all your details.")
        return f"Done — I've refunded ${amount:.2f} for order #{oid}. Anything else?"

    if agent.verified:
        return f"Thanks, {agent.facts.get('name','')} — you're verified. How can I help?"
    return "Hi! Tell me your order number and the email on your account and I'll help."


def run_turn(agent, msg, show=True):
    trace = []
    reply = handle(agent, msg, trace)
    if show:
        kv("customer", msg)
        for name, args, result in trace:
            mark = "ERR" if isinstance(result, dict) and result.get("error") else "ok"
            note(f"    → {name}({args}) [{mark}] {result}")
        right(f"agent: {reply}")
        if agent.facts:
            kv("    case-facts", json.dumps(agent.facts))
    return reply


def interactive():
    banner("Scenario 1 — Support Agent", "chat with the agent; 'quit' to exit, 'reset' for a new case")
    agent = Agent()
    while True:
        try:
            msg = input("\nyou> ").strip()
        except (EOFError, KeyboardInterrupt):
            print(); break
        if msg.lower() in ("quit", "exit", "q"):
            break
        if msg.lower() == "reset":
            agent = Agent(); note("  (new case)"); continue
        if msg:
            run_turn(agent, msg)


def demo():
    banner("Scenario 1 — Support Agent (demo)", "three real messages through the live logic")
    h1("Case A — verify + small refund (resolved)")
    a = Agent()
    run_turn(a, "Hi, I'm dana@example.com and order 88231 arrived damaged — I'd like a refund.")

    h1("Case B — refund requested before identity is known (gate asks to verify)")
    b = Agent()
    run_turn(b, "Just refund order 88231 to me please.")
    run_turn(b, "sure, it's dana@example.com")

    h1("Case C — over-limit refund (interception hook → escalation)")
    c = Agent()
    run_turn(c, "I'm dana@example.com, please cancel order 90011 and refund the $620.")
    rule()
    tip("The gate makes 'verify before refund' deterministic; the hook stops >$500 refunds; "
        "case-facts persist across turns. Run with -i to talk to it yourself.")


def main():
    args = sys.argv[1:]
    if any(a in ("-i", "--interactive") for a in args) and sys.stdin.isatty():
        interactive(); return
    free = [a for a in args if not a.startswith("-")]
    if free:
        run_turn(Agent(), " ".join(free)); return
    demo()


if __name__ == "__main__":
    main()
```
### support_agent.py
```python
"""
SCENARIO 1 — Customer Support Resolution Agent  (Agent SDK)
===========================================================
A runnable, end-to-end support agent that ties together the concepts the exam attaches to
this scenario: D1 Orchestration, D2 Tools/MCP, D5 Context & Reliability.

It exposes four MCP-style tools — get_customer, lookup_order, process_refund,
escalate_to_human — and demonstrates, in ONE program:

  * the agentic loop driven by stop_reason                 (D1 T1.1)
  * a PREREQUISITE GATE: process_refund is impossible until get_customer verifies identity
    (D1 T1.4 / sample Q1)
  * an INTERCEPTION HOOK: refunds over $500 are blocked and redirected to escalation
    (D1 T1.5)
  * STRUCTURED tool errors with errorCategory + isRetryable (D2 T2.2)
  * a persistent CASE-FACTS block that survives summarization (D5 T5.1)
  * rule-based ESCALATION (explicit request / policy gap / no progress) (D5 T5.2)
  * a STRUCTURED HANDOFF packet for the human (D1 T1.4)

Target (per the scenario): 80%+ first-contact resolution while knowing when to escalate.

Run it offline (deterministic simulator) or live (ANTHROPIC_API_KEY). Use --demo to run a
scripted walkthrough, or run with no args for the same.
"""

import sys, pathlib, json
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[2]))
from ccarch import ClaudeClient, LLMResponse, ToolCall
from ccarch import banner, concept, h1, h2, wrong, right, tip, note, kv, code, rule, pause, analogy, pitfall

REFUND_LIMIT = 500.0

# ---------------------------------------------------------------- backend data
CUSTOMERS = {
    "dana@example.com": {"customer_id": "CUST-9", "name": "Dana Lee", "tier": "gold"},
}
ORDERS = {
    "88231": {"customer_id": "CUST-9", "status": "delivered_damaged", "total": 84.75},
    "90011": {"customer_id": "CUST-9", "status": "shipped", "total": 620.00},
}


# ------------------------------------------------------- structured error helper
def tool_error(category, retryable, message):
    return {"isError": True, "errorCategory": category, "isRetryable": retryable,
            "message": message}


# ------------------------------------------------------------------- the agent
class SupportAgent:
    def __init__(self, client: ClaudeClient):
        self.client = client
        self.verified_customer_id = None          # the gate's state (D1 T1.4)
        self.case_facts = {}                      # persistent facts block (D5 T5.1)
        self.transcript = []

    # ---- tools (your code owns these; Claude only REQUESTS them) ----
    def get_customer(self, email=None):
        cust = CUSTOMERS.get(email)
        if not cust:
            return tool_error("validation", False, f"No customer for {email!r}; ask for a "
                              "valid email or customer ID.")
        self.verified_customer_id = cust["customer_id"]      # <-- unlocks the gate
        self.case_facts["customer_id"] = cust["customer_id"]
        self.case_facts["name"] = cust["name"]
        return {"verified_customer_id": cust["customer_id"], "name": cust["name"],
                "tier": cust["tier"]}

    def lookup_order(self, order_id=None):
        # PREREQUISITE GATE: cannot look up an order until identity is verified
        if not self.verified_customer_id:
            return tool_error("permission", False,
                              "BLOCKED: verify identity with get_customer first.")
        order = ORDERS.get(order_id)
        if not order:
            return tool_error("validation", False, f"order_id {order_id!r} not found.")
        if order["customer_id"] != self.verified_customer_id:
            return tool_error("permission", False,
                              "Order does not belong to the verified customer.")
        self.case_facts["order"] = order_id
        self.case_facts["order_total"] = order["total"]
        self.case_facts["order_status"] = order["status"]
        return order

    def process_refund(self, order_id=None, amount=0.0):
        # GATE again: no refund without verified identity (sample Q1)
        if not self.verified_customer_id:
            return tool_error("permission", False,
                              "BLOCKED: verify identity before any refund.")
        # INTERCEPTION HOOK: over-limit refunds are blocked and redirected (D1 T1.5)
        if amount > REFUND_LIMIT:
            return tool_error("business_rule", False,
                              f"Refund ${amount:.2f} exceeds ${REFUND_LIMIT:.0f} limit. "
                              "Escalate to a supervisor.")
        return {"refunded": amount, "order_id": order_id,
                "to": self.verified_customer_id}

    def escalate_to_human(self, root_cause="", recommended_action=""):
        # STRUCTURED HANDOFF packet (D1 T1.4): the human can't see the chat
        packet = {
            "customer_id": self.case_facts.get("customer_id"),
            "name": self.case_facts.get("name"),
            "order": self.case_facts.get("order"),
            "root_cause": root_cause,
            "refund_amount": self.case_facts.get("order_total"),
            "recommended_action": recommended_action,
        }
        return {"escalated": True, "handoff_packet": packet}

    def dispatch(self, name, args):
        return getattr(self, name)(**args)


# ------------------------------------------------- a scripted offline simulator
def make_simulator(script):
    """script: list of LLMResponse to emit in order (offline mode)."""
    state = {"i": 0}

    def sim(system, messages, tools):
        i = state["i"]
        state["i"] += 1
        return script[min(i, len(script) - 1)]
    return sim


def _tool_turn(name, args):
    return LLMResponse(text=f"(requesting {name})", stop_reason="tool_use",
                       tool_calls=[ToolCall(name=name, input=args)])


def _final(text):
    return LLMResponse(text=text, stop_reason="end_turn")


def run_case(title, agent: SupportAgent, user_msg, script):
    h1(title)
    kv("customer says", user_msg)
    sim = make_simulator(script)
    messages = [{"role": "user", "content": user_msg}]
    for _ in range(8):
        resp = agent.client.complete("You are Acme support. Verify identity before order "
                                     "operations. Escalate per policy.", messages,
                                     simulator=sim)
        if resp.stop_reason == "end_turn":
            note(f"agent → {resp.text}")
            break
        for tc in resp.tool_calls:
            result = agent.dispatch(tc.name, tc.input)
            mark = "ERROR" if isinstance(result, dict) and result.get("isError") else "ok"
            kv(f"  tool {tc.name}{tc.input}", f"[{mark}] {result}")
            messages.append({"role": "assistant", "content": [
                {"type": "tool_use", "id": tc.id, "name": tc.name, "input": tc.input}]})
            messages.append({"role": "user", "content": [
                {"type": "tool_result", "tool_use_id": tc.id, "content": json.dumps(result)}]})
    kv("  case facts (persistent)", json.dumps(agent.case_facts))


def main():
    banner("Scenario 1", "Customer Support Resolution Agent — D1 · D2 · D5")
    concept("Scenario 1: Customer Support Resolution Agent",
            "Tools: get_customer · lookup_order · process_refund · escalate_to_human",
            "Gates + hooks + structured errors + case facts + escalation")
    client = ClaudeClient()
    kv("client mode", client.mode)

    # CASE A: the happy path — verify, look up, small refund
    pause("Case A: verify → lookup → small refund (resolved)")
    agent = SupportAgent(client)
    run_case("Case A — small refund, identity verified first", agent,
             "I'm dana@example.com, order 88231 arrived damaged, I want a refund.",
             [
                 _tool_turn("get_customer", {"email": "dana@example.com"}),
                 _tool_turn("lookup_order", {"order_id": "88231"}),
                 _tool_turn("process_refund", {"order_id": "88231", "amount": 84.75}),
                 _final("Verified your account and refunded $84.75 for the damaged order "
                        "#88231. Anything else?"),
             ])
    right("Identity verified BEFORE any order op (the gate). Small refund within policy → "
          "resolved on first contact. ✓ counts toward the 80% target.")

    # CASE B: the gate blocks a refund attempted before verification
    pause("Case B: agent tries to refund WITHOUT verifying (gate blocks it)")
    agent = SupportAgent(client)
    run_case("Case B — refund attempted before identity check", agent,
             "Just refund order 88231 to me, my name is Dana.",
             [
                 _tool_turn("process_refund", {"order_id": "88231", "amount": 84.75}),
                 _tool_turn("get_customer", {"email": "dana@example.com"}),
                 _tool_turn("process_refund", {"order_id": "88231", "amount": 84.75}),
                 _final("I needed to verify your identity first — now done. Refunded $84.75."),
             ])
    wrong("The first process_refund was BLOCKED by the prerequisite gate (permission error). "
          "This is the deterministic fix for sample Q1 — prompt wording alone fails ~12%.")

    # CASE C: over-limit refund → interception hook → escalation with handoff packet
    pause("Case C: over-limit refund → blocked → escalation with handoff")
    agent = SupportAgent(client)
    run_case("Case C — $620 refund exceeds the $500 limit", agent,
             "I'm dana@example.com, cancel order 90011 ($620) and refund me.",
             [
                 _tool_turn("get_customer", {"email": "dana@example.com"}),
                 _tool_turn("lookup_order", {"order_id": "90011"}),
                 _tool_turn("process_refund", {"order_id": "90011", "amount": 620.00}),
                 _tool_turn("escalate_to_human",
                            {"root_cause": "Refund $620 over $500 auto-limit",
                             "recommended_action": "Supervisor approve full refund"}),
                 _final("That refund is above my limit, so I've escalated to a supervisor "
                        "with all your details — they'll follow up shortly."),
             ])
    right("Interception hook blocked the $620 refund (business_rule error), and the agent "
          "escalated with a STRUCTURED HANDOFF packet so the human starts warm, not cold.")

    rule()
    h1("Plain-language analogy & the common confusion")
    analogy('This agent is a brand-new support rep with a great manual but no supervisor — so you bolt on guardrails: an ID check it cannot skip (gate), a spending limit it cannot exceed (hook), and a clean handoff sheet when it escalates.')
    pitfall("The instinct is to write 'always verify identity' in the prompt and trust it. Under load it slips ~12% of the time. The gate makes the rule impossible to skip — that is the line between a guideline and a guarantee.")

    tip("This one app demonstrates: the agentic loop (stop_reason), a prerequisite gate, an "
        "interception hook, structured tool errors, a persistent case-facts block, and "
        "structured escalation. That's D1 + D2 + D5 in a single scenario.")


if __name__ == "__main__":
    main()
```

## Scenario 2 — Code Generation
**Source:** https://github.com/jacinthpaul/Claude-Certified-Architect/tree/claude/architect-exam-codebase-7ytdjz/scenarios/scenario2_code_generation
### app.py
```python
"""
SCENARIO 2 app — Code Generation with Claude Code: workflow advisor (FUNCTIONAL)
===============================================================================
A working advisor: describe a change and it decides plan mode vs direct execution, where
the relevant config should live (shared vs personal), which Claude Code mechanism applies
(command / rule / skill), and — for "add a function" requests — generates a stub plus a
matching test per the project conventions. Domain 3 in action.

Run:
  python3 scenarios/scenario2_code_generation/app.py                         # scripted demo
  python3 scenarios/scenario2_code_generation/app.py -i                      # your own tasks
  python3 scenarios/scenario2_code_generation/app.py "migrate the API across 40 files"
"""
import sys, re, pathlib

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[2]))
from ccarch import banner, h1, h2, kv, note, rule, right, tip, code

PLAN_SIGNALS = ["refactor", "migrat", "architect", "restructure", "microservice", "redesign",
                "multiple files", "across", "dozens", "boundaries", "rename", "many files"]
DIRECT_SIGNALS = ["typo", "one line", "single file", "small", "rename a variable",
                  "add a check", "fix the", "bug", "one function"]


def advise(task):
    t = task.lower()
    nfiles = max([int(n) for n in re.findall(r"\b(\d+)\s*files?\b", t)] or [0])
    plan = nfiles >= 5 or any(s in t for s in PLAN_SIGNALS)
    direct = (not plan) and (nfiles == 1 or any(s in t for s in DIRECT_SIGNALS))
    mode = "PLAN MODE" if plan else ("DIRECT EXECUTION" if direct else "PLAN MODE (when unsure)")
    reasons = []
    if nfiles:
        reasons.append(f"{nfiles} file(s) mentioned")
    reasons += [f"signal: '{s}'" for s in PLAN_SIGNALS + DIRECT_SIGNALS if s in t][:3]

    mechanism = None
    if re.search(r"\b(review|lint|checklist|standard)\b", t):
        mechanism = (".claude/commands/<name>.md", "a reusable team slash command (version-controlled)")
    elif re.search(r"\btest|convention|style\b", t):
        mechanism = (".claude/rules/<topic>.md (paths: glob)", "path-scoped conventions that load by file type")
    elif re.search(r"\banaly|explore|generate boilerplate\b", t):
        mechanism = (".claude/skills/<name>/SKILL.md (context: fork)", "an on-demand skill in isolated context")

    scope = ("project (.claude/, shared via version control)"
             if re.search(r"\bteam|everyone|shared|repo\b", t)
             else "personal (~/.claude/) unless the whole team needs it")
    return {"mode": mode, "reasons": reasons or ["no strong signal — default to planning"],
            "mechanism": mechanism, "scope": scope}


def gen_stub(name):
    """Generate a stub + matching test per the repo CLAUDE.md conventions (cents; test required)."""
    fn = re.sub(r"[^a-z0-9]+", "_", name.lower()).strip("_") or "do_thing"
    stub = (f"def {fn}(amount_cents: int) -> int:\n"
            f'    """TODO: implement {name}. Currency is integer cents, never dollars."""\n'
            f"    raise NotImplementedError\n")
    test = (f"def test_{fn}_handles_zero():\n"
            f"    # every new function needs a matching test (project convention)\n"
            f"    assert {fn}(0) == 0\n")
    return stub, test


def show(task):
    kv("task", task)
    a = advise(task)
    right(f"recommend: {a['mode']}")
    note("    reasons: " + "; ".join(a["reasons"]))
    kv("    config scope", a["scope"])
    if a["mechanism"]:
        kv("    mechanism", f"{a['mechanism'][0]}  ({a['mechanism'][1]})")
    m = re.search(r"add (?:a )?(?:function|helper|util(?:ity)?)\s+(?:called\s+|named\s+|to\s+)?([\w ]+)", task, re.I)
    if m:
        stub, test = gen_stub(m.group(1).strip())
        code(stub + "\n" + test, "generated stub + test")


SAMPLES = [
    "Restructure the monolith into microservices across dozens of files",
    "Fix the off-by-one bug in pager.py (single file, clear stack trace)",
    "Add a team /review command that runs our code-review checklist",
    "Add a function calculate_discount for the cart",
]


def interactive():
    banner("Scenario 2 — Workflow Advisor", "describe a change; 'quit' to exit")
    while True:
        try:
            task = input("\ntask> ").strip()
        except (EOFError, KeyboardInterrupt):
            print(); break
        if task.lower() in ("quit", "exit", "q"):
            break
        if task:
            show(task)


def main():
    args = sys.argv[1:]
    if any(a in ("-i", "--interactive") for a in args) and sys.stdin.isatty():
        interactive(); return
    free = [a for a in args if not a.startswith("-")]
    if free:
        banner("Scenario 2 — Workflow Advisor", "")
        show(" ".join(free)); return
    banner("Scenario 2 — Workflow Advisor (demo)", "plan-vs-direct + config scope, on real tasks")
    for s in SAMPLES:
        h2(s[:60])
        show(s)
    rule()
    tip("Stated complexity (many files / architectural) → plan mode now; small known fix → "
        "direct. Team-wide things live in .claude/ (shared); personal in ~/.claude/. Run -i.")


if __name__ == "__main__":
    main()
```
### code_generation_workflow.py
```python
"""
SCENARIO 2 — Code Generation with Claude Code
=============================================
A team adopting Claude Code for everyday work (generate, refactor, debug, document). This
scenario is about TEAM CONFIGURATION and judgment, not a live agent loop, so the demo walks
through the decisions the exam tests: D3 Claude Code Config, D5 Context & Reliability.

In ONE program:
  * shared vs personal config: what travels via version control (D3 T3.1, T3.2)
  * the "new teammate doesn't get conventions" diagnostic (D3 T3.1)
  * team /review command placement (D3 T3.2 / sample Q4)
  * path-scoped rules for scattered conventions (D3 T3.3 / sample Q6)
  * plan mode vs direct execution (D3 T3.4 / sample Q5)
  * iterative refinement: show-don't-describe, tests-as-feedback (D3 T3.5)

See real example artifacts under domains/domain3_claude_code/examples/.
"""

import sys, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[2]))
from ccarch import banner, concept, h1, h2, wrong, right, tip, note, kv, code, rule, pause, analogy, pitfall


def shared_with_team(path: str) -> bool:
    return not path.strip().startswith("~/")


def plan_or_direct(task: str, files: int, architectural: bool):
    if architectural or files >= 5:
        return "PLAN MODE"
    return "DIRECT EXECUTION"


def main():
    banner("Scenario 2", "Code Generation with Claude Code — D3 · D5")
    concept("Scenario 2: Code Generation with Claude Code",
            "Slash commands · CLAUDE.md · plan mode vs direct execution",
            "Team enablement: what's shared vs personal, and when to plan")

    h1("What travels to teammates (version control) vs stays local")
    for path in [".claude/CLAUDE.md", ".claude/commands/review.md", ".claude/rules/testing.md",
                 "~/.claude/CLAUDE.md", "~/.claude/commands/scratch.md"]:
        kv(f"  {path}", "SHARED via VCS ✓" if shared_with_team(path) else "personal (local) ✗")

    pause("the diagnostic")
    rule()
    h1("Diagnostic: a new teammate clones the repo, Claude ignores team conventions")
    wrong("The conventions were written in ~/.claude/CLAUDE.md (user level) — that never "
          "travels through version control.")
    right("Move them to .claude/CLAUDE.md (project level) so every clone gets them.")

    rule()
    h1("Team /review command (sample Q4)")
    kv("  .claude/commands/review.md", "correct — version-controlled, everyone gets it")
    wrong("~/.claude/commands/ (personal), CLAUDE.md (not for commands), or a "
          "'.claude/config.json commands array' (doesn't exist).")

    pause("path rules")
    rule()
    h1("Scattered conventions → path-scoped rules (sample Q6)")
    note("React components, API handlers, DB models, and test files (next to their code, "
         "everywhere) each need different conventions.")
    right("Use .claude/rules/ with YAML `paths` globs (e.g., paths: ['**/*.test.tsx']). "
          "Applies automatically by file path, regardless of directory.")
    wrong("One monolithic CLAUDE.md (relies on inference) or per-directory CLAUDE.md "
          "(can't follow scattered test files).")

    pause("plan vs direct")
    rule()
    h1("Plan mode vs direct execution (sample Q5)")
    tasks = [
        ("Restructure monolith → microservices", 40, True),
        ("Migrate a library across 45+ files", 45, False),
        ("Fix a single-file bug with a clear stack trace", 1, False),
    ]
    for name, files, arch in tasks:
        kv(f"  {name}", plan_or_direct(name, files, arch))
    wrong("'Start direct, switch to plan if it gets hard' — the complexity is already "
          "STATED; that's a trap.")

    rule()
    h1("Iterative refinement habits (D3 T3.5)")
    note("- Show 2-3 input→output examples instead of prose when results are inconsistent.")
    note("- Write tests first; iterate by pasting the FAILURES as precise feedback.")
    note("- Let Claude interview YOU before building in an unfamiliar area.")
    note("- Batch INTERACTING fixes in one message; sequence INDEPENDENT ones.")

    rule()
    h1("Plain-language analogy & the common confusion")
    analogy('Rolling Claude Code out to a team is like writing the shop playbook: shared rules go on the wall (repo .claude/), personal preferences stay in your own locker (~/.claude/), and you measure before big rebuilds (plan mode).')
    pitfall("The recurring confusion is WHERE config lives and WHO it reaches. Anything in the repo travels to every teammate via git; anything under ~/ stays on your machine. 'Teammate did not get it' almost always means it was personal-scoped.")

    tip("This scenario is judgment about CONFIGURATION SCOPE and WORKFLOW MODE. Shared work "
        "→ repo (.claude/...); personal → ~/.claude/...; complexity stated → plan mode now.")
    note("\nExplore the real files: domains/domain3_claude_code/examples/")


if __name__ == "__main__":
    main()
```

## Scenario 3 — Multi-Agent Research
**Source:** https://github.com/jacinthpaul/Claude-Certified-Architect/tree/claude/architect-exam-codebase-7ytdjz/scenarios/scenario3_multi_agent_research
### app.py
```python
"""
SCENARIO 3 app — Multi-Agent Research System (FUNCTIONAL)
========================================================
A working coordinator: give it a topic and it decomposes into subtopics, runs (simulated)
web-search subagents in parallel, propagates a structured error if one "times out", and
synthesizes a cited report with coverage gaps — Domains 1, 2, 5 in action.

Run:
  python3 scenarios/scenario3_multi_agent_research/app.py                 # scripted demo
  python3 scenarios/scenario3_multi_agent_research/app.py -i              # your own topic
  python3 scenarios/scenario3_multi_agent_research/app.py "impact of AI on healthcare"
  python3 scenarios/scenario3_multi_agent_research/app.py "..." --fail 2  # time out subagent 2
"""
import sys, re, pathlib

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[2]))
from ccarch import banner, h1, h2, kv, note, rule, wrong, right, tip, code

# A tiny "domain knowledge" table the coordinator uses to broaden known topics so the
# decomposition isn't too narrow (the classic failure mode).
SECTORS = {
    "creative": ["digital art", "graphic design", "photography", "music", "writing", "film"],
    "healthcare": ["diagnostics", "drug discovery", "clinical workflow", "patient triage", "medical imaging"],
    "education": ["tutoring", "grading", "curriculum design", "accessibility"],
    "finance": ["fraud detection", "risk modeling", "trading", "customer service"],
}


def decompose(topic):
    t = topic.lower()
    for key, sectors in SECTORS.items():
        if key in t or (key == "creative" and "creative" in t):
            return [f"{topic.split(' on ')[-1] if ' on ' in topic else topic}: {s}" for s in sectors]
    # generic broad facets when the topic isn't in the table
    return [f"{topic}: {facet}" for facet in
            ["overview & definitions", "key players & tools", "recent developments",
             "challenges & risks", "outlook"]]


def web_search_subagent(subtopic, fail=False):
    if fail:
        return {"status": "timeout", "subtopic": subtopic,
                "attempted_query": subtopic, "partial": [],
                "alternatives": ["retry with a narrower query", "try an alternative source"]}
    slug = re.sub(r"[^a-z0-9]+", "-", subtopic.lower()).strip("-")
    return {"status": "ok", "subtopic": subtopic, "claims": [{
        "claim": f"Notable trend in {subtopic}",
        "source_url": f"https://example.org/{slug}",
        "source_name": f"{subtopic.title()} — survey",
        "year": 2024}]}


def synthesize(findings):
    report = {"sections": [], "citations": [], "coverage_gaps": []}
    for f in findings:
        if f["status"] == "ok":
            c = f["claims"][0]
            report["sections"].append({"subtopic": f["subtopic"], "finding": c["claim"]})
            report["citations"].append(f"{c['source_name']} ({c['year']}) — {c['source_url']}")
        else:
            report["coverage_gaps"].append(f"{f['subtopic']} (source {f['status']})")
    return report


def run(topic, fail_idx=None, show=True):
    subtopics = decompose(topic)
    if show:
        h2("coordinator decomposed the topic")
        for s in subtopics:
            kv("  subtask", s)
        h2(f"spawning {len(subtopics)} web-search subagents (parallel)")
    findings = []
    for i, st in enumerate(subtopics, 1):
        f = web_search_subagent(st, fail=(fail_idx == i))
        findings.append(f)
        if show:
            note(f"    subagent {i}: {st} → {f['status']}")
    report = synthesize(findings)
    if show:
        h2("synthesized report")
        for sec in report["sections"]:
            right(f"{sec['subtopic']}: {sec['finding']}")
        if report["coverage_gaps"]:
            wrong("coverage gaps (subagent failures, honestly annotated): " +
                  "; ".join(report["coverage_gaps"]))
        h2("citations")
        for c in report["citations"]:
            note("  - " + c)
    return report


def interactive():
    banner("Scenario 3 — Research System", "type a topic; 'quit' to exit")
    while True:
        try:
            topic = input("\ntopic> ").strip()
        except (EOFError, KeyboardInterrupt):
            print(); break
        if topic.lower() in ("quit", "exit", "q"):
            break
        if topic:
            run(topic)


def main():
    args = sys.argv[1:]
    fail_idx = None
    if "--fail" in args:
        i = args.index("--fail")
        try:
            fail_idx = int(args[i + 1]); del args[i:i + 2]
        except (IndexError, ValueError):
            del args[i:i + 1]
    if any(a in ("-i", "--interactive") for a in args) and sys.stdin.isatty():
        interactive(); return
    free = [a for a in args if not a.startswith("-")]
    if free:
        banner("Scenario 3 — Research System", " ".join(free))
        run(" ".join(free), fail_idx=fail_idx); return
    banner("Scenario 3 — Research System (demo)", "topic: impact of AI on creative industries")
    h1("Broad decomposition, with subagent 6 timing out to show error propagation")
    run("impact of AI on creative industries", fail_idx=6)
    rule()
    tip("The coordinator broadens a known topic so decomposition isn't too narrow; a failed "
        "subagent returns STRUCTURED error context and the report ANNOTATES the gap instead "
        "of hiding it. Run -i for your own topic.")


if __name__ == "__main__":
    main()
```
### research_system.py
```python
"""
SCENARIO 3 — Multi-Agent Research System  (Agent SDK)
=====================================================
A runnable coordinator + specialist subagents (web search, document analysis, synthesis,
report). Demonstrates the concepts the exam attaches to this scenario: D1 Orchestration,
D2 Tools/MCP, D5 Context & Reliability.

In ONE program:
  * HUB-AND-SPOKE: all communication flows through the coordinator (D1 T1.2)
  * the NARROW-DECOMPOSITION failure and its fix (D1 T1.2 / sample Q7)
  * PARALLEL spawning of subagents (D1 T1.3)
  * STRUCTURED handoffs that preserve claim→source attribution (D1 T1.3 / D5 T5.6)
  * STRUCTURED error propagation on a subagent timeout (D5 T5.3 / sample Q8)
  * COVERAGE annotations + conflict/temporal handling in the report (D5 T5.3, T5.6)
"""

import sys, pathlib, json
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[2]))
from ccarch import banner, concept, h1, h2, wrong, right, tip, note, kv, code, rule, pause, analogy, pitfall

ALL_SECTORS = ["digital art", "graphic design", "photography", "music", "writing", "film"]


# ----------------------------------------------------------------- subagents
def web_search_subagent(subtopic, fail=False):
    """Returns structured findings, or a STRUCTURED error on timeout (D5 T5.3)."""
    if fail:
        return {"status": "partial_failure", "failure_type": "timeout",
                "attempted_query": subtopic, "partial_results": [],
                "alternatives": ["retry narrower", "try industry-report source"]}
    return {"status": "ok", "subtopic": subtopic,
            "claims": [{"claim": f"Key trend in {subtopic}",
                        "source_url": f"https://example.org/{subtopic.replace(' ', '-')}",
                        "source_name": f"{subtopic.title()} Report",
                        "year": 2024}]}


def synthesis_subagent(all_findings):
    """Merges claims; PRESERVES attribution; annotates coverage gaps (D5 T5.6)."""
    well_supported, gaps, claims = [], [], []
    for f in all_findings:
        if f.get("status") == "ok":
            well_supported.append(f["subtopic"])
            claims.extend(f["claims"])
        else:
            gaps.append(f"{f['attempted_query']} (source {f['failure_type']})")
    return {"well_supported": well_supported, "coverage_gaps": gaps, "claims": claims}


# ----------------------------------------------------------------- coordinator
def coordinator(topic, decomposition, inject_timeout_on=None):
    h2("Coordinator decomposes the topic")
    for st in decomposition:
        kv("  subtask", st)
    note("(Subagents have ISOLATED context — the coordinator passes each its assignment "
         "explicitly, and they never talk to each other.)")

    h2("Coordinator spawns web-search subagents IN PARALLEL (multiple Task calls, one turn)")
    findings = []
    for st in decomposition:
        fail = (st == inject_timeout_on)
        result = web_search_subagent(st, fail=fail)
        mark = "TIMEOUT→structured error" if fail else "ok"
        kv(f"  subagent[{st}]", mark)
        findings.append(result)

    h2("Coordinator aggregates → synthesis subagent")
    report = synthesis_subagent(findings)
    return report


def main():
    banner("Scenario 3", "Multi-Agent Research System — D1 · D2 · D5")
    concept("Scenario 3: Multi-Agent Research System",
            "Coordinator → web-search / doc-analysis / synthesis / report subagents",
            "Hub-and-spoke; decomposition is the risk; preserve provenance")

    topic = "impact of AI on creative industries"
    kv("research topic", topic)

    # PART 1 — the narrow-decomposition failure (sample Q7)
    pause("Part 1: the narrow-decomposition failure")
    h1("Part 1 — NARROW decomposition (every subagent succeeds, report is incomplete)")
    narrow = ["AI in digital art", "AI in graphic design", "AI in photography"]
    report = coordinator(topic, narrow)
    covered = set(report["well_supported"])
    missing = [s for s in ALL_SECTORS if not any(s in c for c in covered)]
    kv("  report covers", report["well_supported"])
    wrong(f"Report MISSES {missing}. Every subagent 'completed successfully' — but the "
          "coordinator's decomposition never assigned music, writing, or film.")
    right("Root cause is UPSTREAM: the coordinator's task decomposition (sample Q7).")

    # PART 2 — broad, partitioned decomposition
    pause("Part 2: broad, partitioned decomposition")
    h1("Part 2 — BROAD decomposition spanning the whole topic")
    broad = [f"AI in {s}" for s in ALL_SECTORS]
    report = coordinator(topic, broad)
    kv("  report covers", report["well_supported"])
    right("Distinct subtopics partition the scope (no duplication) and cover the full topic.")

    # PART 3 — a subagent timeout + structured error propagation
    pause("Part 3: a subagent times out — structured error propagation")
    h1("Part 3 — web-search subagent for 'AI in film' TIMES OUT")
    report = coordinator(topic, broad, inject_timeout_on="AI in film")
    kv("  well_supported", report["well_supported"])
    kv("  coverage_gaps", report["coverage_gaps"])
    right("The failure flows back as STRUCTURED context, so the coordinator could retry or "
          "proceed-with-partials. The report ANNOTATES the gap instead of shipping a silent "
          "hole (sample Q8).")

    # PART 4 — provenance preserved through synthesis
    pause("Part 4: provenance preserved")
    h1("Part 4 — claim→source attribution survives synthesis")
    code(json.dumps(report["claims"][0], indent=2), "a merged claim with its source")
    right("Subagents returned claim-source mappings (claim + URL + name + year); synthesis "
          "PRESERVED them, so the final report can be cited (D5 T5.6).")

    rule()
    h1("Plain-language analogy & the common confusion")
    analogy('A research director assigns analysts, routes notes between them (they never talk directly), and checks the final draft for gaps before publishing — that central desk is the coordinator.')
    pitfall("When the report misses whole areas, do not blame the analysts — they covered what they were assigned. The real failure is the coordinator's decomposition being too narrow. Read the assignment list first.")

    tip("One system shows: hub-and-spoke, the decomposition failure + fix, parallel "
        "spawning, structured error propagation with coverage annotations, and provenance "
        "preservation. That's D1 + D2 + D5.")


if __name__ == "__main__":
    main()
```

## Scenario 4 — Developer Productivity
**Source:** https://github.com/jacinthpaul/Claude-Certified-Architect/tree/claude/architect-exam-codebase-7ytdjz/scenarios/scenario4_developer_productivity
### app.py
```python
"""
SCENARIO 4 app — Developer Productivity codebase explorer (FUNCTIONAL)
=====================================================================
A genuinely working tool: it performs REAL Glob / Grep / Read / trace operations over a
target directory (defaults to this repo) — the built-in-tools workflow from Domain 2.5 in
action, not a scripted print.

Run:
  python3 scenarios/scenario4_developer_productivity/app.py            # scripted demo
  python3 scenarios/scenario4_developer_productivity/app.py -i         # interactive shell
  python3 scenarios/scenario4_developer_productivity/app.py -i /path/to/repo

Interactive commands:
  glob <pattern>     list files by NAME      e.g. glob **/*.py
  grep <pattern>     search file CONTENTS    e.g. grep def main
  read <relpath>     show a file's head + its exported names
  trace <symbol>     find where a symbol is defined, then who imports it
  help | quit
"""
import sys, os, re, pathlib

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[2]))
from ccarch import banner, h1, h2, kv, note, rule, right, tip

SKIP = {".git", "__pycache__", "node_modules", ".venv"}


def _walk(root):
    for p in pathlib.Path(root).rglob("*"):
        if p.is_file() and not any(s in p.parts for s in SKIP):
            yield p


def do_glob(root, pattern):
    pattern = pattern or "**/*"
    hits = [str(p.relative_to(root)) for p in pathlib.Path(root).rglob(pattern)
            if p.is_file() and not any(s in p.parts for s in SKIP)]
    return sorted(hits)


def do_grep(root, pattern, max_hits=40):
    rx = re.compile(pattern)
    out = []
    for p in _walk(root):
        if p.suffix not in (".py", ".js", ".jsx", ".md", ".json", ".css", ".txt"):
            continue
        try:
            for i, line in enumerate(p.read_text(errors="ignore").splitlines(), 1):
                if rx.search(line):
                    out.append((str(p.relative_to(root)), i, line.strip()))
                    if len(out) >= max_hits:
                        return out
        except Exception:
            pass
    return out


def exported_names(text):
    names = re.findall(r"^(?:def|class)\s+(\w+)", text, re.M)
    names += re.findall(r"^(\w+)\s*=", text, re.M)
    return sorted(set(names))


def do_read(root, relpath, head=18):
    f = pathlib.Path(root) / relpath
    if not f.is_file():
        return None
    text = f.read_text(errors="ignore")
    return text.splitlines()[:head], exported_names(text)


def do_trace(root, symbol):
    """Incremental exploration: find the definition, then who references it."""
    defs = do_grep(root, rf"^(?:def|class)\s+{re.escape(symbol)}\b")
    refs = [h for h in do_grep(root, rf"\b{re.escape(symbol)}\b") if "def " not in h[2] and "class " not in h[2]]
    return defs, refs[:12]


# --------------------------------------------------------------------------- #
def interactive(root):
    banner("Scenario 4 — Codebase Explorer", f"target: {root}")
    note("Commands: glob <pat> · grep <pat> · read <relpath> · trace <symbol> · help · quit")
    while True:
        try:
            line = input("\nexplore> ").strip()
        except (EOFError, KeyboardInterrupt):
            print(); break
        if not line:
            continue
        cmd, _, arg = line.partition(" ")
        cmd = cmd.lower()
        if cmd in ("quit", "exit", "q"):
            break
        elif cmd == "help":
            note("glob <pattern> | grep <pattern> | read <relpath> | trace <symbol> | quit")
        elif cmd == "glob":
            hits = do_glob(root, arg.strip())
            kv("matched files", str(len(hits)))
            for h in hits[:40]:
                note("  " + h)
        elif cmd == "grep":
            hits = do_grep(root, arg.strip())
            kv("matches", str(len(hits)))
            for f, ln, txt in hits:
                note(f"  {f}:{ln}: {txt}")
        elif cmd == "read":
            res = do_read(root, arg.strip())
            if not res:
                note("  no such file"); continue
            headlines, names = res
            for l in headlines:
                note("  " + l)
            kv("exported names", ", ".join(names) or "(none)")
        elif cmd == "trace":
            defs, refs = do_trace(root, arg.strip())
            h2("definition(s)")
            for f, ln, txt in defs:
                right(f"{f}:{ln}: {txt}")
            h2(f"references ({len(refs)})")
            for f, ln, txt in refs:
                note(f"  {f}:{ln}: {txt}")
        else:
            note("  unknown command — type 'help'")


def demo(root):
    banner("Scenario 4 — Codebase Explorer (demo)", f"real Glob/Grep/Read over {root}")
    h1("Glob = file NAMES")
    py = do_glob(root, "**/*.py")
    kv("  **/*.py", f"{len(py)} files; first: {py[0] if py else '—'}")

    h1("Grep = file CONTENTS")
    hits = do_grep(root, r"def main\(")
    kv("  'def main('", f"{len(hits)} matches")
    for f, ln, txt in hits[:5]:
        note(f"    {f}:{ln}: {txt}")

    h1("Incremental exploration: trace a symbol")
    defs, refs = do_trace(root, "ClaudeClient")
    for f, ln, txt in defs[:1]:
        right(f"defined at {f}:{ln}")
    kv("  references found", str(len(refs)))
    for f, ln, txt in refs[:4]:
        note(f"    {f}:{ln}")

    rule()
    tip("Glob = names, Grep = contents. Find the entry point with Grep, then Read to follow "
        "the thread — never bulk-read. Run with -i to explore interactively.")


def main():
    args = [a for a in sys.argv[1:]]
    interactive_mode = any(a in ("-i", "--interactive") for a in args)
    paths = [a for a in args if not a.startswith("-")]
    root = os.path.abspath(paths[0]) if paths else str(pathlib.Path(__file__).resolve().parents[2])
    if interactive_mode and sys.stdin.isatty():
        interactive(root)
    else:
        demo(root)


if __name__ == "__main__":
    main()
```
### codebase_explorer.py
```python
"""
SCENARIO 4 — Developer Productivity with Claude  (Agent SDK)
============================================================
An assistant that helps engineers explore unfamiliar codebases and legacy systems using
the built-in tools (Read, Write, Bash, Grep, Glob) plus MCP servers. Demonstrates the
concepts the exam attaches to this scenario: D2 Tools/MCP, D3 Claude Code Config, D1
Orchestration.

This demo runs a REAL incremental exploration over a tiny sample codebase it creates in a
temp dir — so you can watch Grep-find-entry-point → Read-follow-imports in action, the
right way (incremental) vs the wrong way (bulk read).

In ONE program:
  * Grep = CONTENTS vs Glob = NAMES (D2 T2.5)
  * incremental exploration beats bulk reading (D2 T2.5)
  * delegate verbose investigation to a subagent; only a summary returns (D5 T5.4 / D1)
  * scratchpad file as external memory (D5 T5.4)
"""

import sys, pathlib, tempfile, os, re
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[2]))
from ccarch import banner, concept, h1, h2, wrong, right, tip, note, kv, code, rule, pause, analogy, pitfall


SAMPLE = {
    "app/main.py": "from app.refund import process_refund\n\ndef handler(req):\n    return process_refund(req['order'], req['amount'])\n",
    "app/refund.py": "from app.ledger import append\n\ndef process_refund(order, amount):\n    append(order, -amount)\n    return {'ok': True}\n",
    "app/ledger.py": "def append(order, delta):\n    pass  # writes to the ledger\n",
    "app/utils.py": "def unrelated_helper():\n    return 42\n",
    "tests/test_refund.py": "def test_refund():\n    assert True\n",
}


def build_sample(root):
    for rel, content in SAMPLE.items():
        p = pathlib.Path(root) / rel
        p.parent.mkdir(parents=True, exist_ok=True)
        p.write_text(content)


def glob_names(root, pattern):
    return [str(p.relative_to(root)) for p in pathlib.Path(root).rglob(pattern)]


def grep_contents(root, term):
    hits = []
    for p in pathlib.Path(root).rglob("*.py"):
        for i, line in enumerate(p.read_text().splitlines(), 1):
            if term in line:
                hits.append((str(p.relative_to(root)), i, line.strip()))
    return hits


def read_imports(root, relpath):
    text = (pathlib.Path(root) / relpath).read_text()
    return re.findall(r"from ([\w.]+) import (\w+)", text)


def main():
    banner("Scenario 4", "Developer Productivity — D2 · D3 · D1")
    concept("Scenario 4: Developer Productivity with Claude",
            "Built-in tools (Read/Write/Bash/Grep/Glob) + MCP, on a real sample repo",
            "Incremental exploration, not bulk reading")

    with tempfile.TemporaryDirectory() as root:
        build_sample(root)
        kv("sample repo", root)

        h1("Glob = file NAMES (which files exist)")
        kv("  Glob('**/*.py')", glob_names(root, "*.py"))
        kv("  Glob('**/test_*.py')", glob_names(root, "test_*.py"))

        pause("Grep")
        h1("Grep = file CONTENTS (find the entry point)")
        for f, ln, txt in grep_contents(root, "process_refund"):
            kv(f"  {f}:{ln}", txt)
        right("Grep located every reference to process_refund — that's CONTENT search, the "
              "thing Glob cannot do.")

        pause("incremental exploration")
        h1("Incremental exploration: Read to follow the imports")
        chain, current = ["app/main.py"], "app/main.py"
        for _ in range(3):
            imports = read_imports(root, current)
            if not imports:
                break
            module, name = imports[0]
            nxt = module.replace(".", "/") + ".py"
            kv(f"  {current}", f"imports {name} from {nxt}")
            chain.append(nxt)
            current = nxt
        kv("  dependency chain", " → ".join(chain))
        wrong("Reading ALL files upfront (including utils.py, tests) wastes context.")
        right("Grep for the entry point, then Read to follow only the relevant thread "
              "(main → refund → ledger). utils.py never needed loading.")

        pause("delegate + scratchpad")
        h1("Delegate verbose work to a subagent; persist a scratchpad (D5 T5.4)")
        summary = "refund flow: app/main.handler → app/refund.process_refund → app/ledger.append"
        scratch = pathlib.Path(root) / "findings.md"
        scratch.write_text(summary + "\n")
        kv("  subagent returns (summary only)", summary)
        kv("  findings.md (external memory)", scratch.read_text().strip())
        right("A subagent does the noisy tracing; only the SUMMARY returns to the main "
              "agent, and the scratchpad survives context pressure.")

    rule()
    h1("Plain-language analogy & the common confusion")
    analogy('Dropped into a 10-year-old codebase with no map, you do not read every file — you find the front door (Grep for an entry point) and follow the hallways (Read the imports), taking notes as you go.')
    pitfall("The wasteful instinct is to bulk-read everything 'to understand it' — that blows the context budget. Search for entry points first, then follow only the threads that matter, and let subagents do the noisy digging.")

    tip("Grep=CONTENTS, Glob=NAMES. Explore incrementally (Grep→Read), never bulk-read. "
        "Delegate verbose investigations so only summaries return. That's D2 + D3 + D1.")


if __name__ == "__main__":
    main()
```

## Scenario 5 — CI/CD
**Source:** https://github.com/jacinthpaul/Claude-Certified-Architect/tree/claude/architect-exam-codebase-7ytdjz/scenarios/scenario5_cicd
### app.py
```python
"""
SCENARIO 5 app — CI/CD automated review (FUNCTIONAL)
====================================================
A real, basic static reviewer: it reads actual Python file(s), applies EXPLICIT criteria
(Domain 4.1), emits STRUCTURED findings (Domain 4.3), runs PER-FILE + a cross-file
INTEGRATION pass (Domain 4.6), and prints machine-readable JSON like a `-p` CI run would.

Run:
  python3 scenarios/scenario5_cicd/app.py                      # scripted demo (sample code)
  python3 scenarios/scenario5_cicd/app.py path/to/file.py      # review a real file
  python3 scenarios/scenario5_cicd/app.py a.py b.py --json     # JSON only (CI mode)
  python3 scenarios/scenario5_cicd/app.py --all path/to/file   # include style findings
"""
import sys, os, re, json, tempfile, pathlib

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[2]))
from ccarch import banner, h1, h2, kv, note, rule, wrong, right, tip, code

# Explicit criteria: (regex, category, severity, message). bug/security reported by
# default; style only with --all (false-positive control).
RULES = [
    (r"\beval\s*\(", "security", "critical", "eval() on dynamic input enables code execution"),
    (r"\bexec\s*\(", "security", "critical", "exec() executes arbitrary code"),
    (r"except\s*:", "bug", "high", "bare 'except:' swallows every error, incl. KeyboardInterrupt"),
    (r"==\s*None\b", "bug", "low", "use 'is None', not '== None'"),
    (r"!=\s*None\b", "bug", "low", "use 'is not None', not '!= None'"),
    (r"\b(password|secret|api_key|token)\s*=\s*[\"'][^\"']+[\"']", "security", "high",
     "hard-coded credential — use an environment variable"),
    (r"#\s*(TODO|FIXME)", "style", "low", "unresolved TODO/FIXME"),
    (r"\bprint\s*\(", "style", "low", "stray print() — use logging in library code"),
]
DEFAULT_CATS = {"bug", "security"}


def review_file(path, include_style=False):
    findings = []
    try:
        lines = pathlib.Path(path).read_text(errors="ignore").splitlines()
    except Exception as e:
        return [{"file": path, "line": 0, "severity": "high", "category": "bug",
                 "issue": f"could not read file: {e}", "confidence": 1.0}]
    for i, line in enumerate(lines, 1):
        if line.lstrip().startswith("#") and "TODO" not in line and "FIXME" not in line:
            continue  # skip comment lines except TODO/FIXME
        for rx, cat, sev, msg in RULES:
            if cat not in DEFAULT_CATS and not include_style:
                continue
            if re.search(rx, line):
                findings.append({"file": os.path.basename(path), "line": i, "severity": sev,
                                 "category": cat, "issue": msg, "confidence": 0.9})
    return findings


def integration_pass(paths):
    """Cross-file check: a function name defined in more than one file (possible dup)."""
    seen, dupes = {}, []
    for p in paths:
        try:
            for i, line in enumerate(pathlib.Path(p).read_text(errors="ignore").splitlines(), 1):
                m = re.match(r"\s*def\s+(\w+)", line)
                if m:
                    seen.setdefault(m.group(1), []).append((os.path.basename(p), i))
        except Exception:
            pass
    for name, locs in seen.items():
        files = {f for f, _ in locs}
        if len(files) > 1 and not name.startswith("_") and name not in ("main",):
            dupes.append({"category": "integration", "severity": "low",
                          "issue": f"function '{name}' defined in {len(files)} files",
                          "locations": locs, "confidence": 0.6})
    return dupes


SAMPLE = '''\
import os
password = "hunter2"          # planted: hard-coded secret

def parse(data):
    try:
        return eval(data)      # planted: eval on input
    except:                    # planted: bare except
        print("bad")           # planted: stray print

def is_ready(x):
    return x == None           # planted: == None
# TODO: handle empty input     # planted: TODO
'''


def render(per_file, integration, as_json):
    if as_json:
        print(json.dumps({"findings": [f for fs in per_file.values() for f in fs],
                          "integration": integration}, indent=2))
        return
    total = 0
    for path, findings in per_file.items():
        h2(f"{os.path.basename(path)} — {len(findings)} finding(s)")
        for f in sorted(findings, key=lambda x: x["line"]):
            total += 1
            label = right if f["severity"] == "low" else wrong
            label(f"L{f['line']} [{f['severity']}/{f['category']}] {f['issue']}")
    if integration:
        h2("cross-file integration pass")
        for f in integration:
            note(f"  [{f['severity']}/integration] {f['issue']}  @ {f['locations']}")
    kv("\ntotal findings", str(total + len(integration)))


def main():
    args = sys.argv[1:]
    as_json = "--json" in args
    include_style = "--all" in args
    paths = [a for a in args if not a.startswith("-")]

    if not paths:
        # scripted demo on a planted sample file
        tmp = pathlib.Path(tempfile.mkdtemp()) / "payments.py"
        tmp.write_text(SAMPLE)
        paths = [str(tmp)]
        if not as_json:
            banner("Scenario 5 — CI/CD Review (demo)", "reviewing a planted sample file")
            h1("The file under review")
            code(SAMPLE.rstrip(), "payments.py")
            h1("Findings (explicit criteria; bug/security by default)")
    elif not as_json:
        banner("Scenario 5 — CI/CD Review", f"reviewing {len(paths)} file(s)")

    per_file = {p: review_file(p, include_style) for p in paths}
    integration = integration_pass(paths) if len(paths) > 1 else []
    render(per_file, integration, as_json)

    if not as_json:
        rule()
        tip("Explicit criteria + severities keep false positives low; bug/security report "
            "by default, style only with --all. Per-file + integration passes avoid "
            "attention dilution. Add --json for the machine-parseable CI output (claude -p).")


if __name__ == "__main__":
    main()
```
### ci_review_pipeline.py
```python
"""
SCENARIO 5 — Claude Code for Continuous Integration (CI/CD)
===========================================================
Claude Code wired into the automated pipeline that runs on every PR: automated reviews,
test generation, and PR feedback — running non-interactively with FEW false positives.
Demonstrates the concepts the exam attaches to this scenario: D3 Claude Code Config,
D4 Prompt Engineering & Structured Output.

In ONE program:
  * non-interactive -p flag; invented flags are distractors (D3 T3.6 / sample Q10)
  * structured JSON output for auto-posting PR comments (D3 T3.6 / D4 T4.3)
  * explicit criteria to cut false positives (D4 T4.1)
  * independent review instance vs self-review (D4 T4.6 / D3 T3.6)
  * multi-pass review for a large PR (D4 T4.6 / sample Q12)
  * report-only-new-findings on re-review; existing-tests-in-context (D3 T3.6)
"""

import sys, pathlib, json
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[2]))
from ccarch import banner, concept, h1, h2, wrong, right, tip, note, kv, code, rule, pause, analogy, pitfall


REVIEW_SCHEMA = {
    "type": "object",
    "properties": {
        "findings": {"type": "array", "items": {"type": "object", "properties": {
            "file": {"type": "string"}, "line": {"type": "integer"},
            "severity": {"type": "string", "enum": ["critical", "high", "low"]},
            "category": {"type": "string", "enum": ["bug", "security", "style"]},
            "issue": {"type": "string"}, "suggested_fix": {"type": "string"},
            "confidence": {"type": "number"},
        }}}
    },
}


def review_plan(num_files):
    return [f"pass {i+1}: {fn} (local)" for i, fn in
            enumerate([f"file{i+1}.py" for i in range(num_files)])] + \
           [f"pass {num_files+1}: cross-file integration"]


def main():
    banner("Scenario 5", "Claude Code for CI/CD — D3 · D4")
    concept("Scenario 5: Claude Code for Continuous Integration",
            "Automated review · test generation · PR feedback (no human at the keyboard)",
            "Non-interactive, structured, low false-positive")

    h1("Running non-interactively (sample Q10)")
    wrong('claude "Analyze this PR"   # HANGS — waiting for interactive input')
    code('claude -p "Analyze this PR" --output-format json --json-schema review.json',
         "the CI invocation")
    wrong("CLAUDE_HEADLESS / --batch don't exist; stdin redirection doesn't fix the syntax.")
    right("-p / --print = non-interactive: run, print, exit. Plus structured JSON so the "
          "pipeline auto-posts inline PR comments.")

    pause("structured findings")
    rule()
    h1("Structured findings schema (so a bot can post them)")
    code(json.dumps(REVIEW_SCHEMA, indent=2)[:520] + "\n  ...", "review schema")

    pause("false positives")
    rule()
    h1("Cut false positives with explicit criteria (D4 T4.1)")
    wrong('"Report anything that looks off" / "be conservative" — floods the PR with noise; '
          "developers start ignoring the bot entirely.")
    right("REPORT bugs and security issues with severity anchors; SKIP minor style. A noisy "
          "category? Disable it while you improve its prompt.")

    pause("independent review")
    rule()
    h1("Independent review instance, not self-review (D4 T4.6)")
    wrong("Letting the session that GENERATED the code review it — it rubber-stamps its own "
          "reasoning.")
    right("Spin up a FRESH instance with no generation context — it catches more issues.")

    pause("multi-pass")
    rule()
    h1("Large PR (14 files): multi-pass, not one big pass (sample Q12)")
    for step in review_plan(3):   # shape shown with 3 files
        kv("  ", step)
    wrong("One pass over all 14 files → uneven depth, missed bugs, contradictory findings. "
          "A bigger context window does NOT fix attention quality.")
    right("Per-file local passes + one integration pass.")

    rule()
    h1("Re-review discipline (D3 T3.6)")
    note("- On RE-RUN after new commits: include prior findings; instruct Claude to report "
         "only NEW/unaddressed issues → no duplicate comments.")
    note("- For TEST GENERATION: provide existing test files so it doesn't duplicate covered "
         "scenarios; put testing standards & fixtures in CLAUDE.md.")

    rule()
    h1("Plain-language analogy & the common confusion")
    analogy('An automated reviewer is a quality inspector on the line. Flag too many non-issues and the workers start ignoring it entirely — so precision (few false positives) matters more than raw volume.')
    pitfall('Two myths sink CI reviews: that a chatty paragraph is usable by a pipeline (it needs structured JSON), and that the session which wrote the code can fairly review it (use a fresh instance). And without -p, the job just hangs.')

    tip("-p for non-interactive (the #1 CI gotcha). Structured JSON for auto-posting. "
        "Explicit criteria + fresh-instance review + multi-pass = actionable, low-noise "
        "feedback. That's D3 + D4.")


if __name__ == "__main__":
    main()
```

## Scenario 6 — Structured Extraction
**Source:** https://github.com/jacinthpaul/Claude-Certified-Architect/tree/claude/architect-exam-codebase-7ytdjz/scenarios/scenario6_structured_extraction
### app.py
```python
"""
SCENARIO 6 app — Structured Data Extraction (FUNCTIONAL)
========================================================
A real, basic extractor: it parses unstructured invoice-like text into a schema-validated
record, emitting null (never a fabricated value) for genuinely-absent fields, validating
totals, attaching per-field confidence, and routing low-confidence fields to a human —
Domain 4.3/4.4 + Domain 5.5 in action.

Run:
  python3 scenarios/scenario6_structured_extraction/app.py            # scripted demo
  python3 scenarios/scenario6_structured_extraction/app.py -i         # paste your own text
  python3 scenarios/scenario6_structured_extraction/app.py "Pd $20 to Acme on 3/4/25"
"""
import sys, re, json, pathlib
from datetime import datetime

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[2]))
from ccarch import banner, h1, h2, kv, note, rule, wrong, right, tip, code

MONTHS = {m: i for i, m in enumerate(
    ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"], 1)}


def _norm_date(text):
    # m/d/yy or m/d/yyyy
    m = re.search(r"\b(\d{1,2})/(\d{1,2})/(\d{2,4})\b", text)
    if m:
        mo, da, yr = (int(x) for x in m.groups())
        yr += 2000 if yr < 100 else 0
        try:
            return datetime(yr, mo, da).date().isoformat(), 0.9
        except ValueError:
            return None, 0.0
    # "March 4, 2025" / "Mar 4 2025"
    m = re.search(r"\b([A-Za-z]{3,9})\s+(\d{1,2})(?:st|nd|rd|th)?,?\s+(\d{4})\b", text)
    if m and m.group(1)[:3].lower() in MONTHS:
        mo = MONTHS[m.group(1)[:3].lower()]
        try:
            return datetime(int(m.group(3)), mo, int(m.group(2))).date().isoformat(), 0.85
        except ValueError:
            return None, 0.0
    return None, 0.0


def extract(text):
    """Return (record, confidence) — null for absent fields, never fabricated."""
    conf = {}
    # vendor: after 'to'/'from'/'vendor:' up to punctuation
    vm = re.search(r"\b(?:to|from|vendor:?)\s+([A-Z][\w&.\- ]+?)(?:\s+(?:on|for|amount|\$)|[,.\n]|$)",
                   text, re.I)
    vendor = vm.group(1).strip() if vm else None
    conf["vendor"] = 0.9 if vendor else 0.0

    # amount: $1,200.50 or 'amount 20'
    am = re.search(r"\$\s?([\d,]+(?:\.\d{1,2})?)", text) or \
        re.search(r"\bamount\s+(?:of\s+)?([\d,]+(?:\.\d{1,2})?)", text, re.I)
    amount = float(am.group(1).replace(",", "")) if am else None
    # explicit "to be confirmed / TBD / unknown" => stay null, do NOT invent
    if amount is None and re.search(r"to be confirmed|TBD|unknown|N/?A", text, re.I):
        conf["amount"] = 0.0
    else:
        conf["amount"] = 0.9 if amount is not None else 0.0

    currency = "USD" if "$" in text else (
        "EUR" if "€" in text else (re.search(r"\b(USD|EUR|GBP)\b", text).group(1)
                                    if re.search(r"\b(USD|EUR|GBP)\b", text) else None))
    conf["currency"] = 0.8 if currency else 0.0

    date, dconf = _norm_date(text)
    conf["date"] = dconf

    # line items: numbers in a "items: a, b, c" clause
    items = []
    im = re.search(r"items?:?\s*([\d.,\s]+)", text, re.I)
    if im:
        items = [float(x) for x in re.findall(r"\d+(?:\.\d+)?", im.group(1))]
    stated_total = amount
    calculated_total = round(sum(items), 2) if items else None

    rec = {"vendor": vendor, "amount": amount, "currency": currency, "date": date,
           "line_items": items, "stated_total": stated_total,
           "calculated_total": calculated_total}
    return rec, conf


def validate(rec):
    errs = []
    if rec["line_items"] and rec["stated_total"] is not None:
        if rec["calculated_total"] != rec["stated_total"]:
            errs.append(f"line_items sum {rec['calculated_total']} != stated_total {rec['stated_total']}")
    if rec["vendor"] is None:
        errs.append("required field 'vendor' is missing")
    return errs


def route(conf, threshold=0.7):
    return {f: ("HUMAN" if c < threshold else "auto") for f, c in conf.items()}


def process(text, as_json=False):
    rec, conf = extract(text)
    errs = validate(rec)
    routing = route(conf)
    if as_json:
        print(json.dumps({"record": rec, "confidence": conf, "validation_errors": errs,
                          "routing": routing}, indent=2))
        return rec, errs
    kv("input", text.strip())
    code(json.dumps(rec, indent=2), "extracted record")
    nulls = [k for k, v in rec.items() if v is None]
    if nulls:
        right(f"emitted null (not fabricated) for: {', '.join(nulls)}")
    if errs:
        wrong("validation: " + "; ".join(errs))
    else:
        right("validation passed")
    low = [f for f, d in routing.items() if d == "HUMAN" and conf[f] > 0]
    flagged_absent = [f for f, c in conf.items() if c == 0.0]
    kv("route to human (low confidence)", ", ".join(low) or "none")
    kv("absent → null", ", ".join(flagged_absent) or "none")
    return rec, errs


SAMPLES = [
    "Pd $1,200.50 to Acme Corp on 3/4/25",
    "Invoice from Beta LLC, amount to be confirmed next week",
    "Charge to Gamma Inc on March 4, 2025, items: 10, 20, amount $35",  # sum mismatch
]


def interactive():
    banner("Scenario 6 — Structured Extraction", "paste a line of invoice text; 'quit' to exit")
    while True:
        try:
            line = input("\ndoc> ").strip()
        except (EOFError, KeyboardInterrupt):
            print(); break
        if line.lower() in ("quit", "exit", "q"):
            break
        if line:
            process(line)


def main():
    args = sys.argv[1:]
    as_json = "--json" in args
    free = [a for a in args if not a.startswith("-")]
    if any(a in ("-i", "--interactive") for a in args) and sys.stdin.isatty():
        interactive(); return
    if free:
        process(" ".join(free), as_json=as_json); return
    banner("Scenario 6 — Structured Extraction (demo)", "real parsing of 3 sample documents")
    for i, s in enumerate(SAMPLES, 1):
        h2(f"document {i}")
        process(s)
    rule()
    tip("Absent info → null (never fabricated); a schema can't catch semantic errors so we "
        "validate totals; low-confidence fields route to a human. Run -i to paste your own.")


if __name__ == "__main__":
    main()
```
### extraction_pipeline.py
```python
"""
SCENARIO 6 — Structured Data Extraction  (Claude API)
=====================================================
A runnable extraction pipeline that reads unstructured "documents" and emits clean,
schema-validated data. Demonstrates the concepts the exam attaches to this scenario:
D4 Prompt Engineering & Structured Output, D5 Context & Reliability.

In ONE program:
  * STRUCTURED OUTPUT via a tool whose input_schema IS the output contract (D4 T4.3)
  * NULLABLE fields so the model emits null instead of fabricating (D4 T4.3)
  * an EXTENSIBLE enum ("other" + detail) (D4 T4.3)
  * VALIDATION + retry-with-error-feedback; and recognizing a FUTILE retry (D4 T4.4)
  * SELF-CORRECTING schema: stated_total vs calculated_total (D4 T4.4)
  * BATCH vs synchronous routing + custom_id (D4 T4.5)
  * CONFIDENCE-ANNOTATED routing to human review (D5 T5.5)
"""

import sys, pathlib, json
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[2]))
from ccarch import banner, concept, h1, h2, wrong, right, tip, note, kv, code, rule, pause, analogy, pitfall

# The extraction tool's input_schema = the output contract (D4 T4.3)
SCHEMA = {
    "type": "object",
    "properties": {
        "vendor": {"type": "string"},
        "amount": {"type": ["number", "null"]},          # nullable -> no fabrication
        "currency": {"type": ["string", "null"]},
        "date": {"type": ["string", "null"]},             # ISO 8601
        "category": {"type": "string", "enum": ["goods", "services", "unclear", "other"]},
        "category_detail": {"type": ["string", "null"]},
        "line_items": {"type": "array", "items": {"type": "number"}},
        "stated_total": {"type": ["number", "null"]},
        "calculated_total": {"type": ["number", "null"]},  # self-correcting (D4 T4.4)
    },
    "required": ["vendor", "category"],
}


def validate(rec: dict):
    errs = []
    if rec.get("stated_total") is not None and rec.get("line_items"):
        calc = round(sum(rec["line_items"]), 2)
        if rec.get("calculated_total") != calc:
            errs.append(f"calculated_total should be {calc}")
        if calc != rec["stated_total"]:
            errs.append(f"line_items sum {calc} != stated_total {rec['stated_total']}")
    if rec.get("date") and str(rec["date"]).count("-") != 2:
        errs.append(f"date {rec['date']!r} not ISO 8601 (YYYY-MM-DD)")
    if rec.get("category") == "other" and not rec.get("category_detail"):
        errs.append("category 'other' requires category_detail")
    return errs


def confidence_route(field_conf: dict, threshold=0.80):
    return {f: ("HUMAN" if c < threshold else "auto") for f, c in field_conf.items()}


def main():
    banner("Scenario 6", "Structured Data Extraction — D4 · D5")
    concept("Scenario 6: Structured Data Extraction",
            "Unstructured documents → schema-validated JSON → downstream systems",
            "Tool-use schema + nullable + validation/retry + confidence routing")

    h1("The extraction tool's input_schema IS the output contract")
    code(json.dumps(SCHEMA, indent=2), "extraction schema")

    # 1) nullable prevents fabrication
    pause("nullable fields prevent fabrication")
    h1("1) A document genuinely missing the amount")
    doc = "Invoice from Beta LLC, amount to be confirmed next week."
    rec = {"vendor": "Beta LLC", "amount": None, "currency": None, "date": None,
           "category": "services", "line_items": [], "stated_total": None,
           "calculated_total": None}
    kv("  document", doc)
    kv("  extraction", json.dumps({k: rec[k] for k in ("vendor", "amount", "date")}))
    right("amount=null instead of a fabricated number. Required fields would have FORCED a "
          "made-up value — the #1 schema-design fact.")

    # 2) validation + retry with feedback
    pause("validation + retry-with-feedback")
    h1("2) Validation catches a SEMANTIC error a schema can't")
    bad = {"vendor": "Acme", "category": "goods", "line_items": [10.0, 20.0],
           "stated_total": 35.0, "calculated_total": 30.0, "date": "03/04/2025"}
    errs = validate(bad)
    kv("  extraction", json.dumps({k: bad[k] for k in ("line_items", "stated_total",
                                                       "calculated_total", "date")}))
    wrong("Schema-valid but WRONG: " + "; ".join(errs))
    h2("Retry message (document + failed extraction + SPECIFIC errors)")
    code("\n".join(f"- {e}" for e in errs), "feedback that steers self-correction")
    fixed = {**bad, "stated_total": 30.0, "calculated_total": 30.0, "date": "2025-03-04"}
    kv("  retry result valid?", "yes" if not validate(fixed) else "no")
    right("Specific feedback fixes format/structure errors. Blind retries would not.")

    # 3) futile retry
    pause("recognizing a futile retry")
    h1("3) When retry is FUTILE")
    note("The PO number lives in a separate document you didn't provide.")
    wrong("Retrying forever — the info is ABSENT from the source; it can never appear.")
    right("Emit null and route to a human / fetch the missing source. Retry can't conjure "
          "absent data (D4 T4.4).")

    # 4) batch routing
    pause("batch vs synchronous")
    h1("4) Batch vs synchronous routing (D4 T4.5)")
    kv("  100k overnight invoices", "BATCH (50% cheaper, <=24h, nobody waiting)")
    kv("  one invoice a user is waiting on", "SYNCHRONOUS (no batch latency SLA)")
    code('requests=[{"custom_id":"inv-001",...}, ...]  '
         '# correlate + resubmit only failures', "custom_id")

    # 5) confidence routing
    pause("confidence-annotated human review")
    h1("5) Confidence-annotated routing to humans (D5 T5.5)")
    field_conf = {"vendor": 0.98, "amount": 0.55, "date": 0.91}
    routing = confidence_route(field_conf)
    for f, decision in routing.items():
        kv(f"  {f} (conf={field_conf[f]})", decision)
    right("Route low-confidence FIELDS to humans; auto-accept the rest. Calibrate the "
          "threshold on a labeled set; also audit high-confidence samples (stratified).")

    rule()
    h1("Plain-language analogy & the common confusion")
    analogy("Turning a shoebox of receipts into a clean spreadsheet. When a receipt is smudged you write 'unknown' — you do not invent a number to fill the cell. That honesty is exactly what nullable fields buy you.")
    pitfall('A schema makes learners feel safe, but it only guarantees SHAPE, not truth — totals can still fail to add up. Validate the numbers, keep uncertain fields nullable, and route low-confidence extractions to a human.')

    tip("Tool-use schema kills SYNTAX errors; nullable kills fabrication; validation+retry "
        "handles SEMANTICS (but not absent info); batch for non-blocking; confidence routing "
        "for human review. That's D4 + D5.")


if __name__ == "__main__":
    main()
```

