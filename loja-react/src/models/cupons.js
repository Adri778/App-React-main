// =============================================================================
// MODEL · Cupons de desconto e descontos por forma de pagamento.
// Regras puras, sem UI — a mesma fonte de verdade que a home anuncia.
// =============================================================================

// Percentual de desconto do Pix. A loja anuncia 10% na barra de avisos, no card
// de cada produto e na PDP — aqui é onde ele vira dinheiro de verdade.
export const PIX_DESCONTO = 0.10;

// Catálogo de cupons. `minimo` é o subtotal mínimo para o cupom valer.
export const CUPONS = {
  ACHEI50: { tipo: 'valor', valor: 50, minimo: 399, descricao: 'R$ 50 de desconto em pedidos acima de R$ 399' },
};

// Normaliza o que o cliente digitou: "  achei50 " -> "ACHEI50".
export function normalizarCodigo(codigo) {
  return String(codigo ?? '').trim().toUpperCase();
}

// Valida um cupom contra o subtotal. Devolve sempre o mesmo formato:
//   { ok: true,  codigo, desconto, descricao }
//   { ok: false, erro }
export function validarCupom(codigo, subtotal) {
  const chave = normalizarCodigo(codigo);
  if (!chave) return { ok: false, erro: 'Digite um código de cupom.' };

  const cupom = CUPONS[chave];
  if (!cupom) return { ok: false, erro: `O cupom ${chave} não existe ou expirou.` };

  if (subtotal < cupom.minimo) {
    const falta = cupom.minimo - subtotal;
    return {
      ok: false,
      erro: `O cupom ${chave} vale a partir de R$ ${cupom.minimo.toFixed(2).replace('.', ',')}. Faltam R$ ${falta.toFixed(2).replace('.', ',')}.`,
    };
  }

  const desconto = cupom.tipo === 'percentual'
    ? subtotal * cupom.valor
    : Math.min(cupom.valor, subtotal); // nunca desconta mais que o próprio subtotal

  return { ok: true, codigo: chave, desconto, descricao: cupom.descricao };
}

// Desconto do Pix, aplicado sobre o subtotal já com o cupom abatido
// (o frete nunca entra no cálculo do desconto).
export function descontoPagamento(base, formaPagamento) {
  return formaPagamento === 'pix' ? base * PIX_DESCONTO : 0;
}

// Fecha a conta do pedido inteiro, na ordem: cupom -> Pix -> frete.
export function totalizarPedido({ subtotal = 0, cupom = null, formaPagamento = 'pix', frete = 0 }) {
  const descontoCupom = cupom && cupom.ok ? Math.min(cupom.desconto, subtotal) : 0;
  const aposCupom = subtotal - descontoCupom;
  const descontoPix = descontoPagamento(aposCupom, formaPagamento);
  const total = aposCupom - descontoPix + frete;
  return {
    subtotal,
    descontoCupom,
    descontoPix,
    frete,
    total: Math.max(0, total),
    economia: descontoCupom + descontoPix,
  };
}
