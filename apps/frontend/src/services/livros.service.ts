// ================================
// CONFIGURAÇÃO DA API
// ================================
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3333";

// ================================
// TIPAGEM DO LIVRO NO FRONTEND
// ================================
export type Livro = {
    id: string;
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
// TIPAGEM DO LIVRO VINDO DO BACKEND
// ================================
type BackendBook = {
    id: string;
    title: string;
    author: string;
    description: string;
    coverUrl: string | null;
    year: string | null;
    isbn: string | null;
    pages: string | null;
    price: string | number | null;
    dimensions: string | null;
    language: string | null;
    isHomeFeature: boolean;
};

// ================================
// RESPOSTA DA API
// ================================
type BooksResponse = {
    success: boolean;
    books: BackendBook[];
};

// ================================
// CONVERTER BACKEND -> FRONTEND
// ================================
function mapBackendBookToLivro(book: BackendBook): Livro {
    return {
        id: book.id,
        titulo: book.title,
        autor: book.author,
        imagem: book.coverUrl
            ? book.coverUrl.startsWith("/uploads")
                ? `${API_URL}${book.coverUrl}`
                : book.coverUrl
            : "/livro-emaranhado.jpeg",
        descricao: book.description,
        ano: book.year || "",
        isbn: book.isbn || "",
        paginas: book.pages || "",
        preco: book.price !== null ? String(book.price) : "",
        dimensoes: book.dimensions || "",
        idioma: book.language || "Português",
        destaqueHome: book.isHomeFeature,
    };
}

// ================================
// BUSCAR TODOS OS LIVROS
// API REAL: GET /books
// ================================
export async function getLivros(): Promise<Livro[]> {
    const response = await fetch(`${API_URL}/books`, {
        method: "GET",
        cache: "no-store",
    });

    if (!response.ok) {
        throw new Error("Erro ao buscar livros.");
    }

    const data = (await response.json()) as BooksResponse;

    if (!data.success) {
        throw new Error("Erro ao carregar livros.");
    }

    return data.books.map(mapBackendBookToLivro);
}

// ================================
// BUSCAR LIVROS EM DESTAQUE DA HOME
// API REAL: GET /books/home-features
// ================================
export async function getLivrosDestaque(): Promise<Livro[]> {
    const response = await fetch(`${API_URL}/books/home-features`, {
        method: "GET",
        cache: "no-store",
    });

    if (!response.ok) {
        throw new Error("Erro ao buscar livros em destaque.");
    }

    const data = (await response.json()) as BooksResponse;

    if (!data.success) {
        throw new Error("Erro ao carregar destaques.");
    }

    return data.books.map(mapBackendBookToLivro);
}