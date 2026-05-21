// ================================
// IMPORTS
// ================================
import { Router } from "express";
import { PoemController } from "../controllers/PoemController.js";
import { authenticate } from "../../auth/middleware/authenticate.js";
import { authorize } from "../../auth/middleware/authorize.js";

// ================================
// ROUTER
// ================================
const poemRoutes = Router();
const poemController = new PoemController();

// ================================
// ROTAS PÚBLICAS
// ================================
poemRoutes.get("/", (request, response) => {
    return poemController.index(request, response);
});

poemRoutes.get("/highlights", (request, response) => {
    return poemController.highlights(request, response);
});

// ================================
// ROTAS DO USUÁRIO LOGADO
// ================================
poemRoutes.get("/my-poems", authenticate, (request, response) => {
    return poemController.myPoems(request, response);
});

poemRoutes.post("/", authenticate, (request, response) => {
    return poemController.create(request, response);
});

poemRoutes.put("/:id", authenticate, (request, response) => {
    return poemController.updateMyPoem(request, response);
});

poemRoutes.delete("/:id", authenticate, (request, response) => {
    return poemController.removeMyPoem(request, response);
});

// ================================
// ROTAS ADMINISTRATIVAS
// ================================
poemRoutes.get(
    "/admin/all",
    authenticate,
    authorize(["ADMIN", "SUPER_ADMIN"]),
    (request, response) => {
        return poemController.adminIndex(request, response);
    },
);

poemRoutes.patch(
    "/:id/review",
    authenticate,
    authorize(["ADMIN", "SUPER_ADMIN"]),
    (request, response) => {
        return poemController.review(request, response);
    },
);

poemRoutes.patch(
    "/:id/highlight",
    authenticate,
    authorize(["ADMIN", "SUPER_ADMIN"]),
    (request, response) => {
        return poemController.toggleHighlight(request, response);
    },
);

poemRoutes.delete(
    "/admin/:id",
    authenticate,
    authorize(["ADMIN", "SUPER_ADMIN"]),
    (request, response) => {
        return poemController.removeAsAdmin(request, response);
    },
);

export { poemRoutes };