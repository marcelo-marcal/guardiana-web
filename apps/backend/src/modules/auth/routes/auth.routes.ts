// ================================
// IMPORTS
// ================================
import { Router } from "express";
import { AuthController } from "../controllers/AuthController.js";
import { MeController } from "../controllers/MeController.js";
import { authenticate } from "../middleware/authenticate.js";

// ================================
// ROUTER
// ================================
const authRoutes = Router();
const authController = new AuthController();
const meController = new MeController();

// ================================
// ROTAS DE AUTENTICAÇÃO
// ================================
authRoutes.post("/login", (request, response) => {
    return authController.login(request, response);
});

// ================================
// ROTA DO USUÁRIO LOGADO
// ================================
authRoutes.get("/me", authenticate, (request, response) => {
    return meController.show(request, response);
});

export { authRoutes };