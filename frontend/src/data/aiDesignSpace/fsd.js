// ============================================================
// AI DESIGN SPACE — FSD GENERATOR
// Functional Specification Document, auto-generated per industry:
// overview, objectives, stakeholders, domain requirements &
// workflows, architecture (HLD/LDD), project implementation,
// build/run/deploy plan, acceptance criteria and risks.
// ============================================================

import { getPattern } from './blueprints'

export function buildRunDeploy(industry) {
  const pkg = (industry.name || 'ai-app').replace(/[^a-z0-9]+/gi, '-').toLowerCase()
  return {
    build: [
      `git clone https://github.com/your-org/${pkg}.git && cd ${pkg}`,
      'python -m venv .venv && source .venv/bin/activate   # Windows: .venv\\Scripts\\activate',
      'pip install -r requirements.txt',
      'pytest tests/ -q                                  # run the test suite',
      'docker build -t ' + pkg + ':latest .',
    ],
    run: [
      'uvicorn app.main:app --reload --port 8000',
      'curl http://localhost:8000/health',
      'docker run -p 8000:8000 --env-file .env ' + pkg + ':latest',
      'docker compose up -d                              # app + vector store + db',
    ],
    deploy: [
      'docker tag ' + pkg + ':latest ghcr.io/your-org/' + pkg + ':latest',
      'docker push ghcr.io/your-org/' + pkg + ':latest',
      '# Render  → New Web Service → deploy from the Docker image (env vars from .env)',
      '# Railway → New Project → Deploy from GitHub; add the env vars',
      '# Fly.io  → fly launch --dockerfile Dockerfile && fly deploy',
      '# Vercel  → frontend (Next.js) deploys from the repo; backend stays on Render/Railway',
      '# AWS/GCP → push image to ECR/Artifact Registry → run on ECS/EKS/Cloud Run',
    ],
    env: [
      'ENVIRONMENT=production',
      'VECTOR_STORE=chroma',
      'LLM_MODEL=gpt-4o-mini',
      'GUARDRAILS_ENABLED=true',
      'EVAL_THRESHOLD=0.8',
      'DATABASE_URL=postgres://user:pass@db:5432/' + pkg,
      'OPENAI_API_KEY=sk-…            # or your LLM provider key',
    ],
    dockerfile: [
      'FROM python:3.12-slim',
      'WORKDIR /app',
      'COPY requirements.txt .',
      'RUN pip install --no-cache-dir -r requirements.txt',
      'COPY . .',
      'EXPOSE 8000',
      'CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]',
    ].join('\n'),
    compose: [
      'version: "3.9"',
      'services:',
      '  app:',
      `    build: .`,
      '    ports:',
      '      - "8000:8000"',
      '    env_file: .env',
      '    depends_on:',
      '      - db',
      '  db:',
      '    image: postgres:16',
      '    environment:',
      '      POSTGRES_DB: ' + pkg,
      '      POSTGRES_PASSWORD: change-me',
      '    volumes:',
      '      - dbdata:/var/lib/postgresql/data',
      'volumes:',
      '  dbdata:',
    ].join('\n'),
  }
}

export function generateFSD(industry) {
  if (!industry) return null
  const deploy = buildRunDeploy(industry)
  const allTech = [...new Set(industry.domains.flatMap(d => d.tech))]
  const date = new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })

  const domains = industry.domains.map(d => {
    const pattern = getPattern(d.blueprint)
    const requirements = [
      `The system shall ${d.patternTag.toLowerCase() === 'conversational ai' ? 'converse' : 'handle'} ${d.name.toLowerCase()} requests for ${industry.name} end to end.`,
      `It shall ground every response in the ${industry.name} knowledge sources for ${d.name} (${pattern?.tag || 'custom architecture'}).`,
      `It shall expose a REST API (FastAPI) for ${d.name} with typed, validated request/response models.`,
      `It shall route ${d.name} actions through a permission-scoped tool layer with a full audit trail.`,
      `It shall measure quality with evals (faithfulness, relevance, safety) and emit observability traces per request.`,
      `It shall support human-in-the-loop approval for high-impact ${d.name} actions.`,
    ]
    const workflowSteps = pattern ? pattern.ldd.map(n => n.title) : ['Capture', 'Process', 'Deliver']
    return {
      ...d,
      patternName: pattern?.name || 'Custom Architecture',
      patternTag: pattern?.tag || 'Custom',
      requirements,
      workflowSteps,
    }
  })

  return {
    meta: {
      title: `Functional Specification — ${industry.name}`,
      industry: industry.name,
      sector: industry.sectorName,
      version: '1.0',
      date,
      author: 'AI Knowledge Hub · AI Design Space',
      documentId: `FSD-${industry.slug?.toUpperCase?.() || 'AI'}-001`,
    },
    overview: industry.summary,
    objectives: [
      `Deliver a production-ready ${industry.name} AI capability across ${domains.length} functional domains.`,
      'Ground every AI decision in organisation knowledge and enterprise systems (RAG + MCP).',
      'Ship with guardrails, evals, observability and audit from day one.',
      'Provide a runnable, deployable project with a clear build → run → deploy path.',
    ],
    scope: {
      inScope: domains.map(d => `${d.name} (${d.patternTag})`),
      outScope: ['Legacy system migration', 'Multi-region high availability', 'Organisation-specific UI branding'],
    },
    stakeholders: ['Business / product owners', 'Operations & support teams', 'Engineering & ML teams', 'Data & knowledge owners', 'Compliance, security & audit'],
    domains,
    architecture: {
      hldLabel: 'High-Level Design (system layers)',
      lddLabel: 'Low-Level Design (component flow)',
      representative: domains[0] || null,
    },
    techStack: allTech,
    project: {
      structure: [
        'project/',
        '  app/main.py · agent.py · retriever.py · tools.py · config.py',
        '  tests/test_api.py',
        '  README.md · requirements.txt · Dockerfile · docker-compose.yml · .env.example',
      ],
      stack: ['Python + FastAPI', 'LangGraph / CrewAI', 'VectorDB + Embeddings', 'MCP tool layer', 'Evals + Observability'],
    },
    buildRunDeploy: deploy,
    acceptance: [
      'All functional domains answer grounded, cited requests (faithfulness score ≥ 0.8).',
      'Guardrails block injection, PII leakage and disallowed content (no exceptions).',
      'Every tool action is permission-scoped and audited.',
      'Full test suite passes (pytest) and the API boots from the Docker image.',
      'Deployable to a container host with only env vars as configuration.',
      'Human approval gates work for high-impact actions.',
    ],
    risks: [
      { risk: 'Knowledge base quality drifts → hallucinations creep back', mitigation: 'Continuous re-indexing, eval gates on every release' },
      { risk: 'Tool layer abused without limits', mitigation: 'Least-privilege MCP scopes + approval gates + audit' },
      { risk: 'Latency/cost grow with context', mitigation: 'Token budgeting, chunking + reranking, caching' },
      { risk: 'Regulatory scrutiny on AI decisions', mitigation: 'Traceable decisions, explainability, immutable logs' },
    ],
  }
}

export function fsdToMarkdown(fsd) {
  if (!fsd) return ''
  const m = fsd.meta
  const lines = []
  lines.push(`# ${m.title}`)
  lines.push('')
  lines.push(`> **Document:** ${m.documentId} · **Version:** ${m.version} · **Date:** ${m.date}`)
  lines.push(`> **Industry:** ${m.industry} · **Sector:** ${m.sector} · **Author:** ${m.author}`)
  lines.push('')
  lines.push('## 1. Overview')
  lines.push(fsd.overview)
  lines.push('')
  lines.push('## 2. Objectives')
  fsd.objectives.forEach((o, i) => lines.push(`${i + 1}. ${o}`))
  lines.push('')
  lines.push('## 3. Scope')
  lines.push('**In scope:** ' + fsd.scope.inScope.join('; '))
  lines.push('')
  lines.push('**Out of scope:** ' + fsd.scope.outScope.join('; '))
  lines.push('')
  lines.push('## 4. Stakeholders')
  lines.push(fsd.stakeholders.join(', '))
  lines.push('')
  fsd.domains.forEach((d, i) => {
    lines.push(`## 5.${i + 1} Functional Domain — ${d.name} (${d.patternTag})`)
    lines.push('')
    lines.push(d.desc)
    lines.push('')
    lines.push('**Functional requirements**')
    d.requirements.forEach(r => lines.push(`- FR-${i + 1}: ${r}`))
    lines.push('')
    lines.push('**Workflow**')
    d.workflowSteps.forEach((s, j) => lines.push(`${j + 1}. ${s}`))
    lines.push('')
  })
  lines.push('## 6. Architecture')
  lines.push(`- ${fsd.architecture.hldLabel} — rendered on the design page as layer diagrams`)
  lines.push(`- ${fsd.architecture.lddLabel} — rendered on the design page as component-flow diagrams`)
  lines.push('')
  lines.push('## 7. Technology Stack')
  lines.push(fsd.techStack.join(', '))
  lines.push('')
  lines.push('## 8. Project Implementation')
  lines.push('```')
  fsd.project.structure.forEach(l => lines.push(l))
  lines.push('```')
  lines.push('')
  lines.push('Stack: ' + fsd.project.stack.join(' · '))
  lines.push('')
  lines.push('## 9. Build, Run & Deploy')
  lines.push('### Build')
  fsd.buildRunDeploy.build.forEach(c => lines.push('```bash\n' + c + '\n```'))
  lines.push('### Run')
  fsd.buildRunDeploy.run.forEach(c => lines.push('```bash\n' + c + '\n```'))
  lines.push('### Deploy')
  fsd.buildRunDeploy.deploy.forEach(c => lines.push('- ' + c))
  lines.push('')
  lines.push('### Environment variables')
  fsd.buildRunDeploy.env.forEach(v => lines.push('- `' + v + '`'))
  lines.push('')
  lines.push('### Dockerfile')
  lines.push('```dockerfile')
  lines.push(fsd.buildRunDeploy.dockerfile)
  lines.push('```')
  lines.push('')
  lines.push('### docker-compose.yml')
  lines.push('```yaml')
  lines.push(fsd.buildRunDeploy.compose)
  lines.push('```')
  lines.push('')
  lines.push('## 10. Acceptance Criteria')
  fsd.acceptance.forEach((a, i) => lines.push(`${i + 1}. ${a}`))
  lines.push('')
  lines.push('## 11. Risks & Mitigations')
  lines.push('| Risk | Mitigation |')
  lines.push('| --- | --- |')
  fsd.risks.forEach(r => lines.push(`| ${r.risk} | ${r.mitigation} |`))
  lines.push('')
  return lines.join('\n')
}
