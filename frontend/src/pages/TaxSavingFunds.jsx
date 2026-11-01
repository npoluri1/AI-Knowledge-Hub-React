import React, { useMemo, useState } from 'react';
import { TAX_SAVING_META, TAX_SAVING_COUNTRIES } from '../data/taxSavingFunds';
import './TaxSavingFunds.css';

function SchemeCard({ scheme }) {
  const rows = [
    ['Tax benefit', scheme.taxBenefit],
    ['Limit', scheme.limit],
    ['Horizon / lock-in', scheme.horizon],
    ['Best for', scheme.bestFor],
    ['Notes', scheme.notes],
  ].filter(([, v]) => v);

  return (
    <div className="tsf-card">
      <div className="tsf-card-head">
        <h4>{scheme.name}</h4>
        {scheme.type && <span className="tsf-type">{scheme.type}</span>}
      </div>
      <dl className="tsf-fields">
        {rows.map(([k, v]) => (
          <div key={k} className="tsf-field">
            <dt>{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
      {scheme.url && (
        <a className="tsf-source" href={scheme.url} target="_blank" rel="noreferrer">
          Official source ↗
        </a>
      )}
    </div>
  );
}

export default function TaxSavingFunds() {
  const [activeCode, setActiveCode] = useState(TAX_SAVING_COUNTRIES[0].code);
  const [navQuery, setNavQuery] = useState('');

  const totalSchemes = useMemo(
    () => TAX_SAVING_COUNTRIES.reduce((n, c) => n + c.schemes.length, 0),
    []
  );

  const navCountries = useMemo(() => {
    const q = navQuery.trim().toLowerCase();
    if (!q) return TAX_SAVING_COUNTRIES;
    return TAX_SAVING_COUNTRIES.filter(
      (c) =>
        c.country.toLowerCase().includes(q) ||
        c.schemes.some((s) => s.name.toLowerCase().includes(q))
    );
  }, [navQuery]);

  const active = TAX_SAVING_COUNTRIES.find((c) => c.code === activeCode) || TAX_SAVING_COUNTRIES[0];

  return (
    <div className="tsf-page">
      <div className="tsf-hero">
        <div className="tsf-kicker">💸 TAX-SAVING &amp; RETIREMENT FUNDS</div>
        <h2 className="tsf-title">{TAX_SAVING_META.title}</h2>
        <p className="tsf-sub">{TAX_SAVING_META.subtitle}</p>
        <div className="tsf-stats">
          <span><strong>{TAX_SAVING_COUNTRIES.length}</strong> countries</span>
          <span><strong>{totalSchemes}</strong> schemes &amp; accounts</span>
          <span><strong>SRS · CPF · ELSS · PPF · 401k · IRA · ISA · SIPP · RRSP · TFSA · Super · NISA · MPF</strong></span>
        </div>
        <div className="tsf-disclaimer">⚠️ {TAX_SAVING_META.note}</div>
      </div>

      <div className="tsf-layout">
        <aside className="tsf-nav" aria-label="Countries">
          <div className="tsf-nav-search">
            <span>🔍</span>
            <input
              type="text"
              placeholder="Filter countries…"
              value={navQuery}
              onChange={(e) => setNavQuery(e.target.value)}
            />
          </div>
          {navCountries.map((c) => (
            <button
              key={c.code}
              type="button"
              className={`tsf-nav-item ${active.code === c.code ? 'active' : ''}`}
              onClick={() => setActiveCode(c.code)}
            >
              <span className="tsf-nav-flag">{c.flag}</span>
              <span className="tsf-nav-label">{c.country}</span>
              <span className="tsf-nav-count">{c.schemes.length}</span>
            </button>
          ))}
          {navCountries.length === 0 && <div className="tsf-nav-empty">No country matches “{navQuery}”.</div>}
        </aside>

        <main className="tsf-main">
          <div className="tsf-country-head">
            <div className="tsf-country-title">
              <span className="tsf-country-flag">{active.flag}</span>
              <div>
                <h3>{active.country}</h3>
                <span className="tsf-currency">Currency: {active.currency}</span>
              </div>
            </div>
            {active.taxNote && <p className="tsf-taxnote">{active.taxNote}</p>}
          </div>

          <div className="tsf-cards">
            {active.schemes.map((s, i) => <SchemeCard key={i} scheme={s} />)}
          </div>

          <div className="tsf-footnote">
            Contributions, deduction caps and withdrawal rules change frequently. Confirm the current
            figures with the country’s tax authority or scheme regulator before you contribute.
          </div>
        </main>
      </div>
    </div>
  );
}
