#!/usr/bin/env node
/**
 * export_catalogs.cjs — converts the web app's frontend/src/data modules into
 * plain JSON files under backend/data_catalog/ so the FastAPI backend can serve
 * them to the mobile app at /api/catalog/*.
 *
 * Uses esbuild (from frontend/node_modules) to properly parse ESM, then a
 * tiny ESM shim to capture named + default exports at runtime.
 *
 * Usage:  node backend/scripts/export_catalogs.cjs
 * Output: one {key}.json + {key}.meta.json per catalog.
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..", "..");
const SRC = path.join(ROOT, "frontend", "src", "data");
const OUT = path.join(ROOT, "backend", "data_catalog");
const esbuild = require(path.join(ROOT, "frontend", "node_modules", "esbuild"));

if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

// key -> { file, prefer: [export names in priority order], title, icon, desc }
const CATALOGS = {
  books: { file: "booksData.js", prefer: ["BOOKS", "default"], title: "Book Catalog", icon: "📚", desc: "75,000+ books across 131 categories" },
  books_categories: { file: "booksData.js", prefer: ["BOOK_CATEGORIES"], title: "Book Categories", icon: "🗂️", desc: "131 book categories" },
  github: { file: "githubRepos.js", prefer: ["GITHUB_REPOS", "default"], title: "GitHub Repos", icon: "📦", desc: "20,000+ curated AI & dev repositories" },
  github_categories: { file: "githubRepos.js", prefer: ["REPO_CATEGORIES"], title: "GitHub Repo Categories", icon: "🗃️", desc: "Categories of curated repositories" },
  tools: { file: "aiToolsCatalog.js", prefer: ["AI_TOOLS", "TOOLS", "default"], title: "AI Tools Catalog", icon: "🤖", desc: "850+ AI tools by category" },
  tool_details: { file: "aiToolsDetails.js", prefer: ["AI_TOOL_DETAILS", "default"], title: "AI Tool Details", icon: "🧰", desc: "Deep info per AI tool" },
  open_alternatives: { file: "openAlternatives.js", prefer: ["OA_CATEGORIES", "OPEN_ALTERNATIVES", "default"], title: "Open Alternatives", icon: "🔓", desc: "Open-source alternatives to paid tools" },
  agents: { file: "aiAgentsData.js", prefer: ["AI_AGENTS_DATA", "AI_AGENTS", "default"], title: "AI Agents Global", icon: "🧠", desc: "375k+ agents, frameworks & platforms" },
  agents_directory: { file: "aiAgentsDirectoryData.js", prefer: ["AGENTIC_PLATFORMS", "DIRECTORY", "default"], title: "AI Agents Directory", icon: "🧭", desc: "Agentic platforms directory" },
  chatbots: { file: "aiChatbotsData.js", prefer: ["AI_CHATBOTS", "default"], title: "AI Chatbots Global", icon: "💬", desc: "1,100+ chatbots by industry" },
  ai_stack: { file: "aiTechStackData.js", prefer: ["TECHSTACK_MODULES", "default"], title: "AI Stack Reference", icon: "🧱", desc: "68-module full-stack AI reference" },
  playbook: { file: "playbookData.js", prefer: ["PLAYBOOK_DOCS", "PLAYBOOK_NAV", "PLAYBOOK", "default"], title: "AI Engineering Playbook", icon: "📖", desc: "70-chapter engineering playbook" },
  rapid_fire: { file: "rapidFireData.js", prefer: ["RAPID_FIRE_MARKDOWN", "RAPID_FIRE", "default"], title: "Rapid Fire Playbook", icon: "⚡", desc: "Fast-fire interview & concept drills" },
  tech_lessons: { file: "allTechnologiesLessons.js", prefer: ["ALL_TECHNOLOGY_LESSONS", "default"], title: "Technologies & Tutorials", icon: "🛠️", desc: "1000+ technology lessons" },
  python_tutorials: { file: "pythonTutorialsData.js", prefer: ["TUTORIALS", "PYTHON_TUTORIALS", "default"], title: "Python Tutorials", icon: "🐍", desc: "56 structured Python tutorials" },
  python_masterhub: { file: "pythonMasterHubData.js", prefer: ["MASTER_HUB_SECTIONS", "default"], title: "Python MasterHub", icon: "🎓", desc: "885-topic Python mastery hub" },
  python_topics: { file: "pythonTopicsEnhanced.js", prefer: ["PYTHON_TOPICS", "TOPICS", "default"], title: "Python Topics+", icon: "📘", desc: "Enhanced Python topic content" },
  python_tech: { file: "pythonTechnologiesData.js", prefer: ["PYTHON_TECHNOLOGIES", "default"], title: "Python Tech Hub", icon: "📦", desc: "Python ecosystem technologies" },
  reference_library: { file: "referenceLibraryData.js", prefer: ["REFERENCE_DOCUMENTS", "REFERENCE_LIBRARY", "default"], title: "Reference Library", icon: "📎", desc: "Curated external references" },
  resources: { file: "aiMlResourcesData.js", prefer: ["AI_ML_RESOURCES", "default"], title: "AI/ML Resources", icon: "🧪", desc: "Courses, papers & learning paths" },
  industry_matrix: { file: "aiIndustryMatrix.js", prefer: ["INDUSTRY_MATRIX", "default"], title: "Industry Matrix", icon: "🏭", desc: "AI adoption by industry" },
  integrations: { file: "webIntegrationsCatalog.js", prefer: ["INTEGRATION_CATEGORIES", "default"], title: "Web Integrations", icon: "🔌", desc: "Integration catalog" },
  knowledge_table: { file: "knowledgeTable.js", prefer: ["KNOWLEDGE_SECTIONS", "default"], title: "Knowledge Base", icon: "📐", desc: "Structured knowledge tables" },
  ccaf: { file: "ccafData.js", prefer: ["CCAF", "CCAF_DATA", "default"], title: "Claude Cert (CCAF)", icon: "📜", desc: "Claude certification curriculum" },
  topic_content: { file: "topicContent.js", prefer: ["TOPIC_CONTENT", "default"], title: "Topic Content", icon: "📝", desc: "Long-form topic lessons" },
  deep_dive_sections: { file: "deepDiveSections.js", prefer: ["DEEP_DIVE_SECTIONS", "default"], title: "Deep Dive Sections", icon: "🌊", desc: "Deep-dive chapter content" },
  chapter_sections: { file: "chapterSections.js", prefer: ["CHAPTER_SECTIONS", "default"], title: "Chapter Sections", icon: "📑", desc: "Rich chapter content" },
  ml_fundamentals: { file: "mlFundamentalsRich.js", prefer: ["ML_FUNDAMENTALS", "default"], title: "ML Fundamentals", icon: "🔬", desc: "Rich ML fundamentals content" },
  use_cases: { file: "useCaseCodes.js", prefer: ["USE_CASE_CODES", "default"], title: "Use Case Codes", icon: "💡", desc: "Real-world code use cases" },
  mortalapps: { file: "mortalapps_content.json", prefer: [], title: "MortalApps Hub", icon: "🗄️", desc: "System design, infra & quantum guides" },
  snowflake: { file: "snowflakeData.js", all: true, prefer: [], title: "Snowflake Guide", icon: "❄️", desc: "Videos, certs, blogs & learning path" },
  etl: { file: "etlData.js", all: true, prefer: [], title: "ETL & Data Eng Guide", icon: "📊", desc: "Market, salaries, tools & learning path" },
  comm_channels: { file: "communicationChannelsData.js", prefer: ["CHANNELS"], title: "Communication Channels", icon: "📡", desc: "120+ comm channels by category" },
  study_by_doing: { file: "studyByDoingData.js", prefer: ["SBD_SECTIONS"], title: "Study By Doing", icon: "🎯", desc: "AI course map — learn by building" },
  ai_blogs: { file: "aiTechBlogsDemandData.js", all: true, prefer: [], title: "AI Blogs & Demand", icon: "🌐", desc: "Blog sources, demand matrix & roadmap" },
  learning_catalog: { file: "learningCatalogData.js", prefer: ["LEARNING_CATALOGS"], title: "Learning Hub Catalogs", icon: "🎓", desc: "1,200+ learning paths & prep" },
  jobs_full: { file: "aiEngineerJobsFull.js", prefer: ["AI_JOBS_FULL"], title: "AI Jobs Global", icon: "🌍", desc: "2,585+ AI engineering jobs by country" },
};

// Bundle with esbuild as ESM, then eval with a minimal export-capturing shim.
function loadModuleESM(file) {
  const entry = path.join(SRC, file);
  const result = esbuild.buildSync({
    entryPoints: [entry],
    bundle: true,
    format: "esm",
    platform: "browser",
    write: false,
    logLevel: "silent",
    define: { "process.env.NODE_ENV": '"production"' },
  });
  let code = result.outputFiles[0].text;
  // Replace ESM export statements with assignments our shim understands.
  code = code.replace(/^\s*export\s*\{[^}]*\}\s*;?\s*$/gm, (m) => {
    const inner = m.match(/\{([^}]*)\}/)[1];
    return inner
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean)
      .map((p) => {
        const [local, exported] = p.split(/\s+as\s+/).map((s) => s.trim());
        return `__exports[${JSON.stringify(exported || local)}] = ${local};`;
      })
      .join("\n");
  });
  const sandbox = { console, __exports: {}, JSON, Math, Date };
  vm_run(code, sandbox);
  return sandbox.__exports;
}

function vm_run(code, sandbox) {
  const vm = require("vm");
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox, { filename: "bundle.js" });
}

function pickExport(exports, prefer) {
  for (const n of [...(prefer || []), ...Object.keys(exports), "default"]) {
    if (exports[n] !== undefined) return exports[n];
  }
  const def = exports.default;
  if (def !== undefined) return def;
  return undefined;
}

function countOf(data) {
  if (Array.isArray(data)) return data.length;
  if (data && typeof data === "object") {
    let sum = 0, sawArray = false;
    for (const v of Object.values(data)) {
      if (Array.isArray(v)) { sawArray = true; sum += v.length; }
    }
    if (sawArray) return sum;
    return Object.keys(data).length;
  }
  return 0;
}

let ok = 0, fail = 0;
for (const [key, cfg] of Object.entries(CATALOGS)) {
  try {
    const exports = loadModuleESM(cfg.file);
    let data;
    if (cfg.all) {
      // Capture the whole module namespace (skip functions/undefined).
      data = {};
      for (const [k, v] of Object.entries(exports)) {
        if (typeof v !== "function" && v !== undefined) data[k] = v;
      }
    } else {
      data = pickExport(exports, cfg.prefer);
    }
    if (data === undefined) {
      const keys = Object.keys(exports).slice(0, 8).join(", ");
      throw new Error(`no export found (available: ${keys})`);
    }
    // Unwrap React-era helper wrappers if present
    if (data && typeof data === "object" && !Array.isArray(data) && typeof data.then !== "function") {
      // keep as-is; object catalogs stay objects
    }
    const meta = {
      key,
      title: cfg.title,
      icon: cfg.icon,
      desc: cfg.desc,
      count: countOf(data),
      type: Array.isArray(data) ? "list" : "object",
      exportedAt: new Date().toISOString(),
    };
    fs.writeFileSync(path.join(OUT, `${key}.meta.json`), JSON.stringify(meta, null, 1));
    const tmp = path.join(OUT, `${key}.json.tmp`);
    fs.writeFileSync(tmp, JSON.stringify({ key, ...meta, data }));
    fs.renameSync(tmp, path.join(OUT, `${key}.json`));
    ok++;
    console.log(`✓ ${key.padEnd(22)} ${String(meta.count).padStart(6)} items  (${cfg.file})`);
  } catch (e) {
    fail++;
    console.error(`✗ ${key}: ${String(e.message).slice(0, 120)}`);
  }
}
console.log(`\nDone: ${ok} ok, ${fail} failed → ${OUT}`);
