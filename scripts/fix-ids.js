#!/usr/bin/env node

/**
 * Script para corrigir data-json-keys em arquivos .tsx
 * 
 * Garante que todos os elementos editáveis tenham data-json-key
 * no formato correto: pageid.secao.subsecao[index].propriedade
 * 
 * Uso:
 *   node fix-ids.js          - Verifica sem alterar
 *   node fix-ids.js --check  - Verifica sem alterar
 *   node fix-ids.js --fix    - Corrige os arquivos
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FIX_MODE = process.argv.includes('--fix');
const PAGES_DIR = path.join(__dirname, '../src/pages');

// Mapeamento de arquivos para IDs de página
const PAGE_IDS = {
  'QuemSomos.tsx': 'quemsomos',
  'Purificacao.tsx': 'purificacao',
  'Missao.tsx': 'missao',
  'Home.tsx': 'home',
  'Artigos.tsx': 'artigos'
};

/**
 * Extrai todos os data-json-key de um arquivo
 */
function extractDataJsonKeys(content) {
  const regex = /data-json-key=\{`([^`]+)`\}|data-json-key=["']([^"']+)["']/g;
  const keys = [];
  let match;
  
  while ((match = regex.exec(content)) !== null) {
    keys.push(match[1] || match[2]);
  }
  
  return keys;
}

/**
 * Verifica se uma key está no formato correto
 */
function isValidKey(key, pageId) {
  // Keys dinâmicas com ${} são válidas
  if (key.includes('${')) {
    // Verifica se começa com o pageId correto
    const prefix = key.split('.')[0].replace(/[`${}]/g, '');
    return prefix === pageId;
  }
  
  // Keys estáticas devem começar com o pageId
  return key.startsWith(`${pageId}.`);
}

/**
 * Corrige uma key para o formato correto
 */
function fixKey(key, pageId) {
  // Se já está correta, retorna sem modificar
  if (isValidKey(key, pageId)) {
    return key;
  }
  
  // Se tem prefixo de outra página, substitui
  const parts = key.split('.');
  if (parts[0] !== pageId && !key.includes('${')) {
    parts[0] = pageId;
    return parts.join('.');
  }
  
  // Se não tem prefixo, adiciona
  if (!key.includes('.')) {
    return `${pageId}.${key}`;
  }
  
  return key;
}

/**
 * Processa um arquivo
 */
function processFile(filePath, pageId) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const keys = extractDataJsonKeys(content);
  
  if (keys.length === 0) {
    return { fixed: 0, invalid: 0, total: 0 };
  }
  
  let invalid = 0;
  let fixedContent = content;
  const fixes = [];
  
  keys.forEach(key => {
    if (!isValidKey(key, pageId)) {
      invalid++;
      const fixedKey = fixKey(key, pageId);
      fixes.push({ original: key, fixed: fixedKey });
      
      if (FIX_MODE) {
        // Substitui apenas a ocorrência exata com seus delimitadores
        const patterns = [
          new RegExp(`data-json-key=\\{\`${escapeRegex(key)}\`\\}`, 'g'),
          new RegExp(`data-json-key="${escapeRegex(key)}"`, 'g'),
          new RegExp(`data-json-key='${escapeRegex(key)}'`, 'g')
        ];
        
        patterns.forEach(pattern => {
          const replacement = key.includes('${') 
            ? `data-json-key={\`${fixedKey}\`}`
            : `data-json-key="${fixedKey}"`;
          fixedContent = fixedContent.replace(pattern, replacement);
        });
      }
    }
  });
  
  if (FIX_MODE && invalid > 0) {
    fs.writeFileSync(filePath, fixedContent, 'utf-8');
  }
  
  return { 
    fixed: invalid, 
    invalid, 
    total: keys.length,
    fixes
  };
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Processa todas as páginas
 */
function processAllPages() {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`🔧 ${FIX_MODE ? 'CORRIGINDO' : 'VERIFICANDO'} data-json-keys`);
  console.log(`${'='.repeat(60)}\n`);
  
  let totalFixed = 0;
  let totalInvalid = 0;
  let totalKeys = 0;
  
  Object.entries(PAGE_IDS).forEach(([filename, pageId]) => {
    const filePath = path.join(PAGES_DIR, filename);
    
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  ${filename}: Arquivo não encontrado`);
      return;
    }
    
    console.log(`\n📄 ${filename} (pageId: ${pageId})`);
    console.log('-'.repeat(60));
    
    const result = processFile(filePath, pageId);
    
    totalKeys += result.total;
    totalInvalid += result.invalid;
    totalFixed += result.fixed;
    
    if (result.total === 0) {
      console.log('   ℹ️  Nenhuma data-json-key encontrada');
    } else {
      console.log(`   ✓ Total de keys: ${result.total}`);
      
      if (result.invalid > 0) {
        console.log(`   ⚠️  Keys inválidas: ${result.invalid}`);
        
        if (!FIX_MODE) {
          console.log('\n   Correções sugeridas:');
          result.fixes.forEach(({ original, fixed }) => {
            console.log(`      ${original} → ${fixed}`);
          });
        } else {
          console.log(`   ✅ Corrigidas: ${result.fixed}`);
        }
      } else {
        console.log('   ✅ Todas as keys estão corretas');
      }
    }
  });
  
  console.log(`\n${'='.repeat(60)}`);
  console.log('📊 RESUMO');
  console.log(`${'='.repeat(60)}`);
  console.log(`Total de keys encontradas: ${totalKeys}`);
  console.log(`Keys inválidas: ${totalInvalid}`);
  
  if (FIX_MODE) {
    console.log(`Keys corrigidas: ${totalFixed}`);
    console.log('\n✅ Correções aplicadas com sucesso!');
  } else {
    if (totalInvalid > 0) {
      console.log('\n💡 Execute com --fix para aplicar as correções');
    } else {
      console.log('\n✅ Nenhuma correção necessária!');
    }
  }
  console.log(`${'='.repeat(60)}\n`);
}

// Executa
processAllPages();
