// ================================
// IMPORTS
// ================================
import { prisma } from "../../../shared/database/prisma.js";

// ================================
// TIPOS
// ================================

export interface CreateCarouselSlideData {
    title: string;
    altText: string;
    imageUrl: string;
    displayText?: string | null;
    linkUrl?: string | null;
    order?: number;
    isActive?: boolean;
}

export interface UpdateCarouselSlideData {
    title?: string;
    altText?: string;
    imageUrl?: string;
    displayText?: string | null;
    linkUrl?: string | null;
    order?: number;
    isActive?: boolean;
}

// ================================
// SERVICE: CARROSSEL
// ================================

export class CarouselService {
    // ================================
    // LISTAR SLIDES ATIVOS
    // ================================

    async listActive() {
        return prisma.carouselSlide.findMany({
            where: {
                isActive: true,
            },
            orderBy: [
                {
                    order: "asc",
                },
                {
                    createdAt: "asc",
                },
            ],
        });
    }

    // ================================
    // LISTAR TODOS OS SLIDES
    // ================================

    async listAll() {
        return prisma.carouselSlide.findMany({
            orderBy: [
                {
                    order: "asc",
                },
                {
                    createdAt: "asc",
                },
            ],
        });
    }

    // ================================
    // BUSCAR SLIDE PELO ID
    // ================================

    async findById(id: string) {
        return prisma.carouselSlide.findUnique({
            where: {
                id,
            },
        });
    }

    // ================================
    // CRIAR SLIDE
    // ================================

    async create(data: CreateCarouselSlideData) {
        return prisma.carouselSlide.create({
            data: {
                title: data.title,
                altText: data.altText,
                imageUrl: data.imageUrl,
                displayText: data.displayText ?? null,
                linkUrl: data.linkUrl ?? null,
                order: data.order ?? 0,
                isActive: data.isActive ?? true,
            },
        });
    }

    // ================================
    // ATUALIZAR SLIDE
    // ================================

    async update(
        id: string,
        data: UpdateCarouselSlideData,
    ) {
        return prisma.carouselSlide.update({
            where: {
                id,
            },
            data: {
                ...(data.title !== undefined && {
                    title: data.title,
                }),

                ...(data.altText !== undefined && {
                    altText: data.altText,
                }),

                ...(data.imageUrl !== undefined && {
                    imageUrl: data.imageUrl,
                }),

                ...(data.displayText !== undefined && {
                    displayText: data.displayText,
                }),

                ...(data.linkUrl !== undefined && {
                    linkUrl: data.linkUrl,
                }),

                ...(data.order !== undefined && {
                    order: data.order,
                }),

                ...(data.isActive !== undefined && {
                    isActive: data.isActive,
                }),
            },
        });
    }

    // ================================
    // ALTERAR SITUAÇÃO DO SLIDE
    // ================================

    async updateStatus(
        id: string,
        isActive: boolean,
    ) {
        return prisma.carouselSlide.update({
            where: {
                id,
            },
            data: {
                isActive,
            },
        });
    }

    // ================================
    // EXCLUIR SLIDE
    // ================================

    async delete(id: string) {
        return prisma.carouselSlide.delete({
            where: {
                id,
            },
        });
    }
}