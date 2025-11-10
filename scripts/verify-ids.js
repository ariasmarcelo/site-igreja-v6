#!/usr/bin/env node

/**
 * Script de Verificação de IDs Únicos
 * 
 * Verifica se todos os elementos que usam texts.xxx têm data-json-key correspondente
 * 
 * Uso: node scripts/verify-ids.js [--page=NomeDaPagina]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PAGES_DIR = path.join(__dirname, '..', 'src', 'pages');
const PAGE_FILTER = process.argv.find(arg => arg.startsWith('--page='))?.split('=')[1];

console.log('🔍 Verificação de data-json-key em elementos editáveis\n');

// Pegar todas as páginas .tsx
const pages = fs.readdirSync(PAGES_DIR)
  .filter(f => f.endsWith('.tsx'))
  .filter(f => !PAGE_FILTER || f === `${PAGE_FILTER}.tsx`);

let totalIssues = 0;
let totalPages = 0;

pages.forEach(pageFile => {
  const pagePath = path.join(PAGES_DIR, pageFile);
  const content = fs.readFileSync(pagePath, 'utf-8');
  
  // Encontrar todos os usos de texts.xxx ou texts?.xxx
  const textsRegex = /\{texts(\?)?\.[\w.[\]]+\}/g;
  const textsMatches = [...content.matchAll(textsRegex)];
  
  if (textsMatches.length === 0) return;
  
  totalPages++;
  console.log(`📄 ${pageFile}`);
  console.log(`   Encontrados: ${textsMatches.length} usos de texts.xxx`);
  
  let pageIssues = 0;
  
  textsMatches.forEach((match, idx) => {
    const textUsage = match[0]; // Ex: {texts.header.title}
    const lineNumber = content.substring(0, match.index).split('\n').length;
    
    // Encontrar o elemento JSX que contém esse texto
    // Procurar para trás até encontrar um < que abre uma tag
    let startPos = match.index;
    let openTagPos = -1;
    let depth = 0;
    
    for (let i = startPos; i >= 0; i--) {
      if (content[i] === '>') depth++;
      if (content[i] === '<') {
        depth--;
        if (depth < 0) {
          openTagPos = i;
          break;
        }
      }
    }
    
    if (openTagPos === -1) return;
    
    // Procurar para frente até encontrar o fim da tag de abertura
    let closeTagPos = content.indexOf('>', openTagPos);
    if (closeTagPos === -1) return;
    
    // Extrair a tag completa
    const tagContent = content.substring(openTagPos, closeTagPos + 1);
    
    // Verificar se tem data-json-key
    const hasDataJsonKey = /data-json-key=/.test(tagContent);
    
    if (!hasDataJsonKey) {
      pageIssues++;
      totalIssues++;
      console.log(`   ⚠️  Linha ${lineNumber}: ${textUsage}`);
      console.log(`       Tag: ${tagContent.substring(0, 100)}${tagContent.length > 100 ? '...' : ''}`);
    }
  });
  
  if (pageIssues === 0) {
    console.log(`   ✅ Todos os elementos têm data-json-key\n`);
  } else {
    console.log(`   ❌ ${pageIssues} elementos sem data-json-key\n`);
  }
});

console.log('═'.repeat(80));
console.log(`\n📊 RESUMO:`);
console.log(`   Páginas verificadas: ${totalPages}`);
console.log(`   Problemas encontrados: ${totalIssues}`);

if (totalIssues === 0) {
  console.log(`\n✅ Todas as páginas estão corretamente mapeadas!`);
  process.exit(0);
} else {
  console.log(`\n⚠️  Execute: node scripts/assign-ids-final.js`);
  console.log(`   para corrigir automaticamente os problemas.\n`);
  process.exit(1);
}
