// ================================
// IMPORTS
// ================================
import type { Response } from "express";
import { createPoemSchema } from "../dto/create-poem.dto.js";
import { reviewPoemSchema } from "../dto/review-poem.dto.js";
import { updatePoemSchema } from "../dto/update-poem.dto.js";
import { PoemService } from "../services/PoemService.js";
import type { AuthenticatedRequest } from "../../auth/middleware/authenticate.js";

// ================================
// CONTROLLER: POEMAS
// ================================
export class PoemController {
    private readonly poemService = new PoemService();

    // ================================
    // LISTAR POEMAS PÚBLICOS
    // ================================
    async index(_request: AuthenticatedRequest, response: Response) {
        try {
            const poems = await this.poemService.listPublicApprovedPoems();

            return response.json({
                success: true,
                poems,
            });
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Erro ao listar poemas.";

            return response.status(500).json({
                success: false,
                message,
            });
        }
    }

    // ================================
    // LISTAR POEMAS EM DESTAQUE
    // ================================
    async highlights(_request: AuthenticatedRequest, response: Response) {
        try {
            const poems = await this.poemService.listHighlightedPoems();

            return response.json({
                success: true,
                poems,
            });
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Erro ao listar poemas em destaque.";

            return response.status(500).json({
                success: false,
                message,
            });
        }
    }

    // ================================
    // LISTAR MEUS POEMAS
    // ================================
    async myPoems(request: AuthenticatedRequest, response: Response) {
        try {
            if (!request.user) {
                return response.status(401).json({
                    success: false,
                    message: "Usuário não autenticado.",
                });
            }

            const poems = await this.poemService.listMyPoems(request.user.id);

            return response.json({
                success: true,
                poems,
            });
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Erro ao listar meus poemas.";

            return response.status(500).json({
                success: false,
                message,
            });
        }
    }

    // ================================
    // LISTAR TODOS PARA ADMIN
    // ================================
    async adminIndex(_request: AuthenticatedRequest, response: Response) {
        try {
            const poems = await this.poemService.listAllForAdmin();

            return response.json({
                success: true,
                poems,
            });
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Erro ao listar poemas para administração.";

            return response.status(500).json({
                success: false,
                message,
            });
        }
    }

    // ================================
    // CRIAR POEMA
    // ================================
    async create(request: AuthenticatedRequest, response: Response) {
        try {
            if (!request.user) {
                return response.status(401).json({
                    success: false,
                    message: "Usuário não autenticado.",
                });
            }

            const data = createPoemSchema.parse(request.body);
            const poem = await this.poemService.create(request.user.id, data);

            return response.status(201).json({
                success: true,
                poem,
            });
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Erro ao criar poema.";

            return response.status(400).json({
                success: false,
                message,
            });
        }
    }

    // ================================
    // ATUALIZAR MEU POEMA
    // ================================
    async updateMyPoem(request: AuthenticatedRequest, response: Response) {
        try {
            if (!request.user) {
                return response.status(401).json({
                    success: false,
                    message: "Usuário não autenticado.",
                });
            }

            const { id } = request.params;
            const data = updatePoemSchema.parse(request.body);
            const poem = await this.poemService.updateMyPoem(
                id,
                request.user.id,
                data,
            );

            return response.json({
                success: true,
                poem,
            });
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Erro ao atualizar poema.";

            return response.status(400).json({
                success: false,
                message,
            });
        }
    }

    // ================================
    // REMOVER MEU POEMA
    // ================================
    async removeMyPoem(request: AuthenticatedRequest, response: Response) {
        try {
            if (!request.user) {
                return response.status(401).json({
                    success: false,
                    message: "Usuário não autenticado.",
                });
            }

            const { id } = request.params;
            const poem = await this.poemService.removeMyPoem(
                id,
                request.user.id,
            );

            return response.json({
                success: true,
                poem,
            });
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Erro ao remover poema.";

            return response.status(400).json({
                success: false,
                message,
            });
        }
    }

    // ================================
    // REVISAR POEMA
    // ================================
    async review(request: AuthenticatedRequest, response: Response) {
        try {
            if (!request.user) {
                return response.status(401).json({
                    success: false,
                    message: "Usuário não autenticado.",
                });
            }

            const { id } = request.params;
            const data = reviewPoemSchema.parse(request.body);
            const poem = await this.poemService.reviewPoem(
                id,
                request.user.id,
                data,
            );

            return response.json({
                success: true,
                poem,
            });
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Erro ao revisar poema.";

            return response.status(400).json({
                success: false,
                message,
            });
        }
    }

    // ================================
    // DESTACAR / REMOVER DESTAQUE
    // ================================
    async toggleHighlight(request: AuthenticatedRequest, response: Response) {
        try {
            if (!request.user) {
                return response.status(401).json({
                    success: false,
                    message: "Usuário não autenticado.",
                });
            }

            const { id } = request.params;
            const poem = await this.poemService.toggleHighlight(
                id,
                request.user.id,
            );

            return response.json({
                success: true,
                poem,
            });
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Erro ao destacar poema.";

            return response.status(400).json({
                success: false,
                message,
            });
        }
    }

    // ================================
    // REMOVER COMO ADMIN
    // ================================
    async removeAsAdmin(request: AuthenticatedRequest, response: Response) {
        try {
            if (!request.user) {
                return response.status(401).json({
                    success: false,
                    message: "Usuário não autenticado.",
                });
            }

            const { id } = request.params;
            const poem = await this.poemService.removeAsAdmin(
                id,
                request.user.id,
            );

            return response.json({
                success: true,
                poem,
            });
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Erro ao remover poema como administrador.";

            return response.status(400).json({
                success: false,
                message,
            });
        }
    }
}