"use client";

// ================================
// IMPORTS
// ================================
import Image from "next/image";

// ================================
// COMPONENTE AUTORES
// ================================
export default function Autores() {
    return (
        // 🔥 Seção com ID para scroll do menu
        <section
            id="autores"
            className="
                w-full py-24 px-6
                bg-white dark:bg-[#020617]
                transition-colors
                scroll-mt-24
            "
        >
            <div className="max-w-6xl mx-auto">
                {/* ================================
                   CABEÇALHO
                ================================ */}
                <div className="text-center mb-16">
                    <span className="text-sm uppercase tracking-widest text-[#D4AF37]">
                        Fundadoras
                    </span>

                    <h2 className="mt-4 text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                        Quem está por trás da Guardiana
                    </h2>

                    <p className="mt-4 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        Conheça as idealizadoras que transformam histórias em
                        experiências que impactam o mundo.
                    </p>
                </div>

                {/* ================================
                   GRID DE AUTORAS
                ================================ */}
                <div className="grid md:grid-cols-2 gap-12">
                    {/* ================================
                       AUTORA 1
                    ================================ */}
                    <div
                        className="
                            group
                            text-center
                            transition-all duration-500
                            hover:-translate-y-2
                        "
                    >
                        {/* FOTO */}
                        <div className="relative w-48 h-48 mx-auto rounded-full overflow-hidden border-4 border-[#D4AF37]/30">
                            <Image
                                src="/jenifer-brum.png"
                                alt="Jenifer Brum"
                                fill
                                className="object-cover"
                            />
                        </div>

                        {/* NOME */}
                        <h3 className="mt-6 text-xl font-semibold text-gray-900 dark:text-white group-hover:text-[#D4AF37] transition">
                            Jenifer Brum
                        </h3>

                        {/* DESCRIÇÃO */}
                        <p className="mt-3 text-gray-600 dark:text-gray-300 text-sm leading-relaxed max-w-md mx-auto">
                            Co-fundadora da Guardiana, dedicada a dar voz a
                            histórias que inspiram transformação social e
                            cultural.
                        </p>
                    </div>

                    {/* ================================
                       AUTORA 2
                    ================================ */}
                    <div
                        className="
                            group
                            text-center
                            transition-all duration-500
                            hover:-translate-y-2
                        "
                    >
                        {/* FOTO */}
                        <div className="relative w-48 h-48 mx-auto rounded-full overflow-hidden border-4 border-[#D4AF37]/30">
                            <Image
                                src="/jenny-gonzalez.png"
                                alt="Jenny Gonzalez"
                                fill
                                className="object-cover"
                            />
                        </div>

                        {/* NOME */}
                        <h3 className="mt-6 text-xl font-semibold text-gray-900 dark:text-white group-hover:text-[#D4AF37] transition">
                            Jenny Gonzalez
                        </h3>

                        {/* DESCRIÇÃO */}
                        <p className="mt-3 text-gray-600 dark:text-gray-300 text-sm leading-relaxed max-w-md mx-auto">
                            Co-fundadora da Guardiana, apaixonada por conectar
                            pessoas através da escrita e fortalecer narrativas
                            que transformam realidades.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
