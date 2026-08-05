// =============================================================================
// MODEL · Persistência dos favoritos em localStorage.
// Guarda o produto inteiro (e não só o id) para a página de favoritos
// funcionar mesmo se a API estiver fora do ar.
// =============================================================================

const CHAVE = 'achadinhos:favoritos';

export function lerFavoritos() {
  try {
    const bruto = JSON.parse(localStorage.getItem(CHAVE));
    return Array.isArray(bruto) ? bruto : [];
  } catch {
    return [];
  }
}

export function salvarFavoritos(itens) {
  try {
    localStorage.setItem(CHAVE, JSON.stringify(itens));
  } catch {
    /* modo privado / indisponível */
  }
}
