"use client";

// ================================
// IMPORTS
// ================================
import {
    useCallback,
    useEffect,
    useState,
} from "react";

import {
    createCarouselSlide,
    deleteCarouselSlide,
    getAdminCarouselSlides,
    updateCarouselSlide,
    updateCarouselSlideStatus,
    uploadCarouselImage,
    type CarouselSlide,
} from "@/services/carousel.service";

// ================================
// ESTADO INICIAL DO FORMULÁRIO
// ================================
const INITIAL_ORDER = 0;

// ================================
// PÁGINA ADMINISTRATIVA
// ================================
export default function CarrosselDashboard() {
    // ================================
    // LISTAGEM
    // ================================
    const [slides, setSlides] = useState<
        CarouselSlide[]
    >([]);

    const [loading, setLoading] =
        useState(true);

    // ================================
    // MODAL
    // ================================
    const [
        isModalOpen,
        setIsModalOpen,
    ] = useState(false);

    const [
        editingSlide,
        setEditingSlide,
    ] = useState<CarouselSlide | null>(
        null,
    );

    // ================================
    // FORMULÁRIO
    // ================================
    const [title, setTitle] =
        useState("");

    const [
        displayText,
        setDisplayText,
    ] = useState("");

    const [altText, setAltText] =
        useState("");

    const [linkUrl, setLinkUrl] =
        useState("");

    const [order, setOrder] =
        useState(INITIAL_ORDER);

    const [isActive, setIsActive] =
        useState(true);

    // ================================
    // IMAGEM
    // ================================
    const [imageFile, setImageFile] =
        useState<File | null>(null);

    const [
        imagePreview,
        setImagePreview,
    ] = useState<string | null>(null);

    // ================================
    // ENVIO
    // ================================
    const [submitting, setSubmitting] =
        useState(false);

    const [
        actionLoadingId,
        setActionLoadingId,
    ] = useState<string | null>(null);

    // ================================
    // MENSAGEM
    // ================================
    const [message, setMessage] =
        useState<string | null>(null);

    const [errorMessage, setErrorMessage] =
        useState<string | null>(null);

    // ================================
    // CARREGAR SLIDES
    // ================================
    const loadSlides =
        useCallback(async () => {
            try {
                setLoading(true);
                setErrorMessage(null);

                const data =
                    await getAdminCarouselSlides();

                setSlides(data);
            } catch (error) {
                setErrorMessage(
                    error instanceof Error
                        ? error.message
                        : "Erro ao carregar os slides.",
                );
            } finally {
                setLoading(false);
            }
        }, []);

    // ================================
    // CARREGAMENTO INICIAL
    // ================================
    useEffect(() => {
        void loadSlides();
    }, [loadSlides]);

    // ================================
    // LIMPAR FORMULÁRIO
    // ================================
    const resetForm = () => {
        setEditingSlide(null);

        setTitle("");
        setDisplayText("");
        setAltText("");
        setLinkUrl("");

        setOrder(slides.length);
        setIsActive(true);

        setImageFile(null);
        setImagePreview(null);
    };

    // ================================
    // ABRIR NOVO SLIDE
    // ================================
    const handleNewSlide = () => {
        resetForm();

        setMessage(null);
        setErrorMessage(null);

        setIsModalOpen(true);
    };

    // ================================
    // ABRIR EDIÇÃO
    // ================================
    const handleEditSlide = (
        slide: CarouselSlide,
    ) => {
        setEditingSlide(slide);

        setTitle(slide.title);

        setDisplayText(
            slide.displayText ?? "",
        );

        setAltText(slide.altText);

        setLinkUrl(
            slide.linkUrl ?? "",
        );

        setOrder(slide.order);
        setIsActive(slide.isActive);

        setImageFile(null);

        setImagePreview(
            slide.imageUrl,
        );

        setMessage(null);
        setErrorMessage(null);

        setIsModalOpen(true);
    };

    // ================================
    // FECHAR MODAL
    // ================================
    const handleCloseModal = () => {
        if (submitting) {
            return;
        }

        setIsModalOpen(false);
        resetForm();
    };

    // ================================
    // SELECIONAR IMAGEM
    // ================================
    const handleImageChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const file =
            event.target.files?.[0];

        if (!file) {
            return;
        }

        setImageFile(file);

        const previewUrl =
            URL.createObjectURL(file);

        setImagePreview(previewUrl);
    };

    // ================================
    // SALVAR
    // ================================
    const handleSubmit = async (
        event: React.FormEvent,
    ) => {
        event.preventDefault();

        setMessage(null);
        setErrorMessage(null);

        // ============================
        // VALIDAR IMAGEM
        // ============================
        if (
            !editingSlide &&
            !imageFile
        ) {
            setErrorMessage(
                "Selecione uma imagem para o slide.",
            );

            return;
        }

        setSubmitting(true);

        try {
            // ========================
            // IMAGEM EXISTENTE
            // ========================
            let finalImageUrl =
                editingSlide?.imageUrl ??
                "";

            // ========================
            // NOVO UPLOAD
            // ========================
            if (imageFile) {
                finalImageUrl =
                    await uploadCarouselImage(
                        imageFile,
                    );
            }

            // ========================
            // PAYLOAD
            // ========================
            const payload = {
                title: title.trim(),
                displayText:
                    displayText.trim() ||
                    null,
                altText: altText.trim(),
                imageUrl:
                    finalImageUrl,
                linkUrl:
                    linkUrl.trim() ||
                    null,
                order,
                isActive,
            };

            // ========================
            // EDIÇÃO
            // ========================
            if (editingSlide) {
                await updateCarouselSlide(
                    editingSlide.id,
                    payload,
                );

                setMessage(
                    "Slide atualizado com sucesso.",
                );
            } else {
                // ====================
                // CRIAÇÃO
                // ====================
                await createCarouselSlide(
                    payload,
                );

                setMessage(
                    "Slide criado com sucesso.",
                );
            }

            setIsModalOpen(false);
            resetForm();

            await loadSlides();
        } catch (error) {
            setErrorMessage(
                error instanceof Error
                    ? error.message
                    : "Erro ao salvar o slide.",
            );
        } finally {
            setSubmitting(false);
        }
    };

    // ================================
    // ATIVAR / DESATIVAR
    // ================================
    const handleToggleStatus =
        async (
            slide: CarouselSlide,
        ) => {
            setActionLoadingId(slide.id);

            setMessage(null);
            setErrorMessage(null);

            try {
                await updateCarouselSlideStatus(
                    slide.id,
                    !slide.isActive,
                );

                setMessage(
                    slide.isActive
                        ? "Slide desativado com sucesso."
                        : "Slide ativado com sucesso.",
                );

                await loadSlides();
            } catch (error) {
                setErrorMessage(
                    error instanceof Error
                        ? error.message
                        : "Erro ao alterar o slide.",
                );
            } finally {
                setActionLoadingId(null);
            }
        };

    // ================================
    // EXCLUIR
    // ================================
    const handleDelete = async (
        slide: CarouselSlide,
    ) => {
        const confirmed =
            window.confirm(
                `Deseja excluir o slide "${slide.title}"?`,
            );

        if (!confirmed) {
            return;
        }

        setActionLoadingId(slide.id);

        setMessage(null);
        setErrorMessage(null);

        try {
            await deleteCarouselSlide(
                slide.id,
            );

            setMessage(
                "Slide excluído com sucesso.",
            );

            await loadSlides();
        } catch (error) {
            setErrorMessage(
                error instanceof Error
                    ? error.message
                    : "Erro ao excluir o slide.",
            );
        } finally {
            setActionLoadingId(null);
        }
    };

    return (
        <div className="mx-auto w-full max-w-7xl">
            {/* ================================
                CABEÇALHO
            ================================= */}

            <header className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#C95F52]">
                        Página inicial
                    </span>

                    <h1 className="mt-1 text-3xl font-bold text-[#18384A] dark:text-white">
                        Gerenciar Carrossel
                    </h1>

                    <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                        Adicione os banners exibidos
                        depois da apresentação
                        institucional da Guardiana.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={
                        handleNewSlide
                    }
                    className="rounded-xl bg-[#C95F52] px-6 py-3 font-bold text-white shadow-lg shadow-[#C95F52]/20 transition hover:bg-[#A84A3F]"
                >
                    + Novo Slide
                </button>
            </header>

            {/* ================================
                AVISO DO SLIDE FIXO
            ================================= */}

            <div className="mb-6 rounded-2xl border border-[#D4AF37]/30 bg-[#D4AF37]/10 p-5">
                <div className="flex gap-3">
                    <span className="text-xl">
                        🛡️
                    </span>

                    <div>
                        <h2 className="font-bold text-[#18384A] dark:text-white">
                            Apresentação da
                            Guardiana
                        </h2>

                        <p className="mt-1 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                            O primeiro slide com
                            logo, ilustração e
                            “Vozes que transformam o
                            mundo” é institucional e
                            permanece fixo. Os
                            slides cadastrados nesta
                            página aparecem depois
                            dele.
                        </p>
                    </div>
                </div>
            </div>

            {/* ================================
                MENSAGENS
            ================================= */}

            {message && (
                <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700 dark:border-green-500/20 dark:bg-green-500/10 dark:text-green-300">
                    {message}
                </div>
            )}

            {errorMessage && (
                <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
                    {errorMessage}
                </div>
            )}

            {/* ================================
                LISTAGEM
            ================================= */}

            {loading ? (
                <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center text-gray-500 dark:border-white/10 dark:bg-[#0F1720] dark:text-gray-400">
                    Carregando slides...
                </div>
            ) : slides.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center dark:border-white/20 dark:bg-[#0F1720]">
                    <div className="mb-3 text-4xl">
                        🖼️
                    </div>

                    <h2 className="text-lg font-bold text-[#18384A] dark:text-white">
                        Nenhum banner cadastrado
                    </h2>

                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        O carrossel continuará
                        mostrando apenas a
                        apresentação institucional
                        até um banner ser
                        adicionado.
                    </p>
                </div>
            ) : (
                <div className="grid gap-6 lg:grid-cols-2">
                    {slides.map(
                        (slide) => (
                            <article
                                key={
                                    slide.id
                                }
                                className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md dark:border-white/10 dark:bg-[#0F1720]"
                            >
                                {/* =================
                                    IMAGEM
                                ================= */}

                                <div className="flex h-56 items-center justify-center overflow-hidden bg-gray-100 p-4 dark:bg-white/5">
                                    <img
                                        src={
                                            slide.imageUrl
                                        }
                                        alt={
                                            slide.altText
                                        }
                                        className="max-h-full max-w-full object-contain"
                                    />
                                </div>

                                {/* =================
                                    CONTEÚDO
                                ================= */}

                                <div className="p-6">
                                    <div className="mb-4 flex items-start justify-between gap-4">
                                        <div>
                                            <h2 className="text-xl font-bold text-[#18384A] dark:text-white">
                                                {
                                                    slide.title
                                                }
                                            </h2>

                                            <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-gray-400">
                                                Ordem{" "}
                                                {
                                                    slide.order
                                                }
                                            </p>
                                        </div>

                                        <span
                                            className={`
                                                rounded-full
                                                px-3
                                                py-1
                                                text-xs
                                                font-bold
                                                ${
                                                    slide.isActive
                                                        ? "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-300"
                                                        : "bg-gray-100 text-gray-500 dark:bg-white/5 dark:text-gray-400"
                                                }
                                            `}
                                        >
                                            {slide.isActive
                                                ? "Ativo"
                                                : "Inativo"}
                                        </span>
                                    </div>

                                    {/* =================
                                        TEXTO VISUAL
                                    ================= */}

                                    <div className="mb-5 rounded-xl bg-gray-50 p-4 dark:bg-[#020617]">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                            Texto de
                                            destaque
                                        </span>

                                        <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                                            {slide.displayText ||
                                                "Nenhum texto configurado."}
                                        </p>
                                    </div>

                                    {/* =================
                                        LINK
                                    ================= */}

                                    {slide.linkUrl && (
                                        <p className="mb-5 truncate text-xs text-gray-400">
                                            {
                                                slide.linkUrl
                                            }
                                        </p>
                                    )}

                                    {/* =================
                                        AÇÕES
                                    ================= */}

                                    <div className="flex flex-wrap gap-2">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleEditSlide(
                                                    slide,
                                                )
                                            }
                                            className="flex-1 rounded-lg bg-gray-100 px-4 py-2 text-sm font-bold text-gray-700 transition hover:bg-gray-200 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                                        >
                                            Editar
                                        </button>

                                        <button
                                            type="button"
                                            disabled={
                                                actionLoadingId ===
                                                slide.id
                                            }
                                            onClick={() =>
                                                void handleToggleStatus(
                                                    slide,
                                                )
                                            }
                                            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-bold text-gray-600 transition hover:bg-gray-50 disabled:opacity-50 dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/5"
                                        >
                                            {slide.isActive
                                                ? "Desativar"
                                                : "Ativar"}
                                        </button>

                                        <button
                                            type="button"
                                            disabled={
                                                actionLoadingId ===
                                                slide.id
                                            }
                                            onClick={() =>
                                                void handleDelete(
                                                    slide,
                                                )
                                            }
                                            className="rounded-lg bg-red-50 px-4 py-2 text-sm font-bold text-red-600 transition hover:bg-red-100 disabled:opacity-50 dark:bg-red-500/10 dark:text-red-300"
                                        >
                                            🗑
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ),
                    )}
                </div>
            )}

            {/* ================================
                MODAL
            ================================= */}

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm md:p-6">
                    <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-[#0F1720] md:p-8">
                        {/* ========================
                            CABEÇALHO MODAL
                        ======================== */}

                        <div className="mb-7 flex items-start justify-between gap-4">
                            <div>
                                <h2 className="text-2xl font-bold text-[#18384A] dark:text-white">
                                    {editingSlide
                                        ? "Editar Slide"
                                        : "Novo Slide"}
                                </h2>

                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    Configure a arte
                                    e o conteúdo que
                                    será mostrado no
                                    carrossel.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={
                                    handleCloseModal
                                }
                                className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 dark:hover:bg-white/10"
                                aria-label="Fechar"
                            >
                                ✕
                            </button>
                        </div>

                        {/* ========================
                            FORMULÁRIO
                        ======================== */}

                        <form
                            onSubmit={
                                handleSubmit
                            }
                            className="space-y-6"
                        >
                            {/* ====================
                                IMAGEM
                            ==================== */}

                            <div>
                                <label className="mb-2 block text-sm font-bold text-gray-700 dark:text-gray-200">
                                    Imagem do banner
                                </label>

                                <label className="relative flex min-h-[240px] cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-4 transition hover:border-[#C95F52] dark:border-white/10 dark:bg-[#020617]">
                                    {imagePreview ? (
                                        <img
                                            src={
                                                imagePreview
                                            }
                                            alt="Pré-visualização"
                                            className="max-h-[300px] max-w-full object-contain"
                                        />
                                    ) : (
                                        <div className="text-center">
                                            <div className="mb-2 text-3xl">
                                                🖼️
                                            </div>

                                            <p className="font-bold text-gray-700 dark:text-gray-200">
                                                Selecionar
                                                imagem
                                            </p>

                                            <p className="mt-1 text-xs text-gray-400">
                                                Clique
                                                para
                                                escolher
                                                uma arte
                                            </p>
                                        </div>
                                    )}

                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={
                                            handleImageChange
                                        }
                                        className="absolute inset-0 cursor-pointer opacity-0"
                                    />
                                </label>
                            </div>

                            {/* ====================
                                TÍTULO INTERNO
                            ==================== */}

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">
                                    Título interno
                                </label>

                                <input
                                    required
                                    value={title}
                                    onChange={(event) =>
                                        setTitle(
                                            event.target
                                                .value,
                                        )
                                    }
                                    placeholder="Ex.: Maratona de Revezamento"
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition focus:border-[#C95F52] dark:border-white/10 dark:bg-[#020617] dark:text-white"
                                />

                                <p className="mt-1 text-xs text-gray-400">
                                    Usado para
                                    identificar o
                                    banner no painel.
                                </p>
                            </div>

                            {/* ====================
                                TEXTO DE DESTAQUE
                            ==================== */}

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">
                                    Texto de destaque
                                </label>

                                <textarea
                                    rows={3}
                                    value={
                                        displayText
                                    }
                                    onChange={(event) =>
                                        setDisplayText(
                                            event.target
                                                .value,
                                        )
                                    }
                                    placeholder="Ex.: Participe da Maratona de Revezamento de Passo Fundo."
                                    className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition focus:border-[#C95F52] dark:border-white/10 dark:bg-[#020617] dark:text-white"
                                />

                                <p className="mt-1 text-xs text-gray-400">
                                    Este é o texto que
                                    será exibido junto
                                    ao banner. Pode
                                    ficar vazio.
                                </p>
                            </div>

                            {/* ====================
                                TEXTO ALTERNATIVO
                            ==================== */}

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">
                                    Texto alternativo
                                    da imagem
                                </label>

                                <input
                                    required
                                    value={altText}
                                    onChange={(event) =>
                                        setAltText(
                                            event.target
                                                .value,
                                        )
                                    }
                                    placeholder="Ex.: Divulgação da Maratona de Revezamento"
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition focus:border-[#C95F52] dark:border-white/10 dark:bg-[#020617] dark:text-white"
                                />
                            </div>

                            {/* ====================
                                LINK
                            ==================== */}

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">
                                    Link
                                </label>

                                <input
                                    type="url"
                                    value={linkUrl}
                                    onChange={(event) =>
                                        setLinkUrl(
                                            event.target
                                                .value,
                                        )
                                    }
                                    placeholder="https://..."
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition focus:border-[#C95F52] dark:border-white/10 dark:bg-[#020617] dark:text-white"
                                />

                                <p className="mt-1 text-xs text-gray-400">
                                    Opcional. Se
                                    preenchido, o
                                    banner poderá
                                    abrir este
                                    endereço.
                                </p>
                            </div>

                            {/* ====================
                                ORDEM + STATUS
                            ==================== */}

                            <div className="grid gap-5 md:grid-cols-2">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">
                                        Ordem de
                                        exibição
                                    </label>

                                    <input
                                        type="number"
                                        min={0}
                                        step={1}
                                        value={order}
                                        onChange={(
                                            event,
                                        ) =>
                                            setOrder(
                                                Number(
                                                    event
                                                        .target
                                                        .value,
                                                ),
                                            )
                                        }
                                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition focus:border-[#C95F52] dark:border-white/10 dark:bg-[#020617] dark:text-white"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">
                                        Situação
                                    </label>

                                    <label className="flex h-[50px] cursor-pointer items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 dark:border-white/10 dark:bg-[#020617]">
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                            Slide
                                            ativo
                                        </span>

                                        <input
                                            type="checkbox"
                                            checked={
                                                isActive
                                            }
                                            onChange={(
                                                event,
                                            ) =>
                                                setIsActive(
                                                    event
                                                        .target
                                                        .checked,
                                                )
                                            }
                                            className="h-5 w-5 accent-[#C95F52]"
                                        />
                                    </label>
                                </div>
                            </div>

                            {/* ====================
                                BOTÕES
                            ==================== */}

                            <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 dark:border-white/10 sm:flex-row">
                                <button
                                    type="button"
                                    disabled={
                                        submitting
                                    }
                                    onClick={
                                        handleCloseModal
                                    }
                                    className="flex-1 rounded-xl py-3 font-bold text-gray-500 transition hover:bg-gray-100 disabled:opacity-50 dark:hover:bg-white/5"
                                >
                                    Cancelar
                                </button>

                                <button
                                    type="submit"
                                    disabled={
                                        submitting
                                    }
                                    className="flex-1 rounded-xl bg-[#C95F52] py-3 font-bold text-white transition hover:bg-[#A84A3F] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {submitting
                                        ? "Salvando..."
                                        : editingSlide
                                          ? "Salvar Alterações"
                                          : "Criar Slide"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}