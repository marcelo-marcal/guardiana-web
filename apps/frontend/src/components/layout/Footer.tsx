"use client";

// ================================
// IMPORTS
// ================================
import Link from "next/link";
import { useEffect, useState } from "react";

// ================================
// CONFIGURAÇÕES
// ================================
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333";

// ================================
// TIPAGENS
// ================================
type SocialLink = {
    nome: string;
    usuario: string;
    href: string;
    icone: string;
};

type SettingResponse = {
    success: boolean;
    value?: string;
    message?: string;
    error?: string;
};

// ================================
// COMPONENTE FOOTER
// ================================
export default function Footer() {
    const [redesSociais, setRedesSociais] = useState<SocialLink[]>([
        {
            nome: "Instagram",
            usuario: "@guardianaeditora",
            href: "https://www.instagram.com/guardianaeditora",
            icone: "◎",
        },
        {
            nome: "Facebook",
            usuario: "Em breve",
            href: "#",
            icone: "f",
        },
        {
            nome: "X",
            usuario: "@guardiana",
            href: "#",
            icone: "𝕏",
        },
    ]);

    useEffect(() => {
        const fetchSocialLinks = async () => {
            try {
                const response = await fetch(`${API_URL}/auth/settings/social_media_links`);
                const data = (await response.json()) as SettingResponse;

                if (data.success && data.value && data.value !== "false") {
                    try {
                        const links = JSON.parse(data.value) as SocialLink[];
                        if (Array.isArray(links) && links.length > 0) {
                            setRedesSociais(links);
                        }
                    } catch (e) {
                        console.error("Erro ao fazer parse das redes sociais:", e);
                    }
                }
            } catch (error) {
                console.error("Erro ao carregar redes sociais:", error);
            }
        };

        void fetchSocialLinks();
    }, []);

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
            REDES SOCIAIS
            ================================ */}
            <div className="grid sm:grid-cols-3 gap-4 mb-6">
                {redesSociais.map((rede, index) => (
                    <Link
                        key={index}
                        href={rede.href}
                        target={rede.href === "#" ? "_self" : "_blank"}
                        className="
                            group
                            bg-white dark:bg-[#0F1720]
                            border border-gray-200 dark:border-white/10
                            rounded-lg
                            p-4
                            text-center
                            shadow-md
                            hover:-translate-y-1
                            hover:shadow-lg
                            transition-all duration-300
                        "
                    >
                        <div className="text-2xl font-bold text-[#18384A] dark:text-white group-hover:text-[#D4AF37] transition">
                            {rede.icone}
                        </div>

                        <h3 className="mt-2 text-xs font-bold text-[#18384A] dark:text-white">
                            {rede.nome}
                        </h3>

                        <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                            {rede.usuario}
                        </p>
                    </Link>
                ))}
            </div>

                {/* ================================
                   GRID PRINCIPAL
                ================================ */}
                <div className="grid md:grid-cols-3 gap-12">
                    {/* MARCA */}
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

                    {/* NAVEGAÇÃO */}
                    <div>
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                            Navegação
                        </h4>

                        <div className="flex flex-col gap-3 text-sm text-gray-600 dark:text-gray-300">
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
                                href="/poemas"
                                className="hover:text-[#D4AF37] transition"
                            >
                                Poemas
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
                        </div>
                    </div>

                    {/* CONTATO */}
                    <div>
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                            Contato
                        </h4>

                        <div className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                            <p>Email: contato@guardiana.com</p>
                            <p>Passo Fundo / Rio Grande do Sul, Brasil</p>
                            {redesSociais.map((rede, index) => (
                                <p key={index}>{rede.nome}: {rede.usuario}</p>
                            ))}
                        </div>
                    </div>
                </div>

                {/* DIVISÓRIA */}
                <div className="mt-12 border-t border-gray-200 dark:border-white/10 pt-6 text-center text-sm text-gray-500 dark:text-gray-400">
                    © {new Date().getFullYear()} Guardiana. Todos os direitos
                    reservados.
                </div>
            </div>
        </footer>
    );
}