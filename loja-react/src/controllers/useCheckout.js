// =============================================================================
// CONTROLLER · useCheckout — orquestra o fluxo de checkout em etapas.
// Etapas: 1) endereço  2) frete  3) pagamento/resumo  -> cria o pedido.
// =============================================================================

import { useState, useMemo } from 'react';
import { criarPedido } from '../models/PedidoService.js';
import { validarCupom, totalizarPedido } from '../models/cupons.js';

// Opções de frete (simuladas). Frete grátis quando o subtotal atinge o limite.
export function opcoesFrete(subtotal) {
  const opcoes = [
    { id: 'pac', nome: 'Padrão (PAC)', valor: 19.9, prazo: '5 a 8 dias úteis' },
    { id: 'sedex', nome: 'Expresso (SEDEX)', valor: 34.9, prazo: '2 a 3 dias úteis' },
  ];
  if (subtotal >= 199) {
    opcoes.unshift({ id: 'gratis', nome: 'Frete grátis', valor: 0, prazo: '6 a 10 dias úteis' });
  }
  return opcoes;
}

const ENDERECO_VAZIO = { nome: '', cep: '', rua: '', numero: '', bairro: '', cidade: '', uf: '' };

export function useCheckout(carrinho) {
  const [etapa, setEtapa] = useState(1);
  const [endereco, setEndereco] = useState(ENDERECO_VAZIO);
  const [frete, setFrete] = useState(null);
  const [pagamento, setPagamento] = useState('pix');
  const [enviando, setEnviando] = useState(false);
  const [pedido, setPedido] = useState(null);

  // Cupom: o que o cliente digitou e o resultado da validação já aplicada.
  const [codigoCupom, setCodigoCupom] = useState('');
  const [cupom, setCupom] = useState(null);

  const fretes = useMemo(() => opcoesFrete(carrinho.total), [carrinho.total]);

  // Uma única fonte de verdade para a conta do pedido (cupom -> Pix -> frete).
  const conta = useMemo(
    () => totalizarPedido({
      subtotal: carrinho.total,
      cupom,
      formaPagamento: pagamento,
      frete: frete ? frete.valor : 0,
    }),
    [carrinho.total, cupom, pagamento, frete],
  );

  function aplicarCupom() {
    const resultado = validarCupom(codigoCupom, carrinho.total);
    setCupom(resultado);
    return resultado;
  }

  function removerCupom() {
    setCupom(null);
    setCodigoCupom('');
  }

  const enderecoValido =
    endereco.nome && endereco.cep && endereco.rua && endereco.numero && endereco.cidade && endereco.uf;

  function irPara(n) { setEtapa(n); }
  function avancarEndereco() { if (enderecoValido) setEtapa(2); }
  function escolherFrete(f) { setFrete(f); setEtapa(3); }

  async function finalizar() {
    if (!frete || !carrinho.itens.length) return;
    setEnviando(true);
    const resultado = await criarPedido({
      endereco, frete, pagamento,
      itens: carrinho.itens,
      cupom: cupom && cupom.ok ? cupom.codigo : null,
      subtotal: conta.subtotal,
      descontoCupom: conta.descontoCupom,
      descontoPix: conta.descontoPix,
      total: conta.total,
    });
    setEnviando(false);
    if (resultado.ok) {
      setPedido({ ...resultado, economia: conta.economia });
      carrinho.limpar();
    }
  }

  return {
    etapa, irPara,
    endereco, setEndereco, enderecoValido, avancarEndereco,
    fretes, frete, escolherFrete,
    pagamento, setPagamento,
    codigoCupom, setCodigoCupom, cupom, aplicarCupom, removerCupom,
    conta, totalFinal: conta.total,
    enviando, pedido, finalizar,
  };
}
