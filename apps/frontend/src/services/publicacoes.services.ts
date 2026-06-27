// ================================
// CONFIGURAÇÃO DA API
// ================================
import { getAuthToken } from "@/hooks/useAuth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3333";

// ================================
// TIPOS: CABEÇALHO DA SEÇÃO
// ================================
export type PublicacaoConfig = {
    titulo: string;
    subtitulo: string;
};

// ================================
// TIPOS: CATEGORIA
// ================================
export type CategoriaPublicacao = {
    id: string;
    name: string;
    order: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
};

// ================================
// TIPOS: PUBLICAÇÃO
// ================================
export type Publicacao = {
    id: string;
    categoryId: string;
    title: string;
    description: string;
    author: string;
    date: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    category: CategoriaPublicacao;
};

// ================================
// TIPOS: RESPOSTA PADRÃO DA API
// ================================
type ApiResponse<T> = {
    success: boolean;
    message?: string;
} & T;

// ================================
// HEADERS COM TOKEN
// Usa getAuthToken(), que busca em localStorage OU sessionStorage.
// ================================
function getAuthHeaders() {
    const token = getAuthToken();

    return {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
}

// ================================
// TRATAR RESPOSTA DA API
// ================================
async function handleResponse<T>(response: Response): Promise<T> {
    const data = (await response.json()) as ApiResponse<T>;

    if (!response.ok || !data.success) {
        throw new Error(data.message || "Erro ao processar solicitação.");
    }

    return data as T;
}

// ================================
// BUSCAR CABEÇALHO DA SEÇÃO PUBLICAÇÕES
// ================================
export async function getConteudoConfig(): Promise<PublicacaoConfig> {
    const response = await fetch(`${API_URL}/publications/section`, {
        cache: "no-store",
    });

    const data = await handleResponse<{ section: PublicacaoConfig }>(response);

    return data.section;
}

// ================================
// SALVAR CABEÇALHO DA SEÇÃO PUBLICAÇÕES
// ================================
export async function setConteudoConfig(
    novoConteudo: PublicacaoConfig,
): Promise<PublicacaoConfig> {
    const response = await fetch(`${API_URL}/publications/section`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({
            title: novoConteudo.titulo,
            subtitle: novoConteudo.subtitulo,
        }),
    });

    const data = await handleResponse<{ section: PublicacaoConfig }>(response);

    return data.section;
}

// ================================
// LISTAR CATEGORIAS
// ================================
export async function getCategoriasPublicacoes() {
    const response = await fetch(`${API_URL}/publications/categories`, {
        cache: "no-store",
    });

    const data = await handleResponse<{
        categories: CategoriaPublicacao[];
    }>(response);

    return data.categories;
}

// ================================
// CRIAR CATEGORIA
// ================================
export async function criarCategoriaPublicacao(name: string) {
    const response = await fetch(`${API_URL}/publications/categories`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ name }),
    });

    const data = await handleResponse<{
        category: CategoriaPublicacao;
    }>(response);

    return data.category;
}

// ================================
// ATUALIZAR CATEGORIA
// ================================
export async function atualizarCategoriaPublicacao(id: string, name: string) {
    const response = await fetch(`${API_URL}/publications/categories/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ name }),
    });

    const data = await handleResponse<{
        category: CategoriaPublicacao;
    }>(response);

    return data.category;
}

// ================================
// REMOVER CATEGORIA
// ================================
export async function removerCategoriaPublicacao(id: string) {
    const response = await fetch(`${API_URL}/publications/categories/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
    });

    await handleResponse<{ category: CategoriaPublicacao }>(response);
}

// ================================
// LISTAR PUBLICAÇÕES
// ================================
export async function getPublicacoes() {
    const response = await fetch(`${API_URL}/publications`, {
        cache: "no-store",
    });

    const data = await handleResponse<{
        publications: Publicacao[];
    }>(response);

    return data.publications;
}

// ================================
// TIPO: SALVAR PUBLICAÇÃO
// ================================
export type SalvarPublicacaoData = {
    categoryId: string;
    title: string;
    description: string;
    author: string;
    date: string;
};

// ================================
// CRIAR PUBLICAÇÃO
// ================================
export async function criarPublicacao(data: SalvarPublicacaoData) {
    const response = await fetch(`${API_URL}/publications`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    });

    const result = await handleResponse<{
        publication: Publicacao;
    }>(response);

    return result.publication;
}

// ================================
// ATUALIZAR PUBLICAÇÃO
// ================================
export async function atualizarPublicacao(
    id: string,
    data: SalvarPublicacaoData,
) {
    const response = await fetch(`${API_URL}/publications/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    });

    const result = await handleResponse<{
        publication: Publicacao;
    }>(response);

    return result.publication;
}

// ================================
// REMOVER PUBLICAÇÃO
// ================================
export async function removerPublicacao(id: string) {
    const response = await fetch(`${API_URL}/publications/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
    });

    await handleResponse<{ publication: Publicacao }>(response);
}