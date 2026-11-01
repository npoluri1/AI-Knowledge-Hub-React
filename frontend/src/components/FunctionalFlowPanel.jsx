import React, { useMemo, useState } from 'react'
import FlowGraph, { FlowGraphLegend } from './FlowGraph'
import { BlockCode } from './DesignDiagram'
import { buildFunctionalFlow, buildDomainFeatures } from '../data/aiDesignSpace'
import { blockCodeFor, blockImplNote } from '../data/aiDesignSpace/blockCode'
import { featureCodeFor, featureNoteFor } from '../data/aiDesignSpace/featureCode'

// Renders the complete functional-flow diagram + feature grid for a
// context (industry/domain) + design pattern. Every stage block is
// clickable — clicking a block reveals the exact code that implements
// that stage (entry validation, gateway guardrails, agent reasoning,
// retrieval, actions, memory…).
export default function FunctionalFlowPanel({ ctx, pattern, title = '⚡ Functional Flow', intro }) {
  const flow = useMemo(() => buildFunctionalFlow(ctx, pattern), [ctx, pattern])
  const features = useMemo(() => buildDomainFeatures(ctx, pattern), [ctx, pattern])
  const [active, setActive] = useState(null)

  const activeNode = useMemo(
    () => (active ? flow.nodes.find(n => n.id === active) : null),
    [active, flow]
  )

  const code = useMemo(() => {
    if (!activeNode || !pattern) return null
    const res = blockCodeFor({ pattern, ctx, kind: activeNode.kind || 'ai', title: activeNode.label })
    return {
      ...res,
      note: blockImplNote({ pattern, ctx, kind: activeNode.kind, title: activeNode.label }),
      accent: pattern.color || '#89dceb',
    }
  }, [activeNode, pattern, ctx])

  const [activeFeature, setActiveFeature] = useState(null)
  const allFeatures = useMemo(() => [...features.universal, ...features.specific], [features])
  const activeFeatureObj = useMemo(
    () => (activeFeature != null ? allFeatures[activeFeature] : null),
    [activeFeature, allFeatures]
  )
  const featureCode = useMemo(() => {
    if (!activeFeatureObj) return null
    const res = featureCodeFor(activeFeatureObj.name.replace(/ —.*$/, ''), ctx)
    return {
      ...res,
      note: featureNoteFor(activeFeatureObj.name.replace(/ —.*$/, ''), ctx),
      accent: pattern?.color || '#89dceb',
    }
  }, [activeFeatureObj, ctx, pattern])

  return (
    <div className="ads-ff-panel" style={{ '--ff-accent': pattern?.color || '#89dceb' }}>
      <div className="ads-ff-head">
        <div>
          <h3>{title}</h3>
          {intro ? <p>{intro}</p> : <p>Complete functional flow for <strong>{ctx}</strong> — every stage, edge and loop the system walks through.</p>}
          <p className="ads-ff-tip">💡 Click any stage block to see its exact implementation code.</p>
        </div>
        <span className="ads-ff-badge">{flow.nodes.length} stages · {flow.edges.length} flows</span>
      </div>

      <div className="ads-ff-diagram">
        <FlowGraph nodes={flow.nodes} edges={flow.edges} height={300} onSelect={setActive} selectedId={active} />
      </div>
      <FlowGraphLegend />

      {/* Stage chips — quick selection of any stage */}
      {flow.nodes.length > 0 && (
        <div className="ads-ff-stages">
          {flow.nodes.map(n => (
            <button
              type="button"
              key={n.id}
              className={`ads-ff-stage ${active === n.id ? 'on' : ''}`}
              onClick={() => setActive(active === n.id ? null : n.id)}
            >
              {n.label}
            </button>
          ))}
        </div>
      )}

      {/* Code panel for the selected stage */}
      {activeNode && code && (
        <div className="ads-ff-code">
          <BlockCode {...code} label={`${activeNode.label} — this stage`} />
        </div>
      )}

      {/* Feature grid — every card is clickable and reveals its code */}
      <div className="ads-features">
        <span className="ads-domain-label">✨ Features — existing &amp; new, all implementable <small style={{ opacity: 0.7, fontWeight: 600 }}>· click any feature to see its code</small></span>
        <div className="ads-features-grid">
          {allFeatures.map((f, i) => (
            <button
              type="button"
              className={`ads-feature ${activeFeature === i ? 'on' : ''}`}
              key={i}
              onClick={() => setActiveFeature(activeFeature === i ? null : i)}
              aria-expanded={activeFeature === i}
            >
              <span className="ads-feature-icon">{f.icon}</span>
              <span>
                <h4>{f.name}</h4>
                <p>{f.desc}</p>
              </span>
            </button>
          ))}
        </div>
        {activeFeatureObj && featureCode && (
          <div className="ads-ff-code">
            <BlockCode {...featureCode} label={`${activeFeatureObj.name} — implementation`} />
          </div>
        )}
      </div>
    </div>
  )
}
