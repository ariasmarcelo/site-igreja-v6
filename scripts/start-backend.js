// scripts/start-backend.js
// Script robusto para iniciar servidor backend (Express)

import { spawn } from 'child_process';
import { existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import net from 'net';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, '..');

// Configurações
const PORT = 3001;
const HOST = 'localhost';
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 segundos
const SERVER_PATH = resolve(projectRoot, 'server/express-server.js');

// Cores para output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function checkPortAvailable(port, host) {
  return new Promise((resolve) => {
    const server = net.createServer();
    
    server.once('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        resolve(false); // Porta em uso
      } else {
        resolve(true); // Outro erro, assumir disponível
      }
    });
    
    server.once('listening', () => {
      server.close();
      resolve(true); // Porta disponível
    });
    
    server.listen(port, host);
  });
}

async function checkEnvFile() {
  const envPath = resolve(projectRoot, '.env.local');
  
  if (!existsSync(envPath)) {
    log(`\n⚠ AVISO: Arquivo .env.local não encontrado`, colors.yellow);
    log(`📝 Criando .env.local a partir de .env.example...`, colors.cyan);
    
    const envExamplePath = resolve(projectRoot, '.env.example');
    if (existsSync(envExamplePath)) {
      const { copyFileSync } = await import('fs');
      copyFileSync(envExamplePath, envPath);
      log(`✓ Arquivo .env.local criado`, colors.green);
      log(`⚠ IMPORTANTE: Configure as variáveis de ambiente no .env.local`, colors.yellow);
      log(`   Especialmente: VITE_SUPABASE_URL e SUPABASE_SERVICE_KEY\n`, colors.yellow);
    } else {
      log(`❌ .env.example também não encontrado`, colors.red);
      log(`💡 Crie manualmente o .env.local com as variáveis necessárias\n`, colors.cyan);
    }
  } else {
    log(`✓ Arquivo .env.local encontrado`, colors.green);
  }
}

async function killProcessOnPort(port) {
  return new Promise((resolve) => {
    const isWindows = process.platform === 'win32';
    
    if (isWindows) {
      const findProcess = spawn('cmd', ['/c', `netstat -ano | findstr :${port}`]);
      let output = '';
      
      findProcess.stdout.on('data', (data) => {
        output += data.toString();
      });
      
      findProcess.on('close', (code) => {
        if (code === 0 && output) {
          const lines = output.split('\n');
          const pids = new Set();
          
          lines.forEach(line => {
            const match = line.match(/LISTENING\s+(\d+)/);
            if (match) {
              pids.add(match[1]);
            }
          });
          
          if (pids.size > 0) {
            log(`⚠ Matando processos na porta ${port}: ${Array.from(pids).join(', ')}`, colors.yellow);
            
            pids.forEach(pid => {
              spawn('taskkill', ['/PID', pid, '/F']);
            });
            
            setTimeout(resolve, 1000);
          } else {
            resolve();
          }
        } else {
          resolve();
        }
      });
    } else {
      // Unix/Linux/Mac
      const killProcess = spawn('lsof', ['-ti', `:${port}`]);
      let pids = '';
      
      killProcess.stdout.on('data', (data) => {
        pids += data.toString();
      });
      
      killProcess.on('close', (code) => {
        if (code === 0 && pids.trim()) {
          pids.trim().split('\n').forEach(pid => {
            spawn('kill', ['-9', pid]);
          });
          setTimeout(resolve, 1000);
        } else {
          resolve();
        }
      });
    }
  });
}

async function startBackend(retryCount = 0) {
  try {
    log(`\n${'='.repeat(50)}`, colors.magenta);
    log(`🚀 Iniciando Backend Server (Express)`, colors.bright);
    log(`${'='.repeat(50)}`, colors.magenta);
    log(`📍 Porta: ${PORT}`);
    log(`📂 Diretório: ${projectRoot}`);
    log(`📄 Servidor: ${SERVER_PATH}`);
    log(`🔄 Tentativa: ${retryCount + 1}/${MAX_RETRIES}\n`, colors.magenta);
    
    // Verificar se arquivo do servidor existe
    if (!existsSync(SERVER_PATH)) {
      throw new Error(`Arquivo do servidor não encontrado: ${SERVER_PATH}`);
    }
    log(`✓ Arquivo do servidor encontrado`, colors.green);
    
    // Verificar .env.local
    await checkEnvFile();
    
    // Verificar se porta está disponível
    const isAvailable = await checkPortAvailable(PORT, HOST);
    
    if (!isAvailable) {
      log(`⚠ Porta ${PORT} em uso`, colors.yellow);
      log(`🔧 Tentando liberar porta...`, colors.yellow);
      await killProcessOnPort(PORT);
      
      // Verificar novamente
      const stillInUse = !(await checkPortAvailable(PORT, HOST));
      if (stillInUse) {
        throw new Error(`Porta ${PORT} ainda está em uso após tentativa de liberação`);
      }
      
      log(`✓ Porta ${PORT} liberada com sucesso`, colors.green);
    }
    
    log(`\n${'─'.repeat(50)}`, colors.cyan);
    log(`📡 Iniciando servidor...\n`, colors.cyan);
    
    // Iniciar servidor Express
    const serverProcess = spawn('node', [SERVER_PATH], {
      cwd: projectRoot,
      stdio: 'inherit',
      env: {
        ...process.env,
        FORCE_COLOR: '1',
        NODE_ENV: 'development'
      }
    });
    
    serverProcess.on('error', (err) => {
      log(`\n❌ Erro ao iniciar servidor: ${err.message}`, colors.red);
      
      if (retryCount < MAX_RETRIES - 1) {
        log(`\n🔄 Tentando novamente em ${RETRY_DELAY / 1000}s...`, colors.yellow);
        setTimeout(() => {
          startBackend(retryCount + 1);
        }, RETRY_DELAY);
      } else {
        log(`\n❌ Falha após ${MAX_RETRIES} tentativas`, colors.red);
        process.exit(1);
      }
    });
    
    serverProcess.on('exit', (code) => {
      if (code !== 0 && code !== null) {
        log(`\n⚠ Servidor encerrado com código ${code}`, colors.yellow);
        
        if (retryCount < MAX_RETRIES - 1) {
          log(`🔄 Reiniciando em ${RETRY_DELAY / 1000}s...`, colors.yellow);
          setTimeout(() => {
            startBackend(retryCount + 1);
          }, RETRY_DELAY);
        }
      }
    });
    
    // Graceful shutdown
    process.on('SIGINT', () => {
      log(`\n\n⚠ SIGINT recebido. Encerrando servidor...`, colors.yellow);
      serverProcess.kill('SIGINT');
      setTimeout(() => {
        log(`✓ Servidor encerrado`, colors.green);
        process.exit(0);
      }, 1000);
    });
    
    process.on('SIGTERM', () => {
      log(`\n\n⚠ SIGTERM recebido. Encerrando servidor...`, colors.yellow);
      serverProcess.kill('SIGTERM');
      setTimeout(() => {
        log(`✓ Servidor encerrado`, colors.green);
        process.exit(0);
      }, 1000);
    });
    
    // Uncaught exception handler
    process.on('uncaughtException', (err) => {
      log(`\n❌ Exceção não capturada: ${err.message}`, colors.red);
      log(`Stack: ${err.stack}`, colors.red);
      
      if (retryCount < MAX_RETRIES - 1) {
        log(`🔄 Reiniciando em ${RETRY_DELAY / 1000}s...`, colors.yellow);
        serverProcess.kill();
        setTimeout(() => {
          startBackend(retryCount + 1);
        }, RETRY_DELAY);
      }
    });
    
    // Unhandled rejection handler
    process.on('unhandledRejection', (reason, promise) => {
      log(`\n❌ Promise rejeitada: ${reason}`, colors.red);
      
      if (retryCount < MAX_RETRIES - 1) {
        log(`🔄 Reiniciando em ${RETRY_DELAY / 1000}s...`, colors.yellow);
        serverProcess.kill();
        setTimeout(() => {
          startBackend(retryCount + 1);
        }, RETRY_DELAY);
      }
    });
    
  } catch (error) {
    log(`\n❌ Erro: ${error.message}`, colors.red);
    
    if (retryCount < MAX_RETRIES - 1) {
      log(`🔄 Tentando novamente em ${RETRY_DELAY / 1000}s...`, colors.yellow);
      setTimeout(() => {
        startBackend(retryCount + 1);
      }, RETRY_DELAY);
    } else {
      log(`\n❌ Falha após ${MAX_RETRIES} tentativas`, colors.red);
      log(`\n💡 Soluções:`, colors.cyan);
      log(`  1. Verificar se .env.local existe e está configurado`);
      log(`  2. Verificar se porta ${PORT} está livre: netstat -ano | findstr :${PORT}`);
      log(`  3. Verificar logs do servidor para erros específicos`);
      log(`  4. Matar processo manualmente: taskkill /PID [número] /F`);
      log(`  5. Verificar conexão com Supabase\n`);
      process.exit(1);
    }
  }
}

// Main
(async () => {
  try {
    await startBackend();
  } catch (error) {
    log(`\n❌ Erro fatal: ${error.message}`, colors.red);
    process.exit(1);
  }
})();
