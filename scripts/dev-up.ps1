param(
  [switch]$Open,
  [int]$VitePort = 5173,
  [int]$ServerPort = 4000,
  [switch]$FrontendOnly,
  [switch]$BackendOnly
)

Write-Host "[dev-up] Starting Blue Upgrade Technology dev environment (PowerShell)" -ForegroundColor Cyan

$ErrorActionPreference = 'Continue'

$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$ServerDir = Join-Path $Root 'server'
$FrontendDir = $Root

function Log($msg) { Write-Host "[dev-up] $msg" }
function Warn($msg) { Write-Warning $msg }
function Err($msg) { Write-Error $msg }

if (-not (Get-Command node -ErrorAction SilentlyContinue)) { Err "Node.js not found. Please install Node 20+" }
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) { Err "npm not found. Please install Node 20+ (includes npm)." }

# Resolve npm executable path explicitly to avoid Win32 application errors
$npmCmdCmd = (Get-Command npm.cmd -ErrorAction SilentlyContinue)
if ($npmCmdCmd) {
  $NpmPath = $npmCmdCmd.Source
} else {
  $npmCmd = (Get-Command npm -ErrorAction SilentlyContinue)
  if ($npmCmd) {
    $npmDir = Split-Path -Parent $npmCmd.Source
    $maybeCmd = Join-Path $npmDir 'npm.cmd'
    if (Test-Path $maybeCmd) { $NpmPath = $maybeCmd } else { $NpmPath = 'npm.cmd' }
  } else {
    $NpmPath = 'npm.cmd'
  }
}

# Ensure env templates
$ServerEnvExample = Join-Path $ServerDir '.env.example'
if (-not (Test-Path $ServerEnvExample)) {
  @"
# Copy to .env and fill with your Influx Cloud values
# INFLUX_URL=https://eu-central-1-1.aws.cloud2.influxdata.com
# INFLUX_TOKEN=***
# INFLUX_ORG=ed3d2d5f9c4dd72d
# INFLUX_BUCKET=my_data
"@ | Set-Content -Encoding UTF8 $ServerEnvExample
  Log "Created server/.env.example"
}

$FrontendEnvLocal = Join-Path $FrontendDir '.env.local'
if (-not (Test-Path $FrontendEnvLocal)) {
  "VITE_API_BASE_URL=http://localhost:$ServerPort" | Set-Content -Encoding UTF8 $FrontendEnvLocal
  Log "Created .env.local with VITE_API_BASE_URL=http://localhost:$ServerPort"
}

# Install deps
try { Log "Installing frontend deps..."; Push-Location $FrontendDir; npm install | Out-Host } catch { Warn "Frontend install had issues; continuing." } finally { Pop-Location }
try { Log "Installing backend deps..."; Push-Location $ServerDir; npm install | Out-Host } catch { Warn "Backend install had issues; continuing." } finally { Pop-Location }

$backendProc = $null
$frontendProc = $null

if (-not $FrontendOnly) {
  Log "Starting backend on port $ServerPort..."
  Push-Location $ServerDir
  $env:PORT = "$ServerPort"
  $backendProc = Start-Process -FilePath $NpmPath -ArgumentList "run","dev" -NoNewWindow -PassThru
  Pop-Location
  Log "Backend PID: $($backendProc.Id)"

  # Health check
  try {
    for ($i=0; $i -lt 60; $i++) {
      try {
        $resp = Invoke-WebRequest -UseBasicParsing -Uri "http://localhost:$ServerPort/health" -TimeoutSec 2
        if ($resp.StatusCode -ge 200 -and $resp.StatusCode -lt 300) { Log "Backend is healthy."; break }
      } catch { Start-Sleep -Seconds 1 }
    }
  } catch { Warn "Backend health check skipped." }
}

if (-not $BackendOnly) {
  Log "Starting frontend (Vite) on port $VitePort..."
  Push-Location $FrontendDir
  # Note: Vite may not honor PORT env; default 5173 is fine.
  $frontendProc = Start-Process -FilePath $NpmPath -ArgumentList "run","dev" -NoNewWindow -PassThru
  Pop-Location
  Log "Frontend PID: $($frontendProc.Id)"

  if ($Open) {
    Start-Process "http://localhost:$VitePort" | Out-Null
  }
}

Register-EngineEvent PowerShell.Exiting -Action {
  try { if ($frontendProc -and -not $frontendProc.HasExited) { $frontendProc.Kill() } } catch {}
  try { if ($backendProc -and -not $backendProc.HasExited) { $backendProc.Kill() } } catch {}
} | Out-Null

# Wait on processes (whichever are running)
if ($frontendProc -and $backendProc) {
  Wait-Process -Id $frontendProc.Id,$backendProc.Id
} elseif ($frontendProc) {
  Wait-Process -Id $frontendProc.Id
} elseif ($backendProc) {
  Wait-Process -Id $backendProc.Id
} else {
  Warn "Nothing started (check flags)."
}
