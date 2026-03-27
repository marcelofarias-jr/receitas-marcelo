import { and, desc, eq, sql } from "drizzle-orm";
import { db } from "../db";
import { recipes } from "../db/schema";
import type { Recipe, RecipeInput } from "../types/recipes";
import { ensureUniqueSlug } from "./recipes-store";

function mapRow(row: typeof recipes.$inferSelect): Recipe {
  return {
    id: row.id,
    slug: row.slug,
    deleted: row.deleted,
    foto: row.foto,
    titulo: row.titulo,
    resumo: row.resumo,
    igredientes: row.igredientes,
    preparo: row.preparo,
    vegano: row.vegano,
    tipo: row.tipo,
    culinária: row.culinaria,
    tempoDePreparo: row.tempoDePreparo,
    rendimento: row.rendimento,
    acessos: row.acessos,
  };
}

export async function listRecipes(includeDeleted = false) {
  const rows = await db.select().from(recipes).orderBy(desc(recipes.id));

  return rows.filter((row) => includeDeleted || !row.deleted).map(mapRow);
}

export async function getRecipeBySlug(slug: string) {
  const row = await db
    .select()
    .from(recipes)
    .where(eq(recipes.slug, slug))
    .limit(1);

  if (!row[0]) {
    return null;
  }

  return mapRow(row[0]);
}

export async function createRecipe(input: RecipeInput) {
  const current = await listRecipes(true);
  const slug = ensureUniqueSlug(
    input.slug ?? input.titulo ?? "receita",
    current,
  );

  const [row] = await db
    .insert(recipes)
    .values({
      slug,
      deleted: input.deleted ?? false,
      foto: input.foto ?? "",
      titulo: input.titulo ?? "",
      resumo: input.resumo ?? "",
      igredientes: input.igredientes ?? [],
      preparo: input.preparo ?? [],
      vegano: input.vegano ?? false,
      tipo: input.tipo ?? "",
      culinaria: input["culinária"] ?? [],
      tempoDePreparo: input.tempoDePreparo ?? "",
      rendimento: input.rendimento ?? "",
      acessos: input.acessos ?? 0,
      updatedAt: new Date(),
    })
    .returning();

  return mapRow(row);
}

export async function updateRecipeBySlug(slug: string, input: RecipeInput) {
  const current = await getRecipeBySlug(slug);
  if (!current) {
    return null;
  }

  const all = await listRecipes(true);
  const nextSlug = ensureUniqueSlug(
    input.slug ?? input.titulo ?? current.titulo,
    all,
    current.id,
  );

  const [row] = await db
    .update(recipes)
    .set({
      slug: nextSlug,
      deleted: input.deleted ?? current.deleted,
      foto: input.foto ?? current.foto,
      titulo: input.titulo ?? current.titulo,
      resumo: input.resumo ?? current.resumo,
      igredientes: input.igredientes ?? current.igredientes,
      preparo: input.preparo ?? current.preparo,
      vegano: input.vegano ?? current.vegano,
      tipo: input.tipo ?? current.tipo,
      culinaria: input["culinária"] ?? current.culinária,
      tempoDePreparo: input.tempoDePreparo ?? current.tempoDePreparo,
      rendimento: input.rendimento ?? current.rendimento,
      acessos: input.acessos ?? current.acessos,
      updatedAt: new Date(),
    })
    .where(eq(recipes.id, current.id))
    .returning();

  return mapRow(row);
}

export async function softDeleteRecipe(slug: string) {
  const current = await getRecipeBySlug(slug);
  if (!current) {
    return false;
  }

  await db
    .update(recipes)
    .set({ deleted: true, updatedAt: new Date() })
    .where(eq(recipes.id, current.id));

  return true;
}

export async function incrementRecipeAccessBySlug(slug: string) {
  const [row] = await db
    .update(recipes)
    .set({
      acessos: sql`${recipes.acessos} + 1`,
      updatedAt: new Date(),
    })
    .where(and(eq(recipes.slug, slug), eq(recipes.deleted, false)))
    .returning();

  if (!row) {
    return null;
  }

  return mapRow(row);
}
