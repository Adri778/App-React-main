// =============================================================================
// CONTROLLER · useCatalogo — busca, filtro por categoria, ordenação e paginação.
// O estado mora na URL (?q=&cat=&ordem=), então o resultado é compartilhável,
// sobrevive ao F5 e faz o botão "voltar" do navegador funcionar de verdade.
// =============================================================================

import { useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { filtrarProdutos, ordenarProdutos, TODAS_CATEGORIAS } from '../models/calculos.js';
import { POR_PAGINA } from '../config.js';

export function useCatalogo(produtos) {
  const [params, setParams] = useSearchParams();

  const busca = params.get('q') || '';
  const categoria = params.get('cat') || '';
  const ordem = params.get('ordem') || 'relevancia';

  const resultados = useMemo(() => {
    const filtrados = filtrarProdutos(produtos, { busca, categoria });
    return ordenarProdutos(filtrados, ordem);
  }, [produtos, busca, categoria, ordem]);

  const [visiveis, setVisiveis] = useState(POR_PAGINA);

  // Qualquer mudança de critério volta a paginação para o começo.
  useEffect(() => { setVisiveis(POR_PAGINA); }, [busca, categoria, ordem]);

  // Preserva os outros parâmetros ao mexer em um só.
  function ajustar(mudancas) {
    const novos = new URLSearchParams(params);
    for (const [chave, valor] of Object.entries(mudancas)) {
      if (valor) novos.set(chave, valor);
      else novos.delete(chave);
    }
    setParams(novos);
  }

  return {
    busca,
    categoria,
    ordem,
    resultados,
    pagina: resultados.slice(0, visiveis),
    temMais: resultados.length > visiveis,
    carregarMais: () => setVisiveis((n) => n + POR_PAGINA),
    definirBusca: (q) => ajustar({ q }),
    definirCategoria: (cat) => ajustar({ cat: cat === TODAS_CATEGORIAS ? '' : cat }),
    definirOrdem: (o) => ajustar({ ordem: o === 'relevancia' ? '' : o }),
    limparFiltros: () => setParams(new URLSearchParams()),
    temFiltro: Boolean(busca || categoria),
  };
}
