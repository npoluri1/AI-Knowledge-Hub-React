import React, { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { INTERVIEW_TESTS } from '../data/learnHub'
import { useLang } from '../i18n'
import './LearnHub.css'

export default function InterviewTests() {
  const { t } = useLang()
  const { id } = useParams()
  const test = id ? INTERVIEW_TESTS.find(t => t.id === id) : null

  // ---- Runner view ----
  if (test) return <Runner test={test} />

  // ---- Hub view ----
  const totalQ = INTERVIEW_TESTS.reduce((n, t) => n + t.questions.length, 0)
  return (
    <div className="lh-page">
      <Link to="/learn" className="lh-back">← {t('Back to Learning Hub')}</Link>
      <section className="lh-topic-hero" style={{ '--t-grad': 'linear-gradient(135deg, #f38ba82e, #f38ba808)', '--t-color': '#f38ba8' }}>
        <div className="lh-topic-icon">📝</div>
        <div className="lh-topic-text">
          <div className="lh-kicker">AI/ML Interview Tests · {INTERVIEW_TESTS.length} tests · {totalQ} questions</div>
          <h1>{t('Practice with the Full Question Bank')}</h1>
          <p>Adaptive-style multiple choice across every topic — instant feedback with explanations. Each test tracks your score and progress.</p>
        </div>
      </section>
      <div className="lh-tests-grid">
        {INTERVIEW_TESTS.map(t => (
          <Link className="lh-test-card" to={`/learn/tests/${t.id}`} key={t.id} style={{ '--t-color': t.color }}>
            <div className="lh-test-top" style={{ background: `linear-gradient(120deg, ${t.color}26, transparent)` }}>
              <span className="lh-lib-icon">{t.icon}</span>
              <span className="lh-blog-meta">{t.questions.length} questions</span>
            </div>
            <div className="lh-test-body">
              <h3>{t.title}</h3>
              <p>{t.desc}</p>
              <span className="lh-lib-cta">Start Test →</span>
            </div>
          </Link>
        ))}
      </div>
      <section className="lh-section">
        <div className="lh-cta-banner">
          <div>
            <h3>📱 Practice anywhere with AI Prep</h3>
            <p>8,400+ questions across all topics — adaptive difficulty, daily challenges, and streaks. Fully offline on Android.</p>
          </div>
          <span className="lh-btn">{t('Free to try')}</span>
        </div>
      </section>
    </div>
  )
}

function Runner({ test }) {
  const { t } = useLang()
  const [idx, setIdx] = useState(0)
  const [picked, setPicked] = useState(null)
  const [answers, setAnswers] = useState([])
  const [finished, setFinished] = useState(false)
  const [started, setStarted] = useState(false)

  const q = test.questions[idx]
  const correct = answers.filter(a => a).length

  const pick = i => {
    if (picked !== null) return
    setPicked(i)
    setAnswers(prev => [...prev, i === q.a])
  }

  const next = () => {
    if (idx + 1 >= test.questions.length) { setFinished(true); return }
    setIdx(idx + 1)
    setPicked(null)
  }

  // ---- Start screen ----
  if (!started) {
    return (
      <div className="lh-page">
        <Link to="/learn/tests" className="lh-back">← {t('Back to tests')}</Link>
        <div className="lh-test-intro" style={{ '--t-color': test.color }}>
          <div className="lh-topic-icon">{test.icon}</div>
          <div className="lh-kicker">{test.questions.length} questions · instant feedback</div>
          <h1>{test.title}</h1>
          <p>{test.desc}</p>
          <div className="lh-stats">
            <div className="lh-stat"><strong>{test.questions.length}</strong><span>{t('questions')}</span></div>
            <div className="lh-stat"><strong>MCQ</strong><span>{t('format')}</span></div>
            <div className="lh-stat"><strong>+1</strong><span>{t('per correct')}</span></div>
          </div>
          <button type="button" className="lh-btn lh-btn-big" style={{ background: test.color }} onClick={() => setStarted(true)}>{t('Start Test →')}</button>
        </div>
      </div>
    )
  }

  // ---- Results screen ----
  if (finished) {
    const pct = Math.round((correct / test.questions.length) * 100)
    const grade = pct >= 90 ? '🏆 Expert' : pct >= 70 ? '🎯 Strong' : pct >= 50 ? '📈 Building' : '📚 Keep learning'
    return (
      <div className="lh-page">
        <Link to="/learn/tests" className="lh-back">← {t('Back to tests')}</Link>
        <div className="lh-test-result" style={{ '--t-color': test.color }}>
          <div className="lh-result-ring" style={{ '--pct': `${pct * 3.6}deg` }}>{pct}%</div>
          <h1>{grade}</h1>
          <p>You scored <strong>{correct}</strong> of {test.questions.length} on {test.title}.</p>
          <div className="lh-result-actions">
            <button type="button" className="lh-btn" style={{ background: test.color }} onClick={() => { setIdx(0); setPicked(null); setAnswers([]); setFinished(false); setStarted(true) }}>{t('↻ Retake test')}</button>
            <Link to="/learn/tests" className="lh-btn">{t('More tests →')}</Link>
          </div>
        </div>
      </div>
    )
  }

  // ---- Question view ----
  return (
    <div className="lh-page">
      <Link to="/learn/tests" className="lh-back">← {t('Exit test')}</Link>
      <div className="lh-quiz" style={{ '--t-color': test.color }}>
        <div className="lh-quiz-top">
          <div className="lh-quiz-progress">
            <div className="lh-quiz-bar"><span style={{ width: `${((idx + (picked !== null ? 1 : 0)) / test.questions.length) * 100}%`, background: test.color }} /></div>
            <span className="lh-quiz-meta">Question {idx + 1} of {test.questions.length} · Score {correct}/{answers.length}</span>
          </div>
        </div>
        <h2 className="lh-quiz-q">{q.q}</h2>
        <div className="lh-quiz-options">
          {q.o.map((opt, i) => {
            let cls = 'lh-option'
            if (picked !== null) {
              if (i === q.a) cls += ' correct'
              else if (i === picked) cls += ' wrong'
              else cls += ' dim'
            }
            return (
              <button type="button" key={i} className={cls} onClick={() => pick(i)} disabled={picked !== null}>
                <span className="lh-opt-key">{String.fromCharCode(65 + i)}</span>
                <span>{opt}</span>
                {picked !== null && i === q.a && <span className="lh-opt-mark">✓</span>}
                {picked !== null && i === picked && i !== q.a && <span className="lh-opt-mark">✕</span>}
              </button>
            )
          })}
        </div>
        {picked !== null && (
          <div className={`lh-quiz-explain ${picked === q.a ? 'good' : 'bad'}`}>
            <strong>{picked === q.a ? t('✅ Correct!') : `❌ Not quite — correct: ${String.fromCharCode(65 + q.a)}`}</strong>
            <p>{q.why}</p>
            <button type="button" className="lh-btn" style={{ background: test.color }} onClick={next}>
              {idx + 1 >= test.questions.length ? t('See results →') : t('Next question →')}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
