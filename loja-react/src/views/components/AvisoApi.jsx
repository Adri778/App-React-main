// VIEW · Aviso de que a loja está em modo demonstração porque a API não respondeu.
// Substitui o selo mudo por um aviso que diz o motivo e deixa tentar de novo.
export default function AvisoApi({ usandoDemo, erro, aoTentarDeNovo, carregando }) {
  if (!usandoDemo) return null;

  return (
    <div className="aviso-api" role="status">
      <span className="aviso-api-selo">demonstração</span>
      <span className="aviso-api-texto">{erro || 'API indisponível — mostrando produtos de exemplo.'}</span>
      {aoTentarDeNovo && (
        <button type="button" className="aviso-api-btn" onClick={aoTentarDeNovo} disabled={carregando}>
          {carregando ? 'Tentando…' : 'Tentar de novo'}
        </button>
      )}
    </div>
  );
}
