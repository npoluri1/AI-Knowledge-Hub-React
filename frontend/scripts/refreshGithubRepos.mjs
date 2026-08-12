import fs from 'node:fs'
import path from 'node:path'
import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const frontendDir = path.resolve(__dirname, '..')
const projectRoot = path.resolve(frontendDir, '..')
const configPath = path.join(frontendDir, 'public', 'github-refresh-config.json')
const persistedPath = path.join(frontendDir, 'public', 'github-persisted.json')
const csvSource = process.env.GITHUB_REPOS_CSV || 'C:/Users/Legion/Desktop/github_crawler/github_repos.csv'
const catalogPath = path.join(frontendDir, 'src', 'data', 'githubRepos.js')
const batchOutput = path.join(frontendDir, 'public', 'github-repos-batches')
const token = process.env.GITHUB_TOKEN || ''
const perPage = Math.min(Math.max(Number(process.env.GITHUB_REFRESH_PER_PAGE || 100), 1), 100)

function readJson(filePath, fallback) {
  try { return JSON.parse(fs.readFileSync(filePath, 'utf8')) } catch { return fallback }
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  const temp = `${filePath}.tmp`
  fs.writeFileSync(temp, JSON.stringify(value, null, 2) + '\n', 'utf8')
  fs.renameSync(temp, filePath)
}

function normalize(item, fetchedAt) {
  const url = String(item?.url || item?.html_url || '').trim()
  const name = String(item?.name || '').trim()
  if (!name || !/^https:\/\/github\.com\/[^/]+\/[^/]+/.test(url)) return null
  const topics = Array.isArray(item.topics) ? item.topics.filter(Boolean).slice(0, 20) : []
  const description = String(item.description || `${name} open-source project`).replace(/<[^>]*>/g, '').trim()
  return {
    name,
    url,
    stars: Number(item.stars ?? item.stargazers_count) || 0,
    description,
    category: String(item.category || 'Fetched GitHub Repositories'),
    features: [item.language, ...topics].filter(Boolean).slice(0, 6),
    install: `git clone ${url}`,
    useCase: description,
    language: String(item.language || ''),
    topics,
    updated_at: String(item.updated_at || ''),
    license: String(item.license?.spdx_id || item.license || ''),
    forks: Number(item.forks ?? item.forks_count) || 0,
    open_issues: Number(item.open_issues ?? item.open_issues_count) || 0,
    source: 'github-daily-refresh',
    fetchedAt,
  }
}

async function searchGitHub(query, attempt = 0) {
  const headers = {
    'User-Agent': 'AI-Knowledge-Hub-Daily-Refresh/1.0',
    'Accept': 'application/vnd.github+json',
  }
  if (token) headers.Authorization = `Bearer ${token}`
  const response = await fetch(`https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=updated&order=desc&per_page=${perPage}`, { headers })
  const payload = await response.json()
  if (response.ok) return payload.items || []
  const reset = Number(response.headers.get('x-ratelimit-reset') || 0) * 1000
  if ((response.status === 403 || response.status === 429) && attempt < 2) {
    const waitMs = Math.min(Math.max(reset ? reset - Date.now() : 5000, 1000), 60000)
    console.warn(`GitHub rate limit for ${query}; retrying in ${Math.ceil(waitMs / 1000)}s.`)
    await new Promise(resolve => setTimeout(resolve, waitMs))
    return searchGitHub(query, attempt + 1)
  }
  const resetText = reset > Date.now() ? ` Rate limit resets at ${new Date(reset).toISOString()}.` : ''
  throw new Error(`GitHub search failed (${response.status}): ${payload.message || 'unknown error'}.${resetText}`)
}

function runImporter() {
  return new Promise((resolve, reject) => {
    const python = process.env.PYTHON || 'python'
    const args = [
      path.join(frontendDir, 'scripts', 'importGithubReposCsv.py'),
      '--source', csvSource,
      '--catalog', catalogPath,
      '--output', batchOutput,
      '--batch-size', '5000',
    ]
    const child = spawn(python, args, { cwd: projectRoot, stdio: 'inherit', env: process.env })
    child.on('error', reject)
    child.on('close', code => code === 0 ? resolve() : reject(new Error(`CSV batch importer exited with code ${code}`)))
  })
}

const config = readJson(configPath, { topics: [], query: '' })
const topicGroups = (Array.isArray(config.topics) ? config.topics : [])
  .flatMap(group => String(group).split(/[+\\s]+/))
  .map(topic => topic.trim().toLowerCase())
  .filter(Boolean)
const queries = []
if (topicGroups.length) queries.push(topicGroups.map(topic => `topic:${topic}`).join(' '))
if (config.query) queries.push(String(config.query).trim())
if (process.env.GITHUB_REFRESH_QUERY) queries.push(process.env.GITHUB_REFRESH_QUERY.trim())
if (!queries.length) {
  console.error('No saved GitHub selections found. Use Fetch Latest in the app once, or set GITHUB_REFRESH_QUERY.')
  process.exitCode = 1
} else {
  const fetchedAt = new Date().toISOString()
  const current = readJson(persistedPath, { version: 1, updatedAt: null, items: [] })
  const byUrl = new Map((Array.isArray(current.items) ? current.items : []).map(item => [item.url, item]))
  let fetched = 0
  for (const query of [...new Set(queries)]) {
    const items = await searchGitHub(query)
    fetched += items.length
    for (const item of items) {
      const normalized = normalize(item, fetchedAt)
      if (normalized) byUrl.set(normalized.url, normalized)
    }
  }
  writeJson(persistedPath, { version: 1, updatedAt: fetchedAt, items: [...byUrl.values()] })
  console.log(`Saved ${fetched} fetched results; ${byUrl.size} unique persisted repositories.`)
  await runImporter()
  console.log('Daily GitHub refresh completed.')
}
