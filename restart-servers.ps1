# restart-servers.ps1
# Script para derrubar e reiniciar servidores de desenvolvimento
# Uso: .\restart-servers.ps1

Write-Host "=== Reiniciando Servidores de Desenvolvimento ===" -ForegroundColor Cyan
Write-Host ""

# Função para matar processo em uma porta específica
function Stop-ProcessOnPort {
    param (
        [int]$Port,
        [string]$Name
    )
    
    Write-Host "[$Name] Verificando porta $Port..." -ForegroundColor Yellow
    
    $process = netstat -ano | findstr ":$Port" | Select-Object -First 1
    
    if ($process) {
        $processId = ($process -split '\s+')[-1]
        Write-Host "  Processo encontrado (PID: $processId)" -ForegroundColor DarkYellow
        
        try {
            taskkill /PID $processId /F 2>$null | Out-Null
            Write-Host "  OK Processo encerrado" -ForegroundColor Green
            Start-Sleep -Seconds 1
        } catch {
            Write-Host "  ERRO Falha ao encerrar processo" -ForegroundColor Red
        }
    } else {
        Write-Host "  Nenhum processo rodando nesta porta" -ForegroundColor DarkGray
    }
}

# 1. Matar processos existentes
Write-Host "[1/3] Encerrando processos existentes..." -ForegroundColor Cyan
Write-Host ""

Stop-ProcessOnPort -Port 8080 -Name "Frontend (Vite)"
Stop-ProcessOnPort -Port 3001 -Name "Backend (Express)"

Write-Host ""

# 2. Aguardar liberação das portas
Write-Host "[2/3] Aguardando liberacao das portas..." -ForegroundColor Cyan
Start-Sleep -Seconds 2
Write-Host "  OK Portas liberadas" -ForegroundColor Green
Write-Host ""

# 3. Iniciar servidores
Write-Host "[3/3] Iniciando servidores..." -ForegroundColor Cyan
Write-Host ""

# Iniciar Backend (Express na porta 3001)
Write-Host "  Iniciando Backend (Express)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; pnpm server" -WindowStyle Minimized
Start-Sleep -Seconds 3

# Iniciar Frontend (Vite na porta 8080)
Write-Host "  Iniciando Frontend (Vite)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; pnpm dev" -WindowStyle Minimized
Start-Sleep -Seconds 5

Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se os servidores subiram
Write-Host "Verificando status dos servidores..." -ForegroundColor Cyan
Write-Host ""

$backendOk = $false
$frontendOk = $false

# Verificar Backend (até 10 tentativas)
for ($i = 1; $i -le 10; $i++) {
    $backendProcess = netstat -ano | findstr :3001 | Select-Object -First 1
    if ($backendProcess) {
        Write-Host "OK Backend rodando (porta 3001)" -ForegroundColor Green
        $backendOk = $true
        break
    }
    Start-Sleep -Seconds 1
}

if (-not $backendOk) {
    Write-Host "ERRO Backend nao iniciou" -ForegroundColor Red
}

# Verificar Frontend (até 10 tentativas)
for ($i = 1; $i -le 10; $i++) {
    $frontendProcess = netstat -ano | findstr :8080 | Select-Object -First 1
    if ($frontendProcess) {
        Write-Host "OK Frontend rodando (porta 8080)" -ForegroundColor Green
        $frontendOk = $true
        break
    }
    Start-Sleep -Seconds 1
}

if (-not $frontendOk) {
    Write-Host "ERRO Frontend nao iniciou" -ForegroundColor Red
}

Write-Host ""

# Resumo final
if ($backendOk -and $frontendOk) {
    Write-Host "==================================" -ForegroundColor Cyan
    Write-Host "SUCESSO Todos os servidores iniciados!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Acesse:" -ForegroundColor Cyan
    Write-Host "  - Frontend: http://localhost:8080" -ForegroundColor White
    Write-Host "  - Admin Console: http://localhost:8080/436F6E736F6C45" -ForegroundColor White
    Write-Host "  - Backend API: http://localhost:3001" -ForegroundColor White
    Write-Host ""
    Write-Host "Use 'pnpm check-servers' para verificar status" -ForegroundColor DarkGray
} else {
    Write-Host "==================================" -ForegroundColor Cyan
    Write-Host "AVISO Alguns servidores falharam ao iniciar" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Tente manualmente:" -ForegroundColor Yellow
    if (-not $backendOk) {
        Write-Host "  pnpm server  # Backend" -ForegroundColor White
    }
    if (-not $frontendOk) {
        Write-Host "  pnpm dev     # Frontend" -ForegroundColor White
    }
}

Write-Host ""
