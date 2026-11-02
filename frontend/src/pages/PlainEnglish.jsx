import React, { useMemo, useState } from 'react'
import { PE_CATS, TERMS, TRADE_STORY, MYTHS, FAQ, GOLDEN_RULES } from '../data/tradingPlainEnglish'
import { DISCLAIMER } from '../data/tradingAcademy'
import { photoUrl, photoKey, FALLBACK } from './TradingPhotos'
import './TradingPro.css'

const CAT_POOL = {
  basics: ['growth', 'piggy', 'coins', 'jar', 'cash', 'tax', 'study', 'portfolio'],
  market: ['screen', 'phoneTrading', 'apps', 'lineScreen', 'laptopChart', 'candles', 'trader', 'dashboard'],
  assets: ['jar', 'portfolio', 'lineScreen', 'growth', 'coins', 'house', 'gold', 'bitcoin', 'currencies'],
  charts: ['candles2', 'candles', 'darkChart', 'paperChart', 'lineScreen', 'laptopChart', 'screen', 'trader'],
  company: ['revenue', 'laptopAnalytics', 'dashboard', 'tax', 'paperChart', 'portfolio', 'laptopChart'],
  risk: ['chess', 'calm', 'paperChart', 'darkChart', 'laptopAnalytics', 'trader', 'portfolio'],
  advanced: ['darkChart', 'trader', 'industry', 'paperChart', 'laptopChart', 'ai', 'dashboard'],
}
const TERM_PHOTO = Object.fromEntries(Object.keys(CAT_POOL).flatMap(c => TERMS.filter(t => t.c === c).map((t, i) => {
  const k = photoKey(t.t)
  return [t.t, FALLBACK.includes(k) || k === 'study' ? CAT_POOL[c][i % CAT_POOL[c].length] : k]
})))
const usedOnce = new Set()
Object.keys(TERM_PHOTO).forEach((t, i) => { const c = TERMS.find(x => x.t === t).c; if (usedOnce.has(TERM_PHOTO[t])) TERM_PHOTO[t] = CAT_POOL[c][i % CAT_POOL[c].length]; usedOnce.add(TERM_PHOTO[t]) })
const STORY_PHOTO = ['piggy', 'growth', 'revenue', 'paperChart', 'phoneTrading', 'calm', 'coins', 'candles', 'study']

function speak(text) {
  try {
    const s = window.speechSynthesis; if (!s) return
    s.cancel(); const u = new SpeechSynthesisUtterance(text); u.rate = 0.95; s.speak(u)
  } catch { /* speech unavailable */ }
}

function Compounding() {
  const [monthly, setMonthly] = useState(300); const [years, setYears] = useState(20); const [rate, setRate] = useState(8)
  const r = rate / 100 / 12; const n = years * 12
  const total = r === 0 ? monthly * n : monthly * ((Math.pow(1 + r, n) - 1) / r)
  const put = monthly * n; const growth = total - put
  const bars = Array.from({ length: years }, (_, i) => { const m = (i + 1) * 12; return { put: monthly * m, val: r === 0 ? monthly * m : monthly * ((Math.pow(1 + r, m) - 1) / r) } })
  const max = bars[bars.length - 1]?.val || 1
  return (
    <div className="tx-card">
      <div className="tx-card-head"><h3>❄️ See the snowball: what monthly saving becomes</h3></div>
      <div className="pe-sliders">
        <label>Every month <b>${monthly.toLocaleString()}</b><input type="range" min="50" max="3000" step="50" value={monthly} onChange={e => setMonthly(+e.target.value)} /></label>
        <label>For <b>{years} years</b><input type="range" min="1" max="40" value={years} onChange={e => setYears(+e.target.value)} /></label>
        <label>Growth per year <b>{rate}%</b><input type="range" min="0" max="12" step="0.5" value={rate} onChange={e => setRate(+e.target.value)} /></label>
      </div>
      <div className="pe-bars" role="img" aria-label="Money put in vs growth by year">
        {bars.map((b, i) => (
          <div key={i} title={`Year ${i + 1}: put in $${Math.round(b.put).toLocaleString()}, worth $${Math.round(b.val).toLocaleString()}`}>
            <span className="g" style={{ height: `${((b.val - b.put) / max) * 100}%` }} />
            <span className="p" style={{ height: `${(b.put / max) * 100}%` }} />
          </div>
        ))}
      </div>
      <div className="tx-legend"><span><em style={{ background: '#94a3b8' }} />Money you put in</span><span><em style={{ background: '#22c55e' }} />Free growth from compounding</span></div>
      <div className="tx-tiles">
        <div><small>You put in</small><b>${Math.round(put).toLocaleString()}</b></div>
        <div><small>Compounding added</small><b className="up">${Math.round(growth).toLocaleString()}</b></div>
        <div><small>You end up with</small><b>${Math.round(total).toLocaleString()}</b></div>
      </div>
      <p className="tx-fine">In plain English: in the last years, most of the growth comes from your earlier growth, not from your new savings. That is why starting early matters more than starting big.</p>
    </div>
  )
}

function Flashcards({ list }) {
  const [i, setI] = useState(0); const [flip, setFlip] = useState(false)
  const t = list[i % list.length]
  if (!t) return null
  const go = d => { setFlip(false); setI(v => (v + d + list.length) % list.length) }
  return (
    <div className="tx-card pe-flash-wrap">
      <div className="tx-card-head"><h3>🃏 Flashcards: test yourself</h3><span className="tx-chip">{(i % list.length) + 1} / {list.length}</span></div>
      <button type="button" className={`pe-flash ${flip ? 'flip' : ''}`} onClick={() => setFlip(f => !f)} aria-label="Flip card">
        <div className="pe-face front"><span>{t.e}</span><b>{t.t}</b><small>Tap to see the plain-English answer</small></div>
        <div className="pe-face back"><p><b>Means:</b> {t.lay}</p><p><b>Like:</b> {t.like}</p><p><b>Example:</b> {t.ex}</p></div>
      </button>
      <div className="pe-flash-nav"><button type="button" onClick={() => go(-1)}>← Previous</button><button type="button" onClick={() => go(Math.floor(Math.random() * list.length))}>🔀 Shuffle</button><button type="button" onClick={() => go(1)}>Next →</button></div>
    </div>
  )
}

export default function PlainEnglish() {
  const [cat, setCat] = useState('all'); const [q, setQ] = useState(''); const [step, setStep] = useState(0); const [open, setOpen] = useState(0)
  const list = useMemo(() => {
    const s = q.trim().toLowerCase()
    return TERMS.filter(t => (cat === 'all' || t.c === cat) && (!s || `${t.t} ${t.lay} ${t.like} ${t.ex}`.toLowerCase().includes(s)))
  }, [cat, q])
  const st = TRADE_STORY.steps[step]

  return (
    <div className="tx">
      <header className="tx-hero photo" style={{ '--hero': `url("${photoUrl('study', 1600, 700)}")` }}>
        <div>
          <span className="tx-kicker">🗣️ Trading in plain English</span>
          <h2>Every trading word, explained like you’re talking to a friend</h2>
          <p>{TERMS.length} ideas, each with a one-line meaning, an everyday comparison and a real-number example. Tap 🔊 to hear any card read aloud, or test yourself with flashcards.</p>
        </div>
      </header>

      <div className="pe-rules">{GOLDEN_RULES.map(([e, r], i) => <div key={r}><span>{e}</span><small>Rule {i + 1}</small><b>{r}</b></div>)}</div>

      <div className="pe-filter">
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search a word: dividend, stop-loss, P/E, leverage…" aria-label="Search terms" />
        <div>{PE_CATS.map(c => <button key={c.id} type="button" className={cat === c.id ? 'on' : ''} onClick={() => setCat(c.id)}>{c.icon} {c.label}</button>)}</div>
      </div>

      <div className="pe-grid">
        {list.map(t => (
          <article key={t.t} className="pe-card">
            <div className="pe-img" style={{ backgroundImage: `url("${photoUrl(TERM_PHOTO[t.t], 480, 220)}")` }}>
              <span>{t.e}</span>
              <button type="button" onClick={() => speak(`${t.t}. ${t.lay} It is like this: ${t.like} For example: ${t.ex}`)} aria-label={`Read ${t.t} aloud`}>🔊</button>
            </div>
            <div className="pe-body">
              <h3>{t.t}</h3>
              <p className="pe-lay">{t.lay}</p>
              <p className="pe-like"><b>🧒 It’s like…</b> {t.like}</p>
              <p className="pe-ex"><b>🔢 Real example:</b> {t.ex}</p>
            </div>
          </article>
        ))}
        {!list.length && <p className="tx-fine">No match. Try another word.</p>}
      </div>

      <div className="tx-two">
        <Flashcards list={list.length ? list : TERMS} />
        <Compounding />
      </div>

      <section className="tx-card pe-story">
        <div className="tx-card-head"><h3>📖 One trade, start to finish: {TRADE_STORY.hero}</h3><span className="tx-chip">Step {step + 1} of {TRADE_STORY.steps.length}</span></div>
        <div className="pe-steps">{TRADE_STORY.steps.map((s, i) => <button key={s.t} type="button" className={i === step ? 'on' : i < step ? 'done' : ''} onClick={() => setStep(i)}><span>{s.e}</span>{s.t}</button>)}</div>
        <div className="pe-story-body">
          <img src={photoUrl(STORY_PHOTO[step], 800, 480)} alt="" loading="lazy" />
          <div>
            <h4>{st.e} {st.t}</h4>
            <p>{st.s}</p>
            <p className="ta-rem">💡 Lesson: {st.lesson}</p>
            <div className="pe-flash-nav">
              <button type="button" disabled={step === 0} onClick={() => setStep(s => s - 1)}>← Back</button>
              <button type="button" onClick={() => speak(`${st.t}. ${st.s} Lesson: ${st.lesson}`)}>🔊 Read aloud</button>
              <button type="button" disabled={step === TRADE_STORY.steps.length - 1} onClick={() => setStep(s => s + 1)}>Next →</button>
            </div>
          </div>
        </div>
      </section>

      <section className="tx-card">
        <div className="tx-card-head"><h3>🧐 Myths vs facts</h3></div>
        <div className="pe-myths">{MYTHS.map(m => <div key={m.m}><p className="myth">❌ {m.m}</p><p className="fact">✅ {m.f}</p></div>)}</div>
      </section>

      <section className="tx-card">
        <div className="tx-card-head"><h3>🙋 Questions beginners always ask</h3></div>
        <div className="pe-faq">
          {FAQ.map((f, i) => (
            <div key={f.q} className={open === i ? 'on' : ''}>
              <button type="button" onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}>{f.q}<span>{open === i ? '−' : '+'}</span></button>
              {open === i && <p>{f.a}</p>}
            </div>
          ))}
        </div>
      </section>
      <p className="tx-fine">{DISCLAIMER}</p>
    </div>
  )
}
