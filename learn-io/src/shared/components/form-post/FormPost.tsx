"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { type Post } from "@/shared/data/posts";
import { type IPost, createPost, updatePost as apiUpdatePost, getMyPerson } from "@/shared/data/api";

type FormPostProps = {
  post?: Post | IPost;
};

function resolveAuthorId(value: unknown): number | string {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    return value.trim();
  }

  if (value && typeof value === "object") {
    const candidate = value as Record<string, unknown>;
    for (const key of ["id", "author_id", "authorId", "user_id", "userId"]) {
      const nested = candidate[key];
      if (typeof nested === "number" && Number.isFinite(nested)) {
        return nested;
      }
      if (typeof nested === "string" && nested.trim()) {
        return nested.trim();
      }
    }
  }

  return "";
}

function resolveAuthorName(post: Post | IPost | undefined): string {
  if (!post) {
    return "";
  }

  if ((post as IPost).author_name) {
    return (post as IPost).author_name as string;
  }

  if ((post as any).author) {
    return (post as any).author as string;
  }

  if ((post as any).author_id && typeof (post as any).author_id === "object") {
    return ((post as any).author_id as any).name ?? "";
  }

  return "";
}

function resolveAuthorIdFromPost(post: Post | IPost | undefined): number | string {
  if (!post) {
    return "";
  }

  const resolvedId = resolveAuthorId((post as any).author_id ?? "");
  if (resolvedId) {
    return resolvedId;
  }

  const authorText = (post as any).author;
  if (typeof authorText === "string") {
    const match = authorText.match(/Autor #(\d+)/);
    if (match) {
      return Number(match[1]);
    }
  }

  return "";
}

export function FormPost({ post }: FormPostProps) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState(post?.title ?? "");
  const [authorId, setAuthorId] = useState<number | string>(
    resolveAuthorId((post as any)?.author_id ?? "")
  );
  const [authorName, setAuthorName] = useState<string>(resolveAuthorName(post));
  const [body, setBody] = useState((post as any)?.body ?? (post as any)?.content ?? "");
  const [imageUrl, setImageUrl] = useState<string | undefined>((post as any)?.image_url ?? "");

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setAuthorId(resolveAuthorId((post as any)?.author_id ?? ""));
      setAuthorName(resolveAuthorName(post));
      setBody((post as any)?.body ?? (post as any)?.content ?? "");
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
    const resolvedAuthorId = authorId || resolveAuthorIdFromPost(post);
    const trimmedAuthorId = String(resolvedAuthorId).trim();
    const trimmedBody = body.trim();

    if (!trimmedTitle || !trimmedBody || (!trimmedAuthorId && !post)) {
      setMessage(`Preencha os campos obrigatórios para ${post ? "atualizar" : "criar"} o post.`);
      setIsLoading(false);
      return;
    }

    try {
      if (post) {
        const updatePayload: Partial<{
          title: string
          content: string
          image_url: string
          author_id: number
        }> = {
          title: trimmedTitle,
          content: trimmedBody,
          image_url: imageUrl || undefined,
        };

        if (trimmedAuthorId) {
          updatePayload.author_id = Number(trimmedAuthorId);
        }

        const updated = await apiUpdatePost(Number(post.id), updatePayload);

        setMessage("Post atualizado com sucesso!");
        setTimeout(() => {
          router.push(`/posts/${updated.id}`);
        }, 1500);
      } else {
        const created = await createPost({
          title: trimmedTitle,
          content: trimmedBody,
          image_url: imageUrl || undefined,
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
          <label htmlFor="imageUrl" className="learnio-label block text-sm font-medium">
            Imagem (opcional)
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
