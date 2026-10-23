
import express from "express";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import apiRoutes from "./routes/api.routes.js";
import viewRoutes from "./routes/view.routes.js";
import { debugMiddleware } from "./middlewares/debug.middleware.js";
import { notFoundMiddlewares } from "./middlewares/notFound.middleware.js";

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

// Configuração das páginas EJS
app.set("view engine", "ejs");
app.set("views", join(__dirname, "views"));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// A pasta public fica na raiz do projeto, um nível acima de src.
app.use(express.static(join(__dirname, "../public")));

app.use(debugMiddleware);

// API
app.use("/api", apiRoutes);

// Páginas do site
app.use("/", viewRoutes);

// Rota de endereço inexistente: deve ficar por último.
app.use(notFoundMiddlewares);

export default app;