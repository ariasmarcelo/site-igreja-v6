# 🗄️ Backup e Restauração do Supabase

Scripts para fazer backup e restaurar dados do banco Supabase.

---

## 🚀 Quick Start

```bash
# Fazer backup
pnpm backup

# Fazer backup com log detalhado
pnpm backup:verbose

# Restaurar último backup (com confirmação)
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

### Comandos

```bash
# Restaurar último backup (com confirmação)
pnpm restore:latest

# Preview sem alterar dados
pnpm restore:dry

# Restaurar backup específico
node scripts/restore-supabase.js --backup=2025-11-10T10-30-00

# Restaurar sem confirmação
node scripts/restore-supabase.js --latest --force

# Restaurar tabela específica
node scripts/restore-supabase.js --latest --table=page_texts

# Listar backups disponíveis
node scripts/restore-supabase.js
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

## 📊 Exemplos de Uso

### Rotina de backup diário

```bash
# Adicione ao cron ou Task Scheduler
pnpm backup
```

### Antes de mudanças grandes

```bash
# Fazer backup antes de modificar dados
pnpm backup:verbose

# Fazer as mudanças...

# Se algo der errado, restaurar
pnpm restore:latest
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

**Última Atualização**: 10/11/2025  
**Status**: Scripts funcionais e testados  
**Compatibilidade**: Node.js ES Modules
