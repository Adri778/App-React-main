// VIEW · Lista de favoritos salvos no navegador.
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useFavoritos } from '../../controllers/FavoritosContext.jsx';
import ProdutoCard from '../components/ProdutoCard.jsx';

export default function FavoritosPage() {
  const { itens, limpar, quantidade } = useFavoritos();

  useEffect(() => { document.title = 'Meus favoritos · Achadinhos'; }, []);

  return (
    <main className="wrap busca-wrap">
      <nav className="breadcrumb" aria-label="Você está em">
        <Link to="/">Início</Link><span>/</span>
        <span className="atual">Favoritos</span>
      </nav>

      <div className="busca-top">
        <div>
          <h1 className="busca-titulo">Meus favoritos</h1>
          <p className="busca-contagem">
            {quantidade === 0
              ? 'Nenhum produto salvo ainda'
              : `${quantidade} ${quantidade === 1 ? 'produto salvo' : 'produtos salvos'} neste navegador`}
          </p>
        </div>
        {quantidade > 0 && (
          <button type="button" className="btn btn-ghost" onClick={limpar}>Limpar favoritos</button>
        )}
      </div>

      {quantidade === 0 ? (
        <div className="grid-empty busca-vazia">
          <b>Sua lista de favoritos está vazia</b>
          Toque no coração de qualquer produto para guardá-lo aqui e achar de novo depois.
          <div className="nf-acoes" style={{ marginTop: 18 }}>
            <Link className="btn btn-primary" to="/busca?cat=todas">Ver produtos</Link>
          </div>
        </div>
      ) : (
        <div className="grid">
          {itens.map((p) => <ProdutoCard key={p.id != null ? p.id : p.nome} produto={p} />)}
        </div>
      )}
    </main>
  );
}
