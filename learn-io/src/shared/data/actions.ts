"use server";

import { promises as fs } from "fs";
import path from "path";
import { posts, type Post } from "./posts";

const postsFilePath = path.join(process.cwd(), "src/shared/data/posts.ts");

async function readPostsFile(): Promise<string> {
  return fs.readFile(postsFilePath, "utf-8");
}

async function writePostsFile(content: string): Promise<void> {
  await fs.writeFile(postsFilePath, content, "utf-8");
}

function formatPostsArray(postsArray: Post[]): string {
  const formattedPosts = postsArray
    .map(
      (p) => `  {
    id: ${p.id},
    title: "${p.title.replace(/"/g, '\\"')}",
    author: "${p.author.replace(/"/g, '\\"')}",
    body: "${p.body.replace(/"/g, '\\"').replace(/\n/g, "\\n")}",
  }`
    )
    .join(",\n");

  return `[\n${formattedPosts}\n]`;
}

export async function savePost(
  post: Omit<Post, "id">
): Promise<{ success: boolean; message: string; id?: number }> {
  try {
    const fileContent = await readPostsFile();

    const nextId = posts.length > 0 ? Math.max(...posts.map((item) => item.id)) + 1 : 1;
    const newPost: Post = {
      id: nextId,
      title: post.title,
      author: post.author,
      body: post.body,
    };

    posts.push(newPost);

    const updatedContent = fileContent.replace(
      /export const posts: Post\[\] = \[[\s\S]*?\];/,
      `export const posts: Post[] = ${formatPostsArray(posts)};`
    );

    await writePostsFile(updatedContent);

    return {
      success: true,
      message: "Post criado com sucesso!",
      id: nextId,
    };
  } catch (error) {
    console.error("Erro ao salvar post:", error);
    return {
      success: false,
      message: "Erro ao salvar o post. Tente novamente.",
    };
  }
}

export async function updatePost(
  id: number,
  post: Omit<Post, "id">
): Promise<{ success: boolean; message: string }> {
  try {
    const fileContent = await readPostsFile();
    const index = posts.findIndex((item) => item.id === id);

    if (index === -1) {
      return {
        success: false,
        message: "Post não encontrado.",
      };
    }

    posts[index] = {
      id,
      title: post.title,
      author: post.author,
      body: post.body,
    };

    const updatedContent = fileContent.replace(
      /export const posts: Post\[\] = \[[\s\S]*?\];/,
      `export const posts: Post[] = ${formatPostsArray(posts)};`
    );

    await writePostsFile(updatedContent);

    return {
      success: true,
      message: "Post atualizado com sucesso!",
    };
  } catch (error) {
    console.error("Erro ao atualizar post:", error);
    return {
      success: false,
      message: "Erro ao atualizar o post. Tente novamente.",
    };
  }
}
