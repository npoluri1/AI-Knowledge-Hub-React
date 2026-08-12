import React, { useMemo, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import {
  RAPID_FIRE_MARKDOWN,
  RAPID_FIRE_REPO_URL,
  RAPID_FIRE_SOURCE_URL,
} from '../data/rapidFireData'
import './RapidFireView.css'

const SOURCE_BASE = 'https://karthikreddy-7.github.io/ai-engineering-playbook/docs/'

const DECKS = [
  { id: 'llm-fundamentals', file: '01-llm-fundamentals.md', icon: '🧠', color: '#cba6f7', title: 'LLM Fundamentals', treatment: 'Section 01', href: `${SOURCE_BASE}11-rapid-fire/01-llm-fundamentals/`, treatmentHref: `${SOURCE_BASE}01-llm-fundamentals/` },
  { id: 'embeddings-search', file: '02-embeddings-and-search.md', icon: '🧭', color: '#89b4fa', title: 'Embeddings & Search', treatment: 'Section 02', href: `${SOURCE_BASE}11-rapid-fire/02-embeddings-and-search/`, treatmentHref: `${SOURCE_BASE}02-embeddings-and-search/` },
  { id: 'vector-databases', file: '03-vector-databases.md', icon: '🗄️', color: '#94e2d5', title: 'Vector Databases', treatment: 'Section 03', href: `${SOURCE_BASE}11-rapid-fire/03-vector-databases/`, treatmentHref: `${SOURCE_BASE}03-vector-databases/` },
  { id: 'rag', file: '04-rag.md', icon: '🔎', color: '#a6e3a1', title: 'RAG', treatment: 'Section 04', href: `${SOURCE_BASE}11-rapid-fire/04-rag/`, treatmentHref: `${SOURCE_BASE}04-rag/` },
  { id: 'agents', file: '05-agents.md', icon: '🤖', color: '#f9e2af', title: 'Agents', treatment: 'Section 05', href: `${SOURCE_BASE}11-rapid-fire/05-agents/`, treatmentHref: `${SOURCE_BASE}05-agents/` },
  { id: 'mcp', file: '06-mcp.md', icon: '🔌', color: '#f5c2e7', title: 'MCP', treatment: 'Section 06', href: `${SOURCE_BASE}11-rapid-fire/06-mcp/`, treatmentHref: `${SOURCE_BASE}06-mcp/` },
  { id: 'production', file: '07-production.md', icon: '🚀', color: '#fab387', title: 'Production', treatment: 'Section 07', href: `${SOURCE_BASE}11-rapid-fire/07-production/`, treatmentHref: `${SOURCE_BASE}07-production/` },
  { id: 'model-landscape', file: '08-model-landscape.md', icon: '🌐', color: '#89dceb', title: 'Model Landscape', treatment: 'Section 08', href: `${SOURCE_BASE}11-rapid-fire/08-model-landscape/`, treatmentHref: `${SOURCE_BASE}08-model-landscape/` },
  { id: 'multimodal', file: '09-multimodal.md', icon: '👁️', color: '#f38ba8', title: 'Multimodal', treatment: 'Section 09', href: `${SOURCE_BASE}11-rapid-fire/09-multimodal/`, treatmentHref: `${SOURCE_BASE}09-multimodal/` },
  { id: 'tradeoffs', file: 'tradeoff-one-liners.md', icon: '⚖️', color: '#f9e2af', title: 'Tradeoff One-Liners', treatment: '30-second decisions', href: `${SOURCE_BASE}11-rapid-fire/tradeoff-one-liners/` },
]

function cleanInline(text = '') {
  return text.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*(.*?)\*/g, '$1').replace(/`(.*?)`/g, '$1').trim()
}

function resolveSourceHref(href, baseHref = RAPID_FIRE_SOURCE_URL) {
  if (/^https?:\/\//i.test(href)) return href
  const resolved = new URL(href, baseHref)
  resolved.pathname = resolved.pathname
    .replace(/\/index\.md$/, '/')
    .replace(/\.md$/, '/')
  return resolved.toString()
}

function renderInlineMarkdown(text = '', baseHref) {
  const tokens = text.split(/(`[^`]+`|\[[^\]]+\]\([^\)]+\)|\*\*.*?\*\*|__.*?__|\*.*?\*|_.*?_)/g)
  return tokens.map((token, index) => {
    if (!token) return null
    if (token.startsWith('`') && token.endsWith('`')) return <code key={index}>{token.slice(1, -1)}</code>
    const link = token.match(/^\[([^\]]+)\]\(([^\)]+)\)$/)
    if (link) return <SourceLink key={index} href={resolveSourceHref(link[2], baseHref)}>{link[1]}</SourceLink>
    if (token.startsWith('**') && token.endsWith('**')) return <strong key={index}>{renderInlineMarkdown(token.slice(2, -2), baseHref)}</strong>
    if (token.startsWith('__') && token.endsWith('__')) return <strong key={index}>{renderInlineMarkdown(token.slice(2, -2), baseHref)}</strong>
    if (token.startsWith('*') && token.endsWith('*')) return <em key={index}>{token.slice(1, -1)}</em>
    if (token.startsWith('_') && token.endsWith('_')) return <em key={index}>{token.slice(1, -1)}</em>
    return <React.Fragment key={index}>{token}</React.Fragment>
  })
}

function parseAdmonition(lines, start) {
  const body = []
  let end = start
  for (let i = start + 1; i < lines.length; i += 1) {
    if (lines[i].startsWith('    ')) {
      body.push(lines[i].slice(4).trim())
      end = i
    } else if (lines[i].trim() === '') {
      end = i
    } else break
  }
  return { body: body.join(' '), end }
}

function parseBlocks(lines) {
  const blocks = []
  let paragraph = []
  let ordered = null
  const flushParagraph = () => {
    if (paragraph.length) blocks.push({ type: 'paragraph', text: paragraph.join(' ') })
    paragraph = []
  }
  const flushOrdered = () => {
    if (ordered) blocks.push({ type: 'ordered', items: ordered })
    ordered = null
  }
  lines.forEach(line => {
    const trimmed = line.trim()
    if (!trimmed) { flushParagraph(); flushOrdered(); return }
    const numbered = trimmed.match(/^\d+\.\s+(.+)$/)
    if (numbered) {
      flushParagraph()
      if (!ordered) ordered = []
      ordered.push(numbered[1])
      return
    }
    if (ordered) {
      ordered[ordered.length - 1] += ` ${trimmed}`
      return
    }
    paragraph.push(trimmed)
  })
  flushParagraph()
  flushOrdered()
  return blocks
}

function parseMarkdown(markdown, deck) {
  const lines = markdown.split(/\r?\n/)
  const title = cleanInline(lines.find(line => line.startsWith('# '))?.slice(2) || deck.title)
  const description = cleanInline(lines.find(line => line.startsWith('> '))?.slice(2) || '')
  const sections = []
  let prerequisite = ''
  let usageLines = []
  let footer = ''
  let current = null
  let mode = null

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i]
    if (line.startsWith('!!! ')) {
      const admonition = parseAdmonition(lines, i)
      if (line.startsWith('!!! info')) prerequisite = admonition.body
      if (line.startsWith('!!! warning')) mode = null
      i = admonition.end
      continue
    }
    if (/^_.*_$/.test(line.trim())) {
      footer = line.trim().slice(1, -1)
      continue
    }
    if (line.startsWith('## How to use')) {
      mode = 'usage'
      current = null
      continue
    }
    if (line.startsWith('## ')) {
      mode = 'cards'
      current = { title: cleanInline(line.slice(3)), cards: [] }
      sections.push(current)
      continue
    }
    if (deck.id === 'tradeoffs') {
      const tradeoff = line.match(/^\*\*(.+?)\*\*\s+—\s+(.+)$/)
      if (tradeoff) {
        mode = 'cards'
        if (!current) {
          current = { title: 'The decisions', cards: [] }
          sections.push(current)
        }
        current.cards.push({ question: tradeoff[1], answer: tradeoff[2] })
      } else if (mode === 'usage') {
        usageLines.push(line)
      }
      continue
    }
    if (mode === 'usage') {
      usageLines.push(line)
      continue
    }
    if (!current) continue
    const question = line.match(/^\*\*(.+?)\*\*$/)
    if (!question) continue
    const answerLines = []
    let j = i + 1
    while (j < lines.length && !/^\*\*.+?\*\*$/.test(lines[j]) && !lines[j].startsWith('## ') && !/^_.*_$/.test(lines[j].trim())) {
      if (lines[j].trim() && !lines[j].startsWith('!!! ')) answerLines.push(lines[j].trim())
      j += 1
    }
    if (answerLines.length) current.cards.push({ question: question[1], answer: answerLines.join(' ') })
    i = j - 1
  }

  return {
    title,
    description,
    prerequisite,
    usageBlocks: parseBlocks(usageLines),
    footer,
    sections: sections.filter(section => section.cards.length > 0),
  }
}

function parseIndex() {
  const markdown = RAPID_FIRE_MARKDOWN['index.md']
  const lines = markdown.split(/\r?\n/)
  const parsed = parseMarkdown(markdown, { id: 'index', title: 'Rapid Fire' })
  const connections = []
  let mode = null
  let current = null
  for (const line of lines) {
    if (line.startsWith('!!! warning')) { mode = 'warning'; current = null; continue }
    if (line.startsWith('## Where this connects')) { mode = 'connections'; current = null; continue }
    if (line.startsWith('## ')) { mode = null; current = null; continue }
    if (mode === 'warning') {
      if (line.startsWith('    ')) parsed.warning = `${parsed.warning ? `${parsed.warning} ` : ''}${line.slice(4).trim()}`
    }
    if (mode === 'connections' && line.trim().startsWith('- ')) {
      if (current) connections.push(current)
      current = line.trim().slice(2)
    } else if (mode === 'connections' && current && line.trim()) {
      current += ` ${line.trim()}`
    }
  }
  if (current) connections.push(current)
  parsed.warning = cleanInline(parsed.warning || '')
  parsed.connections = connections
  return parsed
}

function countCards(deck) {
  return parseMarkdown(RAPID_FIRE_MARKDOWN[deck.file], deck).sections.reduce((sum, section) => sum + section.cards.length, 0)
}

function SourceLink({ href, children, className = '' }) {
  return <a className={className} href={href} target="_blank" rel="noopener noreferrer">{children}</a>
}

function renderBlocks(blocks, baseHref) {
  return blocks.map((block, index) => block.type === 'ordered'
    ? <ol key={index}>{block.items.map((item, itemIndex) => <li key={itemIndex}>{renderInlineMarkdown(item, baseHref)}</li>)}</ol>
    : <p key={index}>{renderInlineMarkdown(block.text, baseHref)}</p>)
}

function DeckCard({ deck, count, onOpen }) {
  return (
    <div className="rf-deck-card-wrap">
      <button className="rf-deck-card" style={{ '--rf-accent': deck.color }} onClick={() => onOpen(deck.id)}>
        <span className="rf-deck-icon">{deck.icon}</span>
        <span className="rf-deck-main"><strong>{deck.title}</strong><small>{deck.treatment} · {count} cards</small></span>
        <span className="rf-deck-arrow">→</span>
      </button>
      <div className="rf-deck-links">
        <SourceLink href={deck.href}>Rapid Fire deck ↗</SourceLink>
        {deck.treatmentHref && <SourceLink href={deck.treatmentHref}>{deck.treatment} full treatment ↗</SourceLink>}
      </div>
    </div>
  )
}

function Flashcard({ card, index, revealed, onToggle, baseHref }) {
  return (
    <article className={`rf-card ${revealed ? 'is-revealed' : ''}`}>
      <button className="rf-question" onClick={onToggle} aria-expanded={revealed}>
        <span className="rf-card-index">{String(index + 1).padStart(2, '0')}</span>
        <span className="rf-question-copy">{renderInlineMarkdown(card.question, baseHref)}</span>
        <span className="rf-reveal-label">{revealed ? 'Hide' : 'Reveal'} <span>{revealed ? '↑' : '↓'}</span></span>
      </button>
      <div className="rf-answer" aria-hidden={!revealed}>
        <div className="rf-answer-label">Answer</div>
        <p>{renderInlineMarkdown(card.answer, baseHref)}</p>
      </div>
    </article>
  )
}

function Hub({ onOpen }) {
  const index = useMemo(parseIndex, [])
  const [query, setQuery] = useState('')
  const counts = useMemo(() => Object.fromEntries(DECKS.map(deck => [deck.id, countCards(deck)])), [])
  const visibleDecks = DECKS.filter(deck => deck.title.toLowerCase().includes(query.toLowerCase()))

  return (
    <div className="rapid-fire-page">
      <Link to="/" className="back-link">← Back to Home</Link>
      <section className="rf-hero">
        <div className="rf-eyebrow"><span className="rf-live-dot" /> RETRIEVAL PRACTICE · PLAYBOOK 11</div>
        <h1>⚡ Rapid Fire</h1>
        <p className="rf-hero-subtitle">{index.description}</p>
        <div className="rf-hero-actions"><button className="rf-primary-button" onClick={() => onOpen('llm-fundamentals')}>Start with LLM Fundamentals <span>→</span></button><SourceLink className="rf-source-button" href={RAPID_FIRE_SOURCE_URL}>Open canonical page ↗</SourceLink></div>
        <div className="rf-stat-row"><span><b>10</b> decks</span><span><b>{Object.values(counts).reduce((sum, count) => sum + count, 0)}</b> flashcards</span><span><b>3-line</b> answers</span><span><b>100%</b> source-linked</span></div>
      </section>

      <div className="rf-source-bar"><span>📌 Canonical source</span><SourceLink href={RAPID_FIRE_SOURCE_URL}>{RAPID_FIRE_SOURCE_URL}</SourceLink><SourceLink href={RAPID_FIRE_REPO_URL} className="rf-repo-link">View Markdown repository ↗</SourceLink></div>

      <section className="rf-intro-grid">
        <div className="rf-panel rf-how-to">
          <div className="rf-panel-kicker">THE METHOD</div><h2>How to use these decks</h2>
          <div className="rf-inline-note"><strong>Prerequisites</strong><p>{renderInlineMarkdown(index.prerequisite, RAPID_FIRE_SOURCE_URL)}</p></div>
          <div className="rf-panel-lead rf-usage-lead">{renderBlocks(index.usageBlocks.slice(0, 1), RAPID_FIRE_SOURCE_URL)}</div>
          {renderBlocks(index.usageBlocks.slice(1), RAPID_FIRE_SOURCE_URL)}
        </div>
        <div className="rf-panel rf-warning-panel"><div className="rf-panel-kicker">⚠ COMMON MISCONCEPTION</div><h2>Recognition is not recall</h2><p>{index.warning}</p></div>
      </section>

      <section className="rf-decks-section"><div className="rf-section-heading"><div><div className="rf-panel-kicker">THE LIBRARY</div><h2>The decks</h2></div><label className="rf-search"><span>⌕</span><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Find a deck…" /></label></div><div className="rf-deck-grid">{visibleDecks.map(deck => <DeckCard key={deck.id} deck={deck} count={counts[deck.id]} onOpen={onOpen} />)}</div></section>

      <section className="rf-connections rf-panel"><div className="rf-panel-kicker">WHERE THIS CONNECTS</div><h2>Recall + structure</h2><div className="rf-connection-list">{index.connections.map((connection, i) => <p key={i}>↗ {renderInlineMarkdown(connection, RAPID_FIRE_SOURCE_URL)}</p>)}</div></section>
      <footer className="rf-footer">Rapid Fire · AI Engineering Playbook · <SourceLink href={RAPID_FIRE_SOURCE_URL}>Original reference ↗</SourceLink></footer>
    </div>
  )
}

function DeckView({ deck }) {
  const data = useMemo(() => parseMarkdown(RAPID_FIRE_MARKDOWN[deck.file], deck), [deck])
  const [query, setQuery] = useState('')
  const [revealed, setRevealed] = useState(new Set())
  const [activeSection, setActiveSection] = useState(data.sections[0]?.title || '')
  const allCards = data.sections.flatMap(section => section.cards)
  const normalizedQuery = query.trim().toLowerCase()
  const visibleSections = data.sections.map(section => ({ ...section, cards: section.cards.filter(card => !normalizedQuery || `${card.question} ${card.answer}`.toLowerCase().includes(normalizedQuery)) })).filter(section => section.cards.length > 0)
  const allVisibleKeys = visibleSections.flatMap(section => section.cards.map(card => card.question))
  const isAllRevealed = allVisibleKeys.length > 0 && allVisibleKeys.every(key => revealed.has(key))
  const toggle = question => setRevealed(current => { const next = new Set(current); if (next.has(question)) next.delete(question); else next.add(question); return next })
  const revealAll = () => setRevealed(isAllRevealed ? new Set() : new Set(allVisibleKeys))

  return (
    <div className="rapid-fire-page rf-deck-view" style={{ '--rf-accent': deck.color }}>
      <Link to="/rapid-fire" className="back-link">← All Rapid Fire decks</Link>
      <section className="rf-deck-hero"><div className="rf-deck-breadcrumb">RAPID FIRE / {deck.treatment.toUpperCase()}</div><h1><span>{deck.icon}</span> {data.title.replace('Rapid Fire: ', '')}</h1><p>{data.description}</p><div className="rf-deck-hero-meta"><span>{allCards.length} cards</span><span>Question → 3-line answer</span><SourceLink href={deck.href}>Full treatment ↗</SourceLink></div></section>
      <div className="rf-source-bar rf-source-bar-small"><span>📌 Source</span><SourceLink href={RAPID_FIRE_SOURCE_URL}>{RAPID_FIRE_SOURCE_URL}</SourceLink><SourceLink href={deck.href}>Open this deck on original site ↗</SourceLink></div>
      <div className="rf-prerequisite"><span>Prerequisite</span><p>{renderInlineMarkdown(data.prerequisite, deck.href)}</p></div>
      <div className="rf-instructions"><strong>How to use this deck</strong><div className="rf-instruction-content">{renderBlocks(data.usageBlocks, deck.href)}</div></div>

      <div className="rf-deck-layout"><aside className="rf-toc"><div className="rf-toc-title">Contents <span>{data.sections.length}</span></div>{data.sections.map(section => <button key={section.title} className={activeSection === section.title ? 'active' : ''} onClick={() => { setActiveSection(section.title); document.getElementById(`rf-section-${slugify(section.title)}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }}><span>{section.cards.length}</span>{section.title}</button>)}</aside><main className="rf-card-content"><div className="rf-toolbar"><label className="rf-search"><span>⌕</span><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search questions and answers…" /></label><button className="rf-tool-button" onClick={revealAll}>{isAllRevealed ? 'Hide all' : 'Reveal all'}</button></div>{visibleSections.length === 0 && <div className="rf-empty">No cards match “{query}”.</div>}{visibleSections.map(section => <section key={section.title} id={`rf-section-${slugify(section.title)}`} className="rf-card-section"><div className="rf-card-section-header"><span>{section.cards.length}</span><h2>{section.title}</h2></div>{section.cards.map((card, i) => <Flashcard key={card.question} card={card} index={i} revealed={revealed.has(card.question)} onToggle={() => toggle(card.question)} baseHref={deck.href} />)}</section>)}{data.footer && <div className="rf-full-treatment">{renderInlineMarkdown(data.footer, deck.href)}</div>}</main></div>
      <footer className="rf-footer">{data.title} · <SourceLink href={deck.href}>Original deck ↗</SourceLink> · <SourceLink href={RAPID_FIRE_SOURCE_URL}>Rapid Fire index ↗</SourceLink></footer>
    </div>
  )
}

function slugify(value) { return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') }

export default function RapidFireView() {
  const { deckId } = useParams()
  const navigate = useNavigate()
  const deck = DECKS.find(item => item.id === deckId)
  if (!deckId) return <Hub onOpen={id => navigate(`/rapid-fire/${id}`)} />
  if (!deck) return <Navigate to="/rapid-fire" replace />
  return <DeckView deck={deck} />
}
