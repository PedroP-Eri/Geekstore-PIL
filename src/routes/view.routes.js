
import { Router } from "express";

import {
  getHomePage,
  getProductsPage,
  getProductDetailsPage,
} from "../controllers/view.controller.js";

const router = Router();

// Página inicial
router.get("/", getHomePage);

// Página com todos os produtos
router.get("/products", getProductsPage);

// Página de detalhes de um produto
router.get("/products/:id", getProductDetailsPage);

export default router;
;
