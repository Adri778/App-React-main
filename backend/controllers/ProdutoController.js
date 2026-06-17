const Produto = require('../models/Produto');

// Aceita só os campos conhecidos do produto, ignorando qualquer extra
// que o cliente envie (evita mass assignment).
function lerEntrada(corpo) {
  return {
    name: corpo.name,
    price: corpo.price,
    category: corpo.category,
    description: corpo.description,
    image: corpo.image,
    originalPrice: corpo.originalPrice,
    isPromo: corpo.isPromo,
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
