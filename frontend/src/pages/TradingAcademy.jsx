import React, { useState } from 'react'
import { LEARN_PATH, PATTERNS, CANDLES, HORIZONS, img, DISCLAIMER } from '../data/tradingAcademy'
import { fmt } from '../data/tradingAnalytics'
import './TradingPro.css'

const lsGet = (k, d) => { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v) } catch { return d } }
const lsSet = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)) } catch { /* storage unavailable */ } }
const BIAS = { bullish: '#22c55e', bearish: '#ef4444', neutral: '#94a3b8' }

function PatternSvg({ p }) {
  const pts = p.pts.map(([x, y]) => `${x * 2 + 10},${y * 1.1 + 8}`).join(' ')
  return (
    <svg viewBox="0 0 220 126" width="100%" height="126" role="img" aria-label={p.name}>
      <polyline points={pts} fill="none" stroke={BIAS[p.bias]} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
      {p.neck && <line x1={p.neck[0][0] * 2 + 10} y1={p.neck[0][1] * 1.1 + 8} x2={p.neck[1][0] * 2 + 10} y2={p.neck[1][1] * 1.1 + 8} stroke="#e2e8f0" strokeDasharray="5 4" strokeWidth="1.5" opacity=".7" />}
      {p.pts.map(([x, y], i) => <circle key={i} cx={x * 2 + 10} cy={y * 1.1 + 8} r="3" fill="#0b1121" stroke={BIAS[p.bias]} strokeWidth="2" />)}
    </svg>
  )
}

function CandleSvg({ c }) {
  const col = BIAS[c.bias]
  const top = Math.min(c.o, c.c); const h = Math.max(2, Math.abs(c.o - c.c))
  return (
    <svg viewBox="0 0 60 100" width="60" height="100" aria-hidden="true">
      <line x1="30" x2="30" y1={c.h} y2={c.l} stroke={col} strokeWidth="2.5" />
      <rect x="18" y={top} width="24" height={h} rx="2" fill={col} />
    </svg>
  )
}

function CandleAnatomy() {
  return (
    <svg viewBox="0 0 360 200" width="100%" height="200" role="img" aria-label="Candlestick anatomy">
      <line x1="90" x2="90" y1="20" y2="180" stroke="#22c55e" strokeWidth="3" />
      <rect x="70" y="60" width="40" height="80" rx="3" fill="#22c55e" />
      <line x1="250" x2="250" y1="20" y2="180" stroke="#ef4444" strokeWidth="3" />
      <rect x="230" y="60" width="40" height="80" rx="3" fill="#ef4444" />
      {[[20, 'High'], [60, 'Close'], [140, 'Open'], [180, 'Low']].map(([y, t]) => <g key={`g${t}`}><line x1="112" x2="150" y1={y} y2={y} stroke="#64748b" strokeDasharray="3 3" /><text x="154" y={y + 4} className="tx-anat">{t}</text></g>)}
      {[[60, 'Open'], [140, 'Close']].map(([y, t]) => <g key={`r${t}`}><line x1="272" x2="300" y1={y} y2={y} stroke="#64748b" strokeDasharray="3 3" /><text x="304" y={y + 4} className="tx-anat">{t}</text></g>)}
      <text x="90" y="198" textAnchor="middle" className="tx-anat b">Up candle</text>
      <text x="250" y="198" textAnchor="middle" className="tx-anat b">Down candle</text>
      <text x="20" y="40" className="tx-anat s">wick</text><text x="20" y="104" className="tx-anat s">body</text>
    </svg>
  )
}

function SizeCalculator() {
  const [acct, setAcct] = useState(20000); const [riskPct, setRiskPct] = useState(1)
  const [entry, setEntry] = useState(50); const [stop, setStop] = useState(46); const [target, setTarget] = useState(60)
  const risk = acct * riskPct / 100; const perShare = Math.abs(entry - stop)
  const shares = perShare > 0 ? Math.floor(risk / perShare) : 0
  const rr = perShare > 0 ? Math.abs(target - entry) / perShare : 0
  const breakeven = rr > 0 ? 1 / (1 + rr) : 1
  return (
    <div className="tx-card">
      <div className="tx-card-head"><h3>🧮 Position size & risk/reward calculator</h3></div>
      <div className="tx-form">
        <label>Account size<input type="number" value={acct} onChange={e => setAcct(+e.target.value)} /></label>
        <label>Risk per trade %<input type="number" step="0.25" value={riskPct} onChange={e => setRiskPct(+e.target.value)} /></label>
        <label>Entry price<input type="number" value={entry} onChange={e => setEntry(+e.target.value)} /></label>
        <label>Stop-loss<input type="number" value={stop} onChange={e => setStop(+e.target.value)} /></label>
        <label>Target<input type="number" value={target} onChange={e => setTarget(+e.target.value)} /></label>
      </div>
      <div className="tx-tiles">
        <div><small>Max loss</small><b className="down">{fmt(risk)}</b></div>
        <div><small>Shares to buy</small><b>{shares.toLocaleString()}</b><em>{fmt(shares * entry)} position</em></div>
        <div><small>Risk : reward</small><b className={rr >= 2 ? 'up' : 'down'}>1 : {rr.toFixed(2)}</b><em>{rr >= 2 ? 'good trade setup' : 'aim for 1 : 2 or better'}</em></div>
        <div><small>Win rate to break even</small><b>{(breakeven * 100).toFixed(0)}%</b></div>
      </div>
      <div className="tx-rr">
        <div className="loss" style={{ flex: 1 }}>Risk {fmt(perShare)}</div>
        <div className="gain" style={{ flex: Math.max(0.2, rr) }}>Reward {fmt(Math.abs(target - entry))}</div>
      </div>
    </div>
  )
}

export default function TradingAcademy() {
  const [stage, setStage] = useState(() => lsGet('ta.stage', 'foundations'))
  const [done, setDone] = useState(() => new Set(lsGet('ta.done', [])))
  const cur = LEARN_PATH.find(s => s.id === stage) || LEARN_PATH[0]
  const toggle = id => setDone(prev => { const n = new Set(prev); if (n.has(id)) n.delete(id); else n.add(id); lsSet('ta.done', [...n]); return n })
  const total = LEARN_PATH.reduce((a, s) => a + s.lessons.length, 0)

  return (
    <div className="tx">
      <header className="tx-hero photo" style={{ '--hero': `url("${img('trader', 1600, 700)}")` }}>
        <div>
          <span className="tx-kicker">🧭 Trading academy · learn every way</span>
          <h2>From zero to confident trader in 8 stages</h2>
          <p>Each stage has plain-English lessons, a real example and one line to remember. Tick lessons off as you learn them; your progress is saved in this browser.</p>
          <div className="tx-progress"><div style={{ width: `${(done.size / total) * 100}%` }} /><span>{done.size} / {total} lessons</span></div>
        </div>
      </header>

      <div className="ta-path">
        {LEARN_PATH.map(s => {
          const n = s.lessons.filter(l => done.has(`${s.id}:${l.t}`)).length
          return (
            <button key={s.id} type="button" className={`ta-stage ${s.id === stage ? 'on' : ''}`} style={{ '--c': s.color }} onClick={() => { setStage(s.id); lsSet('ta.stage', s.id) }}>
              <img src={img(s.img, 320, 180)} alt="" loading="lazy" />
              <span className="ta-n">{s.n}</span>
              <b>{s.title}</b>
              <small>{n}/{s.lessons.length} done</small>
            </button>
          )
        })}
      </div>

      <section className="tx-card ta-stage-body" style={{ '--c': cur.color }}>
        <div className="ta-stage-head">
          <img src={img(cur.img, 900, 420)} alt="" loading="lazy" />
          <div><span className="tx-chip">Stage {cur.n} of 8</span><h3>{cur.title}</h3><p>🎯 {cur.goal}</p></div>
        </div>
        <div className="ta-lessons">
          {cur.lessons.map(l => {
            const id = `${cur.id}:${l.t}`; const ok = done.has(id)
            return (
              <article key={l.t} className={`ta-lesson ${ok ? 'ok' : ''}`}>
                <div className="ta-lesson-top"><h4>{l.t}</h4><button type="button" onClick={() => toggle(id)} aria-pressed={ok}>{ok ? '✓ Learned' : 'Mark learned'}</button></div>
                <p><b>In plain English:</b> {l.lay}</p>
                <p className="ta-ex"><b>Example:</b> {l.ex}</p>
                <p className="ta-rem">💡 {l.remember}</p>
              </article>
            )
          })}
        </div>
      </section>

      <section className="tx-two">
        <div className="tx-card">
          <div className="tx-card-head"><h3>🕯️ Candlestick anatomy</h3></div>
          <CandleAnatomy />
          <p className="tx-fine">Each candle is one time period (a day, an hour, 5 minutes). Green: closed higher than it opened. Red: closed lower.</p>
        </div>
        <div className="tx-card">
          <div className="tx-card-head"><h3>Six candles to recognise</h3></div>
          <div className="ta-candles">
            {CANDLES.map(c => <div key={c.name} className="ta-candle"><CandleSvg c={c} /><div><b>{c.name}</b><span className={`ta-bias ${c.bias}`}>{c.bias}</span><p>{c.meaning}</p></div></div>)}
          </div>
        </div>
      </section>

      <section className="tx-card">
        <div className="tx-card-head"><h3>📐 Chart patterns, drawn</h3><span className="tx-chip">dashed line = neckline / breakout level</span></div>
        <div className="ta-patterns">
          {PATTERNS.map(p => (
            <article key={p.name} className="ta-pattern">
              <PatternSvg p={p} />
              <div className="ta-pattern-t"><b>{p.name}</b><span className={`ta-bias ${p.bias}`}>{p.bias === 'bullish' ? '▲' : '▼'} {p.bias}</span></div>
              <p>{p.meaning}</p>
              <p className="ta-rem">🎯 {p.tip}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="tx-card">
        <div className="tx-card-head"><h3>⏳ Short-term vs long-term: pick your style</h3></div>
        <div className="ta-horizons">
          {HORIZONS.map(h => (
            <article key={h.id}>
              <b>{h.name}</b><span className="tx-chip">{h.span}</span>
              <dl><dt>Chart</dt><dd>{h.chart}</dd><dt>Tools</dt><dd>{h.tools}</dd><dt>For</dt><dd>{h.who}</dd></dl>
              <div className="ta-meter" aria-label={`Risk ${h.risk} of 5`}>{[1, 2, 3, 4, 5].map(i => <i key={i} className={i <= h.risk ? 'on' : ''} />)}<small>risk / effort</small></div>
            </article>
          ))}
        </div>
      </section>

      <SizeCalculator />
      <p className="tx-fine">{DISCLAIMER}</p>
    </div>
  )
}
