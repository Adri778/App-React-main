const Pedido = require('../models/Pedido');

// Mesmas regras da loja, mas aqui elas são a autoridade: o cliente manda os
// totais no corpo e o servidor os ignora e recalcula. Sem isso, bastaria um
// POST editado para fechar um pedido de R$ 1.999 por R$ 0,01.
const FRETES = {
  gratis: { nome: 'Frete grátis', prazo: '6 a 10 dias úteis', valor: 0, subtotalMinimo: 199 },
  pac: { nome: 'Padrão (PAC)', prazo: '5 a 8 dias úteis', valor: 19.9, subtotalMinimo: 0 },
  sedex: { nome: 'Expresso (SEDEX)', prazo: '2 a 3 dias úteis', valor: 34.9, subtotalMinimo: 0 },
};
const CUPONS = { ACHEI50: { valor: 50, minimo: 399 } };
const PIX_DESCONTO = 0.10;
const PAGAMENTOS = ['pix', 'cartao', 'boleto'];

const arredondar = (n) => Math.round(n * 100) / 100;
const numeroDe = (id) => 'ACH-' + String(id).padStart(6, '0');

const PedidoController = {
  criar: async (req, res) => {
    try {
      const { endereco = {}, frete = {}, pagamento, itens = [], cupom } = req.body;

      if (!Array.isArray(itens) || !itens.length) {
        return res.status(400).json({ erro: 'O pedido não tem itens' });
      }
      const faltando = ['nome', 'cep', 'rua', 'numero', 'cidade', 'uf'].filter((c) => !endereco[c]);
      if (faltando.length) {
        return res.status(400).json({ erro: `Endereço incompleto: ${faltando.join(', ')}` });
      }
      if (!PAGAMENTOS.includes(pagamento)) {
        return res.status(400).json({ erro: 'Forma de pagamento inválida' });
      }
      const opcaoFrete = FRETES[frete.id];
      if (!opcaoFrete) {
        return res.status(400).json({ erro: 'Opção de frete inválida' });
      }

      // Nome e preço saem do banco; do cliente só aproveitamos id e quantidade.
      const precos = await Pedido.buscarPrecos(itens.map((i) => Number(i.id)));
      const linhas = [];
      for (const item of itens) {
        const produto = precos.get(Number(item.id));
        if (!produto) return res.status(400).json({ erro: `Produto ${item.id} não existe` });
        linhas.push({
          produto_id: produto.id,
          nome: produto.nome,
          preco_unitario: Number(produto.preco),
          quantidade: Math.max(1, Number(item.qtd) || 1),
        });
      }

      const subtotal = arredondar(linhas.reduce((s, l) => s + l.preco_unitario * l.quantidade, 0));
      if (subtotal < opcaoFrete.subtotalMinimo) {
        return res.status(400).json({ erro: `${opcaoFrete.nome} exige subtotal de R$ ${opcaoFrete.subtotalMinimo}` });
      }

      const regra = cupom ? CUPONS[String(cupom).toUpperCase()] : null;
      const descontoCupom = regra && subtotal >= regra.minimo ? Math.min(regra.valor, subtotal) : 0;
      const descontoPix = pagamento === 'pix' ? arredondar((subtotal - descontoCupom) * PIX_DESCONTO) : 0;
      const total = arredondar(subtotal - descontoCupom - descontoPix + opcaoFrete.valor);

      const id = await Pedido.criar({
        cliente_nome: endereco.nome,
        cep: endereco.cep,
        rua: endereco.rua,
        endereco_numero: endereco.numero,
        bairro: endereco.bairro || '',
        cidade: endereco.cidade,
        uf: String(endereco.uf).toUpperCase().slice(0, 2),
        frete_nome: opcaoFrete.nome,
        frete_prazo: opcaoFrete.prazo,
        frete_valor: opcaoFrete.valor,
        forma_pagamento: pagamento,
        cupom: descontoCupom > 0 ? String(cupom).toUpperCase() : null,
        subtotal,
        desconto_cupom: descontoCupom,
        desconto_pix: descontoPix,
        total,
      }, linhas);

      res.status(201).json({
        id,
        numero: numeroDe(id),
        subtotal,
        descontoCupom,
        descontoPix,
        frete: opcaoFrete.valor,
        total,
      });
    } catch (erro) {
      console.error('[pedidos] erro ao criar:', erro.message);
      res.status(500).json({ erro: 'Erro ao criar pedido' });
    }
  },

  listar: async (req, res) => {
    try {
      const pedidos = await Pedido.listar();
      res.json(pedidos.map((p) => ({ ...p, numero: numeroDe(p.id) })));
    } catch {
      res.status(500).json({ erro: 'Erro ao listar pedidos' });
    }
  },

  buscar: async (req, res) => {
    try {
      const pedido = await Pedido.buscar(req.params.id);
      if (!pedido) return res.status(404).json({ erro: 'Pedido não encontrado' });
      res.json({ ...pedido, numero: numeroDe(pedido.id) });
    } catch {
      res.status(500).json({ erro: 'Erro ao buscar pedido' });
    }
  },
};

module.exports = PedidoController;
