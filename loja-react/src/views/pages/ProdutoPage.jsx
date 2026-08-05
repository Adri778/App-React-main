// VIEW · Página de detalhe do produto (PDP).
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProduto } from '../../controllers/useProduto.js';
import { useCarrinho } from '../../controllers/CarrinhoContext.jsx';
import { formatarBRL, estrelas, vendidosTexto } from '../../util/formato.js';
import { descontoPct, parcelamento, precoPix } from '../../models/calculos.js';
import ProdutoIcone from '../components/ProdutoIcone.jsx';
import ProdutoCard from '../components/ProdutoCard.jsx';

export default function ProdutoPage() {
  const { id } = useParams();
  const { carregando, produto, relacionados, usandoDemo } = useProduto(id);
  const { adicionar } = useCarrinho();
  const [qtd, setQtd] = useState(1);
  const [thumbAtiva, setThumbAtiva] = useState(0);

  useEffect(() => { setQtd(1); setThumbAtiva(0); }, [id]);
  useEffect(() => { document.title = produto ? `${produto.nome} · Achadinhos` : 'Produto · Achadinhos'; }, [produto]);

  if (carregando) {
    return (
      <main className="wrap pdp-wrap">
        <div className="pdp-grid">
          <div className="skel-card sk" style={{ aspectRatio: '1 / 1', borderRadius: 'var(--radius)' }} />
          <div style={{ display: 'grid', gap: 14, alignContent: 'start' }}>
            <div className="skel-card sk" style={{ height: 16, width: '40%', borderRadius: 6 }} />
            <div className="skel-card sk" style={{ height: 30, width: '80%', borderRadius: 6 }} />
            <div className="skel-card sk" style={{ height: 44, width: '55%', borderRadius: 6 }} />
            <div className="skel-card sk" style={{ height: 48, borderRadius: 10 }} />
          </div>
        </div>
      </main>
    );
  }

  if (!produto) {
    return (
      <main className="wrap pdp-wrap">
        <div className="pdp-erro">
          <b>Produto não encontrado</b>
          <span>Ele pode ter saído do ar ou o endereço está incorreto.</span>
          <Link className="btn btn-primary" to="/">Voltar para a loja</Link>
        </div>
      </main>
    );
  }

  const desconto = descontoPct(produto.precoOriginal, produto.preco);
  const parc = parcelamento(produto.preco);
  const parcTxt = parc ? (parc.n <= 1 ? 'à vista' : `${parc.n}x de ${formatarBRL(parc.valor)} sem juros`) : '';
  const descricao = produto.descricao ||
    `O ${produto.nome} une desempenho e praticidade para o dia a dia da sua casa. Produto da categoria ${produto.categoria || 'utilidades'}, com qualidade garantida pela Achadinhos.`;
  const specs = [
    ['Categoria', produto.categoria || '—'],
    ['Avaliação', produto.avaliacao != null ? `${String(produto.avaliacao).replace('.', ',')} / 5` : '—'],
    ['Frete grátis', produto.freteGratis ? 'Sim' : 'Não'],
    ['Garantia', '12 meses'],
    ['Vendido e entregue por', 'Achadinhos'],
    ['Código', 'ACH-' + (produto.id != null ? produto.id : '000')],
  ];

  return (
    <>
      <main className="wrap pdp-wrap">
        <nav className="breadcrumb" aria-label="Você está em">
          <Link to="/">Início</Link><span>/</span>
          <Link to={produto.categoria ? `/busca?cat=${encodeURIComponent(produto.categoria)}` : '/busca?cat=todas'}>
            {produto.categoria || 'Produtos'}
          </Link><span>/</span>
          <span className="atual">{produto.nome}</span>
        </nav>

        <div className="pdp-grid">
          <div className="pdp-gallery">
            <div className="pdp-main">
              {produto.imagem
                ? <img className="pdp-img" src={produto.imagem} alt={produto.nome} />
                : <ProdutoIcone produto={produto} className="pdp-art" />}
            </div>
            <div className="pdp-thumbs">
              {[0, 1, 2].map((i) => (
                <button key={i} type="button" className={`pdp-thumb${thumbAtiva === i ? ' ativo' : ''}`} onClick={() => setThumbAtiva(i)}>
                  <ProdutoIcone produto={produto} />
                </button>
              ))}
            </div>
          </div>

          <div className="pdp-info">
            <p className="kicker">{produto.categoria || 'Produto'}</p>
            <h1 className="pdp-title">{produto.nome}</h1>
            {produto.avaliacao != null && (
              <div className="pdp-rate">
                <span className="stars">{estrelas(produto.avaliacao)}</span>
                <span>{String(produto.avaliacao).replace('.', ',')}{vendidosTexto(produto.vendidos) ? ` · ${vendidosTexto(produto.vendidos)} vendidos` : ''}</span>
              </div>
            )}

            <div className="pdp-price">
              {produto.precoOriginal != null && desconto > 0 && (
                <>
                  <span className="pdp-old tnum">{formatarBRL(produto.precoOriginal)}</span>
                  <span className="pdp-off">-{desconto}%</span>
                </>
              )}
              <div className="pdp-now tnum">{formatarBRL(produto.preco)}</div>
              {parcTxt && <div className="pdp-parc tnum">{parcTxt}</div>}
              {produto.preco != null && <div className="pdp-pix tnum">{formatarBRL(precoPix(produto.preco))} <b>no Pix (10% off)</b></div>}
            </div>

            {produto.freteGratis && (
              <span className="ship-tag">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M2 7h11v9H2zM13 10h4l3 3v3h-7" /></svg>
                Frete grátis para todo o Brasil
              </span>
            )}

            <div className="pdp-buy">
              <div className="qty-stepper" role="group" aria-label="Quantidade">
                <button type="button" aria-label="Diminuir" onClick={() => setQtd((q) => Math.max(1, q - 1))}>−</button>
                <span className="tnum">{qtd}</span>
                <button type="button" aria-label="Aumentar" onClick={() => setQtd((q) => q + 1)}>+</button>
              </div>
              <button className="btn btn-primary btn-lg" type="button" onClick={() => adicionar(produto, qtd)}>Adicionar ao carrinho</button>
              <button className="btn btn-deal btn-lg" type="button" onClick={() => adicionar(produto, qtd)}>Comprar agora</button>
            </div>

            <ul className="pdp-perks">
              <li><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="6" width="14" height="11" rx="1.5" /><path d="M15 9h4l3 3v5h-7" /><circle cx="6" cy="18" r="2" /><circle cx="18" cy="18" r="2" /></svg>Entrega para todo o Brasil</li>
              <li><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 019-9 9 9 0 018 5" /><path d="M20 3v5h-5" /><path d="M21 12a9 9 0 01-9 9 9 9 0 01-8-5" /><path d="M4 21v-5h5" /></svg>Troca fácil em até 7 dias</li>
              <li><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" /><path d="M9 12l2 2 4-4" /></svg>Compra 100% segura</li>
            </ul>
          </div>
        </div>

        <div className="pdp-desc">
          <div className="pdp-desc-main">
            <h2>Descrição</h2>
            <p>{descricao}</p>
          </div>
          <div className="pdp-specs">
            <h2>Ficha técnica</h2>
            <table><tbody>{specs.map(([k, v]) => <tr key={k}><th>{k}</th><td>{v}</td></tr>)}</tbody></table>
          </div>
        </div>
      </main>

      {relacionados.length > 0 && (
        <section className="sec" id="relacionados">
          <div className="wrap">
            <div className="sec-top">
              <div>
                <p className="kicker">Você também pode gostar</p>
                <h2>Produtos relacionados</h2>
              </div>
              <div className="sec-tail">
                {usandoDemo && <span className="demo-note show">demonstração · API offline</span>}
                <Link className="sec-link" to={produto.categoria ? `/busca?cat=${encodeURIComponent(produto.categoria)}` : '/busca?cat=todas'}>
                  Ver mais <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                </Link>
              </div>
            </div>
            <div className="grid">
              {relacionados.map((p) => <ProdutoCard key={p.id != null ? p.id : p.nome} produto={p} />)}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
