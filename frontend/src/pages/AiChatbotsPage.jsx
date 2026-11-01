import { useState, useMemo, useCallback } from 'react';
import { COUNTRIES, INDUSTRIES, AI_CHATBOTS, DEPLOYMENT_TYPES } from '../data/aiChatbotsData';
import FetchButton from '../components/FetchButton';
import AiChatbotDetail from '../components/AiChatbotDetail';
import { useLang } from '../i18n';
import './AiChatbotsPage.css';

const PAGE_SIZES = [50, 100, 0];
const STATUS_COLORS = {
  production: '#3fb950',
  pilot: '#d29922',
  development: '#58a6ff',
  deprecated: '#8b949e',
};

const getCountry = (id) => COUNTRIES.find((c) => c.id === id) || null;
const getIndustry = (id) => INDUSTRIES.find((i) => i.id === id) || null;
const getDeployment = (id) => DEPLOYMENT_TYPES.find((d) => d.id === id) || null;
const botId = chatbot => chatbot.id || `${chatbot.company}-${chatbot.name}`;

function matchesSearch(chatbot, term) {
  if (!term) return true;
  const lower = term.toLowerCase();
  const fields = [chatbot.name, chatbot.company, chatbot.description, ...(chatbot.useCases || []), ...(chatbot.issues || [])];
  return fields.some((f) => f && f.toLowerCase().includes(lower));
}

export default function AiChatbotsPage() {
  const { t } = useLang();
  const [search, setSearch] = useState('');
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [selectedIndustries, setSelectedIndustries] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('grid');
  const [pageSize, setPageSize] = useState(50);
  const [expandedCountries, setExpandedCountries] = useState({});
  const [expandedIndustries, setExpandedIndustries] = useState({});
  const [expanded, setExpanded] = useState(null);

  const toggleArrayFilter = useCallback((setter) => (id) => {
    setter((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }, []);

  const toggleCountry = toggleArrayFilter(setSelectedCountries);
  const toggleIndustry = toggleArrayFilter(setSelectedIndustries);
  const toggleStatus = toggleArrayFilter(setSelectedStatuses);

  const filtered = useMemo(() => {
    let list = AI_CHATBOTS;
    if (search) list = list.filter((c) => matchesSearch(c, search));
    if (selectedCountries.length) list = list.filter((c) => selectedCountries.includes(c.country));
    if (selectedIndustries.length) list = list.filter((c) => selectedIndustries.includes(c.industry));
    if (selectedStatuses.length) list = list.filter((c) => selectedStatuses.includes(c.status));

    const sorted = [...list];
    sorted.sort((a, b) => {
      switch (sortBy) {
        case 'country': {
          const ca = getCountry(a.country)?.name || '';
          const cb = getCountry(b.country)?.name || '';
          return ca.localeCompare(cb);
        }
        case 'industry': {
          const ia = getIndustry(a.industry)?.name || '';
          const ib = getIndustry(b.industry)?.name || '';
          return ia.localeCompare(ib);
        }
        case 'year':
          return (b.year || 0) - (a.year || 0);
        case 'status': {
          const order = { production: 0, pilot: 1, development: 2, deprecated: 3 };
          return (order[a.status] ?? 4) - (order[b.status] ?? 4);
        }
        default:
          return (a.name || '').localeCompare(b.name || '');
      }
    });
    return sorted;
  }, [search, selectedCountries, selectedIndustries, selectedStatuses, sortBy]);

  const stats = useMemo(() => {
    const byStatus = {};
    const byCountry = {};
    const byIndustry = {};
    AI_CHATBOTS.forEach((c) => {
      byStatus[c.status] = (byStatus[c.status] || 0) + 1;
      byCountry[c.country] = (byCountry[c.country] || 0) + 1;
      byIndustry[c.industry] = (byIndustry[c.industry] || 0) + 1;
    });
    const topCountries = Object.entries(byCountry)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([id, count]) => ({ id, count, ...getCountry(id) }));
    const topIndustries = Object.entries(byIndustry)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([id, count]) => ({ id, count, ...getIndustry(id) }));
    return { byStatus, topCountries, topIndustries };
  }, []);

  const groupedByCountry = useMemo(() => {
    const map = {};
    filtered.forEach((c) => {
      if (!map[c.country]) map[c.country] = [];
      map[c.country].push(c);
    });
    return Object.entries(map).sort((a, b) => (getCountry(a[0])?.name || '').localeCompare(getCountry(b[0])?.name || ''));
  }, [filtered]);

  const groupedByIndustry = useMemo(() => {
    const map = {};
    filtered.forEach((c) => {
      if (!map[c.industry]) map[c.industry] = [];
      map[c.industry].push(c);
    });
    return Object.entries(map).sort((a, b) => (getIndustry(a[0])?.name || '').localeCompare(getIndustry(b[0])?.name || ''));
  }, [filtered]);

  const visibleCount = pageSize === 0 ? filtered.length : Math.min(pageSize, filtered.length);
  const visibleItems = filtered.slice(0, visibleCount);

  const toggleExpandedCountry = (id) => setExpandedCountries((p) => ({ ...p, [id]: !p[id] }));
  const toggleExpandedIndustry = (id) => setExpandedIndustries((p) => ({ ...p, [id]: !p[id] }));

  const renderChatbotCard = (chatbot) => {
    const isExpanded = expanded === chatbot.id
    const country = getCountry(chatbot.country);
    const industry = getIndustry(chatbot.industry);
    const deployment = getDeployment(chatbot.status);
    const statusColor = STATUS_COLORS[chatbot.status] || '#8b949e';
    const hasIssues = chatbot.issues && chatbot.issues.length > 0;

    return (
      <div
        key={chatbot.id}
        onDoubleClick={() => { window.location.href = `/ai-chatbots/${chatbot.id}` }}
        onClick={() => setExpanded(isExpanded ? null : chatbot.id)}
        role="button"
        tabIndex={0}
        onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') setExpanded(isExpanded ? null : chatbot.id) }}
        style={{
          background: '#181825',
          border: hasIssues ? '1px solid #f38ba8' : '1px solid #313244',
          borderRadius: 12,
          padding: 20,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          transition: 'all 0.2s ease',
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = hasIssues
            ? '0 8px 24px rgba(243,139,168,0.15)'
            : '0 8px 24px rgba(0,0,0,0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        {hasIssues && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 3,
              background: 'linear-gradient(90deg, #f38ba8, #fab387)',
            }}
          />
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: '#6c7086', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>
              {chatbot.company}
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#cdd6f4', lineHeight: 1.3 }}>
              {chatbot.name}
            </div>
          </div>
          <div
            style={{
              background: statusColor + '22',
              border: `1px solid ${statusColor}55`,
              color: statusColor,
              fontSize: 11,
              fontWeight: 600,
              padding: '3px 10px',
              borderRadius: 20,
              whiteSpace: 'nowrap',
              textTransform: 'capitalize',
            }}
          >
            {chatbot.status}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#a6adc8' }}>
          {country && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ fontSize: 16 }}>{country.flag}</span>
              {country.name}
            </span>
          )}
          {industry && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ color: industry.color }}>{industry.icon}</span>
              {industry.name}
            </span>
          )}
          {chatbot.year && <span style={{ color: '#6c7086' }}>{chatbot.year}</span>}
          {chatbot.model && <span style={{ color: '#6c7086', fontStyle: 'italic' }}>{chatbot.model}</span>}
        </div>

        <div style={{ fontSize: 13, color: '#bac2de', lineHeight: 1.6 }}>
          {chatbot.description}
        </div>

        {chatbot.useCases && chatbot.useCases.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {chatbot.useCases.map((uc, i) => (
              <span
                key={i}
                style={{
                  background: '#313244',
                  color: '#cdd6f4',
                  fontSize: 11,
                  padding: '3px 10px',
                  borderRadius: 6,
                }}
              >
                {uc}
              </span>
            ))}
          </div>
        )}

        {hasIssues && (
          <div
            style={{
              background: '#f38ba811',
              border: '1px solid #f38ba833',
              borderRadius: 8,
              padding: '8px 12px',
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 700, color: '#f38ba8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>
              Production Issues
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {chatbot.issues.map((issue, i) => (
                <span
                  key={i}
                  style={{
                    background: '#f38ba822',
                    color: '#f38ba8',
                    fontSize: 11,
                    padding: '2px 8px',
                    borderRadius: 4,
                    border: '1px solid #f38ba844',
                  }}
                >
                  {issue}
                </span>
              ))}
            </div>
          </div>
        )}

        {chatbot.deployment && (
          <div style={{ fontSize: 11, color: '#6c7086' }}>
            Deployment: {chatbot.deployment}
          </div>
        )}
        <div style={{ fontSize: 11, color: '#89b4fa', fontWeight: 700 }}>{isExpanded ? '▲ Hide implementation profile' : '▼ Explore what this chatbot does'}</div>
        <a href={`/ai-chatbots/${chatbot.id}`} onClick={event => event.stopPropagation()} style={{ fontSize: 11, color: '#a6e3a1', fontWeight: 700, textDecoration: 'none' }}>Open full chatbot page ↗</a>
        {isExpanded && <AiChatbotDetail chatbot={chatbot} color={statusColor} />}
      </div>
    );
  };

  const renderGrid = () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(380px, 100%), 1fr))', gap: 16 }}>
      {visibleItems.map(renderChatbotCard)}
    </div>
  );

  const renderGroupedView = (groups, getId, getName, getIcon, expandedMap, toggleFn) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {groups.map(([id, items]) => {
        const data = getId === 'country' ? getCountry(id) : getIndustry(id);
        const expanded = !!expandedMap[id];
        const icon = getId === 'country' ? data?.flag : data?.icon;
        const color = getId === 'industry' ? data?.color : '#cdd6f4';
        return (
          <div
            key={id}
            style={{
              background: '#181825',
              border: '1px solid #313244',
              borderRadius: 12,
              overflow: 'hidden',
            }}
          >
            <button
              onClick={() => toggleFn(id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '14px 20px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <span style={{ fontSize: 24 }}>{icon}</span>
              <span style={{ fontSize: 16, fontWeight: 700, color: '#cdd6f4', flex: 1 }}>
                {data?.name || id}
              </span>
              <span
                style={{
                  background: color + '22',
                  color,
                  fontSize: 12,
                  fontWeight: 600,
                  padding: '2px 10px',
                  borderRadius: 20,
                }}
              >
                {items.length} chatbots
              </span>
              <span
                style={{
                  color: '#6c7086',
                  fontSize: 18,
                  transition: 'transform 0.2s',
                  transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
                }}
              >
                &#9654;
              </span>
            </button>
            {expanded && (
              <div
                style={{
                  padding: '0 20px 20px',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(min(380px, 100%), 1fr))',
                  gap: 12,
                }}
              >
                {items.map(renderChatbotCard)}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  const filterPillStyle = (active, color) => ({
    background: active ? (color || '#89b4fa') + '22' : '#1e1e2e',
    border: `1px solid ${active ? (color || '#89b4fa') + '66' : '#313244'}`,
    color: active ? (color || '#89b4fa') : '#a6adc8',
    fontSize: 12,
    fontWeight: 600,
    padding: '6px 14px',
    borderRadius: 20,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    whiteSpace: 'nowrap',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
  });

  return (
    <div style={{ minHeight: '100vh', background: '#0d1117', color: '#cdd6f4', fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 24px' }}>
        {/* Header */}
        <header style={{ paddingTop: 32, paddingBottom: 24, borderBottom: '1px solid #21262d' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
            <a
              href="/"
              style={{
                color: '#89b4fa',
                textDecoration: 'none',
                fontSize: 14,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <span>&larr;</span> {t('Home')}
            </a>
            <FetchButton staticMode />
          </div>

          <h1 style={{ fontSize: 36, fontWeight: 800, margin: '0 0 8px', background: 'linear-gradient(135deg, #89b4fa, #cba6f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {t('AI Chatbots & Habots Global Directory')}
          </h1>
          <p style={{ fontSize: 16, color: '#a6adc8', margin: '0 0 24px' }}>
            1000+ AI chatbots and virtual assistants across countries and industries &mdash; with real production issues and deployment status
          </p>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: 24, marginBottom: 28, flexWrap: 'wrap' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#89b4fa' }}>{AI_CHATBOTS.length.toLocaleString()}</div>
              <div style={{ fontSize: 12, color: '#6c7086' }}>{t('Total Chatbots')}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#a6e3a1' }}>{COUNTRIES.length}</div>
              <div style={{ fontSize: 12, color: '#6c7086' }}>{t('Countries')}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#f9e2af' }}>{INDUSTRIES.length}</div>
              <div style={{ fontSize: 12, color: '#6c7086' }}>{t('Industries')}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#3fb950' }}>{stats.byStatus.production || 0}</div>
              <div style={{ fontSize: 12, color: '#6c7086' }}>{t('In Production')}</div>
            </div>
          </div>

          {/* Search */}
          <div style={{ position: 'relative', marginBottom: 16 }}>
            <input
              type="text"
              placeholder="Search chatbots by name, company, description, use cases..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px 12px 40px',
                background: '#161b22',
                border: '1px solid #30363d',
                borderRadius: 10,
                color: '#cdd6f4',
                fontSize: 14,
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.15s',
              }}
              onFocus={(e) => { e.target.style.borderColor = '#89b4fa'; }}
              onBlur={(e) => { e.target.style.borderColor = '#30363d'; }}
            />
            <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#6c7086', fontSize: 16 }}>&#128269;</span>
            {search && (
              <button
                onClick={() => setSearch('')}
                style={{
                  position: 'absolute',
                  right: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#6c7086',
                  cursor: 'pointer',
                  fontSize: 18,
                  lineHeight: 1,
                }}
              >
                &times;
              </button>
            )}
          </div>

          {/* Deployment status filters */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 11, color: '#6c7086', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>{t('Status')}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {DEPLOYMENT_TYPES.map((d) => {
                const active = selectedStatuses.includes(d.id);
                return (
                  <button key={d.id} style={filterPillStyle(active, d.color)} onClick={() => toggleStatus(d.id)}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: d.color, display: 'inline-block' }} />
                    {d.name} ({stats.byStatus[d.id] || 0})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Country filters */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 11, color: '#6c7086', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>{t('Countries')}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, maxHeight: selectedCountries.length > 0 ? 'none' : 42, overflow: 'hidden', transition: 'max-height 0.3s' }}>
              {COUNTRIES.sort((a, b) => a.name.localeCompare(b.name)).map((c) => {
                const active = selectedCountries.includes(c.id);
                return (
                  <button key={c.id} style={filterPillStyle(active, '#89b4fa')} onClick={() => toggleCountry(c.id)}>
                    {c.flag} {c.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Industry filters */}
          <div style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 11, color: '#6c7086', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>{t('Industries')}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {INDUSTRIES.map((ind) => {
                const active = selectedIndustries.includes(ind.id);
                return (
                  <button key={ind.id} style={filterPillStyle(active, ind.color)} onClick={() => toggleIndustry(ind.id)}>
                    {ind.icon} {ind.name}
                  </button>
                );
              })}
            </div>
          </div>
        </header>

        {/* Stats Dashboard */}
        <section style={{ padding: '24px 0', borderBottom: '1px solid #21262d' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))', gap: 24 }}>
            <div style={{ background: '#181825', border: '1px solid #313244', borderRadius: 12, padding: 20 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#cdd6f4', margin: '0 0 16px', textTransform: 'uppercase', letterSpacing: 1 }}>
                By Deployment Status
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {DEPLOYMENT_TYPES.map((d) => {
                  const count = stats.byStatus[d.id] || 0;
                  const pct = AI_CHATBOTS.length > 0 ? (count / AI_CHATBOTS.length) * 100 : 0;
                  return (
                    <div key={d.id}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: 13, color: '#a6adc8' }}>{d.name}</span>
                        <span style={{ fontSize: 13, color: d.color, fontWeight: 600 }}>{count}</span>
                      </div>
                      <div style={{ height: 6, background: '#313244', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${pct}%`, background: d.color, borderRadius: 3, transition: 'width 0.5s ease' }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(260px, 100%), 1fr))', gap: 16 }}>
              <div style={{ background: '#181825', border: '1px solid #313244', borderRadius: 12, padding: 20 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: '#cdd6f4', margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: 1 }}>
                  Top Countries
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {stats.topCountries.map((c) => (
                    <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                      <span>{c.flag}</span>
                      <span style={{ color: '#a6adc8', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</span>
                      <span style={{ color: '#89b4fa', fontWeight: 600 }}>{c.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ background: '#181825', border: '1px solid #313244', borderRadius: 12, padding: 20 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: '#cdd6f4', margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: 1 }}>
                  Top Industries
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {stats.topIndustries.map((ind) => (
                    <div key={ind.id} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                      <span style={{ color: ind.color }}>{ind.icon}</span>
                      <span style={{ color: '#a6adc8', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ind.name}</span>
                      <span style={{ color: ind.color, fontWeight: 600 }}>{ind.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Toolbar */}
        <section style={{ padding: '20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 13, color: '#6c7086' }}>
              Showing {visibleCount.toLocaleString()} of {filtered.length.toLocaleString()} chatbots
            </span>
            <div style={{ display: 'flex', gap: 4 }}>
              {[
                { id: 'grid', label: t('Cards') },
                { id: 'country', label: t('By Country') },
                { id: 'industry', label: t('By Industry') },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setViewMode(m.id)}
                  style={{
                    background: viewMode === m.id ? '#89b4fa22' : '#1e1e2e',
                    border: `1px solid ${viewMode === m.id ? '#89b4fa55' : '#313244'}`,
                    color: viewMode === m.id ? '#89b4fa' : '#a6adc8',
                    fontSize: 12,
                    fontWeight: 600,
                    padding: '6px 14px',
                    borderRadius: 8,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12, color: '#6c7086' }}>Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                background: '#1e1e2e',
                border: '1px solid #313244',
                color: '#cdd6f4',
                fontSize: 12,
                padding: '6px 10px',
                borderRadius: 8,
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              <option value="name">Name</option>
              <option value="country">Country</option>
              <option value="industry">Industry</option>
              <option value="year">Year</option>
              <option value="status">Status</option>
            </select>

            <span style={{ fontSize: 12, color: '#6c7086', marginLeft: 8 }}>Show:</span>
            {PAGE_SIZES.map((s) => (
              <button
                key={s}
                onClick={() => setPageSize(s)}
                style={{
                  background: pageSize === s ? '#89b4fa22' : '#1e1e2e',
                  border: `1px solid ${pageSize === s ? '#89b4fa55' : '#313244'}`,
                  color: pageSize === s ? '#89b4fa' : '#a6adc8',
                  fontSize: 12,
                  fontWeight: 600,
                  padding: '4px 12px',
                  borderRadius: 6,
                  cursor: 'pointer',
                }}
              >
                {s === 0 ? 'All' : s}
              </button>
            ))}
          </div>
        </section>

        {/* Main Content */}
        <section style={{ paddingBottom: 48 }}>
          {viewMode === 'grid' && renderGrid()}
          {viewMode === 'country' &&
            renderGroupedView(groupedByCountry, 'country', 'name', 'flag', expandedCountries, toggleExpandedCountry)}
          {viewMode === 'industry' &&
            renderGroupedView(groupedByIndustry, 'industry', 'name', 'icon', expandedIndustries, toggleExpandedIndustry)}
        </section>
      </div>
    </div>
  );
}
