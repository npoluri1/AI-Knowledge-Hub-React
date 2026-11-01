import { useState, useMemo, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { TECHSTACK_MODULES, TECHSTACK_INDEX } from '../data/aiTechStackData'
import TopicLesson from '../components/TopicLesson'
import FetchButton from '../components/FetchButton'
import { useLang } from '../i18n'
import './AiTechStackReference.css'

export default function AiTechStackReference() {
  const { t } = useLang()
  const [activeId, setActiveId] = useState(TECHSTACK_INDEX[0]?.id || '')
  const [search, setSearch] = useState('')
  const [selectedTopic, setSelectedTopic] = useState(null)
  const sectionRef = useRef(null)

  const activeModule = useMemo(
    () => TECHSTACK_MODULES.find(m => m.id === activeId) || TECHSTACK_MODULES[0],
    [activeId]
  )

  const stats = useMemo(() => {
    const totalModules = TECHSTACK_MODULES.length
    let totalTables = 0
    let totalTechnologies = 0
    TECHSTACK_MODULES.forEach(m => {
      m.sections.forEach(s => {
        if (s.table) totalTables++
      })
    })
    TECHSTACK_MODULES.forEach(m => {
      const allText = m.sections.flatMap(s =>
        s.table ? s.table.rows.flat() : []
      ).join(' ')
      const techs = allText.match(/\b[A-Z][a-zA-Z+#./ ]{1,30}\b/g) || []
      totalTechnologies += new Set(techs.map(t => t.trim())).size
    })
    return { totalModules, totalTables, totalTechnologies }
  }, [])

  const activeIndex = useMemo(
    () => TECHSTACK_INDEX.findIndex(m => m.id === activeId),
    [activeId]
  )

  const prevModule = activeIndex > 0 ? TECHSTACK_INDEX[activeIndex - 1] : null
  const nextModule = activeIndex < TECHSTACK_INDEX.length - 1 ? TECHSTACK_INDEX[activeIndex + 1] : null

  const searchLower = search.trim().toLowerCase()

  const filteredSections = useMemo(() => {
    if (!activeModule) return []
    if (!searchLower) return activeModule.sections
    return activeModule.sections.map(section => {
      if (!section.table) return section
      const matchingRows = section.table.rows.filter(row =>
        row.some(cell => String(cell).toLowerCase().includes(searchLower))
      )
      return { ...section, table: { ...section.table, rows: matchingRows } }
    }).filter(section => {
      if (section.table) return section.table.rows.length > 0
      if (section.code && searchLower) {
        return section.code.toLowerCase().includes(searchLower)
      }
      return true
    })
  }, [activeModule, searchLower])

  const matchCount = useMemo(() => {
    if (!searchLower || !filteredSections) return 0
    return filteredSections.reduce((acc, s) => {
      if (s.table) return acc + s.table.rows.length
      return acc
    }, 0)
  }, [filteredSections, searchLower])

  useEffect(() => {
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [activeId])

  function handleSelect(id) {
    setActiveId(id)
    setSearch('')
    setSelectedTopic(null)
  }

  function highlightCell(text) {
    if (!searchLower || !text) return text
    const str = String(text)
    const idx = str.toLowerCase().indexOf(searchLower)
    if (idx === -1) return str
    return (
      <>
        {str.slice(0, idx)}
        <mark className="ats-highlight">{str.slice(idx, idx + searchLower.length)}</mark>
        {str.slice(idx + searchLower.length)}
      </>
    )
  }

  function openRowLesson(section, row) {
    const titleIndex = section.table.headers.findIndex(header => /component|feature|pattern|metric|layer|type|area|stage|model|practice|name/i.test(header))
    const title = String(row[titleIndex >= 0 ? titleIndex : 0] || section.heading)
    const context = section.table.headers.map((header, index) => `${header}: ${row[index] ?? ''}`).join(' · ')
    setSelectedTopic({
      title,
      group: section.heading,
      context,
      description: context,
      language: activeModule.id === '02-frontend-typescript' ? 'typescript' : 'python',
    })
  }

  function renderSection(section) {
    return (
      <div key={section.id || section.heading} className="ats-section" id={`section-${section.id}`}>
        <h3 className="ats-section-heading" style={{ borderLeftColor: activeModule.color }}>
          {section.heading}
        </h3>
        {section.table && (
          <div className="ats-table-wrap">
            <table className="ats-table">
              <thead>
                <tr>
                  {section.table.headers.map((h, i) => (
                    <th key={i} style={{ backgroundColor: activeModule.color }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {section.table.rows.map((row, ri) => (
                  <tr
                    key={ri}
                    className="ats-topic-row"
                    tabIndex={0}
                    role="button"
                    onClick={() => openRowLesson(section, row)}
                    onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openRowLesson(section, row) } }}
                    title="Open complete topic lesson"
                  >
                    {row.map((cell, ci) => (
                      <td key={ci}>{highlightCell(cell)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {section.code && (
          <pre className="ats-code-block">
            <code>{section.code}</code>
          </pre>
        )}
      </div>
    )
  }

  return (
    <div className="ats-page">
      <Link to="/" className="back-link">&larr; {t('Back to Home')}</Link>

      <div className="ats-hero" style={{ borderTopColor: activeModule?.color || '#666' }}>
        <div className="page-header-row">
          <h1>{activeModule?.icon} {t('AI TechStack Reference')}</h1>
          <FetchButton onFetch={() => { setSearch(''); setSelectedTopic(null) }} label={t('Fetch Latest')} staticMode />
        </div>
        <p>19 HTML reference modules converted to structured, searchable table data</p>
      </div>

      <div className="ats-stats">
        <div className="ats-stat-item">
          <span className="ats-stat-num">{stats.totalModules}</span>
          <span className="ats-stat-label">{t('Modules')}</span>
        </div>
        <div className="ats-stat-item">
          <span className="ats-stat-num">{stats.totalTables}</span>
          <span className="ats-stat-label">{t('Tables')}</span>
        </div>
        <div className="ats-stat-item">
          <span className="ats-stat-num">{stats.totalTechnologies}</span>
          <span className="ats-stat-label">{t('Technologies')}</span>
        </div>
      </div>

      <div className="ats-module-grid">
        {TECHSTACK_INDEX.map(m => (
          <button
            key={m.id}
            className={`ats-module-card ${m.id === activeId ? 'active' : ''}`}
            style={{
              '--card-color': m.color,
              borderColor: m.id === activeId ? m.color : 'transparent',
            }}
            onClick={() => handleSelect(m.id)}
          >
            <span className="ats-card-icon">{m.icon}</span>
            <span className="ats-card-num">{m.num}</span>
            <span className="ats-card-title">{m.title}</span>
            <span className="ats-card-subtitle">{m.subtitle}</span>
          </button>
        ))}
      </div>

      {activeModule && (
        <>
          <div className="ats-search">
            <span className="ats-search-icon">&#128269;</span>
            <input
              type="text"
              placeholder={`Search within ${activeModule.title}…`}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <span className="ats-search-count">
                {matchCount} match{matchCount !== 1 ? 'es' : ''}
              </span>
            )}
            {search && (
              <button className="ats-search-clear" onClick={() => setSearch('')}>&times;</button>
            )}
          </div>

          <div ref={sectionRef} className="ats-module-content">
            <div className="ats-module-header" style={{ backgroundColor: activeModule.color + '22', borderColor: activeModule.color }}>
              <span className="ats-module-icon">{activeModule.icon}</span>
              <div>
                <h2>{activeModule.title}</h2>
                <p>{activeModule.subtitle}</p>
              </div>
            </div>

            {filteredSections.map(renderSection)}
          </div>

          {selectedTopic && <TopicLesson topic={selectedTopic} onClose={() => setSelectedTopic(null)} />}

          <div className="ats-nav">
            {prevModule ? (
              <button className="ats-nav-btn ats-nav-prev" onClick={() => handleSelect(prevModule.id)}>
                <span className="ats-nav-arrow">&larr;</span>
                <span className="ats-nav-info">
                  <span className="ats-nav-label">{t('Previous')}</span>
                  <span className="ats-nav-title">{prevModule.icon} {prevModule.title}</span>
                </span>
              </button>
            ) : <div />}
            {nextModule ? (
              <button className="ats-nav-btn ats-nav-next" onClick={() => handleSelect(nextModule.id)}>
                <span className="ats-nav-info">
                  <span className="ats-nav-label">{t('Next')}</span>
                  <span className="ats-nav-title">{nextModule.title} {nextModule.icon}</span>
                </span>
                <span className="ats-nav-arrow">&rarr;</span>
              </button>
            ) : <div />}
          </div>
        </>
      )}
    </div>
  )
}
