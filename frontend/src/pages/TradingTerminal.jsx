import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { sma, rsi, macd, bollinger, atr, stats, levels, signals, trendForecast, monteCarlo, fmt, fmtPct, fmtBig } from '../data/tradingAnalytics'
import { FORECAST_NOTES, DISCLAIMER } from '../data/tradingAcademy'
import './TradingPro.css'

const COL = { s20: '#3987e5', s50: '#d95926', s200: '#9085e9', up: '#22c55e', down: '#ef4444', band: '#3987e5' }
const RANGES = [['1d', '1D'], ['5d', '5D'], ['1mo', '1M'], ['3mo', '3M'], ['6mo', '6M'], ['1y', '1Y'], ['2y', '2Y'], ['5y', '5Y'], ['10y', '10Y']]
const WATCH_GROUPS = {
  'US tech': ['NVDA', 'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META', 'TSLA', 'AVGO'],
  'ETFs': ['VOO', 'QQQ', 'VT', 'SCHD', 'GLD', 'TLT', 'ES3.SI', 'IBIT'],
  'Singapore': ['D05.SI', 'O39.SI', 'U11.SI', 'Z74.SI', 'C38U.SI', 'S68.SI'],
  'India': ['RELIANCE.NS', 'TCS.NS', 'HDFCBANK.NS', 'INFY.NS', 'ICICIBANK.NS'],
  'Crypto & FX': ['BTC-USD', 'ETH-USD', 'SOL-USD', 'EURUSD=X', 'USDSGD=X', 'USDINR=X'],
  'Commodities': ['GC=F', 'SI=F', 'CL=F', 'NG=F', 'HG=F'],
}
const lsGet = (k, d) => { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v) } catch { return d } }
const lsSet = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)) } catch { /* storage unavailable */ } }

function useWidth() {
  const ref = useRef(null); const [w, setW] = useState(800)
  useEffect(() => {
    if (!ref.current) return
    const ro = new ResizeObserver(([e]) => setW(Math.max(280, Math.floor(e.contentRect.width))))
    ro.observe(ref.current); return () => ro.disconnect()
  }, [])
  return [ref, w]
}

const fmtTime = (t, interval) => {
  const d = new Date(t)
  if (interval?.endsWith('m')) return d.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

/* ═════════ Live market pulse strip ═════════ */
function MarketPulse({ onPick }) {
  const [rows, setRows] = useState([]); const [ts, setTs] = useState('')
  const load = useCallback(async () => {
    try { const j = await (await fetch('/api/market/indices')).json(); setRows(j.indices || []); setTs(new Date().toLocaleTimeString()) } catch { /* offline */ }
  }, [])
  useEffect(() => { load(); const i = setInterval(load, 60000); return () => clearInterval(i) }, [load])
  return (
    <div className="tx-pulse">
      <div className="tx-pulse-head"><span className="tx-live"><i />LIVE</span><b>Global market pulse</b><small>{ts ? `updated ${ts} · every 60s` : 'loading…'}</small></div>
      <div className="tx-heat">
        {(rows.length ? rows : Array.from({ length: 12 }, (_, i) => ({ symbol: `s${i}` }))).map(r => {
          const p = r.changePct ?? 0; const a = Math.min(1, Math.abs(p) / 3)
          return (
            <button type="button" key={r.symbol} className={`tx-heat-cell ${r.price == null ? 'skel' : ''}`} onClick={() => r.price != null && onPick(r.symbol)}
              style={{ '--hc': p >= 0 ? `rgba(34,197,94,${0.12 + a * 0.45})` : `rgba(239,68,68,${0.12 + a * 0.45})` }} title={r.name}>
              <span>{r.name || ' '}</span>
              <b>{r.price != null ? fmt(r.price, r.price > 1000 ? 0 : 2) : ' '}</b>
              <em>{r.changePct != null ? `${p >= 0 ? '▲' : '▼'} ${Math.abs(p).toFixed(2)}%` : ''}</em>
            </button>
          )
        })}
      </div>
    </div>
  )
}

/* ═════════ Watchlist with live polling ═════════ */
function Watchlist({ active, onPick }) {
  const [group, setGroup] = useState(() => lsGet('tx.group', 'US tech'))
  const [quotes, setQuotes] = useState({}); const prev = useRef({}); const [flash, setFlash] = useState({})
  const syms = WATCH_GROUPS[group] || WATCH_GROUPS['US tech']
  const load = useCallback(async () => {
    try {
      const j = await (await fetch(`/api/market/quotes?symbols=${encodeURIComponent(syms.join(','))}`)).json()
      const next = {}; const fl = {}
      ;(j.quotes || []).forEach(q => {
        next[q.symbol] = q
        const p = prev.current[q.symbol]?.price
        if (p != null && q.price != null && p !== q.price) fl[q.symbol] = q.price > p ? 'up' : 'down'
      })
      prev.current = next; setQuotes(next); setFlash(fl)
      setTimeout(() => setFlash({}), 900)
    } catch { /* offline */ }
  }, [syms])
  useEffect(() => { setQuotes({}); load(); const i = setInterval(load, 20000); return () => clearInterval(i) }, [load])
  return (
    <aside className="tx-watch">
      <div className="tx-watch-tabs">
        {Object.keys(WATCH_GROUPS).map(g => <button key={g} type="button" className={g === group ? 'on' : ''} onClick={() => { setGroup(g); lsSet('tx.group', g) }}>{g}</button>)}
      </div>
      <ul>
        {syms.map(s => {
          const q = quotes[s]; const up = (q?.changePct ?? 0) >= 0
          return (
            <li key={s} className={`${active === s ? 'on' : ''} ${flash[s] ? `fl-${flash[s]}` : ''}`}>
              <button type="button" onClick={() => onPick(s)}>
                <span className="tx-w-sym"><b>{s.replace('.SI', '').replace('.NS', '').replace('=X', '').replace('=F', ' fut')}</b><small>{q?.name || '…'}</small></span>
                <span className="tx-w-px"><b>{q?.price != null ? fmt(q.price) : '—'}</b><small className={up ? 'up' : 'down'}>{q?.changePct != null ? `${up ? '▲' : '▼'} ${Math.abs(q.changePct).toFixed(2)}%` : ''}</small></span>
              </button>
            </li>
          )
        })}
      </ul>
      <p className="tx-fine">Quotes refresh every 20s. Tap one to chart it.</p>
    </aside>
  )
}

/* ═════════ Main price chart (SVG) ═════════ */
function PriceChart({ data, interval, overlays, mode, forecast }) {
  const [ref, W] = useWidth(); const [hover, setHover] = useState(null)
  const H = W < 560 ? 260 : 380; const VH = 64; const padL = 8; const padR = 62; const padT = 12
  const cl = data.map(k => k.c)
  const s20 = useMemo(() => sma(cl, 20), [data]); const s50 = useMemo(() => sma(cl, 50), [data]); const s200 = useMemo(() => sma(cl, 200), [data])
  const bb = useMemo(() => bollinger(cl), [data])
  const fc = forecast?.path || []
  const total = data.length + (fc.length || 0)
  const step = (W - padL - padR) / Math.max(1, total)
  const vals = [...data.map(k => k.h), ...data.map(k => k.l)]
  if (overlays.bb) bb.up.concat(bb.lo).forEach(v => v != null && vals.push(v))
  fc.forEach(p => { vals.push(p.hi2, p.lo2) })
  const max = Math.max(...vals); const min = Math.min(...vals); const pad = (max - min) * 0.04 || 1
  const y = v => padT + (1 - (v - (min - pad)) / ((max + pad) - (min - pad))) * (H - padT - 8)
  const x = i => padL + i * step + step / 2
  const vmax = Math.max(1, ...data.map(k => k.v))
  const line = arr => arr.map((v, i) => (v == null ? null : `${x(i).toFixed(1)},${y(v).toFixed(1)}`)).filter(Boolean).join(' ')
  const ticks = Array.from({ length: 5 }, (_, i) => min + ((max - min) * i) / 4)
  const last = data[data.length - 1]; const first = data[0]
  const lineUp = last.c >= first.c
  const area = `${x(0)},${H} ${line(cl)} ${x(data.length - 1)},${H}`
  const move = e => {
    const r = e.currentTarget.getBoundingClientRect(); const px = ((e.clientX - r.left) / r.width) * W
    const i = Math.round((px - padL - step / 2) / step)
    setHover(i >= 0 && i < data.length ? i : null)
  }
  const h = hover != null ? data[hover] : null
  const fcBand = (lo, hi) => {
    if (!fc.length) return ''
    const base = data.length - 1
    const top = [`${x(base)},${y(last.c)}`, ...fc.map(p => `${x(base + p.h)},${y(p[hi])}`)]
    const bot = fc.map(p => `${x(base + p.h)},${y(p[lo])}`).reverse()
    return [...top, ...bot, `${x(base)},${y(last.c)}`].join(' ')
  }
  return (
    <div className="tx-chart" ref={ref}>
      <svg viewBox={`0 0 ${W} ${H + VH}`} width="100%" height={H + VH} onMouseMove={move} onMouseLeave={() => setHover(null)} role="img" aria-label="Price chart">
        <defs>
          <linearGradient id="txArea" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor={lineUp ? COL.up : COL.down} stopOpacity=".28" /><stop offset="1" stopColor={lineUp ? COL.up : COL.down} stopOpacity="0" /></linearGradient>
        </defs>
        {ticks.map(t => <g key={t}><line x1={padL} x2={W - padR} y1={y(t)} y2={y(t)} className="tx-gl" /><text x={W - padR + 6} y={y(t) + 4} className="tx-axis">{fmt(t, t > 1000 ? 0 : 2)}</text></g>)}
        {overlays.bb && <polygon points={[...bb.up.map((v, i) => (v == null ? null : `${x(i)},${y(v)}`)).filter(Boolean), ...bb.lo.map((v, i) => (v == null ? null : `${x(i)},${y(v)}`)).filter(Boolean).reverse()].join(' ')} fill={COL.band} opacity=".08" />}
        {mode === 'line' ? (
          <><polygon points={area} fill="url(#txArea)" /><polyline points={line(cl)} fill="none" stroke={lineUp ? COL.up : COL.down} strokeWidth="2" strokeLinejoin="round" /></>
        ) : data.map((k, i) => {
          const upC = k.c >= k.o; const bw = Math.max(1, step * 0.66)
          return (
            <g key={k.t} stroke={upC ? COL.up : COL.down} fill={upC ? COL.up : COL.down}>
              <line x1={x(i)} x2={x(i)} y1={y(k.h)} y2={y(k.l)} strokeWidth="1" />
              <rect x={x(i) - bw / 2} y={y(Math.max(k.o, k.c))} width={bw} height={Math.max(1, Math.abs(y(k.o) - y(k.c)))} rx={bw > 4 ? 1 : 0} />
            </g>
          )
        })}
        {overlays.s20 && <polyline points={line(s20)} fill="none" stroke={COL.s20} strokeWidth="2" />}
        {overlays.s50 && <polyline points={line(s50)} fill="none" stroke={COL.s50} strokeWidth="2" />}
        {overlays.s200 && <polyline points={line(s200)} fill="none" stroke={COL.s200} strokeWidth="2" />}
        {fc.length > 0 && <>
          <polygon points={fcBand('lo2', 'hi2')} fill="#3987e5" opacity=".12" />
          <polygon points={fcBand('lo1', 'hi1')} fill="#3987e5" opacity=".22" />
          <polyline points={[`${x(data.length - 1)},${y(last.c)}`, ...fc.map(p => `${x(data.length - 1 + p.h)},${y(p.mid)}`)].join(' ')} fill="none" stroke="#9cc3f5" strokeWidth="2" strokeDasharray="5 4" />
          <line x1={x(data.length - 1)} x2={x(data.length - 1)} y1={padT} y2={H} className="tx-now" />
          <text x={x(data.length - 1) - 4} y={H - 6} textAnchor="end" className="tx-axis">today ▸ forecast</text>
        </>}
        <line x1={padL} x2={W - padR} y1={y(last.c)} y2={y(last.c)} className="tx-lastline" />
        <rect x={W - padR + 2} y={y(last.c) - 9} width={padR - 4} height="18" rx="4" fill={last.c >= (data[data.length - 2]?.c ?? last.c) ? COL.up : COL.down} />
        <text x={W - padR + 6} y={y(last.c) + 4} className="tx-lastlabel">{fmt(last.c, last.c > 1000 ? 0 : 2)}</text>
        {data.map((k, i) => <rect key={`v${k.t}`} x={x(i) - Math.max(1, step * 0.66) / 2} y={H + VH - (k.v / vmax) * (VH - 8)} width={Math.max(1, step * 0.66)} height={(k.v / vmax) * (VH - 8)} fill={k.c >= k.o ? COL.up : COL.down} opacity=".35" />)}
        <text x={padL} y={H + 12} className="tx-axis">Volume</text>
        {h && <>
          <line x1={x(hover)} x2={x(hover)} y1={padT} y2={H + VH} className="tx-cross" />
          <line x1={padL} x2={W - padR} y1={y(h.c)} y2={y(h.c)} className="tx-cross" />
          <circle cx={x(hover)} cy={y(h.c)} r="4" fill="#fff" stroke="#0b1121" strokeWidth="2" />
        </>}
      </svg>
      {h && (
        <div className="tx-tip" style={{ left: Math.min(Math.max(8, (x(hover) / W) * 100 * (ref.current?.clientWidth || W) / 100 + 12), (ref.current?.clientWidth || W) - 190) }}>
          <b>{fmtTime(h.t, interval)}</b>
          <span>O <i>{fmt(h.o)}</i> H <i>{fmt(h.h)}</i></span>
          <span>L <i>{fmt(h.l)}</i> C <i className={h.c >= h.o ? 'up' : 'down'}>{fmt(h.c)}</i></span>
          <span>Vol <i>{fmtBig(h.v)}</i></span>
          {overlays.s20 && s20[hover] != null && <span><em style={{ background: COL.s20 }} />SMA20 <i>{fmt(s20[hover])}</i></span>}
          {overlays.s50 && s50[hover] != null && <span><em style={{ background: COL.s50 }} />SMA50 <i>{fmt(s50[hover])}</i></span>}
          {overlays.s200 && s200[hover] != null && <span><em style={{ background: COL.s200 }} />SMA200 <i>{fmt(s200[hover])}</i></span>}
        </div>
      )}
    </div>
  )
}

/* ═════════ RSI + MACD sub-panels ═════════ */
function SubPanel({ kind, data }) {
  const [ref, W] = useWidth(); const H = 140; const padR = 62
  const cl = data.map(k => k.c); const n = cl.length
  const x = i => 8 + (i + 0.5) * ((W - 8 - padR) / n)
  if (kind === 'rsi') {
    const r = rsi(cl); const y = v => 6 + (1 - v / 100) * (H - 12)
    const pts = r.map((v, i) => (v == null ? null : `${x(i)},${y(v)}`)).filter(Boolean).join(' ')
    const lastR = r[n - 1]
    return (
      <div className="tx-sub" ref={ref}>
        <div className="tx-sub-head"><b>RSI (14)</b><span className={lastR > 70 ? 'down' : lastR < 30 ? 'up' : ''}>{lastR != null ? lastR.toFixed(1) : '—'} {lastR > 70 ? '· overbought' : lastR < 30 ? '· oversold' : '· neutral'}</span></div>
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H}>
          <rect x="8" y={y(70)} width={W - 8 - padR} height={y(30) - y(70)} fill="#9085e9" opacity=".08" />
          {[30, 50, 70].map(v => <g key={v}><line x1="8" x2={W - padR} y1={y(v)} y2={y(v)} className="tx-gl" /><text x={W - padR + 6} y={y(v) + 4} className="tx-axis">{v}</text></g>)}
          <polyline points={pts} fill="none" stroke="#9085e9" strokeWidth="2" />
        </svg>
      </div>
    )
  }
  const m = macd(cl); const vals = [...m.line, ...m.signal, ...m.hist].filter(v => v != null)
  const mx = Math.max(...vals.map(Math.abs), 1e-9); const y = v => H / 2 - (v / mx) * (H / 2 - 8)
  const bw = Math.max(1, ((W - 8 - padR) / n) * 0.6)
  return (
    <div className="tx-sub" ref={ref}>
      <div className="tx-sub-head"><b>MACD (12, 26, 9)</b><span><em style={{ background: COL.s20 }} />MACD <em style={{ background: COL.s50 }} />Signal</span></div>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H}>
        <line x1="8" x2={W - padR} y1={H / 2} y2={H / 2} className="tx-gl" />
        {m.hist.map((v, i) => v == null ? null : <rect key={i} x={x(i) - bw / 2} y={Math.min(y(v), H / 2)} width={bw} height={Math.abs(y(v) - H / 2)} fill={v >= 0 ? COL.up : COL.down} opacity=".5" />)}
        <polyline points={m.line.map((v, i) => (v == null ? null : `${x(i)},${y(v)}`)).filter(Boolean).join(' ')} fill="none" stroke={COL.s20} strokeWidth="2" />
        <polyline points={m.signal.map((v, i) => (v == null ? null : `${x(i)},${y(v)}`)).filter(Boolean).join(' ')} fill="none" stroke={COL.s50} strokeWidth="2" />
      </svg>
    </div>
  )
}

/* ═════════ Long-term Monte Carlo fan ═════════ */
function LongForecast({ drift, vol, price, symbol }) {
  const [amount, setAmount] = useState(10000); const [monthly, setMonthly] = useState(500); const [years, setYears] = useState(10)
  const [assume, setAssume] = useState('hist')
  const d = assume === 'hist' ? Math.max(-0.3, Math.min(0.4, drift)) : assume === 'cons' ? 0.05 : 0.08
  const v = Math.max(0.05, Math.min(1.2, vol || 0.18))
  const res = useMemo(() => monteCarlo({ start: Number(amount) || 0, drift: d, vol: v, years: Number(years), monthly: Number(monthly) || 0, sims: 1500 }), [amount, monthly, years, d, v])
  const [ref, W] = useWidth(); const H = 240; const padL = 56; const padR = 44
  const max = Math.max(...res.map(r => r.p90)); const x = i => padL + (i / years) * (W - padL - padR); const y = val => 10 + (1 - val / max) * (H - 30)
  const band = (lo, hi) => [...res.map((r, i) => `${x(i)},${y(r[hi])}`), ...res.map((r, i) => `${x(i)},${y(r[lo])}`).reverse()].join(' ')
  const end = res[res.length - 1]
  return (
    <div className="tx-card tx-long">
      <div className="tx-card-head"><h3>🔭 Long-term forecast — Monte Carlo</h3><span className="tx-chip">{symbol}</span></div>
      <div className="tx-form">
        <label>Start amount<input type="number" min="0" value={amount} onChange={e => setAmount(e.target.value)} /></label>
        <label>Monthly add<input type="number" min="0" value={monthly} onChange={e => setMonthly(e.target.value)} /></label>
        <label>Years<select value={years} onChange={e => setYears(e.target.value)}>{[1, 3, 5, 10, 15, 20, 30].map(n => <option key={n}>{n}</option>)}</select></label>
        <label>Assumption<select value={assume} onChange={e => setAssume(e.target.value)}><option value="hist">This asset’s history</option><option value="cons">Conservative 5%</option><option value="mkt">Market avg 8%</option></select></label>
      </div>
      <p className="tx-fine">Using drift {fmtPct(d)} / yr and volatility {fmtPct(v, 0)} / yr{assume === 'hist' ? ' measured from the selected chart range' : ''}. Current price {fmt(price)}.</p>
      <div className="tx-chart" ref={ref}>
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} role="img" aria-label="Forecast fan chart">
          {[0, 0.25, 0.5, 0.75, 1].map(f => <g key={f}><line x1={padL} x2={W - padR} y1={y(max * f)} y2={y(max * f)} className="tx-gl" /><text x={padL - 8} y={y(max * f) + 4} textAnchor="end" className="tx-axis">{fmtBig(max * f)}</text></g>)}
          <polygon points={band('p10', 'p90')} fill="#3987e5" opacity=".14" />
          <polygon points={band('p25', 'p75')} fill="#3987e5" opacity=".26" />
          <polyline points={res.map((r, i) => `${x(i)},${y(r.invested)}`).join(' ')} fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4 4" />
          <polyline points={res.map((r, i) => `${x(i)},${y(r.p50)}`).join(' ')} fill="none" stroke="#9cc3f5" strokeWidth="2" />
          {res.map((r, i) => <text key={i} x={x(i)} y={H - 4} textAnchor="middle" className="tx-axis">{(years <= 10 || i % 5 === 0) ? `Y${i}` : ''}</text>)}
          <text x={x(years) + 4} y={y(end.p50) + 4} className="tx-axis tx-strong">P50</text>
          <text x={x(years) + 4} y={y(end.p90) + 4} className="tx-axis">P90</text>
          <text x={x(years) + 4} y={y(end.p10) + 4} className="tx-axis">P10</text>
        </svg>
      </div>
      <div className="tx-legend"><span><em style={{ background: '#9cc3f5' }} />Median (P50)</span><span><em style={{ background: 'rgba(57,135,229,.45)' }} />Likely range (P25–P75)</span><span><em style={{ background: 'rgba(57,135,229,.2)' }} />Wide range (P10–P90)</span><span><em style={{ background: '#94a3b8' }} />Money you put in</span></div>
      <div className="tx-tiles">
        <div><small>You invest</small><b>{fmtBig(end.invested)}</b></div>
        <div><small>Bad luck (P10)</small><b className={end.p10 < end.invested ? 'down' : ''}>{fmtBig(end.p10)}</b></div>
        <div><small>Median (P50)</small><b>{fmtBig(end.p50)}</b></div>
        <div><small>Good luck (P90)</small><b className="up">{fmtBig(end.p90)}</b></div>
      </div>
      <details className="tx-table"><summary>Year-by-year table</summary>
        <table><thead><tr><th>Year</th><th>Invested</th><th>P10</th><th>P50</th><th>P90</th></tr></thead>
          <tbody>{res.map(r => <tr key={r.y}><td>{r.y}</td><td>{fmtBig(r.invested)}</td><td>{fmtBig(r.p10)}</td><td>{fmtBig(r.p50)}</td><td>{fmtBig(r.p90)}</td></tr>)}</tbody></table>
      </details>
    </div>
  )
}

/* ═════════ The terminal ═════════ */
export default function TradingTerminal() {
  const [symbol, setSymbol] = useState(() => lsGet('tx.sym', 'NVDA'))
  const [range, setRange] = useState(() => lsGet('tx.range', '1y'))
  const [mode, setMode] = useState('candle')
  const [overlays, setOverlays] = useState({ s20: true, s50: true, s200: false, bb: false, fc: true })
  const [hist, setHist] = useState(null); const [quote, setQuote] = useState(null)
  const [err, setErr] = useState(''); const [loading, setLoading] = useState(false); const [query, setQuery] = useState('')
  const [updated, setUpdated] = useState('')

  const pick = s => { const v = s.trim().toUpperCase(); if (!v) return; setSymbol(v); lsSet('tx.sym', v) }
  const loadHist = useCallback(async () => {
    setLoading(true); setErr('')
    try {
      const r = await fetch(`/api/market/history?symbol=${encodeURIComponent(symbol)}&range=${range}`)
      const j = await r.json()
      if (!j.candles?.length) throw new Error(j.error || 'No data for this symbol')
      setHist(j)
    } catch (e) { setErr(`Could not load ${symbol}: ${e.message}. Check the ticker (e.g. D05.SI, RELIANCE.NS, BTC-USD) or that the backend is running.`); setHist(null) }
    setLoading(false)
  }, [symbol, range])
  const loadQuote = useCallback(async () => {
    try { const q = await (await fetch(`/api/market/quote?symbol=${encodeURIComponent(symbol)}`)).json(); if (q.price != null) setQuote(q); setUpdated(new Date().toLocaleTimeString()) } catch { /* offline */ }
  }, [symbol])
  useEffect(() => { loadHist() }, [loadHist])
  useEffect(() => { setQuote(null); loadQuote(); const i = setInterval(loadQuote, 15000); return () => clearInterval(i) }, [loadQuote])
  useEffect(() => { if (!range.endsWith('d')) return; const i = setInterval(loadHist, 60000); return () => clearInterval(i) }, [range, loadHist])

  const candles = hist?.candles || []
  const st = useMemo(() => (candles.length > 2 ? stats(candles, hist.interval) : null), [hist])
  const sig = useMemo(() => (candles.length > 30 ? signals(candles) : null), [hist])
  const lv = useMemo(() => (candles.length > 15 ? levels(candles) : null), [hist])
  const atrV = useMemo(() => { const a = candles.length > 15 ? atr(candles) : []; return a[a.length - 1] }, [hist])
  const shortFc = useMemo(() => (candles.length > 20 ? trendForecast(candles, Math.min(60, candles.length), range === '1d' ? 12 : range === '5d' ? 13 : 20) : null), [hist, range])
  const longStats = useMemo(() => (candles.length > 2 ? stats(candles, hist.interval) : null), [hist])
  const last = candles[candles.length - 1]
  const price = quote?.price ?? last?.c
  const chg = quote?.changePct
  const periodChange = candles.length ? price / candles[0].c - 1 : null
  const fcEnd = shortFc?.path[shortFc.path.length - 1]

  return (
    <div className="tx">
      <header className="tx-hero">
        <div>
          <span className="tx-kicker"><span className="tx-live"><i />LIVE</span> Real-time trading terminal</span>
          <h2>Chart it, read the signals, see the forecast</h2>
          <p>Live quotes, candlesticks, moving averages, RSI, MACD and Bollinger Bands — plus a short-term trend cone and a long-term Monte Carlo forecast for any stock, ETF, crypto, currency or commodity.</p>
        </div>
      </header>

      <MarketPulse onPick={pick} />

      <div className="tx-grid">
        <Watchlist active={symbol} onPick={pick} />

        <section className="tx-main">
          <div className="tx-card tx-quote">
            <form className="tx-search" onSubmit={e => { e.preventDefault(); pick(query); setQuery('') }}>
              <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Any ticker: AAPL, D05.SI, TCS.NS, BTC-USD, GC=F…" aria-label="Ticker" />
              <button type="submit">Chart</button>
            </form>
            <div className="tx-qrow">
              <div className="tx-qname"><h3>{quote?.name || symbol}</h3><span className="tx-chip">{symbol}</span>{quote?.currency && <span className="tx-chip ghost">{quote.currency}</span>}</div>
              <div className="tx-qprice">
                <b>{fmt(price)}</b>
                {chg != null && <span className={chg >= 0 ? 'up' : 'down'}>{chg >= 0 ? '▲' : '▼'} {fmt(Math.abs(quote.change))} ({Math.abs(chg).toFixed(2)}%) today</span>}
                <small><span className="tx-live sm"><i /></span>{updated ? `quote ${updated} · refresh 15s` : 'connecting…'}</small>
              </div>
            </div>
            <div className="tx-kv">
              <div><small>Open</small><b>{fmt(quote?.open)}</b></div>
              <div><small>Day range</small><b>{fmt(quote?.low)} – {fmt(quote?.high)}</b></div>
              <div><small>52-wk range</small><b>{fmt(quote?.week52Low)} – {fmt(quote?.week52High)}</b></div>
              <div><small>Volume</small><b>{fmtBig(quote?.volume)}</b></div>
              <div><small>Mkt cap</small><b>{fmtBig(quote?.marketCap)}</b></div>
              <div><small>P/E</small><b>{fmt(quote?.pe)}</b></div>
            </div>
          </div>

          <div className="tx-card">
            <div className="tx-toolbar">
              <div className="tx-seg">{RANGES.map(([v, l]) => <button key={v} type="button" className={range === v ? 'on' : ''} onClick={() => { setRange(v); lsSet('tx.range', v) }}>{l}</button>)}</div>
              <div className="tx-seg">{[['candle', '🕯️ Candles'], ['line', '📈 Line']].map(([v, l]) => <button key={v} type="button" className={mode === v ? 'on' : ''} onClick={() => setMode(v)}>{l}</button>)}</div>
              <div className="tx-toggles">
                {[['s20', 'SMA 20', COL.s20], ['s50', 'SMA 50', COL.s50], ['s200', 'SMA 200', COL.s200], ['bb', 'Bollinger', COL.band], ['fc', 'Forecast', '#9cc3f5']].map(([k, l, c]) => (
                  <button key={k} type="button" className={overlays[k] ? 'on' : ''} onClick={() => setOverlays(o => ({ ...o, [k]: !o[k] }))}><em style={{ background: c }} />{l}</button>
                ))}
              </div>
              <button type="button" className="tx-refresh" onClick={() => { loadHist(); loadQuote() }} disabled={loading}>{loading ? '…' : '⟳'} Refresh</button>
            </div>
            {err && <div className="tx-err">⚠️ {err}</div>}
            {!err && !candles.length && <div className="tx-skel" />}
            {candles.length > 1 && <PriceChart data={candles} interval={hist.interval} overlays={overlays} mode={mode} forecast={overlays.fc ? shortFc : null} />}
            {candles.length > 1 && <p className="tx-fine">{candles.length} candles · {hist.interval} interval · {RANGES.find(r => r[0] === range)?.[1]} change <b className={periodChange >= 0 ? 'up' : 'down'}>{fmtPct(periodChange)}</b> · hover the chart for OHLC values</p>}
          </div>

          {candles.length > 30 && <div className="tx-two"><SubPanel kind="rsi" data={candles} /><SubPanel kind="macd" data={candles} /></div>}

          {st && (
            <div className="tx-two">
              <div className="tx-card">
                <div className="tx-card-head"><h3>🧭 Signal summary</h3>{sig && <span className={`tx-verdict v${Math.sign(sig.score)}`}>{sig.label} · {sig.score > 0 ? '+' : ''}{sig.score}/{sig.max}</span>}</div>
                {sig && <div className="tx-gauge"><div style={{ left: `${((sig.score + sig.max) / (2 * sig.max)) * 100}%` }} /><span>Bearish</span><span>Neutral</span><span>Bullish</span></div>}
                <ul className="tx-sigs">{sig?.list.map(s => <li key={s.name}><i className={`v${s.vote}`}>{s.vote > 0 ? '▲' : s.vote < 0 ? '▼' : '●'}</i><div><b>{s.name}</b><span>{s.why}</span></div></li>)}</ul>
                {!sig && <p className="tx-fine">Pick a longer range (3M+) for indicator signals.</p>}
              </div>
              <div className="tx-card">
                <div className="tx-card-head"><h3>⏱️ Short-term outlook</h3><span className="tx-chip">next {shortFc?.path.length || 0} {hist.interval === '1d' ? 'trading days' : 'bars'}</span></div>
                {fcEnd && (
                  <div className="tx-tiles three">
                    <div><small>Trend-line target</small><b className={fcEnd.mid >= price ? 'up' : 'down'}>{fmt(fcEnd.mid)}</b><em>{fmtPct(fcEnd.mid / price - 1)}</em></div>
                    <div><small>68% range</small><b>{fmt(fcEnd.lo1)} – {fmt(fcEnd.hi1)}</b></div>
                    <div><small>95% range</small><b>{fmt(fcEnd.lo2)} – {fmt(fcEnd.hi2)}</b></div>
                  </div>
                )}
                <div className="tx-tiles">
                  <div><small>Support</small><b>{fmt(lv?.support)}</b></div>
                  <div><small>Resistance</small><b>{fmt(lv?.resistance)}</b></div>
                  <div><small>ATR (14)</small><b>{fmt(atrV)}</b><em>typical bar move</em></div>
                  <div><small>Stop idea (2×ATR)</small><b>{atrV ? fmt(price - 2 * atrV) : '—'}</b></div>
                </div>
                <h4 className="tx-h4">Risk profile of this range</h4>
                <div className="tx-tiles">
                  <div><small>Annual volatility</small><b>{fmtPct(st.volA, 0)}</b></div>
                  <div><small>Max drawdown</small><b className="down">{fmtPct(st.mdd)}</b></div>
                  <div><small>Sharpe (rf 4%)</small><b>{fmt(st.sharpe)}</b></div>
                  <div><small>Up bars</small><b>{(st.winRate * 100).toFixed(0)}%</b></div>
                </div>
              </div>
            </div>
          )}

          {longStats && <LongForecast drift={longStats.driftA} vol={longStats.volA} price={price} symbol={symbol} />}

          <div className="tx-card tx-notes">
            <h3>📐 How these forecasts work</h3>
            <ul>{FORECAST_NOTES.map(n => <li key={n}>{n}</li>)}</ul>
            <p className="tx-fine">{DISCLAIMER}</p>
          </div>
        </section>
      </div>
    </div>
  )
}
