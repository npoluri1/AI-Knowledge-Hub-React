# 🤖 Multi-Agent AI Research & Report Generator

A production-grade multi-agent system that researches any topic using specialized AI agents and generates professional PDF reports automatically.

## 🏗️ Architecture

```
User Input (Topic)
       │
       ▼
  FastAPI Layer
       │
       ▼
  LangGraph Orchestrator
       │
  ┌────┴────────────────────────────┐
  │                                 │
  ▼                                 ▼
Research Agent              Coordinator Agent
(Tavily Web Search)              │
       │                          │
       ▼                          ▼
Analysis Agent              Quality Review Agent
(Data Processing)           (Fact-Check & Score)
       │
       ▼
Writing Agent
(Report Generation)
       │
       ▼
PDF Report Output
```

## 🛠️ Tech Stack

| Component | Technology |
|-----------|-----------|
| Multi-Agent Orchestration | CrewAI |
| Workflow State Management | LangGraph |
| Web Search | Tavily API |
| LLM | OpenAI GPT-4 / Anthropic Claude |
| Tool Integration | LangChain |
| Knowledge Storage | Pinecone |
| API Layer | FastAPI |
| Chat Interface | Chainlit |
| Agent Tracing | LangSmith |
| Deployment | Docker + AWS EKS |

## 📁 Project Structure

```
multi-agent-research/
├── agents/                  # Agent definitions
│   ├── __init__.py
│   ├── research_agent.py    # Web search & data gathering
│   ├── analysis_agent.py    # Data analysis & synthesis
│   ├── writing_agent.py     # Report writing
│   └── review_agent.py      # Quality review
├── tools/                   # Agent tools
│   ├── __init__.py
│   ├── search_tool.py       # Tavily web search
│   ├── pinecone_tool.py     # Vector store operations
│   └── pdf_tool.py          # PDF generation
├── workflows/               # LangGraph workflows
│   ├── __init__.py
│   └── research_workflow.py # Main orchestration graph
├── api/                     # FastAPI backend
│   ├── __init__.py
│   ├── main.py
│   ├── routes.py
│   └── models.py
├── ui/                      # Chainlit frontend
│   └── app.py
├── config/                  # Configuration
│   ├── settings.py
│   └── prompts.py
├── tests/                   # Test suite
│   ├── test_agents.py
│   ├── test_workflow.py
│   └── test_api.py
├── docker/                  # Container configs
│   ├── Dockerfile
│   └── docker-compose.yml
├── scripts/                 # Utility scripts
│   └── deploy_eks.sh
├── .env.example
├── requirements.txt
└── README.md
```

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone <repo-url>
cd multi-agent-research
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env with your API keys
```

### 3. Run Locally

```bash
# Terminal 1: Start FastAPI backend
uvicorn api.main:app --reload --port 8000

# Terminal 2: Start Chainlit UI
chainlit run ui/app.py --port 8001
```

### 4. Generate a Report

```bash
# Via API
curl -X POST http://localhost:8000/api/research \
  -H "Content-Type: application/json" \
  -d '{"topic": "The impact of AI on healthcare in 2024"}'

# Or visit http://localhost:8001 for the chat interface
```

## 🔑 Required API Keys

- `OPENAI_API_KEY` — GPT-4 for LLM
- `ANTHROPIC_API_KEY` — Claude (optional alternative LLM)
- `TAVILY_API_KEY` — Web search ([get free key](https://tavily.com))
- `PINECONE_API_KEY` — Vector storage
- `PINECONE_ENVIRONMENT` — Your Pinecone environment
- `LANGSMITH_API_KEY` — Agent tracing (optional)

## 🐳 Docker Deployment

```bash
docker-compose up --build
```

## ☁️ AWS EKS Deployment

```bash
chmod +x scripts/deploy_eks.sh
./scripts/deploy_eks.sh
```

## 📊 Agent Roles

| Agent | Role | Tools |
|-------|------|-------|
| **Research Agent** | Gathers information from the web | Tavily Search, Pinecone |
| **Analysis Agent** | Synthesizes and analyzes data | LangChain, Pinecone |
| **Writing Agent** | Produces structured report content | PDF Generator |
| **Review Agent** | Validates quality and accuracy | Fact-checker |

## 📈 Monitoring

- **LangSmith Dashboard**: View agent traces at https://smith.langchain.com
- **API Docs**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health
