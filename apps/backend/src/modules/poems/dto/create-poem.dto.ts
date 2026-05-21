// ================================
// IMPORTS
// ================================
import { z } from "zod";

// ================================
// DTO: CRIAR POEMA
// ================================
export const createPoemSchema = z.object({
    title: z
        .string()
        .min(2, "Título obrigatório.")
        .max(150, "Título muito grande."),

    content: z
        .string()
        .min(10, "O poema deve ter conteúdo.")
        .max(10000, "Poema muito grande."),

    authorName: z.string().optional(),
    authorPhotoUrl: z.string().optional(),
});

// ================================
// TIPO: CRIAR POEMA
// ================================
export type CreatePoemDTO = z.infer<typeof createPoemSchema>;