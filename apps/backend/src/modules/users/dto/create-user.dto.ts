// ================================
// IMPORTS
// ================================
import { z } from "zod";

// ================================
// DTO: CRIAR USUÁRIO COMUM
// ================================
export const createUserSchema = z.object({
    name: z.string().min(2, "Nome obrigatório."),
    email: z.string().email("E-mail inválido."),
    password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres."),

    avatarUrl: z.string().optional(),
    bio: z.string().optional(),
    literaryInterests: z.string().optional(),
});

// ================================
// TIPO: CRIAR USUÁRIO
// ================================
export type CreateUserDTO = z.infer<typeof createUserSchema>;