/**
 * 🔄 Script de Restauração do Supabase
 * 
 * Restaura dados de um backup específico para o Supabase.
 * 
 * Uso:
 *   node scripts/restore-supabase.js --backup=2025-11-10T10-30-00
 *   node scripts/restore-supabase.js --backup=2025-11-10T10-30-00 --table=page_texts
 *   node scripts/restore-supabase.js --latest
 *   node scripts/restore-supabase.js --latest --dry-run
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carregar .env.local
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente Supabase não configuradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Argumentos
const BACKUP_NAME = process.argv.find(arg => arg.startsWith('--backup='))?.split('=')[1];
const USE_LATEST = process.argv.includes('--latest');
const TABLE_FILTER = process.argv.find(arg => arg.startsWith('--table='))?.split('=')[1];
const DRY_RUN = process.argv.includes('--dry-run');
const FORCE = process.argv.includes('--force');

const BACKUP_DIR = path.join(__dirname, '../backups/supabase');

/**
 * Pergunta ao usuário
 */
function askQuestion(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  return new Promise(resolve => {
    rl.question(question, answer => {
      rl.close();
      resolve(answer.toLowerCase());
    });
  });
}

/**
 * Lista backups disponíveis
 */
function listBackups() {
  if (!fs.existsSync(BACKUP_DIR)) {
    return [];
  }
  
  return fs.readdirSync(BACKUP_DIR)
    .filter(name => name !== '.gitkeep')
    .map(name => ({
      name,
      path: path.join(BACKUP_DIR, name),
      time: fs.statSync(path.join(BACKUP_DIR, name)).mtime.getTime()
    }))
    .sort((a, b) => b.time - a.time);
}

/**
 * Seleciona backup a restaurar
 */
function selectBackup() {
  const backups = listBackups();
  
  if (backups.length === 0) {
    console.error('❌ Nenhum backup encontrado');
    process.exit(1);
  }
  
  if (USE_LATEST) {
    return backups[0].path;
  }
  
  if (BACKUP_NAME) {
    const backup = backups.find(b => b.name === BACKUP_NAME);
    if (!backup) {
      console.error(`❌ Backup não encontrado: ${BACKUP_NAME}`);
      console.log('\n📋 Backups disponíveis:');
      backups.forEach(b => console.log(`   - ${b.name}`));
      process.exit(1);
    }
    return backup.path;
  }
  
  console.error('❌ Especifique um backup com --backup=NOME ou use --latest');
  console.log('\n📋 Backups disponíveis:');
  backups.forEach(b => console.log(`   - ${b.name}`));
  process.exit(1);
}

/**
 * Carrega metadados do backup
 */
function loadMetadata(backupPath) {
  const metadataPath = path.join(backupPath, '_metadata.json');
  
  if (!fs.existsSync(metadataPath)) {
    console.error('❌ Arquivo de metadados não encontrado');
    process.exit(1);
  }
  
  return JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
}

/**
 * Restaura uma tabela
 */
async function restoreTable(backupPath, tableName) {
  const filePath = path.join(backupPath, `${tableName}.json`);
  
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Arquivo não encontrado: ${tableName}.json`);
    return { success: false, tableName, error: 'Arquivo não encontrado' };
  }
  
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    console.log(`📥 Restaurando ${tableName}: ${data.length} registro(s)...`);
    
    if (DRY_RUN) {
      console.log(`   [DRY-RUN] Seria restaurado: ${data.length} registros`);
      return { success: true, tableName, records: data.length, dryRun: true };
    }
    
    // Deletar dados existentes
    console.log(`   🗑️ Limpando dados existentes...`);
    const { error: deleteError } = await supabase
      .from(tableName)
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all
    
    if (deleteError) {
      console.error(`   ❌ Erro ao limpar ${tableName}:`, deleteError.message);
      return { success: false, tableName, error: deleteError.message };
    }
    
    // Inserir novos dados (em lotes de 100)
    const BATCH_SIZE = 100;
    let inserted = 0;
    
    for (let i = 0; i < data.length; i += BATCH_SIZE) {
      const batch = data.slice(i, i + BATCH_SIZE);
      
      const { error: insertError } = await supabase
        .from(tableName)
        .insert(batch);
      
      if (insertError) {
        console.error(`   ❌ Erro ao inserir lote ${i}-${i + batch.length}:`, insertError.message);
        return { 
          success: false, 
          tableName, 
          error: insertError.message,
          partialRecords: inserted
        };
      }
      
      inserted += batch.length;
      console.log(`   ✅ ${inserted}/${data.length} registros inseridos...`);
    }
    
    console.log(`✅ ${tableName}: ${inserted} registros restaurados`);
    
    return { success: true, tableName, records: inserted };
    
  } catch (error) {
    console.error(`❌ Erro ao processar ${tableName}:`, error.message);
    return { success: false, tableName, error: error.message };
  }
}

/**
 * Exibe resumo
 */
function printSummary(metadata, results) {
  console.log('\n' + '='.repeat(60));
  console.log('📊 RESUMO DA RESTAURAÇÃO');
  console.log('='.repeat(60));
  console.log(`📅 Backup de: ${new Date(metadata.timestamp).toLocaleString('pt-BR')}`);
  console.log(`📋 Tabelas: ${results.filter(r => r.success).length}/${results.length}`);
  
  if (DRY_RUN) {
    console.log(`\n⚠️ DRY-RUN: Nenhuma alteração foi feita`);
  }
  
  results.forEach(r => {
    if (r.success) {
      const mode = r.dryRun ? '[DRY-RUN]' : '';
      console.log(`   ✅ ${r.tableName}: ${r.records} registros ${mode}`);
    } else {
      console.log(`   ❌ ${r.tableName}: ${r.error}`);
      if (r.partialRecords) {
        console.log(`      (${r.partialRecords} registros foram inseridos antes do erro)`);
      }
    }
  });
  
  console.log('='.repeat(60) + '\n');
}

/**
 * Função principal
 */
async function main() {
  console.log('🔄 Iniciando restauração do Supabase...\n');
  
  // Selecionar backup
  const backupPath = selectBackup();
  const backupName = path.basename(backupPath);
  
  console.log(`📂 Backup selecionado: ${backupName}\n`);
  
  // Carregar metadados
  const metadata = loadMetadata(backupPath);
  
  console.log(`📅 Data do backup: ${new Date(metadata.timestamp).toLocaleString('pt-BR')}`);
  console.log(`📋 Tabelas disponíveis: ${metadata.tables.map(t => t.name).join(', ')}\n`);
  
  // Filtrar tabelas
  const tablesToRestore = TABLE_FILTER
    ? metadata.tables.filter(t => t.name === TABLE_FILTER)
    : metadata.tables;
  
  if (tablesToRestore.length === 0) {
    console.error(`❌ Tabela não encontrada: ${TABLE_FILTER}`);
    process.exit(1);
  }
  
  // Confirmação (se não for --force)
  if (!FORCE && !DRY_RUN) {
    console.log('⚠️  ATENÇÃO: Esta operação irá SUBSTITUIR todos os dados atuais!');
    console.log(`📋 Tabelas a restaurar: ${tablesToRestore.map(t => t.name).join(', ')}\n`);
    
    const answer = await askQuestion('Confirma a restauração? (sim/não): ');
    
    if (answer !== 'sim' && answer !== 's') {
      console.log('❌ Operação cancelada pelo usuário');
      process.exit(0);
    }
    console.log('');
  }
  
  if (DRY_RUN) {
    console.log('ℹ️  Modo DRY-RUN: Nenhuma alteração será feita\n');
  }
  
  // Restaurar tabelas
  const results = [];
  for (const table of tablesToRestore) {
    const result = await restoreTable(backupPath, table.name);
    results.push(result);
  }
  
  // Resumo
  printSummary(metadata, results);
  
  const exitCode = results.some(r => !r.success) ? 1 : 0;
  process.exit(exitCode);
}

// Executar
main().catch(error => {
  console.error('❌ Erro fatal:', error);
  process.exit(1);
});
