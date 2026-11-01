export const SYSTEM_DESIGN_DATA = {
  "id": "system-design",
  "title": "System Design",
  "icon": "🏗️",
  "description": "66 production-focused system design articles for senior engineers.",
  "categories": [
    {
      "name": "AI Systems",
      "icon": "🤖",
      "concepts": [
        {
          "title": "Context Window Management",
          "slug": "context-window-management",
          "tldr": "Finite context windows require explicit strategies: chunking, summarization, selective retrieval, and rolling windows. Mismanaging context leads directly to hallucination spikes, instruction drift, and unpredictable API costs.",
          "whyItMatters": [
            { "num": "1", "title": "Conversational AI", "text": "ChatGPT and Claude.ai manage multi-turn context through rolling windows and server-side summarization. System prompts are cached at the prefix level." },
            { "num": "2", "title": "Customer Support", "text": "Intercom and Zendesk AI inject CRM data and past ticket history into each LLM call." },
            { "num": "3", "title": "Legal Document Review", "text": "Legal documents routinely exceed 100K tokens. Platforms chunk documents by section and retrieve only relevant passages." }
          ],
          "howItWorks": "The solution is a Context Orchestration Layer — a stateful intermediary between application logic and the LLM API. It curates, compresses, and injects only the most relevant content into each prompt. It maintains a memory hierarchy: system prompt stays fixed; recent turns are kept verbatim; older history is summarized; long-term facts are retrieved from a vector store.",
          "pitfalls": [
            { "text": "Naive history concatenation rapidly exhausts token limits." },
            { "text": "Blind summarization collapses critical constraints into vague summaries." },
            { "text": "Placing static content after dynamic content defeats KV caching." },
            { "text": "Injecting important facts in the middle: LLMs attend poorly to mid-context content." },
            { "text": "Assuming large windows eliminate the problem: every token costs money." }
          ],
          "keyTerms": [
            { "term": "Context Window", definition: "The finite token limit covering both input and output for an LLM." },
            { "term": "KV Cache", definition: "Provider-level caching of key-value pairs to reduce latency." },
            { "term": "Lost in the Middle", definition: "LLMs attend poorly to content injected mid-context." },
            { "term": "Token Counting", definition: "Pre-flight check to prevent exceeding context limits." }
          ],
          "codeExample": "from langchain.text_splitter import RecursiveCharacterTextSplitter\n\nsplitter = RecursiveCharacterTextSplitter(\n    chunk_size=1000, chunk_overlap=200\n)\ndocs = splitter.split_documents(raw_docs)\nprint(f'Split into {len(docs)} chunks')",
          "relatedConcepts": ["RAG Architecture", "AI Agent Orchestration", "Streaming LLM Responses"]
        },
        {
          "title": "RAG Architecture",
          "slug": "rag-architecture",
          "tldr": "Retrieval quality — not the LLM — is the primary failure mode in production RAG systems; bad chunks produce confident, wrong answers.",
          "whyItMatters": [
            { "num": "1", "title": "Enterprise Search", "text": "Notion AI uses RAG to answer questions from internal documentation." },
            { "num": "2", "title": "Healthcare", "text": "Medical AI retrieves clinical guidelines and research papers to assist diagnosis." },
            { "num": "3", "title": "Financial Analysis", "text": "Banks use RAG to answer compliance questions by retrieving relevant regulations." }
          ],
          "howItWorks": "RAG combines retrieval from a knowledge base with LLM generation. Query is embedded, vector search finds relevant chunks, those chunks are injected into the prompt, and the LLM generates grounded answers. Retrieval quality determines answer quality.",
          "pitfalls": [
            { "text": "Fixed-size chunks split sentences and lose context." },
            { "text": "Embedding model choice determines retrieval quality." },
            { "text": "A reranker dramatically improves precision over initial retrieval." },
            { "text": "Without measuring retrieval recall, you cannot improve." }
          ],
          "keyTerms": [
            { "term": "Vector Embedding", definition: "A dense numerical representation capturing semantic meaning." },
            { "term": "Chunking", definition: "Splitting documents into pieces for embedding and retrieval." },
            { "term": "Reranking", definition: "A second-pass model that re-scores retrieved chunks." }
          ],
          "codeExample": "from langchain.vectorstores import Chroma\nfrom langchain.embeddings import OpenAIEmbeddings\n\nvectorstore = Chroma.from_documents(docs, OpenAIEmbeddings())\nretriever = vectorstore.as_retriever(search_kwargs={'k': 5})",
          "relatedConcepts": ["Vector Database Selection", "Context Window Management"]
        },
        {
          "title": "AI Agent Orchestration",
          "slug": "ai-agent-orchestration",
          "tldr": "Without an explicit orchestration layer, multi-agent systems devolve into infinite loops, redundant API calls, and non-deterministic failures.",
          "whyItMatters": [
            { "num": "1", "title": "Autonomous Coding", "text": "GitHub Copilot Workspace coordinates planning, code generation, testing, and review agents." },
            { "num": "2", "title": "Customer Service", "text": "Multi-agent systems route queries between intent classifier, knowledge retriever, and response generator." },
            { "num": "3", "title": "Data Analysis", "text": "Orchestration coordinates data extraction, transformation, analysis, and visualization agents." }
          ],
          "howItWorks": "Agent orchestration manages how multiple AI agents collaborate. It defines topology (sequential, parallel, hierarchical), state management, control flow (route, loop, branch, terminate), and error handling. Common patterns: Supervisor (one delegates to others), Peer (equals communicate), Pipeline (sequential processing).",
          "pitfalls": [
            { "text": "Without termination conditions, agents cycle indefinitely." },
            { "text": "One failing agent cascades failures through the system." },
            { "text": "Uncontrolled interactions lead to massive API bills." },
            { "text": "Same input can produce different interaction patterns." }
          ],
          "keyTerms": [
            { "term": "Supervisor Pattern", definition: "One agent delegates tasks to specialized sub-agents." },
            { "term": "Topology", definition: "The graph structure defining agent communication." },
            { "term": "State Machine", definition: "A formal model for tracking agent execution states." }
          ],
          "codeExample": "from langgraph.graph import StateGraph, END\n\ndef supervisor(state):\n    return {'next': 'code_agent' if state['type'] == 'code' else 'research'}\n\ngraph = StateGraph(dict)\ngraph.add_node('supervisor', supervisor)\ngraph.add_conditional_edges('supervisor', lambda s: s['next'])\ngraph.set_entry_point('supervisor')",
          "relatedConcepts": ["Context Window Management", "RAG Architecture"]
        },
        {
          "title": "LLM Gateway Pattern",
          "slug": "llm-gateway",
          "tldr": "An LLM Gateway centralizes routing, authentication, rate limiting, and cost tracking across all LLM provider interactions.",
          "whyItMatters": [
            { "num": "1", "title": "Enterprise Security", "text": "Route all LLM traffic through a gateway to enforce DLP policies and audit logs." },
            { "num": "2", "title": "Cost Management", "text": "Track token usage per team, model, and use case for chargeback models." },
            { "num": "3", "title": "Provider Redundancy", "text": "Auto-failover to backup providers when the primary goes down." }
          ],
          "howItWorks": "An LLM Gateway sits between your application and LLM providers as a reverse proxy. It handles authentication, model routing, rate limiting, prompt caching, observability, and security scanning. Implementations include LiteLLM, Portkey, and custom Kong plugins.",
          "pitfalls": [
            { "text": "The gateway itself must be highly available." },
            { "text": "Each hop adds latency; optimize the hot path." },
            { "text": "Cached responses must be invalidated when context changes." },
            { "text": "Must handle model deprecations gracefully." }
          ],
          "keyTerms": [
            { "term": "Reverse Proxy", definition: "A server routing and transforming requests in front of backends." },
            { "term": "Rate Limiting", definition: "Controlling requests per time window to prevent abuse." },
            { "term": "Failover", definition: "Automatically switching to a backup provider." }
          ],
          "codeExample": "import litellm\nresponse = litellm.completion(\n    model='gpt-4',\n    messages=[{'role': 'user', 'content': 'Hello'}],\n    fallbacks=['claude-3-sonnet', 'gpt-3.5-turbo']\n)",
          "relatedConcepts": ["Production AI Reliability", "AI Observability"]
        }
      ]
    },
    {
      "name": "Workflow Engineering",
      "icon": "⚙️",
      "concepts": [
        {
          "title": "Event-Driven Architecture",
          "slug": "event-driven",
          "tldr": "Event-driven architecture decouples producers and consumers through asynchronous events, enabling scalable and resilient systems.",
          "whyItMatters": [
            { "num": "1", "title": "E-commerce", "text": "Amazon processes millions of orders per minute using event-driven patterns." },
            { "num": "2", "title": "Real-time Analytics", "text": "Uber uses event streams for driver tracking and dynamic pricing." },
            { "num": "3", "title": "IoT", "text": "Smart home platforms process millions of sensor events per second." }
          ],
          "howItWorks": "Components communicate by producing and consuming events through a message broker. Events are published when something happens; interested services subscribe and react independently. This decoupling enables independent deployment, fault isolation, and event replay.",
          "pitfalls": [
            { "text": "Guaranteeing event order across partitions is complex." },
            { "text": "Changing event formats breaks consumers; use schema registries." },
            { "text": "Consumers must be idempotent for at-least-once delivery." },
            { "text": "Tracing across async services is harder than synchronous calls." }
          ],
          "keyTerms": [
            { "term": "Event", definition: "An immutable record of something that happened." },
            { "term": "Message Broker", definition: "Infrastructure routing events between producers and consumers." },
            { "term": "Idempotency", definition: "Processing the same event multiple times produces the same result." }
          ],
          "codeExample": "import asyncio\n\nclass EventBus:\n    def __init__(self):\n        self.subscribers = {}\n    def subscribe(self, event_type, handler):\n        self.subscribers.setdefault(event_type, []).append(handler)\n    async def publish(self, event):\n        for h in self.subscribers.get(type(event), []):\n            await h(event)",
          "relatedConcepts": ["Saga Pattern", "Task Queues"]
        },
        {
          "title": "Saga Pattern",
          "slug": "saga-pattern",
          "tldr": "Sagas manage distributed transactions by breaking them into local transactions with compensating actions for rollback.",
          "whyItMatters": [
            { "num": "1", "title": "E-commerce", "text": "Order → Payment → Inventory → Shipping. If payment fails, compensate by releasing the order." },
            { "num": "2", "title": "Travel", "text": "Flight → Hotel → Car. If hotel unavailable, cancel flight and inform user." },
            { "num": "3", "title": "Banking", "text": "Fund transfer: debit one account, credit another. If crediting fails, reverse the debit." }
          ],
          "howItWorks": "A Saga is a sequence of local transactions. Each step publishes an event triggering the next. If any step fails, compensating transactions execute in reverse. Choreography (decentralized) vs Orchestration (central coordinator).",
          "pitfalls": [
            { "text": "Compensating transactions must be idempotent." },
            { "text": "You can undo a database transaction but not an email already sent." },
            { "text": "Large sagas are hard to debug." },
            { "text": "Concurrent sagas on same resources cause conflicts." }
          ],
          "keyTerms": [
            { "term": "Compensating Transaction", definition: "An action that undoes a previous step." },
            { "term": "Choreography", definition: "Decentralized saga coordination via events." },
            { "term": "Orchestration", definition: "Centralized saga coordination via a coordinator." }
          ],
          "codeExample": "class OrderSaga:\n    async def execute(self):\n        steps = [\n            (self.reserve, self.release),\n            (self.pay, self.refund),\n        ]\n        for do, undo in steps:\n            try:\n                await do()\n                self.completed.append(undo)\n            except Exception:\n                for undo in reversed(self.completed):\n                    await undo()\n                raise",
          "relatedConcepts": ["Event-Driven Architecture", "Distributed Transactions"]
        }
      ]
    },
    {
      "name": "Reliability Engineering",
      "icon": "🛡️",
      "concepts": [
        {
          "title": "Circuit Breaker Pattern",
          "slug": "circuit-breaker",
          "tldr": "Circuit breakers prevent cascade failures by detecting when a downstream service is failing and short-circuiting calls.",
          "whyItMatters": [
            { "num": "1", "title": "E-commerce", "text": "When payment service is down, circuit breaker trips and returns cached response." },
            { "num": "2", "title": "Social Media", "text": "If recommendation service is slow, return trending content instead." },
            { "num": "3", "title": "Healthcare", "text": "Patient monitoring fails over to backup sensors when primary malfunctions." }
          ],
          "howItWorks": "A circuit breaker wraps function calls and monitors failures. Three states: CLOSED (normal, failures counted), OPEN (all calls rejected), HALF-OPEN (test request allowed). Prevents cascade failures by giving services time to recover.",
          "pitfalls": [
            { "text": "Too sensitive causes false trips; too loose allows cascades." },
            { "text": "Tripping without fallback means users get errors." },
            { "text": "Circuits should auto-reset after cooldown." },
            { "text": "Each downstream service needs its own breaker." }
          ],
          "keyTerms": [
            { "term": "Closed State", definition: "Normal operation, failures counted." },
            { "term": "Open State", definition: "All requests rejected, service recovering." },
            { "term": "Half-Open", definition: "Test request allowed to check recovery." }
          ],
          "codeExample": "import time\nfrom enum import Enum\n\nclass State(Enum):\n    CLOSED, OPEN, HALF_OPEN = range(3)\n\nclass CircuitBreaker:\n    def __init__(self, threshold=5, timeout=30):\n        self.state = State.CLOSED\n        self.failures = 0\n        self.threshold = threshold\n        self.timeout = timeout\n    def call(self, func, *a, **kw):\n        if self.state == State.OPEN:\n            if time.time() - self.last_fail > self.timeout:\n                self.state = State.HALF_OPEN\n            else:\n                raise Exception('OPEN')\n        try:\n            result = func(*a, **kw)\n            self.state = State.CLOSED\n            self.failures = 0\n            return result\n        except Exception:\n            self.failures += 1\n            self.last_fail = time.time()\n            if self.failures >= self.threshold:\n                self.state = State.OPEN\n            raise",
          "relatedConcepts": ["Retry Strategies", "Graceful Degradation"]
        },
        {
          "title": "Retry with Exponential Backoff",
          "slug": "retry-backoff",
          "tldr": "Smart retry strategies with exponential backoff and jitter prevent thundering herds while recovering from transient failures.",
          "whyItMatters": [
            { "num": "1", "title": "Cloud Services", "text": "Exponential backoff prevents millions of clients from hammering during brief outages." },
            { "num": "2", "title": "Payment Processing", "text": "Retry with backoff ensures payments eventually go through without overwhelming gateways." },
            { "num": "3", "title": "Database Connections", "text": "Retry allows connection pools to recover without client pile-up." }
          ],
          "howItWorks": "When a request fails, wait before retrying. Exponential backoff increases wait time: 1s, 2s, 4s, 8s... Jitter adds randomness to prevent synchronized retries (thundering herd). Key: retry only idempotent operations, set maximum retries, distinguish error types (retry 503, not 400).",
          "pitfalls": [
            { "text": "Without jitter, all clients retry simultaneously." },
            { "text": "Retrying non-idempotent POST requests creates duplicates." },
            { "text": "Infinite retries waste resources on permanent failures." },
            { "text": "Retrying too fast overwhelms struggling services." }
          ],
          "keyTerms": [
            { "term": "Exponential Backoff", definition: "Doubling wait time between retries." },
            { "term": "Jitter", definition: "Random delay added to prevent synchronized retries." },
            { "term": "Thundering Herd", definition: "Many clients retrying simultaneously after a pause." },
            { "term": "Retry Budget", definition: "Maximum retries per time window." }
          ],
          "codeExample": "import random, time\n\ndef retry_backoff(func, max_retries=5, base=1):\n    for attempt in range(max_retries):\n        try:\n            return func()\n        except Exception as e:\n            if attempt == max_retries - 1:\n                raise\n            delay = min(base * (2 ** attempt), 60)\n            jitter = random.uniform(0, delay * 0.1)\n            time.sleep(delay + jitter)",
          "relatedConcepts": ["Circuit Breaker Pattern", "Graceful Degradation"]
        }
      ]
    }
  ]
};
