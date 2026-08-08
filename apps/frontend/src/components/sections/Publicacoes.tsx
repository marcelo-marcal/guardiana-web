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
import { useEffect, useMemo, useState } from "react";

// ================================
// SERVICES DA API
// Agora as publicações vêm do PostgreSQL,
// não mais do localStorage.
// ================================
import {
    getCategoriasPublicacoes,
    getConteudoConfig,
    getPublicacoes,
    type CategoriaPublicacao,
    type Publicacao,
    type PublicacaoConfig,
} from "../../services/publicacoes.services";

// ================================
// TIPO ADAPTADO PARA O CARD ANTIGO
// O componente PublicacaoCard ainda espera:
// id, titulo, descricao, autor, data, categoria.
// Então convertemos a resposta da API para esse formato.
// ================================
type PublicacaoCardData = {
    id: number;
    titulo: string;
    descricao: string;
    autor: string;
    data: string;
    categoria: string;
    destaque?: boolean;
};

// ================================
// HELPERS
// ================================
function formatarData(data: string) {
    return new Date(data).toLocaleDateString("pt-BR");
}

function converterPublicacaoParaCard(
    publicacao: Publicacao,
    index: number,
): PublicacaoCardData {
    return {
        id: index + 1,
        titulo: publicacao.title,
        descricao: publicacao.description,
        autor: publicacao.author,
        data: formatarData(publicacao.date),
        categoria: publicacao.category.name,
        destaque: index === 0,
    };
}

// ================================
// SEÇÃO DE PUBLICAÇÕES DA HOME
// ================================
export default function Publicacoes() {
    // ================================
    // ESTADO DO FILTRO
    // ================================
    const [categoriaAtiva, setCategoriaAtiva] = useState("Todas");

    // ================================
    // ESTADO DO CONTEÚDO CONFIGURÁVEL
    // ================================
    const [conteudoConfig, setConteudoConfig] =
        useState<PublicacaoConfig | null>(null);

    // ================================
    // ESTADO DAS CATEGORIAS VINDAS DO BANCO
    // ================================
    const [categorias, setCategorias] = useState<CategoriaPublicacao[]>([]);

    // ================================
    // ESTADO DAS PUBLICAÇÕES VINDAS DO BANCO
    // ================================
    const [publicacoes, setPublicacoes] = useState<Publicacao[]>([]);

    // ================================
    // ESTADO DE CARREGAMENTO
    // ================================
    const [loading, setLoading] = useState(true);

    // ================================
    // ESTADO DE ERRO
    // ================================
    const [erro, setErro] = useState("");

    // ================================
    // CONVERTE PUBLICAÇÕES DA API PARA O FORMATO DO CARD
    // ================================
    const publicacoesParaTela = useMemo(
        () => publicacoes.map(converterPublicacaoParaCard),
        [publicacoes],
    );

    // ================================
    // SEPARA DESTAQUE
    // A primeira publicação retornada pelo backend vira destaque.
    // ================================
    const destaque = publicacoesParaTela[0];

    // ================================
    // FILTRA PUBLICAÇÕES
    // ================================
    const filtradas =
        categoriaAtiva === "Todas"
            ? publicacoesParaTela
            : publicacoesParaTela.filter(
                  (publicacao) => publicacao.categoria === categoriaAtiva,
              );

    // ================================
    // REMOVE DESTAQUE DO GRID
    // Somente quando estiver na aba "Todas".
    // Quando o usuário clica em uma categoria,
    // a publicação deve aparecer normalmente.
    // ================================
    const restantes =
       categoriaAtiva === "Todas"
          ? filtradas.filter((publicacao) => publicacao.id !== destaque?.id)
          : filtradas;

    // ================================
    // CARREGAR DADOS DA API
    // ================================
    const carregarPublicacoes = async () => {
        try {
            setLoading(true);
            setErro("");

            const [conteudo, categoriasData, publicacoesData] =
                await Promise.all([
                    getConteudoConfig(),
                    getCategoriasPublicacoes(),
                    getPublicacoes(),
                ]);

            setConteudoConfig(conteudo);
            setCategorias(categoriasData);
            setPublicacoes(publicacoesData);
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Erro ao carregar publicações.";

            setErro(message);
        } finally {
            setLoading(false);
        }
    };

    // ================================
    // CARREGA DADOS AO ABRIR A HOME
    // ================================
    useEffect(() => {
        void carregarPublicacoes();

        const atualizar = () => {
            void carregarPublicacoes();
        };

        window.addEventListener("conteudoAtualizado", atualizar);
        window.addEventListener("publicacoesAtualizadas", atualizar);

        return () => {
            window.removeEventListener("conteudoAtualizado", atualizar);
            window.removeEventListener("publicacoesAtualizadas", atualizar);
        };
    }, []);

    // ================================
    // EVITA ERRO DE HIDRATAÇÃO
    // ================================
    if (loading || !conteudoConfig) return null;

    // ================================
    // SE DER ERRO OU NÃO TIVER PUBLICAÇÕES,
    // NÃO QUEBRA A HOME
    // ================================
    if (erro || publicacoesParaTela.length === 0) return null;

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
            <div className="absolute right-0 top-[330px] md:top-[350px] w-36 h-36 md:w-64 md:h-64 opacity-65 pointer-events-none">
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
                ================================ */}
                <div className="flex flex-wrap justify-center gap-5 md:gap-8 mb-14">
                    <button
                        type="button"
                        onClick={() => setCategoriaAtiva("Todas")}
                        className={`min-w-[150px] px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 ${
                            categoriaAtiva === "Todas"
                                ? "bg-[#C8A92F] text-white shadow-lg scale-105"
                                : "bg-[#C8A92F] text-white hover:scale-105 hover:brightness-110 shadow-md"
                        }`}
                    >
                        Todas
                    </button>

                    {categorias.map((categoria) => {
                        const ativo = categoriaAtiva === categoria.name;

                        return (
                            <button
                                key={categoria.id}
                                type="button"
                                onClick={() =>
                                    setCategoriaAtiva(categoria.name)
                                }
                                className={`min-w-[150px] px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 ${
                                    ativo
                                        ? "bg-[#C8A92F] text-white shadow-lg scale-105"
                                        : "bg-[#C8A92F] text-white hover:scale-105 hover:brightness-110 shadow-md"
                                }`}
                            >
                                {categoria.name}
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