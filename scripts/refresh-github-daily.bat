@echo off
setlocal
cd /d "%~dp0.."
set "PROJECT_ROOT=%CD%"
set "FRONTEND=%PROJECT_ROOT%\frontend"
set "CRAWLER=C:\Users\Legion\Desktop\github_crawler"
set "CSV_SOURCE=%CRAWLER%\github_repos.csv"
set "LOCK_FILE=%PROJECT_ROOT%\frontend\github-refresh.lock"

if exist "C:\Users\Legion\AppData\Local\hermes\hermes-agent\venv\Scripts\python.exe" (
  set "PYTHON=C:\Users\Legion\AppData\Local\hermes\hermes-agent\venv\Scripts\python.exe"
) else (
  set "PYTHON=python"
)

if exist "%LOCK_FILE%" (
  echo A GitHub refresh is already running. Exiting.
  exit /b 2
)
echo %DATE% %TIME%> "%LOCK_FILE%"

if not exist "%CRAWLER%\github_repo_crawler.py" (
  del /q "%LOCK_FILE%" 2>nul
  echo Missing crawler directory: %CRAWLER%
  exit /b 1
)

cd /d "%CRAWLER%"
if exist ".token_clean.txt" set /p GITHUB_TOKEN=<.token_clean.txt
"%PYTHON%" github_repo_crawler.py >> "%PROJECT_ROOT%\frontend\github-refresh.log" 2>&1
if errorlevel 1 (
  echo External GitHub crawler failed. See %PROJECT_ROOT%\frontend\github-refresh.log
  del /q "%LOCK_FILE%" 2>nul
  exit /b 1
)

if not exist "%CSV_SOURCE%" (
  echo Missing crawler CSV: %CSV_SOURCE%
  del /q "%LOCK_FILE%" 2>nul
  exit /b 1
)

cd /d "%FRONTEND%"
set "GITHUB_REPOS_CSV=%CSV_SOURCE%"
node scripts/refreshGithubRepos.mjs >> "%CD%\github-refresh.log" 2>&1
if errorlevel 1 (
  echo App GitHub refresh failed. See %CD%\github-refresh.log
  del /q "%LOCK_FILE%" 2>nul
  exit /b 1
)

del /q "%LOCK_FILE%" 2>nul
echo GitHub crawler and app refresh completed.
endlocal
