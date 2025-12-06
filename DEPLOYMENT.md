# TransactIQ - Correct Vercel Deployment Guide

To fix the "No such file or directory" error, we will use Vercel's native Root Directory setting.

## Step 1: Push the Latest Changes

I have cleaned up the configuration files. Push these changes first:

```bash
cd c:\Users\Lakshya\Downloads\final\mastercard
git add .
git commit -m "Fix Vercel configuration"
git push origin main
```

## Step 2: Update Vercel Settings (CRITICAL)

Go to your project settings on Vercel and change these specific settings:

1. Click **Settings** (top menu)
2. Go to **General**
3. **Root Directory**:
   - Click "Edit"
   - Type: `frontend`
   - Click "Save"

4. **Build & Development Settings**:
   - **Framework Preset**: Vite (should auto-detect)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `dist` (default)
   - **Install Command**: `npm install` (default)
   
   *Tip: You might need to toggle "Override" off if you had custom commands before.*

## Step 3: Redeploy

1. Go to **Deployments** tab
2. Click the three dots (⋮) on the latest failed deployment
3. Click **Redeploy**
4. It should now work!

---

## Environment Variables Reminder

Ensure these are set in **Settings > Environment Variables**:

| Name | Value |
|------|-------|
| `VITE_SUPABASE_URL` | `https://szegtjuweskhkllmdtie.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | (your long key starting with eyJ...) |
| `VITE_API_URL` | `/api` |

---

## Why this fixes it:
Previously, we tried to `cd frontend` manually. Now, by setting the **Root Directory** to `frontend`, Vercel naturally starts inside that folder, so it just runs `npm run build` directly.
