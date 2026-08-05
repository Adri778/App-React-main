// =============================================================================
// CONTROLLER · FavoritosContext
// Estado global dos favoritos (Context + hook useFavoritos), persistido no
// localStorage. Mesma forma do CarrinhoContext, para a View consumir igual.
// =============================================================================

import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { lerFavoritos, salvarFavoritos } from '../models/favoritosStorage.js';

const FavoritosCtx = createContext(null);

const idDe = (p) => (p.id != null ? p.id : p.nome);

export function FavoritosProvider({ children }) {
  const [itens, setItens] = useState(lerFavoritos);

  useEffect(() => { salvarFavoritos(itens); }, [itens]);

  const alternar = useCallback((produto) => {
    setItens((prev) => {
      const id = idDe(produto);
      const jaTem = prev.some((x) => String(idDe(x)) === String(id));
      if (jaTem) return prev.filter((x) => String(idDe(x)) !== String(id));
      return [...prev, produto];
    });
  }, []);

  const remover = useCallback((id) => {
    setItens((prev) => prev.filter((x) => String(idDe(x)) !== String(id)));
  }, []);

  const limpar = useCallback(() => setItens([]), []);

  // Set de ids para o card responder em O(1) em vez de varrer a lista.
  const idsFavoritos = useMemo(
    () => new Set(itens.map((x) => String(idDe(x)))),
    [itens],
  );

  const ehFavorito = useCallback(
    (produto) => idsFavoritos.has(String(idDe(produto))),
    [idsFavoritos],
  );

  const valor = useMemo(
    () => ({ itens, alternar, remover, limpar, ehFavorito, quantidade: itens.length }),
    [itens, alternar, remover, limpar, ehFavorito],
  );

  return <FavoritosCtx.Provider value={valor}>{children}</FavoritosCtx.Provider>;
}

export function useFavoritos() {
  const ctx = useContext(FavoritosCtx);
  if (!ctx) throw new Error('useFavoritos precisa estar dentro de <FavoritosProvider>');
  return ctx;
}
