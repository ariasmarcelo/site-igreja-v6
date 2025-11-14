// Atualiza Purificacao no Supabase com os dados locais (incluindo Antahkarana)
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY  // Usa service_role key para update
);

async function updatePurificacao() {
  console.log('📖 Lendo Purificacao.json local...\n');
  
  const content = JSON.parse(
    readFileSync('src/locales/pt-BR/Purificacao.json', 'utf-8')
  );
  
  console.log('✅ JSON carregado');
  console.log('📊 Chaves:', Object.keys(content).join(', '));
  
  // Verificar se tem Antahkarana
  const jsonStr = JSON.stringify(content);
  const hasAntahkarana = jsonStr.includes('Antahkarana') || jsonStr.includes('antahkarana');
  
  if (hasAntahkarana) {
    console.log('✅ Antahkarana encontrado no arquivo local!');
  } else {
    console.log('❌ Antahkarana NÃO encontrado no arquivo local!');
    process.exit(1);
  }
  
  console.log('\n📤 Atualizando Supabase...');
  
  const { data, error } = await supabase
    .from('page_contents')
    .update({
      content: content,
      updated_at: new Date().toISOString()
    })
    .eq('page_id', 'purificacao')
    .select();
  
  if (error) {
    console.error('❌ Erro ao atualizar:', error);
    process.exit(1);
  }
  
  console.log('✅ Supabase atualizado com sucesso!');
  console.log('📝 Registro atualizado:', data[0]?.page_id);
  console.log('📅 Timestamp:', data[0]?.updated_at);
  console.log('\n🕉️  Antahkarana agora está no banco de dados!');
  console.log('🌐 Recarregue o site para ver as mudanças');
}

updatePurificacao();
