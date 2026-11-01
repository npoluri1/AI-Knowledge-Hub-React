import { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ROWS, { AI_STACK_CATEGORIES, AI_STACK_STATS, aiStackCat } from '../data/aiStackData'
import { menuImage } from '../data/menuVisuals'
import { useLang } from '../i18n'
import './AiStackScreen.css'

const SPLIT_RE = /(https?:\/\/[^\s|;,]+|[a-z0-9.-]+\.(?:com|ai|dev|io|org|gov|net|sh)(?::\d+)?(?:\/[^\s|;,]*)?)/gi
const IS_URL_RE = /^(https?:\/\/)?[a-z0-9.-]+\.(?:com|ai|dev|io|org|gov|net|sh)(?::\d+)?(?:\/\S*)?$/i

function linkify(text) {
  if (!text || text === '-' || text === '—') return <span className="as-dim">—</span>
  return text.split(SPLIT_RE).map((part, i) => {
    if (IS_URL_RE.test(part) && part.length > 3) {
      const clean = part.replace(/^https?:\/\//i, '')
      return <a key={i} href={`https://${clean}`} target="_blank" rel="noopener noreferrer">{clean.replace(/\/$/, '')}</a>
    }
    return <span key={i}>{part}</span>
  })
}
const tidy = text => String(text || '').replace(/\s*[|]\s*/g, ' · ').replace(/\s+/g, ' ').trim()

const lsGet = (k, d) => { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v) } catch { return d } }
const lsSet = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)) } catch { /* storage unavailable */ } }

function CopyCode({ code }) {
  const [done, setDone] = useState(false)
  const copy = async () => {
    try { await navigator.clipboard.writeText(code); setDone(true); setTimeout(() => setDone(false), 1400) } catch { /* clipboard blocked */ }
  }
  return (
    <div className="as-code">
      <code>{code}</code>
      <button type="button" onClick={copy} aria-label="Copy code">{done ? '✓' : '⧉'}</button>
    </div>
  )
}

function ToolCard({ r }) {
  const c = aiStackCat(r.cat)
  return (
    <article className="as-card" style={{ '--c': c.color }}>
      <header>
        <span className="as-card-num">{String(r.num).padStart(2, '0')}</span>
        <h3>{r.tool}</h3>
        {r.isNew && <span className="as-new">NEW</span>}
      </header>
      <p className="as-what">{r.what}</p>
      <CopyCode code={r.code} />
      <div className="as-docs">📘 {linkify(tidy(r.docs))}</div>
      <footer>
        <span className="as-use">🎯 {r.use}</span>
        <span className="as-ind">{r.industry}</span>
      </footer>
    </article>
  )
}

export default function AiStackScreen() {
  const { t } = useLang()
  const [cat, setCat] = useState('all')
  const [q, setQ] = useState('')
  const [industry, setIndustry] = useState('All')
  const [onlyNew, setOnlyNew] = useState(false)
  const [savedView, setView] = useState(() => lsGet('as.view', 'cards'))
  const [narrow, setNarrow] = useState(() => window.matchMedia?.('(max-width: 768px)').matches)
  useEffect(() => {
    const mq = window.matchMedia?.('(max-width: 768px)')
    if (!mq) return undefined
    const on = () => setNarrow(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  const view = narrow ? 'cards' : savedView // phones always get cards
  const pickView = v => { setView(v); lsSet('as.view', v) }

  const industries = useMemo(() => ['All', ...[...new Set(ROWS.map(r => r.industry))].sort()], [])
  const catCounts = useMemo(() => {
    const m = { all: ROWS.length }
    ROWS.forEach(r => { m[r.cat] = (m[r.cat] || 0) + 1 })
    return m
  }, [])

  const filtered = useMemo(() => {
    let list = cat === 'all' ? ROWS : ROWS.filter(r => r.cat === cat)
    if (industry !== 'All') list = list.filter(r => r.industry === industry)
    if (onlyNew) list = list.filter(r => r.isNew)
    const needle = q.trim().toLowerCase()
    if (needle) list = list.filter(r => [r.tool, r.what, r.code, r.docs, r.use, r.industry, r.cat].join(' ').toLowerCase().includes(needle))
    return list
  }, [cat, q, industry, onlyNew])

  const grouped = useMemo(() => AI_STACK_CATEGORIES
    .map(c => ({ ...c, rows: filtered.filter(r => r.cat === c.name) }))
    .filter(g => g.rows.length), [filtered])

  useEffect(() => { if (cat !== 'all') document.getElementById('as-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }, [cat])
  const reset = () => { setCat('all'); setQ(''); setIndustry('All'); setOnlyNew(false) }

  return (
    <div className="as-page">
      <Link to="/" className="back-link">← {t('Back to Home')}</Link>

      <section className="as-hero" style={{ '--hero': `url("${menuImage('/ai-stack', 1800)}")` }}>
        <div className="as-hero-inner">
          <div className="as-kicker"><span className="as-kicker-dot" /> {t('Technology Selection Map')} · updated {AI_STACK_STATS.updated}</div>
          <h1>{t('AI Stack')}</h1>
          <p>Every layer of a modern AI application — models, agents, MCP, RAG, inference, deployment, MLOps and security — with copy-ready commands and official docs.</p>
          <div className="as-stats">
            <div><b>{AI_STACK_STATS.total}</b><span>{t('Tools')}</span></div>
            <div><b>{AI_STACK_STATS.categories}</b><span>{t('Categories')}</span></div>
            <div><b>{AI_STACK_STATS.industries}</b><span>{t('Industries')}</span></div>
            <button type="button" className={`as-stat-new ${onlyNew ? 'on' : ''}`} onClick={() => setOnlyNew(v => !v)}><b>{AI_STACK_STATS.fresh}</b><span>new this year ✦</span></button>
          </div>
          <label className="as-search">
            <span aria-hidden="true">⌕</span>
            <input value={q} onChange={e => setQ(e.target.value)} placeholder={`Search ${ROWS.length} tools — e.g. MCP, vLLM, guardrails, LangGraph…`} aria-label="Search tools" />
            {q && <button type="button" onClick={() => setQ('')} aria-label="Clear search">✕</button>}
          </label>
        </div>
      </section>

      <div className="as-toolbar">
        <div className="as-chips" role="tablist" aria-label="Categories">
          <button type="button" role="tab" aria-selected={cat === 'all'} className={cat === 'all' ? 'on' : ''} style={{ '--c': '#79d9f2' }} onClick={() => setCat('all')}>
            🌐 All <em>{catCounts.all}</em>
          </button>
          {AI_STACK_CATEGORIES.map(c => (
            <button key={c.name} type="button" role="tab" aria-selected={cat === c.name} className={cat === c.name ? 'on' : ''} style={{ '--c': c.color }} onClick={() => setCat(c.name)}>
              {c.icon} {c.name} <em>{catCounts[c.name] || 0}</em>
            </button>
          ))}
        </div>
        <div className="as-controls">
          <select value={industry} onChange={e => setIndustry(e.target.value)} aria-label="Industry">
            {industries.map(i => <option key={i} value={i}>{i === 'All' ? '🏷️ All industries' : i}</option>)}
          </select>
          <label className="as-toggle"><input type="checkbox" checked={onlyNew} onChange={e => setOnlyNew(e.target.checked)} /> New only</label>
          <div className="as-seg" role="group" aria-label="View">
            <button type="button" className={view === 'cards' ? 'on' : ''} onClick={() => pickView('cards')}>▦ Cards</button>
            <button type="button" className={view === 'table' ? 'on' : ''} onClick={() => pickView('table')}>☰ Table</button>
          </div>
          <span className="as-count">{filtered.length} of {ROWS.length}</span>
        </div>
      </div>

      <div id="as-results">
        {filtered.length === 0 && (
          <div className="as-empty">No tools match. <button type="button" onClick={reset}>Reset filters</button></div>
        )}

        {view === 'cards' && grouped.map(g => (
          <section key={g.name} className="as-group" style={{ '--c': g.color }}>
            <h2><span>{g.icon}</span>{g.name}<em>{g.rows.length}</em></h2>
            <div className="as-grid">{g.rows.map(r => <ToolCard key={r.num} r={r} />)}</div>
          </section>
        ))}

        {view === 'table' && filtered.length > 0 && (
          <div className="as-table-wrap">
            <table className="as-table">
              <thead>
                <tr><th>#</th><th>Tool</th><th>What it does</th><th>Code / config</th><th>Docs</th><th>Use case</th><th>Industry</th></tr>
              </thead>
              <tbody>
                {filtered.map(r => {
                  const c = aiStackCat(r.cat)
                  return (
                    <tr key={r.num} style={{ '--c': c.color }}>
                      <td className="as-td-num">{r.num}</td>
                      <td className="as-td-tool"><span className="as-td-cat">{c.icon} {r.cat}</span><b>{r.tool}</b>{r.isNew && <span className="as-new">NEW</span>}</td>
                      <td>{r.what}</td>
                      <td className="as-td-code"><CopyCode code={r.code} /></td>
                      <td className="as-td-docs">{linkify(tidy(r.docs))}</td>
                      <td>{r.use}</td>
                      <td><span className="as-ind">{r.industry}</span></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="as-footer">AI Stack Reference · {ROWS.length} tools across {AI_STACK_CATEGORIES.length} categories · updated {AI_STACK_STATS.updated}</div>
    </div>
  )
}
