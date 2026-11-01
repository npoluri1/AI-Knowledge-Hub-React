import React from 'react'

// Kind-level lesson scaffolding — specific to each library, combined with the
// item's own summary so every lesson reads like real content.
const KIND_META = {
  concept: {
    why: ['Concepts build on each other — master the foundation before the frontier', 'One concept here maps to a design pattern or interview question elsewhere in the hub', 'Reading the summary + key points in one pass beats skimming three shallow sources'],
    pitfalls: ['Treating the definition as the whole idea — the tradeoffs are the test', 'Skipping the "why it matters" — interviewers probe motivation, not recall', 'Memorizing without practicing — explain it out loud or in code'],
    interview: 'Explain this concept to a non-technical person, then to a senior engineer. The gap between those two explanations is what interviews measure.',
  },
  article: {
    why: ['These articles encode production patterns — the systems layer most courses skip', 'Each pattern appears across real architectures: gateways, queues, circuit breakers', 'Pair the article with its topic page for the full picture'],
    pitfalls: ['Applying a pattern without its failure modes — every pattern has a "when not to"', 'Confusing the pattern with the tool (Kafka ≠ event-driven architecture)', 'Ignoring the tradeoff dimension — interviews love the "why not" question'],
    interview: 'Be ready to design this pattern on a whiteboard: draw the components, the failure modes, and the sizing math.',
  },
  quiz: {
    why: ['Predicting output trains the mental Python interpreter better than reading', 'These traps are exactly what production debugging and interviews surface', 'Each reveal explains the mechanism, not just the answer'],
    pitfalls: ['Guessing from intuition instead of tracing the code line by line', 'Missing the mechanism — the reveal\'s "why" is the learning', 'Skimming the reveal before predicting — try first, then check'],
    interview: 'These are verbatim interview traps: mutable defaults, late binding, scope. Master the mechanism and the variants become easy.',
  },
  blog: {
    why: ['Deep dives connect isolated concepts into systems thinking', 'Each article covers a frontier topic: economics, security, architecture', 'The sections mirror how engineers actually communicate findings'],
    pitfalls: ['Reading the summary and skipping the argument — the reasoning is the value', 'Not connecting the article to the hub\'s concept libraries', 'Treating predictions as facts — these are living research areas'],
    interview: 'Bring one insight from this article into your interview answers — specificity is memorable.',
  },
}

const KIND_HOW = {
  concept: [
    'Read the summary as the one-sentence contract — this is the part to recall cold',
    'Map it onto a concrete example from your own work or a known system',
    'Identify its input → process → output shape: what does it consume and produce?',
    'Note the failure mode: where does this concept break or get misused?',
    'Connect it to its neighbors in the topic — concepts earn their place in a chain',
  ],
  article: [
    'Understand the problem the pattern solves — the "before" state matters',
    'Identify the core components and how they interact',
    'Learn the failure modes and the mitigations for each',
    'Know the tradeoffs: when would you NOT use this?',
    'Sketch it once on paper — drawing cements systems thinking',
  ],
}

export default function LessonContent({ item, kind = 'concept', topic, lib }) {
  const meta = KIND_META[kind] || KIND_META.concept
  const howSteps = KIND_HOW[kind] || KIND_HOW.concept
  const accent = (topic && topic.color) || (lib && lib.color) || '#89b4fa'

  return (
    <div className="lhc" style={{ '--lh-accent': accent }}>
      {/* In one sentence */}
      {item.s && (
        <section className="lhc-block lhc-summary">
          <span className="lhc-badge">🎯 In one sentence</span>
          <p>{item.s}</p>
        </section>
      )}

      {/* Key points (articles) */}
      {Array.isArray(item.k) && item.k.length > 0 && (
        <section className="lhc-block">
          <span className="lhc-badge">📌 Key points</span>
          <ul className="lhc-list">
            {item.k.map((k, i) => <li key={i}>✔ {k}</li>)}
          </ul>
        </section>
      )}

      {/* Code (quizzes + examples) */}
      {item.code && (
        <section className="lhc-block lhc-code-block">
          <span className="lhc-badge">💻 Predict the output</span>
          <pre className="lhc-code"><code>{item.code}</code></pre>
          {item.reveal && (
            <div className="lhc-reveal">
              <span className="lhc-badge lhc-badge-reveal">🔎 What actually happens</span>
              <p>{item.reveal}</p>
            </div>
          )}
        </section>
      )}

      {/* How it works — study path */}
      <section className="lhc-block">
        <span className="lhc-badge">⚙️ How to internalize it</span>
        <ol className="lhc-steps">
          {howSteps.map((s, i) => <li key={i}>{s}</li>)}
        </ol>
      </section>

      {/* Why it matters */}
      <section className="lhc-block lhc-why">
        <span className="lhc-badge">💡 Why it matters</span>
        <ul className="lhc-list">
          {meta.why.map((w, i) => <li key={i}>▲ {w}</li>)}
        </ul>
      </section>

      {/* Pitfalls */}
      <section className="lhc-block lhc-pit">
        <span className="lhc-badge">⚠️ Watch out for</span>
        <ul className="lhc-list">
          {meta.pitfalls.map((p, i) => <li key={i}>✕ {p}</li>)}
        </ul>
      </section>

      {/* Interview angle */}
      <section className="lhc-block lhc-interview">
        <span className="lhc-badge">💼 Interview angle</span>
        <p>{meta.interview}</p>
      </section>
    </div>
  )
}
