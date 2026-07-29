# Launches `npm run preview` (Vite 5) for the AI Knowledge Hub frontend as a
# fully-detached background process bound to TCP port 5273.
#
# Detach strategy: write a tiny .cmd wrapper that does shell redirection, then
# invoke it via `cmd.exe /c start "" /B <wrapper>.cmd`. Windows' `start` command
# creates a new process tree that is NOT attached to the parent PowerShell's
# Job Object, so the spawned vite/node survives the parent shell exiting.
#
# PID strategy: ignore the wrapper PID. Poll `Get-NetTCPConnection -LocalPort
# 5273 -State Listen` and write the actual OwningProcess (node.exe / vite) to
# preview.pid. That PID is the one to use for clean shutdown later.
#
# Usage:
#   powershell -NoProfile -File D:\...\scripts\start-preview.ps1
#   powershell -NoProfile -File D:\...\scripts\start-preview.ps1 -ProjectRoot C:\other\path
#
# Exit codes:
#   0  port 5273 bound within 15s
#   1  port did not bind within 15s (or another fatal error)

[CmdletBinding()]
param(
    [string]$ProjectRoot = 'D:\WorkSpace\Claude_Code\AI_Stuff_Data\AI_Knowledge_Hub_React'
)

$ErrorActionPreference = 'Continue'
$root      = $ProjectRoot
$frontend  = Join-Path $root 'frontend'
$outFile   = Join-Path $root 'preview.out'
$errFile   = Join-Path $root 'preview.err'
$pidFile   = Join-Path $root 'preview.pid'
$wrapFile  = Join-Path $root '_launch-preview.cmd'

if (-not (Test-Path $frontend)) {
    Write-Host "[start-preview] FATAL: frontend dir not found at $frontend" -ForegroundColor Red
    exit 1
}

# 1. Kill anything currently listening on port 5273 (native .NET call, no netstat parsing)
$existing = Get-NetTCPConnection -LocalPort 5273 -State Listen -ErrorAction SilentlyContinue
foreach ($conn in $existing) {
    $procId = $conn.OwningProcess
    Write-Host "[start-preview] Killing prior PID $procId on port 5273"
    try { Stop-Process -Id $procId -Force -ErrorAction SilentlyContinue } catch {}
}

# 2. Clear stale log/PID files and the prior wrapper script
Remove-Item -Force $outFile, $errFile, $pidFile, $wrapFile -ErrorAction SilentlyContinue -Confirm:$false

# 3. Write a tiny CMD wrapper that captures stdout/stderr via shell redirection
@"
@echo off
cd /d "$frontend"
npm.cmd run preview > "$outFile" 2> "$errFile"
"@ | Set-Content -Path $wrapFile -Encoding ascii

# 4. Launch detached via cmd.exe `start /B`. The empty "" is CMD's title
#    placeholder and is required by `start`. /B = no new window.
$argList = '/c', 'start', '""', '/B', $wrapFile
Start-Process -FilePath 'cmd.exe' -ArgumentList $argList -WindowStyle Hidden | Out-Null
Write-Host "[start-preview] Launched detached via start /B (wrapper: $wrapFile)"

# 5. Poll up to 30s for port 5273 to enter LISTEN.
# `npm run preview` chains `npm run manifest` (scans ~1947 files) before
# `vite preview`, so on slow disks the manifest step alone can take 8-15s.
# 30s gives comfortable headroom without making health-checks hang forever.
$readyWaitSeconds = 30
$ready = $false
$listenerPid = $null
$elapsed = 0
for ($i = 0; $i -lt $readyWaitSeconds; $i++) {
    Start-Sleep -Seconds 1
    $elapsed = $i + 1
    $conn = Get-NetTCPConnection -LocalPort 5273 -State Listen -ErrorAction SilentlyContinue
    if ($conn) {
        $ready = $true
        $listenerPid = ($conn.OwningProcess | Select-Object -First 1)
        break
    }
}

if ($ready) {
    Set-Content -Path $pidFile -Value $listenerPid -Encoding utf8
    Write-Host "[start-preview] READY after ${elapsed}s. Listener PID: $listenerPid"
    Write-Host "[start-preview] preview.out:"
    if (Test-Path $outFile) {
        Get-Content $outFile -TotalCount 15 -ErrorAction SilentlyContinue
    }
    # Clean up the wrapper script so the project root stays tidy across restarts.
    Remove-Item -Force $wrapFile -ErrorAction SilentlyContinue -Confirm:$false
    exit 0
} else {
    Write-Host "[start-preview] Port 5273 did NOT bind within ${readyWaitSeconds}s" -ForegroundColor Red
    Write-Host "[start-preview] preview.err:"
    if (Test-Path $errFile) {
        Get-Content $errFile -TotalCount 30 -ErrorAction SilentlyContinue
    }
    # Leave the wrapper script on disk on failure so the user can inspect it.
    exit 1
}
