// VIEW · Rodapé institucional.
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="foot-grid">
          <div className="foot-brand">
            <Link className="brand" to="/">
              <svg className="mark" width="30" height="30" viewBox="0 0 40 40" fill="none" aria-hidden="true">
                <rect x="2" y="2" width="36" height="36" rx="10" fill="var(--primary)" />
                <path d="M21 9L13 22h6l-2 9 10-14h-7z" fill="#fff" />
              </svg>
              <span>Achad<em>inhos</em></span>
            </Link>
            <p>Eletrodomésticos, eletrônicos e utilidades para o dia a dia da sua casa — com preço de achadinho.</p>
            <span className="foot-note">◆ Logo provisória — troque quando definir a sua</span>
          </div>
          <div className="foot-col">
            <h4>Comprar</h4>
            <a href="#ofertas">Ofertas do dia</a>
            <Link to="/">Eletrodomésticos</Link>
            <Link to="/">Celulares</Link>
            <a href="#casa">Casa Inteligente</a>
            <Link to="/">Utilidades</Link>
          </div>
          <div className="foot-col">
            <h4>Ajuda</h4>
            <a href="#">Meus pedidos</a>
            <a href="#">Entregas e prazos</a>
            <a href="#">Trocas e devoluções</a>
            <a href="#">Central de atendimento</a>
            <a href="#">Perguntas frequentes</a>
          </div>
          <div className="foot-col">
            <h4>Institucional</h4>
            <a href="#">Sobre a Achadinhos</a>
            <a href="#">Trabalhe conosco</a>
            <a href="#">Política de privacidade</a>
            <a href="#">Termos de uso</a>
            <div className="pay" style={{ marginTop: 14 }}>
              <span>PIX</span><span>VISA</span><span>MASTER</span><span>ELO</span><span>BOLETO</span>
            </div>
          </div>
        </div>
        <div className="foot-bottom">
          <span>© 2026 Achadinhos · CNPJ 00.000.000/0001-00 · Preços e condições válidos para o site.</span>
          <div className="socials">
            <a href="#" aria-label="Instagram"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg></a>
            <a href="#" aria-label="TikTok"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M16 3c.3 2.3 1.8 4 4 4.3V11c-1.6 0-3-.5-4-1.3V16a6 6 0 11-6-6c.3 0 .7 0 1 .1v3.2A3 3 0 1013 16V3z" /></svg></a>
            <a href="#" aria-label="YouTube"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23 12s0-3.2-.4-4.7a2.5 2.5 0 00-1.7-1.8C19.2 5 12 5 12 5s-7.2 0-8.9.5A2.5 2.5 0 001.4 7.3C1 8.8 1 12 1 12s0 3.2.4 4.7a2.5 2.5 0 001.7 1.8C4.8 19 12 19 12 19s7.2 0 8.9-.5a2.5 2.5 0 001.7-1.8C23 15.2 23 12 23 12zM10 15.5v-7l6 3.5z" /></svg></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
