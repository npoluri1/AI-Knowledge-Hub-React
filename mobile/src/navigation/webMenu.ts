/**
 * webMenu.ts — 1:1 mirror of the web app's sidebar menu
 * (frontend/src/components/Layout.jsx MENU array).
 *
 * Same entries, same order, same counts. Each entry maps to a native
 * destination: a catalog key (generic reader), a named screen, or an
 * unavailable marker (custom web-only visualizations).
 */
export type MenuDest =
  | { kind: "catalog"; key: string }
  | { kind: "screen"; screen: string }
  | { kind: "chapter"; id: string }
  | { kind: "web-only" };

export type WebMenuItem = {
  label: string;
  icon: string;
  count?: string;
  dest: MenuDest;
};

export const WEB_MENU: WebMenuItem[] = [
  { label: "Home", icon: "🏠", dest: { kind: "screen", screen: "home" } },
  { label: "Images Gallery", icon: "🖼️", dest: { kind: "screen", screen: "files" } },
  { label: "File Reference", icon: "📂", dest: { kind: "screen", screen: "files" } },
  { label: "Knowledge Base", icon: "📐", dest: { kind: "catalog", key: "knowledge_table" } },
  { label: "AI Jobs", icon: "💼", count: "996", dest: { kind: "screen", screen: "jobs" } },
  { label: "Edureka AI Docs", icon: "📚", dest: { kind: "screen", screen: "edureka" } },
  { label: "AI News Dashboard", icon: "📡", dest: { kind: "screen", screen: "news" } },
  { label: "Live News Fetcher", icon: "🔴", dest: { kind: "screen", screen: "news" } },
  { label: "AI Tools Catalog", icon: "🤖", dest: { kind: "catalog", key: "tools" } },
  { label: "GitHub Repos", icon: "📦", dest: { kind: "catalog", key: "github" } },
  { label: "delphitools", icon: "🛠️", dest: { kind: "web-only" } },
  { label: "Open Alternatives", icon: "🔓", dest: { kind: "catalog", key: "open_alternatives" } },
  { label: "Integrations", icon: "🔌", dest: { kind: "catalog", key: "integrations" } },
  { label: "Book Catalog", icon: "📚", count: "75,800", dest: { kind: "catalog", key: "books" } },
  { label: "AI Engineering Playbook", icon: "📖", count: "70", dest: { kind: "catalog", key: "playbook" } },
  { label: "Rapid Fire Playbook", icon: "⚡", dest: { kind: "catalog", key: "rapid_fire" } },
  { label: "AI Stack", icon: "🧠", count: "68", dest: { kind: "catalog", key: "ai_stack" } },
  { label: "Claude Certification", icon: "📜", dest: { kind: "catalog", key: "ccaf" } },
  { label: "Snowflake Guide", icon: "❄️", dest: { kind: "catalog", key: "snowflake" } },
  { label: "ETL & Data Eng Guide", icon: "📊", dest: { kind: "catalog", key: "etl" } },
  { label: "AI Jobs Global", icon: "🌍", count: "2,585+", dest: { kind: "catalog", key: "jobs_full" } },
  { label: "All Projects", icon: "🗂️", dest: { kind: "screen", screen: "projects" } },
  { label: "AI LinkedIn Posts", icon: "🔗", dest: { kind: "screen", screen: "linkedin" } },
  { label: "AI Video Hub", icon: "🎬", count: "YouTube · IG · TikTok · FB", dest: { kind: "screen", screen: "videohub" } },
  { label: "AI Design Space", icon: "🏗️", count: "1,258", dest: { kind: "web-only" } },
  { label: "AI Prep · Learning Hub", icon: "🎓", count: "1,200+", dest: { kind: "catalog", key: "learning_catalog" } },
  { label: "Python MasterHub", icon: "🐍", count: "885", dest: { kind: "catalog", key: "python_masterhub" } },
  { label: "AI TechStack Reference", icon: "🏗️", dest: { kind: "catalog", key: "ai_stack" } },
  { label: "Reference Library", icon: "📖", dest: { kind: "catalog", key: "reference_library" } },
  { label: "AI Blogs & Market Demand", icon: "🌐", dest: { kind: "catalog", key: "ai_blogs" } },
  { label: "AI-Python HTML Guides", icon: "📘", count: "43", dest: { kind: "catalog", key: "python_masterhub" } },
  { label: "AI Chatbots Global", icon: "🤖", count: "1,100+", dest: { kind: "catalog", key: "chatbots" } },
  { label: "AI Agents Global", icon: "🧠", count: "375,000+", dest: { kind: "catalog", key: "agents" } },
  { label: "Communication Channels", icon: "📡", count: "120+", dest: { kind: "catalog", key: "comm_channels" } },
  { label: "Technologies & Tutorials", icon: "📚", count: "1000+", dest: { kind: "catalog", key: "tech_lessons" } },
  { label: "Python Tutorials", icon: "🐍", count: "56", dest: { kind: "catalog", key: "python_tutorials" } },
  { label: "Python Tech Hub", icon: "📦", dest: { kind: "catalog", key: "python_tech" } },
  { label: "Trading Guides", icon: "📈", dest: { kind: "screen", screen: "trading" } },
  { label: "Neem Karoli Baba Wisdom", icon: "🙏", dest: { kind: "web-only" } },
  { label: "Study By Doing — AI Course Map", icon: "🎯", dest: { kind: "catalog", key: "study_by_doing" } },
  { label: "MortalApps Hub", icon: "📚", dest: { kind: "catalog", key: "mortalapps" } },
];
