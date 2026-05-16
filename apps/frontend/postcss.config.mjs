/** @type {import('postcss-load-config').Config} */
const config = {
    plugins: {
        tailwindcss: {}, // plugin correto do Tailwind v3
        autoprefixer: {}, // compatibilidade entre navegadores
    },
};

export default config;
