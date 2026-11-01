"""
Multi-agent project crews — free-model powered A2A orchestration.

Each project gets its own "crew" of specialist agents that talk to each other
(agent-to-agent) via a shared transcript and work through a pipeline:

    Planner  ->  Tasker  ->  Builder  ->  Deployer  ->  Runner

Agents use a *free* LLM backend:
  • Ollama (local, offline) — auto-detected via http://localhost:11434
  • OpenRouter — only if OPENROUTER_API_KEY is set (free model endpoints)

Human-in-the-loop: whenever an agent wants to change a file (design or code),
it stages the change and the crew pauses with status "awaiting_approval".
The user must approve (POST /approve) before it is applied. Nothing is ever
written to disk without approval.

Endpoints
---------
    GET  /api/agents/models            -> available free models
    POST /api/agents/crew/start        -> create a crew + run Planner & Tasker
    POST /api/agents/crew/step         -> advance one phase (Builder/Deployer/Runner)
    POST /api/agents/crew/approve      -> approve or reject a pending file change
    GET  /api/agents/crew/{id}         -> full crew state (transcript, plan, tasks)

Crew state is kept in memory (dict) — it is per-backend-process and survives
until the process restarts, which is fine for an interactive local tool.
"""
import os
import re
import time
import json
import uuid
import shutil
import subprocess
import urllib.request
import urllib.error

from fastapi.responses import JSONResponse

# Reuse the project registry helpers (resolve path, detect stack, run commands).
from projects_api import (
    _resolve_project_path,
    _humanize_name,
    _read_text,
    _detect_stack,
    _build_tree,
    _collect_source_files,
    _run_command_core,
)

OLLAMA_URL = os.environ.get("OLLAMA_URL", "http://127.0.0.1:11434")
OPENROUTER_API_KEY = os.environ.get("OPENROUTER_API_KEY", "").strip()

_LLM_TIMEOUT = 300

# Ordered pipeline phases. Planner & Tasker run at start(); the rest run on step().
_PHASES = ["planner", "tasker", "builder", "deployer", "runner", "done"]

# Free OpenRouter model endpoints that permit anonymous/no-credit usage vary;
# these are widely used free-tier IDs. Only listed when a key is configured.
_OPENROUTER_FREE_MODELS = [
    "meta-llama/llama-3.3-70b-instruct:free",
    "deepseek/deepseek-chat-v3-0324:free",
    "qwen/qwen-2.5-72b-instruct:free",
    "mistralai/mistral-7b-instruct:free",
]

_CREWS: dict[str, dict] = {}


# --------------------------------------------------------------------------- #
# LLM clients
# --------------------------------------------------------------------------- #
def _http_json(url: str, payload: dict, timeout: int = _LLM_TIMEOUT, method: str = "POST") -> dict:
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(url, data=data, headers={"Content-Type": "application/json"}, method=method)
    if OPENROUTER_API_KEY and "openrouter" in url:
        req.add_header("Authorization", f"Bearer {OPENROUTER_API_KEY}")
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return json.loads(resp.read().decode("utf-8", errors="replace"))


def _ollama_models() -> list[dict]:
    for host in (OLLAMA_URL, "http://127.0.0.1:11434", "http://localhost:11434"):
        try:
            data = _http_json(f"{host}/api/tags", {}, timeout=8, method="GET")
        except Exception:
            continue
        out = []
        for m in data.get("models", []):
            name = m.get("name", "")
            if not name:
                continue
            out.append({
                "id": name,
                "name": name,
                "provider": "ollama",
                "local": not name.endswith(":cloud"),
                "free": True,
            })
        return out
    return []


def _openrouter_models() -> list[dict]:
    if not OPENROUTER_API_KEY:
        return []
    return [
        {"id": m, "name": m, "provider": "openrouter", "local": False, "free": True}
        for m in _OPENROUTER_FREE_MODELS
    ]


def list_models() -> dict:
    ollama = _ollama_models()
    models = ollama + _openrouter_models()
    return {
        "models": models,
        "default": "llama3.2:3b" if any(m["id"] == "llama3.2:3b" for m in models) else (models[0]["id"] if models else ""),
        "ollamaOnline": bool(ollama),
        "openrouterConfigured": bool(OPENROUTER_API_KEY),
    }


def _complete(model: str, system: str, prompt: str) -> str:
    """Send a completion to a free model. Returns the assistant text."""
    provider = "openrouter" if "/" in model else "ollama"
    if provider == "openrouter":
        data = _http_json("https://openrouter.ai/api/v1/chat/completions", {
            "model": model,
            "messages": [
                {"role": "system", "content": system},
                {"role": "user", "content": prompt},
            ],
            "max_tokens": 2000,
        })
        try:
            return data["choices"][0]["message"]["content"] or ""
        except Exception:
            return ""
    # Ollama /api/generate
    data = _http_json(f"{OLLAMA_URL}/api/generate", {
        "model": model,
        "system": system,
        "prompt": prompt,
        "stream": False,
        "options": {"temperature": 0.2},
    })
    return data.get("response", "")


# --------------------------------------------------------------------------- #
# Crew helpers
# --------------------------------------------------------------------------- #
def _project_context(path: str) -> dict:
    """Condensed facts an agent needs to reason about a project."""
    tree = _build_tree(path, max_entries=120, max_depth=3)
    stack = _detect_stack(path)
    sources = _collect_source_files(path, max_files=6)
    readme = ""
    for c in ("README.md", "README.txt", "PROJECT_DOCUMENTATION.md", "DOCUMENTATION.md"):
        fp = os.path.join(path, c)
        if os.path.isfile(fp):
            readme = _read_text(fp, max_chars=4000)
            break
    return {
        "name": os.path.basename(path),
        "title": _humanize_name(os.path.basename(path)),
        "path": path,
        "stacks": stack["stacks"],
        "kind": stack["kind"],
        "commands": stack["commands"],
        "tree": tree[:120],
        "readme": readme[:4000],
        "sources": [{"name": s["name"], "content": s["content"][:2500]} for s in sources],
    }


def _crew(crew_id: str):
    return _CREWS.get(crew_id)


def _add_transcript(crew: dict, agent: str, role: str, text: str):
    crew["transcript"].append({
        "agent": agent,
        "role": role,
        "text": text[:6000],
        "ts": time.time(),
    })
    crew["updatedAt"] = time.time()


def _transcript_for_llm(crew: dict) -> str:
    parts = []
    for t in crew["transcript"]:
        parts.append(f"[{t['agent']} ({t['role']})]\n{t['text']}")
    return "\n\n".join(parts)[-12000:]


def _system_prompt(agent: str, role: str) -> str:
    return (
        f"You are the '{agent}' agent, a specialist in a multi-agent software crew. "
        f"Your role is {role}. You are running on a small free local model, so be "
        f"concise, concrete, and technical. Output plain markdown. Do not invent facts "
        f"about the project that are not in the provided context."
    )


# --------------------------------------------------------------------------- #
# Agents
# --------------------------------------------------------------------------- #
def _agent_planner(crew: dict, ctx: dict):
    prompt = (
        "Analyze this project and produce a step-by-step BUILD-AND-RUN plan.\n\n"
        f"Project: {ctx['title']} ({ctx['name']})\n"
        f"Stack: {', '.join(ctx['stacks'])}\n"
        f"Detected commands: {json.dumps(ctx['commands'])}\n\n"
        f"File tree (top levels):\n" + "\n".join(ctx["tree"][:80]) + "\n\n"
        + (f"README excerpt:\n{ctx['readme'][:2000]}\n\n" if ctx["readme"] else "")
        + "Return a numbered plan (max 8 steps) covering: inspect, install deps, build, test, run, deploy. "
          "For each step name the command to run. Keep it short."
    )
    text = _complete(crew["model"], _system_prompt("Planner", "high-level planning"), prompt)
    crew["plan"] = text
    _add_transcript(crew, "Planner", "plan", text)


def _agent_tasker(crew: dict, ctx: dict):
    prompt = (
        "Break the plan below into a concrete task list. Each task = one command or one "
        "file action, with an owner agent and a success check.\n\n"
        f"Project: {ctx['title']} — stack: {', '.join(ctx['stacks'])}\n"
        f"Detected commands: {json.dumps(ctx['commands'])}\n\n"
        f"PLAN:\n{crew['plan']}\n\n"
        "Output as a numbered list: 'TASK — owner — command/action — success check'."
    )
    text = _complete(crew["model"], _system_prompt("Tasker", "task decomposition"), prompt)
    crew["tasks"] = text
    _add_transcript(crew, "Tasker", "tasks", text)


def _parse_fix(text: str) -> dict | None:
    """Try to extract a JSON fix proposal from an agent's reply."""
    m = re.search(r"\{.*\}", text, re.S)
    if not m:
        return None
    try:
        obj = json.loads(m.group(0))
    except Exception:
        return None
    if isinstance(obj, dict) and obj.get("file"):
        return obj
    return None


def _stage_fix(crew: dict, phase: str, fix: dict, cmd_output: str):
    crew["pendingChange"] = {
        "phase": phase,
        "file": str(fix.get("file", "")),
        "reason": str(fix.get("reason", ""))[:500],
        "content": str(fix.get("content", ""))[:40000],
        "command": str(fix.get("command", ""))[:300],
        "context": cmd_output[-3000:],
    }
    crew["status"] = "awaiting_approval"


def _agent_execute(crew: dict, ctx: dict, phase: str, action: str, role: str):
    """Run a command phase; on failure ask the LLM for a fix and stage it."""
    command = ctx["commands"].get(action) or ctx["commands"].get("run") or ""
    if not command:
        _add_transcript(crew, phase.capitalize(), role, f"No command detected for '{action}' — skipping.")
        return
    _add_transcript(crew, phase.capitalize(), role, f"Running: `{command}`")

    result, _status = _run_command_core(ctx["path"], action, command, 0)
    crew["results"][action] = result

    if result.get("ok"):
        summary_prompt = (
            f"The command succeeded. Summarize the outcome in 2-3 lines and name the next step.\n"
            f"Command: {command}\nOutput:\n{(result.get('stdout') or '')[-2000:]}"
        )
        text = _complete(crew["model"], _system_prompt(phase.capitalize(), role), summary_prompt)
        _add_transcript(crew, phase.capitalize(), role, f"✅ Success: {text}")
        return

    # Failed — ask the model to diagnose and (optionally) propose a code fix.
    err = (result.get("stderr") or result.get("error") or result.get("stdout") or "")[-4000:]
    fix_prompt = (
        f"The '{action}' command FAILED. Diagnose it, then decide if a code/config change can fix it.\n\n"
        f"Command: {command}\n\nError output:\n{err}\n\n"
        f"Key files:\n" + "\n".join(f"- {s['name']}" for s in ctx["sources"]) + "\n\n"
        "If you can fix it, reply with ONLY a JSON object (no other text):\n"
        '{"file": "relative/path.py", "reason": "why", "content": "full new file contents", "command": "command to rerun"}\n'
        "If you cannot fix it, reply with the single word: NONE and a 2-line explanation."
    )
    text = _complete(crew["model"], _system_prompt(phase.capitalize(), role), fix_prompt)
    fix = _parse_fix(text)
    if fix:
        _stage_fix(crew, phase, fix, err)
        _add_transcript(crew, phase.capitalize(), role, f"❌ Failed — proposed a fix to `{fix.get('file')}` (awaiting approval).")
    else:
        _add_transcript(crew, phase.capitalize(), role, f"❌ Failed — no auto-fix proposed. Diagnosis:\n{text}")


# --------------------------------------------------------------------------- #
# Crew lifecycle
# --------------------------------------------------------------------------- #
def start_crew(path: str, model: str) -> dict:
    proj = _resolve_project_path(path)
    if not proj:
        return {"error": "Unknown project path"}
    models = {m["id"] for m in list_models()["models"]}
    if model not in models:
        model = list_models()["default"] or model

    crew_id = "crew_" + uuid.uuid4().hex[:10]
    crew = {
        "id": crew_id,
        "project": proj,
        "name": os.path.basename(proj),
        "title": _humanize_name(os.path.basename(proj)),
        "model": model,
        "phase": "planner",
        "status": "running",
        "plan": "",
        "tasks": "",
        "transcript": [],
        "pendingChange": None,
        "results": {},
        "createdAt": time.time(),
        "updatedAt": time.time(),
    }
    _CREWS[crew_id] = crew
    ctx = _project_context(proj)

    try:
        _agent_planner(crew, ctx)
        _agent_tasker(crew, ctx)
        crew["phase"] = "builder"
        crew["status"] = "running"
    except Exception as e:
        crew["status"] = "error"
        _add_transcript(crew, "System", "error", f"LLM call failed: {str(e)[:300]}")
    return crew


def step_crew(crew_id: str) -> dict:
    crew = _crew(crew_id)
    if not crew:
        return {"error": "Unknown crew"}
    if crew["status"] == "awaiting_approval":
        return crew
    if crew["phase"] in ("done",):
        crew["status"] = "done"
        return crew

    ctx = _project_context(crew["project"])
    phase = crew["phase"]
    try:
        if phase == "builder":
            _agent_execute(crew, ctx, "builder", "build", "build execution & fix")
            if crew["status"] == "awaiting_approval":
                return crew
            crew["phase"] = "deployer"
        elif phase == "deployer":
            _agent_execute(crew, ctx, "deployer", "deploy", "deploy execution")
            if crew["status"] == "awaiting_approval":
                return crew
            crew["phase"] = "runner"
        elif phase == "runner":
            _agent_execute(crew, ctx, "runner", "run", "run execution")
            if crew["status"] == "awaiting_approval":
                return crew
            crew["phase"] = "done"
            crew["status"] = "done"
            _add_transcript(crew, "System", "summary", "All phases complete. Crew finished.")
    except Exception as e:
        crew["status"] = "error"
        _add_transcript(crew, "System", "error", f"Step failed: {str(e)[:300]}")
    return crew


def approve_change(crew_id: str, approve: bool) -> dict:
    crew = _crew(crew_id)
    if not crew:
        return {"error": "Unknown crew"}
    if crew["status"] != "awaiting_approval" or not crew["pendingChange"]:
        return {**crew, "error": "No pending change to approve"}

    change = crew["pendingChange"]
    proj = crew["project"]
    if approve:
        target = os.path.normpath(os.path.join(proj, change["file"]))
        root = os.path.realpath(proj)
        try:
            real = os.path.realpath(target)
        except Exception:
            real = ""
        root_cmp = os.path.normcase(root)
        real_cmp = os.path.normcase(real)
        if not (real_cmp == root_cmp or real_cmp.startswith(root_cmp + os.sep)):
            _add_transcript(crew, "System", "error", f"Rejected unsafe path: {change['file']}")
            crew["pendingChange"] = None
            crew["status"] = "running"
            return crew
        try:
            os.makedirs(os.path.dirname(target), exist_ok=True)
            with open(target, "w", encoding="utf-8") as fh:
                fh.write(change["content"])
            _add_transcript(crew, "System", "approved", f"✅ Applied approved change to `{change['file']}`.")
        except Exception as e:
            _add_transcript(crew, "System", "error", f"Failed to write file: {str(e)[:200]}")
    else:
        _add_transcript(crew, "System", "rejected", f"✗ User rejected change to `{change['file']}`.")

    crew["pendingChange"] = None
    crew["status"] = "running"
    return crew


# --------------------------------------------------------------------------- #
# Endpoints
# --------------------------------------------------------------------------- #
def register_agents_api(app):
    @app.get("/api/agents/models")
    def agents_models():
        return list_models()

    @app.post("/api/agents/crew/start")
    def crew_start(body: dict):
        path = body.get("path") or ""
        model = str(body.get("model") or "").strip()
        return start_crew(path, model)

    @app.post("/api/agents/crew/step")
    def crew_step(body: dict):
        return step_crew(str(body.get("id") or ""))

    @app.post("/api/agents/crew/approve")
    def crew_approve(body: dict):
        approve = bool(body.get("approve"))
        return approve_change(str(body.get("id") or ""), approve)

    @app.get("/api/agents/crew/{crew_id}")
    def crew_get(crew_id: str):
        crew = _crew(crew_id)
        if not crew:
            return JSONResponse({"error": "Unknown crew"}, status_code=404)
        return crew
