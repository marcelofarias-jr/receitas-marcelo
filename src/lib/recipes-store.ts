import type { Recipe } from "../types/recipes";
import { slugify } from "./slugify";

export function ensureUniqueSlug(slug: string, recipes: Recipe[], id?: number) {
  const base = slugify(slug);
  let unique = base;
  let counter = 2;

  while (recipes.some((recipe) => recipe.slug === unique && recipe.id !== id)) {
    unique = `${base}-${counter}`;
    counter += 1;
  }

  return unique;
}
