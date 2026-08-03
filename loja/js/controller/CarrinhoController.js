// =============================================================================
// CONTROLLER · CarrinhoController
// Liga CarrinhoModel <-> CarrinhoView e trata os eventos (abrir, qtd, remover,
// e o evento global "carrinho:adicionar" disparado pelos cards e pela PDP).
// =============================================================================

export class CarrinhoController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
  }

  iniciar() {
    // Model -> View
    this.model.aoMudar((c) => this.view.atualizar(c));
    this.view.atualizar(this.model); // estado inicial (vindo do localStorage)

    // Abrir / fechar
    this.view.botaoAbrir?.addEventListener('click', (e) => { e.preventDefault(); this.view.abrir(); });
    this.view.overlay.addEventListener('click', () => this.view.fechar());
    this.view.drawer.querySelector('#cart-close').addEventListener('click', () => this.view.fechar());
    this.view.drawer.querySelector('#cart-continue').addEventListener('click', () => this.view.fechar());
    this.view.drawer.querySelector('#cart-checkout').addEventListener('click', () => {
      // Checkout ainda não implementado (próximo item do roadmap).
      alert('Checkout ainda não implementado — é o próximo passo do roadmap. Seu carrinho fica salvo.');
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.view.estaAberto()) this.view.fechar();
    });

    // Alterar qtd / remover (delegação de eventos na lista)
    this.view.body.addEventListener('click', (e) => {
      const botao = e.target.closest('[data-act]');
      if (!botao) return;
      const linha = e.target.closest('.cart-item');
      const id = linha && linha.dataset.id;
      if (id == null) return;
      const item = this.model.itens.find((x) => String(x.id) === String(id));
      const qtdAtual = item ? item.qtd : 1;
      const acao = botao.dataset.act;
      if (acao === 'inc') this.model.alterarQtd(id, qtdAtual + 1);
      else if (acao === 'dec') this.model.alterarQtd(id, qtdAtual - 1);
      else if (acao === 'rm') this.model.remover(id);
    });

    // Adicionar (disparado por qualquer card ou pela página de produto)
    document.addEventListener('carrinho:adicionar', (e) => {
      const { produto, qtd } = e.detail || {};
      if (!produto) return;
      this.model.adicionar(produto, qtd || 1);
      this.view.abrir();
    });
  }
}
