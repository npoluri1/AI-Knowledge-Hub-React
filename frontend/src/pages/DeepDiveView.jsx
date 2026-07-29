import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import CodeBlock from '../components/CodeBlock'
import DataTable from '../components/DataTable'
import { getDeepDive } from '../api'

function SectionRenderer({ sec }) {
  const items = []

  if (sec.scenario) items.push(<div key="sc" className="scenario-box">🎯 <strong>Scenario:</strong> {sec.scenario}</div>)
  if (sec.text) items.push(<p key="t" className="section-text">{sec.text}</p>)
  if (sec.insight) items.push(<div key="ins" className="insight-box"><h4>💡 Insight</h4><p>{sec.insight}</p></div>)
  if (sec.concept) items.push(<div key="con" className="concept-box"><h4>📐 Core Concept</h4><p>{sec.concept}</p></div>)
  if (sec.warning) items.push(<div key="warn" className="alert-box"><h4>⚠️ {sec.warning}</h4></div>)

  if (sec.keyPoints && Array.isArray(sec.keyPoints)) {
    items.push(<ul key="kp" className="key-points">{sec.keyPoints.map((kp, ki) => <li key={ki}>{kp}</li>)}</ul>)
  }

  if (sec.table && sec.table.headers && sec.table.rows) {
    items.push(<DataTable key="tbl" headers={sec.table.headers} rows={sec.table.rows} />)
  }

  if (sec.code && sec.code.title) {
    items.push(<CodeBlock key="cd" title={sec.code.title}>{sec.code.content}</CodeBlock>)
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

  if (sec.imageDesc) {
    items.push(
      <div key="img" className="image-placeholder">
        <div className="ip-emoji">{sec.imageDesc.emoji}</div>
        <div className="ip-label">{sec.imageDesc.label}</div>
      </div>
    )
  }

  return (
    <div className="section-block deep-dive-section">
      {sec.heading && <h3 className="section-heading">{sec.heading}</h3>}
      {items}
    </div>
  )
}

export default function DeepDiveView() {
  const { id } = useParams()
  const [dd, setDd] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true); setError(null)
    getDeepDive(id).then(d => {
      if (d.error) { setError(d.error); setLoading(false); return }
      setDd(d); setLoading(false)
    }).catch(e => { setError(e.message); setLoading(false) })
  }, [id])

  if (loading) return <div className="loading">⏳ Loading deep dive…</div>
  if (error) return <div className="error">❌ {error}</div>
  if (!dd) return <div className="error">Deep dive not found</div>

  const hasContent = dd.sections && dd.sections.length > 0

  return (
    <div className="deep-dive">
      <Link to="/" className="back-link">← Back to Home</Link>
      <h2 className="chapter-title">{dd.icon} {dd.title}</h2>
      <p className="chapter-preview">{dd.description}</p>

      {!hasContent && <div className="empty-state">🚧 Deep dive content coming soon. Check the related chapter for detailed information.</div>}
      {dd.sections && dd.sections.map((sec, i) => <SectionRenderer key={i} sec={sec} />)}
    </div>
  )
}
