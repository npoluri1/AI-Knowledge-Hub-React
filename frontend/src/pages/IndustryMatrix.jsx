import React, { useState, useMemo } from 'react'
import { INDUSTRY_MATRIX, INDUSTRIES, COUNTRIES, INDUSTRY_COLORS } from '../data/aiIndustryMatrix'

const REGIONS = {
  'North America': ['USA', 'Canada', 'Mexico'],
  'South America': ['Brazil', 'Argentina', 'Chile', 'Colombia'],
  'Europe': ['EU', 'Netherlands', 'UK'],
  'Asia': ['India', 'China', 'Japan', 'Thailand', 'Vietnam', 'Indonesia', 'South Korea', 'Israel'],
  'Africa': ['Nigeria', 'Kenya', 'Ethiopia', 'South Africa'],
  'Oceania': ['Australia', 'New Zealand'],
}

const COUNTRY_FLAGS = {
  USA: '🇺🇸', EU: '🇪🇺', India: '🇮🇳', China: '🇨🇳', Japan: '🇯🇵', Brazil: '🇧🇷',
  Australia: '🇦🇺', Nigeria: '🇳🇬', Kenya: '🇰🇪', 'South Africa': '🇿🇦', Thailand: '🇹🇭',
  Vietnam: '🇻🇳', Indonesia: '🇮🇩', Mexico: '🇲🇽', Argentina: '🇦🇷', Netherlands: '🇳🇱',
  Israel: '🇮🇱', 'New Zealand': '🇳🇿', Chile: '🇨🇱', Colombia: '🇨🇴', Ethiopia: '🇪🇹',
  'South Korea': '🇰🇷', Canada: '🇨🇦', UK: '🇬🇧',
}

const INDUSTRY_ICONS = {
  'AGRICULTURE & FOOD': '🌾',
  'EDUCATION & EDTECH': '📚',
  'GOVERNMENT & PUBLIC SECTOR': '🏛️',
  'DEFENSE & AEROSPACE': '🛡️',
  'SPACE & SATELLITE': '🛰️',
  'ENVIRONMENTAL & SUSTAINABILITY': '🌍',
  'MEDIA & ENTERTAINMENT': '🎬',
  'HOSPITALITY & TOURISM': '🏨',
  'LEGAL & PROFESSIONAL SERVICES': '⚖️',
  'SPORTS & FITNESS': '⚽',
  'PERSONAL SERVICES': '💆',
  'INSURANCE': '🛡️',
  'HUMANITARIAN & NGO': '🤝',
  'ARTS & CULTURE': '🎨',
}

export default function IndustryMatrix() {
  const [search, setSearch] = useState('')
  const [selectedIndustry, setSelectedIndustry] = useState('All')
  const [selectedCountry, setSelectedCountry] = useState('All')
  const [selectedRegion, setSelectedRegion] = useState('All')
  const [expandedRow, setExpandedRow] = useState(null)
  const [sortField, setSortField] = useState('industry')
  const [sortDir, setSortDir] = useState('asc')

  const filteredData = useMemo(() => {
    let data = [...INDUSTRY_MATRIX]

    if (selectedIndustry !== 'All') {
      data = data.filter(e => e.industry === selectedIndustry)
    }

    if (selectedRegion !== 'All') {
      const regionCountries = REGIONS[selectedRegion] || []
      data = data.filter(e => regionCountries.includes(e.country))
    }

    if (selectedCountry !== 'All') {
      data = data.filter(e => e.country === selectedCountry)
    }

    if (search) {
      const q = search.toLowerCase()
      data = data.filter(e =>
        e.industry.toLowerCase().includes(q) ||
        e.subIndustry.toLowerCase().includes(q) ||
        e.country.toLowerCase().includes(q) ||
        e.concerns.toLowerCase().includes(q) ||
        e.compliance.toLowerCase().includes(q) ||
        e.notes.toLowerCase().includes(q)
      )
    }

    data.sort((a, b) => {
      const av = a[sortField] || ''
      const bv = b[sortField] || ''
      const cmp = av.localeCompare(bv)
      return sortDir === 'asc' ? cmp : -cmp
    })

    return data
  }, [search, selectedIndustry, selectedCountry, selectedRegion, sortField, sortDir])

  const stats = useMemo(() => {
    const industries = new Set(filteredData.map(e => e.industry))
    const subIndustries = new Set(filteredData.map(e => e.subIndustry))
    const countries = new Set(filteredData.map(e => e.country))
    return { total: filteredData.length, industries: industries.size, subIndustries: subIndustries.size, countries: countries.size }
  }, [filteredData])

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDir('asc')
    }
  }

  const toggleRow = (idx) => {
    setExpandedRow(expandedRow === idx ? null : idx)
  }

  const clearFilters = () => {
    setSearch('')
    setSelectedIndustry('All')
    setSelectedCountry('All')
    setSelectedRegion('All')
  }

  const hasActiveFilters = search || selectedIndustry !== 'All' || selectedCountry !== 'All' || selectedRegion !== 'All'

  return (
    <div className="im-container">
      <div className="im-header">
        <h2 className="im-title">🌐 Industry Regulatory & Compliance Matrix</h2>
        <p className="im-subtitle">
          AI deployment regulations, costs, latency, safety, and compliance across {INDUSTRIES.length} industries and {COUNTRIES.length} countries
        </p>
      </div>

      {/* Stats */}
      <div className="im-stats">
        <div className="im-stat">
          <span className="im-stat-value">{stats.total}</span>
          <span className="im-stat-label">Entries</span>
        </div>
        <div className="im-stat">
          <span className="im-stat-value">{stats.industries}</span>
          <span className="im-stat-label">Industries</span>
        </div>
        <div className="im-stat">
          <span className="im-stat-value">{stats.subIndustries}</span>
          <span className="im-stat-label">Sub-Industries</span>
        </div>
        <div className="im-stat">
          <span className="im-stat-value">{stats.countries}</span>
          <span className="im-stat-label">Countries</span>
        </div>
      </div>

      {/* Filters */}
      <div className="im-filters">
        <div className="im-search-box">
          <span className="im-search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search industry, concerns, compliance..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="im-search-input"
          />
          {search && <button className="im-search-clear" onClick={() => setSearch('')}>✕</button>}
        </div>

        <select
          className="im-select"
          value={selectedIndustry}
          onChange={e => setSelectedIndustry(e.target.value)}
        >
          <option value="All">All Industries</option>
          {INDUSTRIES.map(ind => (
            <option key={ind} value={ind}>{INDUSTRY_ICONS[ind] || '📁'} {ind}</option>
          ))}
        </select>

        <select
          className="im-select"
          value={selectedRegion}
          onChange={e => { setSelectedRegion(e.target.value); setSelectedCountry('All') }}
        >
          <option value="All">All Regions</option>
          {Object.keys(REGIONS).map(r => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>

        <select
          className="im-select"
          value={selectedCountry}
          onChange={e => setSelectedCountry(e.target.value)}
        >
          <option value="All">All Countries</option>
          {COUNTRIES.map(c => (
            <option key={c} value={c}>{COUNTRY_FLAGS[c] || '🏳️'} {c}</option>
          ))}
        </select>

        {hasActiveFilters && (
          <button className="im-clear-btn" onClick={clearFilters}>✕ Clear Filters</button>
        )}
      </div>

      {/* Results Table */}
      {filteredData.length === 0 ? (
        <div className="im-empty">
          <span className="im-empty-icon">🔍</span>
          <p>No entries match your filters. Try adjusting your criteria.</p>
        </div>
      ) : (
        <div className="im-table-wrapper">
          <table className="im-table">
            <thead>
              <tr>
                <th className="im-th" onClick={() => handleSort('industry')}>
                  Industry {sortField === 'industry' && (sortDir === 'asc' ? '↑' : '↓')}
                </th>
                <th className="im-th" onClick={() => handleSort('subIndustry')}>
                  Sub-Industry {sortField === 'subIndustry' && (sortDir === 'asc' ? '↑' : '↓')}
                </th>
                <th className="im-th" onClick={() => handleSort('country')}>
                  Country {sortField === 'country' && (sortDir === 'asc' ? '↑' : '↓')}
                </th>
                <th className="im-th im-th-concerns">Concerns</th>
                <th className="im-th im-th-compliance">Compliance</th>
                <th className="im-th im-th-expand"></th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((entry, idx) => {
                const isExpanded = expandedRow === idx
                const color = INDUSTRY_COLORS[entry.industry] || '#64748b'
                return (
                  <React.Fragment key={idx}>
                    <tr
                      className={`im-row ${isExpanded ? 'im-row-expanded' : ''}`}
                      onClick={() => toggleRow(idx)}
                      style={{ '--im-color': color }}
                    >
                      <td className="im-td">
                        <span className="im-industry-badge" style={{ background: `${color}15`, color, border: `1px solid ${color}30` }}>
                          <span className="im-industry-icon">{INDUSTRY_ICONS[entry.industry] || '📁'}</span>
                          {entry.industry}
                        </span>
                      </td>
                      <td className="im-td">{entry.subIndustry}</td>
                      <td className="im-td">
                        <span className="im-country">{COUNTRY_FLAGS[entry.country] || '🏳️'} {entry.country}</span>
                      </td>
                      <td className="im-td im-td-concerns">{entry.concerns}</td>
                      <td className="im-td im-td-compliance">{entry.compliance}</td>
                      <td className="im-td im-td-expand">
                        <span className={`im-expand-icon ${isExpanded ? 'im-expanded' : ''}`}>▶</span>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr className="im-detail-row">
                        <td colSpan="6" className="im-detail-cell">
                          <div className="im-detail-grid">
                            <div className="im-detail-section">
                              <span className="im-detail-label">💰 Cost</span>
                              <p className="im-detail-value">{entry.cost}</p>
                            </div>
                            <div className="im-detail-section">
                              <span className="im-detail-label">⚡ Latency</span>
                              <p className="im-detail-value">{entry.latency}</p>
                            </div>
                            <div className="im-detail-section">
                              <span className="im-detail-label">🛡️ Safety</span>
                              <p className="im-detail-value">{entry.safety}</p>
                            </div>
                            <div className="im-detail-section im-detail-full">
                              <span className="im-detail-label">📋 Compliance</span>
                              <p className="im-detail-value">{entry.compliance}</p>
                            </div>
                            <div className="im-detail-section im-detail-full">
                              <span className="im-detail-label">📝 Notes</span>
                              <p className="im-detail-value">{entry.notes}</p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="im-footer">
        <p>— Industry Regulatory & Compliance Matrix ({INDUSTRY_MATRIX.length} entries) | Compiled July 2026 —</p>
      </div>
    </div>
  )
}
