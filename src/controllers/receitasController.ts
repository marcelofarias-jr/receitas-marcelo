import {
  listRecipes,
  getRecipeBySlug,
  createRecipe,
  updateRecipeBySlug,
  softDeleteRecipe,
  incrementRecipeAccessBySlug,
} from "@/lib/recipes-repo";
import type { Recipe, RecipeInput } from "@/models/Receita";
import { receitaInputSchema } from "@/models/Receita";

type ResultOk<T> = { data: T; error: null; status: number };
type ResultErr = { data: null; error: string; status: number };
export type ControllerResult<T> = ResultOk<T> | ResultErr;

function ok<T>(data: T, status = 200): ResultOk<T> {
  return { data, error: null, status };
}

function err(error: string, status: number): ResultErr {
  return { data: null, error, status };
}

export async function listarReceitas(
  apenasPublicadas = true,
): Promise<ControllerResult<Recipe[]>> {
  const todas = await listRecipes(false);
  const resultado = apenasPublicadas ? todas.filter((r) => r.publicada) : todas;
  return ok(resultado);
}

export async function buscarReceita(
  slug: string,
): Promise<ControllerResult<Recipe>> {
  const receita = await getRecipeBySlug(slug);

  if (!receita || receita.deleted) {
    return err("Receita não encontrada", 404);
  }

  return ok(receita);
}

export async function criarReceita(
  input: unknown,
): Promise<ControllerResult<Recipe>> {
  const parsed = receitaInputSchema.safeParse(input);

  if (!parsed.success) {
    const mensagem = parsed.error.issues.map((e) => e.message).join(", ");
    return err(mensagem, 422);
  }

  const receita = await createRecipe(parsed.data as RecipeInput);
  return ok(receita, 201);
}

export async function atualizarReceita(
  slug: string,
  input: unknown,
): Promise<ControllerResult<Recipe>> {
  const parsed = receitaInputSchema.partial().safeParse(input);

  if (!parsed.success) {
    const mensagem = parsed.error.issues.map((e) => e.message).join(", ");
    return err(mensagem, 422);
  }

  const atualizada = await updateRecipeBySlug(slug, parsed.data as RecipeInput);

  if (!atualizada) {
    return err("Receita não encontrada", 404);
  }

  return ok(atualizada);
}

export async function deletarReceita(
  slug: string,
): Promise<ControllerResult<{ ok: boolean }>> {
  const excluida = await softDeleteRecipe(slug);

  if (!excluida) {
    return err("Receita não encontrada", 404);
  }

  return ok({ ok: true });
}

export async function incrementarAcesso(
  slug: string,
): Promise<ControllerResult<Recipe | null>> {
  const receita = await incrementRecipeAccessBySlug(slug);
  return ok(receita);
}
