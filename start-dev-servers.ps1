# start-dev-servers.ps1
# Inicia servidores de desenvolvimento

$WorkDir = "c:\temp\Site_Igreja_Meta\site-igreja-v6\workspace\shadcn-ui"

Write-Host "=== Iniciando Servidores ===" -ForegroundColor Cyan
Write-Host ""

Set-Location $WorkDir

# Limpar portas
Write-Host "[1/3] Limpando portas..." -ForegroundColor Yellow

$port8080 = netstat -ano | findstr ":8080" | Select-Object -First 1
if ($port8080) {
    $processId = ($port8080 -split '\s+')[-1]
    taskkill /PID $processId /F 2>$null | Out-Null
    Write-Host "  Porta 8080 liberada" -ForegroundColor Green
}

$port3001 = netstat -ano | findstr ":3001" | Select-Object -First 1
if ($port3001) {
    $processId = ($port3001 -split '\s+')[-1]
    taskkill /PID $processId /F 2>$null | Out-Null
    Write-Host "  Porta 3001 liberada" -ForegroundColor Green
}

Start-Sleep -Seconds 1
Write-Host ""

# Iniciar Backend
Write-Host "[2/3] Iniciando Backend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$WorkDir'; node scripts/start-backend.js" -WindowStyle Minimized
Start-Sleep -Seconds 4

# Iniciar Frontend
Write-Host "[3/3] Iniciando Frontend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$WorkDir'; npx vite --port 8080 --host" -WindowStyle Minimized
Start-Sleep -Seconds 6

Write-Host ""
Write-Host "=== Verificando Status ===" -ForegroundColor Cyan
Write-Host ""

# Verificar
$backendOk = netstat -ano | findstr ":3001" | Select-Object -First 1
$frontendOk = netstat -ano | findstr ":8080" | Select-Object -First 1

if ($backendOk) {
    Write-Host "OK Backend: http://localhost:3001" -ForegroundColor Green
} else {
    Write-Host "ERRO Backend falhou" -ForegroundColor Red
}

if ($frontendOk) {
    Write-Host "OK Frontend: http://localhost:8080" -ForegroundColor Green
    Write-Host "OK Admin: http://localhost:8080/436F6E736F6C45" -ForegroundColor Green
} else {
    Write-Host "ERRO Frontend falhou" -ForegroundColor Red
}

Write-Host ""
