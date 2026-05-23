import Link from "next/link";
import ArrowLeftIcon from "@heroicons/react/24/solid/esm/ArrowLeftIcon";
import { FormPost } from "@/shared/components/form-post/FormPost";

export default function CreatePostPage() {
  return (
    <main className="mx-auto w-full max-w-[980px] px-6 py-8">
      <div className="mb-5">
        <Link
          href="/"
          className="inline-flex h-11 items-center gap-2 rounded-md bg-background-azul-real-vibrante px-5 text-white no-underline transition-opacity hover:opacity-90"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Voltar
        </Link>
      </div>

      <FormPost />
    </main>
  );
}
