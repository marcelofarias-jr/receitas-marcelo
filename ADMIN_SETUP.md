# 🔐 Configuração de Admin

## Pré-requisitos

Você precisa configurar 3 variáveis de ambiente no `.env.local`:

1. **ADMIN_USERNAME** - Nome de usuário (sugestão: "admin")
2. **ADMIN_PASSWORD_HASH** - Hash bcrypt da senha
3. **JWT_SECRET** - Chave para gerar JSON Web Tokens

## Setup Rápido

### 1. Gerar JWT_SECRET

```bash
node scripts/setup-jwt.js
```

Este comando gera um `JWT_SECRET` aleatório e adiciona automaticamente ao `.env.local`.

### 2. Gerar Hash da Senha

Como ainda não temos um script para isso, você pode usar um gerador online:

- https://bcrypt.online/

Ou instalar `bcryptjs` globalmente e usar:

```bash
npm install -g bcryptjs
node -e "require('bcryptjs').hash('SuaSenha123!', 12, (err, hash) => console.log(hash))"
```

### 3. Adicionar ao `.env.local`

```env
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=$2a$12$... (copie o hash gerado)
JWT_SECRET=... (será automático se rodar o script)
```

## Usar

### Login

```bash
curl -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"SuaSenha123!"}'
```

Resposta:

```json
{ "ok": true, "message": "Login realizado com sucesso" }
```

### Verificar Status

```bash
curl -X GET http://localhost:3000/api/admin/me
```

Resposta:

```json
{ "ok": true }
```

Se retornar `{"ok":false}`, significa que não está autenticado.

## Avisos

⚠️ **JWT_SECRET deve ter pelo menos 32 caracteres** para máxima segurança.

⚠️ **Nunca compartilhe seu ADMIN_PASSWORD_HASH ou JWT_SECRET** - mantenha em local seguro.
