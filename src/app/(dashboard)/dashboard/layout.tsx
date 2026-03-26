"use client";

// ================================
// IMPORTS
// ================================
import Link from "next/link";
import { useState } from "react";

// ================================
// LAYOUT DASHBOARD RESPONSIVO
// ================================
export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [open, setOpen] = useState(false);

    return (
        <div className="min-h-screen flex bg-gray-50 dark:bg-[#020617] transition-colors">
            {/* ================================
                SIDEBAR DESKTOP
            ================================ */}
            <aside className="hidden md:flex w-64 flex-col bg-white dark:bg-[#020617] border-r border-gray-200 dark:border-white/10 p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                    Admin
                </h2>

                <nav className="flex flex-col gap-4 text-gray-700 dark:text-gray-300">
                    <Link href="/dashboard">Dashboard</Link>
                    <Link href="/dashboard/sobre">Sobre</Link>
                    <Link href="/dashboard/livros">Livros</Link>
                    <Link href="/dashboard/publicacoes">Publicações</Link>
                    <Link href="/dashboard/configuracoes">Configurações</Link>
                </nav>
            </aside>

            {/* ================================
                CONTEÚDO
            ================================ */}
            <div className="flex-1 flex flex-col">
                {/* HEADER MOBILE */}
                <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-200 dark:border-white/10">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                        Admin
                    </h2>

                    <button
                        onClick={() => setOpen(true)}
                        className="p-2 rounded-lg border border-gray-300 dark:border-white/20 text-gray-900 dark:text-white"
                    >
                        ☰
                    </button>
                </div>

                {/* MENU MOBILE */}
                {open && (
                    <div className="fixed inset-0 z-50 flex">
                        <div
                            className="flex-1 bg-black/40"
                            onClick={() => setOpen(false)}
                        />

                        <div className="w-64 h-full bg-white dark:bg-[#020617] p-6 shadow-xl">
                            <button
                                onClick={() => setOpen(false)}
                                className="mb-6 text-gray-900 dark:text-white"
                            >
                                ✕
                            </button>

                            <nav className="flex flex-col gap-4 text-gray-700 dark:text-gray-300">
                                <Link
                                    href="/dashboard"
                                    onClick={() => setOpen(false)}
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    href="/dashboard/sobre"
                                    onClick={() => setOpen(false)}
                                >
                                    Sobre
                                </Link>
                                <Link
                                    href="/dashboard/livros"
                                    onClick={() => setOpen(false)}
                                >
                                    Livros
                                </Link>
                                <Link
                                    href="/dashboard/publicacoes"
                                    onClick={() => setOpen(false)}
                                >
                                    Publicações
                                </Link>
                                <Link
                                    href="/dashboard/configuracoes"
                                    onClick={() => setOpen(false)}
                                >
                                    Configurações
                                </Link>
                            </nav>
                        </div>
                    </div>
                )}

                <main className="p-4 md:p-8">{children}</main>
            </div>
        </div>
    );
}
