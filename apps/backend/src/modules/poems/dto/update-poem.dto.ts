// ================================
// IMPORTS
// ================================
import { createPoemSchema } from "./create-poem.dto.js";

// ================================
// DTO: ATUALIZAR POEMA
// ================================
export const updatePoemSchema = createPoemSchema.partial();

// ================================
// TIPO: ATUALIZAR POEMA
// ================================
export type UpdatePoemDTO = typeof updatePoemSchema._type;