"""
Trading API — Live daily trading data and curated investment picks.
Uses yfinance for real-time Yahoo Finance data.
"""
from fastapi import APIRouter, Query
from fastapi.responses import JSONResponse
import yfinance as yf
import time
import traceback
from concurrent.futures import ThreadPoolExecutor, as_completed

router = APIRouter(prefix="/api/trading", tags=["trading"])

# ── Simple TTL cache ────────────────────────────────────────────────────────
_cache: dict[str, dict] = {}
_CACHE_TTL = 60  # seconds — longer cache for heavy batch calls


def _cached(key: str) -> dict | None:
    entry = _cache.get(key)
    if entry and (time.time() - entry["ts"]) < _CACHE_TTL:
        return entry["data"]
    return None


def _set_cache(key: str, data: dict):
    _cache[key] = {"data": data, "ts": time.time()}


def _safe(val):
    try:
        if val is None:
            return None
        v = float(val)
        if v != v:  # NaN
            return None
        return round(v, 4)
    except (TypeError, ValueError):
        return None


def _fetch_one(symbol: str) -> dict:
    """Fetch a single quote with error handling."""
    try:
        ticker = yf.Ticker(symbol)
        info = ticker.info or {}
        price = _safe(info.get("currentPrice")) or _safe(info.get("regularMarketPrice")) or _safe(info.get("previousClose"))
        prev_close = _safe(info.get("previousClose"))
        change = None
        change_pct = None
        if price and prev_close and prev_close > 0:
            change = round(price - prev_close, 4)
            change_pct = round((change / prev_close) * 100, 2)
        return {
            "symbol": symbol,
            "name": info.get("shortName") or info.get("longName") or symbol,
            "currency": info.get("currency", "USD"),
            "price": price,
            "change": change,
            "changePct": change_pct,
            "open": _safe(info.get("regularMarketOpen") or info.get("open")),
            "high": _safe(info.get("dayHigh")),
            "low": _safe(info.get("dayLow")),
            "previousClose": prev_close,
            "week52High": _safe(info.get("fiftyTwoWeekHigh")),
            "week52Low": _safe(info.get("fiftyTwoWeekLow")),
            "volume": info.get("regularMarketVolume"),
            "marketCap": _safe(info.get("marketCap")),
            "pe": _safe(info.get("trailingPE")),
            "dividendYield": _safe(info.get("dividendYield")),
            "beta": _safe(info.get("beta")),
            "sector": info.get("sector", ""),
            "industry": info.get("industry", ""),
            "fetchedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        }
    except Exception as e:
        return {"symbol": symbol, "name": symbol, "error": str(e)[:100], "price": None}


def _batch_fetch(symbols: list[str], max_workers: int = 8) -> list[dict]:
    """Fetch multiple quotes in parallel."""
    results = {}
    with ThreadPoolExecutor(max_workers=max_workers) as pool:
        futures = {pool.submit(_fetch_one, s): s for s in symbols}
        for future in as_completed(futures):
            sym = futures[future]
            try:
                results[sym] = future.result()
            except Exception:
                results[sym] = {"symbol": sym, "name": sym, "error": "fetch failed", "price": None}
    # Preserve original order
    return [results.get(s, {"symbol": s, "name": s, "error": "missing", "price": None}) for s in symbols]


# ═══════════════════════════════════════════════════════════════════════════
# Watchlists for scanning
# ═══════════════════════════════════════════════════════════════════════════

SCAN_STOCKS_US = [
    "NVDA", "AAPL", "MSFT", "AMZN", "GOOGL", "META", "TSLA", "BRK-B",
    "JPM", "V", "UNH", "XOM", "MA", "PG", "JNJ", "HD", "CVX", "MRK",
    "ABBV", "LLY", "AVGO", "COST", "KO", "PEP", "WMT", "CRM", "AMD",
    "NFLX", "ADBE", "ORCL", "PLTR", "COIN", "MSTR", "SMCI", "ARM",
    "DASH", "SNOW", "PLTR", "CRWD", "PANW", "NET", "DDOG",
]

SCAN_STOCKS_SG = [
    "D05.SI", "O39.SI", "U11.SI", "Z74.SI", "A17U.SI", "C38U.SI",
    "N2IU.SI", "Y92.SI", "BN4.SI", "S58.SI", "C6L.SI", "S63.SI",
    "S51.SI", "U96.SI", "C09.SI", "W05.SI", "A50.SI", "J36.SI",
]

SCAN_STOCKS_IN = [
    "RELIANCE.NS", "TCS.NS", "HDFCBANK.NS", "INFY.NS", "ITC.NS",
    "BAJFINANCE.NS", "TATAMOTORS.NS", "SBIN.NS", "TITAN.NS",
    "LT.NS", "WIPRO.NS", "ICICIBANK.NS", "ADANIENT.NS", "TATASTEEL.NS",
    "AXISBANK.NS", "BHARTIARTL.NS", "KOTAKBANK.NS", "ONGC.NS",
    "TATACONSUM.NS", "HCLTECH.NS", "SUNPHARMA.NS", "POWERGRID.NS",
]

SCAN_STOCKS_HK = [
    "0700.HK", "9988.HK", "1211.HK", "2318.HK", "3690.HK",
    "9618.HK", "9626.HK", "2020.HK", "1024.HK", "0027.HK",
    "0005.HK", "1398.HK", "2382.HK", "0941.HK", "2313.HK",
]

SCAN_ETFS = [
    "VOO", "SPY", "QQQ", "VWRA.L", "CSPX.L", "VTI", "IVV",
    "AGG", "BND", "SCHD", "VYM", "GLD", "IAU", "SLV", "USO",
    "VNQ", "VGT", "SOXX", "ARKK", "EEM", "EWJ", "EWY", "MCHI",
    "INDA", "EWZ", "TLT", "HYG", "LQD", "VIG", "DGRO",
    "TQQQ", "SOXL", "UPRO",
]

SCAN_CRYPTO = [
    "BTC-USD", "ETH-USD", "SOL-USD", "XRP-USD", "ADA-USD",
    "DOGE-USD", "AVAX-USD", "DOT-USD", "LINK-USD", "MATIC-USD",
    "SHIB-USD", "LTC-USD", "BCH-USD", "UNI-USD", "ATOM-USD",
]

SCAN_COMMODITIES = [
    "GC=F", "SI=F", "CL=F", "BZ=F", "NG=F", "HG=F",
    "PL=F", "PA=F", "CORN=F", "ZW=F", "ZS=F",
]

SCAN_FOREX = [
    "EURUSD=X", "USDJPY=X", "GBPUSD=X", "USDSGD=X",
    "USDINR=X", "AUDUSD=X", "USDCNY=X", "USDCHF=X",
    "EURGBP=X", "EURJPY=X",
]


# ═══════════════════════════════════════════════════════════════════════════
# Commodities workspace
# ═══════════════════════════════════════════════════════════════════════════
# Futures symbols are used for indicative market quotes. They are not an
# offer to trade and may be delayed depending on the upstream data source.
COMMODITY_GROUPS = [
    {
        "id": "precious-metals",
        "label": "Precious Metals",
        "icon": "🥇",
        "accent": "#fbbf24",
        "description": "Gold, silver, platinum and palladium used as stores of value and industrial inputs.",
        "symbols": ["GC=F", "SI=F", "PL=F", "PA=F"],
    },
    {
        "id": "energy",
        "label": "Energy",
        "icon": "🛢️",
        "accent": "#fb7185",
        "description": "Crude oil and natural gas, influenced by inventories, weather, OPEC+ and geopolitics.",
        "symbols": ["CL=F", "BZ=F", "NG=F", "RB=F", "HO=F"],
    },
    {
        "id": "industrial-metals",
        "label": "Industrial Metals",
        "icon": "🔩",
        "accent": "#38bdf8",
        "description": "Materials connected to construction, electronics, power grids, batteries and manufacturing.",
        "symbols": ["HG=F", "ALI=F", "ZNC=F", "LIT=F"],
    },
    {
        "id": "agriculture",
        "label": "Agriculture & Grains",
        "icon": "🌾",
        "accent": "#4ade80",
        "description": "Crops affected by planting cycles, weather, inventories, exports and food demand.",
        "symbols": ["CORN=F", "ZW=F", "ZS=F", "KC=F", "CT=F", "SB=F"],
    },
    {
        "id": "livestock",
        "label": "Livestock",
        "icon": "🐄",
        "accent": "#c084fc",
        "description": "Live cattle, feeder cattle and lean hog contracts linked to meat supply chains.",
        "symbols": ["LE=F", "GF=F", "HE=F"],
    },
    {
        "id": "semiconductor-chips",
        "label": "Semiconductor & Chips",
        "icon": "💠",
        "accent": "#a78bfa",
        "description": "Indicative prices for chip designers, foundries, memory makers and semiconductor equipment companies.",
        "symbols": ["SOXX", "SMH", "NVDA", "AMD", "TSM", "ASML", "MU", "INTC", "QCOM"],
    },
]

@router.get("/commodities")
def get_commodities(refresh: bool = Query(False, description="Bypass the short-lived quote cache")):
    """Return grouped commodity futures quotes for the commodities workspace."""
    cache_key = "commodities_workspace"
    if not refresh:
        cached = _cached(cache_key)
        if cached:
            return cached

    groups = []
    for group in COMMODITY_GROUPS:
        quotes = _batch_fetch(group["symbols"], max_workers=5)
        groups.append({
            "id": group["id"],
            "label": group["label"],
            "icon": group["icon"],
            "accent": group["accent"],
            "description": group["description"],
            "items": quotes,
        })

    result = {
        "groups": groups,
        "fetchedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "source": "Yahoo Finance via yfinance",
        "disclaimer": "Indicative market data for education; prices can be delayed and are not financial advice.",
    }
    _set_cache(cache_key, result)
    return result


# ═══════════════════════════════════════════════════════════════════════════
# Live Investments Endpoint
# ═══════════════════════════════════════════════════════════════════════════

@router.get("/live-investments")
def get_live_investments(category: str = Query("all", description="Category: all, stocks-us, stocks-sg, stocks-in, stocks-hk, etfs, crypto, commodities, forex")):
    """
    Get curated live investment picks across all categories.
    Auto-refreshes from Yahoo Finance.
    """
    cache_key = f"live_inv_{category}"
    cached = _cached(cache_key)
    if cached:
        return cached

    categories_config = {
        "stocks-us": {"title": "US Stocks — Top Picks", "symbols": SCAN_STOCKS_US, "type": "stocks", "country": "🇺🇸 US"},
        "stocks-sg": {"title": "Singapore Stocks — Top Picks", "symbols": SCAN_STOCKS_SG, "type": "stocks", "country": "🇸🇬 Singapore"},
        "stocks-in": {"title": "India Stocks — Top Picks", "symbols": SCAN_STOCKS_IN, "type": "stocks", "country": "🇮🇳 India"},
        "stocks-hk": {"title": "Hong Kong Stocks — Top Picks", "symbols": SCAN_STOCKS_HK, "type": "stocks", "country": "🇭🇰 Hong Kong"},
        "etfs": {"title": "Global ETFs & Index Funds", "symbols": SCAN_ETFS, "type": "etfs", "country": "🌍 Global"},
        "crypto": {"title": "Cryptocurrency Live Prices", "symbols": SCAN_CRYPTO, "type": "crypto", "country": "₿ Crypto"},
        "commodities": {"title": "Gold, Oil & Commodities", "symbols": SCAN_COMMODITIES, "type": "commodities", "country": "🪙 Commodities"},
        "forex": {"title": "Forex — Currency Pairs", "symbols": SCAN_FOREX, "type": "forex", "country": "💱 Forex"},
    }

    if category == "all":
        # Fetch a curated subset from each category
        all_items = []
        for cat_key, cat_config in categories_config.items():
            # Take top N from each category to keep response fast
            top_n = 6 if cat_config["type"] in ("stocks",) else 8 if cat_config["type"] in ("etfs",) else 5
            symbols = cat_config["symbols"][:top_n]
            quotes = _batch_fetch(symbols, max_workers=6)
            quotes = [q for q in quotes if q.get("price") is not None]
            # Sort by absolute change%
            quotes.sort(key=lambda x: abs(x.get("changePct") or 0), reverse=True)
            all_items.append({
                "category": cat_key,
                "title": cat_config["title"],
                "type": cat_config["type"],
                "country": cat_config["country"],
                "items": quotes[:top_n],
            })
        result = {"categories": all_items, "fetchedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())}
    else:
        cat_config = categories_config.get(category)
        if not cat_config:
            return JSONResponse({"error": f"Unknown category: {category}"}, status_code=400)
        quotes = _batch_fetch(cat_config["symbols"], max_workers=8)
        quotes = [q for q in quotes if q.get("price") is not None]
        quotes.sort(key=lambda x: abs(x.get("changePct") or 0), reverse=True)
        result = {
            "category": category,
            "title": cat_config["title"],
            "type": cat_config["type"],
            "country": cat_config["country"],
            "items": quotes,
            "fetchedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        }

    _set_cache(cache_key, result)
    return result


# ═══════════════════════════════════════════════════════════════════════════
# Daily Trading Endpoint — Gainers, Losers, Most Active
# ═══════════════════════════════════════════════════════════════════════════

@router.get("/daily-trading")
def get_daily_trading():
    """
    Today's market movers: top gainers, top losers, most active, and sector performance.
    Scans 80+ US stocks and sorts by change%.
    """
    cache_key = "daily_trading"
    cached = _cached(cache_key)
    if cached:
        return cached

    try:
        all_us = list(dict.fromkeys(SCAN_STOCKS_US))  # dedupe while preserving order
        quotes = _batch_fetch(all_us, max_workers=10)

        valid = [q for q in quotes if q.get("price") is not None and q.get("changePct") is not None]
        errors = [q for q in quotes if q.get("error")]

        # Sort for different views
        gainers = sorted(valid, key=lambda x: x.get("changePct", 0), reverse=True)[:15]
        losers = sorted(valid, key=lambda x: x.get("changePct", 0))[:15]
        most_active = sorted(valid, key=lambda x: x.get("volume") or 0, reverse=True)[:15]

        # Sector summary
        sector_map: dict[str, list] = {}
        for q in valid:
            sector = q.get("sector") or "Other"
            if sector not in sector_map:
                sector_map[sector] = []
            sector_map[sector].append(q)

        sectors = []
        for sector_name, stocks in sector_map.items():
            avg_change = sum(s.get("changePct", 0) for s in stocks) / len(stocks) if stocks else 0
            sectors.append({
                "name": sector_name,
                "avgChange": round(avg_change, 2),
                "stockCount": len(stocks),
                "topStock": stocks[0]["name"] if stocks else "",
            })
        sectors.sort(key=lambda x: x["avgChange"], reverse=True)

        # Market breadth
        up = len([q for q in valid if (q.get("changePct") or 0) > 0])
        down = len([q for q in valid if (q.get("changePct") or 0) < 0])
        flat = len(valid) - up - down

        # Fear/Greed proxy based on average change
        avg_change = sum(q.get("changePct", 0) for q in valid) / len(valid) if valid else 0
        if avg_change > 1.5:
            sentiment = "Extreme Greed"
            sentimentEmoji = "🟢🟢🟢"
        elif avg_change > 0.5:
            sentiment = "Greed"
            sentimentEmoji = "🟢🟢"
        elif avg_change > -0.5:
            sentiment = "Neutral"
            sentimentEmoji = "⚪"
        elif avg_change > -1.5:
            sentiment = "Fear"
            sentimentEmoji = "🔴"
        else:
            sentiment = "Extreme Fear"
            sentimentEmoji = "🔴🔴"

        result = {
            "gainers": gainers,
            "losers": losers,
            "mostActive": most_active,
            "sectors": sectors,
            "marketBreadth": {
                "up": up,
                "down": down,
                "flat": flat,
                "total": len(valid),
                "avgChange": round(avg_change, 2),
            },
            "sentiment": {
                "label": sentiment,
                "emoji": sentimentEmoji,
                "avgChange": round(avg_change, 2),
            },
            "errors": len(errors),
            "fetchedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        }

        _set_cache(cache_key, result)
        return result

    except Exception as e:
        traceback.print_exc()
        return JSONResponse({"error": str(e)[:200]}, status_code=500)
