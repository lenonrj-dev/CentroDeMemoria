# Sintracon – Centro de Memória

Repositório monorepo com quatro aplicações: site público (frontend), dashboard admin (admin), API backend (backend) e painel de operações (devops). O foco é preservação e gestão de acervo com publicação guiada e integração com backend.

## Índice
- [Arquitetura do repo](#arquitetura-do-repo)
- [Stack geral](#stack-geral)
- [Como rodar](#como-rodar)
- [Variáveis de ambiente](#variáveis-de-ambiente)
- [Deploy na Vercel](#deploy-na-vercel)
- [Troubleshooting](#troubleshooting)

## Arquitetura do repo
- `frontend/` – Next.js (site público)
- `admin/` – Next.js (dashboard de conteúdo)
- `backend/` – Express + TypeScript (API)
- `devops/` – Next.js (dashboard de operações)
- `scripts/` – orquestração local

## Stack geral
- Node.js >= 20
- Next.js 16.1.1 (frontend, admin, devops)
- React 19.2.3
- Express 5.1.0 (backend)
- MongoDB/Mongoose 8.20.0
- Tailwind CSS 4

## Como rodar
### Pré-requisitos
- Node.js >= 20
- npm

### Instalação
Cada app tem dependências próprias:

```bash
npm --prefix backend install
npm --prefix frontend install
npm --prefix admin install
npm --prefix devops install
```

Opcional (somente backend + devops):

```bash
npm run install:all
```

### Desenvolvimento
- Backend + DevOps juntos:

```bash
npm run dev
```

- Individualmente:

```bash
npm --prefix backend run dev
npm --prefix frontend run dev
npm --prefix admin run dev
npm --prefix devops run dev
```

### Builds
```bash
npm --prefix backend run build
npm --prefix frontend run build
npm --prefix admin run build
npm --prefix devops run build
```

## Variáveis de ambiente
Use o arquivo `.env.example` na raiz e os `.env.example` dentro de cada app como referência. Nenhum segredo é versionado.

## Deploy na Vercel
Veja `DEPLOY_VERCEL.md` para estratégia de múltiplos projetos, diretórios raiz e comandos de build.

## Troubleshooting
- **Build falhando por env ausente:** verifique os `.env.example` do app.
- **Proxy /api/backend não responde:** confira `NEXT_PUBLIC_BACKEND_URL`/`BACKEND_URL`.
- **Portas locais ocupadas:** ajuste `PORT` no backend e flags `-p` nos apps Next.
