import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

const MAX_SIZE_BYTES = 5 * 1024 * 1024;
const uploadDir = path.join(process.cwd(), "public", "uploads");

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

export async function POST(request: Request) {
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

  await fs.mkdir(uploadDir, { recursive: true });

  const extension = getExtension(file.type, file.name);
  const baseName = safeFileName(file.name.replace(/\.[^.]+$/, ""));
  const unique = crypto.randomUUID();
  const filename = `${baseName || "receita"}-${unique}.${extension}`;
  const outputPath = path.join(uploadDir, filename);

  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(outputPath, buffer);

  return NextResponse.json({ url: `/uploads/${filename}` });
}
