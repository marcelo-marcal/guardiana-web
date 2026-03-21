// ================================
// IMPORTS
// ================================
import { conteudoInicial } from "@/data/conteudo";

// ================================
// TIPAGEM DO CONTEÚDO
// ================================
type Conteudo = {
    hero: {
        titulo: string;
        subtitulo: string;
    };
};

// ================================
// CHAVE DO "BANCO"
// ================================
const STORAGE_KEY = "conteudo";

// ================================
// BUSCAR CONTEÚDO
// ================================
export function getConteudo(): Conteudo {
    if (typeof window === "undefined") return conteudoInicial;

    const data = localStorage.getItem(STORAGE_KEY);

    if (data) {
        return JSON.parse(data);
    }

    return conteudoInicial;
}

// ================================
// SALVAR CONTEÚDO
// ================================
export function setConteudo(novoConteudo: Conteudo) {
    if (typeof window === "undefined") return;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(novoConteudo));
}