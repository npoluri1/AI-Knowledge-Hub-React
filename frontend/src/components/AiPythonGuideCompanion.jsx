import { getGuideEnhancement } from '../data/aiPythonGuideEnhancements'
import '../pages/AiPythonGuideCompanion.css'

export default function AiPythonGuideCompanion({ page }) {
  const content = getGuideEnhancement(page)
  return <section className="mph-companion" aria-label={`${page.title} practical companion`}>
    <div className="mph-companion-heading"><span className="mph-companion-kicker">PRACTICAL COMPANION</span><h2>Turn the guide into working engineering</h2><p>{content.summary}</p></div>
    <div className="mph-scenario-grid">{content.scenarios.map(scenario => <article className="mph-scenario" key={scenario.title}><div className="mph-scenario-number">{String(content.scenarios.indexOf(scenario) + 1).padStart(2, '0')}</div><h3>{scenario.title}</h3><p><strong>Situation:</strong> {scenario.situation}</p><p><strong>Approach:</strong> {scenario.approach}</p><p className="mph-outcome"><strong>Expected outcome:</strong> {scenario.outcome}</p></article>)}</div>
    <article className="mph-lab"><div className="mph-lab-copy"><span className="mph-companion-kicker">GUIDED CODE LAB</span><h3>{content.codeTitle}</h3><p>Read the example top to bottom, then replace the demo function with the real SDK, database, queue, or model used by your project.</p><ol><li>Validate the request at the boundary.</li><li>Keep the core operation small and observable.</li><li>Return an explicit result that another system can test.</li></ol></div><pre className="mph-companion-code"><code>{content.code}</code></pre></article>
    <article className="mph-checklist"><h3>Implementation checklist</h3><div>{content.checklist.map(item => <span key={item}>✓ {item}</span>)}</div></article>
  </section>
}
