# Receitas do Marcelo

Site de receitas criado com Next.js (App Router) e SCSS Modules, seguindo o design system anexado.

## Como rodar

```bash
npm run dev
```

Abra http://localhost:3000 no navegador.

## Dados

As imagens usam o mapeamento em [src/data/image-map.json](src/data/image-map.json).

## Admin

Acesse http://localhost:3000/admin e use:

- Usuario: admin
- Senha: admin

## Banco de dados (PostgreSQL + Drizzle)

Configure o arquivo `.env.local` com:

```
DATABASE_URL=postgres://usuario:senha@host:5432/receitas_db
```

Comandos principais:

```bash
npm run db:generate
npm run db:migrate
```

## API

- `GET /api/receitas`
- `POST /api/receitas`
- `GET /api/receitas/{slug}`
- `PUT /api/receitas/{slug}`
- `DELETE /api/receitas/{slug}`
- `POST /api/receitas/{slug}/acessos`

## Estrutura principal

- Pagina inicial: [src/app/page.tsx](src/app/page.tsx)
- Detalhe da receita: [src/app/receitas/[slug]/page.tsx](src/app/receitas/%5Bslug%5D/page.tsx)
- Estilos globais: [src/app/globals.scss](src/app/globals.scss)
