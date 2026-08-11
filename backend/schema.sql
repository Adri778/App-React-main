-- =============================================================================
-- bom_preco — schema do banco
-- =============================================================================
-- Este script é SEGURO de rodar mais de uma vez: ele só cria o que ainda não
-- existe e nunca apaga nada. Se precisar recomeçar do zero, use o bloco de
-- RESET que está comentado no final do arquivo.
--
-- Consumidores deste banco:
--   1) Loja (loja-react)      -> vitrine, busca, checkout
--   2) App de estoque (RN)    -> quantidade, estoque_minimo
--
-- CONVENÇÃO: todas as colunas em português.
--   As queries de backend/models/Produto.js já assumem português
--   (`ORDER BY nome`, `quantidade <= estoque_minimo`), e o normalizador da
--   loja (loja-react/src/models/calculos.js) aceita os dois idiomas — então
--   o português é o único conjunto que serve aos dois lados sem remendo.
--
-- Uso no Workbench: abra este arquivo e execute com o raio ⚡ (Ctrl+Shift+Enter)
-- =============================================================================

CREATE DATABASE IF NOT EXISTS bom_preco
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE bom_preco;

-- -----------------------------------------------------------------------------
-- PRODUTOS — serve à vitrine da loja e ao controle de estoque do app
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS produtos (
  id              INT AUTO_INCREMENT PRIMARY KEY,

  -- Identidade (usada pelos dois consumidores)
  nome            VARCHAR(180)   NOT NULL,
  categoria       VARCHAR(80)    NOT NULL DEFAULT '',
  descricao       TEXT           NULL,
  imagem          VARCHAR(500)   NOT NULL DEFAULT '',
  preco           DECIMAL(10,2)  NOT NULL,

  -- Vitrine da loja
  preco_original  DECIMAL(10,2)  NULL,      -- alimenta o cálculo do "-X%"
  is_promo        TINYINT(1)     NOT NULL DEFAULT 0,
  frete_gratis    TINYINT(1)     NOT NULL DEFAULT 0,
  avaliacao       DECIMAL(2,1)   NULL,      -- 0.0 a 5.0 — vira as estrelas do card
  vendidos        INT            NOT NULL DEFAULT 0,

  -- Controle de estoque (app React Native)
  quantidade      INT            NOT NULL DEFAULT 0,
  estoque_minimo  INT            NOT NULL DEFAULT 0,

  criado_em       TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_categoria (categoria),
  INDEX idx_promo     (is_promo),
  INDEX idx_vendidos  (vendidos)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- PEDIDOS — cabeçalho do pedido fechado no checkout da loja
-- -----------------------------------------------------------------------------
-- O número que o cliente vê (ACH-000123) NÃO é uma coluna: ele é derivado do
-- id pelo back-end. Guardar seria duplicar informação que já existe.
CREATE TABLE IF NOT EXISTS pedidos (
  id                INT AUTO_INCREMENT PRIMARY KEY,

  -- Entrega
  cliente_nome      VARCHAR(180)   NOT NULL,
  cep               VARCHAR(9)     NOT NULL,
  rua               VARCHAR(200)   NOT NULL,
  endereco_numero   VARCHAR(20)    NOT NULL,
  bairro            VARCHAR(120)   NOT NULL DEFAULT '',
  cidade            VARCHAR(120)   NOT NULL,
  uf                CHAR(2)        NOT NULL,

  -- Frete escolhido (congelado: a tabela de fretes pode mudar depois)
  frete_nome        VARCHAR(80)    NOT NULL,
  frete_prazo       VARCHAR(60)    NOT NULL DEFAULT '',
  frete_valor       DECIMAL(10,2)  NOT NULL DEFAULT 0,

  -- Dinheiro (cada desconto separado, para auditoria)
  forma_pagamento   ENUM('pix','cartao','boleto') NOT NULL,
  cupom             VARCHAR(40)    NULL,
  subtotal          DECIMAL(10,2)  NOT NULL,
  desconto_cupom    DECIMAL(10,2)  NOT NULL DEFAULT 0,
  desconto_pix      DECIMAL(10,2)  NOT NULL DEFAULT 0,
  total             DECIMAL(10,2)  NOT NULL,

  status            ENUM('recebido','pago','enviado','entregue','cancelado')
                    NOT NULL DEFAULT 'recebido',
  criado_em         TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_status (status),
  INDEX idx_criado (criado_em)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- ITENS_PEDIDO — as linhas de cada pedido
-- -----------------------------------------------------------------------------
-- `nome` e `preco_unitario` são CONGELADOS na hora da compra, de propósito:
-- se o produto mudar de preço ou for renomeado amanhã, o pedido de ontem tem
-- que continuar mostrando o que o cliente realmente pagou.
CREATE TABLE IF NOT EXISTS itens_pedido (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  pedido_id       INT            NOT NULL,
  produto_id      INT            NULL,      -- NULL se o produto for excluído depois
  nome            VARCHAR(180)   NOT NULL,
  preco_unitario  DECIMAL(10,2)  NOT NULL,
  quantidade      INT            NOT NULL,

  CONSTRAINT fk_item_pedido  FOREIGN KEY (pedido_id)  REFERENCES pedidos(id)  ON DELETE CASCADE,
  CONSTRAINT fk_item_produto FOREIGN KEY (produto_id) REFERENCES produtos(id) ON DELETE SET NULL,
  INDEX idx_pedido (pedido_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- SEED — os 12 produtos que a loja usa hoje no modo demonstração
-- =============================================================================
-- INSERT IGNORE: se o id já existir, a linha é pulada em vez de dar erro.
-- Assim dá para rodar o arquivo inteiro de novo sem duplicar nem quebrar.

INSERT IGNORE INTO produtos
  (id, nome, categoria, preco, preco_original, is_promo, frete_gratis, avaliacao, vendidos, quantidade, estoque_minimo, descricao)
VALUES
  (1,  'Smart TV 50" 4K UHD com Wi-Fi',              'TV & Vídeo',       1999.00, 2799.00, 1, 1, 4.5, 1200, 25, 5,
   'Smart TV 50 polegadas com resolução 4K, HDR e os principais apps de streaming já instalados. Imagem nítida e Wi-Fi integrado.'),
  (2,  'Air Fryer Digital 5L Antiaderente',          'Cozinha',           379.00,  599.00, 1, 1, 4.8, 3400, 40, 8,
   'Fritadeira sem óleo de 5 litros com painel digital, timer e cesto antiaderente. Refeições mais saudáveis em minutos.'),
  (3,  'Fone Bluetooth com Cancelamento de Ruído',   'Áudio',             269.00,  449.00, 1, 0, 4.6,  890, 60, 10,
   'Fone sem fio com cancelamento ativo de ruído, até 30h de bateria com o estojo e microfone para chamadas nítidas.'),
  (4,  'Liquidificador 1200W 12 Velocidades',        'Cozinha',           199.00,  329.00, 1, 1, 4.4, 2100, 35, 8,
   'Motor de 1200W, 12 velocidades e função pulsar. Copo resistente com lâminas em aço inox para triturar até gelo.'),
  (5,  'Ventilador de Torre Silencioso 3 Níveis',    'Climatização',      289.00,  419.00, 1, 0, 4.7,  760, 18, 5,
   'Ventilador de torre com oscilação, 3 velocidades e operação silenciosa. Design compacto que ocupa pouco espaço.'),
  (6,  'Micro-ondas 20L com Grill e Painel Digital', 'Eletrodomésticos',  549.00,  749.00, 1, 1, 4.5, 1500, 22, 5,
   'Micro-ondas de 20 litros com função grill, painel digital e programas automáticos para descongelar e aquecer.'),
  (7,  'Smartphone 128GB Tela 6.6" Câmera Tripla',   'Celulares',        1199.00, 1599.00, 1, 1, 4.6, 5200, 30, 6,
   'Smartphone com 128GB, tela de 6.6", câmera tripla e bateria de longa duração. Desempenho rápido no dia a dia.'),
  (8,  'Robô Aspirador Inteligente com App',         'Casa Inteligente',  899.00, 1299.00, 1, 1, 4.3,  430, 12, 3,
   'Robô aspirador com mapeamento inteligente, controle pelo aplicativo e retorno automático à base.'),
  (9,  'Cafeteira Elétrica 30 Xícaras',              'Cozinha',           189.00,  259.00, 1, 0, 4.7, 2800, 45, 10,
   'Cafeteira elétrica para 30 xícaras, sistema corta-pingos e jarra de vidro. Café fresquinho a qualquer hora.'),
  (10, 'Caixa de Som Bluetooth à Prova d''água',     'Áudio',             219.00,  349.00, 1, 1, 4.5, 1100, 50, 10,
   'Caixa de som portátil à prova d''água com som potente, graves reforçados e bateria de longa duração.'),
  (11, 'Câmera de Segurança Wi-Fi 360° Full HD',     'Casa Inteligente',  179.00,  289.00, 1, 1, 4.4,  940, 28, 6,
   'Câmera Wi-Fi com visão 360°, imagem Full HD, visão noturna e alertas de movimento no celular.'),
  (12, 'Frigobar 80L Baixo Consumo',                 'Eletrodomésticos',  779.00, 1199.00, 1, 1, 4.6,  640,  9, 4,
   'Frigobar de 80 litros com baixo consumo, prateleiras removíveis e porta reversível. Ideal para quartos e escritórios.');

-- =============================================================================
-- CONFERÊNCIA — rode depois e compare com o esperado
-- =============================================================================
-- IMPORTANTE: se a tabela `produtos` JÁ EXISTIA com outro formato (por exemplo
-- com colunas em inglês), o CREATE TABLE IF NOT EXISTS acima foi ignorado em
-- silêncio. A query abaixo mostra as colunas reais — confira antes de seguir.

SELECT COLUMN_NAME, COLUMN_TYPE, IS_NULLABLE, COLUMN_DEFAULT
  FROM INFORMATION_SCHEMA.COLUMNS
 WHERE TABLE_SCHEMA = 'bom_preco' AND TABLE_NAME = 'produtos'
 ORDER BY ORDINAL_POSITION;

SELECT COUNT(*) AS total_produtos FROM produtos;
SELECT id, nome, preco, quantidade FROM produtos ORDER BY nome LIMIT 5;
SELECT * FROM produtos WHERE quantidade <= estoque_minimo;  -- rota /estoque-baixo

-- =============================================================================
-- RESET (destrutivo) — descomente APENAS se quiser recomeçar do zero
-- =============================================================================
-- Apaga TODOS os dados. A ordem importa por causa das chaves estrangeiras.
--
-- DROP TABLE IF EXISTS itens_pedido;
-- DROP TABLE IF EXISTS pedidos;
-- DROP TABLE IF EXISTS produtos;
