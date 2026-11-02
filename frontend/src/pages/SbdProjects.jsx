import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { SBD_PROJECTS } from '../data/sbdStudyGuides'
import { SBD_SECTIONS } from '../data/studyByDoingData'
import { sectionPhoto } from '../data/sbdStudy'
import './SbdStudy.css'

const projectLessons = Object.fromEntries((SBD_SECTIONS.find(s => s.id === 'projects')?.lessons || []).map(l => [l.n, l.slug]))
const SPINE = ['User', 'API', 'Agent / RAG', 'Tools', 'Guardrails', 'Evals', 'Deploy', 'Monitor']

export default function SbdProjects() {
  const [open, setOpen] = useState(SBD_PROJECTS[0].n)
  return (
    <div className="sbx sbx-proj">
      <Link to="/study-by-doing" className="back-link">← Study path</Link>
      <header className="sbx-shero" style={{ '--hero': `url("${sectionPhoto('projects', 1800, 900)}")` }}>
        <div className="sbx-shero-inner">
          <span className="sbx-kicker">15 projects · understand each one end to end</span>
          <h1>🚀 Projects, end to end</h1>
          <p className="sbx-big">Every project follows the same spine. Learn the spine once, and every project becomes easy to build and to explain.</p>
          <div className="sbx-spine">{SPINE.map((s, i) => <React.Fragment key={s}><span>{s}</span>{i < SPINE.length - 1 && <i>→</i>}</React.Fragment>)}</div>
        </div>
      </header>

      <div className="sbx-projects">
        {SBD_PROJECTS.map(p => {
          const isOpen = open === p.n
          return (
            <article key={p.n} className={`sbx-project ${isOpen ? 'open' : ''}`}>
              <button type="button" className="sbx-project-head" onClick={() => setOpen(isOpen ? null : p.n)} aria-expanded={isOpen}>
                <code>{p.n}</code>
                <span><b>{p.title}</b><small>{p.problem}</small></span>
                <em>{isOpen ? '▴' : '▾'}</em>
              </button>
              {isOpen && (
                <div className="sbx-project-body">
                  <h3>How it flows</h3>
                  <ol className="sbx-flow">{p.flow.map((step, i) => <li key={step}><span>{i + 1}</span>{step}</li>)}</ol>
                  <div className="sbx-three">
                    <div className="sbx-tile"><h3>🧰 Stack</h3><p>{p.stack}</p></div>
                    <div className="sbx-tile uses"><h3>🎤 Explain it in one breath</h3><p>{p.explain}</p></div>
                    <div className="sbx-tile idea"><h3>✨ Change-the-world angle</h3><p>{p.idea}</p></div>
                  </div>
                  <div className="sbx-hero-actions">
                    {projectLessons[p.n] && <Link className="sbx-btn primary" to={`/study-by-doing/${projectLessons[p.n]}`}>Open the full project lesson →</Link>}
                    <Link className="sbx-btn" to="/projects">🗂️ Build & run in All Projects</Link>
                  </div>
                </div>
              )}
            </article>
          )
        })}
      </div>
    </div>
  )
}
