// =============================================================================
// CONTROLLER · useProdutos — carrega a lista e separa ofertas / mais vendidos.
// =============================================================================

import { useState, useEffect } from 'react';
import { listarProdutos } from '../models/ProdutoService.js';
import { selecionarOfertas, selecionarMaisVendidos } from '../models/calculos.js';

export function useProdutos() {
  const [estado, setEstado] = useState({
    carregando: true, ofertas: [], maisVendidos: [], usandoDemo: false,
  });

  useEffect(() => {
    let vivo = true;
    listarProdutos().then(({ produtos, usandoDemo }) => {
      if (!vivo) return;
      setEstado({
        carregando: false,
        ofertas: selecionarOfertas(produtos),
        maisVendidos: selecionarMaisVendidos(produtos),
        usandoDemo,
      });
    });
    return () => { vivo = false; };
  }, []);

  return estado;
}
