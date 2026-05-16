import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const frontendPort = Number(env.VITE_FRONTEND_PORT || 3000);
  const backendTarget = env.VITE_BACKEND_TARGET || 'http://localhost:8080';

  return {
    plugins: [react()],
    server: {
      port: frontendPort,
      proxy: {
        '/api': {
          target: backendTarget,
          changeOrigin: true,
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              proxyReq.setHeader('Origin', backendTarget);
            });
          }
        },
        '/uploads': {
          target: backendTarget,
          changeOrigin: true,
        }
      }
    }
  };
});