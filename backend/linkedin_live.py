# linkedin_live.py — live LinkedIn tech-stack posts via the Tavily search API.
# -----------------------------------------------------------------------------
# LinkedIn blocks anonymous feed access, so live posts are sourced with Tavily
# (search + extraction API) using targeted `site:linkedin.com/posts/` queries
# per tech-stack topic. Each result is a REAL LinkedIn post: URL, title, text
# excerpt, and images where available. Results are cached in-process for a few
# hours to respect rate limits (dev keys: ~1,000 searches/month).

import os
import re
import json
import time
import threading
from datetime import datetime, timezone

try:
    from tavily import TavilyClient
except ImportError:  # pragma: no cover
    TavilyClient = None

try:
    import requests
except ImportError:  # pragma: no cover
    requests = None

# Desktop UA — public LinkedIn post pages expose og:image + media.licdn URLs
# to anonymous desktop requests even behind the login overlay.
_UA = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"
)

_LICDN_RE = re.compile(r"https?://media\.licdn\.com/dms/[^\"'\s<>\\]+", re.IGNORECASE)
_DMS_ID_RE = re.compile(r"/(D[A-Za-z0-9_-]{8,})/")
_OG_IMAGE_RE = re.compile(r'<meta[^>]+property=["\']og:image["\'][^>]+content=["\']([^"\']+)["\']', re.IGNORECASE)
_OG_IMAGE_RE2 = re.compile(r'<meta[^>]+content=["\']([^"\']+)["\'][^>]+property=["\']og:image["\']', re.IGNORECASE)


def _is_real_post_image(url):
    """True for genuine post media — rejects LinkedIn UI sprites."""
    u = (url or "").lower()
    if not u.startswith("http"):
        return False
    if "static.licdn.com" in u or "/aero-v1/" in u or "/sc/h/" in u:
        return False  # logo / icon chrome
    return "media.licdn.com/dms/" in u or "licdn" not in u


def _is_signed(url):
    """licdn dms URLs 403 without their signed query (?e=...&t=...).
    og:image URLs are always signed; bare HTML matches usually are not."""
    return "e=" in (url or "")


def _image_dedupe_key(url):
    """Same photo in multiple resolutions shares its DMS media id."""
    match = _DMS_ID_RE.search(url or "")
    return match.group(1) if match else url

# url -> [exact image urls]; guards re-fetching on cache misses.
_image_direct_cache = {}
_image_direct_lock = threading.Lock()

# ── Topic catalog: mirrors the daily topic list (same 40 tech-stack areas) ──
LIVE_TOPICS = [
    {"key": "ai", "label": "AI", "query": "artificial intelligence engineering"},
    {"key": "ml", "label": "ML", "query": "machine learning engineering"},
    {"key": "agents", "label": "AI Agents", "query": "AI agents engineering"},
    {"key": "multi_agents", "label": "Multi-Agents", "query": "multi-agent systems LLM"},
    {"key": "python", "label": "Python", "query": "Python AI engineering"},
    {"key": "fastapi", "label": "FastAPI", "query": "FastAPI LLM services"},
    {"key": "reactjs", "label": "ReactJS", "query": "ReactJS AI streaming UI"},
    {"key": "nextjs", "label": "NextJS", "query": "Next.js AI products"},
    {"key": "rag", "label": "RAG", "query": "RAG retrieval augmented generation"},
    {"key": "mcp", "label": "MCP", "query": "Model Context Protocol MCP"},
    {"key": "langchain", "label": "LangChain", "query": "LangChain"},
    {"key": "langgraph", "label": "LangGraph", "query": "LangGraph agents"},
    {"key": "vectordb", "label": "VectorDB", "query": "vector database Qdrant Pinecone pgvector"},
    {"key": "workflows", "label": "AI Workflows", "query": "AI workflows orchestration"},
    {"key": "crewai", "label": "CrewAI", "query": "CrewAI agents"},
    {"key": "tool_calling", "label": "Tool/Function Calling", "query": "LLM function calling tools"},
    {"key": "memory", "label": "Memory Management", "query": "AI agent memory management"},
    {"key": "agent_gateway", "label": "Agent Gateway", "query": "LLM gateway LiteLLM routing"},
    {"key": "agent_loops", "label": "Agent Loops", "query": "ReAct agent loop"},
    {"key": "ai_graphs", "label": "AI Graphs", "query": "LangGraph state machines AI graphs"},
    {"key": "spring_ai", "label": "Spring AI", "query": "Spring AI Java LLM"},
    {"key": "evaluations", "label": "Evaluations", "query": "LLM evaluations RAGAS"},
    {"key": "observability", "label": "Observability", "query": "LLM observability Langfuse tracing"},
    {"key": "awareness", "label": "Agent Awareness", "query": "AI agent state awareness context"},
    {"key": "guardrails", "label": "GuardRails", "query": "AI guardrails prompt injection"},
    {"key": "react", "label": "REAct Patterns", "query": "ReAct reasoning acting LLM pattern"},
    {"key": "design_patterns", "label": "AI Design Patterns", "query": "AI system design patterns production"},
    {"key": "autogen", "label": "AutoGen", "query": "AutoGen Microsoft multi-agent"},
    {"key": "lora", "label": "LORA/QLORA", "query": "LoRA QLoRA fine-tuning"},
    {"key": "mlops", "label": "MLOps", "query": "MLOps LLMOps lifecycle"},
    {"key": "embeddings", "label": "Embeddings", "query": "embeddings semantic search"},
    {"key": "llamaindex", "label": "LlamaIndex", "query": "LlamaIndex data framework"},
    {"key": "llms", "label": "LLMs", "query": "LLM models GPT Claude Gemini"},
    {"key": "prompting", "label": "Prompting", "query": "prompt engineering techniques"},
    {"key": "fine_tuning", "label": "Fine-Tuning", "query": "LLM fine-tuning"},
    {"key": "governance", "label": "Governance", "query": "AI governance compliance"},
    {"key": "looping", "label": "Looping", "query": "AI agent loop control iteration"},
    {"key": "graphics", "label": "Graphics Engineering", "query": "neural rendering DLSS graphics AI"},
    {"key": "quantum", "label": "Quantum Computing", "query": "quantum computing machine learning"},
    {"key": "semiconductor", "label": "Semiconductor & Chips", "query": "AI chips semiconductor NVIDIA"},
    {"key": "iot", "label": "IoT", "query": "edge AI IoT TinyML"},
    {"key": "agi", "label": "AGI", "query": "AGI artificial general intelligence"},
    {"key": "asi", "label": "ASI", "query": "artificial superintelligence ASI"},
    {"key": "super_ai", "label": "Super AI", "query": "superintelligence AI frontier"},
]

TOPIC_BY_KEY = {t["key"]: t for t in LIVE_TOPICS}

_TOPIC_CACHE_FILE = os.path.join(
    os.path.dirname(os.path.abspath(__file__)), "..", "exports", "linkedin_live_cache.json"
)

_cache = {}          # topic_key -> {"fetched_at": epoch, "posts": [...]}
_cache_lock = threading.Lock()
_cache_loaded = False
TTL_SECONDS = 6 * 3600  # 6 hours

_POST_URL_RE = re.compile(r"https?://(?:[a-z]{2,5}\.)?linkedin\.com/posts/[^\s\"'<>]+", re.IGNORECASE)
_IMG_URL_RE = re.compile(r"https?://[^\s\"'<>\\]+?\.(?:jpe?g|png|webp|gif)(?:\?[^\s\"'<>]*)?", re.IGNORECASE)

# LinkedIn page chrome to strip out of extracted raw content.
_BOILERPLATE_MARKERS = (
    "Report this post", "Sign in", "Join now", "Skip to main content",
    "LinkedIn and 3rd parties use", "Accept all", "Reject all",
    "Manage preferences", "View verification", "Members who liked",
    "Was this autopilot", "relevant posts", "Commercial content",
    "LinkedIn respects your privacy", "Agree & Join", "Accept to consent",
    "You can update your choices", "cookie", "Cookie",
    "View profile for", "already have an account",
    "This title was summarized by AI",
)

# Line patterns that are page nav/boilerplate, not post body.
_BOILERPLATE_LINE_RES = (
    re.compile(r"^!\[.*\]\(.*\)$"),                 # markdown images
    re.compile(r"^#{1,3} "),                        # markdown headings from page title
    re.compile(r"^[-*•] \[?"),                      # markdown/bullet nav lists
    re.compile(r"^=+$/"),                           # ====== underline headers
    re.compile(r"^\d+\. \[?"),                      # numbered nav lists
    re.compile(r"^(Home|Articles|About|Posts|Feed|Jobs|Learning|Sign in|Join now)$", re.IGNORECASE),
    re.compile(r"^\[.*\]\(http"),                   # markdown links at line start
    re.compile(r"^\|"),                             # table chrome
)

# Titles on LinkedIn come as "<Author> on LinkedIn: "<snippet>"" — capture the author.
_AUTHOR_TITLE_RE = re.compile(r"^(.{2,60}?)\s+on LinkedIn", re.IGNORECASE)

# Post URLs look like /posts/<handle>_<post-slug>-activity-<id>-<hash> — the
# handle before the first underscore identifies the author.
_AUTHOR_URL_RE = re.compile(r"/posts/([A-Za-z0-9\-]+?)_", re.IGNORECASE)


def _client():
    key = os.environ.get("TAVILY_API_KEY", "").strip()
    if not key or TavilyClient is None:
        return None
    try:
        return TavilyClient(api_key=key)
    except Exception:
        return None


def _load_cache():
    global _cache_loaded
    if _cache_loaded:
        return
    _cache_loaded = True
    try:
        with open(_TOPIC_CACHE_FILE, "r", encoding="utf-8") as fh:
            data = json.load(fh)
        if isinstance(data, dict):
            _cache.update(data)
    except Exception:
        pass


def _save_cache():
    try:
        os.makedirs(os.path.dirname(_TOPIC_CACHE_FILE), exist_ok=True)
        with open(_TOPIC_CACHE_FILE, "w", encoding="utf-8") as fh:
            json.dump(_cache, fh)
    except Exception:
        pass


def _clean_excerpt(text, limit=480):
    if not text:
        return ""
    text = re.sub(r"\s+", " ", str(text)).strip()
    if len(text) <= limit:
        return text
    return text[: limit - 1].rsplit(" ", 1)[0] + "…"


def _clean_full_text(text, limit=6000, headline_out=None):
    """Best-effort cleanup of extracted LinkedIn raw content: drop page chrome,
    nav lists, cookie banners, and collapse whitespace — keep the post body.
    When a "title summarized by AI" preamble is found, the author headline that
    follows it is captured into headline_out instead of the body."""
    if not text:
        return ""
    lines = []
    skip_next_as_headline = False
    for raw_line in str(text).splitlines():
        line = raw_line.strip()
        if not line:
            continue
        if any(marker.lower() in line.lower() for marker in _BOILERPLATE_MARKERS):
            # The line right after LinkedIn's AI-title preamble is the author
            # headline (job title) — capture it, don't show it in the body.
            if "summarized by AI" in line.lower():
                skip_next_as_headline = True
            continue
        if skip_next_as_headline and headline_out is not None and headline_out[0] == "" and len(line) <= 140 and not line.endswith((".", "!", "?")):
            headline_out[0] = line
            skip_next_as_headline = False
            continue
        skip_next_as_headline = False
        if any(rx.search(line) for rx in _BOILERPLATE_LINE_RES):
            continue
        if line.lower().startswith(("http://", "https://", "www.", "linkedin.com")):
            continue  # bare link lines from page footer/nav
        lines.append(line)
    cleaned = "\n".join(lines)
    cleaned = re.sub(r"\n{3,}", "\n\n", cleaned).strip()
    if len(cleaned) > limit:
        cleaned = cleaned[: limit - 1].rsplit("\n", 1)[0] + "\n…"
    return cleaned


def _author_from_url(url):
    match = _AUTHOR_URL_RE.search(url or "")
    if not match:
        return ""
    handle = match.group(1).replace("-", " ").strip()
    return handle.title() if handle else ""


def _extract_images(result):
    images = []
    seen = set()
    for img in result.get("images") or []:
        url = img if isinstance(img, str) else (img.get("url") or "")
        if _is_real_post_image(url):
            key = _image_dedupe_key(url)
            if key not in seen:
                seen.add(key)
                images.append(url)
    return images[:6]


def _merge_extracted_images(post, extra_images, raw_content):
    """Collect every image: Tavily search/extract image fields plus any image
    URLs found inside the extracted post content."""
    candidates = list(extra_images or [])
    for url in _IMG_URL_RE.findall(raw_content or ""):
        candidates.append(url)
    seen = {_image_dedupe_key(u) for u in post["images"]}
    for url in candidates:
        if not _is_real_post_image(url) or len(post["images"]) >= 6:
            continue
        key = _image_dedupe_key(url)
        if key in seen:
            continue
        seen.add(key)
        post["images"].append(url)


def _parse_author(result, content):
    for source in (result.get("title") or "", content[:120]):
        match = _AUTHOR_TITLE_RE.search(source)
        if match:
            return match.group(1).strip(" -–—|·")
    return ""


def _fetch_post_images_direct(url):
    """Fetch the public LinkedIn post page and pull the EXACT images attached
    to that post (og:image + media.licdn.com dms URLs)."""
    if requests is None or not url:
        return []
    with _image_direct_lock:
        cached = _image_direct_cache.get(url)
    if cached is not None:
        return cached
    images = []
    try:
        resp = requests.get(
            url,
            headers={
                "User-Agent": _UA,
                "Accept": "text/html,application/xhtml+xml",
                "Accept-Language": "en-US,en;q=0.9",
            },
            timeout=6,
            allow_redirects=True,
        )
        html = resp.text if resp.ok else ""
        seen = set()

        def _add(u):
            u = u.replace("&amp;", "&").strip()
            if not _is_real_post_image(u) or len(images) >= 6:
                return
            if "media.licdn.com" in u and not _is_signed(u):
                return  # unsigned dms URLs 403 — only keep signed variants
            key = _image_dedupe_key(u)
            if key in seen:
                return
            seen.add(key)
            images.append(u)

        match = _OG_IMAGE_RE.search(html) or _OG_IMAGE_RE2.search(html)
        if match:
            _add(match.group(1))
        for match in _LICDN_RE.finditer(html):
            _add(match.group(0))
    except Exception:  # noqa: BLE001 — image enrichment is best-effort
        pass
    with _image_direct_lock:
        _image_direct_cache[url] = images
    return images


def _enrich_with_extract(client, posts):
    """Use the Tavily extract API to replace search excerpts with the FULL exact
    post content and collect every image embedded in the post page."""
    urls = [p["url"] for p in posts if p.get("url")][:8]
    if not urls:
        return posts
    try:
        response = client.extract(urls=urls, extract_depth="basic")
    except Exception:  # noqa: BLE001 — extract is best-effort; keep search excerpts
        return posts
    by_url = {}
    for item in response.get("results") or []:
        raw = item.get("raw_content") or ""
        if raw:
            by_url[(item.get("url") or "").rstrip("/")] = {
                "raw": raw,
                "images": [im if isinstance(im, str) else (im.get("url") or "") for im in item.get("images") or []],
            }
    for post in posts:
        item = by_url.get((post["url"] or "").rstrip("/"))
        if not item:
            # Tavily may normalize the URL; try suffix matching.
            for u, r in by_url.items():
                if u and post["url"] and (u in post["url"] or post["url"] in u):
                    item = r
                    break
        if not item:
            continue
        raw, extra_images = item["raw"], item.get("images") or []
        headline = [""]
        full = _clean_full_text(raw, headline_out=headline)
        if headline[0]:
            post["authorHeadline"] = headline[0]
        if len(full) > len(post["content"]) + 40:
            post["content"] = full
            post["fullContent"] = True
        _merge_extracted_images(post, extra_images, raw)
        if not post.get("author"):
            post["author"] = _parse_author({"title": ""}, full)

    # Posts still without images: pull the exact attached media straight from
    # the public post page (og:image / media.licdn.com). Capped at 4 pages to
    # keep worst-case latency bounded (each page fetch can take up to ~6s).
    enriched = 0
    for post in posts:
        if enriched >= 4:
            break
        if not post["images"] and post.get("url"):
            post["images"] = _fetch_post_images_direct(post["url"])[:6]
            enriched += 1
    return posts


_ACTIVITY_ID_RE = re.compile(r"\b(7\d{15,19})\b")


def _date_from_activity_id(url):
    """Decode the publish date straight from a LinkedIn post URL.
    LinkedIn activity IDs are Snowflake-like: the top 41 bits of the numeric
    ID are the publish time in epoch milliseconds. This recovers the real
    date even when the search engine returns no published_date."""
    m = _ACTIVITY_ID_RE.search(url or "")
    if not m:
        return ""
    try:
        bits = bin(int(m.group(1)))[2:]
        if len(bits) < 41:
            return ""
        ms = int(bits[:41], 2)
        year = datetime.fromtimestamp(ms / 1000, tz=timezone.utc).year
        if not (2010 <= year <= 2035):  # sanity guard against wrong matches
            return ""
        return datetime.fromtimestamp(ms / 1000, tz=timezone.utc).strftime("%Y-%m-%d")
    except (ValueError, OverflowError, OSError):
        return ""


def _post_from_result(result, topic, idx):
    url = result.get("url") or ""
    # Prefer the true /posts/ URL when the landing page differs.
    match = _POST_URL_RE.search(url)
    canonical = match.group(0) if match else url
    title = _clean_excerpt(result.get("title") or "", 140) or f"{topic['label']} — LinkedIn post"
    content = _clean_excerpt(result.get("content") or result.get("raw_content") or "", 700)
    author = _author_from_url(canonical) or _parse_author(result, content)
    published = (result.get("published_date") or "")[:10]
    if not published:
        published = _date_from_activity_id(canonical) or _date_from_activity_id(url)
    return {
        "id": f"live-{topic['key']}-{idx}",
        "category": "live",
        "topic": topic["key"],
        "topicLabel": topic["label"],
        "title": title,
        "content": content,
        "url": canonical,
        "images": _extract_images(result),
        "avatar": "",
        "author": author,
        "fullContent": False,
        "score": result.get("score"),
        "published": published,
        "source": "linkedin",
    }


TIME_RANGES = {"latest": "week", "week": "week", "month": "month", "any": None}


def _search_topic(client, topic, max_results, time_range=None, light=False):
    """One Tavily search for one topic; tries posts-restricted first.
    light=True skips content-extract enrichment (fast whole-catalog mode)."""
    query = f'site:linkedin.com/posts/ {topic["query"]}'
    kwargs = dict(
        query=query,
        search_depth="basic" if light else "advanced",
        max_results=max_results,
        include_images=True,
        include_answer=False,
    )
    tr = TIME_RANGES.get(time_range or "", None)
    if tr:
        kwargs["time_range"] = tr  # bias results to recent posts
    try:
        response = client.search(**kwargs)
    except TypeError:
        kwargs.pop("time_range", None)  # older tavily client without time_range
        response = client.search(**kwargs)
    except Exception as exc:  # noqa: BLE001
        raise RuntimeError(f"Tavily search failed for {topic['label']}: {exc}") from exc
    posts = []
    for idx, result in enumerate(response.get("results") or []):
        post = _post_from_result(result, topic, idx)
        if post["url"]:
            posts.append(post)
    # Enrich: full exact content + all embedded images per post (best effort).
    if not light:
        posts = _enrich_with_extract(client, posts)
    return posts


def fetch_live_posts(topic=None, max_results=6, refresh=False, time_range="month", date=None):
    """Return live LinkedIn posts for one topic (or a mixed set when None)."""
    _load_cache()
    client = _client()
    now = time.time()

    fresh_budget = max_results  # default: one fresh search per requested slot
    light = False
    if topic and topic in TOPIC_BY_KEY:
        topics = [TOPIC_BY_KEY[topic]]
    elif topic == "__all__":
        # Whole catalog: serve cached topics instantly; spend a SMALL fresh
        # budget on uncached topics in light mode (no per-post extract/image
        # enrichment) so one request can't hang. Press again for next batch.
        topics = LIVE_TOPICS
        fresh_budget = 3
        light = True
    else:  # mixed grab-bag: rotate deterministically over the catalog
        day_bucket = int(now // TTL_SECONDS)
        start = day_bucket % len(LIVE_TOPICS)
        topics = [LIVE_TOPICS[(start + i) % len(LIVE_TOPICS)] for i in range(4)]

    if client is None:
        missing = [] if os.environ.get("TAVILY_API_KEY") else ["TAVILY_API_KEY is not configured"]
        if TavilyClient is None:
            missing.append("tavily-python is not installed (pip install tavily-python)")
        raise RuntimeError(
            "Live fetch unavailable: " + ("; ".join(missing) or "Tavily client could not start")
        )

    max_results = max(3, min(int(max_results or 6), 10))
    all_posts = []
    errors = []
    skipped = 0
    for t in topics:
        cached = _cache.get(t["key"])
        if (
            not refresh
            and cached
            and now - cached.get("fetched_at", 0) < TTL_SECONDS
            and cached.get("posts")
        ):
            all_posts.extend(cached["posts"][:max_results])
            continue
        if fresh_budget <= 0:
            skipped += 1
            if cached and cached.get("posts"):
                all_posts.extend(cached["posts"][:max_results])
            continue
        fresh_budget -= 1
        try:
            posts = _search_topic(client, t, max_results, time_range=time_range, light=light)
        except Exception as exc:  # noqa: BLE001
            errors.append(str(exc))
            if cached and cached.get("posts"):
                all_posts.extend(cached["posts"][:max_results])
            continue
        with _cache_lock:
            _cache[t["key"]] = {"fetched_at": now, "posts": posts}
            _save_cache()
        all_posts.extend(posts[:max_results])

    # Backfill / repair images for cached posts (unsigned dms URLs 403, so
    # treat a no-signature set as missing and re-pull from the post page).
    if not light:
        for post in all_posts:
            imgs = post.get("images") or []
            if not imgs or not any(_is_signed(u) for u in imgs):
                if post.get("url"):
                    imgs = _fetch_post_images_direct(post["url"])
                    # Profile photos are the author avatar, not post media.
                    post["avatar"] = next((u for u in imgs if "profile-displayphoto" in u), post.get("avatar") or "")
                    post["images"] = [u for u in imgs if "profile-displayphoto" not in u][:6]

    # Newest first: posts with a known publish date float to the top.
    all_posts.sort(key=lambda p: p.get("published") or "", reverse=True)

    # Date-specific feed: keep only posts published on the requested date.
    date_note = None
    if date:
        matching = [p for p in all_posts if (p.get("published") or "").startswith(date)]
        if matching:
            all_posts = matching
        else:
            dated = [p for p in all_posts if p.get("published")]
            if dated:
                nearest = max(p["published"][:10] for p in dated)
                date_note = (
                    f"No LinkedIn posts found published exactly on {date} for this topic — "
                    f"showing the closest date ({nearest}) instead."
                )
            else:
                date_note = f"Publish dates unavailable for this topic — showing all fetched posts (requested {date})."

    if not all_posts and errors:
        raise RuntimeError(errors[0])

    fetched_now = int(now)
    result = {
        "topic": topic or "mixed",
        "count": len(all_posts),
        "generator": "tavily-live-search",
        "fetchedAt": datetime.fromtimestamp(fetched_now, tz=timezone.utc).isoformat(),
        "errors": errors[:3],
        "posts": all_posts,
    }
    if skipped:
        result["note"] = (
            f"{skipped} topic(s) still loading their cache — press Fetch All Topics again "
            "to fetch the next batch (API quota protection)."
        )
    if date_note:
        result["note"] = f"{result.get('note', '')} {date_note}".strip()
    return result


def live_topic_keys():
    return [t["key"] for t in LIVE_TOPICS]
