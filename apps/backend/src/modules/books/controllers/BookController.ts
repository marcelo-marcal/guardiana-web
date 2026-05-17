// ================================
// IMPORTS
// ================================
import type { Request, Response } from "express";
import { createBookSchema } from "../dto/create-book.dto.js";
import { updateBookSchema } from "../dto/update-book.dto.js";
import { BookService } from "../services/BookService.js";
import type { AuthenticatedRequest } from "../../auth/middleware/authenticate.js";

// ================================
// CONTROLLER: LIVROS
// ================================
export class BookController {
    private readonly bookService = new BookService();

    // ================================
    // LISTAR TODOS OS LIVROS ATIVOS
    // Público: usado pela página /livros
    // ================================
    async index(_request: Request, response: Response) {
        try {
            const books = await this.bookService.listActiveBooks();

            return response.json({
                success: true,
                books,
            });
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Erro ao listar livros.";

            return response.status(500).json({
                success: false,
                message,
            });
        }
    }

    // ================================
    // LISTAR LIVROS EM DESTAQUE NA HOME
    // Público: usado pela Home
    // ================================
    async homeFeatures(_request: Request, response: Response) {
        try {
            const books = await this.bookService.listHomeFeatures();

            return response.json({
                success: true,
                books,
            });
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Erro ao listar destaques.";

            return response.status(500).json({
                success: false,
                message,
            });
        }
    }

    // ================================
    // BUSCAR LIVRO POR ID
    // Público
    // ================================
    async show(request: Request, response: Response) {
        try {
            const { id } = request.params;
            const book = await this.bookService.findById(id);

            return response.json({
                success: true,
                book,
            });
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Erro ao buscar livro.";

            return response.status(404).json({
                success: false,
                message,
            });
        }
    }

    // ================================
    // CRIAR LIVRO
    // Protegido: ADMIN / SUPER_ADMIN
    // ================================
    async create(request: AuthenticatedRequest, response: Response) {
        try {
            if (!request.user) {
                return response.status(401).json({
                    success: false,
                    message: "Usuário não autenticado.",
                });
            }

            const data = createBookSchema.parse(request.body);
            const book = await this.bookService.create(data, request.user.id);

            return response.status(201).json({
                success: true,
                book,
            });
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Erro ao criar livro.";

            return response.status(400).json({
                success: false,
                message,
            });
        }
    }

    // ================================
    // ATUALIZAR LIVRO
    // Protegido: ADMIN / SUPER_ADMIN
    // ================================
    async update(request: AuthenticatedRequest, response: Response) {
        try {
            if (!request.user) {
                return response.status(401).json({
                    success: false,
                    message: "Usuário não autenticado.",
                });
            }

            const { id } = request.params;
            const data = updateBookSchema.parse(request.body);
            const book = await this.bookService.update(id, data, request.user.id);

            return response.json({
                success: true,
                book,
            });
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Erro ao atualizar livro.";

            return response.status(400).json({
                success: false,
                message,
            });
        }
    }

    // ================================
    // REMOVER LIVRO
    // Protegido: ADMIN / SUPER_ADMIN
    // ================================
    async remove(request: AuthenticatedRequest, response: Response) {
        try {
            if (!request.user) {
                return response.status(401).json({
                    success: false,
                    message: "Usuário não autenticado.",
                });
            }

            const { id } = request.params;
            const book = await this.bookService.remove(id, request.user.id);

            return response.json({
                success: true,
                book,
            });
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Erro ao remover livro.";

            return response.status(400).json({
                success: false,
                message,
            });
        }
    }
}