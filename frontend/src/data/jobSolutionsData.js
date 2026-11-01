// ============================================================================
// jobSolutionsData.js — AI Solution Implementation Playbooks
// ----------------------------------------------------------------------------
// Each job in the Jobs page maps to an AI-enabled implementation playbook:
// how the role's responsibilities are turned into concrete data + AI
// solutions, what stack is used, the implementation steps, and the expected
// outcomes. Content is derived from each job description (requirements +
// targets) and framed as a solution design, not as production claims.
//
// TO ADD A NEW JOB:
//   Append one object to `JOB_SOLUTIONS` following the schema below.
//   Required: id, role, org, location, tags, summary.
//   Optional but recommended: targets, responsibilities[], architecture[],
//   governance[], stackCodes[].
// ============================================================================

export const JOB_SOLUTIONS = [
  {
    id: 'nu-alexandra-ccrs-ai-brain',
    role: 'Clinical Research Coordinator — AI · Brain Health · Dementia',
    org: 'Alexandra Hospital · National University Health System (NUHS)',
    location: 'Singapore',
    domain: 'AI in Healthcare · Healthy Ageing · Population Health',
    tags: ['Healthcare AI', 'Dementia', 'Healthy Longevity', 'Population Health', 'Clinical Research'],
    summary:
      'AI-enabled research cohort for brain health and dementia: recruit and engage participants across Singapore, collect longitudinal cognitive + wearable + EHR data, run a governance-grade research database, and feed explainable ML models for dementia risk stratification and healthy-ageing population analytics.',
    targets: [
      'Grow a diverse, consented research cohort for brain-health & healthy-ageing studies in Singapore',
      'Bring fragmented clinical, cognitive and wearable data into one de-identified longitudinal research dataset',
      'Stand up auditable, clinician-in-the-loop ML pipelines for dementia / cognitive decline risk',
      'Deliver population-health insights (dementia burden, ageing indicators) for decision-makers',
    ],
    responsibilities: [
      {
        label: 'Participant recruitment & engagement',
        problem:
          'Recruiting older adults and caregivers into dementia/ageing studies is slow; outreach is ad-hoc, cohorts are small, and no-show/dropout is common.',
        solution:
          'AI-assisted cohort matching + multichannel engagement. A screening registry with an eligibility-matching engine ranks and routes prospective participants; WhatsApp/SMS/email outreach with preferred-time reminders and consent-to-contact flows keep engagement high across Singapore’s 4 official languages.',
        stack: ['FastAPI decision service', 'PostgreSQL', 'WhatsApp Business API / SMS gateway', 'Redis queues', 'E-consent (digital signature)', 'React portal'],
        steps: [
          'Build a screening registry (consent-to-contact, PDPA)',
          'Add eligibility matching & prioritisation scoring',
          'Automate outreach timing with human-in-the-loop approval',
          'Track recruitment funnel, no-show & retention KPIs',
        ],
        outcome:
          'Faster, fairer recruitment and higher retention — a durable cohort pool re-usable across the institute’s ageing & dementia studies.',
      },
      {
        label: 'Research coordination & data collection',
        problem:
          'Paper/mixed-mode capture causes missing data and reconciliation effort; cognitive assessments and wearable/sensor streams live in disconnected silos.',
        solution:
          'Digital-first data-collection toolbox: validated electronic CRFs (offline-capable), automated ingest of wearable & home-sensor streams, digitised cognitive assessments with device/time-of-day provenance, and a sync/QA layer producing analytics-ready longitudinal records.',
        stack: ['REDCap API or eCRF', 'FHIR R4 observations', 'FastAPI ingest service', 'Secure object store', 'MQTT sensor ingest', 'PostgreSQL'],
        steps: [
          'Define the study data dictionary & visit schedule',
          'Build validated eCRFs and offline-first mobile capture',
          'Ingest wearables/sensors with provenance metadata',
          'Run automated completeness/plausibility QA on every visit',
        ],
        outcome:
          'Clean longitudinal data with high completeness and provenance; large manual-transcription reduction.',
      },
      {
        label: 'Database management & study operations',
        problem:
          'Study data silos, schema drift and weak versioning make audits/IRB inspection and reproducibility painful.',
        solution:
          'Governance-grade research data platform: versioned schemas with a managed data dictionary, strict PII boundary with pseudonymisation and a separate key vault, role-based access, full audit logging, orchestrated pipelines and automated QC flags.',
        stack: ['PostgreSQL', 'Prefect / Airflow', 'HashiCorp Vault', 'dbt', 'Data catalog', 'Audit logging'],
        steps: [
          'Adopt versioned schemas + data dictionary (migration tooling)',
          'Enforce PII boundary & least-privilege access',
          'Orchestrate ETL/QC with operator dashboards',
          'Maintain backups, retention & inspection-ready audit trail',
        ],
        outcome:
          'Inspection-ready, reproducible operations complying with PDPA minimisation and host-institution data-governance policy.',
      },
      {
        label: 'Supporting AI-enabled healthcare research',
        problem:
          'Researchers need validated, explainable models for dementia risk and population stratification — without a reproducible, clinically supervised ML lifecycle.',
        solution:
          'Clinician-in-the-loop AI research stack: modular feature pipelines over EHR + cognitive + wearable data, explainable risk & survival models, population dashboard, and disciplined model cards with external validation, calibration and fairness checks before any translational use.',
        stack: ['Python', 'scikit-learn / XGBoost / lifelines', 'PyTorch (multimodal)', 'SHAP', 'MLflow', 'FastAPI serving', 'Streamlit dashboards'],
        steps: [
          'Define the study cohort & outcome definitions with clinicians',
          'Build a small feature store (EHR, cognitive, wearable)',
          'Train / internally validate risk + time-to-event models',
          'Calibrate, check fairness, document model cards, then model review',
        ],
        outcome:
          'Research-grade risk stratification and population-health dashboards with reproducible results — a defensible path to translational studies.',
      },
    ],
    architecture: [
      { step: 'Recruit & consent', detail: 'Matching engine → multichannel outreach → e-consent (PDPA)' },
      { step: 'Collect', detail: 'eCRF + digitised cognition + wearable/sensor ingest' },
      { step: 'Integrate & govern', detail: 'De-identified longitudinal DB with audit, QC, versioning' },
      { step: 'Analyse', detail: 'Feature store → explainable ML → model cards' },
      { step: 'Share', detail: 'Population dashboards, publications & translational studies' },
    ],
    governance: [
      'PDPA: consent to collect/contact, minimisation, de-identification before analysis',
      'Human Research Ethics / DSRB approval before recruitment and AI deployment in research',
      'Model outputs are research-grade only — no production clinical decision-making without HSA/MOH alignment',
      'Every data access and model decision is logged for audit',
      'Sensitive data stays in approved institutional storage; no PII in code, models or models cards',
    ],
    stackCodes: [
      { code: 'python', label: 'FastAPI · pandas · scikit-learn · lifelines · PyTorch · MLflow · dbt' },
      { code: 'sql', label: 'PostgreSQL · FHIR R4 Observations · REDCap API' },
      { code: 'arch', label: 'React portal · WhatsApp/SMS · MQTT wearables · Prefect · Vault' },
    ],
  },
]

export const JOB_SOLUTIONS_META = {
  title: '🧬 AI Solutions — Implementation Playbooks',
  description:
    'For each curated job, this section maps the role’s requirements and targets to a concrete AI-enabled solution: responsibilities → solutions, tech stack, implementation steps, end-to-end architecture, and compliance guardrails.',
}