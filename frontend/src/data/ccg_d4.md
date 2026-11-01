# Domain 4 — Prompt Engineering & Structured Output (20%)
_Compiled from claudecertificationguide.com — independent community resource, not affiliated with Anthropic._

## Overview
Craft effective prompts, implement structured output patterns, and apply prompt engineering techniques for production Claude applications.
Task statements: 4.1 System Prompts with Explicit Criteria, 4.2 Few-Shot Prompting, 4.3 Structured Output with Tool Use, 4.4 Validation, Retry, and Feedback Loops, 4.5 Batch Processing Strategies, 4.6 Multi-Instance and Multi-Pass Review.

## 4.1 — System Prompts with Explicit Criteria

**Source:** https://claudecertificationguide.com/learn/4-prompt-engineering/4-1-system-prompts

### What You Need to Know
- Biggest mistake: relying on vague instructions ("Be conservative," "Only report high-confidence findings," "Use your best judgement") — no actionable decision boundary. Correct approach: **explicit categorical criteria** defining what to flag and what to skip.
- Wrong: `Review this code. Be conservative. Only report high-confidence findings.` Correct:
```
Flag comments only when claimed behaviour contradicts actual code behaviour.
Report bugs and security vulnerabilities.
Skip minor style preferences and local patterns.
```
- "Conservative" is context-dependent; "high-confidence" is a subjective, uncalibratable threshold.
- **False Positive Trust Problem:** high false positives in one category destroy trust in ALL categories (40% wrong "documentation mismatch" findings make developers ignore even 98%-accurate security findings). Fix: **temporarily disable high-false-positive categories** while reworking prompts; re-enable once precision improves.
- **Severity calibration needs concrete code examples, not prose.** Prose (insufficient): `Critical: Issues that could cause system failures or data loss` / `Minor: Issues that affect code readability but not functionality`. Code examples (correct):
```
Critical — Unsanitised user input in SQL query:
  query = f"SELECT * FROM users WHERE id = {user_input}"

Minor — Inconsistent variable naming:
  userName vs user_name in the same module
```
- Code examples give consistent classification across invocations.
- **Confidence-based filtering fails:** LLM self-reported confidence is poorly calibrated — often sure about wrong findings, hesitant about right ones. Confidence scores belong in routing (low confidence → human review, Task 4.6), not as a substitute for explicit criteria.
- Hierarchy: **explicit criteria first, confidence-based routing second.**

### Exam Traps
- Choosing 'be conservative' or 'only report high-confidence findings' as valid prompt improvements
- Assuming confidence thresholds fix false positive problems
- Keeping all review categories active while iterating on high false-positive categories

### Practice Scenario
Your CI/CD code review pipeline has a 40% false positive rate on 'documentation mismatch' findings, causing developers to ignore ALL review categories including accurate security findings. What is the most effective fix?
- A) Temporarily disable the documentation mismatch category while refining its prompts with explicit criteria and code examples
- B) Increase the model temperature to produce more varied review runs, then filter out findings that appear only once
- C) Add a second model pass that re-examines each documentation finding and discards any it cannot verify before the report reaches developers
- D) Add "only report high-confidence documentation issues" to the system prompt so the model filters its own weaker findings

### Build Exercise
Build an Explicit Criteria Code Review Prompt (45 minutes).
- Learn: why vague instructions fail; explicit categorical criteria; severity calibration with code examples; false-positive measurement and trust recovery; criteria-first, routing-second hierarchy.
- Steps: (1) vague prompt vs 5 code snippets with known bugs/security issues/style nitpicks — expect inconsistent, unstable classification. (2) Rewrite with explicit criteria (report bugs/security, skip style/local patterns, flag comments only on claimed-vs-actual contradiction). (3) Add a concrete code example per severity (critical, major, minor). (4) Compare false-positive rates: vague prompt 30-50% inconsistency, explicit criteria below 15%, stable across runs. (5) Disable any category above 25% false positives; document refinements and re-enablement plan with target rates.

### Sources
- [Claude Certified Architect Foundations Exam Guide — Task Statement 4.1](https://anthropic-partners.skilljar.com/page/partner-certifications) — Anthropic
- [Prompt Engineering Overview](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview) — Anthropic
- [Building with Claude API (Skilljar)](https://anthropic.skilljar.com/claude-with-the-anthropic-api) — Anthropic

## 4.2 — Few-Shot Prompting

**Source:** https://claudecertificationguide.com/learn/4-prompt-engineering/4-2-few-shot-prompting

### What You Need to Know
- Few-shot examples are the **most effective technique** for consistent, well-formatted output — not more instructions, confidence thresholds, or temperature. First tool for inconsistent output.
- **Three deployment triggers:** (1) detailed instructions alone produce inconsistent formatting (list vs table vs prose); (2) inconsistent judgement calls on ambiguous cases (variable shadowing "critical" in one file, "minor" in another; "check my order" routed to different tools); (3) empty/null fields for information that exists in the document (narrative text, split across paragraphs).
- **Constructing examples:** use **2-4 targeted examples** (fewer than 2 establishes no pattern; more than 4 wastes tokens without proportional benefit); **each must show reasoning** (why one action over plausible alternatives) to teach generalisation; **cover the failing scenarios**.
```
Example: Tool selection for "check my order #12345"
Input: "check my order #12345"
Selected tool: lookup_order
Reasoning: The user provides an order number (#12345), indicating
they want order-specific information. Even though this could be
interpreted as a general customer query, the specific order
identifier makes lookup_order the correct choice over get_customer.
```
- **Hallucination reduction:** examples of correct extraction from varied structures (inline citations vs bibliographies, narrative vs tables, headers vs embedded text) cut hallucination, especially for inconsistently formatted documents.
- **Reducing false positives:** examples show both what to flag and what to ignore.
```
Example: Variable shadowing assessment
Code: function process(items) {
  const result = items.map(item => {
    const result = transform(item);  // shadows outer 'result'
    return result;
  });
  return result;
}
Severity: minor
Reasoning: The inner 'result' shadows the outer variable but
within a limited scope (arrow function). The code is still readable
and the shadow does not cause a bug. This is a style preference,
not a defect. Flag as minor only if style consistency is in scope.
```
- **Technique matching:** inconsistent formatting → few-shot; malformed JSON → `tool_use` with JSON schemas; fabricated values for missing fields → optional/nullable schema fields; wrong tool selection → better tool descriptions (first), then few-shot; missed narrative info → few-shot examples showing narrative extraction; sum mismatch → validation-retry loop.

### Exam Traps
- Choosing 'add more detailed instructions' when output formatting is inconsistent
- Thinking few-shot examples only teach literal pattern-matching
- Using confidence thresholds to fix inconsistent judgement calls

### Practice Scenario
Your extraction pipeline correctly identifies research data in structured tables but returns empty fields when the same information appears in narrative paragraphs. Detailed instructions already specify all required fields and their formats. What should you try first?
- A) Add a pre-processing step to convert all narrative text into structured tables before extraction
- B) Increase the model context window to process more of each document
- C) Add few-shot examples showing correct extraction from both structured tables and narrative paragraphs
- D) Add a post-processing retry that re-extracts any fields returned as empty

### Build Exercise
Build a Few-Shot Enhanced Extraction Prompt (45 minutes).
- Learn: the three triggers; examples with reasoning; 2-4 targeted examples; technique matching; measuring empty-field/consistency impact.
- Steps: (1) base prompt (no examples) vs 10 documents (tables, narrative, mixed) — expect inconsistent extraction. (2) Record fields consistently empty/inconsistent per document type. (3) Create 3 few-shot examples targeting failing patterns, each with reasoning. (4) Re-run same 10 documents; compare empty-field rate, format consistency, accuracy. (5) Document which patterns improve with few-shot vs need other techniques (malformed JSON → tool_use, fabrication → nullable schemas, sums → validation loops).

### Sources
- [Claude Certified Architect Foundations Exam Guide — Task Statement 4.2](https://anthropic-partners.skilljar.com/page/partner-certifications) — Anthropic
- [Prompt Engineering Overview](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview) — Anthropic
- [Building with Claude API (Skilljar)](https://anthropic.skilljar.com/claude-with-the-anthropic-api) — Anthropic

## 4.3 — Structured Output with Tool Use

**Source:** https://claudecertificationguide.com/learn/4-prompt-engineering/4-3-structured-output

### What You Need to Know
- Reliability hierarchy: (1) **`tool_use` with JSON schemas** — eliminates JSON syntax errors entirely; (2) **prompt-based JSON** — model can produce malformed JSON.
- Tool schemas constrain output shape (no missing brackets, trailing commas, unquoted keys). The separate `tool_choice` parameter forces the tool call. Prompt-based extraction gives no structural guarantees.
- **`tool_choice` three modes:**
  - `"auto"` (default): model decides whether to call a tool or return text — use when conversational response is legitimate.
  - `"any"`: model MUST call a tool but chooses which — use with multiple schemas (`extract_invoice`, `extract_receipt`, `extract_contract`) when document type is unknown. Guaranteed structured output, flexible selection.
  - `{"type": "tool", "name": "extract_metadata"}`: MUST call the named tool — forces a mandatory first step (metadata before enrichment). No flexibility, maximum control.
```typescript
// Force guaranteed structured output with unknown document type
const response = await client.messages.create({
  model: "claude-sonnet-5",
  max_tokens: 4096,
  tool_choice: { type: "any" },
  tools: [extractInvoiceTool, extractReceiptTool, extractContractTool],
  messages: [{ role: "user", content: documentText }]
});

// Force a specific extraction step
const response = await client.messages.create({
  model: "claude-sonnet-5",
  max_tokens: 4096,
  tool_choice: { type: "tool", name: "extract_metadata" },
  tools: [extractMetadataTool],
  messages: [{ role: "user", content: documentText }]
});
```
- **`tool_use` does NOT prevent semantic errors:** sum discrepancies; field placement errors (date in an amount field when both are strings); fabrication (invented values for required fields when source lacks info). Semantic validation needs additional logic (Task 4.4).
- **Schema design:**
  - **Optional/nullable fields** — primary defence against fabrication; required fields pressure the model to produce values, nullable fields allow honest `null`.
```json
{
  "type": "object",
  "properties": {
    "invoice_number": { "type": "string" },
    "vendor_name": { "type": "string" },
    "payment_terms": { "type": ["string", "null"] },
    "purchase_order": { "type": ["string", "null"] }
  },
  "required": ["invoice_number", "vendor_name"]
}
```
  - **"unclear" enum value** — for genuinely ambiguous cases, prevents forced classification.
  - **"other" + detail string** — extensible categorisation; freeform detail field for edge cases.
```json
{
  "category": {
    "type": "string",
    "enum": ["invoice", "receipt", "contract", "unclear", "other"]
  },
  "category_detail": {
    "type": ["string", "null"],
    "description": "Freeform detail when category is 'other'"
  }
}
```
  - **Format normalisation rules** — in the prompt beside the schema: schema enforces structure, prompt enforces formatting (e.g., "All dates in ISO 8601 format," "All currency amounts as decimal numbers without currency symbols").

### Exam Traps
- Believing tool_use with JSON schemas prevents all extraction errors
- Confusing tool_choice 'auto' with 'any'
- Making all schema fields required to ensure data completeness

### Practice Scenario
Your extraction system uses tool_use with a strict JSON schema where all fields are required. Testers report the model invents plausible-looking dates and monetary amounts when processing documents that lack this information. What is the best fix?
- A) Make fields optional or nullable when source documents may not contain the information
- B) Switch from tool_use to prompt-based JSON extraction for more flexibility
- C) Add an instruction telling the model not to hallucinate values
- D) Add a post-extraction validation step that checks all values against the source document

### Build Exercise
Build a Structured Extraction Tool with JSON Schema (45 minutes).
- Learn: optional/nullable fields vs fabrication; three tool_choice modes; syntax vs semantic errors; unclear enum, other + detail, format normalisation.
- Steps: (1) Schema with 3 required fields, 3 optional/nullable fields, an enum with unclear and other, a detail string for other. (2) Test `tool_choice` auto — observe text responses instead of tool calls. (3) Switch to `tool_choice` any — verify every response has `stop_reason` of `tool_use`, schema-conformant, no text-only responses. (4) Force `tool_choice {type: "tool", name: "extract_metadata"}` — named tool always runs regardless of content. (5) Process 5 documents (3 complete, 2 missing fields) — nullable fields return null, not fabricated dates/amounts/identifiers.

### Sources
- [Claude Certified Architect Foundations Exam Guide — Task Statement 4.3](https://anthropic-partners.skilljar.com/page/partner-certifications) — Anthropic
- [Tool Use (Function Calling)](https://platform.claude.com/docs/en/build-with-claude/tool-use) — Anthropic
- [Building with Claude API (Skilljar)](https://anthropic.skilljar.com/claude-with-the-anthropic-api) — Anthropic

## 4.4 — Validation, Retry, and Feedback Loops

**Source:** https://claudecertificationguide.com/learn/4-prompt-engineering/4-4-validation-retry-loops

### What You Need to Know
- The validation-retry pattern turns failures into self-correcting workflows.
- **Retry-with-Error-Feedback** sends three things: (1) **the original document**, (2) **the failed extraction**, (3) **the specific validation error**.
```typescript
// Retry with error feedback
const retryMessages = [
  {
    role: "user",
    content: `Original document:\n${originalDocument}\n\n` +
      `Your extraction:\n${JSON.stringify(failedExtraction)}\n\n` +
      `Validation error: Line items sum to £450 but stated_total is £500. ` +
      `Please re-extract, ensuring all line items are captured.`
  }
];
```
- Without the specific error the model usually reproduces the same mistake.
- **Retry Effectiveness Boundary (most tested concept):** retries ARE effective for format mismatches (wrong date format, inconsistent currency notation), structural output errors (wrong fields, incorrect nesting), misplaced values (data exists but wrong field), mathematical errors (missed line item). NOT effective for information genuinely absent from the source, data only in an external document not provided to the model, or fields requiring knowledge the model lacks — flag for human review or return null if the schema allows.
- **Self-correction schema design:**
  - **`calculated_total` vs `stated_total`:** extract both; a difference is an automatic discrepancy flag with no external logic.
```json
{
  "line_items": [
    { "description": "Widget A", "amount": 150.00 },
    { "description": "Widget B", "amount": 300.00 }
  ],
  "calculated_total": 450.00,
  "stated_total": 500.00,
  "total_discrepancy": true
}
```
  - **`conflict_detected` booleans:** flag contradictory source info (e.g., "payment due: 30 days" vs "payment terms: net 60") — extract both and set `conflict_detected: true` rather than silently picking one.
- **`detected_pattern` fields** track which construct triggered each finding; dismissal-pattern analysis creates the loop: extract, validate, collect dismissal data, refine prompts, repeat.
```json
{
  "finding": "Potential SQL injection vulnerability",
  "severity": "critical",
  "detected_pattern": "string concatenation in SQL query",
  "file": "user_service.py",
  "line": 42
}
```
- **Error categories:** schema syntax errors (malformed JSON, missing required fields, wrong data types) — eliminated entirely by `tool_use` with JSON schemas (Task 4.3). Semantic validation errors (correct structure, wrong values — sums that don't add up, wrong date ordering, misplaced values) — require validation logic outside the schema; the focus of retry loops.
- **Pydantic as validation layer:** parsing enforces structure (types, required fields, enums); validators enforce semantics JSON schemas cannot express (cross-field arithmetic, date ordering). Both surface through one `ValidationError` with machine-readable, per-field errors.
```python
import json
from pydantic import BaseModel, ValidationError, model_validator

class LineItem(BaseModel):
    description: str
    amount: float

class Invoice(BaseModel):
    line_items: list[LineItem]
    stated_total: float

    @model_validator(mode="after")
    def totals_must_match(self):
        calculated = round(sum(i.amount for i in self.line_items), 2)
        if abs(calculated - self.stated_total) > 0.01:
            raise ValueError(
                f"line items sum to {calculated} but stated_total is {self.stated_total}"
            )
        return self

try:
    invoice = Invoice.model_validate(tool_input)  # the tool_use input from the response
except ValidationError as e:
    errors = "\n".join(
        f"{'.'.join(map(str, err['loc'])) or 'invoice'}: {err['msg']}" for err in e.errors()
    )
    retry_message = (
        f"Original document:\n{original_document}\n\n"
        f"Your extraction:\n{json.dumps(tool_input)}\n\n"
        f"Validation errors:\n{errors}\n\n"
        f"Please re-extract, fixing the identified errors."
    )
```
- Pydantic supplies the specific-error ingredient for the retry prompt. The retry-effectiveness boundary applies unchanged.
- Current state (as of July 2026): Python SDK `client.messages.parse(..., output_format=Invoice)` returns validated Pydantic instances via `parsed_output`; `strict: true` on a tool definition guarantees schema-conformant inputs server-side ([Structured Outputs](https://platform.claude.com/docs/en/build-with-claude/structured-outputs)). Neither removes the semantic layer: platform enforces schema, validators enforce business rules, retry loop consumes whichever fails.

### Exam Traps
- Assuming retries always work for extraction failures
- Implementing retries without including the specific validation error
- Relying on schema validation alone without semantic checks
- Treating Pydantic as redundant once tool_use enforces a JSON schema

### Practice Scenario
Your extraction pipeline validates that line item amounts sum to the stated total. For Document A, the calculated sum is £450 but the stated total is £500. For Document B, the 'department' field is missing entirely from the source text. Which retry strategy is correct?
- A) Retry both documents with the validation errors, instructing the model to re-extract all fields
- B) Skip retries for both documents and flag them all for human review to ensure accuracy
- C) Retry Document A with the discrepancy error; flag Document B for human review since the information is absent from the source
- D) Retry both documents with the same prompt, since extraction is non-deterministic and may succeed on a second attempt

### Build Exercise
Build a Validation-Retry Loop for Document Extraction (60 minutes).
- Learn: retry-with-error-feedback; fixable vs unfixable errors; self-correction schemas; detected_pattern + dismissal tracking; syntax vs semantic errors.
- Steps: (1) Tool with calculated_total/stated_total, conflict_detected boolean, detected_pattern per finding. (2) Validation: field completeness, numerical consistency, enum validity, date ordering — specific actionable errors (expected vs found). (3) Retry loop: on failure, message with original document + failed extraction + specific error. (4) Test 5 documents (2 fixable, 3 unfixable): retry only fixable; flag unfixable for human review. (5) Log detected_pattern data; analyse dismissal rates to prioritise prompt refinements.

### Sources
- [Claude Certified Architect Foundations Exam Guide — Task Statement 4.4](https://anthropic-partners.skilljar.com/page/partner-certifications) — Anthropic
- [Tool Use (Function Calling)](https://platform.claude.com/docs/en/build-with-claude/tool-use) — Anthropic
- [Structured Outputs](https://platform.claude.com/docs/en/build-with-claude/structured-outputs) — Anthropic
- [Pydantic documentation](https://docs.pydantic.dev/latest/) — Pydantic
- [Building with Claude API (Skilljar)](https://anthropic.skilljar.com/claude-with-the-anthropic-api) — Anthropic

## 4.5 — Batch Processing Strategies

**Source:** https://claudecertificationguide.com/learn/4-prompt-engineering/4-5-batch-processing

### What You Need to Know
- **Message Batches API facts:** **50% cost savings** vs synchronous; **up to 24-hour processing window**; **no guaranteed latency SLA**; **no multi-turn tool calling** within a single batch request; **`custom_id` fields** for correlating request/response pairs.
- **The Matching Rule (most tested concept):** **Synchronous** for blocking workflows where someone waits — pre-merge checks in CI/CD, real-time code review. **Batch** for latency-tolerant workflows consumed later — overnight technical debt reports, weekly code audit summaries, nightly test generation, batch document extraction. Exam scenario (Question 11 of sample questions): manager proposes switching everything to batch for savings — correct answer keeps blocking workflows synchronous, moves only latency-tolerant ones to batch.
```typescript
// Synchronous — developer is waiting for this
const preMergeReview = await client.messages.create({
  model: "claude-sonnet-5",
  max_tokens: 4096,
  messages: [{ role: "user", content: prDiffContent }]
});

// Batch — results consumed tomorrow morning
const batchRequest = await client.batches.create({
  requests: technicalDebtDocuments.map((doc, i) => ({
    custom_id: `debt-report-${i}`,
    params: {
      model: "claude-sonnet-5",
      max_tokens: 4096,
      messages: [{ role: "user", content: doc }]
    }
  }))
});
```
- **SLA calculation:** 30-hour SLA − 24-hour max window = 6 hours of buffer (collecting requests, validating inputs, delays). Submit batches every 4-6 hours within the buffer so a fresh batch is always in flight. Work backwards from the SLA.
- **Failure handling (three steps):** (1) identify failures by `custom_id`; (2) resubmit only failures with modifications (chunk oversized docs exceeding context limits; simplify prompts for unusual structures; add format-specific few-shot examples) — never the whole batch; (3) refine prompts on a sample set (5-10 representative documents) BEFORE processing.
```typescript
// Parse batch results and identify failures
const results = await client.batches.results(batchId);
const failures = results.filter(r => r.result.type === "errored");
const failedIds = failures.map(f => f.custom_id);

// Resubmit only failures with modifications
const retryRequests = failedIds.map(id => {
  const originalDoc = documentsById[id];
  return {
    custom_id: `${id}-retry-1`,
    params: {
      model: "claude-sonnet-5",
      max_tokens: 8192,  // increased for oversized docs
      messages: [{
        role: "user",
        content: chunkIfNeeded(originalDoc)
      }]
    }
  };
});
```
- **Multi-turn tool calling limitation:** no tool calls mid-request, no continuing after tool results, no agentic loops within one batch item — use the synchronous API if tool execution mid-processing is required.
- **Prompt optimisation before submission (most cost-effective):** sample-set test (5-10 docs) → iterate (few-shot, schema) → submit full batch → handle failures (targeted resubmission). A 90% first-pass rate on 1,000 docs = 100 retries; 60% = 400 retries — four times the resubmission cost plus batch cost of retries.

### Exam Traps
- Switching all workflows to batch processing for cost savings
- Assuming batch results arrive quickly because they often do
- Using batch API for workflows requiring multi-turn tool calling

### Practice Scenario
Your team wants to reduce API costs for automated analysis. You have two workflows: (1) a blocking pre-merge check that must complete before developers merge, and (2) a technical debt report generated overnight for review the next morning. Your manager proposes switching both to the Message Batches API for 50% cost savings. How should you evaluate this proposal?
- A) Use batch processing for the technical debt reports only; keep real-time calls for pre-merge checks
- B) Switch both to batch processing with a timeout fallback to real-time if the batch takes too long
- C) Keep real-time calls for both workflows to avoid batch result ordering issues
- D) Switch both to batch processing with status polling to check for completion

### Build Exercise
Design a Batch Processing Strategy (45 minutes).
- Learn: blocking vs latency-tolerant classification; custom_id correlation; targeted resubmission; SLA-based scheduling; sample-set prompt refinement.
- Steps: (1) Categorise 5 hypothetical workflows as blocking (synchronous) or latency-tolerant (batch-eligible) with justification. (2) Batch submission for 20 documents with unique custom_id, model, max_tokens, messages. (3) Failure handling: parse results, identify failures by custom_id, retry batch of only failures with increased max_tokens. (4) 30-hour SLA: 30 − 24 = 6-hour buffer; submit at least 30 hours before deadline, every 4-6 hours. (5) 5-document sample set, iterate prompts, then submit full batch of 20 — 90% first-pass = 2 retries; 60% = 8 (four times the resubmission cost).

### Sources
- [Claude Certified Architect Foundations Exam Guide — Task Statement 4.5](https://anthropic-partners.skilljar.com/page/partner-certifications) — Anthropic
- [Message Batches API](https://platform.claude.com/docs/en/build-with-claude/batch-processing) — Anthropic
- [Building with Claude API (Skilljar)](https://anthropic.skilljar.com/claude-with-the-anthropic-api) — Anthropic

## 4.6 — Multi-Instance and Multi-Pass Review

**Source:** https://claudecertificationguide.com/learn/4-prompt-engineering/4-6-multi-pass-review

### What You Need to Know
- **The Self-Review Limitation:** a model reviewing its own output in the same conversation retains its original reasoning chain and tends to confirm rather than challenge its decisions. Design around it.
- **Independent instance:** a separate Claude invocation without prior reasoning context judges output fresh — much better at catching subtle issues.
- Correct answer for better review quality: a separate model instance — not "please review carefully" instructions or extended thinking in the generating session.
```typescript
// Anti-pattern: self-review in the same session
const generation = await client.messages.create({
  messages: [
    { role: "user", content: "Write a function to process orders" },
    { role: "assistant", content: generatedCode },
    { role: "user", content: "Now review your code for bugs" }
    // Model retains its reasoning — less likely to find its own mistakes
  ]
});

// Correct: independent review instance
const review = await client.messages.create({
  messages: [
    {
      role: "user",
      content: `Review this code for bugs, security issues, and edge cases:\n\n${generatedCode}`
    }
    // Fresh instance — no prior reasoning context
  ]
});
```
- **Multi-pass review architecture:** large reviews (multi-file PRs, complex extraction pipelines, broad audits) suffer **attention dilution** in a single pass — symptoms: detailed feedback on some files and superficial on others; obvious bugs missed mid-review; contradictory findings (pattern flagged in one file, approved in identical code elsewhere).
  - **Pass 1: Per-file local analysis** — each file individually, focused prompt, consistent depth.
  - **Pass 2: Cross-file integration** — separate pass over all per-file findings checks data flow between modules, consistent API usage across services, dependency conflicts, contradictions.
```typescript
// Pass 1: Per-file analysis
const perFileFindings = await Promise.all(
  files.map(file =>
    client.messages.create({
      messages: [{
        role: "user",
        content: `Review this file for local issues (bugs, security, logic errors):\n\n${file.content}`
      }]
    })
  )
);

// Pass 2: Cross-file integration
const integrationReview = await client.messages.create({
  messages: [{
    role: "user",
    content: `Given these per-file findings, identify cross-file issues:\n` +
      `- Data flow inconsistencies between modules\n` +
      `- Contradictory patterns flagged in different files\n` +
      `- API contract violations across service boundaries\n\n` +
      `Findings:\n${JSON.stringify(perFileFindings)}`
  }]
});
```
- **Larger context windows do NOT fix this:** the problem is attention quality, not context size — a bigger window won't stop uneven attention. Only focused per-file passes ensure consistent depth.
- **Confidence-based routing:** high-confidence findings → report directly to developers; low-confidence → human review; **calibrate thresholds with labelled validation sets** correlating confidence with actual accuracy.
```json
{
  "finding": "Potential race condition in order processing",
  "severity": "major",
  "confidence": 0.65,
  "reasoning": "The lock acquisition pattern appears correct but the unlock timing depends on an async callback whose ordering I cannot fully verify.",
  "route": "human_review"
}
```
- Confidence is the model's read on its own certainty, not self-reported accuracy. Calibrate by running labelled examples (known answers) through the system; adjust routing thresholds from that data. Raw confidence = uncalibrated, unreliable for automated decisions (anti-pattern); calibrated thresholds = validated against labelled sets, suitable for routing.
- **Production review architecture:** (1) generation instance; (2) per-file review by independent instances; (3) integration review of cross-unit consistency; (4) confidence routing of low-confidence findings to human review; (5) calibration loop with labelled validation sets. More expensive than single-pass; worth it when review quality affects production reliability — CI/CD pipelines, financial extraction, compliance analysis, systems where missed issues have downstream consequences.

### Exam Traps
- Choosing self-review in the same session as a viable review strategy
- Using a single pass for large multi-file reviews
- Switching to a larger context window model to fix attention dilution
- Using uncalibrated confidence scores for automated review routing

### Practice Scenario
A pull request modifying 14 files receives inconsistent review: detailed feedback on some files, superficial comments on others, obvious bugs missed, and contradictory findings — the same pattern is flagged as problematic in one file but approved in another. How should you restructure the review?
- A) Switch to a higher-tier model with a much larger context window so that all 14 files receive adequate attention within a single review pass
- B) Split into per-file local analysis passes for consistent depth, then run a separate cross-file integration pass for data flow issues
- C) Run three independent review passes over the full PR and only flag issues that at least two of the three runs agree on
- D) Require developers to split large pull requests into smaller submissions of 3-4 files before the automated review runs

### Build Exercise
Build a Multi-Pass Code Review System (60 minutes).
- Learn: self-review reasoning retention; per-file + cross-file architecture; attention dilution mitigation; confidence routing with calibrated thresholds.
- Steps: (1) Single-pass prompt vs 10-file mock PR — document inconsistent depth, missed issues, contradictory findings. (2) Per-file local analysis (each file: bugs, security, logic errors) — consistent depth, middle-file bugs caught. (3) Cross-file integration pass over all findings — data flow inconsistencies, contradictions, API contract violations across service boundaries. (4) Confidence scoring (0.0-1.0) per finding with routing: high → developer, low → human review queue. (5) Use a separate fresh Claude instance to review a subset of findings; compare against original confidence scores for calibration — overturned high-confidence findings reveal calibration gaps that adjust routing thresholds.

### Sources
- [Claude Certified Architect Foundations Exam Guide — Task Statement 4.6](https://anthropic-partners.skilljar.com/page/partner-certifications) — Anthropic
- [Prompt Engineering Overview](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview) — Anthropic
- [Building with Claude API (Skilljar)](https://anthropic.skilljar.com/claude-with-the-anthropic-api) — Anthropic
