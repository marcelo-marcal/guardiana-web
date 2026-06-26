// ================================
// IMPORTS
// ================================
import { PrismaClient } from "@prisma/client";

// ================================
// PRISMA CLIENT
// ================================
export const prisma = new PrismaClient();

// Exportando Enums para facilitar o uso e evitar erros de importação ESM
export * from "@prisma/client";
