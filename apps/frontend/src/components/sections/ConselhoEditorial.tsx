"use client";

// ================================
// IMPORTS
// ================================
import { useEffect, useState } from "react";
import Image from "next/image";

// ================================
// CONFIGURAÇÃO
// ================================
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3333";

// ================================
// TIPAGENS
// ================================
type CouncilMember = {
    id: string;
    name: string;
    country: string;
    imageUrl: string | null;
};

// ================================
// COMPONENTE: CONSELHO EDITORIAL
// ================================
export default function ConselhoEditorial() {
    const [members, setMembers] = useState<CouncilMember[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadMembers() {
            try {
                const response = await fetch(`${API_URL}/council`);
                const data = await response.json();
                if (data.success) {
                    setMembers(data.members);
                }
            } catch (error) {
                console.error("Erro ao carregar conselho editorial:", error);
            } finally {
                setLoading(false);
            }
        }
        void loadMembers();
    }, []);

    if (!loading && members.length === 0) return null;

    return (
        <section className="w-full px-6 py-24 bg-white dark:bg-[#020617] transition-colors">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <span className="text-[#C95F52] font-bold tracking-widest uppercase text-xs">
                        Curadoria Internacional
                    </span>

                    <h2 className="mt-2 text-3xl md:text-4xl font-extrabold text-[#18384A] dark:text-white">
                        Conselho Editorial
                    </h2>

                    <div className="w-20 h-1.5 bg-[#D4AF37] mx-auto mt-4 rounded-full" />
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="w-8 h-8 border-4 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin" />
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
                        {members.map((m) => (
                            <div key={m.id} className="flex flex-col items-center text-center group">
                                <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-2 border-gray-100 dark:border-white/10 mb-4 shadow-lg group-hover:border-[#C95F52] transition-all duration-300">
                                    {m.imageUrl ? (
                                        <Image
                                            src={m.imageUrl}
                                            alt={m.name}
                                            fill
                                            className="object-cover group-hover:scale-110 transition duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                                            {m.name.charAt(0)}
                                        </div>
                                    )}
                                </div>
                                <h3 className="text-lg font-bold text-[#18384A] dark:text-white leading-tight">
                                    {m.name}
                                </h3>
                                <p className="text-xs font-bold text-[#C95F52] uppercase mt-1 tracking-wider">
                                    {m.country}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
