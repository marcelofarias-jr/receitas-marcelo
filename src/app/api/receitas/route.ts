import { NextResponse, NextRequest } from "next/server";
import { listarReceitas, criarReceita } from "@/controllers/receitasController";
import {
  verifyAdminRequest,
  unauthorizedResponse,
} from "@/lib/auth-middleware";
import { broadcastUpdate } from "@/lib/updates-broadcaster";

export async function GET() {
  const result = await listarReceitas(true);

  if (result.error) {
    return NextResponse.json(
      { error: result.error },
      { status: result.status },
    );
  }

  return NextResponse.json({ receitas: result.data });
}

export async function POST(request: NextRequest) {
  const isAdmin = await verifyAdminRequest(request);

  if (!isAdmin) {
    return unauthorizedResponse(
      "Acesso negado. Autenticação de admin necessária.",
    );
  }

  const payload: unknown = await request.json();
  const result = await criarReceita(payload);

  if (result.error) {
    return NextResponse.json(
      { error: result.error },
      { status: result.status },
    );
  }

  broadcastUpdate();
  return NextResponse.json(result.data, { status: 201 });
}
