// ================================
// IMPORTS
// ================================
import type { NextFunction, Request, Response } from "express";
import jwt, { type Secret } from "jsonwebtoken";
import { prisma } from "../../../shared/database/prisma.js";

// ================================
// PAYLOAD ESPERADO DO TOKEN JWT
// ================================
type JwtPayload = {
    sub: string;
    email: string;
    role: string;
};

// ================================
// USUÁRIO AUTENTICADO DISPONÍVEL NA REQUEST
// ================================
export type AuthenticatedUser = {
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
};

// ================================
// EXTENSÃO DO EXPRESS REQUEST
// ================================
export type AuthenticatedRequest = Request & {
    user?: AuthenticatedUser;
};

// ================================
// MIDDLEWARE: AUTENTICAR USUÁRIO
// ================================
export async function authenticate(
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
) {
    try {
        // ================================
        // LER HEADER AUTHORIZATION
        // ================================
        const authHeader = request.headers.authorization;

        if (!authHeader) {
            return response.status(401).json({
                success: false,
                message: "Token não informado.",
            });
        }

        // ================================
        // VALIDAR FORMATO: Bearer token
        // ================================
        const [type, token] = authHeader.split(" ");

        if (type !== "Bearer" || !token) {
            return response.status(401).json({
                success: false,
                message: "Token inválido.",
            });
        }

        // ================================
        // VALIDAR JWT_SECRET
        // ================================
        const jwtSecret = process.env.JWT_SECRET;

        if (!jwtSecret) {
            return response.status(500).json({
                success: false,
                message: "JWT_SECRET não configurado.",
            });
        }

        // ================================
        // DECODIFICAR TOKEN
        // ================================
        const decoded = jwt.verify(token, jwtSecret as Secret) as JwtPayload;

        // ================================
        // BUSCAR USUÁRIO NO BANCO
        // ================================
        const user = await prisma.user.findUnique({
            where: {
                id: decoded.sub,
            },
        });

        if (!user) {
            return response.status(401).json({
                success: false,
                message: "Usuário não encontrado.",
            });
        }

        if (user.status !== "ACTIVE") {
            return response.status(403).json({
                success: false,
                message: "Usuário bloqueado ou inativo.",
            });
        }

        // ================================
        // ANEXAR USUÁRIO NA REQUEST
        // ================================
        request.user = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status,
        };

        return next();
    } catch {
        return response.status(401).json({
            success: false,
            message: "Token expirado ou inválido.",
        });
    }
}