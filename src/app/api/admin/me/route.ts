import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const store = await cookies();
  const cookie = store.get("admin_session");
  const ok = cookie?.value === "ok";

  return NextResponse.json({ ok });
}
