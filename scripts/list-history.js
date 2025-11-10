#!/usr/bin/env node
/**
 * Script para listar e restaurar versões do histórico de páginas
 * Acessa a tabela page_history do Supabase
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, writeFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Carregar variáveis de ambiente
config({ path: join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Erro: VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY devem estar definidos no .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Parse argumentos
const args = process.argv.slice(2);
const command = args[0];

// Páginas disponíveis
const PAGES = ['index', 'quem-somos', 'tratamentos', 'testemunhos', 'contato', 'purificacao', 'artigos'];

async function listHistory(pageId, contentType = 'json') {
  console.log(`\n📋 Histórico de versões: ${pageId} (${contentType})\n`);
  
  const { data, error } = await supabase
    .from('page_history')
    .select('id, saved_at, created_by')
    .eq('page_id', pageId.toLowerCase())
    .eq('content_type', contentType)
    .order('saved_at', { ascending: false })
    .limit(5);
  
  if (error) {
    console.error('❌ Erro:', error.message);
    return;
  }
  
  if (!data || data.length === 0) {
    console.log('⚠️  Nenhuma versão encontrada\n');
    return;
  }
  
  console.log('ID      | Data/Hora           | Usuário');
  console.log('--------|---------------------|----------');
  data.forEach(v => {
    const date = new Date(v.saved_at);
    const formatted = date.toLocaleString('pt-BR');
    console.log(`${v.id.toString().padEnd(7)} | ${formatted.padEnd(19)} | ${v.created_by || 'admin'}`);
  });
  console.log('');
}

async function listAllPages() {
  console.log('\n📊 Versões disponíveis por página:\n');
  
  for (const page of PAGES) {
    const { data: jsonVersions } = await supabase
      .from('page_history')
      .select('id', { count: 'exact' })
      .eq('page_id', page)
      .eq('content_type', 'json');
    
    const { data: cssVersions } = await supabase
      .from('page_history')
      .select('id', { count: 'exact' })
      .eq('page_id', page)
      .eq('content_type', 'css');
    
    const jsonCount = jsonVersions?.length || 0;
    const cssCount = cssVersions?.length || 0;
    
    if (jsonCount > 0 || cssCount > 0) {
      console.log(`📄 ${page.padEnd(15)} - JSON: ${jsonCount} versões | CSS: ${cssCount} versões`);
    }
  }
  console.log('');
}

async function viewVersion(pageId, contentType, versionId) {
  console.log(`\n🔍 Visualizando versão ${versionId} de ${pageId} (${contentType})...\n`);
  
  const { data, error } = await supabase
    .from('page_history')
    .select('*')
    .eq('page_id', pageId.toLowerCase())
    .eq('content_type', contentType)
    .eq('id', versionId)
    .single();
  
  if (error) {
    console.error('❌ Erro:', error.message);
    return;
  }
  
  console.log('Metadados:');
  console.log(`  ID: ${data.id}`);
  console.log(`  Página: ${data.page_id}`);
  console.log(`  Tipo: ${data.content_type}`);
  console.log(`  Salvo em: ${new Date(data.saved_at).toLocaleString('pt-BR')}`);
  console.log(`  Por: ${data.created_by || 'admin'}\n`);
  
  if (contentType === 'json' && data.content) {
    console.log('Conteúdo JSON (primeiros 500 caracteres):');
    console.log(JSON.stringify(data.content, null, 2).substring(0, 500));
    console.log('...\n');
  } else if (contentType === 'css' && data.css) {
    console.log('CSS (primeiros 500 caracteres):');
    console.log(data.css.substring(0, 500));
    console.log('...\n');
  }
}

async function exportVersion(pageId, contentType, versionId, outputPath) {
  console.log(`\n💾 Exportando versão ${versionId} para ${outputPath}...\n`);
  
  const { data, error } = await supabase
    .from('page_history')
    .select('*')
    .eq('page_id', pageId.toLowerCase())
    .eq('content_type', contentType)
    .eq('id', versionId)
    .single();
  
  if (error) {
    console.error('❌ Erro:', error.message);
    return;
  }
  
  const exportData = {
    metadata: {
      id: data.id,
      page_id: data.page_id,
      content_type: data.content_type,
      saved_at: data.saved_at,
      created_by: data.created_by || 'admin',
      exported_at: new Date().toISOString()
    },
    content: contentType === 'json' ? data.content : null,
    css: contentType === 'css' ? data.css : null
  };
  
  writeFileSync(outputPath, JSON.stringify(exportData, null, 2));
  console.log('✅ Versão exportada com sucesso!\n');
}

function showHelp() {
  console.log(`
📚 Gerenciador de Histórico de Páginas

USO:
  node scripts/list-history.js [comando] [argumentos]

COMANDOS:

  list [pageId] [contentType]
    Lista versões de uma página específica
    Exemplos:
      node scripts/list-history.js list index json
      node scripts/list-history.js list quem-somos css

  all
    Lista versões de todas as páginas

  view [pageId] [contentType] [versionId]
    Visualiza uma versão específica
    Exemplo:
      node scripts/list-history.js view index json 123

  export [pageId] [contentType] [versionId] [arquivo]
    Exporta uma versão para arquivo JSON
    Exemplo:
      node scripts/list-history.js export index json 123 backup-index.json

  help
    Mostra esta ajuda

PÁGINAS DISPONÍVEIS:
  ${PAGES.join(', ')}

TIPOS DE CONTEÚDO:
  json - Conteúdo das páginas (textos, imagens, etc)
  css  - Estilos CSS das páginas

NOTAS:
  • O sistema mantém automaticamente as últimas 5 versões de cada página
  • Versões antigas são apagadas automaticamente ao salvar novas
  • Use o script restore-supabase.js para restaurar backups completos
`);
}

// Executar comando
async function main() {
  try {
    if (!command || command === 'help' || command === '--help' || command === '-h') {
      showHelp();
      return;
    }

    switch (command) {
      case 'list':
        if (!args[1]) {
          console.error('❌ Erro: pageId é obrigatório');
          console.log('Uso: node scripts/list-history.js list [pageId] [contentType]');
          process.exit(1);
        }
        await listHistory(args[1], args[2] || 'json');
        break;

      case 'all':
        await listAllPages();
        break;

      case 'view':
        if (!args[1] || !args[2] || !args[3]) {
          console.error('❌ Erro: pageId, contentType e versionId são obrigatórios');
          console.log('Uso: node scripts/list-history.js view [pageId] [contentType] [versionId]');
          process.exit(1);
        }
        await viewVersion(args[1], args[2], args[3]);
        break;

      case 'export':
        if (!args[1] || !args[2] || !args[3] || !args[4]) {
          console.error('❌ Erro: pageId, contentType, versionId e arquivo são obrigatórios');
          console.log('Uso: node scripts/list-history.js export [pageId] [contentType] [versionId] [arquivo]');
          process.exit(1);
        }
        await exportVersion(args[1], args[2], args[3], args[4]);
        break;

      default:
        console.error(`❌ Comando desconhecido: ${command}`);
        showHelp();
        process.exit(1);
    }
  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  }
}

main();
