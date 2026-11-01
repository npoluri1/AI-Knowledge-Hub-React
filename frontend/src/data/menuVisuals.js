// One curated photo + tagline per navigation destination (checked one by one
// against a contact sheet, 2026-11). Used by the sidebar icon tiles, the hover
// preview card, the Home "Explore every section" grid and page hero banners.
export const U = (id, w = 160, h) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}${h ? `&h=${h}` : ''}&q=70`

export const P = {
  aiAbstract: '1677442136019-21780ecad995', aiRender: '1620641788421-7a1c342ea42e', cardCatalog: '1544383835-bda2bc66a55d',
  blueprint: '1503387762-592deb58ef4e', team: '1522071820081-009f0129c71c', onlineLearning: '1516321318423-f06f85e504b3',
  newspapers: '1504711434969-e33886168f5c', earthNight: '1451187580459-43490279c0fa', robot: '1485827404703-89b55fcc595e',
  codeScreen: '1555066931-4365d14bab8c', laptopCode: '1498050108023-c5249f4df085', cables: '1544197150-b99a580bb7a8',
  cubes: '1639762681485-074b7f938ba0', libraryShelves: '1507842217343-583bb7270b66', bookTitles: '1512820790803-83ca734da794',
  typing: '1486312338219-ce68d2c6f44d', robotPiano: '1620712943543-bcc4688e7485', studying: '1434030216411-0b793f4b4173',
  snow: '1491002052546-bf38f186af56', analytics: '1460925895917-afdab827c52f', worldMap: '1526778548025-fa2f459cd5c1',
  whiteboard: '1557804506-669a67965ba0', socialApps: '1611162617213-7d7a39e9b1d7', videoEdit: '1574717024653-61fd2cf4d44d',
  architecture: '1487958449943-2429e8be8625', studyDesk: '1501504905252-473c47e087f8', pythonNote: '1526379095098-d400fd0bf935',
  circuit: '1518770660439-4636190af475', library: '1481627834876-b7833e8f5570', dataViz: '1580894894513-541e068a3e2b',
  htmlCode: '1542831371-29b0f74f9713', openai: '1676299081847-824916de030a', robotHand: '1531746790731-6c087fecd65a',
  phoneMessages: '1563986768609-322da13575f3', reactCode: '1633356122544-f134324a6cee', pythonCode: '1555949963-ff9fe0c870eb',
  codeDark: '1484417894907-623942c8ee29', stockChart: '1611974789855-9c2a0a7236a3', lakeCalm: '1508672019048-805c876b67e2',
  engineer: '1573164713714-d95e436ab8d6', teamLaptops: '1519389950473-47ba0277781c', europe: '1467269204594-9661b134dd2b',
  equations: '1635070041078-e363dbe005cb', pcSetup: '1593720213428-28a5b9e94613', robotWhite: '1535378620166-273708d44e4c',
  serverRacks: '1558494949-ef010cbdcc31', security: '1563013544-824ae1b704d3', dashboard: '1551288049-bebda4e38f71',
  cyber: '1550751827-4bd374c3f58b', officeModern: '1497366216548-37526070297c', laptopDev: '1517694712202-14dd9538aa97',
  officePlan: '1527474305487-b87b222841cc', officeTeam: '1521737604893-d14cc237f11d', trading: '1590283603385-17ffb3a7f29f',
  bookStack: '1544716278-ca5e3f4abd8c', laptopTech: '1531297484001-80022131f5a1', aiGen: '1655720828018-edd2daec9349',
  reading: '1456513080510-7bf3a84b82f8', graph: '1543286386-713bdd548da4', matrix: '1526374965328-7f61d4dc18c5',
}

export const MENU_VISUALS = {
  '/': [P.aiAbstract, 'Your AI engineering home base'],
  '/images': [P.aiRender, 'Diagrams, screenshots and visual references'],
  '/files': [P.cardCatalog, 'Every source file behind the hub'],
  '/knowledge': [P.blueprint, 'Architecture patterns and system decisions'],
  '/jobs': [P.team, 'AI roles, skills and hiring signals'],
  '/edureka': [P.onlineLearning, 'Curated course documents'],
  '/ai-news': [P.newspapers, 'AI news, tools and market moves'],
  '/live-news': [P.earthNight, 'Live AI news from 74 countries'],
  '/ai-tools': [P.robot, 'Compare AI tools by job to be done'],
  '/github-repos': [P.codeScreen, '21,000+ open-source AI repositories'],
  '/tools': [P.laptopCode, 'Handy developer utilities'],
  '/open-alternatives': [P.cables, 'Self-hostable, open alternatives'],
  '/integrations': [P.cubes, 'Services mapped to capabilities'],
  '/books': [P.libraryShelves, 'Read, borrow and listen to millions of books'],
  '/playbook': [P.bookTitles, '70 chapters of AI engineering practice'],
  '/rapid-fire': [P.typing, 'Fast interview-style drills'],
  '/ai-stack': [P.robotPiano, 'The modern AI stack, layer by layer'],
  '/claude-cert': [P.studying, 'Prep for the Claude certification'],
  '/snowflake': [P.snow, 'Snowflake data cloud, end to end'],
  '/etl-guide': [P.analytics, 'Pipelines, warehouses and data engineering'],
  '/ai-jobs-global': [P.worldMap, '2,585+ AI jobs around the world'],
  '/projects': [P.whiteboard, 'Every project, one board'],
  '/linked-posts': [P.socialApps, 'The best AI posts from LinkedIn'],
  '/video-hub': [P.videoEdit, 'AI videos from YouTube, IG, TikTok & FB'],
  '/design-space': [P.architecture, '1,258 AI system designs'],
  '/learn': [P.studyDesk, '1,200+ lessons, quizzes and tests'],
  '/python-masterhub': [P.pythonNote, '885 Python lessons and labs'],
  '/ai-techstack-ref': [P.circuit, 'Reference for every AI technology'],
  '/reference-library': [P.library, 'Deep reference documents'],
  '/ai-tech-blogs': [P.dataViz, 'AI blogs and market demand'],
  '/ai-python-masterhub-pages': [P.htmlCode, '43 interactive HTML guides'],
  '/ai-chatbots': [P.openai, '1,100+ AI chatbots worldwide'],
  '/ai-agents': [P.robotHand, '375,000+ AI agents catalogued'],
  '/communication-channels': [P.phoneMessages, '120+ messaging and comms channels'],
  '/technologies': [P.reactCode, '1,000+ technologies and tutorials'],
  '/python-tutorials': [P.pythonCode, '56 step-by-step Python tutorials'],
  '/python-tech-hub': [P.codeDark, 'Python libraries and tooling'],
  '/trading': [P.stockChart, 'Markets, strategies and trading guides'],
  '/neem-karoli-baba': [P.lakeCalm, 'Timeless wisdom for calm and focus'],
  '/study-by-doing': [P.engineer, 'A hands-on AI course map'],
  '/study-by-doing/resources': [P.teamLaptops, '697 learning resources'],
  '/europe-settlement': [P.europe, 'Your blueprint for moving to Europe'],
  '/mortalapps-hub': [P.equations, 'System design, agents, quantum and more'],
}

const CHAPTER_VISUALS = {
  'llm-models': P.aiAbstract, 'fine-tuning-local': P.pcSetup, 'rag-pipeline': P.library, 'vector-databases': P.dataViz,
  'ai-agents': P.robotWhite, 'prompt-engineering': P.typing, 'python-for-ai': P.pythonNote, 'fastapi-ai-services': P.serverRacks,
  'langchain-llamaindex': P.cables, 'react-ai-frontend': P.reactCode, 'quantum-computing': P.equations, 'robotics-ai': P.robot,
  'ai-semiconductor': P.circuit, 'system-design': P.blueprint, 'grc-compliance': P.security, 'observability-evals': P.dashboard,
  'security-guardrails': P.cyber, 'enterprise-integration': P.officeModern, 'tools-catalog': P.laptopDev, 'project-ideas': P.officePlan,
  'career-resources': P.officeTeam, 'ai-news-market': P.trading, 'comprehensive-guide': P.bookStack, 'e2e-project': P.laptopTech,
  'ai-agent-architecture': P.aiGen,
}
const DEEP_DIVE_VISUALS = { rag: P.reading, agents: P.aiRender, compliance: P.graph, security: P.matrix }

function photoIdFor(path) {
  if (MENU_VISUALS[path]) return MENU_VISUALS[path][0]
  const [, kind, id] = String(path).split('/')
  if (kind === 'chapter') return CHAPTER_VISUALS[id] || P.aiAbstract
  if (kind === 'deep-dive') return DEEP_DIVE_VISUALS[id] || P.aiGen
  const parent = Object.keys(MENU_VISUALS).filter(k => k !== '/' && path.startsWith(`${k}/`)).sort((a, b) => b.length - a.length)[0]
  return parent ? MENU_VISUALS[parent][0] : null
}

export function menuImage(path, w = 120, h) {
  const id = photoIdFor(path)
  return id ? U(id, w, h) : ''
}

export function menuTagline(path) {
  return MENU_VISUALS[path]?.[1] || ''
}
