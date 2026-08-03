// VIEW · Grade de produtos com estados de carregando / vazio / lista.
import ProdutoCard from './ProdutoCard.jsx';
import CardSkeleton from './CardSkeleton.jsx';

export default function VitrineGrade({ carregando, itens = [], skeletons = 8 }) {
  return (
    <div className="grid">
      {carregando
        ? Array.from({ length: skeletons }).map((_, i) => <CardSkeleton key={i} />)
        : itens.length === 0
          ? (
            <div className="grid-empty">
              <b>Nenhum produto por aqui ainda</b>
              Assim que você cadastrar produtos, eles aparecem automaticamente.
            </div>
          )
          : itens.map((p) => <ProdutoCard key={p.id != null ? p.id : p.nome} produto={p} />)}
    </div>
  );
}
