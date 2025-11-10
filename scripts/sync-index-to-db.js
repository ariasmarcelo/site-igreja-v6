/**
 * Script para sincronizar Index.json com o banco de dados Supabase
 * 
 * Uso: node scripts/sync-index-to-db.js
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function syncIndexToDb() {
  try {
    console.log('📖 Lendo Index.json...');
    
    // Ler o arquivo JSON
    const jsonPath = join(__dirname, '../src/locales/pt-BR/Index.json');
    const jsonContent = JSON.parse(readFileSync(jsonPath, 'utf-8'));
    
    console.log('✓ JSON carregado com sucesso');
    console.log(`📊 Chaves principais: ${Object.keys(jsonContent).join(', ')}`);
    
    // Enviar para API
    console.log('\n📤 Enviando para banco de dados...');
    
    const response = await fetch('http://localhost:3001/api/sync-json-to-db', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pageId: 'index',
        jsonContent: jsonContent
      })
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Sincronização concluída com sucesso!');
      console.log(result);
    } else {
      console.error('❌ Erro na sincronização:', result);
      process.exit(1);
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  }
}

// Executar
syncIndexToDb();
