import BOOKS, { BOOK_CATEGORIES } from './booksData'

export const CATEGORY_MAP = Object.fromEntries(BOOK_CATEGORIES.map(category => [category.key, category]))

export function getBookCategory(book) {
  return CATEGORY_MAP[book.cat] || {
    key: book.cat,
    name: book.cat || 'General reading',
    icon: '📖',
    color: '#94a3b8',
    desc: 'A thoughtful addition to the reading library.'
  }
}

export function getBookCoverUrl(book, size = 'L') {
  return `https://covers.openlibrary.org/b/title/${encodeURIComponent(book.title)}-${size}.jpg?default=false`
}

function providerSearch(base, book) {
  const query = `${book.title} ${book.author}`.trim()
  return `${base}${encodeURIComponent(query)}`
}

export function getBookLinks(book) {
  const query = `${book.title} ${book.author}`.trim()
  const publicDomain = Number(book.year) <= 1929
  return {
    publicDomain,
    openLibrary: providerSearch('https://openlibrary.org/search?q=', book),
    archive: providerSearch('https://archive.org/search?query=', book),
    gutenberg: providerSearch('https://www.gutenberg.org/ebooks/search/?query=', book),
    googleBooks: providerSearch('https://books.google.com/books?q=', book),
    amazon: `https://www.amazon.com/s?k=${encodeURIComponent(query + ' book')}`,
  }
}

const CONTENT_TEMPLATES = {
  growth: [
    ['The central idea', 'The promise and the problem this book helps the reader understand.'],
    ['Mindset shifts', 'The beliefs, assumptions, and mental models that shape everyday choices.'],
    ['Practical exercises', 'Small experiments and reflection prompts for applying the ideas.'],
    ['A sustainable practice', 'How to turn the strongest ideas into a repeatable personal system.'],
  ],
  money: [
    ['The opportunity', 'The core wealth-building idea and the problem it is designed to solve.'],
    ['The model', 'How value, income, leverage, and risk fit together in the author’s framework.'],
    ['Execution plan', 'Practical steps for testing the approach without taking reckless risks.'],
    ['Long-term wealth', 'How to measure progress, protect downside, and compound results.'],
  ],
  finance: [
    ['Financial foundations', 'The key concepts, vocabulary, and decisions a reader needs first.'],
    ['The decision framework', 'How the author evaluates risk, time horizon, evidence, and trade-offs.'],
    ['Putting it into practice', 'A practical way to translate the ideas into a personal plan.'],
    ['Common mistakes', 'The behaviours and assumptions that can quietly undermine good decisions.'],
  ],
  business: [
    ['The business thesis', 'The market problem, customer insight, or strategic argument at the heart of the book.'],
    ['Building the engine', 'How product, positioning, distribution, and operations connect.'],
    ['Decisions under uncertainty', 'A way to test assumptions, learn quickly, and allocate resources.'],
    ['Scaling with discipline', 'The systems, people, and metrics needed to grow without losing focus.'],
  ],
  psychology: [
    ['How the mind works', 'The behavioural pattern or psychological question the book explores.'],
    ['Biases and blind spots', 'The shortcuts, emotions, and environmental cues that affect decisions.'],
    ['Better choices', 'Evidence-informed ways to notice patterns and respond more deliberately.'],
    ['Everyday applications', 'Where these ideas show up in work, relationships, and personal goals.'],
  ],
  habits: [
    ['The behaviour loop', 'The cue, routine, and reward mechanics behind the behaviour being discussed.'],
    ['Designing the environment', 'How defaults, friction, and context make good actions easier.'],
    ['Building consistency', 'Tactics for starting small, recovering from misses, and maintaining momentum.'],
    ['Review and improvement', 'A simple feedback loop for measuring what works and adjusting the system.'],
  ],
  leadership: [
    ['The leadership challenge', 'The people, execution, or organisational problem the book addresses.'],
    ['Leading through clarity', 'How to set direction, expectations, and a culture of accountability.'],
    ['The team system', 'Ways to communicate, delegate, coach, and make decisions together.'],
    ['Durable performance', 'How leaders build trust and results beyond a single initiative.'],
  ],
  sales: [
    ['Understanding the customer', 'The audience, pain, desire, and context behind the commercial problem.'],
    ['The message', 'How positioning, proof, storytelling, and offers create relevance.'],
    ['The conversation', 'Practical approaches to discovery, objections, negotiation, and closing.'],
    ['The growth loop', 'How to learn from results and improve acquisition, conversion, and retention.'],
  ],
  communication: [
    ['The communication principle', 'The foundational idea behind clearer, more persuasive human connection.'],
    ['Listening and context', 'How to read the room, ask better questions, and understand the other person.'],
    ['Expression and influence', 'Tools for structure, stories, difficult conversations, and confidence.'],
    ['Practice in real life', 'Simple ways to make the ideas visible in everyday conversations.'],
  ],
  health: [
    ['The health baseline', 'The core body, mind, or lifestyle principle presented by the author.'],
    ['The daily levers', 'The routines, inputs, and environmental factors that influence outcomes.'],
    ['A realistic protocol', 'How to start safely, adapt to personal context, and avoid all-or-nothing thinking.'],
    ['Tracking progress', 'Signals to watch and questions to revisit as the practice develops.'],
  ],
  career: [
    ['The career advantage', 'The skills, choices, or perspective that create a durable professional edge.'],
    ['Building capability', 'How to learn, practise, demonstrate, and communicate valuable skills.'],
    ['Navigating opportunity', 'A framework for projects, relationships, interviews, and career decisions.'],
    ['The next chapter', 'How to turn insight into a focused 30-, 60-, or 90-day plan.'],
  ],
  relationships: [
    ['The human need', 'The relationship pattern, need, or conflict the book helps make visible.'],
    ['Boundaries and trust', 'How clarity, honesty, empathy, and consistency shape connection.'],
    ['Difficult moments', 'Tools for repair, disagreement, emotional regulation, and better conversations.'],
    ['A healthier pattern', 'Small behaviours that make relationships safer and more resilient.'],
  ],
  philosophy: [
    ['The question', 'The timeless question about meaning, character, freedom, or a good life.'],
    ['The philosophy', 'The author’s central argument and the ideas it builds on or challenges.'],
    ['Practising wisdom', 'Ways to use the ideas when circumstances are difficult or uncertain.'],
    ['A life examined', 'Reflection prompts for deciding what to value and how to act.'],
  ],
  tech: [
    ['The technology landscape', 'The problem, system, or shift that makes this book relevant.'],
    ['Core concepts', 'The important ideas, components, and trade-offs a reader should retain.'],
    ['From concept to system', 'How the ideas become a practical workflow, product, or architecture.'],
    ['What to explore next', 'Questions, tools, and adjacent topics for continued learning.'],
  ],
  fiction: [
    ['Setting and premise', 'The world, time, and situation that frame the story.'],
    ['Characters and conflict', 'The people, desires, tensions, and choices that move the narrative.'],
    ['Turning points', 'The major narrative movements to watch for without revealing the ending.'],
    ['Themes to carry forward', 'The questions and emotional ideas that make the story memorable.'],
  ],
  biography: [
    ['Early influences', 'The places, people, and experiences that shaped the subject’s direction.'],
    ['The defining chapters', 'The decisions, setbacks, and opportunities that changed the trajectory.'],
    ['Work and impact', 'The contribution, craft, or leadership that made the life significant.'],
    ['Lessons from the life', 'Questions a reader can use to interpret the story for their own journey.'],
  ],
  history: [
    ['The world before', 'The conditions, institutions, and tensions that set the stage.'],
    ['The turning point', 'The people, events, and decisions that changed the direction of history.'],
    ['Lives inside the story', 'How the larger forces affected communities and individuals.'],
    ['The legacy', 'What endured, what changed, and why the history still matters.'],
  ],
  science: [
    ['The question', 'The natural phenomenon or scientific problem the book investigates.'],
    ['The evidence', 'The observations, experiments, and reasoning that support the explanation.'],
    ['The bigger picture', 'How the idea connects to other systems, discoveries, or human life.'],
    ['Curiosity prompts', 'Questions to revisit after reading and directions for further exploration.'],
  ],
  creativity: [
    ['The creative problem', 'The block, medium, or creative challenge the book makes approachable.'],
    ['The process', 'How ideas are generated, shaped, edited, and brought into the world.'],
    ['Practice and craft', 'Exercises for strengthening taste, skill, and creative confidence.'],
    ['Making it yours', 'How to adapt the ideas to a personal project or creative practice.'],
  ],
  learning: [
    ['How learning works', 'The principles that make understanding, memory, and curiosity more effective.'],
    ['The study system', 'Practical approaches to attention, practice, recall, and feedback.'],
    ['Learning by doing', 'Ways to turn information into projects, explanations, and useful skill.'],
    ['A lifelong loop', 'How to choose the next question and keep improving over time.'],
  ],
  mystery: [
    ['The setup', 'The crime, mystery, or impossible situation that opens the story.'],
    ['Clues and red herrings', 'The trail of evidence and the deliberate misdirections to weigh.'],
    ['Suspects and motives', 'The people with something to hide and the reasons they might act.'],
    ['The reveal', 'How the pieces fit — and what the resolution says about justice and character.'],
  ],
  scifi: [
    ['The premise', 'The future, world, or technology that defines this story.'],
    ['The rules of the world', 'How science, society, and power work in this imagined setting.'],
    ['The human conflict', 'The characters caught between progress, ethics, and survival.'],
    ['The idea that lingers', 'The question about humanity or the future that stays with you.'],
  ],
  romance: [
    ['First meeting', 'The moment the central characters enter each other’s lives.'],
    ['The obstacle', 'The distance, timing, or difference that keeps them apart.'],
    ['The turning point', 'The scene where feelings become undeniable and choices get hard.'],
    ['The resolution', 'How love is tested, chosen, and ultimately defined by action.'],
  ],
  food: [
    ['The culinary idea', 'The technique, ingredient, or philosophy at the heart of the book.'],
    ['Foundations first', 'The core skills and principles every recipe builds on.'],
    ['Signature recipes', 'The standout dishes that show the method in action.'],
    ['Cooking with confidence', 'How to improvise, taste, and adapt the ideas at home.'],
  ],
  travel: [
    ['The journey begins', 'Where the traveler starts and why the road calls.'],
    ['Places and people', 'The landscapes, cultures, and encounters that shape the trip.'],
    ['The turning point', 'The moment of difficulty, discovery, or wonder that changes the traveler.'],
    ['What the trip means', 'The insights carried home about the world and the self.'],
  ],
  poetry: [
    ['The voice', 'The poet’s perspective, tone, and way of seeing the world.'],
    ['Signature themes', 'The recurring subjects — love, nature, grief, joy — that anchor the verse.'],
    ['Craft and music', 'The rhythm, imagery, and wordplay that make the poems sing.'],
    ['Living with the poems', 'Lines to revisit, share, and let shape an ordinary day.'],
  ],
  sports: [
    ['The contest', 'The game, race, or season that frames the story.'],
    ['The athletes', 'The people, their training, and the odds they face.'],
    ['The turning point', 'The moment of crisis, injury, or doubt that tests them.'],
    ['The lesson of the game', 'What winning, losing, and trying reveal about character.'],
  ],
  parenting: [
    ['The parenting principle', 'The core idea about how children grow, learn, and connect.'],
    ['Everyday moments', 'How the approach plays out in meals, tantrums, homework, and bedtime.'],
    ['Hard conversations', 'Tools for feelings, limits, discipline, and repair.'],
    ['A calmer family', 'Small practices that build trust and resilience over time.'],
  ],
  music: [
    ['The musical idea', 'The creative question, technique, or tradition the book explores.'],
    ['Artists and influences', 'The people, scenes, and sounds that shaped the work.'],
    ['The creative process', 'How songs, performances, or careers come together.'],
    ['Listening deeper', 'Ways to hear the music — and your own taste — with fresh ears.'],
  ],
  horror: [
    ['The dread begins', 'The setting, mood, and first hint that something is wrong.'],
    ['The escalation', 'The encounters and choices that tighten the fear.'],
    ['The confrontation', 'The turning point where the horror becomes personal and inescapable.'],
    ['What haunts after', 'The themes of fear, mortality, and the unknown that linger past the last page.'],
  ],
}

export function getBookContents(book) {
  const category = getBookCategory(book)
  const template = CONTENT_TEMPLATES[book.cat] || CONTENT_TEMPLATES.growth
  return template.map(([title, summary], index) => ({
    number: index + 1,
    title,
    summary,
    anchor: `section-${index + 1}`,
    preview: index === 0
      ? `${book.title} by ${book.author} begins with ${summary.toLowerCase()}`
      : `${summary} In this section, look for examples that connect the author’s ideas to ${category.name.toLowerCase()}.`
  }))
}

export function getBookById(id) {
  return BOOKS.find(book => String(book.id) === String(id)) || null
}

export function getRelatedBooks(book, limit = 6) {
  return BOOKS
    .filter(candidate => candidate.cat === book.cat && candidate.id !== book.id)
    .sort((a, b) => (b.rating - a.rating) || (b.top ? -1 : 1))
    .slice(0, limit)
}

export function getLibraryStats() {
  return {
    total: BOOKS.length,
    categories: BOOK_CATEGORIES.length,
    free: BOOKS.filter(book => Number(book.year) <= 1929).length,
    premium: BOOKS.filter(book => Number(book.year) > 1929).length,
    authors: new Set(BOOKS.map(book => book.author)).size,
  }
}

// Legitimate free, unlimited e-book libraries (no piracy sites).
export const FREE_LIBRARIES = [
  {
    name: 'Open Library',
    url: 'https://openlibrary.org/',
    icon: '📖',
    color: '#e8a33d',
    desc: 'Borrow & read millions of free e-books, classics and modern titles with a free account.',
    tags: ['Borrow & read', 'Millions of titles', 'Free account'],
  },
  {
    name: 'Project Gutenberg',
    url: 'https://www.gutenberg.org/',
    icon: '🏛️',
    color: '#7fb069',
    desc: '75,000+ free public-domain e-books in every format, no account needed.',
    tags: ['75,000+ e-books', 'Public domain', 'No account'],
  },
  {
    name: 'Internet Archive',
    url: 'https://archive.org/details/texts',
    icon: '🗄️',
    color: '#5aa9e6',
    desc: 'One of the largest digital libraries on earth — texts, audio, and more, free forever.',
    tags: ['Digital library', 'Texts & audio', 'Free forever'],
  },
  {
    name: 'Google Books',
    url: 'https://books.google.com/',
    icon: '🔎',
    color: '#4285f4',
    desc: 'Search inside millions of books and read free previews and public-domain titles.',
    tags: ['Search inside', 'Free previews', 'Public domain'],
  },
  {
    name: 'Standard Ebooks',
    url: 'https://standardebooks.org/',
    icon: '✨',
    color: '#cba6f7',
    desc: 'Beautifully formatted, fully proofread public-domain e-books, free to download.',
    tags: ['Beautiful editions', 'Proofread', 'Free EPUB'],
  },
  {
    name: 'LibriVox',
    url: 'https://librivox.org/',
    icon: '🎧',
    color: '#f4a259',
    desc: 'Free public-domain audiobooks read by volunteers from around the world.',
    tags: ['Free audiobooks', 'Volunteer narrated', 'Public domain'],
  },
]

export function isFreeBook(book) {
  return Number(book.year) <= 1929
}

// Groups of links shown on a book page: free sources vs buy/premium sources.
export function getBookLinkGroups(book) {
  const links = getBookLinks(book)
  const free = [
    { name: 'Project Gutenberg', icon: '🏛️', url: links.gutenberg, note: 'Free e-book (public domain)' },
    { name: 'Open Library', icon: '📖', url: links.openLibrary, note: 'Borrow or read online' },
    { name: 'Internet Archive', icon: '🗄️', url: links.archive, note: 'Free scan & audio' },
    { name: 'Google Books', icon: '🔎', url: links.googleBooks, note: 'Preview & public-domain copy' },
  ]
  const premium = [
    { name: 'Amazon', icon: '🛒', url: links.amazon, note: 'Paperback, Kindle & Audible' },
    { name: 'Google Books', icon: '📚', url: links.googleBooks, note: 'Buy or full preview' },
  ]
  return { free, premium, publicDomain: links.publicDomain }
}
