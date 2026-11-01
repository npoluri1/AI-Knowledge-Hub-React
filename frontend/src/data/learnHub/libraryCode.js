// ============================================================
// AI PREP · LEARNING HUB — LIBRARY CODE SAMPLES
// Complete, runnable, heavily-commented code shown when a user
// clicks a library block on the hub page. Each sample is real
// production-style code for that library's domain, with inline
// comments explaining every section.
// ============================================================

export const LIBRARY_CODE = {
  aiprep: {
    lang: 'python',
    title: 'AI/ML Resources — end-to-end ML pipeline',
    code: `# ============================================================
# AI/ML RESOURCES — END-TO-END ML PIPELINE
# Train, evaluate and serve a model for any industry domain.
# Run:  python ml_pipeline.py
# ============================================================
from sklearn.model_selection import train_test_split
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.metrics import classification_report
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
import pandas as pd
import joblib

# ---- 1. Load & inspect data ---------------------------------
# Real projects always start with dirty, incomplete data.
df = pd.read_csv("dataset.csv")
print("shape:", df.shape, "| nulls:", df.isnull().sum().sum())

# ---- 2. Feature engineering ---------------------------------
# Keep the columns the model actually needs; drop ids/PII.
FEATURES = ["amount", "frequency", "balance", "channel"]
X = df[FEATURES]
y = df["target"]

# ---- 3. Train / test split ----------------------------------
# Never evaluate on data the model has already seen.
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# ---- 4. Pipeline: scale -> model ----------------------------
# A Pipeline keeps preprocessing and model as ONE artifact.
model = Pipeline([
    ("scale", StandardScaler()),
    ("clf", GradientBoostingClassifier(n_estimators=200, max_depth=4)),
])

# ---- 5. Train -------------------------------------------------
model.fit(X_train, y_train)

# ---- 6. Evaluate ---------------------------------------------
y_pred = model.predict(X_test)
print(classification_report(y_test, y_pred))  # precision/recall/f1

# ---- 7. Persist for serving ----------------------------------
joblib.dump(model, "model.joblib")
print("model saved → model.joblib")`,
  },

  sysdesign: {
    lang: 'python',
    title: 'System Design — resilient FastAPI service',
    code: `# ============================================================
# SYSTEM DESIGN — RESILIENT FASTAPI SERVICE
# Retries, rate limiting, circuit breaker and graceful
# degradation — the patterns every production API needs.
# Run:  uvicorn service:app --reload
# ============================================================
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
import asyncio
import time

app = FastAPI(title="Resilient Service")

# ---- Rate limiting (token bucket in memory) ------------------
_buckets = {}  # ip -> [timestamps]

async def rate_limit(request: Request, max_req: int = 60, window: float = 60.0):
    ip = request.client.host if request.client else "unknown"
    now = time.time()
    _buckets[ip] = [t for t in _buckets.get(ip, []) if now - t < window]
    if len(_buckets[ip]) >= max_req:
        raise HTTPException(status_code=429, detail="Too many requests")
    _buckets[ip].append(now)

# ---- Circuit breaker: fail fast when downstream is down -------
class CircuitBreaker:
    def __init__(self, threshold=5, cooldown=30):
        self.failures = 0
        self.threshold = threshold      # failures before opening
        self.cooldown = cooldown        # seconds to stay open
        self.opened_at = 0.0
        self.state = "closed"           # closed | open | half-open

    async def call(self, fn):
        if self.state == "open":
            if time.time() - self.opened_at > self.cooldown:
                self.state = "half-open"   # allow one probe request
            else:
                raise HTTPException(status_code=503, detail="Downstream unavailable (circuit open)")
        try:
            result = await fn()
            self.failures = 0
            self.state = "closed"          # success closes the circuit
            return result
        except Exception:
            self.failures += 1
            if self.failures >= self.threshold:
                self.state = "open"
                self.opened_at = time.time()
            raise HTTPException(status_code=502, detail="Downstream failed")

circuit = CircuitBreaker()

# ---- The actual work with retry + backoff ---------------------
async def fetch_downstream(payload: dict) -> dict:
    for attempt in range(3):            # max 3 attempts
        try:
            await asyncio.sleep(0.2)    # simulated external call
            return {"ok": True, "echo": payload}
        except Exception:
            await asyncio.sleep(0.5 * attempt)   # exponential backoff
    raise RuntimeError("downstream unreachable")

@app.get("/api/health")
async def health():
    return {"status": "up", "circuit": circuit.state}

@app.post("/api/work")
async def do_work(payload: dict, request: Request):
    await rate_limit(request)           # middleware-style guard
    return await circuit.call(lambda: fetch_downstream(payload))`,
  },

  agents: {
    lang: 'python',
    title: 'AI Agents — LangGraph agent with tools + memory',
    code: `# ============================================================
# AI AGENTS — LANGGRAPH AGENT WITH TOOLS + MEMORY
# A ReAct-style agent: thinks, calls a tool, observes,
# and repeats until it has a grounded answer.
# Run:  python agent.py
# ============================================================
from langgraph.graph import StateGraph, END
from typing import TypedDict, List

# ---- State: everything the agent carries between steps -------
class AgentState(TypedDict):
    question: str
    messages: List[dict]     # conversation memory
    tool_result: str
    answer: str
    attempts: int

# ---- Tool: the agent's hands on the outside world ------------
def search_knowledge(query: str) -> str:
    """Simulated retrieval — in production this hits a vector DB."""
    return f"grounded facts about: {query}"

# ---- Node 1: decide what to do -------------------------------
def decide(state: AgentState) -> dict:
    if state.get("tool_result"):
        return {"answer": f"Based on the search: {state['tool_result']}"}
    return {"attempts": state.get("attempts", 0) + 1}

# ---- Node 2: call the tool (the 'act' step of ReAct) ---------
def act(state: AgentState) -> dict:
    result = search_knowledge(state["question"])
    return {"tool_result": result, "messages": [*state.get("messages", []), {"role": "tool", "content": result}]}

# ---- Router: keep looping until an answer exists -------------
def route(state: AgentState) -> str:
    if state.get("answer") or state.get("attempts", 0) >= 3:
        return "end"        # answered, or budget exhausted
    return "act"            # think -> act -> observe -> repeat

# ---- Wire the graph -------------------------------------------
builder = StateGraph(AgentState)
builder.add_node("decide", decide)
builder.add_node("act", act)
builder.set_entry_point("decide")
builder.add_conditional_edges("decide", route, {"act": "act", "end": END})
builder.add_edge("act", "decide")   # loop back to re-evaluate

agent = builder.compile()

# ---- Run it ---------------------------------------------------
result = agent.invoke({"question": "How does MCP connect tools?", "messages": [], "attempts": 0})
print(result["answer"])`,
  },

  infra: {
    lang: 'python',
    title: 'AI Infrastructure — quantized LLM inference',
    code: `# ============================================================
# AI INFRASTRUCTURE — QUANTIZED LLM INFERENCE (FP8 / INT8)
# Run a large model on small hardware by dropping precision
# from FP16 to INT8 — ~4x less memory, minimal quality loss.
# Run:  python quantized_inference.py
# ============================================================
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer

# ---- 1. Load the tokenizer (text <-> token ids) --------------
model_id = "meta-llama/Llama-3.2-1B"
tokenizer = AutoTokenizer.from_pretrained(model_id)

# ---- 2. Load in 8-bit quantization ---------------------------
# bitsandbytes keeps weights at INT8 and upcasts only for compute.
model = AutoModelForCausalLM.from_pretrained(
    model_id,
    load_in_8bit=True,                 # FP16 -> INT8 (4x smaller)
    device_map="auto",                 # split across GPUs if needed
    torch_dtype=torch.float16,
)

# ---- 3. Generate tokens --------------------------------------
prompt = "Explain the GPU memory hierarchy in one paragraph:"
inputs = tokenizer(prompt, return_tensors="pt").to(model.device)

with torch.no_grad():
    out = model.generate(
        **inputs,
        max_new_tokens=128,            # cap output = cap cost
        temperature=0.7,
        do_sample=True,
    )

print(tokenizer.decode(out[0], skip_special_tokens=True))

# ---- 4. Measure the win --------------------------------------
# FP16 model: ~2GB · INT8 model: ~0.5GB for 1B params
# Trade-off: tiny quality drop, huge memory + latency savings.
# For production: cache the KV-cache, batch requests, and
# pin the model with vLLM / TGI for 10-100x throughput.`,
  },

  python: {
    lang: 'python',
    title: 'Python Code — interactive predict-the-output quiz',
    code: `# ============================================================
# PYTHON CODE — PREDICT THE OUTPUT
# This is the exact interactive style used across the library:
# read the code, predict what prints, then reveal the answer.
# ============================================================

# ---------- Q1: mutable default arguments (the classic trap) --
def add_item(item, cart=[]):
    cart.append(item)        # default [] is created ONCE, not per call
    return cart

print(add_item("apple"))     # ['apple']
print(add_item("banana"))    # ?? -> ['apple', 'banana']  (SAME list!)
# FIX: use None as the sentinel default
def add_item_fixed(item, cart=None):
    cart = cart if cart is not None else []
    cart.append(item)
    return cart

# ---------- Q2: closures capture variables, not values --------
counters = []
for i in range(3):
    counters.append(lambda: i)   # i is looked up AT CALL TIME

print([f() for f in counters])   # [2, 2, 2], not [0, 1, 2]!
# FIX: bind the value with a default arg
counters = [lambda i=i: i for i in range(3)]
print([f() for f in counters])   # [0, 1, 2]

# ---------- Q3: list vs generator memory -----------------------
import sys
big_list = [x for x in range(1_000_000)]          # list: ~8MB
big_gen  = (x for x in range(1_000_000))          # generator: bytes
print(sys.getsizeof(big_list), sys.getsizeof(big_gen))  # 8448728 vs 208`,
  },

  quantum: {
    lang: 'python',
    title: 'Quantum Computing — Qiskit Bell state + measurement',
    code: `# ============================================================
# QUANTUM COMPUTING — BELL STATE WITH QISKIT
# Entangle two qubits, then measure: the outcomes are
# perfectly correlated — the core trick behind QKD, teleportation.
# Run:  pip install qiskit && python bell.py
# ============================================================
from qiskit import QuantumCircuit, transpile
from qiskit_aer import AerSimulator

# ---- 1. Build the circuit: 2 qubits, 2 classical bits --------
qc = QuantumCircuit(2, 2)

# Hadamard on qubit 0: puts it into a SUPERPOSITION of |0> and |1>
qc.h(0)

# CNOT: entangles qubit 1 with qubit 0.
# If q0 is |1> the target flips, if |0> nothing happens.
qc.cx(0, 1)

# Measure both qubits into the classical register.
qc.measure([0, 1], [0, 1])

# ---- 2. Run on a simulator -----------------------------------
backend = AerSimulator()
job = backend.run(transpile(qc, backend), shots=1024)
counts = job.result().get_counts(qc)

# ---- 3. Interpret the results --------------------------------
# Entanglement means the outcomes are 00 OR 11 — never 01/10.
print(counts)   # e.g. {'00': 517, '11': 507}  (~50/50, always matching)

# Why it matters: measure one qubit and you instantly know the
# other — this correlation is the resource behind quantum key
# distribution (QKD) and teleportation protocols.`,
  },

  tests: {
    lang: 'python',
    title: 'Interview Tests — model exam with graded answer',
    code: `# ============================================================
# AI/ML INTERVIEW TESTS — MODEL EXAM & SCORING
# The runner behind the 12 timed tests: ask, accept an answer,
# score it against a rubric, and explain the result.
# Run:  python test_runner.py
# ============================================================
class InterviewQuestion:
    def __init__(self, prompt, rubric, answer):
        self.prompt = prompt
        self.rubric = rubric   # list of (keyword, points) checks
        self.answer = answer   # model answer for the explanation

    def score(self, user_answer: str) -> dict:
        """Grade by keyword rubric; return points + feedback."""
        points, feedback = 0, []
        for keyword, pts in self.rubric:
            if keyword.lower() in user_answer.lower():
                points += pts
                feedback.append(f"+{pts} mentioned '{keyword}'")
            else:
                feedback.append(f"-0 missing '{keyword}'")
        return {"points": points, "max": sum(p for _, p in self.rubric), "feedback": feedback}

# Example: the classic "what is a vector embedding?" question
q = InterviewQuestion(
    prompt="Explain what a vector embedding is and why RAG needs it.",
    rubric=[("dense", 2), ("similar", 2), ("retriev", 2), ("semantic", 2)],
    answer="A dense numerical vector representing meaning; similar meanings sit close in space, which is what retrieval searches over.",
)

result = q.score("An embedding maps text to numbers so semantic similarity can be retrieved quickly.")
print(result)   # {'points': 6, 'max': 8, 'feedback': [...]}

# Model answer to show after the test:
print("Model answer:", q.answer)`,
  },

  calculators: {
    lang: 'javascript',
    title: 'ML Calculators — confusion-matrix engine (client-side)',
    code: `// ============================================================
// ML CALCULATORS — CONFUSION MATRIX ENGINE
// The exact client-side logic behind the calculator: enter
// TP/FP/TN/FN and get every derived metric, live, no uploads.
// ============================================================

export function confusionMetrics(TP, FP, TN, FN) {
  // Guard: no negative or all-zero inputs
  const total = TP + FP + TN + FN;
  if ([TP, FP, TN, FN].some(v => v < 0) || total === 0) {
    return { error: "Enter positive counts summing > 0" };
  }

  // ---- The four core rates --------------------------------
  const accuracy  = (TP + TN) / total;                 // all correct / all
  const precision = TP / (TP + FP);                    // of predicted yes, how many real
  const recall    = TP / (TP + FN);                    // of real yes, how many caught
  const f1        = 2 * precision * recall / (precision + recall);

  // ---- Derived metrics used by practitioners --------------
  const specificity = TN / (TN + FP);                  // real no's correctly rejected
  const tpr  = recall;                                 // true positive rate
  const fpr  = FP / (FP + TN);                         // false positive rate
  const mcc  = (TP * TN - FP * FN) /
               Math.sqrt((TP + FP) * (TP + FN) * (TN + FP) * (TN + FN) || 1); // balanced score

  return {
    accuracy, precision, recall, f1, specificity,
    tpr, fpr, mcc,
    bars: { precision, recall, f1 }   // fed to the visual bars
  };
}

// Example: spam filter with 95 TP, 3 FP, 1900 TN, 2 FN
console.log(confusionMetrics(95, 3, 1900, 2));`,
  },

  blog: {
    lang: 'markdown',
    title: 'Blog & Deep Dives — article skeleton with code block',
    code: `# Tokenization: Why AI Charges Per Token

> **The intuition:** a model doesn't read letters — it reads tokens,
> chunks of text (often ~4 characters). Everything downstream —
> cost, context window, latency — is measured in tokens.

## What a token actually is
\`\`\`python
# Byte-Pair Encoding (BPE) in miniature
text = "Hello world"
# Tokenizer output (varies by model):
tokens = ["Hello", " world"]        # 2 tokens
print(f"cost ≈ {len(tokens)} tokens × rate")
\`\`\`

## The 3 costs of every token
1. **Input (prefill)** — the prompt you send
2. **Output (decode)** — 3-6x more expensive per token
3. **KV-cache memory** — every token keeps attention state alive

## The mitigation stack
\`\`\`python
# Cache repeated prefixes -> zero recompute
prompt_cache = Cache(prefix="system: you are...")   # ~90% cheaper
# Cap output tokens -> bound cost
response = model.generate(prompt, max_tokens=200)
\`\`\`

**Full article:** 16 min read · token economics, GPU memory
wall, FlashAttention, speculative decoding.`,
  },
}

// Language badge map used by the code panel header.
export const LIBRARY_LANG = {
  aiprep: 'python', sysdesign: 'python', agents: 'python', infra: 'python',
  python: 'python', quantum: 'python', tests: 'python', calculators: 'js', blog: 'md',
}
