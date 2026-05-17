// ================================
// IMPORTS
// ================================
import { AuditAction, BookFormat, type Prisma } from "@prisma/client";
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
    async create(data: CreateBookDTO, actorUserId: string) {
        if (data.isHomeFeature) {
            await this.ensureHomeFeatureLimit();
        }

        const createData: Prisma.BookCreateInput = {
            title: data.title,
            author: data.author,
            description: data.description,
            coverUrl: data.coverUrl ?? null,
            year: data.year ?? null,
            isbn: data.isbn ?? null,
            pages: data.pages ?? null,
            price: data.price ?? null,
            dimensions: data.dimensions ?? null,
            language: data.language ?? "Português",
            format: data.format ?? BookFormat.PHYSICAL,
            ebookFileUrl: data.ebookFileUrl ?? null,
            physicalStock: data.physicalStock ?? 0,
            isHomeFeature: data.isHomeFeature ?? false,
            isActive: true,
        };

        const book = await prisma.book.create({
            data: createData,
        });

        await this.createAuditLog({
            actorUserId,
            action: AuditAction.CREATE,
            entityId: book.id,
            description: `Livro "${book.title}" criado.`,
        });

        return book;
    }

    // ================================
    // ATUALIZAR LIVRO
    // ================================
    async update(id: string, data: UpdateBookDTO, actorUserId: string) {
        const currentBook = await this.findById(id);

        if (data.isHomeFeature === true && !currentBook.isHomeFeature) {
            await this.ensureHomeFeatureLimit();
        }

        const updateData: Prisma.BookUpdateInput = {};

        if (data.title !== undefined) updateData.title = data.title;
        if (data.author !== undefined) updateData.author = data.author;
        if (data.description !== undefined) {
            updateData.description = data.description;
        }
        if (data.coverUrl !== undefined) updateData.coverUrl = data.coverUrl;
        if (data.year !== undefined) updateData.year = data.year;
        if (data.isbn !== undefined) updateData.isbn = data.isbn;
        if (data.pages !== undefined) updateData.pages = data.pages;
        if (data.price !== undefined) updateData.price = data.price;
        if (data.dimensions !== undefined) {
            updateData.dimensions = data.dimensions;
        }
        if (data.language !== undefined) updateData.language = data.language;
        if (data.format !== undefined) updateData.format = data.format;
        if (data.ebookFileUrl !== undefined) {
            updateData.ebookFileUrl = data.ebookFileUrl;
        }
        if (data.physicalStock !== undefined) {
            updateData.physicalStock = data.physicalStock;
        }
        if (data.isHomeFeature !== undefined) {
            updateData.isHomeFeature = data.isHomeFeature;
        }

        const updatedBook = await prisma.book.update({
            where: {
                id,
            },
            data: updateData,
        });

        await this.createUpdateAuditLogs(currentBook, updatedBook, data, actorUserId);

        return updatedBook;
    }

    // ================================
    // REMOVER LIVRO
    // Soft delete para não quebrar pedidos futuros
    // ================================
    async remove(id: string, actorUserId: string) {
        const currentBook = await this.findById(id);

        const book = await prisma.book.update({
            where: {
                id,
            },
            data: {
                isActive: false,
                isHomeFeature: false,
            },
        });

        await this.createAuditLog({
            actorUserId,
            action: AuditAction.DELETE,
            entityId: book.id,
            description: `Livro "${currentBook.title}" removido.`,
        });

        return book;
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

    // ================================
    // CRIAR LOG DE AUDITORIA
    // ================================
    private async createAuditLog(data: {
        actorUserId: string;
        action: AuditAction;
        entityId: string;
        description: string;
        fieldName?: string;
        oldValue?: string;
        newValue?: string;
    }) {
        await prisma.auditLog.create({
            data: {
                actorUserId: data.actorUserId,
                action: data.action,
                entity: "Book",
                entityId: data.entityId,
                description: data.description,
                fieldName: data.fieldName ?? null,
                oldValue: data.oldValue ?? null,
                newValue: data.newValue ?? null,
            },
        });
    }

    // ================================
    // CRIAR LOGS DAS ALTERAÇÕES
    // ================================
    private async createUpdateAuditLogs(
        oldBook: Awaited<ReturnType<BookService["findById"]>>,
        newBook: Awaited<ReturnType<BookService["findById"]>>,
        data: UpdateBookDTO,
        actorUserId: string,
    ) {
        const fields = Object.keys(data) as Array<keyof UpdateBookDTO>;

        for (const field of fields) {
            const oldValue = String(oldBook[field as keyof typeof oldBook] ?? "");
            const newValue = String(newBook[field as keyof typeof newBook] ?? "");

            if (oldValue !== newValue) {
                await this.createAuditLog({
                    actorUserId,
                    action: AuditAction.UPDATE,
                    entityId: newBook.id,
                    fieldName: String(field),
                    oldValue,
                    newValue,
                    description: `Campo "${String(field)}" do livro "${newBook.title}" alterado.`,
                });
            }
        }
    }
}