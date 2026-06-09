// ================================
// IMPORTS
// ================================
import type { NextFunction, Response } from "express";
import type { AuthenticatedRequest } from "./authenticate.js";

// ================================
// PAPÉIS PERMITIDOS
// ================================
type AllowedRole = "USER" | "ADMIN" | "SUPER_ADMIN";

// ================================
// MIDDLEWARE: AUTORIZAR POR PERFIL
// ================================
export function authorize(allowedRoles: AllowedRole[]) {
    return (
        request: AuthenticatedRequest,
        response: Response,
        next: NextFunction,
    ) => {
        // ================================
        // VERIFICAR SE EXISTE USUÁRIO AUTENTICADO
        // ================================
        if (!request.user) {
            return response.status(401).json({
                success: false,
                message: "Usuário não autenticado.",
            });
        }

        // ================================
        // VERIFICAR SE O PERFIL TEM PERMISSÃO
        // ================================
        const hasPermission = allowedRoles.includes(
            request.user.role as AllowedRole,
        );

        if (!hasPermission) {
            return response.status(403).json({
                success: false,
                message: "Você não tem permissão para acessar este recurso.",
            });
        }

        return next();
    };
}