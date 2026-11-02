// Technical indicators, signal summary and forecast models for the Trading Terminal.
// Pure functions over arrays of numbers / candles { t, o, h, l, c, v }. Educational only.

export const sma = (xs, n) => xs.map((_, i) => (i < n - 1 ? null : xs.slice(i - n + 1, i + 1).reduce((a, b) => a + b, 0) / n))

export function ema(xs, n) {
  const k = 2 / (n + 1); const out = []; let prev = null
  xs.forEach((x, i) => {
    if (i < n - 1) { out.push(null); return }
    if (prev == null) prev = xs.slice(0, n).reduce((a, b) => a + b, 0) / n
    else prev = x * k + prev * (1 - k)
    out.push(prev)
  })
  return out
}

export function rsi(xs, n = 14) {
  const out = Array(xs.length).fill(null); let g = 0; let l = 0
  for (let i = 1; i < xs.length; i++) {
    const d = xs[i] - xs[i - 1]; const up = Math.max(d, 0); const dn = Math.max(-d, 0)
    if (i <= n) { g += up; l += dn; if (i === n) { g /= n; l /= n; out[i] = l === 0 ? 100 : 100 - 100 / (1 + g / l) } continue }
    g = (g * (n - 1) + up) / n; l = (l * (n - 1) + dn) / n
    out[i] = l === 0 ? 100 : 100 - 100 / (1 + g / l)
  }
  return out
}

export function macd(xs, f = 12, s = 26, sig = 9) {
  const ef = ema(xs, f); const es = ema(xs, s)
  const line = xs.map((_, i) => (ef[i] == null || es[i] == null ? null : ef[i] - es[i]))
  const start = line.findIndex(v => v != null)
  const sigLine = Array(xs.length).fill(null)
  if (start >= 0) ema(line.slice(start), sig).forEach((v, i) => { sigLine[start + i] = v })
  const hist = line.map((v, i) => (v == null || sigLine[i] == null ? null : v - sigLine[i]))
  return { line, signal: sigLine, hist }
}

export function bollinger(xs, n = 20, k = 2) {
  const mid = sma(xs, n)
  const up = []; const lo = []
  xs.forEach((_, i) => {
    if (mid[i] == null) { up.push(null); lo.push(null); return }
    const w = xs.slice(i - n + 1, i + 1); const m = mid[i]
    const sd = Math.sqrt(w.reduce((a, b) => a + (b - m) ** 2, 0) / n)
    up.push(m + k * sd); lo.push(m - k * sd)
  })
  return { mid, up, lo }
}

export function atr(c, n = 14) {
  const tr = c.map((k, i) => (i === 0 ? k.h - k.l : Math.max(k.h - k.l, Math.abs(k.h - c[i - 1].c), Math.abs(k.l - c[i - 1].c))))
  return sma(tr, n)
}

export const logReturns = xs => xs.slice(1).map((x, i) => Math.log(x / xs[i]))
const mean = a => a.reduce((s, x) => s + x, 0) / (a.length || 1)
const stdev = a => { const m = mean(a); return Math.sqrt(a.reduce((s, x) => s + (x - m) ** 2, 0) / Math.max(1, a.length - 1)) }

/** periods per year for a candle interval */
export const periodsPerYear = interval => ({ '5m': 252 * 78, '30m': 252 * 13, '1d': 252, '1wk': 52, '1mo': 12 }[interval] || 252)

export function stats(candles, interval = '1d') {
  const cl = candles.map(k => k.c); const r = logReturns(cl); const ppy = periodsPerYear(interval)
  const volA = stdev(r) * Math.sqrt(ppy); const driftA = mean(r) * ppy
  let peak = -Infinity; let mdd = 0
  cl.forEach(x => { peak = Math.max(peak, x); mdd = Math.min(mdd, x / peak - 1) })
  const total = cl.length > 1 ? cl[cl.length - 1] / cl[0] - 1 : 0
  const sharpe = volA > 0 ? (driftA - 0.04) / volA : 0
  const up = r.filter(x => x > 0).length
  return { volA, driftA, mdd, total, sharpe, winRate: r.length ? up / r.length : 0, best: Math.max(...r, 0), worst: Math.min(...r, 0) }
}

/** Recent swing highs/lows as simple support & resistance */
export function levels(candles, look = 5) {
  const hi = []; const lo = []
  for (let i = look; i < candles.length - look; i++) {
    const w = candles.slice(i - look, i + look + 1)
    if (candles[i].h === Math.max(...w.map(k => k.h))) hi.push(candles[i].h)
    if (candles[i].l === Math.min(...w.map(k => k.l))) lo.push(candles[i].l)
  }
  const last = candles[candles.length - 1]?.c
  const res = hi.filter(x => x > last).sort((a, b) => a - b)[0] ?? Math.max(...candles.map(k => k.h))
  const sup = lo.filter(x => x < last).sort((a, b) => b - a)[0] ?? Math.min(...candles.map(k => k.l))
  return { support: sup, resistance: res }
}

/** Plain-English signal summary — each rule votes bullish (+1) / bearish (-1) / neutral (0). */
export function signals(candles) {
  const cl = candles.map(k => k.c); const n = cl.length; const last = cl[n - 1]
  const s20 = sma(cl, 20)[n - 1]; const s50 = sma(cl, 50)[n - 1]; const s200 = sma(cl, 200)[n - 1]
  const r = rsi(cl)[n - 1]; const m = macd(cl); const bb = bollinger(cl)
  const out = []
  const add = (name, vote, why) => out.push({ name, vote, why })
  if (s20 != null) add('Price vs 20-day average', last > s20 ? 1 : -1, last > s20 ? 'Trading above its 1-month average — short-term buyers in control.' : 'Below its 1-month average — short-term sellers in control.')
  if (s50 != null) add('Price vs 50-day average', last > s50 ? 1 : -1, last > s50 ? 'Above the medium-term trend line.' : 'Below the medium-term trend line.')
  if (s50 != null && s200 != null) add('Golden / death cross (50 vs 200)', s50 > s200 ? 1 : -1, s50 > s200 ? '50-day above 200-day — long-term uptrend ("golden cross" regime).' : '50-day below 200-day — long-term downtrend ("death cross" regime).')
  if (r != null) add('RSI (14)', r > 70 ? -1 : r < 30 ? 1 : 0, r > 70 ? `RSI ${r.toFixed(0)} — overbought; pullbacks are common from here.` : r < 30 ? `RSI ${r.toFixed(0)} — oversold; bounces are common from here.` : `RSI ${r.toFixed(0)} — neutral momentum.`)
  const ml = m.line[n - 1]; const ms = m.signal[n - 1]
  if (ml != null && ms != null) add('MACD', ml > ms ? 1 : -1, ml > ms ? 'MACD above its signal line — momentum turning up.' : 'MACD below its signal line — momentum turning down.')
  if (bb.up[n - 1] != null) {
    const pctB = (last - bb.lo[n - 1]) / (bb.up[n - 1] - bb.lo[n - 1])
    add('Bollinger %B', pctB > 1 ? -1 : pctB < 0 ? 1 : 0, pctB > 1 ? 'Above the upper band — stretched.' : pctB < 0 ? 'Below the lower band — stretched to the downside.' : `Inside the bands (%B ${(pctB * 100).toFixed(0)}%).`)
  }
  const score = out.reduce((a, x) => a + x.vote, 0)
  const max = out.length || 1
  const label = score >= max * 0.5 ? 'Bullish' : score > 0 ? 'Mildly bullish' : score === 0 ? 'Neutral' : score > -max * 0.5 ? 'Mildly bearish' : 'Bearish'
  return { list: out, score, max, label }
}

/** Least-squares trend on log price over the last `n` points; projects `ahead` periods with ±σ cone. */
export function trendForecast(candles, n = 60, ahead = 20) {
  const pts = candles.slice(-n).map(k => Math.log(k.c)); const N = pts.length
  if (N < 10) return null
  const xm = (N - 1) / 2; const ym = mean(pts)
  let sxy = 0; let sxx = 0
  pts.forEach((y, x) => { sxy += (x - xm) * (y - ym); sxx += (x - xm) ** 2 })
  const b = sxy / sxx; const a = ym - b * xm
  const resid = stdev(pts.map((y, x) => y - (a + b * x)))
  const sig = stdev(logReturns(candles.slice(-n).map(k => k.c)))
  const path = []
  for (let h = 1; h <= ahead; h++) {
    // anchored at today's price: carry the fitted slope forward; uncertainty grows with √h
    const mu = pts[N - 1] + b * h; const s = Math.sqrt((resid * 0.5) ** 2 + sig ** 2 * h)
    path.push({ h, mid: Math.exp(mu), lo1: Math.exp(mu - s), hi1: Math.exp(mu + s), lo2: Math.exp(mu - 2 * s), hi2: Math.exp(mu + 2 * s) })
  }
  return { slopePerPeriod: Math.exp(b) - 1, path }
}

function rng(seed) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296 } }
function gauss(r) { let u = 0; let v = 0; while (u === 0) u = r(); while (v === 0) v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v) }

/**
 * Monte Carlo geometric Brownian motion, yearly checkpoints.
 * drift/vol are annualised log figures. Returns percentile bands per year.
 */
export function monteCarlo({ start, drift, vol, years = 10, sims = 2000, monthly = 0, seed = 42 }) {
  const r = rng(seed); const steps = years * 12; const dt = 1 / 12
  const byYear = Array.from({ length: years + 1 }, () => [])
  for (let s = 0; s < sims; s++) {
    let v = start; byYear[0].push(v)
    for (let m = 1; m <= steps; m++) {
      v = v * Math.exp((drift - 0.5 * vol * vol) * dt + vol * Math.sqrt(dt) * gauss(r)) + monthly
      if (m % 12 === 0) byYear[m / 12].push(v)
    }
  }
  const pct = (a, p) => a[Math.min(a.length - 1, Math.floor(p * a.length))]
  return byYear.map((a, y) => {
    a.sort((x, z) => x - z)
    return { y, p10: pct(a, 0.1), p25: pct(a, 0.25), p50: pct(a, 0.5), p75: pct(a, 0.75), p90: pct(a, 0.9), invested: start + monthly * 12 * y }
  })
}

export const fmt = (v, d = 2) => (v == null || !isFinite(v) ? '—' : Number(v).toLocaleString(undefined, { minimumFractionDigits: d, maximumFractionDigits: d }))
export const fmtPct = (v, d = 1) => (v == null || !isFinite(v) ? '—' : `${v >= 0 ? '+' : ''}${(v * 100).toFixed(d)}%`)
export const fmtBig = v => {
  if (v == null || !isFinite(v)) return '—'
  const a = Math.abs(v)
  if (a >= 1e12) return `${(v / 1e12).toFixed(2)}T`
  if (a >= 1e9) return `${(v / 1e9).toFixed(2)}B`
  if (a >= 1e6) return `${(v / 1e6).toFixed(2)}M`
  if (a >= 1e3) return `${(v / 1e3).toFixed(1)}K`
  return v.toFixed(0)
}
