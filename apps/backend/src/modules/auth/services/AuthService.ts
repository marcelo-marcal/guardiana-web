import { prisma } from "../../../shared/database/prisma.js";
import { AuditAction, UserRole } from "@prisma/client"; // Import UserRole
import crypto from "node:crypto";
import { EmailService } from "./EmailService.js";

// import bcrypt from "bcrypt"; // Descomente e instale 'bcrypt' para senhas seguras

export class AuthService {
    private emailService = new EmailService();

    // ================================
    // SOLICITAR CÓDIGO DE ACESSO
    // ================================
    async requestAccessCode(email: string) {
        const code = crypto.randomInt(100000, 999999).toString();
        const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos

        let user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            // Auto-cadastro se não existir
            user = await prisma.user.create({
                data: {
                    email,
                    name: email.split('@')[0], // Nome provisório
                    verificationCode: code,
                    verificationExpires: expires
                }
            });
        } else {
            await prisma.user.update({
                where: { id: user.id },
                data: {
                    verificationCode: code,
                    verificationExpires: expires
                }
            });
        }

        try {
            await this.emailService.sendVerificationCode(email, code);
        } catch (error) {
            console.error("Erro ao enviar e-mail:", error);
            throw new Error("Não foi possível enviar o e-mail de verificação.");
        }
        
        return { message: "Código enviado com sucesso." };
    }

    // ================================
    // VERIFICAR CÓDIGO E LOGAR
    // ================================
    async verifyCode(email: string, code: string) {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user || user.verificationCode !== code) {
            throw new Error("Código inválido.");
        }

        if (user.verificationExpires && user.verificationExpires < new Date()) {
            throw new Error("Código expirado.");
        }

        // Limpa o código após o uso
        await prisma.user.update({
            where: { id: user.id },
            data: { verificationCode: null, verificationExpires: null }
        });

        // Aqui você geraria o seu Token JWT
        return {
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            },
            token: "TOKEN_JWT_GERADO_AQUI"
        };
    }

    // ================================
    // LOGIN DE ADMINISTRADOR (EMAIL/SENHA)
    // ================================
    async adminLogin(email: string, password: string) {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            throw new Error("Credenciais inválidas.");
        }

        // Verifica se o usuário tem a role de ADMIN ou SUPER_ADMIN
        if (user.role !== UserRole.ADMIN && user.role !== UserRole.SUPER_ADMIN) {
            throw new Error("Acesso não autorizado para este perfil.");
        }

        // TODO: Implementar comparação de senha segura usando hashing (ex: bcrypt)
        // Exemplo com bcrypt (após instalar e importar):
        // const passwordMatch = await bcrypt.compare(password, user.passwordHash || '');
        // if (!passwordMatch) {
        //     throw new Error("Credenciais inválidas.");
        // }
        // AVISO: A comparação abaixo é INSEGURA e APENAS para fins de teste.
        // Substitua por hashing de senha em produção!
        if (!user.passwordHash || user.passwordHash !== password) {
             throw new Error("Credenciais inválidas.");
        }

        // TODO: Gerar um token JWT real com o ID e a role do usuário
        const token = `ADMIN_JWT_TOKEN_GERADO_AQUI_PARA_${user.id}_${user.role}`; // Placeholder

        // Cria log de auditoria para o login do administrador
        await prisma.auditLog.create({
            data: {
                actorUserId: user.id,
                action: AuditAction.LOGIN,
                entity: "User",
                entityId: user.id,
                description: `Administrador ${user.email} logou.`,
            },
        });

        // Retorna os dados do usuário e o token
        return { user: { id: user.id, email: user.email, name: user.name, role: user.role }, token };
    }
}