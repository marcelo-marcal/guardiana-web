import {
    prisma,
    AuditAction,
    type Prisma,
} from "../../../shared/database/prisma.js";

type SaveSectionData = {
    title: string;
    subtitle: string;
};

type SaveCategoryData = {
    name: string;
    order?: number;
};

type SavePublicationData = {
    categoryId: string;
    title: string;
    description: string;
    author: string;
    date: string;
};

export class PublicationService {
    async getSection() {
        const [title, subtitle] = await Promise.all([
            prisma.systemSetting.findUnique({
                where: { key: "publications_section_title" },
            }),
            prisma.systemSetting.findUnique({
                where: { key: "publications_section_subtitle" },
            }),
        ]);

        return {
            title: title?.value ?? "Publicações",
            subtitle:
                subtitle?.value ??
                "Conteúdos, reflexões e histórias publicadas pela Guardiana.",
        };
    }

    async saveSection(data: SaveSectionData, actorUserId: string) {
        await prisma.systemSetting.upsert({
            where: { key: "publications_section_title" },
            update: { value: data.title },
            create: {
                key: "publications_section_title",
                value: data.title,
            },
        });

        await prisma.systemSetting.upsert({
            where: { key: "publications_section_subtitle" },
            update: { value: data.subtitle },
            create: {
                key: "publications_section_subtitle",
                value: data.subtitle,
            },
        });

        await this.createAuditLog({
            actorUserId,
            action: AuditAction.UPDATE,
            entity: "PublicationSection",
            entityId: "publications_section",
            description: "Cabeçalho da seção Publicações atualizado.",
        });

        return this.getSection();
    }

    async listCategories() {
        return prisma.publicationCategory.findMany({
            where: { isActive: true },
            orderBy: [{ order: "asc" }, { createdAt: "asc" }],
        });
    }

    async createCategory(data: SaveCategoryData, actorUserId: string) {
        const category = await prisma.publicationCategory.create({
            data: {
                name: data.name,
                order: data.order ?? 0,
                isActive: true,
            },
        });

        await this.createAuditLog({
            actorUserId,
            action: AuditAction.CREATE,
            entity: "PublicationCategory",
            entityId: category.id,
            description: `Categoria "${category.name}" criada.`,
        });

        return category;
    }

    async updateCategory(
        id: string,
        data: SaveCategoryData,
        actorUserId: string,
    ) {
        const category = await prisma.publicationCategory.update({
            where: { id },
            data: {
                name: data.name,
                order: data.order ?? 0,
            },
        });

        await this.createAuditLog({
            actorUserId,
            action: AuditAction.UPDATE,
            entity: "PublicationCategory",
            entityId: category.id,
            description: `Categoria "${category.name}" atualizada.`,
        });

        return category;
    }

    async removeCategory(id: string, actorUserId: string) {
        const hasPublications = await prisma.publication.count({
            where: {
                categoryId: id,
                isActive: true,
            },
        });

        if (hasPublications > 0) {
            throw new Error(
                "Não é possível remover uma categoria com publicações ativas.",
            );
        }

        const category = await prisma.publicationCategory.update({
            where: { id },
            data: { isActive: false },
        });

        await this.createAuditLog({
            actorUserId,
            action: AuditAction.DELETE,
            entity: "PublicationCategory",
            entityId: category.id,
            description: `Categoria "${category.name}" removida.`,
        });

        return category;
    }

    async listPublications() {
        return prisma.publication.findMany({
            where: { isActive: true },
            include: {
                category: true,
            },
            orderBy: {
                date: "desc",
            },
        });
    }

    async createPublication(data: SavePublicationData, actorUserId: string) {
        const publication = await prisma.publication.create({
            data: {
                title: data.title,
                description: data.description,
                author: data.author,
                date: new Date(data.date),
                isActive: true,
                categoryId: data.categoryId,
            },
            include: {
                category: true,
            },
        });

        await this.createAuditLog({
            actorUserId,
            action: AuditAction.CREATE,
            entity: "Publication",
            entityId: publication.id,
            description: `Publicação "${publication.title}" criada.`,
        });

        return publication;
    }

    async updatePublication(
        id: string,
        data: SavePublicationData,
        actorUserId: string,
    ) {
        const publication = await prisma.publication.update({
            where: { id },
            data: {
                title: data.title,
                description: data.description,
                author: data.author,
                date: new Date(data.date),
                categoryId: data.categoryId,
            },
            include: {
                category: true,
            },
        });

        await this.createAuditLog({
            actorUserId,
            action: AuditAction.UPDATE,
            entity: "Publication",
            entityId: publication.id,
            description: `Publicação "${publication.title}" atualizada.`,
        });

        return publication;
    }

    async removePublication(id: string, actorUserId: string) {
        const publication = await prisma.publication.update({
            where: { id },
            data: { isActive: false },
        });

        await this.createAuditLog({
            actorUserId,
            action: AuditAction.DELETE,
            entity: "Publication",
            entityId: publication.id,
            description: `Publicação "${publication.title}" removida.`,
        });

        return publication;
    }

    private async createAuditLog(data: {
        actorUserId: string;
        action: AuditAction;
        entity: string;
        entityId: string;
        description: string;
    }) {
        await prisma.auditLog.create({
            data: {
                actorUserId: data.actorUserId,
                action: data.action,
                entity: data.entity,
                entityId: data.entityId,
                description: data.description,
            },
        });
    }
}