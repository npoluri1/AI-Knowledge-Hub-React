"""pip install fastapi uvicorn   ->  uvicorn gw_09_agent_gateway:app --reload"""
import time, collections
from fastapi import FastAPI, Header, HTTPException, Request
from pydantic import BaseModel, Field

app = FastAPI(title="Agent Gateway")
KEYS = {"demo-key": {"tenant": "acme", "rpm": 60, "usd_left": 5.00}}
HITS: dict[str, deque] = collections.defaultdict(lambda: collections.deque())

def auth(authorization: str = Header(default="")):
    key = authorization.replace("Bearer ", "")
    if key not in KEYS: raise HTTPException(401, "bad api key")
    k = KEYS[key]; q = HITS[key]
    now = time.time()
    while q and now - q[0] > 60: q.popleft()
    if len(q) >= k["rpm"]: raise HTTPException(429, "rate limited")
    q.append(now)
    if k["usd_left"] <= 0: raise HTTPException(402, "budget exhausted")
    return key

class Invoke(BaseModel):
    agent: str = Field(pattern="^(support|analyst)$")
    message: str
    max_usd: float = 0.05                                   # per-call cap

AGENTS = {
  "support": lambda m: {"reply": f"Support handled: {m}", "tokens": 40},
  "analyst": lambda m: {"reply": f"Analysis of: {m}", "tokens": 220},
}
PRICE_1K = 0.002                                            # $ per 1k tokens

@app.post("/v1/agents/{agent}/invoke")
def invoke(agent: str, body: Invoke, key: str = None, authorization: str = Header(default="")):
    key = auth(authorization)
    if agent != body.agent: raise HTTPException(400, "agent mismatch")
    out = AGENTS[agent](body.message)
    cost = out["tokens"] / 1000 * PRICE_1K
    KEYS[key]["usd_left"] -= cost                           # debit wallet
    return {"tenant": KEYS[key]["tenant"], **out, "cost_usd": round(cost, 6),
            "wallet_left": round(KEYS[key]["usd_left"], 4)}

@app.get("/healthz")
def health(): return {"ok": True}

# curl -X POST localhost:8000/v1/agents/support/invoke \
#   -H "Authorization: Bearer demo-key" -H "Content-Type: application/json" \
#   -d '{"agent":"support","message":"reset my printer"}' 