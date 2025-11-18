import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

// Simular o que a API /api/content-v2/quemsomos faz
async function simulateAPI() {
  console.log('\n=== SIMULANDO GET /api/content-v2/quemsomos ===\n');
  
  // 1. Buscar entries da página
  const { data: entries, error } = await supabase
    .from('text_entries')
    .select('json_key, content')
    .eq('page_id', 'quemsomos');
    
  if (error) {
    console.error('Erro:', error);
    return;
  }
  
  console.log(`Total de entries: ${entries.length}\n`);
  
  // 2. Reconstruir objeto (simplificado)
  const result = {};
  
  entries.forEach(entry => {
    const key = entry.json_key.replace('quemsomos.', '');
    const value = entry.content['pt-BR'];
    
    // Parsing do path (ex: "principios.items[0].title")
    const parts = key.split('.');
    let current = result;
    
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      
      // Se tem array [N]
      if (part.includes('[')) {
        const [arrayName, indexStr] = part.split('[');
        const index = parseInt(indexStr.replace(']', ''));
        
        if (!current[arrayName]) current[arrayName] = [];
        if (!current[arrayName][index]) current[arrayName][index] = {};
        current = current[arrayName][index];
      } else {
        if (!current[part]) current[part] = {};
        current = current[part];
      }
    }
    
    // Última parte (campo final)
    const lastPart = parts[parts.length - 1];
    current[lastPart] = value;
  });
  
  console.log('=== OBJETO RECONSTRUÍDO ===\n');
  console.log(JSON.stringify(result, null, 2));
  
  console.log('\n=== ITEMS DA SEÇÃO PRINCIPIOS ===\n');
  if (result.principios?.items) {
    result.principios.items.forEach((item, i) => {
      console.log(`[${i}] ${item.title}`);
      console.log(`    tipo: ${item.tipo || '❌ AUSENTE (usará fallback "principio")'}`);
    });
  }
}

simulateAPI();
