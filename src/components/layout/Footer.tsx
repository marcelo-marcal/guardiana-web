"use client";

// ================================
// IMPORTS
// ================================
import Link from "next/link";

// ================================
// COMPONENTE FOOTER
// ================================
export default function Footer() {
    return (
        <footer
            className="
                w-full px-6 py-16
                bg-white dark:bg-[#020617]
                border-t border-gray-200 dark:border-white/10
                transition-colors
            "
        >
            <div className="max-w-7xl mx-auto">
                {/* ================================
                   GRID PRINCIPAL
                ================================ */}
                <div className="grid md:grid-cols-3 gap-12">
                    {/* ================================
                       MARCA
                    ================================ */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Guardiana
                        </h3>

                        <p className="mt-4 text-gray-600 dark:text-gray-300 text-sm leading-relaxed max-w-sm">
                            Uma editora dedicada a amplificar vozes,
                            compartilhar histórias e transformar ideias em
                            impacto real.
                        </p>
                    </div>

                    {/* ================================
                       NAVEGAÇÃO
                    ================================ */}
                    <div>
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                            Navegação
                        </h4>

                        <div className="flex flex-col gap-3 text-sm text-gray-600 dark:text-gray-300">
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
                                href="#autores"
                                className="hover:text-[#D4AF37] transition"
                            >
                                Autoras
                            </Link>
                            <Link
                                href="#contato"
                                className="hover:text-[#D4AF37] transition"
                            >
                                Contato
                            </Link>
                        </div>
                    </div>

                    {/* ================================
                       CONTATO
                    ================================ */}
                    <div>
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                            Contato
                        </h4>

                        <div className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                            <p>Email: contato@guardiana.com</p>
                            <p>Brasil</p>
                        </div>
                    </div>
                </div>

                {/* ================================
                   DIVISÓRIA
                ================================ */}
                <div className="mt-12 border-t border-gray-200 dark:border-white/10 pt-6 text-center text-sm text-gray-500 dark:text-gray-400">
                    © {new Date().getFullYear()} Guardiana. Todos os direitos
                    reservados.
                </div>
            </div>
        </footer>
    );
}
