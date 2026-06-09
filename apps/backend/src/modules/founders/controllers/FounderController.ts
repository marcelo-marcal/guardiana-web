// ================================
// IMPORTS
// ================================
import type { Response, Request } from "express";
import { FounderService } from "../services/FounderService.js";

// ================================
// CONTROLLER: FUNDADORAS
// ================================
export class FounderController {
    private readonly founderService = new FounderService();

    async index(_request: Request, response: Response) {
        try {
            const founders = await this.founderService.listAll();
            return response.json({ success: true, founders });
        } catch (error) {
            return response.status(500).json({
                success: false,
                message: "Erro ao listar fundadoras.",
            });
        }
    }

    async store(request: Request, response: Response) {
        try {
            const founder = await this.founderService.create(request.body);
            return response.status(201).json({ success: true, founder });
        } catch (error) {
            return response.status(400).json({
                success: false,
                message: "Erro ao criar fundadora.",
            });
        }
    }

    async update(request: Request, response: Response) {
        try {
            const { id } = request.params;
            const founder = await this.founderService.update(id, request.body);
            return response.json({ success: true, founder });
        } catch (error) {
            return response.status(400).json({
                success: false,
                message: "Erro ao atualizar fundadora.",
            });
        }
    }

    async destroy(request: Request, response: Response) {
        try {
            const { id } = request.params;
            await this.founderService.delete(id);
            return response.json({ success: true, message: "Removida com sucesso." });
        } catch (error) {
            return response.status(400).json({
                success: false,
                message: "Erro ao deletar fundadora.",
            });
        }
    }
}
