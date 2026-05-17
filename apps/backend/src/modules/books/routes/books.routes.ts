// ================================
// IMPORTS
// ================================
import { Router } from "express";
import { BookController } from "../controllers/BookController.js";
import { authenticate } from "../../auth/middleware/authenticate.js";
import { authorize } from "../../auth/middleware/authorize.js";

const router = Router();
const controller = new BookController();

// ================================
// ROTAS PÚBLICAS
// ================================
router.get("/", controller.index.bind(controller)); // Lista todos livros ativos
router.get("/home-features", controller.homeFeatures.bind(controller)); // Lista livros em destaque na home
router.get("/:id", controller.show.bind(controller)); // Buscar livro por id

// ================================
// ROTAS PROTEGIDAS (ADMIN / SUPER_ADMIN)
// ================================
router.post("/", authenticate, authorize(["ADMIN", "SUPER_ADMIN"]), controller.create.bind(controller));
router.put("/:id", authenticate, authorize(["ADMIN", "SUPER_ADMIN"]), controller.update.bind(controller));
router.delete("/:id", authenticate, authorize(["ADMIN", "SUPER_ADMIN"]), controller.remove.bind(controller));

export { router as bookRoutes };