import type { MetadataRoute } from "next";
import { listRecipes } from "../lib/recipes-repo";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://receitasdomarcelo.com.br";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const receitas = await listRecipes();

  const receitasEntries: MetadataRoute.Sitemap = receitas.map((receita) => ({
    url: `${BASE_URL}/receitas/${receita.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...receitasEntries,
  ];
}
