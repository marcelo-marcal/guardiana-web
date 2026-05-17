// ================================
// IMPORTS
// ================================
import { createBookSchema } from "./create-book.dto.js";

// ================================
// DTO: ATUALIZAR LIVRO
// ================================
export const updateBookSchema = createBookSchema.partial();

// ================================
// TIPO: ATUALIZAR LIVRO
// ================================
export type UpdateBookDTO = typeof updateBookSchema._type;