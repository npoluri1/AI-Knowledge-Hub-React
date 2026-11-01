import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  LEARN_LIBRARIES,
  LEARN_TOTAL_ITEMS,
  LEARN_TOTAL_TOPICS,
  buildLearnSearchIndex,
} from '../data/learnHub'
import { useLang } from '../i18n'
import './LearnHub.css'

const KIND_LABEL = {
  concept: 'concepts',
  article: 'articles',
  quiz: 'quizzes',
  tests: 'questions',
  calculators: 'tools',
  blog: 'posts',
}

export default function LearnHub() {
  const { t } = useLang()
  const [query, setQuery] = useState('')
  const index = useMemo(() => buildLearnSearchIndex(), [])

  const q = query.trim().toLowerCase()
  const results = useMemo(() => {
    if (q.length < 2) return []
    return index.filter(e => e.hay.toLowerCase().includes(q)).slice(0, 60)
  }, [index, q])

  return (
    <div className="lh-page">
      <section className="lh-hero">
        <div className="lh-kicker">{t('AI Prep · Learning Hub')}</div>
        <h1>{t('Learn AI engineering, one library at a time')}</h1>
        <p>
          {t('Concept libraries, system design articles, Python quizzes, timed interview tests and ML calculators — all in one place.')}
        </p>
        <div className="lh-stats">
          <div className="lh-stat"><strong>{LEARN_LIBRARIES.length}</strong><span>{t('Libraries')}</span></div>
          <div className="lh-stat"><strong>{LEARN_TOTAL_TOPICS.toLocaleString()}</strong><span>{t('Topics')}</span></div>
          <div className="lh-stat"><strong>{LEARN_TOTAL_ITEMS.toLocaleString()}</strong><span>{t('Lessons & questions')}</span></div>
        </div>
        <div className="lh-toolbar">
          <input
            type="search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={t('Search every library — e.g. attention, RAG, CUDA, qubit…')}
            aria-label={t('Search the learning hub')}
          />
          {query && <button type="button" className="lh-clear" onClick={() => setQuery('')}>✕</button>}
        </div>
      </section>

      {q.length >= 2 && (
        <section className="lh-section">
          <div className="lh-result-line">
            <strong>{results.length}{results.length === 60 ? '+' : ''}</strong> {t('matches for')} “{query}”
          </div>
          {results.length === 0 ? (
            <div className="lh-empty">{t('No matches. Try a broader term.')}</div>
          ) : (
            <div className="lh-tech-strip">
              {results.map((r, i) => (
                <Link key={`${r.to}-${i}`} to={r.to} className="lh-tech" title={r.sub}>
                  {r.icon} {r.label} <span className="lh-lib-meta">· {r.type}</span>
                </Link>
              ))}
            </div>
          )}
        </section>
      )}

      <section className="lh-section">
        <div className="lh-section-head">
          <h2>{t('Libraries')}</h2>
          <p>{t('Pick a library to browse its topics.')}</p>
        </div>
        <div className="lh-lib-grid">
          {LEARN_LIBRARIES.map(lib => (
            <Link
              key={lib.id}
              to={lib.route}
              className="lh-lib-card"
              style={{ '--l-color': lib.color }}
            >
              <div className="lh-lib-top">
                <span className="lh-lib-icon">{lib.icon}</span>
                <span className="lh-lib-meta">
                  {lib.topicCount} {t('topics')} · {lib.itemCount.toLocaleString()} {t(KIND_LABEL[lib.kind] || 'items')}
                </span>
              </div>
              <div className="lh-lib-body">
                <h3>{t(lib.title)}</h3>
                <p>{t(lib.desc)}</p>
                <span className="lh-lib-cta">{t('Open library →')}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
