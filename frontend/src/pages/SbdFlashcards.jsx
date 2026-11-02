import React, { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { SBD_SECTIONS } from '../data/studyByDoingData'
import { buildDeck, useLeitner } from '../data/sbdStudy'
import './SbdStudy.css'

// Spaced-repetition review (Leitner boxes) + interview quiz mode.
export default function SbdFlashcards() {
  const [params, setParams] = useSearchParams()
  const section = params.get('section') || 'all'
  const mode = params.get('mode') === 'quiz' ? 'quiz' : 'review'
  const { state, grade, reset } = useLeitner()
  const deck = useMemo(() => buildDeck(), [])
  const [shown, setShown] = useState(false)
  const [session, setSession] = useState({ right: 0, wrong: 0 })
  const [skip, setSkip] = useState(0)

  const pool = useMemo(() => {
    let cards = deck.filter(c => section === 'all' || c.section === section)
    if (mode === 'quiz') cards = cards.filter(c => c.interview || c.id.endsWith(':big'))
    const now = Date.now()
    const due = cards.filter(c => !state[c.id] || state[c.id].due <= now)
    return (due.length ? due : cards).sort((a, b) => (state[a.id]?.box || 0) - (state[b.id]?.box || 0))
  }, [deck, section, mode, state])

  const card = pool.length ? pool[skip % pool.length] : null
  const boxes = useMemo(() => {
    const c = [0, 0, 0, 0, 0, 0]
    deck.filter(x => section === 'all' || x.section === section).forEach(x => { c[state[x.id]?.box || 0]++ })
    return c
  }, [deck, state, section])
  const set = (k, v) => { const n = new URLSearchParams(params); if (v && v !== 'all' && v !== 'review') n.set(k, v); else n.delete(k); setParams(n); setShown(false); setSkip(0) }
  const answer = ok => { grade(card.id, ok); setSession(s => ({ right: s.right + (ok ? 1 : 0), wrong: s.wrong + (ok ? 0 : 1) })); setShown(false); if (!ok) setSkip(x => x + 1) }

  React.useEffect(() => {
    const onKey = e => {
      if (!card || e.target.closest('input, select, textarea')) return
      if (e.key === ' ') { e.preventDefault(); setShown(s => !s) }
      if (shown && (e.key === '1' || e.key === 'ArrowLeft')) answer(false)
      if (shown && (e.key === '2' || e.key === 'ArrowRight')) answer(true)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  return (
    <div className="sbx sbx-fc">
      <Link to="/study-by-doing" className="back-link">← Study path</Link>
      <header className="sbx-fc-head">
        <div>
          <h1>{mode === 'quiz' ? '🎤 Interview quiz' : '🧠 Flashcard review'}</h1>
          <p>{mode === 'quiz' ? 'Answer out loud as if in an interview, then reveal and grade yourself honestly.' : 'Spaced repetition: cards you know come back later, cards you miss come back tomorrow.'}</p>
        </div>
        <div className="sbx-fc-controls">
          <div className="sbx-seg">
            <button type="button" className={mode === 'review' ? 'on' : ''} onClick={() => set('mode', 'review')}>Review</button>
            <button type="button" className={mode === 'quiz' ? 'on' : ''} onClick={() => set('mode', 'quiz')}>Quiz</button>
          </div>
          <select value={section} onChange={e => set('section', e.target.value)} aria-label="Section">
            <option value="all">All {SBD_SECTIONS.length} sections</option>
            {SBD_SECTIONS.map(s => <option key={s.id} value={s.id}>{s.icon} {s.title}</option>)}
          </select>
        </div>
      </header>

      <div className="sbx-boxes" aria-label="Leitner boxes">
        {['New', 'Daily', '2 days', '4 days', '8 days', 'Mastered'].map((l, i) => <div key={l} className={`b${i}`}><b>{boxes[i]}</b><span>{l}</span></div>)}
      </div>

      {card ? (
        <div className={`sbx-bigcard ${shown ? 'shown' : ''}`}>
          <div className="sbx-bigcard-meta"><span>{card.icon} {card.sectionTitle}</span><span>{pool.length} due · session ✓{session.right} ✗{session.wrong}</span></div>
          <button type="button" className="sbx-bigcard-face" onClick={() => setShown(s => !s)}>
            <small>{shown ? 'Answer' : 'Question — think first, then tap (or press Space)'}</small>
            <b>{card.front}</b>
            {shown && <p className="sbx-bigcard-back">{card.back}</p>}
            {shown && card.hint && <em>💭 {card.hint}</em>}
          </button>
          {shown ? (
            <div className="sbx-flip-grade big">
              <button type="button" className="again" onClick={() => answer(false)}>↺ Again <kbd>1</kbd></button>
              <button type="button" className="good" onClick={() => answer(true)}>✓ Knew it <kbd>2</kbd></button>
            </div>
          ) : (
            <div className="sbx-flip-grade big"><button type="button" className="reveal" onClick={() => setShown(true)}>Reveal answer <kbd>Space</kbd></button></div>
          )}
          <div className="sbx-bigcard-foot">
            <button type="button" onClick={() => { setSkip(x => x + 1); setShown(false) }}>Skip ›</button>
            <Link to={`/study-by-doing/study/${card.section}`}>Study this section →</Link>
          </div>
        </div>
      ) : <p className="sbx-empty">No cards here.</p>}

      <p className="sbx-note center">Reviews are saved in this browser. <button type="button" className="sbx-linkbtn" onClick={() => { if (window.confirm('Reset all flashcard progress?')) reset() }}>Reset progress</button></p>
    </div>
  )
}
