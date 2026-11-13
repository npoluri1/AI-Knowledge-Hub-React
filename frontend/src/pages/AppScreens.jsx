import React from 'react'
import { Link } from 'react-router-dom'
import { MENU, MENU_GROUPS, GROUP_THEME, groupMenu } from '../data/menuData'
import { DEVICES, DEVICE_MAP, deviceForPath, HERO_PICKS } from '../data/devices'
import { CHAPTERS, DEEP_DIVES } from '../data/appData'
import { menuImage, menuTagline } from '../data/menuVisuals'
import { useDevice } from '../hooks/useDevice'
import { useLang } from '../i18n'
import DeviceFrame from '../components/DeviceFrame'
import './AppScreens.css'
import appGithubUrls from '../data/app_github_urls.json'
const GITHUB_URL_MAP = appGithubUrls.map || appGithubUrls

const CHAPTER_SCREENS = CHAPTERS.map(c => ({
  to: `/chapter/${c.id}`,
  icon: c.icon || '📖',
  key: c.title,
  desc: c.preview || 'Chapter reference screen',
  group: 'Chapters',
}))
const DEEP_DIVE_SCREENS = DEEP_DIVES.map(d => ({
  to: `/deep-dive/${d.id}`,
  icon: d.icon || '🔍',
  key: d.title,
  desc: d.description || d.preview || 'Deep dive screen',
  group: 'Deep Dives',
}))

const ALL_SCREENS = [
  ...MENU.map(m => ({ ...m, group: MENU_GROUPS.find(g => g.paths.includes(m.to))?.label || 'More' })),
  ...CHAPTER_SCREENS,
  ...DEEP_DIVE_SCREENS,
]

const GROUPS = [
  ...groupMenu(MENU).map(g => ({ label: g.label, hue: (GROUP_THEME[g.label] || GROUP_THEME.More).hue, items: g.items })),
  { label: 'Chapters', hue: '#8fb3ff', items: CHAPTER_SCREENS },
  { label: 'Deep Dives', hue: '#ff94ad', items: DEEP_DIVE_SCREENS },
]

const clean = v => String(v ?? '').replace(/^\(+|\)+$/g, '')
const tagFor = item => menuTagline(item.to) || item.desc || ''

// GitHub repo map -> gallery scenes for the "GitHub Repos" device tab.
// app_github_urls.json has the same shape as github_url_map.json; both are flat
// "owner/name": { no, channel, facebook, github } maps. GITHUB_URL_MAP is the
// primary import (it is the raw data), GITHUB_URL_ITEMS is the app-release
// selection. Build the scenes from GITHUB_URL_MAP so it is the single source
// of truth and app_github_urls.json never drifts out of sync.

function buildGitHubScenes(input) {
  const scenes = []
  for (const [key, entry] of Object.entries(input || {})) {
    const repo = entry.github || key
    const title = entry.github || key
    const tagline = entry.channel || entry.no || ''
    scenes.push({
      to: repo,
      icon: '🐙',
      key: repo,
      title,
      tagline,
      sourceRow: entry.no || '',
      caption: `${title} · ${repo}`,
      badge: 'share',
      source: 'src/data/github_url_map.json',
    })
  }
  return scenes
}


export default function AppScreens() {
  const { t } = useLang()
  const currentDevice = useDevice()
  const [deviceId, setDeviceId] = React.useState('laptop')
  const [screenPath, setScreenPath] = React.useState('/')
  const [group, setGroup] = React.useState('All')
  const [query, setQuery] = React.useState('')
  const [visible, setVisible] = React.useState(18)
  const [pickerOpen, setPickerOpen] = React.useState(false)

  const device = DEVICE_MAP[deviceId] || DEVICE_MAP.laptop
  const selected = ALL_SCREENS.find(s => s.to === screenPath) || ALL_SCREENS[0]

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    return ALL_SCREENS.filter(s => {
      if (group !== 'All' && s.group !== group) return false
      if (!q) return true
      return `${t(s.key)} ${s.key} ${s.to} ${tagFor(s)}`.toLowerCase().includes(q)
    })
  }, [group, query, t])

  React.useEffect(() => { setVisible(18) }, [group, query, deviceId])

  const shown = filtered.slice(0, visible)
  const heroPick = HERO_PICKS[deviceId] || '/screens'
  const heroItem = ALL_SCREENS.find(s => s.to === heroPick) || ALL_SCREENS[0]

  const chooseScreen = path => {
    setScreenPath(path)
    setPickerOpen(false)
    const el = document.getElementById('as-live')
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="as-page">
      <section className="as-hero">
        <div className="as-hero-copy">
          <span className="as-kicker">{t('Complete application · every screen')}</span>
          <h1>{t('One app. Every device. Every screen.')}</h1>
          <p>
            {t('Browse the full AI Knowledge Hub on iPhone, iPad, MacBook Pro, iMac, Mac Pro and Mac Pro Max.')}
            {' '}
            {t('Every menu is image-led, every layout adapts, and every route is one tap away.')}
          </p>
          <div className="as-hero-stats">
            <span><b>{ALL_SCREENS.length}</b> {t('screens')}</span>
            <span><b>{DEVICES.length}</b> {t('devices')}</span>
            <span><b>{GROUPS.length}</b> {t('menu groups')}</span>
          </div>
          <div className="as-hero-actions">
            <button type="button" className="as-btn as-btn-primary" onClick={() => chooseScreen('/')}>{t('Open live preview')} →</button>
            <Link className="as-btn" to="/">{t('Go to home')}</Link>
            <button type="button" className="as-btn as-btn-ghost" onClick={() => setDeviceId(currentDevice.id)}>
              {currentDevice.icon} {t('Use my device')}: {currentDevice.label}
            </button>
          </div>
        </div>
        <div className="as-hero-stage" style={{ '--as-hue': '#79d9f2' }}>
          <DeviceFrame
            device={deviceId}
            size="lg"
            image={menuImage(heroItem.to, 900, 520)}
            title={t(heroItem.key)}
            tagline={tagFor(heroItem)}
            icon={heroItem.icon}
            badge={device.note}
          />
        </div>
      </section>

      <section className="as-devices" aria-label={t('Choose a device')}>
        <div className="as-section-head">
          <div>
            <span className="as-kicker">{t('Device gallery')}</span>
            <h2>{t('Choose the screen you are designing for')}</h2>
          </div>
          <span className="as-current-device">{currentDevice.icon} {t('You are on')}: <b>{currentDevice.label}</b></span>
        </div>
        <div className="as-device-grid">
          {DEVICES.map(d => {
            const pick = ALL_SCREENS.find(s => s.to === HERO_PICKS[d.id]) || ALL_SCREENS[0]
            return (
              <button
                key={d.id}
                type="button"
                className={`as-device-card ${deviceId === d.id ? 'is-active' : ''}`}
                onClick={() => { setDeviceId(d.id); setScreenPath(pick.to) }}
                style={{ '--as-hue': GROUP_THEME.Overview.hue }}
              >
                <DeviceFrame
                  device={d.id}
                  size="sm"
                  image={menuImage(pick.to, 560, 340)}
                  title={t(pick.key)}
                  tagline={tagFor(pick)}
                  icon={pick.icon}
                  caption={false}
                />
                <span className="as-device-meta">
                  <b>{d.icon} {d.label}</b>
                  <small>{d.note}</small>
                </span>
              </button>
            )
          })}
        </div>
      </section>

      <section id="as-live" className="as-live" aria-label={t('Live screen preview')}>
        <div className="as-section-head">
          <div>
            <span className="as-kicker">{t('Live screen preview')}</span>
            <h2>{t(selected.key)} <em>· {device.label}</em></h2>
            <p>{tagFor(selected)}</p>
          </div>
          <div className="as-live-actions">
            <button type="button" className="as-btn as-btn-small" onClick={() => setPickerOpen(o => !o)} aria-expanded={pickerOpen}>
              {pickerOpen ? t('Hide screens') : t('Change screen')} ▾
            </button>
            <Link className="as-btn as-btn-small as-btn-primary" to={selected.to}>{t('Open this screen')} →</Link>
          </div>
        </div>
        {pickerOpen && (
          <div className="as-picker">
            <label className="as-picker-search">
              <span aria-hidden="true">⌕</span>
              <input value={query} onChange={e => setQuery(e.target.value)} placeholder={t('Search every screen…')} />
            </label>
            <div className="as-picker-list">
              {filtered.slice(0, 120).map(s => (
                <button
                  key={s.to}
                  type="button"
                  className={`as-picker-item ${s.to === selected.to ? 'is-active' : ''}`}
                  onClick={() => chooseScreen(s.to)}
                >
                  <span>{s.icon}</span>
                  <span>{t(s.key)}</span>
                  <small>{s.group}</small>
                </button>
              ))}
              {filtered.length === 0 && <span className="as-picker-empty">{t('No screens match that search.')}</span>}
            </div>
          </div>
        )}
        <div className="as-live-stage" style={{ '--as-hue': device.id === 'phone' ? '#ffabc3' : '#79d9f2' }}>
          <DeviceFrame
            device={deviceId}
            size="xl"
            image={menuImage(selected.to, 1200, 700)}
            title={t(selected.key)}
            tagline={tagFor(selected)}
            icon={selected.icon}
            badge={selected.paren ? clean(typeof selected.paren === 'function' ? selected.paren() : selected.paren) : ''}
          />
          <div className="as-live-note">
            <span className="as-live-chip">{device.icon} {device.label}</span>
            <span className="as-live-chip">{device.note}</span>
            <span className="as-live-chip">{selected.group}</span>
            <span className="as-live-chip">{selected.to}</span>
          </div>
        </div>
      </section>

      <section className="as-screens" aria-label={t('Every screen')}>
        <div className="as-section-head">
          <div>
            <span className="as-kicker">{t('Screen-wise gallery')}</span>
            <h2>{t('Every screen on')} {device.label}</h2>
            <p>{filtered.length} {t('screens match')} {group === 'All' ? t('every menu group') : group}.</p>
          </div>
          <div className="as-screen-controls">
            <label className="as-search">
              <span aria-hidden="true">⌕</span>
              <input value={query} onChange={e => setQuery(e.target.value)} placeholder={t('Filter screens…')} />
            </label>
            <div className="as-device-chips" role="tablist" aria-label={t('Device')}>
              {DEVICES.map(d => (
                <button
                  key={d.id}
                  type="button"
                  role="tab"
                  aria-selected={deviceId === d.id}
                  className={`as-chip ${deviceId === d.id ? 'is-active' : ''}`}
                  onClick={() => setDeviceId(d.id)}
                >
                  {d.icon} {d.short}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="as-group-chips" role="tablist" aria-label={t('Menu group')}>
          <button type="button" className={`as-chip ${group === 'All' ? 'is-active' : ''}`} onClick={() => setGroup('All')}>
            {t('All')} · {ALL_SCREENS.length}
          </button>
          {GROUPS.map(g => (
            <button
              key={g.label}
              type="button"
              className={`as-chip ${group === g.label ? 'is-active' : ''}`}
              style={{ '--as-hue': g.hue }}
              onClick={() => setGroup(g.label)}
            >
              {t(g.label)} · {g.items.length}
            </button>
          ))}
        </div>

        <div className="as-screen-grid">
          {shown.map(s => (
            <Link key={s.to} to={s.to} className="as-screen-card" style={{ '--as-hue': GROUPS.find(g => g.label === s.group)?.hue || '#79d9f2' }}>
              <DeviceFrame
                device={deviceId}
                size={deviceId === 'phone' ? 'xs' : 'sm'}
                image={menuImage(s.to, 640, 380)}
                title={t(s.key)}
                tagline={tagFor(s)}
                icon={s.icon}
                caption={false}
              />
              <span className="as-screen-info">
                <span className="as-screen-icon" aria-hidden="true">{s.icon}</span>
                <span className="as-screen-text">
                  <b>{t(s.key)}</b>
                  <small>{tagFor(s)}</small>
                </span>
                <span className="as-screen-open">{t('Open')} →</span>
              </span>
              <span className="as-screen-foot">
                <span>{s.group}</span>
                <span>{deviceForPath(s.to).icon} {deviceForPath(s.to).label}</span>
                <span className="as-screen-path">{s.to}</span>
              </span>
            </Link>
          ))}
          {filtered.length === 0 && <p className="as-empty">{t('No screens match that filter.')}</p>}
        </div>
        {visible < filtered.length && (
          <button type="button" className="as-load-more" onClick={() => setVisible(v => v + 18)}>
            {t('Load more screens')} ({filtered.length - visible} {t('remaining')})
          </button>
        )}
      </section>
    </div>
  )
}
