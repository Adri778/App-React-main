// =============================================================================
// APP · Ponto de entrada da home (index.html)
// Liga Model + View + Controller e inicia a loja e o carrinho.
// =============================================================================

import { ProdutoModel } from './model/ProdutoModel.js';
import { LojaView } from './view/LojaView.js';
import { LojaController } from './controller/LojaController.js';
import { CarrinhoModel } from './model/CarrinhoModel.js';
import { CarrinhoView } from './view/CarrinhoView.js';
import { CarrinhoController } from './controller/CarrinhoController.js';

// carrinho (persistente, compartilhado com a página de produto)
new CarrinhoController(new CarrinhoModel(), new CarrinhoView()).iniciar();

// vitrines da home
new LojaController(new ProdutoModel(), new LojaView()).iniciar();
