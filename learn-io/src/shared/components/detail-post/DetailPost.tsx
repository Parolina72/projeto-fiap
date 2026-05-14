import type { Post } from "@/shared/data/posts";

type DetailPostProps = {
  post: Post;
  updatedAt?: string | Date;
};

function formatUpdatedAt(value?: string | Date) {
  if (!value) {
    return new Date().toLocaleDateString("pt-BR");
  }

  const date = typeof value === "string" ? new Date(value) : value;

  if (Number.isNaN(date.getTime())) {
    return new Date().toLocaleDateString("pt-BR");
  }

  return date.toLocaleDateString("pt-BR");
}

export function DetailPost({ post, updatedAt }: DetailPostProps) {
  const paragraphs = post.body
    .split(/\n\s*\n/g)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  const bodyParagraphs = paragraphs.length > 0 ? paragraphs : [post.body];

  return (
    <article className="rounded-lg border border-zinc-200 bg-white px-6 py-8 shadow-sm">
      <header className="mb-5">
        <h1 className="m-0 text-center text-3xl font-semibold text-zinc-900 sm:text-4xl">
          {post.title}
        </h1>

        <div className="mt-4 flex flex-col gap-2 border-b border-zinc-200 pb-4 text-sm text-zinc-600 sm:flex-row sm:items-center sm:justify-between">
          <p className="m-0">
            Por <span className="font-semibold text-zinc-800">{post.author}</span>
          </p>

          <p className="m-0">Atualizado em {formatUpdatedAt(updatedAt)}</p>
        </div>
      </header>

      <section aria-label="Conteúdo do post" className="space-y-5">
        {bodyParagraphs.map((paragraph, index) => (
          <p key={`${post.id}-${index}`} className="m-0 text-base leading-relaxed text-zinc-800">
            {paragraph}
          </p>
        ))}

        <div
          aria-hidden="true"
          className="mt-8 h-[220px] w-full rounded-md border border-zinc-200 bg-zinc-200"
        />
      </section>
    </article>
  );
}

