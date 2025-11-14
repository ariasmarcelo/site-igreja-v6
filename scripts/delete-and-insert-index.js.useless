import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Carregar .env.local manualmente
dotenv.config({ path: join(__dirname, '..', '.env.local') });

// Usar SERVICE_ROLE_KEY para bypasses RLS
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY  // SERVICE KEY ao invés de ANON
);

async function deleteAndInsertIndex() {
  try {
    // 1. Carregar JSON correto
    const jsonPath = join(__dirname, '..', 'src', 'locales', 'pt-BR', 'Index.json');
    const correctData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    
    console.log('\n📄 JSON correto carregado:');
    console.log(`   Chaves: ${Object.keys(correctData).join(', ')}`);
    console.log(`   Total: ${Object.keys(correctData).length} chaves\n`);
    
    // 2. DELETAR linha corrompida
    console.log('🗑️  Deletando linha corrompida...');
    const { error: deleteError } = await supabase
      .from('page_contents')
      .delete()
      .eq('page_id', 'index');
    
    if (deleteError) {
      throw new Error(`Erro ao deletar: ${deleteError.message}`);
    }
    console.log('✅ Linha deletada!\n');
    
    // 3. INSERIR dados corretos
    console.log('📥 Inserindo dados corretos...');
    const { error: insertError } = await supabase
      .from('page_contents')
      .insert({
        page_id: 'index',
        content: correctData
      });
    
    if (insertError) {
      throw new Error(`Erro ao inserir: ${insertError.message}`);
    }
    console.log('✅ Dados inseridos!\n');
    
    // 4. Verificar
    const { data: verifyData } = await supabase
      .from('page_contents')
      .select('content')
      .eq('page_id', 'index')
      .single();
    
    if (verifyData) {
      const keys = Object.keys(verifyData.content);
      console.log('✓ Verificação:');
      console.log(`   Chaves no banco: ${keys.length}`);
      console.log(`   Chaves: ${keys.slice(0, 10).join(', ')}...`);
      
      if (keys.length < 20) {
        console.log('\n🎉 SUCESSO! Banco restaurado corretamente!');
      } else {
        console.log('\n⚠️  AINDA TEM PROBLEMA!');
      }
    }
    
  } catch (error) {
    console.error('\n❌ Erro:', error.message);
    process.exit(1);
  }
}

deleteAndInsertIndex();
