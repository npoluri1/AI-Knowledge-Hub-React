import { useMemo, useState } from 'react'
import { AGENTIC_PLATFORMS, AGENT_INDUSTRIES, AGENT_COUNTRIES, AGENT_TYPES, generateAgentsForCombo, generateAgentsUpTo, getAgentCountry, getAgentIndustry } from '../data/aiAgentsDirectoryData'
import { getAgentImplementation } from '../data/aiImplementationDetails'
import '../pages/AiAgentExplorer.css'
import { Link } from 'react-router-dom'

const safeLower = value => String(value ?? '').toLowerCase()
const safeList = value => Array.isArray(value) ? value : []

function AgentDetail({ agent, color }) {
  const country = getAgentCountry(agent.country)
  const industry = getAgentIndustry(agent.industry)
  const implementation = getAgentImplementation(agent, country, industry)
  const agentTasks = safeList(agent.tasks)
  return (
    <div className="agent-detail" style={{ '--agent-accent': color }} onClick={event => event.stopPropagation()}>
      <div className="agent-detail-meta">{country?.flag} {country?.name} · {industry?.icon} {industry?.name} · {agent.status}</div>
      <p>{implementation.behavior}</p>
      <div className="agent-flow">
        {implementation.workflowSteps.map((step, index) => (
          <span key={step.name}><b>{String(index + 1).padStart(2, '0')}</b>{step.name}</span>
        ))}
      </div>
      <div className="agent-detail-columns">
        <div>
          <h5>Tasks it can perform</h5>
          <ul>{agentTasks.map(task => <li key={task}>{task}</li>)}</ul>
          <h5>Step-by-step implementation</h5>
          {implementation.workflowSteps.map(step => (
            <div className="agent-step-detail" key={step.name}>
              <strong>{step.name}</strong>
              <p>{step.explanation}</p>
              <pre className="agent-code"><code>{step.code}</code></pre>
            </div>
          ))}
        </div>
        <div>
          <h5>Real-time scenarios</h5>
          <ul>{implementation.runtimeScenarios.map(item => <li key={item}>{item}</li>)}</ul>
          <h5>Production scope</h5>
          <ul>
            <li>Authentication, authorization, tenant isolation</li>
            <li>Timeouts, retries, idempotency, and queue backpressure</li>
            <li>Evaluation, prompt/tool injection defenses, and audit logs</li>
            <li>Latency, cost, quality, escalation, and drift monitoring</li>
          </ul>
        </div>
      </div>
      <h5>Project implementation examples</h5>
      {implementation.projectDetails.map(project => (
        <div className="agent-project-detail" key={project.title}>
          <strong>{project.title}</strong>
          <pre className="agent-code"><code>{project.code}</code></pre>
        </div>
      ))}
    </div>
  )
}

function AgentCard({ agent }) {
  const [open, setOpen] = useState(false)
  const color = agent.type === 'multi' ? '#cba6f7' : '#89b4fa'
  return (
    <article className={`agent-card ${open ? 'open' : ''}`} style={{ '--agent-accent': color }} onClick={() => setOpen(!open)}>
      <div className="agent-card-top">
        <span className="agent-card-icon">{agent.type === 'multi' ? '🤝' : '🤖'}</span>
        <div>
          <h4>{agent.name}</h4>
          <p>{agent.description}</p>
        </div>
        <span className="agent-type">{agent.type === 'multi' ? 'Multi-agent' : 'Single agent'}</span>
      </div>
      <div className="agent-card-tags">
        {safeList(agent.useCases).slice(0, 2).map(useCase => <span key={useCase}>✦ {useCase}</span>)}
        {safeList(agent.tasks).slice(0, 2).map(task => <span key={task}>{task}</span>)}
      </div>
      <div className="agent-card-toggle">{open ? '▲ Hide agent profile' : '▼ Explore agent, workflow code & scope'}</div>
      <Link className="agent-open-page" to={`/ai-agents/${agent.id}`} onClick={event => event.stopPropagation()}>Open full agent page ↗</Link>
      {open && <AgentDetail agent={agent} color={color} />}
    </article>
  )
}

export default function AiAgentExplorer() {
  const [type, setType] = useState('all')
  const [country, setCountry] = useState('all')
  const [industry, setIndustry] = useState('all')
  const [query, setQuery] = useState('')
  const [platform, setPlatform] = useState(null)

  // Generate agents dynamically based on filters
  const filtered = useMemo(() => {
    if (country !== 'all' && industry !== 'all') {
      // Specific combo: generate all 1,000 for that country+industry
      let agents = generateAgentsForCombo(country, industry)
      if (type !== 'all') agents = agents.filter(a => a.type === type)
      if (query.trim()) {
        const q = query.toLowerCase()
        agents = agents.filter(a => {
          const haystack = `${a.name} ${a.description} ${(a.tasks || []).join(' ')} ${(a.useCases || []).join(' ')}`.toLowerCase()
          return haystack.includes(q)
        })
      }
      return agents
    }
    // General browsing: generate up to 100 representative agents
    return generateAgentsUpTo(100, {
      country: country === 'all' ? null : country,
      industry: industry === 'all' ? null : industry,
      type: type === 'all' ? null : type,
      search: query.trim() || null,
    })
  }, [type, country, industry, query])

  return (
    <section className="agent-explorer">
      <div className="agent-explorer-head">
        <div>
          <span className="agent-kicker">GLOBAL AGENT DIRECTORY</span>
          <h2>AI Agents, Multi-Agents & Agentic Platforms</h2>
          <p>Explore country- and industry-aware agent blueprints. Select a country + industry to load all 1,000 agents for that combination.</p>
        </div>
        <div className="agent-stats">
          <b>{AGENT_COUNTRIES.length}</b><small>countries</small>
          <b>{AGENT_INDUSTRIES.length}</b><small>industries</small>
          <b>{filtered.length.toLocaleString()}</b><small>agents loaded</small>
        </div>
      </div>

      <div className="agent-type-tabs">
        {AGENT_TYPES.map(item => (
          <button key={item.id} className={type === item.id ? 'active' : ''} style={{ '--agent-accent': item.color }} onClick={() => setType(type === item.id ? 'all' : item.id)}>
            {item.icon} {item.name}
          </button>
        ))}
      </div>

      <div className="agent-filters">
        <input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search agents by task or industry…" />
        <select value={country} onChange={event => setCountry(event.target.value)}>
          <option value="all">All countries</option>
          {AGENT_COUNTRIES.map(item => <option key={item.id} value={item.id}>{item.flag} {item.name}</option>)}
        </select>
        <select value={industry} onChange={event => setIndustry(event.target.value)}>
          <option value="all">All industries</option>
          {AGENT_INDUSTRIES.map(item => <option key={item.id} value={item.id}>{item.icon} {item.name}</option>)}
        </select>
      </div>

      {country !== 'all' && industry !== 'all' && (
        <div className="agent-combo-info">
          ✓ Loaded {filtered.length.toLocaleString()} agents for {getAgentCountry(country)?.flag} {getAgentCountry(country)?.name} × {getAgentIndustry(industry)?.icon} {getAgentIndustry(industry)?.name}
        </div>
      )}

      {type !== 'platform' && (
        <div className="agent-grid">
          {filtered.map(agent => <AgentCard agent={agent} key={agent.id} />)}
        </div>
      )}

      {type === 'platform' && (
        <div className="platform-grid">
          {AGENTIC_PLATFORMS.map(item => (
            <button key={item.id} className={`platform-card ${platform === item.id ? 'active' : ''}`} style={{ '--agent-accent': item.color }} onClick={() => setPlatform(platform === item.id ? null : item.id)}>
              <span>{item.id === 'mcp' ? '🔌' : '🧠'}</span>
              <strong>{item.name}</strong>
              <small>{item.category}</small>
              <p>{item.focus}</p>
              {platform === item.id && <em>Selected: design a governed {item.name} workflow with checkpoints, tools, evaluation, and observability.</em>}
            </button>
          ))}
        </div>
      )}
    </section>
  )
}
