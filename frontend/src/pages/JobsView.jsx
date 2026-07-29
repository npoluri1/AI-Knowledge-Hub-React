import React, { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ALL_JOBS, ALL_JOB_TECHS, ALL_JOB_LOCATIONS, searchJobs, buildSourceUrl } from '../data/appData'
import { generateProjectView } from '../data/projectGenerator'

export default function JobsView() {
  const navigate = useNavigate()
  const [searchQ, setSearchQ] = useState('')
  const [results, setResults] = useState(ALL_JOBS)
  const [selectedTech, setSelectedTech] = useState(null)
  const [selectedSource, setSelectedSource] = useState('all')
  const [selectedJob, setSelectedJob] = useState(null)
  const [projectModal, setProjectModal] = useState(null) // null | {type:'text'|'images', job}

  const handleSearch = (e) => {
    e.preventDefault()
    const filters = {}
    if (selectedTech) filters.tech = [selectedTech]
    if (selectedSource !== 'all') filters.source = selectedSource
    setResults(searchJobs(searchQ, filters))
  }

  const filterByTech = (tech) => {
    const newTech = selectedTech === tech ? null : tech
    setSelectedTech(newTech)
    const filters = {}
    if (newTech) filters.tech = [newTech]
    if (selectedSource !== 'all') filters.source = selectedSource
    setResults(searchJobs(searchQ, filters))
  }

  const filterBySource = (source) => {
    setSelectedSource(source)
    const filters = {}
    if (selectedTech) filters.tech = [selectedTech]
    if (source !== 'all') filters.source = source
    setResults(searchJobs(searchQ, filters))
  }

  const getSalaryClass = (salary) => {
    if (!salary) return 'job-salary-low'
    if (salary.includes('300') || salary.includes('350')) return 'job-salary-high'
    if (salary.includes('200') || salary.includes('250')) return 'job-salary-mid'
    if (salary.includes('150') || salary.includes('180')) return 'job-salary-standard'
    return 'job-salary-low'
  }

  const clearFilters = () => {
    setSearchQ('')
    setSelectedTech(null)
    setSelectedSource('all')
    setResults(ALL_JOBS)
  }

  return (
    <div className="jobs-view">
      <Link to="/" className="back-link">← Back to Home</Link>
      <h2 className="chapter-title">💼 AI Engineering Jobs</h2>
      <p className="chapter-preview">
        {ALL_JOBS.length} AI Engineering Jobs from 2 sources. Showing {results.length} jobs
        {selectedTech ? ` filtered by: ${selectedTech}` : ''}.
      </p>

      <div className="source-filter-bar">
        <span className="tech-filter-label">Source:</span>
        <button
          className={`tech-filter ${selectedSource === 'all' ? 'active' : ''}`}
          onClick={() => filterBySource('all')}
        >All ({ALL_JOBS.length})</button>
        <button
          className={`tech-filter ${selectedSource === 'superaidevs.com' ? 'active' : ''}`}
          onClick={() => filterBySource('superaidevs.com')}
        >SuperAIDevs (996)</button>
        <button
          className={`tech-filter ${selectedSource === 'topgenaijobs.com' ? 'active' : ''}`}
          onClick={() => filterBySource('topgenaijobs.com')}
        >TopGenAIJobs (1403)</button>
      </div>

      <form className="search-bar" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search by title, company, skills, description…"
          value={searchQ}
          onChange={e => setSearchQ(e.target.value)}
        />
        <button type="submit">🔍</button>
        {(searchQ || selectedTech || selectedSource !== 'all') && (
          <button type="button" className="clear-btn" onClick={clearFilters}>✕</button>
        )}
      </form>

      <div className="tech-filter-bar">
        <span className="tech-filter-label">Filter by tech:</span>
        {ALL_JOB_TECHS.slice(0, 30).map(tech => (
          <button
            key={tech}
            className={`tech-filter ${selectedTech === tech ? 'active' : ''}`}
            onClick={() => filterByTech(tech)}
          >
            {tech}
          </button>
        ))}
      </div>

      <div className="jobs-grid">
        {results.map((job, i) => (
          <div
            key={i}
            className={`job-card ${getSalaryClass(job.salary)}`}
            onClick={() => setSelectedJob(selectedJob === i ? null : i)}
          >
            <div className="job-card-header">
              <h4 className="job-card-title">{job.title}</h4>
              <span className="job-card-salary">{job.salary}</span>
            </div>
            <div className="job-card-meta">
              <span className="job-card-company">{job.company}</span>
              {job.location && <span className="job-card-location">• {job.location}</span>}
              <span className={`job-source-badge ${job.source === 'topgenaijobs.com' ? 'source-topgenai' : 'source-superaidevs'}`}>
                {job.source === 'topgenaijobs.com' ? 'TopGenAI' : 'SuperAIDevs'}
              </span>
            </div>
            <div className="job-card-techs">
              {job.techs.slice(0, 8).map((t, ti) => (
                <span key={ti} className="tag" 
                  onClick={(e) => { e.stopPropagation(); filterByTech(t) }}
                >{t}</span>
              ))}
              {job.techs.length > 8 && <span className="tag tag-more">+{job.techs.length - 8}</span>}
            </div>
            {selectedJob === i && (
              <div className="job-card-detail">
                <p className="job-card-desc">{job.desc}</p>
                {job.experience && <p className="job-card-desc" style={{ marginTop: 4 }}><strong>Experience:</strong> {job.experience}</p>}
                {job.mode && <p className="job-card-desc" style={{ marginTop: 4 }}><strong>Mode:</strong> {job.mode} · <strong>Type:</strong> {job.job_type}</p>}
                {Array.isArray(job.use_cases) && job.use_cases.length > 0 && (
                  <div>
                    <span className="use-cases-label">Use Cases:</span>
                    <div className="job-card-techs" style={{ marginTop: 4 }}>
                      {job.use_cases.map((uc, uci) => (
                        <span key={uci} className="tag use-case-tag">{uc}</span>
                      ))}
                    </div>
                  </div>
                )}
                {!Array.isArray(job.use_cases) && job.use_cases && (
                  <p className="job-card-desc" style={{ marginTop: 6 }}>{job.use_cases}</p>
                )}
                <div className="job-card-actions">
                  <button
                    className="jpv-generate-btn"
                    onClick={(e) => {
                      e.stopPropagation()
                      navigate('/job-project', { state: { job } })
                    }}
                    title="Generate full project with backend API"
                  >
                    🤖 Generate Project
                  </button>
                  <button
                    className="jpv-text-btn"
                    onClick={(e) => {
                      e.stopPropagation()
                      setProjectModal({ type: 'text', job })
                    }}
                    title="Generate project in text/ASCII format with box diagrams"
                  >
                    📝 Text
                  </button>
                  <a
                    className="job-source-link"
                    href={buildSourceUrl(job)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {job.url ? 'View Source ↗' : 'Search Google ↗'}
                  </a>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {results.length === 0 && (
        <div className="empty-state">No jobs match your criteria. Try different search terms or clear filters.</div>
      )}

      {/* Project Text Modal */}
      {projectModal && projectModal.type === 'text' && (
        <div className="jpv-modal-overlay" onClick={() => setProjectModal(null)}>
          <div className="jpv-modal-content" onClick={e => e.stopPropagation()}>
            <div className="jpv-modal-header">
              <h3>📝 Project Overview — {projectModal.job.title}</h3>
              <button className="jpv-modal-close" onClick={() => setProjectModal(null)}>✕</button>
            </div>
            <div className="jpv-modal-body">
              <ProjectTextView job={projectModal.job} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ====== Project Text View Component ======

function ProjectTextView({ job }) {
  const project = useMemo(() => generateProjectView(job), [job])
  const [tab, setTab] = useState('overview')

  const tabs = [
    { id: 'overview', label: '📋 Overview' },
    { id: 'structure', label: '📁 Structure' },
    { id: 'architecture', label: '🏗️ Architecture' },
    { id: 'patterns', label: '🧩 Patterns' },
    { id: 'code', label: '💻 Code' },
    { id: 'ideas', label: '💡 Ideas' },
  ]

  const tabContent = {
    overview: project.header,
    structure: project.projectStructure,
    architecture: project.archDiagram,
    patterns: project.designPatterns,
    code: project.codeSamples,
    ideas: project.projectIdeas,
  }

  return (
    <div className="jpv-text-view">
      <div className="jpv-text-tabs">
        {tabs.map(t => (
          <button
            key={t.id}
            className={`jpv-text-tab ${tab === t.id ? 'active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <pre className="jpv-text-content">
        <code>{tabContent[tab] || ''}</code>
      </pre>
    </div>
  )
}
