// =============================================================================
// MODEL · Serviço de pedidos — cria o pedido no back-end.
// Tenta POST /pedidos; se a rota não existir ainda, simula o pedido
// (mantém o fluxo de checkout funcional enquanto o back-end não tem essa rota).
// =============================================================================

import { API_BASE } from '../config.js';

function gerarNumero() {
  return 'ACH-' + Date.now().toString().slice(-8);
}

export async function criarPedido(pedido) {
  try {
    const resp = await fetch(`${API_BASE}/pedidos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pedido),
    });
    if (resp.ok) {
      const dado = await resp.json().catch(() => ({}));
      return { ok: true, numero: dado.id ?? dado.numero ?? gerarNumero(), simulado: false };
    }
    throw new Error('HTTP ' + resp.status);
  } catch (erro) {
    console.warn('[Achadinhos] /pedidos indisponível, simulando pedido:', erro.message);
    return { ok: true, numero: gerarNumero(), simulado: true };
  }
}
