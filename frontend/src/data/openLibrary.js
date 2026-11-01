// Open Library public API client (https://openlibrary.org/developers/api).
// All endpoints send `Access-Control-Allow-Origin: *`, so the browser calls
// them directly. Responses are cached in memory for the session.
const OL = 'https://openlibrary.org'
const cache = new Map()

async function getJson(url) {
  if (cache.has(url)) return cache.get(url)
  const p = fetch(url, { headers: { Accept: 'application/json' } }).then(r => {
    if (!r.ok) throw new Error(`Open Library ${r.status}`)
    return r.json()
  })
  cache.set(url, p)
  p.catch(() => cache.delete(url))
  return p
}

export const coverUrl = (id, size = 'M') => (id ? `https://covers.openlibrary.org/b/id/${id}-${size}.jpg` : '')
export const olidOf = key => String(key || '').split('/').pop()

const ACCESS_RANK = { public: 3, borrowable: 2, printdisabled: 1, no_ebook: 0 }

// Normalise the slightly different shapes of trending / subjects / search docs.
export function normalizeWork(d) {
  const authors = d.author_name || (d.authors || []).map(a => a.name).filter(Boolean)
  const authorKeys = d.author_key || (d.authors || []).map(a => olidOf(a.key))
  const ia = d.ia || (d.availability?.identifier ? [d.availability.identifier] : [])
  let access = d.ebook_access
  if (!access) access = d.public_scan || d.public_scan_b ? 'public' : (d.availability?.status === 'borrow_available' || d.has_fulltext ? 'borrowable' : 'no_ebook')
  return {
    id: olidOf(d.key),
    key: d.key,
    title: d.title,
    subtitle: d.subtitle || '',
    authors,
    authorKeys,
    coverId: d.cover_i || d.cover_id || null,
    year: d.first_publish_year || null,
    editions: d.edition_count || 0,
    rating: d.ratings_average ? Number(d.ratings_average) : null,
    ratingCount: d.ratings_count || 0,
    pages: d.number_of_pages_median || null,
    access,
    accessRank: ACCESS_RANK[access] ?? 0,
    ia,
    subjects: (d.subject || []).slice(0, 12),
  }
}

const FIELDS = 'key,title,subtitle,author_name,author_key,cover_i,first_publish_year,ebook_access,ia,edition_count,ratings_average,ratings_count,number_of_pages_median,subject,public_scan_b,has_fulltext'

export async function trending(period = 'daily', limit = 24) {
  const d = await getJson(`${OL}/trending/${period}.json?limit=${limit}`)
  return (d.works || []).map(normalizeWork).filter(w => w.title)
}

export async function subject(name, { limit = 24, offset = 0, ebooks = false } = {}) {
  const d = await getJson(`${OL}/subjects/${encodeURIComponent(name)}.json?limit=${limit}&offset=${offset}${ebooks ? '&ebooks=true' : ''}`)
  return { name: d.name, count: d.work_count || 0, works: (d.works || []).map(normalizeWork) }
}

export async function search(q, { mode = 'q', limit = 24, page = 1, sort = '' } = {}) {
  const param = { all: 'q', title: 'title', author: 'author', subject: 'subject' }[mode] || 'q'
  const d = await getJson(`${OL}/search.json?${param}=${encodeURIComponent(q)}&fields=${FIELDS}&limit=${limit}&page=${page}${sort ? `&sort=${sort}` : ''}`)
  return { total: d.numFound || 0, works: (d.docs || []).map(normalizeWork) }
}

export async function count(q) {
  const d = await getJson(`${OL}/search.json?q=${encodeURIComponent(q)}&limit=0`)
  return d.numFound || 0
}

export async function work(id) {
  const w = await getJson(`${OL}/works/${id}.json`)
  const desc = typeof w.description === 'string' ? w.description : w.description?.value || ''
  const cleanMd = t => String(t || '').replace(/\(\[source\]\[\d+\]\.?\)/gi, '').replace(/\[([^\]]+)\]\[\d+\]/g, '$1').replace(/\[([^\]]+)\]\((https?:[^)]+)\)/g, '$1').replace(/^\s*\[\d+\]:\s*\S+.*$/gm, '').replace(/-{3,}[\s\S]*$/, '').trim()
  const authorKeys = (w.authors || []).map(a => olidOf(a.author?.key || a.key)).filter(Boolean)
  const [authors, ratings, editions] = await Promise.all([
    Promise.all(authorKeys.slice(0, 3).map(k => getJson(`${OL}/authors/${k}.json`).then(a => ({ key: k, name: a.name, bio: cleanMd(typeof a.bio === 'string' ? a.bio : a.bio?.value || ''), photo: a.photos?.[0] })).catch(() => ({ key: k, name: '' })))),
    getJson(`${OL}/works/${id}/ratings.json`).catch(() => null),
    getJson(`${OL}/works/${id}/editions.json?limit=8`).catch(() => null),
  ])
  const eds = editions?.entries || []
  const pages = eds.map(e => e.number_of_pages).find(Boolean) || null
  const ia = eds.map(e => e.ocaid).filter(Boolean)
  return {
    id,
    key: w.key,
    title: w.title,
    subtitle: w.subtitle || '',
    description: desc.replace(/\r/g, '').replace(/\(\[source\]\[\d+\]\)|\[\d+\]: http\S+/g, '').trim(),
    covers: (w.covers || []).filter(c => c > 0),
    subjects: (w.subjects || []).filter(x => !/^[a-z]+:/i.test(x)).slice(0, 24),
    places: (w.subject_places || []).slice(0, 8),
    people: (w.subject_people || []).slice(0, 8),
    times: (w.subject_times || []).slice(0, 6),
    firstPublish: w.first_publish_date || '',
    authors,
    rating: ratings?.summary?.average ? Number(ratings.summary.average) : null,
    ratingCount: ratings?.summary?.count || 0,
    editionCount: editions?.size || eds.length,
    pages,
    ia,
    links: (w.links || []).map(l => ({ title: l.title, url: l.url })).slice(0, 6),
  }
}

// Search docs carry ebook availability that the works endpoint lacks.
export async function availability(id) {
  const d = await getJson(`${OL}/search.json?q=key:/works/${id}&fields=key,ebook_access,ia,public_scan_b,has_fulltext,first_publish_year&limit=1`)
  const doc = d.docs?.[0]
  return doc ? { access: doc.ebook_access || 'no_ebook', ia: doc.ia || [], year: doc.first_publish_year || null } : { access: 'no_ebook', ia: [], year: null }
}

// ---- Reading log ("My Books"), per browser ----
const LOG_KEY = 'ol.readingLog.v1'
export const SHELVES = [
  { key: 'want', label: 'Want to Read', icon: '🔖' },
  { key: 'reading', label: 'Currently Reading', icon: '📖' },
  { key: 'read', label: 'Already Read', icon: '✅' },
]
export function readLog() {
  try { return JSON.parse(localStorage.getItem(LOG_KEY)) || {} } catch { return {} }
}
export function setShelf(w, shelf) {
  const log = readLog()
  if (!shelf) delete log[w.id]
  else log[w.id] = { shelf, at: Date.now(), work: { id: w.id, key: w.key, title: w.title, authors: w.authors, coverId: w.coverId, year: w.year, access: w.access } }
  try { localStorage.setItem(LOG_KEY, JSON.stringify(log)) } catch { /* storage unavailable */ }
  window.dispatchEvent(new Event('ol-log-change'))
  return log
}
