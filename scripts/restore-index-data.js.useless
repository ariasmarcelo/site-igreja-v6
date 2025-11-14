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

async function restoreIndexData() {
  // Carregar o JSON correto do arquivo
  const correctData = JSON.parse(
    fs.readFileSync(join(__dirname, '..', 'src', 'locales', 'pt-BR', 'Index.json'), 'utf-8')
  );
  
  console.log('\n📄 JSON correto carregado:');
  console.log(`   Chaves: ${Object.keys(correctData).join(', ')}`);
  console.log(`   Total: ${Object.keys(correctData).length} chaves`);
  
  // Atualizar no Supabase
  console.log('\n🔄 Atualizando Supabase...');
  const { error } = await supabase
    .from('page_contents')
    .update({ content: correctData })
    .eq('page_id', 'index');
  
  if (error) {
    console.error('❌ Erro ao atualizar:', error);
  } else {
    console.log('✅ Supabase atualizado com sucesso!');
  }
  
  // Verificar
  const { data } = await supabase
    .from('page_contents')
    .select('content')
    .eq('page_id', 'index')
    .single();
  
  console.log('\n✓ Verificação:');
  console.log(`   Chaves no banco agora: ${Object.keys(data.content).length}`);
  console.log(`   Chaves: ${Object.keys(data.content).join(', ')}`);
}

restoreIndexData();
