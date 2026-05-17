// ================================
// IMPORTS
// ================================
import { z } from "zod";

// ================================
// DTO DE LOGIN
// ================================
export const loginSchema = z.object({
    email: z.string().email("E-mail inválido."),
    password: z.string().min(1, "Senha obrigatória."),
});

// ================================
// TIPO DO LOGIN
// ================================
export type LoginDTO = z.infer<typeof loginSchema>;