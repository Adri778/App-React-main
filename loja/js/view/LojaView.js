// =============================================================================
// VIEW · LojaView
// Responsável por MONTAR o DOM (cards, skeleton, estados). Não busca dados.
// =============================================================================

import { escapeHtml, formatarBRL, estrelas, vendidosTexto } from '../util/formato.js';
import { descontoPct, parcelamento, precoPix } from '../model/calculos.js';
import { iconePara, svgIcone } from '../util/icones.js';

const ICONE_FRETE = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M2 7h11v9H2zM13 10h4l3 3v3h-7"/></svg>';
const ICONE_CORACAO = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.8 5.6a5 5 0 00-7 0l-.8.8-.8-.8a5 5 0 00-7 7l7.8 7.9a1 1 0 001.4 0l7.8-7.9a5 5 0 000-7z"/></svg>';

export class LojaView {
  constructor() {
    this.gridOfertas = document.getElementById('grid-ofertas');
    this.gridVendidos = document.getElementById('grid-vendidos');
    this.notasDemo = document.querySelectorAll('.demo-note');
  }

  // Cria o elemento de um card de produto.
  montarCard(produto) {
    const desconto = descontoPct(produto.precoOriginal, produto.preco);
    const idIcone = iconePara(produto);
    const parc = parcelamento(produto.preco);
    const url = 'produto.html?id=' + encodeURIComponent(produto.id != null ? produto.id : produto.nome);

    const selo = desconto > 0 ? `<span class="off">-${desconto}%</span>` : '';
    const favorito = `<button class="wish" type="button" aria-label="Favoritar">${ICONE_CORACAO}</button>`;
    const midia = produto.imagem
      ? `<img class="art-img" src="${escapeHtml(produto.imagem)}" alt="${escapeHtml(produto.nome)}" loading="lazy">`
      : svgIcone(idIcone, 'art');

    const avaliacao = produto.avaliacao != null
      ? '<div class="rate"><span class="stars" aria-hidden="true">' + estrelas(produto.avaliacao) + '</span>' +
        '<span>' + String(produto.avaliacao).replace('.', ',') +
        (vendidosTexto(produto.vendidos) ? ' · ' + vendidosTexto(produto.vendidos) : '') + '</span></div>'
      : '';

    const frete = produto.freteGratis ? `<span class="ship-tag">${ICONE_FRETE}Frete grátis</span>` : '';
    const precoAntigo = (produto.precoOriginal != null && desconto > 0)
      ? `<span class="old tnum">${formatarBRL(produto.precoOriginal)}</span>` : '';

    const parcelasTxt = parc ? (parc.n <= 1 ? 'à vista' : `${parc.n}x de ${formatarBRL(parc.valor)}`) : '';
    const linhaParcelas = produto.preco != null
      ? `<span class="inst tnum">${parcelasTxt} · <b>${formatarBRL(precoPix(produto.preco))} no Pix</b></span>` : '';

    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML =
      `<div class="thumb">${selo}${favorito}<a class="thumb-link" href="${url}" aria-label="${escapeHtml(produto.nome)}">${midia}</a></div>` +
      `<div class="card-body">${avaliacao}` +
        `<h3 class="p-title"><a href="${url}">${escapeHtml(produto.nome)}</a></h3>${frete}` +
        `<div class="p-price">${precoAntigo}<span class="now tnum">${formatarBRL(produto.preco)}</span>${linhaParcelas}</div>` +
        `<button class="btn btn-primary btn-block" type="button" data-add>Adicionar</button>` +
      `</div>`;

    // Se a imagem remota falhar (ou for bloqueada), volta para o ícone SVG.
    const img = card.querySelector('.art-img');
    if (img) img.addEventListener('error', () => { img.outerHTML = svgIcone(idIcone, 'art'); });

    // Adicionar ao carrinho (o CarrinhoController escuta este evento e abre o drawer).
    card.querySelector('[data-add]').addEventListener('click', () => {
      document.dispatchEvent(new CustomEvent('carrinho:adicionar', { detail: { produto, qtd: 1 } }));
    });

    return card;
  }

  // Card "fantasma" enquanto carrega.
  montarSkeleton() {
    const el = document.createElement('div');
    el.className = 'card skel-card';
    el.setAttribute('aria-hidden', 'true');
    el.innerHTML =
      '<div class="sk" style="aspect-ratio:4/3"></div>' +
      '<div style="padding:14px;display:grid;gap:9px">' +
        '<div class="sk" style="height:12px;width:55%;border-radius:6px"></div>' +
        '<div class="sk" style="height:14px;width:92%;border-radius:6px"></div>' +
        '<div class="sk" style="height:24px;width:50%;border-radius:6px"></div>' +
        '<div class="sk" style="height:38px;border-radius:10px"></div>' +
      '</div>';
    return el;
  }

  // Preenche uma grade com N skeletons.
  mostrarCarregando(grid, quantidade) {
    grid.innerHTML = '';
    for (let i = 0; i < quantidade; i++) grid.appendChild(this.montarSkeleton());
  }

  // Renderiza a lista de produtos (ou o estado vazio) em uma grade.
  renderizar(grid, produtos) {
    grid.innerHTML = '';
    grid.removeAttribute('aria-busy');
    if (!produtos.length) {
      grid.innerHTML =
        '<div class="grid-empty"><b>Nenhum produto por aqui ainda</b>' +
        'Assim que você cadastrar produtos, eles aparecem automaticamente.</div>';
      return;
    }
    const fragmento = document.createDocumentFragment();
    produtos.forEach((p) => fragmento.appendChild(this.montarCard(p)));
    grid.appendChild(fragmento);
  }

  // Mostra o selo "demonstração" quando os dados vieram do fallback.
  marcarModoDemo() {
    this.notasDemo.forEach((n) => n.classList.add('show'));
  }

  // Efeitos visuais: revelar ao rolar + contador regressivo das ofertas.
  iniciarEfeitos() {
    const semMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const itens = document.querySelectorAll('.reveal');

    if (semMovimento || !('IntersectionObserver' in window)) {
      itens.forEach((el) => el.classList.add('in'));
    } else {
      const io = new IntersectionObserver((entradas) => {
        entradas.forEach((e) => {
          if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });
      itens.forEach((el) => io.observe(el));
    }

    const contador = document.querySelector('.countdown');
    if (contador) {
      const caixas = contador.querySelectorAll('.box');
      let total = 8 * 3600 + 42 * 60 + 15;
      const pad = (n) => (n < 10 ? '0' : '') + n;
      setInterval(() => {
        if (total <= 0) return;
        total--;
        caixas[0].textContent = pad(Math.floor(total / 3600));
        caixas[1].textContent = pad(Math.floor((total % 3600) / 60));
        caixas[2].textContent = pad(total % 60);
      }, 1000);
    }
  }
}
