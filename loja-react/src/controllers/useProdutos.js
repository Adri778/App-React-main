// =============================================================================
// CONTROLLER · useProdutos — carrega a lista e separa ofertas / mais vendidos.
// Expõe também a lista completa (para busca/filtro) e um `recarregar`
// para a View poder oferecer "tentar de novo" quando a API falha.
// =============================================================================

import { useState, useEffect, useCallback } from 'react';
import { listarProdutos } from '../models/ProdutoService.js';
import { selecionarOfertas, selecionarMaisVendidos, categoriasDe } from '../models/calculos.js';

const INICIAL = {
  carregando: true, produtos: [], ofertas: [], maisVendidos: [],
  categorias: [], usandoDemo: false, erro: null,
};

export function useProdutos() {
  const [estado, setEstado] = useState(INICIAL);
  // Trocar esta chave refaz a requisição — é o gatilho do "tentar de novo".
  const [tentativa, setTentativa] = useState(0);

  const recarregar = useCallback(() => {
    setEstado((s) => ({ ...s, carregando: true }));
    setTentativa((n) => n + 1);
  }, []);

  useEffect(() => {
    let vivo = true;
    listarProdutos().then(({ produtos, usandoDemo, erro }) => {
      if (!vivo) return;
      setEstado({
        carregando: false,
        produtos,
        ofertas: selecionarOfertas(produtos),
        maisVendidos: selecionarMaisVendidos(produtos),
        categorias: categoriasDe(produtos),
        usandoDemo,
        erro,
      });
    });
    return () => { vivo = false; };
  }, [tentativa]);

  return { ...estado, recarregar };
}
