// ================================
// IMPORTS
// ================================
import Image from "next/image";
import Link from "next/link";
import { conteudoInicial } from "@/data/sobre";

// ================================
// DADOS DA EQUIPE
// ================================
const equipe = [
    {
        id: 1,
        nome: "Jenny González",
        cargo: "Fundadora & Diretora Editorial",
        imagem: "/jenny-gonzalez02.png",
        descricao:
            "Mulher várias vezes migrante. Formada em Artes. Editora com mais de 30 anos de experiência. Sua trajetória é construída entre palavras, autores e histórias que atravessam gerações. Artista visual. Escritora. Tradutora. Promotora cultural. Professora. Com uma sensibilidade estética que complementa seu olhar editorial unindo técnica e criatividade, transita entre o rigor do texto e a liberdade da imagem.",
    },
    {
        id: 2,
        nome: "Jênifer De Brum",
        cargo: "Fundadora",
        imagem: "/jenifer-brum.png",
        descricao:
            "Historiadora por formação, dedica-se a pesquisar e resgatar memórias de pessoas em toda a sua diversidade cultural. Encontra na palavra escrita uma forma de preservar histórias e ampliar vozes. Apaixonada pela leitura, vê nos livros pontes entre tempos, experiências e identidades. Seu trabalho une sensibilidade, escuta e compromisso.",
    },
    {
        id: 3,
        nome: "Sandra Salcedo",
        cargo: "Curadora - Produtora Editorial",
        imagem: "/sandra-salcedo.png",
        descricao:
            "Formada em Ciências Políticas. Apaixonada por livros e leituras, dedica-se a transformar ideias em obras que inspiram e informam. Seu olhar atento e curadoria cuidadosa refletem o compromisso com o conhecimento e a qualidade. Entre páginas e projetos, constrói pontes entre autores e leitores.",
    },
];

// ================================
// PÁGINA: GUARDIANA
// ================================
export default function GuardianaPage() {
    return (
        <main className="bg-[#F7F7F7] dark:bg-[#020617] transition-colors">
            {/* ================================
                HERO VISUAL DA PÁGINA
            ================================ */}
            <section className="w-full bg-white dark:bg-[#020617] px-6 pt-14 pb-8">
                <div className="max-w-7xl mx-auto">
                    <div className="relative w-full h-[300px] md:h-[430px]">
                        <Image
                            src="/hero-guardiana.png"
                            alt="Guardiana Editora"
                            fill
                            priority
                            className="object-contain"
                        />
                    </div>
                </div>
            </section>

            {/* ================================
                FAIXA DE TÍTULO
            ================================ */}
            <section className="bg-[#18384A] dark:bg-[#0F1720] px-6 py-10">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white">
                        Guardiana
                    </h1>
                </div>
            </section>

            {/* ================================
                BLOCO INSTITUCIONAL
                - Inspirado na referência
                - Com faixa clara inclinada
            ================================ */}
            <section className="relative overflow-hidden px-6 py-24">
                {/* FAIXA CLARA INCLINADA */}
                <div
                    className="
                        absolute inset-x-0 top-0
                        h-full
                        bg-[#EFE9DD] dark:bg-[#0F1720]
                        [clip-path:polygon(0_0,100%_0,100%_86%,0_100%)]
                    "
                />

                <div className="relative z-10 max-w-7xl mx-auto grid lg:grid-cols-[1.15fr_0.85fr] gap-14 items-center">
                    {/* TEXTO */}
                    <div>
                        <span className="text-sm uppercase tracking-[0.35em] text-[#D4AF37]">
                            Cremos no livro e na leitura como acontecimentos
                        </span>

                        <h2 className="mt-5 text-3xl md:text-5xl font-extrabold text-[#18384A] dark:text-white leading-tight">
                            {conteudoInicial.sobre.titulo}
                        </h2>

                        <p className="mt-8 text-[#344454] dark:text-gray-300 text-lg leading-relaxed max-w-3xl">
                            {conteudoInicial.sobre.subtitulo}
                        </p>

                        <div className="mt-10 space-y-5 text-[#344454] dark:text-gray-300 text-lg leading-relaxed">
                            <p>
                                Criamos uma editora cuidadosa, voltada para
                                livros que carregam memória, sensibilidade,
                                identidade e transformação.
                            </p>

                            <p>
                                Valorizamos o protagonismo da escrita, o cuidado
                                editorial e o encontro entre autoras, autores,
                                leitoras e leitores.
                            </p>

                            <p>
                                Procuramos construir publicações com identidade
                                própria, acabamento profissional e respeito à
                                voz de cada obra.
                            </p>
                        </div>
                    </div>

                    {/* LOGO */}
                    <div className="flex justify-center">
                        <div className="relative w-72 h-72 md:w-96 md:h-96">
                            <Image
                                src="/logo-grande.png"
                                alt="Logo Guardiana Editora"
                                fill
                                className="object-contain"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* ================================
                BLOCO SOBRE SERVIÇOS
            ================================ */}
            <section className="px-6 py-20 bg-white dark:bg-[#020617]">
                <div className="max-w-7xl mx-auto">
                    <div className="max-w-5xl space-y-7 text-[#344454] dark:text-gray-300 text-lg leading-relaxed">
                        <p>
                            <strong className="text-[#18384A] dark:text-white">
                                Também oferecemos serviços editoriais.
                            </strong>{" "}
                            Dedicamo-nos à curadoria editorial em suas possíveis
                            fases, desde o processo de criação do texto escrito
                            até o desenvolvimento de formatos complementares que
                            fazem de cada livro uma experiência completa.
                        </p>

                        <p>
                            Entendemos que as publicações não acabam no livro:
                            elas criam encontros, interpretações e novas rotas
                            entre histórias e seus potenciais leitores.
                        </p>

                        <p>
                            Trabalhamos com uma equipe sensível, técnica e
                            especializada em diferentes áreas do circuito
                            editorial.
                        </p>
                    </div>
                </div>
            </section>

            {/* ================================
                EQUIPE / GUARDIÃS
            ================================ */}
            <section className="relative overflow-hidden px-6 py-24">
                {/* FAIXA DE FUNDO INCLINADA */}
                <div
                    className="
                        absolute inset-x-0 top-0
                        h-full
                        bg-[#EFE9DD] dark:bg-[#0F1720]
                        [clip-path:polygon(0_8%,100%_0,100%_100%,0_92%)]
                    "
                />

                <div className="relative z-10 max-w-7xl mx-auto">
                    {/* CABEÇALHO */}
                    <div className="mb-16">
                        <span className="text-2xl text-[#18384A] dark:text-white">
                            Equipe Editorial
                        </span>

                        <h2 className="mt-4 text-3xl md:text-4xl font-extrabold text-[#D4AF37]">
                            Quem está por trás da Guardiana
                        </h2>
                    </div>

                    {/* CARDS */}
                    <div className="grid md:grid-cols-3 gap-8">
                        {equipe.map((pessoa) => (
                            <article
                                key={pessoa.id}
                                className="
                                    group
                                    bg-white dark:bg-[#020617]
                                    border border-gray-200 dark:border-white/10
                                    rounded-2xl
                                    overflow-hidden
                                    shadow-xl
                                    hover:-translate-y-2
                                    hover:shadow-2xl
                                    transition-all duration-500
                                "
                            >
                                {/* IMAGEM */}
                                <div className="relative w-full h-80 bg-white overflow-hidden">
                                    <Image
                                        src={pessoa.imagem}
                                        alt={pessoa.nome}
                                        fill
                                        className="object-cover object-top group-hover:scale-105 transition duration-700"
                                    />
                                </div>

                                {/* TEXTO */}
                                <div className="p-7">
                                    <h3 className="text-xl font-extrabold text-[#18384A] dark:text-white group-hover:text-[#C95F52] dark:group-hover:text-[#D4AF37] transition">
                                        {pessoa.nome}
                                    </h3>

                                    <p className="mt-2 text-sm font-semibold text-[#C95F52] dark:text-[#D4AF37]">
                                        {pessoa.cargo}
                                    </p>

                                    <p className="mt-5 text-[#344454] dark:text-gray-300 leading-relaxed">
                                        {pessoa.descricao}
                                    </p>
                                </div>
                            </article>
                        ))}
                    </div>
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
