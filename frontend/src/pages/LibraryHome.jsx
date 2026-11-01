import React from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import BOOKS from '../data/booksData'
import * as OL from '../data/openLibrary'
import { Shelf, WorkTile, SkeletonTiles, useReadingLog } from '../components/book/LibraryUI'
import { useDictation } from '../components/book/speech'
import { useLang } from '../i18n'
import './LibraryHome.css'

// Home-page shelves, in the order Open Library presents them.
const SHELVES = [
  { id: 'trending', title: 'Trending Books', subtitle: 'What readers are opening today', icon: '🔥', load: () => OL.trending('daily', 24), ranked: true },
  { id: 'free', title: 'Read Free Online', subtitle: 'Public-domain books you can read now', icon: '📖', load: () => OL.search('ebook_access:public', { sort: 'rating', limit: 24 }).then(r => r.works) },
  { id: 'classics', title: 'Classic Books', icon: '🏛️', load: () => OL.subject('classic_literature').then(r => r.works), subject: 'classic_literature' },
  { id: 'ai', title: 'Artificial Intelligence', icon: '🤖', load: () => OL.subject('artificial_intelligence').then(r => r.works), subject: 'artificial_intelligence' },
  { id: 'weekly', title: 'Trending This Week', icon: '📈', load: () => OL.trending('weekly', 24) },
  { id: 'romance', title: 'Romance', icon: '💞', load: () => OL.subject('romance').then(r => r.works), subject: 'romance' },
  { id: 'kids', title: 'Kids', icon: '🧸', load: () => OL.subject('juvenile_fiction').then(r => r.works), subject: 'juvenile_fiction' },
  { id: 'thrillers', title: 'Thrillers', icon: '🕵️', load: () => OL.subject('thrillers').then(r => r.works), subject: 'thrillers' },
  { id: 'scifi', title: 'Science Fiction', icon: '🚀', load: () => OL.subject('science_fiction').then(r => r.works), subject: 'science_fiction' },
  { id: 'fantasy', title: 'Fantasy', icon: '🐉', load: () => OL.subject('fantasy').then(r => r.works), subject: 'fantasy' },
  { id: 'business', title: 'Business & Money', icon: '💼', load: () => OL.subject('business').then(r => r.works), subject: 'business' },
  { id: 'selfhelp', title: 'Self-Help', icon: '🌱', load: () => OL.subject('self-help').then(r => r.works), subject: 'self-help' },
  { id: 'programming', title: 'Programming', icon: '💻', load: () => OL.subject('computer_programming').then(r => r.works), subject: 'computer_programming' },
  { id: 'textbooks', title: 'Textbooks', icon: '🎓', load: () => OL.subject('textbooks').then(r => r.works), subject: 'textbooks' },
  { id: 'bio', title: 'Biographies', icon: '👤', load: () => OL.subject('biography').then(r => r.works), subject: 'biography' },
  { id: 'history', title: 'History', icon: '🏺', load: () => OL.subject('history').then(r => r.works), subject: 'history' },
]

const SUBJECTS = [
  ['art', 'Art', '🎨'], ['science_fiction', 'Science Fiction', '🚀'], ['fantasy', 'Fantasy', '🐉'], ['biography', 'Biographies', '👤'],
  ['cooking', 'Recipes', '🍳'], ['romance', 'Romance', '💞'], ['textbooks', 'Textbooks', '🎓'], ['juvenile_fiction', 'Children', '🧸'],
  ['history', 'History', '🏺'], ['medicine', 'Medicine', '🩺'], ['religion', 'Religion', '🕊️'], ['mystery_and_detective_stories', 'Mystery', '🔎'],
  ['plays', 'Plays', '🎭'], ['music', 'Music', '🎵'], ['science', 'Science', '🔬'], ['artificial_intelligence', 'AI', '🤖'],
  ['computer_programming', 'Programming', '💻'], ['business', 'Business', '💼'], ['psychology', 'Psychology', '🧠'], ['philosophy', 'Philosophy', '📜'],
  ['poetry', 'Poetry', '✒️'], ['travel', 'Travel', '🧭'], ['mathematics', 'Mathematics', '➗'], ['economics', 'Economics', '📊'],
]

const SORTS = [['', 'Relevance'], ['rating', 'Top rated'], ['editions', 'Most editions'], ['new', 'Newest'], ['old', 'Oldest'], ['title', 'Title A–Z']]
const MODES = [['all', 'All'], ['title', 'Title'], ['author', 'Author'], ['subject', 'Subject']]
const POPULAR = ['Atomic Habits', 'Harry Potter', 'Dune', 'Sapiens', 'Deep Learning', 'Pride and Prejudice', 'The Psychology of Money', 'Clean Code']
const PER_PAGE = 24

function Pager({ page, total, onPage }) {
  const pages = Math.max(1, Math.ceil(total / PER_PAGE))
  if (pages <= 1) return null
  return (
    <div className="libh-pager">
      <button type="button" disabled={page <= 1} onClick={() => onPage(page - 1)}>‹ Prev</button>
      <span>Page {page.toLocaleString()} of {Math.min(pages, 400).toLocaleString()}</span>
      <button type="button" disabled={page >= Math.min(pages, 400)} onClick={() => onPage(page + 1)}>Next ›</button>
    </div>
  )
}

function ResultGrid({ loader, deps, header }) {
  const [state, setState] = React.useState({ status: 'loading', works: [], total: 0 })
  React.useEffect(() => {
    let live = true
    setState(s => ({ ...s, status: 'loading' }))
    loader().then(r => { if (live) setState({ status: 'ok', ...r }) }).catch(() => { if (live) setState({ status: 'error', works: [], total: 0 }) })
    return () => { live = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
  return (
    <>
      {header(state)}
      <div className="libh-grid">
        {state.status === 'loading' ? <SkeletonTiles n={12} /> : state.works.map((w, i) => <WorkTile key={`${w.id}-${i}`} work={w} />)}
      </div>
      {state.status === 'error' && <p className="libh-msg">Open Library didn’t answer — check your connection and try again.</p>}
      {state.status === 'ok' && !state.works.length && <p className="libh-msg">No books matched. Try another spelling or search mode.</p>}
    </>
  )
}

export default function LibraryHome() {
  const { resolved } = useLang()
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const q = params.get('q') || ''
  const mode = params.get('mode') || 'all'
  const sort = params.get('sort') || ''
  const subj = params.get('subject') || ''
  const view = params.get('view') || ''
  const page = Math.max(1, Number(params.get('page')) || 1)
  const readable = params.get('readable') === '1'
  const [draft, setDraft] = React.useState(q)
  const [draftMode, setDraftMode] = React.useState(mode)
  const [browseOpen, setBrowseOpen] = React.useState(false)
  const [stats, setStats] = React.useState(null)
  const log = useReadingLog()
  React.useEffect(() => { setDraft(q); setDraftMode(mode) }, [q, mode])

  const go = patch => {
    const next = new URLSearchParams()
    Object.entries(patch).forEach(([k, v]) => { if (v) next.set(k, v) })
    setParams(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const setParam = (k, v) => { const n = new URLSearchParams(params); if (v) n.set(k, v); else n.delete(k); if (k !== 'page') n.delete('page'); setParams(n) }
  const submit = e => { e?.preventDefault(); if (draft.trim()) go({ q: draft.trim(), mode: draftMode !== 'all' ? draftMode : '' }) }
  const dictation = useDictation(resolved === 'auto' ? 'en' : resolved, text => go({ q: text.replace(/[.?!。]+$/, ''), mode: draftMode !== 'all' ? draftMode : '' }))

  React.useEffect(() => {
    let live = true
    Promise.all([OL.count('ebook_access:public'), OL.count('ebook_access:borrowable'), OL.count('*')])
      .then(([pub, borrow, all]) => { if (live) setStats({ pub, borrow, all }) })
      .catch(() => {})
    return () => { live = false }
  }, [])

  const randomBook = async () => {
    const [key] = SUBJECTS[Math.floor(Math.random() * SUBJECTS.length)]
    try {
      const r = await OL.subject(key, { limit: 1, offset: Math.floor(Math.random() * 400) })
      if (r.works[0]) navigate(`/book/ol/${r.works[0].id}`)
    } catch { /* offline */ }
  }

  const myBooks = React.useMemo(() => Object.values(log), [log])
  const loadMine = React.useCallback(() => Promise.resolve([...myBooks].sort((a, b) => b.at - a.at).map(x => x.work)), [myBooks])
  const isHome = !q && !subj && !view
  const subjMeta = SUBJECTS.find(s => s[0] === subj)

  return (
    <div className="libh">
      {/* ===== top bar (Open Library style) ===== */}
      <nav className="libh-bar" aria-label="Library">
        <button type="button" className="libh-brand" onClick={() => go({})}>
          <span className="libh-brand-mark" aria-hidden="true">📚</span>
          <span><b>Library</b><small>powered by Open Library</small></span>
        </button>
        <button type="button" className={`libh-bar-btn ${view === 'mybooks' ? 'on' : ''}`} onClick={() => go({ view: 'mybooks' })}>
          My Books {myBooks.length > 0 && <span className="libh-badge">{myBooks.length}</span>}
        </button>
        <div className="libh-browse">
          <button type="button" className="libh-bar-btn" aria-expanded={browseOpen} onClick={() => setBrowseOpen(o => !o)}>Browse ▾</button>
          {browseOpen && (
            <div className="libh-browse-menu" onClick={() => setBrowseOpen(false)} role="menu">
              <button type="button" onClick={() => go({ view: 'subjects' })}>🗂️ Subjects</button>
              <button type="button" onClick={() => go({ q: 'trending' })}>🔥 Trending</button>
              <button type="button" onClick={() => go({ view: 'subjects' })}>🧭 Library Explorer</button>
              <button type="button" onClick={randomBook}>🎲 Random Book</button>
              <button type="button" onClick={() => go({ view: 'advanced' })}>🔍 Advanced Search</button>
              <Link to="/books/catalog">🗃️ AI Hub Catalog ({BOOKS.length.toLocaleString()})</Link>
            </div>
          )}
        </div>
        <span className="libh-spacer" />
        <Link className="libh-bar-btn" to="/books/catalog">Catalog · {BOOKS.length.toLocaleString()}</Link>
        <button type="button" className="libh-bar-btn" onClick={randomBook}>🎲 Random</button>
      </nav>

      {/* ===== hero search ===== */}
      <header className={`libh-hero ${isHome ? '' : 'compact'}`}>
        {isHome && (
          <>
            <h1>Read, borrow and discover <em>millions</em> of books.</h1>
            <p>Real covers and editions from the Open Library — plus AI audio &amp; video podcasts, chapter précis and voice Q&amp;A on every book.</p>
          </>
        )}
        <form className="libh-search" onSubmit={submit} role="search">
          <select value={draftMode} onChange={e => setDraftMode(e.target.value)} aria-label="Search by">
            {MODES.map(([k, l]) => <option key={k} value={k}>{l}</option>)}
          </select>
          <input
            value={dictation.listening ? (dictation.interim || 'Listening…') : draft}
            onChange={e => setDraft(e.target.value)}
            placeholder="Search books, authors, subjects…"
            aria-label="Search the library"
            readOnly={dictation.listening}
          />
          {dictation.supported && (
            <button type="button" className={`libh-mic ${dictation.listening ? 'on' : ''}`} onClick={() => (dictation.listening ? dictation.stop() : dictation.start())} aria-label="Speak to search" title="Speak to search">🎙️</button>
          )}
          <button type="submit" className="libh-go">Search</button>
        </form>
        {isHome && (
          <div className="libh-popular">
            <span>Popular:</span>
            {POPULAR.map(p => <button key={p} type="button" onClick={() => go({ q: p })}>{p}</button>)}
          </div>
        )}
      </header>

      {/* ===== search results ===== */}
      {q && (
        <ResultGrid
          deps={[q, mode, sort, page]}
          loader={() => (q === 'trending' ? OL.trending('daily', 48).then(works => ({ works, total: works.length })) : OL.search(q, { mode, sort, page, limit: PER_PAGE }))}
          header={st => (
            <div className="libh-results-head">
              <h2>{q === 'trending' ? '🔥 Trending today' : <>Results for “{q}”</>}</h2>
              {st.status === 'ok' && q !== 'trending' && <span className="libh-count">{st.total.toLocaleString()} works</span>}
              <span className="libh-spacer" />
              {q !== 'trending' && (
                <label className="libh-sort">Sort
                  <select value={sort} onChange={e => setParam('sort', e.target.value)}>{SORTS.map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select>
                </label>
              )}
              {st.status === 'ok' && q !== 'trending' && <Pager page={page} total={st.total} onPage={p => setParam('page', String(p))} />}
            </div>
          )}
        />
      )}

      {/* ===== subject page ===== */}
      {subj && (
        <ResultGrid
          deps={[subj, page, readable]}
          loader={() => OL.subject(subj, { limit: PER_PAGE, offset: (page - 1) * PER_PAGE, ebooks: readable }).then(r => ({ works: r.works, total: r.count }))}
          header={st => (
            <div className="libh-results-head">
              <h2>{subjMeta?.[2] || '🗂️'} {subjMeta?.[1] || subj.replace(/_/g, ' ')}</h2>
              {st.status === 'ok' && <span className="libh-count">{st.total.toLocaleString()} works</span>}
              <label className="libh-check"><input type="checkbox" checked={readable} onChange={e => setParam('readable', e.target.checked ? '1' : '')} /> Readable online only</label>
              <span className="libh-spacer" />
              {st.status === 'ok' && <Pager page={page} total={st.total} onPage={p => setParam('page', String(p))} />}
            </div>
          )}
        />
      )}

      {/* ===== my books ===== */}
      {view === 'mybooks' && (
        <section className="libh-mybooks">
          <h2>My Books</h2>
          <p className="libh-msg">Your reading log is saved in this browser.</p>
          {OL.SHELVES.map(s => {
            const items = myBooks.filter(x => x.shelf === s.key).sort((a, b) => b.at - a.at).map(x => x.work)
            return (
              <div key={s.key} className="libh-mybooks-shelf">
                <h3>{s.icon} {s.label} <span>{items.length}</span></h3>
                {items.length ? <div className="libh-grid">{items.map(w => <WorkTile key={w.id} work={w} />)}</div>
                  : <p className="libh-msg">Nothing here yet — tap “Want to Read” on any book.</p>}
              </div>
            )
          })}
        </section>
      )}

      {/* ===== advanced search ===== */}
      {view === 'advanced' && (
        <AdvancedSearch onSearch={(text, m) => go({ q: text, mode: m })} />
      )}

      {/* ===== subjects explorer ===== */}
      {(isHome || view === 'subjects') && (
        <section className="libh-subjects" id="subjects">
          <div className="lib-shelf-head"><h2>🗂️ Browse by Subject</h2></div>
          <div className="libh-subject-grid">
            {SUBJECTS.map(([key, label, icon]) => (
              <button key={key} type="button" className="libh-subject" onClick={() => go({ subject: key })}>
                <span aria-hidden="true">{icon}</span>{label}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* ===== home shelves ===== */}
      {isHome && (
        <>
          {myBooks.length > 0 && (
            <Shelf id="mine" title="Continue your reading" icon="📚" load={loadMine} onMore={() => go({ view: 'mybooks' })} />
          )}
          {SHELVES.map(s => (
            <Shelf key={s.id} id={s.id} title={s.title} subtitle={s.subtitle} icon={s.icon} load={s.load} ranked={s.ranked}
              onMore={s.subject ? () => go({ subject: s.subject }) : s.id === 'trending' ? () => go({ q: 'trending' }) : s.id === 'free' ? () => go({ q: 'ebook_access:public', sort: 'rating' }) : undefined} />
          ))}

          <section className="libh-around">
            <h2>Around the Library</h2>
            <div className="libh-stats">
              <div><b>{stats ? stats.all.toLocaleString() : '—'}</b><span>works catalogued</span></div>
              <div><b>{stats ? stats.pub.toLocaleString() : '—'}</b><span>free to read now</span></div>
              <div><b>{stats ? stats.borrow.toLocaleString() : '—'}</b><span>borrowable e-books</span></div>
              <div><b>{BOOKS.length.toLocaleString()}</b><span>AI Hub catalog titles</span></div>
              <div><b>108</b><span>podcast &amp; Q&amp;A languages</span></div>
            </div>
          </section>

          <section className="libh-promo">
            <div>
              <h2>Every book becomes a podcast</h2>
              <p>Open any book for a two-host audio podcast, an animated video explainer, chapter-by-chapter précis, the full reader’s edition and voice Q&amp;A — in 108 languages.</p>
            </div>
            <Link to="/book/ol/OL17930368W?studio=audio#book-studio" className="libh-go">🎧 Try it on Atomic Habits</Link>
          </section>
        </>
      )}
    </div>
  )
}

function AdvancedSearch({ onSearch }) {
  const [f, setF] = React.useState({ title: '', author: '', subject: '', publisher: '', year: '' })
  const submit = e => {
    e.preventDefault()
    const parts = []
    if (f.title) parts.push(`title:(${f.title})`)
    if (f.author) parts.push(`author:(${f.author})`)
    if (f.subject) parts.push(`subject:(${f.subject})`)
    if (f.publisher) parts.push(`publisher:(${f.publisher})`)
    if (f.year) parts.push(`first_publish_year:${f.year}`)
    if (parts.length) onSearch(parts.join(' AND '), 'all')
  }
  return (
    <form className="libh-adv" onSubmit={submit}>
      <h2>🔍 Advanced Search</h2>
      {['title', 'author', 'subject', 'publisher', 'year'].map(k => (
        <label key={k}>
          <span>{k[0].toUpperCase() + k.slice(1)}</span>
          <input value={f[k]} onChange={e => setF({ ...f, [k]: e.target.value })} placeholder={k === 'year' ? 'e.g. 1965 or [1900 TO 1950]' : ''} />
        </label>
      ))}
      <button type="submit" className="libh-go">Search</button>
    </form>
  )
}
