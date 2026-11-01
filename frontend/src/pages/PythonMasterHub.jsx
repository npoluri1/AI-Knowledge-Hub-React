import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { MASTER_HUB_SECTIONS, MASTER_HUB_STATS } from '../data/pythonMasterHubData'
import { QUANTUM_SECTION, QUANTUM_STATS } from '../data/quantumMasterHubData'
import { IOT_SECTION, SEMICONDUCTOR_SECTION, INDUSTRIAL_STATS } from '../data/industrialMasterHubData'
import TopicLesson from '../components/TopicLesson'
import FetchButton from '../components/FetchButton'
import './PythonMasterHub.css'
import { useLang } from '../i18n'

const FLOAT_SYMBOLS = ['def', 'async', 'class', 'yield', 'import', 'lambda', 'await', 'try', 'for', 'while', 'return', 'print', 'True', 'None', 'with', 'from']

function parseTopic(raw) {
  const idx = raw.indexOf('::')
  if (idx === -1) return { name: raw, desc: '' }
  return { name: raw.slice(0, idx).trim(), desc: raw.slice(idx + 2).trim() }
}

function StatsBar({ stats }) {
  const { t } = useLang()
  const items = [
    { label: t('Topics'), value: stats.totalTopics },
    { label: t('Sections'), value: stats.totalSections },
    { label: t('Areas'), value: stats.totalAreas },
    { label: t('Groups'), value: stats.totalGroups },
    { label: t('Code Labs'), value: stats.totalExamples },
  ]
  return (
    <div className="pmh-stats">
      {items.map(({ label, value }, i) => (
        <React.Fragment key={label}>
          <div className="pmh-stat-box">
            <span className="pmh-stat-value">{value.toLocaleString()}</span>
            <span className="pmh-stat-label">{label}</span>
          </div>
          {i < items.length - 1 && <div className="pmh-stat-divider" />}
        </React.Fragment>
      ))}
    </div>
  )
}

function CodeLabCard({ lab, accent }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="pmh-code-lab">
      <button className="pmh-code-header" onClick={() => setOpen(!open)} style={{ borderLeftColor: accent }}>
        <span className={`pmh-arrow ${open ? 'open' : ''}`}>▶</span>
        <span className="pmh-code-title">{lab.title}</span>
        <span className="pmh-code-file">{lab.file}</span>
        <div className="pmh-code-tags">
          {lab.tags.map(t => <span className="pmh-tag" key={t}>{t}</span>)}
        </div>
      </button>
      <div className={`pmh-code-body ${open ? 'open' : ''}`}>
        <pre className="pmh-code-block"><code>{lab.code}</code></pre>
      </div>
    </div>
  )
}

function TopicItem({ raw, accent, group, sectionId, onSelect }) {
  const { name, desc } = parseTopic(raw)
  return (
    <li className="pmh-topic">
      <button type="button" className="pmh-topic-button" onClick={() => onSelect({
        title: name,
        description: desc,
        group,
        context: sectionId === 'quantum-computing'
          ? 'Quantum Computing and Quantum AI curriculum'
          : sectionId === 'iot-engineering'
            ? 'IoT and Edge Engineering curriculum'
            : sectionId === 'semiconductor-engineering'
              ? 'Semiconductor Engineering curriculum'
              : '',
        language: 'python',
      })}>
        <span className="pmh-topic-name" style={{ color: accent }}>{name}</span>
        {desc && <span className="pmh-topic-desc">{`:: ${desc}`}</span>}
      </button>
    </li>
  )
}

function GroupCard({ name, topics, accent, sectionId, onSelect }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="pmh-group">
      <button className="pmh-group-title" onClick={() => setOpen(!open)}>
        <span className={`pmh-arrow ${open ? 'open' : ''}`}>▶</span>
        {name}
        <span className="pmh-group-count">{topics.length}</span>
      </button>
      <div className={`pmh-group-body ${open ? 'open' : ''}`}>
        <ul className="pmh-topic-list">
          {topics.map((t, i) => <TopicItem key={i} raw={t} accent={accent} group={name} sectionId={sectionId} onSelect={onSelect} />)}
        </ul>
      </div>
    </div>
  )
}

function AreaCard({ name, area, sectionId, defaultOpen = false, onSelect }) {
  const [open, setOpen] = useState(defaultOpen)
  const groupEntries = Object.entries(area.groups)
  const totalTopics = groupEntries.reduce((s, [, t]) => s + t.length, 0)
  return (
    <div className="pmh-area" style={{ animationDelay: `${Math.random() * 0.2}s` }}>
      <button className="pmh-area-header" onClick={() => setOpen(!open)} style={{ borderLeftColor: area.color }}>
        <span className={`pmh-arrow ${open ? 'open' : ''}`}>▶</span>
        <span className="pmh-area-name">{name}</span>
        <span className="pmh-area-meta">{groupEntries.length} groups · {totalTopics} topics</span>
      </button>
      <div className={`pmh-area-body ${open ? 'open' : ''}`}>
        {groupEntries.map(([gName, topics]) => (
          <GroupCard key={gName} name={gName} topics={topics} accent={area.color} sectionId={sectionId} onSelect={onSelect} />
        ))}
      </div>
    </div>
  )
}

export default function PythonMasterHub() {
  const { t } = useLang()
  const sections = useMemo(() => [
    ...MASTER_HUB_SECTIONS,
    QUANTUM_SECTION,
    IOT_SECTION,
    SEMICONDUCTOR_SECTION,
  ], [])
  const [activeTab, setActiveTab] = useState(0)
  const [search, setSearch] = useState('')
  const [showLabs, setShowLabs] = useState(false)
  const [selectedTopic, setSelectedTopic] = useState(null)

  const currentSection = sections[activeTab]
  const currentStats = currentSection.id === QUANTUM_SECTION.id
    ? QUANTUM_STATS
    : currentSection.id === IOT_SECTION.id
      ? INDUSTRIAL_STATS.iot
      : currentSection.id === SEMICONDUCTOR_SECTION.id
        ? INDUSTRIAL_STATS.semiconductor
        : MASTER_HUB_STATS

  const filteredAreas = useMemo(() => {
    if (!search.trim()) return currentSection.areas
    const q = search.toLowerCase()
    const result = {}
    for (const [areaName, area] of Object.entries(currentSection.areas)) {
      const matchedGroups = {}
      for (const [gName, topics] of Object.entries(area.groups)) {
        const matched = topics.filter(t => t.toLowerCase().includes(q))
        if (matched.length > 0) matchedGroups[gName] = matched
      }
      if (Object.keys(matchedGroups).length > 0) {
        result[areaName] = { ...area, groups: matchedGroups }
      }
    }
    return result
  }, [currentSection, search])

  const filteredExamples = useMemo(() => {
    if (!search.trim()) return currentSection.examples || []
    const q = search.toLowerCase()
    return (currentSection.examples || []).filter(
      lab => lab.title.toLowerCase().includes(q) ||
             lab.tags.some(t => t.toLowerCase().includes(q)) ||
             lab.code.toLowerCase().includes(q)
    )
  }, [currentSection, search])

  return (
    <div className="pmh-page">
      <Link to="/" className="back-link">← {t('Back to Home')}</Link>

      <div className="pmh-hero">
        {/* Gradient orbs */}
        <div className="pmh-orb pmh-orb-1" />
        <div className="pmh-orb pmh-orb-2" />
        <div className="pmh-orb pmh-orb-3" />

        {/* Floating code symbols */}
        <div className="pmh-hero-symbols">
          {FLOAT_SYMBOLS.map((sym, i) => (
            <span
              key={sym}
              className="pmh-float-sym"
              style={{
                left: `${8 + (i * 6) % 85}%`,
                animationDelay: `${i * 0.6}s`,
                animationDuration: `${6 + (i % 3)}s`,
              }}
            >
              {sym}
            </span>
          ))}
        </div>

        <div className="pmh-hero-content">
          <div className="pmh-kicker">
            <span className="pmh-kicker-dot" />
            {t('Interactive curriculum')}
          </div>
          <div className="pmh-hero-row">
            <h1>
              <span className="pmh-hero-highlight">{t('Python MasterHub')}</span>
            </h1>
            <FetchButton onFetch={() => { setSearch(''); setActiveTab(0) }} label="Fetch Latest" staticMode />
          </div>
          <p>
            Move from Python fundamentals to advanced AI, quantum, IoT, semiconductor, API, and systems engineering topics.
          </p>
          <div style={{ display: 'flex', gap: '16px', marginTop: '18px', flexWrap: 'wrap' }}>
            <span style={{ color: '#a6e3a1', fontSize: '13px', fontWeight: 600 }}>✓ Search topics and code labs</span>
            <span style={{ color: '#a6e3a1', fontSize: '13px', fontWeight: 600 }}>✓ Open long-form lessons from every topic</span>
            <span style={{ color: '#a6e3a1', fontSize: '13px', fontWeight: 600 }}>✓ Practice with runnable examples</span>
          </div>
        </div>
      </div>

      <StatsBar stats={currentStats} />

      <div className="pmh-search-wrap">
        <span className="pmh-search-icon">🔍</span>
        <input
          className="pmh-search"
          type="text"
          placeholder="Filter topics or code labs..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="pmh-tabs-wrap">
        <div className="pmh-tabs">
          {sections.map((sec, i) => (
            <button
              key={sec.id}
              className={`pmh-tab ${i === activeTab ? 'active' : ''}`}
              style={i === activeTab ? { background: sec.color, borderColor: sec.color } : undefined}
              onClick={() => { setActiveTab(i); setShowLabs(false); setSearch('') }}
            >
              <span className="pmh-tab-icon">{sec.icon}</span>
              <span className="pmh-tab-label">{sec.title}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="pmh-view-toggle">
        <button
          className={`pmh-toggle-btn ${!showLabs ? 'active' : ''}`}
          onClick={() => setShowLabs(false)}
          style={!showLabs ? { background: currentSection.color, borderColor: currentSection.color } : undefined}
        >
          📚 {t('Topics')}
        </button>
        <button
          className={`pmh-toggle-btn ${showLabs ? 'active' : ''}`}
          onClick={() => setShowLabs(true)}
          style={showLabs ? { background: currentSection.color, borderColor: currentSection.color } : undefined}
        >
          💻 {t('Code Labs')} ({(currentSection.examples || []).length})
        </button>
      </div>

      {!showLabs && (
        <div className="pmh-areas">
          {Object.entries(filteredAreas).map(([areaName, area]) => (
            <AreaCard key={areaName} name={areaName} area={area} sectionId={currentSection.id} onSelect={setSelectedTopic} />
          ))}
          {Object.keys(filteredAreas).length === 0 && (
            <div className="pmh-empty">
              <p style={{ margin: 0, fontSize: '24px', marginBottom: '8px' }}>🔍</p>
              No topics match your search. Try a different term.
            </div>
          )}
        </div>
      )}

      {showLabs && (
        <div className="pmh-labs">
          {filteredExamples.map((lab, i) => (
            <CodeLabCard key={i} lab={lab} accent={currentSection.color} />
          ))}
          {filteredExamples.length === 0 && (
            <div className="pmh-empty">
              <p style={{ margin: 0, fontSize: '24px', marginBottom: '8px' }}>💻</p>
              No code labs match your search. Try a different term.
            </div>
          )}
        </div>
      )}

      {selectedTopic && <TopicLesson topic={selectedTopic} onClose={() => setSelectedTopic(null)} />}
    </div>
  )
}
