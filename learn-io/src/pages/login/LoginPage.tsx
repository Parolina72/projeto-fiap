"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { extractAuthorIdFromToken, findUserByCredentials } from "@/shared/data/api";

export function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      setMessage("Preencha usuário e senha.");
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const user = await findUserByCredentials(username, password);

      if (!user) {
        setMessage("Usuário ou senha inválidos.");
        return;
      }

      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("authSession", JSON.stringify(user));
      localStorage.setItem("user", JSON.stringify(user.user ?? user));

      const resolvedUserId =
        extractAuthorIdFromToken((user as { token?: string }).token) ??
        extractAuthorIdFromToken((user as { access_token?: string }).access_token) ??
        extractAuthorIdFromToken((user.user as { token?: string } | undefined)?.token);

      if (Number.isFinite(resolvedUserId)) {
        localStorage.setItem("author_id", String(resolvedUserId));
      }

      window.dispatchEvent(new Event("auth-changed"));
      setMessage("Login efetuado com sucesso!");

      setTimeout(() => {
        router.push("/");
      }, 500);
    } catch (error) {
      console.error("Erro no login:", error);
      setMessage(
        error instanceof Error
          ? error.message
          : "Erro ao tentar fazer login. Tente novamente."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="mx-auto w-full max-w-[560px] px-6 py-8">
      <section className="learnio-surface mb-6 rounded-3xl p-8">
        <h2 className="learnio-title mb-4 text-2xl font-semibold tracking-tight">Entrar</h2>

        {message && (
          <div className={`mb-5 rounded-md border px-4 py-3 text-sm leading-6 ${message.includes("sucesso") ? "border-green-200 bg-green-50 text-green-800 dark:border-green-900 dark:bg-green-950 dark:text-green-200" : "border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200"}`}>
            {message}
          </div>
        )}

        <div className="mb-4">
          <label htmlFor="login-username" className="learnio-label mb-2 block text-sm font-medium">
            Usuário
          </label>
          <input
            id="login-username"
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            className="learnio-field w-full rounded-xl px-4 py-3 text-base"
            placeholder="Nome de usuário"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="login-password" className="learnio-label mb-2 block text-sm font-medium">
            Senha
          </label>
          <input
            id="login-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="learnio-field w-full rounded-xl px-4 py-3 text-base"
            placeholder="Sua senha"
          />
        </div>

        <button
          type="button"
          onClick={handleLogin}
          disabled={isLoading}
          className="learnio-button-primary inline-flex h-11 w-full items-center justify-center rounded-xl px-5 text-base font-semibold transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? "Entrando..." : "Entrar"}
        </button>
      </section>
    </main>
  );
}
