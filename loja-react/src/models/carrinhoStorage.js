// =============================================================================
// MODEL · Persistência do carrinho em localStorage.
// =============================================================================

const CHAVE = 'achadinhos:carrinho';

export function lerCarrinho() {
  try {
    const bruto = JSON.parse(localStorage.getItem(CHAVE));
    return Array.isArray(bruto) ? bruto : [];
  } catch {
    return [];
  }
}

export function salvarCarrinho(itens) {
  try {
    localStorage.setItem(CHAVE, JSON.stringify(itens));
  } catch {
    /* modo privado / indisponível */
  }
}
