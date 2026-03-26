import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const { username, password } = (await request.json()) as {
    username?: string;
    password?: string;
  };

  if (username !== "admin" || password !== "admin") {
    return NextResponse.json(
      { message: "Credenciais invalidas" },
      { status: 401 },
    );
  }

  const store = await cookies();
  store.set("admin_session", "ok", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12,
  });

  return NextResponse.json({ ok: true });
}
