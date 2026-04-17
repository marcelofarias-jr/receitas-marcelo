"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import styles from "../../app/receitas/[slug]/page.module.scss";
import RecipeHeader from "../RecipeHeader";
import RecipeIngredients from "../RecipeIngredients";
import RecipeSteps from "../RecipeSteps";
import type { Recipe } from "../../types/recipes";
import { ArrowLeft } from "lucide-react";

function getImageUrl(recipe: Recipe): string {
  if (recipe.foto.startsWith("http://") || recipe.foto.startsWith("https://")) {
    return recipe.foto;
  }
  if (recipe.foto.startsWith("/uploads/")) {
    return recipe.foto;
  }
  if (
    recipe.foto &&
    !recipe.foto.includes("/") &&
    !recipe.foto.includes("\\")
  ) {
    return `/uploads/${recipe.foto}`;
  }
  return "";
}

type Props = {
  slug: string;
  initialRecipe: Recipe;
};

export default function RecipeDetailClient({ slug, initialRecipe }: Props) {
  const [recipe, setRecipe] = useState<Recipe>(initialRecipe);
  const slugRef = useRef(slug);

  useEffect(() => {
    slugRef.current = slug;
  }, [slug]);

  useEffect(() => {
    const eventSource = new EventSource("/api/updates");

    eventSource.onmessage = () => {
      fetch(`/api/receitas/${slugRef.current}`, { cache: "no-store" })
        .then((r) => r.json())
        .then((data: Recipe) => {
          if (data && !data.deleted) {
            setRecipe(data);
          }
        })
        .catch(() => undefined);
    };

    return () => eventSource.close();
  }, []);

  const imageUrl = getImageUrl(recipe);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Link href="/" className={styles.backLink}>
          <ArrowLeft />
          Voltar para as receitas
        </Link>
        <RecipeHeader recipe={recipe} imageUrl={imageUrl} />
        <RecipeIngredients recipeId={recipe.id} items={recipe.igredientes} />
        <RecipeSteps recipeId={recipe.id} steps={recipe.preparo} />
      </main>
    </div>
  );
}
