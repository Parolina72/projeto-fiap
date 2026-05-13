import { posts } from "@/shared/data/posts";

type HomePageProps = {
  searchParams?: Promise<{
    q?: string;
  }>;
};

export default async function Home({ searchParams }: HomePageProps) {
  const query = ((await searchParams)?.q ?? "").trim().toLowerCase();

  const filteredPosts = posts.filter((post) => {
    if (!query) {
      return true;
    }

    return [post.title, post.body, post.author].some((field) => field.toLowerCase().includes(query));
  });

  return (
    <main className="mx-auto w-full max-w-[980px] px-6 py-8">
      <section className="mb-6">
        <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="m-0 text-2xl font-semibold">Mural Acadêmico</h2>
          <form action="/" className="flex flex-col gap-3 sm:w-[360px] sm:flex-row">
            <input
              type="search"
              name="q"
              defaultValue={query}
              placeholder="Buscar por título, autor ou descrição"
              aria-label="Buscar posts"
              className="h-11 w-full rounded-md border border-zinc-300 bg-white px-3 text-base text-zinc-900 outline-none focus:border-background-azul-real-vibrante"
            />
            <button
              type="submit"
              className="h-11 rounded-md bg-background-azul-real-vibrante px-5 text-white transition-opacity hover:opacity-90 sm:w-auto"
            >
              Buscar
            </button>
          </form>
        </div>
      </section>

      <section aria-live="polite" aria-label="Resultados da busca">
        {filteredPosts.length === 0 ? (
          <p className="text-zinc-700">Nenhum post encontrado para a busca informada.</p>
        ) : (
          <ul className="m-0 list-none space-y-4 p-0">
            {filteredPosts.map((post) => (
              <li key={post.id} className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
                <h3 className="m-0 text-xl font-semibold text-zinc-900">{post.title}</h3>
                <p className="mb-2 mt-1 text-sm text-zinc-600">
                  Autor: <strong>{post.author}</strong>
                </p>
                <p className="m-0 text-base text-zinc-800">{post.body}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
