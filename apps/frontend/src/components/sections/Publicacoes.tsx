"use client";

// ================================
// COMPONENTES
// ================================
import PublicacaoCard from "../ui/PublicacaoCard";

// ================================
// IMAGEM OTIMIZADA DO NEXT
// ================================
import Image from "next/image";

// ================================
// REACT
// ================================
import { useEffect, useState } from "react";

// ================================
// DADOS / SERVICES
// ================================
import { PublicacaoConfig } from "../../data/publicacaoConfig";
import { getConteudoConfig } from "../../services/publicacoes.services";

// ================================
// MOCK INICIAL DE CATEGORIAS
// Futuramente será substituído pelo backend
// ================================
const initialCategorias = [
    { id: 1, categoria: "Todas" },
    { id: 2, categoria: "Sociedade" },
    { id: 3, categoria: "Cultura" },
    { id: 4, categoria: "Saúde" },
    { id: 5, categoria: "Relacionamentos" },
];

// ================================
// MOCK INICIAL DE PUBLICAÇÕES
// Futuramente será substituído pelo backend
// ================================
const initialPublicacoes = [
    {
        id: 1,
        categoria: "Sociedade",
        titulo: "O poder das palavras na transformação social",
        descricao:
            "Como a escrita pode impactar comunidades e gerar mudanças reais no mundo.",
        autor: "Ana Silva",
        data: "2024-03-01",
    },
    {
        id: 2,
        categoria: "Cultura",
        titulo: "Literatura feminina e protagonismo",
        descricao:
            "A importância da voz feminina na construção de narrativas contemporâneas.",
        autor: "Mariana Costa",
        data: "2024-02-20",
    },
    {
        id: 3,
        categoria: "Saúde",
        titulo: "Escrever para curar",
        descricao:
            "A escrita como ferramenta terapêutica no desenvolvimento pessoal.",
        autor: "Juliana Rocha",
        data: "2024-02-10",
    },
    {
        id: 4,
        categoria: "Relacionamentos",
        titulo: "Narrativas que conectam pessoas",
        descricao:
            "Histórias reais que criam empatia e fortalecem relações humanas.",
        autor: "Fernanda Alves",
        data: "2024-01-28",
    },
    {
        id: 5,
        categoria: "Sociedade",
        titulo: "Narrativas que conectam pessoas",
        descricao:
            "Histórias reais que criam empatia e fortalecem relações humanas.",
        autor: "Alves Fernandes",
        data: "2024-01-28",
    },
];

// ================================
// Seção de Publicações
// ================================
export default function Publicacoes() {
    // ================================
    // Estado do filtro
    // ================================
    const [categoriaAtiva, setCategoriaAtiva] = useState("Todas");

    // ================================
    // Estado do conteúdo configurável
    // ================================
    const [conteudoConfig, setConteudoConfig] =
        useState<PublicacaoConfig | null>(null);

    // ================================
    // Estado das categorias
    // ================================
    const [categorias, setCategorias] = useState<typeof initialCategorias>([]);

    // ================================
    // Estado das publicações
    // ================================
    const [publicacao, setPublicacao] = useState<typeof initialPublicacoes>([]);

    // ================================
    // Separa destaque
    // ================================
    const destaque = publicacao.find((p) => p.id === 1);

    // ================================
    // Filtra publicações
    // ================================
    const filtradas =
        categoriaAtiva === "Todas"
            ? publicacao
            : publicacao.filter((p) => p.categoria === categoriaAtiva);

    // ================================
    // Remove destaque do grid
    // ================================
    const restantes = filtradas.filter((p) => p.id !== 1);

    // ================================
    // Carrega configuração da seção
    // ================================
    useEffect(() => {
        const data = getConteudoConfig();
        setConteudoConfig(data);

        const atualizar = () => {
            setConteudoConfig(getConteudoConfig());
        };

        window.addEventListener("conteudoAtualizado", atualizar);

        return () => {
            window.removeEventListener("conteudoAtualizado", atualizar);
        };
    }, []);

    // ================================
    // Carrega categorias do localStorage
    // Caso ainda não exista, usa o mock inicial
    // ================================
    useEffect(() => {
        const data = localStorage.getItem("categorias");

        if (data) {
            setCategorias(JSON.parse(data));
        } else {
            setCategorias(initialCategorias);
        }
    }, []);

    // ================================
    // Carrega publicações do localStorage
    // Caso ainda não exista, usa o mock inicial
    // ================================
    useEffect(() => {
        const data = localStorage.getItem("publicacoes");

        if (data) {
            setPublicacao(JSON.parse(data));
        } else {
            setPublicacao(initialPublicacoes);
        }
    }, []);

    // ================================
    // Evita erro de hidratação
    // ================================
    if (!conteudoConfig) return null;

    return (
        <section
            id="publicacoes"
            className="relative w-full overflow-hidden bg-[#F7F7F7] dark:bg-[#020617] transition-colors scroll-mt-24"
        >
            {/* ================================
                FAIXA VERMELHA INCLINADA
            ================================ */}
            <div
                className="
                    absolute left-0 right-0 top-16
                    h-[520px] md:h-[560px]
                    bg-[#C95F52] dark:bg-[#7E342D]
                    [clip-path:polygon(0_18%,100%_0,100%_100%,0_82%)]
                "
            />

            {/* ================================
                DECORAÇÃO - FOLHA ESQUERDA
            ================================ */}
            <div className="absolute left-0 md:left-6 top-6 w-32 h-32 md:w-52 md:h-52 opacity-95">
                <Image
                    src="/decor-folha.png"
                    alt="Folha decorativa"
                    fill
                    className="object-contain"
                />
            </div>

            {/* ================================
                DECORAÇÃO - LÂMPADA DIREITA
            ================================ */}
            <div className="absolute right-0 top-[330px] md:top-[350px] w-36 h-36 md:w-64 md:h-64 opacity-95 pointer-events-none">
                <Image
                    src="/decor-lampada.png"
                    alt="Lâmpada decorativa"
                    fill
                    className="object-contain"
                />
            </div>

            {/* ================================
                CONTEÚDO PRINCIPAL
            ================================ */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-28">
                {/* ================================
                    CABEÇALHO
                ================================ */}
                <div className="mb-12 text-center">
                    <span className="text-2xl text-[#18384A] dark:text-white">
                        Conteúdo
                    </span>

                    <h2 className="mt-3 text-3xl md:text-4xl font-extrabold text-white leading-tight">
                        {conteudoConfig.titulo}
                    </h2>

                    <p className="mt-5 text-white text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
                        {conteudoConfig.subtitulo}
                    </p>
                </div>

                {/* ================================
                    FILTRO DE CATEGORIA
                    - Botões no estilo da referência
                    - Mantém hover/animação
                ================================ */}
                <div className="flex flex-wrap justify-center gap-5 md:gap-8 mb-14">
                    {categorias.map((cat) => {
                        const ativo = categoriaAtiva === cat.categoria;

                        const classeBase =
                            "min-w-[150px] px-6 py-3 rounded-full text-sm font-bold transition-all duration-300";

                        const classeAtivo =
                            "bg-[#C8A92F] text-white shadow-lg scale-105";

                        const classeInativo =
                            "bg-[#C8A92F] text-white hover:scale-105 hover:brightness-110 shadow-md";

                        return (
                            <button
                                key={cat.id}
                                onClick={() => setCategoriaAtiva(cat.categoria)}
                                className={`${classeBase} ${
                                    ativo ? classeAtivo : classeInativo
                                }`}
                            >
                                {cat.categoria}
                            </button>
                        );
                    })}
                </div>

                {/* ================================
                    CARD DESTAQUE
                ================================ */}
                {categoriaAtiva === "Todas" && destaque && (
                    <div className="mb-14 flex justify-center">
                        <div
                            className="
                                group
                                w-full max-w-3xl
                                rounded-xl
                                bg-white dark:bg-[#0F1720]
                                border border-gray-200 dark:border-white/10
                                p-8 md:p-10
                                shadow-xl
                                hover:-translate-y-2
                                hover:shadow-2xl
                                transition-all duration-500
                            "
                        >
                            <span className="text-lg text-[#18384A] dark:text-gray-300">
                                {destaque.categoria}
                            </span>

                            <h3 className="mt-6 text-2xl md:text-3xl font-extrabold text-[#C95F52] dark:text-[#D4AF37] leading-tight group-hover:opacity-90 transition">
                                {destaque.titulo}
                            </h3>

                            <p className="mt-5 text-[#344454] dark:text-gray-300 text-lg md:text-xl leading-relaxed max-w-2xl">
                                {destaque.descricao}
                            </p>

                            <div className="mt-10 text-sm md:text-base text-[#344454] dark:text-gray-400">
                                {destaque.autor} • {destaque.data}
                            </div>
                        </div>
                    </div>
                )}

                {/* ================================
                    GRID DE CARDS
                ================================ */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                    {restantes.map((item, index) => (
                        <div
                            key={item.id}
                            style={{ animationDelay: `${index * 0.1}s` }}
                            className="
                                opacity-0
                                animate-fadeIn
                                transition-all duration-500
                                hover:-translate-y-2
                            "
                        >
                            <PublicacaoCard publicacao={item} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
