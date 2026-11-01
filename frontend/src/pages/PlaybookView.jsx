import React, { useMemo } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import MermaidRenderer from '../components/MermaidRenderer'
import { PLAYBOOK_DOCS, PLAYBOOK_REPO_URL, PLAYBOOK_SOURCE_URL } from '../data/playbookData'
import FetchButton from '../components/FetchButton'
import './PlaybookView.css'
import { useLang } from '../i18n'

const SECTION_META = {
  '01-llm-fundamentals': ['01', 'LLM Fundamentals', '🧠'],
  '02-embeddings-and-search': ['02', 'Embeddings & Search', '🧭'],
  '03-vector-databases': ['03', 'Vector Databases', '🗄️'],
  '04-rag': ['04', 'RAG', '🔎'],
  '05-agents': ['05', 'Agents', '🤖'],
  '06-mcp': ['06', 'MCP', '🔌'],
  '07-production': ['07', 'Production', '🚀'],
  '08-model-landscape': ['08', 'Model Landscape', '🌐'],
  '09-multimodal': ['09', 'Multimodal', '👁️'],
  '10-system-design': ['10', 'System Design', '🏗️'],
  '11-rapid-fire': ['11', 'Rapid Fire', '⚡'],
}

const DOC_KEYS = Object.keys(PLAYBOOK_DOCS)
const SECTION_KEYS = Object.keys(SECTION_META)
const PAGE_ORDER = {
  '01-llm-fundamentals': ['index', 'how-llms-work', 'tokens-and-context', 'sampling-and-determinism', 'prompt-engineering', 'structured-output', 'llm-apis', 'hallucination'],
  '02-embeddings-and-search': ['index', 'embeddings', 'similarity-metrics', 'ann-indexes', 'hybrid-search', 'rerankers', 'embeddings-beyond-rag'],
  '03-vector-databases': ['index', 'landscape', 'filtering-and-metadata', 'scaling-and-operations'],
  '04-rag': ['index', 'rag-pipeline', 'ingestion-and-chunking', 'retrieval-patterns', 'advanced-rag', 'rag-evaluation', 'production-rag'],
  '05-agents': ['index', 'agent-foundations', 'tool-calling', 'agent-harness', 'agents-vs-workflows', 'orchestration', 'harness-vs-orchestration', 'multi-agent', 'agent-reliability'],
  '06-mcp': ['index', 'mcp-protocol', 'building-mcp-servers'],
  '07-production': ['index', 'latency', 'cost', 'reliability', 'observability', 'evals-and-testing', 'security'],
  '08-model-landscape': ['index', 'choosing-models', 'open-source-self-hosting', 'fine-tuning'],
  '09-multimodal': ['index', 'multimodal'],
  '10-system-design': ['index', 'how-to-answer', 'design-enterprise-rag', 'design-document-qa-at-scale', 'design-semantic-code-search', 'design-customer-support-agent', 'design-llm-gateway'],
  '11-rapid-fire': ['index', '01-llm-fundamentals', '02-embeddings-and-search', '03-vector-databases', '04-rag', '05-agents', '06-mcp', '07-production', '08-model-landscape', '09-multimodal', 'tradeoff-one-liners'],
}
const DOC_ENTRIES = DOC_KEYS.filter(key => key !== 'docs/index.md').map(key => ({ key, ...getDocMeta(key) }))

function getDocMeta(key) {
  const section = key.split('/')[1]
  const slug = key.split('/').pop().replace(/\.md$/, '')
  const markdown = PLAYBOOK_DOCS[key] || ''
  const heading = markdown.match(/^#\s+(.+)$/m)?.[1] || slug.replace(/[-_]+/g, ' ')
  return { section, slug, title: stripMarkdown(heading) }
}

function stripMarkdown(text = '') {
  return text.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/[*_`]/g, '').trim()
}

function titleCase(value = '') {
  return value.split('-').map(word => word ? word[0].toUpperCase() + word.slice(1) : word).join(' ')
}

function docUrl(key, hash = '') {
  if (key === 'docs/index.md') return `/playbook${hash}`
  return `/playbook/${key.replace(/^docs\//, '').replace(/\.md$/, '')}${hash}`
}

function normalizeDocPath(path, currentKey) {
  const cleanPath = path.split('#')[0].split('?')[0]
  const base = currentKey.split('/').slice(0, -1)
  const pieces = [...base, ...cleanPath.split('/')]
  const normalized = []
  for (const piece of pieces) {
    if (!piece || piece === '.') continue
    if (piece === '..') normalized.pop()
    else normalized.push(piece)
  }
  let result = normalized.join('/')
  if (!result.startsWith('docs/')) result = `docs/${result}`
  if (!result.endsWith('.md')) result += '.md'
  return result
}

function resolveHref(href, currentKey) {
  if (/^#/i.test(href)) return { external: false, href: `${docUrl(currentKey, href)}` }
  if (/^(https?:|mailto:)/i.test(href)) return { external: true, href }
  const [path, hash = ''] = href.split('#')
  const key = normalizeDocPath(path, currentKey)
  if (PLAYBOOK_DOCS[key]) return { external: false, href: `${docUrl(key)}${hash ? `#${hash}` : ''}` }
  return { external: true, href: new URL(href, `${PLAYBOOK_SOURCE_URL}${currentKey.replace(/^docs\//, '')}`).toString() }
}

function InlineMarkdown({ text = '', currentKey }) {
  const parts = text.split(/(`[^`]*`|\[[^\]]+\]\([^)]*\)|\*\*[^*]+\*\*|__[^_]+__|\*[^*]+\*|_[^_]+_)/g)
  return parts.map((part, index) => {
    if (!part) return null
    if (part.startsWith('`') && part.endsWith('`')) return <code key={index}>{part.slice(1, -1)}</code>
    const link = part.match(/^\[([^\]]+)\]\(([^)]*)\)$/)
    if (link) {
      const target = resolveHref(link[2], currentKey)
      if (!target.external) return <Link key={index} to={target.href}>{link[1]}</Link>
      return <a key={index} href={target.href} target="_blank" rel="noopener noreferrer">{link[1]}</a>
    }
    if (part.startsWith('**') && part.endsWith('**')) return <strong key={index}><InlineMarkdown text={part.slice(2, -2)} currentKey={currentKey} /></strong>
    if (part.startsWith('__') && part.endsWith('__')) return <strong key={index}><InlineMarkdown text={part.slice(2, -2)} currentKey={currentKey} /></strong>
    if (part.startsWith('*') && part.endsWith('*')) return <em key={index}>{part.slice(1, -1)}</em>
    if (part.startsWith('_') && part.endsWith('_')) return <em key={index}>{part.slice(1, -1)}</em>
    return <React.Fragment key={index}>{part}</React.Fragment>
  })
}

function collectIndented(lines, start) {
  const body = []
  let end = start
  for (let i = start + 1; i < lines.length; i += 1) {
    if (lines[i].startsWith('    ') || lines[i].startsWith('\t')) {
      body.push(lines[i].startsWith('    ') ? lines[i].slice(4) : lines[i].slice(1))
      end = i
    } else if (!lines[i].trim()) {
      body.push('')
      end = i
    } else break
  }
  while (body.at(-1) === '') body.pop()
  return { lines: body, end }
}

function parseTable(lines) {
  const rows = lines.map(line => line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map(cell => cell.trim()))
  const separator = rows.findIndex(row => row.every(cell => /^:?-{3,}:?$/.test(cell)))
  return { headers: rows[0] || [], rows: separator >= 0 ? rows.slice(separator + 1) : rows.slice(1) }
}

function parseDocument(markdown) {
  const withoutFrontmatter = markdown.replace(/^---\s*[\r\n]+[\s\S]*?[\r\n]+---\s*[\r\n]*/, '')
  const lines = withoutFrontmatter.split(/\r?\n/)
  const blocks = []
  let i = 0
  while (i < lines.length) {
    const line = lines[i]
    const trimmed = line.trim()
    if (!trimmed) { i += 1; continue }

    if (/^===\s+"/.test(trimmed)) {
      const tabs = []
      while (i < lines.length && /^===\s+"/.test(lines[i].trim())) {
        const tabTitle = lines[i].trim().match(/^===\s+"([^"]+)"/)?.[1] || 'Tab'
        const body = collectIndented(lines, i)
        tabs.push({ title: tabTitle, blocks: parseDocument(body.lines.join('\n')) })
        i = body.end + 1
      }
      blocks.push({ type: 'tabs', tabs })
      continue
    }

    if (/^<img\b/i.test(trimmed)) {
      const src = trimmed.match(/src=["']([^"']+)["']/i)?.[1]
      const alt = trimmed.match(/alt=["']([^"']*)["']/i)?.[1] || 'Playbook artwork'
      blocks.push({ type: 'image', src, alt })
      i += 1
      continue
    }

    if (/^<\/?(?:div|p|ol|li|span|section)\b/i.test(trimmed)) {
      const withoutTags = trimmed.replace(/<\/?(?:div|p|ol|li|span|section)(?:\s[^>]*)?>/gi, '').trim()
      if (withoutTags) blocks.push({ type: 'paragraph', text: withoutTags })
      i += 1
      continue
    }

    const heading = line.match(/^(#{1,6})\s+(.+)$/)
    if (heading) { blocks.push({ type: 'heading', level: heading[1].length, text: heading[2] }); i += 1; continue }

    if (line.startsWith('>')) {
      const quote = []
      while (i < lines.length && lines[i].startsWith('>')) { quote.push(lines[i].replace(/^>\s?/, '')); i += 1 }
      blocks.push({ type: 'quote', text: quote.join(' ') }); continue
    }

    if (line.startsWith('!!!')) {
      const match = line.match(/^!!!\s+(\S+)(?:\s+"([^"]+)")?/) || []
      const body = collectIndented(lines, i)
      blocks.push({ type: 'admonition', kind: match[1] || 'info', title: match[2] || titleCase(match[1] || 'info'), blocks: parseDocument(body.lines.join('\n')) })
      i = body.end + 1; continue
    }

    if (line.startsWith('???')) {
      const match = line.match(/^\?\?\?(\+)?\s+(\S+)(?:\s+"([^"]+)")?/) || []
      const body = collectIndented(lines, i)
      blocks.push({ type: 'quiz', open: Boolean(match[1]), kind: match[2] || 'question', title: match[3] || titleCase(match[2] || 'Question'), blocks: parseDocument(body.lines.join('\n')) })
      i = body.end + 1; continue
    }

    if (line.trim().startsWith('```')) {
      const language = line.trim().slice(3).trim()
      const code = []
      i += 1
      while (i < lines.length && !lines[i].trim().startsWith('```')) { code.push(lines[i]); i += 1 }
      blocks.push({ type: language.toLowerCase() === 'mermaid' ? 'mermaid' : 'code', language, code: code.join('\n') })
      i += 1; continue
    }

    if (line.trim().startsWith('|')) {
      const table = []
      while (i < lines.length && lines[i].trim().startsWith('|')) { table.push(lines[i]); i += 1 }
      blocks.push({ type: 'table', ...parseTable(table) }); continue
    }

    if (/^\s*(?:[-*+]\s+|\d+\.\s+)/.test(line)) {
      const ordered = /^\s*\d+\.\s+/.test(line)
      const items = []
      while (i < lines.length) {
        const match = lines[i].match(ordered ? /^\s*\d+\.\s+(.+)$/ : /^\s*[-*+]\s+(.+)$/)
        if (!match) break
        items.push(match[1]); i += 1
      }
      blocks.push({ type: ordered ? 'ordered' : 'unordered', items }); continue
    }

    if (/^(---|\*\*\*)\s*$/.test(trimmed)) { blocks.push({ type: 'rule' }); i += 1; continue }

    const paragraph = [trimmed]
    i += 1
    while (i < lines.length && lines[i].trim() && !/^(#{1,6})\s+|^>|^!!!|^\?\?\?|^```|^\s*\||^\s*(?:[-*+]\s+|\d+\.\s+)/.test(lines[i])) {
      paragraph.push(lines[i].trim()); i += 1
    }
    blocks.push({ type: 'paragraph', text: paragraph.join(' ') })
  }
  return blocks
}

function BlockRenderer({ block, currentKey, diagramIndex }) {
  const { t } = useLang()
  if (block.type === 'heading') {
    const Tag = `h${Math.min(block.level, 4)}`
    return <Tag className={`pb-heading pb-h${block.level}`}><InlineMarkdown text={block.text} currentKey={currentKey} /></Tag>
  }
  if (block.type === 'paragraph') return <p className="pb-paragraph"><InlineMarkdown text={block.text} currentKey={currentKey} /></p>
  if (block.type === 'quote') return <blockquote className="pb-blockquote"><InlineMarkdown text={block.text} currentKey={currentKey} /></blockquote>
  if (block.type === 'image') return <img className="pb-image" src={block.src?.startsWith('http') ? block.src : `/playbook-assets/${block.src?.split('/').pop() || 'logo.svg'}`} alt={block.alt} />
  if (block.type === 'tabs') return <div className="pb-tabs">{block.tabs.map((tab, index) => <details key={index} open={index === 0} className="pb-tab"><summary>{tab.title}</summary><div className="pb-tab-body"><BlockList blocks={tab.blocks} currentKey={currentKey} prefix={`${diagramIndex}-tab-${index}`} /></div></details>)}</div>

  if (block.type === 'rule') return <hr className="pb-rule" />
  if (block.type === 'unordered' || block.type === 'ordered') {
    const Tag = block.type === 'ordered' ? 'ol' : 'ul'
    return <Tag className="pb-list">{block.items.map((item, index) => <li key={index}><InlineMarkdown text={item} currentKey={currentKey} /></li>)}</Tag>
  }
  if (block.type === 'table') return <div className="pb-table-wrap"><table className="pb-table"><thead><tr>{block.headers.map((cell, index) => <th key={index}><InlineMarkdown text={cell} currentKey={currentKey} /></th>)}</tr></thead><tbody>{block.rows.map((row, rowIndex) => <tr key={rowIndex}>{row.map((cell, index) => <td key={index}><InlineMarkdown text={cell} currentKey={currentKey} /></td>)}</tr>)}</tbody></table></div>
  if (block.type === 'code') return <details className="pb-code" open><summary>{block.language || t('Code')} <span>⌄</span></summary><pre><code>{block.code}</code></pre></details>
  if (block.type === 'mermaid') return <div className="pb-diagram"><div className="pb-diagram-label">📐 {t('Diagram')}</div><MermaidRenderer source={block.code} id={`playbook-${diagramIndex}`} /><details className="pb-source"><summary>{t('Show Mermaid source')}</summary><pre><code>{block.code}</code></pre></details></div>
  if (block.type === 'admonition') return <aside className={`pb-callout pb-callout-${block.kind}`}><div className="pb-callout-title">{calloutIcon(block.kind)} {block.title}</div><div className="pb-callout-body"><BlockList blocks={block.blocks} currentKey={currentKey} prefix={`${diagramIndex}-callout`} /></div></aside>
  if (block.type === 'quiz') return <details className={`pb-quiz pb-quiz-${block.kind}`} open={block.open}><summary>🧪 {block.title}<span>{t('Reveal answer')}</span></summary><div className="pb-quiz-body"><BlockList blocks={block.blocks} currentKey={currentKey} prefix={`${diagramIndex}-quiz`} /></div></details>
  return null
}

function BlockList({ blocks, currentKey, prefix = 'block' }) {
  return <>{blocks.map((block, index) => <BlockRenderer key={`${prefix}-${index}`} block={block} currentKey={currentKey} diagramIndex={`${prefix}-${index}`} />)}</>
}

function calloutIcon(kind) {
  return ({ info: 'ℹ️', abstract: '🧭', tip: '💡', warning: '⚠️', danger: '🛡️', example: '🧪', success: '✅' }[kind] || '📌')
}

function buildNavigation() {
  return SECTION_KEYS.map(section => ({
    key: section,
    number: SECTION_META[section][0],
    title: SECTION_META[section][1],
    icon: SECTION_META[section][2],
    pages: DOC_ENTRIES.filter(doc => doc.section === section).sort((a, b) => (PAGE_ORDER[section]?.indexOf(a.slug) ?? 999) - (PAGE_ORDER[section]?.indexOf(b.slug) ?? 999)),
  }))
}

function currentDocKey(pathname) {
  const relative = pathname.replace(/^\/playbook\/?/, '').replace(/\/$/, '')
  if (!relative) return 'docs/index.md'
  const key = `docs/${relative}.md`
  return PLAYBOOK_DOCS[key] ? key : null
}

function SourceBar({ currentKey }) {
  const { t } = useLang()
  const rawUrl = `https://raw.githubusercontent.com/karthikreddy-7/ai-engineering-playbook/main/${currentKey}`
  return <div className="pb-source-bar"><span>📌 {t('Source mirrored from')}</span><a href={rawUrl} target="_blank" rel="noopener noreferrer">{t('GitHub raw Markdown')} ↗</a><a href={PLAYBOOK_SOURCE_URL} target="_blank" rel="noopener noreferrer">{t('Open original site')} ↗</a></div>
}

export default function PlaybookView() {
  const { t } = useLang()
  const location = useLocation()
  const navigate = useNavigate()
  const currentKey = currentDocKey(location.pathname)
  const markdown = currentKey ? (PLAYBOOK_DOCS[currentKey] || PLAYBOOK_DOCS['docs/index.md']) : ''
  const blocks = useMemo(() => parseDocument(markdown), [markdown])
  const navigation = useMemo(buildNavigation, [])
  if (!currentKey) return <div className="playbook-page"><div className="pb-not-found"><h1>{t('Playbook page not found')}</h1><p>This route does not map to one of the mirrored GitHub Markdown pages.</p><Link to="/playbook">← {t('Return to the Playbook')}</Link></div></div>
  const current = currentKey === 'docs/index.md' ? { title: 'AI Engineering Playbook', section: 'root', slug: 'index' } : getDocMeta(currentKey)
  const diagramCount = blocks.filter(block => block.type === 'mermaid').length

  return <div className="playbook-page">
    <div className="pb-topline">
      <Link to="/">← {t('AI Knowledge Hub')}</Link>
      <div className="page-header-row">
        <span>{t('Complete repository mirror')} · {DOC_KEYS.length} {t('Markdown pages')}</span>
        <FetchButton label="Fetch Latest" staticMode />
      </div>
      <a href={PLAYBOOK_REPO_URL} target="_blank" rel="noopener noreferrer">{t('GitHub repository')} ↗</a>
    </div>
    <div className="pb-layout">
      <aside className="pb-nav">
        <Link to="/playbook" className={`pb-nav-home ${currentKey === 'docs/index.md' ? 'active' : ''}`}><span>📘</span><strong>{t('AI Engineering Playbook')}</strong></Link>
        <div className="pb-nav-search">⌕ <span>{t('Browse all source pages')}</span></div>
        {navigation.map(section => <div className="pb-nav-section" key={section.key}><div className="pb-nav-section-title"><span>{section.icon}</span>{section.number} · {section.title}</div>{section.pages.map(page => <Link key={page.key} to={docUrl(page.key)} className={page.key === currentKey ? 'active' : ''}>{page.title}</Link>)}</div>)}
      </aside>
      <main className="pb-main">
        <SourceBar currentKey={currentKey} />
        <div className="pb-breadcrumb"><Link to="/playbook">{t('AI Engineering Playbook')}</Link>{current.section !== 'root' && <> <span>/</span> <span>{SECTION_META[current.section]?.[1] || titleCase(current.section)}</span></>}</div>
        <article className="pb-article"><div className="pb-article-meta"><span>{current.section === 'root' ? t('START HERE') : `${SECTION_META[current.section]?.[0] || ''} · ${SECTION_META[current.section]?.[1] || titleCase(current.section)}`}</span>{diagramCount > 0 && <span>📐 {diagramCount} diagram{diagramCount === 1 ? '' : 's'} on this page</span>}</div><BlockList blocks={blocks} currentKey={currentKey} prefix={currentKey.replace(/[^a-z0-9]/gi, '-')} /></article>
        <div className="pb-bottom-nav"><button disabled={currentKey === 'docs/index.md'} onClick={() => navigate('/playbook')}>← {t('Playbook home')}</button><a href={PLAYBOOK_REPO_URL} target="_blank" rel="noopener noreferrer">{t('View repository')} ↗</a></div>
      </main>
    </div>
  </div>
}
