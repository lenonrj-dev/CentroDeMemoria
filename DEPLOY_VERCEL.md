# Deploy on Vercel

Strategy
- Multi-project deploy: frontend, admin, devops, backend.
- Each app uses its own root directory in Vercel.
- Backend runs as Vercel Serverless Functions via `backend/api/[...path].ts` (Express app handler).

Projects and roots
- Frontend: Root Directory = `frontend`
- Admin: Root Directory = `admin`
- Devops: Root Directory = `devops`
- Backend API: Root Directory = `backend`

Build commands
- Frontend: `npm run build`
- Admin: `npm run build`
- Devops: `npm run build`
- Backend: `npm run build` (optional, functions are in `backend/api`)

Required env vars
Backend (Express)
- NODE_ENV=production
- PORT=3001
- MONGODB_URI=
- JWT_SECRET=
- CORS_ORIGIN=https://frontend.example.com,https://admin.example.com,https://devops.example.com
- ADMIN_EMAIL=
- ADMIN_PASSWORD_HASH=
- APP_VERSION= (optional)
- BUILD_TIME= (optional)

Frontend (Next)
- NEXT_PUBLIC_API_BASE_URL=https://backend.example.com

Admin (Next)
- NEXT_PUBLIC_API_BASE_URL=/api/backend
- NEXT_PUBLIC_PUBLIC_SITE_URL=https://frontend.example.com
- NEXT_PUBLIC_PUBLIC_SITE_LOCALE=pt-BR
- NEXT_PUBLIC_BACKEND_URL=https://backend.example.com
- BACKEND_URL=https://backend.example.com

Devops (Next)
- NEXT_PUBLIC_API_BASE_URL=/api/backend
- NEXT_PUBLIC_BACKEND_URL=https://backend.example.com
- BACKEND_URL=https://backend.example.com

Checklist
- Set Node.js version to >= 20 for all Vercel projects.
- Configure Root Directory and Build Command per project above.
- Configure env vars per project before build.
- Build locally: `npm run build` in each app directory.
- Vercel build: run `vercel build` per project if CLI is available.
