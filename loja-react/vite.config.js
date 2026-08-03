import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Porta 5174 para não conflitar com o site principal (5173).
export default defineConfig({
  plugins: [react()],
  server: { port: 5174 },
  preview: { port: 5174 },
});
