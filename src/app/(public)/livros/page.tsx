// ================================
// IMPORTS
// ================================
import Image from "next/image";
import Link from "next/link";

// ================================
// DADOS DOS LIVROS
// ================================
const livros = [
    {
        id: 1,
        imagem: "/livro-emaranhado.jpeg",
        titulo: "Emaranhado",
        autor: "Talles Lisot",
        conteudos: [
            {
                titulo: "Emaranhado",
                descricao: `Emaranhado nasce como um mergulho íntimo na mente do
                        jovem artista brasileiro de Marau, Rio Grande do Sul, Talles
                        Lisot. Neste livro de escritos e poemas, a palavra se torna
                        espelho e labirinto. Um espaço onde dúvidas sobre a vida, a
                        criação e a própria identidade se entrelaçam sem a promessa
                        de respostas fáceis.
                        
                        Livro físico 
                        Ano: 2026
                        ISBN: 978-65-975564-0-3
                        Capa comum
                        108 páginas
                        Preço:
                        Dimensões: 14x21 cm
                        Idioma: Português`,
            },
        ],
    },
];

// ================================
// PÁGINA: LIVROS
// ================================
export default function Livros() {
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
                        Livros
                    </h1>
                </div>
            </section>

            {/* ================================
                BLOCOS DE LIVROS
            ================================ */}
            <section className="px-6 pb-24">
                <div className="max-w-7xl mx-auto space-y-24">
                    {livros.map((bloco, index) => {
                        return (
                            <div
                                key={bloco.id}
                                className={`grid lg:grid-cols-2 gap-12 lg:gap-20 items-center lg:[&>*:first-child]:order-2`}
                            >
                                {/* ================================
                                    TEXTO DOS LIVROS
                                ================================ */}
                                <div className="space-y-8">
                                    <div className="space-y-7">
                                        {bloco.conteudos.map((conteudo) => (
                                            <article
                                                key={conteudo.titulo}
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
                                                <p
                                                    style={{
                                                        whiteSpace: "pre-line",
                                                    }}
                                                    className="mt-3 md:h-[600px] text-[#344454] dark:text-gray-300 text-base md:text-lg leading-relaxed"
                                                >
                                                    {conteudo.descricao}
                                                </p>
                                            </article>
                                        ))}
                                    </div>
                                </div>

                                {/* ================================
                                    IMAGEM DO LIVRO
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
                                    <div className="mt-10">
                                        <h2 className="text-2xl text-center md:text-3xl font-extrabold text-[#18384A] dark:text-white">
                                            {bloco.titulo}
                                        </h2>
                                        <p className="mt-3 text-center text-[#344454] dark:text-gray-300 text-base md:text-lg leading-relaxed">
                                            {bloco.autor}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>
            {/* ================================
                CTA FINAL
            ================================ */}
            <section className="relative overflow-hidden px-6 py-20 bg-[#C95F52] dark:bg-[#7E342D]">
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
