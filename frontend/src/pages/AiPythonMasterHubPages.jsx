import React, { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { AI_PYTHON_MASTERHUB_CATEGORIES, AI_PYTHON_MASTERHUB_PAGES, CATEGORY_THEME } from '../data/aiPythonMasterHubPagesData'
import FetchButton from '../components/FetchButton'
import AiPythonGuideCompanion from '../components/AiPythonGuideCompanion'
import { useLang } from '../i18n'
import './AiPythonMasterHubPages.css'

const SOURCE_ROOT = '/ai-python-masterhub/'
const pageUrl = file => `${SOURCE_ROOT}${file}`
const getTheme = cat => CATEGORY_THEME[cat] || CATEGORY_THEME['Agents']

/* ── Floating decorative symbols for the hero ─────────────────────── */
const FLOAT_SYMBOLS = ['< />', '{ }', 'λ', '∫', '∂', '∑', 'Δ', '0 1', 'def()', '=>', '&&', '||', 'async', 'import', 'class', '# =>']

export default function AiPythonMasterHubPages() {
  const { t } = useLang()
  const navigate = useNavigate()
  const { file } = useParams()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [readerScale, setReaderScale] = useState(1)

  const selected = useMemo(() => AI_PYTHON_MASTERHUB_PAGES.find(page => page.file === file), [file])

  const filtered = useMemo(() => AI_PYTHON_MASTERHUB_PAGES.filter(page => {
    const matchesCategory = category === 'All' || page.category === category
    return matchesCategory && `${page.title} ${page.category}`.toLowerCase().includes(query.trim().toLowerCase())
  }), [category, query])

  const categoryCounts = useMemo(() => {
    const counts = {}
    AI_PYTHON_MASTERHUB_PAGES.forEach(p => { counts[p.category] = (counts[p.category] || 0) + 1 })
    return counts
  }, [])

  useEffect(() => {
    if (!selected) return undefined
    setReaderScale(1)
    window.scrollTo({ top: 0, behavior: 'instant' })
    const onKeyDown = event => {
      if (event.key === 'Escape') navigate('/ai-python-masterhub-pages')
      if (event.key === '+' || event.key === '=') setReaderScale(scale => Math.min(1.6, Number((scale + 0.1).toFixed(2))))
      if (event.key === '-') setReaderScale(scale => Math.max(0.75, Number((scale - 0.1).toFixed(2))))
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [selected, navigate])

  const openGuide = page => navigate(`/ai-python-masterhub-pages/${encodeURIComponent(page.file)}`)
  const closeGuide = () => navigate('/ai-python-masterhub-pages')
  const changeScale = amount => setReaderScale(scale => Math.max(0.75, Math.min(1.6, Number((scale + amount).toFixed(2)))))

  /* ── Full-screen reader ────────────────────────────────────────── */
  if (selected) {
    const theme = getTheme(selected.category)
    return (
      <div className="mph-selected-page">
        <div className="mph-selected-toolbar" style={{ background: theme.gradient, backgroundSize: '200% 200%' }}>
          <button type="button" onClick={closeGuide} className="mph-back-btn">← {t('Back to guide icons')}</button>
          <div className="mph-selected-title">
            <span className="mph-selected-icon">{selected.icon}</span>
            <div>
              <strong>{selected.title}</strong>
              <small>{selected.category}</small>
            </div>
          </div>
          <div className="mph-zoom-controls" aria-label="Page zoom controls">
            <button type="button" onClick={() => changeScale(-0.1)} title="Zoom out">−</button>
            <span>{Math.round(readerScale * 100)}%</span>
            <button type="button" onClick={() => changeScale(0.1)} title="Zoom in">＋</button>
            <button type="button" onClick={() => setReaderScale(1)} title="Reset zoom">{t('Reset')}</button>
            <a href={pageUrl(selected.file)} target="_blank" rel="noreferrer">{t('Open original')} ↗</a>
          </div>
        </div>
        <div className="mph-selected-viewport">
          <AiPythonGuideCompanion page={selected} />
          <div className="mph-selected-scale" style={{ width: `${100 / readerScale}%`, transform: `scale(${readerScale})`, transformOrigin: 'top left' }}>
            <iframe className="mph-selected-frame" title={selected.title} src={pageUrl(selected.file)} />
          </div>
        </div>
      </div>
    )
  }

  /* ── Main catalog view ──────────────────────────────────────────── */
  return (
    <div className="mph-pages">
      <Link to="/" className="back-link">← {t('Back to Home')}</Link>

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="mph-hero">
        <div className="mph-hero-symbols" aria-hidden="true">
          {FLOAT_SYMBOLS.map((sym, i) => (
            <span key={i} className="mph-float-sym" style={{
              left: `${(i * 7.3) % 92}%`,
              animationDelay: `${i * 0.6}s`,
              animationDuration: `${6 + (i % 4) * 1.2}s`,
              fontSize: `${11 + (i % 3) * 4}px`,
            }}>{sym}</span>
          ))}
        </div>

        {/* Gradient orbs */}
        <div className="mph-orb mph-orb-1" aria-hidden="true" />
        <div className="mph-orb mph-orb-2" aria-hidden="true" />
        <div className="mph-orb mph-orb-3" aria-hidden="true" />

        <div className="mph-hero-content">
          <div className="mph-kicker">
            <span className="mph-kicker-dot" /> {t('AI · PYTHON · ENGINEERING MASTERHUB')}
          </div>
          <div className="page-header-row">
            <h1>
              <span className="mph-hero-highlight">Complete</span> {t('HTML Knowledge Pages')}
            </h1>
            <FetchButton label={t('Fetch Latest')} staticMode />
          </div>
          <p>Select any icon or guide below. Every guide opens in its own route with practical theory, project code, real-time scenarios, use cases, advantages, disadvantages, production scope, and the complete original HTML guide.</p>

          {/* Rich stats */}
          <div className="mph-stats">
            <div className="mph-stat-card">
              <span className="mph-stat-num">{AI_PYTHON_MASTERHUB_PAGES.length}</span>
              <span className="mph-stat-label">{t('complete guides')}</span>
            </div>
            <div className="mph-stat-divider" />
            <div className="mph-stat-card">
              <span className="mph-stat-num">{AI_PYTHON_MASTERHUB_CATEGORIES.length - 1}</span>
              <span className="mph-stat-label">{t('learning tracks')}</span>
            </div>
            <div className="mph-stat-divider" />
            <div className="mph-stat-card">
              <span className="mph-stat-num">3×</span>
              <span className="mph-stat-label">{t('real-world scenarios per guide')}</span>
            </div>
            <div className="mph-stat-divider" />
            <div className="mph-stat-card">
              <span className="mph-stat-num">100%</span>
              <span className="mph-stat-label">{t('source content preserved')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Search & filter ───────────────────────────────────────── */}
      <section className="mph-toolbar" aria-label="Filter HTML pages">
        <div className="mph-search-wrap">
          <span className="mph-search-icon">🔍</span>
          <input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search guides, frameworks, concepts…" aria-label="Search guides" />
        </div>
        <div className="mph-categories">
          {AI_PYTHON_MASTERHUB_CATEGORIES.map(item => {
            const isActive = category === item
            const theme = item === 'All' ? null : CATEGORY_THEME[item]
            return (
              <button
                key={item}
                className={`mph-cat-btn ${isActive ? 'active' : ''}`}
                onClick={() => setCategory(item)}
                style={isActive && theme ? { background: theme.gradient, borderColor: theme.accent, color: '#fff' } : isActive ? {} : theme ? { '--cat-accent': theme.accent } : {}}
              >
                {item !== 'All' && theme && <span className="mph-cat-dot" style={{ background: theme.accent }} />}
                {item}
                {item !== 'All' && <span className="mph-cat-count">{categoryCounts[item] || 0}</span>}
              </button>
            )
          })}
        </div>
      </section>

      <div className="mph-result-line">
        Showing <strong>{filtered.length}</strong> of {AI_PYTHON_MASTERHUB_PAGES.length} guides
        {category !== 'All' && <span className="mph-result-tag">in {category}</span>}
      </div>

      {/* ── Guide grid ────────────────────────────────────────────── */}
      <section className="mph-grid">
        {filtered.map((page, idx) => {
          const theme = getTheme(page.category)
          return (
            <article
              className="mph-card"
              key={page.file}
              onClick={() => openGuide(page)}
              tabIndex="0"
              onKeyDown={event => event.key === 'Enter' && openGuide(page)}
              style={{ '--card-gradient': theme.gradient, '--card-accent': theme.accent, '--card-glow': theme.glow, animationDelay: `${idx * 30}ms` }}
            >
              {/* Gradient header strip */}
              <div className="mph-card-header" style={{ background: theme.gradient }}>
                <div className="mph-card-icon-wrap">
                  <span className="mph-card-icon">{page.icon}</span>
                </div>
                <span className="mph-card-category-badge">{page.category}</span>
              </div>

              {/* Body */}
              <div className="mph-card-body">
                <h2>{page.title}</h2>
                <p className="mph-card-file">{page.file}</p>
              </div>

              {/* Actions */}
              <div className="mph-card-actions">
                <button type="button" className="mph-action-primary" onClick={event => { event.stopPropagation(); openGuide(page) }}>
                  Open complete page ↗
                </button>
                <a href={pageUrl(page.file)} target="_blank" rel="noreferrer" className="mph-action-link" onClick={event => event.stopPropagation()}>
                  Original HTML ↗
                </a>
              </div>
            </article>
          )
        })}
      </section>

      {/* ── Bottom credits ────────────────────────────────────────── */}
      <footer className="mph-footer">
        <div className="mph-footer-inner">
          <span>AI Knowledge Hub v2.0 — 25 Chapters · 4 Deep Dives · 50+ Code Examples · 12 Architecture Diagrams</span>
          <span className="mph-footer-tech">React + FastAPI</span>
        </div>
      </footer>
    </div>
  )
}
