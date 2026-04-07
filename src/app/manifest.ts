import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Receitas do Marcelo",
    short_name: "Marcelo",
    description: "Receitas caseiras com sabor de família.",
    start_url: "/",
    display: "standalone",
    background_color: "#faf8f5",
    theme_color: "#d44a14",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
