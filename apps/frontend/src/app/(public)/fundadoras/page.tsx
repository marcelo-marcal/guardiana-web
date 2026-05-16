// ================================
// IMPORTS
// ================================
import Image from "next/image";
import Link from "next/link";

// ================================
// DADOS DAS FUNDADORAS
// ================================
const fundadoras = [
    {
        id: 1,
        imagem: "/jenny-gonzalez02.png",
        autor: "Jenny González",
        descricao: `Mulher várias vezes migrante. Formada em Artes.
                    Editora com mais de 30 anos de experiência. Sua
                    trajetória é construída entre palavras, autores e
                    histórias que atravessam gerações. Artista visual.
                    Escritora. Tradutora. Promotora cultural. Professora.
                    Com uma sensibilidade estética que complementa
                    seu olhar editorial unindo técnica e criatividade,
                    transita entre o rigor do texto e a liberdade da
                    imagem.`,
    },
    {
        id: 2,
        imagem: "/jenifer-brum.png",
        autor: "Jênifer De Brum",
        descricao: `Historiadora por formação, dedica-se a pesquisar e
                    resgatar memórias de pessoas em toda a sua
                    diversidade cultural. Encontra na palavra escrita
                    uma forma de preservar histórias e ampliar vozes.
                    Apaixonada pela leitura, vê nos livros pontes entre
                    tempos, experiências e identidades. Seu trabalho
                    une sensibilidade, escuta e compromisso.`,
    },
    {
        id: 3,
        imagem: "/sandra-salcedo.png",
        autor: "Sandra Salcedo",
        descricao: `Formada em Ciências Políticas. Apaixonada por
                    livros e leituras, dedica-se a transformar ideias em
                    obras que inspiram e informam. Seu olhar atento e
                    curadoria cuidadosa refletem o compromisso com o
                    conhecimento e a qualidade. Entre páginas e
                    projetos, constrói pontes entre autores e leitores.`,
    },
];

// ================================
// PÁGINA: FUNDADORAS
// ================================
export default function Fundadoras() {
    return (
        <main className="bg-[#F7F7F7] dark:bg-[#020617] transition-colors">
            {/* ================================
                HERO DA PÁGINA
            ================================ */}
            <section className="px-6 py-20">
                <div className="max-w-7xl mx-auto text-center">
                    <span className="text-sm uppercase tracking-widest text-[#D4AF37]">
                        Guardiana Editora
                    </span>
                    <h1 className="mt-4 text-4xl md:text-6xl font-extrabold text-[#18384A] dark:text-white leading-tight">
                        Fundadoras
                    </h1>
                </div>
            </section>

            {/* ================================
                BLOCOS DE FUNDADORAS
            ================================ */}
            <section className="px-6 pb-24">
                <div className="max-w-7xl mx-auto space-y-24">
                    {fundadoras.map((bloco) => {
                        return (
                            <div
                                key={bloco.id}
                                className={`grid lg:grid-cols-2 gap-12 lg:gap-20 items-center`}
                            >
                                {/* ================================
                                    TEXTO DAS FUNDADORAS
                                ================================ */}
                                <div className="space-y-8">
                                    <div className="space-y-7">
                                        <article
                                            key={bloco.autor}
                                            className="
                                                group
                                                rounded-2xl
                                                bg-white dark:bg-[#0F1720]
                                                border border-gray-200 dark:border-white/10
                                                p-6
                                                shadow-md
                                                hover:-translate-y-1
                                                hover:shadow-xl
                                                transition-all duration-500
                                            "
                                        >
                                            <h2 className="text-2xl text-center md:text-3xl font-extrabold text-[#18384A] dark:text-white">
                                                {bloco.autor}
                                            </h2>
                                            <p
                                                style={{
                                                    whiteSpace: "pre-line",
                                                }}
                                                className="mt-3 md:h-[300px] text-center text-[#344454] dark:text-gray-300 text-base md:text-lg leading-relaxed"
                                            >
                                                {bloco.descricao}
                                            </p>
                                        </article>
                                    </div>
                                </div>

                                {/* ================================
                                    IMAGEM DA FUNDADORA
                                ================================ */}
                                <div className="mt-10">
                                    <div
                                        className="
                                            group
                                            relative
                                            w-full
                                            h-[200px] md:h-[800px]
                                            rounded-3xl
                                            overflow-hidden
                                            shadow-xl
                                            border border-gray-200 dark:border-white/10
                                            hover:-translate-y-2
                                            hover:shadow-2xl
                                            transition-all duration-500
                                        "
                                    >
                                        <Image
                                            src={bloco.imagem}
                                            alt="Serviços Editoriais Guardiana"
                                            fill
                                            className="object-cover group-hover:scale-105 transition duration-700"
                                            priority={bloco.id === 1}
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* ================================
                CTA FINAL
                - mt-auto mantém a faixa colada embaixo
            ================================ */}
            <section className="mt-auto relative overflow-hidden px-6 py-20 bg-[#C95F52] dark:bg-[#7E342D]">
                <div className="max-w-7xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-white">
                        Tem uma história para publicar?
                    </h2>

                    <p className="mt-5 text-white text-lg max-w-3xl mx-auto leading-relaxed">
                        Entre em contato com a Guardiana e converse conosco
                        sobre sua ideia, seu livro ou seu projeto editorial.
                    </p>

                    <Link
                        href="/contato"
                        className="
                            inline-flex
                            mt-8
                            px-8 py-3
                            rounded-full
                            border border-white
                            text-white
                            font-bold
                            hover:bg-white
                            hover:text-[#C95F52]
                            transition-all duration-300
                        "
                    >
                        Fale conosco →
                    </Link>
                </div>
            </section>
        </main>
    );
}
