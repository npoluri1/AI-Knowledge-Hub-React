import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { KNOWLEDGE_SECTIONS, searchKnowledge } from '../data/appData'
import CodeBlock from '../components/CodeBlock'

export default function KnowledgeBaseView() {
  const [searchQ, setSearchQ] = useState('')
  const [searchResults, setSearchResults] = useState(null)
  const [expandedSections, setExpandedSections] = useState([KNOWLEDGE_SECTIONS[0]?.id])
  const [expandedRows, setExpandedRows] = useState({})

  const toggleSection = (id) => {
    setExpandedSections(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  const toggleRow = (key) => {
    setExpandedRows(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQ.trim().length < 2) { setSearchResults(null); return }
    setSearchResults(searchKnowledge(searchQ))
  }

  const sectionsToShow = searchResults
    ? KNOWLEDGE_SECTIONS.filter(s => searchResults.some(r => r.section === s.id))
    : KNOWLEDGE_SECTIONS

  return (
    <div className="knowledge-base">
      <Link to="/" className="back-link">← Back to Home</Link>
      <h2 className="chapter-title">📐 AI Knowledge Tables</h2>
      <p className="chapter-preview">
        Structured knowledge from AI_KNOWLEDGE_TABLE.txt — {KNOWLEDGE_SECTIONS.length} sections covering
        core AI architecture, agent protocols, LLM architectures, vector databases, embedding models,
        RAG patterns, guardrails, MLOps, and career roadmaps.
      </p>

      <form className="search-bar" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search knowledge base topics…"
          value={searchQ}
          onChange={e => setSearchQ(e.target.value)}
        />
        <button type="submit">🔍</button>
        {searchResults && (
          <button type="button" className="clear-btn" onClick={() => { setSearchResults(null); setSearchQ('') }}>✕</button>
        )}
      </form>

      {searchResults && (
        <div className="search-results">
          <div className="section-title">🔎 Knowledge Search ({searchResults.length})</div>
          {searchResults.map((r, i) => (
            <div key={i} className="search-result-item"
              onClick={() => { toggleSection(r.section); setSearchResults(null) }}
            >
              <span className="sr-type">{r.sectionIcon || '📐'}</span>
              <div className="sr-info">
                <span className="sr-title">{r.sectionHeading}</span>
                <span className="sr-snippet">{r.row.topic}: {r.row.details?.slice(0, 120)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="knowledge-sections">
        {sectionsToShow.map(section => (
          <div key={section.id} className="ksection">
            <div className="ksection-header" onClick={() => toggleSection(section.id)}>
              <span className="ksection-icon">{section.icon || '📐'}</span>
              <div className="ksection-info">
                <h3>{section.heading}</h3>
                <span className="ksection-count">{section.rows.length} topics</span>
              </div>
              <span className="ksection-expand">
                {expandedSections.includes(section.id) ? '▼' : '▶'}
              </span>
            </div>

            {expandedSections.includes(section.id) && (
              <div className="ksection-body">
                {section.rows.map((row, ri) => {
                  const rowKey = `${section.id}-${ri}`
                  const isExpanded = expandedRows[rowKey]
                  const hasDetails = row.concept || row.code || row.useCases || row.projectIdea || row.examples

                  return (
                    <div key={ri} className={`knowledge-row ${isExpanded ? 'expanded' : ''} ${hasDetails ? 'clickable' : ''}`}>
                      <div className="kr-header" onClick={() => hasDetails && toggleRow(rowKey)}>
                        <div className="kr-main">
                          <strong className="topic-name">{row.topic}</strong>
                          <span className="kr-details">{row.details}</span>
                          {row.creator && <span className="topic-meta"> | Created by: {row.creator}</span>}
                          {row.analogy && <div className="topic-analogy">💡 {row.analogy}</div>}
                          {row.best && <div className="topic-best">Best for: {row.best}</div>}
                          {row.models && <div className="topic-models">Models: {row.models}</div>}
                          {row.complexity && (
                            <div className="topic-complexity">
                              <span className="complexity-badge">Complexity: {row.complexity}</span>
                              {row.accuracy && <span className="accuracy-badge">Accuracy: {row.accuracy}</span>}
                            </div>
                          )}
                        </div>
                        {hasDetails && (
                          <span className="kr-expand">{isExpanded ? '−' : '+'}</span>
                        )}
                      </div>

                      {isExpanded && hasDetails && (
                        <div className="kr-expanded-content">
                          {row.concept && (
                            <div className="kr-concept">
                              <h4>📐 Concept</h4>
                              <p>{row.concept}</p>
                            </div>
                          )}

                          {row.code && (
                            <div className="kr-code">
                              <h4>💻 Code Example</h4>
                              <CodeBlock title="">{row.code}</CodeBlock>
                            </div>
                          )}

                          {row.useCases && row.useCases.length > 0 && (
                            <div className="kr-usecases">
                              <h4>🎯 Real-World Use Cases</h4>
                              <ul>
                                {row.useCases.map((uc, i) => <li key={i}>{uc}</li>)}
                              </ul>
                            </div>
                          )}

                          {row.projectIdea && (
                            <div className="kr-project">
                              <h4>🚀 Project Idea</h4>
                              <p>{row.projectIdea}</p>
                            </div>
                          )}

                          {row.examples && row.examples.length > 0 && (
                            <div className="kr-examples">
                              <h4>📌 Examples</h4>
                              <ul>
                                {row.examples.map((ex, i) => <li key={i}>{ex}</li>)}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
