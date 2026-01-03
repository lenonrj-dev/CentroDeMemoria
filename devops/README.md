# DevOps – Dashboard de Operações

## O que é este projeto
Painel operacional em Next.js para acompanhar saúde, métricas, logs e inventário técnico do backend.

## Para quem é
Equipe técnica e administradores responsáveis por operação e observabilidade.

## Stack
- Next.js 16.1.1
- React 19.2.3
- Tailwind CSS 4
- framer-motion 12.23.24
- lucide-react 0.545.0

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
- Proxy para backend: `devops/app/api/backend/[...path]/route.ts`.
- Cliente HTTP: `devops/lib/api-client.ts`.
- `next.config.mjs`: `optimizePackageImports` e `typescript.ignoreBuildErrors` (build sem bloqueio por types).

## Lógica mais importante
- **Páginas de dashboard**: `devops/app/dashboard/*`.
- **Dados e métricas**: consumo via `/api/backend` para endpoints `/api/devops/*`.
- **Componentes-chave**: `devops/components` (cards, tabelas, filtros e shell).

## Estrutura de pastas (resumo)
```
devops/
  app/
  components/
  lib/
  public/
  next.config.mjs
```

## Variáveis de ambiente
Veja `devops/.env.example`.
- `NEXT_PUBLIC_API_BASE_URL`
- `NEXT_PUBLIC_BACKEND_URL`
- `BACKEND_URL`

## Notas de manutenção
- O proxy `/api/backend` elimina CORS em ambiente web.
- Ajustes visuais principais ficam em `devops/components`.
