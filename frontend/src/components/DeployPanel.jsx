import React, { useState } from 'react'
import { BlockCode } from './DesignDiagram'
import { blockCodeFor, blockImplNote } from '../data/aiDesignSpace/blockCode'

const TARGETS = [
  { id: 'render', icon: '🖼️', name: 'Render', tag: 'Web Service', cmd: 'Create a Render Web Service → connect GitHub repo → set env vars → Deploy', url: 'https://render.com' },
  { id: 'railway', icon: '🚂', name: 'Railway', tag: 'Instant', cmd: 'railway init && railway up — env vars from dashboard', url: 'https://railway.app' },
  { id: 'fly', icon: '🪂', name: 'Fly.io', tag: 'Edge / Global', cmd: 'fly launch --dockerfile Dockerfile && fly deploy', url: 'https://fly.io' },
  { id: 'vercel', icon: '▲', name: 'Vercel', tag: 'Frontend', cmd: 'vercel deploy — Next.js UI; backend stays on Render/Railway', url: 'https://vercel.com' },
  { id: 'aws', icon: '☁️', name: 'AWS', tag: 'ECS / EKS', cmd: 'docker push to ECR → run task/eksctl → ALB + Route 53', url: 'https://aws.amazon.com' },
  { id: 'gcp', icon: '🌐', name: 'Google Cloud', tag: 'Cloud Run', cmd: 'gcloud builds submit && gcloud run deploy --platform managed', url: 'https://cloud.google.com' },
]

// Expected UI / output preview rendered per diagram section.
// Every mock-UI block is clickable — selecting it reveals the exact code
// that renders that part of the screen (chat answer, citations, decision,
// dashboard KPIs, flow steps…), matching the HLD/LDD/flow block behaviour.
export function ExpectedOutput({ ctx, mode = 'ask', pattern }) {
  const V = String(ctx || 'your domain').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')
  const [open, setOpen] = useState(null)

  // Reusable clickable block wrapper: shows code for a node kind.
  const UiBlock = ({ id, label, kind, children, className = '' }) => {
    const isOpen = open === id
    const res = pattern ? blockCodeFor({ pattern, ctx, kind, title: label }) : null
    return (
      <div className={`ads-ui-block ${isOpen ? 'on' : ''} ${className}`}>
        <button
          type="button"
          className="ads-ui-block-head"
          onClick={() => setOpen(isOpen ? null : id)}
          aria-expanded={isOpen}
          disabled={!pattern}
          title={pattern ? 'Click to see the code that produces this output' : undefined}
        >
          {children}
          {pattern && <span className="ads-ui-block-code-hint">{isOpen ? '− Hide code' : '💻 Show code'}</span>}
        </button>
        {isOpen && res && (
          <div className="ads-ff-code">
            <BlockCode {...res} note={blockImplNote({ pattern, ctx, kind, title: label })} accent={pattern.color || '#89dceb'} label={`${label} — this output`} />
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="ads-output-preview">
      <div className="ads-output-head">
        <span>🖥️ Expected UI / output — {V} {pattern && <small style={{ opacity: 0.7, fontWeight: 600 }}>· click any block for its code</small>}</span>
        <span className="ads-output-badge">preview</span>
      </div>
      <div className="ads-output-body">
        {mode === 'ask' && (
          <>
            <UiBlock id="chat-question" label="Client Request" kind="entry" className="ads-mock-chat">
              <div className="ads-mock-user">Q: How do I onboard a new {ctx || 'customer'}?</div>
            </UiBlock>
            <UiBlock id="chat-answer" label="Grounded Answer" kind="ai" className="ads-mock-ai">
              <p>Here is the grounded answer for {V}:</p>
              <ul>
                <li>✅ Retrieved from 3 sources (policy-doc-v2, sop-014, contract #88)</li>
                <li>📎 Citations: [policy-doc-v2 §4.1, sop-014 §2]</li>
                <li>🎯 Confidence: 0.93 · Decision: <strong>Approved</strong></li>
              </ul>
            </UiBlock>
            <div className="ads-mock-meta">
              <UiBlock id="meta-trace" label="Agent Trace" kind="agent" className="ads-mock-meta-chip">
                <span>🧠 trace: plan → retrieve → reason → respond</span>
              </UiBlock>
              <UiBlock id="meta-evals" label="Evaluation Scores" kind="action" className="ads-mock-meta-chip">
                <span>✅ evals: faithfulness 0.94 · relevance 0.88</span>
              </UiBlock>
            </div>
          </>
        )}
        {mode === 'dashboard' && (
          <div className="ads-mock-dash">
            <UiBlock id="kpi-events" label="Event Throughput" kind="data" className="ads-dash-kpi">
              <strong>12,408</strong><span>events / min</span>
            </UiBlock>
            <UiBlock id="kpi-resolved" label="Auto-Resolved" kind="ai" className="ads-dash-kpi">
              <strong>99.2%</strong><span>auto-resolved</span>
            </UiBlock>
            <UiBlock id="kpi-latency" label="Latency p95" kind="gateway" className="ads-dash-kpi">
              <strong>38ms</strong><span>p95 latency</span>
            </UiBlock>
            <UiBlock id="kpi-alerts" label="Open Alerts" kind="ops" className="ads-dash-kpi">
              <strong>0</strong><span>open alerts</span>
            </UiBlock>
          </div>
        )}
        {mode === 'flow' && (
          <div className="ads-mock-flow">
            {['entry', 'gateway', 'reason', 'act', 'store'].map((s, i) => (
              <UiBlock key={s} id={`step-${s}`} label={`Step ${i + 1} · ${s}`} kind={s === 'reason' ? 'ai' : s} className="ads-flow-step">
                <em>{i + 1}</em> {s}
                {i < 4 && <b>→</b>}
              </UiBlock>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// One-click deploy panel: pick a target → see exact command + URL.
export default function DeployPanel({ ctx, stack = 'FastAPI · LangGraph · VectorDB', name }) {
  const [target, setTarget] = useState(TARGETS[0])
  const appName = name || `${String(ctx || 'app').toLowerCase().replace(/[^a-z0-9]+/g, '-')}-ai`
  return (
    <div className="ads-deploy">
      <div className="ads-deploy-head">
        <div>
          <h4>🚀 Deploy — {appName}</h4>
          <p>Stack: {stack}. Pick a target, copy the command, ship it. Expected output preview below.</p>
        </div>
      </div>

      <div className="ads-deploy-targets">
        {TARGETS.map(t => (
          <button
            type="button"
            key={t.id}
            className={`ads-deploy-target ${target.id === t.id ? 'active' : ''}`}
            onClick={() => setTarget(t)}
          >
            <span className="ads-deploy-target-icon">{t.icon}</span>
            <span>
              <strong>{t.name}</strong>
              <small>{t.tag}</small>
            </span>
          </button>
        ))}
      </div>

      <div className="ads-deploy-step">
        <div className="ads-deploy-step-head">
          <span>{target.icon} Deploy to {target.name}</span>
          <a href={target.url} target="_blank" rel="noreferrer" className="ads-deploy-open">Open {target.name} ↗</a>
        </div>
        <pre className="ads-deploy-cmd">
          <code>{target.cmd}</code>
        </pre>
        <div className="ads-deploy-actions">
          <button
            type="button"
            className="ads-btn-primary"
            onClick={() => { try { navigator.clipboard.writeText(target.cmd) } catch { /* ignore */ } }}
          >
            📋 Copy command
          </button>
          <a href={target.url} target="_blank" rel="noreferrer" className="ads-btn-ghost">Deploy now →</a>
        </div>
      </div>

      <ExpectedOutput ctx={ctx} mode="dashboard" />
    </div>
  )
}
