import { useEffect, useMemo, useState } from 'react'
import { linkedinBookChapters } from '../data/linkedinBookData'
import './LinkedInBookReader.css'

const BLOCK_ICONS = { para: '📝', list: '📋', table: '📊', quote: '💬', typical: '⭐', code: '💻' }

function flattenPages() {
  const flat = []
  for (const ch of linkedinBookChapters) {
    for (const pg of ch.pages) {
      flat.push({ chapter: ch, page: pg })
    }
  }
  return flat
}

function Block({ b }) {
  if (b.type === 'para') return <p className="bk-para">{b.text}</p>
  if (b.type === 'list') {
    return (
      <div className="bk-block bk-list">
        {b.title && <div className="bk-block-title">📋 {b.title}</div>}
        <ul>{b.items.map((it, i) => <li key={i}>{it}</li>)}</ul>
      </div>
    )
  }
  if (b.type === 'table') {
    return (
      <div className="bk-block bk-table">
        {b.title && <div className="bk-block-title">📊 {b.title}</div>}
        <div className="bk-table-wrap">
          <table>
            <thead><tr>{b.headers.map((h, i) => <th key={i}>{h}</th>)}</tr></thead>
            <tbody>
              {b.rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>)}
            </tbody>
          </table>
        </div>
      </div>
    )
  }
  if (b.type === 'quote') return <blockquote className="bk-quote">{b.text}</blockquote>
  if (b.type === 'typical') {
    return (
      <div className="bk-block bk-typical">
        <div className="bk-block-title">⭐ {b.title || 'The point people share'}</div>
        <ul>{b.items.map((it, i) => <li key={i}>{it}</li>)}</ul>
      </div>
    )
  }
  if (b.type === 'code') {
    return (
      <div className="bk-block bk-code">
        {b.title && <div className="bk-block-title">💻 {b.title}</div>}
        <pre className="bk-code-pre"><code className={`bk-lang-${b.lang || 'txt'}`}>{b.code}</code></pre>
      </div>
    )
  }
  return null
}

function PageContent({ chapter, page }) {
  return (
    <>
      <div className="bk-page-head">
        <div className="bk-chapter-chip">
          <span className="bk-chapter-num">{chapter.num}</span>
          <span>{chapter.icon} {chapter.title}</span>
        </div>
        <div className="bk-page-tag">{page.tag}</div>
      </div>
      <h2 className="bk-page-title">{page.title}</h2>
      <p className="bk-page-hook">{page.hook}</p>
      <div className="bk-page-body">
        {page.blocks.map((b, i) => <Block key={i} b={b} />)}
      </div>
    </>
  )
}

function Page({ item, pageNum, total, onZoom }) {
  const { chapter, page } = item
  return (
    <div className={`bk-page bk-color-${chapter.color}`}>
      <PageContent chapter={chapter} page={page} />
      <div className="bk-page-foot">
        <span className="bk-page-count">Page {pageNum} / {total}</span>
        <button className="bk-zoom-btn" onClick={onZoom} title="Open this page full-screen with zoom">🔍 Zoom</button>
      </div>
    </div>
  )
}

function ZoomView({ item, scale, onScale, onClose }) {
  const { chapter, page } = item
  return (
    <div className="bk-zoom" onClick={onClose}>
      <div className="bk-zoom-panel" onClick={(e) => e.stopPropagation()}>
        <div className="bk-zoom-toolbar">
          <span className="bk-zoom-title">🔍 Zoom — {page.title}</span>
          <div className="bk-zoom-controls">
            <button className="bk-zoom-tool" onClick={() => onScale((s) => Math.max(1, +(s - 0.25).toFixed(2)))} disabled={scale <= 1}>−</button>
            <span className="bk-zoom-pct">{Math.round(scale * 100)}%</span>
            <button className="bk-zoom-tool" onClick={() => onScale((s) => Math.min(3, +(s + 0.25).toFixed(2)))} disabled={scale >= 3}>+</button>
            <button className="bk-zoom-tool" onClick={() => onScale(1.5)}>↺ Reset</button>
          </div>
          <button className="bk-zoom-tool bk-zoom-close" onClick={onClose}>✕ Close</button>
        </div>
        <div className="bk-zoom-scroll">
          <div className={`bk-zoom-content bk-page bk-color-${chapter.color}`} style={{ zoom: scale }}>
            <PageContent chapter={chapter} page={page} />
          </div>
        </div>
      </div>
    </div>
  )
}

function Toc({ chapters, onJump }) {
  return (
    <div className="bk-toc">
      <div className="bk-toc-title">📖 Contents</div>
      {chapters.map((ch) => (
        <div key={ch.id} className="bk-toc-chapter">
          <div className="bk-toc-ch-head">
            <span className={`bk-dot bk-color-${ch.color}`} />
            <span className="bk-toc-ch-title">{ch.icon} {ch.title}</span>
            <span className="bk-toc-count">{ch.pages.length} pg</span>
          </div>
          <p className="bk-toc-tagline">{ch.tagline}</p>
          <div className="bk-toc-pages">
            {ch.pages.map((pg, i) => (
              <button key={i} className="bk-toc-page" onClick={() => onJump(ch.id, i)}>
                <span className="bk-toc-page-num">{i + 1}</span>
                {pg.title}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default function LinkedInBookReader() {
  const pages = useMemo(flattenPages, [])
  const [idx, setIdx] = useState(0)
  const [showToc, setShowToc] = useState(true)
  const [zoomOpen, setZoomOpen] = useState(false)
  const [zoomScale, setZoomScale] = useState(1.5)

  const total = pages.length
  const item = pages[idx]

  const goto = (i) => {
    setZoomOpen(false)
    setIdx(Math.max(0, Math.min(total - 1, i)))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    const onKey = (e) => {
      if (zoomOpen) {
        if (e.key === 'Escape') setZoomOpen(false)
        return
      }
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault()
        if (idx < total - 1) goto(idx + 1)
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        if (idx > 0) goto(idx - 1)
      } else if (e.key === 't') {
        setShowToc((s) => !s)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [idx, total, zoomOpen])

  const closeZoom = () => setZoomOpen(false)

  const jumpFromToc = (chId, pgI) => {
    const found = pages.findIndex((p, i) => p.chapter.id === chId)
    if (found >= 0) goto(found + pgI)
    setShowToc(false)
  }

  return (
    <div className="bk">
      <div className="bk-toolbar">
        <div className="bk-progress-track">
          <div className={`bk-progress-fill bk-bg-${item.chapter.color}`} style={{ width: `${((idx + 1) / total) * 100}%` }} />
        </div>
        <button className="bk-tool" onClick={() => setShowToc((s) => !s)}>
          {showToc ? '🗂️ Hide Contents' : '📖 Contents'}
        </button>
        <div className="bk-progress-label">{idx + 1} / {total}</div>
      </div>

      <div className="bk-layout">
        {showToc && (
          <aside className="bk-side">
            <Toc chapters={linkedinBookChapters} onJump={jumpFromToc} />
          </aside>
        )}
        <div className="bk-main">
          <Page item={item} pageNum={idx + 1} total={total} onZoom={() => setZoomOpen(true)} />
          <div className="bk-nav">
            <button className="bk-nav-btn" disabled={idx === 0} onClick={() => goto(idx - 1)}>← Previous</button>
            <span className="bk-nav-hint">Use ← → keys</span>
            <button className="bk-nav-btn bk-nav-next" disabled={idx === total - 1} onClick={() => goto(idx + 1)}>Next →</button>
          </div>
        </div>
      </div>

      {zoomOpen && item && (
        <ZoomView item={item} scale={zoomScale} onScale={setZoomScale} onClose={closeZoom} />
      )}
    </div>
  )
}
