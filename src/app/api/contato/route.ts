import { NextRequest, NextResponse } from "next/server";
import { contactFormSchema } from "@/schemas/contact.schema";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corpo inválido." }, { status: 400 });
  }

  const result = contactFormSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: "Dados inválidos.", issues: result.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  // Aqui você pode integrar com um serviço de e-mail (Resend, Nodemailer, etc.)
  // Por enquanto, apenas registra o contato no console do servidor.
  console.log("[Contato recebido]", result.data);

  return NextResponse.json({ ok: true });
}
