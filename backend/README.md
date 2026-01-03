# Backend – API

## O que é este projeto
API Express em TypeScript responsável por autenticação, CRUD de conteúdo e endpoints administrativos/devops.

## Para quem é
Aplicações internas (admin/devops) e o site público (frontend).

## Stack
- Node.js >= 20
- Express 5.1.0
- Mongoose 8.20.0
- Zod 4.1.11
- JWT 9.0.2
- Helmet, CORS, rate-limit

## Como rodar
```bash
npm install
npm run dev
```

Outros scripts:
```bash
npm run build
npm run start
npm run hash
npm run inventory
```

## Configurações importantes
- `backend/src/config/env.ts`: validação de env com Zod.
- `backend/src/app.ts`: middlewares, CORS, rate-limit e rotas.
- `backend/src/server.ts`: bootstrap do servidor e seeds.
- `backend/api/[...path].ts`: handler serverless para Vercel.

## Lógica mais importante
- **Rotas públicas**: `backend/src/routes/public`.
- **Rotas admin**: `backend/src/routes/admin` (CRUD e autenticação).
- **Rotas devops**: `backend/src/routes/devops`.
- **Controladores e validações**: `backend/src/controllers` e `backend/src/validators`.
- **Erros e requestId**: `backend/src/middlewares/error` e `backend/src/middlewares/request-context`.

## Estrutura de pastas (resumo)
```
backend/
  api/
  src/
    config/
    controllers/
    middlewares/
    models/
    routes/
    validators/
  scripts/
  tsconfig.json
```

## Variáveis de ambiente
Veja `backend/.env.example`.
- `NODE_ENV`
- `PORT`
- `MONGODB_URI`
- `JWT_SECRET`
- `CORS_ORIGIN`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD_HASH`
- `APP_VERSION`
- `BUILD_TIME`

## Notas de manutenção
- Conexão com Mongo é reutilizada em ambiente serverless (`backend/src/config/db.ts`).
- Evite validações de env em tempo de import em outros módulos além de `env.ts`.
