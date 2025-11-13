/**
 * Atualiza copyright e trademark diretamente via Supabase
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env.local') });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function updateCopyright() {
  console.log('📖 Buscando conteúdo atual do index...\n');
  
  // Buscar conteúdo atual
  const { data: currentData, error: fetchError } = await supabase
    .from('page_contents')
    .select('content')
    .eq('page_id', 'index')
    .single();
  
  if (fetchError) {
    console.error('❌ Erro ao buscar dados:', fetchError);
    process.exit(1);
  }
  
  console.log('✓ Conteúdo atual:');
  console.log(`   Copyright: ${currentData.content.footer.copyright}`);
  console.log(`   Trademark: ${currentData.content.footer.trademark}`);
  
  // Atualizar os textos
  const updatedContent = { ...currentData.content };
  updatedContent.footer.copyright = '© 2025 Igreja de Metatron. Todos os direitos reservados.';
  updatedContent.footer.trademark = 'Marcas registradas® protegidas por lei.';
  
  console.log('\n📝 Novos textos:');
  console.log(`   Copyright: ${updatedContent.footer.copyright}`);
  console.log(`   Trademark: ${updatedContent.footer.trademark}`);
  
  // Salvar no Supabase
  console.log('\n💾 Salvando no Supabase...');
  const { error: updateError } = await supabase
    .from('page_contents')
    .update({ content: updatedContent })
    .eq('page_id', 'index');
  
  if (updateError) {
    console.error('❌ Erro ao atualizar:', updateError);
    process.exit(1);
  }
  
  console.log('✅ Copyright e trademark atualizados com sucesso!\n');
  
  // Verificar
  const { data: verifyData } = await supabase
    .from('page_contents')
    .select('content')
    .eq('page_id', 'index')
    .single();
  
  console.log('🔍 Verificação final:');
  console.log(`   Copyright: ${verifyData.content.footer.copyright}`);
  console.log(`   Trademark: ${verifyData.content.footer.trademark}`);
}

updateCopyright();
