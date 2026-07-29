// AI Knowledge Hub — File Reference Categories
// Derived from the generated fileManifest.json so the catalog always matches
// the actual contents of all scanned folders.

import fileManifest from '../fileManifest.json'

function humanSize(bytes) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${(bytes / Math.pow(k, i)).toFixed(i === 0 ? 0 : 1)} ${sizes[i]}`
}

function totalSize(files) {
  const bytes = files.reduce((sum, f) => sum + (f.bytes || 0), 0)
  return humanSize(bytes)
}

function getFileSummary(name, ext) {
  const lower = name.toLowerCase()
  if (lower.endsWith('.pdf')) return `PDF document — ${ext.toUpperCase()}`
  if (['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp', '.bmp'].includes(ext)) return `Image asset — ${ext.toUpperCase()}`
  if (lower.endsWith('.md')) return 'Markdown reference document'
  if (lower.endsWith('.txt')) return 'Plain text reference'
  if (lower.endsWith('.html') || lower.endsWith('.htm')) return 'HTML reference page'
  if (lower.endsWith('.json')) return 'JSON data file'
  if (lower.endsWith('.py')) return 'Python script'
  if (lower.endsWith('.js') || lower.endsWith('.jsx')) return 'JavaScript module'
  if (lower.endsWith('.css')) return 'Stylesheet'
  if (lower.endsWith('.csv')) return 'CSV data file'
  if (lower.endsWith('.ipynb')) return 'Jupyter notebook'
  if (lower.endsWith('.docx') || lower.endsWith('.doc')) return 'Word document'
  if (lower.endsWith('.xlsx') || lower.endsWith('.xls')) return 'Excel spreadsheet'
  return 'Reference file'
}

function enrichFiles(files, folder) {
  return files.map(f => ({
    ...f,
    folder,
    summary: f.summary || getFileSummary(f.name, f.ext),
    type: f.type || (f.ext ? f.ext.replace('.', '').toUpperCase() : 'FILE')
  }))
}

// Group all files by source_label (the folder they came from)
const allFiles = fileManifest.allFiles || []
const perSource = fileManifest.perSource || {}
const scanPaths = fileManifest.scanPaths || []

const SOURCE_META = {
  images: { icon: '🖼️', color: '#94e2d5', title: 'Public Images & PDFs', summary: 'Architecture diagrams, infographics, reference images, and PDF documents from public/images.' },
  data: { icon: '📁', color: '#89b4fa', title: 'Public Data & Reference Files', summary: 'Text, markdown, HTML, JSON, Python, and other reference files from public/data.' },
  linkedin_ai_techstack_images: { icon: '💼', color: '#cba6f7', title: 'LinkedIn AI TechStack Images', summary: 'AI and technology infographics, diagrams, and visual references from LinkedIn.' },
  edurekha_docs: { icon: '📚', color: '#f9e2af', title: 'Edureka AI Documentation', summary: 'Curated Edureka AI documents — Generative AI Master Program, phases, tools, and career plans.' },
}

let num = 0
const FILE_CATEGORIES = []

// Build one category per source folder that has files
for (const sp of scanPaths) {
  const slug = sp.slug
  const sourceFiles = allFiles.filter(f => f.source_label === slug)
  if (sourceFiles.length === 0 && !perSource[slug]) continue
  num++
  const meta = SOURCE_META[slug] || {}
  const enriched = enrichFiles(sourceFiles, slug)
  const ps = perSource[slug] || {}
  const imgCount = ps.images || 0
  const pdfCount = ps.pdfs || 0
  const docCount = (ps.documents || 0) + (ps.dataFiles || 0)
  const breakdown = []
  if (imgCount > 0) breakdown.push(`${imgCount} images`)
  if (pdfCount > 0) breakdown.push(`${pdfCount} PDFs`)
  if (docCount > 0) breakdown.push(`${docCount} docs`)
  const countLabel = breakdown.length > 0 ? ` (${breakdown.join(', ')})` : ''

  FILE_CATEGORIES.push({
    id: slug,
    num: String(num),
    icon: meta.icon || '📂',
    title: sp.label || slug,
    heading: `${num}. ${(sp.label || slug).toUpperCase()} — ${enriched.length} files${countLabel}, ${totalSize(enriched)}`,
    summary: meta.summary || `Files from ${sp.dir || slug}`,
    color: meta.color || '#89b4fa',
    files: enriched
  })
}

// Fallback: if scanPaths was empty, build from allFiles source_label grouping
if (FILE_CATEGORIES.length === 0 && allFiles.length > 0) {
  const grouped = {}
  for (const f of allFiles) {
    const key = f.source_label || 'unknown'
    if (!grouped[key]) grouped[key] = []
    grouped[key].push(f)
  }
  let i = 0
  for (const [slug, files] of Object.entries(grouped)) {
    i++
    const meta = SOURCE_META[slug] || {}
    const enriched = enrichFiles(files, slug)
    FILE_CATEGORIES.push({
      id: slug,
      num: String(i),
      icon: meta.icon || '📂',
      title: slug.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      heading: `${i}. ${slug.toUpperCase()} — ${enriched.length} files, ${totalSize(enriched)}`,
      summary: meta.summary || `Files from ${slug}`,
      color: meta.color || '#89b4fa',
      files: enriched
    })
  }
}

export { FILE_CATEGORIES }

export const SUPERAIDEVS_CATEGORY = {
  id: "superaidevs",
  num: "18",
  icon: "💼",
  title: "SUPERAIDEVS — AI Engineering Jobs",
  heading: "SUPERAIDEVS — 996 AI Engineering Jobs (Pages 1-34)",
  summary: "996 AI engineering job listings with titles, companies, tech stacks, descriptions, and project requirements.",
  color: "#f38ba8"
}

export const CATEGORY_ICONS = Object.fromEntries(
  FILE_CATEGORIES.map(c => [c.id, c.icon])
)
CATEGORY_ICONS.superaidevs = '💼'
