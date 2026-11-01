import CertMarkdownReader from './CertMarkdownReader'
import ccgD1 from '../data/ccg_d1.md?raw'
import ccgD2 from '../data/ccg_d2.md?raw'
import ccgD3 from '../data/ccg_d3.md?raw'
import ccgD4 from '../data/ccg_d4.md?raw'
import ccgD5 from '../data/ccg_d5.md?raw'
import ccgRef from '../data/ccg_ref.md?raw'

const kb = raw => Math.max(1, Math.round(raw.length / 1024))

export default function ClaudeCertCurriculum() {
  return (
    <CertMarkdownReader
      files={[
        { id: 'd1', label: 'D1 · Agentic Arch', count: '7 lessons', bytes: kb(ccgD1), raw: ccgD1 },
        { id: 'd2', label: 'D2 · Tool Design + MCP', count: '5 lessons', bytes: kb(ccgD2), raw: ccgD2 },
        { id: 'd3', label: 'D3 · Claude Code Config', count: '6 lessons', bytes: kb(ccgD3), raw: ccgD3 },
        { id: 'd4', label: 'D4 · Prompt Eng', count: '6 lessons', bytes: kb(ccgD4), raw: ccgD4 },
        { id: 'd5', label: 'D5 · Context Mgmt', count: '6 lessons', bytes: kb(ccgD5), raw: ccgD5 },
        { id: 'ref', label: 'Quick Ref + Glossary', count: '59 terms', bytes: kb(ccgRef), raw: ccgRef },
      ]}
      title="📘 CCAR-F Full Curriculum — claudecertificationguide.com"
      subtitle="Independent community curriculum for the Claude Certified Architect (Foundations) exam — 30 lessons across 5 domains, each with key facts, exam traps, practice scenarios and build exercises. Quick-reference + 59-term glossary included."
      footer="Curriculum compiled from claudecertificationguide.com — an independent community resource, not affiliated with Anthropic."
    />
  )
}
