# TransactIQ Deployment Guide

Complete guide for deploying TransactIQ with Supabase authentication.

---

## 🚀 Quick Deploy to Vercel (Recommended)

### Prerequisites
- GitHub account with your repository pushed
- Vercel account (free at [vercel.com](https://vercel.com))
- Supabase project (free at [supabase.com](https://supabase.com))

### Step 1: Push to GitHub

```bash
cd c:\Users\Lakshya\Downloads\final\mastercard
git add .
git commit -m "Prepared for deployment"
git push origin main
```

### Step 2: Deploy Frontend to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

4. Add Environment Variables:

| Variable | Value |
|----------|-------|
| `VITE_SUPABASE_URL` | `https://szegtjuweskhkllmdtie.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6ZWd0anV3ZXNraGtsbG1kdGllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5OTk0MzQsImV4cCI6MjA4MDU3NTQzNH0.lvKtmvYDST5ngIZGOLhIrILUVxy8s9pSVQp1X2WZ5GM` |
| `VITE_API_URL` | `/api` (or your backend URL) |

5. Click **Deploy**

### Step 3: Configure Supabase for Production

After deployment, go to your Supabase Dashboard:

1. **Authentication → URL Configuration**:
   - **Site URL**: `https://your-project.vercel.app`
   - **Redirect URLs**: Add `https://your-project.vercel.app/*`

2. **Authentication → Email Templates** (Optional):
   - Customize confirmation email branding

---

## 📁 Project Structure

```
mastercard/
├── frontend/          # React + Vite app
│   ├── src/
│   ├── .env           # ⚠️ NOT committed (in .gitignore)
│   └── package.json
├── backend/           # FastAPI backend (optional)
│   ├── app/
│   └── requirements.txt
├── docs/              # Documentation
└── .gitignore         # Excludes .env files
```

---

## 🔐 Environment Variables

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:8000
VITE_SUPABASE_URL=https://szegtjuweskhkllmdtie.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

> ⚠️ **Never commit `.env` files!** They are in `.gitignore`.

### Backend (`backend/.env`) - If using backend
```env
DATABASE_URL=postgresql://user:password@host:5432/transactiq
REDIS_URL=redis://localhost:6379
APP_SECRET_KEY=your-secret-key
CORS_ORIGINS=["https://your-frontend.vercel.app"]
```

---

## 🧪 Local Development

### Frontend Only (with Supabase)
```bash
cd frontend
npm install
npm run dev
# Opens at http://localhost:5173
```

### Full Stack (Frontend + Backend)
```bash
# Terminal 1 - Backend
cd backend
python -m venv venv
.\venv\Scripts\activate  # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000

# Terminal 2 - Frontend
cd frontend
npm install
npm run dev
```

---

## ✅ Deployment Checklist

- [ ] `.env` files added to `.gitignore`
- [ ] Pushed code to GitHub
- [ ] Vercel project created with correct root directory (`frontend`)
- [ ] Environment variables added in Vercel dashboard
- [ ] Supabase Site URL configured for production domain
- [ ] Tested signup/login on production URL

---

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| "NetworkError" on signup | Check `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are correct |
| Email not received | Check Supabase Authentication settings, ensure email is enabled |
| Redirect to localhost | Update Site URL in Supabase to your Vercel domain |
| Build fails on Vercel | Ensure Root Directory is set to `frontend` |

---

## 📚 Resources

- [Supabase Docs](https://supabase.com/docs)
- [Vercel Docs](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
