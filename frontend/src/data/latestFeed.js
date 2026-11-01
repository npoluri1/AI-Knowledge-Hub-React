// Shared live feed for a page topic: rising GitHub repos + recent headlines.
// Used by the per-page "Latest" strip and by every "Fetch Latest" button.
import { latestTopicFor } from './latestTopics'

const TTL = 30 * 60 * 1000
const sGet = k => { try { const v = JSON.parse(sessionStorage.getItem(k)); return v && Date.now() - v.at < TTL ? v : null } catch { return null } }
const sSet = (k, data) => { try { sessionStorage.setItem(k, JSON.stringify({ at: Date.now(), data })) } catch { /* storage full/blocked */ } }
const sinceDate = days => new Date(Date.now() - days * 864e5).toISOString().slice(0, 10)

export async function fetchRepos(gh, { force = false } = {}) {
  const key = `pulse.gh.${gh}`
  const hit = !force && sGet(key)
  if (hit) return { items: hit.data, at: hit.at }
  const q = `${gh} created:>${sinceDate(90)}`
  const r = await fetch(`/api/github/search?q=${encodeURIComponent(q)}&sort=stars&order=desc&per_page=8`)
  const d = await r.json().catch(() => ({}))
  if (!r.ok) throw new Error(d.error || `GitHub ${r.status}`)
  const items = (d.items || []).slice(0, 8)
  sSet(key, items)
  return { items, at: Date.now() }
}

export async function fetchNews(news, { force = false } = {}) {
  const key = `pulse.news.${news}`
  const hit = !force && sGet(key)
  if (hit) return { items: hit.data, at: hit.at }
  const r = await fetch(`/api/news/topic?q=${encodeURIComponent(news)}&days=30&limit=8${force ? '&fresh=1' : ''}`)
  const d = await r.json().catch(() => ({}))
  const items = d.items || []
  if (items.length) sSet(key, items)
  return { items, at: Date.now() }
}

// Force-refresh the live feed for a path; returns a human summary.
export async function refreshLatest(path) {
  const topic = latestTopicFor(path)
  if (!topic) return null
  const [repos, news] = await Promise.allSettled([fetchRepos(topic.gh, { force: true }), fetchNews(topic.news, { force: true })])
  const nr = repos.status === 'fulfilled' ? repos.value.items.length : 0
  const nn = news.status === 'fulfilled' ? news.value.items.length : 0
  window.dispatchEvent(new CustomEvent('pulse-refresh', { detail: { path } }))
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  if (!nr && !nn) throw new Error('Live sources unreachable — try again shortly')
  return `Live ${time}: ${nr} new repos · ${nn} headlines`
}
