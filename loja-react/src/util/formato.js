// =============================================================================
// UTIL · Formatação (apresentação). Funções puras.
// (Não precisa de escapeHtml: o JSX do React já escapa o conteúdo.)
// =============================================================================

export function formatarBRL(n) {
  if (n == null) return '—';
  const s = n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  return s.endsWith(',00') ? s.slice(0, -3) : s;
}

export function estrelas(avaliacao) {
  if (avaliacao == null) return '';
  const cheias = Math.round(avaliacao);
  let s = '';
  for (let i = 0; i < 5; i++) s += i < cheias ? '★' : '☆';
  return s;
}

export function vendidosTexto(v) {
  if (v == null) return '';
  if (v >= 1000) return (v / 1000).toFixed(1).replace('.0', '').replace('.', ',') + ' mil';
  return String(v);
}
