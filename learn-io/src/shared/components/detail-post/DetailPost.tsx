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
    <article className="learnio-surface rounded-lg px-6 py-8">
      <header className="mb-5">
        <h1 className="learnio-title m-0 text-center text-3xl font-semibold tracking-tight sm:text-4xl">
          {post.title}
        </h1>

        <div className="mt-4 flex flex-col gap-2 border-b border-[color:var(--border)] pb-4 text-sm leading-6 sm:flex-row sm:items-center sm:justify-between text-[color:var(--copy)]">
          <p className="m-0">
            Por <span className="font-semibold text-[color:var(--foreground)]">{post.author}</span>
          </p>

          <p className="m-0">Atualizado em {formatUpdatedAt(updatedAt)}</p>
        </div>
      </header>

      <section aria-label="Conteúdo do post" className="space-y-5">
        {bodyParagraphs.map((paragraph, index) => (
          <p key={`${post.id}-${index}`} className="learnio-copy m-0 text-base leading-7">
            {paragraph}
          </p>
        ))}

        <div
          aria-hidden="true"
          className="learnio-surface-strong mt-8 h-[220px] w-full rounded-md"
        />
      </section>
    </article>
  );
}

