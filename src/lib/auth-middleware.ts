import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken } from "./auth-utils";

/**
 * Middleware para validar token de admin
 * Extrai o token do header Authorization (Bearer) ou cookie
 */
export async function verifyAdminRequest(
  request: NextRequest,
): Promise<boolean> {
  try {
    // Tentar extrair token do header Authorization
    const authHeader = request.headers.get("Authorization");
    let token: string | null = null;

    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    }

    // Se não houver token no header, tentar no cookie (fallback)
    if (!token) {
      token = request.cookies.get("admin_token")?.value || null;
    }

    if (!token) {
      return false;
    }

    const decoded = verifyAdminToken(token);
    return decoded !== null;
  } catch {
    return false;
  }
}

/**
 * Função auxiliar para responder com erro de autenticação
 */
export function unauthorizedResponse(message: string = "Não autorizado") {
  return NextResponse.json({ error: message }, { status: 401 });
}
