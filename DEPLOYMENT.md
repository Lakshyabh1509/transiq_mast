# TransactIQ Complete Deployment Guide

A step-by-step guide to deploy TransactIQ (Frontend + Backend) from start to finish.

---

## Overview

| Component | Platform | Cost |
|-----------|----------|------|
| Frontend (React/Vite) | Vercel | Free |
| Backend (FastAPI) | Render / Railway | Free |
| Authentication | Supabase Auth | Free |
| Database | Supabase PostgreSQL | Free |

---

## Part 1: Supabase Setup (Already Done ✅)

Your Supabase project:
- **Project URL**: `https://szegtjuweskhkllmdtie.supabase.co`
- **API Key**: (stored in frontend `.env`)

---

## Part 2: Deploy Backend to Render (Free)

### 2.1 Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up with GitHub

### 2.2 Create Web Service
1. Click **New +** → **Web Service**
2. Connect your GitHub repo: `Lakshyabh1509/transiq_mast`
3. Configure:

| Setting | Value |
|---------|-------|
| **Name** | `transactiq-api` |
| **Region** | Oregon (US West) or closest |
| **Branch** | `main` |
| **Root Directory** | `backend` |
| **Runtime** | Python 3 |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `uvicorn app.main:app --host 0.0.0.0 --port $PORT` |
| **Instance Type** | Free |

### 2.3 Add Environment Variables
Click **Environment** and add:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | `postgresql://postgres:[password]@db.szegtjuweskhkllmdtie.supabase.co:5432/postgres` |
| `CORS_ORIGINS` | `["https://your-vercel-frontend.vercel.app"]` |
| `APP_SECRET_KEY` | Generate: `python -c "import secrets; print(secrets.token_hex(32))"` |

> **Get DATABASE_URL from Supabase**: Dashboard → Settings → Database → Connection String (URI)

### 2.4 Deploy
1. Click **Create Web Service**
2. Wait 3-5 minutes for build
3. You'll get a URL like: `https://transactiq-api.onrender.com`

### 2.5 Test Backend
Visit: `https://your-backend.onrender.com/docs` - You should see FastAPI Swagger docs.

---

## Part 3: Deploy Frontend to Vercel

### 3.1 Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub

### 3.2 Import Project
1. Click **"Add New..."** → **Project**
2. Select repository: `Lakshyabh1509/transiq_mast`
3. Click **Import**

### 3.3 Configure Build Settings

| Setting | Value |
|---------|-------|
| **Framework Preset** | Vite |
| **Root Directory** | `frontend` ⚠️ IMPORTANT |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |

### 3.4 Add Environment Variables

| Name | Value |
|------|-------|
| `VITE_API_URL` | `https://transactiq-api.onrender.com` (your Render URL) |
| `VITE_SUPABASE_URL` | `https://szegtjuweskhkllmdtie.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6ZWd0anV3ZXNraGtsbG1kdGllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5OTk0MzQsImV4cCI6MjA4MDU3NTQzNH0.lvKtmvYDST5ngIZGOLhIrILUVxy8s9pSVQp1X2WZ5GM` |

### 3.5 Deploy
1. Click **Deploy**
2. Wait 1-2 minutes
3. Get your URL: `https://transiq-mast.vercel.app`

---

## Part 4: Configure Supabase for Production

### 4.1 Update CORS in Backend
After deploying frontend, update backend environment variable on Render:
```
CORS_ORIGINS=["https://your-frontend.vercel.app"]
```

### 4.2 Update Supabase Site URL
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. **Authentication** → **URL Configuration**
3. Set:
   - **Site URL**: `https://your-frontend.vercel.app`
   - **Redirect URLs**: Add `https://your-frontend.vercel.app/*`

---

## Part 5: Alternative - Deploy Backend to Railway

Railway is another free option with easier setup.

### 5.1 Setup
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click **New Project** → **Deploy from GitHub repo**
4. Select `Lakshyabh1509/transiq_mast`

### 5.2 Configure
1. Set **Root Directory**: `backend`
2. Railway auto-detects Python
3. Add env vars (same as Render)

### 5.3 Get URL
Railway provides a URL like: `https://transactiq-api.up.railway.app`

---

## Part 6: Alternative - All-in-One on Vercel

Deploy both frontend AND backend on Vercel using serverless functions.

### 6.1 Create API Wrapper
Create `api/index.py` in root:

```python
from app.main import app

# For Vercel serverless
handler = app
```

### 6.2 Create vercel.json in root:
```json
{
  "builds": [
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build",
      "config": { "distDir": "dist" }
    },
    {
      "src": "api/index.py",
      "use": "@vercel/python"
    }
  ],
  "routes": [
    { "src": "/api/(.*)", "dest": "api/index.py" },
    { "src": "/(.*)", "dest": "frontend/$1" }
  ]
}
```

> ⚠️ This approach has limitations (cold starts, 10s timeout). Render/Railway recommended for backend.

---

## Deployment Order Summary

```
1. Deploy Backend (Render/Railway)
   ↓
2. Get Backend URL
   ↓
3. Deploy Frontend (Vercel) with Backend URL
   ↓
4. Get Frontend URL
   ↓
5. Update Backend CORS with Frontend URL
   ↓
6. Update Supabase Site URL with Frontend URL
   ↓
7. Test Everything! ✅
```

---

## Architecture Diagram

```
┌─────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│   User Browser  │────▶│  Vercel (CDN)    │────▶│  Render/Railway  │
│                 │     │  React Frontend  │     │  FastAPI Backend │
└─────────────────┘     └────────┬─────────┘     └────────┬─────────┘
                                 │                        │
                                 ▼                        ▼
                        ┌──────────────────────────────────┐
                        │           Supabase               │
                        │  • Authentication                │
                        │  • PostgreSQL Database           │
                        └──────────────────────────────────┘
```

---

## Complete Checklist

### Backend (Render/Railway)
- [ ] Account created
- [ ] Web service configured with Root Directory = `backend`
- [ ] Environment variables added (DATABASE_URL, CORS_ORIGINS, APP_SECRET_KEY)
- [ ] Deployed and `/docs` accessible

### Frontend (Vercel)
- [ ] Account created
- [ ] Project imported with Root Directory = `frontend`
- [ ] Environment variables added (VITE_API_URL, VITE_SUPABASE_*)
- [ ] Deployed successfully

### Supabase
- [ ] Site URL updated to Vercel URL
- [ ] Redirect URLs configured
- [ ] Tested signup/login flow

---

## Environment Variables Reference

### Backend (`backend/.env` or Render/Railway dashboard)
```env
DATABASE_URL=postgresql://postgres:password@db.xxx.supabase.co:5432/postgres
CORS_ORIGINS=["https://your-frontend.vercel.app"]
APP_SECRET_KEY=your-secret-key-here
DEBUG=false
```

### Frontend (`frontend/.env` or Vercel dashboard)
```env
VITE_API_URL=https://your-backend.onrender.com
VITE_SUPABASE_URL=https://szegtjuweskhkllmdtie.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Backend build fails | Check `requirements.txt`, ensure Python version compatibility |
| CORS errors | Update `CORS_ORIGINS` env var on backend with frontend URL |
| Frontend can't reach backend | Verify `VITE_API_URL` points to correct backend URL |
| Database connection fails | Check `DATABASE_URL` format and Supabase connection pooling |
| Email confirmations broken | Update Site URL in Supabase Auth settings |
| Render free tier sleeps | First request after sleep takes ~30s (cold start) |

---

## Your URLs After Deployment

| Service | URL |
|---------|-----|
| **GitHub** | https://github.com/Lakshyabh1509/transiq_mast |
| **Supabase** | https://supabase.com/dashboard/project/szegtjuweskhkllmdtie |
| **Backend (Render)** | `https://transactiq-api.onrender.com` (after deploy) |
| **Frontend (Vercel)** | `https://transiq-mast.vercel.app` (after deploy) |

---

## Need Help?

- [Render Docs](https://render.com/docs)
- [Railway Docs](https://docs.railway.app)
- [Vercel Docs](https://vercel.com/docs)
- [Supabase Docs](https://supabase.com/docs)
- [FastAPI Deployment](https://fastapi.tiangolo.com/deployment/)
