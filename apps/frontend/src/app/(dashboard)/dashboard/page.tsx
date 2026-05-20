"use client";

import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";

export default function UserDashboard() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<"poemas" | "livros">("poemas");

    return (
        <div className="p-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-[#18384A] dark:text-white">
                    Olá, {user?.name || "Escritor(a)"}
                </h1>
                <p className="text-gray-500 dark:text-gray-400">
                    Gerencie suas publicações e sua biblioteca digital.
                </p>
            </header>

            {/* ABAS */}
            <div className="flex gap-4 border-b border-gray-200 dark:border-white/10 mb-8">
                <button 
                    onClick={() => setActiveTab("poemas")}
                    className={`pb-4 px-2 font-medium transition ${activeTab === "poemas" ? "border-b-2 border-[#C95F52] text-[#C95F52]" : "text-gray-500"}`}
                >
                    Meus Poemas
                </button>
                <button 
                    onClick={() => setActiveTab("livros")}
                    className={`pb-4 px-2 font-medium transition ${activeTab === "livros" ? "border-b-2 border-[#C95F52] text-[#C95F52]" : "text-gray-500"}`}
                >
                    Minha Biblioteca (E-books)
                </button>
            </div>

            {activeTab === "poemas" ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {/* Card de Novo Poema */}
                    <button className="h-64 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-2xl flex flex-col items-center justify-center gap-3 hover:border-[#C95F52] hover:bg-gray-50 dark:hover:bg-white/5 transition group">
                        <span className="text-4xl text-gray-300 group-hover:text-[#C95F52]">+</span>
                        <span className="font-semibold text-gray-500 group-hover:text-[#C95F52]">Escrever Poesia</span>
                    </button>

                    {/* Exemplo de Poema Listado (Mock) */}
                    <div className="p-6 bg-white dark:bg-[#0F1720] rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full uppercase">
                                Pendente
                            </span>
                        </div>
                        <h3 className="text-lg font-bold text-[#18384A] dark:text-white mb-2">O Sussurro da Noite</h3>
                        <p className="text-gray-500 dark:text-gray-400 line-clamp-3 text-sm italic">
                            "As estrelas contam histórias que o vento se apressa em apagar..."
                        </p>
                        <div className="mt-4 pt-4 border-t border-gray-50 dark:border-white/5 text-xs text-gray-400">
                            Enviado em 15/03/2024
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center py-20 bg-gray-50 dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/10">
                    <div className="text-5xl mb-4">📚</div>
                    <h2 className="text-xl font-bold text-[#18384A] dark:text-white">Sua estante está vazia</h2>
                    <p className="text-gray-500 mt-2 max-w-sm mx-auto">
                        Em breve você poderá adquirir e-books da Guardiana e acessá-los diretamente por aqui.
                    </p>
                    <button className="mt-6 px-6 py-2 bg-[#18384A] text-white rounded-full font-bold hover:opacity-90 transition">
                        Ver catálogo de livros
                    </button>
                </div>
            )}
        </div>
    );
}