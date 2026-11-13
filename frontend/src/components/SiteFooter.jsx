import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../i18n'
import './SiteFooter.css'

const APPS = [
  { to: '/screens', icon: '🖥️', name: 'All Screens · Devices', meta: 'iPhone · iPad · Mac' },
  { to: '/ai-tools', icon: '🤖', name: 'AI Tools Catalog', meta: 'Tools & agents' },
  { to: '/ai-chatbots', icon: '💬', name: 'AI Chatbots', meta: '1,100+ apps' },
  { to: '/ai-agents', icon: '🧠', name: 'AI Agents', meta: '375,000+ agents' },
  { to: '/open-alternatives', icon: '🔓', name: 'Open Alternatives', meta: 'Open-source picks' },
  { to: '/integrations', icon: '🔌', name: 'Integrations', meta: 'Platform bridges' },
  { to: '/github-repos', icon: '📦', name: 'GitHub Repos', meta: 'Curated repositories' },
  { to: '/books', icon: '📚', name: 'Book Library', meta: 'Free reading' },
  { to: '/video-hub', icon: '🎬', name: 'Video Hub', meta: 'YouTube · IG · TikTok' },
  { to: '/design-space', icon: '🏗️', name: 'AI Design Space', meta: '1,258 blueprints' },
  { to: '/ai-news', icon: '📡', name: 'AI News', meta: 'Live dashboard' },
  { to: '/jobs', icon: '💼', name: 'AI Jobs', meta: '996 roles' },
  { to: '/learn', icon: '🎓', name: 'Learning Hub', meta: '1,200+ topics' },
]

const SPONSORS = [
  {
    badge: 'Sponsored',
    icon: '🔓',
    title: 'OpenAlternative',
    desc: 'Discover the best open source alternatives to the tools you already use.',
    cta: 'Explore alternatives',
    href: 'https://openalternative.co',
    accent: '#f7d47d',
  },
  {
    badge: 'Featured',
    icon: '📦',
    title: 'GitHub Repos',
    desc: 'Hand-picked AI repositories covering the full stack, ready to clone and learn.',
    cta: 'Browse repositories',
    to: '/github-repos',
    accent: '#79d9f2',
  },
  {
    badge: 'Featured',
    icon: '🏗️',
    title: 'AI Design Space',
    desc: '1,258 architecture blueprints for products, platforms and enterprise systems.',
    cta: 'Open blueprints',
    to: '/design-space',
    accent: '#c2a5ff',
  },
  {
    badge: 'Featured',
    icon: '🖥️',
    title: 'All Screens · Devices',
    desc: 'See every screen on iPhone, iPad, MacBook Pro, iMac, Mac Pro and Mac Pro Max.',
    cta: 'Open device gallery',
    to: '/screens',
    accent: '#9be7b4',
  },
]

const COLUMNS = [
  {
    label: 'Apps & Catalogs',
    links: [
      { to: '/ai-tools', label: 'AI Tools Catalog' },
      { to: '/ai-chatbots', label: 'AI Chatbots Global' },
      { to: '/ai-agents', label: 'AI Agents Global' },
      { to: '/open-alternatives', label: 'Open Alternatives' },
      { to: '/integrations', label: 'Web Integrations' },
      { to: '/github-repos', label: 'GitHub Repos' },
      { to: '/communication-channels', label: 'Communication Channels' },
      { to: '/books', label: 'Book Library' },
    ],
  },
  {
    label: 'Learn & Build',
    links: [
      { to: '/playbook', label: 'AI Engineering Playbook' },
      { to: '/rapid-fire', label: 'Rapid Fire Playbook' },
      { to: '/ai-stack', label: 'AI Stack' },
      { to: '/claude-cert', label: 'Claude Certification' },
      { to: '/snowflake', label: 'Snowflake Guide' },
      { to: '/etl-guide', label: 'ETL & Data Engineering' },
      { to: '/python-masterhub', label: 'Python MasterHub' },
      { to: '/study-by-doing', label: 'Study By Doing' },
    ],
  },
  {
    label: 'Explore & Updates',
    links: [
      { to: '/screens', label: 'All Screens · Devices' },
      { to: '/ai-news', label: 'AI News Dashboard' },
      { to: '/live-news', label: 'Live News Fetcher' },
      { to: '/ai-tech-blogs', label: 'AI Blogs & Market' },
      { to: '/video-hub', label: 'AI Video Hub' },
      { to: '/design-space', label: 'AI Design Space' },
      { to: '/technologies', label: 'Technologies & Tutorials' },
      { to: '/linked-posts', label: 'AI LinkedIn Posts' },
      { to: '/projects', label: 'All Projects' },
    ],
  },
  {
    label: 'Careers & More',
    links: [
      { to: '/jobs', label: 'AI Jobs' },
      { to: '/ai-jobs-global', label: 'AI Jobs Global' },
      { to: '/trading', label: 'Trading Guides' },
      { to: '/europe-settlement', label: 'Europe Settlement' },
      { to: '/neem-karoli-baba', label: 'Neem Karoli Baba' },
      { to: '/mortalapps-hub', label: 'MortalApps Hub' },
      { to: '/edureka', label: 'Edureka AI Docs' },
      { to: '/knowledge', label: 'Knowledge Base' },
    ],
  },
]

function SponsorCard({ item }) {
  const body = (
    <>
      <span className="sf-ad-icon" aria-hidden="true">{item.icon}</span>
      <span className="sf-ad-body">
        <span className="sf-ad-badge">{item.badge}</span>
        <strong>{item.title}</strong>
        <span className="sf-ad-desc">{item.desc}</span>
      </span>
      <span className="sf-ad-cta">{item.cta} <span aria-hidden="true">→</span></span>
    </>
  )

  if (item.href) {
    return (
      <a className="sf-ad" style={{ '--sf-accent': item.accent }} href={item.href} target="_blank" rel="sponsored noopener noreferrer">
        {body}
      </a>
    )
  }

  return (
    <Link className="sf-ad" style={{ '--sf-accent': item.accent }} to={item.to}>
      {body}
    </Link>
  )
}

export default function SiteFooter({ chapters = 0, deepDives = 0 }) {
  const { t } = useLang()
  const [email, setEmail] = useState('')
  const [joined, setJoined] = useState(false)
  const year = new Date().getFullYear()

  const subscribe = e => {
    e.preventDefault()
    if (!email.trim()) return
    setJoined(true)
    setEmail('')
  }

  return (
    <footer className="sf-footer">
      <div className="sf-glow" aria-hidden="true" />
      <div className="sf-inner">
        <section className="sf-sponsors" aria-label={t('Sponsored picks')}>
          <div className="sf-sponsors-head">
            <span className="sf-live-dot" aria-hidden="true" />
            <strong>{t('Sponsored picks')}</strong>
            <span>{t('Tools and resources we think are worth your time')}</span>
          </div>
          <div className="sf-ad-grid">
            {SPONSORS.map(item => <SponsorCard key={item.title} item={item} />)}
          </div>
        </section>

        <section className="sf-apps" aria-labelledby="sf-apps-title">
          <div className="sf-section-head">
            <div>
              <span className="sf-kicker">{t('Applications')}</span>
              <h3 id="sf-apps-title">{t('Popular apps & catalogs')}</h3>
            </div>
            <Link to="/ai-tools" className="sf-section-link">{t('Browse all apps')} <span aria-hidden="true">→</span></Link>
          </div>
          <div className="sf-app-grid">
            {APPS.map(app => (
              <Link key={app.to} to={app.to} className="sf-app">
                <span className="sf-app-icon" aria-hidden="true">{app.icon}</span>
                <span className="sf-app-text">
                  <strong>{t(app.name)}</strong>
                  <em>{t(app.meta)}</em>
                </span>
                <span className="sf-app-arrow" aria-hidden="true">↗</span>
              </Link>
            ))}
          </div>
        </section>

        <div className="sf-main">
          <div className="sf-brand">
            <Link to="/" className="sf-brand-link">
              <span className="sf-brand-mark" aria-hidden="true">🧠</span>
              <span className="sf-brand-text">
                <strong>{t('AI Knowledge Hub')}</strong>
                <em>{t('Research workspace')} · v2.0</em>
              </span>
            </Link>
            <p className="sf-brand-desc">
              {t('One workspace to explore AI apps, open-source alternatives, learning paths, jobs and architecture guides.')}
            </p>
            <form className="sf-news" onSubmit={subscribe}>
              <label htmlFor="sf-news-email">{t('Weekly AI digest')}</label>
              <div className="sf-news-row">
                <input
                  id="sf-news-email"
                  type="email"
                  placeholder={t('you@example.com')}
                  value={email}
                  onChange={e => { setEmail(e.target.value); setJoined(false) }}
                  autoComplete="email"
                  required
                />
                <button type="submit">{joined ? `${t('Joined')} ✓` : t('Subscribe')}</button>
              </div>
              <small>{joined ? t('Thanks — you are on the list.') : t('No spam. Unsubscribe anytime.')}</small>
            </form>
            <div className="sf-social" aria-label={t('Elsewhere')}>
              <a href="https://openalternative.co" target="_blank" rel="noopener noreferrer">🔓 OpenAlternative</a>
              <a href="https://github.com/piotrkulpinski/open-source-alternatives" target="_blank" rel="noopener noreferrer">⌥ GitHub</a>
              <Link to="/ai-news">📡 AI News</Link>
            </div>
          </div>

          <nav className="sf-cols" aria-label={t('Footer navigation')}>
            {COLUMNS.map(col => (
              <div key={col.label} className="sf-col">
                <h4>{t(col.label)}</h4>
                <ul>
                  {col.links.map(link => (
                    <li key={link.to + link.label}>
                      <Link to={link.to}>{t(link.label)}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="sf-bottom">
          <span>© {year} {t('AI Knowledge Hub')} · v2.0</span>
          <span className="sf-bottom-meta">
            {chapters} {t('Chapters')} · {deepDives} {t('Deep Dives')} · React + FastAPI
          </span>
          <div className="sf-bottom-links">
            <Link to="/">{t('Home')}</Link>
            <Link to="/open-alternatives">{t('Open Alternatives')}</Link>
            <Link to="/books">{t('Library')}</Link>
            <a href="https://openalternative.co" target="_blank" rel="noopener noreferrer">{t('Source data')}</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
