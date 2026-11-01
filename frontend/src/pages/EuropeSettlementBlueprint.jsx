import React, { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './EuropeSettlementBlueprint.css'

// The full blueprint (hero, 17 sections, live gross-to-net calculator,
// filterable 45-country matrix, roadmap timeline, FAQ) lives as a
// self-contained HTML document in /public so it is served same-origin and
// keeps every bit of its own interactivity. This page wraps it in a proper
// in-app viewer: header, section quick-jumps and an "open full page" escape.
const GUIDE_URL = '/guides/europe-settlement-blueprint.html'

const SECTIONS = [
  { id: 'verdict', label: 'Verdict' },
  { id: 'fit', label: 'Profile Fit' },
  { id: 'tier1', label: 'Target List' },
  { id: 'matrix', label: 'All Countries' },
  { id: 'roadmap', label: 'Roadmap' },
  { id: 'germany', label: 'Germany' },
  { id: 'nordic', label: 'Nordics' },
  { id: 'money', label: 'Take-Home & Tax' },
  { id: 'health', label: 'Health Insurance' },
  { id: 'protection', label: 'Life & Pension' },
  { id: 'family', label: 'Family' },
  { id: 'balance', label: 'Work-Life' },
  { id: 'hunt', label: 'Get the Job' },
  { id: 'land', label: 'Settle In' },
  { id: 'jobs', label: 'Job Playbook' },
  { id: 'docs', label: 'Documents' },
  { id: 'faq', label: 'FAQ' },
]

const STATS = [
  { v: '21–27', k: 'months to PR' },
  { v: '45', k: 'countries mapped' },
  { v: '€2.5–4.7k', k: 'monthly take-home' },
  { v: '0', k: 'spouse health cost' },
]

export default function EuropeSettlementBlueprint() {
  const location = useLocation()
  const frameRef = useRef(null)
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)
  const [active, setActive] = useState(location.hash ? location.hash.slice(1) : 'verdict')

  // Start at the deep-linked section (e.g. /europe-settlement#verdict).
  const src = `${GUIDE_URL}${location.hash || '#verdict'}`

  // Jump inside the already-loaded iframe without reloading it.
  const jump = id => {
    setActive(id)
    const frame = frameRef.current
    if (!frame) return
    try {
      const win = frame.contentWindow
      const doc = frame.contentDocument
      const target = doc && doc.getElementById(id)
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      else win.location.hash = `#${id}`
    } catch {
      frame.src = `${GUIDE_URL}#${id}`
    }
  }

  // Keep the chips in sync when the user scrolls/navigates inside the frame.
  useEffect(() => {
    const frame = frameRef.current
    if (!frame || !loaded) return undefined
    let raf = 0
    const sync = () => {
      raf = 0
      try {
        const doc = frame.contentDocument
        if (!doc) return
        let current = SECTIONS[0].id
        SECTIONS.forEach(s => {
          const el = doc.getElementById(s.id)
          if (el && el.getBoundingClientRect().top <= 140) current = s.id
        })
        setActive(current)
      } catch {
        /* cross-origin fallback: keep the last known chip */
      }
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(sync)
    }
    const win = frame.contentWindow
    if (win) win.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      if (win) win.removeEventListener('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [loaded])

  return (
    <div className="esb">
      <Link to="/" className="esb-back">← Home</Link>

      {/* ── Header ─────────────────────────────────────────────────── */}
      <header className="esb-hero">
        <div className="esb-glow esb-glow-a" aria-hidden="true" />
        <div className="esb-glow esb-glow-b" aria-hidden="true" />
        <div className="esb-hero-inner">
          <span className="esb-kicker">
            <span className="esb-kicker-dot" />
            Europe Settlement Master Plan · 5–10 Year Horizon · 2026 Rules
          </span>
          <h1>Settle in <span className="esb-accent">Europe</span> — Peacefully, With Family</h1>
          <p>
            A country-by-country blueprint for <b>NAGA SIVA POLURI</b> — AI Integration Engineer ·
            Data Engineer · Full Stack Developer · Agentic AI Specialist. Real take-home after tax,
            family &amp; health insurance, work-life balance, and every step from job application
            to a settled family. <b>PR by year 2–3 · EU passport by year 5.</b>
          </p>
          <div className="esb-stats">
            {STATS.map(s => (
              <div className="esb-stat" key={s.k}>
                <strong>{s.v}</strong>
                <span>{s.k}</span>
              </div>
            ))}
          </div>
          <div className="esb-actions">
            <a className="esb-btn esb-btn-primary" href={GUIDE_URL} target="_blank" rel="noreferrer">
              Open full blueprint ↗
            </a>
            <button type="button" className="esb-btn esb-btn-ghost" onClick={() => jump('verdict')}>
              Start with the verdict ↓
            </button>
          </div>
        </div>
      </header>

      {/* ── Section quick-jumps ────────────────────────────────────── */}
      <nav className="esb-jumps" aria-label="Jump to section">
        {SECTIONS.map(s => (
          <button
            key={s.id}
            type="button"
            className={`esb-chip ${active === s.id ? 'is-active' : ''}`}
            onClick={() => jump(s.id)}
          >
            {s.label}
          </button>
        ))}
      </nav>

      {/* ── The blueprint itself ───────────────────────────────────── */}
      <div className={`esb-frame ${loaded ? 'is-loaded' : ''}`}>
        {!loaded && !failed && (
          <div className="esb-loading" role="status">
            <span className="esb-spinner" />
            Loading the Europe settlement blueprint…
          </div>
        )}
        {failed && (
          <div className="esb-error" role="alert">
            <strong>The blueprint could not be loaded.</strong>
            <p>Open it directly in a new tab to continue reading.</p>
            <a className="esb-btn esb-btn-primary" href={GUIDE_URL} target="_blank" rel="noreferrer">
              Open full blueprint ↗
            </a>
          </div>
        )}
        <iframe
          ref={frameRef}
          title="Europe Settlement Blueprint 2026"
          src={src}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
        />
      </div>
    </div>
  )
}
