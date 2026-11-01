# CCAR-F Exam Scripts — Domain 4: Prompt Engineering & Structured Output

## Domain Overview

Source: https://github.com/jacinthpaul/Claude-Certified-Architect/blob/claude/architect-exam-codebase-7ytdjz/domains/domain4_prompt_output/README.md

# Domain 4 — Prompt Engineering & Structured Output (20%)

Precise, consistent, machine-readable output: explicit criteria, worked examples,
schema-enforced structure, validation loops, batch economics, and review architectures.

| Task | Demo | One-line idea |
|---|---|---|
| 4.1 Design prompts with explicit criteria to improve precision and reduce false positives | `task4_1_explicit_criteria.py` | Specific categories > vague "be conservative" |
| 4.2 Apply few-shot prompting to improve output consistency and quality | `task4_2_few_shot.py` | 2–4 examples teach judgment prose can't (run live!) |
| 4.3 Enforce structured output using tool use and JSON schemas | `task4_3_structured_output_schema.py` | Tool-use schema; nullable prevents fabrication |
| 4.4 Implement validation, retry, and feedback loops for extraction quality | `task4_4_validation_retry.py` | Retry WITH errors; futile when info is absent |
| 4.5 Design efficient batch processing strategies | `task4_5_batch_processing.py` | 50% cheaper, ≤24h, NO latency SLA |
| 4.6 Design multi-instance and multi-pass review architectures | `task4_6_multi_pass_review.py` | Fresh eyes + per-file passes |

```bash
python3 run_all.py domain4
```

**The single most important schema fact:** required fields cause fabrication — make
uncertain fields **nullable** so the model can honestly emit `null`.

---

## Task 4.1 — Explicit criteria to reduce false positives

**Source:** https://github.com/jacinthpaul/Claude-Certified-Architect/blob/claude/architect-exam-codebase-7ytdjz/domains/domain4_prompt_output/task4_1_explicit_criteria.py

### Objective

Design prompts with explicit criteria to improve precision and reduce false positives. Specific categorical criteria > vague modifiers.

### Concept

Vague instructions produce vague judgment. "Check that comments are accurate" invites noise; "flag comments only when the claimed behavior CONTRADICTS the actual code behavior" is testable and precise.

- "Be conservative" / "only report high-confidence findings" does NOT work — general modifiers fail to improve precision. SPECIFIC CATEGORICAL criteria do: report bugs and security issues; skip minor style and local patterns.
- FALSE POSITIVES are trust killers: one noisy category undermines confidence in the accurate categories too. Tactical move: temporarily DISABLE the noisy category while you improve its prompt.
- SEVERITY needs ANCHORS: define each level with concrete code examples.

Analogy: a guard told "report anything suspicious" floods you with junk. Told "report propped-open doors after 8pm and unbadged people in the server room," reports become rare and worth acting on.

### Instructions

- Vague vs precise instruction: `"Check that comments are accurate."` (invites noise) vs `"Flag a comment ONLY when the claimed behavior contradicts the actual code behavior."` (testable, precise).
- Why "be conservative" fails: general modifiers don't move precision — the model has no concrete boundary to apply. Use specific CATEGORICAL criteria: REPORT bugs and security issues; SKIP minor style and purely-local patterns.
- False positives are trust killers: if one category (say, 'style') is noisy, developers start ignoring ALL findings. Tactically DISABLE the noisy category while you improve its prompt.
- Severity needs concrete anchors: CRITICAL (remote code execution, auth bypass, data loss — e.g., `eval(user_input)`; SQL built by string concatenation), HIGH (crash on common input, unhandled error path — e.g., indexing a list without a length check on user data), LOW (naming, formatting — often SKIP in automated review). Anchor each severity level with example code for consistent classification across files and runs.

### Acceptance Criteria

Not present as a separate section in the module docstring. The demo walks through vague vs precise instructions, why "be conservative" fails, false-positive trust poisoning, and severity anchors; see the full code below.

### Full code

```python
"""
Domain 4 · Task 4.1 — Explicit criteria to reduce false positives.

THE BIG IDEA
============
Vague instructions produce vague judgment. "Check that comments are accurate" invites
noise; "flag comments only when the claimed behavior CONTRADICTS the actual code behavior"
is testable and precise.

  * "Be conservative" / "only report high-confidence findings" does NOT work — general
    modifiers fail to improve precision. SPECIFIC CATEGORICAL criteria do: report bugs and
    security issues; skip minor style and local patterns.
  * FALSE POSITIVES are trust killers: one noisy category undermines confidence in the
    accurate categories too. Tactical move: temporarily DISABLE the noisy category while
    you improve its prompt.
  * SEVERITY needs ANCHORS: define each level with concrete code examples.

Analogy: a guard told "report anything suspicious" floods you with junk. Told "report
propped-open doors after 8pm and unbadged people in the server room," reports become rare
and worth acting on.
"""

import sys, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[2]))
from ccarch import banner, concept, h1, h2, wrong, right, tip, note, kv, code, rule, pause, analogy, pitfall


def main():
    banner("Domain 4 · Task 4.1", "Explicit criteria reduce false positives")
    concept("Domain 4: Prompt Engineering & Structured Output (20%)",
            "Task 4.1 — Design prompts with explicit criteria to improve precision and reduce false positives",
            "Specific categorical criteria > vague modifiers")

    h1("Vague vs precise instruction")
    wrong('"Check that comments are accurate."  (invites noise — every comment is a maybe)')
    right('"Flag a comment ONLY when the claimed behavior contradicts the actual code '
          'behavior."  (testable, precise)')

    pause("why 'be conservative' fails")
    rule()
    h1("Why 'be conservative' fails")
    wrong('"Only report high-confidence findings" / "be conservative" — general modifiers '
          "don't move precision. The model has no concrete boundary to apply.")
    right("Specific CATEGORICAL criteria: REPORT bugs and security issues; SKIP minor style "
          "and purely-local patterns. Now the boundary is decidable.")

    rule()
    h1("False positives are trust killers")
    note("If one category (say, 'style') is noisy, developers start ignoring ALL findings — "
         "even the accurate bug/security categories.")
    right("Tactical move: temporarily DISABLE the noisy category while you improve its "
          "prompt, so it doesn't poison trust in the rest.")

    pause("severity anchors")
    rule()
    h1("Severity needs concrete anchors")
    code("CRITICAL: remote code execution, auth bypass, data loss\n"
         "  e.g., `eval(user_input)`; SQL built by string concatenation\n"
         "HIGH:     crash on common input, unhandled error path\n"
         "  e.g., indexing a list without a length check on user data\n"
         "LOW:      naming, formatting (often SKIP in automated review)",
         "severity rubric with examples")
    right("Anchor each severity level with example code -> consistent classification "
          "across files and runs.")

    rule()
    h1("Plain-language analogy & the common confusion")
    analogy("A guard told 'report anything suspicious' drowns you in junk; told 'report propped-open doors after 8pm and unbadged people in the server room', the reports become rare and worth acting on. Specific criteria are those instructions.")
    pitfall("'Be conservative' and 'only high-confidence findings' feel like they should reduce noise. They do not — the model has no concrete boundary. Specific categories ('report bugs and security; skip style') are what actually cut false positives.")

    tip("Replace vague modifiers with specific categories + severity anchors. A noisy "
        "category? Disable it while you fix it. (This logic powers scenario 5 CI review.)")


if __name__ == "__main__":
    main()
```

---

## Task 4.2 — Few-shot prompting

**Source:** https://github.com/jacinthpaul/Claude-Certified-Architect/blob/claude/architect-exam-codebase-7ytdjz/domains/domain4_prompt_output/task4_2_few_shot.py

### Objective

Apply few-shot prompting to improve output consistency and quality. 2-4 worked examples teach judgment that prose can't.

### Concept

Include 2-4 worked examples in the prompt showing input -> correct output. This is the most effective technique when detailed INSTRUCTIONS alone still produce inconsistent results, because the model generalizes the DEMONSTRATED judgment to novel cases — it doesn't just match the literal examples.

The invoice-extraction examples below teach, silently and reliably:

- normalization (strip $ and commas, expand/standardize dates), and
- the single most important behavior: when info is genuinely MISSING, write null — do NOT invent a number.

Where few-shot shines (per the guide): ambiguous-case handling, format consistency, false-positive reduction, and hallucination reduction in extraction (including null handling).

### Instructions

- Include 2-4 worked examples of input -> correct output. Example 1 silently teaches 3 normalization rules (strip $/comma, expand the date, standard format). Example 2 teaches the MOST important rule: missing info -> null, never invent.
- Reach for few-shot when DETAILED INSTRUCTIONS still give inconsistent results. Always include an example of the hard/edge case (the null case).
- Where few-shot shines (per the exam guide):
  - Ambiguous-case handling: show the REASONING for the chosen action vs the alternative.
  - Format consistency: demonstrate the exact output shape.
  - False-positive reduction: pair acceptable patterns WITH genuine issues to teach the boundary.
  - Hallucination reduction: show extraction from varied structures (inline citations vs bibliographies, narrative vs tabular), including correct null handling.
- The model generalizes the DEMONSTRATED judgment — it does not just copy the literal examples — so the examples must cover the boundary case you care about (write null, do not invent a value).

### Acceptance Criteria

Not present as a separate section in the module docstring. The demo builds a few-shot prompt, runs it through an offline simulator (`simulator()` imitates a model that has LEARNED the demonstrated null-handling rule), and prints the model's JSON output; see the full code below.

### Full code

```python
"""
Domain 4 · Task 4.2 — Few-shot prompting.

THE BIG IDEA
============
Include 2-4 worked examples in the prompt showing input -> correct output. This is the
most effective technique when detailed INSTRUCTIONS alone still produce inconsistent
results, because the model generalizes the DEMONSTRATED judgment to novel cases — it
doesn't just match the literal examples.

The invoice-extraction examples below teach, silently and reliably:
  * normalization (strip $ and commas, expand/standardize dates), and
  * the single most important behavior: when info is genuinely MISSING, write null —
    do NOT invent a number.

Where few-shot shines (per the guide): ambiguous-case handling, format consistency,
false-positive reduction, and hallucination reduction in extraction (including null handling).
"""

import sys, pathlib, json
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[2]))
from ccarch import banner, concept, h1, h2, wrong, right, tip, note, kv, code, rule, pause, analogy, pitfall
from ccarch import ClaudeClient, LLMResponse


FEW_SHOT = [
    ('Pd $1,200.50 to Acme Corp on 3/4/25',
     {"vendor": "Acme Corp", "amount": 1200.50, "date": "2025-03-04"}),
    ('Invoice received from Beta LLC, amount to be confirmed',
     {"vendor": "Beta LLC", "amount": None, "date": None}),
]


def build_prompt(new_input: str) -> str:
    lines = ["Extract invoice fields as JSON. Follow the examples exactly.\n"]
    for i, (inp, out) in enumerate(FEW_SHOT, 1):
        lines.append(f"Example {i}\nInput:  {inp!r}\nOutput: {json.dumps(out)}\n")
    lines.append(f"Now do this one.\nInput:  {new_input!r}\nOutput:")
    return "\n".join(lines)


def simulator(system, messages, tools) -> LLMResponse:
    """Offline: imitate a model that has LEARNED the demonstrated null-handling rule."""
    text = messages[-1]["content"]
    if "to be confirmed" in text or "TBD" in text:
        out = {"vendor": "Gamma Inc", "amount": None, "date": None}
    else:
        out = {"vendor": "Delta Co", "amount": 89.99, "date": "2025-01-15"}
    return LLMResponse(text=json.dumps(out), stop_reason="end_turn")


def main():
    banner("Domain 4 · Task 4.2", "Few-shot prompting — show, don't tell")
    concept("Domain 4: Prompt Engineering & Structured Output (20%)",
            "Task 4.2 — Apply few-shot prompting to improve output consistency and quality",
            "2-4 worked examples teach judgment that prose can't")

    h1("What few-shot actually looks like")
    for i, (inp, out) in enumerate(FEW_SHOT, 1):
        h2(f"Example {i}")
        kv("  input", inp)
        kv("  output", json.dumps(out))
    note("Example 1 silently teaches 3 normalization rules (strip $/comma, expand the "
         "date, standard format). Example 2 teaches the MOST important rule: missing info "
         "-> null, never invent.")
    code(
        '''prompt = """Extract invoice fields as JSON. Follow the examples exactly.

Input:  'Pd $1,200.50 to Acme Corp on 3/4/25'
Output: {"vendor": "Acme Corp", "amount": 1200.50, "date": "2025-03-04"}

Input:  'Invoice from Beta LLC, amount to be confirmed'
Output: {"vendor": "Beta LLC", "amount": null, "date": null}   # <- teaches null

Input:  '<the new invoice>'
Output:"""                                  # model continues the pattern''',
        "few-shot inside the prompt")

    pause("run it")
    rule()
    h1("Run the few-shot prompt on a new input")
    client = ClaudeClient()
    kv("client mode", client.mode)
    new_input = "Charge from Gamma Inc, total to be confirmed next week"
    resp = client.complete("You extract invoice JSON.",
                           [{"role": "user", "content": build_prompt(new_input)}],
                           simulator=simulator)
    kv("  input", new_input)
    kv("  model output", resp.text + ("  (simulated)" if resp.simulated else "  (live)"))
    right("Because Example 2 demonstrated null, the model writes amount: null instead of "
          "fabricating a number — the boundary no paragraph of prose conveys as reliably.")

    rule()
    h1("Where few-shot shines (per the exam guide)")
    note("- Ambiguous-case handling: show the REASONING for the chosen action vs the alternative.")
    note("- Format consistency: demonstrate the exact output shape.")
    note("- False-positive reduction: pair acceptable patterns WITH genuine issues to teach "
         "the boundary.")
    note("- Hallucination reduction: show extraction from varied structures (inline "
         "citations vs bibliographies, narrative vs tabular), including correct null handling.")

    rule()
    h1("Plain-language analogy & the common confusion")
    analogy('Few-shot is showing a new cook two finished plates, not reciting the recipe — and you make sure one plate is the tricky case (a missing field becomes null), so they learn the edge, not just the happy path.')
    pitfall('Beginners think the model just copies the literal examples. It generalizes the DEMONSTRATED judgment — so the examples must cover the boundary case you care about, especially: write null, do not invent a value.')

    tip("Reach for few-shot when DETAILED INSTRUCTIONS still give inconsistent results. "
        "2-4 examples; always include an example of the hard/edge case (the null case).")


if __name__ == "__main__":
    main()
```

---

## Task 4.3 — Structured output via tool use and JSON schemas

**Source:** https://github.com/jacinthpaul/Claude-Certified-Architect/blob/claude/architect-exam-codebase-7ytdjz/domains/domain4_prompt_output/task4_3_structured_output_schema.py

### Objective

Enforce structured output using tool use and JSON schemas. Tool input_schema = output contract; nullable prevents fabrication.

### Concept

THE RELIABLE TRICK: to get guaranteed schema-compliant JSON, define a "tool" whose INPUT PARAMETERS ARE your desired output schema, and read the data from the model's tool_use call. This eliminates JSON SYNTAX errors entirely.

THE LIMIT: schemas eliminate SYNTAX errors but NOT SEMANTIC errors — line items that don't sum to the total, or values in the wrong field, still happen and need validation (Task 4.4).

SCHEMA DESIGN RULES that prevent hallucination:

- Make fields NULLABLE/optional when sources may genuinely lack the info. If a field is REQUIRED, the model will FABRICATE a value to satisfy the schema — the single most important schema-design fact on the exam.
- EXTENSIBLE ENUMS: add "unclear" for ambiguous cases and "other" + a free-text detail field, so real-world variety isn't force-fit into wrong categories.
- Pair NORMALIZATION rules with strict schemas (how to standardize dates/currencies).
- Combine with tool_choice (Task 2.3): "any" guarantees structured output when the doc type (hence schema) is unknown; forced selection guarantees a specific extraction runs.

### Instructions

- The trick: the tool's `input_schema` IS your output contract. Read the data from the model's tool_use call — no free-form JSON text means no JSON SYNTAX errors, ever.
- The limit you MUST know: a schema guarantees well-formed data, not CORRECT data. Schema-valid but SEMANTICALLY wrong examples: `{"line_items": [10, 20], "total": 35}` (10+20 != 35) and `{"vendor": "2025-03-04", "date": "Acme"}` (values in the wrong fields). Schemas kill syntax errors; you still need VALIDATION + retry for semantics (Task 4.4).
- The single most important schema-design fact: marking `amount` REQUIRED forces the model to FABRICATE a value when the document genuinely lacks an amount. Make fields NULLABLE/optional so the model can honestly emit null instead of inventing.
- Extensible enums: add "unclear" for ambiguous cases and "other" + a free-text detail field. Real-world variety stops getting force-fit into wrong categories.
- Combine with tool_choice (Task 2.3): `tool_choice "any"` guarantees SOME structured tool is called when doc type/schema is unknown; forced selection guarantees a SPECIFIC extraction runs first.

### Acceptance Criteria

Not present as a separate section in the module docstring. The demo defines `EXTRACTION_TOOL` (the tool's `input_schema` IS the output contract, with nullable fields and an extensible enum) and prints it as JSON; see the full code below.

### Full code

```python
"""
Domain 4 · Task 4.3 — Structured output via tool use and JSON schemas.

THE BIG IDEA
============
THE RELIABLE TRICK: to get guaranteed schema-compliant JSON, define a "tool" whose INPUT
PARAMETERS ARE your desired output schema, and read the data from the model's tool_use
call. This eliminates JSON SYNTAX errors entirely.

THE LIMIT: schemas eliminate SYNTAX errors but NOT SEMANTIC errors — line items that don't
sum to the total, or values in the wrong field, still happen and need validation (Task 4.4).

SCHEMA DESIGN RULES that prevent hallucination:
  * Make fields NULLABLE/optional when sources may genuinely lack the info. If a field is
    REQUIRED, the model will FABRICATE a value to satisfy the schema — the single most
    important schema-design fact on the exam.
  * EXTENSIBLE ENUMS: add "unclear" for ambiguous cases and "other" + a free-text detail
    field, so real-world variety isn't force-fit into wrong categories.
  * Pair NORMALIZATION rules with strict schemas (how to standardize dates/currencies).
  * Combine with tool_choice (Task 2.3): "any" guarantees structured output when the doc
    type (hence schema) is unknown; forced selection guarantees a specific extraction runs.
"""

import sys, pathlib, json
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[2]))
from ccarch import banner, concept, h1, h2, wrong, right, tip, note, kv, code, rule, pause, analogy, pitfall


# The tool's input_schema IS the output contract.
EXTRACTION_TOOL = {
    "name": "record_invoice",
    "description": "Record the structured fields extracted from an invoice document.",
    "input_schema": {
        "type": "object",
        "properties": {
            "vendor": {"type": "string"},
            # nullable: the model may legitimately not find an amount
            "amount": {"type": ["number", "null"]},
            "currency": {"type": ["string", "null"]},
            "date": {"type": ["string", "null"], "description": "ISO 8601 YYYY-MM-DD"},
            # extensible enum: 'other' + detail prevents force-fitting
            "category": {"type": "string", "enum": ["goods", "services", "unclear", "other"]},
            "category_detail": {"type": ["string", "null"],
                                "description": "Required when category == 'other'"},
        },
        "required": ["vendor", "category"],   # only the ALWAYS-present fields are required
    },
}


def main():
    banner("Domain 4 · Task 4.3", "Structured output via tool use + JSON schema")
    concept("Domain 4: Prompt Engineering & Structured Output (20%)",
            "Task 4.3 — Enforce structured output using tool use and JSON schemas",
            "Tool input_schema = output contract; nullable prevents fabrication")

    h1("The trick: the tool's input_schema IS your output schema")
    code(json.dumps(EXTRACTION_TOOL, indent=2), "extraction tool")
    note("You read the data from the model's tool_use call. No free-form JSON text means "
         "no JSON SYNTAX errors, ever.")

    pause("the limit")
    rule()
    h1("The limit you MUST know")
    wrong("Believing a schema guarantees CORRECT data. It only guarantees well-formed data.")
    note("Schema-valid but SEMANTICALLY wrong examples:")
    code('{"line_items": [10, 20], "total": 35}   # 10+20 != 35  (math wrong)\n'
         '{"vendor": "2025-03-04", "date": "Acme"} # values in the wrong fields',
         "semantic errors a schema won't catch")
    right("Schemas kill syntax errors; you still need VALIDATION + retry for semantics "
          "(Task 4.4).")

    pause("nullable")
    rule()
    h1("The single most important schema-design fact")
    wrong("Marking `amount` REQUIRED. When the document genuinely lacks an amount, the "
          "model FABRICATES one to satisfy the schema.")
    right("Make fields NULLABLE/optional when sources may lack them, so the model can "
          "honestly emit null instead of inventing.")

    rule()
    h1("Extensible enums")
    right('Add "unclear" for ambiguous cases and "other" + a free-text detail field. '
          'Real-world variety stops getting force-fit into wrong categories.')

    rule()
    h1("Combine with tool_choice (Task 2.3)")
    kv('tool_choice "any"', "guarantees SOME structured tool is called when doc type/schema is unknown")
    kv('forced selection', "guarantees a SPECIFIC extraction runs first")

    rule()
    h1("Plain-language analogy & the common confusion")
    analogy('A JSON schema is a form with labeled boxes. It guarantees every box is the right TYPE and present — but it cannot guarantee someone wrote the TRUTH in the boxes. Shape, not correctness.')
    pitfall('The biggest schema mistake: making a field REQUIRED when the document might not contain it. A required field forces the model to FABRICATE a value. Make uncertain fields nullable so it can honestly emit null.')

    tip("Tool use kills SYNTAX errors, not SEMANTIC errors. Required fields cause "
        "fabrication — make uncertain fields nullable. Enums need 'unclear'/'other'+detail.")


if __name__ == "__main__":
    main()
```

---

## Task 4.4 — Validation, retry, and feedback loops

**Source:** https://github.com/jacinthpaul/Claude-Certified-Architect/blob/claude/architect-exam-codebase-7ytdjz/domains/domain4_prompt_output/task4_4_validation_retry.py

### Objective

Implement validation, retry, and feedback loops for extraction quality. Retry WITH specific errors; know when retry is futile.

### Concept

- RETRY-WITH-ERROR-FEEDBACK: on validation failure, send a follow-up containing the original document + the failed extraction + the SPECIFIC validation errors. Specific feedback steers self-correction; blind retries don't.
- KNOW WHEN RETRY IS FUTILE: retries fix FORMAT/STRUCTURAL errors; they can NEVER fix information that is simply ABSENT from the source. Recognizing futile retries is tested.
- SELF-CORRECTING SCHEMA DESIGN: extract `calculated_total` alongside `stated_total` so discrepancies flag themselves; add a `conflict_detected` boolean for inconsistent sources.
- FEEDBACK LOOPS: add a `detected_pattern` field to each finding so you can analyze, across many dismissals, which code constructs drive false positives.

### Instructions

- Retry-with-error-feedback (a real validation loop): on attempt 1 output like `{"line_items": [10.0, 20.0], "stated_total": 35.0, "date": "03/04/2025"}`, validation fails with "line_items sum to 30.0 but stated_total is 35.0" and "date '03/04/2025' is not ISO 8601 (YYYY-MM-DD)". Send back: "Here is the original document, your previous extraction, and these errors: [list them]. Re-extract, fixing exactly these issues." Specific feedback steers self-correction; a blind 'try again' would not.
- Know when retry is FUTILE: a field is missing because the value lives in an EXTERNAL document you didn't provide. Retrying forever on absent information can never make it appear — retries fix FORMAT/STRUCTURE. For ABSENT info: emit null and route to a human or fetch the missing source.
- Self-correcting schema design: extract BOTH `stated_total` and `calculated_total` so mismatches self-flag, and add `conflict_detected: false/true` when the source is internally inconsistent. Make the data reveal its own inconsistencies instead of hoping a human notices.
- Feedback loops for review systems: add a `detected_pattern` field to each finding. When developers dismiss findings, analyze WHICH code constructs drive false positives — systematically, not anecdotally.

### Acceptance Criteria

Not present as a separate section in the module docstring. The demo includes a `validate(extraction)` function returning specific, actionable validation errors, and `is_futile(missing_field_absent_from_source)` encoding the key judgment that no retry can conjure absent info; see the full code below.

### Full code

```python
"""
Domain 4 · Task 4.4 — Validation, retry, and feedback loops.

THE BIG IDEA
============
  * RETRY-WITH-ERROR-FEEDBACK: on validation failure, send a follow-up containing the
    original document + the failed extraction + the SPECIFIC validation errors. Specific
    feedback steers self-correction; blind retries don't.
  * KNOW WHEN RETRY IS FUTILE: retries fix FORMAT/STRUCTURAL errors; they can NEVER fix
    information that is simply ABSENT from the source. Recognizing futile retries is tested.
  * SELF-CORRECTING SCHEMA DESIGN: extract calculated_total alongside stated_total so
    discrepancies flag themselves; add a conflict_detected boolean for inconsistent sources.
  * FEEDBACK LOOPS: add a detected_pattern field to each finding so you can analyze, across
    many dismissals, which code constructs drive false positives.
"""

import sys, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[2]))
from ccarch import banner, concept, h1, h2, wrong, right, tip, note, kv, code, rule, pause, analogy, pitfall


def validate(extraction: dict):
    """Return a list of specific, actionable validation errors."""
    errors = []
    items = extraction.get("line_items", [])
    stated = extraction.get("stated_total")
    if items and stated is not None:
        calc = round(sum(items), 2)
        if calc != stated:
            errors.append(f"line_items sum to {calc} but stated_total is {stated}")
    if extraction.get("date") and not str(extraction["date"]).count("-") == 2:
        errors.append(f"date {extraction['date']!r} is not ISO 8601 (YYYY-MM-DD)")
    return errors


def is_futile(missing_field_absent_from_source: bool) -> bool:
    # The key judgment: if the info isn't in the source, no retry can conjure it.
    return missing_field_absent_from_source


def main():
    banner("Domain 4 · Task 4.4", "Validation, retry & feedback loops")
    concept("Domain 4: Prompt Engineering & Structured Output (20%)",
            "Task 4.4 — Implement validation, retry, and feedback loops for extraction quality",
            "Retry WITH specific errors; know when retry is futile")

    h1("Retry-with-error-feedback (a real validation loop)")
    bad = {"line_items": [10.0, 20.0], "stated_total": 35.0, "date": "03/04/2025"}
    h2("Attempt 1 output")
    kv("  extraction", str(bad))
    errs = validate(bad)
    wrong("Validation failed:")
    for e in errs:
        note(f"    - {e}")
    h2("Retry message we send back")
    code("Here is the original document, your previous extraction, and these errors:\n"
         f"  - {errs[0]}\n  - {errs[1]}\n"
         "Re-extract, fixing exactly these issues.", "retry-with-feedback")
    good = {"line_items": [10.0, 20.0], "stated_total": 30.0, "date": "2025-03-04"}
    h2("Attempt 2 output")
    kv("  extraction", str(good))
    kv("  validation", "PASS" if not validate(good) else "FAIL")
    right("Specific feedback steers self-correction. A blind 'try again' would not.")

    pause("futile retries")
    rule()
    h1("Know when retry is FUTILE")
    note("A field is missing because the value lives in an EXTERNAL document you didn't provide.")
    kv("  retry will help?", "NO — the info is absent from the source")
    wrong("Retrying forever on absent information. It can never appear; you waste tokens.")
    right("Retries fix FORMAT/STRUCTURE. For ABSENT info: emit null and route to a human or "
          "fetch the missing source. Recognizing this is a tested skill.")

    pause("self-correcting schemas")
    rule()
    h1("Self-correcting schema design")
    code('{\n'
         '  "stated_total": 30.00,\n'
         '  "calculated_total": 30.00,   # extract BOTH so mismatches self-flag\n'
         '  "conflict_detected": false   # true when the source is internally inconsistent\n'
         '}', "schema that flags its own errors")
    right("Make the data reveal its own inconsistencies instead of hoping a human notices.")

    rule()
    h1("Feedback loops for review systems")
    right("Add a detected_pattern field to each finding. When developers dismiss findings, "
          "analyze WHICH code constructs drive false positives — systematically, not anecdotally.")

    rule()
    h1("Plain-language analogy & the common confusion")
    analogy("Retry-with-feedback is handing back a form with the errors circled in red — 'this total does not add up, fix it.' A blind 'do it again' with no marks gets you the same mistake.")
    pitfall('People retry forever on missing data. Retries fix FORMAT and STRUCTURE; they can never conjure information that is not in the source. If the value lives in a document you did not provide, no retry will find it.')

    tip("Retry WITH the specific errors attached. Retry fixes format/structure, never "
        "absent information. Extract calculated_total + stated_total so errors self-flag.")


if __name__ == "__main__":
    main()
```

---

## Task 4.5 — Batch processing strategies

**Source:** https://github.com/jacinthpaul/Claude-Certified-Architect/blob/claude/architect-exam-codebase-7ytdjz/domains/domain4_prompt_output/task4_5_batch_processing.py

### Objective

Design efficient batch processing strategies. Batch = 50% cheaper, <=24h, NO latency SLA.

### Concept

The Message Batches API in one line: 50% CHEAPER, results within UP TO 24 HOURS, NO guaranteed latency SLA, and no multi-turn tool calling within a request.

- Pre-merge code check (developers WAITING) -> SYNCHRONOUS. Blocking; "usually fast" isn't good enough when there's no SLA.
- Overnight technical-debt report -> BATCH. Latency-tolerant; pocket the 50%.
- Weekly compliance audit / nightly tests -> BATCH. Nobody's waiting.

`custom_id` correlates each request with its response — and lets you resubmit ONLY the failed documents (e.g., chunking oversized ones) instead of rerunning the whole batch. (This kills the "batch ordering" misconception in sample Q11.)

SLA MATH: with a 24h batch window, guaranteeing a 30h turnaround means submitting every ~4-6h (the guide's example: 4-hour submission windows guarantee a 30-hour SLA).

REFINE BEFORE YOU SCALE: tune the prompt on a small sample before running 100,000 docs.

### Instructions

- Match each workload to the right API (sample Q11): a blocking pre-merge code check with developers waiting -> SYNCHRONOUS (a human is blocked; no latency SLA is unacceptable). Overnight technical-debt report, weekly compliance audit, nightly test generation -> BATCH (latency-tolerant; take the 50% cost savings).
- Don't switch the BLOCKING pre-merge check to batch "because it's usually fast" — there is NO latency SLA; developers could wait hours.
- `custom_id`: correlate each request with its response (results come back possibly out of order; match them by custom_id) and resubmit ONLY the failures (e.g., chunk a doc that was too large). "Batch result ORDERING" is a misconception — custom_id correlates each request with its response, so out-of-order results are a non-issue.
- SLA math: the batch window is UP TO 24h. To guarantee a 30h end-to-end SLA: `submit_interval = target_sla - max_batch_window`, i.e. 30h - 24h = 6h of slack -> submit at least every ~4-6h.
- Refine before you scale: tune the prompt on a SMALL sample first. First-pass success across 100,000 docs is far cheaper than iterative resubmission.

### Acceptance Criteria

Not present as a separate section in the module docstring. The demo includes a `choose_api(blocking, someone_waiting)` function that returns SYNCHRONOUS when a human is blocked and BATCH otherwise; see the full code below.

### Full code

```python
"""
Domain 4 · Task 4.5 — Batch processing strategies.

THE BIG IDEA
============
The Message Batches API in one line: 50% CHEAPER, results within UP TO 24 HOURS, NO
guaranteed latency SLA, and no multi-turn tool calling within a request.

  Pre-merge code check (developers WAITING)  -> SYNCHRONOUS. Blocking; "usually fast" isn't
                                                good enough when there's no SLA.
  Overnight technical-debt report            -> BATCH. Latency-tolerant; pocket the 50%.
  Weekly compliance audit / nightly tests    -> BATCH. Nobody's waiting.

  custom_id correlates each request with its response — and lets you resubmit ONLY the
  failed documents (e.g., chunking oversized ones) instead of rerunning the whole batch.
  (This kills the "batch ordering" misconception in sample Q11.)

  SLA MATH: with a 24h batch window, guaranteeing a 30h turnaround means submitting every
  ~4-6h (the guide's example: 4-hour submission windows guarantee a 30-hour SLA).

  REFINE BEFORE YOU SCALE: tune the prompt on a small sample before running 100,000 docs.
"""

import sys, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[2]))
from ccarch import banner, concept, h1, h2, wrong, right, tip, note, kv, code, rule, pause, analogy, pitfall


def choose_api(blocking: bool, someone_waiting: bool):
    if blocking or someone_waiting:
        return "SYNCHRONOUS (real-time)", "A human is blocked; no latency SLA is unacceptable."
    return "BATCH", "Latency-tolerant; take the 50% cost savings."


WORKLOADS = [
    ("Pre-merge code check (devs waiting to merge)", True, True),
    ("Overnight technical-debt report", False, False),
    ("Weekly compliance audit", False, False),
    ("Nightly test generation", False, False),
]


def main():
    banner("Domain 4 · Task 4.5", "Batch processing strategies")
    concept("Domain 4: Prompt Engineering & Structured Output (20%)",
            "Task 4.5 — Design efficient batch processing strategies",
            "Batch = 50% cheaper, <=24h, NO latency SLA")

    h1("Match each workload to the right API (sample Q11)")
    for name, blocking, waiting in WORKLOADS:
        api, why = choose_api(blocking, waiting)
        h2(name)
        right(f"{api} — {why}")
    wrong("Switching the BLOCKING pre-merge check to batch 'because it's usually fast'. "
          "There is NO latency SLA; developers could wait hours.")

    pause("custom_id")
    rule()
    h1("custom_id: correlation + partial resubmission")
    code('requests = [\n'
         '  {"custom_id": "doc-001", ...},\n'
         '  {"custom_id": "doc-002", ...},\n'
         ']\n'
         '# results come back possibly out of order; match them by custom_id\n'
         '# resubmit ONLY the failures (e.g., chunk doc-417 that was too large)',
         "custom_id")
    right("'Batch result ORDERING' is a misconception — custom_id correlates each request "
          "with its response, so out-of-order results are a non-issue.")

    pause("SLA math")
    rule()
    h1("SLA math")
    note("Batch window is UP TO 24h. To guarantee a 30h end-to-end SLA, you need slack for "
         "a worst-case 24h run.")
    kv("  submit every", "~4-6 hours")
    kv("  guaranteed turnaround", "~30 hours (24h window + submission cadence)")
    code("submit_interval = target_sla - max_batch_window\n"
         "30h - 24h = 6h of slack  ->  submit at least every ~4-6h", "the arithmetic")

    rule()
    h1("Refine before you scale")
    right("Tune the prompt on a SMALL sample first. First-pass success across 100,000 docs "
          "is far cheaper than iterative resubmission.")

    rule()
    h1("Plain-language analogy & the common confusion")
    analogy('Batch is overnight shipping at half price; synchronous is the same-hour courier. Use overnight for the report nobody reads till morning; use the courier for the package someone is standing at the door waiting for.')
    pitfall("The tempting mistake: batch the blocking pre-merge check 'because it is usually fast.' Batch has NO latency guarantee (up to 24h) — 'usually fast' is unacceptable when a developer is blocked on the result.")

    tip("Batch: 50% cheaper, <=24h, NO latency SLA, no multi-turn tool calling. Blocking "
        "work stays synchronous. custom_id solves correlation AND partial resubmission.")


if __name__ == "__main__":
    main()
```

---

## Task 4.6 — Multi-instance and multi-pass review architectures

**Source:** https://github.com/jacinthpaul/Claude-Certified-Architect/blob/claude/architect-exam-codebase-7ytdjz/domains/domain4_prompt_output/task4_6_multi_pass_review.py

### Objective

Design multi-instance and multi-pass review architectures. Fresh eyes beat self-review; split passes beat one big pass.

### Concept

- SELF-REVIEW IS STRUCTURALLY WEAK: a model reviewing code in the SAME session that generated it carries its own reasoning and won't question its decisions. A FRESH, independent instance catches subtler issues than self-review instructions or extended thinking ever will.
- MULTI-PASS BEATS SINGLE-PASS for large reviews: per-file passes for local issues + a separate cross-file integration pass — avoids attention dilution and contradictory findings (the 14-file PR, sample Q12). Bigger context windows do NOT fix attention quality, and 2-of-3 consensus voting SUPPRESSES real intermittent catches.
- CONFIDENCE-ANNOTATED passes: have the model self-report a confidence score per finding to route human attention.

Analogy: authors don't copy-edit their own manuscripts — they read what they MEANT to write. Publishers hire fresh eyes. Same model, different session, no shared reasoning = fresh eyes.

### Instructions

- Self-review is structurally weak: asking the SAME session that wrote the code to review it re-reads what it MEANT to write and rubber-stamps its own decisions. Use a FRESH, independent instance with no generation context.
- Multi-pass beats single-pass for large reviews (sample Q12): a 14-file PR reviewed in ONE pass gives uneven depth, missed bugs, and contradictory findings (flag a pattern in one file, approve it in another). Per-file passes for consistent local depth + ONE integration pass for cross-file data flow.
- Why the distractors fail: a bigger context window / higher-tier model does NOT fix ATTENTION quality; forcing developers to split PRs into 3-4 files shifts the burden, doesn't fix the system; running 3 passes and keeping only issues found in >=2 (consensus voting) SUPPRESSES real bugs that are only caught intermittently.
- Confidence-annotated verification passes: self-report a confidence score per finding (e.g., `{"file": "orders.py", "line": 88, "issue": "unchecked index", "severity": "high", "confidence": 0.6}`) to route scarce human review attention (more in Task 5.5).

### Acceptance Criteria

Not present as a separate section in the module docstring. The demo includes a `review_plan(num_files)` helper that builds per-file passes plus a final cross-file integration pass; see the full code below.

### Full code

```python
"""
Domain 4 · Task 4.6 — Multi-instance and multi-pass review architectures.

THE BIG IDEA
============
  * SELF-REVIEW IS STRUCTURALLY WEAK: a model reviewing code in the SAME session that
    generated it carries its own reasoning and won't question its decisions. A FRESH,
    independent instance catches subtler issues than self-review instructions or extended
    thinking ever will.
  * MULTI-PASS BEATS SINGLE-PASS for large reviews: per-file passes for local issues + a
    separate cross-file integration pass — avoids attention dilution and contradictory
    findings (the 14-file PR, sample Q12). Bigger context windows do NOT fix attention
    quality, and 2-of-3 consensus voting SUPPRESSES real intermittent catches.
  * CONFIDENCE-ANNOTATED passes: have the model self-report a confidence score per finding
    to route human attention.

Analogy: authors don't copy-edit their own manuscripts — they read what they MEANT to
write. Publishers hire fresh eyes. Same model, different session, no shared reasoning =
fresh eyes.
"""

import sys, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[2]))
from ccarch import banner, concept, h1, h2, wrong, right, tip, note, kv, code, rule, pause, analogy, pitfall


def review_plan(num_files: int):
    passes = [f"Pass {i+1}: file {i+1} — local issues only" for i in range(num_files)]
    passes.append(f"Pass {num_files+1}: cross-file integration (data flow across all files)")
    return passes


def main():
    banner("Domain 4 · Task 4.6", "Multi-instance & multi-pass review")
    concept("Domain 4: Prompt Engineering & Structured Output (20%)",
            "Task 4.6 — Design multi-instance and multi-pass review architectures",
            "Fresh eyes beat self-review; split passes beat one big pass")

    h1("Self-review is structurally weak")
    wrong("Asking the SAME session that wrote the code to review it. It re-reads what it "
          "MEANT to write and rubber-stamps its own decisions.")
    right("Use a FRESH, independent instance with no generation context. It catches subtler "
          "issues than 'review your own work carefully' or extended thinking ever will.")
    note("Analogy: authors don't copy-edit themselves; publishers hire fresh eyes.")

    pause("multi-pass")
    rule()
    h1("Multi-pass beats single-pass for large reviews (sample Q12)")
    note("A 14-file PR reviewed in ONE pass gives uneven depth, missed bugs, and "
         "contradictory findings (flag a pattern in one file, approve it in another).")
    for step in review_plan(3):   # show the shape with 3 files
        kv("  ", step)
    right("Per-file passes for consistent local depth + ONE integration pass for cross-file "
          "data flow.")
    code(
        '''findings = []
for path in changed_files:               # one FRESH instance per file
    reviewer = spawn_fresh_instance()    # no generation context to rubber-stamp
    findings += reviewer.review(path)    # consistent local depth

reviewer = spawn_fresh_instance()        # ONE more pass over everything
findings += reviewer.review_integration(changed_files)  # cross-file data flow''',
        "multi-pass + fresh instance")

    h2("Why the distractors fail")
    wrong("Bigger context window / higher-tier model — context size does NOT fix ATTENTION "
          "quality.")
    wrong("Force developers to split PRs into 3-4 files — shifts the burden, doesn't fix "
          "the system.")
    wrong("Run 3 passes, keep only issues found in >=2 — consensus voting SUPPRESSES real "
          "bugs that are only caught intermittently.")

    pause("confidence routing")
    rule()
    h1("Confidence-annotated verification passes")
    code('{"file": "orders.py", "line": 88, "issue": "unchecked index",\n'
         ' "severity": "high", "confidence": 0.6}   # route the 0.6 to a human',
         "self-reported confidence per finding")
    right("Confidence scores enable CALIBRATED routing of scarce human review attention "
          "(more in Task 5.5).")

    rule()
    h1("Plain-language analogy & the common confusion")
    analogy('Authors do not copy-edit their own manuscripts — they read what they MEANT to write, so publishers hire fresh eyes. Same model, different session, no shared reasoning equals fresh eyes.')
    pitfall('Two myths: a bigger context window fixes a sprawling 14-file review (it does not — attention still dilutes), and a session can fairly review its own code (it cannot — it re-reads what it MEANT to write). Split into passes; use fresh eyes.')

    tip("Independent fresh instance > self-review. Large PR -> per-file passes + integration "
        "pass. Bigger context != better attention. Consensus voting hides intermittent bugs.")


if __name__ == "__main__":
    main()
```
