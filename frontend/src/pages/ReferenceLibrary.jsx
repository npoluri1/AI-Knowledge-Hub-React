import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { REFERENCE_DOCUMENTS, REFERENCE_CATEGORIES } from '../data/referenceLibraryData'
import TopicLesson from '../components/TopicLesson'
import FetchButton from '../components/FetchButton'
import { refreshFileCatalog } from '../api'
import './ReferenceLibrary.css'
import { useLang } from '../i18n'

export default function ReferenceLibrary() {
  const { t } = useLang()
  const [cat, setCat] = useState('all')
  const [q, setQ] = useState('')
  const [expanded, setExpanded] = useState(null)
  const [selectedSection, setSelectedSection] = useState(null)

  const stats = useMemo(() => ({
    total: REFERENCE_DOCUMENTS.length,
    categories: new Set(REFERENCE_DOCUMENTS.map(d => d.category)).size,
  }), [])

  const filtered = useMemo(() => {
    let list = cat === 'all' ? REFERENCE_DOCUMENTS : REFERENCE_DOCUMENTS.filter(d => d.category === cat)
    const needle = q.trim().toLowerCase()
    if (needle) {
      list = list.filter(d =>
        d.title.toLowerCase().includes(needle) ||
        d.description.toLowerCase().includes(needle) ||
        d.category.toLowerCase().includes(needle) ||
        d.sections.some(s =>
          s.heading.toLowerCase().includes(needle) ||
          (s.content && s.content.toLowerCase().includes(needle)) ||
          (s.items && s.items.some(i => i.label.toLowerCase().includes(needle) || i.detail.toLowerCase().includes(needle)))
        ))
    }
    return list
  }, [cat, q])

  const toggle = (id) => setExpanded(prev => prev === id ? null : id)

  const renderSection = (section, idx, doc) => {
    const itemText = (section.items || []).map(item => `${item.label}: ${item.detail || ''}`).join(' · ')
    const context = [doc.title, doc.category, section.content || '', itemText].filter(Boolean).join(' ')
    return (
    <div className="rl-doc-section" key={idx}>
      <button
        type="button"
        className="rl-section-open"
        onClick={() => setSelectedSection({
          title: section.heading,
          group: `${doc.title} · ${doc.category}`,
          description: context,
          context,
          language: /chinese|language|words|phrases/i.test(doc.title) ? 'typescript' : 'python',
        })}
        title="Open complete section lesson"
      >
        <h4>{section.heading}</h4>
        <span className="rl-section-open-hint">{t('Open complete lesson')} ↗</span>
      </button>
      {section.content && (
        <div className="rl-doc-content">
          {section.content.split(/(?<=\.|\?|!)\s+/).map((sentence, i) => (
            <span key={i}>{sentence} </span>
          ))}
        </div>
      )}
      {section.items && (
        <ul className="rl-doc-items">
          {section.items.map((item, i) => (
            <li key={i}>
              <strong>{item.label}</strong>
              {item.detail && <span> — {item.detail}</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
    )
  }

  return (
    <div className="rl-page">
      <Link to="/" className="back-link">← {t('Back to Home')}</Link>

      <div className="rl-hero">
        <div className="page-header-row">
          <h1 className="chapter-title">📚 {t('Reference Library')}</h1>
          <FetchButton onFetch={() => { setCat('all'); setQ(''); setExpanded(null); return refreshFileCatalog('Reference library') }} label="Fetch Latest" />
        </div>
        <p className="chapter-preview">
          {REFERENCE_DOCUMENTS.length} reference documents across{' '}
          {new Set(REFERENCE_DOCUMENTS.map(d => d.category)).size} categories —
          roadmaps, tools, news sources, projects, and language references.
        </p>
      </div>

      <div className="rl-stats">
        <div className="rl-stat">
          <span className="rl-stat-value">{stats.total}</span>
          <span className="rl-stat-label">{t('Documents')}</span>
        </div>
        <div className="rl-stat">
          <span className="rl-stat-value">{stats.categories}</span>
          <span className="rl-stat-label">{t('Categories')}</span>
        </div>
        <div className="rl-stat">
          <span className="rl-stat-value">
            {REFERENCE_DOCUMENTS.reduce((sum, d) => sum + d.sections.length, 0)}
          </span>
          <span className="rl-stat-label">{t('Sections')}</span>
        </div>
      </div>

      <div className="rl-search">
        <span className="rl-search-icon">🔍</span>
        <input
          className="rl-search-input"
          type="text"
          placeholder="Search documents, sections, content..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        {q && (
          <button className="rl-search-clear" onClick={() => setQ('')}>✕</button>
        )}
      </div>

      <div className="rl-categories">
        {REFERENCE_CATEGORIES.map(c => (
          <button
            key={c.id}
            className={`rl-category-btn${cat === c.id ? ' active' : ''}`}
            onClick={() => { setCat(c.id); setExpanded(null) }}
          >
            <span>{c.icon}</span>
            <span>{c.label}</span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rl-empty">
          <span className="rl-empty-icon">📭</span>
          <p>{t('No documents match your search.')}</p>
        </div>
      ) : (
        <div className="rl-doc-grid">
          {filtered.map(doc => (
            <div
              key={doc.id}
              className={`rl-doc-card${expanded === doc.id ? ' expanded' : ''}`}
              onClick={() => toggle(doc.id)}
            >
              <div className="rl-doc-header">
                <div className="rl-doc-title-row">
                  <span className="rl-doc-icon">{doc.icon}</span>
                  <h3 className="rl-doc-title">{doc.title}</h3>
                </div>
                <span className="rl-doc-category">{doc.category}</span>
                <p className="rl-doc-desc">{doc.description}</p>
                <div className="rl-doc-meta">
                  <span>{doc.sections.length} sections</span>
                  <span className="rl-doc-expand-hint">
                    {expanded === doc.id ? `▲ ${t('Click to collapse')}` : `▼ ${t('Click to expand')}`}
                  </span>
                </div>
              </div>
              {expanded === doc.id && (
                <div className="rl-doc-body" onClick={(e) => e.stopPropagation()}>
                  {doc.sections.map((section, idx) => renderSection(section, idx, doc))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {selectedSection && <TopicLesson topic={selectedSection} onClose={() => setSelectedSection(null)} />}
    </div>
  )
}
