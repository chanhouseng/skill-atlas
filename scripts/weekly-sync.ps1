# Run weekly GitHub discovery and verified-source refresh on this Windows computer.
# Safe: does not execute downloaded SKILL.md, install Skills, or merge new candidates.
$ErrorActionPreference = "Continue"
$project = Split-Path -Parent $PSScriptRoot
Set-Location $project
$logDir = Join-Path $project "logs"
New-Item -ItemType Directory -Force -Path $logDir | Out-Null
$stamp = Get-Date -Format "yyyy-MM-dd_HHmm"
$log = Join-Path $logDir ("weekly-skill-sync_" + $stamp + ".log")
"Skill Atlas weekly sync started: $(Get-Date -Format o)" | Tee-Object -FilePath $log
"Discovering public GitHub candidates..." | Tee-Object -FilePath $log -Append
& node (Join-Path $PSScriptRoot "discover-github.mjs") 2>&1 | Out-String | Tee-Object -FilePath $log -Append
$discoveryExit = $LASTEXITCODE
"Refreshing 117 verified Skill source versions..." | Tee-Object -FilePath $log -Append
& node (Join-Path $PSScriptRoot "sync-github.mjs") 2>&1 | Out-String | Tee-Object -FilePath $log -Append
$syncExit = $LASTEXITCODE
"Finished: $(Get-Date -Format o); discovery exit=$discoveryExit; sync exit=$syncExit" | Tee-Object -FilePath $log -Append
if($discoveryExit -ne 0 -or $syncExit -ne 0){ exit 1 }
exit 0
