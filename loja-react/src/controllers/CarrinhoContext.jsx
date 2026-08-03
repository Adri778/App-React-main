// =============================================================================
// CONTROLLER · CarrinhoContext
// Estado global do carrinho (Context + hook useCarrinho). Persiste no localStorage
// e controla a abertura do drawer. É o "controller" que a View consome.
// =============================================================================

import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { lerCarrinho, salvarCarrinho } from '../models/carrinhoStorage.js';

const CarrinhoCtx = createContext(null);

const idDe = (p) => (p.id != null ? p.id : p.nome);

export function CarrinhoProvider({ children }) {
  const [itens, setItens] = useState(lerCarrinho);
  const [aberto, setAberto] = useState(false);

  useEffect(() => { salvarCarrinho(itens); }, [itens]);

  const adicionar = useCallback((produto, qtd = 1) => {
    setItens((prev) => {
      const id = idDe(produto);
      const i = prev.findIndex((x) => String(x.id) === String(id));
      if (i >= 0) {
        const copia = prev.slice();
        copia[i] = { ...copia[i], qtd: copia[i].qtd + qtd };
        return copia;
      }
      return [...prev, {
        id, nome: produto.nome, preco: produto.preco,
        imagem: produto.imagem || '', categoria: produto.categoria || '', qtd,
      }];
    });
    setAberto(true);
  }, []);

  const alterarQtd = useCallback((id, qtd) => {
    setItens((prev) => prev.map((x) => (String(x.id) === String(id) ? { ...x, qtd: Math.max(1, qtd) } : x)));
  }, []);

  const remover = useCallback((id) => {
    setItens((prev) => prev.filter((x) => String(x.id) !== String(id)));
  }, []);

  const limpar = useCallback(() => setItens([]), []);

  const quantidade = useMemo(() => itens.reduce((s, i) => s + i.qtd, 0), [itens]);
  const total = useMemo(() => itens.reduce((s, i) => s + (i.preco || 0) * i.qtd, 0), [itens]);

  const valor = {
    itens, adicionar, alterarQtd, remover, limpar, quantidade, total,
    aberto, abrir: () => setAberto(true), fechar: () => setAberto(false),
  };

  return <CarrinhoCtx.Provider value={valor}>{children}</CarrinhoCtx.Provider>;
}

export function useCarrinho() {
  const ctx = useContext(CarrinhoCtx);
  if (!ctx) throw new Error('useCarrinho precisa estar dentro de <CarrinhoProvider>');
  return ctx;
}
