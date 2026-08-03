// =============================================================================
// CONTROLLER · useProduto — carrega um produto por id + os relacionados.
// =============================================================================

import { useState, useEffect } from 'react';
import { buscarProduto } from '../models/ProdutoService.js';
import { relacionadosDe } from '../models/calculos.js';

export function useProduto(id) {
  const [estado, setEstado] = useState({
    carregando: true, produto: null, relacionados: [], usandoDemo: false,
  });

  useEffect(() => {
    let vivo = true;
    setEstado((s) => ({ ...s, carregando: true }));
    buscarProduto(id).then(({ produto, produtos, usandoDemo }) => {
      if (!vivo) return;
      setEstado({
        carregando: false,
        produto,
        relacionados: produto ? relacionadosDe(produtos, produto) : [],
        usandoDemo,
      });
    });
    return () => { vivo = false; };
  }, [id]);

  return estado;
}
