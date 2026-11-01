import puppeteer from 'puppeteer-core'
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const BASE = 'http://localhost:5273'

async function main() {
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--disable-dev-shm-usage'] })
  const page = await browser.newPage()
  const errs = []
  page.on('pageerror', e => errs.push(String(e).slice(0,200)))
  await page.goto(BASE + '/mortalapps-hub', { waitUntil: 'domcontentloaded', timeout: 30000 })
  await new Promise(r => setTimeout(r, 2500))
  // Click the System Design section stat to load its rich articles
  const clicked = await page.evaluate(() => {
    const els = [...document.querySelectorAll('.mfull-hero-stat, .mfull-nav-section-header')]
    const target = els.find(e => /System Design/i.test(e.textContent))
    if (target) { target.click(); return true }
    return false
  })
  await new Promise(r => setTimeout(r, 3500))
  const info = await page.evaluate(() => {
    const main = document.querySelector('.mfull-content') || document.body
    const cards = document.querySelectorAll('.mfull-article-card').length
    const text = (main.innerText || '').replace(/\s+/g,' ').trim()
    return { cards, textLen: text.length, sample: text.slice(0, 160) }
  })
  console.log('clicked section:', clicked)
  console.log('article cards rendered:', info.cards)
  console.log('text length:', info.textLen)
  console.log('sample:', info.sample)
  console.log('pageErrors:', errs.length, errs.slice(0,3))
  await browser.close()
}
main().catch(e => { console.error(e); process.exit(1) })
