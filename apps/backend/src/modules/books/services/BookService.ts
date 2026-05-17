// ================================
// IMPORTS
// ================================
import { BookFormat } from "@prisma/client";
import { prisma } from "../../../shared/database/prisma.js";
import type { CreateBookDTO } from "../dto/create-book.dto.js";
import type { UpdateBookDTO } from "../dto/update-book.dto.js";

// ================================
// SERVICE: LIVROS
// ================================
export class BookService {
    // ================================
    // LISTAR LIVROS ATIVOS
    // ================================
    async listActiveBooks() {
        return prisma.book.findMany({
            where: {
                isActive: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }

    // ================================
    // LISTAR LIVROS EM DESTAQUE NA HOME
    // Regra: no máximo 3
    // ================================
    async listHomeFeatures() {
        return prisma.book.findMany({
            where: {
                isActive: true,
                isHomeFeature: true,
            },
            orderBy: {
                createdAt: "desc",
            },
            take: 3,
        });
    }

    // ================================
    // BUSCAR LIVRO POR ID
    // ================================
    async findById(id: string) {
        const book = await prisma.book.findUnique({
            where: {
                id,
            },
        });

        if (!book || !book.isActive) {
            throw new Error("Livro não encontrado.");
        }

        return book;
    }

    // ================================
    // CRIAR LIVRO
    // ================================
    async create(data: CreateBookDTO) {
        if (data.isHomeFeature) {
            await this.ensureHomeFeatureLimit();
        }

        return prisma.book.create({
            data: {
                title: data.title,
                author: data.author,
                description: data.description,
                coverUrl: data.coverUrl,
                year: data.year,
                isbn: data.isbn,
                pages: data.pages,
                price: data.price,
                dimensions: data.dimensions,
                language: data.language || "Português",
                format: data.format || BookFormat.PHYSICAL,
                ebookFileUrl: data.ebookFileUrl,
                physicalStock: data.physicalStock || 0,
                isHomeFeature: data.isHomeFeature || false,
                isActive: true,
            },
        });
    }

    // ================================
    // ATUALIZAR LIVRO
    // ================================
    async update(id: string, data: UpdateBookDTO) {
        const currentBook = await this.findById(id);

        if (data.isHomeFeature === true && !currentBook.isHomeFeature) {
            await this.ensureHomeFeatureLimit();
        }

        return prisma.book.update({
            where: {
                id,
            },
            data: {
                title: data.title,
                author: data.author,
                description: data.description,
                coverUrl: data.coverUrl,
                year: data.year,
                isbn: data.isbn,
                pages: data.pages,
                price: data.price,
                dimensions: data.dimensions,
                language: data.language,
                format: data.format,
                ebookFileUrl: data.ebookFileUrl,
                physicalStock: data.physicalStock,
                isHomeFeature: data.isHomeFeature,
            },
        });
    }

    // ================================
    // REMOVER LIVRO
    // Soft delete para não quebrar pedidos futuros
    // ================================
    async remove(id: string) {
        await this.findById(id);

        return prisma.book.update({
            where: {
                id,
            },
            data: {
                isActive: false,
                isHomeFeature: false,
            },
        });
    }

    // ================================
    // VALIDAR LIMITE DE DESTAQUES
    // ================================
    private async ensureHomeFeatureLimit() {
        const count = await prisma.book.count({
            where: {
                isActive: true,
                isHomeFeature: true,
            },
        });

        if (count >= 3) {
            throw new Error("A Home pode ter no máximo 3 livros em destaque.");
        }
    }
}