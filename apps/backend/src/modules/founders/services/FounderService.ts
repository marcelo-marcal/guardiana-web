// ================================
// IMPORTS
// ================================
import { prisma } from "../../../shared/database/prisma.js";

// ================================
// SERVICE: FUNDADORAS
// ================================
export class FounderService {
    async listAll() {
        return prisma.founder.findMany({
            orderBy: {
                order: "asc",
            },
        });
    }

    async create(data: any) {
        return prisma.founder.create({
            data: {
                name: data.name,
                role: data.role,
                description: data.description,
                imageUrl: data.imageUrl,
                position: data.position || "object-[center_20%]",
                order: data.order || 0,
            },
        });
    }

    async update(id: string, data: any) {
        return prisma.founder.update({
            where: { id },
            data: {
                name: data.name,
                role: data.role,
                description: data.description,
                imageUrl: data.imageUrl,
                position: data.position,
                order: data.order,
            },
        });
    }

    async delete(id: string) {
        return prisma.founder.delete({
            where: { id },
        });
    }
}
