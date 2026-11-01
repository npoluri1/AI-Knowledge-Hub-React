import React, { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { LayerStack, FlowDiagram, DiagramLegend } from '../components/DesignDiagram'
import FunctionalFlowPanel from '../components/FunctionalFlowPanel'
import ShareButtons from '../components/ShareButtons'
import DeployPanel, { ExpectedOutput } from '../components/DeployPanel'
import { useLang } from '../components/DesignLang'
import {
  getSector, getPattern, PATTERN_THEORY, applyCtx, FLAGSHIP_INDUSTRIES,
  ALL_INDUSTRIES_BY_SECTOR, SECTORS, sectorDesignCount, slugify, sampleIdeas,
} from '../data/aiDesignSpace'
import './AiDesignSpace.css'

export default function SectorDesignSpace() {
  const { id } = useParams()
  const { t } = useLang()
  const sector = getSector(id)
  const [query, setQuery] = useState('')

  const relatedSectors = useMemo(() => {
    if (!sector) return []
    const shared = new Map()
    sector.patterns.forEach(pid => {
      SECTORS.forEach(s => {
        if (s.id !== sector.id && s.patterns.includes(pid)) shared.set(s.id, (shared.get(s.id) || 0) + 1)
      })
    })
    return [...shared.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4).map(([sid]) => getSector(sid)).filter(Boolean)
  }, [sector])

  const industries = sector ? ALL_INDUSTRIES_BY_SECTOR[sector.id] || [] : []
  const flagships = sector ? FLAGSHIP_INDUSTRIES.filter(f => f.sector === sector.id) : []
  const topFlagship = flagships[0]

  const filteredIndustries = useMemo(() => {
    const q = query.trim().toLowerCase()
    return q ? industries.filter(n => n.toLowerCase().includes(q)) : industries
  }, [industries, query])

  if (!sector) {
    return (
      <div className="ads-page">
        <Link to="/design-space" className="back-link">← Back to AI Design Space</Link>
        <div className="ads-error">
          <h2>Sector not found</h2>
          <p>We couldn’t resolve sector “{id}”.</p>
          <Link to="/design-space" className="ads-btn">Browse all sectors →</Link>
        </div>
      </div>
    )
  }

  const samples = topFlagship ? sampleIdeas(topFlagship, 3) : []

  return (
    <div className="ads-page">
      <Link to="/design-space" className="back-link">← Back to AI Design Space</Link>

      {/* Hero */}
      <section className="ads-sector-page-hero" style={{ '--s-grad': sector.gradient }}>
        <div className="ads-sector-page-icon">{sector.icon}</div>
        <div className="ads-sector-page-text">
          <div className="ads-detail-kicker">
            <span>Industry Sector</span>
            <span className="ads-badge-flag">DESIGN SYSTEM</span>
          </div>
          <h1>{sector.name}</h1>
          <p className="ads-detail-tagline">{sector.blurb}</p>
          <div className="ads-detail-stats">
            <span><strong>{industries.length}</strong> industries</span>
            <span><strong>{flagships.length}</strong> flagship blueprints</span>
            <span><strong>{sector.patterns.length}</strong> default patterns</span>
            <span><strong>HLD+LDD</strong> per pattern</span>
          </div>
          <div style={{ marginTop: 12 }}><ShareButtons title={`${sector.name} — AI Design Space`} /></div>
        </div>
      </section>

      {/* Default design patterns with diagrams */}
      <section className="ads-section">
        <div className="ads-section-head">
          <h2>🧩 Default Design System for {sector.name}</h2>
          <p>Every industry in this sector is built from these canonical patterns — each shown with its High-Level Design layers and Low-Level Design component flow.</p>
        </div>
        {sector.patterns.map((patternId, i) => {
          const pattern = getPattern(patternId)
          const theory = PATTERN_THEORY[patternId]
          return (
            <section className="ads-domain" key={patternId} style={{ '--d-accent': pattern?.color }}>
              <div className="ads-domain-head">
                <span className="ads-domain-icon">{pattern?.icon}</span>
                <div className="ads-domain-title">
                  <span className="ads-domain-num">Pattern {String(i + 1).padStart(2, '0')}</span>
                  <h2>{pattern?.name}</h2>
                  <span className="ads-domain-pattern">{pattern?.tag}</span>
                </div>
              </div>
              {theory && <p className="ads-domain-desc">{theory.layman}</p>}
              <div className="ads-diagram-grid">
                <div className="ads-diagram">
                  <div className="ads-diagram-head">
                    <h3>🏛️ High-Level Design</h3>
                    <span>{pattern?.hldLabel} · click a layer for code</span>
                  </div>
                  <LayerStack layers={pattern?.hld || []} accent={pattern?.color} pattern={pattern} ctx={`${sector.name} operations`} />
                </div>
                <div className="ads-diagram">
                  <div className="ads-diagram-head">
                    <h3>🔬 Low-Level Design</h3>
                    <span>{pattern?.lddLabel} · click a block for code</span>
                  </div>
                  <FlowDiagram nodes={pattern?.ldd || []} pattern={pattern} ctx={`${sector.name} operations`} />
                </div>
              </div>
              <DiagramLegend />
              <FunctionalFlowPanel ctx={`${sector.name} operations`} pattern={pattern} />
              <ExpectedOutput ctx={`${sector.name} operations`} mode="ask" pattern={pattern} />
              <DeployPanel ctx={`${sector.name} operations`} name={pattern?.name} stack="FastAPI · LangGraph · VectorDB · MCP" />
              <div className="ads-sector-page-actions">
                <Link to={`/design-space/pattern/${patternId}`} className="ads-hero-btn">📖 Read the full theory →</Link>
                {topFlagship && <Link to={`/design-space/${topFlagship.slug}`} className="ads-hero-btn">🏗️ See it applied in {topFlagship.name}</Link>}
              </div>
            </section>
          )
        })}
      </section>

      {/* Flagship blueprints */}
      {flagships.length > 0 && (
        <section className="ads-section">
          <div className="ads-section-head">
            <h2>🚀 Flagship Blueprints</h2>
            <p>Hand-crafted, fully-detailed designs in this sector.</p>
          </div>
          <div className="ads-flagship-grid">
            {flagships.map(f => (
              <Link className="ads-flagship-card" to={`/design-space/${f.slug}`} key={f.slug} style={{ '--f-grad': f.gradient }}>
                <div className="ads-flagship-top" style={{ background: f.gradient }}>
                  <span className="ads-flagship-icon">{f.icon}</span>
                  <span className="ads-flagship-badge">{f.sectorName}</span>
                </div>
                <div className="ads-flagship-body">
                  <h3>{f.name}</h3>
                  <p>{f.tagline}</p>
                  <div className="ads-flagship-domains">
                    {f.domains.map((d, j) => <span key={j}>{d.icon} {d.name}</span>)}
                  </div>
                  <span className="ads-flagship-cta">Open design →</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* All industries */}
      <section className="ads-section">
        <div className="ads-section-head">
          <h2>🌐 All {industries.length} Industries in {sector.name}</h2>
          <p>Every industry opens into its design — functional domains with HLD &amp; LDD diagrams.</p>
        </div>
        <div className="ads-toolbar">
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder={`Search ${industries.length} industries in ${sector.name}…`} aria-label="Search sector industries" />
          {query && <button type="button" className="ads-clear" onClick={() => setQuery('')}>✕ Clear</button>}
        </div>
        <div className="ads-result-line">Showing <strong>{filteredIndustries.length}</strong> of {industries.length} industries</div>
        <div className="ads-name-cloud">
          {filteredIndustries.map(name => (
            <button type="button" key={name} onClick={() => { window.location.href = `/design-space/${slugify(name)}` }}>
              {name}
            </button>
          ))}
        </div>
      </section>

      {/* Sample projects */}
      {samples.length > 0 && topFlagship && (
        <section className="ads-section">
          <div className="ads-section-head">
            <h2>💡 Sample project ideas — {topFlagship.name}</h2>
            <p>Each industry in this sector has 1,000+ generated project ideas with full structure &amp; code.</p>
          </div>
          <div className="ads-flagship-grid">
            {samples.map(s => (
              <div className="ads-flagship-card" key={s.id} style={{ '--f-grad': topFlagship.gradient }}>
                <div className="ads-flagship-top" style={{ background: topFlagship.gradient }}>
                  <span className="ads-flagship-icon">{s.patternIcon}</span>
                  <span className="ads-flagship-badge">{s.patternTag}</span>
                </div>
                <div className="ads-flagship-body">
                  <h3>{s.title}</h3>
                  <p>{s.desc.slice(0, 120)}…</p>
                  <Link className="ads-flagship-cta" to={`/design-space/${topFlagship.slug}`}>Build it →</Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Related sectors */}
      {relatedSectors.length > 0 && (
        <section className="ads-section">
          <div className="ads-section-head">
            <h2>🔗 {t('relatedSectors')}</h2>
            <p>Sectors that share this design system — open any one for its own pattern diagrams.</p>
          </div>
          <div className="ads-sectors-grid">
            {relatedSectors.map(s => (
              <Link className="ads-sector-card" to={`/design-space/sector/${s.id}`} key={s.id} style={{ background: s.gradient }}>
                <span className="ads-sector-icon">{s.icon}</span>
                <span className="ads-sector-name">{s.name}</span>
                <span className="ads-sector-count">{(ALL_INDUSTRIES_BY_SECTOR[s.id] || []).length} industries · {s.patterns.length} patterns · open →</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
