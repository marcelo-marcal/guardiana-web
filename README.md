<h1 align="center">
    <img src="./public/logo.svg" style="width: 30%;" />
</h1>

# guardiana-web
Guardiana Editora



This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


Estrutura de Pasta e Arquivos (Profissional e Escalável)

Light / Dark

```bash
guardiana-web
├── .next
├── node_modules
├── public/
│   ├── logo.svg
│   ├── jenifer-brum.png
│   └── jenny-gonzalez.png
│
├── src/
│   ├── app/
│   │   ├── (public)/               # SITE
│   │   │   ├── page.tsx            # HOME (landing)
│   │   │
│   │   │   ├── autores/
│   │   │   │   └── page.tsx
│   │   │
│   │   │   ├── publicacoes/
│   │   │   │   └── page.tsx
│   │   │
│   │   │   ├── sobre/
│   │   │   │   └── page.tsx
│   │   │
│   │   │   └── contato/
│   │   │       └── page.tsx
│   │   │
│   │   ├── (auth)/                 # LOGIN (futuro)
│   │   │   └── login/
│   │   │       └── page.tsx
│   │   │
│   │   ├── (dashboard)/            # ADMIN (futuro)
│   │   │   └── dashboard/
│   │   │       └── page.tsx
│   │   │
│   │   ├── layout.tsx              # layout global
│   │   └── globals.css
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   └── Footer.tsx
│   │   │
│   │   ├── sections/               # HOME
│   │   │   ├── Hero.tsx
│   │   │   ├── Livro.tsx
│   │   │   ├── Sobre.tsx
│   │   │   ├── Publicacoes.tsx
│   │   │   ├── Autores.tsx         # NOVO (home preview)
│   │   │   └── Contato.tsx         # NOVO (home preview)
│   │   │
│   │   ├── ui/
│   │   │   └── PublicacaoCard.tsx
│   │   │
│   │   └── shared/
│   │       ├── Button.tsx
│   │       └── Container.tsx
│   │
│   ├── data/                       # MOCK (simula API)
│   │   ├── publicacoes.ts
│   │   ├── autores.ts              # NOVO
│   │   └── conteudo.ts             # NOVO (textos editáveis)
│   │
│   ├── services/                   # SIMULA API
│   │   ├── publicacoes.service.ts
│   │   ├── autores.service.ts
│   │   └── conteudo.service.ts
│   │
│   ├── types/
│   │   ├── publicacao.ts
│   │   ├── autor.ts
│   │   └── conteudo.ts
│   │
│   ├── hooks/
│   │   └── useAuth.ts
│   │
│   ├── lib/
│   │   └── utils.ts
│   │
│   └── service/
│       └── conteudo.service.ts
│
├── .editorconfig
├── .gitignore
├── eslint.config.js
├── next-env.d.ts
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.js
├── postcss.config.mjs
├── README.md
├── tailwind.config.js
└── tsconfig.json
```

## LOGIN

✔ Login: admin@guardiana.com
✔ Senha: 123456



## COMANDOS GitHub
main    -   Branch principal, código em produção
staging -   Branch de homologação ou pré-produção.
develop -   Branch de desenvolvimento

### Atualizar a Branch:
git pull origin develop

git checkout develop   --> Troca de branch

git merge develop

npm install

### Subir Projeto:
git add .

git commit -m "DESCRIÇÃO :construction:" 

git push origin develop



