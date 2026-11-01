// ============================================================
// AI DESIGN SPACE — TECHNOLOGY FUNCTIONAL FLOWS
// Every technology on the stack has a functional flow drawn as a
// graph (nodes + edges) rendered draw.io-style, plus the flow
// steps in words and the design patterns it powers.
// ============================================================

const T = (id, name, icon, color, tag, layman, role, flow, steps, patterns, sectors) => ({
  id, name, icon, color, tag, layman, role, flow, steps, patterns, sectors,
})

export const TECH_FLOWS = [
  T('fastapi', 'FastAPI', '⚡', '#f97316', 'API Layer', 'The delivery boy of AI systems — the fast, typed HTTP layer that receives requests, validates them and hands them to the AI inside.', 'Backend API framework for serving AI models, agents and workflows with typed validation and async performance.', {
    nodes: [
      { id: 'client', label: 'Client / UI', kind: 'entry', sub: 'React · Next.js' },
      { id: 'router', label: 'API Router', kind: 'gateway', sub: 'FastAPI' },
      { id: 'validate', label: 'Pydantic Validation', kind: 'data', sub: 'Request models' },
      { id: 'guard', label: 'Guardrails', kind: 'gateway', sub: 'Policy check' },
      { id: 'service', label: 'AI Service', kind: 'ai', sub: 'Agent · Model · RAG' },
      { id: 'response', label: 'Response', kind: 'action', sub: 'JSON · SSE stream' },
    ],
    edges: [
      { from: 'client', to: 'router' },
      { from: 'router', to: 'validate' },
      { from: 'validate', to: 'guard' },
      { from: 'guard', to: 'service' },
      { from: 'service', to: 'response' },
    ],
  }, ['Client sends a request to a typed endpoint', 'Router matches the path and method', 'Pydantic validates and coerces the payload', 'Guardrails and auth policies are applied', 'The AI service (agent/model/RAG) executes', 'A JSON or streaming response returns'], ['agenticRag', 'mcpToolGateway', 'predictiveMLOps'], ['banking', 'healthcare', 'retail']),

  T('langgraph', 'LangGraph', '📊', '#89b4fa', 'Orchestration', 'The conductor of agent workflows — it draws the flow as an actual graph: states, nodes, loops and checkpoints, so the AI can pause, resume and branch.', 'Graph-based orchestration for durable, stateful agent workflows with human-in-the-loop checkpoints.', {
    nodes: [
      { id: 'request', label: 'User Request', kind: 'entry' },
      { id: 'graph', label: 'State Graph', kind: 'ai', sub: 'Typed state' },
      { id: 'plan', label: 'Planner Node', kind: 'ai', sub: 'Decompose' },
      { id: 'tool', label: 'Tool Node', kind: 'action', sub: 'MCP calls' },
      { id: 'rag', label: 'RAG Node', kind: 'data', sub: 'Retrieve' },
      { id: 'check', label: 'Checkpointer', kind: 'store', sub: 'Pause · Resume' },
      { id: 'reply', label: 'Final Answer', kind: 'action' },
    ],
    edges: [
      { from: 'request', to: 'graph' },
      { from: 'graph', to: 'plan' },
      { from: 'plan', to: 'tool', label: 'needs action' },
      { from: 'plan', to: 'rag', label: 'needs context' },
      { from: 'tool', to: 'check' },
      { from: 'rag', to: 'check' },
      { from: 'check', to: 'plan', label: 'loop' },
      { from: 'check', to: 'reply', label: 'done' },
    ],
  }, ['Define the workflow as a typed state graph', 'Nodes execute steps: plan, retrieve, act', 'Conditional edges branch on state', 'Checkpoints persist state for pause/resume', 'Human approval gates pause long-running flows', 'The graph loops or ends with an answer'], ['agenticRag', 'multiAgentCrew', 'autonomousOps'], ['banking', 'insurance', 'logistics']),

  T('rag', 'Retrieval-Augmented Generation', '🔍', '#a6e3a1', 'Knowledge', 'Gives the model a library card: before answering, it looks up your documents in a search index, so answers are grounded in your data instead of guessed.', 'Grounding LLM answers in enterprise documents via embedding, vector search and context assembly.', {
    nodes: [
      { id: 'docs', label: 'Documents', kind: 'store', sub: 'Policies · SOPs' },
      { id: 'chunk', label: 'Chunk & Embed', kind: 'data', sub: 'Splitting' },
      { id: 'index', label: 'Vector Index', kind: 'store', sub: 'VectorDB' },
      { id: 'q', label: 'User Query', kind: 'entry' },
      { id: 'qvec', label: 'Embed Query', kind: 'data' },
      { id: 'search', label: 'Similarity Search', kind: 'data', sub: 'Top-K' },
      { id: 'rerank', label: 'Rerank & Filter', kind: 'ai', sub: 'Hybrid' },
      { id: 'llm', label: 'LLM Generate', kind: 'ai', sub: 'Grounded answer' },
    ],
    edges: [
      { from: 'docs', to: 'chunk' },
      { from: 'chunk', to: 'index' },
      { from: 'q', to: 'qvec' },
      { from: 'qvec', to: 'search' },
      { from: 'index', to: 'search' },
      { from: 'search', to: 'rerank' },
      { from: 'rerank', to: 'llm', label: 'top-k chunks' },
    ],
  }, ['Ingest documents and split into chunks', 'Embed each chunk into a vector index', 'Embed the user query with the same model', 'Search the index for similar chunks (top-K)', 'Rerank and filter for relevance', 'Assemble context and generate a cited answer'], ['agenticRag', 'graphKnowledge', 'customerAssistant'], ['healthcare', 'legal', 'government']),

  T('mcp', 'Model Context Protocol', '🔌', '#94e2d5', 'Tools / Integration', 'Gives AI hands with a security badge: one standard protocol to connect models to tools, data and systems — every action permission-checked and logged.', 'Standard protocol connecting AI agents to tools, data sources and enterprise systems with governance.', {
    nodes: [
      { id: 'agent', label: 'AI Agent', kind: 'ai', sub: 'Needs capability' },
      { id: 'gw', label: 'MCP Gateway', kind: 'gateway', sub: 'Protocol' },
      { id: 'reg', label: 'Tool Registry', kind: 'store', sub: 'Capabilities' },
      { id: 'crm', label: 'CRM', kind: 'data', sub: 'Adapter' },
      { id: 'db', label: 'Databases', kind: 'data', sub: 'Adapter' },
      { id: 'api', label: 'Internal APIs', kind: 'data', sub: 'Adapter' },
      { id: 'perm', label: 'Permission Gate', kind: 'gateway', sub: 'Least privilege' },
      { id: 'audit', label: 'Audit Log', kind: 'store', sub: 'Every call' },
    ],
    edges: [
      { from: 'agent', to: 'gw' },
      { from: 'gw', to: 'reg' },
      { from: 'reg', to: 'crm' },
      { from: 'reg', to: 'db' },
      { from: 'reg', to: 'api' },
      { from: 'crm', to: 'perm' },
      { from: 'db', to: 'perm' },
      { from: 'api', to: 'perm' },
      { from: 'perm', to: 'audit' },
      { from: 'perm', to: 'agent', label: 'result' },
    ],
  }, ['Agent requests a capability through MCP', 'Gateway resolves the tool in the registry', 'Adapter connects to the target system', 'Permission gate checks scope and entitlement', 'Call executes and results return to the agent', 'Every call is written to the audit log'], ['mcpToolGateway', 'agenticRag', 'autonomousOps'], ['government', 'banking', 'healthcare']),

  T('vectordb', 'Vector Databases', '🗄️', '#f9e2af', 'Storage / Retrieval', 'The AI’s memory library — stores meaning (vectors) instead of keywords, so “find similar” works by concept, not exact words.', 'Purpose-built storage for embeddings powering semantic search and similarity retrieval.', {
    nodes: [
      { id: 'docs', label: 'Documents', kind: 'store' },
      { id: 'chunk', label: 'Chunking', kind: 'data' },
      { id: 'embed', label: 'Embeddings', kind: 'ai', sub: 'Model' },
      { id: 'idx', label: 'Vector Index', kind: 'store', sub: 'HNSW · IVF' },
      { id: 'q', label: 'Query', kind: 'entry' },
      { id: 'filter', label: 'Metadata Filter', kind: 'data', sub: 'Tenant · Date' },
      { id: 'search', label: 'ANN Search', kind: 'data', sub: 'Top-K' },
      { id: 'res', label: 'Results', kind: 'action', sub: 'Chunks + scores' },
    ],
    edges: [
      { from: 'docs', to: 'chunk' },
      { from: 'chunk', to: 'embed' },
      { from: 'embed', to: 'idx' },
      { from: 'q', to: 'embed' },
      { from: 'q', to: 'filter' },
      { from: 'idx', to: 'search' },
      { from: 'filter', to: 'search' },
      { from: 'search', to: 'res' },
    ],
  }, ['Chunk documents into searchable units', 'Embed chunks into high-dimensional vectors', 'Index vectors for fast approximate search', 'Apply metadata filters (tenant, date, type)', 'Search with the query vector (top-K)', 'Return nearest chunks with similarity scores'], ['agenticRag', 'graphKnowledge', 'customerAssistant'], ['retail', 'education', 'banking']),

  T('crewai', 'CrewAI', '👥', '#cba6f7', 'Multi-Agent', 'A team builder for AI: you define roles (researcher, writer, reviewer) and the crew collaborates on a shared goal with clear hand-offs.', 'Role-based multi-agent orchestration for collaborative task execution.', {
    nodes: [
      { id: 'goal', label: 'Goal', kind: 'entry', sub: 'Brief' },
      { id: 'super', label: 'Supervisor', kind: 'ai', sub: 'Task split' },
      { id: 'res', label: 'Researcher', kind: 'ai', sub: 'Agent' },
      { id: 'wr', label: 'Writer', kind: 'ai', sub: 'Agent' },
      { id: 'rev', label: 'Reviewer', kind: 'ai', sub: 'Agent' },
      { id: 'merge', label: 'Merge & Verify', kind: 'ai', sub: 'Quality gate' },
      { id: 'out', label: 'Deliverable', kind: 'action' },
    ],
    edges: [
      { from: 'goal', to: 'super' },
      { from: 'super', to: 'res' },
      { from: 'super', to: 'wr' },
      { from: 'super', to: 'rev' },
      { from: 'res', to: 'merge' },
      { from: 'wr', to: 'merge' },
      { from: 'rev', to: 'merge' },
      { from: 'merge', to: 'out' },
    ],
  }, ['Define the goal and success criteria', 'Supervisor decomposes into role-based tasks', 'Agents execute in parallel with role prompts', 'Reviewer agent checks quality and gaps', 'Results merge through a quality gate', 'Deliverable returns for human approval'], ['multiAgentCrew', 'genContentStudio', 'agenticRag'], ['entertainment', 'legal', 'marketing']),

  T('langchain', 'LangChain', '⛓️', '#94e2d5', 'Framework', 'The toolkit that wires LLMs to the outside world — prompts, chains, memory, retrieval and tools in composable building blocks.', 'Composable framework connecting LLMs with memory, tools, retrieval and workflows.', {
    nodes: [
      { id: 'prompt', label: 'Prompt Template', kind: 'data' },
      { id: 'llm', label: 'LLM', kind: 'ai', sub: 'Model call' },
      { id: 'chain', label: 'Chain', kind: 'ai', sub: 'Sequential' },
      { id: 'retr', label: 'Retriever', kind: 'data', sub: 'RAG' },
      { id: 'mem', label: 'Memory', kind: 'store', sub: 'History' },
      { id: 'tools', label: 'Tools', kind: 'action', sub: 'MCP' },
      { id: 'out', label: 'Output', kind: 'action', sub: 'Parser' },
    ],
    edges: [
      { from: 'prompt', to: 'llm' },
      { from: 'llm', to: 'chain' },
      { from: 'retr', to: 'chain', label: 'context' },
      { from: 'mem', to: 'chain', label: 'history' },
      { from: 'chain', to: 'tools', label: 'calls' },
      { from: 'tools', to: 'chain', label: 'results' },
      { from: 'chain', to: 'out' },
    ],
  }, ['Compose prompts with templates', 'Chain steps: retrieve → reason → act', 'Inject retrieved context and memory', 'Call tools when the chain decides', 'Parse structured output with schemas', 'Return the finished response'], ['agenticRag', 'customerAssistant', 'mcpToolGateway'], ['retail', 'banking', 'education']),

  T('agents', 'AI Agents', '🤖', '#cba6f7', 'Autonomy', 'Not just talk — a loop: perceive the situation, think, plan, act with tools, observe the result and repeat until the task is done.', 'Autonomous reasoning loop: perceive → reason → plan → act → observe, powered by tools and memory.', {
    nodes: [
      { id: 'task', label: 'Task', kind: 'entry' },
      { id: 'perceive', label: 'Perceive', kind: 'ai', sub: 'Context' },
      { id: 'reason', label: 'Reason', kind: 'ai', sub: 'LLM' },
      { id: 'plan', label: 'Plan', kind: 'ai', sub: 'Steps' },
      { id: 'act', label: 'Act', kind: 'action', sub: 'Tools · MCP' },
      { id: 'observe', label: 'Observe', kind: 'data', sub: 'Result' },
      { id: 'done', label: 'Complete', kind: 'action' },
    ],
    edges: [
      { from: 'task', to: 'perceive' },
      { from: 'perceive', to: 'reason' },
      { from: 'reason', to: 'plan' },
      { from: 'plan', to: 'act' },
      { from: 'act', to: 'observe' },
      { from: 'observe', to: 'reason', label: 'loop' },
      { from: 'observe', to: 'done', label: 'goal met' },
    ],
  }, ['Receive the task with success criteria', 'Perceive the current context and state', 'Reason with the LLM about next steps', 'Plan and pick tools for the step', 'Act and observe the outcome', 'Loop until the goal is met'], ['agenticRag', 'customerAssistant', 'autonomousOps'], ['banking', 'logistics', 'government']),

  T('mlops', 'MLOps', '🚀', '#a6e3a1', 'Lifecycle', 'The quality-control factory line for machine learning: train in the lab, test before shipping, monitor in the wild, retrain when things drift.', 'Production ML lifecycle: data → train → evaluate → register → deploy → monitor → retrain.', {
    nodes: [
      { id: 'data', label: 'Data Pipeline', kind: 'data' },
      { id: 'val', label: 'Validation', kind: 'gateway', sub: 'Quality gates' },
      { id: 'train', label: 'Train & Tune', kind: 'ai', sub: 'LoRA/QLoRA' },
      { id: 'eval', label: 'Evaluate', kind: 'ai', sub: 'Offline evals' },
      { id: 'reg', label: 'Model Registry', kind: 'store', sub: 'Versioned' },
      { id: 'serve', label: 'Serve', kind: 'action', sub: 'Inference API' },
      { id: 'mon', label: 'Monitor & Drift', kind: 'data', sub: 'Telemetry' },
      { id: 'retrain', label: 'Retrain', kind: 'ai', sub: 'Feedback loop' },
    ],
    edges: [
      { from: 'data', to: 'val' },
      { from: 'val', to: 'train' },
      { from: 'train', to: 'eval' },
      { from: 'eval', to: 'reg', label: 'promote' },
      { from: 'reg', to: 'serve' },
      { from: 'serve', to: 'mon' },
      { from: 'mon', to: 'retrain', label: 'drift' },
      { from: 'retrain', to: 'train' },
    ],
  }, ['Ingest and validate training data', 'Train and fine-tune candidate models', 'Evaluate against holdout and fairness sets', 'Promote only passing models to the registry', 'Serve via low-latency inference API', 'Monitor drift and trigger retraining'], ['predictiveMLOps', 'governedPlatform', 'autonomousOps'], ['manufacturing', 'insurance', 'retail']),

  T('react', 'ReAct Patterns', '🧩', '#f38ba8', 'Reasoning', 'The think-do-check loop: the model writes down what it’s thinking (Thought), decides an Action, sees the Observation, and repeats — the engine behind most agents.', 'Reasoning + Acting loop that lets models think, act and observe before answering.', {
    nodes: [
      { id: 'q', label: 'Question', kind: 'entry' },
      { id: 'thought', label: 'Thought', kind: 'ai', sub: 'Reason' },
      { id: 'action', label: 'Action', kind: 'action', sub: 'Tool call' },
      { id: 'obs', label: 'Observation', kind: 'data', sub: 'Tool result' },
      { id: 'answer', label: 'Answer', kind: 'action', sub: 'Final' },
    ],
    edges: [
      { from: 'q', to: 'thought' },
      { from: 'thought', to: 'action' },
      { from: 'action', to: 'obs' },
      { from: 'obs', to: 'thought', label: 'loop' },
      { from: 'obs', to: 'answer', label: 'enough' },
    ],
  }, ['Model reads the question', 'Writes an explicit reasoning step (Thought)', 'Picks an action: tool call or search (Action)', 'Observes the tool result (Observation)', 'Repeats until reasoning is complete', 'Delivers the final grounded answer'], ['agenticRag', 'fraudRiskReAct', 'autonomousOps'], ['banking', 'insurance', 'telecom']),

  T('guardrails', 'GuardRails', '🛡️', '#f38ba8', 'Safety', 'The security checkpoint for AI: every prompt and output is screened for tricks, private data and harmful content before it can do damage.', 'Safety layer screening prompts and outputs for injection, PII, toxicity and policy violations.', {
    nodes: [
      { id: 'input', label: 'Input', kind: 'entry', sub: 'User prompt' },
      { id: 'policy', label: 'Policy Engine', kind: 'gateway', sub: 'Rules' },
      { id: 'pii', label: 'PII Scan', kind: 'gateway', sub: 'Detect' },
      { id: 'inj', label: 'Injection Scan', kind: 'gateway', sub: 'Prompt attack' },
      { id: 'tox', label: 'Toxicity / Policy', kind: 'gateway', sub: 'Content' },
      { id: 'allow', label: 'Allow', kind: 'action', sub: '→ Model' },
      { id: 'block', label: 'Block / Sanitize', kind: 'action', sub: 'Log + alert' },
    ],
    edges: [
      { from: 'input', to: 'policy' },
      { from: 'policy', to: 'pii' },
      { from: 'pii', to: 'inj' },
      { from: 'inj', to: 'tox' },
      { from: 'tox', to: 'allow', label: 'clean' },
      { from: 'tox', to: 'block', label: 'violation' },
    ],
  }, ['Input arrives at the gateway', 'Policy engine applies organisation rules', 'PII and secrets are detected and redacted', 'Prompt-injection patterns are screened', 'Toxicity and content policy are checked', 'Clean inputs pass; violations are blocked and logged'], ['governedPlatform', 'customerAssistant', 'fraudRiskReAct'], ['government', 'banking', 'healthcare']),

  T('memory', 'Memory Management', '💾', '#89dceb', 'Context', 'The AI’s ability to remember: short-term conversation, long-term user facts and working memory that persists across sessions.', 'Storing and retrieving conversation and user context across steps and sessions.', {
    nodes: [
      { id: 'turn', label: 'Interaction', kind: 'entry', sub: 'Message' },
      { id: 'short', label: 'Short-Term', kind: 'store', sub: 'Session' },
      { id: 'work', label: 'Working Memory', kind: 'store', sub: 'Task state' },
      { id: 'long', label: 'Long-Term', kind: 'store', sub: 'User profile' },
      { id: 'retr', label: 'Retrieve', kind: 'data', sub: 'Relevant facts' },
      { id: 'ctx', label: 'Context Pack', kind: 'ai', sub: 'Prompt' },
    ],
    edges: [
      { from: 'turn', to: 'short' },
      { from: 'short', to: 'work' },
      { from: 'work', to: 'long', label: 'consolidate' },
      { from: 'long', to: 'retr' },
      { from: 'short', to: 'retr' },
      { from: 'retr', to: 'ctx' },
    ],
  }, ['Capture each interaction', 'Keep the session window in short-term memory', 'Track task state in working memory', 'Consolidate important facts to long-term memory', 'Retrieve the relevant slice for the next step', 'Pack it into the model context'], ['agenticRag', 'customerAssistant', 'multiAgentCrew'], ['retail', 'banking', 'education']),

  T('embeddings', 'Embeddings', '🧮', '#f9e2af', 'Representation', 'Turns words into coordinates: similar meanings land close together in vector space, which is what makes semantic search and clustering work.', 'Model that maps text to dense vectors capturing semantic meaning.', {
    nodes: [
      { id: 'text', label: 'Text', kind: 'entry', sub: 'Sentence / doc' },
      { id: 'norm', label: 'Normalize', kind: 'data', sub: 'Tokenize' },
      { id: 'model', label: 'Embedding Model', kind: 'ai', sub: 'Transformer' },
      { id: 'vec', label: 'Vector', kind: 'store', sub: '768-dim' },
      { id: 'sim', label: 'Similarity', kind: 'data', sub: 'Cosine' },
      { id: 'use', label: 'Use', kind: 'action', sub: 'Search · Cluster' },
    ],
    edges: [
      { from: 'text', to: 'norm' },
      { from: 'norm', to: 'model' },
      { from: 'model', to: 'vec' },
      { from: 'vec', to: 'sim' },
      { from: 'sim', to: 'use' },
    ],
  }, ['Accept text input', 'Tokenize and normalise the text', 'Run the embedding model over it', 'Produce a dense vector representation', 'Compare vectors with cosine similarity', 'Use results for search, clustering or RAG'], ['agenticRag', 'graphKnowledge', 'genContentStudio'], ['retail', 'legal', 'healthcare']),

  T('observability', 'Observability', '🔭', '#89b4fa', 'Ops / Monitoring', 'The flight recorder of AI systems: traces every request through the agent, measures cost and latency, and surfaces failures before users notice.', 'Tracing, metrics and logs across requests, agents, models and tools for production AI.', {
    nodes: [
      { id: 'req', label: 'Request', kind: 'entry' },
      { id: 'trace', label: 'Trace', kind: 'data', sub: 'Span tree' },
      { id: 'agent', label: 'Agent Span', kind: 'ai', sub: 'Reason' },
      { id: 'llm', label: 'LLM Span', kind: 'ai', sub: 'Tokens · cost' },
      { id: 'tool', label: 'Tool Span', kind: 'action', sub: 'Latency' },
      { id: 'metrics', label: 'Metrics & Logs', kind: 'store', sub: 'Counters' },
      { id: 'alert', label: 'Dashboards & Alerts', kind: 'action', sub: 'SLIs' },
    ],
    edges: [
      { from: 'req', to: 'trace' },
      { from: 'trace', to: 'agent' },
      { from: 'agent', to: 'llm' },
      { from: 'agent', to: 'tool' },
      { from: 'agent', to: 'metrics' },
      { from: 'llm', to: 'metrics' },
      { from: 'tool', to: 'metrics' },
      { from: 'metrics', to: 'alert' },
    ],
  }, ['Every request starts a trace', 'Spans record agent, LLM and tool steps', 'Token counts and cost are captured per call', 'Latency and errors roll into metrics', 'Logs attach to spans for debugging', 'Dashboards and alerts surface problems'], ['agenticRag', 'autonomousOps', 'governedPlatform'], ['telecom', 'banking', 'manufacturing']),

  T('evaluations', 'Evaluations', '✅', '#a6e3a1', 'Quality', 'The exam for AI: responses are scored for faithfulness, relevance and safety against ground truth, so you know when the system is actually good.', 'Systematic scoring of LLM/agent outputs for faithfulness, relevance, safety and cost.', {
    nodes: [
      { id: 'out', label: 'Model Output', kind: 'entry', sub: 'Answer' },
      { id: 'gt', label: 'Ground Truth', kind: 'store', sub: 'Labeled set' },
      { id: 'faith', label: 'Faithfulness', kind: 'ai', sub: 'LLM-judge' },
      { id: 'rel', label: 'Relevance', kind: 'ai', sub: 'Scoring' },
      { id: 'safe', label: 'Safety & Toxicity', kind: 'ai', sub: 'Scoring' },
      { id: 'score', label: 'Composite Score', kind: 'data', sub: 'Pass gate' },
      { id: 'improve', label: 'Improve', kind: 'action', sub: 'Retrain · Prompt' },
    ],
    edges: [
      { from: 'out', to: 'faith' },
      { from: 'gt', to: 'faith' },
      { from: 'out', to: 'rel' },
      { from: 'out', to: 'safe' },
      { from: 'faith', to: 'score' },
      { from: 'rel', to: 'score' },
      { from: 'safe', to: 'score' },
      { from: 'score', to: 'improve', label: 'below gate' },
    ],
  }, ['Collect model outputs over a test set', 'Compare against ground truth labels', 'Score faithfulness with an LLM judge', 'Score relevance to the query', 'Screen safety and toxicity', 'Gate releases on the composite score'], ['governedPlatform', 'agenticRag', 'multiAgentCrew'], ['healthcare', 'legal', 'banking']),

  T('llms', 'Large Language Models', '🧠', '#cba6f7', 'Models', 'The brain: a model trained on vast text that generates language, reasons and follows instructions — powerful alone, unstoppable with tools and context.', 'Foundation models that generate text, reason and follow instructions across modalities.', {
    nodes: [
      { id: 'prompt', label: 'Prompt', kind: 'entry', sub: 'System + user' },
      { id: 'tok', label: 'Tokenize', kind: 'data', sub: 'Context window' },
      { id: 'model', label: 'Transformer', kind: 'ai', sub: 'Attention' },
      { id: 'gen', label: 'Generate', kind: 'ai', sub: 'Sampling' },
      { id: 'tool', label: 'Tool Calls', kind: 'action', sub: 'Function call' },
      { id: 'out', label: 'Output', kind: 'action', sub: 'Text / JSON' },
    ],
    edges: [
      { from: 'prompt', to: 'tok' },
      { from: 'tok', to: 'model' },
      { from: 'model', to: 'gen' },
      { from: 'gen', to: 'tool', label: 'function' },
      { from: 'tool', to: 'model', label: 'result' },
      { from: 'gen', to: 'out', label: 'text' },
    ],
  }, ['Compose system and user prompts', 'Tokenize into the context window', 'Transformer attention processes tokens', 'Sampling generates the next tokens', 'Tool-call tokens trigger external actions', 'Final text or JSON returns'], ['agenticRag', 'genContentStudio', 'customerAssistant'], ['All sectors']),

  T('prompting', 'Prompt Engineering', '✍️', '#f5c2e7', 'Instructions', 'The art of instructions: clear roles, context, examples and output formats that make models behave predictably — the cheapest lever in AI.', 'Crafting system prompts, few-shot examples and structured output formats for reliable model behaviour.', {
    nodes: [
      { id: 'role', label: 'Role & Tone', kind: 'data', sub: 'System prompt' },
      { id: 'ctx', label: 'Context & Facts', kind: 'data', sub: 'RAG chunks' },
      { id: 'ex', label: 'Few-Shot Examples', kind: 'data', sub: 'Demonstrations' },
      { id: 'fmt', label: 'Output Format', kind: 'data', sub: 'JSON schema' },
      { id: 'compose', label: 'Compose Prompt', kind: 'ai', sub: 'Template' },
      { id: 'llm', label: 'LLM', kind: 'ai', sub: 'Execute' },
      { id: 'parse', label: 'Parse & Validate', kind: 'action', sub: 'Structured' },
    ],
    edges: [
      { from: 'role', to: 'compose' },
      { from: 'ctx', to: 'compose' },
      { from: 'ex', to: 'compose' },
      { from: 'fmt', to: 'compose' },
      { from: 'compose', to: 'llm' },
      { from: 'llm', to: 'parse' },
    ],
  }, ['Define the model’s role and tone', 'Inject relevant context and facts', 'Add few-shot demonstrations', 'Specify the exact output format', 'Compose and send the prompt', 'Parse and validate the response'], ['agenticRag', 'genContentStudio', 'customerAssistant'], ['All sectors']),

  T('iot', 'IoT & Edge AI', '📡', '#fab387', 'Edge', 'Brains on the edge: small models run right on sensors and gateways for instant, offline decisions — only the interesting data reaches the cloud.', 'TinyML inference on devices with secure uplink and fleet management.', {
    nodes: [
      { id: 'sensor', label: 'Sensor', kind: 'entry', sub: 'Signal' },
      { id: 'tinyml', label: 'TinyML', kind: 'ai', sub: 'On-device' },
      { id: 'gw', label: 'Edge Gateway', kind: 'gateway', sub: 'Aggregate' },
      { id: 'mqtt', label: 'MQTT Uplink', kind: 'data', sub: 'TLS' },
      { id: 'cloud', label: 'Cloud Backplane', kind: 'store', sub: 'Ingest' },
      { id: 'ota', label: 'Model OTA', kind: 'action', sub: 'Fleet update' },
    ],
    edges: [
      { from: 'sensor', to: 'tinyml' },
      { from: 'tinyml', to: 'gw' },
      { from: 'gw', to: 'mqtt' },
      { from: 'mqtt', to: 'cloud' },
      { from: 'ota', to: 'gw', label: 'new model' },
    ],
  }, ['Sensors sample physical signals', 'TinyML infers locally on the device', 'Gateway aggregates and filters events', 'Secure MQTT uplink streams to the cloud', 'Cloud ingests and analyses telemetry', 'OTA pushes updated models to the fleet'], ['edgeIotAI', 'eventStreamAI', 'autonomousOps'], ['manufacturing', 'energy', 'agriculture']),

  T('quantum', 'Quantum Computing', '⚛️', '#89dceb', 'Frontier', 'Computing with probability instead of bits: qubits in superposition let certain problems (optimisation, simulation, factoring) be attacked in ways classical machines can’t.', 'Qubit-based computation for optimisation, simulation and machine learning at the frontier.', {
    nodes: [
      { id: 'prob', label: 'Problem', kind: 'entry', sub: 'Classical' },
      { id: 'encode', label: 'Encode Qubits', kind: 'data', sub: 'State prep' },
      { id: 'circuit', label: 'Quantum Circuit', kind: 'ai', sub: 'Gates' },
      { id: 'measure', label: 'Measure', kind: 'data', sub: 'Collapse' },
      { id: 'decode', label: 'Decode Result', kind: 'ai', sub: 'Post-process' },
      { id: 'hybrid', label: 'Hybrid Compute', kind: 'action', sub: 'Classical loop' },
    ],
    edges: [
      { from: 'prob', to: 'encode' },
      { from: 'encode', to: 'circuit' },
      { from: 'circuit', to: 'measure' },
      { from: 'measure', to: 'decode' },
      { from: 'decode', to: 'hybrid' },
      { from: 'hybrid', to: 'encode', label: 'VQE/QAOA loop' },
    ],
  }, ['Frame the problem classically', 'Prepare qubits in the initial state', 'Apply gate circuits (VQE, QAOA, Grover)', 'Measure and collapse to classical bits', 'Decode and post-process results', 'Iterate hybrid quantum-classical loops'], ['None — frontier', 'edgeIotAI', 'predictiveMLOps'], ['finance', 'pharma', 'defense']),

  T('semiconductor', 'Semiconductor Engineering', '🏭', '#94e2d5', 'Hardware', 'The physical engine under AI: designing, fabricating and packaging the chips — GPUs, TPUs, NPUs — that actually run the models.', 'Chip design-to-deployment pipeline powering AI compute from wafer to accelerator.', {
    nodes: [
      { id: 'design', label: 'Chip Design', kind: 'ai', sub: 'RTL · EDA' },
      { id: 'fab', label: 'Fabrication', kind: 'data', sub: 'Lithography' },
      { id: 'test', label: 'Test & Bin', kind: 'data', sub: 'Yield' },
      { id: 'pack', label: 'Packaging', kind: 'data', sub: 'CoWoS · chiplets' },
      { id: 'accel', label: 'AI Accelerator', kind: 'store', sub: 'GPU · TPU · NPU' },
      { id: 'serve', label: 'Serve Models', kind: 'action', sub: 'Inference' },
    ],
    edges: [
      { from: 'design', to: 'fab' },
      { from: 'fab', to: 'test' },
      { from: 'test', to: 'pack' },
      { from: 'pack', to: 'accel' },
      { from: 'accel', to: 'serve' },
    ],
  }, ['Architect the chip and RTL', 'Fabricate at the foundry (lithography)', 'Test and bin dies by yield', 'Package with advanced interconnects', 'Deploy as AI accelerators', 'Serve training and inference workloads'], ['None — hardware', 'edgeIotAI', 'predictiveMLOps'], ['tech', 'automotive', 'defense']),
]

export const getTech = id => TECH_FLOWS.find(t => t.id === id)

// Match a tech-stack chip label (e.g. 'RAG', 'ReAct Patterns', 'MCP')
// to a technology flow entry for deep-linking.
export const techForLabel = label => {
  const l = String(label || '').toLowerCase().replace(/[^a-z0-9]/g, '')
  if (!l) return null
  return TECH_FLOWS.find(t => {
    const cands = [t.id, t.name, t.tag].map(x => x.toLowerCase().replace(/[^a-z0-9]/g, ''))
    return cands.some(c => c === l || c.includes(l) || l.includes(c))
  }) || null
}
