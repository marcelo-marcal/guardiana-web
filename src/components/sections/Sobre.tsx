"use client";

export default function Sobre() {
    return (
        // 🔥 ID + scroll offset para header fixo
        <section
            id="sobre"
            className="w-full py-24 px-6 bg-white dark:bg-[#020617] transition-colors scroll-mt-24"
        >
            {/* Container central */}
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                {/* Lado esquerdo (texto) */}
                <div>
                    <span className="text-sm uppercase tracking-widest text-[#D4AF37]">
                        Sobre nós
                    </span>

                    <h2 className="mt-4 text-3xl md:text-4xl font-bold text-gray-900 dark:text-white leading-snug">
                        Uma editora que protege, amplifica e transforma vozes
                    </h2>

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

                {/* Lado direito */}
                <div className="relative">
                    <div className="w-full h-[400px] rounded-2xl bg-gradient-to-br from-[#D4AF37]/20 to-transparent border border-[#D4AF37]/20 flex items-center justify-center">
                        <span className="text-[#D4AF37] text-sm">
                            Imagem institucional
                        </span>
                    </div>

                    <div className="absolute -inset-4 bg-[#D4AF37]/10 blur-3xl -z-10" />
                </div>
            </div>
        </section>
    );
}
