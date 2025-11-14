/**
 * Script para atualizar textos de copyright com símbolos corretos
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

try {
  console.log('📖 Lendo supabase-index-dump.json...');
  
  const jsonPath = join(__dirname, '../supabase-index-dump.json');
  const rawContent = readFileSync(jsonPath, 'utf-8');
  const outerJson = JSON.parse(rawContent);
  const data = JSON.parse(outerJson);
  
  console.log('📝 Atualizando copyright e trademark...');
  
  // Atualizar com símbolos corretos
  data.footer.copyright = '© 2025 Igreja de Metatron. Todos os direitos reservados.';
  data.footer.trademark = 'Marcas registradas® protegidas por lei.';
  
  console.log(`✓ Copyright: ${data.footer.copyright}`);
  console.log(`✓ Trademark: ${data.footer.trademark}`);
  
  // Salvar de volta (mantendo formato do dump)
  const updatedContent = JSON.stringify(JSON.stringify(data, null, 2));
  writeFileSync(jsonPath, updatedContent, 'utf-8');
  
  console.log('\n✅ Arquivo atualizado com sucesso!');
  console.log('\n📤 Próximo passo: Sincronizar com Supabase usando:');
  console.log('   node scripts/restore-index-data.js');
  
} catch (error) {
  console.error('❌ Erro:', error.message);
  process.exit(1);
}
