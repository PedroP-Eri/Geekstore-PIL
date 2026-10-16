import {
  listarProdutos,
  buscarProdutoPorId,
  listarCategorias,
} from "../database/database.js";

export const getHomePage = (req, res, next) => {
  try {
    const products = listarProdutos();
    const categories = listarCategorias();

    return res.render("pages/home", {
      titulo: "GeekStore - Início",
      products,
      categories,
    });
  } catch (error) {
    next(error);
  }
};

export const getProductsPage = (req, res, next) => {
  try {
    const products = listarProdutos();
    const categories = listarCategorias();

    return res.render("pages/products", {
      titulo: "GeekStore - Produtos",
      products,
      categories,
    });
  } catch (error) {
    next(error);
  }
};

export const getProductDetailsPage = (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).send("ID do produto inválido.");
    }

    const product = buscarProdutoPorId(id);

    if (!product) {
      return res.status(404).send("Produto não encontrado.");
    }

    return res.render("pages/product-form", {
      titulo: `GeekStore - ${product.nome}`,
      product,
      produto: product,
      categories: listarCategorias(),
    });
  } catch (error) {
    next(error);
  }
};
