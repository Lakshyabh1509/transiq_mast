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
