import { createElement } from 'react'

const CODE_RE = /`([^`]+)`/g
const BOLD_RE = /\*\*([^*]+)\*\*/g
const LINK_RE = /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g
const SPLIT_RE = /(`[^`]+`)|(\*\*[^*]+\*\*)|(\[([^\]]+)\]\((https?:\/\/[^)]+)\))/g

export function inline(text) {
  if (!text) return null
  const out = []
  let last = 0
  let m
  const re = new RegExp(SPLIT_RE.source, 'g')
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(<span key={out.length}>{text.slice(last, m.index)}</span>)
    if (m[1]) out.push(<code key={out.length} className="md-code">{m[1].slice(1, -1)}</code>)
    else if (m[2]) out.push(<strong key={out.length}>{m[2].slice(2, -2)}</strong>)
    else if (m[3]) out.push(
      <a key={out.length} href={m[5]} target="_blank" rel="noopener noreferrer">{m[4]}</a>
    )
    last = m.index + m[0].length
  }
  if (last < text.length) out.push(<span key={out.length}>{text.slice(last)}</span>)
  return out.length ? out : text
}

const isTableSep = line => /^\s*\|?[\s:|-]+\|[\s:|-]*\s*$/.test(line) && line.includes('-')

function splitRow(line) {
  return line.trim().replace(/^\|/, '').replace(/\|$/, '').trim().split('|').map(c => c.trim())
}

export function parseBlocks(raw) {
  const lines = raw.split('\n')
  const blocks = []
  let i = 0
  while (i < lines.length) {
    const trimmed = lines[i].trim()
    if (trimmed === '') { i++; continue }
    if (/^```/.test(trimmed)) {
      const start = i
      const buf = []
      i++
      while (i < lines.length && !/^```/.test(lines[i].trim())) { buf.push(lines[i]); i++ }
      if (i < lines.length) i++
      blocks.push({ type: 'code', lang: trimmed.slice(3).trim(), text: buf.join('\n'), start })
      continue
    }
    const h = trimmed.match(/^(#{1,6})\s+(.*)$/)
    if (h) {
      blocks.push({ type: 'heading', level: h[1].length, text: h[2], start: i })
      i++
      continue
    }
    if (/^-{3,}\s*$/.test(trimmed)) { blocks.push({ type: 'hr', start: i }); i++; continue }
    if (trimmed.includes('|') && i + 1 < lines.length && isTableSep(lines[i + 1])) {
      const start = i
      const header = splitRow(trimmed)
      i += 2
      const rows = []
      while (i < lines.length && lines[i].trim() !== '' && lines[i].trim().includes('|')) {
        rows.push(splitRow(lines[i]))
        i++
      }
      blocks.push({ type: 'table', header, rows, start })
      continue
    }
    if (trimmed.startsWith('>')) {
      const start = i
      const buf = []
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        buf.push(lines[i].trim().replace(/^>\s?/, ''))
        i++
      }
      blocks.push({ type: 'quote', text: buf.join(' '), start })
      continue
    }
    const mu = trimmed.match(/^[-*]\s+(.*)$/)
    const mo = trimmed.match(/^\d+\.\s+(.*)$/)
    if (mu || mo) {
      const start = i
      const ordered = !!mo
      const items = []
      while (i < lines.length) {
        const t = lines[i].trim()
        if (t === '') break
        const tm = t.match(/^\d+\.\s+(.*)$/)
        const tu = t.match(/^[-*]\s+(.*)$/)
        if ((ordered && tm) || (!ordered && tu)) { items.push(tm ? tm[1] : tu[1]); i++ }
        else break
      }
      blocks.push({ type: 'list', ordered, items, start })
      continue
    }
    const start = i
    const buf = []
    while (i < lines.length) {
      const t = lines[i].trim()
      if (t === '') break
      if (/^(#{1,6})\s/.test(t) || /^```/.test(t) || /^-{3,}\s*$/.test(t) || t.startsWith('>')) break
      if (/^\d+\.\s|^[-*]\s/.test(t)) break
      if (t.includes('|') && i + 1 < lines.length && isTableSep(lines[i + 1])) break
      buf.push(lines[i])
      i++
    }
    blocks.push({ type: 'para', text: buf.join(' ').replace(/\s+/g, ' ').trim(), start })
  }
  return blocks
}

export function slugify(text, used) {
  let slug = text
    .toLowerCase()
    .replace(/`/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
  if (!slug) slug = 'section'
  let base = slug
  let n = 2
  while (used.has(slug)) { slug = `${base}-${n}`; n++ }
  used.add(slug)
  return slug
}

export function assignHeadingIds(blocks) {
  const used = new Set()
  const ids = {}
  blocks.forEach((b, bi) => {
    if (b.type === 'heading') ids[bi] = slugify(b.text, used)
  })
  return ids
}

export function blockText(b) {
  switch (b.type) {
    case 'heading': return b.text
    case 'para': return b.text
    case 'code': return b.text
    case 'quote': return b.text
    case 'list': return b.items.join(' ')
    case 'table': return [b.header.join(' '), ...b.rows.map(r => r.join(' '))].join(' ')
    default: return ''
  }
}

export function renderBlocks(blocks, ids = assignHeadingIds(blocks)) {
  return blocks.map((b, bi) => {
    switch (b.type) {
      case 'heading': {
        const lvl = Math.min(5, b.level + 1)
        return createElement(`h${lvl}`, { key: bi, id: ids[bi], className: `md-h md-h${lvl}` }, inline(b.text))
      }
      case 'para':
        return <p key={bi} className="md-p">{inline(b.text)}</p>
      case 'code':
        return <pre key={bi} className="md-pre"><code className={`md-code-block${b.lang ? ' lang-' + b.lang : ''}`}>{b.text}</code></pre>
      case 'quote':
        return <blockquote key={bi} className="md-quote">{inline(b.text)}</blockquote>
      case 'list':
        return b.ordered
          ? <ol key={bi} className="md-ol">{b.items.map((it, j) => <li key={j}>{inline(it)}</li>)}</ol>
          : <ul key={bi} className="md-ul">{b.items.map((it, j) => <li key={j}>{inline(it)}</li>)}</ul>
      case 'table':
        return (
          <div key={bi} className="md-table-wrap">
            <table className="md-table">
              <thead>
                <tr>{b.header.map((c, j) => <th key={j}>{inline(c)}</th>)}</tr>
              </thead>
              <tbody>
                {b.rows.map((r, j) => (
                  <tr key={j}>{r.map((c, k) => <td key={k}>{inline(c)}</td>)}</tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      case 'hr':
        return <hr key={bi} className="md-hr" />
      default:
        return null
    }
  })
}
