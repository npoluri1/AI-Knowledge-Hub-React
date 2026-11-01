import { useMemo, useState } from 'react'
import { parseBlocks, assignHeadingIds, blockText, renderBlocks } from './MarkdownView'

function tocEntries(blocks) {
  const ids = assignHeadingIds(blocks)
  const entries = []
  blocks.forEach((b, bi) => {
    if (b.type === 'heading' && b.level <= 2) {
      entries.push({ level: b.level, title: b.text.replace(/`/g, ''), id: ids[bi], blockIndex: bi })
    }
  })
  return entries
}

function splitSections(blocks) {
  const sections = []
  let current = []
  const push = () => {
    if (current.length) {
      sections.push(current)
      current = []
    }
  }
  blocks.forEach(b => {
    if (b.type === 'heading' && b.level <= 2) {
      push()
    }
    current.push(b)
  })
  push()
  return sections
}

function sectionText(blocks) {
  return blocks.map(blockText).join(' ').toLowerCase()
}

export default function CertMarkdownReader({ files, title, subtitle, footer }) {
  const [activeId, setActiveId] = useState(files[0].id)
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)

  const active = files.find(f => f.id === activeId) || files[0]

  const blocks = useMemo(() => parseBlocks(active.raw), [active.raw])
  const toc = useMemo(() => tocEntries(blocks), [blocks])
  const sections = useMemo(() => splitSections(blocks), [blocks])
  const ids = useMemo(() => assignHeadingIds(blocks), [blocks])

  const needle = q.trim().toLowerCase()
  const matchIndex = useMemo(() => {
    if (!needle) return null
    const m = new Set()
    sections.forEach((sec, si) => {
      if (sectionText(sec).includes(needle)) m.add(si)
    })
    return m
  }, [needle, sections])

  const jump = id => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const matches = (sec) => sectionText(sec).includes(needle)

  return (
    <div className="ccg cmr">
      <div className="ccg-head cmr-head">
        <div>
          <h2 className="ccg-title">{title}</h2>
          <p className="ccg-sub">{subtitle}</p>
        </div>
        <div className="ccg-search-box">
          <input
            type="text"
            placeholder={`Search within ${active.label} — facts, code, questions…`}
            value={q}
            onChange={e => setQ(e.target.value)}
          />
          {q && <button className="ccg-search-clear" onClick={() => setQ('')}>✕</button>}
        </div>
      </div>

      <div className="cmr-tabs">
        {files.map(f => (
          <button
            key={f.id}
            className={`cmr-tab ${activeId === f.id ? 'cmr-tab-active' : ''}`}
            onClick={() => setActiveId(f.id)}
          >
            {f.label}
            {f.count && <span className="cmr-tab-count">{f.count}</span>}
          </button>
        ))}
      </div>

      <div className="ccg-meta cmr-meta">
        {needle ? (
          <span>{matchIndex.size} of {sections.length} sections match <b>“{q}”</b></span>
        ) : (
          <span>{toc.length} sections · {blocks.length} blocks · {active.bytes} KB</span>
        )}
      </div>

      <div className="ccg-layout">
        <nav className={`ccg-toc ${open ? 'ccg-toc-open' : ''}`}>
          <div className="ccg-toc-title">Jump to section</div>
          <button className="ccg-toc-scroll" onClick={() => { document.getElementById(`cmr-top-${active.id}`)?.scrollIntoView({ behavior: 'smooth' }) }}>
            ↑ Back to top
          </button>
          <ul className="ccg-toc-list">
            {toc.map((e, i) => (
              <li key={i} className={`ccg-toc-l${e.level}`}>
                <a
                  href={`#${e.id}`}
                  onClick={ev => { ev.preventDefault(); jump(e.id) }}
                  className={needle && matchIndex && !matches(sections[toc.indexOf(e)]) ? 'ccg-toc-dim' : ''}
                >
                  {e.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ccg-content" id={`cmr-top-${active.id}`}>
          <button className="ccg-toc-toggle" onClick={() => setOpen(!open)}>
            {open ? 'Hide' : 'Show'} contents ({toc.length})
          </button>
          {needle ? (
            <div className="ccg-results">
              {sections.map((sec, si) => {
                if (!matchIndex.has(si)) return null
                const head = sec.find(b => b.type === 'heading')
                const bodyText = sectionText(sec)
                const headIdx = head ? bodyText.indexOf(needle) : -1
                const startIdx = headIdx >= 0 ? headIdx : bodyText.indexOf(needle)
                const snippet = bodyText.slice(Math.max(0, startIdx - 60), startIdx + 160)
                return (
                  <div key={si} className="ccg-result">
                    {head && <div className="ccg-result-head">{renderBlocks([head], ids)}</div>}
                    <p className="ccg-result-snippet">…{snippet.trim()}…</p>
                    <div className="ccg-result-body">{renderBlocks(sec.filter(b => b.type !== 'heading'), ids)}</div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="ccg-doc">
              {sections.map((sec, si) => (
                <div key={si} className="ccg-sec">
                  {renderBlocks(sec, ids)}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {footer && <div className="cmr-footer">{footer}</div>}
    </div>
  )
}
