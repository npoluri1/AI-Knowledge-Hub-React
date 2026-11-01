// Probe helper for the ai.studybydoing.in mirror.
// Read-only: fetches the sitemap and two representative pages, then reports the
// structural facts the scraper needs (asset URLs, palette, content container).
import { writeFile, mkdir } from 'node:fs/promises'

const ORIGIN = 'https://ai.studybydoing.in'
const OUT = new URL('../../.scratch/', import.meta.url)

async function get(path) {
  const res = await fetch(ORIGIN + path, {
    headers: { 'user-agent': 'Mozilla/5.0 (compatible; local-mirror/1.0)' },
  })
  return { status: res.status, type: res.headers.get('content-type') || '', body: await res.text() }
}

const sitemap = await get('/sitemap.xml')
const locs = [...sitemap.body.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1])

const home = await get('/')
const lesson = await get('/' + (locs.find(u => u.includes('/c1-')) || locs[2]).split('/').pop())

function analyse(label, html) {
  const stylesheets = [...html.matchAll(/<link[^>]+rel="stylesheet"[^>]*href="([^"]+)"/g)].map(m => m[1])
  const styleTags = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map(m => m[1])
  const allCss = styleTags.join('\n')
  const rootVars = [...allCss.matchAll(/--([a-z0-9-]+)\s*:\s*([^;{}]+);/gi)].slice(0, 60)
  const scriptSrc = [...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map(m => m[1])
  const imgs = [...html.matchAll(/<img[^>]+src="([^"]+)"/g)].map(m => m[1])
  return {
    label,
    bytes: html.length,
    stylesheets,
    inlineStyleCount: styleTags.length,
    scriptSrc,
    imgCount: imgs.length,
    sampleImgs: imgs.slice(0, 10),
    rootVars: rootVars.map(([, k, v]) => `--${k}: ${v.trim()}`),
    hasMain: /<main[\s>]/.test(html),
    hasArticle: /<article[\s>]/.test(html),
    hasNextData: html.includes('__NEXT_DATA__'),
    hasNuxt: html.includes('__NUXT__'),
    hasVite: /\/assets\/[A-Za-z0-9_-]+\.js/.test(html),
    bodyClass: (html.match(/<body[^>]*class="([^"]*)"/) || [, ''])[1],
  }
}

await mkdir(OUT, { recursive: true })

const report = {
  sitemapStatus: sitemap.status,
  totalUrls: locs.length,
  firstUrls: locs.slice(0, 5),
  lastUrls: locs.slice(-5),
  home: analyse('home', home.body),
  lesson: analyse('lesson', lesson.body),
}

const nav = [...home.body.matchAll(/<a[^>]+href="(\/[^"#?]*)"[^>]*>([\s\S]*?)<\/a>/g)]
  .map(([, href, inner]) => ({
    href,
    text: inner.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 80),
  }))
  .filter(n => n.text)
report.navSample = nav.slice(0, 60)
report.navCount = nav.length

await writeFile(new URL('probe.json', OUT), JSON.stringify(report, null, 2))
await writeFile(new URL('home.html', OUT), home.body)
await writeFile(new URL('lesson.html', OUT), lesson.body)

console.log(JSON.stringify(report, null, 2))
