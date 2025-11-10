# Deploy em Background com Log
# Uso: .\scripts\deploy-bg-v2.ps1 "mensagem do commit"

param(
    [Parameter(Position=0)]
    [string]$Message = "deploy: atualizacao $(Get-Date -Format 'dd/MM/yyyy HH:mm')"
)

$projectRoot = Split-Path -Parent $PSScriptRoot
$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$logDir = Join-Path $projectRoot "logs"
$logFile = Join-Path $logDir "deploy-$timestamp.log"

# Garantir que o diretorio de logs existe
if (!(Test-Path $logDir)) {
    New-Item -ItemType Directory -Path $logDir -Force | Out-Null
}

Write-Host "`n[DEPLOY BG] Iniciando deploy em background..." -ForegroundColor Cyan
Write-Host "[INFO] Mensagem: $Message" -ForegroundColor Gray
Write-Host "[INFO] Log: $logFile" -ForegroundColor Gray
Write-Host ""

# Iniciar deploy em background e redirecionar output para log
$scriptBlock = {
    param($root, $msg, $log)
    
    Set-Location $root
    $ErrorActionPreference = "Continue"
    
    # Limpar logs antigos
    $oldLogs = Get-ChildItem "$root\logs\deploy-*.log" -ErrorAction SilentlyContinue | 
                Sort-Object LastWriteTime -Descending | 
                Select-Object -Skip 10
    if ($oldLogs) {
        $oldLogs | Remove-Item -Force
    }
    
    # Executar deploy
    "========================================" | Out-File $log
    "DEPLOY INICIADO: $(Get-Date -Format 'dd/MM/yyyy HH:mm:ss')" | Out-File $log -Append
    "Mensagem: $msg" | Out-File $log -Append
    "========================================`n" | Out-File $log -Append
    
    try {
        "[1/4] Build..." | Out-File $log -Append
        pnpm build 2>&1 | Out-File $log -Append
        "[OK] Build concluido!`n" | Out-File $log -Append
        
        "[2/4] Git add..." | Out-File $log -Append
        git add . 2>&1 | Out-File $log -Append
        "[OK] Git add concluido!`n" | Out-File $log -Append
        
        "[3/4] Git commit..." | Out-File $log -Append
        git commit -m $msg 2>&1 | Out-File $log -Append
        "[OK] Git commit concluido!`n" | Out-File $log -Append
        
        "[4/4] Git push..." | Out-File $log -Append
        git push 2>&1 | Out-File $log -Append
        "[OK] Git push concluido!`n" | Out-File $log -Append
        
        "========================================" | Out-File $log -Append
        "[SUCCESS] Deploy concluido com sucesso!" | Out-File $log -Append
        "Finalizado: $(Get-Date -Format 'dd/MM/yyyy HH:mm:ss')" | Out-File $log -Append
        "========================================" | Out-File $log -Append
        
    } catch {
        "========================================" | Out-File $log -Append
        "[ERRO] Deploy falhou: $_" | Out-File $log -Append
        "========================================" | Out-File $log -Append
        exit 1
    }
}

# Iniciar job em background
$job = Start-Job -ScriptBlock $scriptBlock -ArgumentList $projectRoot, $Message, $logFile

Write-Host "[OK] Deploy iniciado em background! (Job ID: $($job.Id))" -ForegroundColor Green
Write-Host ""
Write-Host "Comandos uteis:" -ForegroundColor Yellow
Write-Host "  Ver progresso:  Get-Content '$logFile' -Tail 20 -Wait" -ForegroundColor Gray
Write-Host "  Ver log final:  Get-Content '$logFile'" -ForegroundColor Gray
Write-Host "  Status job:     Get-Job $($job.Id)" -ForegroundColor Gray
Write-Host ""
Write-Host "Continue trabalhando normalmente!" -ForegroundColor Green
Write-Host ""
