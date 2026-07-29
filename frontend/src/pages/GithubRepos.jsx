import React, { useState, useMemo, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import { GITHUB_REPOS, REPO_CATEGORIES } from '../data/githubRepos'
import { searchGitHubRepos } from '../api'
import './GithubRepos.css'

const CATEGORY_COLORS = ['blue', 'purple', 'green', 'pink', 'yellow', 'teal', 'blue', 'purple', 'green', 'pink', 'blue', 'green', 'pink', 'yellow', 'teal', 'purple', 'red']
const CATEGORY_ICONS = {
  'LLM Frameworks and Orchestrators': '\u{1F517}',
  'LLM Frameworks & Orchestrators': '\u{1F517}',
  'Vector Databases and RAG': '\u{1F5C4}',
  'Vector Databases & RAG': '\u{1F5C4}',
  'Model Serving and Inference': '\u26A1',
  'Model Serving & Inference': '\u26A1',
  'AI Agents and Tools': '\u{1F916}',
  'AI Agents & Tools': '\u{1F916}',
  'Computer Vision and Multimodal': '\u{1F441}\u{FE0F}',
  'Computer Vision & Multimodal': '\u{1F441}\u{FE0F}',
  'Speech and Audio AI': '\u{1F3A4}',
  'Speech & Audio AI': '\u{1F3A4}',
  'Data and Training': '\u{1F4CA}',
  'Data & Training': '\u{1F4CA}',
  'AI Apps and Demos': '\u{1F680}',
  'AI Apps & Demos': '\u{1F680}',
  'MLOps and Infra': '\u{1F3D7}\u{FE0F}',
  'MLOps & Infra': '\u{1F3D7}\u{FE0F}',
  'Security and Guardrails': '\u{1F6E1}\u{FE0F}',
  'Security & Guardrails': '\u{1F6E1}\u{FE0F}',
  'AI Coding & Software Engineering': '\u{1F4BB}',
  'AI Web Applications': '\u{1F310}',
  'AI Mobile Applications': '\u{1F4F1}',
  'Spring AI & Enterprise': '\u2615',
  'Observability & Evaluations': '\u{1F4CA}',
  'Prompt Engineering & Fine-Tuning': '\u{1F4DD}',
  'AI Design Patterns & Architecture': '\u{1F3DB}\u{FE0F}',
}
const TECH_STACK = [
  { label: 'AI/ML', color: 'blue' },
  { label: 'Agents', color: 'purple' },
  { label: 'Python', color: 'green' },
  { label: 'FastAPI', color: 'teal' },
  { label: 'React', color: 'blue' },
  { label: 'Next.js', color: 'pink' },
  { label: 'RAG', color: 'purple' },
  { label: 'MCP', color: 'yellow' },
  { label: 'LangChain', color: 'blue' },
  { label: 'LangGraph', color: 'green' },
  { label: 'VectorDB', color: 'purple' },
  { label: 'CrewAI', color: 'pink' },
  { label: 'Tool Calling', color: 'yellow' },
  { label: 'Memory', color: 'teal' },
  { label: 'GuardRails', color: 'red' },
  { label: 'REAct', color: 'blue' },
  { label: 'Fine-Tuning', color: 'green' },
  { label: 'MLOps', color: 'purple' },
  { label: 'Embeddings', color: 'pink' },
  { label: 'Observability', color: 'yellow' },
  { label: 'Governance', color: 'red' },
  { label: 'Spring AI', color: 'teal' },
  { label: 'Mobile', color: 'pink' },
  { label: 'Web Apps', color: 'blue' },
  { label: 'Prompting', color: 'green' },
  { label: 'Design Patterns', color: 'purple' },
  { label: 'Evaluations', color: 'yellow' },
  { label: 'Software Eng', color: 'teal' },
]

const FETCH_TOPICS = [
  { label: 'AI/ML', topic: 'ai+machine-learning', color: 'blue' },
  { label: 'AI Agents', topic: 'ai-agents', color: 'purple' },
  { label: 'Multi-Agents', topic: 'multi-agent', color: 'purple' },
  { label: 'Python', topic: 'python', color: 'green' },
  { label: 'FastAPI', topic: 'fastapi', color: 'teal' },
  { label: 'ReactJS', topic: 'react', color: 'blue' },
  { label: 'NextJS', topic: 'nextjs', color: 'pink' },
  { label: 'RAG', topic: 'rag', color: 'yellow' },
  { label: 'MCP', topic: 'mcp', color: 'yellow' },
  { label: 'LangChain', topic: 'langchain', color: 'blue' },
  { label: 'LangGraph', topic: 'langgraph', color: 'green' },
  { label: 'VectorDB', topic: 'vector-database', color: 'purple' },
  { label: 'CrewAI', topic: 'crewai', color: 'pink' },
  { label: 'Tool Calling', topic: 'tool-calling+function-calling', color: 'yellow' },
  { label: 'Memory', topic: 'memory-management', color: 'teal' },
  { label: 'Spring AI', topic: 'spring-ai', color: 'teal' },
  { label: 'GuardRails', topic: 'guardrails', color: 'red' },
  { label: 'REAct', topic: 'react-pattern', color: 'blue' },
  { label: 'Fine-Tuning', topic: 'fine-tuning+lora+qlora', color: 'green' },
  { label: 'MLOps', topic: 'mlops', color: 'purple' },
  { label: 'Embeddings', topic: 'embeddings', color: 'pink' },
  { label: 'Observability', topic: 'observability+evaluation', color: 'yellow' },
  { label: 'LlamaIndex', topic: 'llamaindex', color: 'green' },
  { label: 'LLMs', topic: 'llm+large-language-model', color: 'blue' },
  { label: 'Prompting', topic: 'prompt-engineering', color: 'green' },
  { label: 'AutoGen', topic: 'autogen', color: 'purple' },
  { label: 'Agent Gateway', topic: 'ai-gateway', color: 'teal' },
  { label: 'Agent Loops', topic: 'agent-loop', color: 'pink' },
  { label: 'AI Graphs', topic: 'ai-graph', color: 'yellow' },
  { label: 'Evaluations', topic: 'llm-evaluation', color: 'yellow' },
  { label: 'Agent Awareness', topic: 'agent-awareness', color: 'purple' },
  { label: 'AI Patterns', topic: 'ai-design-patterns', color: 'red' },
  { label: 'Governance', topic: 'ai-governance', color: 'red' },
  { label: 'Looping', topic: 'agent-looping', color: 'teal' },
  { label: 'Graphics', topic: 'ai-graphics+computer-vision', color: 'pink' },
  { label: 'MCP Servers', topic: 'mcp-server', color: 'yellow' },
  { label: 'AI Gateways', topic: 'ai-gateway+agent-gateway', color: 'blue' },
  { label: 'REAct Patterns', topic: 'react-agent', color: 'green' },
]

const INITIAL_VISIBLE = 12

function parseStars(starsStr) {
  const s = String(starsStr)
  const num = parseFloat(s)
  if (s.toLowerCase().includes('k')) return num * 1000
  return num || 0
}

export default function GithubRepos() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [sortBy, setSortBy] = useState('stars')
  const [cloneModal, setCloneModal] = useState(null)
  const [copiedIdx, setCopiedIdx] = useState(null)
  const [visibleCounts, setVisibleCounts] = useState({})
  const [fetchModal, setFetchModal] = useState(false)
  const [fetching, setFetching] = useState(false)
  const [fetchedRepos, setFetchedRepos] = useState(null)
  const [fetchError, setFetchError] = useState(null)
  const [selectedTopics, setSelectedTopics] = useState([])
  const [fetchMode, setFetchMode] = useState('topics')
  const [fetchQuery, setFetchQuery] = useState('')
  const categoriesRef = useRef(null)

  const categoryCounts = useMemo(() => {
    const counts = { All: GITHUB_REPOS.length }
    GITHUB_REPOS.forEach(r => {
      counts[r.category] = (counts[r.category] || 0) + 1
    })
    return counts
  }, [])

  const filteredRepos = useMemo(() => {
    let repos = GITHUB_REPOS.filter(r => {
      const matchCat = activeCategory === 'All' || r.category === activeCategory
      const q = search.toLowerCase()
      const matchSearch = !q ||
        r.name.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q) ||
        r.features.some(f => f.toLowerCase().includes(q)) ||
        r.useCase.toLowerCase().includes(q)
      return matchCat && matchSearch
    })
    repos.sort((a, b) => {
      if (sortBy === 'stars') return parseStars(b.stars) - parseStars(a.stars)
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      return 0
    })
    return repos
  }, [activeCategory, search, sortBy])

  const groupedRepos = useMemo(() => {
    const groups = {}
    filteredRepos.forEach(r => {
      if (!groups[r.category]) groups[r.category] = []
      groups[r.category].push(r)
    })
    return groups
  }, [filteredRepos])

  const showMore = useCallback((cat) => {
    setVisibleCounts(prev => ({
      ...prev,
      [cat]: (prev[cat] || INITIAL_VISIBLE) + 24
    }))
  }, [])

  const collapseCategory = useCallback((cat) => {
    setVisibleCounts(prev => ({ ...prev, [cat]: INITIAL_VISIBLE }))
  }, [])

  const expandAll = useCallback(() => {
    const counts = {}
    Object.keys(groupedRepos).forEach(cat => {
      counts[cat] = groupedRepos[cat].length
    })
    setVisibleCounts(counts)
  }, [groupedRepos])

  const collapseAll = useCallback(() => {
    setVisibleCounts({})
  }, [])

  const copyToClipboard = useCallback((text, idx) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIdx(idx)
      setTimeout(() => setCopiedIdx(null), 2000)
    })
  }, [])

  const scrollToCategory = useCallback((catLabel) => {
    if (catLabel === 'All') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    const el = document.getElementById(`gh-cat-${catLabel.replace(/[^a-zA-Z0-9]/g, '-')}`)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  const handleCategoryClick = useCallback((cat) => {
    setActiveCategory(cat)
    if (cat !== 'All') scrollToCategory(cat)
  }, [scrollToCategory])

  return (
    <div className="gh-page">
      <Link to="/" className="back-link">&larr; Back to Home</Link>

      {/* Hero */}
      <div className="gh-hero">
        <div className="gh-hero-content">
          <h1>
            <span className="gh-icon">&#x1F4E6;</span>
            <span className="gradient-text">AI Tech Stack GitHub Repos</span>
          </h1>
          <p className="gh-hero-sub">
            Curated collection of {GITHUB_REPOS.length}+ open-source AI repositories covering the full stack &mdash;
            LLMs, Agents, RAG, MCP, VectorDB, Fine-Tuning, MLOps, GuardRails, Observability, and more.
            Clone, explore, and build with the best tools in AI.
          </p>
          <div className="gh-stats">
            <span className="gh-stat"><strong>{GITHUB_REPOS.length}</strong> Repos</span>
            <span className="gh-stat green"><strong>{REPO_CATEGORIES.length}</strong> Categories</span>
            <span className="gh-stat purple"><strong>1M+</strong> Total Stars</span>
            <span className="gh-stat yellow"><strong>Python</strong> &amp; <strong>JS/TS</strong></span>
            <span className="gh-stat pink"><strong>100%</strong> Open Source</span>
          </div>
          <div className="gh-tech-banner">
            {TECH_STACK.map((t, i) => (
              <span key={i} className={`gh-tech-tag ${t.color}`}>{t.label}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="gh-controls">
        <input
          className="gh-search"
          type="text"
          placeholder="Search 1000+ repos: RAG, agents, fine-tuning, vector, MCP, LangChain..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button
          className={`gh-sort-btn ${sortBy === 'stars' ? 'active' : ''}`}
          onClick={() => setSortBy(sortBy === 'stars' ? 'name' : 'stars')}
        >
          {sortBy === 'stars' ? '\u2B50 By Stars' : '\u{1F4D6} By Name'}
        </button>
        <button
          className="gh-fetch-btn"
          onClick={() => setFetchModal(true)}
        >
          {'\u{1F504}'} Fetch Latest
        </button>
        <div className="gh-expand-controls">
          <button className="gh-expand-btn" onClick={expandAll}>Expand All</button>
          <button className="gh-expand-btn" onClick={collapseAll}>Collapse All</button>
        </div>
      </div>

      {/* Category Tabs - Scrollable */}
      <div className="gh-categories" ref={categoriesRef}>
        <button
          className={`gh-cat-btn ${activeCategory === 'All' ? 'active' : ''}`}
          onClick={() => handleCategoryClick('All')}
        >
          All <span className="gh-cat-count">{categoryCounts.All || 0}</span>
        </button>
        {REPO_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            className={`gh-cat-btn ${activeCategory === cat.label ? 'active' : ''}`}
            onClick={() => handleCategoryClick(cat.label)}
          >
            {cat.icon} {cat.label} <span className="gh-cat-count">{categoryCounts[cat.label] || 0}</span>
          </button>
        ))}
      </div>

      {/* Results Info */}
      <div className="gh-results-info">
        <span>Showing <strong>{filteredRepos.length}</strong> of {GITHUB_REPOS.length} repositories</span>
        {search && <span>Filtered by: &quot;{search}&quot;</span>}
      </div>

      {/* Repo Grid by Category */}
      {Object.keys(groupedRepos).length === 0 ? (
        <div className="gh-empty">
          <span className="gh-empty-icon">&#x1F50D;</span>
          No repositories found matching your search.
        </div>
      ) : (
        Object.entries(groupedRepos).map(([category, repos]) => {
          const catIdx = REPO_CATEGORIES.findIndex(c => c.label === category)
          const colorClass = CATEGORY_COLORS[catIdx % CATEGORY_COLORS.length]
          const icon = CATEGORY_ICONS[category] || '\u{1F4E6}'
          const visible = visibleCounts[category] || INITIAL_VISIBLE
          const hasMore = repos.length > visible
          const visibleRepos = hasMore ? repos.slice(0, visible) : repos
          const catId = `gh-cat-${category.replace(/[^a-zA-Z0-9]/g, '-')}`
          return (
            <div key={category} id={catId}>
              <div className="gh-section-header">
                <span className="gh-section-icon">{icon}</span>
                <h2 className="gh-section-title">{category}</h2>
                <span className="gh-section-count">{repos.length} repos</span>
                <span className="gh-section-line" />
              </div>
              <div className="gh-grid">
                {visibleRepos.map((repo, ri) => (
                  <RepoCard
                    key={`${repo.url}-${ri}`}
                    repo={repo}
                    colorClass={colorClass}
                    onClone={() => setCloneModal(repo)}
                    onCopy={copyToClipboard}
                    copiedIdx={copiedIdx}
                    cardIdx={ri}
                  />
                ))}
              </div>
              {hasMore && (
                <div className="gh-show-more-row">
                  <button className="gh-show-more-btn" onClick={() => showMore(category)}>
                    Show More ({repos.length - visible} remaining)
                  </button>
                  <button className="gh-show-all-btn" onClick={() => setVisibleCounts(prev => ({ ...prev, [category]: repos.length }))}>
                    Show All {repos.length}
                  </button>
                </div>
              )}
            </div>
          )
        })
      )}

      {/* Fetched Results Section */}
      {fetchedRepos && fetchedRepos.items && fetchedRepos.items.length > 0 && (
        <div className="gh-fetched-section">
          <div className="gh-section-header">
            <span className="gh-section-icon">{'\u{1F680}'}</span>
            <h2 className="gh-section-title">Fetched from GitHub</h2>
            <span className="gh-section-count">{fetchedRepos.items.length} repos</span>
            <button className="gh-clear-fetch-btn" onClick={() => { setFetchedRepos(null); setFetchError(null) }}>
              {'\u2716'} Clear
            </button>
            <span className="gh-section-line" />
          </div>
          <div className="gh-grid">
            {fetchedRepos.items.slice(0, 50).map((repo, ri) => (
              <FetchedRepoCard key={`fetched-${repo.url}-${ri}`} repo={repo} idx={ri} />
            ))}
          </div>
          {fetchedRepos.items.length > 50 && (
            <div className="gh-show-more-row">
              <span className="gh-fetch-more-note">Showing 50 of {fetchedRepos.items.length} results</span>
            </div>
          )}
        </div>
      )}

      {fetchError && (
        <div className="gh-fetch-error">
          <span>{'\u26A0\uFE0F'}</span> {fetchError}
        </div>
      )}

      {/* Back to Top */}
      <div className="gh-back-top">
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>&#x2191; Back to Top</button>
      </div>

      {/* Clone Modal */}
      {cloneModal && (
        <CloneModal
          repo={cloneModal}
          onClose={() => setCloneModal(null)}
          onCopy={copyToClipboard}
        />
      )}

      {/* Fetch Modal */}
      {fetchModal && (
        <FetchModal
          selectedTopics={selectedTopics}
          setSelectedTopics={setSelectedTopics}
          fetchMode={fetchMode}
          setFetchMode={setFetchMode}
          fetchQuery={fetchQuery}
          setFetchQuery={setFetchQuery}
          fetching={fetching}
          setFetching={setFetching}
          setFetchedRepos={setFetchedRepos}
          setFetchError={setFetchError}
          onClose={() => setFetchModal(false)}
        />
      )}
    </div>
  )
}

function RepoCard({ repo, colorClass, onClone, onCopy, copiedIdx, cardIdx }) {
  const copyKey = `install-${cardIdx}`
  return (
    <div className="gh-card">
      <div className="gh-card-top">
        <div className="gh-card-header">
          <div className={`gh-card-avatar ${colorClass}`}>
            {repo.name.charAt(0)}
          </div>
          <div className="gh-card-title-area">
            <div className="gh-card-name">
              <a href={repo.url} target="_blank" rel="noopener noreferrer">{repo.name}</a>
              <span className="gh-card-stars">&#x2B50; {repo.stars}</span>
            </div>
            <div className="gh-card-cat">{repo.category}</div>
          </div>
        </div>
        <div className="gh-card-desc">{repo.description}</div>
        <div className="gh-card-features">
          {(repo.features || []).map((f, i) => (
            <span key={i} className="gh-feat-tag">{f}</span>
          ))}
        </div>
        <div className="gh-card-install">
          <code className="gh-install-cmd">{repo.install}</code>
          <button
            className={`gh-copy-btn ${copiedIdx === copyKey ? 'copied' : ''}`}
            onClick={() => onCopy(repo.install, copyKey)}
          >
            {copiedIdx === copyKey ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <div className="gh-card-usecase">
          <span>&#x1F4A1;</span> {repo.useCase}
        </div>
      </div>
      <div className="gh-card-footer">
        <button className="gh-clone-btn" onClick={onClone}>
          &#x1F4E5; Clone
        </button>
        <a href={repo.url} target="_blank" rel="noopener noreferrer" className="gh-view-btn">
          &#x1F517; View on GitHub
        </a>
      </div>
    </div>
  )
}

function FetchedRepoCard({ repo, idx }) {
  const stars = repo.stars >= 1000 ? `${(repo.stars / 1000).toFixed(1)}k` : repo.stars
  return (
    <div className="gh-card">
      <div className="gh-card-top">
        <div className="gh-card-header">
          <div className="gh-card-avatar blue">
            {repo.name.charAt(0).toUpperCase()}
          </div>
          <div className="gh-card-title-area">
            <div className="gh-card-name">
              <a href={repo.url} target="_blank" rel="noopener noreferrer">{repo.name}</a>
              <span className="gh-card-stars">{'\u2B50'} {stars}</span>
            </div>
            <div className="gh-card-cat">{repo.language || 'Various'}</div>
          </div>
        </div>
        <div className="gh-card-desc">{repo.description || 'No description'}</div>
        <div className="gh-card-features">
          {(repo.topics || []).slice(0, 6).map((t, i) => (
            <span key={i} className="gh-feat-tag">{t}</span>
          ))}
          {repo.license && <span className="gh-feat-tag" style={{ borderColor: 'rgba(63,185,80,0.2)', color: '#3fb950' }}>{repo.license}</span>}
        </div>
        <div className="gh-card-install">
          <code className="gh-install-cmd">git clone {repo.url}</code>
          <button className="gh-copy-btn" onClick={() => navigator.clipboard.writeText(`git clone ${repo.url}`)}>Copy</button>
        </div>
      </div>
      <div className="gh-card-footer">
        <a href={repo.url} target="_blank" rel="noopener noreferrer" className="gh-view-btn">
          {'\u{1F517}'} View on GitHub
        </a>
      </div>
    </div>
  )
}

function FetchModal({ selectedTopics, setSelectedTopics, fetchMode, setFetchMode, fetchQuery, setFetchQuery, fetching, setFetching, setFetchedRepos, setFetchError, onClose }) {
  const handleToggleTopic = useCallback((topic) => {
    setSelectedTopics(prev =>
      prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic]
    )
  }, [setSelectedTopics])

  const handleSelectAll = useCallback(() => {
    setSelectedTopics(FETCH_TOPICS.map(t => t.topic))
  }, [setSelectedTopics])

  const handleClearAll = useCallback(() => {
    setSelectedTopics([])
  }, [setSelectedTopics])

  const handleFetch = useCallback(async () => {
    setFetching(true)
    setFetchError(null)
    setFetchedRepos(null)
    try {
      let result
      if (fetchMode === 'query' && fetchQuery.trim()) {
        result = await searchGitHubRepos({ query: fetchQuery.trim(), sort: 'stars', perPage: 50 })
      } else if (selectedTopics.length > 0) {
        result = await searchGitHubRepos({ topics: selectedTopics, sort: 'stars', perPage: 30 })
      } else {
        setFetchError('Please select at least one topic or enter a search query')
        setFetching(false)
        return
      }
      if (result.error) {
        setFetchError(result.error)
      } else if (!result.items || result.items.length === 0) {
        setFetchError('No repositories found. Try different topics.')
      } else {
        setFetchedRepos(result)
        onClose()
      }
    } catch (e) {
      setFetchError(e.message || 'Failed to fetch repositories')
    }
    setFetching(false)
  }, [fetchMode, fetchQuery, selectedTopics, onClose, setFetchedRepos, setFetchError, setFetching])

  return (
    <div className="gh-modal-overlay" onClick={onClose}>
      <div className="gh-modal gh-fetch-modal" onClick={e => e.stopPropagation()}>
        <div className="gh-modal-header">
          <h3>{'\u{1F504}'} Fetch Latest GitHub Repos</h3>
          <button className="gh-modal-close" onClick={onClose}>&times;</button>
        </div>
        <div className="gh-modal-body">
          <div className="gh-fetch-mode-tabs">
            <button
              className={`gh-fetch-mode-tab ${fetchMode === 'topics' ? 'active' : ''}`}
              onClick={() => setFetchMode('topics')}
            >
              {'\u{1F4CB}'} By Topics
            </button>
            <button
              className={`gh-fetch-mode-tab ${fetchMode === 'query' ? 'active' : ''}`}
              onClick={() => setFetchMode('query')}
            >
              {'\u{1F50D}'} Custom Query
            </button>
          </div>

          {fetchMode === 'query' ? (
            <div className="gh-fetch-query-row">
              <input
                className="gh-fetch-query-input"
                type="text"
                placeholder="e.g. RAG framework Python 2024 stars:>1000"
                value={fetchQuery}
                onChange={e => setFetchQuery(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleFetch() }}
              />
            </div>
          ) : (
            <>
              <div className="gh-fetch-topic-actions">
                <button className="gh-fetch-select-all" onClick={handleSelectAll}>Select All</button>
                <button className="gh-fetch-clear-all" onClick={handleClearAll}>Clear All</button>
                <span className="gh-fetch-selected-count">{selectedTopics.length} selected</span>
              </div>
              <div className="gh-fetch-topics-grid">
                {FETCH_TOPICS.map((t, i) => (
                  <label key={i} className={`gh-fetch-topic-chip ${selectedTopics.includes(t.topic) ? 'selected' : ''} ${t.color}`}>
                    <input
                      type="checkbox"
                      checked={selectedTopics.includes(t.topic)}
                      onChange={() => handleToggleTopic(t.topic)}
                    />
                    {t.label}
                  </label>
                ))}
              </div>
            </>
          )}

          <div className="gh-fetch-actions">
            <button
              className="gh-fetch-execute-btn"
              onClick={handleFetch}
              disabled={fetching || (fetchMode === 'query' && !fetchQuery.trim()) || (fetchMode === 'topics' && selectedTopics.length === 0)}
            >
              {fetching ? (
                <>{'\u23F3'} Fetching...</>
              ) : (
                <>{'\u{1F504}'} Fetch from GitHub</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function CloneModal({ repo, onClose, onCopy }) {
  const [selectedMethod, setSelectedMethod] = useState('https')
  const [copied, setCopied] = useState(false)

  const httpsCmd = `git clone ${repo.url}`
  const sshUrl = repo.url.replace('https://github.com/', 'git@github.com:')
  const sshCmd = `git clone ${sshUrl}`
  const ghCmd = `gh repo clone ${repo.url.replace('https://github.com/', '')}`

  const methods = [
    { id: 'https', icon: '\u{1F310}', name: 'HTTPS', desc: 'Recommended for most users', cmd: httpsCmd },
    { id: 'ssh', icon: '\u{1F511}', name: 'SSH', desc: 'Requires SSH key setup', cmd: sshCmd },
    { id: 'gh', icon: '\u{1F4E6}', name: 'GitHub CLI', desc: 'Using gh command line tool', cmd: ghCmd },
  ]

  const current = methods.find(m => m.id === selectedMethod)

  const handleCopy = () => {
    navigator.clipboard.writeText(current.cmd).then(() => {
      setCopied(true)
      onCopy(current.cmd, 'modal')
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="gh-modal-overlay" onClick={onClose}>
      <div className="gh-modal" onClick={e => e.stopPropagation()}>
        <div className="gh-modal-header">
          <h3>&#x1F4E5; Clone {repo.name}</h3>
          <button className="gh-modal-close" onClick={onClose}>&times;</button>
        </div>
        <div className="gh-modal-body">
          <label>Clone Command</label>
          <div className="gh-modal-cmd">
            <input readOnly value={current.cmd} />
            <button onClick={handleCopy}>{copied ? 'Copied!' : 'Copy'}</button>
          </div>

          <label>Clone Method</label>
          <div className="gh-modal-options">
            {methods.map(m => (
              <div
                key={m.id}
                className={`gh-modal-option ${selectedMethod === m.id ? 'selected' : ''}`}
                onClick={() => setSelectedMethod(m.id)}
              >
                <span className="gh-modal-option-icon">{m.icon}</span>
                <div className="gh-modal-option-text">
                  <div className="gh-modal-option-name">{m.name}</div>
                  <div className="gh-modal-option-desc">{m.desc}</div>
                </div>
                <code>{m.cmd.substring(0, 30)}...</code>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 16 }}>
            <label>Quick Info</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <span className="gh-feat-tag" style={{ fontSize: 11, padding: '4px 10px' }}>&#x2B50; {repo.stars} stars</span>
              <span className="gh-feat-tag" style={{ fontSize: 11, padding: '4px 10px', background: 'rgba(188,140,255,0.08)', color: '#bc8cff', borderColor: 'rgba(188,140,255,0.15)' }}>{repo.category}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
