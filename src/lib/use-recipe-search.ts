import { useMemo } from "react";
import type { Recipe } from "../types/recipes";

export type RecipeSearchParams = {
  query: string;
  ingredients?: string[];
};

export type RecipeWithScore = Recipe & { matchScore: number };

function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function hasAllIngredients(recipe: Recipe, ingredients: string[]): boolean {
  const recipeIngredients = recipe.igredientes.map(normalizar);
  return ingredients.every((ing) => {
    const normalized = normalizar(ing.trim());
    return (
      normalized.length > 0 &&
      recipeIngredients.some((ri) => ri.includes(normalized))
    );
  });
}

export function useRecipeSearch(
  recipes: Recipe[],
  params: RecipeSearchParams,
): Recipe[] {
  return useMemo(() => {
    const hasQuery = params.query.trim().length > 0;
    const hasIngredients = params.ingredients && params.ingredients.length > 0;

    if (!hasQuery && !hasIngredients) return recipes;

    let result = recipes;

    if (hasQuery) {
      const query = normalizar(params.query.trim());
      result = result.filter((recipe) =>
        normalizar(recipe.titulo).includes(query),
      );
    }

    if (hasIngredients && params.ingredients) {
      const ings = params.ingredients;
      result = result.filter((recipe) => hasAllIngredients(recipe, ings));
    }

    return result;
  }, [recipes, params]);
}

export function getIngredientMatchCount(
  recipe: Recipe,
  ingredients: string[],
): number {
  if (!ingredients.length) return 0;
  return hasAllIngredients(recipe, ingredients) ? ingredients.length : 0;
}
