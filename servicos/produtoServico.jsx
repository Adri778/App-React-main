import BASE_URL from './api';

const paraNumero = (v) => {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : null;
};

// O backend pode devolver os campos do produto em inglês (catálogo do site:
// name/price/category...) ou em português (nome/preco/categoria...). Esta função
// normaliza para um formato único que todas as telas do app consomem, evitando
// nome em branco, preço "NaN" e estoque "undefined".
export const normalizarProduto = (p = {}) => ({
  id: p.id,
  nome: p.nome ?? p.name ?? '(sem nome)',
  preco: paraNumero(p.preco ?? p.price),
  categoria: p.categoria ?? p.category ?? '',
  // O catálogo do site não controla estoque; estes campos podem não existir.
  quantidade: paraNumero(p.quantidade ?? p.quantity ?? p.estoque),
  estoqueMinimo: paraNumero(p.estoque_minimo ?? p.estoqueMinimo ?? p.minStock),
});

export const listarProdutos = () =>
  fetch(`${BASE_URL}/produtos`)
    .then(r => r.json())
    .then(lista => (Array.isArray(lista) ? lista.map(normalizarProduto) : []));

export const criarProduto = (dados) =>
  fetch(`${BASE_URL}/produtos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados),
  }).then(r => r.json());
