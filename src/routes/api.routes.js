import { Router } from "express";

import productRoutes from "./product.routes.js";

import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller.js";

const router = Router();

// Rotas de produtos
router.use("/products", productRoutes);

// GET /api/categories
router.get("/categories", getAllCategories);

// GET /api/categories/:id
router.get("/categories/:id", getCategoryById);

// POST /api/categories
router.post("/categories", createCategory);

// PUT /api/categories/:id
router.put("/categories/:id", updateCategory);

// DELETE /api/categories/:id
router.delete("/categories/:id", deleteCategory);

export default router;
;
