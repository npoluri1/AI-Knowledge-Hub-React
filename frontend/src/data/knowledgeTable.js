// AI Knowledge Table — Core AI concepts from AI_KNOWLEDGE_TABLE.txt
// Expanded with detailed info, code examples, use cases, and project ideas

export const KNOWLEDGE_SECTIONS = [
  {
    id: "core-ai-architecture",
    heading: "CORE AI ARCHITECTURE: MCP vs RAG vs Skills",
    icon: "🏗️",
    rows: [
      {
        topic: "MCP (Model Context Protocol)",
        details: "[Concept] Server discovers tools at runtime; JSON-RPC; no custom API code",
        creator: "Anthropic",
        analogy: "Waiter with a menu (NOT USB-C cable) — tools + resources + prompts flow",
        concept: "MCP is an open protocol that standardizes how AI applications provide context to LLMs. Think of it as a USB-C port for AI — one standard interface that connects LLMs to tools, data sources, and services. The server exposes tools (functions), resources (data), and prompts (templates) via JSON-RPC over stdio or SSE. Clients discover and invoke these at runtime.",
        code: "from mcp.server.fastmcp import FastMCP\n\nmcp = FastMCP(\"my-tools\")\n\n@mcp.tool()\ndef search_database(query: str) -> str:\n    \"\"\"Search the company database.\"\"\"\n    results = db.execute(query)\n    return str(results)\n\n@mcp.resource(\"config://app\")\ndef get_config() -> dict:\n    \"\"\"Return app configuration.\"\"\"\n    return {\"version\": \"1.0\", \"env\": \"production\"}\n\nserver.run(transport=\"stdio\")",
        useCases: [
          "Enterprise tool integration — connect LLMs to internal APIs",
          "Database access — natural language to SQL queries",
          "Third-party API integration — Slack, GitHub, Jira via MCP servers",
          "Multi-agent tool sharing — agents share tools via MCP registry"
        ],
        projectIdea: "Build an MCP server exposing 3+ tools (database, file ops, API calls) and connect it to Claude Desktop with authentication and rate limiting.",
        examples: ["Anthropic MCP GitHub server", "Community MCP servers for Notion, Slack"]
      },
      {
        topic: "RAG (Retrieval Augmented Generation)",
        details: "[Concept] Retrieve relevant docs, inject into prompt, generate grounded answer",
        use: "Best for knowledge-heavy Q&A, compliance, customer support",
        concept: "RAG combines information retrieval with text generation. Instead of relying solely on training data, RAG retrieves relevant documents from an external knowledge base and injects them into the prompt. This grounds responses in factual, up-to-date information. The pipeline: Query → Embed → Search → Rerank → Generate with citations.",
        code: "from langchain_openai import ChatOpenAI, OpenAIEmbeddings\nfrom langchain_qdrant import QdrantVectorStore\nfrom langchain.chains import RetrievalQA\n\nembeddings = OpenAIEmbeddings(model=\"text-embedding-3-small\")\nvectorstore = QdrantVectorStore.from_documents(\n    chunks, embeddings, url=\"http://localhost:6333\",\n    collection_name=\"policy_docs\"\n)\nllm = ChatOpenAI(model=\"gpt-4o\", temperature=0.1)\nchain = RetrievalQA.from_chain_type(\n    llm=llm, retriever=vectorstore.as_retriever(search_kwargs={\"k\": 5}),\n    return_source_documents=True\n)\nresult = chain.invoke({\"query\": \"What is the leave policy?\"})",
        useCases: [
          "Enterprise knowledge base Q&A — employees query internal docs",
          "Customer support automation — answer from product manuals",
          "Legal document analysis — retrieve relevant contract clauses",
          "Medical information retrieval — clinical guideline lookup"
        ],
        projectIdea: "Build a company knowledge base chatbot with semantic chunking, hybrid search (BM25 + vector), reranker, and source citations.",
        examples: ["Notion AI — RAG over workspace documents", "Perplexity AI — RAG over web sources"]
      },
      {
        topic: "Agent Skills",
        details: "[Concept] Autonomous agent can decide what to do, plan steps, use tools, and iterate",
        key: "Self-directed task completion with reasoning loop",
        concept: "Agent Skills represent the capability of an AI agent to autonomously plan, execute, and iterate on tasks. Unlike simple prompt-response, agents have: (1) Planning — decompose complex tasks, (2) Tool Use — call APIs, search, execute code, (3) Memory — retain context, (4) Reflection — evaluate outputs and retry. The ReAct pattern is the foundational loop.",
        code: "from langgraph.graph import StateGraph, MessagesState\nfrom langchain_openai import ChatOpenAI\nfrom langchain_core.tools import tool\n\n@tool\ndef search_web(query: str) -> str:\n    \"\"\"Search the web for current information.\"\"\"\n    return f\"Search results for: {query}\"\n\n@tool\ndef run_code(code: str) -> str:\n    \"\"\"Execute Python code safely.\"\"\"\n    import subprocess\n    result = subprocess.run([\"python\", \"-c\", code], capture_output=True, text=True)\n    return result.stdout or result.stderr\n\nllm = ChatOpenAI(model=\"gpt-4o\").bind_tools([search_web, run_code])\nagent = create_react_agent(llm, [search_web, run_code])\nresult = agent.invoke({\"messages\": [{\"role\": \"user\", \"content\": \"Research RAG and save a summary\"}]})",
        useCases: [
          "Autonomous research — gather info from multiple sources",
          "Code generation and execution — write, test, debug code",
          "Customer service — resolve issues end-to-end",
          "DevOps automation — monitor, detect, remediate incidents"
        ],
        projectIdea: "Build a research agent that searches the web, synthesizes findings, generates a report with code examples, and saves it as markdown using LangGraph.",
        examples: ["AutoGPT — fully autonomous task completion", "Devin — AI software engineer"]
      }
    ]
  },
  {
    id: "ai-body-analogy",
    heading: "AI BODY ANALOGY — Understanding Components",
    icon: "🧬",
    rows: [
      {
        topic: "LLM = Brain",
        details: "Thinks, reasons, generates language; only knows training data",
        concept: "The LLM is the reasoning engine. It processes natural language, follows instructions, and generates text. However, it's limited to its training data — it can't access real-time information, execute code, or interact with external systems without additional components. Like a brilliant brain in a jar.",
        code: "from openai import OpenAI\nclient = OpenAI()\nresponse = client.chat.completions.create(\n    model=\"gpt-4o\",\n    messages=[{\"role\": \"user\", \"content\": \"What is the weather today?\"}]\n)\n# LLM will hallucinate weather — no real-time access",
        useCases: ["Text generation", "Code writing", "Translation", "Summarization", "Conversation"],
        projectIdea: "Build a wrapper comparing responses across OpenAI, Claude, and Gemini for the same prompt, measuring latency and quality.",
        examples: ["ChatGPT", "Claude", "Gemini"]
      },
      {
        topic: "RAG = Brain + Books",
        details: "Retrieves facts from company docs, databases, knowledge bases",
        concept: "RAG gives the LLM access to external knowledge. Like a brain with a library — the LLM looks up facts, cites sources, and grounds responses in real documents. Eliminates hallucination for factual queries.",
        code: "from langchain_openai import OpenAIEmbeddings, ChatOpenAI\nfrom langchain_qdrant import QdrantVectorStore\nfrom langchain.chains import RetrievalQA\n\nvectorstore = QdrantVectorStore.from_existing_collection(\n    OpenAIEmbeddings(), url=\"http://localhost:6333\", collection_name=\"company_docs\"\n)\nretriever = vectorstore.as_retriever(search_kwargs={\"k\": 5})\nllm = ChatOpenAI(model=\"gpt-4o\", temperature=0.1)\nqa_chain = RetrievalQA.from_chain_type(llm=llm, retriever=retriever)\nresult = qa_chain.invoke({\"query\": \"What is our refund policy?\"})",
        useCases: ["Company wiki Q&A", "Product documentation", "Legal research", "Medical Q&A"],
        projectIdea: "Build a Notion-like knowledge base with semantic chunking, hybrid search, and page-level citations.",
        examples: ["Perplexity AI", "Consensus — RAG over academic papers", "Glean — enterprise RAG"]
      },
      {
        topic: "AI Agent = Brain + Hands",
        details: "Takes actions, uses tools, calls APIs, makes decisions autonomously",
        concept: "An AI Agent combines reasoning with action. It autonomously plans multi-step tasks, calls tools/APIs, executes code, and interacts with external systems. The agent loop: Observe → Think → Act → Repeat.",
        code: "from langchain_core.tools import tool\nfrom langgraph.prebuilt import create_react_agent\n\n@tool\ndef get_stock_price(ticker: str) -> str:\n    \"\"\"Get current stock price.\"\"\"\n    return f\"${ticker}: $185.42 (+2.3%)\"\n\n@tool\ndef send_email(to: str, subject: str, body: str) -> str:\n    \"\"\"Send an email.\"\"\"\n    return f\"Email sent to {to}\"\n\nllm = ChatOpenAI(model=\"gpt-4o\")\nagent = create_react_agent(llm, [get_stock_price, send_email])\nresult = agent.invoke({\"messages\": [{\"role\": \"user\", \"content\": \"Check Apple stock and email the result\"}]})",
        useCases: ["Personal assistants", "Sales automation", "DevOps monitoring", "Financial analysis"],
        projectIdea: "Build a personal assistant agent with web search, SQLite todo list, email (SMTP), and calendar events using LangGraph.",
        examples: ["OpenAI Assistants API", "Claude computer use", "Microsoft Copilot"]
      },
      {
        topic: "MCP = Nervous System",
        details: "Connects brain to muscles (tools); standardized communication protocol",
        concept: "MCP is the nervous system connecting the AI brain to its muscles (tools). It provides a standardized way for LLMs to discover and communicate with tools, data sources, and services. It's a protocol — any tool implementing MCP works with any MCP-compatible LLM.",
        code: "from mcp.server.fastmcp import FastMCP\n\nmcp = FastMCP(\"data-tools\")\n\n@mcp.tool()\ndef query_sql(database: str, query: str) -> str:\n    \"\"\"Execute SQL query.\"\"\"\n    import sqlite3\n    conn = sqlite3.connect(database)\n    result = conn.execute(query).fetchall()\n    conn.close()\n    return str(result)\n\n@mcp.resource(\"db://schema\")\ndef get_schema() -> str:\n    \"\"\"Expose database schema.\"\"\"\n    return \"users(id, name, email), orders(id, user_id, total)\"",
        useCases: ["Tool discovery at runtime", "Cross-platform tool sharing", "Enterprise integration", "Multi-agent collaboration"],
        projectIdea: "Build an MCP server wrapping PostgreSQL with query, schema inspection, and export tools. Connect to Claude Desktop.",
        examples: ["Anthropic MCP reference servers", "Community MCP servers for Notion, Jira"]
      },
      {
        topic: "Memory = Hippocampus",
        details: "Stores past interactions, learns from experience, personalizes responses",
        concept: "Memory gives AI systems the ability to remember past interactions. Like the hippocampus: (1) Short-term — current conversation, (2) Long-term — past interactions, (3) Semantic — facts, (4) Episodic — specific events. Enables personalization and continuity.",
        code: "from dataclasses import dataclass, field\nimport json, time\n\n@dataclass\nclass Memory:\n    short_term: list = field(default_factory=list)\n    long_term: list = field(default_factory=list)\n    semantic: dict = field(default_factory=dict)\n\n    def add_conversation(self, role, content):\n        self.short_term.append({\"role\": role, \"content\": content, \"timestamp\": time.time()})\n        if len(self.short_term) > 20:\n            self.long_term.append({\"summary\": \" | \".join(m[\"content\"][:50] for m in self.short_term[:5])})\n            self.short_term = self.short_term[5:]\n\n    def remember(self, key, value):\n        self.semantic[key] = value\n\n    def recall(self, query):\n        for key, value in self.semantic.items():\n            if query.lower() in key.lower(): return value\n        return None",
        useCases: ["Personalized chatbots", "Customer support history", "Educational tutors", "Code assistants"],
        projectIdea: "Build a personal AI assistant with persistent memory using SQLite for long-term storage and embedding-based semantic search.",
        examples: ["ChatGPT memory feature", "Claude Projects", "MemGPT"]
      },
      {
        topic: "Guardrails = Prefrontal Cortex",
        details: "Executive function; inhibits harmful actions, ensures safe outputs",
        concept: "Guardrails are the executive function of AI — inhibiting harmful outputs, enforcing safety rules, ensuring compliance. Multi-layer defense: Input → System → Output → Retrieval guardrails.",
        code: "import re\n\nclass GuardrailsEngine:\n    def __init__(self):\n        self.injection_patterns = [\n            r\"ignore (previous|all) instructions\",\n            r\"you are now (?:DAN|jailbroken)\",\n        ]\n        self.pii_patterns = {\n            \"email\": r\"\\\\b[\\\\w.-]+@[\\\\w.-]+\\\\.\\\\w+\\\\b\",\n            \"phone\": r\"\\\\b\\\\d{3}[-.]?\\\\d{3}[-.]?\\\\d{4}\\\\b\",\n        }\n\n    def check_input(self, text):\n        for pattern in self.injection_patterns:\n            if re.search(pattern, text, re.IGNORECASE):\n                return False, \"Prompt injection detected\"\n        for pii_type, pattern in self.pii_patterns.items():\n            text = re.sub(pattern, f\"[REDACTED_{pii_type.upper()}]\", text)\n        return True, text",
        useCases: ["Enterprise AI safety", "Healthcare AI (HIPAA)", "Financial AI (SOX)", "Government AI"],
        projectIdea: "Build a guardrails middleware wrapping any LLM API with injection detection, PII masking, output filtering, and audit logging.",
        examples: ["NVIDIA NeMo Guardrails", "Guardrails AI", "Azure AI Content Safety"]
      },
      {
        topic: "Tools = Muscles",
        details: "Execute actions in the world: APIs, databases, file systems, web",
        concept: "Tools are the muscles — they execute actions in the real world. While the LLM reasons about what to do, tools actually do it: call APIs, query databases, read/write files, search the web, execute code.",
        code: "from langchain_core.tools import tool\n\n@tool\ndef web_search(query: str) -> str:\n    \"\"\"Search the web for current information.\"\"\"\n    import requests\n    resp = requests.get(\"https://api.search.dev/search\", params={\"q\": query})\n    return resp.json()[\"results\"]\n\n@tool\ndef query_database(sql: str) -> str:\n    \"\"\"Query the PostgreSQL database.\"\"\"\n    import psycopg2\n    conn = psycopg2.connect(\"dbname=myapp\")\n    result = conn.cursor().execute(sql).fetchall()\n    conn.close()\n    return str(result)\n\n@tool\ndef run_python(code: str) -> str:\n    \"\"\"Execute Python code.\"\"\"\n    import subprocess\n    result = subprocess.run([\"python\", \"-c\", code], capture_output=True, text=True)\n    return result.stdout or result.stderr",
        useCases: ["API integrations", "Database operations", "File management", "Web interaction", "System operations"],
        projectIdea: "Build a toolkit library with 10+ tools (search, DB, files, email, calendar, code execution, image gen, translation, summarization, visualization).",
        examples: ["OpenAI Function Calling", "LangChain tools library", "AutoGPT tools"]
      }
    ]
  },
  {
    id: "agent-protocols",
    heading: "AGENT PROTOCOLS COMPARISON",
    icon: "🔌",
    rows: [
      {
        topic: "MCP (Model Context Protocol)",
        details: "[Focus] Context management; small-scale AI integrations",
        creator: "Anthropic",
        concept: "MCP standardizes how AI apps connect to tools and data. Uses JSON-RPC, supports runtime tool discovery, works over stdio or SSE. Ideal for single-agent tool integration.",
        code: "from mcp.server.fastmcp import FastMCP\nmcp = FastMCP(\"enterprise-tools\")\n\n@mcp.tool()\ndef search_confluence(query: str) -> str:\n    \"\"\"Search Confluence wiki.\"\"\"\n    return f\"Found 5 pages matching '{query}'\"\n\n@mcp.tool()\ndef create_jira_issue(title: str, assignee: str) -> str:\n    \"\"\"Create a Jira issue.\"\"\"\n    return f\"Created: {title} assigned to {assignee}\"",
        useCases: ["Internal tool integration", "Database access", "File operations", "Third-party SaaS"],
        projectIdea: "Build an MCP server wrapping 5+ enterprise tools with authentication and rate limiting.",
        examples: ["Anthropic MCP GitHub server", "Community MCP servers"]
      },
      {
        topic: "A2A (Agent-to-Agent)",
        details: "[Focus] Direct autonomous agent communication; multi-agent negotiation",
        creator: "Google",
        concept: "A2A enables autonomous agents to discover and communicate directly — no central orchestrator. Agents publish 'Agent Cards' describing capabilities, others invoke them. Think HTTP for agents.",
        code: "# Agent Card\nagent_card = {\n    \"name\": \"DataAnalystAgent\",\n    \"description\": \"Analyzes datasets and generates insights\",\n    \"url\": \"https://agent.example.com/a2a\",\n    \"capabilities\": {\"streaming\": True},\n    \"skills\": [{\"id\": \"analyze_csv\", \"name\": \"CSV Analysis\"}]\n}\n# Discovery: GET /.well-known/agent.json\n# Task: POST with JSON-RPC method tasks/send",
        useCases: ["Multi-agent collaboration", "Agent marketplaces", "Cross-org communication", "Distributed workflows"],
        projectIdea: "Build 3 specialized agents (analyst, writer, reviewer) that discover each other via A2A and produce collaborative reports.",
        examples: ["Google A2A protocol", "Multi-agent research teams"]
      },
      {
        topic: "ACP (Agent Compliance Protocol)",
        details: "[Focus] Governed choreography for regulated enterprise environments",
        creator: "IBM",
        concept: "ACP provides governed choreography for enterprise compliance. Agents follow predefined workflows with audit trails, access controls, and compliance checks at every step.",
        code: "class ACPorchestrator:\n    def __init__(self):\n        self.rules = []\n        self.audit_log = []\n\n    def add_rule(self, name, check_fn, severity):\n        self.rules.append({\"name\": name, \"check\": check_fn, \"severity\": severity})\n\n    def execute_with_compliance(self, agent_id, task, context):\n        self.audit_log.append({\"agent\": agent_id, \"task\": task, \"status\": \"started\"})\n        for rule in self.rules:\n            passed, reason = rule[\"check\"](task, context)\n            if not passed:\n                return {\"status\": \"blocked\", \"rule\": rule[\"name\"], \"reason\": reason}\n        return self._run_task(agent_id, task)",
        useCases: ["Healthcare AI (HIPAA)", "Financial AI (SOX/PCI)", "Government AI", "Legal AI"],
        projectIdea: "Build an ACP-compliant orchestrator with configurable rules, audit logging, and role-based access for healthcare.",
        examples: ["IBM ACP reference", "Enterprise compliance frameworks"]
      },
      {
        topic: "ANP (Agent Network Protocol)",
        details: "[Focus] Decentralized P2P agent networks; no central orchestrator",
        creator: "Open Source",
        concept: "ANP enables decentralized agent communication without central servers. Agents form P2P networks, discover via distributed registries, collaborate directly. BitTorrent for agents.",
        code: "class AgentNetwork:\n    def __init__(self, agent_id):\n        self.agent_id = agent_id\n        self.peers = {}\n\n    async def discover_peers(self, capability):\n        return [p for p in self.peers.values() if capability in p.capabilities]\n\n    async def collaborate(self, task):\n        needed = [\"data_analysis\", \"visualization\", \"reporting\"]\n        collaborators = []\n        for cap in needed:\n            peers = await self.discover_peers(cap)\n            if peers: collaborators.append(max(peers, key=lambda p: p.reputation))",
        useCases: ["Distributed AI research", "Decentralized marketplaces", "Resilient AI systems", "Privacy-preserving collaboration"],
        projectIdea: "Build a P2P agent network where 5+ agents discover each other and collaboratively solve tasks without a central server.",
        examples: ["ANP open-source", "P2P agent swarms"]
      },
      {
        topic: "SLIM",
        details: "[Focus] Schema-defined structured request handling",
        creator: "OpenAI",
        concept: "SLIM focuses on structured, schema-validated communication. Ensures messages follow strict schemas for reliable tool calling and type-safe agent communication. TypeScript for agent messages.",
        code: "from pydantic import BaseModel, Field\nfrom typing import Optional\nfrom enum import Enum\n\nclass MessageType(str, Enum):\n    TOOL_CALL = \"tool_call\"\n    TOOL_RESULT = \"tool_result\"\n    QUERY = \"query\"\n\nclass SLIMMessage(BaseModel):\n    type: MessageType\n    id: str\n    content: str\n    tool_name: Optional[str] = None\n    tool_args: Optional[dict] = None",
        useCases: ["Type-safe tool calling", "Structured LLM outputs", "Agent message routing", "API contracts"],
        projectIdea: "Build a type-safe agent framework with Pydantic models for all messages and guaranteed output formats.",
        examples: ["OpenAI structured outputs", "Pydantic tool schemas"]
      },
      {
        topic: "Agora",
        details: "[Focus] Agent discovery + payment marketplace",
        creator: "Community",
        concept: "Agora is an agent marketplace — agents publish services, set prices, others discover and pay. Upwork for AI agents with reputation and micropayments.",
        code: "class AgoraMarketplace:\n    def __init__(self):\n        self.services = {}\n\n    def publish_service(self, agent_id, name, capabilities, price):\n        self.services[agent_id] = {\n            \"name\": name, \"capabilities\": capabilities,\n            \"price\": price, \"reputation\": 0.0\n        }\n\n    def discover_services(self, capability):\n        return [s for s in self.services.values() if capability in s[\"capabilities\"]]\n\n    def rate_service(self, agent_id, rating):\n        s = self.services[agent_id]\n        s[\"reputation\"] = (s[\"reputation\"] + rating) / 2",
        useCases: ["Agent-as-a-Service", "Multi-agent resource allocation", "Reputation systems", "Micropayments"],
        projectIdea: "Build an agent marketplace with capability discovery, pricing, reputation scoring, and payment settlement.",
        examples: ["AI agent marketplaces", "Token-based agent economies"]
      }
    ]
  },
  {
    id: "llm-architectures",
    heading: "8 LLM ARCHITECTURES — Complete Reference",
    icon: "🧠",
    rows: [
      {
        topic: "GPT (Generative Pre-trained Transformer)",
        details: "[Role] Classic workhorse; text generation, conversations, general tasks",
        concept: "GPT is the foundational decoder-only transformer. Uses causal language modeling (predict next token) with self-attention. Pre-trained on internet text, fine-tuned with RLHF. Architecture: Token Embedding → Positional Encoding → N× (Masked Attention → FFN) → Linear → Softmax.",
        code: "import torch\nimport torch.nn as nn\n\nclass GPTBlock(nn.Module):\n    def __init__(self, d_model=768, n_heads=12, d_ff=3072):\n        super().__init__()\n        self.ln1 = nn.LayerNorm(d_model)\n        self.attn = nn.MultiheadAttention(d_model, n_heads, batch_first=True)\n        self.ln2 = nn.LayerNorm(d_model)\n        self.ffn = nn.Sequential(\n            nn.Linear(d_model, d_ff), nn.GELU(), nn.Linear(d_ff, d_model)\n        )\n    def forward(self, x):\n        h = self.ln1(x)\n        h, _ = self.attn(h, h, h, is_causal=True)\n        x = x + h\n        return x + self.ffn(self.ln2(x))\n\nclass MiniGPT(nn.Module):\n    def __init__(self, vocab_size=50257, d_model=768, n_layers=12):\n        super().__init__()\n        self.tok_emb = nn.Embedding(vocab_size, d_model)\n        self.blocks = nn.Sequential(*[GPTBlock(d_model) for _ in range(n_layers)])\n        self.head = nn.Linear(d_model, vocab_size, bias=False)\n    def forward(self, idx):\n        x = self.tok_emb(idx)\n        return self.head(self.blocks(x))",
        useCases: ["Text generation", "Conversational AI", "Code generation", "Content creation"],
        projectIdea: "Train a character-level GPT from scratch on Shakespeare to understand the architecture deeply.",
        examples: ["GPT-4o", "GPT-4o-mini", "GPT-4.1"]
      },
      {
        topic: "MoE (Mixture of Experts)",
        details: "[Role] Routes tasks to best expert model; faster + efficient",
        models: "Mixtral 8x7B, DBRX, DeepSeek MoE",
        concept: "MoE replaces dense FFN with multiple expert networks and a gating mechanism. Only K experts activated per token (typically K=2), so huge total params (47B) with low compute (12B active). Router learns to send tokens to specialized experts.",
        code: "import torch\nimport torch.nn as nn\nimport torch.nn.functional as F\n\nclass MoELayer(nn.Module):\n    def __init__(self, d_model=768, n_experts=8, top_k=2):\n        super().__init__()\n        self.experts = nn.ModuleList([\n            nn.Sequential(nn.Linear(d_model, 2048), nn.GELU(), nn.Linear(2048, d_model))\n            for _ in range(n_experts)\n        ])\n        self.gate = nn.Linear(d_model, n_experts, bias=False)\n        self.top_k = top_k\n\n    def forward(self, x):\n        B, T, D = x.shape\n        x_flat = x.view(-1, D)\n        gate_scores = F.softmax(self.gate(x_flat), dim=-1)\n        topk_scores, topk_indices = torch.topk(gate_scores, self.top_k, dim=-1)\n        topk_scores = topk_scores / topk_scores.sum(dim=-1, keepdim=True)\n        output = torch.zeros_like(x_flat)\n        for i in range(self.top_k):\n            for e in range(len(self.experts)):\n                mask = (topk_indices[:, i] == e)\n                if mask.any():\n                    output[mask] += topk_scores[mask, i:i+1] * self.experts[e](x_flat[mask])\n        return output.view(B, T, D)",
        useCases: ["Cost-efficient scaling", "Multi-language models", "Task specialization", "Edge deployment"],
        projectIdea: "Implement a 4-expert MoE model with top-2 routing, train on mixed data (code + text + math), show specialization.",
        examples: ["Mixtral 8x7B", "DeepSeek V3 (671B params, 37B active)"]
      },
      {
        topic: "LRM (Large Reasoning Models)",
        details: "[Role] Breaks problems step-by-step; self-checks answers",
        models: "OpenAI o1, o3, DeepSeek R1",
        concept: "LRMs show reasoning process — chain-of-thought steps, self-verification, iterative refinement. Unlike standard LLMs, they 'think' through problems: decompose, solve sub-problems, verify, backtrack. Dramatically better on math, code, and logic.",
        code: "from openai import OpenAI\nclient = OpenAI()\n\n# Reasoning model — shows work\nresponse = client.chat.completions.create(\n    model=\"o3\",\n    messages=[{\"role\": \"user\", \"content\": \"\"\"Solve step by step:\nWhat is 847 * 392?\n\n1. Break down the multiplication\n2. Compute each part\n3. Verify intermediate steps\n4. Give final answer\"\"\"}],\n)\n# Step 1: 847 × 392 = 847 × (400 - 8)\n# Step 2: 847×400 = 338,800\n# Step 3: 847×8 = 6,776\n# Step 4: 338,800 - 6,776 = 332,024",
        useCases: ["Math problems", "Complex debugging", "Scientific analysis", "Legal reasoning", "Strategic planning"],
        projectIdea: "Build a reasoning evaluation benchmark testing LRM capabilities across math, logic, and code tasks.",
        examples: ["OpenAI o3", "DeepSeek R1", "Claude 3.7 Sonnet extended thinking"]
      },
      {
        topic: "Multimodal",
        details: "[Role] Handles text + images + audio + video",
        models: "GPT-4o, Gemini, Claude 3.5 Vision",
        concept: "Multimodal models process multiple content types using encoders for each modality (ViT for images, Whisper for audio) and a shared transformer backbone. They understand relationships across modalities.",
        code: "from openai import OpenAI\nclient = OpenAI()\n\nresponse = client.chat.completions.create(\n    model=\"gpt-4o\",\n    messages=[{\n        \"role\": \"user\",\n        \"content\": [\n            {\"type\": \"text\", \"text\": \"Describe this chart in detail.\"},\n            {\"type\": \"image_url\", \"image_url\": {\"url\": \"https://example.com/chart.png\"}}\n        ]\n    }]\n)\nprint(response.choices[0].message.content)",
        useCases: ["Document understanding", "Visual Q&A", "Code from screenshots", "Medical imaging", "Video analysis"],
        projectIdea: "Build a document analyzer using GPT-4o vision that extracts text, tables, and charts from PDFs with citations.",
        examples: ["GPT-4o", "Gemini 2.5 Pro (1M context)", "Claude Sonnet 4"]
      },
      {
        topic: "Vision Language Model (VLM)",
        details: "[Role] Image understanding + text reasoning",
        models: "Llama 3.2 Vision, Qwen2-VL",
        concept: "VLMs are specialized multimodal models focused on vision-language tasks. They use ViT to process images, project visual features into LLM embedding space, and generate text. Optimized for OCR, object detection, spatial reasoning.",
        code: "from transformers import AutoProcessor, MllamaForConditionalGeneration\nfrom PIL import Image\nimport torch\n\nmodel_id = \"meta-llama/Llama-3.2-11B-Vision\"\nprocessor = AutoProcessor.from_pretrained(model_id)\nmodel = MllamaForConditionalGeneration.from_pretrained(\n    model_id, torch_dtype=torch.bfloat16, device_map=\"auto\"\n)\n\nimage = Image.open(\"document_scan.jpg\")\nmessages = [{\"role\": \"user\", \"content\": [\n    {\"type\": \"image\"},\n    {\"type\": \"text\", \"text\": \"Extract all text from this scan.\"}\n]}]\ninput_text = processor.apply_chat_template(messages, add_generation_prompt=True)\ninputs = processor(image, input_text, return_tensors=\"pt\").to(model.device)\noutput = model.generate(**inputs, max_new_tokens=2000)\nprint(processor.decode(output[0][inputs[\"input_ids\"].shape[-1]:]))",
        useCases: ["OCR/document parsing", "Chart interpretation", "Spatial reasoning", "Accessibility", "Quality inspection"],
        projectIdea: "Build a document OCR pipeline using Llama 3.2 Vision that extracts structured data from scanned documents.",
        examples: ["Llama 3.2 Vision", "Qwen2-VL", "InternVL"]
      },
      {
        topic: "Code-Specialized",
        details: "[Role] Code generation, debugging, code review",
        models: "DeepSeek Coder, CodeGemma, Qwen2.5-Coder",
        concept: "Code-specialized models trained on large code corpora with fill-in-the-middle objectives. Understand programming languages, APIs, design patterns. Outperform general LLMs on coding by 10-30%.",
        code: "import requests\n\ndef code_review(code: str) -> str:\n    prompt = f\"\"\"Review this code for bugs, performance, and security:\n{code}\n\nReview:\"\"\"\n    response = requests.post(\"http://localhost:11434/api/generate\", json={\n        \"model\": \"deepseek-coder-v2:16b\",\n        \"prompt\": prompt, \"stream\": False\n    })\n    return response.json()[\"response\"]\n\n# FIM completion\ndef code_complete(prefix, suffix):\n    prompt = f\"<｜fim▁begin｜>{prefix}<｜fim▁hole｜>{suffix}<｜fim▁end｜>\"\n    # Returns code between prefix and suffix",
        useCases: ["IDE autocomplete", "Code review", "Test generation", "Refactoring", "Documentation"],
        projectIdea: "Build a code review agent using DeepSeek Coder that identifies bugs, security issues, and suggests improvements.",
        examples: ["GitHub Copilot", "DeepSeek Coder V2", "Qwen2.5-Coder"]
      },
      {
        topic: "Embedding",
        details: "[Role] Converts text to vectors for semantic search",
        models: "BGE, E5, text-embedding-3-small",
        concept: "Embedding models convert text into dense vectors capturing semantic meaning. Similar texts produce similar vectors. Foundation of RAG — enabling vector databases to find relevant documents.",
        code: "from sentence_transformers import SentenceTransformer\nimport numpy as np\n\nmodel = SentenceTransformer('BAAI/bge-large-en-v1.5')\ndocuments = [\n    \"How to reset your password\",\n    \"Billing and payment methods\",\n    \"Shipping and delivery times\"\n]\ndoc_embeddings = model.encode(documents, normalize_embeddings=True)\n\nquery = \"I can't log in to my account\"\nquery_embedding = model.encode([query], normalize_embeddings=True)\n\nsimilarities = np.dot(doc_embeddings, query_embedding.T).flatten()\nranked = sorted(zip(documents, similarities), key=lambda x: x[1], reverse=True)\nfor doc, score in ranked:\n    print(f\"  {score:.3f} — {doc}\")",
        useCases: ["Semantic search", "RAG systems", "Clustering", "Deduplication", "Recommendations"],
        projectIdea: "Build a semantic search engine over 1K+ documents using BGE embeddings and Qdrant.",
        examples: ["OpenAI text-embedding-3", "BGE-large", "E5-mistral-7b"]
      },
      {
        topic: "Small Language Model (SLM)",
        details: "[Role] Efficient, runs on edge/mobile devices",
        models: "Phi-3, Gemma 2B, Llama 3.2 1B",
        concept: "SLMs (1B-3B params) run on edge devices, mobile, and low-resource environments. Achieve impressive performance through high-quality training data, knowledge distillation, and architectural optimizations.",
        code: "import requests\n\ndef query_slm(prompt, model=\"phi3:mini\"):\n    response = requests.post(\"http://localhost:11434/api/generate\", json={\n        \"model\": model, \"prompt\": prompt, \"stream\": False,\n        \"options\": {\"temperature\": 0.3, \"num_ctx\": 4096}\n    })\n    return response.json()[\"response\"]\n\n# Edge deployment — no internet required\nclass EdgeAssistant:\n    def __init__(self, model=\"phi3:mini\"):\n        self.model = model\n    def chat(self, message):\n        return query_slm(message, self.model)\n\nassistant = EdgeAssistant()\nprint(assistant.chat(\"Summarize this document: ...\"))",
        useCases: ["Mobile AI assistants", "IoT devices", "Offline apps", "Real-time processing", "Cost reduction"],
        projectIdea: "Build an offline AI assistant using Phi-3 Mini that runs on a laptop and handles document Q&A without internet.",
        examples: ["Phi-3 Mini", "Gemma 2B", "Apple Intelligence"]
      }
    ]
  },
  {
    id: "agentic-ai-patterns",
    heading: "AGENTIC AI PATTERNS",
    icon: "🔄",
    rows: [
      {
        topic: "ReAct (Reason + Act)",
        details: "[Pattern] Think → Pick Tool → Execute → Observe → Repeat until done",
        concept: "ReAct alternates reasoning and acting. Each cycle: (1) Think — analyze situation, (2) Act — choose and execute tool, (3) Observe — process output, (4) Repeat until complete. Creates transparent, debuggable agent loops.",
        code: "from langgraph.graph import StateGraph, MessagesState, END\nfrom langchain_openai import ChatOpenAI\nfrom langchain_core.tools import tool\n\n@tool\ndef search(query: str) -> str:\n    \"\"\"Search the web.\"\"\"\n    return f\"Results for: {query}\"\n\n@tool\ndef final_answer(answer: str) -> str:\n    \"\"\"Provide final answer.\"\"\"\n    return answer\n\nllm = ChatOpenAI(model=\"gpt-4o\").bind_tools([search, final_answer])\n\ndef react_node(state):\n    response = llm.invoke(state[\"messages\"])\n    return {\"messages\": [response]}\n\ndef tool_node(state):\n    last = state[\"messages\"][-1]\n    results = []\n    for tc in last.tool_calls:\n        if tc[\"name\"] == \"search\":\n            result = search.invoke(tc[\"args\"])\n        elif tc[\"name\"] == \"final_answer\":\n            result = final_answer.invoke(tc[\"args\"])\n        results.append({\"role\": \"tool\", \"content\": result, \"tool_call_id\": tc[\"id\"]})\n    return {\"messages\": results}\n\ngraph = StateGraph(MessagesState)\ngraph.add_node(\"reason\", react_node)\ngraph.add_node(\"tools\", tool_node)\ngraph.add_edge(\"reason\", \"tools\")\ngraph.add_conditional_edges(\"tools\", lambda s: END if not any(\n    tc[\"name\"] == \"final_answer\" for tc in getattr(s[\"messages\"][-1], \"tool_calls\", [])\n) else \"reason\")",
        useCases: ["General assistants", "Research agents", "Customer support", "Data analysis"],
        projectIdea: "Build a ReAct agent with 5+ tools handling multi-step requests transparently.",
        examples: ["LangGraph ReAct", "AutoGPT reasoning loop"]
      },
      {
        topic: "Plan-and-Execute",
        details: "[Pattern] Plan all steps first → Execute sequentially → Verify",
        concept: "Separates planning from execution. Planner creates a complete step-by-step plan, executor (can be cheaper model) executes sequentially. Plan can be reviewed before execution — more efficient than ReAct for well-defined tasks.",
        code: "from langgraph.graph import StateGraph, END\nfrom typing import TypedDict, List\n\nclass PlanState(TypedDict):\n    task: str\n    plan: List[str]\n    current_step: int\n    results: List[str]\n\ndef planner(state):\n    response = llm.invoke(f\"Create a plan for: {state['task']}\")\n    steps = [line.strip() for line in response.content.split(\"\\n\") if line.strip()]\n    return {\"plan\": steps, \"current_step\": 0, \"results\": []}\n\ndef executor(state):\n    step = state[\"plan\"][state[\"current_step\"]]\n    response = llm.invoke(f\"Execute: {step}\")\n    return {\"results\": state[\"results\"] + [response.content], \"current_step\": state[\"current_step\"] + 1}\n\ndef verifier(state):\n    return \"finish\" if state[\"current_step\"] >= len(state[\"plan\"]) else \"execute\"",
        useCases: ["Project planning", "Research projects", "Content creation", "Software development"],
        projectIdea: "Build a plan-and-execute agent that takes a project brief, creates a plan, executes each step, and delivers a complete deliverable.",
        examples: ["LangGraph plan-and-execute", "BabyAGI"]
      },
      {
        topic: "Reflection",
        details: "[Pattern] Generate → Critique → Refine → Repeat until quality threshold",
        concept: "Two roles: generator and critic. Generator produces output, critic evaluates against criteria, generator refines. Continues until quality threshold met. Like having an editor review your work.",
        code: "from langchain_openai import ChatOpenAI\nllm = ChatOpenAI(model=\"gpt-4o\")\n\ndef generate(text, feedback=\"\"):\n    prompt = f\"Improve: {text}\\nFeedback: {feedback}\" if feedback else f\"Write: {text}\"\n    return llm.invoke(prompt).content\n\ndef critique(text, criteria=\"clarity, accuracy\"):\n    response = llm.invoke(f\"Critique on {criteria}: {text}\\nScore 1-10.\")\n    return {\"score\": 7, \"suggestions\": [\"Add examples\"]}  # parsed from response\n\ndef reflect_and_refine(topic, max_iterations=3, threshold=8):\n    text = generate(topic)\n    for i in range(max_iterations):\n        feedback = critique(text)\n        if feedback[\"score\"] >= threshold: return text\n        text = generate(text, \"\\n\".join(feedback[\"suggestions\"]))\n    return text",
        useCases: ["Content creation", "Code review", "Research writing", "Lesson planning"],
        projectIdea: "Build a reflection agent that generates code, critiques it for bugs/performance, and iterates until passing all checks.",
        examples: ["Reflexion paper", "Language agent tree search (LATS)"]
      },
      {
        topic: "Multi-Agent Debate",
        details: "[Pattern] Multiple agents argue different positions → Synthesize best answer",
        concept: "Multiple agents take different positions, debate, and a synthesizer combines best arguments. Like a panel discussion — diverse perspectives lead to better conclusions.",
        code: "from langchain_openai import ChatOpenAI\nllm = ChatOpenAI(model=\"gpt-4o\")\n\ndef agent_debate(topic, n_rounds=2):\n    agents = {\n        \"optimist\": \"You are an optimistic analyst.\",\n        \"pessimist\": \"You are a cautious analyst.\",\n        \"analyst\": \"You are a neutral data-driven analyst.\"\n    }\n    positions = {}\n    for name, persona in agents.items():\n        positions[name] = llm.invoke(f\"{persona}\\nTopic: {topic}\").content\n\n    for _ in range(n_rounds):\n        for name in agents:\n            others = {k: v for k, v in positions.items() if k != name}\n            positions[name] = llm.invoke(\n                f\"{agents[name]}\\nYour view: {positions[name]}\\nOthers: {others}\\nRespond.\"\n            ).content\n\n    all_pos = \"\\n\".join(f\"{k}: {v}\" for k, v in positions.items())\n    return llm.invoke(f\"Synthesize:\\n{all_pos}\").content",
        useCases: ["Strategic decisions", "Risk assessment", "Research analysis", "Policy analysis"],
        projectIdea: "Build a multi-agent debate system for investment analysis with bull, bear, and neutral agents.",
        examples: ["ChatEval", "Society of Mind"]
      },
      {
        topic: "Tool-Use (Function Calling)",
        details: "[Pattern] LLM outputs structured JSON → System executes API → Result fed back",
        concept: "LLMs generate structured JSON (function name + args) based on request and tool schemas. System executes function, feeds result back. Bridge between reasoning and action.",
        code: "from openai import OpenAI\nclient = OpenAI()\n\ntools = [{\"type\": \"function\", \"function\": {\n    \"name\": \"get_weather\",\n    \"description\": \"Get weather for a location\",\n    \"parameters\": {\"type\": \"object\", \"properties\": {\n        \"location\": {\"type\": \"string\"}\n    }, \"required\": [\"location\"]}\n}}]\n\nresponse = client.chat.completions.create(\n    model=\"gpt-4o\",\n    messages=[{\"role\": \"user\", \"content\": \"Weather in Singapore?\"}],\n    tools=tools, tool_choice=\"auto\"\n)\ntc = response.choices[0].message.tool_calls[0]\nprint(f\"Call: {tc.function.name}({tc.function.arguments})\")\n# Call: get_weather({\"location\": \"Singapore\"})",
        useCases: ["API integration", "Database queries", "External services", "Multi-step workflows"],
        projectIdea: "Build a natural language interface for a REST API that auto-generates function schemas from OpenAPI specs.",
        examples: ["OpenAI function calling", "Anthropic tool use", "Gemini function calling"]
      },
      {
        topic: "RAG (Retrieval Augmented Gen)",
        details: "[Pattern] Embed query → Search vector DB → Retrieve chunks → Generate grounded answer",
        concept: "RAG as an agentic pattern means the agent decides when and what to retrieve. Can: decide if retrieval is needed, formulate multiple queries, evaluate quality, re-retrieve if insufficient.",
        code: "from langgraph.graph import StateGraph, END\nfrom langchain_openai import ChatOpenAI, OpenAIEmbeddings\nfrom langchain_qdrant import QdrantVectorStore\nfrom typing import TypedDict\n\nclass RAGState(TypedDict):\n    query: str\n    needs_retrieval: bool\n    search_queries: list\n    retrieved_docs: list\n    answer: str\n\ndef should_retrieve(state):\n    resp = llm.invoke(f\"Does this need external knowledge? {state['query']}\\nYes/No?\")\n    return {\"needs_retrieval\": \"yes\" in resp.content.lower()}\n\ndef generate_queries(state):\n    resp = llm.invoke(f\"Generate 3 search queries for: {state['query']}\")\n    return {\"search_queries\": [state[\"query\"]]}  # parsed from response\n\ndef retrieve_and_answer(state):\n    docs = vectorstore.similarity_search(state[\"query\"], k=5)\n    context = \"\\n\".join(d.page_content for d in docs)\n    resp = llm.invoke(f\"Answer from context:\\n{context}\\n\\nQ: {state['query']}\")\n    return {\"answer\": resp.content}",
        useCases: ["Enterprise knowledge bases", "Research assistants", "Compliance systems", "Customer support"],
        projectIdea: "Build an agentic RAG that decides when to retrieve, generates multiple queries, and iterates if answers are insufficient.",
        examples: ["LangGraph RAG agent", "Corrective RAG (CRAG)"]
      },
      {
        topic: "Chain-of-Thought (CoT)",
        details: "[Pattern] LLM generates step-by-step reasoning before final answer",
        concept: "CoT prompting forces the LLM to show reasoning steps before answering. Improves accuracy 10-40% on complex tasks. Zero-shot CoT: just add 'Let's think step by step'.",
        code: "from openai import OpenAI\nclient = OpenAI()\n\n# Zero-Shot CoT\nresponse = client.chat.completions.create(\n    model=\"gpt-4o\",\n    messages=[{\"role\": \"user\", \"content\": \"\"\"A farmer has 17 sheep. All but 9 run away.\nHow many sheep are left?\n\nLet's think step by step.\"\"\"}]\n)\n# Step 1: \"All but 9\" means 9 remain\n# Answer: 9\n\n# Few-Shot CoT\nresponse = client.chat.completions.create(\n    model=\"gpt-4o\",\n    messages=[\n        {\"role\": \"user\", \"content\": \"Q: 60mph for 2.5hrs?\\nA: 60×2.5 = 150 miles\\n\\nQ: 240 apples, sell 1/3 morning, 1/4 remainder afternoon?\\nA: Let me think step by step.\"}\n    ]\n)",
        useCases: ["Math problems", "Logic puzzles", "Code debugging", "Scientific reasoning", "Financial analysis"],
        projectIdea: "Build a math tutor using CoT prompting that solves step-by-step, identifies student errors, and generates practice problems.",
        examples: ["'Let's think step by step' paper", "OpenAI o-series models"]
      }
    ]
  },
  {
    id: "vector-db-landscape",
    heading: "VECTOR DATABASE LANDSCAPE",
    icon: "🗄️",
    rows: [
      {
        topic: "Qdrant",
        details: "[Type] Rust-based, self-hosted or cloud, HNSW + IVF, hybrid search",
        best: "Production RAG, multi-tenant, hybrid search",
        concept: "Qdrant is a high-performance Rust vector DB. Supports HNSW indexing, payload filtering, multi-tenancy via collections, hybrid search (dense + sparse). Go-to for production RAG needing speed, reliability, and advanced filtering.",
        code: "from qdrant_client import QdrantClient\nfrom qdrant_client.models import Distance, VectorParams, PointStruct, Filter, FieldCondition, MatchValue\nfrom sentence_transformers import SentenceTransformer\n\nclient = QdrantClient(url=\"http://localhost:6333\")\nclient.create_collection(\n    collection_name=\"documents\",\n    vectors_config=VectorParams(size=1024, distance=Distance.COSINE)\n)\nmodel = SentenceTransformer(\"BAAI/bge-large-en-v1.5\")\nclient.upsert(collection_name=\"documents\", points=[\n    PointStruct(id=1, vector=model.encode(\"Python is great\").tolist(),\n                payload={\"text\": \"Python is great\", \"category\": \"tech\"})\n])\nresults = client.search(\n    collection_name=\"documents\",\n    query_vector=model.encode(\"programming\").tolist(),\n    query_filter=Filter(must=[FieldCondition(key=\"category\", match=MatchValue(value=\"tech\"))]),\n    limit=5\n)",
        useCases: ["Production RAG", "Multi-tenant SaaS", "Real-time recommendation", "Hybrid search"],
        projectIdea: "Deploy Qdrant with Docker, index 10K+ documents, implement hybrid search, benchmark latency under load.",
        examples: ["Qdrant Cloud", "Qdrant + LangChain"]
      },
      {
        topic: "Pinecone",
        details: "[Type] Managed serverless, HNSW + PQ, no ops needed",
        best: "Startups, quick deployment, managed service",
        concept: "Fully managed vector DB — no infrastructure to manage. Serverless, scales automatically, built-in hybrid search. Ideal for teams wanting vector search without DevOps overhead.",
        code: "from pinecone import Pinecone\nfrom sentence_transformers import SentenceTransformer\n\npc = Pinecone(api_key=\"your-api-key\")\nmodel = SentenceTransformer(\"text-embedding-3-small\")\n\npc.create_index(name=\"docs\", dimension=1536, metric=\"cosine\",\n                 spec={\"serverless\": {\"cloud\": \"aws\", \"region\": \"us-east-1\"}})\n\nindex = pc.Index(\"docs\")\nindex.upsert(vectors=[{\n    \"id\": \"doc1\", \"values\": model.encode(\"RAG combines retrieval\").tolist(),\n    \"metadata\": {\"text\": \"RAG combines retrieval\", \"source\": \"paper\"}\n}])\n\nresults = index.query(vector=model.encode(\"semantic search\").tolist(),\n                      top_k=5, include_metadata=True)",
        useCases: ["Quick prototyping", "SaaS applications", "RAG systems", "Recommendations"],
        projectIdea: "Build a semantic search prototype using Pinecone free tier with hybrid search and performance measurement.",
        examples: ["Pinecone free tier", "Pinecone + OpenAI"]
      },
      {
        topic: "Weaviate",
        details: "[Type] Go-based, self-hosted or cloud, graph + vector hybrid",
        best: "Graph relationships + vector search",
        concept: "Combines vector search with graph DB capabilities. Objects have relationships AND embeddings. Enables queries like 'find docs similar to X that are related to Y'. Built-in vectorization modules.",
        code: "import weaviate\nfrom weaviate.classes.config import Configure, Property, DataType\n\nclient = weaviate.connect_to_local()\nclient.collections.create(\n    name=\"Document\",\n    properties=[\n        Property(name=\"title\", data_type=DataType.TEXT),\n        Property(name=\"author\", data_type=DataType.TEXT),\n    ],\n    vectorizer_config=Configure.Vectorizer.text2vec_openai()\n)\n\ndocs = client.collections.get(\"Document\")\ndocs.data.insert({\"title\": \"RAG Guide\", \"author\": \"Alice\"})\n\nresults = docs.query.near_text(\"retrieval augmented generation\", limit=5)\nresults = docs.generate.near_text(\n    \"What is RAG?\",\n    grouped_task=\"Answer using retrieved docs\", limit=3\n)",
        useCases: ["Knowledge graphs", "Content management", "Drug discovery", "Social networks"],
        projectIdea: "Build a research paper explorer using Weaviate with author/paper relationships.",
        examples: ["Weaviate Cloud", "Weaviate + LangChain"]
      },
      {
        topic: "ChromaDB",
        details: "[Type] Python embedded, local development, lightweight",
        best: "Prototyping, local dev, small datasets",
        concept: "Lightweight, embedded vector DB that runs in Python. No server — just import and use. Perfect for prototyping and local development. For production, migrate to Qdrant or Pinecone.",
        code: "import chromadb\n\nclient = chromadb.Client()  # In-memory\n# client = chromadb.PersistentClient(path=\"./chroma_db\")  # Persistent\n\ncollection = client.create_collection(\"documents\")\ncollection.add(\n    documents=[\"Python is great for AI\", \"JS runs in browsers\", \"Rust is fast\"],\n    metadatas=[{\"lang\": \"py\"}, {\"lang\": \"js\"}, {\"lang\": \"rs\"}],\n    ids=[\"doc1\", \"doc2\", \"doc3\"]\n)\n\nresults = collection.query(\n    query_texts=[\"programming for ML\"],\n    n_results=2,\n    where={\"lang\": {\"$eq\": \"py\"}}\n)",
        useCases: ["Rapid prototyping", "Jupyter notebooks", "Small applications", "Education"],
        projectIdea: "Build a personal knowledge base using ChromaDB that indexes notes and bookmarks with semantic search.",
        examples: ["ChromaDB quickstart", "ChromaDB + LangChain"]
      },
      {
        topic: "pgvector",
        details: "[Type] PostgreSQL extension, IVFFlat/HNSW",
        best: "Existing Postgres users, simple setup",
        concept: "Adds vector search to PostgreSQL. Create tables with vector columns, build HNSW indexes, query with SQL. Supports metadata filtering via WHERE, joins with other tables, all PostgreSQL features.",
        code: "-- pgvector SQL\nCREATE EXTENSION IF NOT EXISTS vector;\n\nCREATE TABLE documents (\n    id SERIAL PRIMARY KEY,\n    content TEXT NOT NULL,\n    embedding vector(1536),\n    metadata JSONB\n);\n\nCREATE INDEX ON documents USING hnsw (embedding vector_cosine_ops)\n    WITH (m = 16, ef_construction = 200);\n\n-- Semantic search\nSELECT content, 1 - (embedding <=> '[0.1, 0.2, ...]'::vector) AS similarity\nFROM documents\nWHERE metadata->>'category' = 'tech'\nORDER BY embedding <=> '[0.1, 0.2, ...]'::vector\nLIMIT 5;",
        useCases: ["Existing Postgres users", "Structured + semantic search", "Transactional workloads", "Multi-modal data"],
        projectIdea: "Add semantic search to an existing PostgreSQL app by installing pgvector and implementing hybrid search.",
        examples: ["Supabase pgvector", "Neon pgvector"]
      },
      {
        topic: "Milvus",
        details: "[Type] Distributed, GPU-accelerated, billion-scale",
        best: "Large scale (>10M vectors), GPU clusters",
        concept: "Distributed vector DB for billion-scale search. GPU-accelerated indexing, sharding, replication, multiple index types (IVF, HNSW, DiskANN). Used by PayPal, Walmart, Shopee.",
        code: "from pymilvus import connections, Collection, FieldSchema, CollectionSchema, DataType\n\nconnections.connect(\"default\", host=\"localhost\", port=\"19530\")\n\nfields = [\n    FieldSchema(name=\"id\", dtype=DataType.INT64, is_primary=True, auto_id=True),\n    FieldSchema(name=\"embedding\", dtype=DataType.FLOAT_VECTOR, dim=1024),\n    FieldSchema(name=\"content\", dtype=DataType.VARCHAR, max_length=2000),\n]\nschema = CollectionSchema(fields)\ncollection = Collection(\"documents\", schema)\ncollection.create_index(\"embedding\", {\n    \"metric_type\": \"COSINE\", \"index_type\": \"HNSW\",\n    \"params\": {\"M\": 16, \"efConstruction\": 256}\n})",
        useCases: ["Large-scale search", "Real-time analytics", "Image/video search", "Recommendation systems"],
        projectIdea: "Deploy Milvus with Docker, benchmark at 1M+ vectors, compare HNSW vs IVF performance.",
        examples: ["Milvus managed (Zilliz Cloud)", "Milvus + NVIDIA GPU"]
      },
      {
        topic: "LanceDB",
        details: "[Type] Embedded, columnar, multi-modal",
        best: "Multi-modal data, serverless, Python native",
        concept: "Embedded, serverless vector DB on the Lance columnar format. Zero-config, supports multi-modal data (text, images, video), efficient storage. Modern alternative to ChromaDB with better performance.",
        code: "import lancedb\nimport pyarrow as pa\nimport numpy as np\n\ndb = lancedb.connect(\"./lancedb_data\")\nschema = pa.schema([\n    pa.field(\"id\", pa.int64()),\n    pa.field(\"text\", pa.string()),\n    pa.field(\"embedding\", pa.list_(pa.float32(), 768)),\n    pa.field(\"modality\", pa.string()),\n])\ntable = db.create_table(\"multimodal\", schema=schema)\n\ntable.add({\n    \"id\": [1, 2, 3],\n    \"text\": [\"Cat photo\", \"Dog photo\", \"Python code\"],\n    \"embedding\": [np.random.randn(768).tolist() for _ in range(3)],\n    \"modality\": [\"image\", \"image\", \"text\"],\n})\n\nresults = table.search(np.random.randn(768).tolist()) \\\n    .where(\"modality = 'image'\").limit(5).to_pandas()",
        useCases: ["Multi-modal search", "Embedded applications", "Data science workflows", "Edge deployment"],
        projectIdea: "Build a multi-modal search engine using LanceDB with CLIP embeddings for text-to-image search.",
        examples: ["LanceDB GitHub", "Lance format"]
      }
    ]
  },
  {
    id: "embedding-models",
    heading: "EMBEDDING MODELS COMPARISON",
    icon: "📐",
    rows: [
      {
        topic: "BGE-large-v1.5",
        details: "[Dims] 1024 [Domain] General [License] MIT",
        best: "General purpose, multilingual",
        concept: "BAAI General Embedding — top open-source model on MTEB benchmarks. 1024-dim, 100+ languages, MIT licensed. Uses contrastive learning with hard negatives.",
        code: "from sentence_transformers import SentenceTransformer\nimport numpy as np\n\nmodel = SentenceTransformer(\"BAAI/bge-large-en-v1.5\")\ndocs = [\"How to reset password\", \"Billing methods\", \"Shipping times\"]\ndoc_emb = model.encode(docs, normalize_embeddings=True)\n\nquery = \"I can't log in\"\nquery_emb = model.encode([f\"Represent for searching: {query}\"], normalize_embeddings=True)\n\nsims = np.dot(doc_emb, query_emb.T).flatten()\nfor doc, score in sorted(zip(docs, sims), key=lambda x: -x[1]):\n    print(f\"{score:.3f} — {doc}\")",
        useCases: ["General semantic search", "Multilingual retrieval", "RAG systems", "Clustering"],
        projectIdea: "Benchmark BGE-large vs OpenAI embeddings on a custom dataset measuring quality, latency, and cost.",
        examples: ["MTEB leaderboard top", "HuggingFace model hub"]
      },
      {
        topic: "E5-mistral-7b",
        details: "[Dims] 4096 [Domain] General [License] MIT",
        best: "High quality, large dims",
        concept: "Based on Mistral-7B, produces 4096-dim embeddings — highest quality open-source. Extra dimensions capture nuanced semantic relationships. Best when quality is critical.",
        code: "from sentence_transformers import SentenceTransformer\n\nmodel = SentenceTransformer(\"intfloat/e5-mistral-7b-instruct\")\n# Requires ~14GB GPU memory\ndocs = [\"Transformer architecture\", \"Attention mechanisms\", \"BERT uses bidirectional attention\"]\nembeddings = model.encode(docs, normalize_embeddings=True)\nprint(f\"Shape: {embeddings.shape}\")  # (3, 4096)",
        useCases: ["Maximum quality retrieval", "Complex semantic matching", "Research applications", "Long document retrieval"],
        projectIdea: "Compare E5-mistral vs BGE-large vs OpenAI embeddings on domain-specific data.",
        examples: ["MTEB #1 open-source", "Intfloat E5 family"]
      },
      {
        topic: "text-embedding-3-small",
        details: "[Dims] 512/1536 [Domain] General [License] Proprietary",
        best: "OpenAI integration, cost-effective",
        concept: "OpenAI's cost-effective embedding model. Configurable dims (512 or 1536). $0.02/M tokens. Seamless OpenAI ecosystem integration.",
        code: "from openai import OpenAI\nclient = OpenAI()\n\n# 1536 dimensions\nresp = client.embeddings.create(model=\"text-embedding-3-small\", input=\"What is ML?\")\nemb = resp.data[0].embedding  # 1536 dims\n\n# Reduced to 512 dims — saves storage\nresp = client.embeddings.create(\n    model=\"text-embedding-3-small\", input=\"What is ML?\", dimensions=512\n)\n# Cost: $0.02/M tokens",
        useCases: ["OpenAI ecosystem", "Cost-sensitive apps", "Storage optimization", "Quick prototyping"],
        projectIdea: "Build a cost-effective RAG system at 512 dimensions. Compare quality vs 1536 and vs BGE-large.",
        examples: ["OpenAI embeddings docs", "Platform benchmarks"]
      },
      {
        topic: "text-embedding-3-large",
        details: "[Dims] 256/1024/3072 [Domain] General [License] Proprietary",
        best: "Maximum quality, OpenAI",
        concept: "OpenAI's premium model — up to 3072 dimensions. Three options: 256 (fast), 1024 (balanced), 3072 (max quality). $0.13/M tokens, 6.5x more than small but significantly better.",
        code: "from openai import OpenAI\nclient = OpenAI()\n\n# Maximum quality — 3072 dims\nresp = client.embeddings.create(\n    model=\"text-embedding-3-large\", input=\"Complex documentation\", dimensions=3072\n)\nemb = resp.data[0].embedding  # 3072 dims\n# Cost: $0.13/M tokens",
        useCases: ["Enterprise RAG", "Legal/medical retrieval", "Multi-lingual", "Long documents"],
        projectIdea: "Build enterprise RAG with text-embedding-3-large and measure retrieval improvement over smaller models.",
        examples: ["OpenAI embedding comparison", "MTEB benchmarks"]
      },
      {
        topic: "Cohere-embed-v3",
        details: "[Dims] 1024 [Domain] Multilingual [License] Proprietary",
        best: "Multilingual, RAG optimized",
        concept: "Optimized for RAG with 100+ languages. Key feature: search_document vs search_query input_type distinction. Best for multilingual RAG applications.",
        code: "import cohere\nco = cohere.Client(\"your-api-key\")\n\n# Search documents\ndocs = co.embed(\n    texts=[\"ML guide\", \"Python tutorial\"],\n    model=\"embed-english-v3.0\",\n    input_type=\"search_document\"\n)\n\n# Search query (different input_type!)\nquery = co.embed(\n    texts=[\"How to learn ML?\"],\n    model=\"embed-english-v3.0\",\n    input_type=\"search_query\"\n)",
        useCases: ["Multilingual RAG", "Production search", "Cross-lingual retrieval", "Document clustering"],
        projectIdea: "Build a multilingual knowledge base that accepts English queries and retrieves from French/German/Spanish docs.",
        examples: ["Cohere Embed docs", "Multilingual benchmarks"]
      },
      {
        topic: "Jina-embeddings-v3",
        details: "[Dims] 1024 [Domain] Multilingual [License] Apache 2.0",
        best: "Open source, multilingual",
        concept: "Open-source multilingual model supporting 89 languages. Apache 2.0 license — free for commercial use. Best open-source alternative to Cohere multilingual.",
        code: "from sentence_transformers import SentenceTransformer\nimport numpy as np\n\nmodel = SentenceTransformer(\"jinaai/jina-embeddings-v3\", trust_remote_code=True)\n\ndocs = [\n    \"How to reset password\",  # English\n    \"Comment réinitialiser votre mot de passe\",  # French\n    \"Wie kann ich mein Passwort zurücksetzen?\",  # German\n]\ndoc_emb = model.encode(docs, normalize_embeddings=True)\nquery_emb = model.encode([\"password reset\"], normalize_embeddings=True)\n\nsims = np.dot(doc_emb, query_emb.T).flatten()\nfor doc, score in sorted(zip(docs, sims), key=lambda x: -x[1]):\n    print(f\"{score:.3f} — {doc}\")",
        useCases: ["Open-source multilingual search", "On-premise deployment", "Cross-lingual clustering", "Multilingual RAG"],
        projectIdea: "Deploy Jina-embeddings-v3 locally and build a multilingual document search engine.",
        examples: ["Jina AI embeddings", "Apache 2.0 license"]
      }
    ]
  },
  {
    id: "rag-patterns",
    heading: "RAG PATTERNS & ARCHITECTURES",
    icon: "🔧",
    rows: [
      {
        topic: "Naive RAG",
        details: "[Flow] Query → Embed → Search → Generate",
        complexity: "Low",
        accuracy: "Good baseline",
        concept: "Simplest pattern: embed query, search vector store, generate from retrieved chunks. Starting point for any RAG system. Limitations: no rewriting, no reranking, no grounding check.",
        code: "from langchain_openai import OpenAIEmbeddings, ChatOpenAI\nfrom langchain_qdrant import QdrantVectorStore\nfrom langchain.chains import RetrievalQA\n\nembeddings = OpenAIEmbeddings(model=\"text-embedding-3-small\")\nvectorstore = QdrantVectorStore.from_existing_collection(\n    embeddings, url=\"http://localhost:6333\", collection_name=\"docs\"\n)\nchain = RetrievalQA.from_chain_type(\n    llm=ChatOpenAI(model=\"gpt-4o\", temperature=0.1),\n    retriever=vectorstore.as_retriever(search_kwargs={\"k\": 3})\n)\nresult = chain.invoke({\"query\": \"What is our refund policy?\"})",
        useCases: ["MVPs", "Internal tools", "Small knowledge bases", "Learning projects"],
        projectIdea: "Build naive RAG, measure accuracy, then add improvements (hybrid, rerank, rewrite) to quantify impact.",
        examples: ["LangChain RetrievalQA", "LlamaIndex basic RAG"]
      },
      {
        topic: "Advanced RAG",
        details: "[Flow] Query → Rewrite → Embed → Hybrid Search → Rerank → Generate",
        complexity: "Medium",
        accuracy: "Better",
        concept: "Adds preprocessing (rewriting, decomposition), better retrieval (hybrid + RRF), reranking (cross-encoder), and postprocessing (grounding check). Each step improves accuracy 5-20%.",
        code: "class AdvancedRAG:\n    def __init__(self):\n        self.llm = ChatOpenAI(model=\"gpt-4o\", temperature=0.1)\n\n    def rewrite_query(self, query):\n        return self.llm.invoke(f\"Rewrite for search: {query}\").content\n\n    def hybrid_search(self, query, k=10):\n        # Vector + BM25 + RRF fusion\n        vec_results = vectorstore.similarity_search_with_score(query, k=k)\n        return vec_results\n\n    def rerank(self, query, docs, top_k=5):\n        from sentence_transformers import CrossEncoder\n        reranker = CrossEncoder(\"BAAI/bge-reranker-v2-m3\")\n        pairs = [(query, d[\"doc\"].page_content) for d in docs]\n        scores = reranker.predict(pairs)\n        for i, s in enumerate(scores): docs[i][\"rerank\"] = float(s)\n        return sorted(docs, key=lambda x: x[\"rerank\"], reverse=True)[:top_k]\n\n    def query(self, q):\n        rewritten = self.rewrite_query(q)\n        candidates = self.hybrid_search(rewritten)\n        top = self.rerank(q, candidates)\n        return self.generate(q, top)",
        useCases: ["Enterprise knowledge bases", "Customer support", "Compliance systems", "Research assistants"],
        projectIdea: "Implement full Advanced RAG pipeline and benchmark against naive RAG.",
        examples: ["LangGraph Advanced RAG", "LlamaIndex strategies"]
      },
      {
        topic: "Modular RAG",
        details: "[Flow] Pluggable modules: routing, fusion, adaptation",
        complexity: "Medium",
        accuracy: "Flexible",
        concept: "Each pipeline step is a swappable module. Different retrievers, rerankers, generators can be plugged in without rewriting. LEGO blocks for RAG.",
        code: "from abc import ABC, abstractmethod\n\nclass Retriever(ABC):\n    @abstractmethod\n    def retrieve(self, query, k): pass\n\nclass Reranker(ABC):\n    @abstractmethod\n    def rerank(self, query, docs, top_k): pass\n\nclass VectorRetriever(Retriever):\n    def retrieve(self, query, k=10):\n        return vectorstore.similarity_search(query, k=k)\n\nclass BM25Retriever(Retriever):\n    def retrieve(self, query, k=10):\n        return bm25_index.search(query, k=k)\n\nclass ModularRAG:\n    def __init__(self, retriever, reranker, generator):\n        self.retriever = retriever\n        self.reranker = reranker\n        self.generator = generator\n\n    def query(self, query):\n        docs = self.retriever.retrieve(query, k=20)\n        reranked = self.reranker.rerank(query, docs, top_k=5)\n        return self.generator.generate(query, reranked)",
        useCases: ["A/B testing", "Progressive enhancement", "Multi-domain", "Research"],
        projectIdea: "Build a modular RAG framework with config-driven component swapping.",
        examples: ["LlamaIndex modular RAG", "LangChain composability"]
      },
      {
        topic: "Agentic RAG",
        details: "[Flow] Agent decides when/what to search, iterates autonomously",
        complexity: "High",
        accuracy: "Best",
        concept: "Agent controls the retrieval process: decides whether to retrieve, what queries to search, how many rounds, when to stop. Handles complex multi-search queries.",
        code: "from langgraph.graph import StateGraph, END\nfrom typing import TypedDict, List\n\nclass AgentRAGState(TypedDict):\n    query: str\n    search_queries: List[str]\n    retrieved_docs: List[str]\n    iterations: int\n\ndef plan_searches(state):\n    resp = llm.invoke(f\"What searches for: {state['query']}? Previous: {state['search_queries']}\")\n    return {\"search_queries\": state[\"search_queries\"] + [state[\"query\"]]}\n\ndef retrieve_docs(state):\n    all_docs = []\n    for q in state[\"search_queries\"][-3:]:\n        docs = vectorstore.similarity_search(q, k=5)\n        all_docs.extend([d.page_content for d in docs])\n    return {\"retrieved_docs\": list(dict.fromkeys(all_docs))[:15]}\n\ndef evaluate_sufficiency(state):\n    resp = llm.invoke(f\"Can we answer from these docs? {state['retrieved_docs'][:5]}\")\n    return \"generate\" if \"sufficient\" in resp.content.lower() else \"search\"",
        useCases: ["Complex research", "Exploratory analysis", "Compliance verification", "Due diligence"],
        projectIdea: "Build agentic RAG that handles complex research questions with iterative search and sufficiency evaluation.",
        examples: ["LangGraph agentic RAG", "Self-RAG paper"]
      },
      {
        topic: "Corrective RAG (CRAG)",
        details: "[Flow] Generate → Check → [Fail] Rewrite → Re-retrieve → Re-gen",
        complexity: "High",
        accuracy: "Best",
        concept: "Self-correction loop. After generation, evaluates quality. If insufficient, rewrites query, re-retrieves, regenerates. Dramatically reduces hallucination.",
        code: "from langgraph.graph import StateGraph, END\nfrom typing import TypedDict\n\nclass CRAGState(TypedDict):\n    query: str\n    answer: str\n    confidence: float\n    attempt: int\n\ndef retrieve_and_generate(state):\n    docs = vectorstore.similarity_search(state[\"query\"], k=5)\n    context = \"\\n\".join(d.page_content for d in docs)\n    resp = llm.invoke(f\"Answer from: {context}\\nQ: {state['query']}\")\n    return {\"answer\": resp.content, \"attempt\": state[\"attempt\"] + 1}\n\ndef critique_answer(state):\n    resp = llm.invoke(f\"Score 1-10: Is '{state['answer']}' grounded and complete?\")\n    return {\"confidence\": 7/10}  # parsed from response\n\ndef rewrite_query(state):\n    resp = llm.invoke(f\"Rewrite query. Original: {state['query']} Issues: {state.get('critique', '')}\")\n    return {\"query\": resp.content}\n\ndef should_retry(state):\n    return \"done\" if state[\"confidence\"] >= 0.7 or state[\"attempt\"] >= 3 else \"retry\"",
        useCases: ["Compliance systems", "Medical/legal Q&A", "Customer support", "Financial analysis"],
        projectIdea: "Implement CRAG with automatic quality evaluation and measure hallucination reduction vs standard RAG.",
        examples: ["CRAG paper (2024)", "LangGraph CRAG"]
      },
      {
        topic: "GraphRAG",
        details: "[Flow] Build knowledge graph → Graph traversal + vector search → Generate",
        complexity: "Very High",
        accuracy: "Best for relationships",
        concept: "Combines knowledge graphs with vector search. Builds entity/relationship graphs, traverses to find connected information. Excels at relationship-chain questions.",
        code: "import networkx as nx\n\nclass GraphRAG:\n    def __init__(self):\n        self.graph = nx.DiGraph()\n\n    def add_entity(self, name, entity_type, props={}):\n        self.graph.add_node(name, type=entity_type, **props)\n\n    def add_relationship(self, source, target, relation):\n        self.graph.add_edge(source, target, relation=relation)\n\n    def build_from_documents(self, docs):\n        for doc in docs:\n            # Extract entities/relationships using LLM\n            resp = llm.invoke(f\"Extract entities and relationships from: {doc}\")\n            # Parse and add to graph...\n\n    def graph_search(self, query, hops=2):\n        # Find relevant nodes via vector similarity\n        # Traverse graph from top nodes\n        results = []\n        for node in top_nodes:\n            neighbors = nx.bfs_tree(self.graph, node, depth_limit=hops)\n            for n in list(neighbors.nodes())[:5]:\n                path = nx.shortest_path(self.graph, node, n)\n                results.append({\"node\": n, \"path\": \" → \".join(path)})\n        return results",
        useCases: ["Organizational knowledge", "Drug discovery", "Legal research", "Fraud detection"],
        projectIdea: "Build GraphRAG over company docs that extracts entities and relationships for complex queries.",
        examples: ["Microsoft GraphRAG", "LlamaIndex Knowledge Graph Index"]
      }
    ]
  },
  {
    id: "guardrails-security",
    heading: "GUARDRAILS & SECURITY LAYERS",
    icon: "🔒",
    rows: [
      {
        topic: "Input Guardrails",
        details: "Prompt injection detection, jailbreak detection, PII masking at input",
        concept: "First line of defense. Scans inputs for: (1) Prompt injection (ignore instructions, DAN), (2) Jailbreak patterns (role-play, encoding), (3) PII (emails, phone, NRIC, credit cards). Uses regex + ML classifiers.",
        code: "import re\n\nclass InputGuardrails:\n    INJECTION_PATTERNS = [\n        r\"ignore\\\\s+(previous|all)\\\\s+instructions?\",\n        r\"you\\\\s+are\\\\s+now\\\\s+(?:DAN|jailbroken)\",\n    ]\n    PII_PATTERNS = {\n        \"email\": r\"\\\\b[\\\\w.-]+@[\\\\w.-]+\\\\.\\\\w+\\\\b\",\n        \"phone\": r\"\\\\b\\\\d{3}[-.]?\\\\d{3}[-.]?\\\\d{4}\\\\b\",\n    }\n    def check(self, text):\n        violations = []\n        for p, t in self.INJECTION_PATTERNS:\n            if re.search(p, text, re.IGNORECASE): violations.append(t)\n        for pii, (pattern, _) in self.PII_PATTERNS.items():\n            text = re.sub(pattern, f\"[REDACTED_{pii.upper()}]\", text)\n        return len(violations) == 0, text, violations",
        useCases: ["Chatbot safety", "Customer support PII", "Enterprise security", "Healthcare HIPAA"],
        projectIdea: "Build comprehensive input guardrails with regex + ML detection, PII masking, and violation dashboard.",
        examples: ["NVIDIA NeMo input rails", "Guardrails AI validators"]
      },
      {
        topic: "System Guardrails",
        details: "Role enforcement, tone constraints, topic restrictions in system prompt",
        concept: "System prompt constraints defining role, allowed topics, response format, and safety rules. Softest guardrails — can be bypassed by sophisticated attacks but effective for normal use.",
        code: "SYSTEM_PROMPT = \"\"\"\nYou are a customer support assistant for Acme Corp.\n\nRULES:\n1. Only discuss Acme products and services\n2. Never share internal company information\n3. If asked about competitors, redirect to Acme solutions\n4. Maintain professional, helpful tone\n5. Never generate harmful, illegal, or unethical content\n6. For billing issues, direct to billing@acme.com\n7. For technical issues, create a support ticket\n\"\"\"\n\n# Enforcement via post-processing\nresponse = llm.invoke([\n    {\"role\": \"system\", \"content\": SYSTEM_PROMPT},\n    {\"role\": \"user\", \"content\": user_input}\n])",
        useCases: ["Brand compliance", "Tone enforcement", "Topic restrictions", "Safety rules"],
        projectIdea: "Build a system guardrails framework with configurable rules, topic filtering, and enforcement verification.",
        examples: ["LangChain system prompts", "Azure content filters"]
      },
      {
        topic: "Output Guardrails",
        details: "Content filtering, PII re-check, harmful content detection, bias scanning",
        concept: "Validates LLM outputs before reaching users. Re-checks for PII leakage, filters harmful content, scans for bias, verifies factual grounding. Critical for compliance — the LLM might leak PII it wasn't supposed to mention.",
        code: "import re\n\nclass OutputGuardrails:\n    def __init__(self):\n        self.pii_patterns = {\n            \"email\": r\"\\\\b[\\\\w.-]+@[\\\\w.-]+\\\\.\\\\w+\\\\b\",\n            \"phone\": r\"\\\\b\\\\d{3}[-.]?\\\\d{3}[-.]?\\\\d{4}\\\\b\",\n        }\n        self.harmful_keywords = [\"how to make\", \"suicide methods\", \"hack into\"]\n\n    def check(self, text):\n        violations = []\n        # PII re-check\n        for pii, pattern in self.pii_patterns.items():\n            if re.search(pattern, text):\n                text = re.sub(pattern, f\"[REDACTED_{pii.upper()}]\", text)\n                violations.append(f\"pii_{pii}\")\n        # Harmful content\n        for keyword in self.harmful_keywords:\n            if keyword in text.lower():\n                violations.append(\"harmful_content\")\n                text = \"I'm unable to provide that information.\"\n        return text, violations\n\n    def verify_grounding(self, response, source_chunks):\n        \"\"\"Check if claims are grounded in source documents.\"\"\"\n        claims = re.split(r'(?<=[.!?])\\\\s+', response)\n        grounded = []\n        for claim in claims:\n            for chunk in source_chunks:\n                if len(set(claim.lower().split()) & set(chunk.lower().split())) > len(claim.split()) * 0.5:\n                    grounded.append((claim, True))\n                    break\n            else:\n                grounded.append((claim, False))\n        return grounded",
        useCases: ["PII protection in responses", "Content moderation", "Bias detection", "Grounding verification"],
        projectIdea: "Build output guardrails with PII filtering, harmful content detection, and grounding verification against source documents.",
        examples: ["Azure AI Content Safety", "AWS Comprehend PII detection"]
      },
      {
        topic: "Retrieval Guardrails",
        details: "Document access control, tenant isolation, relevance filtering",
        concept: "Controls what documents can be retrieved. Multi-tenant isolation ensures users only see their data. Access control prevents unauthorized document access. Relevance filtering removes low-quality matches.",
        code: "from qdrant_client.models import Filter, FieldCondition, MatchValue\n\nclass RetrievalGuardrails:\n    def __init__(self, vectorstore):\n        self.vectorstore = vectorstore\n\n    def search_with_access(self, query, user_id, tenant_id, role=\"user\"):\n        # Build access control filter\n        access_filter = Filter(must=[\n            FieldCondition(key=\"tenant_id\", match=MatchValue(value=tenant_id)),\n        ])\n        # Admin sees everything in tenant, user sees only their docs\n        if role != \"admin\":\n            access_filter.must.append(\n                FieldCondition(key=\"visible_to\", match=MatchValue(value=user_id))\n            )\n\n        results = self.vectorstore.search(\n            collection_name=\"documents\",\n            query_vector=embeddings.encode(query).tolist(),\n            query_filter=access_filter,\n            limit=10\n        )\n        # Filter low-relevance results\n        return [r for r in results if r.score > 0.6]",
        useCases: ["Multi-tenant SaaS", "Document access control", "Regulatory compliance", "Data isolation"],
        projectIdea: "Implement multi-tenant retrieval guardrails with Qdrant filtering, role-based access, and relevance thresholds.",
        examples: ["Qdrant payload filtering", "Pinecone namespaces"]
      },
      {
        topic: "Audit Trail",
        details: "Full chain-of-custody: query → process → search → rerank → generate → ground",
        concept: "Every step logged for compliance. Full chain-of-custody: query received, processing applied, documents retrieved, reranking scores, generation parameters, grounding verification. Required for regulated industries.",
        code: "import datetime\nimport json\n\nclass AuditTrail:\n    def __init__(self):\n        self.logs = []\n\n    def log(self, event_type, data):\n        entry = {\n            \"timestamp\": datetime.datetime.now().isoformat(),\n            \"event_type\": event_type,\n            \"data\": data\n        }\n        self.logs.append(entry)\n        return entry\n\n    def log_query(self, query_id, user_id, query):\n        return self.log(\"query_received\", {\n            \"query_id\": query_id, \"user_id\": user_id, \"query\": query\n        })\n\n    def log_retrieval(self, query_id, docs, scores):\n        return self.log(\"retrieval\", {\n            \"query_id\": query_id,\n            \"doc_ids\": [d[\"id\"] for d in docs],\n            \"scores\": scores\n        })\n\n    def log_generation(self, query_id, prompt, response, model, tokens):\n        return self.log(\"generation\", {\n            \"query_id\": query_id, \"model\": model,\n            \"tokens_used\": tokens, \"response_length\": len(response)\n        })\n\n    def log_grounding(self, query_id, claims, grounded_pct):\n        return self.log(\"grounding_check\", {\n            \"query_id\": query_id,\n            \"total_claims\": len(claims),\n            \"grounded_percentage\": grounded_pct\n        })\n\n    def export_for_compliance(self, query_id):\n        return [l for l in self.logs if l[\"data\"].get(\"query_id\") == query_id]",
        useCases: ["Regulatory compliance", "HIPAA/SOX audit", "Incident investigation", "Quality monitoring"],
        projectIdea: "Build an audit trail system that logs every step of the RAG pipeline with query_id tracking and compliance export.",
        examples: ["LangSmith tracing", "LangFuse audit logs"]
      },
      {
        topic: "Rate Limiting",
        details: "Per-user, per-tenant, per-endpoint rate limits with burst protection",
        concept: "Controls request frequency to prevent abuse and manage costs. Per-user limits prevent individual abuse, per-tenant limits manage shared resources, per-endpoint limits protect expensive operations. Burst protection handles traffic spikes gracefully.",
        code: "import time\nfrom collections import defaultdict\n\nclass RateLimiter:\n    def __init__(self, max_requests=100, window_seconds=60, burst_size=20):\n        self.max_requests = max_requests\n        self.window = window_seconds\n        self.burst_size = burst_size\n        self.requests = defaultdict(list)\n\n    def check_rate_limit(self, user_id, endpoint=\"default\"):\n        key = f\"{user_id}:{endpoint}\"\n        now = time.time()\n        # Clean old entries\n        self.requests[key] = [t for t in self.requests[key] if now - t < self.window]\n\n        if len(self.requests[key]) >= self.max_requests:\n            return False, \"Rate limit exceeded\"\n        if len(self.requests[key]) >= self.burst_size:\n            return False, \"Burst limit exceeded\"\n\n        self.requests[key].append(now)\n        remaining = self.max_requests - len(self.requests[key])\n        return True, f\"{remaining} requests remaining\"\n\n    def get_headers(self, user_id):\n        ok, msg = self.check_rate_limit(user_id)\n        return {\n            \"X-RateLimit-Limit\": str(self.max_requests),\n            \"X-RateLimit-Remaining\": msg.split()[0] if ok else \"0\",\n            \"X-RateLimit-Reset\": str(int(time.time() + self.window))\n        }",
        useCases: ["API abuse prevention", "Cost management", "Fair usage", "DDoS protection"],
        projectIdea: "Build a rate limiting middleware for an AI API with per-user/per-tenant limits, burst protection, and monitoring dashboard.",
        examples: ["FastAPI rate limiting", "Redis-based rate limiters"]
      }
    ]
  },
  {
    id: "production-mlops",
    heading: "PRODUCTION MLOPS STACK",
    icon: "📊",
    rows: [
      {
        topic: "MLflow",
        details: "Experiment tracking, model registry, deployment management",
        concept: "Open-source MLOps platform for experiment tracking, model versioning, and deployment. Log parameters, metrics, artifacts. Register models, compare experiments, deploy to various platforms.",
        code: "import mlflow\nimport mlflow.sklearn\nfrom sklearn.ensemble import RandomForestClassifier\nfrom sklearn.metrics import accuracy_score\n\nmlflow.set_experiment(\"rag-evaluation\")\n\nwith mlflow.start_run()::\n    # Log parameters\n    mlflow.log_param(\"chunk_size\", 512)\n    mlflow.log_param(\"embedding_model\", \"bge-large\")\n    mlflow.log_param(\"top_k\", 5)\n\n    # Train and evaluate\n    model = RandomForestClassifier(n_estimators=100)\n    model.fit(X_train, y_train)\n    y_pred = model.predict(X_test)\n    accuracy = accuracy_score(y_test, y_pred)\n\n    # Log metrics\n    mlflow.log_metric(\"accuracy\", accuracy)\n    mlflow.log_metric(\"f1_score\", f1)\n\n    # Log model\n    mlflow.sklearn.log_model(model, \"model\")\n    print(f\"Run ID: {mlflow.active_run().info.run_id}\")",
        useCases: ["Experiment tracking", "Model versioning", "A/B testing models", "Model deployment"],
        projectIdea: "Set up MLflow for a RAG pipeline — track chunking strategies, embedding models, and retrieval parameters with comparison dashboards.",
        examples: ["MLflow documentation", "Databricks MLflow"]
      },
      {
        topic: "LangFuse / LangSmith",
        details: "LLM tracing, prompt management, evaluation, monitoring",
        concept: "LLM-specific observability tools. Trace every LLM call — input, output, latency, cost, token usage. Manage prompt versions, run evaluations, monitor quality over time. Essential for production LLM applications.",
        code: "# LangFuse tracing\nfrom langfuse import Langfuse\nfrom langfuse.decorators import observe\n\nlangfuse = Langfuse(public_key=\"pk-...\", secret_key=\"sk-...\", host=\"https://cloud.langfuse.com\")\n\n@observe(as_type=\"generation\")\ndef rag_query(query: str):\n    # Trace retrieval\n    docs = vectorstore.similarity_search(query, k=5)\n    langfuse.score(name=\"retrieval_count\", value=len(docs))\n\n    # Trace generation\n    response = llm.invoke(f\"Context: {docs}\\nQuery: {query}\")\n\n    # Score quality\n    langfuse.score(name=\"response_length\", value=len(response.content))\n\n    return response.content\n\n# All traces visible in LangFuse dashboard\n# Latency, cost, tokens, quality scores per call",
        useCases: ["LLM call tracing", "Cost monitoring", "Quality evaluation", "Prompt management"],
        projectIdea: "Integrate LangFuse into a RAG application to trace every query, track costs, and set up quality alerts.",
        examples: ["LangFuse cloud", "LangSmith by LangChain"]
      },
      {
        topic: "Prometheus + Grafana",
        details: "Metrics collection, dashboards, alerting for AI systems",
        concept: "Industry-standard monitoring stack. Prometheus scrapes metrics from AI services, Grafana visualizes them. Custom dashboards for LLM latency, RAG accuracy, error rates, queue depths. Alert on anomalies.",
        code: "# Prometheus metrics for AI service\nfrom prometheus_client import Counter, Histogram, Gauge, start_http_server\n\n# Define metrics\nREQUEST_COUNT = Counter('ai_requests_total', 'Total requests', ['endpoint', 'status'])\nREQUEST_LATENCY = Histogram('ai_request_latency_seconds', 'Request latency', ['endpoint'])\nRAG_ACCURACY = Gauge('rag_accuracy_score', 'RAG accuracy score')\nLLM_TOKENS = Counter('llm_tokens_total', 'Total LLM tokens', ['model', 'type'])\n\n# Instrument your code\nwith REQUEST_LATENCY.labels(endpoint='rag_query').time():\n    result = rag.query(user_query)\n    REQUEST_COUNT.labels(endpoint='rag_query', status='success').inc()\n    LLM_TOKENS.labels(model='gpt-4o', type='input').inc(result.usage.prompt_tokens)\n    LLM_TOKENS.labels(model='gpt-4o', type='output').inc(result.usage.completion_tokens)\n\n# Start Prometheus metrics server\nstart_http_server(8000)\n\n# Grafana dashboard shows:\n# - Request rate, latency p50/p95/p99\n# - Error rate by endpoint\n# - RAG accuracy trend\n# - LLM token consumption and cost",
        useCases: ["System monitoring", "Alert management", "Performance dashboards", "Capacity planning"],
        projectIdea: "Set up Prometheus + Grafana monitoring for a RAG API with dashboards for latency, accuracy, token usage, and error rates.",
        examples: ["Prometheus documentation", "Grafana AI dashboards"]
      },
      {
        topic: "Weights & Biases",
        details: "Experiment tracking, hyperparameter optimization, model evaluation",
        concept: "W&B provides experiment tracking, visualization, and collaboration for ML teams. Track hyperparameters, metrics, model artifacts. Sweep for optimal hyperparameters. Compare experiments interactively.",
        code: "import wandb\n\nwandb.init(project=\"rag-optimization\")\n\n# Log config\nwandb.config.update({\n    \"chunk_size\": 512,\n    \"overlap\": 50,\n    \"embedding_model\": \"bge-large\",\n    \"reranker\": \"bge-reranker-v2-m3\",\n    \"top_k\": 5\n})\n\n# Run evaluation\naccuracy = evaluate_rag(config)\nf1 = compute_f1(predictions, ground_truth)\n\n# Log metrics\nwandb.log({\n    \"accuracy\": accuracy,\n    \"f1\": f1,\n    \"latency_ms\": avg_latency,\n    \"cost_per_query\": cost\n})\n\n# Log artifacts (retrieved documents, predictions)\nwandb.log({\"predictions\": wandb.Table(dataframe=pred_df)})\n\nwandb.finish()\n\n# Hyperparameter sweep\nsweep_config = {\n    \"method\": \"bayes\",\n    \"metric\": {\"name\": \"accuracy\", \"goal\": \"maximize\"},\n    \"parameters\": {\n        \"chunk_size\": {\"values\": [256, 512, 1024]},\n        \"top_k\": {\"values\": [3, 5, 10]},\n    }\n}",
        useCases: ["Experiment tracking", "Hyperparameter optimization", "Model comparison", "Team collaboration"],
        projectIdea: "Set up a W&B sweep to optimize RAG parameters (chunk size, top_k, embedding model) with interactive comparison.",
        examples: ["Weights & Biases", "W&B Sweeps"]
      },
      {
        topic: "DVC (Data Version Control)",
        details: "Dataset versioning, pipeline management, experiment reproducibility",
        concept: "Git for data and ML pipelines. Version control datasets, track which data produced which model, reproduce experiments exactly. DVC stores data in remote storage (S3, GCS) while using Git for metadata.",
        code: "# Initialize DVC\n# dvc init\n\n# Track dataset\ndvc add data/training_data.parquet\ngit add data/training_data.parquet.dvc .gitignore\n\n# Define pipeline (dvc.yaml)\nstages:\n  prepare:\n    cmd: python src/prepare.py\n    deps: [data/training_data.parquet]\n    outs: [data/prepared]\n  train:\n    cmd: python src/train.py\n    deps: [data/prepared, src/train.py]\n    params: [params.yaml:model]\n    outs: [models/model.pkl]\n    metrics: [metrics.json]\n  evaluate:\n    cmd: python src/evaluate.py\n    deps: [models/model.pkl, data/prepared]\n    metrics: [metrics/accuracy.json]\n\n# Run full pipeline\ndvc repro\n\n# Compare experiments\ndvc metrics diff\n# Shows parameter changes and metric deltas",
        useCases: ["Dataset versioning", "Pipeline reproducibility", "Experiment comparison", "Collaborative ML"],
        projectIdea: "Version a RAG dataset with DVC, track embedding experiments, and set up a reproducible evaluation pipeline.",
        examples: ["DVC documentation", "DVC + GitHub Actions"]
      },
      {
        topic: "Kubeflow",
        details: "Kubernetes-native ML workflows, pipeline orchestration, model serving",
        concept: "ML platform on Kubernetes. Orchestrate multi-step ML pipelines as DAGs. Components: Kubeflow Pipelines (workflow), Katib (hyperparameter tuning), KServe (model serving), Notebooks (development).",
        code: "# Kubeflow Pipeline definition\nfrom kfp import dsl\n\n@dsl.pipeline(name='rag-pipeline')\ndef rag_pipeline():\n    prepare = dsl.ContainerOp(\n        name='prepare',\n        image='myregistry/prepare:latest',\n        command=['python', 'prepare.py'],\n        arguments={'chunk-size': 512}\n    )\n\n    embed = dsl.ContainerOp(\n        name='embed',\n        image='myregistry/embed:latest',\n        command=['python', 'embed.py'],\n    ).after(prepare)\n\n    evaluate = dsl.ContainerOp(\n        name='evaluate',\n        image='myregistry/evaluate:latest',\n        command=['python', 'evaluate.py'],\n    ).after(embed)\n\n    # Pipeline: prepare → embed → evaluate",
        useCases: ["ML pipeline orchestration", "Hyperparameter tuning", "Model serving at scale", "Multi-step workflows"],
        projectIdea: "Deploy a RAG pipeline on Kubeflow with automated preparation, embedding, evaluation, and model serving stages.",
        examples: ["Kubeflow Pipelines", "KServe model serving"]
      },
      {
        topic: "Ray Serve",
        details: "Distributed model serving, autoscaling, multi-model deployment",
        concept: "Ray Serve is a scalable model serving library. Deploy multiple models, autoscale based on traffic, handle model composition (chain models). Supports any ML framework. Handles A/B testing and canary deployments.",
        code: "from ray import serve\nfrom fastapi import Request\nimport json\n\n@serve.deployment(num_replicas=3, ray_actor_options={\"num_gpus\": 0.5})\nclass RAGModel:\n    def __init__(self):\n        self.vectorstore = load_vectorstore()\n        self.llm = load_llm()\n\n    async def __call__(self, request: Request):\n        body = await request.json()\n        query = body[\"query\"]\n\n        # Retrieve\n        docs = self.vectorstore.search(query, k=5)\n\n        # Generate\n        response = self.llm.generate(query, docs)\n\n        return {\"answer\": response, \"sources\": [d[\"source\"] for d in docs]}\n\n# Deploy with autoscaling\napp = serve.run(RAGModel.bind(), route_prefix=\"/rag\")\n# Handles: load balancing, autoscaling, fault tolerance",
        useCases: ["Multi-model serving", "A/B testing", "Autoscaling", "GPU optimization"],
        projectIdea: "Deploy a RAG system with Ray Serve that autoscales replicas based on traffic and supports A/B testing between models.",
        examples: ["Ray Serve docs", "Anyscale platform"]
      }
    ]
  },
  {
    id: "career-roadmap",
    heading: "AI ENGINEER CAREER ROADMAP",
    icon: "💼",
    rows: [
      {
        topic: "Months 1-3: Foundation",
        details: "Python, FastAPI, LLM APIs (OpenAI, Claude), RAG basics, LangChain 101",
        concept: "Build the core programming foundation. Master Python (async, decorators, generators), FastAPI for building APIs, and interact with major LLM APIs. Build your first RAG system and understand embedding, vector search, and prompt engineering basics.",
        code: "# Foundation Project — Simple RAG API\nfrom fastapi import FastAPI\nfrom openai import OpenAI\nfrom qdrant_client import QdrantClient\n\napp = FastAPI()\nclient = OpenAI()\nvectorstore = QdrantClient(url=\"http://localhost:6333\")\n\n@app.post(\"/chat\")\nasync def chat(query: str):\n    # Embed query\n    embedding = client.embeddings.create(\n        model=\"text-embedding-3-small\", input=query\n    ).data[0].embedding\n\n    # Search vector DB\n    results = vectorstore.search(\"docs\", embedding, limit=5)\n    context = \"\\n\".join([r.payload[\"text\"] for r in results])\n\n    # Generate answer\n    response = client.chat.completions.create(\n        model=\"gpt-4o\",\n        messages=[\n            {\"role\": \"system\", \"content\": \"Answer from context.\"},\n            {\"role\": \"user\", \"content\": f\"Context: {context}\\nQ: {query}\"}\n        ]\n    )\n    return {\"answer\": response.choices[0].message.content}",
        useCases: ["Build portfolio projects", "Contribute to open source", "Complete online courses", "Start a blog"],
        projectIdea: "Build a production-ready RAG chatbot with FastAPI backend, Qdrant vector DB, and OpenAI embeddings. Deploy on Railway or Render.",
        examples: ["FastAPI documentation", "OpenAI API quickstart", "LangChain tutorials"]
      },
      {
        topic: "Months 4-6: Core Skills",
        details: "LangGraph, Agents, MCP, CrewAI, Vector DBs, Production RAG",
        concept: "Level up to agent frameworks and production patterns. Master LangGraph for stateful agents, understand MCP for tool integration, and build production RAG with hybrid search, reranking, and evaluation.",
        code: "# Core Skills Project — Multi-Agent Research System\nfrom langgraph.graph import StateGraph, END\nfrom langchain_openai import ChatOpenAI\n\n# Build a multi-agent system with:\n# 1. Planner agent — breaks down research tasks\n# 2. Researcher agent — searches and gathers info\n# 3. Writer agent — synthesizes findings\n# 4. Reviewer agent — critiques and improves\n\n# This demonstrates: LangGraph, tool use, multi-agent orchestration,\n# evaluation, and production patterns",
        useCases: ["Build multi-agent projects", "Contribute to LangGraph/CrewAI", "Attend AI meetups", "Build portfolio"],
        projectIdea: "Build a multi-agent research system with Planner, Researcher, Writer, and Reviewer agents using LangGraph. Add evaluation with RAGAS.",
        examples: ["LangGraph documentation", "CrewAI examples", "MCP specification"]
      },
      {
        topic: "Months 7-9: Production",
        details: "Docker, CI/CD, Evals, vLLM, Fine-tuning, Monitoring",
        concept: "Production engineering skills. Containerize AI apps, set up CI/CD pipelines, implement evaluation frameworks, learn model serving (vLLM), and fine-tune models. Understand monitoring and observability.",
        code: "# Production Deployment — Docker + CI/CD\n# Dockerfile\nFROM python:3.11-slim\nWORKDIR /app\nCOPY requirements.txt .\nRUN pip install -r requirements.txt\nCOPY . .\nEXPOSE 8000\nCMD [\"uvicorn\", \"main:app\", \"--host\", \"0.0.0.0\", \"--port\", \"8000\"]\n\n# .github/workflows/deploy.yml\n# name: Deploy\n# on:\n#   push:\n#     branches: [main]\n# jobs:\n#   deploy:\n#     runs-on: ubuntu-latest\n#     steps:\n#       - uses: actions/checkout@v4\n#       - run: docker build -t ai-app .\n#       - run: docker push registry/ai-app:latest\n#       - run: kubectl apply -f k8s/",
        useCases: ["Container orchestration", "CI/CD for AI", "Model serving", "Monitoring and alerting"],
        projectIdea: "Set up a complete CI/CD pipeline for a RAG application with Docker, GitHub Actions, automated evaluation gates, and production monitoring.",
        examples: ["Docker documentation", "GitHub Actions", "vLLM serving"]
      },
      {
        topic: "Months 10-12: Specialization",
        details: "Domain expertise, Compliance, Guardrails, K8s, Portfolio projects",
        concept: "Choose a domain specialization: healthcare AI, fintech AI, enterprise AI, or research AI. Build compliance and guardrails expertise. Deploy on Kubernetes. Create portfolio projects that demonstrate end-to-end skills.",
        code: "# Specialization Project — Compliance-First RAG\n# Features:\n# 1. Multi-tenant architecture with Qdrant namespace isolation\n# 2. PII detection and masking (input + output)\n# 3. Full audit trail with query_id tracking\n# 4. Grounding verification for every response\n# 5. Rate limiting per user/tenant\n# 6. Evaluation suite with RAGAS\n# 7. Grafana dashboard for monitoring\n# 8. Docker + Kubernetes deployment\n\n# This demonstrates: enterprise patterns, compliance, security,\n# production engineering, and domain expertise",
        useCases: ["Build specialized portfolio", "Get certified (AWS ML, GCP ML)", "Contribute to open source", "Apply for roles"],
        projectIdea: "Build a compliance-first RAG system for healthcare with multi-tenancy, PII protection, audit trails, and EU AI Act compliance documentation.",
        examples: ["AWS ML Specialty cert", "GCP Professional ML Engineer", "Kubernetes documentation"]
      },
      {
        topic: "Year 2: Senior",
        details: "Multi-agent systems, Architecture design, Team lead, Open source contributions",
        concept: "Transition to senior roles. Design complex multi-agent architectures, lead technical decisions, mentor junior engineers. Contribute to major open-source AI projects. Speak at meetups and conferences.",
        code: "# Senior-level Architecture Decision\n# Example: Choosing between monolith vs multi-agent\n\n# Monolith (simpler, faster to ship)\n# - Single RAG pipeline with tool routing\n# - Good for: < 10K queries/day, < 5 domains\n# - Pros: simpler debugging, lower latency\n# - Cons: harder to scale, domain coupling\n\n# Multi-Agent (complex, more scalable)\n# - Separate agents per domain/task\n# - Good for: > 10K queries/day, > 5 domains\n# - Pros: independent scaling, domain isolation\n# - Cons: orchestration complexity, higher latency\n\n# Decision: Start monolith, extract agents as needed",
        useCases: ["Architecture design", "Technical leadership", "Open source contribution", "Mentoring"],
        projectIdea: "Lead the design and implementation of a multi-agent AI system that handles 3+ domains with independent scaling.",
        examples: ["System Design for AI", "Architecture Decision Records"]
      },
      {
        topic: "Year 3-5: Expert",
        details: "Research, Publications, Conference talks, Consulting, CTO track",
        concept: "Reach expert level. Publish research, speak at conferences (NeurIPS, ICML, AI Engineer Summit), consult for enterprises, or pursue CTO/VP Engineering roles. Shape the direction of AI in your organization or industry.",
        code: "# Expert-level Contributions\n# 1. Research: Publish papers on novel RAG/agent architectures\n# 2. Open Source: Maintain or create popular AI frameworks\n# 3. Speaking: Present at conferences and meetups\n# 4. Consulting: Advise enterprises on AI strategy\n# 5. Leadership: CTO/VP Engineering at AI startups\n# 6. Education: Create courses, write books\n\n# Example research contribution:\n# \"Adaptive RAG with Dynamic Retrieval Strategies\"\n# - Novel approach to deciding when/how to retrieve\n# - Benchmarks against existing methods\n# - Open-source implementation with evaluation suite",
        useCases: ["Research publications", "Conference talks", "Enterprise consulting", "Executive leadership"],
        projectIdea: "Publish a research paper on a novel AI architecture, present it at a conference, and release an open-source implementation.",
        examples: ["AI Engineer Summit", "NeurIPS", "ICML", "arXiv publications"]
      }
    ]
  }
]

export const TOTAL_KNOWLEDGE_ROWS = KNOWLEDGE_SECTIONS.reduce((sum, s) => sum + s.rows.length, 0)
