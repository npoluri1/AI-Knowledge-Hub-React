import React, { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { LayerStack, FlowDiagram, DiagramLegend } from '../components/DesignDiagram'
import FunctionalFlowPanel from '../components/FunctionalFlowPanel'
import FlowGraph from '../components/FlowGraph'
import ShareButtons from '../components/ShareButtons'
import DeployPanel, { ExpectedOutput } from '../components/DeployPanel'
import { useLang } from '../components/DesignLang'
import { getPattern, PATTERN_THEORY, FLAGSHIP_INDUSTRIES, SECTORS, TECH_FLOWS } from '../data/aiDesignSpace'
import './AiDesignSpace.css'

export default function DesignPatternDetail() {
  const { id } = useParams()
  const { t } = useLang()
  const pattern = getPattern(id)
  const theory = PATTERN_THEORY[id]

  const relatedTechs = useMemo(() => {
    if (!pattern) return []
    return TECH_FLOWS.filter(tf => (tf.patterns || []).includes(pattern.id)).slice(0, 4)
  }, [pattern])

  const relatedPatterns = useMemo(() => {
    if (!pattern) return []
    const shared = new Map()
    TECH_FLOWS.forEach(tf => (tf.patterns || []).forEach(pid => {
      if (pid !== pattern.id && shared.has(pid)) shared.set(pid, shared.get(pid) + 1)
      else if (pid !== pattern.id) shared.set(pid, 1)
    }))
    return [...shared.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3).map(([pid]) => getPattern(pid)).filter(Boolean)
  }, [pattern])

  const usedBy = useMemo(() => {
    if (!pattern) return []
    const byIndustries = FLAGSHIP_INDUSTRIES.filter(f => f.domains.some(d => d.blueprint === pattern.id)).slice(0, 6)
    const bySectors = SECTORS.filter(s => s.patterns.includes(pattern.id))
    return { byIndustries, bySectors }
  }, [pattern])

  if (!pattern || !theory) {
    return (
      <div className="ads-page">
        <Link to="/design-space" className="back-link">← Back to AI Design Space</Link>
        <div className="ads-error">
          <h2>Pattern not found</h2>
          <p>We couldn’t resolve pattern “{id}”.</p>
          <Link to="/design-space" className="ads-btn">Browse design patterns →</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="ads-page">
      <Link to="/design-space" className="back-link">← Back to AI Design Space</Link>

      {/* Hero */}
      <section className="ads-theory-hero" style={{ '--h-grad': `linear-gradient(135deg, ${pattern.color}33, ${pattern.color}11)` }}>
        <div className="ads-theory-hero-icon" style={{ background: `${pattern.color}22`, borderColor: `${pattern.color}66` }}>
          {pattern.icon}
        </div>
        <div className="ads-theory-hero-text">
          <div className="ads-detail-kicker">
            <span>Design Pattern · {pattern.tag}</span>
          </div>
          <h1>{pattern.name}</h1>
          <p className="ads-detail-tagline">The theory, the real-world example, and when to use it — in plain words.</p>
          <div style={{ marginTop: 10 }}><ShareButtons title={pattern.name} /></div>
        </div>
      </section>

      {/* Layman explanation */}
      <section className="ads-theory-block ads-theory-layman" style={{ '--b-accent': pattern.color }}>
        <span className="ads-theory-badge">🗣️ In plain words</span>
        <p>{theory.layman}</p>
      </section>

      {/* Real-world example */}
      <section className="ads-theory-block ads-theory-example" style={{ '--b-accent': pattern.color }}>
        <span className="ads-theory-badge">🌍 Real-world situation</span>
        <p>{theory.example}</p>
        <div className="ads-theory-situation">
          <strong>When you’d reach for this:</strong> {theory.situation}
        </div>
      </section>

      {/* When / benefits / tradeoffs */}
      <div className="ads-theory-columns">
        <section className="ads-theory-col" style={{ '--b-accent': pattern.color }}>
          <h3>✅ When to use it</h3>
          <ul>{theory.whenToUse.map((t, i) => <li key={i}>✔ {t}</li>)}</ul>
        </section>
        <section className="ads-theory-col ads-theory-col-good" style={{ '--b-accent': '#a6e3a1' }}>
          <h3>💪 Why it’s powerful</h3>
          <ul>{theory.benefits.map((t, i) => <li key={i}>▲ {t}</li>)}</ul>
        </section>
        <section className="ads-theory-col ads-theory-col-warn" style={{ '--b-accent': '#f38ba8' }}>
          <h3>⚠️ Watch out for</h3>
          <ul>{theory.tradeoffs.map((t, i) => <li key={i}>✕ {t}</li>)}</ul>
        </section>
      </div>

      {/* Diagrams */}
      <section className="ads-theory-diagrams">
        <div className="ads-diagram-grid">
          <div className="ads-diagram">
            <div className="ads-diagram-head">
              <h3>🏛️ High-Level Design</h3>
              <span>{pattern.hldLabel} · click a layer for code</span>
            </div>
            <LayerStack layers={pattern.hld} accent={pattern.color} pattern={pattern} ctx="your industry context" />
          </div>
          <div className="ads-diagram">
            <div className="ads-diagram-head">
              <h3>🔬 Low-Level Design</h3>
              <span>{pattern.lddLabel} · click a block for code</span>
            </div>
            <FlowDiagram nodes={pattern.ldd} pattern={pattern} ctx="your industry context" />
          </div>
        </div>
        <DiagramLegend />
        <FunctionalFlowPanel ctx="your industry context" pattern={pattern} title="⚡ Functional Flow — the complete workflow" intro="The end-to-end functional flow this pattern walks through: entry → validation → reasoning → action → outcome, with the agent loop and feedback edges." />
        <ExpectedOutput ctx={pattern.name} mode="ask" pattern={pattern} />
        <DeployPanel ctx={pattern.name} name={pattern.name} stack="FastAPI · LangGraph · VectorDB · MCP" />
        <p className="ads-theory-ctx-note">Context example: layers above are shown with “{'{'}ctx{'}'}” placeholders — the same diagram renders with your industry’s context on every industry design page. Click any block to see its implementation code.</p>
      </section>

      {/* Related technologies with diagrams */}
      {relatedTechs.length > 0 && (
        <section className="ads-section">
          <div className="ads-section-head">
            <h2>⚙️ {t('relatedTechnologies')} — with functional-flow diagrams</h2>
            <p>Technologies that power this pattern, each with its draw.io-style workflow diagram.</p>
          </div>
          <div className="ads-tech-related-grid">
            {relatedTechs.map(tf => (
              <Link className="ads-tech-related-card" to={`/design-space/technology/${tf.id}`} key={tf.id} style={{ '--t-color': tf.color }}>
                <div className="ads-tech-related-head">
                  <span className="ads-tech-card-icon">{tf.icon}</span>
                  <div>
                    <span className="ads-tech-card-tag">{tf.tag}</span>
                    <h3>{tf.name}</h3>
                  </div>
                </div>
                <FlowGraph nodes={tf.flow.nodes} edges={tf.flow.edges} height={190} />
                <span className="ads-tech-card-flow">Open functional flow →</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Related patterns */}
      {relatedPatterns.length > 0 && (
        <section className="ads-section">
          <div className="ads-section-head">
            <h2>🧩 {t('relatedPatterns')}</h2>
          </div>
          <div className="ads-patterns-grid">
            {relatedPatterns.map(p => (
              <Link className="ads-pattern-card" to={`/design-space/pattern/${p.id}`} key={p.id} style={{ '--p-color': p.color }}>
                <div className="ads-pattern-icon">{p.icon}</div>
                <div className="ads-pattern-body">
                  <span className="ads-pattern-tag">{p.tag}</span>
                  <h3>{p.name}</h3>
                  <span className="ads-flagship-cta">Read the theory →</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Where it's applied */}
      <section className="ads-section">
        <div className="ads-section-head">
          <h2>🗂️ Where this pattern is applied</h2>
        </div>
        <div className="ads-theory-uses">
          <div>
            <h3>Sectors that default to it</h3>
            <div className="ads-chiprow">
              {usedBy.bySectors.map(s => (
                <Link to={`/design-space?${s.id}`} className="ads-chip" key={s.id}>{s.icon} {s.name}</Link>
              ))}
              {usedBy.bySectors.length === 0 && <span className="ads-empty" style={{ gridColumn: 'auto' }}>No sector defaults</span>}
            </div>
          </div>
          <div>
            <h3>Flagship blueprints using it</h3>
            <div className="ads-name-cloud">
              {usedBy.byIndustries.map(f => (
                <Link className="ads-chip" to={`/design-space/${f.slug}`} key={f.slug}>{f.icon} {f.name}</Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Other patterns */}
      <section className="ads-section">
        <div className="ads-section-head">
          <h2>🧩 Explore other patterns</h2>
        </div>
        <div className="ads-patterns-grid">
          {Object.keys(PATTERN_THEORY).filter(k => k !== pattern.id).slice(0, 6).map(k => {
            const p = getPattern(k)
            const t = PATTERN_THEORY[k]
            return (
              <Link className="ads-pattern-card" to={`/design-space/pattern/${k}`} key={k} style={{ '--p-color': p?.color }}>
                <div className="ads-pattern-icon">{p?.icon}</div>
                <div className="ads-pattern-body">
                  <span className="ads-pattern-tag">{p?.tag}</span>
                  <h3>{p?.name}</h3>
                  <p>{t.layman.slice(0, 80)}…</p>
                  <span className="ads-flagship-cta">Read the theory →</span>
                </div>
              </Link>
            )
          })}
        </div>
      </section>
    </div>
  )
}
