import { Link, useParams } from 'react-router-dom'
import { AI_CHATBOTS, COUNTRIES, INDUSTRIES } from '../data/aiChatbotsData'
import { getBotDetails } from '../data/aiBotDetailData'
import { getChatbotImplementation } from '../data/aiImplementationDetails'
import { useLang } from '../i18n'
import './DirectoryDetail.css'

const statusColors = { production: '#3fb950', pilot: '#d29922', development: '#58a6ff', deprecated: '#8b949e' }
export default function AiChatbotDetailPage() {
  const { t } = useLang(); const { chatbotId } = useParams(); const bot = AI_CHATBOTS.find(item => item.id === chatbotId)
  if (!bot) return <div className="directory-detail-page"><Link to="/ai-chatbots">← {t('Back to directory')}</Link><h1>Chatbot not found</h1></div>
  const base = getBotDetails(bot); const country = COUNTRIES.find(item => item.id === bot.country); const industry = INDUSTRIES.find(item => item.id === bot.industry); const detail = getChatbotImplementation(bot, country, industry); const accent = statusColors[bot.status] || '#89b4fa'; const index = AI_CHATBOTS.indexOf(bot); const previous = AI_CHATBOTS[index - 1]; const next = AI_CHATBOTS[index + 1]
  return <div className="directory-detail-page" style={{ '--detail-accent': accent }}>
    <Link className="directory-detail-back" to="/ai-chatbots">← {t('Back to AI chatbot directory')}</Link>
    <header className="directory-detail-hero"><span className="directory-detail-kicker">Selected AI chatbot · implementation profile</span><h1>{bot.name}</h1><p>{detail.behavior}</p><div className="directory-badges"><span>{bot.company}</span><span>{country?.flag} {country?.name}</span><span>{industry?.icon} {industry?.name}</span><span>{bot.model}</span><span>{bot.deployment}</span><span>{bot.status}</span></div></header>
    <div className="directory-detail-layout"><main>
      <section className="directory-detail-section" id="flow"><h2><span>01</span> How this chatbot works</h2><div className="directory-flow">{base.flow.map((step, i) => <div key={step}><b>{String(i + 1).padStart(2, '0')}</b>{step}</div>)}</div><p>The model is not the system of record. Current facts come from approved retrieval or business APIs, and sensitive actions stay behind authenticated workflows.</p></section>
      <section className="directory-detail-section"><h2><span>02</span> Detailed use cases</h2><div className="directory-cards">{(bot.useCases || []).map(useCase => <div className="directory-info-card" key={useCase}><strong>{useCase}</strong><p>The chatbot identifies the intent, checks authorization, retrieves relevant context, explains the next step, and records whether the user was resolved or handed off.</p></div>)}</div></section>
      <section className="directory-detail-section" id="scenarios"><h2><span>03</span> Real-time scenarios</h2><ul>{detail.runtimeScenarios.map(item => <li key={item}>{item}</li>)}</ul></section>
      <section className="directory-detail-section"><h2><span>04</span> Project ideas</h2><div className="directory-cards">{detail.projects.map(item => <div className="directory-info-card" key={item}><strong>✦ Build this</strong><p>{item}</p></div>)}</div></section>
      <section className="directory-detail-section"><h2><span>05</span> Advantages and trade-offs</h2><div className="directory-cards"><div className="directory-info-card directory-good"><strong>Advantages</strong>{base.advantages.map(item => <p key={item}>✓ {item}</p>)}</div><div className="directory-info-card directory-risk"><strong>Disadvantages and risks</strong>{base.disadvantages.map(item => <p key={item}>⚠ {item}</p>)}</div></div></section>
      <section className="directory-detail-section" id="code"><h2><span>06</span> Complete runnable chatbot project code</h2><p>Start with this deterministic router to understand the behavior. Connect a model only after the policy gates and business API contracts are tested.</p><pre className="directory-detail-code"><code>{detail.code}</code></pre><h3>Production API boundary</h3><pre className="directory-detail-code"><code>{detail.apiCode}</code></pre></section>
      <section className="directory-detail-section" id="production"><h2><span>07</span> Production issues and implementation scope</h2><ul>{base.issues.map(item => <li key={item}>⚠ {item}</li>)}</ul><ul>{base.production.map(item => <li key={item}>✓ {item}</li>)}</ul></section>
    </main><aside className="directory-detail-aside"><nav className="directory-side-card"><strong>{t('On this page')}</strong><a href="#flow">Behavior</a><a href="#scenarios">Scenarios</a><a href="#code">Complete code</a><a href="#production">Production scope</a><Link to="/ai-chatbots">{t('Chatbot directory')} →</Link></nav></aside></div>
    <nav className="directory-detail-nav">{previous ? <Link to={`/ai-chatbots/${previous.id}`}>← {previous.name}</Link> : <span />}{next ? <Link to={`/ai-chatbots/${next.id}`}>{next.name} →</Link> : <span />}</nav>
  </div>
}
