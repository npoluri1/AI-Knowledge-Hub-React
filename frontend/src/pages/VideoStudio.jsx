import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  fetchVideoTopics, fetchVideoDiscover, fetchVideoDiscoverX, fetchVideoDiscoverTiktok,
  fetchVideoDiscoverInstagram, fetchVideoDiscoverFacebook,
} from '../api'
import './VideoStudio.css'

// Live multi-network video studio: one topic → YouTube, X, TikTok, Instagram and
// Facebook load in parallel, each network streams in as soon as it answers.

const NETS = {
  youtube: { label: 'YouTube', glyph: '▶', color: '#ff0033', grad: 'linear-gradient(135deg,#ff0033,#7a0019)' },
  tiktok: { label: 'TikTok', glyph: '♪', color: '#25f4ee', grad: 'linear-gradient(135deg,#25f4ee,#111 45%,#fe2c55)' },
  instagram: { label: 'Instagram', glyph: '◎', color: '#e1306c', grad: 'linear-gradient(135deg,#feda75,#fa7e1e 25%,#d62976 55%,#962fbf 80%,#4f5bd5)' },
  x: { label: 'X', glyph: '𝕏', color: '#e7e9ea', grad: 'linear-gradient(135deg,#2f3336,#000)' },
  facebook: { label: 'Facebook', glyph: 'f', color: '#1877f2', grad: 'linear-gradient(135deg,#1877f2,#0b3d91)' },
}
const ORDER = ['youtube', 'tiktok', 'instagram', 'x', 'facebook']
const FILTERS = [['all', '✨ For you'], ['long', '🎬 Long videos'], ['shorts', '⚡ Shorts & reels'], ...ORDER.map(k => [k, `${NETS[k].glyph} ${NETS[k].label}`])]
const FALLBACK_TOPICS = [['ai', 'AI'], ['agents', 'AI Agents'], ['rag', 'RAG'], ['mcp', 'MCP'], ['llms', 'LLMs'], ['python', 'Python'], ['reactjs', 'ReactJS'], ['langchain', 'LangChain'], ['mlops', 'MLOps']].map(([key, label]) => ({ key, label }))
const REFRESH_MS = 5 * 60 * 1000
// clearer hashtags for ambiguous topic names on social networks
const SOCIAL_TAG = { rag: 'retrievalaugmentedgeneration', mcp: 'modelcontextprotocol', ml: 'machinelearning', llms: 'llm', agents: 'aiagents', multi_agents: 'multiagent', iot: 'iot', chips: 'aichips', quantum: 'quantumcomputing', governance: 'aigovernance', embeddings: 'embeddings', prompting: 'promptengineering', fine_tuning: 'finetuning', vectordb: 'vectordatabase', agi: 'agi', asi: 'superintelligence' }
// keep social posts that are clearly about tech (search indexes can return off-topic posts)
const TECH = /\b(ai|a\.i\.|llm|gpt|chatgpt|claude|gemini|openai|anthropic|agent|agentic|model|neural|machine|deep|data|code|coding|python|javascript|react|next|api|dev|developer|program|software|tech|cloud|automation|automate|rag|retriev|vector|embedding|prompt|langchain|langgraph|crewai|autogen|mcp|fine.?tun|lora|mlops|quantum|chip|gpu|nvidia|robot|iot|startup|tool|app|build)/i
const relevant = it => {
  const t = `${it.title || ''}`.replace(/\s+on (tiktok|instagram|facebook|x)\b.*$/i, '').trim()
  if (t.split(/\s+/).length < 4) return true // generic title ("name on TikTok") — trust the hashtag search
  return TECH.test(`${it.title} ${it.channel || ''}`)
}
const CACHE_KEY = t => `vs.cache.${t}`
const PRIO = ['ai', 'agents', 'llms', 'rag', 'python', 'mcp', 'langchain', 'reactjs']

const lsGet = (k, d) => { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v) } catch { return d } }
const lsSet = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)) } catch { /* storage unavailable */ } }
const decode = s => String(s || '').replace(/&amp;/g, '&').replace(/&#39;|&apos;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n))
const iso = d => d.toISOString().slice(0, 10)
const ago = p => {
  if (!p || !/^\d{4}-\d{2}-\d{2}/.test(p)) return ''
  const d = Math.floor((Date.now() - new Date(`${p.slice(0, 10)}T00:00:00`).getTime()) / 86400000)
  if (d <= 0) return 'today'; if (d === 1) return 'yesterday'; if (d < 7) return `${d}d ago`; if (d < 30) return `${Math.floor(d / 7)}w ago`; if (d < 365) return `${Math.floor(d / 30)}mo ago`; return `${Math.floor(d / 365)}y ago`
}
const isNew = p => p && /^\d{4}-\d{2}-\d{2}/.test(p) && (Date.now() - new Date(`${p.slice(0, 10)}T00:00:00`).getTime()) < 3 * 86400000
const dur = s => { if (!s) return ''; const h = Math.floor(s / 3600); const m = Math.floor((s % 3600) / 60); const x = s % 60; return h ? `${h}:${String(m).padStart(2, '0')}:${String(x).padStart(2, '0')}` : `${m}:${String(x).padStart(2, '0')}` }
const views = n => (!n ? '' : n >= 1e6 ? `${(n / 1e6).toFixed(1)}M views` : n >= 1e3 ? `${(n / 1e3).toFixed(1)}K views` : `${n} views`)
const vertical = it => it.platform === 'tiktok' || it.platform === 'instagram' || (it.platform === 'youtube' && it.isShort)
const embedOf = it => {
  if (it.platform === 'youtube') return `https://www.youtube-nocookie.com/embed/${it.videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`
  return it.embedUrl || it.url
}
const keyOf = it => `${it.platform}:${it.videoId || it.id}`

function Thumb({ it, big }) {
  const [bad, setBad] = useState(false)
  const n = NETS[it.platform] || NETS.youtube
  if (it.thumbnail && !bad) return <img src={it.thumbnail} alt="" loading="lazy" onError={() => setBad(true)} />
  return (
    <div className="vs-tile" style={{ background: n.grad }}>
      <span className="vs-tile-glyph">{n.glyph}</span>
      {big !== false && <span className="vs-tile-title">{decode(it.title)}</span>}
    </div>
  )
}

function Badge({ p }) { const n = NETS[p] || NETS.youtube; return <span className="vs-badge" style={{ '--c': n.color }}><i>{n.glyph}</i>{n.label}</span> }

export default function VideoStudio() {
  const [topics, setTopics] = useState(FALLBACK_TOPICS)
  const [topic, setTopic] = useState(() => lsGet('vs.topic', 'ai'))
  const [filter, setFilter] = useState(() => lsGet('vs.filter', 'all'))
  const [data, setData] = useState({})
  const [status, setStatus] = useState({})
  const [current, setCurrent] = useState(null)
  const [playing, setPlaying] = useState(false)
  const [auto, setAuto] = useState(() => lsGet('vs.auto', true))
  const [updated, setUpdated] = useState(0)
  const [tick, setTick] = useState(0)
  const [visible, setVisible] = useState(24)
  const stageRef = useRef(null); const runRef = useRef(0)

  useEffect(() => { fetchVideoTopics().then(t => { if (Array.isArray(t) && t.length) setTopics(t) }).catch(() => {}) }, [])
  useEffect(() => { const i = setInterval(() => setTick(x => x + 1), 30000); return () => clearInterval(i) }, [])

  const label = topics.find(t => t.key === topic)?.label || topic
  const tag = SOCIAL_TAG[topic] || label.toLowerCase().replace(/[^a-z0-9]/g, '') || 'ai'

  const warmed = useRef(new Set())
  const prefetch = useCallback((from, start, end) => {
    // warm the backend cache for the next popular topics, one at a time, so switching is instant
    const queue = PRIO.filter(k => k !== from && !warmed.current.has(k)).slice(0, 3)
    queue.reduce((p, k) => p.then(() => { warmed.current.add(k); return fetchVideoDiscover(k, start, end, 40, '', 'all', 'global', 'auto').catch(() => {}) }), Promise.resolve())
  }, [])
  const load = useCallback(() => {
    const run = ++runRef.current
    const end = iso(new Date()); const start = iso(new Date(Date.now() - 365 * 86400000))
    const calls = {
      youtube: () => fetchVideoDiscover(topic, start, end, 40, '', 'all', 'global', 'auto'),
      tiktok: () => fetchVideoDiscoverTiktok(tag, 18, start, end),
      instagram: () => fetchVideoDiscoverInstagram(tag, 18, start, end),
      x: () => fetchVideoDiscoverX(tag, 18, start, end),
      facebook: () => fetchVideoDiscoverFacebook(tag, 18, start, end),
    }
    setStatus(Object.fromEntries(ORDER.map(k => [k, 'loading'])))
    ORDER.forEach(k => {
      calls[k]().then(d => {
        if (run !== runRef.current) return
        const items = (d?.items || []).map(it => ({ ...it, platform: it.platform || k, title: decode(it.title) })).filter(it => k === 'youtube' || relevant(it))
        setData(prev => { const next = { ...prev, [k]: items }; if (items.length) lsSet(CACHE_KEY(topic), { at: Date.now(), data: next }); return next })
        setStatus(prev => ({ ...prev, [k]: items.length ? 'ok' : 'empty' }))
        setUpdated(Date.now())
        if (k === 'youtube') prefetch(topic, start, end)
      }).catch(() => { if (run === runRef.current) setStatus(prev => ({ ...prev, [k]: 'error' })) })
    })
  }, [topic, tag, prefetch])

  useEffect(() => {
    const cached = lsGet(CACHE_KEY(topic), null)
    setData(cached?.data || {}); setUpdated(cached?.at || 0)
    setCurrent(null); setPlaying(false); setVisible(24); load()
  }, [load, topic])
  useEffect(() => { if (!auto) return undefined; const i = setInterval(load, REFRESH_MS); return () => clearInterval(i) }, [auto, load])

  const all = useMemo(() => {
    // interleave networks so the feed feels mixed, newest first inside each network
    const lists = ORDER.map(k => [...(data[k] || [])].sort((a, b) => (b.published || '').localeCompare(a.published || '')))
    const out = []; const seen = new Set()
    for (let i = 0; lists.some(l => i < l.length); i++) {
      lists.forEach(l => { const it = l[i]; if (it && !seen.has(keyOf(it))) { seen.add(keyOf(it)); out.push(it) } })
    }
    return out
  }, [data])
  const list = useMemo(() => {
    if (filter === 'all') return all
    if (filter === 'long') return all.filter(it => !vertical(it) && it.platform === 'youtube')
    if (filter === 'shorts') return all.filter(vertical)
    return all.filter(it => it.platform === filter)
  }, [all, filter])
  const shorts = useMemo(() => all.filter(vertical).slice(0, 30), [all])
  const hero = current || all.find(it => it.platform === 'youtube' && !it.isShort) || all[0]
  const upNext = useMemo(() => list.filter(it => !hero || keyOf(it) !== keyOf(hero)).slice(0, 10), [list, hero])
  const counts = useMemo(() => Object.fromEntries(ORDER.map(k => [k, (data[k] || []).length])), [data])
  const total = all.length
  const loadingAny = ORDER.some(k => status[k] === 'loading')

  const play = it => {
    setCurrent(it); setPlaying(true)
    requestAnimationFrame(() => stageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }
  const pickTopic = k => { setTopic(k); lsSet('vs.topic', k) }
  const pickFilter = k => { setFilter(k); lsSet('vs.filter', k); setVisible(24) }
  void tick

  return (
    <section className="vs">
      <header className="vs-hero">
        <div className="vs-hero-text">
          <span className="vs-kicker"><span className="vs-live"><i />LIVE</span> Video Studio · 5 networks · 44 AI topics</span>
          <h1>Watch what the world is posting about <em>{label}</em> right now</h1>
          <p>YouTube, TikTok, Instagram, X and Facebook load side by side and play right here. The feed refreshes itself every 5 minutes.</p>
        </div>
        <div className="vs-nets">
          {ORDER.map(k => (
            <button key={k} type="button" className={`vs-net ${filter === k ? 'on' : ''} ${status[k] || ''}`} style={{ '--c': NETS[k].color, '--g': NETS[k].grad }} onClick={() => pickFilter(filter === k ? 'all' : k)}>
              <span className="vs-net-logo">{NETS[k].glyph}</span>
              <span className="vs-net-name">{NETS[k].label}</span>
              <b>{status[k] === 'loading' && !counts[k] ? <i className="vs-spin" /> : counts[k]}</b>
              <small>{status[k] === 'loading' ? (k === 'youtube' ? 'searching (~15s)…' : 'fetching…') : status[k] === 'error' ? 'unavailable' : status[k] === 'empty' ? 'none today' : 'videos'}</small>
            </button>
          ))}
        </div>
        <div className="vs-meta">
          <span>{loadingAny ? <><i className="vs-spin" /> Fetching live…</> : <><span className="vs-dot" /> {total} videos · updated {updated ? `${Math.max(0, Math.round((Date.now() - updated) / 60000))} min ago` : '—'}</>}</span>
          <button type="button" onClick={load} disabled={loadingAny}>⟳ Refresh now</button>
          <label><input type="checkbox" checked={auto} onChange={e => { setAuto(e.target.checked); lsSet('vs.auto', e.target.checked) }} /> Auto-refresh 5 min</label>
          <a href="#vh-tools">🧰 Countries, dates & downloads ↓</a>
        </div>
      </header>

      <nav className="vs-topics" aria-label="Topics">
        {topics.map(t => <button key={t.key} type="button" className={t.key === topic ? 'on' : ''} onClick={() => pickTopic(t.key)}>{t.label}</button>)}
      </nav>

      <div className="vs-stage" ref={stageRef}>
        <div className="vs-player-col">
          <div className={`vs-player ${hero && vertical(hero) ? 'vert' : ''}`} style={hero ? { '--g': NETS[hero.platform]?.grad } : undefined}>
            {!hero && <div className="vs-player-skel"><i className="vs-spin" /> Loading live videos for {label}…</div>}
            {hero && playing && <iframe key={keyOf(hero)} src={embedOf(hero)} title={hero.title} allow="autoplay; encrypted-media; picture-in-picture; fullscreen; clipboard-write" allowFullScreen loading="lazy" referrerPolicy="strict-origin-when-cross-origin" />}
            {hero && !playing && (
              <button type="button" className="vs-poster" onClick={() => setPlaying(true)} aria-label={`Play ${hero.title}`}>
                <Thumb it={hero} />
                <span className="vs-play">▶</span>
              </button>
            )}
          </div>
          {hero && (
            <div className="vs-now">
              <div className="vs-now-top"><Badge p={hero.platform} />{isNew(hero.published) && <span className="vs-new">NEW</span>}{hero.topicLabel && <span className="vs-chip">{hero.topicLabel}</span>}</div>
              <h2>{hero.title}</h2>
              <div className="vs-now-meta">
                <span className="vs-avatar" style={{ background: NETS[hero.platform]?.grad }}>{(hero.channel || '?').replace('@', '').charAt(0).toUpperCase()}</span>
                <b>{hero.channel || NETS[hero.platform]?.label}</b>
                <span>{[views(hero.views), ago(hero.published), dur(hero.durationSec)].filter(Boolean).join(' · ')}</span>
                <a href={hero.url} target="_blank" rel="noopener noreferrer">Open on {NETS[hero.platform]?.label} ↗</a>
              </div>
              {hero.description && <p className="vs-desc">{hero.description.slice(0, 260)}{hero.description.length > 260 ? '…' : ''}</p>}
            </div>
          )}
        </div>
        <aside className="vs-next">
          <h3>Up next <small>{FILTERS.find(f => f[0] === filter)?.[1]}</small></h3>
          <ul>
            {upNext.map(it => (
              <li key={keyOf(it)}>
                <button type="button" onClick={() => play(it)}>
                  <span className={`vs-next-thumb ${vertical(it) ? 'v' : ''}`}><Thumb it={it} big={false} />{it.durationSec ? <em>{dur(it.durationSec)}</em> : null}</span>
                  <span className="vs-next-text"><b>{it.title}</b><small><i style={{ color: NETS[it.platform]?.color }}>{NETS[it.platform]?.glyph}</i> {it.channel || NETS[it.platform]?.label}{it.published ? ` · ${ago(it.published)}` : ''}</small></span>
                </button>
              </li>
            ))}
            {!upNext.length && Array.from({ length: 5 }, (_, i) => <li key={i} className="vs-skel-row" />)}
          </ul>
        </aside>
      </div>

      {shorts.length > 0 && (
        <section className="vs-block">
          <div className="vs-block-head"><h3>⚡ Shorts & reels</h3><span>{shorts.length} vertical videos from TikTok, Instagram and YouTube Shorts — tap to play</span></div>
          <div className="vs-shorts">
            {shorts.map(it => (
              <button key={keyOf(it)} type="button" className="vs-short" onClick={() => play(it)} style={{ '--g': NETS[it.platform]?.grad }}>
                <Thumb it={it} />
                <span className="vs-short-shade" />
                <Badge p={it.platform} />
                <span className="vs-short-text"><b>{it.title}</b><small>{it.channel}</small></span>
                <span className="vs-play sm">▶</span>
              </button>
            ))}
          </div>
        </section>
      )}

      <section className="vs-block">
        <div className="vs-filters">{FILTERS.map(([k, l]) => <button key={k} type="button" className={filter === k ? 'on' : ''} onClick={() => pickFilter(k)}>{l}{k !== 'all' && k !== 'long' && k !== 'shorts' && counts[k] ? <i>{counts[k]}</i> : null}</button>)}</div>
        <div className="vs-grid">
          {list.slice(0, visible).map(it => (
            <article key={keyOf(it)} className="vs-card">
              <button type="button" className={`vs-card-thumb ${vertical(it) ? 'v' : ''}`} onClick={() => play(it)} style={{ '--g': NETS[it.platform]?.grad }}>
                <Thumb it={it} />
                <span className="vs-play sm">▶</span>
                {it.durationSec ? <em className="vs-dur">{dur(it.durationSec)}</em> : null}
                {isNew(it.published) && <span className="vs-new abs">NEW</span>}
              </button>
              <div className="vs-card-body">
                <span className="vs-avatar sm" style={{ background: NETS[it.platform]?.grad }}>{(it.channel || '?').replace('@', '').charAt(0).toUpperCase()}</span>
                <div>
                  <h4 onClick={() => play(it)}>{it.title}</h4>
                  <p>{it.channel || NETS[it.platform]?.label}</p>
                  <p className="vs-sub"><i style={{ color: NETS[it.platform]?.color }}>{NETS[it.platform]?.glyph}</i> {NETS[it.platform]?.label}{[views(it.views), ago(it.published)].filter(Boolean).map(x => ` · ${x}`).join('')}</p>
                </div>
              </div>
            </article>
          ))}
          {!list.length && Array.from({ length: 8 }, (_, i) => <div key={i} className="vs-card skel"><div /><p /><p /></div>)}
        </div>
        {list.length > visible && <button type="button" className="vs-more" onClick={() => setVisible(v => v + 24)}>Show more ({list.length - visible} left)</button>}
      </section>
    </section>
  )
}
