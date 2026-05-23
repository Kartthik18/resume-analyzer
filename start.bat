@echo off
setlocal

echo =============================================
echo   ResumeAI - AI Resume Analyzer (CMD)
echo =============================================
echo.

set "BACKEND_DIR=%~dp0backend"
set "FRONTEND_DIR=%~dp0frontend"
set "ENV_FILE=%BACKEND_DIR%\.env"

:: ── Check for .env file ───────────────────────────────────
if not exist "%ENV_FILE%" (
    echo [WARNING] backend\.env not found!
    echo.
    echo   Copying .env.example to .env...
    copy "%BACKEND_DIR%\.env.example" "%ENV_FILE%" >nul
    echo   Done. Please edit backend\.env and set your GEMINI_API_KEY.
    echo   Get a free key at: https://aistudio.google.com/app/apikey
    echo.
    pause
)

:: ── Check for node_modules ────────────────────────────────
if not exist "%BACKEND_DIR%\node_modules" (
    echo [INFO] Installing backend dependencies...
    cd "%BACKEND_DIR%"
    call npm install
    cd "%~dp0"
    echo [OK] Backend dependencies installed.
)

if not exist "%FRONTEND_DIR%\node_modules" (
    echo [INFO] Installing frontend dependencies...
    cd "%FRONTEND_DIR%"
    call npm install
    cd "%~dp0"
    echo [OK] Frontend dependencies installed.
)

:: ── Launch Servers in New Windows ─────────────────────────
echo.
echo [1/2] Starting Backend (Express on port 5000)...
start "Backend Server" cmd /k "color 0B && echo --- BACKEND --- && cd "%BACKEND_DIR%" && npm run dev"

:: Give backend a moment to start
timeout /t 2 /nobreak >nul

echo [2/2] Starting Frontend (Vite on port 5173)...
start "Frontend Server" cmd /k "color 0D && echo --- FRONTEND --- && cd "%FRONTEND_DIR%" && npm run dev"

echo.
echo =============================================
echo   Both servers are launching!
echo.
echo   Backend  -^>  http://localhost:5000
echo   Frontend -^>  http://localhost:5173
echo.
echo   Opening http://localhost:5173 in your browser...
echo =============================================
echo.

:: Auto-open the browser after a short delay
timeout /t 4 /nobreak >nul
start http://localhost:5173
