import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import ChatWidget from './ChatWidget'
import SiteFooter from './SiteFooter'
import RouteExperienceBanner from './RouteExperienceBanner'
import LatestPulse from './LatestPulse'
import IconPhotos from './IconPhotos'
import SidebarPhotos from './SidebarPhotos'
import DeviceFrame from './DeviceFrame'
import { useDevice } from '../hooks/useDevice'
import { LANGUAGES, useLang } from '../i18n'
import { CHAPTERS, DEEP_DIVES } from '../data/appData'
import { MENU, GROUP_THEME, DOCK, groupMenu } from '../data/menuData'
import './NexusNav.css'
import { menuImage, menuTagline } from '../data/menuVisuals'

// ---------------------------------------------------------------------------
// Sidebar navigation — hierarchy, not a flat list.
//
// Rows of the UI
//  1.  Header row   — logo mark, brand name + tagline, current-screen card.
//  2.  Filter row   — global search input + jump-to-section chips.
//  3.  Groups row   — one visual group per menu category. Each group shows
//                      its colour, a leading icon, the section title, and the
//                      number of items it contains.
//  4.  Footer row   — "Chapters · N" zone label, then the current-device
//                      preview card so users always know which screen they
//                      are looking at.
// ---------------------------------------------------------------------------

const CHAPTER_GROUPS = [
  { label: 'Models & Inference', ids: ['llm-models', 'fine-tuning-local'] },
  { label: 'Core AI Systems', ids: ['rag-pipeline', 'vector-databases', 'ai-agents', 'prompt-engineering'] },
  { label: 'Development Stack', ids: ['python-for-ai', 'fastapi-ai-services', 'langchain-llamaindex', 'react-ai-frontend'] },
  { label: 'Emerging & Future Tech', ids: ['quantum-computing', 'robotics-ai', 'ai-semiconductor'] },
  { label: 'Enterprise & Governance', ids: ['system-design', 'grc-compliance', 'observability-evals', 'security-guardrails', 'enterprise-integration'] },
  { label: 'Tools & Resources', ids: ['tools-catalog', 'project-ideas', 'career-resources', 'ai-news-market'] },
  { label: 'Projects & Architecture', ids: ['comprehensive-guide', 'e2e-project', 'ai-agent-architecture'] },
]

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

const cleanParen = v => String(v).replace(/^\(+|\)+$/g, '')
const CHAPTER_HUES = ['#8fb3ff', '#7ee0c3', '#ffc58f', '#d9a6ff', '#ff9fb8', '#9fd8ff', '#c6e88f', '#ffd98f']

const LS_COLLAPSED = 'nx.collapsedGroups'
const LS_RAIL = 'nx.railPref'
const LS_COLOR = 'nx.sidebarColor'
const lsGet = (k, fallback) => { try { const v = localStorage.getItem(k); return v == null ? fallback : JSON.parse(v) } catch { return fallback } }
const lsSet = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)) } catch { /* storage unavailable */ } }

// Built-in palette. First entry is the default: "auto" = follow the page theme.
// The rest are static brand colours (Stream, Rose, Amber, Green, Rust, White, Black).
const PALETTES = [
  { id: 'auto',  label: 'System', css: 'var(--text-primary) / 92%' },
  { id: 'white', label: 'White',  css: '#ffffff / 92%' },
  { id: 'black', label: 'Black',  css: '#1a1a1a / 92%' },
  { id: 'cyan',  label: 'Stream', css: '#22d3ee / 92%' },
  { id: 'rose',  label: 'Rose',   css: '#f472b6 / 92%' },
  { id: 'amber', label: 'Amber',  css: '#fbbf24 / 92%' },
  { id: 'green', label: 'Green',  css: '#34d399 / 92%' },
  { id: 'rust',  label: 'Rust',   css: '#ea580c / 92%' },
]

// Turn a palette entry into the tokens Layout/JSX consume.
const paletteToTokens = id => {
  const p = PALETTES.find(p => p.id === id) || PALETTES[0]
  const def = (p.css || '#79d9f2 / 92%').split(' / ')
  const col = def[0] || '#79d9f2'
  const op = def[1] || '92%'
  return {
    hue: col,
    text: op.replace('%', '') > 88 ? '#0a1020' : '#ffffff',
    swatch: col,
    ui: col,
  }
}

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
  const [colorPref, setColorPref] = React.useState(() => lsGet(LS_COLOR, 'auto'));
  const col = React.useMemo(() => paletteToTokens(colorPref), [colorPref]);
  const isPhone = useMedia('(max-width: 768px)')
  const isTablet = useMedia('(min-width: 769px) and (max-width: 1180px)')
  const device = useDevice()
  const navScrollRef = React.useRef(null)
  const canHover = useMedia('(hover: hover) and (pointer: fine)')
  const [peek, setPeek] = React.useState(null)
  const [colorOpen, setColorOpen] = React.useState(false)

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
    if (loc.hash) {
      const id = decodeURIComponent(loc.hash.slice(1))
      const raf = requestAnimationFrame(() => {
        const el = document.getElementById(id)
        if (el) el.scrollIntoView({ block: 'start' })
        else window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
      })
      return () => cancelAnimationFrame(raf)
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    return undefined
  }, [loc.key, loc.pathname, loc.hash])
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
            {/* Row 1 — brand + current screen */}
            <div className="nx-top">
              <div className="nx-brand">
                <span className="nx-brand-mark" aria-hidden="true">✦</span>
                <div className="nx-brand-text">
                  <strong>{t('Explore Hub')}</strong>
                  <span>{t('Learn · build · ship')}</span>
                </div>                {isPhone ? (                  <button type="button" className="nx-icon-btn" onClick={() => setMenuOpen(false)} aria-label="Close navigation">✕</button>                ) : (                  <>                    <button type="button" className="nx-icon-btn nx-rail-btn" onClick={toggleRail} title={rail ? 'Expand sidebar' : 'Collapse to icon rail'} aria-label={rail ? 'Expand sidebar' : 'Collapse to icon rail'}>                      {rail ? '»' : '«'}                    </button>                    <div className="nx-color-select" onClick={() => setColorPref(p => p === colorPref ? 'auto' : p)} title="Change sidebar colour">                      <span className="nx-color-label">                        <span className="nx-color-swatch" style={{ background: col.swatch }} aria-hidden="true" />                        <span className="nx-color-label-text">{t(colorPref === 'auto' ? 'System' : PALETTES.find(p => p.id === colorPref)?.label || 'Palette')}</span>                      </span>                      <button type="button" className="nx-color-pick-btn" aria-label="Pick sidebar colour" onClick={e => { e.stopPropagation(); setColorPref(p => p === colorPref ? 'auto' : p); setColorOpen(true); }}>                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/></svg>                      </button>                    </div>                    <div className={`nx-color-pop ${colorOpen ? 'open' : ''}`} style={{ '--g': col.hue }}>{PALETTES.map(p => (                        <button key={p.id} type="button" className={`nx-color-opt ${p.id === colorPref ? 'on' : ''}`} style={{ '--g': p.css.split(' / ')[0] || '#79d9f2' }} onClick={() => { setColorPref(p.id); setColorOpen(false); }}>                          <span className="nx-chk" style={{ background: p.css.split(' / ')[0] || '#79d9f2' }} aria-hidden="true" />                          <span className="nx-color-opt-inner">                            <span className="nx-c-title">{t(p.label)}</span>                            <span className="nx-c-sub">{p.css.split(' / ')[1] || '92%'} contrast</span>                          </span>                        </button>                      ))}                    </div>                  </>                )}              </div>
              <div className="nx-device">
                <DeviceFrame
                  device={device.id}
                  size="xs"
                  image={menuImage(loc.pathname, 360, 220)}
                  title={t('Current screen')}
                  tagline={device.note}
                  icon="✦"
                  caption={false}
                />
                <div className="nx-device-meta">
                  <span className="nx-device-kicker">{t('Previewing on')}</span>
                  <strong>{device.icon} {device.label}</strong>
                  <span>{device.note}</span>
                  <Link to="/screens" className="nx-device-link" onClick={() => setMenuOpen(false)}>{t('All screens')} →</Link>
                </div>
              </div>
            </div>

            {/* Row 2 — search + jump chips */}
            <div className="nx-search-row">
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

            {/* Row 3 — section groups */}
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
            style={{ top: Math.max(70, Math.min(peek.top - 24, window.innerHeight - 360)), left: peek.left + 14, '--g': peek.hue }}
          >
            <DeviceFrame
              device={device.id}
              size="sm"
              image={menuImage(peek.to, 640, 400)}
              title={peek.label}
              tagline={menuTagline(peek.to)}
              icon={peek.icon}
              caption={false}
            />
            <div className="nx-peek-body">
              <span className="nx-peek-device">{device.icon} {device.label} · {device.note}</span>
              <b>{peek.label}</b>
              {menuTagline(peek.to) && <span>{menuTagline(peek.to)}</span>}
              <span className="nx-peek-open">{t('Open screen')} →</span>
              {peek.paren && <em>{peek.paren}</em>}
            </div>
          </div>
        )}
        <main id="page-content" className="main-content">
          <RouteExperienceBanner />
          <LatestPulse />
          <IconPhotos />
          <SidebarPhotos />
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
      <SiteFooter chapters={chapters.length} deepDives={deepDives.length} />
      <ChatWidget />
    </>
  )
}
