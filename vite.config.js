import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // Añadido para que las rutas de los assets sean relativas en GitHub Pages
  server: {
    port: 3000,
    open: false
  }
});
