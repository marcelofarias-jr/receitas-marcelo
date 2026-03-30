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

    const normalizedUsername = username.trim().toLowerCase();
    const isValid = await validateAdminCredentials(
      normalizedUsername,
      password,
    );

    if (!isValid) {
      return NextResponse.json(
        { error: "Credenciais inválidas" },
        { status: 401 },
      );
    }

    const token = generateAdminToken(normalizedUsername);

    const store = await cookies();
    store.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 12,
    });

    return NextResponse.json({
      ok: true,
      message: "Login realizado com sucesso",
    });
  } catch (error) {
    console.error("Login error:", error);
    const message =
      error instanceof Error ? error.message : "Erro desconhecido";
    return NextResponse.json(
      { error: `Erro interno do servidor: ${message}` },
      { status: 500 },
    );
  }
}

export async function DELETE() {
  const store = await cookies();
  store.set("admin_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return NextResponse.json({ ok: true });
}
