import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

import RecipeDetailClient from "../../../components/RecipeDetailClient";
import {
  getRecipeBySlug,
  incrementRecipeAccessBySlug,
} from "../../../lib/recipes-repo";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const recipe = await getRecipeBySlug(slug);

  if (!recipe || recipe.deleted) {
    return { title: "Receita não encontrada | Receitas do Marcelo" };
  }

  const ingredientesPrincipais = recipe.igredientes.slice(0, 5).join(", ");
  const descricao = recipe.resumo
    ? recipe.resumo
    : `Aprenda a fazer ${recipe.titulo} com ingredientes como ${ingredientesPrincipais}.`;

  const keywords = [
    recipe.titulo,
    ...recipe.igredientes.slice(0, 8),
    ...(recipe.culinária ?? []),
    recipe.tipo,
    "receita",
    "como fazer",
    "Receitas do Marcelo",
  ]
    .filter(Boolean)
    .join(", ");

  return {
    title: `${recipe.titulo} | Receitas do Marcelo`,
    description: descricao,
    keywords,
    openGraph: {
      title: `${recipe.titulo} | Receitas do Marcelo`,
      description: descricao,
      type: "article",
      ...(recipe.foto && {
        images: [{ url: recipe.foto, alt: recipe.titulo }],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: `${recipe.titulo} | Receitas do Marcelo`,
      description: descricao,
      ...(recipe.foto && { images: [recipe.foto] }),
    },
  };
}

export default async function RecipePage({ params }: PageProps) {
  const { slug } = await params;
  const recipe = await getRecipeBySlug(slug);

  if (!recipe || recipe.deleted) {
    notFound();
  }

  await incrementRecipeAccessBySlug(slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Recipe",
    name: recipe.titulo,
    description: recipe.resumo || undefined,
    recipeIngredient: recipe.igredientes,
    recipeInstructions: recipe.preparo.map((passo, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      text: passo,
    })),
    recipeCategory: recipe.tipo || undefined,
    recipeCuisine:
      recipe.culinária && recipe.culinária.length > 0
        ? recipe.culinária.join(", ")
        : undefined,
    totalTime: recipe.tempoDePreparo ? `PT${recipe.tempoDePreparo}` : undefined,
    recipeYield: recipe.rendimento || undefined,
    isAccessibleForFree: true,
    ...(recipe.foto && {
      image: recipe.foto,
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <RecipeDetailClient slug={slug} initialRecipe={recipe} />
    </>
  );
}
