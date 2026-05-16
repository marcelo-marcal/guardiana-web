"use client";

// ================================
// IMPORTS
// ================================
import Image from "next/image";

// ================================
// DADOS DA EQUIPE
// ================================
const equipe = [
    {
        id: 1,
        nome: "Jenny González",
        cargo: "Fundadora & Diretora Editorial",
        imagem: "/jenny-gonzalez02.png",
    },
    {
        id: 2,
        nome: "Jênifer De Brum",
        cargo: "Fundadora",
        imagem: "/jenifer-brum.png",
    },
    {
        id: 3,
        nome: "Sandra Salcedo",
        cargo: "Curadora - Produtora Editorial",
        imagem: "/sandra-salcedo.png",
    },
];

// ================================
// COMPONENTE AUTORES / FUNDADORAS
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
                        Conheça as idealizadoras e a curadoria editorial que
                        transformam histórias em experiências que impactam o
                        mundo.
                    </p>
                </div>

                {/* ================================
                   CONTEÚDO PRINCIPAL
                ================================ */}
                <div className="grid lg:grid-cols-[0.8fr_1.8fr_0.8fr] gap-10 lg:gap-12 items-center">
                    {/* ================================
                       TEXTO ESQUERDO
                    ================================ */}
                    <div className="text-center lg:text-right">
                        <p className="text-white text-lg md:text-xl leading-relaxed">
                            Uma equipe dedicada a acolher ideias, cuidar das
                            palavras e transformar manuscritos em obras com
                            identidade editorial.
                        </p>

                        <div className="mt-8 text-[#D4AF37] text-4xl">↝</div>
                    </div>

                    {/* ================================
                       CARDS CENTRAIS
                    ================================ */}
                    <div className="grid sm:grid-cols-3 gap-6">
                        {equipe.map((pessoa) => (
                            <div
                                key={pessoa.id}
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
                                {/* IMAGEM */}
                                <div className="relative w-full h-44 bg-white">
                                    <Image
                                        src={pessoa.imagem}
                                        alt={pessoa.nome}
                                        fill
                                        className="object-cover object-top group-hover:scale-105 transition duration-500"
                                    />
                                </div>

                                {/* TEXTO */}
                                <div className="px-5 py-5">
                                    <h3 className="text-lg font-extrabold text-[#18384A] group-hover:text-[#C95F52] transition">
                                        {pessoa.nome}
                                    </h3>

                                    <p className="mt-2 text-sm text-[#344454]">
                                        {pessoa.cargo}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* ================================
                       TEXTO DIREITO
                    ================================ */}
                    <div className="text-center lg:text-left">
                        <p className="text-white text-lg md:text-xl leading-relaxed">
                            Entre escrita, memória, arte e curadoria, a
                            Guardiana constrói pontes entre autores, leitores e
                            novas possibilidades de publicação.
                        </p>

                        <div className="mt-8 text-[#D4AF37] text-4xl">↜</div>
                    </div>
                </div>
            </div>
        </section>
    );
}
