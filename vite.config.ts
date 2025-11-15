import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";
import { pathToFileURL } from "url";

// Load environment variables from .env.local
const env = loadEnv('development', process.cwd(), '');
Object.assign(process.env, env);

// Plugin to handle API routes in dev mode
const apiPlugin = () => ({
  name: 'api-dev-server',
  configureServer(server: any) {
    // Use pre middleware hook to run BEFORE everything else
    server.middlewares.use((req: any, res: any, next: any) => {
      if (!req.url?.startsWith('/api/')) {
        return next();
      }

      console.log('[API-DEV] 🔍 Intercepted:', req.url);
      const urlParts = req.url.split('?');
      
      // Check for index.js first, then .js directly
      let apiPath = path.join(__dirname, urlParts[0], 'index.js');
      if (!fs.existsSync(apiPath)) {
        apiPath = path.join(__dirname, urlParts[0] + '.js');
      }
      
      console.log('[API-DEV] 📂 Looking for:', apiPath);
      
      if (!fs.existsSync(apiPath)) {
        console.log('[API-DEV] ⚠️ File not found');
        return next();
      }

      // Parse query string
      const query: Record<string, string> = {};
      if (urlParts[1]) {
        const params = new URLSearchParams(urlParts[1]);
        params.forEach((value, key) => {
          query[key] = value;
        });
      }

      // Parse POST body if present
      const handleRequest = (body?: any) => {
        // Adapt Vite request to Vercel serverless format
        const vercelReq = {
          ...req,
          query,
          body,
          method: req.method,
          url: req.url
        };

        const vercelRes = {
          statusCode: 200,
          setHeader: (key: string, value: string) => res.setHeader(key, value),
          status: (code: number) => {
            vercelRes.statusCode = code;
            return vercelRes;
          },
          json: (data: any) => {
            res.statusCode = vercelRes.statusCode;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data));
          },
          end: (data?: string) => {
            res.statusCode = vercelRes.statusCode;
            res.end(data);
          }
        };
        
        // Load and execute the API handler
        console.log('[API-DEV] ⚡ Executing handler');
        
        // Convert Windows path to file:// URL for dynamic import
        const fileUrl = pathToFileURL(apiPath).href;
        const timestamp = Date.now();
        
        import(`${fileUrl}?t=${timestamp}`).then((module: any) => {
          const apiHandler = module.default || module;
          return apiHandler(vercelReq, vercelRes);
        }).catch((error: any) => {
          console.error('[API-DEV] ❌ Error:', error.message);
          console.error(error.stack);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: error.message, stack: error.stack }));
        });
      };

      // Handle POST/PUT body parsing
      if (req.method === 'POST' || req.method === 'PUT') {
        let body = '';
        req.on('data', (chunk: any) => { body += chunk.toString(); });
        req.on('end', () => {
          try {
            const parsedBody = body ? JSON.parse(body) : {};
            handleRequest(parsedBody);
          } catch (e) {
            handleRequest({});
          }
        });
      } else {
        handleRequest();
      }
    });
  }
});

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react(), apiPlugin()],
  publicDir: 'public',
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
    fs: {
      // Deny serving files from api/ directory
      deny: ['**/api/**']
    },
    watch: {
      // Ignorar arquivos de fonte para evitar HMR desnecessário
      ignored: ['**/public/fonts/**', '**/.cache/**', '**/api/**'],
    },
  },
  build: {
    // Otimizações de build
    rollupOptions: {
      output: {
        manualChunks: {
          // Separar vendor chunks para melhor caching
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-label',
            '@radix-ui/react-select',
            '@radix-ui/react-slot',
            '@radix-ui/react-tabs',
            '@radix-ui/react-tooltip',
          ],
          'editor-vendor': [
            '@tiptap/react',
            '@tiptap/starter-kit',
            '@tiptap/extension-color',
            '@tiptap/extension-highlight',
            '@tiptap/extension-image',
            '@tiptap/extension-link',
            '@tiptap/extension-text-align',
            '@tiptap/extension-text-style',
            '@tiptap/extension-underline',
          ],
          'supabase': ['@supabase/supabase-js'],
        },
      },
    },
    chunkSizeWarningLimit: 600,
    sourcemap: false, // Desabilitar sourcemaps em produção para reduzir tamanho
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
  css: {
    devSourcemap: false,
  },
});
