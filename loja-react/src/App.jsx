import { Routes, Route } from 'react-router-dom';
import Layout from './views/components/Layout.jsx';
import HomePage from './views/pages/HomePage.jsx';
import ProdutoPage from './views/pages/ProdutoPage.jsx';
import CheckoutPage from './views/pages/CheckoutPage.jsx';

// Roteamento (a "V" macro): cada rota é uma página, todas dentro do Layout.
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/produto/:id" element={<ProdutoPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
      </Route>
    </Routes>
  );
}
