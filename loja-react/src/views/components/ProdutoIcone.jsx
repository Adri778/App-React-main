// VIEW · Ilustração de um produto (referência a um símbolo do sprite).
import { iconePara } from '../../util/icones.js';

export default function ProdutoIcone({ produto, id, className = 'art' }) {
  const simbolo = id || iconePara(produto || {});
  return (
    <svg className={className} viewBox="0 0 64 64" aria-hidden="true">
      <use href={`#${simbolo}`} />
    </svg>
  );
}
