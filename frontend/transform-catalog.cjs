const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'data', 'aiToolsCatalog.js');
let content = fs.readFileSync(filePath, 'utf8');

// URL mapping for known tools
const urlMap = {
  // Coding / Development
  'OpenAI Codex': 'https://openai.com/index/codex/',
  'Cline AI': 'https://github.com/cline/cline',
  'Code Wiki (Google)': 'https://ai.google.dev/',
  'Stitch AI': 'https://stitch.withgoogle.com/',
  'Orchids AI': 'https://orchids.ai',
  'GitHub Copilot': 'https://github.com/features/copilot',
  'Amazon CodeWhisperer': 'https://aws.amazon.com/codewhisperer/',
  'Tabnine': 'https://www.tabnine.com',
  'JetBrains AI': 'https://www.jetbrains.com/ai/',
  'Replit AI': 'https://replit.com',
  'Sourcegraph Cody': 'https://sourcegraph.com/cody',
  'Cursor': 'https://cursor.com',
  'Aider': 'https://aider.chat',
  'Continue': 'https://continue.dev',
  'Supermaven': 'https://supermaven.com',
  'Windsurf (Codeium)': 'https://codeium.com/windsurf',
  'Devin (Cognition)': 'https://www.cognition.ai',
  'Factory AI': 'https://www.factory.ai',
  'Augment Code': 'https://www.augmentcode.com',
  'Bolt.new': 'https://bolt.new',
  'v0 (Vercel)': 'https://v0.dev',
  'Lovable': 'https://lovable.dev',
  'Bubble AI': 'https://bubble.io',
  'Snyk AI': 'https://snyk.io',
  'Socket.dev': 'https://socket.dev',
  'Codacy AI': 'https://codacy.com',
  'Blackbox AI': 'https://www.blackbox.ai',
  'Codeium': 'https://codeium.com',
  'Sweep AI': 'https://sweep.dev',
  'PearAI': 'https://github.com/PearAI-PearAI/PearAI',
  'Zed AI': 'https://zed.dev',
  'Roo Code': 'https://roocode.com',
  'Cline (VS Code)': 'https://github.com/cline/cline',
  'Phind': 'https://www.phind.com',
  'Codestral (Mistral)': 'https://mistral.ai',
  'StarCoder2': 'https://huggingface.co/bigcode/starcoder2',
  'Code Llama (Meta)': 'https://llama.meta.com',
  'DeepCode (Snyk)': 'https://snyk.io',
  'Kody AI': 'https://kody.dev',
  'Pieces': 'https://pieces.app',
  'Moderne': 'https://www.moderne.io',
  'Autopilot (GitHub)': 'https://github.com/features/copilot',
  'Bito AI': 'https://www.bito.ai',
  'Google AI Studio': 'https://ai.google.dev/',
  'Replit Agent': 'https://replit.com',
  'Whiskey (Phind)': 'https://www.phind.com',
  'Cody (Sourcegraph)': 'https://sourcegraph.com/cody',
  'github/spe-kit': 'https://github.com/spe-kit/spe-kit',

  // Video / Image / Media
  'Heygen': 'https://www.heygen.com',
  'CapCut AI': 'https://www.capcut.com',
  'Sora (OpenAI)': 'https://openai.com/sora',
  'Runway Gen-3': 'https://runwayml.com',
  'Midjourney': 'https://www.midjourney.com',
  'DALL-E 3 (OpenAI)': 'https://openai.com/dall-e-3',
  'Stable Diffusion': 'https://stability.ai',
  'Adobe Firefly': 'https://firefly.adobe.com',
  'Canva AI': 'https://www.canva.com',
  'Leonardo AI': 'https://leonardo.ai',
  'Ideogram': 'https://ideogram.ai',
  'Flux (Black Forest)': 'https://blackforestlabs.ai',
  'Pika': 'https://pika.art',
  'Luma Dream Machine': 'https://lumalabs.ai/dream-machine',
  'Kling AI': 'https://klingai.com',
  'Synthesia': 'https://www.synthesia.io',
  'Descript': 'https://www.descript.com',
  'Kapwing': 'https://www.kapwing.com',
  'Photoroom': 'https://www.photoroom.com',
  'Remove.bg': 'https://www.remove.bg',
  'Clipdrop': 'https://clipdrop.co',
  'Suno': 'https://suno.com',
  'Udio': 'https://www.udio.com',
  'AIVA': 'https://www.aiva.ai',
  'D-ID': 'https://www.d-id.com',
  'Colossyan': 'https://www.colossyan.com',
  'InVideo AI': 'https://invideo.io',
  'Pictory': 'https://pictory.ai',
  'Fliki': 'https://fliki.ai',
  'Topaz Video AI': 'https://www.topazlabs.com',
  'Kling AI 3.0': 'https://klingai.com',
  'Luma': 'https://lumalabs.ai',
  'Uni-1 Luma': 'https://lumalabs.ai',
  'Runway Characters': 'https://runwayml.com',
  'Dream Machine': 'https://lumalabs.ai/dream-machine',
  'Project Genie (Google)': 'https://labs.google',
  'Pomeli (Google Labs)': 'https://labs.google',

  // Voice / Audio / Speech
  'ElevenLabs': 'https://elevenlabs.io',
  'Hume AI': 'https://www.hume.ai',
  'Murf AI': 'https://murf.ai',
  'WellSaid Labs': 'https://wellsaidlabs.com',
  'Play.ht': 'https://play.ht',
  'Speechify': 'https://speechify.com',
  'Azure AI Speech': 'https://azure.microsoft.com/en-us/products/ai-services/text-to-speech',
  'Google Cloud TTS': 'https://cloud.google.com/text-to-speech',
  'Amazon Polly': 'https://aws.amazon.com/polly/',
  'Whisper (OpenAI)': 'https://github.com/openai/whisper',
  'Deepgram': 'https://deepgram.com',
  'AssemblyAI': 'https://www.assemblyai.com',
  'Otter.ai': 'https://otter.ai',
  'Krisp': 'https://krisp.ai',
  'Clipchamp TTS': 'https://clipchamp.com',
  'Clipchamp': 'https://clipchamp.com',
  'Bark (Suno)': 'https://suno.com',
  'Gemini 3.1 Flash Live': 'https://gemini.google.com',

  // Business / Marketing / Sales
  'HubSpot AI': 'https://www.hubspot.com/products/ai',
  'Salesforce Einstein': 'https://www.salesforce.com/products/platform/einstein/',
  'Notion AI': 'https://www.notion.so/product/ai',
  'Grammarly': 'https://www.grammarly.com',
  'Jasper AI': 'https://www.jasper.ai',
  'Copy.ai': 'https://www.copy.ai',
  'ClickUp AI': 'https://clickup.com',
  'Asana AI': 'https://asana.com',
  'Monday AI': 'https://monday.com',
  'Slack AI': 'https://slack.com/features/ai',
  'Microsoft Copilot': 'https://www.microsoft.com/en-us/microsoft-365/copilot',
  'Zoom AI Companion': 'https://zoom.us',
  'Gong.io': 'https://www.gong.io',
  'Intercom Fin': 'https://www.intercom.com',
  'Zendesk AI': 'https://www.zendesk.com',
  'ServiceNow AI': 'https://www.servicenow.com',
  'Palantir AIP': 'https://www.palantir.com/platforms/aip',
  'Databricks AI': 'https://www.databricks.com',
  'Snowflake Cortex': 'https://www.snowflake.com',
  'Perplexity': 'https://www.perplexity.ai',
  'Canva': 'https://www.canva.com',
  'Google Gemini Work': 'https://gemini.google.com',

  // Research / Analysis / Intelligence
  'Perplexity AI': 'https://www.perplexity.ai',
  'Elicit': 'https://elicit.com',
  'Semantic Scholar': 'https://www.semanticscholar.org',
  'Consensus': 'https://consensus.app',
  'Scite.ai': 'https://scite.ai',
  'Connected Papers': 'https://www.connectedpapers.com',
  'Research Rabbit': 'https://www.researchrabbit.ai',
  'Wolfram Alpha': 'https://www.wolframalpha.com',
  'Tavily': 'https://tavily.com',
  'Firecrawl': 'https://www.firecrawl.dev',
  'Browserbase': 'https://www.browserbase.com',
  'Jina AI': 'https://jina.ai',
  'Glean': 'https://www.glean.com',

  // Legal / Healthcare / Specialized
  'Harvey AI': 'https://harvey.ai',
  'Luminance': 'https://www.luminance.com',
  'DeepMind AlphaFold': 'https://alphafold.ebi.ac.uk',
  'Isomorphic Labs': 'https://www.isomorphiclabs.com',
  'Khan Academy Khanmigo': 'https://www.khanacademy.org/khan-labs',
  'Duolingo AI': 'https://www.duolingo.com',

  // Platforms / Infrastructure
  'Manus': 'https://manus.imanu.com',
  'Manus AI': 'https://manus.imanu.com',
  'ChatGPT Workspace': 'https://openai.com/chatgpt',
  'Ollama': 'https://ollama.com',
  'LM Studio': 'https://lmstudio.ai',
  'Jan': 'https://jan.ai',
  'GPT4All': 'https://gpt4all.io',
  'vLLM': 'https://github.com/vllm-project/vllm',
  'Grok-2': 'https://grok.com',
  'Grok-3': 'https://grok.com',
  'DBRX': 'https://www.databricks.com',
  'Claude 3.5 Sonnet': 'https://claude.ai',
  'Claude 4 Opus': 'https://claude.ai',
  'Claude Managed Agents': 'https://claude.ai',
  'Claude Security': 'https://claude.ai',
  'Lovable Aesthetics': 'https://lovable.dev',
  'Pika Agents': 'https://pika.art',
  'Perplexity Computer': 'https://www.perplexity.ai',
  'GPT-4o (OpenAI)': 'https://openai.com',
  'GPT-4.5 (OpenAI)': 'https://openai.com',
  'o1 (OpenAI)': 'https://openai.com',
  'o3 (OpenAI)': 'https://openai.com',
  'Gemini 2.5 Pro': 'https://gemini.google.com',
  'Gemini 2.5 Flash': 'https://gemini.google.com',
  'Llama 3.1 405B': 'https://llama.meta.com',
  'Llama 4': 'https://llama.meta.com',
  'Mistral Large': 'https://mistral.ai',
  'Mistral Small': 'https://mistral.ai',
  'Mixtral': 'https://mistral.ai',
  'Claude/Gemini/Saner': 'https://claude.ai',
  'Google AI Edge': 'https://ai.google.dev/',
  'Notion Custom Agents': 'https://www.notion.so/product/ai',

  // Chatbots / AI Assistants
  'ChatGPT': 'https://chat.openai.com',
  'Claude': 'https://claude.ai',
  'Gemini': 'https://gemini.google.com',
  'Copilot': 'https://copilot.microsoft.com',
  'Grok': 'https://grok.com',
  'Character.ai': 'https://character.ai',
  'Poe': 'https://poe.com',
  'Botpress': 'https://botpress.com',
  'Dialogflow': 'https://cloud.google.com/dialogflow',
  'Amazon Lex': 'https://aws.amazon.com/lex/',
  'Rasa': 'https://rasa.com',
  'Mistral Le Chat': 'https://mistral.ai',
  'Intercom': 'https://www.intercom.com',
  'HuggingChat': 'https://huggingface.co',
  'Codeium (Chatbots)': 'https://codeium.com',

  // Robotics
  'Boston Dynamics': 'https://www.bostondynamics.com',
  'Tesla Optimus': 'https://www.tesla.com/AI',
  'Waymo': 'https://waymo.com',
  'NVIDIA Isaac': 'https://developer.nvidia.com/isaac',

  // Art / Design / Creative
  'Figma AI': 'https://www.figma.com',
  'Adobe Sensei': 'https://www.adobe.com/sensei.html',
  'Prisma': 'https://prisma-ai.com',
  'DALL-E 3': 'https://openai.com/dall-e-3',
  'Photoshop AI': 'https://www.adobe.com',
  'Lightroom AI': 'https://www.adobe.com',
  'Topaz Labs': 'https://www.topazlabs.com',

  // Data / Analytics / BI
  'Tableau AI': 'https://www.tableau.com',
  'Power BI Copilot': 'https://powerbi.microsoft.com',
  'ThoughtSpot': 'https://www.thoughtspot.com',
  'Grafana AI': 'https://grafana.com',
  'Datadog AI': 'https://www.datadoghq.com',
  'Snowflake': 'https://www.snowflake.com',
  'Databricks': 'https://www.databricks.com',

  // AI Agent Frameworks
  'LangChain': 'https://www.langchain.com',
  'LangGraph': 'https://www.langchain.com/langgraph',
  'CrewAI': 'https://www.crewai.com',
  'AutoGen': 'https://microsoft.github.io/autogen/',
  'Haystack': 'https://haystack.deepset.ai',
  'DSPy': 'https://dspy.ai',
  'LlamaIndex': 'https://www.llamaindex.ai',
  'Dify': 'https://dify.ai',
  'n8n AI': 'https://n8n.io',
  'AutoGen Studio': 'https://microsoft.github.io/autogen/',
  'Smolagents': 'https://huggingface.co',
  'OpenAI Agents SDK': 'https://openai.com',
  'Google ADK': 'https://ai.google.dev/',
  'Swarm (OpenAI)': 'https://openai.com',
  'Mastra': 'https://www.google.com/search?q=Mastra+TypeScript+AI+agent+framework',

  // Vector DB / RAG
  'Pinecone': 'https://www.pinecone.io',
  'Weaviate': 'https://weaviate.io',
  'Milvus': 'https://milvus.io',
  'Qdrant': 'https://qdrant.tech',
  'Chroma': 'https://www.trychroma.com',

  // MLOps / Fine-Tuning
  'Weights & Biases': 'https://wandb.ai',
  'MLflow': 'https://mlflow.org',
  'LangSmith': 'https://smith.langchain.com',
  'Langfuse': 'https://langfuse.com',
  'Roboflow': 'https://www.google.com/search?q=Roboflow+computer+vision+platform',

  // Agent Infrastructure
  'Model Context Protocol': 'https://modelcontextprotocol.io',
  'Guardrails AI': 'https://www.guardrailsai.com',
  'MemGPT': 'https://www.memgpt.ai',
  'Mem0': 'https://mem0.ai',
  'NeMo Guardrails': 'https://www.google.com/search?q=NeMo+Guardrails+NVIDIA',
  'LangChain Tools': 'https://www.langchain.com',
  'CrewAI Tools': 'https://www.crewai.com',
  'Anthropic Tool Use': 'https://claude.ai',
  'OpenAI Function Call': 'https://openai.com',
  'Google Gemini Tools': 'https://ai.google.dev/',
  'LangSmith Tracing': 'https://smith.langchain.com',
  'Phoenix (Arize)': 'https://www.google.com/search?q=Phoenix+Arize+LLM+observability',
  'Weave (W&B)': 'https://wandb.ai',

  // Prompting Techniques
  'DSPy (Prompting)': 'https://dspy.ai',
  'OpenAI Playground': 'https://openai.com',
  'Anthropic Console': 'https://claude.ai',
  'Google AI Studio (Prompting)': 'https://ai.google.dev/',
  'LangFuse Prompts': 'https://langfuse.com',
  'Promptfoo': 'https://www.google.com/search?q=Promptfoo+LLM+testing',

  // Infrastructure
  'Hugging Face': 'https://huggingface.co',
  'AWS Bedrock': 'https://aws.amazon.com/bedrock/',
  'Google Vertex AI': 'https://cloud.google.com/vertex-ai',
  'Azure AI': 'https://azure.microsoft.com/en-us/products/ai',
  'SageMaker': 'https://aws.amazon.com/sagemaker/',

  // RAG Frameworks
  'RAGFlow': 'https://www.google.com/search?q=RAGFlow+open-source+RAG+engine',
  'GraphRAG': 'https://www.google.com/search?q=GraphRAG+Microsoft+graph+based',

  // Platforms / additional
  'Phi-3': 'https://www.google.com/search?q=Phi-3+Microsoft+small+LLM',
  'Phi-4': 'https://www.google.com/search?q=Phi-4+Microsoft+small+LLM',
  'Gemma 2': 'https://www.google.com/search?q=Gemma+2+Google+open-source+LLM',
  'Granite': 'https://www.google.com/search?q=Granite+IBM+enterprise+LLM',
  'Snow Arctic': 'https://www.google.com/search?q=Snow+Arctic+Snowflake+enterprise+LLM',
  'llama.cpp': 'https://www.google.com/search?q=llama.cpp+local+LLM+inference',

  // Misc
  'YCombinator': 'https://www.ycombinator.com',
};

function getSearchUrl(name) {
  const clean = name.replace(/[()]/g, '').replace(/\s+/g, '+');
  return `https://www.google.com/search?q=${encodeURIComponent(clean)}+AI`;
}

// Process each tool tuple line
const lines = content.split('\n');
const newLines = [];

for (let i = 0; i < lines.length; i++) {
  let line = lines[i];
  
  // Match tool tuple pattern: ['name', 'category', 'description', 'icon']
  const match = line.match(/^(\s*\['[^']+',\s*'[^']+',\s*'[^']+',\s*'[^']+'|[^']*\['[^']+',\s*'[^']+',\s*'[^']+',\s*'[^']+')\]$/);
  
  // Try a more flexible match
  const tupleMatch = line.match(/^(\s*)\[('[^']*'),\s*('[^']*'),\s*('[^']*'),\s*('[^']*')\]$/);
  
  if (tupleMatch) {
    const indent = tupleMatch[1];
    const name = tupleMatch[2].slice(1, -1); // Remove quotes
    const category = tupleMatch[3].slice(1, -1);
    const description = tupleMatch[4].slice(1, -1);
    const icon = tupleMatch[5].slice(1, -1);
    
    // Find URL - check exact match first, then with category context
    let url = urlMap[name];
    
    // Special cases for tools that appear in multiple categories
    if (!url) {
      if (name === 'Codeium' && category === 'Chatbots / AI Assistants') {
        url = 'https://codeium.com';
      } else if (name === 'Perplexity' && category === 'Chatbots / AI Assistants') {
        url = 'https://www.perplexity.ai';
      } else if (name === 'You.com' && category === 'Chatbots / AI Assistants') {
        url = 'https://www.google.com/search?q=You.com+AI+chat+search';
      } else if (name === 'Perplexity' && category === 'Business / Marketing / Sales') {
        url = 'https://www.perplexity.ai';
      }
    }
    
    if (!url) {
      url = getSearchUrl(name);
    }
    
    // Escape single quotes in URL
    const escapedUrl = url.replace(/'/g, "\\'");
    
    newLines.push(`${indent}['${name}', '${category}', '${description}', '${icon}', '${escapedUrl}'],`);
  } else {
    newLines.push(line);
  }
}

let newContent = newLines.join('\n');

// Remove 'Agent Frameworks (additional)' from TOOL_CATEGORIES
newContent = newContent.replace(/\s*'Agent Frameworks \(additional\)'/g, '');

// Remove the entry from CATEGORY_META
newContent = newContent.replace(/\s*'Agent Frameworks \(additional\)':\s*\{[^}]+\},?\n?/g, '\n');

// Clean up any double commas or trailing commas in arrays
newContent = newContent.replace(/,\s*,/g, ',');

// Remove empty lines left behind from CATEGORY_META removal
newContent = newContent.replace(/\n\s*\n\s*\n/g, '\n\n');

// Update factory function to include url
newContent = newContent.replace(
  /const AI_TOOLS_CATALOG = _tools\.map\(\(\[name, category, description, icon\]\) => \(\{[\s\S]*?\}\)\);/,
  `const AI_TOOLS_CATALOG = _tools.map(([name, category, description, icon, url]) => ({
  name,
  category,
  description,
  icon,
  url: url || '',\n}));`
);

// Fix the Agent Frameworks (additional) tools - change their category to AI Agent Frameworks
newContent = newContent.replace(
  /'Agent Frameworks \(additional\)'/g,
  "'AI Agent Frameworks'"
);

// Update the TOOL_CATEGORIES to not have duplicates - remove the empty entry
// First let's find and fix the array
newContent = newContent.replace(
  /'Agent Frameworks \(additional\)'/g,
  ''
);

// Clean up TOOL_CATEGORIES array - remove empty strings left behind
newContent = newContent.replace(/,\s*,/g, ',');

fs.writeFileSync(filePath, newContent, 'utf8');
console.log('Catalog file updated successfully!');
console.log('URLs added to all tool tuples.');
console.log('Agent Frameworks (additional) removed from TOOL_CATEGORIES and CATEGORY_META.');
