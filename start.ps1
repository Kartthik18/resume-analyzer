# ============================================================
#  ResumeAI — Startup Script
#  Launches backend (Express) and frontend (Vite) together
# ============================================================

$rootDir = $PSScriptRoot
$backendDir = Join-Path $rootDir "backend"
$frontendDir = Join-Path $rootDir "frontend"
$envFile = Join-Path $backendDir ".env"

Write-Host ""
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "  ResumeAI - AI Resume Analyzer" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""

# ── Check for .env file ───────────────────────────────────
if (-Not (Test-Path $envFile)) {
    Write-Host "[WARNING] backend/.env not found!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "  Copying .env.example to .env..." -ForegroundColor Yellow
    Copy-Item (Join-Path $backendDir ".env.example") $envFile
    Write-Host "  Done. Please edit backend/.env and set your GEMINI_API_KEY." -ForegroundColor Red
    Write-Host "  Get a free key at: https://aistudio.google.com/app/apikey" -ForegroundColor Cyan
    Write-Host ""
    Read-Host "  Press Enter to continue anyway (or Ctrl+C to exit and edit .env first)"
}

# ── Check for node_modules ────────────────────────────────
$backendModules = Join-Path $backendDir "node_modules"
$frontendModules = Join-Path $frontendDir "node_modules"

if (-Not (Test-Path $backendModules)) {
    Write-Host "[INFO] Installing backend dependencies..." -ForegroundColor Yellow
    Push-Location $backendDir
    npm install
    Pop-Location
    Write-Host "[OK] Backend dependencies installed." -ForegroundColor Green
}

if (-Not (Test-Path $frontendModules)) {
    Write-Host "[INFO] Installing frontend dependencies..." -ForegroundColor Yellow
    Push-Location $frontendDir
    npm install
    Pop-Location
    Write-Host "[OK] Frontend dependencies installed." -ForegroundColor Green
}

# ── Launch Backend ────────────────────────────────────────
Write-Host ""
Write-Host "[1/2] Starting Backend (Express on port 5000)..." -ForegroundColor Green
Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command",
    "Write-Host '--- BACKEND ---' -ForegroundColor Cyan; Set-Location '$backendDir'; npm run dev"
)

# Give backend a moment to start
Start-Sleep -Seconds 2

# ── Launch Frontend ───────────────────────────────────────
Write-Host "[2/2] Starting Frontend (Vite on port 5173)..." -ForegroundColor Green
Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command",
    "Write-Host '--- FRONTEND ---' -ForegroundColor Magenta; Set-Location '$frontendDir'; npm run dev"
)

Write-Host ""
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "  Both servers are launching!" -ForegroundColor Green
Write-Host ""
Write-Host "  Backend  ->  http://localhost:5000" -ForegroundColor Yellow
Write-Host "  Frontend ->  http://localhost:5173" -ForegroundColor Yellow
Write-Host ""
Write-Host "  Open http://localhost:5173 in your browser." -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""

# Auto-open the browser after a short delay
Start-Sleep -Seconds 4
Start-Process "http://localhost:5173"
