// ============================================================
// AI DESIGN SPACE — DESIGN THEORY (layman-friendly)
// For each pattern: plain-English explanation, a real-world
// situation you can picture, when to use it, and tradeoffs.
// ============================================================

export const PATTERN_THEORY = {
  agenticRag: {
    layman: 'Think of it like a brilliant new employee who has never seen your company. Before answering anything, they read the rulebooks and files you give them (RAG), then they ask clarifying questions and take actions step by step (agentic). Instead of guessing, they look things up first — so their answers come with receipts.',
    example: 'A bank teller-bot in 2026. A customer asks “what happens if I lose my job?” The bot reads the bank’s loan-policy PDFs (not its general training data), checks the customer’s account, and drafts a tailored 90-day relief plan — citing the exact policy clause it used.',
    situation: 'You have real documents, policies or internal knowledge that an LLM must respect, and users ask open-ended questions that sometimes require multi-step thinking or actions.',
    whenToUse: [
      'Answers must be grounded in documents the model has never seen',
      'Users ask follow-up questions that need memory of the conversation',
      'Some queries end in an action (draft, book, update) not just an answer',
    ],
    benefits: [
      'Fewer hallucinations — answers are cited to source documents',
      'Always up to date — just refresh the knowledge index, no retraining',
      'Handles both “tell me” and “do it” requests in one system',
    ],
    tradeoffs: [
      'Needs a maintained, clean knowledge base or it quietly gets worse',
      'More moving parts (embedding, vector store, agent loop) to operate',
      'Slower than a plain model — retrieval adds a step per query',
    ],
  },
  multiAgentCrew: {
    layman: 'Imagine a small project team instead of one overworked person: a researcher who gathers facts, a writer who drafts, a reviewer who finds mistakes, and a boss (supervisor) who splits the work and checks the result. Each member has one clear job and passes their work to the next.',
    example: 'A weekly market report for a fund. The researcher pulls the latest numbers, the writer turns them into a readable memo, the reviewer double-checks the numbers against sources, and only then does the supervisor send it to the portfolio manager.',
    situation: 'One task has several very different skills inside it, quality matters, and you can split the work into clear hand-offs.',
    whenToUse: [
      'Deliverables need research + drafting + checking (reports, proposals, briefs)',
      'The task is too big for one prompt and benefits from separation of concerns',
      'You want a built-in quality gate before anything is “final”',
    ],
    benefits: [
      'Each agent can be specialised and easier to prompt reliably',
      'Reviewer agents catch mistakes before they reach humans',
      'Work can run in parallel where steps are independent',
    ],
    tradeoffs: [
      'More tokens and API cost — many models, many calls per task',
      'Debugging is harder: which agent went wrong?',
      'Overkill for simple single-step requests',
    ],
  },
  eventStreamAI: {
    layman: 'Normal software waits for a question and answers it. This is the opposite: a firehose of small facts (every click, every sensor reading, every payment) flows past you continuously, and the system makes tiny instant decisions on each one as it goes by — like a quality inspector on a production line who never stops the line.',
    example: 'A ride-hailing app. Every second, thousands of driver locations and ride requests flow in. The system matches them in real time, spots surge demand neighbourhood by neighbourhood, and adjusts prices — all without anyone pressing “refresh”.',
    situation: 'Things happen continuously (transactions, sensor data, user actions) and the value is in reacting immediately, not in batch reports.',
    whenToUse: [
      'Decisions must happen in milliseconds or seconds, not after a nightly job',
      'Data arrives as a constant stream from many sources',
      'You need live dashboards and instant alerts, not weekly reports',
    ],
    benefits: [
      'React to problems or opportunities the moment they appear',
      'Scales to huge event volumes with the same pipeline',
      'Natural fit for IoT, payments, fraud, and live personalisation',
    ],
    tradeoffs: [
      'Harder to operate — needs monitoring, replay, and back-pressure handling',
      'Stateful stream processing is conceptually harder than batch',
      'Retention and replay of events cost storage and care',
    ],
  },
  mcpToolGateway: {
    layman: 'A language model is smart but has no hands. MCP gives it hands: a secure “tool shelf” it can reach for — like the CRM, the database, the ticketing system — but every reach is checked against permission rules first. It’s the difference between an employee who can only chat and one who can actually file the paperwork.',
    example: 'A support agent that resolves a complaint. The model doesn’t just write a nice reply — through MCP it opens the customer’s ticket, refunds a partial amount within its permission limit, and logs the action. Every step is recorded for audit.',
    situation: 'Your AI must do things in other systems (update records, send emails, query databases) safely, with permissions and audit trails.',
    whenToUse: [
      'The AI needs to act in enterprise systems, not just answer',
      'Different tools must be pluggable without rewriting the agent',
      'You need per-tool permissions and an audit log of every action',
    ],
    benefits: [
      'One protocol instead of a custom integration per system',
      'Least-privilege permissions keep AI actions safe',
      'Every tool call is auditable — good for compliance',
    ],
    tradeoffs: [
      'Requires connectors/adpaters per system, which take work',
      'Tool quality limits the agent: a bad tool makes a bad agent',
      'Approval flows add friction for sensitive actions',
    ],
  },
  predictiveMLOps: {
    layman: 'A prediction factory with a disciplined factory line: raw materials (data) come in, get cleaned, get turned into features, a model is trained and tested in a lab, and only the tested one is shipped. Then a supervisor watches the shipped model in production and sends it back for retraining when it drifts.',
    example: 'A supermarket chain forecasting milk demand. The pipeline ingests past sales, weather, and promotions daily, retrains the forecast each night, tests it against yesterday’s reality, and only promotes it if it beats the old model. Store orders are generated before sunrise.',
    situation: 'You have historical data and a measurable prediction to make (demand, churn, risk, failure) and you need it to stay accurate over time.',
    whenToUse: [
      'A prediction drives real decisions (inventory, pricing, risk, maintenance)',
      'The world changes, so the model must be retrained and re-evaluated',
      'You need trust: model versions, evaluation scores, and rollback',
    ],
    benefits: [
      'Accuracy you can measure and trust before shipping',
      'Automatic retraining keeps predictions current',
      'Versioned models make rollback and audit easy',
    ],
    tradeoffs: [
      'Heavy upfront investment in data pipelines and labelling',
      'Models can drift silently if monitoring is skipped',
      'Not the right tool when rules are simpler and stable',
    ],
  },
  fraudRiskReAct: {
    layman: 'This pattern combines a bouncer with a detective. The bouncer (rules + fast models) screens everyone at the door in milliseconds. The detective (a reasoning agent) only steps in when something looks suspicious — it thinks step by step, pulls records, checks the story, and only then decides to let someone in, review them, or kick them out.',
    example: 'A credit-card payment at 3 AM for a large purchase in another country. The bouncer flags it. The detective agent checks the card’s history, the device, the merchant, and the customer’s travel plans — and either approves it or blocks it with an explanation the bank can show the customer.',
    situation: 'You must screen a high volume of events (payments, claims, logins) where most are fine but the rare bad one is very expensive.',
    whenToUse: [
      'Volume is huge but most events are legitimate',
      'False positives cost real money or customer trust',
      'Regulators expect explainable decisions',
    ],
    benefits: [
      'Fast path keeps latency low, agents add depth only where needed',
      'Explanations make decisions defensible to customers and regulators',
      'Agent investigation reduces false positives on complex cases',
    ],
    tradeoffs: [
      'Needs labelled historical data to train the screening models',
      'Agent investigation can be slow and costly for deep cases',
      'Adversaries adapt — models and rules need constant refresh',
    ],
  },
  customerAssistant: {
    layman: 'A friendly, well-mannered front-desk person who remembers you from last time, knows the company’s policies, can actually do some tasks for you, and knows exactly when to call a human. It’s built on memory (remembers you), RAG (knows the rules), and tools (can act).',
    example: 'An airline’s chat assistant. A traveller says “my flight is delayed, what are my options?” The assistant remembers their booking, checks the delay policy, rebooks them on the next flight within policy, and offers a hotel voucher — or hands off to a human for the exception.',
    situation: 'Customers interact repeatedly, ask about policies, and expect help — not just answers — across many channels.',
    whenToUse: [
      'High-volume repetitive questions that follow known policies',
      'Users expect continuity across conversations',
      'You want to deflect tickets while keeping a human escape hatch',
    ],
    benefits: [
      '24/7 coverage at a fraction of human cost',
      'Consistent, policy-correct answers with hand-off when needed',
      'Memory makes each interaction feel personal',
    ],
    tradeoffs: [
      'Needs high-quality knowledge content to be accurate',
      'Bad experiences happen when guardrails are too weak or too strict',
      'Hand-off quality depends on the human agents and context passing',
    ],
  },
  edgeIotAI: {
    layman: 'Instead of sending everything to a far-away cloud, this pattern puts a small brain right next to the machines and sensors. The device decides locally (fast, offline, private) and only sends the interesting bits to the cloud. Like a security guard who checks your badge at the door instead of radioing head office for every visitor.',
    example: 'A factory vibration sensor. The chip on the machine itself detects the early rumble of a failing bearing and stops the machine in 50 milliseconds — even if the internet is down. It uploads only a short summary of the event for the maintenance team’s dashboard.',
    situation: 'Sensors and devices produce data where latency, bandwidth, privacy, or connectivity make cloud-only processing impractical.',
    whenToUse: [
      'Decisions must happen instantly on the device (safety, control)',
      'Network is unreliable, expensive, or a privacy risk',
      'Thousands of devices would flood a central server',
    ],
    benefits: [
      'Millisecond response, works offline',
      'Saves bandwidth and cloud cost — only meaningful data is sent',
      'Data stays local, which helps privacy and compliance',
    ],
    tradeoffs: [
      'Devices have limited compute, so models must be tiny (TinyML)',
      'Updating models on thousands of devices needs OTA tooling',
      'Hardware (NPUs, semiconductors) adds cost and complexity',
    ],
  },
  genContentStudio: {
    layman: 'A content factory on a conveyor belt: brief in one end, finished marketing assets out the other. Between them, separate stations handle the writing, the visuals, the voice, and the assembly — and a human quality inspector approves each piece before it ships. It’s automation with taste.',
    example: 'A fashion e-commerce site launching 5,000 products. The studio writes each product description in the brand’s voice, generates studio-quality images from the product photo, and produces campaign banners — all reviewed by a small creative team before going live.',
    situation: 'You produce a lot of content (copy, images, video, campaigns) that follows repeatable formats but must stay on-brand and accurate.',
    whenToUse: [
      'Content volume exceeds what humans can write or design',
      'Formats are repeatable but need variety (listings, social, email)',
      'Brand voice and factual accuracy must be controlled',
    ],
    benefits: [
      'Dramatically lowers cost and time per asset',
      'Consistent on-brand output at massive scale',
      'Human review keeps quality and legal safety in control',
    ],
    tradeoffs: [
      'Quality varies — review gates are essential',
      'Rights and misuse risk if guardrails are weak',
      'Generative models can still invent facts without grounding',
    ],
  },
  autonomousOps: {
    layman: 'A self-healing house: the plumbing system notices a slow leak, figures out which pipe it is, and calls a plumber (or fixes the valve itself if allowed) — then tells you what it did and why. It detects, diagnoses, fixes, and learns, with a “human approval” switch for anything risky.',
    example: 'A bank’s payment system. At 2 AM, latency spikes. The system detects the anomaly, traces it to a database query storm, applies the documented mitigation (a cache warm), verifies recovery, and pages the on-call engineer with a full summary — or waits for approval if the fix touches customer data.',
    situation: 'You operate systems where downtime is expensive, incident patterns repeat, and you want machines to handle the boring parts of incident response.',
    whenToUse: [
      'Incidents follow repeatable patterns with known runbooks',
      'Response speed matters more than everything else',
      'You can define safe automation and approval boundaries',
    ],
    benefits: [
      'Faster recovery, fewer on-call pages',
      'Consistent, documented incident handling',
      'Every action traceable — good for postmortems and audit',
    ],
    tradeoffs: [
      'Automated actions can be risky — approval gates are mandatory',
      'Needs mature monitoring and runbooks first',
      'Worst case: confident automation of the wrong action',
    ],
  },
  graphKnowledge: {
    layman: 'Instead of just “documents with keywords”, this pattern builds a web of connections: who knows whom, which law links to which regulation, which ingredient causes which effect. Answers come from following the connections, not just matching words — so the AI understands relationships the way a detective understands a case board.',
    example: 'A compliance team investigating a supplier. The graph links the supplier to subsidiaries, their owners, past sanctions, and related contracts. Ask “is there anything suspicious here?” and the AI follows the connections, explaining the chain of evidence.',
    situation: 'The value is in relationships and paths between entities (people, laws, chemicals, parts) — not in single documents.',
    whenToUse: [
      'Questions are about connections: “what links X and Y?”',
      'Same entity appears across many documents with different names',
      'You need traceable reasoning paths for compliance or research',
    ],
    benefits: [
      'Finds relationships keyword search misses',
      'Answers come with an explainable chain of connections',
      'Great for regulated domains: legal, health, finance, supply chain',
    ],
    tradeoffs: [
      'Building and curating the graph is real work',
      'Graph queries need special tooling and expertise',
      'Overkill when simple retrieval answers the questions fine',
    ],
  },
  governedPlatform: {
    layman: 'An AI platform with a rulebook, a bouncer, and a paper trail. Every request is checked against policy, every prompt is screened for tricks and private data, the right model is chosen for the job, the output is scored, and everything is logged. It’s the corporate-governance version of AI: powerful, but supervised.',
    example: 'A bank letting 10,000 employees use AI. Before any prompt reaches a model, the platform checks the employee’s clearance, screens for customer PII, blocks disallowed content, routes to an approved model, and records the whole exchange — so the compliance team can answer any regulator question with a full log.',
    situation: 'Many users, sensitive data, or regulatory scrutiny — you need central control over how AI is used rather than a free-for-all.',
    whenToUse: [
      'Many employees or customers access AI with different entitlements',
      'Regulators require audit trails and data-protection controls',
      'You need consistent guardrails across all AI usage',
    ],
    benefits: [
      'One set of rules, applied everywhere consistently',
      'Complete audit trail for regulators and internal review',
      'Blocks data leakage, injection, and unsafe content centrally',
    ],
    tradeoffs: [
      'Central gatekeeping adds latency to every request',
      'Policy configuration is a discipline of its own',
      'Too-strict guardrails frustrate users and reduce value',
    ],
  },
}
