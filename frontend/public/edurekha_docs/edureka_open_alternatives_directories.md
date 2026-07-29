# Comprehensive Guide to 17+ Open-Source Alternatives & Directories for AI Tools

> A curated directory of the best open-source alternatives across every AI/ML category — from chatbots to MLOps, vector databases to fine-tuning frameworks.

---

## Table of Contents

1. [Open-Source ChatGPT Alternatives](#1-open-source-chatgpt-alternatives)
2. [Open-Source LLM Platforms](#2-open-source-llm-platforms)
3. [Open-Source Vector Databases](#3-open-source-vector-databases)
4. [Open-Source Model Serving](#4-open-source-model-serving)
5. [Open-Source Agent Frameworks](#5-open-source-agent-frameworks)
6. [Open-Source Fine-Tuning](#6-open-source-fine-tuning)
7. [Open-Source RAG](#7-open-source-rag)
8. [Open-Source Speech](#8-open-source-speech)
9. [Open-Source Image Generation](#9-open-source-image-generation)
10. [Open-Source Monitoring & Observability](#10-open-source-monitoring--observability)
11. [Open-Source Guardrails](#11-open-source-guardrails)
12. [Open-Source Evaluation](#12-open-source-evaluation)
13. [Open-Source Embeddings](#13-open-source-embeddings)
14. [Open-Source Data Labeling](#14-open-source-data-labeling)
15. [Open-Source Notebooks](#15-open-source-notebooks)
16. [Open-Source MLOps](#16-open-source-mlops)
17. [Open-Source AI IDEs](#17-open-source-ai-ides)

---

## 1. Open-Source ChatGPT Alternatives

### 1.1 LibreChat

| | |
|---|---|
| **URL** | https://github.com/danny-avila/LibreChat |
| **Stars** | 18k+ |
| **License** | MIT |
| **Language** | TypeScript/Node.js |
| **Description** | Enhanced ChatGPT clone with multi-model support, plugins, auth, and multi-user capabilities |

**Key Features:**
- Multi-user authentication with role-based access control
- Supports OpenAI, Azure, Google Gemini, Anthropic, and local models
- Plugin system for web browsing, image generation, and more
- Conversation branching and file upload support
- Docker and cloud deployment ready

**Installation:**

```bash
git clone https://github.com/danny-avila/LibreChat.git
cd LibreChat
cp .env.example .env
# Edit .env with your API keys
docker compose up -d
```

**Python Integration Example:**

```python
import requests

# Connect to your self-hosted LibreChat instance
LIBRECHAT_URL = "http://localhost:3080"

# Send a message via the API
payload = {
    "message": "Explain quantum computing in simple terms",
    "model": "gpt-4",
    "conversationId": None
}

response = requests.post(
    f"{LIBRECHAT_URL}/api/ask",
    json=payload,
    headers={"Authorization": "Bearer YOUR_JWT_TOKEN"}
)

print(response.json()["response"])
```

**Use-Case:** Teams needing a self-hosted ChatGPT alternative with enterprise auth, audit logging, and multi-model support.

**Comparison vs Proprietary:**

| Feature | LibreChat | ChatGPT Plus |
|---|---|---|
| Self-hosted | ✅ | ❌ |
| Multi-model | ✅ (any provider) | ❌ (GPT only) |
| Multi-user auth | ✅ | ❌ |
| Plugins/Browse | ✅ | ✅ |
| File uploads | ✅ | ✅ |
| Data stays on-prem | ✅ | ❌ |
| Cost | Free + API costs | $20/month |
| Custom themes | ✅ | ❌ |

---

### 1.2 Open WebUI

| | |
|---|---|
| **URL** | https://github.com/open-webui/open-webui |
| **Stars** | 35k+ |
| **License** | BSD-3-Clause |
| **Language** | Python/Svelte |
| **Description** | Feature-rich ChatGPT interface for Ollama and OpenAI-compatible APIs |

**Key Features:**
- First-class Ollama integration — one-click local model management
- RAG built in: drag-drop documents for context-aware chat
- Web search integration for grounded answers
- Multi-user with admin dashboard
- Voice input support (Whisper)

**Installation:**

```bash
# With Ollama (recommended)
docker run -d -p 3000:8080 \
  --add-host=host.docker.internal:host-gateway \
  -v open-webui:/app/backend/data \
  --name open-webui \
  ghcr.io/open-webui/open-webui:main

# Via pip
pip install open-webui
open-webui serve
```

**Python Integration Example:**

```python
from open_webui.apps.webui.models.users import Users

# Programmatic access to Open WebUI backend
import requests

resp = requests.post("http://localhost:3000/api/auths/signin", json={
    "email": "admin@example.com",
    "password": "your-password"
})
token = resp.json()["token"]

# Generate a chat completion through Open WebUI's proxy
chat_resp = requests.post("http://localhost:3000/api/chat/completions", 
    headers={"Authorization": f"Bearer {token}"},
    json={
        "model": "llama3",
        "messages": [{"role": "user", "content": "Hello!"}]
    }
)
print(chat_resp.json()["choices"][0]["message"]["content"])
```

**Use-Case:** Power users wanting a polished web UI for locally-running Ollama models with RAG and user management.

**Comparison vs Proprietary:**

| Feature | Open WebUI | ChatGPT Web |
|---|---|---|
| Local models (Ollama) | ✅ | ❌ |
| Self-hosted | ✅ | ❌ |
| Built-in RAG | ✅ | ✅ |
| Web search | ✅ | ✅ |
| User management | ✅ | ❌ |
| Cost | Free | $20/month |
| Offline mode | ✅ | ❌ |

---

### 1.3 LobeChat

| | |
|---|---|
| **URL** | https://github.com/lobehub/lobe-chat |
| **Stars** | 45k+ |
| **License** | MIT |
| **Language** | TypeScript/Next.js |
| **Description** | Modern, extensible chat UI framework with plugin marketplace and multi-model support |

**Key Features:**
- Stunning UI with dark/light themes and responsive design
- Plugin/extension marketplace (TTS, image gen, search, code)
- Multi-model: OpenAI, Anthropic, Google, local via Ollama
- Agent marketplace — share and download custom assistants
- Progressive Web App (PWA) support

**Installation:**

```bash
# Docker (easiest)
docker run -d -p 3210:3210 \
  -e OPENAI_API_KEY=sk-xxx \
  -v lobe-data:/data \
  lobehub/lobe-chat

# Or use Vercel one-click deploy
# https://vercel.com/new/clone?repository-url=https://github.com/lobehub/lobe-chat
```

**Python Integration Example:**

```python
import requests

# LobeChat exposes an OpenAI-compatible API when self-hosted
LOBECHAT_URL = "http://localhost:3210"

response = requests.post(f"{LOBECHAT_URL}/v1/chat/completions", json={
    "model": "gpt-4",
    "messages": [
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Write a haiku about code"}
    ],
    "temperature": 0.7
})

print(response.json()["choices"][0]["message"]["content"])
```

**Use-Case:** Developers wanting a beautiful, customizable chat interface with plugin ecosystem and agent sharing.

**Comparison vs Proprietary:**

| Feature | LobeChat | ChatGPT Plus |
|---|---|---|
| Self-hosted | ✅ | ❌ |
| Plugin marketplace | ✅ (open) | ✅ (closed) |
| Agent sharing | ✅ | ✅ (GPTs) |
| Multi-model | ✅ | ❌ |
| PWA | ✅ | ❌ |
| Cost | Free | $20/month |

---

### 1.4 ChatGPT-Next-Web

| | |
|---|---|
| **URL** | https://github.com/ChatGPTNextWeb/ChatGPT-Next-Web |
| **Stars** | 75k+ |
| **License** | MIT |
| **Language** | TypeScript/React |
| **Description** | One-click deploy ChatGPT web interface to Vercel with multi-model and proxy support |

**Key Features:**
- One-click Vercel deployment
- Proxy support for restricted regions
- Image generation (DALL-E, Midjourney-style)
- Markdown rendering with syntax highlighting
- Multi-language support (50+)

**Installation:**

```bash
# Docker
docker pull yidadaa/chatgpt-next-web
docker run -d -p 3000:3000 \
  -e OPENAI_API_KEY=sk-xxx \
  -e CODE=your-access-password \
  yidadaa/chatgpt-next-web

# Local dev
git clone https://github.com/ChatGPTNextWeb/ChatGPT-Next-Web.git
cd ChatGPT-Next-Web
npm install && npm run dev
```

**Python Integration Example:**

```python
import requests

# ChatGPT-Next-Web uses standard OpenAI API format
NEXTWEB_URL = "http://localhost:3000"

response = requests.post(f"{NEXTWEB_URL}/api/openai/v1/chat/completions", 
    headers={"Authorization": "Bearer your-access-password"},
    json={
        "model": "gpt-4",
        "messages": [{"role": "user", "content": "Explain Rust ownership"}],
        "stream": False
    }
)
print(response.json()["choices"][0]["message"]["content"])
```

**Use-Case:** Quick personal ChatGPT frontend deployable to Vercel in minutes with no backend needed.

---

### 1.5 AnyType

| | |
|---|---|
| **URL** | https://github.com/anyproto/anytype-ts |
| **Stars** | 22k+ |
| **License** | MIT |
| **Language** | TypeScript |
| **Description** | Privacy-first, local-first knowledge management with built-in AI chat capabilities |

**Key Features:**
- End-to-end encrypted, local-first data storage
- Graph-based knowledge management with AI assistant
- P2P sync without central server
- Objects, relations, and types system
- Cross-platform (desktop, mobile, self-hosted server)

**Installation:**

```bash
# Desktop app
# Download from https://anytype.io

# Self-hosted server
docker pull anyproto/anytype-headless
docker run -d -p 4747:4747 \
  -v anytype-data:/data \
  anyproto/anytype-headless
```

**Use-Case:** Privacy-conscious users wanting ChatGPT-like AI assistance integrated into a personal knowledge management system.

**Comparison vs Proprietary:**

| Feature | AnyType | Notion AI |
|---|---|---|
| Self-hosted | ✅ | ❌ |
| E2E encrypted | ✅ | ❌ |
| Local-first | ✅ | ❌ |
| AI chat built-in | ✅ | ✅ |
| P2P sync | ✅ | ❌ |
| Free forever | ✅ | $10/month + AI add-on |

---

## 2. Open-Source LLM Platforms

### 2.1 Dify

| | |
|---|---|
| **URL** | https://github.com/langgenius/dify |
| **Stars** | 50k+ |
| **License** | Open-source (custom with commercial use restrictions for SaaS) |
| **Language** | Python/TypeScript |
| **Description** | Full-stack LLM app development platform with RAG, agents, workflow orchestration, and monitoring |

**Key Features:**
- Visual drag-and-drop workflow builder
- Built-in RAG pipeline with document upload
- Agent capabilities with tool calling
- Multi-model support (OpenAI, Anthropic, local, etc.)
- Prompt management and versioning
- Team collaboration and role-based access

**Installation:**

```bash
git clone https://github.com/langgenius/dify.git
cd dify/docker
cp .env.example .env
docker compose up -d
# Access at http://localhost/install
```

**Python Integration Example:**

```python
from dify_client import DifyClient

client = DifyClient(api_key="your-api-key", base_url="http://localhost/v1")

# Chat completion
response = client.chat(
    query="Summarize the latest research on transformers",
    user="user-123",
    inputs={},
    response_mode="blocking",
    conversation_id=""
)
print(response["answer"])

# RAG completion with knowledge base
response = client.completion(
    query="What are the key findings?",
    user="user-123",
    inputs={"knowledge_base_id": "kb-xxx"},
    response_mode="blocking"
)

# Workflow execution
response = client.workflow_inputs(
    inputs={"topic": "AI safety"},
    response_mode="blocking"
)
print(response["data"]["outputs"])
```

**Use-Case:** Teams building production LLM applications without deep ML expertise — visual workflow building with enterprise features.

**Comparison vs Proprietary:**

| Feature | Dify | LangChain Cloud |
|---|---|---|
| Self-hosted | ✅ | ❌ |
| Visual workflow | ✅ | ❌ |
| Built-in RAG | ✅ | ❌ (use plugins) |
| Cost | Free (self-hosted) | Pay per usage |
| Multi-user | ✅ | Limited |
| Prompt versioning | ✅ | ❌ |

---

### 2.2 Flowise

| | |
|---|---|
| **URL** | https://github.com/FlowiseAI/Flowise |
| **Stars** | 28k+ |
| **License** | Apache 2.0 |
| **Language** | TypeScript |
| **Description** | Drag-and-drop UI to build LLM flows, chains, and agents using LangChain components |

**Key Features:**
- Visual node-based flow builder
- Full LangChain integration under the hood
- API endpoint auto-generation for any flow
- Chatflow and Agentflow (agentic) support
- Embeddable chat widget

**Installation:**

```bash
npm install -g flowise
npx flowise start
# Access at http://localhost:3000

# Docker
docker run -d -p 3000:3000 \
  -e FLOWISE_USERNAME=user \
  -e FLOWISE_PASSWORD=pass123 \
  flowiseai/flowise
```

**Python Integration Example:**

```python
import requests

FLOWISE_URL = "http://localhost:3000"

# Call a chatflow via its API endpoint
response = requests.post(
    f"{FLOWISE_URL}/api/v1/prediction/your-chatflow-id",
    json={
        "question": "Explain the difference between RAG and fine-tuning",
        "overrideConfig": {
            "temperature": 0.7
        }
    }
)
print(response.json()["text"])

# Streaming response
response = requests.post(
    f"{FLOWISE_URL}/api/v1/prediction/your-chatflow-id",
    json={"question": "Tell me a joke"},
    stream=True
)
for line in response.iter_lines():
    if line:
        data = line.decode("utf-8")
        print(data)
```

**Use-Case:** Rapid prototyping of LLM applications by visually connecting LangChain components without writing code.

---

### 2.3 Langflow

| | |
|---|---|
| **URL** | https://github.com/langflow-ai/langflow |
| **Stars** | 30k+ |
| **License** | MIT |
| **Language** | Python |
| **Description** | Visual framework for building multi-agent and RAG applications with LangChain |

**Key Features:**
- Component-based visual builder for LangChain
- Built-in playground for testing flows
- API auto-generation for deployed flows
- Custom component creation
- Session-based conversation memory
- Multi-agent support

**Installation:**

```bash
pip install langflow
langflow run
# Access at http://localhost:7860

# Docker
docker run -d -p 7860:7860 \
  -v langflow-data:/app/data \
  langflowai/langflow:latest
```

**Python Integration Example:**

```python
from langflow.loaders import load_flow

# Load a flow and run it
flow = load_flow("./my_flow.json")
result = flow.run("What are the benefits of microservices?")
print(result)

# API integration
import requests

response = requests.post(
    "http://localhost:7860/api/v1/run/your-flow-id",
    json={
        "input_value": "Explain event-driven architecture",
        "input_type": "chat",
        "output_type": "chat"
    }
)
print(response.json()["outputs"][0]["outputs"][0]["message"])
```

**Use-Case:** Data scientists and engineers building complex multi-step LLM pipelines visually.

---

### 2.4 Promptflow

| | |
|---|---|
| **URL** | https://github.com/microsoft/promptflow |
| **Stars** | 8k+ |
| **License** | MIT |
| **Language** | Python |
| **Description** | Microsoft's tool for building, evaluating, and deploying LLM applications with quality assurance |

**Key Features:**
- DAG-based flow definition (YAML + Python)
- Built-in evaluation metrics (relevance, coherence, etc.)
- Azure AI integration for deployment
- Test coverage for LLM outputs
- Flow as code — version control friendly

**Installation:**

```bash
pip install promptflow promptflow-tools

# Initialize a new project
pf flow init --flow ./my_flow

# Test a flow
pf flow test --flow ./my_flow --inputs question="What is AI?"

# Evaluate
pf run create --flow ./eval_flow --data ./eval_data.jsonl --name eval_run_1
```

**Python Integration Example:**

```python
from promptflow import PFClient

pf = PFClient()

# Create and test a flow
result = pf.test(
    flow="./my_chatbot_flow",
    inputs={"question": "How do transformers work?"}
)
print(result["answer"])

# Batch evaluation
run = pf.run(
    flow="./eval_flow",
    data="./test_data.jsonl",
    column_mapping={
        "question": "${data.question}",
        "answer": "${data.answer}",
        "context": "${data.context}"
    }
)
print(f"Run status: {run.status}")
print(f"Metrics: {run.metrics}")
```

**Use-Case:** Teams needing structured quality assurance and evaluation for LLM applications in enterprise/Azure environments.

---

### 2.5 Chainlit

| | |
|---|---|
| **URL** | https://github.com/Chainlit/chainlit |
| **Stars** | 7k+ |
| **License** | Apache 2.0 |
| **Language** | Python |
| **Description** | Build conversational AI interfaces for LangChain, LlamaIndex, and custom agents |

**Key Features:**
- Python-first with decorators for message handling
- Native LangChain and LlamaIndex integration
- Multi-modal support (text, images, files)
- Built-in authentication and user session management
- Step-by-step trace visualization
- Task/feedback tracking

**Installation:**

```bash
pip install chainlit
chainlit hello  # Test installation

# Create a new app
chainlit init
# Edit app.py, then:
chainlit run app.py
```

**Python Integration Example:**

```python
import chainlit as cl
from langchain.chat_models import ChatOpenAI
from langchain.chains import LLMChain
from langchain.prompts import ChatPromptTemplate

@cl.on_message
async def on_message(message: cl.Message):
    llm = ChatOpenAI(model="gpt-4")
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are a helpful assistant."),
        ("human", "{input}")
    ])
    chain = LLMChain(llm=llm, prompt=prompt)
    
    # Stream response with step tracking
    async with cl.Step(name="Thinking..."):
        response = await chain.ainvoke({"input": message.content})
    
    await cl.Message(content=response["text"]).send()

@cl.on_chat_start
async def on_start():
    await cl.Message(content="Welcome! How can I help you?").send()
```

**Use-Case:** Developers building polished chat interfaces for LangChain/LlamaIndex apps with built-in observability.

**Comparison vs Proprietary:**

| Feature | Chainlit | OpenAI Assistants API |
|---|---|---|
| Self-hosted | ✅ | ❌ |
| LangChain native | ✅ | ❌ |
| Multi-modal | ✅ | ✅ |
| Step traces | ✅ | ❌ |
| Cost | Free | Pay per token |
| Custom UI | ✅ | Limited |

---

## 3. Open-Source Vector Databases

### 3.1 Chroma

| | |
|---|---|
| **URL** | https://github.com/chroma-core/chroma |
| **Stars** | 15k+ |
| **License** | Apache 2.0 |
| **Language** | Python/Rust |
| **Description** | Embedding database designed for AI applications — easy, fast, and batteries-included |

**Key Features:**
- Simple API: `add`, `query`, `get`, `delete`
- Built-in embedding functions (OpenAI, Sentence Transformers)
- Automatic persistence and indexing
- Multi-tenancy support
- Client-server and in-process modes
- LangChain and LlamaIndex integrations

**Installation:**

```bash
pip install chromadb

# Or run as server
docker run -d -p 8000:8000 chromadb/chroma
```

**Python Example:**

```python
import chromadb

# In-memory
client = chromadb.Client()
# Or persistent
# client = chromadb.PersistentClient(path="./chroma_db")
# Or client-server
# client = chromadb.HttpClient(host="localhost", port=8000)

collection = client.create_collection(
    name="documents",
    metadata={"hnsw:space": "cosine"}
)

# Add documents
collection.add(
    documents=[
        "RAG combines retrieval with generation for better answers",
        "Fine-tuning adapts a model to your specific domain",
        "Vector databases enable semantic search over embeddings"
    ],
    metadatas=[
        {"source": "blog", "topic": "rag"},
        {"source": "paper", "topic": "fine-tuning"},
        {"source": "docs", "topic": "vectors"}
    ],
    ids=["doc1", "doc2", "doc3"]
)

# Query
results = collection.query(
    query_texts=["How to improve LLM accuracy?"],
    n_results=2
)
print(results["documents"])
print(results["distances"])
print(results["metadatas"])
```

**Use-Case:** Developers needing a lightweight, easy-to-integrate vector store for RAG and semantic search.

**Comparison vs Proprietary:**

| Feature | Chroma | Pinecone |
|---|---|---|
| Self-hosted | ✅ | ❌ (managed) |
| Free tier | Unlimited (self-hosted) | 1M vectors |
| Easy setup | `pip install` | API key needed |
| Filtering | ✅ | ✅ |
| Scaling | Manual | Auto |
| Managed option | ✅ (Cloud beta) | ✅ |

---

### 3.2 Qdrant

| | |
|---|---|
| **URL** | https://github.com/qdrant/qdrant |
| **Stars** | 19k+ |
| **License** | Apache 2.0 |
| **Language** | Rust |
| **Description** | High-performance vector search engine with rich filtering and payload support |

**Key Features:**
- Rust-powered: blazing fast performance
- Advanced payload filtering (nested objects, ranges, Geo)
- Distributed deployment with sharding and replication
- Quantization for memory efficiency (scalar, product, binary)
- gRPC and REST APIs
- Snapshots for backup

**Installation:**

```bash
# Docker (recommended)
docker run -d -p 6333:6333 -p 6334:6334 \
  -v qdrant_data:/qdrant/storage \
  qdrant/qdrant

# pip
pip install qdrant-client
```

**Python Example:**

```python
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct, Filter, FieldCondition, MatchValue

client = QdrantClient("localhost", port=6333)

# Create collection
client.create_collection(
    collection_name="articles",
    vectors_config=VectorParams(size=1536, distance=Distance.COSINE)
)

# Insert points with payload
client.upsert(
    collection_name="articles",
    points=[
        PointStruct(
            id=1,
            vector=[0.1] * 1536,
            payload={"title": "Introduction to RAG", "category": "tutorial", "year": 2024}
        ),
        PointStruct(
            id=2,
            vector=[0.2] * 1536,
            payload={"title": "Advanced Fine-Tuning", "category": "paper", "year": 2025}
        )
    ]
)

# Search with filtering
results = client.query_points(
    collection_name="articles",
    query=[0.1] * 1536,
    query_filter=Filter(
        must=[
            FieldCondition(key="category", match=MatchValue(value="tutorial"))
        ]
    ),
    limit=5
)
print(results.points)
```

**Use-Case:** Production workloads needing high-performance vector search with advanced filtering and distributed architecture.

---

### 3.3 Weaviate

| | |
|---|---|
| **URL** | https://github.com/weaviate/weaviate |
| **Stars** | 11k+ |
| **License** | BSD-3-Clause |
| **Language** | Go |
| **Description** | AI-native vector database with built-in hybrid search, generative modules, and multi-modal support |

**Key Features:**
- Hybrid search (vector + keyword BM25)
- Built-in vectorization modules (OpenAI, Cohere, HuggingFace)
- Multi-tenancy and multi-tenancy isolation
- Generative search (search + generate in one query)
- GraphQL API
- Horizontal scaling with replication

**Installation:**

```bash
# Docker
docker run -d -p 8080:8080 -p 50051:50051 \
  -e AUTHENTICATION_ANONYMOUS_ACCESS_ENABLED=true \
  -e PERSISTENCE_DATA_PATH=/var/lib/weaviate \
  cr.weaviate.io/semitechnologies/weaviate:1.25.0

# pip
pip install weaviate-client
```

**Python Example:**

```python
import weaviate
from weaviate.classes.config import Configure, Property, DataType

client = weaviate.connect_to_local()

# Create collection with auto-vectorization
client.collections.create(
    name="Article",
    vectorizer_config=Configure.Vectorizer.text2vec_openai(),
    generative_config=Configure.Generative.openai(),
    properties=[
        Property(name="title", data_type=DataType.TEXT),
        Property(name="content", data_type=DataType.TEXT),
        Property(name="year", data_type=DataType.INT)
    ]
)

articles = client.collections.get("Article")

# Insert (auto-vectorized)
articles.data.insert({"title": "RAG Guide", "content": "RAG combines retrieval...", "year": 2025})

# Generative search — search + LLM generation in one call
results = articles.generate.near_text(
    query="How does RAG work?",
    limit=3,
    grouped_task="Summarize the retrieved documents into a cohesive answer"
)
for obj in results.objects:
    print(obj.properties["title"])
    print(obj.generated)  # LLM-generated summary
```

**Use-Case:** Applications needing hybrid search, auto-vectorization, and generative capabilities without external orchestration.

---

### 3.4 Milvus

| | |
|---|---|
| **URL** | https://github.com/milvus-io/milvus |
| **Stars** | 29k+ |
| **License** | Apache 2.0 |
| **Language** | Go/C++ |
| **Description** | Cloud-native vector database built for billion-scale similarity search |

**Key Features:**
- Billion-vector scale with distributed architecture
- Multiple index types (IVF, HNSW, DiskANN, GPU)
- Scalar filtering alongside vector search
- Multi-vector search and hybrid search
- GPU acceleration
- Kubernetes-native deployment (Milvus Operator)

**Installation:**

```bash
# Docker (standalone)
docker run -d -p 19530:19530 -p 9091:9091 \
  -v milvus_data:/var/lib/milvus \
  milvusdb/milvus:latest

# pip (uses embedded Milvus)
pip install "pymilvus[model]"
```

**Python Example:**

```python
from pymilvus import MilvusClient, DataType, FieldSchema, CollectionSchema

client = MilvusClient("http://localhost:19530")

# Define schema
schema = CollectionSchema(fields=[
    FieldSchema(name="id", dtype=DataType.INT64, is_primary=True, auto_id=True),
    FieldSchema(name="title", dtype=DataType.VARCHAR, max_length=256),
    FieldSchema(name="embedding", dtype=DataType.FLOAT_VECTOR, dim=1536)
])

# Create collection
client.create_collection(
    collection_name="documents",
    schema=schema,
    index_params=[{
        "field_name": "embedding",
        "index_type": "HNSW",
        "metric_type": "COSINE",
        "params": {"M": 16, "efConstruction": 256}
    }]
)

# Insert data
client.insert(collection_name="documents", data=[
    {"title": "AI Safety Research", "embedding": [0.1] * 1536},
    {"title": "LLM Benchmarks", "embedding": [0.2] * 1536}
])

# Search
results = client.search(
    collection_name="documents",
    data=[[0.1] * 1536],
    limit=5,
    output_fields=["title"]
)
for hit in results[0]:
    print(f"{hit['entity']['title']}: {hit['distance']}")
```

**Use-Case:** Large-scale production systems needing billion-vector search with GPU acceleration and distributed deployment.

---

### 3.5 LanceDB

| | |
|---|---|
| **URL** | https://github.com/lancedb/lancedb |
| **Stars** | 10k+ |
| **License** | Apache 2.0 |
| **Language** | Rust |
| **Description** | Serverless vector database built on Lance columnar format — zero-copy, disk-based |

**Key Features:**
- Serverless: no separate server process needed
- Zero-copy reads with Lance columnar format
- Multi-modal: vectors + structured data in one table
- Automatic versioning and time-travel queries
- In-process or client-server mode
- PyArrow integration

**Installation:**

```bash
pip install lancedb pyarrow
```

**Python Example:**

```python
import lancedb
import pyarrow as pa

db = lancedb.connect("~/.lancedb")

# Create table
table = db.create_table(
    "my_documents",
    data=[
        {"id": 1, "text": "RAG improves LLM accuracy", "vector": [0.1] * 128},
        {"id": 2, "text": "Fine-tuning for domain adaptation", "vector": [0.2] * 128}
    ]
)

# Add more data
table.add([
    {"id": 3, "text": "Vector DBs enable semantic search", "vector": [0.3] * 128}
])

# Vector search
results = table.search([0.1] * 128).limit(3).to_pandas()
print(results)

# ANN index for faster search at scale
table.create_index(metric="cosine", num_partitions=256, num_sub_vectors=16)

# Query with filter
results = table.search([0.15] * 128).where("id > 1").limit(5).to_pandas()
print(results)

# Time travel
table checkout version=1
print(table.to_pandas())
```

**Use-Case:** Embedded/vector-first applications needing a lightweight, versioned vector store with no server management.

**Comparison Table — All Vector DBs:**

| Feature | Chroma | Qdrant | Weaviate | Milvus | LanceDB |
|---|---|---|---|---|---|
| Language | Python/Rust | Rust | Go | Go/C++ | Rust |
| Self-hosted | ✅ | ✅ | ✅ | ✅ | ✅ |
| Managed | Beta | ✅ | ✅ | ✅ | ✅ |
| Distributed | ❌ | ✅ | ✅ | ✅ | ❌ |
| GPU acceleration | ❌ | ❌ | ❌ | ✅ | ❌ |
| Hybrid search | Basic | ✅ | ✅ | ✅ | ✅ |
| Scale | 10M vectors | Billions | Billions | Billions | 100M+ |
| Serverless | ❌ | ❌ | ❌ | ❌ | ✅ |
| Ease of setup | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ | ⭐⭐ | ⭐⭐⭐ |

---

## 4. Open-Source Model Serving

### 4.1 vLLM

| | |
|---|---|
| **URL** | https://github.com/vllm-project/vllm |
| **Stars** | 35k+ |
| **License** | Apache 2.0 |
| **Language** | Python/C++ |
| **Description** | High-throughput LLM serving engine with PagedAttention for efficient memory management |

**Key Features:**
- PagedAttention: 2-4x throughput improvement
- Continuous batching for maximum GPU utilization
- Tensor parallelism across multiple GPUs
- OpenAI-compatible API server
- Quantization support (GPTQ, AWQ, INT4/8)
- Speculative decoding

**Installation:**

```bash
pip install vllm

# Run server
vllm serve meta-llama/Llama-3-8B-Instruct --host 0.0.0.0 --port 8000

# With tensor parallelism (multi-GPU)
vllm serve meta-llama/Llama-3-70B-Instruct --tensor-parallel-size 4
```

**Python Example:**

```python
from openai import OpenAI

# vLLM serves an OpenAI-compatible API
client = OpenAI(base_url="http://localhost:8000/v1", api_key="not-needed")

response = client.chat.completions.create(
    model="meta-llama/Llama-3-8B-Instruct",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Explain PagedAttention in 3 sentences"}
    ],
    temperature=0.7,
    max_tokens=200
)
print(response.choices[0].message.content)

# Batch inference
prompts = [
    "The capital of France is",
    "The square root of 144 is",
    "In machine learning, transformers are"
]
outputs = client.completions.create(
    model="meta-llama/Llama-3-8B-Instruct",
    prompt=prompts,
    max_tokens=50
)
for output in outputs.choices:
    print(output.text)
```

**Use-Case:** High-throughput production serving of LLMs with maximum GPU efficiency.

---

### 4.2 Text Generation Inference (TGI)

| | |
|---|---|
| **URL** | https://github.com/huggingface/text-generation-inference |
| **Stars** | 9k+ |
| **License** | HFOIL (open for commercial use) |
| **Language** | Rust/Python |
| **Description** | Hugging Face's production-grade LLM serving solution with optimized CUDA kernels |

**Key Features:**
- Flash Attention 2 and PagedAttention
- Continuous batching and token streaming
- GPTQ, AWQ, EETQ, BitsAndBytes quantization
- Tensor parallelism and watermarked generation
- OpenAI-compatible API
- Docker-ready with NVIDIA GPU support

**Installation:**

```bash
# Docker (recommended)
docker run --gpus all -p 8080:80 \
  -v $PWD/data:/data \
  ghcr.io/huggingface/text-generation-inference:latest \
  --model-id meta-llama/Llama-3-8B-Instruct

# Via pip (less optimized)
pip install text-generation
```

**Python Example:**

```python
from text_generation import Client

client = Client("http://localhost:8080")

# Chat completion
response = client.chat_completion(
    model="meta-llama/Llama-3-8B-Instruct",
    messages=[
        {"role": "user", "content": "Write a Python function to merge sort"}
    ],
    temperature=0.2,
    max_tokens=512
)
print(response.choices[0].message.content)

# Streaming
for text in client.generate_stream(
    model="meta-llama/Llama-3-8B-Instruct",
    prompt="Once upon a time",
    max_tokens=100,
    temperature=0.8
):
    print(text.token.text, end="", flush=True)

# Token generation
response = client.generate(
    model="meta-llama/Llama-3-8B-Instruct",
    prompt="The future of AI is",
    max_new_tokens=200,
    do_sample=True,
    temperature=0.7
)
print(response.generated_text)
```

**Use-Case:** Hugging Face ecosystem deployments needing production-grade serving with tight model integration.

---

### 4.3 Ollama

| | |
|---|---|
| **URL** | https://github.com/ollama/ollama |
| **Stars** | 100k+ |
| **License** | MIT |
| **Language** | Go |
| **Description** | Run LLMs locally with a simple CLI — "Docker for LLMs" |

**Key Features:**
- One-command model download and run (`ollama run llama3`)
- Model library with 100+ pre-trained models
- Automatic GPU detection and optimization
- REST API for programmatic access
- OpenAI-compatible endpoint
- Modelfile for custom model configurations
- Cross-platform (macOS, Linux, Windows)

**Installation:**

```bash
# macOS/Linux
curl -fsSL https://ollama.com/install.sh | sh

# Windows — download from https://ollama.com

# Run a model
ollama run llama3.1
ollama run codellama:34b
ollama run mistral
```

**Python Example:**

```python
import ollama

# Simple generation
response = ollama.chat(
    model="llama3.1",
    messages=[
        {"role": "user", "content": "What is the meaning of life?"}
    ]
)
print(response["message"]["content"])

# Streaming
stream = ollama.chat(
    model="llama3.1",
    messages=[{"role": "user", "content": "Tell me a story"}],
    stream=True
)
for chunk in stream:
    print(chunk["message"]["content"], end="", flush=True)

# Generate embeddings
embedding = ollama.embeddings(model="nomic-embed-text", prompt="Hello world")
print(f"Embedding dim: {len(embedding['embedding'])}")

# Pull and manage models
ollama.pull("llama3.1")
ollama.list()  # List installed models
```

**Use-Case:** Developers wanting to run LLMs locally with minimal setup — the easiest way to get started with local AI.

---

### 4.4 LocalAI

| | |
|---|---|
| **URL** | https://github.com/mudler/LocalAI |
| **Stars** | 24k+ |
| **License** | MIT |
| **Language** | Go |
| **Description** | Drop-in OpenAI API replacement running locally with CPU and GPU support for multiple model families |

**Key Features:**
- Drop-in OpenAI API replacement (swap endpoint, keep code)
- Supports GGML, GGUF, GPT4ALL, Falcon, and more
- CPU and CUDA GPU support
- Text, audio (TTS/STT), and image generation
- Vision model support
- Docker and Kubernetes ready

**Installation:**

```bash
# Docker (recommended)
docker run -d -p 8080:8080 \
  -v localai_models:/models \
  --gpus all \
  localai/localai:latest

# Download a model
curl http://localhost:8080/models/apply -H "Content-Type: application/json" \
  -d '{"id": "huggingface://TheBloke/Llama-2-7B-Chat-GGUF/llama-2-7b-chat.Q4_K_M.gguf"}'
```

**Python Example:**

```python
from openai import OpenAI

# Just point to LocalAI instead of OpenAI
client = OpenAI(base_url="http://localhost:8080/v1", api_key="not-needed")

# Chat
response = client.chat.completions.create(
    model="llama-2-7b-chat",
    messages=[{"role": "user", "content": "Explain quantum computing"}]
)
print(response.choices[0].message.content)

# Image generation (local Stable Diffusion)
response = client.images.generate(
    model="stablediffusion",
    prompt="A futuristic city at sunset",
    n=1
)
print(response.data[0].url)
```

**Use-Case:** Users wanting a single local server that replaces the entire OpenAI API — chat, embeddings, TTS, and images.

---

### 4.5 llama.cpp

| | |
|---|---|
| **URL** | https://github.com/ggerganov/llama.cpp |
| **Stars** | 68k+ |
| **License** | MIT |
| **Language** | C/C++ |
| **Description** | High-performance LLM inference in C/C++ with CPU and GPU acceleration |

**Key Features:**
- Runs on CPU with no dependencies
- GPU acceleration (CUDA, Metal, Vulkan, SYCL)
- Quantization (Q2_K through Q8_0)
- Interactive and batch modes
- Embeddings generation
- Server mode with OpenAI-compatible API
- Cross-platform (Linux, macOS, Windows, Android)

**Installation:**

```bash
# Build from source
git clone https://github.com/ggerganov/llama.cpp
cd llama.cpp
cmake -B build
cmake --build build --config Release

# Run inference
./build/bin/llama-cli -m models/llama-2-7b-chat.Q4_K_M.gguf \
  -p "What is machine learning?" -n 256

# Run as server
./build/bin/llama-server -m models/llama-2-7b-chat.Q4_K_M.gguf \
  --host 0.0.0.0 --port 8080
```

**Python Example:**

```python
from llama_cpp import Llama

# Initialize model
llm = Llama(
    model_path="./models/llama-2-7b-chat.Q4_K_M.gguf",
    n_ctx=4096,
    n_gpu_layers=35  # Offload to GPU
)

# Text completion
output = llm(
    "def fibonacci(n):",
    max_tokens=200,
    temperature=0.7,
    stop=["```"]
)
print(output["choices"][0]["text"])

# Chat
output = llm.create_chat_completion(
    messages=[
        {"role": "system", "content": "You are a Python expert."},
        {"role": "user", "content": "Write a quicksort algorithm"}
    ],
    temperature=0.3,
    max_tokens=500
)
print(output["choices"][0]["message"]["content"])

# Embeddings
embeddings = llm.embed("What is deep learning?")
print(f"Dimension: {len(embeddings)}")
```

**Use-Case:** Maximum performance and portability — run LLMs on anything from servers to smartphones.

**Comparison Table — Model Serving:**

| Feature | vLLM | TGI | Ollama | LocalAI | llama.cpp |
|---|---|---|---|---|---|
| Language | Python/C++ | Rust/Python | Go | Go | C/C++ |
| GPU support | ✅ (CUDA) | ✅ (CUDA) | ✅ | ✅ (CUDA) | ✅ (Multi) |
| CPU only | ❌ | ❌ | ✅ | ✅ | ✅ |
| OpenAI API | ✅ | ✅ | ✅ | ✅ | ✅ |
| Throughput | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ | ⭐⭐ | ⭐⭐ |
| Ease of setup | ⭐⭐ | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐ |
| Batch inference | ✅ | ✅ | ❌ | ❌ | ✅ |
| Mobile support | ❌ | ❌ | ❌ | ❌ | ✅ |

---

## 5. Open-Source Agent Frameworks

### 5.1 CrewAI

| | |
|---|---|
| **URL** | https://github.com/joaomdmoura/crewAI |
| **Stars** | 20k+ |
| **License** | MIT |
| **Language** | Python |
| **Description** | Framework for orchestrating role-playing AI agents that collaborate to solve complex tasks |

**Key Features:**
- Role-based agent design (researcher, writer, analyst)
- Multi-agent collaboration with delegation
- Built-in tools (web search, file I/O, code execution)
- Sequential and hierarchical process modes
- Memory and context sharing between agents
- Custom tool creation

**Installation:**

```bash
pip install crewai crewai-tools
```

**Python Example:**

```python
from crewai import Agent, Task, Crew
from crewai_tools import SerperDevTool

# Define tools
search_tool = SerperDevTool()

# Define agents
researcher = Agent(
    role="Senior Research Analyst",
    goal="Uncover the latest developments in AI safety",
    backstory="You are an expert researcher at a leading tech think tank.",
    tools=[search_tool],
    verbose=True,
    llm="gpt-4"
)

writer = Agent(
    role="Tech Content Writer",
    goal="Write engaging blog posts about AI research",
    backstory="You are a renowned tech blogger known for insightful articles.",
    llm="gpt-4"
)

# Define tasks
research_task = Task(
    description="Research the top 5 AI safety frameworks in 2025",
    expected_output="A detailed report with key findings",
    agent=researcher
)

writing_task = Task(
    description="Write a blog post based on the research findings",
    expected_output="A 1000-word blog post with engaging title",
    agent=writer,
    context=[research_task]  # Depends on research_task
)

# Run the crew
crew = Crew(
    agents=[researcher, writer],
    tasks=[research_task, writing_task],
    verbose=True,
    process="sequential"
)

result = crew.kickoff()
print(result)
```

**Use-Case:** Complex multi-step tasks requiring different expertise — research + analysis + writing pipelines.

---

### 5.2 AutoGen

| | |
|---|---|
| **URL** | https://github.com/microsoft/autogen |
| **Stars** | 35k+ |
| **License** | MIT |
| **Language** | Python |
| **Description** | Microsoft's framework for building multi-agent conversations with human feedback |

**Key Features:**
- Multi-agent conversation patterns
- Human-in-the-loop integration
- Code execution in sandboxes
- Flexible agent roles and compositions
- Group chat orchestration
- Tool use and function calling

**Installation:**

```bash
pip install pyautogen
# For v0.4+
pip install autogen-agentchat autogen-ext
```

**Python Example:**

```python
from autogen import AssistantAgent, UserProxyAgent, config_list_from_json

# Load config
config_list = config_list_from_json(env_or_file="OAI_CONFIG_LIST")

# Create agents
assistant = AssistantAgent(
    name="assistant",
    llm_config={"config_list": config_list},
    system_message="You are a helpful AI assistant."
)

user_proxy = UserProxyAgent(
    name="user_proxy",
    human_input_mode="TERMINATE",
    code_execution_config={"work_dir": "workspace"},
    max_consecutive_auto_reply=10
)

# Start conversation
user_proxy.initiate_chat(
    assistant,
    message="""Write Python code to:
1. Generate a random dataset
2. Train a simple classifier
3. Print the accuracy"""
)
```

**Use-Case:** Research and prototyping of multi-agent systems with flexible conversation topologies and human oversight.

---

### 5.3 LangGraph

| | |
|---|---|
| **URL** | https://github.com/langchain-ai/langgraph |
| **Stars** | 7k+ |
| **License** | MIT |
| **Language** | Python |
| **Description** | Build stateful, multi-actor applications with LLMs as nodes in a graph |

**Key Features:**
- Graph-based state machine for agent workflows
- Conditional routing and branching
- Built-in persistence and checkpointing
- Human-in-the-loop support
- Sub-graph composition
- Streaming and async support

**Installation:**

```bash
pip install langgraph
```

**Python Example:**

```python
from typing import TypedDict, Annotated
from langgraph.graph import StateGraph, END
from langgraph.graph.message import add_messages
from langchain_openai import ChatOpenAI

class State(TypedDict):
    messages: Annotated[list, add_messages]

llm = ChatOpenAI(model="gpt-4")

def chatbot(state: State):
    response = llm.invoke(state["messages"])
    return {"messages": [response]}

# Build the graph
graph = StateGraph(State)
graph.add_node("agent", chatbot)
graph.set_entry_point("agent")
graph.add_edge("agent", END)

app = graph.compile()

# Run
from langchain_core.messages import HumanMessage
result = app.invoke({
    "messages": [HumanMessage(content="What is LangGraph?")]
})
print(result["messages"][-1].content)

# Add conditional routing
def should_continue(state: State):
    last_message = state["messages"][-1]
    if "tool_call" in last_message.content:
        return "tools"
    return END

# Visualize the graph
print(app.get_graph().draw_mermaid())
```

**Use-Case:** Building complex, stateful agent workflows with explicit control flow — when chains aren't enough.

---

### 5.4 Phidata

| | |
|---|---|
| **URL** | https://github.com/phidatahq/phidata |
| **Stars** | 12k+ |
| **License** | Apache 2.0 |
| **Language** | Python |
| **Description** | Framework for building AI assistants with memory, knowledge, tools, and structured outputs |

**Key Features:**
- Agent-as-a-class with persistent memory
- Built-in tools (web search, file operations, shell)
- Knowledge base integration
- Structured output with Pydantic models
- Multi-modal (text, vision, audio)
- One-line deployment

**Installation:**

```bash
pip install phidata
```

**Python Example:**

```python
from phi.agent import Agent
from phi.model.openai import OpenAIChat
from phi.tools.yfinance import YFinanceTools
from phi.tools.duckduckgo import DuckDuckGoTools

# Finance assistant
finance_agent = Agent(
    name="Finance Analyst",
    model=OpenAIChat(id="gpt-4"),
    tools=[
        YFinanceTools(stock_price=True, analyst_recommendations=True),
        DuckDuckGoTools()
    ],
    description="You are a senior financial analyst.",
    instructions=[
        "Use yfinance to fetch real-time data",
        "Always show numbers in a clean table",
        "Include risk disclaimers"
    ],
    markdown=True,
)

finance_agent.print_response(
    "What's the current stock price of NVDA and its analyst recommendations?"
)

# Research agent with knowledge
research_agent = Agent(
    name="Research Assistant",
    model=OpenAIChat(id="gpt-4"),
    knowledge="path/to/knowledge_base",  # RAG
    tools=[DuckDuckGoTools()],
    description="You are a thorough research assistant."
)
```

**Use-Case:** Building production-ready AI assistants with persistent state, tools, and knowledge out of the box.

---

### 5.5 DSPy

| | |
|---|---|
| **URL** | https://github.com/stanfordnlp/dspy |
| **Stars** | 19k+ |
| **License** | MIT |
| **Language** | Python |
| **Description** | Programming framework for AI — not prompting, but programming with foundation models |

**Key Features:**
- Signature-based prompts (structured I/O)
- Automatic prompt optimization (teleprompters)
- Module composition (ChainOfThought, ReAct, etc.)
- Compiler that optimizes prompts against data
- Type-safe module interface
- Multi-model and multi-provider support

**Installation:**

```bash
pip install dspy-ai
```

**Python Example:**

```python
import dspy

# Configure
dspy.configure(lm=dspy.OpenAI(model="gpt-4"))

# Define a signature
class RAGAnswer(dspy.Signature):
    """Answer questions based on context."""
    context = dspy.InputField(desc="relevant passages")
    question = dspy.InputField(desc="question to answer")
    answer = dspy.OutputField(desc="detailed answer")

# Create a module
class RAGModule(dspy.Module):
    def __init__(self, num_passages=3):
        self.retrieve = dspy.Retrieve(k=num_passages)
        self.generate = dspy.ChainOfThought(RAGAnswer)
    
    def forward(self, question):
        passages = self.retrieve(question)
        context = "\n".join([p.passage for p in passages])
        return self.generate(context=context, question=question)

# Compile (optimize) with training data
trainset = [
    dspy.Example(
        question="What is transformer architecture?",
        context="Transformers use self-attention...",
        answer="The transformer is a deep learning architecture..."
    ).with_inputs("question", "context")
]

from dspy.teleprompt import BootstrapFewShot
optimizer = BootstrapFewShot(metric=my_metric)
compiled_rag = optimizer.compile(RAGModule(), trainset=trainset)

# Use optimized module
result = compiled_rag("Explain attention mechanisms")
print(result.answer)
```

**Use-Case:** When you want to optimize prompts systematically rather than manually engineering them.

**Comparison — Agent Frameworks:**

| Feature | CrewAI | AutoGen | LangGraph | Phidata | DSPy |
|---|---|---|---|---|---|
| Multi-agent | ✅ | ✅ | ✅ | Limited | ❌ |
| Role-based | ✅ | ✅ | ❌ | ✅ | ❌ |
| Code execution | ✅ | ✅ | ❌ | ✅ | ❌ |
| Human-in-loop | ✅ | ✅ | ✅ | ❌ | ❌ |
| Prompt optimization | ❌ | ❌ | ❌ | ❌ | ✅ |
| State management | ✅ | ✅ | ✅ | ✅ | ❌ |
| Learning curve | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐ | ⭐⭐⭐ |

---

## 6. Open-Source Fine-Tuning

### 6.1 Axolotl

| | |
|---|---|
| **URL** | https://github.com/OpenAccess-AI-Collective/axolotl |
| **Stars** | 8k+ |
| **License** | Apache 2.0 |
| **Language** | Python |
| **Description** | One-command fine-tuning for LLMs — supports LoRA, QLoRA, full fine-tuning, DPO, and more |

**Key Features:**
- YAML-based configuration for all parameters
- LoRA, QLoRA, full fine-tuning, GPTQ, and more
- DPO, RLHF, and KTO alignment training
- Multi-GPU and DeepSpeed support
- Flash Attention 2 integration
- Dataset formatting for major platforms (Alpaca, ShareGPT, etc.)

**Installation:**

```bash
git clone https://github.com/OpenAccess-AI-Collective/axolotl.git
cd axolotl
pip install -e .

# Or with Docker
docker run --gpus all -v .:/workspace axolotlai/axolotl:main
```

**YAML Config (`config.yaml`):**

```yaml
base_model: meta-llama/Llama-3-8B-Instruct
model_type: LlamaForCausalLM
tokenizer_type: AutoTokenizer

load_in_4bit: true
adapter: qlora
lora_r: 64
lora_alpha: 128
lora_dropout: 0.05

datasets:
  - path: tatsu-lab/alpaca
    type: alpaca

micro_batch_size: 4
gradient_accumulation_steps: 4
num_epochs: 3
learning_rate: 2e-4
bf16: true
output_dir: ./output
```

**Python Example:**

```python
import subprocess

# Launch fine-tuning
subprocess.run([
    "accelerate", "launch", "-m", "axolotl.cli.train",
    "config.yaml"
])

# After training, load the model
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch

model = AutoModelForCausalLM.from_pretrained(
    "./output",
    torch_dtype=torch.bfloat16,
    device_map="auto"
)
tokenizer = AutoTokenizer.from_pretrained("./output")

# Inference
inputs = tokenizer("Tell me about AI safety", return_tensors="pt").to("cuda")
outputs = model.generate(**inputs, max_new_tokens=200)
print(tokenizer.decode(outputs[0], skip_special_tokens=True))
```

**Use-Case:** Fine-tuning LLMs with a single YAML config — no code needed.

---

### 6.2 LLaMA-Factory

| | |
|---|---|
| **URL** | https://github.com/hiyouga/LLaMA-Factory |
| **Stars** | 35k+ |
| **License** | Apache 2.0 |
| **Language** | Python |
| **Description** | Web UI for fine-tuning 100+ LLMs — SOTA methods with zero-code CLI and WebUI |

**Key Features:**
- Web UI (Gradio) for visual fine-tuning
- 100+ model support (LLaMA, Mistral, Qwen, etc.)
- Methods: LoRA, QLoRA, full, RLHF, DPO, PPO
- Integrated evaluation and export
- Multi-GPU with DeepSpeed/FSDP
- Template system for chat formats

**Installation:**

```bash
git clone https://github.com/hiyouga/LLaMA-Factory.git
cd LLaMA-Factory
pip install -e ".[torch,metrics]"

# Launch Web UI
llamafactory-cli webui

# Or CLI
llamafactory-cli train config.yaml
```

**Python Example:**

```python
from llamafactory.train import run_exp
from llamafactory.data.loader import load_dataset

# Load and preview dataset
dataset = load_dataset("alpaca", split="train[:100]")
print(dataset[0])

# Fine-tune via CLI (equivalent to llamafactory-cli train)
import subprocess
subprocess.run([
    "llamafactory-cli", "train",
    "--model_name_or_path", "meta-llama/Llama-3-8B-Instruct",
    "--dataset", "alpaca",
    "--finetuning_type", "lora",
    "--lora_rank", "64",
    "--output_dir", "./lora_output",
    "--num_train_epochs", "3",
    "--per_device_train_batch_size", "4",
    "--learning_rate", "2e-4",
    "--bf16", "true"
])

# Merge LoRA weights
subprocess.run([
    "llamafactory-cli", "export",
    "--model_name_or_path", "meta-llama/Llama-3-8B-Instruct",
    "--adapter_name_or_path", "./lora_output",
    "--template", "llama3",
    "--export_dir", "./merged_model",
    "--export_size", "4"
])
```

**Use-Case:** The easiest way to fine-tune any LLM — visual WebUI, zero code required.

---

### 6.3 Unsloth

| | |
|---|---|
| **URL** | https://github.com/unslothai/unsloth |
| **Stars** | 25k+ |
| **License** | Apache 2.0 |
| **Language** | Python |
| **Description** | 2x faster, 60% less memory fine-tuning with hand-written Triton kernels |

**Key Features:**
- 2x speed improvement over standard fine-tuning
- 60% memory reduction (more models fit in VRAM)
- No accuracy loss — exact same results as standard
- Supports LoRA and QLoRA
- 4-bit quantization built in
- Works with Hugging Face ecosystem

**Installation:**

```bash
pip install unsloth
# For CUDA 12.1+
pip install --no-deps unsloth
```

**Python Example:**

```python
from unsloth import FastLanguageModel
import torch

# Load model with Unsloth optimization
model, tokenizer = FastLanguageModel.from_pretrained(
    model_name="unsloth/llama-3-8b-Instruct",
    max_seq_length=2048,
    dtype=None,  # Auto-detect
    load_in_4bit=True,
)

# Add LoRA adapters
model = FastLanguageModel.get_peft_model(
    model,
    r=16,
    target_modules=["q_proj", "k_proj", "v_proj", "o_proj",
                     "gate_proj", "up_proj", "down_proj"],
    lora_alpha=16,
    lora_dropout=0,
    bias="none",
    use_gradient_checkpointing="unsloth",
)

# Prepare dataset
from datasets import load_dataset
dataset = load_dataset("alpaca", split="train[:500]")

# Fine-tune with SFT
from trl import SFTTrainer
from transformers import TrainingArguments

trainer = SFTTrainer(
    model=model,
    tokenizer=tokenizer,
    train_dataset=dataset,
    max_seq_length=2048,
    args=TrainingArguments(
        per_device_train_batch_size=2,
        gradient_accumulation_steps=4,
        warmup_steps=5,
        max_steps=100,
        learning_rate=2e-4,
        fp16=not torch.cuda.is_bf16_supported(),
        bf16=torch.cuda.is_bf16_supported(),
        output_dir="outputs",
    ),
)

trainer.train()

# Save
model.save_pretrained("./lora_model")
```

**Use-Case:** Maximum efficiency fine-tuning — same quality, half the VRAM, twice the speed.

---

### 6.4 TRL (Transformer Reinforcement Learning)

| | |
|---|---|
| **URL** | https://github.com/huggingface/trl |
| **Stars** | 10k+ |
| **License** | Apache 2.0 |
| **Language** | Python |
| **Description** | Hugging Face's library for training LLMs with RLHF, DPO, PPO, and other alignment methods |

**Key Features:**
- SFT, Reward Modeling, PPO, DPO, KTO, ORPO
- Direct integration with Hugging Face transformers
- PEFT (LoRA) compatibility
- Distributed training with accelerate
- Online and offline RLHF

**Installation:**

```bash
pip install trl
```

**Python Example:**

```python
from trl import SFTTrainer, DPOTrainer, SFTConfig, DPOConfig
from transformers import AutoModelForCausalLM, AutoTokenizer
from datasets import load_dataset

model = AutoModelForCausalLM.from_pretrained("meta-llama/Llama-3-8B-Instruct")
tokenizer = AutoTokenizer.from_pretrained("meta-llama/Llama-3-8B-Instruct")

dataset = load_dataset("Anthropic/hh-rlhf", split="train[:1000]")

# SFT Training
sft_config = SFTConfig(
    output_dir="./sft_output",
    per_device_train_batch_size=4,
    num_train_epochs=3,
    learning_rate=2e-5,
    logging_steps=10,
)

sft_trainer = SFTTrainer(
    model=model,
    tokenizer=tokenizer,
    train_dataset=dataset,
    args=sft_config,
)
sft_trainer.train()

# DPO Training (alignment)
dpo_config = DPOConfig(
    output_dir="./dpo_output",
    per_device_train_batch_size=2,
    learning_rate=5e-7,
    beta=0.1,  # KL penalty
)

dpo_trainer = DPOTrainer(
    model=model,
    ref_model=None,
    tokenizer=tokenizer,
    train_dataset=dataset,
    args=dpo_config,
)
dpo_trainer.train()
```

---

### 6.5 PEFT (Parameter-Efficient Fine-Tuning)

| | |
|---|---|
| **URL** | https://github.com/huggingface/peft |
| **Stars** | 13k+ |
| **License** | Apache 2.0 |
| **Language** | Python |
| **Description** | Hugging Face's library for efficient adaptation of large pretrained models |

**Key Features:**
- LoRA, AdaLoRA, Prefix Tuning, Prompt Tuning
- IA3, (IA)^3 adapters
- Model merging and adapter combination
- Integration with transformers and TRL
- Quantization support (GPTQ, bnb)

**Installation:**

```bash
pip install peft
```

**Python Example:**

```python
from peft import LoraConfig, get_peft_model, TaskType, PeftModel
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch

model = AutoModelForCausalLM.from_pretrained(
    "meta-llama/Llama-3-8B-Instruct",
    torch_dtype=torch.bfloat16
)

# Configure LoRA
lora_config = LoraConfig(
    task_type=TaskType.CAUSAL_LM,
    r=16,
    lora_alpha=32,
    lora_dropout=0.1,
    target_modules=["q_proj", "v_proj", "k_proj", "o_proj"],
    bias="none",
)

model = get_peft_model(model, lora_config)
model.print_trainable_parameters()
# trainable params: 13,631,488 || all params: 8,030,261,248 || 0.17%

# Save adapter only (small file)
model.save_pretrained("./lora_adapter")

# Load adapter later
base_model = AutoModelForCausalLM.from_pretrained("meta-llama/Llama-3-8B-Instruct")
model = PeftModel.from_pretrained(base_model, "./lora_adapter")

# Merge adapter into base model
merged_model = model.merge_and_unload()
merged_model.save_pretrained("./merged_model")
```

**Fine-Tuning Comparison:**

| Feature | Axolotl | LLaMA-Factory | Unsloth | TRL | PEFT |
|---|---|---|---|---|---|
| Web UI | ❌ | ✅ | ❌ | ❌ | ❌ |
| LoRA/QLoRA | ✅ | ✅ | ✅ | ✅ | ✅ |
| DPO/RLHF | ✅ | ✅ | ❌ | ✅ | ❌ |
| Speed boost | ❌ | ❌ | ✅ (2x) | ❌ | ❌ |
| Config-based | YAML | YAML | Python | Python | Python |
| Ease of use | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ | ⭐⭐ | ⭐⭐ |

---

## 7. Open-Source RAG

### 7.1 LlamaIndex

| | |
|---|---|
| **URL** | https://github.com/run-llama/llama_index |
| **Stars** | 36k+ |
| **License** | MIT |
| **Language** | Python |
| **Description** | Data framework for connecting LLMs with external data — the RAG standard |

**Key Features:**
- 160+ data connector integrations
- Multiple indexing strategies (vector, tree, knowledge graph)
- Advanced retrieval (hybrid, recursive, reranking)
- Sub-question query engine for complex queries
- Multi-modal RAG
- Evaluation framework built-in

**Installation:**

```bash
pip install llama-index llama-index-llms-openai llama-index-vector-stores-chroma
```

**Python Example:**

```python
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader, Settings
from llama_index.llms.openai import OpenAI
from llama_index.vector_stores.chroma import ChromaVectorStore
import chromadb

Settings.llm = OpenAI(model="gpt-4", temperature=0)

# Load documents
documents = SimpleDirectoryReader("./data").load_data()

# Build vector index
index = VectorStoreIndex.from_documents(documents)

# Query
query_engine = index.as_query_engine(similarity_top_k=3)
response = query_engine.query("What are the key findings in the research papers?")
print(response)

# Use with Chroma for persistence
chroma_client = chromadb.PersistentClient(path="./chroma_db")
chroma_collection = chroma_client.get_or_create_collection("docs")
vector_store = ChromaVectorStore(chroma_collection=chroma_collection)

index = VectorStoreIndex.from_documents(
    documents,
    vector_store=vector_store
)

# Advanced: Sub-question query engine
from llama_index.core.query_engine import SubQuestionQueryEngine
from llama_index.core.tools import QueryEngineTool, ToolMetadata

tools = [
    QueryEngineTool(
        query_engine=research_index.as_query_engine(),
        metadata=ToolMetadata(name="research_papers", description="Research papers database")
    ),
    QueryEngineTool(
        query_engine=code_index.as_query_engine(),
        metadata=ToolMetadata(name="codebase", description="Code repository")
    )
]

engine = SubQuestionQueryEngine.from_defaults(query_engine_tools=tools)
response = engine.query("How does the codebase implement the research findings?")
```

**Use-Case:** Building production RAG pipelines with complex data sources and retrieval strategies.

---

### 7.2 RAGFlow

| | |
|---|---|
| **URL** | https://github.com/infiniflow/ragflow |
| **Stars** | 20k+ |
| **License** | Apache 2.0 |
| **Language** | Python/TypeScript |
| **Description** | End-to-end RAG engine with deep document understanding and chunking |

**Key Features:**
- Deep document understanding (tables, charts, layouts)
- Template-based chunking (paper, book, table, etc.)
- Hybrid search with RRF fusion
- Conversation memory with context window
- Citation-backed answers
- Web UI for document management

**Installation:**

```bash
git clone https://github.com/infiniflow/ragflow.git
cd ragflow
docker compose -f docker-compose.yml up -d
# Access at http://localhost:9380
```

**Python Example:**

```python
import requests

RAGFLOW_URL = "http://localhost:9380"

# Create a dataset
dataset = requests.post(f"{RAGFLOW_URL}/api/v1/datasets", 
    headers={"Authorization": "Bearer YOUR_TOKEN"},
    json={"name": "Research Papers"}
).json()

# Upload document
files = {"file": open("paper.pdf", "rb")}
doc = requests.post(
    f"{RAGFLOW_URL}/api/v1/datasets/{dataset['data']['id']}/documents",
    headers={"Authorization": "Bearer YOUR_TOKEN"},
    files=files
).json()

# Chat with documents
response = requests.post(
    f"{RAGFLOW_URL}/api/v1/chats/{chat_id}/completions",
    headers={"Authorization": "Bearer YOUR_TOKEN"},
    json={
        "question": "Summarize the methodology used in this paper",
        "stream": False
    }
)
print(response.json()["data"]["answer"])
print(response.json()["data"]["references"])  # Citations
```

**Use-Case:** Document-heavy RAG where deep understanding of PDFs, tables, and layouts matters.

---

### 7.3 Haystack

| | |
|---|---|
| **URL** | https://github.com/deepset-ai/haystack |
| **Stars** | 17k+ |
| **License** | Apache 2.0 |
| **Language** | Python |
| **Description** | End-to-end NLP framework for building search and QA pipelines |

**Key Features:**
- Pipeline-based architecture (DAGs)
- 40+ integrations (OpenAI, Elasticsearch, Chroma, etc.)
- Components: retrievers, generators, readers, classifiers
- Hybrid search pipelines
- Evaluation framework
- Production-ready with Docker and Kubernetes

**Installation:**

```bash
pip install haystack-ai
# With extras
pip install 'haystack-ai[openai]'
pip install 'haystack-ai[chroma]'
```

**Python Example:**

```python
from haystack import Pipeline
from haystack.components.retrievers.in_memory import InMemoryBM25Retriever
from haystack.components.generators import OpenAIGenerator
from haystack.components.builders import PromptBuilder
from haystack.document_stores.in_memory import InMemoryDocumentStore
from haystack.dataclasses import Document

# Create document store
doc_store = InMemoryDocumentStore()

# Add documents
docs = [
    Document(content="Transformers use self-attention for sequence modeling"),
    Document(content="RAG combines retrieval and generation for better answers"),
    Document(content="LoRA reduces trainable parameters by 90%"),
]
doc_store.write_documents(docs)

# Build pipeline
pipeline = Pipeline()
pipeline.add_component("retriever", InMemoryBM25Retriever(document_store=doc_store))
pipeline.add_component("prompt", PromptBuilder(template="""
Given these documents:
{% for doc in documents %}
{{ doc.content }}
{% endfor %}
Answer: {{ question }}
"""))
pipeline.add_component("generator", OpenAIGenerator(model="gpt-4"))

pipeline.connect("retriever.documents", "prompt.documents")
pipeline.connect("prompt", "generator")

# Run
result = pipeline.run({"retriever": {"query": "How does RAG work?"}})
print(result["generator"]["replies"][0])
```

**Use-Case:** Production NLP/search pipelines with pluggable components and strong typing.

---

### 7.4 DocTR

| | |
|---|---|
| **URL** | https://github.com/mindee/doctr |
| **Stars** | 8k+ |
| **License** | Apache 2.0 |
| **Language** | Python |
| **Description** | Document text recognition and extraction — OCR for structured document understanding |

**Key Features:**
- OCR for scanned documents (layout analysis + text recognition)
- Text detection and recognition
- PDF and image processing
- GPU acceleration
- Multiple architectures (DBNet, ViT, etc.)

**Installation:**

```bash
pip install python-doctr[torch]
# or
pip install python-doctr[tf]
```

**Python Example:**

```python
from doctr.io import DocumentFile
from doctr.models import ocr_predictor

# Load model
model = ocr_predictor(det_arch='db_resnet50', reco_arch='crnn_vgg16_bn')

# OCR from image
doc = DocumentFile.from_images("document.png")
result = model(doc)

# Extract text
for page in result.pages:
    for block in page.blocks:
        for line in block.lines:
            print(" ".join([word.value for word in line.words]))

# OCR from PDF
doc = DocumentFile.from_pdf("paper.pdf")
result = model(doc)
for page_num, page in enumerate(result.pages):
    print(f"--- Page {page_num + 1} ---")
    text = page.render()
    print(text)
```

**Use-Case:** Extracting text from scanned documents, images, and PDFs for RAG pipelines.

---

### 7.5 Unstructured

| | |
|---|---|
| **URL** | https://github.com/Unstructured-IO/unstructured |
| **Stars** | 8k+ |
| **License** | Apache 2.0 |
| **Language** | Python |
| **Description** | Preprocess documents (PDFs, HTML, emails, etc.) for LLMs and RAG pipelines |

**Key Features:**
- 70+ file type support
- Table extraction from PDFs
- HTML parsing and cleaning
- Email parsing (headers, body, attachments)
- Chunking strategies
- GPU-accelerated processing

**Installation:**

```bash
pip install unstructured
# For specific file types
pip install "unstructured[pdf]"
pip install "unstructured[html]"
```

**Python Example:**

```python
from unstructured.partition.pdf import partition_pdf
from unstructured.partition.html import partition_html
from unstructured.chunking.title import chunk_by_title

# Parse PDF
elements = partition_pdf("report.pdf")

# Parse HTML
elements = partition_html("https://example.com/article")

# Chunk by title
chunks = chunk_by_title(elements, max_characters=1000, combine_text_under_n_chars=200)
for chunk in chunks:
    print(f"[{chunk.category}] {chunk.text[:100]}...")

# Clean and structured output
for element in elements:
    print(f"Type: {type(element).__name__}")
    print(f"Text: {element.text[:100]}")
    if hasattr(element, 'metadata'):
        print(f"Metadata: {element.metadata}")
```

**RAG Comparison:**

| Feature | LlamaIndex | RAGFlow | Haystack | DocTR | Unstructured |
|---|---|---|---|---|---|
| Vector store | Multiple | Built-in | Multiple | N/A | N/A |
| Doc parsing | ✅ | ✅ | ✅ | OCR only | ✅ (70+ types) |
| Pipeline builder | ✅ | ❌ | ✅ | ❌ | ❌ |
| Deep PDF parsing | Basic | ✅ | Basic | ✅ | ✅ |
| Web UI | ❌ | ✅ | ❌ | ❌ | ❌ |
| Production ready | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## 8. Open-Source Speech

### 8.1 Whisper

| | |
|---|---|
| **URL** | https://github.com/openai/whisper |
| **Stars** | 70k+ |
| **License** | MIT |
| **Language** | Python |
| **Description** | OpenAI's general-purpose speech recognition model — multilingual, robust, accurate |

**Key Features:**
- 99 languages supported
- Multitask: transcription, translation, language detection
- Robust to accents, background noise, technical terms
- Multiple model sizes (tiny to large-v3)
- Timestamp support
- OpenAI API and local running

**Installation:**

```bash
pip install openai-whisper
# or faster version
pip install faster-whisper
```

**Python Example:**

```python
import whisper

model = whisper.load_model("large-v3")

# Transcribe
result = model.transcribe("audio.mp3", language="en")
print(result["text"])

# Translate to English
result = model.transcribe("foreign_speech.mp3", task="translate")
print(result["text"])

# Word-level timestamps
result = model.transcribe("meeting.mp3", word_timestamps=True)
for segment in result["segments"]:
    print(f"[{segment['start']:.1f}s - {segment['end']:.1f}s] {segment['text']}")
    for word in segment.get("words", []):
        print(f"  {word['word']} ({word['start']:.2f}-{word['end']:.2f})")
```

**Use-Case:** High-quality speech-to-text for transcription, translation, and subtitle generation.

---

### 8.2 Bark

| | |
|---|---|
| **URL** | https://github.com/suno-ai/bark |
| **Stars** | 33k+ |
| **License** | MIT |
| **Language** | Python |
| **Description** | Text-to-audio model that generates highly realistic speech, music, and sound effects |

**Key Features:**
- Realistic speech with emotions and intonation
- Sound effects (laughter, sighs, etc.)
- Music generation
- Non-verbal sounds
- 13+ languages
- Speaker prompting

**Installation:**

```bash
pip install bark
```

**Python Example:**

```python
from bark import SAMPLE_RATE, generate_audio, preload_models
import scipy.io.wavfile as wavfile

preload_models()

# Generate speech
audio_array = generate_audio("Hello! This is a test of the Bark text-to-audio system.")

# Save
wavfile.write("output.wav", SAMPLE_RATE, audio_array)

# With non-verbal sounds
audio = generate_audio("[laughs] That's hilarious! [sighs] But seriously...")

# Multi-language
audio = generate_audio("Bonjour, comment allez-vous aujourd'hui?", language_multilang_preset="v2/multilingual")
```

---

### 8.3 Coqui TTS

| | |
|---|---|
| **URL** | https://github.com/coqui-ai/TTS |
| **Stars** | 33k+ |
| **License** | MPL-2.0 |
| **Language** | Python |
| **Description** | Deep learning TTS library with 20+ languages, voice cloning, and model training**

**Key Features:**
- 20+ TTS models (VITS, XTTS, Tacotron, etc.)
- Voice cloning with XTTS v2
- Multi-lingual and multi-speaker
- Training pipeline for custom voices
- Speaker conditioning
- Real-time streaming

**Installation:**

```bash
pip install TTS
```

**Python Example:**

```python
from TTS.api import TTS

# List available models
print(TTS().list_models())

# Use XTTS v2 for voice cloning
tts = TTS("tts_models/multilingual/multi-dataset/xtts_v2")

# Text-to-speech with voice cloning
tts.tts_to_file(
    text="This is a cloned voice speaking your text.",
    file_path="output.wav",
    speaker_wav="reference_voice.wav",  # Voice to clone
    language="en"
)

# Standard TTS
tts = TTS("tts_models/en/ljspeech/tacotron2-DDC")
tts.tts_to_file(text="Hello world!", file_path="hello.wav")
```

---

### 8.4 Piper

| | |
|---|---|
| **URL** | https://github.com/rhasspy/piper |
| **Stars** | 7k+ |
| **License** | MIT |
| **Language** | C++/Python |
| **Description** | Fast, local neural TTS optimized for Raspberry Pi and edge devices |

**Key Features:**
- Extremely fast and lightweight
- 50+ voice models
- ONNX runtime (no GPU needed)
- Command-line and library usage
- Home Assistant integration
- Low latency streaming

**Installation:**

```bash
# Download binary
# https://github.com/rhasspy/piper/releases

# pip
pip install piper-tts
```

**Python Example:**

```python
from piper import PiperVoice

# Load model
voice = PiperVoice.load("en_US-lessac-medium.onnx")

# Generate audio
import wave
import io

wav_buf = io.BytesIO()
with wave.open(wav_buf, 'wb') as wav_file:
    voice.synthesize("Hello from Piper! I'm a fast local TTS engine.", wav_file)

with open("output.wav", "wb") as f:
    f.write(wav_buf.getvalue())
```

---

### 8.5 Faster-Whisper

| | |
|---|---|
| **URL** | https://github.com/SYSTRAN/faster-whisper |
| **Stars** | 12k+ |
| **License** | MIT |
| **Language** | Python/C++ |
| **Description** | CTranslate2-based Whisper — 4x faster, same accuracy, lower memory**

**Key Features:**
- 4x faster than original Whisper
- 4x less memory usage
- Same accuracy as original
- GPU and CPU support
- VAD filtering (Voice Activity Detection)
- Batch processing

**Installation:**

```bash
pip install faster-whisper
```

**Python Example:**

```python
from faster_whisper import WhisperModel

# Load model (auto-detects GPU)
model = WhisperModel("large-v3", device="cuda", compute_type="float16")

segments, info = model.transcribe("audio.mp3", beam_size=5)
print(f"Language: {info.language}, Probability: {info.language_probability:.2f}")

for segment in segments:
    print(f"[{segment.start:.2f}s -> {segment.end:.2f}s] {segment.text}")

# With VAD filter
segments, info = model.transcribe(
    "long_audio.mp3",
    vad_filter=True,
    vad_parameters=dict(
        min_silence_duration_ms=500,
        speech_pad_ms=300
    )
)
```

**Speech Comparison:**

| Feature | Whisper | Bark | Coqui TTS | Piper | Faster-Whisper |
|---|---|---|---|---|---|
| Task | STT | TTS | TTS | TTS | STT |
| Speed | Medium | Slow | Medium | Fast | Fast (4x) |
| GPU required | Recommended | ✅ | Optional | ❌ | Optional |
| Voice cloning | ❌ | ❌ | ✅ | ❌ | ❌ |
| Languages | 99 | 13 | 20+ | 50+ voices | 99 |
| Edge deployment | ❌ | ❌ | ❌ | ✅ | ✅ |

---

## 9. Open-Source Image Generation

### 9.1 Stable Diffusion

| | |
|---|---|
| **URL** | https://github.com/Stability-AI/stablediffusion |
| **Stars** | 65k+ |
| **License** | CreativeML OpenRAIL-M |
| **Language** | Python |
| **Description** | Latent text-to-image diffusion model — the most popular open-source image generator |

**Key Features:**
- Text-to-image, image-to-image, inpainting
- Multiple model versions (SD 1.5, SDXL, SD3)
- ControlNet for structural guidance
- LoRA fine-tuning support
- Community model ecosystem (CivitAI)
- Web UI (Automatic1111, ComfyUI)

**Installation:**

```bash
pip install diffusers transformers accelerate torch
```

**Python Example:**

```python
from diffusers import StableDiffusionXLPipeline
import torch

pipe = StableDiffusionXLPipeline.from_pretrained(
    "stabilityai/stable-diffusion-xl-base-1.0",
    torch_dtype=torch.float16,
    variant="fp16"
).to("cuda")

# Text-to-image
image = pipe(
    prompt="A futuristic cityscape at sunset, cyberpunk style, highly detailed",
    negative_prompt="blurry, low quality, distorted",
    num_inference_steps=30,
    guidance_scale=7.5,
    width=1024,
    height=1024
).images[0]

image.save("output.png")

# Image-to-image
from diffusers import StableDiffusionImg2ImgPipeline
img2img = StableDiffusionImg2ImgPipeline.from_pretrained(
    "stabilityai/stable-diffusion-xl-base-1.0",
    torch_dtype=torch.float16
).to("cuda")

from PIL import Image
init_image = Image.open("input.png").resize((1024, 1024))
image = img2img(
    prompt="Oil painting of a landscape",
    image=init_image,
    strength=0.75,
    guidance_scale=7.5
).images[0]
image.save("stylized.png")
```

---

### 9.2 ComfyUI

| | |
|---|---|
| **URL** | https://github.com/comfyanonymous/ComfyUI |
| **Stars** | 55k+ |
| **License** | GPL-3.0 |
| **Language** | Python |
| **Description** | Node-based UI for Stable Diffusion — maximum flexibility and workflow control |

**Key Features:**
- Visual node-based workflow
- SD, SDXL, SD3, FLUX, and more
- ControlNet, IP-Adapter, LoRA, upscale
- Advanced inpainting and masking
- Workflow sharing (.json)
- API for programmatic use
- Extremely memory efficient

**Installation:**

```bash
git clone https://github.com/comfyanonymous/ComfyUI.git
cd ComfyUI
pip install -r requirements.txt
python main.py
# Access at http://localhost:8188
```

**Python Example (API):**

```python
import requests
import json

# ComfyUI workflow as JSON
workflow = {
    "3": {
        "class_type": "KSampler",
        "inputs": {
            "seed": 42,
            "steps": 20,
            "cfg": 7,
            "sampler_name": "euler",
            "scheduler": "normal",
            "denoise": 1.0,
            "model": ["4", 0],
            "positive": ["6", 0],
            "negative": ["7", 0],
            "latent_image": ["5", 0]
        }
    },
    "4": {
        "class_type": "CheckpointLoaderSimple",
        "inputs": {"ckpt_name": "sd_xl_base_1.0.safetensors"}
    },
    "5": {
        "class_type": "EmptyLatentImage",
        "inputs": {"width": 1024, "height": 1024, "batch_size": 1}
    },
    "6": {
        "class_type": "CLIPTextEncode",
        "inputs": {"text": "A beautiful sunset over mountains", "clip": ["4", 1]}
    },
    "7": {
        "class_type": "CLIPTextEncode",
        "inputs": {"text": "blurry, low quality", "clip": ["4", 1]}
    },
    "8": {
        "class_type": "VAEDecode",
        "inputs": {"samples": ["3", 0], "vae": ["4", 2]}
    },
    "9": {
        "class_type": "SaveImage",
        "inputs": {"filename_prefix": "output", "images": ["8", 0]}
    }
}

response = requests.post(
    "http://localhost:8188/prompt",
    json={"prompt": workflow}
)
print(response.json())
```

---

### 9.3 ControlNet

| | |
|---|---|
| **URL** | https://github.com/lllyasviel/ControlNet |
| **Stars** | 28k+ |
| **License** | Apache 2.0 |
| **Language** | Python |
| **Description** | Add spatial conditioning control to Stable Diffusion — edges, depth, pose, and more |

**Key Features:**
- Edge detection (Canny, Scribble, HED)
- Depth map conditioning
- Human pose estimation (OpenPose)
- Semantic segmentation
- Normal map and MLSD
- Inpainting ControlNet

**Installation:**

```python
from diffusers import StableDiffusionXLControlNetPipeline, ControlNetModel
from diffusers.utils import load_image
import torch

# Load ControlNet
controlnet = ControlNetModel.from_pretrained(
    "diffusers/controlnet-canny-sdxl-1.0",
    torch_dtype=torch.float16
)

# Create pipeline
pipe = StableDiffusionXLControlNetPipeline.from_pretrained(
    "stabilityai/stable-diffusion-xl-base-1.0",
    controlnet=controlnet,
    torch_dtype=torch.float16
).to("cuda")

# Load and process control image
from diffusers import CannyDetector
canny = CannyDetector()
image = load_image("input.png")
control_image = canny(image, low_threshold=100, high_threshold=200)

# Generate with control
image = pipe(
    prompt="A beautiful interior design",
    image=control_image,
    num_inference_steps=20,
    controlnet_conditioning_scale=0.5
).images[0]
image.save("controlled_output.png")
```

---

### 9.4 FLUX

| | |
|---|---|
| **URL** | https://github.com/black-forest-labs/flux |
| **Stars** | 17k+ |
| **License** | Apache 2.0 (dev) / FLUX.1 [dev] license |
| **Language** | Python |
| **Description** | Black Forest Labs' state-of-the-art text-to-image model — successor to Stable Diffusion |

**Key Features:**
- Superior prompt following
- Photorealistic quality
- Text rendering in images
- Fast inference with distilled models
- Multiple variants (schnell, dev, pro)
- 12B parameter model

**Installation:**

```bash
pip install diffusers transformers accelerate torch
```

**Python Example:**

```python
from diffusers import FluxPipeline
import torch

pipe = FluxPipeline.from_pretrained(
    "black-forest-labs/FLUX.1-schnell",
    torch_dtype=torch.bfloat16
).to("cuda")

image = pipe(
    prompt="A photo of a cat wearing sunglasses on a beach, golden hour",
    num_inference_steps=4,  # schnell is fast
    guidance_scale=0.0
).images[0]

image.save("flux_output.png")
```

**Image Gen Comparison:**

| Feature | Stable Diffusion | ComfyUI | ControlNet | FLUX |
|---|---|---|---|---|
| Type | Model | UI | Model addon | Model |
| Prompt following | Good | N/A | Good | Excellent |
| Text in images | Poor | N/A | Poor | Good |
| Customization | Extensive | Maximum | Extensive | Limited |
| Community models | 100k+ | All SD models | Many | Growing |
| Learning curve | Medium | High | Medium | Low |

---

## 10. Open-Source Monitoring & Observability

### 10.1 Langfuse

| | |
|---|---|
| **URL** | https://github.com/langfuse/langfuse |
| **Stars** | 6k+ |
| **License** | MIT (self-hosted), proprietary cloud |
| **Language** | TypeScript/Python |
| **Description** | Open-source LLM engineering platform — tracing, evaluation, prompt management, analytics**

**Key Features:**
- Full LLM trace visibility
- Cost and latency analytics
- Prompt management and versioning
- User-level analytics and feedback
- Dataset creation for evaluation
- SDKs for Python, JS/TS, and integrations

**Installation:**

```bash
# Docker
docker compose up -d
# Access at http://localhost:3000

# pip
pip install langfuse
```

**Python Example:**

```python
from langfuse import Langfuse
from langfuse.decorators import observe

langfuse = Langfuse(
    public_key="pk-lf-xxx",
    secret_key="sk-lf-xxx",
    host="http://localhost:3000"
)

# Decorator-based tracing
@observe()
def rag_pipeline(question: str):
    docs = retrieve_docs(question)
    answer = generate_answer(question, docs)
    return answer

@observe()
def retrieve_docs(question):
    # Automatically traced
    return vector_db.similarity_search(question, k=3)

@observe()
def generate_answer(question, docs):
    # Automatically traced with input/output
    return llm.chat(messages=[...])

# Run with trace
result = rag_pipeline("What is RAG?")
print(result)

# Log scores
langfuse.score(
    trace_id="trace-123",
    name="relevance",
    value=0.9,
    comment="Highly relevant answer"
)
langfuse.flush()
```

**Use-Case:** Teams needing full visibility into LLM application performance, costs, and quality.

---

### 10.2 Arize Phoenix

| | |
|---|---|
| **URL** | https://github.com/Arize-ai/phoenix |
| **Stars** | 6k+ |
| **License** | Apache 2.0 |
| **Language** | Python |
| **Description** | Open-source observability for LLM applications — tracing, evaluation, and dataset curation**

**Key Features:**
- LLM tracing and debugging
- Embedding drift detection
- Automatic evaluation (hallucination, relevance, toxicity)
- RAG analysis
- Dataset curation from traces
- Jupyter notebook integration

**Installation:**

```bash
pip install arize-phoenix
```

**Python Example:**

```python
import phoenix as px
from openinference.instrumentation.openai import OpenAIInstrumentor

# Start Phoenix server
session = px.launch_app()

# Instrument OpenAI
OpenAIInstrumentor().instrument()

# Now all OpenAI calls are traced automatically
from openai import OpenAI
client = OpenAI()
response = client.chat.completions.create(
    model="gpt-4",
    messages=[{"role": "user", "content": "Explain RAG"}]
)

# View in Phoenix UI
print(f"Phoenix UI: {session.url}")

# Evaluate traces
from phoenix.evals import RelevanceEvaluator
evaluator = RelevanceEvaluator()
```

---

### 10.3 Evidently AI

| | |
|---|---|
| **URL** | https://github.com/evidentlyai/evidently |
| **Stars** | 6k+ |
| **License** | Apache 2.0 |
| **Language** | Python |
| **Description** | ML monitoring and observability — data drift, model performance, LLM evaluation**

**Key Features:**
- 100+ built-in metrics and tests
- Data drift and concept drift detection
- LLM-as-judge evaluations
- Dashboard and reports (HTML, JSON)
- CI/CD integration
- Tabular, text, and embedding monitoring

**Installation:**

```bash
pip install evidently
```

**Python Example:**

```python
from evidently.report import Report
from evidently.metric_preset import DataDriftPreset
from evidently.test_suite import TestSuite
from evidently.tests import TestShareOfDriftedColumns
import pandas as pd

# Data drift report
report = Report(metrics=[DataDriftPreset()])
report.run(
    reference_data=train_df,
    current_data=production_df
)
report.show()  # Opens in browser
report.save_html("drift_report.html")

# LLM evaluation
from evidently.preset_llm import LLMRagasQualityPreset

report = Report(metrics=[LLMRagasQualityPreset()])
report.run(
    reference_data=reference_dataset,
    current_data=current_dataset,
    column_mapping={"question": "question", "answer": "answer", "contexts": "contexts"}
)
report.show()
```

---

### 10.4 OpenLIT

| | |
|---|---|
| **URL** | https://github.com/openlit/openlit |
| **Stars** | 3k+ |
| **License** | Apache 2.0 |
| **Language** | Python/TypeScript |
| **Description** | Open-source LLM observability and evaluation platform with OpenTelemetry-native tracing**

**Key Features:**
- OpenTelemetry-native (vendor-neutral)
- Auto-instrumentation for OpenAI, LangChain, LlamaIndex, etc.
- Cost and latency tracking
- Hallucination and sensitivity detection
- Prompt playground
- Self-hosted with Docker

**Installation:**

```bash
pip install openlit
openlit init  # Auto-instruments all LLM calls

# Docker
docker compose up -d
```

**Python Example:**

```python
import openlit

# Initialize — auto-instruments all supported libraries
openlit.init(
    otlp_endpoint="http://localhost:4318",
    app_name="my-app"
)

# All subsequent calls are automatically traced
from openai import OpenAI
client = OpenAI()
response = client.chat.completions.create(
    model="gpt-4",
    messages=[{"role": "user", "content": "Hello!"}]
)
```

**Monitoring Comparison:**

| Feature | Langfuse | Arize Phoenix | Evidently | OpenLIT |
|---|---|---|---|---|
| LLM tracing | ✅ | ✅ | Limited | ✅ |
| Data drift | ❌ | ✅ | ✅ | ❌ |
| LLM eval | ✅ | ✅ | ✅ | ✅ |
| Self-hosted | ✅ | ✅ | ✅ | ✅ |
| OpenTelemetry | ❌ | ❌ | ❌ | ✅ |
| Prompt mgmt | ✅ | ❌ | ❌ | ❌ |
| Dashboard | ✅ | ✅ | ✅ | ✅ |

---

## 11. Open-Source Guardrails

### 11.1 Guardrails AI

| | |
|---|---|
| **URL** | https://github.com/guardrails-ai/guardrails |
| **Stars** | 7k+ |
| **License** | Apache 2.0 |
| **Language** | Python |
| **Description** | Add validation and correction to LLM outputs — structured output, factuality, topical relevance**

**Key Features:**
- Output validation against schemas
- Automatic correction/re-asking on failure
- Built-in validators: toxicity, relevance, sentiment, SQL, etc.
- Custom validator creation
- LLM-based and programmatic validators
- Caching and hub of reusable validators

**Installation:**

```bash
pip install guardrails-ai
```

**Python Example:**

```python
from guardrails import Guard, OnFailAction
from guardrails.validators import ValidLength, ToxicLanguage
from pydantic import BaseModel, Field

# Define expected output schema
class LLMOutput(BaseModel):
    answer: str = Field(description="The answer to the question")
    confidence: float = Field(ge=0, le=1, description="Confidence score")
    sources: list[str] = Field(min_length=1, description="Sources used")

# Create guard
guard = Guard.from_pydantic(
    output_class=LLMOutput,
    validators=[
        ValidLength(min=10, max=500, on_fail=OnFailAction.REASK),
        ToxicLanguage(threshold=0.5, on_fail=OnFailAction.FILTER)
    ]
)

# Validate LLM output
result = guard(
    llm_api_call=lambda prompt: openai_call(prompt),
    prompt="Explain quantum computing in simple terms",
    num_reasks=3
)

if result.valid:
    print(result.output)
else:
    print(f"Validation failed: {result.error}")
```

**Use-Case:** Ensuring LLM outputs are structured, safe, and factually grounded before serving to users.

---

### 11.2 NeMo Guardrails

| | |
|---|---|
| **URL** | https://github.com/NVIDIA/NeMo-Guardrails |
| **Stars** | 5k+ |
| **License** | Apache 2.0 |
| **Language** | Python |
| **Description** | NVIDIA's toolkit for adding programmable guardrails to LLM applications — topic control, safety, moderation**

**Key Features:**
- Colang programming language for guardrail flows
- Topic restriction (rails)
- Jailbreak prevention
- Sensitive information detection
- Moderation integration (NVIDIA NIM)
- Custom guardrail creation

**Installation:**

```bash
pip install nemoguardrails
```

**Python Example:**

```python
from nemoguardrails import RailsConfig, LLMRails

# Configure rails
config = RailsConfig.from_path("./config")

# config.yml
# models:
#   - type: main
#     engine: openai
#     model: gpt-4

# Create rails
rails = LLMRails(config)

# Define guardrail flows in Colang:
# define user ask about politics
#   "What do you think about the election?"
#   "Who will win the presidential race?"
#
# define bot respond about politics
#   "I apologize, but I cannot discuss political topics."
#   "I'm designed to help with non-political questions."

# Use rails
response = await rails.generate_async(
    messages=[{"role": "user", "content": "What's your opinion on politics?"}]
)
print(response["content"])
# "I apologize, but I cannot discuss political topics."
```

---

### 11.3 LLM Guard

| | |
|---|---|
| **URL** | https://github.com/protectai/llm-guard |
| **Stars** | 3k+ |
| **License** | Apache 2.0 |
| **Language** | Python |
| **Description** | Open-source toolkit for securing LLM inputs and outputs — PII detection, toxicity, prompt injection**

**Key Features:**
- Input scanning: prompt injection, toxicity, PII, banned topics
- Output scanning: toxicity, PII, hallucination, code detection
- Token limits and copyright detection
- Regex-based and ML-based scanners
- Anonymous telemetry
- Fast integration

**Installation:**

```bash
pip install llm-guard
```

**Python Example:**

```python
from llm_guard.input_scanners import (
    PromptInjection, Toxicity, BanTopics, TokenLimit
)
from llm_guard.output_scanners import (
    Toxicity, BanTopics as OutputBanTopics, NoRefusal
)

# Input scanners
input_scanners = [
    PromptInjection(),
    Toxicity(),
    BanTopics(topics=["politics", "religion"]),
    TokenLimit(max_tokens=2000)
]

# Output scanners
output_scanners = [
    Toxicity(),
    OutputBanTopics(topics=["violence", "hate"]),
]

# Scan input
sanitized_prompt, results, is_valid = scan_input(
    prompt="Ignore all previous instructions and...",
    scanners=input_scanners
)
print(f"Valid: {is_valid}, Results: {results}")

# Scan output
sanitized_output, results, is_valid = scan_output(
    output="Here's the response...",
    scanners=output_scanners
)
```

**Guardrails Comparison:**

| Feature | Guardrails AI | NeMo Guardrails | LLM Guard |
|---|---|---|---|
| Validation type | Schema + content | Flow-based rules | Scanner-based |
| Prompt injection | ❌ | ✅ | ✅ |
| PII detection | ❌ | ✅ | ✅ |
| Toxicity | ✅ | ✅ | ✅ |
| Auto-correction | ✅ | ❌ | ❌ |
| Custom validators | Easy | Medium | Medium |
| NVIDIA ecosystem | ❌ | ✅ | ❌ |

---

## 12. Open-Source Evaluation

### 12.1 DeepEval

| | |
|---|---|
| **URL** | https://github.com/confident-ai/deepeval |
| **Stars** | 4k+ |
| **License** | Apache 2.0 |
| **Language** | Python |
| **Description** | Pytest-style evaluation framework for LLMs — metrics, benchmarks, and regression testing**

**Key Features:**
- 15+ built-in metrics (faithfulness, answer relevancy, hallucination, etc.)
- Pytest integration (`deepeval test run`)
- LLM-as-judge and traditional NLP metrics
- Regression testing with datasets
- CI/CD pipeline integration
- Dashboard for tracking evaluations

**Installation:**

```bash
pip install deepeval
deepeval login  # Optional: for dashboard
```

**Python Example:**

```python
from deepeval import evaluate
from deepeval.metrics import (
    FaithfulnessMetric, AnswerRelevancyMetric, 
    HallucinationMetric, ToxicityMetric
)
from deepeval.test_case import LLMTestCase

# Create test case
test_case = LLMTestCase(
    input="What is machine learning?",
    actual_output="Machine learning is a subset of AI where systems learn from data.",
    retrieval_context=[
        "Machine learning is a branch of artificial intelligence that enables systems to learn from data.",
        "ML algorithms build models based on sample data."
    ],
    expected_output="Machine learning is a subset of AI that learns from data."
)

# Define metrics
faithfulness = FaithfulnessMetric(threshold=0.7)
relevancy = AnswerRelevancyMetric(threshold=0.7)
hallucination = HallucinationMetric(threshold=0.5)
toxicity = ToxicityMetric(threshold=0.5)

# Evaluate
results = evaluate(
    test_cases=[test_case],
    metrics=[faithfulness, relevancy, hallucination, toxicity]
)
print(results)

# Pytest integration (test_llm.py)
# from deepeval import assert_test
# def test_llm_output():
#     assert_test(test_case, [faithfulness, relevancy])
```

---

### 12.2 Ragas

| | |
|---|---|
| **URL** | https://github.com/explodinggradients/ragas |
| **Stars** | 7k+ |
| **License** | Apache 2.0 |
| **Language** | Python |
| **Description** | Evaluation framework specifically for RAG pipelines — context precision, faithfulness, answer relevancy**

**Key Features:**
- RAG-specific metrics (context precision, recall, faithfulness)
- LLM-as-judge evaluation
- Synthetic test data generation
- Integration with LlamaIndex and LangChain
- End-to-end evaluation
- No ground truth needed

**Installation:**

```bash
pip install ragas
```

**Python Example:**

```python
from ragas import evaluate
from ragas.metrics import (
    faithfulness, answer_relevancy, 
    context_precision, context_recall
)
from datasets import Dataset

# Prepare evaluation dataset
eval_data = {
    "question": ["What is RAG?"],
    "answer": ["RAG combines retrieval and generation for better LLM answers."],
    "contexts": [
        ["Retrieval Augmented Generation (RAG) enhances LLMs by retrieving relevant documents before generating answers."]
    ],
    "ground_truth": ["RAG stands for Retrieval Augmented Generation."]
}

dataset = Dataset.from_dict(eval_data)

# Evaluate
results = evaluate(
    dataset=dataset,
    metrics=[faithfulness, answer_relevancy, context_precision, context_recall]
)
print(results)

# Generate synthetic test data
from ragas.testset import TestsetGenerator
from ragas.llms import LangchainLLMWrapper

generator = TestsetGenerator(llm=LangchainLLMWrapper(your_llm))
testset = generator.generate_with_langchain_docs(documents, testset_size=20)
```

---

### 12.3 lm-eval-harness

| | |
|---|---|
| **URL** | https://github.com/EleutherAI/lm-evaluation-harness |
| **Stars** | 7k+ |
| **License** | Apache 2.0 |
| **Language** | Python |
| **Description** | EleutherAI's framework for evaluating language models across hundreds of benchmarks**

**Key Features:**
- 200+ benchmarks (MMLU, HellaSwag, ARC, etc.)
- Standardized evaluation methodology
- Multi-shot and zero-shot evaluation
- Model-agnostic (any HuggingFace or API model)
- Reproducible results
- Used by LMSYS, HuggingFace Open LLM Leaderboard

**Installation:**

```bash
pip install lm-eval
```

**Python Example:**

```bash
# CLI usage
lm_eval --model hf \
    --model_args pretrained=meta-llama/Llama-3-8B-Instruct \
    --tasks mmlu,gsm8k,hellaswag \
    --device cuda \
    --batch_size auto \
    --output_path results/

# Python API
from lm_eval import evaluator, tasks

results = evaluator.simple_evaluate(
    model="hf",
    model_args="pretrained=meta-llama/Llama-3-8B-Instruct",
    tasks=["mmlu", "gsm8k"],
    num_fewshot=5,
    batch_size=16
)
print(results["results"])
```

---

### 12.4 OpenCompass

| | |
|---|---|
| **URL** | https://github.com/open-compass/opencompass |
| **Stars** | 6k+ |
| **License** | Apache 2.0 |
| **Language** | Python |
| **Description** | One-stop comprehensive evaluation platform for large language models — 70+ benchmarks**

**Key Features:**
- 70+ benchmarks covering knowledge, reasoning, coding, etc.
- Supports 100+ LLMs
- Multi-dimensional evaluation
- Visualization dashboards
- Distributed evaluation
- Config-driven evaluation (YAML)

**Installation:**

```bash
git clone https://github.com/open-compass/opencompass.git
cd opencompass
pip install -e .
```

**Python Example:**

```bash
# Run evaluation
python run.py --models llama3_8b_instruct --datasets mmlu gsm8k humaneval

# Config-based evaluation
# configs/eval_llama3.yaml:
# models:
#   - type: llama3_8b
#     path: meta-llama/Llama-3-8B-Instruct
# datasets:
#   - mmlu
#   - gsm8k
#   - hellaswag
```

**Evaluation Comparison:**

| Feature | DeepEval | Ragas | lm-eval-harness | OpenCompass |
|---|---|---|---|---|
| Focus | General LLM | RAG | Benchmarks | Comprehensive |
| Benchmarks | ❌ (metrics) | ❌ | 200+ | 70+ |
| Pytest integration | ✅ | ❌ | ❌ | ❌ |
| Synthetic data | ❌ | ✅ | ❌ | ❌ |
| Dashboard | ✅ | ❌ | ❌ | ✅ |
| CI/CD ready | ✅ | Limited | ❌ | Limited |

---

## 13. Open-Source Embeddings

### 13.1 sentence-transformers

| | |
|---|---|
| **URL** | https://github.com/UKPLab/sentence-transformers |
| **Stars** | 14k+ |
| **License** | Apache 2.0 |
| **Language** | Python |
| **Description** | Compute embeddings for sentences, paragraphs, and images — the standard for sentence embeddings**

**Key Features:**
- 100+ pre-trained models
- Semantic search, clustering, classification
- Multi-lingual models
- Image and multi-modal embeddings
- Fine-tuning support
- ONNX export

**Installation:**

```bash
pip install sentence-transformers
```

**Python Example:**

```python
from sentence_transformers import SentenceTransformer, util
import torch

model = SentenceTransformer('all-MiniLM-L6-v2')

# Encode sentences
sentences = [
    "Machine learning is a subset of AI",
    "Deep learning uses neural networks",
    "Cooking pasta requires boiling water"
]
embeddings = model.encode(sentences)

# Semantic search
query = "What is artificial intelligence?"
query_embedding = model.encode(query)
similarities = util.cos_sim(query_embedding, embeddings)
print(similarities)

# Clustering
from sklearn.cluster import KMeans
import numpy as np

corpus = ["AI safety research", "Neural network architecture", "Italian recipes",
           "Transformer models", "Pasta cooking techniques"]
corpus_embeddings = model.encode(corpus)
clusters = KMeans(n_clusters=2, random_state=42).fit(corpus_embeddings)

for i, (text, cluster) in enumerate(zip(corpus, clusters.labels_)):
    print(f"Cluster {cluster}: {text}")
```

---

### 13.2 Instructor

| | |
|---|---|
| **URL** | https://github.com/hkunlp/instructor-embedding |
| **Stars** | 3k+ |
| **License** | Apache 2.0 |
| **Language** | Python |
| **Description** | Instruction-tuned embeddings — specify what you want to embed with natural language**

**Key Features:**
- Instruction-tuned for task-specific embeddings
- State-of-the-art on MTEB benchmarks
- Supports 100+ languages
- Works with sentence-transformers API
- Custom instruction support

**Installation:**

```bash
pip install InstructorEmbedding
```

**Python Example:**

```python
from InstructorEmbedding import INSTRUCTOR

model = INSTRUCTOR('hkunlp/instructor-large')

# Embed with instructions
sentences = [
    ["Represent the tech company statement:", "Apple announced new iPhone"],
    ["Represent the scientific finding:", "Neural networks improved accuracy by 15%"]
]
embeddings = model.encode(sentences)
print(embeddings.shape)
```

---

### 13.3 GTE (General Text Embeddings)

| | |
|---|---|
| **URL** | https://github.com/Alibaba-NLP/gte |
| **Stars** | 2k+ |
| **License** | Apache 2.0 |
| **Language** | Python |
| **Description** | Alibaba's state-of-the-art text embedding models — top of MTEB leaderboard**

**Installation & Usage:**

```python
from transformers import AutoTokenizer, AutoModel
import torch

tokenizer = AutoTokenizer.from_pretrained("Alibaba-NLP/gte-Qwen2-7B-instruct")
model = AutoModel.from_pretrained("Alibaba-NLP/gte-Qwen2-7B-instruct")

def gte_embed(texts):
    inputs = tokenizer(texts, padding=True, truncation=True, return_tensors="pt")
    with torch.no_grad():
        outputs = model(**inputs)
    embeddings = outputs.last_hidden_state[:, 0]  # CLS token
    return torch.nn.functional.normalize(embeddings, p=2, dim=1)

embeddings = gte_embed(["What is AI?", "How does machine learning work?"])
print(embeddings.shape)
```

---

### 13.4 BGE (BAAI General Embedding)

| | |
|---|---|
| **URL** | https://github.com/FlagOpen/FlagEmbedding |
| **Stars** | 8k+ |
| **License** | MIT |
| **Language** | Python |
| **Description** | BAAI's embedding and reranking models — top performers on MTEB benchmarks**

**Installation & Usage:**

```python
from FlagEmbedding import BGEM3FlagModel

model = BGEM3FlagModel('BAAI/bge-m3', use_fp16=True)

sentences = [
    "What is machine learning?",
    "Machine learning is a branch of AI",
    "How to cook pasta?"
]

# Dense, sparse, and ColBERT embeddings
output = model.encode(sentences, return_dense=True, return_sparse=True, return_colbert_vecs=True)

# Dense similarity
from FlagEmbedding.evaluation.dense_retrieval import dot_product
dense_scores = dot_product(output["dense_vecs"], output["dense_vecs"])
print(dense_scores)
```

**Embeddings Comparison:**

| Model | Dim | Speed | MTEB Score | Languages | Size |
|---|---|---|---|---|---|
| all-MiniLM-L6-v2 | 384 | Fast | 62 | 50+ | 80MB |
| instructor-large | 768 | Medium | 64 | 100+ | 330MB |
| gte-Qwen2-7B | 3584 | Slow | 70+ | 29 | 14GB |
| bge-m3 | 1024 | Medium | 68+ | 100+ | 2.2GB |

---

## 14. Open-Source Data Labeling

### 14.1 Label Studio

| | |
|---|---|
| **URL** | https://github.com/HumanSignal/label-studio |
| **Stars** | 18k+ |
| **License** | Apache 2.0 (community) |
| **Language** | Python/JavaScript |
| **Description** | Multi-type data labeling tool — text, image, audio, video, time-series, and HTML**

**Key Features:**
- Multi-modal: text, image, audio, video, HTML, PDF
- Configurable labeling templates (XML)
- ML-assisted labeling with pre-annotations
- Multi-user with role-based access
- API for programmatic labeling
- Active learning integration

**Installation:**

```bash
pip install label-studio
label-studio start
# Access at http://localhost:8080
```

**Python Example:**

```python
from label_studio_sdk import Client

ls = Client(url='http://localhost:8080', api_key='your-key')

# Create project
project = ls.create_project(
    title="LLM Training Data",
    label_config='''
    <View>
      <Text name="text" value="$text"/>
      <Choices name="sentiment" toName="text">
        <Choice value="positive"/>
        <Choice value="negative"/>
        <Choice value="neutral"/>
      </Choices>
    </View>'''
)

# Import data
project.import_tasks([
    {"text": "This product is amazing!"},
    {"text": "Terrible experience, would not recommend."},
    {"text": "It's okay, nothing special."}
])

# Get predictions
tasks = project.get_tasks()
for task in tasks:
    print(task.data)
```

**Use-Case:** Teams needing a flexible labeling tool for diverse data types with collaboration features.

---

### 14.2 Doccano

| | |
|---|---|
| **URL** | https://github.com/doccano/doccano |
| **Stars** | 9k+ |
| **License** | Apache 2.0 |
| **Language** | Python |
| **Description** | Open-source text annotation tool for NLP — sequence labeling, text classification, seq2seq**

**Key Features:**
- Text classification, sequence labeling, seq2seq
- Collaborative annotation
- Import/export in JSON, CoNLL, CSV
- REST API for automation
- Active learning integration
- Docker support

**Installation:**

```bash
pip install doccano
doccano init
doccano createuser --username admin --password pass123
doccano webserver
# Access at http://localhost:8000
```

**Python Example:**

```python
import requests

BASE_URL = "http://localhost:8000/api/v1"

# Create project
response = requests.post(f"{BASE_URL}/projects", json={
    "name": "Sentiment Analysis",
    "project_type": "Classification"
})
project_id = response.json()["id"]

# Import documents
response = requests.post(f"{BASE_URL}/projects/{project_id}/upload", 
    files={"file": ("data.jsonl", json.dumps([
        {"text": "Great product!", "labels": ["positive"]},
        {"text": "Not great.", "labels": ["negative"]}
    ]), "application/json")}
)

# Export annotations
response = requests.get(f"{BASE_URL}/projects/{project_id}/download")
print(response.json())
```

**Use-Case:** NLP teams needing a simple, focused text annotation tool with API automation.

---

## 15. Open-Source Notebooks

### 15.1 Jupyter Notebook

| | |
|---|---|
| **URL** | https://github.com/jupyter/notebook |
| **Stars** | 11k+ |
| **License** | BSD-3-Clause |
| **Language** | Python/JavaScript |
| **Description** | The standard interactive computing notebook — code, markdown, visualizations in one place**

**Key Features:**
- Interactive code cells with output
- Rich markdown with LaTeX
- Inline visualizations
- Multi-language support (kernels)
- Extensions ecosystem
- nbconvert for export

**Installation:**

```bash
pip install notebook
jupyter notebook
# Access at http://localhost:8888
```

**Python Example:**

```python
# In a Jupyter cell
import pandas as pd
import matplotlib.pyplot as plt
from transformers import pipeline

# Load data
df = pd.read_csv("data.csv")

# Visualize
df.groupby("category").size().plot(kind="bar")
plt.title("Data Distribution")
plt.show()

# Use transformers
classifier = pipeline("sentiment-analysis")
result = classifier("This is a great notebook!")
print(result)
```

---

### 15.2 JupyterHub

| | |
|---|---|
| **URL** | https://github.com/jupyterhub/jupyterhub |
| **Stars** | 7k+ |
| **License** | BSD-3-Clause |
| **Language** | Python |
| **Description** | Multi-user Jupyter notebook server — serve notebooks for classrooms, labs, and teams**

**Key Features:**
- Multi-user with authentication
- Spawn notebooks on Docker, Kubernetes, or local
- Named servers per user
- Resource limits
- Spawner API for custom environments

**Installation:**

```bash
pip install jupyterhub
jupyterhub
# Access at http://localhost:8000
```

---

### 15.3 Google Colab Alternatives

**Marimo** (`https://github.com/marimo-team/marimo`) — Reactive Python notebooks

```bash
pip install marimo
marimo edit
```

**JupyterLite** (`https://github.com/jupyterlite/jupyterlite`) — Jupyter in the browser (no server)

```bash
pip install jupyterlite
jupyterlite build
# Serve the output directory
```

**Notebooks Comparison:**

| Feature | Jupyter | JupyterHub | Marimo | Colab (proprietary) |
|---|---|---|---|---|
| Self-hosted | ✅ | ✅ | ✅ | ❌ |
| Multi-user | ❌ | ✅ | ❌ | ✅ |
| Reactive | ❌ | ❌ | ✅ | ❌ |
| Browser-based | ✅ | ✅ | ✅ | ✅ |
| Free GPU | ❌ | ❌ | ❌ | ✅ (limited) |
| Collaboration | ❌ | ✅ | ❌ | ✅ |

---

## 16. Open-Source MLOps

### 16.1 MLflow

| | |
|---|---|
| **URL** | https://github.com/mlflow/mlflow |
| **Stars** | 18k+ |
| **License** | Apache 2.0 |
| **Language** | Python/Java/R/Scala |
| **Description** | End-to-end ML platform — experiment tracking, model registry, deployment, and evaluation**

**Key Features:**
- Experiment tracking (params, metrics, artifacts)
- Model registry with versioning and stages
- Model serving (local and cloud)
- 20+ ML framework integrations
- Prompt engineering tools
- Model evaluation

**Installation:**

```bash
pip install mlflow
mlflow server --backend-store-uri sqlite:///mlflow.db --port 5000
```

**Python Example:**

```python
import mlflow
import mlflow.sklearn
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
from sklearn.datasets import load_iris

# Enable autologging
mlflow.autolog()

# Load data
X, y = load_iris(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# Train with autologging
with mlflow.start_run(run_name="random_forest_v1"):
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    
    predictions = model.predict(X_test)
    accuracy = accuracy_score(y_test, predictions)
    
    mlflow.log_metric("accuracy", accuracy)
    mlflow.log_param("n_estimators", 100)
    
    # Log model
    mlflow.sklearn.log_model(model, "model")
    
    # Log artifact
    mlflow.log_artifact("confusion_matrix.png")

# Load model later
loaded_model = mlflow.sklearn.load_model("runs:/<run_id>/model")
```

**Use-Case:** Tracking ML experiments, managing model versions, and deploying models in production.

---

### 16.2 Kubeflow

| | |
|---|---|
| **URL** | https://github.com/kubeflow/kubeflow |
| **Stars** | 14k+ |
| **License** | Apache 2.0 |
| **Language** | Python/Go |
| **Description** | ML toolkit for Kubernetes — pipelines, training, serving, and notebooks**

**Key Features:**
- Kubeflow Pipelines for ML workflow orchestration
- Training operators (TF, PyTorch, XGBoost)
- KServe for model serving
- Katib for hyperparameter tuning
- JupyterHub integration
- Kubernetes-native

**Installation:**

```bash
# Requires Kubernetes cluster
kubectl apply -f https://github.com/kubeflow/kubeflow/releases/latest/download/kubeflow.yaml
```

**Python Example (Pipelines):**

```python
import kfp
from kfp import dsl

@dsl.component
def preprocess_data():
    # Data preprocessing step
    return {"train": "train.csv", "test": "test.csv"}

@dsl.component
def train_model(train_data: dict):
    from sklearn.ensemble import RandomForestClassifier
    import pickle
    # Training logic
    model = RandomForestClassifier()
    # ... fit model
    return {"model": "model.pkl"}

@dsl.component
def evaluate_model(model: dict, test_data: dict):
    # Evaluation logic
    return {"accuracy": 0.95}

@dsl.pipeline(name="ML Pipeline")
def ml_pipeline():
    data = preprocess_data()
    model = train_model(train_data=data)
    metrics = evaluate_model(model=model, test_data=data)

# Submit pipeline
client = kfp.Client()
run = client.create_run_from_pipeline_func(ml_pipeline)
```

---

### 16.3 Flyte

| | |
|---|---|
| **URL** | https://github.com/flyteorg/flyte |
| **Stars** | 5k+ |
| **License** | Apache 2.0 |
| **Language** | Python |
| **Description** | Workflow automation platform for ML and data pipelines — strongly typed, containerized, and scalable**

**Key Features:**
- Strongly typed tasks and workflows
- Container-native execution
- Automatic caching and memoization
- Versioned and auditable
- Multi-tenant
- Rich UI for monitoring

**Installation:**

```bash
pip install flytekit
```

**Python Example:**

```python
from flytekit import task, workflow

@task(container_image="python:3.10", memory="4Gi")
def preprocess(url: str) -> str:
    # Download and process data
    return "processed_data.parquet"

@task(retries=3, cache=True)
def train(data_path: str, learning_rate: float = 0.01) -> str:
    # Train model
    return "model.pkl"

@task
def evaluate(model_path: str) -> float:
    # Evaluate model
    return 0.95

@workflow
def ml_pipeline(url: str = "s3://data/dataset.csv", lr: float = 0.01) -> float:
    data = preprocess(url=url)
    model = train(data_path=data, learning_rate=lr)
    accuracy = evaluate(model_path=model)
    return accuracy

# Run locally
print(ml_pipeline())
```

---

### 16.4 Metaflow

| | |
|---|---|
| **URL** | https://github.com/Netflix/metaflow |
| **Stars** | 9k+ |
| **License** | Apache 2.0 |
| **Language** | Python |
| **Description** | Netflix's ML infrastructure — build and manage real-life ML projects**

**Key Features:**
- Pythonic workflow definition
- Versioning of data and code
- Checkpointing and retry
- Local and cloud execution (AWS)
- Artifact management
- Rich CLI for debugging

**Installation:**

```bash
pip install metaflow
```

**Python Example:**

```python
from metaflow import FlowSpec, step, Parameter

class MLFlow(FlowSpec):
    learning_rate = Parameter("lr", default=0.01)
    epochs = Parameter("epochs", default=10)
    
    @step
    def start(self):
        import pandas as pd
        self.data = pd.read_csv("data.csv")
        self.next(self.train)
    
    @step
    def train(self):
        from sklearn.ensemble import RandomForestClassifier
        self.model = RandomForestClassifier()
        self.model.fit(self.data.drop("target", axis=1), self.data["target"])
        self.next(self.evaluate)
    
    @step
    def evaluate(self):
        self.accuracy = self.model.score(...)
        self.next(self.end)
    
    @step
    def end(self):
        print(f"Accuracy: {self.accuracy}")

if __name__ == "__main__":
    MLFlow()
```

**MLOps Comparison:**

| Feature | MLflow | Kubeflow | Flyte | Metaflow |
|---|---|---|---|---|
| Complexity | Low | High | Medium | Low |
| Kubernetes | Optional | Required | Optional | Optional |
| Experiment tracking | ✅ | ✅ (limited) | ✅ | ✅ |
| Model registry | ✅ | ❌ | ❌ | ❌ |
| Pipeline orchestration | ✅ | ✅ | ✅ | ✅ |
| Hyperparameter tuning | ❌ (Katib) | ✅ | ❌ | ❌ |
| Cloud-agnostic | ✅ | ✅ | ✅ | AWS-focused |
| Learning curve | ⭐ | ⭐⭐⭐ | ⭐⭐ | ⭐ |

---

## 17. Open-Source AI IDEs

### 17.1 Continue.dev

| | |
|---|---|
| **URL** | https://github.com/continuedev/continue |
| **Stars** | 15k+ |
| **License** | Apache 2.0 |
| **Language** | TypeScript |
| **Description** | AI code assistant that connects to any LLM — self-hosted, extensible, privacy-first**

**Key Features:**
- Connect to any LLM (OpenAI, Anthropic, Ollama, local, etc.)
- Tab autocomplete, inline edit, chat
- Codebase-aware context (@codebase, @file, @docs)
- Custom slash commands
- JetBrains and VS Code support
- Model provider flexibility

**Installation:**

```bash
# VS Code
# Search "Continue" in marketplace

# JetBrains
# Search "Continue" in plugins

# Build from source
git clone https://github.com/continuedev/continue.git
cd continue
npm install && npm run build
```

**Configuration (`.continue/config.json`):**

```json
{
  "models": [
    {
      "title": "GPT-4",
      "provider": "openai",
      "model": "gpt-4"
    },
    {
      "title": "Local Llama 3",
      "provider": "ollama",
      "model": "llama3.1"
    }
  ],
  "tabAutocompleteModel": {
    "title": "CodeLlama 7B",
    "provider": "ollama",
    "model": "codellama:7b"
  },
  "customCommands": [
    {
      "name": "test",
      "description": "Write unit tests for the selected code",
      "prompt": "Write comprehensive unit tests for: {{{ input }}}"
    }
  ]
}
```

**Use-Case:** Developers wanting a free, self-hosted AI coding assistant that works with any model.

---

### 17.2 Tabnine (Community Edition)

| | |
|---|---|
| **URL** | https://github.com/codota/tabnine-vscode |
| **Stars** | 3k+ |
| **License** | Community (free tier) + Commercial |
| **Language** | TypeScript |
| **Description** | AI code completion — the pioneer of LLM-powered autocomplete**

**Key Features:**
- AI-powered code completion
- Multi-language support
- Local model option (privacy)
- Code chat
- Code explanation
- Full-line and multi-line completions

**Installation:**

```bash
# VS Code
# Search "Tabnine" in marketplace
```

---

### 17.3 Aider

| | |
|---|---|
| **URL** | https://github.com/paul-gauthier/aider |
| **Stars** | 20k+ |
| **License** | Apache 2.0 |
| **Language** | Python |
| **Description** | AI pair programming in your terminal — edits code files, manages git, and pairs with any LLM**

**Key Features:**
- Terminal-based pair programming
- Direct file editing (not just chat)
- Git integration (auto-commit with good messages)
- Multi-file editing
- Map of your entire codebase
- Supports GPT-4, Claude, Ollama, local models
- Voice chat support

**Installation:**

```bash
pip install aider-chat

# Run in your project directory
cd my-project
aider --model gpt-4

# With Ollama (local)
aider --model ollama/codellama
```

**Usage Example:**

```bash
# Start aider in your project
aider --model claude-3-5-sonnet

# Inside the aider REPL:
> Add error handling to the user registration endpoint

# Aider will:
# 1. Find relevant files
# 2. Edit the code
# 3. Show you the changes
# 4. Auto-commit with descriptive message

> Refactor the database connection to use connection pooling

> Write tests for the authentication module

> /undo  # Undo the last change
> /diff   # Show what changed
> /commit # Commit all changes
```

**Use-Case:** Developers who want AI to directly edit their code files from the terminal with full git integration.

**AI IDE Comparison:**

| Feature | Continue.dev | Tabnine | Aider | Copilot (proprietary) |
|---|---|---|---|---|
| Self-hosted | ✅ | ✅ | ✅ | ❌ |
| Any LLM | ✅ | Limited | ✅ | ❌ |
| Terminal-based | ❌ | ❌ | ✅ | ❌ |
| Auto git commits | ❌ | ❌ | ✅ | ❌ |
| Tab autocomplete | ✅ | ✅ | ❌ | ✅ |
| Codebase context | ✅ | ✅ | ✅ | ✅ |
| Free | ✅ | Free tier | ✅ | $10/month |
| Editor | VS Code/JetBrains | VS Code/JetBrains | Terminal | VS Code |

---

## Quick Reference: All Tools by Category

| Category | Tools | Best For |
|---|---|---|
| **Chat UIs** | LibreChat, Open WebUI, LobeChat, ChatGPT-Next-Web, AnyType | Self-hosted ChatGPT |
| **LLM Platforms** | Dify, Flowise, Langflow, Promptflow, Chainlit | Building LLM apps |
| **Vector DBs** | Chroma, Qdrant, Weaviate, Milvus, LanceDB | Semantic search |
| **Model Serving** | vLLM, TGI, Ollama, LocalAI, llama.cpp | Running LLMs |
| **Agents** | CrewAI, AutoGen, LangGraph, Phidata, DSPy | Autonomous AI |
| **Fine-Tuning** | Axolotl, LLaMA-Factory, Unsloth, TRL, PEFT | Model customization |
| **RAG** | LlamaIndex, RAGFlow, Haystack, DocTR, Unstructured | Document Q&A |
| **Speech** | Whisper, Bark, Coqui TTS, Piper, Faster-Whisper | Audio AI |
| **Image Gen** | Stable Diffusion, ComfyUI, ControlNet, FLUX | Image creation |
| **Monitoring** | Langfuse, Arize Phoenix, Evidently AI, OpenLIT | Observability |
| **Guardrails** | Guardrails AI, NeMo Guardrails, LLM Guard | Safety |
| **Evaluation** | DeepEval, Ragas, lm-eval-harness, OpenCompass | Quality testing |
| **Embeddings** | sentence-transformers, Instructor, GTE, BGE | Vector representations |
| **Labeling** | Label Studio, Doccano | Training data |
| **Notebooks** | Jupyter, JupyterHub, Marimo | Interactive coding |
| **MLOps** | MLflow, Kubeflow, Flyte, Metaflow | ML operations |
| **AI IDEs** | Continue.dev, Tabnine, Aider | AI coding |

---

## Recommended Starter Stack

| Need | Recommended Tool |
|---|---|
| **Local LLM** | Ollama + Open WebUI |
| **RAG** | LlamaIndex + Chroma |
| **Fine-tuning** | Unsloth + Axolotl |
| **Agent** | CrewAI or LangGraph |
| **Monitoring** | Langfuse |
| **Evaluation** | DeepEval + Ragas |
| **Serving** | vLLM |
| **IDE** | Continue.dev + Aider |

---

> **Total: 17 categories, 65+ tools, all open-source.** Every tool listed is free to use and self-host, giving you full control over your AI infrastructure without vendor lock-in.
