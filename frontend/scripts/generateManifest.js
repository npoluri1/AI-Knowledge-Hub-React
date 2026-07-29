import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// ---------------------------------------------------------------------------
// Zero-dependency .env loader
// ---------------------------------------------------------------------------
// Allows EXTRA_SCAN_PATHS to persist across commands (build, regen, dev server)
// without requiring the user to set it in their shell every time. Walks up to
// the project root looking for `.env`. Process env wins over .env so CI /
// shell overrides still work.
function _loadDotEnv() {
  const candidates = [
    path.resolve(__dirname, '../.env'),     // frontend/.env
    path.resolve(__dirname, '../../.env'),  // project-root/.env
  ]
  for (const file of candidates) {
    if (!fs.existsSync(file)) continue
    try {
      const text = fs.readFileSync(file, 'utf8')
      for (const rawLine of text.split(/\r?\n/)) {
        const line = rawLine.trim()
        if (!line || line.startsWith('#')) continue
        const eq = line.indexOf('=')
        if (eq < 0) continue
        const key = line.slice(0, eq).trim()
        let val = line.slice(eq + 1).trim()
        if (
          val.length >= 2 &&
          ((val[0] === '"' && val[val.length - 1] === '"') ||
            (val[0] === "'" && val[val.length - 1] === "'"))
        ) {
          val = val.slice(1, -1)
        }
        if (key && process.env[key] === undefined) process.env[key] = val
      }
      return // first .env found wins
    } catch (_e) {
      /* never crash the manifest build on .env issues */
    }
  }
}
_loadDotEnv()

const PUBLIC_DIR = path.resolve(__dirname, '../public')

// Built-in scan sources (served by Vite / static host at their URL prefix).
const BUILTIN_SOURCES = [
  { dir: path.join(PUBLIC_DIR, 'images'), url: '/images', slug: 'images', label: 'images', kind: 'public' },
  { dir: path.join(PUBLIC_DIR, 'data'),   url: '/data',   slug: 'data',   label: 'data',   kind: 'public' },
]

// Reserved slugs (must match the Python backend's _RESERVED_SLUGS).
const RESERVED_SLUGS = new Set(['images', 'data', 'documents'])

// Branch + extension filters that mirror backend/main.py _SKIP_* sets.
const SKIP_DIR_NAMES = new Set([
  'node_modules', '__pycache__', 'dist', 'build', 'venv', '.venv',
  '.git', '.next', '.cache', '.parcel-cache', '.idea', '.vscode',
  '.svn', '.hg', 'target', 'out',
])
const SKIP_EXT = new Set([
  '.tmp', '.crdownload', '.partial', '.download', '.swp', '.bak',
  '.ds_store', 'thumbs.db',
])

function slugifyPath(absDir) {
  const norm = absDir.replace(/\\/g, '/').replace(/\/+$/g, '')
  let base = path.basename(norm) || norm
  base = base.toLowerCase()
  base = base.replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '')
  if (!base) {
    const digest = crypto.createHash('sha1').update(norm).digest('hex').slice(0, 8)
    base = `ext_${digest}`
  }
  if (RESERVED_SLUGS.has(base)) {
    const digest = crypto.createHash('sha1').update(norm).digest('hex').slice(0, 6)
    base = `${base}_x_${digest}`
  }
  return base.slice(0, 64)
}

function getExtraSources() {
  const raw = (process.env.EXTRA_SCAN_PATHS || '').trim()
  if (!raw) return []
  const candidates = []
  if (raw.startsWith('[')) {
    try {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) {
        candidates.push(...parsed.map(String))
      }
    } catch (_e) {
      // fall through to ;-split mode
    }
  }
  if (candidates.length === 0) {
    candidates.push(...raw.split(/[;\n]/).map(s => s.trim().replace(/^['"]|['"]$/g, '')))
  }
  const out = []
  const seen = new Set()
  for (const p of candidates) {
    if (!p) continue
    let abs
    try {
      abs = path.resolve(p)
    } catch (_e) {
      continue
    }
    if (!fs.existsSync(abs) || !fs.statSync(abs).isDirectory()) continue
    const slug = slugifyPath(abs)
    if (seen.has(slug)) continue
    seen.add(slug)
    out.push({
      dir: abs,
      url: `/api/raw/${slug}`,
      slug,
      label: path.basename(abs) || slug,
      kind: 'extra',
    })
  }
  return out
}

const IMAGE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.bmp'])
const PDF_EXTENSIONS = new Set(['.pdf'])
const DOCUMENT_EXTENSIONS = new Set(['.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.odt', '.ods', '.odp', '.rtf'])

function humanSize(bytes) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${(bytes / Math.pow(k, i)).toFixed(i === 0 ? 0 : 1)} ${sizes[i]}`
}

function extFromName(name) {
  const ext = path.extname(name).toLowerCase()
  return ext ? ext.slice(1).toUpperCase() : 'FILE'
}

function bucketFromExt(ext) {
  if (IMAGE_EXTENSIONS.has(ext)) return 'images'
  if (PDF_EXTENSIONS.has(ext)) return 'pdfs'
  if (DOCUMENT_EXTENSIONS.has(ext)) return 'documents'
  return 'dataFiles'
}

/**
 * Recursively walk a scan root, yielding (rel_path, ext, size) for every
 * scannable file. Subfolders are collapsed under the parent slug; each file's
 * `rel_path` is a POSIX-style path relative to the **original** scan root, e.g.
 * `AI_stuff_docs/foo.docx`.
 *
 * IMPORTANT: `sourceRoot` stays constant through recursion so `path.relative()`,
 * called on the *original* scan root, always returns the full subfolder path
 * (not just the basename). Earlier versions passed the subdirectory as the
 * `root` parameter, which silently stripped the subfolder prefix from the
 * yielded `rel` value and prevented the UI from showing subfolder context.
 */
function* walkScannableFiles(sourceRoot, currentDir = sourceRoot) {
  for (const entry of fs.readdirSync(currentDir, { withFileTypes: true })) {
    const full = path.join(currentDir, entry.name)
    if (entry.isDirectory()) {
      if (SKIP_DIR_NAMES.has(entry.name) || entry.name.startsWith('.')) continue
      yield* walkScannableFiles(sourceRoot, full)
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase()
      if (!ext || SKIP_EXT.has(ext)) continue
      const stat = fs.statSync(full)
      const rel = path.relative(sourceRoot, full).split(path.sep).join('/')
      yield { rel, ext, size: stat.size, mtime: stat.mtimeMs }
    }
  }
}

const SCAN_SOURCES = [...BUILTIN_SOURCES, ...getExtraSources()]

// STATIC_EXTRAS=true (default) — copy files from each EXTRA_SCAN_PATHS root into
// `frontend/public/<slug>/` during the manifest step, and use a static URL prefix
// (`/<slug>/…`) instead of `/api/raw/<slug>/…`. This makes the extras work in
// `vite preview` (no Python backend required) and on any static host.
//
// Historically, extras used `/api/raw/<slug>/…` which only works when the
// FastAPI backend is running AND vite dev is in use (vite preview does NOT
// proxy). Copying into public/ trades ~1-2 GB of disk for full offline support.
//
// Set STATIC_EXTRAS=false to fall back to the proxy URLs (when the Python
// backend IS expected to be running, e.g. during local `npm run dev`).
const STATIC_EXTRAS = process.env.STATIC_EXTRAS !== 'false'

// Safety net: cap how much size we'll copy per extra source. Without this,
// adding a third 5 GB EXTRA_SCAN_PATHS could silently blow the user's disk
// on the next `npm run build` (since vite copies the whole `public/` to
// `dist/`). 500 MB is a sensible default — covers typical AI work dirs but
// blocks accidental multi-GB archives. Overridable via env var:
//   MAX_STATIC_EXTRA_BYTES=2000000000   # 2 GB
const MAX_STATIC_EXTRA_BYTES = Number(process.env.MAX_STATIC_EXTRA_BYTES || 500 * 1024 * 1024)

const allScanned = []
const copySummary = [] // [{ slug, count, bytes }]

for (const source of SCAN_SOURCES) {
  if (!fs.existsSync(source.dir)) continue

  // Decide effective URL prefix and (for extras) a copy target dir under public/.
  const isStaticExtra = STATIC_EXTRAS && source.kind === 'extra'
  const staticRoot = isStaticExtra ? path.join(PUBLIC_DIR, source.slug) : null
  const effectiveUrl = isStaticExtra ? `/${source.slug}` : source.url
  if (staticRoot) fs.mkdirSync(staticRoot, { recursive: true })

  let copiedCount = 0
  let copiedBytes = 0

  for (const { rel, ext, size, mtime } of walkScannableFiles(source.dir)) {
    const encoded = rel.split('/').map(seg => encodeURIComponent(seg)).join('/')

    // Copy each file into its public/<slug>/… mirror when we own it statically.
    if (staticRoot) {
      const srcParts = rel.split('/')
      const srcPath = path.join(source.dir, ...srcParts)
      const dstPath = path.join(staticRoot, ...srcParts)
      try {
        fs.mkdirSync(path.dirname(dstPath), { recursive: true })
        fs.copyFileSync(srcPath, dstPath)
        copiedCount++
        copiedBytes += size
      } catch (e) {
        // If a single file fails to copy (locked, EPERM, etc.), don't take the
        // whole tree down — just skip its static mirror and fall back to the
        // proxy URL for this file only by keeping the original source.url.
        console.warn(`  copyfailed: ${source.slug}/${rel} -> ${e.message}`)
      }
    }

    allScanned.push({
      name: rel,                         // e.g. "AI_stuff_docs/foo.docx"
      display_name: path.basename(rel),  // e.g. "foo.docx"
      url: `${effectiveUrl}/${encoded}`,
      size: humanSize(size),
      bytes: size,
      type: extFromName(rel),
      ext,
      bucket: bucketFromExt(ext),
      folder: source.slug,
      source_label: source.label,
      source_kind: source.kind,
      mtime: mtime,
      mtime_display: new Date(mtime).toISOString().replace('T', ' ').slice(0, 19),
    })
  }

  if (staticRoot) {
    // Roll back copy if it would exceed the per-source cap. Don't half-copy
    // (which would leave the manifest pointing at files that don't exist);
    // nuke what we already wrote and leave the URL pointing at the proxy
    // path so at worst the backend serves them later.
    if (copiedBytes > MAX_STATIC_EXTRA_BYTES) {
      console.warn(
        `  Skipping static copy for [${source.slug}]: ${humanSize(copiedBytes)} ` +
        `exceeds MAX_STATIC_EXTRA_BYTES=${humanSize(MAX_STATIC_EXTRA_BYTES)}. ` +
        `Use STATIC_EXTRAS=false or raise the cap to include this source.`
      )
      try {
        fs.rmSync(staticRoot, { recursive: true, force: true })
      } catch (e) {
        console.warn(`  Could not clean up ${staticRoot}: ${e.message}`)
      }
      // Rewrite this source's URLs back to the proxy version
      const proxyUrl = source.url
      for (let k = allScanned.length - 1; k >= 0; k--) {
        if (allScanned[k].folder === source.slug) {
          allScanned[k].url = allScanned[k].url.replace(
            new RegExp(`^/${source.slug}/`),
            `${proxyUrl}/`
          )
        }
      }
      // Reset counters so the copySummary entry reflects reality (we copied 0)
      copiedCount = 0
      copiedBytes = 0
    }
    copySummary.push({ slug: source.slug, count: copiedCount, bytes: copiedBytes })
  }
}

// Optional cleanup: when STATIC_EXTRAS=true, log a copy rollup so users see
// how much disk was attributed to each extra source. Helps catch runaway copies
// (e.g. ~2 GB LinkedIn mirror) without surprise.
if (copySummary.length > 0) {
  console.log('  Static copies (extras → public/):')
  for (const c of copySummary) {
    console.log(`    • [${c.slug}] ${c.count} files  (${humanSize(c.bytes)})  →  public/${c.slug}/`)
  }
}

// Deduplicate: when the same filename appears in multiple scan paths
// (e.g. stale copies in public/images/ from old STATIC_EXTRAS runs),
// prefer the extra-source entry with the proxy URL over public static paths.
const deduped = new Map()
for (let i = allScanned.length - 1; i >= 0; i--) {
  const entry = allScanned[i]
  const key = entry.name.toLowerCase()
  const existing = deduped.get(key)
  if (!existing) {
    deduped.set(key, entry)
  } else if (entry.source_kind === 'extra' && existing.source_kind !== 'extra') {
    deduped.set(key, entry)
  }
}
allScanned.length = 0
allScanned.push(...deduped.values())

// Stable sort: by slug, then by relative path. Makes the manifest JSON
// reproducible across runs (good for git diffs).
allScanned.sort((a, b) => a.folder.localeCompare(b.folder) || a.name.localeCompare(b.name))

const images = allScanned.filter(f => f.bucket === 'images')
const pdfs = allScanned.filter(f => f.bucket === 'pdfs')
const documents = allScanned.filter(f => f.bucket === 'documents')
const dataFiles = allScanned.filter(f => f.bucket === 'dataFiles')

const projectRoot = path.resolve(__dirname, '../../')
const scanPaths = SCAN_SOURCES.map(s => ({
  slug: s.slug,
  label: s.label,
  kind: s.kind,
  dir: s.kind === 'public' ? path.relative(projectRoot, s.dir) : s.dir,
}))

const perSource = {}
for (const f of allScanned) {
  if (!perSource[f.folder]) {
    perSource[f.folder] = {
      images: 0, pdfs: 0, documents: 0, dataFiles: 0,
      label: f.source_label, kind: f.source_kind,
    }
  }
  perSource[f.folder][f.bucket] = (perSource[f.folder][f.bucket] || 0) + 1
}

const manifest = {
  generatedAt: new Date().toISOString(),
  scanPaths,
  perSource,
  images,
  pdfs,
  documents,
  dataFiles,
  allFiles: allScanned,
  totals: {
    images: images.length,
    pdfs: pdfs.length,
    documents: documents.length,
    dataFiles: dataFiles.length,
    total: allScanned.length,
  },
}

const OUTPUT_FILE = path.resolve(__dirname, '../src/fileManifest.json')
fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true })
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(manifest, null, 2))
console.log(`Manifest written to src/fileManifest.json`)
console.log(`  Scan sources:`)
for (const p of scanPaths) console.log(`    • [${p.kind}] ${p.slug} (${p.label})  -> ${p.dir}`)
console.log(`  Images:    ${images.length}`)
console.log(`  PDFs:      ${pdfs.length}`)
console.log(`  Documents: ${documents.length}`)
console.log(`  Other:     ${dataFiles.length}`)
console.log(`  Total:     ${allScanned.length}`)
