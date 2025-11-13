Write-Host "=== Sincronizando Testemunhos ===" -ForegroundColor Cyan

$jsonPath = "src/locales/pt-BR/Testemunhos.json"
$apiUrl = "http://localhost:3001/api/save-json"

if (-not (Test-Path $jsonPath)) {
    Write-Host "ERRO: Arquivo $jsonPath não encontrado!" -ForegroundColor Red
    exit 1
}

$jsonContent = Get-Content $jsonPath -Raw | ConvertFrom-Json

$payload = @{
    pageId = "Testemunhos"
    content = $jsonContent
} | ConvertTo-Json -Depth 10

try {
    $response = Invoke-RestMethod -Uri $apiUrl -Method Post -Body $payload -ContentType "application/json"
    Write-Host "[OK] Testemunhos sincronizado com sucesso!" -ForegroundColor Green
    
    if ($jsonContent.testimonials) {
        $total = $jsonContent.testimonials.Count
        $verified = ($jsonContent.testimonials | Where-Object { $_.verified -eq $true }).Count
        $pending = $total - $verified
        
        Write-Host "  Total: $total testemunhos" -ForegroundColor Yellow
        Write-Host "  Verificados: $verified" -ForegroundColor Green
        Write-Host "  Em verificacao: $pending" -ForegroundColor Gray
    }
}
catch {
    $errorMsg = $_.Exception.Message
    Write-Host "ERRO ao sincronizar: $errorMsg" -ForegroundColor Red
    exit 1
}
