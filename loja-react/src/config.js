// =============================================================================
// CONFIGURAÇÃO — ponto único para apontar a loja ao back-end.
// =============================================================================

// Base da API. O padrão é o caminho relativo /api, que o Vite redireciona
// para o back-end (ver o proxy em vite.config.js). Funciona igual no PC e no
// celular, sem depender do IP da máquina.
// Em produção, onde não há Vite, aponte para a URL real criando um .env:
//   VITE_API_URL=https://api.seudominio.com/api
export const API_BASE = import.meta.env.VITE_API_URL || '/api';

// Endpoint de produtos.
export const API_URL = `${API_BASE}/produtos`;

// Quantidade exibida em cada vitrine.
export const LIMITES = { ofertas: 8, vendidos: 4, relacionados: 4 };

// Quantos resultados a página de busca mostra por vez ("carregar mais").
export const POR_PAGINA = 12;

// Tempo máximo (ms) esperando a API antes de desistir e cair na demonstração.
export const TIMEOUT_API = 8000;
