import { TECHNOLOGY_CATEGORIES } from './technologiesData'
import { getRichLesson } from './allTechnologiesLessons'

const slugify = value => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const languageFor = (topic, catalog) => catalog.id === 'python' || /python|numpy|pandas|pytorch|scipy|sympy|django|flask|fastapi|scrapy|pytest/i.test(topic) ? 'python' : catalog.id === 'java' || /java|spring|hibernate|maven|junit/i.test(topic) ? 'java' : 'javascript'

const aliases = {
  sap: { name: 'SAP', description: 'SAP ABAP, FICO, MM, SD, HANA & more' },
  engineering: { name: 'Engineering', description: 'Control Systems, Signals, Electronics & more' },
  scripts: { name: 'Scripts', description: 'JavaScript, jQuery, Perl, PHP & more' },
  cs: { name: 'Computer Science', description: 'DSA, OS, Compiler Design, Networking & more' },
  quality: { name: 'Software Quality', description: 'Testing, Selenium, Agile, Jenkins & more' },
  bigdata: { name: 'Big Data & Analytics', description: 'Hadoop, Spark, Tableau, Power BI & more' },
}

export const LEARNING_CATALOGS = TECHNOLOGY_CATEGORIES.map(category => ({
  id: category.id,
  name: aliases[category.id]?.name || category.name,
  icon: category.icon,
  color: category.color,
  gradient: category.gradient,
  count: category.tutorialCount,
  description: aliases[category.id]?.description || category.description,
  topics: category.tutorials.map(item => ({ id: slugify(item.name), name: item.name, icon: item.icon, category: category.name })),
}))

const extraCatalogs = [
  { id: 'telecom', name: 'Telecom', icon: '📡', color: '#00bcd4', count: 16, description: 'GSM, CDMA, LTE, 5G, WiMAX & more', topics: ['GSM', 'CDMA', 'LTE', '5G', 'WiMAX', 'Telecommunication Networks', 'Mobile Switching', 'Fiber Optics', 'Satellite Communication', 'Wireless Communication', 'Network Planning', 'VoIP', 'IMS', 'IoT Connectivity', 'Radio Propagation', 'Telecom Billing'] },
  { id: 'xml', name: 'XML Technologies', icon: '📄', color: '#ff9800', count: 12, description: 'XML, XSLT, XPath, SOAP, WSDL & more', topics: ['XML', 'XSLT', 'XPath', 'XQuery', 'SAX', 'DOM Parser', 'SOAP', 'WSDL', 'XML Schema', 'DTD', 'RSS', 'Atom'] },
  { id: 'mainframe', name: 'Mainframe', icon: '🖥️', color: '#607d8b', count: 6, description: 'COBOL, JCL, CICS, DB2, VSAM & more', topics: ['COBOL', 'JCL', 'CICS', 'DB2', 'VSAM', 'Mainframe'] },
  { id: 'security', name: 'Software Security', icon: '🛡️', color: '#ef4444', count: 6, description: 'Network, Internet, Mobile, Cyber Security', topics: ['Network Security', 'Internet Security', 'Mobile Security', 'Cyber Security', 'Application Security', 'Ethical Hacking'] },
  { id: 'mathematics', name: 'Mathematics', icon: '🔢', color: '#8b5cf6', count: 35, description: 'Algebra, Geometry, Fractions, Statistics & more', topics: ['Algebra', 'Geometry', 'Fractions', 'Statistics', 'Calculus', 'Trigonometry', 'Probability', 'Linear Algebra', 'Discrete Mathematics', 'Number System'] },
  { id: 'soft-skills', name: 'Soft Skills', icon: '🤝', color: '#ec4899', count: 56, description: 'Communication, Leadership, Etiquette & more', topics: ['Communication Skills', 'Leadership', 'Interview Skills', 'Time Management', 'Presentation Skills', 'Business Etiquette', 'Emotional Intelligence', 'Teamwork', 'Negotiation', 'Problem Solving'] },
  { id: 'sports', name: 'Sports Tutorials', icon: '⚽', color: '#22c55e', count: 100, description: 'Cricket, Football, Tennis, Chess & more', topics: ['Cricket', 'Football', 'Tennis', 'Chess', 'Basketball', 'Swimming', 'Athletics', 'Badminton', 'Volleyball', 'Sports Training'] },
  { id: 'upsc', name: 'UPSC IAS Exams', icon: '📚', color: '#b45309', count: 17, description: 'History, Geography, Polity, Economy & more', topics: ['Indian History', 'World History', 'Geography', 'Indian Polity', 'Indian Economy', 'Environment', 'Science and Technology', 'Current Affairs', 'Ethics', 'CSAT'] },
  { id: 'academic', name: 'Academic', icon: '🎓', color: '#2563eb', count: 7, description: 'CBSE, Accounting, Statistics & more', topics: ['CBSE', 'Accounting', 'Statistics', 'Economics', 'Business Studies', 'Mathematics', 'Academic Research'] },
]

for (const catalog of extraCatalogs) {
  if (!LEARNING_CATALOGS.some(existing => existing.id === catalog.id)) {
    LEARNING_CATALOGS.push({ ...catalog, topics: catalog.topics.map(name => ({ id: slugify(name), name, icon: '◈', category: catalog.name })) })
  }
}

export function getCatalog(id) { return LEARNING_CATALOGS.find(catalog => catalog.id === id) }
export function getTopic(catalogId, topicId) { return getCatalog(catalogId)?.topics.find(topic => topic.id === topicId) }

const topicFocus = topic => {
  const lower = topic.toLowerCase()
  if (/database|sql|mongo|redis|cassandra|couch|oracle|dynamo|firebase|neo4j|postgres|mysql/.test(lower)) return 'data modeling, queries, indexes, transactions, and backup strategy'
  if (/test|selenium|cypress|junit|jest|quality|bug/.test(lower)) return 'test design, automation boundaries, reliable fixtures, and failure diagnosis'
  if (/docker|kubernetes|git|jenkins|ansible|devops|linux|server|cloud/.test(lower)) return 'repeatable delivery, configuration, observability, and rollback safety'
  if (/react|angular|vue|html|css|javascript|web|frontend|bootstrap/.test(lower)) return 'component structure, browser behavior, accessibility, and API integration'
  if (/machine|ai|neural|tensorflow|pytorch|llm|chat|vision|learning|data science/.test(lower)) return 'data preparation, model behavior, evaluation, and responsible deployment'
  if (/management|marketing|business|sales|hr|finance|agile|scrum/.test(lower)) return 'goals, stakeholders, measurable outcomes, decision records, and continuous improvement'
  return 'the core abstraction, normal workflow, integration boundary, and operational trade-offs'
}

export function getLesson(topic, catalog) {
  // Check for rich lesson data first
  const richLesson = getRichLesson(catalog.id, topic.id)
  if (richLesson) {
    return richLesson
  }

  const language = languageFor(topic.name, catalog)
  const focus = topicFocus(topic.name)
  const className = `${topic.name.replace(/[^A-Za-z0-9]/g, '') || 'Topic'}Example`
  const functionName = slugify(topic.name).replace(/-/g, '_') || 'topic'
  const code = language === 'python'
    ? `from dataclasses import dataclass\n\n@dataclass\nclass ${className}:\n    value: str\n    status: str = "ready"\n\ndef process_${functionName}(value: str) -> ${className}:\n    if not value.strip():\n        raise ValueError("value must not be empty")\n    return ${className}(value=value.strip())\n\nprint(process_${functionName}("production input"))`
    : language === 'java'
      ? `public class ${className} {\n    public static void main(String[] args) {\n        String value = "production input";\n        if (value.isBlank()) throw new IllegalArgumentException("value is required");\n        System.out.println("${topic.name}: " + value.trim());\n    }\n}`
      : `export function process${className}(value) {\n  if (!String(value || '').trim()) throw new Error('value is required');\n  return { value: String(value).trim(), status: 'ready' };\n}\n\nconsole.log(process${className}('production input'));`
  const secondCode = language === 'python'
    ? `result = process_${functionName}("checked input")\nassert result.status == "ready"\nprint({"topic": "${topic.name}", "ready": True, "value": result.value})`
    : `const result = process${className}('checked input');\nconsole.assert(result.status === 'ready');\nconsole.log({ topic: '${topic.name}', ...result });`
  return {
    language,
    overview: `${topic.name} is a ${catalog.name.toLowerCase()} topic focused on ${focus}. Learn the concept first, then connect it to a small, observable workflow that can be tested before it is scaled.`,
    concepts: [`${topic.name} vocabulary and boundaries`, `How ${topic.name} fits into a production architecture`, 'Input validation, output contracts, and error handling', 'Testing, performance, security, and maintainability'],
    examples: [{ title: 'Core implementation', description: `A minimal ${topic.name} example with an explicit input and output contract.`, code }, { title: 'Verification and health check', description: 'A second example showing how to verify the result before passing it to the next system.', code: secondCode }],
    scenarios: [`A product team introduces ${topic.name} to improve a measurable customer workflow while preserving a manual fallback.`, `An operations pipeline uses ${topic.name} to process repeatable inputs with validation, retries, and status reporting.`, `A platform team monitors ${topic.name} in production and uses test results, latency, and error rates to decide when to scale or roll back.`],
    useCases: [`Prototype and explain ${topic.name} to a development team`, `Automate a repeated workflow with ${topic.name}`, `Integrate ${topic.name} into a secure, observable production system`],
    tradeoffs: ['Advantages: faster delivery, reusable abstractions, and a clear path from prototype to production.', 'Advantages: teams can measure behavior with tests, logs, and domain-specific acceptance criteria.', 'Disadvantages: added dependencies, operational complexity, and a learning curve for new maintainers.', 'Disadvantages: poor configuration or missing monitoring can turn small failures into production incidents.'],
    practices: ['Document the input/output contract and supported versions', 'Keep secrets and permissions at the correct trust boundary', 'Test success, invalid input, timeout, retry, and rollback paths', 'Measure latency, cost, error rate, and user/business outcome before optimizing'],
  }
}
