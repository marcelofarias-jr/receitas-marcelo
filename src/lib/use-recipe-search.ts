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

function countIngredientMatches(recipe: Recipe, ingredients: string[]): number {
  const recipeIngredients = recipe.igredientes.map(normalizar);
  return ingredients.filter((ing) => {
    const normalized = normalizar(ing.trim());
    return (
      normalized && recipeIngredients.some((ri) => ri.includes(normalized))
    );
  }).length;
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
      result = result
        .map((recipe) => ({
          ...recipe,
          matchScore: countIngredientMatches(recipe, ings),
        }))
        .filter((recipe) => recipe.matchScore > 0)
        .sort((a, b) => b.matchScore - a.matchScore);
    }

    return result;
  }, [recipes, params]);
}

export function getIngredientMatchCount(
  recipe: Recipe,
  ingredients: string[],
): number {
  if (!ingredients.length) return 0;
  return countIngredientMatches(recipe, ingredients);
}
