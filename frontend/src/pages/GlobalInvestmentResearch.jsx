import React, { useMemo, useState } from 'react';
import { WORKBOOK_META, SHEETS } from '../data/globalInvestmentResearch';
import { useLang } from '../i18n';
import './GlobalInvestmentResearch.css';

const isUrl = (v) => /^https?:\/\//i.test(v.trim());

function Cell({ value }) {
  if (!value) return <span className="gir-empty">—</span>;
  const trimmed = value.trim();
  if (isUrl(trimmed)) {
    return <a className="gir-link" href={trimmed} target="_blank" rel="noreferrer">{trimmed.replace(/^https?:\/\//, '')}</a>;
  }
  const parts = value.split('\n');
  return <>{parts.map((p, i) => (<React.Fragment key={i}>{p}{i < parts.length - 1 && <br />}</React.Fragment>))}</>;
}

function SheetTable({ sheet, query }) {
  const rows = useMemo(() => {
    if (!query.trim()) return sheet.rows;
    const q = query.toLowerCase();
    return sheet.rows.filter((r) => r.some((c) => (c || '').toLowerCase().includes(q)));
  }, [sheet, query]);

  return (
    <div className="gir-table-block">
      <div className="gir-table-meta">
        <span>{rows.length.toLocaleString()} rows</span>
        <span>·</span>
        <span>{sheet.columns.length} columns</span>
        {query.trim() && <span className="gir-filtered">filtered from {sheet.rows.length.toLocaleString()}</span>}
      </div>
      <div className="gir-table-wrap">
        <table className="gir-table">
          <thead>
            <tr>{sheet.columns.map((c, i) => <th key={i}>{c || ' '}</th>)}</tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri}>
                {sheet.columns.map((_, ci) => (
                  <td key={ci}><Cell value={row[ci]} /></td>
                ))}
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={sheet.columns.length} className="gir-no-rows">No rows match “{query}”.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function GlobalInvestmentResearch() {
  const { t } = useLang();
  const [activeId, setActiveId] = useState('readme');
  const [query, setQuery] = useState('');
  const [navQuery, setNavQuery] = useState('');

  const activeSheet = SHEETS.find((s) => s.id === activeId) || null;

  const totalRows = useMemo(() => SHEETS.reduce((n, s) => n + s.rows.length, 0), []);

  const navSheets = useMemo(() => {
    const q = navQuery.trim().toLowerCase();
    if (!q) return SHEETS;
    return SHEETS.filter((s) => s.tab.toLowerCase().includes(q) || s.title.toLowerCase().includes(q));
  }, [navQuery]);

  const guideSheets = navSheets.filter((s) => /^\d{2}\b/.test(s.tab));
  const dataSheets = navSheets.filter((s) => !/^\d{2}\b/.test(s.tab));

  const selectSheet = (id) => { setActiveId(id); setQuery(''); };

  return (
    <div className="gir-page">
      <div className="gir-hero">
        <div className="gir-kicker">🌐 GLOBAL INVESTMENT RESEARCH WORKBOOK</div>
        <h2 className="gir-title">{WORKBOOK_META.title}</h2>
        <p className="gir-sub">{WORKBOOK_META.subtitle}</p>
        <div className="gir-stats">
          <span><strong>{SHEETS.length}</strong> research tabs</span>
          <span><strong>{totalRows.toLocaleString()}</strong> rows of content</span>
          <span><strong>India · USA · Singapore</strong> focused</span>
        </div>
        <div className="gir-disclaimer">
          ⚠️ Educational research starter — not a buy list or recommendation. Verify tickers, prices, fees and tax rules with official exchanges / regulators before acting.
        </div>
      </div>

      <div className="gir-layout">
        <aside className="gir-nav" aria-label="Research tabs">
          <div className="gir-nav-search">
            <span>🔍</span>
            <input
              type="text"
              placeholder="Filter tabs…"
              value={navQuery}
              onChange={(e) => setNavQuery(e.target.value)}
            />
          </div>
          <button
            type="button"
            className={`gir-nav-item gir-nav-readme ${activeId === 'readme' ? 'active' : ''}`}
            onClick={() => selectSheet('readme')}
          >
            <span className="gir-nav-icon">📌</span>
            <span className="gir-nav-label">Read Me &amp; How to Use</span>
          </button>

          {dataSheets.length > 0 && (
            <div className="gir-nav-group">
              <div className="gir-nav-group-label">📊 Data &amp; Templates</div>
              {dataSheets.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  className={`gir-nav-item ${activeId === s.id ? 'active' : ''}`}
                  onClick={() => selectSheet(s.id)}
                >
                  <span className="gir-nav-label">{s.tab}</span>
                  <span className="gir-nav-count">{s.rows.length}</span>
                </button>
              ))}
            </div>
          )}

          {guideSheets.length > 0 && (
            <div className="gir-nav-group">
              <div className="gir-nav-group-label">🎓 Beginner Guide (01–26)</div>
              {guideSheets.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  className={`gir-nav-item ${activeId === s.id ? 'active' : ''}`}
                  onClick={() => selectSheet(s.id)}
                >
                  <span className="gir-nav-label">{s.tab}</span>
                  <span className="gir-nav-count">{s.rows.length}</span>
                </button>
              ))}
            </div>
          )}
          {navSheets.length === 0 && <div className="gir-nav-empty">No tabs match “{navQuery}”.</div>}
        </aside>

        <main className="gir-content">
          {activeId === 'readme' ? (
            <div className="gir-panel">
              <div className="gir-panel-head">
                <h3>📌 Read Me &amp; How to Use</h3>
              </div>
              <div className="gir-readme">
                {WORKBOOK_META.readme.map((row, i) => (
                  <div key={i} className="gir-readme-row">
                    <div className="gir-readme-key">{row[0]}</div>
                    <div className="gir-readme-val"><Cell value={row[1]} /></div>
                  </div>
                ))}
              </div>
              <div className="gir-readme-order">
                <h4>Suggested learning order</h4>
                <ol>
                  <li>01 Start Here → 02 Glossary → 04 Categories</li>
                  <li>08 / 09 ETFs → 06 / 07 Bonds</li>
                  <li>18 Six-Month Plan → then explore 03, 05, 10–17 as interest grows</li>
                  <li>24 Playbook + 25 / 26 trackers from month one</li>
                </ol>
              </div>
            </div>
          ) : activeSheet ? (
            <div className="gir-panel">
              <div className="gir-panel-head">
                <div>
                  <h3>{activeSheet.tab}</h3>
                  {activeSheet.title && activeSheet.title !== activeSheet.tab && (
                    <p className="gir-panel-title">{activeSheet.title}</p>
                  )}
                </div>
                <div className="gir-search">
                  <span>🔍</span>
                  <input
                    type="text"
                    placeholder="Search within this tab…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                  {query && <button type="button" className="gir-search-clear" onClick={() => setQuery('')}>✕</button>}
                </div>
              </div>
              {activeSheet.subtitle && <div className="gir-sheet-note">{activeSheet.subtitle}</div>}
              <SheetTable sheet={activeSheet} query={query} />
            </div>
          ) : (
            <div className="gir-panel gir-empty">Select a tab from the left to view its content.</div>
          )}
        </main>
      </div>
    </div>
  );
}
