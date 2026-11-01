// AI LinkedIn Knowledge Book — structured from saved LinkedIn posts.
// Chapters = topics; each page = a post/idea, rendered page-by-page like a book.
// Block types: para | list | table | quote | typical | code

export const linkedinBookMeta = {
  title: 'The AI Knowledge Book',
  subtitle:
    'Every saved LinkedIn post, organized into a readable book: concepts, theory, code, use cases, projects, and the points that keep getting shared.',
  readingTime: '18 chapters · 100+ pages · ~3 hr read',
  colors: ['blue', 'green', 'purple', 'amber', 'red', 'teal'],
}

export const linkedinBookChapters = [
  {
    id: 'pillars',
    num: '01',
    icon: '🧠',
    title: 'Context Pillars',
    tagline: 'The 3 core pillars every AI agent runs on',
    color: 'blue',
    pages: [
      {
        title: 'MCP vs RAG vs Skills — the 3 core pillars',
        tag: 'Concepts',
        hook: 'Every AI agent’s context is built from exactly 3 things. Get them wrong and nothing else matters.',
        blocks: [
          { type: 'para', text: 'Most people think an AI agent is a model. It isn’t. An agent is a model PLUS the context you give it. And that context is assembled from three pillars — each answers a different question.' },
          { type: 'list', title: 'The three pillars', items: [
            '🔌 MCP (Model Context Protocol) — the wires. How the agent connects to tools, data sources, and APIs. The plumbing that lets an LLM read your files, query your DB, or call your SaaS.',
            '📚 RAG (Retrieval-Augmented Generation) — the library. How the agent finds the right knowledge at the right time. Embeddings in, ranked documents out, grounded answers in return.',
            '⚙️ Skills — the hands. What the agent can actually DO with the context: run a query, write a file, trigger a workflow, take an action.',
          ]},
          { type: 'table', title: 'Pillar-by-pillar', headers: ['Pillar', 'Question it answers', 'Failure mode'], rows: [
            ['MCP', 'How do I reach the outside world?', 'Agent has tools but no permission/scopes wired'],
            ['RAG', 'How do I know the right facts?', 'Agent hallucinates or answers from stale memory'],
            ['Skills', 'How do I act on what I know?', 'Agent can reason but can’t execute anything'],
          ]},
          { type: 'quote', text: 'An agent is only as smart as the context you give it. Model quality is the floor — context quality is the ceiling.' },
          { type: 'typical', title: 'The point people share', items: [
            'Stop picking a model first. Pick your context pillars first.',
            'If your agent hallucinates → fix RAG. If it can’t act → fix MCP. If it can’t do the task → fix skills.',
            'All three are different jobs — one tool does not replace the other.',
          ]},
        ],
      },
      {
        title: 'Why MCP is NOT “USB-C for AI”',
        tag: 'Theory',
        hook: 'The most shared analogy for MCP is also the most misleading.',
        blocks: [
          { type: 'para', text: 'Everyone compares MCP to USB-C — “one port connects everything.” Cute, but wrong. USB-C is a passive cable; it carries electricity, not intent. MCP is a WAITER.' },
          { type: 'list', title: 'The waiter analogy', items: [
            'You (the LLM) tell the waiter what you want.',
            'The waiter knows the menu — which tools exist, what they need, what they return.',
            'The waiter fetches the result and brings it back in a format you can digest.',
            'You never touch the kitchen (the actual API / database). You don’t need to.',
          ]},
          { type: 'para', text: 'The USB-C framing makes people think MCP is about “plugging in.” It’s actually about delegation — protocol, discovery, and standards so ANY model can talk to ANY tool without custom glue code.' },
          { type: 'typical', title: 'Why it matters', items: [
            'MCP = a contract, not a cable. It standardizes the conversation between model and tools.',
            'A2A (Agent-to-Agent) is the next layer — waiters talking to each other.',
            'Think “service layer” not “port.” It changes how you architect agents.',
          ]},
        ],
      },
      {
        title: 'Context engineering — the real skill',
        tag: 'Concepts',
        hook: 'Prompting is dead. Context engineering is the job now.',
        blocks: [
          { type: 'para', text: 'A single prompt is a snapshot. A context is a system — memory that persists, tools that can be called, knowledge that updates, and rules that constrain behavior. Engineering the context is the differentiator in 2026.' },
          { type: 'list', title: 'The context stack', items: [
            'Memory layer — short-term (session) + long-term (embeddings, summaries, vector store).',
            'Knowledge layer — RAG over your docs, updated on a schedule.',
            'Tool layer — MCP servers that expose capabilities + permissions.',
            'Control layer — system rules, guardrails, evals, and human-in-the-loop gates.',
          ]},
          { type: 'typical', title: 'Typical interview / post point', items: [
            '“The model is not the product. The context system is the product.”',
            'Everyone can call GPT-5. Few can feed it the right context at the right time.',
            'Context engineering = the new prompt engineering. Same discipline, bigger lever.',
          ]},
        ],
      },
      {
        title: 'MCP in code — a minimal server & client',
        tag: 'Code',
        hook: 'The fastest way to “get” MCP is to build one. Here’s a server in ~20 lines.',
        blocks: [
          { type: 'para', text: 'An MCP server exposes capabilities (tools, resources, prompts) over stdio or HTTP. A client (the agent) discovers them and calls them. No custom glue, no per-tool SDK — just a protocol.' },
          { type: 'code', title: 'server.py — expose a database as an MCP tool', lang: 'python', code: `from mcp.server.fastmcp import FastMCP
import json, sqlite3

mcp = FastMCP("tickets")

@mcp.tool()
def get_ticket(ticket_id: str) -> str:
    """Fetch a support ticket by ID."""
    conn = sqlite3.connect("support.db")
    row = conn.execute(
        "SELECT * FROM tickets WHERE id = ?", (ticket_id,)
    ).fetchone()
    conn.close()
    return json.dumps(dict(row)) if row else "Not found"

if __name__ == "__main__":
    mcp.run(transport="stdio")` },
          { type: 'code', title: 'client.py — any model, any tool', lang: 'python', code: `from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

params = StdioServerParameters(command="python", args=["server.py"])
async with stdio_client(params) as (read, write):
    async with ClientSession(read, write) as session:
        await session.initialize()
        tools = await session.list_tools()        # discovery
        result = await session.call_tool(         # one contract
            "get_ticket", {"ticket_id": "T-1042"}
        )
        print(result)` },
          { type: 'typical', title: 'What building one teaches you', items: [
            'Tools are described to the model with names + JSON schemas — docs ARE the contract.',
            'The transport (stdio vs HTTP) is swappable; the schema is what matters.',
            'One MCP server can serve Claude, GPT, Gemini, and any local model unchanged.',
          ]},
        ],
      },
      {
        title: 'Skills & the agent vocabulary — 12 terms',
        tag: 'Concepts',
        hook: 'Agents come with a vocabulary. If you can define all 12, you can talk to anyone in the field.',
        blocks: [
          { type: 'list', title: 'The 12 terms', items: [
            '1. Context — everything the model sees this turn: system prompt + memory + retrieved docs.',
            '2. Memory — short-term (this session) and long-term (stored, retrievable knowledge).',
            '3. RAG — retrieval-augmented generation: ground the answer in retrieved documents.',
            '4. Agent — a model loop that can plan, act, observe, and iterate toward a goal.',
            '5. Agentic AI — systems composed of agents + tools + memory + guardrails.',
            '6. Tools — functions the model can call: search, SQL, files, APIs.',
            '7. MCP — Model Context Protocol: the standard wire between model and tools.',
            '8. Skills — packaged, reusable instructions + workflows the agent loads on demand.',
            '9. Hooks — lifecycle events (on tool call, on error) where you inject code.',
            '10. Subagents — child agents with their own narrow context, spawned for subtasks.',
            '11. Orchestration — the flow/state machine deciding who runs when and why.',
            '12. Evals — the tests that tell you an agent change helped or hurt.',
          ]},
          { type: 'quote', text: 'Agents are not a model. Agents are a system where the model is the least interesting part.' },
          { type: 'typical', title: 'Why it matters', items: [
            'Fluency in this vocabulary is the new “can you use Git.”',
            'Most agent debates are two people using “agent” to mean different things.',
            'Learn the terms by building, not by reading.',
          ]},
        ],
      },
    ],
  },
  {
    id: 'rag',
    num: '02',
    icon: '📚',
    title: 'RAG Deep-Dive',
    tagline: '12 types of RAG, chunking, fine-tuning, and the agentic loop',
    color: 'green',
    pages: [
      {
        title: 'The 12 types of RAG',
        tag: 'Theory',
        hook: 'There is no “one RAG.” There are at least twelve — and each solves a different problem.',
        blocks: [
          { type: 'para', text: 'RAG has evolved far past “embed everything, then search.” Here’s the full family tree of retrieval-augmented generation patterns, and when to reach for each.' },
          { type: 'list', title: '1–6: The classic family', items: [
            '1. Naive RAG — embed chunks → top-k retrieval → stuff into prompt. The baseline. Cheap, fast, fragile on complex questions.',
            '2. Advanced RAG — pre-retrieval (chunking, indexing) + post-retrieval (reranking, filtering) optimization. The “good enough for production” default.',
            '3. Modular RAG — swappable modules: retrieval, memory, fusion, routing. Each piece independently tuned.',
            '4. Corrective RAG (CRAG) — retrieves, then evaluates: if docs are weak, it corrects via web search or self-reflection.',
            '5. Self-RAG — the model critiques its own retrieval: reflects, judges relevance, regenerates until confident.',
            '6. Hybrid RAG — combines dense vectors + sparse (BM25/keyword) + filters + reranker. Best of both worlds for real queries.',
          ]},
          { type: 'list', title: '7–12: The frontier', items: [
            '7. Agentic RAG — an LLM decides what to retrieve, from which source, iteratively. Retrieval becomes a decision, not a lookup.',
            '8. Graph RAG — builds a knowledge graph from docs; answers questions that require multi-hop relationships, not similarity.',
            '9. Multimodal RAG — indexes images, tables, diagrams alongside text. Table + chart questions finally work.',
            '10. Lightweight RAG — small models + tiny indexes, runs on device/edge. Privacy-first, offline.',
            '11. Speculative RAG — drafts answers from multiple candidate contexts in parallel, verifies, keeps the best. Lower latency.',
            '12. Adaptive RAG — routes the query: simple → direct answer, complex → retrieve, very hard → full agent loop.',
          ]},
          { type: 'table', title: 'Picking one', headers: ['Your problem', 'Reach for'], rows: [
            ['Fixed doc set, simple Q&A', 'Advanced RAG'],
            ['Multi-hop / relationship questions', 'Graph RAG'],
            ['Mixed images, tables, text', 'Multimodal RAG'],
            ['Frequent conflicting facts', 'Corrective RAG'],
            ['Complex, open-ended queries', 'Agentic RAG'],
            ['Low latency / offline device', 'Lightweight RAG'],
          ]},
          { type: 'typical', title: 'The point people share', items: [
            'Start with Advanced RAG. Upgrade to Agentic RAG only when you’ve measured a real failure.',
            'RAG quality = chunking × retrieval × reranking × prompt assembly. One weak link sinks the answer.',
            '“12 types of RAG” is the new “10 prompting tips” — a viral list that signals real depth.',
          ]},
        ],
      },
      {
        title: 'RAG vs CAG vs MAG',
        tag: 'Concepts',
        hook: 'Retrieval is not the only way to give a model context. Sometimes you cache it. Sometimes you memorize it.',
        blocks: [
          { type: 'table', title: 'Three context strategies', headers: ['Approach', 'How it works', 'Best for', 'Cost'], rows: [
            ['RAG', 'Retrieve relevant docs at query time via embeddings', 'Huge, changing corpora', 'Per-query latency + retrieval infra'],
            ['CAG (Context-Augmented Gen)', 'Pre-load the FULL corpus into the context window once', 'Small-to-medium static doc sets', 'No retrieval latency, but big context = $'],
            ['MAG (Memory-Augmented Gen)', 'Model stores knowledge in memory / fine-tunes on your data', 'Repeated, stable knowledge', 'Training / fine-tuning cost'],
          ]},
          { type: 'para', text: 'The insight spreading in 2026: RAG isn’t automatically better than just… putting everything in the context. With long-context models, CAG beats RAG on small corpora — no retrieval failure mode, no chunking nightmare, no latency.' },
          { type: 'typical', title: 'When to pick what', items: [
            'Docs < ~500 pages and stable → CAG wins (simpler + no retrieval errors).',
            'Docs huge or constantly changing → RAG.',
            'Knowledge you repeat in every answer → MAG / memory.',
            'Best of all: RAG the big stuff, CAG the critical stuff, memory the repeated stuff.',
          ]},
        ],
      },
      {
        title: 'Vectorless RAG — retrieval without embeddings',
        tag: 'Use cases',
        hook: 'You don’t need a vector database to do RAG. Some of the best retrieval is embarrassingly simple.',
        blocks: [
          { type: 'para', text: 'A whole wave of “vectorless” retrieval is getting shared — tools like VectifyAI and PageIndex prove that BM25-style, inverted-index, and structured-keyword approaches still crush pure vector search for many workloads.' },
          { type: 'list', title: 'Why vectorless works', items: [
            'Exact term matching → zero hallucinated similarity.',
            'Instant index builds → no embedding API bills, no model drift.',
            'Deterministic → identical queries give identical results (testable!).',
            'Great for code, IDs, SKUs, and domain jargon where synonyms don’t exist.',
          ]},
          { type: 'typical', title: 'The point people share', items: [
            'Hybrid beats either/or: vector search for meaning, keyword search for precision, reranker on top.',
            '“Your RAG is slow because you added a vector DB you don’t need.”',
            'Measure recall on real queries before believing the hype.',
          ]},
        ],
      },
      {
        title: 'Chunking — the real bottleneck',
        tag: 'Code',
        hook: 'Every RAG failure you can’t explain is usually a chunking failure. Chunks are how meaning gets sliced.',
        blocks: [
          { type: 'para', text: 'The “embed a PDF” demo hides the hard part: WHERE do you cut the text? Cut too small and context dies; cut too big and embeddings blur. Five strategies dominate, in order of sophistication.' },
          { type: 'list', title: 'The 5 strategies', items: [
            '1. Fixed-size — split by N words/characters with overlap. Simple, baseline.',
            '2. Recursive — split on paragraphs → sentences → phrases. Respects structure.',
            '3. Semantic — embed candidate chunks, cut where similarity drops. Topic-aware.',
            '4. Structure-aware — split on Markdown headers, tables, code fences. Best for docs.',
            '5. Agentic/chunk-by-question — generate the questions a chunk answers. Most accurate, slowest.',
          ]},
          { type: 'code', title: 'Recursive-ish fixed chunk with overlap', lang: 'python', code: `def chunk_docs(docs, size=800, overlap=150):
    chunks = []
    for d in docs:
        words = d["text"].split()
        for i in range(0, len(words), size - overlap):
            piece = " ".join(words[i:i + size])
            chunks.append({"id": f"{d['id']}:{i}", "text": piece})
    return chunks` },
          { type: 'typical', title: 'The point people share', items: [
            'Test chunk size against your real questions — not against cosine distance.',
            'Tables and code need structure-aware chunks; sentences do not.',
            '“The chunking blog post” is a rite of passage for every RAG engineer.',
          ]},
        ],
      },
      {
        title: 'RAG vs Fine-tuning — the interview answer',
        tag: 'Career',
        hook: 'The most-asked RAG question in every interview. Here’s the answer that gets the nod.',
        blocks: [
          { type: 'table', title: 'RAG vs Fine-tuning', headers: ['Dimension', 'RAG', 'Fine-tuning'], rows: [
            ['What changes', 'The context injected at query time', 'The model weights themselves'],
            ['Knowledge freshness', 'Live — update docs, done', 'Frozen at training time'],
            ['Knowledge type', 'Facts, policies, docs you can cite', 'Style, tone, format, behavior'],
            ['Grounding / citations', 'Yes — show the source', 'No — weights are inscrutable'],
            ['Cost to change', 'Cheap (re-index)', 'Expensive (re-train/eval)'],
            ['When it fails', 'No right doc retrieved', 'Needs many examples to learn'],
          ]},
          { type: 'para', text: 'The one-line answer: RAG changes what the model knows; fine-tuning changes how the model behaves. They are not competitors — production systems use both: fine-tune for voice/format, RAG for facts.' },
          { type: 'typical', title: 'The point people share', items: [
            '“Fine-tune the behavior, RAG the knowledge.”',
            'Never fine-tune hoping to add facts — you’ll get a confident liar.',
            'When in doubt, start with RAG. It’s reversible; fine-tuning is a commitment.',
          ]},
        ],
      },
      {
        title: 'Agentic RAG — the 6-step loop',
        tag: 'Code',
        hook: 'Retrieval stops being a lookup and becomes a decision loop.',
        blocks: [
          { type: 'para', text: 'Agentic RAG lets the model choose what to search, from which source, and whether to search again. The classic implementation is a tight loop of plan → retrieve → judge → generate → verify.' },
          { type: 'code', title: 'agentic_rag.py — decide, retrieve, judge, verify', lang: 'python', code: `def agentic_rag(query):
    plan = router(query)              # which source? simple or deep?
    context = []
    for step in plan:
        docs = retrieve(step, query)  # pick the right index per step
        judged = judge_relevance(query, docs)
        context += [d for d, ok in judged if ok]
    answer = generate(query, context)
    return verify(answer, context)    # check every claim vs context` },
          { type: 'list', title: 'The 6 steps', items: [
            '1. Route — decide simple vs complex vs “needs tools.”',
            '2. Retrieve — per-source, per-step, not one-shot.',
            '3. Judge — score relevance; drop noise.',
            '4. Refine — search again with a rewritten query if coverage is thin.',
            '5. Generate — ground the answer in the surviving context.',
            '6. Verify — re-check claims against sources before sending.',
          ]},
          { type: 'typical', title: 'The point people share', items: [
            'Agentic RAG buys accuracy at the price of latency and tokens.',
            'You only need steps 4–6 after step 1 measures a real failure.',
            'The judge/verify steps are what make it “agentic” — not the retrieval.',
          ]},
        ],
      },
    ],
  },
  {
    id: 'agentic',
    num: '03',
    icon: '🤖',
    title: 'Agentic Patterns',
    tagline: 'Engineering, failures, concepts, and the loop math',
    color: 'purple',
    pages: [
      {
        title: 'Agentic Engineering — the new discipline',
        tag: 'Theory',
        hook: 'Agentic Engineering is to 2026 what prompt engineering was to 2024. A whole new job description.',
        blocks: [
          { type: 'para', text: 'It’s not “chat with an LLM.” It’s designing systems where models plan, act, observe, and iterate — with humans and safety rails. The engineering is in the loop, the tools, the memory, and the evals.' },
          { type: 'list', title: 'The agentic loop', items: [
            'Plan — decompose the goal into steps.',
            'Act — call tools / take actions.',
            'Observe — read results, errors, new state.',
            'Reflect — adjust the plan with what you learned.',
            'Iterate — until done or handed back to a human.',
          ]},
          { type: 'table', title: 'Core skills', headers: ['Skill', 'What it means'], rows: [
            ['ReAct pattern', 'Reasoning + acting interleaved — think, act, observe'],
            ['Tool calling', 'Reliable function invocation with structured args'],
            ['Evals', 'Offline + online evaluation of agent behavior'],
            ['Memory', 'Short-term, long-term, episodic, semantic'],
            ['Guardrails', 'Scopes, permissions, allowlists, human review'],
            ['Observability', 'Tracing every step a model took — and why'],
          ]},
          { type: 'typical', title: 'Why it’s a job now', items: [
            'Prompting is a sentence. Agentic engineering is a system.',
            'Companies are hiring “AI/Agentic Engineers” — same people who were “ML” or “Full-stack” in 2023.',
            'The bottleneck is no longer model quality — it’s orchestration quality.',
          ]},
        ],
      },
      {
        title: 'Why most AI agents fail',
        tag: 'Use cases',
        hook: 'The same 5 failure patterns show up in every doomed agent project.',
        blocks: [
          { type: 'list', title: 'The 5 failure patterns', items: [
            '1. Context starvation — the agent lacks memory, tools, or docs, so it guesses. (Fix: build the context pillars.)',
            '2. Fake autonomy — “autonomous” but every step needs a human to fix prompt drift. No eval loop → silent rot.',
            '3. No ground truth — nothing measures success, so the agent optimizes for nothing.',
            '4. Tool chaos — 20 MCP servers, no permission model, no versioning. The agent can’t act, or acts wrongly.',
            '5. Demo-itis — works on the golden path, breaks on every real edge case. No failure recovery.',
          ]},
          { type: 'quote', text: 'Your agent didn’t fail because the model is dumb. It failed because you never gave it a context system, an eval, or a way to recover.' },
          { type: 'typical', title: 'The point people share', items: [
            'Autonomy is a spectrum: start fully human-in-the-loop.',
            'Ship a “boring agent” that does one thing reliably before an ambitious one.',
            'Every agent needs a retry policy, a budget, and an abort button.',
          ]},
        ],
      },
      {
        title: 'Agent protocols — MCP, A2A, ANP, ACP, Agora',
        tag: 'Theory',
        hook: '2026 is the year agent interoperability became a protocol war — and that’s a good thing.',
        blocks: [
          { type: 'table', title: 'The protocol landscape', headers: ['Protocol', 'Layer', 'What it standardizes'], rows: [
            ['MCP', 'Model ↔ Tools', 'How a model connects to tools/data (the waiter)'],
            ['A2A', 'Agent ↔ Agent', 'How agents discover and delegate to each other'],
            ['ANP', 'Agent networks', 'Peer-to-peer agent-to-agent coordination (open source)'],
            ['ACP', 'App ↔ Agent', 'How end-user apps talk to agents (client protocol)'],
            ['Agora', 'Interop layer', 'Emerging cross-protocol gateway/registry effort'],
          ]},
          { type: 'para', text: 'Don’t bet on ONE protocol. MCP already won for tool connectivity; A2A is winning agent-to-agent. The pattern to build for: protocols are adapters, not religions. Design your agent so the transport is swappable.' },
          { type: 'typical', title: 'The point people share', items: [
            '“Your agents won’t be the only agents. Plan for interop.”',
            'MCP is the waist of the hourglass — everything plugs into it.',
            'If you’re building agent plumbing today, build MCP-first, A2A-second.',
          ]},
        ],
      },
      {
        title: '7 AI agent concepts for 2026',
        tag: 'Concepts',
        hook: 'The checklist that separates “chatbot wrapper” from “real agent.”',
        blocks: [
          { type: 'list', title: 'The 7 concepts', items: [
            '1. Orchestration layer — who calls whom, in what order, with what state.',
            '2. Tool calling — structured arguments, schema-driven, retried on failure.',
            '3. Context window management — trimming, summarizing, and paging what the model sees.',
            '4. Human-in-the-loop — when to pause and ask; approvals as first-class steps.',
            '5. Agent handoff — passing a task + full state from one agent to another.',
            '6. Guardrails — scopes, allowlists, PII masking, abort signals.',
            '7. Deterministic vs non-deterministic — predictable code for the flow, model for the decisions.',
          ]},
          { type: 'para', text: 'The post that collected the most saves from this family: “You don’t have an AI problem, you have a state-management problem.” The agent is the UI; the orchestration is the product.' },
          { type: 'typical', title: 'The point people share', items: [
            'Keep the control flow deterministic; let the model only make decisions.',
            'Every handoff must include context, or the next agent starts blind.',
            'If you can’t explain your orchestration, your agent can’t either.',
          ]},
        ],
      },
      {
        title: 'Automation vs Agentic AI — the difference',
        tag: 'Concepts',
        hook: '“It’s just automation” is the most common dismissal of agents. Here’s the honest comparison.',
        blocks: [
          { type: 'table', title: 'Automation vs Agentic AI', headers: ['Dimension', 'Traditional automation', 'Agentic AI'], rows: [
            ['Logic', 'Hardcoded rules / scripts', 'Model decides the next step'],
            ['Input variation', 'Fails on anything unseen', 'Handles novel, messy input'],
            ['Error handling', 'Explicit try/catch you write', 'Can self-correct and retry'],
            ['Cost', 'Cheap, predictable', 'Tokens + latency per run'],
            ['Determinism', '100% reproducible', 'Probabilistic — needs evals'],
            ['Best at', 'Fixed, high-volume, stable flows', 'Open-ended, judgment-heavy tasks'],
          ]},
          { type: 'para', text: 'The framing that wins: they’re not rivals — automation is the load-bearing skeleton, and agents are the flexible parts that automation can’t express. The best systems keep the pipeline deterministic and let agents handle the judgment.' },
          { type: 'typical', title: 'The point people share', items: [
            'Don’t replace working automation with an agent — you lose determinism for nothing.',
            'Add an agent exactly where the rule breaks: routing, extraction, summarization.',
            '“Automate the boring, agentify the judgment.”',
          ]},
        ],
      },
      {
        title: 'Loop engineering — closed loops & token budgets',
        tag: 'Code',
        hook: 'An agent with no bound is a bill with no limit. Loop engineering is the discipline of bounding it.',
        blocks: [
          { type: 'para', text: '“Open loops” — agents that keep working autonomously — are powerful and terrifying. Production agents ship with a step cap, a token budget, and a handoff path. Every loop needs an exit condition.' },
          { type: 'code', title: 'A bounded agent loop', lang: 'python', code: `MAX_STEPS = 10
TOKEN_BUDGET = 50_000

def run(task):
    state, steps, tokens = {}, 0, 0
    while not done(state) and steps < MAX_STEPS:
        if tokens > TOKEN_BUDGET:
            return summarize_and_handoff(state)   # escape hatch
        act = plan(task, state)    # one tool call
        state = execute(act)       # observe
        tokens += count(state)
        steps += 1
    return state` },
          { type: 'list', title: 'The rules of loop engineering', items: [
            'Max steps — hard cap on iterations, always.',
            'Token budget — stop spending after a threshold, return a partial result.',
            'Idempotent steps — retrying a step must not duplicate side effects.',
            'Checkpoint state — if it dies at step 7, resume at step 7.',
            'Escalation — when stuck twice, hand off to a human with full context.',
          ]},
          { type: 'typical', title: 'The point people share', items: [
            '“Your agent isn’t looping forever, your bill is.” Bound everything.',
            'Closed loops (verify output) catch drift before it compounds.',
            'An agent without a budget is a demo. An agent with a budget is a product.',
          ]},
        ],
      },
    ],
  },
  {
    id: 'usecases',
    num: '04',
    icon: '🏭',
    title: '1000+ Agentic AI Use Cases',
    tagline: 'Every industry, mapped — the mega-list',
    color: 'amber',
    pages: [
      {
        title: 'The mega-list — how to read it',
        tag: 'Overview',
        hook: 'The “1000+ Agentic AI Use Cases” doc went viral because it did one thing right: it made agents concrete per industry.',
        blocks: [
          { type: 'para', text: 'One massive LinkedIn doc (DAMAC-style) listed 1000+ agent use cases across 14 categories. The insight: every category has the SAME core pattern — an agent that watches data, decides, acts, and reports. Only the domain changes.' },
          { type: 'list', title: 'The universal agent pattern', items: [
            'Watch — monitor a stream of data (leads, jobs, sensors, tickets, transactions).',
            'Decide — classify, prioritize, match, or route using a model.',
            'Act — call the tool: email, CRM update, ticket create, order submit.',
            'Report — notify a human with reasoning + confidence.',
          ]},
          { type: 'typical', title: '14 categories (next pages)', items: [
            'Real Estate & Property · Data Centers & Infrastructure · GPU Cloud & HPC',
            'Financial Services · Supply Chain & Logistics · Customer Experience & CRM',
            'HR & Talent · Legal & Compliance · Marketing & Content',
            'Cybersecurity & Risk · Manufacturing & Construction · Energy & Utilities',
            'Healthcare & Life Sciences · Cross-Cutting Agent Infrastructure',
          ]},
        ],
      },
      {
        title: 'Real Estate & Property',
        tag: 'Use cases',
        hook: 'Agents in property: match, value, inspect, and close.',
        blocks: [
          { type: 'list', items: [
            '🏠 Lead-to-property matching — agent parses every inquiry and ranks properties the buyer actually fits.',
            '📐 Automated valuation — pull comps + market data, produce a valuation memo with confidence.',
            '📋 Lease abstraction — read a lease, extract terms, flag expirations and rent escalations.',
            '🔍 Property inspection triage — parse inspection photos/reports, route urgent items to maintenance.',
            '📈 Portfolio dashboard agent — aggregates occupancy, cash flow, and CAPEX into one briefing.',
          ]},
          { type: 'typical', title: 'Typical KPIs shared', items: ['Days-on-market ↓', 'Inquiry-to-viewing conversion ↑', 'Lease admin hours ↓ 60–80%'] },
        ],
      },
      {
        title: 'Data Centers & Infrastructure',
        tag: 'Use cases',
        hook: 'Where infrastructure meets automation — agents run the ops room.',
        blocks: [
          { type: 'list', items: [
            '🖥️ Incident triage — parse alerts, correlate across systems, route to the right engineer with context.',
            '🌡️ Thermal/power optimization — watch sensor streams, recommend rack-level adjustments.',
            '📋 Capacity planning — track utilization, forecast rack/GPU demand, flag shortfalls.',
            '📑 Compliance checks — continuously audit against SOC2/ISO controls and generate evidence.',
            '🔧 Change-request gatekeeper — validate every change against policy before approval.',
          ]},
          { type: 'typical', title: 'Typical KPIs shared', items: ['MTTR ↓', 'Alert noise ↓ 70%', 'Capacity forecast accuracy ↑'] },
        ],
      },
      {
        title: 'GPU Cloud & HPC',
        tag: 'Use cases',
        hook: 'The GPU-cloud stack is agent-native — quotas, jobs, and billing.',
        blocks: [
          { type: 'list', items: [
            '⚡ Job scheduling — match workloads to cheapest GPU class by SLA.',
            '🧾 Cost anomaly agent — flags runaway spend per tenant/experiment.',
            '🔄 Fault recovery — auto-restart failed jobs with checkpointing.',
            '🔑 Quota enforcement — reviews requests, grants/denies by policy.',
            '📊 Utilization reporting — daily briefing on idle GPUs and savings.',
          ]},
          { type: 'typical', title: 'Typical KPIs shared', items: ['GPU utilization ↑', 'Orphaned instance cost ↓', 'Job success rate ↑'] },
        ],
      },
      {
        title: 'Financial Services',
        tag: 'Use cases',
        hook: 'Compliance-heavy, data-rich — the perfect agent territory.',
        blocks: [
          { type: 'list', items: [
            '💸 KYC onboarding — collect docs, verify, screen sanctions, flag gaps.',
            '📋 Loan origination — parse application + statements, pre-score, route to underwriting.',
            '🚨 Fraud monitoring — score transactions, hold suspicious ones, draft SAR narratives.',
            '🧾 Invoice reconciliation — match payments to invoices, chase exceptions.',
            '📑 Regulatory filing drafting — pull data, draft, flag where human sign-off is needed.',
          ]},
          { type: 'typical', title: 'Typical KPIs shared', items: ['Onboarding time ↓', 'False-positive fraud holds ↓', 'Close rates ↑'] },
        ],
      },
      {
        title: 'Supply Chain & Logistics',
        tag: 'Use cases',
        hook: 'From PO to delivery — agents close the loop on every hand-off.',
        blocks: [
          { type: 'list', items: [
            '📦 Purchase-order processing — parse POs, validate pricing, flag discrepancies.',
            '🚚 Shipment monitoring — track in transit, predict delays, auto-notify customers.',
            '📋 Inventory balancing — recommend transfers before stockouts.',
            '🧾 Freight invoice audit — compare to rate cards, recover overbilling.',
            '🔮 Demand forecasting — combine sales + external signals into weekly plans.',
          ]},
          { type: 'typical', title: 'Typical KPIs shared', items: ['Freight cost ↓', 'Stockout rate ↓', 'Days payable outstanding ↑'] },
        ],
      },
      {
        title: 'Customer Experience & CRM',
        tag: 'Use cases',
        hook: 'The most saturated agent market — but the bar keeps rising.',
        blocks: [
          { type: 'list', items: [
            '💬 Ticket triage — classify, summarize, suggest reply, auto-route.',
            '🔁 Churn detection — score at-risk accounts, draft retention plays.',
            '🤝 Post-purchase follow-up — happy-path check-ins at the right moment.',
            '📅 Meeting prep agent — CRM digests + competitor intel before every call.',
            '📊 Win/loss analysis — turn deal history into field coaching notes.',
          ]},
          { type: 'typical', title: 'Typical KPIs shared', items: ['CSAT ↑', 'First-response time ↓', 'Churn ↓'] },
        ],
      },
      {
        title: 'HR & Talent',
        tag: 'Use cases',
        hook: 'Hiring is 90% sorting and screening — agents do that with bias guardrails.',
        blocks: [
          { type: 'list', items: [
            '📄 Resume screening — match to JD, surface gaps, rank candidates.',
            '🗓️ Interview scheduling — coordinate calendars, send prep packs.',
            '🎓 Skill-gap analysis — map team skills to roadmap needs.',
            '📈 Engagement sensing — spot risk signals in pulse surveys.',
            '🧾 Onboarding assistant — chase paperwork, answer FAQs 24/7.',
          ]},
          { type: 'typical', title: 'Typical KPIs shared', items: ['Time-to-hire ↓', 'Sourcing hours ↓', 'Candidate experience score ↑'] },
        ],
      },
      {
        title: 'Legal & Compliance',
        tag: 'Use cases',
        hook: 'Contracts + rules = agents that read, flag, and route.',
        blocks: [
          { type: 'list', items: [
            '📑 Contract review — redline risky clauses against playbooks.',
            '🚨 Regulatory monitoring — watch rule changes, map impact to obligations.',
            '🧾 Evidence collection — gather and organize documents for audits.',
            '📋 SLA compliance — track obligations, alert before breach.',
            '🔍 Policy drafting — first-draft policies from templates + precedent.',
          ]},
          { type: 'typical', title: 'Typical KPIs shared', items: ['Review turnaround ↓', 'Missed obligations → 0', 'Audit prep hours ↓'] },
        ],
      },
      {
        title: 'Marketing & Content',
        tag: 'Use cases',
        hook: 'Agents as the always-on content engine — with a human editor.',
        blocks: [
          { type: 'list', items: [
            '✍️ Brief-to-draft — turn briefs into brand-consistent first drafts.',
            '🔎 Competitor watch — daily diff of rivals’ messaging and pricing.',
            '📅 Content calendar — plan topics from search + social signals.',
            '💬 Comment engagement — draft replies, flag sensitive ones for humans.',
            '📊 Campaign recaps — pull performance, write the deck section.',
          ]},
          { type: 'typical', title: 'Typical KPIs shared', items: ['Draft turnaround ↓', 'Personalization ↑', 'Content output 3×'] },
        ],
      },
      {
        title: 'Cybersecurity & Risk',
        tag: 'Use cases',
        hook: 'Speed matters in security — agents compress the triage loop.',
        blocks: [
          { type: 'list', items: [
            '🛡️ Alert enrichment — add context to every security alert automatically.',
            '🚨 Phishing report triage — analyze, block, and respond.',
            '🧾 Incident playbook runner — guide analysts step-by-step, capture evidence.',
            '📋 Access review — spot over-privileged accounts before audits.',
            '🔎 Threat intel digest — daily briefing of what changed overnight.',
          ]},
          { type: 'typical', title: 'Typical KPIs shared', items: ['MTTD/MTTR ↓', 'Alert fatigue ↓', 'Evidence completeness ↑'] },
        ],
      },
      {
        title: 'Manufacturing & Construction',
        tag: 'Use cases',
        hook: 'Physical ops meet AI ops — safety first, always.',
        blocks: [
          { type: 'list', items: [
            '🏗️ Site safety monitoring — flag PPE/zone violations from cameras.',
            '🔧 Predictive maintenance — vibration/temp data → repair tickets.',
            '📋 Quality inspection — vision-based defect triage on the line.',
            '📐 Change-order review — price and risk diff construction changes.',
            '🚚 Material logistics — coordinate deliveries to avoid idle crews.',
          ]},
          { type: 'typical', title: 'Typical KPIs shared', items: ['Downtime ↓', 'Defect escapes ↓', 'Safety incidents ↓'] },
        ],
      },
      {
        title: 'Energy & Utilities',
        tag: 'Use cases',
        hook: 'Grid-scale data needs grid-scale automation.',
        blocks: [
          { type: 'list', items: [
            '⚡ Demand forecasting — short-term load predictions for dispatch.',
            '🌦️ Weather-driven ops — correlate forecasts with solar/wind output.',
            '📊 Asset health — transformer/substation sensor analytics.',
            '🧾 Regulatory reporting — assemble compliance data packages.',
            '🔌 Outage response — parse calls + meters, dispatch crews, update customers.',
          ]},
          { type: 'typical', title: 'Typical KPIs shared', items: ['Forecast error ↓', 'Response time ↓', 'Crew utilization ↑'] },
        ],
      },
      {
        title: 'Healthcare & Life Sciences',
        tag: 'Use cases',
        hook: 'Highest stakes, hardest data — and the most room for agents to help staff.',
        blocks: [
          { type: 'list', items: [
            '📋 Clinical note drafting — first-pass notes, human-attested.',
            '🧪 Trial matching — match patients to studies from EHRs.',
            '🩺 Coding & billing — ICD/CPT suggestion with audit trail.',
            '📚 Literature search — stay current on a specialty automatically.',
            '🔔 Follow-up coordination — no-show prevention, care-plan reminders.',
          ]},
          { type: 'typical', title: 'Typical KPIs shared', items: ['Admin burden ↓', 'Trial enrollment ↑', 'Billing errors ↓'] },
        ],
      },
      {
        title: 'Cross-cutting agent infrastructure',
        tag: 'Use cases',
        hook: 'The horizontal layer every vertical depends on.',
        blocks: [
          { type: 'list', items: [
            '🔐 Permission gatekeeper — decides what each agent may do per scope.',
            '🧾 Cost/usage governor — budgets, quotas, spend alerts per agent.',
            '📈 Eval harness — regression suites for agent behavior.',
            '🪵 Trace & audit — every step logged for review and compliance.',
            '🤝 Human handoff — escalations with full context, always.',
          ]},
          { type: 'typical', title: 'The point people share', items: [
            'The “1000 use cases” list isn’t 1000 products. It’s ~10 patterns × 100 domains.',
            'Pick ONE category. Master the pattern. Then extend.',
            'Every use case needs a KPI or it’s a demo, not a product.',
          ]},
        ],
      },
    ],
  },
  {
    id: 'tools',
    num: '05',
    icon: '🛠️',
    title: 'Tools & Stack',
    tagline: 'Agent stacks, frameworks, coding tools, libraries, local AI',
    color: 'red',
    pages: [
      {
        title: 'The 9-tool AI agent stack',
        tag: 'Projects',
        hook: 'What a production agent actually runs on — the stack everyone saves.',
        blocks: [
          { type: 'list', title: 'The stack', items: [
            '1. Orchestrator — the loop/state machine (LangGraph, CrewAI, OpenAI Agents, custom).',
            '2. Model gateway — routing, fallbacks, caching across providers.',
            '3. Memory store — session + long-term vector memory.',
            '4. Vector DB — embeddings for RAG (pgvector, Qdrant, Pinecone, Chroma).',
            '5. MCP servers — tools: files, web, SQL, GitHub, Slack, email.',
            '6. Reranker — top-k quality (cross-encoder or cohere/bge rerank).',
            '7. Eval harness — golden sets + LLM-as-judge.',
            '8. Observability — tracing (Langfuse, Arize, Helicone).',
            '9. Guardrails — PII mask, jailbreak filter, policy checks.',
          ]},
          { type: 'typical', title: 'The point people share', items: [
            'Free-tier hacks are fine for demos; production needs all 9.',
            'Start with 4: orchestrator + memory + tools + evals.',
            '“My stack” posts outperform “my model” posts — stack = opinion = comments.',
          ]},
        ],
      },
      {
        title: 'Web data scraping with agents (BData CLI)',
        tag: 'Projects',
        hook: 'Agents are the best scrapers ever built — they read like humans, not like bots.',
        blocks: [
          { type: 'para', text: 'A terminal-based AI agent that scrapes web data (like BData CLI) shows the modern pattern: an agent + browser tools + structured output. No more brittle CSS selectors — the agent navigates, interprets, and extracts based on intent.' },
          { type: 'list', title: 'Why agents beat scrapers', items: [
            'Resilient to layout changes — the model understands, not just selects.',
            'Handles JS-heavy pages by driving a real browser.',
            'Extracts semantics, not raw HTML: “price” not “div[class*=p-9]”.',
            'Can chain: scrape → clean → summarize → save to DB → notify.',
          ]},
          { type: 'typical', title: 'Typical stack', items: ['Playwright/Camoufox browser driver', 'MCP server exposing the browser', 'Structured output (JSON schema)', 'Rate limiting + polite crawling + cache'] },
        ],
      },
      {
        title: 'LinkedIn scraping tools — the comparison',
        tag: 'Use cases',
        hook: 'The saved-tools list for LinkedIn data, categorized the way practitioners think.',
        blocks: [
          { type: 'table', title: 'Categorized tools', headers: ['Category', 'Tools', 'Use when'], rows: [
            ['LinkedIn-specific', 'ProxyCurl, PhantomBuster, ScrapIn, scrapingbee-linkedin', 'Profiles, companies, jobs, posts at scale'],
            ['Web scraping platforms', 'Apify Actors, Octoparse, ScraperAPI', 'Full websites incl. LinkedIn-adjacent pages'],
            ['AI-powered scraping', 'ScrapeGraphAI, Firecrawl, Crawl4AI', 'LLM-driven extraction, no-code pipelines'],
            ['Automation / RPA', 'n8n, Make, UiPath', 'Chaining scraped data into workflows'],
            ['Libraries', 'BeautifulSoup, Scrapy, requests', 'Custom lightweight pipelines'],
          ]},
          { type: 'list', title: 'The chaining pipeline', items: [
            'Find creators/hashtags to track → scrape post metrics → AI summarize → store → publish digest.',
            'Always respect LinkedIn ToS; use APIs where they exist; add delays + auth care.',
          ]},
          { type: 'typical', title: 'The point people share', items: [
            'Free APIs break weekly. Budget for proxies + maintenance.',
            'Structured, clean data beats scraping everything.',
          ]},
        ],
      },
      {
        title: '6 agent frameworks compared',
        tag: 'Concepts',
        hook: 'LangChain, LangGraph, CrewAI, PydanticAI, OpenAI Agents, AutoGen — which one do you actually need?',
        blocks: [
          { type: 'table', title: 'The comparison', headers: ['Framework', 'Core idea', 'Best for', 'Watch out for'], rows: [
            ['LangChain', 'Chain + tool library of everything', 'Quick RAG and prototypes, huge ecosystem', 'Abstraction drift; v0.x→v1.x churn'],
            ['LangGraph', 'Graph/state-machine agents', 'Complex, stateful, branching agents', 'Steeper learning curve'],
            ['CrewAI', 'Role-based “crews” of agents', 'Task delegation demos', 'Roles ≠ production orchestration'],
            ['PydanticAI', 'Type-safe, Pydantic-driven agents', 'Production Python apps with strict IO', 'Younger ecosystem'],
            ['OpenAI Agents', 'Lightweight Python SDK for tool loops', 'Simple single-agent loops fast', 'Opinionated to OpenAI'],
            ['AutoGen', 'Multi-agent conversation', 'Research/experiments', 'Loops can get expensive & messy'],
          ]},
          { type: 'typical', title: 'How people actually choose', items: [
            'Prototype in LangChain; ship control flow in LangGraph; keep IO typed with Pydantic.',
            'For one agent with 3 tools, skip frameworks entirely — a while-loop is enough.',
            '“Which framework?” is the wrong first question. “What loop do I need?” is right.',
          ]},
        ],
      },
      {
        title: 'AI coding tools — which to open when',
        tag: 'Use cases',
        hook: 'Cursor, Copilot, Windsurf, Claude Code. The crowd-sourced cheat-sheet for choosing.',
        blocks: [
          { type: 'table', title: 'The pick chart', headers: ['Tool', 'Style', 'Sweet spot'], rows: [
            ['Cursor', 'AI IDE (VSCode fork)', 'Interactive editing with full project context'],
            ['GitHub Copilot', 'IDE assistant', 'Inline completions + chat in your existing IDE'],
            ['Windsurf', 'AI IDE (Cascade)', 'Agentic multi-file edits in the editor'],
            ['Claude Code', 'Terminal agent', 'Deep repo work, long autonomous tasks, scripting'],
          ]},
          { type: 'list', title: 'The shared workflow', items: [
            'Plan first: describe intent in the prompt, not just “fix this.”',
            'Small, reviewable diffs — never blind-apply agent output.',
            'Keep the agent in the loop with tests: run them after every change.',
            'Most people end up using 2: one IDE + one terminal agent.',
          ]},
          { type: 'typical', title: 'The point people share', items: [
            'The tool matters less than your prompt + review discipline.',
            'Vibe-coding without tests is how you get commit-and-pray.',
            'CLI agents + good README = the best ramp into a legacy repo.',
          ]},
        ],
      },
      {
        title: '10 Python libraries for GenAI',
        tag: 'Code',
        hook: 'The dependency list that shows up in every serious GenAI repo.',
        blocks: [
          { type: 'list', title: 'The 10', items: [
            '1. openai / anthropic — provider SDKs.',
            '2. langchain-core — prompts, schemas, runnables.',
            '3. llama-index — RAG data framework.',
            '4. pydantic — structured I/O validation.',
            '5. sentence-transformers — embeddings locally.',
            '6. chromadb / qdrant-client — vector stores.',
            '7. tiktoken — token counting.',
            '8. fastapi — serving endpoints.',
            '9. tenacity — retries with backoff.',
            '10. mlflow / langfuse — tracking & tracing.',
          ]},
          { type: 'code', title: 'The pattern in 6 lines', lang: 'python', code: `from langchain_core.prompts import ChatPromptTemplate
from pydantic import BaseModel
from llama_index.core import VectorStoreIndex

class Lead(BaseModel):              # pydantic = structured output
    name: str
    budget: float
    stage: str

index = VectorStoreIndex.from_documents(docs)   # RAG in one line` },
          { type: 'typical', title: 'The point people share', items: [
            '90% of “AI apps” are these 10 libraries, rearranged.',
            'Pydantic is the quiet MVP — structured output is the whole game.',
            'Copy the stack, then customize the loop.',
          ]},
        ],
      },
      {
        title: 'Local AI — models that run on your laptop',
        tag: 'Use cases',
        hook: 'You don’t need the cloud for every task. Local models are getting dangerously good.',
        blocks: [
          { type: 'list', title: 'The local stack', items: [
            'Ollama — one command to run open models locally (Llama, Qwen, GLM, DeepSeek).',
            'vLLM — high-throughput serving when you outgrow Ollama.',
            'GGUF/llama.cpp — quantized models that fit consumer hardware.',
            'Embeddings locally — all-MiniLM / bge-small for offline RAG.',
            'Voice locally — Whisper.cpp for transcription without the cloud.',
          ]},
          { type: 'table', title: 'Cloud vs local', headers: ['Dimension', 'Cloud API', 'Local model'], rows: [
            ['Capability', 'Frontier quality', 'Good-to-strong (small sizes)'],
            ['Privacy', 'Data leaves your machine', 'Stays on device'],
            ['Cost', 'Per token', 'Power + hardware'],
            ['Latency', 'Network + queue', 'Deterministic hardware speed'],
            ['Scale', 'Massive context, many models', 'Constrained by RAM/VRAM'],
          ]},
          { type: 'typical', title: 'The point people share', items: [
            'Pattern: cloud for the hard 10%, local for the repeated 90%.',
            'A quantized 7B–14B beats a big model for chat, extraction, and classification.',
            '“Your data should decide the deployment, not your FOMO.”',
          ]},
        ],
      },
    ],
  },
  {
    id: 'career',
    num: '06',
    icon: '🎓',
    title: 'Career & Learning',
    tagline: 'Roadmaps, roles, certs, and the learning order',
    color: 'teal',
    pages: [
      {
        title: 'Cloud Architect → AI Architect',
        tag: 'Career',
        hook: 'The career-shift post that keeps getting shared — because it’s happening to everyone.',
        blocks: [
          { type: 'para', text: 'The cloud architect who knew VPCs and IAM is being asked about agents, evals, and vector stores. The evolution isn’t “throw away cloud skills” — it’s layering AI-native thinking on top.' },
          { type: 'table', title: 'The evolution', headers: ['Old → New', 'What changes'], rows: [
            ['VPC/subnet design → Agent topology', 'Where agents live, how they’re isolated'],
            ['IAM roles → Permission models for tools', 'Scopes, allowlists, least-privilege for MCP'],
            ['Load balancers → Orchestrators & routers', 'Routing between models + tools'],
            ['Databases → Memory + vector stores', 'Retrieval becomes a first-class design'],
            ['Monitoring → Tracing & evals', 'You can’t restart an agent like a server'],
          ]},
          { type: 'typical', title: 'The point people share', items: [
            'Your cloud cert still matters — the platform layer is now AI-platform.',
            'Learn one vertical deep: RAG, agents, or evals — then generalize.',
            '“Cloud Architect” is becoming “AI Architect.” Update your title and your GitHub.',
          ]},
        ],
      },
      {
        title: 'Agentic AI interview questions',
        tag: 'Career',
        hook: 'What interviewers actually ask for agent roles — the shared question bank.',
        blocks: [
          { type: 'list', title: 'The question bank', items: [
            'Walk me through how you’d design a RAG system for a 100k-doc corpus.',
            'What’s the ReAct loop? When does an agent need it?',
            'How do you evaluate an agent? Design an eval for [task].',
            'When would you choose CAG over RAG?',
            'How do you handle tool failures and model retries?',
            'How do you keep an agent from making the same mistake twice? (memory + evals)',
            'Design a permission model for a team of agents.',
            'How do you trace and debug a bad agent decision in production?',
            'What’s the difference between MCP and A2A?',
            'How would you cut an agent’s cost by 50%?',
          ]},
          { type: 'typical', title: 'The point people share', items: [
            'Every answer should reference a real system you built.',
            '“I’d use LangGraph” is not an answer. “I’d use it because X pattern needs state” is.',
            'Evals questions are the filter that separates demo-builders from engineers.',
          ]},
        ],
      },
      {
        title: 'Certifications & learning paths',
        tag: 'Career',
        hook: 'The cert map of 2026 — from vendor to specialization.',
        blocks: [
          { type: 'list', title: 'Where people are aiming', items: [
            'Vendor AI: OpenAI, Anthropic, Google Vertex AI, Azure AI, AWS AI practitioner.',
            'Platform: LangChain/LangGraph, Hugging Face, Weaviate/Qdrant certs.',
            'Architecture: Google Cloud / AWS Architect + AI specialization.',
            'Specialist: RAG engineering, agent safety, evals, MCP builder.',
            'Foundations: Python + ML + data engineering still underpin everything.',
          ]},
          { type: 'typical', title: 'The point people share', items: [
            'Certs open interviews; projects win offers. Ship, then certify.',
            'Stack: 1 vendor cert + 1 hands-on portfolio + 1 open-source contribution.',
            'The fastest-growing cert category is agentic/evals, not model basics.',
          ]},
        ],
      },
      {
        title: 'The 12 things to learn before Agentic AI',
        tag: 'Learning',
        hook: 'The most-shared learning order of the year — because it refuses to start with “agents.”',
        blocks: [
          { type: 'list', title: 'The 12-step order', items: [
            '1. Python — the entire field’s lingua franca.',
            '2. SQL — most “AI” work is still data work.',
            '3. Git — agents will write code; you’ll need to review it.',
            '4. HTTP & APIs — the tool layer is web-native.',
            '5. Data structures — chunking, batching, indexing.',
            '6. Prompting — system/user roles, temperature, structured output.',
            '7. Tokenization — how models actually see text.',
            '8. Embeddings — similarity is the heart of RAG.',
            '9. RAG — retrieval, reranking, evaluation.',
            '10. Fine-tuning — when and why (usually: later).',
            '11. Agents & orchestration — tools, memory, loops.',
            '12. Evals & observability — how you know it works.',
          ]},
          { type: 'quote', text: 'You can’t skip to agents. Every skipped layer becomes a bug you debug for a month.' },
          { type: 'typical', title: 'The point people share', items: [
            'The order matters more than the speed.',
            'Two weeks per layer, one project per layer, then move on.',
            '“I learned agentic AI” is a red flag. “I learned SQL, RAG, then agents” is a resume.',
          ]},
        ],
      },
      {
        title: 'The 3-level agent roadmap',
        tag: 'Learning',
        hook: 'The anti-tutorial roadmap: learn by building, level by level.',
        blocks: [
          { type: 'list', title: 'Level 1 — Foundations (weeks 1–4)', items: [
            'Prompting + structured output with any API.',
            'Tool calls: give a model 2 functions and a while-loop.',
            'Build: an AI that reads a CSV and answers questions about it.',
          ]},
          { type: 'list', title: 'Level 2 — Systems (weeks 5–12)', items: [
            'RAG end-to-end: ingest, embed, retrieve, rerank, cite.',
            'Memory: session + vector memory.',
            'Orchestration: LangGraph/CrewAI with real branching.',
            'Build: a support agent that uses your docs and a DB.',
          ]},
          { type: 'list', title: 'Level 3 — Production (months 3+)', items: [
            'Evals: golden sets, LLM-as-judge, regression gates.',
            'Observability: tracing every step.',
            'Guardrails: permissions, PII, budgets.',
            'Build: an agent that runs unattended for a week, monitored.',
          ]},
          { type: 'typical', title: 'The point people share', items: [
            'Each level ends with a deployable artifact, not a notebook.',
            '“Production” means someone else could operate it.',
            'Level 3 is where the jobs are; 90% of learners never leave level 1.',
          ]},
        ],
      },
      {
        title: 'AI agent manager — the new role',
        tag: 'Career',
        hook: 'The job title appearing on LinkedIn every day now: managing a team of AI agents.',
        blocks: [
          { type: 'para', text: 'Posts keep describing the same role: instead of two engineers maintaining one workflow, one person runs a fleet of agents that each handle a slice. The “AI agent manager” owns agent inventory, quality, and cost.' },
          { type: 'list', title: 'What the role owns', items: [
            'Agent inventory — which agents exist, what each does, who owns it.',
            'Eval health — regression suites that run before every prompt change.',
            'Cost & quota governance — token budgets per agent.',
            'Permission model — least-privilege scopes for every tool.',
            'Failure ROTAs — incident response for agents, not servers.',
          ]},
          { type: 'typical', title: 'The point people share', items: [
            'It’s a platform role: same skills as SRE/platform eng, new object of management.',
            '“Managing humans is delegation. Managing agents is observability + evals.”',
            'Start the role before you need it — hire it at agent #3, not agent #30.',
          ]},
        ],
      },
    ],
  },
  {
    id: 'market',
    num: '07',
    icon: '📈',
    title: 'Market & Signals',
    tagline: 'MANGOS, AI factories, IPOs, and the acronym map',
    color: 'blue',
    pages: [
      {
        title: 'The 2026 AI IPO & model landscape',
        tag: 'News',
        hook: 'What the market is pricing in — and the model names everyone is watching.',
        blocks: [
          { type: 'list', title: 'IPO watchlist signals', items: [
            'Infrastructure: GPU-cloud and data-center operators with AI backlog → IPO pipeline.',
            'Tooling: eval, observability, and orchestration startups crossing $100M ARR.',
            'Vertical agents: legal, healthcare, and finance agents with real revenue.',
            'The pattern: companies that monetized before hyping → priced by multiples of AI revenue.',
          ]},
          { type: 'list', title: 'Model-name map (so you’re not lost)', items: [
            'Anthropic Claude family (Opus / Sonnet / Haiku tiers; Fable5/Mythos5-era successors in discussion).',
            'OpenAI GPT line — flagship + fast/mini variants.',
            'Google Gemini — multimodal-first line.',
            'Open-weight challengers (Llama, Qwen, DeepSeek) driving cost collapse.',
            'Rule of thumb: frontier names change yearly; the context/tools/evals layer is where value compounds.',
          ]},
          { type: 'typical', title: 'The point people share', items: [
            '“Model names rotate. Your RAG, agents, and evals are the moat.”',
            'Follow AI revenue multiples, not press releases.',
            'The money moved from models → infrastructure → agents → vertical apps.',
          ]},
        ],
      },
      {
        title: 'The acronym map that keeps being saved',
        tag: 'Concepts',
        hook: 'RAG, CAG, MAG, MCP, A2A, ANP, ACP — one cheat-sheet.',
        blocks: [
          { type: 'table', title: 'The cheat-sheet', headers: ['Acronym', 'Full name', 'One-liner'], rows: [
            ['RAG', 'Retrieval-Augmented Generation', 'Retrieve docs at query time'],
            ['CAG', 'Context-Augmented Generation', 'Stuff the whole corpus in context'],
            ['MAG', 'Memory-Augmented Generation', 'Memorize/fine-tune the knowledge'],
            ['MCP', 'Model Context Protocol', 'Model ↔ tools standard'],
            ['A2A', 'Agent-to-Agent', 'Agent ↔ agent standard'],
            ['ANP', 'Agent Network Protocol', 'P2P agent coordination'],
            ['ACP', 'Agent Client Protocol', 'Apps ↔ agents'],
            ['ReAct', 'Reason + Act', 'Think → act → observe loop'],
          ]},
          { type: 'typical', title: 'The point people share', items: [
            'Memorize the three-letter map; it signals fluency instantly.',
            'The stack that wins: RAG for knowledge, MCP for tools, evals for trust.',
          ]},
        ],
      },
      {
        title: 'FAANG → MANGOS',
        tag: 'News',
        hook: 'The market-order acronym everyone keeps resharing. The cap table of AI is being redrawn.',
        blocks: [
          { type: 'para', text: 'The old FAANG order (Facebook/Meta, Apple, Amazon, Netflix, Google) is being replaced in market-cap conversations by MANGOS — the new giants that own the AI layers: Microsoft, Apple, NVIDIA, Google, OpenAI, and (the extra S) Sam Altman’s constellation / SpaceX-style AI moonshots, depending on who’s posting.' },
          { type: 'list', title: 'Why it’s reshuffling', items: [
            'NVIDIA — the picks-and-shovels of every AI build.',
            'Microsoft — the enterprise distribution layer (Copilot stack).',
            'OpenAI — frontier model + consumer distribution.',
            'Google — full stack: chips, models, cloud, search.',
            'Apple — the on-device AI surfacing moment.',
          ]},
          { type: 'typical', title: 'The point people share', items: [
            'The list matters less than the pattern: value moved to whoever owns the compute or the distribution.',
            '“MANGOS” is clickbait with a signal inside: infra + distribution beat pure model labs in revenue.',
            'Don’t trade on acronyms; do read what they imply about the moats.',
          ]},
        ],
      },
      {
        title: 'AI factories & Vera Rubin',
        tag: 'News',
        hook: 'The most “real economy” AI news of the year: AI is becoming infrastructure, literally.',
        blocks: [
          { type: 'list', title: 'What’s happening', items: [
            'AI factories — massive facilities purpose-built to run inference/training at power-grid scale.',
            'Vera Rubin (and successors) — hyperscale clusters measured in hundreds of MW and tens of thousands of GPUs.',
            'Energy is the constraint — sites chosen for power, cooling, and grid capacity.',
            'Liquid cooling and co-location with renewables are becoming the differentiators.',
          ]},
          { type: 'list', title: 'Why it matters for builders', items: [
            'Capacity is coming — inference prices keep falling as supply lands.',
            'Latency = physics: where the factory is decides who gets low-latency access.',
            'The software stack (orchestrators, schedulers) is being rebuilt for this scale.',
          ]},
          { type: 'typical', title: 'The point people share', items: [
            '“AI’s real bottleneck was never GPUs. It was megawatts.”',
            'If you build on AI, you’re building on a supply chain — plan for it.',
            'The winners are the ones who priced power into their unit economics early.',
          ]},
        ],
      },
      {
        title: 'Hyperscale data centers — the rack anatomy',
        tag: 'Concepts',
        hook: 'Every “AI infra” post eventually explains the physical stack. Here’s the shared version.',
        blocks: [
          { type: 'list', title: 'The physical layers', items: [
            'Facility — building, cooling loops, backup power, grid connection.',
            'Hall / suite — tens of rows, fire suppression, airflow management.',
            'Rack — the unit of capacity: 42U–48U, power budgeted per rack.',
            'Node/server — 1–8 GPUs per node, high-speed NICs (InfiniBand/400G).',
            'Network — spine/leaf fabric connecting every GPU to every GPU.',
            'Storage — NVMe tier + object tier for checkpoints and datasets.',
          ]},
          { type: 'table', title: 'Rack-scale terms', headers: ['Term', 'Meaning'], rows: [
            ['Power density', 'kW per rack; AI racks run 30–120kW vs ~8kW classic'],
            ['PUE', 'Power Usage Effectiveness — how much is lost to cooling'],
            ['Interconnect', 'NVLink/InfiniBand — the plumbing that makes clusters “one GPU”'],
            ['GPU-hours', 'The billing unit of AI computing'],
          ]},
          { type: 'typical', title: 'The point people share', items: [
            'Know the rack anatomy — it explains price, latency, and shortage stories.',
            '“Your vector DB is slow” sometimes means “the GPUs are in another hall.”',
            'Cost models start with power density, not cloud pricing pages.',
          ]},
        ],
      },
      {
        title: 'GenAI didn’t start with ChatGPT',
        tag: 'History',
        hook: 'The timeline post that grounds the hype. ChatGPT was an interface event, not the beginning.',
        blocks: [
          { type: 'list', title: 'The timeline people get wrong', items: [
            '1950s–80s — symbolic AI, early neural nets, backpropagation research.',
            '2012 — AlexNet shows deep learning wins vision at scale.',
            '2014–2017 — GANs, LSTM-era NLP, attention paper ("Attention Is All You Need").',
            '2018–2020 — Transformers go mainstream; GPT-2/3, BERT; scaling laws.',
            '2021–2022 — Diffusion models (image), RLHF, ChatGPT launches (Nov 2022).',
            '2023–2024 — GPT-4, Claude, Gemini; agents begin; RAG becomes standard.',
            '2025–2026 — Agentic AI, MCP, local models, AI factories.',
          ]},
          { type: 'quote', text: 'The lesson isn’t “we’re early.” It’s that each wave is built on the research of the wave before — and the builders are the ones who read history.' },
          { type: 'typical', title: 'The point people share', items: [
            'GenAI is a UI moment on top of 40 years of ML research.',
            'The biggest risk is building on a single model name, not on the underlying patterns.',
            'History fans build platforms; hype chasers build wrappers.',
          ]},
        ],
      },
    ],
  },
  {
    id: 'architecture',
    num: '08',
    icon: '🧩',
    title: 'Model Architecture',
    tagline: '8 LLM architectures, SLM vs LLM, RNNs, and decoding',
    color: 'green',
    pages: [
      {
        title: '8 LLM architectures & the jobs they create',
        tag: 'Theory',
        hook: '“GPT” is one letter. The architecture map behind the names is the real signal.',
        blocks: [
          { type: 'table', title: 'The architecture family', headers: ['Type', 'Full name', 'What it is', 'Where you see it'], rows: [
            ['GPT', 'Generative Pre-trained Transformer', 'Decoder-only text generation', 'ChatGPT, Claude'],
            ['MoE', 'Mixture of Experts', 'Routers activate only a few “experts” per token', 'GPT-4-class, DeepSeek'],
            ['LRM', 'Large Reasoning Model', 'Trains chain-of-thought before answering', 'Reasoning/“thinking” models'],
            ['VLM', 'Vision-Language Model', 'Text + image understanding', 'Gemini, Claude vision'],
            ['SLM', 'Small Language Model', '<10B, fast and cheap, runs locally', 'Phi, Gemma, Qwen small'],
            ['LAM', 'Large Action Model', 'Trained for actions/UI control, not just text', 'Computer-use agents'],
            ['HRM', 'Hierarchical RAG Model', 'Multi-level memory/retrieval architecture', 'Enterprise RAG stacks'],
            ['LCM', 'Latent Consistency Model', 'Few-step generation (esp. images)', 'Fast diffusion'],
          ]},
          { type: 'typical', title: 'The point people share', items: [
            '“Architecture” describes the compute shape, not just the brand.',
            'MoE is why “GPT-4 class” is now cheaper — sparse activation.',
            'Every new letter is an attempt to break a specific bottleneck (cost, latency, actions).',
          ]},
        ],
      },
      {
        title: 'SLM vs LLM — right-sizing your model',
        tag: 'Concepts',
        hook: 'The frontier isn’t always right. Right-sizing by task is the cost story of 2026.',
        blocks: [
          { type: 'table', title: 'SLM vs LLM', headers: ['Dimension', 'SLM (<10B)', 'LLM (frontier)'], rows: [
            ['Latency', 'Milliseconds, runs locally', 'Seconds, cloud round-trip'],
            ['Cost/token', 'Near zero (local)', 'Highest tier'],
            ['Reasoning depth', 'Good for routing/extraction/classification', 'Complex multi-step reasoning'],
            ['Context length', 'Short-to-medium', 'Very long'],
            ['Privacy', 'Data stays on device', 'Leaves your boundary'],
            ['Best job', 'High-volume, repeated, narrow tasks', 'Hard, novel, open-ended'],
          ]},
          { type: 'list', title: 'The hybrid pattern', items: [
            'Route: SLM classifies intent cheaply.',
            'Escalate: only hard cases go to the frontier model.',
            'Verify: SLM re-checks the frontier’s output format.',
          ]},
          { type: 'typical', title: 'The point people share', items: [
            '“Use the smallest model that passes your evals” is a production mantra.',
            'A 14B fine-tuned beats a frontier model at YOUR narrow task, cheaper.',
            'Right-sizing = 70% of the cost savings people brag about.',
          ]},
        ],
      },
      {
        title: 'RNNs are coming back',
        tag: 'News',
        hook: 'The obituary for RNNs was premature. The post everyone saved on why.',
        blocks: [
          { type: 'para', text: 'Google’s “memory caching” / linear-attention research wave showed transformers’ quadratic attention cost is avoidable. RNN-style recurrent states and linear-time attention make long-context cheap — and the results are coming back into production.' },
          { type: 'list', title: 'Why the return', items: [
            'Cost: transformers scale quadratically with context; recurrent/linear models scale linearly.',
            'Memory: a fixed-size recurrent state replaces the growing KV cache.',
            'Long context: millions of tokens without blowing the budget.',
            'Hardware: linear models map better to existing accelerators.',
          ]},
          { type: 'typical', title: 'The point people share', items: [
            '“The architecture pendulum swings. Attention won on quality, but cost will win on scale.”',
            'Mamba, RWKV, and linear-attention variants are the names to know.',
            'Hybrids (attention + recurrent) are what ships — not purity.',
          ]},
        ],
      },
      {
        title: 'The AI ecosystem layers',
        tag: 'Theory',
        hook: 'The “AI is massive” map — where everything you learn sits.',
        blocks: [
          { type: 'list', title: 'Layer 0 → 5', items: [
            '0. Classical AI — rules, search, optimization, knowledge graphs.',
            '1. Machine Learning — statistics-driven prediction, features, models.',
            '2. Neural Networks — learnable layered representations.',
            '3. Deep Learning — scale + GPUs → vision, speech, language.',
            '4. Generative AI — models that create: text, image, audio, video.',
            '5. Agentic AI — models that act: tools, memory, orchestration, loops.',
          ]},
          { type: 'para', text: 'The viral “AI is a massive ecosystem” posts make one argument: most people jump to layer 5 and never learn layers 0–4, then wonder why their agents break. Each layer constrains the one above it.' },
          { type: 'typical', title: 'The point people share', items: [
            'You don’t need to be a researcher — but you need layer 1–3 fluency.',
            'Pick your layer and own it: data, model, or agent layer.',
            'The ecosystem map is also a career map.',
          ]},
        ],
      },
      {
        title: 'How decoding works — temperature in code',
        tag: 'Code',
        hook: '“Temperature” is a knob you can actually see. Here’s the math behind it.',
        blocks: [
          { type: 'code', title: 'Sampling from logits with temperature', lang: 'python', code: `import math, random

def sample(logits, temperature=0.7):
    probs = [math.exp(x / temperature) for x in logits]
    total = sum(probs)
    probs = [p / total for p in probs]
    return random.choices(range(len(probs)), weights=probs)[0]

# temperature < 1  → peakier, more deterministic
# temperature > 1  → flatter, more creative/random
# temperature -> 0 → argmax (greedy)` },
          { type: 'list', title: 'The knobs that shape output', items: [
            'Temperature — randomness of sampling.',
            'Top-p (nucleus) — only sample from the most-likely cumulative mass.',
            'Top-k — only the k most likely tokens.',
            'max_tokens — hard length cap (and a cost control).',
            'stop sequences — force the model to end at structure.',
          ]},
          { type: 'typical', title: 'The point people share', items: [
            'For extraction/code: temperature ≈ 0. For creative: 0.7–1.2.',
            'Determinism comes from sampling settings + seed, not from the model.',
            '“Creative” is a sampling decision, not a model property.',
          ]},
        ],
      },
    ],
  },
  {
    id: 'production',
    num: '09',
    icon: '🚀',
    title: 'Production & Ops',
    tagline: 'Principles, layers, MLOps, deployment patterns, and cost',
    color: 'purple',
    pages: [
      {
        title: '10 principles of production GenAI',
        tag: 'Concepts',
        hook: 'The checklist that separates demos from systems that survive week three.',
        blocks: [
          { type: 'list', title: 'The 10 principles', items: [
            '1. Evals before rollout — you can’t ship what you can’t measure.',
            '2. Deterministic skeleton — predictable flow, model only where it must decide.',
            '3. Human-in-the-loop gates — for high-stakes actions, always.',
            '4. Structured output everywhere — schemas, not prose.',
            '5. Retries with backoff — models fail like networks, so treat them like it.',
            '6. Token budgets — per-request and per-account caps.',
            '7. Cache aggressively — repeated prompts are free money.',
            '8. Observability from day one — trace every step.',
            '9. Fallback chains — big model → small model → cached → template.',
            '10. Version everything — prompts, models, tools, evals are artifacts.',
          ]},
          { type: 'quote', text: 'Production is where “it works on my prompt” becomes “it works for everyone, always, for under a dollar.”' },
          { type: 'typical', title: 'The point people share', items: [
            'The gap between demo and prod is 90% of the engineering.',
            'Principle 1 is the one most teams skip and regret.',
            'Share a checklist like this → the comments fill with missing items.',
          ]},
        ],
      },
      {
        title: 'The 9-layer AI production architecture',
        tag: 'Concepts',
        hook: 'The “full-stack AI app” drawn as layers — the most-saved diagram of the year.',
        blocks: [
          { type: 'list', title: 'Bottom → top', items: [
            '1. Infrastructure — GPUs, clusters, object storage.',
            '2. Model serving — vLLM, TGI, managed APIs.',
            '3. Gateway — routing, fallbacks, caching, quotas.',
            '4. Orchestration — LangGraph/CrewAI/agents, state machines.',
            '5. Memory & RAG — vector DBs, caches, knowledge stores.',
            '6. Tools & MCP — integrations, permissions, scopes.',
            '7. Eval & CI — golden sets, regressions, LLM-as-judge.',
            '8. Observability — tracing, metrics, budgets.',
            '9. Guardrails — PII, jailbreaks, policy, human review.',
          ]},
          { type: 'para', text: 'The insight: the “AI app” everyone demos is layer 4 only. Production is the other 8. Which is why the platforms layer is where the jobs and the startups are.' },
          { type: 'typical', title: 'The point people share', items: [
            'Each layer is a category: every layer has its own startups.',
            'Most “AI companies” are layer 4 features on someone else’s layers 1–3.',
            'The deeper you own, the more moat — and the more ops burden.',
          ]},
        ],
      },
      {
        title: 'The MLOps & LLMOps stack',
        tag: 'Concepts',
        hook: 'MLOps grew up. Here’s the modern stack, from experiment to serving.',
        blocks: [
          { type: 'list', title: 'The stack by stage', items: [
            'Experiment: notebooks → MLflow/Weights & Biases for tracking.',
            'Data: Feast / feature stores; validation with Great Expectations.',
            'Training: PyTorch/Trainer, Ray for distributed.',
            'Registry: model registry + versioned artifacts.',
            'Serving: vLLM/TGI for LLMs, TorchServe/FastAPI for others.',
            'CI/CD: evals in the pipeline; prompt+model versioning.',
            'Monitoring: drift, latency, cost, quality dashboards.',
            'Governance: lineage, approvals, audit logs.',
          ]},
          { type: 'table', title: 'MLOps vs LLMOps', headers: ['Dimension', 'MLOps', 'LLMOps'], rows: [
            ['Main artifact', 'Model weights', 'Prompt + model + tools'],
            ['Evaluation', 'Metrics on held-out data', 'Evals, judges, human review'],
            ['Failure mode', 'Drift, bias, data issues', 'Hallucination, cost, jailbreak'],
            ['Rollback', 'Serve older model', 'Revert prompt/config instantly'],
            ['Unit of versioning', 'Model checkpoint', 'Prompt, config, tools, evals'],
          ]},
          { type: 'typical', title: 'The point people share', items: [
            'LLMOps is 80% config management + evals, 20% model ops.',
            'Prompt changes are code changes — version and review them.',
            'The stack is the résumé: building all of it once is the best portfolio.',
          ]},
        ],
      },
      {
        title: '4 agent deployment patterns',
        tag: 'Concepts',
        hook: 'Where does your agent run? The pattern changes everything about cost and UX.',
        blocks: [
          { type: 'table', title: 'Deployment patterns', headers: ['Pattern', 'How it runs', 'Best for', 'Tradeoff'], rows: [
            ['Batch', 'Runs on schedule or queue, no user waiting', 'Digests, reports, data jobs', 'Not interactive'],
            ['Streaming', 'Tokens stream back to the UI live', 'Chat assistants, copilots', 'Cost control is harder'],
            ['Real-time', 'Synchronous request → response', 'APIs, tool calls, forms', 'Latency SLA pressure'],
            ['Edge/local', 'Runs on device with local models', 'Privacy, offline, latency-critical', 'Smaller models'],
          ]},
          { type: 'para', text: 'The shared advice: don’t force everything into real-time. A weekly batch digest is cheaper and more reliable than 10,000 live requests — and users don’t care when it’s a summary.' },
          { type: 'typical', title: 'The point people share', items: [
            'Match the pattern to the user’s tolerance for waiting.',
            'Hybrid: batch the heavy lifting, stream the confirmation.',
            '“Always synchronous” is how you burn money on latency you never needed.',
          ]},
        ],
      },
      {
        title: 'Token & cost optimization — 6 ways',
        tag: 'Code',
        hook: 'Everyone wants “50% cheaper.” These are the six levers that actually do it.',
        blocks: [
          { type: 'list', title: 'The 6 levers', items: [
            '1. Cache — exact & semantic caches for repeated queries.',
            '2. Smaller model — route easy tasks to SLMs.',
            '3. Shorter context — retrieve less, summarize more.',
            '4. Max token caps — bound generation length.',
            '5. Batching — reuse system prompts, prompt templates.',
            '6. Output compression — structured, concise schemas.',
          ]},
          { type: 'code', title: 'A prompt cache in ~8 lines', lang: 'python', code: `from diskcache import Cache

cache = Cache("llm_cache")

def call(prompt, max_tokens=512):
    key = prompt.strip().lower()
    if key in cache:
        return cache[key]          # 0 tokens, 0 latency
    reply = llm(prompt, max_tokens=max_tokens)
    cache[key] = reply
    return reply` },
          { type: 'typical', title: 'The point people share', items: [
            'Measure cost per successful task, not per token.',
            'Caching alone often cuts 30–50% on support-style traffic.',
            'Right-sizing the model is the cheapest lever and the most skipped.',
          ]},
        ],
      },
      {
        title: 'Observability — tracing the agent’s decisions',
        tag: 'Code',
        hook: 'You can’t restart an agent. You have to be able to SEE it.',
        blocks: [
          { type: 'list', title: 'What to trace', items: [
            'Every prompt — system + user + retrieved chunks, at send time.',
            'Every tool call — args in, result/error out.',
            'Every decision — why did it choose this tool over that one?',
            'Every state change — memory writes, checkpoints.',
            'Cost per step — tokens in, tokens out.',
          ]},
          { type: 'code', title: 'A minimal trace hook', lang: 'python', code: `import time, json

def trace_step(name, fn, *args, **kwargs):
    t0 = time.time()
    try:
        result = fn(*args, **kwargs)
        level = "ok"
    except Exception as e:
        result, level = str(e), "error"
    log.append({
        "step": name,
        "args": json.dumps(args)[:500],
        "result": json.dumps(result)[:500],
        "level": level,
        "ms": round((time.time() - t0) * 1000),
    })
    return result` },
          { type: 'typical', title: 'The point people share', items: [
            'Use tracing tools (Langfuse, Helicone, Arize) — don’t build your own.',
            'Log prompts and tool I/O; you will be asked “why did it do that?”',
            'A trace is a reproducible bug report.',
          ]},
        ],
      },
      {
        title: 'Backend engineering → AI systems engineering',
        tag: 'Career',
        hook: 'The most honest career post: the AI engineer is the backend engineer who learned agents.',
        blocks: [
          { type: 'list', title: 'What transfers 1:1', items: [
            'APIs, queues, caching, retries — the whole backend toolbox.',
            'Auth, permissions, rate limiting — now applied to tools.',
            'Testing — unit tests become eval suites.',
            'Observability — tracing, logs, metrics, alerts.',
            'Reliability — fallbacks, timeouts, budgets.',
          ]},
          { type: 'list', title: 'What’s genuinely new', items: [
            'Prompt/config as versioned artifacts.',
            'Evaluating non-deterministic behavior.',
            'Token cost as a first-class metric.',
            'Prompt injection and jailbreak as security class.',
            'Human-in-the-loop as an architectural primitive.',
          ]},
          { type: 'typical', title: 'The point people share', items: [
            '“AI systems engineering” = backend engineering + probabilistic I/O.',
            'The backend folks have a 5-year head start on the pure-ML folks.',
            'Update your CV: rename “backend” to “AI systems,” keep the same bullets.',
          ]},
        ],
      },
      {
        title: 'FastAPI lessons from the trenches',
        tag: 'Code',
        hook: 'The FastAPI post everyone saved — because it’s the API layer under every agent.',
        blocks: [
          { type: 'list', title: 'The lessons', items: [
            'Pydantic schemas = your contract with the model’s structured output.',
            'Background tasks for long-running agent jobs, not sync endpoints.',
            'Rate limit + authenticate every endpoint — agents hit harder than browsers.',
            'Stream responses (StreamingResponse) for chat-like UX.',
            'Version your API; models and prompts evolve faster than clients.',
            'Use dependency injection for the LLM client — testable and swappable.',
          ]},
          { type: 'code', title: 'A typed agent endpoint', lang: 'python', code: `from fastapi import FastAPI, Depends
from pydantic import BaseModel

app = FastAPI()

class Query(BaseModel):
    text: str

def get_client():                 # DI: swap for tests
    return llm_client

@app.post("/answer")
def answer(q: Query, client=Depends(get_client)):
    return {"answer": rag(q.text, client), "trace": last_trace()}` },
          { type: 'typical', title: 'The point people share', items: [
            'FastAPI + Pydantic is the de facto agent API layer.',
            'Structured output from the model maps straight onto response models.',
            'Serving an agent is 80% the same as serving any API.',
          ]},
        ],
      },
    ],
  },
  {
    id: 'security',
    num: '10',
    icon: '🛡️',
    title: 'Security, Governance & Trust',
    tagline: 'Prompt injection, agentic governance, data governance',
    color: 'red',
    pages: [
      {
        title: 'Prompt injection — the #1 LLM risk',
        tag: 'Security',
        hook: 'The vulnerability class that doesn’t exist in normal software — and the one attackers love.',
        blocks: [
          { type: 'list', title: 'The attack family', items: [
            'Direct injection — user says “ignore previous instructions and…” in the prompt.',
            'Indirect injection — malicious text in a retrieved doc or web page steers the agent.',
            'Tool/action abuse — a prompt makes the agent call a dangerous tool (send email, transfer).',
            'Exfiltration — the agent is tricked into echoing secrets or PII into an attacker-controlled output.',
          ]},
          { type: 'list', title: 'Defense-in-depth', items: [
            'Separate trusted vs untrusted content (system > user > tool > retrieved).',
            'PII/secret masking before prompts are built.',
            'Least-privilege tool permissions; require approval for high-stakes actions.',
            'Output filtering for secrets and dangerous instructions.',
            'Eval your guardrails with attack suites, like a security regression test.',
          ]},
          { type: 'typical', title: 'The point people share', items: [
            'If a prompt can trigger an action, a prompt can trigger a harmful action.',
            'Treat retrieved docs as untrusted code — they’re the new attack surface.',
            'Injection tests belong in CI, exactly like XSS tests do.',
          ]},
        ],
      },
      {
        title: 'Agentic governance — the new enterprise layer',
        tag: 'Governance',
        hook: 'You don’t govern models. You govern the agents that touch your systems.',
        blocks: [
          { type: 'list', title: 'The 8 capabilities', items: [
            '1. Agent registry — inventory: who owns what agent, what it touches.',
            '2. Identity & access — every agent has an identity with scopes.',
            '3. Tool permissions — least privilege, allowlists, approval gates.',
            '4. Data boundaries — what data an agent may read/write/exfiltrate.',
            '5. Audit trail — every step logged for review and regulators.',
            '6. Cost governance — budgets and quotas per agent.',
            '7. Eval & risk gates — promote to prod only if evals pass.',
            '8. Human oversight — who can override, when, with what record.',
          ]},
          { type: 'quote', text: 'By 2026 the question isn’t “can we build the agent?” It’s “can we govern it well enough to let it touch production?”' },
          { type: 'typical', title: 'The point people share', items: [
            'Governance is the bottleneck now, not model quality.',
            'Start with registry + permissions; add the rest as the fleet grows.',
            '“Shadow AI” inside companies is already an access problem — agents are a bigger one.',
          ]},
        ],
      },
      {
        title: 'Data governance in 2026 — 12 components',
        tag: 'Governance',
        hook: 'The framework post that gets saved to every architecture doc.',
        blocks: [
          { type: 'list', title: 'The 12 components', items: [
            '1. Data catalog — what exists, where, who owns it.',
            '2. Lineage — how data flows and transforms.',
            '3. Quality — profiling, validation, monitoring.',
            '4. Access control — RBAC/ABAC per asset.',
            '5. Classification — sensitivity labels on data.',
            '6. Retention & deletion — lifecycle policies.',
            '7. Masking & anonymization — PII, synthetic data.',
            '8. Auditing — who accessed what, when.',
            '9. Cross-border rules — where data may reside/flow.',
            '10. Contract-first APIs — data agreements between systems.',
            '11. AI-readiness — is the data good enough for RAG/fine-tuning?',
            '12. Incident response — breach containment playbooks.',
          ]},
          { type: 'typical', title: 'The point people share', items: [
            'RAG made data governance an AI problem overnight: garbage in, confident garbage out.',
            'Start with classification + access control; the rest follows.',
            '“Your RAG quality is your data governance quality.”',
          ]},
        ],
      },
      {
        title: 'Building trust-first AI (the Fable5 pattern)',
        tag: 'Concepts',
        hook: 'Trust-centric AI: the architecture pattern behind trustworthy assistants.',
        blocks: [
          { type: 'para', text: 'The “trust-centric” posts describe a Claude/Fable5-era pattern: every answer carries evidence, uncertainty is surfaced, and the system is designed to be wrong gracefully. Trust isn’t a vibe — it’s a property you engineer.' },
          { type: 'list', title: 'The trust primitives', items: [
            'Citations — every claim maps to a retrievable source.',
            'Confidence signaling — “I’m confident / uncertain / I don’t know.”',
            'Refusal honesty — decline clearly instead of guessing.',
            'Checkable outputs — structured data that can be validated.',
            'Consistency — stable answers across repeated identical queries.',
            'Escalation — hand off to a human when stakes exceed confidence.',
          ]},
          { type: 'typical', title: 'The point people share', items: [
            'Users forgive a wrong answer with a source; they distrust a confident lie.',
            'Trust is the metric that compounds — it’s the actual moat.',
            'Design for the case where you’re wrong, not for the case where you’re right.',
          ]},
        ],
      },
    ],
  },
  {
    id: 'projects',
    num: '11',
    icon: '🧪',
    title: 'Projects & Multi-Projects',
    tagline: 'End-to-end builds you can learn from and copy',
    color: 'amber',
    pages: [
      {
        title: 'Project: a RAG knowledge assistant',
        tag: 'Projects',
        hook: 'The canonical first real AI project — a RAG assistant in ~30 lines.',
        blocks: [
          { type: 'code', title: 'rag_assistant.py — end to end', lang: 'python', code: `from sentence_transformers import SentenceTransformer
from openai import OpenAI
import numpy as np

model = SentenceTransformer("all-MiniLM-L6-v2")
docs = load_and_chunk("handbook.pdf")   # chunks with metadata

def retrieve(query, k=3):
    qv = model.encode([query])
    scores = model.encode(docs) @ qv.T
    return [docs[i] for i in np.argsort(scores, axis=0)[-k:][::-1, 0]]

def answer(query):
    ctx = "\n".join(retrieve(query))
    return client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "Answer only from context."},
            {"role": "user", "content": f"{ctx}\n\nQ: {query}"},
        ],
    ).choices[0].message.content` },
          { type: 'list', title: 'The upgrade path', items: [
            'V1: this script (embed locally, answer via API).',
            'V2: hybrid search + reranker.',
            'V3: citations in the answer + eval set.',
            'V4: memory + conversation, served via FastAPI.',
          ]},
          { type: 'typical', title: 'Why it’s the perfect starter project', items: [
            'Touches embeddings, retrieval, prompting, and eval in one repo.',
            'Shows you every bottleneck before you meet it in production.',
            'One project, four levels = a portfolio by itself.',
          ]},
        ],
      },
      {
        title: 'Project: DeepLearn AI — video → study material',
        tag: 'Projects',
        hook: 'The “vibe-coded” project that impressed everyone: turn any video into a structured course.',
        blocks: [
          { type: 'list', title: 'The pipeline', items: [
            'Ingest — download + transcribe the video (Whisper).',
            'Chunk — slide timestamps + transcript segments.',
            'Extract — titles, key points, formulas, code snippets.',
            'Generate — notes, flashcards, quiz questions.',
            'Structure — organize into modules + table of contents.',
            'Review — human pass, then publish.',
          ]},
          { type: 'list', title: 'Why it wins as a portfolio piece', items: [
            'Shows multimodal understanding (audio → text → structure).',
            'Every step is a reusable pattern (transcribe, chunk, extract).',
            'Demo-able: “upload any video, get a study guide.”',
            'Tests eval: do the flashcards match the content?',
          ]},
          { type: 'typical', title: 'The point people share', items: [
            'The project is 20% LLM and 80% pipeline glue — that’s the point.',
            '“Vibe-coded” means iterated fast with an agent; it still needs review.',
            'Solve your own pain; the passion shows in the demo.',
          ]},
        ],
      },
      {
        title: 'Project: fine-tuning a 7B medical LLM',
        tag: 'Projects',
        hook: 'The post that proved fine-tuning isn’t just for big labs — on a free GPU.',
        blocks: [
          { type: 'list', title: 'The recipe', items: [
            'Base model: a 7B open model (Llama-3.1-8B / Qwen).',
            'Method: LoRA — low-rank adapters, ~1% of weights train.',
            'Data: a medical QA dataset (public, licensed).',
            'Hardware: one free/consumer GPU (Colab T4 / 16GB).',
            'Runtime: a few hours, not weeks.',
            'Guardrail: medical use requires rigorous eval + disclaimer; never clinical advice.',
          ]},
          { type: 'code', title: 'LoRA fine-tune outline', lang: 'bash', code: `# LoRA fine-tune of a 7B model on a free GPU (Colab / T4)
pip install transformers peft trl datasets

python -m scripts.train \
  --model meta-llama/Llama-3.1-8B \
  --data medical_qa.jsonl \
  --method lora \
  --batch-size 1 \
  --epochs 2` },
          { type: 'typical', title: 'The point people share', items: [
            'Fine-tuning for BEHAVIOR (format, tone, structured output) — not for facts.',
            'RAG the facts, fine-tune the style. Both, usually.',
            'A 7B LoRA on your domain can beat the frontier at your task.',
          ]},
        ],
      },
      {
        title: 'Project: financial fraud detection with AI',
        tag: 'Projects',
        hook: 'The high-stakes use case that makes a great story — and a great interview.',
        blocks: [
          { type: 'list', title: 'The architecture', items: [
            'Streaming — transactions flow through a scoring pipeline.',
            'Classic model — a gradient-boosted/scoring model flags anomalies.',
            'Agent layer — investigates flagged transactions: pulls customer history, checks patterns.',
            'Narrative — drafts the SAR/explanation with evidence.',
            'HITL — suspicious = hold + human review; agent never blocks alone.',
            'Evals — measure false-positive rate, not just detection.',
          ]},
          { type: 'list', title: 'Why it’s a strong portfolio topic', items: [
            'Shows classic ML + agentic AI working together.',
            'Demonstrates responsible design (HITL, explainability).',
            'Rich data: transaction records, accounts, merchants.',
            'Realistic constraints: latency, cost, false positives.',
          ]},
          { type: 'typical', title: 'The point people share', items: [
            'Fraud teams care about false positives as much as false negatives.',
            'The agent’s job is triage + explanation, not judgment.',
            'Any “AI for finance” project needs an audit story.',
          ]},
        ],
      },
      {
        title: 'Project: enterprise agent platform on AWS',
        tag: 'Projects',
        hook: 'The reference architecture for teams of agents in the enterprise.',
        blocks: [
          { type: 'list', title: 'The building blocks', items: [
            'Orchestration — a stateful workflow engine for agents.',
            'Identity — each agent = an IAM-style identity with scopes.',
            'Knowledge — vector store + document pipeline.',
            'Tools — MCP servers behind an API gateway with auth.',
            'Governance — approval workflows for high-stakes actions.',
            'Observability — traces + metrics per agent run.',
            'Cost — budgets per agent, alerts on spend.',
          ]},
          { type: 'table', title: 'Pattern: one platform, many agents', headers: ['Agent', 'Tools it can use', 'Approval required'], rows: [
            ['Support agent', 'Docs, CRM, tickets (read/write)', 'No (write limited)'],
            ['Finance agent', 'Ledger, invoices (read)', 'Yes (any write)'],
            ['HR agent', 'HRIS, PTO system (read)', 'Yes (any change)'],
            ['Security agent', 'SIEM, alerts (read)', 'No (read-only)'],
          ]},
          { type: 'typical', title: 'The point people share', items: [
            'The platform is the product; the agents are tenants.',
            'Permission model first, agents second.',
            'Multi-agent = shared governance, not shared intelligence.',
          ]},
        ],
      },
      {
        title: 'Project: a Claude agent team + a scraping digest',
        tag: 'Projects',
        hook: 'Two small projects, one big lesson: package work as skills, chain agents.',
        blocks: [
          { type: 'code', title: '.claude/skills/qa-review/SKILL.md', lang: 'markdown', code: `# .claude/skills/qa-review/SKILL.md
---
name: qa-review
description: Review a PR against the repo test suite.
---

1. Run \`npm test\` and capture failures.
2. For each failure, read the failing test + source.
3. Patch the minimal fix, re-run until green.
4. Summarize what changed and why.` },
          { type: 'list', title: 'Then chain them into a digest', items: [
            'Skill A (scrape): pull post metrics for tracked creators.',
            'Skill B (summarize): condense into a ranked daily digest.',
            'Skill C (publish): push the digest to Slack/notion.',
            'Result: an agentic pipeline where each step is a reusable skill.',
          ]},
          { type: 'typical', title: 'The point people share', items: [
            'Skills make agents composable — build once, reuse everywhere.',
            'The same skill files work across Claude Code, cursor, and agents.',
            'You built “10 agents” but it’s really 3 skills in different orders — and that’s fine.',
          ]},
        ],
      },
    ],
  },
  {
    id: 'fluency',
    num: '12',
    icon: '🗺️',
    title: 'AI Fluency & Ecosystem',
    tagline: 'Analogies, vocab, living systems, and the search shifts',
    color: 'teal',
    pages: [
      {
        title: 'The human body of AI',
        tag: 'Concepts',
        hook: 'The analogy that makes the whole stack memorable in one post.',
        blocks: [
          { type: 'list', title: 'The anatomy', items: [
            '🧠 Brain — the LLM. Where thinking happens.',
            '👁️ Eyes/ears — multimodal input: vision, audio, sensors.',
            '📚 Memory — vector store + long-term knowledge.',
            '🙌 Hands — tools/MCP: what it acts with.',
            '🦴 Skeleton — orchestration/state machine: the structure holding it up.',
            '🩸 Blood — data flows and context streaming.',
            '🛡️ Immune system — guardrails, permissions, fail-safes.',
            '🧑‍⚕️ Doctor — human oversight: HITL gates.',
          ]},
          { type: 'para', text: 'The analogy persists because it’s true: an agent needs cognition, perception, memory, action, structure, and defense. Diagnose an agent like a patient — which system is failing?' },
          { type: 'typical', title: 'The point people share', items: [
            '“Is your agent hallucinating?” → brain problem or memory problem?',
            'Build all the organs, not just the brain.',
            'The anatomy map = the architecture diagram, in plain words.',
          ]},
        ],
      },
      {
        title: 'LLM → RAG → Agent → MCP — the layering',
        tag: 'Concepts',
        hook: 'The dependency stack everyone needs once: each layer builds on the last.',
        blocks: [
          { type: 'list', title: 'Layer by layer', items: [
            'LLM — the core model: language understanding + generation.',
            '+ RAG — adds grounded knowledge on top of the LLM.',
            '+ Agent — adds action, planning, and memory on top of RAG.',
            '+ MCP — standardizes how the agent reaches tools and data.',
            '+ Evals & guardrails — make the whole stack shippable.',
          ]},
          { type: 'para', text: 'The “X builds on Y” posts make the order explicit: you can’t skip RAG and go to agents, because agents that can’t ground will confidently invent. Each layer multiplies capability AND responsibility.' },
          { type: 'typical', title: 'The point people share', items: [
            'Recruiters say “LLM”; they mean “RAG + agents + evals.”',
            'Job postings and reality are a layer apart — know both.',
            'The stack diagram is the interview whiteboard.',
          ]},
        ],
      },
      {
        title: 'Every agentic app is a living system',
        tag: 'Concepts',
        hook: 'The 12-component checklist for what an agentic app REALLY contains.',
        blocks: [
          { type: 'list', title: 'The 12 components', items: [
            '1. Brain (model) — the decision-maker.',
            '2. Retrieval — where knowledge comes from.',
            '3. Tools — what it can operate.',
            '4. Memory — what it remembers between turns.',
            '5. Orchestration — who runs when.',
            '6. Guardrails — what it must never do.',
            '7. Observability — how you watch it.',
            '8. Cost controls — how it stays within budget.',
            '9. Fallbacks — what happens when it fails.',
            '10. Architecture — the hosting/deployment shape.',
            '11. UX — the interface humans actually use.',
            '12. Evals — the tests that keep it honest.',
          ]},
          { type: 'quote', text: 'If your “agentic app” is only component 1 plus a chat box, you have a demo. A living system needs the other 11.' },
          { type: 'typical', title: 'The point people share', items: [
            'Every missing component is a future incident.',
            'The checklist is also the roadmap: build 1–3, then add the rest.',
            '“A living system” sounds dramatic; it just means it reacts and adapts.',
          ]},
        ],
      },
      {
        title: 'SKILL.md — skills vs configs vs MCP',
        tag: 'Concepts',
        hook: 'The file format quietly becoming the standard for agent abilities.',
        blocks: [
          { type: 'code', title: 'SKILL.md — self-describing instructions', lang: 'markdown', code: `---
name: web-research
description: Search the web and return cited, structured findings.
metadata:
  version: 1.0.0
  tags: [research, citations]
---
Instructions the agent loads BEFORE acting:
- Always return sources per claim.
- Never invent URLs.
- Summarize in bullets, max 10.` },
          { type: 'list', title: 'Skills vs configs vs MCP', items: [
            'Config — global settings: model, temperature, permissions.',
            'Skills — task instructions loaded on demand (this file).',
            'MCP — the actual tool connections/capabilities.',
          ]},
          { type: 'typical', title: 'The point people share', items: [
            'Skills make instructions portable: same file, any agent.',
            'It’s the “dotfiles” of AI — versioned, reviewable, shareable.',
            'Your best agent work becomes a folder of SKILL.md files.',
          ]},
        ],
      },
      {
        title: 'API styles & the 50+ API ecosystem',
        tag: 'Concepts',
        hook: 'Agents are only as capable as the APIs they can call. Know the styles.',
        blocks: [
          { type: 'table', title: '6 API architecture styles', headers: ['Style', 'Pattern', 'Good for'], rows: [
            ['REST', 'Resources + verbs (GET/POST)', 'CRUD, public APIs'],
            ['GraphQL', 'Single endpoint, client-driven queries', 'Flexible frontends, batching'],
            ['gRPC', 'Typed, binary, streaming', 'Internal microservices'],
            ['WebSocket', 'Persistent two-way', 'Real-time chat/events'],
            ['Webhooks', 'Push events on change', 'Notifications, integrations'],
            ['MCP', 'Model-native tool contract', 'Agent tool connectivity'],
          ]},
          { type: 'list', title: 'Why 50+ APIs across 10 categories', items: [
            'Categories: messaging, payments, search, docs, CRM, storage, identity, AI, maps, analytics.',
            'For agents: every API = a potential tool; every auth scheme = a potential permission.',
            'MCP servers wrap existing APIs so agents call them uniformly.',
          ]},
          { type: 'typical', title: 'The point people share', items: [
            'Agents turned the API economy into the tool economy.',
            'Learn to read any API’s docs fast — it’s the agent builder’s core skill.',
            'The next MCP server you write is an API you already love.',
          ]},
        ],
      },
      {
        title: 'SEO vs AEO vs GEO',
        tag: 'Concepts',
        hook: 'Search is being disrupted by answers. The new optimization targets.',
        blocks: [
          { type: 'table', title: 'The three optimizations', headers: ['Optimization', 'Target', 'Goal'], rows: [
            ['SEO', 'Search engines', 'Rank in the list of blue links'],
            ['AEO (Answer Engine Opt.)', 'AI answer engines', 'Get cited in the AI’s answer'],
            ['GEO (Generative Engine Opt.)', 'GenAI search (Perplexity, Gemini, ChatGPT)', 'Appear as a source in generated answers'],
          ]},
          { type: 'list', title: 'The shared playbook', items: [
            'Structure content for extraction: headers, lists, tables, FAQs.',
            'Publish answers to “people also ask” style questions directly.',
            'Use clean schemas and authoritative sources so models trust you.',
            'Track “citation share,” not just clicks.',
          ]},
          { type: 'typical', title: 'The point people share', items: [
            '“Click-through” is dying; “cited-in-the-answer” is the new traffic.',
            'AI answers only get better if their sources are scannable — so be scannable.',
            'AEO/GEO is just SEO for machines that read like humans.',
          ]},
        ],
      },
    ],
  },
  {
    id: 'enterprise',
    num: '13',
    icon: '🏗️',
    title: 'Enterprise AI Architecture',
    tagline: 'The 5-layer stack, the AI hierarchy, evolution, and local AI',
    color: 'blue',
    pages: [
      {
        title: 'The 5-layer enterprise AI architecture',
        tag: 'Concepts',
        hook: 'Agentic AI is not a model. It’s an architecture. The biggest misconception in enterprise AI is stopping at layer 1.',
        blocks: [
          { type: 'para', text: 'The most-shared enterprise-AI post: a foundation model alone has no knowledge of your business, no memory, and no ability to act. The most successful implementations invest in layers 2–5.' },
          { type: 'list', title: 'The 5 layers', items: [
            '1. Foundation Model — the reasoning engine (GPT, Claude, Gemini, Llama). Generates responses but knows nothing about your business and can’t act.',
            '2. RAG (Knowledge layer) — gives access to enterprise knowledge: policies, SOPs, product docs, contracts. Without RAG the agent knows the world; with RAG it knows your business.',
            '3. Memory layer — remembers context across interactions: user preferences, conversations, long-running tasks, historical decisions. Without it, every conversation starts from zero.',
            '4. Tool layer (MCP) — lets the agent touch enterprise systems: CRM, ERP, ticketing, databases, internal APIs. This is where AI moves from answering to getting work done.',
            '5. Agent Orchestration layer — the brain that plans, reasons, delegates, executes: task decomposition, multi-step reasoning, tool selection, workflow execution, human approvals. Turns a chatbot into a digital worker.',
          ]},
          { type: 'quote', text: 'Many organizations stop at Layer 1. The most successful invest in Layers 2–5. Agentic AI is not a model — it’s an architecture.' },
          { type: 'typical', title: 'The point people share', items: [
            'The question “what’s your biggest gap — knowledge, memory, tools, or orchestration?” reliably drives comments.',
            'Don’t build the top floor of a skyscraper before pouring the foundation: clean docs, reliable APIs, centralized knowledge first.',
            'Layer 1 is the model everyone demos; layers 2–5 are the actual product.',
          ]},
        ],
      },
      {
        title: 'AI → ML → DL → GenAI → LLM → RAG → Agentic AI',
        tag: 'Concepts',
        hook: 'AI is not one thing — it’s a stack. Leaders make better decisions when they know which layer they’re talking about.',
        blocks: [
          { type: 'para', text: 'The confusion post everyone saves: one word for seven different layers. Each layer constrains the one above it, each changes the leadership question.' },
          { type: 'list', title: 'The sequence', items: [
            'AI — the broad field: systems that reason, learn, decide, act. Expert systems, robotics, game AI, autonomous agents.',
            'Machine Learning — learns patterns from data instead of fixed rules: spam detection, recommendations, fraud, segmentation, predictive analytics.',
            'Deep Learning — multi-layer neural nets for harder patterns: vision, speech, self-driving, medical imaging, translation.',
            'Generative AI — creates new text, images, audio, video, code: ChatGPT, Claude, Midjourney, DALL-E, Stable Diffusion.',
            'LLMs — a specific kind of GenAI for language: GPT-4/5, Claude 3, Gemini, Llama 3, Mistral, Qwen.',
            'RAG — connects an LLM to external knowledge: enterprise chatbots, copilots, document Q&A, knowledge assistants.',
            'Agentic AI — adds action: systems that plan, use tools, and complete multi-step work autonomously.',
          ]},
          { type: 'table', title: 'Which layer for which job', headers: ['Goal', 'Use'], rows: [
            ['Classify something', 'ML / Deep Learning'],
            ['Generate content', 'GenAI'],
            ['Understand language', 'LLMs'],
            ['Ground answers in trusted knowledge', 'RAG'],
            ['Reason, plan, and execute across tools', 'Agentic AI'],
          ]},
          { type: 'typical', title: 'The point people share', items: [
            'Different layers = different architectures, risks, budgets, and success metrics.',
            'The future isn’t better prompts — it’s better matching between problem, model, data, retrieval, and action.',
            'Ask “which layer are we building with?” before “which model should we use?”',
          ]},
        ],
      },
      {
        title: 'The evolution of agentic AI — 7 layers',
        tag: 'History',
        hook: 'Most enterprises skip the foundation: they want the top floor of a skyscraper before pouring concrete.',
        blocks: [
          { type: 'para', text: 'Agentic AI exploded in layers for a reason — each layer solved a limitation of the previous. Understanding the order is the difference between a demo and a durable system.' },
          { type: 'list', title: 'The 7 layers', items: [
            '1. Script Bots — rule-based automation, fixed workflows, no intelligence or reasoning.',
            '2. LLMs — natural language understanding, human-like reasoning, but limited without external knowledge or actions.',
            '3. LLMs + Tools — APIs, databases, browsers, search engines. AI became operational; for many businesses this layer is already enough.',
            '4. RAG — the enterprise breakthrough: internal docs, company knowledge, vector DBs, business data. Powers internal search and support assistants.',
            '5. Agentic Memory — short-term (conversation context, active tasks) + long-term (preferences, history, semantic & procedural memory).',
            '6. MCP — a standardized way for agents to securely connect to enterprise tools, eliminating countless custom integrations.',
            '7. A2A — specialized agents collaborate: planner, researcher, executor, reviewer. Powerful only when the foundation is ready.',
          ]},
          { type: 'quote', text: 'The smartest AI architecture isn’t always the most complex. Sometimes the highest ROI is a well-designed workflow + a capable LLM + quality retrieval + the right tools.' },
          { type: 'typical', title: 'The point people share', items: [
            'Build the fundamentals first; scale to agentic AI when the org is ready.',
            'The future belongs to those building the right architecture, not the most agents.',
            'The biggest mistake: wanting multi-agent before clean docs, reliable APIs, centralized knowledge, observability, and governance.',
          ]},
        ],
      },
      {
        title: 'The AI stack — 7 layers of the ecosystem',
        tag: 'Concepts',
        hook: 'AI isn’t one tool — it’s an ecosystem. Most people talk about AI but very few understand the system behind it.',
        blocks: [
          { type: 'list', title: 'The 7 layers', items: [
            '1. LLMs (thinking) — GPT, Claude, Gemini, Mistral. Understand language, generate ideas. Still need structure around them.',
            '2. Frameworks (wiring) — LangChain, LlamaIndex, Haystack. Connect the model to tools, data, memory, workflows. Turns a model into a system.',
            '3. Vector Databases (memory) — Pinecone, Weaviate, Chroma. Store meaning, not just text, so AI retrieves with context.',
            '4. Data Extraction (input) — FireCrawl, Crawl4AI, Docling. Pull messy sources into clean data your model can use.',
            '5. Open LLM Runtimes (control) — Hugging Face, Ollama, Groq. Run models locally, privately, or at high speed. Less lock-in.',
            '6. Embeddings (meaning) — OpenAI, SBERT, Voyage, Cohere. Turn text into vectors so AI can compare ideas and understand relationships.',
            '7. Evaluation (quality check) — Giskard, Ragas, TruLens. You don’t know if a system works until you measure accuracy, reasoning, reliability.',
          ]},
          { type: 'list', title: 'A simple playbook for leaders', items: [
            'Step 1 — learn what each layer does (no coding needed).',
            'Step 2 — start with a workflow, not a tool: pick one bottleneck, map the layers that solve it.',
            'Step 3 — build small, working systems first: one model + one framework + one memory layer is enough.',
            'Step 4 — evaluate early: don’t trust output you can’t measure.',
            'Step 5 — scale what works: once stable, automate and expand.',
          ]},
          { type: 'typical', title: 'The point people share', items: [
            'Understanding the stack gives leverage, not overwhelm.',
            'Most teams pick a tool before mapping the layer — that’s the mistake.',
            'AI is an ecosystem: the stack diagram is also a career map.',
          ]},
        ],
      },
      {
        title: 'Local AI & the new infrastructure question',
        tag: 'Concepts',
        hook: 'The key architecture question is no longer “which model API?” — it’s “where should this intelligence run?”',
        blocks: [
          { type: 'para', text: 'For two years most apps followed one pattern: User → App → Cloud API → Response. Now it’s shifting to: User → Device → Local model → Cloud model when needed → Tools/Response. Not every task needs a frontier model.' },
          { type: 'list', title: 'Why local AI matters', items: [
            'Speed — some tasks need low latency, not a cloud round-trip.',
            'Privacy — HIPAA, finance, legal data must stay close to the user.',
            'Offline — some tasks need to work without connectivity.',
            'Cost — at high volume, fixed GPU cost beats per-token pricing. The crossover is ~3–5M tokens/month.',
            'Control — in-house deployment for data sovereignty and audit.',
          ]},
          { type: 'table', title: 'Deployment decision', headers: ['Deployment', 'Best for', 'Tradeoff'], rows: [
            ['Local / Edge', 'Privacy-sensitive, low-latency, offline, personal productivity', 'Smaller models'],
            ['Cloud API', 'Large-scale reasoning, heavy workloads, centralized governance', 'Data leaves your boundary'],
            ['Hybrid', 'Most real-world systems', 'Routing complexity'],
          ]},
          { type: 'typical', title: 'The point people share', items: [
            'Model selection is no longer enough — model placement is now a core architecture decision.',
            'The winning systems combine small local models + edge models + enterprise RAG + cloud frontier + governed tools + human approval + observability.',
            'The next wave of AI engineering is routing the right task to the right model in the right place.',
          ]},
        ],
      },
    ],
  },
  {
    id: 'blocks',
    num: '14',
    icon: '🧱',
    title: 'Agent Building Blocks',
    tagline: 'Tool calling, planning, reflection, multi-agent, vocabulary & project structure',
    color: 'purple',
    pages: [
      {
        title: 'The building blocks — it’s not just an LLM',
        tag: 'Concepts',
        hook: 'Remove tool calling, memory, planning, and reflection — what’s left? Just an LLM. That’s the part many people miss about agents.',
        blocks: [
          { type: 'para', text: 'People think agents are a new model, framework, or technology. They’re not. An agent is an LLM surrounded by components that help it think, act, and improve. Understanding the architecture matters more than learning the frameworks.' },
          { type: 'list', title: 'The building blocks', items: [
            'Tool Calling — access to the outside world: search, databases, APIs, code execution. Without tools, agents only generate text.',
            'Function Calling — turns model outputs into structured actions your application can execute reliably.',
            'Planner — breaks large goals into smaller tasks: Research → Analyze → Execute → Review.',
            'Reflection — the agent critiques its own work before delivering the final answer.',
            'Memory — stores information across steps and sessions. Without memory, every interaction starts from zero.',
            'Multi-Agent Systems — specialized agents collaborate: one researches, one writes, one reviews.',
            'ReAct Loop — the pattern behind most modern agents: Think → Act → Observe → Repeat.',
          ]},
          { type: 'para', text: 'Production agents rarely use just one of these. A support agent might use tool calling + memory + ReAct + reflection. A research assistant might use planner + multi-agent + memory + tool calling. The architecture changes with the problem — not the framework.' },
          { type: 'typical', title: 'The point people share', items: [
            'Companies no longer ask “what is an agent?” They ask “when would you use memory? when do you need a planner? why multi-agent?”',
            'Frameworks change; architectures evolve; these building blocks remain.',
            'Learn the components first — the frameworks become easy.',
          ]},
        ],
      },
      {
        title: 'The anatomy of an AI agent',
        tag: 'Concepts',
        hook: 'Beyond the demos is an invisible anatomy — a carefully orchestrated system that thinks, acts, and evolves.',
        blocks: [
          { type: 'list', title: 'The 8 components', items: [
            'Sensors (Perception) — how AI sees the world: cameras, APIs, raw data. Without perception, decisions are blind.',
            'Internal State / Memory — the “mind”: stores knowledge, context, experiences; enables continuity beyond single interactions.',
            'Decision-Making / Reasoning — the brain: algorithms analyze data, weigh options, select goal-aligned actions.',
            'Actuators (Action) — convert decisions into outcomes: commands, processes, human interaction. Thoughts without action are meaningless.',
            'Goal / Objective Module — every agent needs a purpose directing perception and action toward measurable outcomes.',
            'Learning Component (optional) — ML lets some agents adapt and improve with experience over time.',
            'Communication Module (optional) — agents exchange info with humans or other agents for complex objectives.',
            'Evaluation / Monitoring (optional) — feedback loops ensure alignment and catch mistakes before they escalate.',
          ]},
          { type: 'quote', text: 'The LLM is the brain. But brains don’t build billion-dollar companies. Systems do. That’s the difference between a demo that works once and a product serving millions daily.' },
          { type: 'typical', title: 'The point people share', items: [
            'A production system is far bigger than the model: memory, context engineering, tool calling, RAG, planning, orchestration, guardrails, caching, observability, security, monitoring, human review.',
            'The next-gen AI engineer is judged by the systems they design, not the prompts they write.',
            'Every missing component is a future incident waiting to happen.',
          ]},
        ],
      },
      {
        title: 'The agent vocabulary — 20 terms your team needs',
        tag: 'Concepts',
        hook: 'Agentic AI has a vocabulary problem. Ask 5 people what “agent” means and you get 5 answers — a problem when the agent can touch data, tools, and customers.',
        blocks: [
          { type: 'list', title: 'Core building blocks', items: [
            'MCP — Model Context Protocol connects agents to tools, systems, and data.',
            'A2A — Agent-to-Agent protocol lets one agent coordinate work with another.',
            'Agent Loop — the basic cycle: perceive, plan, act, observe, repeat.',
            'Tool Use — when an agent calls functions, APIs, apps, or internal systems.',
            'Orchestrator — the layer that splits a goal across tools, agents, and humans.',
          ]},
          { type: 'list', title: 'System design terms', items: [
            'Multi-Agent System — several agents with roles, routing, and shared goals.',
            'Memory — short-term context + long-term reusable knowledge.',
            'RAG — retrieval-augmented generation: pull external knowledge before answering.',
            'Grounding — tying outputs to trusted data so hallucinations are easier to catch.',
            'Context Engineering — designing exactly what the agent sees before it acts.',
          ]},
          { type: 'list', title: 'Control, risk & production terms', items: [
            'Guardrails — hard boundaries stopping risky actions or unsafe outputs.',
            'Policy Layer — rules, permissions, approvals governing how agents operate.',
            'Sandboxing — safe test space before agents touch customers, payments, or live systems.',
            'Human-in-the-Loop — critical actions pause for a person to review, approve, reject.',
            'Handoffs — clean transitions between agents, tools, teams, and human owners.',
            'Agent Observability — traces, logs, monitoring of what the agent actually did.',
            'Agentic Pipeline — the structured path: input → reasoning → action → output.',
            'Evaluations — tests measuring whether an agent is accurate, reliable, and ready.',
            'Agent Identity — which agent acted, under which role, with which permissions.',
            'Agent Protocols — shared standards helping agent systems work together at scale.',
          ]},
          { type: 'typical', title: 'The point people share', items: [
            'Bad vocabulary is only the first risk; the bigger one is teams building systems nobody can explain.',
            'Start with shared language. Then build the agent. Then test it.',
            'Most agent debates are two people using “agent” to mean different things.',
          ]},
        ],
      },
      {
        title: 'Multi-agent orchestration — 4 patterns',
        tag: 'Concepts',
        hook: 'Multi-agent systems are not one architecture — they’re a design choice. Orchestration defines intelligence, failure behavior, and scale ceiling.',
        blocks: [
          { type: 'list', title: 'The 4 coordination patterns', items: [
            'Hierarchical — top-down control with planner and executors; clear task decomposition and supervision; predictable but bottlenecks at the orchestrator (single point of failure).',
            'Peer-to-Peer Mesh — agents interact directly without central control; fast context sharing; flexible but harder to govern; fault containment depends on local design.',
            'Swarm — no explicit coordination layer; simple agents follow local rules; emergent global behavior from interactions; strong resilience, weak predictability.',
            'Supervisor — central orchestrator assigns, monitors, and aggregates; strong visibility and control; efficient for structured pipelines; limited adaptability under dynamic conditions.',
          ]},
          { type: 'table', title: 'Control vs autonomy', headers: ['Pattern', 'Control', 'Autonomy', 'Watch out'], rows: [
            ['Hierarchical', 'High', 'Low', 'Orchestrator bottleneck'],
            ['Peer-to-Peer Mesh', 'Low', 'High', 'Hard to govern'],
            ['Swarm', 'None', 'Highest', 'Unpredictable results'],
            ['Supervisor', 'High', 'Medium', 'Diminished adaptability'],
          ]},
          { type: 'typical', title: 'The point people share', items: [
            'The trade-off isn’t better or worse — it’s control vs autonomy, predictability vs emergence.',
            'Most failures in multi-agent systems are coordination design failures, not model failures.',
            'Pick the pattern by the problem: structured pipelines → supervisor; open exploration → swarm.',
          ]},
        ],
      },
      {
        title: 'Chain vs Agent — the interview follow-up',
        tag: 'Career',
        hook: 'Almost nobody answers the follow-up correctly: “How is an agent different from a chain?”',
        blocks: [
          { type: 'para', text: 'An agent is an LLM that can take actions — call tools, run code, search, query databases — and use the results to decide what to do next, in a loop: think → act → observe → think again. A chain is a fixed sequence: Input → Step 1 → Step 2 → Output. Predetermined, no decisions, no loops, no tool use.' },
          { type: 'table', title: 'Chain vs agent', headers: ['Dimension', 'Chain', 'Agent'], rows: [
            ['Who decides the flow', 'Developer, at build time', 'The LLM, at runtime'],
            ['Autonomy', 'None — fixed pipeline', 'Dynamic, based on observations'],
            ['Speed & reliability', 'Fast, predictable', 'Slower, needs constraints'],
            ['Best for', 'Well-defined steps', 'Dynamic tool selection, multi-step reasoning'],
          ]},
          { type: 'list', title: 'When to use which', items: [
            'Chain — the task is well-defined, steps are known, reliability beats flexibility.',
            'Agent — the task needs dynamic tool selection, multi-step reasoning, or responds to unpredictable inputs.',
          ]},
          { type: 'typical', title: 'The point people share', items: [
            'The main production risk of agents is unbounded execution: a loop can call tools indefinitely.',
            'Production agents need: max iterations, a tool-call budget, a timeout per step, and a fallback exit condition.',
            'Without constraints, an agent loops forever — or until your API bill stops it.',
          ]},
        ],
      },
      {
        title: 'The complete AI agent project structure',
        tag: 'Projects',
        hook: 'A capable agent still needs a clean codebase. Without clear separation, even a promising prototype becomes hard to debug, secure, and scale.',
        blocks: [
          { type: 'list', title: 'The project layout', items: [
            'README.md — project purpose, setup, usage, architecture, examples.',
            'requirements.txt — Python libraries and dependencies required to run.',
            '.env & .gitignore — secrets stay secure; logs and local files stay out of version control.',
            'agent/ — core agent loop, state management, memory, planning, execution logic.',
            'tools/ — capabilities: search, calculations, weather, APIs, databases, external actions.',
            'models/ — LLM clients, embedding models, provider settings, model configurations.',
            'prompts/ — system instructions and prompt templates separate from application logic.',
            'utils/ — reusable helpers, configuration loaders, parsers, logging utilities.',
            'api/ — expose the agent through routes and schemas using FastAPI or Flask.',
            'tests/ — validate agent behavior, tools, integrations, APIs, and failure scenarios.',
            'data/ & logs/ — evaluation datasets, knowledge sources, examples, traces, debug records.',
            'main.py — entry point: CLI, API server, or playground.',
          ]},
          { type: 'typical', title: 'The point people share', items: [
            'Good architecture doesn’t make the agent smarter — it makes the system easier to understand, test, extend, monitor, and operate.',
            'Separation of reasoning, tools, models, prompts, memory, APIs, and tests is what separates a prototype from a product.',
            'The folder structure IS the architecture diagram.',
          ]},
        ],
      },
    ],
  },
  {
    id: 'comm',
    num: '15',
    icon: '🔌',
    title: 'MCP & Agent Communication',
    tagline: 'MCP vs APIs, protocol landscape, and the agent-era backbone',
    color: 'teal',
    pages: [
      {
        title: 'MCP vs Traditional APIs — the 7 differences',
        tag: 'Concepts',
        hook: 'APIs connect applications. MCP connects intelligence to action. Agents don’t just request info — they reason, plan, and execute.',
        blocks: [
          { type: 'para', text: 'For decades, APIs have been the foundation of modern software. But AI agents are fundamentally different: they reason, plan, select tools, execute workflows, and interact with multiple systems. That’s why MCP is becoming one of the most important developments in the agentic AI ecosystem.' },
          { type: 'table', title: 'The 7 differences', headers: ['Dimension', 'Traditional APIs', 'MCP'], rows: [
            ['Communication', 'Request-response over HTTP', 'Richer, bidirectional model-to-resource'],
            ['Purpose', 'Built for web & mobile applications', 'Built for agents, copilots, IDEs, intelligent systems'],
            ['Context', 'Predefined responses', 'Retrieves context from DBs, docs, file systems, enterprise apps'],
            ['Flexibility', 'Fixed workflows', 'Discovers capabilities, selects tools, adapts the execution path'],
            ['Tool access', 'Exposes endpoints', 'Exposes capabilities AI can understand and use autonomously'],
            ['Architecture', 'Custom connectors + orchestration', 'A standardized protocol layer designed for AI interactions'],
            ['Business impact', 'Transformed application development', 'Accelerating agents, copilots, autonomous workflows'],
          ]},
          { type: 'quote', text: 'If APIs were the backbone of the application era, MCP is emerging as the foundational layer of the agent era. The future of AI isn’t just about generating answers — it’s about getting work done.' },
          { type: 'typical', title: 'The point people share', items: [
            'MCP as “USB-C for AI” is the wrong frame: it’s a contract, not a cable — a waiter, not a port.',
            'Success beyond chatbots depends on how effectively AI accesses context, uses tools, and operates across systems.',
            'The organizations building MCP-first architectures are building for interoperability from day one.',
          ]},
        ],
      },
      {
        title: 'Agent communication protocols',
        tag: 'Concepts',
        hook: 'A demo agent needs a prompt. A production agent needs a communication architecture — and that’s the part most agentic discussions skip.',
        blocks: [
          { type: 'para', text: 'Once an agent moves beyond a demo it has to talk to real systems: APIs, tools, files, databases, events, queues, other agents, legacy platforms. That’s where architecture starts to matter most.' },
          { type: 'list', title: 'The protocol map', items: [
            'A2A — agents collaborate, delegate, and hand off work to each other.',
            'MCP — agents connect with tools, files, APIs, and enterprise data via a standard wire.',
            'GraphQL — agents fetch exactly the data they need from a single endpoint.',
            'REST — still the default language of most business APIs.',
            'gRPC — speed, typed contracts, and low-latency service-to-service communication.',
            'WebSocket — real-time, bidirectional communication for live interactions.',
            'Webhooks — event-driven automation where changes push notifications.',
            'SOAP — still exists because enterprise systems don’t disappear overnight.',
            'MQTT — IoT, edge, and lightweight pub-sub messaging for constrained devices.',
            'AMQP — when reliability, routing, and async delivery are critical at scale.',
          ]},
          { type: 'typical', title: 'The point people share', items: [
            'Agentic AI is not only about reasoning — it’s about communication.',
            'A weak communication layer makes the agent feel fragile; a strong one lets it operate inside real business systems.',
            'The better your communication architecture, the more reliable your AI system becomes.',
          ]},
        ],
      },
    ],
  },
  {
    id: 'frameworks',
    num: '16',
    icon: '🔧',
    title: 'Frameworks Compared',
    tagline: 'LangChain, LangGraph, and the 2026 agent framework decision guide',
    color: 'amber',
    pages: [
      {
        title: 'LangChain in simple words',
        tag: 'Concepts',
        hook: 'LangChain is the bridge between LLMs and real-world applications. LLM = brain. LangChain = nervous system connecting it to the world.',
        blocks: [
          { type: 'list', title: 'What it does', items: [
            'Combines LLMs with memory, tools, and data.',
            'Enables multi-step workflows and agentic reasoning.',
            'Powers use cases like RAG, chatbots, and AI assistants.',
          ]},
          { type: 'para', text: 'Building an AI application involves much more than calling an LLM API. LangChain connects the model with external tools, data sources, and workflows — transforming a standalone LLM into a complete application.' },
          { type: 'list', title: 'Key components', items: [
            'Prompts · LLMs · Chains · Retrievers · Memory · Tools & Agents.',
            'Common applications: chatbots with memory, document Q&A, AI agents, data analysis with natural language, workflow automation.',
          ]},
          { type: 'typical', title: 'The point people share', items: [
            'A standalone LLM can generate responses, but real-world apps need memory, external knowledge, multi-step reasoning, and API integrations.',
            'Frameworks like LangChain make it easier to build, orchestrate, and deploy intelligent workflows.',
            'Learn the architecture behind LangChain, not just the components — the architecture stays when frameworks change.',
          ]},
        ],
      },
      {
        title: 'The LangChain → RAG pipeline (what actually travels)',
        tag: 'Concepts',
        hook: 'Interviewers get vague when asked how a query actually travels through a RAG application. That’s the problem.',
        blocks: [
          { type: 'para', text: 'A production AI application is not Prompt → LLM → Done. It’s a pipeline where every component exists for a reason — and a single bad link sinks the whole answer.' },
          { type: 'list', title: 'The actual pipeline', items: [
            'Document Loader → Text Splitter → Embeddings → Vector Store → Retriever → Prompt → Model → Output Parser → Memory → Monitoring.',
            'Bad chunking? Retrieval quality drops.',
            'Wrong embedding model? Relevant documents disappear.',
            'No memory? Your chatbot forgets everything.',
            'No observability? Good luck debugging production issues.',
          ]},
          { type: 'list', title: 'The RAG workflow', items: [
            'Documents → Embeddings → Vector Database → Relevant Context Retrieval → LLM → Accurate Answer.',
            'Common applications: AI chatbots with memory, document Q&A (PDFs, research papers), AI agents and assistants, data analysis, workflow automation.',
          ]},
          { type: 'typical', title: 'The point people share', items: [
            'Once you understand retrieval, context management, tool calling, state management, and agent workflows, you can build with any framework.',
            'Frameworks change. Architecture stays. The LangChain carousel is one of the best visual breakdowns of how components fit together.',
            'The biggest advantage of learning LangChain isn’t the framework — it’s learning the architecture of modern AI applications.',
          ]},
        ],
      },
      {
        title: 'LangChain vs LangGraph',
        tag: 'Concepts',
        hook: 'LangGraph is not a replacement for LangChain — it’s an evolution built on top of it.',
        blocks: [
          { type: 'table', title: 'Choosing the right framework', headers: ['Framework', 'Great for', 'When you need'], rows: [
            ['LangChain', 'Sequential workflows, simple RAG, content generation, traditional chatbots', 'Speed + a huge ecosystem'],
            ['LangGraph', 'Complex graph-based workflows, persistent state, human-in-the-loop, multi-agent, branching logic', 'Stateful, dynamic decision-making'],
          ]},
          { type: 'para', text: 'As AI apps evolve beyond simple chatbots, the architecture behind them matters more. LangChain handles the straight line; LangGraph handles the graph — with state management, checkpointing, human approval loops, and durable execution.' },
          { type: 'typical', title: 'The point people share', items: [
            'Prototype in LangChain; ship complex control flow in LangGraph.',
            'The question isn’t “which one?” — it’s “what loop do I need?”',
            'LangGraph adds state, checkpoints, and human approval loops to the LangChain ecosystem.',
          ]},
        ],
      },
      {
        title: '6 agent frameworks — the 2026 decision',
        tag: 'Concepts',
        hook: 'Every developer asks the same question: “Which agent framework should I learn?” The truth is they solve different problems.',
        blocks: [
          { type: 'list', title: 'The honest comparison', items: [
            '1. LangGraph — best for production workflows: state management, checkpointing, human approval loops, durable execution. Steeper curve, ideal for enterprise pipelines.',
            '2. CrewAI — best for fast multi-agent prototypes: researcher/writer/reviewer teams. High token usage, messy debugging. Great for hackathons and MVPs.',
            '3. PydanticAI — best for backend engineers: type safety, structured outputs, validation, FastAPI integration. No built-in orchestration. Great for APIs and extraction.',
            '4. OpenAI Agents SDK — best for OpenAI ecosystems: agents, tools, handoffs, guardrails. Smaller ecosystem but great for tool calling and moderate complexity.',
            '5. Smolagents — best for open source: writes Python instead of JSON tool calls, lightweight and flexible — but needs sandboxing and security care.',
            '6. Google ADK — best for GCP teams: built-in evals, orchestration, Vertex AI integration; Gemini-first ecosystem.',
          ]},
          { type: 'list', title: 'The decision framework', items: [
            'Single agent? → PydanticAI.',
            'Complex workflow? → LangGraph.',
            'Prototype by Friday? → CrewAI.',
            'OpenAI stack? → OpenAI SDK.',
            'Open-source experiment? → Smolagents.',
            'Google Cloud? → Google ADK.',
          ]},
          { type: 'typical', title: 'The point people share', items: [
            'Framework choice matters less than prompt design, tool design, retrieval quality, observability, and evaluation.',
            'The 2026 production stack: PydanticAI for single agents, LangGraph for complex workflows, everything else situational.',
            'A great architecture beats a trendy framework every time.',
          ]},
        ],
      },
    ],
  },
  {
    id: 'knowledge',
    num: '17',
    icon: '🧩',
    title: 'Data & Knowledge Architecture',
    tagline: 'KAG, CAG, taxonomies, ontologies, and 11 data patterns',
    color: 'green',
    pages: [
      {
        title: 'RAG vs KAG vs CAG',
        tag: 'Concepts',
        hook: 'Beyond RAG: KAG and CAG. RAG fetches what it needs, KAG understands what it knows, CAG reuses what it has.',
        blocks: [
          { type: 'list', title: 'The three architectures', items: [
            'RAG (Retrieval-Augmented Generation) — retrieves relevant info from external sources before generating a response.',
            'KAG (Knowledge-Augmented Generation) — uses structured knowledge graphs and relationships for deeper reasoning, better context, and higher accuracy.',
            'CAG (Cache-Augmented Generation) — reuses cached context and previously processed responses to reduce latency, improve efficiency, and lower operational costs.',
          ]},
          { type: 'quote', text: 'RAG fetches what it needs. KAG understands what it knows. CAG reuses what it has.' },
          { type: 'typical', title: 'The point people share', items: [
            'Production-scale GenAI is no longer just prompts and RAG — it’s intelligent, scalable, efficient knowledge systems.',
            'KAG is where knowledge graphs meet retrieval; CAG is where caching meets generation.',
            'Understanding these architectures is now essential for AI/ML engineers and GenAI developers building at scale.',
          ]},
        ],
      },
      {
        title: 'Taxonomy vs Ontology vs Semantic Mapping vs Knowledge Graph',
        tag: 'Concepts',
        hook: 'Four terms get mixed up constantly — but they solve different problems. A knowledge graph without the other three is just another messy data layer.',
        blocks: [
          { type: 'list', title: 'One-liner definitions', items: [
            'Taxonomy — organize the information: Product > Electronics > Laptop > Ultrabook. For classification, navigation, reporting, standardization.',
            'Ontology — define the meaning: Customer places an Order; Order contains Product; Product belongs to Category. Where business meaning becomes explicit.',
            'Semantic Mapping — align different systems: CRM says Customer, ERP says Client, Support says Account. Connects disparate terms to a common business meaning.',
            'Knowledge Graph — activate connected knowledge: Customer → placed → Order → contains → Product → belongs to → Category. AI can traverse relationships, not isolated records.',
          ]},
          { type: 'para', text: 'The important part: a knowledge graph is not just a graph database. Without proper taxonomy, ontology, and semantic mapping, it becomes another messy data layer. For enterprise AI — especially RAG, agents, semantic search, recommendation, and decision intelligence — this foundation matters enormously.' },
          { type: 'typical', title: 'The point people share', items: [
            'Taxonomy organizes structure. Ontology defines meaning. Semantic mapping aligns across systems. Knowledge graph connects everything into usable context.',
            'Enterprise AI quality is downstream of knowledge architecture quality.',
            '“Your RAG quality is your data governance quality.”',
          ]},
        ],
      },
      {
        title: '11 data architecture patterns',
        tag: 'Concepts',
        hook: 'Data teams don’t fail because they picked the wrong technology — they fail because they picked the wrong architecture.',
        blocks: [
          { type: 'list', title: 'The 11 patterns', items: [
            '1. Data Warehouse — structured analytics, BI, executive dashboards. Best for reporting and governance.',
            '2. Data Lake — structured + unstructured data, massive scale, low-cost storage. Best for raw enterprise data.',
            '3. Lakehouse — combines lakes + warehouses; unified analytics, AI-ready. Best for modern data platforms.',
            '4. Streaming-First — real-time processing, continuous pipelines, low-latency insights. Best for operational intelligence.',
            '5. Kappa — single streaming pipeline, simplified architecture, lower maintenance. Best for event-driven systems.',
            '6. Data Mesh — domain-owned data, decentralized ownership, product-oriented thinking. Best for large enterprises.',
            '7. Data Fabric — unified data access, automated governance, cross-platform connectivity. Best for hybrid & multi-cloud.',
            '8. Event-Driven — asynchronous communication, loosely coupled, scalable integrations. Best for cloud-native applications.',
            '9. AI-Native — built for GenAI & ML, vector-ready, AI-first workflows. Best for intelligent applications.',
            '10. Data Platform — self-service infrastructure, shared tooling, faster developer productivity. Best for scaling data teams.',
            '11. Reverse ETL — analytics → operational systems, activate customer insights, close the data loop. Best for operationalizing analytics.',
          ]},
          { type: 'typical', title: 'The point people share', items: [
            'The biggest misconception: there is one “best” data architecture. Every architecture solves a different business problem.',
            'The organizations leading in AI don’t build around technologies — they build around data flow.',
            'Better data architecture = faster decisions, lower cost, better AI outcomes, greater engineering velocity.',
          ]},
        ],
      },
    ],
  },
  {
    id: 'costeval',
    num: '18',
    icon: '💰',
    title: 'Cost, Eval & Risk',
    tagline: 'Token optimization, hidden costs, the eval ground-truth problem, and AI risk',
    color: 'red',
    pages: [
      {
        title: 'Token optimization — 6 ways',
        tag: 'Concepts',
        hook: 'You’re optimizing models but ignoring the one thing that drives cost: context. More context silently increases latency, cost, and even reduces accuracy.',
        blocks: [
          { type: 'list', title: 'The 6 ways', items: [
            '1. Token Budgeting — allocate tokens across system, query, docs, history. Don’t send everything by default.',
            '2. Chunking + Reranking — split docs into smaller chunks; pass only the most relevant ones to the model.',
            '3. Dynamic Retrieval — fewer tokens for simple queries; more context only when the query needs it.',
            '4. Compression — summarize chunks before sending; keep signal high, tokens low.',
            '5. History + Caching — compress chat history or use a sliding window; cache repeated queries for zero token cost.',
            '6. Prompt + Output Optimization — short, precise prompts win; cap outputs to avoid token waste.',
          ]},
          { type: 'quote', text: 'Token optimization isn’t a trick — it’s how production AI actually works. Making it work is the junior bar; making it work cheap at scale is what actually pays.' },
          { type: 'typical', title: 'The point people share', items: [
            'Caching alone often cuts 30–50% on support-style traffic.',
            'Right-sizing the model is the cheapest lever and the most skipped.',
            'Measure cost per successful task, not per token.',
          ]},
        ],
      },
      {
        title: '7 hidden AI cost drivers',
        tag: 'Concepts',
        hook: 'Most companies have no idea why their AI costs keep rising. The real cost explosion happens inside the architecture.',
        blocks: [
          { type: 'list', title: 'The 7 drivers', items: [
            '1. Context Window Bloat — excessive context increases every call’s token spend.',
            '2. Agent Orchestration Overhead — multi-agent workflows multiply model calls per task.',
            '3. Poor Model Routing — premium models handling low-value tasks that a small model could do.',
            '4. Retrieval Inefficiencies — poor RAG design increases compute and latency per query.',
            '5. LLMOps & Observability — monitoring, evaluations, and tracing add operational overhead.',
            '6. Infrastructure & Runtime — GPUs, storage, and autoscaling drive ongoing costs.',
            '7. Governance & Compliance — security, audits, and regulatory controls require ongoing investment.',
          ]},
          { type: 'para', text: 'The biggest AI cost problems are not technical — they’re architectural. If you’re only tracking tokens, you’re probably missing the real cost drivers. The organizations reducing AI spend in 2026 are building more efficient systems, not using fewer models.' },
          { type: 'typical', title: 'The point people share', items: [
            'Poor model routing alone can double a bill: route easy tasks to small models, escalate only hard cases.',
            'Cost is a system property, not a model property.',
            'The cheapest token is the one you never send.',
          ]},
        ],
      },
      {
        title: 'The eval ground-truth problem',
        tag: 'Concepts',
        hook: 'Your eval dashboard is green — and two days later a customer forwards a screenshot of your agent inventing a refund policy that never existed. The dashboard is still green.',
        blocks: [
          { type: 'para', text: 'The problem underneath every eval-platform complaint: you do not have ground truth. Classical ML had labels; generative systems broke the answer key. There is no single “correct” summary of a document, no canonical “right” support response — quality is multi-dimensional and context-dependent.' },
          { type: 'list', title: 'The two traps', items: [
            'LLM-as-judge is a loan, not income — you are using an unreliable, non-deterministic system to grade an unreliable, non-deterministic system. The judge shares failure modes with the model under test (same blind spots, same sycophancy). The score changes when you change judge model, rubric wording, or temperature.',
            'Your eval set is not your production distribution — eval sets are built from remembered cases and past bugs. Production traffic is a living, drifting distribution. A green dashboard against a stale eval set says “still passes the cases we thought of a month ago.”',
          ]},
          { type: 'list', title: 'The 4 habits that work', items: [
            '1. Anchor every automated metric to a human-labeled slice — measure judge-human agreement before trusting the judge.',
            '2. Feed the eval set from production continuously — mine real traces, especially the weird and failed ones, on a schedule.',
            '3. Separate “did it break” from “is it good” — lean on deterministic checks for objective stuff; reserve LLM judges for subjective quality only.',
            '4. Keep a human in the loop at the highest stakes — sample and spot-check; the goal isn’t reviewing everything, it’s making sure automated numbers never detach from reality.',
          ]},
          { type: 'typical', title: 'The point people share', items: [
            'A green dashboard is not evidence of quality — it’s evidence that your proxies are satisfied.',
            'Buy the tracing, datasets, and experiment plumbing. Don’t buy the idea any platform has your ground truth.',
            'The teams that ship the most reliable AI are the ones who never let themselves forget they’re measuring proxies.',
          ]},
        ],
      },
      {
        title: 'AI risk — the Delphi study',
        tag: 'News',
        hook: 'A three-round Delphi study with 272 AI experts assessed which sectors are most exposed across 24 AI risk domains — and the findings aren’t obvious.',
        blocks: [
          { type: 'para', text: 'Rather than unique per-sector risks, many sectors face overlapping risks as AI embeds into decision-critical systems. IT, Finance & Insurance, National Security, Healthcare, and Education were rated especially exposed.' },
          { type: 'list', title: 'Key findings', items: [
            'Under business-as-usual, experts assigned ≥10% probability of catastrophic outcomes to 18 of 24 risk domains over the next 5 years.',
            'Even with pragmatic mitigations, 5 risks stayed above the 10% catastrophic threshold: dangerous AI capabilities, cyberattacks & weapons, environmental harm, inequality, and power centralization.',
            'Information, finance, and national security were rated the sectors most vulnerable to AI risks.',
          ]},
          { type: 'list', title: 'The MIT AI Risk initiative', items: [
            'AI Risk Repository — a living database of 1,700+ AI risks.',
            'AI Incident Tracker — connects risks to 1,400+ incidents (with the Responsible AI Collaborative).',
            'AI Governance Map — analyzes risk coverage across 1,000+ laws, standards, policies (curated by CSET).',
          ]},
          { type: 'typical', title: 'The point people share', items: [
            'AI risk isn’t theoretical — it’s being quantified, and the sectors most exposed are the ones embedding AI fastest.',
            'Governance is becoming a strategic capability, not a compliance exercise.',
            'The question is no longer “do we need AI governance?” — it’s “can we scale AI without it?”',
          ]},
        ],
      },
    ],
  },
]
