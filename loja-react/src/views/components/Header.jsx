// VIEW · Cabeçalho: marca, busca, conta e botão do carrinho (abre o drawer).
import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useSearchParams } from 'react-router-dom';
import { useCarrinho } from '../../controllers/CarrinhoContext.jsx';
import { useFavoritos } from '../../controllers/FavoritosContext.jsx';
import { formatarBRL } from '../../util/formato.js';

// Categorias fixas da barra — devem casar com o campo `categoria` dos produtos.
const CATEGORIAS = [
  'Eletrodomésticos', 'TV & Vídeo', 'Celulares', 'Cozinha',
  'Casa Inteligente', 'Áudio', 'Climatização', 'Utilidades',
];

export default function Header() {
  const { quantidade, total, abrir } = useCarrinho();
  const { quantidade: favoritos } = useFavoritos();
  const navegar = useNavigate();
  const [params] = useSearchParams();

  // O campo espelha o ?q= da URL: recarregar ou voltar mantém o que foi buscado.
  const [termo, setTermo] = useState(params.get('q') || '');
  useEffect(() => { setTermo(params.get('q') || ''); }, [params]);

  function buscar(e) {
    e.preventDefault();
    const limpo = termo.trim();
    navegar(limpo ? `/busca?q=${encodeURIComponent(limpo)}` : '/busca?cat=todas');
  }

  const linkCategoria = (nome) => `/busca?cat=${encodeURIComponent(nome)}`;

  return (
    <header id="top">
      <div className="wrap head-main">
        <Link className="brand" to="/" aria-label="Achadinhos, página inicial">
          {/* LOGO PLACEHOLDER: troque este SVG pela sua logo */}
          <svg className="mark" width="34" height="34" viewBox="0 0 40 40" fill="none" aria-hidden="true">
            <rect x="2" y="2" width="36" height="36" rx="10" fill="var(--primary)" />
            <path d="M21 9L13 22h6l-2 9 10-14h-7z" fill="#fff" />
          </svg>
          <span>Achad<em>inhos</em></span>
        </Link>

        <form className="search" role="search" onSubmit={buscar}>
          <input
            type="search"
            placeholder="Busque por TV, air fryer, celular, ventilador…"
            aria-label="Buscar produtos"
            value={termo}
            onChange={(e) => setTermo(e.target.value)}
          />
          <button type="submit" aria-label="Buscar">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>
          </button>
        </form>

        <div className="head-actions">
          {/* Login ainda depende de back-end (cadastro/sessão): segue como placeholder. */}
          <a className="icon-btn" href="#" aria-label="Minha conta (em breve)">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4" /><path d="M4 21v-1a6 6 0 016-6h4a6 6 0 016 6v1" /></svg>
            <span className="col"><small>Olá, entre</small><strong>Minha conta</strong></span>
          </a>
          <Link className="icon-btn" to="/favoritos" aria-label="Meus favoritos">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.8 5.6a5 5 0 00-7 0l-.8.8-.8-.8a5 5 0 00-7 7l7.8 7.9a1 1 0 001.4 0l7.8-7.9a5 5 0 000-7z" /></svg>
            {favoritos > 0 && <span className="cart-badge">{favoritos}</span>}
            <span className="col"><small>Meus</small><strong>Favoritos</strong></span>
          </Link>
          <button className="icon-btn" type="button" aria-label="Abrir carrinho" onClick={abrir}>
            <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="20" r="1.6" /><circle cx="18" cy="20" r="1.6" /><path d="M2 3h3l2.5 13h11l2-9H6" /></svg>
            {quantidade > 0 && <span className="cart-badge">{quantidade}</span>}
            <span className="col"><small>{formatarBRL(total)}</small><strong>Carrinho</strong></span>
          </button>
        </div>
      </div>

      <div className="catbar">
        <div className="wrap">
          <ul>
            <li>
              <NavLink className="all" to="/busca?cat=todas">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
                Todas as categorias
              </NavLink>
            </li>
            <li><Link to="/#ofertas">Ofertas do dia</Link></li>
            {CATEGORIAS.map((nome) => (
              <li key={nome}><Link to={linkCategoria(nome)}>{nome}</Link></li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  );
}
