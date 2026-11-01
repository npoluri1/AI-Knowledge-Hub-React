"""
Market Data API — Live stock quotes, comparisons, and market overviews.
Uses yfinance for real-time Yahoo Finance data.
"""
from fastapi import APIRouter, Query
from fastapi.responses import JSONResponse
import yfinance as yf
import time
import traceback

router = APIRouter(prefix="/api/market", tags=["market"])

# ── In-memory cache (simple TTL) ──────────────────────────────────────────
_quote_cache: dict[str, dict] = {}
_CACHE_TTL = 30  # seconds


def _get_cached_quote(symbol: str) -> dict | None:
    """Return cached quote if fresh, else None."""
    entry = _quote_cache.get(symbol)
    if entry and (time.time() - entry["ts"]) < _CACHE_TTL:
        return entry["data"]
    return None


def _set_cached_quote(symbol: str, data: dict) -> None:
    _quote_cache[symbol] = {"data": data, "ts": time.time()}


# ── Popular tickers for quick access ──────────────────────────────────────
POPULAR_TICKERS = {
    "US": [
        {"symbol": "NVDA", "name": "NVIDIA Corp"},
        {"symbol": "AAPL", "name": "Apple Inc"},
        {"symbol": "MSFT", "name": "Microsoft Corp"},
        {"symbol": "AMZN", "name": "Amazon.com Inc"},
        {"symbol": "GOOGL", "name": "Alphabet Inc"},
        {"symbol": "META", "name": "Meta Platforms"},
        {"symbol": "TSLA", "name": "Tesla Inc"},
        {"symbol": "BRK-B", "name": "Berkshire Hathaway"},
        {"symbol": "V", "name": "Visa Inc"},
        {"symbol": "JPM", "name": "JPMorgan Chase"},
    ],
    "SG": [
        {"symbol": "D05.SI", "name": "DBS Group"},
        {"symbol": "O39.SI", "name": "OCBC Bank"},
        {"symbol": "U11.SI", "name": "UOB"},
        {"symbol": "Z74.SI", "name": "Singtel"},
        {"symbol": "N2IU.SI", "name": "Mapletree Industrial Trust"},
        {"symbol": "A17U.SI", "name": "Mapletree Logistics Trust"},
        {"symbol": "C38U.SI", "name": "CapitaLand Integrated"},
        {"symbol": "Y92.SI", "name": "Thai Beverage"},
    ],
    "IN": [
        {"symbol": "RELIANCE.NS", "name": "Reliance Industries"},
        {"symbol": "TCS.NS", "name": "Tata Consultancy"},
        {"symbol": "HDFCBANK.NS", "name": "HDFC Bank"},
        {"symbol": "INFY.NS", "name": "Infosys"},
        {"symbol": "ITC.NS", "name": "ITC Limited"},
        {"symbol": "BAJFINANCE.NS", "name": "Bajaj Finance"},
        {"symbol": "TATAMOTORS.NS", "name": "Tata Motors"},
        {"symbol": "SBIN.NS", "name": "State Bank of India"},
    ],
    "HK": [
        {"symbol": "0700.HK", "name": "Tencent Holdings"},
        {"symbol": "9988.HK", "name": "Alibaba Group"},
        {"symbol": "1211.HK", "name": "BYD Company"},
        {"symbol": "2318.HK", "name": "Ping An Insurance"},
        {"symbol": "3690.HK", "name": "Meituan"},
        {"symbol": "9618.HK", "name": "JD.com"},
    ],
    "JP": [
        {"symbol": "7203.T", "name": "Toyota Motor"},
        {"symbol": "6758.T", "name": "Sony Group"},
        {"symbol": "6857.T", "name": "Advantest Corp"},
        {"symbol": "6701.T", "name": "NEC Corp"},
    ],
    "KR": [
        {"symbol": "005930.KS", "name": "Samsung Electronics"},
        {"symbol": "000660.KS", "name": "SK Hynix"},
        {"symbol": "005380.KS", "name": "Hyundai Motor"},
        {"symbol": "051910.KS", "name": "LG Chem"},
    ],
    "GB": [
        {"symbol": "AZN.L", "name": "AstraZeneca"},
        {"symbol": "SHEL.L", "name": "Shell PLC"},
        {"symbol": "HSBA.L", "name": "HSBC Holdings"},
        {"symbol": "ULVR.L", "name": "Unilever"},
    ],
    "AU": [
        {"symbol": "BHP.AX", "name": "BHP Group"},
        {"symbol": "CBA.AX", "name": "Commonwealth Bank"},
        {"symbol": "CSL.AX", "name": "CSL Limited"},
        {"symbol": "FMG.AX", "name": "Fortescue Metals"},
    ],
    "EU": [
        {"symbol": "ASML.AS", "name": "ASML Holding"},
        {"symbol": "NOVO-B.CO", "name": "Novo Nordisk"},
        {"symbol": "MC.PA", "name": "LVMH"},
        {"symbol": "SAP.DE", "name": "SAP SE"},
        {"symbol": "NESN.SW", "name": "Nestlé"},
    ],
}


def _safe_float(val) -> float | None:
    """Convert yfinance value to float, or None."""
    try:
        if val is None:
            return None
        v = float(val)
        if v != v:  # NaN check
            return None
        return round(v, 4)
    except (TypeError, ValueError):
        return None


def _fetch_quote_data(symbol: str) -> dict:
    """Fetch a single stock quote from Yahoo Finance."""
    cached = _get_cached_quote(symbol)
    if cached:
        return cached

    try:
        ticker = yf.Ticker(symbol)
        info = ticker.info or {}

        # Fast-path: use the price info if available
        current_price = (
            _safe_float(info.get("currentPrice"))
            or _safe_float(info.get("regularMarketPrice"))
            or _safe_float(info.get("previousClose"))
        )

        prev_close = _safe_float(info.get("previousClose"))
        open_price = _safe_float(info.get("regularMarketOpen") or info.get("open"))
        day_high = _safe_float(info.get("dayHigh"))
        day_low = _safe_float(info.get("dayLow"))
        week52_high = _safe_float(info.get("fiftyTwoWeekHigh"))
        week52_low = _safe_float(info.get("fiftyTwoWeekLow"))
        volume = info.get("regularMarketVolume")
        market_cap = _safe_float(info.get("marketCap"))
        pe_ratio = _safe_float(info.get("trailingPE"))
        dividend_yield = _safe_float(info.get("dividendYield"))
        name = info.get("shortName") or info.get("longName") or symbol
        currency = info.get("currency", "USD")

        # Calculate change
        change = None
        change_pct = None
        if current_price is not None and prev_close is not None and prev_close > 0:
            change = round(current_price - prev_close, 4)
            change_pct = round((change / prev_close) * 100, 2)

        result = {
            "symbol": symbol,
            "name": name,
            "currency": currency,
            "price": current_price,
            "change": change,
            "changePct": change_pct,
            "open": open_price,
            "high": day_high,
            "low": day_low,
            "previousClose": prev_close,
            "week52High": week52_high,
            "week52Low": week52_low,
            "volume": volume,
            "marketCap": market_cap,
            "pe": pe_ratio,
            "dividendYield": dividend_yield,
            "fetchedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        }

        _set_cached_quote(symbol, result)
        return result

    except Exception as e:
        print(f"[market_api] Error fetching {symbol}: {e}")
        traceback.print_exc()
        return {
            "symbol": symbol,
            "name": symbol,
            "error": str(e)[:200],
            "price": None,
        }


# ═══════════════════════════════════════════════════════════════════════════
# API Endpoints
# ═══════════════════════════════════════════════════════════════════════════

@router.get("/quote")
def get_quote(symbol: str = Query(..., description="Stock ticker symbol")):
    """Get live quote for a single stock."""
    return _fetch_quote_data(symbol)


@router.get("/quotes")
def get_quotes(symbols: str = Query(..., description="Comma-separated symbols")):
    """Get live quotes for multiple stocks."""
    sym_list = [s.strip().upper() for s in symbols.split(",") if s.strip()]
    if not sym_list:
        return {"quotes": [], "error": "No symbols provided"}
    # Limit to 20 symbols per request
    sym_list = sym_list[:20]
    quotes = [_fetch_quote_data(s) for s in sym_list]
    return {"quotes": quotes}


@router.get("/compare")
def compare_stocks(
    symbol1: str = Query(..., description="First stock symbol"),
    symbol2: str = Query(..., description="Second stock symbol"),
):
    """Side-by-side comparison of two stocks."""
    q1 = _fetch_quote_data(symbol1)
    q2 = _fetch_quote_data(symbol2)

    # Build comparison metrics
    comparison = {
        "stock1": q1,
        "stock2": q2,
        "metrics": [],
    }

    def _add_metric(label, key, fmt="default"):
        v1 = q1.get(key)
        v2 = q2.get(key)
        if v1 is not None or v2 is not None:
            entry = {"label": label, "stock1": v1, "stock2": v2}
            if fmt == "currency" and v1 is not None and v2 is not None:
                entry["winner"] = "stock1" if v1 > v2 else "stock2" if v2 > v1 else "tie"
            elif fmt == "lower_better" and v1 is not None and v2 is not None:
                entry["winner"] = "stock1" if v1 < v2 else "stock2" if v2 < v1 else "tie"
            comparison["metrics"].append(entry)

    _add_metric("Current Price", "price", "currency")
    _add_metric("Day Change %", "changePct", "currency")
    _add_metric("Market Cap", "marketCap", "currency")
    _add_metric("P/E Ratio", "pe", "lower_better")
    _add_metric("Dividend Yield", "dividendYield", "currency")
    _add_metric("52-Week High", "week52High", "currency")
    _add_metric("52-Week Low", "week52Low", "currency")
    _add_metric("Day Open", "open", "currency")
    _add_metric("Day High", "high", "currency")
    _add_metric("Day Low", "low", "currency")
    _add_metric("Volume", "volume", "currency")

    return comparison


@router.get("/popular")
def get_popular_tickers():
    """Get list of popular tickers grouped by country."""
    return {"tickers": POPULAR_TICKERS}


@router.get("/popular/quotes")
def get_popular_quotes(country: str = Query("US", description="Country code")):
    """Get live quotes for popular tickers in a country."""
    tickers = POPULAR_TICKERS.get(country.upper(), POPULAR_TICKERS["US"])
    symbols = [t["symbol"] for t in tickers]
    quotes = [_fetch_quote_data(s) for s in symbols]
    return {"country": country, "quotes": quotes}


@router.get("/indices")
def get_market_indices():
    """Get major market indices overview."""
    indices = [
        {"symbol": "^GSPC", "name": "S&P 500", "country": "US"},
        {"symbol": "^IXIC", "name": "Nasdaq Composite", "country": "US"},
        {"symbol": "^DJI", "name": "Dow Jones", "country": "US"},
        {"symbol": "^RUT", "name": "Russell 2000", "country": "US"},
        {"symbol": "^STI", "name": "Straits Times Index", "country": "SG"},
        {"symbol": "^NSEI", "name": "Nifty 50", "country": "IN"},
        {"symbol": "^HSI", "name": "Hang Seng Index", "country": "HK"},
        {"symbol": "^N225", "name": "Nikkei 225", "country": "JP"},
        {"symbol": "^KS11", "name": "KOSPI", "country": "KR"},
        {"symbol": "^FTSE", "name": "FTSE 100", "country": "GB"},
        {"symbol": "^AXJO", "name": "ASX 200", "country": "AU"},
        {"symbol": "^GDAXI", "name": "DAX", "country": "EU"},
        {"symbol": "^FCHI", "name": "CAC 40", "country": "EU"},
        {"symbol": "GC=F", "name": "Gold Futures", "country": "Global"},
        {"symbol": "CL=F", "name": "Crude Oil (WTI)", "country": "Global"},
        {"symbol": "BTC-USD", "name": "Bitcoin", "country": "Crypto"},
        {"symbol": "ETH-USD", "name": "Ethereum", "country": "Crypto"},
    ]
    quotes = [_fetch_quote_data(idx["symbol"]) for idx in indices]
    # Merge name from our list if Yahoo doesn't have it
    for q, idx in zip(quotes, indices):
        if q.get("name") == q.get("symbol") or not q.get("name"):
            q["name"] = idx["name"]
        q["indexCountry"] = idx["country"]
    return {"indices": quotes}
