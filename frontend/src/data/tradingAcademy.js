// Trading Academy content: learn-every-way path, chart patterns, indicators,
// investment types, horizons and risk. Educational only — not financial advice.
import { U } from './menuVisuals'

export const IMG = {
  candles: '1611974789855-9c2a0a7236a3', screen: '1590283603385-17ffb3a7f29f', laptopAnalytics: '1460925895917-afdab827c52f',
  dashboard: '1551288049-bebda4e38f71', gold: '1610375461246-83df859d849d', bitcoin: '1518546305927-5a555bb7020d',
  cryptoApp: '1621761191319-c6fb62004040', growth: '1579621970563-ebec7560ff3e', tax: '1554224155-6726b3ff858f',
  house: '1560518883-ce09059eeffa', industry: '1513828583688-c52646db42da', currencies: '1580519542036-c47de6196ba5',
  laptopChart: '1569025690938-a00729c9e1f9', jar: '1579621970795-87facc2f976d', singapore: '1525625293386-3f8f99389edd',
  chess: '1529699211952-734e80c4d42b', calm: '1506126613408-eca07ce68773', darkChart: '1642790106117-e829e14a795f',
  candles2: '1640340434855-6084b1f4901c', revenue: '1559526324-4b87b5e36e44', cash: '1526304640581-d334cdbbf45e',
  apps: '1563986768494-4dee2763ff3f', piggy: '1607863680198-23d4b2565df0', trader: '1638913662252-70efce1e60a7',
  paperChart: '1543286386-713bdd548da4', portfolio: '1434626881859-194d67b2b86f', phoneTrading: '1612178991541-b48cc8e92a4d',
  lineScreen: '1535320903710-d993d3d77d29', coins: '1604594849809-dfedbc827105',
}
export const img = (k, w = 600, h = 360) => U(IMG[k], w, h)

/* ─────────── Learn every way: 8 stages, each with lessons ─────────── */
export const LEARN_PATH = [
  {
    id: 'foundations', n: 1, title: 'Money foundations', img: 'growth', color: '#2ee6a8',
    goal: 'Know why investing beats saving, and what you must have in place first.',
    lessons: [
      { t: 'Compounding', lay: 'Money that earns money, which then earns more money — a snowball rolling downhill.', ex: '$500/month at 8% for 30 years ≈ $745,000. You put in $180,000; compounding added the rest.', remember: 'Time in the market > timing the market.' },
      { t: 'Inflation', lay: 'Prices rise ~2–4% a year, so cash under the mattress quietly shrinks.', ex: '$100 today buys about $74 of goods in 10 years at 3% inflation.', remember: 'Cash is safe from crashes, not from inflation.' },
      { t: 'Emergency fund first', lay: 'Before investing, keep 6 months of expenses in a high-yield savings account or T-bills.', ex: 'Spend $3,000/month → keep $18,000 aside. Then invest the rest.', remember: 'Never be a forced seller.' },
      { t: 'Risk vs return', lay: 'Higher possible return always comes with bigger possible drops.', ex: 'Stocks: ~10%/yr long-run, −50% in bad years. Bonds: ~4%, −15% worst. Cash: ~3%, never drops.', remember: 'No free lunch — only diversification comes close.' },
    ],
  },
  {
    id: 'markets', n: 2, title: 'How markets work', img: 'screen', color: '#4da6ff',
    goal: 'Understand exchanges, orders, bid/ask and what moves prices.',
    lessons: [
      { t: 'Exchanges & brokers', lay: 'The exchange is the marketplace (NYSE, SGX, NSE). The broker is your shop entrance (Moomoo, IBKR, Zerodha).', ex: 'You tap Buy on Moomoo → order routed to NASDAQ → matched with a seller in milliseconds.', remember: 'Broker = door, exchange = market.' },
      { t: 'Bid, ask & spread', lay: 'Bid = best price buyers offer. Ask = best price sellers want. The gap is the spread — a hidden cost.', ex: 'AAPL bid 230.10 / ask 230.12 → 2¢ spread. A small-cap might be 5¢–50¢.', remember: 'Liquid = tight spread = cheaper to trade.' },
      { t: 'Order types', lay: 'Market = buy now at any price. Limit = only at my price or better. Stop = trigger when price hits a level.', ex: 'Limit buy NVDA at $180 waits until price falls to $180.', remember: 'Use limit orders; market orders can surprise you.' },
      { t: 'What moves prices', lay: 'Earnings, interest rates, news, and crowd emotion (fear and greed).', ex: 'Fed cuts rates → borrowing cheaper → growth stocks often rally.', remember: 'Short term = emotion. Long term = earnings.' },
    ],
  },
  {
    id: 'charts', n: 3, title: 'Reading charts', img: 'candles', color: '#ffd24a',
    goal: 'Read candlesticks, trends, support & resistance and volume at a glance.',
    lessons: [
      { t: 'Candlesticks', lay: 'Each candle = one period. Body shows open→close; wicks show the high and low. Green = closed up, red = closed down.', ex: 'Long lower wick = buyers rejected lower prices (a "hammer").', remember: 'Body = conviction, wick = rejection.' },
      { t: 'Trend', lay: 'Uptrend = higher highs and higher lows. Downtrend = lower highs and lower lows.', ex: 'Price above a rising 50-day average = medium-term uptrend.', remember: 'The trend is your friend until it bends.' },
      { t: 'Support & resistance', lay: 'Support = a floor where buyers stepped in before. Resistance = a ceiling where sellers appeared.', ex: 'Stock bounced at $100 three times → $100 is support.', remember: 'Broken resistance often becomes new support.' },
      { t: 'Volume', lay: 'How many shares traded. Big moves on big volume are more believable.', ex: 'Breakout above $120 on 3× normal volume = strong signal.', remember: 'Volume confirms price.' },
    ],
  },
  {
    id: 'technical', n: 4, title: 'Technical analysis', img: 'darkChart', color: '#b388ff',
    goal: 'Use indicators to time entries and exits — and know their limits.',
    lessons: [
      { t: 'Moving averages', lay: 'The average price over N days, drawn as a smooth line to show the trend.', ex: '50-day crossing above 200-day = "golden cross".', remember: '20 = short, 50 = medium, 200 = long-term trend.' },
      { t: 'RSI', lay: 'A 0–100 speedometer of recent gains vs losses.', ex: 'RSI 78 = overbought (stretched up). RSI 25 = oversold.', remember: '>70 hot, <30 cold — but strong trends stay hot.' },
      { t: 'MACD', lay: 'Difference between a fast and slow average — shows momentum shifts.', ex: 'MACD line crosses above signal line = momentum turning up.', remember: 'Crossovers signal, histogram shows strength.' },
      { t: 'Bollinger Bands', lay: 'A channel 2 standard deviations around the 20-day average.', ex: 'Bands squeeze tight → a big move is often coming.', remember: 'Squeeze before the breakout.' },
    ],
  },
  {
    id: 'fundamental', n: 5, title: 'Fundamental analysis', img: 'revenue', color: '#35e0ff',
    goal: 'Judge whether a business is worth owning and at what price.',
    lessons: [
      { t: 'P/E ratio', lay: 'Price ÷ earnings per share — how many years of profit you pay for.', ex: 'P/E 25 = you pay $25 for every $1 of yearly profit.', remember: 'High P/E needs high growth to justify it.' },
      { t: 'Revenue & margin growth', lay: 'Is the company selling more, and keeping more of each dollar?', ex: 'Revenue +30%, operating margin 20% → 35% = quality growth.', remember: 'Growing sales + rising margins = compounding machine.' },
      { t: 'Debt & cash flow', lay: 'Free cash flow is real cash left after running the business. Debt is a risk in bad times.', ex: 'Debt/Equity under 1 and positive free cash flow = safer.', remember: 'Cash flow is fact, earnings are opinion.' },
      { t: 'Moat', lay: 'A durable advantage competitors cannot copy easily — brand, network, cost, switching costs.', ex: 'Visa: every new merchant makes cards more useful (network effect).', remember: 'Buy castles with wide moats.' },
    ],
  },
  {
    id: 'risk', n: 6, title: 'Risk management', img: 'chess', color: '#ff6b9d',
    goal: 'Survive bad trades so the good ones can pay you.',
    lessons: [
      { t: 'The 1–2% rule', lay: 'Never risk more than 1–2% of your account on one trade.', ex: '$20,000 account → max loss per trade $200–$400.', remember: 'Small losses, always.' },
      { t: 'Position sizing', lay: 'Size = money at risk ÷ distance to stop-loss.', ex: 'Risk $200, entry $50, stop $46 → $4 risk/share → buy 50 shares.', remember: 'The stop decides the size, not the feeling.' },
      { t: 'Risk / reward', lay: 'Only take trades where the potential win is at least 2× the potential loss.', ex: 'Risk $4 to make $10 = 1 : 2.5 ✔', remember: 'With 1:2, you can be wrong 60% of the time and still profit.' },
      { t: 'Diversification', lay: 'Spread money across assets, sectors and countries that do not move together.', ex: '60% global stocks, 30% bonds, 10% gold.', remember: 'Do not put all eggs in one basket.' },
    ],
  },
  {
    id: 'psychology', n: 7, title: 'Trading psychology', img: 'calm', color: '#ff8c42',
    goal: 'Beat the two enemies: fear and greed.',
    lessons: [
      { t: 'FOMO', lay: 'Fear of missing out makes you buy after a huge run-up — usually near the top.', ex: 'Buying a meme stock after +300% in a week.', remember: 'If everyone is talking about it, you are late.' },
      { t: 'Loss aversion', lay: 'Losses hurt twice as much as gains feel good, so people hold losers too long.', ex: 'Holding a −40% stock "until it comes back".', remember: 'Would I buy it today? If not, why hold it?' },
      { t: 'Trading journal', lay: 'Write every trade: why, entry, exit, emotion, result.', ex: 'After 50 trades you see your patterns — e.g. you lose on Fridays.', remember: 'What gets measured gets improved.' },
      { t: 'Have a plan', lay: 'Decide entry, stop and target BEFORE you click buy.', ex: '"Buy at $50, stop $46, target $60, exit if thesis breaks."', remember: 'Plan the trade, trade the plan.' },
    ],
  },
  {
    id: 'advanced', n: 8, title: 'Advanced & AI-driven', img: 'trader', color: '#c2a5ff',
    goal: 'Options, quant strategies and how AI is used in modern trading.',
    lessons: [
      { t: 'Options basics', lay: 'A call = right to buy at a price. A put = right to sell. You pay a premium for that right.', ex: 'Buy a protective put to insure your portfolio against a crash.', remember: 'Options = insurance or leverage. Respect both.' },
      { t: 'Backtesting', lay: 'Test a strategy on historical data before risking money.', ex: 'Golden-cross strategy on S&P 500 since 2000 — check win rate & drawdown.', remember: 'Past results ≠ future results, but no backtest = gambling.' },
      { t: 'Quant & factor investing', lay: 'Rules-based picking by factors like value, momentum, quality, low volatility.', ex: 'Momentum ETF (MTUM) buys recent winners and rebalances.', remember: 'Rules beat moods.' },
      { t: 'AI in trading', lay: 'Machine learning for sentiment (news, social), forecasting, and execution. LLMs summarise earnings calls.', ex: 'Score 10,000 headlines a day for positive/negative tone per ticker.', remember: 'AI finds patterns, humans own the risk.' },
    ],
  },
]

/* ─────────── Chart patterns — normalised points (x 0..100, y 0..100 where 0 = top) ─────────── */
export const PATTERNS = [
  { name: 'Head & Shoulders', bias: 'bearish', pts: [[0, 80], [15, 45], [25, 60], [45, 15], [60, 60], [75, 45], [85, 62], [100, 90]], neck: [[10, 60], [90, 62]], meaning: 'Three peaks with a higher middle. A break of the neckline often ends an uptrend.', tip: 'Target ≈ head-to-neckline height, projected down from the break.' },
  { name: 'Inverse H&S', bias: 'bullish', pts: [[0, 20], [15, 55], [25, 40], [45, 85], [60, 40], [75, 55], [85, 38], [100, 10]], neck: [[10, 40], [90, 38]], meaning: 'Mirror image at a bottom — a reversal from down to up.', tip: 'Buy the neckline breakout with volume.' },
  { name: 'Double Top', bias: 'bearish', pts: [[0, 85], [25, 20], [45, 55], [65, 20], [85, 60], [100, 90]], neck: [[30, 55], [90, 55]], meaning: 'Price fails twice at the same high — buyers exhausted.', tip: 'Confirmed only when the middle low breaks.' },
  { name: 'Double Bottom ("W")', bias: 'bullish', pts: [[0, 15], [25, 80], [45, 45], [65, 80], [85, 40], [100, 10]], neck: [[30, 45], [90, 45]], meaning: 'Sellers fail twice at the same low — a floor forms.', tip: 'Enter on the break above the middle peak.' },
  { name: 'Bull Flag', bias: 'bullish', pts: [[0, 90], [30, 25], [40, 35], [50, 28], [60, 40], [70, 33], [100, 5]], neck: null, meaning: 'A sharp rally (pole), a small orderly pullback (flag), then continuation.', tip: 'Flag should retrace less than half the pole.' },
  { name: 'Cup & Handle', bias: 'bullish', pts: [[0, 20], [15, 55], [35, 75], [55, 55], [70, 22], [78, 35], [86, 30], [100, 8]], neck: [[0, 20], [86, 20]], meaning: 'A rounded base then a small dip — a classic long-term breakout pattern.', tip: 'Breakout above the cup rim with volume.' },
  { name: 'Ascending Triangle', bias: 'bullish', pts: [[0, 85], [15, 25], [30, 65], [45, 25], [60, 48], [75, 25], [85, 35], [100, 5]], neck: [[10, 25], [85, 25]], meaning: 'Flat resistance with rising lows — buyers getting more aggressive.', tip: 'Usually breaks upward.' },
  { name: 'Descending Triangle', bias: 'bearish', pts: [[0, 15], [15, 75], [30, 35], [45, 75], [60, 52], [75, 75], [85, 65], [100, 95]], neck: [[10, 75], [85, 75]], meaning: 'Flat support with falling highs — sellers pressing down.', tip: 'Usually breaks downward.' },
]

/* ─────────── Candlestick signals ─────────── */
export const CANDLES = [
  { name: 'Hammer', o: 60, c: 66, h: 64, l: 95, bias: 'bullish', meaning: 'Long lower wick at a bottom — buyers rejected lower prices.' },
  { name: 'Shooting Star', o: 40, c: 34, h: 5, l: 36, bias: 'bearish', meaning: 'Long upper wick at a top — sellers rejected higher prices.' },
  { name: 'Doji', o: 50, c: 50, h: 15, l: 85, bias: 'neutral', meaning: 'Open ≈ close — indecision; watch the next candle.' },
  { name: 'Marubozu (bull)', o: 85, c: 15, h: 15, l: 85, bias: 'bullish', meaning: 'All body, no wicks — buyers in total control.' },
  { name: 'Marubozu (bear)', o: 15, c: 85, h: 15, l: 85, bias: 'bearish', meaning: 'All body, no wicks — sellers in total control.' },
  { name: 'Spinning Top', o: 45, c: 55, h: 15, l: 85, bias: 'neutral', meaning: 'Small body, long wicks both sides — tug of war.' },
]

/* ─────────── Every way to invest ─────────── */
// risk/return/liquidity on a 1–5 scale; retLo/retHi = rough long-run annual return range (%)
export const INVESTMENT_TYPES = [
  { id: 'cash', name: 'Savings & money market', icon: '🏦', img: 'piggy', risk: 1, liq: 5, retLo: 2, retHi: 4, horizon: 'Any', min: '$1', how: 'High-yield savings, money-market funds, SG T-bills, fixed deposits.', best: 'Emergency fund, money needed within 1–2 years.', watch: 'Loses to inflation over decades.', sym: 'SGOV' },
  { id: 'govbond', name: 'Government bonds', icon: '🏛️', img: 'jar', risk: 1, liq: 4, retLo: 3, retHi: 5, horizon: '1–10 yrs', min: '$500 (SSB) / 1 ETF unit', how: 'Singapore Savings Bonds, US Treasuries, Indian G-secs, or bond ETFs (TLT, IEF, A35).', best: 'Stability, steady income, balancing stocks.', watch: 'Prices fall when interest rates rise.', sym: 'IEF' },
  { id: 'corpbond', name: 'Corporate bonds', icon: '📜', img: 'tax', risk: 2, liq: 3, retLo: 4, retHi: 7, horizon: '3–10 yrs', min: '1 ETF unit', how: 'Investment-grade ETFs (LQD) or high-yield (HYG). Retail bonds on SGX.', best: 'Higher income than govvies.', watch: 'Default risk — junk bonds fall with stocks.', sym: 'LQD' },
  { id: 'index', name: 'Index funds & ETFs', icon: '📦', img: 'growth', risk: 3, liq: 5, retLo: 6, retHi: 10, horizon: '5+ yrs', min: '1 share (~$50–$600)', how: 'S&P 500 (VOO/CSPX), World (VWRA/VT), STI ETF (ES3), Nifty 50 BeES.', best: 'Core of almost every long-term portfolio.', watch: 'Falls 30–50% in crashes — needs patience.', sym: 'VOO' },
  { id: 'stocks', name: 'Individual stocks', icon: '📈', img: 'candles', risk: 4, liq: 5, retLo: -100, retHi: 30, horizon: '3+ yrs', min: '1 share (fractional on some apps)', how: 'Research the business, buy through a broker, size positions to 2–5% each.', best: 'Investors who enjoy research and accept volatility.', watch: 'Single companies can go to zero.', sym: 'AAPL' },
  { id: 'dividend', name: 'Dividend stocks & REITs', icon: '💵', img: 'coins', risk: 3, liq: 4, retLo: 5, retHi: 9, horizon: '5+ yrs', min: '1 share', how: 'Banks (DBS, OCBC), REITs (CICT, VNQ), dividend ETFs (SCHD).', best: 'Passive income, retirees.', watch: 'REITs are rate-sensitive; dividends can be cut.', sym: 'SCHD' },
  { id: 'mutual', name: 'Mutual funds / unit trusts', icon: '🤝', img: 'portfolio', risk: 3, liq: 4, retLo: 5, retHi: 11, horizon: '5+ yrs', min: '$100 or SIP ₹500', how: 'Active or index funds via platforms (Endowus, Kuvera, Groww).', best: 'Hands-off SIP investing, tax-saving (ELSS).', watch: 'Fees of 1–2% eat returns — compare expense ratios.', sym: 'VFIAX' },
  { id: 'gold', name: 'Gold & precious metals', icon: '🪙', img: 'gold', risk: 3, liq: 4, retLo: 3, retHi: 8, horizon: '5+ yrs', min: '1 ETF unit', how: 'Gold ETFs (GLD, IAU, GSD), sovereign gold bonds (India), physical bullion.', best: 'Crisis hedge, 5–10% of portfolio.', watch: 'No income; long flat periods.', sym: 'GLD' },
  { id: 'commod', name: 'Commodities (oil, ags)', icon: '🛢️', img: 'industry', risk: 4, liq: 4, retLo: -10, retHi: 15, horizon: 'Months–yrs', min: '1 ETF unit', how: 'Commodity ETFs (DBC, USO) or futures.', best: 'Inflation hedge, tactical trades.', watch: 'Futures roll costs; very cyclical.', sym: 'DBC' },
  { id: 'reits', name: 'Real estate', icon: '🏠', img: 'house', risk: 3, liq: 1, retLo: 4, retHi: 9, horizon: '10+ yrs', min: 'Large (property) / $1 (REIT)', how: 'Direct property, or REITs for liquidity.', best: 'Leveraged long-term wealth, rental income.', watch: 'Illiquid, concentrated, mortgage risk.', sym: 'VNQ' },
  { id: 'crypto', name: 'Crypto', icon: '₿', img: 'bitcoin', risk: 5, liq: 5, retLo: -80, retHi: 100, horizon: '5+ yrs', min: '$1', how: 'Regulated exchanges (Coinbase, Coinhako), spot BTC/ETH ETFs (IBIT).', best: 'Small high-risk sleeve (1–5%).', watch: 'Drawdowns of 70–80% are normal; scams.', sym: 'BTC-USD' },
  { id: 'forex', name: 'Forex', icon: '💱', img: 'currencies', risk: 5, liq: 5, retLo: -50, retHi: 30, horizon: 'Days–weeks', min: '$100', how: 'Regulated FX broker (IG, OANDA, Saxo). Mostly leveraged.', best: 'Experienced short-term traders, hedging overseas costs.', watch: 'Leverage magnifies losses; most retail lose.', sym: 'EURUSD=X' },
  { id: 'options', name: 'Options & futures', icon: '🎯', img: 'darkChart', risk: 5, liq: 4, retLo: -100, retHi: 100, horizon: 'Days–months', min: '~$100 premium', how: 'Approved options account; start with covered calls or protective puts.', best: 'Hedging, income (covered calls), defined-risk bets.', watch: 'Time decay; can lose 100% quickly.', sym: '^VIX' },
  { id: 'robo', name: 'Robo-advisors', icon: '🤖', img: 'apps', risk: 3, liq: 4, retLo: 5, retHi: 9, horizon: '5+ yrs', min: '$0–$100', how: 'Syfe, StashAway, Endowus, Betterment — automated diversified portfolios.', best: 'Beginners who want auto-rebalancing.', watch: 'Annual fee 0.2–0.8%.', sym: 'AOR' },
  { id: 'retire', name: 'Retirement & tax-saving', icon: '🧓', img: 'tax', risk: 2, liq: 1, retLo: 4, retHi: 9, horizon: 'Until retirement', min: 'Varies', how: 'CPF top-ups & SRS (SG), PPF/NPS/ELSS (India), 401(k)/IRA (US).', best: 'Tax relief + forced long-term discipline.', watch: 'Money is locked until rules allow withdrawal.', sym: 'AOM' },
  { id: 'p2p', name: 'Private markets & P2P', icon: '🧩', img: 'cash', risk: 5, liq: 1, retLo: -20, retHi: 20, horizon: '5–10 yrs', min: '$1,000+', how: 'Accredited-investor platforms, startup equity, P2P lending.', best: 'Sophisticated investors, small allocation.', watch: 'Illiquid, opaque, high failure rate.', sym: null },
]

/* ─────────── Short-term vs long-term analysis ─────────── */
export const HORIZONS = [
  { id: 'scalp', name: 'Scalping', span: 'Seconds–minutes', chart: '1-min / 5-min', tools: 'Level 2, order flow, VWAP, tight spreads', who: 'Full-time pros with fast execution', risk: 5 },
  { id: 'day', name: 'Day trading', span: 'Minutes–hours', chart: '5-min / 15-min', tools: 'VWAP, opening range, RSI, news catalysts', who: 'Active traders; flat by close', risk: 5 },
  { id: 'swing', name: 'Swing trading', span: 'Days–weeks', chart: 'Daily / 4-hour', tools: '20/50-day MA, RSI, MACD, chart patterns, earnings dates', who: 'Part-time traders with a job', risk: 4 },
  { id: 'position', name: 'Position trading', span: 'Weeks–months', chart: 'Daily / weekly', tools: '50/200-day MA, sector rotation, macro trend', who: 'Trend followers', risk: 3 },
  { id: 'invest', name: 'Long-term investing', span: 'Years–decades', chart: 'Weekly / monthly', tools: 'Valuation, earnings growth, moat, dividends, DCA', who: 'Almost everyone — the core of wealth building', risk: 2 },
]

export const FORECAST_NOTES = [
  'Short-term forecast = recent trend (least-squares line on log price) plus a volatility cone. The darker band holds ~68% of likely outcomes, the lighter ~95%.',
  'Long-term forecast = 2,000 Monte Carlo simulations using the asset’s own historical return and volatility. P50 is the median path; P10/P90 show bad and great luck.',
  'History is not destiny: regime changes (rate shocks, recessions, disruption) break every model. Use forecasts to size risk, not to predict prices.',
]

export const DISCLAIMER = 'Educational tool only — not financial advice. Data from Yahoo Finance via the local backend, may be delayed. Do your own research and consider a licensed adviser.'
