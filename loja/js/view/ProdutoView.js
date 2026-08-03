// =============================================================================
// VIEW · ProdutoView
// Desenha a página de detalhe do produto (PDP) e a vitrine de relacionados.
// =============================================================================

import { formatarBRL, estrelas, vendidosTexto, escapeHtml } from '../util/formato.js';
import { svgIcone } from '../util/icones.js';
import { descontoPct, parcelamento, precoPix } from '../model/calculos.js';
import { LojaView } from './LojaView.js';

export class ProdutoView {
  constructor() {
    this.raiz = document.getElementById('pdp');
    this.gridRelacionados = document.getElementById('relacionados-grid');
    this.secaoRelacionados = document.getElementById('relacionados');
    this.lojaView = new LojaView(); // reutiliza a montagem de cards
    this._qtd = 1;
  }

  mostrarCarregando() {
    this.raiz.innerHTML =
      '<div class="pdp-grid">' +
        '<div class="skel-card sk" style="aspect-ratio:1/1;border-radius:var(--radius)"></div>' +
        '<div style="display:grid;gap:14px;align-content:start">' +
          '<div class="skel-card sk" style="height:16px;width:40%;border-radius:6px"></div>' +
          '<div class="skel-card sk" style="height:30px;width:80%;border-radius:6px"></div>' +
          '<div class="skel-card sk" style="height:44px;width:55%;border-radius:6px"></div>' +
          '<div class="skel-card sk" style="height:48px;border-radius:10px"></div>' +
        '</div>' +
      '</div>';
  }

  naoEncontrado() {
    this.raiz.innerHTML =
      '<div class="pdp-erro">' +
        '<b>Produto não encontrado</b>' +
        '<span>Ele pode ter saído do ar ou o endereço está incorreto.</span>' +
        '<a class="btn btn-primary" href="index.html">Voltar para a loja</a>' +
      '</div>';
    if (this.secaoRelacionados) this.secaoRelacionados.style.display = 'none';
  }

  render(p) {
    document.title = `${p.nome} · Achadinhos`;
    const desc = descontoPct(p.precoOriginal, p.preco);
    const parc = parcelamento(p.preco);
    const parcTxt = parc ? (parc.n <= 1 ? 'à vista' : `${parc.n}x de ${formatarBRL(parc.valor)} sem juros`) : '';

    const galeria = p.imagem
      ? `<img class="pdp-img" src="${escapeHtml(p.imagem)}" alt="${escapeHtml(p.nome)}">`
      : svgIcone(p, 'pdp-art');

    const precoBloco =
      (p.precoOriginal != null && desc > 0 ? `<span class="pdp-old tnum">${formatarBRL(p.precoOriginal)}</span><span class="pdp-off">-${desc}%</span>` : '') +
      `<div class="pdp-now tnum">${formatarBRL(p.preco)}</div>` +
      (parcTxt ? `<div class="pdp-parc tnum">${parcTxt}</div>` : '') +
      (p.preco != null ? `<div class="pdp-pix tnum">${formatarBRL(precoPix(p.preco))} <b>no Pix (10% off)</b></div>` : '');

    const avaliacao = p.avaliacao != null
      ? `<div class="pdp-rate"><span class="stars">${estrelas(p.avaliacao)}</span>` +
        `<span>${String(p.avaliacao).replace('.', ',')}${vendidosTexto(p.vendidos) ? ' · ' + vendidosTexto(p.vendidos) + ' vendidos' : ''}</span></div>`
      : '';

    const frete = p.freteGratis
      ? '<span class="ship-tag"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M2 7h11v9H2zM13 10h4l3 3v3h-7"/></svg>Frete grátis para todo o Brasil</span>'
      : '';

    const descricao = p.descricao
      ? escapeHtml(p.descricao)
      : `O ${escapeHtml(p.nome)} une desempenho e praticidade para o dia a dia da sua casa. ` +
        `Produto da categoria ${escapeHtml(p.categoria || 'utilidades')}, com qualidade garantida pela Achadinhos.`;

    const specs = [
      ['Categoria', p.categoria || '—'],
      ['Avaliação', p.avaliacao != null ? `${String(p.avaliacao).replace('.', ',')} / 5` : '—'],
      ['Frete grátis', p.freteGratis ? 'Sim' : 'Não'],
      ['Garantia', '12 meses'],
      ['Vendido e entregue por', 'Achadinhos'],
      ['Código', 'ACH-' + escapeHtml(p.id != null ? p.id : '000')],
    ];

    this.raiz.innerHTML = `
      <nav class="breadcrumb" aria-label="Você está em">
        <a href="index.html">Início</a><span>/</span>
        <a href="index.html">${escapeHtml(p.categoria || 'Produtos')}</a><span>/</span>
        <span class="atual">${escapeHtml(p.nome)}</span>
      </nav>
      <div class="pdp-grid">
        <div class="pdp-gallery">
          <div class="pdp-main">${galeria}</div>
          <div class="pdp-thumbs">
            <button class="pdp-thumb ativo" type="button">${svgIcone(p, 'art')}</button>
            <button class="pdp-thumb" type="button">${svgIcone(p, 'art')}</button>
            <button class="pdp-thumb" type="button">${svgIcone(p, 'art')}</button>
          </div>
        </div>
        <div class="pdp-info">
          <p class="kicker">${escapeHtml(p.categoria || 'Produto')}</p>
          <h1 class="pdp-title">${escapeHtml(p.nome)}</h1>
          ${avaliacao}
          <div class="pdp-price">${precoBloco}</div>
          ${frete}
          <div class="pdp-buy">
            <div class="qty-stepper" role="group" aria-label="Quantidade">
              <button type="button" data-q="dec" aria-label="Diminuir">−</button>
              <span id="pdp-qtd" class="tnum">1</span>
              <button type="button" data-q="inc" aria-label="Aumentar">+</button>
            </div>
            <button class="btn btn-primary btn-lg" id="pdp-add" type="button">Adicionar ao carrinho</button>
            <button class="btn btn-deal btn-lg" id="pdp-buy" type="button">Comprar agora</button>
          </div>
          <ul class="pdp-perks">
            <li><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="6" width="14" height="11" rx="1.5"/><path d="M15 9h4l3 3v5h-7"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="18" r="2"/></svg>Entrega para todo o Brasil</li>
            <li><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 019-9 9 9 0 018 5"/><path d="M20 3v5h-5"/><path d="M21 12a9 9 0 01-9 9 9 9 0 01-8-5"/><path d="M4 21v-5h5"/></svg>Troca fácil em até 7 dias</li>
            <li><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/></svg>Compra 100% segura</li>
          </ul>
        </div>
      </div>
      <div class="pdp-desc">
        <div class="pdp-desc-main">
          <h2>Descrição</h2>
          <p>${descricao}</p>
        </div>
        <div class="pdp-specs">
          <h2>Ficha técnica</h2>
          <table>${specs.map(([k, v]) => `<tr><th>${escapeHtml(k)}</th><td>${v}</td></tr>`).join('')}</table>
        </div>
      </div>`;

    this._ligarCompra(p);
  }

  _ligarCompra(produto) {
    this._qtd = 1;
    const span = this.raiz.querySelector('#pdp-qtd');
    const pintar = () => { span.textContent = this._qtd; };

    this.raiz.querySelector('[data-q="inc"]').addEventListener('click', () => { this._qtd++; pintar(); });
    this.raiz.querySelector('[data-q="dec"]').addEventListener('click', () => { this._qtd = Math.max(1, this._qtd - 1); pintar(); });

    const adicionar = (abrir) => {
      document.dispatchEvent(new CustomEvent('carrinho:adicionar', { detail: { produto, qtd: this._qtd } }));
      // "Comprar agora" também abre o carrinho — o CarrinhoController já abre ao adicionar.
    };
    this.raiz.querySelector('#pdp-add').addEventListener('click', () => adicionar(true));
    this.raiz.querySelector('#pdp-buy').addEventListener('click', () => adicionar(true));

    // galeria: alterna o "ativo" (as miniaturas são a mesma arte, só efeito visual)
    this.raiz.querySelectorAll('.pdp-thumb').forEach((t) => {
      t.addEventListener('click', () => {
        this.raiz.querySelectorAll('.pdp-thumb').forEach((x) => x.classList.remove('ativo'));
        t.classList.add('ativo');
      });
    });
  }

  renderRelacionados(lista) {
    if (!this.gridRelacionados) return;
    if (!lista.length) {
      if (this.secaoRelacionados) this.secaoRelacionados.style.display = 'none';
      return;
    }
    this.lojaView.renderizar(this.gridRelacionados, lista);
  }
}
