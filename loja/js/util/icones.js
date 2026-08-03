// =============================================================================
// UTIL · Ícones de produto (sprite SVG)
// Escolhe a ilustração conforme o nome/categoria. Compartilhado por card, PDP e carrinho.
// =============================================================================

const ICONES = [
  ['televis', 's-tv'], ['tv', 's-tv'],
  ['smartphone', 's-phone'], ['celular', 's-phone'], ['phone', 's-phone'],
  ['fone', 's-headphones'], ['headphone', 's-headphones'], ['ouvido', 's-headphones'],
  ['liquidific', 's-blender'], ['blender', 's-blender'], ['mixer', 's-blender'], ['batedeira', 's-blender'],
  ['ventilador', 's-fan'], ['climatiz', 's-fan'], ['fan', 's-fan'], ['ar-condicionado', 's-fan'],
  ['micro', 's-microwave'], ['forno', 's-microwave'],
  ['fryer', 's-airfryer'], ['fritadeira', 's-airfryer'], ['air ', 's-airfryer'],
  ['aspirador', 's-robot'], ['robô', 's-robot'], ['robo', 's-robot'],
  ['cafeteira', 's-coffee'], ['café', 's-coffee'], ['cafe', 's-coffee'],
  ['som', 's-speaker'], ['speaker', 's-speaker'], ['caixa', 's-speaker'], ['áudio', 's-speaker'], ['audio', 's-speaker'],
  ['câmera', 's-camera'], ['camera', 's-camera'], ['seguranç', 's-camera'], ['monitor', 's-camera'],
  ['frigobar', 's-fridge'], ['geladeira', 's-fridge'], ['refriger', 's-fridge'], ['fridge', 's-fridge'],
];

// Devolve o id do símbolo SVG para um produto.
export function iconePara(produto) {
  const texto = ((produto.nome || '') + ' ' + (produto.categoria || '')).toLowerCase();
  const achado = ICONES.find(([chave]) => texto.indexOf(chave) >= 0);
  return achado ? achado[1] : 's-tools';
}

// Devolve o markup <svg><use/></svg>. Aceita um produto ou um id de símbolo direto.
export function svgIcone(produtoOuId, classe = 'art') {
  const id = typeof produtoOuId === 'string' ? produtoOuId : iconePara(produtoOuId);
  return `<svg class="${classe}" viewBox="0 0 64 64" aria-hidden="true"><use href="#${id}"/></svg>`;
}
