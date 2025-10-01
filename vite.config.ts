import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables based on mode
  const env = loadEnv(mode, process.cwd(), '');
  
  // Determine if we're in development or production
  const isDevelopment = mode === 'development' || mode === 'local';
  const isProduction = mode === 'production';
  
  console.log(`🔧 Vite Config - Mode: ${mode}, Development: ${isDevelopment}, Production: ${isProduction}`);
  
  return {
    server: {
      host: '0.0.0.0',
      proxy: {
        '/api': {
          target: isDevelopment 
            ? 'http://localhost:5050' 
            : 'https://debtai-fefaf5dtbgd8aqg6.canadacentral-01.azurewebsites.net',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
          secure: !isDevelopment,
          configure: (proxy, _options) => {
            proxy.on('error', (err, _req, _res) => {
              console.log('proxy error', err);
            });
            proxy.on('proxyReq', (proxyReq, req, _res) => {
              console.log('Sending Request to the Target:', req.method, req.url);
            });
            proxy.on('proxyRes', (proxyRes, req, _res) => {
              console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
            });
          },
        }
      }
    },
    plugins: [
      react(),
      (mode === 'development' || mode === 'local') &&
      componentTagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
