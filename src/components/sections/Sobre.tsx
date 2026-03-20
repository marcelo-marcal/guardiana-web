"use client";

// ================================
// Import de imagem otimizada do Next
// ================================
import Image from "next/image";

export default function Sobre() {
    return (
        // ID + scroll offset para header fixo
        <section
            id="sobre"
            className="w-full py-24 px-6 bg-white dark:bg-[#020617] transition-colors scroll-mt-24"
        >
            {/* ================================
               CONTAINER
            ================================= */}
            <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
                {/* ================================
                   LADO ESQUERDO (TEXTO)
                ================================= */}
                <div className="opacity-0 translate-y-6 animate-fadeIn">
                    {/* Label */}
                    <span className="text-sm uppercase tracking-widest text-[#D4AF37]">
                        Sobre nós
                    </span>

                    {/* Título */}
                    <h2 className="mt-4 text-3xl md:text-4xl font-bold text-gray-900 dark:text-white leading-snug">
                        Uma editora que protege, amplifica e transforma vozes
                    </h2>

                    {/* Texto */}
                    <p className="mt-6 text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                        A Guardiana nasceu com o propósito de dar espaço a
                        histórias que precisam ser contadas. Trabalhamos com
                        autoras e autores que desejam impactar o mundo através
                        da escrita, oferecendo suporte editorial, visibilidade e
                        cuidado em cada publicação.
                    </p>

                    <p className="mt-4 text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                        Mais do que publicar livros, construímos pontes entre
                        ideias e pessoas, fortalecendo narrativas que inspiram
                        transformação social, cultural e pessoal.
                    </p>
                </div>

                {/* ================================
                   LADO DIREITO (FUNDADORAS)
                ================================= */}
                <div className="grid sm:grid-cols-2 gap-8">
                    {/* ================================
                       CARD - JENIFER
                    ================================= */}
                    <div className="group text-center opacity-0 translate-y-6 animate-fadeIn">
                        {/* IMAGEM */}
                        <div className="relative w-full h-[260px] rounded-2xl overflow-hidden border border-[#D4AF37]/20">
                            <Image
                                src="/jenifer-brum.png"
                                alt="Jenifer Brum"
                                fill
                                className="object-cover group-hover:scale-105 transition duration-500"
                            />
                        </div>

                        {/* NOME */}
                        <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                            Jenifer Brum
                        </h3>

                        {/* CARGO */}
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Fundadora & Diretora Editorial
                        </p>
                    </div>

                    {/* ================================
                       CARD - JENNY
                    ================================= */}
                    <div className="group text-center opacity-0 translate-y-6 animate-fadeIn">
                        {/* IMAGEM */}
                        <div className="relative w-full h-[260px] rounded-2xl overflow-hidden border border-[#D4AF37]/20">
                            <Image
                                src="/jenny-gonzalez.png"
                                alt="Jenny Gonzalez"
                                fill
                                className="object-cover group-hover:scale-105 transition duration-500"
                            />
                        </div>

                        {/* NOME */}
                        <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                            Jenny Gonzalez
                        </h3>

                        {/* CARGO */}
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Fundadora & Diretora Editorial
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
