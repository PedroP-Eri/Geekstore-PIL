import Database from "better-sqlite3";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const databasePath = resolve(__dirname, "../../database.db");
const schemaPath = resolve(__dirname, "tables.sql");

const db = new Database(databasePath);
db.pragma("foreign_keys = ON");
db.pragma("journal_mode = WAL");

const schema = readFileSync(schemaPath, "utf8");
db.exec(schema);

// Adiciona a coluna imagem em bancos já existentes.
const colunasProduto = db.prepare("PRAGMA table_info(produto)").all();

if (!colunasProduto.some((coluna) => coluna.name === "imagem")) {
  db.exec("ALTER TABLE produto ADD COLUMN imagem TEXT");
}
// Funções auxiliares reutilizadas pelas funções de cada entidade.
function all(sql, params = {}) {
  return db.prepare(sql).all(params);
}

function get(sql, params = {}) {
  return db.prepare(sql).get(params) ?? null;
}

function run(sql, params = {}) {
  const result = db.prepare(sql).run(params);
  return { id: Number(result.lastInsertRowid), alterados: result.changes };
}

// CLIENTES
export const listarClientes = () =>
  all("SELECT * FROM cliente ORDER BY id_cliente");
export const buscarClientePorId = (id) =>
  get("SELECT * FROM cliente WHERE id_cliente = @id", { id });
export function criarCliente({
  nome,
  nivel_fidelidade = "Bronze",
  desconto = 0,
  telefone = null,
}) {
  return run(
    `INSERT INTO cliente (nome, nivel_fidelidade, desconto, telefone)
              VALUES (@nome, @nivel_fidelidade, @desconto, @telefone)`,
    { nome, nivel_fidelidade, desconto, telefone },
  );
}
export function atualizarCliente(
  id,
  { nome, nivel_fidelidade, desconto, telefone },
) {
  return run(
    `UPDATE cliente SET nome=@nome, nivel_fidelidade=@nivel_fidelidade,
              desconto=@desconto, telefone=@telefone WHERE id_cliente=@id`,
    { id, nome, nivel_fidelidade, desconto, telefone },
  );
}
export const excluirCliente = (id) =>
  run("DELETE FROM cliente WHERE id_cliente = @id", { id });

// CONTAS DE CLIENTES
export const listarContas = () =>
  all(`SELECT cc.*, c.nome AS nome_cliente
  FROM conta_cliente cc JOIN cliente c ON c.id_cliente = cc.id_cliente ORDER BY cc.id_conta`);
export const buscarContaPorId = (id) =>
  get("SELECT * FROM conta_cliente WHERE id_conta=@id", { id });
export function criarConta({ id_cliente, email, senha, data_criacao }) {
  return run(
    `INSERT INTO conta_cliente (id_cliente, email, senha, data_criacao)
              VALUES (@id_cliente, @email, @senha, @data_criacao)`,
    { id_cliente, email, senha, data_criacao },
  );
}
export function atualizarConta(id, { id_cliente, email, senha, data_criacao }) {
  return run(
    `UPDATE conta_cliente SET id_cliente=@id_cliente, email=@email,
              senha=@senha, data_criacao=@data_criacao WHERE id_conta=@id`,
    { id, id_cliente, email, senha, data_criacao },
  );
}
export const excluirConta = (id) =>
  run("DELETE FROM conta_cliente WHERE id_conta=@id", { id });

// ENDEREÇOS
export const listarEnderecos = () =>
  all(`SELECT e.*, c.nome AS nome_cliente FROM endereco e
  JOIN cliente c ON c.id_cliente=e.id_cliente ORDER BY e.id_endereco`);
export const buscarEnderecoPorId = (id) =>
  get("SELECT * FROM endereco WHERE id_endereco=@id", { id });
export function criarEndereco({
  id_cliente,
  rua,
  numero,
  cidade,
  estado,
  cep,
}) {
  return run(
    `INSERT INTO endereco (id_cliente, rua, numero, cidade, estado, cep)
              VALUES (@id_cliente, @rua, @numero, @cidade, @estado, @cep)`,
    { id_cliente, rua, numero, cidade, estado, cep },
  );
}
export function atualizarEndereco(
  id,
  { id_cliente, rua, numero, cidade, estado, cep },
) {
  return run(
    `UPDATE endereco SET id_cliente=@id_cliente, rua=@rua, numero=@numero,
              cidade=@cidade, estado=@estado, cep=@cep WHERE id_endereco=@id`,
    { id, id_cliente, rua, numero, cidade, estado, cep },
  );
}
export const excluirEndereco = (id) =>
  run("DELETE FROM endereco WHERE id_endereco=@id", { id });

// VENDEDORES
export const listarVendedores = () =>
  all("SELECT * FROM vendedor ORDER BY id_vendedor");
export const buscarVendedorPorId = (id) =>
  get("SELECT * FROM vendedor WHERE id_vendedor=@id", { id });
export function criarVendedor({ nome, carga_horaria = null, salario = null }) {
  return run(
    "INSERT INTO vendedor (nome, carga_horaria, salario) VALUES (@nome, @carga_horaria, @salario)",
    { nome, carga_horaria, salario },
  );
}
export function atualizarVendedor(id, { nome, carga_horaria, salario }) {
  return run(
    "UPDATE vendedor SET nome=@nome, carga_horaria=@carga_horaria, salario=@salario WHERE id_vendedor=@id",
    { id, nome, carga_horaria, salario },
  );
}
export const excluirVendedor = (id) =>
  run("DELETE FROM vendedor WHERE id_vendedor=@id", { id });

// CATEGORIAS
export const listarCategorias = () =>
  all("SELECT * FROM categoria ORDER BY nome");
export const buscarCategoriaPorId = (id) =>
  get("SELECT * FROM categoria WHERE id_categoria=@id", { id });
export function criarCategoria({ nome, descricao = null }) {
  return run(
    "INSERT INTO categoria (nome, descricao) VALUES (@nome, @descricao)",
    { nome, descricao },
  );
}
export function atualizarCategoria(id, { nome, descricao }) {
  return run(
    "UPDATE categoria SET nome=@nome, descricao=@descricao WHERE id_categoria=@id",
    { id, nome, descricao },
  );
}
export const excluirCategoria = (id) =>
  run("DELETE FROM categoria WHERE id_categoria=@id", { id });

// PRODUTOS
export const listarProdutos = () =>
  all(`
    SELECT p.*, c.nome AS categoria
    FROM produto p
    JOIN categoria c ON c.id_categoria = p.id_categoria
    ORDER BY p.id_produto
  `);

export const buscarProdutoPorId = (id) =>
  get(
    `
      SELECT p.*, c.nome AS categoria
      FROM produto p
      JOIN categoria c ON c.id_categoria = p.id_categoria
      WHERE p.id_produto = @id
    `,
    { id },
  );

export function criarProduto({
  nome,
  descricao = null,
  preco,
  estoque = 0,
  id_categoria,
  imagem = null,
}) {
  return run(
    `
      INSERT INTO produto (
        nome,
        descricao,
        preco,
        estoque,
        id_categoria,
        imagem
      )
      VALUES (
        @nome,
        @descricao,
        @preco,
        @estoque,
        @id_categoria,
        @imagem
      )
    `,
    {
      nome,
      descricao,
      preco,
      estoque,
      id_categoria,
      imagem,
    },
  );
}

export function atualizarProduto(
  id,
  {
    nome,
    descricao = null,
    preco,
    estoque,
    id_categoria,
    imagem = null,
  },
) {
  return run(
    `
      UPDATE produto
      SET nome = @nome,
          descricao = @descricao,
          preco = @preco,
          estoque = @estoque,
          id_categoria = @id_categoria,
          imagem = @imagem
      WHERE id_produto = @id
    `,
    {
      id,
      nome,
      descricao,
      preco,
      estoque,
      id_categoria,
      imagem,
    },
  );
}

export const excluirProduto = (id) =>
  run("DELETE FROM produto WHERE id_produto = @id", { id });

// VENDAS E ITENS
export const listarVendas = () =>
  all(`SELECT v.*, c.nome AS cliente, ve.nome AS vendedor,
  COALESCE(SUM(iv.quantidade * iv.preco_unitario), 0) AS total
  FROM venda v JOIN cliente c ON c.id_cliente=v.id_cliente
  JOIN vendedor ve ON ve.id_vendedor=v.id_vendedor
  LEFT JOIN item_venda iv ON iv.id_venda=v.id_venda
  GROUP BY v.id_venda ORDER BY v.id_venda`);
export const buscarVendaPorId = (id) =>
  get(
    `SELECT v.*, c.nome AS cliente, ve.nome AS vendedor
  FROM venda v JOIN cliente c ON c.id_cliente=v.id_cliente
  JOIN vendedor ve ON ve.id_vendedor=v.id_vendedor WHERE v.id_venda=@id`,
    { id },
  );
export function criarVenda({
  id_cliente,
  id_vendedor,
  data_venda,
  status = "Concluída",
}) {
  return run(
    `INSERT INTO venda (id_cliente, id_vendedor, data_venda, status)
              VALUES (@id_cliente, @id_vendedor, @data_venda, @status)`,
    { id_cliente, id_vendedor, data_venda, status },
  );
}
export function atualizarVenda(
  id,
  { id_cliente, id_vendedor, data_venda, status },
) {
  return run(
    `UPDATE venda SET id_cliente=@id_cliente, id_vendedor=@id_vendedor,
              data_venda=@data_venda, status=@status WHERE id_venda=@id`,
    { id, id_cliente, id_vendedor, data_venda, status },
  );
}
export const excluirVenda = (id) =>
  run("DELETE FROM venda WHERE id_venda=@id", { id });

export const listarItensVenda = (idVenda) =>
  all(
    `SELECT iv.*, p.nome AS produto
  FROM item_venda iv JOIN produto p ON p.id_produto=iv.id_produto
  WHERE iv.id_venda=@idVenda ORDER BY p.nome`,
    { idVenda },
  );
export function adicionarItemVenda({
  id_venda,
  id_produto,
  quantidade,
  preco_unitario,
}) {
  return run(
    `INSERT INTO item_venda (id_venda, id_produto, quantidade, preco_unitario)
              VALUES (@id_venda, @id_produto, @quantidade, @preco_unitario)`,
    { id_venda, id_produto, quantidade, preco_unitario },
  );
}
export function atualizarItemVenda(
  id_venda,
  id_produto,
  { quantidade, preco_unitario },
) {
  return run(
    `UPDATE item_venda SET quantidade=@quantidade, preco_unitario=@preco_unitario
              WHERE id_venda=@id_venda AND id_produto=@id_produto`,
    { id_venda, id_produto, quantidade, preco_unitario },
  );
}
export const removerItemVenda = (id_venda, id_produto) =>
  run(
    "DELETE FROM item_venda WHERE id_venda=@id_venda AND id_produto=@id_produto",
    { id_venda, id_produto },
  );

// PAGAMENTOS
export const listarPagamentos = () =>
  all(`SELECT pg.*, v.id_cliente FROM pagamento pg
  JOIN venda v ON v.id_venda=pg.id_venda ORDER BY pg.id_pagamento`);
export const buscarPagamentoPorId = (id) =>
  get("SELECT * FROM pagamento WHERE id_pagamento=@id", { id });
export function criarPagamento({
  id_venda,
  forma_pagamento,
  valor,
  data_pagamento,
  status,
}) {
  return run(
    `INSERT INTO pagamento (id_venda, forma_pagamento, valor, data_pagamento, status)
              VALUES (@id_venda, @forma_pagamento, @valor, @data_pagamento, @status)`,
    { id_venda, forma_pagamento, valor, data_pagamento, status },
  );
}
export function atualizarPagamento(
  id,
  { id_venda, forma_pagamento, valor, data_pagamento, status },
) {
  return run(
    `UPDATE pagamento SET id_venda=@id_venda, forma_pagamento=@forma_pagamento,
              valor=@valor, data_pagamento=@data_pagamento, status=@status WHERE id_pagamento=@id`,
    { id, id_venda, forma_pagamento, valor, data_pagamento, status },
  );
}
export const excluirPagamento = (id) =>
  run("DELETE FROM pagamento WHERE id_pagamento=@id", { id });

// AVALIAÇÕES
export const listarAvaliacoes = () =>
  all(`SELECT a.*, c.nome AS cliente, p.nome AS produto
  FROM avaliacao a JOIN cliente c ON c.id_cliente=a.id_cliente
  JOIN produto p ON p.id_produto=a.id_produto ORDER BY a.id_avaliacao`);
export const buscarAvaliacaoPorId = (id) =>
  get("SELECT * FROM avaliacao WHERE id_avaliacao=@id", { id });
export function criarAvaliacao({
  id_cliente,
  id_produto,
  nota,
  comentario = null,
  data_avaliacao,
}) {
  return run(
    `INSERT INTO avaliacao (id_cliente, id_produto, nota, comentario, data_avaliacao)
              VALUES (@id_cliente, @id_produto, @nota, @comentario, @data_avaliacao)`,
    { id_cliente, id_produto, nota, comentario, data_avaliacao },
  );
}
export function atualizarAvaliacao(
  id,
  { id_cliente, id_produto, nota, comentario, data_avaliacao },
) {
  return run(
    `UPDATE avaliacao SET id_cliente=@id_cliente, id_produto=@id_produto,
              nota=@nota, comentario=@comentario, data_avaliacao=@data_avaliacao
              WHERE id_avaliacao=@id`,
    { id, id_cliente, id_produto, nota, comentario, data_avaliacao },
  );
}
export const excluirAvaliacao = (id) =>
  run("DELETE FROM avaliacao WHERE id_avaliacao=@id", { id });

// CONSULTAS DE RELATÓRIO / DASHBOARD
export const listarProdutosComEstoqueBaixo = (limite = 5) =>
  all("SELECT * FROM produto WHERE estoque <= @limite ORDER BY estoque", {
    limite,
  });
export const buscarProdutoMaisCaro = () =>
  get("SELECT * FROM produto ORDER BY preco DESC LIMIT 1");
export const contarProdutosPorCategoria = () =>
  all(`SELECT c.id_categoria, c.nome,
  COUNT(p.id_produto) AS quantidade_produtos FROM categoria c
  LEFT JOIN produto p ON p.id_categoria=c.id_categoria
  GROUP BY c.id_categoria ORDER BY c.nome`);
export const listarClientesComVendas = () =>
  all(`SELECT DISTINCT c.* FROM cliente c
  JOIN venda v ON v.id_cliente=c.id_cliente ORDER BY c.nome`);
export const obterMediaAvaliacoes = () =>
  all(`SELECT p.id_produto, p.nome,
  ROUND(AVG(a.nota), 2) AS media, COUNT(a.id_avaliacao) AS total_avaliacoes
  FROM produto p LEFT JOIN avaliacao a ON a.id_produto=p.id_produto
  GROUP BY p.id_produto ORDER BY p.nome`);
export const obterTotalPorVenda = (idVenda) =>
  get(
    `SELECT v.id_venda,
  COALESCE(SUM(iv.quantidade * iv.preco_unitario), 0) AS total
  FROM venda v LEFT JOIN item_venda iv ON iv.id_venda=v.id_venda
  WHERE v.id_venda=@idVenda GROUP BY v.id_venda`,
    { idVenda },
  );

export function fecharBanco() {
  if (db.open) db.close();
}

export default db;
