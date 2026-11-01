import React, { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getLibrary, topicItems } from '../data/learnHub'
import { useLang } from '../i18n'
import './LearnHub.css'

export default function LibraryView() {
  const { t } = useLang()
  const { libId } = useParams()
  const lib = getLibrary(libId)
  const [query, setQuery] = useState('')

  const topics = useMemo(() => {
    if (!lib || !lib.topics) return []
    const q = query.trim().toLowerCase()
    if (!q) return lib.topics
    return lib.topics.filter(t =>
      `${t.title} ${t.desc || ''}`.toLowerCase().includes(q)
    )
  }, [lib, query])

  if (!lib || !lib.topics || lib.topics.length === 0) {
    return (
      <div className="lh-page">
        <Link to="/learn" className="lh-back">← {t('Back to Learning Hub')}</Link>
        <div className="lh-error">
          <h2>{t('Library not found')}</h2>
          <p>We couldn't resolve “{libId}”.</p>
          <Link to="/learn" className="lh-btn">{t('Browse all libraries →')}</Link>
        </div>
      </div>
    )
  }

  const accent = lib.color || '#89b4fa'
  const itemTotal = topics.reduce((n, t) => n + topicItems(t).length, 0)

  return (
    <div className="lh-page">
      <Link to="/learn" className="lh-back">← {t('Back to Learning Hub')}</Link>

      {/* Library hero */}
      <section className="lh-topic-hero" style={{ '--t-grad': `linear-gradient(135deg, ${accent}2e, ${accent}08)`, '--t-color': accent }}>
        <div className="lh-topic-icon">{lib.icon}</div>
        <div className="lh-topic-text">
          <div className="lh-kicker">{lib.topicCount} topics · {lib.itemCount.toLocaleString()}+ {lib.kind === 'quiz' ? 'quizzes' : lib.kind === 'article' ? 'articles' : 'concepts'}</div>
          <h1>{lib.title}</h1>
          <p>{lib.desc}</p>
        </div>
      </section>

      {/* Toolbar */}
      <div className="lh-toolbar">
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder={`Search ${topics.length} topics in ${lib.title}…`}
          aria-label="Search library topics"
        />
        {query && <button type="button" className="lh-clear" onClick={() => setQuery('')}>✕ {t('Clear')}</button>}
      </div>
      <div className="lh-result-line">Showing <strong>{topics.length}</strong> of {lib.topics.length} topics · {itemTotal.toLocaleString()} lessons</div>

      {/* Topic cards */}
      <div className="lh-name-cloud" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
        {topics.map(t => {
          const count = topicItems(t).length
          return (
            <Link
              className="lh-chip"
              to={`/learn/${lib.id}/${t.id}`}
              key={t.id}
              style={{ '--c-c': t.color || accent, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 6, padding: 16, borderRadius: 14, minHeight: 96 }}
            >
              <span style={{ fontSize: 15, fontWeight: 700 }}>{t.icon} {t.title} <small style={{ fontSize: 11, opacity: 0.75 }}>{count} {lib.kind === 'quiz' ? 'quizzes' : lib.kind === 'article' ? 'articles' : 'concepts'}</small></span>
              {t.desc && <span style={{ fontSize: 12, opacity: 0.8, fontWeight: 400, lineHeight: 1.4 }}>{t.desc}</span>}
              <span style={{ fontSize: 12, fontWeight: 600, marginTop: 'auto', color: t.color || accent }}>Open {lib.kind === 'quiz' ? 'quizzes' : 'topics'} →</span>
            </Link>
          )
        })}
      </div>
      {topics.length === 0 && <div className="lh-empty">No topics match “{query}” in {lib.title}.</div>}
    </div>
  )
}
