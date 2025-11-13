/**
 * Script para verificar o estado atual da tabela text_entries
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkGranularData() {
  console.log('\n📊 VERIFICAÇÃO DA ESTRUTURA GRANULAR\n');

  // Contar entries por página
  const { data: pages } = await supabase
    .from('text_entries')
    .select('page_id');

  const pageIds = [...new Set(pages.map(p => p.page_id))];

  console.log(`✅ Páginas encontradas: ${pageIds.length}\n`);

  for (const pageId of pageIds) {
    const { count } = await supabase
      .from('text_entries')
      .select('*', { count: 'exact', head: true })
      .eq('page_id', pageId);

    console.log(`   - ${pageId}: ${count} entries`);
  }

  // Total
  const { count: totalCount } = await supabase
    .from('text_entries')
    .select('*', { count: 'exact', head: true });

  console.log(`\n📝 TOTAL: ${totalCount} entries granulares\n`);

  // Mostrar alguns exemplos
  const { data: samples } = await supabase
    .from('text_entries')
    .select('json_key, content')
    .limit(5);

  console.log('📋 EXEMPLOS DE ENTRIES:\n');
  samples.forEach(s => {
    const value = s.content['pt-BR'] || Object.values(s.content)[0];
    const preview = String(value).substring(0, 50);
    console.log(`   ${s.json_key}`);
    console.log(`   → "${preview}${value.length > 50 ? '...' : ''}"\n`);
  });
}

checkGranularData();
