import React, { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LayerStack, FlowDiagram, DiagramLegend } from '../components/DesignDiagram'
import FunctionalFlowPanel from '../components/FunctionalFlowPanel'
import GlobalSearch from '../components/GlobalSearch'
import { LanguageSwitcher, useLang } from '../components/DesignLang'
import FetchButton from '../components/FetchButton'
import {
  SECTORS,
  DESIGN_PATTERNS,
  FLAGSHIP_INDUSTRIES,
  ALL_INDUSTRIES,
  ALL_INDUSTRIES_BY_SECTOR,
  ALL_INDUSTRIES_COUNT,
  COUNTRIES_COUNT,
  PATTERN_THEORY,
  TECH_FLOWS,
  getPattern,
  slugify,
  sectorDesignCount,
} from '../data/aiDesignSpace'
import './AiDesignSpace.css'

export default function AiDesignSpace() {
  const navigate = useNavigate()
  const { t } = useLang()
  const [query, setQuery] = useState('')
  const [sectorFilter, setSectorFilter] = useState('All')
  const [expandedSector, setExpandedSector] = useState('All')
  const [openPattern, setOpenPattern] = useState(null)
  const [openSector, setOpenSector] = useState(null)

  const q = query.trim().toLowerCase()

  const filteredFlagships = useMemo(() => FLAGSHIP_INDUSTRIES.filter(f => {
    const okSector = sectorFilter === 'All' || f.sector === sectorFilter
    const hay = `${f.name} ${f.sectorName || ''} ${f.tagline}`.toLowerCase()
    return okSector && (!q || hay.includes(q))
  }), [q, sectorFilter])

  const filteredAll = useMemo(() => {
    const list = q ? ALL_INDUSTRIES.filter(i => i.name.toLowerCase().includes(q)) : ALL_INDUSTRIES
    return list
  }, [q])

  const openIndustry = name => navigate(`/design-space/${slugify(name)}`)
  const togglePattern = id => setOpenPattern(openPattern === id ? null : id)
  const toggleSector = id => setOpenSector(openSector === id ? null : id)
  const openSectorPage = id => navigate(`/design-space/sector/${id}`)

  const allMatching = ALL_INDUSTRIES_BY_SECTOR

  return (
    <div className="ads-page">
      <Link to="/" className="back-link">← Back to Home</Link>

      {/* ============ HERO ============ */}
      <section className="ads-hero">
        <div className="ads-hero-deco" aria-hidden="true">
          {['🏦', '🏥', '🛒', '🏭', '📡', '⚡', '🚚', '🎓', '🏛️', '✈️', '🚗', '⚖️', '🎮', '🌾'].map((e, i) => (
            <span key={i} style={{ left: `${(i * 7.2) % 92 + 2}%`, top: `${(i * 37) % 80 + 8}%`, animationDelay: `${i * 0.4}s` }}>{e}</span>
          ))}
        </div>
        <div className="ads-hero-top">
          <div className="ads-kicker">🏗️ {t('kicker')}</div>
          <LanguageSwitcher />
        </div>
        <div className="page-header-row">
          <h1>{t('designSpace')}</h1>
          <FetchButton label="Fetch Latest" staticMode />
        </div>
        <p>
          {t('heroLine')} <strong>Select any icon below</strong> — pattern, sector, industry or flagship — to see its design
          theory and <strong>High-Level + Low-Level design diagrams</strong>.
        </p>
        <div className="ads-hero-search">
          <GlobalSearch size="lg" />
        </div>
        <div className="ads-stats">
          <div className="ads-stat"><strong>{ALL_INDUSTRIES_COUNT}+</strong><span>industries designed</span></div>
          <div className="ads-stat"><strong>{COUNTRIES_COUNT}</strong><span>countries covered</span></div>
          <div className="ads-stat"><strong>{SECTORS.length}</strong><span>industry sectors</span></div>
          <div className="ads-stat"><strong>{DESIGN_PATTERNS.length}</strong><span>core design patterns</span></div>
          <div className="ads-stat"><strong>{FLAGSHIP_INDUSTRIES.length}</strong><span>full custom blueprints</span></div>
          <div className="ads-stat"><strong>1000+</strong><span>project ideas / industry</span></div>
        </div>
        <div className="ads-hero-actions">
          <Link to="/design-space/global" className="ads-hero-btn ads-hero-btn-primary">🌍 {t('exploreCountries', { n: COUNTRIES_COUNT })}</Link>
          <a href="#ads-patterns" className="ads-hero-btn">🧩 {t('designTheory')}</a>
          <a href="#ads-flagships" className="ads-hero-btn">🚀 {t('flagshipBlueprints')}</a>
        </div>
        <div className="ads-global-note">{t('forEveryone', { n: 8 })}</div>
      </section>

      {/* Global banner */}
      <Link to="/design-space/global" className="ads-global-banner" style={{ '--g-grad': 'linear-gradient(135deg,#0f172a 0%,#1e40af 55%,#0ea5e9 100%)' }}>
        <span className="ads-global-banner-icon">🌍</span>
        <div className="ads-global-banner-text">
          <strong>Global Design Space — all {COUNTRIES_COUNT} countries</strong>
          <span>Every country’s public &amp; private-sector industries, mapped to their designs · Government · Private · 12 regions</span>
        </div>
        <span className="ads-global-banner-cta">Explore →</span>
      </Link>

      {/* ============ CORE DESIGN PATTERNS ============ */}
      <section className="ads-section">
        <div className="ads-section-head" id="ads-patterns">
          <h2>🧩 {t('corePatterns')}</h2>
          <p>{t('patternsIntro')}</p>
        </div>
        <div className="ads-patterns-grid">
          {DESIGN_PATTERNS.map(p => {
            const open = openPattern === p.id
            const theory = PATTERN_THEORY[p.id]
            return (
              <article className={`ads-pattern-card clickable ${open ? 'expanded' : ''}`} key={p.id} style={{ '--p-color': p.color }} onClick={() => togglePattern(p.id)} tabIndex={0} onKeyDown={e => { if (e.key === 'Enter') togglePattern(p.id) }}>
                <div className="ads-pattern-icon">{p.icon}</div>
                <div className="ads-pattern-body">
                  <span className="ads-pattern-tag">{p.tag}</span>
                  <h3>{p.name}</h3>
                  <p>{p.hld[2]?.desc ? p.hld[2].desc.slice(0, 90) + '…' : ''}</p>
                  <div className="ads-pattern-meta">
                    <span>{p.hld.length} layers</span>
                    <span>{p.ldd.length} components</span>
                    <span className="ads-pattern-theory">{open ? '− Close' : '📖 Theory →'}</span>
                  </div>
                </div>
                {open && (
                  <div className="ads-pattern-panel" onClick={e => e.stopPropagation()}>
                    {theory && <p className="ads-pattern-layman">🗣️ <strong>In plain words:</strong> {theory.layman}</p>}
                    <div className="ads-diagram-grid">
                      <div className="ads-diagram">
                        <div className="ads-diagram-head">
                          <h3>🏛️ High-Level Design</h3>
                          <span>{p.hld.length} layers · click a layer for code</span>
                        </div>
                        <LayerStack layers={p.hld} accent={p.color} pattern={p} ctx="your industry context" />
                      </div>
                      <div className="ads-diagram">
                        <div className="ads-diagram-head">
                          <h3>🔬 Low-Level Design</h3>
                          <span>{p.ldd.length} components · click a block for code</span>
                        </div>
                        <FlowDiagram nodes={p.ldd} pattern={p} ctx="your industry context" />
                      </div>
                    </div>
                    <DiagramLegend />
                    <FunctionalFlowPanel ctx="your industry context" pattern={p} title="⚡ Functional Flow" intro="The complete workflow this pattern executes, from entry to outcome — with the agent loop and feedback edges." />
                    <div className="ads-pattern-panel-actions">
                      <Link to={`/design-space/pattern/${p.id}`} className="ads-hero-btn">📖 Read the full theory →</Link>
                      <a href="#ads-flagships" className="ads-hero-btn">See it applied →</a>
                    </div>
                  </div>
                )}
              </article>
            )
          })}
        </div>
      </section>

      {/* ============ TECHNOLOGY FUNCTIONAL FLOWS ============ */}
      <section className="ads-section">
        <div className="ads-section-head">
          <h2>⚙️ {t('techFlows')}</h2>
          <p>{t('techFlowsIntro')}</p>
        </div>
        <div className="ads-tech-grid">
          {TECH_FLOWS.map(t => (
            <Link className="ads-tech-card" to={`/design-space/technology/${t.id}`} key={t.id} style={{ '--t-color': t.color }}>
              <span className="ads-tech-card-icon">{t.icon}</span>
              <div className="ads-tech-card-body">
                <span className="ads-tech-card-tag">{t.tag}</span>
                <h3>{t.name}</h3>
                <p>{t.layman.slice(0, 82)}…</p>
              </div>
              <span className="ads-tech-card-flow">🎨 Flow →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ============ SECTORS ============ */}
      <section className="ads-section">
        <div className="ads-section-head">
          <h2>🏭 {t('industrySectors')}</h2>
          <p>{t('sectorsIntro')}</p>
        </div>
        <div className="ads-sectors-grid">
          {SECTORS.map(s => {
            const open = openSector === s.id
            const defaultPatterns = s.patterns.map(getPattern).filter(Boolean)
            const flagshipPreview = FLAGSHIP_INDUSTRIES.filter(f => f.sector === s.id).slice(0, 3)
            return (
              <div className={`ads-sector-wrap ${open ? 'expanded' : ''}`} key={s.id} style={{ '--s-grad': s.gradient }}>
                <button
                  type="button"
                  className={`ads-sector-card ${sectorFilter === s.id ? 'active' : ''}`}
                  style={{ background: s.gradient }}
                  onClick={() => openSectorPage(s.id)}
                  title="Open the sector page with its full design system"
                >
                  <span className="ads-sector-icon">{s.icon}</span>
                  <span className="ads-sector-name">{s.name}</span>
                  <span className="ads-sector-count">{sectorDesignCount(s.id)} industries · Open page →</span>
                </button>
                {open && (
                  <div className="ads-sector-panel">
                    <p className="ads-sector-blurb">{s.blurb}</p>
                    <div className="ads-sector-panel-row">
                      <div className="ads-sector-patterns">
                        <span className="ads-domain-label">Default design patterns</span>
                        <div className="ads-chiprow">
                          {defaultPatterns.map(p => (
                            <Link key={p.id} to={`/design-space/pattern/${p.id}`} className="ads-chip" title={`Open theory: ${p.name}`}>{p.icon} {p.tag}</Link>
                          ))}
                        </div>
                        {defaultPatterns[0] && (
                          <div className="ads-sector-minidiagram">
                            <span className="ads-domain-label">First pattern · {defaultPatterns[0].name} — click a layer for code</span>
                            <LayerStack layers={defaultPatterns[0].hld.slice(0, 3)} accent={defaultPatterns[0].color} pattern={defaultPatterns[0]} ctx={`${s.name} operations`} />
                          </div>
                        )}
                      </div>
                      <div className="ads-sector-flagships">
                        <span className="ads-domain-label">Flagship blueprints</span>
                        <div className="ads-sector-flagship-list">
                          {flagshipPreview.map(f => (
                            <Link to={`/design-space/${f.slug}`} key={f.slug} className="ads-sector-flagship">
                              <span>{f.icon}</span><span>{f.name}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="ads-sector-panel-actions">
                      <Link to={`/design-space/sector/${s.id}`} className="ads-hero-btn">🏗️ Open full sector page →</Link>
                      <button type="button" className="ads-hero-btn" onClick={() => { setSectorFilter(prev => prev === s.id ? 'All' : s.id); document.getElementById('ads-flagships')?.scrollIntoView({ behavior: 'smooth' }) }}>
                        {sectorFilter === s.id ? '✕ Clear blueprint filter' : `🔽 Show ${s.name} blueprints`}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* ============ SEARCH + FLAGSHIPS ============ */}
      <section className="ads-section">
        <div className="ads-section-head" id="ads-flagships">
          <h2>🚀 {t('flagshipBlueprints')}</h2>
          <p>Hand-crafted, fully-detailed industry designs — open any one to explore its functional domains, HLD &amp; LDD diagrams.</p>
        </div>
        <div className="ads-toolbar">
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search 1,000+ industries… e.g. banking, hospital, airline, game"
            aria-label="Search industries"
          />
          {query && <button type="button" className="ads-clear" onClick={() => setQuery('')}>✕ Clear</button>}
        </div>
        <div className="ads-sector-filter-strip">
          <button type="button" className={`ads-region-chip all ${sectorFilter === 'All' ? 'active' : ''}`} onClick={() => setSectorFilter('All')}>🌐 All</button>
          {SECTORS.map(s => (
            <button type="button" key={s.id} className={`ads-region-chip ${sectorFilter === s.id ? 'active' : ''}`} style={{ '--r-grad': s.gradient }} onClick={() => setSectorFilter(s.id)}>
              {s.icon} {s.name.split(' ')[0]}
            </button>
          ))}
        </div>
        <div className="ads-result-line">
          Showing <strong>{filteredFlagships.length}</strong> flagship blueprints
          {sectorFilter !== 'All' && <> in <strong>{sectorFilter}</strong></>}
          {q && <> matching <strong>“{query}”</strong></>}
        </div>
        <div className="ads-flagship-grid">
          {filteredFlagships.map(f => (
            <Link className="ads-flagship-card" to={`/design-space/${f.slug}`} key={f.slug} style={{ '--f-grad': f.gradient }}>
              <div className="ads-flagship-top" style={{ background: f.gradient }}>
                <span className="ads-flagship-icon">{f.icon}</span>
                <span className="ads-flagship-badge">{f.sectorName}</span>
              </div>
              <div className="ads-flagship-body">
                <h3>{f.name}</h3>
                <p>{f.tagline}</p>
                <div className="ads-flagship-domains">
                  {f.domains.map((d, i) => <span key={i}>{d.icon} {d.name}</span>)}
                </div>
                <span className="ads-flagship-cta">Open design →</span>
              </div>
            </Link>
          ))}
          {filteredFlagships.length === 0 && <div className="ads-empty">No flagship matches — try the full index below.</div>}
        </div>
      </section>

      {/* ============ ALL 1000+ INDUSTRIES ============ */}
      <section className="ads-section">
        <div className="ads-section-head">
          <h2>🌐 {t('browseAll', { n: ALL_INDUSTRIES_COUNT })}</h2>
          <p>{t('browseAllIntro')}</p>
        </div>

        {q && (
          <div className="ads-search-results">
            <div className="ads-result-line">Found <strong>{filteredAll.length}</strong> industries</div>
            <div className="ads-name-cloud">
              {filteredAll.map(i => (
                <button type="button" key={i.name} onClick={() => openIndustry(i.name)}>
                  {i.name} <small>{i.sector}</small>
                </button>
              ))}
            </div>
          </div>
        )}

        {!q && (
          <div className="ads-sector-browser">
            {SECTORS.map(s => {
              const names = allMatching[s.id] || []
              const open = expandedSector === s.id || expandedSector === 'All'
              return (
                <details className="ads-sector-group" key={s.id} open={open}>
                  <summary onClick={e => { e.preventDefault(); setExpandedSector(open ? s.id : 'All') }}>
                    <span className="ads-sector-group-icon">{s.icon}</span>
                    <strong>{s.name}</strong>
                    <span className="ads-sector-group-count">{names.length} industries</span>
                    <span className="ads-sector-toggle">{open ? '−' : '+'}</span>
                  </summary>
                  <div className="ads-name-cloud">
                    {names.map(name => (
                      <button type="button" key={name} onClick={() => openIndustry(name)}>
                        {name}
                      </button>
                    ))}
                  </div>
                </details>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
