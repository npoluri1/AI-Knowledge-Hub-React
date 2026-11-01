import React, { useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { AI_ML_RESOURCES } from '../data/aiMlResourcesData';
import { useLang } from '../i18n';
import './AiMlResources.css';

function CodeBlock({ code }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [code]);
  return (
    <div className="concept-code">
      <div className="code-header">
        <span className="lang">Python</span>
        <button className={`copy-btn ${copied ? 'copied' : ''}`} onClick={handleCopy}>
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
      <pre><code>{code}</code></pre>
    </div>
  );
}

function ConceptCard({ concept, topicId }) {
  const slug = concept.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return (
    <Link to={`/ai-ml-resources/${topicId}/${slug}`} className="concept-card" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
      <h3>{concept.title}</h3>
      <p className="description">{concept.description}</p>
      <div className="key-points">
        {(concept.keyPoints || []).map((kp, i) => (
          <span key={i} className="key-point-tag">{kp}</span>
        ))}
      </div>
      {concept.tldr && <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: 8, fontStyle: 'italic' }}>{concept.tldr.substring(0, 120)}...</p>}
      <span className="read-more" style={{ color: '#818cf8', fontSize: '0.85rem', fontWeight: 600, marginTop: 8, display: 'inline-block' }}>Read full guide &rarr;</span>
    </Link>
  );
}

export default function AiMlResourcesPage() {
  const { t } = useLang();
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [expandedTopics, setExpandedTopics] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  const toggleTopic = (topicId) => {
    setExpandedTopics(prev => {
      const next = new Set(prev);
      if (next.has(topicId)) next.delete(topicId);
      else next.add(topicId);
      return next;
    });
    setSelectedTopic(topicId);
    setSearchQuery('');
  };

  const topicData = useMemo(() => {
    if (!selectedTopic) return null;
    return AI_ML_RESOURCES.find(t => t.id === selectedTopic);
  }, [selectedTopic]);

  const filteredConcepts = useMemo(() => {
    if (!topicData) return [];
    if (!searchQuery.trim()) return topicData.concepts;
    const q = searchQuery.toLowerCase();
    return topicData.concepts.filter(c =>
      c.title.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      (c.keyPoints || []).some(kp => kp.toLowerCase().includes(q))
    );
  }, [topicData, searchQuery]);

  const totalConcepts = useMemo(() =>
    AI_ML_RESOURCES.reduce((sum, t) => sum + t.concepts.length, 0), []);

  return (
    <div className="ai-ml-page">
      <div className="ai-ml-hero">
        <h1>{t('AI / ML Resources')}</h1>
        <p className="subtitle">
          Master AI/ML with comprehensive concept guides and runnable code examples
        </p>
        <div className="ai-ml-stats">
          <div className="ai-ml-stat">
            <div className="num">{AI_ML_RESOURCES.length}</div>
            <div className="label">{t('Topics')}</div>
          </div>
          <div className="ai-ml-stat">
            <div className="num">{totalConcepts}</div>
            <div className="label">{t('Concepts')}</div>
          </div>
          <div className="ai-ml-stat">
            <div className="num">{totalConcepts}</div>
            <div className="label">{t('Code Examples')}</div>
          </div>
        </div>
      </div>

      <div className="ai-ml-layout">
        <nav className="ai-ml-sidebar">
          <h3>{t('Topics')}</h3>
          {AI_ML_RESOURCES.map(topic => (
            <div key={topic.id}>
              <div
                className={`sidebar-item ${selectedTopic === topic.id ? 'active' : ''}`}
                onClick={() => toggleTopic(topic.id)}
              >
                <span className="expand-icon" style={{ fontSize: '0.7rem', color: '#64748b', marginRight: 4, transition: 'transform 0.2s', transform: expandedTopics.has(topic.id) ? 'rotate(90deg)' : 'rotate(0deg)' }}>&#9654;</span>
                <span className="icon">{topic.icon}</span>
                <span>{topic.title}</span>
                <span className="count">{topic.concepts.length}</span>
              </div>
              {expandedTopics.has(topic.id) && topic.concepts.length > 0 && (
                <div className="concept-list">
                  {topic.concepts.map((c, i) => {
                    const slug = c.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                    return (
                      <Link
                        key={i}
                        to={`/ai-ml-resources/${topic.id}/${slug}`}
                        className="concept-link"
                        onClick={() => setSelectedTopic(topic.id)}
                      >
                        {c.title}
                      </Link>
                    );
                  })}
                </div>
              )}
              {expandedTopics.has(topic.id) && topic.concepts.length === 0 && (
                <div className="concept-list">
                  <span className="concept-link concept-link-empty">Coming soon...</span>
                </div>
              )}
            </div>
          ))}
        </nav>

        <main className="ai-ml-content">
          {!topicData ? (
            <div className="ai-ml-welcome">
              <div className="icon">🧠</div>
              <h2>Select a topic from the sidebar to get started</h2>
              <p>Each topic includes detailed explanations, key concepts, and runnable Python code examples.</p>
              <div style={{ marginTop: 32, display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
                {AI_ML_RESOURCES.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTopic(t.id)}
                    style={{
                      background: 'rgba(99,102,241,0.1)',
                      border: '1px solid rgba(99,102,241,0.25)',
                      color: '#a5b4fc',
                      padding: '8px 16px',
                      borderRadius: 20,
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      transition: 'all 0.2s'
                    }}
                  >
                    {t.icon} {t.title}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              <h2>{topicData.icon} {topicData.title}</h2>
              <p className="topic-desc">
                {filteredConcepts.length} concepts &middot; Click any card to expand code examples
              </p>
              <input
                className="ai-ml-search"
                type="text"
                placeholder={`Search ${topicData.title} concepts...`}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              {filteredConcepts.length === 0 ? (
                <div className="ai-ml-welcome" style={{ minHeight: 200 }}>
                  <p>No concepts match your search.</p>
                </div>
              ) : (
                filteredConcepts.map((concept, i) => (
                  <ConceptCard key={i} concept={concept} topicId={topicData.id} />
                ))
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
