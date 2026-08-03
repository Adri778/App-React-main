// =============================================================================
// MODEL · Cálculos e normalização (regras de domínio, sem DOM)
// =============================================================================

// Converte para número ou devolve null (evita "NaN" na tela).
export function num(v) {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : null;
}

// Normaliza um produto vindo da API (inglês OU português) para um formato único.
// Assim a View não precisa saber como o backend nomeia os campos.
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
    link: p.affiliateLink ?? p.link ?? '',
  };
}

// Percentual de desconto (0 quando não há preço original maior).
export function descontoPct(precoOriginal, preco) {
  if (precoOriginal != null && preco != null && precoOriginal > preco) {
    return Math.round((1 - preco / precoOriginal) * 100);
  }
  return 0;
}

// Parcelamento sugerido: { n, valor } — ou { n: 1 } para "à vista".
export function parcelamento(preco) {
  if (preco == null) return null;
  const n = preco >= 100 ? 12 : (preco >= 50 ? 6 : 1);
  return n <= 1 ? { n: 1, valor: preco } : { n, valor: Math.floor(preco / n) };
}

// Preço à vista no Pix (10% de desconto).
export function precoPix(preco) {
  return preco == null ? null : Math.round(preco * 0.9);
}
