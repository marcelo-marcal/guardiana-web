// ================================
// IMPORTS
// ================================
import type { Request, Response } from "express";
import {
    CarouselService,
    type CreateCarouselSlideData,
    type UpdateCarouselSlideData,
} from "../services/CarouselService.js";

// ================================
// TIPOS AUXILIARES
// ================================
type ValidationResult<T> =
    | {
          success: true;
          data: T;
      }
    | {
          success: false;
          message: string;
      };

// ================================
// FUNÇÕES AUXILIARES
// ================================

function isRecord(
    value: unknown,
): value is Record<string, unknown> {
    return (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
    );
}

// ================================
// VALIDAR URL
// ================================

function isValidUrl(value: string): boolean {
    try {
        const url = new URL(value);

        return (
            url.protocol === "http:" ||
            url.protocol === "https:"
        );
    } catch {
        return false;
    }
}

// ================================
// VALIDAR TEXTO OBRIGATÓRIO
// ================================

function validateRequiredText(
    value: unknown,
    fieldName: string,
): ValidationResult<string> {
    if (
        typeof value !== "string" ||
        value.trim().length === 0
    ) {
        return {
            success: false,
            message: `O campo ${fieldName} é obrigatório.`,
        };
    }

    return {
        success: true,
        data: value.trim(),
    };
}

// ================================
// VALIDAR TEXTO OPCIONAL
//
// undefined = campo não enviado
// null      = remover texto existente
// ""        = remover texto existente
// texto     = salva após trim
// ================================

function validateOptionalText(
    value: unknown,
    fieldName: string,
): ValidationResult<string | null | undefined> {
    if (value === undefined) {
        return {
            success: true,
            data: undefined,
        };
    }

    if (value === null) {
        return {
            success: true,
            data: null,
        };
    }

    if (typeof value !== "string") {
        return {
            success: false,
            message: `O campo ${fieldName} deve ser um texto válido.`,
        };
    }

    const normalizedValue = value.trim();

    if (normalizedValue.length === 0) {
        return {
            success: true,
            data: null,
        };
    }

    return {
        success: true,
        data: normalizedValue,
    };
}

// ================================
// VALIDAR ORDEM OPCIONAL
// ================================

function validateOptionalOrder(
    value: unknown,
): ValidationResult<number | undefined> {
    if (value === undefined) {
        return {
            success: true,
            data: undefined,
        };
    }

    if (
        typeof value !== "number" ||
        !Number.isInteger(value) ||
        value < 0
    ) {
        return {
            success: false,
            message:
                "A ordem deve ser um número inteiro igual ou maior que zero.",
        };
    }

    return {
        success: true,
        data: value,
    };
}

// ================================
// VALIDAR BOOLEAN OPCIONAL
// ================================

function validateOptionalBoolean(
    value: unknown,
): ValidationResult<boolean | undefined> {
    if (value === undefined) {
        return {
            success: true,
            data: undefined,
        };
    }

    if (typeof value !== "boolean") {
        return {
            success: false,
            message:
                "A situação do slide deve ser verdadeira ou falsa.",
        };
    }

    return {
        success: true,
        data: value,
    };
}

// ================================
// VALIDAR LINK OPCIONAL
// ================================

function validateOptionalLinkUrl(
    value: unknown,
): ValidationResult<string | null | undefined> {
    if (value === undefined) {
        return {
            success: true,
            data: undefined,
        };
    }

    if (value === null || value === "") {
        return {
            success: true,
            data: null,
        };
    }

    if (
        typeof value !== "string" ||
        !isValidUrl(value.trim())
    ) {
        return {
            success: false,
            message:
                "O link do slide deve ser uma URL válida.",
        };
    }

    return {
        success: true,
        data: value.trim(),
    };
}

// ================================
// VALIDAR CRIAÇÃO
// ================================

function validateCreateData(
    body: unknown,
): ValidationResult<CreateCarouselSlideData> {
    if (!isRecord(body)) {
        return {
            success: false,
            message:
                "Os dados do slide são inválidos.",
        };
    }

    // ============================
    // TÍTULO
    // ============================

    const titleResult =
        validateRequiredText(
            body.title,
            "título",
        );

    if (!titleResult.success) {
        return titleResult;
    }

    // ============================
    // TEXTO ALTERNATIVO
    // ============================

    const altTextResult =
        validateRequiredText(
            body.altText,
            "texto alternativo",
        );

    if (!altTextResult.success) {
        return altTextResult;
    }

    // ============================
    // URL DA IMAGEM
    // ============================

    const imageUrlResult =
        validateRequiredText(
            body.imageUrl,
            "URL da imagem",
        );

    if (!imageUrlResult.success) {
        return imageUrlResult;
    }

    if (!isValidUrl(imageUrlResult.data)) {
        return {
            success: false,
            message:
                "A URL da imagem deve ser válida.",
        };
    }

    // ============================
    // TEXTO VISUAL DO SLIDE
    // ============================

    const displayTextResult =
        validateOptionalText(
            body.displayText,
            "texto de destaque",
        );

    if (!displayTextResult.success) {
        return displayTextResult;
    }

    // ============================
    // LINK
    // ============================

    const linkUrlResult =
        validateOptionalLinkUrl(
            body.linkUrl,
        );

    if (!linkUrlResult.success) {
        return linkUrlResult;
    }

    // ============================
    // ORDEM
    // ============================

    const orderResult =
        validateOptionalOrder(
            body.order,
        );

    if (!orderResult.success) {
        return orderResult;
    }

    // ============================
    // SITUAÇÃO
    // ============================

    const isActiveResult =
        validateOptionalBoolean(
            body.isActive,
        );

    if (!isActiveResult.success) {
        return isActiveResult;
    }

    // ============================
    // MONTAR DADOS
    // ============================

    const data: CreateCarouselSlideData = {
        title: titleResult.data,
        altText: altTextResult.data,
        imageUrl: imageUrlResult.data,
    };

    if (
        displayTextResult.data !==
        undefined
    ) {
        data.displayText =
            displayTextResult.data;
    }

    if (
        linkUrlResult.data !==
        undefined
    ) {
        data.linkUrl =
            linkUrlResult.data;
    }

    if (orderResult.data !== undefined) {
        data.order =
            orderResult.data;
    }

    if (
        isActiveResult.data !==
        undefined
    ) {
        data.isActive =
            isActiveResult.data;
    }

    return {
        success: true,
        data,
    };
}

// ================================
// VALIDAR ATUALIZAÇÃO
// ================================

function validateUpdateData(
    body: unknown,
): ValidationResult<UpdateCarouselSlideData> {
    if (!isRecord(body)) {
        return {
            success: false,
            message:
                "Os dados do slide são inválidos.",
        };
    }

    const data: UpdateCarouselSlideData =
        {};

    // ============================
    // TÍTULO
    // ============================

    if (body.title !== undefined) {
        const titleResult =
            validateRequiredText(
                body.title,
                "título",
            );

        if (!titleResult.success) {
            return titleResult;
        }

        data.title =
            titleResult.data;
    }

    // ============================
    // TEXTO ALTERNATIVO
    // ============================

    if (body.altText !== undefined) {
        const altTextResult =
            validateRequiredText(
                body.altText,
                "texto alternativo",
            );

        if (!altTextResult.success) {
            return altTextResult;
        }

        data.altText =
            altTextResult.data;
    }

    // ============================
    // URL DA IMAGEM
    // ============================

    if (body.imageUrl !== undefined) {
        const imageUrlResult =
            validateRequiredText(
                body.imageUrl,
                "URL da imagem",
            );

        if (!imageUrlResult.success) {
            return imageUrlResult;
        }

        if (
            !isValidUrl(
                imageUrlResult.data,
            )
        ) {
            return {
                success: false,
                message:
                    "A URL da imagem deve ser válida.",
            };
        }

        data.imageUrl =
            imageUrlResult.data;
    }

    // ============================
    // TEXTO VISUAL DO SLIDE
    // ============================

    const displayTextResult =
        validateOptionalText(
            body.displayText,
            "texto de destaque",
        );

    if (!displayTextResult.success) {
        return displayTextResult;
    }

    if (
        displayTextResult.data !==
        undefined
    ) {
        data.displayText =
            displayTextResult.data;
    }

    // ============================
    // LINK
    // ============================

    const linkUrlResult =
        validateOptionalLinkUrl(
            body.linkUrl,
        );

    if (!linkUrlResult.success) {
        return linkUrlResult;
    }

    if (
        linkUrlResult.data !==
        undefined
    ) {
        data.linkUrl =
            linkUrlResult.data;
    }

    // ============================
    // ORDEM
    // ============================

    const orderResult =
        validateOptionalOrder(
            body.order,
        );

    if (!orderResult.success) {
        return orderResult;
    }

    if (orderResult.data !== undefined) {
        data.order =
            orderResult.data;
    }

    // ============================
    // SITUAÇÃO
    // ============================

    const isActiveResult =
        validateOptionalBoolean(
            body.isActive,
        );

    if (!isActiveResult.success) {
        return isActiveResult;
    }

    if (
        isActiveResult.data !==
        undefined
    ) {
        data.isActive =
            isActiveResult.data;
    }

    // ============================
    // NENHUM CAMPO INFORMADO
    // ============================

    if (
        Object.keys(data).length === 0
    ) {
        return {
            success: false,
            message:
                "Informe pelo menos um campo para atualizar.",
        };
    }

    return {
        success: true,
        data,
    };
}

// ================================
// CONTROLLER: CARROSSEL
// ================================

export class CarouselController {
    private readonly carouselService =
        new CarouselService();

    // ================================
    // LISTAGEM PÚBLICA
    // ================================

    async index(
        _request: Request,
        response: Response,
    ) {
        try {
            const slides =
                await this.carouselService.listActive();

            return response.json({
                success: true,
                slides,
            });
        } catch (error) {
            console.error(
                "Erro ao listar slides ativos:",
                error,
            );

            return response
                .status(500)
                .json({
                    success: false,
                    message:
                        "Erro ao listar os slides do carrossel.",
                });
        }
    }

    // ================================
    // LISTAGEM ADMINISTRATIVA
    // ================================

    async adminIndex(
        _request: Request,
        response: Response,
    ) {
        try {
            const slides =
                await this.carouselService.listAll();

            return response.json({
                success: true,
                slides,
            });
        } catch (error) {
            console.error(
                "Erro ao listar slides no painel:",
                error,
            );

            return response
                .status(500)
                .json({
                    success: false,
                    message:
                        "Erro ao listar os slides do painel.",
                });
        }
    }

    // ================================
    // CRIAR SLIDE
    // ================================

    async store(
        request: Request,
        response: Response,
    ) {
        const validation =
            validateCreateData(
                request.body,
            );

        if (!validation.success) {
            return response
                .status(400)
                .json({
                    success: false,
                    message:
                        validation.message,
                });
        }

        try {
            const slide =
                await this.carouselService.create(
                    validation.data,
                );

            return response
                .status(201)
                .json({
                    success: true,
                    message:
                        "Slide criado com sucesso.",
                    slide,
                });
        } catch (error) {
            console.error(
                "Erro ao criar slide:",
                error,
            );

            return response
                .status(500)
                .json({
                    success: false,
                    message:
                        "Erro ao criar o slide.",
                });
        }
    }

    // ================================
    // ATUALIZAR SLIDE
    // ================================

    async update(
        request: Request,
        response: Response,
    ) {
        const { id } =
            request.params;

        const validation =
            validateUpdateData(
                request.body,
            );

        if (!validation.success) {
            return response
                .status(400)
                .json({
                    success: false,
                    message:
                        validation.message,
                });
        }

        try {
            const existingSlide =
                await this.carouselService.findById(
                    id,
                );

            if (!existingSlide) {
                return response
                    .status(404)
                    .json({
                        success: false,
                        message:
                            "Slide não encontrado.",
                    });
            }

            const slide =
                await this.carouselService.update(
                    id,
                    validation.data,
                );

            return response.json({
                success: true,
                message:
                    "Slide atualizado com sucesso.",
                slide,
            });
        } catch (error) {
            console.error(
                "Erro ao atualizar slide:",
                error,
            );

            return response
                .status(500)
                .json({
                    success: false,
                    message:
                        "Erro ao atualizar o slide.",
                });
        }
    }

    // ================================
    // ALTERAR SITUAÇÃO
    // ================================

    async updateStatus(
        request: Request,
        response: Response,
    ) {
        const { id } =
            request.params;

        if (
            !isRecord(request.body) ||
            typeof request.body
                .isActive !== "boolean"
        ) {
            return response
                .status(400)
                .json({
                    success: false,
                    message:
                        "Informe uma situação válida para o slide.",
                });
        }

        try {
            const existingSlide =
                await this.carouselService.findById(
                    id,
                );

            if (!existingSlide) {
                return response
                    .status(404)
                    .json({
                        success: false,
                        message:
                            "Slide não encontrado.",
                    });
            }

            const slide =
                await this.carouselService.updateStatus(
                    id,
                    request.body
                        .isActive,
                );

            return response.json({
                success: true,
                message:
                    slide.isActive
                        ? "Slide ativado com sucesso."
                        : "Slide desativado com sucesso.",
                slide,
            });
        } catch (error) {
            console.error(
                "Erro ao alterar situação do slide:",
                error,
            );

            return response
                .status(500)
                .json({
                    success: false,
                    message:
                        "Erro ao alterar a situação do slide.",
                });
        }
    }

    // ================================
    // EXCLUIR SLIDE
    // ================================

    async destroy(
        request: Request,
        response: Response,
    ) {
        const { id } =
            request.params;

        try {
            const existingSlide =
                await this.carouselService.findById(
                    id,
                );

            if (!existingSlide) {
                return response
                    .status(404)
                    .json({
                        success: false,
                        message:
                            "Slide não encontrado.",
                    });
            }

            await this.carouselService.delete(
                id,
            );

            return response.json({
                success: true,
                message:
                    "Slide excluído com sucesso.",
            });
        } catch (error) {
            console.error(
                "Erro ao excluir slide:",
                error,
            );

            return response
                .status(500)
                .json({
                    success: false,
                    message:
                        "Erro ao excluir o slide.",
                });
        }
    }
}