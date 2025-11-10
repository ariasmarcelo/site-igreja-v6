# Deploy Sincrono (mostra progresso no terminal)
# Diferenca do deployAutomatico: este BLOQUEIA o terminal ate terminar
# Ambos geram o MESMO arquivo de log

param(
    [Parameter(Position=0)]
    [string]$Message = "deploy: atualizacao $(Get-Date -Format 'dd/MM/yyyy HH:mm')"
)

$ErrorActionPreference = "Stop"
$projectRoot = Split-Path -Parent $PSScriptRoot
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$logDir = Join-Path $projectRoot "logs"
$logFile = Join-Path $logDir "deploy-$timestamp.log"

Set-Location $projectRoot

# Criar diretorio de logs se nao existir
if (!(Test-Path $logDir)) {
    New-Item -ItemType Directory -Path $logDir -Force | Out-Null
}

# Funcao para logar E mostrar no terminal
function Write-DeployLog {
    param([string]$msg)
    $ts = Get-Date -Format 'HHmmss'
    "[$ts] $msg" | Out-File $logFile -Append
    Write-Host $msg
}

# Limpar logs antigos - manter apenas os ultimos 10
$oldLogs = Get-ChildItem "$logDir\deploy-*.log" -ErrorAction SilentlyContinue | 
            Sort-Object LastWriteTime -Descending | 
            Select-Object -Skip 10
if ($oldLogs) {
    $oldLogs | Remove-Item -Force
    Write-Host "[CLEANUP] Removidos $($oldLogs.Count) logs antigos" -ForegroundColor Gray
}

# Iniciar log
"========================================" | Out-File $logFile
Write-DeployLog "DEPLOY INICIADO"
Write-DeployLog "Mensagem: $Message"
"========================================" | Out-File $logFile -Append

Write-Host "`n[DEPLOY SINCRONO] Iniciando deploy..." -ForegroundColor Cyan
Write-Host "[INFO] Log: $logFile" -ForegroundColor Gray

try {
    Write-DeployLog ""
    Write-DeployLog "[1/4] Build..."
    pnpm build 2>&1 | Out-File $logFile -Append
    Write-DeployLog "[OK] Build concluido!"
    
    Write-DeployLog ""
    Write-DeployLog "[2/4] Git add..."
    git add . 2>&1 | Out-File $logFile -Append
    Write-DeployLog "[OK] Git add concluido!"
    
    Write-DeployLog ""
    Write-DeployLog "[3/4] Git commit..."
    git commit -m $Message 2>&1 | Out-File $logFile -Append
    Write-DeployLog "[OK] Git commit concluido!"
    
    Write-DeployLog ""
    Write-DeployLog "[4/4] Git push..."
    git push 2>&1 | Out-File $logFile -Append
    Write-DeployLog "[OK] Git push concluido!"
    
    Write-DeployLog ""
    "========================================" | Out-File $logFile -Append
    Write-DeployLog "[SUCCESS] Deploy concluido com sucesso!"
    Write-DeployLog "Finalizado: $(Get-Date -Format 'yyyyMMdd HHmmss')"
    "========================================" | Out-File $logFile -Append
    
    Write-Host "`n[INFO] Site disponivel em: https://ariasmarcelo.github.io/site-igreja-v5/" -ForegroundColor Cyan
    
} catch {
    Write-DeployLog ""
    "========================================" | Out-File $logFile -Append
    Write-DeployLog "[ERRO] Deploy falhou: $_"
    "========================================" | Out-File $logFile -Append
    exit 1
}
