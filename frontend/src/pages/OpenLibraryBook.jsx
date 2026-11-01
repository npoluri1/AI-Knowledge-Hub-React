import React from 'react'
import { Link, useParams } from 'react-router-dom'
import * as OL from '../data/openLibrary'
import { Cover, Shelf, ShelfButton, ACCESS } from '../components/book/LibraryUI'
import BookStudio from '../components/book/BookStudio'
import './OpenLibraryBook.css'

const slug = s => String(s).toLowerCase().trim().replace(/[^\p{L}\p{N}]+/gu, '_').replace(/^_|_$/g, '')

function Stars({ value }) {
  const full = Math.round((value || 0) * 2) / 2
  return (
    <span className="olb-stars" aria-label={`${value?.toFixed(2)} out of 5`}>
      {[1, 2, 3, 4, 5].map(i => <i key={i} className={full >= i ? 'f' : full >= i - 0.5 ? 'h' : ''}>★</i>)}
    </span>
  )
}

export default function OpenLibraryBook() {
  const { id } = useParams()
  const [state, setState] = React.useState({ status: 'loading' })
  const [avail, setAvail] = React.useState({ access: 'no_ebook', ia: [] })
  const [moreDesc, setMoreDesc] = React.useState(false)
  const [reading, setReading] = React.useState(false)
  const readerRef = React.useRef(null)

  React.useEffect(() => {
    let live = true
    setState({ status: 'loading' }); setReading(false); setMoreDesc(false)
    OL.work(id).then(w => { if (live) setState({ status: 'ok', w }) }).catch(e => { if (live) setState({ status: 'error', msg: e.message }) })
    OL.availability(id).then(a => { if (live) setAvail(a) }).catch(() => {})
    if (window.location.hash !== '#book-studio') window.scrollTo({ top: 0 })
    else setTimeout(() => document.getElementById('book-studio')?.scrollIntoView({ behavior: 'smooth' }), 900)
    return () => { live = false }
  }, [id])

  const loadByAuthor = React.useCallback(() => {
    const name = state.w?.authors?.[0]?.name
    return name ? OL.search(name, { mode: 'author', limit: 24 }).then(r => r.works.filter(x => x.id !== id)) : Promise.resolve([])
  }, [state.w, id])
  const relSubject = state.w?.subjects?.find(s => !/fiction|general|accessible|protected|lending|in library/i.test(s)) || state.w?.subjects?.[0]
  const loadRelated = React.useCallback(() => (relSubject ? OL.subject(slug(relSubject)).then(r => r.works.filter(x => x.id !== id)) : Promise.resolve([])), [relSubject, id])

  if (state.status === 'loading') {
    return (
      <div className="olb">
        <Link to="/books" className="back-link">← Library</Link>
        <div className="olb-hero olb-skel"><div className="olb-cover" /><div className="olb-info"><i /><i /><i /></div></div>
      </div>
    )
  }
  if (state.status === 'error') {
    return (
      <div className="olb">
        <Link to="/books" className="back-link">← Library</Link>
        <div className="error">Couldn’t load this book from Open Library ({state.msg}). <Link to="/books">Back to the library</Link></div>
      </div>
    )
  }

  const w = state.w
  const coverId = w.covers[0]
  const authorName = w.authors.map(a => a.name).filter(Boolean).join(', ') || 'Unknown author'
  const year = avail.year || Number(String(w.firstPublish).match(/\d{4}/)?.[0]) || null
  const published = avail.year ? String(avail.year) : w.firstPublish
  const ia = avail.ia[0] || w.ia[0]
  const access = avail.access
  const a = ACCESS[access] || ACCESS.no_ebook
  const olUrl = `https://openlibrary.org/works/${id}`
  const readUrl = access === 'public' && ia ? `https://archive.org/details/${ia}` : ''
  const workForShelf = { id, key: w.key, title: w.title, authors: w.authors.map(x => x.name), coverId, year, access }
  const desc = w.description || `${w.title} by ${authorName}.`
  const longDesc = desc.length > 700

  // Shape the work like a catalog book so the Book Studio can run on it.
  const studioBook = {
    id: `ol-${id}`, title: w.title, author: authorName, year: year || 2000, pages: w.pages || 260,
    desc: desc.slice(0, 1200), cat: relSubject || 'General reading', rating: w.rating || 4, top: false,
  }
  const studioCat = { key: 'ol', name: relSubject || 'Open Library', icon: '📖', color: '#e8a33d' }

  const openReader = () => { setReading(true); setTimeout(() => readerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80) }

  return (
    <div className="olb">
      <Link to="/books" className="back-link">← Library</Link>

      <section className="olb-hero">
        {coverId && <div className="olb-backdrop" style={{ backgroundImage: `url(${OL.coverUrl(coverId, 'L')})` }} aria-hidden="true" />}
        <div className="olb-cover">
          <Cover id={coverId} title={w.title} author={authorName} size="L" eager />
          <span className={`lib-access a-${a.cls}`}>{a.label}</span>
        </div>
        <div className="olb-info">
          <div className="olb-kicker">{relSubject || 'Book'}</div>
          <h1>{w.title}</h1>
          {w.subtitle && <p className="olb-subtitle">{w.subtitle}</p>}
          <div className="olb-by">by {w.authors.length ? w.authors.map((au, i) => (
            <React.Fragment key={au.key}>{i > 0 && ', '}<Link to={`/books?q=${encodeURIComponent(au.name)}&mode=author`}>{au.name}</Link></React.Fragment>
          )) : 'Unknown author'}</div>
          <div className="olb-meta">
            {w.rating ? <span><Stars value={w.rating} /> <b>{w.rating.toFixed(2)}</b> <small>({w.ratingCount.toLocaleString()} ratings)</small></span> : null}
            {published && <span>📅 First published {published}</span>}
            {w.editionCount > 0 && <span>📚 {w.editionCount.toLocaleString()} editions</span>}
            {w.pages && <span>📄 {w.pages} pages</span>}
          </div>
          <div className="olb-actions">
            {access === 'public' && ia && <button type="button" className="olb-btn olb-read" onClick={openReader}>📖 Read online — free</button>}
            {access === 'borrowable' && <a className="olb-btn olb-borrow" href={olUrl} target="_blank" rel="noreferrer">📘 Borrow on Open Library ↗</a>}
            {access !== 'public' && access !== 'borrowable' && <a className="olb-btn" href={olUrl} target="_blank" rel="noreferrer">🔎 Find a copy ↗</a>}
            <Link className="olb-btn olb-studio" to={`/book/ol/${id}?studio=audio#book-studio`}>🎧 Audio podcast</Link>
            <Link className="olb-btn olb-studio" to={`/book/ol/${id}?studio=video#book-studio`}>🎬 Video podcast</Link>
            <Link className="olb-btn olb-studio" to={`/book/ol/${id}?studio=chapters#book-studio`}>🧭 Chapter précis</Link>
            <Link className="olb-btn olb-studio" to={`/book/ol/${id}?studio=ask#book-studio`}>🎙️ Ask by voice</Link>
          </div>
          <div className="olb-actions2">
            <ShelfButton work={workForShelf} />
            <a className="olb-link" href={olUrl} target="_blank" rel="noreferrer">View on Open Library ↗</a>
          </div>
        </div>
      </section>

      {reading && ia && (
        <section className="olb-reader" ref={readerRef}>
          <div className="olb-reader-head">
            <h2>📖 Reading: {w.title}</h2>
            <a href={`https://archive.org/details/${ia}`} target="_blank" rel="noreferrer">Open full screen ↗</a>
            <button type="button" onClick={() => setReading(false)} aria-label="Close reader">✕</button>
          </div>
          <iframe title={`${w.title} — Internet Archive reader`} src={`https://archive.org/embed/${ia}`} allowFullScreen loading="lazy" />
        </section>
      )}

      <div className="olb-cols">
        <section className="olb-desc">
          <h2>About this book</h2>
          <div className={`olb-desc-text ${longDesc && !moreDesc ? 'clamped' : ''}`}>
            {desc.split(/\n{2,}/).map((p, i) => <p key={i}>{p}</p>)}
          </div>
          {longDesc && <button type="button" className="lib-link-btn" onClick={() => setMoreDesc(m => !m)}>{moreDesc ? 'Show less' : 'Read more'}</button>}

          {w.subjects.length > 0 && (
            <>
              <h3>Subjects</h3>
              <div className="olb-chips">{w.subjects.map(s => <Link key={s} to={`/books?subject=${slug(s)}`}>{s}</Link>)}</div>
            </>
          )}
          {[['Places', w.places], ['People', w.people], ['Times', w.times]].filter(([, v]) => v.length).map(([label, v]) => (
            <React.Fragment key={label}>
              <h3>{label}</h3>
              <div className="olb-chips muted">{v.map(s => <span key={s}>{s}</span>)}</div>
            </React.Fragment>
          ))}
        </section>

        <aside className="olb-side">
          {w.authors.filter(x => x.name).map(au => (
            <div key={au.key} className="olb-author">
              <div className="olb-author-head">
                {au.photo > 0 ? <img src={`https://covers.openlibrary.org/a/id/${au.photo}-M.jpg`} alt="" loading="lazy" /> : <span className="olb-avatar">{au.name[0]}</span>}
                <div><small>Author</small><b>{au.name}</b></div>
              </div>
              {au.bio && <p>{au.bio.slice(0, 360)}{au.bio.length > 360 ? '…' : ''}</p>}
              <Link to={`/books?q=${encodeURIComponent(au.name)}&mode=author`}>All books by {au.name} →</Link>
            </div>
          ))}
          <div className="olb-facts">
            <div><span>Availability</span><b>{a.label === 'Not in library' ? 'Not digitised' : a.label}</b></div>
            <div><span>Editions</span><b>{w.editionCount.toLocaleString()}</b></div>
            <div><span>First published</span><b>{published || '—'}</b></div>
            <div><span>Open Library ID</span><b>{id}</b></div>
          </div>
        </aside>
      </div>

      <div id="book-studio">
        <BookStudio key={id} book={studioBook} cat={studioCat} cover={coverId ? { M: OL.coverUrl(coverId, 'M'), L: OL.coverUrl(coverId, 'L') } : null} readUrl={readUrl || olUrl} />
      </div>

      {w.authors[0]?.name && <Shelf id="by-author" title={`More by ${w.authors[0].name}`} icon="✍️" load={loadByAuthor} />}
      {relSubject && <Shelf id="related" title={`More in ${relSubject}`} icon="🗂️" load={loadRelated} />}
    </div>
  )
}
