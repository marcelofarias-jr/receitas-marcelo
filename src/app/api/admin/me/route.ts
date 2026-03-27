import { NextResponse, NextRequest } from "next/server";
import { verifyAdminRequest } from "@/lib/auth-middleware";

export async function GET(request: NextRequest) {
  const isAdmin = await verifyAdminRequest(request);
  return NextResponse.json({ ok: isAdmin });
}
