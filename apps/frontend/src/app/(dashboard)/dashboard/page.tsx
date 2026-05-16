"use client";

// ================================
// IMPORTS
// ================================
import { useEffect, useState } from "react";
import { getConteudo, setConteudo } from "../../../services/conteudo.service";

// ================================
// DASHBOARD HOME (AGORA EDITÁVEL)
// ================================
export default function Dashboard() {
    const [titulo, setTitulo] = useState("");
    const [subtitulo, setSubtitulo] = useState("");

    // ================================
    // CARREGAR DADOS
    // ================================
    useEffect(() => {
        const data = getConteudo();

        setTitulo(data.hero.titulo);
        setSubtitulo(data.hero.subtitulo);
    }, []);

    // ================================
    // SALVAR
    // ================================
    const salvar = () => {
        setConteudo({
            hero: {
                titulo,
                subtitulo,
            },
        });
        // AVISA O SITE
        window.dispatchEvent(new Event("conteudoAtualizado"));

        alert("Conteúdo salvo!");
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Painel Administrativo
            </h1>

            <p className="mt-4 text-gray-600 dark:text-gray-300">
                Edite o conteúdo da Home
            </p>

            {/* ================================
               FORM HERO
            ================================= */}
            <div className="mt-8 space-y-4 max-w-xl">
                <input
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    placeholder="Título do Hero"
                    className="
                        w-full px-4 py-3 rounded-lg
                        bg-white dark:bg-[#020617]
                        text-gray-900 dark:text-white
                        border border-gray-300 dark:border-white/20
                        placeholder:text-gray-400 dark:placeholder:text-gray-500
                        focus:outline-none focus:ring-2 focus:ring-[#D4AF37]
                        transition
                        "
                />

                <textarea
                    value={subtitulo}
                    onChange={(e) => setSubtitulo(e.target.value)}
                    placeholder="Subtítulo do Hero"
                    className="
                        w-full px-4 py-3 rounded-lg
                        bg-white dark:bg-[#020617]
                        text-gray-900 dark:text-white
                        border border-gray-300 dark:border-white/20
                        placeholder:text-gray-400 dark:placeholder:text-gray-500
                        focus:outline-none focus:ring-2 focus:ring-[#D4AF37]
                        transition
                        "
                />

                <button
                    onClick={salvar}
                    className="bg-[#D4AF37] px-6 py-3 rounded-lg"
                >
                    Salvar Alterações
                </button>
            </div>
        </div>
    );
}
