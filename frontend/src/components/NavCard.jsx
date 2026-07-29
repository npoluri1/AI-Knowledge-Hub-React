import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function NavCard({ icon, iconBg, title, desc, path, meta }) {
  const navigate = useNavigate()
  return (
    <div className="nav-card" onClick={() => path && navigate(path)}>
      <div className="icon" style={{ background: iconBg }}>
        {icon}
      </div>
      <div className="info">
        <h4>{title}</h4>
        <p>{desc}</p>
        {meta && <div className="path">{meta}</div>}
      </div>
    </div>
  )
}
