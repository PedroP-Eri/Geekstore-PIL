import {
  listarCategorias,
  buscarCategoriaPorId,
  criarCategoria,
  atualizarCategoria,
  excluirCategoria,
} from "../database/database.js";

export const getAllCategories = (req, res, next) => {
  try {
    const categories = listarCategorias();

    return res.status(200).json({
      sucesso: true,
      total: categories.length,
      categorias: categories,
    });
  } catch (error) {
    next(error);
  }
};

export const getCategoryById = (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        sucesso: false,
        mensagem: "ID da categoria inválido.",
      });
    }

    const category = buscarCategoriaPorId(id);

    if (!category) {
      return res.status(404).json({
        sucesso: false,
        mensagem: "Categoria não encontrada.",
      });
    }

    return res.status(200).json({
      sucesso: true,
      categoria: category,
    });
  } catch (error) {
    next(error);
  }
};

export const createCategory = (req, res, next) => {
  try {
    const { nome, descricao } = req.body;

    if (typeof nome !== "string" || !nome.trim()) {
      return res.status(400).json({
        sucesso: false,
        mensagem: "O nome da categoria é obrigatório.",
      });
    }

    const resultado = criarCategoria({
      nome: nome.trim(),
      descricao: descricao ?? null,
    });

    return res.status(201).json({
      sucesso: true,
      mensagem: "Categoria cadastrada com sucesso.",
      categoria: buscarCategoriaPorId(resultado.id),
    });
  } catch (error) {
    if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return res.status(409).json({
        sucesso: false,
        mensagem: "Já existe uma categoria com esse nome.",
      });
    }

    next(error);
  }
};

export const updateCategory = (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        sucesso: false,
        mensagem: "ID da categoria inválido.",
      });
    }

    const category = buscarCategoriaPorId(id);

    if (!category) {
      return res.status(404).json({
        sucesso: false,
        mensagem: "Categoria não encontrada.",
      });
    }

    const { nome, descricao } = req.body;

    if (typeof nome !== "string" || !nome.trim()) {
      return res.status(400).json({
        sucesso: false,
        mensagem: "O nome da categoria é obrigatório.",
      });
    }

    atualizarCategoria(id, {
      nome: nome.trim(),
      descricao: descricao ?? null,
    });

    return res.status(200).json({
      sucesso: true,
      mensagem: "Categoria atualizada com sucesso.",
      categoria: buscarCategoriaPorId(id),
    });
  } catch (error) {
    if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return res.status(409).json({
        sucesso: false,
        mensagem: "Já existe uma categoria com esse nome.",
      });
    }

    next(error);
  }
};

export const deleteCategory = (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        sucesso: false,
        mensagem: "ID da categoria inválido.",
      });
    }

    const category = buscarCategoriaPorId(id);

    if (!category) {
      return res.status(404).json({
        sucesso: false,
        mensagem: "Categoria não encontrada.",
      });
    }

    excluirCategoria(id);

    return res.status(200).json({
      sucesso: true,
      mensagem: "Categoria excluída com sucesso.",
    });
  } catch (error) {
    if (error.code === "SQLITE_CONSTRAINT_FOREIGNKEY") {
      return res.status(409).json({
        sucesso: false,
        mensagem:
          "Não é possível excluir esta categoria porque existem produtos vinculados a ela.",
      });
    }

    next(error);
  }
};
;
