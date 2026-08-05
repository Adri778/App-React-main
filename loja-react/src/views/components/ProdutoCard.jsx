// VIEW · Card de produto (usado na home e nos relacionados).
import { Link } from 'react-router-dom';
import { formatarBRL, estrelas, vendidosTexto } from '../../util/formato.js';
import { descontoPct, parcelamento, precoPix } from '../../models/calculos.js';
import { useCarrinho } from '../../controllers/CarrinhoContext.jsx';
import { useFavoritos } from '../../controllers/FavoritosContext.jsx';
import ProdutoIcone from './ProdutoIcone.jsx';

export default function ProdutoCard({ produto }) {
  const { adicionar } = useCarrinho();
  const { alternar, ehFavorito } = useFavoritos();
  const favorito = ehFavorito(produto);
  const desconto = descontoPct(produto.precoOriginal, produto.preco);
  const parc = parcelamento(produto.preco);
  const url = `/produto/${encodeURIComponent(produto.id != null ? produto.id : produto.nome)}`;
  const parcelasTxt = parc ? (parc.n <= 1 ? 'à vista' : `${parc.n}x de ${formatarBRL(parc.valor)}`) : '';

  return (
    <article className="card">
      <div className="thumb">
        {desconto > 0 && <span className="off">-{desconto}%</span>}
        <button
          className={`wish${favorito ? ' on' : ''}`}
          type="button"
          aria-pressed={favorito}
          aria-label={favorito ? `Remover ${produto.nome} dos favoritos` : `Favoritar ${produto.nome}`}
          title={favorito ? 'Remover dos favoritos' : 'Salvar nos favoritos'}
          onClick={() => alternar(produto)}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill={favorito ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2"><path d="M20.8 5.6a5 5 0 00-7 0l-.8.8-.8-.8a5 5 0 00-7 7l7.8 7.9a1 1 0 001.4 0l7.8-7.9a5 5 0 000-7z" /></svg>
        </button>
        <Link className="thumb-link" to={url} aria-label={produto.nome}>
          {produto.imagem
            ? <img className="art-img" src={produto.imagem} alt={produto.nome} loading="lazy" />
            : <ProdutoIcone produto={produto} />}
        </Link>
      </div>
      <div className="card-body">
        {produto.avaliacao != null && (
          <div className="rate">
            <span className="stars" aria-hidden="true">{estrelas(produto.avaliacao)}</span>
            <span>{String(produto.avaliacao).replace('.', ',')}{vendidosTexto(produto.vendidos) ? ` · ${vendidosTexto(produto.vendidos)}` : ''}</span>
          </div>
        )}
        <h3 className="p-title"><Link to={url}>{produto.nome}</Link></h3>
        {produto.freteGratis && (
          <span className="ship-tag">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M2 7h11v9H2zM13 10h4l3 3v3h-7" /></svg>Frete grátis
          </span>
        )}
        <div className="p-price">
          {produto.precoOriginal != null && desconto > 0 && <span className="old tnum">{formatarBRL(produto.precoOriginal)}</span>}
          <span className="now tnum">{formatarBRL(produto.preco)}</span>
          {produto.preco != null && (
            <span className="inst tnum">{parcelasTxt} · <b>{formatarBRL(precoPix(produto.preco))} no Pix</b></span>
          )}
        </div>
        <button className="btn btn-primary btn-block" type="button" onClick={() => adicionar(produto, 1)}>Adicionar</button>
      </div>
    </article>
  );
}
