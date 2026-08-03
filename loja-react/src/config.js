// =============================================================================
// CONFIGURAÇÃO — ponto único para apontar a loja ao back-end.
// =============================================================================

// Base da API (sem o recurso). Ex.: .../api  ->  .../api/produtos, .../api/pedidos
export const API_BASE = 'http://192.168.1.6:3000/api';

// Endpoint de produtos.
export const API_URL = `${API_BASE}/produtos`;

// Quantidade exibida em cada vitrine.
export const LIMITES = { ofertas: 8, vendidos: 4, relacionados: 4 };
