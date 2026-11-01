import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './MortalAppsHub.css';
import { useLang } from '../i18n';

const SECTIONS = [
  {
    id: 'ai-ml',
    title: 'AI / ML Resources',
    icon: '🧠',
    description: '332 concepts across ML, Deep Learning, NLP, Computer Vision, Reinforcement Learning, and Generative AI.',
    topics: 12,
    concepts: 332,
    color: '#6366f1',
    gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    route: '/ai-ml-resources',
    tags: ['ML Fundamentals', 'Deep Learning', 'NLP & LLMs', 'Computer Vision', 'Reinforcement Learning', 'Statistics', 'Data Preprocessing', 'Model Evaluation', 'MLOps', 'AI Ethics', 'Generative AI', 'AI Agents']
  },
  {
    id: 'system-design',
    title: 'System Design',
    icon: '🏗️',
    description: '66 production-focused system design articles for senior engineers. AI systems, reliability, distributed coordination, backend architectures.',
    topics: 7,
    concepts: 66,
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg, #f59e0b, #f97316)',
    route: '/system-design',
    tags: ['AI Systems', 'Workflow Engineering', 'Reliability', 'Backend Architectures', 'Observability', 'Data & Messaging', 'Distributed Coordination']
  },
  {
    id: 'python',
    title: 'Python Code Lab',
    icon: '🐍',
    description: '110 interactive Python concept pages. Predict the output, reveal what actually happens, then see the fix.',
    topics: 12,
    concepts: 110,
    color: '#10b981',
    gradient: 'linear-gradient(135deg, #10b981, #059669)',
    route: '/python-code',
    tags: ['Setup & Execution', 'Loops & Scopes', 'Memory & Data', 'Modern OOP', 'Hidden Traps', 'Async Python', 'FastAPI', 'Databases', 'Pandas', 'AI Agents', 'Deployment', 'Performance']
  },
  {
    id: 'agents',
    title: 'AI Agents',
    icon: '🤖',
    description: '124 in-depth articles on building, deploying, and scaling production AI agents. MCP, A2A, memory systems, LangGraph, CrewAI.',
    topics: 9,
    concepts: 124,
    color: '#ec4899',
    gradient: 'linear-gradient(135deg, #ec4899, #d946ef)',
    route: '/ai-agents',
    tags: ['Foundations', 'Architecture & Patterns', 'Open Protocols', 'Memory & Context', 'Frameworks', 'Production Engineering', 'Security & Governance', 'Future Horizons', 'Projects']
  },
  {
    id: 'infrastructure',
    title: 'AI Infrastructure',
    icon: '⚡',
    description: '150 production-focused AI infrastructure articles. GPU internals, CUDA, distributed training, LLM inference, quantization.',
    topics: 10,
    concepts: 150,
    color: '#ef4444',
    gradient: 'linear-gradient(135deg, #ef4444, #f97316)',
    route: '/ai-infrastructure',
    tags: ['Tensor Computing', 'GPU Memory', 'CUDA & Triton', 'Attention Optimization', 'LLM Inference', 'Quantization', 'Distributed Training', 'AI Networking', 'Serving Infrastructure', 'Observability']
  },
  {
    id: 'quantum',
    title: 'Quantum Computing',
    icon: '⚛️',
    description: 'From qubits to quantum algorithms. Quantum gates, circuits, error correction, and quantum advantage explained simply.',
    topics: 8,
    concepts: 60,
    color: '#8b5cf6',
    gradient: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
    route: '/quantum-computing',
    tags: ['Qubits & Superposition', 'Quantum Gates', 'Quantum Circuits', 'Entanglement', 'Quantum Algorithms', 'Error Correction', 'Quantum Hardware', 'Quantum AI']
  },
  {
    id: 'semiconductors',
    title: 'Semiconductor (Chips Manufacturing)',
    icon: '💠',
    description: 'How chips are designed and manufactured. From silicon wafers to modern AI accelerators, explained for everyone.',
    topics: 5,
    concepts: 8,
    color: '#14b8a6',
    gradient: 'linear-gradient(135deg, #14b8a6, #06b6d4)',
    route: '/semiconductors',
    tags: ['Silicon Fundamentals', 'Transistors', 'Chip Fabrication', 'Yield & Testing', 'Chiplets & Packaging', 'Fab Monitoring', 'Realtime Factory AI', 'Future of Chips']
  }
];

export default function MortalAppsHub() {
  const { t } = useLang();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [hoveredCard, setHoveredCard] = useState(null);

  const filtered = useMemo(() => {
    if (!search) return SECTIONS;
    const q = search.toLowerCase();
    return SECTIONS.filter(s =>
      s.title.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.tags.some(t => t.toLowerCase().includes(q))
    );
  }, [search]);

  const totalConcepts = SECTIONS.reduce((a, s) => a + s.concepts, 0);

  return (
    <div className="mahub-page">
      {/* Hero */}
      <div className="mahub-hero">
        <div className="mahub-orbs">
          <div className="mahub-orb orb-1" />
          <div className="mahub-orb orb-2" />
          <div className="mahub-orb orb-3" />
        </div>
        <div className="mahub-hero-content">
          <div className="mahub-kicker">{t('FREE KNOWLEDGE BASE')}</div>
          <h1 className="mahub-title">
            Learn. Build. Scale.<br />
            <span className="mahub-title-accent">AI Engineering from First Principles</span>
          </h1>
          <p className="mahub-subtitle">
            Complete guides from ML fundamentals to production AI infrastructure.
            Every concept explained with code, real-world examples, and layman analogies.
          </p>
          <div className="mahub-stats">
            <div className="mahub-stat">
              <span className="mahub-stat-num">{totalConcepts.toLocaleString()}</span>
              <span className="mahub-stat-label">{t('Concepts')}</span>
            </div>
            <div className="mahub-stat-divider" />
            <div className="mahub-stat">
              <span className="mahub-stat-num">{SECTIONS.length}</span>
              <span className="mahub-stat-label">{t('Sections')}</span>
            </div>
            <div className="mahub-stat-divider" />
            <div className="mahub-stat">
              <span className="mahub-stat-num">7</span>
              <span className="mahub-stat-label">{t('Lines of Study')}</span>
            </div>
            <div className="mahub-stat-divider" />
            <div className="mahub-stat">
              <span className="mahub-stat-num">100%</span>
              <span className="mahub-stat-label">{t('Free')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mahub-search-wrap">
        <div className="mahub-search-box">
          <span className="mahub-search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search sections, topics, concepts..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="mahub-search-input"
          />
          {search && (
            <button className="mahub-search-clear" onClick={() => setSearch('')}>✕</button>
          )}
        </div>
      </div>

      {/* Section Cards */}
      <div className="mahub-grid">
        {filtered.map(section => (
          <div
            key={section.id}
            className={`mahub-card ${hoveredCard === section.id ? 'mahub-card-hovered' : ''}`}
            onMouseEnter={() => setHoveredCard(section.id)}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => navigate(section.route)}
          >
            <div className="mahub-card-header">
              <div className="mahub-card-icon-wrap" style={{ background: section.gradient }}>
                <span className="mahub-card-icon">{section.icon}</span>
              </div>
              <div className="mahub-card-meta">
                <h3 className="mahub-card-title">{section.title}</h3>
                <div className="mahub-card-counts">
                  <span>{section.topics} sections</span>
                  <span>·</span>
                  <span>{section.concepts} concepts</span>
                </div>
              </div>
            </div>
            <p className="mahub-card-desc">{section.description}</p>
            <div className="mahub-card-tags">
              {section.tags.map(tag => (
                <span key={tag} className="mahub-tag">{tag}</span>
              ))}
            </div>
            <div className="mahub-card-action">
              <span>Explore →</span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mahub-footer">
        <p>All content is free and open. Learn at your own pace.</p>
        <p className="mahub-footer-sub">Inspired by mortalapps.com · Built with ❤️</p>
      </div>
    </div>
  );
}
