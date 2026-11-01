# Domain 5 — Context Management & Reliability

## Domain Overview

# Domain 5 — Context Management & Reliability (15%)

The smallest domain by weight but woven through every scenario: keep critical facts alive
in long interactions, escalate wisely, propagate errors usefully, survive huge codebases,
calibrate human review, and preserve "who said what" through synthesis.

| Task | Demo | One-line idea |
|---|---|---|
| 5.1 Manage conversation context to preserve critical information across long interactions | `task5_1_preserve_context.py` | The "case facts" block survives summarization |
| 5.2 Design effective escalation and ambiguity resolution patterns | `task5_2_escalation.py` | Escalate by rule (explicit/policy-gap/no-progress), not vibe |
| 5.3 Implement error propagation strategies across multi-agent systems | `task5_3_error_propagation.py` | Structured error context enables recovery |
| 5.4 Manage context effectively in large codebase exploration | `task5_4_large_codebase.py` | Scratchpads, delegation, manifests, /compact |
| 5.5 Design human review workflows and confidence calibration | `task5_5_human_review.py` | Segment accuracy; calibrate; audit the fast lane |
| 5.6 Preserve information provenance and handle uncertainty in multi-source synthesis | `task5_6_provenance.py` | Claim-source mappings; conflicts vs temporal trends |

```bash
python3 run_all.py domain5
```

**Watch out for:** aggregate "97% accuracy" hiding a 60% pocket; a 2021 vs 2024 figure is a
*trend*, not a contradiction; numbers and dates are the first casualties of summarization.

## Task 5.1 — Preserve critical information across long interactions

**Source:** https://github.com/jacinthpaul/Claude-Certified-Architect/blob/claude/architect-exam-codebase-7ytdjz/domains/domain5_context_reliability/task5_1_preserve_context.py

### Objective
Manage conversation context to preserve critical information across long interactions. Preserve critical information across long interactions.

### Concept
The 'case facts' block survives summarization. Progressive summarization erodes precision; lost-in-the-middle mitigations; tool-output bloat; the persistent structured "case facts" block; stateless API requiring full history each request.

### Instructions
1. Watch progressive summarization destroy the facts.
2. Lost in the middle: put a KEY-FINDINGS summary at the TOP and organize details under explicit SECTION HEADERS.
3. Tool-output bloat: trim tool outputs to the relevant fields before they accumulate.
4. Apply the signature "case facts" block: extract transactional facts into a PERSISTENT structured block included in EVERY prompt, OUTSIDE the summarized history.
5. Remember the API is STATELESS — pass the complete conversation history each request.

### Acceptance Criteria
- Numbers, dates, percentages, and customer-stated expectations survive across long interactions (they are the FIRST casualties of summarization).
- Key findings are placed at the TOP of long inputs with explicit section headers (lost-in-the-middle mitigation).
- Tool outputs are trimmed to relevant fields before they accumulate across calls.
- Transactional facts (amounts, dates, order numbers, statuses) live in a persistent structured "case facts" block included in every prompt, outside the summarized history.
- Each request carries the complete conversation history (stateless API); multi-agent handoffs return structured data WITH metadata (dates, source locations), or under tight budgets key facts + citations + relevance scores.

### Full code
```python
"""
Domain 5 · Task 5.1 — Preserve critical information across long interactions.

THREE FAILURE PHYSICS YOU MUST INTERNALIZE
==========================================
  1. PROGRESSIVE SUMMARIZATION erodes precision. Each round strips detail; numbers,
     percentages, dates, and customer-stated expectations are the FIRST casualties.
  2. LOST IN THE MIDDLE. Models reliably process the BEGINNING and END of long inputs but
     may skip the middle. Mitigation: key-findings summary at the TOP + explicit section
     headers.
  3. TOOL-OUTPUT BLOAT. A lookup returns 40+ fields when 5 matter; times dozens of calls,
     context drowns. Trim tool outputs to relevant fields before they accumulate.

THE SIGNATURE PATTERN — the "case facts" block: extract transactional facts (amounts,
dates, order numbers, statuses) into a PERSISTENT structured block included in EVERY
prompt, OUTSIDE the summarized history. Summaries blur; the facts block cannot.

Also: the API is STATELESS — you must pass the complete conversation history each request.
"""

import sys, pathlib, json
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[2]))
from ccarch import banner, concept, h1, h2, wrong, right, tip, note, kv, code, rule, pause, analogy, pitfall


CASE_FACTS = {
    "customer": "Dana Lee",
    "order": "#88231",
    "refund_amount": 847.50,
    "deadline": "March 3",
    "reason": "second damaged delivery",
}


def main():
    banner("Domain 5 · Task 5.1", "Preserve critical info across long interactions")
    concept("Domain 5: Context Management & Reliability (15%)",
            "Task 5.1 — Manage conversation context to preserve critical information across long interactions",
            "The 'case facts' block survives summarization")

    h1("1) Watch progressive summarization destroy the facts")
    original = ("Customer Dana Lee (order #88231) was promised a $847.50 refund by March 3 "
                "after a second damaged delivery.")
    s1 = "Dana Lee was promised a refund for delivery issues."
    s2 = "A customer had delivery problems; a refund was discussed."
    kv("  original", original)
    kv("  summary 1", s1)
    kv("  summary 2", s2)
    wrong("Two rounds in, EVERY actionable fact — name, order #, amount, deadline — is gone, "
          "yet each summary looked reasonable. Numbers/dates die first.")

    pause("lost in the middle")
    rule()
    h1("2) Lost in the middle")
    note("Models reliably read the BEGINNING and END of a long input; the middle gets skipped.")
    right("Put a KEY-FINDINGS summary at the TOP and organize details under explicit SECTION "
          "HEADERS so nothing critical hides in the middle.")

    rule()
    h1("3) Tool-output bloat")
    fat = {f"field_{i}": i for i in range(40)}
    fat.update({"status": "shipped", "eta": "June 15"})
    lean = {"status": fat["status"], "eta": fat["eta"]}
    kv("  raw tool output", f"{len(fat)} fields")
    kv("  trimmed to relevant", f"{lean}")
    right("Trim tool outputs to the 5 fields that matter BEFORE they accumulate across "
          "dozens of calls.")

    pause("the case facts block")
    rule()
    h1("THE signature pattern: the 'case facts' block")
    code(json.dumps(CASE_FACTS, indent=2), "persistent facts (included in EVERY prompt)")
    right("Keep transactional facts in a structured block OUTSIDE the summarized history. "
          "Summaries can blur; the facts block cannot.")

    rule()
    h1("Also: the API is stateless")
    note("Each request must carry the COMPLETE conversation history to maintain coherence. "
         "There is no server-side memory between calls.")
    note("For multi-agent handoffs: require subagents to return structured data WITH metadata "
         "(dates, source locations); under tight budgets, return key facts + citations + "
         "relevance scores instead of verbose prose.")

    rule()
    h1("Plain-language analogy & the common confusion")
    analogy('Summarizing a case file over and over is like photocopying a photocopy — each pass is fuzzier, and the fine print (amounts, dates, deadlines) vanishes first. Keep the key numbers on a separate index card that never gets re-copied.')
    pitfall("Each individual summary looks reasonable, so the loss is invisible until the actionable facts are already gone. Protect numbers, dates, and order IDs in a persistent 'case facts' block outside the summarized history.")

    tip("Numbers/dates die first in summaries. Defend them with a persistent case-facts "
        "block. Summary-at-top + section-headers beats lost-in-the-middle. Trim tool output early.")


if __name__ == "__main__":
    main()
```

## Task 5.2 — Escalation and ambiguity resolution

**Source:** https://github.com/jacinthpaul/Claude-Certified-Architect/blob/claude/architect-exam-codebase-7ytdjz/domains/domain5_context_reliability/task5_2_escalation.py

### Objective
Design effective escalation and ambiguity resolution patterns.

### Concept
Escalate by RULE, not by vibe. Reliable triggers: explicit human request (honor immediately), policy gap/ambiguity, no progress. Unreliable triggers: frustration alone, negative sentiment score, model self-reported confidence. Calibration fix = explicit escalation criteria with few-shot examples in the system prompt. Multiple customer matches: ask for additional identifiers.

### Instructions
1. Distinguish reliable vs unreliable escalation signals:
   - Customer demands a human → ESCALATE (honor immediately).
   - Policy silent on the request (e.g., competitor price-match) → ESCALATE (policy gap).
   - Agent stuck, no progress → ESCALATE.
   - Customer frustrated but issue is simple → do NOT escalate (resolve; escalate only if they reiterate).
   - Negative sentiment score → do NOT escalate (sentiment does not correlate with complexity).
   - Model self-reports low confidence → do NOT escalate (LLM self-confidence is poorly calibrated; most overconfident on hard cases).
2. Calibration fix (sample Q3): when an agent escalates easy cases while fumbling hard ones (55% vs an 80% target), add EXPLICIT escalation criteria WITH FEW-SHOT EXAMPLES to the system prompt — not confidence thresholds, not a classifier, not sentiment analysis.
3. Multiple customer matches: ASK for additional identifiers (email, order #, last 4 of card). Never pick "most likely" by heuristic — that's how wrong-account refunds happen.

### Acceptance Criteria
- Escalation decisions are driven by explicit, reliable rules (explicit human request, policy gap/silence, no progress) rather than sentiment, frustration, or model self-confidence.
- An explicit customer request for a human is honored immediately — the agent does not "investigate first."
- The agent never invents policy when policy is ambiguous or silent; it escalates with a handoff summary.
- When escalation behavior is miscalibrated (escalating easy cases, attempting hard ones), the fix is explicit escalation criteria + few-shot examples in the system prompt.
- With multiple customer matches, the agent asks for additional identifiers instead of picking "most likely" by heuristic.

### Full code
```python
"""
Domain 5 · Task 5.2 — Escalation and ambiguity resolution.

LEGITIMATE ESCALATION TRIGGERS
==============================
  1. The customer EXPLICITLY asks for a human (honor immediately — don't "investigate first").
  2. Policy is AMBIGUOUS or SILENT on the request (e.g., competitor price-matching when
     policy only covers own-site adjustments).
  3. The agent CANNOT make meaningful progress.

NOT reliable triggers:
  * Customer frustrated but issue is simple   -> resolve it; escalate only if they reiterate.
  * Negative SENTIMENT score                  -> sentiment does NOT correlate with complexity.
  * Model SELF-REPORTED confidence            -> poorly calibrated; the agent is MOST
                                                 overconfident on the hard cases.

THE CALIBRATION FIX (sample Q3): when an agent escalates easy cases while fumbling hard
ones (55% vs an 80% target), add EXPLICIT escalation criteria WITH FEW-SHOT EXAMPLES to
the system prompt — not confidence thresholds, not a classifier, not sentiment analysis.

Multiple customer matches: ASK for additional identifiers. Never pick "most likely" by
heuristic — that's how wrong-account refunds happen.
"""

import sys, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[2]))
from ccarch import banner, concept, h1, h2, wrong, right, tip, note, kv, code, rule, pause, analogy, pitfall


def should_escalate(explicit_human=False, policy_gap=False, no_progress=False,
                    frustrated=False, neg_sentiment=False, low_self_confidence=False):
    if explicit_human:
        return True, "Customer explicitly asked for a human — honor immediately."
    if policy_gap:
        return True, "Policy is ambiguous/silent — the agent must not invent policy."
    if no_progress:
        return True, "Agent cannot make meaningful progress."
    if frustrated:
        return False, "Frustration alone isn't a trigger — acknowledge and resolve."
    if neg_sentiment:
        return False, "Sentiment does not correlate with case complexity."
    if low_self_confidence:
        return False, "LLM self-confidence is poorly calibrated; not a reliable trigger."
    return False, "Resolve autonomously."


def main():
    banner("Domain 5 · Task 5.2", "Escalation & ambiguity resolution")
    concept("Domain 5: Context Management & Reliability (15%)",
            "Task 5.2 — Design effective escalation and ambiguity resolution patterns",
            "Escalate by RULE, not by vibe")

    h1("Reliable vs unreliable escalation signals")
    cases = [
        ("Customer demands a human", dict(explicit_human=True)),
        ("Policy silent on competitor price-match", dict(policy_gap=True)),
        ("Agent stuck, no progress", dict(no_progress=True)),
        ("Customer frustrated, issue is simple", dict(frustrated=True)),
        ("Negative sentiment score", dict(neg_sentiment=True)),
        ("Model self-reports low confidence", dict(low_self_confidence=True)),
    ]
    for desc, kw in cases:
        esc, why = should_escalate(**kw)
        h2(desc)
        (right if esc else wrong)(f"{'ESCALATE' if esc else 'do NOT escalate'} — {why}")

    pause("the calibration fix")
    rule()
    h1("The calibration fix (sample Q3): 55% vs 80% target")
    note("Agent escalates straightforward cases (standard damage replacements w/ photos) "
         "while attempting complex policy-exception cases itself.")
    right("Add EXPLICIT escalation criteria + FEW-SHOT examples to the system prompt "
          "(showing when to escalate vs resolve).")
    code(
        '''SYSTEM = """Resolve the case yourself UNLESS one of these is true:
  - the customer explicitly asks for a human
  - policy is silent on the situation
  - you have made no progress after two attempts
Then escalate with a handoff summary. Examples:

  Case: "standard damage replacement, photo attached" -> RESOLVE
  Case: "competitor price-match, not in policy"       -> ESCALATE (policy gap)
"""    # explicit criteria + few-shot beats a confidence threshold'''
        , "escalation criteria + few-shot")
    wrong("Self-reported confidence threshold — already miscalibrated on hard cases.")
    wrong("A separate classifier model — over-engineered before prompt optimization is tried.")
    wrong("Sentiment analysis — solves a different problem; sentiment != complexity.")

    rule()
    h1("Multiple customer matches")
    wrong("Picking 'the most likely' account by heuristic — that's how wrong-account "
          "refunds happen.")
    right("ASK for additional identifiers (email, order #, last 4 of card).")

    rule()
    h1("Plain-language analogy & the common confusion")
    analogy('A good front-desk agent hands you to a manager when you ask, or when the rulebook is silent — not because you sounded annoyed. Frustration is noise; an explicit request or a policy gap is the real signal.')
    pitfall("Two false signals lure learners: customer sentiment (a frustrated customer may have a trivial issue) and the model's own confidence (it is most overconfident exactly on the hard cases). Escalate by rule, not by vibe.")

    tip("Reliable triggers: explicit human request (honor NOW), policy gap, no progress. "
        "NOT sentiment, NOT self-confidence, NOT frustration alone. Calibration fix = "
        "explicit criteria + few-shot.")


if __name__ == "__main__":
    main()
```

## Task 5.3 — Error propagation across multi-agent systems

**Source:** https://github.com/jacinthpaul/Claude-Certified-Architect/blob/claude/architect-exam-codebase-7ytdjz/domains/domain5_context_reliability/task5_3_error_propagation.py

### Objective
Implement error propagation strategies across multi-agent systems.

### Concept
Structured error context enables intelligent recovery. When a subagent fails, what flows back to the coordinator determines recovery: failure type, attempted query, partial results, alternative approaches. Anti-patterns: generic "search unavailable" (hides needed info), empty results marked as success (silent suppression), propagate-and-terminate (over-reaction). Coverage annotations mark well-supported findings and gaps. (Official sample question Q8.)

### Instructions
1. Propagate STRUCTURED error context back to the coordinator — failure type, attempted query, partial results, alternative approaches — so the coordinator can retry-modified, try an alternative source, or proceed with partials and ANNOTATE the gap.
2. Retry internally FIRST, but never collapse the result into a generic "search unavailable" status that hides the query, partials, and alternatives.
3. NEVER return empty results marked as success — silent suppression ships a report with invisible holes.
4. NEVER propagate the exception and terminate the whole workflow over one recoverable failure.
5. In synthesis output, mark which findings are well-supported and which topic areas have gaps due to unavailable sources (coverage annotations). Honest uncertainty beats false completeness.

### Acceptance Criteria
- Subagent failures propagate structured error context (failure type, attempted query, partial results, alternatives) rather than generic statuses.
- The coordinator can make an informed recovery choice: retry with a modified query, try an alternative source, or proceed with partials while annotating the coverage gap.
- Empty results are never returned as success (no silent suppression).
- One recoverable failure does not terminate the whole workflow.
- Synthesis output includes coverage annotations distinguishing well-supported findings from gaps caused by unavailable sources.

### Full code
```python
"""
Domain 5 · Task 5.3 — Error propagation across multi-agent systems.

THE BIG IDEA
============
When a subagent fails (e.g., a web-search timeout), WHAT FLOWS BACK to the coordinator
determines whether intelligent recovery is possible.

  CORRECT: Structured error context — failure type, attempted query, partial results,
           alternative approaches. The coordinator can then retry-modified, try an
           alternative source, or proceed with partials and ANNOTATE the gap.

  ANTI-PATTERNS:
   - Retry internally, then return a GENERIC "search unavailable" — local retries are good,
     but the generic status hides everything the coordinator needs.
   - Return EMPTY results marked as SUCCESS — silent suppression; the report ships with
     invisible holes.
   - Propagate the exception and TERMINATE the whole workflow — one recoverable failure
     kills the entire run.

COVERAGE ANNOTATIONS: synthesis output should mark which findings are well-supported and
which topic areas have gaps due to unavailable sources. Honest uncertainty beats false
completeness. (This is official sample question Q8.)
"""

import sys, pathlib, json
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[2]))
from ccarch import banner, concept, h1, h2, wrong, right, tip, note, kv, code, rule, pause, analogy, pitfall


GOOD_PROPAGATION = {
    "status": "partial_failure",
    "failure_type": "timeout",
    "attempted_query": "AI adoption in film production 2024",
    "partial_results": ["1 source retrieved before timeout"],
    "alternatives": ["retry with narrower query", "try industry-report source"],
}


def coordinator_decide(report: dict) -> str:
    if report.get("status") == "partial_failure":
        return ("Retry with a modified query, OR proceed with partials and annotate the "
                "coverage gap — an INFORMED choice.")
    return "Proceed."


def main():
    banner("Domain 5 · Task 5.3", "Error propagation across agents")
    concept("Domain 5: Context Management & Reliability (15%)",
            "Task 5.3 — Implement error propagation strategies across multi-agent systems",
            "Structured error context enables intelligent recovery")

    h1("The CORRECT approach (sample Q8): structured error context")
    code(json.dumps(GOOD_PROPAGATION, indent=2), "what flows back to the coordinator")
    right(f"Coordinator can act: {coordinator_decide(GOOD_PROPAGATION)}")

    pause("the three anti-patterns")
    rule()
    h1("The three anti-patterns")
    h2("1) Retry internally, then return generic 'search unavailable'")
    wrong("Local retries are GOOD, but the GENERIC status hides the query, partials, and "
          "alternatives the coordinator needs.")
    h2("2) Return empty results marked as success")
    wrong("Silent suppression. The final report ships with invisible holes — the worst "
          "outcome because nobody knows data is missing.")
    h2("3) Propagate the exception, terminate the whole workflow")
    wrong("One recoverable failure kills the entire research run. Massive over-reaction.")

    pause("coverage annotations")
    rule()
    h1("Coverage annotations in synthesis")
    code('{\n'
         '  "well_supported": ["AI in music", "AI in writing"],\n'
         '  "coverage_gaps": ["AI in film — source timed out, NOT researched"]\n'
         '}', "honest uncertainty")
    right("Mark which findings are well-supported and which areas have gaps from "
          "unavailable sources. Honest uncertainty beats false completeness.")

    rule()
    h1("Plain-language analogy & the common confusion")
    analogy("When a scout cannot reach a town, the useful radio call is 'road washed out at mile 12, tried the north route, have a partial map' — not silence, not 'mission failed,' and not faking 'town is empty.' Structured context lets HQ decide.")
    pitfall("Three anti-patterns feel safe but are not: a generic 'unavailable' (hides what HQ needs), empty-as-success (ships a report with silent holes), and killing the whole run for one recoverable failure. Pass structured context up instead.")

    tip("CORRECT = structured error context (type, query, partials, alternatives). "
        "Generic status hides; empty-as-success suppresses; full termination overreacts. "
        "Local retry first, propagate only the unresolved WITH context.")


if __name__ == "__main__":
    main()
```

## Task 5.4 — Context management in large codebase exploration

**Source:** https://github.com/jacinthpaul/Claude-Certified-Architect/blob/claude/architect-exam-codebase-7ytdjz/domains/domain5_context_reliability/task5_4_large_codebase.py

### Objective
Manage context effectively in large codebase exploration.

### Concept
External memory + delegation keep the main context clean. Recognize context degradation (answering from "typical patterns" instead of the specific classes discovered earlier). Toolkit: scratchpad files (external memory), delegate verbose investigations to subagents (summaries only), phase summaries injected into subagent context, crash recovery via manifests (structured state to a known location), /compact.

### Instructions
1. RECOGNIZE CONTEXT DEGRADATION: in long sessions the model starts answering from "typical patterns" instead of the specific classes it actually discovered earlier — a sign its working memory has been squeezed. Treat it as a signal to externalize memory and/or /compact — don't trust answers drawn from "typical patterns."
2. SCRATCHPAD FILES: have the agent write key findings to a file and consult it later — external memory that survives context pressure.
3. DELEGATE the verbose work: spawn subagents for noisy investigations ("find all test files", "trace refund-flow deps") so only SUMMARIES return to the main agent.
4. PHASE SUMMARIES: summarize each exploration phase before spawning the next phase's subagents, injecting the summary into their initial context.
5. CRASH RECOVERY via MANIFESTS: each agent exports structured state to a known location; on resume, the coordinator loads the manifest and injects it — no restart from zero.
6. /compact condenses the conversation when verbose discovery fills the context.

### Acceptance Criteria
- Context degradation is recognized early: answers drawn from "typical patterns" instead of the specific classes discovered earlier are treated as a warning signal.
- Key findings are persisted to scratchpad files (external memory) that survive context pressure and are consulted later.
- Verbose investigations are delegated to subagents, with only their summaries returning to the main agent.
- Each exploration phase is summarized before the next phase's subagents spawn, with the summary injected into their initial context.
- Agents export structured state (manifests) to a known location so a crash can be recovered by loading the manifest — no restart from zero.
- /compact is used when verbose discovery output fills the context.

### Full code
```python
"""
Domain 5 · Task 5.4 — Context management in large codebase exploration.

THE BIG IDEA
============
  * RECOGNIZE CONTEXT DEGRADATION: in long sessions the model starts answering from
    "typical patterns" instead of the specific classes it actually discovered earlier — a
    sign its working memory has been squeezed.
  * SCRATCHPAD FILES: have the agent write key findings to a file and consult it later —
    external memory that survives context pressure.
  * DELEGATE the verbose work: spawn subagents for noisy investigations ("find all test
    files", "trace refund-flow deps") so only SUMMARIES return to the main agent.
  * PHASE SUMMARIES: summarize each exploration phase before spawning the next phase's
    subagents, injecting the summary into their initial context.
  * CRASH RECOVERY via MANIFESTS: each agent exports structured state to a known location;
    on resume, the coordinator loads the manifest and injects it — no restart from zero.
  * /compact condenses the conversation when verbose discovery fills the context.
"""

import sys, pathlib, json
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[2]))
from ccarch import banner, concept, h1, h2, wrong, right, tip, note, kv, code, rule, pause, analogy, pitfall


def main():
    banner("Domain 5 · Task 5.4", "Large codebase exploration")
    concept("Domain 5: Context Management & Reliability (15%)",
            "Task 5.4 — Manage context effectively in large codebase exploration",
            "External memory + delegation keep the main context clean")

    h1("Recognize context degradation")
    wrong("After a long session, the agent describes 'a typical repository pattern' instead "
          "of the SPECIFIC classes it found earlier. Its working memory got squeezed.")
    right("Treat that as a signal to externalize memory and/or /compact — don't trust "
          "answers drawn from 'typical patterns'.")

    pause("the toolkit")
    rule()
    h1("The toolkit for surviving huge codebases")
    h2("Scratchpad files (external memory)")
    code('write_file("findings.md", "RefundService lives in services/refund.py; "\n'
         '                          "calls billing.charge() and ledger.append()")',
         "persist findings, consult later")

    h2("Delegate verbose investigations to subagents")
    note("Spawn a subagent for 'find all test files' or 'trace refund-flow dependencies'. "
         "Only its SUMMARY returns to the main agent, preserving clean coordination.")

    h2("Phase summaries")
    note("Summarize phase 1 (structure mapping) BEFORE spawning phase 2 subagents; inject "
         "that summary into their initial context.")

    h2("Crash recovery via manifests")
    code(json.dumps({"agent": "dep-tracer", "completed": ["payments", "billing"],
                     "next": "ledger", "findings_file": "findings.md"}, indent=2),
         "manifest written to a known location")
    right("On resume, the coordinator loads the manifest and injects it — no restart from zero.")

    h2("/compact")
    note("Condenses the conversation when extended exploration fills context with verbose "
         "discovery output.")

    rule()
    h1("Plain-language analogy & the common confusion")
    analogy('Exploring a huge building, you jot notes in a notebook (a scratchpad file) and send scouts down side corridors who report back one-line summaries — you do not try to hold every room in your head at once.')
    pitfall("The warning sign of context overload: the agent starts describing 'a typical setup' instead of the SPECIFIC classes it found earlier. When you see that, externalize to a scratchpad or /compact — do not trust those vague answers.")

    tip("Symptoms of degradation = answers from 'typical patterns'. Cures: scratchpad "
        "files, delegate verbose work (summaries only), phase summaries, manifests, /compact.")


if __name__ == "__main__":
    main()
```

## Task 5.5 — Human review workflows and confidence calibration

**Source:** https://github.com/jacinthpaul/Claude-Certified-Architect/blob/claude/architect-exam-codebase-7ytdjz/domains/domain5_context_reliability/task5_5_human_review.py

### Objective
Design human review workflows and confidence calibration.

### Concept
Validate by segment; route by calibrated confidence; audit the fast lane. Aggregate metrics hide pockets of failure ("97% overall accuracy" can mask 60% on one document type or field). Stratified random sampling keeps auditing high-confidence extractions. Calibrated confidence routing: field-level confidence scores, thresholds calibrated against a labeled validation set, route low-confidence or ambiguous/contradictory-source extractions to humans.

### Instructions
1. Validate accuracy BY DOCUMENT TYPE AND FIELD SEGMENT before automating anything — aggregate metrics hide pockets of failure (e.g., "97% overall accuracy" masking 60% on one document type or field).
2. Calibrated confidence routing: have the model output FIELD-LEVEL confidence scores, CALIBRATE thresholds against a labeled validation set, then route low-confidence or ambiguous/contradictory-source extractions to humans.
3. Stratified random sampling: keep auditing samples from HIGH-confidence extractions too — it measures the true error rate where you've stopped looking and catches novel error patterns early.

### Acceptance Criteria
- Accuracy is validated by document type AND by field segment, not just an aggregate average (a "97%" headline can hide a 60% pocket).
- The model outputs field-level confidence scores; routing thresholds are calibrated against a labeled validation set.
- Low-confidence or ambiguous/contradictory-source extractions are routed to humans.
- Random audits continue on high-confidence extractions (stratified sampling) to measure the true error rate and catch new error patterns early.

### Full code
```python
"""
Domain 5 · Task 5.5 — Human review workflows and confidence calibration.

THE BIG IDEA
============
  * AGGREGATE METRICS HIDE POCKETS OF FAILURE: "97% overall accuracy" can mask 60% on one
    document type or field. Validate accuracy BY DOCUMENT TYPE AND FIELD SEGMENT before
    automating anything.
  * STRATIFIED RANDOM SAMPLING: keep auditing samples from HIGH-confidence extractions too
    — it measures the true error rate where you've stopped looking and catches novel error
    patterns early.
  * CALIBRATED CONFIDENCE ROUTING: have the model output FIELD-LEVEL confidence scores,
    CALIBRATE thresholds against a labeled validation set, then route low-confidence or
    ambiguous/contradictory-source extractions to humans.

Analogy: airport security — most travelers take standard screening (high-confidence), a
calibrated system selects some for extra checks (low-confidence routing), and RANDOM audits
of the fast lane (stratified sampling) verify the system itself still works.
"""

import sys, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[2]))
from ccarch import banner, concept, h1, h2, wrong, right, tip, note, kv, code, rule, pause, analogy, pitfall


def route(field_confidence: float, threshold: float, contradictory: bool):
    if contradictory:
        return "HUMAN (contradictory sources)"
    return "HUMAN (low confidence)" if field_confidence < threshold else "AUTO-ACCEPT"


def main():
    banner("Domain 5 · Task 5.5", "Human review & confidence calibration")
    concept("Domain 5: Context Management & Reliability (15%)",
            "Task 5.5 — Design human review workflows and confidence calibration",
            "Validate by segment; route by calibrated confidence; audit the fast lane")

    h1("Aggregate metrics hide pockets of failure")
    wrong('Trusting "97% overall accuracy" and automating everything.')
    note("Hidden inside that 97%:")
    kv("  invoices", "99%")
    kv("  handwritten receipts", "60%   <-- the pocket the average hides")
    right("Validate accuracy BY document type AND BY field before automating.")

    pause("confidence routing")
    rule()
    h1("Calibrated confidence routing")
    threshold = 0.80
    samples = [
        ("vendor", 0.97, False),
        ("amount", 0.55, False),
        ("date", 0.91, False),
        ("total", 0.88, True),    # sources disagree
    ]
    note(f"Threshold (calibrated against a labeled validation set): {threshold}")
    for field, conf, contra in samples:
        kv(f"  {field} (conf={conf}, contradictory={contra})", route(conf, threshold, contra))
    right("Route low-confidence OR ambiguous/contradictory extractions to humans — spend "
          "scarce reviewer capacity where it matters most.")
    code(
        '''def route(field_confidence, threshold=0.80, contradictory=False):
    if contradictory:                 # sources disagree -> always a human
        return "HUMAN (contradictory sources)"
    if field_confidence < threshold:  # threshold calibrated on labeled data
        return "HUMAN (low confidence)"
    return "AUTO-ACCEPT"              # + audit a random sample of these''',
        "confidence routing, in code")

    pause("stratified sampling")
    rule()
    h1("Stratified random sampling — audit the fast lane")
    wrong("Only reviewing the LOW-confidence pile. You go blind to errors hiding in the "
          "'trusted' high-confidence lane.")
    right("Keep auditing random samples of HIGH-confidence extractions too. It measures the "
          "true error rate where you stopped looking and catches NEW error patterns early.")

    note("\nAnalogy: airport security — standard screening (high-conf), selective extra "
         "checks (low-conf routing), random audits of the fast lane (stratified sampling).")

    rule()
    h1("Plain-language analogy & the common confusion")
    analogy('Airport security: most travelers flow through standard screening (high confidence), a calibrated system flags some for extra checks (low-confidence routing), and random audits of the fast lane (stratified sampling) keep the trusted lane honest.')
    pitfall("A headline '97% accurate' feels safe to automate, but that average can hide a 60% pocket on one document type. Validate accuracy by type AND by field before trusting it — and keep auditing the high-confidence lane too.")

    tip("Aggregate accuracy lies — segment by type & field. Calibrate thresholds on labeled "
        "data. Route low-conf/contradictory to humans. Audit the high-conf lane to stay honest.")


if __name__ == "__main__":
    main()
```

## Task 5.6 — Information provenance and uncertainty in multi-source synthesis

**Source:** https://github.com/jacinthpaul/Claude-Certified-Architect/blob/claude/architect-exam-codebase-7ytdjz/domains/domain5_context_reliability/task5_6_provenance.py

### Objective
Preserve information provenance and handle uncertainty in multi-source synthesis.

### Concept
Force claim-source mappings; conflicts & temporal traps. Attribution dies in summarization unless you force structure: subagents must output CLAIM-SOURCE MAPPINGS (claim + source URL/doc name + relevant excerpt) that downstream agents are REQUIRED to preserve and merge. Conflicting statistics: annotate with BOTH values and sources, never arbitrarily pick one. Temporal traps: 2021 vs 2024 figures are a trend, not a contradiction. Report structure: separate well-established from contested findings. Render content natively (tables, prose, lists).

### Instructions
1. Force CLAIM-SOURCE MAPPINGS: subagents must output claim + source URL/doc name + relevant excerpt, and downstream agents are REQUIRED to preserve and merge them — non-negotiable for cited reports.
2. CONFLICTING STATISTICS from credible sources: annotate the conflict with BOTH values and their sources — never arbitrarily pick one. Let the coordinator decide reconciliation.
3. TEMPORAL TRAPS: a 2021 figure and a 2024 figure are NOT a "contradiction" — they're a trend. Require publication/collection DATES in structured outputs.
4. REPORT STRUCTURE: explicitly separate well-established findings from contested ones, preserving each source's characterization and methodology.
5. RENDER CONTENT NATIVELY: financial data as tables, news as prose, technical findings as structured lists — don't flatten everything into one uniform format.

### Acceptance Criteria
- Subagents output claim-source mappings (claim + source URL/name + excerpt) that downstream agents preserve and merge; attribution survives summarization.
- Conflicting statistics from credible sources are annotated with BOTH values and their sources; the coordinator decides reconciliation, and nothing is arbitrarily dropped.
- Publication/collection dates are required in structured outputs so different-year figures read as a trend, not a contradiction.
- The final report separates well-established findings from contested ones, preserving each source's characterization and methodology.
- Content is rendered in its native form: financial data as tables, news as prose, technical findings as structured lists.

### Full code
```python
"""
Domain 5 · Task 5.6 — Information provenance and uncertainty in multi-source synthesis.

THE BIG IDEA
============
  * ATTRIBUTION DIES IN SUMMARIZATION unless you force structure: subagents must output
    CLAIM-SOURCE MAPPINGS (claim + source URL/doc name + relevant excerpt) that downstream
    agents are REQUIRED to preserve and merge.
  * CONFLICTING STATISTICS from credible sources: annotate the conflict with BOTH values
    and their sources — never arbitrarily pick one. Let the coordinator decide reconciliation.
  * TEMPORAL TRAPS: a 2021 figure and a 2024 figure are NOT a "contradiction" — they're a
    trend. Require publication/collection DATES in structured outputs.
  * REPORT STRUCTURE: explicitly separate well-established findings from contested ones,
    preserving each source's characterization and methodology.
  * RENDER CONTENT NATIVELY: financial data as tables, news as prose, technical findings as
    structured lists — don't flatten everything into one uniform format.
"""

import sys, pathlib, json
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[2]))
from ccarch import banner, concept, h1, h2, wrong, right, tip, note, kv, code, rule, pause, analogy, pitfall


CLAIM_MAP = {
    "claim": "Global AI market size",
    "values": [
        {"value": "$184B", "source": "Report A", "url": "https://a.example/2024", "year": 2024},
        {"value": "$136B", "source": "Report B", "url": "https://b.example/2021", "year": 2021},
    ],
}


def classify_conflict(values):
    years = {v["year"] for v in values}
    if len(years) > 1:
        return "TREND (different years) — not a contradiction; report as a time series."
    return "CONFLICT (same period) — annotate both values + sources; coordinator reconciles."


def main():
    banner("Domain 5 · Task 5.6", "Provenance & uncertainty in synthesis")
    concept("Domain 5: Context Management & Reliability (15%)",
            "Task 5.6 — Preserve information provenance and handle uncertainty in multi-source synthesis",
            "Force claim-source mappings; conflicts & temporal traps")

    h1("Attribution dies in summarization unless you force structure")
    wrong("Letting subagents return prose. By the time synthesis summarizes it, the source "
          "URLs and page numbers are gone — citations can't be reconstructed.")
    code('{"claim": "...", "source_url": "...", "source_name": "...", "excerpt": "..."}',
         "required claim-source mapping")
    right("Subagents MUST output claim-source mappings that downstream agents PRESERVE and "
          "merge — non-negotiable for cited reports.")

    pause("conflicts vs trends")
    rule()
    h1("Conflicting statistics — annotate, don't pick")
    code(json.dumps(CLAIM_MAP, indent=2), "two values from credible sources")
    verdict = classify_conflict(CLAIM_MAP["values"])
    right(f"Classification: {verdict}")
    wrong("Arbitrarily picking $184B and dropping the other. You've hidden a real "
          "disagreement (or a trend).")

    rule()
    h1("Temporal traps")
    note("A 2021 figure and a 2024 figure differ because TIME PASSED, not because the "
         "sources disagree.")
    right("Require publication/collection DATES in structured outputs so a trend isn't "
          "misread as a contradiction.")

    pause("report structure")
    rule()
    h1("Report structure & native rendering")
    right("Separate WELL-ESTABLISHED findings from CONTESTED ones; preserve each source's "
          "characterization and methodology.")
    right("Render natively: financial data as TABLES, news as PROSE, technical findings as "
          "LISTS. Don't flatten everything into one uniform format.")

    rule()
    h1("Plain-language analogy & the common confusion")
    analogy("Synthesizing without keeping sources is like merging everyone's notes and shredding the footnotes — the claims survive but you can no longer say who proved what. Carry the source with each claim, like a name tag that never comes off.")
    pitfall('A 2021 figure and a 2024 figure look like a contradiction but are usually a TREND. Without dates attached, the model misreads the passage of time as disagreement. Require publication dates in structured outputs.')

    tip("Force claim-source mappings end to end. Annotate conflicts with BOTH sources. "
        "Include dates so different-year figures read as a trend, not a contradiction.")


if __name__ == "__main__":
    main()
```
