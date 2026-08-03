// VIEW · Checkout em etapas (endereço → frete → pagamento/resumo → pedido).
import { Link } from 'react-router-dom';
import { useCarrinho } from '../../controllers/CarrinhoContext.jsx';
import { useCheckout } from '../../controllers/useCheckout.js';
import { formatarBRL } from '../../util/formato.js';

const ETAPAS = ['Endereço', 'Frete', 'Pagamento'];

export default function CheckoutPage() {
  const carrinho = useCarrinho();
  const ck = useCheckout(carrinho);

  // 1) Pedido concluído
  if (ck.pedido) {
    return (
      <main className="wrap checkout">
        <div className="pedido-ok">
          <div className="pedido-ok-ico">
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
          </div>
          <h1>Pedido confirmado!</h1>
          <p>Seu pedido <strong>{ck.pedido.numero}</strong> foi recebido. Enviaremos os detalhes por e-mail.</p>
          {ck.pedido.simulado && (
            <p className="pedido-sim">Modo demonstração: o back-end ainda não tem a rota <code>/pedidos</code>, então o pedido foi simulado (nada foi cobrado).</p>
          )}
          <Link className="btn btn-primary btn-lg" to="/">Voltar para a loja</Link>
        </div>
      </main>
    );
  }

  // 2) Carrinho vazio
  if (!carrinho.itens.length) {
    return (
      <main className="wrap checkout">
        <div className="pdp-erro">
          <b>Seu carrinho está vazio</b>
          <span>Adicione produtos antes de finalizar a compra.</span>
          <Link className="btn btn-primary" to="/">Ver produtos</Link>
        </div>
      </main>
    );
  }

  const campo = (k) => (e) => ck.setEndereco((prev) => ({ ...prev, [k]: e.target.value }));

  return (
    <main className="wrap checkout">
      <h1 className="checkout-titulo">Finalizar compra</h1>

      <ol className="steps">
        {ETAPAS.map((nome, i) => {
          const n = i + 1;
          const estado = ck.etapa === n ? 'ativo' : ck.etapa > n ? 'feito' : '';
          return (
            <li key={nome} className={`step ${estado}`}>
              <span className="step-n">{ck.etapa > n ? '✓' : n}</span>{nome}
            </li>
          );
        })}
      </ol>

      <div className="checkout-grid">
        <div className="checkout-main">
          {/* ETAPA 1 — ENDEREÇO */}
          {ck.etapa === 1 && (
            <section className="ck-card">
              <h2>Endereço de entrega</h2>
              <div className="form-grid">
                <label className="campo campo-2"><span>Nome completo</span><input value={ck.endereco.nome} onChange={campo('nome')} placeholder="Seu nome" /></label>
                <label className="campo"><span>CEP</span><input value={ck.endereco.cep} onChange={campo('cep')} placeholder="00000-000" inputMode="numeric" /></label>
                <label className="campo"><span>Cidade</span><input value={ck.endereco.cidade} onChange={campo('cidade')} placeholder="Sua cidade" /></label>
                <label className="campo campo-2"><span>Rua / Logradouro</span><input value={ck.endereco.rua} onChange={campo('rua')} placeholder="Rua, avenida…" /></label>
                <label className="campo"><span>Número</span><input value={ck.endereco.numero} onChange={campo('numero')} placeholder="123" /></label>
                <label className="campo"><span>Bairro</span><input value={ck.endereco.bairro} onChange={campo('bairro')} placeholder="Bairro" /></label>
                <label className="campo"><span>UF</span><input value={ck.endereco.uf} onChange={campo('uf')} placeholder="SP" maxLength={2} /></label>
              </div>
              <div className="ck-acoes">
                <Link className="btn btn-ghost" to="/">Voltar à loja</Link>
                <button className="btn btn-primary" type="button" disabled={!ck.enderecoValido} onClick={ck.avancarEndereco}>Continuar para o frete</button>
              </div>
              {!ck.enderecoValido && <p className="ck-aviso">Preencha nome, CEP, rua, número, cidade e UF para continuar.</p>}
            </section>
          )}

          {/* ETAPA 2 — FRETE */}
          {ck.etapa === 2 && (
            <section className="ck-card">
              <h2>Escolha o frete</h2>
              <div className="fretes">
                {ck.fretes.map((f) => (
                  <button key={f.id} type="button" className={`frete-opt${ck.frete && ck.frete.id === f.id ? ' sel' : ''}`} onClick={() => ck.escolherFrete(f)}>
                    <span className="frete-nome">{f.nome}</span>
                    <span className="frete-prazo">{f.prazo}</span>
                    <span className="frete-valor tnum">{f.valor === 0 ? 'Grátis' : formatarBRL(f.valor)}</span>
                  </button>
                ))}
              </div>
              <div className="ck-acoes">
                <button className="btn btn-ghost" type="button" onClick={() => ck.irPara(1)}>Voltar</button>
              </div>
            </section>
          )}

          {/* ETAPA 3 — PAGAMENTO / RESUMO */}
          {ck.etapa === 3 && (
            <section className="ck-card">
              <h2>Pagamento</h2>
              <div className="pgto">
                {[['pix', 'Pix', '10% de desconto, aprovação na hora'], ['cartao', 'Cartão de crédito', 'em até 12x sem juros'], ['boleto', 'Boleto bancário', 'compensa em 1-2 dias úteis']].map(([id, nome, obs]) => (
                  <label key={id} className={`pgto-opt${ck.pagamento === id ? ' sel' : ''}`}>
                    <input type="radio" name="pagamento" value={id} checked={ck.pagamento === id} onChange={() => ck.setPagamento(id)} />
                    <span><b>{nome}</b><small>{obs}</small></span>
                  </label>
                ))}
              </div>

              <div className="ck-entrega">
                <h3>Entrega</h3>
                <p>{ck.endereco.nome} · {ck.endereco.rua}, {ck.endereco.numero} — {ck.endereco.cidade}/{ck.endereco.uf}</p>
                <p>{ck.frete?.nome} · {ck.frete?.prazo} · {ck.frete && ck.frete.valor === 0 ? 'Grátis' : formatarBRL(ck.frete?.valor)}</p>
              </div>

              <div className="ck-acoes">
                <button className="btn btn-ghost" type="button" onClick={() => ck.irPara(2)}>Voltar</button>
                <button className="btn btn-primary btn-lg" type="button" disabled={ck.enviando} onClick={ck.finalizar}>
                  {ck.enviando ? 'Processando…' : `Finalizar pedido · ${formatarBRL(ck.totalFinal)}`}
                </button>
              </div>
            </section>
          )}
        </div>

        {/* RESUMO DO PEDIDO */}
        <aside className="checkout-resumo">
          <h2>Resumo</h2>
          <ul className="resumo-itens">
            {carrinho.itens.map((i) => (
              <li key={i.id}>
                <span className="resumo-q">{i.qtd}×</span>
                <span className="resumo-nome">{i.nome}</span>
                <span className="resumo-val tnum">{formatarBRL((i.preco || 0) * i.qtd)}</span>
              </li>
            ))}
          </ul>
          <div className="resumo-linha"><span>Subtotal</span><span className="tnum">{formatarBRL(carrinho.total)}</span></div>
          <div className="resumo-linha"><span>Frete</span><span className="tnum">{ck.frete ? (ck.frete.valor === 0 ? 'Grátis' : formatarBRL(ck.frete.valor)) : '—'}</span></div>
          <div className="resumo-total"><span>Total</span><strong className="tnum">{formatarBRL(ck.totalFinal)}</strong></div>
        </aside>
      </div>
    </main>
  );
}
