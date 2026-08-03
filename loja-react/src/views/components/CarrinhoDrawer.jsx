// VIEW · Drawer do carrinho (gaveta lateral).
import { useNavigate } from 'react-router-dom';
import { useCarrinho } from '../../controllers/CarrinhoContext.jsx';
import { formatarBRL } from '../../util/formato.js';
import ProdutoIcone from './ProdutoIcone.jsx';

export default function CarrinhoDrawer() {
  const { itens, alterarQtd, remover, total, aberto, fechar } = useCarrinho();
  const navegar = useNavigate();

  const irCheckout = () => { fechar(); navegar('/checkout'); };

  return (
    <>
      <div className={`cart-overlay${aberto ? ' show' : ''}`} onClick={fechar} />
      <aside className={`cart-drawer${aberto ? ' open' : ''}`} aria-hidden={!aberto} aria-label="Carrinho de compras">
        <div className="cart-head">
          <h2>Seu carrinho</h2>
          <button className="cart-close" type="button" aria-label="Fechar carrinho" onClick={fechar}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </div>

        <div className="cart-body">
          {itens.length === 0 ? (
            <div className="cart-empty">
              <svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="20" r="1.6" /><circle cx="18" cy="20" r="1.6" /><path d="M2 3h3l2.5 13h11l2-9H6" /></svg>
              <b>Seu carrinho está vazio</b>
              <span>Adicione produtos para vê-los aqui.</span>
            </div>
          ) : (
            itens.map((i) => (
              <div className="cart-item" key={i.id}>
                <div className="cart-thumb"><ProdutoIcone produto={i} className="cart-art" /></div>
                <div className="cart-info">
                  <p className="cart-name">{i.nome}</p>
                  <p className="cart-unit tnum">{formatarBRL(i.preco)}</p>
                  <div className="cart-qty">
                    <button type="button" aria-label="Diminuir" onClick={() => alterarQtd(i.id, i.qtd - 1)}>−</button>
                    <span className="tnum">{i.qtd}</span>
                    <button type="button" aria-label="Aumentar" onClick={() => alterarQtd(i.id, i.qtd + 1)}>+</button>
                    <button type="button" className="cart-remove" onClick={() => remover(i.id)}>Remover</button>
                  </div>
                </div>
                <div className="cart-line tnum">{formatarBRL((i.preco || 0) * i.qtd)}</div>
              </div>
            ))
          )}
        </div>

        {itens.length > 0 && (
          <div className="cart-foot">
            <div className="cart-sub"><span>Subtotal</span><strong className="tnum">{formatarBRL(total)}</strong></div>
            <p className="cart-fine">Frete e cupom calculados no checkout.</p>
            <button className="btn btn-primary btn-block" type="button" onClick={irCheckout}>Ir para o pagamento</button>
            <button className="btn btn-ghost btn-block" type="button" onClick={fechar}>Continuar comprando</button>
          </div>
        )}
      </aside>
    </>
  );
}
