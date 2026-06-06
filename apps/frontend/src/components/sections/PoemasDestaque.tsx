"use client";

// ================================
// IMPORTS
// ================================
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";

// ================================
// CONFIGURAÇÃO
// ================================
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333";

// ================================
// TIPAGENS
// ================================
type Poem = {
    id: string;
    title: string;
    content: string;
    user: {
        name: string;
        avatarUrl: string | null;
    };
    createdAt: string;
};

type HighlightsResponse = {
    success: boolean;
    poems?: Poem[];
    message?: string;
    error?: string;
};

// ================================
// SEÇÃO: POEMAS EM DESTAQUE
// ================================
export default function PoemasDestaque() {
    const [poems, setPoems] = useState<Poem[]>([]);
    const [loading, setLoading] = useState(true);

    // ================================
    // BUSCAR DESTAQUES
    // ================================
    const fetchHighlights = useCallback(async () => {
        try {
            const response = await fetch(`${API_URL}/poems/highlights`);
            const data = (await response.json()) as HighlightsResponse;

            if (data.success && data.poems) {
                setPoems(data.poems);
            }
        } catch (_error) {
            console.warn("Aviso: Não foi possível conectar ao backend para carregar os poemas em destaque.");
        } finally {
            setLoading(false);
        }
    }, []);

    // ================================
    // CARREGAR AO ABRIR
    // ================================
    useEffect(() => {
        void fetchHighlights();
    }, [fetchHighlights]);

    if (!loading && poems.length === 0) {
        return null;
    }

    return (
        <section className="relative w-full py-24 bg-white dark:bg-[#020617] overflow-hidden transition-colors">
            {/* DECORAÇÃO DE FUNDO */}
            <div className="absolute top-0 right-0 w-64 h-64 opacity-5 pointer-events-none">
                <Image
                    src="/logo-grande.png"
                    alt=""
                    fill
                    className="object-contain grayscale"
                />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6">
                <div className="mb-12">
                    <span className="text-[#D4AF37] font-bold tracking-widest uppercase text-xs">
                        Curadoria Guardiana
                    </span>

                    <h2 className="mt-2 text-3xl md:text-4xl font-extrabold text-[#18384A] dark:text-white">
                        Poesias em Destaque
                    </h2>

                    <div className="w-20 h-1.5 bg-[#C95F52] mt-4 rounded-full" />
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="w-8 h-8 border-4 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin" />
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {poems.map((poem) => (
                            <div
                                key={poem.id}
                                className="group p-8 bg-[#F7F7F7] dark:bg-[#0F1720] border border-gray-100 dark:border-white/5 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 flex flex-col justify-between h-80"
                            >
                                <div>
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 rounded-full bg-[#18384A] flex items-center justify-center text-white font-bold text-sm overflow-hidden border-2 border-[#D4AF37]">
                                            {poem.user.avatarUrl ? (
                                                <Image
                                                    src={poem.user.avatarUrl}
                                                    alt={poem.user.name}
                                                    width={40}
                                                    height={40}
                                                />
                                            ) : (
                                                poem.user.name
                                                    .charAt(0)
                                                    .toUpperCase()
                                            )}
                                        </div>

                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-[#C95F52] uppercase tracking-wider">
                                                Autor(a)
                                            </span>

                                            <span className="text-sm font-semibold text-[#18384A] dark:text-white">
                                                {poem.user.name}
                                            </span>
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-bold text-[#18384A] dark:text-white mb-4 line-clamp-1 group-hover:text-[#C95F52] transition-colors">
                                        {poem.title}
                                    </h3>

                                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed italic line-clamp-4">
                                        &quot;{poem.content}&quot;
                                    </p>
                                </div>

                                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-white/5 flex justify-between items-center text-[10px] text-gray-400 uppercase font-medium">
                                    <span>Guardiana Editora</span>

                                    <span>
                                        {new Date(
                                            poem.createdAt,
                                        ).toLocaleDateString("pt-BR")}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}