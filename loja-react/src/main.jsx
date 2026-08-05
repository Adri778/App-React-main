import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { CarrinhoProvider } from './controllers/CarrinhoContext.jsx';
import { FavoritosProvider } from './controllers/FavoritosContext.jsx';
import './styles.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <FavoritosProvider>
        <CarrinhoProvider>
          <App />
        </CarrinhoProvider>
      </FavoritosProvider>
    </BrowserRouter>
  </React.StrictMode>
);
