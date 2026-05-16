/** @type {import('tailwindcss').Config} */
export default {
    // ================================
    // Ativa dark mode via classe
    // usamos: <html class="dark">
    // ================================
    darkMode: "class",

    // ================================
    // Caminhos onde o Tailwind lê as classes
    // ================================
    content: ["./src/**/*.{js,ts,jsx,tsx}"],

    // ================================
    // Tema customizado
    // ================================
    theme: {
        extend: {
            // ================================
            // Animação personalizada (fade + subir)
            // ================================
            keyframes: {
                fadeIn: {
                    "0%": {
                        opacity: "0",
                        transform: "translateY(20px)",
                    },
                    "100%": {
                        opacity: "1",
                        transform: "translateY(0)",
                    },
                },
            },

            // ================================
            // Nome da animação
            // ================================
            animation: {
                fadeIn: "fadeIn 0.6s ease forwards",
            },
        },
    },

    // ================================
    // Plugins (nenhum por enquanto)
    // ================================
    plugins: [],
};
