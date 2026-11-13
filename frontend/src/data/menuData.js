import BOOKS from './booksData'
import { LINKEDIN_POSTS } from './linkedinPostsCollection'

export const MENU = [
  { to: '/', icon: '🏠', key: 'Home', exact: true },
  { to: '/screens', icon: '🖥️', key: 'All Screens · Devices', exact: true },
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
  { to: '/linked-ai-techstack-images', icon: '🖼️', key: 'LinkedIn AI TechStack Images' },
  { to: '/study-by-doing/resources', icon: '🌐', key: 'Study By Doing — 697 Resources' },
  { to: '/europe-settlement', icon: '🇪🇺', key: 'Europe Settlement Blueprint' },
  {
    to: '/mortalapps-hub',
    icon: '📚',
    key: 'MortalApps Hub',
    match: p => p.startsWith('/mortalapps-hub') || p.startsWith('/system-design') || p.startsWith('/python-code') || p.startsWith('/ai-agents-guide') || p.startsWith('/ai-infrastructure') || p.startsWith('/quantum-computing') || p.startsWith('/semiconductors'),
  },
]

export const MENU_GROUPS = [
  { label: 'Overview', paths: ['/', '/screens', '/images', '/files', '/knowledge', '/edureka'] },
  { label: 'Learn & Guides', paths: ['/learn', '/playbook', '/rapid-fire', '/ai-stack', '/claude-cert', '/snowflake', '/etl-guide', '/python-masterhub', '/python-tutorials', '/python-tech-hub', '/technologies', '/ai-python-masterhub-pages', '/study-by-doing', '/study-by-doing/resources', '/ai-techstack-ref', '/reference-library', '/mortalapps-hub'] },
  { label: 'News & Catalogs', paths: ['/ai-news', '/live-news', '/ai-tools', '/github-repos', '/tools', '/open-alternatives', '/integrations', '/books', '/linked-posts', '/video-hub', '/ai-tech-blogs'] },
  { label: 'Careers & Projects', paths: ['/jobs', '/ai-jobs-global', '/projects'] },
  { label: 'Global Directories', paths: ['/design-space', '/ai-chatbots', '/ai-agents', '/communication-channels'] },
  { label: 'Life & Finance', paths: ['/trading', '/neem-karoli-baba', '/europe-settlement'] },
]

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

export const DOCK = [
  { to: '/', icon: '🏠', key: 'Home', exact: true },
  { to: '/learn', icon: '🎓', key: 'Learn' },
  { to: '/ai-news', icon: '📡', key: 'News' },
  { to: '/jobs', icon: '💼', key: 'Jobs' },
  { to: '/linked-ai-techstack-images', icon: '🖼️', key: 'Images' },
]

export function groupMenu(menu) {
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
