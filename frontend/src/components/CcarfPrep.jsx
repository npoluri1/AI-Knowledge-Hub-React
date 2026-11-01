import { useMemo, useState } from 'react'
import {
  ccarfExam, ccarfDomains, ccarfScenarios, ccarfMindset, ccarfConcepts, ccarfQuestions,
  ccarfResources, ccarfPlan, ccarfPassReports, ccarfPracticeBanks, ccarfBooks,
  ccarfOpenAI, ccarfAltCerts, ccarfComparison, ccarfHowToChoose, ccarfCombo,
  ccarfWatchouts, ccarfDumpWarning,
} from '../data/ccarfData'
import './CcarfPrep.css'

const KEYS = ['A', 'B', 'C', 'D']
const DOMAIN_COLORS = ['#89b4fa', '#cba6f7', '#a6e3a1', '#f9e2af', '#f38ba8']

const TABS = [
  { id: 'exam', label: '📋 Exam & Domains' },
  { id: 'concepts', label: '🧠 Concept Tables', count: ccarfConcepts.length },
  { id: 'practice', label: '✍️ Practice Exam', count: ccarfQuestions.length },
  { id: 'resources', label: '🔗 Resources' },
  { id: 'compare', label: '⚖️ Compare Certs' },
]

function DnBadge({ d }) {
  return <span className="ccf-domain-badge" style={{ color: DOMAIN_COLORS[d - 1], borderColor: `${DOMAIN_COLORS[d - 1]}66` }}>D{d}</span>
}

function ExamView() {
  return (
    <div className="ccf-stack">
      <section className="ccf-block">
        <h3>🔎 Exam at a glance</h3>
        <table className="ccf-table ccf-kv">
          <tbody>
            {ccarfExam.map(([k, v], i) => (
              <tr key={i}>
                <td className="ccf-k">{k}</td>
                <td className="ccf-v">{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="ccf-block">
        <h3>🎯 Domains & Weights <span className="ccf-sub">(spend study time proportionally)</span></h3>
        <div className="ccf-domains">
          {ccarfDomains.map(d => (
            <div key={d.n} className="ccf-domain-row">
              <div className="ccf-domain-head">
                <span className="ccf-domain-n" style={{ color: DOMAIN_COLORS[d.n - 1] }}>D{d.n}</span>
                <span className="ccf-domain-title">{d.title}</span>
                <span className="ccf-domain-w">{d.weight}%</span>
              </div>
              <div className="ccf-domain-track">
                <div className="ccf-domain-fill" style={{ width: `${d.weight * 3}%`, background: DOMAIN_COLORS[d.n - 1] }} />
              </div>
              <div className="ccf-domain-prio">{d.priority}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="ccf-block">
        <h3>🎬 The 6 Exam Scenarios <span className="ccf-sub">(4 drawn at random)</span></h3>
        <div className="ccf-scen-grid">
          {ccarfScenarios.map(s => (
            <div key={s.n} className="ccf-scen-card">
              <div className="ccf-scen-n">{s.n}</div>
              <div className="ccf-scen-title">{s.title}</div>
              <div className="ccf-scen-stress">{s.stress}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="ccf-block">
        <h3>🧭 Core Exam Mindset <span className="ccf-sub">(the 3+1 ideas behind most questions)</span></h3>
        <div className="ccf-mindset">
          {ccarfMindset.map(m => (
            <div key={m.p} className="ccf-mindset-card">
              <div className="ccf-mindset-p">{m.p}</div>
              <div className="ccf-mindset-m">{m.m}</div>
              <div className="ccf-mindset-s">{m.s}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

function ConceptsView() {
  const [open, setOpen] = useState('d1')
  return (
    <div className="ccf-stack">
      {ccarfConcepts.map(c => (
        <section key={c.id} className="ccf-block">
          <button className="ccf-concepts-head" onClick={() => setOpen(open === c.id ? null : c.id)}>
            <span>{c.title}</span>
            <span className="ccf-caret">{open === c.id ? '▲' : '▼'}</span>
          </button>
          {open === c.id && (
            <div className="ccf-table-wrap">
              <table className="ccf-table">
                <thead>
                  <tr>
                    <th>Concept</th>
                    <th>What it tests</th>
                    <th>Key facts</th>
                    <th>Common pitfall</th>
                  </tr>
                </thead>
                <tbody>
                  {c.rows.map((r, i) => (
                    <tr key={i}>
                      <td className="ccf-concept">{r.concept}</td>
                      <td>{r.tests}</td>
                      <td>{r.facts}</td>
                      <td className="ccf-pitfall">⚠️ {r.pitfall}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      ))}
      <p className="ccf-note">"Study these cold" — every row maps to an exam pattern. Pass mark on the real exam ~43/60; aim for 48+ before booking.</p>
    </div>
  )
}

function PracticeView() {
  const [cat, setCat] = useState('all')
  const [picked, setPicked] = useState({})
  const list = useMemo(
    () => (cat === 'all' ? ccarfQuestions : ccarfQuestions.filter(q => q.d === cat)),
    [cat]
  )
  const answered = Object.keys(picked).length
  const correct = ccarfQuestions.filter(q => picked[q.n] === q.a).length
  return (
    <div>
      <div className="ccf-toolbar">
        <button className={`ccf-chip ${cat === 'all' ? 'ccf-chip-active' : ''}`} onClick={() => setCat('all')}>
          🌐 All <b>({ccarfQuestions.length})</b>
        </button>
        {ccarfDomains.map(d => (
          <button key={d.n} className={`ccf-chip ${cat === d.n ? 'ccf-chip-active' : ''}`} onClick={() => setCat(d.n)}>
            D{d.n} {d.title.split(' — ')[0]} <b>({ccarfQuestions.filter(q => q.d === d.n).length})</b>
          </button>
        ))}
      </div>
      <div className="ccf-scorebar">
        <span>Answered <b>{answered}/{ccarfQuestions.length}</b></span>
        <span>Correct <b>{correct}</b></span>
        <span className={correct / Math.max(1, answered) >= 0.8 ? 'ccf-good' : 'ccf-warn'}>
          {answered > 0 ? Math.round((correct / answered) * 100) : 0}% accuracy
        </span>
      </div>
      <div className="ccf-qa-list">
        {list.map(q => {
          const sel = picked[q.n]
          return (
            <div key={q.n} className="ccf-qa">
              <div className="ccf-qa-prompt">
                <span className="ccf-qa-num">{q.n}.</span> <DnBadge d={q.d} /> {q.q}
              </div>
              <div className="ccf-qa-options">
                {q.o.map((opt, i) => {
                  let cls = 'ccf-opt'
                  if (sel !== undefined) {
                    if (i === q.a) cls += ' ccf-opt-correct'
                    else if (i === sel) cls += ' ccf-opt-wrong'
                    else cls += ' ccf-opt-dim'
                  }
                  return (
                    <button key={i} className={cls} onClick={() => setPicked(p => ({ ...p, [q.n]: i }))} disabled={sel !== undefined}>
                      <span className="ccf-opt-key">{KEYS[i]}</span> {opt}
                      {sel !== undefined && i === q.a && <span className="ccf-opt-mark">✓</span>}
                      {sel !== undefined && i === sel && i !== q.a && <span className="ccf-opt-mark">✗</span>}
                    </button>
                  )
                })}
              </div>
              {sel !== undefined && (
                <div className={`ccf-qa-why ${sel === q.a ? 'ccf-good' : 'ccf-bad'}`}>
                  <strong>{sel === q.a ? '✓ Correct' : `✗ Wrong — correct is ${KEYS[q.a]}`}.</strong> {q.why}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ResourceTable({ rows }) {
  return (
    <div className="ccf-table-wrap">
      <table className="ccf-table">
        <thead>
          <tr><th>Region</th><th>Resource</th><th>Type</th><th>Link</th></tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              <td className="ccf-region">{r[0]}</td>
              <td>{r[1]}</td>
              <td className="ccf-type">{r[2]}</td>
              <td className="ccf-link">{r[3] === '—' ? <span className="ccf-dim">—</span> : <a href={r[3]} target="_blank" rel="noopener noreferrer">{r[3]}</a>}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function ResourcesView() {
  return (
    <div className="ccf-stack">
      <p className="ccf-note">Most resources are online/global — region lists which region produces/edits them. Always verify exam eligibility via the official Partner Academy route for your country.</p>
      {ccarfResources.map(g => (
        <section key={g.region} className="ccf-block">
          <h3>{g.region}</h3>
          <ResourceTable rows={g.rows} />
        </section>
      ))}

      <section className="ccf-block">
        <h3>🗓️ 4-Week Quick Plan <span className="ccf-sub">(if you must pass fast)</span></h3>
        <div className="ccf-table-wrap">
          <table className="ccf-table">
            <thead><tr><th>Week</th><th>Focus</th><th>Actions</th></tr></thead>
            <tbody>
              {ccarfPlan.map((p, i) => (
                <tr key={i}>
                  <td className="ccf-region">{p[0]}</td>
                  <td className="ccf-concept">{p[1]}</td>
                  <td>{p[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="ccf-block">
        <h3>🏆 Community Pass Reports <span className="ccf-sub">(first-hand writeups — read 2-3, same patterns repeat)</span></h3>
        <ResourceTable rows={ccarfPassReports} />
      </section>

      <section className="ccf-block">
        <h3>📚 Practice Banks & Mock Exams <span className="ccf-sub">(free + paid)</span></h3>
        <div className="ccf-table-wrap">
          <table className="ccf-table">
            <thead><tr><th>Resource</th><th>Contents</th><th>Cost</th><th>Link</th></tr></thead>
            <tbody>
              {ccarfPracticeBanks.map((r, i) => (
                <tr key={i}>
                  <td className="ccf-concept">{r[0]}</td>
                  <td>{r[1]}</td>
                  <td className="ccf-type">{r[2]}</td>
                  <td className="ccf-link"><a href={r[3]} target="_blank" rel="noopener noreferrer">{r[3]}</a></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="ccf-block">
        <h3>📖 Books <span className="ccf-sub">(print / ebook)</span></h3>
        <div className="ccf-table-wrap">
          <table className="ccf-table">
            <thead><tr><th>Book</th><th>Why</th><th>Note</th></tr></thead>
            <tbody>
              {ccarfBooks.map((b, i) => (
                <tr key={i}>
                  <td className="ccf-concept">{b[0]}</td>
                  <td>{b[1]}</td>
                  <td className="ccf-type">{b[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

function CompareView() {
  return (
    <div className="ccf-stack">
      <section className="ccf-block">
        <h3>⭐ Star-Rated AI Certification Comparison <span className="ccf-sub">(★ = weakest, ★★★★★ = strongest; Prep = free material, Value = market signal)</span></h3>
        <div className="ccf-table-wrap ccf-wide">
          <table className="ccf-table">
            <thead>
              <tr>
                <th>Certification</th><th>Provider</th><th>Level</th><th>Cost</th>
                <th>Prep ★</th><th>Value ★</th><th>Best for</th><th>Verdict</th>
              </tr>
            </thead>
            <tbody>
              {ccarfComparison.map((r, i) => (
                <tr key={i}>
                  <td className="ccf-concept">{r[0]}</td>
                  <td className="ccf-type">{r[1]}</td>
                  <td>{r[2]}</td>
                  <td className="ccf-type">{r[3]}</td>
                  <td>{r[4]}</td>
                  <td>{r[5]}</td>
                  <td>{r[6]}</td>
                  <td className="ccf-verdict">{r[7]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="ccf-block">
        <h3>🧭 How to choose <span className="ccf-sub">(quick guide)</span></h3>
        <div className="ccf-table-wrap">
          <table className="ccf-table">
            <thead><tr><th>Your situation</th><th>Recommended pick(s)</th></tr></thead>
            <tbody>
              {ccarfHowToChoose.map((r, i) => (
                <tr key={i}>
                  <td className="ccf-concept">{r[0]}</td>
                  <td>{r[1]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="ccf-block">
        <h3>🔁 Top recommended combo <span className="ccf-sub">(ranked by prep ease → value)</span></h3>
        <ol className="ccf-combo">
          {ccarfCombo.map((c, i) => <li key={i}>{c}</li>)}
        </ol>
        <div className="ccf-warnbox">
          <strong>Watch-outs:</strong>
          <ul>
            {ccarfWatchouts.map((w, i) => <li key={i}>{w}</li>)}
          </ul>
        </div>
      </section>

      <section className="ccf-block">
        <h3>🤖 ChatGPT / OpenAI Certifications <span className="ccf-sub">(the answer to "any other exams?")</span></h3>
        <div className="ccf-warnbox ccf-soft">
          <strong>Short answer:</strong> OpenAI does NOT have a proctored exam like CCA-F yet. It has free certificate COURSES (open to anyone with a ChatGPT account) and a formal OpenAI Certification that is still employer-pilot only. Do not buy "OpenAI exam dumps" — no such exam exists.
        </div>
        <div className="ccf-table-wrap">
          <table className="ccf-table">
            <thead><tr><th>Item</th><th>Status (2026)</th><th>Details</th><th>Link</th></tr></thead>
            <tbody>
              {ccarfOpenAI.map((r, i) => (
                <tr key={i}>
                  <td className="ccf-concept">{r[0]}</td>
                  <td className="ccf-type">{r[1]}</td>
                  <td>{r[2]}</td>
                  <td className="ccf-link">{r[3] === '—' ? <span className="ccf-dim">—</span> : <a href={r[3]} target="_blank" rel="noopener noreferrer">{r[3]}</a>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="ccf-block">
        <h3>🎓 Alternative AI certifications <span className="ccf-sub">(you can actually sit NOW — proctored, public)</span></h3>
        <div className="ccf-table-wrap">
          <table className="ccf-table">
            <thead><tr><th>Provider</th><th>Certification</th><th>Notes</th></tr></thead>
            <tbody>
              {ccarfAltCerts.map((r, i) => (
                <tr key={i}>
                  <td className="ccf-region">{r[0]}</td>
                  <td className="ccf-concept">{r[1]}</td>
                  <td>{r[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="ccf-warnbox ccf-red">
        {ccarfDumpWarning}
      </div>
    </div>
  )
}

export default function CcarfPrep() {
  const [tab, setTab] = useState('exam')
  return (
    <div className="ccf">
      <div className="ccf-head">
        <h2>🧠 CCAR-F Complete Prep Pack</h2>
        <p>Claude Certified Architect — Foundations · 60Q practice exam with reasoning · domain concept tables · regional resources · cert comparison (compiled 2026).</p>
      </div>
      <div className="ccf-tabs">
        {TABS.map(t => (
          <button key={t.id} className={`ccf-tab ${tab === t.id ? 'ccf-tab-active' : ''}`} onClick={() => setTab(t.id)}>
            {t.label} {t.count !== undefined && <b>({t.count})</b>}
          </button>
        ))}
      </div>
      {tab === 'exam' && <ExamView />}
      {tab === 'concepts' && <ConceptsView />}
      {tab === 'practice' && <PracticeView />}
      {tab === 'resources' && <ResourcesView />}
      {tab === 'compare' && <CompareView />}
    </div>
  )
}
