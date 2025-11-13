// Teste simples da query com OR para buscar conteúdo compartilhado
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente não encontradas!');
  console.error('   VITE_SUPABASE_URL:', supabaseUrl ? '✅' : '❌');
  console.error('   VITE_SUPABASE_ANON_KEY:', supabaseKey ? '✅' : '❌');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSharedContent() {
  console.log('\n🔍 Testando query com OR para conteúdo compartilhado...\n');
  
  const pageId = 'index';
  
  try {
    // Query: WHERE page_id = 'index' OR page_id IS NULL
    const { data, error } = await supabase
      .from('page_contents')
      .select('page_id, content')
      .or(`page_id.eq.${pageId},page_id.is.null`);

    if (error) {
      console.error('❌ Erro na query:', error.message);
      return;
    }

    console.log(`✅ Query executada com sucesso!`);
    console.log(`📊 Registros retornados: ${data.length}\n`);

    data.forEach((record, index) => {
      console.log(`--- Registro ${index + 1} ---`);
      console.log(`page_id: ${record.page_id || '🌐 NULL (COMPARTILHADO)'}`);
      console.log(`Chaves no content: ${Object.keys(record.content).join(', ')}`);
      
      if (record.content.footer) {
        console.log('✅ TEM FOOTER:');
        console.log(`   Copyright: ${record.content.footer.copyright}`);
        console.log(`   Trademark: ${record.content.footer.trademark}`);
      } else {
        console.log('❌ SEM FOOTER');
      }
      console.log('');
    });

    // Fazer merge
    const sharedRecord = data.find(row => row.page_id === null);
    const pageRecord = data.find(row => row.page_id === pageId);

    const mergedContent = {
      ...(sharedRecord?.content || {}),
      ...(pageRecord?.content || {})
    };

    console.log('--- MERGE FINAL ---');
    console.log(`Chaves mescladas: ${Object.keys(mergedContent).join(', ')}`);
    
    if (mergedContent.footer) {
      console.log('✅ Footer no merge:');
      console.log(`   ${mergedContent.footer.copyright}`);
      console.log(`   ${mergedContent.footer.trademark}`);
    } else {
      console.log('❌ Footer NÃO encontrado no merge!');
    }
    
  } catch (err) {
    console.error('❌ Erro geral:', err.message);
  }
}

testSharedContent();
