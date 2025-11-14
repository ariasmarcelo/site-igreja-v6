/**
 * Script para restaurar dados do Index a partir do supabase-index-dump.json
 */

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

async function syncCopyrightToSupabase() {
  console.log('📖 Carregando supabase-index-dump.json...');
  
  // Carregar o dump
  const dumpPath = join(__dirname, '..', 'supabase-index-dump.json');
  const rawContent = fs.readFileSync(dumpPath, 'utf-8');
  const outerJson = JSON.parse(rawContent);
  const correctData = JSON.parse(outerJson);
  
  console.log('✓ JSON carregado:');
  console.log(`   Copyright: ${correctData.footer.copyright}`);
  console.log(`   Trademark: ${correctData.footer.trademark}`);
  
  // Atualizar no Supabase
  console.log('\n🔄 Atualizando Supabase...');
  const { error } = await supabase
    .from('page_contents')
    .update({ content: correctData })
    .eq('page_id', 'index');
  
  if (error) {
    console.error('❌ Erro ao atualizar:', error);
    process.exit(1);
  }
  
  console.log('✅ Supabase atualizado com sucesso!');
  
  // Verificar
  console.log('\n🔍 Verificando atualização...');
  const { data } = await supabase
    .from('page_contents')
    .select('content')
    .eq('page_id', 'index')
    .single();
  
  if (data) {
    console.log('✓ Dados no banco:');
    console.log(`   Copyright: ${data.content.footer.copyright}`);
    console.log(`   Trademark: ${data.content.footer.trademark}`);
  }
}

syncCopyrightToSupabase();
