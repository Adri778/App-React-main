# Achadinhos — Loja (front-end)

Vitrine web (e-commerce) de eletrodomésticos, eletrônicos e utilidades. Mostra os
produtos cadastrados no back-end em vitrines de **Ofertas do dia** e **Mais vendidos**,
com preço, desconto, parcelamento, frete e avaliação.

É um front-end **sem build** (HTML + CSS + JavaScript puro com ES Modules),
organizado no padrão **MVC**. Consome a API de produtos; se ela estiver indisponível,
cai automaticamente em um modo de **demonstração** com dados de exemplo.

---

## 1. Arquitetura (MVC)

```
loja/
├── index.html                        View · home (vitrines de ofertas e mais vendidos)
├── produto.html                      View · página de detalhe do produto (PDP)
├── css/
│   └── estilos.css                   estilos (tokens, componentes, responsivo, dark)
└── js/
    ├── app.js                        entrada da home     · Loja + Carrinho
    ├── produto.js                    entrada da PDP       · Produto + Carrinho
    ├── config.js                     API_URL e limites das vitrines
    ├── util/
    │   ├── formato.js                formatação (R$, estrelas, escape)
    │   └── icones.js                 mapa produto → ilustração SVG (compartilhado)
    ├── model/
    │   ├── calculos.js               domínio: normalizar, desconto, parcelas, Pix
    │   ├── dadosDemo.js              dados de demonstração (fallback)
    │   ├── ProdutoModel.js           API: lista, por id, ofertas, mais vendidos, relacionados
    │   └── CarrinhoModel.js          estado do carrinho + persistência (localStorage)
    ├── view/
    │   ├── LojaView.js               monta cards/skeleton/estado-vazio
    │   ├── ProdutoView.js            monta a PDP (galeria, preço, ficha, relacionados)
    │   └── CarrinhoView.js           monta o drawer do carrinho + badge do header
    └── controller/
        ├── LojaController.js         home: Model → View
        ├── ProdutoController.js      PDP: lê ?id= → Model → View
        └── CarrinhoController.js     carrinho: eventos (adicionar, qtd, remover)
```

### Responsabilidade de cada camada

| Camada | Arquivo | Faz | Não faz |
|---|---|---|---|
| **Model** | `model/ProdutoModel.js`, `model/calculos.js`, `model/dadosDemo.js` | Busca da API (`fetch`), normaliza os campos, calcula desconto/parcelas/Pix e decide o que é *oferta* e *mais vendido*. | Não toca no DOM. |
| **View** | `view/LojaView.js`, `index.html`, `css/estilos.css` | Recebe produtos prontos e monta os cards, skeletons, estado vazio e efeitos visuais. | Não busca dados nem conhece a API. |
| **Controller** | `controller/LojaController.js` | Cola tudo: mostra "carregando", pede os dados ao Model e manda a View renderizar. | Não formata nem faz `fetch` diretamente. |
| **Entrada** | `app.js` | Cria as instâncias e chama `controller.iniciar()`. | — |
| **Util** | `util/formato.js` | Formatação pura reutilizável (R$, estrelas, `escapeHtml`). | Sem estado. |

### Fluxo de dados

```
app.js
  └─ new LojaController(new ProdutoModel(), new LojaView())
        └─ controller.iniciar()
              1. view.iniciarEfeitos()            (reveal ao rolar + contador)
              2. view.mostrarCarregando(...)       (skeletons)
              3. await model.carregar()            (fetch API → normaliza; erro → demo)
              4. if (model.usandoDemo) view.marcarModoDemo()
              5. view.renderizar(gridOfertas,  model.ofertas())
                 view.renderizar(gridVendidos, model.maisVendidos())
```

### Páginas e rotas

| Página | Arquivo | Entrada | O que mostra |
|---|---|---|---|
| Home | `index.html` | `js/app.js` | Vitrines de ofertas e mais vendidos |
| Produto (PDP) | `produto.html?id=<id>` | `js/produto.js` | Detalhe de um produto + relacionados |

Os cards levam à PDP por `produto.html?id=<id>`; o `ProdutoController` lê esse `id`
da URL e pede o produto ao `ProdutoModel` (tenta `GET /produtos/:id` e, se não houver,
procura na lista já carregada / demonstração).

### Carrinho (compartilhado entre as páginas)

- É uma **gaveta lateral (drawer)** injetada no `<body>` pela `CarrinhoView`, disponível
  na home e na PDP.
- O estado é **persistido em `localStorage`** (chave `achadinhos:carrinho`), então o
  carrinho sobrevive à navegação e ao recarregar a página.
- Comunicação **desacoplada**: cards e PDP disparam o evento `carrinho:adicionar` no
  `document`; o `CarrinhoController` escuta, atualiza o `CarrinhoModel` e abre o drawer.
  O badge e o subtotal do header refletem o carrinho automaticamente.

---

## 2. Como rodar

Os **ES Modules exigem HTTP** (não abra por `file://`). Servir por HTTP também é o que
evita bloqueio de **CORS** ao chamar a API.

```bash
cd loja
npx serve
```

Abra o endereço que o `serve` exibir (ex.: `http://localhost:3000`).

- **Com a API no ar** → os cards vêm dos produtos reais.
- **Sem a API** → entra em modo demonstração (aparece o selo laranja *"demonstração · API offline"*).

> Dica: para não ter CORS, sirva esta pasta na **mesma origem** da API, ou garanta que
> a API responda o cabeçalho `Access-Control-Allow-Origin`.

---

## 3. Configuração

Tudo que muda de ambiente está em [`js/config.js`](js/config.js):

```js
export const API_URL = 'http://192.168.1.6:3000/api/produtos';
export const LIMITES = { ofertas: 8, vendidos: 4 };
```

---

## 4. Contrato da API

`GET {API_URL}` deve retornar um **array JSON** de produtos. Os campos são aceitos em
inglês (padrão do back-end atual) ou português — `model/calculos.js` normaliza os dois:

| Campo aceito | Vira | Uso no card |
|---|---|---|
| `name` / `nome` | `nome` | título |
| `price` / `preco` | `preco` | preço em destaque, parcelas, Pix (−10%) |
| `originalPrice` | `precoOriginal` | preço riscado + cálculo do `-XX%` |
| `category` / `categoria` | `categoria` | escolha do ícone SVG |
| `image` / `imagem` | `imagem` | imagem do produto (fallback: ícone SVG) |
| `isPromo` | `promo` | entra em *Ofertas do dia* |
| `freeShipping` | `freteGratis` | selo *Frete grátis* |
| `rating` | `avaliacao` | estrelas |
| `sold` / `vendidos` | `vendidos` | "1,2 mil" + ordena *Mais vendidos* |
| `affiliateLink` / `link` | `link` | destino do botão **Comprar** |

Campos ausentes são tratados com segurança (sem `NaN`/`undefined` na tela).

---

## 5. Responsividade

Testado sem rolagem horizontal de 320 px a 1280 px. Principais breakpoints em
[`css/estilos.css`](css/estilos.css):

| Largura | Vitrine de produtos | Categorias | Outros |
|---|---|---|---|
| ≥ 1000 px (desktop) | 4 colunas | 8 | hero e cupom/newsletter lado a lado |
| ≤ 1000 px | 3 colunas | 4 | hero em 1 coluna |
| ≤ 860 px (tablet) | 3 colunas | 4 | header quebra, busca 100%, cupom/newsletter empilhados |
| ≤ 560 px (mobile) | 2 colunas | 3 | arte do hero oculta, form e cupom empilhados |
| ≤ 380 px | 1 coluna | 2 | — |

Também: `overflow-x: clip` no `body` como rede de segurança, imagens/SVG fluidos,
alvos de toque confortáveis, tema claro/escuro por `prefers-color-scheme` e
`prefers-reduced-motion` respeitado.

---

## 6. O que falta para o sistema ficar completo

A loja já mostra as vitrines, a **página de detalhe do produto (PDP)** e um
**carrinho** funcional com persistência. Para virar um e-commerce completo, os itens
abaixo ainda estão pendentes. Marcados por prioridade sugerida.

### Front-end da loja
- [x] **Página de detalhe do produto** (PDP): galeria, preço/desconto/parcelas, ficha técnica, descrição e relacionados. *(feito)*
- [x] **Carrinho real**: adicionar/remover, alterar quantidade, subtotal, badge no header e persistência em `localStorage` (drawer lateral). *(feito)*
- [ ] **Checkout**: hoje o botão "Ir para o pagamento" é um stub — falta endereço, frete, pagamento e criação do pedido.
- [ ] **Busca e filtros funcionais**: a barra de busca e o menu de categorias hoje são visuais — falta filtrar/ordenar de fato (usando o campo `category`).
- [ ] **Paginação / "carregar mais"**: hoje mostramos no máximo 8 + 4 itens.
- [ ] **Favoritos**: o coração no card ainda não guarda nada.
- [ ] **Imagens reais** dos produtos (preencher `image`); hoje usa ícone SVG como fallback.
- [ ] **Acessibilidade**: auditoria de foco/leitor de tela e contraste.

### Back-end / API (necessário para o acima)
- [ ] Endpoints de **carrinho** e **pedidos** (criar pedido, listar, status).
- [ ] Endpoint de **produto por id** para a PDP.
- [ ] **Autenticação** de cliente (login/cadastro, sessão/JWT).
- [ ] Integração de **pagamento** (Pix, cartão) via provedor.
- [ ] **CORS** liberado para a origem da loja (ou servir loja + API na mesma origem).
- [ ] **Paginação/filtros** no `GET /produtos` (query params).

### Plataforma / operação
- [ ] **Logo definitiva** (hoje há um placeholder marcado no header e no rodapé).
- [ ] **Deploy** com domínio e **HTTPS** (obrigatório para pagamento).
- [ ] **SEO** (metatags, Open Graph, sitemap) e **analytics**.
- [ ] **Dados institucionais reais** no rodapé (CNPJ, políticas, contato).
- [ ] **Testes** (unitários dos cálculos do Model; e2e do fluxo de compra).
- [ ] **Tratamento de erro** mais rico (ex.: aviso amigável quando a API cai, com botão "tentar de novo").

### Integração com o restante do projeto
- [ ] Alinhar esta loja com o **app mobile** (`../telas`) e o **back-end** (`../backend`), que hoje compartilham a mesma base de produtos.
- [ ] Definir de onde vem o **cadastro** de produtos (o app abre a tela de cadastro do site via WebView) e garantir que a loja reflita o que for cadastrado.

---

## 7. Observações

- Projeto **sem dependências** e **sem etapa de build** — só arquivos estáticos.
- Ilustrações de produto são **SVG embutidos** (sprite em `index.html`), escolhidos por
  palavra-chave do nome/categoria em `view/LojaView.js`.
- A versão publicada como *Artifact* é uma cópia **single-file** (a hospedagem não carrega
  módulos externos); a versão organizada em MVC é esta, do projeto.
