"use client";

// ================================
// IMPORTS
// ================================
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";

// ================================
// CONFIGURAÇÃO
// ================================
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3333";

// ================================
// TIPAGENS
// ================================
type Poem = {
    id: string;
    title: string;
    content: string;
    status: string;
    isHighlighted: boolean;
    user: {
        name: string;
        avatarUrl: string | null;
    };
    createdAt: string;
};

type PoemsResponse = {
    success: boolean;
    poems?: Poem[];
    message?: string;
    error?: string;
};

// ================================
// PÁGINA: LISTAGEM DE POEMAS
// ================================
export default function PoemasPublicPage() {
    const [poems, setPoems] = useState<Poem[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPoem, setSelectedPoem] = useState<Poem | null>(null);

    // ================================
    // BUSCAR POEMAS APROVADOS
    // ================================
    const fetchPoems = useCallback(async () => {
        try {
            const response = await fetch(`${API_URL}/poems`);
            const data = (await response.json()) as PoemsResponse;

            if (data.success && data.poems) {
                setPoems(data.poems);
            }
        } catch {
            console.warn("Aviso: Não foi possível carregar os poemas.");
        } finally {
            setLoading(false);
        }
    }, []);

    // ================================
    // CARREGAR AO ABRIR
    // ================================
    useEffect(() => {
        void fetchPoems();
    }, [fetchPoems]);

    return (
        <main className="min-h-screen pt-24 pb-20 bg-gray-50 dark:bg-[#020617] transition-colors">
            <div className="max-w-7xl mx-auto px-6">
                {/* CABEÇALHO DA PÁGINA */}
                <header className="mb-16 text-center md:text-left">
                    <span className="text-[#C95F52] font-bold tracking-[0.2em] uppercase text-xs">
                        Antologia Guardiana
                    </span>
                    <h1 className="mt-4 text-4xl md:text-5xl font-extrabold text-[#18384A] dark:text-white">
                        Poesias e Versos
                    </h1>
                    <p className="mt-4 text-gray-500 dark:text-gray-400 max-w-2xl leading-relaxed">
                        Explore as obras de nossos autores. Uma curadoria especial de poesias que tocam a alma e celebram a literatura.
                    </p>
                    <div className="w-24 h-1.5 bg-[#D4AF37] mt-8 rounded-full mx-auto md:mx-0" />
                </header>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 gap-4">
                        <div className="w-12 h-12 border-4 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin" />
                        <span className="text-gray-400 font-medium">Buscando inspirações...</span>
                    </div>
                ) : poems.length === 0 ? (
                    <div className="text-center py-32">
                        <p className="text-gray-400 text-lg">Ainda não temos poesias publicadas. Em breve novas obras!</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {poems.map((poem) => (
                            <article
                                key={poem.id}
                                className={`group p-8 rounded-3xl border transition-all duration-500 flex flex-col justify-between h-96 relative overflow-hidden ${
                                    poem.isHighlighted
                                        ? "bg-white dark:bg-[#0F1720] border-[#D4AF37]/30 shadow-xl shadow-[#D4AF37]/5"
                                        : "bg-[#F7F7F7] dark:bg-[#0F1720]/50 border-gray-100 dark:border-white/5 shadow-sm hover:shadow-lg"
                                }`}
                            >
                                {poem.isHighlighted && (
                                    <div className="absolute top-0 right-0 p-4">
                                        <span className="bg-[#D4AF37] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter">
                                            ★ Destaque
                                        </span>
                                    </div>
                                )}

                                <div>
                                    <div className="flex items-center gap-3 mb-8">
                                        <div className="w-10 h-10 rounded-full bg-[#18384A] flex items-center justify-center text-white font-bold text-sm overflow-hidden border-2 border-[#D4AF37]">
                                            {poem.user.avatarUrl ? (
                                                <img
                                                    src={poem.user.avatarUrl}
                                                    alt={poem.user.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                poem.user.name.charAt(0).toUpperCase()
                                            )}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-[#C95F52] uppercase tracking-wider">Autor(a)</span>
                                            <span className="text-sm font-semibold text-[#18384A] dark:text-white">{poem.user.name}</span>
                                        </div>
                                    </div>

                                    <h2 className="text-2xl font-bold text-[#18384A] dark:text-white mb-4 line-clamp-2 group-hover:text-[#C95F52] transition-colors leading-tight">
                                        {poem.title}
                                    </h2>

                                    <div className="relative">
                                        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed italic line-clamp-5">
                                            &quot;{poem.content}&quot;
                                        </p>
                                        <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-white dark:from-[#0F1720] to-transparent hidden group-hover:block" />
                                    </div>
                                </div>

                                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-white/5 flex justify-between items-center">
                                    <span className="text-[10px] text-gray-400 uppercase font-bold">
                                        {new Date(poem.createdAt).toLocaleDateString("pt-BR")}
                                    </span>

                                    <button
                                        onClick={() => setSelectedPoem(poem)}
                                        className="text-[#18384A] dark:text-white text-xs font-bold flex items-center gap-2 group-hover:text-[#C95F52] transition-colors"
                                    >
                                        LER COMPLETO
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                        </svg>
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>

            {/* MODAL DE LEITURA */}
            {selectedPoem && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-fade-in">
                    <div className="bg-white dark:bg-[#0F1720] w-full max-w-3xl rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-gray-200 dark:border-white/10 max-h-[90vh] overflow-y-auto relative">

                        <div className="absolute top-8 right-8">
                            <button
                                type="button"
                                onClick={() => setSelectedPoem(null)}
                                className="text-gray-400 hover:text-[#C95F52] transition-all p-3 bg-gray-100 dark:bg-white/5 rounded-full"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="mb-12">
                            {selectedPoem.isHighlighted && (
                                <span className="text-[#D4AF37] font-bold text-xs uppercase tracking-widest block mb-2">★ Obra em Destaque</span>
                            )}
                            <h2 className="text-4xl md:text-5xl font-black text-[#18384A] dark:text-white leading-tight">
                                {selectedPoem.title}
                            </h2>
                            <div className="flex items-center gap-4 mt-6">
                                <div className="w-12 h-12 rounded-full bg-[#18384A] flex items-center justify-center text-white font-bold border-2 border-[#D4AF37] overflow-hidden">
                                    {selectedPoem.user.avatarUrl ? (
                                        <img src={selectedPoem.user.avatarUrl} alt={selectedPoem.user.name} className="w-full h-full object-cover" />
                                    ) : (
                                        selectedPoem.user.name.charAt(0).toUpperCase()
                                    )}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-[#C95F52] uppercase">Autor(a)</p>
                                    <p className="text-lg font-semibold text-[#18384A] dark:text-white">{selectedPoem.user.name}</p>
                                </div>
                            </div>
                        </div>

                        <div className="prose dark:prose-invert max-w-none">
                            <p className="text-[#526173] dark:text-gray-300 whitespace-pre-wrap italic text-xl md:text-2xl leading-relaxed font-serif">
                                {selectedPoem.content}
                            </p>
                        </div>

                        <div className="mt-16 pt-8 border-t border-gray-100 dark:border-white/5 flex justify-center">
                            <button
                                type="button"
                                onClick={() => setSelectedPoem(null)}
                                className="px-12 py-4 bg-[#18384A] text-white rounded-full font-bold hover:bg-[#C95F52] transition shadow-xl"
                            >
                                Fechar Leitura
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
