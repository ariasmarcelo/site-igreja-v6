/**
 * Executar migration SQL para remover tabelas de estilos
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function dropStyleTables() {
  console.log('\n🗑️  REMOVENDO TABELAS DE ESTILOS\n');

  try {
    // Dropar triggers
    console.log('🔧 Removendo triggers...');
    await supabase.rpc('exec_sql', { 
      sql: 'DROP TRIGGER IF EXISTS update_style_entries_updated_at ON style_entries;' 
    });

    // Dropar índices
    console.log('📇 Removendo índices...');
    await supabase.rpc('exec_sql', { 
      sql: 'DROP INDEX IF EXISTS idx_style_entries_page_id;' 
    });
    await supabase.rpc('exec_sql', { 
      sql: 'DROP INDEX IF EXISTS idx_style_entries_json_key;' 
    });

    // Dropar tabelas
    console.log('🗄️  Removendo tabelas...');
    const { error: dropStylesError } = await supabase.rpc('exec_sql', { 
      sql: 'DROP TABLE IF EXISTS style_entries CASCADE;' 
    });
    
    if (dropStylesError) {
      console.warn('⚠️  Erro ao dropar style_entries:', dropStylesError);
    } else {
      console.log('✅ style_entries removida');
    }

    const { error: dropPageStylesError } = await supabase.rpc('exec_sql', { 
      sql: 'DROP TABLE IF EXISTS page_styles CASCADE;' 
    });
    
    if (dropPageStylesError) {
      console.warn('⚠️  Erro ao dropar page_styles:', dropPageStylesError);
    } else {
      console.log('✅ page_styles removida');
    }

    console.log('\n✅ LIMPEZA CONCLUÍDA!\n');
    console.log('Tabelas removidas:');
    console.log('  - style_entries');
    console.log('  - page_styles');

  } catch (error) {
    console.error('\n❌ Erro:', error);
  }
}

dropStyleTables();
