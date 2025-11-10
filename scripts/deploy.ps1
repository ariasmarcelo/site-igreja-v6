# Script PowerShell para Deploy em Background
# Uso: .\scripts\deploy.ps1 "mensagem do commit"

param(
    [string]$CommitMessage = "deploy: atualização automática $(Get-Date -Format 'dd/MM/yyyy HH:mm')"
)

$scriptPath = Join-Path $PSScriptRoot "deploy-background.js"
$projectRoot = Split-Path $PSScriptRoot -Parent

Write-Host "🚀 Iniciando deploy em background..." -ForegroundColor Cyan
Write-Host "📁 Diretório: $projectRoot" -ForegroundColor Gray
Write-Host "💬 Commit: $CommitMessage" -ForegroundColor Gray
Write-Host ""

# Iniciar processo em background
$job = Start-Job -ScriptBlock {
    param($scriptPath, $projectRoot, $commitMessage)
    Set-Location $projectRoot
    node $scriptPath $commitMessage
} -ArgumentList $scriptPath, $projectRoot, $CommitMessage

Write-Host "✓ Deploy iniciado em background (Job ID: $($job.Id))" -ForegroundColor Green
Write-Host ""
Write-Host "Comandos úteis:" -ForegroundColor Yellow
Write-Host "  • Ver status:  Get-Job $($job.Id)" -ForegroundColor Gray
Write-Host "  • Ver output:  Receive-Job $($job.Id) -Keep" -ForegroundColor Gray
Write-Host "  • Ver logs:    Get-Content logs\deploy-*.log -Tail 20 -Wait" -ForegroundColor Gray
Write-Host ""
Write-Host "Continue trabalhando normalmente! 🎉" -ForegroundColor Green
