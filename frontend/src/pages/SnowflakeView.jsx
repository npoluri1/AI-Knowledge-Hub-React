import { Link } from 'react-router-dom'
import {
  sfHeader, sfLegend, sfCoreVideos, sfAiVideos, sfChannels, sfBlogs, sfPlatforms,
  sfCerts, sfCertFacts, sfCoreWeights, sfLearningPath, sfFreePlan, sfVerdict,
} from '../data/snowflakeData'
import {
  sfLearnVideos, sfLearnChannels, sfLearnBlogs, sfLearnPlatforms,
  sfLearnCerts, sfLearnCertWeights, sfLearnPath, sfLearnFreePlan,
} from '../data/snowflakeLearningData'
import FetchButton from '../components/FetchButton'
import './SnowflakeView.css'
import { useLang } from '../i18n'

function Ext({ url, children }) {
  return <a href={url} target="_blank" rel="noopener noreferrer">{children}</a>
}

function Badge({ on, kind }) {
  const { t } = useLang()
  if (!on) return null
  return (
    <span className={`sf-badge sf-badge-${kind}`}>
      {kind === 'best' ? '★' : kind === 'free' ? '✓' : '$'} {kind === 'best' ? t('Best') : kind === 'free' ? t('Free') : t('Paid')}
    </span>
  )
}

function VideoTable({ rows, subtitle }) {
  return (
    <section className="sf-card">
      <h3>{subtitle}</h3>
      <div className="sf-table-wrap">
        <table className="sf-table">
          <thead>
            <tr>
              <th className="sf-col-n">#</th>
              <th className="sf-col-title">Video / Resource</th>
              <th className="sf-col-src">Channel / Source</th>
              <th className="sf-col-views">Views</th>
              <th className="sf-col-notes">Why it's good</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.n}>
                <td className="sf-cell sf-num">{r.n}</td>
                <td className="sf-cell sf-col-title">
                  <Badge on={r.best} kind="best" />
                  <Ext url={r.url}>{r.title}</Ext>
                </td>
                <td className="sf-cell sf-col-src">
                  <Ext url={r.channelUrl}>{r.channel}</Ext>
                </td>
                <td className="sf-cell sf-views">{r.views}</td>
                <td className="sf-cell sf-col-notes">{r.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default function SnowflakeView() {
  const { t } = useLang()
  return (
    <div className="sf-page">
      <Link to="/" className="back-link">← {t('Back to Home')}</Link>

      <div className="sf-hero">
        <div className="sf-title-row">
          <div className="page-header-row">
            <h1>❄️ {sfHeader.title}</h1>
            <FetchButton label="Fetch Latest" staticMode />
          </div>
          <span className="sf-chip sf-chip-snowflake">Snowflake AI Data Cloud</span>
          <span className="sf-chip sf-chip-cortex">Cortex AI</span>
          <span className="sf-chip sf-chip-pro">SnowPro Certifications</span>
        </div>
        <p className="sf-subtitle">{sfHeader.subtitle}</p>
        <div className="sf-legend">
          {sfLegend.map((l, i) => (
            <span key={i} className={`sf-badge sf-badge-${l.cls}`}>
              {l.cls === 'best' ? '★' : l.cls === 'free' ? '✓' : '$'} {l.label}
              <em className="sf-hint">{l.hint}</em>
            </span>
          ))}
        </div>
      </div>

      <div className="sf-grid">
        <VideoTable rows={sfCoreVideos} subtitle="📺 1. Best Core YouTube Videos" />
        <VideoTable rows={sfAiVideos} subtitle="🤖 2. Best AI / Cortex / Snowpark Videos" />
      </div>

      <section className="sf-card">
        <h3>📡 3. Best YouTube Channels</h3>
        <div className="sf-table-wrap">
          <table className="sf-table">
            <thead>
              <tr>
                <th className="sf-col-n">Rank</th>
                <th className="sf-col-title">Channel</th>
                <th className="sf-col-notes">Focus</th>
                <th className="sf-col-notes">Best for</th>
              </tr>
            </thead>
            <tbody>
              {sfChannels.map((r, i) => (
                <tr key={i}>
                  <td className="sf-cell sf-num">{r.rank}</td>
                  <td className="sf-cell sf-col-title">
                    <Badge on={r.best} kind="best" />
                    <Ext url={r.url}>{r.channel}</Ext>
                  </td>
                  <td className="sf-cell sf-col-notes">{r.focus}</td>
                  <td className="sf-cell sf-col-notes">{r.bestFor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="sf-card">
        <h3>📝 4. Best Blogs & Communities</h3>
        <div className="sf-table-wrap">
          <table className="sf-table">
            <thead>
              <tr>
                <th className="sf-col-n">Rank</th>
                <th className="sf-col-title">Blog / Resource</th>
                <th className="sf-col-notes">Best for</th>
              </tr>
            </thead>
            <tbody>
              {sfBlogs.map((r, i) => (
                <tr key={i}>
                  <td className="sf-cell sf-num">{r.rank}</td>
                  <td className="sf-cell sf-col-title">
                    <Badge on={r.best} kind="best" />
                    <Ext url={r.url}>{r.blog}</Ext>
                  </td>
                  <td className="sf-cell sf-col-notes">{r.bestFor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="sf-card">
        <h3>🛠️ 5. Hands-On / Realtime Platforms</h3>
        <div className="sf-table-wrap">
          <table className="sf-table">
            <thead>
              <tr>
                <th className="sf-col-n">Rank</th>
                <th className="sf-col-title">Platform</th>
                <th className="sf-col-cost">Cost</th>
                <th className="sf-col-notes">Value</th>
              </tr>
            </thead>
            <tbody>
              {sfPlatforms.map((r, i) => (
                <tr key={i}>
                  <td className="sf-cell sf-num">{r.rank}</td>
                  <td className="sf-cell sf-col-title">
                    <Badge on={r.best} kind="best" />
                    <Ext url={r.url}>{r.platform}</Ext>
                  </td>
                  <td className="sf-cell sf-col-cost">
                    <Badge on={r.cost === 'free'} kind="free" />
                    <Badge on={r.cost === 'paid'} kind="paid" />
                    <span className={`sf-cost-label sf-cost-${r.cost}`}>{r.costLabel}</span>
                  </td>
                  <td className="sf-cell sf-col-notes">{r.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="sf-card">
        <h3>🎓 6. Certifications (Official, all with URLs)</h3>
        <div className="sf-table-wrap">
          <table className="sf-table sf-cert-table">
            <thead>
              <tr>
                <th className="sf-col-tier">Tier</th>
                <th className="sf-col-title">Certification</th>
                <th className="sf-col-code">Code</th>
                <th className="sf-col-cost">Cost</th>
                <th className="sf-col-meta">Q / Mins</th>
                <th className="sf-col-notes">Prereq</th>
              </tr>
            </thead>
            <tbody>
              {sfCerts.map((r, i) => (
                <tr key={i} className={r.best ? 'sf-row-best' : ''}>
                  <td className="sf-cell sf-col-tier">
                    <span className={`sf-tier sf-tier-${r.tier.toLowerCase()}`}>{r.tier}</span>
                  </td>
                  <td className="sf-cell sf-col-title">
                    <Badge on={r.best} kind="best" />
                    <Ext url={r.url}>{r.cert}</Ext>
                    {r.bestLabel && <span className="sf-best-label">{r.bestLabel}</span>}
                  </td>
                  <td className="sf-cell sf-col-code"><code>{r.code}</code></td>
                  <td className="sf-cell sf-cost">{r.cost}</td>
                  <td className="sf-cell sf-views">{r.meta}</td>
                  <td className="sf-cell sf-col-notes">{r.prereq}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="sf-fact">{sfCertFacts}</p>
      </section>

      <section className="sf-card">
        <h3>⚖️ 7. SnowPro Core COF-C03 Exam — Domain Weights</h3>
        <div className="sf-weights">
          {sfCoreWeights.map(([name, pct], i) => {
            const p = parseInt(pct, 10)
            return (
              <div key={i} className="sf-weight-row">
                <span className="sf-weight-name">{name}</span>
                <div className="sf-weight-bar">
                  <div className={`sf-weight-fill sf-weight-${i}`} style={{ width: `${p}%` }} />
                </div>
                <span className="sf-weight-pct">{pct}</span>
              </div>
            )
          })}
        </div>
      </section>

      <div className="sf-grid sf-grid-2">
        <section className="sf-card">
          <h3>🗺️ 8. Recommended Learning Path</h3>
          <ol className="sf-steps">
            {sfLearningPath.map((s, i) => (
              <li key={i} className={`sf-step ${s.best ? 'sf-step-best' : ''}`}>
                <span className="sf-step-time">{s.time}</span>
                <span className="sf-step-action">{s.action}</span>
                <Ext url={s.res}><span className="sf-step-res">{s.resLabel}</span></Ext>
              </li>
            ))}
          </ol>
        </section>

        <section className="sf-card">
          <h3>💸 9. 100% FREE Plan</h3>
          <ol className="sf-steps">
            {sfFreePlan.map((s, i) => (
              <li key={i} className={`sf-step ${s.best ? 'sf-step-best' : ''} ${s.paid ? 'sf-step-paid' : ''}`}>
                <span className="sf-step-action">
                  <Badge on={s.paid} kind="paid" />
                  {s.action}
                </span>
                <Ext url={s.res}><span className="sf-step-res">{s.resLabel}</span></Ext>
              </li>
            ))}
          </ol>
        </section>
      </div>

      <section className="sf-card sf-verdict">
        <h3>🧭 10. Verdict</h3>
        <p>{sfVerdict}</p>
      </section>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/*   LEARNING RESOURCES (from Snowflake_Learning_Guide.html)      */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <section className="sf-card">
        <h3>🎬 11. Best YouTube Videos — Snowflake Core</h3>
        <div className="sf-table-wrap">
          <table className="sf-table">
            <thead>
              <tr>
                <th className="sf-col-n">#</th>
                <th className="sf-col-title">Video</th>
                <th className="sf-col-src">Channel</th>
                <th className="sf-col-views">Views</th>
                <th className="sf-col-notes">Why it's good</th>
              </tr>
            </thead>
            <tbody>
              {sfLearnVideos.filter(v => v.category === 'core').map(r => (
                <tr key={r.rank}>
                  <td className="sf-cell sf-num">{r.rank}</td>
                  <td className="sf-cell sf-col-title">
                    <Badge on={r.rank <= 3} kind="best" />
                    <Ext url={r.url}>{r.title}</Ext>
                  </td>
                  <td className="sf-cell sf-col-src">{r.channel}</td>
                  <td className="sf-cell sf-views">{r.views}</td>
                  <td className="sf-cell sf-col-notes">{r.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="sf-card">
        <h3>🤖 12. Best YouTube Videos — Snowflake AI / Cortex</h3>
        <div className="sf-table-wrap">
          <table className="sf-table">
            <thead>
              <tr>
                <th className="sf-col-n">#</th>
                <th className="sf-col-title">Video</th>
                <th className="sf-col-src">Channel</th>
                <th className="sf-col-views">Views</th>
                <th className="sf-col-notes">Why it's good</th>
              </tr>
            </thead>
            <tbody>
              {sfLearnVideos.filter(v => v.category === 'ai').map(r => (
                <tr key={r.rank}>
                  <td className="sf-cell sf-num">{r.rank}</td>
                  <td className="sf-cell sf-col-title">
                    <Badge on={r.rank <= 3} kind="best" />
                    <Ext url={r.url}>{r.title}</Ext>
                  </td>
                  <td className="sf-cell sf-col-src">{r.channel}</td>
                  <td className="sf-cell sf-views">{r.views}</td>
                  <td className="sf-cell sf-col-notes">{r.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="sf-card">
        <h3>📡 13. Best YouTube Channels</h3>
        <div className="sf-table-wrap">
          <table className="sf-table">
            <thead>
              <tr>
                <th className="sf-col-n">#</th>
                <th className="sf-col-title">Channel</th>
                <th className="sf-col-notes">Focus</th>
                <th className="sf-col-notes">Best for</th>
              </tr>
            </thead>
            <tbody>
              {sfLearnChannels.map(r => (
                <tr key={r.rank}>
                  <td className="sf-cell sf-num">{r.rank}</td>
                  <td className="sf-cell sf-col-title">
                    <Badge on={r.rank <= 3} kind="best" />
                    <Ext url={r.url}>{r.channel}</Ext>
                  </td>
                  <td className="sf-cell sf-col-notes">{r.focus}</td>
                  <td className="sf-cell sf-col-notes">{r.bestFor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="sf-card">
        <h3>📝 14. Best Blogs & Articles</h3>
        <div className="sf-table-wrap">
          <table className="sf-table">
            <thead>
              <tr>
                <th className="sf-col-n">#</th>
                <th className="sf-col-title">Blog / Resource</th>
                <th className="sf-col-notes">Best for</th>
              </tr>
            </thead>
            <tbody>
              {sfLearnBlogs.map(r => (
                <tr key={r.rank}>
                  <td className="sf-cell sf-num">{r.rank}</td>
                  <td className="sf-cell sf-col-title">
                    <Badge on={r.rank <= 3} kind="best" />
                    <Ext url={r.url}>{r.blog}</Ext>
                  </td>
                  <td className="sf-cell sf-col-notes">{r.bestFor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="sf-card">
        <h3>🛠️ 15. Hands-On Learning Platforms</h3>
        <div className="sf-table-wrap">
          <table className="sf-table">
            <thead>
              <tr>
                <th className="sf-col-n">#</th>
                <th className="sf-col-title">Platform</th>
                <th className="sf-col-cost">Cost</th>
                <th className="sf-col-notes">Value</th>
              </tr>
            </thead>
            <tbody>
              {sfLearnPlatforms.map(r => (
                <tr key={r.rank}>
                  <td className="sf-cell sf-num">{r.rank}</td>
                  <td className="sf-cell sf-col-title">
                    <Badge on={r.rank <= 3} kind="best" />
                    <Ext url={r.url}>{r.platform}</Ext>
                  </td>
                  <td className="sf-cell sf-col-cost">
                    <Badge on={r.cost === 'FREE'} kind="free" />
                    <Badge on={r.cost !== 'FREE'} kind="paid" />
                    <span className={`sf-cost-label ${r.cost === 'FREE' ? 'sf-cost-free' : 'sf-cost-paid'}`}>{r.cost}</span>
                  </td>
                  <td className="sf-cell sf-col-notes">{r.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="sf-card">
        <h3>🎓 16. SnowPro Certifications 2026 (Full Catalog)</h3>
        <div className="sf-table-wrap">
          <table className="sf-table">
            <thead>
              <tr>
                <th className="sf-col-tier">Tier</th>
                <th className="sf-col-title">Certification</th>
                <th className="sf-col-code">Code</th>
                <th className="sf-col-cost">Cost</th>
                <th className="sf-col-meta">Q / Time</th>
                <th className="sf-col-notes">Prereq</th>
              </tr>
            </thead>
            <tbody>
              {sfLearnCerts.map(r => (
                <tr key={r.code}>
                  <td className="sf-cell">
                    <span className={`sf-tier sf-tier-${r.tier.toLowerCase()}`}>{r.tier}</span>
                  </td>
                  <td className="sf-cell sf-col-title">
                    <Badge on={r.tier === 'Core'} kind="best" />
                    <Ext url={r.url}>{r.cert}</Ext>
                  </td>
                  <td className="sf-cell sf-col-code"><code>{r.code}</code></td>
                  <td className="sf-cell sf-cost">{r.cost}</td>
                  <td className="sf-cell sf-views">{r.questions}Q / {r.time}</td>
                  <td className="sf-cell sf-col-notes">{r.prereq}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="sf-card">
        <h3>⚖️ 17. SnowPro Core Exam — Domain Weights</h3>
        <div className="sf-weights">
          {sfLearnCertWeights.map((item, i) => {
            const name = item.domain || item[0] || ''
            const pct = item.weight || item[1] || ''
            const p = parseInt(pct, 10)
            return (
              <div key={i} className="sf-weight-row">
                <span className="sf-weight-name">{name}</span>
                <div className="sf-weight-bar">
                  <div className={`sf-weight-fill sf-weight-${i}`} style={{ width: `${p}%` }} />
                </div>
                <span className="sf-weight-pct">{pct}</span>
              </div>
            )
          })}
        </div>
      </section>

      <div className="sf-grid sf-grid-2">
        <section className="sf-card">
          <h3>🗺️ 18. Recommended Learning Path</h3>
          <ol className="sf-steps">
            {sfLearnPath.map((s, i) => (
              <li key={i} className="sf-step">
                <span className="sf-step-time">{s.time}</span>
                <span className="sf-step-action">{s.action}</span>
                <Ext url={s.res}><span className="sf-step-res">{s.resLabel}</span></Ext>
              </li>
            ))}
          </ol>
        </section>

        <section className="sf-card">
          <h3>💸 19. 100% FREE Learning Plan</h3>
          <ol className="sf-steps">
            {sfLearnFreePlan.map((s, i) => (
              <li key={i} className={`sf-step ${s.paid ? 'sf-step-paid' : ''}`}>
                <span className="sf-step-action">
                  <Badge on={s.paid} kind="paid" />
                  {s.action}
                </span>
                <Ext url={s.res}><span className="sf-step-res">{s.resLabel}</span></Ext>
              </li>
            ))}
          </ol>
        </section>
      </div>

      <div className="sf-footer">
        — Snowflake &amp; Snowflake AI — Complete Learning Guide 2026 · source: Snowflake_Learning_Guide.html —
      </div>
    </div>
  )
}
