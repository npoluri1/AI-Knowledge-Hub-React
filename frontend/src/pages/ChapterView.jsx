import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import CodeBlock from '../components/CodeBlock'
import DataTable from '../components/DataTable'
import PipelineDiagram from '../components/PipelineDiagram'
import { getChapter } from '../api'

function SectionRenderer({ sec }) {
  const items = []

  if (sec.text) items.push(<p key="t" className="section-text">{sec.text}</p>)
  if (sec.scenario) items.push(<div key="sc" className="scenario-box">🎯 <strong>Scenario:</strong> {sec.scenario}</div>)
  if (sec.insight) items.push(<div key="ins" className="insight-box"><h4>💡 Insight</h4><p>{sec.insight}</p></div>)
  if (sec.concept) items.push(<div key="con" className="concept-box"><h4>📐 Core Concept</h4><p>{sec.concept}</p></div>)
  if (sec.warning) items.push(<div key="warn" className="alert-box"><h4>⚠️ {sec.warning}</h4></div>)

  if (sec.comparison) {
    const comp = sec.comparison
    items.push(
      <div key="comp" className="comparison-wrapper">
        <table className="data-table comparison-table">
          <thead><tr>{(comp.headers || []).map((h, i) => <th key={i}>{h}</th>)}</tr></thead>
          <tbody>{(comp.rows || []).map((row, ri) => <tr key={ri}>{row.map((cell, ci) => <td key={ci}>{cell}</td>)}</tr>)}</tbody>
        </table>
      </div>
    )
  }

  if (sec.cardGrid) {
    items.push(
      <div key="cg" className="cards-grid">
        {sec.cardGrid.map((c, ci) => (
          <div key={ci} className="info-card">
            <h4>{c.title}</h4>
            {Array.isArray(c.items) ? <ul>{c.items.map((li, lii) => <li key={lii}>{li}</li>)}</ul> : <p>{c.items}</p>}
          </div>
        ))}
      </div>
    )
  }

  if (sec.table && sec.table.headers && sec.table.rows) {
    items.push(<DataTable key="tbl" headers={sec.table.headers} rows={sec.table.rows} />)
  }

  if (sec.code && sec.code.title) {
    items.push(<CodeBlock key="cd" title={sec.code.title}>{sec.code.content}</CodeBlock>)
  }

  if (sec.imageDesc) {
    items.push(
      <div key="img" className="image-placeholder">
        <div className="ip-emoji">{sec.imageDesc.emoji}</div>
        <div className="ip-label">{sec.imageDesc.label}</div>
      </div>
    )
  }

  if (sec.keyPoints && Array.isArray(sec.keyPoints)) {
    items.push(
      <ul key="kp" className="key-points">
        {sec.keyPoints.map((kp, ki) => <li key={ki}>{kp}</li>)}
      </ul>
    )
  }

  return (
    <div className="section-block">
      {sec.heading && <h3 className="section-heading">{sec.heading}</h3>}
      {items}
    </div>
  )
}

export default function ChapterView() {
  const { id } = useParams()
  const [ch, setCh] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true); setError(null)
    getChapter(id).then(d => {
      if (d.error) { setError(d.error); setLoading(false); return }
      setCh(d); setLoading(false)
    }).catch(e => { setError(e.message); setLoading(false) })
  }, [id])

  if (loading) return <div className="loading">⏳ Loading chapter…</div>
  if (error) return <div className="error">❌ {error}</div>
  if (!ch) return <div className="error">Chapter not found</div>

  const hasContent = ch.sections && ch.sections.length > 0

  return (
    <div className="chapter-detail">
      <Link to="/" className="back-link">← Back to Home</Link>
      <h2 className="chapter-title"><span className="ch-num">{ch.num}.</span> {ch.icon} {ch.title}</h2>
      {ch.preview && <p className="chapter-preview">{ch.preview}</p>}

      <div className="tag-list">
        {(ch.tags || []).map(t => <span key={t} className="tag">{t}</span>)}
      </div>

      {ch.id === 'rag-pipeline' && <PipelineDiagram diagramKey="rag-pipeline" />}
      {ch.id === 'ai-agents' && <PipelineDiagram diagramKey="agent-architecture" />}
      {ch.id === 'ai-agent-architecture' && <PipelineDiagram diagramKey="agent-architecture" />}
      {ch.id === 'system-design' && <PipelineDiagram diagramKey="system-design" />}
      {ch.id === 'llm-models' && <PipelineDiagram diagramKey="llm-ecosystem" />}
      {ch.id === 'vector-databases' && <PipelineDiagram diagramKey="vector-db-compare" />}
      {ch.id === 'prompt-engineering' && <PipelineDiagram diagramKey="prompt-patterns" />}
      {ch.id === 'observability-evals' && <PipelineDiagram diagramKey="observability-pipeline" />}
      {ch.id === 'fine-tuning-local' && <PipelineDiagram diagramKey="fine-tuning-workflow" />}
      {ch.id === 'grc-compliance' && <PipelineDiagram diagramKey="grc-compliance" />}
      {ch.id === 'career-resources' && <PipelineDiagram diagramKey="career-roadmap" />}
      {ch.id === 'python-for-ai' && <PipelineDiagram diagramKey="python-ai-stack" />}
      {ch.id === 'fastapi-ai-services' && <PipelineDiagram diagramKey="fastapi-ai" />}
      {ch.id === 'langchain-llamaindex' && <PipelineDiagram diagramKey="langchain-llamaindex" />}
      {ch.id === 'quantum-computing' && <PipelineDiagram diagramKey="quantum-ai" />}
      {ch.id === 'robotics-ai' && <PipelineDiagram diagramKey="robotics-ai-stack" />}
      {ch.id === 'ai-semiconductor' && <PipelineDiagram diagramKey="semiconductor-ai" />}
      {ch.id === 'e2e-project' && <PipelineDiagram diagramKey="e2e-project" />}

      {!hasContent && <div className="empty-state">Content distributed in other chapters.</div>}
      {ch.sections && ch.sections.map((sec, i) => <SectionRenderer key={i} sec={sec} />)}
    </div>
  )
}
