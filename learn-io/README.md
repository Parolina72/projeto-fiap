# Learn IO

Projeto frontend em Next.js que serve como painel acadêmico para visualização de posts, busca de conteúdo e cadastro de usuários.

## Visão Geral

- Framework: **Next.js 16.2.4**
- Linguagens: **TypeScript**, **React 19**, **Tailwind CSS 4**
- Tema: alternância entre modo claro e escuro com `next-themes`
- Dados de exemplo: posts estáticos em `src/shared/data/posts.ts`
- Integração backend: criação de usuário/pessoa via API REST em `src/shared/data/api.ts`

## Setup Inicial

### Requisitos

- Node.js 20+ recomendado
- npm, yarn ou pnpm
- API backend local ou variável de ambiente configurada

### Instalação

```bash
cd learn-io/learn-io/learn-io
npm install
```

> Se você usar `yarn` ou `pnpm`, substitua `npm install` por `yarn` ou `pnpm install`.

### Variáveis de Ambiente

O frontend consome a API através de `NEXT_PUBLIC_API_URL`.

Exemplo no terminal:

```bash
export NEXT_PUBLIC_API_URL="http://localhost:3001"
```

Se a variável não estiver definida, o valor padrão será `http://localhost:3001`.

### Executando em Desenvolvimento

```bash
npm run dev
```

Abra `http://localhost:3000` no navegador.

### Build de Produção

```bash
npm run build
npm run start
```

## Estrutura da Aplicação

A aplicação está organizada principalmente em `src/app`, `src/pages` e `src/shared`.

### `src/app`

- `layout.tsx` — layout global que envolve a aplicação com `<Header />`, `<Footer />` e `<ThemeProvider />`.
- `page.tsx` — página inicial com lista de posts, busca e navegação para detalhes.
- Rotas de formulário `create-usuario/informacoes-basicas` e `create-usuario/informacoes-acesso`.
- `posts/[id]/PostDetailPage.tsx` — rota dinâmica para exibir detalhes de cada post.

### `src/pages`

Contém componentes de página reutilizáveis para o fluxo de cadastro de usuário:

- `CreateUsuarioInformacoesBasicas.tsx`
- `CreateUsuarioInformacoesAcesso.tsx`

Esses componentes são usados pelas páginas do App Router em `src/app/create-usuario/...`.

### `src/shared`

Pasta central para componentes, dados e utilitários compartilhados:

- `components/` — componentes visuais reutilizáveis
  - `header/Header.tsx` — navegação principal e botão de login falso em `localStorage`
  - `footer/` — rodapé global
  - `detail-post/DetailPost.tsx` — exibição de post detalhado
  - `theme-provider/ThemeProvider.tsx` — provider de tema com `next-themes`
  - `theme-toggle/ThemeToggle.tsx` — botão para alternar entre claro/escuro
- `data/` — dados e integração com backend
  - `posts.ts` — lista de posts de exemplo em memória
  - `api.ts` — funções `createUser` e `createPerson`

### Estilos

- `src/app/globals.css` — estilos globais e configurações de tema.
- Tailwind CSS é configurado com `@import "tailwindcss"` no `globals.css`.

### Configurações

- `next.config.ts` — configuração padrão do Next.js
- `tsconfig.json` — configurações do TypeScript
- `eslint.config.mjs` — linting com ESLint e `eslint-config-next`
- `postcss.config.mjs` — plugin PostCSS para Tailwind

## Fluxo de Uso

### Página Inicial

A home exibe o mural de posts com busca por título, autor ou corpo do texto. Ao clicar em um post, o usuário é levado para `/posts/[id]`.

### Busca

A busca é feita localmente no frontend usando o parâmetro `q` da query string.

### Detalhe do Post

A rota dinâmica `src/app/posts/[id]/PostDetailPage.tsx` carrega o post pelo `id` e mostra título, autor, data de atualização e corpo.

### Cadastro de Usuário

O fluxo de cadastro divide-se em duas etapas:

1. `/create-usuario/informacoes-basicas`
   - Nome completo
   - CPF com máscara
   - Data de nascimento
   - Email
2. `/create-usuario/informacoes-acesso`
   - Usuário
   - Senha

Após salvar, a aplicação chama a API configurada em `NEXT_PUBLIC_API_URL` para criar o usuário e a pessoa associada.

## Dependências Principais

- `next` — framework React para SSR e App Router
- `react`, `react-dom` — UI
- `typescript` — tipagem estática
- `tailwindcss` — utilitários de estilo
- `next-themes` — tema claro/escuro
- `react-imask` — máscara de CPF
- `@heroicons/react` — ícones usados na interface

## Observações Técnicas

- O botão de login em `Header.tsx` apenas simula autenticação com `localStorage`.
- A rota `posts/[id]/edit` existe apenas como link de interface; o formulário de edição não está implementado nesta versão.
- O backend é esperado em `http://localhost:3001` ou via `NEXT_PUBLIC_API_URL`.
