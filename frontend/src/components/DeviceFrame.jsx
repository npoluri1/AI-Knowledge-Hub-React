import React from 'react'
import { DEVICE_MAP } from '../data/devices'
import './DeviceFrame.css'

export default function DeviceFrame({
  device = 'laptop',
  size = 'md',
  image = '',
  title = '',
  tagline = '',
  icon = '✦',
  badge = '',
  caption = true,
  children,
  className = '',
  style,
}) {
  const d = DEVICE_MAP[device] || DEVICE_MAP.laptop
  return (
    <figure className={`df df--${d.frame} df--${size} ${className}`} style={style} aria-label={`${title || 'App screen'} on ${d.label}`}>
      <div className="df-shell">
        <div className="df-bezel">
          {d.frame === 'phone' && <span className="df-notch" aria-hidden="true" />}
          {d.frame === 'tablet' && <span className="df-camera" aria-hidden="true" />}
          <div className="df-screen" style={image ? { '--df-img': `url("${image}")` } : undefined}>
            {children || (
              <div className="df-ui">
                <div className="df-ui-bar">
                  <span className="df-ui-brand">{icon}</span>
                  <span className="df-ui-dots" aria-hidden="true"><i /><i /><i /></span>
                </div>
                <div className="df-ui-body">
                  <span className="df-ui-icon" aria-hidden="true">{icon}</span>
                  <strong>{title || 'AI Knowledge Hub'}</strong>
                  {tagline && <span className="df-ui-tagline">{tagline}</span>}
                  <span className="df-ui-chips" aria-hidden="true"><i /><i /><i /></span>
                </div>
              </div>
            )}
            <span className="df-glare" aria-hidden="true" />
          </div>
        </div>
        {d.frame === 'laptop' && <span className="df-base" aria-hidden="true"><i /></span>}
        {(d.frame === 'desktop' || d.frame === 'pro' || d.frame === 'proMax') && (
          <>
            <span className="df-chin" aria-hidden="true"><i /></span>
            <span className="df-stand" aria-hidden="true"><i /></span>
          </>
        )}
      </div>
      {caption && (
        <figcaption className="df-caption">
          <span className="df-caption-icon" aria-hidden="true">{d.icon}</span>
          <span className="df-caption-label">{d.label}</span>
          {badge && <em>{badge}</em>}
        </figcaption>
      )}
    </figure>
  )
}
