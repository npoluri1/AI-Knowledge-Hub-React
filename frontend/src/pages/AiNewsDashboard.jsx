import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import RichText from '../components/RichText'
import fileManifest from '../fileManifest.json'

const EDUREKHA_SLUG = 'edurekha_docs'

// Maps document filename substrings to internal routes.
// Cards matching these will navigate to the route instead of loading markdown.
const ROUTE_MAP = {
  'agent_skills_tools_catalog': '/ai-tools',
  'ai_tools_catalog': '/ai-tools',
}

// Manifest may contain /api/raw/edurekha_docs/... URLs (when STATIC_EXTRAS=false).
// The files are also mirrored in frontend/public/edurekha_docs/ so they can be
// served directly by Vite without the backend.
function staticUrl(url) {
  if (!url) return url
  return url.replace(/^\/api\/raw\/edurekha_docs\//, '/edurekha_docs/')
}

const CATEGORY_MAP = {
  'edureka_ai_news_sites_blogs_newsletters': { icon: '📰', color: '#3b82f6', category: 'News & Sources' },
  'edureka_ai_github_repos_catalog': { icon: '💻', color: '#8b5cf6', category: 'GitHub Repos' },
  'edureka_ai_cloud_tech_stack': { icon: '☁️', color: '#06b6d4', category: 'Cloud Tech Stack' },
  'edureka_agent_skills_tools_catalog': { icon: '🤖', color: '#f59e0b', category: 'AI Agents & Tools' },
  'edureka_free_ai_coding_tools': { icon: '🆓', color: '#10b981', category: 'Free Coding Tools' },
  'edureka_open_alternatives_directories': { icon: '🔄', color: '#ec4899', category: 'Open Alternatives' },
  'edureka_free_model_api_keys': { icon: '🔑', color: '#f97316', category: 'Free API Keys' },
  'edureka_realtime_projects_usecases': { icon: '🚀', color: '#ef4444', category: 'Real-Time Projects' },
  'edureka_api_cookbooks_quickstart': { icon: '📖', color: '#84cc16', category: 'API Cookbooks' },
  'edureka_daily_essential_learning_roadmap': { icon: '🎯', color: '#ef4444', category: 'Learning Roadmap' },
  'system_prompt': { icon: '⚙️', color: '#64748b', category: 'Core Program' },
  'generative_ai_masters_program': { icon: '🎓', color: '#7c3aed', category: 'Core Program' },
  'generative_ai_masters_program_final': { icon: '🎓', color: '#7c3aed', category: 'Core Program' },
  'generative_ai_masters_program_final_latest': { icon: '🎓', color: '#7c3aed', category: 'Core Program' },
  'phase_1_3': { icon: '📘', color: '#2563eb', category: 'Core Program' },
  'phase_4_5': { icon: '📗', color: '#16a34a', category: 'Core Program' },
  'phase_6_specialized': { icon: '📙', color: '#ea580c', category: 'Core Program' },
  'enhance_c1': { icon: '📕', color: '#dc2626', category: 'Core Program' },
  'enhance_c2': { icon: '📕', color: '#dc2626', category: 'Core Program' },
  'enhance_c3': { icon: '📕', color: '#dc2626', category: 'Core Program' },
  'enhance_c4': { icon: '📕', color: '#dc2626', category: 'Core Program' },
  'enhance_c5': { icon: '📕', color: '#dc2626', category: 'Core Program' },
  'global_projects': { icon: '🌍', color: '#0891b2', category: 'Core Program' },
  'resource_map': { icon: '🗺️', color: '#7c3aed', category: 'Core Program' },
  'resource_map_supplement': { icon: '🗺️', color: '#7c3aed', category: 'Core Program' },
  'reference_library': { icon: '📚', color: '#4f46e5', category: 'Core Program' },
  'ai_tools_catalog': { icon: '🛠️', color: '#d946ef', category: 'Core Program' },
  'ai_career_survival_plan': { icon: '💼', color: '#0d9488', category: 'Core Program' },
  'supplementary': { icon: '📎', color: '#6b7280', category: 'Core Program' },
}

function getMeta(filename) {
  const lower = filename.toLowerCase()
  for (const [key, meta] of Object.entries(CATEGORY_MAP)) {
    if (lower.includes(key)) return meta
  }
  return { icon: '📄', color: '#64748b', category: 'Other' }
}

function docTitle(name) {
  return name
    .replace(/^edureka_/, '')
    .replace(/\.md$/, '')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
}

export default function AiNewsDashboard() {
  const navigate = useNavigate()
  const [docs, setDocs] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedDoc, setSelectedDoc] = useState(null)
  const [docContent, setDocContent] = useState(null)
  const [contentLoading, setContentLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState('All')
  const contentRef = useRef(null)

  useEffect(() => {
    const allFiles = fileManifest.allFiles || []
    const edurekaFiles = allFiles
      .filter(f => f.bucket === 'dataFiles' && f.folder === EDUREKHA_SLUG && f.ext === '.md')
      .map(f => {
        const lower = f.name.toLowerCase()
        let route = null
        for (const [key, path] of Object.entries(ROUTE_MAP)) {
          if (lower.includes(key)) { route = path; break }
        }
        return {
          ...f,
          meta: getMeta(f.name),
          title: docTitle(f.display_name || f.name),
          route,
        }
      })
      .sort((a, b) => a.title.localeCompare(b.title))

    setDocs(edurekaFiles)
    setLoading(false)
  }, [])

  const categories = ['All', ...new Set(docs.map(d => d.meta.category))]

  const filteredDocs = docs.filter(d => {
    const matchesSearch = !searchQuery ||
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = filterCategory === 'All' || d.meta.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const loadDoc = async (doc) => {
    setSelectedDoc(doc)
    setDocContent(null)
    setContentLoading(true)
    try {
      const url = staticUrl(doc.url) || `/edurekha_docs/${encodeURIComponent(doc.name)}`
      const res = await fetch(url)
      const text = res.ok ? await res.text() : `Failed to load ${doc.display_name} (${res.status})`
      setDocContent(text)
    } catch (e) {
      setDocContent(`Error loading: ${e.message}`)
    }
    setContentLoading(false)
  }

  const closeDoc = () => {
    setSelectedDoc(null)
    setDocContent(null)
  }

  if (selectedDoc) {
    return (
      <div className="ai-news-dashboard">
        <div className="news-doc-viewer">
          <div className="news-doc-header">
            <button className="news-back-btn" onClick={closeDoc}>← Back to Dashboard</button>
            <div className="news-doc-title-bar">
              <span className="news-doc-icon" style={{ background: selectedDoc.meta.color }}>{selectedDoc.meta.icon}</span>
              <div>
                <h2 className="news-doc-title">{selectedDoc.title}</h2>
                <span className="news-doc-meta">{selectedDoc.meta.category} · {selectedDoc.size}</span>
              </div>
            </div>
          </div>
          <div className="news-doc-content" ref={contentRef}>
            {contentLoading ? (
              <div className="news-loading">
                <div className="news-spinner" />
                <p>Loading content...</p>
              </div>
            ) : docContent ? (
              <RichText content={docContent} />
            ) : null}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="ai-news-dashboard">
      <Link to="/" className="back-link">← Back to Home</Link>
      <div className="news-header">
        <h2 className="chapter-title">📡 AI Daily News & Resources Dashboard</h2>
        <p className="chapter-preview">
          Browse {docs.length} AI resource documents — news sites, GitHub repos, cloud stack, tools, APIs, projects, and more.
          Click any card to load its full content.
        </p>
      </div>

      <div className="news-controls">
        <div className="news-search-box">
          <span className="news-search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="news-search-input"
          />
          {searchQuery && (
            <button className="news-search-clear" onClick={() => setSearchQuery('')}>✕</button>
          )}
        </div>
        <div className="news-filters">
          {categories.map(cat => (
            <button
              key={cat}
              className={`news-filter-btn ${filterCategory === cat ? 'active' : ''}`}
              onClick={() => setFilterCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="news-stats">
        <span className="stat-badge">📄 <strong>{filteredDocs.length}</strong> Documents</span>
        <span className="stat-badge">📂 <strong>{categories.length - 1}</strong> Categories</span>
        {loading && <span className="stat-badge edureka-loading-indicator">⏳ Loading…</span>}
      </div>

      {loading ? (
        <div className="news-loading">
          <div className="news-spinner" />
          <p>Loading document catalog...</p>
        </div>
      ) : (
        <div className="news-grid">
          {filteredDocs.map((doc, i) => (
            <div
              key={i}
              className={`news-card ${doc.route ? 'news-card-routed' : ''}`}
              onClick={() => doc.route ? navigate(doc.route) : loadDoc(doc)}
              style={{ '--card-accent': doc.meta.color }}
            >
              <div className="news-card-icon" style={{ background: doc.meta.color }}>
                {doc.meta.icon}
              </div>
              <div className="news-card-body">
                <h3 className="news-card-title">
                  {doc.title}
                  {doc.route && <span className="news-card-route-badge">Open →</span>}
                </h3>
                <span className="news-card-category">{doc.meta.category}</span>
                <span className="news-card-size">{doc.size}</span>
              </div>
              <div className="news-card-arrow">{doc.route ? '↗' : '→'}</div>
            </div>
          ))}
          {filteredDocs.length === 0 && (
            <div className="news-empty">
              <p>No documents match your search.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
