import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import './StudyByDoingResources.css'
import { useLang } from '../i18n'

// The full 697-resource guide lives in /public so it is served same-origin.
// Instead of framing it, we fetch it once, parse it into structured data and
// render it natively — that keeps the page filterable, navigable and styled
// like the rest of the app. The raw file stays available via "Open full guide".
const GUIDE_URL = '/trading-guides/StudyByDoing_Resources.html'

/* ── parsing helpers ──────────────────────────────────────────────── */

const cellText = td => (td?.textContent || '').replace(/\s+/g, ' ').trim()

const cellLinks = td =>
  Array.from(td?.querySelectorAll('a[href]') || []).map(a => ({
    href: a.getAttribute('href') || '',
    label: (a.textContent || '').replace(/\s+/g, ' ').trim(),
  }))

const prettyUrl = href =>
  href
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/$/, '')

// "A. AI / MACHINE LEARNING (…)" → { letter: "A", short: "AI / MACHINE LEARNING (…)" }
function splitLetter(title) {
  const m = title.match(/^([A-Z]{1,3}\d*)\.\s+(.*)$/)
  if (m) return { letter: m[1], short: m[2] }
  return { letter: '•', short: title }
}

function dataRow(row, extra = {}) {
  const tds = row.querySelectorAll('td')
  if (tds.length < 4) return null
  return {
    num: cellText(tds[0]),
    name: cellText(tds[1]),
    links: cellLinks(tds[2]),
    free: cellText(tds[3]),
    desc: tds[4] ? cellText(tds[4]) : '',
    ...extra,
  }
}

function buildSections(rows) {
  const out = []
  let current = null
  rows.forEach(row => {
    const tds = row.querySelectorAll('td')
    if (row.classList.contains('cat')) {
      current = { title: cellText(tds[0]), rows: [] }
      out.push(current)
      return
    }
    const parsed = dataRow(row)
    if (!parsed) return
    if (!current) {
      current = { title: 'More resources', rows: [] }
      out.push(current)
    }
    current.rows.push(parsed)
  })
  // Keep every category row — including the two group headers (ZZ, AAA)
  // that only introduce the sub-sections which follow them.
  let groupId = null
  return out.map((s, i) => {
    const { letter, short } = splitLetter(s.title)
    const isGroup = s.rows.length === 0
    const item = { ...s, letter, short, id: `sbdr-sec-${i}`, isGroup, groupOf: null }
    if (isGroup) groupId = item.id
    else item.groupOf = groupId
    return item
  })
}

// Read the guide document in order and split it into: intro copy, the
// HIGHLY-NOTED top-20 block, the 62 topic sections, the 23-stage study
// system and the closing notes.
function parseGuide(html) {
  const doc = new DOMParser().parseFromString(html, 'text/html')
  const intro = []
  const tail = []
  let top20 = { title: 'HIGHLY NOTED — START HERE', note: '', rows: [] }
  let sections = []
  let stages = { title: 'How to build your own end-to-end study system', rows: [] }
  let pendingHeading = ''
  let pendingNote = ''
  let tablesSeen = 0

  Array.from(doc.body.children).forEach(el => {
    const tag = el.tagName.toLowerCase()

    if (tag === 'table') {
      const rows = Array.from(el.querySelectorAll('tr'))
      const firstHeader = rows.find(r => r.querySelector('th'))
      const header = cellText(firstHeader?.querySelector('th'))
      const catCount = rows.filter(r => r.classList.contains('cat')).length

      if (header === 'Rank') {
        // Top-20 table: header row + a "START WITH THESE 20" banner + 20 rows.
        top20.title = pendingHeading || top20.title
        top20.note = pendingNote
        top20.rows = rows
          .filter(r => !r.classList.contains('cat'))
          .map(r => dataRow(r))
          .filter(Boolean)
      } else if (catCount >= 2) {
        // Main table: 62 category rows separating all 697 resources.
        sections = buildSections(rows)
      } else {
        // The 3-column study-system table (stage | what to do | resources).
        stages.title = pendingHeading || stages.title
        stages.rows = rows
          .filter(r => !r.classList.contains('cat'))
          .map(r => {
            const tds = r.querySelectorAll('td')
            if (tds.length < 3) return null
            const step = cellText(tds[0])
            const m = step.match(/^(\d+)\.\s*(.*)$/)
            return {
              num: m ? m[1] : step,
              title: m ? m[2] : step,
              body: cellText(tds[1]),
              resources: cellText(tds[2]),
            }
          })
          .filter(Boolean)
      }

      pendingHeading = ''
      pendingNote = ''
      tablesSeen += 1
      return
    }

    if (tag === 'h2') {
      pendingHeading = cellText(el)
      return
    }

    if (tag === 'p') {
      const text = cellText(el)
      if (!text) return
      if (pendingHeading) pendingNote = text
      else if (tablesSeen === 0) intro.push(text)
      else tail.push(text)
    }
  })

  return { intro, top20, sections, stages, tail }
}

/* ── small view pieces ────────────────────────────────────────────── */

function FreeBadge({ free }) {
  const v = (free || '').toLowerCase()
  if (v.startsWith('y')) return <span className="sbdr-free sbdr-free-yes">Free</span>
  if (v.startsWith('p')) return <span className="sbdr-free sbdr-free-part">Part free</span>
  if (v.startsWith('n')) return <span className="sbdr-free sbdr-free-no">Paid</span>
  return null
}

function ResourceRow({ row }) {
  const primary = row.links[0]
  const extra = row.links.slice(1)
  return (
    <article className="sbdr-row">
      {row.num && <span className="sbdr-row-num">{row.num}</span>}
      <div className="sbdr-row-body">
        <div className="sbdr-row-title">
          {primary ? (
            <a
              className="sbdr-row-name"
              href={primary.href}
              target="_blank"
              rel="noreferrer"
            >
              {row.name}
            </a>
          ) : (
            <span className="sbdr-row-name">{row.name}</span>
          )}
          <FreeBadge free={row.free} />
        </div>
        {row.desc && <p className="sbdr-row-desc">{row.desc}</p>}
        {extra.length > 0 && (
          <div className="sbdr-row-links">
            {extra.map(l => (
              <a key={l.href} href={l.href} target="_blank" rel="noreferrer">
                {prettyUrl(l.href)} ↗
              </a>
            ))}
          </div>
        )}
      </div>
    </article>
  )
}

/* ── page ─────────────────────────────────────────────────────────── */

export default function StudyByDoingResources() {
  const { t } = useLang()
  const [status, setStatus] = useState('loading') // loading | ready | failed
  const [guide, setGuide] = useState(null)
  const [filter, setFilter] = useState('')
  const [active, setActive] = useState('')
  const [showTop, setShowTop] = useState(false)
  const sideNavRef = useRef(null)

  useEffect(() => {
    let alive = true
    fetch(GUIDE_URL)
      .then(r => (r.ok ? r.text() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then(html => {
        if (!alive) return
        const parsed = parseGuide(html)
        if (!parsed.sections.length) throw new Error('no sections parsed')
        setGuide(parsed)
        setStatus('ready')
      })
      .catch(() => alive && setStatus('failed'))
    return () => {
      alive = false
    }
  }, [])

  const q = filter.trim().toLowerCase()

  const matches = row =>
    row.name.toLowerCase().includes(q) ||
    row.desc.toLowerCase().includes(q) ||
    row.links.some(l => l.href.toLowerCase().includes(q))

  // Everything is rendered by default; the filter only narrows the view.
  const view = useMemo(() => {
    if (!guide) return null
    const top20Rows = q
      ? guide.top20.rows.filter(
          r => matches(r) || guide.top20.title.toLowerCase().includes(q)
        )
      : guide.top20.rows
    // A hit on a group heading keeps all of its sub-sections intact.
    const hitIds = new Set(
      q ? guide.sections.filter(s => s.title.toLowerCase().includes(q)).map(s => s.id) : []
    )
    const filtered = guide.sections.map(s => {
      const keepAll = !q || hitIds.has(s.id) || (s.groupOf && hitIds.has(s.groupOf))
      return { ...s, rows: keepAll ? s.rows : s.rows.filter(matches) }
    })
    const memberCount = {}
    filtered.forEach(s => {
      if (!s.isGroup && s.rows.length > 0 && s.groupOf) {
        memberCount[s.groupOf] = (memberCount[s.groupOf] || 0) + 1
      }
    })
    const sections = filtered
      .map(s => (s.isGroup ? { ...s, memberSections: memberCount[s.id] || 0 } : s))
      .filter(s => (s.isGroup ? s.memberSections > 0 : s.rows.length > 0))
    const stages = q
      ? guide.stages.rows.filter(
          r =>
            r.title.toLowerCase().includes(q) ||
            r.body.toLowerCase().includes(q) ||
            r.resources.toLowerCase().includes(q)
        )
      : guide.stages.rows
    const intro = q ? [] : guide.intro
    const tail = q ? [] : guide.tail
    return { top20Rows, sections, stages, intro, tail }
  }, [guide, q])

  const stats = useMemo(() => {
    if (!guide) return { resources: 697, sections: 63, top: 20, stages: 23 }
    return {
      resources: guide.sections.reduce((n, s) => n + s.rows.length, 0),
      sections: guide.sections.length + 1, // + the Top-20 block
      top: guide.top20.rows.length,
      stages: guide.stages.rows.length,
    }
  }, [guide])

  const matchCount = useMemo(() => {
    if (!q || !view) return 0
    return (
      view.top20Rows.length +
      view.sections.reduce((n, s) => n + s.rows.length, 0) +
      view.stages.length
    )
  }, [q, view])

  // Scroll spy: mark the section whose heading last crossed the top offset.
  useEffect(() => {
    if (status !== 'ready') return undefined
    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        let current = ''
        document.querySelectorAll('[data-sbdr-section]').forEach(el => {
          if (el.getBoundingClientRect().top <= 130) current = el.id
        })
        setActive(current)
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [status, q])

  // Keep the highlighted sidebar item in view without moving the page.
  useEffect(() => {
    const box = sideNavRef.current
    if (!box || !active) return
    const btn = box.querySelector(`[data-nav="${active}"]`)
    if (!btn) return
    if (btn.offsetTop < box.scrollTop) box.scrollTop = Math.max(0, btn.offsetTop - 8)
    else if (btn.offsetTop + btn.offsetHeight > box.scrollTop + box.clientHeight) {
      box.scrollTop = btn.offsetTop - box.clientHeight + btn.offsetHeight + 8
    }
  }, [active, q])

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 700)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const jump = id => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const navItems = view
    ? [
        {
          id: 'sbdr-top20',
          letter: '20',
          short: t('Start with these 20'),
          count: view.top20Rows.length,
          hot: true,
        },
        ...view.sections.map(s => ({
          id: s.id,
          letter: s.letter,
          short: s.short,
          count: s.isGroup ? s.memberSections : s.rows.length,
          group: s.isGroup,
          member: Boolean(s.groupOf),
        })),
        {
          id: 'sbdr-system',
          letter: '23',
          short: t('Study system'),
          count: view.stages.length,
        },
      ]
    : []

  return (
    <div className="sbdr">
      <Link to="/" className="sbdr-back">
        ← {t('Home')}
      </Link>

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <header className="sbdr-hero">
        <div className="sbdr-hero-glow sbdr-glow-a" aria-hidden="true" />
        <div className="sbdr-hero-glow sbdr-glow-b" aria-hidden="true" />
        <div className="sbdr-hero-inner">
          <span className="sbdr-kicker">
            <span className="sbdr-kicker-dot" />
            {t('COMPLETE RESOURCE LIST')}
          </span>
          <h1>
            Learn By Doing —{' '}
            <span className="sbdr-hero-accent">{t('697 Curated Resources')}</span>
          </h1>
          <p>
            Theory + code + projects + problem solutions — the complete companion list to the
            Study by Doing curriculum. Top-20 must-do resources, 50+ topic sections (AI/ML,
            agents, RAG, MCP, web, DevOps, trading AI, graphics, quantum, chips, IoT, AGI),
            country-by-country free master&apos;s &amp; certificate programmes, and a 23-stage
            study system.
          </p>
          <div className="sbdr-stats">
            <div className="sbdr-stat">
              <strong>{stats.resources}</strong>
              <span>{t('resources')}</span>
            </div>
            <span className="sbdr-stat-div" />
            <div className="sbdr-stat">
              <strong>{stats.sections}</strong>
              <span>{t('sections')}</span>
            </div>
            <span className="sbdr-stat-div" />
            <div className="sbdr-stat">
              <strong>{stats.top}</strong>
              <span>{t('highly noted')}</span>
            </div>
            <span className="sbdr-stat-div" />
            <div className="sbdr-stat">
              <strong>{stats.stages}</strong>
              <span>{t('study stages')}</span>
            </div>
          </div>
          <div className="sbdr-hero-actions">
            <a
              className="sbdr-btn sbdr-btn-primary"
              href={GUIDE_URL}
              target="_blank"
              rel="noreferrer"
            >
              {t('Open full guide')} ↗
            </a>
            <button
              type="button"
              className="sbdr-btn sbdr-btn-ghost"
              onClick={() => jump('sbdr-top20')}
            >
              {t('Top 20 first')} ↓
            </button>
          </div>
        </div>
      </header>

      {status === 'loading' && (
        <div className="sbdr-loading" role="status">
          <span className="sbdr-spinner" />
          {t('Loading the complete resource list…')}
        </div>
      )}

      {status === 'failed' && (
        <div className="sbdr-error" role="alert">
          <strong>{t('The guide could not be loaded.')}</strong>
          <p>{t('Open it directly to continue reading.')}</p>
          <a
            href={GUIDE_URL}
            target="_blank"
            rel="noreferrer"
            className="sbdr-btn sbdr-btn-primary"
          >
            {t('Open full guide')} ↗
          </a>
        </div>
      )}

      {status === 'ready' && view && (
        <div className="sbdr-layout">
          {/* ── Sticky section navigator ───────────────────────────── */}
          <aside className="sbdr-side">
            <div className="sbdr-side-head">
              <h2>{t('Jump to a section')}</h2>
              <span className="sbdr-side-count">
                {navItems.length} {t('sections')}
              </span>
            </div>
            <input
              className="sbdr-side-search"
              type="search"
              placeholder={t('Filter sections or resources…')}
              value={filter}
              onChange={e => setFilter(e.target.value)}
            />
            {q && (
              <div className="sbdr-side-hits">
                {matchCount} {t('matches')}
                <button type="button" onClick={() => setFilter('')}>
                  {t('Clear')}
                </button>
              </div>
            )}
            <nav className="sbdr-side-nav" ref={sideNavRef}>
              {navItems.map(item => (
                <button
                  key={item.id}
                  type="button"
                  data-nav={item.id}
                  className={`sbdr-side-item ${active === item.id ? 'is-active' : ''} ${
                    item.group ? 'is-group' : ''
                  } ${item.member ? 'is-member' : ''}`}
                  onClick={() => jump(item.id)}
                  title={item.short}
                >
                  <span className={`sbdr-side-letter ${item.hot ? 'is-hot' : ''}`}>
                    {item.letter}
                  </span>
                  <span className="sbdr-side-label">{item.short}</span>
                  <span className="sbdr-side-n">{item.count}</span>
                </button>
              ))}
              {navItems.length === 0 && (
                <p className="sbdr-side-empty">{t('Nothing matches that filter.')}</p>
              )}
            </nav>
          </aside>

          {/* ── Full content ───────────────────────────────────────── */}
          <main className="sbdr-main">
            {view.intro.length > 0 && (
              <section className="sbdr-intro">
                {view.intro.map((text, i) => (
                  <p key={i}>{text}</p>
                ))}
              </section>
            )}

            {/* Top 20 */}
            {view.top20Rows.length > 0 && (
              <section id="sbdr-top20" className="sbdr-block is-hot" data-sbdr-section>
                <header className="sbdr-block-head">
                  <span className="sbdr-block-badge is-hot">20</span>
                  <div className="sbdr-block-titles">
                    <h2>{guide.top20.title}</h2>
                    {guide.top20.note && <p>{guide.top20.note}</p>}
                  </div>
                </header>
                <div className="sbdr-t20-grid">
                  {view.top20Rows.map((r, i) => (
                    <article className="sbdr-t20" key={`${r.name}-${i}`}>
                      <span className="sbdr-t20-rank">{r.num || i + 1}</span>
                      <div className="sbdr-t20-body">
                        <div className="sbdr-row-title">
                          {r.links[0] ? (
                            <a
                              className="sbdr-row-name"
                              href={r.links[0].href}
                              target="_blank"
                              rel="noreferrer"
                            >
                              {r.name}
                            </a>
                          ) : (
                            <span className="sbdr-row-name">{r.name}</span>
                          )}
                          <FreeBadge free={r.free} />
                        </div>
                        <p className="sbdr-row-desc">{r.desc}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {/* All topic sections */}
            {view.sections.map(s =>
              s.isGroup ? (
                <section
                  id={s.id}
                  className="sbdr-block sbdr-group"
                  data-sbdr-section
                  key={s.id}
                >
                  <header className="sbdr-block-head">
                    <span className="sbdr-block-badge is-group">{s.letter}</span>
                    <div className="sbdr-block-titles" title={s.title}>
                      <h2>{s.short}</h2>
                    </div>
                    <span className="sbdr-block-count">
                      {s.memberSections} {t('sub-sections')}
                    </span>
                  </header>
                </section>
              ) : (
                <section
                  id={s.id}
                  className={`sbdr-block ${s.groupOf ? 'is-member' : ''}`}
                  data-sbdr-section
                  key={s.id}
                >
                  <header className="sbdr-block-head">
                    <span className="sbdr-block-badge">{s.letter}</span>
                    <div className="sbdr-block-titles" title={s.title}>
                      <h2>{s.short}</h2>
                    </div>
                    <span className="sbdr-block-count">
                      {s.rows.length} {t('resources')}
                    </span>
                  </header>
                  <div className="sbdr-rows">
                    {s.rows.map((r, i) => (
                      <ResourceRow row={r} key={`${s.id}-${i}`} />
                    ))}
                  </div>
                </section>
              )
            )}

            {/* 23-stage study system */}
            {view.stages.length > 0 && (
              <section id="sbdr-system" className="sbdr-block" data-sbdr-section>
                <header className="sbdr-block-head">
                  <span className="sbdr-block-badge is-dark">23</span>
                  <div className="sbdr-block-titles">
                    <h2>{guide.stages.title}</h2>
                  </div>
                  <span className="sbdr-block-count">
                    {view.stages.length} {t('stages')}
                  </span>
                </header>
                <div className="sbdr-stages">
                  {view.stages.map((st, i) => (
                    <article className="sbdr-stage" key={`${st.num}-${i}`}>
                      <span className="sbdr-stage-num">{st.num}</span>
                      <div className="sbdr-stage-body">
                        <h3>{st.title}</h3>
                        <p>{st.body}</p>
                        {st.resources && (
                          <div className="sbdr-stage-res">
                            {st.resources.split(',').map((r, j) => (
                              <span key={j}>{r.trim()}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {view.tail.length > 0 && (
              <footer className="sbdr-foot">
                {view.tail.map((text, i) => (
                  <p key={i}>{text}</p>
                ))}
                <a
                  className="sbdr-btn sbdr-btn-ghost"
                  href={GUIDE_URL}
                  target="_blank"
                  rel="noreferrer"
                >
                  {t('Open full guide')} ↗
                </a>
              </footer>
            )}

            {q && matchCount === 0 && (
              <div className="sbdr-empty">
                <p>{t('No resources match that filter.')}</p>
                <button type="button" className="sbdr-btn" onClick={() => setFilter('')}>
                  {t('Clear filter')}
                </button>
              </div>
            )}
          </main>
        </div>
      )}

      {showTop && (
        <button
          type="button"
          className="sbdr-top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label={t('Back to top')}
        >
          ↑
        </button>
      )}
    </div>
  )
}
