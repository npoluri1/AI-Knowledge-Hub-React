import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import ShareButtons from '../components/ShareButtons'
import { useLang } from '../components/DesignLang'
import { COUNTRIES, COUNTRIES_COUNT, REGIONS, getRegionGradient, slugify } from '../data/aiDesignSpace'
import './AiDesignSpace.css'

export default function GlobalDesignSpace() {
  const { t } = useLang()
  const [region, setRegion] = useState('All')
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return COUNTRIES.filter(c =>
      (region === 'All' || c.region === region) &&
      (!q || `${c.name} ${c.industries}`.toLowerCase().includes(q))
    )
  }, [region, query])

  const regionCounts = useMemo(() => {
    const counts = {}
    COUNTRIES.forEach(c => { counts[c.region] = (counts[c.region] || 0) + 1 })
    return counts
  }, [])

  return (
    <div className="ads-page">
      <Link to="/design-space" className="back-link">← Back to AI Design Space</Link>

      <section className="ads-hero ads-global-hero">
        <div className="ads-hero-deco" aria-hidden="true">
          {['🌍', '🏛️', '🏦', '🏭', '🌾', '⚡', '🏥', '🎓', '🛰️', '🔐', '⛓️'].map((e, i) => (
            <span key={i} style={{ left: `${(i * 9.1) % 90 + 3}%`, top: `${(i * 41) % 78 + 10}%`, animationDelay: `${i * 0.35}s` }}>{e}</span>
          ))}
        </div>
        <div className="ads-kicker">🌍 GLOBAL AI DESIGN SPACE · 196 COUNTRIES</div>
        <h1>Design Space for the World</h1>
        <p>
          Every country in the world has its own industries, and every industry needs its own AI architecture.
          Browse <strong>{COUNTRIES_COUNT} countries</strong> across {REGIONS.length} regions — each mapped to its key
          <strong> public-sector</strong> (government, energy, health, defense) and <strong>private-sector</strong>
          industries, all built from the same 12 core design patterns.
        </p>
        <div className="ads-stats">
          <div className="ads-stat"><strong>{COUNTRIES_COUNT}</strong><span>countries designed</span></div>
          <div className="ads-stat"><strong>{REGIONS.length}</strong><span>regions</span></div>
          <div className="ads-stat"><strong>2</strong><span>public & private sectors</span></div>
          <div className="ads-stat"><strong>12</strong><span>core patterns</span></div>
        </div>
        <div style={{ marginTop: 14 }}><ShareButtons title="Global AI Design Space" /></div>
      </section>

      <section className="ads-section">
        <div className="ads-section-head">
          <h2>🌐 Regions</h2>
          <p>Filter countries by region, or search for any country or industry below.</p>
        </div>
        <div className="ads-region-strip">
          <button type="button" className={`ads-region-chip all ${region === 'All' ? 'active' : ''}`} onClick={() => setRegion('All')}>
            🌍 All {COUNTRIES_COUNT}
          </button>
          {REGIONS.map(r => (
            <button type="button" key={r} className={`ads-region-chip ${region === r ? 'active' : ''}`} style={{ '--r-grad': getRegionGradient(r) }} onClick={() => setRegion(r)}>
              {r} <small>{regionCounts[r]}</small>
            </button>
          ))}
        </div>
        <div className="ads-toolbar" style={{ marginTop: 12 }}>
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search a country or industry… e.g. Rwanda, Fintech, Mining" aria-label="Search countries" />
          {query && <button type="button" className="ads-clear" onClick={() => setQuery('')}>✕ Clear</button>}
        </div>
        <div className="ads-result-line">Showing <strong>{filtered.length}</strong> of {COUNTRIES_COUNT} countries</div>
      </section>

      <section className="ads-country-grid">
        {filtered.map(c => (
          <Link className="ads-country-card" to={`/design-space/country/${slugify(c.name)}`} key={c.name} style={{ '--c-grad': getRegionGradient(c.region) }}>
            <div className="ads-country-top" style={{ background: getRegionGradient(c.region) }}>
              <span className="ads-country-avatar">🌍</span>
              <span className="ads-country-region">{c.region}</span>
            </div>
            <div className="ads-country-body">
              <h3>{c.name}</h3>
              <p>{c.industries.split(',').slice(0, 4).map(i => i.trim()).join(' · ')}…</p>
              <span className="ads-flagship-cta">Open country design →</span>
            </div>
          </Link>
        ))}
        {filtered.length === 0 && <div className="ads-empty">No country matches “{query}” — try another search.</div>}
      </section>
    </div>
  )
}
