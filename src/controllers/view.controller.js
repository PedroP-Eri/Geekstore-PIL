import {
  listarProdutos,
  buscarProdutoPorId,
  listarCategorias,
} from "../database/database.js";

export const getHomePage = (req, res, next) => {
  try {
    const products = listarProdutos();
    const categories = listarCategorias();

    res.render("layouts/main", {
      titulo: "GeekStore - Início",
      pagina: "home",
      products,
      categories,
    });
  } catch (error) {
    next(error);
  }
};

export const getProductsPage = (req, res, next) => {
  try {
    const categories = listarCategorias();
    const busca = String(req.query.q || "").trim().toLowerCase();

    let products = listarProdutos();

    if (busca) {
      products = products.filter((product) =>
        `${product.nome} ${product.categoria} ${product.descricao || ""}`
          .toLowerCase()
          .includes(busca)
      );
    }

    res.render("layouts/main", {
      titulo: "GeekStore - Loja",
      pagina: "products",
      products,
      categories,
      busca,
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

    res.render("layouts/main", {
      titulo: `GeekStore - ${product.nome}`,
      pagina: "product-form",
      product,
      categories: listarCategorias(),
    });
  } catch (error) {
    next(error);
  }
};

// Páginas que não precisam consultar o banco para abrir.
export const getCartPage = (req, res) => {
  res.render("layouts/main", {
    titulo: "GeekStore - Carrinho",
    pagina: "cart",
  });
};

export const getNotificationsPage = (req, res) => {
  res.render("layouts/main", {
    titulo: "GeekStore - Notificações",
    pagina: "notifications",
  });
};

export const getWishlistPage = (req, res) => {
  res.render("layouts/main", {
    titulo: "GeekStore - Lista de desejos",
    pagina: "wishlist",
  });
};

export const getAccountPage = (req, res) => {
  res.render("layouts/main", {
    titulo: "GeekStore - Conta",
    pagina: "account",
  });
};