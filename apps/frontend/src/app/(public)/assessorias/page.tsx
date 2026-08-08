"use client";

// ================================
// IMPORTS
// ================================
import Link from "next/link";
import { useEffect, useState } from "react";

// ================================
// CONFIGURAÇÃO
// ================================
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3333";

// ================================
// TIPAGENS
// ================================
type Advisory = {
    id: string;
    title: string;
    description: string;
    items: string[];
    isActive: boolean;
};

// ================================
// PÁGINA: ASSESSORIAS (Client Side)
// ================================
export default function Assessorias() {
    const [advisories, setAdvisories] = useState<Advisory[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadAdvisories() {
            try {
                const response = await fetch(`${API_URL}/advisories?onlyActive=true`);
                const data = await response.json();
                if (data.success) {
                    setAdvisories(data.advisories);
                }
            } catch (error) {
                console.error("Erro ao carregar assessorias:", error);
            } finally {
                setLoading(false);
            }
        }
        void loadAdvisories();
    }, []);

    return (
        <main className="bg-[#F7F7F7] dark:bg-[#020617] transition-colors min-h-screen">
            {/* ================================
                HERO DA PÁGINA
            ================================ */}
            <section className="px-6 py-20 mt-16">
                <div className="max-w-7xl mx-auto text-center">
                    <span className="text-sm uppercase tracking-widest text-[#D4AF37]">
                        Guardiana Editora
                    </span>
                    <h1 className="mt-4 text-4xl md:text-6xl font-extrabold text-[#18384A] dark:text-white leading-tight">
                        Assessorias
                    </h1>
                </div>
            </section>

            {/* ================================
                BLOCOS DE ASSESSORIAS
            ================================ */}
            <section className="px-6 pb-24">
                <div className="max-w-4xl mx-auto space-y-12">
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="w-8 h-8 border-4 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin" />
                        </div>
                    ) : advisories.length === 0 ? (
                        <p className="text-center text-gray-500 py-20">Em breve, mais informações sobre nossas assessorias.</p>
                    ) : (
                        advisories.map((advisory) => (
                            <div
                                key={advisory.id}
                                className="bg-white dark:bg-[#0F1720] border border-gray-200 dark:border-white/10 rounded-3xl p-8 md:p-12 shadow-sm hover:shadow-md transition-all duration-300"
                            >
                                <h2 className="text-3xl font-extrabold text-[#18384A] dark:text-white mb-6">
                                    {advisory.title}
                                </h2>
                                <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-8 whitespace-pre-line">
                                    {advisory.description}
                                </p>

                                {advisory.items && advisory.items.length > 0 && (
                                    <ul className="grid md:grid-cols-2 gap-4">
                                        {advisory.items.map((item, index) => (
                                            <li key={index} className="flex items-start gap-3 text-gray-700 dark:text-gray-400">
                                                <span className="text-[#C95F52] mt-1">✦</span>
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </section>

            {/* ================================
                CHAMADA PARA AÇÃO: ASSESSORIAS
            ================================ */}
            <section className="px-6 pb-24">
                <div className="max-w-4xl mx-auto bg-white dark:bg-[#0F1720] border-2 border-[#18384A] dark:border-[#D4AF37]/30 rounded-3xl p-8 md:p-12 text-center shadow-lg">
                    <h2 className="text-2xl md:text-3xl font-bold text-[#18384A] dark:text-white mb-8">
                        Impulsione sua trajetória acadêmica ou cultural hoje mesmo com a Editora Guardiana.
                    </h2>

                    <Link
                        href="/contato"
                        className="
                            inline-flex
                            px-8 py-4
                            rounded-xl
                            bg-[#18384A]
                            text-white
                            font-bold
                            hover:bg-[#C95F52]
                            transition-all duration-300
                            shadow-xl shadow-[#18384A]/20
                        "
                    >
                        Fale com um Consultor / Solicite um Orçamento
                    </Link>
                </div>
            </section>

            {/* ================================
                CTA FINAL
            ================================ */}
            <section className="mt-auto relative overflow-hidden px-6 py-20 bg-[#C95F52] dark:bg-[#7E342D]">
                <div className="max-w-7xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-white">
                        Tem uma história para publicar?
                    </h2>

                    <p className="mt-5 text-white text-lg max-w-3xl mx-auto leading-relaxed">
                        Entre em contato com a Guardiana e converse conosco
                        sobre sua ideia, seu livro ou seu projeto editorial.
                    </p>

                    <Link
                        href="/contato"
                        className="
                            inline-flex
                            mt-8
                            px-8 py-3
                            rounded-full
                            border border-white
                            text-white
                            font-bold
                            hover:bg-white
                            hover:text-[#C95F52]
                            transition-all duration-300
                        "
                    >
                        Fale conosco →
                    </Link>
                </div>
            </section>
        </main>
    );
}
