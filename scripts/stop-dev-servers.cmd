@echo off
REM Stops the AI Knowledge Hub dev servers (backend, scan-server, vite, expo, linkedin-service)
for %%p in (9000 9001 5273 8081 9020) do (
  for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":%%p .*LISTENING"') do taskkill /PID %%a /F >nul 2>&1
)
echo All dev servers stopped.
pause
