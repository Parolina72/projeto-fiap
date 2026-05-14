"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex h-8 w-14 items-center rounded-full bg-white/20 p-1" />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative inline-flex h-8 w-14 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent bg-white/20 transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75"
      aria-label="Alternar tema"
    >
      <span className="sr-only">Alternar tema</span>
      <span
        aria-hidden="true"
        className={`${
          isDark ? "translate-x-6" : "translate-x-0"
        } pointer-events-none flex h-6 w-6 transform items-center justify-center rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
      >
        {isDark ? (
          <MoonIcon className="h-4 w-4 text-zinc-800" />
        ) : (
          <SunIcon className="h-4 w-4 text-zinc-500" />
        )}
      </span>
    </button>
  );
}