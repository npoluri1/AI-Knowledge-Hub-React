import { useState, useMemo, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ROWS, { AI_STACK_CATEGORIES, AI_STACK_STATS, aiStackCat } from '../data/aiStackData'
import './AiStackScreen.css'

const SPLIT_RE = /(https?:\/\/[^\s|]+|[a-z0-9.-]+\.(?:com|ai|dev|io|org|gov|net)(?::\d+)?(?:\/[^\s|]*)?)/gi
const IS_URL_RE = /^(https?:\/\/)?[a-z0-9.-]+\.(?:com|ai|dev|io|org|gov|net)(?::\d+)?(?:\/\S*)?$/i

function linkify(text) {
  if (!text || text === '-') return <span className="as-dim">—</span>
  const parts = text.split(SPLIT_RE)
  return parts.map((part, i) => {
    if (IS_URL_RE.test(part) && part.length > 1) {
      const clean = part.replace(/^https?:\/\//i, '')
      return <a key={i} href={`https://${clean}`} target="_blank" rel="noopener noreferrer">{part}</a>
    }
    return <span key={i}>{part}</span>
  })
}

function dedupeText(text) {
  return text.replace(/\s*[|]\s*/g, ' · ').replace(/\s+/g, ' ').trim()
}

export default function AiStackScreen() {
  const [cat, setCat] = useState('all')
  const [q, setQ] = useState('')
  const [compact, setCompact] = useState(true)
  const [indColor, setIndColor] = useState(null)
  const tableRef = useRef(null)

  const industries = useMemo(() => [...new Set(ROWS.map(r => r.industry))].sort(), [])
  const industryCounts = useMemo(() => {
    const m = { All: ROWS.length }
    ROWS.forEach(r => { m[r.industry] = (m[r.industry] || 0) + 1 })
    return m
  }, [])

  const filtered = useMemo(() => {
    let list = cat === 'all' ? ROWS : ROWS.filter(r => r.cat === cat)
    if (indColor && indColor !== 'All') list = list.filter(r => r.industry === indColor)
    const needle = q.trim().toLowerCase()
    if (needle) {
      list = list.filter(r =>
        [r.tool, r.what, r.code, r.docs, r.use, r.industry, r.cat]
          .join(' ').toLowerCase().includes(needle))
    }
    return list
  }, [cat, q, indColor])

  useEffect(() => {
    const el = tableRef.current
    if (el) el.scrollTop = 0
  }, [cat, q, indColor])

  return (
    <div className="as-page">
      <Link to="/" className="back-link">← Back to Home</Link>

      <div className="as-header">
        <div className="as-title-row">
          <h1>🧠 AI Stack — One-Screen Reference</h1>
          <div className="as-stats">
            <span className="as-stat">{AI_STACK_STATS.total} Tools</span>
            <span className="as-stat">{AI_STACK_STATS.categories} Categories</span>
            <span className="as-stat">{AI_STACK_STATS.industries} Industries</span>
          </div>
        </div>
        <p className="as-subtitle">
          Everything in one viewport: coding agents, MCP, frameworks, RAG, inference, deployment, MLOps, security & industry playbooks.
        </p>
      </div>

      <div className="as-toolbar">
        <div className="as-search-box">
          <span className="as-search-icon">🔍</span>
          <input
            type="text"
            placeholder="Filter 68 tools — search tool, category, code, use case…"
            value={q}
            onChange={e => setQ(e.target.value)}
            className="as-search-input"
          />
          {q && <button className="as-search-clear" onClick={() => setQ('')}>✕</button>}
        </div>
        <select className="as-sort" value={indColor || ''} onChange={e => setIndColor(e.target.value || null)}>
          <option value="">🏷️ All Industries</option>
          {industries.map(i => <option key={i} value={i}>{i} ({industryCounts[i]})</option>)}
        </select>
        <label className="as-compact">
          <input type="checkbox" checked={compact} onChange={e => setCompact(e.target.checked)} />
          Compact
        </label>
      </div>

      <div className="as-chips">
        <button className={`as-chip ${cat === 'all' ? 'as-chip-active' : ''}`} onClick={() => setCat('all')}>
          🌐 All <b>({AI_STACK_STATS.total})</b>
        </button>
        {AI_STACK_CATEGORIES.map(c => (
          <button
            key={c.name}
            className={`as-chip ${cat === c.name ? 'as-chip-active' : ''}`}
            style={cat === c.name ? { background: `${c.color}22`, borderColor: c.color, color: c.color } : undefined}
            onClick={() => setCat(c.name)}
          >
            {c.icon} {c.name} <b>({ROWS.filter(r => r.cat === c.name).length})</b>
          </button>
        ))}
      </div>

      <div className="as-countline">
        {filtered.length} of {AI_STACK_STATS.total} tools{cat !== 'all' && <span> in <b>{cat}</b></span>}
        {indColor && <span> · industry <b>{indColor}</b></span>}
        {q && <span> · matching "<b>{q}</b>"</span>}
      </div>

      <div className="as-table-wrap">
        <div className="as-table" ref={tableRef}>
          <table className={`as-table-el ${compact ? 'as-compact' : ''}`}>
            <thead>
              <tr>
                <th className="as-col-num">#</th>
                <th className="as-col-cat">Category</th>
                <th className="as-col-tool">Tool / Feature</th>
                <th className="as-col-what">What It Does</th>
                <th className="as-col-code">Code / Config</th>
                <th className="as-col-docs">Docs / Models</th>
                <th className="as-col-use">Use Case</th>
                <th className="as-col-ind">Industry</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => {
                const m = aiStackCat(r.cat)
                return (
                  <tr key={r.num} className="as-row">
                    <td className="as-col-num as-num">{r.num}</td>
                    <td className="as-col-cat">
                      <span className="as-cat-badge" style={{ background: `${m.color}22`, color: m.color, borderColor: `${m.color}55` }}>
                        {m.icon} {r.cat}
                      </span>
                    </td>
                    <td className="as-col-tool as-tool">{r.tool}</td>
                    <td className="as-col-what">{r.what}</td>
                    <td className="as-col-code">
                      <code className="as-code">{dedupeText(r.code)}</code>
                    </td>
                    <td className="as-col-docs as-docs">{linkify(dedupeText(r.docs))}</td>
                    <td className="as-col-use">{r.use}</td>
                    <td className="as-col-ind"><span className="as-ind">{r.industry}</span></td>
                  </tr>
                )
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="as-empty">No tools match your filter.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="as-footer">
        — AI Stack Reference · {AI_STACK_STATS.total} tools across {AI_STACK_STATS.categories} categories | Compiled 2026 —
      </div>
    </div>
  )
}
