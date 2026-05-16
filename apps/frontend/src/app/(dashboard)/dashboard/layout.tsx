"use client";

// ================================
// IMPORTS
// ================================
import Link from "next/link";
import { useState } from "react";
import WithAuth from "../../../components/auth/WithAuth";

// ================================
// LAYOUT DASHBOARD RESPONSIVO
// ================================
export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // ================================
    // ESTADO: MENU MOBILE
    // ================================
    const [open, setOpen] = useState(false);

    return (
        <div className="min-h-screen flex bg-gray-50 dark:bg-[#020617] transition-colors">
            {/* ================================
                SIDEBAR DESKTOP
                - Fixa na esquerda em telas grandes
                - Oculta em mobile (hidden)
            ================================ */}
            <aside className="hidden md:flex w-64 flex-col bg-white dark:bg-[#020617] border-r border-gray-200 dark:border-white/10 p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                    Admin
                </h2>
                <nav className="flex flex-col gap-4 text-gray-700 dark:text-gray-300">
                    <Link
                        href="/dashboard"
                        className="hover:text-[#D4AF37] transition"
                    >
                        Dashboard
                    </Link>
                    <Link
                        href="/dashboard/sobre"
                        className="hover:text-[#D4AF37] transition"
                    >
                        Sobre
                    </Link>
                    <Link
                        href="/dashboard/livros"
                        className="hover:text-[#D4AF37] transition"
                    >
                        Livros
                    </Link>
                    <Link
                        href="/dashboard/publicacoes"
                        className="hover:text-[#D4AF37] transition"
                    >
                        Publicações
                    </Link>
                    <Link
                        href="/dashboard/configuracoes"
                        className="hover:text-[#D4AF37] transition"
                    >
                        Configurações
                    </Link>
                </nav>
            </aside>

            {/* ================================
                CONTEÚDO PRINCIPAL
            ================================ */}
            <div className="flex-1 flex flex-col">
                {/* ================================
                    HEADER MOBILE
                    - Só aparece em telas pequenas
                ================================ */}
                <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-200 dark:border-white/10">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                        Admin
                    </h2>
                    <button
                        onClick={() => setOpen(true)}
                        className="p-2 rounded-lg border border-gray-300 dark:border-white/20 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition"
                        aria-label="Abrir menu de navegação"
                    >
                        ☰
                    </button>
                </div>

                {/* ================================
                    MENU MOBILE (OVERLAY)
                    - CORREÇÃO: Painel vem PRIMEIRO no flex para abrir da ESQUERDA
                ================================ */}
                {open && (
                    <div className="fixed inset-0 z-50 flex justify-start">
                        {/* PAINEL DO MENU - LADO ESQUERDO (vem primeiro no flex)
                            - w-64: largura fixa
                            - h-full: altura total
                            - border-r: borda à direita (combina com posição esquerda)
                        ================================ */}
                        <div className="relative w-64 h-full bg-white dark:bg-[#020617] shadow-2xl border-r border-gray-200 dark:border-white/10 flex flex-col z-10">
                            {/* CABEÇALHO - Fixo no topo */}
                            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-white/10 flex-shrink-0">
                                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Menu
                                </span>
                                <button
                                    onClick={() => setOpen(false)}
                                    className="p-2 rounded-lg text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition"
                                    aria-label="Fechar menu"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* LINKS - Scrollável se necessário */}
                            <nav className="flex-1 overflow-y-auto p-6 space-y-2">
                                <Link
                                    href="/dashboard"
                                    onClick={() => setOpen(false)}
                                    className="block py-3 px-4 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-[#D4AF37] transition"
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    href="/dashboard/sobre"
                                    onClick={() => setOpen(false)}
                                    className="block py-3 px-4 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-[#D4AF37] transition"
                                >
                                    Sobre
                                </Link>
                                <Link
                                    href="/dashboard/livros"
                                    onClick={() => setOpen(false)}
                                    className="block py-3 px-4 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-[#D4AF37] transition"
                                >
                                    Livros
                                </Link>
                                <Link
                                    href="/dashboard/publicacoes"
                                    onClick={() => setOpen(false)}
                                    className="block py-3 px-4 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-[#D4AF37] transition"
                                >
                                    Publicações
                                </Link>
                                <Link
                                    href="/dashboard/configuracoes"
                                    onClick={() => setOpen(false)}
                                    className="block py-3 px-4 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-[#D4AF37] transition"
                                >
                                    Configurações
                                </Link>
                            </nav>
                        </div>

                        {/* FUNDO ESCURO (vem DEPOIS do painel no flex)
                            - flex-1: ocupa o espaço restante à direita
                            - onClick: fecha ao clicar fora do painel
                        ================================ */}
                        <div
                            className="flex-1 bg-black/50"
                            onClick={() => setOpen(false)}
                            aria-hidden="true"
                        />
                    </div>
                )}

                {/* ================================
                    ÁREA DE CONTEÚDO (PROTEGIDA)
                ================================ */}
                <WithAuth>
                    <main className="p-4 md:p-8">{children}</main>
                </WithAuth>
            </div>
        </div>
    );
}
