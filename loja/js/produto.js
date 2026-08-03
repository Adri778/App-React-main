// =============================================================================
// APP · Ponto de entrada da página de produto (produto.html)
// =============================================================================

import { ProdutoModel } from './model/ProdutoModel.js';
import { ProdutoView } from './view/ProdutoView.js';
import { ProdutoController } from './controller/ProdutoController.js';
import { CarrinhoModel } from './model/CarrinhoModel.js';
import { CarrinhoView } from './view/CarrinhoView.js';
import { CarrinhoController } from './controller/CarrinhoController.js';

// carrinho (compartilhado com a home)
new CarrinhoController(new CarrinhoModel(), new CarrinhoView()).iniciar();

// página de produto
new ProdutoController(new ProdutoModel(), new ProdutoView()).iniciar();
