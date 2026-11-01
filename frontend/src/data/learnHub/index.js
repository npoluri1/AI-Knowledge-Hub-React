// ============================================================
// AI PREP & LEARNING HUB — AGGREGATOR
// Combines all libraries and exposes lookup helpers.
// ============================================================

import { AI_PREP_TOPICS_A } from './aiPrepTopics'
import { AI_PREP_TOPICS_B } from './aiPrepTopicsB'
import { SYSTEM_DESIGN_LIB } from './systemDesign'
import { AGENT_LIBRARY } from './agentLibrary'
import { AI_INFRA_LIB_A } from './aiInfrastructureA'
import { AI_INFRA_LIB_B } from './aiInfrastructureB'
import { PYTHON_LIB_A } from './pythonConceptsA'
import { PYTHON_LIB_B } from './pythonConceptsB'
import { QUANTUM_LIB_A } from './quantumConceptsA'
import { QUANTUM_LIB_B } from './quantumConceptsB'
import { INTERVIEW_TESTS } from './interviewTests'
import { BLOG_POSTS } from './blogPosts'

export const AI_PREP_TOPICS = [...AI_PREP_TOPICS_A, ...AI_PREP_TOPICS_B]
export const SYSTEM_DESIGN = SYSTEM_DESIGN_LIB
export const AGENT_LIB = AGENT_LIBRARY
export const AI_INFRA = [...AI_INFRA_LIB_A, ...AI_INFRA_LIB_B]
export const PYTHON_LIB = [...PYTHON_LIB_A, ...PYTHON_LIB_B]
export const QUANTUM_LIB = [...QUANTUM_LIB_A, ...QUANTUM_LIB_B]
export { INTERVIEW_TESTS, BLOG_POSTS }

export const COUNT_TESTS = INTERVIEW_TESTS.length
export const COUNT_BLOG = BLOG_POSTS.length

// ----- Library definitions (drives the hub page) -----
export const LEARN_LIBRARIES = [
  { id: 'aiprep', title: 'AI/ML Resources', icon: '🎓', color: '#89b4fa', desc: 'Master AI/ML with AI Prep: adaptive concept library across 12 topics — ML Fundamentals to AI Agents.', topicCount: AI_PREP_TOPICS.length, itemCount: AI_PREP_TOPICS.reduce((n, t) => n + t.concepts.length, 0), topics: AI_PREP_TOPICS, kind: 'concept', route: '/learn/aiprep' },
  { id: 'sysdesign', title: 'System Design', icon: '🏗️', color: '#cba6f7', desc: 'AI Systems, Workflow & Reliability Engineering, Backend Architectures, Observability, Data & Messaging, Distributed Coordination.', topicCount: SYSTEM_DESIGN.length, itemCount: SYSTEM_DESIGN.reduce((n, t) => n + t.items.length, 0), topics: SYSTEM_DESIGN, kind: 'article', route: '/learn/sysdesign' },
  { id: 'agents', title: 'AI Agents', icon: '🤖', color: '#a6e3a1', desc: 'Foundations, Architecture & Patterns, Open Protocols, Memory, Frameworks, Production, Security, Future, Projects.', topicCount: AGENT_LIB.length, itemCount: AGENT_LIB.reduce((n, t) => n + t.items.length, 0), topics: AGENT_LIB, kind: 'concept', route: '/learn/agents' },
  { id: 'infra', title: 'AI Infrastructure', icon: '🖥️', color: '#fab387', desc: 'GPU execution, memory systems, CUDA & compilers, transformers, inference, quantization, distributed training, networking, serving, observability.', topicCount: AI_INFRA.length, itemCount: AI_INFRA.reduce((n, t) => n + t.items.length, 0), topics: AI_INFRA, kind: 'concept', route: '/learn/infra' },
  { id: 'python', title: 'Python Code', icon: '🐍', color: '#94e2d5', desc: 'Interactive "predict the output" quizzes across 12 sections — from async to FastAPI to hidden traps.', topicCount: PYTHON_LIB.length, itemCount: PYTHON_LIB.reduce((n, t) => n + t.items.length, 0), topics: PYTHON_LIB, kind: 'quiz', route: '/learn/python' },
  { id: 'quantum', title: 'Quantum Computing', icon: '⚛️', color: '#f5c2e7', desc: 'Why quantum exists, math foundations, qubits, gates, circuits, algorithms, programming, hardware, error correction, frontier.', topicCount: QUANTUM_LIB.length, itemCount: QUANTUM_LIB.reduce((n, t) => n + t.items.length, 0), topics: QUANTUM_LIB, kind: 'concept', route: '/learn/quantum' },
  { id: 'tests', title: 'AI/ML Interview Tests', icon: '📝', color: '#f38ba8', desc: '12 timed tests across every topic — practice with the full question bank.', topicCount: COUNT_TESTS, itemCount: INTERVIEW_TESTS.reduce((n, t) => n + t.questions.length, 0), route: '/learn/tests', kind: 'tests' },
  { id: 'calculators', title: 'ML Calculators', icon: '🧮', color: '#f9e2af', desc: 'Confusion Matrix Calculator and Synthetic Data Generator — free tools to calculate, visualize, and pressure-test ML metrics.', topicCount: 2, itemCount: 2, route: '/learn/calculators', kind: 'calculators' },
  { id: 'blog', title: 'Blog & Deep Dives', icon: '📰', color: '#b4befe', desc: 'Long-form engineering deep dives: tokenization economics, AGI, post-quantum crypto, context engineering and more.', topicCount: COUNT_BLOG, itemCount: COUNT_BLOG, topics: BLOG_POSTS, kind: 'blog', route: '/learn/blog' },
]

// Count helpers
export const LEARN_TOTAL_ITEMS = LEARN_LIBRARIES.reduce((n, lib) => n + lib.itemCount, 0)
export const LEARN_TOTAL_TOPICS = LEARN_LIBRARIES.reduce((n, lib) => n + lib.topicCount, 0)

// Lookup a library by id
export const getLibrary = id => LEARN_LIBRARIES.find(l => l.id === id)

// Topic lookup: returns { lib, topic } for a given library id + topic index/id
export const getTopic = (libId, topicId) => {
  const lib = getLibrary(libId)
  if (!lib || !lib.topics) return null
  const topic = lib.topics.find(t => String(t.id) === String(topicId))
  return topic ? { lib, topic } : null
}

// Item lookup inside a topic
export const getItem = (libId, topicId, itemId) => {
  const found = getTopic(libId, topicId)
  if (!found) return null
  const { lib, topic } = found
  const items = topic.concepts || topic.items || []
  const item = items.find(i => String(i.id) === String(itemId))
  return item ? { lib, topic, item, items } : null
}

// Topic label: derive "label" from items (concepts key vs items key)
export const topicItems = topic => topic.concepts || topic.items || []

// Simple slugify for ids (already ids in data, kept for safety)
export const slugify = s => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

// Global search index across all libraries
export const buildLearnSearchIndex = () => {
  const out = []
  LEARN_LIBRARIES.forEach(lib => {
    if (!lib.topics) return
    lib.topics.forEach(t => {
      const items = topicItems(t)
      items.forEach(item => {
        out.push({
          type: lib.title,
          label: item.title,
          sub: `${t.title} · ${lib.title}`,
          icon: t.icon || lib.icon,
          to: `/learn/${lib.id}/${t.id}#${item.id}`,
          hay: `${item.title} ${item.s || ''} ${t.title} ${lib.title}`,
        })
      })
      out.push({
        type: `${lib.title} · Topic`,
        label: t.title,
        sub: `${items.length} concepts · ${lib.title}`,
        icon: t.icon || lib.icon,
        to: `/learn/${lib.id}/${t.id}`,
        hay: `${t.title} ${t.desc} ${lib.title}`,
      })
    })
  })
  BLOG_POSTS.forEach(p => out.push({
    type: 'Blog', label: p.title, icon: p.icon || '📰', sub: p.category,
    to: `/learn/blog#${p.id}`, hay: `${p.title} ${p.category} ${p.summary}`,
  }))
  INTERVIEW_TESTS.forEach(t => out.push({
    type: 'Interview Test', label: t.title, icon: t.icon || '📝', sub: `${t.questions.length} questions`,
    to: `/learn/tests#${t.id}`, hay: `${t.title} ${t.desc}`,
  }))
  return out
}
