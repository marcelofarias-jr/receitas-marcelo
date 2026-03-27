#!/usr/bin/env node

import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Digite a senha de admin: ", async (password) => {
  if (!password) {
    console.error("❌ Senha não pode estar vazia");
    rl.close();
    process.exit(1);
  }

  if (password.length < 8) {
    console.error("⚠️ Aviso: Senha com menos de 8 caracteres é fraca.");
  }

  try {
    const hash = await bcrypt.hash(password, 12);
    const envLocalPath = path.join(process.cwd(), ".env.local");

    if (!fs.existsSync(envLocalPath)) {
      console.error("❌ Arquivo .env.local não encontrado");
      rl.close();
      process.exit(1);
    }

    let envContent = fs.readFileSync(envLocalPath, "utf-8");

    if (envContent.includes("ADMIN_PASSWORD_HASH=")) {
      envContent = envContent.replace(
        /ADMIN_PASSWORD_HASH=.*/i,
        `ADMIN_PASSWORD_HASH="${hash}"`,
      );
    } else {
      envContent += `\n# Admin Authentication\nADMIN_PASSWORD_HASH="${hash}"\n`;
    }

    if (!envContent.includes("ADMIN_USERNAME=")) {
      envContent += "ADMIN_USERNAME=admin\n";
    }

    fs.writeFileSync(envLocalPath, envContent, "utf-8");

    console.log("\n✅ Senha configurada com sucesso!\n");
    console.log("Adicione ao .env.local (se não estiver lá):");
    console.log(`ADMIN_USERNAME=admin`);
    console.log(`ADMIN_PASSWORD_HASH="${hash}"\n`);
    console.log("Reinicie o servidor Next.js para as mudanças terem efeito.");

    rl.close();
  } catch (error) {
    console.error("❌ Erro ao gerar hash:", error);
    rl.close();
    process.exit(1);
  }
});
