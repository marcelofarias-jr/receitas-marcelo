import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRecipe, listRecipes } from "../../../lib/recipes-repo";
import type { RecipeInput, RecipesData } from "../../../types/recipes";

async function requireAdmin() {
  const store = await cookies();
  const cookie = store.get("admin_session");
  return cookie?.value === "ok";
}

export async function GET() {
  const receitas = await listRecipes(false);
  const payload: RecipesData = {
    receitas,
    categorias: [],
    favoritos: [],
  };
  return NextResponse.json(payload);
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ message: "Nao autorizado" }, { status: 401 });
  }

  const payload = (await request.json()) as RecipeInput;
  const recipe = await createRecipe(payload);
  return NextResponse.json(recipe, { status: 201 });
}
