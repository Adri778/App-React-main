// VIEW · Código de cupom que copia para a área de transferência ao clicar.
import { useState, useEffect } from 'react';

export default function CupomCopiavel({ codigo }) {
  const [copiado, setCopiado] = useState(false);

  // Volta ao estado normal sozinho, sem deixar o "Copiado!" preso na tela.
  useEffect(() => {
    if (!copiado) return undefined;
    const t = setTimeout(() => setCopiado(false), 2000);
    return () => clearTimeout(t);
  }, [copiado]);

  async function copiar() {
    try {
      await navigator.clipboard.writeText(codigo);
      setCopiado(true);
    } catch {
      // Sem permissão de área de transferência (http, navegador antigo):
      // seleciona o texto para o cliente copiar na mão.
      const alvo = document.getElementById(`cupom-${codigo}`);
      if (alvo) {
        const faixa = document.createRange();
        faixa.selectNodeContents(alvo);
        const selecao = window.getSelection();
        selecao.removeAllRanges();
        selecao.addRange(faixa);
      }
    }
  }

  return (
    <button
      type="button"
      className={`code code-btn${copiado ? ' copiado' : ''}`}
      onClick={copiar}
      title="Clique para copiar"
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
        {copiado
          ? <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
          : <path d="M4 7v10M20 7v10M8 5h8l4 4v6l-4 4H8l-4-4V9z" />}
      </svg>
      <span id={`cupom-${codigo}`}>{codigo}</span>
      <span className="code-dica">{copiado ? 'copiado!' : 'copiar'}</span>
    </button>
  );
}
