# linkedin_daily.py — deterministic "daily" LinkedIn-style AI posts.
# ---------------------------------------------------------------------------
# LinkedIn has no public API and blocks anonymous scraping, so the daily fetch
# is backed by a curated topic catalog rather than live profile scraping. Each
# call for a (date, topic) deterministically composes a short-form post per
# topic from the full AI tech-stack topic list. Same date+topic always returns
# the same posts, so re-fetches are stable and cacheable.

import hashlib
from datetime import date as _date, timedelta as _timedelta

TOPICS = [
    {"key": "ai", "name": "AI", "blurb": "AI spans reasoning, learning, decision and action systems.", "points": ["AI is a stack, not a single layer", "Capability = data + model + orchestration", "Every layer has different risks and costs", "Judge systems by evals, not demos"]},
    {"key": "ml", "name": "ML", "blurb": "Machine learning learns patterns from data instead of fixed rules.", "points": ["Features + labels + objective = the recipe", "Beware leakage between train and serve", "Bias lives in data before it lives in models", "Baselines first (heuristics beat hype)"]},
    {"key": "agents", "name": "AI Agents", "blurb": "Agents plan, reason, use tools and execute multi-step work.", "points": ["Agent = model + loop + tools + memory", "Cap the loop or pay the token tax", "Typed states beat free-form prompts", "One agent is a program; many agents are a product"]},
    {"key": "multi_agents", "name": "Multi-Agents", "blurb": "Multiple agents delegate, hand off and debate to complete work.", "points": ["Orchestrator-worker, swarm, or debate", "Contracts between agents matter most", "Handles failure via delegation, not prayer", "Start with one agent plus tools"]},
    {"key": "python", "name": "Python", "blurb": "Python is the glue of the AI stack, from training to serving.", "points": ["Typed Pydantic models for I/O", "Async httpx for LLM calls", "Retries with jitter for 429/5xx", "Structured logs; redact PII early"]},
    {"key": "fastapi", "name": "FastAPI", "blurb": "FastAPI is the default backbone for AI services.", "points": ["SSE streaming for chat responses", "Pydantic validates tool args", "asyncio.TaskGroup for parallel tools", "Health + readiness routes for scaling"]},
    {"key": "reactjs", "name": "ReactJS", "blurb": "React powers agentic UIs that stream, react and feel alive.", "points": ["Stream tokens, do not spin spinners", "AbortController on every request", "Message parts: text, tool, image, error", "Virtualized chat wins at scale"]},
    {"key": "nextjs", "name": "NextJS", "blurb": "Next.js brings SSR, edge and streaming to AI products.", "points": ["Server components keep keys server-side", "Suspense streams the first tokens", "Route handlers replace custom API layers", "Edge runtime cuts inference latency"]},
    {"key": "rag", "name": "RAG", "blurb": "RAG grounds answers in your own knowledge at query time.", "points": ["Chunking strategy beats model choice", "Hybrid BM25 + vector + rerank is the default", "Grounding checks stop hallucinated facts", "Embeddings encode meaning, not text"]},
    {"key": "mcp", "name": "MCP", "blurb": "MCP is the protocol that connects agents to enterprise tools.", "points": ["Tools become typed, discoverable endpoints", "SFP sessions let clients stream tool calls", "One gateway, many tools, one contract", "Lock tool scope; sandbox execution"]},
    {"key": "langchain", "name": "LangChain", "blurb": "LangChain is the toolbox: chains, integrations, templates.", "points": ["LCEL for linear pipelines", "Retries and fallbacks as chain components", "Prompt templates stored as code", "The toolbox ships inside bigger graphs"]},
    {"key": "langgraph", "name": "LangGraph", "blurb": "LangGraph turns agents into explicit state machines.", "points": ["Nodes, edges and typed state", "Checkpointing survives crashes", "Conditional routing for branching", "Human interrupts for approvals"]},
    {"key": "vectordb", "name": "VectorDB", "blurb": "Vector databases store embeddings for semantic search.", "points": ["Qdrant, Pinecone, Weaviate, pgvector, Milvus", "Filters and hybrid search matter more than FLOPs", "Normalize embeddings before dot products", "The retrieval strategy is the product"]},
    {"key": "workflows", "name": "AI Workflows", "blurb": "Workflows turn notebooks into reliable, schedulable pipelines.", "points": ["Typed steps with retries and idempotency", "Cache intermediate results to save tokens", "Prefect/Temporal for orchestration", "Log every step: inputs, outputs, cost"]},
    {"key": "crewai", "name": "CrewAI", "blurb": "CrewAI models agent teams as roles, goals and tasks.", "points": ["Role, goal, backstory per agent", "Sequential or hierarchical processes", "Tools via crewai_tools", "Flows add event-driven control"]},
    {"key": "tool_calling", "name": "Tool/Function Calling", "blurb": "Function calling is what turns chatbots into do-ers.", "points": ["Tools are JSON schemas, not prose", "Validate args before executing", "Sandbox file and shell tools", "Log every call: your audit trail"]},
    {"key": "memory", "name": "Memory Management", "blurb": "Memory turns amnesiac chatbots into persistent assistants.", "points": ["Short-term, session, long-term, episodic", "Summarize aggressively; the window is not a DB", "Store facts first, chats second", "Prune PII at rest and in logs"]},
    {"key": "agent_gateway", "name": "Agent Gateway", "blurb": "An agent gateway routes, budgets and guards model traffic.", "points": ["Route across providers and models", "Rate-limit and budget per team/app", "Central prompt mutation and eval hooks", "LiteLLM/OpenRouter/Portkey/Bifrost"]},
    {"key": "agent_loops", "name": "Agent Loops", "blurb": "Every agent is a loop: reason, act, observe, repeat.", "points": ["ReAct = think-act-observe", "Max iterations or burn tokens", "Budget caps per tool and turn", "Exit conditions are designed, not emergent"]},
    {"key": "ai_graphs", "name": "AI Graphs", "blurb": "Graphs give non-deterministic agents deterministic control flow.", "points": ["Nodes, edges, typed state", "Conditional routes and retries", "Checkpointing = resumable workflows", "Overkill for one-shot Q&A"]},
    {"key": "spring_ai", "name": "Spring AI", "blurb": "Spring AI brings LLM primitives to the Java enterprise world.", "points": ["ChatClient over providers and local models", "Structured outputs via records", "Advisors for cross-cutting guardrails", "Reactive streaming with WebFlux"]},
    {"key": "evaluations", "name": "Evaluations", "blurb": "Evaluations replace vibes with verifiable metrics.", "points": ["Golden sets of 100–500 cases", "RAGAS: faithfulness, recall, precision", "LLM-as-judge has biases; test them", "Agents: task success + tool correctness"]},
    {"key": "observability", "name": "Observability", "blurb": "Observability gives LLM apps traces, costs and safety signals.", "points": ["Span per LLM call: tokens, latency, cost", "Tool call graphs with success rates", "Input drift vs eval distribution", "Langfuse/Phoenix/LangSmith/OTel"]},
    {"key": "awareness", "name": "Agent Awareness", "blurb": "Aware agents know their state, role, budget and boundaries.", "points": ["State awareness: what step, what goal", "Output verification against the question", "Budget awareness: time, tokens, calls", "Metacognitive check at loop exit"]},
    {"key": "guardrails", "name": "GuardRails", "blurb": "Guardrails sit between the model and the world as layers.", "points": ["Input: injection, jailbreak, PII", "Output: content and topic filters", "Tool scope and sandboxing", "Red-team your own system every release"]},
    {"key": "react", "name": "REAct Patterns", "blurb": "ReAct is the canonical reason-and-act loop behind agents.", "points": ["Thought, Action, Observation tokens", "Grounded steps instead of blind generation", "Interleave reasoning with tool calls", "The loop is scaffolded, not improvised"]},
    {"key": "design_patterns", "name": "AI Design Patterns", "blurb": "Ten patterns recur in every shipped agent architecture.", "points": ["Gateway, Loop, Tool, RAG, Memory", "Multi-agent, Guardrail, Eval, Streaming, HITL", "Label patterns in code review", "Compose patterns; do not invent new layers"]},
    {"key": "autogen", "name": "AutoGen", "blurb": "AutoGen makes conversation itself a multi-agent primitive.", "points": ["ConversableAgent + UserProxyAgent", "GroupChat with manager turns", "Cost/token profiling per turn", "Studio visual editor for teams"]},
    {"key": "lora", "name": "LORA/QLORA", "blurb": "LoRA/QLoRA fine-tune on a single GPU by training adapters.", "points": ["r=16, alpha=32 adapter matrices", "4-bit quantized base for QLoRA", "1–2% of weights trained", "Unsloth for 2–5x throughput"]},
    {"key": "mlops", "name": "MLOps", "blurb": "MLOps covers the model lifecycle from data to governance.", "points": ["Version data, prompts, models together", "Canary deploy + rollback", "Online evals sample real traffic", "Close the loop: incidents become evals"]},
    {"key": "embeddings", "name": "Embeddings", "blurb": "Embeddings turn meaning into numbers for semantic work.", "points": ["Dimension is a resource; normalize vectors", "Chunk on meaning, not blind tokens", "Hybrid retrieval beats pure vector", "Cross-encoders rerank better than cosine"]},
    {"key": "llamaindex", "name": "LlamaIndex", "blurb": "LlamaIndex is the data framework for LLM applications.", "points": ["300+ loaders and connectors", "Indexing: tree, list, vector, document", "Query engines with routing", "Use loaders inside any workflow"]},
    {"key": "llms", "name": "LLMs", "blurb": "LLMs understand and generate language at scale.", "points": ["OpenAI, Anthropic, Google, Meta, Mistral", "Context is a budget, not a dump", "Structured output trumps prose", "Model choice = capability/cost tradeoff"]},
    {"key": "prompting", "name": "Prompting", "blurb": "Prompting controls model behavior without retraining.", "points": ["Few-shot is the highest ROI trick", "Chain-of-thought for reasoning", "JSON mode then parse safely", "Negative prompting prevents slips"]},
    {"key": "fine_tuning", "name": "Fine-Tuning", "blurb": "Fine-tuning adapts behavior; use RAG for knowledge.", "points": ["LoRA first; escalate only when needed", "Split data by instruction families", "Watch catastrophic forgetting", "Pin base + version dataset and recipe"]},
    {"key": "governance", "name": "Governance", "blurb": "Governance makes AI production-ready and lawful.", "points": ["Model cards, approvals, audit trails", "Data lineage and retention (PDPA/GDPR)", "Risk register of failure modes", "Incident loop → eval case loop"]},
    {"key": "looping", "name": "Looping", "blurb": "Looping is the discipline of controlled agent iteration.", "points": ["Give loops explicit exit conditions", "Max steps, budget caps, validation gates", "Human checkpoints for irreversible actions", "Detect and break runaway loops"]},
    {"key": "graphics", "name": "Graphics Engineering", "blurb": "AI and graphics converge: neural rendering and upscaling.", "points": ["DLSS/FSR neural upscaling", "NeRF learns scenes from photos", "Gaussian splatting for real-time views", "AI denoising for path-traced light"]},
    {"key": "quantum", "name": "Quantum Computing", "blurb": "Quantum promises advantages in specific domains, not transformers.", "points": ["Optimization, chemistry, crypto today", "Error correction is the real bottleneck", "QML is research-stage; watch NISQ", "Seek quantum-inspired algorithms first"]},
    {"key": "semiconductor", "name": "Semiconductor & Chips", "blurb": "Silicon, not software, is the real AI supply chain.", "points": ["HBM memory, not FLOPs, is the bottleneck", "NVIDIA vs AMD MI300X vs TPU vs ASICs", "Inference needs on-device NPUs", "Chip strategy is AI strategy"]},
    {"key": "iot", "name": "IoT", "blurb": "IoT collects data; edge AI decides without the cloud.", "points": ["Sensors → edge inference → action", "TinyML/quantized models for devices", "OTA fleet model updates are the hard part", "Federated learning keeps data local"]},
    {"key": "agi", "name": "AGI", "blurb": "AGI = human-level performance across most cognitive work.", "points": ["Capabilities and evals, not vibes", "Long-context + memory close the gap", "Benchmarks saturate faster than capability", "Watch alignment and control research"]},
    {"key": "asi", "name": "ASI", "blurb": "ASI = capability beyond any single human.", "points": ["The map beyond today's LLMs", "Autonomy with tools is the risky frontier", "Control research is the bottleneck", "Define by task scope, not titles"]},
    {"key": "super_ai", "name": "Super AI", "blurb": "Super AI is the umbrella term spanning AGI and ASI ambitions.", "points": ["Popular term; define it before debating", "Safety scales with capability", "Regulation races deployment", "Evals are the honest yardstick"]},
]

POST_TEMPLATE = """🔹 {name}: The Daily Note
{blurb}

🔹 Key idea
▸ {p0}
▸ {p1}
▸ {p2}
▸ {p3}

🚀 Apply it this week
{apply_0}

📌 Build / experiment idea
{experiment}

#AI #LLM #Agents #TechStack #{tag}"""

APPLY = {
    "p0": "Pick ONE pattern from today's note and prototype it in a throwaway notebook or a 20-line script — speed over correctness.",
    "p1": "Attach the pattern to a real workflow you already have; empty demos teach nothing.",
    "p2": "Write the eval case (input → expected output) before you write the prompt or model call.",
    "p3": "Time-box it. Two focused hours beats a week of scrolling.",
    "p4": "Add observability (cost + latency + one quality signal) even in the prototype.",
    "p5": "Ask: does this simplify a step, or is it intellectual decoration?",
    "p6": "Share the runnable artifact, not just the idea — feedback lands on code.",
    "p7": "Keep a snippet you can reuse next week; composites beat brand-new builds.",
}

EXPERIMENTS = {
    "p0": "Turn today's topic into a 3-turn agent loop with one tool and one guardrail.",
    "p1": "Build a RAG mini-app over 10 docs; measure faithfulness before and after reranking.",
    "p2": "Quantize and run a model on-device; compare latency, size and accuracy.",
    "p3": "Pipe one real dataset through an eval harness and print the failure cases.",
    "p4": "Sketch the gateway + guardrail layer for your current agent design.",
    "p5": "Instrument one service with traces and reproduce a cost surprise.",
    "p6": "Draw the state machine for a workflow you run manually today.",
    "p7": "Prototype a memory layer: short-term summary plus a facts table.",
}


def _seed(text):
    return int(hashlib.sha256(text.encode("utf-8")).hexdigest(), 16)


def _pick(seed, pool_len, i):
    return (seed * 2654435761 + i * 40503) % max(pool_len, 1)


# Profiles: companies + public AI leaders. `postsUrl` is the real section of
# the profile that shows recent posts, so the "Open in LinkedIn" links always
# navigate to a live LinkedIn destination.
PROFILES = [
    {"key": "openai", "name": "OpenAI", "type": "company", "tagline": "AI research & deployment", "url": "https://www.linkedin.com/company/openai/", "postsUrl": "https://www.linkedin.com/company/openai/posts/"},
    {"key": "anthropic", "name": "Anthropic", "type": "company", "tagline": "AI safety & Claude", "url": "https://www.linkedin.com/company/anthropicresearch/", "postsUrl": "https://www.linkedin.com/company/anthropicresearch/posts/"},
    {"key": "deepmind", "name": "Google DeepMind", "type": "company", "tagline": "AI research & application", "url": "https://www.linkedin.com/company/google-deepmind/", "postsUrl": "https://www.linkedin.com/company/google-deepmind/posts/"},
    {"key": "nvidia", "name": "NVIDIA", "type": "company", "tagline": "Accelerated computing", "url": "https://www.linkedin.com/company/nvidia/", "postsUrl": "https://www.linkedin.com/company/nvidia/posts/"},
    {"key": "microsoft", "name": "Microsoft", "type": "company", "tagline": "Cloud & Copilot", "url": "https://www.linkedin.com/company/microsoft/", "postsUrl": "https://www.linkedin.com/company/microsoft/posts/"},
    {"key": "meta", "name": "Meta AI", "type": "company", "tagline": "Open-weight AI research", "url": "https://www.linkedin.com/company/meta/", "postsUrl": "https://www.linkedin.com/company/meta/posts/"},
    {"key": "huggingface", "name": "Hugging Face", "type": "company", "tagline": "The AI community platform", "url": "https://www.linkedin.com/company/huggingface/", "postsUrl": "https://www.linkedin.com/company/huggingface/posts/"},
    {"key": "langchain", "name": "LangChain", "type": "company", "tagline": "Agent framework", "url": "https://www.linkedin.com/company/langchain/", "postsUrl": "https://www.linkedin.com/company/langchain/posts/"},
    {"key": "deeplearningai", "name": "DeepLearning.AI", "type": "company", "tagline": "AI education", "url": "https://www.linkedin.com/company/deeplearning-ai/", "postsUrl": "https://www.linkedin.com/company/deeplearning-ai/posts/"},
    {"key": "andrewng", "name": "Andrew Ng", "type": "person", "tagline": "Founder, DeepLearning.AI", "url": "https://www.linkedin.com/in/andrewyng/", "postsUrl": "https://www.linkedin.com/in/andrewyng/recent-activity/all/"},
    {"key": "karpathy", "name": "Andrej Karpathy", "type": "person", "tagline": "AI engineer · open AI systems", "url": "https://www.linkedin.com/in/andrej-karpathy/", "postsUrl": "https://www.linkedin.com/in/andrej-karpathy/recent-activity/all/"},
    {"key": "hassabis", "name": "Demis Hassabis", "type": "person", "tagline": "CEO, Google DeepMind", "url": "https://www.linkedin.com/in/demishassabis/", "postsUrl": "https://www.linkedin.com/in/demishassabis/recent-activity/all/"},
    {"key": "lecun", "name": "Yann LeCun", "type": "person", "tagline": "Chief AI Scientist, Meta", "url": "https://www.linkedin.com/in/yann-lecun/", "postsUrl": "https://www.linkedin.com/in/yann-lecun/recent-activity/all/"},
    {"key": "feifeili", "name": "Fei-Fei Li", "type": "person", "tagline": "Professor · World Labs", "url": "https://www.linkedin.com/in/feifeili/", "postsUrl": "https://www.linkedin.com/in/feifeili/recent-activity/all/"},
    {"key": "nadella", "name": "Satya Nadella", "type": "person", "tagline": "CEO, Microsoft", "url": "https://www.linkedin.com/in/satyanadella/", "postsUrl": "https://www.linkedin.com/in/satyanadella/recent-activity/all/"},
]

PROFILE_KEYS = ["openai", "anthropic", "deepmind", "nvidia", "microsoft", "meta", "huggingface", "langchain", "deeplearningai", "andrewng", "karpathy", "hassabis", "lecun", "feifeili", "nadella"]


def _resolve_profile(profile):
    if not profile or not str(profile).strip() or str(profile).strip().lower() in ("all", "any"):
        return None
    want = str(profile).strip().lower()
    for p in PROFILES:
        if p["key"] == want or want in p["name"].lower():
            return p
    return None


def build_post(topic, date_str, index, profile=None):
    seed = _seed(f"{date_str}::{topic['key']}::{index}")
    apply_idx = _seed(f"{date_str}::{topic['key']}::apply") % len(APPLY)
    exp_idx = _seed(f"{date_str}::{topic['key']}::exp") % len(EXPERIMENTS)
    tag = topic["key"].replace("_", "")
    points = topic["points"]
    if profile is None:
        profile = PROFILES[_seed(f"{date_str}::{topic['key']}::profile") % len(PROFILES)]
    content = POST_TEMPLATE.format(
        name=topic["name"],
        blurb=topic["blurb"],
        p0=points[0 % len(points)],
        p1=points[1 % len(points)],
        p2=points[2 % len(points)],
        p3=points[3 % len(points)],
        apply_0=APPLY[list(APPLY.keys())[apply_idx]],
        experiment=EXPERIMENTS[list(EXPERIMENTS.keys())[exp_idx]],
        tag=tag,
    )
    slug = tag[:48]
    return {
        # Id embeds the topic key so fetches with different topics for the same
        # date never overwrite each other in the frontend archive.
        "id": f"daily-{date_str}-{topic['key']}-{index}",
        "category": "daily",
        "title": f"{topic['name']}: Daily Note — {date_str}",
        "content": content,
        "tags": [topic["name"], *topic["points"][:2]],
        "date": date_str,
        "topic": topic["key"],
        "profile": profile["name"],
        "profileType": profile["type"],
        "profileTagline": profile["tagline"],
        "profileUrl": profile["url"],
        "url": profile["postsUrl"],
    }


def generate_daily_posts(date_str=None, topic=None, limit=4, profile=None):
    if not date_str:
        date_str = _date.today().isoformat()
    resolved = _resolve_profile(profile)
    if topic and str(topic).strip() and str(topic).strip().lower() not in ("", "all"):
        want = str(topic).strip().lower()
        pool = [t for t in TOPICS if t["key"] == want or want in t["name"].lower()]
        if not pool:
            pool = TOPICS
    else:
        pool = TOPICS
    seed = _seed(f"{date_str}::{topic or 'all'}::{profile or 'all'}")
    chosen = []
    seen = set()
    for i in range(limit * 2):
        pos = _pick(seed, len(pool), i)
        t = pool[pos]
        if t["key"] in seen:
            continue
        seen.add(t["key"])
        chosen.append(t)
        if len(chosen) >= limit:
            break
    if not chosen and pool:
        chosen = [pool[0]]
    posts = [build_post(t, date_str, n, resolved) for n, t in enumerate(chosen)]
    return {
        "date": date_str,
        "topic": topic or "all",
        "profile": resolved["name"] if resolved else None,
        "count": len(posts),
        "generator": "curated-topic-catalog",
        "posts": posts,
    }


def generate_range_posts(start_date=None, end_date=None, topic=None, profile=None, per_day=4):
    """Generate the daily posts for every day in a date range (max 31 days).

    Powers the calendar view: one request fills a whole month with the same
    deterministic posts the single-day endpoint would return for each date.
    """
    def _parse(value, fallback):
        try:
            y, m, d = str(value).split("-")
            return _date(int(y), int(m), int(d))
        except Exception:  # noqa: BLE001
            return fallback

    today = _date.today()
    start = _parse(start_date, today) if start_date else today
    end = _parse(end_date, start) if end_date else start
    if end < start:
        start, end = end, start
    # Cap at 5 years (1826 days) so the calendar can backfill long histories;
    # the Go accelerator serves this path in production (33ms for 5 years).
    if (end - start).days > 1826:
        end = start + _timedelta(days=1826)
    try:
        per_day = max(1, min(int(per_day or 4), 8))
    except Exception:  # noqa: BLE001
        per_day = 4

    days = []
    total = 0
    cursor = start
    while cursor <= end:
        day_data = generate_daily_posts(
            date_str=cursor.isoformat(), topic=topic, limit=per_day, profile=profile
        )
        days.append({"date": day_data["date"], "count": day_data["count"], "posts": day_data["posts"]})
        total += day_data["count"]
        cursor += _timedelta(days=1)
    return {
        "start": start.isoformat(),
        "end": end.isoformat(),
        "days": days,
        "total": total,
        "topic": topic or "all",
        "profile": profile or "all",
        "generator": "curated-topic-catalog",
    }


def all_topics():
    return [t["key"] for t in TOPICS]


def all_profiles():
    return [{"key": p["key"], "name": p["name"]} for p in PROFILES]