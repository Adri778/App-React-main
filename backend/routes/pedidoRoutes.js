const express = require('express');
const rota = express.Router();
const PedidoController = require('../controllers/PedidoController');

rota.get('/', PedidoController.listar);
rota.get('/:id', PedidoController.buscar);
rota.post('/', PedidoController.criar);

module.exports = rota;
