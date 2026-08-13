import { useMemo, useState } from 'react'
import { domains, themes, tasks, scenarios, questions, cheat, mock } from '../data/ccafData'
import './CcafPrep.css'

const DOMAIN_BY_ID = Object.fromEntries(domains.map(d => [d.id, d]))
const QUESTION_BY_ID = Object.fromEntries(questions.map(q => [q.id, q]))

const TABS = [
  { id: 'lessons', label: '📚 Lessons', count: tasks.length },
  { id: 'scenarios', label: '🎬 Scenarios', count: scenarios.length },
  { id: 'questions', label: '❓ Sample Qs', count: questions.length },
  { id: 'cheat', label: '📋 Cheat Sheet', count: cheat.length },
  { id: 'mock', label: '✍️ Mock Exam', count: mock.length },
]

const KEYS = ['A', 'B', 'C', 'D', 'E', 'F']

function DomainBadge({ id, small }) {
  const d = DOMAIN_BY_ID[id]
  if (!d) return null
  return <span className={`ccaf-domain-badge ${small ? 'ccaf-small' : ''}`}>D{d.n} · {d.short}</span>
}

function ChatTranscript({ turns }) {
  return (
    <div className="ccaf-chat">
      {turns.map((t, i) => (
        <div key={i} className={`ccaf-turn ccaf-turn-${t.who}`}>
          {t.who === 'note' ? (
            <div className="ccaf-note">💬 {t.text}</div>
          ) : (
            <div className="ccaf-bubble">
              {t.label && <div className="ccaf-bubble-label">{t.who === 'claude' ? 'Claude' : 'You'}: {t.label}</div>}
              <div>{t.text}</div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function LessonCard({ task }) {
  const [open, setOpen] = useState(false)
  const linkedQs = (task.q || []).map(id => QUESTION_BY_ID[id]).filter(Boolean)
  const fields = [
    { k: 'concept', label: '💡 Concept', icon: '💡' },
    { k: 'right', label: '✅ Do this' },
    { k: 'antipattern', label: '❌ Antipattern' },
    { k: 'tip', label: '🎯 Exam tip' },
    { k: 'analogy', label: '🔗 Analogy' },
    { k: 'pitfall', label: '⚠️ Pitfall' },
  ]
  return (
    <div className={`ccaf-lesson ${open ? 'ccaf-lesson-open' : ''}`}>
      <button className="ccaf-lesson-head" onClick={() => setOpen(!open)}>
        <span className="ccaf-lesson-id">{task.id}</span>
        <span className="ccaf-lesson-title">{task.title}</span>
        <DomainBadge id={task.d} small />
        <span className="ccaf-lesson-caret">{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className="ccaf-lesson-body">
          {fields.map(f => (
            task[f.k] && (
              <div key={f.k} className="ccaf-field">
                <div className="ccaf-field-label">{f.label}</div>
                <div className="ccaf-field-text">{task[f.k]}</div>
              </div>
            )
          ))}
          {task.chat && task.chat.length > 0 && (
            <details className="ccaf-chat-details">
              <summary>💬 Claude chat walkthrough</summary>
              <ChatTranscript turns={task.chat} />
            </details>
          )}
          {linkedQs.length > 0 && (
            <div className="ccaf-linked">
              <div className="ccaf-field-label">Related sample question{linkedQs.length > 1 ? 's' : ''}</div>
              {linkedQs.map(q => (
                <div key={q.id} className="ccaf-linked-q">
                  <strong>{q.prompt}</strong>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function QACard({ q, index, showIndex }) {
  const [picked, setPicked] = useState(null)
  const correct = q.answer
  return (
    <div className="ccaf-qa">
      <div className="ccaf-qa-prompt">
        {typeof showIndex === 'number' && <span className="ccaf-qa-num">{showIndex + 1}.</span>} {q.prompt}
        {q.ref && <div className="ccaf-qa-ref">ref: {q.ref}</div>}
      </div>
      <div className="ccaf-qa-options">
        {q.options.map((opt, i) => {
          let cls = 'ccaf-opt'
          if (picked !== null) {
            if (i === correct) cls += ' ccaf-opt-correct'
            else if (i === picked) cls += ' ccaf-opt-wrong'
            else cls += ' ccaf-opt-dim'
          }
          return (
            <button key={i} className={cls} onClick={() => setPicked(i)} disabled={picked !== null}>
              <span className="ccaf-opt-key">{KEYS[i]}</span> {opt}
              {picked !== null && i === correct && <span className="ccaf-opt-mark">✓</span>}
              {picked !== null && i === picked && i !== correct && <span className="ccaf-opt-mark">✗</span>}
            </button>
          )
        })}
      </div>
      {picked !== null && (
        <div className={`ccaf-qa-why ${picked === correct ? 'ccaf-good' : 'ccaf-bad'}`}>
          <strong>{picked === correct ? '✓ Correct' : `✗ Wrong — correct is ${KEYS[correct]}`}.</strong> {q.why}
        </div>
      )}
    </div>
  )
}

function MockQuiz({ bank }) {
  const [idx, setIdx] = useState(0)
  const [picked, setPicked] = useState(null)
  const [answers, setAnswers] = useState({})
  const q = bank[idx]
  const done = Object.keys(answers).length
  const correctCount = bank.filter(b => answers[b.id] === b.answer).length
  const answered = answers[q.id] !== undefined
  return (
    <div className="ccaf-mock">
      <div className="ccaf-mock-bar">
        <span>Question {idx + 1} of {bank.length}</span>
        <span>Answered {done}/{bank.length}</span>
        <span>Score {correctCount}</span>
      </div>
      <div className="ccaf-mock-progress"><div style={{ width: `${((idx + 1) / bank.length) * 100}%` }} /></div>
      <QACard key={q.id} q={q} showIndex={idx} />
      <div className="ccaf-mock-nav">
        <button onClick={() => { setIdx(Math.max(0, idx - 1)); setPicked(answers[bank[Math.max(0, idx - 1)].id] ?? null) }} disabled={idx === 0}>← Prev</button>
        <button onClick={() => { const sel = picked; setAnswers(a => ({ ...a, [q.id]: sel })) }} disabled={picked === null}>
          {answered ? 'Re-record answer' : 'Record answer'}
        </button>
        <button
          onClick={() => { setAnswers(a => ({ ...a, [q.id]: picked })); setIdx(Math.min(bank.length - 1, idx + 1)); setPicked(answers[bank[Math.min(bank.length - 1, idx + 1)].id] ?? null) }}
          disabled={idx === bank.length - 1}
        >Next →</button>
      </div>
    </div>
  )
}

function LessonListView() {
  const [cat, setCat] = useState('all')
  const [q, setQ] = useState('')
  const list = useMemo(() => {
    let l = cat === 'all' ? tasks : tasks.filter(t => t.d === cat)
    const needle = q.trim().toLowerCase()
    if (needle) l = l.filter(t => [t.id, t.title, t.concept, t.right, t.tip].join(' ').toLowerCase().includes(needle))
    return l
  }, [cat, q])
  return (
    <div>
      <div className="ccaf-toolbar">
        <input className="ccaf-search" placeholder="Search lessons…" value={q} onChange={e => setQ(e.target.value)} />
        <button className={`ccaf-chip ${cat === 'all' ? 'ccaf-chip-active' : ''}`} onClick={() => setCat('all')}>🌐 All ({tasks.length})</button>
        {domains.map(d => (
          <button key={d.id} className={`ccaf-chip ${cat === d.id ? 'ccaf-chip-active' : ''}`} onClick={() => setCat(d.id)}>
            D{d.n} {d.short} ({tasks.filter(t => t.d === d.id).length})
          </button>
        ))}
      </div>
      <div className="ccaf-lessons">
        {list.map(t => <LessonCard key={t.id} task={t} />)}
        {list.length === 0 && <p className="ccaf-empty">No lessons match.</p>}
      </div>
    </div>
  )
}

function OverviewView({ setTab }) {
  return (
    <div>
      <div className="ccaf-overview-grid">
        {domains.map(d => (
          <div key={d.id} className="ccaf-domain-card">
            <div className="ccaf-domain-top">
              <span className="ccaf-domain-n">Domain {d.n}</span>
              <span className="ccaf-domain-w">{d.weight}%</span>
            </div>
            <div className="ccaf-domain-title">{d.title}</div>
            <div className="ccaf-domain-bar"><div style={{ width: `${d.weight * 3}%` }} /></div>
            <div className="ccaf-domain-blurb">{d.blurb}</div>
            <button className="ccaf-domain-go" onClick={() => setTab('lessons')}>
              {tasks.filter(t => t.d === d.id).length} lessons →
            </button>
          </div>
        ))}
      </div>
      <div className="ccaf-themes">
        {themes.map(t => (
          <div key={t.id} className="ccaf-theme">
            <div className="ccaf-theme-title">⭐ {t.title}</div>
            <div className="ccaf-theme-body">{t.body}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function CcafPrep() {
  const [tab, setTab] = useState('lessons')
  return (
    <div className="ccaf">
      <div className="ccaf-tabs">
        {TABS.map(t => (
          <button key={t.id} className={`ccaf-tab ${tab === t.id ? 'ccaf-tab-active' : ''}`} onClick={() => setTab(t.id)}>
            {t.label} <b>({t.count})</b>
          </button>
        ))}
      </div>
      {tab === 'lessons' && <LessonListView />}
      {tab === 'scenarios' && (
        <div className="ccaf-scenarios">
          {scenarios.map(s => (
            <div key={s.id} className="ccaf-scenario">
              <div className="ccaf-scenario-head">
                <span className="ccaf-scenario-n">{s.n}.</span>
                <span className="ccaf-scenario-title">{s.title}</span>
                <span className="ccaf-scenario-domains">{s.domains.map(d => <DomainBadge key={d} id={d} small />)}</span>
              </div>
              <p className="ccaf-scenario-summary">{s.summary}</p>
              <ol className="ccaf-scenario-steps">
                {s.steps.map((st, i) => (
                  <li key={i}>
                    <strong>{st.t}</strong>{st.task && <span className="ccaf-step-task"> · lesson {st.task}</span>}
                    <div className="ccaf-step-d">{st.d}</div>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      )}
      {tab === 'questions' && (
        <div className="ccaf-qa-list">
          {questions.map((q, i) => <QACard key={q.id} q={q} showIndex={i} />)}
        </div>
      )}
      {tab === 'cheat' && (
        <div className="ccaf-cheat">
          {domains.map(d => {
            const items = cheat.filter(c => c.d === d.id)
            if (items.length === 0) return null
            return (
              <div key={d.id} className="ccaf-cheat-group">
                <div className="ccaf-cheat-group-title">Domain {d.n} — {d.title}</div>
                {items.map((c, i) => (
                  <div key={i} className="ccaf-cheat-item">
                    <span className="ccaf-cheat-num">{d.n}.{String(i + 1).padStart(2, '0')}</span>
                    {c.fact}
                    {c.task && <span className="ccaf-cheat-task"> · lesson {c.task}</span>}
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      )}
      {tab === 'mock' && <MockQuiz bank={mock} />}
      {tab === 'overview' && <OverviewView setTab={setTab} />}
    </div>
  )
}
