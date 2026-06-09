// ================================
// IMPORTS
// ================================
import { z } from "zod";

// ================================
// DTO: CRIAR LIVRO
// ================================
export const createBookSchema = z.object({
    title: z.string().min(1, "Título obrigatório."),
    author: z.string().min(1, "Autor obrigatório."),
    description: z.string().min(1, "Descrição obrigatória."),

    coverUrl: z.string().optional(),
    year: z.string().optional(),
    isbn: z.string().optional(),
    pages: z.string().optional(),
    price: z.coerce.number().optional(),
    dimensions: z.string().optional(),
    language: z.string().optional(),
    format: z.enum(["PHYSICAL", "EBOOK", "BOTH"]).optional(),
    ebookFileUrl: z.string().optional(),
    physicalStock: z.coerce.number().int().optional(),
    isHomeFeature: z.boolean().optional(),
});

// ================================
// TIPO: CRIAR LIVRO
// ================================
export type CreateBookDTO = z.infer<typeof createBookSchema>;