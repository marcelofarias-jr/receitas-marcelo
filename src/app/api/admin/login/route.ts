import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { validateAdminCredentials, generateAdminToken } from "@/lib/auth-utils";

export async function POST(request: Request) {
  try {
    const { username, password } = (await request.json()) as {
      username?: string;
      password?: string;
    };

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username e password são obrigatórios" },
        { status: 400 },
      );
    }

    // Validar credenciais contra variáveis de ambiente
    const isValid = await validateAdminCredentials(username, password);

    if (!isValid) {
      // Rate limiting no frontend é recomendado também
      return NextResponse.json(
        { error: "Credenciais inválidas" },
        { status: 401 },
      );
    }

    // Gerar JWT token
    const token = generateAdminToken(username);

    // Salvar token no cookie httpOnly
    const store = await cookies();
    store.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // HTTPS only em produção
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 12, // 12 horas
    });

    return NextResponse.json({
      ok: true,
      message: "Login realizado com sucesso",
    });
  } catch {
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
