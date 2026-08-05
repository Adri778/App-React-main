// VIEW · 404 — endereço que não existe na loja.
import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function NaoEncontradaPage() {
  const { pathname } = useLocation();

  useEffect(() => { document.title = 'Página não encontrada · Achadinhos'; }, []);

  return (
    <main className="wrap nf-wrap">
      <div className="nf">
        <div className="nf-code" aria-hidden="true">404</div>
        <h1>Essa página saiu do ar</h1>
        <p>
          Não encontramos nada em <code className="nf-path">{pathname}</code>.
          O endereço pode ter mudado ou o produto pode ter esgotado.
        </p>
        <div className="nf-acoes">
          <Link className="btn btn-primary btn-lg" to="/">Voltar para a loja</Link>
          <Link className="btn btn-ghost btn-lg" to="/busca?cat=todas">Ver todos os produtos</Link>
        </div>
        <div className="nf-atalhos">
          <span>Ou procure por:</span>
          <Link to="/busca?cat=Cozinha">Cozinha</Link>
          <Link to="/busca?cat=Celulares">Celulares</Link>
          <Link to="/busca?cat=%C3%81udio">Áudio</Link>
          <Link to="/busca?cat=TV%20%26%20V%C3%ADdeo">TV &amp; Vídeo</Link>
        </div>
      </div>
    </main>
  );
}
