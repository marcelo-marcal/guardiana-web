// ================================
// IMPORTS
// ================================
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

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
const PORT = Number(process.env.PORT) || 3333;

// ================================
// MIDDLEWARES GLOBAIS
// ================================
app.use(cors());
app.use(express.json());

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
// INICIAR SERVIDOR
// ================================
app.listen(PORT, () => {
    console.log(`API Guardiana rodando em http://localhost:${PORT}`);
});