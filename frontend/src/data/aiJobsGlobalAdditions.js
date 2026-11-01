// Curated additions to the generated AI Jobs Global catalog.
// Kept separate so future data refreshes do not overwrite manually added roles.
export const AI_JOBS_GLOBAL_ADDITIONS = [
  {
    company: 'Intellia / Confidential Multinational Client',
    role: 'Security & Governance Engineer — MCP and Agent Platforms',
    country: 'Global',
    region: 'Global',
    location: 'Global / Remote',
    level: 'Senior',
    salary: 'Not disclosed',
    source: 'jd',
    tags: [
      'MCP Security',
      'AI Governance',
      'OAuth 2.0',
      'JWT',
      'OIDC',
      'SigV4',
      'TLS 1.3',
      'AWS AgentCore',
      'Threat Modeling',
      'LLM Security',
      'VPC / PrivateLink',
      'AI Testing'
    ],
    description: 'We are looking for a Security & Governance Engineer focused on securing MCP-based enterprise AI platforms and agent ecosystems. You will design and enforce controls for MCP servers, agent-to-tool communication, identity and access management, and governance mechanisms that enable safe and compliant operation of AI agents at scale. You will work closely with platform, AI, cloud, compliance, and governance teams so agentic systems operate within defined security boundaries and remain auditable.',
    projectOverview: 'The customer is a multinational corporation with more than a century of history, offices in more than 180 countries, 700+ applications, and a goal to introduce Reduced-Risk Products to more than 1 billion consumers. Intellia is engineering a comprehensive software ecosystem for an innovative IoT and consumer experience platform across eCommerce, Digital Marketing, and IoT. The Core Architecture Team owns a Digital Engineering Enterprise Platform that provides reusable SDLC services, technologies, operating practices, compliance controls, and secure delivery patterns to engineering teams.',
    responsibilities: [
      'Design and enforce authentication, authorization, and trust-boundary controls for MCP server deployments, tool descriptors, and agent interactions.',
      'Define secure agent-to-tool communication using OAuth 2.0, JWT, OIDC, SigV4, and TLS 1.3.',
      'Conduct threat modeling and security reviews for agentic AI systems, MCP integrations, and LLM-powered workflows.',
      'Identify and mitigate prompt injection, excessive agency, unauthorized tool execution, sensitive-data exposure, and tool-parameter exfiltration risks.',
      'Establish data classification and protection controls for MCP tool payloads and agent communication channels.',
      'Design network isolation and private connectivity using VPC, PrivateLink, private networking, and cloud-native security controls.',
      'Develop governance frameworks, security guardrails, and policy enforcement mechanisms for enterprise AI platforms.',
      'Ensure agents follow approved MCP Hub routing and access patterns instead of bypassing established security controls.',
      'Support IAM architecture and access-management workflows for agent-to-tool authentication and authorization.',
      'Define onboarding, lifecycle, operational, and audit standards for MCP servers.',
      'Participate in incident investigations, security assessments, risk reviews, and remediation activities.',
      'Contribute to security architecture decisions for AgentCore Gateway, Registry, and enterprise AI infrastructure.'
    ],
    qualifications: [
      '4+ years of application security or cloud security engineering experience.',
      'Hands-on MCP server security experience, including authentication design, authorization enforcement, or security reviews.',
      'Identity and access-management experience with OAuth, JWT, and OIDC for agent-to-tool workflows.',
      'Working knowledge of OWASP Top 10 for LLMs, excessive agency, prompt injection, and tool-parameter exfiltration.',
      'Experience defining data classification and protection controls for AI payloads.',
      'Experience designing network isolation with VPC, PrivateLink, and private cloud connectivity.'
    ],
    niceToHave: [
      'AWS AgentCore Gateway or Registry security review experience.',
      'AWS WAF, Security Hub, and Macie experience.',
      'Enterprise AI platform governance experience.',
      'Experience enforcing MCP Hub routing so agents cannot call MCP servers directly.',
      'Experience with security automation, policy-as-code, and cloud-native compliance evidence.'
    ],
    whatYoullUse: [
      'MCP servers and tool registries',
      'AgentCore Gateway and Registry',
      'OAuth 2.0 / OIDC / JWT',
      'AWS SigV4 and TLS 1.3',
      'AWS IAM, WAF, Security Hub, Macie',
      'VPC, PrivateLink, private networking',
      'Threat modeling and policy-as-code',
      'Security logs, audit trails, and compliance evidence'
    ],
    testingFocus: [
      'Contract-test MCP tool descriptors, schemas, authentication flows, and authorization decisions.',
      'Run negative tests for expired tokens, invalid signatures, wrong audiences, replay attempts, and cross-tenant access.',
      'Red-team prompt injection, excessive-agency, indirect-injection, sensitive-data, and tool-parameter-exfiltration scenarios.',
      'Verify that agents are blocked when they bypass the approved MCP Hub or request an unapproved tool.',
      'Test TLS 1.3 enforcement, private-network reachability, VPC boundaries, and least-privilege IAM policies.',
      'Build regression tests that preserve security guardrails as models, tools, policies, and routing rules change.',
      'Validate audit completeness: actor, agent, tool, payload classification, policy decision, correlation ID, and outcome.'
    ],
    designPatterns: [
      { name: 'MCP Trust Boundary', tech: 'MCP Registry, signed descriptors, schema validation', usecase: 'Treat tool metadata and tool results as untrusted until identity, provenance, schema, and policy checks succeed.' },
      { name: 'Policy Enforcement Gateway', tech: 'AgentCore Gateway, OAuth/OIDC, IAM', usecase: 'Force every agent-to-tool call through one auditable gateway instead of allowing direct server access.' },
      { name: 'Security Regression Harness', tech: 'Python, pytest, OWASP LLM test cases', usecase: 'Replay authorization, injection, data-loss, and routing-bypass cases on every policy or model change.' }
    ],
    archFlow: ['Agent', 'MCP Hub / Gateway', 'Identity + Policy', 'Approved MCP Server', 'Tool', 'Audit Trail'],
    meta: {
      Team: 'Core Architecture Team / Digital Engineering Enterprise Platform',
      Division: 'Enterprise AI Security and Governance',
      Experience: '4+ years application or cloud security engineering'
    },
    url: ''
  },
  {
    company: 'Medbill',
    role: 'Senior Software Engineer — AI HealthTech SaaS',
    country: 'Australia',
    region: 'Asia-Pacific',
    location: 'Brisbane, Australia — Hybrid',
    level: 'Senior',
    salary: 'Not disclosed',
    source: 'jd',
    tags: [
      'TypeScript',
      'Node.js',
      'AWS',
      'AWS CDK',
      'React',
      'PostgreSQL',
      'Healthcare SaaS',
      'AI Automation',
      'Claude Code',
      'Codex',
      'Gemini CLI',
      'AI Testing'
    ],
    description: 'Medbill is looking for a hands-on Senior Software Engineer to join its growing health-tech engineering team. This role focuses on building and scaling a modern healthcare SaaS platform and applying AI to medical operations in ways that genuinely help people, automate complex workflows, partner with humans in operational decisions, and reduce traditionally manual effort.',
    projectOverview: 'You will work on real-world healthcare operations where AI is evaluated as part of the business process, not only as a developer productivity tool. The team works directly with operational users to test and refine new approaches quickly, while maintaining the security, reliability, and usability expected of a well-established Services company.',
    responsibilities: [
      'Design and deliver significant product features end-to-end.',
      'Build secure, scalable software using TypeScript and Node.js.',
      'Help shape AWS architecture and the technical direction of the platform.',
      'Identify opportunities to apply AI and automation to real healthcare workflows.',
      'Work directly with operational users to test, measure, and refine new approaches.',
      'Mentor other engineers and help raise engineering capability.',
      'Use modern AI development tools such as Claude Code, Codex, and Gemini CLI.',
      'Balance automation with human review, auditability, privacy, and safe operational decision-making.'
    ],
    qualifications: [
      '6+ years of commercial software engineering experience.',
      'Strong TypeScript, Node.js, and AWS experience.',
      'Experience owning technical decisions and delivering complex software.',
      'Genuine interest in applying AI to difficult, real-world problems.',
      'Strong communication and mentoring skills.',
      'Authorized to work in Australia.',
      '6+ years of Software Development experience.'
    ],
    niceToHave: [
      'React experience.',
      'PostgreSQL experience.',
      'AWS CDK experience.',
      'Healthcare or health-tech experience.',
      'Experience testing AI-assisted workflows with operational users.',
      'Experience with privacy-aware handling of sensitive healthcare data.'
    ],
    whatYoullUse: [
      'TypeScript and Node.js',
      'AWS and AWS CDK',
      'React',
      'PostgreSQL',
      'Claude Code, Codex, and Gemini CLI',
      'Healthcare SaaS APIs and workflow services',
      'Automated tests, CI/CD, observability, and secure delivery practices'
    ],
    testingFocus: [
      'Write unit, integration, and end-to-end tests for healthcare workflow features.',
      'Test AI automation with representative, ambiguous, incomplete, and failure-prone operational inputs.',
      'Verify human approval and escalation paths before an AI-assisted decision creates a real business side effect.',
      'Add regression tests for prompt, model, workflow, and business-rule changes.',
      'Validate access control, audit trails, privacy boundaries, and safe handling of healthcare information.',
      'Run performance and resilience tests for Node.js services, AWS integrations, and PostgreSQL workloads.',
      'Test new AI approaches with operational users and capture measurable accuracy, time-saving, and failure outcomes.'
    ],
    designPatterns: [
      { name: 'Human-in-the-Loop Automation', tech: 'Node.js, workflow services, approval queue', usecase: 'Let AI prepare or recommend an action while a qualified person reviews high-impact or uncertain cases.' },
      { name: 'AI Evaluation Gate', tech: 'TypeScript tests, fixtures, regression datasets', usecase: 'Compare AI workflow quality, safety, latency, and operational outcomes before releasing a change.' },
      { name: 'Secure HealthTech Service', tech: 'AWS, CDK, PostgreSQL, audit logging', usecase: 'Keep identity, data access, persistence, and traceability explicit in every healthcare workflow.' }
    ],
    archFlow: ['Operational User', 'Node.js API', 'Policy + Validation', 'AI Workflow', 'Human Review', 'PostgreSQL / Audit Log'],
    meta: {
      Team: 'HealthTech Engineering',
      Division: 'Healthcare SaaS / AI Operations',
      Experience: '6+ years software development',
      Location: 'Brisbane — Hybrid'
    },
    url: ''
  },
  {
    company: 'IAG (Insurance Australia Group)',
    role: 'AI Systems Engineer — Claims',
    country: 'Australia',
    region: 'Oceania',
    location: 'Sydney, Melbourne, or Brisbane — Hybrid / Permanent Full-time',
    level: 'Mid-Senior',
    salary: 'Not disclosed',
    source: 'jd',
    tags: [
      'AI Systems Engineering',
      'Claims AI',
      'Insurance Technology',
      'AI Platforms',
      'AI Governance',
      'AI Controls',
      'AI Monitoring',
      'AI Evaluation',
      'Production AI',
      'Testing',
      'Responsible AI',
      'Australia'
    ],
    description: 'IAG is the largest general insurance group in Australia and New Zealand. As an AI Systems Engineer, you will help transform Claims through modern AI technology by designing, building, testing, deploying, and supporting reliable and responsible AI solutions that move beyond experimentation into real-world production use.',
    projectOverview: 'The Claims team is building intelligent systems that support insurance business outcomes while maintaining controls, monitoring, governance, operational readiness, and maintainability. The role works with squad members, product owners, and subject matter experts to evaluate solutions, improve them continuously, and deliver meaningful customer and operational impact. This is a permanent full-time opportunity based in Gadigal Country (Darling Park 2, Sydney), Naarm (Melbourne), or Meanjin (Brisbane).',
    responsibilities: [
      'Build, test, and deploy AI solutions and components that support Claims and insurance business outcomes.',
      'Implement AI controls, monitoring, and governance frameworks for responsible and effective operation.',
      'Collaborate with squad members, product owners, and subject matter experts to design and improve solutions.',
      'Conduct evaluations, analyse results, and contribute to continuous improvement of AI systems.',
      'Support production readiness, operational management, and ongoing maintenance of AI platforms.',
      'Document technical decisions, configurations, and outcomes to support quality and maintainability.'
    ],
    qualifications: [
      'Experience in software engineering, AI engineering, or a related technical field.',
      'Hands-on experience building and deploying AI solutions in practical environments.',
      'Understanding of AI platforms, integrations, testing, and modern engineering practices.',
      'Knowledge of AI governance, controls, monitoring, or production support practices.',
      'Strong problem-solving skills and a collaborative approach.',
      'Curiosity, adaptability, and a desire to learn in a fast-evolving AI environment.'
    ],
    niceToHave: [
      'Experience with insurance, Claims, or other regulated operational workflows.',
      'Experience with AI evaluation frameworks and quality metrics.',
      'Experience with production monitoring, incident response, and platform maintenance.',
      'Experience documenting technical decisions and governance evidence.',
      'Experience working with multidisciplinary squads and subject matter experts.'
    ],
    whatYoullUse: [
      'AI solution and platform integrations',
      'Evaluation and testing frameworks',
      'AI controls and governance processes',
      'Monitoring, operational support, and production readiness practices',
      'Technical documentation and decision records',
      'Claims and insurance business workflows',
      'Modern software engineering and deployment practices'
    ],
    testingFocus: [
      'Test AI components against representative Claims workflows, edge cases, and incomplete inputs.',
      'Evaluate accuracy, reliability, consistency, safety, and operational usefulness before release.',
      'Create regression tests for prompts, models, integrations, business rules, and controls.',
      'Validate monitoring alerts, control thresholds, audit evidence, and production-readiness checks.',
      'Test failure handling, human escalation, degraded-mode behavior, and recovery procedures.',
      'Analyse evaluation results with subject matter experts and feed findings into continuous improvement.',
      'Verify that AI behavior remains responsible, explainable enough for the workflow, and maintainable after deployment.'
    ],
    benefits: [
      '13% boosted superannuation as standard.',
      '20 days annual leave plus 5 days MyLeave.',
      'Up to 50% off personal home and motor insurance.',
      'Partner discounts on private health insurance, technology, appliances, and more.',
      '20 weeks paid parental leave.',
      'LinkedIn Learning, IAG Academy, study assistance, and secondment opportunities.'
    ],
    designPatterns: [
      { name: 'Responsible Claims AI', tech: 'AI controls, monitoring, governance', usecase: 'Move AI from experiment to production with explicit quality, safety, accountability, and operational controls.' },
      { name: 'Evaluation-Driven Delivery', tech: 'Test datasets, evaluation metrics, SME review', usecase: 'Use measurable evaluation results and Claims expertise to decide whether an AI change is ready.' },
      { name: 'Production Readiness Gate', tech: 'Monitoring, alerts, runbooks, decision records', usecase: 'Require observability, support procedures, documentation, and recovery plans before launch.' }
    ],
    archFlow: ['Claims Workflow', 'AI Service', 'Controls + Evaluation', 'Human / SME Review', 'Production Platform', 'Monitoring + Support'],
    meta: {
      Team: 'Claims AI Systems Engineering',
      Division: 'Insurance Australia Group',
      Experience: 'Software engineering, AI engineering, or related technical field',
      Location: 'Sydney, Melbourne, or Brisbane — Hybrid',
      'Applications Close': 'Saturday 12 September 2026, 11:59PM AEST'
    },
    applicationClose: 'Saturday 12 September 2026, 11:59PM AEST',
    supportContact: 'recruitment@iag.com.au',
    companyProfile: 'IAG helps make the world a safer place for everyday Australians and New Zealanders. The organisation promotes connection, belonging, inclusion, and meaningful impact, including collaboration on Indigenous-led solutions.',
    url: ''
  },
  {
    company: 'IAG (Insurance Australia Group)',
    role: 'AI Product Lead — Claims Transformation',
    country: 'Australia',
    region: 'Oceania',
    location: 'Sydney, Melbourne, or Brisbane — Hybrid / Permanent Full-time',
    level: 'Lead',
    salary: 'Not disclosed',
    source: 'jd',
    tags: [
      'AI Product Leadership',
      'Claims AI',
      'Insurance Technology',
      'AI Transformation',
      'Product Delivery',
      'Cross-functional Leadership',
      'AI Engineering',
      'AI Evaluation',
      'Stakeholder Management',
      'Agile Delivery',
      'Regulated Industry',
      'Australia'
    ],
    description: 'IAG is the largest general insurance group in Australia and New Zealand. As an AI Product Lead, you will lead a cross-functional squad delivering practical AI solutions that improve Claims operations, enhance customer outcomes, and turn opportunities into measurable business value.',
    projectOverview: 'The Claims team is at the centre of a major AI transformation. This role works directly with Claims leaders, subject matter experts, and technology teams to identify real business challenges, shape AI solutions, and guide initiatives from discovery through implementation. You will operate at the intersection of business and technology, combining hands-on AI experience with leadership capability to deliver outcomes in a complex organisation. This is a permanent full-time role based in Gadigal Country (Darling Park 2, Sydney), Naarm (Melbourne), or Meanjin (Brisbane).',
    responsibilities: [
      'Lead a cross-functional squad delivering AI initiatives that create measurable business value and improve customer outcomes.',
      'Own priorities, scope, and delivery outcomes so initiatives move effectively from discovery through implementation.',
      'Work with business stakeholders and subject matter experts to identify opportunities, shape AI solutions, and guide delivery.',
      'Guide engineers and technology teams with technical leadership and support throughout the delivery lifecycle.',
      'Coordinate squad resources, manage risks and dependencies, and maintain transparency on progress and outcomes.',
      'Foster a collaborative, high-performing team environment that supports continuous improvement and agile ways of working.'
    ],
    qualifications: [
      'Experience delivering AI solutions into production and achieving measurable business outcomes.',
      'Strong understanding of AI development, engineering practices, and solution delivery.',
      'Ability to lead diverse teams and influence stakeholders across complex organisations.',
      'Experience managing large-scale technology programs or transformation initiatives.',
      'Confidence working through ambiguity, balancing competing priorities, and solving complex challenges.',
      'Experience in insurance, banking, consulting, or another regulated industry is welcome but not essential.'
    ],
    niceToHave: [
      'Experience leading Claims, insurance, or customer-operations transformation.',
      'Experience translating operational problems into measurable AI product outcomes.',
      'Experience working with AI evaluations, adoption metrics, and responsible delivery controls.',
      'Experience coaching engineers and creating a high-performing agile squad.',
      'Experience with production AI governance, monitoring, and continuous improvement.'
    ],
    whatYoullUse: [
      'AI product discovery and delivery methods',
      'Claims and insurance operating processes',
      'Cross-functional squad planning and agile delivery',
      'AI solution evaluation and business-value metrics',
      'Engineering, platform, and production-readiness practices',
      'Stakeholder mapping, risk management, and dependency tracking',
      'Technical decision records and delivery roadmaps'
    ],
    testingFocus: [
      'Define acceptance criteria that connect AI quality to Claims and customer outcomes.',
      'Coordinate business, subject-matter, engineering, and user-acceptance testing before production release.',
      'Evaluate accuracy, reliability, safety, adoption, time savings, and operational impact.',
      'Ensure edge cases, ambiguous inputs, human escalation, and degraded-mode behavior are tested.',
      'Track regression results when models, prompts, integrations, workflows, or business priorities change.',
      'Validate monitoring, governance controls, operational runbooks, and production-readiness evidence.',
      'Use evaluation findings and stakeholder feedback to prioritise the next delivery iteration.'
    ],
    benefits: [
      '13% boosted superannuation as standard.',
      '20 days annual leave plus 5 days MyLeave.',
      'Up to 50% off personal home and motor insurance.',
      'Partner discounts on private health insurance, technology, appliances, and more.',
      '20 weeks paid parental leave.',
      'LinkedIn Learning, IAG Academy, study assistance, and secondment opportunities.'
    ],
    designPatterns: [
      { name: 'Outcome-Driven AI Product Delivery', tech: 'Discovery, outcome metrics, roadmap', usecase: 'Prioritise AI initiatives by measurable Claims and customer value rather than novelty or model capability alone.' },
      { name: 'Cross-functional AI Squad', tech: 'Product, engineering, Claims SMEs, agile delivery', usecase: 'Bring business, domain, and technology expertise together to shorten feedback loops and improve adoption.' },
      { name: 'Evaluation-to-Iteration Loop', tech: 'Acceptance tests, telemetry, user feedback', usecase: 'Use evidence from testing and production outcomes to continuously improve the AI solution.' }
    ],
    archFlow: ['Claims Opportunity', 'Product Discovery', 'AI Solution', 'Squad Delivery', 'Business Evaluation', 'Production Outcome'],
    meta: {
      Team: 'Claims AI Product Squad',
      Division: 'Insurance Australia Group',
      Experience: 'AI solution delivery and large-scale technology transformation',
      Location: 'Sydney, Melbourne, or Brisbane — Hybrid',
      'Applications Close': 'Saturday 12 September 2026, 11:59PM AEST'
    },
    applicationClose: 'Saturday 12 September 2026, 11:59PM AEST',
    supportContact: 'recruitment@iag.com.au',
    companyProfile: 'IAG helps make the world a safer place for everyday Australians and New Zealanders. The organisation promotes connection, belonging, inclusion, and meaningful impact, including collaboration on Indigenous-led solutions.',
    url: ''
  }
]
