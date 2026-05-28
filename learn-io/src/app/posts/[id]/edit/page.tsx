"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { FormPost } from "@/shared/components/form-post/FormPost";
import { getPostById, type IPost } from "@/shared/data/api";
import type { Post } from "@/shared/data/posts";

export default function EditPostPage() {
  const params = useParams<{ id: string }>();
  const [post, setPost] = useState<IPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPost() {
      try {
        const postId = Number(params?.id);

        if (!Number.isFinite(postId)) {
          setError("Post não encontrado.");
          return;
        }

        const data = await getPostById(postId);
        if (!data) {
          setError("Post não encontrado.");
          return;
        }

        setPost(data);
      } catch (err) {
        console.error("Erro ao carregar post para edição:", err);
        setError(err instanceof Error ? err.message : "Erro ao carregar post.");
      } finally {
        setLoading(false);
      }
    }

    loadPost();
  }, [params?.id]);

  if (loading) {
    return (
      <main className="mx-auto w-full max-w-[980px] px-6 py-8">
        <p className="learnio-copy text-base font-medium">Carregando post...</p>
      </main>
    );
  }

  if (error || !post) {
    return (
      <main className="mx-auto w-full max-w-[980px] px-6 py-8">
        <div className="mb-5">
          <Link
            href="/"
            className="learnio-button-primary inline-flex h-11 items-center gap-2 rounded-md px-5 no-underline transition-opacity hover:opacity-90"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Voltar
          </Link>
        </div>

        <p className="learnio-copy text-base font-medium">
          {error || "Post não encontrado."}
        </p>
      </main>
    );
  }

  const editPost: Post & { author_id?: number | { id?: number; name?: string } } = {
    id: Number(post.id),
    title: post.title,
    author:
      post.author_name ??
      (typeof post.author_id === "object"
        ? (post.author_id as any)?.name
        : post.author_id
        ? `Autor #${post.author_id}`
        : "Anônimo"),
    body: post.content,
    image_url: undefined,
    author_id: post.author_id,
  };

  return (
    <main className="mx-auto w-full max-w-[980px] px-6 py-8">
      <div className="mb-5">
        <Link
          href={`/posts/${editPost.id}`}
          className="learnio-button-primary inline-flex h-11 items-center gap-2 rounded-md px-5 no-underline transition-opacity hover:opacity-90"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Voltar
        </Link>
      </div>

      <FormPost post={editPost} />
    </main>
  );
}
