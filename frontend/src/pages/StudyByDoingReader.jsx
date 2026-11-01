import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { SBD_ORIGIN } from '../data/studyByDoingData'
import './StudyByDoingReader.css'
import { useLang } from '../i18n'

export default function StudyByDoingReader() {
  const { t } = useLang()
  const { slug = '' } = useParams()
  const sourceUrl = `${SBD_ORIGIN}/${slug}`
  // The source site blocks cross-origin framing (frame-ancestors 'self'), so the
  // lesson is proxied through the local scan server and served same-origin.
  const embedUrl = `/api/sbd-proxy/${slug}`
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)

  return (
    <div className="sbd-reader">
      <div className="sbd-reader-toolbar">
        <Link to="/study-by-doing" className="sbd-reader-back">← {t('Course map')}</Link>
        <div className="sbd-reader-actions">
          {!loaded && !failed && <span className="sbd-reader-status">{t('Loading source content…')}</span>}
          <a href={sourceUrl} target="_blank" rel="noreferrer" className="sbd-reader-original">
            {t('Open original')} ↗
          </a>
        </div>
      </div>

      <div className={`sbd-reader-frame ${loaded ? 'is-loaded' : ''}`}>
        {!loaded && !failed && (
          <div className="sbd-reader-loading" role="status">
            <span className="sbd-reader-spinner" />
            {t('Loading the complete Study by Doing page…')}
          </div>
        )}
        {failed && (
          <div className="sbd-reader-error" role="alert">
            <strong>{t('This page could not be embedded.')}</strong>
            <p>Live pages may still refuse embedded views. Open it directly to continue reading.</p>
            <a href={sourceUrl} target="_blank" rel="noreferrer" className="sbd-reader-original">{t('Open source page')} ↗</a>
          </div>
        )}
        <iframe
          title="Study by Doing course content"
          src={embedUrl}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
        />
      </div>
    </div>
  )
}
