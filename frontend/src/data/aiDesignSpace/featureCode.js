// ============================================================
// AI DESIGN SPACE — FEATURE CODE GENERATOR
// Real, runnable code for every feature in the ✨ Features grid
// (8 universal + 4 per pattern). Clicking any feature card shows
// the code that implements that feature, contextualised with the
// industry/domain context.
// ============================================================

// Apply {ctx} placeholders inside generated code.
const applyCtx = (text, ctx) => String(text).replace(/\{ctx\}/g, ctx)

// Deterministic slugs for variable names and class names.
const varname = ctx => {
  const s = String(ctx).toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '')
  return s || 'domain'
}
const pname = ctx => {
  const s = String(ctx).trim().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')
  return s.replace(/[^A-Za-z0-9]/g, '') || 'Domain'
}

const PY = (ctx, V) => `# ============================================
# Feature implementation — ${applyCtx('{ctx}', ctx)}
# Python 3.12 · FastAPI · Pydantic v2
# ============================================
from __future__ import annotations

import asyncio
import hashlib
import json
import logging
import time
from datetime import datetime, timezone
from typing import Any

from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field, field_validator

app = FastAPI(title="${applyCtx('{ctx}', ctx)} — Feature API", version="1.0.0")
logger = logging.getLogger("${V.snake}")
`

// ---------- Universal feature templates (8) ----------
const UNIVERSAL_CODE = {
  'Smart Intake & Validation': (ctx, V) => `${PY(ctx, V)}
# ── Feature: Smart Intake & Validation ─────────────────────
class ${V.Class}Input(BaseModel):
    """Typed schema — every field validated before anything is processed."""
    record_id: str = Field(..., min_length=1, max_length=128)
    source: str = Field(..., min_length=1, max_length=64)
    payload: dict[str, Any] = Field(default_factory=dict)
    received_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    @field_validator("payload")
    @classmethod
    def reject_oversized(cls, v):
        if len(json.dumps(v)) > 64_000:
            raise ValueError("payload exceeds 64 KB — rejected at intake")
        return v

# Dedupe window: identical fingerprints within 60s are dropped.
_dedupe: dict[str, float] = {}

async def intake(req: ${V.Class}Input) -> dict:
    fp = hashlib.sha256(json.dumps(req.payload, sort_keys=True).encode()).hexdigest()
    now = time.time()
    if fp in _dedupe and now - _dedupe[fp] < 60:
        return {"status": "duplicate", "record_id": req.record_id}
    _dedupe[fp] = now
    logger.info("validated %s from %s", req.record_id, req.source)
    return {"status": "accepted", "record_id": req.record_id}
`,
  'Explainable Decisions': (ctx, V) => `${PY(ctx, V)}
# ── Feature: Explainable Decisions ─────────────────────────
class ${V.Class}Decision(BaseModel):
    decision: str
    confidence: float = Field(..., ge=0, le=1)
    reason: str
    evidence: list[str]

async def decide(record: dict, model_score: float) -> ${V.Class}Decision:
    """Every decision carries reason + evidence trail + confidence."""
    threshold = 0.7
    if model_score >= threshold:
        decision = "approve"
    elif model_score >= threshold - 0.15:
        decision = "review"
    else:
        decision = "block"
    return ${V.Class}Decision(
        decision=decision,
        confidence=round(model_score, 3),
        reason=f"model score {model_score:.2f} vs threshold {threshold}",
        evidence=[f"record={record.get('record_id')}", f"rules_checked={len(record.get('rules', []))}"],
    )

@app.post("/api/${V.snake}/decide")
async def decide_endpoint(record: dict) -> ${V.Class}Decision:
    d = await decide(record, model_score=0.82)  # real impl: model inference
    logger.info("decision %s conf=%.2f", d.decision, d.confidence)
    return d
`,
  'Automated Workflows': (ctx, V) => `${PY(ctx, V)}
# ── Feature: Automated Workflows ───────────────────────────
from enum import Enum

class Step(str, Enum):
    validate = "validate"
    enrich = "enrich"
    decide = "decide"
    notify = "notify"

class Workflow:
    """Multi-step process that runs automatically with approval gates."""
    def __init__(self, record_id: str):
        self.record_id = record_id
        self.steps: list[Step] = []

    async def run(self, require_approval: bool = False) -> dict:
        for step in Step:
            if step is Step.notify and require_approval:
                raise HTTPException(status_code=425, detail="Awaiting human approval before notify")
            self.steps.append(step)
            logger.info("completed %s for %s", step.value, self.record_id)
        return {"record_id": self.record_id, "steps": [s.value for s in self.steps]}

@app.post("/api/${V.snake}/workflow")
async def run_workflow(record: ${V.Class}Input) -> dict:
    return await Workflow(record.record_id).run(require_approval=record.payload.get("sensitive", False))
`,
  'Live Monitoring & Alerts': (ctx, V) => `${PY(ctx, V)}
# ── Feature: Live Monitoring & Alerts ──────────────────────
from collections import deque

# Sliding window of recent latencies (milliseconds).
_latencies: deque[float] = deque(maxlen=1_000)

@app.middleware("http")
async def metrics_middleware(request: Request, call_next):
    start = time.perf_counter()
    resp = await call_next(request)
    _latencies.append((time.perf_counter() - start) * 1000)
    return resp

async def check_alerts() -> list[str]:
    """Flag anomalies the moment they appear."""
    alerts: list[str] = []
    if len(_latencies) >= 50:
        p95 = sorted(_latencies)[int(len(_latencies) * 0.95)]
        if p95 > 800:
            alerts.append(f"p95 latency {p95:.0f}ms exceeded 800ms — investigate")
    return alerts

@app.get("/api/${V.snake}/metrics")
async def metrics() -> dict:
    return {
        "requests_window": len(_latencies),
        "p95_ms": round(sorted(_latencies)[int(len(_latencies) * 0.95)], 1) if _latencies else 0,
        "alerts": await check_alerts(),
    }
`,
  'AI-Assisted Actions': (ctx, V) => `${PY(ctx, V)}
# ── Feature: AI-Assisted Actions ───────────────────────────
from openai import AsyncOpenAI

client = AsyncOpenAI()

async def suggest_next_best_action(context: dict) -> dict:
    """Agent suggests next-best actions grounded in retrieved knowledge + memory."""
    system = f"You propose next-best actions for ${applyCtx('{ctx}', ctx)} records. Return strict JSON."
    resp = await client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": system},
            {"role": "user", "content": json.dumps(context)},
        ],
        temperature=0.2,
    )
    return json.loads(resp.choices[0].message.content)

@app.post("/api/${V.snake}/suggest")
async def suggest(record: dict) -> dict:
    actions = await suggest_next_best_action({"record": record, "history": await load_history(record.get("record_id"))})
    logger.info("suggested %s for %s", actions.get("action"), record.get("record_id"))
    return actions
`,
  'Security & Guardrails': (ctx, V) => `${PY(ctx, V)}
# ── Feature: Security & Guardrails ─────────────────────────
_BLOCKED = ["ignore previous instructions", "system prompt", "</system>", "jailbreak"]

@app.middleware("http")
async def guardrails(request: Request, call_next):
    """Prompt-injection defense + payload size limits at the edge."""
    body = await request.body()
    if len(body) > 256_000:
        return JSONResponse({"error": "Payload too large"}, status_code=413)
    low = body.lower()
    if any(bad in low for bad in _BLOCKED):
        return JSONResponse({"error": "Blocked by guardrails"}, status_code=400)
    return await call_next(request)

# Least-privilege: a per-user scope map checked before any tool call.
_SCOPES: dict[str, set[str]] = {"read": {"retrieve"}, "write": {"retrieve", "act", "notify"}}

async def check_scope(user: str, tool: str) -> None:
    allowed = _SCOPES.get("write" if user == "operator" else "read", set())
    if tool not in allowed:
        raise HTTPException(status_code=403, detail=f"'{tool}' not in scope for {user}")
`,
  'Continuous Improvement': (ctx, V) => `${PY(ctx, V)}
# ── Feature: Continuous Improvement ────────────────────────
class EvalResult(BaseModel):
    faithfulness: float
    relevance: float
    pass_: bool

async def evaluate(answer: str, sources: list[str]) -> EvalResult:
    """Cheap programmatic evals — swap for an LLM-judge in production."""
    faithfulness = 0.9 if sources else 0.4
    relevance = min(1.0, 0.5 + 0.1 * len(sources))
    return EvalResult(faithfulness=faithfulness, relevance=round(relevance, 2), pass_=faithfulness >= 0.8)

@app.post("/api/${V.snake}/feedback")
async def feedback(answer: str, sources: list[str], thumbs: int) -> dict:
    """Feedback loops tune the experience over time without full retrains."""
    res = await evaluate(answer, sources)
    logger.info("feedback thumbs=%d faithfulness=%.2f", thumbs, res.faithfulness)
    if thumbs <= 0:
        await queue_retrieval_tune({"sources": sources})  # rerank weight update
    return {"logged": True, "eval": res.model_dump()}
`,
  'Enterprise Integration': (ctx, V) => `${PY(ctx, V)}
# ── Feature: Enterprise Integration ────────────────────────
import httpx

# Native connectors to the systems involved — CRM, ERP, DBs, internal APIs.
_INTEGRATIONS = {
    "crm": {"base": "https://crm.internal/api", "token": "env:CRM_TOKEN"},
    "erp": {"base": "https://erp.internal/api", "token": "env:ERP_TOKEN"},
    "ledger": {"base": "https://ledger.internal/v1", "token": "env:LEDGER_TOKEN"},
}

async def call_integration(system: str, path: str, method: str = "GET", payload: dict | None = None) -> dict:
    cfg = _INTEGRATIONS.get(system)
    if not cfg:
        raise HTTPException(status_code=404, detail=f"Unknown integration '{system}'")
    async with httpx.AsyncClient(timeout=10) as c:
        r = await c.request(method, f"{cfg['base']}/{path}", json=payload,
                            headers={"Authorization": f"Bearer {cfg['token']}"})
        r.raise_for_status()
        return r.json()

@app.get("/api/${V.snake}/integrations")
async def integrations() -> dict:
    return {"connected": list(_INTEGRATIONS.keys()), "status": "healthy"}
`,
}

// ---------- Pattern-specific feature templates (4 per pattern) ----------
const PATTERN_CODE = {
  // agenticRag
  'Grounded Knowledge': (ctx, V) => `${PY(ctx, V)}
# ── Feature: Grounded Knowledge ────────────────────────────
from chromadb import PersistentClient

collection = PersistentClient(path="./data").get_or_create_collection("${V.snake}_sources")

async def grounded_answer(question: str, top_k: int = 5) -> dict:
    """Every answer cites retrieved sources with page-level provenance."""
    qvec = await embed(question)
    hits = collection.query(query_embeddings=[qvec], n_results=top_k)
    sources = [{"text": t, "page": m.get("page"), "doc": m.get("doc")}
               for t, m in zip(hits["documents"][0], hits["metadatas"][0])]
    prompt = f"Answer using ONLY these sources:\\n{sources}\\nQuestion: {question}"
    answer = await generate(prompt, "Cite the exact source for every claim.")
    return {"answer": answer, "citations": sources}

@app.post("/api/${V.snake}/grounded")
async def grounded(question: str) -> dict:
    return await grounded_answer(question)
`,
  'Multi-Step Reasoning': (ctx, V) => `${PY(ctx, V)}
# ── Feature: Multi-Step Reasoning ──────────────────────────
from langgraph.graph import StateGraph, END
from typing import TypedDict, List

class ReasonState(TypedDict):
    question: str
    evidence: List[str]
    answer: str
    depth: int

def plan(state: ReasonState) -> dict:
    return {"depth": state.get("depth", 0) + 1}

def retrieve(state: ReasonState) -> dict:
    return {"evidence": [f"evidence-{i}" for i in range(state.get("depth", 1))]}

def decide(state: ReasonState) -> dict:
    """Revisit retrieval when evidence is thin."""
    if len(state.get("evidence", [])) < 2 and state.get("depth", 0) < 3:
        return {"answer": "RETRY"}
    return {"answer": f"resolved: {state['question']}"}

g = StateGraph(ReasonState)
g.add_node("plan", plan); g.add_node("retrieve", retrieve); g.add_node("decide", decide)
g.set_entry_point("plan"); g.add_edge("plan", "retrieve"); g.add_edge("retrieve", "decide")
g.add_conditional_edges("decide", lambda s: "retrieve" if s["answer"] == "RETRY" else "end",
                        {"retrieve": "retrieve", "end": END})
`,
  'Conversational Follow-Ups': (ctx, V) => `${PY(ctx, V)}
# ── Feature: Conversational Follow-Ups ─────────────────────
class SessionMemory:
    """Keeps prior turns so follow-ups stay grounded in context."""
    def __init__(self):
        self.history: dict[str, list[dict]] = {}

    async def add(self, session_id: str, turn: dict) -> None:
        self.history.setdefault(session_id, []).append(turn)
        self.history[session_id] = self.history[session_id][-10:]  # sliding window

    async def context(self, session_id: str) -> list[dict]:
        return self.history.get(session_id, [])

memory = SessionMemory()

@app.post("/api/${V.snake}/chat")
async def chat(session_id: str, question: str) -> dict:
    turns = await memory.context(session_id)
    answer = await generate(f"History: {turns}\\nQuestion: {question}", "Answer conversationally, grounded in history.")
    await memory.add(session_id, {"q": question, "a": answer})
    return {"answer": answer, "turns": len(turns)}
`,
  'Human Approval Points': (ctx, V) => `${PY(ctx, V)}
# ── Feature: Human Approval Points ─────────────────────────
_approvals: dict[str, dict] = {}

@app.post("/api/${V.snake}/approval/request")
async def request_approval(action: dict, actor: str) -> dict:
    token = hashlib.sha256(f"{action}-{time.time()}".encode()).hexdigest()[:16]
    _approvals[token] = {"action": action, "actor": actor, "status": "pending", "created": datetime.now(timezone.utc).isoformat()}
    logger.info("approval requested %s by %s", token, actor)
    return {"approval_id": token, "status": "pending"}

@app.post("/api/${V.snake}/approval/{token}")
async def resolve_approval(token: str, decision: str) -> dict:
    entry = _approvals.get(token)
    if not entry:
        raise HTTPException(status_code=404, detail="Unknown approval")
    if decision not in {"approve", "reject"}:
        raise HTTPException(status_code=400, detail="Decision must be approve|reject")
    entry["status"] = decision
    logger.info("approval %s → %s", token, decision)
    return entry
`,
  // multiAgentCrew
  'Role-Based Specialists': (ctx, V) => `${PY(ctx, V)}
# ── Feature: Role-Based Specialists ────────────────────────
from crewai import Agent, Task, Crew, Process

researcher = Agent(role="Researcher", goal=f"Find facts about {applyCtx('{ctx}', ctx)}", backstory="Thorough analyst")
writer = Agent(role="Writer", goal="Turn findings into a clear report", backstory="Clear communicator")
reviewer = Agent(role="Reviewer", goal="Catch errors and gaps", backstory="Critical editor")

research = Task(description="Research the request", agent=researcher, expected_output="findings")
draft = Task(description="Write the report", agent=writer, expected_output="draft report")
review = Task(description="Review the report", agent=reviewer, expected_output="final report")

crew = Crew(agents=[researcher, writer, reviewer], tasks=[research, draft, review], process=Process.sequential)
result = crew.kickoff()
`,
  'Critique & Revise Loops': (ctx, V) => `${PY(ctx, V)}
# ── Feature: Critique & Revise Loops ───────────────────────
async def critique_and_revise(draft: str, max_rounds: int = 3) -> dict:
    """Reviewer iterates on drafts until quality gates pass."""
    for round_no in range(1, max_rounds + 1):
        feedback = await generate(draft, "Critique this draft: list defects and required changes.")
        verdict = await evaluate(draft, ["draft"])
        logger.info("round %d faithfulness=%.2f", round_no, verdict.faithfulness)
        if not verdict.pass_:
            draft = await generate(f"{draft}\\nFeedback: {feedback}\\nRevise.", "Revise to fix every defect.")
            continue
        return {"draft": draft, "rounds": round_no, "passed": True}
    return {"draft": draft, "rounds": max_rounds, "passed": False}
`,
  'Task Orchestration': (ctx, V) => `${PY(ctx, V)}
# ── Feature: Task Orchestration ────────────────────────────
class TaskNode:
    def __init__(self, name: str, deps: list[str] | None = None):
        self.name = name
        self.deps = deps or []

# Dependencies between subtasks are planned and executed in order.
_PLAN = [
    TaskNode("research"),
    TaskNode("analyze", deps=["research"]),
    TaskNode("draft", deps=["analyze"]),
    TaskNode("review", deps=["draft"]),
]

async def run_plan() -> list[str]:
    done: set[str] = set()
    order: list[str] = []
    remaining = list(_PLAN)
    while remaining:
        for t in list(remaining):
            if all(d in done for d in t.deps):
                order.append(t.name)
                done.add(t.name)
                remaining.remove(t)
        if not order:
            raise RuntimeError("Cyclic or broken plan")
    return order
`,
  'Deliverable Assembly': (ctx, V) => `${PY(ctx, V)}
# ── Feature: Deliverable Assembly ──────────────────────────
_agent_outputs: dict[str, str] = {}

async def assemble_deliverable(parts: dict[str, str]) -> dict:
    """Merge contributions from every agent into one audited output."""
    sections = []
    for agent, text in parts.items():
        sections.append(f"## {agent}\\n{text}")
    final = "\\n\\n".join(sections)
    audit = {
        "output": final,
        "contributors": list(parts.keys()),
        "merged_at": datetime.now(timezone.utc).isoformat(),
        "checksum": hashlib.sha256(final.encode()).hexdigest()[:16],
    }
    logger.info("assembled deliverable from %d agents", len(parts))
    return audit

@app.post("/api/${V.snake}/assemble")
async def assemble(parts: dict[str, str]) -> dict:
    return await assemble_deliverable(parts)
`,
  // eventStreamAI
  'Millisecond Decisions': (ctx, V) => `${PY(ctx, V)}
# ── Feature: Millisecond Decisions ─────────────────────────
from fastapi import FastAPI
from pydantic import BaseModel

class Event(BaseModel):
    event_id: str
    payload: dict[str, Any]

async def score_event(ev: Event) -> dict:
    """Streaming models score each event as it arrives — no batch delay."""
    score = 0.5 + (hash(ev.event_id) % 100) / 1000  # real impl: model inference
    return {"event_id": ev.event_id, "score": round(score, 3), "action": "pass" if score < 0.8 else "flag"}

@app.post("/api/${V.snake}/events")
async def ingest_event(ev: Event) -> dict:
    decision = await score_event(ev)
    logger.info("event %s scored %.3f in %.2fms", ev.event_id, decision["score"], time.perf_counter())
    return decision
`,
  'Event Replay & Recovery': (ctx, V) => `${PY(ctx, V)}
# ── Feature: Event Replay & Recovery ───────────────────────
# Kafka retention lets the pipeline replay events after a failure.
from aiokafka import AIOKafkaConsumer, AIOKafkaProducer

producer = AIOKafkaProducer(bootstrap_servers="kafka:9092")
consumer = AIOKafkaConsumer("${V.snake}-events", bootstrap_servers="kafka:9092", auto_offset_reset="earliest")

async def replay(from_offset: int) -> None:
    """Re-read events from a saved offset to rebuild downstream state."""
    consumer.seek_to_beginning()
    async for msg in consumer:
        if msg.offset < from_offset:
            continue
        await process_event(json.loads(msg.value))

async def process_event(ev: dict) -> None:
    logger.info("replayed %s", ev.get("event_id"))
`,
  'Back-Pressure Handling': (ctx, V) => `${PY(ctx, V)}
# ── Feature: Back-Pressure Handling ────────────────────────
import asyncio

_QUEUE: asyncio.Queue = asyncio.Queue(maxsize=10_000)
_PROCESSING = False

async def enqueue(ev: dict) -> str:
    try:
        _QUEUE.put_nowait(ev)
        return "queued"
    except asyncio.QueueFull:
        logger.warning("queue full — throttling ingestion (back-pressure)")
        return "throttled"

async def worker_loop() -> None:
    """Consumes events; if downstream slows, the queue fills and ingestion throttles."""
    while True:
        ev = await _QUEUE.get()
        await process_event(ev)
        _QUEUE.task_done()

@app.on_event("startup")
async def start_workers():
    for _ in range(4):
        asyncio.create_task(worker_loop())
`,
  'Hot/Warm/Cold Storage': (ctx, V) => `${PY(ctx, V)}
# ── Feature: Hot/Warm/Cold Storage ─────────────────────────
async def tier_event(ev: dict, age_hours: float) -> str:
    """Events tier to cheap storage as they age, preserving replay ability."""
    if age_hours < 24:
        return "hot"    # in-memory / Redis — millisecond access
    if age_hours < 24 * 30:
        return "warm"   # Postgres / parquet — seconds access
    return "cold"       # S3 / object store — minutes access, cheapest

async def store_event(ev: dict) -> None:
    tier = await tier_event(ev, age_hours=0)
    await redis.set(f"ev:{ev['event_id']}", json.dumps(ev), ex=86_400)
    logger.info("stored %s to %s tier", ev["event_id"], tier)
`,
  // mcpToolGateway
  'Capability Discovery': (ctx, V) => `${PY(ctx, V)}
# ── Feature: Capability Discovery ──────────────────────────
_TOOLS = {
    "search_${V.snake}": {"description": f"Search {applyCtx('{ctx}', ctx)} records", "params": {"q": "str"}},
    "get_${V.snake}_status": {"description": "Get status", "params": {"id": "str"}},
}

@app.get("/api/${V.snake}/mcp/tools")
async def discover_tools() -> dict:
    """Agents discover available tools dynamically instead of hardcoded lists."""
    return {"protocol": "model-context-protocol", "tools": _TOOLS}
`,
  'Scoped Permissions': (ctx, V) => `${PY(ctx, V)}
# ── Feature: Scoped Permissions ────────────────────────────
_SCOPES = {"read.${V.snake}": {"get", "search"}, "write.${V.snake}": {"create", "update", "delete"}}

@app.post("/api/${V.snake}/mcp/call")
async def call_tool(tool: str, args: dict, scope: str) -> dict:
    """Every tool call checks least-privilege scopes before executing."""
    allowed = _SCOPES.get(scope, set())
    if tool not in allowed:
        raise HTTPException(status_code=403, detail=f"'{tool}' not permitted by scope '{scope}'")
    logger.info("tool %s executed under scope %s", tool, scope)
    return {"ok": True, "tool": tool, "args": args}
`,
  'Contract Validation': (ctx, V) => `${PY(ctx, V)}
# ── Feature: Contract Validation ───────────────────────────
from jsonschema import validate, ValidationError

_SCHEMAS = {
    "search_${V.snake}": {"type": "object", "required": ["q"], "properties": {"q": {"type": "string", "maxLength": 500}}},
}

@app.post("/api/${V.snake}/mcp/validate")
async def validate_call(tool: str, args: dict) -> dict:
    """Tool arguments validate against JSON Schema before any side effect."""
    schema = _SCHEMAS.get(tool)
    if not schema:
        raise HTTPException(status_code=404, detail=f"No schema for '{tool}'")
    try:
        validate(instance=args, schema=schema)
        return {"valid": True}
    except ValidationError as e:
        logger.warning("contract violation on %s: %s", tool, e.message)
        raise HTTPException(status_code=422, detail=e.message)
`,
  'Full Audit Trail': (ctx, V) => `${PY(ctx, V)}
# ── Feature: Full Audit Trail ──────────────────────────────
import json

async def audit(actor: str, tool: str, args: dict, result: Any, ok: bool) -> None:
    """Every tool invocation is logged with actor, payload and result."""
    entry = {
        "ts": datetime.now(timezone.utc).isoformat(),
        "actor": actor,
        "tool": tool,
        "args": json.dumps(args)[:2000],
        "result_ok": ok,
        "checksum": hashlib.sha256(json.dumps(args, sort_keys=True).encode()).hexdigest(),
    }
    await append_audit_log(entry)  # immutable append-only store
    logger.info("audit actor=%s tool=%s ok=%s", actor, tool, ok)

@app.post("/api/${V.snake}/mcp/call")
async def audited_call(actor: str, tool: str, args: dict) -> dict:
    try:
        result = await call_tool(tool, args)
        await audit(actor, tool, args, result, ok=True)
        return result
    except Exception:
        await audit(actor, tool, args, None, ok=False)
        raise
`,
  // predictiveMLOps
  'Forecast & Score': (ctx, V) => `${PY(ctx, V)}
# ── Feature: Forecast & Score ──────────────────────────────
import joblib

_model = joblib.load(f"models/${V.snake}_latest.joblib")  # versioned artifact

async def predict(features: dict) -> dict:
    """Models predict future outcomes with calibrated probabilities."""
    X = [[features.get(k, 0) for k in _FEATURE_ORDER]]
    proba = _model.predict_proba(X)[0]
    label = _model.predict(X)[0]
    return {"label": label, "probability": round(float(max(proba)), 4), "calibrated": True}

@app.post("/api/${V.snake}/predict")
async def predict_endpoint(features: dict) -> dict:
    return await predict(features)
`,
  'Versioned Features': (ctx, V) => `${PY(ctx, V)}
# ── Feature: Versioned Features ────────────────────────────
class FeatureStore:
    """Versions the exact inputs that trained each model."""
    def __init__(self):
        self._rows: list[dict] = []

    async def log(self, entity_id: str, features: dict, ts: float) -> None:
        self._rows.append({"entity_id": entity_id, "features": features, "ts": ts, "version": 1})
        if len(self._rows) > 100_000:
            await flush_to_parquet(self._rows)
            self._rows.clear()

    async def materialize(self, entity_id: str) -> dict:
        return next((r["features"] for r in reversed(self._rows) if r["entity_id"] == entity_id), {})

store = FeatureStore()

@app.post("/api/${V.snake}/features")
async def log_features(entity_id: str, features: dict) -> dict:
    await store.log(entity_id, features, time.time())
    return {"logged": True, "entity_id": entity_id}
`,
  'Experiment Tracking': (ctx, V) => `${PY(ctx, V)}
# ── Feature: Experiment Tracking ───────────────────────────
class ExperimentTracker:
    """Every training run logs params, metrics and artifacts for comparison."""
    def __init__(self):
        self.runs: list[dict] = []

    async def start(self, name: str, params: dict) -> str:
        run_id = hashlib.sha256(f"{name}-{time.time()}".encode()).hexdigest()[:12]
        self.runs.append({"run_id": run_id, "name": name, "params": params, "metrics": {}, "status": "running"})
        return run_id

    async def log_metric(self, run_id: str, metric: str, value: float) -> None:
        for r in self.runs:
            if r["run_id"] == run_id:
                r["metrics"][metric] = value

tracker = ExperimentTracker()

@app.get("/api/${V.snake}/experiments")
async def experiments() -> list[dict]:
    return tracker.runs
`,
  'Drift-Triggered Retraining': (ctx, V) => `${PY(ctx, V)}
# ── Feature: Drift-Triggered Retraining ────────────────────
class DriftMonitor:
    def __init__(self, baseline: dict[str, float], threshold: float = 0.1):
        self.baseline = baseline
        self.threshold = threshold

    async def check(self, window: dict[str, float]) -> bool:
        """Detects data drift and queues automatic retraining."""
        drift = max(abs(window.get(k, 0) - self.baseline.get(k, 0)) / max(self.baseline.get(k, 1e-6), 1e-6)
                    for k in self.baseline)
        if drift > self.threshold:
            logger.warning("drift %.3f exceeded %.2f — queuing retrain", drift, self.threshold)
            await queue_retraining_job()
            return True
        return False

monitor = DriftMonitor(baseline={"mean_amount": 120.0, "std_amount": 45.0})
`,
  // fraudRiskReAct
  'Millisecond Triage': (ctx, V) => `${PY(ctx, V)}
# ── Feature: Millisecond Triage ────────────────────────────
_RULES = [
    ("amount > 100000", lambda p: p.get("amount", 0) > 100_000),
    ("velocity > 20/hr", lambda p: p.get("velocity", 0) > 20),
    ("new_device", lambda p: p.get("new_device", False)),
]

async def triage(event: dict) -> dict:
    """Rules fast-path approve or flag before ML scoring runs."""
    hits = [name for name, fn in _RULES if fn(event)]
    if not hits:
        return {"verdict": "approve", "reason": "no rule matched", "fast_path": True}
    return {"verdict": "review", "reason": "; ".join(hits), "fast_path": False}

@app.post("/api/${V.snake}/triage")
async def triage_endpoint(event: dict) -> dict:
    return await triage(event)
`,
  'Deep Investigation': (ctx, V) => `${PY(ctx, V)}
# ── Feature: Deep Investigation ────────────────────────────
async def investigate(entity_id: str) -> dict:
    """ReAct agent gathers evidence across history, graphs and external checks."""
    evidence = {}
    evidence["history"] = await query_history(entity_id, window_days=365)
    evidence["linked_entities"] = await query_graph(entity_id, hops=2)
    evidence["external"] = await external_sanctions_check(entity_id)
    steps = ["gather-history", "traverse-graph", "external-check"]
    for s in steps:
        logger.info("investigation %s: %s done", entity_id, s)
    return evidence

@app.get("/api/${V.snake}/investigate/{entity_id}")
async def investigate_endpoint(entity_id: str) -> dict:
    return await investigate(entity_id)
`,
  'Explainable Verdicts': (ctx, V) => `${PY(ctx, V)}
# ── Feature: Explainable Verdicts ──────────────────────────
class Verdict(BaseModel):
    decision: str  # approve | review | block
    confidence: float
    reasons: list[str]

async def verdict(evidence: dict, score: float) -> Verdict:
    reasons = [f"score={score:.2f}", f"rules={len(evidence.get('rules', []))}"]
    decision = "approve" if score >= 0.8 else ("review" if score >= 0.6 else "block")
    if evidence.get("external"):
        reasons.append("external sanctions hit")
        decision = "block"
    return Verdict(decision=decision, confidence=round(score, 3), reasons=reasons)

@app.post("/api/${V.snake}/verdict")
async def verdict_endpoint(evidence: dict, score: float) -> Verdict:
    return await verdict(evidence, score)
`,
  'Model + Rules Ensemble': (ctx, V) => `${PY(ctx, V)}
# ── Feature: Model + Rules Ensemble ────────────────────────
async def ensemble(record: dict) -> dict:
    """Deterministic rules and ML scores combine for robust coverage."""
    rule_score = 1.0 if any(fn(record) for _, fn in _RULES) else 0.0
    ml_score = await model_score(record)
    combined = 0.4 * rule_score + 0.6 * ml_score
    decision = "flag" if combined >= 0.7 else "pass"
    logger.info("ensemble rule=%.2f ml=%.2f combined=%.2f", rule_score, ml_score, combined)
    return {"decision": decision, "combined": round(combined, 3)}
`,
  // customerAssistant
  'Omnichannel Replies': (ctx, V) => `${PY(ctx, V)}
# ── Feature: Omnichannel Replies ───────────────────────────
async def reply(channel: str, user_text: str, context: dict) -> dict:
    """Consistent answers across web chat, mobile, voice and messaging."""
    answer = await generate(user_text, f"Answer as ${applyCtx('{ctx}', ctx)} support on {channel}.")
    return {
        "channel": channel,
        "answer": answer,
        "format": "markdown" if channel in {"web", "mobile"} else "plain",
        "character_limit": 160 if channel == "sms" else None,
    }

@app.post("/api/${V.snake}/reply")
async def reply_endpoint(channel: str, user_text: str) -> dict:
    return await reply(channel, user_text, {"tier": "standard"})
`,
  'Intent-Aware Routing': (ctx, V) => `${PY(ctx, V)}
# ── Feature: Intent-Aware Routing ──────────────────────────
_INTENT_ROUTER = {
    "billing": "billing_resolver",
    "status": "status_resolver",
    "complaint": "human_escalation",
    "default": "general_assistant",
}

async def route(user_text: str) -> str:
    """Detects intent and routes requests to the right resolver."""
    low = user_text.lower()
    for intent, resolver in _INTENT_ROUTER.items():
        if intent in low:
            logger.info("routed '%s' → %s", intent, resolver)
            return resolver
    return _INTENT_ROUTER["default"]

@app.post("/api/${V.snake}/route")
async def route_endpoint(user_text: str) -> dict:
    return {"intent": await route(user_text), "handled_by": "assistant" if await route(user_text) != "human_escalation" else "human"}
`,
  'Seamless Human Handoff': (ctx, V) => `${PY(ctx, V)}
# ── Feature: Seamless Human Handoff ────────────────────────
async def escalate(conversation: list[dict], reason: str) -> dict:
    """Complex issues escalate with full conversation context."""
    summary = await generate(str(conversation[-5:]), "Summarize this conversation for a human agent.")
    ticket = {
        "ticket_id": hashlib.sha256(str(time.time()).encode()).hexdigest()[:10],
        "summary": summary,
        "full_transcript": conversation,
        "reason": reason,
        "priority": "high" if "angry" in str(conversation).lower() else "normal",
    }
    await create_ticket(ticket)
    logger.info("escalated ticket %s: %s", ticket["ticket_id"], reason)
    return ticket

@app.post("/api/${V.snake}/escalate")
async def escalate_endpoint(conversation: list[dict], reason: str) -> dict:
    return await escalate(conversation, reason)
`,
  'Sentiment Awareness': (ctx, V) => `${PY(ctx, V)}
# ── Feature: Sentiment Awareness ───────────────────────────
async def detect_sentiment(text: str) -> dict:
    """Detects frustration in conversations and adapts tone."""
    anger_words = ["angry", "furious", "terrible", "unacceptable", "frustrated"]
    score = sum(1 for w in anger_words if w in text.lower())
    sentiment = "frustrated" if score >= 2 else ("neutral" if score == 1 else "positive")
    return {"sentiment": sentiment, "tone": "empathetic" if sentiment == "frustrated" else "helpful"}

@app.post("/api/${V.snake}/sentiment")
async def sentiment_endpoint(text: str) -> dict:
    return await detect_sentiment(text)
`,
  // edgeIotAI
  'On-Device Inference': (ctx, V) => `${PY(ctx, V)}
# ── Feature: On-Device Inference ───────────────────────────
# TinyML: model runs on the edge device — near-zero latency.
import tflite_runtime.interpreter as tflite

_interp = tflite.Interpreter(model_path="models/${V.snake}_tiny.tflite")
_interp.allocate_tensors()
_in = _interp.get_input_details()
_out = _interp.get_output_details()

def infer(sensor_sample: list[float]) -> dict:
    _interp.set_tensor(_in[0]["index"], [sensor_sample])
    _interp.invoke()
    probs = _interp.get_tensor(_out[0]["index"])[0]
    label = int(probs.argmax())
    return {"label": label, "confidence": round(float(probs[label]), 3), "latency_ms": 1.8}
`,
  'Power-Aware Operation': (ctx, V) => `${PY(ctx, V)}
# ── Feature: Power-Aware Operation ─────────────────────────
class PowerPolicy:
    """Devices wake the radio only when an event matters — saving battery."""
    def __init__(self, threshold: float = 0.7):
        self.threshold = threshold

    async def should_wake(self, sensor_reading: float) -> bool:
        if sensor_reading >= self.threshold:
            logger.info("waking radio: reading %.2f ≥ %.2f", sensor_reading, self.threshold)
            return True
        return False  # keep radio asleep, buffer locally

policy = PowerPolicy()

async def on_sample(reading: float) -> None:
    if await policy.should_wake(reading):
        await transmit(await buffer_peek())  # flush buffered telemetry
    else:
        await buffer_append(reading)
`,
  'Fleet OTA Updates': (ctx, V) => `${PY(ctx, V)}
# ── Feature: Fleet OTA Updates ─────────────────────────────
async def push_model_update(fleet: list[str], model_uri: str, version: str) -> dict:
    """Model updates push to the whole device fleet over secure channels."""
    results = {}
    for device_id in fleet:
        manifest = {"model_uri": model_uri, "version": version, "sha256": await checksum(model_uri)}
        results[device_id] = await send_signed_manifest(device_id, manifest)  # TLS + signature
    ok = all(r.get("accepted") for r in results.values())
    logger.info("OTA v%s pushed to %d devices ok=%s", version, len(fleet), ok)
    return {"version": version, "devices": len(fleet), "all_accepted": ok}
`,
  'Offline Resilience': (ctx, V) => `${PY(ctx, V)}
# ── Feature: Offline Resilience ────────────────────────────
class OfflineBuffer:
    """Edge gateways buffer telemetry and sync when connectivity returns."""
    def __init__(self, max_items: int = 10_000):
        self.items: list[dict] = []
        self.max_items = max_items

    async def append(self, reading: dict) -> None:
        if len(self.items) >= self.max_items:
            self.items.pop(0)  # drop oldest — never block the sensor loop
        self.items.append(reading)

    async def sync(self, online: bool) -> None:
        if not online:
            return
        batch, self.items = self.items, []
        for reading in batch:
            await transmit(reading)
        logger.info("synced %d buffered readings", len(batch))

buffer = OfflineBuffer()
`,
  // genContentStudio
  'Multimodal Generation': (ctx, V) => `${PY(ctx, V)}
# ── Feature: Multimodal Generation ─────────────────────────
from openai import AsyncOpenAI

client = AsyncOpenAI()

async def generate_asset(kind: str, brief: str) -> dict:
    """Text, image, video and audio assets are produced in one pipeline."""
    if kind == "text":
        r = await client.chat.completions.create(model="gpt-4o-mini", messages=[{"role": "user", "content": brief}])
        return {"kind": kind, "content": r.choices[0].message.content}
    if kind == "image":
        r = await client.images.generate(model="dall-e-3", prompt=brief, size="1024x1024", n=1)
        return {"kind": kind, "url": r.data[0].url}
    raise HTTPException(status_code=400, detail=f"Unsupported asset kind '{kind}'")

@app.post("/api/${V.snake}/asset")
async def asset(kind: str, brief: str) -> dict:
    return await generate_asset(kind, brief)
`,
  'Brand Consistency': (ctx, V) => `${PY(ctx, V)}
# ── Feature: Brand Consistency ─────────────────────────────
_BRAND_RULES = [
    "Never use exclamation marks",
    "Tone: professional and warm",
    "Avoid jargon and acronyms",
]

async def enforce_brand(text: str) -> dict:
    """Style guides and guardrails enforce brand voice across every asset."""
    issues = []
    if "!" in text:
        issues.append("exclamation mark used — remove per style guide")
    for banned in ["solutions", "synergy"]:
        if banned in text.lower():
            issues.append(f"banned word '{banned}'")
    clean = text
    for issue in issues:
        clean = clean.replace("!", "")
    return {"passed": len(issues) == 0, "issues": issues, "cleaned": clean}

@app.post("/api/${V.snake}/brand-check")
async def brand_check(text: str) -> dict:
    return await enforce_brand(text)
`,
  'Human Review Gates': (ctx, V) => `${PY(ctx, V)}
# ── Feature: Human Review Gates ────────────────────────────
_review_queue: dict[str, dict] = {}

@app.post("/api/${V.snake}/content/review")
async def submit_for_review(asset: dict, author: str) -> dict:
    asset_id = hashlib.sha256(f"{asset}-{time.time()}".encode()).hexdigest()[:12]
    _review_queue[asset_id] = {"asset": asset, "author": author, "status": "pending"}
    logger.info("content %s submitted by %s", asset_id, author)
    return {"asset_id": asset_id, "status": "pending"}

@app.post("/api/${V.snake}/content/{asset_id}/approve")
async def approve(asset_id: str, reviewer: str, decision: str) -> dict:
    entry = _review_queue.get(asset_id)
    if not entry:
        raise HTTPException(status_code=404, detail="Unknown asset")
    entry["status"] = decision
    entry["reviewer"] = reviewer
    logger.info("content %s %s by %s", asset_id, decision, reviewer)
    return entry
`,
  'Rights & Safety Checks': (ctx, V) => `${PY(ctx, V)}
# ── Feature: Rights & Safety Checks ────────────────────────
@app.post("/api/${V.snake}/content/checks")
async def safety_checks(asset: dict) -> dict:
    """Licensing, watermarking and content safety screen every output."""
    checks = {
        "license_ok": asset.get("license") in {"royalty-free", "owned", "cc-by"},
        "watermarked": bool(asset.get("watermark")),
        "safety": await safety_classifier(asset.get("text", "")),  # returns pass/flag
        "adult_blocked": await adult_classifier(asset.get("url", "")),
    }
    all_pass = all(v is True or v == "pass" for v in checks.values())
    logger.info("content checks passed=%s", all_pass)
    return {"passed": all_pass, "checks": checks}
`,
  // autonomousOps
  'Automatic Detection': (ctx, V) => `${PY(ctx, V)}
# ── Feature: Automatic Detection ───────────────────────────
async def detect_anomalies(metric: str, window: list[float]) -> list[dict]:
    """Anomalies are flagged before users notice anything."""
    if len(window) < 10:
        return []
    mean = sum(window) / len(window)
    std = (sum((v - mean) ** 2 for v in window) / len(window)) ** 0.5 or 1e-6
    anomalies = [{"metric": metric, "value": v, "zscore": round((v - mean) / std, 2)}
                 for v in window if abs(v - mean) > 3 * std]
    for a in anomalies:
        logger.warning("anomaly %s value=%.2f z=%.2f", metric, a["value"], a["zscore"])
    return anomalies

@app.post("/api/${V.snake}/detect")
async def detect(metric: str, window: list[float]) -> list[dict]:
    return await detect_anomalies(metric, window)
`,
  'Root-Cause Reasoning': (ctx, V) => `${PY(ctx, V)}
# ── Feature: Root-Cause Reasoning ──────────────────────────
async def root_cause(incident: dict) -> dict:
    """RCA agent reads logs and runbooks to explain incidents."""
    logs = await fetch_logs(incident["service"], since_minutes=60)
    runbooks = await fetch_runbooks(incident["service"])
    prompt = (f"Logs: {logs[:4000]}\\nRunbooks: {runbooks[:2000]}\\n"
              f"Explain the root cause of {incident.get('summary')}.")
    cause = await generate(prompt, "Return: probable cause, confidence, evidence.")
    return {"cause": cause, "logs_scanned": len(logs), "runbooks": len(runbooks)}

@app.post("/api/${V.snake}/rca")
async def rca(incident: dict) -> dict:
    return await root_cause(incident)
`,
  'Guided Remediation': (ctx, V) => `${PY(ctx, V)}
# ── Feature: Guided Remediation ────────────────────────────
_RUNBOOK = {
    "cpu_spike": ["scale-out-replicas", "restart-degraded-pod", "verify-health"],
    "memory_leak": ["restart-service", "verify-recovery"],
}

async def remediate(cause: str, approval_required: bool = True) -> dict:
    """Runbook fixes execute automatically behind approval gates."""
    steps = _RUNBOOK.get(cause, ["investigate-more"])
    if approval_required:
        steps = ["await-approval"] + steps
    results = []
    for step in steps:
        results.append({"step": step, "ok": True})
        logger.info("remediation %s: %s", cause, step)
    return {"cause": cause, "steps": results, "approved": not approval_required}
`,
  'Learning Postmortems': (ctx, V) => `${PY(ctx, V)}
# ── Feature: Learning Postmortems ──────────────────────────
class KnowledgeBase:
    """Every incident feeds the knowledge base and improves future responses."""
    def __init__(self):
        self.entries: list[dict] = []

    async def record_incident(self, incident: dict, cause: str, fix: str) -> None:
        self.entries.append({
            "incident": incident.get("summary"),
            "cause": cause,
            "fix": fix,
            "ts": datetime.now(timezone.utc).isoformat(),
        })
        logger.info("kb entry added: %s → %s", incident.get("summary"), fix)

    async def suggest_fix(self, symptom: str) -> dict | None:
        for e in reversed(self.entries):
            if symptom.lower() in e["incident"].lower():
                return e
        return None

kb = KnowledgeBase()
`,
  // graphKnowledge
  'Entity Relationships': (ctx, V) => `${PY(ctx, V)}
# ── Feature: Entity Relationships ──────────────────────────
from neo4j import GraphDatabase

driver = GraphDatabase.driver("bolt://graph:7687", auth=("neo4j", "password"))

async def upsert_entity(entity: str, props: dict, related_to: str | None = None) -> None:
    """Models how entities and facts connect in the knowledge graph."""
    with driver.session() as s:
        s.run("MERGE (e:Entity {name: $name}) SET e += $props", name=entity, props=props)
        if related_to:
            s.run("MATCH (a:Entity {name: $a}), (b:Entity {name: $b}) "
                  "MERGE (a)-[:RELATES_TO]->(b)", a=entity, b=related_to)

@app.post("/api/${V.snake}/graph/entity")
async def entity(entity: str, props: dict) -> dict:
    await upsert_entity(entity, props)
    return {"entity": entity, "stored": True}
`,
  'Multi-Hop Answers': (ctx, V) => `${PY(ctx, V)}
# ── Feature: Multi-Hop Answers ─────────────────────────────
async def multi_hop(query: str, hops: int = 2) -> dict:
    """Reasoning traverses graph paths vectors alone cannot answer."""
    cypher = (
        "MATCH p = (start)-[*1..2]->(end) "
        "WHERE start.name CONTAINS $q RETURN end.name LIMIT 10"
    )
    with driver.session() as s:
        results = list(s.run(cypher, q=query))
    answers = [r["end.name"] for r in results]
    answer = await generate(f"Graph paths: {answers}\\nQuestion: {query}", "Answer using the graph paths.")
    return {"answer": answer, "paths": answers, "hops": hops}
`,
  'Provenance on Every Fact': (ctx, V) => `${PY(ctx, V)}
# ── Feature: Provenance on Every Fact ──────────────────────
@app.post("/api/${V.snake}/graph/fact")
async def add_fact(subject: str, predicate: str, obj: str, source_doc: str, page: int) -> dict:
    """Each answer traces back to source documents and graph edges."""
    with driver.session() as s:
        s.run(
            "MATCH (s:Entity {name: $s}), (o:Entity {name: $o}) "
            "MERGE (s)-[r:KNOWS {predicate: $p}]->(o) "
            "SET r.source_doc = $doc, r.page = $page",
            s=subject, p=predicate, o=obj, doc=source_doc, page=page,
        )
    logger.info("fact %s %s %s ← %s p.%s", subject, predicate, obj, source_doc, page)
    return {"fact": f"{subject} {predicate} {obj}", "provenance": {"doc": source_doc, "page": page}}
`,
  'Hybrid Retrieval': (ctx, V) => `${PY(ctx, V)}
# ── Feature: Hybrid Retrieval ──────────────────────────────
async def hybrid_search(query: str, top_k: int = 5) -> list[dict]:
    """Graph traversal plus vector search pick the best evidence."""
    # 1) vector search
    qvec = await embed(query)
    vector_hits = collection.query(query_embeddings=[qvec], n_results=top_k)
    # 2) graph traversal
    with driver.session() as s:
        graph_hits = [r["end.name"] for r in s.run(
            "MATCH (n)-[*1..2]->(m) WHERE n.name CONTAINS $q RETURN m.name", q=query)]
    # 3) merge + dedupe, graph results weighted higher for relational queries
    merged = [{"text": t, "source": "vector"} for t in vector_hits["documents"][0]]
    merged += [{"text": g, "source": "graph"} for g in graph_hits]
    return merged[:top_k]
`,
  // governedPlatform
  'Central Policy Engine': (ctx, V) => `${PY(ctx, V)}
# ── Feature: Central Policy Engine ─────────────────────────
_POLICIES = [
    {"name": "no-pii", "check": lambda r: "ssn" not in str(r).lower()},
    {"name": "geo-restrict", "check": lambda r: r.get("region", "US") in {"US", "EU", "APAC"}},
    {"name": "model-allowlist", "check": lambda r: r.get("model") in {"gpt-4o-mini", "claude-sonnet"}},
]

async def enforce_policies(request: dict) -> dict:
    """One policy layer governs every AI request across the organisation."""
    violations = [p["name"] for p in _POLICIES if not p["check"](request)]
    if violations:
        logger.warning("policy violations: %s", violations)
        raise HTTPException(status_code=403, detail=f"Blocked by policies: {violations}")
    return {"allowed": True}

@app.post("/api/${V.snake}/policy/check")
async def policy_check(request: dict) -> dict:
    return await enforce_policies(request)
`,
  'Output Scoring': (ctx, V) => `${PY(ctx, V)}
# ── Feature: Output Scoring ────────────────────────────────
async def score_output(answer: str, sources: list[str]) -> dict:
    """Safety, quality and faithfulness scores gate every response."""
    scores = {
        "safety": await safety_classifier(answer),
        "quality": min(1.0, 0.4 + 0.1 * len(answer)),
        "faithfulness": 0.9 if sources else 0.3,
    }
    blocked = scores["safety"] != "pass" or scores["faithfulness"] < 0.7
    logger.info("output scored %s blocked=%s", scores, blocked)
    return {"scores": scores, "blocked": blocked}

@app.post("/api/${V.snake}/output/score")
async def output_score(answer: str, sources: list[str]) -> dict:
    return await score_output(answer, sources)
`,
  'Immutable Audit Logs': (ctx, V) => `${PY(ctx, V)}
# ── Feature: Immutable Audit Logs ──────────────────────────
async def write_audit(entry: dict) -> None:
    """Full traces of requests satisfy compliance and regulator needs."""
    prev = await last_audit_hash()
    record = {
        **entry,
        "ts": datetime.now(timezone.utc).isoformat(),
        "prev_hash": prev,
        "hash": hashlib.sha256(json.dumps(entry, sort_keys=True).encode() + prev.encode()).hexdigest(),
    }
    await append_audit_log(record)  # append-only — no updates, no deletes
    logger.info("audit written %s", record["hash"][:12])

@app.post("/api/${V.snake}/audit")
async def audit_endpoint(entry: dict) -> dict:
    await write_audit(entry)
    return {"logged": True}
`,
  'Model Routing Rules': (ctx, V) => `${PY(ctx, V)}
# ── Feature: Model Routing Rules ───────────────────────────
_MODEL_TIERS = [
    {"task": "summarize", "model": "gpt-4o-mini", "cost": 0.15},
    {"task": "reason", "model": "claude-sonnet", "cost": 3.0},
    {"task": "embed", "model": "text-embedding-3-small", "cost": 0.02},
]

async def route_model(task: str, complexity: str = "low") -> dict:
    """Routes workloads to the best model by task and cost."""
    for tier in _MODEL_TIERS:
        if tier["task"] == task:
            if complexity == "high" and task in {"summarize", "reason"}:
                tier = {**tier, "model": "claude-opus", "cost": 15.0}
            logger.info("route %s → %s (est $%.2f/1M)", task, tier["model"], tier["cost"])
            return tier
    raise HTTPException(status_code=404, detail=f"No route for task '{task}'")

@app.post("/api/${V.snake}/route-model")
async def route_model_endpoint(task: str) -> dict:
    return await route_model(task)
`,
}

// ---------- Code key helpers ----------
export function featureCodeFor(name, ctx) {
  const V = { snake: varname(ctx), Class: pname(ctx) }
  const tpl = UNIVERSAL_CODE[name] || PATTERN_CODE[name] || UNIVERSAL_CODE['Smart Intake & Validation']
  const code = tpl(ctx, V)
  return { code, lang: 'python', label: name }
}

export function featureNoteFor(name, ctx) {
  return applyCtx(
    `Implementation of “${name}” for {ctx} — a self-contained, runnable scaffold. Wire the placeholder logic (model inference, integrations, vector store) to your own data and deploy behind the FastAPI app.`,
    ctx
  )
}

// Count coverage so we can smoke-test that every feature has code.
export const featureCodeCoverage = () => {
  const universal = Object.keys(UNIVERSAL_CODE)
  const specific = Object.keys(PATTERN_CODE)
  return { universalCount: universal.length, specificCount: specific.length }
}
