// ================================
// IMPORTS
// ================================
import express from "express";
import cors from "cors";
import "dotenv/config";
import { authRoutes } from "./modules/auth/routes/auth.routes.js";
import { bookRoutes } from "./modules/books/routes/books.routes.js";
import { auditRoutes } from "./modules/audit/routes/audit.routes.js";
import { userRoutes } from "./modules/users/routes/users.routes.js";
import { poemRoutes } from "./modules/poems/routes/poems.routes.js";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { uploadRoutes } from "./modules/uploads/routes/uploads.routes.js";
import { contactRoutes } from "./modules/contact/routes/contact.routes.js";
import { founderRoutes } from "./modules/founders/routes/founders.routes.js";
import { councilRoutes } from "./modules/council/routes/council.routes.js";

// ================================
// CONFIGURAÇÕES DE AMBIENTE
// ================================

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
app.use(cors({
  origin: [
    'https://www.editoraguardiana.com',
    'https://editoraguardiana.com',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://192.168.0.10:3000',
    'http://192.168.0.14:3000',
    'http://100.110.16.22:3000'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

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
app.use("/contact", contactRoutes);
app.use("/founders", founderRoutes);
app.use("/council", councilRoutes);

// ================================
// INICIAR SERVIDOR
// ================================
app.listen(PORT, "0.0.0.0", () => {
    console.log(`API Guardiana rodando em http://localhost:${PORT}`);
});