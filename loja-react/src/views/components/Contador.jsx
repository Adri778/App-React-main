// VIEW · Contador regressivo das "ofertas do dia".
import { useState, useEffect } from 'react';

export default function Contador({ segundos = 8 * 3600 + 42 * 60 + 15 }) {
  const [t, setT] = useState(segundos);
  useEffect(() => {
    const id = setInterval(() => setT((x) => (x > 0 ? x - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, []);
  const pad = (n) => (n < 10 ? '0' : '') + n;
  return (
    <span className="countdown">
      Acaba em <span className="box">{pad(Math.floor(t / 3600))}</span>:
      <span className="box">{pad(Math.floor((t % 3600) / 60))}</span>:
      <span className="box">{pad(t % 60)}</span>
    </span>
  );
}
