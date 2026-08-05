// VIEW · Resultados de busca e catálogo por categoria.
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProdutos } from '../../controllers/useProdutos.js';
import { useCatalogo } from '../../controllers/useCatalogo.js';
import { ORDENACOES, TODAS_CATEGORIAS } from '../../models/calculos.js';
import VitrineGrade from '../components/VitrineGrade.jsx';
import AvisoApi from '../components/AvisoApi.jsx';

export default function BuscaPage() {
  const { carregando, produtos, categorias, usandoDemo, erro, recarregar } = useProdutos();
  const cat = useCatalogo(produtos);

  const titulo = cat.busca
    ? `"${cat.busca}"`
    : cat.categoria && cat.categoria !== TODAS_CATEGORIAS
      ? cat.categoria
      : 'Todos os produtos';

  useEffect(() => { document.title = `${titulo} · Achadinhos`; }, [titulo]);

  return (
    <main className="wrap busca-wrap">
      <nav className="breadcrumb" aria-label="Você está em">
        <Link to="/">Início</Link><span>/</span>
        <span className="atual">{titulo}</span>
      </nav>

      <div className="busca-top">
        <div>
          <h1 className="busca-titulo">{titulo}</h1>
          <p className="busca-contagem">
            {carregando
              ? 'Buscando…'
              : `${cat.resultados.length} ${cat.resultados.length === 1 ? 'produto encontrado' : 'produtos encontrados'}`}
          </p>
        </div>

        <label className="ordenar">
          <span>Ordenar por</span>
          <select value={cat.ordem} onChange={(e) => cat.definirOrdem(e.target.value)}>
            {Object.entries(ORDENACOES).map(([chave, { rotulo }]) => (
              <option key={chave} value={chave}>{rotulo}</option>
            ))}
          </select>
        </label>
      </div>

      <AvisoApi usandoDemo={usandoDemo} erro={erro} aoTentarDeNovo={recarregar} carregando={carregando} />

      {/* Filtro por categoria — reflete as categorias que existem no catálogo. */}
      <div className="filtros" role="group" aria-label="Filtrar por categoria">
        <button
          type="button"
          className={`chip${!cat.categoria || cat.categoria === TODAS_CATEGORIAS ? ' ativo' : ''}`}
          onClick={() => cat.definirCategoria(TODAS_CATEGORIAS)}
        >
          Todas
        </button>
        {categorias.map((c) => (
          <button
            key={c}
            type="button"
            className={`chip${cat.categoria === c ? ' ativo' : ''}`}
            onClick={() => cat.definirCategoria(cat.categoria === c ? TODAS_CATEGORIAS : c)}
          >
            {c}
          </button>
        ))}
      </div>

      {cat.temFiltro && !carregando && (
        <div className="filtros-ativos">
          {cat.busca && (
            <span className="tag-filtro">
              busca: <b>{cat.busca}</b>
              <button type="button" onClick={() => cat.definirBusca('')} aria-label="Limpar busca">×</button>
            </span>
          )}
          {cat.categoria && cat.categoria !== TODAS_CATEGORIAS && (
            <span className="tag-filtro">
              categoria: <b>{cat.categoria}</b>
              <button type="button" onClick={() => cat.definirCategoria(TODAS_CATEGORIAS)} aria-label="Limpar categoria">×</button>
            </span>
          )}
          <button type="button" className="limpar-tudo" onClick={cat.limparFiltros}>Limpar tudo</button>
        </div>
      )}

      {!carregando && cat.resultados.length === 0 ? (
        <div className="grid-empty busca-vazia">
          <b>Nenhum produto encontrado</b>
          {cat.busca
            ? <>Não achamos nada para <b>“{cat.busca}”</b>. Tente outra palavra ou veja todas as categorias.</>
            : <>Essa categoria ainda não tem produtos cadastrados.</>}
          <div className="nf-acoes" style={{ marginTop: 18 }}>
            <button type="button" className="btn btn-primary" onClick={cat.limparFiltros}>Ver todos os produtos</button>
          </div>
        </div>
      ) : (
        <>
          <VitrineGrade carregando={carregando} itens={cat.pagina} skeletons={8} />
          {cat.temMais && (
            <div className="carregar-mais">
              <button type="button" className="btn btn-ghost btn-lg" onClick={cat.carregarMais}>
                Carregar mais ({cat.resultados.length - cat.pagina.length} restantes)
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
}
