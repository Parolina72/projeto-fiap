"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { type Post } from "@/shared/data/posts";
import { createPost } from "@/shared/data/api";
import { updatePost } from "@/shared/data/actions";

type FormPostProps = {
  post?: Post;
};

export function FormPost({ post }: FormPostProps) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState(post?.title ?? "");
  const [author, setAuthor] = useState(post?.author ?? "");
  const [imageUrl, setImageUrl] = useState((post as Post & { image_url?: string } | undefined)?.image_url ?? "");
  const [body, setBody] = useState(post?.body ?? "");

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setAuthor(post.author);
      setImageUrl((post as Post & { image_url?: string }).image_url ?? "");
      setBody(post.body);
    }
  }, [post]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const trimmedTitle = title.trim();
    const trimmedAuthor = author.trim();
    const trimmedImageUrl = imageUrl.trim();
    const trimmedBody = body.trim();

    const isEditing = Boolean(post);

    if (!trimmedTitle || !trimmedImageUrl || !trimmedBody || (isEditing && !trimmedAuthor)) {
      setMessage(`Preencha todos os campos para ${post ? "atualizar" : "criar"} o post.`);
      setIsLoading(false);
      return;
    }

    try {
      if (post) {
        const result = await updatePost(post.id, {
          title: trimmedTitle,
          author: trimmedAuthor,
          body: trimmedBody,
        });

        if (result.success) {
          setMessage(result.message);
          setTimeout(() => {
            router.push(`/posts/${post.id}`);
          }, 1500);
        } else {
          setMessage(result.message);
        }
      } else {
        await createPost({
          title: trimmedTitle,
          content: trimmedBody,
          image_url: trimmedImageUrl,
        });

        setMessage("Post criado com sucesso!");
        setTitle("");
        setAuthor("");
        setImageUrl("");
        setBody("");
        setTimeout(() => {
          router.push("/");
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
    <div className="learnio-surface rounded-lg px-6 py-8">
      <header className="mb-5">
        <h1 className="learnio-title m-0 text-center text-3xl font-semibold tracking-tight sm:text-4xl">
          {formTitle}
        </h1>
      </header>

      {message && (
        <div className="mb-5 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm leading-6 text-green-800 dark:border-green-900 dark:bg-green-950 dark:text-green-200">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="title" className="learnio-label block text-sm font-medium">
            Título
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="learnio-field mt-1 block w-full rounded-md px-3 py-2 sm:text-sm"
            placeholder="Digite o título do post"
          />
        </div>

        <div>
          <label htmlFor="author" className="learnio-label block text-sm font-medium">
            Autor
          </label>
          <input
            type="text"
            id="author"
            name="author"
            value={author}
            onChange={(event) => setAuthor(event.target.value)}
            className="learnio-field mt-1 block w-full rounded-md px-3 py-2 sm:text-sm"
            placeholder="Digite o nome do autor"
          />
        </div>

        <div>
          <label htmlFor="imageUrl" className="learnio-label block text-sm font-medium">
            Imagem
          </label>
          <input
            type="text"
            id="imageUrl"
            name="imageUrl"
            value={imageUrl}
            onChange={(event) => setImageUrl(event.target.value)}
            className="learnio-field mt-1 block w-full rounded-md px-3 py-2 sm:text-sm"
            placeholder="Cole a URL da imagem"
          />
        </div>

        <div>
          <label htmlFor="body" className="learnio-label block text-sm font-medium">
            Conteúdo
          </label>
          <textarea
            id="body"
            name="body"
            rows={6}
            value={body}
            onChange={(event) => setBody(event.target.value)}
            className="learnio-field mt-1 block w-full rounded-md px-3 py-2 sm:text-sm"
            placeholder="Digite o conteúdo do post"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="learnio-button-primary inline-flex items-center rounded-md px-4 py-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? "Salvando..." : buttonLabel}
        </button>
      </form>
    </div>
  );
}
