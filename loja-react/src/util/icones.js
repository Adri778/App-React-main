// =============================================================================
// UTIL · Ícones de produto — mapeia nome/categoria -> id do símbolo no sprite.
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

export function iconePara(produto) {
  const texto = ((produto.nome || '') + ' ' + (produto.categoria || '')).toLowerCase();
  const achado = ICONES.find(([chave]) => texto.indexOf(chave) >= 0);
  return achado ? achado[1] : 's-tools';
}
