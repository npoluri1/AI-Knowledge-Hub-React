// Shared helpers for the Study-by-Doing study experience: progress, spaced
// repetition, section photos, flashcard deck and per-lesson AI study cards.
import React from 'react'
import { P, U } from './menuVisuals'
import { SBD_SECTIONS } from './studyByDoingData'
import { SBD_GUIDES } from './sbdStudyGuides'
import { streamChat } from '../chatApi'

const lsGet = (k, d) => { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v) } catch { return d } }
const lsSet = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)) } catch { /* storage unavailable */ } }
const EVT = 'sbd-progress'

// ---- lesson progress ("done" checkmarks), saved in this browser ----
export function useProgress() {
  const [done, setDone] = React.useState(() => new Set(lsGet('sbd.done', [])))
  React.useEffect(() => {
    const on = () => setDone(new Set(lsGet('sbd.done', [])))
    window.addEventListener(EVT, on)
    window.addEventListener('storage', on)
    return () => { window.removeEventListener(EVT, on); window.removeEventListener('storage', on) }
  }, [])
  const toggle = slug => {
    const next = new Set(lsGet('sbd.done', []))
    if (next.has(slug)) next.delete(slug)
    else next.add(slug)
    lsSet('sbd.done', [...next])
    window.dispatchEvent(new Event(EVT))
  }
  return { done, toggle }
}

export const sectionProgress = (section, done) => {
  const total = section.lessons.length
  const n = section.lessons.filter(l => done.has(l.slug)).length
  return { n, total, pct: total ? Math.round((n / total) * 100) : 0 }
}

// ---- one curated photo per section ----
const SECTION_PHOTO = {
  'getting-started': P.laptopDev, 'python-fundamentals': P.pythonNote, 'data-structures-algorithms': P.equations,
  'system-design': P.blueprint, 'developer-foundations': P.codeDark, 'containers-deployment': P.serverRacks,
  'kubernetes-orchestration': P.cables, 'advanced-ai-engineering': P.circuit, 'foundations-concepts': P.aiAbstract,
  'prompting-llm-basics': P.typing, 'retrieval-rag': P.library, 'agents-tools': P.robotHand, 'evaluation-production': P.dashboard,
  'fde-capstone': P.whiteboard, 'specialized-topics': P.cubes, 'claude-anthropic': P.aiGen, 'anthropic-api-in-practice': P.htmlCode,
  'anthropic-skills': P.engineer, 'no-code-agentic-ai': P.officePlan, 'langchain-langgraph': P.dataViz,
  'multi-agent-orchestration': P.teamLaptops, 'mlops-llmops': P.analytics, 'ai-assisted-development': P.laptopCode,
  'interoperability-agent-ops': P.earthNight, 'data-app-building': P.graph, 'prompt-context-engineering': P.studyDesk,
  'nlp-transformers': P.bookTitles, 'aws-ai-automation': P.earthNight, 'frontier-agent-capabilities': P.robot,
  'ml-systems-internals': P.pcSetup, 'research-frontier-eng': P.matrix, 'advanced-challenges': P.cyber,
  'inference-cost': P.stockChart, 'fine-tuning': P.robotPiano, 'local-open-models': P.laptopTech, 'safety-red-teaming': P.security,
  'career-interview-prep': P.team, 'enterprise-leadership': P.officeModern, 'projects': P.whiteboard,
  'case-studies-architectures': P.architecture, 'software-testing': P.codeScreen, 'reference': P.libraryShelves,
}
export const sectionPhoto = (id, w = 640, h = 400) => U(SECTION_PHOTO[id] || P.aiAbstract, w, h)

// ---- flashcard deck built from every guide ----
export function buildDeck() {
  const cards = []
  for (const s of SBD_SECTIONS) {
    const g = SBD_GUIDES[s.id]
    if (!g) continue
    cards.push({ id: `${s.id}:big`, section: s.id, sectionTitle: s.title, icon: s.icon, front: `${s.title}: what is the big idea?`, back: g.big, hint: g.analogy })
    cards.push({ id: `${s.id}:hook`, section: s.id, sectionTitle: s.title, icon: s.icon, front: `Memory hook for ${s.title}?`, back: g.hook, hint: g.picture })
    g.points.forEach(([term, plain], i) => cards.push({ id: `${s.id}:p${i}`, section: s.id, sectionTitle: s.title, icon: s.icon, front: term, back: plain }))
    g.qa.forEach(([q, a], i) => cards.push({ id: `${s.id}:q${i}`, section: s.id, sectionTitle: s.title, icon: s.icon, front: q, back: a, interview: true }))
    cards.push({ id: `${s.id}:pit`, section: s.id, sectionTitle: s.title, icon: s.icon, front: `Classic mistake in ${s.title}?`, back: g.pitfall })
  }
  return cards
}

// ---- Leitner spaced repetition: box 1 daily … box 5 every 16 days ----
const BOX_DAYS = [0, 1, 2, 4, 8, 16]
export function useLeitner() {
  const [state, setState] = React.useState(() => lsGet('sbd.leitner', {}))
  const grade = (id, knewIt) => {
    setState(prev => {
      const cur = prev[id]?.box || 1
      const box = knewIt ? Math.min(5, cur + 1) : 1
      const next = { ...prev, [id]: { box, due: Date.now() + BOX_DAYS[box] * 864e5, seen: (prev[id]?.seen || 0) + 1 } }
      lsSet('sbd.leitner', next)
      return next
    })
  }
  const reset = () => { lsSet('sbd.leitner', {}); setState({}) }
  return { state, grade, reset }
}

// ---- optional AI study card for an individual lesson (cached) ----
export async function aiLessonCard(sectionTitle, lessonTitle, onPartial) {
  const key = `sbd.ai.${lessonTitle}`
  const hit = lsGet(key, null)
  if (hit) { onPartial?.(hit); return hit }
  const prompt = `Create a memorable study card for the lesson "${lessonTitle}" (course section: ${sectionTitle}) for an AI engineer preparing for interviews.
Use exactly these markdown sections, short and vivid:
## In one line
## Everyday analogy
## Picture it
## Key ideas
(4 bullets, each "term — plain explanation")
## Code example
(one short, correct, runnable Python snippet in a fenced code block)
## 30-second interview answer
## Remember it
(one catchy mnemonic)
## Big idea to change the world`
  const text = await new Promise((resolve, reject) => {
    let out = ''
    streamChat([{ role: 'system', content: 'You are an expert teacher who makes complex engineering concepts easy to remember. Be accurate; never invent APIs.' }, { role: 'user', content: prompt }],
      tok => { out += tok; onPartial?.(out) }, () => resolve(out), err => reject(new Error(err)))
  })
  if (text.includes('## Code example') && text.length > 400) lsSet(key, text)
  else throw new Error('The free AI service is busy right now — try again shortly.')
  return text
}
