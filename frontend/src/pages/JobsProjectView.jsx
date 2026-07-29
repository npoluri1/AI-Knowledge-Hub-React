import React, { useState, useEffect, useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import MermaidRenderer from '../components/MermaidRenderer'

export default function JobsProjectView() {
  const location = useLocation()
  const jobData = location.state?.job
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedFile, setSelectedFile] = useState(null)
  const [archView, setArchView] = useState('layers')

  useEffect(() => {
    if (jobData) {
      generateProject(jobData)
    }
  }, [jobData])

  const generateProject = async (job) => {
    setLoading(true)
    setError(null)
    setProject(null)
    try {
      const res = await fetch('/api/generate-project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: job.title,
          company: job.company,
          techs: job.techs || [],
          desc: job.desc || '',
          use_cases: Array.isArray(job.use_cases)
            ? job.use_cases.join(', ')
            : (job.use_cases || ''),
        }),
      })
      const text = await res.text()
      let data
      try { data = JSON.parse(text) } catch { data = null }
      if (res.ok && data && !data.error && data.files) {
        setProject(data)
      } else {
        // Backend unavailable — generate a client-side project scaffold
        setProject(generateClientProject(job))
      }
    } catch (e) {
      // Backend offline — generate client-side
      setProject(generateClientProject(job))
    }
    setLoading(false)
  }

  function generateClientProject(job) {
    const name = (job.title || 'Project').replace(/[^a-zA-Z0-9 ]/g, '').trim().replace(/\s+/g, '-').toLowerCase()
    const ts = job.techs || []
    const techStack = ts.length > 0 ? ts : ['Python', 'FastAPI', 'React', 'PostgreSQL', 'Docker']
    const desc = job.desc || job.title || 'AI-powered project'
    return {
      name,
      overview: `AI project for ${job.company || 'company'} — ${job.title}`,
      description: desc,
      techStack,
      files: [
        { path: 'README.md', content: `# ${name}\n\n${desc}\n\n## Tech Stack\n${techStack.map(t => `- ${t}`).join('\n')}` },
        { path: 'src/main.py', content: `# Entry point for ${name}\nprint("Hello from ${name}")` },
        { path: 'src/config.py', content: `# Configuration\nimport os\n\nAPI_KEY = os.getenv("API_KEY", "")\nMODEL = "gpt-4"` },
        { path: 'requirements.txt', content: `fastapi\nuvicorn\n${techStack.filter(t => t.toLowerCase().includes('langchain') || t.toLowerCase().includes('transformers')).map(t => t.toLowerCase()).join('\n')}` },
        { path: 'Dockerfile', content: `FROM python:3.11-slim\nWORKDIR /app\nCOPY . .\nRUN pip install -r requirements.txt\nCMD ["python", "src/main.py"]` },
      ],
      overviewItems: [
        { title: 'Company', value: job.company || 'N/A', icon: '🏢' },
        { title: 'Role', value: job.title || 'N/A', icon: '💼' },
        { title: 'Tech Stack', value: techStack.join(', '), icon: '🛠️' },
      ],
      architecture: {
        layers: [
          { name: 'Frontend', items: ['React SPA', 'REST API Client', 'Auth UI'], color: '#3b82f6' },
          { name: 'Backend', items: ['FastAPI Server', 'Job Processor', 'Queue Handler'], color: '#10b981' },
          { name: 'AI/ML', items: techStack.filter(t => t.toLowerCase().includes('ai') || t.toLowerCase().includes('llm') || t.toLowerCase().includes('ml') || t.toLowerCase().includes('langchain') || t.toLowerCase().includes('agent')).length > 0
            ? techStack.filter(t => t.toLowerCase().includes('ai') || t.toLowerCase().includes('llm') || t.toLowerCase().includes('ml') || t.toLowerCase().includes('langchain') || t.toLowerCase().includes('agent'))
            : ['LLM Integration', 'Prompt Pipeline', 'Data Processing'], color: '#f59e0b' },
          { name: 'Data', items: ['PostgreSQL', 'Redis Cache', 'Object Storage'], color: '#8b5cf6' },
        ],
        flows: [
          { from: 'User', to: 'Frontend', label: 'UI Request' },
          { from: 'Frontend', to: 'Backend', label: 'API Call' },
          { from: 'Backend', to: 'AI/ML', label: 'Inference' },
          { from: 'AI/ML', to: 'Data', label: 'Persist' },
        ]
      },
      codeSnippets: [
        { title: 'API Endpoint', lang: 'python', code: `from fastapi import FastAPI\n\napp = FastAPI(title="${name}")\n\n@app.get("/api/health")\nasync def health():\n    return {"status": "ok"}` },
        { title: 'Main Entry', lang: 'python', code: `import uvicorn\n\nif __name__ == "__main__":\n    uvicorn.run("src.main:app", host="0.0.0.0", port=8000, reload=True)` },
      ],
    }
  }

  const groupedFiles = useMemo(() => {
    if (!project?.files) return {}
    const groups = {}
    project.files.forEach(f => {
      const parts = f.path.split('/')
      const group = parts.slice(0, 2).join('/')
      if (!groups[group]) groups[group] = []
      groups[group].push(f)
    })
    return groups
  }, [project])

  const layerColors = {
    frontend: '#89b4fa',
    backend: '#a6e3a1',
    ai: '#cba6f7',
    agent: '#f5c2e7',
    data: '#f9e2af',
    infra: '#f38ba8',
  }

  if (!jobData) {
    return (
      <div className="jobs-view">
        <Link to="/jobs" className="back-link">← Back to Jobs</Link>
        <h2 className="chapter-title">🤖 Generate AI Project</h2>
        <div className="empty-state">
          No job selected. Go to <Link to="/jobs">AI Jobs</Link> and click "Generate Project" on any job card.
        </div>
      </div>
    )
  }

  return (
    <div className="jobs-view jpv-container">
      <Link to="/jobs" className="back-link">← Back to Jobs</Link>

      <div className="jpv-header">
        <div className="jpv-header-left">
          <h2 className="chapter-title" style={{ marginBottom: 0, borderBottom: 'none' }}>
            🤖 {project?.job_title || jobData.title}
          </h2>
          <span className="jpv-company">{jobData.company}</span>
        </div>
        {project?.files && (
          <div className="jpv-domain-badge">
            <span className="tag">🏭 {project.domain}</span>
            <span className="tag">📁 {project.files.length} files</span>
            <span className="tag">🏗️ {project.architecture.length} components</span>
          </div>
        )}
      </div>

      {loading && (
        <div className="loading" style={{ marginTop: 40 }}>
          Generating project architecture, source code, and diagrams...
        </div>
      )}

      {error && <div className="error">{error}</div>}

      {project && !loading && (
        <>
          {/* Tabs */}
          <div className="jpv-tabs">
            {[
              { id: 'overview', label: '📋 Overview', icon: '' },
              { id: 'architecture', label: '🏗️ Architecture', icon: '' },
              { id: 'patterns', label: '🧩 Design Patterns', icon: '' },
              { id: 'code', label: '📄 Source Code', icon: '' },
              { id: 'diagrams', label: '📊 Diagrams', icon: '' },
            ].map(tab => (
              <button
                key={tab.id}
                className={`jpv-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* === OVERVIEW TAB === */}
          {activeTab === 'overview' && (
            <div className="jpv-overview">
              <div className="jpv-description glass-card">
                <h3>📝 Job Description</h3>
                <p>{project.description}</p>
              </div>

              <div className="jpv-stats-grid">
                <div className="jpv-stat-card glass-card">
                  <div className="jpv-stat-value">{project.architecture?.length || 0}</div>
                  <div className="jpv-stat-label">Architecture Components</div>
                </div>
                <div className="jpv-stat-card glass-card">
                  <div className="jpv-stat-value">{project.design_patterns?.length || 0}</div>
                  <div className="jpv-stat-label">Design Patterns</div>
                </div>
                <div className="jpv-stat-card glass-card">
                  <div className="jpv-stat-value">{project.files?.length || 0}</div>
                  <div className="jpv-stat-label">Source Files</div>
                </div>
                <div className="jpv-stat-card glass-card">
                  <div className="jpv-stat-value">{project.data_flows?.length || 0}</div>
                  <div className="jpv-stat-label">Data Flows</div>
                </div>
              </div>

              <div className="jpv-tech-map glass-card">
                <h3>🔧 Tech Stack Map</h3>
                <div className="jpv-tech-groups">
                  {['frontend', 'backend', 'ai_ml', 'agent', 'data', 'infra'].map(layer => {
                    const targetLayer = layer === 'ai_ml' ? 'ai' : layer
                    const hasComps = project.architecture.filter(c => c.layer === targetLayer)
                    if (hasComps.length === 0) return null
                    return (
                      <div key={layer} className="jpv-tech-group" style={{ borderLeftColor: layerColors[targetLayer] || layerColors.backend }}>
                        <h4 style={{ color: layerColors[targetLayer] || layerColors.backend }}>
                          {layer === 'frontend' && '🎨 Frontend'}
                          {layer === 'backend' && '⚙️ Backend'}
                          {layer === 'ai_ml' && '🧠 AI/ML'}
                          {layer === 'agent' && '🤖 Agents'}
                          {layer === 'data' && '💾 Data'}
                          {layer === 'infra' && '☁️ Infrastructure'}
                        </h4>
                        {hasComps.map((c, i) => (
                          <div key={i} className="jpv-tech-item">
                            <strong>{c.name}</strong>
                            <span className="jpv-tech-desc">{c.description}</span>
                            <code className="jpv-tech-code">{c.tech}</code>
                          </div>
                        ))}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* === ARCHITECTURE TAB === */}
          {activeTab === 'architecture' && (
            <div className="jpv-architecture">
              <div className="jpv-arch-controls">
                <button
                  className={`jpv-arch-btn ${archView === 'layers' ? 'active' : ''}`}
                  onClick={() => setArchView('layers')}
                >📊 Layer View</button>
                <button
                  className={`jpv-arch-btn ${archView === 'flow' ? 'active' : ''}`}
                  onClick={() => setArchView('flow')}
                >🔄 Flow View</button>
                <button
                  className={`jpv-arch-btn ${archView === 'mermaid' ? 'active' : ''}`}
                  onClick={() => setArchView('mermaid')}
                >📐 Mermaid</button>
              </div>

              {archView === 'layers' && (
                <div className="jpv-arch-layers">
                  {['frontend', 'backend', 'ai', 'agent', 'data', 'infra'].map(layer => {
                    const comps = project.architecture.filter(c => c.layer === layer)
                    if (comps.length === 0) return null
                    return (
                      <div key={layer} className="jpv-arch-layer" style={{ borderLeftColor: layerColors[layer] }}>
                        <div className="jpv-arch-layer-header" style={{ background: layerColors[layer] + '15' }}>
                          <span className="jpv-arch-layer-icon">
                            {layer === 'frontend' && '🎨'}
                            {layer === 'backend' && '⚙️'}
                            {layer === 'ai' && '🧠'}
                            {layer === 'agent' && '🤖'}
                            {layer === 'data' && '💾'}
                            {layer === 'infra' && '☁️'}
                          </span>
                          <h4 style={{ color: layerColors[layer] }}>
                            {layer.charAt(0).toUpperCase() + layer.slice(1)} Layer
                          </h4>
                        </div>
                        <div className="jpv-arch-layer-body">
                          {comps.map((c, i) => (
                            <div key={i} className="jpv-arch-component" style={{ borderColor: layerColors[layer] + '40' }}>
                              <div className="jpv-arch-comp-name">{c.name}</div>
                              <div className="jpv-arch-comp-desc">{c.description}</div>
                              {c.dependencies.length > 0 && (
                                <div className="jpv-arch-deps">
                                  <span className="jpv-arch-deps-label">Depends on:</span>
                                  {c.dependencies.map((d, di) => (
                                    <span key={di} className="jpv-arch-dep-tag">{d}</span>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {archView === 'flow' && (
                <div className="jpv-arch-flow glass-card">
                  <h3>🔄 Data Flow Diagram</h3>
                  <div className="jpv-flow-list">
                    {project.data_flows.map((flow, i) => (
                      <div key={i} className="jpv-flow-item">
                        <div className="jpv-flow-from">{flow.from_component}</div>
                        <div className="jpv-flow-arrow">
                          <span className="jpv-flow-protocol">{flow.protocol}</span>
                          <span className="jpv-flow-arrow-symbol">→</span>
                        </div>
                        <div className="jpv-flow-to">{flow.to_component}</div>
                        <div className="jpv-flow-desc">{flow.description}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {archView === 'mermaid' && (
                <div className="jpv-mermaid glass-card">
                  <h3>📐 Architecture Diagram — Rendered</h3>
                  <div className="jpv-mermaid-rendered">
                    <MermaidRenderer source={project.mermaid_arch} id="arch" />
                  </div>
                  <details className="code-block">
                    <summary>📝 Show Mermaid Source Code</summary>
                    <pre>{project.mermaid_arch}</pre>
                  </details>
                  <hr className="jpv-mermaid-divider" />
                  <h3>📊 Business Flow Diagram — Rendered</h3>
                  <div className="jpv-mermaid-rendered">
                    <MermaidRenderer source={project.mermaid_business} id="biz" />
                  </div>
                  <details className="code-block">
                    <summary>📝 Show Mermaid Source Code</summary>
                    <pre>{project.mermaid_business}</pre>
                  </details>
                  <hr className="jpv-mermaid-divider" />
                  <h3>☁️ Deployment Diagram — Rendered</h3>
                  <div className="jpv-mermaid-rendered">
                    <MermaidRenderer source={project.mermaid_deploy} id="deploy" />
                  </div>
                  <details className="code-block">
                    <summary>📝 Show Mermaid Source Code</summary>
                    <pre>{project.mermaid_deploy}</pre>
                  </details>
                  <p className="jpv-mermaid-hint">
                    💡 Each diagram is rendered as interactive SVG. Click the source toggle to see the raw Mermaid code.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* === DESIGN PATTERNS TAB === */}
          {activeTab === 'patterns' && (
            <div className="jpv-patterns">
              <div className="jpv-patterns-intro glass-card">
                <h3>🧩 AI Design Patterns</h3>
                <p>These design patterns are identified from the job requirements and tech stack, organized by relevance to this specific project.</p>
              </div>
              <div className="jpv-patterns-grid">
                {project.design_patterns.map((pat, i) => (
                  <div key={i} className="jpv-pattern-card glass-card">
                    <div className="jpv-pattern-header">
                      <span className="jpv-pattern-num">#{i + 1}</span>
                      <h4>{pat.name}</h4>
                    </div>
                    <div className="jpv-pattern-pattern">
                      <code>{pat.pattern}</code>
                    </div>
                    <p className="jpv-pattern-desc">{pat.description}</p>
                    <div className="jpv-pattern-when">
                      <strong>When to use:</strong>
                      <p>{pat.when_to_use}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* === SOURCE CODE TAB === */}
          {activeTab === 'code' && (
            <div className="jpv-code">
              <div className="jpv-code-sidebar">
                <h3>📁 Project Files</h3>
                {Object.entries(groupedFiles).map(([group, files]) => (
                  <div key={group} className="jpv-file-group">
                    <div className="jpv-file-group-label">{group}</div>
                    {files.map((f, i) => (
                      <button
                        key={i}
                        className={`jpv-file-item ${selectedFile === f ? 'active' : ''}`}
                        onClick={() => setSelectedFile(f)}
                      >
                        <span className="jpv-file-icon">
                          {f.path.endsWith('.py') && '🐍'}
                          {f.path.endsWith('.tsx') && '⚛️'}
                          {f.path.endsWith('.ts') && '📘'}
                          {f.path.endsWith('.json') && '📋'}
                          {f.path.endsWith('.yml') && '📦'}
                          {f.path.endsWith('.md') && '📝'}
                          {f.path.endsWith('.env') && '🔐'}
                          {f.path.endsWith('.yaml') && '☸️'}
                          {![ '.py', '.tsx', '.ts', '.json', '.yml', '.md', '.env', '.yaml' ].some(e => f.path.endsWith(e)) && '📄'}
                        </span>
                        <span className="jpv-file-name">{f.path.split('/').pop()}</span>
                      </button>
                    ))}
                  </div>
                ))}
              </div>
              <div className="jpv-code-viewer">
                {selectedFile ? (
                  <>
                    <div className="jpv-code-header">
                      <span className="jpv-code-path">{selectedFile.path}</span>
                      <span className="jpv-code-desc">{selectedFile.description}</span>
                    </div>
                    <pre className="jpv-code-content">
                      <code>{selectedFile.content}</code>
                    </pre>
                  </>
                ) : (
                  <div className="empty-state" style={{ marginTop: 40 }}>
                    Select a file from the file tree to view its source code
                  </div>
                )}
              </div>
            </div>
          )}

          {/* === DIAGRAMS TAB === */}
          {activeTab === 'diagrams' && (
            <div className="jpv-diagrams">
              <div className="jpv-diagram-section glass-card">
                <h3>📊 Business Flow Diagram — Rendered</h3>
                <div className="jpv-dia-content">
                  <MermaidRenderer source={project.mermaid_business} id="d-biz" />
                </div>
                <details className="code-block" style={{ marginTop: 10 }}>
                  <summary>📝 Show Mermaid Source Code</summary>
                  <pre>{project.mermaid_business}</pre>
                </details>
              </div>

              <div className="jpv-diagram-section glass-card">
                <h3>📐 Architecture Diagram — Rendered</h3>
                <div className="jpv-dia-content">
                  <MermaidRenderer source={project.mermaid_arch} id="d-arch" />
                </div>
                <details className="code-block" style={{ marginTop: 10 }}>
                  <summary>📝 Show Mermaid Source Code</summary>
                  <pre>{project.mermaid_arch}</pre>
                </details>
              </div>

              <div className="jpv-diagram-section glass-card">
                <h3>☁️ Deployment Diagram — Rendered</h3>
                <div className="jpv-dia-content">
                  <MermaidRenderer source={project.mermaid_deploy} id="d-deploy" />
                </div>
                <details className="code-block" style={{ marginTop: 10 }}>
                  <summary>📝 Show Mermaid Source Code</summary>
                  <pre>{project.mermaid_deploy}</pre>
                </details>
              </div>

              <p className="jpv-mermaid-hint">
                🎨 Each diagram is rendered visually. Click "Show Mermaid Source Code" to view/edit the raw Mermaid syntax.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
