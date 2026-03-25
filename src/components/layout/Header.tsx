"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation"; // detecta rota atual

export default function Header() {
    // ================================
    // Estado do tema
    // ================================
    const [darkMode, setDarkMode] = useState(false);

    // ================================
    // Estado do menu mobile
    // ================================
    const [menuOpen, setMenuOpen] = useState(false);

    // ================================
    // ROTA ATUAL
    // ================================
    const pathname = usePathname();

    // ================================
    // Tema padrão LIGHT
    // ================================
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");

        if (savedTheme === "dark") {
            document.documentElement.classList.add("dark");
            setDarkMode(true);
        } else {
            document.documentElement.classList.remove("dark");
            setDarkMode(false);
        }
    }, []);

    // ================================
    // Alternar tema
    // ================================
    const toggleTheme = () => {
        if (darkMode) {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        } else {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        }

        setDarkMode(!darkMode);
    };

    // ================================
    // Função inteligente de navegação
    // ================================
    const getLink = (section: string) => {
        // Se estiver na HOME → usa scroll (#)
        if (pathname === "/") {
            return `#${section}`;
        }

        // Se estiver em outra página → vai para home + âncora
        return `/#${section}`;
    };

    return (
        <header className="w-full h-16 fixed top-0 z-50 border-b border-gray-200 dark:border-white/10 bg-white/70 dark:bg-[#0F1720]/70 backdrop-blur">
            <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-6">
                {/* ================================
                 LOGO + NOME
                ================================ */}
                <div className="flex items-center gap-2 text-gray-900 dark:text-white">
                    {/* LOGO */}
                    <div className="relative w-14 h-14">
                        <Image
                            src="/logo.svg"
                            alt="Logo Guardiana"
                            fill
                            className="object-contain dark:brightness-0 dark:invert"
                        />
                    </div>

                    {/* NOME */}
                    <span className="text-base font-semibold leading-none">
                        Guardiana
                    </span>
                </div>

                {/* ================================
                 MENU DESKTOP
                ================================ */}
                <nav className="hidden md:flex gap-8 text-sm text-gray-800 dark:text-white">
                    <Link href="/" className="hover:text-[#D4AF37] transition">
                        Início
                    </Link>

                    {/* AGORA INTELIGENTE */}
                    <Link
                        href={getLink("sobre")}
                        className="hover:text-[#D4AF37] transition"
                    >
                        Sobre
                    </Link>

                    <Link
                        href={getLink("publicacoes")}
                        className="hover:text-[#D4AF37] transition"
                    >
                        Publicações
                    </Link>

                    <Link
                        href={getLink("autores")}
                        className="hover:text-[#D4AF37] transition"
                    >
                        Autoras
                    </Link>

                    <Link
                        href={getLink("contato")}
                        className="hover:text-[#D4AF37] transition"
                    >
                        Contato
                    </Link>
                </nav>

                {/* ================================
                 AÇÕES
                ================================ */}
                <div className="flex items-center gap-2">
                    {/* BOTÃO TEMA */}
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-lg border border-gray-300 dark:border-white/20 hover:bg-gray-100 dark:hover:bg-white/10 transition"
                    >
                        {darkMode ? (
                            // 🌙 LUA
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
                            // ☀️ SOL
                            <svg
                                className="w-5 h-5 text-gray-800 dark:text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <circle cx="12" cy="12" r="5" strokeWidth="2" />
                            </svg>
                        )}
                    </button>

                    {/* MENU MOBILE */}
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="md:hidden p-2 rounded-lg border border-gray-300 dark:border-white/20"
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

                    {/* LOGIN */}
                    <Link
                        href="/login"
                        className="hidden md:block bg-[#D4AF37] text-black px-4 py-2 rounded-xl text-sm font-medium hover:opacity-90 transition"
                    >
                        Entrar
                    </Link>
                </div>
            </div>

            {/* ================================
                MENU MOBILE
            ================================ */}
            {menuOpen && (
                <div className="md:hidden px-6 pb-6 pt-2 bg-white dark:bg-[#020617] border-t border-gray-200 dark:border-white/10">
                    <div className="flex flex-col gap-4 text-gray-800 dark:text-white">
                        <Link href="/" onClick={() => setMenuOpen(false)}>
                            Início
                        </Link>

                        <Link
                            href={getLink("sobre")}
                            onClick={() => setMenuOpen(false)}
                        >
                            Sobre
                        </Link>

                        <Link
                            href={getLink("publicacoes")}
                            onClick={() => setMenuOpen(false)}
                        >
                            Publicações
                        </Link>

                        <Link
                            href={getLink("autores")}
                            onClick={() => setMenuOpen(false)}
                        >
                            Autoras
                        </Link>

                        <Link
                            href={getLink("contato")}
                            onClick={() => setMenuOpen(false)}
                        >
                            Contato
                        </Link>

                        <Link
                            href="/login"
                            onClick={() => setMenuOpen(false)}
                            className="bg-[#D4AF37] text-black px-4 py-2 rounded-xl text-sm font-medium text-center"
                        >
                            Entrar
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
}
