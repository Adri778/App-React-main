// =============================================================================
// MODEL · Serviço de produtos — acesso à API (com fallback para demonstração).
// =============================================================================

import { API_URL, TIMEOUT_API } from '../config.js';
import { DADOS_DEMO } from './dadosDemo.js';
import { normalizar } from './calculos.js';

// Traduz a falha técnica em algo que dá para mostrar na tela.
function mensagemDeErro(erro) {
  if (erro.name === 'AbortError') return 'O servidor demorou demais para responder.';
  if (erro.message.startsWith('HTTP')) return `O servidor respondeu com erro (${erro.message}).`;
  return 'Não foi possível falar com o servidor.';
}

// Lista todos os produtos. Devolve { produtos, usandoDemo, erro }.
// `erro` é null quando a API respondeu; quando não, traz o motivo para a View
// poder avisar o cliente e oferecer "tentar de novo" em vez de falhar calada.
export async function listarProdutos() {
  // Sem timeout, uma API que aceita a conexão mas nunca responde deixa a loja
  // presa nos skeletons para sempre.
  const ctrl = new AbortController();
  const relogio = setTimeout(() => ctrl.abort(), TIMEOUT_API);

  try {
    const resp = await fetch(API_URL, { cache: 'no-store', signal: ctrl.signal });
    if (!resp.ok) throw new Error('HTTP ' + resp.status);
    const dados = await resp.json();
    if (!Array.isArray(dados)) throw new Error('resposta não é uma lista');
    return { produtos: dados.map(normalizar), usandoDemo: false, erro: null };
  } catch (erro) {
    console.warn('[Achadinhos] API indisponível, usando demonstração:', erro.message);
    return { produtos: DADOS_DEMO.map(normalizar), usandoDemo: true, erro: mensagemDeErro(erro) };
  } finally {
    clearTimeout(relogio);
  }
}

// Busca um produto pelo id (e devolve a lista completa para os relacionados).
export async function buscarProduto(id) {
  const { produtos, usandoDemo, erro } = await listarProdutos();
  const produto = produtos.find((p) => String(p.id) === String(id)) || null;
  return { produto, produtos, usandoDemo, erro };
}
