import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import ChatWidget from './ChatWidget'
import { CHAPTERS, DEEP_DIVES } from '../data/appData'

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

function buildSidebarCategories(chapters, deepDives) {
  const chapterMap = Object.fromEntries(chapters.map(c => [c.id, c]))
  const groups = CHAPTER_GROUPS.map(g => ({
    label: g.label,
    items: g.ids
      .filter(id => chapterMap[id])
      .map(id => ({
        path: `/chapter/${id}`,
        label: chapterMap[id].title,
        icon: chapterMap[id].icon,
      }))
  }))
  groups.unshift({
    label: `📖 All Chapters (${chapters.length})`,
    items: [{ path: '/chapter/comprehensive-guide', label: 'Reference Guide — All Tables', icon: '📚' }],
  })
  if (deepDives.length > 0) {
    groups.push({
      label: `Deep Dives (${deepDives.length})`,
      items: deepDives.map(dd => ({
        path: `/deep-dive/${dd.id}`,
        label: dd.title,
        icon: dd.icon,
      })),
    })
  }
  return groups
}

export default function Layout({ children }) {
  const loc = useLocation()
  const [menuOpen, setMenuOpen] = React.useState(false)
  const [chapters] = React.useState(CHAPTERS)
  const [deepDives] = React.useState(DEEP_DIVES)

  const sidebarCategories = React.useMemo(
    () => buildSidebarCategories(chapters, deepDives),
    [chapters, deepDives]
  )

  return (
    <>
      <header className="app-header">
        <Link to="/" className="logo-link">
          <span className="logo-icon">🧠</span>
          <h1>AI Knowledge Hub <span>| v2.0</span></h1>
        </Link>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? '✕' : '☰'}
        </button>
      </header>
      <div className="app-body">
        <aside className={`sidebar ${menuOpen ? 'open' : ''}`}>
          <div className="sidebar-inner">
            <Link to="/" className={`sidebar-home ${loc.pathname === '/' ? 'active' : ''}`}>
              <span className="icon-emoji">🏠</span> Home
            </Link>
            <Link to="/images" className={`sidebar-home ${loc.pathname === '/images' ? 'active' : ''}`}>
              <span className="icon-emoji">🖼️</span> Images Gallery
            </Link>
            <Link to="/files" className={`sidebar-home ${loc.pathname === '/files' ? 'active' : ''}`}>
              <span className="icon-emoji">📂</span> File Reference
            </Link>
            <Link to="/knowledge" className={`sidebar-home ${loc.pathname === '/knowledge' ? 'active' : ''}`}>
              <span className="icon-emoji">📐</span> Knowledge Base
            </Link>
            <Link to="/jobs" className={`sidebar-home ${loc.pathname === '/jobs' ? 'active' : ''}`}>
              <span className="icon-emoji">💼</span> AI Jobs (996)
            </Link>
            <Link to="/edureka" className={`sidebar-home ${loc.pathname === '/edureka' ? 'active' : ''}`}>
              <span className="icon-emoji">📚</span> Edureka AI Docs
            </Link>
            <Link to="/ai-news" className={`sidebar-home ${loc.pathname === '/ai-news' ? 'active' : ''}`}>
              <span className="icon-emoji">📡</span> AI News Dashboard
            </Link>
            <Link to="/live-news" className={`sidebar-home ${loc.pathname === '/live-news' ? 'active' : ''}`}>
              <span className="icon-emoji">🔴</span> Live News Fetcher
            </Link>
            <Link to="/ai-tools" className={`sidebar-home ${loc.pathname === '/ai-tools' ? 'active' : ''}`}>
              <span className="icon-emoji">🤖</span> AI Tools Catalog
            </Link>
            <Link to="/github-repos" className={`sidebar-home ${loc.pathname === '/github-repos' ? 'active' : ''}`}>
              <span className="icon-emoji">📦</span> GitHub Repos
            </Link>
            <Link to="/tools" className={`sidebar-home ${loc.pathname === '/tools' ? 'active' : ''}`}>
              <span className="icon-emoji">🛠️</span> delphitools
            </Link>
            <Link to="/open-alternatives" className={`sidebar-home ${loc.pathname === '/open-alternatives' ? 'active' : ''}`}>
              <span className="icon-emoji">🔓</span> Open Alternatives
            </Link>
            <Link to="/integrations" className={`sidebar-home ${loc.pathname === '/integrations' ? 'active' : ''}`}>
              <span className="icon-emoji">🔌</span> Integrations
            </Link>
            <Link to="/books" className={`sidebar-home ${loc.pathname === '/books' ? 'active' : ''}`}>
              <span className="icon-emoji">📚</span> Book Catalog (10,100)
            </Link>
            <Link to="/playbook" className={`sidebar-home ${loc.pathname.startsWith('/playbook') ? 'active' : ''}`}>
              <span className="icon-emoji">📖</span> AI Engineering Playbook (70 pages)
            </Link>
            <Link to="/rapid-fire" className={`sidebar-home ${loc.pathname.startsWith('/rapid-fire') ? 'active' : ''}`}>
              <span className="icon-emoji">⚡</span> Rapid Fire Playbook
            </Link>
            <Link to="/ai-stack" className={`sidebar-home ${loc.pathname.startsWith('/ai-stack') ? 'active' : ''}`}>
              <span className="icon-emoji">🧠</span> AI Stack (68 tools, 1 screen)
            </Link>
            <Link to="/claude-cert" className={`sidebar-home ${loc.pathname.startsWith('/claude-cert') ? 'active' : ''}`}>
              <span className="icon-emoji">📜</span> Claude Certification
            </Link>
            {sidebarCategories.map((cat, ci) => (
              <div key={ci} className="sidebar-group">
                <div className="sidebar-group-label">{cat.label}</div>
                {cat.items.map(item => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`sidebar-link ${loc.pathname === item.path ? 'active' : ''}`}
                    onClick={() => setMenuOpen(false)}
                  >
                    <span className="icon-emoji">{item.icon}</span> {item.label}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </aside>
        <main className="main-content">{children}</main>
      </div>
      <footer className="app-footer">
        <strong>AI Knowledge Hub v2.0</strong> &mdash; {chapters.length} Chapters &middot; {deepDives.length} Deep Dives &middot; 50+ Code Examples &middot; 12 Architecture Diagrams &mdash; React + FastAPI
      </footer>
      <ChatWidget />
    </>
  )
}
