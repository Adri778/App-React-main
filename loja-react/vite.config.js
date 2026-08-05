import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Porta 5174 para não conflitar com o site principal (5173).
// host: true faz o servidor escutar em todos os IPs da máquina — sem isso ele
// só aceita conexões de localhost e o celular não consegue abrir.
export default defineConfig({
  plugins: [react()],
  server: { port: 5174, host: true },
  preview: { port: 5174, host: true },
});
