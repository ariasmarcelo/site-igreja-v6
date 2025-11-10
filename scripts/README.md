#  Scripts de Automação

Scripts essenciais para desenvolvimento, deploy e backup do projeto.

>  Documentação detalhada:
> - **[README-FIX-IDS.md](./README-FIX-IDS.md)** - Sistema de IDs únicos
> - **[README-BACKUP.md](./README-BACKUP.md)** - Backup/Restore Supabase
> - **[../TECHNICAL-NOTES.md](../TECHNICAL-NOTES.md)** - Soluções técnicas e histórico

---

##  Quick Start

```bash
# Desenvolvimento
pnpm dev

# IDs
pnpm fix-ids
pnpm fix-ids:fix

# Backup
pnpm backup              # Fazer backup
pnpm backup:list         # Listar backups
pnpm restore:latest      # Restaurar último

# Deploy
.\scripts\deploy.ps1 "msg"      # Síncrono
.\scripts\deploy.ps1 -b "msg"   # Background
```

---

##  Scripts Ativos

| Script | Comando | Descrição |
|--------|---------|-----------|
| **fix-ids.js**  | `pnpm fix-ids` | Verificação e correção de IDs |
| **deploy.ps1**  | `.\scripts\deploy.ps1 [-b]` | Deploy síncrono ou background |
| **backup-supabase.js**  | `pnpm backup` | Backup completo do Supabase |
| **restore-supabase.js**  | `pnpm restore:latest` | Restaura backup |

---

##  Estatísticas

- **96 elementos editáveis** em 6 páginas
- **4 scripts essenciais**
- **3 tabelas no banco** - 32 registros (155.53 KB)
- **Admin Panel**: `/436F6E736F6C45`

---

**Última Atualização:** 10/11/2025  
**Status:**  Todos os scripts funcionais e testados  
**Complexidade:** Simplificado ao máximo
