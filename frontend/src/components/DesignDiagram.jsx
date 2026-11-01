import React, { useState } from 'react'
import { blockCodeFor, blockImplNote } from '../data/aiDesignSpace/blockCode'

// Collapsible code panel shown when a diagram block is clicked.
export function BlockCode({ code, lang, label, note, accent = '#89b4fa' }) {
  return (
    <div className="ads-block-code" style={{ '--bc-accent': accent }}>
      <div className="ads-block-code-head">
        <span>💻 {label} — implementation</span>
        <span className="ads-block-code-lang">{lang}</span>
      </div>
      {note && <p className="ads-block-code-note">{note}</p>}
      <pre className="ads-block-code-pre"><code>{code}</code></pre>
    </div>
  )
}

// Vertical layer stack for High-Level Designs.
// layers: [{ tier, title, desc, tech?: string[] }]
// Optional: pattern + ctx to make every layer expandable with real code.
export function LayerStack({ layers, accent = '#89b4fa', pattern, ctx }) {
  const [open, setOpen] = useState(null)
  return (
    <div className="ads-layers">
      {layers.map((layer, i) => {
        const isOpen = open === i
        return (
          <React.Fragment key={`${layer.tier}-${i}`}>
            {i > 0 && <div className="ads-arrow"><span>▼</span></div>}
            <div
              className={`ads-layer ${pattern && ctx ? 'clickable' : ''} ${isOpen ? 'expanded' : ''}`}
              style={{ '--layer-accent': layer.color || accent }}
              onClick={pattern && ctx ? () => setOpen(isOpen ? null : i) : undefined}
              tabIndex={pattern && ctx ? 0 : undefined}
              onKeyDown={pattern && ctx ? e => { if (e.key === 'Enter') setOpen(isOpen ? null : i) } : undefined}
              role={pattern && ctx ? 'button' : undefined}
              aria-expanded={pattern && ctx ? isOpen : undefined}
            >
              <span className="ads-layer-tier">{layer.tier}</span>
              <div className="ads-layer-body">
                <h5>{layer.title}</h5>
                <p>{layer.desc}</p>
                {Array.isArray(layer.tech) && layer.tech.length > 0 && (
                  <div className="ads-chiprow">
                    {layer.tech.map(t => <span className="ads-chip" key={t}>{t}</span>)}
                  </div>
                )}
                {pattern && ctx && (
                  <span className="ads-block-hint">{isOpen ? '− Hide code' : '💻 Show implementation code'}</span>
                )}
              </div>
            </div>
            {isOpen && pattern && ctx && (
              <BlockCode
                {...blockCodeFor({ pattern, ctx, title: layer.title, tier: layer.tier })}
                note={blockImplNote({ pattern, ctx, title: layer.title })}
                accent={layer.color || accent}
              />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

const NODE_KINDS = {
  entry: { label: 'entry', color: '#94e2d5', bg: 'rgba(148,226,213,0.10)' },
  gateway: { label: 'gateway', color: '#89b4fa', bg: 'rgba(137,180,250,0.10)' },
  ai: { label: 'AI', color: '#cba6f7', bg: 'rgba(203,166,247,0.10)' },
  data: { label: 'data', color: '#f9e2af', bg: 'rgba(249,226,175,0.10)' },
  action: { label: 'action', color: '#f5c2e7', bg: 'rgba(245,194,231,0.10)' },
  store: { label: 'store', color: '#89dceb', bg: 'rgba(137,220,235,0.10)' },
}

// Vertical numbered flow for Low-Level Designs.
// nodes: [{ n, title, desc, tech?, kind }]
// Optional: pattern + ctx to make every node expandable with real code.
export function FlowDiagram({ nodes, pattern, ctx }) {
  const [open, setOpen] = useState(null)
  return (
    <div className="ads-flow">
      {nodes.map((node, i) => {
        const kind = NODE_KINDS[node.kind] || NODE_KINDS.store
        const isOpen = open === i
        return (
          <React.Fragment key={`${node.n}-${i}`}>
            {i > 0 && <div className="ads-arrow"><span>▼</span></div>}
            <div
              className={`ads-node ${pattern && ctx ? 'clickable' : ''} ${isOpen ? 'expanded' : ''}`}
              style={{ '--node-accent': kind.color, '--node-bg': kind.bg }}
              onClick={pattern && ctx ? () => setOpen(isOpen ? null : i) : undefined}
              tabIndex={pattern && ctx ? 0 : undefined}
              onKeyDown={pattern && ctx ? e => { if (e.key === 'Enter') setOpen(isOpen ? null : i) } : undefined}
              role={pattern && ctx ? 'button' : undefined}
              aria-expanded={pattern && ctx ? isOpen : undefined}
            >
              <div className="ads-node-head">
                <span className="ads-node-num">{String(node.n).padStart(2, '0')}</span>
                <span className="ads-node-kind">{kind.label}</span>
                {node.tech && <span className="ads-node-tech">{node.tech}</span>}
              </div>
              <h6>{node.title}</h6>
              <p>{node.desc}</p>
              {pattern && ctx && (
                <span className="ads-block-hint">{isOpen ? '− Hide code' : '💻 Show implementation code'}</span>
              )}
            </div>
            {isOpen && pattern && ctx && (
              <BlockCode
                {...blockCodeFor({ pattern, ctx, kind: node.kind, title: node.title })}
                note={blockImplNote({ pattern, ctx, kind: node.kind, title: node.title })}
                accent={kind.color}
              />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

// Compact legend used under diagrams.
export function DiagramLegend() {
  const items = [
    { k: 'entry', label: 'Entry' },
    { k: 'gateway', label: 'Gateway' },
    { k: 'ai', label: 'AI / Agent' },
    { k: 'data', label: 'Data / Retrieve' },
    { k: 'action', label: 'Action / Output' },
    { k: 'store', label: 'Store' },
  ]
  return (
    <div className="ads-legend">
      {items.map(i => {
        const kind = NODE_KINDS[i.k]
        return (
          <span className="ads-legend-item" key={i.k}>
            <span className="ads-legend-dot" style={{ background: kind.color }} />
            {i.label}
          </span>
        )
      })}
    </div>
  )
}
