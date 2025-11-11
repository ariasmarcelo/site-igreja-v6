# stop-dev.ps1
# Para o servidor Vercel Dev

Write-Host "=== Parando Vercel Dev ===" -ForegroundColor Cyan
Write-Host ""

# Parar porta 8080 (Vercel Dev)
$port8080 = netstat -ano | findstr ":8080" | Select-Object -First 1
if ($port8080) {
    $processId = ($port8080 -split '\s+')[-1]
    taskkill /PID $processId /F 2>$null | Out-Null
    Write-Host "OK Vercel Dev encerrado (porta 8080)" -ForegroundColor Green
} else {
    Write-Host "Nenhum processo rodando na porta 8080" -ForegroundColor DarkGray
}

Write-Host ""
