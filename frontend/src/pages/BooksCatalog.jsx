import React, { useState, useMemo, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import BOOKS, { BOOK_CATEGORIES } from '../data/booksData'
import './BooksCatalog.css'

const PER_PAGE = 48
const CAT_MAP = Object.fromEntries(BOOK_CATEGORIES.map(c => [c.key, c]))

function Stars({ rating }) {
  let s = ''
  for (let i = 1; i <= 5; i++) s += rating >= i - 0.25 ? '★' : (rating >= i - 0.75 ? '⯨' : '☆')
  return <span className="bc-stars">{s}</span>
}

export default function BooksCatalog() {
  const [cat, setCat] = useState('all')
  const [q, setQ] = useState('')
  const [sort, setSort] = useState('rating')
  const [page, setPage] = useState(1)
  const gridRef = useRef(null)

  const categoryCounts = useMemo(() => {
    const counts = { all: BOOKS.length }
    BOOKS.forEach(b => { counts[b.cat] = (counts[b.cat] || 0) + 1 })
    return counts
  }, [])

  const topBooks = useMemo(() =>
    [...BOOKS].sort((a, b) => (b.top - a.top) || (b.rating - a.rating)).slice(0, 100),
  [])

  const filtered = useMemo(() => {
    let list = cat === 'all' ? BOOKS : BOOKS.filter(b => b.cat === cat)
    const needle = q.trim().toLowerCase()
    if (needle) {
      list = list.filter(b =>
        b.title.toLowerCase().includes(needle) ||
        b.author.toLowerCase().includes(needle) ||
        b.desc.toLowerCase().includes(needle) ||
        (CAT_MAP[b.cat]?.name || '').toLowerCase().includes(needle))
    }
    const key = {
      rating: b => -b.rating,
      year: b => -b.year,
      title: b => b.title.toLowerCase(),
      pages: b => -b.pages,
    }[sort]
    const sorted = [...list]
    if (sort === 'rating') {
      sorted.sort((a, b) => (b.top - a.top) || (b.rating - a.rating) || b.year - a.year)
    } else {
      sorted.sort((a, b) => key(a) - key(b) || a.title.localeCompare(b.title))
    }
    return sorted
  }, [cat, q, sort])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const safePage = Math.min(page, totalPages)
  const start = (safePage - 1) * PER_PAGE
  const slice = filtered.slice(start, start + PER_PAGE)

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }) }, [safePage, cat])

  const stats = useMemo(() => ({
    total: BOOKS.length,
    top: BOOKS.filter(b => b.top).length,
    avg: (BOOKS.reduce((s, b) => s + b.rating, 0) / BOOKS.length).toFixed(2),
    authors: new Set(BOOKS.map(b => b.author)).size,
  }), [])

  const pickCategory = (key) => { setCat(key); setPage(1) }

  return (
    <div className="bc">
      <Link to="/" className="back-link">← Back to Home</Link>

      <div className="bc-hero">
        <h1 className="chapter-title">📚 Book Catalog</h1>
        <p className="chapter-preview">
          {BOOKS.length.toLocaleString()} books across {BOOK_CATEGORIES.length} categories — personal growth, money making,
          finance, business, psychology & the best star-rated reads. Best books ranked first in every category.
        </p>
      </div>

      <div className="bc-controls">
        <div className="bc-search-box">
          <span className="bc-search-icon">🔍</span>
          <input
            type="text"
            placeholder={`Search ${BOOKS.length.toLocaleString()} books by title, author or keyword…`}
            value={q}
            onChange={e => { setQ(e.target.value); setPage(1) }}
            className="bc-search-input"
          />
          {q && <button className="bc-search-clear" onClick={() => { setQ(''); setPage(1) }}>✕</button>}
        </div>
        <select
          className="bc-sort"
          value={sort}
          onChange={e => { setSort(e.target.value); setPage(1) }}
        >
          <option value="rating">⭐ Best rating first</option>
          <option value="year">📅 Newest first</option>
          <option value="title">🔤 Title A–Z</option>
          <option value="pages">📄 Page count</option>
        </select>
      </div>

      <div className="bc-stats">
        <span className="stat-badge">📚 <strong>{stats.total.toLocaleString()}</strong> Books</span>
        <span className="stat-badge">🏷️ <strong>{BOOK_CATEGORIES.length}</strong> Categories</span>
        <span className="stat-badge">⭐ <strong>{stats.top}</strong> Best Star Reads</span>
        <span className="stat-badge">👤 <strong>{stats.authors.toLocaleString()}</strong> Authors</span>
        <span className="stat-badge">📊 <strong>{stats.avg}</strong> Avg Rating</span>
      </div>

      <div className="bc-chips">
        <button
          className={`bc-chip ${cat === 'all' ? 'bc-chip-active' : ''}`}
          onClick={() => pickCategory('all')}
        >
          🌐 All <b>({categoryCounts.all.toLocaleString()})</b>
        </button>
        {BOOK_CATEGORIES.map(c => (
          <button
            key={c.key}
            className={`bc-chip ${cat === c.key ? 'bc-chip-active' : ''}`}
            style={cat === c.key ? { background: `${c.color}22`, borderColor: c.color, color: c.color } : undefined}
            onClick={() => pickCategory(c.key)}
          >
            {c.icon} {c.name} <b>({categoryCounts[c.key]})</b>
          </button>
        ))}
      </div>

      <section className="bc-ranked">
        <h2>⭐ Best Star Books — Top 100 Highest Rated</h2>
        <div className="bc-top-strip">
          {topBooks.map((b, i) => {
            const m = CAT_MAP[b.cat] || { icon: '📖', color: '#64748b' }
            return (
              <button key={b.id} className="bc-top-card" style={{ borderLeft: `4px solid ${m.color}` }} onClick={() => pickCategory(b.cat)}>
                <div className="bc-top-rank">★ #{i + 1} · {b.rating.toFixed(1)}</div>
                <h4>{b.title}</h4>
                <div className="bc-top-author">{b.author}</div>
              </button>
            )
          })}
        </div>
      </section>

      <main className="bc-main" ref={gridRef}>
        <div className="bc-grid-head">
          <h2>{cat === 'all' ? 'All Books' : `${CAT_MAP[cat]?.icon} ${CAT_MAP[cat]?.name}`}</h2>
          <span className="bc-count">
            {filtered.length.toLocaleString()} books · page {safePage} of {totalPages}
          </span>
        </div>

        <div className="bc-grid">
          {slice.map((b, i) => {
            const m = CAT_MAP[b.cat] || { icon: '📖', color: '#64748b', name: b.cat }
            return (
              <div key={b.id} className="bc-card" style={{ '--bc-accent': m.color }}>
                <div className="bc-card-top">
                  <div className="bc-card-title">{start + i + 1}. {b.title}</div>
                  <div className="bc-rank-num">#{b.id}</div>
                </div>
                {b.top && <span className="bc-best-badge">★ BEST STAR READ</span>}
                <div className="bc-card-author">
                  ✍ {b.author} · <span style={{ color: m.color }}>{m.icon} {m.name}</span>
                </div>
                <div className="bc-card-desc">{b.desc}</div>
                <div className="bc-card-meta">
                  <Stars rating={b.rating} />
                  <span className="bc-rating-val">{b.rating.toFixed(1)}</span>
                  <span className="bc-meta-tag">📅 {b.year}</span>
                  <span className="bc-meta-tag">📄 {b.pages} pp</span>
                </div>
              </div>
            )
          })}
        </div>

        {filtered.length === 0 && (
          <div className="bc-empty">
            <span className="bc-empty-icon">🔍</span>
            <p>No books match your search. Try different keywords.</p>
          </div>
        )}

        {totalPages > 1 && (
          <div className="bc-pagination">
            <button className="bc-page-btn" disabled={safePage === 1} onClick={() => setPage(safePage - 1)}>‹</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(p => p === 1 || p === totalPages || Math.abs(p - safePage) <= 2)
              .reduce((acc, p, idx, arr) => {
                if (idx > 0 && p - arr[idx - 1] > 1) acc.push(null)
                acc.push(p)
                return acc
              }, [])
              .map((p, i) => p === null
                ? <span key={`gap-${i}`} className="bc-page-gap">…</span>
                : (
                  <button key={p} className={`bc-page-btn ${p === safePage ? 'bc-page-active' : ''}`} onClick={() => setPage(p)}>
                    {p}
                  </button>
                ))}
            <button className="bc-page-btn" disabled={safePage === totalPages} onClick={() => setPage(safePage + 1)}>›</button>
          </div>
        )}

        <div className="bc-footer">
          — Book Catalog ({BOOKS.length.toLocaleString()} books · {BOOK_CATEGORIES.length} categories) | Compiled 2026 —
        </div>
      </main>
    </div>
  )
}
