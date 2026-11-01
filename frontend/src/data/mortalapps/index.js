import { SEMICONDUCTOR_DATA } from '../semiconductorData.js';

/**
 * MortalApps Complete Content Index — existing scraped articles plus Semiconductor
 * learning content. The original scraped datasets remain unchanged.
 */
export const SECTIONS = [
  {
    "key": "learn",
    "name": "AI/ML Resources",
    "emoji": "📚",
    "articleCount": 302,
    "subcategories": [
      {
        "key": "deep-learning",
        "name": "Deep Learning",
        "count": 24
      },
      {
        "key": "nlp-and-llms",
        "name": "Nlp And Llms",
        "count": 28
      },
      {
        "key": "computer-vision",
        "name": "Computer Vision",
        "count": 26
      },
      {
        "key": "reinforcement-learning",
        "name": "Reinforcement Learning",
        "count": 28
      },
      {
        "key": "statistics-and-probability",
        "name": "Statistics And Probability",
        "count": 26
      },
      {
        "key": "data-preprocessing",
        "name": "Data Preprocessing",
        "count": 24
      },
      {
        "key": "model-evaluation",
        "name": "Model Evaluation",
        "count": 25
      },
      {
        "key": "mlops-and-deployment",
        "name": "Mlops And Deployment",
        "count": 26
      },
      {
        "key": "ai-ethics",
        "name": "Ai Ethics",
        "count": 25
      },
      {
        "key": "generative-ai",
        "name": "Generative Ai",
        "count": 35
      },
      {
        "key": "ai-agents",
        "name": "Ai Agents",
        "count": 35
      }
    ]
  },
  {
    "key": "system-design",
    "name": "System Design",
    "emoji": "🏗️",
    "articleCount": 66,
    "subcategories": [
      {
        "key": "ai-systems",
        "name": "Ai Systems",
        "count": 9
      },
      {
        "key": "workflow-engineering",
        "name": "Workflow Engineering",
        "count": 9
      },
      {
        "key": "reliability-engineering",
        "name": "Reliability Engineering",
        "count": 9
      },
      {
        "key": "backend-architectures",
        "name": "Backend Architectures",
        "count": 11
      },
      {
        "key": "observability",
        "name": "Observability",
        "count": 8
      },
      {
        "key": "data-and-messaging-systems",
        "name": "Data And Messaging Systems",
        "count": 12
      },
      {
        "key": "distributed-coordination",
        "name": "Distributed Coordination",
        "count": 8
      }
    ]
  },
  {
    "key": "python",
    "name": "Python Code",
    "emoji": "🐍",
    "articleCount": 23,
    "subcategories": [
      {
        "key": "setup-and-execution",
        "name": "Setup And Execution",
        "count": 8
      },
      {
        "key": "hidden-traps",
        "name": "Hidden Traps",
        "count": 2
      },
      {
        "key": "databases",
        "name": "Databases",
        "count": 2
      },
      {
        "key": "pandas-and-data",
        "name": "Pandas And Data",
        "count": 1
      },
      {
        "key": "ai-agents",
        "name": "Ai Agents",
        "count": 3
      },
      {
        "key": "deployment-and-monitoring",
        "name": "Deployment And Monitoring",
        "count": 4
      },
      {
        "key": "performance-and-security",
        "name": "Performance And Security",
        "count": 3
      }
    ]
  },
  {
    "key": "agents",
    "name": "AI Agents",
    "emoji": "🤖",
    "articleCount": 122,
    "subcategories": [
      {
        "key": "foundations",
        "name": "Foundations",
        "count": 6
      },
      {
        "key": "architecture-patterns",
        "name": "Architecture Patterns",
        "count": 13
      },
      {
        "key": "protocols",
        "name": "Protocols",
        "count": 20
      },
      {
        "key": "memory-context",
        "name": "Memory Context",
        "count": 14
      },
      {
        "key": "frameworks",
        "name": "Frameworks",
        "count": 15
      },
      {
        "key": "production-engineering",
        "name": "Production Engineering",
        "count": 17
      },
      {
        "key": "security-governance",
        "name": "Security Governance",
        "count": 16
      },
      {
        "key": "future-horizons",
        "name": "Future Horizons",
        "count": 11
      },
      {
        "key": "projects",
        "name": "Projects",
        "count": 10
      }
    ]
  },
  {
    "key": "infrastructure",
    "name": "AI Infrastructure",
    "emoji": "⚙️",
    "articleCount": 150,
    "subcategories": [
      {
        "key": "gpu-execution-model",
        "name": "Gpu Execution Model",
        "count": 15
      },
      {
        "key": "gpu-memory-architecture",
        "name": "Gpu Memory Architecture",
        "count": 15
      },
      {
        "key": "cuda-triton-compiler-systems",
        "name": "Cuda Triton Compiler Systems",
        "count": 15
      },
      {
        "key": "transformer-attention-optimization",
        "name": "Transformer Attention Optimization",
        "count": 15
      },
      {
        "key": "llm-inference-optimization",
        "name": "Llm Inference Optimization",
        "count": 15
      },
      {
        "key": "ai-quantization-fp8",
        "name": "Ai Quantization Fp8",
        "count": 15
      },
      {
        "key": "distributed-training-parallelism",
        "name": "Distributed Training Parallelism",
        "count": 15
      },
      {
        "key": "ai-networking-interconnects",
        "name": "Ai Networking Interconnects",
        "count": 15
      },
      {
        "key": "ai-serving-infrastructure",
        "name": "Ai Serving Infrastructure",
        "count": 15
      },
      {
        "key": "ai-observability-profiling",
        "name": "Ai Observability Profiling",
        "count": 15
      }
    ]
  },
  {
    "key": "quantum-computing",
    "name": "Quantum Computing",
    "emoji": "⚛️",
    "articleCount": 127,
    "subcategories": [
      {
        "key": "why-quantum-computing-exists",
        "name": "Why Quantum Computing Exists",
        "count": 12
      },
      {
        "key": "math-foundations-for-quantum",
        "name": "Math Foundations For Quantum",
        "count": 12
      },
      {
        "key": "the-qubit",
        "name": "The Qubit",
        "count": 12
      },
      {
        "key": "quantum-gates",
        "name": "Quantum Gates",
        "count": 14
      },
      {
        "key": "quantum-circuits",
        "name": "Quantum Circuits",
        "count": 14
      },
      {
        "key": "quantum-algorithms",
        "name": "Quantum Algorithms",
        "count": 12
      },
      {
        "key": "quantum-programming",
        "name": "Quantum Programming",
        "count": 14
      },
      {
        "key": "quantum-hardware",
        "name": "Quantum Hardware",
        "count": 14
      },
      {
        "key": "error-correction-and-scaling",
        "name": "Error Correction And Scaling",
        "count": 12
      },
      {
        "key": "frontier-and-future",
        "name": "Frontier And Future",
        "count": 11
      }
    ]
  },
  {
    "key": "semiconductors",
    "name": "Semiconductors & Chips",
    "emoji": "💠",
    "articleCount": 8,
    "subcategories": SEMICONDUCTOR_DATA.categories.map(category => ({
      "key": category.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      "name": category.name,
      "count": category.concepts.length
    }))
  }
];

function semiconductorArticles() {
  return SEMICONDUCTOR_DATA.categories.map(category => ({
    subcategory: category.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
    subcategoryName: category.name,
    articles: category.concepts.map(concept => ({
      ...concept,
      id: concept.slug,
      description: concept.tldr,
      readTime: '8 min read',
      codeExamples: concept.codeExample ? [{ language: 'Python', title: 'Example', code: concept.codeExample }] : []
    }))
  }));
}

// Lazy loader for section data. Keep these imports explicit so Vite can include
// each generated section as a production chunk (a variable import path is not
// reliably emitted by Vite/Rollup and previously produced a 404 for `learn`).
const sectionLoaders = {
  learn: () => import('./learn.js'),
  'system-design': () => import('./system-design.js'),
  python: () => import('./python.js'),
  agents: () => import('./agents.js'),
  infrastructure: () => import('./infrastructure.js'),
  'quantum-computing': () => import('./quantum-computing.js'),
  semiconductors: async () => ({ default: semiconductorArticles() }),
};
const sectionModules = {};
export async function loadSection(sectionKey) {
  if (!sectionModules[sectionKey]) {
    const load = sectionLoaders[sectionKey];
    if (!load) return [];
    try {
      const mod = await load();
      sectionModules[sectionKey] = mod.default;
    } catch (e) {
      console.error('Failed to load section:', sectionKey, e);
      return [];
    }
  }
  return sectionModules[sectionKey];
}

// Search across all loaded sections
export async function searchArticles(query) {
  const q = query.toLowerCase();
  const results = [];
  for (const sec of SECTIONS) {
    const data = await loadSection(sec.key);
    for (const sub of data) {
      for (const art of sub.articles) {
        if (art.title.toLowerCase().includes(q) || art.description.toLowerCase().includes(q)) {
          results.push(art);
        }
      }
    }
  }
  return results;
}
