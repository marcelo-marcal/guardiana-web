"use client";

// ================================
// IMPORTS
// ================================
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

// ================================
// COMPONENTE HEADER
// ================================
export default function Header() {
    // ================================
    // HOOKS
    // ================================
    const { user, logout } = useAuth();
    const router = useRouter();

    // ================================
    // ESTADO: TEMA (Light/Dark)
    // ================================
    const [darkMode, setDarkMode] = useState(false);

    // ================================
    // ESTADO: MENU MOBILE
    // ================================
    const [menuOpen, setMenuOpen] = useState(false);

    // ================================
    // INICIALIZAÇÃO DO TEMA
    // ================================
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        const systemDark = window.matchMedia(
            "(prefers-color-scheme: dark)",
        ).matches;
        const isDark = savedTheme ? savedTheme === "dark" : systemDark;

        if (isDark) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }

        setDarkMode(isDark);
    }, []);

    // ================================
    // ALTERNAR TEMA
    // ================================
    const toggleTheme = () => {
        const newMode = !darkMode;

        document.documentElement.classList.toggle("dark", newMode);
        localStorage.setItem("theme", newMode ? "dark" : "light");
        setDarkMode(newMode);
    };

    // ================================
    // FUNÇÃO: LOGOUT
    // ================================
    const handleLogout = () => {
        logout();
        localStorage.removeItem("redirectTo");
        router.replace("/login");
        setMenuOpen(false);
    };

    return (
        <>
            {/* ================================
                HEADER PRINCIPAL (FIXO)
            ================================ */}
            <header className="w-full h-16 fixed top-0 z-40 border-b border-gray-200 dark:border-white/10 bg-white/70 dark:bg-[#0F1720]/70 backdrop-blur">
                <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-6">
                    {/* LOGO + NOME */}
                    <div className="flex items-center gap-2 text-gray-900 dark:text-white">
                        <div className="relative w-14 h-14">
                            <Image
                                src="/logo.svg"
                                alt="Logo Guardiana"
                                fill
                                className="object-contain dark:brightness-0 dark:invert"
                            />
                        </div>

                        <span className="text-base font-semibold leading-none">
                            Guardiana
                        </span>
                    </div>

                    {/* MENU DESKTOP */}
                    <nav className="hidden md:flex gap-6 text-lg text-gray-800 dark:text-white items-center">
                        <Link
                            href="/"
                            className="hover:text-[#D4AF37] transition"
                        >
                            Início
                        </Link>

                        <Link
                            href="/guardiana"
                            className="hover:text-[#D4AF37] transition"
                        >
                            Guardiana
                        </Link>

                        <Link
                            href="/servicos-editoriais"
                            className="hover:text-[#D4AF37] transition"
                        >
                            Serviços Editoriais
                        </Link>

                        <Link
                            href="/livros"
                            className="hover:text-[#D4AF37] transition"
                        >
                            Livros
                        </Link>

                        <Link
                            href="/fundadoras"
                            className="hover:text-[#D4AF37] transition"
                        >
                            Fundadoras
                        </Link>

                        <Link
                            href="/contato"
                            className="hover:text-[#D4AF37] transition"
                        >
                            Contato
                        </Link>

                        {/* Painel Admin - Verde, só se logado */}
                        {user && (
                            <Link
                                href="/dashboard"
                                className="text-[#16B83E] dark:text-[#16B83E] font-semibold hover:text-[#0d9632] dark:hover:text-[#0d9632] transition flex items-center gap-1"
                                title="Acessar Painel Administrativo"
                            >
                                <span>🔧</span>
                                <span>Painel Admin</span>
                            </Link>
                        )}
                    </nav>

                    {/* AÇÕES (Tema + Menu Mobile + Auth) */}
                    <div className="flex items-center gap-2">
                        {/* Botão Tema */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg border border-gray-300 dark:border-white/20 hover:bg-gray-100 dark:hover:bg-white/10 transition"
                            aria-label={
                                darkMode
                                    ? "Ativar modo claro"
                                    : "Ativar modo escuro"
                            }
                        >
                            {darkMode ? (
                                <svg
                                    className="w-5 h-5 text-gray-800 dark:text-white"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeWidth={2}
                                        d="M21 12.79A9 9 0 0111.21 3a7 7 0 008.79 9.79z"
                                    />
                                </svg>
                            ) : (
                                <svg
                                    className="w-5 h-5 text-gray-800 dark:text-white"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <circle
                                        cx="12"
                                        cy="12"
                                        r="5"
                                        strokeWidth="2"
                                    />
                                </svg>
                            )}
                        </button>

                        {/* Botão Menu Mobile - Hamburguer */}
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="md:hidden p-2 rounded-lg border border-gray-300 dark:border-white/20 hover:bg-gray-100 dark:hover:bg-white/10 transition"
                            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
                            aria-expanded={menuOpen}
                        >
                            <svg
                                className="w-5 h-5 text-gray-800 dark:text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                {menuOpen ? (
                                    <path
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                ) : (
                                    <path
                                        strokeWidth={2}
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                )}
                            </svg>
                        </button>

                        {/* Botão Auth - Desktop */}
                        {user ? (
                            <button
                                onClick={handleLogout}
                                className="hidden md:block border border-red-300 dark:border-red-900/50 text-red-600 dark:text-red-400 px-4 py-2 rounded-xl text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition min-w-[80px]"
                                aria-label="Sair da conta"
                            >
                                Sair
                            </button>
                        ) : (
                            <Link
                                href="/login"
                                className="hidden md:block bg-[#D4AF37] text-black px-4 py-2 rounded-xl text-sm font-medium hover:opacity-90 transition min-w-[80px] text-center"
                            >
                                Entrar
                            </Link>
                        )}
                    </div>
                </div>
            </header>

            {/* ================================
                MENU MOBILE - COMPORTAMENTO CONDICIONAL
                - NÃO LOGADO: Dropdown centralizado (top-down)
                - LOGADO (admin): Sidebar lateral esquerda
            ================================ */}
            {menuOpen && (
                <>
                    {/* ================================
                        CASO 1: NÃO LOGADO → DROPDOWN CENTRALIZADO
                    ================================ */}
                    {!user && (
                        <div className="md:hidden fixed top-16 left-0 right-0 z-50 bg-white dark:bg-[#020617] border-b border-gray-200 dark:border-white/10 shadow-lg animate-fade-in">
                            <nav className="flex flex-col items-center py-4 space-y-2 px-6">
                                <Link
                                    href="/"
                                    onClick={() => setMenuOpen(false)}
                                    className="w-full py-3 text-center text-gray-800 dark:text-white hover:text-[#D4AF37] transition border-b border-gray-100 dark:border-white/5 last:border-0"
                                >
                                    Início
                                </Link>

                                <Link
                                    href="/guardiana"
                                    onClick={() => setMenuOpen(false)}
                                    className="w-full py-3 text-center text-gray-800 dark:text-white hover:text-[#D4AF37] transition border-b border-gray-100 dark:border-white/5 last:border-0"
                                >
                                    Guardiana
                                </Link>

                                <Link
                                    href="/servicos-editoriais"
                                    onClick={() => setMenuOpen(false)}
                                    className="w-full py-3 text-center text-gray-800 dark:text-white hover:text-[#D4AF37] transition border-b border-gray-100 dark:border-white/5 last:border-0"
                                >
                                    Serviços Editoriais
                                </Link>

                                <Link
                                    href="/livros"
                                    onClick={() => setMenuOpen(false)}
                                    className="w-full py-3 text-center text-gray-800 dark:text-white hover:text-[#D4AF37] transition border-b border-gray-100 dark:border-white/5 last:border-0"
                                >
                                    Livros
                                </Link>

                                <Link
                                    href="/fundadoras"
                                    onClick={() => setMenuOpen(false)}
                                    className="w-full py-3 text-center text-gray-800 dark:text-white hover:text-[#D4AF37] transition border-b border-gray-100 dark:border-white/5 last:border-0"
                                >
                                    Fundadoras
                                </Link>

                                <Link
                                    href="/contato"
                                    onClick={() => setMenuOpen(false)}
                                    className="w-full py-3 text-center text-gray-800 dark:text-white hover:text-[#D4AF37] transition border-b border-gray-100 dark:border-white/5 last:border-0"
                                >
                                    Contato
                                </Link>
                            </nav>

                            <div className="p-4 border-t border-gray-200 dark:border-white/10">
                                <Link
                                    href="/login"
                                    onClick={() => setMenuOpen(false)}
                                    className="w-full max-w-xs mx-auto block bg-[#D4AF37] text-black py-3 rounded-xl font-medium text-center hover:opacity-90 transition"
                                >
                                    Entrar
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* ================================
                        CASO 2: LOGADO (ADMIN) → SIDEBAR LATERAL ESQUERDA
                    ================================ */}
                    {user && (
                        <div className="md:hidden fixed inset-0 z-50 flex justify-start">
                            {/* FUNDO ESCURO */}
                            <div
                                className="absolute inset-0 bg-black/50"
                                onClick={() => setMenuOpen(false)}
                                aria-hidden="true"
                            />

                            {/* PAINEL LATERAL ESQUERDO */}
                            <div className="relative w-72 h-full bg-white dark:bg-[#020617] shadow-2xl border-r border-gray-200 dark:border-white/10 flex flex-col">
                                {/* CABEÇALHO */}
                                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-white/10 flex-shrink-0">
                                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                                        Menu Admin
                                    </span>

                                    <button
                                        onClick={() => setMenuOpen(false)}
                                        className="p-2 rounded-lg text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition"
                                        aria-label="Fechar menu"
                                    >
                                        ✕
                                    </button>
                                </div>

                                {/* LINKS */}
                                <nav className="flex-1 overflow-y-auto p-6 space-y-2">
                                    <Link
                                        href="/"
                                        onClick={() => setMenuOpen(false)}
                                        className="flex py-3 px-4 rounded-lg text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 hover:text-[#D4AF37] transition"
                                    >
                                        Início
                                    </Link>

                                    <Link
                                        href="/guardiana"
                                        onClick={() => setMenuOpen(false)}
                                        className="flex py-3 px-4 rounded-lg text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 hover:text-[#D4AF37] transition"
                                    >
                                        Guardiana
                                    </Link>

                                    <Link
                                        href="/servicos-editoriais"
                                        onClick={() => setMenuOpen(false)}
                                        className="flex py-3 px-4 rounded-lg text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 hover:text-[#D4AF37] transition"
                                    >
                                        Serviços Editoriais
                                    </Link>

                                    <Link
                                        href="/livros"
                                        onClick={() => setMenuOpen(false)}
                                        className="flex py-3 px-4 rounded-lg text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 hover:text-[#D4AF37] transition"
                                    >
                                        Livros
                                    </Link>

                                    <Link
                                        href="/fundadoras"
                                        onClick={() => setMenuOpen(false)}
                                        className="flex py-3 px-4 rounded-lg text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 hover:text-[#D4AF37] transition"
                                    >
                                        Fundadoras
                                    </Link>

                                    <Link
                                        href="/contato"
                                        onClick={() => setMenuOpen(false)}
                                        className="flex py-3 px-4 rounded-lg text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 hover:text-[#D4AF37] transition"
                                    >
                                        Contato
                                    </Link>

                                    {/* Painel Admin - Destaque verde */}
                                    <Link
                                        href="/dashboard"
                                        onClick={() => setMenuOpen(false)}
                                        className="flex py-3 px-4 rounded-lg text-[#16B83E] dark:text-[#16B83E] font-semibold hover:bg-[#16B83E]/10 transition items-center gap-2"
                                    >
                                        <span>🔧</span>
                                        <span>Painel Admin</span>
                                    </Link>
                                </nav>

                                {/* BOTÃO SAIR */}
                                <div className="p-6 border-t border-gray-200 dark:border-white/10 flex-shrink-0">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full py-3 rounded-xl border border-red-300 dark:border-red-900/50 text-red-600 dark:text-red-400 font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition text-center"
                                        aria-label="Sair da conta"
                                    >
                                        Sair
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </>
    );
}
