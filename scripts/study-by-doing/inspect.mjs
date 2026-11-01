// Downloads the source site's shared stylesheet + nav script and reports the
// palette (CSS custom properties) and the menu tree that nav.js builds.
import { writeFile, mkdir } from 'node:fs/promises'

const ORIGIN = 'https://ai.studybydoing.in'
const OUT = new URL('../../.scratch/', import.meta.url)

async function get(path) {
  const res = await fetch(ORIGIN + path, {
    headers: { 'user-agent': 'Mozilla/5.0 (compatible; local-mirror/1.0)' },
  })
  return { status: res.status, body: await res.text() }
}

await mkdir(OUT, { recursive: true })

const css = await get('/assets/course.css?v=44')
const nav = await get('/assets/nav.js?v=29')

await writeFile(new URL('course.css', OUT), css.body)
await writeFile(new URL('nav.js', OUT), nav.body)

// Palette: every `--var: value` declaration in :root-ish blocks.
const vars = {}
for (const [, k, v] of css.body.matchAll(/--([a-zA-Z0-9_-]+)\s*:\s*([^;{}]+);/g)) {
  if (!(k in vars)) vars[k] = v.trim()
}

// Menu tree: nav.js almost certainly holds an array of {label, href} groups.
const groups = [...nav.body.matchAll(/\{\s*(?:title|label|group|name)\s*:\s*['"`]([^'"`]+)['"`]/g)].map(m => m[1])
const hrefs = [...nav.body.matchAll(/href\s*:\s*['"`]([^'"`]+)['"`]/g)].map(m => m[1])
const labels = [...nav.body.matchAll(/(?:title|label|name|text)\s*:\s*['"`]([^'"`]+)['"`]/g)].map(m => m[1])

console.log('css bytes', css.body.length, 'nav.js bytes', nav.body.length)
console.log('\n=== css custom properties (' + Object.keys(vars).length + ') ===')
console.log(JSON.stringify(vars, null, 2).slice(0, 3000))
console.log('\n=== nav groups (' + groups.length + ') ===')
console.log(groups.slice(0, 80))
console.log('\n=== nav labels (' + labels.length + ') ===')
console.log(labels.slice(0, 120))
console.log('\n=== nav hrefs (' + hrefs.length + ') ===')
console.log(hrefs.slice(0, 120))

// Also dump the first 4000 chars of nav.js so the structure is visible.
console.log('\n=== nav.js head ===')
console.log(nav.body.slice(0, 4000))
