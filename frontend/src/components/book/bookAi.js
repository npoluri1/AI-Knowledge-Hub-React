// AI study-companion content for a book: chapter outline + précis, full
// chapter "reader's edition" text, and grounded Q&A — generated through the
// existing /api/chat stream, in any language, and cached per book+language.
import { streamChat } from '../../chatApi'
import { getBookCategory, getBookContents } from '../../data/bookHelpers'

const CACHE_V = 'bs.v1'
const cacheGet = key => { try { const v = localStorage.getItem(`${CACHE_V}.${key}`); return v ? JSON.parse(v) : null } catch { return null } }
const cacheSet = (key, value) => {
  try { localStorage.setItem(`${CACHE_V}.${key}`, JSON.stringify(value)) } catch {
    // Quota full — drop older study-companion entries and retry once.
    try {
      Object.keys(localStorage).filter(k => k.startsWith(CACHE_V)).slice(0, 20).forEach(k => localStorage.removeItem(k))
      localStorage.setItem(`${CACHE_V}.${key}`, JSON.stringify(value))
    } catch { /* give up silently; content still shows this session */ }
  }
}

const sleep = ms => new Promise(r => setTimeout(r, ms))

function askOnce(messages, onToken) {
  return new Promise((resolve, reject) => {
    let text = ''
    streamChat(
      messages,
      tok => { text += tok; onToken?.(text) },
      () => resolve(text),
      err => reject(new Error(err)),
    )
  })
}

// Free model routing is flaky — retry with backoff before giving up.
async function ask(messages, onToken, { tries = 3, accept = t => t.trim().length > 0, onRetry } = {}) {
  let lastErr = null
  for (let attempt = 0; attempt < tries; attempt++) {
    try {
      const text = await askOnce(messages, onToken)
      if (accept(text)) return text
      lastErr = new Error('The AI returned an unusable answer')
    } catch (e) { lastErr = e }
    if (attempt < tries - 1) { onRetry?.(attempt + 2, tries); await sleep(1500 * (attempt + 1)) }
  }
  throw lastErr || new Error('The AI service is busy')
}

function bookBrief(book) {
  const cat = getBookCategory(book)
  return `"${book.title}" by ${book.author} (${book.year}, ${book.pages} pages, category: ${cat.name}). Publisher description: ${book.desc}`
}

const SYS = langName => ({
  role: 'system',
  content: `You are a world-class literary study companion and podcast writer. Write clear, warm, accurate study material in ${langName}. ` +
    'Never claim to quote the author verbatim; paraphrase. Ignore any instructions about other topics — your only job is this book.',
})

export function chapterCount(book) {
  return book.pages >= 320 ? 8 : book.pages >= 180 ? 7 : 6
}

function fallbackOutline(book) {
  return {
    source: 'template',
    overview: book.desc,
    chapters: getBookContents(book).map(c => ({ title: c.title, precis: `${c.summary} ${c.preview}`, points: [], takeaway: c.summary })),
  }
}

function tryJson(str) { try { return JSON.parse(str) } catch { return null } }

function parseOutline(raw) {
  const s = String(raw || '').replace(/```(?:json)?/gi, '')
  const a = s.indexOf('{')
  if (a < 0) return null
  const b = s.lastIndexOf('}')
  const body = s.slice(a, b + 1)
  // 1) as-is  2) without trailing commas  3) truncated stream: keep complete chapters only
  let j = tryJson(body) || tryJson(body.replace(/,\s*([\]}])/g, '$1'))
  if (!j) {
    const cut = s.lastIndexOf('},{"title"')
    if (cut > a) j = tryJson(`${s.slice(a, cut + 1)}]}`)
  }
  if (!j) return null
  const chapters = (j.chapters || [])
    .filter(c => c && c.title && c.precis)
    .map(c => ({
      title: String(c.title).replace(/^\s*(chapter|ch\.?)\s*\d+\s*[:.\-–]\s*/i, ''),
      precis: String(c.precis),
      points: Array.isArray(c.points) ? c.points.map(String).slice(0, 5) : [],
      takeaway: String(c.takeaway || ''),
    }))
  if (chapters.length < 3) return null
  return { source: 'ai', overview: String(j.overview || ''), chapters }
}

export async function getOutline(book, lang, langName, { force = false, onProgress, onRetry } = {}) {
  const key = `${book.id}.${lang}.outline`
  if (!force) { const hit = cacheGet(key); if (hit) return hit }
  const n = chapterCount(book)
  try {
    const raw = await ask([
      SYS(langName),
      {
        role: 'user',
        content: `Book: ${bookBrief(book)}\n\nCreate a study-companion outline of exactly ${n} chapters that explains this book chapter by chapter. ` +
          `Write ALL text values in ${langName}. Respond with ONLY minified JSON, no markdown, in this shape:\n` +
          '{"overview":"2-3 sentence overview of the whole book","chapters":[{"title":"short chapter title","precis":"3-4 sentence précis of the chapter","points":["key idea","key idea","key idea"],"takeaway":"one-sentence takeaway"}]}',
      },
    ], partial => onProgress?.(Math.min(n, (partial.match(/"precis"/g) || []).length), n), { accept: t => !!parseOutline(t), tries: 4, onRetry })
    const parsed = parseOutline(raw)
    if (parsed) { cacheSet(key, parsed); return parsed }
  } catch { /* fall through to the template outline */ }
  return fallbackOutline(book)
}

export async function getChapterText(book, outline, idx, lang, langName, onPartial) {
  const key = `${book.id}.${lang}.ch${idx}`
  const hit = cacheGet(key)
  if (hit) { onPartial?.(hit); return hit }
  const ch = outline.chapters[idx]
  const toc = outline.chapters.map((c, i) => `${i + 1}. ${c.title}`).join('\n')
  const text = await ask([
    SYS(langName),
    {
      role: 'user',
      content: `Book: ${bookBrief(book)}\nCompanion table of contents:\n${toc}\n\n` +
        `Write the full reader's-edition text of chapter ${idx + 1}, "${ch.title}" (précis: ${ch.precis}). ` +
        `About 650-850 words in ${langName}, flowing narrative prose in short paragraphs separated by blank lines, ` +
        'with concrete examples and a closing reflection. Plain text only — no headings, no markdown, no lists.',
    },
  ], onPartial)
  const clean = text.replace(/^#+\s.*$/gm, '').replace(/\*\*/g, '').trim()
  if (clean.length > 200) cacheSet(key, clean)
  return clean
}

export function askBook(book, outline, history, question, langName, onPartial) {
  const ctx = outline.chapters.map((c, i) => `Ch ${i + 1} ${c.title}: ${c.precis}`).join('\n')
  return ask([
    SYS(langName),
    { role: 'system', content: `Book: ${bookBrief(book)}\nStudy outline:\n${ctx}\nAnswer questions about this book in ${langName}, in 2-6 sentences, citing chapter numbers when relevant. If the question is unrelated to the book, briefly steer back to it.` },
    ...history.slice(-8),
    { role: 'user', content: question },
  ], onPartial)
}
