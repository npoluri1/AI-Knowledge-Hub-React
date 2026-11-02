import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { SBD_ORIGIN, SBD_SECTIONS, SBD_TOTAL_LESSONS } from '../data/studyByDoingData'
import { SBD_GUIDES } from '../data/sbdStudyGuides'
import { useProgress, sectionProgress, sectionPhoto, buildDeck, useLeitner } from '../data/sbdStudy'
import './SbdStudy.css'

// Learning tracks group the 42 sections into a guided path.
const TRACKS = [
  { name: 'Foundations', icon: '🧱', hue: '#79d9f2', ids: ['getting-started', 'python-fundamentals', 'developer-foundations', 'data-structures-algorithms', 'software-testing', 'system-design'] },
  { name: 'Ship it', icon: '🚢', hue: '#9be7b4', ids: ['containers-deployment', 'kubernetes-orchestration', 'data-app-building', 'mlops-llmops', 'aws-ai-automation'] },
  { name: 'Core AI engineering', icon: '🧠', hue: '#c2a5ff', ids: ['foundations-concepts', 'prompting-llm-basics', 'retrieval-rag', 'agents-tools', 'evaluation-production', 'prompt-context-engineering', 'nlp-transformers', 'advanced-ai-engineering'] },
  { name: 'Claude & tooling', icon: '🅰️', hue: '#f7b267', ids: ['claude-anthropic', 'anthropic-api-in-practice', 'anthropic-skills', 'ai-assisted-development', 'no-code-agentic-ai'] },
  { name: 'Agent systems', icon: '🤖', hue: '#ffabc3', ids: ['langchain-langgraph', 'multi-agent-orchestration', 'interoperability-agent-ops', 'frontier-agent-capabilities', 'specialized-topics'] },
  { name: 'Deep & scale', icon: '⚡', hue: '#75e2d1', ids: ['ml-systems-internals', 'inference-cost', 'fine-tuning', 'local-open-models', 'research-frontier-eng'] },
  { name: 'Production & career', icon: '🎯', hue: '#f7d47d', ids: ['safety-red-teaming', 'advanced-challenges', 'case-studies-architectures', 'enterprise-leadership', 'fde-capstone', 'projects', 'career-interview-prep', 'reference'] },
]
const BY_ID = Object.fromEntries(SBD_SECTIONS.map(s => [s.id, s]))

function Ring({ pct, size = 46, hue = '#79d9f2' }) {
  const r = (size - 6) / 2
  const c = 2 * Math.PI * r
  return (
    <svg className="sbx-ring" width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-label={`${pct}% complete`}>
      <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(255,255,255,.12)" strokeWidth="5" fill="none" />
      <circle cx={size / 2} cy={size / 2} r={r} stroke={hue} strokeWidth="5" fill="none" strokeLinecap="round"
        strokeDasharray={c} strokeDashoffset={c - (c * pct) / 100} transform={`rotate(-90 ${size / 2} ${size / 2})`} />
      <text x="50%" y="54%" textAnchor="middle" fontSize={size * 0.26} fill="#fff" fontWeight="800">{pct}%</text>
    </svg>
  )
}

export default function StudyByDoingView() {
  const { done } = useProgress()
  const { state: leitner } = useLeitner()
  const [query, setQuery] = useState('')
  const deckSize = useMemo(() => buildDeck().length, [])
  const due = useMemo(() => buildDeck().filter(c => !leitner[c.id] || leitner[c.id].due <= Date.now()).length, [leitner])
  const totalDone = SBD_SECTIONS.reduce((n, s) => n + sectionProgress(s, done).n, 0)
  const overall = Math.round((totalDone / SBD_TOTAL_LESSONS) * 100)

  // Continue where you left off: first section that is started but not finished, else first untouched.
  const next = SBD_SECTIONS.find(s => { const p = sectionProgress(s, done); return p.n > 0 && p.n < p.total }) ||
    SBD_SECTIONS.find(s => sectionProgress(s, done).n === 0) || SBD_SECTIONS[0]

  const q = query.trim().toLowerCase()
  const matches = useMemo(() => {
    if (!q) return []
    const out = []
    for (const s of SBD_SECTIONS) {
      const g = SBD_GUIDES[s.id]
      const inGuide = g && `${s.title} ${g.big} ${g.hook} ${g.points.map(p => p.join(' ')).join(' ')}`.toLowerCase().includes(q)
      const lessons = s.lessons.filter(l => l.title.toLowerCase().includes(q) || l.n.toLowerCase() === q)
      if (inGuide || lessons.length) out.push({ s, lessons })
    }
    return out
  }, [q])

  return (
    <div className="sbx">
      <header className="sbx-hero" style={{ '--hero': `url("${sectionPhoto('foundations-concepts', 1800, 900)}")` }}>
        <div className="sbx-hero-inner">
          <span className="sbx-kicker">● Study by Doing · learn it once, remember it forever</span>
          <h1>AI Engineering <em>Zero → Production</em></h1>
          <p>Every concept as a picture, a story, working code and a 30-second interview answer — plus flashcards that schedule your reviews, so you remember without re-reading.</p>
          <div className="sbx-hero-row">
            <div className="sbx-overall"><Ring pct={overall} size={74} /><div><b>{totalDone} / {SBD_TOTAL_LESSONS}</b><span>lessons done</span></div></div>
            <div className="sbx-hero-stat"><b>{SBD_SECTIONS.length}</b><span>sections</span></div>
            <div className="sbx-hero-stat"><b>{deckSize}</b><span>flashcards</span></div>
            <div className="sbx-hero-stat due"><b>{due}</b><span>due to review</span></div>
          </div>
          <div className="sbx-hero-actions">
            <Link className="sbx-btn primary" to={`/study-by-doing/study/${next.id}`}>▶ Continue: {next.title}</Link>
            <Link className="sbx-btn" to="/study-by-doing/flashcards">🧠 Review {due} flashcards</Link>
            <Link className="sbx-btn" to="/study-by-doing/flashcards?mode=quiz">🎤 Interview quiz</Link>
            <Link className="sbx-btn" to="/study-by-doing/projects">🚀 15 projects end-to-end</Link>
          </div>
        </div>
      </header>

      <section className="sbx-method">
        {[['👀', 'Picture it', 'Every concept starts with an everyday analogy and an image to imagine.'], ['💻', 'Code it', 'A short, runnable example you can type in 2 minutes.'], ['🧠', 'Hook it', 'A one-line memory hook + spaced-repetition flashcards.'], ['🎤', 'Say it', 'A 30-second interview answer you can read aloud.'], ['🌍', 'Dream it', 'A big idea to change the world with each concept.']].map(([i, t, d]) => (
          <div key={t}><span>{i}</span><b>{t}</b><small>{d}</small></div>
        ))}
      </section>

      <div className="sbx-search">
        <span aria-hidden="true">⌕</span>
        <input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder={`Search concepts & ${SBD_TOTAL_LESSONS} lessons — try "RAG", "LoRA", "Kubernetes", "STAR"…`} aria-label="Search concepts and lessons" />
        {query && <button type="button" onClick={() => setQuery('')} aria-label="Clear">✕</button>}
      </div>

      {q ? (
        <section className="sbx-results">
          <h2>{matches.length} sections match “{query}”</h2>
          {matches.map(({ s, lessons }) => (
            <div key={s.id} className="sbx-result">
              <Link to={`/study-by-doing/study/${s.id}`} className="sbx-result-head"><span>{s.icon}</span><b>{s.title}</b><em>Study →</em></Link>
              {SBD_GUIDES[s.id] && <p>💡 {SBD_GUIDES[s.id].big}</p>}
              {lessons.length > 0 && <div className="sbx-result-lessons">{lessons.map(l => <Link key={l.slug} to={`/study-by-doing/${l.slug}`}><code>{l.n}</code> {l.title}</Link>)}</div>}
            </div>
          ))}
        </section>
      ) : TRACKS.map((track, ti) => (
        <section key={track.name} className="sbx-track" style={{ '--hue': track.hue }}>
          <div className="sbx-track-head">
            <span className="sbx-track-n">{String(ti + 1).padStart(2, '0')}</span>
            <h2>{track.icon} {track.name}</h2>
            <span className="sbx-track-meta">{track.ids.length} sections</span>
          </div>
          <div className="sbx-grid">
            {track.ids.map(id => {
              const s = BY_ID[id]
              if (!s) return null
              const g = SBD_GUIDES[id]
              const p = sectionProgress(s, done)
              return (
                <Link key={id} to={`/study-by-doing/study/${id}`} className={`sbx-card ${p.pct === 100 ? 'complete' : ''}`}>
                  <span className="sbx-card-img" style={{ backgroundImage: `url("${sectionPhoto(id)}")` }} />
                  <span className="sbx-card-shade" />
                  <span className="sbx-card-top"><span className="sbx-card-icon">{s.icon}</span><Ring pct={p.pct} size={42} hue={track.hue} /></span>
                  <span className="sbx-card-body">
                    <b>{s.title}</b>
                    {g && <small className="sbx-card-hook">🧠 {g.hook}</small>}
                    <span className="sbx-card-meta">{p.n}/{p.total} lessons · {p.pct === 100 ? '✓ complete' : 'Study →'}</span>
                  </span>
                </Link>
              )
            })}
          </div>
        </section>
      ))}

      <footer className="sbx-foot">
        Lessons open the full original course page inside this app · source: <a href={SBD_ORIGIN} target="_blank" rel="noreferrer">ai.studybydoing.in ↗</a> · progress and flashcard reviews are saved in this browser.
      </footer>
    </div>
  )
}
