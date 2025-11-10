# Servidor API - Guia de Gerenciamento

## 🚀 Como Iniciar o Servidor

### Opção 1: Usando pnpm (Recomendado)
```bash
cd c:\temp\Site_Igreja_Meta\V5_SiteIgreja\workspace\shadcn-ui
pnpm server
```

### Opção 2: Usando node diretamente
```bash
node "c:\temp\Site_Igreja_Meta\V5_SiteIgreja\workspace\shadcn-ui\server\express-server.js"
```

## ⚠️ Problemas Identificados e Soluções

### 1. Servidor cai quando terminal executa outros comandos
**Problema**: Quando executamos comandos no mesmo terminal onde o servidor está rodando (como `pnpm add`, `git`, etc), o processo do servidor é interrompido.

**Solução**: 
- ✅ **Use terminais separados**: Um para o servidor API e outro para comandos gerais
- ✅ **Melhorias implementadas**: Tratamento robusto de erros para evitar crashes inesperados

### 2. Melhorias Implementadas no Código

#### express-server.js
```javascript
// Tratamento de exceções não capturadas
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  // Não encerra o processo, apenas loga o erro
});

// Tratamento de promises rejeitadas
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  // Não encerra o processo, apenas loga o erro
});

// Middleware de erro para requisições
app.use((err, req, res, next) => {
  console.error('❌ Error processing request:', err);
  res.status(500).json({ 
    error: 'Internal server error', 
    message: err.message 
  });
});

// Graceful shutdown (CTRL+C)
process.on('SIGINT', () => {
  console.log('\n⚠️  SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('✅ HTTP server closed');
    process.exit(0);
  });
});
```

#### supabase-routes.js
```javascript
// Wrapper para tratamento automático de erros em todas as rotas
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((error) => {
    console.error('❌ Error in route:', req.method, req.path);
    console.error('Error details:', error);
    res.status(500).json({ 
      error: 'Internal server error', 
      message: error.message,
      path: req.path
    });
  });
};
```

## 📋 Checklist de Boas Práticas

✅ **Terminal dedicado para o servidor**
- Abra um terminal separado exclusivamente para o servidor API
- Use VS Code: `Terminal > Split Terminal` para criar terminais lado a lado

✅ **Monitoramento**
- O servidor agora loga todos os erros sem cair
- Erros de requisição retornam JSON com detalhes do problema

✅ **Restart automático** (Opcional - Futuro)
- Considerar usar `nodemon` para reiniciar automaticamente quando arquivos mudarem
- Comando: `pnpm add -D nodemon` + script `"server:dev": "nodemon server/express-server.js"`

## 🔍 Verificar Status do Servidor

```bash
# Teste de saúde
curl http://localhost:3001/health

# Ou no navegador
http://localhost:3001/health
```

Resposta esperada:
```json
{
  "status": "ok",
  "message": "API Server is running"
}
```

## 📝 Endpoints Disponíveis

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/health` | Verificar status do servidor |
| GET | `/api/content/:pageId` | Buscar conteúdo JSON |
| GET | `/api/styles/:pageId` | Buscar estilos CSS |
| POST | `/api/save-json` | Salvar JSON completo |
| POST | `/api/save-visual-edits` | Salvar edições de TEXTO |
| POST | `/api/save-styles` | Salvar edições de CSS |
| PUT | `/api/blog-posts/:id` | Atualizar artigo do blog |
| POST | `/api/blog-posts` | Criar novo artigo do blog |

## 🛡️ Segurança

- ✅ CORS habilitado
- ✅ Limite de payload: 10mb
- ✅ Sanitização de HTML em inputs
- ✅ Uso de Supabase service_role key (apenas no servidor)
- ✅ Variáveis de ambiente em `.env.local`

## 🔧 Troubleshooting

### Servidor não inicia
1. Verificar se a porta 3001 está livre: `netstat -ano | findstr :3001`
2. Verificar variáveis de ambiente em `.env.local`
3. Verificar se `@supabase/supabase-js` está instalado: `pnpm list @supabase/supabase-js`

### Servidor cai frequentemente
1. **Use terminal dedicado** - não execute outros comandos no mesmo terminal
2. Verifique os logs para identificar erros específicos
3. Verifique a conexão com Supabase

### Erros de conexão com Supabase
1. Verificar `.env.local`:
   - `VITE_SUPABASE_URL`
   - `SUPABASE_SERVICE_KEY`
2. Verificar acesso à internet
3. Verificar se o projeto Supabase está ativo
