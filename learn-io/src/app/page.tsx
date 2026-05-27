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
    return <p>Carregando posts...</p>;
  }

  return (
    <main className="mx-auto w-full max-w-[980px] px-6 py-8">
      <section className="mb-6">
        <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="m-0 text-2xl font-semibold">
            Mural Acadêmico
          </h2>

          <div className="flex flex-col gap-3 sm:w-[360px] sm:flex-row">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por título ou descrição"
              aria-label="Buscar posts"
              className="h-11 w-full rounded-md border border-zinc-300 bg-white px-3 text-base text-zinc-900 outline-none focus:border-background-azul-real-vibrante"
            />

            <button
              type="button"
              className="h-11 rounded-md bg-background-azul-real-vibrante px-5 text-white transition-opacity hover:opacity-90 sm:w-auto"
            >
              Buscar
            </button>
          </div>
        </div>
      </section>

      <section aria-live="polite" aria-label="Resultados da busca">
        {filteredPosts.length === 0 ? (
          <p className="text-zinc-700">
            Nenhum post encontrado.
          </p>
        ) : (
          <ul className="m-0 list-none space-y-4 p-0">
            {filteredPosts.map((post) => (
              <li
                key={post.id}
                className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm"
              >
                <h3 className="m-0 text-xl font-semibold">
                  <Link
                    href={`/posts/${post.id}`}
                    className="rounded-sm text-background-azul-real-vibrante no-underline hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-background-azul-real-vibrante/40"
                  >
                    {post.title}
                  </Link>
                </h3>

                <p className="mb-2 mt-1 text-sm text-zinc-600">
                  Autor:{" "}
                  <strong>{post.author_id || "Anônimo"}</strong>
                </p>

                <p className="m-0 text-base text-zinc-800">
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