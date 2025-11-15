import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

// Load .env.local manually
const envContent = readFileSync('.env.local', 'utf-8');
envContent.split('\n').forEach(line => {
  const [key, ...values] = line.split('=');
  if (key) process.env[key.trim()] = values.join('=').trim();
});

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function checkSharedKeys() {
  const { data, error } = await supabase
    .from('text_entries')
    .select('json_key')
    .eq('page_id', '__shared__');
  
  if (error) {
    console.error('ERROR:', error);
    return;
  }
  
  console.log('Keys in Supabase for __shared__:');
  console.log(JSON.stringify(data, null, 2));
}

checkSharedKeys();
