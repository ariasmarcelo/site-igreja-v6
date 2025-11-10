// scripts/start-frontend.js
// Script robusto para iniciar servidor frontend (Vite)

import { spawn } from 'child_process';
import { existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import net from 'net';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, '..');

// Configurações
const PORT = 8080;
const HOST = 'localhost';
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 segundos

// Cores para output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m'
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

async function findVite() {
  const vitePaths = [
    resolve(projectRoot, 'node_modules/.bin/vite'),
    resolve(projectRoot, 'node_modules/.bin/vite.cmd'),
    resolve(projectRoot, 'node_modules/vite/bin/vite.js')
  ];
  
  for (const vitePath of vitePaths) {
    if (existsSync(vitePath)) {
      log(`✓ Vite encontrado: ${vitePath}`, colors.green);
      return vitePath;
    }
  }
  
  throw new Error('Vite não encontrado. Execute: pnpm install');
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

async function startVite(vitePath, retryCount = 0) {
  try {
    log(`\n${'='.repeat(50)}`, colors.cyan);
    log(`🚀 Iniciando Frontend Server (Vite)`, colors.bright);
    log(`${'='.repeat(50)}`, colors.cyan);
    log(`📍 Porta: ${PORT}`);
    log(`📂 Diretório: ${projectRoot}`);
    log(`🔄 Tentativa: ${retryCount + 1}/${MAX_RETRIES}\n`, colors.cyan);
    
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
    
    // Iniciar Vite
    const isWindows = process.platform === 'win32';
    const viteProcess = spawn(
      'node',
      [vitePath],
      {
        cwd: projectRoot,
        stdio: 'inherit',
        env: {
          ...process.env,
          FORCE_COLOR: '1',
          NODE_ENV: 'development'
        }
      }
    );
    
    viteProcess.on('error', (err) => {
      log(`\n❌ Erro ao iniciar Vite: ${err.message}`, colors.red);
      
      if (retryCount < MAX_RETRIES - 1) {
        log(`\n🔄 Tentando novamente em ${RETRY_DELAY / 1000}s...`, colors.yellow);
        setTimeout(() => {
          startVite(vitePath, retryCount + 1);
        }, RETRY_DELAY);
      } else {
        log(`\n❌ Falha após ${MAX_RETRIES} tentativas`, colors.red);
        process.exit(1);
      }
    });
    
    viteProcess.on('exit', (code) => {
      if (code !== 0 && code !== null) {
        log(`\n⚠ Vite encerrado com código ${code}`, colors.yellow);
        
        if (retryCount < MAX_RETRIES - 1) {
          log(`🔄 Reiniciando em ${RETRY_DELAY / 1000}s...`, colors.yellow);
          setTimeout(() => {
            startVite(vitePath, retryCount + 1);
          }, RETRY_DELAY);
        }
      }
    });
    
    // Graceful shutdown
    process.on('SIGINT', () => {
      log(`\n\n⚠ SIGINT recebido. Encerrando servidor...`, colors.yellow);
      viteProcess.kill('SIGINT');
      setTimeout(() => {
        process.exit(0);
      }, 1000);
    });
    
    process.on('SIGTERM', () => {
      log(`\n\n⚠ SIGTERM recebido. Encerrando servidor...`, colors.yellow);
      viteProcess.kill('SIGTERM');
      setTimeout(() => {
        process.exit(0);
      }, 1000);
    });
    
  } catch (error) {
    log(`\n❌ Erro: ${error.message}`, colors.red);
    
    if (retryCount < MAX_RETRIES - 1) {
      log(`🔄 Tentando novamente em ${RETRY_DELAY / 1000}s...`, colors.yellow);
      setTimeout(() => {
        startVite(vitePath, retryCount + 1);
      }, RETRY_DELAY);
    } else {
      log(`\n❌ Falha após ${MAX_RETRIES} tentativas`, colors.red);
      log(`\n💡 Soluções:`, colors.cyan);
      log(`  1. Verificar se node_modules está instalado: pnpm install`);
      log(`  2. Verificar se porta ${PORT} está livre: netstat -ano | findstr :${PORT}`);
      log(`  3. Matar processo manualmente: taskkill /PID [número] /F`);
      log(`  4. Reiniciar terminal\n`);
      process.exit(1);
    }
  }
}

// Main
(async () => {
  try {
    const vitePath = await findVite();
    await startVite(vitePath);
  } catch (error) {
    log(`\n❌ Erro fatal: ${error.message}`, colors.red);
    log(`\n💡 Execute: pnpm install\n`, colors.cyan);
    process.exit(1);
  }
})();
