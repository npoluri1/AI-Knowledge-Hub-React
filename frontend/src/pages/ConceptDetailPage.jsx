import React, { useMemo, useCallback, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AI_ML_RESOURCES } from '../data/aiMlResourcesData';
import { useLang } from '../i18n';
import './ConceptDetailPage.css';

function CodeBlock({ title, lang, code }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [code]);
  return (
    <div className="concept-detail-code">
      <div className="code-header">
        <span className="code-title">{title || 'Code Example'}</span>
        <div className="code-actions">
          <span className="code-lang">{lang || 'Python'}</span>
          <button className={`copy-btn ${copied ? 'copied' : ''}`} onClick={handleCopy}>
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>
      <pre><code>{code}</code></pre>
    </div>
  );
}

export default function ConceptDetailPage() {
  const { t } = useLang();
  const { topicId, conceptId } = useParams();

  const topic = useMemo(() =>
    AI_ML_RESOURCES.find(t => t.id === topicId), [topicId]);

  const concept = useMemo(() => {
    if (!topic) return null;
    return topic.concepts.find((c, i) =>
      c.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') === conceptId ||
      i === parseInt(conceptId)
    );
  }, [topic, conceptId]);

  const conceptIndex = useMemo(() => {
    if (!topic || !concept) return -1;
    return topic.concepts.indexOf(concept);
  }, [topic, concept]);

  const prevConcept = useMemo(() =>
    conceptIndex > 0 ? topic.concepts[conceptIndex - 1] : null,
    [topic, conceptIndex]);

  const nextConcept = useMemo(() =>
    topic && conceptIndex < topic.concepts.length - 1 ? topic.concepts[conceptIndex + 1] : null,
    [topic, conceptIndex]);

  if (!topic || !concept) {
    return (
      <div className="concept-detail-page">
        <div className="concept-detail-hero">
          <h1>{t('Concept Not Found')}</h1>
          <Link to="/ai-ml-resources" className="back-link">{t('Back to AI/ML Resources')}</Link>
        </div>
      </div>
    );
  }

  const slug = (title) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  // Estimate read time
  const wordCount = (concept.description || '').length +
    (concept.tldr || '').length +
    (concept.howItWorks || '').length;
  const readMin = Math.max(3, Math.ceil(wordCount / 200));

  return (
    <div className="concept-detail-page">
      {/* Hero */}
      <div className="concept-detail-hero">
        <div className="breadcrumb">
          <Link to="/ai-ml-resources">{t('AI/ML Resources')}</Link>
          <span className="sep">/</span>
          <Link to="/ai-ml-resources">{topic.icon} {topic.title}</Link>
          <span className="sep">/</span>
          <span className="current">{concept.title}</span>
        </div>
        <h1>{concept.title}</h1>
        <div className="meta">
          <span>{concept.keyPoints?.length || 0} key points</span>
          <span>&middot;</span>
          <span>{concept.codeExamples?.length || 0} code examples</span>
          <span>&middot;</span>
          <span>{readMin} min read</span>
        </div>
      </div>

      <div className="concept-detail-body">
        {/* TL;DR */}
        {concept.tldr && (
          <section className="detail-section tldr-section">
            <div className="section-badge">TL;DR</div>
            <p>{concept.tldr}</p>
          </section>
        )}

        {/* Description */}
        <section className="detail-section">
          <p className="description-text">{concept.description}</p>
        </section>

        {/* Why It Matters */}
        {concept.whyItMatters?.length > 0 && (
          <section className="detail-section">
            <h2>Why It Matters</h2>
            <div className="numbered-cards">
              {concept.whyItMatters.map((item, i) => (
                <div key={i} className="numbered-card">
                  <div className="card-number">{item.num || i + 1}</div>
                  <div className="card-content">
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* How It Works */}
        {concept.howItWorks && (
          <section className="detail-section">
            <h2>How It Works</h2>
            <div className="how-it-works-content">
              {concept.howItWorks.split('\n\n').length > 1 ? (
                concept.howItWorks.split('\n\n').map((para, i) => (
                  <p key={i}>{para}</p>
                ))
              ) : (
                concept.howItWorks.split(/(?=[A-Z]{2,}[A-Z ]*:)/).filter(Boolean).map((section, i) => {
                  const colonIdx = section.indexOf(':');
                  const hasHeader = colonIdx > 0 && colonIdx < 60 && section.slice(0, colonIdx) === section.slice(0, colonIdx).toUpperCase();
                  return hasHeader ? (
                    <div key={i} className="how-section" style={{ marginTop: i > 0 ? 20 : 0 }}>
                      <h4 style={{ color: '#ffd24a', fontSize: '0.95rem', marginBottom: 8 }}>{section.slice(0, colonIdx).trim()}</h4>
                      <p>{section.slice(colonIdx + 1).trim()}</p>
                    </div>
                  ) : (
                    <p key={i}>{section.trim()}</p>
                  );
                })
              )}
            </div>
          </section>
        )}

        {/* Key Points */}
        {concept.keyPoints?.length > 0 && (
          <section className="detail-section">
            <h2>Key Concepts</h2>
            <div className="key-points-grid">
              {concept.keyPoints.map((kp, i) => (
                <div key={i} className="key-point-item">
                  <span className="kp-icon">&#9679;</span>
                  <span>{kp}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Code Examples */}
        {concept.codeExamples?.length > 0 && (
          <section className="detail-section">
            <h2>Code Examples</h2>
            <div className="code-examples-list">
              {concept.codeExamples.map((ex, i) => (
                <CodeBlock key={i} title={ex.title} lang={ex.lang} code={ex.code} />
              ))}
            </div>
          </section>
        )}

        {/* Pitfalls */}
        {concept.pitfalls?.length > 0 && (
          <section className="detail-section pitfalls-section">
            <h2>Common Pitfalls</h2>
            <div className="pitfalls-list">
              {concept.pitfalls.map((p, i) => (
                <div key={i} className="pitfall-item">
                  <span className="pitfall-icon">&#9888;</span>
                  <span>{p.text || p}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Key Terms */}
        {concept.keyTerms?.length > 0 && (
          <section className="detail-section">
            <h2>Key Terms</h2>
            <div className="key-terms-list">
              {concept.keyTerms.map((kt, i) => (
                <div key={i} className="key-term-item">
                  <div className="term-name">{kt.term}</div>
                  <div className="term-definition">{kt.definition}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Related Concepts */}
        {concept.relatedConcepts?.length > 0 && (
          <section className="detail-section">
            <h2>Related Concepts</h2>
            <div className="related-list">
              {concept.relatedConcepts.map((rc, i) => {
                const rcName = typeof rc === 'string' ? rc : rc.title || rc.name;
                return (
                  <Link
                    key={i}
                    to={`/ai-ml-resources/${topicId}/${slug(rcName)}`}
                    className="related-item"
                  >
                    {rcName}
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Navigation */}
        <div className="concept-nav">
          {prevConcept ? (
            <Link
              to={`/ai-ml-resources/${topicId}/${slug(prevConcept.title)}`}
              className="nav-prev"
            >
              <span className="nav-label">{t('Previous')}</span>
              <span className="nav-title">&larr; {prevConcept.title}</span>
            </Link>
          ) : <div />}
          {nextConcept ? (
            <Link
              to={`/ai-ml-resources/${topicId}/${slug(nextConcept.title)}`}
              className="nav-next"
            >
              <span className="nav-label">{t('Next')}</span>
              <span className="nav-title">{nextConcept.title} &rarr;</span>
            </Link>
          ) : <div />}
        </div>
      </div>
    </div>
  );
}
