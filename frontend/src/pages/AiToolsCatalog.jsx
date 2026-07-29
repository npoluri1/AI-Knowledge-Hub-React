import React, { useState, useMemo, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import AI_TOOLS_CATALOG, { TOOL_CATEGORIES, CATEGORY_META } from '../data/aiToolsCatalog'
import IndustryMatrix from './IndustryMatrix'

export default function AiToolsCatalog() {
  const [activeTab, setActiveTab] = useState('tools')
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const gridRef = useRef(null)
  const categoryRefs = useRef({})

  return (
    <div className="ai-tools-catalog">
      <Link to="/" className="back-link">← Back to Home</Link>

      <div className="atc-header">
        <h1 className="chapter-title">🤖 AI Tools & Agents Catalog</h1>
        <p className="chapter-preview">
          {AI_TOOLS_CATALOG.length} AI tools & agents across {TOOL_CATEGORIES.length} categories — coding, video, voice, business, research, and more.
          Compiled May 2026 from Edureka AI Knowledge Hub.
        </p>
      </div>

      {/* Tab Switcher */}
      <div className="atc-tabs">
        <button
          className={`atc-tab ${activeTab === 'tools' ? 'atc-tab-active' : ''}`}
          onClick={() => setActiveTab('tools')}
        >
          🤖 AI Tools
        </button>
        <button
          className={`atc-tab ${activeTab === 'matrix' ? 'atc-tab-active' : ''}`}
          onClick={() => setActiveTab('matrix')}
        >
          🌐 Industry Matrix
        </button>
      </div>

      {activeTab === 'tools' ? (
        <ToolsView
          search={search}
          setSearch={setSearch}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          gridRef={gridRef}
          categoryRefs={categoryRefs}
        />
      ) : (
        <IndustryMatrix />
      )}
    </div>
  )
}

function ToolsView({ search, setSearch, activeCategory, setActiveCategory, gridRef, categoryRefs }) {
  const categoryCounts = useMemo(() => {
    const counts = { All: AI_TOOLS_CATALOG.length }
    AI_TOOLS_CATALOG.forEach(t => {
      counts[t.category] = (counts[t.category] || 0) + 1
    })
    return counts
  }, [])

  const filteredTools = useMemo(() => {
    return AI_TOOLS_CATALOG.filter(t => {
      const matchesCategory = activeCategory === 'All' || t.category === activeCategory
      const matchesSearch = !search ||
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase()) ||
        t.category.toLowerCase().includes(search.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [activeCategory, search])

  const groupedTools = useMemo(() => {
    const groups = {}
    filteredTools.forEach(t => {
      if (!groups[t.category]) groups[t.category] = []
      groups[t.category].push(t)
    })
    return groups
  }, [filteredTools])

  const scrollToCategory = (cat) => {
    setActiveCategory(cat)
    if (cat !== 'All' && categoryRefs.current[cat]) {
      categoryRefs.current[cat].scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else if (cat === 'All' && gridRef.current) {
      gridRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <>
      <div className="atc-controls">
        <div className="atc-search-box">
          <span className="atc-search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search tools, descriptions..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="atc-search-input"
          />
          {search && (
            <button className="atc-search-clear" onClick={() => setSearch('')}>✕</button>
          )}
        </div>
      </div>

      <div className="atc-stats">
        <span className="stat-badge">🤖 <strong>{filteredTools.length}</strong> Tools</span>
        <span className="stat-badge">📂 <strong>{Object.keys(groupedTools).length}</strong> Categories</span>
      </div>

      <div className="atc-layout">
        {/* Sticky Sidebar */}
        <aside className="atc-sidebar">
          <button
            className={`atc-sidebar-btn ${activeCategory === 'All' ? 'atc-active' : ''}`}
            onClick={() => scrollToCategory('All')}
          >
            <span className="atc-sidebar-icon">🌐</span>
            <span className="atc-sidebar-label">All</span>
            <span className="atc-sidebar-count">{categoryCounts.All}</span>
          </button>
          {TOOL_CATEGORIES.map(cat => {
            const meta = CATEGORY_META[cat]
            const count = categoryCounts[cat] || 0
            if (count === 0) return null
            return (
              <button
                key={cat}
                className={`atc-sidebar-btn ${activeCategory === cat ? 'atc-active' : ''}`}
                onClick={() => scrollToCategory(cat)}
                style={activeCategory === cat ? { borderColor: meta.color, background: `${meta.color}10` } : undefined}
              >
                <span className="atc-sidebar-icon">{meta.icon}</span>
                <span className="atc-sidebar-label">{cat}</span>
                <span className="atc-sidebar-count">{count}</span>
              </button>
            )
          })}
        </aside>

        {/* Main Content */}
        <main className="atc-main" ref={gridRef}>
          {/* Category Tabs (horizontal scroll for mobile) */}
          <div className="atc-category-tabs">
            <button
              className={`atc-cat-tab ${activeCategory === 'All' ? 'atc-active' : ''}`}
              onClick={() => scrollToCategory('All')}
            >
              <span className="atc-cat-icon">🌐</span>
              <span>All</span>
              <span className="atc-cat-count">{categoryCounts.All}</span>
            </button>
            {TOOL_CATEGORIES.map(cat => {
              const meta = CATEGORY_META[cat]
              const count = categoryCounts[cat] || 0
              if (count === 0) return null
              return (
                <button
                  key={cat}
                  className={`atc-cat-tab ${activeCategory === cat ? 'atc-active' : ''}`}
                  onClick={() => scrollToCategory(cat)}
                  style={activeCategory === cat ? { borderColor: meta.color, background: `${meta.color}10` } : undefined}
                >
                  <span className="atc-cat-icon">{meta.icon}</span>
                  <span>{cat}</span>
                  <span className="atc-cat-count">{count}</span>
                </button>
              )
            })}
          </div>

          {/* Tool Cards by Category */}
          {activeCategory === 'All' ? (
            Object.entries(groupedTools).map(([category, tools]) => {
              const meta = CATEGORY_META[category] || { icon: '📁', color: '#64748b' }
              return (
                <div
                  key={category}
                  className="atc-category-section"
                  ref={el => { categoryRefs.current[category] = el }}
                >
                  <div className="atc-category-header" style={{ borderLeftColor: meta.color }}>
                    <span className="atc-category-icon" style={{ background: meta.color }}>{meta.icon}</span>
                    <h2 className="atc-category-title">{category}</h2>
                    <span className="atc-category-badge" style={{ background: `${meta.color}15`, color: meta.color, border: `1px solid ${meta.color}30` }}>
                      {tools.length} {tools.length === 1 ? 'tool' : 'tools'}
                    </span>
                  </div>
                  <div className="atc-tools-grid">
                    {tools.map((tool, i) => (
                      <ToolCard key={`${category}-${i}`} tool={tool} color={meta.color} />
                    ))}
                  </div>
                </div>
              )
            })
          ) : (
            <div
              className="atc-tools-grid atc-single-category"
              ref={el => { categoryRefs.current[activeCategory] = el }}
            >
              {filteredTools.map((tool, i) => (
                <ToolCard
                  key={`${activeCategory}-${i}`}
                  tool={tool}
                  color={(CATEGORY_META[activeCategory] || {}).color || '#64748b'}
                />
              ))}
            </div>
          )}

          {filteredTools.length === 0 && (
            <div className="atc-empty">
              <span className="atc-empty-icon">🔍</span>
              <p>No tools match your search. Try different keywords.</p>
            </div>
          )}

          <div className="atc-footer">
            <p>— AI Tools & Agents Catalog ({AI_TOOLS_CATALOG.length} tools) | Compiled May 2026 —</p>
          </div>
        </main>
      </div>
    </>
  )
}

function ToolCard({ tool, color }) {
  const handleClick = () => {
    if (tool.url) window.open(tool.url, '_blank', 'noopener,noreferrer')
  }
  return (
    <div
      className={`atc-tool-card ${tool.url ? 'atc-clickable' : ''}`}
      style={{ '--tool-accent': color }}
      onClick={handleClick}
      role={tool.url ? 'button' : undefined}
      tabIndex={tool.url ? 0 : undefined}
      onKeyDown={e => { if (e.key === 'Enter' && tool.url) handleClick() }}
    >
      <div className="atc-tool-icon" style={{ background: `${color}15`, color }}>
        {tool.icon}
      </div>
      <div className="atc-tool-body">
        <h3 className="atc-tool-name">
          {tool.name}
          {tool.url && <span className="atc-external-icon">↗</span>}
        </h3>
        <span className="atc-tool-desc">{tool.description}</span>
      </div>
      <div className="atc-tool-category" style={{ background: `${color}10`, color, border: `1px solid ${color}25` }}>
        {tool.category}
      </div>
    </div>
  )
}
