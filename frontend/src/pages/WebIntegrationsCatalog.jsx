import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { INTEGRATION_CATEGORIES, INTEGRATION_STATS } from '../data/webIntegrationsCatalog'
import './WebIntegrationsCatalog.css'

const CATEGORY_ICONS = {
  ai: '🧠', analytics: '📊', auth: '🔐', authentication: '🆔',
  'background-jobs': '⏰', cms: '📝', crm: '🤝', cache: '⚡',
  commerce: '🛒', database: '🗄️', 'developer-tools': '🛠️', email: '✉️',
  hosting: '☁️', infrastructure: '🏗️', monetization: '💰', monitoring: '📡',
  other: '📌', payments: '💳', productivity: '✅', realtime: '🔴',
  sms: '📱', search: '🔍', storage: '💾', support: '🎧',
  video: '🎬', 'web-search': '🌐', webhooks: '🔗'
}

function deriveDomain(name) {
  let d = name.replace(/\s*\(.*?\)\s*/g, '').trim()
  d = d.replace(/ (Cloud|API|Platform|Studio|SDK|ORM|DB|STT|TTS|BaaS|PaaS|SaaS|CLI)$/gi, '')
  d = d.replace(/^(AWS|Azure|Google|GCP) /i, '')
  d = d.toLowerCase().replace(/['']/g, '').replace(/[^a-z0-9.-]/g, '-').replace(/^-+|-+$/g, '')
  return d ? `${d}.com` : ''
}

function serviceUrl(name) {
  const domain = deriveDomain(name)
  return domain ? `https://${domain}` : '#'
}

function logoUrl(name) {
  const domain = deriveDomain(name)
  return domain ? `https://logo.clearbit.com/${domain}` : ''
}

function keysLabel(k) {
  if (!k || k === 0) return ''
  return `${k} key${k !== 1 ? 's' : ''}`
}

function keyColor(k) {
  if (!k || k === 0) return '#6b7280'
  if (k >= 5) return '#f97316'
  if (k >= 3) return '#f59e0b'
  if (k >= 2) return '#10b981'
  return '#6b7280'
}

export default function WebIntegrationsCatalog() {
  const [search, setSearch] = useState('')
  const [activeCat, setActiveCat] = useState(null)
  const [sortBy, setSortBy] = useState('name')

  const allServices = useMemo(() => {
    const s = []
    INTEGRATION_CATEGORIES.forEach(cat => {
      cat.services.forEach(svc => {
        s.push({ ...svc, category: cat.label, categoryId: cat.id })
      })
    })
    return s
  }, [])

  const filtered = useMemo(() => {
    let result = allServices
    if (activeCat) {
      result = result.filter(s => s.category === activeCat)
    }
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.desc.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q)
      )
    }
    if (sortBy === 'keys') result = [...result].sort((a, b) => (b.keys || 0) - (a.keys || 0))
    else if (sortBy === 'category') result = [...result].sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name))
    else result = [...result].sort((a, b) => a.name.localeCompare(b.name))
    return result
  }, [allServices, search, activeCat, sortBy])

  const groupedByCat = useMemo(() => {
    const groups = {}
    filtered.forEach(s => {
      if (!groups[s.category]) groups[s.category] = { icon: CATEGORY_ICONS[s.categoryId] || '📦', services: [] }
      groups[s.category].services.push(s)
    })
    return groups
  }, [filtered])

  return (
    <div className="wic-page">
      <Link to="/" className="back-link">← Back to Home</Link>

      <div className="wic-hero">
        <div className="wic-hero-icon">🔌</div>
        <h1>Web Integrations Catalog</h1>
        <p className="wic-subtitle">
          {INTEGRATION_STATS.totalServices} cloud/SaaS services with ready-to-use API integrations — sourced from the Freebuff project
        </p>
        <div className="wic-stats-row">
          <span className="wic-stat">🔌 {INTEGRATION_STATS.totalServices} Services</span>
          <span className="wic-stat">📂 {INTEGRATION_STATS.totalCategories} Categories</span>
          <span className="wic-stat">🔑 {INTEGRATION_STATS.totalKeys} Total Keys</span>
        </div>
      </div>

      <div className="wic-controls">
        <div className="wic-search-box">
          <span className="wic-search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search services... (e.g. Stripe, database, auth)"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="wic-search"
          />
          {search && <button className="wic-clear" onClick={() => setSearch('')}>✕</button>}
        </div>
        <div className="wic-sort-group">
          <label className="wic-sort-label">Sort:</label>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="wic-sort">
            <option value="name">A–Z</option>
            <option value="keys">Most Keys</option>
            <option value="category">By Category</option>
          </select>
        </div>
      </div>

      <div className="wic-cat-tabs">
        <button className={`wic-cat-tab ${!activeCat ? 'active' : ''}`} onClick={() => setActiveCat(null)}>
          🌐 All ({INTEGRATION_STATS.totalServices})
        </button>
        {INTEGRATION_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            className={`wic-cat-tab ${activeCat === cat.label ? 'active' : ''}`}
            onClick={() => setActiveCat(activeCat === cat.label ? null : cat.label)}
          >
            {CATEGORY_ICONS[cat.id] || '📦'} {cat.label} ({cat.count})
          </button>
        ))}
      </div>

      <div className="wic-results-count">
        Showing {filtered.length} service{filtered.length !== 1 ? 's' : ''}
        {search && <span> matching "<strong>{search}</strong>"</span>}
        {activeCat && <span> in <strong>{activeCat}</strong></span>}
      </div>

      {sortBy === 'category' ? (
        Object.entries(groupedByCat).map(([catName, { icon, services }]) => (
          <div key={catName} className="wic-section">
            <h2 className="wic-section-title">{icon} {catName} <span className="wic-section-count">({services.length})</span></h2>
                <div className="wic-grid">
                  {services.map(svc => (
                    <a key={svc.name} href={serviceUrl(svc.name)} target="_blank" rel="noopener noreferrer" className="wic-card-link">
                      <div className="wic-card">
                        <div className="wic-card-logo-wrap">
                          <img
                            src={logoUrl(svc.name)}
                            alt={`${svc.name} logo`}
                            className="wic-card-logo"
                            loading="lazy"
                            onError={e => { e.target.style.display = 'none'; e.target.nextElementSibling.style.display = 'flex' }}
                          />
                          <div className="wic-card-logo-fallback" style={{ display: 'none' }}>{CATEGORY_ICONS[svc.categoryId] || '📦'}</div>
                        </div>
                        <div className="wic-card-header">
                          <span className="wic-card-name">{svc.name}</span>
                          {svc.keys > 0 && (
                            <span className="wic-card-keys" style={{ color: keyColor(svc.keys) }}>
                              🔑 {keysLabel(svc.keys)}
                            </span>
                          )}
                        </div>
                        <div className="wic-card-desc">{svc.desc}</div>
                        <div className="wic-card-footer">
                          <span className="wic-card-cat">{icon} {catName}</span>
                          {svc.recommended && <span className="wic-badge">Recommended</span>}
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
          </div>
        ))
      ) : (
        <div className="wic-grid">
          {filtered.map(svc => (
            <a key={svc.name} href={serviceUrl(svc.name)} target="_blank" rel="noopener noreferrer" className="wic-card-link">
              <div className="wic-card">
                <div className="wic-card-logo-wrap">
                  <img
                    src={logoUrl(svc.name)}
                    alt={`${svc.name} logo`}
                    className="wic-card-logo"
                    loading="lazy"
                    onError={e => { e.target.style.display = 'none'; e.target.nextElementSibling.style.display = 'flex' }}
                  />
                  <div className="wic-card-logo-fallback" style={{ display: 'none' }}>{CATEGORY_ICONS[svc.categoryId] || '📦'}</div>
                </div>
                <div className="wic-card-header">
                  <span className="wic-card-name">{svc.name}</span>
                  {svc.keys > 0 && (
                    <span className="wic-card-keys" style={{ color: keyColor(svc.keys) }}>
                      🔑 {keysLabel(svc.keys)}
                    </span>
                  )}
                </div>
                <div className="wic-card-desc">{svc.desc}</div>
                <div className="wic-card-footer">
                  <span className="wic-card-cat">{CATEGORY_ICONS[svc.categoryId] || '📦'} {svc.category}</span>
                  {svc.recommended && <span className="wic-badge">Recommended</span>}
                </div>
              </div>
            </a>
          ))}
          {filtered.length === 0 && (
            <div className="wic-empty">
              <p>No services match your search. Try different keywords.</p>
            </div>
          )}
        </div>
      )}

      <div className="wic-footer">
        <p>
          Data sourced from{' '}
          <a href="https://freebuff.com/web/project/lazy-ghosts-shine?view=integrations" target="_blank" rel="noopener noreferrer">
            Freebuff Integrations Catalog
          </a>
          {' '}· {INTEGRATION_STATS.totalServices} services across {INTEGRATION_STATS.totalCategories} categories
        </p>
      </div>
    </div>
  )
}
