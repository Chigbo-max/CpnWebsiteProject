import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  // server: {
    // proxy: {
    //   '/api': 'https://cpn-backend-dev.onrender.com',
    // },
    // host: true,
    // strictPort: true,
    // port: 5173,
    // hmr: {
    //   clientPort: 5173,
    // }


  // }

});

