// ================================
// IMPORTS
// ================================
import type { Response } from "express";
import type { AuthenticatedRequest } from "../../auth/middleware/authenticate.js";
import { AuditService } from "../services/AuditService.js";

// ================================
// CONTROLLER: AUDITORIA
// ================================
export class AuditController {
    private readonly auditService = new AuditService();

    // ================================
    // LISTAR LOGS RECENTES
    // ================================
    async index(_request: AuthenticatedRequest, response: Response) {
        try {
            const logs = await this.auditService.listRecentLogs();

            return response.json({
                success: true,
                logs,
            });
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Erro ao listar auditoria.";

            return response.status(500).json({
                success: false,
                message,
            });
        }
    }
}