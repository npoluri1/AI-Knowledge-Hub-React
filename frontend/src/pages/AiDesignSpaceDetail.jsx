import React, { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { LayerStack, FlowDiagram, DiagramLegend } from '../components/DesignDiagram'
import FunctionalFlowPanel from '../components/FunctionalFlowPanel'
import ShareButtons from '../components/ShareButtons'
import DeployPanel, { ExpectedOutput } from '../components/DeployPanel'
import { useLang } from '../components/DesignLang'
import { resolveIndustry, applyCtx, getPattern, getSector, FLAGSHIP_INDUSTRIES, getProjectIdeas, countProjectIdeas, projectIdeaCode, generateFSD, fsdToMarkdown, buildRunDeploy, techForLabel, getFunctionalDomains, countFunctionalDomains, COUNTRIES, sectorForName, slugify } from '../data/aiDesignSpace'
import './AiDesignSpace.css'

export default function AiDesignSpaceDetail() {
  const { id } = useParams()
  const { t } = useLang()
  const industry = useMemo(() => resolveIndustry(id), [id])
  const [fsdOpen, setFsdOpen] = React.useState(false)

  const related = useMemo(() => {
    if (!industry) return []
    return FLAGSHIP_INDUSTRIES.filter(f => f.sector === industry.sector && f.slug !== industry.slug).slice(0, 3)
  }, [industry])

  if (!industry) {
    return (
      <div className="ads-page">
        <Link to="/design-space" className="back-link">← Back to AI Design Space</Link>
        <div className="ads-error">
          <h2>Industry not found</h2>
          <p>We couldn’t resolve “{id}”. It may not be in the 1,000+ industry index yet.</p>
          <Link to="/design-space" className="ads-btn">Browse all industries →</Link>
        </div>
      </div>
    )
  }

  const allTech = [...new Set(industry.domains.flatMap(d => d.tech))]

  return (
    <div className="ads-page">
      <Link to="/design-space" className="back-link">← Back to AI Design Space</Link>

      {/* ============ HERO ============ */}
      <section className="ads-detail-hero" style={{ '--h-grad': industry.gradient }}>
        <div className="ads-detail-hero-icon">{industry.icon}</div>
        <div className="ads-detail-hero-text">
          <div className="ads-detail-kicker">
            <span>{industry.sectorName}</span>
            {industry.flagship && <span className="ads-badge-flag">✦ FLAGSHIP BLUEPRINT</span>}
            {industry.generated && <span className="ads-badge-gen">⚙ SECTOR TEMPLATE</span>}
          </div>
          <h1>{industry.name}</h1>
          <p className="ads-detail-tagline">{industry.tagline}</p>
          <p className="ads-detail-summary">{industry.summary}</p>
          <div className="ads-detail-stats">
            <span><strong>{countFunctionalDomains(industry).toLocaleString()}+</strong> functional domains</span>
            <span><strong>HLD</strong> system layers</span>
            <span><strong>LDD</strong> component flows</span>
            <span><strong>{allTech.length}</strong> tech stack items</span>
          </div>
          <div className="ads-hero-actions" style={{ marginTop: 14 }}>
            <button type="button" className="ads-hero-btn ads-hero-btn-primary" onClick={() => setFsdOpen(true)}>📄 {t('loadFsd')}</button>
            <a href="#ads-projects" className="ads-hero-btn">💡 {t('projectIdeas')} (1000+)</a>
            <ShareButtons title={industry.name} />
          </div>
        </div>
      </section>

      {fsdOpen && <FSDModal industry={industry} onClose={() => setFsdOpen(false)} />}

      {industry.generated && (
        <div className="ads-note">
          💡 This industry uses its sector’s proven architecture (<strong>{industry.sectorName}</strong>). The same
          building blocks power every company in the sector — adapt the layers and components to your organisation’s
          scale, data and constraints.
        </div>
      )}

      {/* ============ DOMAIN NAV ============ */}
      <div className="ads-domain-nav">
        {industry.domains.map((d, i) => (
          <a href={`#ads-domain-${i}`} key={i}>{d.icon} {d.name}</a>
        ))}
      </div>

      {/* ============ FUNCTIONAL DOMAINS ============ */}
      {industry.domains.map((d, i) => {
        const pattern = getPattern(d.blueprint)
        const hldLayers = pattern ? pattern.hld.map(l => ({ ...l, desc: applyCtx(l.desc, d.ctx) })) : []
        const lddNodes = pattern ? pattern.ldd.map(n => ({ ...n, desc: applyCtx(n.desc, d.ctx) })) : []
        return (
          <section className="ads-domain" id={`ads-domain-${i}`} key={i} style={{ '--d-accent': d.patternColor || pattern?.color || '#89b4fa' }}>
            <div className="ads-domain-head">
              <span className="ads-domain-icon">{d.icon}</span>
              <div className="ads-domain-title">
                <span className="ads-domain-num">Domain {String(i + 1).padStart(2, '0')}</span>
                <h2>{d.name}</h2>
                <span className="ads-domain-pattern">{d.patternIcon} {d.patternName}</span>
              </div>
            </div>
            <p className="ads-domain-desc">{d.desc}</p>

            <div className="ads-diagram-grid">
              <div className="ads-diagram">
                <div className="ads-diagram-head">
                  <h3>🏛️ High-Level Design</h3>
                  <span>{pattern?.hldLabel || 'System layers'} · click a layer for code</span>
                </div>
                <LayerStack layers={hldLayers} accent={d.patternColor || pattern?.color} pattern={pattern} ctx={d.ctx} />
              </div>

              <div className="ads-diagram">
                <div className="ads-diagram-head">
                  <h3>🔬 Low-Level Design</h3>
                  <span>{pattern?.lddLabel || 'Component flow'} · click a block for code</span>
                </div>
                <FlowDiagram nodes={lddNodes} pattern={pattern} ctx={d.ctx} />
              </div>
            </div>

            <DiagramLegend />

            <FunctionalFlowPanel ctx={d.ctx} pattern={pattern} />

            <ExpectedOutput ctx={d.ctx} mode="ask" pattern={pattern} />

            <DeployPanel ctx={d.ctx} name={`${d.name}`} stack={d.tech.join(' · ')} />

            <div className="ads-domain-bottom">
              <div className="ads-domain-tech">
                <span className="ads-domain-label">Tech stack — click any chip for its functional flow</span>
                <div className="ads-chiprow">
                  {d.tech.map(t => {
                    const tech = techForLabel(t)
                    return tech
                      ? <Link className="ads-chip ads-chip-tech" to={`/design-space/technology/${tech.id}`} key={t} title={`${tech.name} functional flow`}>{t} ⚙</Link>
                      : <span className="ads-chip ads-chip-tech" key={t}>{t}</span>
                  })}
                </div>
              </div>
              {Array.isArray(d.notes) && d.notes.length > 0 && (
                <div className="ads-domain-notes">
                  <span className="ads-domain-label">Design notes</span>
                  <ul>
                    {d.notes.map((n, j) => <li key={j}>✔ {n}</li>)}
                  </ul>
                </div>
              )}
            </div>
          </section>
        )
      })}

      {/* ============ TECH STACK ============ */}
      <section className="ads-tech-stack">
        <div className="ads-section-head">
          <h2>🧰 Complete Tech Stack</h2>
          <p>Everything used across this industry’s designs — from the app’s available stack.</p>
        </div>
        <div className="ads-chiprow ads-tech-all">
          {allTech.map(t => <span className="ads-chip ads-chip-tech" key={t}>{t}</span>)}
        </div>
      </section>

      {/* ============ FUNCTIONAL DOMAINS (1000+) ============ */}
      <FunctionalDomainBrowser industry={industry} />

      {/* ============ RELATED ============ */}
      {related.length > 0 && (
        <section className="ads-section">
          <div className="ads-section-head">
            <h2>🔗 {t('relatedIndustries')} — {industry.sectorName}</h2>
          </div>
          <div className="ads-flagship-grid">
            {related.map(f => (
              <Link className="ads-flagship-card" to={`/design-space/${f.slug}`} key={f.slug} style={{ '--f-grad': f.gradient }}>
                <div className="ads-flagship-top" style={{ background: f.gradient }}>
                  <span className="ads-flagship-icon">{f.icon}</span>
                  <span className="ads-flagship-badge">{f.sectorName}</span>
                </div>
                <div className="ads-flagship-body">
                  <h3>{f.name}</h3>
                  <p>{f.tagline}</p>
                  <span className="ads-flagship-cta">Open design →</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ============ RELATED INDUSTRIES (shared patterns) ============ */}
      <RelatedIndustries industry={industry} />

      {/* ============ COUNTRIES IN FOCUS ============ */}
      <CountriesInFocus sectorId={industry.sector} sectorName={industry.sectorName} />

      {/* ============ PROJECT IDEAS (1000+) ============ */}
      <ProjectIdeas industry={industry} />

      <div className="ads-other-sectors">
        {getSector(industry.sector)?.patterns?.slice(0, 4).map(p => {
          const pat = getPattern(p)
          return <span key={p} title={pat?.name}>{pat?.icon} {pat?.tag}</span>
        })}
      </div>
    </div>
  )
}

// ============ RELATED INDUSTRIES (shared pattern) ============
function RelatedIndustries({ industry }) {
  const { t } = useLang()
  const patternIds = new Set(industry.domains.map(d => d.blueprint))
  const related = FLAGSHIP_INDUSTRIES
    .filter(f => f.slug !== industry.slug && f.domains.some(d => patternIds.has(d.blueprint)))
    .slice(0, 4)
  if (related.length === 0) return null
  return (
    <section className="ads-section">
      <div className="ads-section-head">
        <h2>🧩 {t('relatedIndustries')} — shared design patterns</h2>
        <p>Industries across the world built on the same architecture patterns as {industry.name}.</p>
      </div>
      <div className="ads-flagship-grid">
        {related.map(f => (
          <Link className="ads-flagship-card" to={`/design-space/${f.slug}`} key={f.slug} style={{ '--f-grad': f.gradient }}>
            <div className="ads-flagship-top" style={{ background: f.gradient }}>
              <span className="ads-flagship-icon">{f.icon}</span>
              <span className="ads-flagship-badge">{f.sectorName}</span>
            </div>
            <div className="ads-flagship-body">
              <h3>{f.name}</h3>
              <p>{f.tagline}</p>
              <span className="ads-flagship-cta">Open design →</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

// ============ COUNTRIES IN FOCUS ============
function CountriesInFocus({ sectorId, sectorName }) {
  const matches = COUNTRIES
    .map(c => ({ c, n: c.industries.split(',').map(s => s.trim()).filter(n => sectorForName(n)?.id === sectorId).length }))
    .filter(x => x.n > 0)
    .sort((a, b) => b.n - a.n)
    .slice(0, 10)
  if (matches.length === 0) return null
  return (
    <section className="ads-section">
      <div className="ads-section-head">
        <h2>🌍 Countries where {sectorName} matters most</h2>
        <p>Countries whose public &amp; private industries map to this sector — open any country for its full design set.</p>
      </div>
      <div className="ads-name-cloud">
        {matches.map(({ c }) => (
          <Link key={c.name} className="ads-chip" to={`/design-space/country/${slugify(c.name)}`}>{c.name} <small>{c.region}</small></Link>
        ))}
      </div>
    </section>
  )
}

// ============ FUNCTIONAL DOMAINS (1000+) SECTION ============
function FunctionalDomainBrowser({ industry }) {
  const [q, setQ] = useState('')
  const [page, setPage] = useState(1)
  const [openId, setOpenId] = useState(null)

  const total = useMemo(() => countFunctionalDomains(industry), [industry])
  const { domains, total: filteredTotal, pages, page: safePage } = useMemo(
    () => getFunctionalDomains(industry, { q, page, pageSize: 20 }),
    [industry, q, page]
  )

  const toggle = d => setOpenId(openId === d.id ? null : d.id)

  return (
    <section className="ads-fd-section" id="ads-domains">
      <div className="ads-section-head">
        <h2>🧩 Functional Domains — {total.toLocaleString()}+</h2>
        <p>
          {industry.domains.length} core domains × {12} operational variants × {30} functional areas =
          {' '}{total.toLocaleString()}+ implementable designs. <strong>Expand any domain</strong> to see its High-Level
          Design and Low-Level Design diagrams, tech stack and requirements.
        </p>
      </div>

      <div className="ads-toolbar">
        <input
          value={q}
          onChange={e => { setQ(e.target.value); setPage(1) }}
          placeholder={`Search ${total.toLocaleString()}+ functional domains… e.g. real-time, risk, reporting`}
          aria-label="Search functional domains"
        />
        {q && <button type="button" className="ads-clear" onClick={() => { setQ(''); setPage(1) }}>✕ Clear</button>}
      </div>
      <div className="ads-result-line">
        Showing <strong>{filteredTotal.toLocaleString()}</strong> functional domains · page {safePage} of {pages}
      </div>

      <div className="ads-fd-grid">
        {domains.map(d => (
          <article className={`ads-fd-card ${openId === d.id ? 'open' : ''}`} key={d.id} style={{ '--fd-accent': d.patternColor }}>
            <button type="button" className="ads-fd-head" onClick={() => toggle(d)}>
              <span className="ads-fd-icon">{d.icon}</span>
              <span className="ads-fd-meta">
                <strong>{d.name}</strong>
                <small>{d.domainIcon} {d.domain} · {d.patternIcon} {d.patternTag} · {d.variant}-first</small>
              </span>
              <span className="ads-fd-toggle">{openId === d.id ? '−' : '+'}</span>
            </button>
            {openId === d.id && <FDDomainDetail d={d} industry={industry} />}
          </article>
        ))}
      </div>

      {pages > 1 && (
        <div className="ads-pager">
          <button type="button" disabled={safePage <= 1} onClick={() => setPage(safePage - 1)}>← Prev</button>
          <span>{safePage} / {pages}</span>
          <button type="button" disabled={safePage >= pages} onClick={() => setPage(safePage + 1)}>Next →</button>
        </div>
      )}
    </section>
  )
}

function FDDomainDetail({ d, industry }) {
  const pattern = getPattern(d.patternId)
  if (!pattern) return <div className="ads-fd-detail"><p>{d.desc}</p></div>
  return (
    <div className="ads-fd-detail">
      <p className="ads-idea-desc">{d.desc}</p>
      <div className="ads-diagram-grid">
        <div className="ads-diagram">
          <div className="ads-diagram-head"><h3>🏛️ High-Level Design</h3><span>{pattern.hldLabel} · click a layer for code</span></div>
          <LayerStack layers={pattern.hld.map(l => ({ ...l, desc: applyCtx(l.desc, `${d.domain} ${industry.name}`) }))} accent={d.patternColor} pattern={pattern} ctx={`${d.domain} — ${industry.name}`} />
        </div>
        <div className="ads-diagram">
          <div className="ads-diagram-head"><h3>🔬 Low-Level Design</h3><span>{pattern.lddLabel} · click a block for code</span></div>
          <FlowDiagram nodes={pattern.ldd.map(n => ({ ...n, desc: applyCtx(n.desc, `${d.domain} ${industry.name}`) }))} pattern={pattern} ctx={`${d.domain} — ${industry.name}`} />
        </div>
      </div>
      <DiagramLegend />
      <FunctionalFlowPanel ctx={`${d.domain} — ${industry.name}`} pattern={pattern} />
      <ExpectedOutput ctx={`${d.domain} — ${industry.name}`} mode="ask" pattern={pattern} />
      <DeployPanel ctx={`${d.domain} — ${industry.name}`} name={d.domain} stack={d.tech.join(' · ')} />
      <div className="ads-domain-bottom">
        <div className="ads-domain-tech">
          <span className="ads-domain-label">Tech stack</span>
          <div className="ads-chiprow">
            {d.tech.map(t => {
              const tech = techForLabel(t)
              return tech
                ? <Link className="ads-chip ads-chip-tech" to={`/design-space/technology/${tech.id}`} key={t}>{t} ⚙</Link>
                : <span className="ads-chip ads-chip-tech" key={t}>{t}</span>
            })}
          </div>
        </div>
        <div className="ads-domain-notes">
          <span className="ads-domain-label">Functional requirements</span>
          <ul>{d.requirements.map((r, i) => <li key={i}>✔ {r}</li>)}</ul>
        </div>
      </div>
    </div>
  )
}

// ============ PROJECT IDEAS SECTION ============
function ProjectIdeas({ industry }) {
  const [q, setQ] = useState('')
  const [page, setPage] = useState(1)
  const [openId, setOpenId] = useState(null)
  const [activeFile, setActiveFile] = useState(null)

  const total = useMemo(() => countProjectIdeas(industry), [industry])
  const { ideas, total: filteredTotal, pages, page: safePage } = useMemo(
    () => getProjectIdeas(industry, { q, page, pageSize: 12 }),
    [industry, q, page]
  )

  const toggle = idea => {
    if (openId === idea.id) { setOpenId(null); return }
    setOpenId(idea.id)
    setActiveFile(null)
  }

  return (
    <section className="ads-projects">
      <div className="ads-section-head">
        <h2>💡 Project Ideas — {total.toLocaleString()}+</h2>
        <p>
          Every idea includes a complete project structure and starter code (FastAPI + LangGraph + {industry.sectorName} stack).
          Generated deterministically for {industry.name} from its {industry.domains.length} functional domains × 12 patterns × 30 angles.
        </p>
      </div>

      <div className="ads-toolbar">
        <input
          value={q}
          onChange={e => { setQ(e.target.value); setPage(1) }}
          placeholder={`Search ${total.toLocaleString()}+ project ideas for ${industry.name}…`}
          aria-label="Search project ideas"
        />
        {q && <button type="button" className="ads-clear" onClick={() => { setQ(''); setPage(1) }}>✕ Clear</button>}
      </div>
      <div className="ads-result-line">
        Showing <strong>{filteredTotal.toLocaleString()}</strong> ideas · page {safePage} of {pages}
      </div>

      <div className="ads-idea-grid">
        {ideas.map(idea => (
          <article className={`ads-idea ${openId === idea.id ? 'open' : ''}`} key={idea.id}>
            <button type="button" className="ads-idea-head" onClick={() => toggle(idea)}>
              <span className="ads-idea-icon">{idea.patternIcon}</span>
              <span className="ads-idea-meta">
                <strong>{idea.title}</strong>
                <small>{idea.patternTag} · {idea.variant}-first · {idea.stack[0]}</small>
              </span>
              <span className="ads-idea-toggle">{openId === idea.id ? '−' : '+'}</span>
            </button>
            {openId === idea.id && (
              <div className="ads-idea-body">
                <p className="ads-idea-desc">{idea.desc}</p>
                <IdeaBlueprint idea={idea} industry={industry} activeFile={activeFile} setActiveFile={setActiveFile} />
              </div>
            )}
          </article>
        ))}
      </div>

      {pages > 1 && (
        <div className="ads-pager">
          <button type="button" disabled={safePage <= 1} onClick={() => setPage(safePage - 1)}>← Prev</button>
          <span>{safePage} / {pages}</span>
          <button type="button" disabled={safePage >= pages} onClick={() => setPage(safePage + 1)}>Next →</button>
        </div>
      )}
    </section>
  )
}

function IdeaBlueprint({ idea, industry, activeFile, setActiveFile }) {
  const blueprint = useMemo(() => projectIdeaCode(idea, industry), [idea, industry])
  const [tab, setTab] = React.useState('files')
  const file = blueprint.files.find(f => f.path === activeFile) || blueprint.files[0]
  const deploy = useMemo(() => buildRunDeploy(industry), [industry])
  return (
    <div className="ads-blueprint">
      <div className="ads-blueprint-structure">
        <span className="ads-domain-label">Project structure</span>
        <pre className="ads-tree">{blueprint.structure.join('\n')}</pre>
      </div>
      <div className="ads-blueprint-code">
        <div className="ads-blueprint-mode-tabs">
          <button type="button" className={tab === 'files' ? 'active' : ''} onClick={() => setTab('files')}>📄 Files</button>
          <button type="button" className={tab === 'deploy' ? 'active' : ''} onClick={() => setTab('deploy')}>🚀 Build &amp; Run &amp; Deploy</button>
        </div>
        {tab === 'files' && (
          <>
            <div className="ads-blueprint-tabs">
              {blueprint.files.map(f => (
                <button
                  type="button"
                  key={f.path}
                  className={file.path === f.path ? 'active' : ''}
                  onClick={() => setActiveFile(f.path)}
                >
                  {f.path.replace('project/', '')}
                </button>
              ))}
            </div>
            <pre className="ads-code"><code>{file.code}</code></pre>
          </>
        )}
        {tab === 'deploy' && <DeployPlan deploy={deploy} />}
      </div>
    </div>
  )
}

function CodeBlock({ title, lines, lang = 'bash' }) {
  return (
    <div className="ads-codeblock">
      <span className="ads-domain-label">{title}</span>
      <pre className="ads-code"><code>{Array.isArray(lines) ? lines.join('\n') : lines}</code></pre>
    </div>
  )
}

function DeployPlan({ deploy }) {
  return (
    <div className="ads-deploy">
      <CodeBlock title="🛠️ Build" lines={deploy.build} />
      <CodeBlock title="▶️ Run locally" lines={deploy.run} />
      <CodeBlock title="☁️ Deploy" lines={deploy.deploy} />
      <CodeBlock title="🔐 Environment variables (.env.example)" lines={deploy.env} lang="env" />
      <CodeBlock title="🐳 Dockerfile" lines={deploy.dockerfile} lang="dockerfile" />
      <CodeBlock title="🐙 docker-compose.yml" lines={deploy.compose} lang="yaml" />
    </div>
  )
}

// ============ FSD MODAL ============
function FSDModal({ industry, onClose }) {
  const fsd = useMemo(() => generateFSD(industry), [industry])
  const fdTotal = useMemo(() => countFunctionalDomains(industry), [industry])
  const fdPreview = useMemo(() => getFunctionalDomains(industry, { pageSize: 60 }).domains, [industry])
  const [tab, setTab] = React.useState('overview')

  const download = () => {
    const blob = new Blob([fsdToMarkdown(fsd)], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${fsd.meta.documentId}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  const scrollTo = e => {
    e.preventDefault()
    const el = document.getElementById(e.currentTarget.dataset.target)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="ads-fsd-backdrop" onClick={onClose}>
      <div className="ads-fsd-modal" onClick={e => e.stopPropagation()}>
        <header className="ads-fsd-header">
          <div>
            <span className="ads-domain-num" style={{ color: 'var(--accent-yellow)' }}>FUNCTIONAL SPECIFICATION DOCUMENT · {fsd.meta.documentId}</span>
            <h2>{fsd.meta.title}</h2>
            <small>{fsd.meta.sector} · v{fsd.meta.version} · {fsd.meta.date}</small>
          </div>
          <div className="ads-fsd-actions">
            <button type="button" onClick={download}>⬇ Download .md</button>
            <a href="#ads-projects" onClick={e => { onClose(); document.getElementById('ads-projects')?.scrollIntoView({ behavior: 'smooth' }) }}>💡 Generate project →</a>
            <button type="button" className="ads-fsd-close" onClick={onClose}>✕</button>
          </div>
        </header>
        <div className="ads-fsd-nav">
          {[['overview', '1 · Overview'], ['objectives', '2 · Objectives'], ['scope', '3 · Scope'], ['domains', '4 · Core Domains'], ['catalog', '5 · Domain Catalog (1000+)'], ['architecture', '6 · Design Diagrams'], ['stack', '7 · Tech Stack'], ['project', '8 · Project Implementation'], ['deploy', '9 · Build, Run & Deploy'], ['acceptance', '10 · Acceptance'], ['risks', '11 · Risks']].map(([key, label]) => (
            <button type="button" key={key} className={tab === key ? 'active' : ''} onClick={() => setTab(key)}>{label}</button>
          ))}
        </div>
        <div className="ads-fsd-body">
          {tab === 'overview' && (
            <section>
              <h3>1. Overview</h3>
              <p>{fsd.overview}</p>
              <h3>2. Objectives</h3>
              <ul>{fsd.objectives.map((o, i) => <li key={i}>✔ {o}</li>)}</ul>
              <h3>Stakeholders</h3>
              <div className="ads-chiprow">{fsd.stakeholders.map(s => <span className="ads-chip" key={s}>{s}</span>)}</div>
            </section>
          )}
          {tab === 'objectives' && (
            <section>
              <h3>2. Objectives</h3>
              <ul>{fsd.objectives.map((o, i) => <li key={i}>✔ {o}</li>)}</ul>
              <h3>Stakeholders</h3>
              <div className="ads-chiprow">{fsd.stakeholders.map(s => <span className="ads-chip" key={s}>{s}</span>)}</div>
            </section>
          )}
          {tab === 'scope' && (
            <section>
              <h3>3. Scope</h3>
              <p><strong>In scope:</strong></p>
              <ul>{fsd.scope.inScope.map((s, i) => <li key={i}>✔ {s}</li>)}</ul>
              <p><strong>Out of scope:</strong></p>
              <ul>{fsd.scope.outScope.map((s, i) => <li key={i}>✕ {s}</li>)}</ul>
            </section>
          )}
          {tab === 'domains' && (
            <section>
              <h3>4. Functional Domains — requirements & workflows</h3>
              {fsd.domains.map((d, i) => (
                <div className="ads-fsd-domain" key={i}>
                  <h4>{d.icon} {d.name} <span>{d.patternTag}</span></h4>
                  <p>{d.desc}</p>
                  <p><strong>Requirements</strong></p>
                  <ul>{d.requirements.map((r, j) => <li key={j}>FR-{i + 1}-{j + 1}: {r}</li>)}</ul>
                  <p><strong>Workflow</strong></p>
                  <div className="ads-chiprow">{d.workflowSteps.map((s, j) => <span className="ads-chip" key={j}>{j + 1}. {s}</span>)}</div>
                </div>
              ))}
            </section>
          )}
          {tab === 'catalog' && (
            <section>
              <h3>5. Functional Domain Catalog — {fdTotal.toLocaleString()}+ designs</h3>
              <p>
                {industry.domains.length} core domains × {12} operational variants × {30} functional areas ={' '}
                <strong>{fdTotal.toLocaleString()}+</strong> implementable functional domains. Every one has its own
                High-Level &amp; Low-Level design (see the browser on the design page).
              </p>
              <div className="ads-name-cloud">
                {fdPreview.map(d => (
                  <a key={d.id} className="ads-chip" href="#ads-domains" onClick={e => { e.preventDefault(); onClose(); document.getElementById('ads-domains')?.scrollIntoView({ behavior: 'smooth' }) }}>
                    {d.icon} {d.name}
                  </a>
                ))}
              </div>
            </section>
          )}
          {tab === 'architecture' && fsd.architecture.representative && (
            <section>
              <h3>5. Design Diagrams — {fsd.architecture.representative.name}</h3>
              <p>Representative diagrams for the first functional domain. Every domain renders its own HLD + LDD above on this page.</p>
              <RepDiagrams domain={fsd.architecture.representative} />
            </section>
          )}
          {tab === 'stack' && (
            <section>
              <h3>6. Technology Stack</h3>
              <div className="ads-chiprow ads-tech-all">{fsd.techStack.map(t => <span className="ads-chip ads-chip-tech" key={t}>{t}</span>)}</div>
              <h3>Project stack</h3>
              <ul>{fsd.project.stack.map((s, i) => <li key={i}>✔ {s}</li>)}</ul>
            </section>
          )}
          {tab === 'project' && (
            <section>
              <h3>7. Project Implementation</h3>
              <pre className="ads-tree">{fsd.project.structure.join('\n')}</pre>
              <p>Open any project idea below for the complete per-file starter code, or use the Build &amp; Run &amp; Deploy plan on the next tab.</p>
            </section>
          )}
          {tab === 'deploy' && (
            <section>
              <h3>8. Build, Run & Deploy</h3>
              <DeployPlan deploy={fsd.buildRunDeploy} />
            </section>
          )}
          {tab === 'acceptance' && (
            <section>
              <h3>9. Acceptance Criteria</h3>
              <ul>{fsd.acceptance.map((a, i) => <li key={i}>✅ {a}</li>)}</ul>
            </section>
          )}
          {tab === 'risks' && (
            <section>
              <h3>10. Risks & Mitigations</h3>
              <table className="data-table">
                <thead><tr><th>Risk</th><th>Mitigation</th></tr></thead>
                <tbody>{fsd.risks.map((r, i) => <tr key={i}><td>{r.risk}</td><td>{r.mitigation}</td></tr>)}</tbody>
              </table>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}

function RepDiagrams({ domain }) {
  const pattern = getPattern(domain.blueprint)
  if (!pattern) return null
  return (
    <>
      <div className="ads-diagram-grid">
        <div className="ads-diagram">
          <div className="ads-diagram-head"><h3>🏛️ High-Level Design</h3><span>{pattern.hldLabel} · click a layer for code</span></div>
          <LayerStack layers={pattern.hld.map(l => ({ ...l, desc: applyCtx(l.desc, domain.ctx) }))} accent={domain.patternColor || pattern.color} pattern={pattern} ctx={domain.ctx} />
        </div>
        <div className="ads-diagram">
          <div className="ads-diagram-head"><h3>🔬 Low-Level Design</h3><span>{pattern.lddLabel} · click a block for code</span></div>
          <FlowDiagram nodes={pattern.ldd.map(n => ({ ...n, desc: applyCtx(n.desc, domain.ctx) }))} pattern={pattern} ctx={domain.ctx} />
        </div>
      </div>
      <DiagramLegend />
      <FunctionalFlowPanel ctx={domain.ctx} pattern={pattern} />
      <ExpectedOutput ctx={domain.ctx} mode="ask" pattern={pattern} />
      <DeployPanel ctx={domain.ctx} name={domain.domain || domain.ctx} stack={domain.tech ? domain.tech.join(' · ') : 'FastAPI · LangGraph · VectorDB'} />
    </>
  )
}
