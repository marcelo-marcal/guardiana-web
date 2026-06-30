// ================================
// IMPORTS
// ================================
import {
    PrismaClient,
    AuditAction,
    UserRole,
    UserStatus,
    PoemStatus,
    BookFormat,
    OrderStatus,
    Prisma
} from "@prisma/client";

// ================================
// PRISMA CLIENT
// ================================
export const prisma = new PrismaClient();

// Exportando Enums e Tipos explicitamente para evitar erros de importação ESM
// O Prisma expõe esses valores tanto como tipos quanto como objetos/enums
export {
    AuditAction,
    UserRole,
    UserStatus,
    PoemStatus,
    BookFormat,
    OrderStatus,
    Prisma
};
