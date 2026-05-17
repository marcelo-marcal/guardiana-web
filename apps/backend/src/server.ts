// ================================
// IMPORTS
// ================================
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { authRoutes } from "./modules/auth/routes/auth.routes.js";

// ================================
// CONFIGURAÇÕES DE AMBIENTE
// ================================
dotenv.config();

// ================================
// APP EXPRESS
// ================================
const app = express();

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

// ================================
// ROTAS
// ================================
app.use("/auth", authRoutes);

// ================================
// INICIAR SERVIDOR
// ================================
app.listen(PORT, () => {
    console.log(`API Guardiana rodando em http://localhost:${PORT}`);
});