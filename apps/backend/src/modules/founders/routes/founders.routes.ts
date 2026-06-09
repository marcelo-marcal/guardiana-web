// ================================
// IMPORTS
// ================================
import { Router } from "express";
import { FounderController } from "../controllers/FounderController.js";
import { authenticate } from "../../auth/middleware/authenticate.js";
import { authorize } from "../../auth/middleware/authorize.js";

// ================================
// ROUTER
// ================================
const founderRoutes = Router();
const founderController = new FounderController();

// ================================
// ROTAS PÚBLICAS
// ================================
founderRoutes.get("/", (request, response) => {
    return founderController.index(request, response);
});

// ================================
// ROTAS PROTEGIDAS ADMIN
// ================================
founderRoutes.post(
    "/",
    authenticate,
    authorize(["ADMIN", "SUPER_ADMIN"]),
    (request, response) => {
        return founderController.store(request, response);
    },
);

founderRoutes.put(
    "/:id",
    authenticate,
    authorize(["ADMIN", "SUPER_ADMIN"]),
    (request, response) => {
        return founderController.update(request, response);
    },
);

founderRoutes.delete(
    "/:id",
    authenticate,
    authorize(["ADMIN", "SUPER_ADMIN"]),
    (request, response) => {
        return founderController.destroy(request, response);
    },
);

export { founderRoutes };
