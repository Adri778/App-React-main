-- =============================================================================
-- bom_preco · schema de referência da tabela `produtos`
-- =============================================================================
-- Esta tabela atende DOIS consumidores ao mesmo tempo:
--
--   1) App de estoque (React Native)  -> usa nome, preco, quantidade, estoque_minimo
--   2) Loja / storefront (web)        -> usa nome, preco, preco_original, categoria,
--                                        imagem, is_promo, frete_gratis, avaliacao,
--                                        vendidos, descricao
--
-- CONVENÇÃO: todas as colunas em português.
--   Motivo: as queries de backend/models/Produto.js já assumem português
--   (`ORDER BY nome`, `quantidade <= estoque_minimo`), e o normalizador da loja
--   (loja-react/src/models/calculos.js) aceita os dois idiomas — então o
--   português é o único conjunto que funciona nos dois lados sem remendo.
--
-- ATENÇÃO: backend/controllers/ProdutoController.js (lerEntrada) hoje monta o
--   INSERT com chaves em INGLÊS (name, price, category, image, originalPrice,
--   isPromo). Contra este schema, o POST /api/produtos falha com
--   "Unknown column 'name' in 'field list'". Corrigir lerEntrada para português.
--
-- Uso:  mysql -u root -p < schema.sql
-- =============================================================================

CREATE DATABASE IF NOT EXISTS bom_preco
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE bom_preco;

DROP TABLE IF EXISTS produtos;

CREATE TABLE produtos (
  id              INT AUTO_INCREMENT PRIMARY KEY,

  -- --- Identidade do produto (usado pelos dois consumidores) ---------------
  nome            VARCHAR(180)   NOT NULL,
  categoria       VARCHAR(80)    NOT NULL DEFAULT '',
  descricao       TEXT           NULL,
  imagem          VARCHAR(500)   NOT NULL DEFAULT '',
  preco           DECIMAL(10,2)  NOT NULL,

  -- --- Vitrine da loja ------------------------------------------------------
  -- preco_original alimenta o cálculo de "-X%" (calculos.js -> descontoPct).
  preco_original  DECIMAL(10,2)  NULL,
  is_promo        TINYINT(1)     NOT NULL DEFAULT 0,
  frete_gratis    TINYINT(1)     NOT NULL DEFAULT 0,
  avaliacao       DECIMAL(2,1)   NULL,      -- 0.0 a 5.0 — vira as estrelas do card
  vendidos        INT            NOT NULL DEFAULT 0,
  link            VARCHAR(500)   NOT NULL DEFAULT '',  -- link de afiliado (hoje sem uso na View)

  -- --- Controle de estoque (app React Native) ------------------------------
  quantidade      INT            NOT NULL DEFAULT 0,
  estoque_minimo  INT            NOT NULL DEFAULT 0,

  criado_em       TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_categoria (categoria),
  INDEX idx_promo     (is_promo),
  INDEX idx_vendidos  (vendidos)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- SEED — os 12 produtos de loja-react/src/models/dadosDemo.js
-- Com isso a loja mostra exatamente o mesmo catálogo do modo demonstração,
-- porém vindo do banco de verdade (o selo "demonstração · API offline" some).
-- =============================================================================

INSERT INTO produtos
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

-- Conferência rápida:
--   SELECT id, nome, preco, preco_original, quantidade FROM produtos ORDER BY nome;
--   SELECT * FROM produtos WHERE quantidade <= estoque_minimo;  -- rota /estoque-baixo
