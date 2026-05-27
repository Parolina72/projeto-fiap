"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { removePost, getPosts, type IPost } from "@/shared/data/api";

export default function AdminPage() {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [deletingIds, setDeletingIds] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPosts() {
      try {
        const data = await getPosts();
        setPosts(data);
      } catch (err) {
        console.error("Erro ao buscar posts:", err);
        setError(err instanceof Error ? err.message : "Erro ao buscar posts.");
      } finally {
        setLoading(false);
      }
    }

    loadPosts();
  }, []);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      if (!query) {
        return true;
      }

      return [post.title, post.content].some((field) =>
        field.toLowerCase().includes(query.toLowerCase())
      );
    });
  }, [posts, query]);

  async function handleRemovePost(id: number) {
    const confirmed = window.confirm("Tem certeza que deseja remover este post?");
    if (!confirmed) {
      return;
    }

    setDeletingIds((current) => [...current, id]);
    setError(null);

    try {
      await removePost(id);
      setPosts((current) => current.filter((post) => post.id !== id));
    } catch (err) {
      console.error("Erro ao remover post:", err);
      setError(err instanceof Error ? err.message : "Erro ao remover post.");
    } finally {
      setDeletingIds((current) => current.filter((postId) => postId !== id));
    }
  }

  if (loading) {
    return <p className="text-base font-medium text-[color:var(--foreground)]">Carregando posts...</p>;
  }

  return (
    <main className="mx-auto w-full max-w-[980px] px-6 py-8">
      <section className="mb-6">
        <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="m-0 text-2xl font-semibold tracking-tight text-[color:var(--foreground)]">
              Painel Administrativo
            </h2>
          </div>

          <div className="flex flex-col gap-3 sm:w-[360px] sm:flex-row">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por título ou conteúdo"
              aria-label="Buscar posts"
              className="learnio-field h-11 w-full rounded-md px-3 text-base leading-6"
            />

          </div>
        </div>
      </section>

      {error ? (
        <p className="learnio-copy mb-5 text-sm font-medium text-red-600">{error}</p>
      ) : null}

      <section aria-live="polite" aria-label="Resultados da busca">
        {filteredPosts.length === 0 ? (
          <p className="text-base font-medium leading-7 text-[color:var(--foreground)]">
            Nenhum post encontrado.
          </p>
        ) : (
          <ul className="m-0 list-none space-y-4 p-0">
            {filteredPosts.map((post) => {
              const isDeleting = deletingIds.includes(post.id);

              return (
                <li key={post.id} className="learnio-surface rounded-lg p-5">
                  <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="m-0 text-xl font-semibold tracking-tight text-[color:var(--foreground)]">
                        <Link
                          href={`/posts/${post.id}`}
                          className="learnio-link rounded-sm no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
                        >
                          {post.title}
                        </Link>
                      </h3>
                      <p className="learnio-muted mt-1 text-sm leading-6">
                        Autor: <strong>{post.author_id || "Anônimo"}</strong>
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/posts/${post.id}/edit`}
                        className="inline-flex h-11 items-center justify-center rounded-md px-5 no-underline bg-gray-700 text-white transition-colors hover:bg-gray-500 disabled:opacity-50"
                      >
                        Editar
                      </Link>
                      <button
                        type="button"
                        disabled={isDeleting}
                        onClick={() => handleRemovePost(post.id)}
                        className="inline-flex h-11 items-center justify-center rounded-md px-5 no-underline bg-red-700 text-white transition-colors hover:bg-red-500 disabled:opacity-50"
                      >
                        {isDeleting ? "Removendo..." : "Remover"}
                      </button>
                    </div>
                  </div>

                  <p className="learnio-copy m-0 text-base leading-relaxed">{post.content}</p>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </main>
  );
}
