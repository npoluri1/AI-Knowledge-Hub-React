import React, { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import FlowGraph, { FlowGraphLegend } from '../components/FlowGraph'
import ShareButtons from '../components/ShareButtons'
import { useLang } from '../components/DesignLang'
import { getTech, TECH_FLOWS, getPattern, FLAGSHIP_INDUSTRIES } from '../data/aiDesignSpace'
import './AiDesignSpace.css'

export default function TechnologyFlow() {
  const { id } = useParams()
  const { t } = useLang()
  const tech = getTech(id)

  // Technologies that share at least one design pattern with this one.
  const relatedTechs = useMemo(() => {
    if (!tech) return []
    const mine = new Set(tech.patterns || [])
    return TECH_FLOWS
      .filter(tf => tf.id !== tech.id && (tf.patterns || []).some(p => mine.has(p)))
      .slice(0, 4)
  }, [tech])

  if (!tech) {
    return (
      <div className="ads-page">
        <Link to="/design-space" className="back-link">← Back to AI Design Space</Link>
        <div className="ads-error">
          <h2>Technology not found</h2>
          <p>We couldn’t resolve technology “{id}”.</p>
          <Link to="/design-space" className="ads-btn">Browse the tech stack →</Link>
        </div>
      </div>
    )
  }

  const patternRefs = (tech.patterns || []).map(getPattern).filter(Boolean)
  const usedIn = FLAGSHIP_INDUSTRIES.filter(f => f.domains.some(d => d.tech.includes(tech.name))).slice(0, 5)

  return (
    <div className="ads-page">
      <Link to="/design-space" className="back-link">← Back to AI Design Space</Link>

      <section className="ads-theory-hero" style={{ '--h-grad': `linear-gradient(135deg, ${tech.color}33, ${tech.color}11)` }}>
        <div className="ads-theory-hero-icon" style={{ background: `${tech.color}22`, borderColor: `${tech.color}66` }}>
          {tech.icon}
        </div>
        <div className="ads-theory-hero-text">
          <div className="ads-detail-kicker"><span>Technology · {tech.tag}</span></div>
          <h1>{tech.name}</h1>
          <p className="ads-detail-tagline">{tech.layman}</p>
          <div style={{ marginTop: 10 }}><ShareButtons title={tech.name} /></div>
        </div>
      </section>

      <section className="ads-theory-block" style={{ '--b-accent': tech.color }}>
        <span className="ads-theory-badge">🎯 What it does in the stack</span>
        <p>{tech.role}</p>
      </section>

      <section className="ads-section">
        <div className="ads-section-head">
          <h2>🎨 Functional Flow — draw.io style</h2>
          <p>Complete workflow diagram for {tech.name}: every node and edge, colour-coded by role.</p>
        </div>
        <div className="ads-diagram" style={{ background: '#0d0d15' }}>
          <FlowGraph nodes={tech.flow.nodes} edges={tech.flow.edges} />
        </div>
        <FlowGraphLegend />
      </section>

      <section className="ads-section">
        <div className="ads-section-head">
          <h2>🔢 Functional Flow — step by step</h2>
        </div>
        <div className="ads-flow">
          {tech.steps.map((s, i) => (
            <React.Fragment key={i}>
              {i > 0 && <div className="ads-arrow"><span>▼</span></div>}
              <div className="ads-node" style={{ '--node-accent': tech.color, '--node-bg': `${tech.color}14` }}>
                <div className="ads-node-head">
                  <span className="ads-node-num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="ads-node-kind">{tech.tag}</span>
                </div>
                <h6>{s}</h6>
              </div>
            </React.Fragment>
          ))}
        </div>
      </section>

      <section className="ads-section">
        <div className="ads-section-head">
          <h2>🧩 Design patterns it powers</h2>
        </div>
        <div className="ads-patterns-grid">
          {patternRefs.map(p => (
            <Link className="ads-pattern-card" to={`/design-space/pattern/${p.id}`} key={p.id} style={{ '--p-color': p.color }}>
              <div className="ads-pattern-icon">{p.icon}</div>
              <div className="ads-pattern-body">
                <span className="ads-pattern-tag">{p.tag}</span>
                <h3>{p.name}</h3>
                <span className="ads-flagship-cta">Read the theory →</span>
              </div>
            </Link>
          ))}
          {patternRefs.length === 0 && <div className="ads-empty">No pattern cards — this technology powers the stack directly.</div>}
        </div>
      </section>

      {usedIn.length > 0 && (
        <section className="ads-section">
          <div className="ads-section-head">
            <h2>🏗️ Flagship designs using {tech.name}</h2>
          </div>
          <div className="ads-name-cloud">
            {usedIn.map(f => (
              <Link className="ads-chip" to={`/design-space/${f.slug}`} key={f.slug}>{f.icon} {f.name}</Link>
            ))}
          </div>
        </section>
      )}

      {relatedTechs.length > 0 && (
        <section className="ads-section">
          <div className="ads-section-head">
            <h2>⚙️ {t('relatedTechnologies')} — with functional-flow diagrams</h2>
            <p>Technologies that share this pattern, each with its draw.io-style workflow diagram.</p>
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

      <section className="ads-section">
        <div className="ads-section-head">
          <h2>⚙️ All technologies</h2>
        </div>
        <div className="ads-name-cloud">
          {TECH_FLOWS.filter(t => t.id !== tech.id).map(t => (
            <Link className="ads-chip" to={`/design-space/technology/${t.id}`} key={t.id} style={{ '--chip-c': t.color }}>{t.icon} {t.name}</Link>
          ))}
        </div>
      </section>
    </div>
  )
}
