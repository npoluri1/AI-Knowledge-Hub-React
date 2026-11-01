"""
catalog_api.py — generic catalog API for the mobile app.

Serves the web app's data files (exported to backend/data_catalog/*.json by
backend/scripts/export_catalogs.cjs) to the mobile app with search, category
filtering and pagination. One generic engine, every catalog:

    GET /api/catalog                  -> available catalogs (+ live counts)
    GET /api/catalog/{key}            -> full data (small catalogs only)
    GET /api/catalog/{key}/search     -> q, category, page, page_size
    GET /api/catalog/{key}/categories -> distinct category values / groups
    GET /api/catalog/{key}/item/{id}  -> single item by id/index

Big catalogs (books, github) are loaded lazily and paginated; small ones are
cached in memory on first request.
"""

from __future__ import annotations

import json
import os
import re
import threading
from typing import Any

from fastapi import APIRouter, Query

router = APIRouter(prefix="/api/catalog", tags=["catalog"])

_DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data_catalog")

# Catalogs too big to ship in one response — force pagination.
_PAGINATED = {"books", "github"}
_DEFAULT_PAGE_SIZE = 60
_MAX_PAGE_SIZE = 200

_lock = threading.Lock()
_cache: dict[str, dict[str, Any]] = {}          # key -> {meta, data}
_loaded = False


def _load_registry() -> None:
    global _loaded
    with _lock:
        if _loaded:
            return
        if os.path.isdir(_DATA_DIR):
            for name in os.listdir(_DATA_DIR):
                if not name.endswith(".meta.json"):
                    continue
                key = name[: -len(".meta.json")]
                try:
                    with open(os.path.join(_DATA_DIR, name), "r", encoding="utf-8") as fh:
                        meta = json.load(fh)
                    _cache[key] = {"meta": meta, "index": None}
                except Exception:
                    continue
        _loaded = True


def _get(key: str) -> dict[str, Any] | None:
    """Return {meta, index} for a catalog, lazily loading + indexing its JSON."""
    _load_registry()
    entry = _cache.get(key)
    if entry is None:
        return None
    if entry.get("index") is None:
        path = os.path.join(_DATA_DIR, f"{key}.json")
        if not os.path.isfile(path):
            return None
        with _lock:
            if entry.get("index") is None:
                with open(path, "r", encoding="utf-8") as fh:
                    payload = json.load(fh)
                entry["meta"] = payload.get("meta") or entry["meta"]
                entry["index"] = _build_index(payload.get("data"))
    return entry


def _build_index(data: Any) -> list[dict[str, Any]]:
    """Precompute id/title/subtitle/category/search-text per item ONCE.
    Searches then filter plain strings — 100x faster than per-request work
    on 20k-item catalogs like github/books."""
    items = _as_list(data)
    index: list[dict[str, Any]] = []
    for i, it in enumerate(items):
        title = _item_title(it)
        index.append(
            {
                "idx": i,
                "id": _item_id(it, i),
                "title": title,
                "subtitle": _item_subtitle(it) or _item_preview(it),
                "category": _item_category(it),
                "text": _norm(_item_text(it)),
                "item": it,
            }
        )
    return index


def _norm(v: Any) -> str:
    return str(v or "").strip().lower()


# ---------------------------------------------------------------------------
# Which field(s) of an item act as its "category" — discovered per catalog.
# ---------------------------------------------------------------------------
_CATEGORY_FIELDS = ("category", "cat", "group", "industry", "label", "type", "area")

def _item_category(item: Any) -> str:
    if isinstance(item, dict):
        for f in _CATEGORY_FIELDS:
            v = item.get(f)
            if isinstance(v, str) and v.strip():
                return v.strip()
            if isinstance(v, list) and v and isinstance(v[0], str):
                return str(v[0])
    return ""


def _as_list(data: Any) -> list[Any]:
    """Best-effort flattening of any catalog shape into a list of items."""
    if isinstance(data, list):
        return data
    if isinstance(data, dict):
        flat: list[Any] = []
        saw_array = False
        # dict-of-lists (e.g. tech_lessons: {python: [...], ml: [...]}) ->
        # annotate each item with its group and flatten. Scalar keys (id,
        # title, icon…) are metadata of the catalog itself, NOT items — skip
        # them whenever at least one real array exists.
        for group, val in data.items():
            if isinstance(val, list):
                saw_array = True
                for it in val:
                    if isinstance(it, dict) and not it.get("group"):
                        it = {**it, "group": group}
                    elif isinstance(it, str):
                        it = {"name": it, "group": group}
                    flat.append(it)
            elif isinstance(val, dict):
                # dict-of-dict — flatten one more level when values are lists
                # (use_cases: {python: {Web Dev: [{title,desc,code}]}}) or
                # strings (playbook/rapid_fire markdown docs).
                for sub, sv in val.items():
                    if isinstance(sv, list):
                        saw_array = True
                        for it in sv:
                            if isinstance(it, dict) and not it.get("group"):
                                it = {**it, "group": group, "subgroup": sub}
                            flat.append(it)
                    elif isinstance(sv, str):
                        flat.append({"path": sub, "group": group, "content": sv})
                    elif isinstance(sv, dict):
                        flat.append({"path": sub, "group": group, "content": json.dumps(sv)})
        if flat and (saw_array or len(flat) > 3):
            return flat
        # plain string-map (e.g. rapid_fire markdown) -> items of content
        return [{"path": k, "content": v} for k, v in data.items()]
    return []


def _item_text(item: Any) -> str:
    """Blob of searchable text for an item."""
    if isinstance(item, str):
        return item
    if isinstance(item, dict):
        parts = []
        for v in item.values():
            if isinstance(v, str):
                parts.append(v)
            elif isinstance(v, list):
                parts.extend(str(x) for x in v if isinstance(x, (str, int, float)))
        return " ".join(parts)
    return str(item)


def _item_title(item: Any) -> str:
    if isinstance(item, dict):
        for f in ("title", "name", "heading", "id", "path"):
            v = item.get(f)
            if isinstance(v, str) and v.strip():
                return v.strip()
            if isinstance(v, (int, float)):
                return str(v)
    return ""


def _item_subtitle(item: Any) -> str:
    if isinstance(item, dict):
        for f in ("subtitle", "desc", "description", "summary", "company", "focus", "preview"):
            v = item.get(f)
            if isinstance(v, str) and v.strip():
                return v.strip()[:300]
    return ""


_CONTENT_FIELDS = ("content", "markdown", "body", "text", "detail", "details", "example", "answer", "cheat", "description", "desc")

def _strip_md(s: str) -> str:
    """Light markdown strip for list previews."""
    s = re.sub(r"```[\s\S]*?```", " [code] ", s)
    s = re.sub(r"[*_#>`]", "", s)
    s = re.sub(r"\s+", " ", s)
    return s.strip()

def _item_preview(item: Any, limit: int = 240) -> str:
    """Human-readable preview extracted from the biggest string field."""
    if isinstance(item, dict):
        for f in _CONTENT_FIELDS:
            v = item.get(f)
            if isinstance(v, str) and len(v) > 40:
                return _string_preview(v, limit)
        # nested content dicts like code: {title, content}
        for v in item.values():
            if isinstance(v, dict) and isinstance(v.get("content"), str) and len(v["content"]) > 40:
                return _string_preview(v["content"], limit)
        # nested lists of lessons/steps: show their titles
        for v in item.values():
            if isinstance(v, list) and v and isinstance(v[0], dict):
                titles = [str(x.get("title") or x.get("name") or "") for x in v[:4]]
                titles = [t for t in titles if t]
                if titles:
                    more = f" +{len(v) - len(titles)} more" if len(v) > len(titles) else ""
                    return (" · ".join(titles) + more)[:limit]
    if isinstance(item, str) and len(item) > 40:
        return _string_preview(item, limit)
    return ""


def _string_preview(s: str, limit: int = 240) -> str:
    """Preview for a raw string — JSON blobs become 'Title — desc' lists."""
    t = s.strip()
    if t[:1] in ("{", "["):
        try:
            j = json.loads(t)
            bits: list[str] = []
            for it in (j if isinstance(j, list) else list(j.values()))[:2]:
                if isinstance(it, dict):
                    ti = it.get("title") or it.get("name") or ""
                    de = it.get("description") or it.get("desc") or ""
                    bits.append(f"{ti} — {de}".strip(" —"))
                elif isinstance(it, str):
                    bits.append(it)
            if bits:
                return _strip_md(" · ".join(bits))[:limit]
        except Exception:
            pass
    return _strip_md(t)[:limit]

def _item_id(item: Any, idx: int) -> str:
    if isinstance(item, dict):
        for f in ("id", "key", "slug", "path", "name", "title"):
            v = item.get(f)
            if isinstance(v, (str, int)) and str(v).strip():
                return str(v)
    return str(idx)


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

@router.get("")
def list_catalogs():
    _load_registry()
    out = []
    for key, entry in sorted(_cache.items()):
        meta = dict(entry["meta"])
        meta["paginated"] = key in _PAGINATED
        out.append(meta)
    return {"count": len(out), "catalogs": out}


@router.get("/{key}")
def get_catalog(key: str):
    entry = _get(key)
    if entry is None:
        return {"error": f"unknown catalog '{key}'"}
    index = entry["index"]
    if key in _PAGINATED:
        return {"error": "catalog too large — use /search with pagination", "total": len(index)}
    return {
        "key": key,
        **entry["meta"],
        "count": len(index),
        "data": [e["item"] for e in index],
    }


@router.get("/{key}/categories")
def catalog_categories(key: str):
    entry = _get(key)
    if entry is None:
        return {"error": f"unknown catalog '{key}'"}
    index = entry["index"]
    counts: dict[str, int] = {}
    for e in index:
        c = e["category"] or "Other"
        counts[c] = counts.get(c, 0) + 1
    cats = sorted(counts.items(), key=lambda kv: (-kv[1], kv[0]))
    return {"key": key, "count": len(cats), "categories": [{"name": n, "count": c} for n, c in cats]}


@router.get("/{key}/search")
def catalog_search(
    key: str,
    q: str = Query("", max_length=200),
    category: str = Query("", max_length=120),
    page: int = Query(1, ge=1),
    page_size: int = Query(_DEFAULT_PAGE_SIZE, ge=1, le=_MAX_PAGE_SIZE),
):
    entry = _get(key)
    if entry is None:
        return {"error": f"unknown catalog '{key}'"}
    index = entry["index"]

    needle = _norm(q)
    cat_filter = _norm(category)

    if needle:
        filtered = [e for e in index if needle in e["text"]]
    else:
        filtered = list(index)
    if cat_filter:
        alts = {cat_filter, cat_filter.replace("-", " ")}
        filtered = [e for e in filtered if (e["category"] or "").lower() in alts]

    total = len(filtered)
    start = (page - 1) * page_size
    page_items = filtered[start : start + page_size]

    results = []
    for e in page_items:
        results.append(
            {
                "idx": e["idx"],
                "id": e["id"],
                "title": e["title"] or "(untitled)",
                "subtitle": e["subtitle"],
                "category": e["category"],
                "item": e["item"],
            }
        )
    return {
        "key": key,
        "total": total,
        "page": page,
        "page_size": page_size,
        "pages": max(1, (total + page_size - 1) // page_size),
        "results": results,
    }


@router.get("/{key}/item/{item_id}")
def catalog_item(key: str, item_id: str):
    entry = _get(key)
    if entry is None:
        return {"error": f"unknown catalog '{key}'"}
    index = entry["index"]
    for e in index:
        if e["id"] == item_id:
            return {"key": key, "idx": e["idx"], "id": item_id, "item": e["item"]}
    # numeric fallback (index lookup)
    if item_id.isdigit() and int(item_id) < len(index):
        e = index[int(item_id)]
        return {"key": key, "idx": e["idx"], "id": e["id"], "item": e["item"]}
    return {"error": f"item '{item_id}' not found in '{key}'"}


# ---------------------------------------------------------------------------
# Edureka AI docs — markdown files shipped with the web app (public/edurekha_docs)
# ---------------------------------------------------------------------------
_EDUREKA_DIR = os.path.normpath(
    os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "frontend", "public", "edurekha_docs")
)


@router.get("/edureka_docs/list")
def edureka_docs_list():
    if not os.path.isdir(_EDUREKA_DIR):
        return {"count": 0, "docs": []}
    docs = []
    for name in sorted(os.listdir(_EDUREKA_DIR)):
        if not name.lower().endswith((".md", ".txt")):
            continue
        fp = os.path.join(_EDUREKA_DIR, name)
        try:
            size = os.path.getsize(fp)
            with open(fp, "r", encoding="utf-8", errors="replace") as fh:
                first = ""
                for line in fh:
                    line = line.strip()
                    if not line or line.startswith("<!--"):
                        continue
                    # skip ASCII-art banners & separators
                    if len(set(line.replace(" ", ""))) <= 4 and len(line) > 12:
                        continue
                    first = line.lstrip("# ")
                    break
            title = re.sub(r"[-_]", " ", name.rsplit(".", 1)[0]).title()
            docs.append(
                {
                    "id": name,
                    "title": title if not first else (first[:80] if len(first) > 12 else f"{title}: {first[:70]}"),
                    "size": size,
                    "kind": "md" if name.endswith(".md") else "txt",
                }
            )
        except Exception:
            continue
    return {"count": len(docs), "docs": docs}


@router.get("/edureka_docs/get")
def edureka_doc_get(name: str = Query("", max_length=200)):
    safe = os.path.basename(name or "")
    fp = os.path.join(_EDUREKA_DIR, safe)
    if not safe or not os.path.isfile(fp):
        return {"error": f"doc '{safe}' not found"}
    with open(fp, "r", encoding="utf-8", errors="replace") as fh:
        content = fh.read()
    return {"id": safe, "title": safe, "content": content}
