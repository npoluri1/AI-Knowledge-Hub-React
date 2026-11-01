import React from 'react'
import { Link } from 'react-router-dom'
import { MENU, MENU_GROUPS, GROUP_THEME } from './Layout'
import { menuImage, menuTagline } from '../data/menuVisuals'
import { useLang } from '../i18n'
import './ExploreSections.css'

// Photo card grid of every section in the app, grouped like the sidebar.
export default function ExploreSections() {
  const { t } = useLang()
  const byPath = React.useMemo(() => new Map(MENU.map(m => [m.to, m])), [])
  const [group, setGroup] = React.useState('All')
  const groups = MENU_GROUPS.map(g => ({ ...g, items: g.paths.map(p => byPath.get(p)).filter(Boolean) }))
  const shown = group === 'All' ? groups : groups.filter(g => g.label === group)
  return (
    <section className="xs">
      <div className="xs-head">
        <h2>✦ {t('Explore every section')}</h2>
        <div className="xs-tabs" role="tablist">
          {['All', ...groups.map(g => g.label)].map(label => (
            <button key={label} type="button" role="tab" aria-selected={group === label} className={group === label ? 'on' : ''}
              style={{ '--g': (GROUP_THEME[label] || { hue: '#79d9f2' }).hue }} onClick={() => setGroup(label)}>
              {t(label)}
            </button>
          ))}
        </div>
      </div>
      {shown.map(g => (
        <div key={g.label} className="xs-group" style={{ '--g': (GROUP_THEME[g.label] || GROUP_THEME.More).hue }}>
          {group === 'All' && <h3><span>{(GROUP_THEME[g.label] || GROUP_THEME.More).glyph}</span>{t(g.label)}</h3>}
          <div className="xs-grid">
            {g.items.filter(m => m.to !== '/').map(m => {
              const paren = typeof m.paren === 'function' ? m.paren() : m.paren
              return (
                <Link key={m.to} to={m.to} className="xs-card">
                  <span className="xs-img" style={{ backgroundImage: `url("${menuImage(m.to, 480, 300)}")` }} />
                  <span className="xs-shade" />
                  <span className="xs-icon">{m.icon}</span>
                  <span className="xs-body">
                    <b>{t(m.key)}</b>
                    <small>{menuTagline(m.to)}</small>
                    {paren && <em>{String(paren).replace(/^\(+|\)+$/g, '')}</em>}
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      ))}
    </section>
  )
}
