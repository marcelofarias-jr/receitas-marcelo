import { NextResponse } from "next/server";
import { listRecipes } from "@/lib/recipes-repo";
import type { RecipesData } from "@/types/recipes";

export async function GET() {
  try {
    const receitas = await listRecipes(false);
    const payload: RecipesData = {
      receitas,
    };
    return NextResponse.json(payload);
  } catch {
    return NextResponse.json(
      { error: "Erro ao buscar receitas" },
      { status: 500 },
    );
  }
}
