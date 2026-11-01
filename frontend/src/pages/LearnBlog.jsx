import React, { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ShareButtons from '../components/ShareButtons'
import { BLOG_POSTS } from '../data/learnHub'
import { useLang } from '../i18n'
import './LearnHub.css'

export default function LearnBlog() {
  const { t } = useLang()
  const { id } = useParams()
  const [category, setCategory] = useState('All')
  const [query, setQuery] = useState('')

  const categories = useMemo(() => ['All', ...new Set(BLOG_POSTS.map(p => p.category))], [])

  // All hooks must run on every render — compute the list filter before any early return.
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return BLOG_POSTS.filter(p =>
      (category === 'All' || p.category === category) &&
      (!q || `${p.title} ${p.summary} ${p.category}`.toLowerCase().includes(q))
    )
  }, [category, query])

  const post = id ? BLOG_POSTS.find(p => p.id === id) : null

  // ---- Full article view ----
  if (post) {
    return (
      <div className="lh-page">
        <Link to="/learn/blog" className="lh-back">← {t('Back to Blog')}</Link>
        <article className="lh-article" style={{ '--a-color': post.color }}>
          <header className="lh-article-head">
            <div className="lh-kicker">{post.category} · {post.date} · {post.read}</div>
            <h1>{post.title}</h1>
            <p className="lh-article-summary">{post.summary}</p>
            <div style={{ marginTop: 12 }}><ShareButtons title={post.title} /></div>
          </header>
          {post.sections && post.sections.map((s, i) => (
            <section className="lh-article-sec" key={i}>
              <h2><span className="lh-sec-num">{String(i + 1).padStart(2, '0')}</span>{s.h}</h2>
              <p>{s.p}</p>
            </section>
          ))}
          <footer className="lh-article-foot">
            <span>📖 {post.read} read · {post.category}</span>
            <Link to="/learn/blog" className="lh-btn">{t('More articles →')}</Link>
          </footer>
        </article>
      </div>
    )
  }

  return (
    <div className="lh-page">
      <Link to="/learn" className="lh-back">← {t('Back to Learning Hub')}</Link>
      <section className="lh-topic-hero" style={{ '--t-grad': 'linear-gradient(135deg, #b4befe2e, #b4befe08)', '--t-color': '#b4befe' }}>
        <div className="lh-topic-icon">📰</div>
        <div className="lh-topic-text">
          <div className="lh-kicker">MortalApps Blog · {BLOG_POSTS.length} deep dives</div>
          <h1>{t('Blog & Deep Dives')}</h1>
          <p>Long-form engineering articles on AI/ML concepts, interview prep, and building software people actually use.</p>
        </div>
      </section>

      <div className="lh-filter-row">
        {categories.map(c => (
          <button type="button" key={c} className={`lh-chip lh-filter ${category === c ? 'active' : ''}`} onClick={() => setCategory(c)}>{c}</button>
        ))}
      </div>
      <div className="lh-toolbar" style={{ marginBottom: 8 }}>
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search articles…" aria-label="Search blog" />
        {query && <button type="button" className="lh-clear" onClick={() => setQuery('')}>✕ {t('Clear')}</button>}
      </div>
      <div className="lh-result-line">Showing <strong>{filtered.length}</strong> of {BLOG_POSTS.length} articles</div>

      <div className="lh-blog-grid">
        {filtered.map(p => (
          <Link className="lh-blog-card" to={`/learn/blog/${p.id}`} key={p.id} style={{ '--b-color': p.color }}>
            <div className="lh-blog-top" style={{ background: `linear-gradient(120deg, ${p.color}26, transparent)` }}>
              <span className="lh-lib-icon">{p.icon || '📰'}</span>
              <span className="lh-blog-meta">{p.category} · {p.read}</span>
            </div>
            <div className="lh-blog-body">
              <span className="lh-blog-date">{p.date}</span>
              <h3>{p.title}</h3>
              <p>{p.summary}</p>
              <span className="lh-lib-cta">Read article →</span>
            </div>
          </Link>
        ))}
      </div>
      {filtered.length === 0 && <div className="lh-empty">No articles match “{query}”.</div>}
    </div>
  )
}
