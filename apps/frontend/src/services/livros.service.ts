// ================================
// TIPAGEM DO LIVRO
// ================================
export type Livro = {
    id: number;
    titulo: string;
    autor: string;
    imagem: string;
    descricao: string;
    ano: string;
    isbn: string;
    paginas: string;
    preco: string;
    dimensoes: string;
    idioma: string;
    destaqueHome: boolean;
};

// ================================
// CHAVE DO "BANCO" LOCAL
// ================================
const STORAGE_KEY_LIVROS = "guardiana_livros";

// ================================
// LIVROS INICIAIS
// ================================
export const livrosIniciais: Livro[] = [
    {
        id: 1,
        titulo: "Emaranhado",
        autor: "Talles Lisot",
        imagem: "/livro-emaranhado.jpeg",
        descricao:
            "Emaranhado nasce como um mergulho íntimo na mente do jovem artista brasileiro de Marau, Rio Grande do Sul, Talles Lisot. Neste livro de escritos e poemas, a palavra se torna espelho e labirinto. Um espaço onde dúvidas sobre a vida, a criação e a própria identidade se entrelaçam sem a promessa de respostas fáceis.",
        ano: "2026",
        isbn: "978-65-975564-0-3",
        paginas: "108 páginas",
        preco: "",
        dimensoes: "14x21 cm",
        idioma: "Português",
        destaqueHome: true,
    },
];

// ================================
// VALIDAR SE O OBJETO É LIVRO
// ================================
function isLivro(value: unknown): value is Livro {
    if (typeof value !== "object" || value === null) return false;

    const livro = value as Record<string, unknown>;

    return (
        typeof livro.id === "number" &&
        typeof livro.titulo === "string" &&
        typeof livro.autor === "string" &&
        typeof livro.imagem === "string" &&
        typeof livro.descricao === "string" &&
        typeof livro.ano === "string" &&
        typeof livro.isbn === "string" &&
        typeof livro.paginas === "string" &&
        typeof livro.preco === "string" &&
        typeof livro.dimensoes === "string" &&
        typeof livro.idioma === "string" &&
        typeof livro.destaqueHome === "boolean"
    );
}

// ================================
// BUSCAR LIVROS
// ================================
export function getLivros(): Livro[] {
    if (typeof window === "undefined") return livrosIniciais;

    const data = localStorage.getItem(STORAGE_KEY_LIVROS);

    if (!data) return livrosIniciais;

    try {
        const parsed: unknown = JSON.parse(data);

        if (Array.isArray(parsed) && parsed.every(isLivro)) {
            return parsed;
        }

        return livrosIniciais;
    } catch {
        return livrosIniciais;
    }
}

// ================================
// SALVAR LIVROS
// ================================
export function setLivros(livros: Livro[]) {
    if (typeof window === "undefined") return;

    localStorage.setItem(STORAGE_KEY_LIVROS, JSON.stringify(livros));

    // Aviso global para Home e página pública atualizarem
    window.dispatchEvent(new Event("livrosAtualizados"));
}

// ================================
// BUSCAR LIVROS EM DESTAQUE
// Regra: Home mostra no máximo 3
// ================================
export function getLivrosDestaque(): Livro[] {
    return getLivros()
        .filter((livro) => livro.destaqueHome)
        .slice(0, 3);
}