// ================================
// IMPORTS
// ================================
import bcrypt from "bcryptjs";
import jwt, { type Secret, type SignOptions } from "jsonwebtoken";
import { prisma } from "../../../shared/database/prisma.js";
import type { LoginDTO } from "../dto/login.dto.js";

// ================================
// PAYLOAD DO TOKEN
// ================================
type TokenPayload = {
    sub: string;
    email: string;
    role: string;
};

// ================================
// SERVICE DE AUTENTICAÇÃO
// ================================
export class AuthService {
    // ================================
    // LOGIN
    // ================================
    async login(data: LoginDTO) {
        const user = await prisma.user.findUnique({
            where: {
                email: data.email,
            },
        });

        if (!user) {
            throw new Error("Credenciais inválidas.");
        }

        if (user.status !== "ACTIVE") {
            throw new Error("Usuário bloqueado ou inativo.");
        }

        const passwordMatches = await bcrypt.compare(
            data.password,
            user.passwordHash,
        );

        if (!passwordMatches) {
            throw new Error("Credenciais inválidas.");
        }

        const jwtSecret = process.env.JWT_SECRET;

        if (!jwtSecret) {
            throw new Error("JWT_SECRET não configurado.");
        }

        const payload: TokenPayload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        };

        const signOptions: SignOptions = {
            expiresIn: "1d",
        };

        const token = jwt.sign(payload, jwtSecret as Secret, signOptions);

        return {
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                status: user.status,
                avatarUrl: user.avatarUrl,
            },
        };
    }
}