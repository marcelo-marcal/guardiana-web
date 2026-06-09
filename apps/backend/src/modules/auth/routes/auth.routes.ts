import { Router } from "express";
import { AuthController } from "../controllers/AuthController.js";

const router = Router();
const controller = new AuthController();

router.post("/login", controller.login);
router.post("/request-code", controller.request);
router.post("/verify-code", controller.verify);
router.get("/me", controller.me); // Rota GET para validar o token/sessão
router.post("/admin-login", controller.adminLogin); // Nova rota para login de administrador
router.post("/complete-registration", controller.completeRegistration);

router.get("/settings/:key", controller.getSetting);
router.post("/settings", controller.updateSetting);

export { router as authRoutes };