# THE DAILY ESSENTIAL — Most Important Stuff To Learn

> **Rule:** Learn 20% that gives 80% results. Ignore shiny objects. Build daily.
> **Target:** Job safety 10+ yrs | Budget: Zero-cost | Singapore market

---

## PRIORITY #1 — LEARN THESE FIRST (Critical for job survival, 80% of interview questions)

| Rank | Skill | Why It Saves Your Job | Time to Master | Free Tool |
|------|-------|-----------------------|----------------|-----------|
| 1 | LangGraph StateGraph | Multi-agent orchestration = #1 demand skill | 3 weeks | LangGraph OSS |
| 2 | RAG (Basic + Advanced) | Every enterprise AI app starts with RAG | 4 weeks | ChromaDB + LangChain |
| 3 | FastAPI + Python async | Every AI service needs an API layer | 3 weeks | FastAPI |
| 4 | MCP Protocol | Connecting AI to tools = infrastructure layer | 2 weeks | MCP Python SDK |
| 5 | LLM Evals (Ragas) | Companies need to measure AI quality | 1 week | Ragas OSS |
| 6 | Prompt Engineering | Day-to-day AI work | 2 weeks | Free (practice) |
| 7 | Docker for AI | Every AI app must be deployable | 1 week | Docker Desktop |
| 8 | Model Serving (vLLM) | Serving models in production | 1 week | vLLM OSS |
| 9 | AI Security (Guardrails) | Production requirement, not optional | 1 week | NeMo Guardrails |
| 10 | LangChain LCEL | Foundation for LangGraph | 1 week | LangChain OSS |

### Priority #1 — Code Examples

```python
# 1. LangGraph StateGraph — Multi-agent orchestration
from langgraph.graph import StateGraph, MessagesState, START, END
from langchain_openai import ChatOpenAI

model = ChatOpenAI(model="gpt-4o")

def agent_node(state: MessagesState):
    response = model.invoke(state["messages"])
    return {"messages": [response]}

def router(state: MessagesState):
    last_msg = state["messages"][-1]
    if "search" in last_msg.content.lower():
        return "search_agent"
    return "general_agent"

graph = StateGraph(MessagesState)
graph.add_node("agent", agent_node)
graph.add_conditional_edges(START, router, {"search_agent": "agent", "general_agent": "agent"})
graph.add_edge("agent", END)
app = graph.compile()

result = app.invoke({"messages": [("user", "Search for LangGraph tutorials")]})
print(result["messages"][-1].content)
```

```python
# 2. RAG — Basic pipeline with ChromaDB
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain.chains import RetrievalQA

# Load and split
loader = PyPDFLoader("document.pdf")
docs = loader.load()
splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
chunks = splitter.split_documents(docs)

# Embed and store
vectorstore = Chroma.from_documents(chunks, OpenAIEmbeddings(), persist_directory="./chroma_db")

# Query
qa_chain = RetrievalQA.from_chain_type(
    llm=ChatOpenAI(model="gpt-4o"),
    retriever=vectorstore.as_retriever(search_kwargs={"k": 3}),
)
answer = qa_chain.invoke("What is the main topic?")
print(answer["result"])
```

```python
# 3. FastAPI + Async — AI service API
from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import openai

app = FastAPI()
client = openai.AsyncOpenAI()

class QueryRequest(BaseModel):
    prompt: str
    model: str = "gpt-4o"

@app.post("/chat")
async def chat(req: QueryRequest):
    response = await client.chat.completions.create(
        model=req.model,
        messages=[{"role": "user", "content": req.prompt}],
        stream=True,
    )
    async def generate():
        async for chunk in response:
            if chunk.choices[0].delta.content:
                yield chunk.choices[0].delta.content
    return StreamingResponse(generate(), media_type="text/plain")
```

```python
# 4. MCP Protocol — Tool server
from mcp.server import Server
from mcp.types import Tool, TextContent

server = Server("my-tools")

@server.list_tools()
async def list_tools():
    return [
        Tool(name="search_docs", description="Search documentation", inputSchema={
            "type": "object",
            "properties": {"query": {"type": "string"}},
            "required": ["query"]
        })
    ]

@server.call_tool()
async def call_tool(name: str, arguments: dict):
    if name == "search_docs":
        results = f"Results for: {arguments['query']}"
        return [TextContent(type="text", text=results)]
```

```python
# 5. RAGAS — RAG evaluation
from ragas import evaluate
from ragas.metrics import faithfulness, answer_relevancy, context_precision
from datasets import Dataset

eval_data = {
    "question": ["What is LangGraph?"],
    "answer": ["LangGraph is a library for building agent workflows."],
    "contexts": [["LangGraph extends LangChain with stateful graph-based agent orchestration."]],
    "ground_truth": ["LangGraph is a stateful orchestration framework for LLM agents."],
}
dataset = Dataset.from_dict(eval_data)
result = evaluate(dataset, metrics=[faithfulness, answer_relevancy, context_precision])
print(result)
```

---

## PRIORITY #2 — LEARN SECOND (Important but not urgent)

| Rank | Skill | Why | Time | Free Tool |
|------|-------|-----|------|-----------|
| 11 | Fine-tuning (LoRA) | Custom models for niche tasks | 2wk | PEFT + Ollama |
| 12 | Spring AI Bridge | Your Java edge + AI | 2wk | Spring AI OSS |
| 13 | CrewAI / AutoGen | Alternative agent frameworks | 1wk | OSS |
| 14 | K8s for AI | Scaling in big companies | 2wk | minikube |
| 15 | CI/CD for AI | Professional deployment | 1wk | GitHub Actions |
| 16 | Observability (OTel) | Production debugging | 1wk | OpenTelemetry |
| 17 | Redis + Semantic Cache | Cost reduction | 1wk | Redis |

### Priority #2 — Code Examples

```python
# 11. LoRA Fine-tuning with PEFT
from peft import LoraConfig, get_peft_model, TaskType
from transformers import AutoModelForCausalLM, AutoTokenizer

model = AutoModelForCausalLM.from_pretrained("meta-llama/Llama-2-7b-hf")
tokenizer = AutoTokenizer.from_pretrained("meta-llama/Llama-2-7b-hf")

lora_config = LoraConfig(
    task_type=TaskType.CAUSAL_LM,
    r=16, lora_alpha=32,
    lora_dropout=0.1,
    target_modules=["q_proj", "v_proj"],
)
model = get_peft_model(model, lora_config)
model.print_trainable_parameters()  # trainable params: ~4M vs 7B total
```

```python
# 12. Spring AI Bridge — Java + Python AI service
# Java Spring AI controller
"""
@RestController
@RequestMapping("/api/ai")
public class AiController {
    @Autowired
    private ChatClient chatClient;

    @PostMapping("/chat")
    public ResponseEntity<String> chat(@RequestBody ChatRequest request) {
        String response = chatClient.prompt()
            .user(request.getMessage())
            .call()
            .content();
        return ResponseEntity.ok(response);
    }
}
"""
# Python FastAPI service that Spring calls
from fastapi import FastAPI
import httpx

app = FastAPI()

@app.post("/api/python-bridge")
async def python_bridge(data: dict):
    # Process with local Ollama
    async with httpx.AsyncClient() as client:
        resp = await client.post("http://localhost:11434/api/generate", json={
            "model": "qwen2.5-coder:7b",
            "prompt": data["prompt"],
            "stream": False,
        })
    return {"response": resp.json()["response"]}
```

```python
# 14. Kubernetes for AI — Deployment manifest
# deploy.yaml
"""
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ai-service
spec:
  replicas: 2
  selector:
    matchLabels:
      app: ai-service
  template:
    metadata:
      labels:
        app: ai-service
    spec:
      containers:
      - name: ai-api
        image: your-registry/ai-api:latest
        ports:
        - containerPort: 8000
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "1Gi"
            cpu: "1000m"
        env:
        - name: OPENAI_API_KEY
          valueFrom:
            secretKeyRef:
              name: ai-secrets
              key: openai-key
"""
```

```python
# 15. CI/CD for AI — GitHub Actions
# .github/workflows/ai-deploy.yml
"""
name: AI Service CI/CD
on:
  push:
    branches: [main]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      - run: pip install -r requirements.txt
      - run: pytest tests/ -v
      - run: python -m ragas.evaluate  # run evals in CI
  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: docker build -t ai-service .
      - run: docker push your-registry/ai-service:latest
"""
```

```python
# 16. OpenTelemetry for AI observability
from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import ConsoleSpanExporter

provider = TracerProvider()
provider.add_span_processor(ConsoleSpanExporter())
trace.set_tracer_provider(provider)
tracer = trace.get_tracer("ai-service")

with tracer.start_as_current_span("llm_call") as span:
    span.set_attribute("model", "gpt-4o")
    span.set_attribute("input_tokens", 150)
    span.set_attribute("output_tokens", 200)
    response = call_llm(prompt)
    span.set_attribute("latency_ms", 1200)
```

```python
# 17. Redis Semantic Cache
import redis
import numpy as np

r = redis.Redis()

def semantic_cache(query: str, embedding_fn, threshold=0.95):
    query_vec = embedding_fn(query)
    # Search for similar cached queries
    keys = r.keys("cache:*")
    for key in keys:
        cached_vec = np.frombuffer(r.hget(key, "embedding"), dtype=np.float32)
        similarity = np.dot(query_vec, cached_vec) / (np.linalg.norm(query_vec) * np.linalg.norm(cached_vec))
        if similarity > threshold:
            return r.hget(key, "response").decode()
    return None
```

---

## PRIORITY #3 — SKIP FOR NOW (Monitor only)

| Skill | When to Learn | Why Skip |
|-------|---------------|----------|
| Quantum Computing | Year 2-3 | No job impact in next 5 years |
| Robotics + AI | Year 2-3 | Niche, fewer jobs |
| Building LLMs from scratch | Never needed | Use existing APIs and open models |
| 500 projects | Never | 8 deep projects > 500 shallow ones |
| Every new AI tool | Only if market-proven | Shiny object syndrome = wasted time |

---

## DAILY LEARNING ROUTINE (4-6 hrs/day, 6 days/week)

| Time Slot | Duration | Activity | What Exactly |
|-----------|----------|----------|--------------|
| Morning Theory | 1 hr | Read + understand | One blog post or 30min of a course |
| Mid-day Build | 2-3 hrs | Hands-on coding | Build the week's specific project piece |
| Evening Deep | 1-2 hrs | Experiment / debug | Fix issues, try variations, optimize |
| Night Review | 15-30min | Journal + plan tomorrow | What worked, what's next, 3 bullet points |
| Sunday | OFF/polish | Portfolio polish | README, deploy, blog post, LinkedIn |

---

## WEEK-BY-WEEK PRIORITY (First 12 weeks — the most critical)

| Week | Focus Area | Build This | Key Resource (ONE per week) |
|------|------------|------------|----------------------------|
| 1 | Python + async | CLI tool with async calls | Real Python async tutorial |
| 2 | FastAPI basics | Hello world API + Pydantic models | fastapi.tiangolo.com tutorial |
| 3 | LLM APIs (OpenAI/Anthr.) | Token counter + cost calculator | platform.openai.com/docs |
| 4 | Embeddings + ChromaDB | Text similarity search service | docs.trychroma.com |
| 5 | RAG basics | Q&A over PDF (LangChain + Chroma) | LangChain RAG tutorial |
| 6 | FastAPI + LLM streaming | Chat API with history + streaming | FastAPI streaming responses |
| 7 | LangChain LCEL | Chain pipeline with tools | academy.langchain.com |
| 8 | LangGraph StateGraph | Simple state machine (2 nodes) | langgraph quickstart |
| 9 | LangGraph multi-agent | Supervisor + 2 worker agents | langgraph multi-agent tutorial |
| 10 | MCP basics | MCP tool server + client | modelcontextprotocol.io |
| 11 | MCP + LangGraph | Agent with MCP tools | blog.langchain.dev (MCP integration) |
| 12 | Advanced RAG | HyDE + re-ranking pipeline | blog.llamaindex.ai (advanced RAG) |

---

## THE 5 PROJECTS THAT MATTER (Build these, not 500)

| # | Project | Tech Stack | Time | Job Value |
|---|---------|-----------|------|-----------|
| 1 | RAG Q&A Chatbot | FastAPI + ChromaDB + LLM | 2 wk | Shows you understand RAG |
| 2 | Multi-Agent Research Sys | LangGraph + MCP + Tools | 3 wk | Shows agent orchestration skill |
| 3 | Document Pipeline | OCR → Chunk → Embed → RAG | 2 wk | Enterprise data processing |
| 4 | AI API Gateway | FastAPI + Redis + Guardrails | 2 wk | Production deployment skill |
| 5 | Full Enterprise AI App | Spring AI + LangGraph + K8s | 3 wk | Your 15yr Java + AI = unique |

### Project #1 — RAG Q&A Chatbot (Full Code)

```python
# app.py — RAG Q&A Chatbot
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langchain_community.document_loaders import PyPDFLoader, TextLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain.chains import RetrievalQA
import tempfile, os

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

vectorstore = None
qa_chain = None

class Query(BaseModel):
    question: str

@app.post("/upload")
async def upload(file: UploadFile = File(...)):
    global vectorstore, qa_chain
    with tempfile.NamedTemporaryFile(delete=False, suffix=file.filename) as tmp:
        tmp.write(await file.read())
        tmp_path = tmp.name

    loader = PyPDFLoader(tmp_path) if file.filename.endswith(".pdf") else TextLoader(tmp_path)
    docs = loader.load()
    os.unlink(tmp_path)

    splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    chunks = splitter.split_documents(docs)
    vectorstore = Chroma.from_documents(chunks, OpenAIEmbeddings(), persist_directory="./db")
    qa_chain = RetrievalQA.from_chain_type(
        llm=ChatOpenAI(model="gpt-4o"),
        retriever=vectorstore.as_retriever(search_kwargs={"k": 3}),
    )
    return {"status": "ok", "chunks": len(chunks)}

@app.post("/ask")
async def ask(q: Query):
    if not qa_chain:
        return {"error": "Upload a document first"}
    result = qa_chain.invoke(q.question)
    return {"answer": result["result"]}
```

```python
# test_app.py — Tests
from fastapi.testclient import TestClient
from app import app

client = TestClient(app)

def test_upload_and_query():
    with open("test.pdf", "rb") as f:
        resp = client.post("/upload", files={"file": ("test.pdf", f, "application/pdf")})
    assert resp.status_code == 200
    assert resp.json()["chunks"] > 0

    resp = client.post("/ask", json={"question": "What is this about?"})
    assert resp.status_code == 200
    assert "answer" in resp.json()
```

### Project #2 — Multi-Agent Research System

```python
# multi_agent.py
from langgraph.graph import StateGraph, MessagesState, START, END
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, SystemMessage

model = ChatOpenAI(model="gpt-4o")

def researcher(state: MessagesState):
    response = model.invoke([
        SystemMessage(content="You are a research agent. Find relevant information."),
        *state["messages"]
    ])
    return {"messages": [response]}

def writer(state: MessagesState):
    response = model.invoke([
        SystemMessage(content="You are a writer. Summarize the research into a clear report."),
        *state["messages"]
    ])
    return {"messages": [response]}

def supervisor(state: MessagesState):
    last = state["messages"][-1].content.lower()
    if "research" in last or "find" in last:
        return "researcher"
    return "writer"

graph = StateGraph(MessagesState)
graph.add_node("researcher", researcher)
graph.add_node("writer", writer)
graph.add_conditional_edges(START, supervisor, {"researcher": "researcher", "writer": "writer"})
graph.add_edge("researcher", "writer")
graph.add_edge("writer", END)

app = graph.compile()
result = app.invoke({"messages": [HumanMessage(content="Research AI trends in Singapore 2026")]})
print(result["messages"][-1].content)
```

---

## BEST BLOGS TO FOLLOW (Don't follow more than these)

| Blog | Why | Frequency |
|------|-----|-----------|
| blog.langchain.dev | LangChain + LangGraph patterns | Weekly |
| blog.llamaindex.ai | RAG deep dives | Weekly |
| anthropic.com/engineering | Agents, MCP, best practices | Bi-weekly |
| lilianweng.github.io | LLM foundations, agent surveys | Monthly |
| huyenchip.com/blog | Production ML systems | Monthly |

---

## BEST PAPERS TO READ (No more than these 10)

| # | Paper | Why Read | Time |
|---|-------|----------|------|
| 1 | Attention Is All You Need | Foundation of all LLMs | 2 hrs |
| 2 | ReAct: Reasoning + Acting | Foundation of all agents | 1 hr |
| 3 | LLM Powered Autonomous Agents | Survey of agent architectures | 1 hr |
| 4 | Retrieval-Augmented Generation | Original RAG paper | 1 hr |
| 5 | LoRA: Low-Rank Adaptation | Fine-tuning foundation | 1 hr |
| 6 | PagedAttention (vLLM) | LLM serving efficiency | 1 hr |
| 7 | RAGAS: Automatic Evaluation | RAG quality measurement | 30 min |
| 8 | Building Effective Agents | Anthropic's agent patterns | 30 min |
| 9 | GraphRAG (Microsoft) | Advanced RAG with graphs | 1 hr |
| 10 | Constitutional AI | AI safety | 1 hr |

---

## YOUR UNIQUE EDGE (15yr Java + Singapore + AI)

| Factor | How To Leverage |
|--------|-----------------|
| 15yr Java/Spring | Bridge old enterprise systems with new AI — few can do this |
| Singapore market | Build projects solving banking/govt/healthcare AI problems |
| Enterprise delivery | You know production, compliance, stability — AI engineers lack this |
| Zero-cost learning | Ollama + ChromaDB + LangGraph OSS = no money needed |

---

## COMMON MISTAKES TO AVOID

| Mistake | Why It's Wrong | Do This Instead |
|---------|---------------|-----------------|
| 500 projects | No depth, no interview signal | 5 deep projects with README + tests |
| Chasing every new tool | You'll learn nothing deeply | Master LangGraph + RAG + FastAPI |
| Skipping deployment | 90% of learning is in production | Deploy every project (Railway free tier) |
| Not writing about your work | Nobody sees your skills | 1 blog post per project |
| Learning Quantum now | 0% job impact in next 5 years | Skip until Year 2 |
| Learning Robotics now | Niche, fewer jobs | Skip until Phase 3 |
| Comparing to others | Kills motivation | Compare only to yourself yesterday |

---

## TOOLS YOU ACTUALLY NEED (Not the full catalog — just these)

| Category | Tool | Why |
|----------|------|-----|
| Local LLM | Ollama + Qwen2.5-Coder:7b | Run locally, free, good enough |
| Vector DB | ChromaDB | Free, local, simple to learn |
| Orchestration | LangGraph (OSS) | Industry standard for agents |
| API Framework | FastAPI | Best Python AI API framework |
| LLM SDK | OpenAI + Anthropic SDKs | Industry standard APIs |
| Java Bridge | Spring AI | Leverage your Java expertise |
| Code Editor | VS Code + Cline | Free, powerful AI coding |
| Evals | Ragas | Free, RAG quality measurement |
| Monitoring | LangSmith (free tier) | 100K traces/month free |
| Container | Docker Desktop | Free for personal use |
| CI/CD | GitHub Actions | Free for public repos |

---

## YOUR 6-MONTH GOAL (Not 500 projects)

| Month | Goal | Deliverable |
|-------|------|-------------|
| 1 | FastAPI + RAG + VectorDB | 1 working RAG chatbot deployed |
| 2 | LangGraph + Multi-agent | 1 multi-agent system with MCP tools |
| 3 | Production hardening | Same projects with Docker + tests + CI/CD |
| 4 | Advanced RAG + Fine-tuning | Enterprise document pipeline |
| 5 | Spring AI + Java bridge | Hybrid Java+Python AI service |
| 6 | Portfolio + interview prep | 5 GitHub repos + 5 blog posts + resume |

---

## FINAL NOTE — THE TRUTH

**AI will NOT eliminate all software jobs in 2 years**
- It will shift what engineers do
- The people who BUILD and OPERATE AI are irreplaceable
- Your 15 years of Java enterprise delivery is an ASSET, not a liability

**You don't need 500 projects**
- You need 5 DEEP, WELL-DOCUMENTED, DEPLOYED projects
- Each project should demonstrate production thinking
- Tests, error handling, logging, security, CI/CD

**You don't need Quantum or Robotics**
- Not for the next 3-5 years
- Master LangGraph + RAG + FastAPI + MCP + Evals
- That's 80% of all AI engineering jobs

**Your Singapore context is valuable**
- Banking, government, healthcare all need AI integration
- They need someone who understands enterprise systems AND AI
- That person is you

**Consistency > Intensity**
- 4 hours daily > 12 hours on weekends
- Sleep 7 hours, exercise, don't burn out
- This is a marathon, not a sprint

**The only competition is yourself**
- Don't compare to tech influencers
- Compare to yourself 6 months ago
- Keep building. Keep shipping.

---

> **YOUR ONLY COMPETITION IS ENGINEERS WHO STOP LEARNING. KEEP BUILDING.**
> **Singapore needs AI engineers who can bridge old systems with new AI.**
> **That's you.**
