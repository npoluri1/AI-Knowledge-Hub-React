import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import RichText from '../components/RichText'
import fileManifest from '../fileManifest.json'

const EDUREKHA_SLUG = 'edurekha_docs'

// Manifest may contain /api/raw/edurekha_docs/... URLs (when STATIC_EXTRAS=false).
// The files are also mirrored in frontend/public/edurekha_docs/ so they can be
// served directly by Vite without the backend. Rewrite to the static path.
function staticUrl(url) {
  if (!url) return url
  return url.replace(/^\/api\/raw\/edurekha_docs\//, '/edurekha_docs/')
}

const SORT_ORDER = [
  'system_prompt',
  'generative_ai_masters_program',
  'generative_ai_masters_program_final',
  'generative_ai_masters_program_final_latest',
  'phase_1_3',
  'phase_4_5',
  'phase_6_specialized',
  'enhance_c1',
  'enhance_c2',
  'enhance_c3',
  'enhance_c4',
  'enhance_c5',
  'global_projects',
  'resource_map',
  'resource_map_supplement',
  'reference_library',
  'ai_tools_catalog',
  'ai_career_survival_plan',
  'daily_essential',
  'agent_skills_tools_catalog',
  'free_ai_coding_tools',
  'ai_github_repos_catalog',
  'ai_cloud_tech_stack',
  'open_alternatives_directories',
  'free_model_api_keys',
  'realtime_projects_usecases',
  'api_cookbooks_quickstart',
  'ai_news_sites_blogs_newsletters',
  'supplementary',
]

function docTitle(name) {
  return name
    .replace(/^edureka_/, '')
    .replace(/\.md$/, '')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
}

function docSortKey(name) {
  const lower = name.toLowerCase()
  const idx = SORT_ORDER.findIndex(k => lower.includes(k))
  return idx >= 0 ? idx : SORT_ORDER.length
}

export default function EdurekaDocsView() {
  const [docs, setDocs] = useState([])
  const [sections, setSections] = useState([])
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState({ loaded: 0, total: 0 })
  const [activeNav, setActiveNav] = useState(null)
  const contentRef = useRef(null)
  const sectionRefs = useRef({})

  useEffect(() => {
    const allFiles = fileManifest.allFiles || []
    const edurekaFiles = allFiles
      .filter(f => f.bucket === 'dataFiles' && f.folder === EDUREKHA_SLUG && f.ext === '.md')
      .sort((a, b) => docSortKey(a.name) - docSortKey(b.name) || a.name.localeCompare(b.name))

    setDocs(edurekaFiles)
    setProgress({ loaded: 0, total: edurekaFiles.length })
    setLoading(true)

    let loaded = 0
    const results = []

    const fetchAll = edurekaFiles.map(async (doc, i) => {
      try {
        const url = staticUrl(doc.url) || `/edurekha_docs/${encodeURIComponent(doc.name)}`
        const res = await fetch(url)
        const text = res.ok ? await res.text() : `// Failed to load ${doc.display_name} (${res.status})`
        results[i] = { doc, content: text, error: null }
      } catch (e) {
        results[i] = { doc, content: null, error: e.message }
      }
      loaded++
      setProgress({ loaded, total: edurekaFiles.length })
    })

    Promise.all(fetchAll).then(() => {
      setSections(results.filter(Boolean))
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    if (sections.length === 0) return
    const container = contentRef.current
    if (!container) return

    const handleScroll = () => {
      const scrollTop = container.scrollTop
      let current = null
      for (const [key, el] of Object.entries(sectionRefs.current)) {
        if (el && el.offsetTop - 120 <= scrollTop) {
          current = key
        }
      }
      if (current !== activeNav) setActiveNav(current)
    }

    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => container.removeEventListener('scroll', handleScroll)
  }, [sections, activeNav])

  const scrollTo = (key) => {
    const el = sectionRefs.current[key]
    if (el && contentRef.current) {
      contentRef.current.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' })
    }
  }

  return (
    <div className="edureka-docs">
      <Link to="/" className="back-link">← Back to Home</Link>
      <h2 className="chapter-title">📚 Edureka Generative AI Master Program</h2>
      <p className="chapter-preview">
        {docs.length} documents loaded sequentially — system prompts, phases, tools, projects, career plans.
        Scroll through the full program content or use the sidebar to jump to a section.
      </p>

      <div className="edureka-stats">
        <span className="stat-badge">📄 <strong>{docs.length}</strong> Documents</span>
        <span className="stat-badge">📖 <strong>{progress.loaded}</strong> / {progress.total} Loaded</span>
        {loading && <span className="stat-badge edureka-loading-indicator">⏳ Fetching…</span>}
        {!loading && <span className="stat-badge">✅ All loaded</span>}
      </div>

      {loading && (
        <div className="edureka-progress-bar">
          <div
            className="edureka-progress-fill"
            style={{ width: `${progress.total ? (progress.loaded / progress.total) * 100 : 0}%` }}
          />
        </div>
      )}

      <div className="edureka-layout">
        {/* Table of Contents / Navigation Sidebar */}
        <nav className="edureka-toc">
          <div className="edureka-toc-title">📖 Contents</div>
          {sections.map((sec, i) => (
            <div
              key={i}
              className={`edureka-toc-item ${activeNav === sec.doc.name ? 'active' : ''}`}
              onClick={() => scrollTo(sec.doc.name)}
            >
              <span className="edureka-toc-num">{i + 1}</span>
              <span className="edureka-toc-label">{docTitle(sec.doc.display_name)}</span>
            </div>
          ))}
        </nav>

        {/* Sequential Content */}
        <div className="edureka-content" ref={contentRef}>
          {sections.length === 0 && !loading && (
            <p className="empty-state">No documents found. Make sure the manifest has been regenerated.</p>
          )}

          {sections.map((sec, i) => (
            <div
              key={i}
              className="edureka-section"
              ref={el => { sectionRefs.current[sec.doc.name] = el }}
            >
              <div className="edureka-section-header">
                <div className="edureka-section-num">{i + 1}</div>
                <div className="edureka-section-meta">
                  <h2 className="edureka-section-title">{docTitle(sec.doc.display_name)}</h2>
                  <span className="edureka-section-info">{sec.doc.size} · {sec.doc.type} · {sec.doc.display_name}</span>
                </div>
                <a
                  href={staticUrl(sec.doc.url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="edureka-section-open"
                  onClick={e => e.stopPropagation()}
                >
                  ↗
                </a>
              </div>

              <div className="edureka-section-body">
                {sec.error ? (
                  <div className="edureka-section-error">
                    <p>Error loading: {sec.error}</p>
                  </div>
                ) : sec.content ? (
                  <div className="edureka-rich-text-wrapper">
                    <RichText content={sec.content} />
                  </div>
                ) : null}
              </div>

              {i < sections.length - 1 && <div className="edureka-section-divider" />}
            </div>
          ))}

          <div className="edureka-end-marker">
            <p>— End of Edureka Generative AI Master Program ({sections.length} documents) —</p>
          </div>
        </div>
      </div>
    </div>
  )
}
