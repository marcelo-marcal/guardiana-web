// ================================
// IMPORTS
// ================================
import type { Response } from "express";
import { UserRole } from "@prisma/client";
import { createUserSchema } from "../dto/create-user.dto.js";
import { updateProfileSchema } from "../dto/update-profile.dto.js";
import { UserService } from "../services/UserService.js";
import type { AuthenticatedRequest } from "../../auth/middleware/authenticate.js";

// ================================
// CONTROLLER: USUÁRIOS
// ================================
export class UserController {
    private readonly userService = new UserService();

    // ================================
    // CADASTRAR USUÁRIO COMUM
    // Público: usado pelo cadastro do site
    // ================================
    async create(request: AuthenticatedRequest, response: Response) {
        try {
            const data = createUserSchema.parse(request.body);
            const user = await this.userService.createCommonUser(data);

            return response.status(201).json({
                success: true,
                user,
            });
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Erro ao cadastrar usuário.";

            return response.status(400).json({
                success: false,
                message,
            });
        }
    }

    // ================================
    // BUSCAR MEU PERFIL
    // Protegido: qualquer usuário logado
    // ================================
    async me(request: AuthenticatedRequest, response: Response) {
        try {
            if (!request.user) {
                return response.status(401).json({
                    success: false,
                    message: "Usuário não autenticado.",
                });
            }

            const user = await this.userService.getMyProfile(request.user.id);

            return response.json({
                success: true,
                user,
            });
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Erro ao buscar perfil.";

            return response.status(400).json({
                success: false,
                message,
            });
        }
    }

    // ================================
    // ATUALIZAR MEU PERFIL
    // Protegido: qualquer usuário logado
    // ================================
    async updateMe(request: AuthenticatedRequest, response: Response) {
        try {
            if (!request.user) {
                return response.status(401).json({
                    success: false,
                    message: "Usuário não autenticado.",
                });
            }

            const data = updateProfileSchema.parse(request.body);
            const user = await this.userService.updateMyProfile(
                request.user.id,
                data,
            );

            return response.json({
                success: true,
                user,
            });
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Erro ao atualizar perfil.";

            return response.status(400).json({
                success: false,
                message,
            });
        }
    }

    // ================================
    // LISTAR TODOS OS USUÁRIOS
    // Protegido: ADMIN / SUPER_ADMIN
    // ================================
    async index(_request: AuthenticatedRequest, response: Response) {
        try {
            const users = await this.userService.listAllUsers();

            return response.json({
                success: true,
                users,
            });
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Erro ao listar usuários.";

            return response.status(500).json({
                success: false,
                message,
            });
        }
    }

    // ================================
    // ADMIN: CRIAR USUÁRIO
    // ================================
    async adminCreate(request: AuthenticatedRequest, response: Response) {
        try {
            const actorRole = request.user?.role as UserRole;
            const user = await this.userService.adminCreateUser(actorRole, request.body);

            return response.status(201).json({
                success: true,
                user,
            });
        } catch (error) {
            const message = error instanceof Error ? error.message : "Erro ao criar usuário.";
            return response.status(400).json({ success: false, message });
        }
    }

    // ================================
    // ADMIN: ATUALIZAR USUÁRIO
    // ================================
    async adminUpdate(request: AuthenticatedRequest, response: Response) {
        try {
            const { id } = request.params;
            const actorRole = request.user?.role as UserRole;
            const user = await this.userService.adminUpdateUser(actorRole, id, request.body);

            return response.json({
                success: true,
                user,
            });
        } catch (error) {
            const message = error instanceof Error ? error.message : "Erro ao atualizar usuário.";
            return response.status(400).json({ success: false, message });
        }
    }

    // ================================
    // ADMIN: DELETAR USUÁRIO
    // ================================
    async adminDelete(request: AuthenticatedRequest, response: Response) {
        try {
            const { id } = request.params;
            const actorRole = request.user?.role as UserRole;
            await this.userService.deleteUser(actorRole, id);

            return response.json({
                success: true,
                message: "Usuário removido com sucesso.",
            });
        } catch (error) {
            const message = error instanceof Error ? error.message : "Erro ao deletar usuário.";
            return response.status(400).json({ success: false, message });
        }
    }
}