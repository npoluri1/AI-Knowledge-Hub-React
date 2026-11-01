import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  etlHeader, etlMarket, etlCategories, etlSalaries, etlRankings, etlTopCombos,
  etlAiTools, etlLearningPath, etlJobMarket, etlJobRankings, etlSalaryImpact,
  etlVerdict, etlFinalVerdict, etlSources,
} from '../data/etlData'
import {
  techStackTools, techStackComparison, techStackLearningOrder,
} from '../data/etlTechStack'
import FetchButton from '../components/FetchButton'
import { useLang } from '../i18n'
import './EtlGuideView.css'

/* ─── helpers ─────────────────────────────────────────────────────── */
function DemBadge({ demand }) {
  return <span className={`etl-dem etl-dem-${demand}`}>{demand.replace(/-/g, ' ').toUpperCase()}</span>
}

function RankBadge({ rank }) {
  const cls = rank <= 3 ? `etl-rank-${rank}` : 'etl-rank-n'
  return <span className={`etl-rank ${cls}`}>{rank}</span>
}

function NoteRow({ icon, cls, html }) {
  return (
    <div className="etl-note-row">
      <span className="etl-note-icon">{icon}</span>
      <span className={`etl-note-text ${cls}`} dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  )
}

function SalaryPayCell({ text }) {
  if (!text) return null
  const t = text.toUpperCase()
  let cls = 'etl-pay-stable'
  if (t.includes('VERY HIGH')) cls = 'etl-pay-very-high'
  else if (t.includes('HIGH')) cls = 'etl-pay-high'
  else if (t.includes('GROWING')) cls = 'etl-pay-growing'
  else if (t.includes('DECLINING')) cls = 'etl-pay-declining'
  return <span className={cls}>{text}</span>
}

function PostingsBar({ count, max, demand }) {
  const pct = Math.min(100, (count / max) * 100)
  const colors = {
    'VERY HIGH': '#04a5e0', 'HIGH': '#89b4fa', 'FAST GROWING': '#a6e3a1',
    'DECLINING': '#f38ba8', 'GROWING': '#a6e3a1',
  }
  return (
    <div className="etl-postings-bar">
      <div className="etl-postings-fill" style={{ width: `${pct}%`, background: colors[demand] || '#6c7086' }} />
    </div>
  )
}

/* ─── Accordion Section ───────────────────────────────────────────── */
function Section({ title, demand, count, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className={`etl-accordion etl-sec-${demand}`}>
      <button className="etl-accordion-head" onClick={() => setOpen(!open)}>
        <span className={`etl-accordion-arrow ${open ? 'open' : ''}`}>▶</span>
        {title}
        {count != null && <span className="etl-accordion-count">{count}</span>}
      </button>
      <div className={`etl-accordion-body ${open ? 'open' : ''}`}>
        {children}
      </div>
    </div>
  )
}

/* ─── Tool Table ──────────────────────────────────────────────────── */
function ToolTable({ tools, showNote = true }) {
  return (
    <div className="etl-table-wrap">
      <table className="etl-table">
        <thead>
          <tr>
            <th>Tool</th>
            <th>Type</th>
            <th>Cost</th>
            <th>Difficulty</th>
            <th>Salary Impact</th>
            <th>Demand</th>
            {showNote && <th>Notes</th>}
          </tr>
        </thead>
        <tbody>
          {tools.map((t, i) => (
            <tr key={i}>
              <td style={{ color: '#cdd6f4', fontWeight: 600, minWidth: 150 }}>{t.name}</td>
              <td style={{ color: '#a6adc8' }}>{t.type}</td>
              <td style={{ color: '#a6adc8', fontSize: 0.82 }}>{t.cost}</td>
              <td style={{ color: '#a6adc8' }}>{t.difficulty}</td>
              <td><SalaryPayCell text={t.salaryImpact} /></td>
              <td><DemBadge demand={t.demand} /></td>
              {showNote && <td style={{ color: '#8892a0', fontSize: 0.82, minWidth: 200 }}>{t.note}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* ─── MAIN COMPONENT ──────────────────────────────────────────────── */
export default function EtlGuideView() {
  const { t } = useLang()
  return (
    <div className="etl-page">
      <Link to="/" className="back-link">← {t('Back to Home')}</Link>

      {/* ─── HERO ──────────────────────────────────────────────── */}
      <div className="etl-hero">
        <div className="page-header-row">
          <h1>{t('📊 ETL Tools & Data Engineering — Complete Global Guide 2026')}</h1>
          <FetchButton label={t('Fetch Latest')} staticMode />
        </div>
        <p className="etl-hero-sub">
          Current Tools, Future AI-Integrated Tools, Salary &amp; Learning Path — All you need to know about the ETL &amp; data engineering landscape in 2026.
        </p>
        <div className="etl-hero-meta">Generated: {etlHeader.generated}</div>
        <div className="etl-legend">
          {etlHeader.colorLegend.map((l, i) => (
            <span key={i} className={`etl-legend-chip etl-chip-${l.cls}`}>
              {l.label} <em>({l.hint})</em>
            </span>
          ))}
        </div>
      </div>

      {/* ─── MARKET OVERVIEW ───────────────────────────────────── */}
      <Section title="📈 SECTION 1: ETL Tool Categories & Market Overview" demand="very-hot" defaultOpen>
        <div className="etl-market">
          <div className="etl-market-card">
            <h3>💰 Market Size</h3>
            {etlMarket.marketSize.map((r, i) => (
              <div key={i} className="etl-market-row">
                <span className="etl-market-label">{r.label}</span>
                <span className="etl-market-value">{r.value}</span>
              </div>
            ))}
          </div>
          <div className="etl-market-card">
            <h3>🌍 Market Dominance</h3>
            {etlMarket.dominance.map((r, i) => (
              <div key={i} className="etl-market-row">
                <span className="etl-market-label">{r.label}</span>
                <span className="etl-market-value">{r.value}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ─── TOOL CATEGORIES ────────────────────────────────────── */}
      {etlCategories.map((cat) => (
        <Section
          key={cat.id}
          title={`🛠️ SECTION 2${cat.id}: ${cat.title}`}
          demand={cat.demand}
          count={`${cat.tools.length} tools`}
        >
          <ToolTable tools={cat.tools} />
          {/* Tool notes section */}
          <div className="etl-notes">
            {cat.tools.map((t, i) => (
              <NoteRow
                key={i}
                icon={t.demand === 'declining' ? '---' : '+++'}
                cls={t.demand === 'declining' ? 'etl-note-dec' : t.demand === 'very-hot' ? 'etl-note-hot' : 'etl-note-best'}
                html={`<strong>${t.name}:</strong> ${t.note}`}
              />
            ))}
          </div>
        </Section>
      ))}

      {/* ─── GLOBAL SALARY ──────────────────────────────────────── */}
      <Section title="💵 SECTION 3: Global Salary Comparison by Country" demand="hot" count="5 regions, 22 countries">
        {etlSalaries.map((region, ri) => (
          <div key={ri} style={{ marginBottom: 20 }}>
            <span className="etl-sal-region">{region.region}</span>
            <div className="etl-table-wrap">
              <table className="etl-table">
                <thead>
                  <tr>
                    <th>Country</th>
                    <th>Junior</th>
                    <th>Mid</th>
                    <th>Senior</th>
                    <th>Lead / Principal</th>
                  </tr>
                </thead>
                <tbody>
                  {region.countries.map((c, ci) => (
                    <tr key={ci}>
                      <td style={{ color: '#cdd6f4', fontWeight: 600 }}>{c.country}</td>
                      <td className="etl-sal-junior">{c.junior}</td>
                      <td className="etl-sal-mid">{c.mid}</td>
                      <td className="etl-sal-senior">{c.senior}</td>
                      <td className="etl-sal-lead">{c.lead}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </Section>

      {/* ─── BEST TOOLS RANKING ────────────────────────────────── */}
      <Section title="🏆 SECTION 4: Best Tools to Learn (Ranked by Pay & Demand)" demand="best" count="15 tools ranked">
        <div className="etl-table-wrap">
          <table className="etl-table">
            <thead>
              <tr>
                <th style={{ width: 44 }}>#</th>
                <th>Tool</th>
                <th>Why Learn</th>
                <th>Pay Premium</th>
                <th>Demand</th>
              </tr>
            </thead>
            <tbody>
              {etlRankings.map((r) => (
                <tr key={r.rank}>
                  <td><RankBadge rank={r.rank} /></td>
                  <td style={{ color: '#cdd6f4', fontWeight: 600 }}>{r.tool}</td>
                  <td style={{ color: '#a6adc8' }}>{r.why}</td>
                  <td><SalaryPayCell text={r.payPremium} /></td>
                  <td><DemBadge demand={r.demand === 'VERY HIGH' ? 'very-hot' : r.demand === 'HIGH' ? 'hot' : r.demand === 'GROWING' ? 'growing' : r.demand === 'FAST GROWING' ? 'emerging' : 'declining'} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Top 5 Combinations */}
        <h3 style={{ color: '#b4befe', marginTop: 20, marginBottom: 12 }}>🔥 Top 5 "Must Learn" Combinations (Highest Combined Pay)</h3>
        <div className="etl-combos">
          {etlTopCombos.map((c) => (
            <div key={c.rank} className="etl-combo">
              <RankBadge rank={c.rank} />
              <span className="etl-combo-name">{c.combo}</span>
              <span className="etl-combo-pay">{c.pay}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* ─── AI-INTEGRATED TOOLS ────────────────────────────────── */}
      <Section title="🤖 SECTION 5: AI-Integrated Data Engineering Tools (Future)" demand="very-hot" count="21 tools across 3 layers">
        <h3 style={{ color: '#b4befe', marginBottom: 10 }}>5.1 AI-Powered ETL Tools (Current)</h3>
        <div className="etl-table-wrap">
          <table className="etl-table">
            <thead><tr><th>Tool</th><th>AI Feature</th><th>What It Does</th></tr></thead>
            <tbody>
              {etlAiTools.current.map((t, i) => (
                <tr key={i}>
                  <td style={{ color: '#cdd6f4', fontWeight: 600 }}>{t.name}</td>
                  <td style={{ color: '#89b4fa' }}>{t.feature}</td>
                  <td style={{ color: '#a6adc8' }}>{t.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 style={{ color: '#b4befe', marginTop: 20, marginBottom: 10 }}>5.2 AI-Native Data Tools (Emerging — Learn Now)</h3>
        <div className="etl-table-wrap">
          <table className="etl-table">
            <thead><tr><th>Tool</th><th>Category</th><th>What It Does</th></tr></thead>
            <tbody>
              {etlAiTools.emerging.map((t, i) => (
                <tr key={i}>
                  <td style={{ color: '#cdd6f4', fontWeight: 600 }}>{t.name}</td>
                  <td><DemBadge demand="emerging" /> {t.category}</td>
                  <td style={{ color: '#a6adc8' }}>{t.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 style={{ color: '#b4befe', marginTop: 20, marginBottom: 10 }}>5.3 AI-Ready Data Architecture — The 2026 Stack</h3>
        <div className="etl-arch">
          {etlAiTools.architecture.map((layer, i) => (
            <React.Fragment key={i}>
              <div className="etl-arch-layer">
                <span className={`etl-arch-label etl-arch-${i}`}>{layer.layer}</span>
                <span className="etl-arch-tools">{layer.tools}</span>
              </div>
              {i < etlAiTools.architecture.length - 1 && <div className="etl-arch-arrow">▼</div>}
            </React.Fragment>
          ))}
        </div>
      </Section>

      {/* ─── LEARNING PATH ──────────────────────────────────────── */}
      <Section title="🗺️ SECTION 6: Learning Path & Certification Roadmap" demand="best" count="4 phases, 24 months">
        {etlLearningPath.map((phase, pi) => (
          <div key={pi} className="etl-lp-card">
            <div className="etl-lp-head">
              <span className="etl-lp-phase">{phase.phase}</span>
              <span className="etl-lp-time">{phase.time}</span>
              <span className="etl-lp-target">TARGET: {phase.target}</span>
            </div>

            {phase.skills && (
              <div className="etl-lp-section">
                <div className="etl-lp-label">Skills to Learn</div>
                <ul className="etl-lp-list">
                  {phase.skills.map((s, si) => <li key={si}>{s}</li>)}
                </ul>
              </div>
            )}

            {phase.tools && (
              <div className="etl-lp-section">
                <div className="etl-lp-label">Tools to Learn</div>
                <ul className="etl-lp-list">
                  {phase.tools.map((t, ti) => <li key={ti}>{t}</li>)}
                </ul>
              </div>
            )}

            {phase.certs && (
              <div className="etl-lp-section">
                <div className="etl-lp-label">Certifications</div>
                <ul className="etl-lp-list">
                  {phase.certs.map((c, ci) => <li key={ci}>{c}</li>)}
                </ul>
              </div>
            )}

            {phase.projects && (
              <div className="etl-lp-section">
                <div className="etl-lp-label">Projects</div>
                <ul className="etl-lp-list">
                  {phase.projects.map((p, pj) => <li key={pj}>{p}</li>)}
                </ul>
              </div>
            )}

            {phase.tracks && (
              <div className="etl-lp-section">
                <div className="etl-lp-label">Choose Your Track</div>
                {phase.tracks.map((tr, ti) => (
                  <div key={ti} className="etl-lp-track">
                    <div className="etl-lp-track-name">{tr.name}</div>
                    <ul className="etl-lp-list">
                      {tr.skills.map((s, si) => <li key={si}>{s}</li>)}
                    </ul>
                    <div className="etl-lp-track-cert">🎓 {tr.cert}</div>
                  </div>
                ))}
              </div>
            )}

            {phase.roles && (
              <div className="etl-lp-section">
                <div className="etl-lp-label">Role Titles</div>
                <ul className="etl-lp-list">
                  {phase.roles.map((r, ri) => <li key={ri}>{r}</li>)}
                </ul>
              </div>
            )}
          </div>
        ))}
      </Section>

      {/* ─── JOB MARKET ─────────────────────────────────────────── */}
      <Section title="💼 SECTION 7: Job Market by Country & Role" demand="hot" count="10 regions">
        {/* Roles by country */}
        {etlJobMarket.map((region, ri) => (
          <div key={ri} style={{ marginBottom: 18 }}>
            <span className="etl-job-region">{region.region}</span>
            <div className="etl-table-wrap">
              <table className="etl-table">
                <thead><tr><th>Role Title</th><th>Salary Range</th><th>Top Hiring Companies</th></tr></thead>
                <tbody>
                  {region.roles.map((r, i) => (
                    <tr key={i}>
                      <td style={{ color: '#cdd6f4', fontWeight: 600 }}>{r.title}</td>
                      <td className="etl-job-salary">{r.salary}</td>
                      <td className="etl-job-companies">{r.companies}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}

        {/* Job postings ranking */}
        <h3 style={{ color: '#b4befe', marginTop: 20, marginBottom: 14 }}>📊 ETL Tools with Most Job Postings (Global, 2026)</h3>
        <div className="etl-postings-wrap">
          {(() => {
            const maxPosts = Math.max(...etlJobRankings.map(r => {
              const n = parseInt(r.postings.replace(/[^0-9]/g, ''), 10) || 0
              return n
            }))
            return etlJobRankings.map((r) => {
              const num = parseInt(r.postings.replace(/[^0-9]/g, ''), 10) || 1
              return (
                <div key={r.rank} className="etl-postings-row">
                  <div className="etl-postings-rank"><RankBadge rank={r.rank} /></div>
                  <span className="etl-postings-tool">{r.tool}</span>
                  <PostingsBar count={num} max={maxPosts} demand={r.demand} />
                  <span className="etl-postings-count">{r.postings}</span>
                </div>
              )
            })
          })()}
        </div>
      </Section>

      {/* ─── SALARY IMPACT ──────────────────────────────────────── */}
      <Section title="💎 Quick Reference: Salary Impact by Skill" demand="salary" count="14 skills">
        <div className="etl-table-wrap">
          <table className="etl-table">
            <thead><tr><th>Skill</th><th>Salary Premium (US Market)</th></tr></thead>
            <tbody>
              {etlSalaryImpact.map((s, i) => (
                <tr key={i}>
                  <td style={{ color: '#cdd6f4', fontWeight: 600 }}>{s.skill}</td>
                  <td><SalaryPayCell text={s.premium} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/*   TECH STACK DEEP-DIVE                                        */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <Section title="🔧 TECH STACK DEEP-DIVE: 8 Core Tools — Concepts, Queries, Differences" demand="very-hot" count="8 tools compared" defaultOpen>

        {/* ─── Quick Comparison ────────────────────────────────── */}
        <h3 style={{ color: '#b4befe', marginBottom: 14 }}>Quick Comparison — All 8 Tools at a Glance</h3>
        <div className="etl-table-wrap">
          <table className="etl-table">
            <thead>
              <tr>
                <th>Tool</th>
                <th>Category</th>
                <th>Difficulty</th>
                <th>Senior Salary (US)</th>
                <th>Best For</th>
                <th>Learn First?</th>
              </tr>
            </thead>
            <tbody>
              {techStackComparison.map((t, i) => (
                <tr key={i}>
                  <td style={{ color: '#cdd6f4', fontWeight: 600 }}>{t.tool}</td>
                  <td><DemBadge demand={t.category.includes('Streaming') ? 'very-hot' : t.category.includes('Lakehouse') ? 'hot' : 'best'} /> {t.category}</td>
                  <td style={{ color: '#a6adc8' }}>{t.difficulty}</td>
                  <td style={{ color: '#04a5e0', fontWeight: 700 }}>{t.salarySenior}</td>
                  <td style={{ color: '#a6adc8', fontSize: 0.82 }}>{t.bestFor}</td>
                  <td>{t.learnFirst ? <span style={{ color: '#a6e3a1', fontWeight: 700 }}>✅ Yes</span> : <span style={{ color: '#6c7086' }}>Later</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ─── Learning Order ───────────────────────────────────── */}
        <h3 style={{ color: '#b4befe', marginTop: 22, marginBottom: 14 }}>📚 Recommended Learning Order</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {techStackLearningOrder.map((p) => (
            <div key={p.phase} className="etl-lp-card" style={{ margin: 0 }}>
              <div className="etl-lp-head" style={{ marginBottom: 6 }}>
                <RankBadge rank={p.phase} />
                <span className="etl-lp-phase" style={{ fontSize: '0.88rem' }}>{p.tool}</span>
              </div>
              <div style={{ color: '#a6adc8', fontSize: 0.84 }}>{p.why}</div>
            </div>
          ))}
        </div>

        {/* ─── Per-Tool Deep Dive ──────────────────────────────── */}
        <h3 style={{ color: '#b4befe', marginTop: 24, marginBottom: 14 }}>🔍 Tool-by-Tool Deep Dive</h3>

        {techStackTools.map((tool) => (
          <div key={tool.id} className="etl-tech-tool-card">
            {/* Tool Header */}
            <div className="etl-tech-tool-head">
              <span className="etl-tech-tool-icon">{tool.icon}</span>
              <div>
                <div className="etl-tech-tool-name">{tool.name}</div>
                <div className="etl-tech-tool-tagline">{tool.tagline}</div>
              </div>
              <div className="etl-tech-tool-meta">
                <DemBadge demand={tool.difficulty === 'VERY HIGH' ? 'very-hot' : tool.difficulty === 'HIGH' ? 'hot' : 'best'} />
                <span className="etl-tech-tool-cat">{tool.category}</span>
              </div>
            </div>

            {/* What Is */}
            <div className="etl-tech-what">{tool.whatIs}</div>

            {/* Salary */}
            <div className="etl-tech-salary-row">
              <span className="etl-tech-salary-label">💵 Salary Ranges:</span>
              <span className="etl-sal-junior">Junior: {tool.salary.junior}</span>
              <span className="etl-sal-mid">Mid: {tool.salary.mid}</span>
              <span className="etl-sal-senior">Senior: {tool.salary.senior}</span>
              <span className="etl-sal-lead">Lead: {tool.salary.lead}</span>
            </div>
            <div className="etl-tech-combo-row">
              🔥 Best Combo: <strong>{tool.bestCombo}</strong> = <span style={{ color: '#04a5e0', fontWeight: 700 }}>{tool.bestComboPay}</span>
            </div>

            {/* Differences */}
            <div className="etl-tech-sub-title">⚖️ How It Differs From Other Tools</div>
            <div className="etl-tech-vs">
              {tool.vs.map((v, i) => (
                <div key={i} className="etl-tech-vs-row">
                  <span className="etl-tech-vs-tool">vs {v.tool}:</span>
                  <span className="etl-tech-vs-diff">{v.diff}</span>
                </div>
              ))}
            </div>

            {/* Concepts */}
            <div className="etl-tech-sub-title">📖 Core Concepts ({tool.concepts.length})</div>
            <div className="etl-tech-concepts">
              {tool.concepts.map((c, i) => (
                <div key={i} className="etl-tech-concept">
                  <div className="etl-tech-concept-name">{c.name}</div>
                  <div className="etl-tech-concept-desc">{c.desc}</div>
                </div>
              ))}
            </div>

            {/* Topics */}
            <div className="etl-tech-sub-title">📋 Key Topics to Master ({tool.topics.length})</div>
            <div className="etl-tech-topics">
              {tool.topics.map((t, i) => (
                <span key={i} className="etl-tech-topic-chip">{t}</span>
              ))}
            </div>

            {/* Code / Queries */}
            <div className="etl-tech-sub-title">💻 Code Examples & Queries ({tool.queries.length})</div>
            <div className="etl-tech-queries">
              {tool.queries.map((q, i) => (
                <div key={i} className="etl-tech-query">
                  <div className="etl-tech-query-title">
                    <span className="etl-tech-query-lang" data-lang={q.lang}>{q.lang}</span>
                    {q.title}
                  </div>
                  <pre className="etl-tech-query-code"><code>{q.code}</code></pre>
                </div>
              ))}
            </div>

            {/* End-to-End */}
            <div className="etl-tech-sub-title">🔗 End-to-End Pipeline Patterns</div>
            <div className="etl-tech-e2e">
              {tool.endToEnd.map((e, i) => (
                <div key={i} className="etl-tech-e2e-row">{e}</div>
              ))}
            </div>

            {/* Verdict */}
            <div className="etl-tech-verdict">{tool.verdict}</div>
          </div>
        ))}
      </Section>

      {/* ─── VERDICT ────────────────────────────────────────────── */}
      <Section title="🧭 RECOMMENDATION: What to Learn Based on Your Goal" demand="best" defaultOpen>
        <div className="etl-verdict-card">
          {etlVerdict.map((v, i) => (
            <div key={i} className="etl-verdict-row">
              <span className="etl-verdict-goal">{v.goal}</span>
              <span className="etl-verdict-path">{v.path}</span>
              <span className="etl-verdict-pay">{v.pay}</span>
            </div>
          ))}
          <div className="etl-final">
            <div className="etl-final-label">🏆 THE VERDICT</div>
            <div className="etl-final-text">{etlFinalVerdict}</div>
          </div>
        </div>
      </Section>

      {/* ─── FOOTER ─────────────────────────────────────────────── */}
      <div className="etl-footer">
        ETL Tools &amp; Data Engineering — Complete Global Guide 2026<br />
        Sources: {etlSources}
      </div>
    </div>
  )
}
