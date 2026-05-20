import { Router } from "express";
import { AuthController } from "../controllers/AuthController.js";

const router = Router();
const controller = new AuthController();

router.post("/request-code", controller.request);
router.post("/verify-code", controller.verify);
router.post("/admin-login", controller.adminLogin); // Nova rota para login de administrador

export { router as authRoutes };