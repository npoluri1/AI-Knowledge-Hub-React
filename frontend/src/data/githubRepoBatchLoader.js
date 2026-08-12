const CSV_FIELDS = ['repo', 'html_url', 'stars', 'language', 'description', 'topics', 'source_keyword', 'source_industry']

function parseCsvLine(line) {
  const values = []
  let value = ''
  let quoted = false
  for (let i = 0; i < line.length; i += 1) {
    const char = line[i]
    if (char === '"') {
      if (quoted && line[i + 1] === '"') {
        value += '"'
        i += 1
      } else {
        quoted = !quoted
      }
    } else if (char === ',' && !quoted) {
      values.push(value)
      value = ''
    } else {
      value += char
    }
  }
  values.push(value)
  return values
}

function splitCsv(text) {
  const lines = text.replace(/^\uFEFF/, '').split(/\r?\n/)
  const records = []
  let current = ''
  let quoted = false
  for (const line of lines) {
    current = current ? `${current}\n${line}` : line
    let escaped = false
    for (const char of line) {
      if (char === '"') escaped = !escaped
    }
    quoted = escaped ? !quoted : quoted
    if (!quoted) {
      if (current.trim()) records.push(current)
      current = ''
    }
  }
  if (current.trim()) records.push(current)
  return records
}

function escapeHtmlText(value) {
  return String(value || '').replace(/<[^>]*>/g, '').trim()
}

export function parseRepoBatchCsv(text) {
  const records = splitCsv(text)
  if (records.length < 2) return []
  const header = parseCsvLine(records[0])
  const indices = Object.fromEntries(CSV_FIELDS.map(field => [field, header.indexOf(field)]))
  return records.slice(1).map(record => {
    const values = parseCsvLine(record)
    const row = Object.fromEntries(CSV_FIELDS.map(field => [field, values[indices[field]] || '']))
    const description = escapeHtmlText(row.description) || `${row.repo} open-source project`
    const tags = row.topics.split('|').filter(Boolean)
    const keyword = row.source_keyword.trim()
    const industry = row.source_industry.trim()
    const category = industry || (keyword ? `${keyword} Projects` : 'Imported GitHub Repositories')
    return {
      name: row.repo,
      url: row.html_url,
      stars: Number(row.stars) || 0,
      description,
      category,
      features: [row.language, ...tags, keyword].filter(Boolean).slice(0, 6),
      install: `git clone ${row.html_url}`,
      useCase: description,
      source: 'github_repos.csv',
      sourceKeyword: keyword,
      sourceIndustry: industry,
    }
  }).filter(repo => repo.name && repo.url)
}

export async function loadRepoBatch(batchFile, signal) {
  const response = await fetch(`/github-repos-batches/${batchFile}`, { signal })
  if (!response.ok) throw new Error(`Could not load ${batchFile} (${response.status})`)
  return parseRepoBatchCsv(await response.text())
}

export async function loadRepoBatchManifest(signal) {
  const response = await fetch('/github-repos-batches/manifest.json', { signal })
  if (!response.ok) throw new Error(`Could not load the GitHub batch manifest (${response.status})`)
  return response.json()
}
