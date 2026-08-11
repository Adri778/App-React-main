import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// host: true faz o servidor escutar em todos os IPs da máquina — sem isso o
// celular não consegue abrir.
// O proxy manda /api para o back-end: assim a loja usa caminho relativo e
// funciona igual no PC e no celular, sem depender do IP e sem precisar
// liberar a porta 3000 no firewall (só a 5174 fica exposta).
const proxy = { '/api': { target: 'http://localhost:3000', changeOrigin: true } };

export default defineConfig({
  plugins: [react()],
  server: { port: 5174, host: true, proxy },
  preview: { port: 5174, host: true, proxy },
});
