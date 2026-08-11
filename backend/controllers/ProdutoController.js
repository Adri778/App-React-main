const Produto = require('../models/Produto');

// Aceita só os campos conhecidos do produto, ignorando qualquer extra
// que o cliente envie (evita mass assignment). As chaves de saída são as
// colunas reais da tabela (português); a entrada aceita os dois idiomas
// porque o app de estoque manda em português e o site mandava em inglês.
function lerEntrada(corpo) {
  return {
    nome: corpo.nome ?? corpo.name,
    preco: corpo.preco ?? corpo.price,
    categoria: corpo.categoria ?? corpo.category ?? '',
    descricao: corpo.descricao ?? corpo.description ?? '',
    imagem: corpo.imagem ?? corpo.image ?? '',
    preco_original: corpo.preco_original ?? corpo.originalPrice ?? null,
    is_promo: Number(corpo.is_promo ?? corpo.isPromo ?? 0),
    frete_gratis: Number(corpo.frete_gratis ?? corpo.freeShipping ?? 0),
    avaliacao: corpo.avaliacao ?? corpo.rating ?? null,
    vendidos: Number(corpo.vendidos ?? corpo.sold ?? 0),
    quantidade: Number(corpo.quantidade ?? 0),
    estoque_minimo: Number(corpo.estoque_minimo ?? corpo.estoqueMinimo ?? 0),
  };
}

const ProdutoController = {
  listar: (req, res) => {
    Produto.listar((erro, resultado) => {
      if (erro) return res.status(500).json({ erro: 'Erro ao listar produtos' });
      res.json(resultado);
    });
  },

  buscar: (req, res) => {
    Produto.buscar(req.params.id, (erro, resultado) => {
      if (erro) return res.status(500).json({ erro: 'Erro ao buscar produto' });
      if (!resultado.length) return res.status(404).json({ erro: 'Produto não encontrado' });
      res.json(resultado[0]);
    });
  },

  criar: (req, res) => {
    const dados = lerEntrada(req.body);
    if (!dados.nome || dados.preco == null) {
      return res.status(400).json({ erro: 'nome e preco são obrigatórios' });
    }
    Produto.criar(dados, (erro, resultado) => {
      if (erro) return res.status(500).json({ erro: 'Erro ao criar produto' });
      res.status(201).json({ id: resultado.insertId, ...dados });
    });
  },

  estoquesBaixos: (req, res) => {
    Produto.estoquesBaixos((erro, resultado) => {
      if (erro) return res.status(500).json({ erro: 'Erro ao buscar estoques baixos' });
      res.json(resultado);
    });
  },
};

module.exports = ProdutoController;
