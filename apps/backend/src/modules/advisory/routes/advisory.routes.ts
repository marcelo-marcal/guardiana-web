// ================================
// IMPORTS
// ================================
import { Router } from "express";
import { AdvisoryController } from "../controllers/AdvisoryController.js";
import { authenticate } from "../../auth/middleware/authenticate.js";
import { authorize } from "../../auth/middleware/authorize.js";

// ================================
// ROUTER
// ================================
const advisoryRoutes = Router();
const advisoryController = new AdvisoryController();

// ================================
// ROTAS PÚBLICAS
// ================================
advisoryRoutes.get("/", (request, response) => {
    return advisoryController.index(request, response);
});

// ================================
// ROTAS PROTEGIDAS ADMIN
// ================================
advisoryRoutes.post(
    "/",
    authenticate,
    authorize(["ADMIN", "SUPER_ADMIN"]),
    (request, response) => {
        return advisoryController.store(request, response);
    },
);

advisoryRoutes.put(
    "/:id",
    authenticate,
    authorize(["ADMIN", "SUPER_ADMIN"]),
    (request, response) => {
        return advisoryController.update(request, response);
    },
);

advisoryRoutes.delete(
    "/:id",
    authenticate,
    authorize(["ADMIN", "SUPER_ADMIN"]),
    (request, response) => {
        return advisoryController.destroy(request, response);
    },
);

export { advisoryRoutes };
