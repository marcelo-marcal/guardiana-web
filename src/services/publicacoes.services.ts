// ================================
// IMPORTS
// ================================
import { publicacaoConfig } from "@/data/publicacaoConfig";

// ================================
// TIPAGEM DO CONTEÚDO
// ================================
type PublicacaoConfig = {
    titulo: string;
    subtitulo: string;
};

// ================================
// CHAVE DO "BANCO"
// ================================
const STORAGE_KEY_PUBLICACOES_CONFIG = "publicacoes_config";

// ================================
// BUSCAR CONTEÚDO
// ================================
export function getConteudoConfig(): PublicacaoConfig {
    if (typeof window === "undefined") return publicacaoConfig;

    const data = localStorage.getItem(STORAGE_KEY_PUBLICACOES_CONFIG);

    if (data) {
        return JSON.parse(data);
    }

    return publicacaoConfig;
}

// ================================
// SALVAR CONTEÚDO
// ================================
export function setConteudoConfig(novoConteudo: PublicacaoConfig) {
    if (typeof window === "undefined") return;

    localStorage.setItem(
        STORAGE_KEY_PUBLICACOES_CONFIG,
        JSON.stringify(novoConteudo),
    );
}