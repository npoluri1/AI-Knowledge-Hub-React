import { P } from './menuVisuals'

export const TOPICS = [
  [/python|pandas|numpy|django|flask/, P.pythonNote],
  [/quantum|qubit/, P.equations],
  [/robot|humanoid|drone/, P.robot],
  [/agent|autonom|crew|langgraph|multi-agent/, P.robotHand],
  [/chip|semiconductor|gpu|hardware|silicon|fpga|cuda/, P.circuit],
  [/secur|guard|compliance|risk|privacy|threat|cyber|grc|audit/, P.cyber],
  [/trading|stock|market|financ|invest|crypto|commodit|money|wealth|bank/, P.stockChart],
  [/news|headline|press|media/, P.newspapers],
  [/book|read|librar|novel|literat/, P.libraryShelves],
  [/job|career|hiring|interview|resume|salary|recruit/, P.team],
  [/design|architect|blueprint|pattern|system/, P.blueprint],
  [/data|etl|analytic|warehouse|lake|sql|bi\b|dashboard|metric/, P.analytics],
  [/cloud|aws|azure|gcp|serverless/, P.earthNight],
  [/deploy|devops|docker|kubernetes|k8s|infra|server|mlops|ops/, P.serverRacks],
  [/api|integrat|mcp|connector|webhook|gateway/, P.cubes],
  [/react|frontend|web|css|html|javascript|typescript|ui\b/, P.reactCode],
  [/video|youtube|tiktok|film|stream/, P.videoEdit],
  [/chat|message|whatsapp|telegram|slack|email|communicat|voice/, P.phoneMessages],
  [/social|linkedin|instagram|facebook|twitter/, P.socialApps],
  [/image|vision|photo|gallery|diffusion|art/, P.aiRender],
  [/rag|vector|retriev|embedding|search|knowledge/, P.library],
  [/test|qa|debug|eval/, P.laptopDev],
  [/learn|course|tutorial|study|lesson|quiz|exam|cert|prep|guide/, P.studyDesk],
  [/code|program|develop|software|engineer|tool/, P.codeScreen],
  [/europe|travel|country|visa|relocat|city/, P.europe],
  [/world|global|international/, P.worldMap],
  [/wisdom|spirit|meditat|calm|mind|baba|devotion|peace/, P.lakeCalm],
  [/project|idea|startup|build/, P.whiteboard],
  [/llm|gpt|claude|gemini|model|neural|ml\b|machine learning|ai\b|artificial/, P.aiAbstract],
]

export const EMOJI = {
  '🐍': P.pythonNote, '🤖': P.robot, '🧠': P.aiAbstract, '📚': P.libraryShelves, '📖': P.bookTitles, '📊': P.analytics,
  '📈': P.stockChart, '💹': P.stockChart, '💰': P.stockChart, '🛡️': P.cyber, '🔒': P.security, '🔐': P.security,
  '☁️': P.earthNight, '🚀': P.laptopTech, '⚡': P.circuit, '🔌': P.cubes, '🔗': P.cables, '💻': P.codeScreen,
  '🧑‍💻': P.laptopDev, '🛠️': P.laptopCode, '🔧': P.laptopCode, '⚙️': P.serverRacks, '🐳': P.serverRacks, '📦': P.codeDark,
  '🌐': P.worldMap, '🌍': P.worldMap, '🗺️': P.worldMap, '📡': P.earthNight, '📰': P.newspapers, '🎬': P.videoEdit,
  '🎥': P.videoEdit, '💬': P.phoneMessages, '📱': P.socialApps, '🎓': P.studyDesk, '📝': P.studying, '🧪': P.laptopDev,
  '🔬': P.circuit, '⚛️': P.equations, '🏗️': P.blueprint, '🏛️': P.architecture, '🎨': P.aiRender, '🖼️': P.aiRender,
  '💼': P.team, '👥': P.officeTeam, '🏭': P.officeModern, '🏥': P.lakeCalm, '🙏': P.lakeCalm, '🕉️': P.lakeCalm,
  '🔍': P.library, '🗂️': P.cardCatalog, '📂': P.cardCatalog, '📁': P.cardCatalog, '🎯': P.whiteboard, '💡': P.whiteboard,
}

export const FALLBACK = [P.aiAbstract, P.codeScreen, P.circuit, P.analytics, P.blueprint, P.cubes, P.aiGen, P.laptopTech]

export function photoIdForText(text, emoji) {
  const t = String(text || '').toLowerCase()
  for (const [re, id] of TOPICS) if (re.test(t)) return id
  if (emoji && EMOJI[emoji]) return EMOJI[emoji]
  let h = 0
  for (const c of t) h = (h * 31 + c.charCodeAt(0)) | 0
  return FALLBACK[Math.abs(h) % FALLBACK.length]
}
