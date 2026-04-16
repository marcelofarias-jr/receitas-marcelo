import { NextResponse, NextRequest } from "next/server";
import { listRecipes } from "@/lib/recipes-repo";
import type { RecipesData } from "@/types/recipes";
import {
  verifyAdminRequest,
  unauthorizedResponse,
} from "@/lib/auth-middleware";

export async function GET(request: NextRequest) {
  const isAdmin = await verifyAdminRequest(request);

  if (!isAdmin) {
    return unauthorizedResponse(
      "Acesso negado. Autenticação de admin necessária.",
    );
  }

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
