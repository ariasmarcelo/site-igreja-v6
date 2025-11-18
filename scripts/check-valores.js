import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function checkValores() {
  console.log('\n=== VERIFICANDO DADOS DE VALORES ===\n');
  
  const { data, error } = await supabase
    .from('text_entries')
    .select('page_id, json_key, content')
    .like('json_key', '%valores%')
    .order('json_key');
    
  if (error) {
    console.error('Erro:', error);
    return;
  }
  
  console.log(`Total de entries: ${data.length}\n`);
  
  data.forEach(entry => {
    console.log(`page_id: ${entry.page_id}`);
    console.log(`json_key: ${entry.json_key}`);
    const preview = JSON.stringify(entry.content).substring(0, 100);
    console.log(`content: ${preview}...`);
    console.log('');
  });
}

checkValores();
