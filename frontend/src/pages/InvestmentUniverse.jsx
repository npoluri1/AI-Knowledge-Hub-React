import React, { useEffect, useMemo, useState } from 'react'
import { INVESTMENT_TYPES, img, DISCLAIMER } from '../data/tradingAcademy'
import { fmt, fmtBig } from '../data/tradingAnalytics'
import './TradingPro.css'

// Allocation slices: fixed categorical order (validated palette, dark mode)
const SLICES = [
  { k: 'stocks', label: 'Stocks / equity ETFs', color: '#3987e5', ret: 0.08, vol: 0.17 },
  { k: 'bonds', label: 'Bonds', color: '#d95926', ret: 0.04, vol: 0.06 },
  { k: 'cash', label: 'Cash / T-bills', color: '#199e70', ret: 0.03, vol: 0.01 },
  { k: 'gold', label: 'Gold', color: '#c98500', ret: 0.05, vol: 0.15 },
  { k: 'alt', label: 'REITs & crypto', color: '#9085e9', ret: 0.07, vol: 0.3 },
]
const PROFILES = {
  Conservative: { stocks: 30, bonds: 45, cash: 15, gold: 10, alt: 0 },
  Balanced: { stocks: 55, bonds: 30, cash: 5, gold: 7, alt: 3 },
  Growth: { stocks: 75, bonds: 12, cash: 3, gold: 5, alt: 5 },
  Aggressive: { stocks: 85, bonds: 0, cash: 2, gold: 3, alt: 10 },
}

function Bar({ v, label }) {
  return <div className="iu-bar" aria-label={`${label} ${v} of 5`}><small>{label}</small><span>{[1, 2, 3, 4, 5].map(i => <i key={i} className={i <= v ? 'on' : ''} />)}</span></div>
}

function RiskReturnMap({ onPick, active }) {
  const [hover, setHover] = useState(null)
  const W = 640; const H = 300; const px = r => 50 + ((r - 1) / 4) * (W - 90); const py = v => H - 30 - ((Math.min(30, Math.max(-5, v)) + 5) / 35) * (H - 50)
  return (
    <div className="tx-chart iu-map">
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label="Risk versus typical return map">
        {[0, 10, 20, 30].map(v => <g key={v}><line x1="40" x2={W - 20} y1={py(v)} y2={py(v)} className="tx-gl" /><text x="34" y={py(v) + 4} textAnchor="end" className="tx-axis">{v}%</text></g>)}
        {[1, 2, 3, 4, 5].map(r => <text key={r} x={px(r)} y={H - 8} textAnchor="middle" className="tx-axis">{['', 'Very low', 'Low', 'Medium', 'High', 'Very high'][r]}</text>)}
        <text x={W - 20} y={py(30) - 6} textAnchor="end" className="tx-axis">typical return / yr (midpoint, capped) →</text>
        {INVESTMENT_TYPES.map((t, i) => {
          const mid = (t.retLo + t.retHi) / 2; const jitter = ((i % 4) - 1.5) * 18
          const cx = px(t.risk) + jitter; const cy = py(mid)
          const on = hover === t.id || active === t.id
          return (
            <g key={t.id} onMouseEnter={() => setHover(t.id)} onMouseLeave={() => setHover(null)} onClick={() => onPick(t.id)} style={{ cursor: 'pointer' }}>
              <circle cx={cx} cy={cy} r="16" fill="transparent" />
              <circle cx={cx} cy={cy} r={on ? 14 : 12} fill={on ? '#3987e5' : 'rgba(57,135,229,.22)'} stroke="#3987e5" strokeWidth="1.5" />
              <text x={cx} y={cy + 5} textAnchor="middle" className="iu-emoji">{t.icon}</text>
              {on && <text x={cx} y={cy - 20} textAnchor="middle" className="tx-axis tx-strong">{t.icon} {t.name} · {t.retLo}–{t.retHi}%</text>}
            </g>
          )
        })}
      </svg>
      <p className="tx-fine">Hover or tap a dot. Higher risk opens the door to higher returns, and to bigger losses.</p>
    </div>
  )
}

function AllocationBuilder() {
  const [mix, setMix] = useState(PROFILES.Balanced); const [age, setAge] = useState(30)
  const total = Object.values(mix).reduce((a, b) => a + b, 0) || 1
  const ret = SLICES.reduce((a, s) => a + (mix[s.k] / total) * s.ret, 0)
  const vol = Math.sqrt(SLICES.reduce((a, s) => a + ((mix[s.k] / total) * s.vol) ** 2, 0) + 2 * 0.3 * (mix.stocks / total) * 0.17 * (mix.alt / total) * 0.3)
  const worst = -(vol * 2.3)
  let acc = 0; const R = 70; const C = 2 * Math.PI * R
  return (
    <div className="tx-card">
      <div className="tx-card-head"><h3>🥧 Build your allocation</h3><span className="tx-chip">age rule of thumb: ~{Math.max(20, Math.min(90, 110 - age))}% in growth assets</span></div>
      <div className="iu-profiles">
        {Object.keys(PROFILES).map(p => <button key={p} type="button" onClick={() => setMix(PROFILES[p])} className={JSON.stringify(PROFILES[p]) === JSON.stringify(mix) ? 'on' : ''}>{p}</button>)}
        <label>Age <input type="number" min="18" max="90" value={age} onChange={e => setAge(+e.target.value)} /></label>
      </div>
      <div className="iu-alloc">
        <svg viewBox="0 0 180 180" width="180" height="180" role="img" aria-label="Allocation donut">
          {SLICES.map(s => {
            const f = mix[s.k] / total; const dash = Math.max(0, f * C - 2)
            const el = <circle key={s.k} cx="90" cy="90" r={R} fill="none" stroke={s.color} strokeWidth="26" strokeDasharray={`${dash} ${C - dash}`} strokeDashoffset={-acc * C} transform="rotate(-90 90 90)" />
            acc += f; return f > 0 ? el : null
          })}
          <text x="90" y="86" textAnchor="middle" className="iu-donut-big">{(ret * 100).toFixed(1)}%</text>
          <text x="90" y="104" textAnchor="middle" className="tx-axis">expected / yr</text>
        </svg>
        <div className="iu-sliders">
          {SLICES.map(s => (
            <label key={s.k}><span><em style={{ background: s.color }} />{s.label}</span>
              <input type="range" min="0" max="100" value={mix[s.k]} onChange={e => setMix(m => ({ ...m, [s.k]: +e.target.value }))} />
              <b>{Math.round((mix[s.k] / total) * 100)}%</b></label>
          ))}
        </div>
      </div>
      <div className="tx-tiles">
        <div><small>Expected return</small><b className="up">{(ret * 100).toFixed(1)}% / yr</b></div>
        <div><small>Volatility</small><b>{(vol * 100).toFixed(1)}%</b></div>
        <div><small>Bad year (~1 in 100)</small><b className="down">{(worst * 100).toFixed(0)}%</b></div>
        <div><small>$10k in 20 yrs (median)</small><b>{fmtBig(10000 * Math.exp((ret - vol * vol / 2) * 20))}</b></div>
      </div>
      <p className="tx-fine">Long-run assumptions: stocks 8%, bonds 4%, cash 3%, gold 5%, REITs & crypto 7%. Rough estimates for learning only.</p>
    </div>
  )
}

export default function InvestmentUniverse() {
  const [active, setActive] = useState(null); const [quotes, setQuotes] = useState({}); const [filter, setFilter] = useState('All')
  useEffect(() => {
    const syms = INVESTMENT_TYPES.map(t => t.sym).filter(Boolean)
    const load = async () => {
      try {
        const j = await (await fetch(`/api/market/quotes?symbols=${encodeURIComponent(syms.join(','))}`)).json()
        setQuotes(Object.fromEntries((j.quotes || []).map(q => [q.symbol, q])))
      } catch { /* offline */ }
    }
    load(); const i = setInterval(load, 60000); return () => clearInterval(i)
  }, [])
  const list = useMemo(() => INVESTMENT_TYPES.filter(t => filter === 'All' || (filter === 'Low risk' ? t.risk <= 2 : filter === 'Medium' ? t.risk === 3 : t.risk >= 4)), [filter])
  const pick = id => { setActive(id); document.getElementById(`iu-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }) }

  return (
    <div className="tx">
      <header className="tx-hero photo" style={{ '--hero': `url("${img('portfolio', 1600, 700)}")` }}>
        <div>
          <span className="tx-kicker">🧺 Every way to invest</span>
          <h2>16 investment types, side by side, with live prices</h2>
          <p>Risk, return, liquidity, how long to hold, minimum amount, and how to start in Singapore, India and the US. Each card shows a live benchmark price.</p>
        </div>
      </header>

      <div className="tx-two">
        <div className="tx-card"><div className="tx-card-head"><h3>🗺️ Risk vs return map</h3></div><RiskReturnMap onPick={pick} active={active} /></div>
        <AllocationBuilder />
      </div>

      <div className="iu-filter">{['All', 'Low risk', 'Medium', 'High risk'].map(f => <button key={f} type="button" className={f === filter ? 'on' : ''} onClick={() => setFilter(f)}>{f}</button>)}</div>
      <div className="iu-grid">
        {list.map(t => {
          const q = t.sym ? quotes[t.sym.toUpperCase()] || quotes[t.sym] : null; const up = (q?.changePct ?? 0) >= 0
          return (
            <article key={t.id} id={`iu-${t.id}`} className={`iu-card ${active === t.id ? 'on' : ''}`}>
              <div className="iu-img"><img src={img(t.img, 560, 300)} alt="" loading="lazy" /><span>{t.icon}</span>
                {t.sym && <div className="iu-live"><small>{t.sym}</small><b>{q?.price != null ? fmt(q.price) : '…'}</b>{q?.changePct != null && <em className={up ? 'up' : 'down'}>{up ? '▲' : '▼'}{Math.abs(q.changePct).toFixed(2)}%</em>}</div>}
              </div>
              <div className="iu-body">
                <h3>{t.name}</h3>
                <div className="iu-bars"><Bar v={t.risk} label="Risk" /><Bar v={t.liq} label="Liquidity" /></div>
                <dl>
                  <dt>Typical return</dt><dd>{t.retLo}% to {t.retHi}% / yr</dd>
                  <dt>Hold for</dt><dd>{t.horizon}</dd>
                  <dt>Minimum</dt><dd>{t.min}</dd>
                </dl>
                <p><b>How to start:</b> {t.how}</p>
                <p><b>Best for:</b> {t.best}</p>
                <p className="iu-watch">⚠️ {t.watch}</p>
              </div>
            </article>
          )
        })}
      </div>
      <p className="tx-fine">{DISCLAIMER}</p>
    </div>
  )
}
