// ================================
// IMPORTS
// ================================
import { Router } from "express";
import { CouncilController } from "../controllers/CouncilController.js";
import { authenticate } from "../../auth/middleware/authenticate.js";
import { authorize } from "../../auth/middleware/authorize.js";

// ================================
// ROUTER
// ================================
const councilRoutes = Router();
const councilController = new CouncilController();

// ================================
// ROTAS PÚBLICAS
// ================================
councilRoutes.get("/", (request, response) => {
    return councilController.index(request, response);
});

// ================================
// ROTAS PROTEGIDAS ADMIN
// ================================
councilRoutes.post(
    "/",
    authenticate,
    authorize(["ADMIN", "SUPER_ADMIN"]),
    (request, response) => {
        return councilController.store(request, response);
    },
);

councilRoutes.put(
    "/:id",
    authenticate,
    authorize(["ADMIN", "SUPER_ADMIN"]),
    (request, response) => {
        return councilController.update(request, response);
    },
);

councilRoutes.delete(
    "/:id",
    authenticate,
    authorize(["ADMIN", "SUPER_ADMIN"]),
    (request, response) => {
        return councilController.destroy(request, response);
    },
);

export { councilRoutes };
