import type { Metadata } from "next";
import { Footer } from "@/shared/components/footer";
import { Header } from "@/shared/components/header/Header";
import { ThemeProvider } from "@/shared/components/theme-provider/ThemeProvider";
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
    <html lang="pt-BR" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Header />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
