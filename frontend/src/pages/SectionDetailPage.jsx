import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './SectionDetailPage.css';
import { enrichMortalAppsCategories } from '../data/mortalappsEducational.js';
import { useLang } from '../i18n';

export default function SectionDetailPage({ data, sectionSlug }) {
  const { t } = useLang();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [expandedConcept, setExpandedConcept] = useState(null);
  const [copiedIdx, setCopiedIdx] = useState(null);

  const categories = useMemo(() => enrichMortalAppsCategories(data?.categories || [], {
    section: data?.title || sectionSlug
  }), [data, sectionSlug]);

  const filteredCategories = useMemo(() => {
    if (!search) return categories;
    const q = search.toLowerCase();
    return categories.map(cat => ({
      ...cat,
      concepts: cat.concepts.filter(c =>
        c.title.toLowerCase().includes(q) ||
        c.tldr.toLowerCase().includes(q)
      )
    })).filter(cat => cat.concepts.length > 0);
  }, [search, categories]);

  const totalConcepts = categories.reduce((a, c) => a + c.concepts.length, 0);

  const copyCode = (code, idx) => {
    navigator.clipboard.writeText(code);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="sdp-page">
      {/* Header */}
      <div className="sdp-header">
        <Link to="/mortalapps-hub" className="sdp-back">← {t('Back to Hub')}</Link>
        <div className="sdp-header-content">
          <span className="sdp-icon">{data.icon}</span>
          <div>
            <h1 className="sdp-title">{data.title}</h1>
            <p className="sdp-desc">{data.description}</p>
            <div className="sdp-stats">
              <span>{categories.length} categories</span>
              <span>·</span>
              <span>{totalConcepts} concepts</span>
            </div>
          </div>
        </div>
        <div className="sdp-search">
          <span>🔍</span>
          <input
            placeholder="Search concepts..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Content */}
      <div className="sdp-content">
        {filteredCategories.map((cat, ci) => (
          <div key={cat.name} className="sdp-category">
            <button
              className="sdp-cat-header"
              onClick={() => setExpandedCategory(expandedCategory === ci ? null : ci)}
            >
              <span className="sdp-cat-icon">{cat.icon}</span>
              <span className="sdp-cat-name">{cat.name}</span>
              <span className="sdp-cat-count">{cat.concepts.length} topics</span>
              <span className={`sdp-cat-arrow ${expandedCategory === ci ? 'open' : ''}`}>▶</span>
            </button>

            {expandedCategory === ci && (
              <div className="sdp-cat-body">
                {cat.concepts.map((concept, cki) => (
                  <div key={concept.slug || cki} className="sdp-concept">
                    <button
                      className="sdp-concept-header"
                      onClick={() => setExpandedConcept(expandedConcept === `${ci}-${cki}` ? null : `${ci}-${cki}`)}
                    >
                      <h3 className="sdp-concept-title">{concept.title}</h3>
                      <span className={`sdp-concept-arrow ${expandedConcept === `${ci}-${cki}` ? 'open' : ''}`}>▶</span>
                    </button>

                    {expandedConcept === `${ci}-${cki}` && (
                      <div className="sdp-concept-body">
                        {/* TLDR */}
                        <div className="sdp-tldr">
                          <strong>TL;DR</strong>
                          <p>{concept.tldr}</p>
                        </div>

                        {/* Why It Matters */}
                        {concept.whyItMatters && (
                          <div className="sdp-section">
                            <h4>Why It Matters</h4>
                            {concept.whyItMatters.map(item => (
                              <div key={item.num} className="sdp-why-item">
                                <span className="sdp-why-num">{item.num}</span>
                                <div>
                                  <strong>{item.title}</strong>
                                  <p>{item.text}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* How It Works */}
                        {concept.howItWorks && (
                          <div className="sdp-section">
                            <h4>How It Works</h4>
                            <p>{concept.howItWorks}</p>
                          </div>
                        )}

                        {/* Pitfalls */}
                        {concept.pitfalls && (
                          <div className="sdp-section">
                            <h4>⚠️ Common Pitfalls</h4>
                            <ul className="sdp-pitfalls">
                              {concept.pitfalls.map((p, i) => (
                                <li key={i}>{p.text}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Plain-language explanation and practical use */}
                        {concept.plainEnglish && (
                          <div className="sdp-section sdp-plain-english">
                            <h4>💡 Easy Explanation</h4>
                            <p>{concept.plainEnglish}</p>
                          </div>
                        )}

                        {concept.useCases?.length > 0 && (
                          <div className="sdp-section">
                            <h4>🧩 Practical Use Cases</h4>
                            <ul className="sdp-use-case-list">
                              {concept.useCases.map((item, i) => <li key={i}>{item}</li>)}
                            </ul>
                          </div>
                        )}

                        {concept.realtimeUseCases?.length > 0 && (
                          <div className="sdp-section">
                            <h4>⚡ Real-time Use Cases</h4>
                            <ul className="sdp-use-case-list sdp-realtime-list">
                              {concept.realtimeUseCases.map((item, i) => <li key={i}>{item}</li>)}
                            </ul>
                          </div>
                        )}

                        {concept.projectIdeas?.length > 0 && (
                          <div className="sdp-section">
                            <h4>🛠️ Project Ideas</h4>
                            <div className="sdp-project-list">
                              {concept.projectIdeas.map((item, i) => <div key={i}>{item}</div>)}
                            </div>
                          </div>
                        )}

                        {concept.projectCode && (
                          <div className="sdp-section">
                            <h4>🚀 Real-time Project Starter</h4>
                            <div className="sdp-code-block">
                              <div className="sdp-code-header"><span>{concept.projectCode.language} · {concept.projectCode.title}</span></div>
                              <pre><code>{concept.projectCode.code}</code></pre>
                            </div>
                          </div>
                        )}

                        {/* Key Terms */}
                        {concept.keyTerms && (
                          <div className="sdp-section">
                            <h4>Key Terms</h4>
                            <div className="sdp-terms">
                              {concept.keyTerms.map(term => (
                                <div key={term.term} className="sdp-term">
                                  <strong>{term.term}</strong>
                                  <span>{term.definition}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Code Example */}
                        {concept.codeExample && (
                          <div className="sdp-section">
                            <h4>💻 Code Example</h4>
                            <div className="sdp-code-block">
                              <div className="sdp-code-header">
                                <span>Python</span>
                                <button onClick={() => copyCode(concept.codeExample, `${ci}-${cki}`)}>
                                  {copiedIdx === `${ci}-${cki}` ? `✓ ${t('Copied')}` : `📋 ${t('Copy')}`}
                                </button>
                              </div>
                              <pre><code>{concept.codeExample}</code></pre>
                            </div>
                          </div>
                        )}

                        {/* Related */}
                        {concept.relatedConcepts && (
                          <div className="sdp-section">
                            <h4>Related Concepts</h4>
                            <div className="sdp-related">
                              {concept.relatedConcepts.map(r => (
                                <span key={r} className="sdp-related-tag">{r}</span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
