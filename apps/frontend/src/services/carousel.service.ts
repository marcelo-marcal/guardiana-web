// ================================
// IMPORTS
// ================================
import { getAuthToken } from "@/hooks/useAuth";

// ================================
// CONFIGURAÇÃO DA API
// ================================
const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "http://127.0.0.1:3333";

// ================================
// TIPO: SLIDE DO CARROSSEL
// ================================
export type CarouselSlide = {
    id: string;
    title: string;
    altText: string;
    imageUrl: string;
    displayText: string | null;
    linkUrl: string | null;
    order: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
};

// ================================
// TIPO: CRIAÇÃO / EDIÇÃO
// ================================
export type CarouselSlideInput = {
    title: string;
    altText: string;
    imageUrl: string;
    displayText?: string | null;
    linkUrl?: string | null;
    order?: number;
    isActive?: boolean;
};

// ================================
// RESPOSTA: LISTAGEM
// ================================
type CarouselListResponse = {
    success: boolean;
    message?: string;
    slides: CarouselSlide[];
};

// ================================
// RESPOSTA: SLIDE
// ================================
type CarouselSlideResponse = {
    success: boolean;
    message?: string;
    slide?: CarouselSlide;
};

// ================================
// RESPOSTA: AÇÃO SIMPLES
// ================================
type CarouselActionResponse = {
    success: boolean;
    message?: string;
};

// ================================
// OBTER TOKEN
// ================================
function getRequiredToken(): string {
    const token = getAuthToken();

    if (!token) {
        throw new Error(
            "Sessão administrativa não encontrada.",
        );
    }

    return token;
}

// ================================
// LER JSON COM SEGURANÇA
// ================================
async function readJson<T>(
    response: Response,
): Promise<T> {
    return (await response.json()) as T;
}

// ================================
// BUSCAR SLIDES PÚBLICOS ATIVOS
// ================================
export async function getCarouselSlides(): Promise<
    CarouselSlide[]
> {
    const response = await fetch(
        `${API_URL}/carousel`,
        {
            method: "GET",
            cache: "no-store",
        },
    );

    const data =
        await readJson<CarouselListResponse>(
            response,
        );

    if (!response.ok || !data.success) {
        throw new Error(
            data.message ||
                "Não foi possível carregar o carrossel.",
        );
    }

    return data.slides;
}

// ================================
// BUSCAR TODOS OS SLIDES NO ADMIN
// ================================
export async function getAdminCarouselSlides(): Promise<
    CarouselSlide[]
> {
    const token = getRequiredToken();

    const response = await fetch(
        `${API_URL}/carousel/admin`,
        {
            method: "GET",
            cache: "no-store",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
    );

    const data =
        await readJson<CarouselListResponse>(
            response,
        );

    if (!response.ok || !data.success) {
        throw new Error(
            data.message ||
                "Não foi possível carregar os slides.",
        );
    }

    return data.slides;
}

// ================================
// CRIAR SLIDE
// ================================
export async function createCarouselSlide(
    input: CarouselSlideInput,
): Promise<CarouselSlide> {
    const token = getRequiredToken();

    const response = await fetch(
        `${API_URL}/carousel`,
        {
            method: "POST",
            headers: {
                "Content-Type":
                    "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(input),
        },
    );

    const data =
        await readJson<CarouselSlideResponse>(
            response,
        );

    if (
        !response.ok ||
        !data.success ||
        !data.slide
    ) {
        throw new Error(
            data.message ||
                "Não foi possível criar o slide.",
        );
    }

    return data.slide;
}

// ================================
// ATUALIZAR SLIDE
// ================================
export async function updateCarouselSlide(
    id: string,
    input: Partial<CarouselSlideInput>,
): Promise<CarouselSlide> {
    const token = getRequiredToken();

    const response = await fetch(
        `${API_URL}/carousel/${id}`,
        {
            method: "PUT",
            headers: {
                "Content-Type":
                    "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(input),
        },
    );

    const data =
        await readJson<CarouselSlideResponse>(
            response,
        );

    if (
        !response.ok ||
        !data.success ||
        !data.slide
    ) {
        throw new Error(
            data.message ||
                "Não foi possível atualizar o slide.",
        );
    }

    return data.slide;
}

// ================================
// ALTERAR STATUS
// ================================
export async function updateCarouselSlideStatus(
    id: string,
    isActive: boolean,
): Promise<CarouselSlide> {
    const token = getRequiredToken();

    const response = await fetch(
        `${API_URL}/carousel/${id}/status`,
        {
            method: "PATCH",
            headers: {
                "Content-Type":
                    "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                isActive,
            }),
        },
    );

    const data =
        await readJson<CarouselSlideResponse>(
            response,
        );

    if (
        !response.ok ||
        !data.success ||
        !data.slide
    ) {
        throw new Error(
            data.message ||
                "Não foi possível alterar a situação do slide.",
        );
    }

    return data.slide;
}

// ================================
// EXCLUIR SLIDE
// ================================
export async function deleteCarouselSlide(
    id: string,
): Promise<void> {
    const token = getRequiredToken();

    const response = await fetch(
        `${API_URL}/carousel/${id}`,
        {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
    );

    const data =
        await readJson<CarouselActionResponse>(
            response,
        );

    if (!response.ok || !data.success) {
        throw new Error(
            data.message ||
                "Não foi possível excluir o slide.",
        );
    }
}

// ================================
// ENVIAR IMAGEM
// ================================
export async function uploadCarouselImage(
    file: File,
): Promise<string> {
    const token = getRequiredToken();

    const formData = new FormData();

    formData.append("image", file);

    const response = await fetch(
        `${API_URL}/uploads/images`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        },
    );

    const data = (await response.json()) as {
        success?: boolean;
        message?: string;
        file?: {
            url?: string;
        };
    };

    if (
        !response.ok ||
        !data.file?.url
    ) {
        throw new Error(
            data.message ||
                "Não foi possível enviar a imagem.",
        );
    }

    return data.file.url;
}