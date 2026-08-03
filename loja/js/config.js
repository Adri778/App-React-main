// =============================================================================
// CONFIGURAÇÃO
// Ponto único para apontar a loja ao seu backend.
// A API deve responder um ARRAY JSON de produtos em GET nesta URL.
// Ajuste o IP/porta conforme o seu ambiente:
//   - Mesma máquina .............. http://localhost:3000/api/produtos
//   - Rede local (celular/outra) . http://192.168.1.6:3000/api/produtos
// =============================================================================

export const API_URL = 'http://192.168.1.6:3000/api/produtos';

// Quantos produtos mostrar em cada vitrine.
export const LIMITES = {
  ofertas: 8,
  vendidos: 4,
};
