import type { Request, Response } from "express";
import { PublicationService } from "../services/PublicationService.js";
import type { AuthenticatedRequest } from "../../auth/middleware/authenticate.js";

export class PublicationController {
    private readonly service = new PublicationService();

    async getSection(_request: Request, response: Response) {
        try {
            const section = await this.service.getSection();

            return response.json({
                success: true,
                section,
            });
        } catch {
            return response.status(500).json({
                success: false,
                message: "Erro ao buscar cabeçalho de publicações.",
            });
        }
    }

    async saveSection(request: AuthenticatedRequest, response: Response) {
        try {
            if (!request.user) {
                return response.status(401).json({
                    success: false,
                    message: "Usuário não autenticado.",
                });
            }

            const { title, subtitle } = request.body as {
                title?: string;
                subtitle?: string;
            };

            if (!title || !subtitle) {
                return response.status(400).json({
                    success: false,
                    message: "Título e subtítulo são obrigatórios.",
                });
            }

            const section = await this.service.saveSection(
                { title, subtitle },
                request.user.id,
            );

            return response.json({
                success: true,
                section,
            });
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Erro ao salvar cabeçalho.";

            return response.status(400).json({
                success: false,
                message,
            });
        }
    }

    async listCategories(_request: Request, response: Response) {
        try {
            const categories = await this.service.listCategories();

            return response.json({
                success: true,
                categories,
            });
        } catch {
            return response.status(500).json({
                success: false,
                message: "Erro ao listar categorias.",
            });
        }
    }

    async createCategory(request: AuthenticatedRequest, response: Response) {
        try {
            if (!request.user) {
                return response.status(401).json({
                    success: false,
                    message: "Usuário não autenticado.",
                });
            }

            const { name, order } = request.body as {
                name?: string;
                order?: number;
            };

            if (!name) {
                return response.status(400).json({
                    success: false,
                    message: "Nome da categoria é obrigatório.",
                });
            }

            const categoryData =
                typeof order === "number" ? { name, order } : { name };

            const category = await this.service.createCategory(
                categoryData,
                request.user.id,
            );

            return response.status(201).json({
                success: true,
                category,
            });
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Erro ao criar categoria.";

            return response.status(400).json({
                success: false,
                message,
            });
        }
    }

    async updateCategory(request: AuthenticatedRequest, response: Response) {
        try {
            if (!request.user) {
                return response.status(401).json({
                    success: false,
                    message: "Usuário não autenticado.",
                });
            }

            const { id } = request.params;
            const { name, order } = request.body as {
                name?: string;
                order?: number;
            };

            if (!name) {
                return response.status(400).json({
                    success: false,
                    message: "Nome da categoria é obrigatório.",
                });
            }

            const categoryData =
                typeof order === "number" ? { name, order } : { name };

            const category = await this.service.updateCategory(
                id,
                categoryData,
                request.user.id,
            );

            return response.json({
                success: true,
                category,
            });
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Erro ao atualizar categoria.";

            return response.status(400).json({
                success: false,
                message,
            });
        }
    }

    async removeCategory(request: AuthenticatedRequest, response: Response) {
        try {
            if (!request.user) {
                return response.status(401).json({
                    success: false,
                    message: "Usuário não autenticado.",
                });
            }

            const { id } = request.params;
            const category = await this.service.removeCategory(
                id,
                request.user.id,
            );

            return response.json({
                success: true,
                category,
            });
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Erro ao remover categoria.";

            return response.status(400).json({
                success: false,
                message,
            });
        }
    }

    async listPublications(_request: Request, response: Response) {
        try {
            const publications = await this.service.listPublications();

            return response.json({
                success: true,
                publications,
            });
        } catch {
            return response.status(500).json({
                success: false,
                message: "Erro ao listar publicações.",
            });
        }
    }

    async createPublication(request: AuthenticatedRequest, response: Response) {
        try {
            if (!request.user) {
                return response.status(401).json({
                    success: false,
                    message: "Usuário não autenticado.",
                });
            }

            const { categoryId, title, description, author, date } =
                request.body as {
                    categoryId?: string;
                    title?: string;
                    description?: string;
                    author?: string;
                    date?: string;
                };

            if (!categoryId || !title || !description || !author || !date) {
                return response.status(400).json({
                    success: false,
                    message:
                        "Categoria, título, descrição, autor e data são obrigatórios.",
                });
            }

            const publication = await this.service.createPublication(
                { categoryId, title, description, author, date },
                request.user.id,
            );

            return response.status(201).json({
                success: true,
                publication,
            });
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Erro ao criar publicação.";

            return response.status(400).json({
                success: false,
                message,
            });
        }
    }

    async updatePublication(request: AuthenticatedRequest, response: Response) {
        try {
            if (!request.user) {
                return response.status(401).json({
                    success: false,
                    message: "Usuário não autenticado.",
                });
            }

            const { id } = request.params;
            const { categoryId, title, description, author, date } =
                request.body as {
                    categoryId?: string;
                    title?: string;
                    description?: string;
                    author?: string;
                    date?: string;
                };

            if (!categoryId || !title || !description || !author || !date) {
                return response.status(400).json({
                    success: false,
                    message:
                        "Categoria, título, descrição, autor e data são obrigatórios.",
                });
            }

            const publication = await this.service.updatePublication(
                id,
                { categoryId, title, description, author, date },
                request.user.id,
            );

            return response.json({
                success: true,
                publication,
            });
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Erro ao atualizar publicação.";

            return response.status(400).json({
                success: false,
                message,
            });
        }
    }

    async removePublication(request: AuthenticatedRequest, response: Response) {
        try {
            if (!request.user) {
                return response.status(401).json({
                    success: false,
                    message: "Usuário não autenticado.",
                });
            }

            const { id } = request.params;
            const publication = await this.service.removePublication(
                id,
                request.user.id,
            );

            return response.json({
                success: true,
                publication,
            });
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Erro ao remover publicação.";

            return response.status(400).json({
                success: false,
                message,
            });
        }
    }
}