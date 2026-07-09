// ================================
// IMPORTS
// ================================
import type { Response, Request } from "express";
import { AdvisoryService } from "../services/AdvisoryService.js";

// ================================
// CONTROLLER: ASSESSORIAS
// ================================
export class AdvisoryController {
    private readonly advisoryService = new AdvisoryService();

    async index(request: Request, response: Response) {
        try {
            const { onlyActive } = request.query;
            const advisories = onlyActive === "true"
                ? await this.advisoryService.listActive()
                : await this.advisoryService.listAll();

            return response.json({ success: true, advisories });
        } catch (error) {
            return response.status(500).json({
                success: false,
                message: "Erro ao listar assessorias.",
            });
        }
    }

    async store(request: Request, response: Response) {
        try {
            const advisory = await this.advisoryService.create(request.body);
            return response.status(201).json({ success: true, advisory });
        } catch (error) {
            return response.status(400).json({
                success: false,
                message: "Erro ao criar assessoria.",
            });
        }
    }

    async update(request: Request, response: Response) {
        try {
            const { id } = request.params;
            const advisory = await this.advisoryService.update(id, request.body);
            return response.json({ success: true, advisory });
        } catch (error) {
            return response.status(400).json({
                success: false,
                message: "Erro ao atualizar assessoria.",
            });
        }
    }

    async destroy(request: Request, response: Response) {
        try {
            const { id } = request.params;
            await this.advisoryService.delete(id);
            return response.json({ success: true, message: "Removida com sucesso." });
        } catch (error) {
            return response.status(400).json({
                success: false,
                message: "Erro ao deletar assessoria.",
            });
        }
    }
}
