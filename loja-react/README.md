# Achadinhos — Loja (React + Vite)

Storefront de eletrodomésticos, eletrônicos e utilidades, agora em **React + Vite**,
organizado no padrão **MVC**. Inclui **home** (vitrines), **página de detalhe do produto (PDP)**,
**carrinho** (drawer com persistência) e **checkout** (endereço → frete → pagamento → pedido).

> Esta é a versão React. A versão anterior em JavaScript puro continua em `../loja`
> como referência.

---

## 1. MVC em React

React é baseado em componentes, então o MVC é mapeado assim:

| Camada | Onde | Papel |
|---|---|---|
| **Model** | `src/models/` | Dados e domínio, sem UI: chamadas à API (`ProdutoService`, `PedidoService`), cálculos e normalização (`calculos`), dados demo, persistência do carrinho. |
| **Controller** | `src/controllers/` | Hooks e Context que orquestram: `useProdutos`, `useProduto`, `useCheckout` e o `CarrinhoContext` (estado global do carrinho). Ligam o Model à View. |
| **View** | `src/views/` | Componentes de apresentação (`components/`) e páginas (`pages/`). Recebem dados prontos e disparam ações dos controllers. |

```
loja-react/
├── index.html                      página raiz (monta #root)
├── vite.config.js                  Vite + React (porta 5174)
└── src/
    ├── main.jsx                    entrada: Router + CarrinhoProvider + App
    ├── App.jsx                     rotas (/, /produto/:id, /checkout)
    ├── config.js                   API_BASE / API_URL / limites
    ├── styles.css                  estilos (mesmos tokens da versão vanilla + checkout)
    ├── models/                     ── MODEL ──
    │   ├── calculos.js             normalizar, desconto, parcelas, seleção (ofertas/vendidos/relacionados)
    │   ├── dadosDemo.js            fallback quando a API está fora
    │   ├── ProdutoService.js       GET produtos (com fallback demo)
    │   ├── PedidoService.js        POST pedido (com fallback simulado)
    │   └── carrinhoStorage.js      ler/salvar carrinho no localStorage
    ├── controllers/                ── CONTROLLER ──
    │   ├── CarrinhoContext.jsx     estado global do carrinho + hook useCarrinho
    │   ├── useProdutos.js          carrega a home (ofertas + mais vendidos)
    │   ├── useProduto.js           carrega 1 produto + relacionados
    │   └── useCheckout.js          fluxo do checkout em etapas
    └── views/                      ── VIEW ──
        ├── components/             Header, Footer, Layout, Sprite, ProdutoCard,
        │                           CarrinhoDrawer, VitrineGrade, CardSkeleton,
        │                           ProdutoIcone, Contador
        └── pages/                  HomePage, ProdutoPage, CheckoutPage
```

---

## 2. Rotas

| Rota | Página | O que faz |
|---|---|---|
| `/` | `HomePage` | Vitrines de ofertas e mais vendidos |
| `/produto/:id` | `ProdutoPage` | Detalhe do produto + relacionados |
| `/checkout` | `CheckoutPage` | Endereço → frete → pagamento → pedido |

Usa `react-router-dom` (`BrowserRouter`). O carrinho é um **Context** compartilhado por
todas as rotas, persistido em `localStorage` (chave `achadinhos:carrinho`).

---

## 3. Como rodar

```bash
cd loja-react
npm install
npm run dev        # desenvolvimento em http://localhost:5174
```

Build de produção:

```bash
npm run build      # gera dist/
npm run preview    # serve o build para conferência
```

> A porta é **5174** (o site principal usa a 5173).

---

## 4. Configuração da API

Em [`src/config.js`](src/config.js):

```js
export const API_BASE = 'http://192.168.1.6:3000/api';   // base
export const API_URL  = `${API_BASE}/produtos`;          // lista de produtos
```

- **API no ar** → produtos reais.
- **API fora** → modo demonstração (aparece o selo *"demonstração · API offline"*).

Os campos são aceitos em inglês (back-end atual) ou português — `models/calculos.js`
normaliza: `name/nome`, `price/preco`, `originalPrice`, `category/categoria`,
`image/imagem`, `isPromo`, `freeShipping`, `rating`, `sold`, `affiliateLink`.

---

## 5. Checkout

Fluxo em 3 etapas (controller `useCheckout`):

1. **Endereço** — formulário validado (nome, CEP, rua, número, cidade, UF).
2. **Frete** — opções simuladas (PAC / SEDEX; **grátis** quando o subtotal ≥ R$ 199).
3. **Pagamento** — Pix / cartão / boleto + resumo, e **Finalizar pedido**.

Ao finalizar, `PedidoService.criarPedido` tenta `POST /pedidos`. Como o back-end ainda
não tem essa rota, o pedido é **simulado** (gera um número, limpa o carrinho e mostra a
confirmação). Quando a rota existir, passa a criar o pedido de verdade — sem mudar a View.

---

## 6. O que ainda falta

- [ ] **Back-end de pedidos** (`POST /pedidos`) para o checkout deixar de ser simulado.
- [ ] **Pagamento real** (provedor de Pix/cartão) e **HTTPS**.
- [ ] **Autenticação** de cliente (login/cadastro) e histórico de pedidos.
- [ ] **Busca e filtros** por categoria (a barra de busca ainda é visual).
- [ ] **Paginação / "carregar mais"** nas vitrines.
- [ ] **Favoritos** persistentes (o coração no card ainda não guarda estado).
- [ ] **Imagens reais** dos produtos (hoje usa ilustração SVG como fallback).
- [ ] **Testes** (unitários dos cálculos do Model; e2e do fluxo de compra).
- [ ] **Logo definitiva** (há um placeholder no header e no rodapé).

---

## 7. Observações

- Projeto com **build** (Vite). ES Modules e JSX são transpilados — não abra os arquivos
  por `file://`; use `npm run dev` ou sirva o `dist/`.
- Estilos reaproveitam os mesmos tokens/classes da versão vanilla (tema verde-azulado,
  claro/escuro por `prefers-color-scheme`, responsivo).
- Ilustrações de produto são SVGs em um sprite único (`views/components/Sprite.jsx`).
