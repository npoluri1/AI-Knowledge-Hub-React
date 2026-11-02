import { useEffect } from 'react'
import { U } from '../data/menuVisuals'
import { IMG } from '../data/tradingAcademy'

// Adds photos to the existing Trading content without changing it:
//  • the first header/hero of each section gets a full-bleed photo background
//  • every card heading (h3) gets a topic-matched photo thumbnail
// Only attributes and CSS variables are set (no DOM nodes inserted), so React stays in control.

const X = { ...IMG, world: '1526778548025-fa2f459cd5c1', europe: '1467269204594-9661b134dd2b', study: '1434030216411-0b793f4b4173', ai: '1677442136019-21780ecad995' }

export const SECTION_PHOTO = {
  basics: 'paperChart', research: 'laptopAnalytics', taxsaving: 'tax', topstocks: 'candles2', categories: 'portfolio',
  stocks: 'candles', bonds: 'jar', countryfunds: 'world', etfs: 'growth', etfdirectory: 'lineScreen', mutual: 'growth',
  commodities: 'gold', crypto: 'bitcoin', forex: 'currencies', indices: 'lineScreen', options: 'darkChart', countries: 'world',
  advanced: 'trader', sixmonth: 'paperChart', rankings: 'dashboard', strategies: 'chess', apps: 'apps', liveticker: 'screen',
  compare: 'laptopChart', playbook: 'portfolio', advisor: 'ai', liveinv: 'coins', daily: 'phoneTrading', hub: 'singapore',
}

const TOPICS = [
  [/gold|silver|precious|platinum/, 'gold'],
  [/oil|crude|energy|commodit|copper|natural gas|wheat|agri/, 'industry'],
  [/nft|altcoin|wallet|exchange.*crypto|defi|stablecoin/, 'cryptoApp'],
  [/crypto|bitcoin|btc|ethereum|eth\b|blockchain|solana/, 'bitcoin'],
  [/forex|currenc|\bfx\b|usd|eur\b|yen|rupee|pip/, 'currencies'],
  [/real estate|reit|property|housing/, 'house'],
  [/tax|retire|cpf|srs|ppf|nps|401|ira\b|elss|pension/, 'tax'],
  [/bond|treasur|yield|fixed income|coupon|t-bill|ssb|debt/, 'jar'],
  [/dividend|income|passive|payout/, 'coins'],
  [/saving|emergency|cash|money market|deposit/, 'piggy'],
  [/option|call|put|greek|derivativ|futures|leverage|margin/, 'darkChart'],
  [/singapore|sgx|\bsti\b|dbs|ocbc/, 'singapore'],
  [/europe|uk\b|london|germany|ftse|dax/, 'europe'],
  [/india|nifty|sensex|japan|china|hong kong|korea|australia|country|countries|global|world|international|emerging/, 'world'],
  [/risk|stop|loss|hedge|protect|drawdown/, 'chess'],
  [/psycholog|emotion|fear|greed|mindset|discipline|mistake/, 'calm'],
  [/app|broker|platform|moomoo|zerodha|ibkr|tiger|webull|robinhood/, 'apps'],
  [/day trad|swing|scalp|intraday|trader/, 'trader'],
  [/candle|chart|technical|pattern|rsi|macd|moving average|indicator|support|resistance/, 'candles2'],
  [/fundamental|earning|revenue|p\/e|valuation|ratio|balance sheet|profit/, 'revenue'],
  [/live|real-time|realtime|ticker|quote|today/, 'screen'],
  [/mutual|fund|sip|unit trust|robo/, 'growth'],
  [/etf|index|indices|s&p|nasdaq|dow/, 'lineScreen'],
  [/portfolio|allocation|diversif|rebalanc/, 'portfolio'],
  [/strateg|plan|playbook|rule|checklist|step/, 'paperChart'],
  [/compare|vs\b|versus|ranking|top|best/, 'laptopChart'],
  [/research|analy|report|data/, 'laptopAnalytics'],
  [/ai\b|machine learning|algorithm|quant|model/, 'ai'],
  [/learn|basic|beginner|what is|glossary|term|concept/, 'study'],
  [/stock|share|equit|compan|blue chip|growth/, 'candles'],
]
const FALLBACK = ['dashboard', 'screen', 'laptopChart', 'paperChart', 'growth', 'candles2']

export function photoKey(text) {
  const t = (text || '').toLowerCase()
  for (const [re, k] of TOPICS) if (re.test(t)) return k
  let h = 0; for (const c of t) h = (h * 31 + c.charCodeAt(0)) | 0
  return FALLBACK[Math.abs(h) % FALLBACK.length]
}
export const photoUrl = (k, w, h) => U(X[k] || X.dashboard, w, h)

const HERO = '.tp-section-header, .lfa-hero, .li-hero, .dt-hero, .cth-hero, .gir-hero, .tsf-hero'
const HEADS = 'h3'

function enhance(root, section) {
  if (!root.querySelector('[data-tp-hero]')) {
    const hero = root.querySelector(HERO)
    if (hero && !hero.closest('.tx')) {
      hero.dataset.tpHero = '1'
      hero.style.setProperty('--sec-photo', `url("${photoUrl(SECTION_PHOTO[section] || photoKey(hero.textContent), 1600, 600)}")`)
    }
  }
  root.querySelectorAll(HEADS).forEach(h => {
    if (h.dataset.ph || h.closest('.tx, [data-tp-hero], table, button, summary')) return
    const txt = h.textContent.trim()
    if (!txt) return
    const card = h.closest('[class*="card"], [class*="box"], section, article') || h.parentElement
    const ctx = `${txt} ${(card?.textContent || '').slice(0, 140)}`
    let k = photoKey(txt)
    if (FALLBACK.includes(k)) k = photoKey(ctx)
    h.dataset.ph = k
    h.style.setProperty('--ph', `url("${photoUrl(k, 120, 120)}")`)
  })
}

export default function TradingPhotos({ section }) {
  useEffect(() => {
    const root = document.querySelector('.tp-main-content')
    if (!root) return undefined
    let raf = 0
    const run = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(() => enhance(root, section)) }
    run()
    const mo = new MutationObserver(run)
    mo.observe(root, { childList: true, subtree: true })
    return () => { mo.disconnect(); cancelAnimationFrame(raf) }
  }, [section])
  return null
}
