// =============================================================================
// VIEW · CarrinhoView
// Desenha o drawer (gaveta lateral) do carrinho e atualiza o badge do header.
// Injeta o próprio HTML no <body> para não duplicar markup entre as páginas.
// =============================================================================

import { formatarBRL, escapeHtml } from '../util/formato.js';
import { svgIcone } from '../util/icones.js';

export class CarrinhoView {
  constructor() {
    this.badge = document.getElementById('cart-count');
    this.totalHeader = document.getElementById('cart-total');
    this.botaoAbrir = document.getElementById('btn-carrinho');
    this._injetar();
  }

  _injetar() {
    const wrap = document.createElement('div');
    wrap.innerHTML = `
      <div class="cart-overlay" id="cart-overlay"></div>
      <aside class="cart-drawer" id="cart-drawer" aria-hidden="true" aria-label="Carrinho de compras">
        <div class="cart-head">
          <h2>Seu carrinho</h2>
          <button class="cart-close" id="cart-close" type="button" aria-label="Fechar carrinho">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
          </button>
        </div>
        <div class="cart-body" id="cart-body"></div>
        <div class="cart-foot" id="cart-foot">
          <div class="cart-sub"><span>Subtotal</span><strong class="tnum" id="cart-subtotal">R$ 0</strong></div>
          <p class="cart-fine">Frete e cupom calculados no checkout.</p>
          <button class="btn btn-primary btn-block" id="cart-checkout" type="button">Ir para o pagamento</button>
          <button class="btn btn-ghost btn-block" id="cart-continue" type="button">Continuar comprando</button>
        </div>
      </aside>`;
    document.body.appendChild(wrap);
    this.overlay = wrap.querySelector('#cart-overlay');
    this.drawer = wrap.querySelector('#cart-drawer');
    this.body = wrap.querySelector('#cart-body');
    this.subtotal = wrap.querySelector('#cart-subtotal');
    this.foot = wrap.querySelector('#cart-foot');
  }

  abrir() {
    this.overlay.classList.add('show');
    this.drawer.classList.add('open');
    this.drawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  fechar() {
    this.overlay.classList.remove('show');
    this.drawer.classList.remove('open');
    this.drawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  estaAberto() { return this.drawer.classList.contains('open'); }

  // Atualiza badge do header, subtotal e a lista de itens.
  atualizar(carrinho) {
    const q = carrinho.quantidadeTotal();
    if (this.badge) {
      this.badge.textContent = q;
      this.badge.style.display = q > 0 ? 'grid' : 'none';
    }
    if (this.totalHeader) this.totalHeader.textContent = formatarBRL(carrinho.total());
    if (this.subtotal) this.subtotal.textContent = formatarBRL(carrinho.total());

    if (!carrinho.itens.length) {
      this.foot.style.display = 'none';
      this.body.innerHTML =
        '<div class="cart-empty">' +
          '<svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="20" r="1.6"/><circle cx="18" cy="20" r="1.6"/><path d="M2 3h3l2.5 13h11l2-9H6"/></svg>' +
          '<b>Seu carrinho está vazio</b>' +
          '<span>Adicione produtos para vê-los aqui.</span>' +
        '</div>';
      return;
    }

    this.foot.style.display = '';
    this.body.innerHTML = carrinho.itens.map((i) => `
      <div class="cart-item" data-id="${escapeHtml(i.id)}">
        <div class="cart-thumb">${svgIcone(i, 'cart-art')}</div>
        <div class="cart-info">
          <p class="cart-name">${escapeHtml(i.nome)}</p>
          <p class="cart-unit tnum">${formatarBRL(i.preco)}</p>
          <div class="cart-qty">
            <button type="button" data-act="dec" aria-label="Diminuir">−</button>
            <span class="tnum">${i.qtd}</span>
            <button type="button" data-act="inc" aria-label="Aumentar">+</button>
            <button type="button" class="cart-remove" data-act="rm">Remover</button>
          </div>
        </div>
        <div class="cart-line tnum">${formatarBRL((i.preco || 0) * i.qtd)}</div>
      </div>`).join('');
  }
}
