import { NextResponse, NextRequest } from "next/server";
import { revalidateTag, cacheTag, cacheLife } from "next/cache";
import { createRecipe, listRecipes } from "@/lib/recipes-repo";
import type { RecipeInput, RecipesData } from "@/types/recipes";
import {
  verifyAdminRequest,
  unauthorizedResponse,
} from "@/lib/auth-middleware";

async function fetchRecipesData() {
  "use cache";
  cacheTag("recipes");
  cacheLife("hours");
  return listRecipes(false);
}

export async function GET() {
  try {
    const receitas = await fetchRecipesData();
    const payload: RecipesData = {
      receitas,
      categorias: [],
      favoritos: [],
    };
    return NextResponse.json(payload);
  } catch {
    return NextResponse.json(
      { error: "Erro ao buscar receitas" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const isAdmin = await verifyAdminRequest(request);

    if (!isAdmin) {
      return unauthorizedResponse(
        "Acesso negado. Autenticação de admin necessária.",
      );
    }

    const payload = (await request.json()) as RecipeInput;
    const recipe = await createRecipe(payload);
    revalidateTag("recipes", "default");
    return NextResponse.json(recipe, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Erro ao criar receita" },
      { status: 500 },
    );
  }
}
