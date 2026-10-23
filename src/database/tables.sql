PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS cliente (
    id_cliente INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    nivel_fidelidade TEXT DEFAULT 'Bronze',
    desconto REAL DEFAULT 0,
    telefone TEXT
);

CREATE TABLE IF NOT EXISTS conta_cliente (
    id_conta INTEGER PRIMARY KEY AUTOINCREMENT,
    id_cliente INTEGER NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    senha TEXT NOT NULL,
    data_criacao TEXT NOT NULL,
    FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente)
);

CREATE TABLE IF NOT EXISTS endereco (
    id_endereco INTEGER PRIMARY KEY AUTOINCREMENT,
    id_cliente INTEGER NOT NULL,
    rua TEXT NOT NULL,
    numero TEXT NOT NULL,
    cidade TEXT NOT NULL,
    estado TEXT NOT NULL,
    cep TEXT NOT NULL,
    FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente)
);

CREATE TABLE IF NOT EXISTS vendedor (
    id_vendedor INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    carga_horaria INTEGER,
    salario REAL
);

CREATE TABLE IF NOT EXISTS categoria (
    id_categoria INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL UNIQUE,
    descricao TEXT
);

CREATE TABLE IF NOT EXISTS produto (
    id_produto INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    descricao TEXT,
    preco REAL NOT NULL,
    estoque INTEGER NOT NULL DEFAULT 0,
    id_categoria INTEGER NOT NULL,
    imagem TEXT,
    FOREIGN KEY (id_categoria) REFERENCES categoria(id_categoria)
);

CREATE TABLE IF NOT EXISTS venda (
    id_venda INTEGER PRIMARY KEY AUTOINCREMENT,
    id_cliente INTEGER NOT NULL,
    id_vendedor INTEGER NOT NULL,
    data_venda TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Concluída',
    FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente),
    FOREIGN KEY (id_vendedor) REFERENCES vendedor(id_vendedor)
);

CREATE TABLE IF NOT EXISTS item_venda (
    id_venda INTEGER NOT NULL,
    id_produto INTEGER NOT NULL,
    quantidade INTEGER NOT NULL,
    preco_unitario REAL NOT NULL,
    PRIMARY KEY (id_venda, id_produto),
    FOREIGN KEY (id_venda) REFERENCES venda(id_venda),
    FOREIGN KEY (id_produto) REFERENCES produto(id_produto)
);

CREATE TABLE IF NOT EXISTS pagamento (
    id_pagamento INTEGER PRIMARY KEY AUTOINCREMENT,
    id_venda INTEGER NOT NULL UNIQUE,
    forma_pagamento TEXT NOT NULL,
    valor REAL NOT NULL,
    data_pagamento TEXT NOT NULL,
    status TEXT NOT NULL,
    FOREIGN KEY (id_venda) REFERENCES venda(id_venda)
);

CREATE TABLE IF NOT EXISTS avaliacao (
    id_avaliacao INTEGER PRIMARY KEY AUTOINCREMENT,
    id_cliente INTEGER NOT NULL,
    id_produto INTEGER NOT NULL,
    nota INTEGER NOT NULL,
    comentario TEXT,
    data_avaliacao TEXT NOT NULL,
    FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente),
    FOREIGN KEY (id_produto) REFERENCES produto(id_produto)
);


CREATE TABLE IF NOT EXISTS entrega (
    id_entrega INTEGER PRIMARY KEY AUTOINCREMENT,
    id_venda INTEGER NOT NULL UNIQUE,
    status_entrega TEXT NOT NULL DEFAULT 'Pendente',
    codigo_rastreio TEXT UNIQUE,
    endereco_destino TEXT NOT NULL,
    data_envio TEXT,
    data_entrega TEXT,
    FOREIGN KEY (id_venda) REFERENCES venda(id_venda)
);


CREATE TABLE IF NOT EXISTS movimentacao_estoque (
    id_movimentacao INTEGER PRIMARY KEY AUTOINCREMENT,
    id_produto INTEGER NOT NULL,
    tipo_movimentacao TEXT NOT NULL
        CHECK (tipo_movimentacao IN ('ENTRADA', 'SAIDA')),
    quantidade INTEGER NOT NULL
        CHECK (quantidade > 0),
    motivo TEXT,
    data_movimentacao TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_produto) REFERENCES produto(id_produto)
);



INSERT OR IGNORE INTO cliente (id_cliente, nome, nivel_fidelidade, desconto, telefone) VALUES
(1, 'Pedro', 'Ouro', 10, '88999990001'),
(2, 'Italo', 'Ouro', 10, '88999990002'),
(3, 'Levi', 'Prata', 5, '88999990003'),
(4, 'João Pedro', 'Ouro', 10, '88999990004'),
(5, 'Davi', 'Prata', 5, '88999990005');

INSERT OR IGNORE INTO conta_cliente (id_conta, id_cliente, email, senha, data_criacao) VALUES
(1, 1, 'pedro@gmail.com', 'senha123', '2026-09-01'),
(2, 2, 'italo@gmail.com', 'senha456', '2026-09-02'),
(3, 3, 'levi@gmail.com', 'senha789', '2026-09-03'),
(4, 4, 'JP@gmail.com', 'senha321', '2026-09-04'),
(5, 5, 'davi@gmail.com', 'senha654', '2026-09-05');

INSERT OR IGNORE INTO endereco (id_endereco, id_cliente, rua, numero, cidade, estado, cep) VALUES
(1, 1, 'Rua Grande', '100', 'Fortim', 'CE', '62815-000'),
(2, 2, 'Rua Principal', '200', 'Fortim', 'CE', '62815-001'),
(3, 3, 'Rua Central', '300', 'Aracati', 'CE', '62800-000'),
(4, 4, 'Rua das Flores', '400', 'Aracati', 'CE', '62800-001'),
(5, 5, 'Avenida Brasil', '500', 'Fortaleza', 'CE', '60000-000');

INSERT OR IGNORE INTO vendedor (id_vendedor, nome, carga_horaria, salario) VALUES
(1, 'João', 40, 2000),
(2, 'Maria', 30, 1500),
(3, 'Carlos', 20, 1000);

INSERT OR IGNORE INTO categoria (id_categoria, nome, descricao) VALUES
(1, 'Roupas', 'Produtos de vestuário geek'),
(2, 'Acessórios', 'Canecas, chaveiros e acessórios'),
(3, 'Colecionáveis', 'Itens raros para colecionadores'),
(4, 'Action Figures', 'Bonecos e figuras de personagens'),
(5, 'HQs', 'Histórias em quadrinhos e mangás');

INSERT OR IGNORE INTO produto (id_produto, nome, descricao, preco, estoque, id_categoria) VALUES
(1, 'Camisa One Piece', 'Camisa temática de One Piece', 79.90, 20, 1),
(2, 'Caneca Fire Force', 'Caneca temática de Fire Force', 39.90, 15, 2),
(3, 'Cartas raras Pokémon TCG 1999', 'Coleção de cartas raras de Pokémon', 999.90, 3, 3),
(4, 'Action Figure Joker Persona 5 Royal', 'Action figure do Joker de Persona 5 Royal', 299.90, 8, 4),
(5, 'HQ A Última Caçada de Kraven', 'História em quadrinhos da Marvel', 59.90, 12, 5);

INSERT OR IGNORE INTO venda (id_venda, id_cliente, id_vendedor, data_venda, status) VALUES
(1, 1, 1, '2026-09-10', 'Concluída'),
(2, 2, 2, '2026-09-11', 'Concluída'),
(3, 3, 1, '2026-09-12', 'Concluída'),
(4, 4, 3, '2026-09-13', 'Concluída');

INSERT OR IGNORE INTO item_venda (id_venda, id_produto, quantidade, preco_unitario) VALUES
(1, 1, 2, 79.90),
(1, 2, 1, 39.90),
(2, 3, 1, 999.90),
(2, 5, 2, 59.90),
(3, 4, 1, 299.90),
(4, 1, 1, 79.90),
(4, 5, 1, 59.90);

INSERT OR IGNORE INTO pagamento (id_pagamento, id_venda, forma_pagamento, valor, data_pagamento, status) VALUES
(1, 1, 'Pix', 199.70, '2026-09-10', 'Pago'),
(2, 2, 'Cartao', 1119.70, '2026-09-11', 'Pago'),
(3, 3, 'Pix', 299.90, '2026-09-12', 'Pago'),
(4, 4, 'Cartao', 139.80, '2026-09-13', 'Pago');

INSERT OR IGNORE INTO avaliacao (id_avaliacao, id_cliente, id_produto, nota, comentario, data_avaliacao) VALUES
(1, 1, 1, 5, 'Produto excelente', '2026-09-11'),
(2, 2, 3, 5, 'Produto muito bom', '2026-09-12'),
(3, 3, 4, 4, 'Gostei bastante', '2026-09-13'),
(4, 4, 5, 5, 'HQ muito boa', '2026-09-14');


INSERT INTO entrega (
    id_venda,
    status_entrega,
    codigo_rastreio,
    endereco_destino,
    data_envio
) VALUES (
    1,
    'Enviado',
    'BR123456789',
    'Rua Central, 300 - Aracati, CE',
    CURRENT_TIMESTAMP
);


INSERT INTO movimentacao_estoque (
    id_produto,
    tipo_movimentacao,
    quantidade,
    motivo
) VALUES (
    1,
    'ENTRADA',
    10,
    'Reposição de mercadoria'
);


INSERT INTO movimentacao_estoque (
    id_produto,
    tipo_movimentacao,
    quantidade,
    motivo
) VALUES (
    1,
    'SAIDA',
    2,
    'Baixa de estoque'
);
