import { NextResponse } from "next/server";
import { incrementRecipeAccessBySlug } from "../../../../../lib/recipes-repo";

type Params = {
  params: Promise<{ slug: string }>;
};

export async function POST(_: Request, { params }: Params) {
  const { slug } = await params;
  const updated = await incrementRecipeAccessBySlug(slug);

  if (!updated) {
    return NextResponse.json({ message: "Nao encontrado" }, { status: 404 });
  }

  return NextResponse.json({ acessos: updated.acessos });
}
