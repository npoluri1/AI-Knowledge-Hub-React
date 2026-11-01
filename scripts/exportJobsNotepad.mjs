// exportJobsNotepad.mjs
// ---------------------------------------------------------------------------
// Exports every Singapore AI/ML job (full JD end-to-end) from the combined
// catalog (superaidevs.com + topgenaijobs.com) into a Notepad++-ready plain
// text file with tabular label/value rows and `=======` border separator
// lines. Run from the project root:
//   node scripts/exportJobsNotepad.mjs
// ---------------------------------------------------------------------------
import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

const { AI_JOBS } = await import('../frontend/src/data/jobs.js')
const { TOPGENAI_JOBS } = await import('../frontend/src/data/topgenai_jobs.js')

const NORMALIZED_TOPGENAI = TOPGENAI_JOBS.map(j => ({
  title: j.title, company: j.company, location: j.location || 'Remote',
  salary: j.salary || '', techs: j.skills || [], desc: j.desc || '',
  use_cases: '', url: j.url || '', source: 'topgenaijobs.com',
  experience: j.experience || '', job_type: j.job_type || '',
  mode: j.mode || '', posted: j.posted || '',
}))
const NORMALIZED_SUPERAIDEVS = AI_JOBS.map(j => ({ ...j, source: 'superaidevs.com', techs: j.techs || [] }))
const ALL_JOBS = [...NORMALIZED_SUPERAIDEVS, ...NORMALIZED_TOPGENAI]

const SEA = '──────────────────────────────────────────────────────────────────'
const BAR = '=================================================================================================='
const THIN = '---------------------------------------------------------------------------------------------------'

const clean = (s = '') =>
  String(s).replace(/[\uFFFD]/g, '').replace(/[\u200B-\u200D\uFEFF]/g, '').replace(/[ \t]+/g, ' ').trim()

const padCell = (label, value, width) => {
  const v = clean(value)
  if (v.length <= width) return `| ${label.padEnd(12)} ${v.padEnd(width)} |`
  const first = v.slice(0, width)
  const rest = v.slice(width).match(/.{1,120}/g) || []
  const lines = [`| ${label.padEnd(12)} ${first.padEnd(width)} |`]
  for (const chunk of rest) lines.push(`| ${' '.padEnd(12)} ${chunk.padEnd(width)} |`)
  return lines.join('\n')
}

const isSingapore = (job) => {
  const haystack = clean([job.title, job.company, job.location, job.desc, job.use_cases].join(' ')).toLowerCase()
  return haystack.includes('singapore')
}

const sgJobs = ALL_JOBS.map((j, i) => ({ ...j, _idx: i + 1 })).filter(isSingapore)

let out = ''
out += BAR + '\n'
out += 'AI ENGINEERING JOBS — SINGAPORE  |  FULL JOB DESCRIPTIONS (END TO END)\n'
out += `Generated : ${new Date().toISOString().replace('T', ' ').slice(0, 19)} GMT\n`
out += `Total jobs: ${sgJobs.length}\n`
out += `Sources   : superaidevs.com (996) + topgenaijobs.com (1403)\n`
out += BAR + '\n\n'

for (const job of sgJobs) {
  out += '==================== JOB #' + String(job._idx) + ' ====================\n'
  out += padCell('Title', job.title, 118) + '\n'
  out += padCell('Company', job.company, 118) + '\n'
  out += padCell('Location', job.location, 118) + '\n'
  out += padCell('Salary', job.salary, 118) + '\n'
  out += padCell('Experience', job.experience, 118) + '\n'
  out += padCell('Job Type', job.job_type, 118) + '\n'
  out += padCell('Mode', job.mode, 118) + '\n'
  out += padCell('Source', job.source, 118) + '\n'
  out += padCell('URL', job.url, 118) + '\n'
  out += padCell('Posted', job.posted, 118) + '\n'
  out += padCell('Skills/Tech', (job.techs || []).join(', '), 118) + '\n'
  out += SEA + '\n'
  out += 'FULL JOB DESCRIPTION:\n' + (clean(job.desc) || '—') + '\n\n'
  if (clean(job.use_cases)) {
    out += 'ADDITIONAL DETAILS / RESPONSIBILITIES:\n' + clean(job.use_cases) + '\n\n'
  }
  out += BAR + '\n\n'
}

out += `\nEND OF REPORT — ${sgJobs.length} Singapore jobs exported.\n`
out += BAR + '\n'

const outDir = join(ROOT, 'exports')
mkdirSync(outDir, { recursive: true })
const outFile = join(outDir, 'AI_Jobs_Singapore_All_JDs.txt')
writeFileSync(outFile, out, 'utf8')
console.log(`Wrote ${outFile}`)
console.log(`Singapore jobs: ${sgJobs.length}`)
const bytes = Buffer.byteLength(out, 'utf8')
console.log(`File size: ${(bytes / 1024).toFixed(1)} KB`)