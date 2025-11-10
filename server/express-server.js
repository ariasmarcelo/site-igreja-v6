import express from 'express';
import cors from 'cors';
import apiRouter from './supabase-routes.js';

const app = express();
const PORT = 3001;

// Middleware de tratamento de erros global
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  // Não encerrar o processo, apenas logar o erro
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  // Não encerrar o processo, apenas logar o erro
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Middleware de erro para requisições
app.use((err, req, res, next) => {
  console.error('❌ Error processing request:', err);
  res.status(500).json({ 
    error: 'Internal server error', 
    message: err.message 
  });
});

// Rotas API
app.use('/api', apiRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'API Server is running' });
});

const server = app.listen(PORT, () => {
  console.log(`🚀 API Server running on http://localhost:${PORT}`);
  console.log(`📝 Endpoints disponíveis (Supabase):`);
  console.log(`   GET  /api/content/:pageId - Buscar conteúdo JSON`);
  console.log(`   GET  /api/styles/:pageId - Buscar estilos CSS`);
  console.log(`   POST /api/save-json - Salvar JSON completo`);
  console.log(`   POST /api/save-visual-edits - Salvar edições de TEXTO`);
  console.log(`   POST /api/save-styles - Salvar edições de CSS`);
  console.log(`   PUT  /api/blog-posts/:id - Atualizar artigo do blog`);
  console.log(`   POST /api/blog-posts - Criar novo artigo do blog`);
  console.log(`\n💾 Usando Supabase (PostgreSQL) como backend`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('⚠️  SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('✅ HTTP server closed');
  });
});

process.on('SIGINT', () => {
  console.log('\n⚠️  SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('✅ HTTP server closed');
    process.exit(0);
  });
});
