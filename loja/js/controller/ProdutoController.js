// =============================================================================
// CONTROLLER · ProdutoController
// Lê o id do produto na URL (?id=...), pede ao Model e manda a View desenhar,
// além dos produtos relacionados.
// =============================================================================

export class ProdutoController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
  }

  async iniciar() {
    const id = new URLSearchParams(location.search).get('id');
    if (!id) { this.view.naoEncontrado(); return; }

    this.view.mostrarCarregando();

    const produto = await this.model.buscarPorId(id);
    if (!produto) { this.view.naoEncontrado(); return; }

    this.view.render(produto);

    // relacionados (garante que a lista completa esteja carregada)
    if (!this.model.produtos.length) await this.model.carregar();
    this.view.renderRelacionados(this.model.relacionados(produto));
  }
}
