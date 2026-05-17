// ================================
// IMPORTS
// ================================
import { prisma } from "../../../shared/database/prisma.js";

// ================================
// SERVICE: AUDITORIA
// ================================
export class AuditService {
    // ================================
    // LISTAR LOGS RECENTES
    // ================================
    async listRecentLogs() {
        return prisma.auditLog.findMany({
            orderBy: {
                createdAt: "desc",
            },
            take: 100,
            include: {
                actor: {
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
}