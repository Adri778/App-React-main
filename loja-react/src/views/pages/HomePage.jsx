// VIEW · Página inicial (home) — vitrines de ofertas e mais vendidos.
import { Link } from 'react-router-dom';
import { useProdutos } from '../../controllers/useProdutos.js';
import VitrineGrade from '../components/VitrineGrade.jsx';
import Contador from '../components/Contador.jsx';

export default function HomePage() {
  const { carregando, ofertas, maisVendidos, usandoDemo } = useProdutos();

  return (
    <>
      {/* ANNOUNCE */}
      <div className="announce">
        <div className="wrap">
          <svg width="15" height="15" viewBox="0 0 64 64"><use href="#s-bolt" /></svg>
          <span><b>Semana do Eletro</b> — até 40% OFF · Frete grátis acima de R$ 199 · 10% no Pix</span>
        </div>
      </div>

      {/* HERO */}
      <section className="hero">
        <div className="wrap hero-grid">
          <div className="hero-main">
            <span className="badge"><svg width="13" height="13" viewBox="0 0 64 64"><use href="#s-bolt" /></svg> Ofertas relâmpago</span>
            <h1>A casa toda equipada por <span>menos</span></h1>
            <p>Eletrodomésticos, eletrônicos e utilidades com até 40% OFF. Parcele em até 12x e receba rapidinho.</p>
            <div className="actions">
              <a className="btn btn-lg btn-ghost" href="#ofertas">Ver ofertas do dia</a>
              <a className="btn btn-lg btn-deal" href="#ofertas">Aproveitar 10% no Pix</a>
            </div>
            <div className="hero-art"><svg viewBox="0 0 64 64"><use href="#s-tv" /></svg></div>
          </div>
          <div className="hero-side">
            <div className="promo-card">
              <div><h3>Cozinha esperta</h3><p>Air fryer, liquidificador e cafeteira em conta.</p></div>
              <a className="go" href="#ofertas">Ver cozinha <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg></a>
              <svg className="pico" viewBox="0 0 64 64"><use href="#s-airfryer" /></svg>
            </div>
            <div className="promo-card amber">
              <div><h3>Troca de celular</h3><p>Smartphones com desconto e frete grátis.</p></div>
              <a className="go" href="#ofertas">Ver celulares <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg></a>
              <svg className="pico" viewBox="0 0 64 64"><use href="#s-phone" /></svg>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIAS + BENEFÍCIOS */}
      <section className="cats">
        <div className="wrap">
          <div className="cats-grid">
            {[
              ['s-fridge', 'Eletrodomésticos'], ['s-tv', 'TV & Vídeo'], ['s-phone', 'Celulares'],
              ['s-blender', 'Cozinha'], ['s-house', 'Casa Inteligente'], ['s-headphones', 'Áudio'],
              ['s-fan', 'Climatização'], ['s-tools', 'Utilidades'],
            ].map(([icone, nome]) => (
              <Link className="cat-tile" to="/" key={nome}>
                <span className="ci"><svg width="26" height="26" viewBox="0 0 64 64"><use href={`#${icone}`} /></svg></span>
                <span>{nome}</span>
              </Link>
            ))}
          </div>

          <div className="benefits">
            <div className="benefit"><span className="bi"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="6" width="14" height="11" rx="1.5" /><path d="M15 9h4l3 3v5h-7" /><circle cx="6" cy="18" r="2" /><circle cx="18" cy="18" r="2" /></svg></span><div><b>Frete grátis</b><span>acima de R$ 199</span></div></div>
            <div className="benefit"><span className="bi"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" /></svg></span><div><b>Até 12x</b><span>sem juros</span></div></div>
            <div className="benefit"><span className="bi"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 019-9 9 9 0 018 5" /><path d="M20 3v5h-5" /><path d="M21 12a9 9 0 01-9 9 9 9 0 01-8-5" /><path d="M4 21v-5h5" /></svg></span><div><b>Troca fácil</b><span>em até 7 dias</span></div></div>
            <div className="benefit"><span className="bi"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" /><path d="M9 12l2 2 4-4" /></svg></span><div><b>Compra segura</b><span>pagamento protegido</span></div></div>
          </div>
        </div>
      </section>

      {/* OFERTAS DO DIA */}
      <section className="sec" id="ofertas">
        <div className="wrap">
          <div className="sec-top">
            <div>
              <p className="kicker">Só hoje</p>
              <h2>Ofertas do dia</h2>
              <p className="sub">Preços que caem quando o estoque acaba. Corre que voa.</p>
            </div>
            <div className="sec-tail">
              {usandoDemo && <span className="demo-note show">demonstração · API offline</span>}
              <Contador />
            </div>
          </div>
          <VitrineGrade carregando={carregando} itens={ofertas} skeletons={8} />
        </div>
      </section>

      {/* BANNER CASA INTELIGENTE */}
      <section className="sec" id="casa">
        <div className="wrap">
          <div className="fbanner">
            <p className="kicker">Casa Inteligente</p>
            <h2>Sua casa conectada, do jeito fácil</h2>
            <p>Lâmpadas, câmeras, tomadas e assistentes que você controla pelo celular. Instalação simples, sem obra.</p>
            <a className="btn btn-lg" href="#ofertas">Explorar casa inteligente</a>
            <div className="fart"><svg viewBox="0 0 64 64"><use href="#s-house" /></svg></div>
          </div>
        </div>
      </section>

      {/* MAIS VENDIDOS */}
      <section className="sec">
        <div className="wrap">
          <div className="sec-top">
            <div>
              <p className="kicker">Preferidos da galera</p>
              <h2>Mais vendidos da semana</h2>
            </div>
            <div className="sec-tail">
              {usandoDemo && <span className="demo-note show">demonstração · API offline</span>}
              <a className="sec-link" href="#ofertas">Ver tudo <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg></a>
            </div>
          </div>
          <VitrineGrade carregando={carregando} itens={maisVendidos} skeletons={4} />
        </div>
      </section>

      {/* CUPOM + NEWSLETTER */}
      <section className="cnrow">
        <div className="wrap">
          <div className="panel coupon">
            <div className="disc"><div className="v">R$50</div><div className="l">de desconto</div></div>
            <div>
              <h3>Primeira compra? Ganha R$ 50</h3>
              <p>Use o cupom abaixo em pedidos acima de R$ 399. Válido em toda a loja.</p>
              <span className="code"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M4 7v10M20 7v10M8 5h8l4 4v6l-4 4H8l-4-4V9z" /></svg>ACHEI50</span>
            </div>
          </div>
          <div className="panel news">
            <h3>Receba as ofertas antes de todo mundo</h3>
            <p>Cadastre seu e-mail e não perca os preços da Semana do Eletro.</p>
            <form onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="seu@email.com" aria-label="Seu e-mail" />
              <button className="btn btn-deal" type="submit">Quero ofertas</button>
            </form>
            <p className="fine">Sem spam. Você cancela quando quiser.</p>
          </div>
        </div>
      </section>
    </>
  );
}
