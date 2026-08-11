const express = require('express');
const cors = require('cors');
const Produto = require('./models/Produto');

const produtoRoutes = require('./routes/produtoRoutes');
const pedidoRoutes = require('./routes/pedidoRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Tudo sob /api — é o prefixo que a loja, a loja-react e o app React Native
// já chamam (ver servicos/api.jsx no histórico do git).
app.use('/api/produtos', produtoRoutes);
app.use('/api/pedidos', pedidoRoutes);

app.get('/api/resumo', (req, res) => {
  Produto.contagem((e1, rProdutos) => {
    if (e1) return res.status(500).json({ erro: 'Erro ao buscar resumo' });
    Produto.contagemEstoqueBaixo((e3, rEstoque) => {
      if (e3) return res.status(500).json({ erro: 'Erro ao buscar resumo' });
      res.json({
        produtos: rProdutos[0].total,
        estoqueBaixo: rEstoque[0].total,
      });
    });
  });
});

// Rota desconhecida responde JSON, não a página HTML de erro do Express.
app.use((req, res) => {
  res.status(404).json({ erro: `Rota não encontrada: ${req.method} ${req.originalUrl}` });
});

const PORTA = Number(process.env.PORT) || 3000;
app.listen(PORTA, () => {
  console.log(`Servidor rodando na porta ${PORTA} — API em http://localhost:${PORTA}/api`);
});
