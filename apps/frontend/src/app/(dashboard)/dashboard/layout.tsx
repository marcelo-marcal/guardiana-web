"use client";

// ================================
// IMPORTS
// ================================
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import WithAuth from "../../../components/auth/WithAuth";
import { useAuth } from "@/hooks/useAuth";

// ================================
// LAYOUT DASHBOARD RESPONSIVO
// ================================
export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // ================================
    // USUÁRIO E MENU MOBILE
    // ================================
    const { user } = useAuth();
    const [open, setOpen] = useState(false);
    const pathname = usePathname();

    // ================================
    // PERFIL ADMINISTRATIVO
    // ================================
    const isAdmin =
        user?.role === "ADMIN" ||
        user?.role === "SUPER_ADMIN";

    const dashboardTitle = isAdmin
        ? "Admin"
        : "Escritor";

    // ================================
    // LINK ATIVO
    // ================================
    const isActive = (path: string) => {
        if (
            path === "/dashboard" &&
            pathname !== "/dashboard"
        ) {
            return false;
        }

        return pathname?.startsWith(path);
    };

    // ================================
    // ESTILO DOS LINKS
    // ================================
    const getLinkClass = (path: string) => {
        return `
            px-4
            py-2
            rounded-xl
            transition
            font-medium
            flex
            items-center
            gap-3
            ${
                isActive(path)
                    ? "bg-[#C95F52] text-white shadow-lg shadow-[#C95F52]/20"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-[#C95F52]"
            }
        `;
    };

    const showSidebar = true;

    return (
        <div className="flex min-h-screen bg-gray-50 transition-colors dark:bg-[#020617]">
            {/* ================================
                SIDEBAR DESKTOP
            ================================= */}

            {showSidebar && (
                <aside className="hidden w-64 flex-col border-r border-gray-200 bg-white p-6 dark:border-white/10 dark:bg-[#0F1720] md:flex">
                    {/* ========================
                        CABEÇALHO
                    ======================== */}

                    <div className="mb-10 px-4">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C95F52]">
                            Painel
                        </span>

                        <h2 className="text-2xl font-black text-[#18384A] dark:text-white">
                            {dashboardTitle}
                        </h2>
                    </div>

                    {/* ========================
                        NAVEGAÇÃO
                    ======================== */}

                    <nav className="flex flex-col gap-2">
                        <Link
                            href="/dashboard/perfil"
                            className={getLinkClass(
                                "/dashboard/perfil",
                            )}
                        >
                            <span>👤</span>
                            Perfil
                        </Link>

                        <Link
                            href="/dashboard"
                            className={getLinkClass(
                                "/dashboard",
                            )}
                        >
                            <span>📝</span>

                            {isAdmin
                                ? "Dashboard"
                                : "Meus Poemas"}
                        </Link>

                        {/* ====================
                            GESTÃO
                        ==================== */}

                        {isAdmin && (
                            <>
                                <div className="my-4 border-t border-gray-100 dark:border-white/5" />

                                <span className="mb-2 px-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                    Gestão
                                </span>

                                <Link
                                    href="/dashboard/sobre"
                                    className={getLinkClass(
                                        "/dashboard/sobre",
                                    )}
                                >
                                    <span>📄</span>
                                    Sobre
                                </Link>

                                <Link
                                    href="/dashboard/carrossel"
                                    className={getLinkClass(
                                        "/dashboard/carrossel",
                                    )}
                                >
                                    <span>🖼️</span>
                                    Carrossel
                                </Link>

                                <Link
                                    href="/dashboard/livros"
                                    className={getLinkClass(
                                        "/dashboard/livros",
                                    )}
                                >
                                    <span>📚</span>
                                    Livros
                                </Link>

                                <Link
                                    href="/dashboard/publicacoes"
                                    className={getLinkClass(
                                        "/dashboard/publicacoes",
                                    )}
                                >
                                    <span>📰</span>
                                    Publicações
                                </Link>

                                <Link
                                    href="/dashboard/usuarios"
                                    className={getLinkClass(
                                        "/dashboard/usuarios",
                                    )}
                                >
                                    <span>👥</span>
                                    Usuários
                                </Link>

                                <Link
                                    href="/dashboard/conselho"
                                    className={getLinkClass(
                                        "/dashboard/conselho",
                                    )}
                                >
                                    <span>⚖️</span>
                                    Conselho
                                </Link>

                                <Link
                                    href="/dashboard/assessorias"
                                    className={getLinkClass(
                                        "/dashboard/assessorias",
                                    )}
                                >
                                    <span>🤝</span>
                                    Assessorias
                                </Link>
                            </>
                        )}

                        {/* ====================
                            CONFIGURAÇÕES
                        ==================== */}

                        {isAdmin && (
                            <>
                                <div className="my-4 border-t border-gray-100 dark:border-white/5" />

                                <Link
                                    href="/dashboard/configuracoes"
                                    className={getLinkClass(
                                        "/dashboard/configuracoes",
                                    )}
                                >
                                    <span>⚙️</span>
                                    Configurações
                                </Link>
                            </>
                        )}
                    </nav>
                </aside>
            )}

            {/* ================================
                CONTEÚDO PRINCIPAL
            ================================= */}

            <div className="flex flex-1 flex-col">
                {/* ================================
                    HEADER MOBILE
                ================================= */}

                {showSidebar && (
                    <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-white/10 md:hidden">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                            {dashboardTitle}
                        </h2>

                        <button
                            type="button"
                            onClick={() =>
                                setOpen(true)
                            }
                            className="rounded-lg border border-gray-300 p-2 text-gray-900 transition hover:bg-gray-100 dark:border-white/20 dark:text-white dark:hover:bg-white/10"
                            aria-label="Abrir menu de navegação"
                        >
                            ☰
                        </button>
                    </div>
                )}

                {/* ================================
                    MENU MOBILE
                ================================= */}

                {open && showSidebar && (
                    <div className="fixed inset-0 z-50 flex justify-start">
                        <div className="relative z-10 flex h-full w-64 flex-col border-r border-gray-200 bg-white shadow-2xl dark:border-white/10 dark:bg-[#020617]">
                            {/* ====================
                                CABEÇALHO MOBILE
                            ==================== */}

                            <div className="flex flex-shrink-0 items-center justify-between border-b border-gray-200 p-6 dark:border-white/10">
                                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Menu
                                </span>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setOpen(false)
                                    }
                                    className="rounded-lg p-2 text-gray-900 transition hover:bg-gray-100 dark:text-white dark:hover:bg-white/10"
                                    aria-label="Fechar menu"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* ====================
                                LINKS MOBILE
                            ==================== */}

                            <nav className="flex-1 space-y-2 overflow-y-auto p-6">
                                <Link
                                    href="/dashboard/perfil"
                                    onClick={() =>
                                        setOpen(false)
                                    }
                                    className="block rounded-lg px-4 py-3 text-gray-700 transition hover:bg-gray-100 hover:text-[#D4AF37] dark:text-gray-300 dark:hover:bg-white/10"
                                >
                                    Perfil
                                </Link>

                                <Link
                                    href="/dashboard"
                                    onClick={() =>
                                        setOpen(false)
                                    }
                                    className="block rounded-lg px-4 py-3 text-gray-700 transition hover:bg-gray-100 hover:text-[#D4AF37] dark:text-gray-300 dark:hover:bg-white/10"
                                >
                                    {isAdmin
                                        ? "Dashboard"
                                        : "Meus Poemas"}
                                </Link>

                                {isAdmin && (
                                    <>
                                        <Link
                                            href="/dashboard/sobre"
                                            onClick={() =>
                                                setOpen(
                                                    false,
                                                )
                                            }
                                            className="block rounded-lg px-4 py-3 text-gray-700 transition hover:bg-gray-100 hover:text-[#D4AF37] dark:text-gray-300 dark:hover:bg-white/10"
                                        >
                                            Sobre
                                        </Link>

                                        <Link
                                            href="/dashboard/carrossel"
                                            onClick={() =>
                                                setOpen(
                                                    false,
                                                )
                                            }
                                            className="block rounded-lg px-4 py-3 text-gray-700 transition hover:bg-gray-100 hover:text-[#D4AF37] dark:text-gray-300 dark:hover:bg-white/10"
                                        >
                                            Carrossel
                                        </Link>

                                        <Link
                                            href="/dashboard/livros"
                                            onClick={() =>
                                                setOpen(
                                                    false,
                                                )
                                            }
                                            className="block rounded-lg px-4 py-3 text-gray-700 transition hover:bg-gray-100 hover:text-[#D4AF37] dark:text-gray-300 dark:hover:bg-white/10"
                                        >
                                            Livros
                                        </Link>

                                        <Link
                                            href="/dashboard/publicacoes"
                                            onClick={() =>
                                                setOpen(
                                                    false,
                                                )
                                            }
                                            className="block rounded-lg px-4 py-3 text-gray-700 transition hover:bg-gray-100 hover:text-[#D4AF37] dark:text-gray-300 dark:hover:bg-white/10"
                                        >
                                            Publicações
                                        </Link>

                                        <Link
                                            href="/dashboard/usuarios"
                                            onClick={() =>
                                                setOpen(
                                                    false,
                                                )
                                            }
                                            className="block rounded-lg px-4 py-3 text-gray-700 transition hover:bg-gray-100 hover:text-[#D4AF37] dark:text-gray-300 dark:hover:bg-white/10"
                                        >
                                            Usuários
                                        </Link>

                                        <Link
                                            href="/dashboard/conselho"
                                            onClick={() =>
                                                setOpen(
                                                    false,
                                                )
                                            }
                                            className="block rounded-lg px-4 py-3 text-gray-700 transition hover:bg-gray-100 hover:text-[#D4AF37] dark:text-gray-300 dark:hover:bg-white/10"
                                        >
                                            Conselho
                                        </Link>

                                        <Link
                                            href="/dashboard/assessorias"
                                            onClick={() =>
                                                setOpen(
                                                    false,
                                                )
                                            }
                                            className="block rounded-lg px-4 py-3 text-gray-700 transition hover:bg-gray-100 hover:text-[#D4AF37] dark:text-gray-300 dark:hover:bg-white/10"
                                        >
                                            Assessorias
                                        </Link>

                                        <Link
                                            href="/dashboard/configuracoes"
                                            onClick={() =>
                                                setOpen(
                                                    false,
                                                )
                                            }
                                            className="block rounded-lg px-4 py-3 text-gray-700 transition hover:bg-gray-100 hover:text-[#D4AF37] dark:text-gray-300 dark:hover:bg-white/10"
                                        >
                                            Configurações
                                        </Link>
                                    </>
                                )}
                            </nav>
                        </div>

                        {/* ========================
                            FUNDO DO OVERLAY
                        ======================== */}

                        <button
                            type="button"
                            className="flex-1 bg-black/50"
                            onClick={() =>
                                setOpen(false)
                            }
                            aria-label="Fechar menu"
                        />
                    </div>
                )}

                {/* ================================
                    ÁREA PROTEGIDA
                ================================= */}

                <WithAuth>
                    <main className="p-4 md:p-8">
                        {children}
                    </main>
                </WithAuth>
            </div>
        </div>
    );
}