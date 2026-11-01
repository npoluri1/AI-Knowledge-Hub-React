import { Link, useParams } from 'react-router-dom'
import { getAgentById, getAdjacentAgent, getAgentCountry, getAgentIndustry } from '../data/aiAgentsDirectoryData'
import { getAgentImplementation } from '../data/aiImplementationDetails'
import { useLang } from '../i18n'
import './DirectoryDetail.css'

const responsibilityCode = (responsibility, name) => `def ${String(responsibility).toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '') || 'run_step'}(request, context):
    """Bounded ${responsibility} step for ${name}."""
    if not request or not context.get("authorized"):
        return {"status": "rejected", "reason": "authorization_or_input"}
    return {"status": "verified", "responsibility": "${responsibility}", "audit": "step_completed"}`

export default function AiAgentDetailPage() {
  const { t } = useLang()
  const { agentId } = useParams()
  const agent = getAgentById(agentId)

  if (!agent) {
    return (
      <div className="directory-detail-page">
        <Link to="/ai-agents">← {t('Back to AI agents')}</Link>
        <h1>Agent not found</h1>
        <p>The agent "{agentId}" does not exist in the catalog.</p>
      </div>
    )
  }

  const country = getAgentCountry(agent.country)
  const industry = getAgentIndustry(agent.industry)
  const detail = getAgentImplementation(agent, country, industry)
  const accent = agent.type === 'multi' ? '#cba6f7' : '#89b4fa'
  const previous = getAdjacentAgent(agent.id, -1)
  const next = getAdjacentAgent(agent.id, 1)

  return (
    <div className="directory-detail-page" style={{ '--detail-accent': accent }}>
      <Link className="directory-detail-back" to="/ai-agents">← {t('Back to AI agent directory')}</Link>

      <header className="directory-detail-hero">
        <span className="directory-detail-kicker">{agent.type === 'multi' ? 'Multi-agent system' : 'Task AI agent'} · implementation blueprint</span>
        <h1>{agent.name}</h1>
        <p>{detail.behavior}</p>
        <div className="directory-badges">
          <span>{country?.flag} {country?.name}</span>
          <span>{industry?.icon} {industry?.name}</span>
          <span>{agent.status}</span>
          <span>{agent.type}</span>
        </div>
      </header>

      <div className="directory-detail-layout">
        <main>
          <section className="directory-detail-section" id="flow">
            <h2><span>01</span> How this agent behaves</h2>
            <div className="directory-flow">
              {detail.workflowSteps.map((step, i) => (
                <div key={step.name}><b>{String(i + 1).padStart(2, '0')}</b>{step.name}</div>
              ))}
            </div>
            <p>Every step should be observable. The agent must stop when its tool budget, confidence threshold, timeout, or approval policy is reached.</p>
            <div className="directory-workflow-details">
              {detail.workflowSteps.map(step => (
                <article className="directory-workflow-card" key={step.name}>
                  <h3>{step.name}</h3>
                  <p>{step.explanation}</p>
                  <pre className="directory-detail-code"><code>{step.code}</code></pre>
                </article>
              ))}
            </div>
          </section>

          <section className="directory-detail-section" id="responsibilities">
            <h2><span>02</span> Responsibilities and use cases</h2>
            <div className="directory-responsibility-list">
              {(agent.tasks || []).map((task, index) => (
                <article className="directory-responsibility-card" key={task}>
                  <div className="directory-responsibility-heading">
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <h3>{task}</h3>
                  </div>
                  <p>Accept the request, retrieve authorized context, validate the result, and produce an auditable outcome for the <strong>{task}</strong> workflow in {industry?.name || 'this industry'}.</p>
                  <p><strong>Expected output:</strong> structured result, confidence or validation status, audit event, and human escalation decision when required.</p>
                  <pre className="directory-detail-code"><code>{responsibilityCode(task, agent.name)}</code></pre>
                </article>
              ))}
            </div>
          </section>

          <section className="directory-detail-section" id="scenarios">
            <h2><span>03</span> Real-time scenarios</h2>
            <ul>{detail.runtimeScenarios.map(item => <li key={item}>{item}</li>)}</ul>
          </section>

          <section className="directory-detail-section">
            <h2><span>04</span> Project ideas</h2>
            <div className="directory-cards">
              {detail.projectDetails.map(project => (
                <div className="directory-info-card" key={project.title}>
                  <strong>✦ Build this</strong>
                  <p>{project.title}</p>
                  <pre className="directory-detail-code"><code>{project.code}</code></pre>
                </div>
              ))}
            </div>
          </section>

          <section className="directory-detail-section" id="code">
            <h2><span>05</span> Complete agent project code</h2>
            <p>This end-to-end starter composes the selected workflow behind a safe tool boundary.</p>
            <pre className="directory-detail-code"><code>{detail.code}</code></pre>
            <h3>Production API boundary</h3>
            <pre className="directory-detail-code"><code>{detail.apiCode}</code></pre>
          </section>

          <section className="directory-detail-section">
            <h2><span>06</span> Advantages and trade-offs</h2>
            <div className="directory-cards">
              <div className="directory-info-card directory-good">
                <strong>Advantages</strong>
                <p>Automates repeatable work while keeping approvals and auditability.</p>
                <p>Combines retrieval, deterministic policies, and business tools.</p>
              </div>
              <div className="directory-info-card directory-risk">
                <strong>Disadvantages and risks</strong>
                <p>Incorrect tool decisions, prompt injection, loops, latency, and cost growth.</p>
                <p>High-impact workflows require accountable human ownership.</p>
              </div>
            </div>
          </section>

          <section className="directory-detail-section" id="production">
            <h2><span>07</span> Production implementation scope</h2>
            <ul>
              <li>Authenticate users and isolate tenants before any tool call.</li>
              <li>Allow-list tools, validate schemas, redact sensitive data, and log audit events.</li>
              <li>Use bounded retries, idempotency, queues, timeouts, cancellation, and dead-letter recovery.</li>
              <li>Measure task success, verification failures, escalation, latency, cost, and drift.</li>
              <li>Use approvals, feature flags, canary releases, rollback, and incident runbooks.</li>
            </ul>
          </section>
        </main>

        <aside className="directory-detail-aside">
          <nav className="directory-side-card">
            <strong>{t('On this page')}</strong>
            <a href="#flow">Behavior and step code</a>
            <a href="#responsibilities">Responsibilities</a>
            <a href="#scenarios">Scenarios</a>
            <a href="#code">Complete code</a>
            <a href="#production">Production scope</a>
            <Link to="/ai-agents">{t('Agent directory')} →</Link>
          </nav>
        </aside>
      </div>

      <nav className="directory-detail-nav">
        {previous ? <Link to={`/ai-agents/${previous.id}`}>← Previous agent</Link> : <span />}
        {next ? <Link to={`/ai-agents/${next.id}`}>Next agent →</Link> : <span />}
      </nav>
    </div>
  )
}
