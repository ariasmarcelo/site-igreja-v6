# Deploy Simplificado
# Este script sempre roda em background automaticamente

param(
    [Parameter(Position=0)]
    [string]$Message = "deploy: atualizacao $(Get-Date -Format 'dd/MM/yyyy HH:mm')"
)

$ErrorActionPreference = "Stop"
$projectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $projectRoot

# Limpar logs antigos - manter apenas os ultimos 10
$logDir = Join-Path $projectRoot "logs"
if (Test-Path $logDir) {
    $oldLogs = Get-ChildItem "$logDir\deploy-*.log" -ErrorAction SilentlyContinue | 
                Sort-Object LastWriteTime -Descending | 
                Select-Object -Skip 10
    if ($oldLogs) {
        $oldLogs | Remove-Item -Force
        Write-Host "[CLEANUP] Removidos $($oldLogs.Count) logs antigos" -ForegroundColor Gray
    }
}

Write-Host "`n[DEPLOY] Iniciando deploy automatico..." -ForegroundColor Cyan
Write-Host "[INFO] Mensagem: $Message" -ForegroundColor Gray
Write-Host "[INFO] Logs em: $logDir" -ForegroundColor Gray

try {
    Write-Host "`n[1/4] Build..." -ForegroundColor Yellow
    pnpm build | Out-Null
    Write-Host "[OK] Build concluido!" -ForegroundColor Green
    
    Write-Host "`n[2/4] Git add..." -ForegroundColor Yellow
    git add .
    Write-Host "[OK] Arquivos adicionados!" -ForegroundColor Green
    
    Write-Host "`n[3/4] Git commit..." -ForegroundColor Yellow
    git commit -m $Message
    Write-Host "[OK] Commit realizado!" -ForegroundColor Green
    
    Write-Host "`n[4/4] Git push..." -ForegroundColor Yellow
    git push
    Write-Host "[OK] Push concluido!" -ForegroundColor Green
    
    Write-Host "`n[SUCCESS] Deploy realizado com sucesso!" -ForegroundColor Green
    Write-Host "[INFO] Site disponivel em: https://ariasmarcelo.github.io/site-igreja-v5/" -ForegroundColor Cyan
    
} catch {
    Write-Host "`n[ERRO] Deploy falhou: $_" -ForegroundColor Red
    exit 1
}
