"""
news_scraper.py — Multi-strategy news fetcher for sources without RSS feeds.

Strategy chain for each source:
  1. If RSS URL is configured → use RSS (existing _do_fetch)
  2. If RSS auto-discovery finds a feed → use discovered feed
  3. Try sitemap.xml (/sitemap.xml, /sitemap_index.xml) → parse URLs
  4. Fall back to HTML scraping using Python's html.parser

All strategies use only Python stdlib — no external dependencies required.
"""

import re
import ssl
import time
import xml.etree.ElementTree as ET
from urllib.parse import urljoin, urlparse
from urllib.request import Request, urlopen

SCRAPE_TIMEOUT = 8  # seconds per HTTP request

# Common sitemap paths to try
SITEMAP_PATHS = [
    "/sitemap.xml",
    "/sitemap_index.xml",
    "/sitemap/sitemap-index.xml",
    "/sitemap/sitemap.xml",
    "/news-sitemap.xml",
    "/sitemap-index.xml",
    "/sitemaps/sitemap.xml",
    "/wp-sitemap.xml",  # WordPress
    "/page-sitemap.xml",
    "/post-sitemap.xml",
]

# Common non-article link keywords to skip during HTML scraping
SKIP_LINK_WORDS = frozenset({
    "subscribe", "sign up", "login", "log in", "register", "about us",
    "contact us", "privacy policy", "terms of service", "cookie",
    "menu", "home", "search", "archive", "categories", "tags",
    "profile", "settings", "account", "password", "forgot",
    "advertise", "careers", "jobs", "press", "media kit",
    "rss feed", "atom feed", "follow us", "newsletter",
})

# Patterns to find article links in HTML (ordered by specificity)
ARTICLE_PATTERNS = [
    # h2/h3 with links (most common article listing pattern)
    re.compile(
        r'<h[23][^>]*>\s*<a[^>]+href="([^"]+)"[^>]*>([^<]+)</a>',
        re.IGNORECASE | re.DOTALL,
    ),
    # Links with article/post/entry class
    re.compile(
        r'<a[^>]+href="([^"]+)"[^>]*class="[^"]*(?:post-?title|article-?title|entry-?title|story-?title|card-?title|headline|blog-?title)[^"]*"[^>]*>([^<]+)</a>',
        re.IGNORECASE | re.DOTALL,
    ),
    # Links inside article/post/entry containers
    re.compile(
        r'<div[^>]+class="[^"]*(?:post|article|entry|card|story|item|blog)[^"]*"[^>]*>.*?<a[^>]+href="([^"]+)"[^>]*>([^<]+)</a>',
        re.IGNORECASE | re.DOTALL,
    ),
    # Any link with reasonable title length (10-100 chars) = likely article
    re.compile(
        r'<a[^>]+href="([^"]+)"[^>]*>([^<]{10,80})</a>',
        re.IGNORECASE | re.DOTALL,
    ),
]


def _make_ssl_context():
    """Create a permissive SSL context for fetching."""
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    return ctx


def _user_agent() -> dict:
    return {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/120.0.0.0 Safari/537.36"
        ),
        "Accept-Language": "en-US,en;q=0.9",
    }


def _is_article_link(title: str, href: str) -> bool:
    """Filter out non-article links by title and href patterns."""
    title_lower = title.lower().strip()
    # Skip short/long titles
    if len(title_lower) < 8 or len(title_lower) > 120:
        return False
    # Skip navigation/utility links
    for word in SKIP_LINK_WORDS:
        if word in title_lower:
            return False
    # Skip links to homepage, anchors, javascript
    if href.startswith("#") or href.startswith("javascript:"):
        return False
    # Skip single-word titles (usually nav items)
    if len(title_lower.split()) < 2:
        return False
    return True


# Additional nav-page keywords to filter from sitemaps
_SITEMAP_NAV_WORDS = frozenset({
    "about", "about us", "contact", "contact us", "privacy", "privacy policy",
    "terms", "terms of service", "terms and conditions", "cookie", "cookies",
    "sitemap", "search", "login", "log in", "sign in", "sign up", "register",
    "subscribe", "newsletter", "archive", "archives", "categories", "category",
    "tags", "tag", "authors", "author", "profile", "settings", "account",
    "password", "forgot", "help", "faq", "support", "careers", "jobs",
    "press", "media", "media kit", "advertise", "advertising",
    "rss feed", "atom feed", "follow us", "share", "sharing",
    "home", "index", "main", "menu", "navigation", "nav",
    "about page", "blog", "labs", "people", "projects", "publications",
    "topics", "events", "teams", "mission", "vision", "values",
    "what we do", "how it works", "pricing", "demo", "trial",
})


def _strip_html_tags(text: str) -> str:
    """Remove HTML tags from text using regex."""
    clean = re.sub(r"<[^>]+>", " ", text)
    clean = re.sub(r"\s+", " ", clean).strip()
    return clean


# ---- Sitemap Parser ----

# URL slug segments that are dates/IDs and not article titles
_DATE_SEG_RE = re.compile(r"^\d{4}$|^\d{4}-\d{2}|^\d{4}/\d{2}|\d{8}$")


def _title_from_slug(link: str, url_el) -> str:
    """Best-effort title from a sitemap URL slug + <lastmod>."""
    import html as _html_mod
    path = urlparse(link).path.strip("/")
    segments = [s for s in path.split("/") if s]
    title = ""
    for seg in reversed(segments):
        s = re.sub(r"\.(html?|php|aspx?)$", "", seg, flags=re.IGNORECASE).strip()
        if not s or s.isdigit() or _DATE_SEG_RE.match(s):
            continue
        title = s
        break
    if not title:
        return ""
    title = _html_mod.unescape(title.replace("-", " ").replace("_", " ").replace("+", " "))
    title = re.sub(r"\s+", " ", title).strip()
    if len(title) < 6:
        return ""
    title_lower = title.lower()
    if len(title_lower.split()) == 1 and len(title_lower) < 9:
        return ""
    for nav_word in _SITEMAP_NAV_WORDS:
        if title_lower == nav_word or title_lower.startswith(nav_word + " "):
            return ""
    return title


def parse_sitemap(url: str, _depth: int = 0) -> list[dict]:
    """Fetch and parse a sitemap.xml, returning article entries.

    Handles gzip response bodies, flat sitemaps, and sitemap indexes (walks up
    to 8 child sitemaps until articles are found). Returns up to 15 entries
    with the title extracted from the URL path as fallback.
    """
    if _depth > 3:
        return []
    try:
        ctx = _make_ssl_context()
        req = Request(
            url,
            headers={
                **_user_agent(),
                "Accept-Encoding": "gzip",
                "Accept": "application/xml, text/xml, */*",
            },
        )
        with urlopen(req, timeout=SCRAPE_TIMEOUT, context=ctx) as resp:
            raw = resp.read()
            if (resp.headers.get("Content-Encoding") or "").lower() == "gzip":
                try:
                    import gzip as _gzip_mod
                    raw = _gzip_mod.decompress(raw)
                except Exception:
                    pass
            body = raw.decode("utf-8", errors="replace")

        items = []
        try:
            root = ET.fromstring(body.lstrip("\ufeff").lstrip())
        except ET.ParseError:
            return []

        # Namespace-aware parsing (sitemaps use various namespaces)
        ns = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}

        # Sitemap index — walk a handful of child sitemaps until we get hits
        index_urls = root.findall(".//sm:sitemap/sm:loc", ns)
        if index_urls:
            for index_el in index_urls[:8]:
                sub = (index_el.text or "").strip()
                if not sub:
                    continue
                items = parse_sitemap(sub, _depth + 1)
                if items:
                    return items[:15]
            return []

        urls = root.findall(".//sm:url", ns)
        seen = set()
        for u in urls:
            if len(items) >= 20:
                break
            loc_el = u.find("sm:loc", ns)
            if loc_el is None or not loc_el.text:
                continue
            link = loc_el.text.strip()
            if not link.startswith(("http://", "https://")):
                continue
            if link in seen:
                continue
            seen.add(link)

            title = _title_from_slug(link, u)
            if not title:
                continue

            # Get lastmod date
            lastmod_el = u.find("sm:lastmod", ns)
            date = ""
            if lastmod_el is not None and lastmod_el.text:
                date = lastmod_el.text.strip()[:10]

            items.append({
                "title": title[:100],
                "url": link,
                "date": date,
                "snippet": "",
                "source": "sitemap",
            })

        return items[:15]
    except Exception:
        return []


# ---- HTML Scraper ----


def fetch_url_content(url: str) -> str | None:
    """Fetch a URL and return its text content, or None on failure."""
    try:
        ctx = _make_ssl_context()
        req = Request(
            url,
            headers={
                **_user_agent(),
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            },
        )
        with urlopen(req, timeout=SCRAPE_TIMEOUT, context=ctx) as resp:
            return resp.read(300_000).decode("utf-8", errors="replace")
    except Exception:
        return None


def scrape_html_for_articles(url: str) -> list[dict]:
    """Scrape a website's HTML for article links.

    Uses multiple regex patterns to find article-type links. Returns
    up to 10 unique article entries from the same domain.
    """
    html = fetch_url_content(url)
    if not html:
        return []

    base_parsed = urlparse(url)
    items = []
    seen = set()

    for pattern in ARTICLE_PATTERNS:
        for match in pattern.finditer(html):
            if len(items) >= 10:
                break

            href, title_raw = match.group(1), match.group(2)
            title = _strip_html_tags(title_raw)

            if not _is_article_link(title, href):
                continue

            # Resolve relative URLs
            if href.startswith("/"):
                href = urljoin(url, href)
            elif href.startswith("//"):
                href = f"{base_parsed.scheme}:{href}"
            elif not href.startswith("http"):
                continue  # skip anchors and other non-URLs

            # Deduplicate
            if href in seen:
                continue
            seen.add(href)

            # Ensure same domain
            href_parsed = urlparse(href)
            if href_parsed.netloc and href_parsed.netloc != base_parsed.netloc:
                continue

            items.append({
                "title": title[:120],
                "url": href,
                "date": "",
                "snippet": "",
                "source": "scrape",
            })

        if items:
            break  # Stop at first pattern that matched

    return items


def try_sitemap(base_url: str) -> list[dict]:
    """Try common sitemap paths for a given base URL."""
    parsed = urlparse(base_url)
    base = f"{parsed.scheme}://{parsed.netloc}"

    for path in SITEMAP_PATHS:
        sitemap_url = urljoin(base, path)
        items = parse_sitemap(sitemap_url)
        if items:
            return items
    return []


def try_common_rss_paths(url: str) -> str | None:
    """Check common RSS feed paths and return first valid feed URL."""
    from urllib.parse import urlparse as _up, urljoin as _uj
    parsed = _up(url)
    base = f"{parsed.scheme}://{parsed.netloc}"

    rss_paths = [
        "/feed", "/feed/", "/rss", "/rss/", "/rss.xml",
        "/feed.xml", "/atom.xml", "/index.xml",
        "/blog/feed", "/blog/rss.xml", "/blog/feed.xml",
        "/news/feed", "/news/rss", "/news/rss.xml",
        "/en/feed/", "/blog/index.xml",
    ]

    ctx = _make_ssl_context()
    for path in rss_paths:
        rss_url = _uj(base, path)
        try:
            req = Request(
                rss_url,
                headers={
                    **_user_agent(),
                    "Accept": "application/rss+xml,application/xml,text/xml,application/atom+xml",
                },
            )
            with urlopen(req, timeout=SCRAPE_TIMEOUT, context=ctx) as resp:
                head = resp.read(1024).decode("utf-8", errors="replace")
                sh = head.lstrip()[:60].lower()
                is_feed = sh.startswith("<?xml") or sh.startswith("<rss") or sh.startswith("<feed")
                if is_feed:
                    return rss_url
        except Exception:
            continue
    return None


# ---- Domain-specific scrapers (for complex sites) ----


def scrape_hackster_io(url: str) -> list[dict]:
    """Custom scraper for hackster.io/robotics."""
    html = fetch_url_content(url)
    if not html:
        return []

    items = []
    seen = set()
    # Hackster uses a specific card layout
    pattern = re.compile(
        r'<a[^>]+href="(https://www\.hackster\.io/[^"]+)"[^>]*>\s*<[^>]+>\s*<[^>]+>\s*<[^>]+>([^<]+)',
        re.DOTALL | re.IGNORECASE,
    )
    for match in pattern.finditer(html):
        href, title = match.group(1), match.group(2)
        title = _strip_html_tags(title).strip()
        if title and len(title) > 10 and href not in seen:
            seen.add(href)
            items.append({
                "title": title[:120],
                "url": href,
                "date": "",
                "snippet": "",
                "source": "scrape",
            })
    if items:
        return items[:10]

    # Fall back to generic scrape
    return scrape_html_for_articles(url)


def scrape_ieee_cs(url: str) -> list[dict]:
    """Custom scraper for computer.org."""
    html = fetch_url_content(url)
    if not html:
        return []
    items = []
    seen = set()
    # IEEE CS uses specific patterns
    for pattern in [
        re.compile(r'<a[^>]+href="(https://www\.computer\.org/[^"]+)"[^>]*>([^<]{15,})</a>', re.DOTALL),
        re.compile(r'<h[23][^>]*>.*?<a[^>]+href="([^"]+)"[^>]*>([^<]+)</a>', re.DOTALL),
    ]:
        for match in pattern.finditer(html):
            href, title = match.group(1), match.group(2)
            title = _strip_html_tags(title).strip()
            if title and len(title) > 10 and href not in seen:
                seen.add(href)
                items.append({
                    "title": title[:120],
                    "url": href if href.startswith("http") else urljoin(url, href),
                    "date": "",
                    "snippet": "",
                    "source": "scrape",
                })
        if items:
            break
    return items[:10]


def scrape_stanford_cs(url: str) -> list[dict]:
    """Custom scraper for cs.stanford.edu/news."""
    html = fetch_url_content(url)
    if not html:
        return []
    items = []
    seen = set()
    # Stanford CS news uses article cards
    for pattern in [
        re.compile(r'<h3[^>]*>.*?<a[^>]+href="([^"]+)"[^>]*>([^<]+)</a>', re.DOTALL),
        re.compile(r'<a[^>]+href="(https://cs\.stanford\.edu[^"]+)"[^>]*>([^<]{15,})</a>', re.DOTALL),
    ]:
        for match in pattern.finditer(html):
            href, title = match.group(1), match.group(2)
            title = _strip_html_tags(title).strip()
            if title and len(title) > 10 and href not in seen:
                seen.add(href)
                items.append({
                    "title": title[:120],
                    "url": href if href.startswith("http") else urljoin(url, href),
                    "date": "",
                    "snippet": "",
                    "source": "scrape",
                })
        if items:
            break
    return items[:10]


# ---- More domain-specific scrapers ----


def scrape_substack(url: str) -> list[dict]:
    """Custom scraper for Substack publications."""
    html = fetch_url_content(url)
    if not html:
        return []
    items = []
    seen = set()
    # Substack uses a consistent article card pattern
    for pat in [
        re.compile(r'<a[^>]+href="([^"]+)"[^>]*class="[^"]*post-preview[^"]*"[^>]*>.*?<h2[^>]*>([^<]+)', re.DOTALL),
        re.compile(r'<a[^>]+href="([^"]+)"[^>]*>\s*<h3[^>]*>([^<]+)', re.DOTALL),
        re.compile(r'class="[^"]*post-title[^"]*"[^>]*>.*?<a[^>]+href="([^"]+)"[^>]*>([^<]+)', re.DOTALL),
    ]:
        for match in pat.finditer(html):
            href, title = match.group(1), match.group(2)
            title = _strip_html_tags(title).strip()
            if title and len(title) > 10 and href not in seen and not title.startswith('Subscribe'):
                seen.add(href)
                href = href if href.startswith('http') else urljoin(url, href)
                items.append({"title": title[:120], "url": href, "date": "", "snippet": "", "source": "scrape"})
        if items:
            break
    return items[:10]


def scrape_medium(url: str) -> list[dict]:
    """Custom scraper for Medium publications."""
    html = fetch_url_content(url)
    if not html:
        return []
    items = []
    seen = set()
    for pat in [
        re.compile(r'<a[^>]+href="([^"]+)"[^>]*>\s*<h2[^>]*>([^<]+)', re.DOTALL),
        re.compile(r'<h2[^>]*>.*?<a[^>]+href="([^"]+)"[^>]*>([^<]+)', re.DOTALL),
        re.compile(r'<a[^>]+href="(https://[^/]+\.[^/]+/[^/]+/[^/]+/\d+[^"]*)"[^>]*>([^<]{15,})', re.DOTALL),
    ]:
        for match in pat.finditer(html):
            href, title = match.group(1), match.group(2)
            title = _strip_html_tags(title).strip()
            if title and len(title) > 10 and href not in seen:
                seen.add(href)
                href = href if href.startswith('http') else urljoin(url, href)
                items.append({"title": title[:120], "url": href, "date": "", "snippet": "", "source": "scrape"})
        if items:
            break
    return items[:10]


def scrape_tech_blog(url: str) -> list[dict]:
    """Generic tech blog scraper for common patterns (h2 > a, article cards)."""
    html = fetch_url_content(url)
    if not html:
        return []
    items = []
    seen = set()
    for pat in [
        re.compile(r'<article[^>]*>.*?<a[^>]+href="([^"]+)"[^>]*>([^<]{15,})</a>', re.DOTALL),
        re.compile(r'<a[^>]+href="([^"]+)"[^>]*class="[^"]*card[^"]*"[^>]*>([^<]{15,})', re.DOTALL),
        re.compile(r'<h3[^>]*>\s*<a[^>]+href="([^"]+)"[^>]*>([^<]+)</a>', re.DOTALL),
    ]:
        for match in pat.finditer(html):
            href, title = match.group(1), match.group(2)
            title = _strip_html_tags(title).strip()
            if title and len(title) > 10 and href not in seen:
                seen.add(href)
                href = href if href.startswith('http') else urljoin(url, href)
                items.append({"title": title[:120], "url": href, "date": "", "snippet": "", "source": "scrape"})
        if items:
            break
    return items[:10]


def scrape_arxiv(url: str) -> list[dict]:
    """Custom scraper for arxiv.org listings."""
    html = fetch_url_content(url)
    if not html:
        return []
    items = []
    seen = set()
    # arXiv listing pages have specific structure
    pat = re.compile(r'<a[^>]+href="(https?://arxiv\.org/abs/(\d+\.\d+))">([^<]+)', re.DOTALL)
    for match in pat.finditer(html):
        href, paper_id, title_raw = match.group(1), match.group(2), match.group(3)
        title = _strip_html_tags(title_raw).strip()
        if title and len(title) > 10 and paper_id not in seen:
            seen.add(paper_id)
            items.append({
                "title": title[:150],
                "url": href,
                "date": "",
                "snippet": f"arXiv paper {paper_id}",
                "source": "scrape",
            })
    return items[:15]


# ---- Main scraper dispatcher ----


def fetch_via_scraping(key: str, source_url: str) -> list[dict]:
    """Try multiple strategies to get articles from a source without RSS.

    Strategy order:
      1. Try sitemap.xml
      2. Try domain-specific scraper (if available)
      3. Try generic HTML scraping
    """
    if not source_url:
        return []

    items = []

    # Strategy 1: Sitemap
    items = try_sitemap(source_url)
    if items:
        return items

    # Strategy 2: Domain-specific scrapers
    domain = urlparse(source_url).netloc.lower()
    custom_scrapers = {
        "hackster.io": scrape_hackster_io,
        "www.computer.org": scrape_ieee_cs,
        "cs.stanford.edu": scrape_stanford_cs,
        "substack.com": scrape_substack,
        "medium.com": scrape_medium,
        "towardsdatascience.com": scrape_medium,
        "arxiv.org": scrape_arxiv,
        "techcrunch.com": scrape_tech_blog,
        "wired.com": scrape_tech_blog,
        "theverge.com": scrape_tech_blog,
        "venturebeat.com": scrape_tech_blog,
        "zdnet.com": scrape_tech_blog,
        "aitrends.com": scrape_tech_blog,
        "unite.ai": scrape_tech_blog,
    }

    for domain_key, scraper_fn in custom_scrapers.items():
        if domain_key in domain:
            items = scraper_fn(source_url)
            if items:
                return items

    # Strategy 3: Generic HTML scraping. The source URL is often a marketing
    # homepage with no articles, so fall back to common listing paths too.
    listing_paths = ("", "/blog", "/news", "/newsroom", "/updates", "/latest",
                     "/posts", "/articles", "/insights", "/resources", "/media")
    for path in listing_paths:
        listing = source_url.rstrip("/") + path if path else source_url
        items = scrape_html_for_articles(listing)
        if items:
            return items
    return []
