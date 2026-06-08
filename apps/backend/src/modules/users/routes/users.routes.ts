// ================================
// IMPORTS
// ================================
import { Router } from "express";
import { UserController } from "../controllers/UserController.js";
import { authenticate } from "../../auth/middleware/authenticate.js";
import { authorize } from "../../auth/middleware/authorize.js";

// ================================
// ROUTER
// ================================
const userRoutes = Router();
const userController = new UserController();

// ================================
// ROTAS PÚBLICAS
// ================================
userRoutes.post("/", (request, response) => {
    return userController.create(request, response);
});

// ================================
// PERFIL DO USUÁRIO LOGADO
// ================================
userRoutes.get("/me", authenticate, (request, response) => {
    return userController.me(request, response);
});

userRoutes.put("/me", authenticate, (request, response) => {
    return userController.updateMe(request, response);
});

// ================================
// ROTAS PROTEGIDAS ADMIN
// ================================
userRoutes.get(
    "/",
    authenticate,
    authorize(["ADMIN", "SUPER_ADMIN"]),
    (request, response) => {
        return userController.index(request, response);
    },
);

userRoutes.post(
    "/admin",
    authenticate,
    authorize(["ADMIN", "SUPER_ADMIN"]),
    (request, response) => {
        return userController.adminCreate(request, response);
    },
);

userRoutes.put(
    "/:id",
    authenticate,
    authorize(["ADMIN", "SUPER_ADMIN"]),
    (request, response) => {
        return userController.adminUpdate(request, response);
    },
);

userRoutes.delete(
    "/:id",
    authenticate,
    authorize(["ADMIN", "SUPER_ADMIN"]),
    (request, response) => {
        return userController.adminDelete(request, response);
    },
);

export { userRoutes };