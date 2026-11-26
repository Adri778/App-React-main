# Bom Preço — App de Gestão e Loja Virtual

Sistema de comércio com duas frentes que usam o mesmo cadastro de produtos: um **aplicativo mobile** para o gestor controlar produtos e estoque, e uma **loja virtual** (Achadinhos) onde os clientes navegam e compram. As duas conversam com a mesma API em Node.js e o mesmo banco MySQL.

## Para que serve

- O gestor acompanha pelo celular quantos produtos tem e quais estão com o estoque abaixo do mínimo.
- Um produto cadastrado uma única vez serve ao controle de estoque (quantidade, estoque mínimo, categoria) e à vitrine do site (imagem, preço original, promoção, frete grátis e link de afiliado).
- O cliente encontra ofertas e produtos mais vendidos, monta o carrinho e finaliza a compra pelo site.

## Partes do sistema

| Pasta | O que é | Tecnologia |
|-------|---------|------------|
| raiz (`telas/`, `servicos/`) | App do gestor (Android e iOS) | React Native 0.81, Expo 54 e React Navigation 7 |
| `backend/` | API REST | Node.js, Express 4 e MySQL (mysql2) |
| `loja-react/` | Loja virtual com carrinho e checkout | React 18, Vite 5 e React Router 6 |
| `loja/` | Primeira versão da loja, sem build | HTML, CSS e JavaScript puro (ES Modules) |

```
App do gestor (React Native) ──┐
                               ├── HTTP/JSON ──> API Express (porta 3000) ──> MySQL (bom_preco)
Loja virtual (React)  ─────────┘
```

## Como usar

### App do gestor

1. Ao abrir, o app mostra o **Painel** com o resumo: total de produtos e quantos estão com estoque baixo. O resumo se atualiza sempre que você volta para essa tela.
2. Em **Produtos**, veja a lista com preço, estoque e o aviso ⚠ de estoque baixo. O botão **+** abre o formulário de cadastro do site administrativo dentro do próprio app.
3. Em **Estoque**, os produtos aparecem do menor para o maior estoque, com destaque em vermelho para os que estão abaixo do mínimo.

### Loja virtual

1. A página inicial mostra as vitrines **Ofertas do dia** e **Mais vendidos**, com preço, desconto, parcelamento e frete.
2. Cada produto tem uma página com detalhes e sugestões de produtos relacionados.
3. O **carrinho** fica numa gaveta lateral e é salvo no navegador.
4. O **checkout** segue as etapas endereço → frete → pagamento → pedido.

Se a API estiver fora do ar, a loja mostra produtos de demonstração para não ficar vazia.

## Especificações técnicas

**API REST** (porta 3000):

| Método | Rota | O que faz |
|--------|------|-----------|
| GET | `/produtos` | Lista os produtos em ordem alfabética |
| GET | `/produtos/:id` | Busca um produto pelo código |
| GET | `/produtos/estoque-baixo` | Lista os produtos com quantidade menor ou igual ao estoque mínimo |
| POST | `/produtos` | Cadastra um produto |
| GET | `/resumo` | Total de produtos e total com estoque baixo |

- **Organização:** padrão MVC em todas as partes. Na API, cada requisição passa por rota → controller → model → banco.
- **Validação:** ao cadastrar, a API grava só os campos conhecidos do produto e ignora qualquer campo extra enviado.
- **Banco de dados:** banco `bom_preco` com a tabela `produtos`, que reúne os campos de estoque (`nome`, `preco`, `descricao`, `quantidade`, `estoque_minimo`, `categoria`) e os de vitrine (`image`, `originalPrice`, `isPromo`, `freeShipping`, `affiliateLink`).

## Como rodar

1. **Banco:** no MySQL, crie o banco `bom_preco` com a tabela `produtos` (campos acima). Se o seu MySQL tiver usuário ou senha diferentes, ajuste em `backend/config/db.js`.
2. **API:**

```bash
cd backend
npm install
npm start
```

3. **App do gestor:** na pasta raiz, ajuste o `HOST` em `servicos/api.jsx` para o IP da sua máquina (no emulador Android, use `10.0.2.2`) e rode:

```bash
npm install
npx expo start
```

O app monta os endereços da API como `http://HOST:3000/api/...`. Se a sua API não usar o prefixo `/api`, ajuste o `BASE_URL` no mesmo arquivo.

4. **Loja virtual:**

```bash
cd loja-react
npm install
npm run dev
```

Depois acesse http://localhost:5174

## Mais documentação

- [`RELATORIO_TECNICO.md`](RELATORIO_TECNICO.md): relatório técnico do app do gestor
- [`loja-react/README.md`](loja-react/README.md): detalhes da loja em React
- [`loja/README.md`](loja/README.md): detalhes da primeira versão da loja
