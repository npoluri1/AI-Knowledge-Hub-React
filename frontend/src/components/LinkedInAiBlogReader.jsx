import { useEffect, useMemo, useState } from 'react'
import { LINKEDIN_AI_LESSONS } from '../data/linkedinAiLessonsData'
import { LINKEDIN_ADVANCED_LESSONS } from '../data/linkedinAdvancedLessonsData'
import { LINKEDIN_LATEST_LESSONS } from '../data/linkedinLatestLessonsData'
import { LINKEDIN_COLLECTION_LESSONS } from '../data/linkedinCollectionLessonsData'
import './LinkedInAiBlogReader.css'

const LESSONS = [...LINKEDIN_AI_LESSONS, ...LINKEDIN_ADVANCED_LESSONS, ...LINKEDIN_LATEST_LESSONS, ...LINKEDIN_COLLECTION_LESSONS]
const CATEGORIES = ['All', ...new Set(LESSONS.map(item => item.category))]

const CATEGORY_ACCENTS = {
  'Agent foundations': 'cyan',
  'Agent design': 'green',
  'MCP engineering': 'purple',
  'Retrieval engineering': 'blue',
  'Data acquisition': 'yellow',
  'Data engineering': 'teal',
  'Enterprise architecture': 'pink',
  'Platform architecture': 'purple',
  'AI infrastructure': 'yellow',
  'Model strategy': 'green',
  'Backend engineering': 'cyan',
  'Context engineering': 'blue',
  'Operations and evaluation': 'teal',
  'Safety and governance': 'pink',
  'Production engineering': 'yellow',
  'Protocols and integration': 'purple',
  'Cost and performance': 'green',
  'Career and architecture': 'cyan',
  'Learning roadmap': 'blue',
  'AI workflow': 'pink',
  'Agent reliability': 'pink',
  'AI foundations': 'cyan',
  'Data governance': 'teal',
  'Agent deployment': 'purple',
  'Security engineering': 'red',
  'Developer productivity': 'green',
  'Product architecture': 'yellow',
}

function CopyButton({ value, label = 'Copy' }) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1400)
    } catch {
      setCopied(false)
    }
  }

  return <button type="button" className="lia-copy" onClick={copy}>{copied ? 'Copied' : label}</button>
}

function Diagram({ steps = [] }) {
  if (!steps.length) return null
  return (
    <section className="lia-diagram-section">
      <div className="lia-section-heading">
        <div>
          <span className="lia-section-kicker">Visual model</span>
          <h3>How the system works</h3>
        </div>
        <span className="lia-section-hint">Follow the request from input to outcome</span>
      </div>
      <div className="lia-diagram" aria-label="Architecture flow diagram">
        {steps.map((step, index) => (
          <div className="lia-diagram-step-wrap" key={`${step.label}-${index}`}>
            <div className={`lia-diagram-step lia-tone-${step.tone || 'cyan'}`}>
              <span className="lia-diagram-number">{String(index + 1).padStart(2, '0')}</span>
              <strong>{step.label}</strong>
              <small>{step.detail}</small>
            </div>
            {index < steps.length - 1 && <span className="lia-diagram-arrow" aria-hidden="true">→</span>}
          </div>
        ))}
      </div>
    </section>
  )
}

function LinkList({ links = [] }) {
  if (!links.length) return null
  return (
    <section className="lia-links-section">
      <div className="lia-section-heading">
        <div>
          <span className="lia-section-kicker">Further reading</span>
          <h3>Official docs and references</h3>
        </div>
      </div>
      <div className="lia-links">
        {links.map(link => <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer">{link.label} <span aria-hidden="true">↗</span></a>)}
      </div>
    </section>
  )
}

function LessonArticle({ lesson, onClose, onSelectLesson }) {
  const related = LESSONS.filter(item => item.id !== lesson.id && item.tags.some(tag => lesson.tags.includes(tag))).slice(0, 3)
  const accent = CATEGORY_ACCENTS[lesson.category] || 'cyan'

  useEffect(() => {
    const onKeyDown = event => { if (event.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [onClose])

  const useCases = lesson.useCases || []
  const projects = lesson.projectIdeas || []
  const setup = lesson.setup || []
  const diagram = lesson.diagram || []
  const links = lesson.links || []

  return (
    <div className="lia-overlay" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) onClose() }}>
      <article className={`lia-article lia-article-${accent}`} role="dialog" aria-modal="true" aria-labelledby="lia-article-title">
        <header className="lia-article-header">
          <div className="lia-article-header-copy">
            <div className="lia-article-meta-row">
              <span className="lia-category">{lesson.category}</span>
              <span>{lesson.tags.slice(0, 4).join(' · ')}</span>
            </div>
            <h2 id="lia-article-title">{lesson.title}</h2>
            <p>{lesson.excerpt}</p>
          </div>
          <button type="button" className="lia-close" onClick={onClose} aria-label="Close article">×</button>
        </header>

        <div className="lia-article-body">
          <div className="lia-article-source"><span>Source note</span> {lesson.source}</div>

          <section className="lia-lead-section">
            <div className="lia-section-heading"><div><span className="lia-section-kicker">Start here</span><h3>Core concepts</h3></div></div>
            <ul>{lesson.concepts.map(item => <li key={item}>{item}</li>)}</ul>
          </section>

          <Diagram steps={diagram} />

          <section className="lia-highlight-section">
            <span className="lia-section-kicker">Real-world scenario</span>
            <h3>What this looks like in production</h3>
            <p>{lesson.scenario}</p>
          </section>

          <div className="lia-two-column">
            <section className="lia-article-section">
              <span className="lia-section-kicker">Engineering checklist</span>
              <h3>Important points</h3>
              <ul>{lesson.importantPoints.map(item => <li key={item}>{item}</li>)}</ul>
            </section>
            <section className="lia-article-section">
              <span className="lia-section-kicker">Decision guide</span>
              <h3>Where to use it</h3>
              {useCases.length ? <ul>{useCases.map(item => <li key={item}>{item}</li>)}</ul> : <p>Use this pattern where the scenario and constraints match the article.</p>}
            </section>
          </div>

          <section className="lia-article-section lia-architecture-section">
            <span className="lia-section-kicker">Implementation path</span>
            <h3>End-to-end architecture</h3>
            <ol>{lesson.architecture.map(item => <li key={item}>{item}</li>)}</ol>
          </section>

          {projects.length > 0 && (
            <section className="lia-projects-section">
              <div className="lia-section-heading"><div><span className="lia-section-kicker">Build it</span><h3>Project ideas</h3></div><span className="lia-section-hint">Practice the concept with a complete deliverable</span></div>
              <div className="lia-project-grid">
                {projects.map((project, index) => <div className="lia-project-card" key={project}><span>PROJECT {String(index + 1).padStart(2, '0')}</span><p>{project}</p></div>)}
              </div>
            </section>
          )}

          {setup.length > 0 && (
            <section className="lia-setup-section">
              <div className="lia-code-heading"><div><span className="lia-section-kicker">Local lab</span><h3>Setup and run path</h3></div></div>
              <ol>{setup.map(step => <li key={step}><code>{step}</code></li>)}</ol>
            </section>
          )}

          <section className="lia-code-section">
            <div className="lia-code-heading"><div><span className="lia-section-kicker">Configuration</span><h3>Production starting point</h3><span>Adapt names, limits, credentials, and providers to your environment.</span></div><CopyButton value={lesson.config} label="Copy config" /></div>
            <pre><code>{lesson.config}</code></pre>
          </section>

          <section className="lia-code-section lia-runnable-section">
            <div className="lia-code-heading"><div><span className="lia-section-kicker">Runnable lab</span><h3>End-to-end example</h3><span>Copy this example into a file and run it with the setup above.</span></div><CopyButton value={lesson.code} label="Copy code" /></div>
            <pre><code>{lesson.code}</code></pre>
          </section>

          <section className="lia-highlight-section lia-output-section">
            <span className="lia-section-kicker">Verify the lab</span>
            <h3>Expected result</h3>
            <p>{lesson.output}</p>
          </section>

          <div className="lia-two-column">
            <section className="lia-article-section lia-warning-section"><span className="lia-section-kicker">Protect the system</span><h3>Common failure modes</h3><ul>{lesson.pitfalls.map(item => <li key={item}>{item}</li>)}</ul></section>
            <section className="lia-article-section lia-metrics-section"><span className="lia-section-kicker">Operate it</span><h3>Production metrics</h3><ul>{lesson.metrics.map(item => <li key={item}>{item}</li>)}</ul></section>
          </div>

          <LinkList links={links} />

          {related.length > 0 && (
            <section className="lia-related-section"><span className="lia-section-kicker">Continue learning</span><h3>Related topics</h3><div className="lia-related-grid">{related.map(item => <button type="button" key={item.id} onClick={() => onSelectLesson(item)}>{item.title}<span>Read topic →</span></button>)}</div></section>
          )}
        </div>
      </article>
    </div>
  )
}

export default function LinkedInAiBlogReader() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [selectedLesson, setSelectedLesson] = useState(null)
  const [showAll, setShowAll] = useState(false)

  const filteredLessons = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return LESSONS.filter(lesson => {
      if (category !== 'All' && lesson.category !== category) return false
      if (!needle) return true
      const searchable = [lesson.title, lesson.excerpt, lesson.category, lesson.scenario, ...lesson.tags, ...lesson.concepts, ...(lesson.useCases || [])].join(' ').toLowerCase()
      return searchable.includes(needle)
    })
  }, [category, query])

  const visibleLessons = showAll || query || category !== 'All' ? filteredLessons : filteredLessons.slice(0, 12)
  const advancedCount = LINKEDIN_ADVANCED_LESSONS.length + LINKEDIN_LATEST_LESSONS.length + LINKEDIN_COLLECTION_LESSONS.length
  const categoryCounts = useMemo(() => CATEGORIES.filter(item => item !== 'All').map(item => ({ name: item, count: LESSONS.filter(lesson => lesson.category === item).length })), [])

  return (
    <section className="lia-reader" id="ai-lesson-library">
      <div className="lia-reader-hero">
        <div className="lia-reader-header">
          <div>
            <span className="lia-reader-kicker">AI engineering field notes · expanded library</span>
            <h3>AI Architecture Blog Lessons</h3>
            <p>Turn the supplied LinkedIn ideas into readable, end-to-end engineering lessons. Explore the concept, see the architecture, choose a use case, build a project, copy the config, run the lab, and inspect the production risks.</p>
            <div className="lia-reader-actions">
              <button type="button" onClick={() => window.dispatchEvent(new CustomEvent('ai-knowledge-assistant:open', { detail: { prompt: 'Explain the most important AI engineering topics from these LinkedIn lessons.' } }))}>Ask the AI Knowledge Assistant <span aria-hidden="true">→</span></button>
              <a href="#lia-topics">Browse the latest topics <span aria-hidden="true">↓</span></a>
            </div>
          </div>
          <div className="lia-count-block"><strong>{LESSONS.length}</strong><span>complete topics</span><small>{advancedCount} expanded from the latest updates</small></div>
        </div>
        <div className="lia-library-stats"><span><strong>{CATEGORIES.length - 1}</strong> learning tracks</span><span><strong>{LESSONS.reduce((sum, item) => sum + (item.projectIdeas || []).length, 0)}</strong> project ideas</span><span><strong>{LESSONS.reduce((sum, item) => sum + (item.links || []).length, 0)}</strong> reference links</span><span><strong>100%</strong> copyable examples</span></div>
      </div>

      <nav className="lia-topic-nav" aria-label="Lesson sections">
        <a href="#lia-topics">Topic library</a><a href="#lia-path">Learning path</a><a href="#lia-featured-projects">Project builder</a>
      </nav>

      <div className="lia-tools" id="lia-topics">
        <label className="lia-search-wrap"><span aria-hidden="true">⌕</span><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search RAG, agents, APIs, FastAPI, governance, costs..." aria-label="Search AI engineering lessons" />{query && <button type="button" onClick={() => setQuery('')} aria-label="Clear search">×</button>}</label>
        <div className="lia-filters" role="tablist" aria-label="Lesson categories">
          {CATEGORIES.map(item => <button type="button" key={item} role="tab" aria-selected={category === item} className={category === item ? 'active' : ''} onClick={() => { setCategory(item); setShowAll(true) }}>{item}</button>)}
        </div>
      </div>

      <div className="lia-category-summary" aria-label="Topic counts">{categoryCounts.map(item => <button type="button" key={item.name} onClick={() => { setCategory(item.name); setShowAll(true) }}><span>{item.name}</span><strong>{item.count}</strong></button>)}</div>

      <div className="lia-results-bar"><span>{filteredLessons.length} topics available</span><span>{query ? `Matching “${query}”` : category === 'All' ? 'All learning tracks' : category}</span></div>

      {visibleLessons.length === 0 ? <p className="lia-empty">No lessons match your search.</p> : <div className="lia-grid">{visibleLessons.map((lesson, index) => {
        const accent = CATEGORY_ACCENTS[lesson.category] || 'cyan'
        return <article className={`lia-card lia-card-${accent}`} key={lesson.id}>
          <div className="lia-card-topline"><span>{String(index + 1).padStart(2, '0')} · {lesson.category}</span><span>{lesson.tags.slice(0, 2).join(' · ')}</span></div>
          <h4>{lesson.title}</h4><p>{lesson.excerpt}</p>
          <div className="lia-card-tags">{lesson.tags.slice(0, 4).map(tag => <span key={tag}>{tag}</span>)}</div>
          <div className="lia-card-meta"><span>{lesson.concepts.length} concepts</span><span>{(lesson.projectIdeas || []).length} projects</span><span>{(lesson.links || []).length} links</span></div>
          <button type="button" className="lia-read" onClick={() => setSelectedLesson(lesson)}>Open complete lesson <span aria-hidden="true">→</span></button>
        </article>
      })}</div>}

      {!showAll && filteredLessons.length > visibleLessons.length && <button type="button" className="lia-show-more" onClick={() => setShowAll(true)}>Show all {filteredLessons.length} topics <span>↓</span></button>}

      <section className="lia-learning-path" id="lia-path"><div><span className="lia-section-kicker">Recommended order</span><h3>Build your capability in layers</h3><p>Use the lessons as a progression instead of reading randomly. Each layer gives you a project boundary and a production question to answer.</p></div><div className="lia-path-grid"><button type="button" onClick={() => { setCategory('Agent foundations'); setShowAll(true) }}><b>01</b><strong>Understand the parts</strong><span>LLMs, RAG, tools, MCP, memory</span></button><button type="button" onClick={() => { setCategory('Retrieval engineering'); setShowAll(true) }}><b>02</b><strong>Ground the answers</strong><span>Retrieval, structure, evidence, evals</span></button><button type="button" onClick={() => { setCategory('Production engineering'); setShowAll(true) }}><b>03</b><strong>Control execution</strong><span>State, permissions, tools, recovery</span></button><button type="button" onClick={() => { setCategory('Operations and evaluation'); setShowAll(true) }}><b>04</b><strong>Operate the system</strong><span>Tracing, cost, release, governance</span></button></div></section>

      <section className="lia-featured-projects" id="lia-featured-projects"><div className="lia-section-heading"><div><span className="lia-section-kicker">Portfolio builder</span><h3>End-to-end project tracks</h3></div><span className="lia-section-hint">Use these to turn reading into proof of skill</span></div><div className="lia-featured-grid"><div><span>PROJECT A · RAG</span><h4>Auditable document assistant</h4><p>Ingest documents, preserve structure, retrieve evidence, cite pages, evaluate answers, and expose a FastAPI endpoint.</p></div><div><span>PROJECT B · AGENT</span><h4>Approval-gated support agent</h4><p>Combine memory, retrieval, typed tools, policy checks, human approvals, traces, and a cost budget.</p></div><div><span>PROJECT C · PLATFORM</span><h4>Multi-model AI gateway</h4><p>Route requests by risk, latency, and cost; add fallbacks, caching, queues, metrics, and release gates.</p></div></div></section>

      {selectedLesson && <LessonArticle lesson={selectedLesson} onClose={() => setSelectedLesson(null)} onSelectLesson={setSelectedLesson} />}
    </section>
  )
}
