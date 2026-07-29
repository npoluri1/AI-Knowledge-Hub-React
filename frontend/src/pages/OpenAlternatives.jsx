import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { OA_CATEGORIES, OA_STATS } from '../data/openAlternatives'
import './OpenAlternatives.css'

function formatStars(n) {
  if (!n) return '0'
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M'
  if (n >= 1000) return (n / 1000).toFixed(n >= 10000 ? 0 : 1) + 'K'
  return String(n)
}

function licenseColor(lic) {
  if (!lic) return '#6b7280'
  const l = lic.toUpperCase()
  if (l.includes('MIT')) return '#10b981'
  if (l.includes('APACHE')) return '#3b82f6'
  if (l.includes('GPL')) return '#f59e0b'
  if (l.includes('AGPL')) return '#f97316'
  if (l.includes('BSD')) return '#8b5cf6'
  if (l.includes('MPL')) return '#06b6d4'
  if (l.includes('LGPL')) return '#ec4899'
  return '#6b7280'
}

export default function OpenAlternatives() {
  const [search, setSearch] = useState('')
  const [activeCat, setActiveCat] = useState(null)
  const [sortBy, setSortBy] = useState('name')

  const allTools = useMemo(() => {
    const tools = []
    OA_CATEGORIES.forEach(cat => {
      cat.subcategories.forEach(sub => {
        sub.tools.forEach(tool => {
          tools.push({ ...tool, category: cat.label, categoryIcon: cat.icon, subcategory: sub.label, subId: sub.id })
        })
      })
    })
    return tools
  }, [])

  const filtered = useMemo(() => {
    let result = allTools
    if (activeCat) {
      result = result.filter(t => t.category === activeCat)
    }
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(t =>
        t.name.toLowerCase().includes(q) ||
        t.desc.toLowerCase().includes(q) ||
        t.subcategory.toLowerCase().includes(q)
      )
    }
    if (sortBy === 'stars') result = [...result].sort((a, b) => (b.stars || 0) - (a.stars || 0))
    else if (sortBy === 'category') result = [...result].sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name))
    else result = [...result].sort((a, b) => a.name.localeCompare(b.name))
    return result
  }, [allTools, search, activeCat, sortBy])

  const groupedByCat = useMemo(() => {
    const groups = {}
    filtered.forEach(t => {
      if (!groups[t.category]) groups[t.category] = { icon: t.categoryIcon, subcats: {} }
      if (!groups[t.category].subcats[t.subcategory]) groups[t.category].subcats[t.subcategory] = []
      groups[t.category].subcats[t.subcategory].push(t)
    })
    return groups
  }, [filtered])

  return (
    <div className="oa-page">
      <Link to="/" className="back-link">← Back to Home</Link>

      <div className="oa-hero">
        <div className="oa-hero-icon">🔓</div>
        <h1>Open Source Alternatives</h1>
        <p className="oa-subtitle">
          {OA_STATS.totalTools} open source tools to replace proprietary software — curated from{' '}
          <a href="https://openalternative.co" target="_blank" rel="noopener noreferrer">OpenAlternative.co</a>
        </p>
        <div className="oa-stats-row">
          <span className="oa-stat">📦 {OA_STATS.totalTools} Tools</span>
          <span className="oa-stat">📂 {OA_STATS.totalCategories} Categories</span>
          <span className="oa-stat">🏷️ {OA_STATS.totalSubcategories} Subcategories</span>
        </div>
      </div>

      <div className="oa-controls">
        <div className="oa-search-box">
          <span className="oa-search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search tools... (e.g. Supabase, CRM, analytics)"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="oa-search"
          />
          {search && <button className="oa-clear" onClick={() => setSearch('')}>✕</button>}
        </div>
        <div className="oa-sort-group">
          <label className="oa-sort-label">Sort:</label>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="oa-sort">
            <option value="name">A–Z</option>
            <option value="stars">Most Stars</option>
            <option value="category">By Category</option>
          </select>
        </div>
      </div>

      <div className="oa-cat-tabs">
        <button className={`oa-cat-tab ${!activeCat ? 'active' : ''}`} onClick={() => setActiveCat(null)}>
          🌐 All ({OA_STATS.totalTools})
        </button>
        {OA_CATEGORIES.map(cat => {
          const count = cat.subcategories.reduce((s, sub) => s + sub.tools.length, 0)
          return (
            <button
              key={cat.id}
              className={`oa-cat-tab ${activeCat === cat.label ? 'active' : ''}`}
              onClick={() => setActiveCat(activeCat === cat.label ? null : cat.label)}
            >
              {cat.icon} {cat.label} ({count})
            </button>
          )
        })}
      </div>

      <div className="oa-results-count">
        Showing {filtered.length} tool{filtered.length !== 1 ? 's' : ''}
        {search && <span> matching "<strong>{search}</strong>"</span>}
        {activeCat && <span> in <strong>{activeCat}</strong></span>}
      </div>

      {sortBy === 'name' || sortBy === 'stars' ? (
        <div className="oa-grid">
          {filtered.map(tool => (
            <a
              key={tool.name + tool.subId}
              href={`https://openalternative.co/${tool.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="oa-card"
            >
              <div className="oa-card-header">
                <span className="oa-card-name">{tool.name}</span>
                {tool.stars > 0 && (
                  <span className="oa-card-stars">⭐ {formatStars(tool.stars)}</span>
                )}
              </div>
              <div className="oa-card-desc">{tool.desc}</div>
              <div className="oa-card-footer">
                <span className="oa-card-license" style={{ borderColor: licenseColor(tool.license) }}>
                  {tool.license || 'N/A'}
                </span>
                <span className="oa-card-cat">{tool.categoryIcon} {tool.subcategory}</span>
              </div>
            </a>
          ))}
          {filtered.length === 0 && (
            <div className="oa-empty">
              <p>No tools match your search. Try different keywords.</p>
            </div>
          )}
        </div>
      ) : (
        Object.entries(groupedByCat).map(([catName, { icon, subcats }]) => (
          <div key={catName} className="oa-section">
            <h2 className="oa-section-title">{icon} {catName}</h2>
            {Object.entries(subcats).map(([subName, tools]) => (
              <div key={subName}>
                <h3 className="oa-subsection-title">{subName} ({tools.length})</h3>
                <div className="oa-grid">
                  {tools.map(tool => (
                    <a
                      key={tool.name + tool.subId}
                      href={`https://openalternative.co/${tool.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="oa-card"
                    >
                      <div className="oa-card-header">
                        <span className="oa-card-name">{tool.name}</span>
                        {tool.stars > 0 && (
                          <span className="oa-card-stars">⭐ {formatStars(tool.stars)}</span>
                        )}
                      </div>
                      <div className="oa-card-desc">{tool.desc}</div>
                      <div className="oa-card-footer">
                        <span className="oa-card-license" style={{ borderColor: licenseColor(tool.license) }}>
                          {tool.license || 'N/A'}
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))
      )}

      <div className="oa-footer">
        <p>
          Data sourced from{' '}
          <a href="https://openalternative.co" target="_blank" rel="noopener noreferrer">OpenAlternative.co</a>
          {' · '}
          <a href="https://github.com/piotrkulpinski/open-source-alternatives" target="_blank" rel="noopener noreferrer">
            GitHub Repository
          </a>
        </p>
      </div>
    </div>
  )
}
