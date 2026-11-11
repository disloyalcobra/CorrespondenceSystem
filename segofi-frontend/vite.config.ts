import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // Vercel sirve la app desde la raíz (y define VERCEL=1 al compilar);
  // GitHub Pages la sirve bajo /CorrespondenceSystem/.
  base: process.env.VERCEL ? '/' : '/CorrespondenceSystem/',
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      }
    }
  }
})
