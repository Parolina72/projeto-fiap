"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getPosts, type IPost } from "@/shared/data/api";

export default function Home() {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPosts() {
      try {
        const data = await getPosts();
        setPosts(data);
      } catch (error) {
        console.error("Erro ao buscar posts:", error);
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

  if (loading) {
    return <p className="text-base font-medium text-[color:var(--foreground)]">Carregando posts...</p>;
  }

  return (
    <main className="mx-auto w-full max-w-[980px] px-6 py-8">
      <section className="mb-6">
        <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="m-0 text-2xl font-semibold tracking-tight text-[color:var(--foreground)]">
            Mural Acadêmico
          </h2>

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

      <section aria-live="polite" aria-label="Resultados da busca">
        {filteredPosts.length === 0 ? (
          <p className="text-base font-medium leading-7 text-[color:var(--foreground)]">
            Nenhum post encontrado.
          </p>
        ) : (
          <ul className="m-0 list-none space-y-4 p-0">
            {filteredPosts.map((post) => (
              <li
                key={post.id}
                className="learnio-surface rounded-lg p-5"
              >
                <h3 className="m-0 text-xl font-semibold tracking-tight text-[color:var(--foreground)]">
                  <Link
                    href={`/posts/${post.id}`}
                    className="learnio-link rounded-sm no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
                  >
                    {post.title}
                  </Link>
                </h3>

                <p className="learnio-muted mb-2 mt-1 text-sm leading-6">
                  Autor:{" "}
                  <strong>
                    {post.author_name ??
                      (typeof post.author_id === "object"
                        ? (post.author_id as any)?.name
                        : post.author_id)
                      ?? "Anônimo"}
                  </strong>
                </p>

                <p className="learnio-copy m-0 text-base leading-relaxed">
                  {post.content}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
