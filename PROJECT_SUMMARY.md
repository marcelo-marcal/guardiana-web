# PROJECT_SUMMARY.md

## Projeto
Guardiana Web — SaaS editorial com site institucional, painel administrativo e futura área de e-commerce para venda de livros e ebooks.

## Stack
- Next.js 15
- React
- TypeScript
- Tailwind CSS
- App Router
- Light/Dark mode
- Persistência mock via localStorage neste estágio

## Estrutura principal
- src/app/(public): site público
- src/app/(auth): login
- src/app/(dashboard): painel administrativo
- src/components/layout: Header e Footer
- src/components/sections: seções da Home
- src/data: mocks iniciais
- src/services: serviços simulando API
- src/hooks: autenticação mock

## Estado atual
O site público possui:
- Hero
- Sobre
- Livros
- Publicações
- Autores
- Contato
- Footer

O SaaS/Admin já possui:
- Login mock
- Sessão via localStorage
- Dashboard
- Edição de alguns conteúdos do site
- Estrutura inicial para edição de Sobre, Livros e Publicações

## Regra de negócio futura
O sistema terá três níveis principais de acesso:

### Cliente
- Criar conta
- Fazer login
- Comprar livros físicos
- Comprar ebooks
- Acessar histórico de compras
- Baixar ebooks comprados

### Admin
- Editar textos do site
- Editar imagens
- Cadastrar livros
- Cadastrar ebooks
- Gerenciar publicações
- Gerenciar conteúdo institucional

### SuperAdmin
- Gerenciar admins
- Gerenciar clientes
- Gerenciar permissões
- Configurar gateway de pagamento
- Ter acesso técnico total ao sistema

## E-commerce futuro
O sistema deverá suportar:
- Cadastro de produtos
- Tipo de produto: livro físico ou ebook
- Preço
- Estoque para livro físico
- Arquivo digital para ebook
- Carrinho
- Checkout
- Gateway de pagamento
- Histórico de pedidos
- Liberação de ebook após pagamento

## Padrões obrigatórios
- Sempre pedir arquivo antes de alterar
- Sempre devolver arquivo completo
- Manter comentários existentes
- Comentar novos blocos importantes
- Preservar Light/Dark
- Preservar responsividade
- Evitar arquivos desnecessários
- Refatorar com segurança