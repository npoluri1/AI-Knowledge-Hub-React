# Domain 5 — Context Management & Reliability (15%)
_Compiled from claudecertificationguide.com — independent community resource, not affiliated with Anthropic._

## Overview

Manage context windows effectively, implement caching strategies, handle long conversations, and build reliable production systems. Tasks: 5.1 Context Window Management; 5.2 Escalation & Ambiguity Resolution; 5.3 Error Propagation in Multi-Agent Systems; 5.4 Codebase Exploration & Context Degradation; 5.5 Human Review & Confidence Calibration; 5.6 Information Provenance & Multi-Source Synthesis.

---

## 5.1 — Context Window Management

**Source:** https://claudecertificationguide.com/learn/5-context-management/5-1-context-window-management

### What You Need to Know

- Every multi-turn conversation, multi-agent pipeline, and long-document extraction depends on what enters the context window. Failures: agents forget refund amounts, pipelines drop citations, extraction loses precision.
- **Progressive summarisation trap:** summarising earlier turns destroys the most critical info — numerical values, dates, percentages, customer-stated expectations. Example: "I'd like a refund of $247.83 for order #8891 placed on March 3rd" → "Customer wants a refund for a recent order".
- **Fix: persistent case facts blocks.** Extract transactional facts (amounts, dates, order numbers, statuses) into a structured block in every prompt, outside summarised history; never summarised, persists every turn. Multi-issue sessions: one entry per issue in a separate context layer to prevent cross-contamination during summarisation.

```json
{"caseFactsBlock": {"customerId": "C-4421", "issues": [{"orderId": "#8891", "orderDate": "2024-03-03", "refundAmount": "$247.83", "status": "pending_refund", "itemDescription": "Wireless headphones — defective"}]}}
```

- **"Lost in the middle" effect:** models reliably process the start/end of long inputs; middle findings may be missed. **Fix is structural, not prompt-based:** key findings summaries at the start of aggregated inputs; detailed results under explicit section headers (`## Key Findings Summary`, `## Detailed Findings`, `### Source X`).
- **Tool result trimming:** order lookups return 40+ fields (~5 relevant); the rest burn tokens every turn. Trim before results enter history — in a `PostToolUse` hook or in the tool implementation itself.

```python
def trim_order_result(raw_result, relevant_fields=None):
    if relevant_fields is None:
        relevant_fields = ["order_id", "order_date", "total_amount", "return_eligible", "item_description"]
    return {k: v for k, v in raw_result.items() if k in relevant_fields}
```

- **Full conversation history:** the Claude API is stateless — each request must include the complete history (no server-side session state). The case facts block separates critical facts from summarisable narrative.
- **Upstream agent optimisation:** upstream agents should return structured data (key facts, citations, relevance scores; metadata: dates, source locations, methodological context) instead of verbose reasoning chains. Example: `{"claim": "Renewable energy investment grew 12% in 2023", "source": "IEA World Energy Report 2024", "sourceUrl": "...", "relevanceScore": 0.92, "publicationDate": "2024-01-15"}`.
- **Prompt caching:** mark a stable prefix with a `cache_control` breakpoint; the API stores and reuses the processed prefix, charging a fraction of the input cost for cached tokens. Caching matches prefix by prefix from the start — layout decides the hit. Order: static content first (system instructions, tool definitions, long reference docs), breakpoint at end of static block, volatile content after.

```python
messages = [{"role": "system", "content": [{"type": "text", "text": LONG_STATIC_INSTRUCTIONS}, {"type": "text", "text": REFERENCE_DOC, "cache_control": {"type": "ephemeral"}}]}, {"role": "user", "content": dynamic_user_message}]
```

- Wrong order = no cache hit → full price every call. Cache is short-lived: an `ephemeral` breakpoint lasts about **five minutes since last use** — pays off for bursts of related requests, not content reused hours apart.
- **Key concept:** the persistent case facts block is the single most important pattern in context window management — the fix for progressive summarisation.

### Exam Traps

- Thinking progressive summarisation is safe for transactional data — it systematically destroys numerical values, dates, and specific identifiers; a persistent case facts block must hold these outside summarised history.
- Assuming the 'lost in the middle' effect is solved by telling the model to pay attention to everything — the fix is structural (key findings at the beginning, explicit section headers); prompt-based reminders are unreliable for position effects.
- Keeping full tool results in context because 'the model might need them later' — untrimmed 40+ field lookups exhaust the token budget across turns; trim before results enter history.
- Believing conversation history can be selectively truncated without consequences — the API is stateless; each request needs complete history; use case facts blocks and summarisation instead of truncation.

### Practice Scenario

A customer support agent handles a multi-issue session. After several turns, the agent refers to 'your recent refund request' instead of the specific $247.83 refund for order #8891. The conversation history is being summarised between turns to manage context length. What is the most effective fix?

- A) Instruct the model to preserve all numerical values verbatim whenever it summarises the conversation history
- B) Extract transactional facts (amounts, dates, order numbers) into a persistent case facts block included in every prompt, outside summarised history
- C) Store the full conversation history in an external database and retrieve the relevant turns on demand whenever the agent needs to recall an earlier detail
- D) Increase the context window size so the full conversation history fits and summarisation never needs to run

### Build Exercise

**Build a Persistent Case Facts Context Manager** (~45 min). Learn: case facts blocks, tool trimming, the summarisation trap, lost-in-the-middle mitigation.

- Case facts extractor pulling only transactional data (amounts, dates, order numbers, statuses) from tool results.
- Persistent case facts block prepended to every prompt (section header delimiter), outside summarised history.
- Tool result trimmer: 40+ fields → ~5 relevant return fields (80–90% smaller).
- Test 6–8 turns with summarisation after turn 4; verify $247.83, #8891, March 3rd survive.
- Key findings summary at top of aggregated inputs, detailed results with section headers.

### Sources

- [Claude Certified Architect Foundations Exam Guide — Domain 5, Task Statement 5.1](https://anthropic-partners.skilljar.com/page/partner-certifications) — Anthropic
- [Anthropic API Documentation — Messages](https://docs.anthropic.com/en/api/messages) — Anthropic
- [Anthropic Prompt Engineering — Long Context Tips](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices) — Anthropic

---

## 5.2 — Escalation & Ambiguity Resolution

**Source:** https://claudecertificationguide.com/learn/5-context-management/5-2-escalation-ambiguity

### What You Need to Know

- Escalation calibration is make-or-break for support agents; miscalibration destroys first-contact resolution rates.
- **Three valid escalation triggers:**
  1. **Customer explicitly requests a human.** Honour immediately — absolute rule, no exceptions, no "Let me see if I can help you with that first."
  2. **Policy exceptions or gaps.** Request outside documented policy (e.g., competitor price matching when policy only covers own-site adjustments). Gaps ≠ violations: a violation (e.g., refund outside return window) has a documented answer ("no"); a gap means policy is silent — gaps escalate, violations don't.
  3. **Inability to make meaningful progress.** After a genuine attempt: tool errors local retry can't resolve, required system access the agent lacks, or a bug needing engineering. "I might not be able to handle this" isn't sufficient — must show it tried and failed.
- **Two unreliable triggers (anti-patterns):**
  - **Sentiment-based escalation:** frustration detection / negative sentiment scores are unreliable — frustration does not correlate with case complexity. A furious customer with a simple late delivery is easy to resolve (apologise, offer compensation, reship); a calm customer asking about competitor price matching needs human judgement on a policy gap.
  - **Self-reported confidence scores:** model outputs 1-10 confidence, escalate below threshold — unreliable because LLM self-confidence is poorly calibrated: incorrectly confident on hard cases (doesn't know what it doesn't know), uncertain on easy ones. This is the failure mode where the agent escalates simple cases while attempting complex ones.
- **Frustration nuance:** straightforward + frustrated → acknowledge, offer resolution ("I understand this is frustrating. I can process your replacement right now."), do NOT escalate. Reiterates preference for a human after help offered → escalate (declined agent resolution). Says "I want a human" from the start → escalate immediately, no investigation.
- **Ambiguous customer matching:** multiple matches (e.g., three "John Smith" records) → ask for additional identifiers (email address, phone number, order number, or other disambiguating info). MUST NOT select the most recent/active record or any heuristic — risks privacy violations (exposing one customer's data to another) or incorrect actions (refund on the wrong account). The only safe response is to ask for clarification.
- **Explicit escalation criteria in system prompts:** criteria + few-shot examples showing when to escalate (explicit human request, policy gap, inability to progress), when to resolve autonomously (straightforward case, frustrated but resolvable), and the escalation format (structured handoff: customer ID, root cause, recommended action). Prompt optimisation precedes architectural changes (classifiers, sentiment analysis).
- **Key concept:** three valid triggers — explicit human request, policy gaps (not just violations), inability to progress. Two unreliable — sentiment-based escalation, self-reported confidence scores.

### Exam Traps

- Sentiment-based escalation seems reasonable but is fundamentally unreliable — frustration does not correlate with case complexity.
- Self-reported confidence scores provide a reliable escalation signal — LLM self-confidence is poorly calibrated (incorrectly confident on hard cases, uncertain on easy ones).
- Attempting to resolve before honouring an explicit human request — escalate immediately, no investigation, no 'let me try first'; an absolute rule.
- Selecting from ambiguous customer matches using the most recent or most active record — heuristic selection risks privacy violations and incorrect actions; the only safe response is to ask for additional identifiers.

### Practice Scenario

A customer support agent achieves only 55% first-contact resolution, well below the 80% target. Logs show it escalates straightforward damage replacement cases while attempting to autonomously handle complex policy exception requests. What is the most effective improvement?

- A) Add explicit escalation criteria to the system prompt with few-shot examples demonstrating when to escalate versus resolve autonomously
- B) Deploy a separate classifier model trained on historical tickets to predict which requests need escalation
- C) Implement sentiment analysis to detect customer frustration and automatically escalate when negative sentiment exceeds a threshold
- D) Have the agent self-report a confidence score (1-10) and automatically route to humans when confidence falls below a threshold

### Build Exercise

**Build an Escalation Decision Engine** (~40 min). Learn: the three valid / two unreliable triggers, frustration nuance, disambiguation, few-shot criteria.

- System prompt with explicit criteria for all three triggers (description + decision rule) plus the two anti-patterns listed as things to avoid.
- Three few-shot examples: immediate escalation (human request); autonomous resolution (frustrated + straightforward); escalation (policy gap).
- Ambiguous customer matching requesting additional identifiers (email, phone, order number), never heuristics.
- Test four scenarios: frustrated + simple; calm + policy exception; explicit human request; ambiguous match.
- Verify no investigation before honouring an explicit human request; no heuristic selection from ambiguous matches.

### Sources

- [Claude Certified Architect Foundations Exam Guide — Domain 5, Task Statement 5.2](https://anthropic-partners.skilljar.com/page/partner-certifications) — Anthropic
- [Anthropic Agent SDK Documentation — Human-in-the-loop](https://code.claude.com/docs/en/agent-sdk/user-input) — Anthropic
- [Anthropic Customer Support Best Practices](https://docs.anthropic.com/en/docs/about-claude/use-case-guides/customer-support-chat) — Anthropic

---

## 5.3 — Error Propagation in Multi-Agent Systems

**Source:** https://claudecertificationguide.com/learn/5-context-management/5-3-error-propagation

### What You Need to Know

- Error propagation determines whether a multi-agent system recovers gracefully or fails silently. When a subagent fails (timeout, permission error, invalid query), how the failure flows back to the coordinator dictates reliability.
- **Structured error context — four required elements:**
  1. **Failure type:** transient (timeout, rate limit — may succeed on retry), validation (bad input — fix the query), business (rule violation — escalate or find alternative), permission (access denied — cannot be retried without authorisation changes).
  2. **What was attempted:** specific query, parameters, target system. "Searched academic database for 'renewable energy policy' with date range 2022-2024" is actionable; "Search failed" is not.
  3. **Partial results gathered before failure:** e.g., 3 of 5 sources retrieved before timeout are valuable — discarding them is wasteful.
  4. **Potential alternative approaches:** e.g., try a different database, broaden search terms, check cached results.

```json
{"status": "partial_failure", "failureType": "transient", "attemptedAction": {"tool": "search_academic_db", "query": "renewable energy policy", "dateRange": "2022-2024"}, "partialResults": [{"title": "EU Renewable Energy Directive 2023", "source": "EUR-Lex", "retrieved": true}], "alternativeApproaches": ["Retry with narrower date range (2023-2024)", "Search alternative database: government_publications", "Use cached results from previous research session"]}
```

- **Anti-pattern 1: silent suppression** — empty results marked as success (e.g., `{"results": [], "status": "success"}` after a timeout). Coordinator believes the search found nothing → never retries; synthesis silently omits an area; output looks correct with undetectable gaps (e.g., "no orders found" when the lookup system was down). Worst anti-pattern.
- **Anti-pattern 2: workflow termination** — killing the whole pipeline on one failure, wasting completed work from other subagents. Middle ground: structured error propagation — report, assess, continue with partial results or targeted recovery.
- **Access failure vs valid empty result:** access failure = tool couldn't reach the source (timeout, connection error, permission denial), search did not execute → consider retry. Valid empty result = tool executed the query, found no matches → this IS the answer, no retry. Conflating: treat failure as empty → never retry when you should; treat empty as failure → waste time retrying a query that always returns nothing.

```python
# Access failure — consider retry
{"status": "error", "failureType": "transient", "message": "Connection timeout after 30s", "shouldRetry": True}
# Valid empty result — no retry needed
{"status": "success", "results": [], "message": "Query executed successfully. No matching records found.", "shouldRetry": False}
```

- **Coverage annotations:** synthesis should note well-supported topics and gaps (e.g., "Section on geothermal energy is limited due to unavailable journal access during research") — otherwise a gap looks like irrelevance rather than unavailability.
- **Local recovery for transient failures:** subagents retry / fall back / degrade locally; only propagate errors they can't resolve, always with what was attempted and partial results. Keeps coordinator complexity low.
- **Key concept:** structured error context enables intelligent recovery. Anti-patterns: silent suppression and workflow termination. Access failures need retry consideration; valid empty results do not.

### Exam Traps

- Catching a timeout and returning empty results marked as successful — silent suppression prevents all recovery; the coordinator believes the search succeeded and will never attempt alternatives. Worst anti-pattern.
- Terminating the entire research pipeline when one subagent times out — wastes partial results from subagents that completed successfully; the coordinator should assess the failure and decide targeted recovery.
- Returning a generic 'search unavailable' status after retry exhaustion — generic errors hide the query, partial results, and alternatives; structured error context enables informed recovery.
- Retrying a valid empty result because it looks like a failure — the query executed successfully and found no matches; this IS the answer. Retrying wastes time on a query that always returns nothing.

### Practice Scenario

A web search subagent in a multi-agent research system times out while researching a complex topic. You need to design how this failure information flows back to the coordinator. Which approach best enables intelligent recovery?

- A) Catch the timeout and return an empty result set marked as successful
- B) Propagate the timeout exception to a top-level handler that terminates the entire research workflow
- C) Return structured error context including failure type, attempted query, partial results, and potential alternative approaches
- D) Implement automatic retry with exponential backoff, returning a generic search unavailable status only after all retries are exhausted

### Build Exercise

**Build a Structured Error Propagation System** (~50 min). Learn: four-element error context, access failure vs empty result, the two anti-patterns, local retry, coverage annotations.

- Schema: failureType (transient/validation/business/permission enum), attemptedAction (tool, query, parameters), partialResults (array), alternativeApproaches (string array).
- Subagent distinguishing access failures (shouldRetry: true) from valid empty results (success + empty, shouldRetry: false).
- Local retry for transient failures — 3 retries, exponential backoff (1s, 2s, 4s) before propagating; preserve partial results.
- Coordinator: retry with modified query / alternative / proceed with partial results; handle all four failure types; never silently suppress.
- Coverage annotations: well-supported / limited (reason) / unavailable (reason); failed subagent topics explicitly noted.

### Sources

- [Claude Certified Architect Foundations Exam Guide — Domain 5, Task Statement 5.3](https://anthropic-partners.skilljar.com/page/partner-certifications) — Anthropic
- [Anthropic Multi-Agent Patterns](https://www.anthropic.com/engineering/built-multi-agent-research-system) — Anthropic

---

## 5.4 — Codebase Exploration & Context Degradation

**Source:** https://claudecertificationguide.com/learn/5-context-management/5-4-codebase-exploration

### What You Need to Know

- Large codebase exploration is one of the most context-intensive tasks. Extended sessions create **context degradation** — nothing to do with running out of tokens; the model loses its grip on earlier findings as context fills with verbose discovery output.
- **Symptom:** the model references "typical patterns" instead of the specific classes/methods/dependency chains it discovered (e.g., "the `OrderRepository` class at `src/repos/order.ts` implements the base `Repository<T>` interface with custom caching in the `findById` method" → "this follows the typical repository pattern").
- **Why:** (1) each step generates verbose output (file contents, search results, directory listings); (2) it accumulates; (3) earlier precise discoveries get pushed deeper while recent verbose output dominates; (4) attention shifts, specifics lost. **Critical insight:** not a token limit problem — a larger window still fills with verbose output.
- **Scratchpad files (primary mitigation):** agents write key findings to a file and reference it for subsequent questions — knowledge persists outside the conversation context, immune to degradation. Maintain from the **start** of any extended session (deliberate strategy, not a rescue move). Example contents: key classes (`OrderRepository` at `src/repos/order.ts` — implements Repository<T>, custom findById caching), dependency chains (`RefundProcessor → OrderService → OrderRepository → PostgreSQL`; `RefundProcessor → PaymentGateway → Stripe API`), findings (no retry logic for Stripe failures; missing cache invalidation on status change; coverage OrderService 87%, RefundProcessor 12%).
- **Subagent delegation (second mitigation):** delegate specific questions (find test files + coverage; trace refund flow endpoint→database; identify external API integrations + error handling). Each subagent explores verbosely in its own isolated context and returns a structured summary. The real value is **context isolation**, not parallelisation.
- **Summary injection between phases:** summarise Phase 1 key findings and inject them into Phase 2 subagents' initial context — prevents the "cold start" problem (duplicated Phase 1 exploration) and gives Phase 2 agents architectural understanding.
- **`/compact` command:** Claude Code's `/compact` summarises the conversation, freeing space while preserving key information. Use **proactively** during extended sessions — it protects context quality, not only quantity.
- **Crash recovery via structured state manifests:** agents export current state to a known manifest file (explored files/searches, key findings, current phase and next steps, pending questions). On resume, the coordinator loads and injects the manifest into agent prompts.

```json
{"sessionId": "explore-order-service-001", "phase": 2, "exploredPaths": ["src/repos/order.ts", "src/services/order.ts", "src/services/refund.ts"], "keyFindings": {"architecture": "Layered: Controllers → Services → Repositories → DB", "criticalIssue": "RefundProcessor has no retry logic for Stripe API failures", "testCoverage": {"OrderService": "87%", "RefundProcessor": "12%"}}, "nextSteps": ["Investigate PaymentGateway error handling", "Review RefundProcessor test files", "Check cache invalidation logic in OrderRepository"]}
```

- **Key concept:** context degradation is not a token limit problem. Scratchpad files persist key discoveries; subagent delegation isolates verbose exploration; crash recovery manifests prevent progress loss.

### Exam Traps

- Increasing the context window to solve context degradation — it's not about running out of tokens; a larger window still fills with verbose output.
- Assuming subagent delegation is only about parallelisation — the primary benefit for codebase exploration is context isolation.
- Restarting a session to fix context degradation without saving state — restarting loses all accumulated knowledge; use scratchpad files and state manifests, then inject them into the new session.
- Using /compact only when hitting context limits — use it proactively to maintain context quality, not just as a last resort.

### Practice Scenario

A developer productivity agent is exploring an unfamiliar codebase. After investigating several modules, it starts referencing 'typical repository patterns' instead of the specific class names and dependency chains it discovered earlier. What is the most effective mitigation?

- A) Increase the model context window so more of the discovery output can be retained during exploration
- B) Have the agent maintain scratchpad files recording key findings and reference them for subsequent questions
- C) Restart the session with a fresh context and ask the agent to explore the codebase more efficiently this time
- D) Pre-load the entire codebase structure into the initial context so exploration has less to rediscover

### Build Exercise

**Build a Context-Resilient Codebase Explorer** (~60 min). Learn: degradation as an attention problem, scratchpads, delegation for context isolation, crash recovery, phase summary injection.

- Coordinator delegating exploration tasks to subagents returning structured summaries (key findings, file paths, class names).
- Scratchpad management: write structured findings (specific class names, paths, dependency chains) after each step; read before each next step.
- Summary injection: Phase 1 summary (architecture, key concerns, Phase 2 targets) into every Phase 2 subagent's prompt.
- Crash recovery: JSON manifest (session ID, phase, explored paths, key findings, next steps) loaded and injected on resume.
- Test: without scratchpads (degrades to generic references after 4–5 modules) vs with scratchpads (specifics maintained throughout).

### Sources

- [Claude Certified Architect Foundations Exam Guide — Domain 5, Task Statement 5.4](https://anthropic-partners.skilljar.com/page/partner-certifications) — Anthropic
- [Claude Code Documentation — Context Management](https://code.claude.com/docs/en/context-window) — Anthropic
- [Claude Code Documentation — Commands](https://code.claude.com/docs/en/commands) — Anthropic

---

## 5.5 — Human Review & Confidence Calibration

**Source:** https://claudecertificationguide.com/learn/5-context-management/5-5-human-review-calibration

### What You Need to Know

- Human review is the safety net for automated extraction/classification systems. The core challenge: allocate limited reviewer capacity to maximise accuracy while minimising cost — via confidence calibration, awareness of the aggregate metrics trap, stratified sampling.
- **The aggregate metrics trap:** 97% overall accuracy can hide catastrophic per-type failures. Example date-extraction accuracy: standard invoices 99.5%, handwritten receipts 60%, scanned PDFs with poor OCR 72%, international documents with non-standard formatting 45%. Failing segments often have the highest business impact (handwritten receipts from field staff, international invoices from new suppliers, scanned historical documents for compliance audits). **Rule: always validate accuracy by document type AND field segment before automating; never decide on aggregate metrics alone.**

| Document Type | Date | Amount | Name |
|---|---|---|---|
| Standard invoices | 99.5% | 98.2% | 97.8% |
| Handwritten receipts | 60.1% | 55.3% | 71.2% |
| Scanned PDFs | 72.4% | 69.8% | 80.1% |
| International formats | 45.2% | 52.1% | 63.4% |
| **Aggregate** | **97.0%** | **96.1%** | **95.8%** |

- Aggregate looks excellent because standard invoices dominate volume; three types are unacceptable, hidden by the volume-weighted average.
- **Stratified random sampling:** select a representative sample from each stratum (document type, confidence band, field type) and have humans verify it. **You must sample high-confidence extractions too** — low-confidence items are already routed to review; high-confidence items are automated, so only stratified sampling catches novel error patterns affecting them. Two purposes: (1) ongoing accuracy measurement; (2) novel error pattern detection. Without it, a systematic error on a new document format goes unnoticed until downstream processes fail.
- **Field-level confidence calibration:** the model can output per-field confidence (e.g., `{"vendorName": {"value": "Acme Corp", "confidence": 0.98}, "invoiceDate": {"value": "2024-03-15", "confidence": 0.95}, "totalAmount": {"value": "$1,247.83", "confidence": 0.72}, "lineItems": {"value": [...], "confidence": 0.61}}`). Raw scores are NOT calibrated — 0.95 confidence might be correct 88% or 99% of the time depending on field type.
- **Calibration requires labelled validation sets (ground truth):** compare confidence to actual accuracy and build a calibration curve (e.g., 0.90 on date fields → 94% actual accuracy; 0.90 on amount fields → 82%). Calibrated thresholds drive routing:
  - Above threshold → automated (with stratified sampling)
  - Below threshold → human review
  - Ambiguous zone → prioritised human review
- **Reviewer capacity prioritisation:** reviewers are expensive and limited. Route the highest-uncertainty items first: low model confidence fields; extractions from ambiguous/contradictory source documents; document types with historically poor accuracy; fields with multiple possible interpretations. Do NOT spread capacity evenly. Prioritisation must be **dynamic**: order the queue by uncertainty; next item served = highest-uncertainty remaining, not chronological.
- **Validation before automation sequence:** (1) measure accuracy by document type and field segment — not aggregate; (2) calibrate confidence scores with labelled validation sets; (3) set calibrated thresholds for automation vs human review; (4) implement stratified random sampling for ongoing verification; (5) only then reduce human review on segments with consistent, validated accuracy. Skipping to step 5 on aggregate metrics is the trap.
- **Key concept:** 97% aggregate can hide 40% error rates per type. Validate by type AND field. Calibrate with labelled sets. Sample high-confidence extractions. Prioritise reviewer capacity on the highest-uncertainty items.

### Exam Traps

- Using aggregate accuracy (e.g., 97%) to justify automating all high-confidence extractions — aggregate metrics hide per-type performance; validate by document type and field segment before automating.
- Only sampling low-confidence extractions for human review — high-confidence extractions are automated; only stratified random sampling of high-confidence items will detect novel error patterns.
- Using raw model confidence scores without calibration — 0.90 on dates might mean 94% actual accuracy, 0.90 on amounts only 82%; calibrate using labelled validation sets.
- Spreading reviewer capacity evenly across all extractions — wastes time on high-confidence items; prioritise the highest-uncertainty items where human judgement adds the most value.

### Practice Scenario

A structured data extraction system achieves 97% overall accuracy across all document types. The team proposes automating all extractions where model confidence exceeds 95% to reduce human review costs. What is the critical risk in this approach?

- A) Automated extractions should always receive human review regardless of the confidence score, which makes the proposal fundamentally flawed no matter where the threshold is set
- B) The 95% confidence threshold is too low for automation and should be raised to 99% before any extractions bypass human review
- C) The model will become overconfident as it processes more documents over time, so the system will require regular retraining to stay calibrated
- D) Aggregate accuracy may mask poor performance on specific document types or fields, and confidence scores need calibration against labelled validation sets before use

### Build Exercise

**Build a Confidence-Calibrated Review Router** (~50 min). Learn: aggregate metrics trap, per-type/per-field tracking, calibration, stratified sampling, dynamic queueing.

- Mock extraction system outputting field-level confidence (0.0–1.0) for ≥4 document types (invoices, receipts, scanned PDFs, international) with different confidence distributions.
- Accuracy tracking per type and field: standard invoices 95%+, handwritten receipts and international documents 40–70%, aggregate 90%+.
- Calibration module: labelled validation set → calibrated thresholds per field type per document type (calibration curve).
- Stratified random sampling per stratum (type and confidence band), including high-confidence automated extractions, proportional to volume.
- Review router: priority queue ordered by uncertainty (lowest confidence first), dynamic reorder as items arrive; never chronological.

### Sources

- [Claude Certified Architect Foundations Exam Guide — Domain 5, Task Statement 5.5](https://anthropic-partners.skilljar.com/page/partner-certifications) — Anthropic
- [Anthropic Structured Data Extraction Guide](https://code.claude.com/docs/en/agent-sdk/structured-outputs) — Anthropic
- [Anthropic Human-in-the-Loop Patterns](https://code.claude.com/docs/en/agent-sdk/user-input) — Anthropic

---

## 5.6 — Information Provenance & Multi-Source Synthesis

**Source:** https://claudecertificationguide.com/learn/5-context-management/5-6-information-provenance

### What You Need to Know

- Information provenance — knowing where every claim comes from and how confident to be in it — separates trustworthy research systems from those producing plausible-sounding fiction.
- **Structured claim-source mappings:** every finding must carry provenance — the structural guarantee the output is traceable to specific sources. Required: claim (assertion), source URL, document name, relevant excerpt, publication date.

```json
{"claim": "Global renewable energy investment reached $495 billion in 2023", "sourceUrl": "https://example.com/iea-report-2024", "documentName": "IEA World Energy Investment Report 2024", "relevantExcerpt": "Total investment in renewable energy technologies reached approximately $495 billion in calendar year 2023, representing a 17% increase over 2022.", "publicationDate": "2024-06-15"}
```

- **Attribution dies during summarisation:** synthesis agents naturally compress and paraphrase; without explicit instructions to preserve mappings, output degrades to "Investment in renewable energy has grown significantly" — no amount, source, or date.
- **Downstream agents must explicitly preserve and merge claim-source mappings:** (1) subagents output structured findings; (2) the synthesis agent maintains mappings when combining; (3) final output has inline citations or a structured reference section tracing each claim.
- **Conflict handling:** two credible sources, different stats (A: 12% growth; B: 8% growth) — wrong: arbitrarily select one (more recent, average, or more authoritative). **Correct: annotate both values with full attribution; let the consumer decide.** Example: `- **12% growth** — IEA World Energy Report (published June 2024, using 2023 calendar year data)` / `- **8% growth** — Bloomberg NEF Annual Review (published March 2024, using July 2022–June 2023 data)`, noting the difference may reflect reporting periods/methodologies. Arbitrarily selecting one destroys information and presents false certainty.
- **Temporal awareness:** different publication dates explain different numbers — not contradiction. Source A (2023): 8% growth; Source B (2024): 12% growth — with dates a trend (accelerated 8% → 12%), without dates contradictory. **Require publication/data collection dates in all structured outputs** — otherwise valid trends are misread as data quality issues and consistent findings flagged/suppressed.
- **Content-appropriate rendering:** don't flatten everything into one format. **Financial data → Tables** (e.g., Year / Investment ($B) / Growth (%): 2021: 366/12%; 2022: 423/16%; 2023: 495/17%). **News/current events → Prose** (narrative context, cause-and-effect, chronological developments). **Technical findings → Structured lists** (architectural patterns, API specs, config options). Forcing a single format degrades readability.
- **Attribution preservation through multi-step synthesis:** (1) research subagent collects findings with mappings; (2) analysis subagent evaluates, preserving mappings; (3) synthesis subagent merges mappings — **the most common failure point** (paraphrases without carrying mappings; its prompt must explicitly require every claim be traceable); (4) report generation with inline citations. Distinguish well-established findings from contested ones, preserving source characterisations and methodology — a finding from three independent sources differs from one based on a single report.
- **Completing analysis with conflicts intact:** the analysis agent must finish with conflicts included and explicitly annotated; resolution belongs to the coordinator or consumer. Example: `{"field": "annualRevenue", "conflictDetected": true, "values": [{"value": "$4.2M", "source": "Annual Report 2023", "context": "Audited financial statements, fiscal year ending December 2023"}, {"value": "$3.8M", "source": "SEC Filing Q4 2023", "context": "Preliminary unaudited figures, calendar year 2023"}], "possibleExplanation": "Difference may reflect audited vs preliminary figures and fiscal vs calendar year reporting periods"}`. The coordinator then decides: present both, investigate further, or escalate to a human analyst.
- **Key concept:** every claim needs claim + source URL + document name + excerpt + publication date. Conflicts → annotate both values, never arbitrarily pick one. Different dates explain different numbers. Tables for financial data, prose for news, lists for technical findings.

### Exam Traps

- Selecting the most recent source when two credible sources conflict — arbitrarily selecting one value destroys information; annotate both values with source attribution and publication dates; let the consumer decide.
- Assuming different numbers from different sources are contradictions — different publication/data collection dates often explain different numbers; require dates in structured outputs.
- Allowing the synthesis agent to paraphrase without preserving claim-source mappings — attribution dies during summarisation; the synthesis agent must explicitly preserve and merge mappings or the output is untraceable.
- Rendering all content types in a uniform format — financial data is best as tables, news as prose, technical findings as structured lists; flattening degrades readability and comprehension.

### Practice Scenario

A multi-agent research system produces a synthesis report on market trends. Two credible sources report different growth rates: Source A reports 12% growth (2023 data) and Source B reports 8% growth (2024 data). The synthesis agent currently selects the more recent value. What is the correct approach?

- A) Flag the conflict and escalate to a human researcher for resolution before including either figure in the report
- B) Average the two values and report 10% growth, with a footnote recording the variance between the two sources
- C) Always use the most recent source, since the later publication date makes it the more reliable reflection of current market conditions
- D) Annotate both values with source attribution and publication dates, letting the consumer decide how to interpret the difference

### Build Exercise

**Build a Provenance-Preserving Synthesis Pipeline** (~60 min). Learn: claim-source schema, attribution preservation, conflict annotation, temporal awareness, content-appropriate rendering.

- Schema with five required fields: claim, sourceUrl, documentName, relevantExcerpt, publicationDate.
- Two research subagents each returning an array of ClaimSourceMapping objects with all fields populated (incl. publication dates).
- Synthesis agent merging findings while explicitly preserving all mappings — every claim traceable via inline citations or a reference section (step 3 is the most common failure point).
- Conflict handling: detect overlapping claims with different values, preserve both with full attribution and a possible explanation (temporal/methodological); never silently pick one.
- Content-appropriate rendering: financial data as tables (year, value, source columns), news as prose, technical findings as bulleted lists.

### Sources

- [Claude Certified Architect Foundations Exam Guide — Domain 5, Task Statement 5.6](https://anthropic-partners.skilljar.com/page/partner-certifications) — Anthropic
- [Anthropic Multi-Agent Research Patterns](https://www.anthropic.com/engineering/built-multi-agent-research-system) — Anthropic
- [Anthropic Prompt Engineering — Citation and Attribution](https://platform.claude.com/docs/en/build-with-claude/citations) — Anthropic
