#!/usr/bin/env node

import crypto from "crypto";
import fs from "fs";
import path from "path";

const jwtSecret = crypto.randomBytes(32).toString("hex");
const envLocalPath = path.join(process.cwd(), ".env.local");

if (!fs.existsSync(envLocalPath)) {
  console.error("❌ Arquivo .env.local não encontrado");
  process.exit(1);
}

let envContent = fs.readFileSync(envLocalPath, "utf-8");

if (envContent.includes("JWT_SECRET=")) {
  envContent = envContent.replace(
    /JWT_SECRET=.*/i,
    `JWT_SECRET="${jwtSecret}"`,
  );
} else {
  envContent += `\n# Admin Authentication\nJWT_SECRET="${jwtSecret}"\n`;
}

fs.writeFileSync(envLocalPath, envContent, "utf-8");

console.log("✅ JWT_SECRET gerado e adicionado a .env.local");
console.log(`\n🔐 JWT_SECRET: ${jwtSecret}\n`);
console.log("Reinicie o servidor Next.js para as mudanças terem efeito.");
