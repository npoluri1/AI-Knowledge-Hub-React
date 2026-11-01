import React, { createContext, useContext, useEffect, useState } from 'react'
import { LANGS, DEFAULT_LANG, translate } from '../data/aiDesignSpace/i18n'

const LangContext = createContext({ lang: DEFAULT_LANG, setLang: () => {}, t: key => key })

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try { return localStorage.getItem('ads-lang') || DEFAULT_LANG } catch { return DEFAULT_LANG }
  })
  useEffect(() => {
    try { localStorage.setItem('ads-lang', lang) } catch { /* ignore */ }
    document.documentElement.dir = (LANGS.find(l => l.code === lang) || LANGS[0]).dir
    document.documentElement.lang = lang
  }, [lang])
  const t = (key, vars) => translate(lang, key, vars)
  return <LangContext.Provider value={{ lang, setLang, t }}>{children}</LangContext.Provider>
}

export const useLang = () => useContext(LangContext)

export function LanguageSwitcher() {
  const { lang, setLang } = useLang()
  const [open, setOpen] = useState(false)
  const current = LANGS.find(l => l.code === lang) || LANGS[0]
  return (
    <div className="ads-lang">
      <button type="button" className="ads-lang-current" onClick={() => setOpen(o => !o)} aria-label="Change language">
        🌐 {current.label}
      </button>
      {open && (
        <div className="ads-lang-menu">
          {LANGS.map(l => (
            <button
              type="button"
              key={l.code}
              className={l.code === lang ? 'active' : ''}
              onClick={() => { setLang(l.code); setOpen(false) }}
            >
              {l.label} {l.code === lang ? '✓' : ''}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
