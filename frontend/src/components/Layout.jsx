import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import ChatWidget from './ChatWidget'
import RouteExperienceBanner from './RouteExperienceBanner'
import LatestPulse from './LatestPulse'
import IconPhotos from './IconPhotos'
import { LANGUAGES, useLang } from '../i18n'
import { CHAPTERS, DEEP_DIVES } from '../data/appData'
import BOOKS from '../data/booksData'
import { LINKEDIN_POSTS } from '../data/linkedinPostsCollection'
import './NexusNav.css'
import { menuImage, menuTagline } from '../data/menuVisuals'

const CHAPTER_GROUPS = [
  {
    label: 'Models & Inference',
    ids: ['llm-models', 'fine-tuning-local'],
  },
  {
    label: 'Core AI Systems',
    ids: ['rag-pipeline', 'vector-databases', 'ai-agents', 'prompt-engineering'],
  },
  {
    label: 'Development Stack',
    ids: ['python-for-ai', 'fastapi-ai-services', 'langchain-llamaindex', 'react-ai-frontend'],
  },
  {
    label: 'Emerging & Future Tech',
    ids: ['quantum-computing', 'robotics-ai', 'ai-semiconductor'],
  },
  {
    label: 'Enterprise & Governance',
    ids: ['system-design', 'grc-compliance', 'observability-evals', 'security-guardrails', 'enterprise-integration'],
  },
  {
    label: 'Tools & Resources',
    ids: ['tools-catalog', 'project-ideas', 'career-resources', 'ai-news-market'],
  },
  {
    label: 'Projects & Architecture',
    ids: ['comprehensive-guide', 'e2e-project', 'ai-agent-architecture'],
  },
]

// Chapter + deep-dive groups, shaped like primary menu groups so the sidebar
// renders (and filters) every section with one code path.
function buildSidebarCategories(chapters, deepDives) {
  const chapterMap = Object.fromEntries(chapters.map(c => [c.id, c]))
  const groups = CHAPTER_GROUPS.map(g => ({
    label: g.label,
    items: g.ids
      .filter(id => chapterMap[id])
      .map(id => ({ to: `/chapter/${id}`, key: chapterMap[id].title, icon: chapterMap[id].icon, exact: true })),
  }))
  groups.unshift({
    label: '📖 All Chapters',
    items: [{ to: '/chapter/comprehensive-guide', key: 'Reference Guide — All Tables', icon: '📚', exact: true, paren: String(chapters.length) }],
  })
  if (deepDives.length > 0) {
    groups.push({
      label: 'Deep Dives',
      items: deepDives.map(dd => ({ to: `/deep-dive/${dd.id}`, key: dd.title, icon: dd.icon, exact: true })),
    })
  }
  return groups.filter(g => g.items.length)
}

// Primary sidebar menu — labels flow through the app-wide language layer, so
// switching the interface language re-labels every menu automatically.
export const MENU = [
  { to: '/', icon: '🏠', key: 'Home', exact: true },
  { to: '/images', icon: '🖼️', key: 'Images Gallery', exact: true },
  { to: '/files', icon: '📂', key: 'File Reference', exact: true },
  { to: '/knowledge', icon: '📐', key: 'Knowledge Base', exact: true },
  { to: '/jobs', icon: '💼', key: 'AI Jobs', exact: true, paren: '996' },
  { to: '/edureka', icon: '📚', key: 'Edureka AI Docs', exact: true },
  { to: '/ai-news', icon: '📡', key: 'AI News Dashboard', exact: true },
  { to: '/live-news', icon: '🔴', key: 'Live News Fetcher', exact: true },
  { to: '/ai-tools', icon: '🤖', key: 'AI Tools Catalog', exact: true },
  { to: '/github-repos', icon: '📦', key: 'GitHub Repos', exact: true },
  { to: '/tools', icon: '🛠️', key: 'delphitools', exact: true },
  { to: '/open-alternatives', icon: '🔓', key: 'Open Alternatives', exact: true },
  { to: '/integrations', icon: '🔌', key: 'Integrations', exact: true },
  { to: '/books', icon: '📚', key: 'Book Catalog', exact: true, paren: () => `(${BOOKS.length.toLocaleString()})` },
  { to: '/playbook', icon: '📖', key: 'AI Engineering Playbook', paren: '(70)' },
  { to: '/rapid-fire', icon: '⚡', key: 'Rapid Fire Playbook' },
  { to: '/ai-stack', icon: '🧠', key: 'AI Stack', paren: '(68)' },
  { to: '/claude-cert', icon: '📜', key: 'Claude Certification' },
  { to: '/snowflake', icon: '❄️', key: 'Snowflake Guide' },
  { to: '/etl-guide', icon: '📊', key: 'ETL & Data Eng Guide' },
  { to: '/ai-jobs-global', icon: '🌍', key: 'AI Jobs Global', paren: '(2,585+)' },
  { to: '/projects', icon: '🗂️', key: 'All Projects' },
  { to: '/linked-posts', icon: '🔗', key: 'AI LinkedIn Posts', paren: () => `(${LINKEDIN_POSTS.length})` },
  { to: '/video-hub', icon: '🎬', key: 'AI Video Hub', paren: '(YouTube · IG · TikTok · FB)' },
  { to: '/design-space', icon: '🏗️', key: 'AI Design Space', paren: '(1,258)' },
  { to: '/learn', icon: '🎓', key: 'AI Prep · Learning Hub', paren: '(1,200+)' },
  { to: '/python-masterhub', icon: '🐍', key: 'Python MasterHub', paren: '(885)' },
  { to: '/ai-techstack-ref', icon: '🏗️', key: 'AI TechStack Reference' },
  { to: '/reference-library', icon: '📖', key: 'Reference Library' },
  { to: '/ai-tech-blogs', icon: '🌐', key: 'AI Blogs & Market Demand' },
  { to: '/ai-python-masterhub-pages', icon: '📘', key: 'AI-Python HTML Guides', paren: '(43)' },
  { to: '/ai-chatbots', icon: '🤖', key: 'AI Chatbots Global', paren: '(1,100+)' },
  { to: '/ai-agents', icon: '🧠', key: 'AI Agents Global', paren: '(375,000+)' },
  { to: '/communication-channels', icon: '📡', key: 'Communication Channels', paren: '(120+)' },
  { to: '/technologies', icon: '📚', key: 'Technologies & Tutorials', paren: '(1000+)' },
  { to: '/python-tutorials', icon: '🐍', key: 'Python Tutorials', paren: '(56)' },
  { to: '/python-tech-hub', icon: '📦', key: 'Python Tech Hub' },
  { to: '/trading', icon: '📈', key: 'Trading Guides' },
  { to: '/neem-karoli-baba', icon: '🙏', key: 'Neem Karoli Baba Wisdom' },
  { to: '/study-by-doing', icon: '🎯', key: 'Study By Doing — AI Course Map' },
  { to: '/study-by-doing/resources', icon: '🌐', key: 'Study By Doing — 697 Resources' },
  { to: '/europe-settlement', icon: '🇪🇺', key: 'Europe Settlement Blueprint' },
  {
    to: '/mortalapps-hub',
    icon: '📚',
    key: 'MortalApps Hub',
    match: p => p.startsWith('/mortalapps-hub') || p.startsWith('/system-design') || p.startsWith('/python-code') || p.startsWith('/ai-agents-guide') || p.startsWith('/ai-infrastructure') || p.startsWith('/quantum-computing') || p.startsWith('/semiconductors'),
  },
]

// Visual grouping for the primary menu (keeps 45+ links scannable).
export const MENU_GROUPS = [
  { label: 'Overview', paths: ['/', '/images', '/files', '/knowledge', '/edureka'] },
  { label: 'Learn & Guides', paths: ['/learn', '/playbook', '/rapid-fire', '/ai-stack', '/claude-cert', '/snowflake', '/etl-guide', '/python-masterhub', '/python-tutorials', '/python-tech-hub', '/technologies', '/ai-python-masterhub-pages', '/study-by-doing', '/study-by-doing/resources', '/ai-techstack-ref', '/reference-library', '/mortalapps-hub'] },
  { label: 'News & Catalogs', paths: ['/ai-news', '/live-news', '/ai-tools', '/github-repos', '/tools', '/open-alternatives', '/integrations', '/books', '/linked-posts', '/video-hub', '/ai-tech-blogs'] },
  { label: 'Careers & Projects', paths: ['/jobs', '/ai-jobs-global', '/projects'] },
  { label: 'Global Directories', paths: ['/design-space', '/ai-chatbots', '/ai-agents', '/communication-channels'] },
  { label: 'Life & Finance', paths: ['/trading', '/neem-karoli-baba', '/europe-settlement'] },
]

function groupMenu(menu) {
  const byPath = new Map(menu.map(m => [m.to, m]))
  const used = new Set()
  const groups = MENU_GROUPS.map(g => ({
    label: g.label,
    items: g.paths.map(p => byPath.get(p)).filter(Boolean).map(m => { used.add(m.to); return m }),
  }))
  const rest = menu.filter(m => !used.has(m.to))
  if (rest.length) groups.push({ label: 'More', items: rest })
  return groups.filter(g => g.items.length)
}

const cleanParen = v => String(v).replace(/^\(+|\)+$/g, '')

// Each section owns a hue — headers, icon tiles, the active glow bar and the
// jump chips all derive from it, so every menu reads as its own "zone".
export const GROUP_THEME = {
  'Overview': { hue: '#79d9f2', glyph: '◈' },
  'Learn & Guides': { hue: '#c2a5ff', glyph: '✦' },
  'News & Catalogs': { hue: '#f7d47d', glyph: '◉' },
  'Careers & Projects': { hue: '#9be7b4', glyph: '▲' },
  'Global Directories': { hue: '#ffabc3', glyph: '✺' },
  'Life & Finance': { hue: '#75e2d1', glyph: '❖' },
  'More': { hue: '#aebbd5', glyph: '•' },
  'Deep Dives': { hue: '#ff94ad', glyph: '⬢' },
}
const CHAPTER_HUES = ['#8fb3ff', '#7ee0c3', '#ffc58f', '#d9a6ff', '#ff9fb8', '#9fd8ff', '#c6e88f', '#ffd98f']

// Phone bottom tab bar — the four most-used destinations + the full menu.
const DOCK = [
  { to: '/', icon: '🏠', key: 'Home', exact: true },
  { to: '/learn', icon: '🎓', key: 'Learn' },
  { to: '/ai-news', icon: '📡', key: 'News' },
  { to: '/jobs', icon: '💼', key: 'Jobs' },
]

const LS_COLLAPSED = 'nx.collapsedGroups'
const LS_RAIL = 'nx.railPref'
const lsGet = (k, fallback) => { try { const v = localStorage.getItem(k); return v == null ? fallback : JSON.parse(v) } catch { return fallback } }
const lsSet = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)) } catch { /* storage unavailable */ } }

function useMedia(query) {
  const get = () => (typeof window !== 'undefined' && window.matchMedia ? window.matchMedia(query).matches : false)
  const [match, setMatch] = React.useState(get)
  React.useEffect(() => {
    if (!window.matchMedia) return undefined
    const mq = window.matchMedia(query)
    const on = () => setMatch(mq.matches)
    on()
    if (mq.addEventListener) mq.addEventListener('change', on)
    else mq.addListener(on)
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', on)
      else mq.removeListener(on)
    }
  }, [query])
  return match
}

function isActive(item, pathname) {
  if (item.match) return item.match(pathname)
  return item.exact ? pathname === item.to : pathname.startsWith(item.to)
}

export default function Layout({ children }) {
  const loc = useLocation()
  const [menuOpen, setMenuOpen] = React.useState(false)
  const [chapters] = React.useState(CHAPTERS)
  const [deepDives] = React.useState(DEEP_DIVES)
  const { lang, setLang, t } = useLang()
  const [langOpen, setLangOpen] = React.useState(false)
  const [langQuery, setLangQuery] = React.useState('')
  const [navQuery, setNavQuery] = React.useState('')
  const [collapsed, setCollapsed] = React.useState(() => new Set(lsGet(LS_COLLAPSED, [])))
  const [railPref, setRailPref] = React.useState(() => lsGet(LS_RAIL, null))
  const isPhone = useMedia('(max-width: 768px)')
  const isTablet = useMedia('(min-width: 769px) and (max-width: 1180px)')
  const navScrollRef = React.useRef(null)
  const canHover = useMedia('(hover: hover) and (pointer: fine)')
  const [peek, setPeek] = React.useState(null)

  // iPad-class widths default to the compact icon rail; desktops default to
  // the full panel. An explicit toggle wins on every device.
  const rail = !isPhone && (railPref == null ? isTablet : railPref === 'on')

  const sections = React.useMemo(() => {
    const main = groupMenu(MENU).map(g => ({ ...g, ...(GROUP_THEME[g.label] || GROUP_THEME.More), zone: 'main' }))
    const chap = buildSidebarCategories(chapters, deepDives).map((g, i) => ({
      ...g,
      ...(GROUP_THEME[g.label] || { hue: CHAPTER_HUES[i % CHAPTER_HUES.length], glyph: '◆' }),
      zone: 'chapters',
    }))
    return [...main, ...chap]
  }, [chapters, deepDives])

  const nq = navQuery.trim().toLowerCase()
  const visibleSections = React.useMemo(() => sections
    .map(g => ({ ...g, shown: nq ? g.items.filter(i => `${t(i.key)} ${i.key}`.toLowerCase().includes(nq)) : g.items }))
    .filter(g => g.shown.length), [sections, nq, t])
  const matchCount = visibleSections.reduce((n, g) => n + g.shown.length, 0)

  const toggleGroup = label => setCollapsed(prev => {
    const next = new Set(prev)
    if (next.has(label)) next.delete(label)
    else next.add(label)
    lsSet(LS_COLLAPSED, [...next])
    return next
  })
  const allCollapsed = sections.every(g => collapsed.has(g.label))
  const setAll = shut => {
    const next = new Set(shut ? sections.map(g => g.label) : [])
    lsSet(LS_COLLAPSED, [...next])
    setCollapsed(next)
  }
  const toggleRail = () => {
    const next = rail ? 'off' : 'on'
    lsSet(LS_RAIL, next)
    setRailPref(next)
  }
  const jumpTo = label => {
    if (!label) return
    if (collapsed.has(label)) toggleGroup(label)
    requestAnimationFrame(() => {
      const root = navScrollRef.current
      const el = root && [...root.querySelectorAll('[data-group]')].find(n => n.dataset.group === label)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  // Close the phone sheet on navigation and on Escape.
  React.useEffect(() => { setMenuOpen(false); setPeek(null) }, [loc.pathname])
  React.useEffect(() => {
    if (!menuOpen) return undefined
    const onKey = e => { if (e.key === 'Escape') setMenuOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  const langMatches = React.useMemo(() => {
    const q = langQuery.trim().toLowerCase()
    if (!q) return LANGUAGES
    return LANGUAGES.filter(l =>
      l.name.toLowerCase().includes(q) || l.native.toLowerCase().includes(q) || l.code.toLowerCase() === q
    )
  }, [langQuery])

  const langGroups = React.useMemo(() => {
    const map = new Map()
    for (const l of langMatches) {
      if (!map.has(l.region)) map.set(l.region, [])
      map.get(l.region).push(l)
    }
    return [...map.entries()]
  }, [langMatches])

  const currentLang = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0]
  const dockActive = DOCK.some(d => isActive(d, loc.pathname))

  const renderSection = g => {
    const open = !!nq || rail || !collapsed.has(g.label)
    const hasActive = g.items.some(i => isActive(i, loc.pathname))
    return (
      <section
        key={g.label}
        data-group={g.label}
        className={`nx-group ${open ? 'is-open' : ''} ${hasActive ? 'has-active' : ''}`}
        style={{ '--g': g.hue }}
      >
        <button
          type="button"
          className="nx-group-head"
          onClick={() => toggleGroup(g.label)}
          aria-expanded={open}
          title={t(g.label)}
        >
          <span className="nx-glyph" aria-hidden="true">{g.glyph}</span>
          <span className="nx-group-label">{t(g.label)}</span>
          <span className="nx-group-count">{nq ? `${g.shown.length}/${g.items.length}` : g.items.length}</span>
          <span className="nx-chev" aria-hidden="true">›</span>
        </button>
        <div className="nx-group-body">
          <div className="nx-group-items">
            {g.shown.map(item => {
              const paren = typeof item.paren === 'function' ? item.paren() : item.paren
              const active = isActive(item, loc.pathname)
              const label = t(item.key)
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`nx-link ${active ? 'active' : ''}`}
                  aria-current={active ? 'page' : undefined}
                  title={rail ? label : undefined}
                  onClick={() => { setMenuOpen(false); setPeek(null) }}
                  onMouseEnter={e => {
                    if (!canHover || isPhone) return
                    const r = e.currentTarget.getBoundingClientRect()
                    const panel = e.currentTarget.closest('.nx-panel')?.getBoundingClientRect()
                    setPeek({ to: item.to, icon: item.icon, label, paren: paren ? cleanParen(paren) : '', hue: g.hue, top: r.top, left: panel ? panel.right : r.right })
                  }}
                  onMouseLeave={() => setPeek(null)}
                >
                  <span className="nx-tile nx-photo" aria-hidden="true" style={{ '--img': `url("${menuImage(item.to, 96, 96)}")` }}>
                    <i>{item.icon}</i>
                  </span>
                  <span className="nx-link-label">{label}</span>
                  {paren && <span className="nx-count">{cleanParen(paren)}</span>}
                </Link>
              )
            })}
          </div>
        </div>
      </section>
    )
  }

  const mainSections = visibleSections.filter(g => g.zone === 'main')
  const chapterSections = visibleSections.filter(g => g.zone === 'chapters')
  const firstChapterGroup = sections.find(g => g.zone === 'chapters')

  return (
    <>
      <header className="app-header">
        <Link to="/" className="logo-link">
          <span className="logo-icon">🧠</span>
          <h1>{t('AI Knowledge Hub')} <span>| v2.0</span></h1>
        </Link>
        <div className="header-context" aria-label="Current workspace">
          <span className="header-context-dot" aria-hidden="true" />
          <span>{t('Research workspace')}</span>
        </div>
        <div className="lang-picker">
          <button
            type="button"
            className="lang-picker-btn"
            onClick={() => { setLangOpen(o => !o); setLangQuery('') }}
            title="Choose interface + content language (100+ languages)"
            aria-expanded={langOpen}
          >
            🌐 <span className="lang-picker-native">{currentLang.native}</span> ▾
          </button>
          {langOpen && (
            <>
              <button type="button" className="lang-scrim" aria-label="Close language picker" onClick={() => setLangOpen(false)} />
              <div className="lang-pop" role="dialog" aria-label="Language picker">
                <div className="lang-search">
                  <input
                    autoFocus
                    type="text"
                    className="lang-search-input"
                    placeholder={`🔍 Search ${LANGUAGES.length} languages…`}
                    value={langQuery}
                    onChange={e => setLangQuery(e.target.value)}
                  />
                  <button type="button" className="lang-close" onClick={() => setLangOpen(false)}>✕</button>
                </div>
                <div className="lang-list">
                  {langGroups.map(([region, list]) => (
                    <div key={region} className="lang-group">
                      <div className="lang-group-label">{region}</div>
                      {list.map(l => (
                        <button
                          key={l.code}
                          type="button"
                          className={`lang-item ${l.code === lang ? 'on' : ''}`}
                          onClick={() => { setLang(l.code); setLangOpen(false) }}
                        >
                          <span className="lang-native">{l.native}</span>
                          <span className="lang-name">{l.name}</span>
                          {l.rtl && <span className="lang-rtl" title="Right-to-left">⇄</span>}
                        </button>
                      ))}
                    </div>
                  ))}
                  {langMatches.length === 0 && <div className="lang-none">No language matches “{langQuery}”</div>}
                </div>
              </div>
            </>
          )}
        </div>
        <button className="menu-toggle" type="button" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? '✕' : '☰'}
        </button>
      </header>
      <div className={`app-body nx-body ${rail ? 'nx-rail-on' : ''}`}>
        {menuOpen && <button type="button" className="sidebar-scrim nx-scrim" aria-label="Close navigation" onClick={() => setMenuOpen(false)} />}
        <aside className={`sidebar nx-sidebar ${menuOpen ? 'open' : ''} ${rail ? 'is-rail' : ''}`} aria-label="Primary navigation">
          <div className="nx-panel">
            <div className="nx-sheet-handle" aria-hidden="true" />
            <div className="nx-top">
              <div className="nx-brand">
                <span className="nx-brand-mark" aria-hidden="true">✦</span>
                <div className="nx-brand-text"><strong>{t('Explore Hub')}</strong><span>{t('Learn · build · ship')}</span></div>
                {isPhone ? (
                  <button type="button" className="nx-icon-btn" onClick={() => setMenuOpen(false)} aria-label="Close navigation">✕</button>
                ) : (
                  <button type="button" className="nx-icon-btn nx-rail-btn" onClick={toggleRail} title={rail ? 'Expand sidebar' : 'Collapse to icon rail'} aria-label={rail ? 'Expand sidebar' : 'Collapse to icon rail'}>
                    {rail ? '»' : '«'}
                  </button>
                )}
              </div>
              <div className="nx-search">
                <span className="nx-search-icon" aria-hidden="true">⌕</span>
                <input
                  type="search"
                  value={navQuery}
                  onChange={e => setNavQuery(e.target.value)}
                  placeholder={t('Filter menu…')}
                  aria-label={t('Filter menu')}
                />
                {nq ? <span className="nx-search-meta">{matchCount}</span> : (
                  <button type="button" className="nx-search-meta nx-fold" onClick={() => setAll(!allCollapsed)} title={allCollapsed ? 'Expand all sections' : 'Collapse all sections'} aria-label={allCollapsed ? 'Expand all sections' : 'Collapse all sections'}>
                    {allCollapsed ? '⊞' : '⊟'}
                  </button>
                )}
              </div>
              {!nq && (
                <div className="nx-chips" aria-label="Jump to section">
                  {sections.filter(g => g.zone === 'main').map(g => (
                    <button key={g.label} type="button" className="nx-chip" style={{ '--g': g.hue }} onClick={() => jumpTo(g.label)}>
                      <span aria-hidden="true">{g.glyph}</span>{t(g.label)}
                    </button>
                  ))}
                  {firstChapterGroup && (
                    <button type="button" className="nx-chip" style={{ '--g': CHAPTER_HUES[0] }} onClick={() => jumpTo(firstChapterGroup.label)}>
                      <span aria-hidden="true">◆</span>{t('Chapters')}
                    </button>
                  )}
                </div>
              )}
            </div>
            <div className="nx-scroll" ref={navScrollRef} onScroll={() => peek && setPeek(null)}>
              {mainSections.map(renderSection)}
              {chapterSections.length > 0 && (
                <div className="nx-zone-label"><span>{t('Chapters')} · {chapters.length}</span></div>
              )}
              {chapterSections.map(renderSection)}
              {visibleSections.length === 0 && <div className="nx-empty">No menu matches “{navQuery}”</div>}
            </div>
          </div>
        </aside>
        {peek && (
          <div
            className="nx-peek"
            aria-hidden="true"
            style={{ top: Math.max(70, Math.min(peek.top - 24, window.innerHeight - 260)), left: peek.left + 14, '--g': peek.hue }}
          >
            <div className="nx-peek-img" style={{ backgroundImage: `url("${menuImage(peek.to, 560, 300)}")` }}>
              <span>{peek.icon}</span>
            </div>
            <div className="nx-peek-body">
              <b>{peek.label}</b>
              {menuTagline(peek.to) && <span>{menuTagline(peek.to)}</span>}
              {peek.paren && <em>{peek.paren}</em>}
            </div>
          </div>
        )}
        <main id="page-content" className="main-content">
          <RouteExperienceBanner />
          <LatestPulse />
          <IconPhotos />
          {children}
        </main>
      </div>
      <nav className="nx-dock" aria-label="Quick navigation">
        {DOCK.map(d => {
          const active = isActive(d, loc.pathname) && !menuOpen
          return (
            <Link key={d.to} to={d.to} className={`nx-dock-item ${active ? 'active' : ''}`} aria-current={active ? 'page' : undefined}>
              <span className="nx-dock-icon" aria-hidden="true">{d.icon}</span>
              <span className="nx-dock-label">{t(d.key)}</span>
            </Link>
          )
        })}
        <button type="button" className={`nx-dock-item ${menuOpen || !dockActive ? 'active' : ''}`} onClick={() => setMenuOpen(o => !o)} aria-expanded={menuOpen} aria-label={menuOpen ? 'Close menu' : 'Open full menu'}>
          <span className="nx-dock-icon" aria-hidden="true">{menuOpen ? '✕' : '☰'}</span>
          <span className="nx-dock-label">{t('Menu')}</span>
        </button>
      </nav>
      <footer className="app-footer">
        <strong>{t('AI Knowledge Hub')} v2.0</strong> &mdash; {chapters.length} {t('Chapters')} &middot; {deepDives.length} {t('Deep Dives')} &middot; 50+ {t('Code Examples')} &middot; 12 {t('Architecture Diagrams')} &mdash; React + FastAPI
      </footer>
      <ChatWidget />
    </>
  )
}
