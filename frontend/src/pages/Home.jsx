import React, { useEffect, useState, useRef, useCallback } from 'react'
import ChapterCard from '../components/ChapterCard'
import { getChapters, getDeepDives, searchAll } from '../api'
import { Link } from 'react-router-dom'
import { FILE_CATEGORIES, CATEGORY_ICONS, KNOWLEDGE_SECTIONS, APP_STATS } from '../data/appData'

const DEEP_DIVE_CARDS = [
  { id: 'rag', icon: '🔍', title: 'RAG Pipeline Deep Dive', desc: 'Chunking, retrieval, evaluation in production', color: '#a6e3a1' },
  { id: 'agents', icon: '🤖', title: 'Agents & Multi-Agent Deep Dive', desc: 'LangGraph, CrewAI, MCP/A2A protocols', color: '#89b4fa' },
  { id: 'compliance', icon: '📋', title: 'GRC Compliance Deep Dive', desc: '500+ frameworks, EU AI Act, audit automation', color: '#f9e2af' },
  { id: 'security', icon: '🔐', title: 'AI Security & Guardrails Deep Dive', desc: 'Guardrail architecture, PII, adversarial testing', color: '#f38ba8' },
]

function localSearch(query, chapters, deepDives) {
  if (!query || query.length < 2) return null
  const q = query.toLowerCase()
  const results = []

  for (const ch of chapters) {
    let score = 0
    let snippet = ''
    if (ch.title.toLowerCase().includes(q)) { score += 5; snippet = ch.title }
    if (ch.preview && ch.preview.toLowerCase().includes(q)) { score += 3; if (!snippet) snippet = ch.preview.slice(0, 100) }
    for (const tag of (ch.tags || [])) {
      if (tag.toLowerCase().includes(q)) { score += 2 }
    }
    if ((ch.sections || []).some(s => (s.heading || '').toLowerCase().includes(q) || (s.text || '').toLowerCase().includes(q))) {
      score += 2
    }
    if (score > 0) {
      results.push({ type: 'chapter', chapter_id: ch.id, chapter_title: ch.title, snippet: snippet || ch.preview?.slice(0, 100) || '', score: Math.min(score / 10, 1) })
    }
  }

  for (const dd of deepDives) {
    let score = 0
    let snippet = ''
    if (dd.title.toLowerCase().includes(q)) { score += 5; snippet = dd.title }
    if ((dd.description || '').toLowerCase().includes(q)) { score += 3; if (!snippet) snippet = dd.description.slice(0, 100) }
    if (score > 0) {
      results.push({ type: 'deep-dive', chapter_id: dd.id, chapter_title: dd.title, snippet: snippet || dd.description?.slice(0, 100) || '', score: Math.min(score / 10, 1) })
    }
  }

  results.sort((a, b) => b.score - a.score)
  return results.slice(0, 8)
}

export default function Home() {
  const [chapters, setChapters] = useState([])
  const [deepDives, setDeepDives] = useState([])
  const [searchQ, setSearchQ] = useState('')
  const [searchResults, setSearchResults] = useState(null)
  const [searching, setSearching] = useState(false)
  const [instantResults, setInstantResults] = useState(null)
  const [showInstant, setShowInstant] = useState(false)
  const debounceRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    getChapters().then(setChapters).catch(() => setChapters([]))
    getDeepDives().then(data => setDeepDives(Array.isArray(data) ? data : [])).catch(() => setDeepDives([]))
  }, [])

  const handleInputChange = useCallback((e) => {
    const val = e.target.value
    setSearchQ(val)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (val.trim().length < 2 || !chapters.length) {
      setInstantResults(null)
      setShowInstant(false)
      return
    }
    setShowInstant(true)
    debounceRef.current = setTimeout(() => {
      const results = localSearch(val, chapters, deepDives)
      setInstantResults(results)
    }, 250)
  }, [chapters, deepDives])

  async function handleSearch(e) {
    e.preventDefault()
    setShowInstant(false)
    if (!searchQ.trim()) { setSearchResults(null); return }
    setSearching(true)
    try {
      const data = await searchAll(searchQ)
      setSearchResults(data)
    } catch { setSearchResults([]) }
    setSearching(false)
  }

  const clearSearch = () => {
    setSearchQ('')
    setSearchResults(null)
    setInstantResults(null)
    setShowInstant(false)
  }

  const numChapters = chapters.filter(c => c.id !== 'comprehensive-guide').length

  return (
    <div className="home">
      <div className="hero">
        <div className="hero-text">
          <h2>AI Knowledge Hub</h2>
          <p className="subtitle">RAG &middot; AI Agents &middot; Prompt Engineering &middot; Python &middot; FastAPI &middot; LangChain &middot; React &middot; Quantum &middot; Robotics &middot; 761+ Tools &middot; GRC &middot; System Design &middot; Career</p>
          <div className="stats-row">
            <span className="stat-badge">📂 <strong>{APP_STATS.chapters}</strong> Chapters</span>
            <span className="stat-badge">🔍 <strong>{APP_STATS.deepDives}</strong> Deep Dives</span>
            <span className="stat-badge">📁 <strong>{APP_STATS.categories}</strong> Categories</span>
            <span className="stat-badge">💼 <strong>{APP_STATS.totalJobs}</strong> AI Jobs</span>
            <span className="stat-badge">🌐 <strong>{APP_STATS.topgenaiJobs}</strong> TopGenAI Jobs</span>
            <span className="stat-badge">📐 <strong>{APP_STATS.knowledgeSections}</strong> Knowledge Sections</span>
            <span className="stat-badge">🗂️ <strong>{APP_STATS.totalFiles.toLocaleString()}+</strong> Files</span>
          </div>
        </div>
      </div>

      <div className="search-wrapper">
        <form className="search-bar" onSubmit={handleSearch}>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search chapters, deep dives, topics… (e.g. embeddings, RAG, guardrails, agent)"
            value={searchQ}
            onChange={handleInputChange}
            onFocus={() => { if (instantResults && instantResults.length > 0) setShowInstant(true) }}
            onBlur={() => setTimeout(() => setShowInstant(false), 200)}
          />
          <button type="submit">{searching ? '…' : '🔍'}</button>
          {(searchResults || searchQ) && (
            <button type="button" className="clear-search" onClick={clearSearch}>✕</button>
          )}
        </form>

        {showInstant && instantResults && instantResults.length > 0 && !searchResults && (
          <div className="instant-results">
            {instantResults.map((r, i) => (
              <Link
                key={i}
                to={r.type === 'deep-dive' ? `/deep-dive/${r.chapter_id}` : `/chapter/${r.chapter_id}`}
                className="instant-result-item"
                onClick={() => { setShowInstant(false); setSearchQ('') }}
              >
                <span className="ir-type">{r.type === 'deep-dive' ? '🔍' : '📖'}</span>
                <div className="ir-info">
                  <span className="ir-title">{r.chapter_title}</span>
                  <span className="ir-snippet">{r.snippet}</span>
                </div>
                <span className="ir-score">{Math.round(r.score * 100)}%</span>
              </Link>
            ))}
          </div>
        )}
      </div>

      {searchResults && (
        <div className="search-results">
          <div className="section-title">🔎 Search Results ({searchResults.total} hits)</div>
          {searchResults.results.length === 0 && <p className="empty-state">No results found.</p>}
          {searchResults.results.map((r, i) => (
            <Link key={i} to={r.type === 'deep-dive' ? `/deep-dive/${r.chapter_id}` : `/chapter/${r.chapter_id}`} className="search-result-item">
              <span className="sr-type">{r.type === 'deep-dive' ? '🔍' : '📖'}</span>
              <div className="sr-info">
                <span className="sr-title">{r.chapter_title}</span>
                <span className="sr-snippet">{r.section_heading ? `${r.section_heading}: ` : ''}{r.snippet}</span>
              </div>
              <span className="sr-score">{Math.round(r.score * 100)}%</span>
            </Link>
          ))}
        </div>
      )}

      <div className="featured-topics">
        <span className="section-title">⚡ Quick Access — Self-Contained Data Modules</span>
        <div className="cards-grid" style={{ marginBottom: 8 }}>
          {FILE_CATEGORIES.map((cat) => (
            <Link key={cat.id} to="/files" className="deep-dive-card" style={{ borderLeftColor: cat.color }}>
              <div className="dd-icon">{cat.icon}</div>
              <div className="dd-info"><h4>{cat.title}</h4><p>{cat.files.length} files • {cat.summary?.slice(0, 80) || ''}</p></div>
            </Link>
          ))}
          <Link to="/knowledge" className="deep-dive-card" style={{ borderLeftColor: '#a6e3a1' }}>
            <div className="dd-icon">📐</div>
            <div className="dd-info"><h4>Knowledge Base</h4><p>{APP_STATS.knowledgeSections} sections • Core AI architecture, protocols, patterns</p></div>
          </Link>
          <Link to="/jobs" className="deep-dive-card" style={{ borderLeftColor: '#f38ba8' }}>
            <div className="dd-icon">💼</div>
            <div className="dd-info"><h4>AI Jobs</h4><p>{APP_STATS.totalJobs} engineering jobs • SuperAIDevs + TopGenAIJobs</p></div>
          </Link>
          <Link to="/edureka" className="deep-dive-card" style={{ borderLeftColor: '#cba6f7' }}>
            <div className="dd-icon">📚</div>
            <div className="dd-info"><h4>Edureka AI Docs</h4><p>Curated AI documents • Generative AI program, tools, career</p></div>
          </Link>
          <Link to="/ai-news" className="deep-dive-card" style={{ borderLeftColor: '#06b6d4' }}>
            <div className="dd-icon">📡</div>
            <div className="dd-info"><h4>AI News Dashboard</h4><p>News sites, GitHub repos, cloud stack, tools, APIs</p></div>
          </Link>
          <Link to="/live-news" className="deep-dive-card" style={{ borderLeftColor: '#ef4444' }}>
            <div className="dd-icon">🔴</div>
            <div className="dd-info"><h4>Live News Fetcher</h4><p>Real-time news from 40+ AI websites via RSS feeds</p></div>
          </Link>
          <Link to="/books" className="deep-dive-card" style={{ borderLeftColor: '#f9c74f' }}>
            <div className="dd-icon">📚</div>
            <div className="dd-info"><h4>Book Catalog</h4><p>10,100 books • Personal growth, money making & best star reads</p></div>
          </Link>
          <Link to="/claude-cert" className="deep-dive-card" style={{ borderLeftColor: '#d97757' }}>
            <div className="dd-icon">📜</div>
            <div className="dd-info"><h4>Claude Certification</h4><p>Pricing, study videos & links • 68 supporting AI tools reference</p></div>
          </Link>
        </div>
      </div>

      <div className="featured-topics">
        <span className="section-title">⚡ Emerging Tech Topics</span>
        <div className="cards-grid">
          {chapters
            .filter(c => ['python-for-ai', 'fastapi-ai-services', 'langchain-llamaindex', 'react-ai-frontend', 'quantum-computing', 'robotics-ai', 'ai-semiconductor'].includes(c.id))
            .map(c => (
              <Link key={c.id} to={`/chapter/${c.id}`} className="deep-dive-card" style={{ borderLeftColor: '#89b4fa' }}>
                <div className="dd-icon">{c.icon}</div>
                <div className="dd-info"><h4>{c.title}</h4><p>{c.preview?.slice(0, 80) || ''}</p></div>
              </Link>
            ))}
        </div>
      </div>

      <div className="section-title">🔍 Deep Dives</div>
      <div className="cards-grid">
        {deepDives.length > 0 ? deepDives.map(dd => (
          <Link key={dd.id} to={`/deep-dive/${dd.id}`} className="deep-dive-card" style={{ borderLeftColor: dd.color || '#89b4fa' }}>
            <div className="dd-icon">{dd.icon || '📚'}</div>
            <div className="dd-info">
              <h4>{dd.title}</h4>
              <p>{dd.description || dd.preview || ''}</p>
            </div>
          </Link>
        )) : DEEP_DIVE_CARDS.map(dd => (
          <Link key={dd.id} to={`/deep-dive/${dd.id}`} className="deep-dive-card" style={{ borderLeftColor: dd.color }}>
            <div className="dd-icon">{dd.icon}</div>
            <div className="dd-info">
              <h4>{dd.title}</h4>
              <p>{dd.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="section-title">📖 All Chapters</div>
      {chapters.length === 0 && <p className="empty-state">📚 Loading chapters… (all data is self-contained, no backend needed)</p>}
      <div className="chapters-list">
        {chapters.filter(c => c.id !== 'comprehensive-guide').map(ch => <ChapterCard key={ch.id} chapter={ch} />)}
      </div>
    </div>
  )
}
