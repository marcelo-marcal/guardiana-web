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
        // Seção com ID para futuras navegações
        <section
            id="autores"
            className="
                w-full py-24 px-6
                bg-[#18384A] dark:bg-[#020617]
                transition-colors
                scroll-mt-24
            "
        >
            <div className="max-w-7xl mx-auto">
                {/* ================================
                   CABEÇALHO
                ================================ */}
                <div className="text-center mb-16">
                    <span className="text-2xl text-white">Fundadoras</span>

                    <h2 className="mt-4 text-3xl md:text-4xl font-extrabold text-[#D4AF37]">
                        Quem está por trás da Guardiana
                    </h2>

                    <p className="mt-5 text-white text-lg md:text-xl max-w-4xl mx-auto leading-relaxed">
                        Conheça as idealizadoras que transformam histórias em
                        experiências que impactam o mundo.
                    </p>
                </div>

                {/* ================================
                   CONTEÚDO PRINCIPAL
                ================================ */}
                <div className="grid lg:grid-cols-[1fr_1.3fr_1fr] gap-10 lg:gap-12 items-center">
                    {/* ================================
                       TEXTO ESQUERDO
                    ================================ */}
                    <div className="text-center lg:text-right">
                        <p className="text-white text-lg md:text-xl leading-relaxed">
                            Co-fundadora da Guardiana, dedicada a dar voz a
                            histórias que inspiram transformação social e
                            cultural.
                        </p>

                        <div className="mt-8 text-[#D4AF37] text-4xl">↝</div>
                    </div>

                    {/* ================================
                       CARDS CENTRAIS
                    ================================ */}
                    <div className="grid sm:grid-cols-2 gap-8">
                        {/* AUTORA 1 */}
                        <div
                            className="
                                group
                                bg-white
                                rounded-xl
                                overflow-hidden
                                shadow-xl
                                text-center
                                transition-all duration-500
                                hover:-translate-y-2
                                hover:shadow-2xl
                            "
                        >
                            <div className="relative w-full h-44 bg-white">
                                <Image
                                    src="/jenifer-brum.png"
                                    alt="Jenifer Brum"
                                    fill
                                    className="object-cover object-top group-hover:scale-105 transition duration-500"
                                />
                            </div>

                            <div className="px-6 py-5">
                                <h3 className="text-lg font-extrabold text-[#18384A] group-hover:text-[#C95F52] transition">
                                    Jenifer Brum
                                </h3>
                            </div>
                        </div>

                        {/* AUTORA 2 */}
                        <div
                            className="
                                group
                                bg-white
                                rounded-xl
                                overflow-hidden
                                shadow-xl
                                text-center
                                transition-all duration-500
                                hover:-translate-y-2
                                hover:shadow-2xl
                            "
                        >
                            <div className="relative w-full h-44 bg-white">
                                <Image
                                    src="/jenny-gonzalez.png"
                                    alt="Jenny Gonzalez"
                                    fill
                                    className="object-cover object-top group-hover:scale-105 transition duration-500"
                                />
                            </div>

                            <div className="px-6 py-5">
                                <h3 className="text-lg font-extrabold text-[#18384A] group-hover:text-[#C95F52] transition">
                                    Jenny Gonzalez
                                </h3>
                            </div>
                        </div>
                    </div>

                    {/* ================================
                       TEXTO DIREITO
                    ================================ */}
                    <div className="text-center lg:text-left">
                        <p className="text-white text-lg md:text-xl leading-relaxed">
                            Co-fundadora da Guardiana, apaixonada por conectar
                            pessoas através da escrita e fortalecer narrativas
                            que transformam realidades.
                        </p>

                        <div className="mt-8 text-[#D4AF37] text-4xl">↜</div>
                    </div>
                </div>
            </div>
        </section>
    );
}
