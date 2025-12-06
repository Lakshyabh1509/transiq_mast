# TransactIQ - Vercel Deployment Guide

## Simple Frontend-Only Deployment (Recommended)

Your app uses **Supabase for authentication and database**, so you don't need a separate backend server. The frontend connects directly to Supabase.

---

## Step-by-Step Vercel Deployment

### Step 1: Push Latest Code

```bash
cd c:\Users\Lakshya\Downloads\final\mastercard
git add .
git commit -m "Configure for Vercel deployment"
git push origin main
```

### Step 2: Create Vercel Project

1. Go to **[vercel.com](https://vercel.com)** and log in with GitHub
2. Click **"Add New..."** → **"Project"**
3. Find and select: **`Lakshyabh1509/transiq_mast`**
4. Click **"Import"**

### Step 3: Configure Project Settings

| Setting | Value |
|---------|-------|
| **Framework Preset** | Other (or leave as auto-detected) |
| **Root Directory** | `.` (leave empty/default) |
| **Build Command** | `cd frontend && npm install && npm run build` |
| **Output Directory** | `frontend/dist` |

### Step 4: Add Environment Variables

Click **"Environment Variables"** and add these:

| Name | Value |
|------|-------|
| `VITE_SUPABASE_URL` | `https://szegtjuweskhkllmdtie.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6ZWd0anV3ZXNraGtsbG1kdGllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5OTk0MzQsImV4cCI6MjA4MDU3NTQzNH0.lvKtmvYDST5ngIZGOLhIrILUVxy8s9pSVQp1X2WZ5GM` |
| `VITE_API_URL` | `/api` |

### Step 5: Deploy

1. Click **"Deploy"**
2. Wait 1-2 minutes for build to complete
3. You'll get a URL like: `https://transiq-mast.vercel.app`

---

## Step 6: Configure Supabase (IMPORTANT!)

After getting your Vercel URL, update Supabase:

1. Go to **[Supabase Dashboard](https://supabase.com/dashboard)**
2. Select your project: `transactiq-v2`
3. Go to **Authentication** → **URL Configuration**
4. Update:
   - **Site URL**: `https://your-project.vercel.app`
   - **Redirect URLs**: Add `https://your-project.vercel.app/*`

> ⚠️ Without this, email confirmation links will redirect to localhost!

---

## Verification

After deployment:

1. Visit your Vercel URL
2. Go to `/signup`
3. Create an account
4. Check your email for confirmation
5. Click the link → should open your live site
6. Log in

---

## Troubleshooting

| Error | Solution |
|-------|----------|
| Build fails - can't find frontend | Make sure `vercel.json` is in the root |
| 404 on page refresh | The `rewrites` in `vercel.json` handles this |
| "NetworkError" on signup | Check environment variables are set |
| Email goes to wrong URL | Update Site URL in Supabase |

---

## Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Browser   │────▶│   Vercel    │────▶│  Supabase   │
│             │     │  (Static)   │     │  Auth + DB  │
└─────────────┘     └─────────────┘     └─────────────┘
```

**No backend server needed!** Supabase handles:
- User authentication
- Database (PostgreSQL)
- Row-level security

---

## Quick Commands

```bash
# Push changes
git add . && git commit -m "Update" && git push

# Vercel will auto-redeploy on every push to main
```

---

## Your Project URLs

| Service | URL |
|---------|-----|
| GitHub | https://github.com/Lakshyabh1509/transiq_mast |
| Supabase | https://supabase.com/dashboard/project/szegtjuweskhkllmdtie |
| Vercel | (after deploy) |
