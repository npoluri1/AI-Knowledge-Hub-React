import React, { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import ShareButtons from '../components/ShareButtons'
import { useLang } from '../components/DesignLang'
import {
  getCountry, getRegionGradient, isPublicIndustry, resolveIndustry, slugify, COUNTRIES, COUNTRIES_COUNT,
  countProjectIdeas, sampleIdeas,
} from '../data/aiDesignSpace'
import './AiDesignSpace.css'

export default function CountryDesignSpace() {
  const { slug } = useParams()
  const { t } = useLang()
  const country = getCountry(slug)

  const industries = useMemo(() => {
    if (!country) return { public: [], private: [] }
    const all = country.industries.split(',').map(s => s.trim()).filter(Boolean)
    const publicList = all.filter(isPublicIndustry)
    const privateList = all.filter(n => !isPublicIndustry(n))
    return { public: publicList, private: privateList }
  }, [country])

  const resolved = useMemo(() => {
    const map = {}
    ;[...industries.public, ...industries.private].forEach(n => {
      const ind = resolveIndustry(n)
      if (ind) map[n] = ind
    })
    return map
  }, [industries])

  if (!country) {
    return (
      <div className="ads-page">
        <Link to="/design-space/global" className="back-link">← Back to Global Design Space</Link>
        <div className="ads-error">
          <h2>Country not found</h2>
          <p>We couldn’t resolve “{slug}” in our {COUNTRIES_COUNT}‑country index.</p>
          <Link to="/design-space/global" className="ads-btn">Browse all countries →</Link>
        </div>
      </div>
    )
  }

  const allIndustries = [...industries.public, ...industries.private]
  const sectorsUsed = [...new Set(allIndustries.map(n => resolved[n]?.sectorName).filter(Boolean))]
  const topIndustry = resolved[allIndustries[0]]
  const samples = topIndustry ? sampleIdeas(topIndustry, 3) : []

  const renderIndustry = name => {
    const ind = resolved[name]
    if (!ind) return <span className="ads-country-industry muted">{name}</span>
    return (
      <Link className="ads-country-industry" to={`/design-space/${ind.slug}`}>
        <span className="ads-country-ind-icon">{ind.icon}</span>
        <span className="ads-country-ind-name">{name}</span>
        <span className="ads-country-ind-sector">{ind.sectorName}</span>
        <span className="ads-country-ind-cta">Open design →</span>
      </Link>
    )
  }

  return (
    <div className="ads-page">
      <Link to="/design-space/global" className="back-link">← Back to Global Design Space</Link>

      <section className="ads-country-hero" style={{ '--c-grad': getRegionGradient(country.region) }}>
        <div className="ads-country-hero-icon">🌍</div>
        <div className="ads-country-hero-text">
          <div className="ads-detail-kicker">
            <span>{country.region}</span>
            <span className="ads-badge-flag">GLOBAL DESIGN SPACE</span>
          </div>
          <h1>{country.name}</h1>
          <p className="ads-detail-tagline">AI architecture blueprint for every key industry in {country.name}</p>
          <div className="ads-detail-stats">
            <span><strong>{allIndustries.length}</strong> key industries</span>
            <span><strong>{sectorsUsed.length}</strong> sectors</span>
            <span><strong>{topIndustry ? countProjectIdeas(topIndustry).toLocaleString() + '+' : '1000+'}</strong> project ideas / industry</span>
            <span><strong>Pub + Pvt</strong> sector split</span>
          </div>
          <div style={{ marginTop: 12 }}><ShareButtons title={`${country.name} — AI Design Space`} /></div>
        </div>
      </section>

      <div className="ads-note">
        🏛️ Every country’s economy is split into a <strong>public sector</strong> (government, energy, health, defense,
        education, infrastructure) and a <strong>private sector</strong> (finance, technology, manufacturing, retail,
        services). Below, each industry opens into its full design — functional domains with high-level &amp; low-level
        diagrams, built from the 12 core design patterns.
      </div>

      {/* Public sector */}
      <section className="ads-section">
        <div className="ads-section-head">
          <h2>🏛️ Public-Sector Industries</h2>
          <p>Government, critical infrastructure and public services — built on governed, secure and explainable AI.</p>
        </div>
        {industries.public.length > 0
          ? <div className="ads-country-industry-list">{industries.public.map(renderIndustry)}</div>
          : <div className="ads-empty">No public-sector industries tagged for {country.name}.</div>}
      </section>

      {/* Private sector */}
      <section className="ads-section">
        <div className="ads-section-head">
          <h2>🏢 Private-Sector Industries</h2>
          <p>Commerce, services and enterprise — built on personalisation, efficiency and customer experience.</p>
        </div>
        {industries.private.length > 0
          ? <div className="ads-country-industry-list">{industries.private.map(renderIndustry)}</div>
          : <div className="ads-empty">No private-sector industries tagged for {country.name}.</div>}
      </section>

      {/* Sample projects */}
      {topIndustry && samples.length > 0 && (
        <section className="ads-section">
          <div className="ads-section-head">
            <h2>💡 Sample project ideas — {topIndustry.name}</h2>
            <p>Each industry has {countProjectIdeas(topIndustry).toLocaleString()}+ generated project ideas with full project structure &amp; code.</p>
          </div>
          <div className="ads-flagship-grid">
            {samples.map(s => (
              <div className="ads-flagship-card" key={s.id} style={{ '--f-grad': topIndustry.gradient }}>
                <div className="ads-flagship-top" style={{ background: topIndustry.gradient }}>
                  <span className="ads-flagship-icon">{s.patternIcon}</span>
                  <span className="ads-flagship-badge">{s.patternTag}</span>
                </div>
                <div className="ads-flagship-body">
                  <h3>{s.title}</h3>
                  <p>{s.desc.slice(0, 120)}…</p>
                  <Link className="ads-flagship-cta" to={`/design-space/${topIndustry.slug}`}>Build it in {topIndustry.name} →</Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Other countries in region */}
      <section className="ads-section">
        <div className="ads-section-head">
          <h2>🌍 {t('relatedCountries')} — {country.region}</h2>
        </div>
        <div className="ads-name-cloud">
          {COUNTRIES.filter(c => c.region === country.region && c.name !== country.name).slice(0, 12).map(c => (
            <Link key={c.name} to={`/design-space/country/${slugify(c.name)}`} className="ads-chip">{c.name}</Link>
          ))}
        </div>
      </section>
    </div>
  )
}

