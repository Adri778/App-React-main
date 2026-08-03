// =============================================================================
// UTIL · Formatação (camada de apresentação)
// Funções puras que transformam dados em texto para exibição.
// =============================================================================

// Escapa texto para inserir com segurança no HTML.
export function escapeHtml(valor) {
  return String(valor ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

// Formata número como moeda brasileira, omitindo os centavos quando forem ",00".
export function formatarBRL(n) {
  if (n == null) return '—';
  const s = n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  return s.endsWith(',00') ? s.slice(0, -3) : s;
}

// Monta a linha de estrelas (★ cheias, ☆ vazias) a partir da nota 0–5.
export function estrelas(avaliacao) {
  if (avaliacao == null) return '';
  const cheias = Math.round(avaliacao);
  let s = '';
  for (let i = 0; i < 5; i++) s += i < cheias ? '★' : '☆';
  return s;
}

// "1,2 mil" para vendas grandes; o número puro para pequenas.
export function vendidosTexto(v) {
  if (v == null) return '';
  if (v >= 1000) return (v / 1000).toFixed(1).replace('.0', '').replace('.', ',') + ' mil';
  return String(v);
}
