import React, { useState } from 'react'
import { JOB_SOLUTIONS, JOB_SOLUTIONS_META } from '../data/jobSolutionsData'

export default function JobSolutionsSection() {
  const [openCard, setOpenCard] = useState(null)
  const toggle = (id) => setOpenCard(openCard === id ? null : id)

  return (
    <section className="jsol-section" id="ai-solutions">
      <div className="jsol-header">
        <div className="jsol-heading">
          <h2>{JOB_SOLUTIONS_META.title}</h2>
          <p>{JOB_SOLUTIONS_META.description}</p>
        </div>
        <span className="jsol-count">{JOB_SOLUTIONS.length} playbook{JOB_SOLUTIONS.length !== 1 ? 's' : ''}</span>
      </div>

      <div className="jsol-grid">
        {JOB_SOLUTIONS.map((entry) => (
          <article
            key={entry.id}
            className={`jsol-card ${openCard === entry.id ? 'open' : ''}`}
            onClick={() => toggle(entry.id)}
          >
            <div className="jsol-card-top">
              <div className="jsol-role">
                <span className="jsol-domain">{entry.domain}</span>
                <h3>{entry.role}</h3>
              </div>
              <span className="jsol-toggle">{openCard === entry.id ? '−' : '+'}</span>
            </div>

            <div className="jsol-meta">
              <span className="jsol-org">{entry.org}</span>
              <span className="jsol-loc">📍 {entry.location}</span>
            </div>

            <p className="jsol-summary">{entry.summary}</p>

            <div className="jsol-tags">
              {entry.tags.map((t) => (
                <span className="jsol-tag" key={t}>{t}</span>
              ))}
            </div>

            <div className="jsol-targets">
              <h4>🎯 Requirements → Targets</h4>
              <ul>
                {entry.targets.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>

            <div className="jsol-solutions">
              <h4>🛠️ AI Solutions — Implementation</h4>
              {entry.responsibilities.map((r, i) => (
                <div className="jsol-sol" key={r.label}>
                  <div className="jsol-sol-head">
                    <span className="jsol-sol-num">{String(i + 1).padStart(2, '0')}</span>
                    <h5>{r.label}</h5>
                  </div>
                  <p className="jsol-problem"><strong>Problem:</strong> {r.problem}</p>
                  <p className="jsol-sol-desc">{r.solution}</p>
                  <div className="jsol-sol-stack">
                    {r.stack.map((s) => (
                      <span className="jsol-stack-chip" key={s}>{s}</span>
                    ))}
                  </div>
                  <ol className="jsol-steps">
                    {r.steps.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ol>
                  <p className="jsol-outcome"><strong>Outcome:</strong> {r.outcome}</p>
                </div>
              ))}
            </div>

            <div className="jsol-arch">
              <h4>🧩 End-to-End Architecture</h4>
              <div className="jsol-flow">
                {entry.architecture.map((a, i) => (
                  <React.Fragment key={a.step}>
                    {i > 0 && <span className="jsol-flow-arrow">→</span>}
                    <div className="jsol-flow-node">
                      <strong>{a.step}</strong>
                      <span>{a.detail}</span>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>

            <div className="jsol-governance">
              <h4>🛡️ Compliance & Guardrails</h4>
              <ul>
                {entry.governance.map((g) => (
                  <li key={g}>{g}</li>
                ))}
              </ul>
            </div>

            <div className="jsol-stackcodes">
              {entry.stackCodes.map((sc) => (
                <div className="jsol-stackcode" key={sc.code}>
                  <span className="jsol-stackcode-label">{sc.code}</span>
                  <code>{sc.label}</code>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}