# check-servers.ps1
# Script para verificar status dos servidores de desenvolvimento
# Uso: .\check-servers.ps1

Write-Host "=== Verificando Servidores de Desenvolvimento ===" -ForegroundColor Cyan
Write-Host ""

$allOk = $true

# Verificar Frontend (Vite - porta 8080)
Write-Host "[1/2] Frontend (Vite - porta 8080):" -ForegroundColor Yellow
$vitePort = netstat -ano | findstr :8080 | Select-Object -First 1

if ($vitePort) {
    # Extrair PID
    $vitePID = ($vitePort -split '\s+')[-1]
    Write-Host "  OK Porta em uso (PID: $vitePID)" -ForegroundColor Green
    
    # Testar responsividade
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:8080" -TimeoutSec 5 -UseBasicParsing -ErrorAction Stop
        Write-Host "  OK Servidor RESPONSIVO (Status: $($response.StatusCode))" -ForegroundColor Green
    } catch {
        Write-Host "  ERRO Servidor TRAVADO ou nao respondendo" -ForegroundColor Red
        Write-Host "    Erro: $($_.Exception.Message)" -ForegroundColor DarkRed
        Write-Host "  -> Solucao: taskkill /PID $vitePID /F && pnpm dev" -ForegroundColor Yellow
        $allOk = $false
    }
} else {
    Write-Host "  ERRO Servidor NAO esta rodando" -ForegroundColor Red
    Write-Host "  -> Solucao: pnpm dev" -ForegroundColor Yellow
    $allOk = $false
}

Write-Host ""

# Verificar Backend (Express - porta 3001)
Write-Host "[2/2] Backend (Express - porta 3001):" -ForegroundColor Yellow
$expressPort = netstat -ano | findstr :3001 | Select-Object -First 1

if ($expressPort) {
    # Extrair PID
    $expressPID = ($expressPort -split '\s+')[-1]
    Write-Host "  OK Porta em uso (PID: $expressPID)" -ForegroundColor Green
    
    # Testar responsividade (tentar /health primeiro, depois raiz)
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3001/health" -TimeoutSec 5 -UseBasicParsing -ErrorAction Stop
        Write-Host "  OK Servidor RESPONSIVO (Status: $($response.StatusCode))" -ForegroundColor Green
    } catch {
        # Tentar rota raiz como fallback
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:3001" -TimeoutSec 5 -UseBasicParsing -ErrorAction Stop
            Write-Host "  OK Servidor RESPONSIVO (Status: $($response.StatusCode))" -ForegroundColor Green
            Write-Host "    Nota: /health nao disponivel, mas servidor responde" -ForegroundColor DarkYellow
        } catch {
            Write-Host "  ERRO Servidor TRAVADO ou nao respondendo" -ForegroundColor Red
            Write-Host "    Erro: $($_.Exception.Message)" -ForegroundColor DarkRed
            Write-Host "  -> Solucao: taskkill /PID $expressPID /F && pnpm server" -ForegroundColor Yellow
            $allOk = $false
        }
    }
} else {
    Write-Host "  ERRO Servidor NAO esta rodando" -ForegroundColor Red
    Write-Host "  -> Solucao: pnpm server" -ForegroundColor Yellow
    $allOk = $false
}

Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan

# Resumo final
if ($allOk) {
    Write-Host "OK Todos os servidores estao operacionais!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Acesse:" -ForegroundColor Cyan
    Write-Host "  - Frontend: http://localhost:8080" -ForegroundColor White
    Write-Host "  - Admin Console: http://localhost:8080/436F6E736F6C45" -ForegroundColor White
    Write-Host "  - Backend API: http://localhost:3001" -ForegroundColor White
} else {
    Write-Host "AVISO Alguns servidores precisam de atencao" -ForegroundColor Yellow
    Write-Host "Siga as solucoes indicadas acima" -ForegroundColor Yellow
}

Write-Host ""
