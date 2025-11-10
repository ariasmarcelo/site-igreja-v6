# Technical Notes & Solutions

> **Knowledge base de soluções técnicas, troubleshooting e histórico de migrações**  
> **Última atualização:** 10 de novembro de 2025

---

## 📋 Índice

1. [Server Management](#server-management)
2. [Soluções de Problemas Passados](#soluções-de-problemas-passados)
3. [Migração Supabase](#migração-supabase)
4. [Deploy Avançado](#deploy-avançado)
5. [Data JSON Key Convention](#data-json-key-convention)

---

## 🖥️ Server Management

### Iniciar Servidores

```powershell
# Frontend (Vite) - porta 8080
pnpm dev

# Backend (Express) - porta 3001
pnpm server
```

### Verificar Status

```powershell
# Health check
curl http://localhost:3001/health

# Verificar portas em uso
netstat -ano | findstr :8080  # Frontend
netstat -ano | findstr :3001  # Backend
```

### Problema: Servidor Cai Durante Outros Comandos

**Sintoma:** Executar `pnpm add`, `git`, etc. no mesmo terminal interrompe o servidor.

**Solução:** Use terminais separados:
- Terminal 1: Servidor API (`pnpm server`)
- Terminal 2: Comandos gerais (`git`, `pnpm add`, etc.)

**VS Code:** `Terminal > Split Terminal` para criar lado a lado.

### Melhorias Implementadas

**express-server.js:** Tratamento robusto de erros

```javascript
// Exceções não capturadas não derrubam servidor
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
});

// Promises rejeitadas não derrubam servidor
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection:', reason);
});

// Graceful shutdown (CTRL+C)
process.on('SIGINT', () => {
  server.close(() => process.exit(0));
});
```

**supabase-routes.js:** Async handler wrapper

```javascript
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((error) => {
    console.error('❌ Error:', req.method, req.path, error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message,
      path: req.path
    });
  });
};
```

### Endpoints API

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/health` | Status do servidor |
| GET | `/api/content/:pageId` | Buscar conteúdo JSON |
| GET | `/api/styles/:pageId` | Buscar estilos CSS |
| POST | `/api/save-json` | Salvar JSON completo |
| POST | `/api/save-visual-edits` | Salvar edições de TEXTO |
| POST | `/api/save-styles` | Salvar edições de CSS |
| PUT | `/api/blog-posts/:id` | Atualizar artigo |
| POST | `/api/blog-posts` | Criar artigo |

### Troubleshooting

**Porta 3001 ocupada:**
```powershell
# Identificar processo
netstat -ano | findstr :3001

# Matar processo (substitua [PID])
taskkill /PID [número] /F
```

**Erro de conexão Supabase:**
1. Verificar `.env.local`: `VITE_SUPABASE_URL` e `SUPABASE_SERVICE_KEY`
2. Verificar acesso à internet
3. Verificar se projeto Supabase está ativo

---

## 🔧 Soluções de Problemas Passados

### 1. Persistência de Edições - data-json-key (RESOLVIDO)

**Data:** Outubro 2025  
**Problema:** Editor visual não persistia mudanças no JSON.

**Causa Raiz:** IDs com prefixo no DOM (`index.hero.title`) mas servidor esperava sem prefixo (`hero.title`).

**Solução Implementada:**

API remove prefixo automaticamente antes de salvar:

```javascript
// server/api.js - endpoint /save-visual-edits
let jsonKey = elementId;
const pagePrefix = `${pageId}.`;

if (elementId.startsWith(pagePrefix)) {
  jsonKey = elementId.substring(pagePrefix.length);
  console.log(`🔧 Removed prefix: "${elementId}" → "${jsonKey}"`);
}

const updated = updateJsonByKey(jsonData, jsonKey, newText);
```

**Por que na API?**
- ✅ Dados completos (não perde informação no caminho)
- ✅ Rastreabilidade (sabe de qual página veio)
- ✅ Validação (pode validar pageId vs arquivo)
- ✅ Menos transformações no frontend

**Fluxo Completo:**
```
TSX: <h1 data-json-key="index.hero.title">
  ↓
Frontend: editedTexts["index.hero.title"] = "Novo"
  ↓
API: recebe { pageId: "index", edits: { "index.hero.title": "Novo" } }
  ↓
API: transforma "index.hero.title" → "hero.title"
  ↓
JSON: json["hero"]["title"] = "Novo" ✅
```

### 2. Correção de data-json-key (CONCLUÍDO)

**Data:** Outubro 2025  
**Total:** 35 correções em 6 arquivos

**Scripts Criados:**
- `scripts/fix-index-json-keys.cjs` - Página Index (23 correções)
- `scripts/fix-all-json-keys.cjs` - Todas páginas (5 tipos de correções)

**Correções por Página:**
- **Index.tsx:** 23 correções
- **Purificacao.tsx:** 5 correções
- **QuemSomos.tsx:** 4 correções
- **Contato.tsx:** 2 correções
- **Tratamentos.tsx, Testemunhos.tsx, Artigos.tsx:** ✅ Sem erros

**Tipos de Erros Corrigidos:**
1. ❌ `section_igreja` → ✅ `igreja` (nomenclatura incorreta)
2. ❌ `.map` no data-json-key (arrays não editáveis)
3. ❌ `.replace` no data-json-key (transformações não editáveis)
4. ❌ `.icon` no data-json-key (ícones não editáveis)
5. ❌ `.link` no data-json-key (links não editáveis)

### 3. Renomeação v5 → v6 (CONCLUÍDO)

**Data:** 10 de novembro de 2025  
**Motivo:** Repository GitHub é `site-igreja-v6`, código tinha referências a v5.

**Arquivos Modificados:**
```
vite.config.ts:  base: '/site-igreja-v5/' → '/site-igreja-v6/'
src/App.tsx:     basename: '/site-igreja-v5' → '/site-igreja-v6'
README.md:       URLs atualizadas
scripts/deploy.ps1: Mensagens atualizadas
.env.example:    Documentação atualizada
```

**⚠️ Lição Crítica:** `basename` (React Router) DEVE corresponder a `base` (Vite)!
- Mismatch causa página em branco
- Sem erros no console
- React Router não encontra rotas

### 4. Integração Antahkarana (CONCLUÍDO)

**Data:** 10 de novembro de 2025  
**Conceito:** Ponte de luz entre personalidade e Eu Superior.

**Modificações:**
- **Arquivo:** `src/locales/pt-BR/Purificacao.json`
- **Backup:** `Purificacao_backup_2025-11-10_15-11-38.json`
- **Localizações:** 6 menções ao Antahkarana na Fase Final

**Campos Editados:**
```json
{
  "faseFinal": {
    "subtitle": "Iniciação e Ativação do Antahkarana",
    "iniciacao": {
      "title": "A Iniciação Final — Ativação do Antahkarana",
      "content": "... construção da ponte de luz ..."
    },
    "evento": "... construção do Antahkarana ...",
    "posIniciacao": "Vivendo com Antahkarana ativo"
  }
}
```

**Sincronização:**
```powershell
node scripts/update-purificacao-db.js
node scripts/check-purificacao-db.js
# ✅ "Antahkarana aparece 6 vezes no banco!"
```

---

## 🗄️ Migração Supabase

### Status: ✅ CONCLUÍDA (10 de novembro de 2025)

### Resumo da Migração

**Antes:** File system (JSON/CSS locais)  
**Depois:** Supabase PostgreSQL (única fonte da verdade)

**Dados Migrados:**
- ✅ 7 arquivos JSON → Tabela `page_contents`
- ✅ 6 arquivos CSS → Tabela `page_styles`
- ✅ Total: 13 arquivos

**Script:** `scripts/migrate-to-supabase.js`

### Estrutura do Banco

**Tabela: page_contents**
```sql
CREATE TABLE page_contents (
  id SERIAL PRIMARY KEY,
  page_id TEXT UNIQUE NOT NULL,
  content JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Tabela: page_styles**
```sql
CREATE TABLE page_styles (
  id SERIAL PRIMARY KEY,
  page_id TEXT UNIQUE NOT NULL,
  styles TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Tabela: blog_posts**
```sql
CREATE TABLE blog_posts (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Arquivos Atualizados

**Backend:**
- ✅ `api/index.js` (Vercel) - Usa Supabase
- ✅ `server/api.js` (Local) - Usa Supabase
- ✅ Removidas operações de file system
- ✅ Adicionados endpoints GET

**Frontend:**
- ✅ `src/hooks/useLocaleTexts.ts` - Busca do Supabase
- ✅ `src/hooks/usePageStyles.ts` - Injeta CSS do Supabase
- ✅ Removida dependência de imports estáticos
- ✅ Loading/error states implementados

**Arquivos Criados:**
```
.env.local                      - Credenciais (NÃO commitar!)
src/lib/supabase.ts             - Cliente Supabase
scripts/migrate-to-supabase.js  - Script de migração
```

### Variáveis de Ambiente

```env
# Frontend (público)
VITE_SUPABASE_URL=https://[projeto].supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...

# Backend (servidor apenas)
SUPABASE_SERVICE_KEY=eyJhbGci...
```

### Segurança

- ✅ Row Level Security (RLS) ativo
- ✅ Leitura pública, escrita autenticada
- ✅ Service key apenas no backend
- ✅ Anon key no frontend (RLS protege)

### Backup

**Automático:** Supabase mantém 7 dias (plano Free)

**Manual:**
```powershell
pnpm backup
# OU
node scripts/backup-supabase.js
```

**Listar backups:**
```powershell
pnpm list-backups
# OU
.\scripts\list-backups.ps1
```

**Restaurar:**
```powershell
pnpm restore:latest
# OU
node scripts/restore-supabase.js [timestamp]
```

---

## 🚀 Deploy Avançado

### Script Unificado: deploy.ps1

**Modos de execução:**

**1. Síncrono (bloqueia terminal):**
```powershell
.\scripts\deploy.ps1 "feat: nova funcionalidade"
```

**2. Background (libera terminal):**
```powershell
.\scripts\deploy.ps1 "fix: correção" -Background
# OU
.\scripts\deploy.ps1 "fix: correção" -b
```

### Parâmetros

| Parâmetro | Tipo | Padrão | Descrição |
|-----------|------|--------|-----------|
| `Message` | string | timestamp | Mensagem do commit |
| `-Background` | switch | false | Executa em segundo plano |
| `-b` | alias | - | Alias de `-Background` |

### Processo Automatizado

```powershell
# O script faz automaticamente:
1. pnpm build              # Gera dist/
2. Copia dist/ → build/v2/
3. git add build/v2/
4. git commit -m "Deploy: [mensagem]"
5. git push origin main
6. Aguarda 2-5min (GitHub Pages publica)
```

### Logs

**Síncrono:** Output direto no terminal

**Background:** 
```powershell
# Ver progresso ao vivo
Get-Content logs\deploy-[timestamp].log -Tail 20 -Wait

# Ver log completo
Get-Content logs\deploy-[timestamp].log

# Listar todos logs
Get-ChildItem logs\deploy-*.log
```

### Comandos Úteis

```powershell
# Build local (testar antes de deploy)
pnpm build

# Preview do build
pnpm preview

# Deploy com mensagem customizada
pnpm run deploy "feat: novo recurso"

# Deploy em background
pnpm deploy:bg "fix: correção rápida"
```

### Cache do Navegador

**Problema:** Após deploy, site mostra versão antiga.

**Solução:** Hard refresh
- **Windows:** CTRL+F5
- **Mac:** CMD+SHIFT+R
- **DevTools:** Network > Disable cache

---

## 📐 Data JSON Key Convention

### Regras de Nomenclatura

**Formato:** `pageId.caminho.para.propriedade`

**Exemplos válidos:**
```tsx
<h1 data-json-key="index.hero.title">
  {texts.hero.title}
</h1>

<p data-json-key={`index.igreja.description[${index}]`}>
  {paragraph}
</p>

<span data-json-key="quemsomos.principios.items[0].title">
  {texts.principios.items[0].title}
</span>
```

### ❌ Padrões INCORRETOS

**1. Atributos .map (não editáveis):**
```tsx
<!-- ERRADO -->
<ul data-json-key="index.instituto.benefits.map">
  {texts.instituto.benefits.map(...)}
</ul>

<!-- CORRETO -->
<ul>
  {texts.instituto.benefits.map((benefit, i) => (
    <li key={i} data-json-key={`index.instituto.benefits[${i}]`}>
      {benefit}
    </li>
  ))}
</ul>
```

**2. Transformações .replace (não editáveis):**
```tsx
<!-- ERRADO -->
<div data-json-key="index.fisicoEspiritual.description.replace">
  {texts.fisicoEspiritual.description.replace(/\n/g, '<br>')}
</div>

<!-- CORRETO -->
<div>
  {texts.fisicoEspiritual.description.replace(/\n/g, '<br>')}
</div>
```

**3. Nomenclatura incorreta (section_):**
```tsx
<!-- ERRADO -->
<p data-json-key="index.section_igreja.description[${index}]">

<!-- CORRETO -->
<p data-json-key="index.igreja.description[${index}]">
```

**4. Elementos não editáveis:**
```tsx
<!-- ERRADO - Ícones SVG -->
<svg data-json-key="index.hero.icon.sun_animated">

<!-- ERRADO - Links href -->
<Link to="..." data-json-key="index.instituto.link.treatments">

<!-- ERRADO - Componentes React -->
<Button data-json-key="index.hero.button">
```

### Transformação na API

**Frontend envia com prefixo:**
```json
{
  "pageId": "index",
  "edits": {
    "index.hero.title": "Novo Título"
  }
}
```

**API remove prefixo antes de salvar:**
```javascript
// server/api.js
let jsonKey = "index.hero.title";
const pagePrefix = "index.";

if (jsonKey.startsWith(pagePrefix)) {
  jsonKey = jsonKey.substring(pagePrefix.length); // "hero.title"
}

// Salva no JSON
json["hero"]["title"] = "Novo Título";
```

**Vantagens:**
- ✅ IDs únicos globalmente no DOM
- ✅ Rastreabilidade (sabe origem do dado)
- ✅ Validação (API confirma pageId)
- ✅ Menos transformações no frontend

---

## 📝 Notas Finais

### Arquivos de Referência (Histórico)

Os seguintes documentos foram consolidados neste arquivo:
- `SOLUTION_SUMMARY.md` - Solução data-json-key
- `SUPABASE_INTEGRATION.md` - Migração Supabase
- `scripts/README-DEPLOY.md` - Deploy avançado
- `scripts/FIX_DATA_JSON_KEY_SUMMARY.md` - Correções aplicadas
- `server/README-SERVER.md` - Gerenciamento do servidor

### Atualizações Futuras

Este documento deve ser atualizado quando:
- Novos problemas forem resolvidos
- Migrações técnicas forem realizadas
- Convenções mudarem
- Soluções workaround forem implementadas

**Formato:** Adicionar na seção apropriada com data e descrição clara.
