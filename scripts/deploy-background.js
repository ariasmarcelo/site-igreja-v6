#!/usr/bin/env node

/**
 * Script de Deploy em Background
 * Executa build e push para GitHub Pages sem bloquear o terminal
 * 
 * Uso: node scripts/deploy-background.js "mensagem do commit"
 */

import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// ES modules não têm __dirname, então criamos
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Diretório raiz do projeto
const projectRoot = path.resolve(__dirname, '..');
const logDir = path.join(projectRoot, 'logs');

// Criar diretório de logs se não existir
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Timestamp para logs
const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
const logFile = path.join(logDir, `deploy-${timestamp}.log`);

// Mensagem de commit (padrão ou fornecida)
const commitMessage = process.argv[2] || `deploy: atualização automática ${new Date().toLocaleString('pt-BR')}`;

console.log('🚀 Iniciando deploy em background...');
console.log(`📝 Log: ${logFile}`);
console.log(`💬 Commit: "${commitMessage}"\n`);

// Criar stream de log
const logStream = fs.createWriteStream(logFile, { flags: 'a' });

function log(message) {
  const timeStamp = new Date().toLocaleTimeString('pt-BR');
  const logMessage = `[${timeStamp}] ${message}\n`;
  logStream.write(logMessage);
}

log('='.repeat(80));
log('INÍCIO DO DEPLOY');
log(`Commit Message: ${commitMessage}`);
log('='.repeat(80));

// Função para executar comando
function runCommand(command, args, stepName) {
  return new Promise((resolve, reject) => {
    log(`\n>>> ${stepName}`);
    log(`Comando: ${command} ${args.join(' ')}`);
    
    const proc = spawn(command, args, {
      cwd: projectRoot,
      shell: false,  // Desabilitado para evitar problemas com argumentos
      stdio: ['ignore', 'pipe', 'pipe']
    });

    proc.stdout.on('data', (data) => {
      log(data.toString());
    });

    proc.stderr.on('data', (data) => {
      log(`STDERR: ${data.toString()}`);
    });

    proc.on('close', (code) => {
      if (code === 0) {
        log(`✓ ${stepName} concluído com sucesso`);
        resolve();
      } else {
        log(`✗ ${stepName} falhou com código ${code}`);
        reject(new Error(`${stepName} falhou com código ${code}`));
      }
    });

    proc.on('error', (error) => {
      log(`ERRO: ${error.message}`);
      reject(error);
    });
  });
}

// Sequência de comandos
async function deploy() {
  try {
    // 1. Build
    await runCommand('pnpm', ['build'], 'PNPM BUILD');
    
    // 2. Git add
    await runCommand('git', ['add', '.'], 'GIT ADD');
    
    // 3. Git commit
    await runCommand('git', ['commit', '-m', commitMessage], 'GIT COMMIT');
    
    // 4. Git push
    await runCommand('git', ['push'], 'GIT PUSH');
    
    log('\n' + '='.repeat(80));
    log('✓ DEPLOY CONCLUÍDO COM SUCESSO');
    log('='.repeat(80));
    
    console.log('✅ Deploy concluído com sucesso!');
    console.log(`📄 Veja os detalhes em: ${logFile}`);
    
  } catch (error) {
    log('\n' + '='.repeat(80));
    log(`✗ DEPLOY FALHOU: ${error.message}`);
    log('='.repeat(80));
    
    console.error('❌ Deploy falhou!');
    console.error(`📄 Veja os detalhes em: ${logFile}`);
    process.exit(1);
  } finally {
    logStream.end();
  }
}

// Executar deploy
deploy();
