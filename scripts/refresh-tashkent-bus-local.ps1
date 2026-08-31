param(
  [switch]$SkipInstall,
  [switch]$SkipShapes,
  [switch]$SkipValidation,
  [string]$OutputDirectory = ""
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Invoke-NativeChecked {
  param(
    [Parameter(Mandatory = $true)][string]$FilePath,
    [Parameter(Mandatory = $false)][string[]]$Arguments = @()
  )

  Write-Host "`n> $FilePath $($Arguments -join ' ')" -ForegroundColor Cyan
  & $FilePath @Arguments
  if ($LASTEXITCODE -ne 0) {
    throw "$FilePath exited with code $LASTEXITCODE"
  }
}

$RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$Stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
if ([string]::IsNullOrWhiteSpace($OutputDirectory)) {
  $OutputDirectory = Join-Path $env:TEMP "geo-catalog-tashkent-bus-$Stamp"
}
$OutputDirectory = [System.IO.Path]::GetFullPath($OutputDirectory)
New-Item -ItemType Directory -Force -Path $OutputDirectory | Out-Null

Push-Location $RepoRoot
try {
  Write-Host "Repository: $RepoRoot" -ForegroundColor Green
  Write-Host "Report dir: $OutputDirectory" -ForegroundColor Green

  Invoke-NativeChecked 'node' @('--version')
  Invoke-NativeChecked 'npm' @('--version')

  $CurrentBranch = (& git branch --show-current).Trim()
  if ($LASTEXITCODE -ne 0) { throw 'Unable to determine current git branch.' }
  Write-Host "Git branch: $CurrentBranch"
  if ($CurrentBranch -ne 'data/tashkent-local-areas-2026-08-30') {
    Write-Warning "Expected data/tashkent-local-areas-2026-08-30. The script will continue on '$CurrentBranch' and will NOT checkout, commit or push anything."
  }

  if (-not $SkipInstall) {
    Invoke-NativeChecked 'npm' @('install', '--ignore-scripts')
  }

  Write-Host "`n=== 1/4: Refresh OSM route discovery + stop topology ===" -ForegroundColor Yellow
  Invoke-NativeChecked 'node' @('.\scripts\refresh-tashkent-bus-osm.js')

  if (-not $SkipShapes) {
    Write-Host "`n=== 2/4: Refresh route geometry ===" -ForegroundColor Yellow
    Write-Host 'This is the slow step and may take several minutes because Overpass can rate-limit requests.'
    Invoke-NativeChecked 'node' @('.\scripts\refresh-tashkent-bus-shapes.js')
  }
  else {
    Write-Host "`n=== 2/4: Route geometry refresh skipped ===" -ForegroundColor DarkYellow
  }

  Write-Host "`n=== 3/4: Export exact gap report ===" -ForegroundColor Yellow
  $AuditLog = Join-Path $OutputDirectory 'tashkent-bus-audit.log'
  & npm run audit:transport 2>&1 | Tee-Object -FilePath $AuditLog
  if ($LASTEXITCODE -ne 0) { throw "npm run audit:transport exited with code $LASTEXITCODE" }
  Invoke-NativeChecked 'node' @('.\scripts\export-tashkent-bus-gaps.js', $OutputDirectory)

  if (-not $SkipValidation) {
    Write-Host "`n=== 4/4: Validate local snapshot ===" -ForegroundColor Yellow
    Invoke-NativeChecked 'npm' @('test')
    Invoke-NativeChecked 'npm' @('run', 'validate')
    Invoke-NativeChecked 'npm' @('run', 'audit:lexicon')
  }
  else {
    Write-Host "`n=== 4/4: Validation skipped ===" -ForegroundColor DarkYellow
  }

  Write-Host "`n=== Generated transport files changed locally ===" -ForegroundColor Yellow
  & git status --short -- src/transport/generated
  if ($LASTEXITCODE -ne 0) { throw 'git status failed.' }

  Write-Host "`nDONE" -ForegroundColor Green
  Write-Host "Gap reports are here: $OutputDirectory" -ForegroundColor Green
  Write-Host '  tashkent-bus-gaps.txt   - readable complete gap lists'
  Write-Host '  tashkent-bus-gaps.csv   - one row per incomplete route'
  Write-Host '  tashkent-bus-gaps.json  - full machine-readable report'
  Write-Host '  tashkent-bus-audit.log  - raw audit output'
  Write-Host "`nNothing was committed or pushed. Review git diff before committing generated data." -ForegroundColor Cyan
}
finally {
  Pop-Location
}
