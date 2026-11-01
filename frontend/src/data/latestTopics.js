// Live "Latest" strip config: what each page tracks.
//   news — Google News search (last 30 days) via /api/news/topic
//   gh   — GitHub search for repos created in the last 90 days, by stars
// Pages without an entry (non-tech pages) show no strip.
export const LATEST_TOPICS = {
  '/': { label: 'AI engineering', news: 'AI engineering LLM', gh: 'llm' },
  '/images': { label: 'AI image & vision', news: 'AI image generation model', gh: 'image-generation' },
  '/files': { label: 'AI knowledge management', news: 'AI knowledge management RAG', gh: 'rag' },
  '/knowledge': { label: 'AI architecture', news: 'AI architecture enterprise LLM', gh: 'ai-architecture' },
  '/jobs': { label: 'AI hiring', news: 'AI engineer jobs hiring', gh: 'ai-interview' },
  '/edureka': { label: 'AI courses', news: 'AI course certification launch', gh: 'machine-learning course' },
  '/ai-news': { label: 'AI news', news: 'artificial intelligence', gh: 'llm' },
  '/live-news': { label: 'AI news', news: 'AI model release', gh: 'news-aggregator ai' },
  '/ai-tools': { label: 'AI tools', news: 'new AI tool launch', gh: 'ai-tools' },
  '/github-repos': { label: 'open-source AI', news: 'open source AI model release', gh: 'ai' },
  '/tools': { label: 'developer tools', news: 'developer tools AI coding', gh: 'developer-tools' },
  '/open-alternatives': { label: 'open-source alternatives', news: 'open source alternative self-hosted', gh: 'self-hosted' },
  '/integrations': { label: 'AI integrations & MCP', news: 'Model Context Protocol MCP integration', gh: 'mcp-server' },
  '/books': { label: 'AI & tech books', news: 'new books artificial intelligence', gh: 'ebook reader' },
  '/playbook': { label: 'AI engineering practice', news: 'AI engineering best practices production LLM', gh: 'llmops' },
  '/rapid-fire': { label: 'AI interview prep', news: 'AI engineer interview', gh: 'interview-questions machine-learning' },
  '/ai-stack': { label: 'the AI stack', news: 'AI infrastructure stack LLM inference', gh: 'llm-inference' },
  '/claude-cert': { label: 'Claude & Anthropic', news: 'Anthropic Claude', gh: 'claude' },
  '/snowflake': { label: 'Snowflake', news: 'Snowflake data cloud AI', gh: 'snowflake' },
  '/etl-guide': { label: 'data engineering', news: 'data engineering pipeline lakehouse', gh: 'data-engineering' },
  '/ai-jobs-global': { label: 'global AI jobs', news: 'AI jobs market hiring', gh: 'job-search ai' },
  '/projects': { label: 'AI projects', news: 'AI project open source launch', gh: 'ai-agents' },
  '/linked-posts': { label: 'AI on LinkedIn', news: 'AI LinkedIn', gh: 'linkedin ai' },
  '/video-hub': { label: 'AI video', news: 'AI video generation model', gh: 'video-generation' },
  '/design-space': { label: 'AI system design', news: 'AI system design architecture', gh: 'system-design' },
  '/learn': { label: 'machine learning', news: 'machine learning research breakthrough', gh: 'machine-learning' },
  '/python-masterhub': { label: 'Python', news: 'Python release', gh: 'python language:python' },
  '/ai-techstack-ref': { label: 'AI infrastructure', news: 'AI infrastructure GPU', gh: 'gpu inference' },
  '/reference-library': { label: 'AI research', news: 'AI research paper', gh: 'paper-implementations' },
  '/ai-tech-blogs': { label: 'AI market demand', news: 'AI market demand enterprise adoption', gh: 'awesome ai' },
  '/ai-python-masterhub-pages': { label: 'Python for AI', news: 'Python AI library', gh: 'python ai language:python' },
  '/ai-chatbots': { label: 'AI chatbots', news: 'AI chatbot launch', gh: 'chatbot llm' },
  '/ai-agents': { label: 'AI agents', news: 'AI agents', gh: 'ai-agents' },
  '/communication-channels': { label: 'messaging platforms', news: 'messaging platform API AI', gh: 'messaging' },
  '/technologies': { label: 'new technologies', news: 'emerging technology', gh: 'framework' },
  '/python-tutorials': { label: 'Python', news: 'Python programming', gh: 'python-tutorial' },
  '/python-tech-hub': { label: 'Python libraries', news: 'Python library release', gh: 'python-library language:python' },
  '/trading': { label: 'AI in trading', news: 'AI trading markets', gh: 'algorithmic-trading' },
  '/study-by-doing': { label: 'AI learning', news: 'AI course hands-on', gh: 'tutorial machine-learning' },
  '/study-by-doing/resources': { label: 'AI learning resources', news: 'free AI learning resources', gh: 'awesome machine-learning' },
  '/mortalapps-hub': { label: 'system design & AI', news: 'system design distributed systems AI', gh: 'system-design' },
}

const CHAPTER_TOPICS = {
  'llm-models': ['LLMs', 'new LLM model release', 'llm'],
  'fine-tuning-local': ['fine-tuning', 'LLM fine-tuning LoRA', 'fine-tuning'],
  'rag-pipeline': ['RAG', 'retrieval augmented generation', 'rag'],
  'vector-databases': ['vector databases', 'vector database', 'vector-database'],
  'ai-agents': ['AI agents', 'AI agents', 'ai-agents'],
  'prompt-engineering': ['prompt engineering', 'prompt engineering', 'prompt-engineering'],
  'python-for-ai': ['Python for AI', 'Python AI', 'python ai language:python'],
  'fastapi-ai-services': ['FastAPI', 'FastAPI AI', 'fastapi'],
  'langchain-llamaindex': ['LangChain & LlamaIndex', 'LangChain LlamaIndex', 'langchain'],
  'react-ai-frontend': ['AI frontends', 'React AI UI', 'react ai'],
  'quantum-computing': ['quantum computing', 'quantum computing', 'quantum-computing'],
  'robotics-ai': ['robotics', 'AI robotics humanoid', 'robotics'],
  'ai-semiconductor': ['AI chips', 'AI chip semiconductor', 'fpga ai'],
  'system-design': ['system design', 'system design architecture', 'system-design'],
  'grc-compliance': ['AI governance', 'AI regulation compliance', 'ai-governance'],
  'observability-evals': ['LLM evals & observability', 'LLM evaluation observability', 'llm-evaluation'],
  'security-guardrails': ['AI security', 'AI security prompt injection', 'llm-security'],
  'enterprise-integration': ['enterprise AI', 'enterprise AI integration', 'enterprise ai'],
  'tools-catalog': ['AI tools', 'new AI tool launch', 'ai-tools'],
  'project-ideas': ['AI projects', 'AI project open source', 'ai-projects'],
  'career-resources': ['AI careers', 'AI careers skills', 'ai-interview'],
  'ai-news-market': ['AI market', 'AI market', 'llm'],
  'comprehensive-guide': ['AI engineering', 'AI engineering', 'llm'],
  'e2e-project': ['end-to-end AI apps', 'AI application production', 'llm-app'],
  'ai-agent-architecture': ['agent architecture', 'AI agent architecture', 'agent-framework'],
}
const DEEP_DIVE_TOPICS = {
  rag: ['RAG', 'retrieval augmented generation', 'rag'],
  agents: ['multi-agent systems', 'multi-agent AI', 'multi-agent'],
  compliance: ['AI compliance', 'AI compliance regulation', 'ai-governance'],
  security: ['AI security', 'AI security', 'llm-security'],
}

export function latestTopicFor(path) {
  if (LATEST_TOPICS[path]) return LATEST_TOPICS[path]
  const [, kind, id] = String(path).split('/')
  const t = kind === 'chapter' ? CHAPTER_TOPICS[id] : kind === 'deep-dive' ? DEEP_DIVE_TOPICS[id] : null
  if (t) return { label: t[0], news: t[1], gh: t[2] }
  const parent = Object.keys(LATEST_TOPICS).filter(k => k !== '/' && path.startsWith(`${k}/`)).sort((a, b) => b.length - a.length)[0]
  return parent ? LATEST_TOPICS[parent] : null
}
