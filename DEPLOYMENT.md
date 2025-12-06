# Deployment Guide

This guide explains how to deploy the TransactIQ application.

## Prerequisites

- **Git**: For version control.
- **Node.js** (v18+): For the frontend.
- **Python** (v3.11+): For the backend.
- **PostgreSQL** (Optional, recommended for production): Database.

## Environment Setup

The application uses environment variables for configuration. **You must set these up manually** as they are not committed to the repository for security.

### Backend (`backend/.env`)

Create a file named `.env` in the `backend` directory:

```env
DATABASE_URL=postgresql://user:password@host:5432/transactiq
# OR for SQLite (Local/Dev):
# DATABASE_URL=sqlite:///./transactiq.db

REDIS_URL=redis://localhost:6379
APP_SECRET_KEY=your-production-secret-key
CORS_ORIGINS=["https://your-frontend-domain.com"]
DEBUG=false
```

### Frontend (`frontend/.env`)

Create a file named `.env` in the `frontend` directory:

```env
VITE_API_URL=https://your-backend-domain.com
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

## Local Deployment

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/Lakshyabh1509/transiq_mast.git
    cd transiq_mast
    ```

2.  **Backend Setup**:
    ```bash
    cd backend
    python -m venv venv
    # Windows:
    .\venv\Scripts\activate
    # Linux/Mac:
    # source venv/bin/activate
    
    pip install -r requirements.txt
    uvicorn app.main:app --host 0.0.0.0 --port 8000
    ```

3.  **Frontend Setup**:
    ```bash
    cd frontend
    npm install
    npm run build
    npm run preview --host
    ```

## Cloud Deployment

### Backend (e.g., Render, Railway)

1.  Connect your GitHub repository.
2.  Root Directory: `backend`
3.  Build Command: `pip install -r requirements.txt`
4.  Start Command: `uvicorn app.main:app --host 0.0.0.0 --port 10000` (Use `$PORT`)
5.  **Environment Variables**: Add all variables from `backend/.env` to the service dashboard.

### Frontend (e.g., Vercel, Netlify)

1.  Connect your GitHub repository.
2.  Root Directory: `frontend`
3.  Build Command: `npm run build`
4.  Output Directory: `dist`
5.  **Environment Variables**: Add variables from `frontend/.env` to the project settings.

## Database

- For production, use a managed PostgreSQL database (e.g., Supabase, Neon, AWS RDS).
- Update `DATABASE_URL` in the backend service configuration.

## Vercel Deployment (Full Stack)

This project is configured for Vercel.

1.  **Push to GitHub**: Ensure your repo is up to date (`api/index.py`, `vercel.json` included).
2.  **Import to Vercel**:
    - Select your repository.
    - **Framework Preset**: Vite (should detect automatically).
    - **Root Directory**: `./` (Leave default).
3.  **Environment Variables**:
    - Add these in Project Settings > Environment Variables:
    
    | Variable | Value Setup |
    |----------|-------------|
    | `DATABASE_URL` | `postgres://user:pass@host:5432/db` (From Supabase Connection String) |
    | `APP_SECRET_KEY` | Generate a strong random string |
    | `CORS_ORIGINS` | `["https://your-vercel-project.vercel.app"]` |
    | `VITE_API_URL` | `/api` (or fully qualified URL if separate) |
    | `VITE_SUPABASE_URL` | From Supabase Settings |
    | `VITE_SUPABASE_ANON_KEY` | From Supabase Settings |

### Supabase Integration

1.  Create a Supabase Project.
2.  Go to **Project Settings > Database** and get the Connection String (URI). Use this for `DATABASE_URL` in Vercel.
3.  Go to **API** settings to get URL and Key for Frontend variables.
4.  **Important**: Run the SQL scripts from `docs/SUPABASE_SETUP.md` in the Supabase SQL Editor to set up authentication tables/triggers.
5.  **Code Integration**: You MUST replace the mock authentication in `frontend/src/context/AuthContext.tsx` with result from `docs/SUPABASE_SETUP.md` (Step 6).
6.  **Login Verification Setup** (Crucial for Emails):
    - Go to Supabase Dashboard > **Authentication > URL Configuration**.
    - Set **Site URL** to your **Vercel Deployment URL** (e.g., `https://transactiq.vercel.app`).
    - Add it to **Redirect URLs** as well.
    - This ensures that when users click "Confirm Email", they are redirected to your live site, not localhost.


