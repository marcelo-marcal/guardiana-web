// ================================
// IMPORTS
// ================================
import { prisma } from "../../../shared/database/prisma.js";

// ================================
// SERVICE: CONSELHO
// ================================
export class CouncilService {
    async listAll() {
        return prisma.councilMember.findMany({
            orderBy: {
                order: "asc",
            },
        });
    }

    async create(data: any) {
        return prisma.councilMember.create({
            data: {
                name: data.name,
                country: data.country,
                imageUrl: data.imageUrl,
                order: data.order || 0,
            },
        });
    }

    async update(id: string, data: any) {
        return prisma.councilMember.update({
            where: { id },
            data: {
                name: data.name,
                country: data.country,
                imageUrl: data.imageUrl,
                order: data.order,
            },
        });
    }

    async delete(id: string) {
        return prisma.councilMember.delete({
            where: { id },
        });
    }
}
