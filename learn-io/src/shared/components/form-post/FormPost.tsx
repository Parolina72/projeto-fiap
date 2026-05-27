"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { type Post } from "@/shared/data/posts";
import { createPost, updatePost as apiUpdatePost, getMyPerson } from "@/shared/data/api";

type FormPostProps = {
  post?: Post;
};

export function FormPost({ post }: FormPostProps) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState(post?.title ?? "");
  const [authorId, setAuthorId] = useState<number | string>(
    (post as any)?.author_id ?? ""
  );
  const [authorName, setAuthorName] = useState<string>((post as any)?.author ?? "");
  const [body, setBody] = useState(post?.body ?? "");
  const [imageUrl, setImageUrl] = useState<string | undefined>((post as any)?.image_url ?? "");

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setAuthorId((post as any)?.author_id ?? "");
      setAuthorName((post as any)?.author ?? "");
      setBody(post.body);
      setImageUrl((post as any)?.image_url ?? "");
    }
  }, [post]);

  useEffect(() => {
    async function loadMyPerson() {
      try {
        // if post exists, prefer its author; otherwise fetch current user's person
        if (post) return
        const person = await getMyPerson()
        if (person) {
          setAuthorId(person.id ?? "")
          setAuthorName(person.name ?? "")
        }
      } catch (err) {
        console.debug('Não foi possível obter Person do usuário autenticado', err)
      }
    }

    loadMyPerson()
  }, [post])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const trimmedTitle = title.trim();
    const trimmedAuthorId = String(authorId).trim();
    const trimmedBody = body.trim();

    if (!trimmedTitle || !trimmedBody || !trimmedAuthorId || !imageUrl) {
      setMessage(`Preencha todos os campos para ${post ? "atualizar" : "criar"} o post.`);
      setIsLoading(false);
      return;
    }

    try {
      if (post) {
        const updated = await apiUpdatePost(Number(post.id), {
          title: trimmedTitle,
          content: trimmedBody,
          image_url: imageUrl,
          author_id: Number(trimmedAuthorId),
        });

        setMessage("Post atualizado com sucesso!");
        setTimeout(() => {
          router.push(`/posts/${updated.id}`);
        }, 1500);
      } else {
        const created = await createPost({
          title: trimmedTitle,
          content: trimmedBody,
          image_url: imageUrl!,
          author_id: Number(trimmedAuthorId),
        });

        setMessage("Post criado com sucesso!");
        setTitle("");
        setAuthorId("");
        setBody("");
        setImageUrl("");
        setTimeout(() => {
          router.push(`/posts/${created.id}`);
        }, 1500);
      }
    } catch (error) {
      console.error("Erro ao salvar post:", error);
      setMessage("Erro ao salvar o post. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
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
          <label htmlFor="authorName" className="block text-sm font-medium text-zinc-700">
            Autor
          </label>
          <input
            type="text"
            id="authorName"
            name="authorName"
            value={authorName}
            disabled
            className="mt-1 block w-full rounded-md border border-zinc-300 bg-zinc-50 px-3 py-2 shadow-sm sm:text-sm"
          />
        </div>

        <input type="hidden" name="author_id" value={String(authorId)} />

        <div>
          <label htmlFor="imageUrl" className="block text-sm font-medium text-zinc-700">
            Imagem (URL)
          </label>
          <input
            type="text"
            id="imageUrl"
            name="imageUrl"
            value={imageUrl ?? ""}
            onChange={(event) => setImageUrl(event.target.value)}
            className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 sm:text-sm"
            placeholder="https://exemplo.com/imagem.jpg"
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
          disabled={isLoading}
          className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Salvando..." : buttonLabel}
        </button>
      </form>
    </div>
  );
}
