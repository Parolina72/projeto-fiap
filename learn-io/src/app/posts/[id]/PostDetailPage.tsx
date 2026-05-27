"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { DetailPost } from "@/shared/components/detail-post";
import {
  extractRoleFromToken,
  getPostById,
  removePost,
  type IPost,
} from "@/shared/data/api";
import type { Post } from "@/shared/data/posts";

export default function PostDetailPage() {
  const params = useParams<{ id: string }>();
  const [post, setPost] = useState<IPost | null>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isProfessor, setIsProfessor] = useState(false);

  useEffect(() => {
    function syncAuthState() {
      const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
      const userJson = localStorage.getItem("user");

      if (!isAuthenticated || !userJson) {
        setIsProfessor(false);
        return;
      }

      try {
        const stored = JSON.parse(userJson) as unknown;
        const parsedUser =
          typeof stored === "object" && stored !== null && "user" in stored
            ? (stored as { user?: unknown }).user
            : stored;

        const role = (parsedUser as { role?: string })?.role;
        const token = (parsedUser as { token?: string })?.token;

        setIsProfessor(
          role === "PROFESSOR" || extractRoleFromToken(token) === "PROFESSOR"
        );
      } catch {
        setIsProfessor(false);
      }
    }

    syncAuthState();
    window.addEventListener("auth-changed", syncAuthState);
    window.addEventListener("storage", syncAuthState);

    return () => {
      window.removeEventListener("auth-changed", syncAuthState);
      window.removeEventListener("storage", syncAuthState);
    };
  }, []);

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

  async function handleRemovePost() {
    if (!post) {
      return;
    }

    const confirmed = window.confirm("Tem certeza que deseja remover este post?");
    if (!confirmed) {
      return;
    }

    setIsDeleting(true);
    setDeleteError(null);

    try {
      await removePost(Number(post.id));
      router.push("/");
    } catch (err) {
      console.error("Erro ao remover post:", err);
      setDeleteError(err instanceof Error ? err.message : "Erro ao remover post.");
    } finally {
      setIsDeleting(false);
    }
  }

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

        {isProfessor && (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href={`/posts/${detailPost.id}/edit`}
              className="inline-flex h-11 items-center justify-center rounded-md px-5 no-underline bg-gray-700 text-white transition-colors hover:bg-gray-500 disabled:opacity-50"
            >
              Editar
            </Link>

            <button
              type="button"
              onClick={handleRemovePost}
              disabled={isDeleting}
              className="inline-flex h-11 items-center justify-center rounded-md px-5 no-underline bg-red-700 text-white transition-colors hover:bg-red-500 disabled:opacity-50"
            >
              {isDeleting ? "Removendo..." : "Remover"}
            </button>
          </div>
        )}
      </div>

      {deleteError ? (
        <p className="learnio-copy mb-5 text-sm font-medium text-red-600">
          {deleteError}
        </p>
      ) : null}

      <DetailPost post={detailPost} updatedAt={post.created_at ?? new Date().toISOString()} />
    </main>
  );
}
