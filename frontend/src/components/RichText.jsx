import React from 'react'

// Render plain text / markdown-like content with rich formatting:
// - paragraphs
// - headers (# ## ###)
// - bullet/numbered lists
// - tables (markdown style)
// - code blocks / inline code
// - bold/italic/links
export default function RichText({ content, className = '' }) {
  if (!content) return null

  const lines = content.split('\n')
  const elements = []
  let i = 0
  let tableKey = 0

  while (i < lines.length) {
    const line = lines[i]

    // Code block
    if (line.trim().startsWith('```')) {
      const lang = line.trim().slice(3).trim()
      const codeLines = []
      i++
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i])
        i++
      }
      i++ // skip closing ```
      elements.push(
        <pre key={`code-${i}`} className="fv-code-block">
          {lang && <div className="fv-code-lang">{lang}</div>}
          <code>{codeLines.join('\n')}</code>
        </pre>
      )
      continue
    }

    // Table
    if (line.trim().startsWith('|')) {
      const tableLines = []
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        tableLines.push(lines[i])
        i++
      }
      const parsed = parseMarkdownTable(tableLines)
      if (parsed.headers.length > 0) {
        elements.push(
          <table key={`tbl-${tableKey++}`} className="data-table rich-table">
            <thead>
              <tr>{parsed.headers.map((h, hi) => <th key={hi}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {parsed.rows.map((row, ri) => (
                <tr key={ri}>{row.map((cell, ci) => <td key={ci}>{renderInline(cell)}</td>)}</tr>
              ))}
            </tbody>
          </table>
        )
      }
      continue
    }

    // Headers
    const headerMatch = line.match(/^(#{1,6})\s+(.*)$/)
    if (headerMatch) {
      const level = headerMatch[1].length
      const text = headerMatch[2]
      const Tag = `h${level}`
      elements.push(<Tag key={`h-${i}`} className={`fv-rich-h${level}`}>{renderInline(text)}</Tag>)
      i++
      continue
    }

    // Lists
    const bulletMatch = line.match(/^(\s*)[-*+]\s+(.*)$/)
    if (bulletMatch) {
      const listItems = []
      while (i < lines.length) {
        const m = lines[i].match(/^(\s*)[-*+]\s+(.*)$/) || lines[i].match(/^(\s*)(\d+)\.\s+(.*)$/)
        if (!m) break
        listItems.push(lines[i])
        i++
      }
      elements.push(
        <ul key={`ul-${i}`} className="fv-rich-list">
          {listItems.map((item, idx) => {
            const text = item.replace(/^\s*[-*+\d\.]\s+/, '')
            return <li key={idx}>{renderInline(text)}</li>
          })}
        </ul>
      )
      continue
    }

    const numberedMatch = line.match(/^(\s*)\d+\.\s+(.*)$/)
    if (numberedMatch) {
      const listItems = []
      while (i < lines.length) {
        const m = lines[i].match(/^(\s*)\d+\.\s+(.*)$/)
        if (!m) break
        listItems.push(lines[i])
        i++
      }
      elements.push(
        <ol key={`ol-${i}`} className="fv-rich-list">
          {listItems.map((item, idx) => {
            const text = item.replace(/^\s*\d+\.\s+/, '')
            return <li key={idx}>{renderInline(text)}</li>
          })}
        </ol>
      )
      continue
    }

    // Empty line
    if (line.trim() === '') {
      elements.push(<div key={`br-${i}`} className="fv-rich-spacer" />)
      i++
      continue
    }

    // Horizontal rule
    if (/^[-=]{3,}$/.test(line.trim())) {
      elements.push(<hr key={`hr-${i}`} className="fv-rich-hr" />)
      i++
      continue
    }

    // Paragraph
    elements.push(<p key={`p-${i}`} className="fv-rich-paragraph">{renderInline(line)}</p>)
    i++
  }

  return <div className={`rich-text ${className}`}>{elements}</div>
}

function parseMarkdownTable(lines) {
  const rows = lines.map(l => l.split('|').map(c => c.trim()).filter(c => c !== ''))
  if (rows.length < 2) return { headers: [], rows: [] }
  const headers = rows[0]
  const data = rows.slice(2).filter(r => r.some(c => c !== ''))
  return { headers, rows: data }
}

function renderInline(text) {
  if (!text) return null
  // Split by patterns while preserving delimiters
  const parts = text.split(/(\*\*.*?\*\*|__.*?__|\*.*?\*|_.*?_|`.*?`|\[.*?\]\(.*?\))/)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>
    }
    if (part.startsWith('__') && part.endsWith('__')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>
    }
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
      return <em key={i}>{part.slice(1, -1)}</em>
    }
    if (part.startsWith('_') && part.endsWith('_') && part.length > 2) {
      return <em key={i}>{part.slice(1, -1)}</em>
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={i}>{part.slice(1, -1)}</code>
    }
    const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/)
    if (linkMatch) {
      return <a key={i} href={linkMatch[2]} target="_blank" rel="noopener noreferrer">{linkMatch[1]}</a>
    }
    return <span key={i}>{part}</span>
  })
}
