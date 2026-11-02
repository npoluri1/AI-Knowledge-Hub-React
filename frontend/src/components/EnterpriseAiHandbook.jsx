import React, { useState } from 'react'
import {
  HANDBOOK_TABS, CERT_PATHS, CLAUDE_CODE, CLAUDE_APPS, CLAUDE_GOV, OPENAI_GOV, OPENAI_STACK,
  CODEX_SNIPPETS, COMPARE, REALTIME, REGULATIONS, ENTERPRISE_CHECKLIST,
} from '../data/enterpriseAiData'
import './EnterpriseAiHandbook.css'

const lsGet = (k, d) => { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v) } catch { return d } }
const lsSet = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)) } catch { /* storage unavailable */ } }

function Code({ src }) {
  const [ok, setOk] = useState(false)
  return (
    <div className="eh-code">
      <button type="button" onClick={async () => { try { await navigator.clipboard.writeText(src); setOk(true); setTimeout(() => setOk(false), 1300) } catch { /* blocked */ } }}>{ok ? '✓' : '⧉'}</button>
      <pre><code>{src}</code></pre>
    </div>
  )
}

function Checklist({ id, items }) {
  const [done, setDone] = useState(() => new Set(lsGet(`eh.ck.${id}`, [])))
  const flip = i => setDone(prev => { const n = new Set(prev); if (n.has(i)) n.delete(i); else n.add(i); lsSet(`eh.ck.${id}`, [...n]); return n })
  return (
    <ul className="eh-check">
      {items.map((it, i) => (
        <li key={it} className={done.has(i) ? 'on' : ''}>
          <button type="button" onClick={() => flip(i)} aria-pressed={done.has(i)}>{done.has(i) ? '✓' : ''}</button>
          <span>{it}</span>
        </li>
      ))}
    </ul>
  )
}

function ProductCards({ list, accent }) {
  return (
    <div className="eh-grid">
      {list.map(p => (
        <article key={p.name} className="eh-card" style={{ '--a': accent }}>
          <h3><span>{p.icon}</span>{p.name}</h3>
          <p>{p.what}</p>
          <h4>Notes for implementation</h4>
          <ul>{p.notes.map(n => <li key={n}>{n}</li>)}</ul>
          <div className="eh-use">🎯 {p.use}</div>
        </article>
      ))}
    </div>
  )
}

function Governance({ list, prefix, accent }) {
  return (
    <div className="eh-grid">
      {list.map(g => (
        <article key={g.area} className="eh-card" style={{ '--a': accent }}>
          <h3>{g.area}</h3>
          <Checklist id={`${prefix}.${g.area}`} items={g.points} />
        </article>
      ))}
    </div>
  )
}

export default function EnterpriseAiHandbook() {
  const [tab, setTab] = useState(() => lsGet('eh.tab', 'certs'))
  const pick = id => { setTab(id); lsSet('eh.tab', id); document.getElementById('eh-top')?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }

  return (
    <section className="eh" id="eh-top">
      <header className="eh-head">
        <div>
          <span className="eh-kicker">Enterprise AI Builder’s Handbook</span>
          <h2>Claude & OpenAI — certify, build, govern</h2>
          <p>Everything to note when implementing real applications with Claude Code, Cowork and the Claude platform, and with ChatGPT and Codex — side by side, with the governance big companies expect.</p>
        </div>
      </header>

      <nav className="eh-tabs" role="tablist">
        {HANDBOOK_TABS.map(t => (
          <button key={t.id} type="button" role="tab" aria-selected={tab === t.id} className={tab === t.id ? 'on' : ''} onClick={() => pick(t.id)}>
            <span>{t.icon}</span>{t.label}
          </button>
        ))}
      </nav>

      {tab === 'certs' && (
        <div className="eh-body">
          <div className="eh-path">{CERT_PATHS.path.map((s, i) => <React.Fragment key={s}><span>{s}</span>{i < CERT_PATHS.path.length - 1 && <i>→</i>}</React.Fragment>)}</div>
          <h3 className="eh-sec claude">🅰️ Claude certifications (Anthropic)</h3>
          <div className="eh-grid">
            {CERT_PATHS.claude.map(c => (
              <article key={c.code} className="eh-card" style={{ '--a': '#d97757' }}>
                <h3><code>{c.code}</code>{c.name}</h3>
                <p><b>For:</b> {c.who}</p>
                <h4>Focus areas</h4>
                <ul>{c.focus.map(f => <li key={f}>{f}</li>)}</ul>
                <div className="eh-use">🛠️ Prove it: {c.apply}</div>
              </article>
            ))}
          </div>
          <p className="eh-note">{CERT_PATHS.claudeNote}</p>
          <h3 className="eh-sec openai">🟢 OpenAI certifications</h3>
          <div className="eh-grid">
            {CERT_PATHS.openai.map(c => (
              <article key={c.name} className="eh-card" style={{ '--a': '#10a37f' }}>
                <h3>{c.name}</h3>
                <p><b>For:</b> {c.who}</p>
                <h4>Focus areas</h4>
                <ul>{c.focus.map(f => <li key={f}>{f}</li>)}</ul>
                <div className="eh-use">🛠️ {c.apply}</div>
                <p className="eh-note">{c.note}</p>
              </article>
            ))}
          </div>
        </div>
      )}

      {tab === 'claude-code' && (
        <div className="eh-body">
          {CLAUDE_CODE.map(g => (
            <div key={g.group} className="eh-group">
              <h3 className="eh-sec claude">{g.group}</h3>
              <div className="eh-grid">
                {g.items.map(it => (
                  <article key={it.t} className="eh-card" style={{ '--a': '#d97757' }}>
                    <h3>{it.t}</h3>
                    <p>{it.d}</p>
                    {it.code && <Code src={it.code} />}
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'claude-apps' && <div className="eh-body"><ProductCards list={CLAUDE_APPS} accent="#d97757" /></div>}
      {tab === 'claude-gov' && <div className="eh-body"><p className="eh-note">Tick items as your organisation completes them (saved in this browser). Verify current attestations at trust.anthropic.com.</p><Governance list={CLAUDE_GOV} prefix="claude" accent="#d97757" /></div>}

      {tab === 'openai' && (
        <div className="eh-body">
          <ProductCards list={OPENAI_STACK} accent="#10a37f" />
          <h3 className="eh-sec openai">Codex & OpenAI configuration you need to know</h3>
          <div className="eh-grid">
            {CODEX_SNIPPETS.map(s => (
              <article key={s.t} className="eh-card" style={{ '--a': '#10a37f' }}><h3>{s.t}</h3><Code src={s.code} /></article>
            ))}
          </div>
        </div>
      )}
      {tab === 'openai-gov' && <div className="eh-body"><p className="eh-note">Tick items as your organisation completes them. Verify current attestations at trust.openai.com.</p><Governance list={OPENAI_GOV} prefix="openai" accent="#10a37f" /></div>}

      {tab === 'compare' && (
        <div className="eh-body">
          <div className="eh-table-wrap">
            <table className="eh-table">
              <thead><tr><th />{COMPARE.cols.map((c, i) => <th key={c} className={i < 2 ? 'claude' : 'openai'}>{c}</th>)}</tr></thead>
              <tbody>{COMPARE.rows.map(([label, ...cells]) => <tr key={label}><th>{label}</th>{cells.map((c, i) => <td key={i}>{c}</td>)}</tr>)}</tbody>
            </table>
          </div>
          <h3 className="eh-sec">Who is responsible for what</h3>
          <div className="eh-roles">{COMPARE.responsibilities.map(([role, d]) => <div key={role}><b>{role}</b><span>{d}</span></div>)}</div>
          <p className="eh-note">Rule of thumb: the agent writes, a human approves. No tool changes who is accountable for what ships.</p>
        </div>
      )}

      {tab === 'realtime' && (
        <div className="eh-body">
          {REALTIME.map(r => (
            <article key={r.title} className="eh-rt">
              <h3><span>{r.icon}</span>{r.title}</h3>
              <div className="eh-rt-cols">
                <div className="claude"><h4>🅰️ With Claude</h4><p>{r.claude}</p></div>
                <div className="openai"><h4>🟢 With OpenAI</h4><p>{r.openai}</p></div>
              </div>
              <h4 className="eh-both">Either way — non-negotiables</h4>
              <ul className="eh-pills">{r.both.map(b => <li key={b}>{b}</li>)}</ul>
            </article>
          ))}
        </div>
      )}

      {tab === 'enterprise' && (
        <div className="eh-body">
          <h3 className="eh-sec">Regulations & standards to map your use cases to</h3>
          <div className="eh-grid">{REGULATIONS.map(r => <article key={r.name} className="eh-card" style={{ '--a': '#79d9f2' }}><h3>{r.name}</h3><p>{r.scope}</p></article>)}</div>
          <h3 className="eh-sec">Enterprise rollout checklist (applies to Claude and OpenAI)</h3>
          <div className="eh-grid">
            {ENTERPRISE_CHECKLIST.map(p => <article key={p.phase} className="eh-card" style={{ '--a': '#c2a5ff' }}><h3>{p.phase}</h3><Checklist id={`ent.${p.phase}`} items={p.items} /></article>)}
          </div>
          <p className="eh-note">This is engineering guidance, not legal advice — confirm obligations with your legal, risk and compliance teams.</p>
        </div>
      )}
    </section>
  )
}
