const db = require('../config/db');

const Produto = {
  listar: (cb) => db.query('SELECT * FROM produtos ORDER BY nome', cb),
  buscar: (id, cb) => db.query('SELECT * FROM produtos WHERE id = ?', [id], cb),
  criar: (dados, cb) => db.query('INSERT INTO produtos SET ?', dados, cb),
  estoquesBaixos: (cb) => db.query('SELECT * FROM produtos WHERE quantidade <= estoque_minimo ORDER BY quantidade ASC', cb),
  contagem: (cb) => db.query('SELECT COUNT(*) AS total FROM produtos', cb),
  contagemEstoqueBaixo: (cb) => db.query('SELECT COUNT(*) AS total FROM produtos WHERE quantidade <= estoque_minimo', cb),
};

module.exports = Produto;
