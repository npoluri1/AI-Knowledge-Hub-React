import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { LanguageProvider } from './i18n'
import './styles.css'
import './responsive.css'

// After a redeploy, a long-lived tab requests hashed chunks/CSS that no longer
// exist. Vite fires `vite:preloadError` for these; reload once to pick up the
// fresh index.html (guarded so it can never loop).
window.addEventListener('vite:preloadError', event => {
  try {
    const last = Number(sessionStorage.getItem('vite-preload-reload') || 0)
    if (Date.now() - last < 10000) return
    sessionStorage.setItem('vite-preload-reload', String(Date.now()))
  } catch { /* storage unavailable — still try one reload */ }
  event.preventDefault()
  window.location.reload()
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </BrowserRouter>
  </React.StrictMode>
)
