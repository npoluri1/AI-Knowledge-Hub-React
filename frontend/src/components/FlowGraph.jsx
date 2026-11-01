import React, { useId, useMemo } from 'react'

// draw.io-style SVG graph renderer with automatic layout.
// nodes: [{ id, label, kind, sub? }]   edges: [{ from, to, label? }]
// Rendered with rich gradient colors, glowing accents and explicit
// directional arrows (→ for left→right, ← for right→left, ↓/↑ for rows).
const KIND_COLORS = {
  entry:   { fill: '#0b3d38', fill2: '#14584f', stroke: '#4fe3c0', text: '#7df3d6' },
  gateway: { fill: '#12264d', fill2: '#1c3a7a', stroke: '#6ca8ff', text: '#9cc4ff' },
  ai:      { fill: '#2b1d4e', fill2: '#432e77', stroke: '#c39aff', text: '#ddc4ff' },
  data:    { fill: '#3d2f12', fill2: '#5c481d', stroke: '#ffd166', text: '#ffe29a' },
  action:  { fill: '#3d1c38', fill2: '#5c2b52', stroke: '#ff8fd4', text: '#ffb8e4' },
  store:   { fill: '#0d3a44', fill2: '#13525f', stroke: '#4fd8f0', text: '#8fe8f7' },
}

const KIND_LABELS = { entry: 'entry', gateway: 'gateway', ai: 'AI', data: 'data', action: 'action', store: 'store' }

// Compact spacing so the whole diagram fits its area without scrolling.
const COL_GAP = 34
const ROW_GAP = 12
const ROW_PITCH = 58 // vertical pitch between snake rows

// Truncate long labels with an ellipsis at a word boundary so nodes stay small.
const fitText = (text, width, size) => {
  const maxChars = Math.max(5, Math.floor((width - 10) / (size * 0.6)))
  if (!text || text.length <= maxChars) return text || ''
  let cut = text.slice(0, maxChars)
  const sp = cut.lastIndexOf(' ')
  if (sp > 6) cut = cut.slice(0, sp)
  return cut.trimEnd() + '…'
}

// Self-sizing nodes: width is computed from the label as it will actually
// render (truncated with an ellipsis), so long labels don't inflate the box.
const nodeWidth = n => {
  const preview = fitText(n.label, 150, 10)
  return Math.min(124, Math.max(56, preview.length * 5.4 + 14 + (n.sub ? 4 : 0)))
}
const nodeHeight = n => (n.sub ? 42 : 32)

const maxWOf = list => Math.max(...list.map(n => nodeWidth(n)))

// ---- Layered layout (generic, for branching graphs) -----------------------
function layeredLayout(nodes, edges) {
  const byId = new Map(nodes.map(n => [n.id, n]))
  const out = new Map()
  const inn = new Map()
  nodes.forEach(n => { out.set(n.id, []); inn.set(n.id, []) })
  edges.forEach(e => {
    if (byId.has(e.from) && byId.has(e.to)) {
      out.get(e.from).push(e.to)
      inn.get(e.to).push(e.from)
    }
  })

  const layer = new Map()
  const order = new Map()
  const queue = nodes.filter(n => inn.get(n.id).length === 0).map(n => n.id)
  nodes.forEach(n => { if (!layer.has(n.id)) layer.set(n.id, 0) })
  let qi = 0
  while (qi < queue.length) {
    const id = queue[qi++]
    const cur = layer.get(id) || 0
    out.get(id).forEach(next => {
      layer.set(next, Math.max(layer.get(next) || 0, cur + 1))
      if (!order.has(next)) queue.push(next)
    })
    order.set(id, queue.length)
  }
  nodes.forEach(n => { if (!order.has(n.id)) order.set(n.id, queue.length++) })

  const layers = []
  nodes.forEach(n => {
    const l = layer.get(n.id) || 0
    if (!layers[l]) layers[l] = []
    layers[l].push(n)
  })

  const colX = []
  let x = 0
  layers.forEach((lnodes, li) => {
    colX[li] = x
    x += Math.max(...lnodes.map(n => nodeWidth(n))) + COL_GAP
  })
  const totalW = x - COL_GAP + 20

  const pos = {}
  layers.forEach((lnodes, li) => {
    const maxH = Math.max(...lnodes.map(n => nodeHeight(n)))
    let y = 0
    lnodes.forEach(n => {
      pos[n.id] = { x: colX[li] + (maxWOf(lnodes) - nodeWidth(n)) / 2, y }
      y += nodeHeight(n) + ROW_GAP
    })
    lnodes.forEach(n => { pos[n.id].y += (maxH - nodeHeight(n)) / 2 })
  })
  const fullH = layers.reduce((acc, l) => Math.max(acc, l.reduce((a, n) => a + nodeHeight(n) + ROW_GAP, -ROW_GAP)), 0)

  return { pos, totalW, fullH }
}

// ---- Snake layout (compact 2-row flow for linear chains) ------------------
// If the graph is essentially a single chain (every node has at most one
// forward next), lay it out in a serpentine path so it fits a small area
// at near-full text size — the draw.io look for linear flows.
function snakeLayout(nodes, edges) {
  const byId = new Map(nodes.map(n => [n.id, n]))
  const out = new Map()
  const inn = new Map()
  nodes.forEach(n => { out.set(n.id, []); inn.set(n.id, []) })
  edges.forEach(e => {
    if (byId.has(e.from) && byId.has(e.to)) {
      out.get(e.from).push(e.to)
      inn.get(e.to).push(e.from)
    }
  })

  // Forward-next of each node (an edge to something not yet in the chain).
  const chain = []
  const visited = new Set()
  const roots = nodes.filter(n => inn.get(n.id).length === 0)
  let cur = roots.length ? roots[0].id : null
  while (cur && !visited.has(cur)) {
    visited.add(cur)
    chain.push(cur)
    const nexts = out.get(cur).filter(nid => !visited.has(nid))
    cur = nexts.length ? nexts[0] : null
  }
  // Append any stragglers (loop-only nodes) so nothing is dropped.
  nodes.forEach(n => { if (!visited.has(n.id)) chain.push(n.id) })

  // Is it chain-like enough to warrant the snake? Yes when the main path
  // covers every node (loop-back edges are ignored above).
  if (chain.length !== nodes.length) return null

  // Row capacity: aim for a compact 2-row layout.
  const perRow = Math.max(3, Math.min(6, Math.ceil(chain.length / 2)))
  const rows = Math.ceil(chain.length / perRow)

  const pos = {}
  const rowMaxH = []
  chain.forEach((id, i) => {
    const row = Math.floor(i / perRow)
    const col = i % perRow
    pos[id] = { row, col }
    rowMaxH[row] = Math.max(rowMaxH[row] || 0, nodeHeight(byId.get(id)))
  })

  // Compute x offsets per row (columns sized to widest node in that column).
  const colW = []
  for (let c = 0; c < perRow; c++) {
    let w = 0
    chain.forEach((id, i) => { if (i % perRow === c) w = Math.max(w, nodeWidth(byId.get(id))) })
    colW[c] = w
  }
  const colX = []
  let x = 0
  for (let c = 0; c < perRow; c++) { colX[c] = x; x += colW[c] + COL_GAP }
  const rowW = x - COL_GAP

  const rowY = []
  let y = 0
  for (let r = 0; r < rows; r++) {
    rowY[r] = y
    y += (rowMaxH[r] || nodeHeight(nodes[0])) + ROW_PITCH
  }

  chain.forEach((id, i) => {
    const { row, col } = pos[id]
    const c = row % 2 === 0 ? col : perRow - 1 - col
    const rowH = rowMaxH[row]
    const n = byId.get(id)
    pos[id] = {
      x: colX[c] + (colW[c] - nodeWidth(n)) / 2,
      y: rowY[row] + (rowH - nodeHeight(n)) / 2,
    }
  })

  const totalW = rowW + 20
  const fullH = rowY[rows - 1] + (rowMaxH[rows - 1] || nodeHeight(nodes[0])) + 16
  return { pos, totalW, fullH }
}

export default function FlowGraph({ nodes, edges, height = 320, onSelect, selectedId }) {
  const uid = useId()
  const layout = useMemo(() => {
    if (!nodes.length) return null
    const snake = snakeLayout(nodes, edges)
    if (snake) return snake
    return layeredLayout(nodes, edges)
  }, [nodes, edges])

  if (!layout) return null

  const vbW = layout.totalW
  const vbH = layout.fullH + 36

  const edgeColor = (kind) => {
    const k = KIND_COLORS[kind] || KIND_COLORS.store
    return k.stroke
  }

  // Per-node gradient id (unique per node AND per diagram instance, so
  // multiple diagrams on one page never collide — the earlier arrow bug).
  const gradId = id => `${uid}-g-${id.replace(/[^a-zA-Z0-9]/g, '')}`

  return (
    <div className={`ads-flowgraph ${onSelect ? 'interactive' : ''}`}>
      <svg viewBox={`0 0 ${vbW} ${vbH}`} preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: 'auto', maxHeight: height }}>
        <defs>
          {nodes.map(n => {
            const k = KIND_COLORS[n.kind] || KIND_COLORS.store
            return (
              <linearGradient key={n.id} id={gradId(n.id)} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={k.fill2} />
                <stop offset="100%" stopColor={k.fill} />
              </linearGradient>
            )
          })}
        </defs>

        {/* edges with explicit arrowheads + directional glyphs */}
        {edges.map((e, i) => {
          const from = nodes.find(n => n.id === e.from)
          const to = nodes.find(n => n.id === e.to)
          if (!from || !to || !layout.pos[e.from] || !layout.pos[e.to]) return null

          const fx = layout.pos[e.from].x
          const fy = layout.pos[e.from].y
          const tx = layout.pos[e.to].x
          const ty = layout.pos[e.to].y
          const fw = nodeWidth(from)
          const th = nodeHeight(to)
          const fh = nodeHeight(from)
          const tw = nodeWidth(to)

          // Facing-side endpoints: start on the side of the source that faces
          // the target, end on the side of the target that faces the source.
          const dx = tx - fx
          const dy = ty - fy
          const horizontal = Math.abs(dx) >= Math.abs(dy)
          let x1, y1, x2, y2
          if (horizontal) {
            const dir = dx >= 0 ? 1 : -1
            x1 = fx + (dir * fw) / 2
            y1 = fy + fh / 2
            x2 = tx - (dir * tw) / 2
            y2 = ty + th / 2
          } else {
            const dir = dy >= 0 ? 1 : -1
            x1 = fx + fw / 2
            y1 = fy + (dir * fh) / 2
            x2 = tx + tw / 2
            y2 = ty - (dir * th) / 2
          }

          // Cubic path through the midpoint between the two facing edges.
          const mx = (x1 + x2) / 2
          const my = (y1 + y2) / 2
          const path = horizontal
            ? `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`
            : `M ${x1} ${y1} C ${x1} ${my}, ${x2} ${my}, ${x2} ${y2}`

          // Arrowhead direction: tangent of the cubic at its end ≈ (x2 - mx, y2 - my).
          const ang = Math.atan2(y2 - my, x2 - mx)
          const a = 7.5 // arrow length
          const w = 4.6 // half width
          const tip = `M ${x2} ${y2} `
          const bx = x2 - a * Math.cos(ang)
          const by = y2 - a * Math.sin(ang)
          const px = bx - w * Math.sin(ang)
          const py = by + w * Math.cos(ang)
          const qx = bx + w * Math.sin(ang)
          const qy = by - w * Math.cos(ang)
          const arrow = `${tip}L ${px} ${py} L ${qx} ${qy} Z`

          // Direction glyph: → for left→right, ← for right→left, ↓/↑ for row hops.
          const dirGlyph = horizontal
            ? (dx >= 0 ? '→' : '←')
            : (dy >= 0 ? '↓' : '↑')
          const stroke = edgeColor(from.kind)

          // Label placed just before the arrowhead, offset away from the path.
          const labelAt = { x: mx, y: horizontal ? (y1 + y2) / 2 - 8 : (y1 + y2) / 2 - 8 }
          return (
            <g key={i}>
              {/* soft glow under the line */}
              <path d={path} fill="none" stroke={stroke} strokeWidth="3.2" opacity="0.16" />
              <path d={path} fill="none" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" />
              <path d={arrow} fill={stroke} stroke={stroke} strokeWidth="0.6" strokeLinejoin="round" />
              {/* directional glyph on the line, before the arrowhead */}
              <text
                x={mx}
                y={horizontal ? (y1 + y2) / 2 + 4 : (y1 + y2) / 2 + 4}
                textAnchor="middle"
                fontSize="11"
                fontWeight="900"
                fill={stroke}
                opacity="0.9"
              >
                {dirGlyph}
              </text>
              {e.label && (
                <g>
                  <rect x={labelAt.x - e.label.length * 3 - 5} y={labelAt.y - 8} width={e.label.length * 6 + 10} height={12} rx="6" fill="#0d0f1a" opacity="0.92" />
                  <text x={labelAt.x} y={labelAt.y} textAnchor="middle" fontSize="8.5" fill="#e2e8f0" fontWeight="700">
                    {e.label}
                  </text>
                </g>
              )}
            </g>
          )
        })}

        {/* nodes — clickable when onSelect is provided */}
        {nodes.map(n => {
          const k = KIND_COLORS[n.kind] || KIND_COLORS.store
          const w = nodeWidth(n)
          const h = nodeHeight(n)
          const p = layout.pos[n.id]
          if (!p) return null
          const title = fitText(n.label, w, 10)
          const sub = n.sub ? fitText(n.sub, w, 7.5) : null
          const isSel = selectedId === n.id
          const clickable = !!onSelect
          return (
            <g
              key={n.id}
              className={`ff-node ${clickable ? 'ff-clickable' : ''} ${isSel ? 'ff-selected' : ''}`}
              onClick={clickable ? () => onSelect(n.id) : undefined}
              tabIndex={clickable ? 0 : undefined}
              onKeyDown={clickable ? e => { if (e.key === 'Enter') onSelect(n.id) } : undefined}
              role={clickable ? 'button' : undefined}
              aria-label={clickable ? `Show code for ${n.label}` : undefined}
              aria-pressed={clickable ? isSel : undefined}
              style={clickable ? { cursor: 'pointer' } : undefined}
            >
              {/* outer glow ring in the node's color */}
              <rect x={p.x - 1.5} y={p.y - 1.5} width={w + 3} height={h + 3} rx="10" fill="none" stroke={k.stroke} strokeWidth="1" opacity={isSel ? 1 : 0.35} />
              <rect
                x={p.x} y={p.y} width={w} height={h} rx="9"
                fill={`url(#${gradId(n.id)})`}
                stroke={isSel ? '#ffffff' : k.stroke}
                strokeWidth={isSel ? 2.4 : 1.5}
                filter="drop-shadow(0 3px 6px rgba(0,0,0,0.5))"
              />
              {/* accent top bar */}
              <rect x={p.x + 4} y={p.y + 2.5} width={w - 8} height="2.6" rx="1.3" fill={k.stroke} opacity="0.85" />
              <text x={p.x + w / 2} y={p.y + (n.sub ? 20 : 22)} textAnchor="middle" fontSize="10" fontWeight="800" fill={k.text}>
                {title}
              </text>
              {sub && (
                <text x={p.x + w / 2} y={p.y + 33} textAnchor="middle" fontSize="7.5" fill="#a6adc8">
                  {sub}
                </text>
              )}
              {clickable && (
                <text x={p.x + w - 9} y={p.y + 14} textAnchor="middle" fontSize="9" fontWeight="900" fill="#ffffff" opacity={isSel ? 1 : 0.65}>
                  💻
                </text>
              )}
            </g>
          )
        })}
      </svg>
    </div>
  )
}

export function FlowGraphLegend() {
  const items = ['entry', 'gateway', 'ai', 'data', 'action', 'store']
  return (
    <div className="ads-legend">
      {items.map(k => (
        <span className="ads-legend-item" key={k}>
          <span className="ads-legend-dot" style={{ background: KIND_COLORS[k].stroke }} />
          {KIND_LABELS[k]}
        </span>
      ))}
    </div>
  )
}
