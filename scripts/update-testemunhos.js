import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carregar .env.local
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente não configuradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateTestemunhos() {
  try {
    // Ler o arquivo JSON
    const jsonPath = path.join(__dirname, '../src/locales/pt-BR/Testemunhos.json');
    const jsonContent = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

    console.log('📝 Atualizando testemunhos no Supabase...');

    // Atualizar no Supabase
    const { data, error } = await supabase
      .from('page_contents')
      .upsert({
        page_id: 'testemunhos',
        content: jsonContent,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'page_id'
      });

    if (error) {
      console.error('❌ Erro ao atualizar:', error);
      process.exit(1);
    }

    console.log('✅ Testemunhos atualizados com sucesso!');
    console.log('📊 Badges configurados:');
    console.log('   - ✓ Verificado:', jsonContent.testimonials.filter(t => t.verified).length);
    console.log('   - ⏳ Em verificação:', jsonContent.testimonials.filter(t => !t.verified).length);
    
  } catch (error) {
    console.error('❌ Erro:', error);
    process.exit(1);
  }
}

updateTestemunhos();
