import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import ROWS, { AI_STACK_CATEGORIES, AI_STACK_STATS, aiStackCat } from '../data/aiStackData'
import { CERTS, CERTS_TOTAL, VIDEOS, STUDY_LINKS, PEARSON } from '../data/claudeCertData'
import CcafPrep from '../components/CcafPrep'
import ClaudeCertGuide from '../components/ClaudeCertGuide'
import './ClaudeCertView.css'

const SPLIT_RE = /(https?:\/\/[^\s|]+|[a-z0-9.-]+\.(?:com|ai|dev|io|org|gov|net)(?::\d+)?(?:\/[^\s|]*)?)/gi
const IS_URL_RE = /^(https?:\/\/)?[a-z0-9.-]+\.(?:com|ai|dev|io|org|gov|net)(?::\d+)?(?:\/\S*)?$/i

function linkify(text) {
  if (!text || text === '-') return <span className="as-dim">—</span>
  const parts = text.split(SPLIT_RE)
  return parts.map((part, i) => {
    if (IS_URL_RE.test(part) && part.length > 1) {
      const clean = part.replace(/^https?:\/\//i, '')
      return <a key={i} href={`https://${clean}`} target="_blank" rel="noopener noreferrer">{part}</a>
    }
    return <span key={i}>{part}</span>
  })
}

function dedupeText(text) {
  return text.replace(/\s*[|]\s*/g, ' · ').replace(/\s+/g, ' ').trim()
}

export default function ClaudeCertView() {
  const [cat, setCat] = useState('all')
  const [q, setQ] = useState('')

  const filtered = useMemo(() => {
    let list = cat === 'all' ? ROWS : ROWS.filter(r => r.cat === cat)
    const needle = q.trim().toLowerCase()
    if (needle) {
      list = list.filter(r =>
        [r.tool, r.what, r.code, r.docs, r.use, r.industry, r.cat]
          .join(' ').toLowerCase().includes(needle))
    }
    return list
  }, [cat, q])

  return (
    <div className="cc-page">
      <Link to="/" className="back-link">← Back to Home</Link>

      <div className="cc-hero">
        <div className="cc-title-row">
          <h1>📜 Claude Certification Guide</h1>
          <div className="cc-stats">
            <span className="cc-stat">{CERTS.length} Certifications</span>
            <span className="cc-stat">💵 ${CERTS_TOTAL} / all attempts</span>
            <span className="cc-stat">{AI_STACK_STATS.total} Supporting Tools</span>
          </div>
        </div>
        <p className="cc-subtitle">
          Official Anthropic certifications — pricing, study videos and prep links, plus the full
          Claude/AI tool ecosystem you'll be working with (68 tools, one reference).
        </p>
      </div>

      <div className="cc-grid">
        <section className="cc-card cc-pricing">
          <h2>💳 Certification Pricing</h2>
          <table className="cc-price-table">
            <thead>
              <tr>
                <th>Certification</th>
                <th>Level</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {CERTS.map((c, i) => (
                <tr key={i}>
                  <td><span className="cc-cert-icon">{c.icon}</span> {c.name}</td>
                  <td><span className="cc-level">{c.level}</span></td>
                  <td className="cc-price">${c.price}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={2}>Total for one attempt at each</td>
                <td className="cc-price cc-total">${CERTS_TOTAL}</td>
              </tr>
            </tfoot>
          </table>
        </section>

        <section className="cc-card">
          <h2>📺 Video Resources</h2>
          <ul className="cc-link-list">
            {VIDEOS.map((v, i) => (
              <li key={i}>
                <a href={v.url} target="_blank" rel="noopener noreferrer">▶️ {v.label}</a>
                <span className="cc-url">{v.url.replace(/^https?:\/\/(www\.)?/, '')}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="cc-card cc-pearson">
        <div className="cc-pearson-head">
          <h2>🎫 Exam Scheduling & Delivery (Pearson VUE)</h2>
          <span className="cc-pearson-badge">Official proctoring provider</span>
        </div>
        <div className="cc-pearson-grid">
          <div>
            <h3>Certifications on Pearson</h3>
            <ul className="cc-link-list">
              {PEARSON.certs.map((c, i) => (
                <li key={i}>
                  <span className="cc-cert-code">{c.code}</span>{' '}
                  <a href={c.url} target="_blank" rel="noopener noreferrer">{c.label}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3>How to schedule</h3>
            <ol className="cc-pearson-steps">
              {PEARSON.scheduling.map((s, i) => <li key={i}>{s}</li>)}
            </ol>
          </div>
        </div>

        <div className="cc-pearson-grid">
          <div>
            <h3>Retake policy</h3>
            <table className="cc-price-table cc-retake-table">
              <thead>
                <tr><th>Attempt</th><th>Wait before retaking</th></tr>
              </thead>
              <tbody>
                {PEARSON.retakes.map((r, i) => (
                  <tr key={i}>
                    <td>{r.attempt}</td>
                    <td className="cc-price">{r.wait}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={2}>• {PEARSON.maxAttempts}</td>
                </tr>
              </tfoot>
            </table>
            <p className="cc-pearson-badges">🎖️ {PEARSON.badges}</p>
          </div>
          <div>
            <h3>OnVUE online testing — required network domains</h3>
            <p className="cc-pearson-note">
              The following domains (and all subdomains) must be reachable for OnVUE exam delivery.
              Contact your network administrator if the system test flags any of them.
            </p>
            <div className="cc-pearson-domains">
              {PEARSON.onvueDomains.map((d, i) => <code key={i} className="cc-pearson-domain">{d}</code>)}
            </div>
          </div>
        </div>

        <h3>Useful Pearson links</h3>
        <ul className="cc-link-list cc-two-col">
          {PEARSON.links.map((l, i) => (
            <li key={i}>
              <a href={l.url} target="_blank" rel="noopener noreferrer">🔗 {l.label}</a>
              <span className="cc-url">{l.url.replace(/^https?:\/\/(www\.)?/, '')}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="cc-card cc-study">
        <h2>📚 Study & Booking Links</h2>
        <ul className="cc-link-list cc-two-col">
          {STUDY_LINKS.map((l, i) => (
            <li key={i}>
              <a href={l.url} target="_blank" rel="noopener noreferrer">🔗 {l.label}</a>
              <span className="cc-url">{l.url.replace(/^https?:\/\/(www\.)?/, '')}{l.note && <em> — {l.note}</em>}</span>
            </li>
          ))}
        </ul>
      </section>

      <CcafPrep />

      <ClaudeCertGuide />

      <section className="cc-table-section">
        <div className="cc-table-header">
          <h2>🧰 Supporting AI Tool Ecosystem ({AI_STACK_STATS.total} tools)</h2>
          <div className="cc-toolbar">
            <div className="cc-search-box">
              <input
                type="text"
                placeholder="Filter tools — search name, code, use case…"
                value={q}
                onChange={e => setQ(e.target.value)}
              />
              {q && <button className="cc-search-clear" onClick={() => setQ('')}>✕</button>}
            </div>
          </div>
        </div>

        <div className="as-chips">
          <button className={`as-chip ${cat === 'all' ? 'as-chip-active' : ''}`} onClick={() => setCat('all')}>
            🌐 All <b>({AI_STACK_STATS.total})</b>
          </button>
          {AI_STACK_CATEGORIES.map(c => (
            <button
              key={c.name}
              className={`as-chip ${cat === c.name ? 'as-chip-active' : ''}`}
              style={cat === c.name ? { background: `${c.color}22`, borderColor: c.color, color: c.color } : undefined}
              onClick={() => setCat(c.name)}
            >
              {c.icon} {c.name} <b>({ROWS.filter(r => r.cat === c.name).length})</b>
            </button>
          ))}
        </div>

        <div className="as-table-wrap">
          <div className="as-table">
            <table className="as-table-el">
              <thead>
                <tr>
                  <th className="as-col-num">#</th>
                  <th className="as-col-cat">Category</th>
                  <th className="as-col-tool">Tool / Feature</th>
                  <th className="as-col-what">What It Does</th>
                  <th className="as-col-code">Code / Config</th>
                  <th className="as-col-docs">Docs / Models</th>
                  <th className="as-col-use">Use Case</th>
                  <th className="as-col-ind">Industry</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(r => {
                  const m = aiStackCat(r.cat)
                  return (
                    <tr key={r.num} className="as-row">
                      <td className="as-col-num as-num">{r.num}</td>
                      <td className="as-col-cat">
                        <span className="as-cat-badge" style={{ background: `${m.color}22`, color: m.color, borderColor: `${m.color}55` }}>
                          {m.icon} {r.cat}
                        </span>
                      </td>
                      <td className="as-col-tool as-tool">{r.tool}</td>
                      <td className="as-col-what">{r.what}</td>
                      <td className="as-col-code">
                        <code className="as-code">{dedupeText(r.code)}</code>
                      </td>
                      <td className="as-col-docs as-docs">{linkify(dedupeText(r.docs))}</td>
                      <td className="as-col-use">{r.use}</td>
                      <td className="as-col-ind"><span className="as-ind">{r.industry}</span></td>
                    </tr>
                  )
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="as-empty">No tools match your filter.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="cc-footer">
          — Claude Certification Guide · {AI_STACK_STATS.total} supporting tools across {AI_STACK_STATS.categories} categories | Compiled 2026 —
        </div>
      </section>
    </div>
  )
}
