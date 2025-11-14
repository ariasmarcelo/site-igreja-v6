/**
 * Script para aplicar migração do conteúdo compartilhado no Supabase
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env.local') });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY
);

async function applyMigration() {
  console.log('🔄 Aplicando migração do conteúdo compartilhado...\n');

  // 1. Adicionar registro compartilhado
  console.log('📝 Criando registro compartilhado (page_id: NULL)...');
  const { error: insertError } = await supabase
    .from('page_contents')
    .insert({
      page_id: null,
      content: {
        footer: {
          copyright: '© 2025 Igreja de Metatron. Todos os direitos reservados.',
          trademark: 'Marcas registradas® protegidas por lei.'
        }
      }
    });

  if (insertError && !insertError.message.includes('duplicate')) {
    console.error('❌ Erro ao inserir:', insertError);
    process.exit(1);
  }
  console.log('✅ Registro compartilhado criado\n');

  // 2. Remover footer do index (agora vem do compartilhado)
  console.log('🗑️  Removendo footer do index (agora virá do compartilhado)...');
  const { data: indexData } = await supabase
    .from('page_contents')
    .select('content')
    .eq('page_id', 'index')
    .single();

  if (indexData && indexData.content.footer) {
    const updatedContent = { ...indexData.content };
    delete updatedContent.footer;

    const { error: updateError } = await supabase
      .from('page_contents')
      .update({ content: updatedContent })
      .eq('page_id', 'index');

    if (updateError) {
      console.error('❌ Erro ao atualizar index:', updateError);
      process.exit(1);
    }
    console.log('✅ Footer removido do index\n');
  }

  // 3. Verificação
  console.log('🔍 Verificando estrutura...\n');
  const { data: allPages } = await supabase
    .from('page_contents')
    .select('page_id, content')
    .order('page_id', { nullsFirst: true });

  console.log('📊 Páginas no banco:\n');
  allPages.forEach(page => {
    const id = page.page_id || 'COMPARTILHADO';
    const hasFooter = page.content.footer ? '✅ TEM footer' : '❌ SEM footer';
    console.log(`   ${id.padEnd(20)} ${hasFooter}`);
  });

  console.log('\n✨ Migração concluída com sucesso!');
  console.log('\n📋 Próximo passo: Atualizar hook useLocaleTexts para usar .or()');
}

applyMigration();
