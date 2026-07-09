// ================================
// IMPORTS
// ================================
import Image from "next/image";
import Link from "next/link";

// ================================
// CONFIGURAÇÃO
// ================================
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3333";

// ================================
// TIPAGENS
// ================================
type Founder = {
    id: string;
    name: string;
    role: string;
    description: string;
    imageUrl: string | null;
    position: string;
};

// ================================
// PÁGINA: FUNDADORAS
// ================================
export default async function Fundadoras() {
    let founders: Founder[] = [];

    try {
        const response = await fetch(`${API_URL}/founders`, {
            cache: "no-store",
        });
        const data = await response.json();
        if (data.success) {
            founders = data.founders;
        }
    } catch (error) {
        console.error("Erro ao carregar fundadoras:", error);
    }

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
                        Assessorias
                    </h1>
                </div>
            </section>

            {/* ================================
                BLOCOS DE FUNDADORAS
            ================================ */}
            <section className="px-6 pb-24">
                <div className="max-w-7xl mx-auto space-y-24">
                    {founders.length === 0 ? (
                        <p className="text-center text-gray-500">Em breve, mais informações sobre nossas fundadoras.</p>
                    ) : founders.map((bloco, index) => {
                        return (
                            <div
                                key={bloco.id}
                                className={`grid lg:grid-cols-2 gap-12 lg:gap-20 items-center ${
                                    index % 2 !== 0 ? "lg:flex-row-reverse" : ""
                                }`}
                            >
                                {/* ================================
                                    TEXTO DAS FUNDADORAS
                                ================================ */}
                                <div className={index % 2 !== 0 ? "lg:order-2" : "lg:order-1"}>
                                    <article
                                        className="
                                            group
                                            rounded-2xl
                                            bg-white dark:bg-[#0F1720]
                                            border border-gray-200 dark:border-white/10
                                            p-8
                                            shadow-md
                                            hover:-translate-y-1
                                            hover:shadow-xl
                                            transition-all duration-500
                                        "
                                    >
                                        <h2 className="text-2xl text-center md:text-3xl font-extrabold text-[#18384A] dark:text-white">
                                            {bloco.name}
                                        </h2>
                                        <p className="text-[#C95F52] text-center font-bold text-sm uppercase mb-4">{bloco.role}</p>
                                        <p
                                            style={{
                                                whiteSpace: "pre-line",
                                            }}
                                            className="mt-3 text-center text-[#344454] dark:text-gray-300 text-base md:text-lg leading-relaxed italic"
                                        >
                                            &quot;{bloco.description}&quot;
                                        </p>
                                    </article>
                                </div>

                                {/* ================================
                                    IMAGEM DA FUNDADORA
                                ================================ */}
                                <div className={`mt-10 ${index % 2 !== 0 ? "lg:order-1" : "lg:order-2"}`}>
                                    <div
                                        className="
                                            group
                                            relative
                                            w-full
                                            h-[400px] md:h-[600px]
                                            rounded-3xl
                                            overflow-hidden
                                            shadow-xl
                                            border border-gray-200 dark:border-white/10
                                            hover:-translate-y-2
                                            hover:shadow-2xl
                                            transition-all duration-500
                                        "
                                    >
                                        {bloco.imageUrl ? (
                                            <Image
                                                src={bloco.imageUrl}
                                                alt={bloco.name}
                                                fill
                                                className={`object-cover ${bloco.position} group-hover:scale-105 transition duration-700`}
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">Sem imagem</div>
                                        )}
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
