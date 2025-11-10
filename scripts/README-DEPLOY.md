# Scripts de Deploy em Background

## 📋 Visão Geral

Scripts para executar build e deploy do site em background, permitindo continuar trabalhando enquanto o processo acontece.

## 🚀 Uso Rápido

### PowerShell (Recomendado para Windows)

```powershell
# Deploy com mensagem padrão
.\scripts\deploy.ps1

# Deploy com mensagem personalizada
.\scripts\deploy.ps1 "feat: nova funcionalidade adicionada"
```

### Node.js Direto

```bash
# Deploy com mensagem padrão
node scripts/deploy-background.js

# Deploy com mensagem personalizada
node scripts/deploy-background.js "feat: nova funcionalidade"
```

## 📊 Monitoramento

### Ver Status do Job (PowerShell)

```powershell
# Listar todos os jobs
Get-Job

# Ver detalhes de um job específico
Get-Job 1

# Ver output de um job
Receive-Job 1 -Keep

# Remover job concluído
Remove-Job 1
```

### Logs em Tempo Real

```powershell
# Acompanhar último log
Get-Content logs\deploy-*.log -Tail 20 -Wait

# Ver último log completo
Get-Content (Get-ChildItem logs\deploy-*.log | Sort-Object LastWriteTime -Descending | Select-Object -First 1).FullName
```

## 📁 Estrutura de Logs

Logs são salvos em: `logs/deploy-YYYY-MM-DDTHH-mm-ss.log`

Exemplo de conteúdo:
```
================================================================================
INÍCIO DO DEPLOY
Commit Message: feat: nova funcionalidade
================================================================================

>>> PNPM BUILD
Comando: pnpm build
✓ 1955 modules transformed.
✓ PNPM BUILD concluído com sucesso

>>> GIT ADD
Comando: git add .
✓ GIT ADD concluído com sucesso

>>> GIT COMMIT
Comando: git commit -m feat: nova funcionalidade
✓ GIT COMMIT concluído com sucesso

>>> GIT PUSH
Comando: git push
✓ GIT PUSH concluído com sucesso

================================================================================
✓ DEPLOY CONCLUÍDO COM SUCESSO
================================================================================
```

## ⚙️ Processo Automático

O script executa em sequência:

1. **Build** - `pnpm build` (compila o projeto)
2. **Stage** - `git add .` (adiciona mudanças)
3. **Commit** - `git commit -m "mensagem"` (cria commit)
4. **Push** - `git push` (envia para GitHub)

Se qualquer etapa falhar, o processo é interrompido e o erro é registrado no log.

## 🔧 Exemplos de Uso

### Deploy Após Mudança Visual

```powershell
.\scripts\deploy.ps1 "style: ajustar espaçamento dos headers"
```

### Deploy Após Nova Feature

```powershell
.\scripts\deploy.ps1 "feat: adicionar página de eventos"
```

### Deploy Após Correção

```powershell
.\scripts\deploy.ps1 "fix: corrigir bug no formulário de contato"
```

## 📝 Notas

- **Background Real**: O processo roda em background, não bloqueia o terminal
- **Logs Persistentes**: Todos os logs são salvos para auditoria
- **Segurança**: Se um comando falhar, os seguintes não são executados
- **Performance**: Build pode levar 5-10 segundos, push 2-5 segundos

## 🎯 Benefícios

✅ Continue editando arquivos durante o deploy
✅ Não bloqueia o terminal
✅ Logs detalhados para debugging
✅ Histórico completo de deploys
✅ Mensagens de commit padronizadas ou personalizadas

## 🚨 Troubleshooting

### "Execution of scripts is disabled"

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Job travado

```powershell
# Parar job
Stop-Job 1

# Remover job
Remove-Job 1 -Force
```

### Ver erros do último deploy

```powershell
Get-Content (Get-ChildItem logs\deploy-*.log | Sort-Object LastWriteTime -Descending | Select-Object -First 1).FullName | Select-String "ERRO|FALHOU|✗"
```
