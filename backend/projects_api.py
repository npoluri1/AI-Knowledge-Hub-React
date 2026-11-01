"""
Local workspace project registry + command runner.

Registered onto the FastAPI `app` via `register_projects_api(app)`.

Endpoints
---------
    GET  /api/projects          -> list every project across the configured roots
    GET  /api/projects/detail   -> README + file tree + key source + images for one project
    GET  /api/projects/file     -> stream a file (image / source) from inside a project
    POST /api/projects/run      -> run a build / deploy / run / test / custom command in a project
    POST /api/projects/run-batch-> run one action across many (or all) projects

Project roots default to the three workspace locations and can be overridden via
the PROJECT_ROOTS env var (a JSON array or a ;-separated list).
"""
import os
import re
import time
import json
import hashlib
import shutil
import socket
import tempfile
import threading
import subprocess
import uuid

from fastapi.responses import JSONResponse, FileResponse

# --------------------------------------------------------------------------- #
# Config
# --------------------------------------------------------------------------- #
_DEFAULT_PROJECT_ROOTS = [
    r"D:\WorkSpace\Claude_Code",
    r"D:\WorkSpace\Claude_Code\New_Ideas_set_project",
    r"D:\WorkSpace\Claude_Code\New_Ideas_set_project1",
]

_SKIP_DIRS = {
    "__pycache__", ".git", ".github", ".idea", ".vscode", ".qodo", ".pytest_cache",
    "node_modules", "venv", ".venv", "dist", "build", "out", "target",
    ".cache", ".parcel-cache", ".next", ".svn", ".hg", ".mypy_cache", ".tox",
}

_TEXT_EXTS = {
    ".py", ".js", ".jsx", ".ts", ".tsx", ".mjs", ".cjs", ".md", ".txt", ".json",
    ".yml", ".yaml", ".html", ".css", ".scss", ".sh", ".bat", ".env", ".toml",
    ".ini", ".cfg", ".conf", ".sql", ".java", ".go", ".rs", ".rb", ".php",
    ".c", ".cpp", ".h", ".hpp", ".xml", ".graphql", ".proto",
}

_IMAGE_EXTS = {".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp", ".bmp"}

_KEY_FILES = {
    "main.py", "app.py", "server.py", "manage.py", "wsgi.py", "asgi.py",
    "index.js", "index.jsx", "index.ts", "index.tsx", "App.jsx", "App.js",
    "main.go", "main.rs", "main.java", "docker-compose.yml", "docker-compose.yaml",
    "Dockerfile", "Makefile", "package.json", "requirements.txt", "pyproject.toml",
    "pom.xml", "build.gradle", "Cargo.toml", "go.mod",
}

_ACTION_TIMEOUTS = {
    "build": 600, "install": 600, "deploy": 300, "test": 300, "run": 60, "custom": 120,
}

_PROJECTS_CACHE = {"data": None, "ts": 0.0}
_PROJECTS_CACHE_TTL = 60.0

_TOOLS_CACHE = {"data": None, "ts": 0.0}
_TOOLS_CACHE_TTL = 120.0


# --------------------------------------------------------------------------- #
# Toolchain detection
# --------------------------------------------------------------------------- #
def _toolchain_status() -> dict:
    """Which build tools are installed / runnable on this machine (cached)."""
    now = time.time()
    if _TOOLS_CACHE["data"] is not None and (now - _TOOLS_CACHE["ts"]) < _TOOLS_CACHE_TTL:
        return _TOOLS_CACHE["data"]

    tools: dict = {}
    for name in ("node", "npm", "npx", "pip", "pip3", "python", "python3",
                 "docker", "go", "mvn", "gradle", "cargo", "dotnet", "make", "gmake", "git"):
        tools[name] = shutil.which(name) is not None

    docker_running = False
    if tools.get("docker"):
        try:
            p = subprocess.run("docker info", shell=True, capture_output=True, timeout=8)
            docker_running = p.returncode == 0
        except Exception:
            docker_running = False
    tools["docker_running"] = docker_running

    _TOOLS_CACHE["data"] = tools
    _TOOLS_CACHE["ts"] = now
    return tools


def _command_tool(command: str) -> str:
    """Return the tool name a command depends on, or '' if unknown."""
    if not command:
        return ""
    first = command.strip().split(" ")[0].lower()
    if first in ("make", "gmake"):
        return "make"
    if first == "go":
        return "go"
    if first == "mvn":
        return "mvn"
    if first == "gradle":
        return "gradle"
    if first == "cargo":
        return "cargo"
    if first == "dotnet":
        return "dotnet"
    if first in ("npm", "npx"):
        return "npm"
    if first in ("pip", "pip3", "python", "python3", "uvicorn", "pytest", "uv"):
        return "python"
    if first == "docker":
        return "docker"
    return ""


def _project_issues(commands: dict, tools: dict) -> list[str]:
    """Human-readable reasons why a project's detected commands may fail here."""
    issues: list[str] = []
    for action, cmd in commands.items():
        if not cmd:
            continue
        tool = _command_tool(cmd)
        if not tool:
            continue
        if tool == "docker":
            if not tools.get("docker"):
                issues.append(f"{action}: Docker CLI is not installed")
            elif not tools.get("docker_running"):
                issues.append(f"{action}: Docker daemon is not running")
            continue
        if not tools.get(tool):
            issues.append(f"{action}: '{tool}' is not installed on this machine")
    return issues


# --------------------------------------------------------------------------- #
# Helpers
# --------------------------------------------------------------------------- #
def _normcase(p: str) -> str:
    return os.path.normcase(p) if os.name == "nt" else p


def _get_project_roots() -> list[str]:
    """Resolve the configured project roots (env override wins over defaults)."""
    raw = os.environ.get("PROJECT_ROOTS", "").strip()
    roots: list[str] = []
    if raw:
        if raw.startswith("["):
            try:
                parsed = json.loads(raw)
                if isinstance(parsed, list):
                    roots = [str(p) for p in parsed]
            except Exception:
                roots = []
        if not roots:
            roots = [p.strip().strip('"').strip("'") for p in raw.replace("\n", ";").split(";") if p.strip()]
    if not roots:
        roots = _DEFAULT_PROJECT_ROOTS

    out: list[str] = []
    seen = set()
    for p in roots:
        try:
            abs_p = os.path.normpath(os.path.abspath(p))
        except Exception:
            continue
        key = _normcase(abs_p)
        if key in seen or not os.path.isdir(abs_p):
            continue
        seen.add(key)
        out.append(abs_p)
    return out


def _resolve_project_path(path: str):
    """Return the absolute project dir if `path` lives under an allowed root, else None."""
    if not path:
        return None
    try:
        candidate = os.path.normpath(os.path.abspath(path))
    except Exception:
        return None
    if not os.path.isdir(candidate):
        return None
    cand_cmp = _normcase(candidate)
    for root in _get_project_roots():
        root_cmp = _normcase(root)
        if cand_cmp == root_cmp or cand_cmp.startswith(root_cmp + os.sep):
            return candidate
    return None


def _humanize_name(name: str) -> str:
    words = re.sub(r"[-_]+", " ", name)
    words = re.sub(r"(?<=[a-z0-9])(?=[A-Z])", " ", words)
    return re.sub(r"\s+", " ", words).strip() or name


def _read_text(fp: str, max_chars: int = 60000) -> str:
    try:
        with open(fp, "rb") as fh:
            data = fh.read(400000)
    except Exception:
        return ""
    if b"\x00" in data:
        return ""
    return data.decode("utf-8", errors="replace")[:max_chars]


def _read_pyproject_meta(proj_dir: str) -> dict:
    """Extract name/description/deps from pyproject.toml (best effort)."""
    text = _read_text(os.path.join(proj_dir, "pyproject.toml"), max_chars=20000)
    if not text:
        return {}
    meta: dict = {}
    m = re.search(r"^name\s*=\s*[\"']([^\"']+)[\"']", text, re.M)
    if m:
        meta["name"] = m.group(1)
    m = re.search(r"^description\s*=\s*[\"']([^\"']+)[\"']", text, re.M)
    if m:
        meta["description"] = m.group(1)
    m = re.search(r"^version\s*=\s*[\"']([^\"']+)[\"']", text, re.M)
    if m:
        meta["version"] = m.group(1)
    m = re.search(r"^requires-python\s*=\s*[\"']([^\"']+)[\"']", text, re.M)
    if m:
        meta["requires_python"] = m.group(1)
    # dependency lines inside dependencies = [...]
    deps = re.findall(r'^\s*"([a-zA-Z0-9._\-\[\]]+)(?:[<>=!~^].*)?"', text, re.M)
    meta["deps"] = deps[:40]
    return meta


def _read_package_meta(proj_dir: str) -> dict:
    try:
        with open(os.path.join(proj_dir, "package.json"), "r", encoding="utf-8") as fh:
            data = json.load(fh)
    except Exception:
        return {}
    return {
        "name": data.get("name", ""),
        "description": data.get("description", ""),
        "version": data.get("version", ""),
        "scripts": list((data.get("scripts") or {}).keys()),
        "deps": list((data.get("dependencies") or {}).keys()),
    }


_MANIFEST_FILES = {
    "package.json", "requirements.txt", "pyproject.toml", "setup.py", "pipfile",
    "go.mod", "pom.xml", "build.gradle", "cargo.toml", "makefile",
    "dockerfile", "docker-compose.yml", "docker-compose.yaml",
}


def _has_manifest(d: str) -> bool:
    try:
        lower = {e.lower() for e in os.listdir(d)}
    except OSError:
        return False
    return bool(_MANIFEST_FILES & lower)


def _find_project_root(proj_dir: str) -> str:
    """Descend into a nested project folder when the top level has no build
    manifest but a single (or same-named) child directory does.

    e.g.  AISmartDigest/                    (only dashboard_plugin.py)
            └── AISmartDigest/              (requirements.txt, streamlit_app.py)
    """
    if _has_manifest(proj_dir):
        return proj_dir
    try:
        entries = [e for e in os.listdir(proj_dir) if not e.startswith(".")]
    except OSError:
        return proj_dir
    subdirs = [e for e in entries if os.path.isdir(os.path.join(proj_dir, e))]
    if not subdirs:
        return proj_dir
    base = os.path.basename(proj_dir).lower()
    # 1) same-named nested dir (common zip-extracted repo layout)
    for s in subdirs:
        if s.lower() == base and _has_manifest(os.path.join(proj_dir, s)):
            return os.path.join(proj_dir, s)
    # 2) exactly one child dir that has a manifest
    with_manifest = [s for s in subdirs if _has_manifest(os.path.join(proj_dir, s))]
    if len(with_manifest) == 1:
        return os.path.join(proj_dir, with_manifest[0])
    return proj_dir


def _read_scope(proj_dir: str) -> str:
    """Derive a one-line scope from the first meaningful README/doc line.

    Prefers a descriptive prose line over the title/heading (which usually just
    repeats the project name), so documentation-only projects get a real
    description instead of their own name.
    """
    proj_dir = _find_project_root(proj_dir)
    base_lower = _humanize_name(os.path.basename(proj_dir)).lower()
    for c in ("README.md", "README.txt", "readme.md", "PROJECT_DOCUMENTATION.md", "DOCUMENTATION.md"):
        fp = os.path.join(proj_dir, c)
        if not os.path.isfile(fp):
            continue
        text = _read_text(fp, max_chars=4000)
        body_lines: list[str] = []
        head_lines: list[str] = []
        for line in text.splitlines():
            t = line.strip()
            if not t or t.startswith("!["):
                continue
            is_head = bool(re.match(r"^#{1,6}\s", t))
            t = re.sub(r"^#{1,6}\s*", "", t)
            t = re.sub(r"[*_>`\]\[]", "", t)
            t = re.sub(r"^\(.*\)$", "", t)
            t = t.strip()
            if len(t) <= 12:
                continue
            if t.lower() == base_lower:
                continue  # bare project-name title
            (head_lines if is_head else body_lines).append(t)
        # Prefer a real prose sentence (non-heading).
        for t in body_lines:
            if len(t) > 25:
                return t[:220]
        # Fall back to a substantive heading.
        for t in head_lines:
            if len(t) > 25:
                return t[:220]
    # Fall back to pyproject.toml / package.json description.
    pm = _read_pyproject_meta(proj_dir)
    if pm.get("description"):
        return pm["description"][:220]
    jm = _read_package_meta(proj_dir)
    if jm.get("description"):
        return jm["description"][:220]
    return ""


def _synthesize_readme(proj_dir: str, title: str) -> str:
    """Build a README when none exists, from pyproject.toml / package.json / entry file."""
    proj_dir = _find_project_root(proj_dir)
    pm = _read_pyproject_meta(proj_dir)
    jm = _read_package_meta(proj_dir)
    lines = [f"# {title}", ""]
    if pm.get("description"):
        lines += [pm["description"], ""]
    elif jm.get("description"):
        lines += [jm["description"], ""]
    else:
        lines += ["_No README found — this overview was auto-generated from the project's metadata._", ""]

    if pm:
        lines.append("## Project metadata (pyproject.toml)")
        if pm.get("version"):
            lines.append(f"- Version: `{pm['version']}`")
        if pm.get("requires_python"):
            lines.append(f"- Requires Python: `{pm['requires_python']}`")
        if pm.get("deps"):
            lines.append("")
            lines.append("### Dependencies")
            lines += [f"- {d}" for d in pm["deps"]]
        lines.append("")
    if jm:
        lines.append("## Project metadata (package.json)")
        if jm.get("version"):
            lines.append(f"- Version: `{jm['version']}`")
        if jm.get("scripts"):
            lines.append("")
            lines.append("### npm scripts")
            lines += [f"- `{s}`" for s in jm["scripts"]]
        if jm.get("deps"):
            lines.append("")
            lines.append("### Dependencies")
            lines += [f"- {d}" for d in jm["deps"][:40]]
        lines.append("")

    entry = _find_python_entry(proj_dir)
    if entry:
        code = _read_text(os.path.join(proj_dir, entry), max_chars=6000)
        doc = ""
        m = re.search(r'"""(.*?)"""', code, re.S) or re.search(r"'''(.*?)'''", code, re.S)
        if m:
            doc = m.group(1).strip()
        if doc:
            lines += ["## Entry point docstring", "", doc[:2000], ""]
    return "\n".join(lines).strip()


def _make_targets(proj_dir: str) -> set:
    fp = os.path.join(proj_dir, "Makefile")
    targets: set = set()
    try:
        with open(fp, "r", encoding="utf-8", errors="replace") as fh:
            for line in fh:
                m = re.match(r"^([a-zA-Z0-9_.\-]+)\s*:", line)
                if m and not m.group(1).startswith("."):
                    targets.add(m.group(1))
    except Exception:
        pass
    return targets


def _node_scripts(proj_dir: str) -> dict:
    try:
        with open(os.path.join(proj_dir, "package.json"), "r", encoding="utf-8") as fh:
            data = json.load(fh)
        return data.get("scripts") or {}
    except Exception:
        return {}


def _python_dep_file(proj_dir: str) -> tuple[str, str]:
    """Return (filename, build_command) for the Python dependency manifest found."""
    lower = {e.lower() for e in os.listdir(proj_dir)} if os.path.isdir(proj_dir) else set()
    if "requirements.txt" in lower:
        return "requirements.txt", "pip install -r requirements.txt"
    if "pyproject.toml" in lower:
        return "pyproject.toml", "pip install -e ."
    if "setup.py" in lower:
        return "setup.py", "pip install -e ."
    if "pipfile" in lower:
        return "Pipfile", "pipenv install"
    return "", ""


def _find_python_entry(proj_dir: str) -> str:
    """Locate the most likely Python entrypoint (top-level or common subdirs)."""
    candidates = [
        "main.py", "app.py", "run.py", "server.py", "wsgi.py", "asgi.py", "manage.py",
        "backend/main.py", "backend/app.py", "app/main.py", "app/app.py",
        "src/main.py", "src/app.py", "api/main.py", "api/app.py", "server/main.py", "server/app.py",
    ]
    for c in candidates:
        if os.path.isfile(os.path.join(proj_dir, c)):
            return c
    return ""


def _is_fastapi(proj_dir: str) -> bool:
    """Heuristic: does this project look like a FastAPI/uvicorn service?"""
    for fname in ("pyproject.toml", "requirements.txt", "setup.py", "main.py", "app.py", "backend/main.py"):
        fp = os.path.join(proj_dir, fname)
        if os.path.isfile(fp):
            text = _read_text(fp, max_chars=20000).lower()
            if "fastapi" in text or "uvicorn" in text:
                return True
    return False


def _detect_stack(proj_dir: str) -> dict:
    proj_dir = _find_project_root(proj_dir)
    try:
        entries = os.listdir(proj_dir)
    except OSError:
        entries = []
    lower = {e.lower() for e in entries}

    def has(*names):
        return any(n in lower for n in names)

    stacks: list[str] = []
    kind = "unknown"
    commands = {"install": None, "build": None, "deploy": None, "run": None, "test": None}

    is_node = "package.json" in lower
    is_python = has("requirements.txt", "pyproject.toml", "setup.py", "pipfile")
    is_docker = has("dockerfile", "docker-compose.yml", "docker-compose.yaml")
    is_go = "go.mod" in lower
    is_java = has("pom.xml", "build.gradle")
    is_rust = "cargo.toml" in lower
    is_net = any(e.endswith(".csproj") or e.endswith(".sln") for e in lower)
    has_make = "makefile" in lower

    if is_node:
        stacks.append("Node")
        kind = "node"
        scripts = _node_scripts(proj_dir)
        commands["install"] = "npm install"
        commands["build"] = "npm install && npm run build" if "build" in scripts else "npm install"
        run_script = next((s for s in ("dev", "start", "serve", "start:dev") if s in scripts), "dev")
        commands["run"] = f"npm run {run_script}"
        commands["test"] = "npm test" if "test" in scripts else "npm run test"

    if is_python:
        stacks.append("Python")
        if kind == "unknown":
            kind = "python"
        _dep_name, dep_cmd = _python_dep_file(proj_dir)
        commands["build"] = dep_cmd or "pip install -e ."
        commands["install"] = commands["build"]
        entry = _find_python_entry(proj_dir)
        if entry:
            if _is_fastapi(proj_dir):
                # strip the .py suffix -> module path, e.g. "backend/main.py" -> "backend.main"
                mod = entry[:-3].replace(os.sep, ".").replace("/", ".")
                commands["run"] = f"uvicorn {mod}:app --reload"
            else:
                commands["run"] = f"python {entry}"
        else:
            commands["run"] = "python -m uvicorn main:app --reload" if _is_fastapi(proj_dir) else None
        commands["test"] = "pytest"

    if is_go:
        stacks.append("Go")
        if kind == "unknown":
            kind = "go"
        commands["build"] = "go build ./..."
        commands["run"] = "go run ."
        commands["test"] = "go test ./..."

    if is_java:
        stacks.append("Java")
        if kind == "unknown":
            kind = "java"
        mvn = "pom.xml" in lower
        commands["build"] = "mvn -q clean package" if mvn else "gradle build"
        commands["run"] = "mvn spring-boot:run" if mvn else "gradle bootRun"
        commands["test"] = "mvn test" if mvn else "gradle test"

    if is_rust:
        stacks.append("Rust")
        if kind == "unknown":
            kind = "rust"
        commands["build"] = "cargo build"
        commands["run"] = "cargo run"
        commands["test"] = "cargo test"

    if is_net:
        stacks.append(".NET")
        if kind == "unknown":
            kind = "dotnet"
        commands["build"] = "dotnet build"
        commands["run"] = "dotnet run"
        commands["test"] = "dotnet test"

    if is_docker:
        stacks.append("Docker")
        if has("docker-compose.yml", "docker-compose.yaml", "compose.yml", "compose.yaml"):
            commands["deploy"] = "docker compose up -d --build"
        else:
            slug = re.sub(r"[^a-z0-9_.-]+", "-", os.path.basename(proj_dir).lower()).strip("-") or "app"
            commands["deploy"] = f"docker build -t {slug}:local ."

    if has_make:
        stacks.append("Make")
        targets = _make_targets(proj_dir)
        for act, names in (
            ("build", ("build", "compile")),
            ("deploy", ("deploy", "release")),
            ("run", ("run", "start", "dev")),
            ("test", ("test", "tests")),
        ):
            if commands[act] is None:
                hit = next((n for n in names if n in targets), None)
                if hit:
                    commands[act] = f"make {hit}"

    # Static web sites (plain index.html, no manifest): serve them locally.
    if not stacks and has("index.html"):
        stacks.append("Static")
        kind = "static"
        commands["run"] = "python -m http.server"

    # Local "deploy" = production-mode start when nothing more specific exists.
    if commands["deploy"] is None:
        if is_node:
            scripts = _node_scripts(proj_dir)
            if "build" in scripts and "start" in scripts:
                commands["deploy"] = "npm install && npm run build && npm start"
            elif "build" in scripts and "preview" in scripts:
                commands["deploy"] = "npm install && npm run build && npm run preview"
            elif "start" in scripts:
                commands["deploy"] = "npm install && npm start"
        elif is_python and commands["run"]:
            commands["deploy"] = commands["run"].replace(" --reload", "")
        elif kind == "static":
            commands["deploy"] = "python -m http.server"
        elif is_go:
            commands["deploy"] = "go build -o app.exe . && app.exe" if os.name == "nt" else "go build -o app . && ./app"

    # Documentation-only projects (markdown-heavy, no build manifest).
    has_docs = any(e.lower().endswith(".md") for e in entries)
    if not stacks and has_docs:
        stacks.append("Docs")
        kind = "docs"
    if not stacks:
        stacks.append("Unknown")

    return {"stacks": stacks, "kind": kind, "commands": commands}


def _subdirs_of(root: str):
    try:
        entries = sorted(os.listdir(root))
    except OSError:
        return []
    out = []
    for e in entries:
        if e.startswith(".") or e in _SKIP_DIRS:
            continue
        full = os.path.join(root, e)
        if os.path.isdir(full):
            out.append((e, full))
    return out


def _iter_projects(force: bool = False) -> dict:
    now = time.time()
    if not force and _PROJECTS_CACHE["data"] is not None and (now - _PROJECTS_CACHE["ts"]) < _PROJECTS_CACHE_TTL:
        return _PROJECTS_CACHE["data"]

    roots = _get_project_roots()
    sub_roots = {_normcase(r) for r in roots[1:]}
    tools = _toolchain_status()

    groups = []
    for idx, root in enumerate(roots, start=1):
        projects = []
        for name, full in _subdirs_of(root):
            if _normcase(full) in sub_roots:
                continue  # a sub-root is listed as its own group, not a child project
            stack = _detect_stack(full)
            issues = _project_issues(stack["commands"], tools)
            projects.append({
                "id": hashlib.sha1(full.encode("utf-8", "ignore")).hexdigest()[:12],
                "name": name,
                "title": _humanize_name(name),
                "path": full,
                "scope": _read_scope(full),
                "stacks": stack["stacks"],
                "kind": stack["kind"],
                "commands": stack["commands"],
                "issues": issues,
            })
        groups.append({
            "index": idx,
            "root": root,
            "rootName": os.path.basename(root) or root,
            "count": len(projects),
            "projects": projects,
        })

    result = {
        "roots": [g["root"] for g in groups],
        "groups": groups,
        "total": sum(g["count"] for g in groups),
        "tools": tools,
    }
    _PROJECTS_CACHE["data"] = result
    _PROJECTS_CACHE["ts"] = now
    return result


def _build_tree(proj_dir: str, max_entries: int = 400, max_depth: int = 4) -> list[str]:
    lines: list[str] = []

    def walk(d: str, prefix: str, depth: int):
        if len(lines) >= max_entries or depth > max_depth:
            return
        try:
            entries = sorted(os.listdir(d))
        except OSError:
            return
        dirs = [e for e in entries if os.path.isdir(os.path.join(d, e))]
        files = [e for e in entries if os.path.isfile(os.path.join(d, e))]
        for e in dirs:
            if e in _SKIP_DIRS or e.startswith("."):
                continue
            lines.append(prefix + "📁 " + e + "/")
            walk(os.path.join(d, e), prefix + "    ", depth + 1)
        for e in files:
            if len(lines) >= max_entries:
                return
            lines.append(prefix + "📄 " + e)

    walk(proj_dir, "", 0)
    return lines[:max_entries]


def _collect_source_files(proj_dir: str, max_files: int = 12) -> list[dict]:
    key_files: list[dict] = []
    other_files: list[dict] = []
    for dirpath, dirnames, filenames in os.walk(proj_dir):
        dirnames[:] = [d for d in dirnames if d not in _SKIP_DIRS and not d.startswith(".")]
        for fn in sorted(filenames):
            ext = os.path.splitext(fn)[1].lower()
            base = os.path.basename(fn)
            key = base in _KEY_FILES or fn.lower() in {
                "dockerfile", "makefile", "package.json", "requirements.txt", "pyproject.toml",
            }
            if ext not in _TEXT_EXTS and not key:
                continue
            rel = os.path.relpath(os.path.join(dirpath, fn), proj_dir).replace(os.sep, "/")
            entry = {"name": rel}
            if key:
                key_files.append(entry)
            elif len(other_files) < 60:
                other_files.append(entry)

    chosen = (key_files + other_files)[:max_files]
    out = []
    for e in chosen:
        content = _read_text(os.path.join(proj_dir, e["name"]), max_chars=8000)
        out.append({"name": e["name"], "content": content})
    return out


def _collect_images(proj_dir: str, max_images: int = 120) -> list[dict]:
    out: list[dict] = []
    for dirpath, dirnames, filenames in os.walk(proj_dir):
        dirnames[:] = [d for d in dirnames if d not in _SKIP_DIRS and not d.startswith(".")]
        for fn in sorted(filenames):
            if os.path.splitext(fn)[1].lower() in _IMAGE_EXTS:
                rel = os.path.relpath(os.path.join(dirpath, fn), proj_dir).replace(os.sep, "/")
                out.append({"name": rel, "size": os.path.getsize(os.path.join(dirpath, fn))})
                if len(out) >= max_images:
                    return out
    return out


# --------------------------------------------------------------------------- #
# Endpoints
# --------------------------------------------------------------------------- #
def _run_command_core(path: str, action: str, command: str, timeout: int):
    """Run a command for one project. Always returns (dict, http_status|None)."""
    proj = _resolve_project_path(path)
    if not proj:
        return {"error": "Unknown project path"}, 400
    if action not in {"build", "deploy", "run", "test", "install", "custom"}:
        return {"error": "Unknown action"}, 400

    # Run in the effective project root so nested projects find their files.
    proj = _find_project_root(proj)
    detected = _detect_stack(proj)
    if not command:
        if action == "install":
            command = detected["commands"].get("install") or ""
        else:
            command = detected["commands"].get(action) or ""
    if not command:
        return {
            "ok": False, "command": "", "path": proj, "action": action,
            "exitCode": None, "stdout": "", "stderr": "No command detected for this action.",
            "duration": 0.0, "noCommand": True,
        }, None
    if not timeout:
        timeout = _ACTION_TIMEOUTS.get(action, 120)

    # Fast-fail with a clear message when the required toolchain is missing.
    tool = _command_tool(command)
    tools = _toolchain_status()
    if tool == "docker" and not tools.get("docker"):
        return {
            "ok": False, "command": command, "path": proj, "action": action,
            "exitCode": None, "stdout": "", "duration": 0.0,
            "stderr": "Docker CLI is not installed on this machine.", "toolMissing": "docker",
        }, None
    if tool == "docker" and not tools.get("docker_running"):
        return {
            "ok": False, "command": command, "path": proj, "action": action,
            "exitCode": None, "stdout": "", "duration": 0.0,
            "stderr": "Docker daemon is not running. Start Docker Desktop first.", "toolMissing": "docker",
        }, None
    if tool and tool not in ("python", "npm") and not tools.get(tool):
        return {
            "ok": False, "command": command, "path": proj, "action": action,
            "exitCode": None, "stdout": "", "duration": 0.0,
            "stderr": f"'{tool}' is not installed on this machine.", "toolMissing": tool,
        }, None

    started = time.time()
    try:
        proc = subprocess.run(
            command, cwd=proj, shell=True, capture_output=True, text=True,
            timeout=timeout, env={**os.environ},
        )
        out_all = (proc.stdout or "") + (proc.stderr or "")
        no_tests = action == "test" and (
            (proc.returncode == 5 and "pytest" in command)
            or "no test specified" in out_all.lower()
            or "no tests found" in out_all.lower()
        )
        return {
            "ok": proc.returncode == 0 or no_tests,
            "noTests": no_tests,
            "command": command,
            "path": proj,
            "action": action,
            "exitCode": proc.returncode,
            "stdout": (proc.stdout or "")[-20000:],
            "stderr": (proc.stderr or "")[-20000:],
            "duration": round(time.time() - started, 2),
        }, None
    except subprocess.TimeoutExpired as e:
        return {
            "ok": False,
            "command": command,
            "path": proj,
            "action": action,
            "timedOut": True,
            "exitCode": None,
            "stdout": ((e.stdout or "")[-20000:] if isinstance(e.stdout, str) else ""),
            "stderr": ((e.stderr or "")[-20000:] if isinstance(e.stderr, str) else ""),
            "duration": round(time.time() - started, 2),
        }, None
    except Exception as e:
        return {
            "ok": False,
            "command": command,
            "path": proj,
            "action": action,
            "error": str(e)[:500],
            "duration": round(time.time() - started, 2),
        }, None


# --------------------------------------------------------------------------- #
# Background processes (Run / Deploy servers) — start, inspect, stop
# --------------------------------------------------------------------------- #
_PROCS: dict = {}
_PROCS_LOCK = threading.Lock()
_LOG_DIR = os.path.join(tempfile.gettempdir(), "aihub-project-logs")
_URL_RE = re.compile(r"https?://(?:localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1?\]):(\d{2,5})[^\s'\"<>]*")
_ANSI_RE = re.compile(r"\x1b\[[0-9;]*[A-Za-z]")


def _free_port() -> int:
    with socket.socket() as sock:
        sock.bind(("127.0.0.1", 0))
        return sock.getsockname()[1]


def _port_open(port: int) -> bool:
    try:
        with socket.create_connection(("127.0.0.1", int(port)), timeout=0.25):
            return True
    except OSError:
        return False


def _uses_vite(proj: str) -> bool:
    try:
        with open(os.path.join(proj, "package.json"), encoding="utf-8") as f:
            pkg = json.load(f)
        deps = {**pkg.get("dependencies", {}), **pkg.get("devDependencies", {})}
        return "vite" in deps
    except Exception:
        return False


def _with_port(command: str, port: int, proj: str) -> str:
    """Give each server its own free port so projects never collide with each
    other or with this app (5273 / 9000 / 9001)."""
    c = command
    if "uvicorn" in c and "--port" not in c:
        c += f" --port {port}"
    elif "http.server" in c and not re.search(r"http\.server\s+\d+", c):
        c += f" {port}"
    elif re.search(r"npm (run )?(dev|preview|start|serve)\b", c) and _uses_vite(proj) and "--port" not in c:
        c += f" -- --port {port}"
    return c


def _is_background(action: str, command: str) -> bool:
    if action == "run":
        return True
    return action == "deploy" and not command.strip().startswith("docker")


def _kill_tree(proc) -> None:
    try:
        if os.name == "nt":
            subprocess.run(f"taskkill /PID {proc.pid} /T /F", shell=True, capture_output=True, timeout=15)
        else:
            import signal
            os.killpg(os.getpgid(proc.pid), signal.SIGTERM)
    except Exception:
        try:
            proc.kill()
        except Exception:
            pass


def _tail(path: str, n: int = 8000) -> str:
    try:
        with open(path, "rb") as f:
            f.seek(0, 2)
            size = f.tell()
            f.seek(max(0, size - n))
            return _ANSI_RE.sub("", f.read().decode("utf-8", "replace"))
    except OSError:
        return ""


def _proc_info(rec: dict, with_log: bool = False) -> dict:
    alive = rec["proc"].poll() is None
    log = _tail(rec["log"], 12000)
    # Servers often print their own port (e.g. Next.js ignoring PORT) — probe
    # every port mentioned in the log plus the one we assigned.
    found = [(m.group(0).rstrip(".,);").replace("0.0.0.0", "localhost"), int(m.group(1))) for m in _URL_RE.finditer(log)]
    url, listening = "", False
    if alive:
        for u, port in reversed(found):
            if _port_open(port):
                url, listening = u, True
                break
        if not listening and _port_open(rec["port"]):
            url, listening = f"http://localhost:{rec['port']}", True
    info = {
        "path": rec["path"], "action": rec["action"], "command": rec["command"], "pid": rec["proc"].pid,
        "port": rec["port"], "url": url if alive else "", "listening": listening,
        "status": "running" if alive else ("stopped" if rec.get("stopped") else "exited"),
        "exitCode": None if alive else rec["proc"].returncode,
        "started": rec["started"], "uptime": round(time.time() - rec["started"], 1),
    }
    if with_log:
        info["log"] = log[-8000:]
    return info


def _start_background(proj: str, action: str, command: str) -> dict:
    key = _normcase(proj)
    with _PROCS_LOCK:
        cur = _PROCS.get(key)
        if cur and cur["proc"].poll() is None:
            info = _proc_info(cur, with_log=True)
            info.update({"ok": True, "background": True, "alreadyRunning": True})
            return info
        port = _free_port()
        cmd = _with_port(command, port, proj)
        os.makedirs(_LOG_DIR, exist_ok=True)
        log_path = os.path.join(_LOG_DIR, f"{hashlib.md5(key.encode()).hexdigest()[:10]}-{action}.log")
        logf = open(log_path, "w", encoding="utf-8", errors="replace")
        env = {**os.environ, "PORT": str(port), "PYTHONUNBUFFERED": "1", "BROWSER": "none", "FORCE_COLOR": "0", "CI": "true"}
        kwargs = {"creationflags": subprocess.CREATE_NEW_PROCESS_GROUP} if os.name == "nt" else {"start_new_session": True}
        proc = subprocess.Popen(cmd, cwd=proj, shell=True, stdout=logf, stderr=subprocess.STDOUT, env=env, **kwargs)
        rec = {"path": proj, "action": action, "command": cmd, "proc": proc, "port": port,
               "log": log_path, "started": time.time(), "logf": logf}
        _PROCS[key] = rec
    time.sleep(1.5)  # let it print its first lines / fail fast
    info = _proc_info(rec, with_log=True)
    info.update({"ok": info["status"] == "running" or info["exitCode"] == 0, "background": True})
    return info


# --------------------------------------------------------------------------- #
# Batch jobs — run Install / Build / Test across many projects in the background
# --------------------------------------------------------------------------- #
_JOBS: dict = {}
_BATCH_ACTIONS = {"build", "test", "install"}


def _compact(r: dict) -> dict:
    out = (r.get("stderr") or "") if not r.get("ok") else (r.get("stdout") or "")
    return {
        "path": r.get("path"), "name": os.path.basename(r.get("path") or ""), "ok": bool(r.get("ok")),
        "noCommand": r.get("noCommand", False), "noTests": r.get("noTests", False),
        "toolMissing": r.get("toolMissing"), "timedOut": r.get("timedOut", False),
        "exitCode": r.get("exitCode"), "duration": r.get("duration"), "command": r.get("command", ""),
        "output": (r.get("error") or out or "")[-2500:],
    }


def _run_job(job: dict, targets: list, command: str, timeout: int) -> None:
    from concurrent.futures import ThreadPoolExecutor

    def one(proj):
        if job["cancel"]:
            return None
        job["current"].add(os.path.basename(proj))
        try:
            res, _status = _run_command_core(proj, job["action"], command, timeout)
        except Exception as e:
            res = {"ok": False, "path": proj, "error": str(e)[:300]}
        finally:
            job["current"].discard(os.path.basename(proj))
        c = _compact(res if res.get("path") else {**res, "path": proj})
        with _PROCS_LOCK:
            job["results"].append(c)
            job["done"] += 1
            if c["noCommand"]:
                job["skipped"] += 1
            elif c["ok"]:
                job["ok"] += 1
            else:
                job["failed"] += 1
        return c

    with ThreadPoolExecutor(max_workers=3) as ex:
        list(ex.map(one, targets))
    job["finished"] = time.time()
    job["status"] = "cancelled" if job["cancel"] else "done"


def _job_view(job: dict, since: int = 0) -> dict:
    return {
        "id": job["id"], "action": job["action"], "status": job["status"], "total": job["total"],
        "done": job["done"], "ok": job["ok"], "failed": job["failed"], "skipped": job["skipped"],
        "current": sorted(job["current"]), "started": job["started"], "finished": job.get("finished"),
        "elapsed": round((job.get("finished") or time.time()) - job["started"], 1),
        "results": job["results"][since:], "next": len(job["results"]),
    }


def register_projects_api(app):
    @app.get("/api/projects")
    def list_projects(force: int = 0):
        return _iter_projects(force=bool(force))

    @app.get("/api/projects/detail")
    def project_detail(path: str = ""):
        proj = _resolve_project_path(path)
        if not proj:
            return JSONResponse({"error": "Unknown project path"}, status_code=404)

        title = _humanize_name(os.path.basename(proj))
        root = _find_project_root(proj)
        readme = ""
        readme_file = None
        for c in ("README.md", "README.txt", "readme.md", "PROJECT_DOCUMENTATION.md", "DOCUMENTATION.md"):
            fp = os.path.join(root, c)
            if os.path.isfile(fp):
                readme_file = c
                readme = _read_text(fp, max_chars=80000)
                break
        if not readme:
            readme = _synthesize_readme(root, title)
            readme_file = "(auto-generated)"

        return {
            "name": os.path.basename(proj),
            "title": title,
            "path": proj,
            "readmeFile": readme_file,
            "readme": readme,
            "tree": _build_tree(proj),
            "source": _collect_source_files(proj),
            "images": _collect_images(proj),
        }

    @app.get("/api/projects/file")
    def project_file(path: str = "", name: str = ""):
        proj = _resolve_project_path(path)
        if not proj:
            return JSONResponse({"error": "Unknown project path"}, status_code=404)
        if not name:
            return JSONResponse({"error": "Missing file name"}, status_code=400)

        candidate = os.path.realpath(os.path.join(proj, name))
        safe = os.path.realpath(proj)
        if _normcase(candidate) != _normcase(safe) and not _normcase(candidate).startswith(_normcase(safe) + os.sep):
            return JSONResponse({"error": "Path escapes project folder"}, status_code=400)
        if not os.path.isfile(candidate):
            return JSONResponse({"error": "File not found"}, status_code=404)
        return FileResponse(candidate)

    @app.post("/api/projects/run")
    def run_project_command(body: dict):
        path = body.get("path") or ""
        action = str(body.get("action") or "run").strip().lower()
        command = str(body.get("command") or "").strip()
        try:
            timeout = int(body.get("timeout") or 0)
        except (TypeError, ValueError):
            timeout = 0

        proj = _resolve_project_path(path)
        if proj and action in ("run", "deploy"):
            root = _find_project_root(proj)
            cmd = command or _detect_stack(root)["commands"].get(action) or ""
            if cmd and _is_background(action, cmd):
                tool = _command_tool(cmd)
                tools = _toolchain_status()
                if tool and tool not in ("python", "npm") and not tools.get(tool):
                    return {"ok": False, "command": cmd, "path": root, "action": action, "exitCode": None,
                            "stdout": "", "stderr": f"'{tool}' is not installed on this machine.", "toolMissing": tool}
                return _start_background(root, action, cmd)
        result, status = _run_command_core(path, action, command, timeout)
        if status:
            return JSONResponse(result, status_code=status)
        return result

    @app.get("/api/projects/processes")
    def list_processes():
        with _PROCS_LOCK:
            recs = list(_PROCS.values())
        return {"processes": [_proc_info(r) for r in recs]}

    @app.get("/api/projects/logs")
    def process_logs(path: str = ""):
        rec = _PROCS.get(_normcase(_find_project_root(path))) or _PROCS.get(_normcase(path))
        if not rec:
            return JSONResponse({"error": "No process for this project"}, status_code=404)
        return _proc_info(rec, with_log=True)

    @app.post("/api/projects/stop")
    def stop_process(body: dict):
        path = body.get("path") or ""
        rec = _PROCS.get(_normcase(_find_project_root(path))) or _PROCS.get(_normcase(path))
        if not rec:
            return JSONResponse({"error": "No process for this project"}, status_code=404)
        if rec["proc"].poll() is None:
            _kill_tree(rec["proc"])
            rec["stopped"] = True
            try:
                rec["proc"].wait(timeout=10)
            except Exception:
                pass
        try:
            rec["logf"].close()
        except Exception:
            pass
        return _proc_info(rec, with_log=True)

    @app.get("/api/projects/batch")
    def batch_status(id: str = "", since: int = 0):
        job = _JOBS.get(id)
        if not job:
            return JSONResponse({"error": "Unknown batch job"}, status_code=404)
        return _job_view(job, since)

    @app.post("/api/projects/batch/cancel")
    def batch_cancel(body: dict):
        job = _JOBS.get(body.get("id") or "")
        if not job:
            return JSONResponse({"error": "Unknown batch job"}, status_code=404)
        job["cancel"] = True
        return _job_view(job, len(job["results"]))

    @app.post("/api/projects/run-batch")
    def run_batch(body: dict):
        action = str(body.get("action") or "run").strip().lower()
        paths = body.get("paths") or []
        command = str(body.get("command") or "").strip()
        try:
            timeout = int(body.get("timeout") or 0)
        except (TypeError, ValueError):
            timeout = 0

        targets: list[str] = []
        if paths:
            for p in paths:
                resolved = _resolve_project_path(p)
                if resolved:
                    targets.append(resolved)
        else:
            for g in _iter_projects()["groups"]:
                for p in g["projects"]:
                    targets.append(p["path"])

        if not targets:
            return JSONResponse({"error": "No projects to run"}, status_code=400)
        if action not in _BATCH_ACTIONS:
            return JSONResponse({"error": "Batch supports install, build and test (Run/Deploy start servers — use them per project)."}, status_code=400)

        job = {"id": uuid.uuid4().hex[:12], "action": action, "status": "running", "total": len(targets),
               "done": 0, "ok": 0, "failed": 0, "skipped": 0, "results": [], "current": set(),
               "cancel": False, "started": time.time()}
        _JOBS[job["id"]] = job
        threading.Thread(target=_run_job, args=(job, targets, command, timeout), daemon=True).start()
        return _job_view(job)
