// =============================================================================
// MODEL · Domínio: normalização, cálculos e seleção de produtos (sem UI).
// =============================================================================

import { LIMITES } from '../config.js';

export function num(v) {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : null;
}

// Aceita campos em inglês (back-end atual) ou português e devolve um formato único.
export function normalizar(p = {}) {
  return {
    id: p.id,
    nome: p.nome ?? p.name ?? 'Produto',
    preco: num(p.preco ?? p.price),
    precoOriginal: num(p.originalPrice ?? p.precoOriginal ?? p.preco_original),
    categoria: p.categoria ?? p.category ?? '',
    imagem: p.image ?? p.imagem ?? '',
    promo: !!(p.isPromo ?? p.is_promo),
    freteGratis: !!(p.freeShipping ?? p.frete_gratis),
    avaliacao: num(p.rating ?? p.avaliacao),
    vendidos: num(p.sold ?? p.vendidos),
    descricao: p.descricao ?? p.description ?? '',
  };
}

export function descontoPct(precoOriginal, preco) {
  if (precoOriginal != null && preco != null && precoOriginal > preco) {
    return Math.round((1 - preco / precoOriginal) * 100);
  }
  return 0;
}

export function parcelamento(preco) {
  if (preco == null) return null;
  const n = preco >= 100 ? 12 : (preco >= 50 ? 6 : 1);
  return n <= 1 ? { n: 1, valor: preco } : { n, valor: Math.floor(preco / n) };
}

export function precoPix(preco) {
  return preco == null ? null : Math.round(preco * 0.9);
}

// Ofertas do dia: em promoção, ordenadas pelo maior desconto.
export function selecionarOfertas(lista, limite = LIMITES.ofertas) {
  const promo = lista.filter((p) => descontoPct(p.precoOriginal, p.preco) > 0 || p.promo);
  const base = (promo.length ? promo : lista).slice();
  base.sort((a, b) => descontoPct(b.precoOriginal, b.preco) - descontoPct(a.precoOriginal, a.preco));
  return base.slice(0, limite);
}

// Mais vendidos: ordenados pela quantidade vendida.
export function selecionarMaisVendidos(lista, limite = LIMITES.vendidos) {
  return lista.slice().sort((a, b) => (b.vendidos || 0) - (a.vendidos || 0)).slice(0, limite);
}

// Relacionados: mesma categoria (senão, quaisquer outros).
export function relacionadosDe(lista, produto, limite = LIMITES.relacionados) {
  const semEle = (p) => String(p.id) !== String(produto.id);
  const mesma = lista.filter((p) => semEle(p) && p.categoria === produto.categoria);
  const base = mesma.length ? mesma : lista.filter(semEle);
  return base.slice(0, limite);
}

// -----------------------------------------------------------------------------
// BUSCA E FILTRO
// -----------------------------------------------------------------------------

// Tira acentos e caixa para a busca casar "eletrodomesticos" com "Eletrodomésticos".
export function chaveBusca(texto) {
  return String(texto ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove os acentos separados pelo NFD
    .toLowerCase()
    .trim();
}

// Categorias distintas presentes no catálogo, em ordem alfabética (pt-BR).
export function categoriasDe(lista) {
  const vistas = new Map();
  for (const p of lista) {
    const nome = (p.categoria || '').trim();
    if (nome && !vistas.has(chaveBusca(nome))) vistas.set(chaveBusca(nome), nome);
  }
  return [...vistas.values()].sort((a, b) => a.localeCompare(b, 'pt-BR'));
}

// Filtra por texto livre (nome, categoria e descrição) e por categoria.
// `categoria` vazia ou TODAS_CATEGORIAS não restringe nada.
export const TODAS_CATEGORIAS = 'todas';

export function filtrarProdutos(lista, { busca = '', categoria = '' } = {}) {
  const termos = chaveBusca(busca).split(/\s+/).filter(Boolean);
  const cat = chaveBusca(categoria);
  const filtrarCategoria = cat && cat !== TODAS_CATEGORIAS;

  return lista.filter((p) => {
    if (filtrarCategoria && chaveBusca(p.categoria) !== cat) return false;
    if (!termos.length) return true;
    const alvo = chaveBusca(`${p.nome} ${p.categoria} ${p.descricao}`);
    return termos.every((t) => alvo.includes(t)); // todos os termos precisam bater
  });
}

// Ordenações da vitrine de resultados.
export const ORDENACOES = {
  relevancia: { rotulo: 'Mais relevantes', ordenar: (a, b) => (b.vendidos || 0) - (a.vendidos || 0) },
  menorPreco: { rotulo: 'Menor preço', ordenar: (a, b) => (a.preco ?? Infinity) - (b.preco ?? Infinity) },
  maiorPreco: { rotulo: 'Maior preço', ordenar: (a, b) => (b.preco ?? -Infinity) - (a.preco ?? -Infinity) },
  desconto: { rotulo: 'Maior desconto', ordenar: (a, b) => descontoPct(b.precoOriginal, b.preco) - descontoPct(a.precoOriginal, a.preco) },
  avaliacao: { rotulo: 'Melhor avaliados', ordenar: (a, b) => (b.avaliacao || 0) - (a.avaliacao || 0) },
};

export function ordenarProdutos(lista, chave) {
  const modo = ORDENACOES[chave] || ORDENACOES.relevancia;
  return lista.slice().sort(modo.ordenar);
}
