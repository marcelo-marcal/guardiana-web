// ================================
// IMPORTS
// ================================
import bcrypt from "bcryptjs";
import { UserRole, UserStatus, type Prisma } from "@prisma/client";
import { prisma } from "../../../shared/database/prisma.js";
import type { CreateUserDTO } from "../dto/create-user.dto.js";
import type { UpdateProfileDTO } from "../dto/update-profile.dto.js";

// ================================
// SERVICE: USUÁRIOS
// ================================
export class UserService {
    // ================================
    // CRIAR USUÁRIO COMUM
    // ================================
    async createCommonUser(data: CreateUserDTO) {
        const existingUser = await prisma.user.findUnique({
            where: {
                email: data.email,
            },
        });

        if (existingUser) {
            throw new Error("Já existe um usuário com este e-mail.");
        }

        const passwordHash = await bcrypt.hash(data.password, 10);

        return prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                passwordHash,
                role: UserRole.USER,
                status: UserStatus.ACTIVE,
                avatarUrl: data.avatarUrl ?? null,
                bio: data.bio ?? null,
                literaryInterests: data.literaryInterests ?? null,
            },
            select: this.publicUserSelect(),
        });
    }

    // ================================
    // BUSCAR MEU PERFIL
    // ================================
    async getMyProfile(userId: string) {
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
            select: this.publicUserSelect(),
        });

        if (!user) {
            throw new Error("Usuário não encontrado.");
        }

        return user;
    }

    // ================================
    // ATUALIZAR MEU PERFIL
    // ================================
    async updateMyProfile(userId: string, data: UpdateProfileDTO) {
        const updateData: Prisma.UserUpdateInput = {};

        if (data.name !== undefined) updateData.name = data.name;
        if (data.avatarUrl !== undefined) {
            updateData.avatarUrl = data.avatarUrl;
        }
        if (data.bio !== undefined) updateData.bio = data.bio;
        if (data.literaryInterests !== undefined) {
            updateData.literaryInterests = data.literaryInterests;
        }
        if (data.password) {
            updateData.passwordHash = await bcrypt.hash(data.password, 10);
        }
        
        if (data.email) {
            const existingUser = await prisma.user.findUnique({
                where: { email: data.email }
            });
            
            if (existingUser && existingUser.id !== userId) {
                throw new Error("Já existe um usuário com este e-mail.");
            }
            updateData.email = data.email;
        }

        return prisma.user.update({
            where: {
                id: userId,
            },
            data: updateData,
            select: this.publicUserSelect(),
        });
    }

    // ================================
    // LISTAR USUÁRIOS COMUNS
    // Admin/SuperAdmin
    // ================================
    async listCommonUsers() {
        return prisma.user.findMany({
            where: {
                role: UserRole.USER,
            },
            orderBy: {
                createdAt: "desc",
            },
            select: this.publicUserSelect(),
        });
    }

    // ================================
    // CAMPOS PÚBLICOS DO USUÁRIO
    // Nunca retorna passwordHash
    // ================================
    private publicUserSelect() {
        return {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            avatarUrl: true,
            bio: true,
            literaryInterests: true,
            createdAt: true,
            updatedAt: true,
        };
    }
}