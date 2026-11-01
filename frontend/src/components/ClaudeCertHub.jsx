import CertMarkdownReader from './CertMarkdownReader'
import ccjD1 from '../data/ccj_d1.md?raw'
import ccjD2 from '../data/ccj_d2.md?raw'
import ccjD3 from '../data/ccj_d3.md?raw'
import ccjD4 from '../data/ccj_d4.md?raw'
import ccjD5 from '../data/ccj_d5.md?raw'
import ccjExam from '../data/ccj_exam.md?raw'
import ccjScenarios from '../data/ccj_scenarios.md?raw'
import ccjTeaching from '../data/ccj_teaching.md?raw'

const kb = raw => Math.max(1, Math.round(raw.length / 1024))

export default function ClaudeCertHub() {
  return (
    <CertMarkdownReader
      files={[
        { id: 'd1', label: 'D1 · Agentic Arch', count: '7 tasks', bytes: kb(ccjD1), raw: ccjD1 },
        { id: 'd2', label: 'D2 · Tool Design + MCP', count: '5 tasks', bytes: kb(ccjD2), raw: ccjD2 },
        { id: 'd3', label: 'D3 · Claude Code Config', count: '6 tasks', bytes: kb(ccjD3), raw: ccjD3 },
        { id: 'd4', label: 'D4 · Prompt Eng', count: '6 tasks', bytes: kb(ccjD4), raw: ccjD4 },
        { id: 'd5', label: 'D5 · Context Mgmt', count: '6 tasks', bytes: kb(ccjD5), raw: ccjD5 },
        { id: 'exam', label: 'Exam Bank', count: '12+18+60', bytes: kb(ccjExam), raw: ccjExam },
        { id: 'scenarios', label: '6 Scenarios', count: '13 files', bytes: kb(ccjScenarios), raw: ccjScenarios },
        { id: 'teaching', label: 'Teaching Guide', bytes: kb(ccjTeaching), raw: ccjTeaching },
      ]}
      title="🛠️ Claude Certified Architect — Hub Codebase (jacinthpaul)"
      subtitle="github.com/jacinthpaul/Claude-Certified-Architect — 30 runnable task files (with full code + acceptance criteria), the complete exam question bank (12 sample + 18 practice + 60 mock, embedded verbatim), 6 full scenario applications (Agent SDK + MCP), and a teaching guide."
      footer="Hub compiled from jacinthpaul/Claude-Certified-Architect — independent community study aid, not affiliated with Anthropic. Question banks are embedded verbatim as Python source so no data is lost."
    />
  )
}
