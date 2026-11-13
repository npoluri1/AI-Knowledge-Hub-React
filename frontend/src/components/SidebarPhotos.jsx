import React from 'react'
import { useLocation } from 'react-router-dom'
import { U } from '../data/menuVisuals'
import { photoIdForText } from '../data/photoTopics'
import './SidebarPhotos.css'

const ROOT = '#page-content'
const MENU = 'aside, nav, [class*="sidebar"], [class*="side-"], [class*="toc"], [class*="menu"], [class*="nav"]'
const SKIP = '.nx-panel, .sf-footer, .app-header, .lang-pop, .nx-dock, .chat-panel, .route-guide, .pulse, .xs, .sbx, .eh, .gallery-tabs, .rf-toolbar, .lesson-nav, .pagination, .breadcrumbs, .filter-bar, .search-bar, .instant-results, .search-results, .tp-sidebar-overlay, .lnd-sidebar-collapsed, .gallery-toolbar, .gallery-nav-btn, .image-modal, .tp-sidebar-toggle, .tp-sidebar-arrow, .back-link'
const ITEM = 'a, button, [role="tab"], [role="button"]'
const EMOJI_ONLY = /^(?:\p{Extended_Pictographic}|\p{Regional_Indicator}|[‍️⃣#*0-9])+$/u
const SKIP_TEXT = /^(back|close|next|previous|prev|expand|collapse|show|hide|search|clear|menu|open|toggle|←|→|›|‹|✕|×|\+|-|…)/i

function inMenu(el) {
  const root = el.closest(MENU)
  if (!root || !root.closest(ROOT)) return false
  return !el.closest(SKIP)
}

function enhance(root) {
  for (const el of root.querySelectorAll(ITEM)) {
    if (el.dataset.sp || el.closest(SKIP) || !inMenu(el)) continue
    if (el.querySelector('img, svg, .photo-icon, .sidebar-photo')) { el.dataset.sp = 'skip'; continue }
    const text = (el.textContent || '').replace(/\s+/g, ' ').trim()
    if (text.length < 2 || text.length > 90) { el.dataset.sp = 'skip'; continue }
    if (SKIP_TEXT.test(text)) { el.dataset.sp = 'skip'; continue }
    const r = el.getBoundingClientRect()
    if (r.width < 48 || r.height < 20) continue

    const emojiEl = [...el.querySelectorAll('span, i, div')].find(n => {
      if (n.children.length) return false
      const t = (n.textContent || '').trim()
      return t && t.length <= 8 && EMOJI_ONLY.test(t)
    })

    if (emojiEl) {
      const er = emojiEl.getBoundingClientRect()
      if (er.width >= 16 && er.width <= 90 && er.height >= 16) {
        const size = Math.round(Math.max(er.width, er.height, 28))
        const emoji = (emojiEl.textContent || '').trim()
        emojiEl.dataset.pi = '1'
        emojiEl.classList.add('photo-icon')
        emojiEl.style.setProperty('--pi', `url("${U(photoIdForText(text, emoji), 160, 160)}")`)
        emojiEl.style.setProperty('--pi-size', `${size}px`)
        emojiEl.style.setProperty('--pi-badge', `${Math.max(12, Math.round(size * .36))}px`)
        emojiEl.dataset.emoji = emoji
        el.dataset.sp = 'icon'
        continue
      }
    }

    el.dataset.sp = '1'
    el.classList.add('sidebar-photo')
    el.style.setProperty('--sp', `url("${U(photoIdForText(text), 160, 160)}")`)
    el.style.setProperty('--sp-size', `${Math.min(34, Math.max(26, Math.round(r.height * .62)))}px`)
  }
}

export default function SidebarPhotos() {
  const { pathname } = useLocation()
  React.useEffect(() => {
    const root = document.getElementById('page-content')
    if (!root) return undefined
    let raf = 0
    const run = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(() => enhance(root)) }
    run()
    const mo = new MutationObserver(run)
    mo.observe(root, { childList: true, subtree: true })
    const timers = [300, 1200, 2600].map(ms => setTimeout(run, ms))
    return () => {
      mo.disconnect()
      cancelAnimationFrame(raf)
      timers.forEach(clearTimeout)
    }
  }, [pathname])
  return null
}
