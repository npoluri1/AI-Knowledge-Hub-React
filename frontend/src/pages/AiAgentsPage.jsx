import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  AGENT_COUNTRIES,
  AGENT_INDUSTRIES,
  AGENT_TYPES,
  TOTAL_AGENT_COUNT,
  generateAgentPage,
} from '../data/aiAgentsDirectoryData'
import { useLang } from '../i18n'
import './AiAgentsPage.css'

const PAGE_SIZE = 24
const typeOptions = AGENT_TYPES.filter(type => type.id !== 'platform')

const formatCount = value => Number(value || 0).toLocaleString()

export default function AiAgentsPage() {
  const { t } = useLang()
  const [search, setSearch] = useState('')
  const [country, setCountry] = useState('')
  const [industry, setIndustry] = useState('')
  const [type, setType] = useState('')
  const [areaMode, setAreaMode] = useState('country')
  const [page, setPage] = useState(1)

  const filters = useMemo(() => ({
    country,
    industry,
    type,
    search: search.trim(),
  }), [country, industry, type, search])

  const pageData = useMemo(
    () => generateAgentPage(page, PAGE_SIZE, filters),
    [page, filters]
  )
  const totalPages = Math.max(1, Math.ceil(pageData.total / PAGE_SIZE))

  const updateFilter = setter => event => {
    setter(event.target.value)
    setPage(1)
  }

  const clearFilters = () => {
    setSearch('')
    setCountry('')
    setIndustry('')
    setType('')
    setPage(1)
  }

  const visibleAreas = areaMode === 'country' ? AGENT_COUNTRIES : AGENT_INDUSTRIES
  const selectedArea = areaMode === 'country' ? country : industry

  const chooseArea = value => {
    if (areaMode === 'country') setCountry(value)
    else setIndustry(value)
    setPage(1)
  }

  return (
    <div className="agents-page">
      <Link className="agents-back" to="/">← {t('Back to knowledge hub')}</Link>

      <header className="agents-hero">
        <div className="agents-hero-glow" />
        <span className="agents-kicker">GLOBAL DIRECTORY / 375,000 BLUEPRINTS</span>
        <h1>🤖 {t('AI Agents Global')}</h1>
        <p>Explore generated AI-agent blueprints across every supported country, industry, workflow, and operating model. Browse safely in pages instead of rendering hundreds of thousands of cards at once.</p>

        <div className="agents-stat-row">
          <div><b>{formatCount(TOTAL_AGENT_COUNT)}</b><span>{t('Total agent blueprints')}</span><small>25 countries × 15 industries × 1,000</small></div>
          <div><b>{AGENT_COUNTRIES.length}</b><span>{t('Countries and markets')}</span><small>Regional policy examples</small></div>
          <div><b>{AGENT_INDUSTRIES.length}</b><span>{t('Industry areas')}</span><small>Business use cases</small></div>
          <div><b>{typeOptions.length}</b><span>{t('Agent models')}</span><small>Task and multi-agent</small></div>
        </div>

        <label className="agents-search">
          <span>⌕</span>
          <input value={search} onChange={event => { setSearch(event.target.value); setPage(1) }} placeholder="Search agents, tasks, industries, or use cases..." aria-label="Search all AI agents" />
        </label>

        <div className="agents-filters" aria-label="Agent filters">
          <select value={country} onChange={updateFilter(setCountry)} aria-label="Filter by country">
            <option value="">All countries</option>
            {AGENT_COUNTRIES.map(item => <option key={item.id} value={item.id}>{item.flag} {item.name}</option>)}
          </select>
          <select value={industry} onChange={updateFilter(setIndustry)} aria-label="Filter by industry">
            <option value="">All industries</option>
            {AGENT_INDUSTRIES.map(item => <option key={item.id} value={item.id}>{item.icon} {item.name}</option>)}
          </select>
          <select value={type} onChange={updateFilter(setType)} aria-label="Filter by agent type">
            <option value="">All agent models</option>
            {typeOptions.map(item => <option key={item.id} value={item.id}>{item.icon} {item.name}</option>)}
          </select>
          {(country || industry || type || search) && <button type="button" className="agents-clear" onClick={clearFilters}>{t('Clear filters')}</button>}
        </div>
      </header>

      <section className="agents-area-panel" aria-label="Browse agent areas">
        <div className="agents-area-heading">
          <div><strong>{t('Browse by area')}</strong><span>Choose a country or industry to focus the global directory.</span></div>
          <div className="agents-area-tabs">
            <button type="button" className={areaMode === 'country' ? 'active' : ''} onClick={() => setAreaMode('country')}>🌍 {t('Countries')}</button>
            <button type="button" className={areaMode === 'industry' ? 'active' : ''} onClick={() => setAreaMode('industry')}>🏭 {t('Industries')}</button>
          </div>
        </div>
        <div className="agents-area-list">
          <button type="button" className={!selectedArea ? 'selected' : ''} onClick={() => chooseArea('')}>{t('All areas')} <small>{formatCount(TOTAL_AGENT_COUNT)}</small></button>
          {visibleAreas.map(item => {
            const id = item.id
            const count = areaMode === 'country' ? AGENT_INDUSTRIES.length * 1000 : AGENT_COUNTRIES.length * 1000
            return <button type="button" key={id} className={selectedArea === id ? 'selected' : ''} onClick={() => chooseArea(id)}>{item.flag || item.icon} {item.name}<small>{formatCount(count)}</small></button>
          })}
        </div>
      </section>

      <div className="agents-toolbar">
        <span><strong>{formatCount(pageData.total)}</strong> matching agents · showing page {page} of {formatCount(totalPages)}</span>
        <div><button type="button" className={!search && !country && !industry && !type ? 'active' : ''} onClick={clearFilters}>All 375,000 agents</button></div>
      </div>

      {pageData.agents.length > 0 ? (
        <div className="agents-directory-grid">
          {pageData.agents.map(agent => {
            const countryInfo = AGENT_COUNTRIES.find(item => item.id === agent.country)
            const industryInfo = AGENT_INDUSTRIES.find(item => item.id === agent.industry)
            const typeInfo = typeOptions.find(item => item.id === agent.type)
            return (
              <Link key={agent.id} to={`/ai-agents/${agent.id}`} className="agent-directory-card" style={{ '--agent-color': typeInfo?.color || '#89b4fa' }}>
                <span className="agent-directory-icon" aria-hidden="true">{industryInfo?.icon || typeInfo?.icon || '🤖'}</span>
                <span className="agent-directory-content">
                  <span className="agent-directory-top"><span>{typeInfo?.name || agent.type}</span><small>{countryInfo?.flag} {countryInfo?.name}</small></span>
                  <h3>{agent.name}</h3>
                  <p>{agent.description}</p>
                  <span className="agent-directory-meta">{industryInfo?.icon} {industryInfo?.name} · {agent.status}</span>
                  <span className="agent-directory-tasks">{agent.tasks.slice(0, 3).map(task => <span key={task}>{task}</span>)}</span>
                  <span className="agent-directory-open">Open complete implementation guide →</span>
                </span>
              </Link>
            )
          })}
        </div>
      ) : (
        <div className="agents-empty">No generated agents match these filters. Try another country, industry, model, or search phrase.</div>
      )}

      <nav className="agents-pagination" aria-label="Agent pages">
        <button type="button" disabled={page <= 1} onClick={() => setPage(current => current - 1)}>← {t('Previous')}</button>
        <span>Page <strong>{page}</strong> of <strong>{formatCount(totalPages)}</strong></span>
        <button type="button" disabled={page >= totalPages} onClick={() => setPage(current => current + 1)}>{t('Next')} →</button>
      </nav>
    </div>
  )
}
