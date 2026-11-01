"""
Idea Brain — generates project ideas from real industry pain points and
scaffolds them into runnable project folders that the multi-agent crews can
then build / run / deploy.

Endpoints
---------
    GET  /api/brain/industries   -> curated industries + their 2026 pain points
    POST /api/brain/ideas        -> generate N project ideas for an industry (LLM)
    POST /api/brain/scaffold     -> create a new project folder + starter files

The LLM calls reuse the free-model client from agents_api (Ollama + OpenRouter).
"""
import os
import re
import json
import time
import hashlib

from fastapi.responses import JSONResponse

from projects_api import _get_project_roots, _humanize_name, _PROJECTS_CACHE
from agents_api import _complete, list_models

# --------------------------------------------------------------------------- #
# Curated industries + real 2026 pain points
# --------------------------------------------------------------------------- #
INDUSTRIES = [
    {
        "id": "healthcare",
        "label": "Healthcare",
        "icon": "🏥",
        "pains": [
            "Scattered patient data and poor interoperability block clinical AI from scaling",
            "Denied/delayed insurance claims and manual revenue-cycle work drain margins",
            "Staff drowning in paperwork instead of patient care",
            "Strict AI compliance (HIPAA, EU AI Act) makes adoption risky",
        ],
    },
    {
        "id": "finance",
        "label": "Finance & Banking",
        "icon": "🏦",
        "pains": [
            "Real-time fraud detection across high-volume payment rails",
            "AI credit-risk decisions need explainability for regulators",
            "Legacy core systems make real-time risk aggregation hard",
            "Compliance (KYC/AML) is manual, slow, and costly",
        ],
    },
    {
        "id": "logistics",
        "label": "Logistics & Supply Chain",
        "icon": "🚚",
        "pains": [
            "Supply chain disruptions detected too late to act",
            "Demand forecasting errors cause overstock and stockouts",
            "Fleet routing and delivery windows are suboptimal",
            "No end-to-end visibility across carriers and warehouses",
        ],
    },
    {
        "id": "education",
        "label": "Education",
        "icon": "🎓",
        "pains": [
            "One-size-fits-all curricula fail diverse learners",
            "Grading and feedback take hours of teacher time",
            "Students lack personalized, adaptive practice",
            "Cheating and AI-generated homework are hard to detect",
        ],
    },
    {
        "id": "manufacturing",
        "label": "Manufacturing",
        "icon": "🏭",
        "pains": [
            "Regulatory compliance and audits are manual",
            "Predictive maintenance on aging equipment is reactive",
            "Quality defects found only after production",
            "Data silos between OT (machines) and IT systems",
        ],
    },
    {
        "id": "retail",
        "label": "Retail & E-commerce",
        "icon": "🛒",
        "pains": [
            "High cart abandonment from poor personalization",
            "Inventory misallocation across stores and channels",
            "Returns and fraud cost margins",
            "Customer support can't scale at peak",
        ],
    },
    {
        "id": "cybersecurity",
        "label": "Cybersecurity",
        "icon": "🛡️",
        "pains": [
            "Alert fatigue drowns SOC teams",
            "Identity threats and insider risks are hard to detect",
            "Cloud misconfigurations cause breaches",
            "Incident response is slow and manual",
        ],
    },
    {
        "id": "energy",
        "label": "Energy & Climate",
        "icon": "⚡",
        "pains": [
            "Grid balancing with intermittent renewables is hard",
            "Energy demand forecasting is inaccurate",
            "Carbon accounting is manual and error-prone",
            "Anomalies in consumption signal waste or faults",
        ],
    },
    {
        "id": "gov",
        "label": "Government & Public Sector",
        "icon": "🏛️",
        "pains": [
            "Citizen service requests are slow to triage",
            "Document-heavy workflows resist automation",
            "Strict AI governance and auditability required",
            "Legacy systems block modernization",
        ],
    },
    {
        "id": "realestate",
        "label": "Real Estate",
        "icon": "🏢",
        "pains": [
            "Property valuation is subjective and slow",
            "Tenant churn and maintenance are reactive",
            "Market intelligence is scattered across sources",
            "Document review (leases, titles) is manual",
        ],
    },
    {
        "id": "legal",
        "label": "Legal",
        "icon": "⚖️",
        "pains": [
            "Document review and contract analysis are manual",
            "Legal research is slow and expensive",
            "Case outcome prediction lacks data",
            "E-discovery over huge document sets is costly",
        ],
    },
    {
        "id": "hr",
        "label": "HR & Recruiting",
        "icon": "👥",
        "pains": [
            "Resume screening is biased and slow",
            "Skills matching against roles is imprecise",
            "Employee churn signals are missed",
            "Interview scheduling is coordination overhead",
        ],
    },
]

_INDUSTRY_BY_ID = {i["id"]: i for i in INDUSTRIES}


# --------------------------------------------------------------------------- #
# Idea generation
# --------------------------------------------------------------------------- #
def _parse_ideas(text: str, fallback_name: str) -> list[dict]:
    """Parse a JSON array of ideas from an LLM reply, leniently."""
    text = text.strip()
    # Try the whole thing as JSON first.
    try:
        obj = json.loads(text)
        if isinstance(obj, list):
            return [i for i in obj if isinstance(i, dict)]
    except Exception:
        pass
    # Extract the first [ ... ] or { ... } block.
    m = re.search(r"(\[.*\]|\{.*\})", text, re.S)
    if m:
        try:
            obj = json.loads(m.group(1))
            if isinstance(obj, list):
                return [i for i in obj if isinstance(i, dict)]
            if isinstance(obj, dict):
                return [obj]
        except Exception:
            pass
    # Fall back to a single idea from the raw text.
    return [{
        "name": fallback_name,
        "tagline": text[:200] or fallback_name,
        "problem": "",
        "solution": "",
        "stack": "Python, FastAPI",
        "features": [],
    }]


def generate_ideas(industry: str, count: int, model: str) -> dict:
    ind = _INDUSTRY_BY_ID.get(industry) or _INDUSTRY_BY_ID["healthcare"]
    count = max(1, min(int(count or 4), 6))
    models = {m["id"] for m in list_models()["models"]}
    if model not in models:
        model = list_models()["default"] or model

    pains = "\n".join(f"- {p}" for p in ind["pains"])
    prompt = (
        f"You are an innovation brain. Generate {count} concrete, buildable software project ideas "
        f"that solve REAL problems in the {ind['label']} industry (2026).\n\n"
        f"Real pain points to target:\n{pains}\n\n"
        "For each idea output a JSON object with EXACTLY these keys:\n"
        '  "name": a short CamelCase project name (2-4 words),\n'
        '  "tagline": one-line pitch,\n'
        '  "problem": the real-world problem it solves,\n'
        '  "solution": how the software solves it,\n'
        '  "stack": recommended tech stack string (e.g. "Python, FastAPI, ChromaDB, React"),\n'
        '  "features": a JSON array of 4-6 key features.\n\n'
        "Reply with ONLY a JSON array of objects, no other text, no markdown fences."
    )
    text = _complete(
        model,
        "You generate high-value startup project ideas from industry pain points. Output strict JSON only.",
        prompt,
    )
    ideas = _parse_ideas(text, ind["label"] + " AI Solution")
    return {"industry": industry, "model": model, "ideas": ideas, "raw": text[:2000]}


# --------------------------------------------------------------------------- #
# Scaffolding
# --------------------------------------------------------------------------- #
_SLUG_RE = re.compile(r"[^a-zA-Z0-9]+")


def _slugify(name: str) -> str:
    s = _SLUG_RE.sub("_", name or "").strip("_")
    return s or "generated_project"


def _scaffold_target(name: str) -> str:
    """Choose a non-colliding folder path under the first project root."""
    root = _get_project_roots()[0]
    base = _slugify(name)
    target = os.path.join(root, base)
    n = 2
    while os.path.exists(target):
        target = os.path.join(root, f"{base}_{n}")
        n += 1
    return target


_PY_STARTER = '''"""%s — generated by the Idea Brain.

%s
"""
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="%s", version="0.1.0")


class Health(BaseModel):
    status: str
    project: str


@app.get("/")
def root():
    return {"message": "%s is running", "project": "%s"}


@app.get("/health")
def health() -> Health:
    return Health(status="ok", project="%s")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
'''

_PY_REQS = "fastapi\nuvicorn[standard]\npydantic\n"


def _write_scaffold(idea: dict, model: str) -> dict:
    name = idea.get("name") or "Generated Project"
    tagline = idea.get("tagline") or idea.get("solution") or ""
    problem = idea.get("problem") or ""
    solution = idea.get("solution") or ""
    features = idea.get("features") or []
    stack = idea.get("stack") or "Python, FastAPI"

    target = _scaffold_target(name)

    # Generate a full README via the model.
    readme_prompt = (
        f"Write a README.md for this project. Include: title, one-line tagline, the problem, "
        f"the solution, architecture (text diagram), tech stack, key features, local run steps, "
        f"and a roadmap. Output ONLY markdown.\n\n"
        f"Project: {name}\nTagline: {tagline}\nProblem: {problem}\nSolution: {solution}\n"
        f"Stack: {stack}\nFeatures: {', '.join(features)}"
    )
    readme = ""
    try:
        readme = _complete(model, "You write clean project README.md files in markdown.", readme_prompt)
    except Exception:
        pass
    if not readme:
        readme = f"# {name}\n\n{tagline}\n\n## Problem\n{problem}\n\n## Solution\n{solution}\n\n## Stack\n{stack}\n\n## Features\n" + "\n".join(f"- {f}" for f in features)

    os.makedirs(target, exist_ok=True)
    with open(os.path.join(target, "README.md"), "w", encoding="utf-8") as fh:
        fh.write(readme)
    with open(os.path.join(target, "main.py"), "w", encoding="utf-8") as fh:
        fh.write(_PY_STARTER % (name, tagline, name, name, name, name))
    with open(os.path.join(target, "requirements.txt"), "w", encoding="utf-8") as fh:
        fh.write(_PY_REQS)

    # Invalidate the projects cache so the new folder shows up immediately.
    _PROJECTS_CACHE["data"] = None
    _PROJECTS_CACHE["ts"] = 0.0

    return {
        "name": name,
        "title": _humanize_name(os.path.basename(target)),
        "path": target,
        "id": hashlib.sha1(target.encode("utf-8", "ignore")).hexdigest()[:12],
        "stack": stack,
        "features": features,
        "createdAt": time.time(),
    }


# --------------------------------------------------------------------------- #
# Endpoints
# --------------------------------------------------------------------------- #
def register_brain_api(app):
    @app.get("/api/brain/industries")
    def brain_industries():
        return {"industries": INDUSTRIES}

    @app.post("/api/brain/ideas")
    def brain_ideas(body: dict):
        industry = str(body.get("industry") or "healthcare")
        count = int(body.get("count") or 4)
        model = str(body.get("model") or "")
        return generate_ideas(industry, count, model)

    @app.post("/api/brain/scaffold")
    def brain_scaffold(body: dict):
        idea = body.get("idea") or {}
        if not isinstance(idea, dict) or not idea.get("name"):
            return JSONResponse({"error": "idea.name is required"}, status_code=400)
        model = str(body.get("model") or "")
        models = {m["id"] for m in list_models()["models"]}
        if model not in models:
            model = list_models()["default"] or model
        try:
            return _write_scaffold(idea, model)
        except Exception as e:
            return JSONResponse({"error": f"Scaffold failed: {str(e)[:300]}"}, status_code=500)
