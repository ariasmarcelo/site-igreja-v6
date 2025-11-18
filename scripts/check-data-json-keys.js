/**
 * Script para verificar e corrigir data-json-key em todas as páginas
 * 
 * Funcionalidade:
 * 1. Lê todos os arquivos TSX em src/pages/
 * 2. Extrai todos os data-json-key
 * 3. Valida se seguem o padrão: pageId.path
 * 4. Verifica se os dados existem no Supabase
 * 5. Sincroniza dados ausentes
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuração Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://fxnucvvcxopdzflhskqv.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ4bnVjdnZjeG9wZHpmbGhza3F2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE2MTM1ODIsImV4cCI6MjA0NzE4OTU4Mn0.j-R3MgFMhl6_M1d2vFkSIOVfZbsKTyEm9cB0FqoZBPg';

const supabase = createClient(supabaseUrl, supabaseKey);

// Mapeamento de nomes de arquivo para pageId
const PAGE_ID_MAP = {
  'Index.tsx': 'index',
  'QuemSomos.tsx': 'quemsomos',
  'Tratamentos.tsx': 'tratamentos',
  'Purificacao.tsx': 'purificacao',
  'Artigos.tsx': 'artigos',
  'ArtigosPage.tsx': 'artigos',
  'Contato.tsx': 'contato'
};

/**
 * Extrai todos os data-json-key de um arquivo
 */
function extractDataJsonKeys(filePath, content) {
  const regex = /data-json-key=["'`]([^"'`]+)["'`]/g;
  const keys = [];
  let match;
  
  while ((match = regex.exec(content)) !== null) {
    keys.push({
      key: match[1],
      file: path.basename(filePath)
    });
  }
  
  return keys;
}

/**
 * Valida se a key segue o padrão pageId.path
 */
function validateKeyFormat(key, expectedPageId) {
  // Extrair templatestrings: `${var}` ou ${var}
  const hasTemplate = key.includes('${') || key.includes('`');
  
  if (hasTemplate) {
    // Para keys dinâmicas, validar apenas o prefixo
    const prefix = key.split('.')[0].replace(/[`${}]/g, '');
    return {
      valid: true,
      isDynamic: true,
      pageId: prefix,
      message: `Dynamic key: ${key}`
    };
  }
  
  const parts = key.split('.');
  if (parts.length < 2) {
    return {
      valid: false,
      pageId: null,
      message: `Key must have at least 2 parts: ${key}`
    };
  }
  
  const keyPageId = parts[0];
  
  // Verificar se o pageId da key bate com o esperado
  if (keyPageId !== expectedPageId) {
    return {
      valid: false,
      pageId: keyPageId,
      expectedPageId,
      message: `Page ID mismatch: expected "${expectedPageId}", got "${keyPageId}"`
    };
  }
  
  return {
    valid: true,
    pageId: keyPageId,
    jsonPath: parts.slice(1).join('.'),
    message: 'Valid'
  };
}

/**
 * Busca dados no Supabase
 */
async function checkSupabaseData(pageId, jsonKey) {
  try {
    const { data, error } = await supabase
      .from('text_entries')
      .select('*')
      .eq('page_id', pageId)
      .eq('json_key', jsonKey)
      .single();
    
    if (error && error.code !== 'PGRST116') { // PGRST116 = not found
      console.error(`Error checking ${pageId}.${jsonKey}:`, error);
      return { exists: false, error };
    }
    
    return { exists: !!data, data };
  } catch (err) {
    return { exists: false, error: err };
  }
}

/**
 * Processa todos os arquivos TSX
 */
async function processAllPages() {
  const pagesDir = path.join(__dirname, '../src/pages');
  const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.tsx'));
  
  console.log('🔍 Scanning pages for data-json-key attributes...\n');
  
  const results = {
    total: 0,
    valid: 0,
    invalid: 0,
    missing: 0,
    dynamic: 0,
    byPage: {}
  };
  
  for (const file of files) {
    const pageId = PAGE_ID_MAP[file];
    if (!pageId) {
      console.log(`⚠️  Skipping ${file} (no pageId mapping)`);
      continue;
    }
    
    const filePath = path.join(pagesDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const keys = extractDataJsonKeys(filePath, content);
    
    if (keys.length === 0) {
      console.log(`ℹ️  ${file}: No data-json-key found`);
      continue;
    }
    
    console.log(`\n📄 ${file} (pageId: ${pageId})`);
    console.log(`   Found ${keys.length} data-json-key attributes\n`);
    
    results.byPage[pageId] = {
      file,
      total: keys.length,
      valid: 0,
      invalid: 0,
      missing: 0,
      dynamic: 0,
      issues: []
    };
    
    for (const { key } of keys) {
      results.total++;
      
      const validation = validateKeyFormat(key, pageId);
      
      if (validation.isDynamic) {
        results.dynamic++;
        results.byPage[pageId].dynamic++;
        console.log(`   🔄 ${key} (dynamic)`);
        continue;
      }
      
      if (!validation.valid) {
        results.invalid++;
        results.byPage[pageId].invalid++;
        results.byPage[pageId].issues.push({
          key,
          type: 'invalid_format',
          message: validation.message
        });
        console.log(`   ❌ ${key}`);
        console.log(`      ${validation.message}`);
        continue;
      }
      
      // Verificar no Supabase
      const dbCheck = await checkSupabaseData(validation.pageId, validation.jsonPath);
      
      if (!dbCheck.exists) {
        results.missing++;
        results.byPage[pageId].missing++;
        results.byPage[pageId].issues.push({
          key,
          type: 'missing_data',
          pageId: validation.pageId,
          jsonPath: validation.jsonPath
        });
        console.log(`   ⚠️  ${key} (missing in database)`);
      } else {
        results.valid++;
        results.byPage[pageId].valid++;
        console.log(`   ✅ ${key}`);
      }
    }
  }
  
  return results;
}

/**
 * Gera relatório final
 */
function generateReport(results) {
  console.log('\n\n' + '='.repeat(60));
  console.log('📊 FINAL REPORT');
  console.log('='.repeat(60) + '\n');
  
  console.log(`Total keys found: ${results.total}`);
  console.log(`  ✅ Valid: ${results.valid}`);
  console.log(`  🔄 Dynamic: ${results.dynamic}`);
  console.log(`  ❌ Invalid format: ${results.invalid}`);
  console.log(`  ⚠️  Missing data: ${results.missing}\n`);
  
  console.log('By Page:');
  for (const [pageId, stats] of Object.entries(results.byPage)) {
    console.log(`\n  ${pageId} (${stats.file}):`);
    console.log(`    Total: ${stats.total}`);
    console.log(`    Valid: ${stats.valid}`);
    console.log(`    Dynamic: ${stats.dynamic}`);
    console.log(`    Invalid: ${stats.invalid}`);
    console.log(`    Missing: ${stats.missing}`);
    
    if (stats.issues.length > 0) {
      console.log(`    Issues:`);
      for (const issue of stats.issues) {
        console.log(`      - ${issue.type}: ${issue.key}`);
        if (issue.message) {
          console.log(`        ${issue.message}`);
        }
      }
    }
  }
  
  console.log('\n' + '='.repeat(60) + '\n');
  
  // Salvar relatório em arquivo
  const reportPath = path.join(__dirname, '../logs/data-json-key-report.json');
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`📝 Full report saved to: ${reportPath}\n`);
}

// Executar
(async () => {
  try {
    const results = await processAllPages();
    generateReport(results);
    
    if (results.invalid > 0 || results.missing > 0) {
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
})();
