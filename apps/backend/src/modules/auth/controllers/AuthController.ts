// ================================
// IMPORTS
// ================================
import type { Request, Response } from "express";
import { AuthService } from "../services/AuthService.js";

// ================================
// SERVICE
// ================================
const authService = new AuthService();

// ================================
// HELPER: MENSAGEM DE ERRO
// ================================
function getErrorMessage(error: unknown, fallback: string) {
    return error instanceof Error ? error.message : fallback;
}

// ================================
// CONTROLLER: AUTENTICAÇÃO
// ================================
export class AuthController {
    // ================================
    // SOLICITAR CÓDIGO DE ACESSO
    // ================================
    async request(req: Request, res: Response) {
        try {
            const { email, role } = req.body as {
                email?: string;
                role?: "USER" | "ADMIN" | "SUPER_ADMIN";
            };

            if (!email) {
                return res.status(400).json({
                    error: "E-mail obrigatório",
                });
            }

            const result = await authService.requestAccessCode(email, role);

            return res.json(result);
        } catch (error) {
            const message = getErrorMessage(
                error,
                "Erro ao solicitar código.",
            );

            return res.status(500).json({
                error: message,
            });
        }
    }

    // ================================
    // VERIFICAR CÓDIGO
    // ================================
    async verify(req: Request, res: Response) {
        try {
            const { email, code } = req.body as {
                email?: string;
                code?: string;
            };

            if (!email || !code) {
                return res.status(400).json({
                    error: "E-mail e código são obrigatórios",
                });
            }

            const result = await authService.verifyCode(email, code);

            return res.json(result);
        } catch (error) {
            const message = getErrorMessage(
                error,
                "Código inválido ou expirado.",
            );

            return res.status(400).json({
                error: message,
            });
        }
    }

    // ================================
    // LOGIN TRADICIONAL
    // ================================
    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body as {
                email?: string;
                password?: string;
            };

            if (!email || !password) {
                return res.status(400).json({
                    error: "E-mail e senha são obrigatórios",
                });
            }

            const result = await authService.login(email, password);

            return res.json(result);
        } catch (error) {
            const message = getErrorMessage(
                error,
                "Credenciais inválidas.",
            );

            return res.status(401).json({
                error: message,
            });
        }
    }

    // ================================
    // LOGIN ADMINISTRATIVO
    // ================================
    async adminLogin(req: Request, res: Response) {
        try {
            const { email, password } = req.body as {
                email?: string;
                password?: string;
            };

            if (!email || !password) {
                return res.status(400).json({
                    error: "E-mail e senha são obrigatórios",
                });
            }

            const result = await authService.adminLogin(email, password);

            return res.json(result);
        } catch (error) {
            const message = getErrorMessage(
                error,
                "Credenciais inválidas.",
            );

            return res.status(401).json({
                error: message,
            });
        }
    }

    // ================================
    // COMPLETAR CADASTRO
    // ================================
    async completeRegistration(req: Request, res: Response) {
        try {
            const { email, name, password, literaryInterests } = req.body as {
                email?: string;
                name?: string;
                password?: string;
                literaryInterests?: string;
            };

            if (!email || !name) {
                return res.status(400).json({
                    error: "E-mail e nome são obrigatórios",
                });
            }

            const result = await authService.completeRegistration(
                email,
                name,
                password,
                literaryInterests,
            );

            return res.json(result);
        } catch (error) {
            const message = getErrorMessage(
                error,
                "Erro ao completar cadastro.",
            );

            return res.status(400).json({
                error: message,
            });
        }
    }

    // ================================
    // USUÁRIO LOGADO
    // ================================
    async me(req: Request, res: Response) {
        try {
            const authHeader = req.headers.authorization;

            if (!authHeader) {
                return res.status(401).json({
                    success: false,
                    error: "Não autorizado",
                });
            }

            const token = authHeader.split(" ")[1];

            if (!token) {
                return res.status(401).json({
                    success: false,
                    error: "Token não informado",
                });
            }

            const user = await authService.getMe(token);

            return res.json({
                success: true,
                user,
            });
        } catch (error) {
            const message = getErrorMessage(
                error,
                "Sessão inválida ou expirada.",
            );

            return res.status(401).json({
                success: false,
                error: message,
            });
        }
    }

    // ================================
    // BUSCAR CONFIGURAÇÃO
    // ================================
    async getSetting(req: Request, res: Response) {
        try {
            const { key } = req.params;

            const setting = await authService.getSetting(key);

            return res.json({
                success: true,
                value: setting?.value || "false",
            });
        } catch (error) {
            const message = getErrorMessage(
                error,
                "Erro ao buscar configuração.",
            );

            return res.status(400).json({
                success: false,
                error: message,
            });
        }
    }

    // ================================
    // ATUALIZAR CONFIGURAÇÃO
    // ================================
    async updateSetting(req: Request, res: Response) {
        try {
            const { key, value } = req.body as {
                key?: string;
                value?: string | boolean;
            };

            if (!key) {
                return res.status(400).json({
                    success: false,
                    error: "Chave da configuração é obrigatória.",
                });
            }

            const authHeader = req.headers.authorization;

            if (!authHeader) {
                return res.status(401).json({
                    success: false,
                    error: "Não autorizado",
                });
            }

            const token = authHeader.split(" ")[1];

            if (!token) {
                return res.status(401).json({
                    success: false,
                    error: "Token não informado",
                });
            }

            const user = await authService.getMe(token);

            if (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
                throw new Error("Acesso negado.");
            }

            await authService.updateSetting(key, String(value));

            return res.json({
                success: true,
                message: "Configuração atualizada.",
            });
        } catch (error) {
            const message = getErrorMessage(
                error,
                "Erro ao atualizar configuração.",
            );

            return res.status(400).json({
                success: false,
                error: message,
            });
        }
    }
}