"use client"; // Permite usar estado e eventos no React (lado do cliente)

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Header() {
    // ================================
    // Estado do tema
    // ================================
    const [darkMode, setDarkMode] = useState(false);

    // ================================
    // Define tema ao carregar (PADRÃO = LIGHT)
    // ================================
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");

        if (savedTheme === "dark") {
            document.documentElement.classList.add("dark");
            setDarkMode(true);
        } else {
            // padrão agora é LIGHT
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

    return (
        // ================================
        // Header fixo com efeito glass
        // ================================
        <header className="w-full fixed top-0 z-50 border-b border-gray-200 dark:border-white/10 bg-white/70 dark:bg-[#0F1720]/70 backdrop-blur">
            {/* Container */}
            <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
                {/* ================================
                 Logo / Nome (CORRIGIDO)
                ================================ */}
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    Guardiana
                </div>

                {/* ================================
                    Menu
                ================================ */}
                <nav className="hidden md:flex gap-8 text-sm text-gray-800 dark:text-white">
                    <Link href="/" className="hover:text-[#D4AF37] transition">
                        Início
                    </Link>
                    <Link
                        href="#sobre"
                        className="hover:text-[#D4AF37] transition"
                    >
                        Sobre
                    </Link>
                    <Link
                        href="#publicacoes"
                        className="hover:text-[#D4AF37] transition"
                    >
                        Publicações
                    </Link>
                    <Link
                        href="/autores"
                        className="hover:text-[#D4AF37] transition"
                    >
                        Autoras
                    </Link>
                    <Link
                        href="/contato"
                        className="hover:text-[#D4AF37] transition"
                    >
                        Contato
                    </Link>
                </nav>

                {/* ================================
                 Ações (tema + login)
                ================================ */}
                <div className="flex items-center gap-4">
                    {/* Botão tema PROFISSIONAL */}
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-lg border border-gray-300 dark:border-white/20 hover:bg-gray-100 dark:hover:bg-white/10 transition"
                    >
                        {darkMode ? (
                            // LUA
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-5 h-5 text-gray-800 dark:text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 12.79A9 9 0 0111.21 3c0 .34.02.67.05 1A7 7 0 0019 12a7 7 0 002-0.21z"
                                />
                            </svg>
                        ) : (
                            // SOL
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-5 h-5 text-gray-800 dark:text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <circle cx="12" cy="12" r="5" strokeWidth="2" />
                                <path
                                    strokeLinecap="round"
                                    strokeWidth="2"
                                    d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
                                />
                            </svg>
                        )}
                    </button>

                    {/* Login */}
                    <Link
                        href="/login"
                        className="bg-[#D4AF37] text-black px-4 py-2 rounded-xl text-sm font-medium hover:opacity-90 transition"
                    >
                        Entrar
                    </Link>
                </div>
            </div>
        </header>
    );
}
