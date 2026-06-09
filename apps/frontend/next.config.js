/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // Desativar a otimização de imagens é obrigatório para exportação estática
  images: {
    unoptimized: true,
  },
  // Se você precisa carregar imagens, evite usar localhosts
  // O Next.js export não consegue validar hostnames durante o build
};

module.exports = nextConfig;