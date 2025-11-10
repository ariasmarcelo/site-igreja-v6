# 🗄️ Backup e Restauração do Supabase

Scripts para fazer backup e restaurar dados do banco Supabase.

---

## 🚀 Quick Start

```bash
# Fazer backup
pnpm backup

# Listar backups disponíveis
pnpm backup:list

# Listar com detalhes completos
pnpm backup:list:detailed

# Comparar último com anterior
pnpm backup:compare

# Restaurar último backup
pnpm restore:latest

# Preview de restauração (sem alterar dados)
pnpm restore:dry

# Restaurar backup específico
node scripts/restore-supabase.js --backup=2025-11-10T10-30-00
```

---

## 📋 Scripts Disponíveis

| Script | Comando | Descrição |
|--------|---------|-----------|
| **backup-supabase.js** | `pnpm backup` | Backup de todas as tabelas |
| **restore-supabase.js** | `pnpm restore:latest` | Restaura último backup |

---

## 💾 backup-supabase.js

### O que faz

- 📥 Baixa todos os dados de todas as tabelas configuradas
- 💾 Salva em arquivos JSON individuais
- 📊 Cria arquivo de metadados com estatísticas
- 🧹 Mantém apenas últimos 10 backups automaticamente
- ✅ Verifica conexão antes de iniciar

### Comandos

```bash
# Backup padrão (todas as tabelas)
pnpm backup

# Backup com log detalhado
pnpm backup:verbose

# Backup de tabela específica
node scripts/backup-supabase.js --table=page_texts
```

### Estrutura criada

```
backups/supabase/
├── 2025-11-10T10-30-00/
│   ├── _metadata.json       # Informações do backup
│   ├── page_texts.json      # Dados da tabela
│   ├── page_styles.json
│   └── version_history.json
└── 2025-11-10T11-00-00/
    └── ...
```

### Arquivo de metadados

```json
{
  "timestamp": "2025-11-10T10:30:00.000Z",
  "supabaseUrl": "https://xxx.supabase.co",
  "tables": [
    {
      "name": "page_texts",
      "success": true,
      "records": 142,
      "size": "45.30",
      "error": null
    }
  ],
  "totalRecords": 142,
  "totalSize": "45.30",
  "successful": 3,
  "failed": 0
}
```

---

## 🔄 restore-supabase.js

### O que faz

- 🔄 Restaura dados de um backup específico
- ⚠️ **ATENÇÃO**: Deleta dados atuais antes de restaurar
- 🛡️ Solicita confirmação (pode ser ignorada com `--force`)
- 📊 Insere dados em lotes de 100 registros
- 🔍 Modo dry-run para testar sem alterar dados

### Listar Backups Disponíveis

```bash
# Listar todos os backups (mostra nomes dos backups disponíveis)
node scripts/restore-supabase.js

# Via PowerShell - lista completa com detalhes
Get-ChildItem backups\supabase -Directory | Sort-Object LastWriteTime -Descending

# Ver detalhes de um backup específico
Get-Content backups\supabase\2025-11-10T10-30-00\_metadata.json | ConvertFrom-Json

# Listar com estatísticas
Get-ChildItem backups\supabase -Directory | ForEach-Object {
    $meta = Get-Content "$($_.FullName)\_metadata.json" | ConvertFrom-Json
    [PSCustomObject]@{
        Data = $_.Name
        Tabelas = $meta.successful
        Registros = $meta.totalRecords
        Tamanho = "$($meta.totalSize) KB"
    }
} | Sort-Object Data -Descending | Format-Table -AutoSize
```

### Comandos de Restauração

```bash
# Restaurar último backup (com confirmação)
pnpm restore:latest

# Preview sem alterar dados
pnpm restore:dry

# Restaurar backup específico por data/hora
node scripts/restore-supabase.js --backup=2025-11-10T10-30-00

# Restaurar sem confirmação (CUIDADO!)
node scripts/restore-supabase.js --latest --force

# Restaurar tabela específica
node scripts/restore-supabase.js --latest --table=page_styles

# Restaurar backup específico + tabela específica
node scripts/restore-supabase.js --backup=2025-11-10T10-30-00 --table=page_contents
```

### Processo de restauração

1. **Seleção**: Escolhe backup (--latest ou --backup=NOME)
2. **Validação**: Verifica se backup existe e tem metadados
3. **Confirmação**: Pede confirmação (exceto com --force ou --dry-run)
4. **Limpeza**: Deleta dados atuais da tabela
5. **Inserção**: Insere dados do backup em lotes
6. **Resumo**: Exibe estatísticas da operação

---

## ⚙️ Configuração

### Variáveis de ambiente (.env.local)

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SERVICE_KEY=sua-service-role-key
```

⚠️ **IMPORTANTE**: Use a **SERVICE_ROLE_KEY**, não a ANON_KEY, pois é necessário permissão de escrita.

### Tabelas configuradas

Edite `backup-supabase.js` para adicionar/remover tabelas:

```javascript
const TABLES = [
  'page_texts',
  'page_styles',
  'version_history',
  // Adicione suas tabelas aqui
];
```

---

## 📊 Gestão de Versões de Backup

### Listar e Comparar Backups

```powershell
# Lista completa com informações
Get-ChildItem backups\supabase -Directory | ForEach-Object {
    $meta = Get-Content "$($_.FullName)\_metadata.json" | ConvertFrom-Json
    [PSCustomObject]@{
        'Data/Hora' = [DateTime]::Parse($meta.timestamp).ToString('dd/MM/yyyy HH:mm')
        'Pasta' = $_.Name
        'Tabelas OK' = $meta.successful
        'Tabelas Falha' = $meta.failed
        'Total Registros' = $meta.totalRecords
        'Tamanho (KB)' = $meta.totalSize
    }
} | Sort-Object 'Data/Hora' -Descending | Format-Table -AutoSize

# Ver conteúdo de um backup específico
Get-ChildItem backups\supabase\2025-11-10T10-30-00 | Select-Object Name, Length

# Comparar dois backups
$backup1 = Get-Content backups\supabase\2025-11-10T10-30-00\_metadata.json | ConvertFrom-Json
$backup2 = Get-Content backups\supabase\2025-11-10T11-00-00\_metadata.json | ConvertFrom-Json
Write-Host "Backup 1: $($backup1.totalRecords) registros"
Write-Host "Backup 2: $($backup2.totalRecords) registros"
Write-Host "Diferença: $($backup2.totalRecords - $backup1.totalRecords) registros"
```

### Restaurar Versão Específica por Data

```bash
# 1. Listar backups com datas legíveis
node scripts/restore-supabase.js

# 2. Escolher backup pela data/hora
node scripts/restore-supabase.js --backup=2025-11-10T10-30-00

# 3. Ou usar o mais recente
node scripts/restore-supabase.js --latest
```

### Manter Backups Importantes

```powershell
# Sistema mantém últimos 10 automaticamente
# Para manter um backup específico permanentemente, mova para fora da pasta:

# Criar pasta de backups permanentes
New-Item -ItemType Directory -Path backups\permanentes -Force

# Mover backup importante
Move-Item backups\supabase\2025-11-10T10-30-00 backups\permanentes\2025-11-10-antes-migracao

# Para restaurar backup permanente, mova de volta temporariamente
Copy-Item backups\permanentes\2025-11-10-antes-migracao backups\supabase\2025-11-10T10-30-00 -Recurse
node scripts/restore-supabase.js --backup=2025-11-10T10-30-00
```

---

## 📊 Exemplos de Uso

### Rotina de backup diário

```bash
# Adicione ao cron ou Task Scheduler
pnpm backup
```

### Antes de mudanças grandes

```bash
# 1. Fazer backup antes de modificar dados
pnpm backup:verbose

# 2. Fazer as mudanças...

# 3. Se algo der errado, listar backups
node scripts/restore-supabase.js

# 4. Restaurar o backup anterior
pnpm restore:latest
```

### Workflow Completo com Versionamento

```bash
# Segunda-feira: Backup de segurança
pnpm backup:verbose
# Criado: backups/supabase/2025-11-10T08-00-00

# Durante a semana: Fazer mudanças normalmente

# Sexta-feira: Problema detectado!
# Listar todos os backups
node scripts/restore-supabase.js

# Ver qual backup tem os dados corretos
Get-Content backups\supabase\2025-11-10T08-00-00\_metadata.json | ConvertFrom-Json

# Testar restauração (dry-run)
node scripts/restore-supabase.js --backup=2025-11-10T08-00-00 --dry-run

# Restaurar para segunda-feira
node scripts/restore-supabase.js --backup=2025-11-10T08-00-00
```

### Restaurar Apenas Uma Tabela

```bash
# Situação: page_styles está ok, mas page_contents precisa ser restaurado

# 1. Listar backups
node scripts/restore-supabase.js

# 2. Restaurar apenas page_contents de um backup específico
node scripts/restore-supabase.js --backup=2025-11-10T10-30-00 --table=page_contents

# Outras tabelas permanecem intactas
```

### Testar restauração sem risco

```bash
# Preview do que seria restaurado
pnpm restore:dry
```

### Restaurar tabela específica

```bash
# Backup
node scripts/backup-supabase.js --table=page_texts

# Restaurar apenas essa tabela
node scripts/restore-supabase.js --latest --table=page_texts
```

---

## 🛡️ Segurança

### Proteções implementadas

- ✅ Confirmação obrigatória antes de restaurar
- ✅ Modo dry-run para testar
- ✅ Logs detalhados de todas as operações
- ✅ Metadados de cada backup
- ✅ Limpeza automática de backups antigos

### Boas práticas

1. **Backups regulares**: Execute `pnpm backup` antes de mudanças importantes
2. **Teste restauração**: Use `--dry-run` para verificar backups
3. **Versionamento**: Backups são timestamped automaticamente
4. **Limpeza**: Sistema mantém apenas 10 backups mais recentes
5. **Verificação**: Sempre verifique metadados antes de restaurar

---

## 🚨 Troubleshooting

### Erro: "Variáveis de ambiente não configuradas"

**Solução**: Configure `.env.local` com VITE_SUPABASE_URL e SUPABASE_SERVICE_KEY

### Erro: "Erro ao conectar com Supabase"

**Causas**:
- URL incorreta
- Service key inválida
- Projeto Supabase pausado/inativo

**Solução**: Verifique credenciais no dashboard do Supabase

### Backup com falhas

**Causa**: Permissões insuficientes

**Solução**: Use a **SERVICE_ROLE_KEY**, não a ANON_KEY

### Restauração parcial

Se a restauração falhar no meio:
1. O sistema reporta quantos registros foram inseridos
2. Execute novamente com `--force` para tentar completar
3. Ou faça novo backup e tente restaurar

---

## 📈 Estatísticas

Após cada backup, você verá:

```
══════════════════════════════════════════════════════════
📊 RESUMO DO BACKUP
══════════════════════════════════════════════════════════
📅 Data: 10/11/2025 10:30:00
📂 Pasta: 2025-11-10T10-30-00
📋 Tabelas: 3/3 com sucesso
📄 Registros: 142
💾 Tamanho: 45.30 KB

══════════════════════════════════════════════════════════
✅ Backup salvo em: backups/supabase/2025-11-10T10-30-00
══════════════════════════════════════════════════════════
```

---

## 🔧 Integração com CI/CD

### GitHub Actions exemplo

```yaml
- name: Backup Supabase
  run: pnpm backup:verbose
  env:
    VITE_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
    SUPABASE_SERVICE_KEY: ${{ secrets.SUPABASE_SERVICE_KEY }}
```

---

## 📝 Logs e Monitoramento

- Cada operação exibe progresso em tempo real
- Modo `--verbose` mostra detalhes de cada tabela
- Metadados permitem auditoria completa
- Exit codes: `0` = sucesso, `1` = erro

---

## 📜 Histórico Automático de Versões

### Versionamento em Tempo Real

O Supabase mantém **automaticamente** as últimas 5 versões de cada página na tabela `page_history`. Toda vez que você salva uma alteração, o sistema cria um backup automático.

### Comandos Disponíveis

```bash
# Listar versões de todas as páginas
pnpm history:all

# Listar versões de uma página específica
pnpm history:list index json          # Conteúdo JSON da página Index
pnpm history:list quem-somos css      # Estilos CSS da página Quem Somos

# Visualizar conteúdo de uma versão
pnpm history:view index json 123      # Ver versão 123 da página Index

# Exportar versão para arquivo
pnpm history:export index json 123 backup-index.json
```

### Exemplos Práticos

**1. Ver histórico completo:**
```bash
# Ver todas as páginas e quantas versões existem
node scripts/list-history.js all

# Resultado:
# 📊 Versões disponíveis por página:
# 
# 📄 index           - JSON: 5 versões | CSS: 3 versões
# 📄 quem-somos      - JSON: 4 versões | CSS: 2 versões
# 📄 tratamentos     - JSON: 5 versões | CSS: 1 versões
# ...
```

**2. Ver versões de uma página específica:**
```bash
node scripts/list-history.js list index json

# Resultado:
# 📋 Histórico de versões: index (json)
# 
# ID      | Data/Hora           | Usuário
# --------|---------------------|----------
# 156     | 10/11/2025 09:45:32 | admin
# 145     | 10/11/2025 08:30:15 | admin
# 134     | 09/11/2025 18:22:40 | admin
# ...
```

**3. Visualizar uma versão antiga:**
```bash
node scripts/list-history.js view index json 156

# Mostra metadados e primeiros 500 caracteres do conteúdo
```

**4. Exportar versão para análise:**
```bash
node scripts/list-history.js export index json 156 old-version.json

# Cria arquivo JSON com:
# - Metadados (id, data, usuário)
# - Conteúdo completo da versão
```

### Páginas Disponíveis

- `index` - Página inicial
- `quem-somos` - Sobre nós
- `tratamentos` - Serviços
- `testemunhos` - Depoimentos
- `contato` - Contato
- `purificacao` - Purificação
- `artigos` - Blog/Artigos

### Tipos de Conteúdo

- `json` - Conteúdo das páginas (textos, imagens, títulos, etc)
- `css` - Estilos CSS personalizados

### Como Restaurar uma Versão Antiga

**Via API** (requer servidor rodando):

```bash
# 1. Inicie o servidor
pnpm server

# 2. Use curl ou Postman
curl -X POST http://localhost:3001/api/restore-version \
  -H "Content-Type: application/json" \
  -d '{
    "pageId": "index",
    "contentType": "json",
    "versionId": 156
  }'
```

**Manualmente**:

```bash
# 1. Exporte a versão desejada
node scripts/list-history.js export index json 156 restore-temp.json

# 2. Use o Admin Console ou API para aplicar as alterações
```

### Diferença: Histórico vs Backup

| Aspecto | Histórico (`page_history`) | Backup (`backups/supabase/`) |
|---------|---------------------------|------------------------------|
| **Frequência** | Automático a cada salvamento | Manual via `pnpm backup` |
| **Retenção** | Últimas 5 versões por página | Últimos 10 backups completos |
| **Escopo** | Por página individual | Todas as tabelas juntas |
| **Restauração** | Via API ou script | Via script restore-supabase.js |
| **Uso** | Desfazer alterações recentes | Recuperação de desastres |
| **Localização** | Tabela no Supabase | Arquivos JSON locais |

### Quando Usar Cada Um

**Use o Histórico quando:**
- ✅ Precisa desfazer uma mudança recente em uma página
- ✅ Quer comparar versões antigas de conteúdo
- ✅ Precisa recuperar texto que foi apagado
- ✅ Quer ver quem fez alterações e quando

**Use o Backup quando:**
- ✅ Precisa restaurar todo o banco de dados
- ✅ Quer migrar dados entre ambientes
- ✅ Precisa de snapshot completo para auditoria
- ✅ Quer garantia de recuperação completa

---

**Última Atualização:** 10/11/2025  
**Status:** ✅ Testado e funcional (backup 264 linhas, restore 290 linhas, history 270 linhas)  
**Cobertura:** 3 tabelas - 32 registros (155.53 KB) | Histórico automático: últimas 5 versões/página
