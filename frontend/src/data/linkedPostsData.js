// AI LinkedIn Posts — content guide for writing high-performing AI posts.

export const lpHeader = {
  title: 'AI LinkedIn Posts',
  subtitle:
    'A complete playbook for writing LinkedIn posts about AI that actually get read — hooks, frameworks, templates, do\'s & don\'ts, and examples — plus a searchable gallery of AI tech-stack visuals you can use.',
  chips: ['Writing Guide', 'Hook Formulas', 'Copy-Paste Templates', 'Image Gallery'],
}

export const lpWhy = [
  { icon: '🎯', title: 'AI is the #1 topic right now', text: 'LinkedIn reach on AI content is 3–5× the platform average. Everyone from engineers to execs is scrolling for "how do I use this" — you just need to be clear, not clever.' },
  { icon: '🧲', title: 'The first 2 lines decide everything', text: 'LinkedIn shows ~2 lines before the "…see more" cut. If the hook doesn\'t stop the scroll, the rest of the post never gets read.' },
  { icon: '🔁', title: 'Comments beat likes', text: 'The algorithm weights dwell time and comments far above likes. Posts that ask a question or spark a (friendly) debate get 5× more distribution.' },
  { icon: '📈', title: 'Consistency compounds', text: 'Posting 3–5×/week for 90 days outperforms one viral post. You\'re building a follower asset, not gambling on a single hit.' },
]

export const lpHooks = [
  {
    cat: 'Contrarian / Hot take',
    color: 'red',
    formula: '"[Common belief] is wrong. Here\'s what nobody tells you."',
    example: '"Everyone says prompt engineering is dead. It\'s not — you\'re just doing it wrong. 3 rules that still matter in 2026:"',
    why: 'Disagreement triggers curiosity + comments. Just make sure you can back it up.',
  },
  {
    cat: 'Numbered list',
    color: 'blue',
    formula: '"N [things] I wish I knew before [X]"',
    example: '"7 RAG mistakes I made so you don\'t have to (each one cost me a week):"',
    why: 'Specificity + a promise of utility. The easiest hook to write well.',
  },
  {
    cat: 'Personal story',
    color: 'green',
    formula: '"I [failed/lost/spent] … and here\'s what it taught me."',
    example: '"I spent 6 months building an AI agent nobody wanted. Here\'s the 1 question I should have asked first:"',
    why: 'Vulnerability builds trust fast. Stories get the highest comment-to-like ratio.',
  },
  {
    cat: 'Result / proof',
    color: 'purple',
    formula: '"How I [result] using [tool] (no fluff)."',
    example: '"How I cut our eval cost 40% by switching to a local LLM — the exact setup:"',
    why: 'Outcomes are concrete and shareable. Numbers make it credible.',
  },
  {
    cat: 'Open loop / curiosity',
    color: 'amber',
    formula: '"Most people get [X] wrong — the fix takes 30 seconds."',
    example: '"Most people tune temperature before prompts. That\'s backwards. Fix this first:"',
    why: 'The brain can\'t leave an open loop unresolved — they click to close it.',
  },
  {
    cat: 'Question',
    color: 'teal',
    formula: '"Which one would you pick: A or B?"',
    example: '"Vector DB for a 50k-doc RAG: pgvector or Qdrant? I benchmarked both — here\'s the answer."',
    why: 'Questions directly invite comments, which the algorithm rewards most.',
  },
]

export const lpFrameworks = [
  {
    name: 'AIDA',
    steps: ['Attention', 'Interest', 'Desire', 'Action'],
    text: 'Hook (Attention) → make them care (Interest) → show the payoff (Desire) → tell them what to do (Action). Best for product/tool posts.',
  },
  {
    name: 'PAS',
    steps: ['Problem', 'Agitate', 'Solve'],
    text: 'Name a painful problem, make it hurt, then hand them the solution. Best for "how to" and educational posts.',
  },
  {
    name: 'Story arc',
    steps: ['Setup', 'Conflict', 'Resolution', 'Lesson'],
    text: 'A 3–5 line story with a real struggle and a real takeaway. Best for personal brand and case studies.',
  },
  {
    name: 'The Listicle',
    steps: ['Promise', 'List (5–10)', 'CTA'],
    text: 'A strong promise line, then scannable numbered points with a one-line payoff each. Best for knowledge dumps.',
  },
  {
    name: 'The Teardown',
    steps: ['Pick a target', 'Show it', 'Fix it'],
    text: 'Take a real (bad) prompt / system / architecture, show what\'s wrong, rewrite it. Extremely shareable for technical audiences.',
  },
]

export const lpPillars = [
  { icon: '📚', name: 'Educational', share: '40%', text: 'Tutorials, "how it works", concept breakdowns, tool comparisons. Your trust-building workhorse.' },
  { icon: '🛠️', name: 'Build-in-public', share: '20%', text: 'Show the messy reality: bugs, decisions, metrics, launches. Attracts builders and recruiters.' },
  { icon: '💬', name: 'Opinion / take', share: '15%', text: 'A stance on an industry trend, tool, or practice. Highest risk, highest comment potential.' },
  { icon: '👤', name: 'Personal story', share: '15%', text: 'Career wins, failures, lessons. Humanizes you and builds the deepest trust.' },
  { icon: '🎉', name: 'Win / milestone', share: '10%', text: 'Certifications, shipped features, new roles. Celebratory but keep the lesson in it.' },
]

export const lpTemplates = [
  {
    title: 'The "I was wrong" post',
    tone: 'Humble + educational',
    body: 'I used to think [X] was the right way to [Y].\n\nThen I [tried/learned] [Z] and it changed everything.\n\nHere\'s the old way vs. the new way:\n\n1. Old: …\n2. New: …\n\nIf you\'re still doing [old way], try [new way] this week — it takes 10 minutes.\n\nAgree or disagree? 👇',
  },
  {
    title: 'The "7 lessons" post',
    tone: 'Value-dense listicle',
    body: 'I [built/learned] [X] for [N] months.\n\nHere are the 7 lessons I wish someone had told me on day one:\n\n1. …\n2. …\n3. …\n…\n7. …\n\nSave this if you\'re starting out. 🔖\n\nWhich one hit hardest?',
  },
  {
    title: 'The "my stack" post',
    tone: 'Show + tell',
    body: 'People keep asking how I [build/run] [X].\n\nHere\'s my exact stack:\n\n• LLM: …\n• Framework: …\n• Vector DB: …\n• Deployment: …\n• Cost: …\n\nIt took me [N] hours to settle on this — steal it.\n\nWhat would you swap?',
  },
  {
    title: 'The "hot take" post',
    tone: 'Confident + debatable',
    body: 'Unpopular opinion: [controversial but defensible claim].\n\nMost people think [common view].\n\nBut here\'s what the data / my experience shows:\n\n1. …\n2. …\n3. …\n\n[Claim] is coming — whether we like it or not.\n\nChange my mind. 👇',
  },
  {
    title: 'The "before/after prompt" teardown',
    tone: 'Technical + practical',
    body: 'Bad prompt:\n"[terrible prompt]"\n\nOutput: [vague/wrong result]\n\nBetter prompt:\n"[improved prompt]"\n\nOutput: [correct result]\n\nThe 3 changes that mattered:\n1. …\n2. …\n3. …\n\nSave this before your next prompt. 🔖',
  },
]

export const lpDosDonts = {
  dos: [
    'Write a hook that works even if only the first 2 lines are visible',
    'Use short paragraphs — 1–2 sentences max, lots of white space',
    'Add a clear call-to-action (question, "save this", "which would you pick")',
    'Reply to every comment in the first hour (this doubles reach)',
    'Post 3–5× a week at a consistent time',
    'Use 3–5 hashtags max, placed at the end',
    'Repurpose one idea across 3 formats (text, carousel, image)',
    'Track what works and double down on the winners',
  ],
  donts: [
    'Don\'t use engagement bait ("Comment YES if you agree") — it now hurts reach',
    'Don\'t drop external links in the body — put them in the first comment',
    'Don\'t write walls of text — break every 1–2 sentences',
    'Don\'t post AI-generated text you haven\'t edited into your own voice',
    'Don\'t post and ghost — the first 60 minutes decide distribution',
    'Don\'t overdo hashtags or tag people who don\'t know you',
    'Don\'t chase virality — chase consistency and a niche',
    'Don\'t copy other posts verbatim — remix the structure, not the words',
  ],
}

export const lpCadence = [
  { time: 'Mon', label: 'Educational / how-to', reason: 'Start the week with value — highest weekday reach.' },
  { time: 'Tue', label: 'Build-in-public update', reason: 'Mid-week momentum; people are in "work mode".' },
  { time: 'Wed', label: 'Opinion / hot take', reason: 'Peak engagement day — put the debatable take here.' },
  { time: 'Thu', label: 'Tutorial or teardown', reason: 'Still high energy; technical content performs well.' },
  { time: 'Fri', label: 'Personal story / reflection', reason: 'People are reflective before the weekend.' },
]

export const lpExamples = [
  { type: 'Educational', hook: 'Vector databases in plain English (no math):', body: 'Imagine a library where every book is reduced to a list of "topics numbers"…\n\nThat\'s an embedding.\n\n• Text → numbers\n• Similar meaning → similar numbers\n• Search → nearest neighbors\n\nThat\'s the whole trick behind RAG.\n\nWant the 30-second version of embeddings? Save this. 🔖' },
  { type: 'Hot take', hook: 'Prompt engineering is not dead — it evolved.', body: 'The people saying it\'s dead were writing "act as a helpful assistant" in 2023.\n\nToday\'s prompt engineering is:\n• System design\n• Tool calling\n• Structured outputs\n• Evals\n\nSame skill, bigger lever.\n\nChange my mind. 👇' },
  { type: 'Build-in-public', hook: 'I shipped my first AI agent this week. It was ugly.', body: 'The first version: 300 lines of spaghetti, no memory, and it lied to me twice.\n\nWhat I fixed:\n1. Split planning from execution\n2. Added a scratchpad\n3. Gave it guardrails\n\nV2 is boring — and that\'s the point.\n\nWhat did your first agent look like?' },
]

export const lpGalleryNote =
  'These images come from the LinkedIn_AI_TechStack_Images folder — AI architecture diagrams, agent patterns, and tech-stack infographics shared on LinkedIn. Search, filter by type, and click to view full-size.'

export const lpFooter =
  'AI LinkedIn Posts · writing guide + templates + visual gallery · source: LinkedIn_AI_TechStack_Images'
