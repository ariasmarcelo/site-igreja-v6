# start-dev.ps1
# Inicia ambiente de desenvolvimento local com Vercel Dev
# Vercel Dev roda Vite + APIs Serverless (porta automática ou 8081)

$WorkDir = "c:\temp\Site_Igreja_Meta\site-igreja-v6\workspace\shadcn-ui"

Write-Host "=== Iniciando Ambiente Local (Vercel Dev) ===" -ForegroundColor Cyan
Write-Host ""

Set-Location $WorkDir

Write-Host "[1/2] Limpando processos Node..." -ForegroundColor Yellow
taskkill /F /IM node.exe /T 2>$null | Out-Null
Start-Sleep -Seconds 2
Write-Host "  Processos encerrados" -ForegroundColor Green

Write-Host ""
Write-Host "[2/2] Iniciando Vercel Dev..." -ForegroundColor Yellow
Write-Host "  Frontend + APIs Serverless" -ForegroundColor DarkGray
Write-Host "  Aguardando inicializacao..." -ForegroundColor DarkGray
Write-Host "  Logs sendo salvos em: logs\vercel-dev.log" -ForegroundColor DarkGray
Write-Host ""

# Criar diretorio de logs se nao existir
if (!(Test-Path "logs")) { New-Item -ItemType Directory -Path "logs" | Out-Null }

# Iniciar Vercel Dev (escolhe porta automaticamente) e redirecionar para arquivo
$logFile = Join-Path $WorkDir "logs\vercel-dev.log"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$WorkDir'; vercel dev 2>&1 | Tee-Object -FilePath '$logFile'" -WorkingDirectory $WorkDir
Start-Sleep -Seconds 12

Write-Host "=== Verificando Status ===" -ForegroundColor Cyan
Write-Host ""

# Verificar em qual porta o Vercel Dev iniciou
$port = $null
foreach ($p in @(8081, 8080, 8082, 3000)) {
    $check = netstat -ano | findstr ":$p" | Select-Object -First 1
    if ($check) {
        $port = $p
        break
    }
}

if ($port) {
    Write-Host "OK Vercel Dev: http://localhost:$port" -ForegroundColor Green
    Write-Host "OK APIs Serverless: http://localhost:$port/api/*" -ForegroundColor Green
    Write-Host "OK Admin Console: http://localhost:$port/436F6E736F6C45" -ForegroundColor Green
    Write-Host ""
    Write-Host "Ambiente LOCAL funcionando na porta $port!" -ForegroundColor Cyan
} else {
    Write-Host "ERRO Vercel Dev nao iniciou" -ForegroundColor Red
}

Write-Host ""
Write-Host ""
