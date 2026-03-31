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

## Upload de Imagens (Produção)

O upload de imagens usa o **Supabase Storage**. Para funcionar em produção (Vercel), você precisa:

### 1. Criar o bucket no Supabase

1. Acesse o [Dashboard do Supabase](https://supabase.com/dashboard)
2. Vá em **Storage** → **New bucket**
3. Nome: `uploads`
4. Marque **Public bucket** (necessário para servir as imagens)
5. Clique em **Create bucket**

### 2. Configurar política de upload

No bucket `uploads`, vá em **Policies** → **New policy** e crie:

- **Nome**: `allow-admin-insert`
- **Operação**: INSERT
- **Expressão**: `true`

> Isso permite que a rota de API (que já verificou o admin via JWT) faça uploads. O bucket é público apenas para leitura.

### 3. Obter a Service Role Key

1. No Dashboard do Supabase, vá em **Project Settings** → **API**
2. Copie a **service_role key** (seção "Project API keys")

### 4. Adicionar às variáveis de ambiente

**No `.env.local` (desenvolvimento):**

```env
SUPABASE_SERVICE_ROLE_KEY=eyJ... (cole a service_role key)
```

**No Vercel (produção):**

1. Acesse o painel do seu projeto no Vercel
2. Vá em **Settings** → **Environment Variables**
3. Adicione: `SUPABASE_SERVICE_ROLE_KEY` com o valor da service_role key

> A service*role key é um segredo — **nunca** a adicione a variáveis com prefixo `NEXT_PUBLIC*`.

---

## Avisos

⚠️ **JWT_SECRET deve ter pelo menos 32 caracteres** para máxima segurança.

⚠️ **Nunca compartilhe seu ADMIN_PASSWORD_HASH, JWT_SECRET ou SUPABASE_SERVICE_ROLE_KEY** - mantenha em local seguro.
