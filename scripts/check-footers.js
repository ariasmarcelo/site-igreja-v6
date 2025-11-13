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

const { data } = await supabase.from('page_contents').select('page_id, content');

console.log('\n📊 Páginas no Supabase:\n');
data.forEach(page => {
  const hasFooter = page.content.footer ? '✅ TEM footer' : '❌ SEM footer';
  console.log(`   ${page.page_id.padEnd(15)} ${hasFooter}`);
  if (page.content.footer) {
    console.log(`      Copyright: ${page.content.footer.copyright || 'N/A'}`);
    console.log(`      Trademark: ${page.content.footer.trademark || 'N/A'}`);
  }
});
