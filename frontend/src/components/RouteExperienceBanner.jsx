import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const VISUALS = {
  ai: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1600&q=85',
  code: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1600&q=85',
  data: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=85',
  cloud: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=85',
  security: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1600&q=85',
  web: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1600&q=85',
  hardware: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=85',
  books: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=1600&q=85',
  news: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1600&q=85',
}

const ROUTE_GUIDES = {
  '/images': { icon: '🖼️', eyebrow: 'Visual reference workspace', title: 'Images & Documents Gallery', summary: 'Inspect architecture diagrams, screenshots, notebooks, PDFs, and source documents in one searchable visual workspace.', type: 'data', points: ['Browse local and scanned reference files', 'Preview images, notebooks, HTML, PDFs, and documents', 'Use filters and full-screen navigation to compare evidence'], official: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img', video: 'https://www.youtube.com/results?search_query=technical+architecture+diagram+walkthrough' },
  '/files': { icon: '📂', eyebrow: 'Knowledge asset browser', title: 'File Reference', summary: 'Find the source files behind the hub, inspect their formats, and open the original artifact when you need full fidelity.', type: 'data', points: ['Search by file name, type, and category', 'Open source artifacts in their native format', 'Use the manifest as a repeatable local reference index'], official: 'https://developer.mozilla.org/en-US/docs/Web/API/File_API', video: 'https://www.youtube.com/results?search_query=developer+documentation+file+organization' },
  '/knowledge': { icon: '📐', eyebrow: 'Architecture reference', title: 'Knowledge Base', summary: 'Study the core patterns, protocols, and system decisions that connect AI concepts to deployable engineering systems.', type: 'ai', points: ['Compare architecture patterns', 'Open detailed rows and examples', 'Trace concepts from model to production'], official: 'https://www.nist.gov/artificial-intelligence', video: 'https://www.youtube.com/results?search_query=AI+system+architecture+production+walkthrough' },
  '/jobs': { icon: '💼', eyebrow: 'Career intelligence', title: 'AI Jobs', summary: 'Explore AI engineering roles, skills, responsibilities, and project signals that map learning to real hiring requirements.', type: 'code', points: ['Filter roles and technologies', 'Compare responsibilities and requirements', 'Turn job signals into portfolio projects'], official: 'https://roadmap.sh/ai-engineer', video: 'https://www.youtube.com/results?search_query=AI+engineer+career+roadmap+2026' },
  '/edureka': { icon: '📚', eyebrow: 'Course and document library', title: 'Edureka AI Docs', summary: 'Navigate curated learning documents and course references with direct access to the original source material.', type: 'books', points: ['Read structured course content', 'Open canonical documents', 'Connect tutorials to project work'], official: 'https://www.edureka.co/blog', video: 'https://www.youtube.com/results?search_query=Edureka+AI+course+learning' },
  '/ai-news': { icon: '📡', eyebrow: 'Research and market signal', title: 'AI News Dashboard', summary: 'Track AI news, tools, repositories, cloud platforms, and market changes from one organized dashboard.', type: 'news', points: ['Scan sources by category', 'Open original articles and repositories', 'Separate durable technical signals from short-lived hype'], official: 'https://www.deeplearning.ai/the-batch', video: 'https://www.youtube.com/results?search_query=AI+news+research+weekly+briefing' },
  '/live-news': { icon: '🔴', eyebrow: 'Live source monitor', title: 'Live News Fetcher', summary: 'Refresh current AI and technology feeds, then inspect source links and timestamps without leaving the workspace.', type: 'news', points: ['Fetch current RSS content', 'Filter by source and topic', 'Open the original publisher page for context'], official: 'https://www.rssboard.org/rss-specification', video: 'https://www.youtube.com/results?search_query=RSS+feed+reader+developer+tutorial' },
  '/ai-tools': { icon: '🤖', eyebrow: 'Tool discovery catalog', title: 'AI Tools Catalog', summary: 'Compare AI tools by category, capability, and practical use case before adding them to a workflow or stack.', type: 'ai', points: ['Search tools by job to be done', 'Compare categories and implementation paths', 'Prefer documented, testable tools over novelty'], official: 'https://huggingface.co/models', video: 'https://www.youtube.com/results?search_query=best+AI+developer+tools+workflow' },
  '/github-repos': { icon: '📦', eyebrow: 'Open-source intelligence', title: 'GitHub Repositories', summary: 'Study real codebases, frameworks, and project structures to understand how production ideas are implemented in the open.', type: 'code', points: ['Search repositories by technology', 'Inspect project structure and documentation', 'Use repositories as study references, not copy-paste dependencies'], official: 'https://docs.github.com/en/repositories', video: 'https://www.youtube.com/results?search_query=how+to+study+open+source+GitHub+repositories' },
  '/tools': { icon: '🛠️', eyebrow: 'Developer utility shelf', title: 'Developer Tools', summary: 'Explore focused utilities that support research, automation, coding, and day-to-day engineering work.', type: 'code', points: ['Match each tool to a specific workflow', 'Check source, license, and maintenance status', 'Keep repeatable commands documented'], official: 'https://github.com/awesome-selfhosted/awesome-selfhosted', video: 'https://www.youtube.com/results?search_query=developer+productivity+tools+workflow' },
  '/open-alternatives': { icon: '🔓', eyebrow: 'Open-source comparison', title: 'Open Alternatives', summary: 'Find open and self-hostable alternatives to popular products, then compare control, cost, capability, and operational effort.', type: 'security', points: ['Compare hosted and self-hosted trade-offs', 'Check licensing and community health', 'Prototype alternatives before migrating'], official: 'https://openalternative.co', video: 'https://www.youtube.com/results?search_query=open+source+software+alternatives+guide' },
  '/integrations': { icon: '🔌', eyebrow: 'Service integration catalog', title: 'Web Integrations', summary: 'Map third-party services to the application capabilities they provide, with links and implementation context.', type: 'cloud', points: ['Discover providers by capability', 'Review setup and credential requirements', 'Design integrations behind replaceable adapters'], official: 'https://12factor.net/config', video: 'https://www.youtube.com/results?search_query=API+integration+architecture+best+practices' },
  '/books': { icon: '📚', eyebrow: 'Long-form learning library', title: 'Book Catalog', summary: 'Build a durable reading list across AI, software engineering, business, and personal development with searchable metadata.', type: 'books', points: ['Search titles and authors', 'Use ratings as a starting signal, not a verdict', 'Convert important chapters into implementation notes'], official: 'https://www.goodreads.com', video: 'https://www.youtube.com/results?search_query=best+AI+engineering+books+software+architecture' },
  '/playbook': { icon: '📖', eyebrow: 'Production engineering manual', title: 'AI Engineering Playbook', summary: 'Read a structured collection of architecture, reliability, safety, and delivery guidance for AI systems.', type: 'ai', points: ['Move from concept to production sequence', 'Use the table of contents to navigate chapters', 'Keep the original source available for updates'], official: 'https://github.com', video: 'https://www.youtube.com/results?search_query=production+AI+engineering+playbook' },
  '/rapid-fire': { icon: '⚡', eyebrow: 'Fast revision workspace', title: 'Rapid Fire Playbook', summary: 'Review high-signal AI engineering questions and answers designed for interviews, design reviews, and spaced repetition.', type: 'code', points: ['Reveal concise answers quickly', 'Use cards to identify knowledge gaps', 'Open the full treatment when a topic needs depth'], official: 'https://roadmap.sh/ai-engineer', video: 'https://www.youtube.com/results?search_query=AI+engineering+interview+questions+system+design' },
  '/ai-stack': { icon: '🧠', eyebrow: 'Technology selection map', title: 'AI Stack', summary: 'Compare the tools and services that form a modern AI application from model provider to observability and deployment.', type: 'ai', points: ['Filter by capability', 'Compare implementation roles', 'Select a minimal stack before adding complexity'], official: 'https://landscape.cncf.io', video: 'https://www.youtube.com/results?search_query=modern+AI+application+technology+stack' },
  '/claude-cert': { icon: '📜', eyebrow: 'Certification preparation', title: 'Claude Certification', summary: 'Study Claude concepts, provider guidance, supporting tools, and practical exercises in a focused certification workspace.', type: 'ai', points: ['Review model and prompting concepts', 'Connect study topics to implementation', 'Use current provider documentation for API details'], official: 'https://docs.anthropic.com', video: 'https://www.youtube.com/results?search_query=Anthropic+Claude+API+tutorial+certification' },
  '/snowflake': { icon: '❄️', eyebrow: 'Cloud data engineering', title: 'Snowflake Learning Guide', summary: 'Learn Snowflake architecture, SQL, loading, transformation, security, performance, and certification paths through practical references.', type: 'data', points: ['Understand warehouses, databases, and schemas', 'Practice loading and transforming data', 'Measure cost, performance, and governance'], official: 'https://docs.snowflake.com', video: 'https://www.youtube.com/results?search_query=Snowflake+data+engineering+complete+tutorial' },
  '/etl-guide': { icon: '📊', eyebrow: 'Data pipeline engineering', title: 'ETL & Data Engineering Guide', summary: 'Design reliable data movement, transformation, orchestration, quality checks, and warehouse workflows.', type: 'data', points: ['Model source-to-target flows', 'Add data quality and lineage', 'Build for retries, backfills, and observability'], official: 'https://airflow.apache.org/docs', video: 'https://www.youtube.com/results?search_query=modern+ETL+data+engineering+pipeline+tutorial' },
  '/ai-jobs-global': { icon: '🌍', eyebrow: 'Global market intelligence', title: 'AI Jobs Global', summary: 'Compare AI roles across countries, companies, technologies, and salary signals to guide your learning and job search.', type: 'cloud', points: ['Search the global role catalog', 'Compare technology requirements', 'Use market data to prioritize projects'], official: 'https://www.weforum.org/reports/future-of-jobs-report-2025', video: 'https://www.youtube.com/results?search_query=global+AI+engineering+job+market+skills' },
  '/projects': { icon: '🗂️', eyebrow: 'Build portfolio projects', title: 'All Projects', summary: 'Choose an end-to-end project and inspect its architecture, files, implementation phases, and supporting references.', type: 'code', points: ['Start from a user outcome', 'Build an observable vertical slice', 'Document trade-offs and deployment decisions'], official: 'https://12factor.net', video: 'https://www.youtube.com/results?search_query=end+to+end+AI+project+architecture+tutorial' },
  '/project': { icon: '🚀', eyebrow: 'Project implementation workspace', title: 'Project Detail', summary: 'Inspect the project goal, architecture, assets, implementation files, and next steps from a single working view.', type: 'code', points: ['Understand the user outcome first', 'Inspect architecture and source files', 'Use the project as a portfolio-quality build artifact'], official: 'https://12factor.net', video: 'https://www.youtube.com/results?search_query=AI+project+architecture+implementation+tutorial' },
  '/job-project': { icon: '💼', eyebrow: 'Career project builder', title: 'Job-to-Project Workspace', summary: 'Turn a target AI role into a demonstrable project with architecture, implementation milestones, and measurable outcomes.', type: 'code', points: ['Map role requirements to a build', 'Show production engineering judgment', 'Document tests, deployment, and trade-offs'], official: 'https://roadmap.sh/ai-engineer', video: 'https://www.youtube.com/results?search_query=AI+engineer+portfolio+project+tutorial' },
  '/linked-posts': { icon: '🔗', eyebrow: 'Social learning archive', title: 'AI LinkedIn Posts', summary: 'Turn short-form AI engineering ideas into deeper blog lessons with scenarios, code, configurations, and source links.', type: 'ai', points: ['Read the original idea', 'Open the expanded technical lesson', 'Translate the post into a reproducible experiment'], official: 'https://www.linkedin.com', video: 'https://www.youtube.com/results?search_query=AI+engineering+production+lessons' },
  '/python-masterhub': { icon: '🐍', eyebrow: 'Interactive curriculum', title: 'Python MasterHub', summary: 'Move from Python fundamentals to advanced AI, quantum, IoT, semiconductor, API, and systems engineering topics.', type: 'code', points: ['Search topics and code labs', 'Open long-form lessons from every topic', 'Practice with runnable examples'], official: 'https://docs.python.org/3', video: 'https://www.youtube.com/results?search_query=Python+AI+engineering+complete+roadmap' },
  '/ai-techstack-ref': { icon: '🏗️', eyebrow: 'Reference architecture', title: 'AI TechStack Reference', summary: 'Explore backend, frontend, RAG, agents, safety, evaluation, deployment, cost, security, and governance modules.', type: 'ai', points: ['Switch between technology modules', 'Open table rows for complete lessons', 'Use architecture layers to plan systems'], official: 'https://platform.openai.com/docs', video: 'https://www.youtube.com/results?search_query=AI+tech+stack+production+architecture' },
  '/reference-library': { icon: '📖', eyebrow: 'Curated reference library', title: 'Reference Library', summary: 'Browse roadmaps, tools, news sources, projects, language references, and Snowflake material as expandable learning documents.', type: 'books', points: ['Filter documents by category', 'Expand sections and open complete lessons', 'Keep links and examples close to the source'], official: 'https://developer.mozilla.org', video: 'https://www.youtube.com/results?search_query=how+to+build+a+technical+reference+library' },
  '/ai-python-masterhub-pages': { icon: '📘', eyebrow: 'Original HTML curriculum archive', title: 'AI-Python MasterHub HTML Guides', summary: 'Read every original AI, Python, RAG, agent, frontend, backend, and production engineering HTML guide in one consistent application workspace.', type: 'ai', points: ['Browse all original HTML pages', 'Filter by learning track and search by topic', 'Open the exact source page or read it in the hub'], official: 'https://docs.python.org/3/', video: 'https://www.youtube.com/results?search_query=AI+Python+engineering+master+hub' },
}

const CHAPTER_GUIDES = {
  'llm-models': ['🧠', 'Models & Providers', 'Understand model capabilities, context limits, inference behavior, and provider boundaries before building an application.', 'ai'],
  'fine-tuning-local': ['⚙️', 'Fine-Tuning & Local Deployment', 'Study adaptation, quantization, local inference, evaluation, and deployment trade-offs.', 'hardware'],
  'rag-pipeline': ['🔧', 'RAG Production Pipeline', 'Design ingestion, chunking, retrieval, reranking, generation, citations, evaluation, and operations as one system.', 'data'],
  'vector-databases': ['🗄️', 'Vector Databases & Semantic Search', 'Compare embeddings, indexing, filtering, hybrid retrieval, latency, and data lifecycle choices.', 'data'],
  'ai-agents': ['🤖', 'AI Agents & Multi-Agent Systems', 'Build bounded tool-using loops with state, permissions, memory, handoffs, and human approval.', 'ai'],
  'prompt-engineering': ['⚡', 'Prompt Engineering & Guardrails', 'Design reliable instructions, structured outputs, constraints, and adversarial tests.', 'security'],
  'python-for-ai': ['🐍', 'Python for AI Engineering', 'Use typed Python, async I/O, testing, packaging, and service boundaries for AI systems.', 'code'],
  'fastapi-ai-services': ['⚡', 'FastAPI AI Microservices', 'Create typed, observable APIs for model calls, streaming, authentication, and background work.', 'code'],
  'langchain-llamaindex': ['⛓️', 'LangChain & LlamaIndex', 'Connect framework abstractions to retrieval, tools, agents, state, and evaluation.', 'ai'],
  'react-ai-frontend': ['⚛️', 'React AI Frontends', 'Build responsive AI interfaces with streaming state, optimistic UX, errors, and trust signals.', 'web'],
  'quantum-computing': ['⚛️', 'Quantum Computing & AI', 'Explore qubits, gates, algorithms, noise, hybrid workflows, and quantum resource limits.', 'hardware'],
  'robotics-ai': ['🤖', 'Robotics & AI', 'Connect perception, planning, control, simulation, safety, and real-world hardware constraints.', 'hardware'],
  'ai-semiconductor': ['🔬', 'AI Semiconductor & Chip Design', 'Study RTL, physical design, packaging, manufacturing, reliability, and AI hardware acceleration.', 'hardware'],
  'system-design': ['🏗️', 'System Design & Architecture', 'Turn requirements into resilient, observable, secure, and evolvable system boundaries.', 'cloud'],
  'grc-compliance': ['🛡️', 'GRC Compliance', 'Map AI risks to controls, evidence, ownership, audit trails, and regulatory obligations.', 'security'],
  'observability-evals': ['📊', 'Observability, Evals & MLOps', 'Measure quality, latency, cost, drift, traces, regressions, and operational health.', 'data'],
  'security-guardrails': ['🔒', 'AI Security & Guardrails', 'Protect prompts, tools, data, identities, outputs, and execution environments.', 'security'],
  'enterprise-integration': ['🔗', 'Enterprise Integration', 'Connect AI workflows to business systems with identity, contracts, retries, and governance.', 'cloud'],
  'tools-catalog': ['🛠️', 'AI Tools Catalog', 'Choose tools by job, integration surface, trust model, cost, and operational ownership.', 'ai'],
  'project-ideas': ['💡', 'AI Project Ideas', 'Turn ideas into measurable, end-to-end projects with users, data, APIs, evaluation, and deployment.', 'code'],
  'career-resources': ['💼', 'Career Resources', 'Build evidence of engineering judgment through projects, writing, interviews, and practical systems.', 'books'],
  'ai-news-market': ['📡', 'AI News & Market Intel', 'Separate durable technical changes from hype and convert signals into learning decisions.', 'news'],
  'comprehensive-guide': ['📚', 'Reference Guide — All Tables', 'Use the complete chapter index to navigate the application’s architecture and technology references.', 'books'],
  'e2e-project': ['🚀', 'Complete End-to-End AI Project', 'Follow a full project from user problem through architecture, implementation, evaluation, and deployment.', 'code'],
  'ai-agent-architecture': ['🧠', 'AI Agent Architecture', 'Trace an agent through prompt, state, retrieval, tools, guardrails, observability, and production controls.', 'ai'],
}

const DEEP_DIVE_GUIDES = {
  rag: ['🔍', 'RAG Pipeline Deep Dive', 'Go deeper on chunking, retrieval quality, reranking, citations, evaluation, and production failure modes.', 'data'],
  agents: ['🤖', 'Agents & Multi-Agent Deep Dive', 'Study orchestration, tool use, memory, handoffs, multi-agent control, and human-in-the-loop design.', 'ai'],
  compliance: ['📋', 'GRC Compliance Deep Dive', 'Connect governance frameworks to evidence collection, risk registers, controls, and audit automation.', 'security'],
  security: ['🔐', 'AI Security & Guardrails Deep Dive', 'Explore prompt injection, PII, sandboxing, authorization, adversarial testing, and incident response.', 'security'],
}

function getGuide(pathname) {
  if (pathname.startsWith('/chapter/')) {
    const id = pathname.split('/')[2]
    const data = CHAPTER_GUIDES[id] || ['📖', 'Chapter Workspace', 'Explore this chapter as a focused technical reference with examples, diagrams, and implementation guidance.', 'ai']
    return { icon: data[0], eyebrow: 'AI Knowledge Hub chapter', title: data[1], summary: data[2], type: data[3], points: ['Read the overview and architecture first', 'Open tables, code blocks, and expandable sections', 'Use the page as a reference while building a project'], official: 'https://www.nist.gov/artificial-intelligence', video: `https://www.youtube.com/results?search_query=${encodeURIComponent(data[1] + ' tutorial')}` }
  }
  if (pathname.startsWith('/deep-dive/')) {
    const id = pathname.split('/')[2]
    const data = DEEP_DIVE_GUIDES[id] || ['🔍', 'Deep Dive Workspace', 'Explore this focused topic through detailed sections and implementation references.', 'ai']
    return { icon: data[0], eyebrow: 'AI Knowledge Hub deep dive', title: data[1], summary: data[2], type: data[3], points: ['Read the detailed sections in sequence', 'Compare patterns and implementation choices', 'Use the source links for current specifications'], official: 'https://www.deeplearning.ai/short-courses', video: `https://www.youtube.com/results?search_query=${encodeURIComponent(data[1] + ' deep dive')}` }
  }
  if (ROUTE_GUIDES[pathname]) return ROUTE_GUIDES[pathname]
  const parentRoute = Object.keys(ROUTE_GUIDES).find(route => route !== '/' && pathname.startsWith(`${route}/`))
  return parentRoute ? ROUTE_GUIDES[parentRoute] : null
}

export default function RouteExperienceBanner() {
  const { pathname } = useLocation()
  const guide = getGuide(pathname)
  if (!guide || pathname === '/' || pathname === '/ai-tech-blogs' || pathname === '/books' || pathname.startsWith('/book/ol/') || pathname.startsWith('/ai-python-masterhub-pages/')) return null

  const image = VISUALS[guide.type] || VISUALS.ai
  return (
    <section className="route-guide" style={{ '--route-accent': `var(--accent-${guide.type === 'hardware' ? 'teal' : guide.type === 'books' ? 'purple' : guide.type === 'news' ? 'yellow' : guide.type === 'security' ? 'pink' : guide.type === 'cloud' ? 'blue' : guide.type === 'web' ? 'green' : 'blue'})`, '--route-image': `url(${image})` }}>
      <div className="route-guide-media" aria-hidden="true" />
      <div className="route-guide-content">
        <div className="route-guide-kicker"><span>{guide.icon}</span>{guide.eyebrow}</div>
        <h2>{guide.title}</h2>
        <p>{guide.summary}</p>
        <div className="route-guide-points">{guide.points.map(point => <span key={point}>✓ {point}</span>)}</div>
        <div className="route-guide-actions">
          <a href={guide.official} target="_blank" rel="noreferrer">Official reference ↗</a>
          <a href={guide.video} target="_blank" rel="noreferrer">Watch tutorials ↗</a>
          <a href="#page-content">Explore this page ↓</a>
        </div>
      </div>
    </section>
  )
}
