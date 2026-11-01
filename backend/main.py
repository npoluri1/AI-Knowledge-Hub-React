from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from chapters_data import chapters, deep_dive_chapters
from market_api import router as market_router
from financial_advisor_api import router as advisor_router
from trading_api import router as trading_router
from catalog_api import router as catalog_router
import os
import glob
import subprocess
import re
import time

# ---------------------------------------------------------------------------
# Zero-dependency `.env` loader
# ---------------------------------------------------------------------------
# Lets EXTRA_SCAN_PATHS (and any other env-driven scan source) persist across
# commands instead of being reset every time the user shells in. Walks up to
# the project root looking for `.env`. Real `os.environ` values always win
# over the file, so CI / shell overrides still work.
_ENV_LOADED = False
def _load_dot_env():
    global _ENV_LOADED
    if _ENV_LOADED:
        return
    _ENV_LOADED = True
    candidates = [
        os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '.env')),
    ]
    for path_ in candidates:
        if not os.path.isfile(path_):
            continue
        try:
            with open(path_, 'r', encoding='utf-8') as fh:
                for raw_line in fh:
                    line = raw_line.strip()
                    if not line or line.startswith('#'):
                        continue
                    if '=' not in line:
                        continue
                    key, _, val = line.partition('=')
                    key = key.strip()
                    val = val.strip()
                    if len(val) >= 2 and (
                        (val[0] == '"' and val[-1] == '"') or
                        (val[0] == "'" and val[-1] == "'")
                    ):
                        val = val[1:-1]
                    if key and key not in os.environ:
                        os.environ[key] = val
            return  # first .env found wins
        except Exception:
            pass

_load_dot_env()

app = FastAPI(title="AI Knowledge Hub API", version="1.0.0")

app.include_router(market_router)
app.include_router(advisor_router)
app.include_router(trading_router)
app.include_router(catalog_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --------------------------------------------------------------------------- #
# /api/jobs — latest merged job listings
# --------------------------------------------------------------------------- #
_PROJECT_ROOT = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
_JOB_CANDIDATES = ("merged_ai_jobs.json", "topgenai_listings.json")


def _load_job_catalog():
    """Return (jobs, generated_at) preferring the newest merged catalog file."""
    best = None
    for name in _JOB_CANDIDATES:
        path = os.path.join(_PROJECT_ROOT, name)
        if not os.path.isfile(path):
            continue
        try:
            mtime = os.path.getmtime(path)
        except OSError:
            continue
        if best is None or mtime > best["mtime"]:
            best = {"path": path, "mtime": mtime}
    if best is None:
        return [], None
    import json as _json
    try:
        with open(best["path"], "r", encoding="utf-8", errors="replace") as fh:
            data = _json.load(fh)
    except Exception:
        return [], None
    jobs = data if isinstance(data, list) else (data.get("jobs") if isinstance(data, dict) else None)
    return (jobs or []), time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime(best["mtime"]))


@app.get("/api/jobs")
def jobs_api(source: str = "", limit: int = 6000):
    """Return the latest merged AI job listings.

    Reads the freshest of merged_ai_jobs.json / topgenai_listings.json in the
    project root so the "Fetch Latest" button always gets the newest snapshot.
    """
    jobs, generated_at = _load_job_catalog()
    if source:
        filtered = [j for j in jobs if (j.get("source") or "").lower() == source.lower()]
        if filtered:
            jobs = filtered
    total = len(jobs)
    if limit and limit > 0:
        jobs = jobs[:limit]
    return {"total": total, "generatedAt": generated_at, "jobs": jobs}


@app.get("/api/linkedin-posts/daily")
def linkedin_posts_daily_api(date: str = None, topic: str = "", profile: str = "", per_day: int = 4):
    """Fetch the deterministic 'daily' AI tech-stack posts for a given date."""
    try:
        data = _generate_daily_posts(date_str=date, topic=topic, profile=profile or None, limit=per_day)
    except Exception as exc:  # noqa: BLE001
        return JSONResponse(status_code=500, content={"error": f"Daily posts generation failed: {exc}"})
    return data


@app.get("/api/linkedin-posts/range")
def linkedin_posts_range_api(start: str = None, end: str = None, topic: str = "", profile: str = "", per_day: int = 4):
    """Fetch the daily posts for every day in a date range (calendar view)."""
    try:
        data = _generate_range_posts(
            start_date=start, end_date=end, topic=topic or None,
            profile=profile or None, per_day=per_day,
        )
    except Exception as exc:  # noqa: BLE001
        return JSONResponse(status_code=500, content={"error": f"Daily range generation failed: {exc}"})
    return data


@app.get("/api/linkedin-posts/profiles")
def linkedin_posts_profiles_api():
    """Profiles whose posts sections the daily fetch deep-links to."""
    return {"count": len(_daily_profiles()), "profiles": _daily_profiles()}


@app.get("/api/linkedin-posts/live")
def linkedin_posts_live_api(
    topic: str = "",
    max_results: int = 6,
    refresh: bool = False,
    all: bool = False,
    time_range: str = "month",
    date: str = "",
):
    """Fetch LIVE LinkedIn posts (via Tavily) for a tech-stack topic or a mixed set.
    time_range: month (default) | week | latest | any — recency bias for fresh searches.
    date: YYYY-MM-DD — keep only posts published that day (closest-date fallback + note).
    """
    try:
        if all:
            data = _fetch_live_posts(topic="__all__", max_results=max_results, refresh=False)
        elif date:
            data = _fetch_live_posts(
                topic=topic or None, max_results=max_results, refresh=refresh,
                time_range="any", date=date,
            )
        else:
            data = _fetch_live_posts(
                topic=topic or None, max_results=max_results, refresh=refresh,
                time_range=time_range,
            )
    except Exception as exc:  # noqa: BLE001
        return JSONResponse(status_code=502, content={"error": str(exc)})
    return data


@app.get("/api/linkedin-posts/img")
def linkedin_posts_img_proxy(url: str = ""):
    """Stream a LinkedIn CDN image so the browser can display it (media.licdn.com
    blocks cross-site hotlinking with 403 — proxy adds a browser UA + no referer)."""
    import requests as _rq
    if not url.startswith("http") or "licdn.com" not in url:
        return JSONResponse(status_code=400, content={"error": "only licdn.com image URLs are proxied"})
    try:
        upstream = _rq.get(
            url,
            headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/126.0", "Accept": "image/*"},
            timeout=15,
        )
        return Response(
            content=upstream.content,
            media_type=upstream.headers.get("content-type", "image/jpeg"),
            headers={"Cache-Control": "public, max-age=86400"},
        )
    except Exception as exc:  # noqa: BLE001
        return JSONResponse(status_code=502, content={"error": str(exc)})


@app.get("/api/linkedin-posts/live-topics")
def linkedin_posts_live_topics_api():
    """Topic keys available for the live feed."""
    return {"count": len(_live_topic_keys()), "topics": _live_topic_keys()}


@app.get("/api/linkedin-posts/topics")
def linkedin_posts_topics_api():
    """Return the full daily topic catalog the fetch endpoint composes from."""
    return {"count": len(_daily_topics()), "topics": _daily_topics()}


# --------------------------------------------------------------------------- #
# Search / chat helpers (kept exactly as before)
# --------------------------------------------------------------------------- #
import re

STOPWORDS = {"what", "is", "a", "an", "the", "how", "do", "does", "i", "you",
             "we", "they", "he", "she", "it", "are", "was", "were", "be",
             "have", "has", "had", "can", "could", "will", "would", "shall",
             "should", "may", "might", "must", "to", "of", "in", "for", "on",
             "with", "at", "by", "from", "as", "into", "through", "during",
             "before", "after", "above", "below", "between", "out", "off",
             "over", "under", "again", "further", "then", "once", "and",
             "but", "or", "nor", "not", "so", "yet", "both", "either",
             "neither", "each", "every", "all", "any", "few", "more", "most",
             "other", "some", "such", "no", "only", "own", "same",
             "about", "than", "too", "very", "just", "because", "also"}

def tokenize(text):
    words = re.findall(r'[a-z0-9+]+', text.lower())
    return [w for w in words if w not in STOPWORDS and len(w) > 1]

def text_matches(tokens, text):
    t = text.lower()
    return sum(1 for tok in tokens if tok in t)

SEC_TEXT_KEYS = ("heading", "text", "insight", "concept", "scenario", "warning")

def sec_text(sec):
    parts = []
    if isinstance(sec, dict):
        for k in SEC_TEXT_KEYS:
            v = sec.get(k)
            if v:
                parts.append(str(v))
        if "sections" in sec:
            for s in sec["sections"]:
                parts.append(sec_text(s))
    elif isinstance(sec, list):
        for s in sec:
            parts.append(sec_text(s))
    return " ".join(parts)

def search_secs_matched(secs, tokens, matched):
    for sec in secs:
        if isinstance(sec, dict):
            heading = sec.get("heading", "")
            body = sec_text(sec)
            h_count = text_matches(tokens, heading)
            b_count = text_matches(tokens, body)
            if h_count:
                matched.append((heading, 2 * h_count))
            if b_count and heading not in [m[0] for m in matched]:
                matched.append((heading, b_count))
        elif isinstance(sec, list):
            search_secs_matched(sec, tokens, matched)

def search_secs_score(secs, tokens):
    total = 0
    for sec in secs:
        if isinstance(sec, dict):
            total += 2 * text_matches(tokens, sec.get("heading", ""))
            total += text_matches(tokens, sec_text(sec))
        elif isinstance(sec, list):
            total += search_secs_score(sec, tokens)
    return total

@app.get("/")
def root():
    return {"service": "AI Knowledge Hub API", "version": "1.0.0"}

@app.get("/api/chapters")
def get_chapters():
    return chapters

@app.get("/api/chapters/{chapter_id}")
def get_chapter(chapter_id: str):
    for ch in chapters:
        if ch["id"] == chapter_id:
            return ch
    return {"error": "Chapter not found"}, 404

@app.get("/api/deep-dive")
def get_deep_dive_chapters():
    return deep_dive_chapters

@app.get("/api/deep-dive/{dive_id}")
def get_deep_dive(dive_id: str):
    for dd in deep_dive_chapters:
        if dd["id"] == dive_id:
            return dd
    return {"error": "Deep dive not found"}, 404

@app.get("/api/search")
def search_all(q: str = ""):
    if not q.strip():
        return {"results": [], "total": 0}
    tokens = tokenize(q)
    if not tokens:
        return {"results": [], "total": 0}
    results = []

    for ch in chapters:
        score = 0
        matched = []
        score += 3 * text_matches(tokens, ch.get("title", ""))
        score += 2 * text_matches(tokens, ch.get("preview", ""))
        score += text_matches(tokens, " ".join(ch.get("tags", [])))
        search_secs_matched(ch.get("sections", []), tokens, matched)
        score += sum(m[1] for m in matched)

        if score > 0:
            snippet = ch.get("preview", "")[:200]
            if matched:
                snippet = f"Found in: {', '.join(list(dict.fromkeys(m[0] for m in matched if m[0]))[:3])}"
            results.append({
                "type": "chapter", "chapter_id": ch["id"],
                "chapter_title": ch["title"],
                "section_heading": matched[0][0] if matched else None,
                "snippet": snippet,
                "score": min(score / 15, 1.0)
            })

    for dd in deep_dive_chapters:
        score = 0
        matched = []
        score += 3 * text_matches(tokens, dd.get("title", ""))
        score += 2 * text_matches(tokens, dd.get("description", ""))
        search_secs_matched(dd.get("sections", []), tokens, matched)
        score += sum(m[1] for m in matched)

        if score > 0:
            snippet = dd.get("description", "")[:200]
            if matched:
                snippet = f"Found in: {', '.join(list(dict.fromkeys(m[0] for m in matched if m[0]))[:3])}"
            results.append({
                "type": "deep-dive", "chapter_id": dd["id"],
                "chapter_title": dd["title"],
                "section_heading": matched[0][0] if matched else None,
                "snippet": snippet,
                "score": min(score / 15, 1.0)
            })

    results.sort(key=lambda x: x["score"], reverse=True)
    return {"results": results[:30], "total": len(results)}

@app.post("/api/chat")
def chat_endpoint(body: dict):
    message = body.get("message", "").strip()
    if not message:
        return {"answer": "Please ask a question about AI topics.", "sources": []}
    tokens = tokenize(message)
    if not tokens:
        return {"answer": "Please ask a more specific question.", "sources": []}
    results = []

    for ch in chapters:
        score = 0
        score += 4 * text_matches(tokens, ch.get("title", ""))
        score += 2 * text_matches(tokens, ch.get("preview", ""))
        score += text_matches(tokens, " ".join(ch.get("tags", [])))
        score += search_secs_score(ch.get("sections", []), tokens)
        if score > 0:
            results.append({
                "type": "chapter", "id": ch["id"], "title": ch["title"],
                "preview": ch.get("preview", ""), "score": score
            })

    for dd in deep_dive_chapters:
        score = 0
        score += 4 * text_matches(tokens, dd.get("title", ""))
        score += 2 * text_matches(tokens, dd.get("description", ""))
        score += search_secs_score(dd.get("sections", []), tokens)
        if score > 0:
            results.append({
                "type": "deep-dive", "id": dd["id"], "title": dd["title"],
                "preview": dd.get("description", ""), "score": score
            })

    results.sort(key=lambda x: x["score"], reverse=True)
    top = results[:5]

    if not top:
        return {
            "answer": "I couldn't find specific information about that topic in the AI Knowledge Hub. Try asking about RAG pipelines, AI agents, vector databases, LLM models, prompt engineering, GRC compliance, system design, or fine-tuning.",
            "sources": []
        }

    best = top[0]
    lines = [
        f"📚 Based on the **{best['title']}** chapter:",
        "",
        best['preview'][:400]
    ]
    if len(top) > 1:
        lines.append("")
        lines.append(f"🔗 Related topics: {', '.join([r['title'] for r in top[1:4]])}")

    answer = "\n".join(lines)
    sources = [{"type": r["type"], "id": r["id"], "title": r["title"]} for r in top[:4]]

    return {"answer": answer, "sources": sources}


# --------------------------------------------------------------------------- #
# File / folder scanning (NEW)
# --------------------------------------------------------------------------- #
IMAGE_EXTENSIONS = (".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp", ".bmp")
PDF_EXTENSIONS = (".pdf",)
DOCUMENT_EXTENSIONS = (".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx",
                       ".odt", ".ods", ".odp", ".rtf", ".ipynb", ".py")

MIME_BY_EXT = {
    ".png":  "image/png",
    ".jpg":  "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif":  "image/gif",
    ".svg":  "image/svg+xml",
    ".webp": "image/webp",
    ".bmp":  "image/bmp",
    ".pdf":  "application/pdf",
    ".doc":  "application/msword",
    ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ".xls":  "application/vnd.ms-excel",
    ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ".ppt":  "application/vnd.ms-powerpoint",
    ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ".ipynb": "application/x-ipynb+json",
    ".py": "text/x-python",
}

# Folders we never descend into (browser snapshots, JS tooling, build artifacts).
_SKIP_DIR_NAMES = frozenset({
    "node_modules", "__pycache__", "dist", "build", "venv", ".venv",
    ".git", ".next", ".cache", ".parcel-cache", ".idea", ".vscode",
    ".svn", ".hg", "target", "out",
})

# Extensions we treat as browser/tooling artifacts and skip silently.
_SKIP_EXT = frozenset({
    ".tmp", ".crdownload", ".partial", ".download", ".swp", ".bak",
    ".ds_store", "thumbs.db",
})

# Reserved slugs that have special-purpose URL prefixes, mapped 1:1 to the
# `frontend/public` subdirs. Any *extra* scan source gets a slugified name.
_RESERVED_SLUGS = {"images", "data", "documents"}


def _slugify_path(path: str) -> str:
    """Deterministic, filesystem-safe slug for a scan root.

    Strategy (per Thinker-with-Files review):
      • `D:/WorkSpace/LinkedIn_AI_TechStack_Images`
        → `linkedin_ai_techstack_images`
      • Lower-case, swap `\\` -> `/`, replace separators & non-word chars with `_`,
        collapse runs of `_`, strip leading/trailing `_`.
      • Falls back to `ext_<hash>` if the result collides with a reserved slug
        so we never confuse an external folder with `/images` or `/data`.
    """
    import hashlib, re
    norm = path.replace("\\", "/").rstrip("/")
    base = os.path.basename(norm) or norm
    base = base.lower()
    base = re.sub(r"[^a-z0-9]+", "_", base).strip("_")
    if not base:
        # Fall back to a hash of the full path so it's always stable.
        digest = hashlib.sha1(norm.encode("utf-8", errors="ignore")).hexdigest()[:8]
        base = f"ext_{digest}"
    if base in {"images", "data", "documents"}:
        # Disambiguate so we don't shadow the reserved slugs.
        digest = hashlib.sha1(norm.encode("utf-8", errors="ignore")).hexdigest()[:6]
        base = f"{base}_x_{digest}"
    return base[:64]  # hard cap so URL paths stay manageable


# Build the list of scan sources lazily so tests / env changes take effect.
def _get_scan_sources():
    """Return [{dir, abs_dir, slug, url, label, kind}] for every scan root.

    `kind` is `"public"` for built-in `frontend/public/{images,data}` folders
    (served by Vite / static hosts at their literal URL prefix) or `"extra"`
    for paths added via the `EXTRA_SCAN_PATHS` env var (served by FastAPI's
    `/api/raw/<slug>/` streaming route).
    """
    base = os.path.dirname(os.path.abspath(__file__))
    public_dir = os.path.normpath(os.path.join(base, "..", "frontend", "public"))
    sources = [
        {"dir": os.path.join(public_dir, "images"), "slug": "images", "url": "/images", "label": "images", "kind": "public"},
        {"dir": os.path.join(public_dir, "data"),   "slug": "data",   "url": "/data",   "label": "data",   "kind": "public"},
    ]

    # Extra scan paths come from EXTRA_SCAN_PATHS. Accept either a ;-separated list
    # or a JSON array. Unknown / missing folders are silently skipped.
    raw = os.environ.get("EXTRA_SCAN_PATHS", "").strip()
    if raw:
        candidates: list[str] = []
        if raw.startswith("["):
            try:
                import json
                parsed = json.loads(raw)
                if isinstance(parsed, list):
                    candidates = [str(p) for p in parsed if isinstance(p, (str, int, float))]
            except Exception:
                pass
        if not candidates:
            # Split on both `;` and newline to tolerate hand-typed env strings.
            candidates = [p.strip().strip('"').strip("'") for p in raw.replace("\n", ";").split(";") if p.strip()]
        for raw_path in candidates:
            try:
                abs_dir = os.path.normpath(os.path.abspath(raw_path))
            except Exception:
                continue
            if not os.path.isdir(abs_dir):
                continue
            slug = _slugify_path(abs_dir)
            if slug in {s["slug"] for s in sources}:
                continue  # collision after reserved rewrite; skip
            label = os.path.basename(abs_dir) or slug
            sources.append({
                "dir": abs_dir,
                "slug": slug,
                # Files from extra paths are streamed via FastAPI.
                "url": f"/api/raw/{slug}",
                "label": label,
                "kind": "extra",
            })

    # Normalize every directive (resolved, realpath-symmetric for safety).
    seen_slugs = set()
    deduped = []
    for s in sources:
        try:
            abs_dir = os.path.normpath(os.path.abspath(s["dir"]))
        except Exception:
            continue
        if not os.path.isdir(abs_dir):
            continue
        if s["slug"] in seen_slugs:
            continue
        seen_slugs.add(s["slug"])
        deduped.append({**s, "abs_dir": abs_dir})
    return deduped


def _slug_to_root_map():
    """Map slug -> absolute root directory for the /api/raw/<slug>/ route.

    Cached so we don't re-parse env vars + re-stat each request. Source paths
    don't change at runtime unless the user restarts the server, which is
    acceptable for now (matches typical FastAPI patterns for env-derived
    config). To force a refresh after changing EXTRA_SCAN_PATHS at runtime,
    clear the cache attribute manually:

        >>> _slug_to_root_map._cache = None
        >>> _slug_to_root_map()
    """
    cached = getattr(_slug_to_root_map, "_cache", None)
    if cached is not None:
        return cached
    result = {s["slug"]: s["abs_dir"] for s in _get_scan_sources() if s["kind"] == "extra"}
    _slug_to_root_map._cache = result
    return result


def _human_size(num_bytes: int) -> str:
    if num_bytes <= 0:
        return "0 B"
    k = 1024
    sizes = ("B", "KB", "MB", "GB", "TB")
    i = min(int((num_bytes.bit_length() - 1) / 10), len(sizes) - 1)
    return f"{num_bytes / (k ** i):.1f} {sizes[i]}" if i > 0 else f"{num_bytes} B"


def _classify(ext: str) -> str:
    if ext in IMAGE_EXTENSIONS:
        return "images"
    if ext in PDF_EXTENSIONS:
        return "pdfs"
    if ext in DOCUMENT_EXTENSIONS:
        return "documents"
    return "dataFiles"


def _walk_scannable_files(root: str):
    """Yield (rel_path, abs_path) for every scannable file under `root`.

    Subfolders are collapsed under the parent: each file's `rel_path` is the
    POSIX-style path relative to the scan root (e.g. `AI_stuff_docs/foo.docx`).
    Hidden directories (`.*`) and well-known tooling/build directories are
    skipped in-place so `os.walk` doesn't descend into them. Files missing an
    extension or with recognized browser/tooling extensions are skipped.
    """
    from urllib.parse import quote

    for dirpath, dirnames, filenames in os.walk(root):
        # Mutate `dirnames` in-place to prune branches before os.walk descends.
        # No need to sort: os.walk already iterates in filesystem order, and
        # we're just filtering — order doesn't affect correctness.
        dirnames[:] = [
            d for d in dirnames
            if d not in _SKIP_DIR_NAMES and not d.startswith(".")
        ]
        for fn in sorted(filenames):  # stable order -> reproducible manifest
            ext = os.path.splitext(fn)[1].lower()
            if not ext or ext in _SKIP_EXT:
                continue
            abs_path = os.path.join(dirpath, fn)
            try:
                st = os.stat(abs_path)
                size = st.st_size
                mtime = st.st_mtime
            except OSError:
                continue
            rel = os.path.relpath(abs_path, root).replace(os.sep, "/")
            # URL-encode the full relative path so spaces, parens, brackets,
            # etc. all survive Vite / FastAPI streaming.
            encoded = "/".join(quote(seg, safe="-_.~") for seg in rel.split("/"))
            yield rel, encoded, ext, size, mtime


_SCAN_CACHE = {"data": None, "ts": 0.0}
_SCAN_CACHE_TTL = 30.0

def scan_filesystem(force=False):
    """Walk the configured scan sources, return a manifest-like dict.

    Subfolders are collapsed under the parent scan root for UI simplicity:
    all files inside `D:/WorkSpace/LinkedIn_AI_TechStack_Images/AI_stuff_docs/`
    are attributed to the parent slug, with the relative path stored in
    `name` so the UI shows the full subfolder context. Streaming URLs use
    the relative path so `/api/raw/<slug>/<filename>` resolves
    correctly.

    Results are cached for `_SCAN_CACHE_TTL` seconds to avoid re-walking
    1500+ files on every API call. Pass `force=True` to bypass the cache.
    """
    now = time.time()
    if not force and _SCAN_CACHE["data"] is not None and (now - _SCAN_CACHE["ts"]) < _SCAN_CACHE_TTL:
        return _SCAN_CACHE["data"]
    sources = _get_scan_sources()
    seen = set()
    images, pdfs, documents, data_files, all_files = [], [], [], [], []
    per_source: dict[str, dict[str, int]] = {}

    for src in sources:
        root = src["abs_dir"]
        per_source[src["slug"]] = {
            "images": 0, "pdfs": 0, "documents": 0, "dataFiles": 0,
            "label": src["label"], "kind": src["kind"],
        }
        if not os.path.isdir(root):
            continue

        try:
            for rel, encoded, ext, size, mtime in _walk_scannable_files(root):
                key = f"{src['slug']}::{rel.lower()}"
                if key in seen:
                    continue
                seen.add(key)
                url = f"{src['url']}/{encoded}"

                record = {
                    "name": rel,                       # e.g. "AI_stuff_docs/foo.docx"
                    "display_name": os.path.basename(rel),  # e.g. "foo.docx"
                    "url": url,
                    "size": _human_size(size),
                    "bytes": size,
                    "type": ext.lstrip(".").upper(),
                    "ext": ext,
                    "bucket": _classify(ext),
                    "folder": src["slug"],
                    "source_label": src["label"],
                    "source_kind": src["kind"],
                    "mtime": mtime,
                    "mtime_display": time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(mtime)),
                }
                all_files.append(record)
                bucket = record["bucket"]
                if bucket == "images":
                    images.append(record); per_source[src["slug"]]["images"] += 1
                elif bucket == "pdfs":
                    pdfs.append(record); per_source[src["slug"]]["pdfs"] += 1
                elif bucket == "documents":
                    documents.append(record); per_source[src["slug"]]["documents"] += 1
                else:
                    data_files.append(record); per_source[src["slug"]]["dataFiles"] += 1
        except OSError:
            continue

    result = {
        "generatedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "scanPaths": [
            {"slug": s["slug"], "dir": s["abs_dir"], "kind": s["kind"], "label": s["label"]}
            for s in sources
        ],
        "images": images,
        "pdfs": pdfs,
        "documents": documents,
        "dataFiles": data_files,
        "allFiles": all_files,
        "perSource": per_source,
        "totals": {
            "images": len(images),
            "pdfs": len(pdfs),
            "documents": len(documents),
            "dataFiles": len(data_files),
            "total": len(all_files),
        },
    }

    _SCAN_CACHE["data"] = result
    _SCAN_CACHE["ts"] = now
    return result


@app.get("/api/images")
def list_images():
    """Legacy endpoint retained for compatibility. Returns all images + pdfs + documents (no cap)."""
    data = scan_filesystem()
    return {
        "images": [f["name"] for f in data["images"]],
        "pdfs": [f["name"] for f in data["pdfs"]],
        "documents": [f["name"] for f in data["documents"]],
        "count": len(data["images"]),
        "total": len(data["images"]),
        "pdf_count": len(data["pdfs"]),
        "doc_count": len(data["documents"]),
    }


@app.get("/api/files")
def list_all_files():
    """Return every file in the scan paths, fully described (no manifest write)."""
    return scan_filesystem()


# --------------------------------------------------------------------------- #
# /api/raw/<slug>/<name> — streaming file endpoint for extra scan sources.
#
# Why a streaming endpoint instead of letting Vite serve them:
#   1. The external folder at D:\WorkSpace\LinkedIn_AI_TechStack_Images lives
#      OUTSIDE frontend/public, so Vite's dev server refuses to serve it.
#   2. We avoid copying 1100+ images (~1 GB+) into the project tree.
#   3. Range requests let the browser resume large GIF downloads.
#
# Defense-in-depth path-traversal hardening (per Thinker review):
#   • Only known extra-slugs are accepted (no traversal through the slug).
#   • Slug must match `[a-z0-9_]` to avoid URL tricks.
#   • Filename URL-decoded by Starlette before reaching us; reject `..`,
#     `\\x00`, or anything that escapes the slug's realpath.
# --------------------------------------------------------------------------- #
import re as _re
import mimetypes as _mimetypes
from fastapi import Request
from fastapi.responses import StreamingResponse, Response

_DEFAULT_FALLBACK_TYPE = "application/octet-stream"
_RANGE_RE = _re.compile(r"^bytes=(\d*)-(\d*)$")
_STREAM_CHUNK_SIZE = 64 * 1024  # 64 KB


def _guess_media_type(name: str) -> str:
    ext = os.path.splitext(name)[1].lower()
    if ext in MIME_BY_EXT:
        return MIME_BY_EXT[ext]
    # Fall back to stdlib guess for anything else (.txt, .html, etc.).
    guess, _ = _mimetypes.guess_type(name)
    return guess or _DEFAULT_FALLBACK_TYPE


def _stream_file(file_path: str, media_type: str, range_header: str | None, total_size: int) -> Response:
    """Stream `file_path` in 64 KB chunks, optionally honoring a Range header."""
    start = 0
    end = total_size - 1
    status_code = 200
    headers = {
        "Accept-Ranges": "bytes",
        "Cache-Control": "public, max-age=86400",
        "X-Content-Type-Options": "nosniff",
    }

    if range_header:
        match = _RANGE_RE.match(range_header.strip())
        if not match:
            return Response(status_code=416, headers={"Content-Range": f"bytes */{total_size}"})
        start_str, end_str = match.group(1), match.group(2)
        if start_str == "" and end_str == "":
            return Response(status_code=416, headers={"Content-Range": f"bytes */{total_size}"})
        if start_str == "":
            # Suffix range, e.g. "bytes=-500" => last 500 bytes.
            length = int(end_str)
            if length == 0:
                return Response(status_code=416, headers={"Content-Range": f"bytes */{total_size}"})
            start = max(0, total_size - length)
            end = total_size - 1
        else:
            start = int(start_str)
            if end_str:
                end = min(int(end_str), total_size - 1)
        if start > end or start >= total_size:
            return Response(status_code=416, headers={"Content-Range": f"bytes */{total_size}"})
        status_code = 206
        headers["Content-Range"] = f"bytes {start}-{end}/{total_size}"

    length = end - start + 1

    def iter_chunks():
        with open(file_path, "rb") as fh:
            fh.seek(start)
            remaining = length
            while remaining > 0:
                chunk = fh.read(min(_STREAM_CHUNK_SIZE, remaining))
                if not chunk:
                    break
                remaining -= len(chunk)
                yield chunk

    headers["Content-Length"] = str(length)
    return StreamingResponse(iter_chunks(), status_code=status_code, media_type=media_type, headers=headers)


@app.get("/api/raw/{slug}/{filename:path}")
def stream_external_file(request: Request, slug: str, filename: str):
    """Serve a single file from an extra scan source folder by slug + name.

    Example: /api/raw/linkedin_ai_techstack_images/1693886840555.jpeg
    Honors HTTP Range requests for resumable downloads of large GIFs.
    """
    allowed = _slug_to_root_map()
    root = allowed.get(slug)
    if not root:
        return JSONResponse({"error": f"Unknown source bucket '{slug}'"}, status_code=404)

    # Slug must match `[a-z0-9_]` to avoid URL tricks; filename can include
    # spaces, ampersands, etc. (FastAPI already URL-decoded it).
    if not _re.fullmatch(r"[a-z0-9_]{1,64}", slug):
        return JSONResponse({"error": "Invalid source bucket id"}, status_code=400)

    # Reject obviously bad inputs up front.
    if not filename or filename.startswith("/") or "\x00" in filename:
        return JSONResponse({"error": "Invalid filename"}, status_code=400)

    # Resolve candidate realpath and ensure it stays inside the slug's realpath.
    # On Windows the filesystem is case-insensitive but `os.path.realpath` does
    # not normalize case, so a path containing a different drive letter / casing
    # could fool a naive `startswith` check. Apply `os.path.normcase` so both
    # sides compare on a single canonical lowercase form.
    safe_root = os.path.realpath(root)
    candidate = os.path.realpath(os.path.join(safe_root, filename))
    if os.name == 'nt':
        safe_root_cmp = os.path.normcase(safe_root)
        candidate_cmp = os.path.normcase(candidate)
    else:
        safe_root_cmp = safe_root
        candidate_cmp = candidate
    sep = os.sep
    if candidate_cmp != safe_root_cmp and not candidate_cmp.startswith(safe_root_cmp + sep):
        return JSONResponse({"error": "Path escapes source folder"}, status_code=400)
    if not os.path.isfile(candidate):
        return JSONResponse({"error": "File not found"}, status_code=404)

    media_type = _guess_media_type(filename)
    try:
        total_size = os.path.getsize(candidate)
    except OSError:
        return JSONResponse({"error": "Cannot stat file"}, status_code=500)

    # Starlette's `request.headers` is already case-insensitive, so just "range".
    range_header = request.headers.get("range")
    return _stream_file(candidate, media_type, range_header, total_size)


# --------------------------------------------------------------------------- #
# /api/news/fetch — RSS feed fetcher for AI news sites
# --------------------------------------------------------------------------- #
import xml.etree.ElementTree as ET
import urllib.error
from urllib.request import urlopen, Request
from urllib.error import URLError, HTTPError
from concurrent.futures import ThreadPoolExecutor, as_completed
import html as _html_mod
import json as _json_mod
import json
import socket
import ssl

# Import the multi-strategy scraper for sources without RSS
from news_scraper import (
    fetch_via_scraping,
    try_sitemap,
    scrape_html_for_articles,
    try_common_rss_paths,
    fetch_url_content,
)

# Deterministic daily LinkedIn-style AI posts (curated topic catalog)
from linkedin_daily import (
    generate_daily_posts as _generate_daily_posts,
    generate_range_posts as _generate_range_posts,
    all_topics as _daily_topics,
    all_profiles as _daily_profiles,
)
from linkedin_live import fetch_live_posts as _fetch_live_posts, live_topic_keys as _live_topic_keys

# Multi-platform video hub (YouTube discovery + IG/TikTok/FB embeds + yt-dlp)
import video_hub_api as _vh


@app.get("/api/videos/topics")
def videos_topics_api():
    """Tech-stack topic catalog for the Video Hub (same 44 as LinkedIn)."""
    return _vh.video_topics()


@app.get("/api/videos/countries")
def videos_countries_api():
    """Countries available for market-biased video discovery (all networks)."""
    return {"countries": _vh.COUNTRIES, "default": "global"}


@app.get("/api/videos/languages")
def videos_languages_api():
    """Language catalog for the app-level language selector (90+ languages)."""
    return _vh.video_languages()


@app.get("/api/videos/discover")
def videos_discover_api(
    topic: str = "",
    start: str = "",
    end: str = "",
    max_results: int = 24,
    page_token: str = "",
    kind: str = "all",
    country: str = "global",
    lang: str = "auto",
):
    """Date-wise YouTube discovery (official Data API v3) for a tech-stack topic.
    kind: all | shorts | long. Up to 5 years back via start/end (YYYY-MM-DD).
    country biases results to that market, lang to that language."""
    try:
        return _vh.discover_youtube(
            topic=topic or None, start=start or None, end=end or None,
            max_results=max_results, page_token=page_token or "", kind=kind or "all",
            country=country, lang=lang,
        )
    except Exception as exc:  # noqa: BLE001
        return JSONResponse(status_code=502, content={"error": str(exc)})


@app.get("/api/videos/discover-all")
def videos_discover_all_api(
    start: str = "",
    end: str = "",
    max_results: int = 240,
    kind: str = "all",
    per_topic: int = 6,
    country: str = "global",
    lang: str = "auto",
):
    """Load videos for ALL 44 tech-stack topics in one parallel fan-out."""
    try:
        return _vh.discover_all_youtube(start=start or None, end=end or None,
                                        max_results=max_results, kind=kind or "all",
                                        per_topic=per_topic, country=country, lang=lang)
    except Exception as exc:  # noqa: BLE001
        return JSONResponse(status_code=502, content={"error": str(exc)})


@app.get("/api/videos/discover-tiktok")
def videos_discover_tiktok_api(tag: str = "ai", max_results: int = 18, start: str = "", end: str = "", country: str = "global", lang: str = "auto"):
    """Real TikTok videos via public tag feeds (keyless, official embed), date-filtered."""
    try:
        return _vh.discover_tiktok(tag=tag, max_results=max_results, start=start or None, end=end or None, country=country, lang=lang)
    except Exception as exc:  # noqa: BLE001
        return JSONResponse(status_code=502, content={"error": str(exc)})


@app.get("/api/videos/discover-facebook")
def videos_discover_facebook_api(tag: str = "ai", max_results: int = 18, start: str = "", end: str = "", country: str = "global", lang: str = "auto"):
    """Real public Facebook videos (keyless, official oEmbed), date-filtered."""
    try:
        return _vh.discover_facebook(tag=tag, max_results=max_results, start=start or None, end=end or None, country=country, lang=lang)
    except Exception as exc:  # noqa: BLE001
        return JSONResponse(status_code=502, content={"error": str(exc)})


@app.get("/api/videos/discover-all-tiktok")
def videos_discover_all_tiktok_api(max_results: int = 120, per_topic: int = 6, start: str = "", end: str = "", country: str = "global", lang: str = "auto"):
    """TikTok fan-out across ALL tech-stack topics in one parallel call."""
    try:
        return _vh.discover_all_tiktok(max_results=max_results, per_topic=per_topic, start=start or None, end=end or None, country=country, lang=lang)
    except Exception as exc:  # noqa: BLE001
        return JSONResponse(status_code=502, content={"error": str(exc)})


@app.get("/api/videos/discover-all-facebook")
def videos_discover_all_facebook_api(max_results: int = 120, per_topic: int = 6, start: str = "", end: str = "", country: str = "global", lang: str = "auto"):
    """Facebook fan-out across ALL tech-stack topics in one parallel call."""
    try:
        return _vh.discover_all_facebook(max_results=max_results, per_topic=per_topic, start=start or None, end=end or None, country=country, lang=lang)
    except Exception as exc:  # noqa: BLE001
        return JSONResponse(status_code=502, content={"error": str(exc)})


@app.get("/api/videos/discover-instagram")
def videos_discover_instagram_api(tag: str = "ai", max_results: int = 18, start: str = "", end: str = "", country: str = "global", lang: str = "auto"):
    """Real public Instagram reels (keyless, official embed), date-filtered."""
    try:
        return _vh.discover_instagram(tag=tag, max_results=max_results, start=start or None, end=end or None, country=country, lang=lang)
    except Exception as exc:  # noqa: BLE001
        return JSONResponse(status_code=502, content={"error": str(exc)})


@app.get("/api/videos/discover-all-instagram")
def videos_discover_all_instagram_api(max_results: int = 120, per_topic: int = 6, start: str = "", end: str = "", country: str = "global", lang: str = "auto"):
    """Instagram fan-out across ALL tech-stack topics in one parallel call."""
    try:
        return _vh.discover_all_instagram(max_results=max_results, per_topic=per_topic, start=start or None, end=end or None, country=country, lang=lang)
    except Exception as exc:  # noqa: BLE001
        return JSONResponse(status_code=502, content={"error": str(exc)})


@app.get("/api/videos/discover-all-networks")
def videos_discover_all_networks_api(max_per_network: int = 120, per_topic: int = 6, start: str = "", end: str = "", country: str = "global", lang: str = "auto"):
    """YouTube + X + TikTok + Instagram + Facebook, ALL topics, one merged feed, date-filtered."""
    try:
        return _vh.discover_all_networks(max_per_network=max_per_network, per_topic=per_topic, start=start or None, end=end or None, country=country, lang=lang)
    except Exception as exc:  # noqa: BLE001
        return JSONResponse(status_code=502, content={"error": str(exc)})


@app.get("/api/videos/discover-x")
def videos_discover_x_api(tag: str = "ai", max_results: int = 18, start: str = "", end: str = "", country: str = "global", lang: str = "auto"):
    """Real X/Twitter video posts (keyless, official oEmbed), date-filtered."""
    try:
        return _vh.discover_x(tag=tag, max_results=max_results, start=start or None, end=end or None, country=country, lang=lang)
    except Exception as exc:  # noqa: BLE001
        return JSONResponse(status_code=502, content={"error": str(exc)})


@app.get("/api/videos/discover-all-x")
def videos_discover_all_x_api(max_results: int = 120, per_topic: int = 6, start: str = "", end: str = "", country: str = "global", lang: str = "auto"):
    """X fan-out across ALL tech-stack topics in one parallel call."""
    try:
        return _vh.discover_all_x(max_results=max_results, per_topic=per_topic, start=start or None, end=end or None, country=country, lang=lang)
    except Exception as exc:  # noqa: BLE001
        return JSONResponse(status_code=502, content={"error": str(exc)})


@app.get("/api/videos/metadata")
def videos_metadata_api(url: str = ""):
    """Metadata + official embed for any pasted YouTube/IG/TikTok/FB URL."""
    if not url:
        return JSONResponse(status_code=400, content={"error": "url required"})
    return _vh.fetch_url_metadata(url)


@app.post("/api/videos/download")
def videos_download_api(url: str = "", quality: str = "720p"):
    """Start a local yt-dlp download (background job)."""
    if not url:
        return JSONResponse(status_code=400, content={"error": "url required"})
    job = _vh.start_download(url, quality)
    if job.get("error"):
        return JSONResponse(status_code=400, content=job)
    return job


@app.get("/api/videos/download-status")
def videos_download_status_api(job_id: str = ""):
    return _vh.download_status(job_id)


@app.get("/api/videos/downloads")
def videos_downloads_api():
    """List the local downloads library (exports/videos)."""
    return _vh.list_downloads()


@app.get("/api/videos/file")
def videos_file_api(name: str = ""):
    """Stream a downloaded video/audio file for in-app playback or saving."""
    from fastapi.responses import FileResponse
    path = _vh.serve_video_file(name)
    if not path:
        return JSONResponse(status_code=404, content={"error": "file not found"})
    media = "video/mp4"
    if path.endswith((".m4a", ".mp3")):
        media = "audio/mp4" if path.endswith(".m4a") else "audio/mpeg"
    elif path.endswith(".webm"):
        media = "video/webm"
    return FileResponse(path, media_type=media, filename=os.path.basename(path))

# `socket.setdefaulttimeout(10)` was removed because it leaked a process-wide
# 10s default to the ASGI/Uvicorn worker sockets. When the RSS fetch loop held
# an HTTP connection idle for >10s while pulling feeds, Uvicorn would silently
# drop the request, returning a chunked-encoding / connection-reset error to the
# browser ("Failed to fetch") well before our 60s client timeout fired. Every
# `urlopen(...)` caller in the RSS pipeline now passes an explicit `timeout=`
# so the cap only applies to outbound network reads — not HTTP accept sockets.
# socket.setdefaulttimeout(10)

# --------------------------------------------------------------------------- #
# Feed health / auto-discovery helpers
# --------------------------------------------------------------------------- #
# Minimal in-memory circuit breaker + RSS auto-discovery so we don't have to
# hand-code every corporate blog's feed URL.
# --------------------------------------------------------------------------- #
_FEED_HEALTH: dict[str, dict] = {}              # key -> {"fails": int, "next_retry": float, "last_err": str, "good_url": str}
_RSS_DISCOVERY_CACHE: dict[str, tuple] = {}     # key -> (resolved_url, probed_at_epoch, was_positive)
CIRCUIT_FAIL_THRESHOLD = 3
CIRCUIT_COOLDOWN_SECONDS = 60 * 60              # skip for an hour after 3 network-level fails
RSS_DISCOVERY_TIMEOUT = 6

# Alternate user-agents tried when a feed answers 429/403/5xx. Reddit only
# serves its .rss endpoints to feed crawlers (the generic browser UA gets a
# blanket 429), and several corporate blogs whitelist feed fetchers while
# throttling everything else.
_FETCH_USER_AGENTS = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/120.0.0.0 Safari/537.36",
    "FeedFetcher-Google; (+http://www.google.com/feedfetcher.html)",
    "Googlebot/2.1 (+http://www.google.com/bot.html)",
)

_PROBE_IN_FLIGHT: set[str] = set()

def _cached_url(key: str) -> str:
    """Return the cached discovered feed URL for `key`, or '' if none."""
    cached = _RSS_DISCOVERY_CACHE.get(key)
    if cached and cached[0]:
        return cached[0]
    return ""
_RSS_DISCOVERY_NEG_TTL = 6 * 60 * 60            # re-probe urls that came up empty after 6h
_RSS_DISCOVERY_POS_TTL = 24 * 60 * 60           # re-probe successful discoveries every 24h


_LINK_RE = re.compile(
    r'<link\b[^>]*?(?:rel=["\']alternate["\'][^>]*?type=["\']application/(?:rss|atom)\+xml["\']|'
    r'type=["\']application/(?:rss|atom)\+xml["\'][^>]*?rel=["\']alternate["\'])'
    r'[^>]*?href=["\']([^"\']+)["\']',
    re.IGNORECASE,
)
_CANONICAL_PATHS = ("/feed", "/feed/", "/rss.xml", "/rss/", "/feed.xml", "/atom.xml",
                    "/blog/rss.xml", "/blog/feed", "/blog/feed.xml", "/index.xml",
                    "/news/feed", "/news/rss")


def _absolutize(base: str, href: str) -> str:
    """Resolve a possibly-relative feed href against the page URL."""
    if href.startswith(("http://", "https://")):
        return href
    if href.startswith("//"):
        # scheme-relative
        scheme = "https" if base.startswith("https") else "http"
        return scheme + ":" + href
    # relative path
    from urllib.parse import urljoin
    return urljoin(base, href)


def _discover_rss_for(key: str, page_url: str) -> str:
    """Find an RSS/Atom URL for a source whose `rss` field is empty.

    Caches the result for `_RSS_DISCOVERY_POS_TTL` on success or
    `_RSS_DISCOVERY_NEG_TTL` on miss so the upstream isn't hit on every
    fetch. Returns '' if nothing is found right now.

    Stampede protection: while a probe is in flight for a given key, other
    concurrent first-time callers return "" immediately and the actual
    probe runs once. The sentinel is always cleared via try/finally.
    """
    if not page_url:
        return ""
    if key in _PROBE_IN_FLIGHT:
        # Another caller is mid-probe for this key; let them finish.
        return ""
    _PROBE_IN_FLIGHT.add(key)
    try:
        return _discover_rss_inner(key, page_url)
    finally:
        _PROBE_IN_FLIGHT.discard(key)


def _discover_rss_inner(key: str, page_url: str) -> str:
    """Lower-level discovery body. Caller MUST manage _PROBE_IN_FLIGHT."""

    if not page_url:
        return ""
    cached = _RSS_DISCOVERY_CACHE.get(key)
    if cached is not None:
        url, probed_at, was_positive = cached
        ttl = _RSS_DISCOVERY_POS_TTL if was_positive else _RSS_DISCOVERY_NEG_TTL
        if (time.time() - probed_at) < ttl:
            return url or ""
    # Common case: site has a canonical /feed endpoint.
    try:
        parsed = __urlparse(page_url)
        host = parsed.netloc
        scheme = parsed.scheme or "https"
        ctx = ssl.create_default_context()
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE
        for path in _CANONICAL_PATHS:
            probe = f"{scheme}://{host}{path}"
            try:
                req = Request(probe, headers={
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
                    "Accept": "application/rss+xml, application/xml, text/xml, application/atom+xml, */*",
                })
                with urlopen(req, timeout=RSS_DISCOVERY_TIMEOUT, context=ctx) as resp:
                    body_head = resp.read(1024)
                    ctype = (resp.headers.get("Content-Type") or "").lower()
                    if resp.status == 200 and (
                        "xml" in ctype or "atom" in ctype or "rss" in ctype
                        or body_head.lstrip().startswith(b"<?xml")
                        or body_head.lstrip().startswith(b"<rss")
                        or body_head.lstrip().startswith(b"<feed")
                    ):
                        _RSS_DISCOVERY_CACHE[key] = (probe, time.time(), True)
                        return probe
            except Exception:
                continue
    except Exception:
        pass
    # Fallback: parse homepage HTML for <link rel="alternate"> advertisements.
    try:
        ctx = ssl.create_default_context(); ctx.check_hostname = False; ctx.verify_mode = ssl.CERT_NONE
        req = Request(page_url, headers={
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        })
        with urlopen(req, timeout=RSS_DISCOVERY_TIMEOUT, context=ctx) as resp:
            html = resp.read(200_000).decode("utf-8", errors="replace")
        m = _LINK_RE.search(html)
        if m:
            resolved = _absolutize(page_url, m.group(1).strip())
            _RSS_DISCOVERY_CACHE[key] = (resolved, time.time(), True)
            return resolved
    except Exception:
        pass
    _RSS_DISCOVERY_CACHE[key] = ("", time.time(), False)
    _PROBE_IN_FLIGHT.discard(key)
    return ""


_FEED_STATUS = {
    "OK": "healthy",
    "COOLING": "cooldown",
    "DEAD": "feed-unavailable",
    "DNS": "no-dns",
    "TIMEOUT": "timeout",
    "RATE_LIMITED": "rate-limited",
    "NOT_XML": "not-xml",
    "NO_FEED": "no-feed",
    "REDIRECT": "redirect",
}

def _classify_fetch_error(status: int, exc_name: str) -> str:
    """Stable enum mapping for fetch failures.

    The frontend maps these to friendly labels (see STATUS_BADGES in the dashboard).
    Substring matching is used only as a last-resort fall-through for wrapped
    URLError.reason exceptions whose str() doesn't expose a useful type name.
    """
    if status in (404, 410, 403, 405):
        return "DEAD"
    if status == 429:
        return "RATE_LIMITED"
    if status >= 500:
        return "COOLING"
    # status==-1 is a network/transport error. Inspect the exception name.
    n = (exc_name or "").lower()
    if "11001" in n or "getaddrinfo" in n or "name or service not known" in n or "gaierror" in n:
        return "DNS"
    if "timed out" in n or "timeout" in n:
        return "TIMEOUT"
    if "connection refused" in n or "connectionreset" in n or "connection aborted" in n:
        return "DEAD"  # host is up but refusing — usually permanent (firewall/etc)
    return "COOLING"


def _classify_exception(exc: BaseException) -> tuple[str, str]:
    """Inspect the actual exception object (preferred over str).

    Returns (status, human_reason). Prefer this when an exception is available,
    fall back to _classify_fetch_error for synthetic status codes.
    """
    name = type(exc).__name__
    if isinstance(exc, urllib.error.HTTPError):
        return _classify_fetch_error(exc.code, name), getattr(exc, 'reason', name)
    if isinstance(exc, ET.ParseError) or isinstance(exc, json.JSONDecodeError):
        return "NOT_XML", name
    if isinstance(exc, socket.gaierror):
        return "DNS", name
    if isinstance(exc, (socket.timeout, TimeoutError)):
        return "TIMEOUT", name
    if isinstance(exc, ConnectionError):
        return "DEAD", name
    if isinstance(exc, OSError):
        return "COOLING", name
    if isinstance(exc, urllib.error.URLError):
        # Drill into .reason for a more specific classification.
        reason = getattr(exc, 'reason', None)
        reason_name = type(reason).__name__ if reason is not None else name
        return _classify_fetch_error(-1, f'{name} {reason_name} {reason or ""}'), reason_name
    # Programmer error (KeyError, TypeError, AttributeError, etc.) — don't pollute the
    # circuit breaker. Caller decides via the bare except whether to re-raise.
    return "PROGRAMMER", name

def _fail(key: str, source: dict, cls: str, reason: str, is_programmer: bool = False) -> dict:
    """Module-level response builder. Hoisted out of `_do_fetch` to avoid the
    inner-function indenting anti-pattern that previously caused parser
    failures.
    """
    if not is_programmer:
        _record_failure(key, f"{cls}: {reason}")
    if is_programmer:
        print(f"[bug] {key}: {reason}", flush=True)
    return {"key": key, "name": source["name"], "items": [],
            "url": source["url"], "error": f"{cls} - {reason}"[:120],
            "status": cls}


def _record_failure(key: str, err: str) -> None:
    """Bump a source's failure counter and schedule a cooldown if needed."""
    h = _FEED_HEALTH.setdefault(key, {"fails": 0, "next_retry": 0.0, "last_err": ""})
    h["fails"] += 1
    h["last_err"] = err[:120]
    if h["fails"] >= CIRCUIT_FAIL_THRESHOLD:
        h["next_retry"] = time.time() + CIRCUIT_COOLDOWN_SECONDS


def _record_success(key: str) -> None:
    """Reset a source's failure counter on a successful fetch."""
    if key in _FEED_HEALTH:
        _FEED_HEALTH[key]["fails"] = 0
        _FEED_HEALTH[key]["next_retry"] = 0.0


AI_NEWS_SOURCES = {
    # =========================================================================
    # 1. AI & ML News
    # =========================================================================
    "openai": {"name": "OpenAI", "url": "https://openai.com/news", "rss": "https://openai.com/news/rss.xml", "category": "AI & ML News", "country": "USA"},
    "google_ai": {"name": "Google AI Blog", "url": "https://ai.googleblog.com", "rss": "https://blog.google/technology/ai/rss/", "category": "AI & ML News", "country": "USA"},
    "deepmind": {"name": "Google DeepMind", "url": "https://deepmind.google/blog", "rss": "https://deepmind.google/blog/rss.xml", "category": "AI & ML News", "country": "UK"},
    "meta_ai": {"name": "Meta AI Blog", "url": "https://ai.meta.com/blog/", "rss": "https://raw.githubusercontent.com/oborchers/rss-feeds/main/feeds/feed_meta_ai.xml", "category": "AI & ML News", "country": "USA"},
    "anthropic": {"name": "Anthropic News", "url": "https://www.anthropic.com/news", "rss": "https://raw.githubusercontent.com/taobojlen/anthropic-rss-feed/main/anthropic_news_rss.xml", "category": "AI & ML News", "country": "USA"},
    "microsoft_ai": {"name": "Microsoft AI Blog", "url": "https://blogs.microsoft.com/ai/", "rss": "https://news.microsoft.com/source/topics/ai/rss/", "category": "AI & ML News", "country": "USA"},
    "nvidia_ai": {"name": "NVIDIA AI Blog", "url": "https://blogs.nvidia.com/blog/category/deep-learning/", "rss": "https://blogs.nvidia.com/feed/", "category": "AI & ML News", "country": "USA"},
    "apple_ml": {"name": "Apple Machine Learning", "url": "https://machinelearning.apple.com", "rss": "https://machinelearning.apple.com/rss.xml", "category": "AI & ML News", "country": "USA"},
    "ibm_ai": {"name": "IBM AI Research", "url": "https://research.ibm.com/blog/category/artificial-intelligence", "rss": "", "category": "AI & ML News", "country": "USA"},
    "amazon_science": {"name": "Amazon Science", "url": "https://www.amazon.science", "rss": "https://www.amazon.science/index.rss", "category": "AI & ML News", "country": "USA"},
    "mit_tech_review": {"name": "MIT Technology Review", "url": "https://www.technologyreview.com/topic/artificial-intelligence", "rss": "https://www.technologyreview.com/feed/", "category": "AI & ML News", "country": "USA"},
    "techcrunch_ai": {"name": "TechCrunch AI", "url": "https://techcrunch.com/category/artificial-intelligence/", "rss": "https://techcrunch.com/category/artificial-intelligence/feed/", "category": "AI & ML News", "country": "USA"},
    "wired_ai": {"name": "Wired AI", "url": "https://www.wired.com/tag/artificial-intelligence/", "rss": "", "category": "AI & ML News", "country": "USA"},
    "verge_ai": {"name": "The Verge AI", "url": "https://www.theverge.com/ai-artificial-intelligence", "rss": "https://www.theverge.com/rss/ai-artificial-intelligence/index.xml", "category": "AI & ML News", "country": "USA"},
    "venturebeat_ai": {"name": "VentureBeat AI", "url": "https://venturebeat.com/category/ai/", "rss": "https://venturebeat.com/category/ai/feed/", "category": "AI & ML News", "country": "USA"},
    "ars_technica_ai": {"name": "Ars Technica AI", "url": "https://arstechnica.com/ai/", "rss": "https://arstechnica.com/feed/", "category": "AI & ML News", "country": "USA"},
    "zdnet_ai": {"name": "ZDNet AI", "url": "https://www.zdnet.com/topic/artificial-intelligence/", "rss": "https://www.zdnet.com/topic/artificial-intelligence/rss.xml", "category": "AI & ML News", "country": "USA"},
    "analytics_vidhya": {"name": "Analytics Vidhya", "url": "https://www.analyticsvidhya.com", "rss": "https://www.analyticsvidhya.com/feed/", "category": "AI & ML News", "country": "India"},
    "kdnuggets": {"name": "KDnuggets", "url": "https://www.kdnuggets.com", "rss": "", "category": "AI & ML News", "country": "USA"},
    "marktechpost": {"name": "MarkTechPost", "url": "https://marktechpost.com", "rss": "https://marktechpost.com/feed/", "category": "AI & ML News", "country": "Global"},
    "ai_magazine": {"name": "AI Magazine", "url": "https://www.aimagazine.com", "rss": "", "category": "AI & ML News", "country": "Global"},
    "analytics_india": {"name": "Analytics India Magazine", "url": "https://analyticsindiamag.com", "rss": "https://analyticsindiamag.com/feed/", "category": "AI & ML News", "country": "India"},
    "aithority": {"name": "AiThority", "url": "https://aithority.com", "rss": "https://aithority.com/feed/", "category": "AI & ML News", "country": "USA"},
    "sciencedaily_ai": {"name": "ScienceDaily AI", "url": "https://www.sciencedaily.com/news/computers_math/artificial_intelligence/", "rss": "https://www.sciencedaily.com/rss/computers_math/artificial_intelligence.xml", "category": "AI & ML News", "country": "USA"},
    "ieee_spectrum_ai": {"name": "IEEE Spectrum AI", "url": "https://spectrum.ieee.org/topic/artificial-intelligence/", "rss": "https://spectrum.ieee.org/feeds/topic/artificial-intelligence.rss", "category": "AI & ML News", "country": "USA"},
    "mit_news_ai": {"name": "MIT News AI", "url": "https://news.mit.edu/topic/artificial-intelligence2", "rss": "https://news.mit.edu/rss/feed", "category": "AI & ML News", "country": "USA"},
    "emergj": {"name": "Emerj AI Research", "url": "https://emerj.com", "rss": "https://emerj.com/feed/", "category": "AI & ML News", "country": "USA"},
    "towards_data_science": {"name": "Towards Data Science", "url": "https://towardsdatascience.com", "rss": "https://medium.com/feed/towards-data-science", "category": "AI & ML News", "country": "Global"},
    "the_gradient": {"name": "The Gradient", "url": "https://thegradient.pub", "rss": "https://thegradient.pub/rss/", "category": "AI & ML News", "country": "USA"},
    "import_ai_blog": {"name": "Import AI", "url": "https://importai.substack.com", "rss": "https://importai.substack.com/feed", "category": "AI & ML News", "country": "Global"},
    "ai_news_site": {"name": "AI News", "url": "https://www.artificialintelligence-news.com", "rss": "https://www.technologyreview.com/topics/artificial-intelligence/feed/", "category": "AI & ML News", "country": "Global"},
    "ai_trends": {"name": "AI Trends", "url": "https://aitrends.com", "rss": "https://aitrends.com/feed/", "category": "AI & ML News", "country": "USA"},
    "reuters_ai": {"name": "Reuters AI", "url": "https://www.reuters.com/technology/artificial-intelligence/", "rss": "", "category": "AI & ML News", "country": "USA"},
    "bloomberg_ai": {"name": "Bloomberg AI", "url": "https://www.bloomberg.com/technology", "rss": "", "category": "AI & ML News", "country": "USA"},
    "karpathy": {"name": "Andrej Karpathy Blog", "url": "https://karpathy.github.io", "rss": "https://karpathy.github.io/feed.xml", "category": "AI & ML News", "country": "USA"},
    "lilian_weng": {"name": "Lilian Weng Blog", "url": "https://lilianweng.github.io", "rss": "https://lilianweng.github.io/index.xml", "category": "AI & ML News", "country": "USA"},
    "chip_huyen": {"name": "Chip Huyen Blog", "url": "https://huyenchip.com/blog", "rss": "https://huyenchip.com/feed.xml", "category": "AI & ML News", "country": "USA"},
    "pinecone_learn": {"name": "Pinecone Learn", "url": "https://www.pinecone.io/learn", "rss": "https://raw.githubusercontent.com/Olshansk/rss-feeds/main/feeds/feed_pinecone.xml", "category": "AI & ML News", "country": "USA"},
    "qdrant_blog": {"name": "Qdrant Blog", "url": "https://qdrant.tech/articles", "rss": "https://qdrant.tech/articles/index.xml", "category": "AI & ML News", "country": "Global"},
    "weaviate_blog": {"name": "Weaviate Blog", "url": "https://weaviate.io/blog", "rss": "https://weaviate.io/blog/rss.xml", "category": "AI & ML News", "country": "Global"},
    "llamaindex_blog": {"name": "LlamaIndex Blog", "url": "https://medium.com/llamaindex-blog", "rss": "https://medium.com/feed/llamaindex-blog", "category": "AI & ML News", "country": "USA"},
    "huggingface_papers": {"name": "Hugging Face Daily Papers", "url": "https://huggingface.co/papers", "rss": "", "category": "AI & ML News", "country": "Global"},
    "arxiv_ai": {"name": "arXiv CS.AI", "url": "https://arxiv.org/list/cs.AI/recent", "rss": "https://export.arxiv.org/rss/cs.AI", "category": "AI & ML News", "country": "Global"},
    "arxiv_cl": {"name": "arXiv CS.CL (NLP)", "url": "https://arxiv.org/list/cs.CL/recent", "rss": "https://export.arxiv.org/rss/cs.CL", "category": "AI & ML News", "country": "Global"},
    "arxiv_lg": {"name": "arXiv CS.LG (ML)", "url": "https://arxiv.org/list/cs.LG/recent", "rss": "https://export.arxiv.org/rss/cs.LG", "category": "AI & ML News", "country": "Global"},
    "ai_snake_oil": {"name": "AI Snake Oil (Princeton)", "url": "https://aisnakeoil.substack.com", "rss": "https://aisnakeoil.substack.com/feed", "category": "AI & ML News", "country": "USA"},
    "simon_willison": {"name": "Simon Willison's Weblog", "url": "https://simonwillison.net", "rss": "https://simonwillison.net/atom/everything/", "category": "AI & ML News", "country": "USA"},
    "interconnects": {"name": "Interconnects (Nathan Lambert)", "url": "https://interconnects.ai", "rss": "https://interconnects.ai/feed.xml", "category": "AI & ML News", "country": "USA"},
    "the_sequence": {"name": "The Sequence", "url": "https://thesequence.substack.com", "rss": "https://thesequence.substack.com/feed", "category": "AI & ML News", "country": "USA"},
    "the_decoder": {"name": "The Decoder", "url": "https://the-decoder.com", "rss": "https://the-decoder.com/feed/", "category": "AI & ML News", "country": "EU"},
    "unite_ai": {"name": "Unite.AI", "url": "https://www.unite.ai", "rss": "", "category": "AI & ML News", "country": "Canada"},

    # =========================================================================
    # 2. AI Agents
    # =========================================================================
    "langchain": {"name": "LangChain Blog", "url": "https://www.langchain.com/blog", "rss": "https://www.langchain.com/blog/rss.xml", "category": "AI Agents", "country": "USA"},
    "huggingface": {"name": "Hugging Face Blog", "url": "https://huggingface.co/blog", "rss": "https://huggingface.co/blog/feed.xml", "category": "AI Agents", "country": "Global"},
    "crewai": {"name": "CrewAI Blog", "url": "https://blog.crewai.com", "rss": "https://blog.crewai.com/rss/", "category": "AI Agents", "country": "USA"},
    "autogpt": {"name": "AutoGPT", "url": "https://agpt.co", "rss": "https://github.com/Significant-Gravitas/AutoGPT/releases.atom", "category": "AI Agents", "country": "Global"},
    "agentops": {"name": "AgentOps", "url": "https://www.agentops.ai", "rss": "", "category": "AI Agents", "country": "USA"},
    "langgraph": {"name": "LangGraph Docs (Tweets)", "url": "https://langchain-ai.github.io/langgraph", "rss": "https://blog.langchain.dev/rss.xml", "category": "AI Agents", "country": "USA"},
    "google_agents": {"name": "Google DeepMind Agents (DeepMind Blog)", "url": "https://deepmind.google/technologies/agent/", "rss": "https://deepmind.google/blog/rss.xml", "category": "AI Agents", "country": "USA"},
    "autogen": {"name": "Microsoft AutoGen", "url": "https://microsoft.github.io/autogen/", "rss": "https://microsoft.github.io/autogen/0.2/blog/rss.xml", "category": "AI Agents", "country": "USA"},
    "openai_agents": {"name": "OpenAI Agents", "url": "https://openai.com/index/new-tools-for-building-agents/", "rss": "https://openai.com/news/rss.xml", "category": "AI Agents", "country": "USA"},

    # =========================================================================
    # 3. Cybersecurity
    # =========================================================================
    "thehackernews": {"name": "The Hacker News", "url": "https://thehackernews.com", "rss": "https://feeds.feedburner.com/TheHackersNews", "category": "Cybersecurity", "country": "Global"},
    "krebs": {"name": "Krebs on Security", "url": "https://krebsonsecurity.com", "rss": "https://krebsonsecurity.com/feed/", "category": "Cybersecurity", "country": "USA"},
    "darkreading": {"name": "Dark Reading", "url": "https://www.darkreading.com", "rss": "https://www.darkreading.com/rss.xml", "category": "Cybersecurity", "country": "USA"},
    "bleepingcomputer": {"name": "BleepingComputer", "url": "https://www.bleepingcomputer.com", "rss": "", "category": "Cybersecurity", "country": "USA"},
    "securityweek": {"name": "SecurityWeek", "url": "https://www.securityweek.com", "rss": "https://feeds.feedburner.com/securityweek", "category": "Cybersecurity", "country": "USA"},
    "sc_media": {"name": "SC Media", "url": "https://www.scworld.com", "rss": "", "category": "Cybersecurity", "country": "USA"},
    "cso_online": {"name": "CSO Online", "url": "https://www.csoonline.com", "rss": "https://www.csoonline.com/feed/", "category": "Cybersecurity", "country": "USA"},
    "infosec_mag": {"name": "Infosecurity Magazine", "url": "https://www.infosecurity-magazine.com", "rss": "https://www.infosecurity-magazine.com/rss/news", "category": "Cybersecurity", "country": "Global"},
    "cyberscoop": {"name": "CyberScoop", "url": "https://cyberscoop.com", "rss": "https://cyberscoop.com/feed/", "category": "Cybersecurity", "country": "USA"},
    "recorded_future": {"name": "Recorded Future", "url": "https://www.recordedfuture.com/blog", "rss": "https://www.recordedfuture.com/feed", "category": "Cybersecurity", "country": "USA"},
    "mandiant": {"name": "Mandiant Blog", "url": "https://www.mandiant.com/resources/blog", "rss": "https://www.mandiant.com/resources/blog/rss.xml", "category": "Cybersecurity", "country": "USA"},
    "cisa": {"name": "CISA", "url": "https://www.cisa.gov/news-events", "rss": "https://www.cisa.gov/cybersecurity-advisories/all.xml", "category": "Cybersecurity", "country": "USA"},
    "mitre": {"name": "MITRE ATT&CK", "url": "https://attack.mitre.org", "rss": "", "category": "Cybersecurity", "country": "USA"},
    "sans_blog": {"name": "SANS Blog", "url": "https://www.sans.org/blog/", "rss": "", "category": "Cybersecurity", "country": "USA"},
    "daniel_miessler": {"name": "Daniel Miessler", "url": "https://danielmiessler.com", "rss": "https://danielmiessler.com/feed/", "category": "Cybersecurity", "country": "USA"},
    "portswigger": {"name": "PortSwigger Research", "url": "https://portswigger.net/research", "rss": "https://portswigger.net/research/rss", "category": "Cybersecurity", "country": "Global"},
    "unit42": {"name": "Unit 42 (Palo Alto)", "url": "https://unit42.paloaltonetworks.com", "rss": "https://unit42.paloaltonetworks.com/feed/", "category": "Cybersecurity", "country": "USA"},
    "talos": {"name": "Cisco Talos Intelligence", "url": "https://blog.talosintelligence.com", "rss": "https://blog.talosintelligence.com/rss/", "category": "Cybersecurity", "country": "USA"},
    "cyber_defense": {"name": "Cyber Defense Magazine", "url": "https://www.cyberdefensemagazine.com", "rss": "", "category": "Cybersecurity", "country": "USA"},
    "help_net_security": {"name": "Help Net Security", "url": "https://www.helpnetsecurity.com", "rss": "", "category": "Cybersecurity", "country": "Global"},
    "security_mag": {"name": "Security Magazine", "url": "https://www.securitymagazine.com", "rss": "", "category": "Cybersecurity", "country": "USA"},
    "it_security_guru": {"name": "IT Security Guru", "url": "https://www.itsecurityguru.org", "rss": "https://www.itsecurityguru.org/feed/", "category": "Cybersecurity", "country": "Global"},
    "cybersecurity_insiders": {"name": "Cybersecurity Insiders", "url": "https://www.cybersecurity-insiders.com", "rss": "https://www.cybersecurity-insiders.com/feed/atom.xml", "category": "Cybersecurity", "country": "USA"},
    "thecyberwire": {"name": "The CyberWire", "url": "https://thecyberwire.com", "rss": "", "category": "Cybersecurity", "country": "USA"},
    "upguard": {"name": "UpGuard Blog", "url": "https://www.upguard.com/blog", "rss": "https://www.upguard.com/blog/rss.xml", "category": "Cybersecurity", "country": "USA"},
    "bitsight": {"name": "BitSight Blog", "url": "https://www.bitsight.com/blog", "rss": "https://www.bitsight.com/blog/rss.xml", "category": "Cybersecurity", "country": "USA"},
    "caniphish": {"name": "CanIPhish (SecurityWeek mirror)", "url": "https://www.caniphish.com", "rss": "https://feeds.feedburner.com/securityweek", "category": "Cybersecurity", "country": "Global"},
    "nist_cyber": {"name": "NIST Cybersecurity", "url": "https://www.nist.gov/cybersecurity", "rss": "https://www.nist.gov/blogs/cybersecurity-insights/rss.xml", "category": "Cybersecurity", "country": "USA"},
    "enisa": {"name": "ENISA", "url": "https://www.enisa.europa.eu", "rss": "", "category": "Cybersecurity", "country": "EU"},
    "ncsc_uk": {"name": "NCSC UK", "url": "https://www.ncsc.gov.uk", "rss": "https://www.ncsc.gov.uk/api/1/services/v1/report-rss-feed.xml", "category": "Cybersecurity", "country": "UK"},
    "alignment_forum": {"name": "Alignment Forum", "url": "https://www.alignmentforum.org", "rss": "https://www.alignmentforum.org/feed.xml", "category": "Cybersecurity", "country": "Global"},
    "uk_ai_safety": {"name": "UK AI Safety Institute", "url": "https://www.gov.uk/government/organisations/ai-safety-institute", "rss": "https://www.gov.uk/government/organisations/ai-safety-institute.atom", "category": "Cybersecurity", "country": "UK"},
    "protect_ai": {"name": "Protect AI", "url": "https://protectai.com/blog", "rss": "https://www.darkreading.com/rss.xml", "category": "Cybersecurity", "country": "USA"},

    # =========================================================================
    # 4. Quantum Computing
    # =========================================================================
    "quantum_report": {"name": "Quantum Computing Report", "url": "https://quantumcomputingreport.com", "rss": "https://quantumcomputingreport.com/feed/", "category": "Quantum Computing", "country": "USA"},
    "ibm_quantum": {"name": "IBM Quantum Blog", "url": "https://www.ibm.com/quantum/blog", "rss": "", "category": "Quantum Computing", "country": "USA"},
    "google_quantum": {"name": "Google Quantum AI", "url": "https://quantumai.google", "rss": "https://blog.google/technology/rss/", "category": "Quantum Computing", "country": "USA"},
    "quanta_magazine": {"name": "Quanta Magazine", "url": "https://www.quantamagazine.org/computing", "rss": "https://www.quantamagazine.org/feed/", "category": "Quantum Computing", "country": "USA"},
    "qubit_report": {"name": "The Qubit Report", "url": "https://thequbitreport.com", "rss": "https://thequbitreport.com/feed", "category": "Quantum Computing", "country": "USA"},
    "nature_quantum": {"name": "Nature Quantum Information", "url": "https://www.nature.com/npjqi/", "rss": "https://www.nature.com/npjqi.rss", "category": "Quantum Computing", "country": "Global"},
    "ieee_quantum": {"name": "IEEE Spectrum Quantum", "url": "https://spectrum.ieee.org/topic/quantum-computing/", "rss": "", "category": "Quantum Computing", "country": "USA"},
    "quantum_insider": {"name": "The Quantum Insider", "url": "https://thequantuminsider.com", "rss": "https://thequantuminsider.com/feed/", "category": "Quantum Computing", "country": "Global"},
    "iqt": {"name": "Inside Quantum Technology", "url": "https://www.iqt.org", "rss": "https://www.insidequantumtechnology.com/feed/", "category": "Quantum Computing", "country": "USA"},
    "q_ctrl": {"name": "Q-CTRL", "url": "https://q-ctrl.com/blog", "rss": "", "category": "Quantum Computing", "country": "Global"},
    "rigetti": {"name": "Rigetti Computing", "url": "https://www.rigetti.com/newsroom", "rss": "", "category": "Quantum Computing", "country": "USA"},
    "ionq": {"name": "IonQ Blog", "url": "https://ionq.com/news", "rss": "https://ionq.com/blog/rss.xml", "category": "Quantum Computing", "country": "USA"},
    "dwave": {"name": "D-Wave Blog", "url": "https://www.dwavesys.com/blog", "rss": "", "category": "Quantum Computing", "country": "Canada"},
    "psiquantum": {"name": "PsiQuantum (Quantum Computing Report)", "url": "https://www.psiquantum.com/news", "rss": "https://quantumcomputingreport.com/feed/", "category": "Quantum Computing", "country": "USA"},
    "xanadu": {"name": "Xanadu Blog", "url": "https://www.xanadu.ai/blog", "rss": "https://www.xanadu.ai/blog/rss.xml", "category": "Quantum Computing", "country": "Canada"},
    "honeywell_quantum": {"name": "Honeywell Quantum (IonQ Blog mirror)", "url": "https://www.honeywell.com/us/en/quantum-computing", "rss": "https://ionq.com/blog/rss.xml", "category": "Quantum Computing", "country": "USA"},
    "quantum_zeitgeist": {"name": "Quantum Zeitgeist", "url": "https://quantumzeitgeist.com", "rss": "", "category": "Quantum Computing", "country": "Global"},
    "scitechdaily_quantum": {"name": "SciTechDaily Quantum", "url": "https://scitechdaily.com/quantum-computing-news/", "rss": "", "category": "Quantum Computing", "country": "USA"},
    "physicsworld_quantum": {"name": "Physics World Quantum", "url": "https://physicsworld.com/tag/quantum-computing/", "rss": "https://physicsworld.com/feed/", "category": "Quantum Computing", "country": "Global"},
    "arxiv_quantum": {"name": "arXiv Quantum Physics", "url": "https://arxiv.org/list/quant-ph/recent", "rss": "https://export.arxiv.org/rss/quant-ph", "category": "Quantum Computing", "country": "Global"},

    # =========================================================================
    # 5. Robotics
    # =========================================================================
    "ieee_robotics": {"name": "IEEE Spectrum Robotics", "url": "https://spectrum.ieee.org/topic/robotics/", "rss": "https://spectrum.ieee.org/feeds/topic/robotics.rss", "category": "Robotics", "country": "USA"},
    "robohub": {"name": "RoboHub", "url": "https://robohub.org", "rss": "https://robohub.org/feed/", "category": "Robotics", "country": "Global"},
    "therobotreport": {"name": "The Robot Report", "url": "https://therobotreport.com", "rss": "", "category": "Robotics", "country": "USA"},
    "robotics_business_review": {"name": "Robotics Business Review", "url": "https://roboticsandautomationnews.com", "rss": "https://roboticsandautomationnews.com/feed/", "category": "Robotics", "country": "USA"},
    "techcrunch_robotics": {"name": "TechCrunch Robotics", "url": "https://techcrunch.com/category/robotics/", "rss": "https://techcrunch.com/category/robotics/feed/", "category": "Robotics", "country": "USA"},
    "boston_dynamics": {"name": "Boston Dynamics Blog", "url": "https://bostondynamics.com/blog", "rss": "https://spectrum.ieee.org/feeds/topic/robotics.rss", "category": "Robotics", "country": "USA"},
    "tesla_optimus": {"name": "Tesla Optimus (TechCrunch Robotics)", "url": "https://www.tesla.com/AI", "rss": "https://techcrunch.com/category/robotics/feed/", "category": "Robotics", "country": "USA"},
    "figure_ai": {"name": "Figure AI (RoboHub)", "url": "https://www.figure.ai/news", "rss": "https://robohub.org/feed/", "category": "Robotics", "country": "USA"},
    "unitree": {"name": "Unitree Robotics (Robotics & Automation News)", "url": "https://www.unitree.com/news/", "rss": "https://roboticsandautomationnews.com/feed/", "category": "Robotics", "country": "China"},
    "kuka": {"name": "KUKA (Robotics & Automation News)", "url": "https://www.kuka.com/en-us/news", "rss": "https://roboticsandautomationnews.com/feed/", "category": "Robotics", "country": "EU"},
    "universal_robots": {"name": "Universal Robots", "url": "https://www.universal-robots.com/blog/", "rss": "", "category": "Robotics", "country": "Global"},
    "sciencedaily_robotics": {"name": "ScienceDaily Robotics", "url": "https://www.sciencedaily.com/news/computers_math/robotics/", "rss": "https://www.sciencedaily.com/rss/computers_math/robotics.xml", "category": "Robotics", "country": "USA"},
    "wevolver": {"name": "Wevolver", "url": "https://www.wevolver.com", "rss": "", "category": "Robotics", "country": "Global"},
    "hackster_robotics": {"name": "Hackster.io Robotics", "url": "https://www.hackster.io/robotics", "rss": "", "category": "Robotics", "country": "Global"},
    "ros_discourse": {"name": "ROS Discourse", "url": "https://discourse.ros.org", "rss": "https://discourse.ros.org/latest.rss", "category": "Robotics", "country": "Global"},
    # =========================================================================
    # 6. Space Technology
    # =========================================================================
    "nasa": {"name": "NASA", "url": "https://www.nasa.gov", "rss": "https://www.nasa.gov/rss/dyn/breaking_news.rss", "category": "Space Technology", "country": "USA"},
    "space_com": {"name": "Space.com", "url": "https://www.space.com", "rss": "https://www.space.com/feeds/all", "category": "Space Technology", "country": "USA"},
    "spacenews": {"name": "SpaceNews", "url": "https://spacenews.com", "rss": "", "category": "Space Technology", "country": "USA"},
    "esa": {"name": "European Space Agency", "url": "https://www.esa.int", "rss": "https://www.esa.int/rssfeed/Our_Activities/Space_Safety", "category": "Space Technology", "country": "EU"},
    "nasa_jpl": {"name": "NASA JPL", "url": "https://www.jpl.nasa.gov/news", "rss": "", "category": "Space Technology", "country": "USA"},
    "ars_technica_space": {"name": "Ars Technica Space", "url": "https://arstechnica.com/space/", "rss": "https://arstechnica.com/space/feed/", "category": "Space Technology", "country": "USA"},
    "scitechdaily_space": {"name": "SciTechDaily Space", "url": "https://scitechdaily.com/space/", "rss": "https://scitechdaily.com/news/space/feed/", "category": "Space Technology", "country": "USA"},
    "space_policy_online": {"name": "Space Policy Online", "url": "https://spacenews.com/category/policy/", "rss": "https://spacepolicyonline.com/feed/", "category": "Space Technology", "country": "USA"},
    "payload_space": {"name": "Payload Space", "url": "https://www.payloadspace.com", "rss": "https://payloadspace.com/feed/", "category": "Space Technology", "country": "USA"},
    "orbital_today": {"name": "Orbital Today", "url": "https://orbitaltoday.com", "rss": "", "category": "Space Technology", "country": "Global"},
    "cnbc_space": {"name": "CNBC Space", "url": "https://www.cnbc.com/space/", "rss": "https://www.cnbc.com/id/19836768/device/rss/rss.html", "category": "Space Technology", "country": "USA"},
    "iss_research": {"name": "ISS Research", "url": "https://www.nasa.gov/mission_pages/station/research", "rss": "https://www.nasa.gov/news-release/feed/", "category": "Space Technology", "country": "USA"},
    "rocket_lab": {"name": "Rocket Lab Blog", "url": "https://www.rocketlabusa.com/news", "rss": "", "category": "Space Technology", "country": "USA"},
    "space_generation": {"name": "Space Generation Advisory", "url": "https://www.sgaspace.org", "rss": "https://www.nasa.gov/news-release/feed/", "category": "Space Technology", "country": "Global"},
    "universe_today": {"name": "Universe Today", "url": "https://www.universetoday.com", "rss": "https://www.universetoday.com/feed/", "category": "Space Technology", "country": "Canada"},
    "european_spaceflight": {"name": "European Spaceflight", "url": "https://europeanspaceflight.com", "rss": "https://europeanspaceflight.com/feed/", "category": "Space Technology", "country": "EU"},
    "nasaspaceflight": {"name": "NASASpaceFlight", "url": "https://www.nasaspaceflight.com", "rss": "", "category": "Space Technology", "country": "USA"},

    # =========================================================================
    # 7. Healthcare AI
    # =========================================================================
    "statnews": {"name": "STAT News", "url": "https://www.statnews.com", "rss": "https://www.statnews.com/feed/", "category": "Healthcare AI", "country": "USA"},
    "fierce_healthcare": {"name": "Fierce Healthcare", "url": "https://www.fiercehealthcare.com", "rss": "https://www.fiercehealthcare.com/rss/xml", "category": "Healthcare AI", "country": "USA"},
    "mobihealthnews": {"name": "MobiHealthNews", "url": "https://mobihealthnews.com", "rss": "", "category": "Healthcare AI", "country": "USA"},
    "healthcare_it_news": {"name": "Healthcare IT News", "url": "https://www.healthcareitnews.com", "rss": "", "category": "Healthcare AI", "country": "USA"},
    "nejm_ai": {"name": "NEJM AI", "url": "https://www.nejm.org/ai", "rss": "https://www.nejm.org/action/showFeed?type=etoc&feed=rss&jc=nejm", "category": "Healthcare AI", "country": "USA"},
    "nature_medicine": {"name": "Nature Medicine", "url": "https://www.nature.com/nm/", "rss": "https://www.nature.com/nm.rss", "category": "Healthcare AI", "country": "Global"},
    "lancet_digital": {"name": "Lancet Digital Health", "url": "https://www.thelancet.com/journals/landig/home", "rss": "", "category": "Healthcare AI", "country": "Global"},
    "fda_ai": {"name": "FDA AI/ML Devices", "url": "https://www.fda.gov/medical-devices/software-medical-device-samd/artificial-intelligence-and-machine-learning-aiml-software-medical-device", "rss": "", "category": "Healthcare AI", "country": "USA"},
    "google_health": {"name": "Google Health Blog", "url": "https://blog.google/health/", "rss": "https://blog.google/technology/health/rss/", "category": "Healthcare AI", "country": "USA"},
    "stanford_aimi": {"name": "Stanford AIMI", "url": "https://aimi.stanford.edu", "rss": "", "category": "Healthcare AI", "country": "USA"},
    "mit_jameel": {"name": "MIT Jameel Clinic", "url": "https://jameelclinic.mit.edu", "rss": "https://news.mit.edu/rss/feed", "category": "Healthcare AI", "country": "USA"},
    "docnexus": {"name": "DocNexus AI", "url": "https://www.docnexus.ai", "rss": "https://www.nature.com/nm.rss", "category": "Healthcare AI", "country": "USA"},
    "biopharma_dive": {"name": "BioPharma Dive", "url": "https://www.biopharmadive.com", "rss": "https://www.biopharmadive.com/feeds/news/", "category": "Healthcare AI", "country": "USA"},
    "genomeweb": {"name": "GenomeWeb", "url": "https://www.genomeweb.com", "rss": "", "category": "Healthcare AI", "country": "USA"},
    "pharmaphorum": {"name": "Pharmaphorum", "url": "https://www.pharmaphorum.com", "rss": "", "category": "Healthcare AI", "country": "Global"},

    # =========================================================================
    # 8. Developer News
    # =========================================================================
    "github_blog": {"name": "GitHub Blog", "url": "https://github.blog", "rss": "https://github.blog/feed/", "category": "Developer News", "country": "USA"},
    "hackernews": {"name": "Hacker News", "url": "https://news.ycombinator.com", "rss": "https://hnrss.org/newest?q=AI+OR+LLM+OR+GPT&points=50", "category": "Developer News", "country": "USA"},
    "stackoverflow_blog": {"name": "Stack Overflow Blog", "url": "https://stackoverflow.blog", "rss": "https://stackoverflow.blog/feed/", "category": "Developer News", "country": "USA"},
    "infoq_dev": {"name": "InfoQ", "url": "https://www.infoq.com", "rss": "", "category": "Developer News", "country": "Global"},
    "thenewstack": {"name": "The New Stack", "url": "https://thenewstack.io", "rss": "https://thenewstack.io/feed/", "category": "Developer News", "country": "USA"},
    "devto": {"name": "Dev.to", "url": "https://dev.to", "rss": "https://dev.to/feed", "category": "Developer News", "country": "Global"},
    "freecodecamp": {"name": "FreeCodeCamp News", "url": "https://www.freecodecamp.org/news", "rss": "https://www.freecodecamp.org/news/rss/", "category": "Developer News", "country": "USA"},
    "css_tricks": {"name": "CSS-Tricks", "url": "https://css-tricks.com", "rss": "https://css-tricks.com/feed/", "category": "Developer News", "country": "USA"},
    "smashing_mag": {"name": "Smashing Magazine", "url": "https://www.smashingmagazine.com", "rss": "https://www.smashingmagazine.com/feed/", "category": "Developer News", "country": "USA"},
    "acm_communications": {"name": "ACM Communications", "url": "https://cacm.acm.org", "rss": "", "category": "Developer News", "country": "USA"},
    "ieee_cs": {"name": "IEEE Computer Society", "url": "https://www.computer.org/csdl/magazine", "rss": "", "category": "Developer News", "country": "USA"},
    "mit_csail": {"name": "MIT CSAIL", "url": "https://www.csail.mit.edu/news", "rss": "https://www.csail.mit.edu/rss.xml", "category": "Developer News", "country": "USA"},
    "stanford_cs": {"name": "Stanford CS", "url": "https://cs.stanford.edu/news", "rss": "", "category": "Developer News", "country": "USA"},
    "google_dev": {"name": "Google Developers Blog", "url": "https://developers.googleblog.com", "rss": "https://developers.googleblog.com/feeds/posts/default", "category": "Developer News", "country": "USA"},
    "aws_dev": {"name": "AWS Developer", "url": "https://aws.amazon.com/blogs/developer/", "rss": "https://aws.amazon.com/blogs/developer/feed/", "category": "Developer News", "country": "USA"},
    "microsoft_dev": {"name": "Microsoft Developer Blog", "url": "https://devblogs.microsoft.com", "rss": "https://devblogs.microsoft.com/feed/", "category": "Developer News", "country": "USA"},
    "meta_engineering": {"name": "Meta Engineering Blog", "url": "https://engineering.fb.com", "rss": "https://engineering.fb.com/feed/", "category": "Developer News", "country": "USA"},
    "netflix_tech": {"name": "Netflix TechBlog", "url": "https://netflixtechblog.com", "rss": "https://netflixtechblog.com/feed", "category": "Developer News", "country": "USA"},
    "uber_engineering": {"name": "Uber Engineering", "url": "https://www.uber.com/blog/engineering/", "rss": "", "category": "Developer News", "country": "USA"},
    # =========================================================================
    # 9. Semiconductors
    # =========================================================================
    "anandtech": {"name": "AnandTech", "url": "https://www.anandtech.com", "rss": "https://www.anandtech.com/rss/", "category": "Semiconductors", "country": "USA"},
    "tomshardware": {"name": "Tom's Hardware", "url": "https://www.tomshardware.com", "rss": "https://www.tomshardware.com/feeds/all", "category": "Semiconductors", "country": "USA"},
    "semiengineering": {"name": "SemiEngineering", "url": "https://semiengineering.com", "rss": "https://semiengineering.com/feed/", "category": "Semiconductors", "country": "USA"},
    "ieee_hardware": {"name": "IEEE Spectrum Hardware", "url": "https://spectrum.ieee.org/topic/computer-engineering/", "rss": "https://spectrum.ieee.org/feeds/topic/computing.rss", "category": "Semiconductors", "country": "USA"},
    "nvidia_dev": {"name": "NVIDIA Developer Blog", "url": "https://developer.nvidia.com/blog", "rss": "https://developer.nvidia.com/blog/feed/", "category": "Semiconductors", "country": "USA"},
    "intel_newsroom": {"name": "Intel Newsroom", "url": "https://www.intc.com/news-events/press-releases", "rss": "", "category": "Semiconductors", "country": "USA"},
    "amd_news": {"name": "AMD News", "url": "https://www.amd.com/en/newsroom.html", "rss": "https://ir.amd.com/rss/news-releases.xml", "category": "Semiconductors", "country": "USA"},
    "tsmc": {"name": "TSMC Blog", "url": "https://blog.tsmc.com", "rss": "", "category": "Semiconductors", "country": "China"},
    "samsung_semi": {"name": "Samsung Semiconductor", "url": "https://semiconductor.samsung.com", "rss": "", "category": "Semiconductors", "country": "South Korea"},
    "arm_blog": {"name": "Arm Blog", "url": "https://community.arm.com/arm-community-blogs/b/ai-and-ml-blog", "rss": "", "category": "Semiconductors", "country": "Global"},
    "riscv": {"name": "RISC-V International", "url": "https://riscv.org/programs/", "rss": "https://riscv.org/feed/", "category": "Semiconductors", "country": "USA"},
    "eetimes": {"name": "EE Times", "url": "https://www.eetimes.com", "rss": "https://www.eetimes.com/feed/", "category": "Semiconductors", "country": "USA"},
    "cnet": {"name": "CNET", "url": "https://www.cnet.com/news/", "rss": "https://www.cnet.com/rss/news/", "category": "Semiconductors", "country": "USA"},
    "semi_podcast": {"name": "The Semiconductor Podcast", "url": "https://www.semiconductorpodcast.com", "rss": "https://semiengineering.com/feed/", "category": "Semiconductors", "country": "USA"},
    "cerebras": {"name": "Cerebras Blog", "url": "https://cerebras.ai/blog", "rss": "", "category": "Semiconductors", "country": "USA"},
    "graphcore": {"name": "Graphcore Blog", "url": "https://www.graphcore.ai/posts", "rss": "https://www.graphcore.ai/posts/rss.xml", "category": "Semiconductors", "country": "Global"},

    # =========================================================================
    # 10. Messaging/Integration
    # =========================================================================
    "solace": {"name": "Solace Blog", "url": "https://solace.com/blog/", "rss": "https://solace.com/blog/feed/", "category": "Messaging/Integration", "country": "Canada"},
    "ibmq": {"name": "IBM MQ", "url": "https://www.ibm.com/products/mq", "rss": "https://www.ibm.com/blog/feed/mq/", "category": "Messaging/Integration", "country": "USA"},
    "confluent": {"name": "Confluent Blog", "url": "https://www.confluent.io/blog/", "rss": "", "category": "Messaging/Integration", "country": "USA"},
    "redhat_amq": {"name": "Red Hat AMQ", "url": "https://www.redhat.com/en/technologies/amq", "rss": "https://www.redhat.com/en/rss/blog", "category": "Messaging/Integration", "country": "USA"},
    "activemq": {"name": "Apache ActiveMQ", "url": "https://activemq.apache.org", "rss": "", "category": "Messaging/Integration", "country": "USA"},
    "rabbitmq": {"name": "RabbitMQ Blog", "url": "https://www.rabbitmq.com/blog", "rss": "", "category": "Messaging/Integration", "country": "USA"},
    "nats": {"name": "NATS Blog", "url": "https://nats.io/blog/", "rss": "https://nats.io/blog/index.xml", "category": "Messaging/Integration", "country": "USA"},
    "emq": {"name": "EMQ Technologies", "url": "https://www.emqx.com/en/blog", "rss": "", "category": "Messaging/Integration", "country": "China"},
    "tibco": {"name": "TIBCO Blog", "url": "https://www.tibco.com/blog", "rss": "", "category": "Messaging/Integration", "country": "USA"},
    "apache_pulsar": {"name": "Apache Pulsar", "url": "https://pulsar.apache.org", "rss": "", "category": "Messaging/Integration", "country": "USA"},
    "eventstoredb": {"name": "EventStoreDB", "url": "https://www.eventstore.com/blog", "rss": "https://www.eventstore.com/blog/rss", "category": "Messaging/Integration", "country": "Global"},
    "apache_camel": {"name": "Apache Camel", "url": "https://camel.apache.org", "rss": "", "category": "Messaging/Integration", "country": "USA"},
    "dapr": {"name": "Dapr Blog", "url": "https://blog.dapr.io", "rss": "https://blog.dapr.io/index.xml", "category": "Messaging/Integration", "country": "USA"},
    "event_driven_io": {"name": "Event-Driven.io", "url": "https://event-driven.io", "rss": "", "category": "Messaging/Integration", "country": "Global"},
    "infoq_integration": {"name": "InfoQ Integration", "url": "https://www.infoq.com/integration/", "rss": "", "category": "Messaging/Integration", "country": "Global"},
    "kai_waehner": {"name": "Kai Waehner Blog", "url": "https://kai-waehner.de", "rss": "https://kai-waehner.de/feed/", "category": "Messaging/Integration", "country": "EU"},
    "google_pubsub": {"name": "Google Cloud Pub/Sub", "url": "https://cloud.google.com/blog/products/application-integration", "rss": "https://cloud.google.com/blog/rss", "category": "Messaging/Integration", "country": "USA"},

    # =========================================================================
    # 11. Cloud/DevOps
    # =========================================================================
    "aws_news": {"name": "AWS News Blog", "url": "https://aws.amazon.com/blogs/aws/", "rss": "https://aws.amazon.com/blogs/aws/feed/", "category": "Cloud/DevOps", "country": "USA"},
    "google_cloud": {"name": "Google Cloud Blog", "url": "https://cloud.google.com/blog", "rss": "https://cloud.google.com/blog/rss", "category": "Cloud/DevOps", "country": "USA"},
    "azure_blog": {"name": "Azure Blog", "url": "https://azure.microsoft.com/en-us/blog/", "rss": "https://azure.microsoft.com/en-us/blog/feed/atom/", "category": "Cloud/DevOps", "country": "USA"},
    "kubernetes": {"name": "Kubernetes Blog", "url": "https://kubernetes.io/blog/", "rss": "https://kubernetes.io/feed.xml", "category": "Cloud/DevOps", "country": "USA"},
    "docker_blog": {"name": "Docker Blog", "url": "https://www.docker.com/blog/", "rss": "https://www.docker.com/blog/feed/", "category": "Cloud/DevOps", "country": "USA"},
    "terraform": {"name": "Terraform Blog", "url": "https://www.hashicorp.com/blog", "rss": "https://www.hashicorp.com/blog/feed.xml", "category": "Cloud/DevOps", "country": "USA"},
    "cncf": {"name": "CNCF Blog", "url": "https://www.cncf.io/blog/", "rss": "https://www.cncf.io/blog/feed/", "category": "Cloud/DevOps", "country": "USA"},
    "devops_com": {"name": "DevOps.com", "url": "https://devops.com", "rss": "https://devops.com/feed/", "category": "Cloud/DevOps", "country": "USA"},
    "kubecon": {"name": "KubeCon", "url": "https://events.linuxfoundation.org/kubecon-cloudnativecon-north-america/", "rss": "https://events.linuxfoundation.org/feed/", "category": "Cloud/DevOps", "country": "USA"},
    "datacenter_knowledge": {"name": "DataCenter Knowledge", "url": "https://www.datacenterknowledge.com", "rss": "https://www.datacenterknowledge.com/rss.xml", "category": "Cloud/DevOps", "country": "USA"},
    "serverwatch": {"name": "ServerWatch", "url": "https://www.serverwatch.com", "rss": "https://www.serverwatch.com/rss/", "category": "Cloud/DevOps", "country": "USA"},
    "cloudflare_blog": {"name": "Cloudflare Blog", "url": "https://blog.cloudflare.com", "rss": "https://blog.cloudflare.com/rss/", "category": "Cloud/DevOps", "country": "USA"},
    "linux_foundation": {"name": "Linux Foundation Blog", "url": "https://www.linuxfoundation.org/blog", "rss": "", "category": "Cloud/DevOps", "country": "USA"},
    "redhat_blog": {"name": "Red Hat Blog", "url": "https://www.redhat.com/en/blog", "rss": "https://www.redhat.com/en/rss/blog", "category": "Cloud/DevOps", "country": "USA"},
    "suse": {"name": "SUSE Blog", "url": "https://www.suse.com/c/community/blog/", "rss": "", "category": "Cloud/DevOps", "country": "EU"},
    "canonical": {"name": "Canonical Blog", "url": "https://ubuntu.com/blog", "rss": "https://ubuntu.com/blog/feed", "category": "Cloud/DevOps", "country": "Global"},
    "digitalocean": {"name": "DigitalOcean Blog", "url": "https://www.digitalocean.com/blog", "rss": "", "category": "Cloud/DevOps", "country": "USA"},

    # =========================================================================
    # 12. Enterprise IT
    # =========================================================================
    "cio": {"name": "CIO", "url": "https://www.cio.com", "rss": "", "category": "Enterprise IT", "country": "USA"},
    "informationweek": {"name": "InformationWeek", "url": "https://www.informationweek.com", "rss": "https://www.informationweek.com/rss.xml", "category": "Enterprise IT", "country": "USA"},
    "computerworld": {"name": "Computerworld", "url": "https://www.computerworld.com", "rss": "https://www.computerworld.com/feed/", "category": "Enterprise IT", "country": "USA"},
    "network_world": {"name": "Network World", "url": "https://www.networkworld.com", "rss": "https://www.networkworld.com/feed/", "category": "Enterprise IT", "country": "USA"},
    "enterprise_tech": {"name": "Enterprise Tech Journal", "url": "https://www.enterprisetech.com", "rss": "https://www.enterpriseai.com/feed", "category": "Enterprise IT", "country": "USA"},
    "dc_frontier": {"name": "Data Center Frontier", "url": "https://datacenterfrontier.com", "rss": "", "category": "Enterprise IT", "country": "USA"},
    "zdnet": {"name": "ZDNet", "url": "https://www.zdnet.com", "rss": "https://www.zdnet.com/topic/artificial-intelligence/rss.xml", "category": "Enterprise IT", "country": "USA"},
    "techrepublic": {"name": "TechRepublic", "url": "https://www.techrepublic.com", "rss": "https://www.techrepublic.com/feed/", "category": "Enterprise IT", "country": "USA"},
    "eweek": {"name": "eWeek", "url": "https://www.eweek.com", "rss": "https://www.eweek.com/feed/", "category": "Enterprise IT", "country": "USA"},
    "it_pro_today": {"name": "IT Pro Today", "url": "https://www.itprotoday.com", "rss": "https://www.itprotoday.com/rss.xml", "category": "Enterprise IT", "country": "USA"},
    "mainframe_insights": {"name": "Mainframe Insights", "url": "https://www.mainframeinsights.com", "rss": "https://www.enterpriseai.com/feed", "category": "Enterprise IT", "country": "USA"},
    "ibm_systems": {"name": "IBM Systems Magazine", "url": "https://www.ibmsystemsmag.com", "rss": "", "category": "Enterprise IT", "country": "USA"},
    "gartner": {"name": "Gartner", "url": "https://www.gartner.com/en/newsroom", "rss": "", "category": "Enterprise IT", "country": "USA"},
    "forrester": {"name": "Forrester", "url": "https://www.forrester.com/blogs/", "rss": "https://www.forrester.com/blogs/feed/", "category": "Enterprise IT", "country": "USA"},
    "idc": {"name": "IDC", "url": "https://www.idc.com/getdoc.jsp?containerId=prUS51234567", "rss": "https://www.idc.com/feed", "category": "Enterprise IT", "country": "USA"},
    "dell_tech": {"name": "Dell Technologies Blog", "url": "https://www.dell.com/en-us/blog", "rss": "https://www.dell.com/en-us/blog/feed", "category": "Enterprise IT", "country": "USA"},
    "sap": {"name": "SAP News", "url": "https://news.sap.com", "rss": "https://news.sap.com/feed/", "category": "Enterprise IT", "country": "EU"},
    # =========================================================================
    # 13. AI Policy/Governance
    # =========================================================================
    "eu_ai_act": {"name": "EU AI Act Official", "url": "https://artificialintelligenceact.eu", "rss": "https://artificialintelligenceact.eu/feed/", "category": "AI Policy/Governance", "country": "EU"},
    "oecd_ai": {"name": "OECD AI Policy", "url": "https://oecd.ai/en", "rss": "", "category": "AI Policy/Governance", "country": "Global"},
    "brookings_ai": {"name": "Brookings AI", "url": "https://www.brookings.edu/topic/artificial-intelligence/", "rss": "https://www.brookings.edu/topic/artificial-intelligence/feed/", "category": "AI Policy/Governance", "country": "USA"},
    "carnegie_ai": {"name": "Carnegie AI", "url": "https://carnegieendowment.org/topics/artificial-intelligence", "rss": "https://carnegieendowment.org/feeds/topics/ai/rss", "category": "AI Policy/Governance", "country": "USA"},
    "cset_georgetown": {"name": "CSET Georgetown", "url": "https://cset.georgetown.edu", "rss": "", "category": "AI Policy/Governance", "country": "USA"},
    "future_of_life": {"name": "Future of Life Institute", "url": "https://futureoflife.org", "rss": "https://futureoflife.org/feed/", "category": "AI Policy/Governance", "country": "USA"},
    "center_ai_safety": {"name": "Center for AI Safety", "url": "https://www.safe.ai", "rss": "", "category": "AI Policy/Governance", "country": "USA"},
    "partnership_on_ai": {"name": "Partnership on AI", "url": "https://partnershiponai.org", "rss": "https://partnershiponai.org/feed/", "category": "AI Policy/Governance", "country": "USA"},
    "rail_score": {"name": "RAIL Score Hub", "url": "https://www.responsibly.ai/rail-score", "rss": "", "category": "AI Policy/Governance", "country": "Global"},
    "iapp_ai": {"name": "IAPP AI Governance", "url": "https://iapp.org/resources/", "rss": "", "category": "AI Policy/Governance", "country": "USA"},
    "epic_ai": {"name": "EPIC AI", "url": "https://epic.org/issues/artificial-intelligence/", "rss": "https://epic.org/feed/", "category": "AI Policy/Governance", "country": "USA"},
    "eff_ai": {"name": "EFF AI", "url": "https://www.eff.org/issues/ai", "rss": "https://www.eff.org/rss/updates.xml", "category": "AI Policy/Governance", "country": "USA"},
    "berkman_klein": {"name": "Berkman Klein Center", "url": "https://cyber.harvard.edu", "rss": "https://cyber.harvard.edu/rss.xml", "category": "AI Policy/Governance", "country": "USA"},
    "ada_lovelace": {"name": "Ada Lovelace Institute", "url": "https://www.adalovelaceinstitute.org", "rss": "https://www.adalovelaceinstitute.org/feed/", "category": "AI Policy/Governance", "country": "UK"},
    "algorithmwatch": {"name": "AlgorithmWatch", "url": "https://algorithmwatch.org", "rss": "https://algorithmwatch.org/en/feed/", "category": "AI Policy/Governance", "country": "EU"},
    "responsible_ai": {"name": "Responsible AI Institute", "url": "https://www.responsible.ai", "rss": "https://www.responsible.ai/feed", "category": "AI Policy/Governance", "country": "USA"},
    "aclu_ai": {"name": "ACLU AI", "url": "https://www.aclu.org/issues/artificial-intelligence", "rss": "https://www.aclu.org/feed", "category": "AI Policy/Governance", "country": "USA"},
    "wef_ai": {"name": "WEF AI", "url": "https://www.weforum.org/topics/artificial-intelligence-and-robotics", "rss": "", "category": "AI Policy/Governance", "country": "Global"},
    "unesco_ai": {"name": "UNESCO AI", "url": "https://www.unesco.org/en/artificial-intelligence", "rss": "https://www.unesco.org/en/artificial-intelligence/rss.xml", "category": "AI Policy/Governance", "country": "Global"},
    "oecd_incidents": {"name": "OECD AI Incidents", "url": "https://oecd.ai/en/incidents", "rss": "", "category": "AI Policy/Governance", "country": "Global"},

    # =========================================================================
    # 14. Newsletters
    # =========================================================================
    "the_batch": {"name": "The Batch (Andrew Ng)", "url": "https://www.deeplearning.ai/the-batch/", "rss": "", "category": "Newsletters", "country": "USA"},
    "import_ai": {"name": "Import AI", "url": "https://importai.substack.com", "rss": "https://importai.substack.com/feed", "category": "Newsletters", "country": "Global"},
    "tldr_ai": {"name": "TLDR AI", "url": "https://tldr.tech/ai", "rss": "https://tldr.tech/api/rss/ai", "category": "Newsletters", "country": "USA"},
    "bens_bites": {"name": "Ben's Bites", "url": "https://www.bensbites.com", "rss": "https://bensbites.substack.com/feed", "category": "Newsletters", "country": "USA"},
    "the_neuron": {"name": "The Neuron", "url": "https://www.theneuron.ai", "rss": "https://rss.beehiiv.com/feeds/N4eCstxvgX.xml", "category": "Newsletters", "country": "USA"},
    "ai_breakfast": {"name": "AI Breakfast", "url": "https://newsletter.theaiedge.io", "rss": "https://thesequence.substack.com/feed", "category": "Newsletters", "country": "USA"},
    "lastweekinai": {"name": "Last Week in AI", "url": "https://lastweekin.ai", "rss": "https://lastweekin.ai/feed", "category": "Newsletters", "country": "USA"},
    "exponential_view": {"name": "Exponential View", "url": "https://www.exponentialview.co", "rss": "https://www.exponentialview.co/feed", "category": "Newsletters", "country": "Global"},
    "ai_supremacy": {"name": "AI Supremacy", "url": "https://aisupremacy.substack.com", "rss": "https://aisupremacy.substack.com/feed", "category": "Newsletters", "country": "USA"},
    "inside_ai": {"name": "Inside AI", "url": "https://inside.substack.com", "rss": "https://inside.substack.com/feed", "category": "Newsletters", "country": "USA"},
    "algorithm_mit": {"name": "The Algorithm (MIT)", "url": "https://www.technologyreview.com/topic/artificial-intelligence/feed/", "rss": "https://www.technologyreview.com/feed/", "category": "Newsletters", "country": "USA"},
    "ai_weekly": {"name": "AI Weekly", "url": "https://aiweekly.co", "rss": "https://aiweekly.co/feed", "category": "Newsletters", "country": "USA"},
    "cyberwire_daily": {"name": "The CyberWire Daily", "url": "https://thecyberwire.com/briefings/daily-briefing", "rss": "", "category": "Newsletters", "country": "USA"},
    "cybersec_today": {"name": "Cybersecurity Today", "url": "https://www.cybersecuritytoday.ca", "rss": "", "category": "Newsletters", "country": "Canada"},
    "quantum_weekly": {"name": "Quantum Weekly", "url": "https://quantumcomputingreport.com/newsletters/", "rss": "https://quantumcomputingreport.com/feed/", "category": "Newsletters", "country": "USA"},
    "tldr_infosec": {"name": "TLDR InfoSec", "url": "https://tldr.tech/infosec", "rss": "https://tldr.tech/api/rss/infosec", "category": "Newsletters", "country": "USA"},
    "tldr_webdev": {"name": "TLDR Web Dev", "url": "https://tldr.tech/webdev", "rss": "https://tldr.tech/api/rss/webdev", "category": "Newsletters", "country": "USA"},
    "robotics_weekly": {"name": "Robotics Weekly", "url": "https://roboticsweekly.com", "rss": "https://roboticsweekly.com/feed", "category": "Newsletters", "country": "USA"},
    "space_daily": {"name": "Space Daily", "url": "https://www.spacedaily.com", "rss": "", "category": "Newsletters", "country": "Global"},
    "the_download": {"name": "The Download (MIT TR)", "url": "https://www.technologyreview.com/newsletter/", "rss": "https://www.technologyreview.com/feed/", "category": "Newsletters", "country": "USA"},
    "synapses": {"name": "Synapses", "url": "https://synapses.ai", "rss": "https://importai.substack.com/feed", "category": "Newsletters", "country": "Global"},
    "ai_edge": {"name": "The AI Edge", "url": "https://theaiedge.substack.com", "rss": "https://theaiedge.substack.com/feed", "category": "Newsletters", "country": "USA"},
    "superhuman_ai": {"name": "Superhuman AI", "url": "https://www.superhuman.ai", "rss": "https://rss.app/feeds/3tDyvQwHp8cgL7qs.xml", "category": "Newsletters", "country": "USA"},

    # =========================================================================
    # 15. Podcasts
    # =========================================================================
    "lex_fridman": {"name": "Lex Fridman Podcast", "url": "https://lexfridman.com/podcast/", "rss": "https://lexfridman.com/feed/podcast/", "category": "Podcasts", "country": "USA"},
    "nvidia_podcast": {"name": "NVIDIA AI Podcast", "url": "https://blogs.nvidia.com/blog/category/deep-learning-ai/", "rss": "", "category": "Podcasts", "country": "USA"},
    "practical_ai": {"name": "Practical AI", "url": "https://changelog.com/practicalai", "rss": "https://changelog.com/practicalai/feed", "category": "Podcasts", "country": "USA"},
    "no_priors": {"name": "No Priors", "url": "https://www.nopriorspod.com", "rss": "", "category": "Podcasts", "country": "USA"},
    "ai_today": {"name": "AI Today", "url": "https://www.cognilytica.com/aitoday/", "rss": "https://feeds.simplecast.com/54nAGcIl", "category": "Podcasts", "country": "USA"},
    "twiml_ai": {"name": "TWIML AI", "url": "https://twimlai.com", "rss": "https://twimlai.com/feed/", "category": "Podcasts", "country": "USA"},
    "ai_with_ai": {"name": "AI with AI", "url": "https://www.csis.org/programs/artificial-intelligence-and-ai", "rss": "", "category": "Podcasts", "country": "USA"},
    "data_skeptic": {"name": "Data Skeptic", "url": "https://dataskeptic.com", "rss": "", "category": "Podcasts", "country": "USA"},
    "darknet_diaries": {"name": "Darknet Diaries", "url": "https://darknetdiaries.com", "rss": "https://feeds.megaphone.fm/darknetdiaries", "category": "Podcasts", "country": "USA"},
    "risky_business": {"name": "Risky Business", "url": "https://risky.biz", "rss": "https://riskybiznews.substack.com/feed", "category": "Podcasts", "country": "Global"},
    "security_now": {"name": "Security Now", "url": "https://twit.tv/shows/security-now", "rss": "https://feeds.twit.tv/sn.xml", "category": "Podcasts", "country": "USA"},
    "robot_report_pod": {"name": "Robot Report Podcast", "url": "https://therobotreport.com/podcast/", "rss": "", "category": "Podcasts", "country": "USA"},
    "off_nominal": {"name": "Off-Nominal Podcast", "url": "https://www.omnivore.to", "rss": "", "category": "Podcasts", "country": "USA"},
    "se_daily": {"name": "Software Engineering Daily", "url": "https://softwareengineeringdaily.com", "rss": "https://softwareengineeringdaily.com/feed/", "category": "Podcasts", "country": "USA"},
    "kubernetes_podcast": {"name": "Kubernetes Podcast", "url": "https://kubernetespodcast.com", "rss": "", "category": "Podcasts", "country": "USA"},
    "infoq_podcast": {"name": "InfoQ Podcast", "url": "https://www.infoq.com/podcasts/", "rss": "", "category": "Podcasts", "country": "Global"},
    "quantum_now": {"name": "Quantum Computing Now", "url": "https://quantumcomputingreport.com/podcasts/", "rss": "https://quantumcomputingreport.com/feed/", "category": "Podcasts", "country": "USA"},
    "twit": {"name": "TWiT", "url": "https://twit.tv", "rss": "https://feeds.twit.tv/twit_video_hd.xml", "category": "Podcasts", "country": "USA"},
    "ai_native_dev": {"name": "AI Native Dev", "url": "https://ainativedev.com", "rss": "https://huggingface.co/blog/feed.xml", "category": "Podcasts", "country": "USA"},
    "latent_space": {"name": "Latent Space Podcast", "url": "https://www.latent.space", "rss": "https://www.latent.space/feed", "category": "Podcasts", "country": "USA"},

    # =========================================================================
    # 16. News Aggregators
    # =========================================================================
    "techmeme": {"name": "Techmeme", "url": "https://techmeme.com", "rss": "https://techmeme.com/feed.xml", "category": "News Aggregators", "country": "USA"},
    "google_news_ai": {"name": "Google News - AI", "url": "https://news.google.com/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRFZxYUdjU0FuUm9HZ0pVU0NnQVAB", "rss": "https://news.google.com/rss/search?q=artificial+intelligence&hl=en-US&gl=US&ceid=US:en", "category": "News Aggregators", "country": "USA"},
    "lobsters": {"name": "Lobsters", "url": "https://lobste.rs", "rss": "https://lobste.rs/rss", "category": "News Aggregators", "country": "USA"},
    "arxiv_sanity": {"name": "arXiv Sanity", "url": "https://arxiv-sanity-lite.com", "rss": "https://arxiv.org/rss/cs.AI", "category": "News Aggregators", "country": "USA"},
    "reddit_ai": {"name": "Reddit r/artificial", "url": "https://reddit.com/r/artificial", "rss": "https://www.reddit.com/r/artificial/.rss", "category": "News Aggregators", "country": "USA"},
    "reddit_ml": {"name": "Reddit r/MachineLearning", "url": "https://reddit.com/r/MachineLearning", "rss": "https://www.reddit.com/r/MachineLearning/.rss", "category": "News Aggregators", "country": "USA"},
    "reddit_singularity": {"name": "Reddit r/singularity", "url": "https://reddit.com/r/singularity", "rss": "https://www.reddit.com/r/singularity/.rss", "category": "News Aggregators", "country": "USA"},
    "reddit_futurology": {"name": "Reddit r/Futurology", "url": "https://reddit.com/r/Futurology", "rss": "https://www.reddit.com/r/Futurology/.rss", "category": "News Aggregators", "country": "USA"},
    "reddit_localllama": {"name": "Reddit r/LocalLLaMA", "url": "https://reddit.com/r/LocalLLaMA", "rss": "https://www.reddit.com/r/LocalLLaMA/.rss", "category": "News Aggregators", "country": "USA"},
    "reddit_ai_general": {"name": "Reddit r/ArtificialIntelligence", "url": "https://reddit.com/r/ArtificialIntelligence", "rss": "https://www.reddit.com/r/ArtificialIntelligence/.rss", "category": "News Aggregators", "country": "USA"},
    "reddit_openai": {"name": "Reddit r/OpenAI", "url": "https://reddit.com/r/OpenAI", "rss": "https://www.reddit.com/r/OpenAI/.rss", "category": "News Aggregators", "country": "USA"},
    "reddit_chatgpt": {"name": "Reddit r/ChatGPT", "url": "https://reddit.com/r/ChatGPT", "rss": "https://www.reddit.com/r/ChatGPT/.rss", "category": "News Aggregators", "country": "USA"},
    "reddit_stablediffusion": {"name": "Reddit r/StableDiffusion", "url": "https://reddit.com/r/StableDiffusion", "rss": "https://www.reddit.com/r/StableDiffusion/.rss", "category": "News Aggregators", "country": "USA"},
    "reddit_deeplearning": {"name": "Reddit r/deeplearning", "url": "https://reddit.com/r/deeplearning", "rss": "https://www.reddit.com/r/deeplearning/.rss", "category": "News Aggregators", "country": "USA"},
    "reddit_generative_ai": {"name": "Reddit r/GenerativeAI", "url": "https://reddit.com/r/GenerativeAI", "rss": "https://www.reddit.com/r/GenerativeAI/.rss", "category": "News Aggregators", "country": "USA"},
    "dailydev": {"name": "Daily.dev", "url": "https://daily.dev", "rss": "https://daily.dev/rss", "category": "News Aggregators", "country": "Global"},
    "flipboard_tech": {"name": "Flipboard Tech", "url": "https://flipboard.com/technology", "rss": "https://flipboard.com/topic/technology/rss", "category": "News Aggregators", "country": "USA"},

    # =========================================================================
    # 17. Country: USA
    # =========================================================================
    "national_ai_initiative": {"name": "National AI Initiative", "url": "https://www.whitehouse.gov/ostp/ai/", "rss": "", "category": "Country: USA", "country": "USA"},
    "nsf_ai": {"name": "NSF AI Research", "url": "https://www.nsf.gov/focus-areas/artificial-intelligence", "rss": "", "category": "Country: USA", "country": "USA"},
    "darpa_ai": {"name": "DARPA AI", "url": "https://www.darpa.mil/research/programs/artificial-intelligence", "rss": "", "category": "Country: USA", "country": "USA"},
    "nist_ai": {"name": "NIST AI", "url": "https://www.nist.gov/artificial-intelligence", "rss": "", "category": "Country: USA", "country": "USA"},
    "stanford_hai": {"name": "Stanford HAI", "url": "https://hai.stanford.edu", "rss": "https://hai.stanford.edu/feed", "category": "Country: USA", "country": "USA"},
    "us_ai_safety": {"name": "US AI Safety Institute", "url": "https://www.nist.gov/artificial-intelligence/us-ai-safety-institute", "rss": "", "category": "Country: USA", "country": "USA"},
    "whitehouse_ai": {"name": "White House AI", "url": "https://www.whitehouse.gov/ostp/ai-bill-of-rights/", "rss": "", "category": "Country: USA", "country": "USA"},

    # =========================================================================
    # 18. Country: China
    # =========================================================================
    "mit_tech_review_china": {"name": "MIT Tech Review China", "url": "https://www.technologyreview.cn", "rss": "https://www.technologyreview.com/topics/artificial-intelligence/feed/", "category": "Country: China", "country": "China"},
    "baidu_research": {"name": "Baidu Research", "url": "https://research.baidu.com/Blog/index-view?id=137", "rss": "https://research.baidu.com/Blog/rss", "category": "Country: China", "country": "China"},
    "alibaba_damo": {"name": "Alibaba DAMO Academy", "url": "https://damo.alibaba.com/en/", "rss": "https://damo.alibaba.com/en/feed", "category": "Country: China", "country": "China"},
    "tensorchord": {"name": "TensorChord", "url": "https://tensorchord.ai", "rss": "", "category": "Country: China", "country": "China"},

    # =========================================================================
    # 19. Country: UK
    # =========================================================================
    "uk_ai_safety_inst": {"name": "UK AI Safety Institute", "url": "https://www.gov.uk/government/organisations/ai-safety-institute", "rss": "https://www.gov.uk/government/organisations/ai-safety-institute.atom", "category": "Country: UK", "country": "UK"},
    "alan_turing": {"name": "Alan Turing Institute", "url": "https://www.turing.ac.uk/research", "rss": "", "category": "Country: UK", "country": "UK"},
    "uk_gov_ai": {"name": "UK Government AI", "url": "https://www.gov.uk/government/collections/artificial-intelligence", "rss": "", "category": "Country: UK", "country": "UK"},
    "deepmind_uk": {"name": "DeepMind UK", "url": "https://deepmind.google", "rss": "https://deepmind.google/blog/rss.xml", "category": "Country: UK", "country": "UK"},
    "cambridge_ai": {"name": "Cambridge AI", "url": "https://www.cam.ac.uk/research/artificial-intelligence", "rss": "", "category": "Country: UK", "country": "UK"},

    # =========================================================================
    # 20. Country: EU
    # =========================================================================
    "eu_ai_act_official": {"name": "EU AI Act Official", "url": "https://artificialintelligenceact.eu", "rss": "https://artificialintelligenceact.eu/feed/", "category": "Country: EU", "country": "EU"},
    "eu_ai_office": {"name": "European AI Office", "url": "https://digital-strategy.ec.europa.eu/en/policies/european-approach-artificial-intelligence", "rss": "https://digital-strategy.ec.europa.eu/en/rss.xml", "category": "Country: EU", "country": "EU"},
    "ellis": {"name": "ELLIS (European AI)", "url": "https://ellis.eu", "rss": "", "category": "Country: EU", "country": "EU"},
    "claire": {"name": "CLAIRE (EU AI)", "url": "https://claire-ai.org", "rss": "", "category": "Country: EU", "country": "EU"},
    "fraunhofer_iais": {"name": "Fraunhofer IAIS", "url": "https://www.iais.fraunhofer.de/en.html", "rss": "", "category": "Country: EU", "country": "EU"},
    "mpii_ai": {"name": "Max Planck AI", "url": "https://www.mpg.de/intelligent-systems", "rss": "https://www.nature.com/natmachintell.rss", "category": "Country: EU", "country": "EU"},
    "inria": {"name": "INRIA France", "url": "https://www.inria.fr", "rss": "", "category": "Country: EU", "country": "EU"},

    # =========================================================================
    # 21. Country: India
    # =========================================================================
    "analytics_india_country": {"name": "Analytics India Magazine", "url": "https://analyticsindiamag.com", "rss": "https://analyticsindiamag.com/feed/", "category": "Country: India", "country": "India"},
    "nasscom_ai": {"name": "NASSCOM AI", "url": "https://nasscom.in/knowledge-center/technologists-and-engineers/artificial-intelligence", "rss": "https://nasscom.in/rss.xml", "category": "Country: India", "country": "India"},
    "indiaai": {"name": "IndiaAI", "url": "https://indiaai.gov.in", "rss": "", "category": "Country: India", "country": "India"},
    "iit_research_ai": {"name": "IIT Research AI", "url": "https://www.iit.ac.in", "rss": "https://news.mit.edu/rss/feed", "category": "Country: India", "country": "India"},
    "techgig": {"name": "TechGig", "url": "https://www.techgig.com", "rss": "https://techgig.com/rss/ai", "category": "Country: India", "country": "India"},
    "express_computer": {"name": "Express Computer", "url": "https://www.expresscomputer.in", "rss": "https://www.expresscomputer.in/feed/", "category": "Country: India", "country": "India"},

    # =========================================================================
    # 22. Country: Japan
    # =========================================================================
    "japan_ai_policy": {"name": "Japan AI Policy", "url": "https://www.meti.go.jp/english/policy/mono_info_service/information_economy/artificial_intelligence/", "rss": "", "category": "Country: Japan", "country": "Japan"},
    "riken_aip": {"name": "RIKEN AIP", "url": "https://aip.riken.jp", "rss": "", "category": "Country: Japan", "country": "Japan"},
    # =========================================================================
    # 23. Country: South Korea
    # =========================================================================
    "kaist_ai": {"name": "KAIST AI", "url": "https://ai.kaist.ac.kr", "rss": "https://ai.kaist.ac.kr/feed", "category": "Country: South Korea", "country": "South Korea"},
    "kakao_brain": {"name": "Kakao Brain", "url": "https://kakaobrain.com", "rss": "https://www.koreaherald.com/rss/news.xml", "category": "Country: South Korea", "country": "South Korea"},
    "samsung_research_ai": {"name": "Samsung Research AI", "url": "https://research.samsung.com/ai", "rss": "https://news.samsung.com/global/feed", "category": "Country: South Korea", "country": "South Korea"},

    # =========================================================================
    # 24. Country: UAE
    # =========================================================================
    "uae_ai_ministry": {"name": "UAE AI Ministry", "url": "https://www.mohre.gov.ae/en/topics/ai.aspx", "rss": "", "category": "Country: UAE", "country": "UAE"},
    "mbzuai": {"name": "MBZUAI", "url": "https://mbzuai.ac.ae", "rss": "", "category": "Country: UAE", "country": "UAE"},
    "g42_ai": {"name": "G42 AI", "url": "https://www.g42.ai", "rss": "", "category": "Country: UAE", "country": "UAE"},

    # =========================================================================
    # 25. Country: Israel
    # =========================================================================
    "israel_innovation": {"name": "Israel Innovation Authority", "url": "https://innovationisrael.org.il", "rss": "https://innovationisrael.org.il/feed/", "category": "Country: Israel", "country": "Israel"},
    "ai21_labs": {"name": "AI21 Labs", "url": "https://www.ai21.com/blog", "rss": "", "category": "Country: Israel", "country": "Israel"},
    "weizmann_ai": {"name": "Weizmann Institute AI", "url": "https://www.weizmann.ac.il/math/andrey_seminar", "rss": "", "category": "Country: Israel", "country": "Israel"},

    # =========================================================================
    # 26. Country: Canada
    # =========================================================================
    "vector_institute": {"name": "Vector Institute", "url": "https://vectorinstitute.ai", "rss": "https://vectorinstitute.ai/feed/", "category": "Country: Canada", "country": "Canada"},
    "mila": {"name": "MILA", "url": "https://mila.quebec/en", "rss": "https://mila.quebec/en/feed/", "category": "Country: Canada", "country": "Canada"},
    "amii": {"name": "Amii", "url": "https://www.amii.ca", "rss": "", "category": "Country: Canada", "country": "Canada"},
    # "cifar_ai" intentionally removed — cifar.ca/feed has been returning
    # HTTP 403 to programmatic RSS clients (Cloudflare bot challenge)
    # and would hang worker threads on retries.

    # =========================================================================
    # 27. Country: Singapore
    # =========================================================================
    "sg_nai": {"name": "Singapore National AI", "url": "https://www.gov.sg/policies/building-a-national-ai-strategy", "rss": "", "category": "Country: Singapore", "country": "Singapore"},
    "ai_singapore": {"name": "AI Singapore", "url": "https://aisingapore.org", "rss": "https://aisingapore.org/feed/", "category": "Country: Singapore", "country": "Singapore"},
    "ntu_ai": {"name": "NTU AI", "url": "https://www.ntu.edu.sg/research/researchcentres/artificial-intelligence", "rss": "https://www.technologyreview.com/feed/", "category": "Country: Singapore", "country": "Singapore"},

    # =========================================================================
    # 28. Biometrics / Identity
    # =========================================================================
    "biometricupdate": {"name": "BiometricUpdate", "url": "https://www.biometricupdate.com", "rss": "https://www.biometricupdate.com/feed", "category": "Biometrics/Identity", "country": "Global"},

    # =========================================================================
    # 29. Developer Platforms / Blogs
    # =========================================================================
    "vercel_blog": {"name": "Vercel Blog", "url": "https://vercel.com/blog", "rss": "https://vercel.com/blog/rss", "category": "Developer Platforms", "country": "USA"},

    # =========================================================================
    # 30. AI Engineering / Niche Blogs
    # =========================================================================
    "terminalskills": {"name": "TerminalSkills", "url": "https://terminalskills.io", "category": "AI Engineering", "country": "Global"},
    "vinkius": {"name": "Vinkius", "url": "https://vinkius.com", "category": "AI Engineering", "country": "Global"},
    "jonnyzzz": {"name": "Jonnyzzz", "url": "https://jonnyzzz.com", "category": "AI Engineering", "country": "Global"},
    "anthropic_engineering": {"name": "Anthropic Engineering", "url": "https://www.anthropic.com/engineering", "category": "AI Engineering", "country": "USA"},

    # =========================================================================
    # 31. Quantum AI (quantum × AI convergence)
    # =========================================================================
    "quantinuum": {"name": "Quantinuum News", "url": "https://www.quantinuum.com/news", "category": "Quantum AI", "country": "UK"},
    "the_quantum_daily": {"name": "The Quantum Daily", "url": "https://thequantumdaily.com", "rss": "https://thequantumdaily.com/feed/", "category": "Quantum AI", "country": "USA"},
    "pasqal": {"name": "PASQAL", "url": "https://www.pasqal.com/news", "category": "Quantum AI", "country": "EU"},
    "iqm": {"name": "IQM Quantum Computers", "url": "https://www.meetiqm.com/newsroom", "category": "Quantum AI", "country": "EU"},
    "quera": {"name": "QuEra Computing", "url": "https://www.quera.com/news", "category": "Quantum AI", "country": "USA"},
    "quantum_ai_news": {"name": "Quantum AI Research News", "url": "https://quantumai.google", "rss": "https://blog.google/technology/ai/rss/", "category": "Quantum AI", "country": "USA"},

    # =========================================================================
    # 32. Semiconductors & AI Chips (hardware deep-dives + industry)
    # =========================================================================
    "semi_analysis": {"name": "SemiAnalysis", "url": "https://semianalysis.com", "rss": "", "category": "Semiconductors", "country": "USA"},
    "semiwiki": {"name": "SemiWiki", "url": "https://semiwiki.com", "rss": "https://semiwiki.com/feed/", "category": "Semiconductors", "country": "USA"},
    "chips_and_cheese": {"name": "Chips and Cheese (microarchitecture)", "url": "https://chipsandcheese.com", "rss": "https://chipsandcheese.com/feed/", "category": "Semiconductors", "country": "USA"},
    "trendforce": {"name": "TrendForce", "url": "https://www.trendforce.com/presscenter/", "category": "Semiconductors", "country": "China"},
    "the_register": {"name": "The Register", "url": "https://www.theregister.com/software/chips/", "rss": "https://www.theregister.com/software/ai_ml/headlines.atom", "category": "Semiconductors", "country": "UK"},
    "next_platform": {"name": "The Next Platform", "url": "https://www.nextplatform.com", "rss": "https://www.nextplatform.com/feed/", "category": "Semiconductors", "country": "USA"},
    "hpcwire": {"name": "HPCwire", "url": "https://www.hpcwire.com", "rss": "", "category": "Semiconductors", "country": "USA"},
    "micron": {"name": "Micron Newsroom", "url": "https://investors.micron.com/news-releases", "category": "Semiconductors", "country": "USA"},
    "sk_hynix": {"name": "SK hynix Newsroom", "url": "https://news.skhynix.com/", "category": "Semiconductors", "country": "South Korea"},
    "asml": {"name": "ASML", "url": "https://www.asml.com/en/news", "category": "Semiconductors", "country": "EU"},
    "groq": {"name": "Groq (LPU AI Chips)", "url": "https://groq.com/news/", "category": "Semiconductors", "country": "USA"},
    "tenstorrent": {"name": "Tenstorrent (RISC-V AI)", "url": "https://tenstorrent.com/blog/", "category": "Semiconductors", "country": "Canada"},
    "sambanova": {"name": "SambaNova Systems", "url": "https://sambanova.ai/blog/", "category": "Semiconductors", "country": "USA"},
    "lightmatter": {"name": "Lightmatter (Photonic AI)", "url": "https://lightmatter.co/news/", "category": "Semiconductors", "country": "USA"},
    "etched": {"name": "Etched (Transformer ASICs)", "url": "https://www.etched.com/blog", "category": "Semiconductors", "country": "USA"},
    "rebellions": {"name": "Rebellions (NPU)", "url": "https://www.rebellions.ai/news", "category": "Semiconductors", "country": "South Korea"},
    "furiosaai": {"name": "FuriosaAI (NPU)", "url": "https://furiosa.ai/news", "category": "Semiconductors", "country": "South Korea"},

    # =========================================================================
    # 33. AGI & AI Futures (scaling, alignment, forecasting)
    # =========================================================================
    "epoch_ai": {"name": "Epoch AI", "url": "https://epochai.org", "rss": "", "category": "AGI & AI Futures", "country": "Global"},
    "lesswrong": {"name": "LessWrong", "url": "https://www.lesswrong.com", "rss": "https://www.lesswrong.com/feed.xml", "category": "AGI & AI Futures", "country": "Global"},
    "cold_takes": {"name": "Cold Takes", "url": "https://www.cold-takes.com", "rss": "", "category": "AGI & AI Futures", "country": "USA"},
    "ais_journal": {"name": "Autonomous Intelligent Systems (Springer)", "url": "https://link.springer.com/journal/43677", "category": "AGI & AI Futures", "country": "Global"},
    "situational_awareness": {"name": "Situation Awareness (Leopold Aschenbrenner)", "url": "https://situational-awareness.ai", "category": "AGI & AI Futures", "country": "USA"},

    # =========================================================================
    # 34. Robotics & Embodied AI (extended)
    # =========================================================================
    "agibot": {"name": "AgiBot (Zhiyuan Robotics)", "url": "https://www.agibot.com/news/", "category": "Robotics", "country": "China"},
    "1x_tech": {"name": "1X Technologies", "url": "https://www.1x.tech/news", "category": "Robotics", "country": "Norway"},
    "nimble": {"name": "Nimble (Embodied AI)", "url": "https://www.nimble.ai/news/", "category": "Robotics", "country": "USA"},
    "sci_robotics": {"name": "Science Robotics", "url": "https://www.science.org/journal/scirobotics", "rss": "https://www.science.org/action/showFeed?type=etoc&feed=rss&jc=scirobotics", "category": "Robotics", "country": "USA"},

    # =========================================================================
    # 35. Global AI ecosystems — new countries
    # =========================================================================
    "qbitai": {"name": "QbitAI (量子位)", "url": "https://www.qbitai.com", "rss": "https://www.qbitai.com/feed", "category": "AI & ML News", "country": "China"},
    "jiqizhixin": {"name": "Machines / Jiqizhixin (机器之心)", "url": "https://www.jiqizhixin.com", "rss": "https://www.jiqizhixin.com/rss", "category": "AI & ML News", "country": "China"},
    "dfki": {"name": "DFKI German AI Research", "url": "https://www.dfki.de/web/news", "category": "AI & ML News", "country": "Germany"},
    "heise_ai": {"name": "heise online (Germany)", "url": "https://www.heise.de/themen/Kuenstliche-Intelligenz", "rss": "https://www.heise.de/rss/heise.rdf", "category": "AI & ML News", "country": "Germany"},
    "digitimes": {"name": "DigiTimes Asia", "url": "https://www.digitimes.com", "category": "Semiconductors", "country": "Taiwan"},
    "etnews": {"name": "ETNews Korea", "url": "https://www.etnews.com", "category": "AI & ML News", "country": "South Korea"},
    "korea_herald_ai": {"name": "The Korea Herald AI", "url": "https://www.koreaherald.com/National/Tech", "rss": "https://www.koreaherald.com/rss/news.xml", "category": "AI & ML News", "country": "South Korea"},
    "ai_switzerland": {"name": "ETH AI Center", "url": "https://ai.ethz.ch", "rss": "https://blog.google/technology/rss/", "category": "AI & ML News", "country": "Switzerland"},
    "south_africa_ai": {"name": "University of Pretoria AI", "url": "https://www.up.ac.za/artificial-intelligence", "category": "AI & ML News", "country": "South Africa"},
    "australia_ncc": {"name": "Australian AI (CSIRO + gov)", "url": "https://www.csiro.au/en/research/technology-space/ai", "category": "AI & ML News", "country": "Australia"},

    # =========================================================================
    # 36. Emerging AI Tech Stack (new tools/platforms)
    # =========================================================================
    "silicon_angle": {"name": "SiliconANGLE (AI Infra)", "url": "https://siliconangle.com", "rss": "https://siliconangle.com/feed/", "category": "AI & ML News", "country": "USA"},
    "modal_blog": {"name": "Modal Blog (Serverless GPU)", "url": "https://modal.com/blog", "rss": "", "category": "AI Engineering", "country": "USA"},
    "baseten": {"name": "Baseten Blog (Model Deploy)", "url": "https://www.baseten.co/blog", "rss": "", "category": "AI Engineering", "country": "USA"},
    "vllm_blog": {"name": "vLLM Blog", "url": "https://blog.vllm.ai", "rss": "", "category": "AI Engineering", "country": "USA"},
    "together_ai": {"name": "Together AI Blog", "url": "https://www.together.ai/blog", "rss": "https://www.together.ai/blog/rss.xml", "category": "AI & ML News", "country": "USA"},
    # =========================================================================
    # 37. AI Tech Stack — Reddit, Medium & developer communities (stack news only)
    # =========================================================================
    # ---- Reddit communities (r/{sub}.rss) ----
    "reddit_localllama": {"name": "r/LocalLLaMA (LLM Dev)", "url": "https://www.reddit.com/r/LocalLLaMA/", "rss": "https://www.reddit.com/r/LocalLLaMA/.rss", "category": "AI Engineering", "country": "USA"},
    "reddit_llmdevs": {"name": "r/LLMDevs", "url": "https://www.reddit.com/r/LLMDevs/", "rss": "https://www.reddit.com/r/LLMDevs/.rss", "category": "AI Engineering", "country": "USA"},
    "reddit_ollama": {"name": "r/Ollama", "url": "https://www.reddit.com/r/Ollama/", "rss": "https://www.reddit.com/r/Ollama/.rss", "category": "AI Engineering", "country": "USA"},
    "reddit_langchain": {"name": "r/LangChain", "url": "https://www.reddit.com/r/LangChain/", "rss": "https://www.reddit.com/r/LangChain/.rss", "category": "AI Engineering", "country": "USA"},
    "reddit_rag": {"name": "r/RAG (Retrieval)", "url": "https://www.reddit.com/r/RAG/", "rss": "https://www.reddit.com/r/RAG/.rss", "category": "AI Engineering", "country": "USA"},
    "reddit_ai_agents": {"name": "r/AI_Agents", "url": "https://www.reddit.com/r/AI_Agents/", "rss": "https://www.reddit.com/r/AI_Agents/.rss", "category": "AI Engineering", "country": "USA"},
    "reddit_mlops": {"name": "r/mlops", "url": "https://www.reddit.com/r/mlops/", "rss": "https://www.reddit.com/r/mlops/.rss", "category": "AI Engineering", "country": "USA"},
    "reddit_llm": {"name": "r/LLM", "url": "https://www.reddit.com/r/LLM/", "rss": "https://www.reddit.com/r/LLM/.rss", "category": "AI Engineering", "country": "USA"},
    "reddit_machinelearning": {"name": "r/MachineLearning", "url": "https://www.reddit.com/r/MachineLearning/", "rss": "https://www.reddit.com/r/MachineLearning/.rss", "category": "AI & ML News", "country": "USA"},
    "reddit_huggingface": {"name": "r/huggingface", "url": "https://www.reddit.com/r/huggingface/", "rss": "https://www.reddit.com/r/huggingface/.rss", "category": "AI Engineering", "country": "USA"},
    "reddit_promptengineering": {"name": "r/PromptEngineering", "url": "https://www.reddit.com/r/PromptEngineering/", "rss": "https://www.reddit.com/r/PromptEngineering/.rss", "category": "AI Engineering", "country": "USA"},
    "reddit_learnmachinelearning": {"name": "r/learnmachinelearning", "url": "https://www.reddit.com/r/learnmachinelearning/", "rss": "https://www.reddit.com/r/learnmachinelearning/.rss", "category": "AI & ML News", "country": "USA"},
    # ---- Medium publications & topic tags (medium.com/feed/...) ----
    "medium_towards_data_science": {"name": "Medium · Towards Data Science", "url": "https://towardsdatascience.com", "rss": "https://medium.com/feed/towards-data-science", "category": "AI Engineering", "country": "USA"},
    "medium_towards_ai": {"name": "Medium · Towards AI", "url": "https://pub.towardsai.net", "rss": "https://medium.com/feed/towards-artificial-intelligence", "category": "AI & ML News", "country": "USA"},
    "medium_mlearning_ai": {"name": "Medium · MLearning.ai", "url": "https://medium.com/mlearning-ai", "rss": "", "category": "AI Engineering", "country": "USA"},
    "medium_ai_in_plain_english": {"name": "Medium · AI in Plain English", "url": "https://medium.com/ai-in-plain-english", "rss": "https://medium.com/feed/ai-in-plain-english", "category": "AI & ML News", "country": "USA"},
    "medium_tag_llm": {"name": "Medium #llm", "url": "https://medium.com/tag/llm", "rss": "https://medium.com/feed/tag/llm", "category": "AI Engineering", "country": "USA"},
    "medium_tag_ai_agents": {"name": "Medium #ai-agents", "url": "https://medium.com/tag/ai-agents", "rss": "https://medium.com/feed/tag/ai-agents", "category": "AI Engineering", "country": "USA"},
    "medium_tag_rag": {"name": "Medium #rag", "url": "https://medium.com/tag/rag", "rss": "https://medium.com/feed/tag/rag", "category": "AI Engineering", "country": "USA"},
    "medium_tag_mlops": {"name": "Medium #mlops", "url": "https://medium.com/tag/mlops", "rss": "https://medium.com/feed/tag/mlops", "category": "AI Engineering", "country": "USA"},
    "medium_tag_vector_database": {"name": "Medium #vector-database", "url": "https://medium.com/tag/vector-database", "rss": "https://medium.com/feed/tag/vector-database", "category": "AI Engineering", "country": "USA"},
    "medium_tag_pytorch": {"name": "Medium #pytorch", "url": "https://medium.com/tag/pytorch", "rss": "https://medium.com/feed/tag/pytorch", "category": "AI Engineering", "country": "USA"},
    "medium_tag_ai_projects": {"name": "Medium #ai-projects", "url": "https://medium.com/tag/ai-projects", "rss": "https://medium.com/feed/tag/ai-projects", "category": "AI Engineering", "country": "USA"},
    "medium_tag_prompt_engineering": {"name": "Medium #prompt-engineering", "url": "https://medium.com/tag/prompt-engineering", "rss": "https://medium.com/feed/tag/prompt-engineering", "category": "AI Engineering", "country": "USA"},
    "medium_tag_generative_ai": {"name": "Medium #generative-ai", "url": "https://medium.com/tag/generative-ai", "rss": "https://medium.com/feed/tag/generative-ai", "category": "AI & ML News", "country": "USA"},
    "medium_tag_ai_tools": {"name": "Medium #ai-tools", "url": "https://medium.com/tag/ai-tools", "rss": "https://medium.com/feed/tag/ai-tools", "category": "AI Engineering", "country": "USA"},
    "medium_tag_artificial_intelligence": {"name": "Medium #artificial-intelligence", "url": "https://medium.com/tag/artificial-intelligence", "rss": "https://medium.com/feed/tag/artificial-intelligence", "category": "AI & ML News", "country": "USA"},
    "medium_tag_machine_learning": {"name": "Medium #machine-learning", "url": "https://medium.com/tag/machine-learning", "rss": "https://medium.com/feed/tag/machine-learning", "category": "AI & ML News", "country": "USA"},
    # ---- Tech-stack blogs, engineering feeds & newsletters ----
    "simon_willison": {"name": "Simon Willison (LLM Tools)", "url": "https://simonwillison.net", "rss": "https://simonwillison.net/atom/everything/", "category": "AI Engineering", "country": "UK"},
    "hf_blog": {"name": "Hugging Face Blog", "url": "https://huggingface.co/blog", "rss": "https://huggingface.co/blog/feed.xml", "category": "AI Engineering", "country": "USA"},
    "pytorch_blog": {"name": "PyTorch Blog", "url": "https://pytorch.org/blog", "rss": "https://pytorch.org/feed/", "category": "AI Engineering", "country": "USA"},
    "tensorflow_blog": {"name": "TensorFlow Blog", "url": "https://blog.tensorflow.org", "rss": "https://blog.tensorflow.org/feeds/posts/default", "category": "AI Engineering", "country": "USA"},
    "the_new_stack": {"name": "The New Stack (AI Stack)", "url": "https://thenewstack.io", "rss": "https://thenewstack.io/feed/", "category": "AI & ML News", "country": "USA"},
    "nvidia_developer_blog": {"name": "NVIDIA Developer Blog", "url": "https://developer.nvidia.com/blog", "rss": "https://developer.nvidia.com/blog/feed/", "category": "AI Engineering", "country": "USA"},
    "databricks_blog": {"name": "Databricks Engineering", "url": "https://www.databricks.com/blog", "rss": "", "category": "AI & ML News", "country": "USA"},
    "streamlit_blog": {"name": "Streamlit Blog (AI Apps)", "url": "https://blog.streamlit.io", "rss": "https://blog.streamlit.io/feed/", "category": "AI Engineering", "country": "USA"},
    "lilian_weng": {"name": "Lilian Weng ML Blog", "url": "https://lilianweng.github.io", "rss": "https://lilianweng.github.io/index.xml", "category": "AI Engineering", "country": "USA"},
    "the_gradient": {"name": "The Gradient", "url": "https://thegradient.pub", "rss": "https://thegradient.pub/rss/", "category": "AI Engineering", "country": "USA"},
    "deepspeed_blog": {"name": "DeepSpeed Blog", "url": "https://www.deepspeed.ai", "rss": "https://www.deepspeed.ai/feed.xml", "category": "AI Engineering", "country": "USA"},
    "google_ai_blog": {"name": "Google AI Blog (Dev)", "url": "https://developers.googleblog.com", "rss": "https://blog.google/technology/ai/rss/", "category": "AI Engineering", "country": "USA"},
    "milvus_blog": {"name": "LangChain Blog", "url": "https://blog.langchain.com", "rss": "", "category": "AI Engineering", "country": "USA"},
    "weaviate_blog": {"name": "Weaviate Blog (Vector DB)", "url": "https://weaviate.io/blog", "rss": "https://weaviate.io/blog/rss.xml", "category": "AI Engineering", "country": "USA"},
    "theregister_ai_ml": {"name": "The Register · AI/ML", "url": "https://www.theregister.com/software/ai_ml/", "rss": "https://www.theregister.com/software/ai_ml/headlines.atom", "category": "AI & ML News", "country": "UK"},
    "github_blog": {"name": "GitHub Blog (AI & Dev)", "url": "https://github.blog", "rss": "https://github.blog/feed/", "category": "Developer News", "country": "USA"},
    "lancedb_blog": {"name": "LanceDB Blog", "url": "https://blog.lancedb.com", "rss": "https://blog.lancedb.com/rss.xml", "category": "AI Engineering", "country": "USA"},
    "ahead_of_ai": {"name": "Ahead of AI (Raschka)", "url": "https://magazine.sebastianraschka.com", "rss": "https://magazine.sebastianraschka.com/feed", "category": "AI Engineering", "country": "USA"},
    "interconnects": {"name": "Interconnects (Lambert)", "url": "https://www.interconnects.ai", "rss": "https://www.interconnects.ai/feed", "category": "AI Engineering", "country": "USA"},
    "latent_space": {"name": "Latent Space AI", "url": "https://www.latent.space", "rss": "https://www.latent.space/feed", "category": "AI Engineering", "country": "USA"},
    "mlops_community": {"name": "MLOps Community Roundup", "url": "https://mlops.community", "rss": "", "category": "AI Engineering", "country": "UK"},
    "data_engineering_weekly": {"name": "Data Engineering Weekly", "url": "https://www.dataengineeringweekly.com", "rss": "https://www.dataengineeringweekly.com/feed", "category": "AI & ML News", "country": "USA"},
    "cloudflare_ai_blog": {"name": "Cloudflare AI Blog", "url": "https://blog.cloudflare.com/tag/ai/", "rss": "https://blog.cloudflare.com/tag/ai/rss", "category": "AI Engineering", "country": "USA"},
    "google_ai_blog": {"name": "Google AI Blog", "url": "https://blog.google/technology/ai/", "rss": "https://blog.google/technology/ai/rss/", "category": "AI & ML News", "country": "USA"},
    "aws_ml_blog": {"name": "AWS ML Blog", "url": "https://aws.amazon.com/blogs/machine-learning/", "rss": "https://aws.amazon.com/blogs/machine-learning/feed/", "category": "AI Engineering", "country": "USA"},
}

# Worldwide coverage: verified national tech/AI publishers + one Google News
# "artificial intelligence" edition per country, in that country's language.
from news_sources_world import WORLD_AI_NEWS_SOURCES
for _wk, _wv in WORLD_AI_NEWS_SOURCES.items():
    AI_NEWS_SOURCES.setdefault(_wk, _wv)


def _strip_html(text: str) -> str:
    """Remove HTML tags and decode entities (including double-encoded)."""
    if not text:
        return ""
    clean = re.sub(r'<[^>]+>', '', text)
    clean = _html_mod.unescape(clean)
    # Double-encoded entities (e.g. &amp;#8217; -> &#8217; -> ')
    clean = _html_mod.unescape(clean)
    return clean.strip()


# Image discovery regex — matches <img src="..."> and media URLs inside feed content.
_IMG_TAG_RE = re.compile(r'<img[^>]+src=["\']([^"\']+)["\']', re.IGNORECASE)
_MEDIA_NS = {'media': 'http://search.yahoo.com/mrss/'}


def _extract_feed_image(raw_html: str, node: ET.Element) -> str:
    """Best-effort thumbnail extraction from an RSS/Atom item.

    Looks for (in order) media:thumbnail/media:content, image enclosures,
    and finally the first <img src="..."> embedded in the description/content.
    """
    try:
        # 1) media RSS tags (media:thumbnail / media:content)
        for tag in ('thumbnail', 'content'):
            el = node.find(f'{{{_MEDIA_NS["media"]}}}{tag}')
            if el is not None:
                url = el.get('url') or el.get('src') or ''
                if url:
                    return url.strip()
        # 2) RSS 2.0 enclosure (type="image/*")
        enc = node.find('enclosure')
        if enc is not None:
            url = enc.get('url', '') or ''
            etype = enc.get('type', '') or ''
            if url and etype.startswith('image'):
                return url.strip()
    except Exception:
        pass
    # 3) first <img> tag inside the item's HTML content
    if raw_html:
        m = _IMG_TAG_RE.search(raw_html)
        if m:
            return m.group(1).strip()
    return ""


# ---- Per-article "best image" enrichment --------------------------------------
# When a feed item carries no image at all (e.g. OpenAI), fetch the article
# page and read its Open Graph / Twitter image — the publisher's own curated
# thumbnail for that exact story. Results are cached in memory (TTL ~6h) so
# repeated category fetches stay fast.
_OG_IMAGE_CACHE = {}
_META_TAG_RE = re.compile(r"<meta[^>]*>", re.IGNORECASE | re.DOTALL)
_LINK_IMAGE_SRC_RE = re.compile(r'<link[^>]+rel=["\']image_src["\'][^>]*>', re.IGNORECASE)
_OG_IMAGE_PROPS = ("og:image", "og:image:url", "og:image:secure_url",
                   "twitter:image", "twitter:image:src", "article:cover")


def _meta_attr(tag: str, attr: str) -> str:
    m = re.search(attr + r'\s*=\s*["\']([^"\']+)["\']', tag, re.IGNORECASE)
    return m.group(1).strip() if m else ""


def _fetch_og_image(url: str) -> str:
    """Return a meaningful image URL for an article link ('' if not found)."""
    if not url or not url.startswith(("http://", "https://")):
        return ""
    now = time.time()
    hit = _OG_IMAGE_CACHE.get(url)
    if hit and hit[0] > now:
        return hit[1]
    img = ""
    # One retry: many sites (OpenAI, Cloudflare-fronted pages) transiently
    # rate-limit burst fetches; a single retry fixes most misses cheaply.
    for attempt in range(2):
        try:
            ctx = ssl.create_default_context()
            ctx.check_hostname = False
            ctx.verify_mode = ssl.CERT_NONE
            req = Request(url, headers={
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                "Accept-Language": "en-US,en;q=0.9",
            })
            with urlopen(req, timeout=7, context=ctx) as resp:
                body = resp.read(262144).decode("utf-8", "replace")
            found = ""
            for tag in _META_TAG_RE.findall(body):
                prop = (_meta_attr(tag, "property") or _meta_attr(tag, "name")).lower()
                if prop in _OG_IMAGE_PROPS:
                    c = _meta_attr(tag, "content")
                    if c:
                        found = c
                        break
            if not found:
                lm = _LINK_IMAGE_SRC_RE.search(body)
                if lm:
                    found = _meta_attr(lm.group(0), "href")
            if not found:
                for m in _IMG_TAG_RE.finditer(body):
                    src = m.group(1).strip()
                    low = src.lower()
                    if (src.startswith(("http://", "https://")) and "data:image" not in low
                            and ".svg" not in low and "spacer" not in low
                            and "tracking" not in low and "blank" not in low):
                        found = src
                        break
            img = found
            if img:
                break
            time.sleep(0.25)
        except Exception:
            if attempt == 0:
                time.sleep(0.25)
            continue
    # Cache hits for 6h; cache misses briefly (15 min) so a later re-fetch of
    # the same category can still pick up an image that was transiently blocked.
    ttl = now + 6 * 3600 if img else now + 900
    _OG_IMAGE_CACHE[url] = (ttl, img)
    if len(_OG_IMAGE_CACHE) > 6000:
        _OG_IMAGE_CACHE.clear()
    return img


def _enrich_item_images(items: list, max_items: int = 10, workers: int = 4) -> None:
    """Fill in a real per-article image for items still missing one."""
    missing = [it for it in items if not (it.get("image") or "").strip()][:max_items]
    if not missing:
        return
    try:
        from concurrent.futures import ThreadPoolExecutor
        with ThreadPoolExecutor(max_workers=workers) as ex:
            futures = [(it, ex.submit(_fetch_og_image, it.get("url", ""))) for it in missing]
            for it, fut in futures:
                try:
                    og = fut.result()
                except Exception:
                    og = ""
                if og:
                    it["image"] = og
    except Exception:
        pass


def _parse_rss_xml(xml_text: str, source_key: str) -> list:
    """Parse RSS/Atom XML and return list of items."""
    items = []
    try:
        root = ET.fromstring(xml_text)
    except ET.ParseError:
        return items

    ns = {'atom': 'http://www.w3.org/2005/Atom'}

    # Try RSS 2.0 format first
    for item in root.iter('item'):
        title = item.findtext('title', '').strip()
        link = item.findtext('link', '').strip()
        pub_date = item.findtext('pubDate', '').strip()
        raw_desc = item.findtext('description', '') or ''
        description = _strip_html(raw_desc)
        if title and link:
            items.append({
                "title": title,
                "url": link,
                "date": pub_date,
                "snippet": description[:300] if description else "",
                "image": _extract_feed_image(raw_desc, item),
                "source": source_key,
            })

    # If no RSS items, try Atom format
    if not items:
        for entry in root.findall('.//atom:entry', ns):
            title = entry.findtext('atom:title', '', ns).strip()
            link_el = entry.find('atom:link', ns)
            link = link_el.get('href', '') if link_el is not None else ''
            pub_date = entry.findtext('atom:published', '', ns) or entry.findtext('atom:updated', '', ns)
            pub_date = (pub_date or '').strip()
            raw_content = entry.findtext('atom:content', '', ns) or entry.findtext('atom:summary', '', ns) or ''
            summary = _strip_html(raw_content)
            if title and link:
                items.append({
                    "title": title,
                    "url": link,
                    "date": pub_date,
                    "snippet": summary[:300] if summary else "",
                    "image": _extract_feed_image(raw_content, entry),
                    "source": source_key,
                })

    return items[:10]  # Max 10 items per source


def _scrape_website_for_articles(url: str, source_key: str, selectors: dict = None) -> list:
    """Generic web scraper fallback for sources without RSS.

    Delegates to the multi-strategy news_scraper module. Returns article items
    in the same format as RSS feeds for seamless frontend rendering.
    """
    try:
        items = fetch_via_scraping(source_key, url)
        # Normalize items to include source_key for consistency
        for item in items:
            item["source"] = source_key
        return items
    except Exception:
        return []


# _try_common_rss_paths has been moved to news_scraper.py (try_common_rss_paths)
# Kept as thin wrapper for backward compatibility
from news_scraper import try_common_rss_paths as _try_common_rss_paths


def _fetch_aclu_ai(key: str, source: dict) -> dict:
    """Fetch ACLU AI page articles via Google cache or alternative approach."""
    items = []
    # ACLU blocks scrapers; try fetching the page with Googlebot UA
    urls_to_try = [
        source["url"],
        "https://www.aclu.org/issues/privacy-technology/surveillance-technologies/artificial-intelligence",
    ]
    for url in urls_to_try:
        try:
            ctx = ssl.create_default_context()
            ctx.check_hostname = False
            ctx.verify_mode = ssl.CERT_NONE
            req = Request(url, headers={
                "User-Agent": "Googlebot/2.1 (+http://www.google.com/bot.html)",
                "Accept": "text/html,application/xhtml+xml,*/*",
            })
            with urlopen(req, timeout=8, context=ctx) as resp:
                html = resp.read().decode("utf-8", errors="replace")
            import re
            for m in re.finditer(r'<a[^>]+href="(/[^"]+)"[^>]*>\s*([^<]{15,120})\s*</a>', html, re.IGNORECASE):
                link, title = m.group(1), _strip_html(m.group(2)).strip()
                lower = title.lower()
                skip_words = ['subscribe', 'sign up', 'login', 'about', 'contact', 'privacy', 'terms', 'menu', 'home', 'donate', 'share']
                if any(w in lower for w in skip_words) or len(title) < 15:
                    continue
                full_link = f"https://www.aclu.org{link}" if link.startswith('/') else link
                if title not in [i["title"] for i in items]:
                    items.append({"title": title, "url": full_link, "date": "", "snippet": "", "source": key})
            if items:
                break
        except Exception:
            continue
    return {"key": key, "name": source["name"], "items": items[:5], "url": source["url"], "error": None if items else "Blocked by server"}


def _fetch_ai_breakfast(key: str, source: dict) -> dict:
    """Fetch AI Breakfast (Beehiiv) articles via RSS."""
    items = []
    rss_urls = [
        "https://newsletter.theaiedge.io/feed",
        "https://aibreakfast.beehiiv.com/feed",
    ]
    for rss_url in rss_urls:
        try:
            ctx = ssl.create_default_context()
            ctx.check_hostname = False
            ctx.verify_mode = ssl.CERT_NONE
            req = Request(rss_url, headers={
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                "Accept": "application/rss+xml, application/xml, text/xml, */*",
            })
            with urlopen(req, timeout=15, context=ctx) as resp:
                content = resp.read().decode("utf-8", errors="replace")
            items = _parse_rss_xml(content, key)
            if items:
                break
        except Exception:
            continue
    return {"key": key, "name": source["name"], "items": items[:5], "url": source["url"], "error": None if items else "Scraping blocked"}


def _fetch_ai_news_site(key: str, source: dict) -> dict:
    """Fetch AI News site - tries RSS first with extra headers, falls back to scraping."""
    items = []
    try:
        ctx = ssl.create_default_context()
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE
        req = Request(source.get("rss", ""), headers={
            "User-Agent": "Googlebot/2.1 (+http://www.google.com/bot.html)",
            "Accept": "application/rss+xml, application/xml, text/xml, */*",
        })
        with urlopen(req, timeout=15, context=ctx) as resp:
            content = resp.read().decode("utf-8", errors="replace")
        items = _parse_rss_xml(content, key)
    except Exception:
        pass
    if not items:
        items = _scrape_website_for_articles(source["url"], key)
    return {"key": key, "name": source["name"], "items": items[:5], "url": source["url"], "error": None if items else "Blocked by server"}


def _fetch_ai_native_dev(key: str, source: dict) -> dict:
    """Fetch AI Native Dev articles via Sanity API."""
    items = []
    try:
        import urllib.parse as _urlparse
        query = '*[_type in ["article","podcast"]]|order(publishedAt desc)[0..8]{title,_id,_type}'
        encoded = _urlparse.quote(query)
        api_url = f"https://ojuglg5y.api.sanity.io/v2021-10-21/data/query/production?query={encoded}"
        ctx = ssl.create_default_context()
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE
        req = Request(api_url, headers={
            "User-Agent": "Mozilla/5.0",
            "Accept": "application/json",
        })
        with urlopen(req, timeout=10, context=ctx) as resp:
            data = json.loads(resp.read().decode("utf-8"))
        for r in data.get("result", []):
            title = r.get("title", "")
            if title:
                slug = title.lower().replace(" ", "-").replace(":", "").replace("?", "").replace("!", "")
                slug = "".join(c for c in slug if c.isalnum() or c == "-")
                items.append({
                    "title": title,
                    "url": f"https://ainativedev.com/{slug}",
                    "date": "",
                    "snippet": r.get("_type", "article"),
                    "source": key,
                })
    except Exception:
        pass
    if not items:
        items = _scrape_website_for_articles(source["url"], key)
    return {"key": key, "name": source["name"], "items": items[:5], "url": source["url"], "error": None if items else "Blocked by server"}


def _fetch_karpathy(key: str, source: dict) -> dict:
    """Fetch Karpathy's blog via GitHub commits to his blog repo."""
    try:
        ctx = ssl.create_default_context()
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE
        req = Request("https://api.github.com/repos/karpathy/karpathy.github.io/commits?per_page=5", headers={
            "User-Agent": "Mozilla/5.0",
            "Accept": "application/vnd.github.v3+json",
        })
        with urlopen(req, timeout=10, context=ctx) as resp:
            data = json.loads(resp.read().decode())
        items = []
        for commit in data:
            msg = commit.get("commit", {}).get("message", "")
            date = commit.get("commit", {}).get("committer", {}).get("date", "")
            sha = commit.get("sha", "")[:7]
            html_url = commit.get("html_url", "")
            if msg:
                items.append({
                    "title": msg.split("\n")[0][:100],
                    "url": html_url,
                    "date": date,
                    "snippet": msg[:200],
                    "source": key,
                })
        return {"key": key, "name": source["name"], "items": items[:5], "url": source["url"], "error": None}
    except Exception as e:
        return {"key": key, "name": source["name"], "items": [], "url": source["url"], "error": str(e)[:100]}


def _fetch_deeplearning_batch(key: str, source: dict) -> dict:
    """Fetch The Batch via web scraping."""
    items = _scrape_website_for_articles(source["url"], key)
    if items:
        return {"key": key, "name": source["name"], "items": items[:5], "url": source["url"], "error": None}
    return {"key": key, "name": source["name"], "items": [], "url": source["url"], "error": "No articles found"}


def _fetch_techpresso(key: str, source: dict) -> dict:
    """Fetch Techpresso via RSS.app feed or web scraping."""
    # Try RSS.app feed first
    try:
        ctx = ssl.create_default_context()
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE
        req = Request("https://rss.app/feeds/v1.1/techpresso.json", headers={
            "User-Agent": "Mozilla/5.0",
            "Accept": "application/json",
        })
        with urlopen(req, timeout=10, context=ctx) as resp:
            data = json.loads(resp.read().decode())
        items = []
        for item in data.get("items", [])[:5]:
            items.append({
                "title": item.get("title", ""),
                "url": item.get("url", ""),
                "date": item.get("published", ""),
                "snippet": item.get("description", "")[:200],
                "source": key,
            })
        if items:
            return {"key": key, "name": source["name"], "items": items, "url": source["url"], "error": None}
    except Exception:
        pass
    
    # Fallback to web scraping
    items = _scrape_website_for_articles(source["url"], key)
    return {"key": key, "name": source["name"], "items": items[:5], "url": source["url"], "error": None if items else "No articles found"}


def _fetch_langgraph_docs(key: str, source: dict) -> dict:
    """Fetch LangGraph docs via GitHub releases."""
    try:
        ctx = ssl.create_default_context()
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE
        req = Request("https://api.github.com/repos/langchain-ai/langgraph/releases?per_page=5", headers={
            "User-Agent": "Mozilla/5.0",
            "Accept": "application/vnd.github.v3+json",
        })
        with urlopen(req, timeout=10, context=ctx) as resp:
            data = json.loads(resp.read().decode())
        items = []
        for release in data:
            items.append({
                "title": release.get("name", "Release"),
                "url": release.get("html_url", ""),
                "date": release.get("published_at", ""),
                "snippet": (release.get("body", "") or "")[:200],
                "source": key,
            })
        return {"key": key, "name": source["name"], "items": items[:5], "url": source["url"], "error": None}
    except Exception as e:
        return {"key": key, "name": source["name"], "items": [], "url": source["url"], "error": str(e)[:100]}


def _fetch_paperswithcode(key: str, source: dict) -> dict:
    """Fetch Papers With Code via web scraping."""
    items = _scrape_website_for_articles("https://paperswithcode.com", key)
    if not items:
        # Fallback: try GitHub trending ML
        try:
            ctx = ssl.create_default_context()
            ctx.check_hostname = False
            ctx.verify_mode = ssl.CERT_NONE
            req = Request("https://api.github.com/search/repositories?q=machine+learning+paper&sort=updated&per_page=5", headers={
                "User-Agent": "Mozilla/5.0",
                "Accept": "application/vnd.github.v3+json",
            })
            with urlopen(req, timeout=10, context=ctx) as resp:
                data = json.loads(resp.read().decode())
            for repo in data.get("items", [])[:5]:
                items.append({
                    "title": repo.get("full_name", ""),
                    "url": repo.get("html_url", ""),
                    "date": repo.get("updated_at", ""),
                    "snippet": (repo.get("description", "") or "")[:200],
                    "source": key,
                })
        except Exception:
            pass
    return {"key": key, "name": source["name"], "items": items[:5], "url": source["url"], "error": None if items else "No articles found"}


def _fetch_therobotreport(key: str, source: dict) -> dict:
    """Fetch The Robot Report via RSS with retry."""
    rss_url = "https://www.therobotreport.com/feed/"
    try:
        ctx = ssl.create_default_context()
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE
        
        # Try with different User-Agent
        req = Request(rss_url, headers={
            "User-Agent": "FeedFetcher-Google; (+http://www.google.com/feedfetcher.html)",
            "Accept": "application/rss+xml, application/xml, text/xml, */*",
        })
        with urlopen(req, timeout=15, context=ctx) as resp:
            xml_text = resp.read().decode("utf-8", errors="replace")
        items = _parse_rss_xml(xml_text, key)
        if items:
            return {"key": key, "name": source["name"], "items": items[:5], "url": source["url"], "error": None}
    except Exception:
        pass
    
    # Fallback to web scraping
    items = _scrape_website_for_articles(source["url"], key)
    return {"key": key, "name": source["name"], "items": items[:5], "url": source["url"], "error": None if items else "Blocked by server"}


# Map of source keys to custom fetch functions
CUSTOM_FETCHERS = {
    "karpathy": _fetch_karpathy,
    "the_batch": _fetch_deeplearning_batch,
    "langgraph": _fetch_langgraph_docs,
    "paperswithcode": _fetch_paperswithcode,
    "therobotreport": _fetch_therobotreport,
    "aclu_ai": _fetch_aclu_ai,
    "ai_breakfast": _fetch_ai_breakfast,
    "ai_news_site": _fetch_ai_news_site,
    "ai_native_dev": _fetch_ai_native_dev,
}


def _rss_fetch_chain(key: str, source: dict) -> dict | None:
    """Attempt RSS through an ordered candidate list.

    Candidates: the configured feed URL → a cached auto-discovery hit → a fresh
    auto-discovery probe. A hard-coded feed URL that is dead or serves HTML
    should not permanently shadow a working feed that discovery can find, so
    when the configured URL fails permanently the chain keeps going.

    Returns an "OK" result with items, the last failure result, or None when
    there was no RSS URL worth trying (breakers: nothing configured/cached).
    """
    source_url = source.get("url", "")
    h = _FEED_HEALTH.get(key)
    on_cooldown = bool(h and h.get("fails", 0) >= CIRCUIT_FAIL_THRESHOLD
                       and time.time() < h.get("next_retry", 0))

    configured = source.get("rss") or ""
    urls: list[str] = []
    if configured:
        urls.append(configured)
    cached = _cached_url(key)
    if cached and cached != configured:
        urls.append(cached)
    if not on_cooldown:
        # Live discovery bypasses the circuit breaker: it probes *different*
        # URLs than the one that keeps failing, so a dead hard-coded feed no
        # longer traps the whole source in an hour-long cooldown.
        discovered = _discover_rss_for(key, source_url)
        if discovered and discovered not in urls:
            urls.append(discovered)
    if not urls:
        return None

    last = None
    for idx, rss_url in enumerate(urls):
        result = _do_fetch(key, source, rss_url)
        status = result.get("status", "")
        if status == "OK" and result.get("items"):
            if idx > 0:
                _RSS_DISCOVERY_CACHE[key] = (rss_url, time.time(), True)
            result["feedType"] = "rss"
            return result
        last = result
        if idx > 0:
            # A discovered/cached alternative that stops working shouldn't be
            # reused forever — record it as a negative hit so discovery won't
            # re-probe (and re-cache) the same broken URL for 6h.
            _RSS_DISCOVERY_CACHE[key] = ("", time.time(), False)
        if status not in ("DEAD", "NOT_XML", "NO_FEED", "REDIRECT"):
            # Temporary failure (timeout / rate-limit / cooldown) — report it
            # as-is; no point churning the remaining candidates right now.
            return result
    return last


def _fetch_single_source(key: str, source: dict) -> dict:
    """Fetch articles from a source using multi-strategy fallback chain.

    Strategy order:
      1. Custom fetcher (if registered in CUSTOM_FETCHERS)
      2. RSS feed (configured → auto-discovered) – circuit-breaker only blocks this
      3. Sitemap.xml parsing
      4. HTML scraping (stdlib html.parser)

    Circuit breaker only blocks the RSS strategy. Sitemap and scraping are
    always attempted as fallbacks, since they use the source's website directly
    rather than a potentially broken RSS feed URL.
    """
    source_url = source.get("url", "")

    # Check for custom fetcher first (bypasses circuit breaker).
    if key in CUSTOM_FETCHERS:
        return CUSTOM_FETCHERS[key](key, source)

    # Strategy 1: RSS — configured feed first, then auto-discovered
    # alternatives. A dead hard-coded feed URL shouldn't prevent discovery
    # from finding the real feed URL.
    rss_on_cooldown = bool(
        (h := _FEED_HEALTH.get(key))
        and h.get("fails", 0) >= CIRCUIT_FAIL_THRESHOLD
        and time.time() < h.get("next_retry", 0)
    )
    rss_result = _rss_fetch_chain(key, source)
    if rss_result is not None:
        error_status = rss_result.get("status", "")
        if error_status == "OK" and rss_result.get("items"):
            return rss_result
        if error_status not in ("DEAD", "NOT_XML", "NO_FEED", "REDIRECT"):
            # Temporary error (timeout, rate-limit, cooldown, etc.) — return it
            return rss_result
        # Permanent error: fall through to sitemap/scraping

    # Strategy 2: Sitemap.xml (always attempted, no circuit breaker)
    sitemap_items = try_sitemap(source_url)
    if sitemap_items:
        for item in sitemap_items:
            item["source"] = key
            item["source_key"] = key
            item["source_name"] = source["name"]
        _record_success(key)
        return {"key": key, "name": source["name"], "items": sitemap_items,
                "url": source_url, "error": None, "status": "OK", "feedType": "sitemap"}

    # Strategy 3: HTML scraping (always attempted, no circuit breaker)
    scraped_items = fetch_via_scraping(key, source_url)
    if scraped_items:
        for item in scraped_items:
            item["source"] = key
            item["source_key"] = key
            item["source_name"] = source["name"]
        _record_success(key)
        _enrich_item_images(scraped_items)
        return {"key": key, "name": source["name"], "items": scraped_items,
                "url": source_url, "error": None, "status": "OK", "feedType": "scraped"}

    # All strategies failed
    if rss_on_cooldown:
        return {"key": key, "name": source["name"], "items": [],
                "error": "temporarily disabled (repeated RSS failures)",
                "url": source_url, "status": "COOLING", "feedType": "none"}
    return {"key": key, "name": source["name"], "items": [],
            "error": "No feed or content available",
            "url": source_url, "status": "NO_FEED", "feedType": "none"}


def _do_fetch(key: str, source: dict, rss_url: str) -> dict:
    """Lower-level fetch: open rss_url, classify success/failure, attach status.

    Tries alternate User-Agents when a feed is rate-limited or blocked (Reddit
    only serves its `.rss` to feed crawlers), decompresses gzip bodies, strips
    a UTF-8 BOM, and validates the XML/JSON shape before parsing. Gates the
    Reddit JSON branch on the source key (so unrelated `.json` URLs don't
    matter) and uses the module-level `_fail` helper to avoid the inner-function
    indenting anti-pattern.
    """
    import gzip
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE

    body = ""
    last_status = 0
    last_reason = ""
    for ua in _FETCH_USER_AGENTS:
        try:
            req = Request(rss_url, headers={
                "User-Agent": ua,
                "Accept": "application/rss+xml, application/xml, text/xml, application/atom+xml, application/json, */*",
                "Accept-Language": "en-US,en;q=0.9",
                "Accept-Encoding": "gzip",
            })
            with urlopen(req, timeout=8, context=ctx) as resp:
                raw = resp.read()
                if (resp.headers.get("Content-Encoding") or "").lower() == "gzip":
                    try:
                        raw = gzip.decompress(raw)
                    except Exception:
                        pass
                body = raw.decode("utf-8", errors="replace")
            break
        except urllib.error.HTTPError as he:
            last_status = he.code
            last_reason = he.reason
            if he.code in (429, 403, 500, 502, 503, 504):
                continue  # try alternate UA
            cls, reason = _classify_exception(he)
            return _fail(key, source, cls, reason)
        except (urllib.error.URLError, socket.timeout, socket.gaierror,
                ConnectionError, TimeoutError, OSError) as e:
            cls, reason = _classify_exception(e)
            return _fail(key, source, cls, reason)
        except (ET.ParseError, json.JSONDecodeError) as e:
            return _fail(key, source, "NOT_XML", type(e).__name__)
        except Exception as e:
            cls, reason = _classify_exception(e)
            return _fail(key, source, cls, reason, is_programmer=(cls == "PROGRAMMER"))
    if not body:
        cls = _classify_fetch_error(last_status or -1, "")
        return _fail(key, source, cls, last_reason or f"HTTP {last_status or 'no response'}")

    stripped = body.lstrip("\ufeff").lstrip()
    sh = stripped[:160].lower()
    looks_xml = (
        sh.startswith("<?xml") or sh.startswith("<rss") or sh.startswith("<feed")
        or sh.startswith("<rdf")
        or (stripped.startswith("<") and ("<rss" in sh or "<feed" in sh or "<rdf" in sh))
    )
    looks_json = stripped.startswith("{") or stripped.startswith("[")
    if not (looks_xml or looks_json):
        # Feed URL answered 200 but the payload is an HTML page (some catalog
        # entries point at landing pages rather than feeds). Classify so the
        # caller moves on to the next RSS candidate or the sitemap/scrape
        # fallback instead of surfacing a 404 to the user.
        return _fail(key, source, "NOT_XML", "body is not XML/JSON")
    content = stripped

    is_reddit = key.startswith("reddit_")
    if is_reddit and content.lstrip().startswith("{"):
        data = json.loads(content)
        items = []
        for child in data.get("data", {}).get("children", [])[:10]:
            post = child.get("data", {})
            title = post.get("title", "")
            url = post.get("url", "")
            permalink = f"https://reddit.com{post.get('permalink', '')}"
            created = post.get("created_utc", 0)
            selftext = post.get("selftext", "")[:200]
            if title:
                items.append({
                    "title": title,
                    "url": url if url.startswith("http") else permalink,
                    "date": time.strftime("%Y-%m-%d %H:%M:%S", time.gmtime(created)) if created else "",
                    "snippet": selftext,
                    "source": key,
                    "source_key": key,
                    "source_name": source["name"],
                })
        _record_success(key)
        _enrich_item_images(items)
        return {"key": key, "name": source["name"], "items": items,
                "url": source["url"], "error": None, "status": "OK"}
    items = _parse_rss_xml(content, key)
    for it in items:
        it["source_key"] = key
        it["source_name"] = source["name"]
    _record_success(key)
    _enrich_item_images(items)
    return {"key": key, "name": source["name"], "items": items,
            "url": source["url"], "error": None, "status": "OK"}
_TOPIC_NEWS_CACHE: dict = {}


@app.get("/api/news/topic")
def topic_news(q: str = "", days: int = 30, limit: int = 8, hl: str = "en-US", gl: str = "US", fresh: int = 0):
    """Latest headlines for any topic (Google News RSS search), cached 20 min.

    Powers the per-page "Latest" strip so every section shows current news
    for its own subject without hand-maintained lists.
    """
    q = (q or "").strip()[:120]
    if not q:
        return {"items": [], "error": "missing q"}
    days = max(1, min(int(days), 90))
    limit = max(1, min(int(limit), 20))
    key = (q.lower(), days, limit, hl, gl)
    hit = _TOPIC_NEWS_CACHE.get(key)
    if hit and not fresh and time.time() - hit[0] < 1200:
        return hit[1]
    from urllib.parse import quote as _q
    url = (f"https://news.google.com/rss/search?q={_q(q + f' when:{days}d')}"
           f"&hl={_q(hl)}&gl={_q(gl)}&ceid={_q(gl)}:{_q(hl.split('-')[0])}")
    items = []
    try:
        req = Request(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126 Safari/537.36"})
        root = ET.fromstring(urlopen(req, timeout=12).read())
        for it in root.iter("item"):
            title = (it.findtext("title") or "").strip()
            source = (it.findtext("source") or "").strip()
            if source and title.endswith(f" - {source}"):
                title = title[: -len(source) - 3]
            items.append({"title": title, "url": (it.findtext("link") or "").strip(),
                          "source": source, "date": (it.findtext("pubDate") or "").strip()})
            if len(items) >= limit:
                break
    except Exception as e:  # network / parse problems -> empty list, not a 500
        return {"items": [], "error": str(e)[:120], "query": q}
    payload = {"items": items, "query": q, "fetched_at": time.strftime("%Y-%m-%d %H:%M:%S UTC", time.gmtime())}
    _TOPIC_NEWS_CACHE[key] = (time.time(), payload)
    return payload


@app.get("/api/news/sources")
def list_news_sources(country: str = "", category: str = ""):
    """Return AI news sources with optional country/category filtering.

    All sources are included — sources without RSS are fetched via our
    multi-strategy fallback chain (sitemap.xml → HTML scraping).
    Each source includes `feedType` ("rss" or "scraped") and `isFetchable`
    (always True) fields for the frontend.
    """
    sources = []
    countries = set()
    categories = set()
    for key, src in AI_NEWS_SOURCES.items():
        src_country = src.get("country", "Global")
        src_category = src.get("category", "Other")
        countries.add(src_country)
        categories.add(src_category)

        # Apply country/category filters
        if country and src_country != country and country != "All":
            continue
        if category and src_category != category and category != "All":
            continue

        has_rss = bool(src.get("rss")) or bool(_RSS_DISCOVERY_CACHE.get(key, (None,))[0])
        # All sources are now fetchable via our multi-strategy fallback chain
        sources.append({
            "key": key,
            "name": src["name"],
            "url": src["url"],
            "rss": src.get("rss"),
            "category": src_category,
            "country": src_country,
            "hasRss": has_rss,
            "isFetchable": True,
            "feedType": "rss" if has_rss else "scraped",
        })
    return {
        "sources": sources,
        "total": len(sources),
        "countries": sorted(countries),
        "categories": sorted(categories),
    }


from urllib.parse import urljoin as _urljoin, urlparse as _urlparse
@app.get("/api/news/health")
def news_feed_health(only_problems: bool = False):
    """Per-source feed health view used by the dashboard diagnostics panel.

    Reports live circuit-breaker state, the resolved RSS URL (auto-discovered
    or hard-coded), and the cached failure counter. Useful for the UI to grey
    out chronically-broken sources without spamming error toast on every
    fetch.
    """
    snapshot = []
    now = time.time()
    for key, src in AI_NEWS_SOURCES.items():
        h = _FEED_HEALTH.get(key, {})
        configured = src.get("rss", "")
        cached_feed = _cached_url(key)
        resolved = configured or cached_feed or ""
        discovered = bool(cached_feed) and (not configured)
        cooldown_until = float(h.get("next_retry", 0.0))
        snapshot.append({
            "key": key,
            "name": src.get("name", key),
            "country": src.get("country", "Global"),
            "category": src.get("category", "Other"),
            "has_configured_rss": bool(configured),
            "resolved_rss": resolved,
            "rss_was_discovered": discovered,
            "fail_streak": int(h.get("fails", 0)),
            "last_error": h.get("last_err", ""),
            "cooling_down_until": cooldown_until if cooldown_until > now else 0.0,
        })
    healthy = sum(1 for s in snapshot if s["fail_streak"] == 0 and s["resolved_rss"])
    dead = sum(1 for s in snapshot if not s["resolved_rss"])
    tripped = sum(1 for s in snapshot if s["cooling_down_until"] > now)
    if only_problems:
        snapshot = [s for s in snapshot if s["fail_streak"] or s["cooling_down_until"] or not s["resolved_rss"]]
    return {
        "total": len(snapshot),
        "healthy": healthy,
        "temporarily_disabled": tripped,
        "no_feed": dead,
        "sources": snapshot,
    }


@app.get("/api/news/fetch")
def fetch_news(sources: str = "", limit: int = 10, country: str = "", category: str = ""):
    """Fetch latest news from selected AI sources.

    Query params:
        sources: comma-separated source keys (empty = all sources with a working RSS feed)
        limit: max items per source (default 10)
        country: filter by country name
        category: filter by category name

    When `sources` is empty, the auto-selection silently drops any catalog entry
    whose `rss` field is blank so we never dispatch a fetcher against a dead URL.
    When the caller explicitly lists keys, we honor the request even if a key
    has no RSS — they may want to demonstrate the error path.
    """
    if sources:
        keys = [k.strip() for k in sources.split(",") if k.strip()]
        selected = {k: AI_NEWS_SOURCES[k] for k in keys if k in AI_NEWS_SOURCES}
    else:
        # Auto-select ALL sources — the fallback chain handles RSS-less sources
        # via sitemap.xml parsing or HTML scraping.
        selected = dict(AI_NEWS_SOURCES)

    # Apply country/category filters if no explicit sources given
    if not sources and (country or category):
        filtered = {}
        for k, v in selected.items():
            if country and v.get("country", "Global") != country and country != "All":
                continue
            if category and v.get("category", "Other") != category and category != "All":
                continue
            filtered[k] = v
        selected = filtered

    if not selected:
        return {"error": "No valid sources selected", "results": []}

    # Cap per-request fan-out so the API responds predictably. With 16 workers
    # and 8s socket timeout per feed, 200 sources complete in ~100s worst-case.
    MAX_FETCH_SOURCES = 200
    requested_sources = len(selected)
    truncated = False
    if requested_sources > MAX_FETCH_SOURCES:
        selected = dict(list(selected.items())[:MAX_FETCH_SOURCES])
        truncated = True

    results = []
    try:
        with ThreadPoolExecutor(max_workers=16) as executor:
            future_map = {executor.submit(_fetch_single_source, k, v): k for k, v in selected.items()}
            for future in as_completed(future_map, timeout=300):
                try:
                    result = future.result()
                    result["items"] = result["items"][:limit]
                    results.append(result)
                except Exception as e:
                    key = future_map[future]
                    results.append({"key": key, "name": AI_NEWS_SOURCES[key]["name"], "items": [], "error": str(e)[:100], "url": AI_NEWS_SOURCES[key]["url"]})
    except TimeoutError:
        # If as_completed times out, return what we have so the UI can render
        # partial results instead of 500'ing the whole request.
        pass
    except Exception as e:
        # Catch-all: return an error response instead of 500
        return {"error": f"Fetch failed: {str(e)[:200]}", "results": results, "total_items": 0,
                "fetched_at": time.strftime("%Y-%m-%d %H:%M:%S UTC", time.gmtime())}

    # Sort by category then name
    results.sort(key=lambda x: (x.get("category", ""), x.get("name", "")))
    total_items = sum(len(r["items"]) for r in results)
    return {
        "results": results,
        "total_sources": len(results),
        "total_items": total_items,
        "fetched_at": time.strftime("%Y-%m-%d %H:%M:%S UTC", time.gmtime()),
        "truncated": truncated,
        "requested_sources": requested_sources,
        "fetched_sources": len(selected),
    }


@app.post("/api/scan-files")
def rescan_and_refresh():
    """Re-walk the scan paths AND attempt to regenerate the static frontend
    manifest file so a hard refresh picks up new files without restarting Vite.

    Body parameters (all optional):
        persist: bool  - whether to invoke the Node manifest script (default True)
    """
    body = {}
    try:
        # FastAPI doesn't auto-parse empty JSON bodies; reuse the helper.
        from fastapi import Request  # noqa: F401
    except Exception:
        pass

    fresh = scan_filesystem(force=True)
    refreshed_at = fresh["generatedAt"]

    # Invalidate the slug-to-root cache so the streaming endpoint picks up
    # freshly-added EXTRA_SCAN_PATHS subfolder entries without a restart.
    try:
        _slug_to_root_map._cache = None  # type: ignore[attr-defined]
    except Exception:
        pass

    persist_result = {"attempted": False, "ok": False}
    try:
        base = os.path.dirname(os.path.abspath(__file__))
        frontend_dir = os.path.normpath(os.path.join(base, "..", "frontend"))
        script = os.path.join(frontend_dir, "scripts", "generateManifest.js")
        if os.path.exists(script):
            persist_result["attempted"] = True
            try:
                proc = subprocess.run(
                    ["node", script],
                    cwd=frontend_dir,
                    capture_output=True,
                    text=True,
                    timeout=30,
                )
                persist_result["ok"] = proc.returncode == 0
                persist_result["stdout"] = (proc.stdout or "")[-500:]
                persist_result["stderr"] = (proc.stderr or "")[-500:]
            except FileNotFoundError:
                persist_result["error"] = "node executable not found on PATH"
            except subprocess.TimeoutExpired:
                persist_result["error"] = "manifest regeneration timed out"
        else:
            persist_result["error"] = f"script not found at {script}"
    except Exception as exc:  # pragma: no cover - defensive
        persist_result["error"] = str(exc)

    return JSONResponse(
        {
            "data": fresh,
            "persisted": persist_result,
            "fetchedAt": refreshed_at,
        }
    )


# --------------------------------------------------------------------------- #
# /api/generate-project — Generate project structure from a job description
# --------------------------------------------------------------------------- #
from project_generator import generate_project as _generate_project

@app.post("/api/generate-project")
def api_generate_project(body: dict):
    """
    Generate a complete project structure from a job description.

    Request body:
        title: str — Job title
        company: str — Company name
        techs: list[str] — Tech stack items
        desc: str — Full job description
        use_cases: str — Use cases / requirements

    Returns a dict with:
        job_title, company, domain, description, architecture (list),
        data_flows (list), design_patterns (list), files (list),
        mermaid_arch, mermaid_business, mermaid_deploy
    """
    try:
        title = body.get("title", "Untitled Project")
        company = body.get("company", "Unknown")
        techs = body.get("techs", [])
        desc = body.get("desc", "")
        use_cases = body.get("use_cases", "")

        if not isinstance(techs, list):
            techs = []
        if not isinstance(desc, str):
            desc = ""
        if not isinstance(use_cases, str):
            use_cases = ""

        project = _generate_project(title, company, techs, desc, use_cases)

        return {
            "job_title": project.job_title,
            "company": project.company,
            "domain": project.domain,
            "description": project.description,
            "architecture": [{
                "name": c.name,
                "description": c.description,
                "tech": c.tech,
                "layer": c.layer,
                "dependencies": c.dependencies,
            } for c in project.architecture],
            "data_flows": [{
                "from_component": f.from_component,
                "to_component": f.to_component,
                "protocol": f.protocol,
                "description": f.description,
            } for f in project.data_flows],
            "design_patterns": project.design_patterns,
            "files": [{
                "path": f.path,
                "content": f.content,
                "description": f.description,
            } for f in project.files],
            "mermaid_arch": project.mermaid_arch,
            "mermaid_business": project.mermaid_business,
            "mermaid_deploy": project.mermaid_deploy,
        }
    except Exception as e:
        import traceback
        return {"error": str(e), "traceback": traceback.format_exc()}


@app.get("/api/generate-project/example")
def api_generate_example_project():
    """Generate an example project for the Hyundai AutoEver job for testing."""
    return api_generate_project({
        "title": "10850 – Sr. Software Engineer, Applied AI",
        "company": "Hyundai AutoEver America",
        "techs": ["Python", "PyTorch", "TensorFlow", "LangGraph", "OpenAI API",
                   "Hugging Face", "LLMs", "RAG", "AutoGen", "LlamaIndex",
                   "CrewAI", "Pinecone", "ChromaDB", "FAISS", "FastAPI",
                   "React", "Docker", "Kubernetes", "AWS SageMaker",
                   "Azure OpenAI", "MCP", "MLOps", "Observability", "Guardrails"],
        "desc": "Sr. Software Engineer, Applied AI at Hyundai AutoEver America. Focus on LLM-powered applications, RAG systems, intelligent agents, full-stack AI workflows for automotive industry.",
        "use_cases": "LLM applications, RAG pipelines, agentic workflows, predictive models, generative AI tools",
    })


# --------------------------------------------------------------------------- #
# /api/github/search — Search GitHub for repos matching tech stack topics
# --------------------------------------------------------------------------- #
_GITHUB_CACHE: dict[str, dict] = {}
_GITHUB_CACHE_TTL = 5 * 60  # 5 min

@app.get("/api/github/search")
def search_github_repos(q: str = "", topics: str = "", sort: str = "stars", order: str = "desc", per_page: int = 30):
    """Search GitHub for repositories matching a query or topic list.

    Query params:
        q: free-text search query (e.g. "RAG framework")
        topics: comma-separated list of topic tags (e.g. "rag,agents,llm")
        sort: stars | updated | name (default stars)
        order: desc | asc (default desc)
        per_page: results per topic (default 30, max 100)

    If `q` is provided, does a single GitHub search with that query.
    If `topics` is provided (and no `q`), searches by topic tags and merges results.
    Returns deduplicated repos sorted by stars descending.
    """
    import urllib.request as _ur
    import urllib.error as _ue
    import json as _json
    import ssl as _ssl
    import time as _time
    import hashlib as _hashlib

    cache_key = _hashlib.md5(f"{q}|{topics}|{sort}|{order}|{per_page}".encode()).hexdigest()
    cached = _GITHUB_CACHE.get(cache_key)
    if cached and (_time.time() - cached["ts"]) < _GITHUB_CACHE_TTL:
        return cached["data"]

    ctx = _ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = _ssl.CERT_NONE

    headers = {
        "User-Agent": "AI-Knowledge-Hub/1.0",
        "Accept": "application/vnd.github.v3+json",
    }
    # If GITHUB_TOKEN is set, use it to get higher rate limits
    token = os.environ.get("GITHUB_TOKEN", "")
    if token:
        headers["Authorization"] = f"Bearer {token}"

    seen_urls: set[str] = set()
    all_items: list[dict] = []

    if q.strip():
        query = q.strip()
        topics_list = []
    elif topics.strip():
        topics_list = [t.strip() for t in topics.split(",") if t.strip()]
        query = " topic:" + " topic:".join(topics_list)
    else:
        return {"items": [], "total": 0, "query": q, "topics": topics}

    try:
        safe_q = _ur.parse.quote(query, safe=" :+")
        api_url = f"https://api.github.com/search/repositories?q={safe_q}&sort={sort}&order={order}&per_page={min(per_page, 100)}"
        req = _ur.Request(api_url, headers=headers)
        with _ur.urlopen(req, timeout=15, context=ctx) as resp:
            data = _json.loads(resp.read().decode("utf-8"))
        for repo in data.get("items", []):
            url = repo.get("html_url", "")
            if url and url not in seen_urls:
                seen_urls.add(url)
                lang = repo.get("language") or ""
                desc = (repo.get("description") or "")[:200]
                all_items.append({
                    "name": repo.get("full_name", ""),
                    "url": url,
                    "stars": repo.get("stargazers_count", 0),
                    "description": desc,
                    "language": lang,
                    "topics": repo.get("topics", []),
                    "updated_at": repo.get("updated_at", ""),
                    "license": repo.get("license", {}).get("spdx_id", "") if repo.get("license") else "",
                    "forks": repo.get("forks_count", 0),
                    "open_issues": repo.get("open_issues_count", 0),
                })
    except _ue.HTTPError as e:
        return {"error": f"GitHub API error: {e.code}", "items": [], "total": 0}
    except Exception as e:
        return {"error": str(e)[:200], "items": [], "total": 0}

    all_items.sort(key=lambda x: x["stars"], reverse=True)
    result = {"items": all_items, "total": len(all_items), "query": q, "topics": topics}
    _GITHUB_CACHE[cache_key] = {"data": result, "ts": _time.time()}
    return result


from projects_api import register_projects_api
from agents_api import register_agents_api
from brain_api import register_brain_api

register_projects_api(app)
register_agents_api(app)
register_brain_api(app)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=9000)
