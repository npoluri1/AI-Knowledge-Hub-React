import React, { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import LessonContent from '../components/LessonContent'
import { getTopic, getLibrary, topicItems } from '../data/learnHub'
import { useLang } from '../i18n'
import './LearnHub.css'

export default function LearnTopic() {
  const { t } = useLang()
  const { libId, topicId } = useParams()
  const found = getTopic(libId, topicId)
  const lib = getLibrary(libId)

  const [query, setQuery] = useState('')
  const [open, setOpen] = useState({})
  const [done, setDone] = useState({})
  const [activeId, setActiveId] = useState(null)

  // Load completion state from localStorage
  useEffect(() => {
    try {
      const key = `lh-done-${libId}-${topicId}`
      const saved = JSON.parse(localStorage.getItem(key) || '{}')
      setDone(saved)
    } catch { /* ignore */ }
  }, [libId, topicId])

  const markDone = id => {
    const next = { ...done, [id]: !done[id] }
    setDone(next)
    try {
      localStorage.setItem(`lh-done-${libId}-${topicId}`, JSON.stringify(next))
    } catch { /* ignore */ }
  }

  const items = useMemo(() => {
    if (!found) return []
    return topicItems(found.topic)
  }, [found])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return items
    return items.filter(i => `${i.title} ${i.s || ''}`.toLowerCase().includes(q))
  }, [items, query])

  if (!found || !lib) {
    return (
      <div className="lh-page">
        <Link to="/learn" className="lh-back">← {t('Back to Learning Hub')}</Link>
        <div className="lh-error">
          <h2>{t('Topic not found')}</h2>
          <p>We couldn\'t resolve “{topicId}” in “{libId}”.</p>
          <Link to="/learn" className="lh-btn">{t('Browse all libraries →')}</Link>
        </div>
      </div>
    )
  }

  const { topic } = found
  const accent = topic.color || lib.color || '#89b4fa'
  const doneCount = items.filter(i => done[i.id]).length
  const pct = items.length ? Math.round((doneCount / items.length) * 100) : 0

  const currentIdx = activeId ? items.findIndex(i => i.id === activeId) : -1
  const prevItem = currentIdx > 0 ? items[currentIdx - 1] : null
  const nextItem = currentIdx >= 0 && currentIdx < items.length - 1 ? items[currentIdx + 1] : null

  return (
    <div className="lh-page">
      <Link to={lib.route} className="lh-back">← Back to {lib.title}</Link>

      {/* Topic hero */}
      <section className="lh-topic-hero" style={{ '--t-grad': `linear-gradient(135deg, ${accent}2e, ${accent}08)`, '--t-color': accent }}>
        <div className="lh-topic-icon">{topic.icon}</div>
        <div className="lh-topic-text">
          <div className="lh-kicker">{lib.title} · {topicItems(topic).length} {lib.kind === 'quiz' ? 'quizzes' : lib.kind === 'article' ? 'articles' : 'concepts'}</div>
          <h1>{topic.title}</h1>
          <p>{topic.desc}</p>
          <div className="lh-progress">
            <div className="lh-progress-bar"><span style={{ width: `${pct}%`, background: accent }} /></div>
            <span className="lh-progress-label">{doneCount}/{items.length} mastered · {pct}%</span>
          </div>
        </div>
      </section>

      {/* Toolbar */}
      <div className="lh-toolbar">
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder={`Search ${items.length} ${lib.kind === 'quiz' ? 'quizzes' : 'lessons'} in ${topic.title}…`}
          aria-label="Search topic lessons"
        />
        {query && <button type="button" className="lh-clear" onClick={() => setQuery('')}>✕ {t('Clear')}</button>}
      </div>
      <div className="lh-result-line">Showing <strong>{filtered.length}</strong> of {items.length} · click any card to expand the full lesson</div>

      {/* Lesson cards */}
      <div className="lh-items">
        {filtered.map((item, idx) => {
          const isOpen = !!open[item.id]
          const isActive = item.id === activeId
          return (
            <article
              key={item.id}
              id={item.id}
              className={`lh-item ${isOpen ? 'open' : ''} ${done[item.id] ? 'done' : ''} ${isActive ? 'active' : ''}`}
              style={{ '--i-accent': accent }}
            >
              <button type="button" className="lh-item-head" onClick={() => { setOpen(o => ({ ...o, [item.id]: !o[item.id] })); setActiveId(item.id) }} aria-expanded={isOpen}>
                <span className="lh-item-num">{String(idx + 1).padStart(2, '0')}</span>
                <span className="lh-item-title">{item.title}</span>
                <span className="lh-item-badge">{done[item.id] ? '✅ mastered' : (lib.kind === 'quiz' ? '💻 predict' : '📖 lesson')}</span>
                <span className="lh-item-chev">{isOpen ? '▲' : '▼'}</span>
              </button>
              {isOpen && (
                <div className="lh-item-body">
                  <LessonContent item={item} kind={lib.kind} topic={topic} lib={lib} />
                  <div className="lh-item-actions">
                    <button type="button" className={`lh-done-btn ${done[item.id] ? 'on' : ''}`} onClick={() => markDone(item.id)}>
                      {done[item.id] ? '✅ Marked mastered' : '☑️ Mark as mastered'}
                    </button>
                    <div className="lh-item-nav">
                      {prevItem && <button type="button" className="lh-nav-btn" onClick={() => { setOpen({ [prevItem.id]: true }); setActiveId(prevItem.id); document.getElementById(prevItem.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }}>← {prevItem.title}</button>}
                      {nextItem && <button type="button" className="lh-nav-btn" onClick={() => { setOpen({ [nextItem.id]: true }); setActiveId(nextItem.id); document.getElementById(nextItem.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }}>{nextItem.title} →</button>}
                    </div>
                  </div>
                </div>
              )}
            </article>
          )
        })}
      </div>
      {filtered.length === 0 && <div className="lh-empty">No lessons match “{query}” in this topic.</div>}

      {/* Related topics in library */}
      {lib.topics && lib.topics.length > 1 && (
        <section className="lh-section">
          <div className="lh-section-head"><h2>🔗 More {lib.title} topics</h2></div>
          <div className="lh-name-cloud">
            {lib.topics.filter(t => t.id !== topic.id).map(t => (
              <Link className="lh-chip" to={`/learn/${lib.id}/${t.id}`} key={t.id} style={{ '--c-c': t.color || accent }}>{t.icon} {t.title} <small>{topicItems(t).length}</small></Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
