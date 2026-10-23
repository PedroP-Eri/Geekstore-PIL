import {
  listarProdutos,
  buscarProdutoPorId,
  criarProduto,
  atualizarProduto,
  excluirProduto,
} from "../database/database.js";

export const getAllProducts = (req, res, next) => {
  try {
    const products = listarProdutos();

    return res.status(200).json({
      sucesso: true,
      total: products.length,
      produtos: products,
    });
  } catch (error) {
    next(error);
  }
};

export const getProductById = (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        sucesso: false,
        mensagem: "ID do produto inválido.",
      });
    }

    const product = buscarProdutoPorId(id);

    if (!product) {
      return res.status(404).json({
        sucesso: false,
        mensagem: "Produto não encontrado.",
      });
    }

    return res.status(200).json({
      sucesso: true,
      produto: product,
    });
  } catch (error) {
    next(error);
  }
};

export const createProduct = (req, res, next) => {
  try {
    const {
      nome,
      descricao,
      preco,
      estoque,
      id_categoria,
      imagem,
    } = req.body;

    if (
      typeof nome !== "string" ||
      !nome.trim() ||
      preco === undefined ||
      preco === null ||
      preco === "" ||
      !Number.isFinite(Number(preco)) ||
      Number(preco) < 0 ||
      (estoque !== undefined &&
        (!Number.isInteger(Number(estoque)) || Number(estoque) < 0)) ||
      !Number.isInteger(Number(id_categoria)) ||
      Number(id_categoria) <= 0 ||
      (imagem !== undefined &&
        imagem !== null &&
        typeof imagem !== "string")
    ) {
      return res.status(400).json({
        sucesso: false,
        mensagem:
          "Informe nome, preço válido, estoque inteiro não negativo, categoria válida e um caminho de imagem válido.",
      });
    }

    const resultado = criarProduto({
      nome: nome.trim(),
      descricao: descricao ?? null,
      preco: Number(preco),
      estoque: estoque === undefined ? 0 : Number(estoque),
      id_categoria: Number(id_categoria),
      imagem: imagem?.trim() || null,
    });

    const product = buscarProdutoPorId(resultado.id);

    return res.status(201).json({
      sucesso: true,
      mensagem: "Produto cadastrado com sucesso.",
      produto: product,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        sucesso: false,
        mensagem: "ID do produto inválido.",
      });
    }

    const product = buscarProdutoPorId(id);

    if (!product) {
      return res.status(404).json({
        sucesso: false,
        mensagem: "Produto não encontrado.",
      });
    }

    const {
      nome,
      descricao,
      preco,
      estoque,
      id_categoria,
      imagem,
    } = req.body;

    if (
      typeof nome !== "string" ||
      !nome.trim() ||
      preco === undefined ||
      preco === null ||
      preco === "" ||
      !Number.isFinite(Number(preco)) ||
      Number(preco) < 0 ||
      !Number.isInteger(Number(estoque)) ||
      Number(estoque) < 0 ||
      !Number.isInteger(Number(id_categoria)) ||
      Number(id_categoria) <= 0 ||
      (imagem !== undefined &&
        imagem !== null &&
        typeof imagem !== "string")
    ) {
      return res.status(400).json({
        sucesso: false,
        mensagem:
          "Informe nome, preço válido, estoque inteiro não negativo e ID de categoria válido.",
      });
    }

    atualizarProduto(id, {
      nome: nome.trim(),
      descricao: descricao ?? null,
      preco: Number(preco),
      estoque: Number(estoque),
      id_categoria: Number(id_categoria),
      imagem:
        imagem === undefined
          ? product.imagem
          : imagem?.trim() || null,
    });

    return res.status(200).json({
      sucesso: true,
      mensagem: "Produto atualizado com sucesso.",
      produto: buscarProdutoPorId(id),
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        sucesso: false,
        mensagem: "ID do produto inválido.",
      });
    }

    const product = buscarProdutoPorId(id);

    if (!product) {
      return res.status(404).json({
        sucesso: false,
        mensagem: "Produto não encontrado.",
      });
    }

    excluirProduto(id);

    return res.status(200).json({
      sucesso: true,
      mensagem: "Produto excluído com sucesso.",
    });
  } catch (error) {
    next(error);
  }
};