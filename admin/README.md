# Admin – Dashboard de Conteúdo

## O que é este projeto
Dashboard para criação, edição e publicação de conteúdo do acervo (documentos, jornais, fotos, depoimentos, referências e rotas do site).

## Para quem é
Usuários leigos que administram o conteúdo do site, com interface guiada e validações claras.

## Stack
- Next.js 16.1.1
- React 19.2.3
- Tailwind CSS 4
- clsx 2.1.1

## Como rodar
```bash
npm install
npm run dev
```

Outros scripts:
```bash
npm run build
npm run start
npm run lint
```

## Configurações importantes
- Proxy para backend: `admin/app/api/backend/[...path]/route.ts`.
- Cliente HTTP: `admin/lib/backend-client.ts`.
- UI e formulários: `admin/components/admin/forms/*`.
- Layout e navegação: `admin/components/admin/AdminShell.tsx`.

## Lógica mais importante
- **Autenticação**: rota `/admin/login` com chamadas ao backend via proxy `/api/backend`.
- **CRUD de conteúdo**: formulários em `admin/components/admin/forms` enviam payloads para `/api/admin/*` no backend.
- **Inventário e listagens**: `admin/components/admin/module-list/*`.

## Estrutura de pastas (resumo)
```
admin/
  app/
  components/
  lib/
  public/
  next.config.mjs
```

## Variáveis de ambiente
Veja `admin/.env.example`.
- `NEXT_PUBLIC_API_BASE_URL`
- `NEXT_PUBLIC_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_PUBLIC_SITE_LOCALE`
- `NEXT_PUBLIC_BACKEND_URL`
- `BACKEND_URL`

## Notas de manutenção
- Mantenha o proxy `/api/backend` como origem única para evitar CORS.
- Campos e validações devem seguir o contrato do backend.
