"""
Live Financial Advisor API — Provides comprehensive AI-style financial analysis
for any stock, combining real-time Yahoo Finance data with detailed insights.
"""
from fastapi import APIRouter, Query
from fastapi.responses import JSONResponse
import yfinance as yf
import time
import traceback
import math

router = APIRouter(prefix="/api/advisor", tags=["financial-advisor"])

# ── Quick analysis prompts ──────────────────────────────────────────────
ANALYSIS_TOPICS = {
    "company_overview": "📊 Company Overview & Profile",
    "financials": "💰 Financial Health & Performance",
    "growth": "📈 Growth Potential & Future Outlook",
    "valuation": "⚖️ Valuation Analysis (Is it fair priced?)",
    "dividends": "🏦 Dividend Analysis & Income Potential",
    "risk": "⚠️ Risk Assessment & Concerns",
    "sector": "🏭 Sector & Competitive Position",
    "technical": "📉 Technical Analysis & Price Levels",
    "investment": "🎯 Investment Thesis — Buy / Hold / Sell",
    "budget": "💵 Portfolio Budget Allocation Guide",
}


def _safe(val, decimals=2):
    try:
        if val is None:
            return None
        v = float(val)
        if v != v:  # NaN
            return None
        return round(v, decimals)
    except (TypeError, ValueError):
        return None


def _fmt_number(n):
    """Format large numbers to human-readable (e.g. 1.5T, 340B)."""
    if n is None:
        return "N/A"
    abs_n = abs(n)
    if abs_n >= 1e12:
        return f"${n/1e12:.2f}T"
    if abs_n >= 1e9:
        return f"${n/1e9:.2f}B"
    if abs_n >= 1e6:
        return f"${n/1e6:.2f}M"
    if abs_n >= 1e3:
        return f"${n/1e3:.1f}K"
    return f"${n:.2f}"


def _fmt_volume(v):
    if v is None:
        return "N/A"
    abs_v = abs(v)
    if abs_v >= 1e9:
        return f"{v/1e9:.2f}B"
    if abs_v >= 1e6:
        return f"{v/1e6:.2f}M"
    if abs_v >= 1e3:
        return f"{v/1e3:.1f}K"
    return str(int(v))


def _generate_analysis(info: dict, quote: dict) -> dict:
    """Generate a comprehensive analysis from Yahoo Finance info dict."""
    name = info.get("shortName") or info.get("longName") or "Unknown"
    sector = info.get("sector", "N/A")
    industry = info.get("industry", "N/A")
    country = info.get("country", "N/A")
    website = info.get("website", "N/A")
    employees = info.get("fullTimeEmployees")
    description = info.get("longBusinessSummary", "No description available.")[:800]

    price = quote.get("price")
    pe = quote.get("pe")
    market_cap = quote.get("marketCap")
    dividend_yield = quote.get("dividendYield")
    week52_high = quote.get("week52High")
    week52_low = quote.get("week52Low")
    volume = quote.get("volume")
    change_pct = quote.get("changePct")

    # Derived metrics
    beta = _safe(info.get("beta"))
    debt_to_equity = _safe(info.get("debtToEquity"))
    current_ratio = _safe(info.get("currentRatio"))
    return_on_equity = _safe(info.get("returnOnEquity"))
    profit_margin = _safe(info.get("profitMargins"))
    revenue_growth = _safe(info.get("revenueGrowth"))
    earnings_growth = _safe(info.get("earningsGrowth"))
    target_mean = _safe(info.get("targetMeanPrice"))
    target_high = _safe(info.get("targetHighPrice"))
    target_low = _safe(info.get("targetLowPrice"))
    recommendation = info.get("recommendationKey", "N/A")
    recommendation_mean = _safe(info.get("recommendationMean"))

    revenue = _safe(info.get("totalRevenue"))
    net_income = _safe(info.get("netIncomeToCommon"))
    free_cash_flow = _safe(info.get("freeCashflow"))
    total_cash = _safe(info.get("totalCash"))
    total_debt = _safe(info.get("totalDebt"))
    book_value = _safe(info.get("bookValue"))
    price_to_book = _safe(info.get("priceToBook"))
    peg_ratio = _safe(info.get("pegRatio"))
    ev_to_ebitda = _safe(info.get("enterpriseToEbitda"))
    short_ratio = _safe(info.get("shortRatio"))
    payout_ratio = _safe(info.get("payoutRatio"))

    # ── Company Overview ────────────────────────────────────────────────
    overview = {
        "title": "📊 Company Overview & Profile",
        "facts": [
            f"🏢 **Company:** {name}",
            f"🏭 **Sector:** {sector}",
            f"⚙️ **Industry:** {industry}",
            f"🌍 **Country:** {country}",
            f"🌐 **Website:** {website}",
            f"👥 **Employees:** {employees:,}" if employees else "👥 **Employees:** N/A",
            f"📋 **Business:** {description[:500]}{'...' if len(description) > 500 else ''}",
        ],
        "highlights": [],
    }

    if target_mean and price:
        upside = round(((target_mean - price) / price) * 100, 1)
        sign = "+" if upside > 0 else ""
        overview["highlights"].append(
            f"🎯 Analyst Target: ${target_mean} ({sign}{upside}% from current)"
        )
    if recommendation and recommendation != "N/A":
        overview["highlights"].append(f"📋 Analyst Recommendation: {recommendation.upper()}")
    if employees and employees > 10000:
        overview["highlights"].append(f"🏢 Large-cap employer with {employees:,} employees")

    # ── Financial Health ────────────────────────────────────────────────
    financials = {
        "title": "💰 Financial Health & Performance",
        "facts": [
            f"💵 **Revenue:** {_fmt_number(revenue)}" if revenue else "💵 **Revenue:** N/A",
            f"📈 **Net Income:** {_fmt_number(net_income)}" if net_income else "📈 **Net Income:** N/A",
            f"💎 **Free Cash Flow:** {_fmt_number(free_cash_flow)}" if free_cash_flow else "💎 **Free Cash Flow:** N/A",
            f"🏦 **Total Cash:** {_fmt_number(total_cash)}" if total_cash else "🏦 **Total Cash:** N/A",
            f"💳 **Total Debt:** {_fmt_number(total_debt)}" if total_debt else "💳 **Total Debt:** N/A",
            f"📊 **Book Value:** ${book_value}" if book_value else "📊 **Book Value:** N/A",
        ],
        "highlights": [],
    }

    if return_on_equity and return_on_equity > 0:
        roe_pct = round(return_on_equity * 100, 1)
        grade = "Excellent" if roe_pct > 20 else "Good" if roe_pct > 12 else "Average" if roe_pct > 8 else "Poor"
        financials["highlights"].append(f"🏆 ROE: {roe_pct}% — {grade}")

    if profit_margin is not None:
        pm_pct = round(profit_margin * 100, 1)
        grade = "Excellent" if pm_pct > 25 else "Good" if pm_pct > 15 else "Average" if pm_pct > 5 else "Low"
        financials["highlights"].append(f"💰 Profit Margin: {pm_pct}% — {grade}")

    if current_ratio:
        grade = "Strong" if current_ratio > 2 else "Healthy" if current_ratio > 1.2 else "Weak" if current_ratio < 1 else "Adequate"
        financials["highlights"].append(f"⚖️ Current Ratio: {current_ratio} — {grade}")

    if debt_to_equity:
        de = round(debt_to_equity, 1)
        grade = "Conservative" if de < 50 else "Moderate" if de < 150 else "Leveraged" if de < 300 else "Very High"
        financials["highlights"].append(f"💳 Debt/Equity: {de} — {grade}")

    # ── Growth ──────────────────────────────────────────────────────────
    growth = {
        "title": "📈 Growth Potential & Future Outlook",
        "facts": [],
        "highlights": [],
    }

    if revenue_growth is not None:
        rg = round(revenue_growth * 100, 1)
        growth["facts"].append(f"📊 **Revenue Growth (YoY):** {'+' if rg > 0 else ''}{rg}%")
        grade = "High Growth" if rg > 20 else "Moderate Growth" if rg > 5 else "Flat" if abs(rg) < 2 else "Declining"
        growth["highlights"].append(f"{'🚀' if rg > 10 else '📊'} Revenue Growth: {rg}% — {grade}")

    if earnings_growth is not None:
        eg = round(earnings_growth * 100, 1)
        growth["facts"].append(f"📈 **Earnings Growth (YoY):** {'+' if eg > 0 else ''}{eg}%")
        grade = "Explosive" if eg > 30 else "Strong" if eg > 15 else "Moderate" if eg > 0 else "Declining"
        growth["highlights"].append(f"{'🚀' if eg > 15 else '📈'} Earnings Growth: {eg}% — {grade}")

    if target_high and target_low and target_mean:
        growth["facts"].append(f"🎯 **Analyst Price Targets:**")
        growth["facts"].append(f"   High: ${target_high}")
        growth["facts"].append(f"   Mean: ${target_mean}")
        growth["facts"].append(f"   Low: ${target_low}")
        if price:
            upside_high = round(((target_high - price) / price) * 100, 1)
            upside_low = round(((target_low - price) / price) * 100, 1)
            growth["facts"].append(f"   Potential range: {'+' if upside_low > 0 else ''}{upside_low}% to +{upside_high}%")

    if peg_ratio:
        growth["facts"].append(f"📊 **PEG Ratio:** {peg_ratio}")
        grade = "Undervalued" if peg_ratio < 1 else "Fair Value" if peg_ratio < 1.5 else "Overvalued" if peg_ratio > 2 else "Slightly Expensive"
        growth["highlights"].append(f"⚖️ PEG Ratio: {peg_ratio} — {grade}")

    # ── Valuation ───────────────────────────────────────────────────────
    valuation = {
        "title": "⚖️ Valuation Analysis",
        "facts": [
            f"💵 **Current Price:** ${price}" if price else "💵 **Price:** N/A",
            f"📊 **P/E Ratio:** {pe}" if pe else "📊 **P/E Ratio:** N/A",
            f"📈 **Price/Book:** {price_to_book}" if price_to_book else "📈 **Price/Book:** N/A",
            f"⚡ **EV/EBITDA:** {ev_to_ebitda}" if ev_to_ebitda else "⚡ **EV/EBITDA:** N/A",
            f"🏢 **Market Cap:** {_fmt_number(market_cap)}" if market_cap else "🏢 **Market Cap:** N/A",
        ],
        "highlights": [],
    }

    if pe:
        grade = "Value" if pe < 15 else "Fair" if pe < 25 else "Growth-Priced" if pe < 40 else "Expensive" if pe < 80 else "Very Expensive"
        valuation["highlights"].append(f"📊 P/E {pe} — {grade}")
    if price_to_book:
        grade = "Cheap" if price_to_book < 1 else "Fair" if price_to_book < 3 else "Premium" if price_to_book < 8 else "Very Premium"
        valuation["highlights"].append(f"📖 P/B {price_to_book} — {grade}")
    if ev_to_ebitda:
        grade = "Attractive" if ev_to_ebitda < 10 else "Fair" if ev_to_ebitda < 15 else "Expensive" if ev_to_ebitda < 25 else "Very Expensive"
        valuation["highlights"].append(f"⚡ EV/EBITDA {ev_to_ebitda} — {grade}")

    if price and week52_high and week52_low and week52_high > week52_low:
        pct_from_high = round(((price - week52_high) / week52_high) * 100, 1)
        pct_from_low = round(((price - week52_low) / week52_low) * 100, 1)
        position = round(((price - week52_low) / (week52_high - week52_low)) * 100, 1)
        valuation["highlights"].append(f"📉 {pct_from_high}% from 52W High | +{pct_from_low}% from 52W Low")
        valuation["highlights"].append(f"📊 52-Week Position: {position}% (0%=Low, 100%=High)")

    # ── Dividends ───────────────────────────────────────────────────────
    dividends = {
        "title": "🏦 Dividend Analysis & Income Potential",
        "facts": [],
        "highlights": [],
    }

    if dividend_yield and dividend_yield > 0:
        dy = round(dividend_yield * 100, 2)
        dividends["facts"].append(f"💰 **Dividend Yield:** {dy}%")
        grade = "High Yield" if dy > 5 else "Good Yield" if dy > 3 else "Moderate" if dy > 1 else "Low Yield"
        dividends["highlights"].append(f"💰 Yield: {dy}% — {grade}")

        if payout_ratio:
            pr = round(payout_ratio * 100, 1)
            dividends["facts"].append(f"📊 **Payout Ratio:** {pr}%")
            grade = "Sustainable" if pr < 50 else "Moderate" if pr < 75 else "High Risk" if pr < 90 else "Unsustainable"
            dividends["highlights"].append(f"{'✅' if pr < 60 else '⚠️'} Payout: {pr}% — {grade}")

        if price and dy > 0:
            annual_div = round(price * dividend_yield, 2)
            dividends["facts"].append(f"💵 **Annual Dividend per Share:** ~${annual_div}")
            dividends["facts"].append(f"📅 **Quarterly Dividend:** ~${round(annual_div/4, 2)}")
            dividends["facts"].append(f"🏦 **Per $10,000 invested:** ~${round(10000 * dividend_yield, 0)}/year")
    else:
        dividends["facts"].append("❌ **No Dividend:** This company does not pay dividends")
        dividends["facts"].append("💡 Growth companies often reinvest profits instead of paying dividends")
        dividends["highlights"].append("🚀 Growth-focused — profits reinvested into the business")

    # ── Risk ────────────────────────────────────────────────────────────
    risk = {
        "title": "⚠️ Risk Assessment & Concerns",
        "facts": [],
        "highlights": [],
    }

    if beta:
        risk["facts"].append(f"📊 **Beta:** {beta}")
        if beta > 1.5:
            risk["highlights"].append(f"🔴 High Volatility (Beta {beta}) — Moves {round((beta-1)*100)}% more than market")
        elif beta > 1:
            risk["highlights"].append(f"🟡 Above-Average Volatility (Beta {beta})")
        elif beta > 0.5:
            risk["highlights"].append(f"🟢 Moderate Volatility (Beta {beta})")
        else:
            risk["highlights"].append(f"🟢 Low Volatility (Beta {beta}) — Defensive stock")

    if short_ratio and short_ratio > 0:
        risk["facts"].append(f"📊 **Short Interest Ratio:** {short_ratio}")
        grade = "Heavily Shorted" if short_ratio > 10 else "Elevated" if short_ratio > 5 else "Normal"
        risk["highlights"].append(f"{'🔴' if short_ratio > 8 else '🟡' if short_ratio > 4 else '🟢'} Short Interest: {grade}")

    if debt_to_equity:
        de = round(debt_to_equity, 1)
        if de > 200:
            risk["highlights"].append(f"🔴 High Debt Load (D/E: {de}) — Financial risk")
        elif de > 100:
            risk["highlights"].append(f"🟡 Moderate Debt (D/E: {de})")
        else:
            risk["highlights"].append(f"🟢 Conservative Debt (D/E: {de})")

    if not risk["facts"]:
        risk["facts"].append("ℹ️ Limited risk data available for this security")

    # ── Sector & Competition ────────────────────────────────────────────
    sector_analysis = {
        "title": "🏭 Sector & Competitive Position",
        "facts": [
            f"🏭 **Sector:** {sector}",
            f"⚙️ **Industry:** {industry}",
        ],
        "highlights": [],
    }

    if market_cap:
        cap = market_cap
        if cap > 200e9:
            cap_label = "Mega-Cap (>$200B) — Market Leader"
        elif cap > 10e9:
            cap_label = "Large-Cap ($10B-$200B) — Established"
        elif cap > 2e9:
            cap_label = "Mid-Cap ($2B-$10B) — Growth Potential"
        elif cap > 300e6:
            cap_label = "Small-Cap ($300M-$2B) — Higher Risk/Reward"
        else:
            cap_label = "Micro-Cap (<$300M) — Speculative"
        sector_analysis["highlights"].append(f"🏢 {cap_label}")

    # ── Technical ───────────────────────────────────────────────────────
    technical = {
        "title": "📉 Technical Analysis & Price Levels",
        "facts": [
            f"💵 **Current:** ${price}" if price else "",
            f"📈 **52W High:** ${week52_high}" if week52_high else "",
            f"📉 **52W Low:** ${week52_low}" if week52_low else "",
            f"📊 **Day Change:** {'+' if (change_pct or 0) > 0 else ''}{change_pct}%" if change_pct is not None else "",
            f"📊 **Volume:** {_fmt_volume(volume)}" if volume else "",
        ],
        "highlights": [],
    }
    technical["facts"] = [f for f in technical["facts"] if f]

    if price and week52_high and week52_low:
        position = round(((price - week52_low) / (week52_high - week52_low)) * 100)
        if position > 80:
            technical["highlights"].append("🔴 Near 52-Week High — Caution: may be overbought")
        elif position > 60:
            technical["highlights"].append("🟡 Above midpoint — Bullish zone")
        elif position > 40:
            technical["highlights"].append("🟡 Near midpoint — Neutral zone")
        elif position > 20:
            technical["highlights"].append("🟢 Below midpoint — Potential value zone")
        else:
            technical["highlights"].append("🟢 Near 52-Week Low — Possible deep value opportunity")

        if change_pct is not None:
            if change_pct > 3:
                technical["highlights"].append("🚀 Strong upward momentum today")
            elif change_pct > 1:
                technical["highlights"].append("📈 Positive momentum today")
            elif change_pct < -3:
                technical["highlights"].append("📉 Significant selling pressure today")
            elif change_pct < -1:
                technical["highlights"].append("⚠️ Down today — watch for support levels")

    # ── Investment Thesis ───────────────────────────────────────────────
    investment = {
        "title": "🎯 Investment Thesis — Buy / Hold / Sell",
        "facts": [],
        "highlights": [],
    }

    bullish = 0
    bearish = 0
    signals = []

    if pe and pe > 0:
        if pe < 15:
            bullish += 2
            signals.append("✅ Attractive P/E ratio")
        elif pe < 25:
            bullish += 1
            signals.append("✅ Fair P/E ratio")
        elif pe < 50:
            signals.append("⚖️ Moderate P/E — growth expected")
        else:
            bearish += 2
            signals.append("⚠️ High P/E — priced for perfection")

    if return_on_equity and return_on_equity > 0:
        roe_pct = round(return_on_equity * 100, 1)
        if roe_pct > 20:
            bullish += 2
            signals.append(f"✅ Excellent ROE ({roe_pct}%)")
        elif roe_pct > 12:
            bullish += 1
            signals.append(f"✅ Good ROE ({roe_pct}%)")
        else:
            signals.append(f"⚖️ Average ROE ({roe_pct}%)")

    if revenue_growth is not None:
        rg = round(revenue_growth * 100, 1)
        if rg > 15:
            bullish += 2
            signals.append(f"✅ Strong revenue growth ({rg}%)")
        elif rg > 5:
            bullish += 1
            signals.append(f"✅ Positive revenue growth ({rg}%)")
        elif rg < -5:
            bearish += 2
            signals.append(f"⚠️ Revenue declining ({rg}%)")
        else:
            signals.append(f"⚖️ Flat revenue ({rg}%)")

    if profit_margin is not None:
        pm = round(profit_margin * 100, 1)
        if pm > 20:
            bullish += 1
            signals.append(f"✅ High profit margin ({pm}%)")
        elif pm < 0:
            bearish += 2
            signals.append(f"⚠️ Negative profit margin ({pm}%)")

    if debt_to_equity and debt_to_equity > 200:
        bearish += 1
        signals.append("⚠️ High debt levels")

    if dividend_yield and dividend_yield > 0.03:
        bullish += 1
        signals.append(f"✅ Good dividend yield ({round(dividend_yield*100, 1)}%)")

    if beta and beta > 2:
        bearish += 1
        signals.append("⚠️ Very high volatility")

    total = bullish + bearish
    if total > 0:
        score = round((bullish / total) * 100)
    else:
        score = 50

    if score >= 70:
        verdict = "🟢 **STRONG BUY** — Multiple bullish signals. Consider building a position."
    elif score >= 55:
        verdict = "🟢 **BUY** — More positives than negatives. Suitable for accumulation."
    elif score >= 45:
        verdict = "🟡 **HOLD** — Mixed signals. Hold existing positions, wait for clarity."
    elif score >= 30:
        verdict = "🟠 **HOLD / REDUCE** — More concerns than positives. Consider trimming."
    else:
        verdict = "🔴 **SELL / AVOID** — Significant concerns. Consider exiting or avoiding."

    investment["facts"].append(f"**Overall Score:** {score}/100 (Bullish: {bullish}, Bearish: {bearish})")
    investment["facts"].append(f"**Verdict:** {verdict}")
    investment["facts"].append("")
    investment["facts"].append("**Signal Breakdown:**")
    for s in signals:
        investment["facts"].append(f"   {s}")

    investment["highlights"].append(verdict)

    # ── Budget Allocation Guide ──────────────────────────────────────────
    budget = {
        "title": "💵 Portfolio Budget Allocation Guide",
        "facts": [],
        "highlights": [],
    }

    risk_level = "Conservative"
    max_allocation = "5-10%"
    if beta and beta > 1.5:
        risk_level = "Aggressive"
        max_allocation = "3-5%"
    elif beta and beta > 1.0:
        risk_level = "Moderate"
        max_allocation = "5-10%"
    else:
        max_allocation = "10-15%"

    budget["facts"].append(f"📊 **Risk Level:** {risk_level}")
    budget["facts"].append(f"💡 **Max Portfolio Allocation:** {max_allocation}")
    budget["facts"].append("")

    budget["facts"].append("**For a $10,000 portfolio:**")
    budget["facts"].append(f"   💰 Conservative (low risk): Invest $500-$1,000 ({max_allocation})")
    budget["facts"].append(f"   💰 Moderate risk: Invest $500-$1,000 ({max_allocation})")
    budget["facts"].append(f"   💰 Aggressive: Invest $300-$500 ({max_allocation})")
    budget["facts"].append("")

    budget["facts"].append("**For a $50,000 portfolio:**")
    budget["facts"].append(f"   💰 Conservative: Invest $2,500-$5,000")
    budget["facts"].append(f"   💰 Moderate: Invest $2,500-$5,000")
    budget["facts"].append(f"   💰 Aggressive: Invest $1,500-$2,500")
    budget["facts"].append("")

    budget["facts"].append("**Entry Strategy:**")
    budget["facts"].append("   📊 Lump Sum: Buy all at once if you're confident")
    budget["facts"].append("   📊 DCA (Dollar-Cost Average): Split into 3-4 buys over weeks")
    budget["facts"].append("   📊 Limit Orders: Set buy price at 3-5% below current for better entry")

    budget["highlights"].append(f"📊 {risk_level} stock — Max {max_allocation} of portfolio")

    return {
        "sections": [
            overview,
            financials,
            growth,
            valuation,
            dividends,
            risk,
            sector_analysis,
            technical,
            investment,
            budget,
        ],
        "quickStats": {
            "price": price,
            "changePct": change_pct,
            "marketCap": _fmt_number(market_cap),
            "pe": pe,
            "dividendYield": f"{round(dividend_yield*100, 2)}%" if dividend_yield else "N/A",
            "week52High": week52_high,
            "week52Low": week52_low,
            "beta": beta,
            "recommendation": recommendation,
            "score": score if total > 0 else None,
            "verdict": verdict if total > 0 else "Insufficient data",
        },
    }


@router.get("/analyze")
def analyze_stock(symbol: str = Query(..., description="Stock ticker symbol")):
    """Full financial analysis for a stock — company overview, financials, growth, valuation, risk, investment thesis."""
    try:
        ticker = yf.Ticker(symbol)
        info = ticker.info or {}

        # Build quote data
        price = _safe(info.get("currentPrice") or info.get("regularMarketPrice") or info.get("previousClose"))
        prev_close = _safe(info.get("previousClose"))
        change = None
        change_pct = None
        if price and prev_close and prev_close > 0:
            change = round(price - prev_close, 4)
            change_pct = round((change / prev_close) * 100, 2)

        # Fix dividend yield: Yahoo returns >1 (e.g. 1.21 = 1.21%), normalize to decimal
        raw_dy = info.get("dividendYield")
        dividend_yield = _safe(raw_dy)
        if dividend_yield is not None and dividend_yield > 1:
            dividend_yield = dividend_yield / 100

        quote = {
            "symbol": symbol,
            "name": info.get("shortName") or info.get("longName") or symbol,
            "price": price,
            "change": change,
            "changePct": change_pct,
            "marketCap": _safe(info.get("marketCap")),
            "pe": _safe(info.get("trailingPE")),
            "dividendYield": dividend_yield,
            "week52High": _safe(info.get("fiftyTwoWeekHigh")),
            "week52Low": _safe(info.get("fiftyTwoWeekLow")),
            "volume": info.get("regularMarketVolume"),
        }

        analysis = _generate_analysis(info, quote)
        analysis["symbol"] = symbol
        analysis["name"] = quote["name"]
        analysis["fetchedAt"] = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())

        return analysis

    except Exception as e:
        traceback.print_exc()
        return JSONResponse(
            status_code=500,
            content={"error": str(e)[:300], "symbol": symbol},
        )


@router.get("/quick-quote")
def quick_quote(symbol: str = Query(..., description="Stock ticker symbol")):
    """Quick single-line summary for the advisor chat."""
    try:
        ticker = yf.Ticker(symbol)
        info = ticker.info or {}

        price = _safe(info.get("currentPrice") or info.get("regularMarketPrice") or info.get("previousClose"))
        prev_close = _safe(info.get("previousClose"))
        change_pct = None
        if price and prev_close and prev_close > 0:
            change_pct = round(((price - prev_close) / prev_close) * 100, 2)

        name = info.get("shortName") or info.get("longName") or symbol
        sector = info.get("sector", "N/A")
        pe = _safe(info.get("trailingPE"))
        market_cap = _safe(info.get("marketCap"))
        dividend_yield = _safe(info.get("dividendYield"))
        if dividend_yield is not None and dividend_yield > 1:
            dividend_yield = dividend_yield / 100
        recommendation = info.get("recommendationKey", "N/A")
        target_mean = _safe(info.get("targetMeanPrice"))

        return {
            "symbol": symbol,
            "name": name,
            "price": price,
            "changePct": change_pct,
            "sector": sector,
            "pe": pe,
            "marketCap": _fmt_number(market_cap),
            "dividendYield": f"{round(dividend_yield*100, 2)}%" if dividend_yield else "N/A",
            "recommendation": recommendation,
            "targetMean": target_mean,
            "fetchedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        }
    except Exception as e:
        return {"symbol": symbol, "error": str(e)[:200]}


# ═══════════════════════════════════════════════════════════════════════════
# TRADING NEWS — Fetch latest market news via Yahoo Finance
# ═══════════════════════════════════════════════════════════════════════════

NEWS_TOPICS = {
    "general": {"name": "🌐 General Market News", "symbols": ["^GSPC", "^IXIC", "^DJI"]},
    "us": {"name": "🇺🇸 US Market", "symbols": ["^GSPC", "^IXIC", "AAPL", "NVDA", "TSLA"]},
    "asia": {"name": "🌏 Asia Pacific", "symbols": ["^HSI", "^N225", "^NSEI", "^STI"]},
    "crypto": {"name": "₿ Crypto", "symbols": ["BTC-USD", "ETH-USD", "SOL-USD"]},
    "commodities": {"name": "🪙 Commodities", "symbols": ["GC=F", "CL=F", "SI=F"]},
    "tech": {"name": "💻 Technology", "symbols": ["NVDA", "AAPL", "MSFT", "GOOGL", "META"]},
    "finance": {"name": "🏦 Banking & Finance", "symbols": ["JPM", "GS", "BAC", "V"]},
    "energy": {"name": "⚡ Energy", "symbols": ["XOM", "CVX", "COP", "BP"]},
}


@router.get("/news")
def get_trading_news(topic: str = Query("general", description="News topic")):
    """Fetch latest trading news for a topic using Yahoo Finance RSS."""
    topic_config = NEWS_TOPICS.get(topic, NEWS_TOPICS["general"])
    news_items = []

    for symbol in topic_config["symbols"]:
        try:
            ticker = yf.Ticker(symbol)
            raw_news = ticker.news or []
            for item in raw_news[:5]:
                # yfinance wraps news under 'content' key
                content = item.get("content", item)
                title = content.get("title", "") or item.get("title", "")
                link = content.get("canonicalUrl", {}).get("url", "") or content.get("link", "") or item.get("link", "")
                publisher = content.get("provider", {}).get("displayName", "") or content.get("publisher", "") or item.get("publisher", "")
                published_str = content.get("pubDate", "") or content.get("displayTime", "")
                # Convert ISO date to epoch
                published = None
                if published_str:
                    try:
                        from datetime import datetime
                        published = int(datetime.fromisoformat(published_str.replace("Z", "+00:00")).timestamp())
                    except Exception:
                        published = published_str
                # Thumbnail
                thumb = content.get("thumbnail", {})
                resolutions = thumb.get("resolutions", []) if isinstance(thumb, dict) else []
                thumbnail = resolutions[0].get("url") if resolutions else None
                # Try SQ default image
                if not thumbnail:
                    images = content.get("images", [])
                    if images and isinstance(images, list) and len(images) > 0:
                        thumbnail = images[0].get("url") if isinstance(images[0], dict) else None

                if title:
                    news_items.append({
                        "title": title,
                        "url": link,
                        "publisher": publisher,
                        "symbol": symbol,
                        "thumbnail": thumbnail,
                        "publishedAt": published,
                    })
        except Exception:
            continue

    # Deduplicate by title
    seen = set()
    unique_news = []
    for item in news_items:
        t = item["title"][:80]
        if t not in seen:
            seen.add(t)
            unique_news.append(item)

    return {
        "topic": topic,
        "topicName": topic_config["name"],
        "count": len(unique_news),
        "news": unique_news[:30],
        "fetchedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
    }


@router.get("/news/stock")
def get_stock_news(symbol: str = Query(..., description="Stock ticker")):
    """Fetch latest news for a specific stock."""
    try:
        ticker = yf.Ticker(symbol)
        info = ticker.info or {}
        name = info.get("shortName") or info.get("longName") or symbol
        raw_news = ticker.news or []

        items = []
        for item in raw_news[:15]:
            content = item.get("content", item)
            title = content.get("title", "") or item.get("title", "")
            link = content.get("canonicalUrl", {}).get("url", "") or content.get("link", "") or item.get("link", "")
            publisher = content.get("provider", {}).get("displayName", "") or content.get("publisher", "") or item.get("publisher", "")
            published_str = content.get("pubDate", "") or content.get("displayTime", "")
            published = None
            if published_str:
                try:
                    from datetime import datetime
                    published = int(datetime.fromisoformat(published_str.replace("Z", "+00:00")).timestamp())
                except Exception:
                    published = published_str
            thumb = content.get("thumbnail", {})
            resolutions = thumb.get("resolutions", []) if isinstance(thumb, dict) else []
            thumbnail = resolutions[0].get("url") if resolutions else None
            if not thumbnail:
                images = content.get("images", [])
                if images and isinstance(images, list) and len(images) > 0:
                    thumbnail = images[0].get("url") if isinstance(images[0], dict) else None

            if title:
                items.append({
                    "title": title,
                    "url": link,
                    "publisher": publisher,
                    "symbol": symbol,
                    "stockName": name,
                    "thumbnail": thumbnail,
                    "publishedAt": published,
                })

        return {
            "symbol": symbol,
            "stockName": name,
            "count": len(items),
            "news": items,
            "fetchedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        }
    except Exception as e:
        return {"symbol": symbol, "error": str(e)[:200], "news": []}
