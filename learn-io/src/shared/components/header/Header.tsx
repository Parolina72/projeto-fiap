'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/shared/components/theme-toggle/ThemeToggle";
import { extractRoleFromToken } from "@/shared/data/api";
import Link from "next/link";

type HeaderProps = {
  title?: string;
};

export function Header({ title = "Learn.io" }: HeaderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | undefined>(undefined);
  const router = useRouter();

  useEffect(() => {
    function syncAuthState() {
      const storedAuth = localStorage.getItem("isAuthenticated");
      const authToken = localStorage.getItem("authToken");
      
      setIsAuthenticated(storedAuth === "true");
      
      if (authToken) {
        const role = extractRoleFromToken(authToken);
        setUserRole(role);
      } else {
        setUserRole(undefined);
      }
    }

    syncAuthState();

    window.addEventListener("auth-changed", syncAuthState);
    window.addEventListener("storage", syncAuthState);

    return () => {
      window.removeEventListener("auth-changed", syncAuthState);
      window.removeEventListener("storage", syncAuthState);
    };
  }, []);

  function handleAuthToggle() {
    const nextAuthState = !isAuthenticated;

    setIsAuthenticated(nextAuthState);

    if (nextAuthState) {
      localStorage.setItem("isAuthenticated", "true");
    } else {
      localStorage.removeItem("isAuthenticated");
    }

    window.dispatchEvent(new Event("auth-changed"));
  }

  function handleRegisterClick() {
    router.push('/create-usuario/informacoes-acesso');
  }

  function handleLoginClick() {
    if (isAuthenticated) {
      handleAuthToggle();
      return;
    }
    router.push('/login');
  }

  return (
    <header className='w-full'>
      <div className='learnio-banner w-full'>
        <div className='flex items-center justify-between h-[60px] m-auto max-w-[1440px] px-11'>
          <h1 className='m-0 text-[1.25rem] leading-none font-medium text-current'>{title}</h1>
          <ThemeToggle />
        </div>
      </div>
      <div className='learnio-banner-secondary w-full' aria-label="Navegacao principal">
        <div className='flex items-center gap-[72px] h-12 m-auto max-w-[1440px] px-11'>
          <Link href="/" className='cursor-pointer text-[0.95rem] leading-none no-underline text-current'>
            Página Inicial
          </Link>
          {isAuthenticated && userRole === "PROFESSOR" && (
            <Link href="/admin" className='cursor-pointer text-[0.95rem] leading-none no-underline text-current'>
              Administrativo
            </Link>
          )}
          {isAuthenticated && userRole === "PROFESSOR" && (
            <Link href="/posts/create" className='cursor-pointer text-[0.95rem] leading-none no-underline text-current'>
              Criar Postagem
            </Link>
          )}
          <div className='ml-auto flex items-center gap-3'>
            {!isAuthenticated && (
              <button
                type='button'
                onClick={handleRegisterClick}
                className='learnio-banner-control ml-auto rounded-md px-4 py-2 text-[0.95rem] leading-none transition-colors'
              >
                Cadastrar
              </button>
            )}
            <button
              type='button'
              onClick={handleLoginClick}
              className='learnio-banner-control ml-auto rounded-md px-4 py-2 text-[0.95rem] leading-none transition-colors'
            >
              {isAuthenticated ? "Sair" : "Login"}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
