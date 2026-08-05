// VIEW · Newsletter — guarda o e-mail no navegador e confirma o cadastro.
// Sem back-end de e-mail ainda: o endereço fica em localStorage para ser
// exportado/enviado quando existir uma rota para isso.
import { useState } from 'react';

const CHAVE = 'achadinhos:newsletter';

function salvarEmail(email) {
  try {
    const atuais = JSON.parse(localStorage.getItem(CHAVE)) || [];
    const lista = Array.isArray(atuais) ? atuais : [];
    if (!lista.includes(email)) lista.push(email);
    localStorage.setItem(CHAVE, JSON.stringify(lista));
    return true;
  } catch {
    return false;
  }
}

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [estado, setEstado] = useState(null); // { tipo: 'ok' | 'erro', texto }

  function enviar(e) {
    e.preventDefault();
    const limpo = email.trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(limpo)) {
      setEstado({ tipo: 'erro', texto: 'Digite um e-mail válido, tipo nome@email.com.' });
      return;
    }

    salvarEmail(limpo);
    setEstado({ tipo: 'ok', texto: 'Pronto! Você vai receber as ofertas em primeira mão.' });
    setEmail('');
  }

  return (
    <div className="panel news">
      <h3>Receba as ofertas antes de todo mundo</h3>
      <p>Cadastre seu e-mail e não perca os preços da Semana do Eletro.</p>
      <form onSubmit={enviar} noValidate>
        <input
          type="email"
          placeholder="seu@email.com"
          aria-label="Seu e-mail"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setEstado(null); }}
        />
        <button className="btn btn-deal" type="submit">Quero ofertas</button>
      </form>
      {estado
        ? <p className={`news-msg ${estado.tipo}`} role="status">{estado.texto}</p>
        : <p className="fine">Sem spam. Você cancela quando quiser.</p>}
    </div>
  );
}
