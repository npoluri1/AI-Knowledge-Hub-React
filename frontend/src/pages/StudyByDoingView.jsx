import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  SBD_ORIGIN,
  SBD_SECTIONS,
  SBD_LOOSE_LINKS,
  SBD_TOTAL_PAGES,
  SBD_TOTAL_LESSONS,
} from '../data/studyByDoingData'
import './StudyByDoingView.css'
import { useLang } from '../i18n'

const lessonPath = slug => `/study-by-doing/${slug}`

const TOTAL_SECTIONS = SBD_SECTIONS.length

export default function StudyByDoingView() {
  const { t } = useLang()
  const [query, setQuery] = useState('')
  const [activeSection, setActiveSection] = useState(SBD_SECTIONS[0]?.id ?? '')
  const [railOpen, setRailOpen] = useState(false)
  const sectionRefs = useRef({})

  const q = query.trim().toLowerCase()

  // Filter lessons by the search box; sections with no surviving lesson drop out.
  const filtered = useMemo(() => {
    if (!q) return SBD_SECTIONS
    return SBD_SECTIONS
      .map(section => {
        const sectionMatches = section.title.toLowerCase().includes(q)
        const lessons = section.lessons.filter(
          l => sectionMatches || l.title.toLowerCase().includes(q) || l.slug.includes(q) || l.n.toLowerCase() === q
        )
        return { ...section, lessons }
      })
      .filter(section => section.lessons.length > 0)
  }, [q])

  const matchCount = useMemo(
    () => filtered.reduce((total, section) => total + section.lessons.length, 0),
    [filtered]
  )

  // Scroll spy: highlight the section currently in view in the left rail.
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
        if (visible) setActiveSection(visible.target.id)
      },
      { rootMargin: '-120px 0px -70% 0px', threshold: 0 }
    )
    Object.values(sectionRefs.current).forEach(node => node && observer.observe(node))
    return () => observer.disconnect()
  }, [filtered])

  const jumpTo = id => {
    setRailOpen(false)
    const node = sectionRefs.current[id]
    if (!node) return
    const top = node.getBoundingClientRect().top + window.scrollY - 96
    window.scrollTo({ top, behavior: 'smooth' })
  }

  return (
    <div className="sbd">
      <Link to="/study-by-doing" className="back-link">← {t('Back to Course Map')}</Link>

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <header className="sbd-hero">
        <div className="sbd-hero-glow sbd-glow-a" aria-hidden="true" />
        <div className="sbd-hero-glow sbd-glow-b" aria-hidden="true" />
        <div className="sbd-hero-inner">
          <span className="sbd-kicker">
            <span className="sbd-kicker-dot" />
            {t('FREE HANDS-ON CURRICULUM')}
          </span>
          <h1>
            AI Engineering — <span className="sbd-hero-accent">Zero to Production</span>
          </h1>
          <p>
            The complete course map: Python, data structures &amp; algorithms, system design, RAG,
            agents, evaluation and deployment. Every lesson below is numbered and grouped exactly
            like the course sidebar, so you can work the curriculum in order and jump straight to
            any lesson on the source site.
          </p>

          <div className="sbd-stats">
            <div className="sbd-stat">
              <strong>{TOTAL_SECTIONS}</strong>
              <span>{t('sections')}</span>
            </div>
            <span className="sbd-stat-div" />
            <div className="sbd-stat">
              <strong>{SBD_TOTAL_LESSONS}</strong>
              <span>{t('lessons')}</span>
            </div>
            <span className="sbd-stat-div" />
            <div className="sbd-stat">
              <strong>{SBD_TOTAL_PAGES}</strong>
              <span>{t('pages in sitemap')}</span>
            </div>
            <span className="sbd-stat-div" />
            <div className="sbd-stat">
              <strong>100%</strong>
              <span>{t('free & open access')}</span>
            </div>
          </div>

          <div className="sbd-hero-actions">
            <a className="sbd-btn sbd-btn-primary" href={SBD_ORIGIN} target="_blank" rel="noreferrer">
              {t('Open the course')} ↗
            </a>
            <button type="button" className="sbd-btn sbd-btn-ghost" onClick={() => jumpTo(filtered[0]?.id)}>
              {t('Browse all lessons')} ↓
            </button>
          </div>
        </div>
      </header>

      {/* ── Quick links that sit above the numbered groups ────────── */}
      {SBD_LOOSE_LINKS.length > 0 && (
        <nav className="sbd-quicklinks" aria-label="Course quick links">
          {SBD_LOOSE_LINKS.map(link => (
            <Link key={link.slug} to={lessonPath(link.slug)}>
              <span className="sbd-quick-n">{link.n}</span>
              {link.title}
            </Link>
          ))}
        </nav>
      )}

      {/* ── Search + section rail ─────────────────────────────────── */}
      <div className="sbd-toolbar">
        <div className="sbd-search">
          <span aria-hidden="true">🔍</span>
          <input
            type="search"
            value={query}
            onChange={event => setQuery(event.target.value)}
            placeholder={`Search ${SBD_TOTAL_LESSONS} lessons — try "rag", "docker", "P4", "evals"…`}
            aria-label="Search lessons"
          />
          {query && (
            <button type="button" onClick={() => setQuery('')} aria-label="Clear search">✕</button>
          )}
        </div>
        <div className="sbd-result">
          {q ? (
            <>
              <strong>{matchCount}</strong> of {SBD_TOTAL_LESSONS} lessons match “{query}”
            </>
          ) : (
            <>
              Showing every section · <strong>{TOTAL_SECTIONS}</strong> groups
            </>
          )}
        </div>
        <button type="button" className="sbd-rail-toggle" onClick={() => setRailOpen(open => !open)} aria-expanded={railOpen}>
          ☰ {t('All sections')}
        </button>
      </div>

      <div className="sbd-body">
        {/* Left rail = the course's own menu, in order */}
        <aside className={`sbd-rail ${railOpen ? 'open' : ''}`} aria-label="Course sections">
          <div className="sbd-rail-head">
            <strong>{t('Course menu')}</strong>
            <span>{TOTAL_SECTIONS} {t('sections')}</span>
          </div>
          <nav className="sbd-rail-list">
            {SBD_SECTIONS.map(section => (
              <button
                key={section.id}
                type="button"
                className={`sbd-rail-item ${activeSection === section.id ? 'active' : ''}`}
                onClick={() => jumpTo(section.id)}
              >
                <span className="sbd-rail-icon">{section.icon}</span>
                <span className="sbd-rail-title">{section.title}</span>
                <span className="sbd-rail-count">{section.lessons.length}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Sections */}
        <div className="sbd-main">
          {filtered.length === 0 && (
            <p className="sbd-empty">
              No lessons match “{query}”. <button type="button" onClick={() => setQuery('')}>{t('Clear search')}</button>
            </p>
          )}

          {filtered.map((section, index) => (
            <section
              key={section.id}
              id={section.id}
              className="sbd-section"
              ref={node => { sectionRefs.current[section.id] = node }}
            >
              <div className="sbd-section-head">
                <span className="sbd-section-index">{String(index + 1).padStart(2, '0')}</span>
                <span className="sbd-section-icon">{section.icon}</span>
                <div className="sbd-section-text">
                  <h2>{section.title}</h2>
                  <span>{section.lessons.length} lessons in this section</span>
                </div>
                <Link
                  className="sbd-section-open"
                  to={lessonPath(section.lessons[0].slug)}
                >
                  {t('Start section')} →
                </Link>
              </div>

              <ul className="sbd-lessons">
                {section.lessons.map(lesson => (
                  <li key={lesson.slug}>
                    <Link to={lessonPath(lesson.slug)}>
                      <span className="sbd-lesson-n">{lesson.n}</span>
                      <span className="sbd-lesson-body">
                        <span className="sbd-lesson-title">{lesson.title}</span>
                        <code className="sbd-lesson-slug">/{lesson.slug}</code>
                      </span>
                      <span className="sbd-lesson-go" aria-hidden="true">→</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>

      <footer className="sbd-foot">
        <div>
          <strong>{t('Complete course reader')}</strong> — choose any lesson to load the full source page
          inside this application, or open the original when you need the source site's browser tools.
        </div>
        <a href={SBD_ORIGIN} target="_blank" rel="noreferrer">ai.studybydoing.in ↗</a>
      </footer>
    </div>
  )
}
