import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import path from "path";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";
import {
  verifyAdminRequest,
  unauthorizedResponse,
} from "@/lib/auth-middleware";

const MAX_SIZE_BYTES = 5 * 1024 * 1024;
const BUCKET = "uploads";

function safeFileName(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getExtension(mimeType: string, fallbackName: string) {
  const map: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
  };

  if (map[mimeType]) {
    return map[mimeType];
  }

  const ext = path.extname(fallbackName).replace(".", "");
  return ext || "jpg";
}

export async function POST(request: NextRequest) {
  const isAdmin = await verifyAdminRequest(request);
  if (!isAdmin) {
    return unauthorizedResponse(
      "Apenas administradores podem fazer upload de imagens.",
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ message: "Arquivo invalido" }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json(
      { message: "Formato nao suportado" },
      { status: 400 },
    );
  }

  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json(
      { message: "Arquivo excede 5MB" },
      { status: 400 },
    );
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

  const isPlaceholder = !serviceRoleKey || serviceRoleKey.startsWith("cole_");
  const supabaseKey = isPlaceholder ? anonKey : serviceRoleKey;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json(
      {
        message:
          "Variáveis de ambiente do Supabase não configuradas. Defina NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY.",
      },
      { status: 500 },
    );
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const extension = getExtension(file.type, file.name);
  const baseName = safeFileName(file.name.replace(/\.[^.]+$/, ""));
  const unique = crypto.randomUUID();
  const filename = `${baseName || "receita"}-${unique}.${extension}`;

  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(filename, buffer, { contentType: file.type, upsert: false });

  if (error) {
    console.error("Supabase storage error:", error.message, error);
    const isAuthError =
      error.message.toLowerCase().includes("policy") ||
      error.message.toLowerCase().includes("unauthorized") ||
      error.message.toLowerCase().includes("jwt");
    const detail = isAuthError
      ? "Permissão negada. Configure SUPABASE_SERVICE_ROLE_KEY com a service_role key do projeto Supabase."
      : error.message;
    return NextResponse.json(
      { message: `Erro ao salvar imagem no storage: ${detail}` },
      { status: 500 },
    );
  }

  const { data: urlData } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(filename);

  return NextResponse.json({ url: urlData.publicUrl });
}
