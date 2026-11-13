<!--
  fetch-linkedin-images.bat
  Pull the LinkedIn AI TechStack image library into the app so the Images
  Gallery and the sidebar card load automatically, right from the folder you
  pointed at (or straight from its GitHub repo), with the latest each run.

  Usage:
    fetch-linkedin-images.bat                 # from the local folder
    set SOURCE_DIR=D:\other\path & call fetch-linkedin-images.bat
    set REPO_URL=https://github.com/you/foo.git & call fetch-linkedin-images.bat
    set REPO_BRANCH=main & call fetch-linkedin-images.bat
-->
@echo off
setlocal enabledelayedexpansion

set "SOURCE_DIR=%SOURCE_DIR%D:\WorkSpace\LinkedIn_AI_TechStack_Images"
set "IMG_DIR=..\frontend\public\linkedin_ai_techstack_images"
set "REPO_URL="
set "REPO_BRANCH=main"
set "COMMIT_MSG=chore(img): pull LinkedIn AI TechStack images"
set "SKIP_SUBFOLDERS=0"

where /Q git || (echo ERROR: git is not installed. & exit /b 1)

:: Keep the variable names that the inline PowerShell block expects, then
:: resolve absolute paths.
set "SRC_ABS=%SOURCE_DIR%"
set "IMG_ABS=%IMG_DIR%"

if not exist "%SRC_ABS%" (
  echo ERROR: source folder not found: %SRC_ABS%
  echo Set SOURCE_DIR to the LinkedIn AI TechStack image folder
  echo (or use REPO_URL to pull from git).
  exit /b 1
)

if exist "%IMG_ABS%" rmdir /s /q "%IMG_ABS%"
mkdir "%IMG_ABS%"

:: --- 1. Copy images (rsync preferred, cp -a fallback) -----------------------
echo.

if exist "%IMG_ABS%\.git" (
  echo Updating existing git clone at %IMG_ABS% ...
  git -C "%IMG_ABS%" fetch --all --prune
  git -C "%IMG_ABS%" checkout "%REPO_BRANCH%" 2>nul || git -C "%IMG_ABS%" switch "%REPO_BRANCH%" 2>nul || goto :after_git
  git -C "%IMG_ABS%" reset --hard "origin/%REPO_BRANCH%" 2>nul || goto :after_git
  git -C "%IMG_ABS%" pull --ff-only origin "%REPO_BRANCH%" 2>&1 | tail -3
) else if defined REPO_URL (
  echo Cloning %REPO_URL% into %IMG_ABS% ...
  rmdir /s /q "%IMG_ABS%" 2>nul
  git clone --branch "%REPO_BRANCH%" --depth 1 "%REPO_URL%" "%IMG_ABS%" 2>&1 | tail -4
) else (
  echo Copying images from %SRC_ABS% to %IMG_ABS% ...
  if exist "%IMG_ABS%" rmdir /s /q "%IMG_ABS%"
  mkdir "%IMG_ABS%"
  if exist "%IMG_ABS%\.git" goto :after_git
  :: rsync preferred for large trees; fall back to robocopy/cp -a.
  where /Q rsync >nul 2>nul
  if %errorlevel% equ 0 (
    rsync -a --delete "%SRC_ABS%\*" "%IMG_ABS%\" 2>&1 | tail -6
  ) else (
    robocopy /E /PURGE "%SRC_ABS%" "%IMG_ABS%" 2>nul
  )
)

:after_git
if not exist "%IMG_ABS%" (
  echo ERROR: image folder is empty after fetch: %IMG_ABS%
  exit /b 1
)

:: --- 2. Refresh the file manifest -------------------------------------------
echo.
echo Refreshing file manifest for the LinkedIn image source ...

set "FRONTEND_DIR=%~dp0..\frontend"
set "MANIFEST_SCRIPT=%FRONTEND_DIR%\scripts\generateManifest.js"

if exist "%MANIFEST_SCRIPT%" (
  cd "%FRONTEND_DIR%"
  call node scripts\generateManifest.js 2>&1 | findstr /R "Manifest Images PDFs Documents Total Wrote" || echo (manifest generator ran)
) else (
  echo NOTE: manifest script not found at %MANIFEST_SCRIPT%; manifest not regenerated.
  echo       Run npm run manifest from the frontend folder to refresh src/fileManifest.json.
)

:: --- 3. Summary -------------------------------------------------------------
for /f %%c in ('dir /s /b "%IMG_ABS%\*.jpg" 2>nul ^| find /c /i "%%*"') do set "jpg=!%%c!"
for /f %%c in ('dir /s /b "%IMG_ABS%\*.jpeg" 2>nul ^| find /c /i "%%*"') do set "jpeg=!%%c!"
for /f %%c in ('dir /s /b "%IMG_ABS%\*.png" 2>nul ^| find /c /i "%%*"') do set "png=!%%c!"
for /f %%c in ('dir /s /b "%IMG_ABS%\*.gif" 2>nul ^| find /c /i "%%*"') do set "gif=!%%c!"
for /f %%c in ('dir /s /b "%IMG_ABS%\*.webp" 2>nul ^| find /c /i "%%*"') do set "webp=!%%c!"

set /a IMG_COUNT=%jpg%+%jpeg%+%png%+%gif%+%webp%
echo.
echo Done.
echo   Source : %SRC_ABS%
echo   Images : %IMG_ABS%
echo   Image files copied: %IMG_COUNT%
echo   Manifest refreshed from: %FRONTEND_DIR%\src\fileManifest.json
echo   Serve at: http://localhost:4173/linkedin_ai_techstack_images/
endlocal
