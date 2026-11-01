import React, { useState, useMemo, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import BOOKS, { BOOK_CATEGORIES } from '../data/booksData'
import { getBookCategory, getBookLinkGroups, isFreeBook, FREE_LIBRARIES } from '../data/bookHelpers'
import FetchButton from '../components/FetchButton'
import { DesignedCover } from '../components/book/LibraryUI'
import { useLang } from '../i18n'
import { useDictation } from '../components/book/speech'
import './BooksCatalog.css'

const PER_PAGE = 48
const CAT_MAP = Object.fromEntries(BOOK_CATEGORIES.map(c => [c.key, c]))

function Stars({ rating }) {
  let s = ''
  for (let i = 1; i <= 5; i++) s += rating >= i - 0.25 ? '★' : (rating >= i - 0.75 ? '⯨' : '☆')
  return <span className="bc-stars">{s}</span>
}

// Catalog titles have no ISBN/Open Library ID, so render generated cover art
// in the category's colour instead of requesting covers that cannot exist.
function Cover({ book, cat }) {
  return <DesignedCover title={book.title} author={book.author} color={cat.color} icon={cat.icon} />
}

export default function BooksCatalog() {
  const { t, resolved } = useLang()
  const [cat, setCat] = useState('all')
  const [freeFilter, setFreeFilter] = useState('all') // 'all' | 'free' | 'premium'
  const [q, setQ] = useState('')
  const [sort, setSort] = useState('rating')
  const [page, setPage] = useState(1)
  const gridRef = useRef(null)
  const dictation = useDictation(resolved === 'auto' ? 'en' : resolved, text => { setQ(text.replace(/[.?!。]+$/, '')); setPage(1) })

  const categoryCounts = useMemo(() => {
    const counts = { all: BOOKS.length }
    BOOKS.forEach(b => { counts[b.cat] = (counts[b.cat] || 0) + 1 })
    return counts
  }, [])

  const stats = useMemo(() => ({
    total: BOOKS.length,
    free: BOOKS.filter(b => isFreeBook(b)).length,
    premium: BOOKS.filter(b => !isFreeBook(b)).length,
    top: BOOKS.filter(b => b.top).length,
    avg: (BOOKS.reduce((s, b) => s + b.rating, 0) / BOOKS.length).toFixed(2),
    authors: new Set(BOOKS.map(b => b.author)).size,
  }), [])

  const topBooks = useMemo(() =>
    [...BOOKS].sort((a, b) => (b.top - a.top) || (b.rating - a.rating)).slice(0, 100),
  [])

  const filtered = useMemo(() => {
    let list = cat === 'all' ? BOOKS : BOOKS.filter(b => b.cat === cat)
    if (freeFilter === 'free') list = list.filter(b => isFreeBook(b))
    if (freeFilter === 'premium') list = list.filter(b => !isFreeBook(b))
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
  }, [cat, freeFilter, q, sort])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const safePage = Math.min(page, totalPages)
  const start = (safePage - 1) * PER_PAGE
  const slice = filtered.slice(start, start + PER_PAGE)

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }) }, [safePage, cat])

  const pickCategory = (key) => { setCat(key); setPage(1) }
  const pickFree = (key) => { setFreeFilter(key); setPage(1) }

  return (
    <div className="bc">
      <Link to="/books" className="back-link">← Library</Link>

      {/* ===== HERO ===== */}
      <div className="bc-hero">
        <div className="page-header-row">
          <h1 className="chapter-title">📚 {t('Book Catalog')}</h1>
          <FetchButton onFetch={() => { setCat('all'); setQ(''); setSort('rating'); setPage(1); setFreeFilter('all') }} label={t('Fetch Latest')} staticMode />
        </div>
        <p className="chapter-preview">
          {stats.total.toLocaleString()} books across {BOOK_CATEGORIES.length} categories — personal growth, money making,
          finance, business, psychology & the best star-rated reads. Best books ranked first in every category.
        </p>
        <div className="bc-stats">
          <span className="stat-badge">📚 <strong>{stats.total.toLocaleString()}</strong> {t('Books')}</span>
          <span className="stat-badge">🏷️ <strong>{BOOK_CATEGORIES.length}</strong> {t('Categories')}</span>
          <span className="stat-badge">🆓 <strong>{stats.free.toLocaleString()}</strong> {t('Free (Public Domain)')}</span>
          <span className="stat-badge">💎 <strong>{stats.premium.toLocaleString()}</strong> {t('Premium')}</span>
          <span className="stat-badge">⭐ <strong>{stats.top}</strong> {t('Best Star Reads')}</span>
          <span className="stat-badge">👤 <strong>{stats.authors.toLocaleString()}</strong> {t('Authors')}</span>
          <span className="stat-badge">📊 <strong>{stats.avg}</strong> {t('Avg Rating')}</span>
        </div>
      </div>

      {/* ===== BOOK STUDIO PROMO ===== */}
      <div className="bc-studio-banner">
        {[
          ['🎧', 'Audio podcasts', 'Every book narrated as a two-host podcast, chapter by chapter'],
          ['🎬', 'Video podcasts', 'Animated, captioned video explainers you can watch full-screen'],
          ['🌍', '108 languages · 199 countries', 'Pick your country or language; summaries, audio and Q&A follow'],
          ['📖', 'Précis → full book', 'Read a quick précis per chapter, or the complete reader’s edition'],
          ['🎙️', 'Speak to search & ask', 'Search the catalog by voice and ask any book questions out loud'],
        ].map(([icon, title, desc]) => (
          <div key={title} className="bc-studio-feat">
            <span>{icon}</span>
            <div><b>{title}</b><small>{desc}</small></div>
          </div>
        ))}
      </div>

      {/* ===== FREE LIBRARY BANNER ===== */}
      <div className="bc-lib-banner">
        <div className="bc-lib-banner-head">
          <span className="bc-lib-banner-icon">📚</span>
          <div>
            <h3>Read Unlimited — Best Free E-Book Libraries</h3>
            <p>Borrow, stream or download e-books &amp; audiobooks free from trusted libraries, like a free unlimited subscription.</p>
          </div>
        </div>
        <div className="bc-lib-banner-links">
          {FREE_LIBRARIES.map(lib => (
            <a key={lib.name} className="bc-lib-banner-link" href={lib.url} target="_blank" rel="noreferrer" style={{ '--bc-lib': lib.color }}>
              <span>{lib.icon}</span> {lib.name} ↗
            </a>
          ))}
        </div>
      </div>

      {/* ===== CONTROLS ===== */}
      <div className="bc-controls">
        <div className="bc-search-box">
          <span className="bc-search-icon">🔍</span>
          <input
            type="text"
            placeholder={`Search ${stats.total.toLocaleString()} books by title, author or keyword…`}
            value={dictation.listening ? (dictation.interim || '🎙️ Listening…') : q}
            onChange={e => { setQ(e.target.value); setPage(1) }}
            className="bc-search-input"
          />
          {q && <button className="bc-search-clear" onClick={() => { setQ(''); setPage(1) }}>✕</button>}
          {dictation.supported && (
            <button
              type="button"
              className={`bc-mic ${dictation.listening ? 'on' : ''}`}
              onClick={() => (dictation.listening ? dictation.stop() : dictation.start())}
              title="Speak to search"
              aria-label="Speak to search"
            >🎙️</button>
          )}
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

      {/* ===== FREE / PREMIUM FILTER ===== */}
      <div className="bc-free-chips">
        <button
          className={`bc-free-chip ${freeFilter === 'all' ? 'bc-free-active-all' : ''}`}
          onClick={() => pickFree('all')}
        >
          🌐 {t('All Books')} <b>({stats.total.toLocaleString()})</b>
        </button>
        <button
          className={`bc-free-chip ${freeFilter === 'free' ? 'bc-free-active-free' : ''}`}
          onClick={() => pickFree('free')}
        >
          🆓 {t('Free Books')} <b>({stats.free.toLocaleString()})</b>
        </button>
        <button
          className={`bc-free-chip ${freeFilter === 'premium' ? 'bc-free-active-premium' : ''}`}
          onClick={() => pickFree('premium')}
        >
          💎 {t('Premium Books')} <b>({stats.premium.toLocaleString()})</b>
        </button>
        <span className="bc-free-hint">Free = public-domain classics (pre-1930) you can legally read online</span>
      </div>

      {/* ===== CATEGORY CHIPS ===== */}
      <div className="bc-chips">
        <button
          className={`bc-chip ${cat === 'all' ? 'bc-chip-active' : ''}`}
          onClick={() => pickCategory('all')}
        >
          🌐 {t('All')} <b>({categoryCounts.all.toLocaleString()})</b>
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

      {/* ===== BEST STAR BOOKS ===== */}
      <section className="bc-ranked">
        <h2>⭐ {t('Best Star Books — Top 100 Highest Rated')}</h2>
        <div className="bc-top-strip">
          {topBooks.map((b, i) => {
            const m = CAT_MAP[b.cat] || { icon: '📖', color: '#64748b' }
            return (
              <Link key={b.id} to={`/book/${b.id}`} className="bc-top-card" style={{ borderLeft: `4px solid ${m.color}` }}>
                <div className="bc-top-rank">★ #{i + 1} · {b.rating.toFixed(1)}</div>
                <h4>{b.title}</h4>
                <div className="bc-top-author">{b.author}</div>
                <span className="bc-top-go">Read &amp; Contents →</span>
              </Link>
            )
          })}
        </div>
      </section>

      {/* ===== BOOK GRID ===== */}
      <main className="bc-main" ref={gridRef}>
        <div className="bc-grid-head">
          <h2>
            {cat === 'all' ? 'All Books' : `${CAT_MAP[cat]?.icon} ${CAT_MAP[cat]?.name}`}
            {freeFilter === 'free' && <span className="bc-grid-tag bc-grid-tag-free">🆓 {t('Free only')}</span>}
            {freeFilter === 'premium' && <span className="bc-grid-tag bc-grid-tag-premium">💎 {t('Premium only')}</span>}
          </h2>
          <span className="bc-count">
            {filtered.length.toLocaleString()} books · page {safePage} of {totalPages}
          </span>
        </div>

        <div className="bc-grid">
          {slice.map((b, i) => {
            const m = CAT_MAP[b.cat] || { icon: '📖', color: '#64748b', name: b.cat }
            const free = isFreeBook(b)
            const links = getBookLinkGroups(b)
            return (
              <div key={b.id} className="bc-card" style={{ '--bc-accent': m.color }}>
                <div className="bc-card-top">
                  <Link to={`/book/${b.id}`} className="bc-cover-link" title={b.title}>
                    <Cover book={b} cat={m} />
                  </Link>
                  <div className="bc-card-head">
                    <Link to={`/book/${b.id}`} className="bc-card-title">{start + i + 1}. {b.title}</Link>
                    <div className="bc-rank-num">#{b.id}</div>
                  </div>
                </div>
                <div className="bc-badges">
                  {b.top && <span className="bc-best-badge">★ BEST STAR READ</span>}
                  <span className={`bc-free-badge ${free ? 'bc-free-badge-free' : 'bc-free-badge-premium'}`}>
                    {free ? '🆓 FREE' : '💎 PREMIUM'}
                  </span>
                </div>
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
                <div className="bc-card-actions">
                  <a className="bc-action-read" href={free ? links.free[0].url : links.premium[0].url} target="_blank" rel="noreferrer">
                    {free ? '📖 Read Free' : '🛒 Get Book'}
                  </a>
                  <Link className="bc-action-detail" to={`/book/${b.id}`}>
                    Contents &amp; Links →
                  </Link>
                </div>
                <div className="bc-card-studio">
                  <Link to={`/book/${b.id}?studio=audio#book-studio`} title="Audio podcast in 100+ languages">🎧 Listen</Link>
                  <Link to={`/book/${b.id}?studio=video#book-studio`} title="Video podcast">🎬 Watch</Link>
                  <Link to={`/book/${b.id}?studio=read#book-studio`} title="Chapter précis & full reader">📖 Read</Link>
                  <Link to={`/book/${b.id}?studio=ask#book-studio`} title="Ask the book by voice">💬 Ask</Link>
                </div>
              </div>
            )
          })}
        </div>

        {filtered.length === 0 && (
          <div className="bc-empty">
            <span className="bc-empty-icon">🔍</span>
            <p>No books match your search. Try different keywords or reset the filters.</p>
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
          — Book Catalog ({stats.total.toLocaleString()} books · {BOOK_CATEGORIES.length} categories · {stats.free.toLocaleString()} free) | Free reading via Open Library, Project Gutenberg &amp; Internet Archive —
        </div>
      </main>
    </div>
  )
}
