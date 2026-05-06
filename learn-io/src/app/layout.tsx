import type { Metadata } from "next";
import { Header } from "@/shared/components/header";
import "./globals.css";

export const metadata: Metadata = {
  title: "Learn IO",
  description: "Projeto base pronto para iniciar",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
