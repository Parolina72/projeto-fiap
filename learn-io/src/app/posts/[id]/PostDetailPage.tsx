"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { DetailPost } from "@/shared/components/detail-post";
import { getPostById, type IPost } from "@/shared/data/api";
import type { Post } from "@/shared/data/posts";

export default function PostDetailPage() {
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
        console.error("Erro ao carregar post:", err);
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

  const detailPost: Post = {
    id: Number(post.id),
    title: post.title,
    author: post.author_id ? `Autor #${post.author_id}` : "Anônimo",
    body: post.content,
    image_url: undefined,
  };

  return (
    <main className="mx-auto w-full max-w-[980px] px-6 py-8">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/"
          className="learnio-button-primary inline-flex h-11 items-center gap-2 rounded-md px-5 no-underline transition-opacity hover:opacity-90"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Voltar
        </Link>

        <Link
          href={`/posts/${detailPost.id}/edit`}
          className="learnio-button-secondary inline-flex h-11 items-center justify-center rounded-md px-5 no-underline transition-opacity hover:opacity-90"
        >
          Editar post
        </Link>
      </div>

      <DetailPost post={detailPost} updatedAt={post.created_at ?? new Date().toISOString()} />
    </main>
  );
}
