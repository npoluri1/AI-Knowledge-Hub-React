import React, { useMemo, useState } from 'react'
import { REA_REPOS, SHORT_VIDEO_SOURCES, SHORT_VIDEO_CREATORS } from '../data/githubReposRea'
import './ReaSpotlight.css'

const GROUP_ICONS = {
  'All': '🧬',
  'AI-assisted RE': '🤖',
  'Frameworks & Disassemblers': '🧩',
  'Decompilers': '🔓',
  'Debuggers': '🐞',
  'Mobile & Android': '📱',
  'APIs & Protocols': '🌐',
  'Firmware & Hardware': '🔌',
  'Malware Analysis': '🦠',
  'Learning & Lists': '📚',
}

const fmtStars = n => (n >= 1e6 ? `${(n / 1e6).toFixed(1)}M` : n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k` : String(n))

function embedUrl(v) {
  if (v.platform === 'instagram') return `https://www.instagram.com/reel/${v.id}/embed`
  return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(v.url)}&show_text=false&width=267`
}

function VideoCard({ v, index }) {
  const [open, setOpen] = useState(false)
  const isIg = v.platform === 'instagram'
  return (
    <div className={`rea-video ${open ? 'open' : ''}`}>
      <div className="rea-video-head">
        <span className={`rea-plat ${v.platform}`}>{isIg ? 'IG' : 'FB'}</span>
        <span className="rea-video-title">Short #{index + 1}</span>
        {v.repos.length > 0 && <span className="rea-video-tag">{v.repos.length} repo{v.repos.length > 1 ? 's' : ''}</span>}
      </div>
      {open && (
        <div className="rea-embed">
          <iframe
            src={embedUrl(v)}
            title={`Short video ${index + 1}`}
            loading="lazy"
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}
      {v.repos.length > 0 && (
        <div className="rea-video-repos">
          {v.repos.map(r => (
            <a key={r} href={`https://github.com/${r}`} target="_blank" rel="noreferrer">{r}</a>
          ))}
        </div>
      )}
      <div className="rea-video-actions">
        <button type="button" onClick={() => setOpen(o => !o)}>{open ? 'Hide preview' : '▶ Preview'}</button>
        <a href={v.url} target="_blank" rel="noreferrer">Open ↗</a>
      </div>
    </div>
  )
}

export default function ReaSpotlight({ onShowAll }) {
  const [group, setGroup] = useState('All')
  const [showVideos, setShowVideos] = useState(false)
  const [limit, setLimit] = useState(12)

  const groups = useMemo(() => {
    const counts = {}
    REA_REPOS.forEach(r => { counts[r.reaGroup] = (counts[r.reaGroup] || 0) + 1 })
    return [['All', REA_REPOS.length], ...Object.entries(counts).sort((a, b) => b[1] - a[1])]
  }, [])

  const list = useMemo(() => {
    const base = group === 'All' ? REA_REPOS : REA_REPOS.filter(r => r.reaGroup === group)
    return [...base].sort((a, b) => (b.featured - a.featured) || (b.stars - a.stars))
  }, [group])

  const totalStars = useMemo(() => REA_REPOS.reduce((n, r) => n + (r.stars || 0), 0), [])

  return (
    <section className="rea" aria-labelledby="rea-title">
      <div className="rea-head">
        <div>
          <div className="rea-kicker">Featured collection · 1</div>
          <h2 id="rea-title">🧬 REA — Reverse Engineering Anything</h2>
          <p>
            Open-source tools to take apart binaries, apps, firmware, protocols and APIs, from Ghidra and radare2 to
            AI-assisted reversing with MCP servers. Star counts and descriptions come live from the GitHub API.
          </p>
        </div>
        <div className="rea-stats">
          <div><strong>{REA_REPOS.length}</strong><span>repos</span></div>
          <div><strong>{fmtStars(totalStars)}</strong><span>stars</span></div>
          <div><strong>{SHORT_VIDEO_SOURCES.length}</strong><span>short videos</span></div>
        </div>
      </div>

      <div className="rea-tabs" role="tablist">
        {groups.map(([g, n]) => (
          <button
            key={g}
            type="button"
            role="tab"
            aria-selected={group === g}
            className={group === g ? 'on' : ''}
            onClick={() => { setGroup(g); setLimit(12) }}
          >
            {GROUP_ICONS[g] || '•'} {g} <span>{n}</span>
          </button>
        ))}
      </div>

      <div className="rea-grid">
        {list.slice(0, limit).map(r => (
          <a key={r.url} className="rea-card" href={r.url} target="_blank" rel="noreferrer">
            <div className="rea-card-top">
              <span className="rea-card-name">{r.name.split('/')[1]}</span>
              <span className="rea-card-stars">★ {fmtStars(r.stars)}</span>
            </div>
            <div className="rea-card-owner">{r.name.split('/')[0]}{r.archived ? ' · archived' : ''}</div>
            <p>{r.description}</p>
            <div className="rea-card-tags">
              {r.features.slice(0, 2).map(f => <span key={f}>{f}</span>)}
              {r.featured && <span className="pick">Curated</span>}
            </div>
          </a>
        ))}
      </div>
      <div className="rea-more">
        {limit < list.length && (
          <button type="button" onClick={() => setLimit(l => l + 24)}>Show more ({list.length - limit} left)</button>
        )}
        <button type="button" className="ghost" onClick={onShowAll}>Jump to REA in the full catalog ↓</button>
      </div>

      <div className="rea-videos-head">
        <div>
          <h3>🎬 Short-video sources</h3>
          <p>
            GitHub-repo reels from Facebook &amp; Instagram. Previews load inside the platform's player (you may need
            to be signed in). Repos are linked to a video once it's been reviewed.
          </p>
        </div>
        <button type="button" onClick={() => setShowVideos(s => !s)}>
          {showVideos ? 'Hide videos' : `Show ${SHORT_VIDEO_SOURCES.length} videos`}
        </button>
      </div>
      {showVideos && (
        <>
          <div className="rea-videos">
            {SHORT_VIDEO_SOURCES.map((v, i) => <VideoCard key={v.url} v={v} index={i} />)}
          </div>
          <div className="rea-creators">
            {SHORT_VIDEO_CREATORS.map(c => (
              <a key={c.url} href={c.url} target="_blank" rel="noreferrer">👤 {c.label} ↗</a>
            ))}
          </div>
        </>
      )}
    </section>
  )
}
