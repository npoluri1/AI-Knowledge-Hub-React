import React from 'react'
import { useLocation } from 'react-router-dom'
import { U } from '../data/menuVisuals'
import { TOPICS, EMOJI, FALLBACK } from '../data/photoTopics'
import './IconPhotos.css'

// Turns emoji icons inside page content into photo tiles that match their
// card's topic (emoji stays as a corner badge). Works on every page without
// per-page edits: it reads the nearest card/section heading to pick a photo.

const EMOJI_ONLY = /^(?:\p{Extended_Pictographic}|\p{Regional_Indicator}|[‍️⃣#*0-9])+$/u
const SKIP = '.route-guide, .pulse, .tx, .vs, .xs, .sbx, .eh, .lib-tile, .lib-dcover, .bs, .olb-hero, .as-hero, .as-group h2, .libh, .nx-panel, button, select, option, input, a.back-link, .photo-icon'
const CARD = '[class*="card"], [class*="tile"], [class*="item"], [class*="section"], [class*="header"], [class*="head"], article, li'

function photoFor(el, emoji) {
  const card = el.closest(CARD) || el.parentElement
  const heading = card?.querySelector('h1, h2, h3, h4, h5, strong, b, [class*="title"], [class*="name"], [class*="label"]')
  const text = `${heading?.textContent || ''} ${card?.textContent?.slice(0, 160) || ''}`.toLowerCase()
  for (const [re, id] of TOPICS) if (re.test(heading?.textContent?.toLowerCase() || '')) return id
  if (EMOJI[emoji]) return EMOJI[emoji]
  for (const [re, id] of TOPICS) if (re.test(text)) return id
  let h = 0
  for (const c of text) h = (h * 31 + c.charCodeAt(0)) | 0
  return FALLBACK[Math.abs(h) % FALLBACK.length]
}

function enhance(root) {
  const nodes = root.querySelectorAll('[class*="icon"], [class*="emoji"], [class*="Icon"]')
  for (const el of nodes) {
    if (el.dataset.pi || el.children.length || el.closest(SKIP)) continue
    const emoji = (el.textContent || '').trim()
    if (!emoji || emoji.length > 8 || !EMOJI_ONLY.test(emoji)) { el.dataset.pi = 'skip'; continue }
    const r = el.getBoundingClientRect()
    if (r.width === 0 && r.height === 0) continue // not laid out yet; retry on next pass
    const size = Math.max(r.width, r.height)
    if (size < 26 || size > 220) { el.dataset.pi = 'skip'; continue }
    const box = Math.round(Math.max(size, 34))
    el.dataset.pi = '1'
    el.classList.add('photo-icon')
    el.style.setProperty('--pi', `url("${U(photoFor(el, emoji), 160, 160)}")`)
    el.style.setProperty('--pi-size', `${box}px`)
    el.style.setProperty('--pi-badge', `${Math.max(12, Math.round(box * 0.36))}px`)
    el.dataset.emoji = emoji // badge drawn by CSS ::after; React's text node is left untouched
  }
}

export default function IconPhotos() {
  const { pathname } = useLocation()
  React.useEffect(() => {
    const root = document.getElementById('page-content')
    if (!root) return undefined
    let raf = 0
    const run = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(() => enhance(root)) }
    run()
    const mo = new MutationObserver(run)
    mo.observe(root, { childList: true, subtree: true })
    const t = setTimeout(run, 1200)
    return () => { mo.disconnect(); cancelAnimationFrame(raf); clearTimeout(t) }
  }, [pathname])
  return null
}
