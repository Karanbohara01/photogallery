# Nepal Gallery – Monorepo

This repository contains:

- `nepal-gallery-frontend/` – Next.js 16 (App Router) client.
- `nepal-gallery-backend/` – Express/MongoDB API with optional S3-compatible uploads.

## Local Development

```bash
# Backend
cd nepal-gallery-backend
cp env.example .env     # fill in secrets
npm install
npm run dev

# Frontend
cd ../nepal-gallery-frontend
cp env.example .env.local   # set NEXT_PUBLIC_API_URL=http://localhost:5000/api
npm install
npm run dev
```

## Free Hosting Plan

| Layer      | Platform | Notes |
|------------|----------|-------|
| Frontend   | Vercel   | Free tier, custom domain + SSL. |
| Backend    | Render   | Free Node web service, `render.yaml` included. |
| Database   | MongoDB Atlas | Existing free cluster works; whitelist Render IPs. |

### 1. Deploy Backend to Render

1. Push the repo to GitHub.
2. In Render, click **New > Blueprint** and select this repo – it will read `render.yaml`.
3. When prompted, add environment variables defined in `nepal-gallery-backend/env.example`.
4. Set `NEXT_PUBLIC_API_URL` in the frontend (Vercel) to the Render URL + `/api`.
5. For file uploads, keep using Backblaze B2/S3 credentials; Render’s disk is ephemeral.

`render.yaml` provisions:

- Node 20 runtime
- `npm install` then `npm run start`
- Health check at `/api/health`

### 2. Deploy Frontend to Vercel

1. Import the repo in Vercel.
2. Set **root directory** to `nepal-gallery-frontend`.
3. Define environment variables:
   - `NEXT_PUBLIC_API_URL=https://<render-app>.onrender.com/api`
4. Vercel will run `npm install` + `npm run build` automatically. No extra config needed.

### 3. Post-deploy Checklist

- Confirm `https://<render-app>.onrender.com/api/health` returns `{ "status": "ok" }`.
- Verify MongoDB Atlas network access includes Render’s outbound IPs (Settings → Networking).
- In Vercel, open the deployed site and ensure image uploads/thumbnails load via the Render API.
- Optionally connect a custom domain in Vercel and point DNS records accordingly.

## Useful Commands

| Directory | Command | Description |
|-----------|---------|-------------|
| Backend   | `npm run dev` | Watches with Nodemon. |
| Backend   | `npm run start` | Production mode, used by Render. |
| Frontend  | `npm run dev` | Next.js dev server (Turbopack). |
| Frontend  | `npm run build` | Production build locally or CI. |

## Environment Variables

- Copy `nepal-gallery-backend/env.example` to `.env` for server secrets.
- Copy `nepal-gallery-frontend/env.example` to `.env.local` for frontend config.

Keep real secrets out of version control. Use Vercel & Render dashboards to manage them in production.

