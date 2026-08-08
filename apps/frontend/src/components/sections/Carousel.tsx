"use client";

// ================================
// IMPORTS
// ================================
import Image from "next/image";
import {
    AnimatePresence,
    motion,
} from "framer-motion";
import {
    useCallback,
    useEffect,
    useState,
} from "react";

import {
    getCarouselSlides,
    type CarouselSlide,
} from "@/services/carousel.service";

import { getConteudo } from "@/services/conteudo.service";

// ================================
// CONFIGURAÇÃO DA API
// ================================
const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "http://127.0.0.1:3333";

// ================================
// TEMPO ENTRE OS SLIDES
// ================================
const INTERVALO_AUTOMATICO = 6000;

// ================================
// IDENTIFICADOR DO SLIDE FIXO
// ================================
const SLIDE_INSTITUCIONAL_ID =
    "guardiana-institucional";

// ================================
// MONTAR URL COMPLETA DA IMAGEM
// ================================
function montarUrlImagem(
    imageUrl: string,
): string {
    // ============================
    // ARQUIVO LOCAL DO FRONTEND
    // ============================
    if (imageUrl.startsWith("/")) {
        return imageUrl;
    }

    // ============================
    // URL COMPLETA
    // ============================
    if (
        imageUrl.startsWith("http://") ||
        imageUrl.startsWith("https://") ||
        imageUrl.startsWith("data:")
    ) {
        return imageUrl;
    }

    // ============================
    // ARQUIVO DO BACKEND
    // ============================
    return `${API_URL}/${imageUrl}`;
}

// ================================
// ÍCONE DE SETA
// ================================
type ArrowIconProps = Readonly<{
    direction: "left" | "right";
}>;

function ArrowIcon({
    direction,
}: ArrowIconProps) {
    return (
        <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            {direction === "left" ? (
                <path d="M15 18l-6-6 6-6" />
            ) : (
                <path d="M9 6l6 6-6 6" />
            )}
        </svg>
    );
}

// ================================
// CARROSSEL DA PÁGINA INICIAL
// ================================
export default function Carousel() {
    // ================================
    // BANNERS GERENCIADOS PELO ADMIN
    // ================================
    const [
        slidesAdministrativos,
        setSlidesAdministrativos,
    ] = useState<CarouselSlide[]>([]);

    // ================================
    // ÍNDICE ATUAL
    //
    // 0 = Guardiana institucional
    // 1+ = banners do Admin
    // ================================
    const [indiceAtual, setIndiceAtual] =
        useState(0);

    // ================================
    // CONTEÚDO INSTITUCIONAL
    // ================================
    const [conteudo, setConteudo] =
        useState(getConteudo());

    // ================================
    // TOTAL DE SLIDES
    // ================================
    const totalSlides =
        1 +
        slidesAdministrativos.length;

    // ================================
    // ATUALIZAR CONTEÚDO DO ADMIN
    // ================================
    useEffect(() => {
        const atualizar = () => {
            setConteudo(getConteudo());
        };

        window.addEventListener(
            "conteudoAtualizado",
            atualizar,
        );

        return () => {
            window.removeEventListener(
                "conteudoAtualizado",
                atualizar,
            );
        };
    }, []);

    // ================================
    // CARREGAR BANNERS DO ADMIN
    // ================================
    useEffect(() => {
        let componenteAtivo = true;

        async function carregarSlides() {
            try {
                const slidesRecebidos =
                    await getCarouselSlides();

                if (!componenteAtivo) {
                    return;
                }

                const slidesAtivos =
                    slidesRecebidos
                        .filter(
                            (slide) =>
                                slide.isActive,
                        )
                        .sort(
                            (
                                slideA,
                                slideB,
                            ) =>
                                slideA.order -
                                slideB.order,
                        );

                setSlidesAdministrativos(
                    slidesAtivos,
                );

                // ========================
                // SEMPRE COMEÇA NA
                // GUARDIANA
                // ========================
                setIndiceAtual(0);
            } catch (error) {
                console.error(
                    "Erro ao carregar os banners do carrossel:",
                    error,
                );

                if (componenteAtivo) {
                    setSlidesAdministrativos(
                        [],
                    );
                    setIndiceAtual(0);
                }
            }
        }

        void carregarSlides();

        return () => {
            componenteAtivo = false;
        };
    }, []);

    // ================================
    // AVANÇAR
    // ================================
    const avancarSlide =
        useCallback(() => {
            setIndiceAtual(
                (indiceAnterior) =>
                    indiceAnterior ===
                    totalSlides - 1
                        ? 0
                        : indiceAnterior + 1,
            );
        }, [totalSlides]);

    // ================================
    // VOLTAR
    // ================================
    const voltarSlide =
        useCallback(() => {
            setIndiceAtual(
                (indiceAnterior) =>
                    indiceAnterior === 0
                        ? totalSlides - 1
                        : indiceAnterior - 1,
            );
        }, [totalSlides]);

    // ================================
    // TROCA AUTOMÁTICA
    // ================================
    useEffect(() => {
        if (totalSlides <= 1) {
            return;
        }

        const intervalo =
            window.setInterval(
                avancarSlide,
                INTERVALO_AUTOMATICO,
            );

        return () => {
            window.clearInterval(
                intervalo,
            );
        };
    }, [
        avancarSlide,
        totalSlides,
    ]);

    // ================================
    // SLIDE ADMINISTRATIVO ATUAL
    // ================================
    const slideAdministrativoAtual =
        indiceAtual > 0
            ? slidesAdministrativos[
                  indiceAtual - 1
              ]
            : null;

    // ================================
    // TEXTO VISUAL DO ADMIN
    // ================================
    const textoAdministrativoAtual =
        slideAdministrativoAtual
            ?.displayText?.trim() ?? "";

    return (
        <section
            aria-label="Destaques da Guardiana"
            className="
                flex
                min-h-[calc(100svh-64px)]
                w-full
                items-center
                bg-[#F7F7F7]
                px-3
                py-3
                transition-colors
                dark:bg-[#020617]
                sm:px-4
                md:px-6
                md:py-4
                lg:px-8
            "
        >
            {/* ================================
                MOLDURA DO CARROSSEL
            ================================= */}

            <div
                className="
                    relative
                    mx-auto
                    h-[calc(100svh-88px)]
                    min-h-[540px]
                    max-h-[680px]
                    w-full
                    max-w-7xl
                    overflow-hidden
                    rounded-xl
                    bg-white
                    shadow-md
                    dark:bg-[#0F1720]

                    md:h-[calc(100vh-96px)]
                    md:min-h-[500px]
                    md:max-h-[620px]

                    lg:min-h-[430px]
                    lg:max-h-[540px]
                "
            >
                {/* ================================
                    CONTEÚDO DOS SLIDES
                ================================= */}

                <AnimatePresence
                    mode="wait"
                    initial={false}
                >
                    {/* ============================
                        SLIDE INSTITUCIONAL
                    ============================ */}

                    {indiceAtual === 0 && (
                        <motion.div
                            key={
                                SLIDE_INSTITUCIONAL_ID
                            }
                            initial={{
                                opacity: 0,
                            }}
                            animate={{
                                opacity: 1,
                            }}
                            exit={{
                                opacity: 0,
                            }}
                            transition={{
                                duration: 0.45,
                            }}
                            className="
                                absolute
                                inset-0
                            "
                        >
                            {/* ====================
                                MOBILE
                            ==================== */}

                            <div
                                className="
                                    flex
                                    h-full
                                    w-full
                                    flex-col
                                    items-center
                                    justify-center
                                    px-5
                                    pb-14
                                    pt-5
                                    sm:px-8
                                    md:hidden
                                "
                            >
                                {/* =================
                                    LOGO
                                ================= */}

                                <motion.div
                                    initial={{
                                        opacity: 0,
                                        y: -15,
                                    }}
                                    animate={{
                                        opacity: 1,
                                        y: 0,
                                    }}
                                    transition={{
                                        duration: 0.6,
                                    }}
                                    className="
                                        relative
                                        h-[145px]
                                        w-[200px]
                                        shrink-0
                                    "
                                >
                                    <Image
                                        src="/logo-grande.png"
                                        alt="Guardiana Editora"
                                        fill
                                        priority
                                        sizes="200px"
                                        className="object-contain"
                                    />
                                </motion.div>

                                {/* =================
                                    ILUSTRAÇÃO
                                ================= */}

                                <motion.div
                                    initial={{
                                        opacity: 0,
                                        y: 15,
                                    }}
                                    animate={{
                                        opacity: 1,
                                        y: 0,
                                    }}
                                    transition={{
                                        duration: 0.7,
                                    }}
                                    className="
                                        relative
                                        -mt-1
                                        h-[255px]
                                        w-full
                                        max-w-[340px]
                                        shrink-0
                                    "
                                >
                                    <Image
                                        src="/hero-guardiana.png"
                                        alt="Ilustração Guardiana"
                                        fill
                                        priority
                                        sizes="340px"
                                        className="object-contain"
                                    />
                                </motion.div>

                                {/* =================
                                    TÍTULO
                                ================= */}

                                <motion.h1
                                    initial={{
                                        opacity: 0,
                                        y: 15,
                                    }}
                                    animate={{
                                        opacity: 1,
                                        y: 0,
                                    }}
                                    transition={{
                                        duration: 0.6,
                                        delay: 0.1,
                                    }}
                                    className="
                                        -mt-1
                                        max-w-[290px]
                                        text-center
                                        text-[27px]
                                        font-extrabold
                                        leading-[1.12]
                                        text-[#C95F52]
                                        dark:text-[#D4AF37]
                                    "
                                >
                                    {
                                        conteudo
                                            .hero
                                            .titulo
                                    }
                                </motion.h1>
                            </div>

                            {/* ====================
                                TABLET
                            ==================== */}

                            <div
                                className="
                                    hidden
                                    h-full
                                    w-full
                                    flex-col
                                    items-center
                                    justify-center
                                    gap-2
                                    px-8
                                    pb-14
                                    pt-5
                                    md:flex
                                    lg:hidden
                                "
                            >
                                <div
                                    className="
                                        relative
                                        h-[150px]
                                        w-[220px]
                                        shrink-0
                                    "
                                >
                                    <Image
                                        src="/logo-grande.png"
                                        alt="Guardiana Editora"
                                        fill
                                        priority
                                        sizes="220px"
                                        className="object-contain"
                                    />
                                </div>

                                <div
                                    className="
                                        relative
                                        h-[280px]
                                        w-full
                                        max-w-[470px]
                                        shrink-0
                                    "
                                >
                                    <Image
                                        src="/hero-guardiana.png"
                                        alt="Ilustração Guardiana"
                                        fill
                                        priority
                                        sizes="470px"
                                        className="object-contain"
                                    />
                                </div>

                                <h1
                                    className="
                                        max-w-[420px]
                                        text-center
                                        text-3xl
                                        font-extrabold
                                        leading-tight
                                        text-[#C95F52]
                                        dark:text-[#D4AF37]
                                    "
                                >
                                    {
                                        conteudo
                                            .hero
                                            .titulo
                                    }
                                </h1>
                            </div>

                            {/* ====================
                                DESKTOP
                            ==================== */}

                            <div
                                className="
                                    hidden
                                    h-full
                                    w-full
                                    grid-cols-[270px_minmax(0,1fr)_350px]
                                    items-center
                                    gap-5
                                    px-16
                                    py-5
                                    lg:grid
                                "
                            >
                                <motion.div
                                    initial={{
                                        opacity: 0,
                                        x: -25,
                                    }}
                                    animate={{
                                        opacity: 1,
                                        x: 0,
                                    }}
                                    transition={{
                                        duration: 0.6,
                                    }}
                                    className="
                                        relative
                                        h-[250px]
                                        w-full
                                    "
                                >
                                    <Image
                                        src="/logo-grande.png"
                                        alt="Guardiana Editora"
                                        fill
                                        priority
                                        sizes="270px"
                                        className="object-contain"
                                    />
                                </motion.div>

                                <motion.div
                                    initial={{
                                        opacity: 0,
                                        y: 20,
                                    }}
                                    animate={{
                                        opacity: 1,
                                        y: 0,
                                    }}
                                    transition={{
                                        duration: 0.7,
                                    }}
                                    className="
                                        relative
                                        h-full
                                        min-h-0
                                        w-full
                                    "
                                >
                                    <Image
                                        src="/hero-guardiana.png"
                                        alt="Ilustração Guardiana"
                                        fill
                                        priority
                                        sizes="(max-width: 1400px) 520px, 620px"
                                        className="object-contain"
                                    />
                                </motion.div>

                                <motion.div
                                    initial={{
                                        opacity: 0,
                                        x: 25,
                                    }}
                                    animate={{
                                        opacity: 1,
                                        x: 0,
                                    }}
                                    transition={{
                                        duration: 0.6,
                                        delay: 0.1,
                                    }}
                                    className="
                                        flex
                                        items-center
                                    "
                                >
                                    <h1
                                        className="
                                            text-[42px]
                                            font-extrabold
                                            leading-[1.08]
                                            text-[#C95F52]
                                            dark:text-[#D4AF37]
                                            xl:text-[48px]
                                        "
                                    >
                                        {
                                            conteudo
                                                .hero
                                                .titulo
                                        }
                                    </h1>
                                </motion.div>
                            </div>
                        </motion.div>
                    )}

                    {/* ============================
                        SLIDES DO ADMIN
                    ============================ */}

                    {indiceAtual > 0 &&
                        slideAdministrativoAtual && (
                            <motion.div
                                key={
                                    slideAdministrativoAtual.id
                                }
                                initial={{
                                    opacity: 0,
                                }}
                                animate={{
                                    opacity: 1,
                                }}
                                exit={{
                                    opacity: 0,
                                }}
                                transition={{
                                    duration: 0.45,
                                }}
                                className="
                                    absolute
                                    inset-0
                                    overflow-hidden
                                "
                            >
                                {/* ====================
                                    FUNDO SUAVE
                                ==================== */}

                                <img
                                    src={montarUrlImagem(
                                        slideAdministrativoAtual.imageUrl,
                                    )}
                                    alt=""
                                    aria-hidden="true"
                                    className="
                                        absolute
                                        inset-0
                                        h-full
                                        w-full
                                        scale-110
                                        object-cover
                                        opacity-[0.08]
                                        blur-3xl
                                        dark:opacity-[0.06]
                                    "
                                />

                                <div
                                    className="
                                        absolute
                                        inset-0
                                        bg-white/78
                                        dark:bg-[#0F1720]/88
                                    "
                                />

                                {/* ====================
                                    MOBILE
                                ==================== */}

                                <div
                                    className="
                                        relative
                                        z-10
                                        flex
                                        h-full
                                        w-full
                                        flex-col
                                        items-center
                                        justify-center
                                        px-5
                                        pb-14
                                        pt-5
                                        md:hidden
                                    "
                                >
                                    {/* =================
                                        LOGO
                                    ================= */}

                                    <div
                                        className="
                                            relative
                                            h-[105px]
                                            w-[155px]
                                            shrink-0
                                        "
                                    >
                                        <Image
                                            src="/logo-grande.png"
                                            alt="Guardiana Editora"
                                            fill
                                            sizes="155px"
                                            className="object-contain"
                                        />
                                    </div>

                                    {/* =================
                                        BANNER
                                    ================= */}

                                    {slideAdministrativoAtual.linkUrl ? (
                                        <a
                                            href={
                                                slideAdministrativoAtual.linkUrl
                                            }
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label={`Abrir ${slideAdministrativoAtual.title} em uma nova aba`}
                                            className="
                                                flex
                                                h-[255px]
                                                w-full
                                                max-w-[340px]
                                                shrink-0
                                                items-center
                                                justify-center
                                            "
                                        >
                                            <img
                                                src={montarUrlImagem(
                                                    slideAdministrativoAtual.imageUrl,
                                                )}
                                                alt={
                                                    slideAdministrativoAtual.altText ||
                                                    slideAdministrativoAtual.title
                                                }
                                                className="
                                                    block
                                                    max-h-full
                                                    max-w-full
                                                    object-contain
                                                    object-center
                                                "
                                            />
                                        </a>
                                    ) : (
                                        <div
                                            className="
                                                flex
                                                h-[255px]
                                                w-full
                                                max-w-[340px]
                                                shrink-0
                                                items-center
                                                justify-center
                                            "
                                        >
                                            <img
                                                src={montarUrlImagem(
                                                    slideAdministrativoAtual.imageUrl,
                                                )}
                                                alt={
                                                    slideAdministrativoAtual.altText ||
                                                    slideAdministrativoAtual.title
                                                }
                                                className="
                                                    block
                                                    max-h-full
                                                    max-w-full
                                                    object-contain
                                                    object-center
                                                "
                                            />
                                        </div>
                                    )}

                                    {/* =================
                                        TEXTO DO ADMIN
                                    ================= */}

                                    {textoAdministrativoAtual && (
                                        <motion.p
                                            initial={{
                                                opacity: 0,
                                                y: 12,
                                            }}
                                            animate={{
                                                opacity: 1,
                                                y: 0,
                                            }}
                                            transition={{
                                                duration: 0.5,
                                                delay: 0.1,
                                            }}
                                            className="
                                                mt-4
                                                max-w-[300px]
                                                text-center
                                                text-[20px]
                                                font-extrabold
                                                leading-[1.2]
                                                text-[#C95F52]
                                                dark:text-[#D4AF37]
                                            "
                                        >
                                            {
                                                textoAdministrativoAtual
                                            }
                                        </motion.p>
                                    )}
                                </div>

                                {/* ====================
                                    TABLET
                                ==================== */}

                                <div
                                    className="
                                        relative
                                        z-10
                                        hidden
                                        h-full
                                        w-full
                                        flex-col
                                        items-center
                                        justify-center
                                        px-8
                                        pb-14
                                        pt-5
                                        md:flex
                                        lg:hidden
                                    "
                                >
                                    <div
                                        className="
                                            relative
                                            h-[115px]
                                            w-[175px]
                                            shrink-0
                                        "
                                    >
                                        <Image
                                            src="/logo-grande.png"
                                            alt="Guardiana Editora"
                                            fill
                                            sizes="175px"
                                            className="object-contain"
                                        />
                                    </div>

                                    {slideAdministrativoAtual.linkUrl ? (
                                        <a
                                            href={
                                                slideAdministrativoAtual.linkUrl
                                            }
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label={`Abrir ${slideAdministrativoAtual.title} em uma nova aba`}
                                            className="
                                                flex
                                                h-[300px]
                                                w-full
                                                max-w-[600px]
                                                items-center
                                                justify-center
                                            "
                                        >
                                            <img
                                                src={montarUrlImagem(
                                                    slideAdministrativoAtual.imageUrl,
                                                )}
                                                alt={
                                                    slideAdministrativoAtual.altText ||
                                                    slideAdministrativoAtual.title
                                                }
                                                className="
                                                    max-h-full
                                                    max-w-full
                                                    object-contain
                                                "
                                            />
                                        </a>
                                    ) : (
                                        <div
                                            className="
                                                flex
                                                h-[300px]
                                                w-full
                                                max-w-[600px]
                                                items-center
                                                justify-center
                                            "
                                        >
                                            <img
                                                src={montarUrlImagem(
                                                    slideAdministrativoAtual.imageUrl,
                                                )}
                                                alt={
                                                    slideAdministrativoAtual.altText ||
                                                    slideAdministrativoAtual.title
                                                }
                                                className="
                                                    max-h-full
                                                    max-w-full
                                                    object-contain
                                                "
                                            />
                                        </div>
                                    )}

                                    {textoAdministrativoAtual && (
                                        <p
                                            className="
                                                mt-4
                                                max-w-[520px]
                                                text-center
                                                text-2xl
                                                font-extrabold
                                                leading-tight
                                                text-[#C95F52]
                                                dark:text-[#D4AF37]
                                            "
                                        >
                                            {
                                                textoAdministrativoAtual
                                            }
                                        </p>
                                    )}
                                </div>

                                {/* ====================
                                    DESKTOP
                                ==================== */}

                                <div
                                    className="
                                        relative
                                        z-10
                                        hidden
                                        h-full
                                        w-full
                                        items-center
                                        gap-5
                                        px-16
                                        py-5
                                        lg:grid
                                        lg:grid-cols-[250px_minmax(0,1fr)_350px]
                                    "
                                >
                                    {/* =================
                                        LOGO
                                    ================= */}

                                    <motion.div
                                        initial={{
                                            opacity: 0,
                                            x: -20,
                                        }}
                                        animate={{
                                            opacity: 1,
                                            x: 0,
                                        }}
                                        transition={{
                                            duration: 0.55,
                                        }}
                                        className="
                                            relative
                                            h-[220px]
                                            w-full
                                        "
                                    >
                                        <Image
                                            src="/logo-grande.png"
                                            alt="Guardiana Editora"
                                            fill
                                            sizes="250px"
                                            className="object-contain"
                                        />
                                    </motion.div>

                                    {/* =================
                                        BANNER
                                    ================= */}

                                    <motion.div
                                        initial={{
                                            opacity: 0,
                                            y: 18,
                                        }}
                                        animate={{
                                            opacity: 1,
                                            y: 0,
                                        }}
                                        transition={{
                                            duration: 0.6,
                                        }}
                                        className="
                                            flex
                                            h-full
                                            min-h-0
                                            w-full
                                            items-center
                                            justify-center
                                        "
                                    >
                                        {slideAdministrativoAtual.linkUrl ? (
                                            <a
                                                href={
                                                    slideAdministrativoAtual.linkUrl
                                                }
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                aria-label={`Abrir ${slideAdministrativoAtual.title} em uma nova aba`}
                                                className="
                                                    flex
                                                    h-full
                                                    w-full
                                                    items-center
                                                    justify-center
                                                "
                                            >
                                                <img
                                                    src={montarUrlImagem(
                                                        slideAdministrativoAtual.imageUrl,
                                                    )}
                                                    alt={
                                                        slideAdministrativoAtual.altText ||
                                                        slideAdministrativoAtual.title
                                                    }
                                                    className="
                                                        max-h-full
                                                        max-w-full
                                                        object-contain
                                                    "
                                                />
                                            </a>
                                        ) : (
                                            <img
                                                src={montarUrlImagem(
                                                    slideAdministrativoAtual.imageUrl,
                                                )}
                                                alt={
                                                    slideAdministrativoAtual.altText ||
                                                    slideAdministrativoAtual.title
                                                }
                                                className="
                                                    max-h-full
                                                    max-w-full
                                                    object-contain
                                                "
                                            />
                                        )}
                                    </motion.div>

                                    {/* =================
                                        TEXTO
                                    ================= */}

                                    <motion.div
                                        initial={{
                                            opacity: 0,
                                            x: 20,
                                        }}
                                        animate={{
                                            opacity: 1,
                                            x: 0,
                                        }}
                                        transition={{
                                            duration: 0.55,
                                            delay: 0.08,
                                        }}
                                        className="
                                            flex
                                            items-center
                                        "
                                    >
                                        {textoAdministrativoAtual ? (
                                            <p
                                                className="
                                                    text-[30px]
                                                    font-extrabold
                                                    leading-[1.14]
                                                    text-[#C95F52]
                                                    dark:text-[#D4AF37]
                                                    xl:text-[34px]
                                                "
                                            >
                                                {
                                                    textoAdministrativoAtual
                                                }
                                            </p>
                                        ) : (
                                            <div />
                                        )}
                                    </motion.div>
                                </div>
                            </motion.div>
                        )}
                </AnimatePresence>

                {/* ================================
                    NAVEGAÇÃO
                ================================= */}

                {totalSlides > 1 && (
                    <>
                        {/* ========================
                            ANTERIOR
                        ======================== */}

                        <button
                            type="button"
                            onClick={
                                voltarSlide
                            }
                            aria-label="Mostrar slide anterior"
                            className="
                                absolute
                                left-2
                                top-1/2
                                z-30
                                flex
                                h-10
                                w-10
                                -translate-y-1/2
                                items-center
                                justify-center
                                rounded-full
                                bg-black/50
                                p-0
                                text-white
                                transition
                                hover:bg-black/70
                                focus:outline-none
                                focus:ring-2
                                focus:ring-[#D4AF37]

                                sm:left-3
                                md:left-4
                                md:h-11
                                md:w-11
                            "
                        >
                            <ArrowIcon direction="left" />
                        </button>

                        {/* ========================
                            PRÓXIMO
                        ======================== */}

                        <button
                            type="button"
                            onClick={
                                avancarSlide
                            }
                            aria-label="Mostrar próximo slide"
                            className="
                                absolute
                                right-2
                                top-1/2
                                z-30
                                flex
                                h-10
                                w-10
                                -translate-y-1/2
                                items-center
                                justify-center
                                rounded-full
                                bg-black/50
                                p-0
                                text-white
                                transition
                                hover:bg-black/70
                                focus:outline-none
                                focus:ring-2
                                focus:ring-[#D4AF37]

                                sm:right-3
                                md:right-4
                                md:h-11
                                md:w-11
                            "
                        >
                            <ArrowIcon direction="right" />
                        </button>

                        {/* ========================
                            INDICADORES
                        ======================== */}

                        <div
                            className="
                                absolute
                                bottom-3
                                left-1/2
                                z-30
                                flex
                                -translate-x-1/2
                                items-center
                                gap-2
                                rounded-full
                                bg-black/40
                                px-3
                                py-2

                                md:bottom-4
                            "
                        >
                            {/* INSTITUCIONAL */}

                            <button
                                type="button"
                                onClick={() =>
                                    setIndiceAtual(0)
                                }
                                aria-label="Mostrar apresentação da Guardiana"
                                aria-current={
                                    indiceAtual === 0
                                        ? "true"
                                        : undefined
                                }
                                className={`
                                    h-2.5
                                    rounded-full
                                    transition-all
                                    ${
                                        indiceAtual === 0
                                            ? "w-7 bg-[#D4AF37]"
                                            : "w-2.5 bg-white/80 hover:bg-white"
                                    }
                                `}
                            />

                            {/* BANNERS DO ADMIN */}

                            {slidesAdministrativos.map(
                                (
                                    slide,
                                    indice,
                                ) => {
                                    const indiceReal =
                                        indice + 1;

                                    return (
                                        <button
                                            key={
                                                slide.id
                                            }
                                            type="button"
                                            onClick={() =>
                                                setIndiceAtual(
                                                    indiceReal,
                                                )
                                            }
                                            aria-label={`Mostrar slide ${indiceReal + 1}: ${slide.title}`}
                                            aria-current={
                                                indiceAtual ===
                                                indiceReal
                                                    ? "true"
                                                    : undefined
                                            }
                                            className={`
                                                h-2.5
                                                rounded-full
                                                transition-all
                                                ${
                                                    indiceAtual ===
                                                    indiceReal
                                                        ? "w-7 bg-[#D4AF37]"
                                                        : "w-2.5 bg-white/80 hover:bg-white"
                                                }
                                            `}
                                        />
                                    );
                                },
                            )}
                        </div>
                    </>
                )}
            </div>
        </section>
    );
}