// ============================================================
// AI DESIGN SPACE — PROJECT IDEAS GENERATOR
// Deterministic combinatorial generator: for every functional
// domain of an industry it combines variants × patterns × angles
// to produce 1000+ unique, buildable project ideas. Each idea
// carries a project structure and per-file starter code.
// ============================================================

import { DESIGN_PATTERNS, getPattern } from './blueprints'

const VARIANTS = ['Real-Time', 'Predictive', 'Self-Service']

const ANGLES = [
  { name: 'Intelligent Assistant', desc: 'a conversational helper that guides teams and users through {domain} with grounded answers' },
  { name: 'Operations Copilot', desc: 'an in-flow copilot that reduces the effort of running {domain} day to day' },
  { name: 'Live Monitor', desc: 'a real-time watchtower over {domain} events with instant alerts' },
  { name: 'Anomaly Detector', desc: 'a model that flags unusual patterns inside {domain} before they become problems' },
  { name: 'Decision Optimizer', desc: 'an engine that recommends the best choice for {domain} under constraints' },
  { name: 'Workflow Automator', desc: 'a step-by-step automator that executes multi-stage {domain} tasks with approvals' },
  { name: 'Knowledge Navigator', desc: 'a retrieval system that explains {domain} rules and data with citations' },
  { name: 'Risk Guardian', desc: 'a screening layer that protects {domain} from fraud, errors and abuse' },
  { name: 'Forecast Engine', desc: 'a predictor that anticipates {domain} volumes, demand and failures' },
  { name: 'Self-Healing Operator', desc: 'a system that detects, diagnoses and fixes {domain} incidents automatically' },
]

const lc = s => s.charAt(0).toLowerCase() + s.slice(1)

export function countProjectIdeas(industry) {
  if (!industry) return 0
  return industry.domains.length * VARIANTS.length * DESIGN_PATTERNS.length * ANGLES.length
}

// Deterministic generation of ALL ideas for an industry (lightweight).
export function generateProjectIdeas(industry) {
  if (!industry) return []
  const ideas = []
  industry.domains.forEach((domain, di) => {
    VARIANTS.forEach((variant, vi) => {
      DESIGN_PATTERNS.forEach((pattern, pi) => {
        ANGLES.forEach((angle, ai) => {
          ideas.push({
            id: `${domain.name.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}-${vi}-${pi}-${ai}`,
            title: `${variant === 'Real-Time' ? 'Live' : variant} ${angle.name} · ${domain.name}`,
            domain: domain.name,
            domainIcon: domain.icon,
            variant,
            patternId: pattern.id,
            patternTag: pattern.tag,
            patternIcon: pattern.icon,
            angle: angle.name,
            angleDesc: angle.desc.replace(/\{domain\}/g, lc(domain.name)),
            desc: `A ${lc(angle.name)} for the ${domain.name} domain of ${industry.name}, built on the ${pattern.name.replace(' Architecture', '')} pattern. ${angle.desc.replace(/\{domain\}/g, lc(domain.name))}, ${lc(variant)}-first.`,
            stack: [pattern.tag, variant === 'Real-Time' ? 'FastAPI + Kafka' : variant === 'Predictive' ? 'MLOps + Feature Store' : 'RAG + VectorDB', 'LangGraph', 'Python'],
          })
        })
      })
    })
  })
  return ideas
}

// Search + pagination over an industry's ideas.
export function getProjectIdeas(industry, { q = '', page = 1, pageSize = 12 } = {}) {
  const all = generateProjectIdeas(industry)
  const query = q.trim().toLowerCase()
  const filtered = query
    ? all.filter(i => `${i.title} ${i.desc} ${i.patternTag} ${i.angle} ${i.domain}`.toLowerCase().includes(query))
    : all
  const total = filtered.length
  const pages = Math.max(1, Math.ceil(total / pageSize))
  const safePage = Math.min(Math.max(1, page), pages)
  return {
    ideas: filtered.slice((safePage - 1) * pageSize, safePage * pageSize),
    total,
    pages,
    page: safePage,
  }
}

// ---------- Starter code templates ----------
const py = '"""\n  {NAME}\n  {DESC}\n  Industry: {INDUSTRY} · Domain: {DOMAIN}\n  Pattern: {PATTERN}\n  Stack: FastAPI + LangGraph + {STACK}\n"""\n'

function readme(idea, industry) {
  return `# ${idea.title}

${idea.desc}

## Built for
- **Industry:** ${industry.name}
- **Domain:** ${idea.domain}
- **Pattern:** ${idea.patternTag} (${idea.patternId})
- **Approach:** ${idea.variant}-first

## Project structure
\`\`\`
${['app/main.py', 'app/agent.py', 'app/retriever.py', 'app/tools.py', 'app/config.py', 'tests/test_api.py', 'requirements.txt', '.env.example'].join('\n')}
\`\`\`

## Run
\`\`\`bash
pip install -r requirements.txt
uvicorn app.main:app --reload
\`\`\`

## Endpoints
| Method | Path | Purpose |
| ------ | ---- | ------- |
| GET | /health | Liveness probe |
| GET | /api/${idea.domain.replace(/[^a-z0-9]+/gi, '-').toLowerCase()} | Query the ${idea.domain} capability |
| POST | /api/${idea.domain.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}/action | Trigger an agentic action |

## Notes
- Swap the vector store for your ${industry.name} knowledge sources.
- Wire real MCP tool connectors for production integrations.
- Add evals + observability before promoting to production.
`
}

function mainPy(idea, industry) {
  return `${py.replace('{NAME}', idea.title).replace('{DESC}', idea.desc).replace('{INDUSTRY}', industry.name).replace('{DOMAIN}', idea.domain).replace('{PATTERN}', idea.patternTag).replace('{STACK}', idea.stack.join(', '))}
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from app.agent import run_agent
from app.config import settings
from app.retriever import retrieve_context
from app.tools import TOOL_REGISTRY

app = FastAPI(title="${idea.title}", version="0.1.0")

class Query(BaseModel):
    question: str
    user_id: str | None = None

class Action(BaseModel):
    intent: str
    payload: dict = {}

@app.get("/health")
def health():
    return {"status": "ok", "service": "${idea.domain}", "industry": "${industry.name}"}

@app.get("/api/${idea.domain.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}")
def query_api(body: Query):
    """Answer a ${lc(idea.domain)} question, grounded in retrieval."""
    context = retrieve_context(body.question)
    result = run_agent(body.question, context, user_id=body.user_id)
    return result

@app.post("/api/${idea.domain.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}/action")
def run_action(body: Action):
    """Execute a ${lc(idea.domain)} action through the tool layer."""
    tool = TOOL_REGISTRY.get(body.intent)
    if not tool:
        raise HTTPException(404, f"Unknown intent: {body.intent}")
    return tool.execute(body.payload)
`
}

function agentPy(idea, industry) {
  return `${py.replace('{NAME}', idea.title).replace('{DESC}', idea.desc).replace('{INDUSTRY}', industry.name).replace('{DOMAIN}', idea.domain).replace('{PATTERN}', idea.patternTag).replace('{STACK}', idea.stack.join(', '))}
from langgraph.graph import StateGraph, END
from typing import TypedDict, Annotated

from app.retriever import retrieve_context
from app.tools import TOOL_REGISTRY

class AgentState(TypedDict):
    question: str
    context: list
    steps: Annotated[list, "steps"]
    answer: str

def plan(state: AgentState):
    """Decompose the request and gather context (${idea.patternTag})."""
    ctx = retrieve_context(state["question"])
    return {"context": ctx, "steps": [*state.get("steps", []), "planned"]}

def reason(state: AgentState):
    """Reason over context and decide if a tool call is needed."""
    needs_tool = any(t.match(state["question"]) for t in TOOL_REGISTRY.values())
    return {"steps": [*state["steps"], f"reasoned (tool={needs_tool})"]}

def act(state: AgentState):
    """Execute tool calls (ReAct-style) when required."""
    results = []
    for tool in TOOL_REGISTRY.values():
        if tool.match(state["question"]):
            results.append(tool.execute({"from": state["question"][:80]}))
    return {"steps": [*state["steps"], f"acted ({len(results)})"]}

def answer(state: AgentState):
    """Draft the final, cited answer."""
    return {"answer": f"[{industry_domain}] Draft answer for: {state['question']}", "steps": [*state["steps"], "answered"]}

industry_domain = "${industry.name} · ${idea.domain}"

graph = StateGraph(AgentState)
graph.add_node("plan", plan)
graph.add_node("reason", reason)
graph.add_node("act", act)
graph.add_node("answer", answer)
graph.set_entry_point("plan")
graph.add_edge("plan", "reason")
graph.add_conditional_edges("reason", lambda s: "act" if s["steps"][-1].endswith("tool=True") else "answer", {"act": "act", "answer": "answer"})
graph.add_edge("act", "answer")
graph.add_edge("answer", END)
app_graph = graph.compile()

def run_agent(question: str, context: list, user_id: str | None = None):
    result = app_graph.invoke({"question": question, "context": context, "steps": []})
    return {"answer": result["answer"], "steps": result["steps"], "trace_id": f"{user_id or 'anon'}:{hash(question) % 10 ** 8}"}
`
}

function retrieverPy(idea, industry) {
  return `${py.replace('{NAME}', idea.title).replace('{DESC}', idea.desc).replace('{INDUSTRY}', industry.name).replace('{DOMAIN}', idea.domain).replace('{PATTERN}', idea.patternTag).replace('{STACK}', idea.stack.join(', '))}
"""${idea.variant}-first retrieval: embed → vector search → rerank."""
from typing import Optional

from app.config import settings

# Swap these stubs for your real ${industry.name} sources (policies, SOPs, docs, DBs).
SOURCE_DOCS = [
    {"id": 1, "title": "${industry.name} ${idea.domain} policy", "text": "How ${idea.domain} should be handled end to end."},
    {"id": 2, "title": "${industry.name} ${idea.domain} SOP", "text": "Step-by-step operating procedure for ${idea.domain}."},
    {"id": 3, "title": "${industry.name} ${idea.domain} FAQ", "text": "Common questions about ${idea.domain}."},
]

def embed(text: str) -> list[float]:
    # Replace with a real embedding model (sentence-transformers / OpenAI / local).
    return [float(len(text) % 997) / 997.0] * settings.EMBED_DIM

def retrieve_context(question: str, top_k: int = 3) -> list[dict]:
    q_vec = embed(question)
    scored = []
    for doc in SOURCE_DOCS:
        doc_vec = embed(doc["text"])
        sim = sum(a * b for a, b in zip(q_vec, doc_vec))  # cosine on normalized vectors
        scored.append((sim, doc))
    scored.sort(key=lambda x: x[0], reverse=True)
    return [doc for _, doc in scored[:top_k]]
`
}

function toolsPy(idea, industry) {
  return `${py.replace('{NAME}', idea.title).replace('{DESC}', idea.desc).replace('{INDUSTRY}', industry.name).replace('{DOMAIN}', idea.domain).replace('{PATTERN}', idea.patternTag).replace('{STACK}', idea.stack.join(', '))}
"""MCP-style tool registry — every tool is permission-scoped + auditable."""
from dataclasses import dataclass, field

@dataclass
class Tool:
    name: str
    scope: str
    handler: callable
    keywords: tuple = ()
    audit: list = field(default_factory=list)

    def match(self, question: str) -> bool:
        return any(k in question.lower() for k in self.keywords)

    def execute(self, payload: dict) -> dict:
        # Guardrail: log every call for audit/observability.
        self.audit.append(payload)
        return {"tool": self.name, "scope": self.scope, "ok": True, "detail": self.handler(payload)}

def _lookup(payload): return {"found": f"record for {payload.get('from', '?')}"}
def _schedule(payload): return {"scheduled": True, "when": "next business day"}
def _alert(payload): return {"alerted": True, "channel": "ops"}

TOOL_REGISTRY = {
    "lookup": Tool("lookup", "read", _lookup, ("where", "status", "find")),
    "schedule": Tool("schedule", "write", _schedule, ("schedule", "book", "plan")),
    "alert": Tool("alert", "write", _alert, ("alert", "notify", "escalate")),
}
`
}

function configPy(idea, industry) {
  return `${py.replace('{NAME}', idea.title).replace('{DESC}', idea.desc).replace('{INDUSTRY}', industry.name).replace('{DOMAIN}', idea.domain).replace('{PATTERN}', idea.patternTag).replace('{STACK}', idea.stack.join(', '))}
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    app_name: str = "${idea.title}"
    environment: str = "dev"
    embed_dim: int = 384
    vector_store: str = "chroma"          # or qdrant / pgvector
    llm_model: str = "gpt-4o-mini"        # or a local / fine-tuned (LoRA) model
    guardrails_enabled: bool = True
    eval_threshold: float = 0.8           # min faithfulness score to auto-serve

    class Config:
        env_file = ".env"

settings = Settings()
`
}

function testsPy(idea, industry) {
  return `${py.replace('{NAME}', idea.title).replace('{DESC}', idea.desc).replace('{INDUSTRY}', industry.name).replace('{DOMAIN}', idea.domain).replace('{PATTERN}', idea.patternTag).replace('{STACK}', idea.stack.join(', '))}
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)

def test_health():
    r = client.get("/health")
    assert r.status_code == 200
    assert r.json()["status"] == "ok"

def test_query():
    r = client.get("/api/${idea.domain.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}", json={"question": "how do we handle ${lc(idea.domain)}?"})
    assert r.status_code == 200
    assert "answer" in r.json()

def test_action_unknown_intent():
    r = client.post("/api/${idea.domain.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}/action", json={"intent": "nope"})
    assert r.status_code == 404
`
}

function requirements(idea) {
  return `fastapi
uvicorn[standard]
pydantic
pydantic-settings
langgraph
langchain
chromadb        # or qdrant-client / pgvector
sentence-transformers
httpx
pytest
`
}

function envExample(idea) {
  return `# ${idea.title}
ENVIRONMENT=dev
EMBED_DIM=384
VECTOR_STORE=chroma
LLM_MODEL=gpt-4o-mini
GUARDRAILS_ENABLED=true
EVAL_THRESHOLD=0.8
`
}

// Full project blueprint for one idea: structure tree + per-file code.
export function projectIdeaCode(idea, industry) {
  return {
    structure: [
      '📁 project/',
      '  📁 app/',
      '    📄 main.py',
      '    📄 agent.py',
      '    📄 retriever.py',
      '    📄 tools.py',
      '    📄 config.py',
      '  📁 tests/',
      '    📄 test_api.py',
      '  📄 README.md',
      '  📄 requirements.txt',
      '  📄 .env.example',
    ],
    files: [
      { path: 'README.md', lang: 'md', code: readme(idea, industry) },
      { path: 'app/main.py', lang: 'python', code: mainPy(idea, industry) },
      { path: 'app/agent.py', lang: 'python', code: agentPy(idea, industry) },
      { path: 'app/retriever.py', lang: 'python', code: retrieverPy(idea, industry) },
      { path: 'app/tools.py', lang: 'python', code: toolsPy(idea, industry) },
      { path: 'app/config.py', lang: 'python', code: configPy(idea, industry) },
      { path: 'tests/test_api.py', lang: 'python', code: testsPy(idea, industry) },
      { path: 'requirements.txt', lang: 'text', code: requirements(idea) },
      { path: '.env.example', lang: 'text', code: envExample(idea) },
    ],
  }
}

// Small helper: top sample ideas for a country page etc.
export function sampleIdeas(industry, n = 3) {
  const all = generateProjectIdeas(industry)
  const pick = [0, 11, 57].map(i => all[i]).filter(Boolean)
  return pick.slice(0, n)
}
