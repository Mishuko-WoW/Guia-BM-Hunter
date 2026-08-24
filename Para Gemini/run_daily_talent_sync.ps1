$ErrorActionPreference = "Stop"

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$logDir = Join-Path $repoRoot "logs"
$logFile = Join-Path $logDir "daily-talent-sync.log"
$pythonExe = "C:\Users\W11\AppData\Local\Programs\Python\Python310\python.exe"

if (-not (Test-Path $logDir)) {
  New-Item -ItemType Directory -Path $logDir | Out-Null
}

$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
Add-Content -Path $logFile -Value "[$timestamp] Inicio sync diario"

Push-Location $repoRoot
try {
  & $pythonExe ".\scripts\extract_talent_strings.py" *>> $logFile
  $exitCode = $LASTEXITCODE
  $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
  Add-Content -Path $logFile -Value "[$timestamp] Fin sync diario (exit=$exitCode)"
  exit $exitCode
}
catch {
  $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
  Add-Content -Path $logFile -Value "[$timestamp] Error: $($_.Exception.Message)"
  throw
}
finally {
  Pop-Location
}
