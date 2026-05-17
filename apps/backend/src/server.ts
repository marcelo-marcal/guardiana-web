// ================================
// IMPORTS
// ================================
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { authRoutes } from "./modules/auth/routes/auth.routes.js";
import { bookRoutes } from "./modules/books/routes/books.routes.js";
import { auditRoutes } from "./modules/audit/routes/audit.routes.js";
import { userRoutes } from "./modules/users/routes/users.routes.js";
import { poemRoutes } from "./modules/poems/routes/poems.routes.js";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { uploadRoutes } from "./modules/uploads/routes/uploads.routes.js";

// ================================
// CONFIGURAÇÕES DE AMBIENTE
// ================================
dotenv.config();

// ================================
// APP EXPRESS
// ================================
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ================================
// PORTA DO SERVIDOR
// ================================
const PORT = Number(process.env.BACKEND_PORT) || 3333;

// ================================
// CORS
// ================================
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

// ================================
// MIDDLEWARES GLOBAIS
// ================================
app.use(
    cors({
        origin: FRONTEND_URL,
        credentials: true,
    }),
);

app.use(express.json({ limit: "10mb" }));

// ================================
// ROTA DE SAÚDE DA API
// ================================
app.get("/health", (_request, response) => {
    return response.json({
        success: true,
        message: "API Guardiana rodando com sucesso.",
    });
});

app.use(
    "/uploads",
    express.static(path.resolve(__dirname, "../uploads")),
);

// ================================
// ROTAS
// ================================
app.use("/auth", authRoutes);
app.use("/books", bookRoutes);
app.use("/audit-logs", auditRoutes);
app.use("/users", userRoutes);
app.use("/poems", poemRoutes);
app.use("/uploads", uploadRoutes);

// ================================
// INICIAR SERVIDOR
// ================================
app.listen(PORT, () => {
    console.log(`API Guardiana rodando em http://localhost:${PORT}`);
});