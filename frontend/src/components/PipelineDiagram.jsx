import React, { useState, useId } from 'react'
import CodeBlock from './CodeBlock'

const NODE_DETAILS = {
  'rag-pipeline': {
    q: { concept: 'The entry point where user questions are captured with full traceability.', code: 'query_id = str(uuid.uuid4())[:8]\nuser_id = session.user_id\nraw_text = "What is RAG?"\n# Log with timestamp for auditability', projectIdea: 'Build a query logging system with session tracking and audit trail.' },
    p: { concept: 'Raw queries are rarely optimal for search. Processing includes rewriting, decomposing, and HyDE.', code: 'rewritten = llm.generate(f"Rewrite for search: {raw}")\nsub_queries = json.loads(llm.generate(f"Break into 2-4 sub-questions: {query}"))\nhyde_doc = llm.generate(f"Write a paragraph answering: {query}")', projectIdea: 'Implement query rewriting, decomposition, and HyDE. Measure recall improvement.' },
    e: { concept: 'Converting text to dense vector representations capturing semantic meaning.', code: 'from sentence_transformers import SentenceTransformer\nmodel = SentenceTransformer("BAAI/bge-large-en-v1.5")\nembedding = model.encode("What is RAG?")\nprint(f"Dimensions: {len(embedding)}")  # 1024', projectIdea: 'Compare 3+ embedding models on your domain data.' },
    s: { concept: 'Hybrid combines dense vector + sparse BM25 via Reciprocal Rank Fusion (RRF).', code: 'def rrf_fusion(vec_results, bm25_results, k=60):\n    scores = {}\n    for rank, doc in enumerate(vec_results):\n        scores[doc["id"]] = scores.get(doc["id"], 0) + 1 / (k + rank + 1)\n    for rank, doc in enumerate(bm25_results):\n        scores[doc["id"]] = scores.get(doc["id"], 0) + 1 / (k + rank + 1)\n    return sorted(scores, key=scores.get, reverse=True)', projectIdea: 'Implement hybrid search with RRF and benchmark against pure vector search.' },
    v: { concept: 'K = 20-50, not 5. Recall first, precision later. Must support multi-tenancy and HNSW.', code: 'from qdrant_client import QdrantClient\nclient = QdrantClient(url="http://localhost:6333")\nresults = client.search(\n    collection_name="documents",\n    query_vector=query_embedding,\n    limit=20\n)', projectIdea: 'Deploy Qdrant with multi-tenant filtering and benchmark search performance.' },
    r: { concept: 'Cross-encoder rerankers score query+chunk jointly. Single highest-ROI step.', code: 'from sentence_transformers import CrossEncoder\nreranker = CrossEncoder("BAAI/bge-reranker-v2-m3")\npairs = [(query, doc) for doc in candidates]\nscores = reranker.predict(pairs)\nranked = sorted(zip(candidates, scores), key=lambda x: -x[1])', projectIdea: 'Add cross-encoder reranking and measure recall improvement.' },
    c: { concept: 'Deduplicate, order by relevance, trim to token budget, attach citations.', code: 'class BuiltContext:\n    chunks: list\n    total_tokens: int = 0\n    max_tokens: int = 4096\n    def add(self, chunk):\n        tokens = len(chunk.text) // 4\n        if self.total_tokens + tokens > self.max_tokens:\n            return False\n        self.chunks.append(chunk)\n        self.total_tokens += tokens\n        return True', projectIdea: 'Build a token-aware context assembly system with citation tracking.' },
    g: { concept: 'The LLM answers using ONLY the assembled context. Low temperature, source citation.', code: 'SYSTEM_PROMPT = "Answer ONLY from provided context. Cite sources."\nresponse = client.chat.completions.create(\n    model="gpt-4o",\n    messages=[\n        {"role": "system", "content": SYSTEM_PROMPT},\n        {"role": "user", "content": f"Context: {ctx}\\nQ: {query}"}\n    ],\n    temperature=0.1\n)', projectIdea: 'Implement grounded generation with source citation enforcement.' },
    ch: { concept: 'Every claim must be traceable to a source chunk. Hallucination detection.', code: 'def check_grounding(response, chunks):\n    claims = re.split(r"(?<=[.!?])\\s+", response)\n    results = []\n    for claim in claims:\n        best_score = 0\n        for chunk in chunks:\n            overlap = len(set(claim.lower().split()) & set(chunk.lower().split())) / max(len(claim.split()), 1)\n            best_score = max(best_score, overlap)\n        results.append({"claim": claim, "grounded": best_score >= 0.7})\n    return results', projectIdea: 'Build a grounding checker that verifies every claim against source documents.' },
  },
  'react-agent': {
    task: { concept: 'The initial input or objective given to the agent.', code: 'task = "Research the latest AI trends and create a summary report"', projectIdea: 'Design a task interface that supports complex multi-part requests.' },
    think: { concept: 'LLM analyzes current state and decides what tool to use next.', code: 'def think(state):\n    response = llm.invoke(state["messages"])\n    if response.tool_calls:\n        return "act"\n    return "done"', projectIdea: 'Implement a think step with explicit reasoning logging.' },
    act: { concept: 'Executing the chosen tool or API call via structured JSON.', code: 'def execute_tool(tool_name, tool_args):\n    tools = {"search": search_web, "code": run_code, "save": save_file}\n    tool = tools.get(tool_name)\n    if tool:\n        return tool.invoke(tool_args)\n    return f"Unknown tool: {tool_name}"', projectIdea: 'Build a tool registry with automatic schema generation.' },
    obs: { concept: 'Processing the tool output fed back to the LLM for the next step.', code: 'def observe(tool_result, state):\n    state["messages"].append({\n        "role": "tool",\n        "content": str(tool_result),\n        "tool_call_id": state["last_tool_call_id"]\n    })\n    return state', projectIdea: 'Add observation parsing that extracts structured data from tool outputs.' },
    done: { concept: 'Final answer or retry decision based on task completion.', code: 'def should_continue(state):\n    last_msg = state["messages"][-1]\n    if hasattr(last_msg, "tool_calls") and last_msg.tool_calls:\n        return "act"\n    return "done"', projectIdea: 'Implement a task completion evaluator for the agent.' },
  },
  'llm-ecosystem': {
    cloud: { concept: 'Direct API access to frontier models from OpenAI, Anthropic, Google.', code: 'from openai import OpenAI\nclient = OpenAI()\nresponse = client.chat.completions.create(\n    model="gpt-4o",\n    messages=[{"role": "user", "content": "Hello"}]\n)', projectIdea: 'Build a cost comparison tool across cloud LLM providers.' },
    enterprise: { concept: 'Enterprise-grade: Azure OpenAI, AWS Bedrock, Google Vertex AI.', code: 'from openai import AzureOpenAI\nclient = AzureOpenAI(\n    api_key="your-key",\n    api_version="2024-02-15-preview",\n    azure_endpoint="https://your-resource.openai.azure.com/"\n)', projectIdea: 'Set up Azure OpenAI with managed identity for compliance.' },
    open: { concept: 'Open-weight models: Llama, Mistral, Gemma, Qwen, Phi.', code: 'ollama pull llama3.1:8b\nollama run llama3.1:8b\n# Or via HuggingFace\nfrom transformers import AutoModelForCausalLM\nmodel = AutoModelForCausalLM.from_pretrained(\n    "meta-llama/Llama-3.1-8B",\n    torch_dtype="auto", device_map="auto"\n)', projectIdea: 'Fine-tune an open-weight model using LoRA/QLoRA and deploy locally.' },
    local: { concept: 'Run LLMs on your own hardware. Ollama, vLLM, llama.cpp.', code: '# Ollama\nollama pull llama3.2\nollama run llama3.2\n\n# vLLM production serving\nvllm serve meta-llama/Llama-3.1-8B \\\n    --tensor-parallel-size 1 \\\n    --port 8000', projectIdea: 'Set up a local LLM server with Ollama and Open WebUI.' },
    fine: { concept: 'LoRA/QLoRA for parameter-efficient fine-tuning, DPO for alignment.', code: 'from peft import LoraConfig, get_peft_model\nlora_config = LoraConfig(\n    r=16, lora_alpha=32,\n    target_modules=["q_proj", "v_proj", "k_proj", "o_proj"],\n    lora_dropout=0.05,\n    task_type="CAUSAL_LM"\n)\nmodel = get_peft_model(base_model, lora_config)', projectIdea: 'Fine-tune a small model on 1000+ domain-specific Q&A pairs.' },
    app: { concept: 'Applications built on top: RAG, agents, chatbots, code assistants.', code: '# Full-stack RAG application\n# Backend: FastAPI + LangChain\n# Vector DB: Qdrant\n# Frontend: React with SSE streaming\n# Deployment: Docker + Kubernetes', projectIdea: 'Build an end-to-end AI application with RAG, agents, and React frontend.' },
  },
  'system-design': {
    api: { concept: 'API Gateway handles rate limiting, authentication, request routing.', code: 'from fastapi import FastAPI, Request\nfrom slowapi import Limiter\n\napp = FastAPI()\nlimiter = Limiter(key_func=get_remote_address)\n\n@app.post("/api/chat")\n@limiter.limit("10/minute")\nasync def chat(request: Request):\n    user = await authenticate(request)\n    query = await request.json()\n    log_audit(user, query)\n    return await process_query(query)', projectIdea: 'Build an API gateway with rate limiting, JWT auth, and audit logging.' },
    msg: { concept: 'Message queues decouple AI processing from request handling.', code: 'def handle_ai_request(message):\n    result = rag_pipeline(message["query"])\n    pubsub.publish(f"results/{message[\'request_id\']}", result)\n\npubsub.subscribe("ai-requests", handle_ai_request)', projectIdea: 'Implement an async AI pipeline using Solace or Kafka.' },
    rag: { concept: 'The core RAG pipeline with all 9 steps.', code: 'class ProductionRAG:\n    async def query(self, user_query):\n        rewritten = await self.rewrite(user_query)\n        candidates = await self.hybrid_search(rewritten, k=30)\n        reranked = await self.rerank(user_query, candidates, top_k=5)\n        answer = await self.generate(user_query, reranked)\n        grounding = self.check_grounding(answer, reranked)\n        return {"answer": answer, "sources": reranked, "grounding": grounding}', projectIdea: 'Deploy the full production RAG pipeline with monitoring at each stage.' },
    db: { concept: 'PostgreSQL for structured data + Qdrant for vector search.', code: 'CREATE TABLE documents (\n    id SERIAL PRIMARY KEY,\n    title TEXT, content TEXT,\n    tenant_id TEXT, created_at TIMESTAMP\n);', projectIdea: 'Design a dual-database architecture with PostgreSQL and Qdrant.' },
    obs: { concept: 'Prometheus metrics, Grafana dashboards, LangFuse tracing.', code: 'from prometheus_client import Counter, Histogram\nREQUESTS = Counter("ai_requests_total", "Total requests", ["endpoint", "status"])\nLATENCY = Histogram("ai_latency_seconds", "Request latency", ["endpoint"])', projectIdea: 'Set up the full observability stack with Prometheus and Grafana.' },
    sec: { concept: 'Defense in depth: WAF, Guardrails, PII masking.', code: 'class SecurityMiddleware:\n    async def process(self, request):\n        if self.waf.block(request):\n            return {"error": "Blocked by WAF"}\n        safe, text = self.guardrails.check_input(request.body)\n        if not safe:\n            return {"error": "Input blocked"}\n        result = await ai_process(text)\n        safe, result = self.guardrails.check_output(result)\n        return result', projectIdea: 'Implement multi-layer security middleware with WAF and guardrails.' },
  },
  'vector-db-compare': {
    q: { concept: 'Choose vector DB based on requirements.', code: '# Decision criteria:\n# Scale: < 100K docs -> ChromaDB, > 1M -> Qdrant/Milvus\n# Ops: No ops -> Pinecone, Full control -> Qdrant\n# Features: Hybrid search -> Qdrant, Graph -> Weaviate', projectIdea: 'Create a decision matrix for vector DB selection.' },
    self: { concept: 'Self-hosted: Qdrant, Milvus, Weaviate.', code: '# docker-compose.yml\nservices:\n  qdrant:\n    image: qdrant/qdrant:latest\n    ports: ["6333:6333", "6334:6334"]\n    volumes: ["./qdrant_data:/qdrant/storage"]', projectIdea: 'Deploy Qdrant with Docker Compose including persistent storage.' },
    managed: { concept: 'Managed: Pinecone, Zilliz Cloud.', code: 'from pinecone import Pinecone\npc = Pinecone(api_key="your-key")\npc.create_index(\n    name="docs", dimension=1536, metric="cosine",\n    spec={"serverless": {"cloud": "aws", "region": "us-east-1"}}\n)\nindex = pc.Index("docs")', projectIdea: 'Compare Pinecone free tier vs self-hosted Qdrant.' },
    pg: { concept: 'pgvector adds vector search to existing PostgreSQL.', code: 'CREATE EXTENSION vector;\nCREATE TABLE docs (\n    id SERIAL PRIMARY KEY,\n    content TEXT,\n    embedding vector(1536)\n);\nCREATE INDEX ON docs USING hnsw (embedding vector_cosine_ops);', projectIdea: 'Add semantic search to an existing PostgreSQL application.' },
    embed: { concept: 'Embedded databases: ChromaDB, LanceDB.', code: 'import chromadb\nclient = chromadb.PersistentClient(path="./my_db")\ncollection = client.get_or_create_collection("docs")\ncollection.add(documents=["Hello world"], ids=["doc1"])\nresults = collection.query(query_texts=["greeting"], n_results=1)', projectIdea: 'Build a local knowledge base app using ChromaDB.' },
    scale: { concept: 'Milvus for billion-scale vectors with GPU acceleration.', code: 'from pymilvus import connections, Collection\nconnections.connect("default", host="localhost", port="19530")\ncollection = Collection("billion_docs")\nresults = collection.search(\n    data=[query_embedding],\n    anns_field="embedding",\n    param={"metric_type": "COSINE", "params": {"ef": 128}},\n    limit=10\n)', projectIdea: 'Benchmark Milvus at 10M+ vectors.' },
  },
  'prompt-patterns': {
    inp: { concept: 'Raw user input that needs validation and rewriting.', code: 'user_input = "What is our Q3 revenue?"\n# Raw input needs processing for optimal retrieval', projectIdea: 'Build an input classifier for user queries.' },
    guard: { concept: 'Input guardrails scan for injection, jailbreak, PII.', code: 'class PromptGuard:\n    def check(self, text):\n        if re.search(r"ignore.*instructions", text, re.I):\n            return False, "Injection detected"\n        text = re.sub(r"\\b\\w+@\\w+\\.\\w+\\b", "[EMAIL]", text)\n        return True, text', projectIdea: 'Implement a comprehensive prompt guard.' },
    cot: { concept: 'Chain-of-Thought forces step-by-step reasoning.', code: 'prompt = """Solve this step by step:\n\nQuestion: A store has 240 apples.\nThey sell 1/3 in the morning.\nHow many left?\n\nStep 1:"""', projectIdea: 'Build a CoT prompt library.' },
    few: { concept: 'Few-Shot Examples provide 2-5 examples before the query.', code: 'prompt = """Examples:\nInput: "What is AI?" -> Category: Technology\nInput: "How to cook?" -> Category: Cooking\n\nNow classify:\nInput: "What is quantum?" -> Category:"""', projectIdea: 'Create a few-shot example generator.' },
    struct: { concept: 'Structured Output forces specific JSON schema.', code: 'response = client.chat.completions.create(\n    model="gpt-4o",\n    messages=[{"role": "user", "content": "Extract entities"}],\n    response_format={"type": "json_schema", "json_schema": {...}}\n)', projectIdea: 'Build a structured extraction pipeline.' },
    sys: { concept: 'System Prompt defines role, constraints, safety rules.', code: 'SYSTEM_PROMPT = """You are a financial analyst AI.\nRULES:\n1. Only use provided context\n2. Cite sources\n3. Never provide investment advice"""', projectIdea: 'Design a system prompt template library.' },
    out: { concept: 'Output guardrails filter harmful content and re-check PII.', code: 'class OutputGuard:\n    def filter(self, response, sources):\n        response = re.sub(r"\\b\\d{3}[-.]?\\d{3}[-.]?\\d{4}\\b", "[PHONE]", response)\n        if any(bad in response.lower() for bad in HARMFUL_KEYWORDS):\n            return "I cannot provide that information."\n        return response', projectIdea: 'Build an output guardrail with PII filtering and grounding verification.' },
  },
  'observability-pipeline': {
    app: { concept: 'The AI application being monitored with tracing hooks.', code: '@observe\ndef rag_app(query):\n    docs = retrieve(query)\n    answer = generate(query, docs)\n    return answer', projectIdea: 'Instrument an AI app with tracing hooks at every step.' },
    trace: { concept: 'Distributed tracing captures the full request lifecycle.', code: 'from langfuse import observe\n\n@observe(as_type="generation")\ndef trace_rag(query):\n    docs = retrieve(query)\n    answer = generate(query, docs)\n    return answer', projectIdea: 'Set up LangFuse tracing with per-query cost tracking.' },
    eval: { concept: 'Automated evaluation using RAGAS, DeepEval.', code: 'from ragas import evaluate\nfrom ragas.metrics import faithfulness, answer_relevancy\nresult = evaluate(eval_dataset, metrics=[faithfulness, answer_relevancy])\nprint(result)  # faithfulness: 0.95, relevancy: 0.88', projectIdea: 'Set up automated RAGAS evaluation in CI/CD.' },
    metrics: { concept: 'Time-series metrics in Prometheus, dashboards in Grafana.', code: '# Grafana panels:\n# 1. Request Rate by endpoint\n# 2. Latency p50/p95/p99\n# 3. Error rate by type\n# 4. Token usage by model\n# 5. RAG accuracy trend\n# 6. Cost per query', projectIdea: 'Create a Grafana dashboard for AI system metrics.' },
    alerts: { concept: 'Automated alerts when metrics breach thresholds.', code: 'groups:\n  - name: ai-alerts\n    rules:\n      - alert: HighErrorRate\n        expr: rate(ai_errors_total[5m]) > 0.05\n        for: 5m\n      - alert: LatencySpike\n        expr: histogram_quantile(0.95, ai_latency_seconds) > 2.0', projectIdea: 'Configure alerting rules with PagerDuty integration.' },
    cicd: { concept: 'CI/CD with evaluation gates before deployment.', code: 'name: AI CI/CD\non: [push]\njobs:\n  eval:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - run: python run_eval.py\n      - name: Quality Gate\n        run: python -c "assert d[\'faithfulness\'] > 0.85"', projectIdea: 'Set up CI/CD with automated evaluation gates.' },
    loop: { concept: 'Human feedback loop for continuous improvement.', code: 'from fastapi import FastAPI\napp = FastAPI()\n\n@app.post("/feedback")\nasync def feedback(query_id: str, rating: int, comment: str):\n    db.insert("feedback", {"query_id": query_id, "rating": rating, "comment": comment})', projectIdea: 'Build a feedback collection system.' },
  },
  'fine-tuning-workflow': {
    data: { concept: 'Dataset preparation is the most impactful step.', code: 'data = [\n    {"messages": [\n        {"role": "system", "content": "You are a helpful assistant."},\n        {"role": "user", "content": "Summarize this document."},\n        {"role": "assistant", "content": "The document discusses..."}\n    ]}\n]', projectIdea: 'Prepare a fine-tuning dataset of 1000+ Q&A pairs.' },
    base: { concept: 'Choose right base model. Quantize to 4-bit for efficient training.', code: 'from transformers import AutoModelForCausalLM, BitsAndBytesConfig\nbnb_config = BitsAndBytesConfig(\n    load_in_4bit=True,\n    bnb_4bit_quant_type="nf4",\n    bnb_4bit_compute_dtype="float16"\n)\nmodel = AutoModelForCausalLM.from_pretrained(\n    "meta-llama/Llama-3.1-8B",\n    quantization_config=bnb_config, device_map="auto"\n)', projectIdea: 'Load a base model with 4-bit quantization and measure VRAM usage.' },
    lora: { concept: 'LoRA trains only 1-5% of parameters. Rank=16, alpha=32.', code: 'from peft import LoraConfig, get_peft_model\nlora_config = LoraConfig(\n    r=16, lora_alpha=32,\n    target_modules=["q_proj", "v_proj", "k_proj", "o_proj"],\n    lora_dropout=0.05, task_type="CAUSAL_LM"\n)\nmodel = get_peft_model(base_model, lora_config)\nmodel.print_trainable_parameters()', projectIdea: 'Configure LoRA with different rank values and measure impact.' },
    train: { concept: 'SFT then DPO then Evaluation. Each phase improves different aspects.', code: 'from trl import SFTTrainer, DPOTrainer\nsft_trainer = SFTTrainer(\n    model=model, train_dataset=train_data,\n    max_seq_length=2048, packing=True,\n    args=TrainingArguments(output_dir="./sft_output", num_train_epochs=3)\n)\nsft_trainer.train()', projectIdea: 'Run SFT then DPO training pipeline and compare quality at each stage.' },
    merge: { concept: 'Merge LoRA adapters with base model. Export to GGUF for Ollama.', code: 'from peft import PeftModel\nmerged = PeftModel.from_pretrained(base_model, "./lora_output")\nmerged = merged.merge_and_unload()\nmerged.save_pretrained("./merged_model")', projectIdea: 'Merge a fine-tuned LoRA adapter and deploy with Ollama.' },
    eval: { concept: 'Compare fine-tuned model against base on eval set.', code: 'base_results = evaluate(base_model, test_set)\nfine_tuned_results = evaluate(fine_tuned_model, test_set)\nprint(f"Base accuracy: {base_results[\'accuracy\']:.2%}")\nprint(f"Fine-tuned accuracy: {fine_tuned_results[\'accuracy\']:.2%}")', projectIdea: 'Build an evaluation suite comparing base vs fine-tuned model.' },
  },
  'grc-compliance': {
    regs: { concept: '500+ GRC frameworks across 50+ countries.', code: 'REGULATIONS = {\n    "EU": ["GDPR", "EU AI Act", "Digital Services Act"],\n    "US": ["CCPA", "HIPAA", "SOC2", "NIST AI RMF"],\n    "SG": ["PDPA", "IM8", "MAS TRM"],\n    "Global": ["ISO 42001", "ISO 27001"]\n}', projectIdea: 'Create a regulatory compliance matrix for your AI system.' },
    risk: { concept: 'DPIA and AI risk classification mandatory for high-risk systems.', code: 'class DPIA:\n    def assess(self):\n        return {\n            "system": self.system,\n            "risk_level": "high",\n            "risks": [\n                {"risk": "Data leakage", "likelihood": "medium", "impact": "high"},\n                {"risk": "Bias", "likelihood": "high", "impact": "high"}\n            ]\n        }', projectIdea: 'Build a DPIA template and automated risk assessment tool.' },
    data: { concept: 'PII masking, data retention, data residency requirements.', code: 'class DataGovernance:\n    def mask_pii(self, data):\n        for field in self.pii_fields:\n            if field in data:\n                data[field] = f"[REDACTED_{field.upper()}]"\n        return data\n    def check_residency(self, storage_region):\n        return storage_region in self.allowed_regions', projectIdea: 'Implement data governance with PII masking and residency checks.' },
    audit: { concept: 'Full chain-of-custody logged with timestamps.', code: 'class AuditLogger:\n    def log(self, event_type, data):\n        entry = {\n            "timestamp": datetime.now().isoformat(),\n            "event": event_type,\n            "hash": hashlib.sha256(json.dumps(data).encode()).hexdigest()\n        }\n        self.store.append(entry)\n        return entry', projectIdea: 'Build an audit trail system with tamper-evident logging.' },
    ai: { concept: 'Grounding check, bias testing, explainability.', code: 'class AICompliance:\n    def check_grounding(self, response, sources):\n        claims = extract_claims(response)\n        for claim in claims:\n            for source in sources:\n                if semantic_similarity(claim, source) > 0.7:\n                    return {"claim": claim, "verified": True}\n        return {"claim": claim, "verified": False}', projectIdea: 'Implement grounding verification, bias testing, and explainability.' },
    mon: { concept: 'Continuous monitoring for drift and compliance violations.', code: 'class ComplianceMonitor:\n    def check_daily(self):\n        accuracy = self.get_accuracy_trend()\n        if accuracy[-1] < accuracy[-7] - 0.05:\n            self.alerts.append("Accuracy drift detected")\n        pii_events = self.get_pii_events(period="24h")\n        if pii_events > 0:\n            self.alerts.append(f"PII leakage: {pii_events} events")\n        return self.alerts', projectIdea: 'Set up compliance monitoring with automated alerts.' },
    report: { concept: 'Automated compliance reports for auditors.', code: 'class ComplianceReporter:\n    def generate_report(self, period):\n        return {\n            "period": period,\n            "compliance_rate": self.get_compliance_rate(period),\n            "audit_trail": self.get_audit_trail(period),\n            "risk_assessment": self.get_risk_assessment()\n        }', projectIdea: 'Build an automated compliance report generator.' },
  },
  'career-roadmap': {
    m1: { concept: 'Foundation: Python, FastAPI, LLM APIs, basic RAG.', code: 'from fastapi import FastAPI\nfrom langchain_openai import ChatOpenAI\nfrom langchain.chains import RetrievalQA\n\napp = FastAPI()\n\n@app.post("/chat")\nasync def chat(query: str):\n    chain = RetrievalQA.from_chain_type(\n        llm=ChatOpenAI(model="gpt-4o"),\n        retriever=vectorstore.as_retriever()\n    )\n    return chain.invoke({"query": query})', projectIdea: 'Build and deploy a RAG chatbot with FastAPI and Qdrant.' },
    m2: { concept: 'Agents and production: LangGraph, MCP, hybrid search.', code: 'from langgraph.graph import StateGraph, END\ngraph = StateGraph(AgentState)\ngraph.add_node("planner", plan_task)\ngraph.add_node("researcher", research_topic)\ngraph.add_node("writer", write_report)\ngraph.add_edge("planner", "researcher")\ngraph.add_edge("researcher", "writer")', projectIdea: 'Build a multi-agent research system with LangGraph.' },
    m3: { concept: 'Production: Docker, CI/CD, evals, vLLM, monitoring.', code: 'FROM python:3.11-slim\nWORKDIR /app\nCOPY requirements.txt .\nRUN pip install -r requirements.txt\nCOPY . .\nEXPOSE 8000\nCMD ["uvicorn", "main:app", "--host", "0.0.0.0"]', projectIdea: 'Set up CI/CD with Docker and automated RAG evaluation.' },
    m4: { concept: 'Domain specialization, compliance, Kubernetes, portfolio.', code: '# Specialization features:\n# 1. Multi-tenant with namespace isolation\n# 2. PII detection and masking\n# 3. Full audit trail\n# 4. Grounding verification\n# 5. Rate limiting\n# 6. RAGAS evaluation\n# 7. Grafana monitoring\n# 8. Kubernetes deployment', projectIdea: 'Build a compliance-first RAG system for a specific domain.' },
    m5: { concept: 'Senior: multi-agent architectures, lead decisions, mentor.', code: '# Architecture decision:\n# Monolith: < 10K queries/day\n# Multi-Agent: > 10K queries/day\n# - Separate agents per domain\n# - Independent scaling\n# - Domain isolation', projectIdea: 'Lead the design of a multi-agent system.' },
    m6: { concept: 'Expert: publish research, speak at conferences, consult.', code: '# Expert contributions:\n# 1. Research: Novel architectures\n# 2. Open Source: Maintain frameworks\n# 3. Speaking: Conference presentations\n# 4. Consulting: Enterprise AI strategy\n# 5. Leadership: CTO/VP Engineering', projectIdea: 'Publish a research paper and present at a conference.' },
  },
}

const DIAGRAMS = {
  'rag-pipeline': {
    icon: '\uD83D\uDD27',
    title: '9-Step RAG Production Pipeline',
    nodes: [
      { id: 'q', x: 50, y: 20, label: 'Query Capture', desc: 'User query with traceability', color: '#f5c2e7' },
      { id: 'p', x: 50, y: 100, label: 'Query Process', desc: 'Rewrite + Decompose + HyDE', color: '#cba6f7' },
      { id: 'e', x: 50, y: 180, label: 'Embedding', desc: 'Dense vector representation', color: '#89b4fa' },
      { id: 's', x: 50, y: 260, label: 'Hybrid Search', desc: 'Vector + BM25 + RRF Fusion', color: '#a6e3a1' },
      { id: 'v', x: 50, y: 340, label: 'Vector DB', desc: 'K=20-50, recall first', color: '#94e2d5' },
      { id: 'r', x: 50, y: 420, label: 'Reranker', desc: 'Cross-encoder scoring', color: '#f9e2af' },
      { id: 'c', x: 50, y: 500, label: 'Context Assembly', desc: 'Dedup + order + audit trail', color: '#fab387' },
      { id: 'g', x: 50, y: 580, label: 'Generation', desc: 'Grounded answer with citations', color: '#f38ba8' },
      { id: 'ch', x: 50, y: 660, label: 'Grounding Check', desc: 'Claim verification vs sources', color: '#b4befe' },
    ],
    width: 580,
    height: 700,
  },
  'react-agent': {
    icon: '\uD83D\uDD04',
    title: 'ReAct Agent Loop (Reason + Act)',
    nodes: [
      { id: 'task', x: 200, y: 20, label: 'Task Input', color: '#f5c2e7' },
      { id: 'think', x: 200, y: 110, label: 'Think (Reason)', desc: 'LLM decides next action', color: '#cba6f7' },
      { id: 'act', x: 200, y: 220, label: 'Act (Execute)', desc: 'Call tool / API', color: '#89b4fa' },
      { id: 'obs', x: 200, y: 330, label: 'Observe', desc: 'Get tool result', color: '#a6e3a1' },
      { id: 'done', x: 200, y: 440, label: 'Answer / Retry', desc: 'Final answer or loop back', color: '#f38ba8' },
    ],
    width: 500,
    height: 500,
  },
  'llm-ecosystem': {
    icon: '\uD83E\uDDE0',
    title: 'LLM Model Ecosystem',
    nodes: [
      { id: 'cloud', x: 100, y: 30, label: 'Cloud APIs', desc: 'OpenAI, Anthropic, Google', color: '#89b4fa' },
      { id: 'enterprise', x: 300, y: 30, label: 'Enterprise Cloud', desc: 'Azure, Bedrock, Vertex', color: '#cba6f7' },
      { id: 'open', x: 500, y: 30, label: 'Open Weights', desc: 'Llama, Mistral, Gemma', color: '#a6e3a1' },
      { id: 'local', x: 200, y: 150, label: 'Local Runners', desc: 'Ollama, vLLM, llama.cpp', color: '#f9e2af' },
      { id: 'fine', x: 400, y: 150, label: 'Fine-Tuning', desc: 'LoRA, DPO, RLHF', color: '#f38ba8' },
      { id: 'app', x: 300, y: 270, label: 'AI Applications', desc: 'RAG, Agents, Chatbots', color: '#94e2d5' },
    ],
    edges: [
      { from: 'cloud', to: 'app' },
      { from: 'enterprise', to: 'app' },
      { from: 'open', to: 'local' },
      { from: 'open', to: 'fine' },
      { from: 'local', to: 'app' },
      { from: 'fine', to: 'app' },
    ],
    width: 600,
    height: 320,
  },
  'system-design': {
    icon: '\uD83C\uDFD7\uFE0F',
    title: 'Enterprise AI Integration Blueprint',
    nodes: [
      { id: 'api', x: 30, y: 30, label: 'API Gateway', desc: 'Rate limiting, auth, routing', color: '#f5c2e7' },
      { id: 'msg', x: 220, y: 30, label: 'Message Queue', desc: 'Solace / Kafka / IBM MQ', color: '#cba6f7' },
      { id: 'rag', x: 410, y: 30, label: 'RAG Pipeline', desc: 'Vector + BM25 + LLM', color: '#89b4fa' },
      { id: 'db', x: 30, y: 170, label: 'Data Layer', desc: 'PostgreSQL + Qdrant', color: '#a6e3a1' },
      { id: 'obs', x: 220, y: 170, label: 'Observability', desc: 'Prometheus + Grafana', color: '#f9e2af' },
      { id: 'sec', x: 410, y: 170, label: 'Security', desc: 'WAF + Guardrails', color: '#f38ba8' },
    ],
    width: 600,
    height: 310,
  },
  'vector-db-compare': {
    icon: '\uD83D\uDDC4\uFE0F',
    title: 'Vector Database Decision Tree',
    nodes: [
      { id: 'q', x: 300, y: 15, label: 'Choose Vector DB', desc: 'Based on requirements', color: '#f5c2e7' },
      { id: 'self', x: 100, y: 110, label: 'Self-Hosted', desc: 'Qdrant, Milvus, Weaviate', color: '#a6e3a1' },
      { id: 'managed', x: 500, y: 110, label: 'Managed', desc: 'Pinecone, Zilliz Cloud', color: '#89b4fa' },
      { id: 'pg', x: 100, y: 210, label: 'Postgres Native', desc: 'pgvector', color: '#f9e2af' },
      { id: 'embed', x: 300, y: 210, label: 'Embedded', desc: 'ChromaDB, LanceDB', color: '#cba6f7' },
      { id: 'scale', x: 500, y: 210, label: 'Large Scale', desc: 'Milvus billion-vector', color: '#f38ba8' },
    ],
    edges: [
      { from: 'q', to: 'self' },
      { from: 'q', to: 'managed' },
      { from: 'self', to: 'pg' },
      { from: 'self', to: 'embed' },
      { from: 'self', to: 'scale' },
    ],
    width: 600,
    height: 270,
  },
  'prompt-patterns': {
    icon: '\u26A1',
    title: 'Prompt Engineering Pattern Flow',
    nodes: [
      { id: 'inp', x: 300, y: 20, label: 'User Input', color: '#f5c2e7' },
      { id: 'guard', x: 300, y: 100, label: 'Input Guardrails', desc: 'Injection, PII masking', color: '#f38ba8' },
      { id: 'cot', x: 80, y: 200, label: 'Chain-of-Thought', desc: 'Step-by-step reasoning', color: '#89b4fa' },
      { id: 'few', x: 300, y: 200, label: 'Few-Shot Examples', desc: '2-5 examples', color: '#a6e3a1' },
      { id: 'struct', x: 520, y: 200, label: 'Structured Output', desc: 'JSON mode', color: '#cba6f7' },
      { id: 'sys', x: 300, y: 310, label: 'System Prompt', desc: 'Role, constraints', color: '#f9e2af' },
      { id: 'out', x: 300, y: 400, label: 'Output Guardrails', desc: 'Content filter', color: '#f38ba8' },
    ],
    edges: [
      { from: 'inp', to: 'guard' },
      { from: 'guard', to: 'cot' },
      { from: 'guard', to: 'few' },
      { from: 'guard', to: 'struct' },
      { from: 'cot', to: 'sys' },
      { from: 'few', to: 'sys' },
      { from: 'struct', to: 'sys' },
      { from: 'sys', to: 'out' },
    ],
    width: 620,
    height: 450,
  },
  'observability-pipeline': {
    icon: '\uD83D\uDCCA',
    title: 'MLOps Observability Pipeline',
    nodes: [
      { id: 'app', x: 70, y: 30, label: 'AI App', desc: 'RAG / Agent / Chatbot', color: '#f5c2e7' },
      { id: 'trace', x: 240, y: 30, label: 'Tracing', desc: 'LangFuse / OpenTelemetry', color: '#89b4fa' },
      { id: 'eval', x: 420, y: 30, label: 'Evaluation', desc: 'RAGAS / DeepEval', color: '#a6e3a1' },
      { id: 'metrics', x: 240, y: 140, label: 'Metrics Store', desc: 'Prometheus + Grafana', color: '#cba6f7' },
      { id: 'alerts', x: 420, y: 140, label: 'Alerts', desc: 'Drift, quality drops', color: '#f38ba8' },
      { id: 'cicd', x: 240, y: 250, label: 'CI/CD Pipeline', desc: 'Eval gates', color: '#f9e2af' },
      { id: 'loop', x: 70, y: 250, label: 'Feedback Loop', desc: 'Human ratings', color: '#94e2d5' },
    ],
    edges: [
      { from: 'app', to: 'trace' },
      { from: 'trace', to: 'eval' },
      { from: 'trace', to: 'metrics' },
      { from: 'eval', to: 'metrics' },
      { from: 'metrics', to: 'alerts' },
      { from: 'eval', to: 'cicd' },
      { from: 'app', to: 'loop' },
      { from: 'loop', to: 'cicd' },
    ],
    width: 580,
    height: 310,
  },
  'fine-tuning-workflow': {
    icon: '\uD83C\uDFAF',
    title: 'Fine-Tuning Workflow',
    nodes: [
      { id: 'data', x: 150, y: 20, label: 'Dataset Prep', desc: 'Format, clean, split', color: '#f5c2e7' },
      { id: 'base', x: 400, y: 20, label: 'Base Model', desc: 'Llama, Mistral (4-bit)', color: '#89b4fa' },
      { id: 'lora', x: 150, y: 130, label: 'LoRA Config', desc: 'r=16, alpha=32', color: '#a6e3a1' },
      { id: 'train', x: 400, y: 130, label: 'Training', desc: 'SFT then DPO', color: '#cba6f7' },
      { id: 'merge', x: 275, y: 240, label: 'Merge and Export', desc: 'GGUF, Ollama, vLLM', color: '#f9e2af' },
      { id: 'eval', x: 275, y: 340, label: 'Evaluation', desc: 'Benchmark vs base', color: '#f38ba8' },
    ],
    edges: [
      { from: 'data', to: 'lora' },
      { from: 'base', to: 'lora' },
      { from: 'lora', to: 'train' },
      { from: 'train', to: 'merge' },
      { from: 'merge', to: 'eval' },
    ],
    width: 550,
    height: 400,
  },
  'grc-compliance': {
    icon: '\uD83D\uDEE1\uFE0F',
    title: 'GRC Compliance Framework',
    nodes: [
      { id: 'regs', x: 150, y: 20, label: 'Regulations', desc: 'GDPR, PDPA, EU AI Act', color: '#f5c2e7' },
      { id: 'risk', x: 400, y: 20, label: 'Risk Assessment', desc: 'DPIA, risk classification', color: '#cba6f7' },
      { id: 'data', x: 70, y: 140, label: 'Data Governance', desc: 'PII masking, retention', color: '#89b4fa' },
      { id: 'audit', x: 280, y: 140, label: 'Audit Trail', desc: 'All queries logged', color: '#a6e3a1' },
      { id: 'ai', x: 490, y: 140, label: 'AI-Specific', desc: 'Grounding, bias', color: '#f9e2af' },
      { id: 'mon', x: 180, y: 260, label: 'Monitoring', desc: 'Drift, violations', color: '#f38ba8' },
      { id: 'report', x: 380, y: 260, label: 'Reporting', desc: 'Compliance reports', color: '#94e2d5' },
    ],
    edges: [
      { from: 'regs', to: 'data' },
      { from: 'regs', to: 'audit' },
      { from: 'regs', to: 'ai' },
      { from: 'risk', to: 'data' },
      { from: 'risk', to: 'ai' },
      { from: 'data', to: 'mon' },
      { from: 'audit', to: 'mon' },
      { from: 'ai', to: 'mon' },
      { from: 'mon', to: 'report' },
    ],
    width: 580,
    height: 320,
  },
  'career-roadmap': {
    icon: '\uD83D\uDCBC',
    title: '12-Month AI Engineer Career Roadmap',
    nodes: [
      { id: 'm1', x: 75, y: 20, label: 'Month 1-3', desc: 'Python, FastAPI, RAG basics', color: '#a6e3a1' },
      { id: 'm2', x: 225, y: 100, label: 'Month 4-6', desc: 'LangGraph, Agents, MCP', color: '#89b4fa' },
      { id: 'm3', x: 375, y: 180, label: 'Month 7-9', desc: 'Docker, CI/CD, Evals', color: '#cba6f7' },
      { id: 'm4', x: 525, y: 260, label: 'Month 10-12', desc: 'Domain spec, K8s, Portfolio', color: '#f38ba8' },
      { id: 'goal', x: 300, y: 350, label: 'Production AI Engineer', desc: 'Ready for senior roles', color: '#f5c2e7' },
    ],
    edges: [
      { from: 'm1', to: 'm2' },
      { from: 'm2', to: 'm3' },
      { from: 'm3', to: 'm4' },
      { from: 'm4', to: 'goal' },
    ],
    width: 600,
    height: 410,
  },
}

function Arrow({ x1, y1, x2, y2, color = '#45475a', arrowId }) {
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="2" markerEnd={`url(#${arrowId})`} />
    </g>
  )
}

function NodeBox({ node, onClick, isActive }) {
  return (
    <g
      className="pipeline-node"
      onClick={() => onClick && onClick(node)}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <rect
        x={node.x - 100}
        y={node.y - 26}
        width="200"
        height="52"
        rx="10"
        fill={isActive ? node.color + '30' : '#181825'}
        stroke={isActive ? node.color : '#45475a'}
        strokeWidth={isActive ? '2.5' : '1.5'}
        style={{ transition: 'all 0.2s' }}
      />
      <text
        x={node.x}
        y={node.y - 2}
        textAnchor="middle"
        fill={node.color}
        fontSize="14"
        fontWeight="700"
      >
        {node.label}
      </text>
      {node.desc && (
        <text
          x={node.x}
          y={node.y + 18}
          textAnchor="middle"
          fill="#a6adc8"
          fontSize="12"
        >
          {node.desc}
        </text>
      )}
    </g>
  )
}

export default function PipelineDiagram({ diagramKey: externalKey = 'rag-pipeline', compact = false, onDiagramChange }) {
  const arrowId = `pipeline-arrow-${useId().replace(/:/g, '')}`
  const [internalKey, setInternalKey] = useState(externalKey)
  const [activeNode, setActiveNode] = useState(null)

  const diagramKey = onDiagramChange ? externalKey : internalKey

  const handleTabClick = (key) => {
    setActiveNode(null)
    if (onDiagramChange) {
      onDiagramChange(key)
    } else {
      setInternalKey(key)
    }
  }
  const diagram = DIAGRAMS[diagramKey] || DIAGRAMS['rag-pipeline']
  const edges = diagram.edges || []
  const nodeMap = {}
  diagram.nodes.forEach(n => { nodeMap[n.id] = n })

  return (
    <div className="pipeline-diagram-wrapper">
      <div className="pipeline-diagram-header">
        <h4>{diagram.title}</h4>
        <div className="pipeline-tabs">
          {Object.keys(DIAGRAMS).map(key => (
            <button
              key={key}
              className={`pipeline-tab ${diagramKey === key ? 'active' : ''}`}
              onClick={() => handleTabClick(key)}
              title={DIAGRAMS[key].title}
            >
              {DIAGRAMS[key].icon || '\uD83D\uDCC8'}
            </button>
          ))}
        </div>
      </div>

      {activeNode && (() => {
        const details = NODE_DETAILS[diagramKey]?.[activeNode.id]
        return (
          <div className="pipeline-node-detail" style={{ borderColor: activeNode.color }}>
            <strong style={{ color: activeNode.color }}>{activeNode.label}</strong>
            {activeNode.desc && <span> — {activeNode.desc}</span>}
            {details?.concept && (
              <p style={{ marginTop: 8, color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.6 }}>{details.concept}</p>
            )}
            {details?.code && (
              <div style={{ marginTop: 10 }}>
                <CodeBlock code={details.code} label="Example Code" />
              </div>
            )}
            {details?.projectIdea && (
              <div style={{ marginTop: 10, padding: '8px 12px', background: 'rgba(249,226,175,0.06)', borderLeft: '3px solid var(--accent-yellow)', borderRadius: '0 6px 6px 0' }}>
                <strong style={{ color: 'var(--accent-yellow)', fontSize: 12 }}>Project Idea: </strong>
                <span style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{details.projectIdea}</span>
              </div>
            )}
          </div>
        )
      })()}

      <div className="pipeline-svg-container">
        <svg
          viewBox={`0 0 ${diagram.width} ${diagram.height}`}
          width="100%"
          style={{ maxHeight: compact ? '400px' : Math.min(diagram.height, 500) + 'px' }}
        >
          <defs>
            <marker id={arrowId} markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="#45475a" />
            </marker>
          </defs>

          {edges.map((edge, i) => {
            const from = nodeMap[edge.from]
            const to = nodeMap[edge.to]
            if (!from || !to) return null
            const active = activeNode && (activeNode.id === edge.from || activeNode.id === edge.to)
            return (
              <Arrow
                key={i}
                x1={from.x} y1={from.y + 26}
                x2={to.x} y2={to.y - 26}
                color={active ? '#89b4fa' : '#45475a'}
                arrowId={arrowId}
              />
            )
          })}

          {!edges.length && diagram.nodes.length > 1 && diagram.nodes.map((node, i) => {
            if (i === 0) return null
            const prev = diagram.nodes[i - 1]
            const active = activeNode && (activeNode.id === node.id || activeNode.id === prev.id)
            return (
              <Arrow
                key={`seq-${i}`}
                x1={prev.x} y1={prev.y + 22}
                x2={node.x} y2={node.y - 22}
                color={active ? '#89b4fa' : '#45475a'}
                arrowId={arrowId}
              />
            )
          })}

          {diagramKey === 'react-agent' && (
            <>
              <path d="M 120 66 Q 50 200 120 374" fill="none" stroke="#45475a" strokeWidth="2" strokeDasharray="6,3" markerEnd={`url(#${arrowId})`} />
              <text x="55" y="220" fill="#585b70" fontSize="10" textAnchor="end">Retry</text>
            </>
          )}

          {diagram.nodes.map(node => (
            <NodeBox
              key={node.id}
              node={node}
              isActive={activeNode && activeNode.id === node.id}
              onClick={setActiveNode}
            />
          ))}
        </svg>
      </div>
    </div>
  )
}

export { DIAGRAMS }
