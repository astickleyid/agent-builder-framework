import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/rpc': 'http://localhost:8300',
      '/agents': 'http://localhost:8300',
      '/retrieve': 'http://localhost:8200',
      '/ingest': 'http://localhost:8200',
      '/streams': 'http://localhost:8100',
      '/v1': 'http://localhost:8000',
    },
  },
});
