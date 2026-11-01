import React, { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { AI_JOBS_HEADER, AI_NEW_ROLES } from '../data/aiEngineerJobs'
import { AI_JOBS_ALL } from '../data/aiJobsAll'
import { AI_JOBS_GLOBAL_ADDITIONS } from '../data/aiJobsGlobalAdditions'
import FetchButton from '../components/FetchButton'
import { refreshLiveJobs } from '../api'
import { useLang } from '../i18n'
import './AiEngineerJobs.css'

const REGION_FLAGS = {
  Singapore: '\u{1F1F8}\u{1F1EC}', USA: '\u{1F1FA}\u{1F1F8}', UK: '\u{1F1EC}\u{1F1E7}',
  Australia: '\u{1F1E6}\u{1F1FA}', Canada: '\u{1F1E8}\u{1F1E6}', 'New Zealand': '\u{1F1F3}\u{1F1FF}',
  Japan: '\u{1F1EF}\u{1F1F5}', 'South Korea': '\u{1F1F0}\u{1F1F7}', Malaysia: '\u{1F1F2}\u{1F1FE}',
  Switzerland: '\u{1F1E8}\u{1F1ED}', Germany: '\u{1F1E9}\u{1F1EA}', France: '\u{1F1EB}\u{1F1F7}',
  Netherlands: '\u{1F1F3}\u{1F1F1}', India: '\u{1F1EE}\u{1F1F3}', Ireland: '\u{1F1EE}\u{1F1EA}',
  Brazil: '\u{1F1E7}\u{1F1F7}', Vietnam: '\u{1F1FB}\u{1F1F3}', Philippines: '\u{1F1F5}\u{1F1ED}',
  Thailand: '\u{1F1F9}\u{1F1ED}', Global: '🌐', Other: '🌍',
}

const ALL_JOBS = [
  ...Object.values(AI_JOBS_ALL || {}),
  ...AI_JOBS_GLOBAL_ADDITIONS,
]

const SECTION_DEFINITIONS = [
  // Specific career paths come first so, for example, an MCP security role
  // is not filed under the broader LLM category just because it uses LLMs.
  { id: 'security', label: 'AI Security & Governance', icon: '🛡️', test: /Security|Governance|Responsible AI|Guardrail|Compliance|Identity|IAM|Threat/i },
  { id: 'agents', label: 'AI Agents & Automation', icon: '🤖', test: /Agent|Agentic|Automation|MCP|Tool-Use/i },
  { id: 'vision', label: 'Computer Vision & Robotics', icon: '👁️', test: /Vision|Robotics|Embodied|Multimodal|Image|Video|ROS|Autonomous/i },
  { id: 'research', label: 'AI Research & Science', icon: '🔬', test: /Research|Scientist|Deep Learning|Algorithms|JAX|TPU/i },
  { id: 'product', label: 'AI Product & Leadership', icon: '📈', test: /Product|Lead|Manager|Director|Head of|Principal|Architect|Strategy|Program/i },
  { id: 'applied', label: 'Applied & Forward Deployed AI', icon: '🚀', test: /Forward Deployed|Applied AI|Solutions|Consultant|Implementation|Customer|FDE/i },
  { id: 'platform', label: 'AI Platform & MLOps', icon: '⚙️', test: /Platform|MLOps|ML Ops|Infrastructure|Inference|Serving|Kubeflow|MLflow|Kubernetes|GPU|Cloud/i },
  { id: 'data', label: 'Data Science & ML Engineering', icon: '📊', test: /Data Scientist|Data Science|ML Engineer|Machine Learning|Analytics|Recommendation|Ranking|Search/i },
  { id: 'genai', label: 'Generative AI & LLMs', icon: '✨', test: /LLM|GenAI|GPT|Claude|Gemini|RAG|NLP|Foundation|Language Model|OpenAI/i },
]

function normalizeCountry(country) {
  const aliases = {
    Kingdom: 'UK',
    'United Kingdom': 'UK',
    Zealand: 'New Zealand',
    Korea: 'South Korea',
    'South Korea': 'South Korea',
    'United States': 'USA',
    'United States of America': 'USA',
  }
  return aliases[country] || country || 'Other'
}

function classifyJob(job) {
  const text = [job.role, job.company, ...(job.tags || [])].join(' ')
  return SECTION_DEFINITIONS.find(section => section.test.test(text))?.id || 'software'
}

const SOFTWARE_SECTION = { id: 'software', label: 'AI Software Engineering', icon: '💻' }
const ALL_SECTIONS = [...SECTION_DEFINITIONS, SOFTWARE_SECTION]
const JOBS_WITH_SECTIONS = ALL_JOBS.map(job => ({
  ...job,
  country: normalizeCountry(job.country),
  sectionId: classifyJob(job),
}))

function buildGroups(jobs, key, definitions = []) {
  const map = {}
  jobs.forEach(job => {
    const value = job[key] || (key === 'country' ? 'Other' : 'software')
    if (!map[value]) map[value] = []
    map[value].push(job)
  })
  return Object.entries(map)
    .sort((a, b) => b[1].length - a[1].length)
    .map(([value, groupedJobs]) => {
      const definition = definitions.find(item => item.id === value)
      return {
        id: value,
        country: key === 'country' ? value : undefined,
        label: definition?.label || value,
        icon: definition?.icon,
        jobs: groupedJobs,
      }
    })
}

const COUNTRY_GROUPS = buildGroups(JOBS_WITH_SECTIONS, 'country')
const SECTION_GROUPS = buildGroups(JOBS_WITH_SECTIONS, 'sectionId', ALL_SECTIONS)

function JobDetailPanel({ job, onClose }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  if (!job) return null

  const src = job.source || 'kh'
  const tags = job.tags || []
  const meta = job.meta || {}

  return (
    <div className="aij-overlay" onClick={onClose}>
      <div className="aij-detail" onClick={e => e.stopPropagation()}>
        <button className="aij-detail-close" onClick={onClose}>✕</button>

        {/* Header */}
        <div className="aij-detail-header">
          <div className="aij-detail-company">{job.company}</div>
          <div className="aij-detail-role">{job.role}</div>
          <div className="aij-detail-meta">
            {job.country && <span className="aij-detail-badge aij-badge-loc">{REGION_FLAGS[job.country] || '🌍'} {job.country}</span>}
            {job.level && <span className="aij-detail-badge aij-badge-level">{job.level}</span>}
            {job.salary && <span className="aij-detail-badge aij-badge-salary">{job.salary}</span>}
            {job.monthlySgd && <span className="aij-detail-badge aij-badge-salary">Monthly: {job.monthlySgd}</span>}
            {job.annualSgd && job.annualSgd !== job.salary && <span className="aij-detail-badge aij-badge-salary">Annual: {job.annualSgd}</span>}
            {job.location && src !== 'table' && <span className="aij-detail-badge aij-badge-loc">📍 {job.location}</span>}
            {src === 'jd' && <span className="aij-detail-badge" style={{background:'#313244',color:'#a6e3a1'}}>Complete JD</span>}
            {src === 'table' && <span className="aij-detail-badge" style={{background:'#313244',color:'#89b4fa'}}>Job Listing</span>}
            {src === 'kh' && <span className="aij-detail-badge" style={{background:'#313244',color:'#f9e2af'}}>Knowledge Hub</span>}
          </div>
          {/* Meta items (JD jobs) */}
          {Object.keys(meta).length > 0 && (
            <div className="aij-detail-meta-row">
              {meta['Team'] && <span className="aij-meta-item"><span className="aij-meta-label">Team</span> {meta['Team']}</span>}
              {meta['Reports To'] && <span className="aij-meta-item"><span className="aij-meta-label">Reports To</span> {meta['Reports To']}</span>}
              {meta['Division'] && <span className="aij-meta-item"><span className="aij-meta-label">Division</span> {meta['Division']}</span>}
              {meta['Annual Total'] && <span className="aij-meta-item"><span className="aij-meta-label">Annual Total</span> <span style={{color:'#a6e3a1'}}>{meta['Annual Total']}</span></span>}
              {meta['Experience'] && <span className="aij-meta-item"><span className="aij-meta-label">Experience</span> {meta['Experience']}</span>}
            </div>
          )}
        </div>

        {/* Description (KH jobs) */}
        {job.description && (
          <div className="aij-detail-section">
            <div className="aij-detail-section-title">About This Role</div>
            <div className="aij-detail-desc">{job.description}</div>
          </div>
        )}

        {/* Project context (complete JD jobs) */}
        {job.projectOverview && (
          <div className="aij-detail-section">
            <div className="aij-detail-section-title">🏗️ Project Context</div>
            <div className="aij-detail-desc">{job.projectOverview}</div>
          </div>
        )}

        {/* Tech Stack Tags */}
        {tags.length > 0 && (
          <div className="aij-detail-section">
            <div className="aij-detail-section-title">🛠️ Tech Stack</div>
            <div className="aij-detail-tags">{tags.map((t, i) => <span key={i} className="aij-detail-tag">{t}</span>)}</div>
          </div>
        )}

        {/* Full Tech Stack (JD jobs - flat array) */}
        {job.techStack && job.techStack.length > 0 && (
          <div className="aij-detail-section">
            <div className="aij-detail-section-title">\u26A1 Full Tech Stack</div>
            <div className="aij-detail-tags aij-tech-full">{job.techStack.map((t, i) => {
              const cls = /Python|Java|Go|C\+\+|SQL|Golang/.test(t) ? 'aij-tag-lang'
                : /AWS|Azure|GCP|Kubernetes|Docker|Cloud/.test(t) ? 'aij-tag-cloud'
                : /LangChain|PyTorch|TensorFlow|LLM|RAG|Embeddings/.test(t) ? 'aij-tag-fw'
                : 'aij-tag-tools'
              return <span key={i} className={`aij-detail-tag ${cls}`}>{t}</span>
            })}</div>
          </div>
        )}

        {/* Design Patterns - Current/Future (table jobs) */}
        {job.designPatternsCurrent && job.designPatternsCurrent.length > 0 && (
          <div className="aij-detail-section">
            <div className="aij-detail-section-title">Design Patterns</div>
            <div className="aij-dp-grid">
              {job.designPatternsCurrent.map((dp, i) => (
                <span key={i} className="aij-dp-chip aij-dp-current">{dp}</span>
              ))}
              {job.designPatternsFuture && job.designPatternsFuture.map((dp, i) => (
                <span key={'f'+i} className="aij-dp-chip aij-dp-future">Future: {dp}</span>
              ))}
            </div>
          </div>
        )}

        {/* Design Patterns - Objects (KH jobs) */}
        {job.designPatterns && job.designPatterns.length > 0 && typeof job.designPatterns[0] === 'object' && (
          <div className="aij-detail-section">
            <div className="aij-detail-section-title">Design Patterns & Architecture</div>
            <div className="aij-dp-objects">
              {job.designPatterns.map((dp, i) => (
                <div key={i} className="aij-dp-object">
                  <div className="aij-dp-obj-name">{dp.name}</div>
                  <div className="aij-dp-obj-tech">{dp.tech}</div>
                  <div className="aij-dp-obj-usecase">{dp.usecase}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Architecture Flow (KH jobs) */}
        {job.archFlow && job.archFlow.length > 0 && (
          <div className="aij-detail-section">
            <div className="aij-detail-section-title">Architecture Flow</div>
            <div className="aij-arch-flow">
              {job.archFlow.map((step, i) => (
                <React.Fragment key={i}>
                  <span className="aij-arch-step">{step}</span>
                  {i < job.archFlow.length - 1 && <span className="aij-arch-arrow"> → </span>}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}

        {/* Testing focus */}
        {job.testingFocus && job.testingFocus.length > 0 && (
          <div className="aij-detail-section">
            <div className="aij-detail-section-title">🧪 Testing & Validation Focus ({job.testingFocus.length})</div>
            <ul className="aij-detail-list aij-list-testing">
              {job.testingFocus.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          </div>
        )}

        {/* Application and company information (complete JD jobs) */}
        {(job.applicationClose || job.supportContact || job.companyProfile) && (
          <div className="aij-detail-section">
            <div className="aij-detail-section-title">📌 Application Information</div>
            {job.applicationClose && <div className="aij-detail-desc"><strong>Applications close:</strong> {job.applicationClose}</div>}
            {job.supportContact && <div className="aij-detail-desc" style={{ marginTop: 8 }}><strong>Recruitment support:</strong> {job.supportContact}</div>}
            {job.companyProfile && <div className="aij-detail-desc" style={{ marginTop: 8 }}>{job.companyProfile}</div>}
          </div>
        )}

        {/* Responsibilities (table + JD jobs) */}
        {job.responsibilities && job.responsibilities.length > 0 && (
          <div className="aij-detail-section">
            <div className="aij-detail-section-title">💼 Key Responsibilities ({job.responsibilities.length})</div>
            <ul className="aij-detail-list aij-list-resp">
              {job.responsibilities.map((r, i) => <li key={i}>{r}</li>)}
            </ul>
          </div>
        )}

        {/* Qualifications (table jobs) */}
        {job.qualifications && job.qualifications.length > 0 && (
          <div className="aij-detail-section">
            <div className="aij-detail-section-title">Qualifications ({job.qualifications.length})</div>
            <ul className="aij-detail-list aij-list-req">
              {job.qualifications.map((r, i) => <li key={i}>{r}</li>)}
            </ul>
          </div>
        )}

        {/* What You'll Use (table jobs) */}
        {job.whatYoullUse && job.whatYoullUse.length > 0 && (
          <div className="aij-detail-section">
            <div className="aij-detail-section-title">What You'll Use</div>
            <ul className="aij-detail-list aij-list-usecases">
              {job.whatYoullUse.map((r, i) => <li key={i}>{r}</li>)}
            </ul>
          </div>
        )}

        {/* Requirements (JD jobs) */}
        {job.requirements && job.requirements.length > 0 && (
          <div className="aij-detail-section">
            <div className="aij-detail-section-title">\u2705 Requirements ({job.requirements.length})</div>
            <ul className="aij-detail-list aij-list-req">
              {job.requirements.map((r, i) => <li key={i}>{r}</li>)}
            </ul>
          </div>
        )}

        {/* Nice to Have (JD jobs) */}
        {job.niceToHave && job.niceToHave.length > 0 && (
          <div className="aij-detail-section">
            <div className="aij-detail-section-title">💡 Nice to Have ({job.niceToHave.length})</div>
            <ul className="aij-detail-list aij-list-nice">
              {job.niceToHave.map((r, i) => <li key={i}>{r}</li>)}
            </ul>
          </div>
        )}

        {/* Benefits (JD jobs) */}
        {job.benefits && job.benefits.length > 0 && (
          <div className="aij-detail-section">
            <div className="aij-detail-section-title">🎁 Benefits ({job.benefits.length})</div>
            <ul className="aij-detail-list aij-list-benefits">
              {job.benefits.map((r, i) => <li key={i}>{r}</li>)}
            </ul>
          </div>
        )}

        {/* Key Requirements (table jobs - short text) */}
        {job.keyRequirements && !job.responsibilities && (
          <div className="aij-detail-section">
            <div className="aij-detail-section-title">Key Requirements</div>
            <div className="aij-detail-desc">{job.keyRequirements}</div>
          </div>
        )}

        {/* Source Badge */}
        <div className="aij-source-badge">
          Source: {src === 'jd' ? 'Complete Job Description' : src === 'table' ? 'Job Listing + Details' : 'Knowledge Hub'}
          {job.responsibilities?.length > 0 && ` · ${job.responsibilities.length} responsibilities`}
          {job.qualifications?.length > 0 && ` · ${job.qualifications.length} qualifications`}
          {job.requirements?.length > 0 && ` · ${job.requirements.length} requirements`}
          {job.niceToHave?.length > 0 && ` · ${job.niceToHave.length} nice-to-have`}
          {job.benefits?.length > 0 && ` · ${job.benefits.length} benefits`}
          {job.whatYoullUse?.length > 0 && ` · ${job.whatYoullUse.length} tools`}
          {job.testingFocus?.length > 0 && ` · ${job.testingFocus.length} testing controls`}
        </div>
      </div>
    </div>
  )
}

export default function AiEngineerJobs() {
  const { t } = useLang()
  const [search, setSearch] = useState('')
  const [browseMode, setBrowseMode] = useState('country')
  const [activeGroup, setActiveGroup] = useState('all')
  const [selectedJob, setSelectedJob] = useState(null)

  const sourceGroups = browseMode === 'country' ? COUNTRY_GROUPS : SECTION_GROUPS
  const filtered = useMemo(() => {
    let data = sourceGroups
    if (activeGroup !== 'all') {
      data = data.filter(group => group.id === activeGroup)
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      data = data.map(group => ({
        ...group,
        jobs: group.jobs.filter(j =>
          j.company.toLowerCase().includes(q) ||
          j.role.toLowerCase().includes(q) ||
          (j.tags || []).some(t => t.toLowerCase().includes(q)) ||
          (j.location || '').toLowerCase().includes(q) ||
          (j.description || '').toLowerCase().includes(q) ||
          (j.testingFocus || []).some(item => item.toLowerCase().includes(q)) ||
          (j.responsibilities || []).some(item => item.toLowerCase().includes(q))
        ),
      })).filter(group => group.jobs.length > 0)
    }
    return data
  }, [search, activeGroup, sourceGroups])

  const totalCount = useMemo(() => filtered.reduce((sum, group) => sum + group.jobs.length, 0), [filtered])
  const allGroupsCount = useMemo(() => sourceGroups.reduce((sum, group) => sum + group.jobs.length, 0), [sourceGroups])

  return (
    <div className="aij-page">
      <Link to="/" className="back-link">← {t('Back to Home')}</Link>

      <div className="aij-hero">
        <div className="page-header-row">
          <h1>💼 {AI_JOBS_HEADER.title}</h1>
          <FetchButton onFetch={async () => {
            const { total } = await refreshLiveJobs()
            return `Live catalog has ${total.toLocaleString()} jobs from the backend`
          }} label={t('Fetch Latest')} />
        </div>
        <p className="aij-hero-sub">{AI_JOBS_HEADER.subtitle}</p>
      </div>

      <div className="aij-stats">
        <div className="aij-stat">
          <div className="aij-stat-val">{ALL_JOBS.length.toLocaleString()}</div>
          <div className="aij-stat-label">{t('Total Jobs')}</div>
        </div>
        <div className="aij-stat">
          <div className="aij-stat-val">{COUNTRY_GROUPS.length}</div>
          <div className="aij-stat-label">{t('Countries')}</div>
        </div>
        <div className="aij-stat">
          <div className="aij-stat-val">{AI_JOBS_HEADER.stats.salaryRangeUSD}</div>
          <div className="aij-stat-label">{t('Salary Range (USD)')}</div>
        </div>
        <div className="aij-stat">
          <div className="aij-stat-val">{ALL_JOBS.filter(j => j.source === 'jd').length}</div>
          <div className="aij-stat-label">{t('Complete JDs')}</div>
        </div>
      </div>

      <div className="aij-toolbar">
        <input
          className="aij-search-box"
          placeholder="Search by company, role, country, or technology..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {search && <button className="aij-clear-btn" onClick={() => setSearch('')}>{t('Clear')}</button>}
      </div>

      <div className="aij-browser">
        <aside className="aij-browser-sidebar">
          <div className="aij-browser-sidebar-title">{t('Browse jobs')}</div>
          <div className="aij-view-switcher" role="tablist" aria-label="Browse jobs by">
            <button className={browseMode === 'country' ? 'active' : ''} onClick={() => { setBrowseMode('country'); setActiveGroup('all') }}>🌍 {t('Country')}</button>
            <button className={browseMode === 'section' ? 'active' : ''} onClick={() => { setBrowseMode('section'); setActiveGroup('all') }}>🧭 {t('Section')}</button>
          </div>
          <div className="aij-sidebar-scroll">
            <button
              className={`aij-group-btn ${activeGroup === 'all' ? 'active' : ''}`}
              onClick={() => setActiveGroup('all')}
            >
              <span>{browseMode === 'country' ? '🌐 All countries' : '📚 All sections'}</span>
              <strong>{allGroupsCount.toLocaleString()}</strong>
            </button>
            {sourceGroups.map(group => (
              <button
                key={group.id}
                className={`aij-group-btn ${activeGroup === group.id ? 'active' : ''}`}
                onClick={() => setActiveGroup(group.id)}
              >
                <span>{browseMode === 'country' ? (REGION_FLAGS[group.country] || '🌍') : group.icon} {browseMode === 'country' ? group.country : group.label}</span>
                <strong>{group.jobs.length}</strong>
              </button>
            ))}
          </div>
          <div className="aij-sidebar-tip">Choose a country or section. The jobs list has its own scrollbar so the page stays easy to navigate.</div>
        </aside>

        <section className="aij-results-panel">
          <div className="aij-results-head">
            <div>
              <div className="aij-results-kicker">{browseMode === 'country' ? 'Country view' : 'Section view'}</div>
              <h2>{activeGroup === 'all' ? (browseMode === 'country' ? 'All countries' : 'All job sections') : sourceGroups.find(group => group.id === activeGroup)?.label}</h2>
            </div>
            <span className="aij-results-count">{totalCount.toLocaleString()} jobs</span>
          </div>
          <div className="aij-results-scroll">
            {filtered.map(group => (
              <div key={group.id} className="aij-country-section">
                <div className="aij-country-head">
                  <span className="aij-country-flag">{browseMode === 'country' ? (REGION_FLAGS[group.country] || '🌍') : group.icon}</span>
                  <span className="aij-country-name">{browseMode === 'country' ? group.country : group.label}</span>
                  <span className="aij-country-count-badge">{group.jobs.length} jobs</span>
                </div>
                <div className="aij-jobs-grid">
                  {group.jobs.map((j, i) => (
                    <div key={`${j.company}-${j.role}-${i}`} className="aij-job" onClick={() => setSelectedJob(j)}>
                      <div className="aij-job-company">{j.company}</div>
                      <div className="aij-job-role">{j.role}</div>
                      <div className="aij-job-location">{REGION_FLAGS[j.country] || '🌍'} {j.country || 'Global'}{j.location ? ` · ${j.location}` : ''}</div>
                      {j.salary && <div className="aij-job-salary">{j.salary}</div>}
                      {j.monthlySgd && <div className="aij-job-salary">{j.monthlySgd}/mo</div>}
                      {j.tags && (
                        <div className="aij-job-tags">
                          {j.tags.slice(0, 5).map((t, ti) => (
                            <span key={ti} className="aij-tag aij-tag-tech">{t}</span>
                          ))}
                          {j.tags.length > 5 && <span className="aij-tag aij-tag-more">+{j.tags.length - 5}</span>}
                        </div>
                      )}
                      <div className="aij-job-click-hint">
                        {j.source === 'jd' ? 'View full JD →' : j.source === 'table' ? 'View details →' : 'View role →'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {totalCount === 0 && (
        <div style={{ textAlign: 'center', color: '#6c7086', padding: 40 }}>
          No jobs match your search. Try a different keyword.
        </div>
      )}

      <h2 style={{ color: '#b4befe', marginTop: 30, marginBottom: 16 }}>New AI Role Types Trending in 2026</h2>
      {AI_NEW_ROLES.map((r, i) => (
        <div key={i} className="aij-new-role">
          <div className="aij-new-role-name">{r.role}</div>
          <div className="aij-new-role-desc">{r.description}</div>
          {r.companies && (
            <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {r.companies.map((c, ci) => (
                <span key={ci} className="aij-tag aij-tag-tech" style={{ fontSize: '0.68rem' }}>
                  {c.company}: {c.salary}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}

      <div className="aij-footer">
        Global AI Engineer Jobs — Complete 2026 Guide · Source: AI_Engineer_Jobs_Global.html
      </div>

      {selectedJob && <JobDetailPanel job={selectedJob} onClose={() => setSelectedJob(null)} />}
    </div>
  )
}
