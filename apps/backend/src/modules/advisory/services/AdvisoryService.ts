// ================================
// IMPORTS
// ================================
import { prisma } from "../../../shared/database/prisma.js";

// ================================
// SERVICE: ASSESSORIAS
// ================================
export class AdvisoryService {
    async listAll() {
        return prisma.advisory.findMany({
            orderBy: {
                order: "asc",
            },
        });
    }

    async listActive() {
        return prisma.advisory.findMany({
            where: {
                isActive: true
            },
            orderBy: {
                order: "asc",
            },
        });
    }

    async create(data: any) {
        return prisma.advisory.create({
            data: {
                title: data.title,
                description: data.description,
                items: data.items || [],
                isActive: data.isActive !== undefined ? data.isActive : true,
                order: data.order || 0,
            },
        });
    }

    async update(id: string, data: any) {
        return prisma.advisory.update({
            where: { id },
            data: {
                title: data.title,
                description: data.description,
                items: data.items,
                isActive: data.isActive,
                order: data.order,
            },
        });
    }

    async delete(id: string) {
        return prisma.advisory.delete({
            where: { id },
        });
    }
}
