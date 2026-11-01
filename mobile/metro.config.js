const { getDefaultConfig } = require("expo/metro-config");
const http = require("http");
const { networkInterfaces } = require("os");

const config = getDefaultConfig(__dirname);

// ---------------------------------------------------------------------------
// Dev-only API middleware: forward every `/api/*` request that arrives at the
// Metro server (port 8081) to the FastAPI backend (port 9000).
//
// Why: when the phone loads the app through an Expo **tunnel**
// (https://xxxx.anonymous.exp.direct), ngrok forwards ALL paths to Metro, so
// the phone can reach the backend only THROUGH Metro. This middleware makes
// `https://xxxx.anonymous.exp.direct/api/chapters` work exactly like
// `http://<pc-ip>:9000/api/chapters`. In LAN/localhost modes it's harmless
// (the app calls :9000 directly). Production builds are unaffected.
// ---------------------------------------------------------------------------
function findLanIp() {
  const nets = networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name] || []) {
      if (net.family === "IPv4" && !net.internal) return net.address;
    }
  }
  return "127.0.0.1";
}

config.server = {
  ...config.server,
  // NOTE: must accept and forward `next` — Metro calls this chain with
  // (req, res, next); dropping `next` makes Metro throw
  // "TypeError: next is not a function" and KILLS the dev server.
  enhanceMiddleware: (middleware) => {
    return (req, res, next) => {
      const url = req.url || "";
      // Proxy API calls AND static file URLs (/images/*, /data/*) that the
      // /api/files catalog returns — those live on the frontend dev server.
      if (url.startsWith("/api/") || url.startsWith("/images/") || url.startsWith("/data/")) {
        const host = findLanIp();
        const proxyReq = http.request(
          {
            host,
            port: 9000,
            path: url,
            method: req.method,
            headers: { ...req.headers, host: `${host}:9000` },
          },
          (proxyRes) => {
            res.writeHead(proxyRes.statusCode || 502, proxyRes.headers);
            proxyRes.pipe(res);
          }
        );
        proxyReq.on("error", (err) => {
          res.writeHead(502, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: `API proxy error: ${err.message}` }));
        });
        req.pipe(proxyReq);
        return;
      }
      return middleware(req, res, next);
    };
  },
};

module.exports = config;
