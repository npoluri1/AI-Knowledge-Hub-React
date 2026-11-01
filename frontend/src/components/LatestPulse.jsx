import React from 'react'
import { useLocation } from 'react-router-dom'
import { latestTopicFor } from '../data/latestTopics'
import { fetchRepos, fetchNews, refreshLatest } from '../data/latestFeed'
import './LatestPulse.css'

// Live "what's new" strip for the current page's topic: rising GitHub repos
// (created in the last 90 days, by stars) + last-30-day headlines. Cached for
// 30 minutes per topic so navigating around stays fast and API-friendly.
const lsGet = (k, d) => { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v) } catch { return d } }
const lsSet = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)) } catch { /* storage unavailable */ } }
const ago = d => {
  const t = typeof d === 'number' ? d : Date.parse(d)
  if (!t) return ''
  const m = Math.round((Date.now() - t) / 6e4)
  return m < 1 ? 'just now' : m < 60 ? `${m}m ago` : m < 1440 ? `${Math.round(m / 60)}h ago` : `${Math.round(m / 1440)}d ago`
}
const fmtStars = n => (n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k` : String(n))

export default function LatestPulse() {
  const { pathname } = useLocation()
  const topic = latestTopicFor(pathname)
  const [open, setOpen] = React.useState(() => lsGet('pulse.open.v2', false))
  const [repos, setRepos] = React.useState({ status: 'idle', items: [] })
  const [news, setNews] = React.useState({ status: 'idle', items: [] })
  const ref = React.useRef(null)
  const [stamp, setStamp] = React.useState(0)
  const [flash, setFlash] = React.useState(false)
  const [updatedAt, setUpdatedAt] = React.useState(null)
  const [busy, setBusy] = React.useState(false)
  const [note, setNote] = React.useState('')
  React.useEffect(() => { setNote('') }, [pathname])

  // A "Fetch Latest" click anywhere on the page refreshes this strip.
  React.useEffect(() => {
    const on = () => {
      setOpen(true); lsSet('pulse.open.v2', true); setStamp(s => s + 1); setFlash(true)
      setTimeout(() => setFlash(false), 1600)
      ref.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
    window.addEventListener('pulse-refresh', on)
    return () => window.removeEventListener('pulse-refresh', on)
  }, [])

  React.useEffect(() => {
    if (!topic) return undefined
    let live = true
    if (open) setRepos({ status: 'loading', items: [] })
    setNews({ status: 'loading', items: [] })
    // Defer until the strip is near the viewport so page content loads first.
    const run = () => {
      if (open) fetchRepos(topic.gh).then(r => { if (live) { setRepos({ status: 'ok', items: r.items }); setUpdatedAt(r.at) } }).catch(e => live && setRepos({ status: 'error', items: [], msg: e.message }))
      fetchNews(topic.news).then(r => { if (live) setNews({ status: 'ok', items: r.items }) }).catch(() => live && setNews({ status: 'error', items: [] }))
    }
    const el = ref.current
    if (!el || !('IntersectionObserver' in window)) { run(); return () => { live = false } }
    const io = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) { io.disconnect(); run() } }, { rootMargin: '300px' })
    io.observe(el)
    return () => { live = false; io.disconnect() }
  }, [topic?.gh, topic?.news, open, stamp]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!topic) return null
  const toggle = () => { lsSet('pulse.open.v2', !open); setOpen(!open) }

  return (
    <section className={`pulse ${open ? 'open' : ''} ${flash ? 'flash' : ''}`} ref={ref} aria-label={`Latest in ${topic.label}`}>
      <div className="pulse-head">
        <button type="button" className="pulse-toggle" onClick={toggle} aria-expanded={open}>
          <span className="pulse-dot" aria-hidden="true" />
          <b>Latest in {topic.label}</b>
          {open
            ? <span className="pulse-sub">live · new repos &amp; this month&apos;s headlines{updatedAt ? ` · updated ${ago(updatedAt)}` : ''}</span>
            : <span className="pulse-ticker">{news.items.length ? news.items.slice(0, 3).map(n => n.title).join('  ·  ') : 'tap to see new repos & this month’s headlines'}</span>}
        </button>
        <button type="button" className="pulse-fetch" disabled={busy} onClick={async () => {
          setBusy(true); setNote('')
          try { setNote(await refreshLatest(pathname)) } catch (e) { setNote(`⚠️ ${e.message}`) } finally { setBusy(false) }
        }}>{busy ? '⏳ Fetching…' : '🔄 Fetch latest'}</button>
        <button type="button" className="pulse-chev" onClick={toggle} aria-label={open ? 'Collapse' : 'Expand'}>{open ? '▴' : '▾'}</button>
      </div>
      {note && <div className="pulse-note">{note}</div>}
      {open && (
        <div className="pulse-body">
          <div className="pulse-col">
            <h4>🚀 Rising repositories <small>created in the last 90 days</small></h4>
            <div className="pulse-row">
              {repos.status === 'loading' && Array.from({ length: 4 }, (_, i) => <div key={i} className="pulse-card skel" />)}
              {repos.status === 'error' && <p className="pulse-msg">GitHub is rate-limiting right now — try again in a minute.</p>}
              {repos.status === 'ok' && !repos.items.length && <p className="pulse-msg">No new repositories this quarter.</p>}
              {repos.items.map(r => (
                <a key={r.url} className="pulse-card" href={r.url} target="_blank" rel="noreferrer">
                  <span className="pulse-repo">{r.name.split('/')[1] || r.name}</span>
                  <span className="pulse-owner">{r.name.split('/')[0]}</span>
                  <span className="pulse-desc">{r.description || 'No description'}</span>
                  <span className="pulse-meta">★ {fmtStars(r.stars)}{r.language ? ` · ${r.language}` : ''}</span>
                </a>
              ))}
            </div>
          </div>
          <div className="pulse-col">
            <h4>📰 Headlines <small>last 30 days</small></h4>
            <ol className="pulse-news">
              {news.status === 'loading' && Array.from({ length: 4 }, (_, i) => <li key={i} className="skel" />)}
              {news.status !== 'loading' && !news.items.length && <li className="pulse-msg">No fresh headlines found.</li>}
              {news.items.slice(0, 6).map(n => (
                <li key={n.url}>
                  <a href={n.url} target="_blank" rel="noreferrer">{n.title}</a>
                  <span>{n.source}{n.date ? ` · ${ago(n.date)}` : ''}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </section>
  )
}
