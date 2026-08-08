// ================================
// IMPORTS
// ================================
import { prisma, AuditAction, PoemStatus, UserRole, type Prisma } from "../../../shared/database/prisma.js";
import type { CreatePoemDTO } from "../dto/create-poem.dto.js";
import type { ReviewPoemDTO } from "../dto/review-poem.dto.js";
import type { UpdatePoemDTO } from "../dto/update-poem.dto.js";

// ================================
// SERVICE: POEMAS
// ================================
export class PoemService {
    // ================================
    // LISTAR POEMAS PÚBLICOS APROVADOS
    // ================================
    async listPublicApprovedPoems() {
        return prisma.poem.findMany({
            where: {
                isPublic: true,
                status: {
                    in: [PoemStatus.APPROVED, PoemStatus.HIGHLIGHTED],
                },
            },
            orderBy: {
                createdAt: "desc",
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        avatarUrl: true,
                    },
                },
            },
        });
    }

    // ================================
    // LISTAR POEMAS EM DESTAQUE
    // ================================
    async listHighlightedPoems() {
        return prisma.poem.findMany({
            where: {
                isPublic: true,
                isHighlighted: true,
                status: PoemStatus.HIGHLIGHTED,
            },
            orderBy: {
                updatedAt: "desc",
            },
            take: 6,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        avatarUrl: true,
                    },
                },
            },
        });
    }

    // ================================
    // LISTAR MEUS POEMAS
    // ================================
    async listMyPoems(userId: string) {
        return prisma.poem.findMany({
            where: {
                userId,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }

    // ================================
    // LISTAR TODOS OS POEMAS PARA ADMIN
    // ================================
    async listAllForAdmin() {
        return prisma.poem.findMany({
            orderBy: {
                createdAt: "desc",
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatarUrl: true,
                    },
                },
                reviewedBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                    },
                },
            },
        });
    }

    // ================================
    // CRIAR POEMA
    // Usuário comum cria como PENDING
    // ================================
    async create(userId: string, data: CreatePoemDTO) {
        const createData: Prisma.PoemCreateInput = {
            title: data.title,
            content: data.content,
            authorName: data.authorName ?? null,
            authorPhotoUrl: data.authorPhotoUrl ?? null,
            status: PoemStatus.PENDING,
            isPublic: false,
            isHighlighted: false,
            user: {
                connect: {
                    id: userId,
                },
            },
        };

        return prisma.poem.create({
            data: createData,
        });
    }

    // ================================
    // ATUALIZAR MEU POEMA
    // ================================
    async updateMyPoem(poemId: string, userId: string, data: UpdatePoemDTO) {
        const poem = await prisma.poem.findUnique({
            where: {
                id: poemId,
            },
        });

        if (!poem || poem.userId !== userId) {
            throw new Error("Poema não encontrado.");
        }

        const updateData: Prisma.PoemUpdateInput = {};

        if (data.title !== undefined) updateData.title = data.title;
        if (data.content !== undefined) updateData.content = data.content;
        if (data.authorName !== undefined) {
            updateData.authorName = data.authorName;
        }
        if (data.authorPhotoUrl !== undefined) {
            updateData.authorPhotoUrl = data.authorPhotoUrl;
        }

        return prisma.poem.update({
            where: {
                id: poemId,
            },
            data: updateData,
        });
    }

    // ================================
    // REMOVER MEU POEMA
    // ================================
    async removeMyPoem(poemId: string, userId: string) {
        const poem = await prisma.poem.findUnique({
            where: {
                id: poemId,
            },
        });

        if (!poem || poem.userId !== userId) {
            throw new Error("Poema não encontrado.");
        }

        return prisma.poem.delete({
            where: {
                id: poemId,
            },
        });
    }

    // ================================
    // REVISAR POEMA
    // Admin/SuperAdmin aprova ou rejeita
    // ================================
    async reviewPoem(
        poemId: string,
        reviewerId: string,
        data: ReviewPoemDTO,
    ) {
        const poem = await prisma.poem.findUnique({
            where: {
                id: poemId,
            },
        });

        if (!poem) {
            throw new Error("Poema não encontrado.");
        }

        const isApproved = data.status === PoemStatus.APPROVED;

        const reviewedPoem = await prisma.poem.update({
            where: {
                id: poemId,
            },
            data: {
                status: data.status,
                isPublic: isApproved,
                isHighlighted: false,
                rejectionReason: data.rejectionReason ?? null,
                reviewedAt: new Date(),
                reviewedBy: {
                    connect: {
                        id: reviewerId,
                    },
                },
            },
        });

        await this.createAuditLog({
            actorUserId: reviewerId,
            action:
                data.status === PoemStatus.APPROVED
                    ? AuditAction.APPROVE
                    : AuditAction.REJECT,
            entityId: reviewedPoem.id,
            description:
                data.status === PoemStatus.APPROVED
                    ? `Poema "${reviewedPoem.title}" aprovado.`
                    : `Poema "${reviewedPoem.title}" rejeitado.`,
            fieldName: "status",
            oldValue: poem.status,
            newValue: reviewedPoem.status,
        });

        return reviewedPoem;
    }

    // ================================
    // DESTACAR OU REMOVER DESTAQUE
    // ================================
    async toggleHighlight(poemId: string, actorUserId: string) {
        const poem = await prisma.poem.findUnique({
            where: {
                id: poemId,
            },
        });

        if (!poem) {
            throw new Error("Poema não encontrado.");
        }

        if (!poem.isPublic) {
            throw new Error("Somente poemas públicos podem ser destacados.");
        }

        const nextHighlight = !poem.isHighlighted;

        // VALIDAÇÃO DE LIMITE (MÁXIMO 6)
        if (nextHighlight) {
            const highlightCount = await prisma.poem.count({
                where: { isHighlighted: true, status: PoemStatus.HIGHLIGHTED }
            });

            if (highlightCount >= 6) {
                throw new Error("O limite de 6 poemas em destaque já foi atingido.");
            }
        }

        const updatedPoem = await prisma.poem.update({
            where: {
                id: poemId,
            },
            data: {
                isHighlighted: nextHighlight,
                status: nextHighlight
                    ? PoemStatus.HIGHLIGHTED
                    : PoemStatus.APPROVED,
            },
        });

        await this.createAuditLog({
            actorUserId,
            action: AuditAction.HIGHLIGHT,
            entityId: updatedPoem.id,
            description: nextHighlight
                ? `Poema "${updatedPoem.title}" colocado em destaque.`
                : `Poema "${updatedPoem.title}" removido dos destaques.`,
            fieldName: "isHighlighted",
            oldValue: String(poem.isHighlighted),
            newValue: String(updatedPoem.isHighlighted),
        });

        return updatedPoem;
    }

    // ================================
    // REMOVER POEMA COMO ADMIN
    // ================================
    async removeAsAdmin(poemId: string, actorUserId: string) {
        const poem = await prisma.poem.findUnique({
            where: {
                id: poemId,
            },
        });

        if (!poem) {
            throw new Error("Poema não encontrado.");
        }

        const removedPoem = await prisma.poem.delete({
            where: {
                id: poemId,
            },
        });

        await this.createAuditLog({
            actorUserId,
            action: AuditAction.DELETE,
            entityId: poemId,
            description: `Poema "${poem.title}" removido por administração.`,
        });

        return removedPoem;
    }

    // ================================
    // VERIFICAR PERFIL ADMIN
    // ================================
    isAdminRole(role: string) {
        return role === UserRole.ADMIN || role === UserRole.SUPER_ADMIN;
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
                entity: "Poem",
                entityId: data.entityId,
                description: data.description,
                fieldName: data.fieldName ?? null,
                oldValue: data.oldValue ?? null,
                newValue: data.newValue ?? null,
            },
        });
    }
}