// Speech layer for the Book Studio: text-to-speech (device voices via the Web
// Speech API) and speech-to-text (SpeechRecognition). Everything runs in the
// browser — iPhone / iPad / Mac ship voices for 60+ languages; Windows/Android
// download more from OS settings.
import React from 'react'

// App language codes → BCP-47 tags the speech engines understand best.
const BCP47 = {
  zh: 'zh-CN', 'zh-hant': 'zh-TW', pt: 'pt-BR', en: 'en-US', es: 'es-ES', ar: 'ar-SA', hi: 'hi-IN',
  te: 'te-IN', ta: 'ta-IN', bn: 'bn-IN', mr: 'mr-IN', gu: 'gu-IN', kn: 'kn-IN', ml: 'ml-IN', pa: 'pa-IN',
  ur: 'ur-PK', fr: 'fr-FR', de: 'de-DE', it: 'it-IT', ja: 'ja-JP', ko: 'ko-KR', ru: 'ru-RU', tr: 'tr-TR',
  id: 'id-ID', ms: 'ms-MY', vi: 'vi-VN', th: 'th-TH', fil: 'fil-PH', tl: 'fil-PH', he: 'he-IL', fa: 'fa-IR',
  sw: 'sw-KE', nl: 'nl-NL', pl: 'pl-PL', uk: 'uk-UA', sv: 'sv-SE', no: 'nb-NO', nb: 'nb-NO', da: 'da-DK',
  fi: 'fi-FI', el: 'el-GR', cs: 'cs-CZ', ro: 'ro-RO', hu: 'hu-HU',
}
export const toBcp47 = code => BCP47[String(code || 'en').toLowerCase()] || code || 'en-US'

export const ttsSupported = typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window
const RecognitionCtor = typeof window !== 'undefined' ? (window.SpeechRecognition || window.webkitSpeechRecognition) : null
export const sttSupported = !!RecognitionCtor

// Split text into speakable sentences (short utterances also dodge Chrome's
// ~15 s cut-off on long utterances and give us natural sync points for video).
export function splitSentences(text, lang = 'en') {
  const clean = String(text || '').replace(/\s+/g, ' ').trim()
  if (!clean) return []
  let parts
  try {
    const seg = new Intl.Segmenter(lang, { granularity: 'sentence' })
    parts = [...seg.segment(clean)].map(s => s.segment.trim())
  } catch {
    parts = clean.match(/[^.!?。！？]+[.!?。！？]*/g) || [clean]
  }
  const out = []
  for (const p of parts.filter(Boolean)) {
    if (p.length <= 240) { out.push(p); continue }
    let buf = ''
    for (const piece of p.split(/(?<=[,;:،，；])\s*/)) {
      if ((buf + ' ' + piece).length > 240 && buf) { out.push(buf.trim()); buf = piece }
      else buf = buf ? `${buf} ${piece}` : piece
    }
    if (buf.trim()) out.push(buf.trim())
  }
  return out
}

function scoreVoice(v) {
  const n = v.name.toLowerCase()
  let s = 0
  if (/premium|enhanced|neural|natural/.test(n)) s += 4
  if (/google|siri|microsoft/.test(n)) s += 2
  if (v.localService) s += 1
  return s
}

export function voicesFor(voices, langCode) {
  const tag = toBcp47(langCode).toLowerCase()
  const base = tag.split('-')[0]
  const exact = voices.filter(v => v.lang.toLowerCase().replace('_', '-') === tag)
  const loose = voices.filter(v => v.lang.toLowerCase().replace('_', '-').split('-')[0] === base && !exact.includes(v))
  return [...exact, ...loose].sort((a, b) => scoreVoice(b) - scoreVoice(a))
}

export function useVoices() {
  const [voices, setVoices] = React.useState(() => (ttsSupported ? window.speechSynthesis.getVoices() : []))
  React.useEffect(() => {
    if (!ttsSupported) return undefined
    const load = () => setVoices(window.speechSynthesis.getVoices())
    load()
    window.speechSynthesis.addEventListener?.('voiceschanged', load)
    return () => window.speechSynthesis.removeEventListener?.('voiceschanged', load)
  }, [])
  return voices
}

// Sentence-queue narrator. Pause = cancel + remember position (the native
// pause() is unreliable on Chrome/Android), so resume always works.
export function useNarrator() {
  const [state, setState] = React.useState({ status: 'idle', index: -1, trackId: null })
  const [rate, setRate] = React.useState(1)
  const job = React.useRef(null)
  const token = React.useRef(0)

  const stopEngine = () => { if (ttsSupported) window.speechSynthesis.cancel() }

  const speakFrom = React.useCallback((j, index) => {
    const my = ++token.current
    stopEngine()
    if (index >= j.sentences.length) {
      setState({ status: 'idle', index: -1, trackId: j.trackId })
      j.onEnd?.()
      return
    }
    const u = new SpeechSynthesisUtterance(j.sentences[index])
    u.lang = toBcp47(j.lang)
    const pool = j.voices || []
    const v = j.twoHosts && pool.length > 1 ? pool[index % 2] : pool[0]
    if (v) u.voice = v
    u.rate = j.rate()
    u.pitch = j.twoHosts && pool.length < 2 && index % 2 ? 0.85 : 1
    u.onstart = () => { if (my === token.current) { setState({ status: 'playing', index, trackId: j.trackId }); j.onIndex?.(index) } }
    u.onend = () => { if (my === token.current) speakFrom(j, index + 1) }
    u.onerror = e => {
      if (my !== token.current || e.error === 'interrupted' || e.error === 'canceled') return
      speakFrom(j, index + 1)
    }
    // Safari sometimes needs a tick after cancel() before speak().
    setTimeout(() => { if (my === token.current) window.speechSynthesis.speak(u) }, 30)
  }, [])

  const rateRef = React.useRef(rate)
  rateRef.current = rate

  const play = React.useCallback((opts) => {
    if (!ttsSupported) return
    job.current = { ...opts, rate: () => rateRef.current }
    setState({ status: 'playing', index: opts.startAt || 0, trackId: opts.trackId })
    speakFrom(job.current, opts.startAt || 0)
  }, [speakFrom])

  const pause = React.useCallback(() => {
    token.current++
    stopEngine()
    setState(s => ({ ...s, status: 'paused' }))
  }, [])

  const resume = React.useCallback(() => {
    if (job.current) speakFrom(job.current, Math.max(0, state.index))
  }, [speakFrom, state.index])

  const seek = React.useCallback(i => { if (job.current) speakFrom(job.current, Math.max(0, i)) }, [speakFrom])

  const stop = React.useCallback(() => {
    token.current++
    stopEngine()
    job.current = null
    setState({ status: 'idle', index: -1, trackId: null })
  }, [])

  // Rate changes apply from the current sentence onward.
  React.useEffect(() => {
    if (state.status === 'playing' && job.current) speakFrom(job.current, Math.max(0, state.index))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rate])

  React.useEffect(() => () => { token.current++; stopEngine() }, [])

  return { ...state, rate, setRate, play, pause, resume, seek, stop }
}

// One-shot dictation → resolves with the final transcript.
export function useDictation(langCode, onFinal) {
  const [listening, setListening] = React.useState(false)
  const [interim, setInterim] = React.useState('')
  const recRef = React.useRef(null)
  const cbRef = React.useRef(onFinal)
  cbRef.current = onFinal

  const start = React.useCallback(() => {
    if (!RecognitionCtor) return
    try { recRef.current?.abort() } catch { /* already stopped */ }
    const rec = new RecognitionCtor()
    rec.lang = toBcp47(langCode)
    rec.interimResults = true
    rec.maxAlternatives = 1
    rec.onresult = e => {
      let fin = ''
      let mid = ''
      for (const r of e.results) (r.isFinal ? (fin += r[0].transcript) : (mid += r[0].transcript))
      setInterim(mid || fin)
      if (fin) cbRef.current?.(fin.trim())
    }
    rec.onend = () => { setListening(false); setInterim('') }
    rec.onerror = () => { setListening(false); setInterim('') }
    recRef.current = rec
    setListening(true)
    rec.start()
  }, [langCode])

  const stop = React.useCallback(() => { try { recRef.current?.stop() } catch { /* noop */ } }, [])
  React.useEffect(() => () => { try { recRef.current?.abort() } catch { /* noop */ } }, [])
  return { listening, interim, start, stop, supported: sttSupported }
}
