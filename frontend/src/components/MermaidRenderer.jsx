import React, { useMemo, useState, useCallback } from 'react'

/**
 * MermaidRenderer — Parses Mermaid graph syntax and renders as inline SVG.
 *
 * Supports:
 *   - graph TB / LR / BT / RL directions
 *   - subgraph ... end blocks with labels (including nested)
 *   - Nodes: A[Label], A{Label}, A((Label))
 *   - Edges: A --> B, A -->|text| B
 *   - style definitions with fill/stroke/color
 *   - <br/> in node labels for multi-line
 */

// ====== Parser ======

function parseMermaid(source) {
  if (!source) return { direction: 'TB', nodes: [], edges: [], subgraphs: [], styles: {} }

  const lines = source.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('%%'))

  let direction = 'TB'
  const nodes = {}
  const edges = []
  const subgraphs = []
  const styles = {}
  const classStyles = {}
  let pendingClasses = []
  let subgraphStack = []

  for (const line of lines) {
    // Direction
    const dirMatch = line.match(/^(?:graph|flowchart)\s+(TB|LR|BT|RL)/)
    if (dirMatch) { direction = dirMatch[1]; continue }

    // Subgraph start: subgraph Key [Label Text]
    const sgStart = line.match(/^subgraph\s+(\S+)\s*\[(.+?)\]/)
    if (sgStart) {
      const parentId = subgraphStack.length > 0 ? subgraphStack[subgraphStack.length - 1] : null
      const sg = { id: sgStart[1], label: sgStart[2], nodes: [], children: [], parentId }
      if (parentId) {
        const parent = findSubgraph(subgraphs, parentId)
        if (parent) parent.children.push(sg)
      } else {
        subgraphs.push(sg)
      }
      subgraphStack.push(sg.id)
      continue
    }

    // Subgraph with simple title (no brackets)
    const sgSimple = line.match(/^subgraph\s+(\S+)\s*(.*)/)
    if (sgSimple) {
      const parentId = subgraphStack.length > 0 ? subgraphStack[subgraphStack.length - 1] : null
      const sg = { id: sgSimple[1], label: sgSimple[2] || sgSimple[1], nodes: [], children: [], parentId }
      if (parentId) {
        const parent = findSubgraph(subgraphs, parentId)
        if (parent) parent.children.push(sg)
      } else {
        subgraphs.push(sg)
      }
      subgraphStack.push(sg.id)
      continue
    }

    // Subgraph end
    if (line === 'end') {
      subgraphStack.pop()
      continue
    }

    // Class definitions and assignments used by flowchart diagrams.
    const classDefMatch = line.match(/^classDef\s+(\S+)\s+(.+)/)
    if (classDefMatch) {
      const style = {}
      for (const p of classDefMatch[2].split(',')) {
        const kv = p.split(':')
        if (kv.length === 2) {
          const key = kv[0].trim(); let val = kv.slice(1).join(':').trim()
          if (val.startsWith('##')) val = '#' + val.slice(2)
          if (key === 'fill') style.fill = val
          else if (key === 'stroke') style.stroke = val
          else if (key === 'stroke-width') style.strokeWidth = val
          else if (key === 'color') style.color = val
        }
      }
      classStyles[classDefMatch[1]] = style
      continue
    }
    const classMatch = line.match(/^class\s+(.+)\s+(\S+)$/)
    if (classMatch) {
      classMatch[1].split(',').forEach(name => { pendingClasses.push({ name: name.trim(), className: classMatch[2] }) })
      continue
    }

    // Style: style NodeName fill:#hex,stroke:#hex,stroke-width:Npx
    const styleMatch = line.match(/^style\s+(\S+)\s+(.+)/)
    if (styleMatch) {
      const name = styleMatch[1]
      const parts = styleMatch[2].split(',')
      const style = {}
      for (const p of parts) {
        const kv = p.split(':')
        if (kv.length === 2) {
          const key = kv[0].trim()
          let val = kv[1].trim()
          // Normalize double-hash fill/color values (##3b82f6 => #3b82f6)
          if (val.startsWith('##')) val = '#' + val.slice(2)
          if (key === 'fill') style.fill = val
          else if (key === 'stroke') style.stroke = val
          else if (key === 'stroke-width') style.strokeWidth = val
          else if (key === 'color') style.color = val
        }
      }
      styles[name] = style
      continue
    }

    // Edge: A -->|label| B  or  A --> B
    const edgeMatch = line.match(/^(\S+)\s*(--+>|==+|\.-+->|-.->|==>)\s*(?:\|(.+?)\|)?\s*(\S+)/)
    if (edgeMatch) {
      edges.push({ from: edgeMatch[1], to: edgeMatch[4], arrow: edgeMatch[2], label: edgeMatch[3] || '' })
      continue
    }

    // Mermaid flowchart edges may use a quoted/HTML-labeled node token.
    const flowEdgeMatch = line.match(/^(\w+)\s*(--+>|==+|\.-+->|-.->|==>)\s*(?:\|(.+?)\|)?\s*(\w+)/)
    if (flowEdgeMatch) {
      edges.push({ from: flowEdgeMatch[1], to: flowEdgeMatch[4], arrow: flowEdgeMatch[2], label: flowEdgeMatch[3] || '' })
      continue
    }

    // Node: A[Label] or A((Label)) or A{Label}
    const nodeMatch = line.match(/^(\S+)\s*(\[([^\]]*)\]|\(\(([^)]*)\)\)|\{([^}]*)\})/)
    if (nodeMatch) {
      const id = nodeMatch[1]
      const label = (nodeMatch[3] || nodeMatch[4] || nodeMatch[5] || id).replace(/^['"]|['"]$/g, '').replace(/<b>|<\/b>/g, '')
      const shape = nodeMatch[2].startsWith('[') ? 'rect' :
                    nodeMatch[2].startsWith('((') ? 'circle' : 'diamond'
      const nodeClass = pendingClasses.find(item => item.name === id)?.className
      nodes[id] = { id, label, shape, className: nodeClass }
      // Track which subgraph this node belongs to
      if (subgraphStack.length > 0) {
        const parentId = subgraphStack[subgraphStack.length - 1]
        const parent = findSubgraph(subgraphs, parentId)
        if (parent && !parent.nodes.some(n => n.id === id)) {
          parent.nodes.push({ id, label, shape })
        }
      }
      continue
    }
  }

  for (const assignment of pendingClasses) {
    if (nodes[assignment.name]) nodes[assignment.name].className = assignment.className
  }
  for (const node of Object.values(nodes)) {
    if (node.className && classStyles[node.className]) styles[node.id] = { ...(styles[node.id] || {}), ...classStyles[node.className] }
  }
  return { direction, nodes: Object.values(nodes), edges, subgraphs, styles }
}

function findSubgraph(subgraphs, id) {
  for (const sg of subgraphs) {
    if (sg.id === id) return sg
    for (const child of sg.children || []) {
      const found = findSubgraph([child], id)
      if (found) return found
    }
  }
  return null
}

function getAllNodesInSubgraph(sg, allNodes) {
  const ids = new Set()
  for (const n of sg.nodes || []) {
    if (n.shape) ids.add(n.id)
  }
  for (const child of sg.children || []) {
    const childIds = getAllNodesInSubgraph(child, allNodes)
    childIds.forEach(id => ids.add(id))
  }
  return ids
}

function positionSubgraphNodes(sg, baseX, baseY, nodes, positions, processedNodes, isHorizontal, BOX_W, BOX_H, SG_PAD, GAP_X, GAP_Y) {
  // Position this subgraph's own nodes
  const sgAllNodes = getAllNodesInSubgraph(sg, nodes)
  const sgNodeList = nodes.filter(n => sgAllNodes.has(n.id))
  if (sgNodeList.length === 0) {
    sg.width = SG_PAD * 2
    sg.height = SG_PAD * 2
    return
  }

  let maxW = 0
  let totalH = 0

  if (isHorizontal) {
    let nx = SG_PAD
    let ny = SG_PAD + 30
    for (const node of sgNodeList) {
      positions[node.id] = { x: baseX + nx, y: baseY + ny }
      processedNodes.add(node.id)
      nx += BOX_W + GAP_X
      maxW = Math.max(maxW, nx)
      totalH = Math.max(totalH, ny + BOX_H)
    }
  } else {
    let nx = SG_PAD
    let ny = SG_PAD + 30
    for (const node of sgNodeList) {
      positions[node.id] = { x: baseX + nx, y: baseY + ny }
      processedNodes.add(node.id)
      ny += BOX_H + GAP_Y
      totalH = Math.max(totalH, ny)
      maxW = Math.max(maxW, nx + BOX_W)
    }
  }

  sg.width = maxW + SG_PAD
  sg.height = totalH + SG_PAD

  // Position child subgraphs INSIDE this parent
  let childOffset = isHorizontal ? maxW + SG_PAD : 0
  let childVertOffset = isHorizontal ? SG_PAD + 30 : totalH + SG_PAD
  for (const child of sg.children || []) {
    child.x = baseX + childOffset
    child.y = baseY + childVertOffset
    positionSubgraphNodes(child, baseX + childOffset, baseY + childVertOffset, nodes, positions, processedNodes, isHorizontal, BOX_W, BOX_H, SG_PAD, GAP_X, GAP_Y)
    if (isHorizontal) {
      childOffset += (child.width || SG_PAD * 2) + GAP_X
      sg.height = Math.max(sg.height, childVertOffset + (child.height || SG_PAD * 2) + SG_PAD)
    } else {
      childVertOffset += (child.height || SG_PAD * 2) + GAP_Y
      sg.width = Math.max(sg.width, childOffset + (child.width || SG_PAD * 2) + SG_PAD)
    }
  }
}

// ====== Layout Calculator ======

function calculateLayout(parsed) {
  const { direction, nodes, edges, subgraphs, styles } = parsed
  const BOX_H = 50
  const PAD = 20
  const GAP_X = 40
  const GAP_Y = 30
  const SG_PAD = 30

  const isHorizontal = direction === 'LR' || direction === 'RL'

  // Calculate dynamic box width based on longest label
  let maxLabelLen = 8
  for (const node of nodes) {
    const longestLine = node.label.split('<br/>').reduce((a, b) => a.length > b.length ? a : b, '')
    maxLabelLen = Math.max(maxLabelLen, longestLine.length)
  }
  // Approx: each char ~7px, + padding
  const BOX_W = Math.max(140, Math.min(maxLabelLen * 7 + 24, 280))

  const positions = {}
  let x = PAD
  let y = PAD
  const processedNodes = new Set()

  // Only position top-level (root) subgraphs. Children are positioned relative to parents.
  const rootSubgraphs = subgraphs.filter(sg => !sg.parentId)

  // First pass: position all root subgraph nodes
  for (const sg of rootSubgraphs) {
    // Get all nodes that belong to this subgraph (including nested children)
    const sgAllNodes = getAllNodesInSubgraph(sg, nodes)
    const sgNodeList = nodes.filter(n => sgAllNodes.has(n.id))
    if (sgNodeList.length === 0) continue

    sg.x = x
    sg.y = y
    // Position child subgraphs relative to parent
    positionSubgraphNodes(sg, x, y, nodes, positions, processedNodes, isHorizontal, BOX_W, BOX_H, SG_PAD, GAP_X, GAP_Y)

    if (isHorizontal) {
      x += sg.width + GAP_X
    } else {
      y += sg.height + GAP_Y
    }
  }

  // Position remaining unplaced nodes
  for (const node of nodes) {
    if (processedNodes.has(node.id)) continue
    if (isHorizontal) {
      positions[node.id] = { x, y }
      x += BOX_W + GAP_X
    } else {
      positions[node.id] = { x, y }
      y += BOX_H + GAP_Y
    }
    processedNodes.add(node.id)
  }

  // Add subgraph center points to positions for subgraph-to-subgraph edges
  for (const sg of subgraphs) {
    if (sg.width && sg.height) {
      positions[sg.id] = { x: sg.x + sg.width / 2 - BOX_W / 2, y: sg.y + sg.height / 2 - BOX_H / 2 }
    }
  }

  // Calculate SVG dimensions
  let svgW = x + BOX_W + PAD
  let svgH = y + BOX_H + PAD
  for (const sg of subgraphs) {
    svgW = Math.max(svgW, sg.x + sg.width + PAD)
    svgH = Math.max(svgH, sg.y + sg.height + PAD)
  }

  return { positions, subgraphs, width: svgW, height: svgH, BOX_W, BOX_H, isHorizontal, edges, nodes, styles }
}

// ====== SVG Rendering Functions ======

function renderNode(id, label, x, y, w, h, shape, styleMap) {
  const ns = styleMap[id] || {}
  const fill = ns.fill || '#1e293b'
  const stroke = ns.stroke || '#64748b'
  const strokeW = parseInt(ns.strokeWidth) || 2
  const color = ns.color || '#e2e8f0'
  const lines = label.split('<br/>').flatMap(l => l.split('<br />'))
  const lineH = 16
  const textY = y + h / 2 - ((lines.length - 1) * lineH) / 2 + 4
  const el = []

  if (shape === 'rect') {
    el.push(<rect key={`${id}-bg`} x={x} y={y} width={w} height={h} rx={8} ry={8}
      fill={fill} stroke={stroke} strokeWidth={strokeW} />)
  } else if (shape === 'circle') {
    el.push(<ellipse key={`${id}-bg`} cx={x + w/2} cy={y + h/2} rx={w/2} ry={h/2}
      fill={fill} stroke={stroke} strokeWidth={strokeW} />)
  } else if (shape === 'diamond') {
    el.push(<polygon key={`${id}-bg`} points={`${x + w/2},${y} ${x + w},${y + h/2} ${x + w/2},${y + h} ${x},${y + h/2}`}
      fill={fill} stroke={stroke} strokeWidth={strokeW} />)
  }

  for (let i = 0; i < lines.length; i++) {
    el.push(<text key={`${id}-t${i}`} x={x + w / 2} y={textY + i * lineH}
      textAnchor="middle" fill={color} fontSize={11} fontFamily="system-ui, sans-serif" fontWeight={600}>
      {lines[i]}
    </text>)
  }
  return el
}

function renderSubgraphBox(sg, styleMap) {
  const ns = styleMap[sg.id] || {}
  const fill = ns.fill || 'rgba(30, 41, 59, 0.4)'
  const stroke = ns.stroke || '#64748b'
  const el = []
  el.push(<rect key={`sgb-${sg.id}`} x={sg.x} y={sg.y} width={sg.width} height={sg.height}
    rx={10} ry={10} fill={fill} stroke={stroke} strokeWidth={2} strokeDasharray="4,3" />)
  el.push(<text key={`sgl-${sg.id}`} x={sg.x + 15} y={sg.y + 20}
    fill={stroke} fontSize={12} fontFamily="system-ui, sans-serif" fontWeight={700}>
    {sg.label || sg.id.replace(/_/g, ' ')}
  </text>)
  for (const child of sg.children || []) {
    el.push(...renderSubgraphBox(child, styleMap))
  }
  return el
}

function getAllVisibleNodes(subgraphs, nodes) {
  const allIds = new Set(nodes.map(n => n.id))
  for (const sg of subgraphs) {
    const ids = getAllNodesInSubgraph(sg, nodes)
    ids.forEach(id => allIds.add(id))
  }
  return nodes.filter(n => allIds.has(n.id))
}

// ====== Main Component ======

export default function MermaidRenderer({ source, id }) {
  const layout = useMemo(() => {
    if (!source) return null
    const parsed = parseMermaid(source)
    return calculateLayout(parsed)
  }, [source])

  const [zoom, setZoom] = useState(1)
  const ZOOM_STEP = 0.25
  const ZOOM_MIN = 0.25
  const ZOOM_MAX = 4

  const zoomIn = useCallback(() => {
    setZoom(z => Math.min(ZOOM_MAX, +(z + ZOOM_STEP).toFixed(2)))
  }, [])
  const zoomOut = useCallback(() => {
    setZoom(z => Math.max(ZOOM_MIN, +(z - ZOOM_STEP).toFixed(2)))
  }, [])
  const zoomReset = useCallback(() => {
    setZoom(1)
  }, [])

  const handleWheel = useCallback((e) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault()
      e.stopPropagation()
      const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP
      setZoom(z => Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, +(z + delta).toFixed(2))))
    }
  }, [])

  if (!layout || layout.width <= 60) {
    return (
      <div className="mermaid-fallback">
        <pre style={{ fontSize: 11, lineHeight: 1.5, color: 'var(--text-secondary)' }}>
          {source || 'No diagram data'}
        </pre>
      </div>
    )
  }

  const { positions, subgraphs, width, height, BOX_W, BOX_H, isHorizontal, edges, nodes, styles: styleMap } = layout
  const arrowId = `arrow${id || ''}`
  const allNodes = getAllVisibleNodes(subgraphs, nodes)

  const zoomPct = Math.round(zoom * 100)

  return (
    <div className="mermaid-renderer">
      <div className="mermaid-zoom-bar">
        <button className="mermaid-zoom-btn" onClick={zoomOut} title="Zoom out (Ctrl+Scroll)">−</button>
        <span className="mermaid-zoom-label" onClick={zoomReset} title="Reset to 100%">{zoomPct}%</span>
        <button className="mermaid-zoom-btn" onClick={zoomIn} title="Zoom in (Ctrl+Scroll)">+</button>
      </div>
      <div className="mermaid-svg-viewport" onWheel={handleWheel}>
        <div className="mermaid-svg-stage"
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: 'top left',
          }}
        >
          <svg viewBox={`0 0 ${width + 20} ${height + 20}`}
            preserveAspectRatio="xMidYMid meet"
            style={{ backgroundColor: 'var(--bg-base)', width: '100%', height: 'auto' }}
            xmlns="http://www.w3.org/2000/svg">
          <defs>
            <marker id={arrowId} markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
            </marker>
          </defs>

          {/* Subgraph backgrounds (recursive) */}
          {subgraphs.map(sg => renderSubgraphBox(sg, styleMap))}

          {/* Edges */}
          {edges.map((edge, i) => {
            const from = positions[edge.from]
            const to = positions[edge.to]
            if (!from || !to) return null
            const x1 = isHorizontal ? from.x + BOX_W : from.x + BOX_W / 2
            const y1 = isHorizontal ? from.y + BOX_H / 2 : from.y + BOX_H
            const x2 = isHorizontal ? to.x : to.x + BOX_W / 2
            const y2 = isHorizontal ? to.y + BOX_H / 2 : to.y
            return (
              <g key={`e${i}`}>
                <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#64748b" strokeWidth={1.5} markerEnd={`url(#${arrowId})`} />
                {edge.label && (
                  <text x={(x1 + x2) / 2} y={(y1 + y2) / 2 - 8} textAnchor="middle" fill="#94a3b8" fontSize={9} fontFamily="system-ui, sans-serif">
                    {edge.label}
                  </text>
                )}
              </g>
            )
          })}

          {/* Nodes */}
          {allNodes.map(node => {
            const pos = positions[node.id]
            if (!pos) return null
            return renderNode(node.id, node.label, pos.x, pos.y, BOX_W, BOX_H, node.shape, styleMap)
          })}
        </svg>
        </div>
      </div>
    </div>
  )
}
