const express = require('express');
const rota = express.Router();
const ProdutoController = require('../controllers/ProdutoController');

rota.get('/', ProdutoController.listar);
rota.get('/estoque-baixo', ProdutoController.estoquesBaixos);
rota.get('/:id', ProdutoController.buscar);
rota.post('/', ProdutoController.criar);

module.exports = rota;
