// scripts/launch-preview.js
//
// Reliable Windows-detached launcher for `npm run preview` (Vite 5) on the AI
// Knowledge Hub project. Uses Node's `child_process.spawn({ detached: true,
// windowsHide: true })` plus `child.unref()` — the textbook pattern for fully
// detached processes on Windows that survive the parent shell exiting.
//
// Usage:
//   node scripts/launch-preview.js
//
// Behavior:
//   1. Kills any process currently LISTENING on TCP port 5273 (so a previous
//      detached vite doesn't conflict).
//   2. Spawns `npm.cmd run preview` in `frontend/` with stdio redirected to
//      preview.out / preview.err at the project root.
//   3. Polls port 5273 for up to 30 seconds for it to enter the LISTEN state.
//   4. Writes the actual TCP-listener OwningProcess PID (i.e. the real node.exe
//      running vite, NOT the npm.cmd wrapper) to preview.pid so the user can
//      cleanly Stop-Process it later.
//   5. Exits 0 on success, 1 if the port didn't bind within 30s.
//
// Why Node-spawn-detached and not cmd.exe `start /B` or PowerShell
// `Start-Process -WindowStyle Hidden`?
//   * `start /B` from a PowerShell-launched context in Git Bash was observed
//     to be flaky: some runs bound the port, others timed out silently with
//     preview.err empty. Likely a Job Object / process tree inheritance issue.
//   * `Start-Process` with `-RedirectStandardOutput/Error -WindowStyle Hidden`
//     reliably launches but may not survive parent Job Object teardown.
//   * Node's child_process.spawn({ detached: true }) calls CreateProcess on
//     Windows with explicit flags that detach the child from the parent's
//     Job Object, regardless of PowerShell/Git Bash wrapping. This is the
//     pattern used by docker, npm-windows, and other production tools.

import { spawn, execSync } from 'node:child_process'
import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const root = path.resolve(__dirname, '..')
const frontend = path.join(root, 'frontend')
const outFile = path.join(root, 'preview.out')
const errFile = path.join(root, 'preview.err')
const pidFile = path.join(root, 'preview.pid')
const port = 5273
// `npm run preview` chains `npm run manifest` (scans 1947+ files across nested
// subfolders via os.walk) before vite binds. On cold disks + AV scanning, the
// manifest step alone is observed to take 30-45s, and then vite binds in
// another ~2s. 60s is the empirical ceiling; bump higher via
// LAUNCH_PREVIEW_TIMEOUT env var if needed.
const readyTimeoutSec = Number(process.env.LAUNCH_PREVIEW_TIMEOUT || 60)

function log(...args) {
  console.log('[launch-preview]', ...args)
}

function runPs(cmdline) {
  try {
    return execSync(
      `powershell -NoProfile -Command "${cmdline.replace(/"/g, '\\"')}"`,
      { encoding: 'utf8', timeout: 5000 }
    ).trim()
  } catch {
    return ''
  }
}

async function pollForListen(maxSec) {
  for (let i = 0; i < maxSec; i++) {
    await new Promise((r) => setTimeout(r, 1000))
    const out = runPs(
      `(Get-NetTCPConnection -LocalPort ${port} -State Listen -ErrorAction SilentlyContinue).OwningProcess | Select-Object -First 1 -ExpandProperty OwningProcess`
    )
    if (/^\d+$/.test(out)) return { pid: parseInt(out, 10), elapsed: i + 1 }
  }
  return null
}

async function main() {
  log('=== Phase 1: kill prior listener on port', port, '===')
  runPs(
    `(Get-NetTCPConnection -LocalPort ${port} -State Listen -ErrorAction SilentlyContinue).OwningProcess | ForEach-Object { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue }`
  )
  // Give the kernel a moment to actually release the socket
  await new Promise((r) => setTimeout(r, 500))

  log('=== Phase 2: spawn npm.cmd run preview detached ===')
  try { fs.unlinkSync(outFile) } catch {}
  try { fs.unlinkSync(errFile) } catch {}

  const out = fs.openSync(outFile, 'w')
  const err = fs.openSync(errFile, 'w')

  // Spawn via cmd.exe directly. Node refuses to spawn .cmd/.bat files with
  // detached:true on Windows without going through cmd.exe (throws EINVAL
  // otherwise), and cmd.exe is the PE that needs the DETACHED_PROCESS flag
  // so the npm.cmd -> node.exe tree truly escapes the parent's Job Object.
  const child = spawn(
    'cmd.exe',
    ['/c', 'npm.cmd', 'run', 'preview'],
    {
      cwd: frontend,
      detached: true,
      windowsHide: true,
      stdio: ['ignore', out, err],
    }
  )
  child.on('error', (e) => log('child error:', e?.message ?? String(e)))
  // child.unref() is the second half of detached: it tells Node's event loop
  // not to keep the parent alive waiting for the child. Without this, the
  // launching Node process won't exit cleanly.
  child.unref()
  log(`Spawned detached.  npm.cmd wrapper PID: ${child.pid}`)

  log(`=== Phase 3: poll port ${port} LISTEN for up to ${readyTimeoutSec}s ===`)
  const result = await pollForListen(readyTimeoutSec)

  if (result) {
    fs.writeFileSync(pidFile, String(result.pid))
    log(`READY after ${result.elapsed}s.  Listener PID (node.exe / vite): ${result.pid}`)
    log('preview.out (head):')
    try {
      const txt = fs.readFileSync(outFile, 'utf8')
      const lines = txt.split(/\r?\n/).slice(0, 15).join('\n')
      console.log(lines || '(empty)')
    } catch {
      console.log('(could not read)')
    }
    process.exit(0)
  } else {
    log(`Port ${port} did NOT bind within ${readyTimeoutSec}s.`)
    log('preview.out:')
    try {
      const txt = fs.readFileSync(outFile, 'utf8')
      console.log(txt.split(/\r?\n/).slice(0, 15).join('\n') || '(empty)')
    } catch {}
    log('preview.err:')
    try {
      const txt = fs.readFileSync(errFile, 'utf8')
      console.log(txt.split(/\r?\n/).slice(0, 30).join('\n') || '(empty)')
    } catch {}
    process.exit(1)
  }
}

main().catch((e) => {
  console.error('[launch-preview] FATAL:', e?.stack ?? e)
  process.exit(2)
})
