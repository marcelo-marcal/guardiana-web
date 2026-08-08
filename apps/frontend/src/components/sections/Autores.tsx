"use client";

// ================================
// IMPORTS
// ================================
import { useEffect, useState } from "react";
import Image from "next/image";

// ================================
// CONFIGURAÇÃO
// ================================
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333";

// ================================
// TIPAGENS
// ================================
type Founder = {
    id: string;
    name: string;
    role: string;
    imageUrl: string | null;
    position: string;
};

// ================================
// COMPONENTE AUTORES / FUNDADORAS
// ================================
export default function Autores() {
    const [founders, setFounders] = useState<Founder[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadFounders() {
            try {
                const response = await fetch(`${API_URL}/founders`);
                const data = await response.json();
                if (data.success) {
                    setFounders(data.founders);
                }
            } catch (error) {
                console.error("Erro ao carregar fundadoras:", error);
            } finally {
                setLoading(false);
            }
        }
        void loadFounders();
    }, []);

    if (!loading && founders.length === 0) return null;

    return (
        <section
            id="autores"
            className="w-full px-6 py-16 md:py-24 bg-[#18384A] dark:bg-[#020617] transition-colors scroll-mt-24"
        >
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12 md:mb-16">
                    <span className="text-xl md:text-2xl text-white">
                        Fundadoras
                    </span>

                    <h2 className="mt-4 text-3xl md:text-4xl font-extrabold text-[#D4AF37]">
                        Quem está por trás da Guardiana
                    </h2>

                    <p className="mt-5 text-white text-base md:text-xl max-w-4xl mx-auto leading-relaxed">
                        Conheça as idealizadoras e a curadoria editorial que
                        transformam histórias em experiências que impactam o
                        mundo.
                    </p>
                </div>

                <div className="grid lg:grid-cols-[0.8fr_1.8fr_0.8fr] gap-8 lg:gap-12 items-center">
                    <div className="text-center lg:text-right">
                        <p className="text-white text-base md:text-xl leading-relaxed">
                            Uma equipe dedicada a acolher ideias, cuidar das
                            palavras e transformar manuscritos em obras com
                            identidade editorial.
                        </p>

                        <div className="mt-6 md:mt-8 text-[#D4AF37] text-4xl">
                            ↝
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-10">
                            <div className="w-8 h-8 border-4 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin" />
                        </div>
                    ) : (
                        <div className="grid sm:grid-cols-3 gap-6">
                            {founders.map((pessoa) => (
                                <div
                                    key={pessoa.id}
                                    className="group bg-white rounded-xl overflow-hidden shadow-xl text-center transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
                                >
                                    <div className="relative w-full h-[260px] sm:h-44 bg-white overflow-hidden">
                                        {pessoa.imageUrl ? (
                                            <Image
                                                src={pessoa.imageUrl}
                                                alt={pessoa.name}
                                                fill
                                                sizes="(max-width: 640px) 100vw, 33vw"
                                                className={`object-cover ${pessoa.position} group-hover:scale-105 transition duration-500`}
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">Sem foto</div>
                                        )}
                                    </div>

                                    <div className="px-4 py-3 sm:px-5 sm:py-5">
                                        <h3 className="text-base sm:text-lg font-extrabold text-[#18384A] group-hover:text-[#C95F52] transition">
                                            {pessoa.name}
                                        </h3>

                                        <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-[#344454]">
                                            {pessoa.role}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="text-center lg:text-left">
                        <p className="text-white text-base md:text-xl leading-relaxed">
                            Entre escrita, memória, arte e curadoria, a
                            Guardiana constrói pontes entre autores, leitores e
                            novas possibilidades de publicação.
                        </p>

                        <div className="mt-6 md:mt-8 text-[#D4AF37] text-4xl">
                            ↜
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
