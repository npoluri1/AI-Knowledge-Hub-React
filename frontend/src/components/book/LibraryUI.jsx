import React from 'react'
import { Link } from 'react-router-dom'
import { coverUrl, readLog, setShelf, SHELVES } from '../../data/openLibrary'
import './LibraryUI.css'

const hash = s => { let h = 2166136261; for (const c of String(s)) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return h >>> 0 }
const PALETTES = [
  ['#1f3b73', '#f2b134'], ['#5b1f3f', '#f6c8a8'], ['#0f4c45', '#e9d8a6'], ['#2b2d42', '#ef233c'],
  ['#3d2c8d', '#c2a5ff'], ['#7a1e1e', '#f4e1c1'], ['#11324d', '#79d9f2'], ['#3f4a1f', '#e6d36a'],
  ['#4a2511', '#f0a868'], ['#14213d', '#fca311'], ['#264653', '#e9c46a'], ['#40128b', '#ffabc3'],
]
const PATTERNS = ['rings', 'stripes', 'grid', 'arc', 'diamond', 'band']

// Generated cover art — used when no real scan exists (no broken-image boxes).
export function DesignedCover({ title, author, color, icon, className = '' }) {
  const h = hash(title + author)
  const [bg, ink] = color ? [color, '#fff6e0'] : PALETTES[h % PALETTES.length]
  const pattern = PATTERNS[(h >> 4) % PATTERNS.length]
  const words = String(title || '').split(/\s+/)
  const short = words.length > 9 ? `${words.slice(0, 9).join(' ')}…` : title
  return (
    <div className={`lib-dcover p-${pattern} ${className}`} style={{ '--dc-bg': bg, '--dc-ink': ink }} role="img" aria-label={`${title} cover`}>
      <span className="lib-dcover-art" aria-hidden="true">{icon || ''}</span>
      <span className="lib-dcover-title">{short}</span>
      <span className="lib-dcover-rule" />
      <span className="lib-dcover-author">{author}</span>
    </div>
  )
}

export function Cover({ id, title, author, size = 'M', className = '', eager = false }) {
  const [failed, setFailed] = React.useState(!id)
  React.useEffect(() => { setFailed(!id) }, [id])
  if (failed) return <DesignedCover title={title} author={author} className={className} />
  return (
    <img
      className={`lib-cover-img ${className}`}
      src={coverUrl(id, size)}
      alt={`${title} cover`}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      onError={() => setFailed(true)}
      onLoad={e => { if (e.currentTarget.naturalWidth < 5) setFailed(true); else e.currentTarget.dataset.loaded = '1' }}
    />
  )
}

export const ACCESS = {
  public: { label: 'Read', cls: 'read' },
  borrowable: { label: 'Borrow', cls: 'borrow' },
  printdisabled: { label: 'Special access', cls: 'pd' },
  no_ebook: { label: 'Not in library', cls: 'none' },
}

export function useReadingLog() {
  const [log, setLog] = React.useState(readLog)
  React.useEffect(() => {
    const on = () => setLog(readLog())
    window.addEventListener('ol-log-change', on)
    window.addEventListener('storage', on)
    return () => { window.removeEventListener('ol-log-change', on); window.removeEventListener('storage', on) }
  }, [])
  return log
}

export function ShelfButton({ work, compact = false }) {
  const log = useReadingLog()
  const [open, setOpen] = React.useState(false)
  const current = log[work.id]?.shelf
  const cur = SHELVES.find(s => s.key === current)
  const ref = React.useRef(null)
  React.useEffect(() => {
    if (!open) return undefined
    const close = e => { if (!ref.current?.contains(e.target)) setOpen(false) }
    document.addEventListener('pointerdown', close)
    return () => document.removeEventListener('pointerdown', close)
  }, [open])
  return (
    <div className={`lib-shelfbtn ${compact ? 'compact' : ''} ${current ? 'on' : ''}`} ref={ref}>
      <button type="button" className="lib-shelfbtn-main" onClick={e => { e.preventDefault(); setShelf(work, current ? null : 'want') }}>
        {cur ? `${cur.icon} ${compact ? cur.label.split(' ').pop() : cur.label}` : (compact ? '🔖 Want to Read' : '🔖 Want to Read')}
      </button>
      <button type="button" className="lib-shelfbtn-more" aria-label="Choose shelf" aria-expanded={open} onClick={e => { e.preventDefault(); setOpen(o => !o) }}>▾</button>
      {open && (
        <div className="lib-shelfbtn-menu" role="menu">
          {SHELVES.map(s => (
            <button key={s.key} type="button" role="menuitem" className={current === s.key ? 'on' : ''} onClick={e => { e.preventDefault(); setShelf(work, s.key); setOpen(false) }}>
              {s.icon} {s.label}
            </button>
          ))}
          {current && <button type="button" role="menuitem" onClick={e => { e.preventDefault(); setShelf(work, null); setOpen(false) }}>✕ Remove</button>}
        </div>
      )}
    </div>
  )
}

export function WorkTile({ work, rank }) {
  const a = ACCESS[work.access] || ACCESS.no_ebook
  return (
    <div className="lib-tile">
      <Link to={`/book/ol/${work.id}`} className="lib-tile-cover" title={work.title}>
        <Cover id={work.coverId} title={work.title} author={work.authors?.[0] || ''} />
        {rank != null && <span className="lib-rank">#{rank}</span>}
        <span className={`lib-access a-${a.cls}`}>{a.label}</span>
      </Link>
      <Link to={`/book/ol/${work.id}`} className="lib-tile-title">{work.title}</Link>
      <div className="lib-tile-author">{work.authors?.slice(0, 2).join(', ') || 'Unknown author'}{work.year ? ` · ${work.year}` : ''}</div>
      {work.rating ? <div className="lib-tile-rating">★ {work.rating.toFixed(1)}</div> : null}
      <ShelfButton work={work} compact />
    </div>
  )
}

export function SkeletonTiles({ n = 8 }) {
  return Array.from({ length: n }, (_, i) => (
    <div key={i} className="lib-tile lib-skel"><div className="lib-tile-cover" /><div className="lib-skel-line" /><div className="lib-skel-line short" /></div>
  ))
}

// Horizontal carousel that loads its books only once scrolled into view.
export function Shelf({ id, title, subtitle, icon, load, onMore, ranked = false }) {
  const ref = React.useRef(null)
  const rowRef = React.useRef(null)
  const [state, setState] = React.useState({ status: 'idle', works: [] })
  React.useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    let done = false
    const go = () => {
      if (done) return
      done = true
      setState({ status: 'loading', works: [] })
      load().then(works => setState({ status: 'ok', works })).catch(() => setState({ status: 'error', works: [] }))
    }
    if (!('IntersectionObserver' in window)) { go(); return undefined }
    const io = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) { go(); io.disconnect() } }, { rootMargin: '600px 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [load])
  const scroll = dir => rowRef.current?.scrollBy({ left: dir * rowRef.current.clientWidth * 0.85, behavior: 'smooth' })
  return (
    <section className="lib-shelf" ref={ref} id={id}>
      <div className="lib-shelf-head">
        <h2>{icon && <span aria-hidden="true">{icon}</span>} {title}</h2>
        {subtitle && <span className="lib-shelf-sub">{subtitle}</span>}
        <span className="lib-spacer" />
        {onMore && <button type="button" className="lib-link-btn" onClick={onMore}>See all →</button>}
        <div className="lib-arrows">
          <button type="button" onClick={() => scroll(-1)} aria-label={`Scroll ${title} left`}>‹</button>
          <button type="button" onClick={() => scroll(1)} aria-label={`Scroll ${title} right`}>›</button>
        </div>
      </div>
      <div className="lib-row" ref={rowRef}>
        {state.status === 'ok' && state.works.map((w, i) => <WorkTile key={`${w.id}-${i}`} work={w} rank={ranked ? i + 1 : null} />)}
        {(state.status === 'loading' || state.status === 'idle') && <SkeletonTiles />}
        {state.status === 'error' && <div className="lib-row-msg">Couldn’t reach Open Library right now. <button type="button" className="lib-link-btn" onClick={() => { setState({ status: 'loading', works: [] }); load().then(works => setState({ status: 'ok', works })).catch(() => setState({ status: 'error', works: [] })) }}>Retry</button></div>}
        {state.status === 'ok' && state.works.length === 0 && <div className="lib-row-msg">No books found.</div>}
      </div>
    </section>
  )
}
