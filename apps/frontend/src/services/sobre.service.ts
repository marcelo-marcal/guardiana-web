// ================================
// IMPORTS
// ================================
import { conteudoInicial } from "../data/sobre";

// ================================
// TIPAGEM DO CONTEÚDO
// ================================
type Sobre = {
    sobre: {
        titulo: string;
        subtitulo: string;
    };
};

// ================================
// CHAVE DO "BANCO"
// ================================
const STORAGE_KEY_SOBRE = "sobre";

// ================================
// BUSCAR CONTEÚDO
// ================================
export function getConteudo(): Sobre {
    if (typeof window === "undefined") return conteudoInicial;

    const data = localStorage.getItem(STORAGE_KEY_SOBRE);

    if (data) {
        return JSON.parse(data);
    }

    return conteudoInicial;
}

// ================================
// SALVAR CONTEÚDO
// ================================
export function setConteudo(novoConteudo: Sobre) {
    if (typeof window === "undefined") return;

    localStorage.setItem(STORAGE_KEY_SOBRE, JSON.stringify(novoConteudo));
}