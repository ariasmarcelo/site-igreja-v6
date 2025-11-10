import { createServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let server;
let isShuttingDown = false;

async function startViteServer() {
  try {
    console.log('🚀 Starting Vite Dev Server...\n');

    server = await createServer({
      configFile: path.resolve(__dirname, '../vite.config.ts'),
      root: path.resolve(__dirname, '..'),
      server: {
        port: 8080,
        strictPort: false, // Tentar outras portas se 8080 estiver ocupada
        host: true,
        open: false,
      },
      logLevel: 'info',
    });

    await server.listen();

    const info = server.config.logger.info;
    info(`\n  ✅ Vite Dev Server running at:\n`);
    server.printUrls();
    console.log();

  } catch (error) {
    console.error('❌ Failed to start Vite server:', error);
    
    if (error.code === 'EADDRINUSE') {
      console.error('\n⚠️  Port is already in use. Trying alternative port...');
      // Vite will try another port automatically with strictPort: false
    } else {
      console.error('\n⚠️  Fatal error, exiting...');
      process.exit(1);
    }
  }
}

// Graceful shutdown handler
async function gracefulShutdown(signal) {
  if (isShuttingDown) return;
  
  isShuttingDown = true;
  console.log(`\n\n🛑 Received ${signal}, shutting down gracefully...`);

  if (server) {
    try {
      await server.close();
      console.log('✅ Vite server closed successfully');
    } catch (error) {
      console.error('⚠️  Error closing server:', error);
    }
  }

  process.exit(0);
}

// Exception handlers
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('uncaughtException', (error) => {
  console.error('\n💥 UNCAUGHT EXCEPTION:', error);
  console.error('Stack:', error.stack);
  
  if (!isShuttingDown) {
    console.log('\n🔄 Attempting to restart server...');
    setTimeout(() => {
      startViteServer().catch(err => {
        console.error('Failed to restart:', err);
        process.exit(1);
      });
    }, 1000);
  }
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('\n💥 UNHANDLED REJECTION at:', promise);
  console.error('Reason:', reason);
  
  // Log but don't crash for unhandled rejections
  console.log('⚠️  Continuing execution...');
});

process.on('warning', (warning) => {
  console.warn('⚠️  Warning:', warning.name);
  console.warn('Message:', warning.message);
  console.warn('Stack:', warning.stack);
});

// Start server
startViteServer();
