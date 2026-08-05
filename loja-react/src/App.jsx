import { Routes, Route } from 'react-router-dom';
import Layout from './views/components/Layout.jsx';
import HomePage from './views/pages/HomePage.jsx';
import ProdutoPage from './views/pages/ProdutoPage.jsx';
import CheckoutPage from './views/pages/CheckoutPage.jsx';
import BuscaPage from './views/pages/BuscaPage.jsx';
import FavoritosPage from './views/pages/FavoritosPage.jsx';
import NaoEncontradaPage from './views/pages/NaoEncontradaPage.jsx';

// Roteamento (a "V" macro): cada rota é uma página, todas dentro do Layout.
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/busca" element={<BuscaPage />} />
        <Route path="/favoritos" element={<FavoritosPage />} />
        <Route path="/produto/:id" element={<ProdutoPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        {/* Qualquer endereço desconhecido cai aqui em vez de renderizar em branco. */}
        <Route path="*" element={<NaoEncontradaPage />} />
      </Route>
    </Routes>
  );
}
