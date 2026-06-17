# Relatório Técnico — Bom Preço (App de Controle)

## 1. Visão Geral

O **Bom Preço** é um sistema dividido em duas frentes:

- **Site (e-commerce):** onde os clientes navegam e realizam compras.
- **Aplicativo mobile (este repositório):** painel de controle para o gestor da loja — gerencia produtos, estoque e visualiza vendas geradas pelo site.

O app **não é voltado ao cliente final**. É uma ferramenta interna de gestão (backoffice mobile).

> Os produtos cadastrados no app carregam, além dos campos de estoque, os **campos de vitrine** consumidos pelo site (imagem, preço original, promoção, frete grátis e link de afiliado). Assim, o mesmo produto serve ao controle interno e à exibição na loja.

---

## 2. Arquitetura do Sistema

```
┌─────────────────────────┐        ┌──────────────────────────┐
│   App React Native      │        │   Site (e-commerce)      │
│   (Painel do Gestor)    │        │   (Clientes compram)     │
└────────────┬────────────┘        └────────────┬─────────────┘
             │  HTTP (JSON)                      │  HTTP (JSON)
             ▼                                   ▼
┌─────────────────────────────────────────────────────────────┐
│                  Backend Express (Node.js)                   │
│              Porta 3000 — API REST JSON                      │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
                  ┌──────────────────────┐
                  │   MySQL — bom_preco  │
                  └──────────────────────┘
```

Tanto o app quanto o site consomem a mesma API REST. O backend é o ponto central de dados.

---

## 3. Stack Tecnológica

### Frontend (App Mobile)
| Tecnologia | Versão | Papel |
|---|---|---|
| React Native | 0.81.5 | Framework mobile cross-platform |
| Expo | ~54.0.33 | Toolchain de build e desenvolvimento |
| React Navigation | 7.x | Navegação entre telas (native-stack) |
| @expo-google-fonts/roboto | — | Tipografia (Roboto Regular + Bold) |

### Backend
| Tecnologia | Versão | Papel |
|---|---|---|
| Node.js | — | Ambiente de execução |
| Express | ^4.18.2 | Framework HTTP/REST |
| mysql2 | ^3.6.0 | Driver de conexão com MySQL |
| cors | ^2.8.5 | Permite requisições do app e do site |

### Banco de Dados
| Tecnologia | Papel |
|---|---|
| MySQL | Persistência relacional dos dados |

---

## 4. Estrutura de Arquivos

```
App-React/
│
├── index.js                  # Ponto de entrada — registra o componente raiz no Expo
├── app.json                  # Configuração do Expo (nome, ícone, splash, orientação)
├── package.json              # Dependências do frontend
│
├── telas/                    # Telas (componentes de página)
│   ├── Aplicativo.js         # Configuração do navegador e rotas
│   ├── Splash.js             # Tela de carregamento inicial (2,5 s)
│   ├── Inicio.js             # Dashboard — resumo e menu de navegação
│   ├── Produtos.js           # Listagem e cadastro de produtos (estoque + vitrine)
│   ├── Estoque.js            # Visão de estoque com alertas de quantidade baixa
│   └── Vendas.js             # Listagem de pedidos gerados pelo site
│
├── servicos/                 # Camada de integração com a API
│   ├── api.js                # BASE_URL do backend
│   ├── produtoServico.js     # Funções fetch para /produtos
│   └── vendaServico.js       # Funções fetch para /vendas
│
├── assets/                   # Imagens estáticas
│   ├── icon.png
│   ├── splash-icon.png
│   ├── adaptive-icon.png
│   └── favicon.png
│
└── backend/
    ├── server.js             # Servidor Express — registra rotas e inicia na porta 3000
    ├── package.json          # Dependências do backend
    ├── config/
    │   └── db.js             # Conexão MySQL (mysql2)
    ├── models/               # Consultas SQL (acesso ao banco)
    │   ├── Produto.js
    │   └── Venda.js
    ├── controllers/          # Lógica de requisição/resposta HTTP
    │   ├── ProdutoController.js
    │   └── VendaController.js
    └── routes/               # Definição dos endpoints REST
        ├── produtoRoutes.js
        └── vendaRoutes.js
```

---

## 5. Banco de Dados

### Diagrama de Tabelas

```
produtos                          vendas
──────────────────                ─────────────────
id (PK)                           id (PK)
nome                              total
preco                             status
descricao                        criado_em
quantidade
estoque_minimo
categoria
image            ┐
originalPrice    │  campos de
isPromo          │  vitrine
freeShipping     │  (consumidos
affiliateLink    ┘  pelo site)
```

- **produtos** reúne os campos de **controle/estoque** (nome, preço, quantidade, estoque mínimo, categoria, descrição) e os campos de **vitrine** consumidos pelo site (image, originalPrice, isPromo, freeShipping, affiliateLink).
- **vendas** registra os pedidos gerados pelo site (total, status, data).

> **Observação:** esta versão não possui a entidade **Clientes**. O detalhamento de itens por venda (`itens_venda`) e qualquer vínculo de venda com cliente ficam a cargo da integração com o site/banco (responsabilidade da etapa de integração).

---

## 6. API REST — Endpoints

### Produtos — `/produtos`
| Método | Rota | Ação |
|---|---|---|
| GET | `/produtos` | Lista todos os produtos |
| GET | `/produtos/:id` | Busca um produto pelo ID |
| POST | `/produtos` | Cadastra novo produto |
| GET | `/produtos/estoque-baixo` | Lista produtos com `quantidade <= estoque_minimo` |

### Vendas — `/vendas`
| Método | Rota | Ação |
|---|---|---|
| GET | `/vendas` | Lista todas as vendas |
| GET | `/vendas/:id` | Busca uma venda pelo ID |
| PATCH | `/vendas/:id/status` | Atualiza o status da venda (valida valores permitidos) |

### Dashboard — `/resumo`
| Método | Rota | Resposta |
|---|---|---|
| GET | `/resumo` | `{ produtos, estoqueBaixo }` |

> A API adota o padrão **CR (Create + Read)** para produtos. A única operação de escrita adicional é o `PATCH /vendas/:id/status`. Update/Delete amplos ficam a cargo do site ou do acesso direto ao banco.

---

## 7. Padrão Arquitetural do Backend

O backend segue o padrão **MVC sem View** (Model-Controller-Route):

```
Requisição HTTP
      │
      ▼
  Route (define o endpoint e delega)
      │
      ▼
  Controller (valida a entrada, trata erros HTTP, monta a resposta)
      │
      ▼
  Model (executa a query SQL no banco)
      │
      ▼
  Banco MySQL
```

Cada camada tem responsabilidade única:
- **Route:** apenas mapeia verbo HTTP + path → função do controller.
- **Controller:** recebe `req`/`res`, chama o model, devolve JSON.
- **Model:** contém apenas as queries SQL, sem lógica HTTP.

### Validação de entrada (whitelist)
Os controllers de criação montam o objeto a ser gravado **copiando apenas os campos conhecidos** da requisição (função `lerEntrada`). Campos extras enviados pelo cliente são ignorados, evitando *mass assignment* (gravação de colunas não previstas).

---

## 8. Fluxo de Navegação do App

```
Splash (2,5 s)
     │
     ▼
  Início (Dashboard)
     │
     ├──► Produtos   → Lista → botão "+" → Modal "Novo Produto" (estoque + vitrine)
     │
     ├──► Estoque    → Lista ordenada por quantidade (alertas visuais)
     │
     └──► Vendas     → Lista de pedidos do site com badges de status
```

Todas as telas internas possuem botão "← Voltar" que retorna ao Dashboard via `navigation.goBack()`.

O Dashboard usa `useFocusEffect` para atualizar os cards de resumo sempre que o usuário retorna à tela, garantindo dados sempre atualizados.

---

## 9. Decisões Técnicas

| Decisão | Motivo |
|---|---|
| Expo (não bare React Native) | Simplifica build, fontes, assets e desenvolvimento |
| mysql2 com callbacks (não promises) | Consistente com o padrão já adotado no `db.js` do projeto |
| Fetch nativo (não axios) | Sem dependência extra; suficiente para CR simples |
| Modal bottom-sheet (não tela separada) | Menos navegação; experiência mais fluida para formulários curtos |
| `useFocusEffect` no Dashboard | Dados do resumo se atualizam ao voltar de qualquer tela |
| Produto com campos de estoque **e** de vitrine | Um único produto serve ao controle interno e à exibição no site |
| Whitelist de entrada nos controllers | Evita *mass assignment*; só campos conhecidos são gravados |
| CR + `PATCH` de status | Operações destrutivas amplas ficam no site/banco, reduzindo risco no app mobile |

---

## 10. Como Executar

### Backend
```bash
cd backend
npm install
node server.js
# Servidor em http://localhost:3000
```

### Banco de dados
Crie o banco `bom_preco` e as tabelas no MySQL. A tabela `produtos` precisa conter, além dos campos de estoque, as colunas de vitrine (`image`, `originalPrice`, `isPromo`, `freeShipping`, `affiliateLink`).

### App (Frontend)
```bash
npm install
npx expo start
```

> **Atenção:** Em [servicos/api.js](servicos/api.js), ajuste `BASE_URL`:
> - Emulador Android: `http://10.0.2.2:3000`
> - Dispositivo físico: `http://<IP-da-máquina>:3000`

---

## 11. Pendências para Integração (site + banco)

Itens a cargo da etapa de integração:

1. **Banco `bom_preco`** com as tabelas `produtos` (estoque + vitrine) e `vendas`.
2. **Endereço da API** em `servicos/api.js` apontando para o servidor real.
3. **Alinhamento de nomes** entre app e site nos campos principais: o app usa `nome`/`preco`/`categoria`; o site espera `name`/`price`/`category`. Os campos de vitrine já coincidem.
