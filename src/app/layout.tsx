import type { Metadata, Viewport } from "next";
import { Playfair_Display, Source_Sans_3 } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.scss";
import { RecipesProvider } from "./state/recipes-context";
import ThemeToggle from "../components/ThemeToggle";
import ScrollReset from "../components/ScrollReset";

const display = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
});

const sans = Source_Sans_3({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#d44a14",
};

export const metadata: Metadata = {
  title: "Receitas do Marcelo",
  description: "Receitas caseiras com sabor de família.",
  applicationName: "Receitas do Marcelo",
  keywords: "receitas, culinária, comida caseira, bolo, massa, sobremesa",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Receitas do Marcelo",
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: "/icon.svg",
    apple: [{ url: "/apple-icon", sizes: "180x180", type: "image/png" }],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const theme = cookieStore.get("theme")?.value === "dark" ? "dark" : "light";

  return (
    <html
      lang="pt-BR"
      className={`${display.variable} ${sans.variable}`}
      data-theme={theme}
      suppressHydrationWarning
    >
      <body>
        <ScrollReset />
        <RecipesProvider>{children}</RecipesProvider>
        <ThemeToggle />
      </body>
    </html>
  );
}
