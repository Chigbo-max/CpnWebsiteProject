import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'https://cpnwebsiteproject-production.up.railway.app',
    },
    host: true,
    strictPort: true,
    port: 5173,
    hmr: {
      clientPort: 5173,
    }
  }

})

