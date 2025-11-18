import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function checkStructure() {
  console.log('\n=== ESTRUTURA DOS PRINCÍPIOS NO BANCO ===\n');
  
  const { data, error } = await supabase
    .from('text_entries')
    .select('page_id, json_key, content')
    .eq('page_id', 'quemsomos')
    .like('json_key', '%principios%')
    .order('json_key');
    
  if (error) {
    console.log('ERRO:', error.message);
    return;
  }
  
  console.log(`Total de registros: ${data.length}\n`);
  
  // Agrupar por tipo
  const items = data.filter(e => e.json_key.includes('.items['));
  const outros = data.filter(e => !e.json_key.includes('.items['));
  
  console.log('--- METADADOS DA SEÇÃO ---');
  outros.forEach(entry => {
    console.log(`${entry.json_key}`);
    console.log(`  → ${JSON.stringify(entry.content)}\n`);
  });
  
  console.log('--- ITEMS (primeiros 5) ---');
  items.slice(0, 15).forEach(entry => {
    const content = entry.content['pt-BR'] || JSON.stringify(entry.content);
    const preview = content.length > 60 ? content.substring(0, 60) + '...' : content;
    console.log(`${entry.json_key}`);
    console.log(`  → ${preview}\n`);
  });
  
  if (items.length > 15) {
    console.log(`... e mais ${items.length - 15} registros\n`);
  }
  
  // Identificar quantos items existem
  const indexes = new Set();
  items.forEach(entry => {
    const match = entry.json_key.match(/items\[(\d+)\]/);
    if (match) indexes.add(match[1]);
  });
  
  console.log('--- ÍNDICES ENCONTRADOS ---');
  console.log(Array.from(indexes).sort((a,b) => parseInt(a) - parseInt(b)).join(', '));
  console.log(`\nTotal de items: ${indexes.size}`);
}

checkStructure();
