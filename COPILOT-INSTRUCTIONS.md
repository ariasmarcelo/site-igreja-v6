# 🤖 AI Memory - GitHub Copilot# 🤖 AI Memory - GitHub Copilot# 🤖 AI Memory - GitHub Copilot# 🤖 AI Memory - GitHub Copilot



> **Última atualização:** 10 de novembro de 2025  

> **Versão:** site-igreja-v6  

> **Repositório:** ariasmarcelo/site-igreja-v6  > **Última atualização:** 10 de novembro de 2025  

> **Status:** ✅ Funcional | Documentação consolidada

> **Versão:** site-igreja-v6  

---

> **Repositório:** ariasmarcelo/site-igreja-v6  > **Última atualização:** 10 de novembro de 2025  > **Última atualização:** 10 de novembro de 2025  

## 🎯 Propósito

> **Status:** ✅ Funcional | Documentação consolidada

Memória persistente entre sessões. **Leia PRIMEIRO ao iniciar sessão.**

> **Versão:** site-igreja-v6  > **Versão:** site-igreja-v6  

---

---

## 🔄 Protocolo de Reset

> **Repositório:** ariasmarcelo/site-igreja-v6  > **Repositório:** ariasmarcelo/site-igreja-v6  

**Gatilhos:** "releia do zero", "comece sem contexto", "restaure contexto"

## 🎯 Propósito

**Ação:**

1. Ler este arquivo completo> **Status:** ✅ Funcional | Refatoração arquitetural concluída> **Status:** ✅ Funcional | Antahkarana integrado | Documentação consolidada

2. Confirmar: "✅ Contexto restaurado. [resumo]"

3. Aguardar instruçãoMemória persistente entre sessões. **Leia PRIMEIRO ao iniciar sessão.**



---



## 📋 Checklist Obrigatório---



### ✅ 0. Verificar Servidores------



**Script automatizado:**## 🔄 Protocolo de Reset

```powershell

pnpm check

```

**Gatilhos:** "releia do zero", "comece sem contexto", "restaure contexto"

**Manual:**

```powershell## 🎯 Propósito## 🎯 Propósito

netstat -ano | findstr :8080  # Frontend

netstat -ano | findstr :3001  # Backend**Ação:**

curl http://localhost:8080 -UseBasicParsing -TimeoutSec 5

curl http://localhost:3001/health -UseBasicParsing -TimeoutSec 51. Ler este arquivo completo

```

2. Confirmar: "✅ Contexto restaurado. [resumo]"

**Quando necessário:**

- Admin Console: Frontend ✅ + Backend ✅3. Aguardar instruçãoMemória persistente entre sessões. **Leia PRIMEIRO ao iniciar sessão.**Memória persistente entre sessões do GitHub Copilot.

- Visualizar site: Frontend ✅

- Scripts/Build/Deploy: Nenhum



### ✅ 1. Documentação---



- `README.md` - Setup rápido, comandos

- `COPILOT-INSTRUCTIONS.md` (este) - AI memory

- `TECHNICAL-NOTES.md` - Soluções, histórico## 📋 Checklist Obrigatório---**Ao iniciar sessão:** Leia este arquivo PRIMEIRO  



### ✅ 2. Configuração



- `package.json` - Scripts, dependências### ✅ 0. Verificar Servidores**Durante sessão:** Atualize quando aprender algo novo  

- `vite.config.ts` - `base: '/site-igreja-v6/'`

- `src/App.tsx` - `basename: '/site-igreja-v6'` (DEVE corresponder!)

- `.env.local` - Credenciais Supabase

**Script automatizado:**## 🔄 Protocolo de Reset**Antes de encerrar:** Documente descobertas importantes

---

```powershell

## ⚠️ FLUXO DE DADOS CRÍTICO

pnpm check

**ÚNICA FONTE:** Supabase PostgreSQL

```

### Arquitetura (Refatorada 10/11/2025)

**Gatilhos:** "releia do zero", "comece sem contexto", "restaure contexto"---

**1. Supabase (100% dos dados em produção)**

- Tabelas: `page_contents`, `page_styles`**Manual:**

- Hook: `useLocaleTexts()` → `{ texts, loading, error }`

- Retorna `null` inicialmente, popula após fetch```powershell

- Admin Console salva DIRETO no Supabase

netstat -ano | findstr :8080  # Frontend

**2. JSON locais (`src/locales/pt-BR/*.json`)**

- **APENAS tipagem TypeScript:** `type PageTexts = typeof fallbackTexts`netstat -ano | findstr :3001  # Backend**Ação:**## 🔄 Protocolo de Reset

- **NÃO carregados em runtime**

- Backups em: `src/locales/pt-BR/backups/`curl http://localhost:8080 -UseBasicParsing -TimeoutSec 5

- Atualizar apenas se estrutura de tipos mudar

curl http://localhost:3001/health -UseBasicParsing -TimeoutSec 51. Ler este arquivo completo

### Padrão de Página (Novo)

```

```typescript

import fallbackTexts from '@/locales/pt-BR/Index.json';2. Confirmar: "✅ Contexto restaurado. [resumo]"**Gatilhos:** "releia do zero", "comece sem contexto", "restaure contexto"

type IndexTexts = typeof fallbackTexts;

**Quando necessário:**

export default function Index() {

  const { texts, loading, error } = useLocaleTexts<IndexTexts>('index', fallbackTexts);- Admin Console: Frontend ✅ + Backend ✅3. Aguardar instrução

  

  return (- Visualizar site: Frontend ✅

    <PageLoader loading={loading} error={error}>

      {!texts ? null : (- Scripts/Build/Deploy: Nenhum**Sequência:**

        /* conteúdo usando texts */

      )}

    </PageLoader>

  );### ✅ 1. Documentação---1. Ler este arquivo completo

}

```



**Componente criado:** `PageLoader.tsx` (10/11/2025)- `README.md` - Setup rápido, comandos2. Confirmar: "✅ Contexto restaurado. [resumo: projeto, stack, última mudança]"



---- `COPILOT-INSTRUCTIONS.md` (este) - AI memory



## 🚀 Stack Tecnológica- `TECHNICAL-NOTES.md` - Soluções, histórico## 📋 Checklist Obrigatório3. Aguardar instrução



```

Frontend:         Vite 7.2 | React 19 | TypeScript 5.7 | Tailwind 4

Routing:          React Router 7 (basename: '/site-igreja-v6')### ✅ 2. Configuração

Backend:          Express 4.21 (porta 3001) | Supabase PostgreSQL

Dev:              pnpm 8.10 | ESLint 9.17

Deploy:           GitHub Pages

URL Produção:     https://ariasmarcelo.github.io/site-igreja-v6/- `package.json` - Scripts, dependências### ✅ 0. Verificar Servidores---

```

- `vite.config.ts` - `base: '/site-igreja-v6/'`

---

- `src/App.tsx` - `basename: '/site-igreja-v6'` (DEVE corresponder!)

## 🔧 Comandos Essenciais

- `.env.local` - Credenciais Supabase

```powershell

# Desenvolvimento**Script automatizado:**## 📋 Checklist de Retomada

pnpm dev              # Frontend (8080)

pnpm server           # Backend (3001)---

pnpm check            # Verificar servidores

```powershell

# Build/Deploy

pnpm build            # Gerar dist/## ⚠️ FLUXO DE DADOS CRÍTICO

pnpm deploy           # Build + push GitHub Pages

pnpm deploy:bg        # Deploy em backgroundpnpm check### ✅ 0. Verificar Servidores (SEMPRE PRIMEIRO)



# Supabase**ÚNICA FONTE:** Supabase PostgreSQL

pnpm backup           # Backup completo

pnpm list-backups     # Listar backups```

pnpm restore:latest   # Restaurar último

### Arquitetura (Refatorada 10/11/2025)

# Sync (JSON → Supabase)

node scripts/update-purificacao-db.js**Script automatizado:**

node scripts/check-purificacao-db.js

```**1. Supabase (100% dos dados em produção)**



---- Tabelas: `page_contents`, `page_styles`**Manual:**```powershell



## 🚫 Proibições- Hook: `useLocaleTexts()` → `{ texts, loading, error }`



❌ **Warnings/erros:** Zero tolerância - corrija IMEDIATAMENTE  - Retorna `null` inicialmente, popula após fetch```powershellpnpm check

❌ **Modificar sem compreender:** Sempre verificar contexto completo  

❌ **basename/base mismatch:** App.tsx DEVE = vite.config.ts  - Admin Console salva DIRETO no Supabase

❌ **JSON local como fonte:** Site carrega APENAS do Supabase  

❌ **Assumir funcionamento:** SEMPRE testar localmente antes de deploy  netstat -ano | findstr :8080  # Frontend# OU



✅ **Sempre:** Use `semantic_search` para encontrar referências  **2. JSON locais (`src/locales/pt-BR/*.json`)**

✅ **Sempre:** Pergunte ao usuário quando incerto  

✅ **Sempre:** Mencione CTRL+F5 após deploy (cache)  - **APENAS tipagem TypeScript:** `type PageTexts = typeof fallbackTexts`netstat -ano | findstr :3001  # Backend.\check-servers.ps1



---- **NÃO carregados em runtime**



## 📐 Padrões- Backups em: `src/locales/pt-BR/backups/`curl http://localhost:8080 -UseBasicParsing -TimeoutSec 5```



### Nomenclatura- Atualizar apenas se estrutura de tipos mudar



```curl http://localhost:3001/health -UseBasicParsing -TimeoutSec 5

Docs:        UPPERCASE-HYPHEN.md

Scripts:     lowercase-hyphen.js### Padrão de Página (Novo)

Components:  PascalCase.tsx

Hooks:       camelCase.ts```**Manual:**

Data:        PascalCase.json

``````typescript



### Commitsimport fallbackTexts from '@/locales/pt-BR/Index.json';```powershell



```type IndexTexts = typeof fallbackTexts;

feat:     nova funcionalidade

fix:      correção de bug**Quando necessário:**# Verificar portas

docs:     atualização de documentação

refactor: refatoração de códigoexport default function Index() {

chore:    tarefas de manutenção

```  const { texts, loading, error } = useLocaleTexts<IndexTexts>('index', fallbackTexts);- Admin Console: Frontend ✅ + Backend ✅netstat -ano | findstr :8080  # Frontend



---  



## 🔍 Troubleshooting Rápido  return (- Visualizar site: Frontend ✅netstat -ano | findstr :3001  # Backend



| Problema | Solução |    <PageLoader loading={loading} error={error}>

|----------|---------|

| Conteúdo antigo após deploy | CTRL+F5 (cache) |      {!texts ? null : (- Scripts/Build/Deploy: Nenhum

| "API não está rodando" | `pnpm server` (porta 3001) |

| Página em branco | Verificar basename = base URL |        /* conteúdo usando texts */

| JSON editado mas não aparece | Sync com `update-*-db.js` |

| Servidor não responde | `taskkill /PID [número] /F` + reiniciar |      )}# Health check



**Detalhes:** Ver `TECHNICAL-NOTES.md`    </PageLoader>



---  );### ✅ 1. Documentaçãocurl http://localhost:8080 -UseBasicParsing -TimeoutSec 5



## 🌐 URLs Importantes}



``````curl http://localhost:3001/health -UseBasicParsing -TimeoutSec 5

Produção:  https://ariasmarcelo.github.io/site-igreja-v6/

Local:     http://localhost:8080

Admin:     http://localhost:8080/436F6E736F6C45

API:       http://localhost:3001/health**Componente criado:** `PageLoader.tsx` (10/11/2025)- `README.md` - Setup rápido, comandos```

GitHub:    https://github.com/ariasmarcelo/site-igreja-v6

```



------- `COPILOT-INSTRUCTIONS.md` (este) - AI memory



## 📚 Contexto Espiritual



**Igreja de Metatron** - Portal de transformação espiritual## 🚀 Stack Tecnológica- `TECHNICAL-NOTES.md` - Soluções, histórico**Ações:**



**Fase 1:** Purificação (limpeza energética)  

**Fase 2:** Aprofundamento (expansão de consciência)  

**Fase 3:** Iniciação (Ativação do Antahkarana)```- Sem PID: `pnpm dev` / `pnpm server`



**Antahkarana (अन्तःकरण):**  Frontend:         Vite 7.2 | React 19 | TypeScript 5.7 | Tailwind 4

Ponte de luz entre personalidade e Eu Superior. Canal espiritual construído através da meditação. Tema central da Fase 3 (integrado em 10/11/2025).

Routing:          React Router 7 (basename: '/site-igreja-v6')### ✅ 2. Configuração- Com PID mas não responde: `taskkill /PID [número] /F` + reiniciar

**⚠️ Importante:** Respeite contexto espiritual ao editar textos.

Backend:          Express 4.21 (porta 3001) | Supabase PostgreSQL

---

Dev:              pnpm 8.10 | ESLint 9.17

## 📝 Learning Log

Deploy:           GitHub Pages

### 10/11/2025 - Refatoração Arquitetural + Consolidação de Docs

URL Produção:     https://ariasmarcelo.github.io/site-igreja-v6/- `package.json` - Scripts, dependências**Quando necessário:**

**Mudanças:**

1. ✅ Refatorado `useLocaleTexts`: Retorna `{ texts, loading, error }` (antes retornava só `T`)```

2. ✅ Criado `PageLoader.tsx`: Wrapper para loading/error states

3. ✅ JSON local reorganizado: 25 backups → `backups/`, 8 ativos na raiz- `vite.config.ts` - `base: '/site-igreja-v6/'`| Tarefa | Frontend | Backend |

4. ✅ Papel do JSON local redefinido: **APENAS tipagem**, não runtime

5. ✅ Documentação consolidada:---

   - `COPILOT-INSTRUCTIONS.md`: 914 → 350 linhas (-62%)

   - `README.md`: 702 → 419 linhas (-40%)- `src/App.tsx` - `basename: '/site-igreja-v6'` (DEVE corresponder!)|--------|----------|---------|

   - Criado `TECHNICAL-NOTES.md`: 431 linhas (consolida 5 docs)

   - Removidos: SOLUTION_SUMMARY, SUPABASE_INTEGRATION, README-DEPLOY, FIX_DATA_JSON_KEY, README-SERVER## 🔧 Comandos Essenciais



**Páginas atualizadas:**- `.env.local` - Credenciais Supabase| Visualizar site | ✅ | ❌ |

- ✅ Index.tsx, Purificacao.tsx, Contato.tsx (com PageLoader)

- ⏳ QuemSomos.tsx, Tratamentos.tsx, Testemunhos.tsx, Artigos.tsx, NotFound.tsx (imports ok, falta wrap)```powershell



**Scripts criados:**# Desenvolvimento| Admin Console | ✅ | ✅ |

- `check-servers.ps1`: Verificação 3 etapas (porta → health → diagnóstico)

- Comandos adicionados: `pnpm check`, `pnpm check-servers`pnpm dev              # Frontend (8080)



**Conceito integrado:**pnpm server           # Backend (3001)---| Scripts sync | ❌ | ❌ |

- Antahkarana: 6 menções na Fase 3 de Purificação

- Backup: `Purificacao_backup_2025-11-10_15-11-38.json`pnpm check            # Verificar servidores



**Lições aprendidas:**| Build/Deploy | ❌ | ❌ |

- basename (React Router) DEVE = base (Vite), senão página em branco

- JSON local NÃO é carregado no site (comum equívoco)# Build/Deploy

- Servidor pode estar "rodando" (PID na porta) mas travado (não responde)

- Cache agressivo do GitHub Pages: Sempre avisar CTRL+F5pnpm build            # Gerar dist/## ⚠️ FLUXO DE DADOS CRÍTICO



---pnpm deploy           # Build + push GitHub Pages



## ✅ Checklist Pré-Açãopnpm deploy:bg        # Deploy em background### ✅ **1. LEITURA OBRIGATÓRIA DE DOCUMENTAÇÃO**



Antes de QUALQUER modificação:



- [ ] Li documentação relevante# Supabase**ÚNICA FONTE:** Supabase PostgreSQL

- [ ] Entendi fluxo de dados (Supabase = fonte única)

- [ ] Verifiquei arquivos relacionados (`semantic_search`)pnpm backup           # Backup completo

- [ ] Servidor rodando se necessário

- [ ] Backup se modificação críticapnpm list-backups     # Listar backups**Busque e leia arquivos com estas características:**

- [ ] Zero warnings/erros

- [ ] Sei reverter (`git log` + `git revert`)pnpm restore:latest   # Restaurar último

- [ ] `.env.local` configurado

### Arquitetura (Refatorada 10/11/2025)

---

# Sync (JSON → Supabase)

## 🎯 Sessão Atual (Resumo)

node scripts/update-purificacao-db.js```

**Data:** 10/11/2025  

**Foco:** Consolidação completa de documentaçãonode scripts/check-purificacao-db.js



**Concluído:**```**1. Supabase (100% dos dados em produção)**Padrão de busca: **/*README*.md

1. ✅ Criado `TECHNICAL-NOTES.md` (431 linhas) - Consolida 5 documentos

2. ✅ Refatorado `COPILOT-INSTRUCTIONS.md` (914 → 350 linhas, -62%)

3. ✅ Refatorado `README.md` (702 → 419 linhas, -40%)

4. ✅ Removidos 5 documentos obsoletos---- Tabelas: `page_contents`, `page_styles`Prioridade de leitura:

5. ✅ Atualizada referência em `scripts/README.md`



**Resultado final:**

- **Redução total:** ~1.200 linhas removidas## 🚫 Proibições- Hook: `useLocaleTexts()` → `{ texts, loading, error }`1. README.md (raiz) - visão geral do projeto

- **3 documentos principais:** README (419), COPILOT-INSTRUCTIONS (350), TECHNICAL-NOTES (431)

- **Nenhuma informação perdida:** Todo conteúdo preservado e reorganizado

- **Documentação otimizada:** Direta, sem redundâncias, fácil navegação

❌ **Warnings/erros:** Zero tolerância - corrija IMEDIATAMENTE  - Retorna `null` inicialmente, popula após fetch2. SOLUTION*.md - arquitetura e solução

❌ **Modificar sem compreender:** Sempre verificar contexto completo  

❌ **basename/base mismatch:** App.tsx DEVE = vite.config.ts  - Admin Console salva DIRETO no Supabase3. *SUPABASE*.md - banco de dados e integração

❌ **JSON local como fonte:** Site carrega APENAS do Supabase  

❌ **Assumir funcionamento:** SEMPRE testar localmente antes de deploy  4. *DEPLOY*.md - processo de deploy



✅ **Sempre:** Use `semantic_search` para encontrar referências  **2. JSON locais (`src/locales/pt-BR/*.json`)**5. *VERSIONAMENTO*.md - controle de versão

✅ **Sempre:** Pergunte ao usuário quando incerto  

✅ **Sempre:** Mencione CTRL+F5 após deploy (cache)  - **APENAS tipagem TypeScript:** `type PageTexts = typeof fallbackTexts`6. *CONVENTION*.md - convenções e padrões



---- **NÃO carregados em runtime**7. server/README*.md - backend API



## 📐 Padrões- Backups em: `src/locales/pt-BR/backups/`8. scripts/README*.md - automações



### Nomenclatura- Atualizar apenas se estrutura de tipos mudar



```Comando sugerido:

Docs:        UPPERCASE-HYPHEN.md

Scripts:     lowercase-hyphen.js### Padrão de Página (Novo)file_search({ query: "**/*.md" })

Components:  PascalCase.tsx

Hooks:       camelCase.ts```

Data:        PascalCase.json

``````typescript



### Commitsimport fallbackTexts from '@/locales/pt-BR/Index.json';### ✅ **2. ANÁLISE DE CONFIGURAÇÃO**



```type IndexTexts = typeof fallbackTexts;

feat:     nova funcionalidade

fix:      correção de bug**Busque e examine arquivos de configuração:**

docs:     atualização de documentação

refactor: refatoração de códigoexport default function Index() {

chore:    tarefas de manutenção

```  const { texts, loading, error } = useLocaleTexts<IndexTexts>('index', fallbackTexts);```



---  Padrão: **/package.json, **/*.config.{js,ts}, **/tsconfig*.json



## 🔍 Troubleshooting Rápido  return (Arquivos críticos:



| Problema | Solução |    <PageLoader loading={loading} error={error}>- package.json (dependências, scripts, versões)

|----------|---------|

| Conteúdo antigo após deploy | CTRL+F5 (cache) |      {!texts ? null : (- vite.config.ts (build, base URL, portas)

| "API não está rodando" | `pnpm server` (porta 3001) |

| Página em branco | Verificar basename = base URL |        /* conteúdo usando texts */- tsconfig*.json (TypeScript, paths, aliases)

| JSON editado mas não aparece | Sync com `update-*-db.js` |

| Servidor não responde | `taskkill /PID [número] /F` + reiniciar |      )}- eslint.config.js (regras de linting)



**Detalhes:** Ver `TECHNICAL-NOTES.md`    </PageLoader>- postcss.config.js (processamento CSS)



---  );- .env.example (variáveis de ambiente necessárias)



## 🌐 URLs Importantes}



``````Comando sugerido:

Produção:  https://ariasmarcelo.github.io/site-igreja-v6/

Local:     http://localhost:8080file_search({ query: "**/{package.json,*.config.*,tsconfig*.json,.env.example}" })

Admin:     http://localhost:8080/436F6E736F6C45

API:       http://localhost:3001/health**Componente criado:** `PageLoader.tsx` (10/11/2025)```

GitHub:    https://github.com/ariasmarcelo/site-igreja-v6

```



------### ✅ **3. COMPREENSÃO DA ARQUITETURA**



## 📚 Contexto Espiritual



**Igreja de Metatron** - Portal de transformação espiritual## 🚀 Stack TecnológicaAnalise a estrutura do código:



**Fase 1:** Purificação (limpeza energética)  

**Fase 2:** Aprofundamento (expansão de consciência)  

**Fase 3:** Iniciação (Ativação do Antahkarana)``````



**Antahkarana (अन्तःकरण):**  Frontend:         Vite 7.2 | React 19 | TypeScript 5.7 | Tailwind 4src/

Ponte de luz entre personalidade e Eu Superior. Canal espiritual construído através da meditação. Tema central da Fase 3 (integrado em 10/11/2025).

Routing:          React Router 7 (basename: '/site-igreja-v6')├── components/      # Componentes React reutilizáveis

**⚠️ Importante:** Respeite contexto espiritual ao editar textos.

Backend:          Express 4.21 (porta 3001) | Supabase PostgreSQL│   ├── ui/          # Componentes Shadcn/UI

---

Dev:              pnpm 8.10 | ESLint 9.17│   ├── BlogEditor.tsx

## 📝 Learning Log

Deploy:           GitHub Pages│   ├── TiptapEditor.tsx

### 10/11/2025 - Refatoração Arquitetural + Consolidação de Docs

URL Produção:     https://ariasmarcelo.github.io/site-igreja-v6/│   ├── VisualPageEditor.tsx

**Mudanças:**

1. ✅ Refatorado `useLocaleTexts`: Retorna `{ texts, loading, error }` (antes retornava só `T`)```│   └── WhatsAppButton.tsx

2. ✅ Criado `PageLoader.tsx`: Wrapper para loading/error states

3. ✅ JSON local reorganizado: 25 backups → `backups/`, 8 ativos na raiz├── pages/           # Páginas principais

4. ✅ Papel do JSON local redefinido: **APENAS tipagem**, não runtime

5. ✅ Documentação consolidada:---├── hooks/           # Custom hooks (useLocaleTexts, usePageStyles)

   - `COPILOT-INSTRUCTIONS.md`: 914 → 350 linhas (-62%)

   - `README.md`: 702 → 419 linhas (-40%)├── lib/             # Bibliotecas (Supabase client)

   - Criado `TECHNICAL-NOTES.md`: 431 linhas (consolida 5 docs)

   - Removidos: SOLUTION_SUMMARY, SUPABASE_INTEGRATION, README-DEPLOY, FIX_DATA_JSON_KEY, README-SERVER## 🔧 Comandos Essenciais├── locales/pt-BR/   # Arquivos JSON de conteúdo



**Páginas atualizadas:**└── config/          # Configurações (api.ts)

- ✅ Index.tsx, Purificacao.tsx, Contato.tsx (com PageLoader)

- ⏳ QuemSomos.tsx, Tratamentos.tsx, Testemunhos.tsx, Artigos.tsx, NotFound.tsx (imports ok, falta wrap)```powershell



**Scripts criados:**# Desenvolvimentoserver/

- `check-servers.ps1`: Verificação 3 etapas (porta → health → diagnóstico)

- Comandos adicionados: `pnpm check`, `pnpm check-servers`pnpm dev              # Frontend (8080)├── express-server.js    # API backend



**Conceito integrado:**pnpm server           # Backend (3001)└── supabase-routes.js   # Rotas Supabase

- Antahkarana: 6 menções na Fase 3 de Purificação

- Backup: `Purificacao_backup_2025-11-10_15-11-38.json`pnpm check            # Verificar servidores



**Lições aprendidas:**scripts/

- basename (React Router) DEVE = base (Vite), senão página em branco

- JSON local NÃO é carregado no site (comum equívoco)# Build/Deploy├── deploy.ps1                    # Deploy para GitHub Pages

- Servidor pode estar "rodando" (PID na porta) mas travado (não responde)

- Cache agressivo do GitHub Pages: Sempre avisar CTRL+F5pnpm build            # Gerar dist/├── backup-supabase.js            # Backup do Supabase



---pnpm deploy           # Build + push GitHub Pages├── restore-supabase.js           # Restore de backups



## ✅ Checklist Pré-Açãopnpm deploy:bg        # Deploy em background├── update-purificacao-db.js      # Sync específico



Antes de QUALQUER modificação:├── check-purificacao-db.js       # Verificação de dados



- [ ] Li documentação relevante# Supabase└── fix-ids.js                    # Correção de IDs duplicados

- [ ] Entendi fluxo de dados (Supabase = fonte única)

- [ ] Verifiquei arquivos relacionados (`semantic_search`)pnpm backup           # Backup completo```

- [ ] Servidor rodando se necessário

- [ ] Backup se modificação críticapnpm list-backups     # Listar backups

- [ ] Zero warnings/erros

- [ ] Sei reverter (`git log` + `git revert`)pnpm restore:latest   # Restaurar último### ✅ **4. FLUXO DE DADOS - ENTENDIMENTO CRÍTICO** ⚠️ **ATUALIZADO 10/11/2025**

- [ ] `.env.local` configurado



---

# Sync (JSON → Supabase)**IMPORTANTE:** O conteúdo do site funciona com **FONTE ÚNICA**:

## 🎯 Sessão Atual (Resumo)

node scripts/update-purificacao-db.js

**Data:** 10/11/2025  

**Foco:** Consolidação completa de documentaçãonode scripts/check-purificacao-db.js**📊 ARQUITETURA ATUAL (após refatoração de 10/11/2025):**



**Concluído:**```

1. ✅ Criado `TECHNICAL-NOTES.md` (431 linhas) - Consolida 5 documentos

2. ✅ Refatorado `COPILOT-INSTRUCTIONS.md` (914 → 350 linhas, -62%)1. **Supabase (PostgreSQL)** - **ÚNICA FONTE DA VERDADE**

3. ✅ Refatorado `README.md` (702 → 419 linhas, -40%)

4. ✅ Removidos 5 documentos obsoletos---   - Tabelas: `page_contents` (JSON) e `page_styles` (CSS)

5. ✅ Atualizada referência em `scripts/README.md`

   - Hook `useLocaleTexts` busca **EXCLUSIVAMENTE** do Supabase

**Resultado final:**

- **Redução total:** ~1.200 linhas removidas## 🚫 Proibições   - Retorna: `{ texts, loading, error }`

- **3 documentos principais:** README (419), COPILOT-INSTRUCTIONS (350), TECHNICAL-NOTES (431)

- **Nenhuma informação perdida:** Todo conteúdo preservado e reorganizado   - Loading state enquanto busca dados

- **Documentação otimizada:** Direta, sem redundâncias, fácil navegação

❌ **Warnings/erros:** Zero tolerância - corrija IMEDIATAMENTE     - Error state se falhar conexão

❌ **Modificar sem compreender:** Sempre verificar contexto completo     - Editor visual salva DIRETO no Supabase

❌ **basename/base mismatch:** App.tsx DEVE = vite.config.ts     - Usa `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` para leitura

❌ **JSON local como fonte:** Site carrega APENAS do Supabase     - Usa `SUPABASE_SERVICE_KEY` para escrita admin (scripts)

❌ **Assumir funcionamento:** SEMPRE testar localmente antes de deploy  

2. **Arquivos JSON locais** (`src/locales/pt-BR/*.json`) - **APENAS TIPAGEM**

✅ **Sempre:** Use `semantic_search` para encontrar referências     - **NÃO são carregados em runtime** (exceto como fallback inicial opcional)

✅ **Sempre:** Pergunte ao usuário quando incerto     - Usados APENAS para gerar tipos TypeScript: `type PageTexts = typeof fallbackTexts`

✅ **Sempre:** Mencione CTRL+F5 após deploy (cache)     - Backups movidos para: `src/locales/pt-BR/backups/`

   - Arquivos ativos: `Purificacao.json`, `Index.json`, `Contato.json`, etc.

---   - Propósito: TypeScript autocomplete e validação de tipos



## 📐 Padrões**🔄 FLUXO DE DADOS ATUAL:**



### Nomenclatura```typescript

// Hook atualizado (useLocaleTexts.ts)

```export function useLocaleTexts<T>(pageId: string, fallbackData?: T): {

Docs:        UPPERCASE-HYPHEN.md  texts: T | null;

Scripts:     lowercase-hyphen.js  loading: boolean;

Components:  PascalCase.tsx  error: string | null;

Hooks:       camelCase.ts}

Data:        PascalCase.json

```// Uso nas páginas

const { texts, loading, error } = useLocaleTexts<IndexTexts>('index', fallbackTexts);

### Commits

// PageLoader component (criado em 10/11/2025)

```<PageLoader loading={loading} error={error}>

feat:     nova funcionalidade  {!texts ? null : (

fix:      correção de bug    // Conteúdo da página

docs:     atualização de documentação  )}

refactor: refatoração de código</PageLoader>

chore:    tarefas de manutenção```

```

**⚠️ REGRAS ATUALIZADAS:**

---

- ✅ **Modificações:** Devem ser feitas DIRETO no Supabase (Admin Console ou scripts)

## 🔍 Troubleshooting Rápido- ✅ **Scripts sync:** `update-*-db.js` para atualizar Supabase com JSON local (se necessário)

- ✅ **Verificação:** `check-*-db.js` após atualizar

| Problema | Solução |- ✅ **Backup:** Mantém-se importante para restore: `Purificacao_backup_YYYY-MM-DD_HH-MM-SS.json`

|----------|---------|- ✅ **JSON local:** Atualizar apenas se estrutura de tipos mudar

| Conteúdo antigo após deploy | CTRL+F5 (cache) |- ❌ **Não usar:** JSON local como fonte de conteúdo em produção

| "API não está rodando" | `pnpm server` (porta 3001) |

| Página em branco | Verificar basename = base URL |### ✅ **5. STACK TECNOLÓGICA COMPLETA**

| JSON editado mas não aparece | Sync com `update-*-db.js` |

| Servidor não responde | `taskkill /PID [número] /F` + reiniciar |```

Frontend:

**Detalhes:** Ver `TECHNICAL-NOTES.md`- Vite 7.2 (build tool, dev server)

- React 19.0.0 (UI framework)

---- TypeScript 5.7.2 (type safety)

- Tailwind CSS 4.0.0 (styling)

## 🌐 URLs Importantes- React Router 7.1.1 (routing, basename: '/site-igreja-v6')

- Shadcn/UI (component library)

```- Tiptap (rich text editor)

Produção:  https://ariasmarcelo.github.io/site-igreja-v6/- Lucide React (icons)

Local:     http://localhost:8080

Admin:     http://localhost:8080/436F6E736F6C45Backend:

API:       http://localhost:3001/health- Express.js 4.21.1 (API server, port 3001)

GitHub:    https://github.com/ariasmarcelo/site-igreja-v6- Supabase JS Client 2.46.2 (database connection)

```- PostgreSQL via Supabase (cloud database)



---Desenvolvimento:

- pnpm@8.10.0 (package manager)

## 📚 Contexto Espiritual- ESLint 9.17.0 (linting)

- PostCSS 8.4.49 (CSS processing)

**Igreja de Metatron** - Portal de transformação espiritual- PowerShell (deploy scripts)



**Fase 1:** Purificação (limpeza energética)  Deploy:

**Fase 2:** Aprofundamento (expansão de consciência)  - GitHub Pages (produção)

**Fase 3:** Iniciação (Ativação do Antahkarana)- Base URL: /site-igreja-v6/

- Repository: ariasmarcelo/site-igreja-v6

**Antahkarana (अन्तःकरण):**  ```

Ponte de luz entre personalidade e Eu Superior. Canal espiritual construído através da meditação. Tema central da Fase 3 (integrado em 10/11/2025).

### ✅ **6. VARIÁVEIS DE AMBIENTE OBRIGATÓRIAS**

**⚠️ Importante:** Respeite contexto espiritual ao editar textos.

```env

---# Supabase - Banco de dados (OBRIGATÓRIO)

VITE_SUPABASE_URL=https://seu-projeto.supabase.co

## 📝 Learning LogVITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...



### 10/11/2025 - Refatoração Arquitetural + Consolidação de Docs# Supabase Service Role (para scripts admin)

SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

**Mudanças:**

1. ✅ Refatorado `useLocaleTexts`: Retorna `{ texts, loading, error }` (antes retornava só `T`)# API Backend (desenvolvimento)

2. ✅ Criado `PageLoader.tsx`: Wrapper para loading/error statesVITE_API_URL=http://localhost:3001

3. ✅ JSON local reorganizado: 25 backups → `backups/`, 8 ativos na raiz

4. ✅ Papel do JSON local redefinido: **APENAS tipagem**, não runtime# Produção (GitHub Pages)

5. ✅ Documentação consolidada:VITE_BASE_URL=/site-igreja-v6/

   - `COPILOT-INSTRUCTIONS.md`: 914 → 350 linhas (-62%)```

   - `README.md`: 702 → ~250 linhas (pendente)

   - Criado `TECHNICAL-NOTES.md`: Consolida 5 docs (SOLUTION_SUMMARY, SUPABASE_INTEGRATION, README-DEPLOY, FIX_DATA_JSON_KEY, README-SERVER)**Arquivo:** `.env.local` (NÃO commitar!)

**Template:** `.env.example` (commitado no repositório)

**Páginas atualizadas:**

- ✅ Index.tsx, Purificacao.tsx, Contato.tsx (com PageLoader)---

- ⏳ QuemSomos.tsx, Tratamentos.tsx, Testemunhos.tsx, Artigos.tsx, NotFound.tsx (imports ok, falta wrap)

## 🚫 **PROIBIÇÕES ABSOLUTAS**

**Scripts criados:**

- `check-servers.ps1`: Verificação 3 etapas (porta → health → diagnóstico)### **1. ZERO TOLERÂNCIA A WARNINGS/ERROS**

- Comandos adicionados: `pnpm check`, `pnpm check-servers`

```

**Conceito integrado:**❌ NUNCA aceite ou ignore:

- Antahkarana: 6 menções na Fase 3 de Purificação- Warnings de compilação

- Backup: `Purificacao_backup_2025-11-10_15-11-38.json`- Erros não-críticos

- Deprecation warnings

**Lições aprendidas:**- Sugestões de atualização

- basename (React Router) DEVE = base (Vite), senão página em branco- "This will be removed in future versions"

- JSON local NÃO é carregado no site (comum equívoco)- Erros de TypeScript

- Servidor pode estar "rodando" (PID na porta) mas travado (não responde)- Problemas de ESLint

- Cache agressivo do GitHub Pages: Sempre avisar CTRL+F5```



---**Ação obrigatória:** Corrija IMEDIATAMENTE. Se não tiver compreensão completa, **pergunte ao usuário** antes de prosseguir.



## ✅ Checklist Pré-Ação**Exceções conhecidas:**

- Warnings de build do Vite sobre dependências podem ser investigados mas não bloqueiam deploy

Antes de QUALQUER modificação:- Console logs em desenvolvimento são aceitáveis (remover em produção)



- [ ] Li documentação relevante### **2. BIBLIOTECAS E DEPENDÊNCIAS**

- [ ] Entendi fluxo de dados (Supabase = fonte única)

- [ ] Verifiquei arquivos relacionados (`semantic_search`)```

- [ ] Servidor rodando se necessário✅ APENAS bibliotecas modernas e atuais

- [ ] Backup se modificação crítica✅ Versões estáveis (não beta/alpha)

- [ ] Zero warnings/erros✅ Documentação ativa e mantida

- [ ] Sei reverter (`git log` + `git revert`)❌ NUNCA use bibliotecas deprecated

- [ ] `.env.local` configurado❌ NUNCA use versões antigas "porque funciona"

```

---

### **3. CRIAÇÃO DE ARQUIVOS TEMPORÁRIOS**

## 🎯 Sessão Anterior (Resumo)

```

**Data:** 10/11/2025  ✅ Scripts temporários/teste → /scripts/temp/

**Foco:** Consolidação de documentação✅ Arquivos de debug → /temp/ ou /debug/

❌ NUNCA crie arquivos avulsos na raiz

**Realizações:**❌ NUNCA crie em diretórios de código-fonte

1. ✅ Criado `TECHNICAL-NOTES.md` (conhecimento consolidado)```

2. ✅ Refatorado `COPILOT-INSTRUCTIONS.md` (914 → 350 linhas)

3. ⏳ Refatorar `README.md` (próximo)### **4. MODIFICAÇÕES SEM COMPREENSÃO**

4. ⏳ Remover 5 docs obsoletos (próximo)

5. ⏳ Atualizar referências cruzadas (próximo)```

❌ NUNCA faça mudanças antes de entender TODO o contexto

**Contexto atual:**❌ NUNCA assuma que entendeu sem verificar

Documentação estava redundante e verbosa. Usuário solicitou consolidação sem perda de informação. Primeira etapa concluída com sucesso.❌ NUNCA use "isso deve funcionar" como justificativa

❌ NUNCA modifique configs sem compreender impacto completo
❌ NUNCA altere basename/base URL sem verificar TODOS os arquivos afetados
✅ SEMPRE leia código relacionado antes de modificar
✅ SEMPRE verifique impactos em outros arquivos
✅ SEMPRE teste localmente antes de deploy
✅ SEMPRE peça que testes sejam rodados pelo usuário antes de deploy
✅ SEMPRE use semantic_search para encontrar todas as referências
✅ SEMPRE descreva e pergunte ao usuário quando incerto
```

### **5. CACHE DO NAVEGADOR - PROBLEMA CONHECIDO**

```
⚠️ PROBLEMA COMUM: Após deploy, site mostra conteúdo antigo
✅ SOLUÇÃO: Hard refresh com CTRL+F5 (Windows) ou CMD+SHIFT+R (Mac)
✅ AVISO: Sempre mencionar ao usuário após deploy
✅ VERIFICAÇÃO: Usar DevTools > Network > Disable cache para teste
```

---

## 📐 **PADRÕES E MELHORES PRÁTICAS**

### **1. Nomenclatura de Arquivos**

```
Documentação:    UPPERCASE-HYPHEN.md (README-BACKUP.md)
Scripts:         lowercase-hyphen.js (backup-supabase.js)
Componentes:     PascalCase.tsx (BlogEditor.tsx)
Utilitários:     camelCase.ts (useLocaleTexts.ts)
Dados:           PascalCase.json (Purificacao.json)
```

### **2. Commits e Mensagens**

```
feat: nova funcionalidade
fix: correção de bug
docs: atualização de documentação
refactor: refatoração de código
chore: tarefas de manutenção
style: formatação de código
perf: melhorias de performance
```

### **3. Organização de Código**

```typescript
// Ordem de imports:
1. React e bibliotecas principais
2. Componentes de UI
3. Hooks customizados
4. Utilitários e configs
5. Tipos e interfaces
6. Estilos (se houver)

// Ordem de conteúdo:
1. Types/Interfaces
2. Constants
3. Component/Function
4. Helpers internos
5. Exports
```

### **4. Backup SEMPRE Antes de Modificações Críticas**

```bash
# Antes de modificar JSONs importantes:
node scripts/backup-supabase.js

# Antes de modificar código crítico:
git add -A && git commit -m "backup: antes de [ação]"
```

---

## 🔧 **COMANDOS ESSENCIAIS**

### **Desenvolvimento**

```powershell
# IMPORTANTE: SEMPRE execute comandos do diretório correto
cd c:\temp\Site_Igreja_Meta\site-igreja-v6\workspace\shadcn-ui

# Iniciar frontend (Vite)
pnpm dev              # http://localhost:8080

# Iniciar backend (API Express)
pnpm server           # http://localhost:3001

# Editor visual (Admin Console)
# http://localhost:8080/436F6E736F6C45

# Build local (teste antes de deploy)
pnpm build

# Preview do build
pnpm preview
```

### **Sincronização Supabase**

```powershell
# ⚠️ SEMPRE execute do diretório shadcn-ui
cd c:\temp\Site_Igreja_Meta\site-igreja-v6\workspace\shadcn-ui

# Verificar conteúdo no DB
node scripts/check-purificacao-db.js

# Atualizar DB com arquivo local (método direto - preferível)
node scripts/update-purificacao-db.js

# Sincronização via API (requer backend rodando)
node scripts/sync-purificacao-to-db.js

# Backup completo do Supabase
pnpm backup
# OU
node scripts/backup-supabase.js

# Listar backups disponíveis
pnpm list-backups
# OU
.\scripts\list-backups.ps1

# Restaurar backup específico
pnpm restore:latest
# OU
node scripts/restore-supabase.js [timestamp]
```

### **Deploy para GitHub Pages**

```powershell
# ⚠️ SEMPRE execute do diretório shadcn-ui
cd c:\temp\Site_Igreja_Meta\site-igreja-v6\workspace\shadcn-ui

# Deploy completo (build + push para gh-pages)
pnpm run deploy

# Deploy com mensagem customizada
pnpm run deploy "mensagem personalizada"

# O script deploy.ps1 faz automaticamente:
# 1. pnpm build (cria pasta dist/)
# 2. Copia dist/ para build/v2/
# 3. git add build/v2/
# 4. git commit -m "Deploy: [mensagem]"
# 5. git push origin main
# 6. Aguarda ~2-5 minutos para GitHub Pages publicar
```

### **Gestão de Processos (Terminal)**

```powershell
# ⚠️ PowerShell - Problema Conhecido:
# - Múltiplos terminais podem ser criados
# - Use CTRL+C para parar processos
# - Feche terminais não utilizados manualmente

# Verificar processos rodando em portas
netstat -ano | findstr :8080  # Vite
netstat -ano | findstr :3001  # Express

# Matar processo por PID (se necessário)
taskkill /PID [número] /F
```

---

## 🎯 **FLUXO DE TRABALHO RECOMENDADO**

### **Para Modificar Conteúdo (OPÇÃO 1 - Admin Console - RECOMENDADO):**

```
1. ✅ Iniciar backend: pnpm server (OBRIGATÓRIO)
2. ✅ Iniciar frontend: pnpm dev
3. ✅ Acessar Admin Console: http://localhost:8080/436F6E736F6C45
4. ✅ Editar conteúdo no editor visual
5. ✅ Salvar (salva DIRETO no Supabase - fonte única da verdade)
6. ✅ Página recarrega automaticamente com novos dados
7. ✅ Deploy: pnpm run deploy
8. ✅ CTRL+F5 para limpar cache do navegador
```

### **Para Modificar Conteúdo (OPÇÃO 2 - JSON Local + Sync):**

```
⚠️ USO RESTRITO: Apenas para mudanças estruturais ou atualizações em massa

1. ✅ BACKUP PRIMEIRO: cp src/locales/pt-BR/Purificacao.json src/locales/pt-BR/backups/Purificacao_backup_$(Get-Date -Format "yyyy-MM-dd_HH-mm-ss").json
2. ✅ Editar JSON local (src/locales/pt-BR/*.json)
3. ✅ Sincronizar com Supabase: node scripts/update-purificacao-db.js
4. ✅ Verificar no DB: node scripts/check-purificacao-db.js
5. ✅ Testar local: pnpm dev → http://localhost:8080 (deve carregar do Supabase)
6. ✅ Atualizar tipo se estrutura mudou: verificar imports de fallbackTexts nas páginas
7. ✅ Commit das mudanças: git add . && git commit -m "feat: [descrição]"
8. ✅ Deploy: pnpm run deploy
9. ✅ CTRL+F5 para limpar cache do navegador

⚠️ IMPORTANTE: JSON local é para TIPAGEM. Site carrega do Supabase!
```

### **Exemplo Real - Integração do Antahkarana:**

```
✅ FEITO NA SESSÃO ANTERIOR:
1. Backup: Purificacao_backup_2025-11-10_15-11-38.json
2. Editado: src/locales/pt-BR/Purificacao.json
   - faseFinal.subtitle: "Iniciação e Ativação do Antahkarana"
   - faseFinal.iniciacao.title: "A Iniciação Final — Ativação do Antahkarana"
   - faseFinal.iniciacao.content: Adicionado explicação da ponte de luz
   - faseFinal.evento: Adicionado construção do Antahkarana
   - faseFinal.posIniciacao: Vivendo com Antahkarana ativo
3. Sincronizado: node scripts/update-purificacao-db.js
4. Verificado: node scripts/check-purificacao-db.js
   ✅ "Antahkarana aparece 6 vezes no banco!"
5. Deploy completo realizado
6. Site funcional: https://ariasmarcelo.github.io/site-igreja-v6/
```

### **Para Modificar Código:**

```
1. ✅ Ler documentação relacionada (README.md, SOLUTION_SUMMARY.md, etc.)
2. ✅ Usar semantic_search para entender contexto completo
3. ✅ Analisar código existente (componentes, hooks, configs)
4. ✅ Fazer backup se for mudança crítica (git commit -m "backup: [razão]")
5. ✅ Modificar localmente (seguir padrões de nomenclatura)
6. ✅ Testar extensivamente:
   - pnpm dev (frontend)
   - pnpm server (backend se necessário)
   - Testar todas as páginas afetadas
   - Verificar console do navegador
7. ✅ Verificar warnings/erros (ZERO tolerância)
8. ✅ Commit com mensagem clara (feat/fix/docs/refactor)
9. ✅ Deploy (pnpm run deploy)
10. ✅ Verificar produção com CTRL+F5
```

### **Para Renomear/Refatorar (Exemplo: v5 → v6):**

```
✅ REALIZADO NA SESSÃO ANTERIOR:

Arquivos modificados:
1. vite.config.ts: base: '/site-igreja-v6/'
2. src/App.tsx: basename: '/site-igreja-v6'
3. README.md: URL de demo atualizada
4. scripts/deploy.ps1: mensagem de sucesso atualizada
5. .env.example: documentação atualizada

Processo:
1. ✅ semantic_search para encontrar TODAS as referências a "v5"
2. ✅ Análise de cada arquivo para entender impacto
3. ✅ Modificações uma por uma
4. ✅ Teste local (pnpm dev)
5. ✅ Problema identificado: basename mismatch → página em branco
6. ✅ Correção: atualizar App.tsx
7. ✅ Teste novamente
8. ✅ Deploy completo
9. ✅ Cache clear com CTRL+F5

⚠️ LIÇÃO APRENDIDA: basename no React Router DEVE corresponder ao base no Vite!
```

---

## 🌐 **URLS IMPORTANTES**

```
Produção:     https://ariasmarcelo.github.io/site-igreja-v6/
Localhost:    http://localhost:8080
Admin:        http://localhost:8080/436F6E736F6C45
API:          http://localhost:3001
Supabase:     [configurado em .env.local]
GitHub:       https://github.com/ariasmarcelo/site-igreja-v5
```

---

## 📚 **CONCEITOS ESPIRITUAIS DO PROJETO**

Este site é para a **Igreja de Metatron** - trabalho espiritual de:

### **Estrutura do Caminho Espiritual:**

- **Fase 1 - Purificação**: Limpeza de energias densas, traumas, padrões limitantes
- **Fase 2 - Aprofundamento**: Intensificação do trabalho interno, expansão de consciência
- **Fase 3 - Iniciação Final**: Ativação do Antahkarana, união com o Eu Superior

### **Conceitos-Chave:**

- **Antahkarana** (अन्तःकरण): 
  - Ponte de luz entre a personalidade inferior e o Eu Superior (Alma)
  - Canal espiritual construído através da meditação e evolução consciente
  - Permite fluxo direto de sabedoria, amor e vontade espiritual
  - Tema central da Fase 3 (adicionado em 10/11/2025)

- **Iniciação Espiritual**: 
  - Cerimônia de ativação completa do Antahkarana
  - Marca a transição de buscador para iniciado
  - Após a iniciação: viver com consciência expandida permanentemente

- **Trabalhos Psicodélicos Sagrados**: 
  - Psilocibina (cogumelos), MDMA, Ibogaína
  - Usados como sacramentos para acelerar purificação
  - Sempre em contexto ritualístico e seguro

### **Páginas do Site:**

- `/` - Home (introdução geral)
- `/purificacao-e-ascensao` - Caminho completo (3 fases + Antahkarana)
- `/trabalhos-psicodelicos` - Informações sobre sacramentos
- `/blog` - Artigos espirituais
- `/contato` - Formulário de interesse

**⚠️ IMPORTANTE:** Respeite o contexto espiritual ao modificar textos. Este não é apenas um site, mas um portal de transformação espiritual.

---

## 🔍 **PROBLEMAS COMUNS E SOLUÇÕES**

### **1. Conteúdo não atualiza após deploy**
```
❌ Problema: Site mostra versão antiga
✅ Solução: CTRL+F5 (hard refresh)
✅ Verificação: DevTools > Network > Disable cache
✅ Causa: GitHub Pages + Cache do navegador
```

### **2. "API não está rodando" no Admin Console**
```
❌ Problema: Editor visual não salva
✅ Solução: pnpm server (porta 3001)
✅ Verificação: http://localhost:3001/health
✅ Causa: Backend Express não iniciado
```

### **3. Página em branco após mudança de versão**
```
❌ Problema: Site não carrega nada
✅ Solução: Verificar basename (App.tsx) = base (vite.config.ts)
✅ Exemplo: basename: '/site-igreja-v6' E base: '/site-igreja-v6/'
✅ Causa: React Router não encontra rotas
```

### **4. JSON local modificado mas não aparece no site** ⚠️ **ATUALIZADO**
```
❌ Problema: Edição local invisível
✅ Solução: node scripts/update-purificacao-db.js (sincronizar para Supabase)
✅ Verificação: node scripts/check-purificacao-db.js
✅ Causa: JSON local NÃO é carregado no site! Supabase é a ÚNICA fonte!
💡 Melhor prática: Editar diretamente no Admin Console
```

### **5. Múltiplos terminais PowerShell abertos**
```
❌ Problema: Muitas janelas de terminal
✅ Solução: CTRL+C e fechar terminais não usados
✅ Prevenção: Usar mesma janela de terminal sempre que possível
✅ Verificação: netstat -ano | findstr :8080 ou :3001
```

### **6. Build falha com erro de TypeScript**
```
❌ Problema: pnpm build com erros
✅ Solução: Corrigir TODOS os erros (zero tolerância)
✅ Verificação: pnpm run type-check (se disponível)
✅ Causa: Types incorretos ou imports faltando
```

### **7. Erro 'texts' is possibly 'null'** ⚠️ **NOVO - 10/11/2025**
```
❌ Problema: TypeScript reclama de texts.propriedade
✅ Solução: Envolver conteúdo com PageLoader e verificação:
   <PageLoader loading={loading} error={error}>
     {!texts ? null : (
       // seu conteúdo usando texts aqui
     )}
   </PageLoader>
✅ Causa: Hook agora retorna { texts, loading, error } - texts pode ser null
```

## ⚠️ **AVISOS FINAIS** (Atualizado 10/11/2025)

```
1. ✅ Este projeto usa SUPABASE como ÚNICA fonte da verdade (CRÍTICO!)
2. ✅ JSON local é APENAS para tipagem TypeScript (não é carregado no site)
3. ✅ Hook useLocaleTexts retorna { texts, loading, error } - sempre verificar null
4. ✅ Editor visual salva direto no Supabase (sem passar por JSON local)
5. ✅ Backups de JSON movidos para src/locales/pt-BR/backups/
6. ✅ SEMPRE faça backup antes de grandes mudanças
7. ✅ SEMPRE teste localmente antes de deploy (pnpm dev + pnpm server)
8. ✅ SEMPRE verifique Supabase após modificações de conteúdo
9. ❌ NUNCA ignore warnings ou erros (zero tolerância)
10. ❌ NUNCA faça mudanças sem entender completamente
11. ✅ SEMPRE use CTRL+F5 após deploy para limpar cache
12. ✅ SEMPRE execute comandos do diretório correto (workspace/shadcn-ui)
13. ✅ Repository GitHub é site-igreja-v6 (apesar do nome local ser site-igreja-v5)
14. ✅ Base URL é /site-igreja-v6/ (corresponde ao nome do repositório GitHub)
15. ✅ Componente PageLoader criado para loading/error states consistentes
16. ✅ Padrão de página: import fallbackTexts → type PageTexts → useLocaleTexts → PageLoader wrap
```

---

## ✅ **CHECKLIST PRÉ-AÇÃO**

Antes de fazer QUALQUER modificação:

- [ ] Li toda a documentação relevante (12 arquivos obrigatórios)
- [ ] Entendi a arquitetura do sistema (Vite + React + Supabase + Express)
- [ ] Compreendi o fluxo de dados (JSON local = fallback | Supabase = verdade)
- [ ] Verifiquei arquivos relacionados (semantic_search + grep_search)
- [ ] Testei localmente se necessário (pnpm dev + pnpm server)
- [ ] Fiz backup se for modificação crítica (git commit ou backup JSON)
- [ ] Tenho certeza de que não há warnings/erros (zero tolerância)
- [ ] Sei reverter se algo der errado (git log + git revert)
- [ ] Estou no diretório correto (workspace/shadcn-ui)
- [ ] Variáveis de ambiente configuradas (.env.local existe)

## 🎯 **SESSÕES ANTERIORES - RESUMO**

### **Sessão 1 - 10/11/2025 (manhã/tarde)**

**Realizações:**
1. ✅ Análise completa do sistema (configs, scripts, variáveis de ambiente)
2. ✅ Renomeação v5 → v6 (5 arquivos modificados)
3. ✅ Integração do conceito "Antahkarana" na Fase 3 (6 localizações)
4. ✅ Backup criado: `Purificacao_backup_2025-11-10_15-11-38.json`
5. ✅ Sincronização JSON local → Supabase (scripts criados e testados)
6. ✅ Deploy completo para GitHub Pages
7. ✅ Criação deste arquivo de instruções (v1.0 → v2.1)

**Problemas Resolvidos:**
- Página em branco (basename mismatch) → CTRL+F5
- API não rodando (backend não iniciado) → pnpm server
- JSON não sincronizado → scripts diretos com Supabase client
- Múltiplos terminais → gestão manual de processos

### **Sessão 2 - 10/11/2025 (tarde/noite)** ⭐ **REFATORAÇÃO ARQUITETURAL**

**Realizações:**
1. ✅ Reorganização estrutural: 66 → 8 arquivos JSON ativos + 25 backups em pasta separada
2. ✅ Refatoração `useLocaleTexts`: adicionado `{ texts, loading, error }` com proper error handling
3. ✅ Criação componente `PageLoader` para loading/error states consistentes
4. ✅ Atualização páginas Index, Purificacao, Contato com novo padrão
5. ✅ Atualização imports (fallbackTexts) em QuemSomos, Tratamentos, Testemunhos, Artigos, NotFound
6. ✅ Documentação completa da arquitetura atualizada (COPILOT-INSTRUCTIONS.md v3.0)
7. ✅ JSON local redefinido: ÚNICA função = tipagem TypeScript

**Mudanças Arquiteturais:**
- ❌ **REMOVIDO:** JSON local como fonte de dados
- ✅ **ADICIONADO:** Loading/error states em todas as páginas
- ✅ **SIMPLIFICADO:** Supabase = única fonte da verdade
- ✅ **ORGANIZADO:** Backups em `src/locales/pt-BR/backups/`

**Estado Atual:**
- ✅ Site funcional: https://ariasmarcelo.github.io/site-igreja-v6/
- ✅ Arquitetura refatorada e documentada
- ✅ 3 páginas completamente atualizadas (Index, Purificacao, Contato)
- ⏳ 5 páginas com imports atualizados, precisam wrap PageLoader (QuemSomos, Tratamentos, Testemunhos, Artigos, NotFound)
- ⏳ Testes locais pendentes (pnpm dev)
- ⏳ Deploy pendente após completar refatoração

## 📞 **CONTATO E SUPORTE**

**Desenvolvedor:** Marcelo Arias  
**Repositório:** https://github.com/ariasmarcelo/site-igreja-v6  
**Projeto:** Igreja de Metatron - Portal de Purificação e Ascensão Espiritual

---

**🎯 OBJETIVO:** Zero surpresas. Zero erros. Código limpo. Dados íntegros.

**Desenvolvido com ❤️ para a Igreja de Metatron 🕉️**

---

---

## 📝 **SEÇÃO DE APRENDIZADO CONTÍNUO**

### **Como usar esta seção:**

Quando você (GitHub Copilot) aprender algo novo durante uma sessão, adicione aqui seguindo este template:

```markdown
#### 📌 [DATA] - [TÍTULO DO APRENDIZADO]

**Contexto:** [Situação que levou ao aprendizado]

**Descoberta:** [O que foi aprendido]

**Solução/Padrão:** [Como resolver/implementar]

**Impacto:** [Onde mais isso se aplica]

**Código/Comando (se aplicável):**
\`\`\`typescript
// exemplo
\`\`\`

**Tags:** categoria, tecnologia, padrão
```

---

### **APRENDIZADOS REGISTRADOS:**

#### 📌 10/11/2025 - Sincronização JSON Local vs Supabase

**Contexto:** Usuário modificou JSON local mas mudanças não apareciam no site em produção.

**Descoberta:** O hook `useLocaleTexts` carrega JSON local como fallback inicial, mas **imediatamente sobrescreve** com dados do Supabase quando disponível. O Supabase é a FONTE DA VERDADE.

**Solução/Padrão:**
1. Modificar JSON local primeiro (facilita controle de versão)
2. Sincronizar com Supabase usando scripts diretos (não precisa de API rodando)
3. Verificar no banco com scripts de check
4. Fazer backup antes de mudanças críticas

**Impacto:** Todo conteúdo editável (páginas, textos, configurações) segue este fluxo.

**Código:**
```javascript
// Script direto (preferível - não precisa de servidor)
const { createClient } = require('@supabase/supabase-js');
const client = createClient(SUPABASE_URL, SERVICE_KEY);
await client.from('page_contents').upsert({ page_name: 'purificacao', content: jsonData });
```

**Tags:** supabase, data-flow, sync, json

---

#### 📌 10/11/2025 - React Router Basename vs Vite Base URL

**Contexto:** Após renomear projeto de v5 para v6, site mostrava página em branco.

**Descoberta:** O `basename` do React Router **DEVE** corresponder exatamente ao `base` do Vite config. Qualquer diferença causa falha no roteamento.

**Solução/Padrão:**
```typescript
// vite.config.ts
export default defineConfig({
  base: '/site-igreja-v6/', // COM barra final
});

// App.tsx
const basename = import.meta.env.MODE === 'production' ? '/site-igreja-v6' : '/';
// SEM barra final no React Router
```

**Impacto:** Qualquer mudança no nome do repositório ou estrutura de URL requer atualização em AMBOS os arquivos.

**Tags:** react-router, vite, routing, basename

---

#### 📌 10/11/2025 - Cache do Navegador em GitHub Pages

**Contexto:** Deploy realizado com sucesso, mas site mostrava versão antiga.

**Descoberta:** GitHub Pages usa cache agressivo. JavaScript e CSS ficam cacheados no navegador.

**Solução/Padrão:**
1. Após deploy, SEMPRE avisar usuário para fazer hard refresh: `CTRL+F5` (Windows) ou `CMD+SHIFT+R` (Mac)
2. Para testes: abrir DevTools > Network > marcar "Disable cache"
3. Para produção: considerar cache-busting no futuro (hash nos nomes de arquivo)

**Impacto:** Todo deploy pode causar este problema. É comportamento esperado, não bug.

**Tags:** cache, github-pages, deploy, browser

---

#### 📌 10/11/2025 - PowerShell e Diretórios de Trabalho

**Contexto:** Comandos falhavam inconsistentemente dependendo de onde eram executados.

**Descoberta:** Scripts Node.js e comandos pnpm devem ser executados do diretório `workspace/shadcn-ui`, não da raiz do projeto.

**Solução/Padrão:**
```powershell
# SEMPRE começar comandos assim:
cd c:\temp\Site_Igreja_Meta\site-igreja-v6\workspace\shadcn-ui
pnpm dev
node scripts/backup-supabase.js
```

**Impacto:** Todos os comandos de desenvolvimento, build e scripts.

**Tags:** powershell, terminal, working-directory

---

#### 📌 10/11/2025 - Antahkarana - Conceito Espiritual

**Contexto:** Usuário solicitou integração de novo conceito espiritual no conteúdo da Fase 3.

**Descoberta:** Antahkarana (अन्तःकरण) é termo sânscrito para "ponte de luz" entre personalidade e Eu Superior. Conceito central na tradição esotérica.

**Solução/Padrão:** Integrado em 6 localizações estratégicas em `Purificacao.json`:
- Subtitle da Fase Final
- Título da Iniciação
- Conteúdo explicativo detalhado
- Evento iniciático
- Pós-iniciação

**Impacto:** Representa evolução do conteúdo espiritual do site. Outros conceitos esotéricos podem ser integrados seguindo mesma abordagem.

**Tags:** spiritual, content, antahkarana, esotericism

---

#### 📌 10/11/2025 - Refatoração Completa: JSON Local vs Supabase

**Contexto:** Usuário questionou a descrição "Hook useLocaleTexts carrega JSON local primeiro, depois sobrescreve com Supabase".

**Descoberta:** 
1. **Descrição anterior estava INCORRETA**: Hook não "carregava e sobrescrevia" - usava JSON como `useState` inicial e substituía SE Supabase respondesse com sucesso
2. **Arquitetura redundante**: JSONs locais + Supabase criavam duplicação e risco de dessincronização
3. **66 arquivos JSON**: Incluindo 25 backups espalhados no diretório de código

**Solução Implementada:**

1. **Reorganização estrutural:**
   - Criado `src/locales/pt-BR/backups/` 
   - Movidos todos `*_backup_*.json` e `*_2025-*.json` para backups/
   - Reduzido de 66 para 8 arquivos ativos

2. **Refatoração do hook:**
   ```typescript
   // ANTES:
   export function useLocaleTexts<T>(pageId: string, defaultTexts: T): T {
     const [texts, setTexts] = useState<T>(defaultTexts);
     // ... busca Supabase, SE sucesso: setTexts(data)
     return texts;
   }
   
   // DEPOIS:
   export function useLocaleTexts<T>(pageId: string, fallbackData?: T): {
     texts: T | null;
     loading: boolean;
     error: string | null;
   } {
     const [texts, setTexts] = useState<T | null>(fallbackData || null);
     const [loading, setLoading] = useState<boolean>(true);
     const [error, setError] = useState<string | null>(null);
     // ... busca Supabase com proper error handling
     return { texts, loading, error };
   }
   ```

3. **Novo componente PageLoader:**
   ```typescript
   // src/components/PageLoader.tsx
   // Componente genérico para loading/error states
   <PageLoader loading={loading} error={error}>
     {!texts ? null : (/* conteúdo */)}
   </PageLoader>
   ```

4. **Padrão de uso atualizado:**
   ```typescript
   import fallbackTexts from '@/locales/pt-BR/Index.json';
   type IndexTexts = typeof fallbackTexts;  // ✅ Tipo extraído do JSON
   
   const { texts, loading, error } = useLocaleTexts<IndexTexts>('index', fallbackTexts);
   ```

**Impacto:** 
- ✅ Fonte única de verdade (Supabase)
- ✅ Loading/error states adequados
- ✅ JSONs locais apenas para tipagem TypeScript
- ✅ 25 backups organizados em pasta separada
- ✅ Estrutura mais limpa e manutenível
- ⏳ Páginas Index, Purificacao e Contato completamente atualizadas
- ⏳ QuemSomos, Tratamentos, Testemunhos, Artigos e NotFound: imports atualizados, precisam wrap com PageLoader

**Tags:** architecture, refactoring, data-flow, supabase, json, typescript

---

### **📊 DIRETRIZES DO USUÁRIO (adicionadas durante sessões):**

#### 🎯 Diretriz 1 - Estrutura Dinâmica de Documentação

**Data:** 10/11/2025  
**Solicitação do usuário:** "sugiro que você não liste arquivos a analisar no conteudo deste arquivo, mas suas características para busca, listagem e compressão dinâmica"

**Implementação:**
- ✅ Substituir listas fixas de arquivos por padrões de busca
- ✅ Usar glob patterns e regex para localizar recursos
- ✅ Documentar características em vez de caminhos absolutos
- ✅ Permitir que estrutura evolua sem quebrar instruções

**Exemplo prático:**
```javascript
// ❌ Evitar:
"Leia: src/components/BlogEditor.tsx, src/components/TiptapEditor.tsx"

// ✅ Preferir:
"Busque editores: grep_search('Editor', includePattern: 'src/components/**/*.tsx')"
```

**Impacto:** Este documento permanece relevante mesmo com refatorações e mudanças na estrutura.

---

---

## 🤖 **PROTOCOLO DE USO DESTE ARQUIVO (para GitHub Copilot)**

### **AO INICIAR UMA NOVA SESSÃO:**

1. **PASSO 0: VERIFICAR SERVIDORES (se tarefa envolver desenvolvimento):**
   ```powershell
   cd c:\temp\Site_Igreja_Meta\site-igreja-v6\workspace\shadcn-ui
   
   # Método 1: Script automatizado (RECOMENDADO)
   pnpm check
   # OU
   .\check-servers.ps1
   
   # Método 2: Verificação manual
   netstat -ano | findstr :8080  # Frontend
   netstat -ano | findstr :3001  # Backend
   curl http://localhost:8080 -UseBasicParsing -TimeoutSec 5
   curl http://localhost:3001 -UseBasicParsing -TimeoutSec 5
   
   # Se necessário, iniciar/reiniciar:
   pnpm dev     # Terminal 1
   pnpm server  # Terminal 2
   ```

2. **PRIMEIRO PASSO OBRIGATÓRIO:**
   ```
   read_file({
     filePath: "c:\\temp\\Site_Igreja_Meta\\site-igreja-v6\\workspace\\shadcn-ui\\COPILOT-INSTRUCTIONS.md",
     startLine: 1,
     endLine: 50  // Ler pelo menos até entender o propósito
   })
   ```

2. **Ler seções relevantes:**
   - Checklist de Retomada Obrigatória
   - Proibições Absolutas
   - Fluxo de Dados Crítico
   - Stack Tecnológica
   - Seção de Aprendizado Contínuo (todos os aprendizados)
   - Diretrizes do Usuário (todas)

3. **Executar buscas dinâmicas:**
   - Usar padrões de busca documentados, não listas fixas
   - Adaptar buscas ao contexto da tarefa atual

### **DURANTE A SESSÃO:**

**Quando aprender algo novo que NÃO está documentado:**

1. Identificar se é um aprendizado relevante:
   - ✅ Padrão arquitetural descoberto
   - ✅ Problema resolvido que pode se repetir
   - ✅ Comportamento não-óbvio de biblioteca/framework
   - ✅ Fluxo de dados ou processo crítico
   - ❌ Tarefa única sem padrão reutilizável
   - ❌ Informação já documentada

2. Adicionar à seção "APRENDIZADOS REGISTRADOS":
   ```
   replace_string_in_file({
     filePath: "...",
     oldString: "---\n\n### **📊 DIRETRIZES DO USUÁRIO",
     newString: "---\n\n#### � [DATA] - [TÍTULO]\n\n[CONTEÚDO]\n\n---\n\n### **📊 DIRETRIZES DO USUÁRIO"
   })
   ```

**Quando receber nova diretriz do usuário:**

1. Adicionar à seção "DIRETRIZES DO USUÁRIO":
   - Numerar sequencialmente (Diretriz 2, 3, 4...)
   - Incluir data, solicitação textual, implementação, impacto

2. Confirmar compreensão com o usuário

### **AO DESCOBRIR MUDANÇA NA ESTRUTURA:**

**Se padrões de busca não encontrarem arquivos esperados:**

1. Investigar mudança:
   - `file_search({ query: "**/*[nome aproximado]*" })`
   - `list_dir({ path: "[diretório anterior]" })`

2. Atualizar padrões de busca neste arquivo

3. Documentar mudança na seção de Aprendizado:
   ```markdown
   #### 📌 [DATA] - Refatoração de Estrutura: [descrição]
   
   **Contexto:** [Por que a estrutura mudou]
   **Antes:** [Estrutura antiga]
   **Depois:** [Nova estrutura]
   **Padrões atualizados:** [Novos patterns de busca]
   ```

### **ANTES DE ENCERRAR A SESSÃO:**

**Checklist final:**

- [ ] Documentei novos aprendizados relevantes?
- [ ] Adicionei novas diretrizes do usuário?
- [ ] Atualizei padrões de busca se estrutura mudou?
- [ ] Documentei problemas críticos resolvidos?
- [ ] Confirmei que informações estão em seções corretas?

**NÃO é necessário:**
- ❌ Documentar cada pequena mudança de código
- ❌ Listar todos os arquivos modificados (use git log)
- ❌ Repetir informação já presente em outros README.md
- ❌ Adicionar aprendizados óbvios ou triviais

---

---

## � **EXEMPLO PRÁTICO: Como Usar Este Arquivo**

### **Cenário: Nova sessão do Copilot, usuário diz "releia do zero"**

```typescript
// 1️⃣ Copilot lê o arquivo completo
read_file({
  filePath: "c:\\temp\\Site_Igreja_Meta\\site-igreja-v6\\workspace\\shadcn-ui\\COPILOT-INSTRUCTIONS.md",
  startLine: 1,
  endLine: 998
})

// 2️⃣ Copilot responde ao usuário:
// "✅ Contexto restaurado. Li o arquivo COPILOT-INSTRUCTIONS.md completo.
//
// **Compreensão atual:**
// - Projeto: Site Igreja de Metatron - portal espiritual de purificação e ascensão
// - Stack: Vite 7.2, React 19, TypeScript 5, Tailwind CSS 4, Supabase (PostgreSQL)
// - Fluxo de dados crítico: JSON local (fallback) → Supabase (fonte da verdade)
// - Últimas mudanças: Integração do Antahkarana na Fase 3, deploy v6 realizado
// - Pronto para: Desenvolvimento, deploy, modificação de conteúdo
//
// Como posso ajudar?"

// 3️⃣ Usuário pede: "Adicione um novo conceito espiritual na página"

// 4️⃣ Copilot busca arquivos dinamicamente (NÃO usa lista fixa):
file_search({ query: "src/locales/**/*.json" })
grep_search({ query: "faseFinal|iniciacao", includePattern: "src/locales/**/*.json" })

// 5️⃣ Copilot faz as modificações...

// 6️⃣ ANTES DE ENCERRAR, Copilot documenta:
replace_string_in_file({
  filePath: "COPILOT-INSTRUCTIONS.md",
  oldString: "---\n\n### **📊 DIRETRIZES DO USUÁRIO",
  newString: `---

#### 📌 ${new Date().toLocaleDateString()} - Novo Conceito Espiritual Adicionado

**Contexto:** Usuário solicitou integração de [conceito] na página [nome]

**Descoberta:** [O que aprendi sobre a estrutura/padrão]

**Solução:** [Como implementei]

**Tags:** spiritual, content, [conceito]

---

### **📊 DIRETRIZES DO USUÁRIO`
})
```

### **Cenário: Copilot encontra arquivo movido**

```typescript
// Padrão antigo não funciona mais:
file_search({ query: "scripts/backup-supabase.js" })
// ❌ Resultado: não encontrado

// Copilot investiga:
file_search({ query: "**/*backup*.js" })
// ✅ Encontrado em: scripts/supabase/backup-supabase.js

// Copilot atualiza este documento:
// "Estrutura refatorada: scripts agora organizados por categoria"
// "Novo padrão: scripts/[categoria]/*.js"

// Copilot adiciona aprendizado documentando a mudança
```

---

## �🔄 **HISTÓRICO DE VERSÕES DESTE DOCUMENTO**

- **v1.0** (10/11/2025 - 15:30): Criação inicial com estrutura básica
- **v1.1** (10/11/2025 - 17:30): Atualização completa com contexto da sessão, problemas resolvidos, stack completa, fluxos de trabalho testados, e seção de troubleshooting
- **v2.0** (10/11/2025 - 17:45): Reestruturação para modelo dinâmico - substituição de listas fixas por padrões de busca, adição de seção de aprendizado contínuo, template para novos aprendizados, seção de diretrizes do usuário, protocolo de uso para Copilot
- **v2.1** (10/11/2025 - 18:00): Adição do Protocolo de Reset Completo com gatilhos específicos, exemplos práticos de uso, e diferenciação entre reset e retomada normal
- **v3.0** (10/11/2025 - 21:00): 🎯 **REFATORAÇÃO ARQUITETURAL COMPLETA**
  - Fluxo de dados reescrito (Supabase = única fonte)
  - Hook useLocaleTexts refatorado ({ texts, loading, error })
  - JSON local redefinido (apenas tipagem TypeScript)
  - Novo componente PageLoader documentado
  - Reorganização de backups (src/locales/pt-BR/backups/)
  - 66 → 8 arquivos JSON ativos
  - Aprendizado "JSON Local vs Supabase" adicionado
  - README.md completamente reescrito
  - ⭐ **NOVA INSTRUÇÃO:** Verificação obrigatória de servidores (seção 0 do checklist)
  - Protocolo de verificação de portas 8080 (Vite) e 3001 (Express)
  - Tabela de requisitos por tipo de tarefa
  - Instruções de quando cada servidor é necessário
- **v3.1** (10/11/2025 - 21:30): 🔧 **MELHORIA: Detecção de Servidores Travados**
  - ⭐ Protocolo de verificação em 3 etapas (porta + health check + ação)
  - Script automatizado `check-servers.ps1` criado
  - Health checks com `curl` para detectar servidores não-responsivos
  - Diagnóstico de servidores travados (PID ativo mas não responde)
  - Instruções para matar processos zombie (taskkill)
  - Tabela de mensagens de erro e diagnóstico
  - Sinais de servidor travado documentados
  - Comandos `pnpm check` e `pnpm check-servers` adicionados
  - Fallback para rota raiz quando /health não existe

---

**📌 LEMBRE-SE:** Este arquivo é sua memória. Mantenha-o atualizado e ele manterá você informado.

**🎯 PARA RESET COMPLETO:** Apenas diga "releia do zero" e seguirei o protocolo de 4 passos.
