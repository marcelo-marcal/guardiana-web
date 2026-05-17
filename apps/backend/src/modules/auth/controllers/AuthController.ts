// ================================
// IMPORTS
// ================================
import type { Request, Response } from "express";
import { loginSchema } from "../dto/login.dto.js";
import { AuthService } from "../services/AuthService.js";

// ================================
// CONTROLLER DE AUTENTICAÇÃO
// ================================
export class AuthController {
    private readonly authService = new AuthService();

    // ================================
    // LOGIN
    // ================================
    async login(request: Request, response: Response) {
        try {
            const data = loginSchema.parse(request.body);
            const result = await this.authService.login(data);

            return response.json({
                success: true,
                ...result,
            });
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Erro ao realizar login.";

            return response.status(401).json({
                success: false,
                message,
            });
        }
    }
}