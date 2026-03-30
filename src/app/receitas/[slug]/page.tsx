import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

import RecipeDetailClient from "../../../components/RecipeDetailClient/RecipeDetailClient";
import {
  getRecipeBySlug,
  incrementRecipeAccessBySlug,
} from "../../../lib/recipes-repo";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function RecipePage({ params }: PageProps) {
  const { slug } = await params;
  const recipe = await getRecipeBySlug(slug);

  if (!recipe || recipe.deleted) {
    notFound();
  }

  await incrementRecipeAccessBySlug(slug);

  return <RecipeDetailClient slug={slug} initialRecipe={recipe} />;
}
