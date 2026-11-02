import React, { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { SBD_SECTIONS } from '../data/studyByDoingData'
import { SBD_GUIDES, SBD_PROJECTS } from '../data/sbdStudyGuides'
import { useProgress, sectionProgress, sectionPhoto, buildDeck, useLeitner, aiLessonCard } from '../data/sbdStudy'
import { parseBlocks, renderBlocks } from '../components/MarkdownView'
import { splitSentences, useNarrator, useVoices, voicesFor, ttsSupported } from '../components/book/speech'
import './SbdStudy.css'

const CHIPS = [['understand', '💡 Understand'], ['code', '💻 Code'], ['remember', '🧠 Remember'], ['interview', '🎤 Interview'], ['ideas', '🌍 Use & ideas'], ['lessons', '📚 Lessons']]

function CopyCode({ code }) {
  const [ok, setOk] = useState(false)
  return (
    <div className="sbx-code">
      <div className="sbx-code-bar"><span>{code.lang}</span><button type="button" onClick={async () => { try { await navigator.clipboard.writeText(code.src); setOk(true); setTimeout(() => setOk(false), 1400) } catch { /* blocked */ } }}>{ok ? '✓ Copied' : '⧉ Copy'}</button></div>
      <pre><code>{code.src}</code></pre>
    </div>
  )
}

function Flip({ card, onGrade }) {
  const [shown, setShown] = useState(false)
  return (
    <div className={`sbx-flip ${shown ? 'shown' : ''}`}>
      <button type="button" className="sbx-flip-face" onClick={() => setShown(s => !s)}>
        <small>{shown ? 'Answer' : 'Tap to reveal'}</small>
        <b>{shown ? card.back : card.front}</b>
        {shown && card.hint && <em>💭 {card.hint}</em>}
      </button>
      {shown && onGrade && (
        <div className="sbx-flip-grade">
          <button type="button" className="again" onClick={() => { onGrade(false); setShown(false) }}>↺ Again</button>
          <button type="button" className="good" onClick={() => { onGrade(true); setShown(false) }}>✓ Knew it</button>
        </div>
      )}
    </div>
  )
}

function LessonRow({ lesson, section, done, onToggle }) {
  const [ai, setAi] = useState({ status: 'idle', text: '' })
  const make = async () => {
    setAi({ status: 'loading', text: '' })
    try { const text = await aiLessonCard(section.title, lesson.title, t => setAi({ status: 'loading', text: t })); setAi({ status: 'ok', text }) } catch (e) { setAi({ status: 'error', text: e.message }) }
  }
  return (
    <li className={`sbx-lesson ${done ? 'done' : ''}`}>
      <div className="sbx-lesson-row">
        <button type="button" className="sbx-check" onClick={() => onToggle(lesson.slug)} aria-pressed={done} aria-label={done ? 'Mark not done' : 'Mark done'}>{done ? '✓' : ''}</button>
        <code>{lesson.n}</code>
        <span className="sbx-lesson-title">{lesson.title}</span>
        <button type="button" className="sbx-mini" onClick={ai.status === 'idle' || ai.status === 'error' ? make : () => setAi({ status: 'idle', text: '' })}>
          {ai.status === 'loading' ? '⏳ Writing…' : ai.status === 'ok' ? 'Hide card' : '✨ AI study card'}
        </button>
        <Link className="sbx-mini primary" to={`/study-by-doing/${lesson.slug}`}>Open lesson →</Link>
      </div>
      {ai.status !== 'idle' && (
        <div className={`sbx-ai ${ai.status}`}>
          {ai.status === 'error' ? <p>⚠️ {ai.text}</p> : <div className="sbx-md">{renderBlocks(parseBlocks(ai.text || 'Thinking…'))}</div>}
        </div>
      )}
    </li>
  )
}

export default function SbdSection() {
  const { sectionId } = useParams()
  const idx = SBD_SECTIONS.findIndex(s => s.id === sectionId)
  const section = SBD_SECTIONS[idx]
  const g = SBD_GUIDES[sectionId]
  const { done, toggle } = useProgress()
  const { grade } = useLeitner()
  const narrator = useNarrator()
  const voices = useVoices()
  const enVoices = useMemo(() => voicesFor(voices, 'en'), [voices])
  const cards = useMemo(() => buildDeck().filter(c => c.section === sectionId), [sectionId])
  const [cardIdx, setCardIdx] = useState(0)
  React.useEffect(() => { window.scrollTo({ top: 0 }); setCardIdx(0); narrator.stop() }, [sectionId]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!section || !g) {
    return <div className="sbx"><Link to="/study-by-doing" className="back-link">← Study path</Link><p className="sbx-empty">Section not found.</p></div>
  }
  const p = sectionProgress(section, done)
  const prev = SBD_SECTIONS[idx - 1]
  const next = SBD_SECTIONS[idx + 1]
  const say = (id, text) => (narrator.trackId === id && narrator.status === 'playing'
    ? narrator.pause()
    : narrator.play({ sentences: splitSentences(text, 'en'), lang: 'en', voices: enVoices, trackId: id }))
  const speaking = id => narrator.trackId === id && narrator.status === 'playing'
  const jump = id => document.getElementById(`sbx-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  const projects = sectionId === 'projects' ? SBD_PROJECTS : []

  return (
    <div className="sbx sbx-study">
      <Link to="/study-by-doing" className="back-link">← Study path</Link>

      <header className="sbx-shero" style={{ '--hero': `url("${sectionPhoto(sectionId, 1800, 900)}")` }}>
        <div className="sbx-shero-inner">
          <span className="sbx-kicker">Section {idx + 1} of {SBD_SECTIONS.length} · {p.n}/{p.total} lessons done</span>
          <h1><span>{section.icon}</span> {section.title}</h1>
          <p className="sbx-big">{g.big}</p>
          <div className="sbx-hookline">🧠 <b>{g.hook}</b></div>
          <div className="sbx-hero-actions">
            {ttsSupported && <button type="button" className="sbx-btn primary" onClick={() => say('all', `${section.title}. ${g.big} Think of it like this: ${g.analogy} Picture it: ${g.picture} Remember: ${g.hook}. In an interview, say: ${g.interview}`)}>{speaking('all') ? '⏸ Pause' : '🔊 Listen to this section'}</button>}
            <button type="button" className="sbx-btn" onClick={() => jump('remember')}>🧠 Flashcards ({cards.length})</button>
            <button type="button" className="sbx-btn" onClick={() => jump('lessons')}>📚 {section.lessons.length} lessons</button>
          </div>
        </div>
      </header>

      <nav className="sbx-chips" aria-label="Jump to">
        {CHIPS.map(([id, label]) => <button key={id} type="button" onClick={() => jump(id)}>{label}</button>)}
      </nav>

      <section id="sbx-understand" className="sbx-block">
        <h2>💡 Understand it</h2>
        <div className="sbx-two">
          <div className="sbx-story"><h3>Everyday analogy</h3><p>{g.analogy}</p></div>
          <div className="sbx-story picture"><h3>Picture it</h3><p>{g.picture}</p></div>
        </div>
        <h3 className="sbx-h3">Key ideas</h3>
        <div className="sbx-points">
          {g.points.map(([term, plain], i) => (
            <div key={term} className="sbx-point"><span>{i + 1}</span><div><b>{term}</b><p>{plain}</p></div></div>
          ))}
        </div>
      </section>

      <section id="sbx-code" className="sbx-block">
        <h2>💻 Code it</h2>
        <p className="sbx-note">Type it out yourself — typing beats reading for memory.</p>
        <CopyCode code={g.code} />
      </section>

      <section id="sbx-remember" className="sbx-block">
        <h2>🧠 Remember it</h2>
        <div className="sbx-hookcard"><small>Memory hook</small><b>{g.hook}</b></div>
        {cards.length > 0 && (
          <div className="sbx-deck">
            <div className="sbx-deck-head"><span>Card {cardIdx + 1} / {cards.length}</span><Link to={`/study-by-doing/flashcards?section=${sectionId}`}>Full review mode →</Link></div>
            <Flip key={cards[cardIdx].id} card={cards[cardIdx]} onGrade={ok => { grade(cards[cardIdx].id, ok); setCardIdx((cardIdx + 1) % cards.length) }} />
            <div className="sbx-deck-nav">
              <button type="button" onClick={() => setCardIdx((cardIdx - 1 + cards.length) % cards.length)}>‹ Prev</button>
              <button type="button" onClick={() => setCardIdx((cardIdx + 1) % cards.length)}>Next ›</button>
            </div>
          </div>
        )}
      </section>

      <section id="sbx-interview" className="sbx-block">
        <h2>🎤 Say it in an interview</h2>
        <div className="sbx-answer">
          <div className="sbx-answer-head"><b>30-second answer</b>{ttsSupported && <button type="button" className="sbx-mini" onClick={() => say('interview', g.interview)}>{speaking('interview') ? '⏸ Pause' : '🔊 Read aloud'}</button>}</div>
          <p>{g.interview}</p>
        </div>
        <h3 className="sbx-h3">Likely questions — answer out loud, then reveal</h3>
        <div className="sbx-qas">{g.qa.map(([q, a]) => <Flip key={q} card={{ front: q, back: a }} />)}</div>
      </section>

      <section id="sbx-ideas" className="sbx-block">
        <h2>🌍 Use it & dream big</h2>
        <div className="sbx-three">
          <div className="sbx-tile uses"><h3>Real use cases</h3><ul>{g.uses.map(u => <li key={u}>{u}</li>)}</ul></div>
          <div className="sbx-tile pit"><h3>⚠️ Classic mistake</h3><p>{g.pitfall}</p></div>
          <div className="sbx-tile idea"><h3>✨ Change-the-world idea</h3><p>{g.idea}</p></div>
        </div>
      </section>

      {projects.length > 0 && (
        <section className="sbx-block">
          <h2>🚀 Projects end-to-end</h2>
          <p className="sbx-note">Full walkthroughs with flows, stacks and interview pitches: <Link to="/study-by-doing/projects">open the projects guide →</Link></p>
        </section>
      )}

      <section id="sbx-lessons" className="sbx-block">
        <h2>📚 Lessons <small>{p.n}/{p.total} done</small></h2>
        <div className="sbx-progress"><i style={{ width: `${p.pct}%` }} /></div>
        <ul className="sbx-lessons">
          {section.lessons.map(l => <LessonRow key={l.slug} lesson={l} section={section} done={done.has(l.slug)} onToggle={toggle} />)}
        </ul>
        <p className="sbx-note">✨ AI study cards are generated on demand and saved in this browser. “Open lesson” shows the full original course page.</p>
      </section>

      <nav className="sbx-pager">
        {prev ? <Link to={`/study-by-doing/study/${prev.id}`}>‹ {prev.icon} {prev.title}</Link> : <span />}
        {next ? <Link to={`/study-by-doing/study/${next.id}`}>{next.icon} {next.title} ›</Link> : <span />}
      </nav>
    </div>
  )
}
