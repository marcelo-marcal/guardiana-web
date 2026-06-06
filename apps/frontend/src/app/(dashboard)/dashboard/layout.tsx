"use client";

// ================================
// IMPORTS
// ================================
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import WithAuth from "../../../components/auth/WithAuth";
import { usePathname } from "next/navigation";

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
    const { user } = useAuth();
    const [open, setOpen] = useState(false);
    const pathname = usePathname();

    const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";
    const dashboardTitle = isAdmin ? "Admin" : "Meu Perfil";
    const isProfilePage = pathname === "/dashboard/perfil";

    const showSidebar = !isProfilePage || isAdmin;

    return (
        <div className="min-h-screen flex bg-gray-50 dark:bg-[#020617] transition-colors">
            {/* ================================
                SIDEBAR DESKTOP
            ================================ */}
            {showSidebar && (
                <aside className="hidden md:flex w-64 flex-col bg-white dark:bg-[#020617] border-r border-gray-200 dark:border-white/10 p-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                        {dashboardTitle}
                    </h2>
                    <nav className="flex flex-col gap-4 text-gray-700 dark:text-gray-300">
                        {isAdmin && (
                            <Link
                                href="/dashboard/perfil"
                                className="hover:text-[#D4AF37] transition"
                            >
                                Perfil
                            </Link>
                        )}
                        <Link
                            href="/dashboard"
                            className="hover:text-[#D4AF37] transition"
                        >
                            {isAdmin ? "Dashboard" : "Meus Poemas"}
                        </Link>
                        
                        {isAdmin && (
                            <>
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
                            </>
                        )}
                        
                        {isAdmin && (
                            <Link
                                href="/dashboard/configuracoes"
                                className="hover:text-[#D4AF37] transition"
                            >
                                Configurações
                            </Link>
                        )}
                    </nav>
                </aside>
            )}

            {/* ================================
                CONTEÚDO PRINCIPAL
            ================================ */}
            <div className="flex-1 flex flex-col">
                {/* ================================
                    HEADER MOBILE
                ================================ */}
                {showSidebar && (
                    <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-200 dark:border-white/10">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                            {dashboardTitle}
                        </h2>
                        <button
                            onClick={() => setOpen(true)}
                            className="p-2 rounded-lg border border-gray-300 dark:border-white/20 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition"
                            aria-label="Abrir menu de navegação"
                        >
                            ☰
                        </button>
                    </div>
                )}

                {/* ================================
                    MENU MOBILE (OVERLAY)
                ================================ */}
                {open && showSidebar && (
                    <div className="fixed inset-0 z-50 flex justify-start">
                        <div className="relative w-64 h-full bg-white dark:bg-[#020617] shadow-2xl border-r border-gray-200 dark:border-white/10 flex flex-col z-10">
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

                            <nav className="flex-1 overflow-y-auto p-6 space-y-2">
                                <Link
                                    href="/dashboard"
                                    onClick={() => setOpen(false)}
                                    className="block py-3 px-4 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-[#D4AF37] transition"
                                >
                                    {isAdmin ? "Dashboard" : "Meus Poemas"}
                                </Link>
                                
                                {isAdmin && (
                                    <>
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
                                    </>
                                )}

                                {isAdmin && (
                                    <Link
                                        href="/dashboard/configuracoes"
                                        onClick={() => setOpen(false)}
                                        className="block py-3 px-4 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-[#D4AF37] transition"
                                    >
                                        Configurações
                                    </Link>
                                )}
                            </nav>
                        </div>

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