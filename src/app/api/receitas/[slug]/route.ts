import { NextResponse, NextRequest } from "next/server";
import {
  buscarReceita,
  atualizarReceita,
  deletarReceita,
} from "@/controllers/receitasController";
import {
  verifyAdminRequest,
  unauthorizedResponse,
} from "@/lib/auth-middleware";
import { broadcastUpdate } from "@/lib/updates-broadcaster";

type Params = {
  params: Promise<{ slug: string }>;
};

export async function GET(_: Request, { params }: Params) {
  const { slug } = await params;
  const result = await buscarReceita(slug);

  if (result.error) {
    return NextResponse.json(
      { error: result.error },
      { status: result.status },
    );
  }

  return NextResponse.json(result.data);
}

export async function PUT(request: NextRequest, { params }: Params) {
  const isAdmin = await verifyAdminRequest(request);

  if (!isAdmin) {
    return unauthorizedResponse(
      "Acesso negado. Autenticação de admin necessária.",
    );
  }

  const { slug } = await params;
  const payload: unknown = await request.json();
  const result = await atualizarReceita(slug, payload);

  if (result.error) {
    return NextResponse.json(
      { error: result.error },
      { status: result.status },
    );
  }

  broadcastUpdate();
  return NextResponse.json(result.data);
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const isAdmin = await verifyAdminRequest(request);

  if (!isAdmin) {
    return unauthorizedResponse(
      "Acesso negado. Autenticação de admin necessária.",
    );
  }

  const { slug } = await params;
  const result = await deletarReceita(slug);

  if (result.error) {
    return NextResponse.json(
      { error: result.error },
      { status: result.status },
    );
  }

  broadcastUpdate();
  return NextResponse.json(result.data);
}
