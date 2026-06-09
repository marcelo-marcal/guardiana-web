// ================================
// IMPORTS
// ================================
import type { Response, Request } from "express";
import { CouncilService } from "../services/CouncilService.js";

// ================================
// CONTROLLER: CONSELHO
// ================================
export class CouncilController {
    private readonly councilService = new CouncilService();

    async index(_request: Request, response: Response) {
        try {
            const members = await this.councilService.listAll();
            return response.json({ success: true, members });
        } catch (error) {
            return response.status(500).json({
                success: false,
                message: "Erro ao listar membros do conselho.",
            });
        }
    }

    async store(request: Request, response: Response) {
        try {
            const member = await this.councilService.create(request.body);
            return response.status(201).json({ success: true, member });
        } catch (error) {
            return response.status(400).json({
                success: false,
                message: "Erro ao criar membro do conselho.",
            });
        }
    }

    async update(request: Request, response: Response) {
        try {
            const { id } = request.params;
            const member = await this.councilService.update(id, request.body);
            return response.json({ success: true, member });
        } catch (error) {
            return response.status(400).json({
                success: false,
                message: "Erro ao atualizar membro do conselho.",
            });
        }
    }

    async destroy(request: Request, response: Response) {
        try {
            const { id } = request.params;
            await this.councilService.delete(id);
            return response.json({ success: true, message: "Removido com sucesso." });
        } catch (error) {
            return response.status(400).json({
                success: false,
                message: "Erro ao deletar membro do conselho.",
            });
        }
    }
}
