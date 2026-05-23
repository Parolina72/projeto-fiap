export type Post = {
  id: number;
  title: string;
  author: string;
  body: string;
};

export const posts: Post[] = [
  {
    id: 1,
    title: "Introdução ao React - Atualizado",
    author: "Ana Souza",
    body: "Entenda componentes, props e estado para criar interfaces modernas.",
  },
  {
    id: 2,
    title: "TypeScript no Front-end",
    author: "Carlos Lima",
    body: "Veja como tipagem estática ajuda a reduzir erros em projetos reais.",
  },
  {
    id: 3,
    title: "Boas praticas com Next.js",
    author: "Marina Alves",
    body: "Aprenda organização de rotas, layouts e componentes no App Router.",
  },
  {
    id: 4,
    title: "Acessibilidade na Web",
    author: "João Pedro",
    body: "Melhore experiencia com ARIA labels, contraste e navegação por teclado.",
  },
  {
    id: 5,
    title: "CSS moderno com utilitários",
    author: "Fernanda Reis",
    body: "Use classes utilitárias para acelerar o desenvolvimento da interface.",
  },
  {
    id: 6,
    title: "Consumo de APIs no JavaScript",
    author: "Bruno Melo",
    body: "Domine fetch, tratamento de erros e boas praticas de requisições HTTP.",
  },
  {
    id: 7,
    title: "Princípios de UX para devs",
    author: "Juliana Costa",
    body: "Estruture fluxos simples, intuitivos e focados nas necessidades do usuário.",
  },
  {
    id: 8,
    title: "Git e GitHub para times",
    author: "Rafael Nunes",
    body: "Aplique branchs de feature, pull requests e revisão para colaboração.",
  },
  {
    id: 9,
    title: "Testes automatizados na pratica",
    author: "Patricia Gomes",
    body: "Conheça testes unitários e de integração para aumentar confiança no código.",
  },
  {
    id: 10,
    title: "Deploy de apps web",
    author: "Lucas Rocha",
    body: "Publique projetos com segurança, performance e monitoramento continuo.",
  },
  {
    id: 11,
    title: "teste",
    author: "teste",
    body: "teste",
  }
];
