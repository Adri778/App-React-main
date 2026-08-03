// =============================================================================
// MODEL · Serviço de produtos — acesso à API (com fallback para demonstração).
// =============================================================================

import { API_URL } from '../config.js';
import { DADOS_DEMO } from './dadosDemo.js';
import { normalizar } from './calculos.js';

// Lista todos os produtos. Devolve { produtos, usandoDemo }.
export async function listarProdutos() {
  try {
    const resp = await fetch(API_URL, { cache: 'no-store' });
    if (!resp.ok) throw new Error('HTTP ' + resp.status);
    const dados = await resp.json();
    if (!Array.isArray(dados)) throw new Error('resposta não é uma lista');
    return { produtos: dados.map(normalizar), usandoDemo: false };
  } catch (erro) {
    console.warn('[Achadinhos] API indisponível, usando demonstração:', erro.message);
    return { produtos: DADOS_DEMO.map(normalizar), usandoDemo: true };
  }
}

// Busca um produto pelo id (e devolve a lista completa para os relacionados).
export async function buscarProduto(id) {
  const { produtos, usandoDemo } = await listarProdutos();
  const produto = produtos.find((p) => String(p.id) === String(id)) || null;
  return { produto, produtos, usandoDemo };
}
