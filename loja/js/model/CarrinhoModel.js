// =============================================================================
// MODEL · CarrinhoModel
// Estado do carrinho, persistido em localStorage. Notifica quem escuta (aoMudar).
// Não conhece o DOM.
// =============================================================================

const CHAVE = 'achadinhos:carrinho';

export class CarrinhoModel {
  constructor() {
    this.itens = this._ler();
    this._ouvintes = [];
  }

  _ler() {
    try {
      const bruto = JSON.parse(localStorage.getItem(CHAVE));
      return Array.isArray(bruto) ? bruto : [];
    } catch {
      return [];
    }
  }

  _salvar() {
    try { localStorage.setItem(CHAVE, JSON.stringify(this.itens)); } catch { /* modo privado etc. */ }
    this._emitir();
  }

  // Registra um callback chamado a cada mudança do carrinho.
  aoMudar(fn) { this._ouvintes.push(fn); }
  _emitir() { this._ouvintes.forEach((fn) => fn(this)); }

  _idDe(produto) { return produto.id != null ? produto.id : produto.nome; }

  adicionar(produto, qtd = 1) {
    const id = this._idDe(produto);
    const existente = this.itens.find((i) => String(i.id) === String(id));
    if (existente) {
      existente.qtd += qtd;
    } else {
      this.itens.push({
        id,
        nome: produto.nome,
        preco: produto.preco,
        imagem: produto.imagem || '',
        categoria: produto.categoria || '',
        qtd,
      });
    }
    this._salvar();
  }

  alterarQtd(id, qtd) {
    const item = this.itens.find((i) => String(i.id) === String(id));
    if (!item) return;
    item.qtd = Math.max(1, qtd);
    this._salvar();
  }

  remover(id) {
    this.itens = this.itens.filter((i) => String(i.id) !== String(id));
    this._salvar();
  }

  limpar() {
    this.itens = [];
    this._salvar();
  }

  quantidadeTotal() { return this.itens.reduce((s, i) => s + i.qtd, 0); }
  total() { return this.itens.reduce((s, i) => s + (i.preco || 0) * i.qtd, 0); }
}
