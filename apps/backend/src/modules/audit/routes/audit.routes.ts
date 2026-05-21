// ================================
// IMPORTS
// ================================
import { Router } from "express";
import { AuditController } from "../controllers/AuditController.js";
import { authenticate } from "../../auth/middleware/authenticate.js";
import { authorize } from "../../auth/middleware/authorize.js";

// ================================
// ROUTER
// ================================
const auditRoutes = Router();
const auditController = new AuditController();

// ================================
// ROTAS DE AUDITORIA
// ================================
auditRoutes.get(
    "/",
    authenticate,
    authorize(["ADMIN", "SUPER_ADMIN"]),
    (request, response) => {
        return auditController.index(request, response);
    },
);

export { auditRoutes };