// Servidor local para testar API content-v2
const express = require('express');
const cors = require('cors');
const contentV2Handler = require('./api/content-v2/[pageId]');

const app = express();
const PORT = 3002;

app.use(cors());
app.use(express.json());

// Simular rota dinâmica da Vercel
app.get('/api/content-v2/:pageId', (req, res) => {
  // Criar objeto req/res compatível com Vercel
  const vercelReq = {
    method: 'GET',
    query: { pageId: req.params.pageId },
    url: req.url
  };
  
  const vercelRes = {
    status: (code) => {
      res.status(code);
      return vercelRes;
    },
    json: (data) => {
      res.json(data);
      return vercelRes;
    },
    setHeader: (key, value) => {
      res.setHeader(key, value);
      return vercelRes;
    },
    end: () => {
      res.end();
      return vercelRes;
    }
  };
  
  contentV2Handler(vercelReq, vercelRes);
});

app.listen(PORT, () => {
  console.log(`\n🚀 Servidor de teste rodando em http://localhost:${PORT}`);
  console.log(`\n📝 Teste a API:`);
  console.log(`   curl http://localhost:${PORT}/api/content-v2/index`);
  console.log(`   curl http://localhost:${PORT}/api/content-v2/purificacao`);
  console.log(`\n⏹️  Para parar: Ctrl+C\n`);
});
