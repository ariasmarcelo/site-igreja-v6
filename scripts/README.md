# 📚 Scripts de Automação do Sistema de Edição Visual

Este diretório contém scripts automatizados para gerenciar os atributos `data-json-key` que conectam elementos visuais ao conteúdo editável.

> 📖 Veja também: **[README-IDS.md](./README-IDS.md)** - Documentação detalhada do script ids.js

---

## 🚀 Quick Start

```bash
# Desenvolvimento normal (IDs verificados automaticamente)
pnpm dev

# Verificar IDs únicos
pnpm assign-ids

# Corrigir IDs automaticamente
pnpm assign-ids:fix

# Correção completa de data-json-key
pnpm fix-keys

# Limpeza de backups antigos
pnpm clean-backups
```

---

## 📋 Scripts Ativos

| Script | Comando | Descrição | Frequência |
|--------|---------|-----------|------------|
| **ids.js** ⭐ | `pnpm assign-ids` | Verificação completa de IDs | Sob demanda |
| **ids.js --fix** | `pnpm assign-ids:fix` | Correção automática de IDs | Sob demanda |
| **fix-all-keys.cjs** | `pnpm fix-keys` | Correção de data-json-key | Mensal |
| **init-assign-ids.js** | Automático (`pnpm dev`) | Verificação ao iniciar dev | Automático |
| **clean-all-backups.cjs** | `pnpm clean-backups` | Limpa backups antigos | Mensal |
| **deploy.ps1** | `pnpm deploy` ou `.\scripts\deploy.ps1` | Deploy síncrono (padrão) | Por deploy |
| **deploy.ps1 -Background** | `pnpm deploy:bg` ou `.\scripts\deploy.ps1 -Background` | Deploy em background | Por deploy |

**Scripts Auxiliares:**
- `update-testemunhos.js` - Atualização de testemunhos
- `inserir-artigos.js` - Inserção de artigos no blog
- `migrate-to-supabase.js` - Migração para Supabase

---

## 🎯 O Que São os Scripts?

### Problema
```jsx
// Elemento não-editável (sem data-json-key)
<h1>{texts.hero.title}</h1>
```

### Solução
```jsx
// Elemento editável no Admin Panel (/436F6E736F6C45)
<h1 data-json-key="index.hero.title">{texts.hero.title}</h1>
```

### Como Funciona
1. Scripts detectam `{texts.xxx}` no código
2. Encontram o elemento JSX pai
3. Validam se path existe no JSON correspondente
4. Injetam `data-json-key="pageName.section.property"`
5. Admin Panel usa esse atributo para permitir edição inline

**Resultado**: **141+ elementos editáveis** em 8 páginas 🎉

---

## 📖 Documentação Detalhada

### 1. **ids.js** ⭐ (Script Definitivo)

O script principal que substitui todos os anteriores.

**Funcionalidades:**
- 🧠 Verificação inteligente de IDs únicos
- 🔢 Detecta contexto de arrays com `.map()`
- 🗂️ Suporta estruturas JSX aninhadas
- ✅ Validação contra arquivos JSON
- 🔒 Correção automática segura
- 💾 Backups automáticos com timestamp

**Uso:**
```bash
# Verificar apenas
pnpm assign-ids

# Corrigir automaticamente
pnpm assign-ids:fix

# Página específica
node scripts/ids.js --page=Tratamentos --fix

# Preview das correções
node scripts/ids.js --fix --dry-run
```

Veja documentação completa em **[README-IDS.md](./README-IDS.md)**

### 2. **init-assign-ids.js** (Automático)
- ✅ Roda automaticamente via `pnpm dev`
- � Executa verificação inicial
- ⚡ Não bloqueia dev server

### 3. **fix-all-keys.cjs**
- 🚀 Correção completa de data-json-key
- 📊 Relatório consolidado
- 🔧 Executa junto com `pnpm dev`
- 🔧 Use quando muitos elementos não aparecem no editor

### 4. **fix-all-texts.js**
- 🔍 Detecta: `{texts.xxx}`, `dangerouslySetInnerHTML`, atributos
- ✅ Sempre atualiza (garante consistência total)
- 📦 Cobertura: 127 elementos

### 5. **fix-all-maps.js**
- 🗺️ Detecta arrays com `.map()`
- 🔢 Gera índices dinâmicos `[${i}]`
- 🎯 Distingue objetos vs strings
- 📦 Cobertura: 44 elementos em arrays

### 6. **clean-all-backups.cjs**
- 🗑️ Remove backups antigos
- 💾 Mantém 5 mais recentes
- 📂 Processa `src/locales/pt-BR/` e `src/styles/pages/`

---

## 🔄 Integração Automática

```bash
# Ao rodar pnpm dev:
pnpm dev
  ↓
predev (package.json)
  ↓
init-assign-ids.js
  ↓ (se passou 24h)
assign-ids-final.js
  ↓
vite (dev server)
```

---

## ✅ Recursos Comuns

- ✅ **Idempotentes**: Podem rodar múltiplas vezes sem problemas
- 🔒 **Backups**: Criados automaticamente antes de modificações
- 👁️ **Dry-run**: Preview sem modificar (`--dry-run`)
- 🐛 **Verbose**: Modo debug (`--verbose`)
- 🎯 **Filtros**: Processar páginas específicas (`--page=Name`)

---

## � Quando Executar Manualmente

**Situações que requerem execução manual**:

| Situação | Script | Comando |
|----------|--------|---------|
| Nova página criada | assign-ids-final.js | `node scripts/assign-ids-final.js --page=Nome` |
| Elementos não-editáveis | fix-all-keys.cjs | `node scripts/fix-all-keys.cjs` |
| Grande refatoração | fix-all-keys.cjs | `node scripts/fix-all-keys.cjs` |
| Limpeza de espaço | clean-all-backups.cjs | `node scripts/clean-all-backups.cjs` |
| Forçar verificação | assign-ids-final.js | `node scripts/assign-ids-final.js` |

---

## � Estatísticas do Projeto

**171 elementos editáveis** distribuídos em:

| Página | Elementos Simples | Arrays | Total |
|--------|------------------|--------|-------|
| Index.tsx | 23 | 12 | 35 |
| QuemSomos.tsx | 18 | 8 | 26 |
| Purificacao.tsx | 31 | 6 | 37 |
| Testemunhos.tsx | 15 | 4 | 19 |
| Tratamentos.tsx | 22 | 7 | 29 |
| Contato.tsx | 12 | 5 | 17 |
| Admin.tsx | 6 | 2 | 8 |
| **TOTAL** | **127** | **44** | **171** |

---

## 📝 Convenção de IDs

### Elementos Diretos
```jsx
<h1 data-json-key="pageName.section.property">
  {texts.section.property}
</h1>
```

### Arrays de Strings
```jsx
{texts.items.map((item, i) => (
  <li data-json-key={`pageName.items[${i}]`}>{item}</li>
))}
```

### Arrays de Objetos
```jsx
{texts.cards.map((card, i) => (
  <div key={i}>
    <h3 data-json-key={`pageName.cards[${i}].title`}>{card.title}</h3>
    <p data-json-key={`pageName.cards[${i}].description`}>{card.description}</p>
  </div>
))}
```

---

## 🎯 Objetivos Alcançados

✅ Todos os elementos editáveis têm `data-json-key`  
✅ Scripts idempotentes (execução segura)  
✅ Integração automática na subida dos servidores  
✅ Relatórios detalhados e informativos  
✅ Backups automáticos  
✅ Cobertura completa do projeto (171 elementos)  

---

## 💡 Dicas

1. **Modo silencioso**: Use `--silent` para execução rápida sem output detalhado
2. **Verificação rápida**: Execute `npm run fix-keys` após grandes mudanças
3. **Logs completos**: Execute sem `--silent` para debug e análise
4. **Backups**: Os backups são sobrescritos a cada execução - não se acumulam

---

## 🚨 Solução de Problemas

### Script não encontra elementos
- Verifique se o padrão `texts.` está sendo usado
- Confirme que não há typos no código

### Muitas alterações mesmo após múltiplas execuções
- Verifique se há conflitos com outros processos
- Execute com debug ativado para ver comparações

### Backups acumulando
- Normal - são sobrescritos a cada execução
- Pode apagar manualmente: `rm src/pages/*.backup*`

---

**Última atualização**: Novembro 2025  
**Versão**: 2.0 (Idempotente)

---

##  Troubleshooting

### Problema: Elemento n�o aparece no Admin Panel
```bash
# 1. Verificar console do browser (F12)
# 2. Executar corre��o completa
node scripts/fix-all-keys.cjs

# 3. Se persistir, processar p�gina espec�fica com verbose
node scripts/assign-ids-final.js --page=PageName --verbose
```

### Problema: Edi��o n�o salva
**Causa**: JSON path incorreto ou arquivo n�o existe
```bash
# Verificar se JSON existe em src/locales/pt-BR/PageName.json
# Reprocessar com valida��o
node scripts/assign-ids-final.js --page=PageName
```

### Problema: Muitos backups ocupando espa�o
```bash
node scripts/clean-all-backups.cjs
```

---

## 🚀 Deploy para GitHub Pages

### deploy.ps1 (Script Unificado)

Script único que suporta execução **síncrona** (padrão) ou **em background**.

#### Modo Síncrono (Padrão)
Bloqueia o terminal e mostra progresso em tempo real:

```bash
# Diretamente
.\scripts\deploy.ps1 "feat: nova funcionalidade"

# Via package.json (conflito com pnpm - use direto)
# pnpm deploy "mensagem"  # ⚠️ Não funciona (conflito pnpm)
```

#### Modo Background
Libera o terminal imediatamente, deploy continua em segundo plano:

```bash
# Diretamente
.\scripts\deploy.ps1 "fix: correcao" -Background

# Via package.json (mesmo problema)
# pnpm deploy:bg  # ⚠️ Não funciona (conflito pnpm)
```

#### Parâmetros

| Parâmetro | Tipo | Padrão | Descrição |
|-----------|------|--------|-----------|
| `Message` | string | "deploy: atualizacao DD/MM/YYYY HH:mm" | Mensagem do commit |
| `-Background` | switch | false | Executa em background |

#### Recursos

- ✅ Logs limpos sem códigos ANSI
- ✅ Encoding ASCII para compatibilidade
- ✅ Logs com timestamp: `deploy-YYYYMMDD-HHMMSS.log`
- ✅ Mantém apenas últimos 10 logs
- ✅ Feedback colorido no terminal (modo síncrono)
- ✅ Comandos úteis após execução (modo background)

#### Processo de Deploy

1. **Build**: `pnpm build` → Gera dist/
2. **Git Add**: `git add .` → Adiciona alterações
3. **Git Commit**: `git commit -m "mensagem"` → Cria commit
4. **Git Push**: `git push` → Envia para GitHub

#### Monitorar Deploy Background

```bash
# Ver progresso em tempo real
Get-Content logs\deploy-YYYYMMDD-HHMMSS.log -Tail 20 -Wait

# Ver log completo
Get-Content logs\deploy-YYYYMMDD-HHMMSS.log

# Listar todos os logs
Get-ChildItem logs\deploy-*.log
```

---

##  Recursos Adicionais

-  **[DOCUMENTACAO_SCRIPTS.md](./DOCUMENTACAO_SCRIPTS.md)** - Guia completo detalhado
-  **Admin Panel**: http://localhost:8080/436F6E736F6C45
-  **JSONs**: `src/locales/pt-BR/*.json`
-  **CSS**: `src/styles/pages/*.css`
-  **Backups**: Autom�ticos (5 mais recentes)

---

##  Checklist de Uso

**Di�rio**:
- [x] `pnpm dev` (autom�tico)

**Semanal** (ap�s mudan�as):
- [ ] `node scripts/assign-ids-final.js --dry-run`
- [ ] `node scripts/assign-ids-final.js`

**Mensal**:
- [ ] `node scripts/fix-all-keys.cjs`
- [ ] `node scripts/clean-all-backups.cjs`

**Ap�s criar p�gina**:
- [ ] Criar `src/pages/PageName.tsx`
- [ ] Criar `src/locales/pt-BR/PageName.json`
- [ ] `node scripts/assign-ids-final.js --page=PageName`
- [ ] Testar no Admin Panel

---

** �ltima Atualiza��o**: 08/11/2025  
** Status**: Todos os scripts funcionais  
** Cobertura**: 171/171 elementos (100%)  
** Admin Panel**: /436F6E736F6C45
