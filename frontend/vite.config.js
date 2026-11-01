import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// esbuild's Go runtime OOMs while parsing the very large embedded JS data
// files (booksData ~19MB, githubRepos ~10MB, aiJobsAll ~9MB) when the machine
// has little free RAM. GOMEMLIMIT sets a soft ceiling that makes the Go GC run
// more aggressively so the build completes instead of crashing. Only set it if
// the caller hasn't already (so an explicit override still wins).
if (!process.env.GOMEMLIMIT) process.env.GOMEMLIMIT = '2500MiB'
if (!process.env.GOGC) process.env.GOGC = '40'

const MORTALAPPS_SECTIONS = [
  'learn',
  'system-design',
  'python',
  'agents',
  'infrastructure',
  'quantum-computing',
]

// Preserve the pre-code-splitting URLs for tabs running an older bundle. The
// old loader requests `/assets/mortalapps/<section>.js`; without these aliases
// Vite falls back to index.html, which the browser cannot import as JavaScript.
function legacyMortalAppsChunkAliases() {
  return {
    name: 'legacy-mortalapps-chunk-aliases',
    generateBundle(_options, bundle) {
      for (const section of MORTALAPPS_SECTIONS) {
        const chunk = Object.values(bundle).find(entry => (
          entry.type === 'chunk' &&
          entry.facadeModuleId?.replaceAll('\\\\', '/').endsWith(`/data/mortalapps/${section}.js`)
        ))
        if (!chunk) continue
        this.emitFile({
          type: 'asset',
          fileName: `assets/mortalapps/${section}.js`,
          source: chunk.code,
        })
      }
    },
  }
}

export default defineConfig({
  plugins: [react(), legacyMortalAppsChunkAliases()],
  server: {
    port: 5273,
    strictPort: true,
    proxy: {
      // Node scan-server (frontend/scan-server.js) on 9001: streaming chat,
      // file manifest scan, and GitHub repo persistence.
      '/api/chat': 'http://localhost:9001',
      '/api/files': 'http://localhost:9001',
      '/api/scan-files': 'http://localhost:9001',
      '/api/github': 'http://localhost:9001',
      '/api/health': 'http://localhost:9001',
      '/api/sbd-proxy': 'http://localhost:9001',
      // Python FastAPI backend (backend/main.py) on 9000: everything else
      // (chapters, search, agents, projects, brain, news, generate-project)
      // AND raw file streaming. /api/raw/<slug>/<file> is implemented by
      // BOTH servers, but the FastAPI backend is the one that's guaranteed to
      // be running for the gallery's extra scan sources (e.g. the 1.7 GB
      // LinkedIn_AI_TechStack_Images folder, which exceeds the static-copy
      // cap and therefore uses proxy URLs in the manifest).
      // LinkedIn posts (Python route) MUST be listed before '/api/li', because
      // '/api/linkedin-posts' also starts with the '/api/li' prefix and Vite
      // matches the FIRST config key.
      '/api/linkedin-posts': 'http://localhost:9000',
      // Go accelerator (linkedin-service/main.go) on 9020: 5-year daily-range
      // generator + cached LinkedIn image proxy. Listed BEFORE the generic
      // '/api' catch-all so it wins the prefix match.
      '/api/li': 'http://127.0.0.1:9020',
      '/api/raw': 'http://localhost:9000',
      '/api': 'http://localhost:9000'
    }
  },
  preview: {
    port: 5273,
    strictPort: true,
    proxy: {
      '/api/chat': 'http://localhost:9001',
      '/api/files': 'http://localhost:9001',
      '/api/scan-files': 'http://localhost:9001',
      '/api/github': 'http://localhost:9001',
      '/api/health': 'http://localhost:9001',
      '/api/sbd-proxy': 'http://localhost:9001',
      '/api/linkedin-posts': 'http://localhost:9000',
      '/api/li': 'http://127.0.0.1:9020',
      '/api/raw': 'http://localhost:9000',
      '/api': 'http://localhost:9000'
    }
  }
})
