// =============================================================================
// CONTROLLER · LojaController
// Orquestra o fluxo: pede os dados ao Model e manda a View desenhar.
// =============================================================================

import { LIMITES } from '../config.js';

export class LojaController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
  }

  async iniciar() {
    // 1) efeitos e placeholders de carregamento
    this.view.iniciarEfeitos();
    this.view.mostrarCarregando(this.view.gridOfertas, LIMITES.ofertas);
    this.view.mostrarCarregando(this.view.gridVendidos, LIMITES.vendidos);

    // 2) busca os dados (com fallback interno para demonstração)
    await this.model.carregar();
    if (this.model.usandoDemo) this.view.marcarModoDemo();

    // 3) renderiza as vitrines
    this.view.renderizar(this.view.gridOfertas, this.model.ofertas());
    this.view.renderizar(this.view.gridVendidos, this.model.maisVendidos());
  }
}
