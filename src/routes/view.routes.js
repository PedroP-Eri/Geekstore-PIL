import { Router } from "express";

import {
  getHomePage,
  getProductsPage,
  getProductDetailsPage,
  getCartPage,
  getNotificationsPage,
  getWishlistPage,
  getAccountPage,
} from "../controllers/view.controller.js";

const router = Router();

router.get("/", getHomePage);
router.get("/products", getProductsPage);
router.get("/products/:id", getProductDetailsPage);

router.get("/cart", getCartPage);
router.get("/notifications", getNotificationsPage);
router.get("/wishlist", getWishlistPage);
router.get("/account", getAccountPage);

export default router;
