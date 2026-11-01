import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../i18n'
import './LearnHub.css'

const fmt = (n, d = 3) => (isFinite(n) ? n.toFixed(d) : '—')

// Deterministic PRNG (mulberry32)
const mulberry = seed => {
  let a = seed >>> 0
  return () => {
    a |= 0; a = (a + 0x6D2B79F5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export default function Calculators() {
  const { t } = useLang()
  return (
    <div className="lh-page">
      <Link to="/learn" className="lh-back">← {t('Back to Learning Hub')}</Link>
      <section className="lh-topic-hero" style={{ '--t-grad': 'linear-gradient(135deg, #f9e2af2e, #f9e2af08)', '--t-color': '#f9e2af' }}>
        <div className="lh-topic-icon">🧮</div>
        <div className="lh-topic-text">
          <div className="lh-kicker">ML Calculators · fully client-side · no data uploads</div>
          <h1>{t('Free Tools to Calculate, Visualize & Pressure-Test ML Metrics')}</h1>
          <p>From classroom basics to production model analysis — every calculation runs locally in your browser.</p>
        </div>
      </section>

      <ConfusionMatrix />
      <SyntheticData />
    </div>
  )
}

/* ---------------- Confusion Matrix Calculator ---------------- */
function ConfusionMatrix() {
  const [tp, setTp] = useState(85)
  const [fp, setFp] = useState(10)
  const [tn, setTn] = useState(120)
  const [fn, setFn] = useState(15)

  const m = useMemo(() => {
    const P = tp + fn, N = fp + tn, total = P + N
    const acc = (tp + tn) / (total || 1)
    const prec = tp / (tp + fp || 1)
    const rec = tp / (P || 1)
    const spec = tn / (N || 1)
    const f1 = 2 * ((prec * rec) / (prec + rec || 1))
    const mcc = (tp * tn - fp * fn) / (Math.sqrt((tp + fp) * (tp + fn) * (tn + fp) * (tn + fn)) || 1)
    return { P, N, total, acc, prec, rec, spec, f1, mcc }
  }, [tp, fp, tn, fn])

  const cell = (label, val, color) => (
    <div className="cm-cell" style={{ '--cm-c': color }}>
      <span className="cm-cell-label">{label}</span>
      <input type="number" min="0" value={val} onChange={e => setter(e, val, e.target.value)} aria-label={label} />
    </div>
  )
  const setter = (e, cur, raw) => {
    const n = Number(raw)
    if (raw === '') return
    if (isNaN(n) || n < 0) return
    if (cur === tp) setTp(n)
    else if (cur === fp) setFp(n)
    else if (cur === tn) setTn(n)
    else setFn(n)
  }

  const metrics = [
    { label: 'Accuracy', val: m.acc, note: 'Correct ÷ total — misleads on imbalance' },
    { label: 'Precision', val: m.prec, note: 'TP ÷ (TP+FP) — false positives cost' },
    { label: 'Recall', val: m.rec, note: 'TP ÷ (TP+FN) — false negatives cost' },
    { label: 'Specificity', val: m.spec, note: 'TN ÷ (TN+FP) — true negative rate' },
    { label: 'F1 Score', val: m.f1, note: 'Harmonic mean of precision & recall' },
    { label: 'Matthews MCC', val: m.mcc, note: 'Balanced correlation, robust to imbalance' },
  ]

  const bar = (label, v, color) => (
    <div className="cm-bar-row">
      <span className="cm-bar-label">{label}</span>
      <div className="cm-bar"><span style={{ width: `${Math.max(2, v * 100)}%`, background: color }} /></div>
      <span className="cm-bar-val">{fmt(v * 100, 1)}%</span>
    </div>
  )

  return (
    <section className="lh-tool-card" id="confusion-matrix">
      <div className="lh-tool-head">
        <div><span className="lh-kicker">📊 Calculator 01</span><h2>Confusion Matrix Calculator</h2></div>
        <span className="lh-lib-chip">Precision · Recall · F1 · ROC · threshold &amp; imbalance</span>
      </div>
      <p className="lh-tool-desc">Enter true positives, false positives, true negatives, and false negatives — the matrix fills in live with every derived metric.</p>

      <div className="cm-layout">
        <div className="cm-grid">
          <div className="cm-corner" />
          <div className="cm-head">Predicted Positive</div>
          <div className="cm-head">Predicted Negative</div>
          <div className="cm-head">Actual Positive</div>
          {cell('TP', tp, '#a6e3a1')}
          {cell('FN', fn, '#f38ba8')}
          <div className="cm-head">Actual Negative</div>
          {cell('FP', fp, '#f9e2af')}
          {cell('TN', tn, '#94e2d5')}
          <div className="cm-foot">Prevalence: {fmt((m.P / m.total) * 100, 1)}%</div>
          <div className="cm-foot">PPV {fmt(m.prec * 100, 1)}%</div>
          <div className="cm-foot">NPV {fmt(m.spec * 100, 1)}%</div>
        </div>
        <div className="cm-metrics">
          {metrics.map(mt => (
            <div className="cm-metric" key={mt.label} style={{ '--m-c': '#f9e2af' }}>
              <span className="cm-metric-label">{mt.label}</span>
              <strong>{fmt(mt.val)}</strong>
              <small>{mt.note}</small>
            </div>
          ))}
        </div>
      </div>

      <div className="cm-bars">
        {bar('Accuracy', m.acc, '#a6e3a1')}
        {bar('Precision', m.prec, '#89b4fa')}
        {bar('Recall', m.rec, '#cba6f7')}
        {bar('Specificity', m.spec, '#94e2d5')}
        {bar('F1', m.f1, '#f9e2af')}
      </div>
      <p className="lh-tool-note">💡 On imbalanced data, accuracy can look great while precision or recall collapses. Watch the metric that matches your business cost — false positives (spam) or false negatives (cancer screening).</p>
    </section>
  )
}

/* ---------------- Synthetic Data Generator ---------------- */
function SyntheticData() {
  const { t } = useLang()
  const [n, setN] = useState(400)
  const [noise, setNoise] = useState(0.18)
  const [imbalance, setImbalance] = useState(50)
  const [seed, setSeed] = useState(42)

  const data = useMemo(() => {
    const rand = mulberry(seed)
    const rows = []
    for (let i = 0; i < n; i++) {
      const minority = rand() * 100 < imbalance
      const x = rand() * 10
      const y = rand() * 10
      const onBand = Math.abs(y - (x + 1.5)) < 1.2 || Math.abs(y - (x - 3)) < 1.2
      let label = 0
      if (minority) label = onBand || rand() < (1 - noise) ? 1 : 0
      else label = rand() < noise ? 1 : 0
      rows.push({ x, y, label })
    }
    return rows
  }, [n, noise, imbalance, seed])

  const cls1 = data.filter(d => d.label === 1).length
  const cls0 = data.length - cls1

  const toCSV = () => {
    const head = 'x,y,label\n'
    const body = data.map(d => `${d.x.toFixed(4)},${d.y.toFixed(4)},${d.label}`).join('\n')
    const blob = new Blob([head + body], { type: 'text/csv' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'synthetic-classification.csv'
    a.click()
    URL.revokeObjectURL(a.href)
  }

  return (
    <section className="lh-tool-card" id="synthetic-data">
      <div className="lh-tool-head">
        <div><span className="lh-kicker">🎲 Calculator 02</span><h2>Synthetic Data Generator</h2></div>
        <span className="lh-lib-chip">Tunable noise · imbalance · distribution</span>
      </div>
      <p className="lh-tool-desc">Build a synthetic classification dataset with tunable noise, imbalance, and shape — perfect for testing models before real data arrives.</p>

      <div className="sd-layout">
        <div className="sd-controls">
          <label>Samples: <strong>{n}</strong>
            <input type="range" min="50" max="2000" step="50" value={n} onChange={e => setN(Number(e.target.value))} />
          </label>
          <label>Noise: <strong>{fmt(noise * 100, 0)}%</strong>
            <input type="range" min="0" max="0.6" step="0.02" value={noise} onChange={e => setNoise(Number(e.target.value))} />
          </label>
          <label>Minority class: <strong>{imbalance}%</strong>
            <input type="range" min="5" max="50" step="5" value={imbalance} onChange={e => setImbalance(Number(e.target.value))} />
          </label>
          <label>Seed: <strong>{seed}</strong>
            <input type="range" min="1" max="999" step="1" value={seed} onChange={e => setSeed(Number(e.target.value))} />
          </label>
          <button type="button" className="lh-btn" onClick={toCSV}>⬇ {t('Export CSV')}</button>
        </div>
        <div className="sd-preview">
          <svg viewBox="0 0 200 200" className="sd-svg" role="img" aria-label="Scatter plot of synthetic dataset">
            {data.map((d, i) => (
              <circle key={i} cx={d.x * 20} cy={d.y * 20} r={2.2}
                fill={d.label ? '#a6e3a1' : '#f38ba8'}
                opacity={0.75} />
            ))}
          </svg>
          <div className="sd-legend">
            <span><i style={{ background: '#a6e3a1' }} /> Class 1 ({cls1})</span>
            <span><i style={{ background: '#f38ba8' }} /> Class 0 ({cls0})</span>
            <span>Imbalance: {fmt((cls1 / (data.length || 1)) * 100, 1)}% positive</span>
          </div>
        </div>
      </div>
      <div className="sd-bars">
        <div className="cm-bar-row">
          <span className="cm-bar-label">Class 1</span>
          <div className="cm-bar"><span style={{ width: `${(cls1 / (data.length || 1)) * 100}%`, background: '#a6e3a1' }} /></div>
          <span className="cm-bar-val">{cls1}</span>
        </div>
        <div className="cm-bar-row">
          <span className="cm-bar-label">Class 0</span>
          <div className="cm-bar"><span style={{ width: `${(cls0 / (data.length || 1)) * 100}%`, background: '#f38ba8' }} /></div>
          <span className="cm-bar-val">{cls0}</span>
        </div>
      </div>
      <p className="lh-tool-note">💡 The dataset is generated with a seeded PRNG — the same seed always produces the same data, so experiments stay reproducible. Use the CSV export to feed it straight into sklearn.</p>
    </section>
  )
}
