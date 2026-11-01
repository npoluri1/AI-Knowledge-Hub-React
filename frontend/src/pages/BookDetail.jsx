import React, { useMemo, useState, useRef, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  getBookById,
  getBookCategory,
  getBookContents,
  getBookLinkGroups,
  getRelatedBooks,
  isFreeBook,
  FREE_LIBRARIES,
} from '../data/bookHelpers'
import { useLang } from '../i18n'
import BookStudio from '../components/book/BookStudio'
import { DesignedCover } from '../components/book/LibraryUI'
import './BookDetail.css'

function Stars({ rating }) {
  let s = ''
  for (let i = 1; i <= 5; i++) s += rating >= i - 0.25 ? '★' : (rating >= i - 0.75 ? '⯨' : '☆')
  return <span className="bd-stars">{s}</span>
}

function BookCover({ book, cat, className = '' }) {
  return (
    <div className={`bd-cover-designed ${className}`}>
      <DesignedCover title={book.title} author={book.author} color={cat.color} icon={cat.icon} />
    </div>
  )
}

export default function BookDetail() {
  const { t } = useLang()
  const { id } = useParams()
  const book = useMemo(() => getBookById(id), [id])
  const [activeSection, setActiveSection] = useState(null)
  const sectionRefs = useRef([])
  const topRef = useRef(null)

  useEffect(() => {
    if (window.location.hash === '#book-studio') {
      const t = setTimeout(() => document.getElementById('book-studio')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 120)
      return () => clearTimeout(t)
    }
    window.scrollTo({ top: 0 })
    return undefined
  }, [id])

  if (!book) {
    return (
      <div className="bd">
        <Link to="/books/catalog" className="back-link">← {t('Back to Books')}</Link>
        <div className="error">❌ Book not found. It may have been removed from the catalog.</div>
      </div>
    )
  }

  const cat = getBookCategory(book)
  const free = isFreeBook(book)
  const contents = getBookContents(book)
  const linkGroups = getBookLinkGroups(book)
  const related = getRelatedBooks(book, 6)
  const coverTone = { '--bd-accent': cat.color }

  const scrollToSection = (i) => {
    setActiveSection(i)
    const el = sectionRefs.current[i]
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  return (
    <div className="bd" style={coverTone}>
      <Link to="/books/catalog" className="back-link">← {t('Back to Book Catalog')}</Link>

      {/* ============ HERO ============ */}
      <section className="bd-hero" style={{ '--bd-cat': cat.color }}>
        <div className="bd-hero-cover">
          <BookCover book={book} cat={cat} className="bd-cover-big" />
          <div className="bd-free-badge">
            {free ? t('🆓 FREE BOOK') : t('💎 PREMIUM BOOK')}
          </div>
        </div>

        <div className="bd-hero-info">
          <div className="bd-cat-chip" style={{ background: `${cat.color}22`, color: cat.color, borderColor: cat.color }}>
            {cat.icon} {cat.name}
          </div>
          <h1 className="bd-title">{book.title}</h1>
          <div className="bd-author">by <strong>{book.author}</strong></div>

          <div className="bd-meta-row">
            <span className="bd-meta"><Stars rating={book.rating} /> <b>{book.rating.toFixed(1)}</b></span>
            <span className="bd-meta">📅 {book.year}</span>
            <span className="bd-meta">📄 {book.pages} pages</span>
            <span className="bd-meta">🔖 #{book.id}</span>
            {book.top && <span className="bd-top-badge">{t('★ BEST STAR READ')}</span>}
          </div>

          <p className="bd-desc">{book.desc}</p>

          <div className="bd-cta-row">
            <Link className="bd-btn bd-btn-studio" to={`/book/${book.id}?studio=audio#book-studio`}>🎧 Audio podcast</Link>
            <Link className="bd-btn bd-btn-studio" to={`/book/${book.id}?studio=video#book-studio`}>🎬 Video podcast</Link>
            <Link className="bd-btn bd-btn-studio" to={`/book/${book.id}?studio=read#book-studio`}>📖 Read chapters</Link>
            {free && (
              <a className="bd-btn bd-btn-free" href={linkGroups.free[0].url} target="_blank" rel="noreferrer">
                📖 {t('Read Free Now')}
              </a>
            )}
            <a className="bd-btn bd-btn-premium" href={linkGroups.premium[0].url} target="_blank" rel="noreferrer">
              🛒 {t('Buy / Get the Book')}
            </a>
            <a className="bd-btn bd-btn-ghost" href={linkGroups.free[1].url} target="_blank" rel="noreferrer">
              📚 {t('Open Library')}
            </a>
          </div>

          <div className="bd-readhint">
            {free
              ? '🆓 Public-domain classic — read it free and legally at Project Gutenberg, Open Library & more below.'
              : '💎 In-copyright title — preview free at Google Books, or buy at Amazon / your favourite store.'}
          </div>
        </div>
      </section>

      {/* ============ BOOK STUDIO: podcasts, video, reader, Q&A ============ */}
      <div id="book-studio">
        <BookStudio key={book.id} book={book} cat={cat} />
      </div>

      {/* ============ CONTENTS NAV ============ */}
      <section className="bd-section" ref={topRef}>
        <h2 className="bd-h2">🧭 Explore the Contents</h2>
        <p className="bd-sub">
          A guided tour of {book.title} so you can decide whether it&apos;s for you before you read.
          Jump to any section below.
        </p>
        <div className="bd-toc">
          {contents.map((c, i) => (
            <button
              key={c.anchor}
              className={`bd-toc-chip ${activeSection === i ? 'bd-toc-active' : ''}`}
              style={activeSection === i ? { background: `${cat.color}22`, borderColor: cat.color, color: cat.color } : undefined}
              onClick={() => scrollToSection(i)}
            >
              <span className="bd-toc-num">{c.number}</span> {c.title}
            </button>
          ))}
        </div>

        <div className="bd-contents">
          {contents.map((c, i) => (
            <article
              key={c.anchor}
              id={`bd-section-${c.number}`}
              ref={el => { sectionRefs.current[i] = el }}
              className={`bd-content-card ${activeSection === i ? 'bd-content-active' : ''}`}
              style={{ '--bd-cc': cat.color }}
              onClick={() => setActiveSection(i)}
            >
              <div className="bd-content-num">{String(c.number).padStart(2, '0')}</div>
              <div className="bd-content-body">
                <h3>{c.title}</h3>
                <p className="bd-content-summary">{c.summary}</p>
                <p className="bd-content-preview">“{c.preview}”</p>
                <div className="bd-content-actions">
                  <a className="bd-mini-btn bd-mini-free" href={free ? linkGroups.free[0].url : linkGroups.free[3].url} target="_blank" rel="noreferrer">
                    {free ? '📖 Read this part free' : '🔎 Preview free'}
                  </a>
                  <a className="bd-mini-btn bd-mini-buy" href={linkGroups.premium[0].url} target="_blank" rel="noreferrer">
                    🛒 Get full book
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ============ READ OPTIONS ============ */}
      <section className="bd-section">
        <h2 className="bd-h2">🎯 How to Read This Book</h2>
        <div className="bd-read-grid">
          <div className="bd-read-card bd-read-free">
            <div className="bd-read-head">
              <span className="bd-read-icon">🆓</span>
              <div>
                <h3>Free Options</h3>
                <p>{free ? 'Public domain — read 100% free & legally.' : 'Free previews & borrow options.'}</p>
              </div>
            </div>
            <div className="bd-link-list">
              {linkGroups.free.map(l => (
                <a key={l.name} className="bd-link" href={l.url} target="_blank" rel="noreferrer">
                  <span className="bd-link-icon">{l.icon}</span>
                  <span className="bd-link-main">
                    <b>{l.name}</b>
                    <small>{l.note}</small>
                  </span>
                  <span className="bd-link-go">↗</span>
                </a>
              ))}
            </div>
          </div>

          <div className="bd-read-card bd-read-premium">
            <div className="bd-read-head">
              <span className="bd-read-icon">💎</span>
              <div>
                <h3>Premium / Buy Options</h3>
                <p>Buy the paperback, Kindle or audiobook.</p>
              </div>
            </div>
            <div className="bd-link-list">
              {linkGroups.premium.map(l => (
                <a key={l.name} className="bd-link" href={l.url} target="_blank" rel="noreferrer">
                  <span className="bd-link-icon">{l.icon}</span>
                  <span className="bd-link-main">
                    <b>{l.name}</b>
                    <small>{l.note}</small>
                  </span>
                  <span className="bd-link-go">↗</span>
                </a>
              ))}
            </div>
            <p className="bd-note">Tip: search your local library or Libby app — most titles are available to borrow free with a library card.</p>
          </div>
        </div>
      </section>

      {/* ============ FREE LIBRARIES ============ */}
      <section className="bd-section">
        <h2 className="bd-h2">📚 Best Free Libraries — Read Unlimited</h2>
        <p className="bd-sub">
          Like an unlimited reading subscription, 100% free: borrow, stream or download e-books and audiobooks
          from these trusted libraries.
        </p>
        <div className="bd-libs">
          {FREE_LIBRARIES.map(lib => (
            <a key={lib.name} className="bd-lib" href={lib.url} target="_blank" rel="noreferrer" style={{ '--bd-lib': lib.color }}>
              <span className="bd-lib-icon">{lib.icon}</span>
              <div className="bd-lib-body">
                <h4>{lib.name}</h4>
                <p>{lib.desc}</p>
                <div className="bd-lib-tags">
                  {lib.tags.map(t => <span key={t} className="bd-lib-tag">{t}</span>)}
                </div>
              </div>
              <span className="bd-link-go">↗</span>
            </a>
          ))}
        </div>
      </section>

      {/* ============ RELATED ============ */}
      {related.length > 0 && (
        <section className="bd-section">
          <h2 className="bd-h2">📖 More {cat.name}</h2>
          <div className="bd-related">
            {related.map(r => {
              const rc = getBookCategory(r)
              return (
                <Link key={r.id} to={`/book/${r.id}`} className="bd-related-card" style={{ '--bd-rc': rc.color }}>
                  <BookCover book={r} cat={rc} className="bd-cover-sm" />
                  <div className="bd-related-info">
                    <h4>{r.title}</h4>
                    <span className="bd-related-author">{r.author}</span>
                    <span className="bd-related-meta">
                      <Stars rating={r.rating} /> {r.rating.toFixed(1)} · {r.year}
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      )}

      <div className="bd-footer">
        — {book.title} · {cat.name} · Free & Premium reading guide —
      </div>
    </div>
  )
}
