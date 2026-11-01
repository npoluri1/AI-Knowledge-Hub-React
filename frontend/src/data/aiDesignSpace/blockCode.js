// ============================================================
// AI DESIGN SPACE — BLOCK CODE GENERATOR
// Real, runnable code for every block of the High-Level Design
// (layers) and Low-Level Design (nodes), contextualised with the
// pattern + industry/domain. Clicking any block shows its code.
// ============================================================

// Apply {ctx} placeholders inside generated code for a specific domain.
const applyCtx = (text, ctx) => String(text).replace(/\{ctx\}/g, ctx)

// Deterministic slug for variable names from an arbitrary context.
const varname = ctx => {
  const s = String(ctx).toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '')
  return s || 'domain'
}
const pname = ctx => {
  const s = String(ctx).trim().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')
  return s.replace(/[^A-Za-z0-9]/g, '') || 'Domain'
}

const PY_HEADER = ctx => `# ============================================
# ${applyCtx('{ctx}', ctx)} — production-ready implementation
# Python 3.12 · FastAPI · Pydantic v2
# ============================================
from __future__ import annotations

import asyncio
import logging
from typing import Any

from fastapi import FastAPI, Depends, HTTPException, Request
from pydantic import BaseModel, Field
`

const TS_HEADER = ctx => `// ============================================
// ${applyCtx('{ctx}', ctx)} — client / experience layer
// React (Next.js) component
// ============================================
'use client'

import { useState } from 'react'
`

// ---------- HLD layer templates (keyed by layer title keywords) ----------
const HLD_LAYER_CODE = {
  client: (ctx, V) => `${TS_HEADER(ctx)}
export default function ${V.Class}Portal() {
  const [query, setQuery] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const ask = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/${V.snake}', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      })
      setResult(await res.json())
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="portal">
      <h1>${applyCtx('{ctx}', ctx)} — Assistant</h1>
      <textarea value={query} onChange={e => setQuery(e.target.value)} rows={3} />
      <button onClick={ask} disabled={loading || !query.trim()}>
        {loading ? 'Thinking…' : 'Ask'}
      </button>
      {result && <pre className="answer">{JSON.stringify(result, null, 2)}</pre>}
    </section>
  )
}
`,
  gateway: (ctx, V) => `${PY_HEADER(ctx)}
# ── API Gateway & Agent Gateway ─────────────────────────────
from fastapi.middleware.cors import CORSMiddleware
from fastapi import Request, HTTPException

app = FastAPI(title="${applyCtx('{ctx}', ctx)} Gateway", version="1.0.0")

app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

# Simple rate limit: in production use Redis + a token bucket.
_limits: dict[str, list[float]] = {}

async def rate_limit(request: Request, max_req: int = 30, window: float = 60.0) -> None:
    ip = request.client.host if request.client else "unknown"
    now = asyncio.get_event_loop().time()
    _limits[ip] = [t for t in _limits.get(ip, []) if now - t < window]
    if len(_limits[ip]) >= max_req:
        raise HTTPException(status_code=429, detail="Rate limit exceeded")
    _limits[ip].append(now)

@app.middleware("http")
async def guardrails_middleware(request: Request, call_next):
    """First-line guardrails: block oversized / suspicious payloads."""
    body = await request.body()
    if len(body) > 256_000:
        return JSONResponse({"error": "Payload too large"}, status_code=413)
    if b"ignore all previous instructions" in body.lower():
        return JSONResponse({"error": "Blocked by guardrails"}, status_code=400)
    return await call_next(request)
`,
  agent: (ctx, V) => `${PY_HEADER(ctx)}
# ── Agent Orchestration Layer ───────────────────────────────
from langgraph.graph import StateGraph, END
from typing import TypedDict, Annotated, List

class ${V.Class}State(TypedDict):
    query: str
    steps: List[str]
    context: List[dict]
    answer: str
    retries: int

def planner(state: ${V.Class}State) -> dict:
    """Decompose the goal about ${applyCtx('{ctx}', ctx)} into ordered steps."""
    steps = ["understand", "retrieve", "reason", "respond"]
    return {"steps": steps}

def reasoner(state: ${V.Class}State) -> dict:
    """ReAct loop: think → act → observe, with a retry budget."""
    if state.get("retries", 0) >= 3:
        return {"answer": "I could not resolve this reliably — please try again."}
    return {"answer": f"Grounded answer for: {state['query']}", "retries": state.get("retries", 0) + 1}

def should_continue(state: ${V.Class}State) -> str:
    return "respond" if state.get("answer") else "retrieve"

graph = StateGraph(${V.Class}State)
graph.add_node("plan", planner)
graph.add_node("reason", reasoner)
graph.add_node("respond", lambda s: {"answer": s["answer"] or "No answer"})
graph.set_entry_point("plan")
graph.add_edge("plan", "reason")
graph.add_conditional_edges("reason", should_continue, {"retrieve": "reason", "respond": "respond"})
graph.add_edge("respond", END)
compiled = graph.compile()
`,
  ai: (ctx, V) => `${PY_HEADER(ctx)}
# ── AI Core & Knowledge Layer ───────────────────────────────
from openai import AsyncOpenAI
from sentence_transformers import SentenceTransformer

client = AsyncOpenAI()  # or your provider client
embedder = SentenceTransformer("all-MiniLM-L6-v2")

async def embed(text: str) -> list[float]:
    """Embed any text about ${applyCtx('{ctx}', ctx)} into a dense vector."""
    return embedder.encode(text).tolist()

async def generate(prompt: str, system: str, temperature: float = 0.2) -> str:
    """Grounded generation — always pass retrieved context in the prompt."""
    resp = await client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": system},
            {"role": "user", "content": prompt},
        ],
        temperature=temperature,
    )
    return resp.choices[0].message.content or ""

async def rerank(query: str, chunks: list[dict], top_k: int = 5) -> list[dict]:
    """Simple cross-encoder rerank; swap for a dedicated rerank model in prod."""
    scored = sorted(chunks, key=lambda c: len(set(c["text"]) & set(query)), reverse=True)
    return scored[:top_k]
`,
  data: (ctx, V) => `${PY_HEADER(ctx)}
# ── Enterprise Data Layer ───────────────────────────────────
from chromadb import PersistentClient
from chromadb.config import Settings

collection = PersistentClient(path="./data").get_or_create_collection("${V.snake}")

async def index_document(doc_id: str, text: str, metadata: dict | None = None) -> None:
    """Chunk, embed and store a document about ${applyCtx('{ctx}', ctx)}."""
    chunk_size, overlap = 800, 80
    chunks = [text[i:i + chunk_size] for i in range(0, len(text), chunk_size - overlap)]
    ids, vectors = [], []
    for i, chunk in enumerate(chunks):
        ids.append(f"${V.snake}:{doc_id}:{i}")
        vectors.append(await embed(chunk))
    collection.upsert(ids=ids, embeddings=vectors, documents=chunks,
                      metadatas=[metadata or {} for _ in chunks])

async def search(query: str, top_k: int = 5) -> list[dict]:
    """Hybrid-ish retrieval: vector similarity over ${applyCtx('{ctx}', ctx)} knowledge."""
    qvec = await embed(query)
    res = collection.query(query_embeddings=[qvec], n_results=top_k)
    return [{"text": t, "score": s, "meta": m}
            for t, s, m in zip(res["documents"][0], res["distances"][0], res["metadatas"][0])]
`,
  ops: (ctx, V) => `${PY_HEADER(ctx)}
# ── Delivery, Observability & Governance ────────────────────
from opentelemetry import trace
from opentelemetry.exporter.otlp.proto.http.trace_exporter import OTLPSpanExporter
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanExporter

provider = TracerProvider()
provider.add_span_processor(BatchSpanExporter(OTLPSpanExporter()))
trace.set_tracer_provider(provider)
tracer = trace.get_tracer("${V.snake}")

async def evaluate(answer: str, context: list[dict]) -> dict:
    """Score faithfulness + relevance on 0..1; block below threshold."""
    faithfulness = 0.9 if context else 0.4   # real impl: LLM judge
    relevance = 0.85
    return {"faithfulness": faithfulness, "relevance": relevance, "pass": faithfulness >= 0.8}

async def audit(actor: str, action: str, payload: dict) -> None:
    """Immutable audit log for compliance."""
    with tracer.start_as_current_span("audit") as span:
        span.set_attribute("actor", actor)
        span.set_attribute("action", action)
        span.set_attribute("payload", str(payload)[:2000])
`,
}

// ---------- LDD node templates (keyed by node kind) ----------
const LDD_NODE_CODE = {
  entry: (ctx, V) => `${PY_HEADER(ctx)}
# ── Node 1 · Client Request (entry) ─────────────────────────
class ${V.Class}Query(BaseModel):
    """Validated request model for ${applyCtx('{ctx}', ctx)}."""
    query: str = Field(..., min_length=2, max_length=4000, description="User question")
    session_id: str | None = Field(None, max_length=128)
    user_id: str | None = Field(None, max_length=128)
    context: dict[str, Any] = Field(default_factory=dict)

@app.post("/api/${V.snake}/ask")
async def ask(query: Query = Depends()):
    """Entry point: receive, validate and forward the request."""
    return {"status": "accepted", "session_id": query.session_id, "query": query.query}
`,
  gateway: (ctx, V) => `${PY_HEADER(ctx)}
# ── Node 2 · Gateway & Guardrails ───────────────────────────
from guardrails import Guard
from guardrails.hub import DetectPromptInjection, RegexMatch

guard = Guard().use(DetectPromptInjection(on_fail="exception")).use(
    RegexMatch(regex=r"^[^<>{0,500}]*$", on_fail="exception"))

async def validate_request(query: ${V.Class}Query) -> ${V.Class}Query:
    """Sanitise + guardrail every input before the agent sees it."""
    text = query.query
    if any(bad in text.lower() for bad in ["ignore previous", "system prompt", "</system>"]):
        raise HTTPException(status_code=400, detail="Content blocked by guardrails")
    if len(text) > 4000:
        raise HTTPException(status_code=413, detail="Input too long")
    return query
`,
  ai: (ctx, V) => `${PY_HEADER(ctx)}
# ── Node 3 · Query Understanding / Agent reasoning ──────────
from pydantic import BaseModel, Field

class ${V.Class}Plan(BaseModel):
    intent: str = Field(..., description="Classification of the request")
    steps: list[str] = Field(default_factory=list)
    needs_tools: bool = False
    needs_retrieval: bool = True

async def understand(query: str) -> ${V.Class}Plan:
    """Classify intent and decompose the task for ${applyCtx('{ctx}', ctx)}."""
    system = "You classify ${applyCtx('{ctx}', ctx)} requests. Return strict JSON."
    raw = await generate(query, system, temperature=0.0)
    import json
    return ${V.Class}Plan(**json.loads(raw))
`,
  data: (ctx, V) => `${PY_HEADER(ctx)}
# ── Node 4 · Retrieval & Rerank ─────────────────────────────
async def retrieve(query: str, top_k: int = 6) -> list[dict]:
    """Embed → vector search → rerank for ${applyCtx('{ctx}', ctx)} knowledge."""
    qvec = await embed(query)
    hits = collection.query(query_embeddings=[qvec], n_results=top_k * 2)
    chunks = [{"text": t, "meta": m}
              for t, m in zip(hits["documents"][0], hits["metadatas"][0])]
    return await rerank(query, chunks, top_k)
`,
  action: (ctx, V) => `${PY_HEADER(ctx)}
# ── Node 7 · Verify, Evals & Respond ────────────────────────
from fastapi.responses import JSONResponse

async def verify_and_respond(query: ${V.Class}Query, answer: str, sources: list[dict]) -> JSONResponse:
    """Score quality, log the trace, and return the final response."""
    scores = await evaluate(answer, sources)
    if not scores["pass"]:
        answer = "I could not verify an answer reliably. Please refine the question."
    await audit(query.user_id or "anonymous", "ask", {"query": query.query, "scores": scores})
    return JSONResponse({
        "answer": answer,
        "sources": [s["meta"] for s in sources],
        "scores": scores,
        "trace_id": trace.get_current_span().get_span_context().trace_id,
    })
`,
  store: (ctx, V) => `${PY_HEADER(ctx)}
# ── Store / State / Memory ──────────────────────────────────
from langgraph.checkpoint.memory import MemorySaver

checkpointer = MemorySaver()   # swap for Postgres/SQLite in production

async def save_memory(session_id: str, entry: dict) -> None:
    """Persist a memory entry for a ${applyCtx('{ctx}', ctx)} session."""
    await redis.set(f"mem:{session_id}", json.dumps(entry), ex=86400)

async def load_memory(session_id: str) -> dict | None:
    raw = await redis.get(f"mem:{session_id}")
    return json.loads(raw) if raw else None
`,
}

// Map an HLD layer to its code template. Every pattern's High-Level
// Design uses canonical tiers 01–05 with the same role per tier, so the
// tier position is the primary key — this keeps the code exactly
// matching the block even when titles deviate (e.g. “Channel Layer”,
// “Secure Transport”). Within a tier, keyword prefix-matches refine the
// role (\b(word)\w* so “Processing”, “Training”, “Delivery” all hit).
const HLD_MATCH = [
  [/\b(client|experience|portal|dashboard|frontend|ui)\w*/i, 'client'],
  [/\b(gateway|ingress|guardrail)\w*|\bapi\b|api /i, 'gateway'],
  [/\b(orchestrat|planner|supervisor|crew|workflow|specialist)\w*/i, 'agent'],
  [/\b(ai|knowledge|model|llm|inference|reasoning|embedding|vector)\w*\b|knowledge base/i, 'ai'],
  [/\b(data|database|store|storage|lake|warehouse)\w*\b|data lake/i, 'data'],
  [/\b(delivery|governance|observ|monitor|audit|deploy|compliance|evaluat|feedback)\w*/i, 'ops'],
]

// Deterministic role per canonical tier, refined by title keywords.
function hldKey(title, tier) {
  const t = String(title || '')
  const n = String(tier || '').padStart(2, '0')
  if (n === '01') {
    if (/\b(telemetry|document|data|ingest)\w*/i.test(t)) return 'data'
    return 'client'
  }
  if (n === '02') {
    if (/\b(featur|extract|pipeline)\w*/i.test(t)) return 'data'
    if (/\b(assistant|core|intellig|infer|generat|detect|anomal|correlat|train)\w*/i.test(t)) return 'ai'
    return 'gateway'
  }
  if (n === '03') {
    if (/\b(rules?|engin|scor|risk|train|tun|process|comput|infer)\w*/i.test(t)) return 'ai'
    if (/\b(transport|secure|tls|mqtt)\w*/i.test(t)) return 'gateway'
    if (/\b(store|vector|graph|index|database)\w*/i.test(t)) return 'data'
    return 'agent'
  }
  if (n === '04') {
    if (/\b(eval|evaluat|registry|qualit|observ|monitor|govern|audit|safety|brand|complianc)\w*/i.test(t)) return 'ops'
    if (/\b(ai|llm|infer|model|core)\w*/i.test(t)) return 'ai'
    if (/\b(agent|investigat|react|reason|orchestrat)\w*/i.test(t)) return 'agent'
    if (/\b(backplane|store|cloud|data|connector|tool|knowledge|memory)\w*/i.test(t)) return 'data'
    return 'ai'
  }
  if (n === '05') {
    if (/\b(govern|audit|compliance|monitor|feedback|deliver|insight|learning|observ|ops|eval|provenance|case|decision)\w*/i.test(t)) return 'ops'
    return 'data'
  }
  // No tier — fall back to title keyword matching.
  const key = HLD_MATCH.find(([re]) => re.test(t))
  return key ? key[1] : 'ops'
}

const kindKey = kind => ({ entry: 'entry', gateway: 'gateway', ai: 'ai', data: 'data', action: 'action', store: 'store' })[kind] || 'ai'

/**
 * Return { code, lang, label } for one block of a design.
 * @param {object} o { pattern, ctx, kind?, title?, tier? }
 */
export function blockCodeFor({ pattern, ctx, kind, title, tier }) {
  const V = { snake: varname(ctx), Class: pname(ctx) }
  let code = ''
  let lang = 'python'
  let label = title || 'block'
  if (kind) {
    code = (LDD_NODE_CODE[kindKey(kind)] || LDD_NODE_CODE.ai)(ctx, V)
    lang = 'python'
    label = `${title || kind}`
  } else {
    const key = hldKey(title, tier)
    const tpl = HLD_LAYER_CODE[key] || HLD_LAYER_CODE.ops
    code = tpl(ctx, V)
    lang = key === 'client' ? 'jsx' : 'python'
    label = `${tier || ''} ${title || 'layer'}`.trim()
  }
  return { code, lang, label, kind: kind || 'layer' }
}

// Short implementation summary used under expanded blocks.
export function blockImplNote({ pattern, ctx, kind, title }) {
  return applyCtx(
    `Implementation of “${title}” for {ctx} — replace the placeholder logic with your data, models and tool connectors. The code above is a runnable scaffold: wire the FastAPI routes, LangGraph nodes and vector store into your repository.`,
    ctx
  )
}
