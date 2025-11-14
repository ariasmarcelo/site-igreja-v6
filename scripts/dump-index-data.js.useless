import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env.local') });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function dumpIndexData() {
  const { data, error } = await supabase
    .from('page_contents')
    .select('content')
    .eq('page_id', 'index')
    .single();
  
  if (error) {
    console.error('Erro:', error);
    return;
  }
  
  // Salvar primeiras 50 chaves para análise
  const keys = Object.keys(data.content);
  console.log(`\n📊 Total de chaves: ${keys.length}`);
  console.log(`\n🔑 Primeiras 20 chaves:`);
  keys.slice(0, 20).forEach((key, i) => {
    const value = data.content[key];
    const preview = typeof value === 'string' ? value.substring(0, 50) : JSON.stringify(value).substring(0, 50);
    console.log(`${i + 1}. "${key}": ${preview}...`);
  });
  
  // Salvar estrutura completa em arquivo
  fs.writeFileSync('supabase-index-dump.json', JSON.stringify(data.content, null, 2));
  console.log('\n💾 Dump completo salvo em: supabase-index-dump.json');
}

dumpIndexData();
