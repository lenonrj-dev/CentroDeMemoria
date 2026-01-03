# Frontend – Site Público

## O que é este projeto
Aplicação Next.js (App Router) que renderiza o site público do acervo, com páginas de acervo, fundos, jornais, equipes e conteúdos institucionais.

## Para quem é
Usuários finais que navegam e consultam o acervo público.

## Stack
- Next.js 16.1.1
- React 19.2.3
- Tailwind CSS 4
- next-intl 4.5.8
- framer-motion 12.23.15
- lucide-react 0.544.0

## Como rodar
```bash
npm install
npm run dev
```

Outros scripts disponíveis:
```bash
npm run build
npm run start
npm run lint
npm run test
```

## Configurações importantes
- `next.config.mjs`: remotePatterns do `next/image` para Cloudinary.
- `next-intl.config.ts`: configuração de i18n do App Router.
- `frontend/lib/backend-client.ts`: cliente HTTP padrão com contrato de erro.
- `frontend/app/api/jornais/[slug]/route.ts`: proxy server-side para buscar jornal por slug.

## Lógica mais importante
- **Consumo de API**: `frontend/lib/backend-client.ts` centraliza chamadas ao backend.
- **Rotas de acervo**: `frontend/app/acervo/**` concentra páginas de listagem/leitura.
- **Conteúdo institucional**: `frontend/app/**` e `frontend/app/api/content/**`.

## Estrutura de pastas (resumo)
```
frontend/
  app/
  components/
  lib/
  public/
  next.config.mjs
```

## Variáveis de ambiente
Veja `frontend/.env.example`.
- `NEXT_PUBLIC_API_BASE_URL`

## Notas de manutenção
- Ajustes de UI principais ficam em `frontend/components` e nas seções de `frontend/app`.
- Para novas chamadas ao backend, reutilize `frontend/lib/backend-client.ts`.
