// ================================
// IMPORTS
// ================================
import { PoemStatus } from "../../../shared/database/prisma.js";
import { z } from "zod";

// ================================
// DTO: REVISAR POEMA
// ================================
export const reviewPoemSchema = z.object({
    status: z.enum([PoemStatus.APPROVED, PoemStatus.REJECTED]),
    rejectionReason: z.string().optional(),
});

// ================================
// TIPO: REVISAR POEMA
// ================================
export type ReviewPoemDTO = z.infer<typeof reviewPoemSchema>;