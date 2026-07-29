import React from 'react'

export default function CodeBlock({ title, children }) {
  return (
    <details className="code-block" open>
      <summary>{title || 'View Code'}</summary>
      <pre>{children}</pre>
    </details>
  )
}
