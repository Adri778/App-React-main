// VIEW · Layout base: sprite + header + conteúdo da rota + rodapé + drawer.
import { Outlet } from 'react-router-dom';
import Sprite from './Sprite.jsx';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import CarrinhoDrawer from './CarrinhoDrawer.jsx';

export default function Layout() {
  return (
    <>
      <Sprite />
      <Header />
      <Outlet />
      <Footer />
      <CarrinhoDrawer />
    </>
  );
}
