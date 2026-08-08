// ================================
// IMPORTS
// ================================
import { Router } from "express";
import { CarouselController } from "../controllers/CarouselController.js";
import { authenticate } from "../../auth/middleware/authenticate.js";
import { authorize } from "../../auth/middleware/authorize.js";

// ================================
// ROUTER
// ================================
const carouselRoutes = Router();
const carouselController = new CarouselController();

// ================================
// ROTA PÚBLICA
// ================================
// Lista somente os slides ativos.
carouselRoutes.get("/", (request, response) => {
    return carouselController.index(request, response);
});

// ================================
// ROTAS PROTEGIDAS ADMIN
// ================================
// Lista todos os slides, inclusive os inativos.
carouselRoutes.get(
    "/admin",
    authenticate,
    authorize(["ADMIN", "SUPER_ADMIN"]),
    (request, response) => {
        return carouselController.adminIndex(request, response);
    },
);

// Cria um novo slide.
carouselRoutes.post(
    "/",
    authenticate,
    authorize(["ADMIN", "SUPER_ADMIN"]),
    (request, response) => {
        return carouselController.store(request, response);
    },
);

// Atualiza os dados de um slide.
carouselRoutes.put(
    "/:id",
    authenticate,
    authorize(["ADMIN", "SUPER_ADMIN"]),
    (request, response) => {
        return carouselController.update(request, response);
    },
);

// Ativa ou desativa um slide.
carouselRoutes.patch(
    "/:id/status",
    authenticate,
    authorize(["ADMIN", "SUPER_ADMIN"]),
    (request, response) => {
        return carouselController.updateStatus(request, response);
    },
);

// Exclui um slide.
carouselRoutes.delete(
    "/:id",
    authenticate,
    authorize(["ADMIN", "SUPER_ADMIN"]),
    (request, response) => {
        return carouselController.destroy(request, response);
    },
);

export { carouselRoutes };