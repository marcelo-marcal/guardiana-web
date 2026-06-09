// ================================
// IMPORTS
// ================================
import type { Response } from "express";
import type { AuthenticatedRequest } from "../middleware/authenticate.js";

// ================================
// CONTROLLER: USUÁRIO LOGADO
// ================================
export class MeController {
    // ================================
    // RETORNAR DADOS DO USUÁRIO LOGADO
    // ================================
    async show(request: AuthenticatedRequest, response: Response) {
        return response.json({
            success: true,
            user: request.user,
        });
    }
}