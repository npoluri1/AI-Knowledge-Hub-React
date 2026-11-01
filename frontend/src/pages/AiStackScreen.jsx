import { useState, useMemo, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ROWS, { AI_STACK_CATEGORIES, AI_STACK_STATS, aiStackCat } from '../data/aiStackData'
import FetchButton from '../components/FetchButton'
import { useLang } from '../i18n'
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

/* Category gradient themes */
const CAT_THEMES = {
  'Claude Code':     { gradient: 'linear-gradient(135deg, #667eea, #764ba2)', accent: '#667eea', glow: 'rgba(102,126,234,.3)' },
  'Claude Features': { gradient: 'linear-gradient(135deg, #f093fb, #f5576c)', accent: '#f5576c', glow: 'rgba(245,87,108,.3)' },
  'MCP Ecosystem':   { gradient: 'linear-gradient(135deg, #4facfe, #00f2fe)', accent: '#4facfe', glow: 'rgba(79,172,254,.3)' },
  'AI Coding Tools': { gradient: 'linear-gradient(135deg, #43e97b, #38f9d7)', accent: '#43e97b', glow: 'rgba(67,233,123,.3)' },
  'Agentic Frameworks': { gradient: 'linear-gradient(135deg, #fa709a, #fee140)', accent: '#fa709a', glow: 'rgba(250,112,154,.3)' },
  'RAG & Vectors':   { gradient: 'linear-gradient(135deg, #fccb90, #d57eeb)', accent: '#d57eeb', glow: 'rgba(213,126,235,.3)' },
  'Inference':       { gradient: 'linear-gradient(135deg, #ff9a9e, #fecfef)', accent: '#ff9a9e', glow: 'rgba(255,154,158,.3)' },
  'Models':          { gradient: 'linear-gradient(135deg, #a1c4fd, #c2e9fb)', accent: '#a1c4fd', glow: 'rgba(161,196,253,.3)' },
  'Deployment':      { gradient: 'linear-gradient(135deg, #96fbc4, #f9f586)', accent: '#96fbc4', glow: 'rgba(150,251,196,.3)' },
  'MLOps':           { gradient: 'linear-gradient(135deg, #e0c3fc, #8ec5fc)', accent: '#8ec5fc', glow: 'rgba(142,197,252,.3)' },
  'Security':        { gradient: 'linear-gradient(135deg, #f5576c, #ff8a5c)', accent: '#ff8a5c', glow: 'rgba(255,138,92,.3)' },
  'Industry':        { gradient: 'linear-gradient(135deg, #cd9cf2, #f6f3ff)', accent: '#cd9cf2', glow: 'rgba(205,156,242,.3)' },
  'Productivity':    { gradient: 'linear-gradient(135deg, #89f7fe, #66a6ff)', accent: '#66a6ff', glow: 'rgba(102,166,255,.3)' },
}

const getTheme = name => CAT_THEMES[name] || { gradient: 'linear-gradient(135deg, #667eea, #764ba2)', accent: '#667eea', glow: 'rgba(102,126,234,.3)' }

export default function AiStackScreen() {
  const { t } = useLang()
  const [cat, setCat] = useState('all')
  const [q, setQ] = useState('')
  const [compact, setCompact] = useState(true)
  const [indColor, setIndColor] = useState(null)
  const [expandedRow, setExpandedRow] = useState(null)
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

  const catCounts = useMemo(() => {
    const m = { all: ROWS.length }
    ROWS.forEach(r => { m[r.cat] = (m[r.cat] || 0) + 1 })
    return m
  }, [])

  useEffect(() => {
    const el = tableRef.current
    if (el) el.scrollTop = 0
  }, [cat, q, indColor])

  return (
    <div className="as-page">
      <Link to="/" className="back-link">← {t('Back to Home')}</Link>

      {/* ═══ Rich Hero ═══ */}
      <section className="as-hero">
        <div className="as-hero-orbs" aria-hidden="true">
          <div className="as-orb as-orb-1" />
          <div className="as-orb as-orb-2" />
          <div className="as-orb as-orb-3" />
        </div>
        <div className="as-hero-content">
          <div className="as-kicker">
            <span className="as-kicker-dot" /> {t('Technology Selection Map')}
          </div>
          <div className="page-header-row">
            <h1>
              <span className="as-hero-highlight">{t('AI Stack')}</span>
            </h1>
            <FetchButton onFetch={() => { setCat('all'); setQ(''); setCompact(true) }} label={t('Fetch Latest')} staticMode />
          </div>
          <p>Compare the tools and services that form a modern AI application from model provider to observability and deployment.</p>
          <div className="as-hero-tags">
            <span>✓ Filter by capability</span>
            <span>✓ Compare implementation roles</span>
            <span>✓ Select a minimal stack before adding complexity</span>
          </div>
          <div className="as-hero-stats">
            <div className="as-stat-card">
              <span className="as-stat-num">{AI_STACK_STATS.total}</span>
              <span className="as-stat-label">{t('Tools')}</span>
            </div>
            <div className="as-stat-divider" />
            <div className="as-stat-card">
              <span className="as-stat-num">{AI_STACK_STATS.categories}</span>
              <span className="as-stat-label">{t('Categories')}</span>
            </div>
            <div className="as-stat-divider" />
            <div className="as-stat-card">
              <span className="as-stat-num">{AI_STACK_STATS.industries}</span>
              <span className="as-stat-label">{t('Industries')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Search & Filters ═══ */}
      <section className="as-toolbar">
        <div className="as-search-wrap">
          <span className="as-search-icon">🔍</span>
          <input
            type="text"
            placeholder={`Filter ${AI_STACK_STATS.total} tools — search tool, category, code, use case…`}
            value={q}
            onChange={e => setQ(e.target.value)}
            className="as-search-input"
          />
          {q && <button className="as-search-clear" onClick={() => setQ('')}>✕</button>}
        </div>
        <div className="as-toolbar-right">
          <select className="as-sort" value={indColor || ''} onChange={e => setIndColor(e.target.value || null)}>
            <option value="">🏷️ All Industries</option>
            {industries.map(i => <option key={i} value={i}>{i} ({industryCounts[i]})</option>)}
          </select>
          <label className="as-compact">
            <input type="checkbox" checked={compact} onChange={e => setCompact(e.target.checked)} />
            {t('Compact')}
          </label>
        </div>
      </section>

      {/* ═══ Category Chips with Gradients ═══ */}
      <div className="as-chips">
        <button className={`as-chip ${cat === 'all' ? 'as-chip-active' : ''}`} onClick={() => setCat('all')}>
          🌐 {t('All')} <b>({catCounts.all})</b>
        </button>
        {AI_STACK_CATEGORIES.map(c => {
          const t = getTheme(c.name)
          return (
            <button
              key={c.name}
              className={`as-chip ${cat === c.name ? 'as-chip-active' : ''}`}
              style={cat === c.name ? { background: t.gradient, borderColor: t.accent, color: '#fff', boxShadow: `0 2px 12px ${t.glow}` } : undefined}
              onClick={() => setCat(c.name)}
            >
              {c.icon} {c.name} <b>({catCounts[c.name] || 0})</b>
            </button>
          )
        })}
      </div>

      {/* ═══ Count line ═══ */}
      <div className="as-countline">
        <span className="as-count-num">{filtered.length}</span> of {AI_STACK_STATS.total} tools
        {cat !== 'all' && <span> in <b style={{ color: getTheme(cat).accent }}>{cat}</b></span>}
        {indColor && <span> · industry <b>{indColor}</b></span>}
        {q && <span> · matching "<b>{q}</b>"</span>}
      </div>

      {/* ═══ Table ═══ */}
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
                const t = getTheme(r.cat)
                const isExpanded = expandedRow === r.num
                return (
                  <tr
                    key={r.num}
                    className={`as-row ${isExpanded ? 'as-row-expanded' : ''}`}
                    onClick={() => setExpandedRow(isExpanded ? null : r.num)}
                  >
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
                  <td colSpan={8} className="as-empty">
                    <div className="as-empty-inner">
                      <span className="as-empty-icon">🔍</span>
                      <p>No tools match your filter.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ═══ Footer ═══ */}
      <footer className="as-footer">
        <div className="as-footer-inner">
          <span>AI Stack Reference · {AI_STACK_STATS.total} tools across {AI_STACK_STATS.categories} categories</span>
          <span className="as-footer-tech">Compiled 2026</span>
        </div>
      </footer>
    </div>
  )
}
