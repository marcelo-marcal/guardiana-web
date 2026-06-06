// ================================
// IMPORTS
// ================================
import { z } from "zod";

// ================================
// DTO: ATUALIZAR PERFIL
// ================================
export const updateProfileSchema = z.object({
    name: z.string().min(2, "Nome obrigatório.").optional(),
    avatarUrl: z.string().optional(),
    bio: z.string().optional(),
    literaryInterests: z.string().optional(),
    password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres.").optional(),
});

// ================================
// TIPO: ATUALIZAR PERFIL
// ================================
export type UpdateProfileDTO = z.infer<typeof updateProfileSchema>;