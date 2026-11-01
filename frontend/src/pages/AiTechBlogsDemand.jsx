import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  BLOG_HUB_SOURCES,
  TECH_STACK_MATRIX,
  DEMAND_SECTIONS,
  READING_ROADMAP,
  FREE_COURSE_PAIRINGS,
  RISK_TRADEOFFS,
  PRACTICAL_LABS,
} from '../data/aiTechBlogsDemandData'
import FetchButton from '../components/FetchButton'
import { useLang } from '../i18n'
import './AiTechBlogsDemand.css'

const VISUALS = {
  ai: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1400&q=80',
  ml: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=1400&q=80',
  deep: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=80',
  code: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1400&q=80',
  data: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=80',
  cloud: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1400&q=80',
  security: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1400&q=80',
  web: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1400&q=80',
}

const SOURCE_URLS = {
  'MCP GitHub': 'https://github.com/modelcontextprotocol',
  'Anthropic Safety': 'https://www.anthropic.com/research',
  'LangSmith Docs': 'https://docs.smith.langchain.com',
  'Made With ML': 'https://madewithml.com',
  'Spring Blog': 'https://spring.io/blog',
  Baeldung: 'https://www.baeldung.com',
  LearnOpenGL: 'https://learnopengl.com',
  'Pygame Docs': 'https://www.pygame.org/docs',
  'Kent C. Dodds': 'https://kentcdodds.com/blog',
}

const CODE_BY_TOPIC = {
  rag: `from dataclasses import dataclass\n\n@dataclass\nclass Document:\n    text: str\n    source: str\n\ndef retrieve(query: str, documents: list[Document], top_k: int = 3):\n    terms = set(query.lower().split())\n    ranked = sorted(\n        documents,\n        key=lambda doc: sum(term in doc.text.lower() for term in terms),\n        reverse=True,\n    )\n    return ranked[:top_k]\n\nknowledge = [\n    Document('Use retries for HTTP 429 responses.', 'runbook.md'),\n    Document('Use a circuit breaker when a dependency is unavailable.', 'reliability.md'),\n]\nfor item in retrieve('how do we handle HTTP 429', knowledge):\n    print(item.source, item.text)`,
  agent: `from dataclasses import dataclass, field\n\n@dataclass\nclass AgentState:\n    goal: str\n    steps: list[str] = field(default_factory=list)\n    max_steps: int = 4\n\ndef run_agent(state: AgentState):\n    while len(state.steps) < state.max_steps:\n        if state.goal.startswith('lookup:'):\n            state.steps.append('read_only_lookup')\n            return {'status': 'complete', 'steps': state.steps}\n        state.steps.append('request_human_approval')\n        return {'status': 'paused', 'steps': state.steps}\n\nprint(run_agent(AgentState('lookup: incident-123')))`,
  api: `from fastapi import FastAPI\nfrom pydantic import BaseModel, Field\n\napp = FastAPI(title='Learning API')\n\nclass AskRequest(BaseModel):\n    question: str = Field(min_length=1, max_length=2000)\n\n@app.post('/ask')\ndef ask(body: AskRequest):\n    return {\n        'answer': 'Replace this deterministic stub with your provider call.',\n        'question': body.question,\n        'trace_id': 'local-demo-001',\n    }\n\n# Run: uvicorn app:app --reload`,
  python: `from pathlib import Path\n\nproject = Path('notes')\nproject.mkdir(exist_ok=True)\n(project / 'lesson.txt').write_text(\n    'Keep I/O, validation, and business logic separate.\\n',\n    encoding='utf-8',\n)\nprint((project / 'lesson.txt').read_text(encoding='utf-8'))`,
  web: `import React, { useEffect, useState } from 'react'\n\nexport default function StatusCard() {\n  const [status, setStatus] = useState('loading')\n\n  useEffect(() => {\n    fetch('/api/health')\n      .then(response => response.json())\n      .then(data => setStatus(data.status))\n      .catch(() => setStatus('unavailable'))\n  }, [])\n\n  return <strong>Service status: {status}</strong>\n}`,
}

function categoryKey(value = '') {
  const text = value.toLowerCase()
  if (text.includes('security') || text.includes('guardrail') || text.includes('govern')) return 'security'
  if (text.includes('cloud') || text.includes('devops') || text.includes('mlops')) return 'cloud'
  if (text.includes('web') || text.includes('react') || text.includes('next')) return 'web'
  if (text.includes('python') || text.includes('fastapi') || text.includes('spring') || text.includes('code')) return 'code'
  if (text.includes('data') || text.includes('rag') || text.includes('embedding') || text.includes('vector')) return 'data'
  if (text.includes('deep')) return 'deep'
  if (text.includes('machine') || text.includes('ml')) return 'ml'
  return 'ai'
}

function visualFor(value) {
  return VISUALS[categoryKey(value)] || VISUALS.ai
}

function sourceUrl(name) {
  return BLOG_HUB_SOURCES.find(item => item.name === name)?.url || SOURCE_URLS[name] || null
}

function linksFor(names = []) {
  return names.map(name => ({ name, url: sourceUrl(name) })).filter(item => item.url)
}

function codeFor(title = '', category = '') {
  const value = `${title} ${category}`.toLowerCase()
  if (value.includes('rag') || value.includes('embedding') || value.includes('vector')) return CODE_BY_TOPIC.rag
  if (value.includes('agent') || value.includes('mcp') || value.includes('orchestration')) return CODE_BY_TOPIC.agent
  if (value.includes('react') || value.includes('next') || value.includes('web')) return CODE_BY_TOPIC.web
  if (value.includes('python') || value.includes('fastapi') || value.includes('api')) return value.includes('fastapi') || value.includes('api') ? CODE_BY_TOPIC.api : CODE_BY_TOPIC.python
  return CODE_BY_TOPIC.agent
}

function article({ title, eyebrow, summary, category, points, scenario, steps, setup, code, links = [], output, mistakes, image }) {
  return {
    title,
    eyebrow,
    summary,
    category,
    points,
    scenario,
    steps,
    setup,
    code,
    links,
    output,
    mistakes,
    image: image || visualFor(`${title} ${category}`),
  }
}

function sourceArticle(item) {
  return article({
    title: item.name,
    eyebrow: `${item.category} · ${item.technology}`,
    summary: `${item.name} is a focused learning source for ${item.technology}. Use this page to understand what to read first, what to build alongside it, and how to validate the ideas in a real system.`,
    category: item.category,
    points: [
      item.focus,
      item.why,
      'Prefer the source documentation for current APIs, version changes, limits, and security behavior.',
      'Pair reading with a small reproducible experiment and keep the result in version control.',
    ],
    scenario: `A team is building a ${item.technology} feature and needs a dependable path from concept to implementation. Start with one narrow use case, read the source material for the contract and constraints, then prove the behavior with a small test before introducing framework abstractions.`,
    steps: [
      `Open the source and identify the canonical beginner or architecture guide for ${item.technology}.`,
      'Write down the input, output, state, failure modes, and operational limits described by the source.',
      'Implement a minimal local example with one observable success path and one deliberate failure path.',
      'Add a test, a short README, and a production decision record before scaling the pattern.',
    ],
    setup: 'Python 3.10+ for the starter example. Replace the stub with the provider or framework SDK after the contract is understood.',
    code: codeFor(item.name, item.technology),
    links: [{ name: item.name, url: item.url }],
    output: 'A small, testable proof that connects the source material to an implementation decision.',
    mistakes: ['Copying a tutorial without checking version-specific behavior.', 'Treating a blog opinion as an API contract.', 'Skipping evaluation, access control, or cost measurements.'],
  })
}

function stackArticle(row) {
  const links = linksFor(row.sources)
  return article({
    title: `${row.category}: a practical learning path`,
    eyebrow: `Technology stack · ${row.technologies}`,
    summary: `This stack area connects ${row.technologies} to the engineering outcomes that matter: ${row.use}.`,
    category: row.category,
    points: [
      `Core technologies: ${row.technologies}.`,
      `Primary engineering outcome: ${row.use}.`,
      'Learn the underlying protocol or runtime before selecting a framework wrapper.',
      'Keep provider calls behind typed interfaces so the rest of the application remains testable.',
    ],
    scenario: `A product team needs to deliver ${row.use.toLowerCase()} while keeping the system observable and replaceable. The practical approach is to choose one reference implementation, expose a narrow internal interface, and measure latency, quality, cost, and failure recovery.`,
    steps: [
      'Choose one reference implementation from the recommended hubs.',
      'Build a local happy-path example and record the expected output.',
      'Add input validation, timeouts, structured logs, and a deterministic test seam.',
      'Compare a second implementation only after the first path has measurable behavior.',
    ],
    setup: 'Install only the runtime needed for the first experiment. Keep secrets in environment variables and pin versions in a lockfile.',
    code: codeFor(row.category, row.technologies),
    links,
    output: 'A bounded reference implementation that can be extended into a service or portfolio project.',
    mistakes: ['Choosing tools by popularity without defining the workload.', 'Mixing framework and business logic.', 'Measuring only model output while ignoring system latency and spend.'],
  })
}

function demandArticle(section, row, index) {
  return article({
    title: `${row[0]}: turning a market signal into a build plan`,
    eyebrow: `${section.name} · demand view ${index + 1}`,
    summary: `${row[0]} is shown as ${row[1]} in this dataset, with the signal ${row[2]}. Treat that as directional evidence and validate it against current role descriptions and the work you want to perform.`,
    category: section.name,
    points: [
      `Demand label: ${row[1]}.`,
      `Observed signal: ${row[2]}.`,
      `Typical context: ${row[3]}.`,
      'A credible portfolio artifact is stronger than a list of tools: show decisions, tests, deployment, and measured outcomes.',
    ],
    scenario: `You are preparing for a role involving ${row[0]}. Build a small system that demonstrates the context in which teams actually use it: ${row[3]}. Include a README with architecture, trade-offs, test evidence, and a short operational checklist.`,
    steps: [
      `Read five current job descriptions that mention ${row[0]} and extract recurring responsibilities.`,
      'Select one responsibility that can be demonstrated without proprietary data.',
      'Build the smallest end-to-end artifact with tests and a local run command.',
      'Explain one trade-off and one failure mode in the project documentation.',
    ],
    setup: 'Use the runtime that matches the selected artifact. The starter below is intentionally dependency-light so the design can be tested first.',
    code: codeFor(row[0], section.name),
    output: `A portfolio-ready starter showing how ${row[0]} supports ${row[3]}.`,
    mistakes: ['Treating a percentage as a guarantee.', 'Building a disconnected demo instead of a user workflow.', 'Leaving deployment, security, and testing unexplained.'],
  })
}

function roadmapArticle([week, title, outcome], index) {
  return article({
    title: `${week}: ${title}`,
    eyebrow: `Learning roadmap · milestone ${index + 1}`,
    summary: `This milestone turns ${title.toLowerCase()} into a concrete artifact. The exit outcome is: ${outcome}`,
    category: 'Learning roadmap',
    points: [
      `Target capability: ${title}.`,
      `Exit artifact: ${outcome}.`,
      'Keep the scope narrow enough to finish, test, and explain in one sitting.',
      'Record what failed and what you changed; that becomes part of the learning evidence.',
    ],
    scenario: `You have one week to demonstrate ${title.toLowerCase()} to a teammate. A good result is not a large application; it is a small workflow that runs locally, exposes its assumptions, and has a clear next improvement.`,
    steps: [
      'Write a one-paragraph problem statement and define the input/output contract.',
      'Implement the happy path using the smallest useful dependency set.',
      'Add one failure test, one logging statement, and one reproducible run command.',
      'Publish the artifact with a diagram, screenshot, or captured output.',
    ],
    setup: 'Create a fresh virtual environment or Node project for this milestone. Pin dependencies and keep secrets out of source control.',
    code: codeFor(title, 'roadmap'),
    output: outcome,
    mistakes: ['Consuming more tutorials than building.', 'Expanding scope before the exit artifact works.', 'Skipping written explanations and verification.'],
  })
}

function pairingArticle([topic, source, outcome]) {
  return article({
    title: `${topic}: pair reading with a build`,
    eyebrow: `Course pairing · ${source}`,
    summary: `${source} gives the learning material; this page turns it into a small implementation plan for ${topic}.`,
    category: topic,
    points: [
      `Learning source: ${source}.`,
      `Expected outcome: ${outcome}.`,
      'Use the course for vocabulary and sequence, then implement the same idea with your own data or workflow.',
      'Finish with a short evaluation rather than stopping when the tutorial runs once.',
    ],
    scenario: `A learner completes the ${topic} material but cannot yet explain the production boundary. Build a focused example, add one operational constraint, and document where the tutorial pattern must change for real users.`,
    steps: ['Complete one source module.', 'Rebuild the example from an empty folder.', 'Add a realistic input and a failure case.', 'Measure or inspect the output and write the next improvement.'],
    setup: 'Use the source-listed runtime and keep the first project local. Add a `.env.example` only when a provider key is genuinely required.',
    code: codeFor(topic, source),
    links: linksFor([source]),
    output: outcome,
    mistakes: ['Following the course passively.', 'Using production credentials in a tutorial.', 'Not checking whether the example still matches the current library version.'],
  })
}

function riskArticle([risk, detail, mitigation]) {
  return article({
    title: risk,
    eyebrow: 'Architecture risk and mitigation',
    summary: detail,
    category: 'Production decision',
    points: [
      detail,
      `Recommended control: ${mitigation}`,
      'Make the decision explicit in an architecture record with an owner and review date.',
      'Test the failure mode before relying on the happy path.',
    ],
    scenario: `During a production review, the team discovers the risk: ${risk.toLowerCase()}. The right response is to define a bounded control, make it observable, and decide what happens when the control fails.`,
    steps: ['Describe the failure in one concrete incident scenario.', 'Add the smallest control that reduces blast radius.', 'Expose a metric or log for the control.', 'Run a failure drill and record the result.'],
    setup: 'No external package is required for the policy example. Integrate the same rule into your gateway, worker, or deployment pipeline after testing it locally.',
    code: `POLICY = {\n    'risk': '${risk}',\n    'control': '${mitigation.replaceAll("'", "\\'")}',\n    'review_required': True,\n}\n\ndef check_policy(event: dict) -> dict:\n    return {\n        'allowed': not event.get('destructive', False) or event.get('approved', False),\n        'policy': POLICY['risk'],\n        'control': POLICY['control'],\n    }\n\nprint(check_policy({'destructive': True, 'approved': False}))`,
    output: 'A deterministic policy decision that can be tested before an AI system is allowed to act.',
    mistakes: ['Writing a policy that nobody can enforce.', 'Logging sensitive payloads while trying to improve observability.', 'Assuming a single control removes all residual risk.'],
  })
}

function labArticle(lab) {
  return article({
    title: lab.title,
    eyebrow: `Practical lab · ${lab.language}`,
    summary: `A runnable starter for ${lab.title}. Use it to understand the control flow before adding provider credentials, persistence, or deployment.`,
    category: 'Hands-on lab',
    points: [lab.setup, 'Run the example locally, inspect the output, then add one test and one failure path.', 'Treat this as a teaching scaffold, not a production-ready service.'],
    scenario: `A team needs to validate the core behavior of ${lab.title.toLowerCase()} before committing to a larger architecture. This lab makes the behavior visible and easy to change.`,
    steps: ['Create a clean folder and install the listed setup.', 'Copy the code into the indicated file.', 'Run it and compare the result with the expected outcome.', 'Add validation, tracing, and a negative test before extending it.'],
    setup: lab.setup,
    code: lab.code,
    output: lab.outcome,
    mistakes: ['Pasting the starter into production unchanged.', 'Skipping dependency and secret management.', 'Not checking failure behavior or resource limits.'],
  })
}

function CopyButton({ value }) {
  const [copied, setCopied] = useState(false)
  async function copy() {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1300)
    } catch {
      setCopied(false)
    }
  }
  return <button type="button" className="atbd-copy" onClick={copy}>{copied ? 'Copied' : 'Copy code'}</button>
}

function SectionHeader({ eyebrow, title, text }) {
  return <div className="atbd-section-head"><span>{eyebrow}</span><h2>{title}</h2>{text && <p>{text}</p>}</div>
}

function DetailDialog({ detail, onClose }) {
  useEffect(() => {
    const onKeyDown = event => { if (event.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKeyDown); document.body.style.overflow = '' }
  }, [onClose])

  return (
    <div className="atbd-dialog-backdrop" role="presentation" onMouseDown={onClose}>
      <article className="atbd-dialog" role="dialog" aria-modal="true" aria-labelledby="atbd-dialog-title" onMouseDown={event => event.stopPropagation()}>
        <div className="atbd-dialog-hero" style={{ backgroundImage: `linear-gradient(90deg, rgba(15, 17, 30, .96), rgba(15, 17, 30, .5)), url(${detail.image})` }}>
          <div><span className="atbd-dialog-kicker">{detail.eyebrow}</span><h2 id="atbd-dialog-title">{detail.title}</h2><p>{detail.summary}</p></div>
          <button type="button" className="atbd-dialog-close" onClick={onClose} aria-label="Close details">×</button>
        </div>
        <div className="atbd-dialog-body">
          <div className="atbd-dialog-columns">
            <section><h3>Important points</h3><ul>{detail.points.map(point => <li key={point}>{point}</li>)}</ul></section>
            <section><h3>Real-time scenario</h3><p>{detail.scenario}</p></section>
          </div>
          <section><h3>End-to-end implementation</h3><ol>{detail.steps.map(step => <li key={step}>{step}</li>)}</ol></section>
          <section className="atbd-dialog-code-section"><div className="atbd-code-head"><div><span>Setup</span><code>{detail.setup}</code></div><CopyButton value={detail.code} /></div><pre><code>{detail.code}</code></pre></section>
          <div className="atbd-dialog-columns">
            <section><h3>Expected result</h3><p>{detail.output}</p></section>
            <section><h3>Common mistakes</h3><ul>{detail.mistakes.map(item => <li key={item}>{item}</li>)}</ul></section>
          </div>
          {detail.links.length > 0 && <section className="atbd-dialog-links"><h3>Open the references</h3><div>{detail.links.map(link => <a key={link.name} href={link.url} target="_blank" rel="noreferrer">{link.name} ↗</a>)}</div></section>}
        </div>
      </article>
    </div>
  )
}

export default function AiTechBlogsDemand() {
  const { t } = useLang()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [activeDemand, setActiveDemand] = useState(0)
  const [selectedDetail, setSelectedDetail] = useState(null)
  const [openLab, setOpenLab] = useState(-1)

  const categories = useMemo(() => ['All', ...new Set(BLOG_HUB_SOURCES.map(item => item.category))], [])
  const filteredSources = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return BLOG_HUB_SOURCES.filter(item => {
      if (category !== 'All' && item.category !== category) return false
      return !needle || [item.category, item.technology, item.name, item.focus, item.why, item.url].join(' ').toLowerCase().includes(needle)
    })
  }, [category, query])

  const open = detail => setSelectedDetail(detail)

  return (
    <div className="atbd-page">
      <Link to="/" className="back-link">← {t('Back to Home')}</Link>
      <header className="atbd-hero">
        <div className="atbd-hero-copy">
          <span className="atbd-kicker">{t('AI / ML / Agents / Full Tech Stack')}</span>
          <div className="page-header-row">
            <h1>{t('AI Tech Blogs & Market Demand Hub')}</h1>
            <FetchButton onFetch={() => { setQuery(''); setActiveDemand(0); setSelectedDetail(null) }} label={t('Fetch Latest')} staticMode />
          </div><p>One visual, searchable reference for the blogs, documentation, courses, tools, hiring signals, trade-offs, and practical labs needed to move from learning to production.</p></div>
        <div className="atbd-hero-visual" aria-hidden="true"><div className="atbd-hero-orbit">AI</div><span>read</span><span>build</span><span>measure</span></div>
        <div className="atbd-stats"><div><strong>{BLOG_HUB_SOURCES.length}</strong><span>sources</span></div><div><strong>{TECH_STACK_MATRIX.length}</strong><span>stack areas</span></div><div><strong>{DEMAND_SECTIONS.length}</strong><span>demand views</span></div><div><strong>{PRACTICAL_LABS.length}</strong><span>labs</span></div></div>
      </header>
      <nav className="atbd-nav" aria-label="Page sections"><a href="#sources">{t('Blogs & hubs')}</a><a href="#stack">{t('Tech stack')}</a><a href="#demand">{t('Market demand')}</a><a href="#roadmap">{t('Roadmap')}</a><a href="#labs">{t('Labs')}</a><a href="#courses">{t('Courses')}</a><a href="#risks">{t('Trade-offs')}</a></nav>

      <section id="sources" className="atbd-section"><SectionHeader eyebrow="Section 1" title="Blogs, Documentation & Knowledge Hubs" text="Click any source for a complete reading-to-building guide, external links, a realistic scenario, and a runnable starter." /><div className="atbd-toolbar"><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search blogs, MCP, RAG, Python, observability..." aria-label="Search knowledge sources" /><div className="atbd-filter-row">{categories.map(item => <button key={item} type="button" className={category === item ? 'active' : ''} onClick={() => setCategory(item)}>{item}</button>)}</div></div><p className="atbd-result-count">Showing {filteredSources.length} of {BLOG_HUB_SOURCES.length} clickable sources</p><div className="atbd-source-grid">{filteredSources.map(item => <button className="atbd-source-card" key={`${item.category}-${item.name}`} type="button" onClick={() => open(sourceArticle(item))}><div className="atbd-source-image" style={{ backgroundImage: `linear-gradient(180deg, transparent, rgba(17, 17, 27, .98)), url(${visualFor(item.category)})` }} /><div className="atbd-source-content"><div className="atbd-source-top"><span>{item.category}</span><span>{item.technology}</span></div><h3>{item.name}</h3><p>{item.focus}</p><div className="atbd-source-why"><strong>Why read it:</strong> {item.why}</div><span className="atbd-open-label">Read guide + code →</span></div></button>)}</div></section>

      <section id="stack" className="atbd-section"><SectionHeader eyebrow="Section 2" title="Master Technology Stack Table" text="Click a row to see its purpose, system scenario, implementation path, source links, and a code starter." /><div className="atbd-table-wrap"><table className="atbd-table"><thead><tr><th>Category</th><th>Technologies</th><th>Recommended hubs</th><th>Use the knowledge for</th><th>Open</th></tr></thead><tbody>{TECH_STACK_MATRIX.map(row => <tr key={row.category} onClick={() => open(stackArticle(row))} tabIndex="0" onKeyDown={event => { if (event.key === 'Enter') open(stackArticle(row)) }}><td><strong>{row.category}</strong></td><td>{row.technologies}</td><td>{row.sources.join(' · ')}</td><td>{row.use}</td><td><button type="button" className="atbd-row-action" onClick={event => { event.stopPropagation(); open(stackArticle(row)) }}>Details ↗</button></td></tr>)}</tbody></table></div></section>

      <section id="demand" className="atbd-section"><SectionHeader eyebrow="Section 3" title="2026 Market Demand Analysis" text="Click a technology row to turn the signal into a realistic portfolio or interview project." /><div className="atbd-demand-tabs">{DEMAND_SECTIONS.map((section, index) => <button key={section.name} type="button" className={activeDemand === index ? 'active' : ''} onClick={() => setActiveDemand(index)}>{section.name}</button>)}</div><div className="atbd-table-wrap"><table className="atbd-table atbd-demand-table"><thead><tr><th>Rank</th><th>Tool / skill</th><th>Demand level</th><th>Signal</th><th>Context</th><th>Open</th></tr></thead><tbody>{DEMAND_SECTIONS[activeDemand].rows.map((row, index) => <tr key={row[0]} onClick={() => open(demandArticle(DEMAND_SECTIONS[activeDemand], row, index))}><td>{index + 1}</td><td><strong>{row[0]}</strong></td><td><span className={`atbd-demand-pill ${row[1].toLowerCase().replaceAll(' ', '-')}`}>{row[1]}</span></td><td>{row[2]}</td><td>{row[3]}</td><td><button type="button" className="atbd-row-action" onClick={event => { event.stopPropagation(); open(demandArticle(DEMAND_SECTIONS[activeDemand], row, index)) }}>Details ↗</button></td></tr>)}</tbody></table></div><div className="atbd-callout"><strong>Priority rule:</strong> Start with Python, SQL, TypeScript, cloud fundamentals, Docker, Git, and one AI application path. Add frameworks after you can explain the underlying architecture.</div></section>

      <section id="roadmap" className="atbd-section"><SectionHeader eyebrow="Section 4" title="12-Week Learning Roadmap" text="Every week is a clickable chapter with an exit artifact, implementation sequence, and code starter." /><div className="atbd-roadmap">{READING_ROADMAP.map((item, index) => <button type="button" key={item[0]} onClick={() => open(roadmapArticle(item, index))}><span>{item[0]}</span><div><h3>{item[1]}</h3><p>{item[2]}</p><em>Open chapter →</em></div></button>)}</div></section>

      <section id="labs" className="atbd-section"><SectionHeader eyebrow="Section 5" title="Practical Configuration & Code Labs" text="Expand a lab for a quick view or open it as a full article for the scenario, setup, code, output, and production checklist." /><div className="atbd-labs">{PRACTICAL_LABS.map((lab, index) => <article className="atbd-lab" key={lab.title}><button type="button" className="atbd-lab-head" onClick={() => setOpenLab(openLab === index ? -1 : index)}><span className="atbd-lab-number">0{index + 1}</span><span><strong>{lab.title}</strong><small>{lab.language} · {lab.setup}</small></span><span>{openLab === index ? '−' : '+'}</span></button>{openLab === index && <div className="atbd-lab-body"><div className="atbd-code-head"><span>Runnable starter</span><div><CopyButton value={lab.code} /><button type="button" className="atbd-inline-open" onClick={() => open(labArticle(lab))}>Open full lab →</button></div></div><pre><code>{lab.code}</code></pre><p><strong>Expected outcome:</strong> {lab.outcome}</p></div>}</article>)}</div></section>

      <section id="courses" className="atbd-section"><SectionHeader eyebrow="Section 6" title="Free Course Pairings" text="Click a pairing to turn a course or documentation source into a project with verification steps." /><div className="atbd-pairings">{FREE_COURSE_PAIRINGS.map(item => <button type="button" key={item[0]} onClick={() => open(pairingArticle(item))}><strong>{item[0]}</strong><span>{item[1]}</span><p>{item[2]}</p><em>Open learning plan →</em></button>)}</div></section>

      <section id="risks" className="atbd-section"><SectionHeader eyebrow="Section 7" title="Risks & Trade-offs Before You Build" text="Click any risk for a concrete incident scenario, mitigation plan, policy example, and failure checklist." /><div className="atbd-risk-grid">{RISK_TRADEOFFS.map(item => <button type="button" key={item[0]} onClick={() => open(riskArticle(item))}><h3>{item[0]}</h3><p>{item[1]}</p><div><strong>Mitigation:</strong> {item[2]}</div><em>Open risk guide →</em></button>)}</div></section>
      <footer className="atbd-footer">AI Tech Blogs &amp; Market Demand Hub · Verify current provider URLs, APIs, pricing, and hiring statistics before making decisions.</footer>
      {selectedDetail && <DetailDialog detail={selectedDetail} onClose={() => setSelectedDetail(null)} />}
    </div>
  )
}
