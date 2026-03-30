import { NextResponse, NextRequest } from "next/server";
import { revalidateTag, revalidatePath, cacheTag, cacheLife } from "next/cache";
import {
  getRecipeBySlug,
  softDeleteRecipe,
  updateRecipeBySlug,
} from "@/lib/recipes-repo";
import type { RecipeInput } from "@/types/recipes";
import {
  verifyAdminRequest,
  unauthorizedResponse,
} from "@/lib/auth-middleware";

type Params = {
  params: Promise<{ slug: string }>;
};

async function fetchRecipeData(slug: string) {
  "use cache";
  cacheTag("recipes", `recipe-${slug}`);
  cacheLife("hours");
  return getRecipeBySlug(slug);
}

export async function GET(_: Request, { params }: Params) {
  try {
    const { slug } = await params;
    const recipe = await fetchRecipeData(slug);

    if (!recipe || recipe.deleted) {
      return NextResponse.json(
        { error: "Receita não encontrada" },
        { status: 404 },
      );
    }

    return NextResponse.json(recipe);
  } catch {
    return NextResponse.json(
      { error: "Erro ao buscar receita" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    // Verificar autenticação de admin
    const isAdmin = await verifyAdminRequest(request);

    if (!isAdmin) {
      return unauthorizedResponse(
        "Acesso negado. Autenticação de admin necessária.",
      );
    }

    const { slug } = await params;
    const payload = (await request.json()) as RecipeInput;
    const updated = await updateRecipeBySlug(slug, payload);

    if (!updated) {
      return NextResponse.json(
        { error: "Receita não encontrada" },
        { status: 404 },
      );
    }

    revalidateTag("recipes", "default");
    revalidateTag(`recipe-${slug}`, "default");
    if (updated.slug !== slug) {
      revalidatePath(`/receitas/${slug}`, "page");
    }
    revalidatePath(`/receitas/${updated.slug}`, "page");
    revalidatePath("/", "page");
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "Erro ao atualizar receita" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    // Verificar autenticação de admin
    const isAdmin = await verifyAdminRequest(request);

    if (!isAdmin) {
      return unauthorizedResponse(
        "Acesso negado. Autenticação de admin necessária.",
      );
    }

    const { slug } = await params;
    const ok = await softDeleteRecipe(slug);

    if (!ok) {
      return NextResponse.json(
        { error: "Receita não encontrada" },
        { status: 404 },
      );
    }

    revalidateTag("recipes", "default");
    revalidateTag(`recipe-${slug}`, "default");
    revalidatePath(`/receitas/${slug}`, "page");
    revalidatePath("/", "page");
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Erro ao deletar receita" },
      { status: 500 },
    );
  }
}
