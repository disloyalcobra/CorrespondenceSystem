import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // REEMPLAZA 'nombre-de-tu-repo' por el nombre exacto de tu repositorio en GitHub
  base: '/CorrespondenceSystem/',
  server: {
    port: 3000,
    open: false
  }
});
