import React, { useState } from 'react'
import { useLang } from './DesignLang'

export default function ShareButtons({ title }) {
  const { t } = useLang()
  const [copied, setCopied] = useState(false)
  const url = typeof window !== 'undefined' ? window.location.href : ''

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = url
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  const enc = encodeURIComponent
  const text = enc(`${title} — AI Design Space`)
  const links = [
    { label: 'WhatsApp', icon: '💬', href: `https://wa.me/?text=${text}%20${enc(url)}` },
    { label: 'X', icon: '𝕏', href: `https://twitter.com/intent/tweet?text=${text}&url=${enc(url)}` },
    { label: 'LinkedIn', icon: '💼', href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}` },
    { label: 'Telegram', icon: '✈️', href: `https://t.me/share/url?url=${enc(url)}&text=${text}` },
  ]

  return (
    <div className="ads-share">
      <button type="button" className="ads-share-btn copy" onClick={copy} title={t('copyLink')}>
        {copied ? '✅ ' + t('copied') : '🔗 ' + t('copyLink')}
      </button>
      {links.map(l => (
        <a key={l.label} className="ads-share-btn" href={l.href} target="_blank" rel="noreferrer" title={l.label} aria-label={l.label}>
          {l.icon} {l.label}
        </a>
      ))}
    </div>
  )
}
