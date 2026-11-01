import React, { useState, useEffect, useMemo, Suspense, lazy } from 'react';
import { SECTIONS, loadSection, searchArticles } from '../data/mortalapps/index.js';
import ML_FUNDAMENTALS from '../data/mlFundamentalsRich.js';
import './MortalAppsFullPage.css';
import { enrichMortalAppsTopic } from '../data/mortalappsEducational.js';
import { useLang } from '../i18n';

/* ═══════════════════════════════════════════════════════════════
   ML FUNDAMENTALS — Rich Educational Article Detail
   ═══════════════════════════════════════════════════════════════ */
function MlFundamentalsDetail({ article, onBack }) {
  const { t } = useLang();
  const [copiedIdx, setCopiedIdx] = useState(null);
  const enriched = enrichMortalAppsTopic(article, { section: article.category });

  const copyCode = (code, idx) => {
    navigator.clipboard.writeText(code);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="mlf-detail">
      {/* Back */}
      <button className="mlf-back" onClick={onBack}>← {t('Back to ML Fundamentals')}</button>

      {/* Hero Header */}
      <div className="mlf-hero" style={{ '--accent': article.color || '#6366f1' }}>
        <div className="mlf-hero-icon">{article.icon}</div>
        <h1 className="mlf-title">{article.title}</h1>
        <div className="mlf-meta">
          <span className="mlf-meta-badge">{article.category}</span>
          <span className="mlf-meta-time">📖 {article.readTime}</span>
        </div>
      </div>

      {/* TL;DR */}
      <div className="mlf-tldr">
        <div className="mlf-tldr-label">📝 TL;DR</div>
        <p>{article.tldr}</p>
      </div>

      {/* Why It Matters */}
      <div className="mlf-section">
        <h2 className="mlf-section-title">🎯 Why It Matters</h2>
        <div className="mlf-why-grid">
          {article.whyItMatters.map((item, i) => (
            <div key={i} className="mlf-why-card">
              <div className="mlf-why-number">{String(i + 1).padStart(2, '0')}</div>
              <div className="mlf-why-icon">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Layman Example */}
      {article.laymanExample && (
        <div className="mlf-section">
          <h2 className="mlf-section-title">💡 Plain English Explanation</h2>
          <div className="mlf-analogy">
            <div className="mlf-analogy-title">{article.laymanExample.title}</div>
            <div className="mlf-analogy-content">
              {article.laymanExample.content.split('\n\n').map((para, i) => (
                <p key={i} dangerouslySetInnerHTML={{
                  __html: para.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                               .replace(/→/g, '<span class="mlf-arrow">→</span>')
                }} />
              ))}
            </div>
            {article.laymanExample.realWorld && (
              <div className="mlf-analogy-realworld">
                <span className="mlf-analogy-rw-label">🌍 Real-World:</span> {article.laymanExample.realWorld}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Diagrams */}
      {article.diagrams && article.diagrams.length > 0 && (
        <div className="mlf-section">
          <h2 className="mlf-section-title">📊 Visual Diagrams</h2>
          {article.diagrams.map((diag, i) => (
            <div key={i} className="mlf-diagram">
              <div className="mlf-diagram-title">{diag.title}</div>
              <pre className="mlf-diagram-ascii">{diag.ascii}</pre>
              <div className="mlf-diagram-explain">{diag.explanation}</div>
            </div>
          ))}
        </div>
      )}

      {/* How It Works */}
      <div className="mlf-section">
        <h2 className="mlf-section-title">⚙️ How It Works</h2>
        {article.howItWorks.map((section, i) => (
          <div key={i} className="mlf-how-block">
            <div className="mlf-how-step">{i + 1}</div>
            <div className="mlf-how-content">
              <h3>{section.title}</h3>
              <p>{section.content}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Code Examples */}
      {article.codeExamples && article.codeExamples.length > 0 && (
        <div className="mlf-section">
          <h2 className="mlf-section-title">💻 Code Examples</h2>
          {article.codeExamples.map((ex, i) => (
            <div key={i} className="mlf-code-block">
              <div className="mlf-code-header">
                <span className="mlf-code-lang">{ex.language}</span>
                <span className="mlf-code-title">{ex.title}</span>
                <button className="mlf-code-copy" onClick={() => copyCode(ex.code, i)}>
                  {copiedIdx === i ? `✅ ${t('Copied!')}` : `📋 ${t('Copy')}`}
                </button>
              </div>
              <pre className="mlf-code-pre"><code>{ex.code}</code></pre>
            </div>
          ))}
        </div>
      )}

      {/* Practical learning layer */}
      <div className="mlf-section mlf-plain-english">
        <h2 className="mlf-section-title">🧠 Easy Explanation</h2>
        <p>{enriched.plainEnglish}</p>
      </div>
      <div className="mlf-section">
        <h2 className="mlf-section-title">🧩 Practical Use Cases</h2>
        <div className="mlf-learning-list">{enriched.useCases.map((item, i) => <div key={i}>{item}</div>)}</div>
      </div>
      <div className="mlf-section">
        <h2 className="mlf-section-title">⚡ Real-time Use Cases</h2>
        <div className="mlf-learning-list mlf-realtime-list">{enriched.realtimeUseCases.map((item, i) => <div key={i}>{item}</div>)}</div>
      </div>
      <div className="mlf-section">
        <h2 className="mlf-section-title">🛠️ Projects to Build</h2>
        <div className="mlf-learning-list mlf-project-list">{enriched.projectIdeas.map((item, i) => <div key={i}>{item}</div>)}</div>
      </div>
      <div className="mlf-section">
        <h2 className="mlf-section-title">🚀 Real-time Project Starter</h2>
        <div className="mlf-code-block">
          <div className="mlf-code-header"><span className="mlf-code-lang">{enriched.projectCode.language}</span><span className="mlf-code-title">{enriched.projectCode.title}</span></div>
          <pre className="mlf-code-pre"><code>{enriched.projectCode.code}</code></pre>
        </div>
      </div>

      {/* Common Pitfalls */}
      <div className="mlf-section">
        <h2 className="mlf-section-title">⚠️ Common Pitfalls</h2>
        <div className="mlf-pitfalls">
          {article.pitfalls.map((p, i) => (
            <div key={i} className="mlf-pitfall">
              <span className="mlf-pitfall-icon">⚠️</span>
              <p>{p}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Key Terms */}
      <div className="mlf-section">
        <h2 className="mlf-section-title">📖 Key Terms</h2>
        <div className="mlf-terms-grid">
          {article.keyTerms.map((term, i) => (
            <div key={i} className="mlf-term">
              <div className="mlf-term-name">{term.term}</div>
              <div className="mlf-term-def">{term.definition}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Related Concepts */}
      {article.relatedConcepts && article.relatedConcepts.length > 0 && (
        <div className="mlf-section">
          <h2 className="mlf-section-title">🔗 Related Concepts</h2>
          <div className="mlf-related">
            {article.relatedConcepts.map((r, i) => (
              <span key={i} className="mlf-related-tag">{r}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Search Bar
   ═══════════════════════════════════════════════════════════════ */
function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (query.length < 2) { setResults([]); return; }
    const timer = setTimeout(async () => {
      // Search ML Fundamentals first
      const mlResults = ML_FUNDAMENTALS.filter(a =>
        a.title.toLowerCase().includes(query.toLowerCase()) ||
        a.tldr.toLowerCase().includes(query.toLowerCase())
      ).map(a => ({ ...a, source: 'ml' }));

      // Then search scraped data
      const scrapedResults = await searchArticles(query);
      const mappedScraped = scrapedResults.slice(0, 10).map(a => ({ ...a, source: 'scraped' }));

      setResults([...mlResults, ...mappedScraped].slice(0, 15));
      setShowResults(true);
    }, 200);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="mfull-search">
      <div className="mfull-search-input-wrap">
        <span className="mfull-search-icon">🔍</span>
        <input
          className="mfull-search-input"
          placeholder="Search ML Fundamentals, Deep Learning, NLP, Agents..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setShowResults(true)}
          onBlur={() => setTimeout(() => setShowResults(false), 200)}
        />
      </div>
      {showResults && results.length > 0 && (
        <div className="mfull-search-results">
          {results.map((r, i) => (
            <div key={i} className="mfull-search-result"
              onMouseDown={() => { onSearch(r); setShowResults(false); setQuery(''); }}>
              <div className="mfull-search-result-title">
                {r.source === 'ml' && <span className="mlf-search-badge">📚 Rich</span>}
                {r.title}
              </div>
              <div className="mfull-search-result-sub">
                {r.source === 'ml' ? 'ML Fundamentals — Rich Content' : r.subcategory || ''}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Sidebar
   ═══════════════════════════════════════════════════════════════ */
function Sidebar({ sections, scrapedCount, activeSection, onSelect, expanded, onToggle, onSelectArticle, activeArticle, onSelectMlArticle, activeMlArticle }) {
  const [filter, setFilter] = useState('');

  const filtered = useMemo(() => {
    if (!filter) return sections;
    const q = filter.toLowerCase();
    return sections.map(sec => ({
      ...sec,
      subcategories: sec.subcategories.filter(sub => sub.name.toLowerCase().includes(q))
    })).filter(sec => sec.subcategories.length > 0);
  }, [sections, filter]);

  return (
    <div className="mfull-sidebar">
      <div className="mfull-sidebar-header">
        <span className="mfull-sidebar-title">📖 Topics</span>
        <span className="mfull-sidebar-count">{ML_FUNDAMENTALS.length} rich + {scrapedCount} topics</span>
      </div>
      <input
        className="mfull-sidebar-filter"
        placeholder="Filter topics..."
        value={filter}
        onChange={e => setFilter(e.target.value)}
      />
      <div className="mfull-sidebar-nav">
        {/* ML Fundamentals — Rich Content */}
        <div className="mfull-nav-section">
          <div
            className={`mfull-nav-section-header ${activeSection === 'ml-fundamentals' ? 'active' : ''}`}
            onClick={() => { onToggle('ml-fundamentals'); onSelect('ml-fundamentals'); }}
          >
            <span>📚 ML Fundamentals</span>
            <span className="mfull-nav-count" style={{background:'rgba(245,158,11,0.15)', color:'#f59e0b'}}>{ML_FUNDAMENTALS.length} rich</span>
            <span className={`mfull-nav-arrow ${expanded['ml-fundamentals'] ? 'expanded' : ''}`}>▸</span>
          </div>
          {expanded['ml-fundamentals'] && (
            <div className="mfull-nav-subcategories">
              {ML_FUNDAMENTALS.map(art => (
                <div
                  key={art.id}
                  className={`mfull-nav-sub ${activeMlArticle === art.id ? 'active-article' : ''}`}
                  onClick={() => onSelectMlArticle(art)}
                >
                  <div className="mfull-nav-sub-header">
                    <span className="mfull-nav-sub-name">{art.icon} {art.title}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Scraped sections */}
        {filtered.map(sec => (
          <div key={sec.key} className="mfull-nav-section">
            <div
              className={`mfull-nav-section-header ${activeSection === sec.key ? 'active' : ''}`}
              onClick={() => { onToggle(sec.key); onSelect(sec.key); }}
            >
              <span>{sec.emoji} {sec.name}</span>
              <span className="mfull-nav-count">{sec.articleCount}</span>
              <span className={`mfull-nav-arrow ${expanded[sec.key] ? 'expanded' : ''}`}>▸</span>
            </div>
            {expanded[sec.key] && (
              <div className="mfull-nav-subcategories">
                {sec.subcategories.map(sub => (
                  <div key={sub.key} className="mfull-nav-sub">
                    <div className="mfull-nav-sub-header">
                      <span className="mfull-nav-sub-name">{sub.name}</span>
                      <span className="mfull-nav-sub-count">{sub.count}</span>
                    </div>
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

/* ═══════════════════════════════════════════════════════════════
   ML Fundamentals Article List
   ═══════════════════════════════════════════════════════════════ */
function MlFundamentalsList({ onSelect }) {
  return (
    <div className="mlf-list">
      <div className="mlf-list-header">
        <h2>📚 ML Fundamentals — Rich Educational Content</h2>
        <p>{ML_FUNDAMENTALS.length} topics with diagrams, layman examples, code, and mortalapps.com content</p>
      </div>
      <div className="mlf-grid">
        {ML_FUNDAMENTALS.map(article => (
          <div key={article.id} className="mlf-card" onClick={() => onSelect(article)} style={{'--card-accent': article.color}}>
            <div className="mlf-card-icon">{article.icon}</div>
            <h3 className="mlf-card-title">{article.title}</h3>
            <p className="mlf-card-desc">{article.tldr.substring(0, 150)}...</p>
            <div className="mlf-card-badges">
              <span className="mlf-badge-diagrams">📊 {article.diagrams?.length || 0} diagrams</span>
              <span className="mlf-badge-code">💻 {article.codeExamples?.length || 0} code</span>
              <span className="mlf-badge-terms">📖 {article.keyTerms?.length || 0} terms</span>
            </div>
            <div className="mlf-card-time">📖 {article.readTime}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Scraped Article List
   ═══════════════════════════════════════════════════════════════ */
function ArticleList({ articles, onSelect }) {
  if (!articles || articles.length === 0) {
    return <div className="mfull-loading"><div className="mfull-spinner"></div>Loading articles...</div>;
  }
  return (
    <div className="mfull-article-list">
      {articles.map(sub => (
        <div key={sub.subcategory} className="mfull-subcategory-group">
          <h3 className="mfull-subcategory-title">{sub.subcategoryName} ({sub.articles.length})</h3>
          {sub.articles.map(article => (
            <div key={article.id} className="mfull-article-card" onClick={() => onSelect(article)}>
              <div className="mfull-article-header">
                <h4 className="mfull-article-title">{article.title}</h4>
                <span className="mfull-article-time">{article.readTime}</span>
              </div>
              {article.tldr && (
                <p className="mfull-article-desc">{article.tldr.substring(0, 200)}...</p>
              )}
              <div className="mfull-article-meta">
                {article.codeExamples?.length > 0 && (
                  <span className="mfull-article-badge code">💻 Code</span>
                )}
                {article.keyTerms?.length > 0 && (
                  <span className="mfull-article-badge terms">📖 {article.keyTerms.length} terms</span>
                )}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Scraped Article Detail
   ═══════════════════════════════════════════════════════════════ */
function ArticleDetail({ article, onBack }) {
  const { t } = useLang();
  if (!article) return null;
  const enriched = enrichMortalAppsTopic(article, { section: article.subcategory });
  return (
    <div className="mfull-detail">
      <button className="mfull-back-btn" onClick={onBack}>← {t('Back to list')}</button>
      <div className="mfull-detail-header">
        <h1 className="mfull-detail-title">{article.title}</h1>
        <div className="mfull-detail-meta">
          <span>📖 {article.readTime}</span>
          <span>🏷️ {article.subcategory}</span>
        </div>
      </div>
      {article.tldr && (
        <div className="mfull-detail-tldr">
          <h3>📝 TL;DR</h3>
          <p>{article.tldr}</p>
        </div>
      )}
      {article.howItWorks && (
        <div className="mfull-detail-section">
          <h3>⚙️ How It Works</h3>
          <div className="mfull-detail-content">
            {article.howItWorks.split('\n\n').map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </div>
      )}
      <div className="mfull-detail-section mfull-plain-english">
        <h3>💡 Easy Explanation</h3>
        <p>{enriched.plainEnglish}</p>
      </div>
      <div className="mfull-detail-section">
        <h3>🧩 Practical Use Cases</h3>
        <ul className="mfull-use-case-list">{enriched.useCases.map((item, i) => <li key={i}>{item}</li>)}</ul>
      </div>
      <div className="mfull-detail-section">
        <h3>⚡ Real-time Use Cases</h3>
        <ul className="mfull-use-case-list mfull-realtime-list">{enriched.realtimeUseCases.map((item, i) => <li key={i}>{item}</li>)}</ul>
      </div>
      <div className="mfull-detail-section">
        <h3>🛠️ Projects to Build</h3>
        <div className="mfull-project-list">{enriched.projectIdeas.map((item, i) => <div key={i}>{item}</div>)}</div>
      </div>
      <div className="mfull-detail-section">
        <h3>🚀 Real-time Project Starter</h3>
        <pre className="mfull-code-block"><code>{enriched.projectCode.code}</code></pre>
      </div>
      {article.keyTerms?.length > 0 && (
        <div className="mfull-detail-section">
          <h3>📖 Key Terms</h3>
          <div className="mfull-terms-grid">
            {article.keyTerms.map((term, i) => (
              <div key={i} className="mfull-term-card">
                <h4>{term.term}</h4>
                {term.definition && <p>{term.definition}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
      {article.pitfalls?.length > 0 && (
        <div className="mfull-detail-section">
          <h3>⚠️ Common Pitfalls</h3>
          <div className="mfull-pitfalls">              {article.pitfalls.map((p, i) => (
                <div key={i} className="mfull-pitfall-item">{typeof p === 'string' ? p : p.text}</div>
              ))}
          </div>
        </div>
      )}
      {article.codeExamples?.length > 0 && (
        <div className="mfull-detail-section">
          <h3>💻 Code Example</h3>
          {article.codeExamples.map((ex, i) => (
            <pre key={i} className="mfull-code-block"><code>{ex.code}</code></pre>
          ))}
        </div>
      )}
      {article.relatedConcepts?.length > 0 && (
        <div className="mfull-detail-section">
          <h3>🔗 Related Concepts</h3>
          <div className="mfull-related">
            {article.relatedConcepts.map((r, i) => (
              <span key={i} className="mfull-related-tag">{r}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════════ */
export default function MortalAppsFullPage() {
  const [activeSection, setActiveSection] = useState('ml-fundamentals');
  const [expanded, setExpanded] = useState({ 'ml-fundamentals': true });
  const [sectionData, setSectionData] = useState({});
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [selectedMlArticle, setSelectedMlArticle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const scrapedCount = SECTIONS.reduce((total, section) => total + section.articleCount, 0);

  useEffect(() => {
    if (activeSection === 'ml-fundamentals') return;
    async function load() {
      setLoading(true);
      const data = await loadSection(activeSection);
      setSectionData(prev => ({ ...prev, [activeSection]: data }));
      setLoading(false);
    }
    if (!sectionData[activeSection]) load();
  }, [activeSection]);

  const handleToggle = (key) => setExpanded(prev => ({ ...prev, [key]: !prev[key] }));

  const handleSelect = (key) => {
    setActiveSection(key);
    setSelectedArticle(null);
    setSelectedMlArticle(null);
  };

  const handleSelectMlArticle = (art) => {
    setSelectedMlArticle(art);
    setSelectedArticle(null);
  };

  const handleSelectArticle = (article) => {
    setSelectedArticle(article);
    setSelectedMlArticle(null);
  };

  const handleSelectFromSearch = (item) => {
    if (item.source === 'ml') {
      setSelectedMlArticle(item);
      setActiveSection('ml-fundamentals');
      setExpanded(prev => ({ ...prev, 'ml-fundamentals': true }));
    } else {
      setSelectedArticle(item);
      setSelectedMlArticle(null);
    }
  };

  const currentData = sectionData[activeSection] || [];

  return (
    <div className="mfull-page">
      {/* Hero */}
      <div className="mfull-hero">
        <div className="mfull-hero-orb mfull-hero-orb-1"></div>
        <div className="mfull-hero-orb mfull-hero-orb-2"></div>
        <div className="mfull-hero-orb mfull-hero-orb-3"></div>
        <div className="mfull-hero-content">
          <h1 className="mfull-hero-title">
            <span className="mfull-hero-gradient">MortalApps</span> Learning Hub
          </h1>
          <p className="mfull-hero-sub">
            {ML_FUNDAMENTALS.length} rich topics + {scrapedCount} topics · Easy explanations · Use cases · Project code
          </p>
          <SearchBar onSearch={handleSelectFromSearch} />
          <div className="mfull-hero-stats">
            <div className="mfull-hero-stat mlf-hero-stat-rich" onClick={() => handleSelect('ml-fundamentals')}>
              <span className="mfull-hero-stat-emoji">📚</span>
              <span className="mfull-hero-stat-name">ML Fundamentals</span>
              <span className="mfull-hero-stat-count" style={{color:'#f59e0b'}}>{ML_FUNDAMENTALS.length} rich topics</span>
            </div>
            {SECTIONS.map(sec => (
              <div key={sec.key} className="mfull-hero-stat" onClick={() => handleSelect(sec.key)}>
                <span className="mfull-hero-stat-emoji">{sec.emoji}</span>
                <span className="mfull-hero-stat-name">{sec.name}</span>
                <span className="mfull-hero-stat-count">{sec.articleCount} articles</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mfull-main">
        <Sidebar
          sections={SECTIONS}
          scrapedCount={scrapedCount}
          activeSection={activeSection}
          onSelect={handleSelect}
          expanded={expanded}
          onToggle={handleToggle}
          onSelectMlArticle={handleSelectMlArticle}
          activeMlArticle={selectedMlArticle?.id}
        />
        <div className="mfull-content">
          {selectedMlArticle ? (
            <MlFundamentalsDetail article={selectedMlArticle} onBack={() => setSelectedMlArticle(null)} />
          ) : selectedArticle ? (
            <ArticleDetail article={selectedArticle} onBack={() => setSelectedArticle(null)} />
          ) : activeSection === 'ml-fundamentals' ? (
            <MlFundamentalsList onSelect={handleSelectMlArticle} />
          ) : (
            <>
              <div className="mfull-content-header">
                <h2>{SECTIONS.find(s => s.key === activeSection)?.emoji} {' '}
                  {SECTIONS.find(s => s.key === activeSection)?.name}</h2>
                <span className="mfull-content-count">
                  {SECTIONS.find(s => s.key === activeSection)?.articleCount} articles
                </span>
              </div>
              {loading ? (
                <div className="mfull-loading"><div className="mfull-spinner"></div>Loading articles...</div>
              ) : (
                <ArticleList articles={currentData} onSelect={handleSelectArticle} />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
