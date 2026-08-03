// =============================================================================
// MODEL · ProdutoModel
// Responsável por OBTER e SELECIONAR os dados. Não conhece o DOM.
// =============================================================================

import { API_URL, LIMITES } from '../config.js';
import { DADOS_DEMO } from './dadosDemo.js';
import { normalizar, descontoPct } from './calculos.js';

export class ProdutoModel {
  constructor() {
    this.produtos = [];
    this.usandoDemo = false;
  }

  // Busca os produtos da API; em caso de falha, cai nos dados de demonstração.
  async carregar() {
    try {
      const resposta = await fetch(API_URL, { cache: 'no-store' });
      if (!resposta.ok) throw new Error('HTTP ' + resposta.status);

      const dados = await resposta.json();
      if (!Array.isArray(dados)) throw new Error('resposta não é uma lista');

      this.produtos = dados.map(normalizar);
      this.usandoDemo = false;
    } catch (erro) {
      console.warn('[Achadinhos] API indisponível, usando demonstração:', erro.message);
      this.produtos = DADOS_DEMO.map(normalizar);
      this.usandoDemo = true;
    }
    return this.produtos;
  }

  // Ofertas do dia: produtos em promoção, ordenados pelo maior desconto.
  ofertas(limite = LIMITES.ofertas) {
    const emPromocao = this.produtos.filter(
      (p) => descontoPct(p.precoOriginal, p.preco) > 0 || p.promo
    );
    const base = (emPromocao.length ? emPromocao : this.produtos).slice();
    base.sort((a, b) => descontoPct(b.precoOriginal, b.preco) - descontoPct(a.precoOriginal, a.preco));
    return base.slice(0, limite);
  }

  // Mais vendidos: ordenados pela quantidade vendida.
  maisVendidos(limite = LIMITES.vendidos) {
    return this.produtos
      .slice()
      .sort((a, b) => (b.vendidos || 0) - (a.vendidos || 0))
      .slice(0, limite);
  }

  // Busca um produto pelo id. Tenta o endpoint direto (/produtos/:id) e,
  // se não houver, cai para procurar na lista completa (ou na demonstração).
  async buscarPorId(id) {
    try {
      const resp = await fetch(`${API_URL}/${encodeURIComponent(id)}`, { cache: 'no-store' });
      if (resp.ok) {
        const dado = await resp.json();
        if (dado && typeof dado === 'object' && !Array.isArray(dado)) return normalizar(dado);
      }
    } catch { /* segue para o fallback */ }

    if (!this.produtos.length) await this.carregar();
    return this.produtos.find((p) => String(p.id) === String(id)) || null;
  }

  // Produtos relacionados: mesma categoria (senão, quaisquer outros).
  relacionados(produto, limite = 4) {
    const semEle = (p) => String(p.id) !== String(produto.id);
    const mesmaCategoria = this.produtos.filter((p) => semEle(p) && p.categoria === produto.categoria);
    const base = mesmaCategoria.length ? mesmaCategoria : this.produtos.filter(semEle);
    return base.slice(0, limite);
  }
}
