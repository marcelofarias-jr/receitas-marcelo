import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "./page.module.scss";
import RecipeHeader from "../../../components/RecipeHeader/RecipeHeader";
import RecipeIngredients from "../../../components/RecipeIngredients/RecipeIngredients";
import RecipeSteps from "../../../components/RecipeSteps/RecipeSteps";
import {
  getRecipeBySlug,
  incrementRecipeAccessBySlug,
} from "../../../lib/recipes-repo";
import type { Recipe } from "../../../types/recipes";

type PageProps = {
  params: Promise<{ slug: string }>;
};

function getImageUrl(recipe: Recipe): string {
  // Só aceita URLs externas (http/https) ou paths locais em /uploads/
  if (recipe.foto.startsWith("http://") || recipe.foto.startsWith("https://")) {
    return recipe.foto;
  }

  if (recipe.foto.startsWith("/uploads/")) {
    return recipe.foto;
  }

  // Se for nome de arquivo sem path, tenta em /uploads/
  if (
    recipe.foto &&
    !recipe.foto.includes("/") &&
    !recipe.foto.includes("\\")
  ) {
    return `/uploads/${recipe.foto}`;
  }

  // Nenhuma imagem válida
  return "";
}

export default async function RecipePage({ params }: PageProps) {
  const { slug } = await params;
  let recipe = await getRecipeBySlug(slug);

  if (!recipe || recipe.deleted) {
    notFound();
  }

  const updated = await incrementRecipeAccessBySlug(slug);
  if (updated) {
    recipe = updated;
  }

  const imageUrl = getImageUrl(recipe);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Link href="/" className={styles.backLink}>
          Voltar para as receitas
        </Link>

        <RecipeHeader recipe={recipe} imageUrl={imageUrl} />

        <RecipeIngredients recipeId={recipe.id} items={recipe.igredientes} />

        <RecipeSteps recipeId={recipe.id} steps={recipe.preparo} />
      </main>
    </div>
  );
}
