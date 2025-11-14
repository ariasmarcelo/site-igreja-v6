// Verifica o conteúdo atual no Supabase para purificacao
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function checkSupabaseContent() {
  console.log('🔍 Verificando conteúdo no Supabase...\n');
  
  const { data, error } = await supabase
    .from('page_contents')
    .select('*')
    .eq('page_id', 'purificacao')
    .single();
  
  if (error) {
    console.error('❌ Erro:', error);
    return;
  }
  
  if (!data) {
    console.log('⚠️  Nenhum dado encontrado para purificacao');
    return;
  }
  
  console.log('✅ Dados encontrados:');
  console.log('📅 Criado em:', data.created_at);
  console.log('📅 Atualizado em:', data.updated_at);
  console.log('\n📝 Fase Final (faseFinal):');
  
  if (data.content && data.content.faseFinal) {
    console.log('  - title:', data.content.faseFinal.title);
    console.log('  - subtitle:', data.content.faseFinal.subtitle);
    console.log('  - iniciacao.title:', data.content.faseFinal.iniciacao?.title);
    console.log('\n🔍 Procurando "Antahkarana"...');
    const jsonStr = JSON.stringify(data.content, null, 2);
    const matches = jsonStr.match(/antahkarana/gi);
    if (matches) {
      console.log(`✅ Encontrado ${matches.length} referência(s) a "Antahkarana"`);
    } else {
      console.log('❌ "Antahkarana" NÃO encontrado no Supabase!');
      console.log('\n💡 É necessário atualizar o banco de dados.');
    }
  }
}

checkSupabaseContent();
