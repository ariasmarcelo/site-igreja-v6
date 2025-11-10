# 🚀 Guia de Deploy no Vercel

> **Deploy completo: Frontend + API Backend (Serverless Functions)**

---

## 📋 Pré-requisitos

- ✅ Conta no [Vercel](https://vercel.com)
- ✅ Conta no [Supabase](https://supabase.com)
- ✅ Código no GitHub (já está!)
- ✅ Credenciais do Supabase (URL, Anon Key, Service Key)

---

## 🎯 Por Que Usar Vercel?

### ✅ Vantagens
- **Editor Funciona Online** - Admin Console acessível de qualquer lugar
- **API Serverless** - Backend automático sem servidor dedicado
- **Segurança** - Service Key protegida em variáveis de ambiente
- **Deploy Automático** - Atualiza automaticamente a cada push no GitHub
- **Grátis** - Plano hobby suficiente para este projeto

### 🏗️ Arquitetura

```
┌─────────────────┐
│  Vercel Deploy  │
├─────────────────┤
│                 │
│  📱 Frontend    │ ← React/Vite (páginas públicas)
│  (Static)       │
│                 │
│  🔌 API Routes  │ ← Express Serverless (Admin Console)
│  (/api/*)       │   - /api/save-json
│                 │   - /api/save-visual-edits
│                 │   - /api/blog-posts
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Supabase DB   │ ← PostgreSQL (única fonte da verdade)
│   (PostgreSQL)  │
└─────────────────┘
```

---

## 📝 Passo a Passo

### 1️⃣ Instalar Vercel CLI

```bash
npm install -g vercel
```

### 2️⃣ Login no Vercel

```bash
vercel login
```

Siga as instruções no navegador para autenticar.

### 3️⃣ Deploy Inicial

Na pasta do projeto:

```bash
cd c:\temp\Site_Igreja_Meta\site-igreja-v6\workspace\shadcn-ui
vercel
```

**Perguntas do Vercel:**
- **Set up and deploy?** → `Y`
- **Which scope?** → Selecione sua conta
- **Link to existing project?** → `N` (primeira vez)
- **Project name?** → `site-igreja-v6` (ou outro nome)
- **Directory?** → `.` (pasta atual)
- **Override settings?** → `N`

O Vercel irá:
1. Detectar o projeto Vite
2. Criar build automático
3. Configurar rotas da API
4. Gerar URL de preview

### 4️⃣ Configurar Variáveis de Ambiente

**No terminal:**

```bash
# Configurar para PRODUÇÃO
vercel env add VITE_SUPABASE_URL production
# Cole: https://seu-projeto.supabase.co

vercel env add VITE_SUPABASE_ANON_KEY production
# Cole: sua chave anon do Supabase

vercel env add SUPABASE_SERVICE_KEY production
# Cole: sua chave service_role do Supabase (⚠️ SECRETA!)

vercel env add VITE_API_URL production
# Cole: https://seu-projeto.vercel.app
```

**OU no Dashboard da Vercel:**

1. Acesse https://vercel.com/dashboard
2. Selecione seu projeto
3. Settings → Environment Variables
4. Adicione:

| Nome | Valor | Ambientes |
|------|-------|-----------|
| `VITE_SUPABASE_URL` | `https://seu-projeto.supabase.co` | Production, Preview |
| `VITE_SUPABASE_ANON_KEY` | `sua-anon-key` | Production, Preview |
| `SUPABASE_SERVICE_KEY` | `sua-service-role-key` ⚠️ | Production, Preview |
| `VITE_API_URL` | `https://seu-projeto.vercel.app` | Production |

### 5️⃣ Deploy em Produção

```bash
vercel --prod
```

Aguarde o build e deploy. URL final será exibida no terminal.

---

## 🧪 Testar Deployment

### Testar Frontend

```bash
# Abrir no navegador
start https://seu-projeto.vercel.app
```

Verifique se as páginas carregam corretamente.

### Testar API Backend

```bash
# Health check
curl https://seu-projeto.vercel.app/api/health

# Testar endpoint de conteúdo
curl https://seu-projeto.vercel.app/api/content/Index
```

Deve retornar JSON do Supabase.

### Testar Admin Console

```bash
# Abrir console admin
start https://seu-projeto.vercel.app/436F6E736F6C45
```

Teste:
1. Editar conteúdo de uma página
2. Salvar alterações
3. Verificar se salvou no Supabase

---

## 🔄 Deploy Automático

### Configurar GitHub Integration

1. No dashboard da Vercel: Settings → Git
2. Conecte o repositório GitHub
3. Configure:
   - **Production Branch:** `main`
   - **Auto-deploy:** Ativado

**Agora:**
- ✅ Todo push em `main` → Deploy automático
- ✅ Pull Requests → Preview deploy automático
- ✅ Rollback fácil em caso de erro

---

## 🛠️ Comandos Úteis

```bash
# Ver logs do deploy
vercel logs https://seu-projeto.vercel.app

# Listar deploys
vercel ls

# Remover projeto
vercel remove site-igreja-v6

# Ver variáveis de ambiente
vercel env ls

# Promover preview para produção
vercel promote https://seu-projeto-preview.vercel.app
```

---

## ❌ Troubleshooting

### Problema: API Retorna 404

**Causa:** Rotas da API não configuradas corretamente.

**Solução:**
1. Verifique `vercel.json`:
   ```json
   {
     "routes": [
       { "src": "/api/(.*)", "dest": "/server/express-server.js" }
     ]
   }
   ```
2. Redeploy: `vercel --prod`

### Problema: "Cannot find module Supabase"

**Causa:** Dependências não instaladas no build.

**Solução:**
1. Verifique `package.json` tem `@supabase/supabase-js`
2. Limpe cache: `vercel --force`

### Problema: Service Key Exposta

**Causa:** Usou `VITE_` prefix (expõe no frontend).

**Solução:**
1. Use `SUPABASE_SERVICE_KEY` sem `VITE_`
2. Remova variável antiga: `vercel env rm VITE_SUPABASE_SERVICE_KEY`
3. Adicione nova: `vercel env add SUPABASE_SERVICE_KEY production`

### Problema: Editor Não Salva

**Causa:** `VITE_API_URL` não configurada.

**Solução:**
```bash
vercel env add VITE_API_URL production
# Cole: https://seu-projeto.vercel.app
vercel --prod
```

---

## 📊 Monitoramento

### Dashboard da Vercel

Acesse: https://vercel.com/dashboard/[seu-projeto]

**Métricas disponíveis:**
- 📈 Número de requisições
- ⚡ Tempo de resposta
- 🌍 Tráfego por região
- 🐛 Erros e logs

### Logs em Tempo Real

```bash
vercel logs --follow
```

---

## 🔒 Segurança

### ✅ Boas Práticas

1. **Nunca** commite `.env.local`
2. **Sempre** use variáveis de ambiente na Vercel
3. **Service Key** apenas no backend (sem `VITE_`)
4. **Ative** Row Level Security (RLS) no Supabase
5. **Configure** CORS se necessário

### Verificar Segurança

```bash
# Build local deve funcionar sem .env.local
rm .env.local
pnpm build

# Se der erro, você tem credenciais hardcoded!
```

---

## 🎉 Pronto!

Seu site está no ar com:
- ✅ Frontend otimizado e rápido
- ✅ API serverless segura
- ✅ Admin Console funcional online
- ✅ Deploy automático a cada push
- ✅ Zero custo de servidor

**URL Final:**
- 🌐 Site: https://seu-projeto.vercel.app
- 🔧 Admin: https://seu-projeto.vercel.app/436F6E736F6C45

---

## 📚 Recursos

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Serverless Functions](https://vercel.com/docs/functions)
- [Environment Variables](https://vercel.com/docs/environment-variables)
- [Custom Domains](https://vercel.com/docs/custom-domains)

---

**Dúvidas?** Consulte a [documentação oficial](https://vercel.com/docs) ou abra uma issue no GitHub.
