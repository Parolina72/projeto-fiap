"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { findUserByCredentials } from "@/shared/data/api";

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
      localStorage.setItem("user", JSON.stringify(user.user));
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
      <section className="mb-6 rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
        <h2 className="mb-4 text-2xl font-semibold">Entrar</h2>

        {message && (
          <div className={`mb-5 rounded-md border px-4 py-3 text-sm ${message.includes("sucesso") ? "border-green-200 bg-green-50 text-green-800" : "border-red-200 bg-red-50 text-red-800"}`}>
            {message}
          </div>
        )}

        <div className="mb-4">
          <label htmlFor="login-username" className="mb-2 block text-sm font-medium text-zinc-700">
            Usuário
          </label>
          <input
            id="login-username"
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-3 text-base text-zinc-900 outline-none focus:border-background-azul-real-vibrante focus:ring-2 focus:ring-background-azul-real-vibrante/20"
            placeholder="Nome de usuário"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="login-password" className="mb-2 block text-sm font-medium text-zinc-700">
            Senha
          </label>
          <input
            id="login-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-3 text-base text-zinc-900 outline-none focus:border-background-azul-real-vibrante focus:ring-2 focus:ring-background-azul-real-vibrante/20"
            placeholder="Sua senha"
          />
        </div>

        <button
          type="button"
          onClick={handleLogin}
          disabled={isLoading}
          className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-background-azul-real-vibrante px-5 text-base font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? "Entrando..." : "Entrar"}
        </button>
      </section>
    </main>
  );
}
