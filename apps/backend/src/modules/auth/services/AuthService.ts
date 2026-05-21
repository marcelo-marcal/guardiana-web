import { prisma } from "../../../shared/database/prisma.js";
import { AuditAction, UserRole } from "@prisma/client"; // Import UserRole
import crypto from "node:crypto";
import { EmailService } from "../../../shared/services/EmailService.js";
import jwt from "jsonwebtoken";

// import bcrypt from "bcrypt"; // Descomente e instale 'bcrypt' para senhas seguras

export class AuthService {
    private emailService = new EmailService();

    // ================================
    // HELPER: GERAR TOKEN REAL
    // ================================
    private generateToken(user: { id: string; email: string; role: string }) {
        const secret = process.env.JWT_SECRET;
        if (!secret) throw new Error("JWT_SECRET não configurado no servidor.");

        return jwt.sign(
            { sub: user.id, email: user.email, role: user.role },
            secret,
            { expiresIn: "7d" } // Token vale por 7 dias
        );
    }

    // ================================
    // SOLICITAR CÓDIGO DE ACESSO
    // ================================
    async requestAccessCode(email: string, role: UserRole = UserRole.USER) {
        let user = await prisma.user.findUnique({ where: { email } });
        const emailPrefix = email.split('@')[0];

        // REGRA: Se o usuário já existe e já completou o cadastro (nome diferente do e-mail)
        if (user && user.name !== emailPrefix) {
            // Loga o usuário diretamente
            const token = this.generateToken(user);
            
            return { 
                action: "LOGGED_IN",
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                    name: user.name
                },
                token
            };
        }

        // Se o usuário não existe ou ainda é novo (nome é o prefixo do e-mail)
        const code = crypto.randomInt(100000, 999999).toString();
        const expires = new Date(Date.now() + 15 * 60 * 1000);

        if (!user) {
            user = await prisma.user.create({
                data: {
                    email,
                    name: emailPrefix,
                    role,
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
        
        return { action: "CODE_SENT", message: "Código enviado com sucesso." };
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

        const token = this.generateToken(user);

        return {
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                name: user.name
            },
            token,
            requiresRegistration: user.name === user.email.split('@')[0]
        };
    }

    // ================================
    // CONCLUIR CADASTRO
    // ================================
    async completeRegistration(email: string, name: string, literaryInterests?: string) {
        const user = await prisma.user.update({
            where: { email },
            data: {
                name,
                literaryInterests
            }
        });

        return {
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                name: user.name,
                literaryInterests: user.literaryInterests
            },
            message: "Cadastro concluído com sucesso."
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

        const token = this.generateToken(user);

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

    // ================================
    // BUSCAR DADOS DO USUÁRIO LOGADO
    // ================================
    async getMe(token: string) {
        const secret = process.env.JWT_SECRET;
        if (!secret) throw new Error("JWT_SECRET não configurado.");

        try {
            const decoded = jwt.verify(token, secret) as { sub: string };
            
            const user = await prisma.user.findUnique({
                where: { id: decoded.sub }
            });

            if (!user || user.status !== "ACTIVE") {
                throw new Error("Sessão inválida ou expirada.");
            }

            return {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                status: user.status,
                avatarUrl: user.avatarUrl,
                literaryInterests: user.literaryInterests
            };
        } catch (error) {
            throw new Error("Sessão inválida ou expirada.");
        }
    }

    // ================================
    // BUSCAR CONFIGURAÇÃO
    // ================================
    async getSetting(key: string) {
        return prisma.systemSetting.findUnique({ where: { key } });
    }

    // ================================
    // ATUALIZAR CONFIGURAÇÃO
    // ================================
    async updateSetting(key: string, value: string) {
        return prisma.systemSetting.upsert({
            where: { key },
            update: { value },
            create: { key, value }
        });
    }
}