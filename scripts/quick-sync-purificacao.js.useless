// Sync simples para Purificacao - executa rapidamente antes do servidor fechar
import { readFileSync } from 'fs';

const json = JSON.parse(readFileSync('src/locales/pt-BR/Purificacao.json', 'utf-8'));

console.log('📤 Sincronizando com Supabase...');

fetch('http://localhost:3001/api/save-json', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ pageId: 'purificacao', content: json })
})
.then(r => r.ok ? r.json() : Promise.reject(r.statusText))
.then(() => {
  console.log('✅ Sincronizado com sucesso!');
  console.log('🌐 Antahkarana atualizado no Supabase!');
  process.exit(0);
})
.catch(e => {
  console.error('❌ Erro:', e);
  process.exit(1);
});
