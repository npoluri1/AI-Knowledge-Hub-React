import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function ChapterCard({ chapter }) {
  const navigate = useNavigate()
  return (
    <div className="chapter-card" onClick={() => navigate(`/chapter/${chapter.id}`)}>
      <h3><span className="num">{chapter.num || '—'}.</span> {chapter.icon} {chapter.title}</h3>
      <div className="file-badges">
        {(chapter.files || []).map(f => <span key={f} className="file-badge">{f}</span>)}
      </div>
      <div className="preview">{chapter.preview}</div>
      <div className="tags">
        {(chapter.tags || []).map(t => <span key={t} className="tag">{t}</span>)}
      </div>
    </div>
  )
}
