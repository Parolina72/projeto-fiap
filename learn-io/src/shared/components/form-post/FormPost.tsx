import { useEffect, useState } from "react";
import { posts, type Post } from "@/shared/data/posts";

type FormPostProps = {
  post?: Post;
};

export function FormPost({ post }: FormPostProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [title, setTitle] = useState(post?.title ?? "");
  const [author, setAuthor] = useState(post?.author ?? "");
  const [body, setBody] = useState(post?.body ?? "");

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setAuthor(post.author);
      setBody(post.body);
    }
  }, [post]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedTitle = title.trim();
    const trimmedAuthor = author.trim();
    const trimmedBody = body.trim();

    if (!trimmedTitle || !trimmedAuthor || !trimmedBody) {
      setMessage(`Preencha todos os campos para ${post ? "atualizar" : "criar"} o post.`);
      return;
    }

    if (post) {
      const index = posts.findIndex((item) => item.id === post.id);

      if (index !== -1) {
        posts[index] = {
          id: post.id,
          title: trimmedTitle,
          author: trimmedAuthor,
          body: trimmedBody,
        };
        setMessage("Post atualizado com sucesso!");
        return;
      }

      setMessage("Não foi possível encontrar o post para atualização.");
      return;
    }

    const nextId = posts.length > 0 ? Math.max(...posts.map((item) => item.id)) + 1 : 1;

    posts.push({
      id: nextId,
      title: trimmedTitle,
      author: trimmedAuthor,
      body: trimmedBody,
    });

    setTitle("");
    setAuthor("");
    setBody("");
    setMessage("Post criado com sucesso!");
  }

  const formTitle = post ? "Editar post" : "Criar novo post";
  const buttonLabel = post ? "Salvar alterações" : "Criar Post";

  return (
    <div className="rounded-lg border border-zinc-200 bg-white px-6 py-8 shadow-sm">
      <header className="mb-5">
        <h1 className="m-0 text-center text-3xl font-semibold text-zinc-900 sm:text-4xl">
          {formTitle}
        </h1>
      </header>

      {message && (
        <div className="mb-5 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-zinc-700">
            Título
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 sm:text-sm"
            placeholder="Digite o título do post"
          />
        </div>

        <div>
          <label htmlFor="author" className="block text-sm font-medium text-zinc-700">
            Autor
          </label>
          <input
            type="text"
            id="author"
            name="author"
            value={author}
            onChange={(event) => setAuthor(event.target.value)}
            className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 sm:text-sm"
            placeholder="Digite o nome do autor"
          />
        </div>

        <div>
          <label htmlFor="body" className="block text-sm font-medium text-zinc-700">
            Conteúdo
          </label>
          <textarea
            id="body"
            name="body"
            rows={6}
            value={body}
            onChange={(event) => setBody(event.target.value)}
            className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 sm:text-sm"
            placeholder="Digite o conteúdo do post"
          />
        </div>

        <button
          type="submit"
          className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {buttonLabel}
        </button>
      </form>
    </div>
  );
}
