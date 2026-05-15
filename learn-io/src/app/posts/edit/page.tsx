import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { FormPost } from "@/shared/components/form-post/FormPost";
import { posts } from "@/shared/data/posts";

type EditPostPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { id } = await params;
  const postId = Number(id);

  if (!Number.isFinite(postId)) {
    notFound();
  }

  const post = posts.find((item) => item.id === postId);

  if (!post) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-[980px] px-6 py-8">
      <div className="mb-5">
        <Link
          href={`/posts/${post.id}`}
          className="inline-flex h-11 items-center gap-2 rounded-md bg-background-azul-real-vibrante px-5 text-white no-underline transition-opacity hover:opacity-90"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Voltar
        </Link>
      </div>

      <FormPost post={post} />
    </main>
  );
}
