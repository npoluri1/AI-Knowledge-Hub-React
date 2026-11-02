// Study guides for every Study-by-Doing section: built to be *remembered*,
// not re-read. Each guide = one picture, one hook, the few ideas that matter,
// runnable code, a 30-second interview answer, likely questions, real uses,
// the classic mistake, and a "change the world" idea.
const R = String.raw

export const SBD_GUIDES = {
  'getting-started': {
    big: 'Set up one clean workspace so every lesson runs the same way on your machine.',
    analogy: 'Like a chef’s mise en place — knives sharpened, ingredients chopped — before the first dish.',
    picture: 'A tidy kitchen counter: VS Code is the cutting board, the terminal is the stove, Python is the knife.',
    hook: 'EDIT → RUN → READ ERROR → FIX. Repeat until boring.',
    points: [['Editor', 'VS Code with the Python extension: autocomplete, linting, debugger.'], ['Terminal', 'Run code exactly as production will — not just the play button.'], ['Virtual env', 'One isolated box of packages per project: python -m venv .venv.'], ['Playground', 'A scratch file for quick experiments before you commit to a design.']],
    code: { lang: 'bash', src: R`python -m venv .venv
# Windows: .venv\Scripts\activate    macOS/Linux: source .venv/bin/activate
pip install requests
python -c "import requests; print(requests.get('https://httpbin.org/get').status_code)"` },
    interview: 'I keep every project in its own virtual environment with pinned dependencies, run code from the terminal the way CI does, and use the debugger instead of print-spraying. That makes my results reproducible on any machine.',
    qa: [['Why a virtual environment?', 'Isolation — each project gets its own package versions so upgrades in one never break another.'], ['How do you debug?', 'Reproduce, read the full traceback bottom-up, set a breakpoint at the failing frame, inspect state, fix, add a test.']],
    uses: ['Onboarding a new teammate in minutes', 'Reproducible bug reports', 'Same environment locally and in CI'],
    pitfall: 'Installing packages globally — the "works on my machine" trap.',
    idea: 'A one-click “learning box” that gives every student on Earth an identical, free, cloud dev environment.',
  },
  'python-fundamentals': {
    big: 'Python is the glue language of AI: simple syntax, huge ecosystem, everything is an object.',
    analogy: 'Python is LEGO: a few brick types (int, str, list, dict) snap together into anything.',
    picture: 'Variables are name-tags tied to objects floating in memory — not boxes holding values.',
    hook: 'Lists line up, dicts look up, functions wrap up, classes group up.',
    points: [['Data structures', 'list (ordered), dict (key→value, O(1) lookup), set (unique), tuple (immutable).'], ['Functions', 'First-class: pass them around, return them, decorate them.'], ['OOP', 'Classes bundle data + behaviour; dataclasses remove boilerplate.'], ['Generators', 'yield values lazily — stream huge data with tiny memory.'], ['GIL', 'Only one thread runs Python bytecode at a time; use asyncio for I/O, processes for CPU.']],
    code: { lang: 'python', src: R`from dataclasses import dataclass

@dataclass
class Doc:
    title: str
    words: int

def long_docs(docs, min_words=100):
    for d in docs:              # generator: lazy, memory-friendly
        if d.words >= min_words:
            yield d.title

docs = [Doc("RAG intro", 120), Doc("Tiny note", 12)]
print(list(long_docs(docs)))   # ['RAG intro']` },
    interview: 'Python’s strength is expressiveness plus ecosystem. I use dataclasses or Pydantic for structured data, generators for streaming large inputs, asyncio for I/O-bound concurrency, and I know the GIL means CPU-heavy work needs multiprocessing or native libraries like NumPy.',
    qa: [['List vs tuple?', 'List is mutable; tuple is immutable and hashable, so it can be a dict key.'], ['What is a decorator?', 'A function that takes a function and returns a wrapped one — used for logging, caching, retries, auth.']],
    uses: ['Data pipelines', 'LLM app backends', 'Automation scripts'],
    pitfall: 'Mutable default arguments: def f(x=[]) shares one list across all calls — use None instead.',
    idea: 'Python as a universal “second language” — every doctor, farmer and teacher automating their own work.',
  },
  'data-structures-algorithms': {
    big: 'Pick the right container and the right strategy, and slow code becomes instant.',
    analogy: 'A library: an array is a shelf in order, a hash map is the card catalogue, a tree is the Dewey decimal system, a graph is the city map of all libraries.',
    picture: 'Big-O is a race on a growing track: O(1) teleports, O(log n) halves the track each step, O(n²) runs every pair of lanes.',
    hook: 'Hash to find, sort to order, tree to rank, graph to connect, DP to remember.',
    points: [['Complexity', 'Count how work grows with n: O(1) < O(log n) < O(n) < O(n log n) < O(n²).'], ['Hashing', 'dict/set give average O(1) lookup — the #1 interview speed-up.'], ['Two pointers / sliding window', 'Turn nested loops into one pass on sorted or contiguous data.'], ['BFS / DFS', 'BFS = shortest path in unweighted graphs; DFS = explore/backtrack.'], ['Dynamic programming', 'Overlapping subproblems → store answers, never recompute.']],
    code: { lang: 'python', src: R`def two_sum(nums, target):
    seen = {}                       # value -> index  (hash map, O(n))
    for i, n in enumerate(nums):
        if target - n in seen:
            return seen[target - n], i
        seen[n] = i

from functools import lru_cache
@lru_cache(None)                    # DP by memoization
def climb(n):                       # ways to climb n stairs (1 or 2 steps)
    return 1 if n <= 1 else climb(n - 1) + climb(n - 2)

print(two_sum([2, 7, 11, 15], 9), climb(10))   # (0, 1) 89` },
    interview: 'I start with brute force to show correctness, state its complexity, then optimise by spotting the pattern — hashing for lookups, two pointers for sorted data, BFS for shortest paths, DP when subproblems repeat — and I finish by testing edge cases: empty input, duplicates, one element.',
    qa: [['When BFS over DFS?', 'BFS when you need the shortest path in an unweighted graph; DFS for exhaustive search, cycles, topological order.'], ['How do you spot DP?', 'Optimal answer built from optimal sub-answers, and the same subproblem appears more than once.']],
    uses: ['Autocomplete (tries)', 'Route planning (graphs)', 'Rate limiting (sliding windows)'],
    pitfall: 'Jumping to code before clarifying input size and constraints.',
    idea: 'Algorithms that route ambulances, food and power through cities in real time — DSA literally saving lives.',
  },
  'system-design': {
    big: 'Design systems that stay fast, correct and cheap as users grow 1,000×.',
    analogy: 'A restaurant chain: load balancer = host seating guests, cache = dishes kept warm, database = the pantry, queue = the order tickets, shards = more kitchens.',
    picture: 'Draw boxes left→right: Client → LB → API servers → Cache → DB, with a queue branching off to workers.',
    hook: 'Requirements → Estimate → API → Data → Scale → Trade-offs.',
    points: [['Requirements first', 'Functional (what) + non-functional (latency, availability, scale).'], ['Caching', 'Serve hot reads from memory; decide TTL and invalidation.'], ['Sharding', 'Split data by key across machines; consistent hashing limits reshuffles.'], ['CAP', 'During a network partition choose consistency or availability.'], ['Queues', 'Decouple slow work; absorb traffic spikes; retry safely.']],
    code: { lang: 'python', src: R`import hashlib, bisect

class ConsistentHash:
    def __init__(self, nodes, replicas=100):
        self.ring = sorted((self._h(f"{n}#{i}"), n) for n in nodes for i in range(replicas))
        self.keys = [k for k, _ in self.ring]
    def _h(self, s): return int(hashlib.md5(s.encode()).hexdigest(), 16)
    def node_for(self, key):
        i = bisect.bisect(self.keys, self._h(key)) % len(self.keys)
        return self.ring[i][1]

ring = ConsistentHash(["db-a", "db-b", "db-c"])
print(ring.node_for("user:42"))     # same key -> same shard, always` },
    interview: 'I clarify requirements and scale numbers first, sketch the request path, choose the data model, then scale the bottleneck: cache hot reads, shard by a high-cardinality key, push slow work to queues, and replicate for availability — calling out each trade-off like consistency versus latency.',
    qa: [['SQL or NoSQL?', 'SQL for relations, transactions and ad-hoc queries; NoSQL for massive scale with simple, known access patterns.'], ['How do you avoid cache stampedes?', 'Request coalescing, jittered TTLs, or serving stale-while-revalidate.']],
    uses: ['URL shortener', 'Chat systems', 'LLM gateways with caching and rate limits'],
    pitfall: 'Designing for Google scale before stating requirements.',
    idea: 'Resilient public systems — elections, payments, disaster alerts — that never go down when people need them most.',
  },
  'developer-foundations': {
    big: 'The everyday tools of a professional engineer: shell, Git, the web, packaging and how computers really work.',
    analogy: 'Git is a time machine with parallel universes (branches) you can merge back together.',
    picture: 'A request travels: browser → DNS phonebook → TCP handshake → TLS lock → HTTP request → server → response.',
    hook: 'Shell to command, Git to remember, HTTP to talk, packages to share.',
    points: [['Command line', 'Pipes and small tools compose: grep | sort | uniq -c.'], ['Git', 'Commit small, branch per feature, rebase or merge via pull request.'], ['How the web works', 'DNS → TCP → TLS → HTTP verbs and status codes.'], ['Environments', 'Pin dependencies; configure with environment variables, never hard-coded secrets.']],
    code: { lang: 'bash', src: R`git switch -c feature/rag-cache
git add -p                       # stage hunks deliberately
git commit -m "Add Redis cache for retrieval results"
git push -u origin feature/rag-cache
curl -s -o /dev/null -w "%{http_code}\n" https://api.github.com` },
    interview: 'I work in small, reviewed commits on feature branches, keep secrets in environment variables, and I can trace a web request end to end — DNS, TCP, TLS, HTTP — which is how I debug latency and connectivity issues quickly.',
    qa: [['Merge vs rebase?', 'Merge preserves history with a merge commit; rebase replays commits for a linear history — never rebase shared branches.'], ['What happens when you type a URL?', 'DNS lookup, TCP + TLS handshake, HTTP request, server work, response, browser renders.']],
    uses: ['Code review workflows', 'Debugging production', 'Reproducible builds'],
    pitfall: 'Committing .env files or API keys to Git.',
    idea: 'Open-source collaboration at planetary scale — millions improving shared software for everyone.',
  },
  'containers-deployment': {
    big: 'Package an app with everything it needs so it runs identically everywhere, then ship it automatically.',
    analogy: 'A shipping container: any port (laptop, cloud, server) can lift it the same way regardless of what is inside.',
    picture: 'An image is a stack of transparent layers; a container is that stack brought to life with its own process and filesystem.',
    hook: 'Build once, run anywhere, deploy on every push.',
    points: [['Dockerfile', 'A recipe of layers; order instructions from least to most frequently changing.'], ['Image vs container', 'Image = blueprint; container = running instance.'], ['Compose', 'Run multi-service apps (API + DB + cache) with one file.'], ['CI/CD', 'Every push: test → build → scan → deploy.'], ['Security', 'Small base images, non-root user, scan dependencies, sign images.']],
    code: { lang: 'dockerfile', src: R`FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt   # cached layer
COPY . .
RUN useradd -m app && chown -R app /app
USER app
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]` },
    interview: 'I containerise services with slim, non-root images and dependency layers cached before source code, use Compose locally for the full stack, and a CI pipeline that tests, builds, scans and deploys on every merge — so production matches what we tested.',
    qa: [['Container vs VM?', 'Containers share the host kernel — lighter and faster to start; VMs virtualise hardware with a full OS.'], ['Why multi-stage builds?', 'Build tools stay in the first stage; the final image ships only the runtime — smaller and safer.']],
    uses: ['Microservices', 'ML model serving', 'Reproducible data jobs'],
    pitfall: 'COPY . . before installing dependencies — every code change re-installs everything.',
    idea: 'Shipping AI to clinics and schools with zero IT staff: one container, plug in, it works.',
  },
  'kubernetes-orchestration': {
    big: 'Kubernetes keeps the desired number of healthy containers running and heals them automatically.',
    analogy: 'An orchestra conductor: you hand over the score (YAML), it makes sure every musician (pod) is playing — and replaces anyone who stops.',
    picture: 'A control loop: desired state (3 replicas) vs actual state (2) → scheduler starts one more.',
    hook: 'Pods run, Deployments repeat, Services connect, Ingress exposes, HPA scales.',
    points: [['Pod', 'Smallest unit: one or more containers sharing network and storage.'], ['Deployment', 'Declares replicas and rolling updates.'], ['Service', 'Stable address and load balancing across pods.'], ['Probes', 'Liveness restarts broken pods; readiness gates traffic.'], ['HPA', 'Autoscale replicas on CPU, memory or custom metrics.']],
    code: { lang: 'yaml', src: R`apiVersion: apps/v1
kind: Deployment
metadata: { name: rag-api }
spec:
  replicas: 3
  selector: { matchLabels: { app: rag-api } }
  template:
    metadata: { labels: { app: rag-api } }
    spec:
      containers:
        - name: api
          image: ghcr.io/acme/rag-api:1.4.0
          ports: [{ containerPort: 8000 }]
          readinessProbe: { httpGet: { path: /health, port: 8000 } }
          resources: { requests: { cpu: 250m, memory: 512Mi } }` },
    interview: 'Kubernetes is a declarative control loop: I describe the desired state in Deployments, expose pods through Services and Ingress, protect traffic with readiness probes, and autoscale with HPA — then add GitOps so every change is reviewed and reversible.',
    qa: [['Liveness vs readiness?', 'Liveness failing restarts the container; readiness failing only stops traffic to it.'], ['How do you roll back?', 'kubectl rollout undo, or revert the Git commit when using GitOps.']],
    uses: ['Scaling LLM APIs', 'GPU scheduling for inference', 'Blue/green and canary releases'],
    pitfall: 'No resource requests — the scheduler cannot place pods well and noisy neighbours starve services.',
    idea: 'A self-healing global compute fabric where AI services never go down during a crisis.',
  },
  'advanced-ai-engineering': {
    big: 'The engineering beneath AI apps: concurrency, streaming, tensors, parsing, resilience and the maths that powers models.',
    analogy: 'An airport: async is one controller juggling many planes in the air; threads are extra controllers; tensors are luggage trolleys moving data in bulk.',
    picture: 'An event loop spinning, picking up whichever request just got its network response.',
    hook: 'Await the slow, vectorise the heavy, validate the untrusted, retry the flaky.',
    points: [['Async', 'asyncio handles thousands of concurrent I/O calls (LLM APIs) on one thread.'], ['Streaming', 'Send tokens as they arrive — faster perceived latency.'], ['Tensors', 'N-dimensional arrays; vectorised maths beats Python loops by 100×.'], ['Validation', 'Pydantic turns messy LLM output into typed, checked objects.'], ['Resilience', 'Timeouts, retries with exponential backoff, circuit breakers.']],
    code: { lang: 'python', src: R`import asyncio, random

async def call_llm(prompt):
    await asyncio.sleep(random.uniform(0.2, 0.6))   # pretend network call
    return f"answer to {prompt!r}"

async def with_retry(fn, *args, tries=3):
    for attempt in range(tries):
        try:
            return await asyncio.wait_for(fn(*args), timeout=2)
        except Exception:
            await asyncio.sleep(2 ** attempt)        # exponential backoff
    raise RuntimeError("gave up")

async def main():
    prompts = [f"q{i}" for i in range(5)]
    print(await asyncio.gather(*(with_retry(call_llm, p) for p in prompts)))

asyncio.run(main())` },
    interview: 'For AI backends I make every model and tool call async with timeouts and exponential backoff, stream tokens to users, validate model output with Pydantic, and keep numeric work vectorised in NumPy or PyTorch — that combination gives low latency and graceful failure.',
    qa: [['asyncio vs threads?', 'asyncio for many I/O waits on one thread; threads for blocking libraries; processes for CPU-bound work.'], ['Why validate LLM output?', 'Models can return malformed or unsafe data — schemas catch it before it reaches the rest of the system.']],
    uses: ['High-throughput LLM gateways', 'Streaming chat UIs', 'Robust document parsers'],
    pitfall: 'Calling blocking code inside async functions — it freezes the whole event loop.',
    idea: 'Real-time AI interpreters that let any two people on Earth talk instantly in their own languages.',
  },
  'foundations-concepts': {
    big: 'Agentic AI = an LLM that can plan, use tools and act in a loop toward a goal.',
    analogy: 'An LLM alone is a brilliant consultant locked in a room; an agent gives the consultant a phone, a computer and a to-do list.',
    picture: 'A loop: Think → Act (call a tool) → Observe (read result) → Think again → Answer.',
    hook: 'Model thinks, tools act, memory remembers, loop repeats.',
    points: [['LLM', 'Predicts the next token; knowledge frozen at training time.'], ['Tools', 'Functions the model can call — search, code, databases.'], ['Memory', 'Short-term (context window) and long-term (stored facts).'], ['Planning', 'Break a goal into steps; revise when observations change.']],
    code: { lang: 'python', src: R`def agent(goal, llm, tools, max_steps=5):
    history = [f"Goal: {goal}"]
    for _ in range(max_steps):
        step = llm(history)                    # -> {"tool": ..., "input": ...} or {"answer": ...}
        if "answer" in step:
            return step["answer"]
        result = tools[step["tool"]](step["input"])
        history.append(f"{step['tool']}({step['input']}) -> {result}")
    return "Stopped: step limit reached"` },
    interview: 'An agent wraps an LLM in a loop with tools and memory: the model decides the next action, the system executes it, the observation goes back into context, until the goal is met or a step limit stops it. The engineering is in the guardrails — limits, validation and evals.',
    qa: [['Agent vs workflow?', 'A workflow follows fixed steps; an agent decides its own steps. Use workflows when the path is known.'], ['Why a step limit?', 'To stop infinite loops and runaway cost.']],
    uses: ['Research assistants', 'Customer support automation', 'Coding agents'],
    pitfall: 'Using an agent where a simple, predictable workflow would do.',
    idea: 'Personal AI agents that handle bureaucracy — visas, benefits, taxes — for people who need it most.',
  },
  'prompting-llm-basics': {
    big: 'Clear instructions + examples + a required output format = reliable LLM behaviour.',
    analogy: 'Briefing a brilliant new intern: context, the task, an example of good work, and the exact format you want back.',
    picture: 'A prompt as a form: Role · Context · Task · Examples · Output schema.',
    hook: 'Role, Context, Task, Example, Format — RCTEF.',
    points: [['System prompt', 'Sets role, rules and tone for the whole conversation.'], ['Few-shot', 'Show 2–3 examples; the model copies the pattern.'], ['Structured output', 'Ask for JSON matching a schema (or use tool calling) so code can parse it.'], ['Temperature', 'Low for facts and extraction, higher for creativity.']],
    code: { lang: 'python', src: R`from anthropic import Anthropic
client = Anthropic()  # reads ANTHROPIC_API_KEY

msg = client.messages.create(
    model="claude-sonnet-5-5",
    max_tokens=300,
    system="You extract structured data. Reply with JSON only.",
    messages=[{"role": "user", "content":
        'Extract {"name": str, "city": str} from: "Priya moved to Singapore last year."'}],
)
print(msg.content[0].text)   # {"name": "Priya", "city": "Singapore"}` },
    interview: 'I write prompts like specifications: a clear role, the relevant context, the task, a couple of examples, and a strict output schema — then I test them against an evaluation set rather than eyeballing a single answer.',
    qa: [['How do you get reliable JSON?', 'Tool or function calling with a schema, or JSON mode plus validation and a retry on failure.'], ['Zero-shot vs few-shot?', 'Few-shot adds examples to show the pattern — better for unusual formats or styles.']],
    uses: ['Data extraction', 'Classification', 'Summarisation'],
    pitfall: 'Vague prompts tested on one example — they break on real traffic.',
    idea: 'Plain-language programming: anyone describes software in words and gets a working tool.',
  },
  'retrieval-rag': {
    big: 'RAG lets an LLM answer from YOUR documents by retrieving relevant chunks and putting them in the prompt.',
    analogy: 'An open-book exam: instead of memorising the textbook, the student looks up the right pages, then writes the answer citing them.',
    picture: 'Docs → chunks → embeddings (points in space) → question becomes a point → nearest points pulled into the prompt.',
    hook: 'Chunk, Embed, Store, Retrieve, Rerank, Generate, Cite.',
    points: [['Chunking', 'Split docs into ~300–800 token pieces with overlap, respecting headings.'], ['Embeddings', 'Vectors where similar meaning = nearby points.'], ['Hybrid search', 'Combine keyword (BM25) and vector search for recall.'], ['Reranking', 'A cross-encoder re-scores the top results for precision.'], ['Grounding', 'Answer only from retrieved context and cite sources.']],
    code: { lang: 'python', src: R`import numpy as np
from sentence_transformers import SentenceTransformer

model = SentenceTransformer("all-MiniLM-L6-v2")
docs = ["Refunds are processed within 5 days.", "Shipping is free over $50.", "Support is open 9-5."]
D = model.encode(docs, normalize_embeddings=True)

def retrieve(q, k=2):
    qv = model.encode([q], normalize_embeddings=True)[0]
    scores = D @ qv                          # cosine similarity
    return [docs[i] for i in np.argsort(-scores)[:k]]

context = retrieve("How long do refunds take?")
prompt = "Answer only from the context, cite it.\nContext:\n" + "\n".join(context)` },
    interview: 'RAG grounds the model in our data: we chunk and embed documents into a vector store, retrieve with hybrid search, rerank for precision, and generate an answer that cites its sources. I measure retrieval recall and answer faithfulness separately so I know which half to fix.',
    qa: [['RAG vs fine-tuning?', 'RAG for fresh or private knowledge with citations; fine-tuning for style, format or behaviour.'], ['How do you evaluate RAG?', 'Retrieval: recall@k / MRR. Generation: faithfulness and answer relevance (e.g. Ragas).']],
    uses: ['Internal knowledge assistants', 'Customer support bots', 'Legal and medical document Q&A'],
    pitfall: 'Blaming the LLM when retrieval returned the wrong chunks.',
    idea: 'Every public library, court and hospital answering citizens’ questions instantly with cited sources.',
  },
  'agents-tools': {
    big: 'Agents choose and call tools in a loop; the craft is making that loop reliable and observable.',
    analogy: 'A detective: forms a hypothesis (reason), checks evidence (tool), updates the theory (observe), repeats until the case is solved.',
    picture: 'ReAct trace: Thought → Action: search("x") → Observation → Thought → Final answer.',
    hook: 'Reason, Act, Observe — then guard, log and limit.',
    points: [['Tool schema', 'Name, description, typed input — the model reads these to choose.'], ['ReAct', 'Interleave reasoning and tool calls.'], ['Plan-and-execute', 'Plan steps first, then run them — better for long tasks.'], ['Reliability', 'Validate inputs, timeouts, retries, max steps.'], ['Observability', 'Trace every step: prompt, tool, latency, cost.']],
    code: { lang: 'python', src: R`tools = [{
    "name": "get_weather",
    "description": "Current weather for a city",
    "input_schema": {"type": "object", "properties": {"city": {"type": "string"}}, "required": ["city"]},
}]

resp = client.messages.create(model="claude-sonnet-5-5", max_tokens=500, tools=tools,
    messages=[{"role": "user", "content": "Do I need an umbrella in Tokyo?"}])

for block in resp.content:
    if block.type == "tool_use":
        result = get_weather(**block.input)      # run it, then send a tool_result back
        print(block.name, block.input, "->", result)` },
    interview: 'I give the model well-described, typed tools, run a ReAct-style loop with validation, timeouts and a step budget, and trace every action so failures are debuggable. For long tasks I separate planning from execution.',
    qa: [['How do you stop agent loops?', 'Max-step and cost budgets, detecting repeated actions, and a final-answer requirement.'], ['How do tools get chosen?', 'The model reads tool names, descriptions and schemas — so clear descriptions are the main lever.']],
    uses: ['IT helpdesk automation', 'Data analysis agents', 'Booking and scheduling'],
    pitfall: 'Ten vague tools with overlapping descriptions — the model picks the wrong one.',
    idea: 'Agents that run small businesses’ back offices so owners can focus on their craft.',
  },
  'evaluation-production': {
    big: 'You cannot improve what you do not measure: evals before launch, monitoring after.',
    analogy: 'A driving test plus a dashboard: evals are the exam before getting the licence; monitoring is the dashboard warning lights on every trip.',
    picture: 'A golden dataset of questions with expected answers, scored automatically on every change — a red/green board.',
    hook: 'Golden set, metrics, gate, monitor, improve.',
    points: [['Golden dataset', 'Real questions with reference answers or rubrics.'], ['Metrics', 'Accuracy, faithfulness, latency, cost, refusal rate.'], ['LLM-as-judge', 'A model grades outputs with a rubric; spot-check it against humans.'], ['Regression gate', 'CI blocks deploys if scores drop.'], ['Hardening', 'Rate limits, fallbacks, caching, PII filtering.']],
    code: { lang: 'python', src: R`golden = [
    {"q": "Refund window?", "must_include": "5 days"},
    {"q": "Free shipping threshold?", "must_include": "$50"},
]

def evaluate(answer_fn):
    passed = sum(case["must_include"] in answer_fn(case["q"]) for case in golden)
    score = passed / len(golden)
    assert score >= 0.9, f"Eval gate failed: {score:.0%}"   # block the deploy
    return score` },
    interview: 'I build a golden dataset from real traffic, score every change automatically — deterministic checks plus an LLM judge calibrated against human labels — and gate deployments on it. In production I monitor quality, latency and cost, and feed failures back into the dataset.',
    qa: [['How do you trust LLM-as-judge?', 'Calibrate it on human-labelled samples, use clear rubrics, and monitor agreement.'], ['What do you monitor in prod?', 'Latency percentiles, error rate, cost per request, user feedback and drift in inputs.']],
    uses: ['Safe model upgrades', 'Prompt changes without regressions', 'Compliance evidence'],
    pitfall: '“Vibes-based” evaluation on five handpicked examples.',
    idea: 'Public, transparent eval leaderboards for AI used in health, law and education.',
  },
  'fde-capstone': {
    big: 'Forward-deployed engineering: sit with the customer, find the real problem, ship a working AI system end to end.',
    analogy: 'A field doctor: diagnose on site, treat with what you have, follow up until the patient is well.',
    picture: 'The capstone pipeline: schema + mock data → tools → agent loop → RAG → safety gate → evals → go live.',
    hook: 'Discover, Mock, Build, Guard, Evaluate, Ship.',
    points: [['Discovery', 'Find the painful workflow and the success metric.'], ['Mock first', 'Fake data and tools to prove the flow before real integrations.'], ['Agent + RAG', 'Tools for actions, retrieval for knowledge.'], ['Safety gate', 'Policy checks before any irreversible action.'], ['Go real', 'Swap mocks for real systems behind the same interfaces.']],
    code: { lang: 'python', src: R`from typing import Protocol

class TicketStore(Protocol):
    def create(self, title: str, body: str) -> str: ...

class MockTickets:                      # day 1: prove the flow
    def create(self, title, body): return "MOCK-1"

class JiraTickets:                      # later: same interface, real system
    def create(self, title, body): ...  # call Jira REST API

def handle(issue: str, store: TicketStore):
    if "delete" in issue.lower():
        return "Needs human approval"   # safety gate
    return store.create("Auto triage", issue)` },
    interview: 'My method is discover, mock, build, guard, evaluate, ship: I define the success metric with the customer, prove the flow with mocks behind clean interfaces, add the agent and retrieval, put a safety gate before risky actions, gate releases on evals, then swap in real integrations.',
    qa: [['Why mock first?', 'You validate the workflow and UX in days without waiting on access to real systems.'], ['What is a safety gate?', 'A deterministic check or human approval before irreversible or sensitive actions.']],
    uses: ['Enterprise pilots', 'Internal copilots', 'Workflow automation'],
    pitfall: 'Building the impressive demo instead of the boring workflow users actually do every day.',
    idea: 'Engineers embedded in hospitals, NGOs and governments turning AI into measurable public good.',
  },
  'specialized-topics': {
    big: 'Key specialist skills: LLM security, multimodal models, MCP, choosing fine-tune vs RAG vs prompt, and SQL.',
    analogy: 'A Swiss army knife: each blade is a specialist tool you reach for when the job needs it.',
    picture: 'A decision tree: Need new knowledge? → RAG. Need new behaviour/format? → fine-tune. Neither? → better prompt.',
    hook: 'Prompt first, RAG for knowledge, fine-tune for behaviour, MCP for tools, guard everything.',
    points: [['Prompt injection', 'Untrusted text trying to override instructions — isolate and filter it.'], ['Multimodal', 'Models that read images, PDFs and audio alongside text.'], ['MCP', 'A standard way to plug tools and data into any AI app.'], ['SQL', 'Still the language of business data — agents query it too.']],
    code: { lang: 'python', src: R`# A tiny MCP server exposing one tool (Python MCP SDK)
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("orders")

@mcp.tool()
def order_status(order_id: str) -> str:
    """Return the shipping status for an order id."""
    return {"A1": "shipped", "B2": "processing"}.get(order_id, "not found")

if __name__ == "__main__":
    mcp.run()` },
    interview: 'I reach for the cheapest fix first — prompting — then RAG when the model lacks knowledge, and fine-tuning only for consistent behaviour or format. I expose tools via MCP so any client can use them, and I treat all retrieved or user content as untrusted input.',
    qa: [['What is MCP?', 'Model Context Protocol — an open standard for connecting AI apps to tools, data and prompts through servers.'], ['How do you defend against prompt injection?', 'Separate instructions from data, least-privilege tools, output filtering, human approval for risky actions.']],
    uses: ['Plugging company tools into assistants', 'Reading invoices and charts', 'Text-to-SQL analytics'],
    pitfall: 'Fine-tuning to add facts — it is expensive and still hallucinates; use RAG.',
    idea: 'A universal “USB port for AI” so every tool works with every assistant.',
  },
  'claude-anthropic': {
    big: 'Claude models, the Messages API, Claude Code for agentic development, and MCP integration.',
    analogy: 'Claude is a senior colleague; the API is how your software talks to them; Claude Code lets them work directly in your codebase.',
    picture: 'Model family as a car lineup: Haiku = fast city car, Sonnet = all-rounder, Opus = heavy-duty truck for the hardest jobs.',
    hook: 'Haiku fast, Sonnet balanced, Opus deepest — pick by task.',
    points: [['Model choice', 'Haiku 5.5 for volume/latency, Sonnet 5.5 balanced, Opus 5.5 for hardest reasoning.'], ['Messages API', 'system + alternating user/assistant messages; tools; streaming.'], ['Claude Code', 'Terminal agent that reads, edits, runs and tests your repo.'], ['MCP', 'Connect Claude to your tools and data.']],
    code: { lang: 'python', src: R`from anthropic import Anthropic
client = Anthropic()

with client.messages.stream(
    model="claude-haiku-5-5", max_tokens=200,
    messages=[{"role": "user", "content": "Explain RAG in one sentence."}],
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)` },
    interview: 'I choose the Claude model per task — Haiku for high-volume, low-latency work, Sonnet as the default, Opus for the hardest reasoning — stream responses for UX, and use Claude Code with MCP servers to automate engineering workflows safely.',
    qa: [['How do you control cost?', 'Right-size the model, prompt caching for repeated context, batching for offline work, and token budgets.'], ['What does Claude Code add?', 'An agent that can explore, edit, run and test code in your repository with permissions and hooks.']],
    uses: ['Coding assistance', 'Document analysis', 'Customer-facing assistants'],
    pitfall: 'Using the biggest model for every request.',
    idea: 'A tireless expert colleague available to every small team in every country.',
  },
  'anthropic-api-in-practice': {
    big: 'Production features of the Anthropic API: batching, prompt caching, files and vision, token counting, server tools and the Agent SDK.',
    analogy: 'Running a restaurant efficiently: batch cooking (Batches API), prep once and reuse (prompt caching), reading the order slip (vision/PDF), counting ingredients (tokens).',
    picture: 'A long system prompt with a bookmark — everything before the bookmark is cached and reused cheaply.',
    hook: 'Cache the repeated, batch the offline, count before you send.',
    points: [['Message Batches', 'Async bulk jobs at lower cost.'], ['Prompt caching', 'Mark a stable prefix with cache_control to cut cost and latency.'], ['Files, vision & PDF', 'Send images and documents as content blocks.'], ['Token counting', 'Estimate cost and fit before sending.'], ['Agent SDK', 'Build agents on the Claude Code harness.']],
    code: { lang: 'python', src: R`resp = client.messages.create(
    model="claude-sonnet-5-5", max_tokens=400,
    system=[{
        "type": "text",
        "text": LONG_POLICY_MANUAL,                 # thousands of tokens, reused
        "cache_control": {"type": "ephemeral"},    # cache this prefix
    }],
    messages=[{"role": "user", "content": "Can I refund after 30 days?"}],
)
print(resp.usage)   # shows cache_creation / cache_read input tokens` },
    interview: 'In production I cache long, stable context with prompt caching, push offline workloads through the Batches API, count tokens up front to control cost and context limits, and use the Agent SDK when I need a full agent harness rather than single calls.',
    qa: [['When does prompt caching help?', 'When many requests share a long identical prefix — system prompts, documents, tool definitions.'], ['When use batches?', 'Large non-urgent jobs like classification or evals where latency does not matter.']],
    uses: ['Bulk document classification', 'Chat over long manuals', 'Invoice and receipt reading'],
    pitfall: 'Putting changing content before the cache breakpoint — the cache never hits.',
    idea: 'AI so cheap per request that every NGO can afford it for millions of people.',
  },
  'anthropic-skills': {
    big: 'Working with Claude Code at a professional level: automation, Skills, subagents, MCP, cloud deployment and AI fluency.',
    analogy: 'Training a capable apprentice: Skills are recipe cards, subagents are helpers for side-tasks, hooks are house rules that always apply.',
    picture: 'A project folder with CLAUDE.md (house rules), .claude/skills (recipe cards) and .claude/agents (specialist helpers).',
    hook: 'Memory for context, Skills for recipes, Subagents for focus, Hooks for rules, MCP for reach.',
    points: [['CLAUDE.md', 'Project memory: conventions, commands, architecture.'], ['Skills', 'Reusable instruction packs loaded when relevant.'], ['Subagents', 'Focused agents with their own context for research or review.'], ['Hooks', 'Deterministic commands on events (e.g. run tests after edits).'], ['AI fluency', 'Delegation, description, discernment, diligence.']],
    code: { lang: 'markdown', src: R`---
name: release-notes
description: Write release notes from merged PRs since the last tag
---
1. Run: git log $(git describe --tags --abbrev=0)..HEAD --oneline
2. Group commits into Features, Fixes, Chores.
3. Write user-facing notes in plain language; link PR numbers.` },
    interview: 'I encode team knowledge into Claude Code: CLAUDE.md for conventions, Skills for repeatable workflows, subagents for focused review or research, hooks for guaranteed checks like tests and linting, and MCP for access to our systems — so results are consistent, not luck.',
    qa: [['Skill vs subagent?', 'A Skill is instructions loaded into context when relevant; a subagent is a separate agent with its own context window and tools.'], ['Why hooks?', 'They run deterministically every time — the model cannot forget them.']],
    uses: ['Automated code review', 'Release workflows', 'Team onboarding'],
    pitfall: 'Huge CLAUDE.md files full of stale instructions.',
    idea: 'Every expert’s know-how packaged as Skills, shared freely like open-source libraries.',
  },
  'no-code-agentic-ai': {
    big: 'Build agentic automations visually with n8n, Zapier, Make and Flowise — no code required.',
    analogy: 'Plumbing with pre-made pipes: trigger at one end, connected nodes in the middle, action at the other end.',
    picture: 'A canvas of boxes: “New email” → “AI classify” → “If urgent” → “Slack alert” / “Create ticket”.',
    hook: 'Trigger → Think → Branch → Act → Log.',
    points: [['Triggers', 'Webhook, schedule, new row, new email.'], ['AI nodes', 'Classify, extract, summarise, or run an agent with tools.'], ['Branching', 'Route by condition or model output.'], ['Limits', 'Great for prototypes and ops; move to code for complex logic and scale.']],
    code: { lang: 'json', src: R`{
  "trigger": "gmail.new_email",
  "steps": [
    {"node": "ai.classify", "labels": ["urgent", "billing", "other"]},
    {"node": "if", "condition": "label == 'urgent'",
     "then": [{"node": "slack.post", "channel": "#oncall"}],
     "else": [{"node": "sheets.append_row"}]}
  ]
}` },
    interview: 'For operations teams I prototype automations in n8n or Make — trigger, AI step, branch, action — which proves value in hours. When logic grows complex or volume grows large I move it into code with tests and proper observability.',
    qa: [['When not to use no-code?', 'Complex logic, strict testing needs, high volume, or sensitive data that cannot leave your infrastructure.'], ['n8n vs Zapier?', 'n8n is open-source and self-hostable; Zapier is fully hosted with a huge app catalogue.']],
    uses: ['Email triage', 'Lead enrichment', 'Report generation'],
    pitfall: 'Business-critical flows with no error handling or alerts.',
    idea: 'Every shopkeeper building their own AI assistant in an afternoon.',
  },
  'langchain-langgraph': {
    big: 'LangChain composes LLM building blocks; LangGraph models agents as stateful graphs with loops, routing and human approval.',
    analogy: 'LangChain is a box of LEGO pieces; LangGraph is the instruction booklet with arrows — including arrows that loop back.',
    picture: 'A flowchart: nodes are steps, edges are arrows, a shared state object travels along them.',
    hook: 'State flows, nodes work, edges route, checkpoints remember.',
    points: [['Runnables / LCEL', 'Compose prompt | model | parser pipelines.'], ['StateGraph', 'Typed state + nodes + edges, including cycles.'], ['Conditional edges', 'Route to the next node based on state.'], ['Persistence', 'Checkpointers save state for resume and human-in-the-loop.']],
    code: { lang: 'python', src: R`from typing import TypedDict
from langgraph.graph import StateGraph, END

class S(TypedDict):
    question: str
    answer: str

def retrieve(s): return {"answer": f"docs about {s['question']}"}
def generate(s): return {"answer": f"Final: {s['answer']}"}

g = StateGraph(S)
g.add_node("retrieve", retrieve)
g.add_node("generate", generate)
g.set_entry_point("retrieve")
g.add_edge("retrieve", "generate")
g.add_edge("generate", END)
print(g.compile().invoke({"question": "RAG", "answer": ""}))` },
    interview: 'I use LangGraph when an agent needs explicit control flow: a typed state, nodes for each step, conditional edges for routing and loops, and a checkpointer so long runs can pause for human approval and resume reliably.',
    qa: [['Why a graph instead of a loop?', 'Explicit, testable control flow — you can see and constrain every path the agent can take.'], ['What is human-in-the-loop?', 'Pausing at a node for a person to approve or edit before continuing.']],
    uses: ['Multi-step support agents', 'Approval workflows', 'Research pipelines'],
    pitfall: 'Over-abstracting a simple call into many chains — keep it plain when it is simple.',
    idea: 'Transparent AI decision flows that regulators and citizens can actually inspect.',
  },
  'multi-agent-orchestration': {
    big: 'Several specialised agents collaborate — researcher, writer, critic — coordinated by roles or a supervisor.',
    analogy: 'A film crew: the director (supervisor) assigns the camera, sound and editing teams, then reviews the cut.',
    picture: 'A supervisor node in the middle with arrows to specialist agents, results flowing back for review.',
    hook: 'Specialise, coordinate, critique, combine.',
    points: [['Roles', 'Each agent has a narrow job, tools and prompt.'], ['Supervisor', 'Routes tasks and merges results.'], ['Debate / critique', 'One agent checks another to raise quality.'], ['Agentic & GraphRAG', 'Agents decide what and how to retrieve; graphs capture relationships.'], ['Cost', 'More agents = more tokens and latency — justify each one.']],
    code: { lang: 'python', src: R`from crewai import Agent, Task, Crew

researcher = Agent(role="Researcher", goal="Find key facts", backstory="Thorough analyst")
writer = Agent(role="Writer", goal="Write a clear brief", backstory="Concise editor")

research = Task(description="Research AI in healthcare 2026", expected_output="5 bullet facts", agent=researcher)
brief = Task(description="Write a 150-word brief from the facts", expected_output="A brief", agent=writer)

print(Crew(agents=[researcher, writer], tasks=[research, brief]).kickoff())` },
    interview: 'I split work across agents only when roles are genuinely different — research, writing, review — with a supervisor routing tasks and a critic checking output. I measure whether the extra agents improve quality enough to justify their cost and latency.',
    qa: [['When is multi-agent worth it?', 'When subtasks need different tools or expertise, or parallelism helps; otherwise one agent is simpler and cheaper.'], ['What is GraphRAG?', 'RAG over a knowledge graph of entities and relationships, good for multi-hop questions.']],
    uses: ['Research reports', 'Code generation with review', 'Due-diligence analysis'],
    pitfall: 'Agents endlessly chatting with each other — set turn limits and clear exit criteria.',
    idea: 'AI research teams that read every paper on a disease overnight and propose experiments.',
  },
  'mlops-llmops': {
    big: 'Run ML and LLM systems like products: versioned, reproducible, monitored, governed.',
    analogy: 'A factory production line with quality control at every station and a logbook of every batch.',
    picture: 'A loop: data → train/prompt → evaluate → register → deploy → monitor → back to data.',
    hook: 'Version everything, evaluate always, monitor forever.',
    points: [['Versioning', 'Data, code, models and prompts all versioned.'], ['Registry', 'Approved models with lineage and metrics.'], ['Serving', 'Containers, autoscaling, canary rollouts.'], ['Monitoring', 'Drift, quality, latency, cost.'], ['Governance', 'Audit trails, approvals, access control.']],
    code: { lang: 'python', src: R`import mlflow

with mlflow.start_run(run_name="rag-v3"):
    mlflow.log_params({"chunk_size": 512, "top_k": 5, "model": "claude-sonnet-5-5"})
    mlflow.log_metrics({"faithfulness": 0.91, "p95_latency_ms": 1800, "cost_per_q": 0.004})
    mlflow.log_artifact("prompts/answer.txt")    # the prompt is a versioned artifact` },
    interview: 'I treat prompts, retrieval configs and models as versioned artifacts, track every experiment with its metrics, promote through a registry with approvals, deploy with canaries, and monitor quality, drift, latency and cost so we can roll back quickly.',
    qa: [['MLOps vs LLMOps?', 'LLMOps adds prompts, retrieval, guardrails, token cost and LLM-specific evaluation to classic MLOps.'], ['What is drift?', 'Production inputs or outcomes shifting away from what the system was evaluated on.']],
    uses: ['Model upgrades without surprises', 'Audit-ready AI', 'Cost control'],
    pitfall: 'Prompts edited directly in production with no version or eval.',
    idea: 'Trustworthy AI infrastructure for public services, auditable by anyone.',
  },
  'ai-assisted-development': {
    big: 'Use AI coding tools — Cursor, Copilot, Antigravity, Amazon Q, Claude Code — to build faster without losing quality.',
    analogy: 'Pair programming with a fast junior who never tires: you set direction and review; it types and drafts.',
    picture: 'You hold the steering wheel (specs, tests, review); the AI presses the accelerator (drafting code).',
    hook: 'Spec it, generate it, test it, review it.',
    points: [['Vibe coding', 'Describe intent, iterate quickly — great for prototypes.'], ['Context', 'Give rules files, relevant files and examples.'], ['Tests as guardrails', 'Let AI write code against tests you trust.'], ['Review', 'You own every line that ships.']],
    code: { lang: 'markdown', src: R`# .cursor/rules/backend.mdc
- Python 3.12, FastAPI, Pydantic v2
- Every endpoint: typed request/response models + pytest test
- Never log secrets or PII
- Prefer small pure functions; no global state` },
    interview: 'I use AI coding tools with clear project rules and tests as guardrails: describe the change, let the tool draft it, run the tests, then review the diff carefully. It speeds me up most on boilerplate, migrations and test writing — never at the cost of understanding the code.',
    qa: [['Risks of AI-generated code?', 'Subtle bugs, security issues, licence concerns and code nobody understands — mitigated by tests and review.'], ['How do you give good context?', 'Rules files, pointing at relevant files, and examples of the style you want.']],
    uses: ['Rapid prototypes', 'Test generation', 'Large refactors'],
    pitfall: 'Accepting large diffs you have not read.',
    idea: 'Anyone with an idea can build software — the bottleneck becomes imagination, not syntax.',
  },
  'interoperability-agent-ops': {
    big: 'Agents talk to tools (MCP), to each other (A2A, ACP, ANP), and are traced and guarded in production.',
    analogy: 'International airports: MCP is the standard plug for gate equipment, A2A is air-traffic control between airlines, tracing is the flight recorder.',
    picture: 'Agents from different vendors exchanging “Agent Cards” and tasks over a common protocol.',
    hook: 'MCP for tools, A2A for agents, traces for truth, guardrails for safety.',
    points: [['MCP', 'Standard client–server protocol for tools and context.'], ['A2A', 'Agents advertise capabilities and delegate tasks to each other.'], ['Tracing', 'LangSmith / OpenTelemetry spans for every step.'], ['Guardrails', 'NeMo Guardrails / Guardrails AI validate inputs and outputs.']],
    code: { lang: 'json', src: R`{
  "name": "invoice-agent",
  "description": "Extracts and validates invoice data",
  "url": "https://agents.example.com/invoice",
  "skills": [{ "id": "extract", "name": "Extract invoice fields" }],
  "capabilities": { "streaming": true }
}` },
    interview: 'For interoperability I expose tools through MCP and let agents collaborate across vendors with A2A, publishing an Agent Card that describes their skills. In operations every step is traced, and guardrails validate inputs and outputs so multi-agent systems stay debuggable and safe.',
    qa: [['MCP vs A2A?', 'MCP connects an agent to tools and data; A2A connects agents to other agents.'], ['Why tracing?', 'Agent failures are multi-step — you need the full trail of prompts, tool calls and outputs to debug.']],
    uses: ['Cross-company agent workflows', 'Enterprise tool hubs', 'Audit trails'],
    pitfall: 'No trace IDs — impossible to reconstruct what an agent actually did.',
    idea: 'An “internet of agents” where services cooperate for people across every border.',
  },
  'data-app-building': {
    big: 'Turn data into insight and apps: NumPy/Pandas for wrangling, plots for understanding, FastAPI for APIs, Streamlit/Gradio for UIs.',
    analogy: 'A kitchen: Pandas chops ingredients, Matplotlib plates the dish, FastAPI is the delivery service, Streamlit is the dining room.',
    picture: 'A CSV flows into a DataFrame, becomes a chart, then a live web app in 20 lines.',
    hook: 'Load, clean, plot, serve, share.',
    points: [['NumPy', 'Fast vectorised arrays.'], ['Pandas', 'Tables: filter, group, join, aggregate.'], ['Visualisation', 'Show distributions and trends before modelling.'], ['FastAPI', 'Typed, async APIs with automatic docs.'], ['Streamlit / Gradio', 'Interactive UIs for demos and internal tools.']],
    code: { lang: 'python', src: R`import pandas as pd
from fastapi import FastAPI

df = pd.DataFrame({"city": ["SG", "SG", "NY"], "sales": [120, 80, 200]})
summary = df.groupby("city")["sales"].sum().to_dict()

app = FastAPI()

@app.get("/sales/{city}")
def sales(city: str):
    return {"city": city, "total": summary.get(city, 0)}
# run: uvicorn app:app --reload   ->  http://127.0.0.1:8000/docs` },
    interview: 'I explore data in Pandas, visualise it before modelling, then expose results through a typed FastAPI service and a Streamlit or Gradio front end so stakeholders can try it immediately.',
    qa: [['Why vectorise?', 'NumPy operations run in optimised C — orders of magnitude faster than Python loops.'], ['FastAPI advantages?', 'Type-checked request/response models, async support and automatic OpenAPI docs.']],
    uses: ['Dashboards', 'Model demos', 'Data APIs'],
    pitfall: 'Iterating over DataFrame rows in Python loops.',
    idea: 'Open data apps that let citizens see exactly how public money is spent.',
  },
  'prompt-context-engineering': {
    big: 'Context engineering = deciding exactly what the model sees — instructions, data, memory, tools — and optimising it systematically.',
    analogy: 'Packing a suitcase for a trip: only what is needed, organised, nothing that makes it overweight.',
    picture: 'A context window as a budgeted page: instructions at top, retrieved facts in the middle, the question last.',
    hook: 'Right info, right order, right size — then measure.',
    points: [['Advanced prompting', 'Chain-of-thought, self-consistency, decomposition.'], ['Context budget', 'Prioritise, summarise and trim to fit and reduce cost.'], ['Memory', 'Summaries of past turns; retrieved long-term facts.'], ['DSPy', 'Optimise prompts automatically against a metric.']],
    code: { lang: 'python', src: R`import dspy

class QA(dspy.Signature):
    """Answer the question using the context."""
    context: str = dspy.InputField()
    question: str = dspy.InputField()
    answer: str = dspy.OutputField()

qa = dspy.ChainOfThought(QA)
# optimizer = dspy.MIPROv2(metric=my_metric); qa = optimizer.compile(qa, trainset=examples)` },
    interview: 'I treat the context window as a budget: put stable instructions first so they can be cached, include only the most relevant retrieved facts, summarise older conversation, and when quality matters I optimise prompts against a metric with tools like DSPy instead of hand-tweaking.',
    qa: [['Prompt vs context engineering?', 'Prompt engineering is the wording; context engineering is choosing and arranging everything the model sees.'], ['Why does more context hurt?', 'Irrelevant text distracts the model, raises cost and latency.']],
    uses: ['Long-running assistants', 'Customer support memory', 'Agent tool selection'],
    pitfall: 'Stuffing the entire knowledge base into every prompt.',
    idea: 'Assistants that remember what matters about you — and forget what you ask them to.',
  },
  'nlp-transformers': {
    big: 'From bag-of-words to transformers: how machines learned to represent and generate language.',
    analogy: 'Attention is a cocktail party: every word listens to every other word and turns up the volume on the ones that matter to it.',
    picture: 'Each word becomes a vector; attention draws weighted lines between all words; layers stack to build meaning.',
    hook: 'Tokens → embeddings → attention → layers → next token.',
    points: [['Tokenisation', 'Text split into sub-word tokens.'], ['Embeddings', 'Words as vectors capturing meaning.'], ['RNN/LSTM', 'Sequential models — slow, forgetful on long text.'], ['Self-attention', 'Every token looks at every other token in parallel.'], ['LLMs', 'Huge transformers trained to predict the next token.']],
    code: { lang: 'python', src: R`import numpy as np

def attention(Q, K, V):
    scores = Q @ K.T / np.sqrt(K.shape[-1])          # similarity of each query to each key
    weights = np.exp(scores) / np.exp(scores).sum(-1, keepdims=True)   # softmax
    return weights @ V                                # weighted mix of values

x = np.random.rand(4, 8)          # 4 tokens, 8-dim embeddings
print(attention(x, x, x).shape)   # (4, 8)` },
    interview: 'Transformers replaced recurrence with self-attention: each token computes how much to attend to every other token, in parallel, which captures long-range context and scales on GPUs. Stack many layers, train to predict the next token on huge corpora, and you get an LLM.',
    qa: [['Why divide by √d?', 'To keep dot products from growing large, which would saturate the softmax.'], ['Encoder vs decoder?', 'Encoders read the whole input (classification, embeddings); decoders generate token by token (LLMs).']],
    uses: ['Translation', 'Sentiment analysis', 'Search embeddings'],
    pitfall: 'Ignoring tokenisation — cost, limits and odd behaviour all come from tokens.',
    idea: 'Every endangered language preserved and taught by AI that truly understands it.',
  },
  'aws-ai-automation': {
    big: 'Build and run AI on AWS: Bedrock models and agents, Knowledge Bases, guardrails, SageMaker, document AI and serverless orchestration.',
    analogy: 'AWS is a city of utilities: Bedrock is the power plant of models, Lambda the taxis, Step Functions the traffic lights, S3 the warehouse.',
    picture: 'S3 upload → Lambda → Textract extracts text → Bedrock summarises → DynamoDB stores → API Gateway serves.',
    hook: 'Bedrock to think, Lambda to run, Step Functions to coordinate, S3 to store, IaC to repeat.',
    points: [['Bedrock', 'Managed access to Claude and other models.'], ['Knowledge Bases', 'Managed RAG over your S3 data.'], ['Bedrock Agents & Guardrails', 'Tool use with policy controls.'], ['SageMaker', 'Train, deploy and pipeline custom models.'], ['IaC', 'Terraform / CDK make infrastructure reviewable and repeatable.']],
    code: { lang: 'python', src: R`import boto3, json

bedrock = boto3.client("bedrock-runtime", region_name="us-east-1")
body = {"anthropic_version": "bedrock-2023-05-31", "max_tokens": 200,
        "messages": [{"role": "user", "content": "Summarise: invoices are due in 30 days."}]}
resp = bedrock.invoke_model(modelId=CLAUDE_MODEL_ID_ON_BEDROCK, body=json.dumps(body))
print(json.loads(resp["body"].read())["content"][0]["text"])` },
    interview: 'On AWS I use Bedrock for managed model access with Guardrails, Knowledge Bases for managed RAG over S3, Lambda and Step Functions to orchestrate document and agent workflows, SageMaker when we need custom models, and Terraform or CDK so everything is reproducible and reviewed.',
    qa: [['Bedrock vs SageMaker?', 'Bedrock = managed foundation models via API; SageMaker = build, train and host your own models.'], ['How do you control AWS AI cost?', 'Right-size models, cache, batch, set budgets and alarms, and tag every resource.']],
    uses: ['Document intelligence', 'Support agents', 'Enterprise RAG platforms'],
    pitfall: 'Clicking resources together in the console — undocumented and unrepeatable.',
    idea: 'Disaster-relief document processing that clears aid claims in minutes, not months.',
  },
  'frontier-agent-capabilities': {
    big: 'The frontier: voice and realtime agents, computer use, reasoning models, long-term memory and modern agent SDKs.',
    analogy: 'Giving the assistant senses and hands: ears and voice (realtime), eyes and mouse (computer use), a notebook (memory), and time to think (reasoning).',
    picture: 'An agent watching a screen, moving the cursor, speaking with a user, and writing notes to remember later.',
    hook: 'Hear, see, think longer, remember, act.',
    points: [['Realtime voice', 'Low-latency speech in and out with interruption handling.'], ['Computer use', 'Agents operate GUIs and browsers via screenshots and actions.'], ['Test-time compute', 'Spending more reasoning tokens on harder problems.'], ['Long-term memory', 'Store and retrieve facts across sessions.'], ['Advanced retrieval', 'Query rewriting, multi-hop, evaluated RAG.']],
    code: { lang: 'python', src: R`memory = {}   # swap for a vector DB in production

def remember(user, fact):
    memory.setdefault(user, []).append(fact)

def recall(user, query, k=3):
    facts = memory.get(user, [])
    return [f for f in facts if any(w in f.lower() for w in query.lower().split())][:k]

remember("priya", "Prefers answers in Tamil")
remember("priya", "Works on RAG for legal docs")
print(recall("priya", "legal RAG question"))` },
    interview: 'Frontier agents combine realtime voice, computer use for systems without APIs, reasoning modes for hard problems and long-term memory for personalisation. The engineering challenge is the same as always — latency budgets, safety around actions, and evaluations — just with higher stakes.',
    qa: [['Risks of computer use?', 'Unintended actions and prompt injection from web pages — use sandboxes, allow-lists and confirmations.'], ['When use reasoning modes?', 'Multi-step maths, planning and code where accuracy beats latency.']],
    uses: ['Voice receptionists', 'Legacy-app automation', 'Personal assistants with memory'],
    pitfall: 'Letting a computer-use agent act on a real account without a sandbox or confirmation.',
    idea: 'Voice agents that let people who cannot read or type use every digital service.',
  },
  'ml-systems-internals': {
    big: 'How models really run: GPU memory, distributed training, attention kernels, multi-GPU serving and throughput economics.',
    analogy: 'A GPU is a stadium of tiny workers; memory is the stadium’s parking lot — usually the real bottleneck.',
    picture: 'Model weights + KV-cache + activations stacked inside a GPU’s memory bar — if it overflows, you shard across GPUs.',
    hook: 'Memory first, then bandwidth, then compute.',
    points: [['Model memory', 'Params × bytes per param (fp16 = 2 bytes) + KV-cache + activations.'], ['Data / tensor / pipeline parallelism', 'Split batches, layers or matrices across GPUs.'], ['Attention kernels', 'FlashAttention reduces memory traffic.'], ['Serving', 'Batching, KV-cache management and parallelism for throughput.'], ['Economics', 'Cost per million tokens = GPU $/hr ÷ tokens/hr.']],
    code: { lang: 'python', src: R`def weights_gb(params_billion, bytes_per_param=2):        # fp16/bf16 = 2 bytes
    return params_billion * 1e9 * bytes_per_param / 1e9

def cost_per_million_tokens(gpu_dollars_per_hour, tokens_per_second):
    return gpu_dollars_per_hour / (tokens_per_second * 3600) * 1e6

print(weights_gb(70), "GB just for a 70B model's weights in fp16")      # 140.0
print(round(cost_per_million_tokens(4.0, 2500), 2), "$ per 1M tokens")` },
    interview: 'I size deployments from memory first: weights at the chosen precision, plus KV-cache that grows with batch and context length. Then I pick parallelism — tensor parallel inside a node, pipeline or data parallel across nodes — and optimise throughput with batching and efficient attention, tracking cost per million tokens.',
    qa: [['Why is inference memory-bound?', 'Each generated token reads all weights from memory; arithmetic is cheap compared to that bandwidth.'], ['Tensor vs data parallelism?', 'Tensor splits each layer’s matrices across GPUs; data parallel copies the model and splits the batch.']],
    uses: ['Capacity planning', 'Serving cost reduction', 'Training large models'],
    pitfall: 'Forgetting the KV-cache — it can exceed the weights at long context.',
    idea: 'AI efficient enough to run on solar-powered devices in every village.',
  },
  'research-frontier-eng': {
    big: 'Research-grade engineering: custom GPU kernels, RLHF/DPO, large-scale training, novel agents and interpretability.',
    analogy: 'Moving from driving the car to building the engine and tuning the gearbox yourself.',
    picture: 'A preference pair — answer A preferred over answer B — nudging the model toward human-preferred behaviour.',
    hook: 'Kernel for speed, preferences for alignment, probes for understanding.',
    points: [['Triton kernels', 'Write fused GPU ops in Python-like syntax.'], ['RLHF', 'Reward model from human preferences + RL fine-tuning.'], ['DPO', 'Optimise directly on preference pairs — simpler than RLHF.'], ['Interpretability', 'Probe internal features to understand behaviour.']],
    code: { lang: 'python', src: R`import torch.nn.functional as F

def dpo_loss(pol_chosen, pol_rejected, ref_chosen, ref_rejected, beta=0.1):
    # inputs: summed log-probs of chosen / rejected answers under policy and reference
    logits = beta * ((pol_chosen - ref_chosen) - (pol_rejected - ref_rejected))
    return -F.logsigmoid(logits).mean()` },
    interview: 'DPO aligns a model directly on preference pairs: it increases the likelihood of the preferred answer relative to a frozen reference model, avoiding a separate reward model and RL loop. For speed I profile first and only write custom Triton kernels for hot, fusible operations.',
    qa: [['RLHF vs DPO?', 'RLHF trains a reward model then optimises with RL; DPO optimises the policy directly from preferences — simpler and more stable.'], ['Why a reference model?', 'It keeps the tuned model from drifting too far from its original abilities.']],
    uses: ['Aligning assistants', 'Speeding up training', 'Safety research'],
    pitfall: 'Optimising kernels before profiling where time actually goes.',
    idea: 'Understandable AI — opening the black box so we can trust what models do.',
  },
  'advanced-challenges': {
    big: 'Real-world challenge drills: debug broken RAG and agents, design under constraints, run post-mortems, defend trade-offs.',
    analogy: 'Flight-simulator training: practise the emergencies so the real ones feel routine.',
    picture: 'A fault tree: symptom at the top, branches for retrieval, prompt, tool, model and data causes.',
    hook: 'Reproduce, isolate, measure, fix, prevent.',
    points: [['Debug RAG', 'Check retrieval before generation — is the right chunk even there?'], ['Debug agents', 'Read the trace; find the first wrong decision.'], ['Constraints', 'Design for the budget, latency and compliance you actually have.'], ['Post-mortems', 'Blameless timeline, root cause, action items.'], ['Trade-offs', 'State options, criteria and why you chose.']],
    code: { lang: 'python', src: R`def diagnose_rag(question, expected_doc_id, retrieve, generate):
    hits = retrieve(question, k=10)
    ids = [h["id"] for h in hits]
    if expected_doc_id not in ids:
        return "RETRIEVAL failure: fix chunking, embeddings, or add hybrid search"
    rank = ids.index(expected_doc_id)
    if rank > 3:
        return f"RANKING issue (rank {rank}): add a reranker"
    return "GENERATION issue: tighten prompt / grounding" if not generate(question, hits) else "OK"` },
    interview: 'I debug by isolating stages: for RAG I first check whether the right document was retrieved, then its rank, then generation; for agents I walk the trace to the first wrong decision. Every incident ends with a blameless post-mortem and a regression test so it cannot recur.',
    qa: [['First step when RAG answers are wrong?', 'Check retrieval — print the retrieved chunks for the failing question.'], ['What makes a good post-mortem?', 'Blameless timeline, impact, root cause, contributing factors and owned action items.']],
    uses: ['On-call readiness', 'Senior interviews', 'Architecture reviews'],
    pitfall: 'Changing three things at once and not knowing which fixed it.',
    idea: 'A public library of AI failures so every team learns from everyone’s mistakes.',
  },
  'inference-cost': {
    big: 'Make models faster and cheaper: quantisation, KV-cache, batching, speculative decoding and serving engines.',
    analogy: 'A delivery company: bigger vans (batching), lighter packages (quantisation), remembered routes (KV-cache), a scout predicting stops (speculative decoding).',
    picture: 'A small draft model racing ahead guessing tokens, the big model checking several at once.',
    hook: 'Smaller numbers, fuller batches, cached keys, guessed tokens.',
    points: [['Latency vs throughput', 'Per-user speed vs total tokens per second.'], ['Quantisation', 'INT8/INT4 weights: less memory, faster, small quality loss.'], ['KV-cache', 'Reuse attention keys/values of previous tokens.'], ['Continuous batching', 'Add and remove requests mid-flight.'], ['Speculative decoding', 'Draft model proposes, big model verifies.']],
    code: { lang: 'bash', src: R`# vLLM: continuous batching + paged KV-cache out of the box
pip install vllm
vllm serve Qwen/Qwen2.5-7B-Instruct --max-model-len 8192 --gpu-memory-utilization 0.9
# OpenAI-compatible API on :8000 — measure tokens/sec and p95 latency under load` },
    interview: 'I tune inference against a target — latency or throughput per dollar. Quantisation cuts memory and cost, continuous batching and a paged KV-cache raise throughput, prompt caching avoids recomputing shared prefixes, and speculative decoding reduces latency. I load-test and track p95 latency and cost per million tokens.',
    qa: [['Does quantisation hurt quality?', 'Usually slightly at INT8, more at INT4 — always evaluate on your task.'], ['Why does batching help?', 'GPUs are underused by one request; batching shares each weight read across many requests.']],
    uses: ['Cheaper chatbots', 'Real-time voice', 'On-device AI'],
    pitfall: 'Optimising average latency while p95 users suffer.',
    idea: 'AI cheap enough to be a free public utility, like street lighting.',
  },
  'fine-tuning': {
    big: 'Adapt a model’s behaviour with your examples — efficiently with LoRA/QLoRA, aligned with DPO, then evaluated and served.',
    analogy: 'Teaching a fluent speaker your company’s jargon and tone — not teaching them a language from scratch.',
    picture: 'A frozen giant model with small trainable adapter plates (LoRA) clipped onto its layers.',
    hook: 'Data quality > data quantity; adapters not overhauls; eval before and after.',
    points: [['When', 'Consistent format, tone or narrow skill — not new facts (use RAG).'], ['Dataset', 'Hundreds to thousands of clean, representative examples.'], ['LoRA / QLoRA', 'Train tiny low-rank adapters; QLoRA on a 4-bit base fits one GPU.'], ['DPO', 'Teach preferences with chosen/rejected pairs.'], ['Evaluate', 'Compare against the base model on held-out data.']],
    code: { lang: 'python', src: R`from peft import LoraConfig, get_peft_model
from transformers import AutoModelForCausalLM

base = AutoModelForCausalLM.from_pretrained("Qwen/Qwen2.5-1.5B-Instruct")
config = LoraConfig(r=16, lora_alpha=32, lora_dropout=0.05,
                    target_modules=["q_proj", "v_proj"], task_type="CAUSAL_LM")
model = get_peft_model(base, config)
model.print_trainable_parameters()   # well under 1% of parameters are trainable` },
    interview: 'I fine-tune only when prompting and RAG cannot give the consistent behaviour we need. I curate a clean dataset, train LoRA or QLoRA adapters to keep cost low, optionally apply DPO for preferences, and prove the gain on a held-out eval set versus the base model before serving the adapter.',
    qa: [['Why LoRA?', 'It trains a tiny fraction of parameters — cheaper, faster, and adapters can be swapped per customer.'], ['Fine-tune to add knowledge?', 'Usually no — use RAG for facts; fine-tune for behaviour and format.']],
    uses: ['Brand voice', 'Structured extraction', 'Domain classification'],
    pitfall: 'Training on noisy data and evaluating on the training set.',
    idea: 'Small specialist models for every local language and profession, trained by communities themselves.',
  },
  'local-open-models': {
    big: 'Run open-weight models yourself — from a laptop with Ollama to production servers — and decide API vs self-host.',
    analogy: 'Renting a car (API) vs owning one (self-host): owning gives control and privacy, renting avoids maintenance.',
    picture: 'A laptop running a quantised model offline, then the same model on a GPU server behind an API.',
    hook: 'Ollama to try, vLLM to serve, quantise to fit, compare total cost.',
    points: [['Landscape', 'Llama, Qwen, Mistral, Gemma, DeepSeek, gpt-oss and more.'], ['Local dev', 'Ollama / LM Studio run quantised GGUF models.'], ['Production', 'vLLM, SGLang, TGI for throughput.'], ['Decision', 'Privacy, cost at volume and control vs quality and ops burden.']],
    code: { lang: 'bash', src: R`ollama pull llama3.2
ollama run llama3.2 "Explain RAG in one sentence"
curl http://localhost:11434/api/generate -d '{"model":"llama3.2","prompt":"Hello","stream":false}'` },
    interview: 'I prototype with open models locally via Ollama, serve them in production with vLLM, and decide API versus self-hosting on data sensitivity, volume economics, latency and the quality gap — self-hosting wins for private data at high volume, APIs win for frontier quality and low ops.',
    qa: [['When self-host?', 'Strict data residency, very high steady volume, offline/air-gapped needs, or custom fine-tunes.'], ['What is GGUF?', 'A file format for quantised models used by llama.cpp and Ollama.']],
    uses: ['Air-gapped environments', 'Privacy-sensitive data', 'Cost control at scale'],
    pitfall: 'Comparing GPU price to API price without counting engineers’ time and idle capacity.',
    idea: 'Powerful AI that works fully offline for remote schools and clinics.',
  },
  'safety-red-teaming': {
    big: 'Find how an AI system can be misused before attackers do, then defend in layers and govern it.',
    analogy: 'Hiring a friendly burglar to test your locks before a real one tries.',
    picture: 'Concentric walls around the model: input filters, least-privilege tools, output checks, monitoring, human approval.',
    hook: 'Threat model, attack, defend in layers, govern.',
    points: [['Threat model', 'Assets, attackers, entry points (prompts, documents, tools).'], ['Manual red-teaming', 'Creative jailbreaks and injection attempts.'], ['Automated', 'Generated attack suites in CI (e.g. promptfoo).'], ['Layered defences', 'No single guard is enough.'], ['Governance', 'Policies, audits, incident response, regulation.']],
    code: { lang: 'yaml', src: R`# promptfooconfig.yaml — automated red-team in CI
targets: [ "http://localhost:8000/chat" ]
redteam:
  purpose: "Customer support bot for a bank"
  plugins: [ "pii", "harmful", "prompt-extraction", "excessive-agency" ]
  strategies: [ "jailbreak", "prompt-injection" ]` },
    interview: 'I start with a threat model, red-team manually and with automated suites in CI, and defend in layers — input filtering, least-privilege tools, output validation, monitoring and human approval for risky actions — backed by governance and an incident process.',
    qa: [['Direct vs indirect prompt injection?', 'Direct comes from the user; indirect hides in content the model reads, like web pages or documents.'], ['What is excessive agency?', 'An agent with more permissions than its task needs — limit tools and scopes.']],
    uses: ['Banking assistants', 'Healthcare bots', 'Agent platforms'],
    pitfall: 'Relying on the system prompt alone as a security boundary.',
    idea: 'Open, shared red-team datasets that make every AI on Earth safer.',
  },
  'career-interview-prep': {
    big: 'Turn skills into offers: portfolio, behavioural stories, coding and system-design interviews, negotiation.',
    analogy: 'A product launch where you are the product: build it (skills), package it (portfolio), pitch it (interviews), price it (negotiation).',
    picture: 'A STAR card: Situation, Task, Action, Result — with a number in the Result.',
    hook: 'Show projects, tell STAR stories, think aloud, negotiate with data.',
    points: [['Portfolio', '2–3 deep, deployed projects beat ten tutorials.'], ['Behavioural', 'STAR stories with measurable results.'], ['Coding', 'Clarify, brute force, optimise, test — aloud.'], ['System design', 'Requirements → design → scale → trade-offs.'], ['Negotiation', 'Know your market range; negotiate total compensation.']],
    code: { lang: 'markdown', src: R`**Situation:** Support team overwhelmed — 2,000 tickets/week, 48h response time.
**Task:** Cut response time without hiring.
**Action:** Built a RAG assistant over 1,200 help articles with an eval gate and human review.
**Result:** 41% of tickets auto-resolved, response time down to 6h, CSAT +12 points.` },
    interview: 'I prepare a small set of STAR stories that each show impact with numbers, practise coding problems by thinking aloud from brute force to optimal, and walk system-design questions from requirements to trade-offs — and I let my deployed projects do most of the convincing.',
    qa: [['Tell me about a failure?', 'A real STAR story where you owned the mistake, fixed it and changed a process so it cannot recur.'], ['Why should we hire you?', 'Connect two or three of your proven results directly to their biggest current problem.']],
    uses: ['Job interviews', 'Promotion cases', 'Freelance pitches'],
    pitfall: 'Stories without numbers or without what *you* personally did.',
    idea: 'Free, AI-powered interview coaching for every first-generation job seeker.',
  },
  'enterprise-leadership': {
    big: 'Lead AI in organisations: governance, buy vs build, FinOps, rollout, security and executive communication.',
    analogy: 'Introducing electricity to a factory: safety codes (governance), choosing suppliers (buy vs build), metering (FinOps), training workers (rollout).',
    picture: 'A one-page board memo: problem, value in dollars, risk, cost, decision needed.',
    hook: 'Value, risk, cost, adoption — in that order.',
    points: [['Governance', 'Inventory AI uses, classify risk, assign owners.'], ['Buy vs build', 'Buy commodity capability; build where it differentiates.'], ['FinOps', 'Unit economics: cost per task, per user, per outcome.'], ['Rollout', 'Pilot → measure → train champions → scale.'], ['Communication', 'Speak in outcomes and risk, not model names.']],
    code: { lang: 'python', src: R`def roi(tasks_per_month, minutes_saved, hourly_cost, ai_cost_per_task, platform_monthly):
    saved = tasks_per_month * minutes_saved / 60 * hourly_cost
    cost = tasks_per_month * ai_cost_per_task + platform_monthly
    return {"monthly_value": round(saved), "monthly_cost": round(cost), "roi_x": round(saved / cost, 1)}

print(roi(20_000, 6, 40, 0.02, 3_000))   # value vs cost for an AI rollout` },
    interview: 'I run AI programmes on value, risk, cost and adoption: a governance inventory with risk tiers, buy-versus-build decisions based on differentiation, unit-economics tracking, and phased rollouts with champions — and I report to executives in outcomes and risk, not jargon.',
    qa: [['How do you measure AI ROI?', 'Baseline the process, measure time or cost saved per task, subtract total AI costs, track quality.'], ['Biggest rollout risk?', 'Low adoption — solved with training, champions and fitting into existing workflows.']],
    uses: ['AI strategy', 'Board reporting', 'Vendor selection'],
    pitfall: 'Pilots with no success metric — they never scale.',
    idea: 'Organisations where AI frees people for creative, human work instead of replacing them.',
  },
  'projects': {
    big: 'Fifteen end-to-end AI projects — each one a complete, deployable system you can explain in an interview.',
    analogy: 'Learning to cook by making full meals, not just chopping vegetables.',
    picture: 'Every project follows the same spine: User → API → Agent/RAG → Tools → Guardrails → Evals → Deploy → Monitor.',
    hook: 'Problem, data, model, tools, guard, eval, ship, monitor.',
    points: [['Scope', 'One painful problem, one success metric.'], ['Vertical slice', 'Thin but complete path from UI to deployment first.'], ['Quality', 'Eval set and guardrails from day one.'], ['Story', 'Problem → design → trade-offs → result.']],
    code: { lang: 'text', src: R`project/
  app/            api.py (FastAPI), agent.py, rag.py, tools.py, guards.py
  evals/          golden.jsonl, run_evals.py
  infra/          Dockerfile, docker-compose.yml, k8s/
  tests/          test_tools.py, test_api.py
  README.md       problem, architecture diagram, metrics, how to run` },
    interview: 'Each project I built follows the same spine — a clear problem and metric, a thin end-to-end slice, retrieval and tools as needed, guardrails, an eval set gating changes, containerised deployment and monitoring — so I can explain every design decision and its trade-off.',
    qa: [['Walk me through your best project?', 'Problem and metric → architecture → hardest technical decision and trade-off → measured result → what you would do next.'], ['How did you know it worked?', 'An evaluation set with clear metrics, plus real usage numbers.']],
    uses: ['Portfolio', 'Interview stories', 'Starter templates for real work'],
    pitfall: 'Projects that stop at a notebook — always ship and measure.',
    idea: 'Open-source reference systems any NGO or startup can deploy tomorrow.',
  },
  'case-studies-architectures': {
    big: 'Real-world architectures: when to use agents vs workflows, and how support, compliance, healthcare and regulated systems are built.',
    analogy: 'Studying famous buildings before designing your own.',
    picture: 'Two lanes: a fixed workflow lane (predictable) and an agent lane (flexible) joined by a router.',
    hook: 'Workflow when you can, agent when you must, humans where it matters.',
    points: [['Agents vs workflows', 'Predefined paths are cheaper and safer; agents for open-ended tasks.'], ['Support triage', 'Classify → route → draft → human approve.'], ['Regulated industries', 'Audit trails, data residency, explainability.'], ['Legacy retrofit', 'Wrap old systems as tools behind APIs.']],
    code: { lang: 'python', src: R`def route(ticket, classify):
    label = classify(ticket)                 # cheap model or rules
    if label in {"password_reset", "invoice_copy"}:
        return "workflow"                    # fixed, safe, cheap path
    if label == "complaint":
        return "human"                       # sensitive -> person
    return "agent"                           # open-ended -> agent with tools` },
    interview: 'I default to workflows for predictable tasks and reserve agents for open-ended ones, routing between them with a cheap classifier. In regulated settings I add audit logs, data residency, human approval for sensitive decisions, and explainable outputs with citations.',
    qa: [['Agent or workflow for refunds?', 'Workflow — the steps are known and must be auditable; maybe an LLM step to extract details.'], ['How to retrofit legacy systems?', 'Expose them as narrow, well-tested tools behind an API layer the AI can call.']],
    uses: ['Enterprise architecture reviews', 'Compliance-heavy deployments', 'Platform design'],
    pitfall: 'Using a fully autonomous agent for a process that regulators require to be deterministic.',
    idea: 'AI that modernises decades-old public systems without breaking them.',
  },
  'software-testing': {
    big: 'Tests let you change code fearlessly: unit, integration, TDD, mocking, property-based and non-functional testing.',
    analogy: 'A safety net under a trapeze artist — you can try bold moves because you will be caught.',
    picture: 'The test pyramid: many fast unit tests at the bottom, fewer integration tests, a few end-to-end tests at the top.',
    hook: 'Arrange, Act, Assert — red, green, refactor.',
    points: [['pytest', 'Plain asserts, fixtures, parametrisation.'], ['Mocking', 'Replace slow or external dependencies (LLM APIs) in unit tests.'], ['TDD', 'Write a failing test, make it pass, refactor.'], ['Property-based', 'Generate many inputs to find edge cases (Hypothesis).'], ['CI', 'Run the whole suite on every push.']],
    code: { lang: 'python', src: R`import pytest
from unittest.mock import Mock

def summarize(text, llm):
    if not text.strip():
        raise ValueError("empty")
    return llm(f"Summarize: {text}")[:200]

def test_summarize_calls_llm():
    llm = Mock(return_value="short summary")
    assert summarize("long text", llm) == "short summary"
    llm.assert_called_once()

def test_empty_text_rejected():
    with pytest.raises(ValueError):
        summarize("   ", Mock())` },
    interview: 'I follow the test pyramid: fast unit tests with mocks for external services like LLM APIs, integration tests for real boundaries, a few end-to-end tests, all run in CI. For tricky logic I add property-based tests, and for AI behaviour I add evaluation suites on top.',
    qa: [['Unit vs integration test?', 'Unit tests isolate one piece with mocks; integration tests check real components working together.'], ['How do you test LLM code?', 'Mock the model for deterministic logic tests; use eval sets for model behaviour.']],
    uses: ['Safe refactors', 'Regression prevention', 'Confident deploys'],
    pitfall: 'Chasing 100% coverage with tests that assert nothing meaningful.',
    idea: 'Software in hospitals, cars and power grids that is provably reliable.',
  },
  'reference': {
    big: 'A cheat sheet and A–Z glossary to revise every concept in minutes.',
    analogy: 'The map at the mall entrance — “you are here” for the whole curriculum.',
    picture: 'One page with every acronym and its one-line meaning.',
    hook: 'Revise daily, five minutes, out loud.',
    points: [['Cheat sheet', 'Core formulas, commands and patterns.'], ['Glossary', 'Every term in one line.'], ['Spaced review', 'Use the flashcards here every day.']],
    code: { lang: 'text', src: R`RAG   = Retrieve relevant chunks + Generate grounded answer
MCP   = Model Context Protocol (tools/data for AI apps)
A2A   = Agent-to-Agent protocol
LoRA  = Low-Rank Adaptation (cheap fine-tuning)
KV-cache = stored attention keys/values for fast generation
HPA   = Horizontal Pod Autoscaler (Kubernetes)` },
    interview: 'I keep a personal glossary and cheat sheet and review it with spaced repetition, so I can define any term crisply and connect it to a real system I have built.',
    qa: [['Define RAG in one line?', 'Retrieve relevant information from your data and give it to the LLM so answers are grounded and cited.'], ['Define an agent in one line?', 'An LLM in a loop that chooses tools to reach a goal.']],
    uses: ['Daily revision', 'Interview warm-up', 'Onboarding others'],
    pitfall: 'Memorising definitions without an example of each.',
    idea: 'A universal AI glossary in every language so no learner is left out.',
  },
}

// End-to-end walkthroughs for the course projects (P1–P15).
export const SBD_PROJECTS = [
  { n: 'P1', title: 'Customer Support Agent', problem: 'Support queues are slow and repetitive.', flow: ['Ticket arrives via API/webhook', 'Classify intent & urgency', 'Retrieve help articles (RAG)', 'Agent drafts reply, calls order/refund tools', 'Guardrail: policy + PII check', 'Auto-send simple cases, human review for the rest', 'Log, evaluate, monitor CSAT'], stack: 'FastAPI · Claude · vector DB · Postgres · Docker', explain: 'Auto-resolves routine tickets with cited answers and safe tool use; humans handle the sensitive ones.', idea: 'Instant, multilingual help for every small business customer.' },
  { n: 'P2', title: 'Coding & Code-Review Agent', problem: 'Reviews are slow and inconsistent.', flow: ['PR opened → webhook', 'Fetch diff + related files', 'Agent reviews against team rules', 'Run tests/linters as tools', 'Post inline comments with severity', 'Track accepted vs rejected suggestions'], stack: 'GitHub API · Claude Code / Agent SDK · CI', explain: 'Consistent first-pass reviews in minutes, grounded in our rules and real test results.', idea: 'World-class code review for every open-source maintainer.' },
  { n: 'P3', title: 'Document Intelligence', problem: 'People manually re-type data from PDFs and scans.', flow: ['Upload PDF/image', 'OCR / native PDF parsing', 'LLM extracts fields into a schema', 'Validate (types, totals, required fields)', 'Low-confidence → human review queue', 'Store + export to ERP'], stack: 'Docling/Textract · Claude vision · Pydantic · Postgres', explain: 'Turns messy documents into validated structured data with a human safety net.', idea: 'Aid and benefit claims processed in minutes for families in need.' },
  { n: 'P4', title: 'Data Analyst Agent', problem: 'Business users wait days for simple data answers.', flow: ['Question in plain English', 'Agent inspects schema', 'Generates SQL (read-only role)', 'Runs query, checks result sanity', 'Builds chart + explanation', 'Shows the SQL for transparency'], stack: 'Postgres/DuckDB · Claude · Pandas · Streamlit', explain: 'Self-service analytics with transparent SQL and read-only safety.', idea: 'Every citizen able to question public datasets directly.' },
  { n: 'P5', title: 'Deep Research Agent', problem: 'Research across many sources is slow.', flow: ['Plan sub-questions', 'Search web/papers (tools)', 'Read & extract evidence with citations', 'Critic checks gaps and contradictions', 'Write report with sources', 'Evaluate citation accuracy'], stack: 'Search API · Claude · LangGraph · citation checker', explain: 'Plan–search–read–critique loop that produces cited reports.', idea: 'Accelerated research for rare diseases and climate solutions.' },
  { n: 'P6', title: 'Document Intelligence + RAG', problem: 'Knowledge locked inside thousands of documents.', flow: ['Ingest & parse docs', 'Chunk with structure + metadata', 'Embed into vector store', 'Hybrid search + rerank', 'Grounded answer with citations', 'Eval retrieval + faithfulness'], stack: 'Docling · embeddings · Qdrant/pgvector · reranker · Claude', explain: 'Ask questions over your document library and get cited answers.', idea: 'Every school answering questions from its own curriculum.' },
  { n: 'P7', title: 'Content Assistant', problem: 'Creating on-brand content takes too long.', flow: ['Brief input', 'Retrieve brand guide + past content', 'Draft variations', 'Score for tone, SEO, factuality', 'Human edits & approves', 'Publish + track performance'], stack: 'Claude · prompt templates · eval rubric · CMS API', explain: 'Fast on-brand drafts with automated quality scoring and human approval.', idea: 'Local creators reaching global audiences in every language.' },
  { n: 'P8', title: 'Semantic Search Engine', problem: 'Keyword search misses what users mean.', flow: ['Index documents with embeddings + BM25', 'Query understanding/rewrite', 'Hybrid retrieval', 'Rerank', 'Highlight answers', 'Measure recall@k and clicks'], stack: 'Embeddings · OpenSearch/Qdrant · cross-encoder · FastAPI', explain: 'Search by meaning, not just words, measured with recall and click-through.', idea: 'Finding the right legal or medical help in your own words.' },
  { n: 'P9', title: 'Agentic RAG Assistant', problem: 'Simple RAG fails on multi-step questions.', flow: ['Agent decides whether to retrieve', 'Rewrites / decomposes the query', 'Retrieves iteratively (multi-hop)', 'Checks if evidence is sufficient', 'Answers with citations or asks for clarification'], stack: 'LangGraph · vector DB · Claude', explain: 'Agent controls retrieval — rewriting, multi-hop and self-checking evidence.', idea: 'Assistants that actually reason across a company’s entire knowledge.' },
  { n: 'P10', title: 'No-Code Automation Agent', problem: 'Ops teams drown in repetitive glue work.', flow: ['Trigger (email/form/schedule)', 'AI classify & extract', 'Branch by rules', 'Act in apps (Slack, Sheets, CRM)', 'Error alerts + logs'], stack: 'n8n / Make / Zapier · Claude', explain: 'Hours of manual work automated visually, with error handling.', idea: 'Every small team gets an automation department.' },
  { n: 'P11', title: 'Custom MCP Server', problem: 'Assistants cannot reach internal tools.', flow: ['Define tools with schemas', 'Implement server (Python/TS SDK)', 'Auth + least privilege', 'Test with MCP Inspector', 'Connect to Claude / IDEs', 'Log every call'], stack: 'MCP SDK · FastMCP · OAuth', explain: 'One standard server exposes internal systems to any AI client safely.', idea: 'Universal plug for AI across every organisation.' },
  { n: 'P12', title: 'Multi-Agent Research Crew', problem: 'Complex reports need several kinds of expertise.', flow: ['Supervisor splits the task', 'Researcher gathers facts', 'Analyst computes/compares', 'Writer drafts', 'Critic reviews', 'Supervisor merges final report'], stack: 'CrewAI / LangGraph · Claude · search tools', explain: 'Specialised agents with a supervisor and critic produce higher-quality reports.', idea: 'Expert-level analysis available to every policymaker.' },
  { n: 'P13', title: 'Support with Guardrails', problem: 'Bots can leak data or be manipulated.', flow: ['Input filters (injection, PII)', 'Scoped tools (least privilege)', 'Answer generation', 'Output validation & policy check', 'Escalate risky cases', 'Red-team in CI'], stack: 'NeMo Guardrails / Guardrails AI · promptfoo · Claude', explain: 'Layered defences around a support bot, proven by automated red-teaming.', idea: 'AI people can trust with their bank and health questions.' },
  { n: 'P14', title: 'Multi-Agent + Observability', problem: 'Multi-agent systems are hard to debug.', flow: ['Instrument every agent step', 'Trace IDs across agents', 'Dashboards: latency, cost, errors', 'Eval scores per run', 'Alert on regressions'], stack: 'OpenTelemetry · LangSmith / Langfuse · Grafana', explain: 'Full traces and metrics make multi-agent behaviour debuggable and measurable.', idea: 'Transparent AI systems anyone can audit.' },
  { n: 'P15', title: 'End-to-End Agentic System', problem: 'Bring everything together into one production system.', flow: ['Requirements & metric', 'API + UI', 'Agent with tools + RAG', 'Guardrails & human approval', 'Eval gate in CI', 'Containerise & deploy (K8s)', 'Monitor, iterate'], stack: 'FastAPI · Claude · vector DB · Docker · Kubernetes · CI/CD · tracing', explain: 'A complete production agentic system from requirements to monitoring.', idea: 'Your own product that changes how an industry works.' },
]
