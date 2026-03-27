import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET || JWT_SECRET.length < 32) {
  console.warn(
    "⚠️ JWT_SECRET não definido ou muito curto. Use uma string com mínimo 32 caracteres.",
  );
}

/**
 * Valida credenciais de admin contra variáveis de ambiente
 */
export async function validateAdminCredentials(
  username: string,
  password: string,
): Promise<boolean> {
  const env_username = process.env.ADMIN_USERNAME;
  const env_password_hash = process.env.ADMIN_PASSWORD_HASH;

  if (!env_username || !env_password_hash) {
    throw new Error("Admin credentials not configured in environment");
  }

  // Evitar timing attacks - sempre comparar mesmo que username não exista
  const isUsernameValid = username === env_username;
  const isPasswordValid = await bcrypt.compare(password, env_password_hash);

  return isUsernameValid && isPasswordValid;
}

/**
 * Gera um JWT token para sessão admin
 */
export function generateAdminToken(username: string): string {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET not configured");
  }

  return jwt.sign(
    {
      sub: username,
      type: "admin",
      iat: Math.floor(Date.now() / 1000),
    },
    JWT_SECRET,
    { expiresIn: "12h" },
  );
}

/**
 * Valida e decodifica um JWT token
 */
export function verifyAdminToken(
  token: string,
): { sub: string; type: string } | null {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET not configured");
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      sub: string;
      type: string;
    };

    if (decoded.type !== "admin") {
      return null;
    }

    return decoded;
  } catch {
    return null;
  }
}
