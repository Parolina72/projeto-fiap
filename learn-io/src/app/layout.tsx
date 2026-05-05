import type { Metadata } from "next";
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
      <body>{children}</body>
    </html>
  );
}
