const safeName = value => value.replace(/[^A-Za-z0-9]/g, '') || 'Guide'

const CATEGORY_CONTENT = {
  Agents: {
    scenarios: [
      { title: 'Support ticket triage', situation: 'A new customer ticket arrives with a priority, product area, and sentiment.', approach: 'The agent classifies the request, retrieves the account context, chooses an approved action, and records a trace before replying.', outcome: 'Faster first response without allowing the model to directly mutate production data.' },
      { title: 'Operations incident assistant', situation: 'An engineer asks why a service is unhealthy during an incident.', approach: 'The agent reads read-only metrics and logs, summarizes evidence, and suggests the next diagnostic step.', outcome: 'Human operators stay in control while repetitive investigation is automated.' },
      { title: 'Document-to-action workflow', situation: 'A contract, invoice, or form is uploaded for processing.', approach: 'The workflow extracts fields, validates confidence, routes exceptions to a person, and stores an audit record.', outcome: 'A measurable workflow with a safe human-review path.' },
    ],
    code: `from dataclasses import dataclass\nfrom typing import Callable\n\n@dataclass\nclass ToolResult:\n    name: str\n    value: str\n    needs_review: bool = False\n\ndef classify_ticket(text: str) -> str:\n    urgent = {"outage", "security", "payment failed"}\n    return "urgent" if any(word in text.lower() for word in urgent) else "normal"\n\ndef run_agent(task: str, tools: dict[str, Callable[[str], str]]) -> list[ToolResult]:\n    priority = classify_ticket(task)\n    results = [ToolResult("classify", priority)]\n    if priority == "urgent":\n        results.append(ToolResult("notify_on_call", tools["notify_on_call"](task)))\n    else:\n        results.append(ToolResult("draft_reply", tools["draft_reply"](task), needs_review=True))\n    return results\n\nprint(run_agent(\n    "Payment failed for every customer",\n    {"notify_on_call": lambda text: "on-call notified",\n     "draft_reply": lambda text: "draft ready"},\n))`,
  },
  RAG: {
    scenarios: [
      { title: 'Internal knowledge assistant', situation: 'Employees ask questions about policies, runbooks, and product documentation.', approach: 'Relevant passages are retrieved with metadata filters, then cited in the answer.', outcome: 'Answers stay grounded and users can verify the source.' },
      { title: 'Technical support search', situation: 'A support agent needs the correct troubleshooting step across thousands of resolved cases.', approach: 'The query is embedded, similar chunks are ranked, and only the best context is sent to the model.', outcome: 'Less hallucination and shorter support handling time.' },
      { title: 'Contract review', situation: 'A legal team wants to locate renewal clauses and obligations in a document set.', approach: 'Documents are chunked by section, filtered by customer and date, and returned with page references.', outcome: 'Search becomes auditable instead of a black-box summary.' },
    ],
    code: `from dataclasses import dataclass\nimport math\n\n@dataclass\nclass Chunk:\n    text: str\n    source: str\n    vector: list[float]\n\ndef cosine(a: list[float], b: list[float]) -> float:\n    dot = sum(x * y for x, y in zip(a, b))\n    norm = math.sqrt(sum(x * x for x in a) * sum(y * y for y in b))\n    return dot / norm if norm else 0.0\n\ndef retrieve(query_vector: list[float], chunks: list[Chunk], top_k=3):\n    ranked = sorted(chunks, key=lambda c: cosine(query_vector, c.vector), reverse=True)\n    return ranked[:top_k]\n\nchunks = [\n    Chunk("Rotate the API key from the settings page.", "runbook.md#keys", [1, 0, 0]),\n    Chunk("Invoices are retained for seven years.", "policy.md#retention", [0, 1, 0]),\n    Chunk("Use the staging endpoint for test requests.", "api.md#staging", [0, 0, 1]),\n]\nfor hit in retrieve([.9, .1, 0], chunks):\n    print(f"[{hit.source}] {hit.text}")`,
  },
  Models: {
    scenarios: [
      { title: 'Consistent extraction', situation: 'A company receives thousands of emails and needs structured fields from each one.', approach: 'A model is prompted or fine-tuned to return a schema, then the output is validated before storage.', outcome: 'Downstream systems receive predictable data instead of free-form text.' },
      { title: 'Domain-specific assistant', situation: 'General models know the language but miss the organization’s terminology.', approach: 'Curated examples, evaluation sets, and parameter-efficient tuning improve domain behavior.', outcome: 'Quality improves without training a model from scratch.' },
      { title: 'Cost-aware inference', situation: 'A product has simple and complex requests with different latency budgets.', approach: 'Route easy requests to a smaller model and reserve the larger model for uncertain cases.', outcome: 'Lower cost while protecting quality on difficult tasks.' },
    ],
    code: `from dataclasses import dataclass\n\n@dataclass\nclass RouteDecision:\n    model: str\n    reason: str\n\ndef choose_model(prompt: str) -> RouteDecision:\n    words = len(prompt.split())\n    if "legal" in prompt.lower() or words > 150:\n        return RouteDecision("large-model", "complex or high-risk request")\n    return RouteDecision("small-model", "short, low-risk request")\n\nfor prompt in ["Summarize this order", "Review this legal contract for renewal risk"]:\n    print(prompt, "=>", choose_model(prompt))`,
  },
  ProductionAI: {
    scenarios: [
      { title: 'Release a model-backed feature', situation: 'A team wants to ship an AI feature without losing visibility into failures.', approach: 'The service records latency, token usage, model version, feedback, and safety outcomes for every request.', outcome: 'The team can compare releases and roll back safely.' },
      { title: 'Human review for uncertainty', situation: 'Some predictions are useful but not reliable enough for automatic action.', approach: 'Confidence thresholds route uncertain cases to a reviewer and capture the final label.', outcome: 'Automation grows while risk remains bounded.' },
      { title: 'Evaluation before deployment', situation: 'A prompt or model change may improve one task and regress another.', approach: 'A fixed test set runs in CI with quality, safety, latency, and cost thresholds.', outcome: 'Changes are measured before users experience them.' },
    ],
    code: `from dataclasses import dataclass\nfrom time import perf_counter\n\n@dataclass\nclass Prediction:     label: str\n    confidence: float\n\ndef review_gate(prediction: Prediction, threshold=.85) -> str:\n    return "auto-approve" if prediction.confidence >= threshold else "human-review"\n\ndef instrument(call, *args, **kwargs):\n    started = perf_counter()\n    result = call(*args, **kwargs)\n    elapsed_ms = (perf_counter() - started) * 1000\n    print({"latency_ms": round(elapsed_ms, 2), "route": review_gate(result)})\n    return result\n\nresult = instrument(lambda: Prediction("refund", .78))\nprint(result)`,
  },
  Frontend: {
    scenarios: [
      { title: 'Streaming assistant UI', situation: 'A user should see an AI response as it is generated instead of waiting for one large payload.', approach: 'The browser opens a streaming connection, appends tokens to local state, and shows cancellation and retry controls.', outcome: 'The interface feels responsive and failures are recoverable.' },
      { title: 'AI review dashboard', situation: 'Reviewers need to inspect model outputs alongside the source record.', approach: 'A component separates input, output, citations, confidence, and reviewer action.', outcome: 'Human decisions are easier to audit and improve.' },
      { title: 'Progressive enhancement', situation: 'The core workflow must still work when JavaScript or the AI service is unavailable.', approach: 'Start with a normal form and add asynchronous enhancement around it.', outcome: 'The product remains usable under degraded conditions.' },
    ],
    code: `import { useState } from 'react'\n\nexport default function ReviewPanel({ request }) {\n  const [decision, setDecision] = useState('pending')\n\n  async function approve() {\n    setDecision('saving')\n    const response = await fetch('/api/reviews', {\n      method: 'POST',\n      headers: { 'Content-Type': 'application/json' },\n      body: JSON.stringify({ requestId: request.id, decision: 'approved' }),\n    })\n    setDecision(response.ok ? 'approved' : 'failed')\n  }\n\n  return <section aria-live="polite">\n    <h2>{request.title}</h2>\n    <p>{request.explanation}</p>\n    <button disabled={decision === 'saving'} onClick={approve}>\n      {decision === 'approved' ? 'Approved' : 'Approve'}\n    </button>\n  </section>\n}`,
  },
  Backend: {
    scenarios: [
      { title: 'Secure inference endpoint', situation: 'A web or mobile client needs a prediction without receiving provider credentials.', approach: 'The backend authenticates the user, validates the request, calls the model, and applies rate limits.', outcome: 'Secrets stay server-side and usage can be monitored per tenant.' },
      { title: 'Background document processing', situation: 'Uploading a document should not block the HTTP request for several minutes.', approach: 'The API creates a job, a worker processes it, and the client polls or subscribes to status.', outcome: 'Reliable asynchronous work with clear progress states.' },
      { title: 'Tenant-aware data access', situation: 'One AI service serves multiple organizations with separate data.', approach: 'Tenant identity is derived from authentication and applied to every database and retrieval query.', outcome: 'Isolation is enforced in the server boundary.' },
    ],
    code: `from fastapi import FastAPI, Header, HTTPException\nfrom pydantic import BaseModel\n\napp = FastAPI()\n\nclass InferenceRequest(BaseModel):\n    text: str\n\n@app.post('/v1/classify')\nasync def classify(body: InferenceRequest, x_tenant_id: str | None = Header(default=None)):\n    if not x_tenant_id:\n        raise HTTPException(401, 'Tenant authentication is required')\n    if not body.text.strip():\n        raise HTTPException(422, 'text must not be empty')\n\n    # Replace with a model call; never expose provider keys to the client.\n    label = 'priority' if 'urgent' in body.text.lower() else 'standard'\n    return {'tenant': x_tenant_id, 'label': label, 'model_version': 'demo-1'}`,
  },
  Foundations: {
    scenarios: [
      { title: 'Define a reliable AI task', situation: 'A team says it wants to “add AI” but cannot agree on what success means.', approach: 'Turn the idea into an input, output, user, constraint, baseline, and measurable acceptance test.', outcome: 'The team can compare AI performance with a real non-AI baseline.' },
      { title: 'Prompt regression testing', situation: 'A prompt works in a demo but changes behavior after editing.', approach: 'Keep representative cases in version control and test exact requirements on every change.', outcome: 'Prompt improvements become repeatable engineering work.' },
      { title: 'Confidence-aware UX', situation: 'The same model output should not be treated equally in every context.', approach: 'Expose uncertainty and route high-impact actions through confirmation or review.', outcome: 'Users get assistance without false certainty.' },
    ],
    code: `from dataclasses import dataclass\n\n@dataclass\nclass TestCase:\n    prompt: str\n    expected_words: tuple[str, ...]\n\ndef passes(output: str, case: TestCase) -> bool:\n    normalized = output.lower()\n    return all(word.lower() in normalized for word in case.expected_words)\n\ncases = [\n    TestCase('Explain a refund policy', ('refund', 'customer')),\n    TestCase('Summarize an outage', ('impact', 'next step')),\n]\noutputs = ['The refund customer should receive money.', 'Impact is high. Next step is rollback.']\nprint([passes(output, case) for output, case in zip(outputs, cases)])`,
  },
}

const FALLBACK = {
  scenarios: [
    { title: 'Production workflow', situation: `A team needs to introduce ${'{title}'} into a customer-facing workflow.`, approach: 'Start with a small boundary, validate inputs, capture outputs, and keep a human or rollback path for failures.', outcome: 'The feature can be measured and improved without making the whole system depend on an untested component.' },
    { title: 'Data pipeline integration', situation: 'Events arrive from an API, queue, file upload, or database.', approach: 'Normalize the input, run the technology in an isolated step, validate the result, and publish an explicit status.', outcome: 'Retries and monitoring are possible because each stage has a clear contract.' },
    { title: 'Team handoff', situation: 'Another developer must operate the solution after the prototype is complete.', approach: 'Document assumptions, provide a local example, add tests, and record common failure modes.', outcome: 'The example becomes maintainable engineering work rather than a one-off demo.' },
  ],
  code: `from dataclasses import dataclass\nfrom datetime import datetime, timezone\n\n@dataclass\nclass JobResult:\n    topic: str\n    status: str\n    created_at: str\n    details: str\n\ndef process(topic: str, payload: dict) -> JobResult:\n    if not payload:\n        raise ValueError('payload must not be empty')\n    return JobResult(\n        topic=topic,\n        status='completed',\n        created_at=datetime.now(timezone.utc).isoformat(),\n        details=f'Processed {len(payload)} fields',\n    )\n\nprint(process('GUIDE_TITLE', {'user_id': 42, 'value': 'example'}))`,
}

export function getGuideEnhancement(page) {
  const template = CATEGORY_CONTENT[page.category] || FALLBACK
  const replaceTitle = value => value.replaceAll('{title}', page.title).replaceAll('GUIDE_TITLE', page.title)
  return {
    title: page.title,
    category: page.category,
    summary: `A practical companion to ${page.title}: connect the original guide to a realistic workflow, then adapt the lab to your own system.`,
    scenarios: template.scenarios.map(scenario => ({ ...scenario, situation: replaceTitle(scenario.situation), approach: replaceTitle(scenario.approach), outcome: replaceTitle(scenario.outcome) })),
    code: replaceTitle(template.code),
    codeTitle: page.category === 'Frontend' ? 'A review component with a safe API boundary' : `A small ${page.title} integration pattern`,
    checklist: ['Define the input and expected output before writing the integration', 'Keep secrets, permissions, and user data at the correct trust boundary', 'Log useful metadata without recording sensitive content', 'Test success, timeout, invalid input, and retry behavior', 'Measure quality, latency, cost, and human overrides'],
  }
}
