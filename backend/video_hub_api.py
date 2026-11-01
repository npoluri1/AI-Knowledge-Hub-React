# video_hub_api.py — Multi-platform video discovery + playback + local downloads.
# ---------------------------------------------------------------------------------
# YouTube: real date-wise discovery via the OFFICIAL YouTube Data API v3 when
#   YOUTUBE_API_KEY is set (any date range up to 5 years, paginated). Without a
#   key, falls back to yt-dlp metadata search so the page still works.
# Instagram / TikTok / Facebook: no unauthenticated discovery API exists, so the
#   hub offers: (a) official embed playback for any pasted post URL, and
#   (b) one-click platform search deep-links per tech-stack topic.
# Downloads: local yt-dlp into ../exports/videos (only content you have rights
#   to — your own uploads, Creative Commons, or platform-offered downloads).
# All topic queries reuse the same 44-topic AI tech-stack catalog as LinkedIn.

import os
import re
import json
import time
import base64
import threading
import subprocess
import shutil
import html as _html
from urllib.parse import quote_plus
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, date, timezone, timedelta

try:
    import requests
except ImportError:  # pragma: no cover
    requests = None

try:
    import yt_dlp
except ImportError:  # pragma: no cover
    yt_dlp = None

_EXPORT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "exports")
VIDEO_DIR = os.path.join(_EXPORT_DIR, "videos")
os.makedirs(VIDEO_DIR, exist_ok=True)

# ── Tech-stack topics (same 44 as the LinkedIn feed) ──
VIDEO_TOPICS = [
    ("ai", "AI", "artificial intelligence explained"),
    ("ml", "ML", "machine learning explained"),
    ("agents", "AI Agents", "AI agents explained"),
    ("multi_agents", "Multi-Agents", "multi-agent AI systems"),
    ("python", "Python", "python tutorial"),
    ("fastapi", "FastAPI", "FastAPI tutorial"),
    ("reactjs", "ReactJS", "ReactJS tutorial"),
    ("nextjs", "NextJS", "Next.js tutorial"),
    ("rag", "RAG", "RAG retrieval augmented generation explained"),
    ("mcp", "MCP", "Model Context Protocol explained"),
    ("langchain", "LangChain", "LangChain tutorial"),
    ("langgraph", "LangGraph", "LangGraph tutorial"),
    ("vectordb", "VectorDB", "vector database explained"),
    ("workflows", "AI Workflows", "AI workflow automation"),
    ("crewai", "CrewAI", "CrewAI tutorial"),
    ("tool_calling", "Tool/Function Calling", "LLM function calling explained"),
    ("memory", "Memory Management", "AI agent memory explained"),
    ("agent_gateway", "Agent Gateway", "LLM gateway LiteLLM"),
    ("agent_loops", "Agent Loops", "ReAct agent loop explained"),
    ("ai_graphs", "AI Graphs", "LangGraph state machines"),
    ("spring_ai", "Spring AI", "Spring AI tutorial"),
    ("evaluations", "Evaluations", "LLM evaluation RAGAS"),
    ("observability", "Observability", "LLM observability Langfuse"),
    ("awareness", "Agent Awareness", "AI agent state awareness"),
    ("guardrails", "GuardRails", "AI guardrails prompt injection"),
    ("react", "REAct Patterns", "ReAct pattern LLM"),
    ("design_patterns", "AI Design Patterns", "AI system design patterns"),
    ("autogen", "AutoGen", "AutoGen Microsoft agents"),
    ("lora", "LORA/QLORA", "LoRA QLoRA fine-tuning explained"),
    ("mlops", "MLOps", "MLOps explained"),
    ("embeddings", "Embeddings", "embeddings explained"),
    ("llamaindex", "LlamaIndex", "LlamaIndex tutorial"),
    ("llms", "LLMs", "large language models explained"),
    ("prompting", "Prompting", "prompt engineering techniques"),
    ("fine_tuning", "Fine-Tuning", "LLM fine-tuning explained"),
    ("governance", "Governance", "AI governance explained"),
    ("looping", "Looping", "AI agent loop control"),
    ("graphics", "Graphics Engineering", "neural rendering DLSS"),
    ("quantum", "Quantum Computing", "quantum computing explained"),
    ("semiconductor", "Semiconductor & Chips", "AI chips semiconductor explained"),
    ("iot", "IoT", "edge AI IoT explained"),
    ("agi", "AGI", "AGI artificial general intelligence"),
    ("asi", "ASI", "artificial superintelligence"),
    ("super_ai", "Super AI", "superintelligence AI"),
]
TOPIC_BY_KEY = {k: (k, label, q) for k, label, q in VIDEO_TOPICS}

# Platform search deep-links (no public discovery API for these platforms).
PLATFORM_SEARCH = {
    "youtube":  "https://www.youtube.com/results?search_query={q}&sp=CAI%253D",  # sp=CAI%3D → sorted by upload date
    "youtube_shorts": "https://www.youtube.com/results?search_query={q}+shorts&sp=CAI%253D",
    "instagram": "https://www.instagram.com/explore/tags/{tag}/",
    "tiktok":   "https://www.tiktok.com/search?q={q}",
    "facebook": "https://www.facebook.com/search/videos/?q={q}",
    "x":        "https://x.com/search?q={q}%20filter%3Avideo&f=live",
}

_lock = threading.Lock()
_meta_cache = {}     # url -> metadata dict (persistent per process)
_jobs = {}           # job_id -> {"status", "progress", "files", "error", ...}
_job_seq = 0


def _job(job_id=None):
    global _job_seq
    with _lock:
        if job_id is None:
            _job_seq += 1
            job_id = f"dl-{int(time.time())}-{_job_seq}"
            _jobs[job_id] = {"id": job_id, "status": "queued", "progress": 0.0,
                             "files": [], "error": "", "title": "", "createdAt": datetime.now(timezone.utc).isoformat()}
        return _jobs[job_id]


def video_topics():
    return {"count": len(VIDEO_TOPICS),
            "topics": [{"key": k, "label": label} for k, label, _ in VIDEO_TOPICS]}


# ─────────────────────────────────────────────────────────────────────────────
# YouTube Data API v3 (official) — date-wise discovery up to 5 years back
# ─────────────────────────────────────────────────────────────────────────────

def _yt_api_key():
    return (os.environ.get("YOUTUBE_API_KEY") or "").strip()


def _yt_data_api_key():
    """Key for the official YouTube Data API — accepts either your own free
    YOUTUBE_API_KEY (console.cloud.google.com) or the free z.ai backend LLM
    key (BACKENDLLM_API_KEY) when it is a Google-style AIza… key."""
    for env in ("YOUTUBE_API_KEY", "BACKENDLLM_API_KEY", "ZAI_API_KEY"):
        val = (os.environ.get(env) or "").strip()
        if val:
            if env == "YOUTUBE_API_KEY" or val.startswith("AIza"):
                return val
    return ""


def _yt_search(query, published_after=None, published_before=None, max_results=24,
               order="date", page_token="", duration="any", country=None, lang=""):
    """Search YouTube via the official Data API v3. duration: any|short(<4min)|long(>20min).
    country: ISO code — adds regionCode + relevanceLanguage when set.
    lang: explicit app-level language override (wins over the country's language)."""
    key = _yt_data_api_key()
    if not key or requests is None:
        return None
    params = {
        "part": "snippet", "q": query, "type": "video",
        "maxResults": max(1, min(int(max_results or 24), 50)),
        "order": order, "key": key, "safeSearch": "none",
    }
    ci = country_info(country)
    if ci["ytRegion"]:
        params["regionCode"] = ci["ytRegion"]
    resolved_lang, _meta = _lang_info(lang, ci["code"])
    effective_lang = resolved_lang or ci["lang"]
    if effective_lang:
        params["relevanceLanguage"] = effective_lang
    if published_after:
        params["publishedAfter"] = published_after
    if published_before:
        params["publishedBefore"] = published_before
    if duration and duration != "any":
        params["videoDuration"] = duration
    if page_token:
        params["pageToken"] = page_token
    r = requests.get("https://www.googleapis.com/youtube/v3/search", params=params, timeout=12)
    if r.status_code != 200:
        raise RuntimeError(f"YouTube API {r.status_code}: {(r.json() or {}).get('error', {}).get('message', r.text[:120])}")
    return r.json()


def _yt_video_ids_from_response(resp):
    return [it["id"]["videoId"] for it in resp.get("items", []) if it.get("id", {}).get("videoId")]


def _yt_details(ids):
    """Batch video details (duration, views, channel) — 50 per call."""
    key = _yt_data_api_key()
    if not key or requests is None or not ids:
        return {}
    out = {}
    for i in range(0, len(ids), 50):
        chunk = ids[i:i + 50]
        r = requests.get("https://www.googleapis.com/youtube/v3/videos", params={
            "part": "contentDetails,statistics,snippet", "id": ",".join(chunk), "key": key,
        }, timeout=12)
        if r.status_code != 200:
            continue
        for it in r.json().get("items", []):
            out[it["id"]] = it
    return out


_ISO8601_DUR = re.compile(r"^P(?:(\d+)D)?T?(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$")


def _parse_duration(iso):
    m = _ISO8601_DUR.match(iso or "")
    if not m:
        return 0
    d, h, mi, s = (int(g) if g else 0 for g in m.groups())
    return d * 86400 + h * 3600 + mi * 60 + s


def _is_short(duration_secs):
    return 0 < duration_secs <= 60


# ─────────────────────────────────────────────────────────────────────────────
# Keyless YouTube fallback — yt-dlp search (works without YOUTUBE_API_KEY)
# ─────────────────────────────────────────────────────────────────────────────

_yt_fb_cache = {}    # query -> {"items": [...], "fetchedAt": ts}
_yt_vid_cache = {}   # videoId -> enriched metadata
_yt_fb_lock = threading.Lock()


def _fmt_ymd(s):
    if isinstance(s, str) and len(s) == 8 and s.isdigit():
        return f"{s[:4]}-{s[4:6]}-{s[6:8]}"
    return s or ""


def _yt_enrich_video(vid, _force=False):
    """Full metadata for one video id (real upload date, views, likes)."""
    with _yt_fb_lock:
        cached = _yt_vid_cache.get(vid)
    if cached:
        return cached
    if yt_dlp is None:
        return {}
    opts = {"quiet": True, "no_warnings": True, "skip_download": True, "noplaylist": True}
    out = {}
    try:
        with yt_dlp.YoutubeDL(opts) as ydl:
            info = ydl.extract_info(f"https://www.youtube.com/watch?v={vid}", download=False)
        dur = int(info.get("duration") or 0)
        out = {
            "published": _fmt_ymd(info.get("upload_date") or ""),
            "views": int(info.get("view_count") or 0),
            "likes": int(info.get("like_count") or 0),
            "description": (info.get("description") or "")[:400],
            "channel": info.get("uploader") or info.get("channel") or info.get("uploader_id") or "",
            "durationSec": dur,
            "isShort": _is_short(dur),
            "thumbnail": info.get("thumbnail") or f"https://i.ytimg.com/vi/{vid}/hqdefault.jpg",
        }
        with _yt_fb_lock:
            _yt_vid_cache[vid] = out
    except Exception:  # noqa: BLE001
        pass
    return out


def _yt_fallback_search(query, max_results=24, date_sorted=False, enrich_limit=None):
    """Search YouTube without an API key via yt-dlp's search extractor.
    Flat entries are fast but lack upload dates, so results are enriched
    concurrently with full metadata for real date-wise grouping.
    With date_sorted=True, upload-date-ordered results (sp=CAI%3D) are
    merged in best-effort so a requested date range returns fresh videos.
    enrich_limit caps how many videos get full metadata lookups (load-all mode)."""
    cache_key = f"{query}|{'date' if date_sorted else 'rel'}"
    with _yt_fb_lock:
        cached = _yt_fb_cache.get(cache_key)
        if cached and time.time() - cached["fetchedAt"] < 2 * 3600:
            return list(cached["items"])
    if yt_dlp is None:
        return []
    n = max(min(max_results, 40), 12)
    opts = {
        "quiet": True, "no_warnings": True, "skip_download": True,
        "extract_flat": "in_playlist", "noplaylist": True, "playlistend": n,
    }
    _vid_rx = re.compile(r"^[A-Za-z0-9_-]{11}$")  # exactly 11 chars = a video ID

    def _is_video_id(vid):
        # Playlists (PL/RD/UU/LL/OL/FL/PLxx…), channels (UC) and other row
        # types leak into flat search results — their /vi/<id>/ thumbnails 404.
        return bool(_vid_rx.match(vid or "")) and not vid.startswith(("PL", "RD", "UU", "LL", "OL", "FL", "UC"))

    flat = []
    try:
        with yt_dlp.YoutubeDL(opts) as ydl:
            info = ydl.extract_info(f"ytsearch{n}:{query}", download=False)
            for e in (info or {}).get("entries") or []:
                if e and e.get("id") and _is_video_id(e["id"]):
                    flat.append(e)
            if date_sorted:
                try:
                    url = ("https://www.youtube.com/results?search_query="
                           + quote_plus(query) + "&sp=CAI%3D")
                    info2 = ydl.extract_info(url, download=False)
                    seen = {e["id"] for e in flat}
                    for e in (info2 or {}).get("entries") or []:
                        if (e and e.get("id") and e["id"] not in seen
                                and _is_video_id(e["id"])):  # videos only — skip playlist/channel rows
                            flat.append(e)
                except Exception:  # noqa: BLE001
                    pass
    except Exception:  # noqa: BLE001
        return []
    if not flat:
        return []

    def base_item(e):
        vid = e["id"]
        dur = int(e.get("duration") or 0)
        return {
            "id": f"yt-{vid}", "videoId": vid, "platform": "youtube",
            "title": e.get("title") or "Untitled",
            "channel": e.get("uploader") or e.get("channel") or "",
            "published": "", "description": "",
            "durationSec": dur, "isShort": _is_short(dur),
            "thumbnail": f"https://i.ytimg.com/vi/{vid}/hqdefault.jpg",
            "url": f"https://www.youtube.com/watch?v={vid}",
            "embedUrl": f"https://www.youtube-nocookie.com/embed/{vid}",
            "views": int(e.get("view_count") or 0), "likes": 0,
        }

    items = [base_item(e) for e in flat]
    targets = items[:enrich_limit] if enrich_limit else items
    with ThreadPoolExecutor(max_workers=6) as pool:
        enriched = list(pool.map(lambda it: _yt_enrich_video(it["videoId"]), targets))
    for it, meta in zip(targets, enriched):
        if meta:
            for k in ("published", "views", "likes", "description", "channel",
                      "durationSec", "isShort", "thumbnail"):
                if meta.get(k) not in (None, ""):
                    it[k] = meta[k]
        it["kind"] = "short" if it["isShort"] else "long"
    items.sort(key=lambda x: x.get("published") or "", reverse=True)
    with _yt_fb_lock:
        _yt_fb_cache[cache_key] = {"items": items, "fetchedAt": time.time()}
    return items


def discover_youtube(topic=None, start=None, end=None, max_results=24,
                     page_token="", kind="all", enrich_limit=None, country=None, lang=""):
    """Date-wise YouTube discovery for one topic (or mixed). kind:
    all | shorts | long. country biases results to that market (regionCode
    via the official API; language/market terms keylessly) and lang applies an
    app-level language bias. Returns items + nextPageToken for pagination.
    enrich_limit caps metadata fetches."""
    t = TOPIC_BY_KEY.get(topic or "", None)
    ci = country_info(country)
    bias = _bias_for(country, lang)
    query = t[2] if t else "AI tech stack"
    if bias:
        query = f"{query} {bias}"
    topic_key = t[0] if t else "mixed"

    after = before = None
    if start:
        try:
            after = datetime.fromisoformat(start).replace(tzinfo=timezone.utc).isoformat().replace("+00:00", "Z")
        except ValueError:
            pass
    if end:
        try:
            before = (datetime.fromisoformat(end) + timedelta(days=1)).replace(tzinfo=timezone.utc).isoformat().replace("+00:00", "Z")
        except ValueError:
            pass

    items, next_token, error = [], "", ""
    if _yt_data_api_key():
        try:
            duration = "short" if kind == "shorts" else ("long" if kind == "long" else "any")
            resp = _yt_search(query, after, before, max_results, "date", page_token, duration, country=ci["code"], lang=lang)
            ids = _yt_video_ids_from_response(resp)
            details = _yt_details(ids)
            for it in resp.get("items", []):
                vid = it.get("id", {}).get("videoId")
                if not vid:
                    continue
                sn = it.get("snippet", {})
                det = details.get(vid, {})
                dur = _parse_duration(det.get("contentDetails", {}).get("duration", ""))
                is_short = _is_short(dur)
                if kind == "shorts" and not is_short:
                    continue
                if kind == "long" and is_short:
                    continue
                stats = det.get("statistics", {})
                items.append({
                    "id": f"yt-{vid}", "videoId": vid, "platform": "youtube",
                    "topic": topic_key,
                    "topicLabel": t[1] if t else "Mixed",
                    "title": sn.get("title", ""),
                    "channel": sn.get("channelTitle", ""),
                    "description": (sn.get("description") or "")[:400],
                    "published": sn.get("publishedAt", "")[:10],
                    "thumbnail": sn.get("thumbnails", {}).get("high", {}).get("url")
                                 or sn.get("thumbnails", {}).get("medium", {}).get("url", ""),
                    "url": f"https://www.youtube.com/watch?v={vid}",
                    "embedUrl": f"https://www.youtube-nocookie.com/embed/{vid}",
                    "durationSec": dur, "isShort": is_short,
                    "views": int(stats.get("viewCount", 0) or 0),
                    "likes": int(stats.get("likeCount", 0) or 0),
                    "kind": "short" if is_short else "long",
                })
            next_token = resp.get("nextPageToken", "")
        except Exception as exc:  # noqa: BLE001
            error = str(exc)
    else:
        # Keyless mode: real YouTube results via yt-dlp, enriched with real
        # upload dates so date-wise grouping still works.
        if kind == "shorts":
            combined, seen = [], set()
            for qv in (f"{query} shorts", f"{query} #shorts"):
                for it in _yt_fallback_search(qv, max_results, date_sorted=True):
                    if it["videoId"] not in seen:
                        seen.add(it["videoId"])
                        combined.append(it)
            shorts = [it for it in combined if it.get("isShort")]
            if len(shorts) < 4:  # relax to short-form (<3 min) when starved
                shorts = [it for it in combined if 0 < int(it.get("durationSec") or 0) <= 180]
            fb = shorts
        else:
            fb = _yt_fallback_search(query, max_results, date_sorted=bool(start or end),
                                 enrich_limit=enrich_limit)
        for it in fb:
            is_short = bool(it.get("isShort"))
            if kind == "shorts" and not is_short:
                continue
            if kind == "long" and is_short:
                continue
            pub = it.get("published") or ""
            if after and pub and pub < start:
                continue
            if before and pub and pub > end:
                continue
            items.append({**it, "topic": topic_key,
                          "topicLabel": t[1] if t else "Mixed",
                          "kind": "short" if is_short else "long"})
        if items:
            error = "Keyless mode: live YouTube results via yt-dlp — add YOUTUBE_API_KEY (free, console.cloud.google.com) or BACKENDLLM_API_KEY to .env for deeper date-range filtering."
        else:
            error = "No results for this topic/range. Add YOUTUBE_API_KEY to .env for full discovery, or try another topic."

    return {
        "topic": topic_key, "kind": kind, "start": start or "", "end": end or "",
        "count": len(items), "items": items, "nextPageToken": next_token,
        "source": "youtube-data-api" if _yt_data_api_key() else ("yt-dlp-keyless" if items else "none"),
        "error": error,
    }


def discover_all_youtube(start=None, end=None, max_results=240, kind="all", per_topic=6, country=None, lang=""):
    """Fetch videos for EVERY tech-stack topic in parallel and merge into one
    big date-sorted feed. Per-topic metadata enrichment is capped so the first
    run stays fast; results are cached by yt-dlp for subsequent loads.
    country biases every topic's search to that market; lang biases language."""
    t0 = time.time()

    def run(t):
        try:
            r = discover_youtube(topic=t[0], start=start, end=end,
                                 max_results=per_topic, page_token="", kind=kind,
                                 enrich_limit=4, country=country, lang=lang)
            return r.get("items") or []
        except Exception:  # noqa: BLE001
            return []

    merged = []
    with ThreadPoolExecutor(max_workers=8) as pool:
        for items in pool.map(run, VIDEO_TOPICS):
            merged.extend(items)

    seen, uniq = set(), []
    for it in merged:
        vid = it.get("videoId")
        if vid and vid not in seen:
            seen.add(vid)
            uniq.append(it)
    # Dated videos first (newest first), undated at the end.
    uniq.sort(key=lambda it: ("1" if it.get("published") else "0",
                              it.get("published") or ""), reverse=True)
    uniq = uniq[:max(1, min(max_results, 400))]
    return {
        "topic": "all", "kind": kind, "start": start or "", "end": end or "",
        "country": country_info(country)["code"],
        "count": len(uniq), "items": uniq,
        "source": "yt-dlp-keyless-multi",
        "elapsedMs": int((time.time() - t0) * 1000),
        "error": f"Loaded {len(uniq)} videos across all {len(VIDEO_TOPICS)} topics (keyless mode)." if uniq else "No videos found — try widening the date range.",
    }


_UA_BROWSER = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
               "AppleWebKit/537.36 (KHTML, like Gecko) "
               "Chrome/126.0.0.0 Safari/537.36")
_tt_ddg_cache = {}
_tavily = None

# ─────────────────────────────────────────────────────────────────────────────
# GLOBAL COUNTRY COVERAGE — 190+ countries & territories across every region.
# Pick any country and every network biases its discovery toward
# creators/results from there (keyless: language + market query terms for
# search indexes; official regionCode when a YouTube API key is present).
# `"global"` means worldwide (default, unchanged behavior). Each entry carries
# the primary language code ("lang") used for relevanceLanguage and an
# app-level "region" so the UI can group countries by continent.
# ─────────────────────────────────────────────────────────────────────────────
REGION_GLOBAL = "🌐 Worldwide"
REGION_AMERICAS = "🌎 Americas"
REGION_EUROPE = "🇪🇺 Europe"
REGION_AFRICA = "🌍 Africa"
REGION_MEAST = "🕌 Middle East"
REGION_ASIA = "🌏 Asia-Pacific"
REGION_OCEANIA = "🏝️ Oceania"

COUNTRIES = [
    {"code": "global", "name": "🌍 Worldwide", "lang": "", "ytRegion": "", "region": REGION_GLOBAL},
    # ── Americas (37) ──
    {"code": "us", "name": "🇺🇸 United States", "lang": "en", "ytRegion": "US", "region": REGION_AMERICAS},
    {"code": "ca", "name": "🇨🇦 Canada", "lang": "en", "ytRegion": "CA", "region": REGION_AMERICAS},
    {"code": "mx", "name": "🇲🇽 Mexico", "lang": "es", "ytRegion": "MX", "region": REGION_AMERICAS},
    {"code": "gt", "name": "🇬🇹 Guatemala", "lang": "es", "ytRegion": "GT", "region": REGION_AMERICAS},
    {"code": "bz", "name": "🇧🇿 Belize", "lang": "en", "ytRegion": "BZ", "region": REGION_AMERICAS},
    {"code": "sv", "name": "🇸🇻 El Salvador", "lang": "es", "ytRegion": "SV", "region": REGION_AMERICAS},
    {"code": "hn", "name": "🇭🇳 Honduras", "lang": "es", "ytRegion": "HN", "region": REGION_AMERICAS},
    {"code": "ni", "name": "🇳🇮 Nicaragua", "lang": "es", "ytRegion": "NI", "region": REGION_AMERICAS},
    {"code": "cr", "name": "🇨🇷 Costa Rica", "lang": "es", "ytRegion": "CR", "region": REGION_AMERICAS},
    {"code": "pa", "name": "🇵🇦 Panama", "lang": "es", "ytRegion": "PA", "region": REGION_AMERICAS},
    {"code": "cu", "name": "🇨🇺 Cuba", "lang": "es", "ytRegion": "CU", "region": REGION_AMERICAS},
    {"code": "jm", "name": "🇯🇲 Jamaica", "lang": "en", "ytRegion": "JM", "region": REGION_AMERICAS},
    {"code": "ht", "name": "🇭🇹 Haiti", "lang": "fr", "ytRegion": "HT", "region": REGION_AMERICAS},
    {"code": "do", "name": "🇩🇴 Dominican Republic", "lang": "es", "ytRegion": "DO", "region": REGION_AMERICAS},
    {"code": "tt", "name": "🇹🇹 Trinidad & Tobago", "lang": "en", "ytRegion": "TT", "region": REGION_AMERICAS},
    {"code": "bs", "name": "🇧🇸 Bahamas", "lang": "en", "ytRegion": "BS", "region": REGION_AMERICAS},
    {"code": "bb", "name": "🇧🇧 Barbados", "lang": "en", "ytRegion": "BB", "region": REGION_AMERICAS},
    {"code": "ag", "name": "🇦🇬 Antigua & Barbuda", "lang": "en", "ytRegion": "AG", "region": REGION_AMERICAS},
    {"code": "dm", "name": "🇩🇲 Dominica", "lang": "en", "ytRegion": "DM", "region": REGION_AMERICAS},
    {"code": "gd", "name": "🇬🇩 Grenada", "lang": "en", "ytRegion": "GD", "region": REGION_AMERICAS},
    {"code": "kn", "name": "🇰🇳 St Kitts & Nevis", "lang": "en", "ytRegion": "KN", "region": REGION_AMERICAS},
    {"code": "lc", "name": "🇱🇨 St Lucia", "lang": "en", "ytRegion": "LC", "region": REGION_AMERICAS},
    {"code": "vc", "name": "🇻🇨 St Vincent", "lang": "en", "ytRegion": "VC", "region": REGION_AMERICAS},
    {"code": "pr", "name": "🇵🇷 Puerto Rico", "lang": "es", "ytRegion": "PR", "region": REGION_AMERICAS},
    {"code": "co", "name": "🇨🇴 Colombia", "lang": "es", "ytRegion": "CO", "region": REGION_AMERICAS},
    {"code": "ve", "name": "🇻🇪 Venezuela", "lang": "es", "ytRegion": "VE", "region": REGION_AMERICAS},
    {"code": "ec", "name": "🇪🇨 Ecuador", "lang": "es", "ytRegion": "EC", "region": REGION_AMERICAS},
    {"code": "pe", "name": "🇵🇪 Peru", "lang": "es", "ytRegion": "PE", "region": REGION_AMERICAS},
    {"code": "br", "name": "🇧🇷 Brazil", "lang": "pt", "ytRegion": "BR", "region": REGION_AMERICAS},
    {"code": "bo", "name": "🇧🇴 Bolivia", "lang": "es", "ytRegion": "BO", "region": REGION_AMERICAS},
    {"code": "py", "name": "🇵🇾 Paraguay", "lang": "es", "ytRegion": "PY", "region": REGION_AMERICAS},
    {"code": "uy", "name": "🇺🇾 Uruguay", "lang": "es", "ytRegion": "UY", "region": REGION_AMERICAS},
    {"code": "ar", "name": "🇦🇷 Argentina", "lang": "es", "ytRegion": "AR", "region": REGION_AMERICAS},
    {"code": "cl", "name": "🇨🇱 Chile", "lang": "es", "ytRegion": "CL", "region": REGION_AMERICAS},
    {"code": "gy", "name": "🇬🇾 Guyana", "lang": "en", "ytRegion": "GY", "region": REGION_AMERICAS},
    {"code": "sr", "name": "🇸🇷 Suriname", "lang": "nl", "ytRegion": "SR", "region": REGION_AMERICAS},
    # ── Europe (46) ──
    {"code": "gb", "name": "🇬🇧 United Kingdom", "lang": "en", "ytRegion": "GB", "region": REGION_EUROPE},
    {"code": "ie", "name": "🇮🇪 Ireland", "lang": "en", "ytRegion": "IE", "region": REGION_EUROPE},
    {"code": "fr", "name": "🇫🇷 France", "lang": "fr", "ytRegion": "FR", "region": REGION_EUROPE},
    {"code": "de", "name": "🇩🇪 Germany", "lang": "de", "ytRegion": "DE", "region": REGION_EUROPE},
    {"code": "at", "name": "🇦🇹 Austria", "lang": "de", "ytRegion": "AT", "region": REGION_EUROPE},
    {"code": "ch", "name": "🇨🇭 Switzerland", "lang": "de", "ytRegion": "CH", "region": REGION_EUROPE},
    {"code": "nl", "name": "🇳🇱 Netherlands", "lang": "nl", "ytRegion": "NL", "region": REGION_EUROPE},
    {"code": "be", "name": "🇧🇪 Belgium", "lang": "nl", "ytRegion": "BE", "region": REGION_EUROPE},
    {"code": "lu", "name": "🇱🇺 Luxembourg", "lang": "de", "ytRegion": "LU", "region": REGION_EUROPE},
    {"code": "li", "name": "🇱🇮 Liechtenstein", "lang": "de", "ytRegion": "LI", "region": REGION_EUROPE},
    {"code": "mc", "name": "🇲🇨 Monaco", "lang": "fr", "ytRegion": "MC", "region": REGION_EUROPE},
    {"code": "it", "name": "🇮🇹 Italy", "lang": "it", "ytRegion": "IT", "region": REGION_EUROPE},
    {"code": "es", "name": "🇪🇸 Spain", "lang": "es", "ytRegion": "ES", "region": REGION_EUROPE},
    {"code": "pt", "name": "🇵🇹 Portugal", "lang": "pt", "ytRegion": "PT", "region": REGION_EUROPE},
    {"code": "ad", "name": "🇦🇩 Andorra", "lang": "ca", "ytRegion": "AD", "region": REGION_EUROPE},
    {"code": "sm", "name": "🇸🇲 San Marino", "lang": "it", "ytRegion": "SM", "region": REGION_EUROPE},
    {"code": "gr", "name": "🇬🇷 Greece", "lang": "el", "ytRegion": "GR", "region": REGION_EUROPE},
    {"code": "cy", "name": "🇨🇾 Cyprus", "lang": "el", "ytRegion": "CY", "region": REGION_EUROPE},
    {"code": "mt", "name": "🇲🇹 Malta", "lang": "mt", "ytRegion": "MT", "region": REGION_EUROPE},
    {"code": "dk", "name": "🇩🇰 Denmark", "lang": "da", "ytRegion": "DK", "region": REGION_EUROPE},
    {"code": "no", "name": "🇳🇴 Norway", "lang": "no", "ytRegion": "NO", "region": REGION_EUROPE},
    {"code": "se", "name": "🇸🇪 Sweden", "lang": "sv", "ytRegion": "SE", "region": REGION_EUROPE},
    {"code": "fi", "name": "🇫🇮 Finland", "lang": "fi", "ytRegion": "FI", "region": REGION_EUROPE},
    {"code": "is", "name": "🇮🇸 Iceland", "lang": "is", "ytRegion": "IS", "region": REGION_EUROPE},
    {"code": "ee", "name": "🇪🇪 Estonia", "lang": "et", "ytRegion": "EE", "region": REGION_EUROPE},
    {"code": "lv", "name": "🇱🇻 Latvia", "lang": "lv", "ytRegion": "LV", "region": REGION_EUROPE},
    {"code": "lt", "name": "🇱🇹 Lithuania", "lang": "lt", "ytRegion": "LT", "region": REGION_EUROPE},
    {"code": "pl", "name": "🇵🇱 Poland", "lang": "pl", "ytRegion": "PL", "region": REGION_EUROPE},
    {"code": "cz", "name": "🇨🇿 Czechia", "lang": "cs", "ytRegion": "CZ", "region": REGION_EUROPE},
    {"code": "sk", "name": "🇸🇰 Slovakia", "lang": "sk", "ytRegion": "SK", "region": REGION_EUROPE},
    {"code": "hu", "name": "🇭🇺 Hungary", "lang": "hu", "ytRegion": "HU", "region": REGION_EUROPE},
    {"code": "ro", "name": "🇷🇴 Romania", "lang": "ro", "ytRegion": "RO", "region": REGION_EUROPE},
    {"code": "md", "name": "🇲🇩 Moldova", "lang": "ro", "ytRegion": "MD", "region": REGION_EUROPE},
    {"code": "bg", "name": "🇧🇬 Bulgaria", "lang": "bg", "ytRegion": "BG", "region": REGION_EUROPE},
    {"code": "si", "name": "🇸🇮 Slovenia", "lang": "sl", "ytRegion": "SI", "region": REGION_EUROPE},
    {"code": "hr", "name": "🇭🇷 Croatia", "lang": "hr", "ytRegion": "HR", "region": REGION_EUROPE},
    {"code": "rs", "name": "🇷🇸 Serbia", "lang": "sr", "ytRegion": "RS", "region": REGION_EUROPE},
    {"code": "ba", "name": "🇧🇦 Bosnia & Herzegovina", "lang": "bs", "ytRegion": "BA", "region": REGION_EUROPE},
    {"code": "mk", "name": "🇲🇰 North Macedonia", "lang": "mk", "ytRegion": "MK", "region": REGION_EUROPE},
    {"code": "me", "name": "🇲🇪 Montenegro", "lang": "sr", "ytRegion": "ME", "region": REGION_EUROPE},
    {"code": "al", "name": "🇦🇱 Albania", "lang": "sq", "ytRegion": "AL", "region": REGION_EUROPE},
    {"code": "ua", "name": "🇺🇦 Ukraine", "lang": "uk", "ytRegion": "UA", "region": REGION_EUROPE},
    {"code": "by", "name": "🇧🇾 Belarus", "lang": "be", "ytRegion": "BY", "region": REGION_EUROPE},
    {"code": "ru", "name": "🇷🇺 Russia", "lang": "ru", "ytRegion": "RU", "region": REGION_EUROPE},
    {"code": "ge", "name": "🇬🇪 Georgia", "lang": "ka", "ytRegion": "GE", "region": REGION_EUROPE},
    {"code": "am", "name": "🇦🇲 Armenia", "lang": "hy", "ytRegion": "AM", "region": REGION_EUROPE},
    {"code": "az", "name": "🇦🇿 Azerbaijan", "lang": "az", "ytRegion": "AZ", "region": REGION_EUROPE},
    # ── Middle East (15) ──
    {"code": "tr", "name": "🇹🇷 Turkey", "lang": "tr", "ytRegion": "TR", "region": REGION_MEAST},
    {"code": "sy", "name": "🇸🇾 Syria", "lang": "ar", "ytRegion": "SY", "region": REGION_MEAST},
    {"code": "lb", "name": "🇱🇧 Lebanon", "lang": "ar", "ytRegion": "LB", "region": REGION_MEAST},
    {"code": "il", "name": "🇮🇱 Israel", "lang": "he", "ytRegion": "IL", "region": REGION_MEAST},
    {"code": "ps", "name": "🇵🇸 Palestine", "lang": "ar", "ytRegion": "PS", "region": REGION_MEAST},
    {"code": "jo", "name": "🇯🇴 Jordan", "lang": "ar", "ytRegion": "JO", "region": REGION_MEAST},
    {"code": "iq", "name": "🇮🇶 Iraq", "lang": "ar", "ytRegion": "IQ", "region": REGION_MEAST},
    {"code": "ir", "name": "🇮🇷 Iran", "lang": "fa", "ytRegion": "IR", "region": REGION_MEAST},
    {"code": "sa", "name": "🇸🇦 Saudi Arabia", "lang": "ar", "ytRegion": "SA", "region": REGION_MEAST},
    {"code": "ye", "name": "🇾🇪 Yemen", "lang": "ar", "ytRegion": "YE", "region": REGION_MEAST},
    {"code": "om", "name": "🇴🇲 Oman", "lang": "ar", "ytRegion": "OM", "region": REGION_MEAST},
    {"code": "ae", "name": "🇦🇪 UAE", "lang": "en", "ytRegion": "AE", "region": REGION_MEAST},
    {"code": "qa", "name": "🇶🇦 Qatar", "lang": "ar", "ytRegion": "QA", "region": REGION_MEAST},
    {"code": "bh", "name": "🇧🇭 Bahrain", "lang": "ar", "ytRegion": "BH", "region": REGION_MEAST},
    {"code": "kw", "name": "🇰🇼 Kuwait", "lang": "ar", "ytRegion": "KW", "region": REGION_MEAST},
    # ── Africa (53) ──
    {"code": "ma", "name": "🇲🇦 Morocco", "lang": "ar", "ytRegion": "MA", "region": REGION_AFRICA},
    {"code": "dz", "name": "🇩🇿 Algeria", "lang": "ar", "ytRegion": "DZ", "region": REGION_AFRICA},
    {"code": "tn", "name": "🇹🇳 Tunisia", "lang": "ar", "ytRegion": "TN", "region": REGION_AFRICA},
    {"code": "ly", "name": "🇱🇾 Libya", "lang": "ar", "ytRegion": "LY", "region": REGION_AFRICA},
    {"code": "eg", "name": "🇪🇬 Egypt", "lang": "ar", "ytRegion": "EG", "region": REGION_AFRICA},
    {"code": "sd", "name": "🇸🇩 Sudan", "lang": "ar", "ytRegion": "SD", "region": REGION_AFRICA},
    {"code": "ss", "name": "🇸🇸 South Sudan", "lang": "en", "ytRegion": "SS", "region": REGION_AFRICA},
    {"code": "et", "name": "🇪🇹 Ethiopia", "lang": "am", "ytRegion": "ET", "region": REGION_AFRICA},
    {"code": "er", "name": "🇪🇷 Eritrea", "lang": "ti", "ytRegion": "ER", "region": REGION_AFRICA},
    {"code": "dj", "name": "🇩🇯 Djibouti", "lang": "fr", "ytRegion": "DJ", "region": REGION_AFRICA},
    {"code": "so", "name": "🇸🇴 Somalia", "lang": "so", "ytRegion": "SO", "region": REGION_AFRICA},
    {"code": "ke", "name": "🇰🇪 Kenya", "lang": "sw", "ytRegion": "KE", "region": REGION_AFRICA},
    {"code": "ug", "name": "🇺🇬 Uganda", "lang": "sw", "ytRegion": "UG", "region": REGION_AFRICA},
    {"code": "tz", "name": "🇹🇿 Tanzania", "lang": "sw", "ytRegion": "TZ", "region": REGION_AFRICA},
    {"code": "rw", "name": "🇷🇼 Rwanda", "lang": "rw", "ytRegion": "RW", "region": REGION_AFRICA},
    {"code": "bi", "name": "🇧🇮 Burundi", "lang": "rn", "ytRegion": "BI", "region": REGION_AFRICA},
    {"code": "cd", "name": "🇨🇩 DR Congo", "lang": "fr", "ytRegion": "CD", "region": REGION_AFRICA},
    {"code": "cg", "name": "🇨🇬 Congo", "lang": "fr", "ytRegion": "CG", "region": REGION_AFRICA},
    {"code": "ga", "name": "🇬🇦 Gabon", "lang": "fr", "ytRegion": "GA", "region": REGION_AFRICA},
    {"code": "gq", "name": "🇬🇶 Equatorial Guinea", "lang": "es", "ytRegion": "GQ", "region": REGION_AFRICA},
    {"code": "cm", "name": "🇨🇲 Cameroon", "lang": "fr", "ytRegion": "CM", "region": REGION_AFRICA},
    {"code": "cf", "name": "🇨🇫 Central African Rep.", "lang": "fr", "ytRegion": "CF", "region": REGION_AFRICA},
    {"code": "td", "name": "🇹🇩 Chad", "lang": "fr", "ytRegion": "TD", "region": REGION_AFRICA},
    {"code": "ne", "name": "🇳🇪 Niger", "lang": "fr", "ytRegion": "NE", "region": REGION_AFRICA},
    {"code": "ng", "name": "🇳🇬 Nigeria", "lang": "en", "ytRegion": "NG", "region": REGION_AFRICA},
    {"code": "bj", "name": "🇧🇯 Benin", "lang": "fr", "ytRegion": "BJ", "region": REGION_AFRICA},
    {"code": "tg", "name": "🇹🇬 Togo", "lang": "fr", "ytRegion": "TG", "region": REGION_AFRICA},
    {"code": "gh", "name": "🇬🇭 Ghana", "lang": "en", "ytRegion": "GH", "region": REGION_AFRICA},
    {"code": "ci", "name": "🇨🇮 Ivory Coast", "lang": "fr", "ytRegion": "CI", "region": REGION_AFRICA},
    {"code": "lr", "name": "🇱🇷 Liberia", "lang": "en", "ytRegion": "LR", "region": REGION_AFRICA},
    {"code": "sl", "name": "🇸🇱 Sierra Leone", "lang": "en", "ytRegion": "SL", "region": REGION_AFRICA},
    {"code": "gn", "name": "🇬🇳 Guinea", "lang": "fr", "ytRegion": "GN", "region": REGION_AFRICA},
    {"code": "gw", "name": "🇬🇼 Guinea-Bissau", "lang": "pt", "ytRegion": "GW", "region": REGION_AFRICA},
    {"code": "sn", "name": "🇸🇳 Senegal", "lang": "fr", "ytRegion": "SN", "region": REGION_AFRICA},
    {"code": "gm", "name": "🇬🇲 Gambia", "lang": "en", "ytRegion": "GM", "region": REGION_AFRICA},
    {"code": "ml", "name": "🇲🇱 Mali", "lang": "fr", "ytRegion": "ML", "region": REGION_AFRICA},
    {"code": "bf", "name": "🇧🇫 Burkina Faso", "lang": "fr", "ytRegion": "BF", "region": REGION_AFRICA},
    {"code": "mr", "name": "🇲🇷 Mauritania", "lang": "ar", "ytRegion": "MR", "region": REGION_AFRICA},
    {"code": "cv", "name": "🇨🇻 Cape Verde", "lang": "pt", "ytRegion": "CV", "region": REGION_AFRICA},
    {"code": "km", "name": "🇰🇲 Comoros", "lang": "ar", "ytRegion": "KM", "region": REGION_AFRICA},
    {"code": "za", "name": "🇿🇦 South Africa", "lang": "en", "ytRegion": "ZA", "region": REGION_AFRICA},
    {"code": "na", "name": "🇳🇦 Namibia", "lang": "en", "ytRegion": "NA", "region": REGION_AFRICA},
    {"code": "bw", "name": "🇧🇼 Botswana", "lang": "en", "ytRegion": "BW", "region": REGION_AFRICA},
    {"code": "zw", "name": "🇿🇼 Zimbabwe", "lang": "en", "ytRegion": "ZW", "region": REGION_AFRICA},
    {"code": "zm", "name": "🇿🇲 Zambia", "lang": "en", "ytRegion": "ZM", "region": REGION_AFRICA},
    {"code": "mw", "name": "🇲🇼 Malawi", "lang": "en", "ytRegion": "MW", "region": REGION_AFRICA},
    {"code": "mz", "name": "🇲🇿 Mozambique", "lang": "pt", "ytRegion": "MZ", "region": REGION_AFRICA},
    {"code": "ls", "name": "🇱🇸 Lesotho", "lang": "en", "ytRegion": "LS", "region": REGION_AFRICA},
    {"code": "sz", "name": "🇸🇿 Eswatini", "lang": "en", "ytRegion": "SZ", "region": REGION_AFRICA},
    {"code": "ao", "name": "🇦🇴 Angola", "lang": "pt", "ytRegion": "AO", "region": REGION_AFRICA},
    {"code": "mg", "name": "🇲🇬 Madagascar", "lang": "fr", "ytRegion": "MG", "region": REGION_AFRICA},
    {"code": "mu", "name": "🇲🇺 Mauritius", "lang": "en", "ytRegion": "MU", "region": REGION_AFRICA},
    {"code": "sc", "name": "🇸🇨 Seychelles", "lang": "en", "ytRegion": "SC", "region": REGION_AFRICA},
    # ── Asia-Pacific (31) ──
    {"code": "kz", "name": "🇰🇿 Kazakhstan", "lang": "kk", "ytRegion": "KZ", "region": REGION_ASIA},
    {"code": "uz", "name": "🇺🇿 Uzbekistan", "lang": "uz", "ytRegion": "UZ", "region": REGION_ASIA},
    {"code": "tm", "name": "🇹🇲 Turkmenistan", "lang": "tk", "ytRegion": "TM", "region": REGION_ASIA},
    {"code": "kg", "name": "🇰🇬 Kyrgyzstan", "lang": "ky", "ytRegion": "KG", "region": REGION_ASIA},
    {"code": "tj", "name": "🇹🇯 Tajikistan", "lang": "tg", "ytRegion": "TJ", "region": REGION_ASIA},
    {"code": "mn", "name": "🇲🇳 Mongolia", "lang": "mn", "ytRegion": "MN", "region": REGION_ASIA},
    {"code": "cn", "name": "🇨🇳 China", "lang": "zh", "ytRegion": "", "region": REGION_ASIA},
    {"code": "tw", "name": "🇹🇼 Taiwan", "lang": "zh", "ytRegion": "TW", "region": REGION_ASIA},
    {"code": "hk", "name": "🇭🇰 Hong Kong", "lang": "zh", "ytRegion": "HK", "region": REGION_ASIA},
    {"code": "mo", "name": "🇲🇴 Macau", "lang": "zh", "ytRegion": "MO", "region": REGION_ASIA},
    {"code": "jp", "name": "🇯🇵 Japan", "lang": "ja", "ytRegion": "JP", "region": REGION_ASIA},
    {"code": "kr", "name": "🇰🇷 South Korea", "lang": "ko", "ytRegion": "KR", "region": REGION_ASIA},
    {"code": "in", "name": "🇮🇳 India", "lang": "hi", "ytRegion": "IN", "region": REGION_ASIA},
    {"code": "pk", "name": "🇵🇰 Pakistan", "lang": "ur", "ytRegion": "PK", "region": REGION_ASIA},
    {"code": "bd", "name": "🇧🇩 Bangladesh", "lang": "bn", "ytRegion": "BD", "region": REGION_ASIA},
    {"code": "bt", "name": "🇧🇹 Bhutan", "lang": "dz", "ytRegion": "BT", "region": REGION_ASIA},
    {"code": "np", "name": "🇳🇵 Nepal", "lang": "ne", "ytRegion": "NP", "region": REGION_ASIA},
    {"code": "lk", "name": "🇱🇰 Sri Lanka", "lang": "si", "ytRegion": "LK", "region": REGION_ASIA},
    {"code": "mv", "name": "🇲🇻 Maldives", "lang": "dv", "ytRegion": "MV", "region": REGION_ASIA},
    {"code": "af", "name": "🇦🇫 Afghanistan", "lang": "fa", "ytRegion": "AF", "region": REGION_ASIA},
    {"code": "mm", "name": "🇲🇲 Myanmar", "lang": "my", "ytRegion": "MM", "region": REGION_ASIA},
    {"code": "th", "name": "🇹🇭 Thailand", "lang": "th", "ytRegion": "TH", "region": REGION_ASIA},
    {"code": "la", "name": "🇱🇦 Laos", "lang": "lo", "ytRegion": "LA", "region": REGION_ASIA},
    {"code": "kh", "name": "🇰🇭 Cambodia", "lang": "km", "ytRegion": "KH", "region": REGION_ASIA},
    {"code": "vn", "name": "🇻🇳 Vietnam", "lang": "vi", "ytRegion": "VN", "region": REGION_ASIA},
    {"code": "my", "name": "🇲🇾 Malaysia", "lang": "ms", "ytRegion": "MY", "region": REGION_ASIA},
    {"code": "sg", "name": "🇸🇬 Singapore", "lang": "en", "ytRegion": "SG", "region": REGION_ASIA},
    {"code": "bn", "name": "🇧🇳 Brunei", "lang": "ms", "ytRegion": "BN", "region": REGION_ASIA},
    {"code": "id", "name": "🇮🇩 Indonesia", "lang": "id", "ytRegion": "ID", "region": REGION_ASIA},
    {"code": "tl", "name": "🇹🇱 Timor-Leste", "lang": "pt", "ytRegion": "TL", "region": REGION_ASIA},
    {"code": "ph", "name": "🇵🇭 Philippines", "lang": "tl", "ytRegion": "PH", "region": REGION_ASIA},
    # ── Oceania (17) ──
    {"code": "au", "name": "🇦🇺 Australia", "lang": "en", "ytRegion": "AU", "region": REGION_OCEANIA},
    {"code": "nz", "name": "🇳🇿 New Zealand", "lang": "en", "ytRegion": "NZ", "region": REGION_OCEANIA},
    {"code": "fj", "name": "🇫🇯 Fiji", "lang": "en", "ytRegion": "FJ", "region": REGION_OCEANIA},
    {"code": "pg", "name": "🇵🇬 Papua New Guinea", "lang": "en", "ytRegion": "PG", "region": REGION_OCEANIA},
    {"code": "sb", "name": "🇸🇧 Solomon Islands", "lang": "en", "ytRegion": "SB", "region": REGION_OCEANIA},
    {"code": "vu", "name": "🇻🇺 Vanuatu", "lang": "en", "ytRegion": "VU", "region": REGION_OCEANIA},
    {"code": "ws", "name": "🇼🇸 Samoa", "lang": "sm", "ytRegion": "WS", "region": REGION_OCEANIA},
    {"code": "to", "name": "🇹🇴 Tonga", "lang": "to", "ytRegion": "TO", "region": REGION_OCEANIA},
    {"code": "ki", "name": "🇰🇮 Kiribati", "lang": "en", "ytRegion": "KI", "region": REGION_OCEANIA},
    {"code": "tv", "name": "🇹🇻 Tuvalu", "lang": "en", "ytRegion": "TV", "region": REGION_OCEANIA},
    {"code": "nr", "name": "🇳🇷 Nauru", "lang": "en", "ytRegion": "NR", "region": REGION_OCEANIA},
    {"code": "pw", "name": "🇵🇼 Palau", "lang": "en", "ytRegion": "PW", "region": REGION_OCEANIA},
    {"code": "fm", "name": "🇫🇲 Micronesia", "lang": "en", "ytRegion": "FM", "region": REGION_OCEANIA},
    {"code": "mh", "name": "🇲🇭 Marshall Islands", "lang": "mh", "ytRegion": "MH", "region": REGION_OCEANIA},
    {"code": "nc", "name": "🇳🇨 New Caledonia", "lang": "fr", "ytRegion": "NC", "region": REGION_OCEANIA},
    {"code": "pf", "name": "🇵🇫 French Polynesia", "lang": "fr", "ytRegion": "PF", "region": REGION_OCEANIA},
    {"code": "gu", "name": "🇬🇺 Guam", "lang": "en", "ytRegion": "GU", "region": REGION_OCEANIA},
]

# ─────────────────────────────────────────────────────────────────────────────
# GLOBAL LANGUAGE COVERAGE — 90+ languages for app-level UI + content-bias
# selection. Each entry: code (ISO 639-1 / YouTube relevanceLanguage),
# English + native names, a region bucket for the picker and an rtl flag.
# `"auto"` = follow the selected country's primary language (default).
# ─────────────────────────────────────────────────────────────────────────────
LANGUAGES = [
    {"code": "auto", "name": "🌐 Auto — follow country", "native": "Auto", "region": "🌐 Auto", "rtl": False},
    {"code": "en", "name": "English", "native": "English", "region": "🌎 Americas & Oceania", "rtl": False},
    {"code": "es", "name": "Spanish", "native": "Español", "region": "🌎 Americas & Oceania", "rtl": False},
    {"code": "pt", "name": "Portuguese", "native": "Português", "region": "🌎 Americas & Oceania", "rtl": False},
    {"code": "fr", "name": "French", "native": "Français", "region": "🌎 Americas & Oceania", "rtl": False},
    {"code": "ht", "name": "Haitian Creole", "native": "Kreyòl Ayisyen", "region": "🌎 Americas & Oceania", "rtl": False},
    {"code": "qu", "name": "Quechua", "native": "Runasimi", "region": "🌎 Americas & Oceania", "rtl": False},
    {"code": "gn", "name": "Guarani", "native": "Avañe'ẽ", "region": "🌎 Americas & Oceania", "rtl": False},
    {"code": "ay", "name": "Aymara", "native": "Aymar aru", "region": "🌎 Americas & Oceania", "rtl": False},
    {"code": "nah", "name": "Nahuatl", "native": "Nāhuatl", "region": "🌎 Americas & Oceania", "rtl": False},
    {"code": "jam", "name": "Jamaican Patois", "native": "Patois", "region": "🌎 Americas & Oceania", "rtl": False},
    {"code": "de", "name": "German", "native": "Deutsch", "region": "🇪🇺 Europe", "rtl": False},
    {"code": "nl", "name": "Dutch", "native": "Nederlands", "region": "🇪🇺 Europe", "rtl": False},
    {"code": "it", "name": "Italian", "native": "Italiano", "region": "🇪🇺 Europe", "rtl": False},
    {"code": "ca", "name": "Catalan", "native": "Català", "region": "🇪🇺 Europe", "rtl": False},
    {"code": "gl", "name": "Galician", "native": "Galego", "region": "🇪🇺 Europe", "rtl": False},
    {"code": "eu", "name": "Basque", "native": "Euskara", "region": "🇪🇺 Europe", "rtl": False},
    {"code": "pl", "name": "Polish", "native": "Polski", "region": "🇪🇺 Europe", "rtl": False},
    {"code": "cs", "name": "Czech", "native": "Čeština", "region": "🇪🇺 Europe", "rtl": False},
    {"code": "sk", "name": "Slovak", "native": "Slovenčina", "region": "🇪🇺 Europe", "rtl": False},
    {"code": "hu", "name": "Hungarian", "native": "Magyar", "region": "🇪🇺 Europe", "rtl": False},
    {"code": "ro", "name": "Romanian", "native": "Română", "region": "🇪🇺 Europe", "rtl": False},
    {"code": "bg", "name": "Bulgarian", "native": "Български", "region": "🇪🇺 Europe", "rtl": False},
    {"code": "el", "name": "Greek", "native": "Ελληνικά", "region": "🇪🇺 Europe", "rtl": False},
    {"code": "sv", "name": "Swedish", "native": "Svenska", "region": "🇪🇺 Europe", "rtl": False},
    {"code": "no", "name": "Norwegian", "native": "Norsk", "region": "🇪🇺 Europe", "rtl": False},
    {"code": "da", "name": "Danish", "native": "Dansk", "region": "🇪🇺 Europe", "rtl": False},
    {"code": "fi", "name": "Finnish", "native": "Suomi", "region": "🇪🇺 Europe", "rtl": False},
    {"code": "is", "name": "Icelandic", "native": "Íslenska", "region": "🇪🇺 Europe", "rtl": False},
    {"code": "et", "name": "Estonian", "native": "Eesti", "region": "🇪🇺 Europe", "rtl": False},
    {"code": "lv", "name": "Latvian", "native": "Latviešu", "region": "🇪🇺 Europe", "rtl": False},
    {"code": "lt", "name": "Lithuanian", "native": "Lietuvių", "region": "🇪🇺 Europe", "rtl": False},
    {"code": "ga", "name": "Irish", "native": "Gaeilge", "region": "🇪🇺 Europe", "rtl": False},
    {"code": "cy", "name": "Welsh", "native": "Cymraeg", "region": "🇪🇺 Europe", "rtl": False},
    {"code": "mt", "name": "Maltese", "native": "Malti", "region": "🇪🇺 Europe", "rtl": False},
    {"code": "lb", "name": "Luxembourgish", "native": "Lëtzebuergesch", "region": "🇪🇺 Europe", "rtl": False},
    {"code": "sl", "name": "Slovenian", "native": "Slovenščina", "region": "🇪🇺 Europe", "rtl": False},
    {"code": "hr", "name": "Croatian", "native": "Hrvatski", "region": "🇪🇺 Europe", "rtl": False},
    {"code": "sr", "name": "Serbian", "native": "Српски", "region": "🇪🇺 Europe", "rtl": False},
    {"code": "bs", "name": "Bosnian", "native": "Bosanski", "region": "🇪🇺 Europe", "rtl": False},
    {"code": "mk", "name": "Macedonian", "native": "Македонски", "region": "🇪🇺 Europe", "rtl": False},
    {"code": "sq", "name": "Albanian", "native": "Shqip", "region": "🇪🇺 Europe", "rtl": False},
    {"code": "uk", "name": "Ukrainian", "native": "Українська", "region": "🇪🇺 Europe", "rtl": False},
    {"code": "be", "name": "Belarusian", "native": "Беларуская", "region": "🇪🇺 Europe", "rtl": False},
    {"code": "ru", "name": "Russian", "native": "Русский", "region": "🇪🇺 Europe", "rtl": False},
    {"code": "ka", "name": "Georgian", "native": "ქართული", "region": "🇪🇺 Europe", "rtl": False},
    {"code": "hy", "name": "Armenian", "native": "Հայերեն", "region": "🇪🇺 Europe", "rtl": False},
    {"code": "az", "name": "Azerbaijani", "native": "Azərbaycan", "region": "🇪🇺 Europe", "rtl": False},
    {"code": "ar", "name": "Arabic", "native": "العربية", "region": "🕌 Middle East & Africa", "rtl": True},
    {"code": "he", "name": "Hebrew", "native": "עברית", "region": "🕌 Middle East & Africa", "rtl": True},
    {"code": "fa", "name": "Persian", "native": "فارسی", "region": "🕌 Middle East & Africa", "rtl": True},
    {"code": "ps", "name": "Pashto", "native": "پښتو", "region": "🕌 Middle East & Africa", "rtl": True},
    {"code": "ku", "name": "Kurdish", "native": "Kurdî", "region": "🕌 Middle East & Africa", "rtl": False},
    {"code": "tr", "name": "Turkish", "native": "Türkçe", "region": "🕌 Middle East & Africa", "rtl": False},
    {"code": "sw", "name": "Swahili", "native": "Kiswahili", "region": "🕌 Middle East & Africa", "rtl": False},
    {"code": "am", "name": "Amharic", "native": "አማርኛ", "region": "🕌 Middle East & Africa", "rtl": False},
    {"code": "ti", "name": "Tigrinya", "native": "ትግርኛ", "region": "🕌 Middle East & Africa", "rtl": False},
    {"code": "so", "name": "Somali", "native": "Soomaali", "region": "🕌 Middle East & Africa", "rtl": False},
    {"code": "ha", "name": "Hausa", "native": "Hausa", "region": "🕌 Middle East & Africa", "rtl": False},
    {"code": "yo", "name": "Yoruba", "native": "Yorùbá", "region": "🕌 Middle East & Africa", "rtl": False},
    {"code": "ig", "name": "Igbo", "native": "Igbo", "region": "🕌 Middle East & Africa", "rtl": False},
    {"code": "zu", "name": "Zulu", "native": "isiZulu", "region": "🕌 Middle East & Africa", "rtl": False},
    {"code": "xh", "name": "Xhosa", "native": "isiXhosa", "region": "🕌 Middle East & Africa", "rtl": False},
    {"code": "af", "name": "Afrikaans", "native": "Afrikaans", "region": "🕌 Middle East & Africa", "rtl": False},
    {"code": "rw", "name": "Kinyarwanda", "native": "Ikinyarwanda", "region": "🕌 Middle East & Africa", "rtl": False},
    {"code": "rn", "name": "Kirundi", "native": "Ikirundi", "region": "🕌 Middle East & Africa", "rtl": False},
    {"code": "hi", "name": "Hindi", "native": "हिन्दी", "region": "🌏 Asia", "rtl": False},
    {"code": "bn", "name": "Bengali", "native": "বাংলা", "region": "🌏 Asia", "rtl": False},
    {"code": "ur", "name": "Urdu", "native": "اردو", "region": "🌏 Asia", "rtl": True},
    {"code": "sd", "name": "Sindhi", "native": "سنڌي", "region": "🌏 Asia", "rtl": True},
    {"code": "ta", "name": "Tamil", "native": "தமிழ்", "region": "🌏 Asia", "rtl": False},
    {"code": "te", "name": "Telugu", "native": "తెలుగు", "region": "🌏 Asia", "rtl": False},
    {"code": "kn", "name": "Kannada", "native": "ಕನ್ನಡ", "region": "🌏 Asia", "rtl": False},
    {"code": "ml", "name": "Malayalam", "native": "മലയാളം", "region": "🌏 Asia", "rtl": False},
    {"code": "mr", "name": "Marathi", "native": "मराठी", "region": "🌏 Asia", "rtl": False},
    {"code": "gu", "name": "Gujarati", "native": "ગુજરાતી", "region": "🌏 Asia", "rtl": False},
    {"code": "pa", "name": "Punjabi", "native": "ਪੰਜਾਬੀ", "region": "🌏 Asia", "rtl": False},
    {"code": "or", "name": "Odia", "native": "ଓଡ଼ିଆ", "region": "🌏 Asia", "rtl": False},
    {"code": "as", "name": "Assamese", "native": "অসমীয়া", "region": "🌏 Asia", "rtl": False},
    {"code": "ne", "name": "Nepali", "native": "नेपाली", "region": "🌏 Asia", "rtl": False},
    {"code": "si", "name": "Sinhala", "native": "සිංහල", "region": "🌏 Asia", "rtl": False},
    {"code": "dv", "name": "Dhivehi", "native": "ދިވެހި", "region": "🌏 Asia", "rtl": True},
    {"code": "dz", "name": "Dzongkha", "native": "རྫོང་ཁ", "region": "🌏 Asia", "rtl": False},
    {"code": "zh", "name": "Chinese (Simplified)", "native": "简体中文", "region": "🌏 Asia", "rtl": False},
    {"code": "zh-Hant", "name": "Chinese (Traditional)", "native": "繁體中文", "region": "🌏 Asia", "rtl": False},
    {"code": "ja", "name": "Japanese", "native": "日本語", "region": "🌏 Asia", "rtl": False},
    {"code": "ko", "name": "Korean", "native": "한국어", "region": "🌏 Asia", "rtl": False},
    {"code": "mn", "name": "Mongolian", "native": "Монгол", "region": "🌏 Asia", "rtl": False},
    {"code": "kk", "name": "Kazakh", "native": "Қазақша", "region": "🌏 Asia", "rtl": False},
    {"code": "ky", "name": "Kyrgyz", "native": "Кыргызча", "region": "🌏 Asia", "rtl": False},
    {"code": "uz", "name": "Uzbek", "native": "O'zbek", "region": "🌏 Asia", "rtl": False},
    {"code": "tk", "name": "Turkmen", "native": "Türkmen", "region": "🌏 Asia", "rtl": False},
    {"code": "tg", "name": "Tajik", "native": "Тоҷикӣ", "region": "🌏 Asia", "rtl": False},
    {"code": "th", "name": "Thai", "native": "ไทย", "region": "🌏 Asia", "rtl": False},
    {"code": "lo", "name": "Lao", "native": "ລາວ", "region": "🌏 Asia", "rtl": False},
    {"code": "km", "name": "Khmer", "native": "ខ្មែរ", "region": "🌏 Asia", "rtl": False},
    {"code": "my", "name": "Burmese", "native": "မြန်မာ", "region": "🌏 Asia", "rtl": False},
    {"code": "vi", "name": "Vietnamese", "native": "Tiếng Việt", "region": "🌏 Asia", "rtl": False},
    {"code": "id", "name": "Indonesian", "native": "Bahasa Indonesia", "region": "🌏 Asia", "rtl": False},
    {"code": "ms", "name": "Malay", "native": "Bahasa Melayu", "region": "🌏 Asia", "rtl": False},
    {"code": "tl", "name": "Filipino", "native": "Tagalog", "region": "🌏 Asia", "rtl": False},
    {"code": "jv", "name": "Javanese", "native": "Basa Jawa", "region": "🌏 Asia", "rtl": False},
    {"code": "su", "name": "Sundanese", "native": "Basa Sunda", "region": "🌏 Asia", "rtl": False},
    {"code": "mi", "name": "Maori", "native": "Te Reo Māori", "region": "🌎 Americas & Oceania", "rtl": False},
    {"code": "sm", "name": "Samoan", "native": "Gagana Samoa", "region": "🌎 Americas & Oceania", "rtl": False},
    {"code": "to", "name": "Tongan", "native": "Lea faka-Tonga", "region": "🌎 Americas & Oceania", "rtl": False},
    {"code": "fj", "name": "Fijian", "native": "Na Vosa Vakaviti", "region": "🌎 Americas & Oceania", "rtl": False},
    {"code": "mh", "name": "Marshallese", "native": "Kajin M̧ajeļ", "region": "🌎 Americas & Oceania", "rtl": False},
    {"code": "eo", "name": "Esperanto", "native": "Esperanto", "region": "🌐 Auto", "rtl": False},
]
LANG_BY_CODE = {l["code"].lower(): l for l in LANGUAGES}
COUNTRY_BY_CODE = {c["code"]: c for c in COUNTRIES}

# Per-country topic keywords appended to search-engine/Tavily queries so public
# indexes surface creators from that market (works keylessly).
_COUNTRY_QUERY_BIAS = {
    "us": "USA american", "in": "India indian hindi", "gb": "UK british",
    "ca": "Canada canadian", "au": "Australia australian", "de": "Deutsch german",
    "fr": "France français", "es": "España español", "br": "Brasil português",
    "jp": "日本 japan", "kr": "한국 korea", "cn": "中国 china",
    "sg": "Singapore", "ae": "Dubai UAE", "sa": "Saudi arabic",
    "nl": "Netherlands dutch", "pk": "Pakistan urdu", "ng": "Nigeria naija",
    "za": "South Africa", "id": "Indonesia", "ph": "Philippines tagalog",
    "mx": "México", "it": "Italia italiano", "tr": "Türkiye türk",
    "ru": "Россия russia", "vn": "Việt nam", "th": "ไทย thailand",
    "my": "Malaysia", "eg": "Egypt مصر",
    "bd": "Bangladesh dhaka", "np": "Nepal", "lk": "Sri Lanka tamil",
    "hk": "Hong Kong 香港", "tw": "Taiwan 台灣", "ar": "Argentina",
    "cl": "Chile", "pe": "Perú", "co": "Colombia",
    "pl": "Polska poland", "ua": "Україна ukraine", "se": "Sverige sweden",
    "ch": "Schweiz switzerland", "at": "Österreich austria", "be": "België belgium",
    "ie": "Ireland", "pt": "Portugal", "gr": "Ελλάδα greece",
    "il": "Israel עברית", "qa": "Qatar", "kw": "Kuwait",
    "ma": "Morocco المغرب", "dz": "Algeria الجزائر", "ke": "Kenya",
    "gh": "Ghana", "tz": "Tanzania", "et": "Ethiopia",
    "uz": "Uzbekistan o'zbek", "kz": "Kazakhstan қазақ", "az": "Azerbaijan",
    "by": "Belarus belarus", "ro": "România romania", "cz": "Česko czech",
    "sk": "Slovensko slovakia", "hu": "Magyarország hungary", "bg": "България bulgaria",
    "rs": "Serbia srbija", "mm": "Myanmar", "kh": "Cambodia", "la": "Laos",
}


def country_info(code):
    """Resolve a country code (any case) to its COUNTRIES entry; global default."""
    return COUNTRY_BY_CODE.get((code or "global").strip().lower(), COUNTRY_BY_CODE["global"])


def _country_bias_terms(code):
    """Query-bias keywords for the given country ("" for worldwide)."""
    return _COUNTRY_QUERY_BIAS.get(country_info(code)["code"], "")


def _lang_info(lang_code, country_code="global"):
    """Resolve an app-level language selection. "auto" (default) follows the
    selected country's primary language; anything else is looked up in the
    LANGUAGES catalog (case-insensitive, supports zh-Hant etc.). Returns the
    resolved language code string ("" = no bias) and its metadata."""
    code = (lang_code or "auto").strip()
    if not code or code.lower() == "auto":
        meta = LANG_BY_CODE.get((country_info(country_code).get("lang") or "").lower())
        return (country_info(country_code).get("lang") or ""), meta or {}
    meta = LANG_BY_CODE.get(code.lower())
    return code, meta or {"code": code, "name": code, "rtl": False}


def video_languages():
    """Language catalog for the app-level language selector."""
    return {"count": len(LANGUAGES), "languages": LANGUAGES, "default": "auto"}


def _bias_for(country_code, lang_override=""):
    """Combined discovery bias: country market keywords + language preference.
    When the user picks a specific language, its English/native names bias the
    query so indexes surface content in that language from any market."""
    bias = _country_bias_terms(country_code)
    _code, meta = _lang_info(lang_override, country_code)
    lnames = " ".join(x for x in (meta.get("name"), meta.get("native")) if x and x != "Auto")
    # Country bias already implies the primary language for most markets; only
    # append language names when they differ from the country default.
    if lnames and _code and _code != country_info(country_code).get("lang"):
        bias = f"{bias} {lnames}".strip()
    return bias


def _tavily_client():
    """Reuse the project's existing Tavily key (same one the LinkedIn live feed
    uses) as the primary indexed-URL source for TikTok/Facebook discovery."""
    global _tavily
    if _tavily is None:
        try:
            from tavily import TavilyClient
            key = (os.environ.get("TAVILY_API_KEY") or "").strip()
            _tavily = TavilyClient(api_key=key) if key else False
        except Exception:  # noqa: BLE001
            _tavily = False
    return _tavily or None


def _tavily_urls(query, max_results=20):
    """Indexed result URLs for a query via Tavily (no captchas, no rate-limit
    drama). Empty list when no key or on failure — callers fall back to
    plain search engines."""
    return [u for u, _t in _tavily_items(query, max_results)]


def _tavily_items_full(query, max_results=20, include_domains=None):
    """Full Tavily results as dicts: url, title AND published_date (when the
    search index exposes it) — the only keyless source of real dates for
    TikTok/Instagram/Facebook video cards."""
    c = _tavily_client()
    if not c:
        return []
    try:
        kw = dict(query=query, search_depth="basic", max_results=max_results,
                  include_answer=False, include_images=False)
        if include_domains:
            kw["include_domains"] = list(include_domains)
        r = c.search(**kw)
        out = []
        for x in r.get("results") or []:
            out.append({
                "url": x.get("url") or "",
                "title": x.get("title") or "",
                "published": x.get("published_date") or "",
            })
        return out
    except Exception:  # noqa: BLE001
        return []


def _iso_date_of(raw_ts):
    """Normalize a Tavily published_date (ISO timestamp or partial) to a clean
    YYYY-MM-DD, or '' when it isn't parseable/credible."""
    if not raw_ts:
        return ""
    m = re.search(r"(\d{4})-(\d{2})-(\d{2})", str(raw_ts))
    if not m:
        return ""
    y, mo, d = int(m.group(1)), int(m.group(2)), int(m.group(3))
    if not (2000 <= y <= 2035 and 1 <= mo <= 12 and 1 <= d <= 31):
        return ""
    try:
        return date(y, mo, d).isoformat()
    except Exception:  # noqa: BLE001
        return ""


def _in_date_range(pub, start=None, end=None):
    """True when `pub` (YYYY-MM-DD) passes the optional inclusive window.
    Undated items always pass — they render last, they aren't dropped."""
    if not start and not end:
        return True
    if not pub:
        return True
    if start and str(pub) < str(start):
        return False
    if end and str(pub) > str(end):
        return False
    return True


def _tiktok_date_of(video_id):
    """TikTok video IDs are snowflakes: the top 32 bits are a Unix timestamp of
    the creation time. Recovers the REAL date keylessly from every video URL."""
    try:
        vid = str(video_id).strip()
        if not vid.isdigit() or len(vid) < 15:
            return ""
        ts = int(vid) >> 32
        dt = datetime.fromtimestamp(ts, tz=timezone.utc)
        return dt.date().isoformat() if 2016 <= dt.year <= 2035 else ""
    except Exception:  # noqa: BLE001
        return ""


_IG_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"


def _instagram_date_of(shortcode):
    """Instagram shortcodes encode the media ID (base64-ish); the top 41 bits
    are milliseconds since Instagram's epoch (2011-01-01). Recovers the REAL
    creation date keylessly from every /reel/<shortcode>/ URL."""
    try:
        code = str(shortcode).strip().replace("/", "")
        if len(code) < 5:
            return ""
        n = 0
        for ch in code:
            i = _IG_ALPHABET.find(ch)
            if i < 0:
                return ""
            n = n * 64 + i
        ms = (n >> 23) + 1314220021721
        dt = datetime.fromtimestamp(ms / 1000, tz=timezone.utc)
        return dt.date().isoformat() if 2012 <= dt.year <= 2035 else ""
    except Exception:  # noqa: BLE001
        return ""


def _views_from_text(text):
    """Parse '2.2K views', '1.3M views', '874 views' out of search-index titles
    (Facebook video pages embed view counts in their indexed titles)."""
    if not text:
        return 0
    m = re.search(r"([\d.,]+)\s*([KMB])?\s*views?", text, flags=re.I)
    if not m:
        return 0
    try:
        n = float(re.sub(r",", "", m.group(1)))
        mult = {"K": 1_000, "M": 1_000_000, "B": 1_000_000_000}.get((m.group(2) or "").upper(), 1)
        return int(n * mult)
    except Exception:  # noqa: BLE001
        return 0


def _tavily_items(query, max_results=20, include_domains=None):
    """Indexed (url, title) pairs via Tavily — titles give readable card labels
    for platforms whose oEmbed needs an app token (Facebook). include_domains
    is more reliable than the site: operator for domain-scoped discovery."""
    return [(_x["url"], _x["title"]) for _x in _tavily_items_full(query, max_results, include_domains)]


def _decode_bing_links(html_text):
    """Extract real target URLs from a Bing results page. Bing wraps links in
    /ck/a redirects with a base64url 'u=a1…' parameter AND html-escapes the
    ampersands (&amp;u=a1…), so the page must be unescaped before matching."""
    text = _html.unescape(html_text or "")
    urls = []
    for u in re.findall(r'[?&]u=a1([A-Za-z0-9_\-]+)', text):
        try:
            pad = u + "=" * (-len(u) % 4)
            urls.append(base64.urlsafe_b64decode(pad).decode("utf-8", "ignore"))
        except Exception:  # noqa: BLE001
            continue
    urls.extend(re.findall(r'https?://(?:www\.|m\.|mobile\.)?(?:tiktok\.com|facebook\.com|instagram\.com|x\.com|twitter\.com|fb\.watch)/[^\s"\'<>&]+', text))
    return urls


_JUNK_URL_MARKERS = (
    "go.microsoft.com", "bing.com/", "support.microsoft.com", "play.google.com",
    "wikipedia.org", "softonic.com", "apple.com/", "microsoft.com", "youtube.com/tiktok",
    "www.x.com/instagram", "m.tiktok.com/signup", "tiktok.com/login", "tiktok.com/en/",
    "instagram.com/instagram", "instagram.com/accounts/emailsignup", "meta.com/instagram",
    "wikiteamwork", "zhihu.com", "fandom.com", "www.youtube.com/tiktok",
)


def _is_junk_url(url):
    low = (url or "").lower()
    return any(m in low for m in _JUNK_URL_MARKERS)


# Per-platform video-post URL patterns (canonical forms).
_PLATFORM_DOMAINS = {
    "tiktok": ("tiktok.com",),
    "instagram": ("instagram.com",),
    "facebook": ("facebook.com", "fb.watch"),
    "x": ("x.com", "twitter.com"),
    "youtube": ("youtube.com", "youtu.be"),
}


def _url_in_platform(url, platform):
    return any(d in (url or "").lower() for d in _PLATFORM_DOMAINS.get(platform, ()))


def _bing_rss_items(query, count=30):
    """Bing's format=rss endpoint — clean XML, no captcha, real organic links
    (works keylessly; Bing's HTML UI is increasingly challenge-gated)."""
    if requests is None:
        return []
    try:
        r = requests.get("https://www.bing.com/search",
                         params={"q": query, "count": count, "setlang": "en", "cc": "us", "format": "rss"},
                         headers={"User-Agent": _UA_BROWSER, "Accept-Language": "en-US,en;q=0.9"}, timeout=15)
        out = []
        if r.status_code == 200 and "<item>" in r.text:
            for m in re.finditer(r"<item>\s*<title>(.*?)</title>\s*<link>(.*?)</link>", r.text, re.S):
                title = _html.unescape(re.sub(r"<[^>]+>", "", m.group(1))).strip()
                link = _html.unescape(m.group(2)).strip()
                if link.lower().startswith("http") and "bing.com:80" not in link.lower():
                    out.append((link, title))
        return out
    except Exception:  # noqa: BLE001
        return []


def _search_engine_items(query, max_engines=3):
    """Rotate keyless engines (Bing RSS → Bing HTML → DuckDuckGo) and return
    (url, title) pairs for a query. Junk like Bing's AI-overview home links is
    filtered out. This is the Tavily-independent fallback used by every
    social-network discoverer."""
    hdrs = {"User-Agent": _UA_BROWSER, "Accept-Language": "en-US,en;q=0.9"}
    out, seen = [], set()

    def add(u, t):
        if not u or not u.lower().startswith("http") or _is_junk_url(u):
            return
        u = u.split("#")[0]
        if u not in seen:
            seen.add(u)
            out.append((u, t))

    engines = [
        ("rss", lambda q: _bing_rss_items(q)),
        ("html", lambda q: None),
        ("ddg", lambda q: None),
    ]
    used_html = False
    used_ddg = False
    for name, fn in engines[:max_engines]:
        if name == "rss":
            for u, t in _bing_rss_items(query):
                add(u, t)
            if out:
                break
        elif name == "html":
            used_html = True
            try:
                r = requests.get("https://www.bing.com/search",
                                 params={"q": query, "count": 30, "setlang": "en", "cc": "us"},
                                 headers=hdrs, timeout=15)
                if r.status_code == 200 and "captcha" not in r.text.lower():
                    for blk in re.findall(r'<li class="b_algo".*?</li>', r.text, re.S):
                        m = re.search(r'<h2[^>]*><a[^>]+href="([^"]+)"[^>]*>(.*?)</a>', blk, re.S)
                        if m:
                            add(m.group(1), _html.unescape(re.sub(r"<[^>]+>", "", m.group(2))).strip())
                    for u in _decode_bing_links(r.text):
                        add(u, "")
                if out:
                    break
            except Exception:  # noqa: BLE001
                pass
        elif name == "ddg":
            used_ddg = True
            try:
                r = requests.get("https://lite.duckduckgo.com/lite/",
                                 params={"q": query}, headers=hdrs, timeout=15)
                if r.status_code == 200 and "<body" in r.text.lower():
                    for m in re.finditer(r'<a[^>]+class="result-link"[^>]+href="([^"]+)"[^>]*>(.*?)</a>', r.text, re.S):
                        u = r.text  # placeholder to avoid unused
                        add(m.group(1).replace("//duckduckgo.com/l/?uddg=", ""), _html.unescape(re.sub(r"<[^>]+>", "", m.group(2))).strip())
            except Exception:  # noqa: BLE001
                pass
        time.sleep(0.4)
    return out


def _search_engine_urls(query, max_engines=3):
    """Back-compat wrapper: (url, title) items → urls only."""
    return [u for u, _t in _search_engine_items(query, max_engines)]


def _harvest_platform_links(platform, queries, max_urls=24):
    """Find real SOCIAL video-post URLs for a platform by issuing several
    keyless search-engine queries (domain-scoped, country-biased) and merging
    the results. Returns {vid: (canonical_url, title, published)}. A Tavily
    key being exhausted never blocks this — engines are the hard fallback."""
    if requests is None:
        return {}
    found = {}
    seen_urls = set()

    def register(url, title="", published=""):
        if _is_junk_url(url) or url in seen_urls:
            return
        seen_urls.add(url)
        if platform == "tiktok":
            m = re.search(r"tiktok\.com/@([\w.\-]+)/video/(\d{15,25})", url) or \
                re.search(r"tiktok\.com/@([\w.\-]+)/photo/(\d{15,25})", url)
            if m:
                canon = f"https://www.tiktok.com/@{m.group(1)}/video/{m.group(2)}" if "/video/" in url \
                        else f"https://www.tiktok.com/@{m.group(1)}/photo/{m.group(2)}"
                found[m.group(2)] = (canon, title, published)
        elif platform == "instagram":
            m = re.search(r"instagram\.com/(?:reel|reels|p|tv)/([\w-]{5,20})", url)
            if m:
                found[m.group(1)] = (url.split("?")[0], title, published)
        elif platform == "facebook":
            m = (re.search(r"facebook\.com/([\w.\-]+)/videos/(?:[\w\-]+/)?(\d{6,20})", url)
                 or re.search(r"facebook\.com/reel/(\d{6,20})", url)
                 or re.search(r"facebook\.com/watch/?\?v=(\d{6,20})", url)
                 or re.search(r"facebook\.com/([\w.\-]+)/reels/([\w\-]{6,30})", url)
                 or re.search(r"fb\.watch/([\w]+)", url))
            if m:
                groups = m.groups()
                if "/videos/" in url and len(groups) >= 2 and str(groups[1]).isdigit():
                    vid, canon = groups[1], f"https://www.facebook.com/{groups[0]}/videos/{groups[1]}"
                else:
                    vid = groups[-1]
                    canon = url.split("&")[0]
                if vid:
                    found[str(vid)] = (canon, title, published)
        elif platform == "x":
            m = re.search(r"(?:x\.com|twitter\.com)/[A-Za-z0-9_]+/status/(\d+)", url)
            if m:
                text = url.split("?")[0]
                found[m.group(1)] = (text, title, published)

    for q in queries:
        if q:
            items = _search_engine_items(q, max_engines=2)
            if not items:
                continue
            for url, title in items:
                register(url, title)
            if len(found) >= max_urls:
                break
        time.sleep(0.4)
    # Trim to max_urls keeping the list deterministic (insertion order).
    trimmed = {}
    for k, v in found.items():
        trimmed[k] = v
        if len(trimmed) >= max_urls:
            break
    return trimmed


# ─────────────────────────────────────────────────────────────────────────────
# Evergreen seed cache — every successful social discovery is persisted to
# exports/video_seed_cache.json keyed by platform+country, so a later fetch
# that gets rate-limited ALWAYS still returns real, working video cards.
# ─────────────────────────────────────────────────────────────────────────────
_SOCIAL_SEED_FILE = os.path.join(_EXPORT_DIR, "video_seed_cache.json")
_seed_lock = threading.Lock()


def _seed_load():
    try:
        with open(_SOCIAL_SEED_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:  # noqa: BLE001
        return {}


def _seed_save(data):
    try:
        with open(_SOCIAL_SEED_FILE, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=1)
    except Exception:  # noqa: BLE001
        pass


def _seed_update(platform, country, items, max_keep=60):
    """Persist successful live items so rate-limited fetches still return them."""
    if not items or not platform:
        return
    with _seed_lock:
        data = _seed_load()
        code = country_info(country)["code"]
        bucket = data.setdefault(platform, {}).setdefault(code, [])
        seen = {b.get("url") for b in bucket}
        for it in items:
            if it.get("url") and it["url"] not in seen:
                seen.add(it["url"])
                bucket.append(it)
        tail = bucket[-max_keep:]
        data[platform][code] = tail
        _seed_save(data)


def _seed_fallback(platform, country, max_items=18, tag=None):
    """Return previously-discovered real videos for platform+country. Zero cost,
    always real URLs (they were live when discovered), via official embeds."""
    with _seed_lock:
        data = _seed_load()
    bucket = (data.get(platform) or {}).get(country_info(country)["code"], [])
    if tag:
        bucket = [it for it in bucket if not tag or (it.get("topic") or "") == tag]
        if not bucket:
            bucket = (data.get(platform) or {}).get(country_info(country)["code"], [])
    return bucket[:max(1, min(int(max_items or 18), len(bucket)))]


def _tt_oembed(video_url):
    """TikTok's official oEmbed API — public, keyless: title, author, thumbnail."""
    if requests is None:
        return {}
    try:
        r = requests.get("https://www.tiktok.com/oembed", params={"url": video_url},
                         headers={"User-Agent": _UA_BROWSER}, timeout=12)
        if r.status_code == 200:
            return r.json() or {}
    except Exception:  # noqa: BLE001
        pass
    return {}


def discover_tiktok(tag="ai", max_results=18, start=None, end=None, country=None, lang=""):
    """Real TikTok discovery without login/API key:
    search engines index TikTok video pages — DuckDuckGo HTML search surfaces
    real /@user/video/ID links for the topic, then TikTok's official oEmbed API
    enriches each with title, author and thumbnail. Videos play in-app through
    TikTok's official embed. country biases the indexed search to that market."""
    tag = re.sub(r"[^a-z0-9]", "", (tag or "ai").lower()) or "ai"
    ci = country_info(country)
    bias = _bias_for(country, lang)
    cache_key = f"tt:{tag}:{ci['code']}:{(lang or 'auto').lower()}"
    with _yt_fb_lock:
        cached = _tt_ddg_cache.get(cache_key)
        if cached and time.time() - cached["fetchedAt"] < 30 * 60:
            kept = [it for it in cached["result"]["items"] if _in_date_range(it.get("published"), start, end)]
            return {**cached["result"], "count": len(kept), "items": kept[:max_results]}

    if requests is None:
        return {"tag": tag, "count": 0, "items": [], "error": "requests not installed"}

    # ── Step 1: find real TikTok video URLs (Tavily first, engines fallback) ──
    # Country + language bias: append market keywords so indexes surface that
    # country's creators and the chosen language's content.
    found = {}  # videoId -> (canonical url, harvested title, harvested published)
    search_items = _tavily_items_full(f"{tag} tutorial video {bias}".strip(), 24, include_domains=["tiktok.com"])
    if not search_items:
        # Tavily key exhausted / rate-limited — engines take over with the same
        # domain-scoped query (site: operator, topic + country bias).
        time.sleep(1.2)
        search_items = _tavily_items_full(f"{tag} tutorial explained {bias}".strip(), 24, include_domains=["tiktok.com"])
    if not search_items:
        for q in (f"site:tiktok.com {tag} tutorial video", f"site:tiktok.com {tag} explained"):
            search_items.extend(_tavily_items_full(q, 20))
            if len(search_items) >= 20:
                break
    for entry in search_items:
        url, title = entry.get("url", ""), entry.get("title", "")
        m = re.search(r"tiktok\.com/@([\w.\-]+)/video/(\d{15,25})", url)
        if m:
            found[m.group(2)] = (url.split("&")[0], title, _iso_date_of(entry.get("published")))
        if len(found) >= 24:
            break
    # Engine fallback with several query variants (with + without country bias).
    engine_queries = list(dict.fromkeys([
        f"{tag} tutorial video {bias} site:tiktok.com",
        f"{tag} tutorial video site:tiktok.com",
        f"tiktok {tag} tutorial {bias}",
        f"site:tiktok.com/@ {tag} {bias}",
    ]))
    _found = _harvest_platform_links("tiktok", [q.strip() for q in engine_queries], max_urls=24)
    for vid, (url, title, pub) in _found.items():
        found.setdefault(vid, (url, title, pub))

    if not found:
        # Fall back to the evergreen seed cache for this platform+country so
        # the tab ALWAYS shows real videos even while indexes rate-limit.
        seeds = _seed_fallback("tiktok", country, max_items=max_results, tag=tag)
        if seeds:
            kept = [it for it in seeds if _in_date_range(it.get("published"), start, end)]
            seed_res = {"tag": tag, "count": len(kept), "items": kept[:max_results],
                        "source": "tiktok-oembed-seeds",
                        "error": "" if kept else "No TikTok videos in this date range yet — try a wider range or Refresh."}
            return seed_res
        # Do NOT cache empties for long — engines rate-limit briefly; a retry
        # a couple of minutes later usually succeeds.
        with _yt_fb_lock:
            _tt_ddg_cache[cache_key] = {"result": {"tag": tag, "count": 0, "items": [], "source": "tiktok-oembed", "error": ""},
                                        "fetchedAt": time.time() - 1740}  # expires in 1 min
        return {"tag": tag, "count": 0, "items": [], "source": "tiktok-oembed",
                "error": "Search engines are rate-limiting TikTok lookups right now — hit Refresh in a minute."}

    # ── Step 2: enrich via TikTok's official oEmbed (concurrent) ──
    vids = list(found.items())[:max(6, min(max_results, 40))]

    def _pub_sort_key(kv):
        # Real decoded dates first (newest first), snowflake-decoded IDs win.
        _vid, (_u, _h, _pub) = kv
        return _tiktok_date_of(_vid) or _pub or ""

    def build(kv):
        vid, (url, harvested, pub) = kv
        meta = _tt_oembed(url)
        title = (meta.get("title") or harvested or f"TikTok {tag} video")[:160]
        author = meta.get("author_name") or (url.split("/@")[1].split("/")[0] if "/@" in url else "tiktok")
        return {
            "id": f"tt-{vid}", "videoId": vid, "platform": "tiktok",
            "title": title, "channel": author,
            "published": pub or _tiktok_date_of(vid), "description": "",
            "durationSec": 0, "isShort": True,
            "thumbnail": meta.get("thumbnail_url") or "",
            "url": url, "embedUrl": f"https://www.tiktok.com/embed/v2/{vid}",
            "views": 0, "likes": 0,
            "topic": tag, "topicLabel": f"#{tag}", "kind": "short",
        }

    with ThreadPoolExecutor(max_workers=6) as pool:
        items = list(pool.map(build, vids))
    items = [it for it in items if it["thumbnail"]] or items  # prefer ones with covers
    items = [it for it in items if _in_date_range(it.get("published"), start, end)]
    _seed_update("tiktok", country, items)
    result = {"tag": tag, "count": len(items), "items": items, "source": "tiktok-oembed", "error": ""}
    with _yt_fb_lock:
        _tt_ddg_cache[cache_key] = {"result": result, "fetchedAt": time.time()}
    items = _sort_latest_first(items)
    return {**result, "items": items[:max_results]}


def discover_facebook(tag="ai", max_results=18, start=None, end=None, country=None, lang=""):
    """Real Facebook video discovery without login/API key:
    Bing indexes public Facebook videos/reels/watch links — harvest them for
    the topic, then enrich via Facebook's official oEmbed API (public, no
    auth). Videos play in-app through Facebook's official plugin player.
    country biases the indexed search to that market; lang to that language."""
    tag = re.sub(r"[^a-z0-9]", "", (tag or "ai").lower()) or "ai"
    bias = _bias_for(country, lang)
    cache_key = f"fb:{tag}:{country_info(country)['code']}:{(lang or 'auto').lower()}"
    # (latest-first sorting applied to the final item list below)
    with _yt_fb_lock:
        cached = _tt_ddg_cache.get(cache_key)
        if cached and time.time() - cached["fetchedAt"] < 30 * 60:
            kept = [it for it in cached["result"]["items"] if _in_date_range(it.get("published"), start, end)]
            return {**cached["result"], "count": len(kept), "items": kept[:max_results]}

    if requests is None:
        return {"tag": tag, "count": 0, "items": [], "error": "requests not installed"}

    # ── Step 1: harvest public Facebook video URLs (Tavily → engines) ──
    found = {}  # videoId -> (canonical url, harvested title, harvested published)
    search_items = []
    for q in (f"site:facebook.com {tag} tutorial video {bias}".strip(),
              f"site:facebook.com {tag} explained reel OR watch {bias}".strip()):
        search_items.extend(_tavily_items_full(q, 20))
        if len(search_items) >= 20:
            break
    for entry in search_items:
        url, harvested_title = entry.get("url", ""), entry.get("title", "")
        m = (re.search(r"facebook\.com/([\w.\-]+)/videos/(?:[\w\-]+/)?(\d{6,20})", url)
             or re.search(r"facebook\.com/reel/(\d{6,20})", url)
             or re.search(r"facebook\.com/watch/?\?v=(\d{6,20})", url)
             or re.search(r"facebook\.com/([\w.\-]+)/reels/([\w\-]{6,30})", url))
        if not m:
            continue
        groups = m.groups()
        if "/videos/" in url and len(groups) >= 2 and str(groups[1]).isdigit():
            vid = groups[1]
            canonical = f"https://www.facebook.com/{groups[0]}/videos/{vid}"
        else:
            vid = groups[-1]
            canonical = url.split("&")[0]
        if not vid or not canonical.startswith("http"):
            continue
        found[str(vid)] = (canonical, harvested_title, _iso_date_of(entry.get("published")))
        if len(found) >= 24:
            break
    # Engine fallback (Tavily key exhausted / site: blocked) — bing + ddg queries
    # scoped to facebook.com and fb.watch, with and without country bias.
    engine_queries = (f"{tag} tutorial video {bias} site:facebook.com",
                      f"{tag} explained reel OR watch {bias} site:facebook.com",
                      f"facebook {tag} video tutorial {bias}",
                      f"fb.watch {tag} {bias}")
    _found = _harvest_platform_links("facebook", list(dict.fromkeys(q for q in engine_queries)), max_urls=24)
    for vid, (url, title, pub) in _found.items():
        found.setdefault(vid, (url, title, pub))

    if not found:
        seeds = _seed_fallback("facebook", country, max_items=max_results, tag=tag)
        if seeds:
            kept = [it for it in seeds if _in_date_range(it.get("published"), start, end)]
            return {"tag": tag, "count": len(kept), "items": kept[:max_results],
                    "source": "facebook-oembed-seeds",
                    "error": "" if kept else "No Facebook videos in this date range yet — try a wider range or Refresh."}
        with _yt_fb_lock:
            _tt_ddg_cache[cache_key] = {"result": {"tag": tag, "count": 0, "items": [], "source": "facebook-oembed", "error": ""},
                                        "fetchedAt": time.time() - 1740}  # expires in 1 min
        return {"tag": tag, "count": 0, "items": [], "source": "facebook-oembed",
                "error": "No public Facebook videos indexed right now — hit Refresh in a minute or paste any FB video URL above."}

    # ── Step 2: enrich via Facebook's official oEmbed (concurrent) ──
    def fb_oembed(video_url):
        try:
            r = requests.get("https://www.facebook.com/plugins/oembed.json",
                             params={"url": video_url},
                             headers={"User-Agent": _UA_BROWSER}, timeout=12)
            if r.status_code == 200:
                return r.json() or {}
        except Exception:  # noqa: BLE001
            pass
        return {}

    vids = list(found.items())[:max(6, min(max_results, 40))]

    def build(kv):
        vid, (url, harvested, pub) = kv
        meta = fb_oembed(url)
        author = meta.get("author_name") or "Facebook"
        clean = re.sub(r"^[\d.,]+[KMB]?\s*(?:views?|shares?|reactions?)[^|]*\|\s*", "", harvested or "", flags=re.I).strip()
        return {
            "id": f"fb-{vid}", "videoId": vid, "platform": "facebook",
            "title": (meta.get("title") or clean or f"Facebook {tag} video")[:160],
            "channel": author,
            "published": pub, "description": "",
            "durationSec": 0, "isShort": False,
            "thumbnail": meta.get("thumbnail_url") or "",
            "url": url,
            "embedUrl": "https://www.facebook.com/plugins/video.php?href=" + requests.utils.quote(url, safe=""),
            "views": _views_from_text(harvested), "likes": 0,
            "topic": tag, "topicLabel": f"#{tag}", "kind": "long",
        }

    with ThreadPoolExecutor(max_workers=6) as pool:
        items = list(pool.map(build, vids))
    items = [it for it in items if _in_date_range(it.get("published"), start, end)]
    _seed_update("facebook", country, items)
    result = {"tag": tag, "count": len(items), "items": items, "source": "facebook-oembed", "error": ""}
    with _yt_fb_lock:
        _tt_ddg_cache[cache_key] = {"result": result, "fetchedAt": time.time()}
    items = _sort_latest_first(items)
    return {**result, "items": items[:max_results]}


# ─────────────────────────────────────────────────────────────────────────────
def _sort_latest_first(items):
    """Robust latest-first ordering for any network's item list — dated items
    newest→oldest, then shorts (freshest content type), then undated last."""
    def key(it):
        pub = it.get("published") or ""
        return ("1" if pub else "0", pub, "1" if it.get("isShort") else "0")
    return sorted(items or [], key=key, reverse=True)


def discover_instagram(tag="ai", max_results=18, start=None, end=None, country=None, lang=""):
    """Real Instagram Reels discovery without login/API key:
    Tavily indexes public instagram.com/reel/<id> pages (with titles), then
    each reel plays in-app through Instagram's OFFICIAL /embed player —
    no auth, no scraping of protected endpoints. country biases the indexed
    search to that market; lang to that language."""
    tag = re.sub(r"[^a-z0-9]", "", (tag or "ai").lower()) or "ai"
    bias = _bias_for(country, lang)
    cache_key = f"ig:{tag}:{country_info(country)['code']}:{(lang or 'auto').lower()}"
    with _yt_fb_lock:
        cached = _tt_ddg_cache.get(cache_key)
        if cached and time.time() - cached["fetchedAt"] < 30 * 60:
            kept = [it for it in cached["result"]["items"] if _in_date_range(it.get("published"), start, end)]
            return {**cached["result"], "count": len(kept), "items": kept[:max_results]}

    if requests is None:
        return {"tag": tag, "count": 0, "items": [], "error": "requests not installed"}

    # ── Step 1: find public /reel/<id> URLs (Tavily first, engines fallback) ──
    found = {}  # shortcode -> (canonical url, harvested title, harvested published)
    search_items = _tavily_items_full(f"{tag} tutorial reel {bias}".strip(), 24, include_domains=["instagram.com"])
    if not search_items:
        time.sleep(2.5)
        search_items = _tavily_items_full(f"{tag} explained reel {bias}".strip(), 24, include_domains=["instagram.com"])
    if not search_items:
        for q in (f"site:instagram.com {tag} reel tutorial {bias}".strip(), f"site:instagram.com {tag} tips reel {bias}".strip()):
            search_items.extend(_tavily_items_full(q, 20))
            if len(search_items) >= 20:
                break
    rx = re.compile(r"instagram\.com/(?:reel|reels|p)/([\w-]{5,20})")
    for entry in search_items:
        url, title = entry.get("url", ""), entry.get("title", "")
        m = rx.search(url)
        if m:
            found[m.group(1)] = (url.split("?")[0], title, _iso_date_of(entry.get("published")))
        if len(found) >= 24:
            break
    # Engine fallback (Tavily exhausted / family diagrams blocked) — scoped
    # queries that surface public /reel/<id>, /reels/ and /p/ URLs.
    engine_queries = (f"{tag} tutorial reel {bias} site:instagram.com",
                      f"{tag} tips reel {bias} site:instagram.com",
                      f"instagram reel {tag} tutorial {bias}",
                      f"instagram.com/reel {tag} {bias}")
    _found = _harvest_platform_links("instagram", list(dict.fromkeys(q for q in engine_queries)), max_urls=24)
    for shortcode, (url, title, pub) in _found.items():
        found.setdefault(shortcode, (url, title, pub))

    if not found:
        seeds = _seed_fallback("instagram", country, max_items=max_results, tag=tag)
        if seeds:
            kept = [it for it in seeds if _in_date_range(it.get("published"), start, end)]
            return {"tag": tag, "count": len(kept), "items": kept[:max_results],
                    "source": "instagram-embed-seeds",
                    "error": "" if kept else "No Instagram reels in this date range yet — try a wider range or Refresh."}
        with _yt_fb_lock:
            _tt_ddg_cache[cache_key] = {"result": {"tag": tag, "count": 0, "items": [], "source": "instagram-embed", "error": ""},
                                        "fetchedAt": time.time() - 1740}
        return {"tag": tag, "count": 0, "items": [], "source": "instagram-embed",
                "error": "No public Instagram reels indexed right now — hit Refresh in a minute or paste any reel URL above."}

    # ── Step 2: build cards (official embed player, harvested titles) ──
    # Thumbnails can't be fetched keylessly (login wall), so cards use the
    # platform-icon fallback tile.
    vids = list(found.items())[:max(6, min(max_results, 40))]
    items = []
    for shortcode, (url, harvested, pub) in vids:
        clean = re.sub(r"^\s*(?:Reel|Reels|Video|Post)\s*[·|:\-]\s*", "", harvested or "", flags=re.I).strip()
        items.append({
            "id": f"ig-{shortcode}", "videoId": shortcode, "platform": "instagram",
            "title": (clean or f"Instagram {tag} reel")[:160],
            "channel": "Instagram creator",
            "published": pub or _instagram_date_of(shortcode), "description": "",
            "durationSec": 0, "isShort": True,
            "thumbnail": "",  # login-walled keylessly — card shows platform tile
            "url": url,
            "embedUrl": f"https://www.instagram.com/reel/{shortcode}/embed",
            "views": _views_from_text(harvested), "likes": 0,
            "topic": tag, "topicLabel": f"#{tag}", "kind": "short",
        })
    items = [it for it in items if _in_date_range(it.get("published"), start, end)]
    _seed_update("instagram", country, items)
    result = {"tag": tag, "count": len(items), "items": items, "source": "instagram-embed", "error": ""}
    with _yt_fb_lock:
        _tt_ddg_cache[cache_key] = {"result": result, "fetchedAt": time.time()}
    items = _sort_latest_first(items)
    return {**result, "items": items[:max_results]}


def _x_oembed(status_url):
    """X/Twitter official oEmbed — public, keyless: author, title, thumbnail."""
    if requests is None:
        return {}
    try:
        r = requests.get("https://publish.twitter.com/oembed",
                         params={"url": status_url, "omit_script": "true", "hide_thread": "true"},
                         headers={"User-Agent": _UA_BROWSER}, timeout=12)
        if r.status_code == 200:
            j = r.json() or {}
            author = (j.get("author_name") or "").strip()
            return {
                "author_name": author.lstrip("@") or "",
                "title": re.sub(r"<[^>]+>", " ", (j.get("html") or "")) or (j.get("title") or ""),
                "thumbnail_url": j.get("thumbnail_url") or "",
                "author_url": j.get("author_url") or "",
            }
    except Exception:  # noqa: BLE001
        pass
    return {}


def discover_x(tag="ai", max_results=18, start=None, end=None, country=None, lang=""):
    """Real X (Twitter) video discovery without login/API key:
    public search indexes surface x.com/twitter.com status pages for the topic
    (country/language-biased like every other network), then X's official oEmbed API
    enriches each with the author, handle and thumbnail. Videos play in-app
    through X's official /status page ID embedded player."""
    tag = re.sub(r"[^a-z0-9]", "", (tag or "ai").lower()) or "ai"
    ci = country_info(country)
    bias = _bias_for(country, lang)
    cache_key = f"x:{tag}:{ci['code']}:{(lang or 'auto').lower()}"
    with _yt_fb_lock:
        cached = _tt_ddg_cache.get(cache_key)
        if cached and time.time() - cached["fetchedAt"] < 30 * 60:
            kept = [it for it in cached["result"]["items"] if _in_date_range(it.get("published"), start, end)]
            return {**cached["result"], "count": len(kept), "items": kept[:max_results]}

    if requests is None:
        return {"tag": tag, "count": 0, "items": [], "error": "requests not installed"}

    # ── Step 1: find real X/Twitter status URLs (Tavily first, engines fallback) ──
    found = {}  # status_id -> (canonical url, harvested title, harvested published)
    search_items = _tavily_items_full(f"{tag} tutorial video {bias}".strip(), 24,
                                      include_domains=["x.com", "twitter.com"])
    if not search_items:
        time.sleep(1.5)
        search_items = _tavily_items_full(f"{tag} explained video {bias}".strip(), 20,
                                          include_domains=["x.com", "twitter.com"])
    for entry in search_items:
        url, title = entry.get("url", ""), entry.get("title", "")
        m = re.search(r"(?:x\.com|twitter\.com)/[A-Za-z0-9_]+/status/(\d+)", url)
        if m:
            found[m.group(1)] = (url.split("?")[0], title, _iso_date_of(entry.get("published")))
        if len(found) >= 24:
            break
    engine_queries = (f"{tag} tutorial video {bias} x.com",
                      f"{tag} tutorial video {bias} twitter.com",
                      f"site:x.com {tag} video {bias}",
                      f"site:twitter.com {tag} video {bias}")
    _found = _harvest_platform_links("x", list(dict.fromkeys(q for q in engine_queries)), max_urls=24)
    for vid, (url, title, pub) in _found.items():
        found.setdefault(vid, (url, title, pub))

    if not found:
        seeds = _seed_fallback("x", country, max_items=max_results, tag=tag)
        if seeds:
            kept = [it for it in seeds if _in_date_range(it.get("published"), start, end)]
            return {"tag": tag, "count": len(kept), "items": kept[:max_results],
                    "source": "x-oembed-seeds",
                    "error": "" if kept else "No X videos in this date range yet — try a wider range or Refresh."}
        with _yt_fb_lock:
            _tt_ddg_cache[cache_key] = {"result": {"tag": tag, "count": 0, "items": [], "source": "x-oembed", "error": ""},
                                        "fetchedAt": time.time() - 1740}
        return {"tag": tag, "count": 0, "items": [], "source": "x-oembed",
                "error": "No public X/Twitter video posts indexed right now — hit Refresh in a minute or paste any post URL above."}

    # ── Step 2: enrich via X's official oEmbed (concurrent) ──
    vids = list(found.items())[:max(6, min(max_results, 40))]

    def build(kv):
        vid, (url, harvested, pub) = kv
        meta = _x_oembed(url)
        title = (meta.get("title") or harvested or f"X {tag} video").strip()[:160]
        author = meta.get("author_name") or (url.split("/")[3] if len(url.split("/")) > 3 else "X creator")
        return {
            "id": f"x-{vid}", "videoId": vid, "platform": "x",
            "title": f"@{(author or 'x').lower()} — {title}",
            "channel": "@" + (author or "x"),
            "published": pub, "description": "",
            "durationSec": 0, "isShort": True,
            "thumbnail": meta.get("thumbnail_url") or "",
            "url": url,
            "embedUrl": f"https://platform.twitter.com/embed/Tweet.html?id={vid}",
            "views": 0, "likes": 0,
            "topic": tag, "topicLabel": f"#{tag}", "kind": "short",
        }

    with ThreadPoolExecutor(max_workers=6) as pool:
        items = list(pool.map(build, vids))
    items = [it for it in items if _in_date_range(it.get("published"), start, end)]
    _seed_update("x", country, items)
    result = {"tag": tag, "count": len(items), "items": items, "source": "x-oembed", "error": ""}
    with _yt_fb_lock:
        _tt_ddg_cache[cache_key] = {"result": result, "fetchedAt": time.time()}
    items = _sort_latest_first(items)
    return {**result, "items": items[:max_results]}


# ALL NETWORKS: fan out X/TikTok/Instagram/Facebook across every tech-stack topic
# (YouTube's all-topics fan-out is discover_all_youtube above) and a combined
# multi-network loader used by the Video Hub's "Load ALL networks" button.
# ─────────────────────────────────────────────────────────────────────────────

def discover_all_tiktok(max_results=120, per_topic=6, start=None, end=None, country=None, lang=""):
    """Fetch TikTok videos for EVERY tech-stack topic in parallel and merge."""
    def run(t):
        try:
            r = discover_tiktok(tag=t[0], max_results=per_topic, start=start, end=end, country=country, lang=lang)
            return r.get("items") or []
        except Exception:  # noqa: BLE001
            return []

    merged = []
    with ThreadPoolExecutor(max_workers=5) as pool:
        for items in pool.map(run, VIDEO_TOPICS):
            merged.extend(items)

    seen, uniq = set(), []
    for it in merged:
        vid = it.get("videoId")
        if vid and vid not in seen:
            seen.add(vid)
            uniq.append(it)
    uniq = uniq[:max(1, min(max_results, 300))]
    return {
        "tag": "all", "count": len(uniq), "items": uniq,
        "source": "tiktok-oembed-multi",
        "error": f"Loaded {len(uniq)} TikTok videos across all {len(VIDEO_TOPICS)} topics." if uniq
                 else "No TikTok videos found right now — public indexes are busy; try Refresh.",
    }


def discover_all_x(max_results=120, per_topic=6, start=None, end=None, country=None, lang=""):
    """Fetch X/Twitter video posts for EVERY tech-stack topic in parallel."""
    def run(t):
        try:
            r = discover_x(tag=t[0], max_results=per_topic, start=start, end=end, country=country, lang=lang)
            return r.get("items") or []
        except Exception:  # noqa: BLE001
            return []

    merged = []
    with ThreadPoolExecutor(max_workers=5) as pool:
        for items in pool.map(run, VIDEO_TOPICS):
            merged.extend(items)

    seen, uniq = set(), []
    for it in merged:
        vid = it.get("videoId")
        if vid and vid not in seen:
            seen.add(vid)
            uniq.append(it)
    uniq = uniq[:max(1, min(max_results, 300))]
    return {
        "tag": "all", "count": len(uniq), "items": uniq,
        "source": "x-oembed-multi",
        "error": f"Loaded {len(uniq)} X videos across all {len(VIDEO_TOPICS)} topics." if uniq
                 else "No public X video posts indexed right now — try Refresh.",
    }


def discover_all_facebook(max_results=120, per_topic=6, start=None, end=None, country=None, lang=""):
    """Fetch public Facebook videos for EVERY tech-stack topic in parallel."""
    def run(t):
        try:
            r = discover_facebook(tag=t[0], max_results=per_topic, start=start, end=end, country=country, lang=lang)
            return r.get("items") or []
        except Exception:  # noqa: BLE001
            return []
    merged = []
    with ThreadPoolExecutor(max_workers=5) as pool:
        for items in pool.map(run, VIDEO_TOPICS):
            merged.extend(items)

    seen, uniq = set(), []
    for it in merged:
        vid = it.get("videoId")
        if vid and vid not in seen:
            seen.add(vid)
            uniq.append(it)
    uniq = uniq[:max(1, min(max_results, 300))]
    return {
        "tag": "all", "count": len(uniq), "items": uniq,
        "source": "facebook-oembed-multi",
        "error": f"Loaded {len(uniq)} Facebook videos across all {len(VIDEO_TOPICS)} topics." if uniq
                 else "No public Facebook videos indexed right now — try Refresh.",
    }


def discover_all_instagram(max_results=120, per_topic=6, start=None, end=None, country=None, lang=""):
    """Fetch Instagram reels for EVERY tech-stack topic in parallel."""
    def run(t):
        try:
            r = discover_instagram(tag=t[0], max_results=per_topic, start=start, end=end, country=country, lang=lang)
            return r.get("items") or []
        except Exception:  # noqa: BLE001
            return []

    merged = []
    with ThreadPoolExecutor(max_workers=5) as pool:
        for items in pool.map(run, VIDEO_TOPICS):
            merged.extend(items)

    seen, uniq = set(), []
    for it in merged:
        vid = it.get("videoId")
        if vid and vid not in seen:
            seen.add(vid)
            uniq.append(it)
    uniq = uniq[:max(1, min(max_results, 300))]
    return {
        "tag": "all", "count": len(uniq), "items": uniq,
        "source": "instagram-embed-multi",
        "error": f"Loaded {len(uniq)} Instagram reels across all {len(VIDEO_TOPICS)} topics." if uniq
                 else "No public Instagram reels indexed right now — try Refresh.",
    }


def discover_all_networks(max_per_network=120, per_topic=6, start=None, end=None, country=None, lang=""):
    """One call → YouTube + X + TikTok + Instagram + Facebook all-topics
    fan-outs, merged into a single date-aware multi-platform feed, biased to
    `country` and `lang`."""
    t0 = time.time()
    yt = discover_all_youtube(max_results=max_per_network, kind="all", per_topic=per_topic, start=start, end=end, country=country, lang=lang)
    xx = discover_all_x(max_results=max_per_network, per_topic=max(3, per_topic - 2), start=start, end=end, country=country, lang=lang)
    tt = discover_all_tiktok(max_results=max_per_network, per_topic=max(3, per_topic - 2), start=start, end=end, country=country, lang=lang)
    ig = discover_all_instagram(max_results=max_per_network, per_topic=max(3, per_topic - 2), start=start, end=end, country=country, lang=lang)
    fb = discover_all_facebook(max_results=max_per_network, per_topic=max(3, per_topic - 2), start=start, end=end, country=country, lang=lang)

    items = ((yt.get("items") or []) + (xx.get("items") or []) + (tt.get("items") or []) +
             (ig.get("items") or []) + (fb.get("items") or []))
    seen, uniq = set(), []
    for it in items:
        key = (it.get("platform"), it.get("videoId"))
        if key[1] and key not in seen:
            seen.add(key)
            uniq.append(it)
    uniq.sort(key=lambda it: ("1" if it.get("published") else "0",
                              it.get("published") or ""), reverse=True)
    uniq = uniq[:max(1, max_per_network * 5)]

    networks = {
        "youtube": len(yt.get("items") or []),
        "x": len(xx.get("items") or []),
        "tiktok": len(tt.get("items") or []),
        "instagram": len(ig.get("items") or []),
        "facebook": len(fb.get("items") or []),
    }
    return {
        "count": len(uniq), "items": uniq, "networks": networks,
        "source": "multi-network",
        "country": country_info(country)["code"],
        "elapsedMs": int((time.time() - t0) * 1000),
        "error": (f"Loaded {len(uniq)} videos — YouTube {networks['youtube']}, "
                  f"X {networks['x']}, TikTok {networks['tiktok']}, "
                  f"Instagram {networks['instagram']}, "
                  f"Facebook {networks['facebook']} — across all {len(VIDEO_TOPICS)} topics."),
    }


# ─────────────────────────────────────────────────────────────────────────────
# URL metadata for pasted Instagram / TikTok / Facebook / YouTube links
# ─────────────────────────────────────────────────────────────────────────────

_PLATFORM_RES = [
    ("youtube", re.compile(r"(youtube\.com/watch|youtu\.be/|youtube\.com/shorts/)", re.I)),
    ("instagram", re.compile(r"instagram\.com/(?:reel|p|tv)/", re.I)),
    ("tiktok", re.compile(r"tiktok\.com/", re.I)),
    ("facebook", re.compile(r"(facebook\.com|fb\.watch)", re.I)),
    ("x", re.compile(r"(x\.com|twitter\.com)/[A-Za-z0-9_]+/status/", re.I)),
]


def detect_platform(url):
    for name, rx in _PLATFORM_RES:
        if rx.search(url or ""):
            return name
    return ""


def embed_for(url, platform):
    """Official embed URL for a pasted post. Returns '' when not embeddable."""
    platform = platform or detect_platform(url)
    if platform == "youtube":
        m = (re.search(r"(?:v=|youtu\.be/|shorts/)([\w-]{6,})", url or ""))
        return f"https://www.youtube-nocookie.com/embed/{m.group(1)}" if m else ""
    if platform == "instagram":
        m = re.search(r"instagram\.com/(?:reel|p|tv)/([\w-]+)", url or "")
        return f"https://www.instagram.com/p/{m.group(1)}/embed" if m else ""
    if platform == "tiktok":
        m = re.search(r"tiktok\.com/.*?/video/(\d+)", url or "")
        return f"https://www.tiktok.com/embed/v2/{m.group(1)}" if m else ""
    if platform == "facebook":
        return "https://www.facebook.com/plugins/video.php?href=" + (url or "")
    if platform == "x":
        m = re.search(r"(?:x\.com|twitter\.com)/[A-Za-z0-9_]+/status/(\d+)", url or "")
        return f"https://platform.twitter.com/embed/Tweet.html?id={m.group(1)}" if m else ""
    return ""


def fetch_url_metadata(url):
    """yt-dlp metadata for a pasted URL (title, uploader, date, thumbnail)."""
    platform = detect_platform(url)
    if not platform:
        return {"error": "URL is not a recognized YouTube / Instagram / TikTok / Facebook / X link"}
    cached = _meta_cache.get(url)
    if cached and time.time() - cached.get("fetchedAt", 0) < 6 * 3600:
        cached.pop("fetchedAt", None)
        return cached
    if yt_dlp is None:
        return {"platform": platform, "embedUrl": embed_for(url, platform), "url": url,
                "error": "yt-dlp not installed — playback embed still available"}
    opts = {"quiet": True, "no_warnings": True, "skip_download": True, "noplaylist": True}
    try:
        with yt_dlp.YoutubeDL(opts) as ydl:
            info = ydl.extract_info(url, download=False)
        out = {
            "platform": platform, "url": url,
            "embedUrl": embed_for(url, platform),
            "videoId": info.get("id", ""),
            "title": info.get("title", ""),
            "uploader": info.get("uploader") or info.get("channel") or info.get("uploader_id") or "",
            "published": (info.get("upload_date") or ""),
            "durationSec": int(info.get("duration") or 0),
            "thumbnail": info.get("thumbnail", ""),
            "description": (info.get("description") or "")[:600],
            "webpageUrl": info.get("webpage_url", url),
            "isShort": 0 < int(info.get("duration") or 0) <= 60,
        }
        if out["published"]:
            out["published"] = f"{out['published'][:4]}-{out['published'][4:6]}-{out['published'][6:8]}"
        _meta_cache[url] = {**out, "fetchedAt": time.time()}
        return out
    except Exception as exc:  # noqa: BLE001
        return {"platform": platform, "url": url, "embedUrl": embed_for(url, platform),
                "error": f"Metadata fetch failed: {exc}"}


# ─────────────────────────────────────────────────────────────────────────────
# Local downloads via yt-dlp (rights-respecting use)
# ─────────────────────────────────────────────────────────────────────────────

def _ydl_progress_hook(job_id):
    def hook(d):
        job = _jobs.get(job_id)
        if not job:
            return
        if d.get("status") == "downloading":
            total = d.get("total_bytes") or d.get("total_bytes_estimate") or 0
            done = d.get("downloaded_bytes") or 0
            if total:
                job["progress"] = round(done / total * 100, 1)
            job["status"] = "downloading"
            speed = d.get("speed")
            job["speedMBs"] = round(speed / 1e6, 2) if speed else None
        elif d.get("status") == "finished":
            job["status"] = "processing"
            job["progress"] = 99.0
    return hook


def start_download(url, quality="720p"):
    platform = detect_platform(url)
    if not platform:
        return {"error": "Only YouTube / Instagram / TikTok / Facebook / X URLs are supported"}
    if yt_dlp is None:
        return {"error": "yt-dlp is not installed (pip install yt-dlp)"}
    job = _job()
    job["status"] = "downloading"
    job["title"] = url
    job["quality"] = quality
    fmt = {
        "best": "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best",
        "1080p": "bestvideo[height<=1080][ext=mp4]+bestaudio[ext=m4a]/best[height<=1080]",
        "720p": "bestvideo[height<=720][ext=mp4]+bestaudio[ext=m4a]/best[height<=720]",
        "480p": "bestvideo[height<=480][ext=mp4]+bestaudio[ext=m4a]/best[height<=480]",
        "audio": "bestaudio[ext=m4a]/bestaudio",
    }.get(quality, "bestvideo[height<=720][ext=mp4]+bestaudio[ext=m4a]/best[height<=720]")

    opts = {
        "format": fmt,
        "outtmpl": os.path.join(VIDEO_DIR, "%(upload_date>%Y%m%d)s_%(title).80B.%(ext)s"),
        "merge_output_format": "mp4",
        "progress_hooks": [_ydl_progress_hook(job["id"])],
        "quiet": True, "no_warnings": True, "noplaylist": True,
        "restrictfilenames": False, "retries": 3,
    }

    def run():
        try:
            with yt_dlp.YoutubeDL(opts) as ydl:
                info = ydl.extract_info(url, download=True)
                files = []
                req = info.get("requested_downloads") or []
                for rd in req:
                    path = rd.get("filepath") or rd.get("filename")
                    if path and os.path.exists(path):
                        files.append({
                            "path": path,
                            "name": os.path.basename(path),
                            "sizeMB": round(os.path.getsize(path) / 1e6, 2),
                            "serveUrl": "/api/videos/file?name=" + requests.utils.quote(os.path.basename(path)) if requests else "",
                        })
                job["files"] = files or [{"name": info.get("title", "video"), "sizeMB": 0, "serveUrl": ""}]
                job["title"] = info.get("title") or url
                job["durationSec"] = int(info.get("duration") or 0)
                job["status"] = "done"
                job["progress"] = 100.0
        except Exception as exc:  # noqa: BLE001
            job["status"] = "error"
            job["error"] = str(exc)[:400]

    threading.Thread(target=run, daemon=True).start()
    return job


def download_status(job_id):
    job = _jobs.get(job_id)
    return job or {"error": "unknown job id"}


def list_downloads():
    """Scan the exports/videos folder so previously fetched files persist."""
    items = []
    try:
        for name in sorted(os.listdir(VIDEO_DIR), reverse=True):
            path = os.path.join(VIDEO_DIR, name)
            if os.path.isfile(path) and not name.startswith("."):
                stat = os.stat(path)
                q = requests.utils.quote(name) if requests else name
                items.append({
                    "name": name,
                    "sizeMB": round(stat.st_size / 1e6, 2),
                    "modified": datetime.fromtimestamp(stat.st_mtime, tz=timezone.utc).isoformat(),
                    "serveUrl": f"/api/videos/file?name={q}",
                    "isAudio": name.endswith((".m4a", ".mp3", ".opus", ".weba")),
                })
    except FileNotFoundError:
        pass
    return {"count": len(items), "dir": VIDEO_DIR, "files": items}


def serve_video_file(name):
    """Path-safe file serving for the in-app player / download button."""
    name = os.path.basename(name or "")  # block traversal
    path = os.path.join(VIDEO_DIR, name)
    if not name or not os.path.isfile(path):
        return None
    return path


def yt_dlp_available():
    return yt_dlp is not None
