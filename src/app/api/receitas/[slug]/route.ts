import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  getRecipeBySlug,
  softDeleteRecipe,
  updateRecipeBySlug,
} from "../../../../lib/recipes-repo";
import type { RecipeInput } from "../../../../types/recipes";

type Params = {
  params: Promise<{ slug: string }>;
};

async function requireAdmin() {
  const store = await cookies();
  const cookie = store.get("admin_session");
  return cookie?.value === "ok";
}

export async function GET(_: Request, { params }: Params) {
  const { slug } = await params;
  const recipe = await getRecipeBySlug(slug);

  if (!recipe || recipe.delete) {
    return NextResponse.json({ message: "Nao encontrado" }, { status: 404 });
  }

  return NextResponse.json(recipe);
}

export async function PUT(request: Request, { params }: Params) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ message: "Nao autorizado" }, { status: 401 });
  }

  const { slug } = await params;
  const payload = (await request.json()) as RecipeInput;
  const updated = await updateRecipeBySlug(slug, payload);
  if (!updated) {
    return NextResponse.json({ message: "Nao encontrado" }, { status: 404 });
  }
  return NextResponse.json(updated);
}

export async function DELETE(_: Request, { params }: Params) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ message: "Nao autorizado" }, { status: 401 });
  }

  const { slug } = await params;
  const ok = await softDeleteRecipe(slug);
  if (!ok) {
    return NextResponse.json({ message: "Nao encontrado" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
