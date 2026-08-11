// Usa a interface de promises do mesmo pool. Transação com callback aninhado
// (begin -> insert -> insert -> commit/rollback) fica ilegível; aqui vale a exceção.
const pool = require('../config/db').promise();

const Pedido = {
  // Preços vêm sempre do banco, nunca do que o cliente mandou.
  buscarPrecos: (ids) =>
    pool.query('SELECT id, nome, preco FROM produtos WHERE id IN (?)', [ids])
      .then(([linhas]) => new Map(linhas.map((p) => [p.id, p]))),

  // Pedido e itens entram juntos ou não entram: sem transação dá para gravar
  // um pedido órfão se o segundo insert falhar.
  async criar(pedido, itens) {
    const con = await pool.getConnection();
    try {
      await con.beginTransaction();
      const [r] = await con.query('INSERT INTO pedidos SET ?', pedido);
      await con.query(
        'INSERT INTO itens_pedido (pedido_id, produto_id, nome, preco_unitario, quantidade) VALUES ?',
        [itens.map((i) => [r.insertId, i.produto_id, i.nome, i.preco_unitario, i.quantidade])],
      );
      await con.commit();
      return r.insertId;
    } catch (erro) {
      await con.rollback();
      throw erro;
    } finally {
      con.release();
    }
  },

  listar: () =>
    pool.query('SELECT * FROM pedidos ORDER BY criado_em DESC').then(([r]) => r),

  async buscar(id) {
    const [[pedido]] = await pool.query('SELECT * FROM pedidos WHERE id = ?', [id]);
    if (!pedido) return null;
    const [itens] = await pool.query('SELECT * FROM itens_pedido WHERE pedido_id = ?', [id]);
    return { ...pedido, itens };
  },
};

module.exports = Pedido;
