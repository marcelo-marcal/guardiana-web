// ================================
// Tipo (estrutura) de uma publicação
// Isso define como cada publicação deve ser
// ================================
export type Publicacao = {
    id: number; // Identificador único (simula ID do banco)
    titulo: string; // Título da publicação
    descricao: string; // Pequeno resumo
    autor: string; // Nome do autor(a)
    data: string; // Data de publicação (formato simples por enquanto)
    categoria: string; // Categoria (ex: Cultura, Saúde, etc)
    destaque?: boolean; // Opcional → se é destaque na tela
};

// ================================
// Lista de publicações (mock)
// Isso simula um banco de dados por enquanto
// ================================
export const publicacoes: Publicacao[] = [
    {
        id: 1,
        titulo: "O poder das palavras na transformação social",
        descricao:
            "Como a escrita pode impactar comunidades e gerar mudanças reais no mundo.",
        autor: "Ana Silva",
        data: "2024-03-01",
        categoria: "Sociedade",
        destaque: true, // 🔥 essa pode virar destaque depois
    },
    {
        id: 2,
        titulo: "Literatura feminina e protagonismo",
        descricao:
            "A importância da voz feminina na construção de narrativas contemporâneas.",
        autor: "Mariana Costa",
        data: "2024-02-20",
        categoria: "Cultura",
    },
    {
        id: 3,
        titulo: "Escrever para curar",
        descricao:
            "A escrita como ferramenta terapêutica no desenvolvimento pessoal.",
        autor: "Juliana Rocha",
        data: "2024-02-10",
        categoria: "Saúde",
    },
    {
        id: 4,
        titulo: "Narrativas que conectam pessoas",
        descricao:
            "Histórias reais que criam empatia e fortalecem relações humanas.",
        autor: "Fernanda Alves",
        data: "2024-01-28",
        categoria: "Relacionamentos",
    },
    {
        id: 5,
        titulo: "Narrativas que conectam pessoas",
        descricao:
            "Histórias reais que criam empatia e fortalecem relações humanas.",
        autor: "Alves Fernandes",
        data: "2024-01-28",
        categoria: "Sociedade",
    },
];